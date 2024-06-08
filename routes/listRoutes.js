const express = require('express');
const router = express.Router();
const List = require('../model/List');
const Movie = require('../model/Movie');
const {getMaterials}=require('../api/odmb');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

router.post('/list', async (req, res) => {
  const { name, isPublic } = req.body;
  const list = new List({ name, isPublic, user: req.user._id });
  await list.save();
  res.redirect('/home');
});


router.post('/list/:listId/movie', async (req, res) => {
  const { title, year, imdbID, poster } = req.body;
  const movie = new Movie({ title, year, imdbID, poster });
  await movie.save();
  const list = await List.findById(req.params.listId);
  list.movies.push(movie);
  await list.save();
  res.redirect('/home');
});

router.post('/list/addMovie', ensureAuthenticated, async (req, res) => {
  const { title, year, imdbID, poster, listId } = req.body;
  const movie = new Movie({ title, year, imdbID, poster });
  await movie.save();
  const list = await List.findById(listId);
  list.movies.push(movie);
  await list.save();
  res.redirect('/home');
});

router.get('/lists', async (req, res) => {
  const lists = await List.find({ user: req.user._id }).populate('movies');
  res.render('home', { user: req.user, lists });
});

module.exports = router;
