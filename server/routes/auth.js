const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config({ path: `${__dirname}/../../.env` });

router.get('/login/google', passport.authenticate('google', { scope: ['profile'] }))
router.get(
  '/login/google/callback', 
  passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL); // no need to redirect
  }
)

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
