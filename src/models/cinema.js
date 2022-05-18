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
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  name: {
    type: String,
    required: true,
   
  },
 
  city: {
    type: Schema.Types.ObjectId,
    ref:'Location', 
    required: true,

  },
 
address:{
  type:String,
},
  image: {
    type: String,
  },
});


const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
