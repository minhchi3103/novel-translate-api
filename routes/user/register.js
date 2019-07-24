var express = require('express');
var router = express.Router();

var User = require('@model/User');

router.get('/', function (req, res, next) {
  console.log(req.params)
  var user = new User({
    username: req.query.username,
    password: req.query.password,
    nickname: req.query.nickname || '',
    email: req.query.email
  });
  console.log(user);
  user.save(function (err) {
    if (err) {
      next(err);
    } else res.send(user);
  });
});

module.exports = router;