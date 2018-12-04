const mongoose = require('mongoose');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const jwt = require('jwt-simple');

const secret = 'dmasédmasdfdsfsfds';
const UserModel = mongoose.model('User');

const { ExtractJwt, Strategy } = passportJwt;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(params, (payload, done) => {
  const { id } = payload;
  UserModel.findById(id, (err, res) => {
    if (err) return done(err, null);
    if (res) return done(null, res);
    return done(new Error('User Not Found'), null);
  });
});

passport.use(strategy);

module.exports = {
  initialize() {
    return passport.initialize();
  },
  authenticate(cb) {
    return passport.authenticate('jwt', { session: false }, cb);
  },
  async findUserByToken(token) {
    try {
      const payload = jwt.decode(token, secret);
      if (!payload) {
        throw new Error('Invalid token');
      }

      const { id } = payload;
      const user = await UserModel.findById(id);

      if (!user) {
        throw new Error('Invalid token');
      }

      return user;
    } catch (e) {
      throw new Error('Invalid token');
    }
  },
  async createToken({ email, password }) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const match = await user.comparePassword(password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    return jwt.encode(payload, secret);
  },
};
