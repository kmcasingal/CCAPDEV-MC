const express = require('express');
const passport = require("passport");
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments");

const router = express.Router();

const controller = require("../controllers/controller");

router.get("/", controller.indexPage);

router.get("/logout", controller.logout);

router.post("/createAccount", controller.createAccount);

router.post("/verifyLogin", controller.verifyLogin);

router.get("/search", controller.search);

router.get("/add/:userId", controller.addPost);

router.post("/save", controller.save);

router.get("/edit/:userId", controller.editPost);

router.post("/comment/:mainPostId", controller.comment);

router.post("/update", controller.updatePost);

router.get("/delete/:postId", controller.deletePost);

router.get("/deleteComment/:commentId", controller.deleteComment);

router.get("/editComment/:commentId", controller.editComment);

router.post("/updateComment", controller.updateComment);

router.get("/profile", controller.profile);

router.get("/editProfile", controller.editProfile);

router.post("/updateProfile", controller.updateProfile);

router.get("/about", controller.about);

module.exports = router;