const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/anonx");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

const userSchema = {
  username: String,
  password: String,
};

const postSchema = {
  username: String,
  post: String,
  tag: String,
  isUser: String,
  anon: String,
  commenter: Array,
  comment: Array,
};

const userCommentSchema = {
  mainPostId: String,
  username: String,
  comment: String,
  isUser: String,
  anon: String,
};

const User = mongoose.model("user", userSchema);
const Post = mongoose.model("post", postSchema);
const Comment = mongoose.model("comment", userCommentSchema);

app.get("/", (req, res) => {
  Post.find({}, function (err, postRows) {
    // console.log(rows)
    Comment.find({}, function (err, commentRows) {
      
      if (err) {
        console.log(err);
      } else {
        res.render("index", {
          posts: postRows,
          comments: commentRows
        });
      }
   });
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    fail: "false",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
  });
});

app.post("/createAccount", (req, res) => {
  const user = new User({
    username: req.body.username, 
    password: req.body.password,
  });
 // console.log( req.body.anonToggle);
 user.save( function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/verifyLogin", (req, res) => {
  console.log("USERNAME: " + req.body.username);
  console.log("PASSWORD: " + req.body.password);
  User.findOne( {username: req.body.username, password: req.body.password}, function(err, result){
    if(err){
      console.log(err);
    } else {
      if(result != null){
         Post.find({}, function (err, postRows) {
         // console.log(rows)
         Comment.find({}, function (err, commentRows) {
          if (err) {
            console.log(err);
          } else {
            res.render("index", {
              posts: postRows,
              comments: commentRows
            });
          }
         });
        });
      } else {
        res.render("login", {
          fail: "true",
        });
      }
    }
  });
});


app.get("/add", (req, res) => {
  res.render("createPost", {
  });
});

app.post("/save", (req, res) => {
    const post = new Post({
      username: "DLSUaccount", // temporaryyyyy username -- wala pang login
      post: req.body.postText,
      isUser: "true",
      anon: req.body.anonToggle,
      tag: req.body.tag,
    });
   // console.log( req.body.anonToggle);
    post.save( function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
});

app.get('/edit/:userId', (req, res) => {
  const userId = req.params.userId; // change to let if nagkamali

  console.log("USER ID 1: " + userId);
  Post.find( {_id: userId}, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log("RESULT" + result[0]);
      res.render("updatePost", {
        posts: result[0],
      });
    }
  });
});

app.post('/comment/:userId', (req, res) => {
  const userId = req.params.userId; // change to let if nagkamali

  const comment = new Comment({

    mainPostId: userId,
    username: "DLSUaccount",
    comment: req.body.cmnt,
    isUser: "true",
    anon: req.body.anonToggle,
  });

  console.log("USER ID 1: " + userId);

      console.log("RESULT PO: " + req.params.userId);

      const query = {_id: userId}
      const anonVal = req.body.anonToggle;
      let commenterVal = "user";

      console.log("ANON VAAAAAAAAAL: " + anonVal);

      if(anonVal == "true"){
        commenterVal = "userAnon";
      } 

      comment.save( function(err){
        if(err){
          console.log(err);
        } else {
          res.redirect("/");
        }
      });

});

app.post("/update", (req, res) => {
  const userId = req.body.id;
  const query = {_id: userId};
  const postVal = req.body.postText;
  const isUserVal = "true";
  const anonVal = req.body.anonToggle;
  const tagVal = req.body.tag;

  console.log("USER ID 2: " + userId);
 
  Post.updateOne( query, {post: postVal, isUser: isUserVal, anon: anonVal, tag: tagVal}, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log(postVal);
      res.redirect("/");
    }
  });
});

app.get('/delete/:userId', (req, res) => {
  const userId = req.params.userId;

  console.log("USER ID 1 DELETE: " + userId);
  Post.findByIdAndRemove( userId, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log("DELETING " + userId);
      res.redirect("/");
    }
  });
});

app.get('/deleteComment/:commentId', (req, res) => {
  const commentToDelete = req.params.commentId;

  console.log("USER ID 1 DELETE: " + commentToDelete);
  Comment.findByIdAndRemove( commentToDelete, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log("DELETING " + commentToDelete);
      res.redirect("/");
    }
  });
});

app.get('/editComment/:commentId', (req, res) => {
  const commentToUpdate = req.params.commentId; // change to let if nagkamali

  console.log("USER ID 1: " + req.params.commentId);
  Comment.find( {_id: commentToUpdate}, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log("RESULT:" + result[0].id);
      res.render("updateComment", {
        comment: result[0],
      });
    }
  });
});

app.post("/updateComment", (req, res) => {
  const userId = req.body.id;
  const query = {_id: userId};
  const commentVal = req.body.postText;
  const isUserVal = "true";
  const anonVal = req.body.anonToggle;

  console.log("USER ID 2: " + userId);
 
  Comment.updateOne( query, {comment: commentVal, isUser: isUserVal, anon: anonVal}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});


app.listen(3000, function () {
  console.log("server started on port 3000");
});
