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
  post: String,
  tag: String,
  isUser: String,
  anon: String,
  commenter: Array,
  comment: Array,
};

const Post = mongoose.model("post", userSchema);

app.get("/", (req, res) => {
  Post.find({}, function (err, rows) {
    // console.log(rows)

    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        posts: rows,
      });
    }
  });
});

/*
app.get("/create", (req, res) => {
  Post.find({}, function (err, rows) {
    // console.log(rows)

    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        posts: rows,
      });
    }
  });
});
*/

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

  console.log("USER ID 1: " + userId);
  Post.find( {_id: userId}, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log("RESULT PO: " + req.params.userId);

      const userId = req.params.userId;
      const query = {_id: userId}
      const anonVal = req.body.anonToggle;
      let commenterVal = "user";

      console.log("ANON VAAAAAAAAAL: " + anonVal);

      if(anonVal == "true"){
        commenterVal = "userAnon";
      } 

      const commentVal = req.body.cmnt;
      console.log("USER commenter: " + commenterVal);

      Post.updateOne( query, {$push: { commenter: commenterVal, comment: commentVal }}, function(err, result){
        if(err){
          console.log(err);
        } else {
          console.log(commentVal);
          res.redirect("/");
        }
      });

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
  // ganto dapat
  // db.posts.updateOne({_id : ObjectId("63763ffa152b951120b2a744")}, {$set: {user: "You", post:"hello i am the main user here xd", tags:["flex", "main"]}})
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

app.get('/deleteComment/:commentIndex/:userId', (req, res) => {
  const commentIndex = req.params.commentIndex;
  Post.find( {_id:  req.params.userId}, {commenter : 'commenter.2'}, function(err, result){
    console.log("wew = " + result)
    Post.updateOne( {_id: req.params.userId}, {"$set" : {"commenter" : result.commenter}}, function(err, result){
      if(err){
        console.log(err);
      } else {
        //console.log("DELETING " + commenterList);
        console.log("pumasok")
        res.redirect("/");
      }
    });
  });
  // commenterList.splice(commentIndex, 1)
  
});


app.listen(3000, function () {
  console.log("server started on port 3000");
});
