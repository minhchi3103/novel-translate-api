var Novel = require('@m/novel')

/**
 * Find novel with id in url params
 * add check if current user is novel'owner 
 * storing query novel in res.locals.novel for recycling
 */
module.exports = async function (req, res, next) {
  try {
    // Make sure middleware run only one time
    if (require('@h/mw')(__filename, req, next)) return;
    // Begin middleware process
    let novelId = req.params.novelId;
    let queryNovel = await Novel.findById(novelId).exec();
    if (queryNovel) {
      res.locals.novel = queryNovel;
      return next();
    }
    throw new Error('not found novel');
  } catch (error) {
    error.status = 404;
    next(error);
  }
}