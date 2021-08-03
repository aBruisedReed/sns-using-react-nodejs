const express = require('express');
const router = express.Router();
const postModel = require('../config/db').postModel;
const userModel = require('../config/db').userModel;

// login session
var checkUser = function(req) {
  return true; // 임시 use session!
};
// --------------------user--------------------
// get users
router.get('/users', function(req, res, next) {
  userModel.find({}, function(err, data) {
    console.log(4);
    if(err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// --------------------post--------------------
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
  post.authorId = req.body.authorId;
  post.date = Date.now();
  post.like = 0;
  post.comments = [];

  userModel.findOne({ id: req.body.authorId }, (err, user) => {
    if(err) { throw err }
    else {
      user.posts = user.posts.concat(post._id);
      user.save((err) => {
        if(err) throw err;
      });
    }
  });

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
    postModel.findOne({ _id: id }, (err, post) => {
      if(err) { throw err; } 
      else {
        console.log('authorid',post.authorId);
        userModel.findOne({ id: post.authorId }, (err, user) => {
          if(err) { throw err; }
          else {
            console.log('before', user.posts, typeof id);
            user.posts = user.posts.filter(postId => postId != id);
            user.save((err) => {
              if(err) { throw err; }
            });
          }
        });
      }
    });

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
