const nodemailer = require('nodemailer');

const sendEmail = (email, verificationToken) => {
  const emailData = {
    to: email,
    from: 'mytestnodejs@meta.ua',
    subject: 'Email verification',
    html: `<a href='${process.env.Link}users/verify/${verificationToken}'><strong>Verify email</strong></a>`,
  };

  const config = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: 'mytestnodejs@meta.ua',
      pass: process.env.PASSWORD,
    },
  };

  const transport = nodemailer.createTransport(config);

  transport
    .sendMail(emailData)
    .then(() => console.log('Email send success'))
    .catch(error => console.log(error.message));
};

module.exports = sendEmail;
