const mongoose = require('mongoose')


const timeSheetSchema = new mongoose.Schema({
    start_date:{
        type: Date
    },
    end_date:{
        type: Date
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
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

mongoose.exports = mongoose.model('TimeSheet', timeSheetSchema)