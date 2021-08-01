const express = require('express');
const router = express.Router();
require('dotenv').config({ path: `${__dirname}/../../.env` });

// db 
const moongoose = require('mongoose');
const db = moongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.uryod.mongodb.net/surn?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
const Post = new moongoose.Schema({
  author: String,
  picture: String,
  content: String,
  date: Date,
  like: Number,
  comments: Array
});
const postModel = moongoose.model('Post', Post);

// login session
var checkUser = function(req) {
  return true; // 임시
};

router.get('/', function(req, res) {
  res.send({ greeting: 'Hello React Node.js', ps: 'data from node.js' });
});

// get posts 
router.get('/posts', function(req, res, next) {
  postModel.find({}, function(err, data) {
    if(err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// get post
router.get('/posts/:id', function(req, res, next) {
  const id = req.params.id;
  postModel.find({ _id: id }, function(err, data) {
    if(err) {
      console.log('here');
      throw err;
    } else {
      res.json(data);
    }
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
  post.comments = [];

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
  const id = req.params.id
  if(checkUser(req)) {
    postModel.findOne({ _id: id }, function(err, post) {
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
  const id = req.params.id;
  if(checkUser(req)) {
    postModel.deleteOne({ _id: id }, function(err) {
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
  const id = req.params.id;
  // todo: 유저에게 like 한 포스트 리스트를 만들어서 같은 유저가 여러번 like 못하게 제한
  if(checkUser(req)) {
    postModel.findOne({ _id: id }, function(err, post) {
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

// comment add at post
router.post('/posts/:id/comments', function(req, res, next) {
  const id = req.params.id;
  if(checkUser(req)) {
    postModel.findOne({ _id: id }, function(err, post) {
      if(err) {
        throw err;
      } else {
        post.comments = post.comments.concat({ author: req.body.author, comment: req.body.comment, date: new Date() });
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

// del comment at post
router.delete('/posts/:id/comments/:idx', function(req, res, next) {
  const { id, idx } = req.params;
  if(checkUser(req)) {
    postModel.findOne({ _id: id }, function(err, post) {
      if(err) {
        throw err;
      } else {
        post.comments = post.comments.filter((comment, index) => index != idx);
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
