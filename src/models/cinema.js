const mongoose = require('mongoose');
// CinemaSeatSchema=require('./cinemaseat')
const cine=require('./cinemaseat')
const {ObjectId} = mongoose.Schema; 
const { Schema } = mongoose;
var CinemaSeatSchema = new Schema({
    seatNum: {
        type:String,
        required:true
    },
    isSelected:{
        type:Boolean,
        default:false

    },
});
const cinemaSchema = new Schema({
  moviename:{
    type:String,
    required:true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  seats: [{ type: Schema.Types.ObjectId, ref: "cine",required:true }],

  seatsWanted: {
    type: [Schema.Types.Mixed],
    // required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});


const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
