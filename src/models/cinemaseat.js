var mongoose = require('mongoose');
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

module.exports = mongoose.model('cine', CinemaSeatSchema);