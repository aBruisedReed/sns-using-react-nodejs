var express = require('express');
var router = express.Router();

// db setting 
var moongoose = require('mongoose');
var dbconfig = require('../../.config/db-config.json');
var db = moongoose.connect(`mongodb+srv://${dbconfig.username}:${dbconfig.password}@cluster1.uryod.mongodb.net/surn?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
var Post = new moongoose.Schema({
  author: String,
  picture: String,
  content: String,
  date: Date,
  like: Number,
  commments: Array
});
var postModel = moongoose.model('Post', Post);

// login session
var checkUser = function(req) {
  return true; // 임시
};

router.get('/', function(req, res) {
  res.send({ greeting: 'Hello React Node.js', ps: 'data from node.js' });
});

router.post('/write', function(req, res, next) {
  var post = new postModel();
  post.author = req.body.author;
  post.picture = req.body.picture;
  post.content = req.body.content;
  post.date = Date.now();
  post.like = 0;
  post.commments = [];

  post.save(function (err) {
    if(err) {
      throw err;
    } else {
      res.json({ status: 'SUCCESS' });
    }
  });
});

router.post('/modify', function(req, res, next) {
  if(checkUser(req)) {
    postModel.findOne({ _id: req.body._id }, function(err, post) {
      if(err) {
        throw err;
      } else {
        post.content = req.body.content;
        post.save(function(err) {
          if(err) { 
            throw err;
          } else { 
            res.json({ status: 'SUCCESS' });
          }
        })
      }
    });
  }
});

router.get('/load', function(req, res, next) {
  postModel.find({}, function(err, data) {
    res.json(data);
  });
});

module.exports = router;
