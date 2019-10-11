var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

var novelSchema = mongoose.Schema({
  novelId: {
    type: mongoose.Schema.Types.ObjectId
  },
  status: {
    type: String,
    enum: ['waiting', 'accepted'],
    default: 'waiting'
  }
})
var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    validate: {
      validator: function (username) {
        let re = /^[a-z0-9_.-]{6,}/
        return re.test(String(username).toLowerCase())
      },
      message: 'user not valid (only accept a-z, 0-9, and _.-)'
    }
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'mod', 'user'],
    default: 'user'
  },
  nickname: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: [true, 'email required'],
    validate: {
      validator: function (email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase())
      },
      message: 'email not valid'
    }
  },
  novel: [novelSchema],
})
// user schema middleware
// hash password before store in the database
userSchema.pre('save', function (next) {
  var user = this;

  // only validate and hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // validate password
  // minimux 6 characters
  let re = /^[A-Za-z\d@$!%*#?&]{6,}$/
  if (!re.test(user.password)) return next(new Error('password not valid (min:6)'))
  // generate a salt
  bcrypt.genSalt(function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});
//compare hashed password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
//set something up
userSchema.set('timestamps', true)
userSchema.plugin(uniqueValidator, {
  message: '{PATH}MustBeUnique'
});

module.exports = mongoose.model('User', userSchema);