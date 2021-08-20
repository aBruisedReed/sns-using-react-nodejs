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
  chats: Array,
  events: Array,
  posts: Array,
  likes: Array
});
const userModel = mongoose.model('User', User);
exports.userModel = userModel;

const Msg = new mongoose.Schema({
  context: String,
  data: Date
});
const Chat = new mongoose.Schema({
  fromId: String,
  toId: String,
  msgs: [Msg]
});
const chatModel = mongoose.model('Chat', Chat);
exports.chatModel = chatModel;
