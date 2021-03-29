const express = require('express')
const Subscribe = require('../models/subscribe')
// const userSession = require('../models/session')
const router = express.Router()
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const smtpTransport = require('nodemailer-smtp-transport');

let EMAIL = "info@finixtechnocrates.com"
let PASSWORD = "Inntechweb2020"
let MAIN_URL = "http://localhost:3000"

router.post('/newsub', async(req,res) => {
    try{ 
        var subobj = { 
            email : req.body.email
        }
        await Subscribe.create(subobj)
        await Nodemailer(subobj.email)
        return res.status(200).json({msg:`Subscribed`})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})



async function Nodemailer(email) {
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
            subject: 'Page Subscribe',
            text: 'Hi,This is a test mail sent using Nodemailer',
            html: `<h1>Some subscribe your page mail id ${email}</h1>`,
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