const express = require('express')
const Contact = require('../models/contact')
// const userSession = require('../models/session')
const router = express.Router()
// const bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
// var config = require('../config/local')


router.post('/newcontact', async(req,res) => {
    try{ 

        var contactobj = {
            name : req.body.name,
            email : req.body.email,
            mobile: req.body.mobile,
            subject:req.body.subject,
            message: req.body.message ,
            created_at: Date.now()   
        }
        await Contact.create(contactobj)
         res.status(200).json({msg:`Contact added successfully`})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})

module.exports = router