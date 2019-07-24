var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'userAlreadyExist']
  },
  password: {
    type: String,
    min: [6, 'passwordTooShort'],
    select: false,
    required: [true, 'passwordIsRequired']
  },
  nickname: String,
  email: {
    type: String,
    required: [true, 'emailIsRequired'],
    validate: {
      validator: function (email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase())
      },
      message: 'emailIsNotValid'
    }
  }
})
userSchema.set('timestamps', true)
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.log(doc)
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});
userSchema.plugin(uniqueValidator, {
  message: '{PATH}MustBeUnique'
});
var User = mongoose.model('User', userSchema);

module.exports = User;