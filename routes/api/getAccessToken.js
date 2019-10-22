var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('@m/user');

router.post('/', async function(req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    // find user in database, after that, compare password
    let queryUser = await User.findOne({
      username: username
    })
      .select('+password')
      .exec();
    if (!queryUser) {
      let err = new Error('user not found');
      err.status = 400;
      throw err;
    }
    if (queryUser.comparePassword(password)) {
      if (queryUser.password) queryUser.password = undefined;
      let token = jwt.sign(queryUser.toJSON(), process.env.PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: Number(process.env.TOKEN_EXPIRED_TIME),
        issuer: 'shinryak'
      });
      return res
        .set({
          Authorization: 'Bearer ' + token
        })
        .json({
          token: token
        });
    }
    let err = new Error('password wrong');
    err.status = 403;
    throw err;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
