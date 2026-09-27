const nodemailer = require('nodemailer');
const db = require('../models/index'); 

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true, // true for 465, false for 587
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// /**
//  * Send email function
//  * @param {Object} options
//  * @param {string|string[]} options.to - recipient email(s)
//  * @param {string} options.subject - email subject
//  * @param {string} options.html - email content (HTML)
//  */
// exports.sendMail = async ({ to, subject, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Elite Webinar" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log('✅ Mail sent:', info.messageId);
//     return true;
//   } catch (err) {
//     console.error('❌ Mail error:', err.message);
//     throw new Error('Mail sending failed');
//   }
// };


/**
 * Get transporter dynamically using entity ID
 */
const getTransporterByEntityId = async (entityId) => {
  const entityConfig = await db.entityMaster.findByPk(entityId);

  if (!entityConfig) {
    throw new Error(`Entity not found with ID ${entityId}`);
  }

  // 🔹 SMTP Transporter Configuration
  const transporter = nodemailer.createTransport({
    host: entityConfig.smtp_server_address,
    port: entityConfig.smtp_port_number,
    secure: Number(entityConfig.smtp_port_number) === 465,
    auth: {
      user: entityConfig.smtp_username,
      pass: entityConfig.smtp_password,
    },
    logger: true,
    debug: true,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
  } catch (error) {
    console.error('❌ SMTP connection failed!');
    console.error('Error Code:', error.code);
    console.error('Command:', error.command);
    console.error('Response:', error.response);
    throw new Error('SMTP connection verification failed!');
  }

  return {
    transporter,
    fromEmail: entityConfig.smtp_username,
    entityName: entityConfig.entity_name,
  };
};

/**
 * Send Email (with fixed subject)
 * @param {Object} options
 * @param {string} options.entityId - which entity’s SMTP to use
 * @param {string|string[]} options.to - recipient email(s)
 * @param {string} options.html - email HTML body
 */
exports.sendMail = async ({ entityId, to, html }) => {
  try {
    // 🔹 Get entity-based transporter
    const { transporter, fromEmail } = await getTransporterByEntityId(entityId);

    // 🔹 Send email with FIXED subject
    const info = await transporter.sendMail({
      from: `"Elite Webinar" <${fromEmail}>`,
      to,
      subject: 'Elite Webinar Notification', // ✅ Fixed Subject
      html,
    });

    console.log('✅ Mail sent successfully:', info.messageId);
    return true;
  } catch (err) {
    console.error('❌ Mail sending failed:', err.message);
    throw new Error('Mail sending failed');
  }
};
