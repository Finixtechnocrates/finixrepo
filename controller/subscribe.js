const express = require('express')
const Subscribe = require('../models/subscribe')
// const userSession = require('../models/session')
const router = express.Router()

router.post('/newsub', async(req,res) => {
    try{ 
        var subobj = { 
            email : req.body.email
        }
        await Subscribe.create(subobj)
         res.status(200).json({msg:`Subscribed`})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})

module.exports = router