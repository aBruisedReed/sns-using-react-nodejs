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
      const foundUser = await userModel.findOne({ id: req.user.id });
      let info = {};
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

        info = 
          {
            id: req.user.id,
            name: req.user.displayName,
            image: req.user.photos[0].value,
            chats: [],
            events: [],
            posts: [],
            likes: []
          };
      } else {
        info = foundUser;
      }
      info = JSON.parse(JSON.stringify(info)); // to plain object
      const token = jwt.sign(info, process.env.JWT_SECRET);
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

// todo: delete this
// for test account login
router.post('/login/dev', async (req, res) => {
    try {
      req.user = req.body.user;

      const foundUser = await userModel.findOne({ id: req.user.id });
      let info = {};
      if(!foundUser) {
        var user = new userModel();
        user.id = req.user.id;
        user.name = req.user.displayName;
        user.image = req.user.image;
        user.chats = [];
        user.events = [];
        user.posts = [];
        user.likes = [];

        user.save(function(err) {
          if(err) throw err;
        })

        info = 
          {
            id: req.user.id,
            name: req.user.displayName,
            image: req.user.image,
            chats: [],
            events: [],
            posts: [],
            likes: []
          };
      } else {
        info = foundUser;
      }
      info = JSON.parse(JSON.stringify(info)); // to plain object
      const token = jwt.sign(info, process.env.JWT_SECRET);
      res.json(token);
      // res.redirect(`${process.env.CLIENT_URL}?t=${token}`);
    } catch (err) {
      throw err;
    }
}) 


module.exports = router;
