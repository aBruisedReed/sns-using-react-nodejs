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

// post list load
router.get('/posts', function(req, res, next) {
  postModel.find({}, function(err, data) {
    res.json(data);
  });
});

// write post
router.post('/posts', function(req, res, next) {
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

// modify post
router.put('/posts/:id', function(req, res, next) {
  if(checkUser(req)) {
    postModel.findOne({ _id: req.params.id }, function(err, post) {
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

// del post
router.delete('/posts/:id', function(req, res, next) {
  if(checkUser(req)) {
    postModel.deleteOne({ _id: req.params.id }, function(err) {
      if(err) {
        throw err;
      } else {
        res.json({ status: 'SUCCESS' });
      }
    })
  }
});

// like post
router.put('/posts/:id/like', function(req, res, next) {
  // todo: 유저에게 like 한 포스트 리스트를 만들어서 여러번 like 못하게 제한
  if(checkUser(req)) {
    postModel.findOne({ _id: req.params.id }, function(err, post) {
      if(err) {
        throw err;
      } else {
        post.like = post.like+1;
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


module.exports = router;
