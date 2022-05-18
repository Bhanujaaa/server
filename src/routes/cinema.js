const { json } = require('express');
const express = require('express');
const auth = require('../middlewares/auth');
const Cinema = require('../models/cinema');
const { update } = require('../models/cinemaseat');
const CinemaSeat=require('../models/cinemaseat');
const Showtime = require('../models/showtime');
const Reservation = require('../models/reservation');


const router = new express.Router();
router.get('/cinemas',auth.simple,(req,res)=>{
 
  Cinema.find({}).populate('movieId').exec((err,docs)=>{
    if(err)throw (err);
    res.json(docs)
  })
})
// Create a cinema
router.post('/cinemas', auth.enhance, async (req, res) => {
  const cinema = new Cinema(req.body.cine);
  console.log(req.body.cine)
  
  try {
    await cinema.save();
    
    res.status(201).send(cinema);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.patch('/cinemas/:id',auth.enhance, async (req, res) => {
  const _id = req.params.id;
  console.log(req.body.cine)
  const updates = Object.keys(req.body.cine);
  
  const allowedUpdates = ['moviename', 'ticketPrice', 'city','movieId','image','name','address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const cinema = await Cinema.findOneAndUpdate({ _id:_id },req.body.cine)
    // const cinema = await Cinema.findById(_id);
    console.log(cinema)
    // console.log(cinema[updates])
    // updates.forEach((update) => (cinema[update]=req.body.cine[update]));
    // await cinema.save();
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.get('/cinemas/id/:id',auth.simple,async (req, res) => {
  const _id = req.params.id;
  try {
    const cinema = await Cinema.findById(_id).populate('moviesId').populate('city');
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.get('/cinemas/:city/:moviename', auth.simple,async (req, res) => {
  const city = req.params.city;
  const movieId = req.params.moviename;
  // console.log(body)
  try {
    const cinema = await Cinema.find({ movieId: movieId, city: city });
    console.log(cinema)
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.get('/cinemas/:cityId', auth.simple,async (req, res) => {
  const city = req.params.cityId;
  // const moviename = req.params.moviename;
  // console.log(body)

  try {
    const cinema = await Cinema.find({ city: city }).populate('movieId');
    console.log(cinema)
    if (!cinema) return res.sendStatus(404);
    return res.json(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.delete('/cinemas/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime=await Showtime.find({cinemaId:req.params.id})
    const reserve=await Reservation.find({cinemaId:req.params.id})
    for(let item of showtime){
      const show=await Showtime.findById(item.id)
      const u3=await show.delete()
      
    }
    for(let item of reserve){
      const res=await Reservation.findById(item.id)
      const u4=await res.delete()
      
    }
    const cinema = await Cinema.findByIdAndDelete(_id);
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.sendStatus(400);
  }
});




router.get('/seats', auth.simple,(req, res) => {
  CinemaSeat.find({}).then((data) => {
      res.send(data);
  }).catch(err => console.log(err));
});
  
router.get('/seats/:id', auth.simple,async(req, res) => {
  const _id=req.params.id
  Cinema.find({_id:_id}).populate('seats').exec((err,docs)=>{
    if(err)throw (err);
    res.json(docs)
  })
})
router.get('/seats/:avail/:id',auth.simple,async(req,res)=>{
  const seatsAvailable=req.params.avail;
  const _id=req.params.id
  try {
    const cinema = await  Cinema.findOneAndUpdate({ _id:_id },{ $set: { seatsAvailable: seatsAvailable }})
    // console.log(cinema.ticketPrice)
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }

})
/** Used to create seat information */
router.post('/seats', auth.enhance,async(req, res) => {
  let body=req.body.seat
  const cinemaseat = new CinemaSeat(req.body.seat);
  console.log(cinemaseat)
  try {
    await cinemaseat.save();
    res.status(201).send(cinemaseat);
  } catch (e) {
    res.status(400).send(e);
  }
  // Cine.insertMany(req.body).then((data) => {
  //     res.json(data);
  // }).catch(err => console.log(err));

});

/** Used to update seat information */
//TODO Transaction needs to be implemented
router.patch('/seats/:id', async(req,res)=>{
  const _id = req.params.id;
  console.log(req.params.id)
 
  try {
    const cinemaseat = await CinemaSeat.findOneAndUpdate({ _id:_id },req.body.seat)
    return ! cinemaseat ? res.sendStatus(404) : res.send( cinemaseat);
  } catch (e) {
    return res.status(400).send(e);
  }
})
router.delete('/seats/:id', auth.enhance,async (req, res) => {
  const _id = req.params.id;
  try {
    const cinemaseat = await CinemaSeat.findByIdAndDelete(_id);
    if (!cinemaseat) return res.sendStatus(404);
    return res.send(cinemaseat);
  } catch (e) {
    return res.sendStatus(400);
  }
});
router.patch('/seats', auth.simple,(req, res) => {
  console.log("hiii")
  Array.from(req.body).forEach((value) => {
      const id = value._id;
      const selected = value.isSelected;
      CinemaSeat.findOneAndUpdate({ _id: id }, { $set: { isSelected: selected } })
      .then(() => {
          // console.log(CinemaSeat);
      })
      .catch((err) => {
          console.log(err);
          throw err;
      });
  });
  res.send({ message: 'success' });

});
router.post('/seats/update',auth.simple,async(req,res)=>{
  const seatsAvailable=req.body.seat
  const _id=req.body.id
  const cinema = await Cinema.findOneAndUpdate({_id: _id},{ $set: { seatsAvailable: seatsAvailable }})
  return res.json(cinema)
})
router.patch('/seats/free/f' ,async(req, res) => {
  console.log("hiii")
  console.log("inside the server")
  Array.from(req.body).forEach((value) => {
      const id = value._id; 
      const selected = value.isSelected;
      CinemaSeat.findOneAndUpdate({ _id: id }, { $set: { isSelected: false } })
      .then(() => {
        //  res.send(CinemaSeat)
      })
      .catch((err) => {
          console.log(err);
          throw err;
      });
  });
  res.send({ message: 'success' });

});



module.exports = router;
