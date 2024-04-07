var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post')
const multer = require('./multer');
const localStrategy = require("passport-local");
const passport = require('passport');
const post = require('./post');
const upload = require('./multer');
const { get } = require('mongoose');
const users = require('./users');
const saved = require('./savedImg');
const mongoose = require('mongoose');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index' , {nav:false , error:req.flash('error')});
});

// REGISTER PAGE
router.get('/register' , function(req, res ,next){
  res.render('register', {nav:false});
});




// PROFILE PAGE
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user =
   await userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts")
        
        

             

  res.render("profile", { user, nav: true })
});

// EDIT PROFILE PAGE
router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("edit", { nav:true, user });
});

// UPDATE PROFILE LOGIC
router.post("/update", isLoggedIn, async function (req, res) {
  const user = await userModel.findOneAndUpdate(
    { username: req.session.passport.user },
    { username: req.body.username, name: req.body.name, bio: req.body.bio },
    { new: true }
  );
  req.login(user, function (err) {
    if (err) throw err;
    res.redirect("/profile");
  });
});

// UPLOAD POST LOGIC
router.post(
  "/upload",
  isLoggedIn,
  upload.single("image"),
  async function (req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/edit");
  }
);

// UPLOAD POST PAGE
router.get("/upload", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render("upload", { nav: true, user });
});

// FEED PAGE
router.get('/feed', isLoggedIn, async function (req, res, next) {
  const user =
   await userModel
        .findOne({ username: req.session.passport.user })

  const posts =
    await postModel.find()
    .populate("user")

  res.render("feed", { user,posts, nav: true })
});

// POST SHOW PAGE
router.get('/show/posts', isLoggedIn, async function (req, res, next) {
  const user =
   await userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts")

  res.render("show", { user, nav: true })
});

// POSTDETAIL PAGE
router.get('/show/posts/:postId', isLoggedIn, async function (req, res, next) {
   const user =
    await userModel
        .findOne({ username: req.session.passport.user }).populate("posts")
     const postId =  req.params.postId;
     
     const posts = await postModel.findById(postId);
     const post = await postModel.find().populate("user");
     

   res.render("postDetail", { user, post , posts ,nav: true })
});

// UPLOADS DETAIL PAGE
router.get('/show/uploads/:postId', isLoggedIn, async function (req, res, next) {
  const user =
   await userModel
       .findOne({ username: req.session.passport.user }).populate("posts")
    const postId =  req.params.postId;
    
    const posts = await postModel.findById(postId);
    const post = await postModel.find().populate("user");
    

  res.render("postDetail2", { user, post , posts ,nav: true })
});

// ENHANCE IMAGE PAGE
router.get('/inhanceImg', isLoggedIn, async function (req, res, next) {
  

  res.render("imginhance", {  nav: true })
});

// REMOVE IMAGE BACKGROUND
router.get('/removeBg', isLoggedIn, async function (req, res, next) {
  

  res.render("removebg", {  nav: true })
});


// ADD POSTS PAGE
router.get('/add', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts =
  await postModel.find()
  .populate("user")
  res.render("add", { user, posts,nav: true })
});

// ADD PAGE LOGIC
router.post('/createpost', upload.single("postimage"), isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const postCreated = await postModel.create({
    user: user._id,
    title: req.body.title,
    descreption: req.body.description,
    image: req.file.filename
  })

  user.posts.push(postCreated._id);
  await user.save();
  res.redirect("/profile")
});

// IMAGE UPLOAD LOGIC
router.post('/fileupload', isLoggedIn, upload.single("image"), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

// REGISTER PAGE LOGIC
router.post('/register', function(req , res ,next){
  
  const userData = userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact
  });
  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/feed')
      })
    })
});

// LOGIN PAGE LOGIC
router.post('/login', passport.authenticate("local",{
  successRedirect: "/feed",
  failureRedirect: "/",
  failureFlash: true,
}), function(req, res, next) {})

// LOGOUT
router.get('/logout',function(req ,res ,next){
 req.logout(function(err){
  if(err) {return next(err);}
  res.redirect("/");
 });
});

function isLoggedIn(req, res, next){
 if( req.isAuthenticated()){
  return next();
 }
 res.redirect("/");
}

router.get('/nature',isLoggedIn,async function(req,res,next){
    
  const user= await userModel.findById({_id:"65f43fc3fc9790c6771fb259"}).populate("posts")
  console.log(user)
   
  res.render("nature", {user  ,nav:true})
})


module.exports = router;
