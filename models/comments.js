const mongoose = require("mongoose");

const userCommentSchema = {
    userId: String,
    mainPostId: String,
    userId: String,
    username: String,
    comment: String,
    isUser: String,
    anon: String,
    edited: String,
  };

const Comment = mongoose.model("comment", userCommentSchema);
module.exports = Comment;