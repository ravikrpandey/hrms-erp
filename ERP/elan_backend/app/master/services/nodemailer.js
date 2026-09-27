const nodemailer = require('nodemailer');
const db = require('../../models');

const getTransporterByEntityId = async (entityId) => {
  const entityConfig = await db.entityMaster.findByPk(entityId);

  if (!entityConfig) {
    throw new Error(`Entity not found with ID ${entityId}`);
  }

  const transporter = nodemailer.createTransport({
    host: entityConfig.smtp_server_address,
    port: entityConfig.smtp_port_number,
    secure: entityConfig.smtp_port_number === 465,
    auth: {
      user: entityConfig.smtp_username,
      pass: entityConfig.smtp_password
    },
    logger: true,
    debug: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  return {
    transporter,
    fromEmail: entityConfig.smtp_username,
    entity_name: entityConfig.entity_name
  };
};

module.exports.mailsend = async (body, entityId) => {
  try {
    const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);

    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      ...body
    };

    const mailInfo = await transporter.sendMail(mailOptions);

    if (!mailInfo) {
      console.log("Error occurred while sending email");
      return false;
    } else {
      console.log("Message sent successfully!");
      return mailInfo;
    }
  } catch (error) {
    console.error('Error occurred while sending email:', error);
    return false;
  }
};
