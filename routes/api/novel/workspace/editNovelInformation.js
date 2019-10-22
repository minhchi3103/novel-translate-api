var express = require('express');
var router = express.Router();

var User = require('@m/user');

/**
 * Edit novel information
 * @param name name of the novel
 * @param otherName array of other novel'name
 * @param description the novel'description
 * @param response novel object after modify
 */
router.post('/', async function(req, res, next) {
  try {
    let queryNovel = res.locals.novel;

    let name = req.body.name;
    let otherName = req.body.otherName;
    let description = req.body.description;

    if (name) queryNovel.name = name;
    if (otherName) queryNovel.otherName = otherName;
    if (description) queryNovel.description = description;

    let saveNovel = await queryNovel.save();
    return res.json(saveNovel);
  } catch (error) {
    next(error);
  }
});
// add more novel's participants
// params:
//  addList:{"editor":[...username],"translator":[...username]}
// response: novel participant list after add participant
router.post('/participant/add', async function(req, res, next) {
  try {
    let queryNovel = res.locals.novel;
    // because participant (editor and translator) list is array of username,
    // server must find and mapping user _id for correct participant format in novel schema
    let editorUsernameList = req.body.editor;
    let translatorUsernameList = req.body.translator;
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
      };
    });
    let translatorParticipantList = translatorInformationList.map(value => {
      return {
        pid: value._id,
        role: 'translator'
      };
    });
    let addList = [...editorParticipantList, ...translatorParticipantList];
    if (addList.length > 0) {
      queryNovel.participant.push(...(addList || addList));
      let saveNovel = await queryNovel.save();

      // find user who participate in novel and set novel status in user information
      let userNovelStatus = {
        novelId: saveNovel._id,
        status: 'waiting'
      };
      User.updateMany(
        {
          _id: {
            $in: addList.map(value => value.pid)
          },
          'novel.novelId': {
            $ne: saveNovel._id
          }
        },
        {
          $addToSet: {
            novel: userNovelStatus
          }
        }
      ).exec();
      //return participant list after add;
      return res.json(saveNovel.participant);
    }
    throw new Error('participant not valid');
  } catch (error) {
    error.status = 405;
    next(error);
  }
});
// add more novel's participants
// params:
//  removeList:[participant _id]
// notice: participant _id in novel information
// response: novel participant list after remove participant
router.post('/participant/remove', async function(req, res, next) {
  try {
    let queryNovel = res.locals.novel;
    let removeList = req.body;
    queryNovel.participant.pull(...removeList);
    let saveNovel = await queryNovel.save();
    res.json(saveNovel.participant);
  } catch (error) {
    error.status = 405;
    next(error);
  }
});
module.exports = router;
