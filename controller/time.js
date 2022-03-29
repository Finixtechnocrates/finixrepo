const express = require('express')
const router = express.Router()
var config = require('../config/local')
var jwt = require('jsonwebtoken');
const userSession = require('../models/session')
const Time = require('../models/time');



router.get('/list' , authorization, async(req, res) => {
    try{
        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
        var timeList = await Time.find()
        if(timeList)
        {
             res.status(200).json({msg:timeList})
        }
        else{
            res.status(404).json({msg:[]})
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


router.get('/detail' , authorization, async(req, res) => {
    try{
        console.log("USER", Time)
        const timeDetail = await Time.find({user_id:req.user.user_id}).populate({path:'user_id' , select:{name:1, emp_number:1, contact:1, email:1 , role:1, address:1, gender:1, _id:0  }})
        let Days = ["Monday" , "Tuesday", "Wednesday", "Thursday", "Friday"]
        
        timeDetail.map((data)=>{
            let arr = [];
            for (let i =0; i< Days.length ; i++){
                let val = data.time_sheet.find((va)=>{ return va.day === Days[i] })
                console.log(i, val)
                arr.push(val)
            }
            data.time_sheet = arr
        })
        if(timeDetail)
        {
             res.status(200).json({data:timeDetail})
        }
        else{
            res.status(200).json({msg:[]})
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


router.post('/addtime' , authorization, async(req, res) => {
    try{
        let arr = []
        if(req.body.time_sheet.length){
            let time_Sheet = req.body.time_sheet[0]
           for(var key in time_Sheet){
               let obje = {
                   day:key,
                   time: time_Sheet[key]
               }
               arr.push(obje)
           }
        }
        console.log("ARR", arr)
        var time = new Time({
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            user_id: req.user.user_id,
            time_sheet: arr
          })
         await Time.create(time)
        res.status(200).json({msg:`Time Sheet Submitted Successfully`})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


router.put('/:id', authorization, async(req,res) =>{
    try{
      var TimeEdit = await Time.findOne({ _id:req.params.id , user_id : req.body.user_id  })
      if(TimeEdit){
            TimeEdit.start_date = req.body.start_date
            TimeEdit.end_date = req.body.end_date
            TimeEdit.user_id = req.user.user_id
            TimeEdit.time_sheet = req.body.time_sheet
          }
       await TimeEdit.save()
       res.status(200).json({message:'Time Sheet details updated successfully'})
    }catch(err){
        res.status(500).json({message:err.message})
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
    console.log("SVGFV",request.user);
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



