var express = require('express');
var router = express.Router();

var Novel = require('@m/novel')
var User = require('@m/user');

//create new novel
//request param:
//  name: name of the novel
//  paticipant: {"editor":[...username],"translator":[...username]}
//  otherName: array of other name of the novel
//  description: the novel'description
//response: novel object after saving
router.post('/', async function (req, res, next) {
  try {
    let userId = res.locals.decodedToken._id;
    let name = req.body.name;
    let owner = {
      pid: userId,
      role: 'owner'
    };
    let otherName = req.body.otherName;
    let description = req.body.description;
    // because participant (editor and translator) list is array of username,
    // server must find and mapping user _id for correct participant format in novel schema
    let editorUsernameList = req.body.participant.editor;
    let translatorUsernameList = req.body.participant.translator;
    let queryEditor = User.find({
      username: {
        $in: editorUsernameList
      }
    }).exec();
    let queryTranslator = User.find({
      username: {
        $in: translatorUsernameList
      }
    }).exec();
    let editorInformationList = await queryEditor;
    let translatorInformationList = await queryTranslator;
    //mapping query data to correct participant format
    let editorParticipantList = editorInformationList.map(value => {
      return {
        pid: value._id,
        role: 'editor'
      }
    })
    let translatorParticipantList = translatorInformationList.map(value => {
      return {
        pid: value._id,
        role: 'translator'
      }
    })
    let participant = [owner, ...editorParticipantList, ...translatorParticipantList];

    let data = {
      name: name,
      participant: participant,
      otherName: otherName,
      description: description
    };
    let newNovel = new Novel(data);
    let saveNovel = await newNovel.save();

    // find user who participate in novel and set novel status in user information
    let userNovelStatus = {
      novelId: saveNovel._id,
      status: "waiting"
    }
    let queryUsers = User.updateMany({
      '_id': {
        '$in': participant.map(value => value.pid)
      },
      'novel.novelId': {
        '$ne': saveNovel._id
      }
    }, {
      '$addToSet': {
        'novel': userNovelStatus
      }
    }).exec();
    //return saved novel information
    return res.json(saveNovel)
  } catch (error) {
    if (error) return next(error)
  }
})

module.exports = router;