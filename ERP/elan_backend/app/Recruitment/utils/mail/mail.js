const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const db = require("../../../models/index");

const path = require('path');
const pdf = require('html-pdf');
const fs = require('fs');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const { encrypt, decrypt } = require("../../../utils/crypto");


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
            pass: entityConfig.smtp_password
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
    entityId,
) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: email_to,
            subject: "Job Descripition Result!",
            html: `Hello ${first_name} , You are ${result}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}


module.exports.sendRFPMailRENegoService = async function (
    site_url, vendorId, Negotiation_Id, procurement_id, procurement_type, re_negotiation, get_vendorData
) {
    try {
        const link = `${site_url}?vendor_id=${vendorId}&nego_id=${Negotiation_Id}&procurement_id=${procurement_id}&procurement_type=${procurement_type}&renego_status=${re_negotiation}`;
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(get_vendorData.entity_id);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: get_vendorData.vendor_email,
            subject: "Negotiation Proposal for [Product/Service] - ELAN",
            html: `<p>Dear ${get_vendorData.vendor_name},</p>
<p>I hope this email finds you well.</p>
<p>I am writing to discuss the prices and terms of our potential business relationship for the [Product/Service]. We highly value the quality and reliability of your offerings, and we believe that with some adjustments, we can further strengthen our partnership. Please find our proposed terms in the link below:</p>
<p>${get_vendorData.vendor_email} <a href="${link}">
                    <button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color: blue;">Click Me</button></a></p>
<p>We understand that negotiations are a process of mutual concessions, and we are open to discussing these proposals in more detail to reach a mutually beneficial agreement. Please let us know your thoughts on the proposed adjustments and if there are any additional considerations we should take into account.</p>
<p>We look forward to your positive response and to continuing our successful collaboration.</p>
<p>Best regards,</p>`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}


module.exports.sendinterviewSchedulesMail = async function (
    email_to,
    first_name,
    last_name,
    entityId,
) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: email_to,
            subject: "Interview Scheduled!",
            html: `Hello ${first_name} ${last_name} , Your Interview Has Been Scheduled!`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}


module.exports.sendDynamicMail = async function (
    email_to,
    first_name,
    last_name,
    entityId,
) {
    console.log("maile", entityId, email_to)
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: email_to,
            subject: "Travel Request!",
            html: `
      <p>Dear ${first_name} ${last_name},</p>
      <p>Pls Approve the travel Requested created today</strong>.</p>
      <p>Best regards,</p>
      <p>Kiran Automation Team</p>
    `
        };

        console.log("mail send", mailOptions)

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports.sendmailsforcompanydetails = async function (
    email_to,
    first_name,
    last_name,
    email_urlID,
    entityId,
) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: email_to,
            subject: "Complete your previous Employer Details!",
            html: `Hello ${first_name} ${last_name} , Please complete your Employer details <a target = "_blank" href="${email_urlID}">Company Details</a> !`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports.sendCandidateOfferMail = async function (
    email_to,
    first_name,
    last_name,
    link_urll,
    entityId,
) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: email_to,
            subject: "Offer Letter!",
            html: `Hello ${first_name} ${last_name} , Please Accept your Offer <a target = "_blank" href="${link_urll}">Offer Details</a> !`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports.sendMailtoFillCandidatedetails = async function (
    email_to,
    first_name,
    last_name,
    link_urll,
    entityId,
) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: email_to,
            subject: "Complete your Details!",
            html: `Hello ${first_name} ${last_name} , Please fill your complete details <a target = "_blank" href="${link_urll}">Complete Your Details</a> !`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports.sendMailPO = async function (
    vendor, entityId, response, biling, Item_Detail, Service_Detail, itemResults, serviceResults
) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const entityConfig = await db.entityMaster.findByPk(entityId);
        const htmlFilePath = path.resolve(__dirname, "../../templates/po.html");
        const html = fs.readFileSync(htmlFilePath, "utf-8");
        const replaceNullWithEmpty = (str) => str == null ? "" : str;

        let serviceItemTable = "";
        if (Item_Detail || Service_Detail) {
            serviceItemTable = generateServiceItemTable(
                Item_Detail || [],
                Service_Detail || [],
                itemResults, serviceResults, response
            );
        }
        const htmlWithData = html
            .replace("{po_number}", replaceNullWithEmpty(response.po_number))
            .replace("{po_date}", replaceNullWithEmpty(response.po_date))
            .replace("{entity_name}", replaceNullWithEmpty(entity_name))
            .replace("{registered_office}", replaceNullWithEmpty(entityConfig.registered_office))
            .replace("{smtp_server_address}", replaceNullWithEmpty(entityConfig.smtp_server_address))
            .replace("{logo}", replaceNullWithEmpty(entityConfig.logo))
            .replace("{vendor_name}", replaceNullWithEmpty(vendor.vendor_name))
            .replace("{vendor_address}", replaceNullWithEmpty(vendor.vendor_address))
            .replace("{vendor_contact_num}", replaceNullWithEmpty(vendor.vendor_contact_num))
            .replace("{vendor_email}", replaceNullWithEmpty(vendor.vendor_email))
            .replace("{branch_name}", replaceNullWithEmpty(vendor.warehouse_name))
            .replace("{branch_address}", replaceNullWithEmpty(vendor.warehouse_address))
            .replace("{branch_contact_no}", replaceNullWithEmpty(vendor.contact_number))
            .replace("{branch_email}", replaceNullWithEmpty(vendor.employee_official_email))
            .replace('{serviceItemTable}', replaceNullWithEmpty(serviceItemTable))

        const pdfBuffer = await generatePDF(htmlWithData);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: vendor.vendor_email,
            subject: "Purchase Order!",
            html: `<p>Hello, please find the attached Purchase Order.</p>`,
            attachments: [
                {
                    filename: "Purchase_Order.pdf",
                    content: pdfBuffer,
                },
            ],
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}


function generateServiceItemTable(Item_Detail, Service_Detail, itemResults, serviceResults, response) {
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
    site_url, vendorId, Negotiation_Id, procurement_id, procurement_type, re_negotiation, get_vendorData
) {
    try {
        const link = `${site_url}?vendor_id=${vendorId}&nego_id=${Negotiation_Id}&procurement_id=${procurement_id}&procurement_type=${procurement_type}&renego_status=${re_negotiation}`;
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(get_vendorData.entity_id);
        // const entityConfig = await db.entityMaster.findByPk(get_vendorData.entity_id);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: get_vendorData.vendor_email,
            bcc: 'ajayem@yopmail.com',
            subject: "Link for Request for Proposal",
            html: `<p><strong> Hi ${get_vendorData.vendor_name}</strong> <br> <p style="padding: 3%; background-image: url('https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg');"> 
                 Simply click the button below to link for request for proposal ${get_vendorData.vendor_email} <a href="${link}">
                <button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color: blue;"> Click Me </button></a></p>`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}
module.exports.sendRFPMail = async function (
    site_url, vendorId, Rfp_Number, procurement_type, get_vendorData
) {
    try {
        const link = `${site_url}?vendor_id=${encodeURIComponent(encrypt(vendorId))}&Rfp_no=${encodeURIComponent(encrypt(Rfp_Number))}&type=${encodeURIComponent(encrypt(procurement_type))}`;
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(get_vendorData.entity_id);

        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: get_vendorData.vendor_email,
            bcc: 'ajayem@yopmail.com',
            subject: "Invitation to Submit Proposal: Request for Proposal (RFP)",
            html: `
                <p><strong>Dear ${get_vendorData.vendor_name},</strong></p>

                <p>We hope you are doing well. We are pleased to invite you to participate in the Request for Proposal (RFP) for the following procurement opportunity:</p>

                <p><strong>RFP Number:</strong> ${Rfp_Number} <br>
                   <strong>Indent Type:</strong> ${procurement_type}</p>

                <p>To view the full RFP details and submit your proposal, simply click the button below:</p>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="${link}" style="text-decoration: none;">
                        <button class="btn" style="padding: 12px 20px; border-radius: 5px; cursor: pointer; border: none; color: white; background-color: #007bff; font-size: 16px; font-weight: bold;">
                            Access the RFP Details
                        </button>
                    </a>
                </div>

                <p>If you have any questions or need further information, please don’t hesitate to contact us. We look forward to your submission.</p>

                <p>Best regards, <br>${entity_name}</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}


module.exports.sendRFPMailforService = async function (
    site_url, vendorId, Rfp_Number, procurement_type, get_vendorData
) {
    try {
        const linkForVendorProduct = `${site_url}?vendor_id=${vendorId}&Rfp_no=${Rfp_Number}&type=${procurement_type}`;
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(get_vendorData.entity_id);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: get_vendorData.vendor_email,
            bcc: 'ajayem@yopmail.com',
            subject: "Link for Request for Proposal",
            html: `<p><strong> Hi ${get_vendorData.vendor_name}</strong> <br> <p style=" padding: 3%; background-image: url('https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg');"> 
                   Simply click the button below to view request for proposal details for Vendor Product ${get_vendorData.vendor_email} <a href="${linkForVendorProduct}">
                  <button class="btn" style="padding: 6px 8px; border-radius: 7px;cursor: pointer; border-color: blue; color: white; background-color: blue;"> Click Me </button></a></p>`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}
module.exports.sendRFPMailNegoItem = async function (
    site_url, vendorId, Negotiation_Id, procurement_id, get_vendorData, procurement_type
) {
    try {
        const link = `${site_url}?vendor_id=${encodeURIComponent(encrypt(vendorId))}&nego_id=${encodeURIComponent(encrypt(Negotiation_Id))}&procurement_id=${encodeURIComponent(encrypt(procurement_id))}&procurement_type=${encodeURIComponent(encrypt(procurement_type))}`;
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(get_vendorData.entity_id);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: get_vendorData.vendor_email,
            bcc: 'ajayem@yopmail.com',
            subject: "Request for Proposal Negotiation: Action Required",
            html: `
                <p><strong>Dear ${get_vendorData.vendor_name},</strong></p>
                
                <p>We hope this message finds you well. We're pleased to invite you to participate in the Request for Proposal (RFP) Negotiation for the procurement process outlined below.</p>

                <p>To access the RFP details, simply click the link below:</p>
                
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${link}" style="text-decoration: none;">
                        <button class="btn" style="padding: 12px 20px; border-radius: 5px; cursor: pointer; border: none; color: white; background-color: #007bff; font-size: 16px; font-weight: bold;">
                            Access the RFP Negotiation
                        </button>
                    </a>
                </div>
                
                <p>If you encounter any issues or have questions, feel free to reach out to us at any time.</p>

                <p>Best regards,<br>${entity_name}</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports.sendRFPMailNegoService = async function (
    site_url, vendorId, Negotiation_Id, procurement_id, get_vendorData, procurement_type
) {
    try {
        const link = `${site_url}?vendor_id=${vendorId}&nego_id=${Negotiation_Id}&procurement_id=${procurement_id}&procurement_type=${procurement_type}`;
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(get_vendorData.entity_id);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: get_vendorData.vendor_email,
            bcc: 'ajayem@yopmail.com',
            subject: "Link for Request for Proposal",
            html: `<p><strong> Dear ${get_vendorData.vendor_name}</strong> <br> <p style="padding: 3%; background-image: url('https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg');"> 
                     Simply click the button below to link for request for proposal ${get_vendorData.vendor_email} <a href="${link}">
                    <button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color: blue;"> Click Me </button></a></p>`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}
module.exports.sendemp = async function (
    approvel_status, name, getdata, email_id
) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(getdata.entity_id);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: email_id.emp_personal_email,
            subject: "Link for Approval",
            html: `hello ${name.first_name} your resignation was ${approvel_status}`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}


module.exports.sendmailnewcustomer = async function (mail_id, entity_id) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entity_id);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: mail_id,
            subject: 'Proposal Created',
            text: 'Your proposal has been created successfully.'
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

// use change/forgot password
module.exports.sendChangePasswordMail = async function (loginUrl, portalUrl, entityId, UserEmail, UserName, newPassword) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: UserEmail,
            bcc: 'ajayem@yopmail.com',
            subject: "Password Update Notification",
            html: `<strong> Dear ${UserName},</strong> <br> <p>Your account password has been successfully updated.</p>
            <h4>🔐 Your new login password: <span style="color: #007BFF;">${newPassword}</span></h4>
            <p>If you did not perform this action, please contact the support team immediately to secure your account.</p>
            <p>You can login here: <a href="${loginUrl}">${portalUrl}</a></p><br>
            <p><b>Regards,</b><br>
            ElanPro Team</p>`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports.sendOTPMail = async function (entityId, UserEmail, UserName, OTP) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: UserEmail,
            bcc: 'ajayem@yopmail.com',
            subject: "Your OTP for Verification",
            html: `<strong> Dear ${UserName},</strong> <br> <p>Your One-Time Password (OTP) for account verification is:</p>
            <h4>🔐 OTP: <span style="color: #007BFF;">${OTP}</span></h4>
            <p>This OTP is valid for 10 minutes.</p>
            <p>Please keep this code confidential and do not share it with anyone</p><br>
            <p><b>Regards,</b><br>
            ElanPro Team</p>`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports.sendEmployeeSignupMail = async function (portalUrl, entityId, UserEmail, UserName, newPassword) {
    try {
        const { transporter, fromEmail, entity_name } = await getTransporterByEntityId(entityId);
        const mailOptions = {
            from: `${entity_name} <${fromEmail}>`,
            to: UserEmail,
            bcc: 'ajayem@yopmail.com',
            subject: "Welcome to Elan Pro – Account Created Successfully!",
            html: `<strong> Dear ${UserName},</strong> <br> <p>Your account has been created successfully. Here are your login details:</p>
            <p>Please login using this password and make sure to change it after logging in for better security.</p>
            <h4>📧 Here is your new login email: <span style="color: #007BFF;">${UserEmail}</span></h4>
            <h4>🔐 Here is your new login password: <span style="color: #007BFF;">${newPassword}</span></h4>
            <p>You can login here: <a href="${portalUrl}/auth/login">${portalUrl}</a></p<br>
            <p><b>Regards,</b><br>
            ElanPro Team</p>`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}