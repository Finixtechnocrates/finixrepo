const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   name:{
      type:String,
      required:true
    },
    emp_number:{
      type:String,
      required:true
    },
    contact:{
        type:Number,
        required:true
    },
    password:{
       type:String,
       required:true
    },
    email:{
       type:String,
       required:true
    },
    is_active:{
        type:Boolean,
        default: false
    },
    role:{
        type:String,
        enum:["ADMIN", "EMPLOYEE"],
        default:"EMPLOYEER"
    },
    address:{
        type:String
    },
    gender:{
       type:String,
       enum:["Male", "Female"] 
    },
    is_active:{
        type:Boolean,
        default:true
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

module.exports = mongoose.model('User', userSchema)