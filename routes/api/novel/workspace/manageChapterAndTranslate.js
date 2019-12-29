var express = require('express');
var router = express.Router();

var middleware = require('@mw/config');
/**
 * Get chapter content and information in Chapter Colection (mongo)
 */
router.get('/', async function(req, res, next) {
  try {
    return res.json(res.locals.chapter);
  } catch (error) {
    next(error);
  }
});
/**
 * Get Chapter's content: source and dest that current user translated
 */
router.get('/content', async function(req, res, next) {
  try {
    let content = res.locals.chapter.content;
    let participantId = res.locals.decodedToken._id;
    let responseData = content.map(element => {
      let dest = element.dest.find(value => value.userId == participantId);
      return {
        _id: element._id,
        source: element.source,
        dest: dest ? dest.text : '',
        position: element.position
      };
    });
    return res.json(responseData);
  } catch (error) {
    next(error);
  }
});
/**
 * View content as other person
 */
router.get('/content/view-as/:participantId', async function(req, res, next) {
  try {
    let content = res.locals.chapter.content;
    let participantId = req.params.participantId;
    let responseData = content.map(element => {
      let dest = element.dest.find(value => value.userId == participantId);
      return {
        _id: element._id,
        source: element.source,
        dest: dest ? dest.text : '',
        position: element.position
      };
    });
    return res.json(responseData);
  } catch (error) {
    next(error);
  }
});
/**
 * Create new content for translation
 * @body array of source string
 */
router.post(
  '/content',
  middleware['NovelEditorOrOwnerMiddleware'],
  async function(req, res, next) {
    try {
      let queryChapter = res.locals.chapter;
      let sourceArray = req.body;
      if (!queryChapter.content || queryChapter.content.length == 0) {
        let convertArray = sourceArray.map((value, index) => {
          return {
            position: index,
            source: value
          };
        });
        queryChapter.content.push(...convertArray);
      } else throw new Error('content not empty');
      let saveChapter = await queryChapter.save();
      return res.json(saveChapter.content);
    } catch (error) {
      next(error);
    }
  }
);
/**
 * Clear content of the chapter
 */
router.get(
  '/content/delete',
  middleware['NovelEditorOrOwnerMiddleware'],
  async function(req, res, next) {
    try {
      let queryChapter = res.locals.chapter;
      queryChapter.content = [];
      let saveChapter = await queryChapter.save();
      return res.json(saveChapter.content);
    } catch (error) {
      next(error);
    }
  }
);
/**
 * Update content feature for owner and editor
 * @body array of (_id, source, dest, position)
 * If _id is null or undefined, add new paragraph
 */
router.post(
  '/content/update',
  middleware['NovelEditorOrOwnerMiddleware'],
  async function(req, res, next) {
    try {
      let queryChapter = res.locals.chapter;
      let userId = res.locals.decodedToken._id;
      let contentArray = req.body;
      contentArray.forEach(element => {
        if (element._id) {
          let findContent = queryChapter.content.id(element._id);
          if (findContent) {
            findContent.source = element.source || '';
            findContent.position = element.position || 0;
            let findDestinationOfUser = findContent.dest.find(
              value => value.userId.toString() === userId
            );
            if (findDestinationOfUser)
              findDestinationOfUser.text = element.dest || '';
            else
              findContent.dest.push({
                userId: userId,
                text: element.dest || ''
              });
          }
        } else {
          queryChapter.content.push({
            source: element.source,
            dest: [
              {
                userId: userId,
                text: element.dest || ''
              }
            ],
            position: element.position || 0
          });
        }
      });
      let saveChapter = await queryChapter.save();
      return res.json(saveChapter.content);
    } catch (error) {
      next(error);
    }
  }
);
/**
 * Update content feature for translator
 * Only update destination (translated paragraph)
 * @body array of {_id,dest}
 */
router.post('/content/dest/update', async function(req, res, next) {
  try {
    let translationData = req.body;
    let queryChapter = res.locals.chapter;
    let userId = res.locals.decodedToken._id;
    translationData.forEach(element => {
      let findContent = queryChapter.content.id(element._id);
      if (findContent) {
        let findDestinationOfUser = findContent.dest.find(
          value => value.userId.toString() === userId
        );
        if (findDestinationOfUser)
          findDestinationOfUser.text = element.dest || '';
        else
          findContent.dest.push({
            userId: userId,
            text: element.dest || ''
          });
      }
    });
    let saveChapter = await queryChapter.save();
    return res.json(saveChapter.content);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
