var express = require('express');
var router = express.Router();

var User = require('@model/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/:username', function (req, res, next) {
  var user = User.findOne({
    username: req.params.username
  }).exec(function (err, result) {
    res.send(result);
  })
})
module.exports = router;