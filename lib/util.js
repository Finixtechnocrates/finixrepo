const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const smtpTransport = require('nodemailer-smtp-transport');
let EMAIL = "info@finixtechnocrates.com"
let PASSWORD = "Inntechweb2020"


const Nodemailer = async (email , userdetail) =>{
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
            to: `${email}`,
            subject: 'User Registered',
            text: 'Hi,This is a test mail sent using Nodemailer',
            html: `<p>Congratulations you're registered successfully. Kindly use Emp Number <b> ${userdetail.emp_number} </b> and password <b>${userdetail.password} </b> at the time of login</p>
                     <br>
                     <p><b>Thanks & Regards,</b></p>
                     <p><b>Finix Technocrates</b></p>`,
          };
         transporter.sendMail(mailContent).then(() => {
            console.info("Email send");
          }).catch((error) => console.error(error));
    }catch (error) {
        console.error("Nodemailer error >>>>",error);
        throw new Error(error);
    }
}

module.exports = Nodemailer