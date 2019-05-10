const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'kishorekumarnetala@gmail.com',
        subject: 'Welcome to the App',
        text: `Welcome to the app, ${name}. Let me know for any help`
    })
}

module.exports = {
    sendWelcomeEmail
}