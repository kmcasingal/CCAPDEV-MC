const User = require("../models/users")
const Post = require("../models/posts")
const Comment = require("../models/comments")

const indexPage = (req, res) => {
    if (req.isAuthenticated()) {
        User.findOne({_id: req.user.id}, function (err, result) {
          //console.log("USER: " + result);
          if (err) {
            console.log(err);
          } else {
            Post.find({}, function (err, postRows) {
              //console.log(rows)
              Comment.find({}, function (err, commentRows) {
                if (err) {
                  console.log(err);
                } else {
                  res.render("index", {
                    posts: postRows,
                    comments: commentRows,
                    user: result,
                  });
                }
             });
            });
          }
         });
      } else {
         res.render("login", {
          failReg: "false",
          fail: "false",
         });
      }
}

module.exports = {
    indexPage
}