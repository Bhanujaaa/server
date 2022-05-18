const mongoose = require('mongoose');

const { Schema } = mongoose;
const reservationSchema = new Schema({
  date: {
    type: Date,
  },
 showId:{
   type:String,
   type:Schema.Types.ObjectId,
  ref:'Showtime',
  // required:true
 },
 seats:{
   type:Number
 },
  total: {
    type: Number,
    required: true,
  },
  movieId: {
    type:String,
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  cinemaId: {
    type:String,
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  UserId: {
    type:String,
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  username: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  checkin: {
    type: Boolean,
    default: true,
  },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
