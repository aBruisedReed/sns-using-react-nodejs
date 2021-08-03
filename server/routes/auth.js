const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userModel = require('../config/db').userModel;

require('dotenv').config({ path: `${__dirname}/../../.env` });

router.get('/login/google', passport.authenticate('google', { scope: ['profile'] }))
router.get(
  '/login/google/callback', 
  passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
  async (req, res) => {
    try {
      console.log(1);
      const foundUser = await userModel.findOne({ id: req.user.id });
      console.log('founduser', foundUser);
      if(!foundUser) {
        var user = new userModel();
        user.id = req.user.id;
        user.name = req.user.displayName;
        user.image = req.user.photos[0].value;
        user.chats = [];
        user.events = [];
        user.posts = [];
        user.likes = [];

        user.save(function(err) {
          if(err) throw err;
        })
      }
      console.log(2);

      const token = jwt.sign(
        {
          id: req.user.id,
          name: req.user.displayName,
          image: req.user.photos[0].value,
        },
        process.env.JWT_SECRET);
      console.log(3);
      res.redirect(`${process.env.CLIENT_URL}?t=${token}`); 
    } catch (err) {
      throw err;
    }
  }
)

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

router.get('/check', (req, res) => {
  
});


module.exports = router;
