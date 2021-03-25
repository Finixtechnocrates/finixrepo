const express = require('express')
const Movie = require('../models/movies')
const router = express.Router()

router.get('/list' , async(req, res) => {
    try{
        var movielist = await Movie.find()
        if(movielist.length)
        {
             res.status(200).json({msg:movielist})
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
        var movie = new Movie({
             name : req.body.name,
            movie_type : req.body.movie_type,
            description: req.body.description,
            seats:req.body.seats    
        })
        await Movie.create(movie)
         res.status(200).json({msg:`${req.body.name} added successfully`})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})

router.get('/:id', async(req, res) => {
    try{
      if(!req.params.id){
          res.status(400).json({message:'Please enter id'})
      }
      var moviedetail = await Movie.findById(req.params.id)
      if(moviedetail){
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
      var movieedit = await Movie.findById(req.params.id)
      if(movieedit){
        movieedit.name = req.body.name,
        movieedit.movie_type = req.body.movie_type,
        movieedit.description = req.body.description,
        movieedit.seats = req.body.seats 
          }
       await movieedit.save()
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
        var movie = await Movie.findByIdAndDelete(req.params.id)
        if(movie)
        {
        res.status(200).json({message:'Student deleted successfully'})
        }
        res.status(409).json({message:'student already deleted or not found'})
    }catch(err)
    {
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