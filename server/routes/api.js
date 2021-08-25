const express = require('express');
const router = express.Router();
const postModel = require('../config/db').postModel;
const userModel = require('../config/db').userModel;
const authMiddleWare = require('../middelwares/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('moment/locale/ko');

// --------------------user--------------------
// get users
router.get('/users', function(req, res, next) {
  userModel.find({}, function(err, data) {
    if(err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

router.get('/users/:id', function(req, res, next) {
  const id = req.params.id;
  userModel.find({ id: id }, function(err, data) {
    if(err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

router.get('/users/:id/profile', function(req, res, next) {
  const id = req.params.id;
  userModel.find({ id: id }, function(err, data) {
    if(err) {
      throw err;
    } else {
      res.json(data[0].image);
    }
  });
});

// 해당 id 유저 모든 posts
router.get('/users/:id/posts', (req, res, next) => {
  const id = req.params.id;
  postModel.find({ authorId: id }, (err, data) => {
    if(err) { throw err; }
    else {
      res.json(data);
    }
  });
});

// --------------------post--------------------
// get posts 
router.get('/posts', async (req, res, next) => {
  // 싹 지우기 todo: for dev
  // postModel.deleteMany({}, (err) => { if(err) throw err });
  // userModel.deleteMany({}, (err) => { if(err) throw err });
  const keyword = req.query.keyword;
  try {
    if(keyword) {
      const data = await postModel.find({
        $or: [{ author: { $regex: keyword, $options: 'i' }},
          { content: { $regex: keyword, $options: 'i' }}]
      });
      res.json(data);
    } else {
      const data = await postModel.find({});
      res.json(data);
    }
  } catch (err) {
    throw err;
  }
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

// search
router.get('/posts/:keyword', async (req, res, next) => {
  const keyword = req.params.keyword;
  try {
    const foundUser = await postModel.find({ $or:[{ authorId: new RegExp(keyword) }, { content: new RegExp(keyword)}] });
    res.json(foundUser);
  } catch (err) {
    throw err;
  }
  // mongoose find multiple conditions <<
});

// write post
router.use('/posts', authMiddleWare);
router.post('/posts', function(req, res, next) {
  var post = new postModel();
  post.author = req.body.author;
  post.picture = req.body.picture;
  post.content = req.body.content;
  post.authorId = req.body.authorId;
  post.authorImg = req.body.authorImg;
  post.images = req.body.imgsUrl;
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
router.use('/posts/:id', authMiddleWare);
router.put('/posts/:id', function(req, res, next) {
  const id = req.params.id
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
});

// del post
router.use('/posts/:id', authMiddleWare);
router.delete('/posts/:id', async function(req, res, next) {
  const id = req.params.id;
  try {
    const post = await postModel.findOne({ _id: id });
    const user = await userModel.findOne({ id: post.authorId });
    user.posts = user.posts.filter(postId => postId != id);
    user.save();

    await postModel.deleteOne({ _id: id });
    res.json({ status: 'SUCCESS' });
  } catch (err) {
    throw err;
  }
});

// like post
router.use('/posts/:id/like', authMiddleWare);
router.put('/posts/:id/like', function(req, res, next) {
  const id = req.params.id;
  const isLike = req.body.isLike;
  const userId = req.decoded.id;
  // todo: 유저에게 like 한 포스트 리스트를 만들어서 같은 유저가 여러번 like 못하게 제한
  postModel.findOne({ _id: id }, function(err, post) {
    if(err) {
      throw err;
    } else {
      userModel.findOne({ id: userId }, (err, user) => {
        if(err) { throw err; }
        else {
          if(!isLike) {
            post.like = post.like+1;
            user.likes = user.likes.concat(post._id);
          } else {
            post.like = post.like-1;
            user.likes = user.likes.filter(postId => postId != id);
          }
          user.save((err) => {
            if(err) { throw err; }
          });
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
});

// comment add at post
router.use('/posts/:id/comments', authMiddleWare);
router.post('/posts/:id/comments', function(req, res, next) {
  const id = req.params.id;
  postModel.findOne({ _id: id }, function(err, post) {
    if(err) {
      throw err;
    } else {
      post.comments = post.comments.concat({ author: req.body.author, comment: req.body.comment, authorId: req.body.authorId, authorImg: req.body.authorImg, date: new Date() });
      post.save(function(err) {
        if(err) { 
          throw err;
        } else { 
          res.json({ status: 'SUCCESS' });
        }
      })
    }
  });
});

// del comment at post
router.delete('/posts/:id/comments/:idx', function(req, res, next) {
  const { id, idx } = req.params;
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
});

// --------------------file--------------------
fs.readdir('uploads', (error) => {
  if(error) {
    fs.mkdirSync('uploads');
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/files/image', upload.single('file'), (req, res, next) => {
  console.log(req.file);
  res.json({ url: `/files/image/${req.file.filename}` });
});

router.get('/files/image/:filename', (req, res) => {
  res.sendFile(req.params.filename, { root: path.join(`${__dirname}/..`, 'uploads') });
});

// --------------------chat--------------------
router.get('/users/:id/chat/:targetId', async (req, res, next) => {
  const { id, targetId } = req.params;
  try {
    const user = await userModel.findOne({ id: id });
    const target = await userModel.findOne({ id: targetId });
    const userLogs = user.chats.find((chat) => {
      if(chat.targetId === targetId) return true;
      else return false;
    }).msgs;
    const targetLogs = target.chats.find((chat) => {
      if(chat.targetId === id) return true;
      else return false;
    }).msgs;
    const usersParsed = userLogs.map(log => {
      return {
        isMe: true,
        msg: log.content,
        date: moment(log.date).fromNow(),
        realDate: log.date
      }
    })
    const targetParsed = targetLogs.map(log => {
      return {
        isMe: false,
        msg: log.content,
        date: moment(log.date).fromNow(),
        realDate: log.date
      }
    })
    const result = usersParsed.concat(targetParsed);
    result.sort((a, b) => {
      return new Date(a.realDate) - new Date(b.realDate);
    });
    res.json(result);
  } catch (err) {
    res.json([]);
    // throw err;
  }
});

module.exports = router;
