const express = require('express')
const Order = require('../models/order')
const Movie = require('../models/movies')
const userSession = require('../models/session')
var jwt = require('jsonwebtoken');
var config = require('../config/local')

const router = express.Router()


router.post('/customer-order', authorization ,async (req, res)=>{
    try{
      if(!req.body.movie_id)
      {
          return res.status(400).json({message:'Please enter movie details'})
      }
      if(!req.body.slot_id)
      {
          return res.status(400).json({message:'Please enter valid slot'})
      }
      if(!req.body.date)
      {
          return res.status(400).json({message:'Please enter the date'})
      }
      if(!req.body.seats)
      {
           return res.status(400).json({message:'Please enter valid seats'})
      }

      var moviedetail = await Movie.findById({_id:req.body.movie_id})
      if((!moviedetail) || (moviedetail.is_deleted))
      {
           return res.status(404).json({message:'Movie not found'})
      }
      if(moviedetail.seats > 0)
      {
      var orderObj= {
          movie_id:req.body.movie_id,
          slot_id:req.body.slot_id,
          date: req.body.date,
          seats: req.body.seats,
          status:"CONFIRMED",
          user_id: req.user.user_id
      }
     let slotse =  await updateseats(req.body.movie_id, req.body.seats)
      if(slotse.status != 200)
      {
          return res.status(400).json({message:slotse.message})
      }
      await Order.create(orderObj)
      return res.status(200).json({message:'Movie booked successfully'})
    }
     return res.status(404).json({message:'Housefull no slots avaliable'})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
})


router.get('orderlist', authorization, async(req, res) =>{
    try{
        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }
        var orderlist = await Order.find()
        if(orderlist.length){
            return res.status(200).json({message:'Orderlist', data: orderlist})
        }
        return res.status(200).json({message:'Orderlist', data:[] })
         
    }catch(err){

    }
})

router.get('/:id', async(req, res) => {
    try{
        
      if(!req.params.id){
          res.status(400).json({message:'Please enter id'})
      }
      var orderdetail = await Order.findById(req.params.id).populate({select : 'movie_id' , path:{name:1, type:1, description:1}}).populate({select:'user_id', path:{name:1 , last_name:1, contact:1, gender:1}})
      if(orderdetail){
          res.status(200).json({data: moviedetail})
      }
      else{
          res.status(404).json({message:'Data not found'})
      }
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.put('/edit/:id', authorization, async(req, res)=>{
    try{

        if(req.user.user_type != 'ADMIN')
        {
           return res.status(401).json({message:"Invalid request"})
        }

        var orderedit = await Order.findById(req.params.id)
        if(orderedit){
            orderedit.movie_id= req.body.movie_id
            orderedit.user_id = req.body.user_id
            orderedit.slot_id = req.body.slot_id
            orderedit.status = req.body.status
            await orderedit.save()   
            return res.status(200).json({message:"Order updated successfully"})  
        }
        return res.status(404).json({message:'Order not found'})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
})


async function updateseats(movieId, seats){
    try{

        var moviedetail = await Movie.findById({_id:movieId})
        if(moviedetail)
        {
              moviedetail.seats = parseInt(moviedetail.seats-seats)
              await moviedetail.save()
              return {status:200, message:"Seats updated successfully"}
        }
        return {status:404, message:"Please enter valid movie details"}

    }catch(err){
        return {status:500, message:err.message}
    }
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