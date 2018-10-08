const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const userSchema = Schema({
  email: String,
  password: String,
  teamId: Number,
});

const compare = (inputPass, userPass) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(inputPass, userPass, (err, isMatch) => {
      if (err) return reject(err);
      return resolve(isMatch);
    });
  });

userSchema.statics.hash = pass =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) return reject(saltErr);
      return bcrypt.hash(pass, salt, null, (hashErr, hashed) => {
        if (hashErr) return reject(hashErr);
        return resolve(hashed);
      });
    });
  });

userSchema.methods.comparePassword = async function comparePassword(inputPass) {
  return compare(inputPass, this.password);
};

mongoose.model('User', userSchema);
