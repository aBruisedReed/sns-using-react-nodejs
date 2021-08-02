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
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/login/google/callback'
  },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        console.log(profile);
        const newUser = {
          id: profile.id,
          name: profile.displayName,
          image: profile.photos[0].value,
          chats: [],
          events: [],
          posts: []
        };
        done(null, profile);
      });
    }
  ));
};
