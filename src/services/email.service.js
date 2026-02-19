//Depreciated version as it used SMTP
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // Start unencrypted, upgrade via STARTTLS
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error,success)=>{
    if(error){
        console.error("Error connecting to email server: ",error)
    }
    else{
        console.log("Successfully connected to email server.")
    }
})

const sendEmail = async (to,subject,text,html) =>{
    try{
        const info = await transporter.sendMail({
            from: 'OkoPay <okopay@no-reply.sandipan.ch>',
            to,
            subject,
            text,
            html,
        })
        console.log('Message sent: %s',info.messageId);
        console.log('Preview URL: %s',nodemailer.getTestMessageUrl(info));
    }catch(e){
        console.log('Error sending email: ',e)
    }
}


async function sendRegistrationEmail(userEmail,name){
    const subject = "Welcome to OkoPay!";
    const text = `Hi ${name},\n\nThank you for registering at OkoPay. We're excited to have you on board! If you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe OkoPay Team`;
    const html = `<p>Hi ${name},</p><p>Thank you for registering at OkoPay. We're excited to have you on board! If you have any questions, feel free to reach out to our support team.</p><p>Best regards,<br>The OkoPay Team</p>`;
    await sendEmail(userEmail,subject,text,html);
}


module.exports = {
    sendRegistrationEmail
}