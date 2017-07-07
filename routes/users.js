var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require('../models/user');
var isLoggedIn = require('../protect middleware/protect');

router.get("/register", function(req, res){
   res.render("register.ejs"); 
});

router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username
    });
User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("success", "you have successfully registered as  " + user.username);
           res.redirect("/"); 
        });
    });
});

router.get('/login',(req,res)=>{
    res.render('login.ejs')
})

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/products",
        successFlash: 'Logged in succesfully',
        failureRedirect: "/users/login",
        failureFlash: 'Invalid username or password.'
    }), function(req, res){
});

router.get("/logout", (req, res)=>{
    req.logout();
    console.log("success", "You have successfully logged out ");
    req.flash("success", "You have successfully logged out ");
    res.redirect("/users/login");
});


module.exports = router;

