var mongoose = require('mongoose');
var novelSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nameIsRequired']
    validate: {
      validator: function (name) {
        var re = /^[\w,.!?'" ]*$/;
        return re.test(name);
      },
      message: 'nameIsNotValid'
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  otherName: [{
    name: String
  }]
});
novelSchema.set('timestamp', true)
var Novel = mongoose.model('Novel', novelSchema);
module.exports = Novel;