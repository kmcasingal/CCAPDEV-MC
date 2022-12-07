const mongoose = require("mongoose");

const postSchema = {
    userId: String,
    title: String,
    username: String,
    post: String,
    tag: String,
    isUser: String,
    anon: String,
    edited: String,
    date: Date,
};
  
const Post = mongoose.model("post", postSchema);
module.exports = Post;