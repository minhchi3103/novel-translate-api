var express = require('express');
var router = express.Router();

var User = require('@m/user');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let user = await User.find({}).exec();
    return res.json(user)
  } catch (error) {
    next(error)
  }
});

module.exports = router;