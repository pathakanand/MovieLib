const express = require('express');
const router = express.Router();
const { getMaterials } = require('../api/odmb');
const Movie=require('../model/Movie');
const List=require('../model/List');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

router.get('/home', ensureAuthenticated, async(req, res) => {
  const lists = await List.find({ user: req.user._id }).populate('movies');
  res.render('home', { user: req.user, movies: null ,lists}); 
});

router.get('/search', ensureAuthenticated, async (req, res) => {
  const query = req.query.q;
  const movies = await getMaterials({ s: query });
  const lists = await List.find({ user: req.user._id }).populate('movies');
  res.render('home', { user: req.user, movies: movies.Search,lists});
});

module.exports = router;
