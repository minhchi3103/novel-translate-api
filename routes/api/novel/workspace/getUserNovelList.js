var express = require('express');
var router = express.Router();

var Novel = require('@m/novel');
var User = require('@m/user')

router.get('/', async function (req, res, next) {
  try {
    let queryUser = await User.findById(res.locals.decodedToken._id);
    let novelIdList = queryUser.novel.map(value => value.novelId);
    let queryNovelList = await Novel.find({
      _id: {
        $in: novelIdList
      }
    }).select('-content').exec();
    return res.json(queryNovelList);
  } catch (error) {
    next(error);
  }
})

module.exports = router;