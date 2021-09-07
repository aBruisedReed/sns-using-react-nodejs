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

router.get('/users/:id/name', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findOne({ id: id });
    res.json(user.name);
  } catch (err) {
    throw err;
  }
}) ;

router.get('/users/:id/profile', function(req, res, next) {
  const id = req.params.id;
  userModel.findOne({ id: id }, function(err, data) {
    if(err) {
      throw err;
    } else {
      res.json(data.image);
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
  res.json({ url: `/files/image/${req.file.filename}` });
});

router.get('/files/image/:filename', (req, res) => {
  res.sendFile(req.params.filename, { root: path.join(`${__dirname}/..`, 'uploads') });
});

// --------------------chat--------------------
const getRecentMsg = async (id, targetId) => {
  try {
    const user = await userModel.findOne({ id: id });
    const target = await userModel.findOne({ id: targetId });
    const userRecent = user.chats.find((chat) => {
      if(chat.targetId === targetId) return true;
      else return false;
    });
    const targetRecent = target.chats.find((chat) => {
      if(chat.targetId === id) return true;
      else return false;
    });
    // if((!userRecent || !targetRecent)) return null;
    if(!userRecent && targetRecent) {
      const targetRecentMsgs = targetRecent.msgs[targetRecent.msgs.length-1];
      return { content: targetRecentMsgs.content, date: targetRecentMsgs.date }
    } else if (userRecent && !targetRecent) {
      const userRecentMsgs = userRecent.msgs[userRecent.msgs.length-1];
      return { content: userRecentMsgs.content, date: userRecentMsgs.date }
    } else {
      const targetRecentMsgs = targetRecent.msgs[targetRecent.msgs.length-1];
      const userRecentMsgs = userRecent.msgs[userRecent.msgs.length-1];
      const compare = (new Date(targetRecentMsgs.date)) - (new Date(userRecentMsgs.date));
      if(compare < 0) {
        return { content: userRecentMsgs.content, date: userRecentMsgs.date }
      } else {
        return { content: targetRecentMsgs.content, date: targetRecentMsgs.date }
      }
    }
  } catch (err) {
    throw err;
  } finally {
  }
};

router.get('/users/:id/chat', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findOne({ id: id });
    let targetList = [];
    const targets =  user.chats.map(async (chat) => {
      return {
        ...( await userModel.findOne({ id: chat.targetId }))._doc,
        recent: await getRecentMsg(id, chat.targetId)
      }
    });
    Promise.all(targets)
      .then(targets => {
        const result = targets.map(target => {
          return {
            id: target.id,
            img: target.image,
            who: target.name,
            recent: target.recent.content,
            realDate: target.recent.date,
            date: moment(target.recent.date).fromNow(),
          }
        }).sort((a, b) => {
          return new Date(a.realDate) - new Date(b.realDate);
        }); 
        res.json(result);
      });
  } catch (err) {
    throw err;
  }
});
router.get('/users/:id/chat/:targetId', async (req, res, next) => {
  const { id, targetId } = req.params;
  try {
    const user = await userModel.findOne({ id: id });
    const target = await userModel.findOne({ id: targetId });
    const userLogsFind = user.chats.find((chat) => {
      if(chat.targetId === targetId) return true;
      else return false;
    });
    const targetLogsFind = target.chats.find((chat) => {
      if(chat.targetId === id) return true;
      else return false;
    });
    const userLogs = userLogsFind ? userLogsFind.msgs : null;
    const targetLogs = targetLogsFind ? targetLogsFind.msgs : null;
    const usersParsed = userLogs ? userLogs.map(log => {
      return {
        isMe: true,
        msg: log.content,
        date: moment(log.date).fromNow(),
        realDate: log.date
      }
    }) : null;
    const targetParsed = targetLogs ? targetLogs.map(log => {
      return {
        isMe: false,
        msg: log.content,
        date: moment(log.date).fromNow(),
        realDate: log.date
      }
    }) : null;
    let result = null;
    if(!usersParsed || !targetParsed) {
      if(usersParsed) {
        result = usersParsed;
      } else if(targetParsed) {
        result = targetParsed;
      }
    } else  {
      result = usersParsed.concat(targetParsed);
    }
    if(result) {
      result.sort((a, b) => {
        return new Date(a.realDate) - new Date(b.realDate);
      });
    } 
    res.json(result);
  } catch (err) {
    // console.log(err);
    res.json([]);
    // throw err;
  }
});
// --------------------notification--------------------
router.get('/users/:id/noti', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({ id: id });
    // console.log(user.events, 'userevents');
    res.json(user.events);
  } catch (err) {
    throw err;
  }
});
router.use('/users/:id/noti', authMiddleWare);
router.delete('/users/:id/noti', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({ id: id });
    user.events = [];
    await user.save();
    res.json({ status: 'SUCCESS' });
  } catch (err) {
    throw err;
  }
});

// --------------------dev--------------------
// router.get('/dev/init', async (req, res) => { // db docs 초기화
//   try {
//     postModel.deleteMany({}, (err) => { if(err) throw err });
//     userModel.deleteMany({}, (err) => { if(err) throw err });
//     res.json({ status: 'SUCCESS' });
//   } catch (e) {
//     [> handle error <]
//   }
// })
module.exports = router;
