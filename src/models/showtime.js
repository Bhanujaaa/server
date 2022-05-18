const mongoose = require('mongoose');

const { Schema } = mongoose;
const showtimeSchema = new Schema({
  startAt: {
    type: String,
    required: true,
    trim: true,
  },
  seats: [{ type: Schema.Types.ObjectId, ref: "cine" }],
  ticketPrice: {
    type: Number,
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    // required: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  cinemaId: {
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
