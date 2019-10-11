var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
  if (res.locals.decodedToken) res.json(res.locals.decodedToken)
  else next(new Error('no token found or token not valid'))
});

module.exports = router