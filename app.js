//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/postsDB",{useNewUrlParser:true});
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post",postSchema);

const homeStartingContent = "Welcome to Daily Journal !";
const aboutContent = "Hello, I'm Saketh, a Web Developer.";
const contactContent = "Want to get in touch with me ?";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  Post.find({},function(err, foundPosts){
    if(!err){
      res.render("home",{startingContent:homeStartingContent,posts:foundPosts});
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const selectedPostId = req.params.postId;
  Post.findOne({_id:selectedPostId},function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("post",{title:foundPost.title,content:foundPost.content});
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
