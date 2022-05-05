const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Create a user
router.post('/users/register', async (req, res) => {
  try {
    const {role} = req.body;
    // if (role) throw new Error('you cannot set role property.');
    const user = new User(req.body);
    await user.save();
    console.log(user.password)
    const token = await user.generateAuthToken();
    // res.send(user)
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});



// Login User
router.post('/users/login', async (req, res) => {
  const email=req.body.email
  const password=req.body.password
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
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
router.get('/users', async (req, res) => {
  // if (req.user.role !== 'admin')
  //   return res.status(400).send({
  //     error: 'Only the god can see all the users!',
  //   });
  try {
    const users = await User.find({});
    res.send(users);
    console.log(users);
  } catch (e) {
    res.status(400).send(e);
  }
});



router.get('/users/:id', auth.enhance, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(400).send({
      error: 'Only the god can see the user!',
    });
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.sendStatus(404);
    res.send(user);
  } catch (e) {
    res.sendStatus(400);
  }
});


module.exports = router;
