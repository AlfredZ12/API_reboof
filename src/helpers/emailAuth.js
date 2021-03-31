
const nodemailer = require('nodemailer');


const emailauth = {};
//configurations Transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    service: 'Gmail',
    auth: {
        user: 'jose.nunez181930@potros.itson.edu.mx',
        pass: 'sinoesque1'
    }
});
//sendEmail Confirmation
emailauth.sendEmail = async (email, name, code) => {
    await transporter.sendMail({
        from: 'jose.nunez181930@potros.itson.edu.mx',
        to: email,
        subject: 'Welcome to Reboof',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Congratulations, your account it's confirmed. </p>
        <span> Email: ${email} </span>
        <a href=https://reboof.herokuapp.com/confirm/${code}> Click here</a>
        </div>`,

    })
};
module.exports = emailauth;