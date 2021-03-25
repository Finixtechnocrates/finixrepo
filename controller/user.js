const express = require('express')
const User = require('../models/user')
const userSession = require('../models/session')
const router = express.Router()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/local')
// var randomNumber = require('../lib/util')

router.get('/list' , authorization, async(req, res) => {
    try{
        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
        var userlist = await User.find()
        if(userlist)
        {
             res.status(200).json({msg:userlist})
        }
        else{
            res.status(404).json({msg:[]})
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

function randomNumber() {
    var digits = '0123456789';
    var OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

router.post('/add', async(req,res) => {
    try{ 
          var pass = randomNumber()
        var user = new User({
             name : req.body.name,
            last_name : req.body.last_name,
            contact : req.body.contact,
            role : req.body.role,
            address : req.body.address,
            password: pass,
            gender : req.body.gender
        })
        await User.create(user)
         res.status(200).json({msg:`User registerd successfully`, Password:pass , Contact:req.body.contact })
    }catch(err){
         res.status(500).json({message:err.message})
    }
})

router.post('/login' , async(req, res) =>{
 try{
    if(!req.body.contact)
    {
        return res.status(400).json({msg: "Please enter the valid contact number"})
    }
    let query = { contact: req.body.contact, is_deleted: false };
    var userdetails = await User.findOne(query)
      if(userdetails)
      {
          console.log(userdetails)
           if(userdetails.password == req.body.password)
           {
            var sessionId = generateSessionKey(32);

            var token = jwt.sign({user_type:userdetails.role, user_id:userdetails._id, sessionId:sessionId}, config.jwtSecret);
              let userSessionObj = {
                  sessionId:sessionId,
                  user_id:userdetails._id,
                  device_uuid: req.body.device_uuid ? req.body.device_uuid : false
              }
               await userSession.create(userSessionObj)
               var userinfo = {
                   Token: token,
                   role: userdetails.role
               }
               return res.status(200).json({message:"Login successfully", info: userinfo})
           }
           else{
               return res.status(401).json({message:"Please enter valid password"})
           }
      }
      return res.status(404).json({message:"User not found"})
   }catch(err){
      res.status(500).json({message:err.message})
   }   
})


router.post('/logout', authorization,  async(req, res) => {
    try{

      if(!req.user)
      {
          return res.status(400).json({message:"Invalid request"})
      }
      var query = {user_id:req.user.user_id, sessionId: req.user.sessionId}
      await userSession.deleteOne(query)
      return res.status(200).json({ message: "User Logout Successfully" });

    }catch(err){
        return res.status(500).json({message:err.message})
    }
})


router.get('/:id',authorization ,async(req, res) => {
    try{
      if(!req.params.id){
          res.status(400).json({message:'Please enter id'})
      }
      var userdetail = await User.findById(req.params.id)
      if(userdetail){
          res.status(200).json({data: userdetail})
      }
      else{
          res.status(404).json({message:'Data not found'})
      }
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.put('/:id', authorization, async(req,res) =>{
    try{

      var useredit = await User.findById(req.params.id)
      if(useredit){
            useredit.first_name = req.body.name
            useredit.last_name = req.body.last_name
            useredit.contact = req.body.contact
            useredit.address = req.body.address
            useredit.gender = req.body.gender
            useredit.password = req.body.password
          }
       await useredit.save()
       res.status(200).json({message:'user details updated successfully'})

    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.delete('/:id', authorization, async(req,res) => {
    try{

        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
        var user = await User.findById(req.params.id)
        if(!(user.is_deleted))
        {
          user.is_deleted = true
          await user.save()
          res.status(200).json({message:'User deleted successfully'})
        }
        res.status(409).json({message:'User already deleted or not found'})
    }catch(err)
    {
        res.status(500).json({message:err.message})
    }
    
})


function generateSessionKey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

async function authorization(request, response, next){
    try{
    const token = request.header("authorization");
    // Check if no token
    if (!token) {
        return response
            .status(401)
            .json({ msg: "No token, authorization denied" });
    }
    request.user = jwt.verify(token, config.jwtSecret);
    console.log(request.user.sessionId);
    let loggedin = await userSession.findOne({sessionId:request.user.sessionId, user_id:request.user.user_id})
    console.log(loggedin)
    if(!loggedin)
    {
        return response.status(200).json({message:"Please login....! "})
    }
    
            return next();	 
    }catch(err){
        return response.status(500).json({message:err.message})
    }
}

module.exports = router