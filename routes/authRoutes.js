const express = require('express');
const router = express.Router();
const User = require('../model/User');
const passport = require('passport');


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/register', (req, res) => {
  res.render('register', { error: req.flash('error') });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email,password});
    await user.save();
    req.login(user, err => {
      if (err) return next(err);
      res.redirect('/home');
    });
  } catch (err) {
    req.flash('error','some error occured');
    res.redirect('/register');
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
