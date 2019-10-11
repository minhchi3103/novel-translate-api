var Chapter = require('@m/chapter')
module.exports = async function (req, res, next) {
  try {
    // Make sure middleware run only one time
    if (require('@h/mw')(__filename, req, next)) return;
    // Begin middleware process
    let queryChapter = await Chapter.findById(req.params.chapterId);
    if (queryChapter && queryChapter.novel == res.locals.novel._id) {
      res.locals.chapter = queryChapter;
      return next();
    }
    if (queryChapter) throw new Error('chapter permission (not match novel)');
    throw new Error('chapter not found');
  } catch (error) {
    next(error);
  }
}