const mongoose = require('mongoose');

const { Schema } = mongoose;
const locationSchema = new Schema({
cityName:{
    type:String
}
})

const City = mongoose.model('Location', locationSchema);

module.exports = City;
