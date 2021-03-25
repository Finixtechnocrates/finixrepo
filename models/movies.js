var mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    name:{
        type:String
    },
    movie_type:{
        type:String
    },
    description:{
        type:String
    },
    is_active:{
        type:Boolean,
        default:true
    },
    seats:{
        type:Number,
        default:80
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    created_at:{
        type:Number,
        default:Date.now()
    }
})

module.exports = mongoose.model('Movie', movieSchema)