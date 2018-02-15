const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const userSchema = Schema({
  email: String,
  password: String,
});

const compare = (inputPass, userPass) => new Promise((resolve, reject) => {
  bcrypt.compare(inputPass, userPass, (err, isMatch) => {
    if (err) return reject(err);
    return resolve(isMatch);
  });
});

userSchema.statics.hash = pass => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return reject(err);
    return bcrypt.hash(pass, salt, null, (err, hashed) => { // eslint-disable-line
      if (err) return reject(err);
      return resolve(hashed);
    });
  });
});

userSchema.methods.comparePassword = async function comparePassword(inputPass) {
  return compare(inputPass, this.password);
};

mongoose.model('User', userSchema);
