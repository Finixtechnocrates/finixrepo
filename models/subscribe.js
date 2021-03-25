const mongoose = require('mongoose')

const subscribeSchema = new mongoose.Schema({
   email:{
      type:String
    }
})

module.exports = mongoose.model('Subscribe', subscribeSchema )