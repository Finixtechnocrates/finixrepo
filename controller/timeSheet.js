const express = require('express')
const TimeSheet = require('../models/timeSheet')
const router = express.Router()
var config = require('../config/local')



router.get('/list' , authorization, async(req, res) => {
    try{
        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
        var timeSheetList = await TimeSheet.find()
        if(timeSheetList)
        {
             res.status(200).json({msg:timeSheetList})
        }
        else{
            res.status(404).json({msg:[]})
        }
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


router.post('/addtime' , authorization, async(req, res) => {
    try{
        var timeObj = new TimeSheet({
            start_date : req.body.start_date,
            end_date : req.body.end_date,
            user_id : req.body.user_id,
            time_sheet : req.body.time_sheet
           })
           await TimeSheet.create(timeObj)
           res.status(200).json({msg:`Time Sheet Submitted Successfully`})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


router.put('/:id', authorization, async(req,res) =>{
    try{
      var timeSheetEdit = await TimeSheet.findOne({ _id:req.params.id , user_id : req.body.user_id  })
      if(timeSheetEdit){
            timeSheetEdit.start_date = req.body.start_date
            timeSheetEdit.end_date = req.body.end_date
            timeSheetEdit.user_id = req.body.user_id
            timeSheetEdit.time_sheet = req.body.time_sheet
          }
       await timeSheetEdit.save()
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



