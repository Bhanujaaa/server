const express = require('express');
const auth = require('../middlewares/auth');
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');
const Showtime = require('../models/showtime');
const Reservation = require('../models/reservation');

const router = new express.Router();

// Create a movie
router.post('/movies', auth.simple,async (req, res) => {
  console.log("logged")
  console.log(req.body.movie)
  const movie = new Movie(req.body.movie);
  try {
    await movie.save();
    res.status(201).send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});



// Get all movies
router.get('/movies', auth.simple, async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get('/movies/name/:moviename', auth.simple, async (req, res) => {
  try {
    
    let title=req.params.moviename;
    console.log(title)

    const movies = await Movie.find({title:title});
    console.log(movies[0]._id)
    res.send(movies[0]._id);

  } catch (e) {
    res.status(400).send(e);
  }
});

// Get movie by id
router.get('/movies/:id', auth.simple, async (req, res) => {
  const _id = req.params.id;

  try {
    const cine=await Cinema.find({movieId:req.params.id})
    const showtime=await Showtime.find({movieId:req.params.id})
    const reserve=await Reservation.find({movieId:req.params.id})
    for(let item of showtime){
      const show=await Showtime.findById(item.id)
      const u3=await show.delete()
      
    }
    for(let item of cine){
      const cinema=await Cinema.findById(item.id)
      const u4=await cinema.delete()
      
    }
    for(let item of reserve){
      const res=await Reservation.findById(item.id)
      const u4=await res.delete()
      
    }
    const movie = await Movie.findById(_id);
    if (!movie) return res.sendStatus(404);
    return res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.put('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  console.log("puted")
  console.log(req.body.movie)
  const updates = Object.keys(req.body.movie);
  const allowedUpdates = [
    'title',
    'image',
    'language',
    'genre',
    'director',
    'cast',
    'description',
    'duration',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const movie = await Movie.findOneAndUpdate({ _id:_id },req.body.movie)
    // const movie = await Movie.findById(_id);
    // updates.forEach((update) => (movie[update] = req.body.movie[update]));
    // await movie.save();
    return !movie ? res.sendStatus(404) : res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete movie by id
router.delete('/movies/:id', auth.enhance,async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    return !movie ? res.sendStatus(404) : res.send(movie);
  } catch (e) {
    return res.sendStatus(400);
  }
});


module.exports = router;
