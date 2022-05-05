const mongoose = require('mongoose');

const { Schema } = mongoose;
const seatSchema = new Schema({
    seatId:number,
      seatPrice:number,
       booking:Booking,
       show:Show,
       seatStatus:string,
     
       seatLocation: {type: [Schema.Types.Mixed]},
})