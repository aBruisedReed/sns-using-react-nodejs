require('dotenv').config({ path: `${__dirname}/../../.env` });

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

const User = new moongoose.Schema({
  id: String,
  name: String,
  image: String,
  chats: Array,
  events: Array,
  posts: Array
});
const userModel = moongoose.model('User', User);

exports.postModel = postModel;
exports.userModel = userModel;
