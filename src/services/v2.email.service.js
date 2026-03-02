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

async function sendTransactionEmail(userEmail,name,amount,account,type,reward=0){
    const subject = type === "DEBIT" 
        ? `Transaction Debit Notification - Rewards Earned!`
        : `Transaction Credit Notification`;
    
    let rewardText = reward > 0 ? `\n\nBonus: You've earned ${reward} reward points for this transaction!` : '';
    let rewardHtml = reward > 0 ? `<p><strong>Bonus:</strong> You've earned <strong>${reward} reward points</strong> for this transaction!</p>` : '';
    
    const text = `Hi ${name},\n\nYour account has been ${type === "DEBIT" ? "debited" : "credited"} with an amount of ${amount} ${account.currency}.${rewardText} If you have any questions, please contact our support team.\n\nBest regards,\nThe SniPay Team`;
    const html = `<p>Hi ${name},</p><p>Your account has been ${type === "DEBIT" ? "debited" : "credited"} with an amount of <strong>${amount} ${account.currency}</strong>.</p>${rewardHtml}<p>If you have any questions, please contact our support team.</p><p>Best regards,<br>The SniPay Team</p>`;
    
    sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail
}