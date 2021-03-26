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

        var contactobj = {
            name : req.body.name,
            email : req.body.email,
            mobile: req.body.mobile,
            subject:req.body.subject,
            message: req.body.message ,
            created_at: Date.now()   
        }
        await Nodemailer("hii","cvhsvh","Terrance")
        await Contact.create(contactobj)
         res.status(200).json({msg:`Contact added successfully`})
    }catch(err){
         res.status(500).json({message:err.message})
    }
})


async function Nodemailer(errmsg , funname, userinfo) {
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

        // let transporter = nodemailer.createTransport({
        //     service: "webmail",
        //     secure: true,
        //     port: 465,
        //     auth: {
        //       user: EMAIL,
        //       pass: PASSWORD,
        //     },
        //   });
          let MailGenerator = new Mailgen({
            theme: "cerberus",
            product: {
              name: errmsg,
              link: MAIN_URL,
            },
          });

          let resp= {
            body: {
             title:  funname ,
             intro: errmsg.stack,
             action: {
             button: {
                color: '#22BC66', // Optional action button color
                text: 'Check now',
                link: 'https://github.com/'
            }
          },
            outro: userinfo
        }
            // table: {
            //     data: [
            //       {
            //         FunctionName : funname,
            //         description: errmsg,
            //       },
            //     ],
            //   },
           //   outro: "Looking forward to do more business with you",
        
          };

          let mail = MailGenerator.generate(resp);
          let message = {
            from: EMAIL,
            to: EMAIL,
            subject: "Ecomm-server",
            html: mail,
          };

          transporter
          .sendMail(message)
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