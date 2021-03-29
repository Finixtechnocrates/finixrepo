const express = require('express')
var multer  = require('multer')
const Carrer = require('../models/career')
// const userSession = require('../models/session')
const router = express.Router()
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const smtpTransport = require('nodemailer-smtp-transport');

let EMAIL = "info@finixtechnocrates.com"
let PASSWORD = "Inntechweb2020"
let MAIN_URL = "http://localhost:3000"


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
        await Nodemailer(carrerobj)
         res.status(200).json({message:"New Career Created successfully"})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})

async function Nodemailer(carrerobj) {
  try{
      console.info("Nodemailer start >>>>>>>>>>>>>>>>>>>>")

      const transporter = nodemailer.createTransport(smtpTransport({
          host:'mail.finixtechnocrates.com',
          secureConnection: false,
          tls: {
            rejectUnauthorized: false
          },
          port: 465,
          auth: {
              user: EMAIL,
              pass: PASSWORD,
        }
      })); 
        let mailContent={
          from: 'Finix <info@finixtechnocrates.com>',
          to: 'Finix <info@finixtechnocrates.com>',
          subject: 'Contact',
          text: 'Hi,This is a test mail sent using Nodemailer',
          html: `<h1>Someone send resume to us</h1><br><p1>Name=${carrerobj.name}</p1>
                 <br><p1>Designation=${carrerobj.designation}</p1><br><p1>Applyfor=${carrerobj.apply}</p1>
                 <br><p1>Email=${carrerobj.email}</p1><br><p1>relocation=${carrerobj.relocation}</p1>`,
         attachments: [
                  {
                      filename: `${carrerobj.resume}`,
                      path: './uploads/' + `${carrerobj.resume}`
                  }
              ]
        };
       transporter
        .sendMail(mailContent)
        .then(() => {
          console.info("Email send");
        })
        .catch((error) => console.error(error));
        

    }catch (error) {
        console.error("Nodemailer error >>>>",error);
        throw new Error(error);
    }
}

module.exports = router