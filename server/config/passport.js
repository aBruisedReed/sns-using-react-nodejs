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

  passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => done(err, user));
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/login/google/callback'
  },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(async function() {
        try {
          let foundUser = await userModel.findOne({ id: profile.id });

          if (foundUser) {
            done(null, foundUser);
          } else {
            var user = new userModel();
            user.id = profile.id;
            user.name = profile.displayName;
            user.image = profile.photos[0].value;
            user.chats = [];
            user.events = [];
            user.posts = [];

            user.save(function(err) {
              if(err) throw err;
            })
          }
        } catch (err) {
          throw new Error('cannot make new user');
        }
        done(null, profile);
      });
    }
  ));
};
