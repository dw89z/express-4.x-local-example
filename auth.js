const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

passport.use(new LocalStrategy(
    function(username, password, cb) {
      console.log(`username : ${username} password : ${password}`)
      db.users.findByUsername(username, function(err, user) {
        
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));
  
  
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });
  
  passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

router.get('/',
function(req, res) {
  res.render('home', { user: req.user });
});

router.get('/login',
  function(req, res){
      console.log("zzz")
    res.render('login');
  });
  
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

module.exports = router;