const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//send welcome email    
const sendWelcomeEmail = (name,email)=>{
    sgMail.send({
        to : email,
        from : 'junhanngd1115@gmail.com',
        subject : "Welcome to Tasks API!",
        text : `Welcome to the app ${name}, hope you enjoy your stay!`

    })
}

//send cancel email
const sendCancelEmail = (name, email)=>{
    sgMail.send({
        to : email,
        from : 'junhanngd1115@gmail.com',
        subject : "Goodbye from Tasks API!",
        text : `Sorry to see you leave ${name}, hope you enjoyed your stay!`

    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}