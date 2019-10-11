var express = require('express');
var router = express.Router({
  mergeParams: true
});

var User = require('@m/user');

/** Show user info
@param username a user name you want to show info
*/
router.get('/', async function (req, res, next) {
  try {
    var queryUser = await User.findById(req.params.uid).exec();
    if (!queryUser) {
      let err = new Error('user not found');
      err.status = 404;
      throw err;
    }
    res.json(queryUser)
  } catch (error) {
    next(error);
  }
});

module.exports = router;