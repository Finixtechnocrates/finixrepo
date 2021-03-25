var mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:Number
    },
    subject:{
        type:String
    },
    message:{
        type:String
    },
    created_at:{
        type:Number,
        default:Date.now()
    }
})

module.exports = mongoose.model('Contact', contactSchema)