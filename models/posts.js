const mongoose = require("mongoose");

const postSchema = {
    userId: String,
    title: String,
    username: String,
    post: String,
    tag: String,
    isUser: String,
    anon: String,
};
  
const Post = mongoose.model("post", postSchema);
module.exports = Post;