var mongoose = require('mongoose');

var translationSchema = mongoose.Schema({
  source: String,
  dest: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'userIdIsRequired']
      },
      text: String
    }
  ],
  position: {
    type: mongoose.Schema.Types.Number,
    default: 0
  }
});
var chapterSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'chapterNameIsRequired (chapter)']
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel'
  },
  volume: {
    type: mongoose.Schema.Types.ObjectId
  },
  publishableRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublishableChapter'
  },
  content: [translationSchema]
});

module.exports = mongoose.model('Chapter', chapterSchema);
