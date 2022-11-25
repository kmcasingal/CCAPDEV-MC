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
  bio: String,
};

const postSchema = {
  userId: String,
  title: String,
  username: String,
  post: String,
  tag: String,
  isUser: String,
  anon: String,
};

const userCommentSchema = {
  userId: String,
  mainPostId: String,
  username: String,
  comment: String,
  isUser: String,
  anon: String,
};

const User = mongoose.model("user", userSchema);
const Post = mongoose.model("post", postSchema);
const Comment = mongoose.model("comment", userCommentSchema);

let sessionValid = "false";
let userHomeId = "";
let userAccount = "";

app.get("/", (req, res) => {
  console.log("USERVALEEEEEEEEEEED: " + sessionValid);
  if(sessionValid == "true"){
    User.findOne({_id: userHomeId}, function (err, result) {
      console.log("USER: " + result);
      if (err) {
        console.log(err);
      } else {
        Post.find({}, function (err, postRows) {
          // console.log(rows)
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
 
});

app.get("/register", (req, res) => {
  res.render("register", {
    fail: "false",
  });
});

app.get("/logout", (req, res) => {
  console.log("LOGGING OUUTUTUTUUT");
  sessionValid = "false";
  res.redirect("/");
});

app.post("/createAccount", (req, res) => {

   const user = new User({
      username: req.body.regUsername, 
      password: req.body.regPassword,
   });
  console.log("REGI NAME = " +  req.body.regUsername);
  console.log("REGI PASS = " +  req.body.regPassword);

  User.findOne({username: req.body.regUsername}, function (err, result) {
    console.log("USER: " + result);
    if (err) {
      console.log(err);
    } else {
      if(result == null){
        user.save( function(err){
          if(err){
            console.log(err);
          } else {
            res.redirect("/");
          }
        });         
      } else {
        console.log("DITO");
        res.render("login", {
          fail: "false",
          failReg: "true",
          });
      }
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
        sessionValid = "true";
        userHomeId = result.id;
        userAccount = result;
        Post.find({}, function (err, postRows) {
          Comment.find({}, function (err, commentRows) {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/");
            }
          });
        });
      } else {
          res.render("login", {
            failReg: "false",
            fail: "true",
          });
        }
      }
    });
});

app.get("/search", (req, res) => {
  User.findOne({_id: userHomeId}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      Post.find({tag: req.query.searchTag}, function (err, postRows) {
        console.log("labas TAG2: " + req.query.searchTag);
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
});

app.get("/add/:userId", (req, res) => {
  if(sessionValid == "true"){
    console.log("ID PASSED: " + req.params.userId);
    User.findOne({_id: req.params.userId}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.render("createPost", {
          user: result,
        });
      }
     });
  } else {
    res.render("login", {
      fail: "false",
      });
  }
});

app.post("/save", (req, res) => {
  if(sessionValid == "true"){
    console.log("ANON TOGGLE: " + req.body.anonToggle);
    let anonToggle = ""
    if(req.body.anonToggle == "on"){
      anonToggle = "true"
    } else {
      anonToggle = "false"
    }
    
      const post = new Post({
        userId: req.body.userId,
        title: req.body.title,
        username: req.body.username, 
        post: req.body.postText,
        anon: anonToggle,
        tag: req.body.tag,
      });
  
      post.save( function(err){
        if(err){
          console.log("INSIDE RESULT1" + result);
          console.log(err);
        } else {
          User.findOne({_id: req.body.userId}, function (err, result) {
            if (err) {
              console.log("INSIDE RESULT2" + result.id);
              console.log(err);
            } else {
              Post.find({}, function (err, postRows) {
                // console.log(rows)
                Comment.find({}, function (err, commentRows) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("INSIDE RESULT99" + result);
                    res.redirect("/");
                  }
               });
              });
            }
           });
        }
      });
  } else {
    res.render("login", {
      fail: "false",
      });
  }
});

app.get('/edit/:userId', (req, res) => {
  if(sessionValid == "true"){
    const userId = req.params.userId; 
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
  } else {
    res.render("login", {
      fail: "false",
      });
  }

});

app.post('/comment/:mainPostId', (req, res) => {
  if(sessionValid == "true"){
    const mainPostId = req.params.mainPostId; 

    User.findOne({_id: userHomeId}, function (err, result) {
        if (err) {
          console.log(err);
        } 
    });

    let anonToggle = ""
    if(req.body.anonToggle == "on"){
      anonToggle = "true"
    } else {
      anonToggle = "false"
    }

    const comment = new Comment({
      mainPostId: mainPostId,
      username: userAccount.username,
      comment: req.body.cmnt,
      anon: anonToggle,
    });
   
    const query = {_id: mainPostId}
    const anonVal = req.body.anonToggle;
  
    comment.save( function(err){
      if(err){
         console.log(err);
      } else {
         res.redirect("/");
      }
    });
  
  } else {
    res.render("login", {
      fail: "false",
      });
  }

});

app.post("/update", (req, res) => {
  if(sessionValid == "true"){
    const userId = req.body.id;
    const query = {_id: userId};
    const titleVal = req.body.title;
    const postVal = req.body.postText;
    const tagVal = req.body.tag;

    let anonToggle = ""
    if(req.body.anonToggle == "on"){
      anonToggle = "true"
    } else {
      anonToggle = "false"
    }
  
    console.log("USER ID 2: " + userId);
   
    Post.updateOne( query, {title: titleVal, post: postVal, anon: anonToggle, tag: tagVal}, function(err, result){
      if(err){
        console.log(err);
      } else {
        console.log(postVal);
        res.redirect("/");
      }
    });
  } else {
    res.render("login", {
      fail: "false",
      });
  }

});

app.get('/delete/:postId', (req, res) => {
  if(sessionValid == "true"){
    const postId = req.params.postId;

    console.log("USER ID 1 DELETE: " + postId);
    Post.findByIdAndRemove( postId, function(err, result){
      Comment.deleteMany({mainPostId: postId}, function(err, result){
        if(err){
          console.log(err);
        } else {
          console.log("DELETING " + postId);
          res.redirect("/");
        }
      });
    });
  } else {
    res.render("login", {
      fail: "false",
      });
  }

});

app.get('/deleteComment/:commentId', (req, res) => {
  if(sessionValid == "true"){
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
  } else {
    res.render("login", {
      fail: "false",
      });
  }
  
});

app.get('/editComment/:commentId', (req, res) => {
  if(sessionValid == "true"){
    const commentToUpdate = req.params.commentId; 

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
  } else {
    res.render("login", {
      fail: "false",
      });
  }
});

app.post("/updateComment", (req, res) => {
  if(sessionValid == "true"){
    const userId = req.body.id;
    const query = {_id: userId};
    const commentVal = req.body.postText;

    let anonToggle = ""
    if(req.body.anonToggle == "on"){
      anonToggle = "true"
    } else {
      anonToggle = "false"
    }
  
    console.log("USER ID 2: " + userId);
   
    Comment.updateOne( query, {comment: commentVal, anon: anonToggle}, function(err, result){
      if(err){
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.render("login", {
      fail: "false",
      });
  }
  
});

app.get("/profile", (req, res) => {
  User.findOne({_id: userHomeId}, function (err, result) {
    Post.find({userId: userHomeId}, function (err, postRows) {
      console.log("------------------: " + postRows);
      Comment.find({}, function (err, commentRows) {
        if (err) {
          console.log(err);
        } else {
          res.render("profile", {
            posts: postRows,
            comments: commentRows,
            profile: result,
          });
        }
     });
    });
   });
});

app.get("/editProfile", (req, res) => {
  User.findOne({_id: userHomeId}, function (err, result) {
    console.log("USER: " + result);
    if (err) {
      console.log(err);
    } else {        
      res.render("updateInfo", {
        profile: result,
      }); 
    }
   });
});

app.post("/updateProfile", (req, res) => {
  if(sessionValid == "true"){
    User.findOne({_id: userHomeId}, function (err, result) {
      console.log("USER: " + result);
      if (err) {
        console.log(err);
      } else {        
        User.updateOne( {_id: userHomeId}, {username: req.body.username, password: req.body.password, bio: req.body.bio}, function(err, result){
          if(err){
            console.log(err);
          } else {
            res.redirect("/");
          }
        });
      }
     });
  } else {
    res.render("login", {
      fail: "false",
      });
  }
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
