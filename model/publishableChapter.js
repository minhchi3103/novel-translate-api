var mongoose = require('mongoose');

var publishableChapter = mongoose.Schema({
  deleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  published: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: [true, 'novelIsRequired']
  },
  volumeName: {
    type: mongoose.Schema.Types.String,
    default: '',
    required: [true, 'volumeNameIsRequired']
  },
  chapterName: {
    type: mongoose.Schema.Types.String,
    default: '',
    required: [true, 'chapterNameIsRequired']
  },
  content: {
    type: mongoose.Schema.Types.String,
    default: ''
  }
});
publishableChapter.set('timestamp', true);
module.exports = mongoose.model('PublishableChapter', publishableChapter);
