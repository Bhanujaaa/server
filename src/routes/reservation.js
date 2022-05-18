const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const router = new express.Router();

// Create a reservation

router.post('/reservations', auth.simple,async (req, res) => {
  try {
   
    // if (role) throw new Error('you cannot set role property.');
    const reservation = new Reservation(req.body);
    console.log(req.body)
    await reservation.save();
    // console.log(user.password)
    // const token = await user.generateAuthToken();
    // res.send(user)
    res.status(201).send(reservation );
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all reservations
router.get('/reservations',auth.simple,  async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('movieId').populate('cinemaId').populate('UserId').populate('showId');
    res.send(reservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get reservation by id
router.get('/reservations/:id', auth.simple,async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id).populate('movieId').populate('cinemaId').populate('UserId').populate('showId');
    console.log(reservation.seats)  
    return !reservation ? res.sendStatus(404) :  res.json(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.get('/reservations/user/:userId',auth.simple,async(req,res)=>{
  const UserId=req.params.userId;
  try{
    const reservation = await Reservation.find({UserId:UserId}).populate('movieId').populate('cinemaId').populate('UserId');
    return !reservation ? res.sendStatus(404) :  res.json(reservation);
  }
  catch (e) {
    return res.status(400).send(e);
  }
})



// Delete reservation by id
router.delete('/reservations/:id', auth.simple, async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findByIdAndDelete(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.sendStatus(400);
  }
});


module.exports = router;
