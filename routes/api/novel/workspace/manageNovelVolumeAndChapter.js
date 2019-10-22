var express = require('express');
var router = express.Router();

var Chapter = require('@m/chapter');

router.get('/list', async function(req, res, next) {
  try {
    let queryContent = res.locals.novel.content;
    return res.json(queryContent);
  } catch (error) {
    next(error);
  }
});
router.post('/create-volume', async function(req, res, next) {
  try {
    let volumeName = req.body.name;
    let novelQuery = res.locals.novel;
    novelQuery.content.push({
      name: volumeName
    });
    let saveNovel = await novelQuery.save();
    return res.json(saveNovel.content.filter(value => value.deleted != true));
  } catch (error) {
    next(error);
  }
});
router.post('/volume/edit', async function(req, res, next) {
  try {
    let editTask = req.body;
    let queryNovel = res.locals.novel;
    editTask.forEach(element => {
      let volume = queryNovel.content.id(element._id);
      volume.name = element.name;
    });
    let saveNovel = await queryNovel.save();
    return res.json(saveNovel.content.filter(value => value.deleted != true));
  } catch (error) {
    next(error);
  }
});
router.post('/volume/id/:volumeId/create-chapter', async function(
  req,
  res,
  next
) {
  try {
    let queryNovel = res.locals.novel;
    let volumeId = req.params.volumeId;
    let volume = queryNovel.content.id(volumeId);
    if (!volume) throw new Error('volume not found');
    let chapter = new Chapter({
      name: req.body.name,
      novel: queryNovel._id,
      volume: volumeId
    });
    chapter.save(err => (err ? console.log(err) : null));
    volume.chapter.push({
      name: chapter.name,
      chapterId: chapter._id
    });
    await queryNovel.save();
    return res.json(volume.chapter.filter(value => value.deleted != true));
  } catch (error) {
    next(error);
  }
});
router.get('/volume/id/:volumeId/chapter/list', async function(req, res, next) {
  try {
    let queryNovel = res.locals.novel;
    let volumeId = req.params.volumeId;
    let volume = queryNovel.content.id(volumeId);
    if (!volume) throw new Error('volume not found');
    return res.json(volume.chapter.filter(value => value.deleted != true));
  } catch (error) {
    next(error);
  }
});
router.post('/volume/id/:volumeId/chapter/remove', async function(
  req,
  res,
  next
) {
  try {
    let queryNovel = res.locals.novel;
    let volumeId = req.params.volumeId;
    let volume = queryNovel.content.id(volumeId);
    if (!volume) throw new Error('volume not found');
    req.body.forEach(element => {
      let chapter = volume.chapter.id(element);
      if (chapter) {
        chapter.deleted = true;
      }
    });
    await queryNovel.save();
    return res.json(volume.chapter.filter(value => value.deleted != true));
  } catch (error) {
    next(error);
  }
});
router.post('/volume/id/:volumeId/chapter/edit', async function(
  req,
  res,
  next
) {
  try {
    let queryNovel = res.locals.novel;
    let volumeId = req.params.volumeId;
    let volume = queryNovel.content.id(volumeId);
    if (!volume) throw new Error('volume not found');
    req.body.forEach(element => {
      let chapter = volume.chapter.id(element._id);
      if (chapter) {
        chapter.name = element.name;
        chapter.position = element.position;
      }
    });
    await queryNovel.save();
    return res.json(volume.chapter.filter(value => value.deleted != true));
  } catch (error) {
    next(error);
  }
});
module.exports = router;
