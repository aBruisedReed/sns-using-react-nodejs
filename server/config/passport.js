const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const userModel = require('../config/db').userModel;
require('dotenv').config({ path: `${__dirname}/../../.env` });

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    userModel.findOne({ id: user.id }, (err, user) => done(err, user));
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/login/google/callback'
  },
    async function(accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  ));
};
