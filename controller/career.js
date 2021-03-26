const express = require('express')
var multer  = require('multer')
const Carrer = require('../models/career')
// const userSession = require('../models/session')
const router = express.Router()

// const bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
// var config = require('../config/local')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  var upload = multer({
      storage:storage
  })
  


router.post('/newcareer', upload.single('file'), async(req,res) => {
    try{ 

        var carrerobj = {
            name: req.body.name,
           designation: req.body.designation,
           apply: req.body.apply,
           email: req.body.email,
          relocation: req.body.relocation,
          resume: req.file.originalname,
            created_at: Date.now()   
        }
        await Carrer.create(carrerobj)
         res.status(200).json({message:"New Career Created successfully"})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})

module.exports = router