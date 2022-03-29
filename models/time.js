const mongoose = require('mongoose')


const timeSchema = new mongoose.Schema({
    start_date:{
        type: Date,
        required: true
    },
    end_date:{
        type: Date,
        required: true
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    time_sheet:[{
       day:{
           type:String
       }, 
       time:{
           type:Number
       }
    }]
})

module.exports = mongoose.model('Time', timeSchema)