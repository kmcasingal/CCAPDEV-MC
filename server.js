const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/anonx");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

const userSchema = {
  user: String,
  post: String,
  tag: String,
};

const Post = mongoose.model("post", userSchema);

app.get("/", (req, res) => {
  Post.find({}, function (err, rows) {
    console.log(rows)

    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        posts: rows,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
