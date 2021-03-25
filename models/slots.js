var mongoose = require('mongoose')

const slotSchema = new mongoose.Schema({
    start_time: {
        type:String,
        required: true
    },
    end_time: {
        type:String,
        required: true
    },
    movie_id: {
        type:[{ type: mongoose.Schema.ObjectId, ref: 'Movie' }],
        required: true
    },
    is_active:{
        type: Boolean,
        default: false
    },
    created_at: {
        type:Number,
        default:Date.now(),
    },
    days: {
        type:[],
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    customer_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    updated_at: {
        type: Number,
        default: Date.now()
    },
    created_by_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    updated_by_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }
 })
 
 module.exports = mongoose.model('Slot', slotSchema)