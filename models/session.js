var mongoose = require('mongoose')

const userSessionSchema = new mongoose.Schema({
    device_uuid: {
        type:String,
        default:false
    },
    sessionId: {
        type:String,
        required: true
    },
    fcm_token:{
        type:String, 
        default:false
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    created_at: {
        type: Number,
        default: Date.now(),
    }
});

module.exports = mongoose.model('userSession', userSessionSchema)