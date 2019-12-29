var mongoose = require('mongoose');

var participantSchema = mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'pidIsRequired']
  },
  role: {
    type: String,
    enum: ['owner', 'editor', 'translator'],
    required: [true, 'roleIsRequired']
  }
});

var chapterSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'chapterNameIsRequired (novel)']
  },
  position: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  deleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  publishableRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublishableChapter'
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }
});
var volumeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'volumeNameIsRequired']
  },
  position: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  deleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  chapter: [chapterSchema]
});
var novelSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nameIsRequired'],
    validate: {
      validator: function(name) {
        var re = /^[\w,.!?'" ]/;
        return re.test(name);
      },
      message: 'nameIsNotValid'
    }
  },
  participant: [participantSchema],
  deleted: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  otherName: [
    {
      type: String
    }
  ],
  description: {
    type: String,
    default: '...'
  },
  content: [volumeSchema]
});
novelSchema.set('timestamp', true);
module.exports = mongoose.model('Novel', novelSchema);
