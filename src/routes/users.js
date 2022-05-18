const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const router = new express.Router();
router.post('/refresh',async(req,res)=>{
  try{
    const refreshToken=req.body.refreshToken
    console.log(req.body.refreshToken)
    const decoded = jwt.verify(refreshToken, 'Refresh');
    console.log(decoded)
    const user = await User.findOne({
      _id: decoded._id,})
      console.log(user)
      console.log("user is above")
    // const userId=await verifyRefreshToken(refreshToken)
    const token = await user.generateAuthToken();
    const refresh=await user.generateRefreshToken();
    res.send({token,refresh})
  }
  catch(e){
    res.send(e)
  }
})
// Create a user
router.post('/users/register', async (req, res) => {
  try {
    const {role} = req.body;
    // if (role) throw new Error('you cannot set role property.');
    const user = new User(req.body);
    await user.save();
    console.log(user.password)
    const token = await user.generateAuthToken();
    const refresh=await user.generateRefreshToken();
    // res.send(user)
    console.log(refresh)
    res.status(201).send({ user, token,refresh });
  } catch (e) {
    res.send(e);
  }
});



// Login User
router.post('/users/login', async (req, res) => {
  const email=req.body.email
  const password=req.body.password
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    const refresh=await user.generateRefreshToken();
    res.send({ user, token,refresh });
  } catch (e) {
    res.status(400).send({
      error: { message: 'You have entered an invalid email or password' },
    });
  }
});

// Logout user
router.post('/users/logout', auth.simple, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({});
  } catch (e) {
    res.status(400).send(e);
  }
});

// Logout all
router.post('/users/logoutAll', auth.enhance, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all users
router.get('/users', auth.enhance, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
    console.log(users);
  } catch (e) {
    res.status(400).send(e);
  }
});



router.get('/users/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.sendStatus(404);
    res.send(user);
  } catch (e) {
    res.sendStatus(400);
  }
});
router.delete('/users/:id', auth.enhance,async (req, res) => {
  const _id = req.params.id;

  try {
    const reserve=await Reservation.find({cinemaId:req.params.id})
    const user = await User.findByIdAndDelete(_id);
    for(let item of reserve){
      const res=await Reservation.findById(item.id)
      const u4=await res.delete()
      
    }
    if (!user) return res.sendStatus(404);

    res.send({ message: 'User Deleted' });
  } catch (e) {
    res.sendStatus(400);
  }
});


module.exports = router;
