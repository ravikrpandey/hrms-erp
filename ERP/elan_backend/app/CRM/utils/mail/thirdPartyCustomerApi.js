
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || "hr@kiranautomation.com",
      pass: process.env.SMTP_PASS || "",
    },
  });
const send = (mailOptions, mail_id) => {
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response, mail_id);
      }
    });
  };

  const welcomeProposal = async (email,token) => {
    let mail_id = email;
   
    const mailOptions = {
      to: mail_id,
      subject: "Register On Portal",
      text: "You click on the below link",
      html: `
      https://dev552.gstsoftware.com/${token}
  `,
    };
    let response = await send(mailOptions, mail_id);
    return response;
  };
module.exports.sendMail = async (email,token) => {
    return welcomeProposal(email,token);
  };

