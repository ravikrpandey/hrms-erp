const nodemailer = require("nodemailer");
// const dotenv = require('dotenv');
// dotenv.config();

module.exports.mailsend = async (body, mail_data) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
      user: 'elitemindz99@gmail.com',
      pass: 'fundvpjsachxfvbr'
    },
    logger: true,
    debug: process.env.SMTP_DEBUG || false,
    tls: {
      rejectUnauthorized: false,
    },
  });
  try {
    const mailInfo = await transporter.sendMail(body);
    console.log('Email sent successfully!');
    return mailInfo;
  } catch (error) {
    console.log("Error occurred while sending email:");
    console.error(error);
    return false;
  }
};