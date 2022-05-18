const express = require('express');
const auth = require('../middlewares/auth');
const Showtime = require('../models/showtime');
const Reservation = require('../models/reservation');

const router = new express.Router();

// Create a showtime
router.post('/showtimes',  async (req, res) => {
  console.log(req.body.show)  
  const showtime = new Showtime(req.body.show);
 
  try {
    await showtime.save();
    res.status(201).send(showtime);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all showtimes
router.get('/showtimes', auth.enhance, async (req, res) => {
  try {
    const showtimes = await Showtime.find({}).populate('cinemaId').populate('movieId').populate('seats');
    res.json(showtimes);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get('/show/:cineid/:movieid', auth.simple, async(req,res)=>{
  let cinemaId=req.params.cineid
  let movieId=req.params.movieid
  try {
    const showtimes = await Showtime.find({ cinemaId: cinemaId, movieId: movieId}).populate('movieId').populate('cinemaId');
    // console.log(showtimes.ticketPrice)
    console.log(showtimes)
    if (!showtimes) return res.sendStatus(404);
    return res.send(showtimes);
  } catch (e) {
    return res.status(400).send(e);
  }

})

// Get showtime by id
router.get('/showtimes/:id', auth.simple, async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime = await Showtime.findById(_id).populate('seats');
    console.log(showtime)
    console.log("hi here is the showtime")
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    res.status(400).send(e);
  }
});


// Delete showtime by id
router.delete('/showtimes/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const reserve=await Reservation.find({showId:req.params.id})
    const showtime = await Showtime.findByIdAndDelete(_id);
    for(let item of reserve){
      const res=await Reservation.findById(item.id)
      const u4=await res.delete()
      
    }
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    return res.sendStatus(400);
  }
});
router.get('/show/seats/:id', auth.simple, async(req, res) => {
  const _id=req.params.id
  Showtime.find({_id:_id}).populate('seats').exec((err,docs)=>{
    if(err)throw (err);
    res.json(docs)
  })
})
router.get('/show/seats/:avail/:id', auth.simple, async(req,res)=>{
  const seatsAvailable=req.params.avail;
  const _id=req.params.id
  try {
    const cinema = await  Showtime.findOneAndUpdate({ _id:_id },{ $set: { seatsAvailable: seatsAvailable }})
    // console.log(cinema.ticketPrice)
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }

})
router.patch('/showtimes/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body.show);
  const allowedUpdates = ['startAt','movieId', 'seats','tickePrice','seatsAvailable','cinemaId'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const showtime = await Showtime.findOneAndUpdate({ _id:_id },req.body.show)
    // const showtime = await Showtime.findById(_id);
    // updates.forEach((update) => (showtime[update] = req.body[update]));
    // await showtime.save();
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.post('/show/seats/update', auth.simple, async(req,res)=>{
  const seatsAvailable=req.body.seat
  const _id=req.body.id
  try{
    // const showtime=await Showtime.find({cinemaId:req.params.id})
    const reserve=await Reservation.find({showId:_id})
    for(let item of reserve){
      const res=await Reservation.findById(item.id)
      const u4=await res.delete()
      
    }
    const cinema = await Showtime.findOneAndUpdate({_id: _id},{ $set: { seatsAvailable: seatsAvailable }})
    console.log("updates seats availabilty")
    console.log(cinema)
    return res.send(cinema)
  }
  catch (e) {
    return res.sendStatus(400);
  }
 
})

module.exports = router;
