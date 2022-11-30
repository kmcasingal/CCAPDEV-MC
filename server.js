require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

mongoose.connect("mongodb+srv://user:123@cluster0.dg9qzin.mongodb.net/anonx");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use(
  session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  bio: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


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
  userId: String,
  username: String,
  comment: String,
  isUser: String,
  anon: String,
};

const Post = mongoose.model("post", postSchema);
const Comment = mongoose.model("comment", userCommentSchema);

app.get("/", (req, res) => {

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
 
});

app.get("/logout", (req, res) => {
  req.logout(function(err){
    if (err){ }
    res.redirect("/");
  });
});

app.post("/createAccount", (req, res) => {

  User.register(
    { username: req.body.regUsername },
    req.body.regPassword,
    function (err, user) {
      console.log("username: " + req.body.regUsername);
      if (err) {
        console.log("error: " + err);
        res.render("login", {
          failReg: "true",
          fail: "false",
         });
      } else {
        res.redirect("/");
      }
    }
  );
});

app.post("/verifyLogin", (req, res) => {
  
  const user = new User({
    username: req.body.regUsername,
    password: req.body.regPassword,
  });

  req.login(user, function (err) {
    if (err) {
      console.log("didnt go in");
      console.log(err);
      res.render("login", {
        failReg: "false",
        fail: "true",
      });
    } else {
      passport.authenticate("local",  { failureRedirect: '/' })(req, res, function () {
        res.redirect("/");
      });
    }
  });

});

app.get("/search", (req, res) => {
  if (req.isAuthenticated()) {
  User.findOne({_id: req.user.id}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      Post.find({tag: req.query.searchTag}, function (err, postRows) {
        //console.log("labas TAG2: " + req.query.searchTag);
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
    res.redirect("/");
  }
});

app.get("/add/:userId", (req, res) => {
  if (req.isAuthenticated()) {
    //console.log("ID PASSED: " + req.params.userId);
    User.findOne({_id: req.params.userId}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        //console.log(result);
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
  if (req.isAuthenticated()) {

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
  
      post.save(function(err){
        if(err){
          //console.log("INSIDE RESULT1" + result);
          console.log(err);
        } else {
          User.findOne({_id: req.body.userId}, function (err, result) {
            if (err) {
              //console.log("INSIDE RESULT2" + result.id);
              console.log(err);
            } else {
              Post.find({}, function (err, postRows) {
                // console.log(rows)
                Comment.find({}, function (err, commentRows) {
                  if (err) {
                    console.log(err);
                  } else {
                    //console.log("INSIDE RESULT99" + result);
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
  if (req.isAuthenticated()) {
    const userId = req.params.userId; 
    //console.log("USER ID 1: " + userId);
    Post.find( {_id: userId}, function(err, result){
      if(err){
        console.log(err);
      } else {
        //console.log("RESULT" + result[0]);
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
  if (req.isAuthenticated()) {
    const mainPostId = req.params.mainPostId; 

    User.findOne({_id: req.user.id}, function (err, result) {
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
      username: req.user.username,
      userId: req.user.id,
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
  if (req.isAuthenticated()) {
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
  
    //console.log("USER ID 2: " + userId);
   
    Post.updateOne( query, {title: titleVal, post: postVal, anon: anonToggle, tag: tagVal}, function(err, result){
      if(err){
        console.log(err);
      } else {
        //console.log(postVal);
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
  if (req.isAuthenticated()) {
    const postId = req.params.postId;

    //console.log("USER ID 1 DELETE: " + postId);
    Post.findByIdAndRemove( postId, function(err, result){
      Comment.deleteMany({mainPostId: postId}, function(err, result){
        if(err){
          console.log(err);
        } else {
          //console.log("DELETING " + postId);
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
  if (req.isAuthenticated()) {
    const commentToDelete = req.params.commentId;

    //console.log("USER ID 1 DELETE: " + commentToDelete);
    Comment.findByIdAndRemove( commentToDelete, function(err, result){
      if(err){
        console.log(err);
      } else {
        //console.log("DELETING " + commentToDelete);
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
  if (req.isAuthenticated()) {
    const commentToUpdate = req.params.commentId; 

    //console.log("USER ID 1: " + req.params.commentId);
    Comment.find( {_id: commentToUpdate}, function(err, result){
      if(err){
        console.log(err);
      } else {
        //console.log("RESULT:" + result[0].id);
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
  if (req.isAuthenticated()) {
    const userId = req.body.id;
    const query = {_id: userId};
    const commentVal = req.body.postText;

    let anonToggle = ""
    if(req.body.anonToggle == "on"){
      anonToggle = "true"
    } else {
      anonToggle = "false"
    }
  
    //console.log("USER ID 2: " + userId);
   
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
  if (req.isAuthenticated()) {
  User.findOne({_id: req.user.id}, function (err, result) {
    Post.find({userId: req.user.id}, function (err, postRows) {
      //console.log("------------------: " + postRows);
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
  } else {
    res.redirect("/");
  }
});

app.get("/editProfile", (req, res) => {
  if (req.isAuthenticated()) {

  User.findOne({_id: req.user.id}, function (err, result) {
    //console.log("USER: " + result);
    if (err) {
      console.log(err);
    } else {        
      res.render("updateInfo", {
        message: "Edit account information",
        profile: result,
      }); 
    }
   });
  } else {
    res.redirect("/");
  }
});

app.post("/updateProfile", (req, res) => {
  if (req.isAuthenticated()) {

    User.findByUsername(req.body.username, (err, user) => {
      if (err) {
        console.log(err);
      } else {
          req.user.changePassword(req.body.oldPassword, 
          req.body.newPassword, function (err) {
              if (err) {
                  console.log("error 1" + err);
                   res.render("updateInfo", {
                      message: "Old password incorrect, try again.",
                      profile: req.user,
                   }); 
              } else {
                  User.findOne({_id: req.user.id}, function (err, result) {
                    //console.log("USER: " + result);
                    if (err) {
                      console.log("error 2" + err);
                    } else {        
                      User.updateOne( {_id: req.user.id}, {bio: req.body.bio}, function(err, result){
                        if(err){
                          console.log("error 3" + err);
                        } else {
                          res.redirect("/");
                        }
                      });
                    }
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

app.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({_id: req.user.id}, function (err, result) {
      //console.log("USER: " + result);
      if (err) {
        console.log(err);
      } else {        
        res.render("about", {
          user: result,
        }); 
      }
     });
  } else {
    res.redirect("/");
  }
});


app.listen(3000, function () {
  console.log("server started on port 3000");
});
