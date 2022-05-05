const express = require('express');
const auth = require('../middlewares/auth');
const Cinema = require('../models/cinema');
const CinemaSeat=require('../models/cinemaseat')


const router = new express.Router();
router.get('/cinemas',(req,res)=>{
 
  Cinema.find({}).populate('seats').exec((err,docs)=>{
    if(err)throw (err);
    res.json(docs)
  })
})
// Create a cinema
router.post('/cinemas', async (req, res) => {
  const cinema = new Cinema(req.body);
  
  try {
    await cinema.save();
    
    res.status(201).send(cinema);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.get('/cinemas/:city/:moviename', async (req, res) => {
  const city = req.params.city;
  const moviename = req.params.moviename;
  // console.log(body)
  try {
    const cinema = await Cinema.find({ moviename: moviename, city: city });
    console.log(cinema)
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.get('/cinemas/:city', async (req, res) => {
  const city = req.params.city;
  const moviename = req.params.moviename;
  // console.log(body)

  try {
    const cinema = await Cinema.find({ city: city });
    console.log(cinema)
    if (!cinema) return res.sendStatus(404);
    return res.json(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }
});




router.post('/cinemas/:moviename/:name', async (req, res) => {
  const seatsW = req.body.seatsWanted
  const name = req.body.name;
  const moviename = req.body.moviename;
  console.log(seatsW)
  const updates = Object.keys(req.body);
let s=[ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
, [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
, [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
, [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
, [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]
    try{
   

      for (var i = 0; i < seatsW.length; i++) {

        const seatsW1 = seatsW[i];
        let n1;
        let n2;
        n1=seatsW1[0]
        n2=seatsW1[1]
        s[n1][n2] = 1
      }
      console.log(s)
      const cinema = await Cinema.findOneAndUpdate({ moviename: moviename, name: name },{ $set: { seats: s }})
    
    return res.json(cinema);
  }
  catch (e) {
    console.log("error")
    return res.sendStatus(400);
  }
})

router.get('/seats', (req, res) => {
  CinemaSeat.find({}).then((data) => {
      res.send(data);
  }).catch(err => console.log(err));
});
router.get('/name/:moviename/:city',async(req,res)=>{
  let moviename=req.params.moviename
  let city=req.params.city
  try {
    const cinema = await Cinema.find({ moviename: moviename, city: city });
    console.log(cinema.ticketPrice)
    if (!cinema) return res.sendStatus(404);
    return res.send(cinema);
  } catch (e) {
    return res.status(400).send(e);
  }

})
  

/** Used to create seat information */
router.post('/seats', async(req, res) => {
  let body=req.body
  const cinemaseat = new CinemaSeat(req.body);
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
router.patch('/seats', (req, res) => {
  console.log("hiii")
  Array.from(req.body).forEach((value) => {
      const id = value._id;
      const selected = value.isSelected;
      CinemaSeat.findOneAndUpdate({ _id: id }, { $set: { isSelected: selected } })
      .then(() => {
          console.log(CinemaSeat);
      })
      .catch((err) => {
          console.log(err);
          throw err;
      });
  });
  res.send({ message: 'success' });

});



module.exports = router;
