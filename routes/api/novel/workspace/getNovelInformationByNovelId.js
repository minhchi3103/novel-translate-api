var express = require('express');
var router = express.Router();

var Novel = require('@m/novel')

router.get('/', async function (req, res, next) {
  try {
    let queryNovel = res.locals.novel;
    if (!queryNovel) {
      let error = new Error('novel not found');
      error.status = 404;
      throw error;
    };
    return res.json(queryNovel);
  } catch (error) {
    next(error);
  }
})

module.exports = router;