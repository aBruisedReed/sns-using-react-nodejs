const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const router = express.Router();
require('dotenv').config({ path: `${__dirname}/../../.env` });

// authentication using passport
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // process.nextTick() => 이벤트 루프의 다음 tick(차례)까지 연기
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), 
  function(req, res) {
    res.redirect('/');
  }
)

module.exports = router;
