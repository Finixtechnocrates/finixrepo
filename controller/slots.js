const express = require('express')
const Slot = require('../models/slots')
const userSession = require('../models/session')
const router = express.Router()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/local')



router.get('/list' , authorization, async(req, res) => {
    try{
        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
        var slotlist = await Slot.find()
        if(slotlist.length)
        {
             res.status(200).json({msg:slotlist})
        }
        else{
            res.status(404).json({msg:[]})
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/add', authorization, async(req,res) => {
    try{ 

        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
        var slot = new Slot({
             start_time : req.body.start_time,
             end_time : req.body.end_time,
            description: req.body.description,
            seats:req.body.seats    
        })
        await Slot.create(slot)
         res.status(200).json({msg:`slot added successfully`})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})

router.get('/:id', async(req, res) => {
    try{
      if(!req.params.id){
          res.status(400).json({message:'Please enter id'})
      }
      var slotdetail = await Slot.findById(req.params.id)
      if(slotdetail){
          res.status(200).json({data: moviedetail})
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
        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
      var slotedit = await Slot.findById(req.params.id)
      if(slotedit){
        slotedit.start_time = req.body.start_time,
        slotedit.end_time = req.body.end_time,
        slotedit.movie_id = req.body.movie_id
          }
       await slotedit.save()
       res.status(200).json({message:'slot details updated successfully'})

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
        var slot = await Slot.findByIdAndDelete(req.params.id)
        if(slot)
        {
        res.status(200).json({message:'Student deleted successfully'})
        }
        res.status(409).json({message:'student already deleted or not found'})
    }catch(err)
    {
        res.status(500).json({message:err.message})
    }
    
})

router.get('/slots', authorization, async(req, res) =>{
    try {
        if(!id) {
            return res.status(400).json("movie id required")
        } 
        var Days = []
        var d = new Date();
        var n = d.getDay()
        var time = d.getHours()
        var TIME_BEFORE_SLOT_BOOKING_GETS_CLOSED = 2
        var currenttime = (time > 12) ? (time-12 + TIME_BEFORE_SLOT_BOOKING_GETS_CLOSED) : (time + TIME_BEFORE_SLOT_BOOKING_GETS_CLOSED)
        var SLOT_DAYS = 2
        for(var i= 0 ; i<=SLOT_DAYS; i++)
        {
            if(n <= 6)
            {       
            Days.push(n)
            }
            else{
                n = n-6
                Days.push(n)
            }
            n++;
        } 
        var Slotlist = []
        for(var a = 0; a<=(Days.length-1); a++)
        {
            var obj ={}
           if(a == 0)
           {
            let response = await Slot.find({ days:{$in: Days[a]} , movie_id: id},{"start_time":1 , "end_time":1})
            var arr2 = []
             var arr = _.pluck(response, 'start_time')
             for(var k=0; k<=(arr.length-1) ; k++ )
             {
                 var val = parseInt(arr[k])

                 if(val >= currenttime)
                 {
                      arr2.push(response[k])
                 }                 
             }
                obj["day"]= Days[a];
                obj["slot"]= arr2;
                Slotlist.push(obj)
           }  
           else
           {
            let response = await Slot.find({ days:{$in: Days[a]}, user_id: id},{"start_time":1 , "end_time":1})
                obj["day"]= Days[a];
                obj["slot"]= response;
                Slotlist.push(obj)
           }
        }
       
       if(Slotlist.length)
           {
            return res.status(200).json({Slots: Slotlist  })
           }
        else
        {
            return res.status(200).json({Slots: [] })
        }       
    }catch(err){
        return res.status(500).json({message:err.message})
    }
})


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
    console.log(request.user);
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