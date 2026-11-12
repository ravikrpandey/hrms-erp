const nodemailer = require("nodemailer");
// const dotenv = require('dotenv');
// dotenv.config();

module.exports.mailsend = async (body, mail_data) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER || 'hr@kiranautomation.com',
      pass: process.env.SMTP_PASS || ''
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