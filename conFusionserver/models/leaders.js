const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;




const commentSchema = new Schema({
    rating: {
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
},{
  timestamps:true  
});

const leaderSchema = new Schema({

    name: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments:[commentSchema]
}, 
{
      timestamps:true
  
});


var leaders = mongoose.model('leader', leaderSchema);
module.exports = leaders;