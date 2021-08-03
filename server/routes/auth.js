const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: `${__dirname}/../../.env` });

router.get('/login/google', passport.authenticate('google', { scope: ['profile'] }))
router.get(
  '/login/google/callback', 
  passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
  (req, res) => {
    const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET);
    res.redirect(`${process.env.CLIENT_URL}?t=${token}`); 
  }
)

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

router.get('/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  }
});

module.exports = router;
