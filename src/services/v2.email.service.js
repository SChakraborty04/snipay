//Using official Mailgun API for better deliverability and analytics
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'MAILGUN_API_KEY',url: 'https://api.eu.mailgun.net'});


const sendEmail =  (to,subject,text,html) =>{
    mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: "SniPay <snipay@no-reply.sandipan.ch>",
        to,
        subject,
        text,
        html,
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.error(err)); // logs any error
}


async function sendRegistrationEmail(userEmail,name){
    const subject = "Welcome to SniPay!";
    const text = `Hi ${name},\n\nThank you for registering at SniPay. We're excited to have you on board! If you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe SniPay Team`;
    const html = `<p>Hi ${name},</p><p>Thank you for registering at SniPay. We're excited to have you on board! If you have any questions, feel free to reach out to our support team.</p><p>Best regards,<br>The SniPay Team</p>`;
    sendEmail(userEmail,subject,text,html);
}

module.exports = {
    sendRegistrationEmail
}