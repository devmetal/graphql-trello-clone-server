const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const genSalt = rounds =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(rounds, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });

const genHash = (data, salt) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(data, salt, null, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });

const compare = (inputPass, userPass) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(inputPass, userPass, (err, isMatch) => {
      if (err) return reject(err);
      return resolve(isMatch);
    });
  });

const userSchema = Schema({
  email: String,
  password: String,
  teamId: Number,
});

userSchema.statics.hash = async pass => {
  const salt = await genSalt(10);
  const hash = await genHash(pass, salt);
  return hash;
};

userSchema.methods.comparePassword = async function comparePassword(inputPass) {
  return compare(inputPass, this.password);
};

mongoose.model('User', userSchema);
