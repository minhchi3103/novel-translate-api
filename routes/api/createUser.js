var express = require('express');
var router = express.Router();

var User = require('@m/user');

// route get methond
// param: username, password

router.post('/', async function (req, res, next) {
  try {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      nickname: req.body.nickname,
      email: req.body.email,
    });
    let saveUser = await newUser.save();
    res.json(saveUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;