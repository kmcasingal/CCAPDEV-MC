const passport = require("passport");
const User = require("../models/users")
const Post = require("../models/posts")
const Comment = require("../models/comments")

const indexPage = (req, res) => {
    if (req.isAuthenticated()) {
        User.findOne({_id: req.user.id}, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            Post.find({}, function (err, postRows) {
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

const logout = (req, res) => {
  req.logout(function(err){
    if (err){ }
    res.redirect("/");
  });
}

const createAccount = (req, res) => {
  User.register(
    { username: req.body.regUsername },
    req.body.regPassword,
    function (err, user) {
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
}

const verifyLogin = (req, res) => {
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
      passport.authenticate("local",  { failureRedirect: '/loginError' })(req, res, function () {
        res.redirect("/");
      });
    }
  });
}

const loginError = (req, res) => {
  res.render("login", {
    failReg: "false",
    fail: "true",
   });
}

const search = (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({_id: req.user.id}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        Post.find({tag: req.query.searchTag}, function (err, postRows) {
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
}

const addPost = (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({_id: req.params.userId}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
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
}

const save = (req, res) => {
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
        edited: "false",
        date: new Date(),
      });
  
      post.save(function(err){
        if(err){
          console.log(err);
        } else {
          User.findOne({_id: req.body.userId}, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              Post.find({}, function (err, postRows) {
                Comment.find({}, function (err, commentRows) {
                  if (err) {
                    console.log(err);
                  } else {
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
}

const editPost = (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.params.userId; 

    User.findOne({_id: req.user.id}, function (err, userFound) {
      if (err) {
        console.log(err);
      } else {               
        Post.find( {_id: userId}, function(err, result){
          if(err){
            console.log(err);
          } else {
            res.render("updatePost", {
              posts: result[0],
              user: userFound,
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
}

const comment = (req, res) => {
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
      date: new Date(),
    });
  
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
}

const updatePost = (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.body.id;
    const query = {_id: userId};
    const titleVal = req.body.title;
    const postVal = req.body.postText;
    const tagVal = req.body.tag;
    const editedVal = "true";

    let anonToggle = ""
    if(req.body.anonToggle == "on"){
      anonToggle = "true"
    } else {
      anonToggle = "false"
    }
   
    Post.updateOne( query, {title: titleVal, post: postVal, anon: anonToggle, tag: tagVal, edited: editedVal}, function(err, result){
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
}

const deletePost = (req, res) => {
  if (req.isAuthenticated()) {
    const postId = req.params.postId;

    Post.findByIdAndRemove( postId, function(err, result){
      Comment.deleteMany({mainPostId: postId}, function(err, result){
        if(err){
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    });
  } else {
    res.render("login", {
      fail: "false",
    });
  }
}

const deleteComment = (req, res) => {
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
}

const editComment = (req, res) => {
  if (req.isAuthenticated()) {
    const commentToUpdate = req.params.commentId; 

    
    User.findOne({_id: req.user.id}, function (err, userFound) {
      if (err) {
        console.log(err);
      } else {               
        Comment.find( {_id: commentToUpdate}, function(err, result){
          if(err){
            console.log(err);
          } else {
            //console.log("RESULT:" + result[0].id);
            res.render("updateComment", {
              comment: result[0],
              user: userFound,
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
}

const updateComment = (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.body.id;
    const query = {_id: userId};
    const commentVal = req.body.postText;
    const editedVal = "true"

    let anonToggle = ""
    if(req.body.anonToggle == "on"){
      anonToggle = "true"
    } else {
      anonToggle = "false"
    }
   
    Comment.updateOne( query, {comment: commentVal, anon: anonToggle, edited: editedVal}, function(err, result){
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
}

const profile = (req, res) => {
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
}

const editProfile = (req, res) => {
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
}

const updateProfile = (req, res) => {
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
}

const about = (req, res) => {
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
}

module.exports = {
    indexPage,
    logout,
    createAccount,
    verifyLogin,
    loginError,
    search,
    addPost,
    save,
    editPost,
    comment,
    updatePost,
    deletePost,
    deleteComment,
    editComment,
    updateComment,
    profile,
    editProfile,
    updateProfile,
    about,
}
