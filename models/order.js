var mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
   movie_id:{
      type:mongoose.Schema.ObjectId,
      required:true
   },
   slot_id:{
       type:mongoose.Schema.ObjectId,
       required:true
   },
   date:{
       type:String
   },
   user_id:{
      type:mongoose.Schema.ObjectId,
      required:true
   },
   seats:{
       type:Number
   },
   status:{
       type:String,
       enum:['CONFIRMED','REJECTED']
   },
    created_at:{
        type:Number,
        default:Date.now()
    }
})

module.exports = mongoose.model('Order', orderSchema)