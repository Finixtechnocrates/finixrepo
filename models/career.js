var mongoose = require('mongoose')

const careerSchema = new mongoose.Schema({
    name:{
        type:String
    },
    designation:{
        type:String
    },
    apply:{
        type:Number
    },
    apply:{
        type:String
    },
    relocation:{
        type:String
    },
    resume:{
        type:String
    },
    created_at:{
        type:Number,
        default:Date.now()
    }
})

module.exports = mongoose.model('Career', careerSchema)