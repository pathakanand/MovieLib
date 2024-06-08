const express=require('express');
const mongoose=require('mongoose');


const movieSchema=mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    imdbID: {
      type: String,
      required: true,
      unique: true
    },
    poster: {
      type: String
    }
})


const Movie=mongoose.model('Movie',movieSchema);

module.exports=Movie;