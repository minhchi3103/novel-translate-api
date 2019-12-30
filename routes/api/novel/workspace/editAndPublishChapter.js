var express = require('express');
var router = express.Router({ mergeParams: true });

var PublishableChapter = require('@m/publishableChapter');

/**
 * Create new publish chapter info and content
 * Only accept owner and editor
 */
router.post('/create', async function(req, res, next) {
  try {
    const queryNovel = res.locals.novel;
    const novelId = req.params.novelId;
    let chapterId = req.params.chapterId;
    let chapter = null;
    let volume = queryNovel.content.find(volume => {
      chapter = volume.chapter.find(chapter => {
        return chapter.chapterId.toString() == chapterId;
      });
      if (chapter) return true;
      else return false;
    });
    let volumeName = volume.name;
    let chapterName = chapter.name;
    let newPChapter = new PublishableChapter({
      novel: novelId,
      volumeName: volumeName,
      chapterName: chapterName
    });
    if (chapter.publishableRef) {
      PublishableChapter.findById(chapter.publishableRef, (err, pChapter) => {
        if (err) console.log(err);
        else {
          pChapter.deleted = true;
          pChapter.published = false;
          pChapter.save();
        }
      });
    }
    let queryChapter = res.locals.chapter;
    queryChapter.publishableRef = newPChapter._id; // assign Pchapter ref for chapter scheme in chapter.js
    chapter.publishableRef = newPChapter._id; // assign Pchapter ref for chapter scheme in novel.js
    let savePChapter = await newPChapter.save();
    queryNovel.save(err => (err ? console.log(err) : ''));
    queryChapter.save(err => (err ? console.log(err) : ''));
    return res.json(savePChapter);
  } catch (error) {
    next(error);
  }
});
/**
 * Get published chapter info and content
 * Only accept owner and editor
 * @param pChapterId the publishable chapter id
 */
router.get('/id/:pChapterId', async function(req, res, next) {
  try {
    const pChapterId = req.params.pChapterId;
    let queryPublishChapter = await PublishableChapter.findById(
      pChapterId
    ).exec();
    if (queryPublishChapter.deleted) {
      let err = new Error('not exist or deleted (pChapter)');
      err.status = 400;
      throw err;
    }
    return res.json(queryPublishChapter);
  } catch (error) {
    next(error);
  }
});
/**
 * Update published chapter info and content
 * Only accept owner and editor
 * @param pChapterId the publishable chapter id
 */
router.post('/id/:pChapterId', async function(req, res, next) {
  try {
    const pChapterId = req.params.pChapterId;
    const content = req.body.content;
    const published = req.body.published;
    let queryPublishChapter = await PublishableChapter.findById(
      pChapterId
    ).exec();
    if (content) queryPublishChapter.content = content;
    if (published) queryPublishChapter.published = published;
    const savePublishChapter = await queryPublishChapter.save();
    return res.json(savePublishChapter);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
