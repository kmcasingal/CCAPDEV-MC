require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

const routes = require("./routes/routes")
const User = require("./models/users")

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

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(routes);

app.listen(3000, function () {
  console.log("server started on port 3000");
});
