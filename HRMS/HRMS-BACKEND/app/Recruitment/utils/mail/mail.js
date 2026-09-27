const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const db = require("../../../models/index");

const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");

const getTransporterByEntityId = async (entityId) => {
  const entityConfig = await db.entityMaster.findByPk(entityId);
  if (!entityConfig) {
    throw new Error(`Entity not found with ID ${entityId}`);
  }
  const transporter = nodemailer.createTransport({
    host: entityConfig.smtp_server_address,
    SSL: true,
    port: entityConfig.smtp_port_number,
    requireTLS: true,
    auth: {
      user: entityConfig.smtp_username,
      pass: entityConfig.smtp_password,
    },
    logger: true,
    debug: process.env.SMTP_DEBUG || false,
    tls: {
      rejectUnauthorized: false,
    },
  });
  return {
    transporter,
    fromEmail: entityConfig.smtp_username,
    entity_name: entityConfig.entity_name,
  };
};

module.exports.sendJobResultMail = async function (
  email_to,
  first_name,
  result,
  entityId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Job Descripition Result!",
      html: `Hello ${first_name} , You are ${result}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendinterviewSchedulesMail = async function (
  email_to,
  first_name,
  last_name,
  entityId,
  interviewStatus,
  interview_link,
  interview_time
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);

    let emailBody = `
      Hello ${first_name} ${last_name},<br><br>
      Your interview has been scheduled!<br>`;

    if (interview_link) {
      emailBody += `
          Your Interview Status is ${interviewStatus} and Interview Link is : <a href="${interview_link}">${interview_link}</a><br>
          Please be available at: ${interview_time}<br>`;
    }
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Interview Scheduled!",
      html: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendDynamicMail = async function (
  email_to,
  first_name,
  last_name,
  entityId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Travel Request!",
      html: `
      <p>Dear ${first_name} ${last_name},</p>
      <p>Pls Approve the travel Requested created today</strong>.</p>
      <p>Best regards,</p>
      <p>ZYNO Team</p>
    `,
    };

    console.log("mail send", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendmailsforcompanydetails = async function (
  email_to,
  first_name,
  last_name,
  email_urlID,
  entityId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Complete your previous Employer Details!",
      html: `Hello please complete the Employer details of ${first_name} ${last_name} : <a target = "_blank" href="${email_urlID}">Company Details</a> !`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendmailsfordocumentsdetails = async function (
  email_to,
  first_name,
  last_name,
  email_urlID,
  entityId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Upload documents Details!",
      html: `Hello ${first_name} ${last_name} , Please Upload your complete documents details <a target = "_blank" href="${email_urlID}">Document Details</a> !`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendCandidateOfferMail = async function (
  email_to,
  first_name,
  last_name,
  link_urll,
  entityId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Offer Letter!",
      html: `Hello ${first_name} ${last_name} , Please Accept your Offer <a target = "_blank" href="${link_urll}">Offer Details</a> !`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendMailtoFillCandidatedetails = async function (
  email_to,
  first_name,
  last_name,
  link_urll,
  entityId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Complete your Details!",
      html: `Hello ${first_name} ${last_name} , Please fill your complete details <a target = "_blank" href="${link_urll}">Complete Your Details</a> !`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendMailPO = async function (
  po_detail,
  entityId,
  item_detail,
  service_detail,
  employee_detail,
  designation,
  alt_email
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const entityConfig = await db.entityMaster.findByPk(entityId);

    const rawDate = new Date(employee_detail.updatedAt).toString();
    const employeeSignatureDate = rawDate.split(" GMT")[0];

    const pdfDir = "uploaded_files";
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const htmlFilePath = path.resolve(__dirname, "../../templates/po.html");
    const html = fs.readFileSync(htmlFilePath, "utf-8");

    const replaceNullWithEmpty = (str) => (str == null ? "" : str);

    let serviceItemTable = "";
    if (item_detail || service_detail) {
      serviceItemTable = generateServiceItemTable(
        item_detail || [],
        service_detail || [],
        po_detail
      );
    }
    const htmlWithData = html
      .replace("{po_number}", replaceNullWithEmpty(po_detail.po_number))
      .replace("{po_date}", replaceNullWithEmpty(po_detail.po_date))
      .replace("{entity_name}", replaceNullWithEmpty(entity_name))
      .replace(
        "{registered_office}",
        replaceNullWithEmpty(entityConfig.registered_office)
      )
      .replace(
        "{smtp_server_address}",
        replaceNullWithEmpty(entityConfig.smtp_server_address)
      )
      .replace("{logo}", replaceNullWithEmpty(entityConfig.logo))
      .replace("{vendor_name}", replaceNullWithEmpty(po_detail.vendor_name))
      .replace("{phone_code}", replaceNullWithEmpty(po_detail.phone_code))
      .replace(
        "{vendor_address}",
        replaceNullWithEmpty(po_detail.vendor_address)
      )
      .replace(
        "{vendor_contact_num}",
        replaceNullWithEmpty(po_detail.vendor_contact_num)
      )
      .replace("{vendor_email}", replaceNullWithEmpty(po_detail.vendor_email))
      .replace("{branch_name}", replaceNullWithEmpty(po_detail.branch_name))
      .replace(
        "{branch_contact_person_name}",
        replaceNullWithEmpty(po_detail.branch_contact_person_name)
      )
      .replace(
        "{branch_address}",
        replaceNullWithEmpty(po_detail.branch_address)
      )
      .replace(
        "{branch_contact_no}",
        replaceNullWithEmpty(po_detail.branch_contact_no)
      )
      .replace("{branch_email}", replaceNullWithEmpty(po_detail.branch_email))
      .replace("{serviceItemTable}", replaceNullWithEmpty(serviceItemTable))

      // 👇 Add these lines to inject employee details
      .replace(
        "{employee_name}",
        replaceNullWithEmpty(employee_detail?.employee_name)
      )
      .replace(
        "{employee_designation}",
        replaceNullWithEmpty(designation?.designation_name)
      )
      .replace(
        "{employee_Signature_date}",
        replaceNullWithEmpty(employeeSignatureDate)
      )
      .replace(
        "{employee_signature}",
        replaceNullWithEmpty(employee_detail?.digital_signature)
      );

    const pdfBuffer = await generatePDF(htmlWithData);
    // const cur_date = new Date().toLocaleDateString('en-GB').replace(/\//g, '_');
    // const pdfFilename = `${cur_date}_purchase_order.pdf`;

    const timestamp = Date.now();
    const pdfFilename = `${timestamp}_purchase_order.pdf`;

    const pdfPath = path.join(pdfDir, pdfFilename);
    fs.writeFileSync(pdfPath, pdfBuffer);
    await db.purchase_order.update(
      { pdf_data: pdfFilename },
      { where: { id: po_detail.id } }
    );

    const obj = nodemailer.createTransport({
      host: "smtp.office365.com",
      // port: 25,
      port: 587,
      secure: false,
      auth: {
        user: "procurement@mects.co.mz",
        pass: "!M@9^qR123",
      },
      logger: true,
      debug: process.env.SMTP_DEBUG || false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `${entity_name} <procurement@mects.co.mz>`,
      to: [po_detail.vendor_email, alt_email].filter(Boolean),
      subject: "Purchase Order!",
      html: `<p> Caro, ${po_detail.vendor_name} </p><br>
<p>Espero que este e-mail o encontre bem.</p>
<p>Temos o prazer de informar que aprovámos a Ordem de Compra  ${po_detail.po_number} para ${po_detail.po_category}. Encontre os detalhes no link abaixo:</p>
<p>Confirme a receção desta Ordem de Compra e forneça uma data de entrega estimada para os artigos/serviços listados. Caso haja alguma dúvida ou discrepância, não hesite em contactar-me directamente.</p>
<p>Obrigado pela sua pronta atenção a este assunto. Estamos ansiosos por receber os produtos/serviços de acordo com os termos acordados.</p>
<p> Cumprimentos </p>`,
      attachments: [
        {
          filename: "purchase order.pdf",
          content: pdfBuffer,
        },
      ],
    };

    const info = await obj.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

function generateServiceItemTable(
  Item_Detail,
  Service_Detail,
  itemResults,
  serviceResults,
  response
) {
  let tableHTML = "";

  if (Service_Detail && Service_Detail.length > 0) {
    tableHTML += `
            <table style="width:100%">
                <tr>
                    <th>S.NO</th>
                    <th>Service Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Tax</th>
                    <th>Amount</th>
                </tr>`;
    let totalQty = 0;

    Service_Detail.forEach((item, index) => {
      totalQty = totalQty + item.quantity;
      tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.MASTER_SERVICE.service_name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit_price}</td>
                    <td>${item.tax}</td>
                    <td>${item.total_mvp}</td>
                </tr>`;
    });
    tableHTML += `
        <tr>
         <td colspan="6">IVA (16%)</td>
         <td><b>${response.total_tax}</b></td>
        </tr>
        <tr>
         <td colspan="6">Total (Including Tax)</td>
         <td><b>${response.total_purchase}</b></td>
        </tr>
       `;
    tableHTML += `</table><br><br>`;
  }

  if (Item_Detail && Item_Detail.length > 0) {
    tableHTML += `
            <table style="width:100%">
                <tr>
                    <th>S.NO</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Tax</th>
                    <th>Amount</th>
                </tr>`;

    let totalQty = 0;

    Item_Detail.forEach((item, index) => {
      totalQty = totalQty + item.quantity;
      tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.MASTER_ITEM.item_name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit_price}</td>
                    <td>${item.tax}</td>
                    <td>${item.total_mvp}</td>
                </tr>`;
    });
    tableHTML += `
        <tr>
         <td colspan="6">IVA (16%)</td>
         <td><b>${response.total_tax}</b></td>
        </tr>
        <tr>
        <td colspan="6">Total (Including Tax)</td>
        <td><b>${response.total_purchase}</b></td>
        </tr>
       `;
    tableHTML += `</table><br><br>`;
  }

  return tableHTML;
}
// if (get_vendorData && !sentEmails.has(get_vendorData.email)) {
//   const link = `${site_url}?vendor_id=${vendorId}&nego_id=${Negotiation_Id}&procurement_id=${procurement_id}&procurement_type=${procurement_type}&renego_status=${re_negotiation}`;
//   await transport.mailsend({
//     from: smtpUsername,
//     to: get_vendorData.vendor_email,
//     subject: "Link for Request for Proposal",
//     html: `<p><strong> Hi ${get_vendorData.vendor_name}</strong> <br> <p style="padding: 3%; background-image: url('https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg');">
//                  Simply click the button below to link for request for proposal ${get_vendorData.vendor_email} <a href="${link}">
//                 <button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color: blue;"> Click Me </button></a></p>`,
//   });
//   sentEmails.add(get_vendorData.vendor_email);
// }

module.exports.sendMailRFP = async function (
  site_url,
  vendorId,
  Negotiation_Id,
  procurement_id,
  procurement_type,
  re_negotiation,
  get_vendorData
) {
  try {
    const link = `${site_url}?vendor_id=${vendorId}&nego_id=${Negotiation_Id}&procurement_id=${procurement_id}&procurement_type=${procurement_type}&renego_status=${re_negotiation}`;
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(get_vendorData.entity_id);
    // const entityConfig = await db.entityMaster.findByPk(get_vendorData.entity_id);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: get_vendorData.vendor_email,
      subject: "Link for Request for Proposal",
      html: `<p><strong> Hi ${get_vendorData.vendor_name}</strong> <br> <p style="padding: 3%; background-image: url('https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg');"> 
                 Simply click the button below to link for request for proposal ${get_vendorData.vendor_email} <a href="${link}">
                <button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color: blue;"> Click Me </button></a></p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailOptions);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendemp = async function (
  approvel_status,
  name,
  getdata,
  email_id
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(getdata.entity_id);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_id.emp_personal_email,
      subject: "Link for Approval",
      html: `hello ${name.first_name} your resignation was ${approvel_status}`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailOptions);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendRFPMail = async function (
  site_url,
  vendorId,
  Rfp_Number,
  procurement_type,
  get_vendorData
) {
  try {
    const link = `${site_url}?vendor_id=${vendorId}&Rfp_no=${Rfp_Number}&type=${procurement_type}`;
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(get_vendorData.entity_id);
    // const entityConfig = await db.entityMaster.findByPk(get_vendorData.entity_id);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: get_vendorData.vendor_email,
      subject: "Link for Request for Proposal",
      html: `<p><strong> Hi ${get_vendorData.vendor_name}</strong> <br> <p style=" padding: 3%; background-image: url('https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg');"> 
      Simply click the button below to link for request for proposal ${get_vendorData.vendor_email} <a href="${link}">
     <button class="btn" style="padding: 6px 8px; border-radius: 7px;cursor: pointer; border-color: blue; color: white; background-color: blue;"> Click Me </button></a></p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailOptions);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendCandidateonboardingmail = async function (
  email_to,
  first_name,
  last_name,
  link_details,
  entityId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(entityId);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: email_to,
      subject: "Onboarding Completed!",
      html: `Hello ${first_name} ${last_name} , You have successfully onboarded.<br>Please login your web panel through <a target = "_blank" href="${link_details?.web_url}">Zyno Group!</a> <br>And your userID is :${link_details?.emp_code} and Password is : ${link_details?.password}.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

//////////////////////////////////////////////////////
module.exports.sendPassLink = async function (
  findUser,
  webLink,
  encryptedUserId
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(findUser.primary_entity_id);

    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: findUser.employee_official_email,
      subject: "Reset Password Link",
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p><strong>Subject:</strong> Password Reset Request!</p>

          <p>Hi ${findUser?.first_name},</p>

          <p>We have received a request to reset your password.</p>

          <p>Kindly click on the link provided below to reset your password:</p>

          <p>
            <a href="${webLink}?id=${encryptedUserId}" style="color: #eb8b2d;">
              ${webLink}?id=${encryptedUserId}
            </a>
          </p>

          <p>
            Your <strong>e-mail id</strong> is: <br>
            ${findUser?.employee_official_email}
          </p>

          <p style="font-size: 14px; color: #888;">
            If you did not request to reset the password, kindly ignore this e-mail.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (info && info.accepted && info.accepted.length > 0) {
      return { success: true };
    } else {
      return {
        success: false,
        message: "Mail sending failed, possibly invalid configuration!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Exception occurred while sending email.",
      error: error.message,
    };
  }
};

module.exports.sendpassChanged = async function (findUser) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(findUser.primary_entity_id);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: findUser.employee_official_email,
      subject: "Password changed successfully",
      html: ` <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
    <p><strong>Subject:</strong> Password Changed Successfully!</p>

    <p>Hi ${findUser?.first_name},</p>

    <p>Your password has been updated successfully, If you did not made this change then kindly contact support immediately.</p>


    <p style="font-size: 14px; color: #888;">
      Thanks.
    </p>
  </div>`,
    };
    const info = await transporter.sendMail(mailOptions);
    if (info && info.accepted && info.accepted.length > 0) {
      return { success: true };
    } else {
      return {
        success: false,
        message: "Mail sending failed, possibly invalid configuration!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Exception occurred while sending email.",
      error: error.message,
    };
  }
};

module.exports.sendTemplateToUser = async function (findUser) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterByEntityId(findUser.primary_entity_id);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: findUser.employee_official_email,
      subject: "Password changed successfully",
      html: ` <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
    <p><strong>Subject:</strong> Password Changed Successfully!</p>

    <p>Hi ${findUser?.first_name},</p>

    <p>Your password has been updated successfully, If you did not made this change then kindly contact support immediately.</p>


    <p style="font-size: 14px; color: #888;">
      Thanks.
    </p>
  </div>`,
    };
    const info = await transporter.sendMail(mailOptions);
    if (info && info.accepted && info.accepted.length > 0) {
      return { success: true };
    } else {
      return {
        success: false,
        message: "Mail sending failed, possibly invalid configuration!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Exception occurred while sending email.",
      error: error.message,
    };
  }
};


module.exports.getTransporterByEntityId = getTransporterByEntityId;