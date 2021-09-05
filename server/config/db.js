require('dotenv').config({ path: `${__dirname}/../../.env` });

const mongoose = require('mongoose');
const db = mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.uryod.mongodb.net/surn?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
const Post = new mongoose.Schema({
  author: String,
  authorId: String,
  authorImg: String,
  picture: String,
  content: String,
  images: Array,
  date: Date,
  like: Number,
  comments: Array
});
const postModel = mongoose.model('Post', Post);
exports.postModel = postModel;

const User = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  chats: [{
    targetId: String,
    msgs: [{
      content: String,
      date: Date
    }]
  }],
  events: [{
    id: String,
    name: String,
    img: String,
    notiType: String,
    postId: String,
    date: Date
  }],
  posts: Array,
  likes: Array
});
const userModel = mongoose.model('User', User);
exports.userModel = userModel;
