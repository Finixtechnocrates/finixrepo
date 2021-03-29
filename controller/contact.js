const express = require('express')
const Contact = require('../models/contact')
// const userSession = require('../models/session')
const router = express.Router()
const util = require('../lib/util')
// const bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
// var config = require('../config/local')
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const smtpTransport = require('nodemailer-smtp-transport');

let EMAIL = "info@finixtechnocrates.com"
let PASSWORD = "Inntechweb2020"
let MAIN_URL = "http://localhost:3000"


router.post('/newcontact', async(req,res) => {
    try{ 
      if(!req.body.name){
        return res.status(400).json({message:"Please enter your name"})
      }
      if(!req.body.email){
        return res.status(400).json({message:"Please enter your email"})
      }
      if(!req.body.mobile){
        return res.status(400).json({message:"Please enter your mobile"})
      }
      if(!req.body.subject){
        return res.status(400).json({message:"Please enter subject"})
      }
      if(!req.body.message){
        return res.status(400).json({message:"Please enter message"})
      }

        var contactobj = {
            name : req.body.name,
            email : req.body.email,
            mobile: req.body.mobile,
            subject:req.body.subject,
            message: req.body.message    
        }
        await Nodemailer(contactobj,"Terrance")
        await Contact.create(contactobj)
         res.status(200).json({msg:`Contact added successfully`})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})


async function Nodemailer(contactobj) {
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
          html: `<h1>Someone want to contact us</h1><br><p1>Name=${contactobj.name}</p1>
                 <br><p1>Email=${contactobj.email}</p1><br><p1>Mobile=${contactobj.mobile}</p1>
                 <br><p1>Subject=${contactobj.subject}</p1><br><p1>Message=${contactobj.message}</p1>`,
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