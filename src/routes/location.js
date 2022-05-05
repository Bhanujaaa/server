const express = require('express');
const auth = require('../middlewares/auth');
const City=require('../models/location')
const router = new express.Router();

router.get('/getCity', async (req, res)=> {
    try {
        const city = await City.find({});
        res.send(city);
      } catch (e) {
        res.status(400).send(e);
      }
});

router.get('/getCity/:id', async(req, res)=> {
    const _id = req.params.id;

    try {
      const city = await City.findById(_id);
      if (!city) return res.sendStatus(404);
      return res.send(city);
    } catch (e) {
      return res.status(400).send(e);
    }
});

router.post('/addCity', async(req, res)=>{
 const city = new City(req.body);
 try{
 await city.save();
 res.status(201).send(city);

 }
 catch (e) {
    res.status(400).send(e);
  }

 });

router.delete('/deleteCity/:id', async(req, res)=>{
    const _id = req.params.id;
    try {
      const city = await City.findByIdAndDelete(_id);
      return !city ? res.sendStatus(404) : res.send(city);
    } catch (e) {
      return res.sendStatus(400);
    }
})

router.put('/updateCity/:id', async(req, res)=>{
    const _id = req.params.id;
  const updates = Object.keys(req.body);
    try{
        const city = await City.findById(_id);
        updates.forEach((update) => (movie[update] = req.body[update]));
        await movie.save();
        return !movie ? res.sendStatus(404) : res.send(movie);
}
catch (e) {
    return res.sendStatus(400);
  }
})

module.exports = router;