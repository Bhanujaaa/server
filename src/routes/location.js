const express = require('express');
const auth = require('../middlewares/auth');
const City=require('../models/location')
const router = new express.Router();
const Cinema = require('../models/cinema');

router.get('/getCity', auth.simple,async (req, res)=> {
    try {
        const city = await City.find({});
        res.send(city);
      } catch (e) {
        res.status(400).send(e);
      }
});

router.get('/getCity/:id',auth.simple, async(req, res)=> {
    const _id = req.params.id;

    try {
      const city = await City.findById(_id);
      if (!city) return res.sendStatus(404);
      return res.send(city);
    } catch (e) {
      return res.status(400).send(e);
    }
});

router.post('/addCity', auth.enhance,async(req, res)=>{
 const city = new City(req.body.city);
 try{
 await city.save();
 res.status(201).send(city);

 }
 catch (e) {
    res.status(400).send(e);
  }

 });
//  router.delete('/:id', auth.enhance,async(req,res)=>{
//   try{
//     const showtime = await Showtime.findById(req.params.id)
//     // const role = user.role
//     const reser =await Reservation.find({showId:req.params.id})
//     for (let item of reser){
//       const reservation = await Reservation.findById(item.id)
//       const u3 = await reservation.delete()
//       console.log(reservation.showId)
//     }
//     const u1 = await showtime.delete()
//     res.json('deleted showtime')
//   }
//   catch(err){
//       res.send('error'+err)
//   }
// })
router.delete('/deleteCity/:id', auth.enhance,async(req, res)=>{
    const _id = req.params.id;
    try {
      const cinema=await Cinema.find({city:req.params.id})
      const city = await City.findByIdAndDelete(_id);
      for(let item of cinema){
        const cine=await Cinema.findById(item.id)
        const u3=await cine.delete()
        
      }
      return !city ? res.sendStatus(404) : res.send(city);
    } catch (e) {
      return res.sendStatus(400);
    }
})

router.patch('/updateCity/:id', auth.enhance,async(req, res)=>{
    const _id = req.params.id;
  const updates = Object.keys(req.body.city);
    try{
      const cite = await City.findOneAndUpdate({ _id:_id },req.body.city)
        // const cite = await City.findById(_id);
        // updates.forEach((update) => (movie[update] = req.body.city[update]));
        // await cite.save();
        return !cite ? res.sendStatus(404) : res.send(cite);
}
catch (e) {
    return res.sendStatus(400);
  }
})


module.exports = router;