const express = require('express');
const auth = require('../middlewares/auth');
const Showtime = require('../models/showtime');

const router = new express.Router();

// Create a showtime
router.post('/showtimes', auth.enhance, async (req, res) => {
  const showtime = new Showtime(req.body);
  try {
    await showtime.save();
    res.status(201).send(showtime);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all showtimes
router.get('/showtimes', async (req, res) => {
  try {
    const showtimes = await Showtime.find({});
    res.json(showtimes);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get showtime by id
router.get('/showtimes/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime = await Showtime.findById(_id);
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    res.status(400).send(e);
  }
});


// Delete showtime by id
router.delete('/showtimes/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime = await Showtime.findByIdAndDelete(_id);
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    return res.sendStatus(400);
  }
});

module.exports = router;
