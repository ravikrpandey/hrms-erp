const db = require("../../../models/index");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");
var bcrypt = require("bcryptjs");
const puppeteer = require("puppeteer");
const User = db.user;
const {
  sendCandidateOfferMail,
  sendMailtoFillCandidatedetails,
  sendCandidateonboardingmail,
} = require("../../utils/mail/mail");
const {
  attribute,
} = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const { isDataView } = require("util/types");
const CryptoJS = require("crypto-js");
const {
  saveNotification,
} = require("../../../notification/hrms_notification/controller/hrms_notification_controller");

exports.approve_offer_letter = async (req, res) => {
  try {
    const { offer_id, approval_status, approval_remarks } = req.body;
    const update_status = await db.candidate_offer_letter.update(
      { approval_status, approval_remarks },
      { where: { id: offer_id } }
    );
    if (update_status) {
      const cand_data = await db.candidate_offer_letter.findOne({
        where: { id: offer_id },
      });

      const notificationData = {
        employee_id: cand_data.created_by,
        notification_type: "SHORTLIST_CAND",
        entity_id: cand_data.entity_id,
        message: `Offer letter for the refrence number ${cand_data.reference_number} has been ${approval_status} `,
      };

      await saveNotification(notificationData);

      return res
        .status(200)
        .send({
          code: 200,
          message: "Offer Letter Approved Successfully!",
          data: update_status,
        });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Not able to Approve!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.update_offer_letter = async (req, res) => {
  try {
    const {
      offer_id,
      base_salary,
      reporting_manager_id,
      probation_period,
      location,
      exp_joining_date,
    } = req.body;
    const update_offer = await db.candidate_offer_letter.update(
      {
        base_salary,
        reporting_manager_id,
        probation_period,
        location,
        exp_joining_date,
      },
      { where: { id: offer_id } }
    );
    if (update_offer) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Offer Letter updated Successfully!",
          data: update_offer,
        });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Not able to update!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let daySuffix;
  if (day % 10 === 1 && day !== 11) {
    daySuffix = "st";
  } else if (day % 10 === 2 && day !== 12) {
    daySuffix = "nd";
  } else if (day % 10 === 3 && day !== 13) {
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }
  return `${day}${daySuffix} ${month} ${year}`;
}

exports.generate_pdf = async (req, res) => {
  try {
    let { candidate_id, entity_id, jd_id, offer_letter_id } = req.query;
    offer_letter_id = parseInt(offer_letter_id);

    const htmlPath = "app/Recruitment/templates/offer-letter.html";
    if (!fs.existsSync(htmlPath)) {
      throw new Error("HTML file not found");
    }

    const query = `
        SELECT OL.*, E.first_name, E.last_name, JD.job_title, JD.experience, D.designation_name, EM.entity_name, EM.logo, EM.registered_office, B.branch_name
        FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id = OL.candidate_id
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id = E.job_descripition_id
        LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
        LEFT JOIN ENTITY_MASTER AS EM ON EM.id = OL.entity_id
        LEFT JOIN MASTER_BRANCH AS B ON B.id = OL.location_id
        WHERE OL.candidate_id = :candidate_id AND OL.entity_id = :entity_id AND E.job_descripition_id = :jd_id`;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { candidate_id, entity_id, jd_id },
    });

    if (getAllData.length === 0) {
      throw new Error("No data found for the provided IDs");
    }

    let data = getAllData[0];
    const joiningDate = formatDate(data.exp_joining_date);

    // 🔐 Fetch Approver Details and Digital Signatures
    const offer_letter_approvers = await db.candidate_offer_letter.findAll({
      where: { id: offer_letter_id },
    });

    if (!offer_letter_approvers || offer_letter_approvers.length === 0) {
      return res
        .status(404)
        .json({ message: "No Approvers found for this offer_letter_id" });
    }

    const employee_ids = offer_letter_approvers.map(
      (entry) => entry.approval_id
    );

    const employee_details = await db.digitalSignature.findAll({
      where: { employee_id: employee_ids },
    });

    if (!employee_details || employee_details.length === 0) {
      throw new Error("No digital signature record found for this Approver.");
    }

    const unapprovedSignatures = employee_details.filter(
      (sig) => sig.status !== "Approved"
    );
    if (unapprovedSignatures.length > 0) {
      throw new Error("Digital Signature of Approver Not Approved.");
    }

    const users = await db.user.findAll({
      where: { employee_id: employee_ids },
    });

    if (!users || users.length === 0) {
      throw new Error("No users found for the provided employee IDs.");
    }

    const designation_ids = [
      ...new Set(users.map((user) => user.designation_id)),
    ];

    const designations = await db.designation.findAll({
      where: { designation_id: designation_ids },
      attributes: ["designation_id", "designation_name"],
    });

    const designationMap = {};
    designations.forEach((des) => {
      designationMap[des.designation_id] = des.designation_name;
    });

    const signatureMap = {};
    employee_details.forEach((sig) => {
      signatureMap[sig.employee_id] = sig;
    });

    const finalApprovers = users.map((user) => {
      const fullName = `${user.first_name || ""} ${
        user.last_name || ""
      }`.trim();
      return {
        ...user.dataValues,
        employee_name: fullName,
        designation_name: designationMap[user.designation_id] || "",
        digitalSignature: signatureMap[user.employee_id] || null,
      };
    });

    // 🔐 Build Approver Section HTML
    let approversSectionHtml = "";
    for (let i = 0; i < finalApprovers.length; i += 2) {
      const approver1 = finalApprovers[i];
      const approver2 = finalApprovers[i + 1];

      const formatApprover = (approver) => {
        if (!approver) return "";
        const rawDate = new Date(approver.updatedAt).toString();
        const employeeSignatureDate = rawDate.split(" GMT")[0];
        return `
                   <div style="text-align: left; font-size: 14px;">
                        <p>Approved by: <strong>${
                          approver.employee_name
                        }</strong></p>
                        <p>Designation: <strong>${
                          approver.designation_name
                        }</strong></p>
                        <p>Date & Time: <strong>${employeeSignatureDate}</strong></p>
                        <p><img src="${
                          approver.digitalSignature?.digital_signature || ""
                        }" width="110" /></p>
                        <p>Approver Signature:</p>
                    </div>
                `;
      };

      approversSectionHtml += `
                <table style="width: 100%; border-collapse: collapse; margin-top: 50px;">
                    <tr>
                        <td style="width: 50%; vertical-align: top;">${formatApprover(
                          approver1
                        )}</td>
                        <td style="width: 50%; vertical-align: top;">${formatApprover(
                          approver2
                        )}</td>
                    </tr>
                </table>
            `;
    }

    // 🧾 Load HTML Template
    let html = fs.readFileSync(htmlPath, "utf8");

    let finalHtml = html
      .replace("{{referenceNumber}}", data.reference_number || "")
      .replace("{{registered_office}}", data.registered_office || "")
      .replace("{{work_location}}", data.branch_name || "")
      .replace("{{exp_joining_date}}", joiningDate || "")
      .replace("{{job_title}}", data.job_title || "")
      .replace("{{designation_name}}", data.designation_name || "")
      .replace("{{position}}", data.designation_name || "")
      .replace(
        "{{candidateName}}",
        `${data.first_name} ${data.last_name}` || ""
      )
      .replace("{{base_salary}}", data.base_salary || "")
      .replace("{{salary_type}}", data.salary_type || "")
      .replace("{{probation_period}}", data.probation_period || "")
      .replace("{{logo}}", data.logo || "")
      // Approver info replacements
      .replace(
        "{{employee_signature}}",
        finalApprovers[0]?.digitalSignature?.digital_signature || ""
      )
      .replace("{{employee_name}}", finalApprovers[0]?.employee_name || "")
      .replace(
        "{{employee_designation}}",
        finalApprovers[0]?.designation_name || ""
      )
      .replace(
        "{{employee_Signature_date}}",
        new Date(finalApprovers[0]?.updatedAt).toString().split(" GMT")[0] || ""
      )
      .replace("{{approvers_section}}", approversSectionHtml);

    // 🖨️ Generate PDF
     const browser = await puppeteer.launch({
        headless: true,  
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    const pdfDir = "generated_offer_letters";
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const cur_date = `${String(new Date().getDate()).padStart(2, "0")}_${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}_${new Date().getFullYear()}`;
    const pdfFilename = `${cur_date}_Offer-letter_${candidate_id}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFilename);
    fs.writeFileSync(pdfPath, pdfBuffer);

    await db.candidate_offer_letter_doc.create({
      candidate_id,
      entity_id,
      jd_id,
      offer_letter_doc: pdfFilename,
    });
    await db.candidate_offer_letter.update(
      { approval_status: "GENERATED" },
      { where: { candidate_id } }
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
    return res
      .status(200)
      .send({ code: 200, message: "Offer Letter Generated Successfully!" });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .send({
        code: 500,
        message: error.message || "An error occurred while generating the PDF.",
      });
  }
};

exports.download_offer_letter = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const offer_details = await db.candidate_offer_letter_doc.findOne({
      where: { candidate_id, status: "ACTIVE" },
      order: [["id", "DESC"]],
    });
    if (!offer_details) {
      return res.status(404).send({ message: "Offer letter not found." });
    }
    const filePath = path.join(
      __dirname,
      "../../../../generated_offer_letters/",
      offer_details.offer_letter_doc
    );
    res.download(filePath, (err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Could not download the file. " + err });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred. " + error });
  }
};

// exports.sendCandidate_offer_letter_link = async (req, res) => {
//   try {
//     const { candidate_id, link_url, entityId } = req.body;
//     const link_urll = link_url + "?id=" + candidate_id;
//     const candidate_detail = await db.job_descripition_email.findOne({
//       where: { id: candidate_id, status: "ACTIVE", isDeleted: false },
//     });
//     let email_to = candidate_detail.email;
//     let first_name = candidate_detail.first_name;
//     let last_name = candidate_detail.last_name;
//     const mailSent = await sendCandidateOfferMail(
//       email_to,
//       first_name,
//       last_name,
//       link_urll,
//       entityId
//     );
//     if (mailSent) {
//       return res
//         .status(200)
//         .send({
//           code: 200,
//           message: "Mail Sent Successfully!",
//           link_url: link_urll,
//         });
//     } else {
//       return res
//         .status(200)
//         .send({ code: 200, message: "Unable to Sent!", link_url: link_urll });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ code: 500, message: error.message || "Server Error" });
//   }
// };


exports.sendCandidate_offer_letter_link = async (req, res) => {
  try {
    const { candidate_id, link_url, entityId } = req.body;
    const link_urll = link_url + "?id=" + candidate_id;

    const candidate_detail = await db.job_descripition_email.findOne({
      where: { id: candidate_id, status: "ACTIVE", isDeleted: false },
    });

    if (!candidate_detail) {
      return res.status(404).send({
        code: 404,
        message: "Candidate not found or inactive",
      });
    }

    let email_to = candidate_detail.email;
    let first_name = candidate_detail.first_name;
    let last_name = candidate_detail.last_name;

    let mailSent;
    try {
      mailSent = await sendCandidateOfferMail(
        email_to,
        first_name,
        last_name,
        link_urll,
        entityId
      );
    } catch (mailError) {
      console.error("Mail sending error:", mailError);
      return res.status(500).send({
        code: 500,
        message: "Mail sending failed",
        error: mailError.message || mailError,
      });
    }

    if (mailSent) {
      return res.status(200).send({
        code: 200,
        message: "Mail Sent Successfully!",
        link_url: link_urll,
      });
    } else {
      return res.status(500).send({
        code: 500,
        message: "sendCandidateOfferMail returned false",
        link_url: link_urll,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};


exports.updateCandidate_OfferStatus = async (req, res) => {
  try {
    const { candidate_id, remarks, candidate_offer_status } = req.body;
    const updated_stutus = await db.candidate_offer_letter.findOne({
      where: { candidate_id, candidate_offer_status: "ACCEPTED" },
    });
    if (!updated_stutus) {
      if (candidate_offer_status === "ACCEPTED") {
        const update_status = await db.candidate_offer_letter.update(
          { candidate_remarks: remarks, candidate_offer_status },
          { where: { candidate_id } }
        );
        if (update_status) {
          return res
            .status(200)
            .send({ code: 200, message: "I am accepting this Offer!!" });
        } else {
          return res
            .status(200)
            .send({ code: 200, message: "No Found Data!", data: [] });
        }
      } else if (candidate_offer_status === "NEGOTIATE") {
        const update_status = await db.candidate_offer_letter.update(
          { candidate_remarks: remarks, candidate_offer_status },
          { where: { candidate_id } }
        );
        if (update_status) {
          return res
            .status(200)
            .send({ code: 200, message: "I want to NEGOTIATE this Offer!" });
        } else {
          return res
            .status(200)
            .send({ code: 200, message: "No Found Data!", data: [] });
        }
      } else {
        const update_status = await db.candidate_offer_letter.update(
          { candidate_remarks: remarks, candidate_offer_status },
          { where: { candidate_id } }
        );
        if (update_status) {
          return res
            .status(200)
            .send({
              code: 200,
              message: "I am not able to accept this Offer!",
            });
        } else {
          return res
            .status(200)
            .send({ code: 200, message: "No Found Data!", data: [] });
        }
      }
    } else {
      return res
        .status(403)
        .send({
          code: 403,
          message: "You have already accepted the offer letter!",
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getCandidateoffer_detailsBYID = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const query = `
            SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name,U.first_name AS report_manag_fname,U.last_name AS report_manag_lname,B.branch_name as location FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id=OL.reporting_manager_id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            LEFT JOIN MASTER_BRANCH AS B ON B.id = OL.location_id
            WHERE OL.candidate_id=${candidate_id}`;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetched Offer Details By ID Successfully!",
          data: getAllData,
        });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "No Found Data!", data: [] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getcandiate_detailsBYID = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const query = `
            SELECT E.*,D.designation_name,JD.job_title FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            WHERE E.id=${candidate_id}`;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetched Candidate By ID Successfully!",
          data: getAllData,
        });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "No Found Data!", data: [] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_OnboardedEmployeeList = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `
            SELECT OL.id,OL.candidate_id,OL.base_salary,OL.candidate_offer_status,OL.candidate_remarks,JD.job_title,E.first_name AS candidate_fname,E.last_name AS candidate_lname,E.email,E.country_code,D.designation_name,E.contact_number,OL.exp_joining_date,E.onboarding_status 
            FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            WHERE OL.candidate_offer_status="ACCEPTED" OR OL.candidate_offer_status="ONBOARDED" AND OL.status="ACTIVE" AND OL.isDeleted=0 ORDER BY OL.id DESC`;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetched Onboarded Employee Successfully!",
          data: getAllData,
        });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "No Found Data!", data: [] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.sendmail_to_fill_candidate_details = async (req, res) => {
  try {
    const { candidate_id, link_url, entityId } = req.body;
    const link_urll = link_url + "?candidate_id=" + candidate_id;
    const candidate_detail = await db.job_descripition_email.findOne({
      where: { id: candidate_id, status: "ACTIVE", isDeleted: false },
    });

    if (!candidate_detail) {
      return res
        .status(404)
        .send({
          code: 404,
          message: "Candidate not found",
          link_url: link_urll,
        });
    }

    let email_to = candidate_detail.email;
    let first_name = candidate_detail.first_name;
    let last_name = candidate_detail.last_name;

    try {
      const mailSent = await sendMailtoFillCandidatedetails(
        email_to,
        first_name,
        last_name,
        link_urll,
        entityId
      );
      if (mailSent) {
        return res
          .status(200)
          .send({
            code: 200,
            message: "Mail Sent Successfully!",
            link_url: link_urll,
          });
      } else {
        return res
          .status(200)
          .send({
            code: 200,
            message: "Unable to Send Mail!",
            link_url: link_urll,
          });
      }
    } catch (smtpError) {
      if (
        smtpError.code === "ETIMEDOUT" ||
        smtpError.message.includes("timeout")
      ) {
        return res
          .status(503)
          .send({
            code: 503,
            message: "Mail service timeout. Please try again later.",
            link_url: link_urll,
          });
      }
      return res
        .status(500)
        .send({
          code: 500,
          message: "Failed to send mail due to server error.",
          link_url: link_urll,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getCandidate_detailsByID = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const query = `
            SELECT E.*,OL.id as offer_id,OL.probation_period,OL.exp_joining_date,OL.location_id,OL.reporting_manager_id,OL.entity_id,JD.job_title,JD.experience,JD.department_id,JD.emplyoment_type_id,JD.qualification,D.designation_name,U.first_name AS reportingM_fname,U.last_name AS reportingM_lname,MD.department_name,JD.designation_id,OL.base_salary AS monthly_salary,EM.entity_name FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E 
            LEFT JOIN RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL ON OL.candidate_id=E.id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id=OL.reporting_manager_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id=JD.department_id
            LEFT JOIN ENTITY_MASTER AS EM ON EM.id=OL.entity_id
            WHERE E.status="ACTIVE" AND E.isDeleted=0 AND OL.status="ACTIVE" AND OL.isDeleted=0 AND E.id=${candidate_id}`;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    const doc_list = await db.candidate_docs.findAll({
      where: { candidate_id, isDeleted: false },
    });
    getAllData.forEach((result) => {
      result.doc_list = doc_list;
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetched Onboarded Employee Successfully!",
          data: getAllData,
        });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "No Found Data!", data: [] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.register_onboarded_employee = async (req, res) => {
  try {
    let {
      title,
      candidate_id,
      employee_id,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      emp_personal_email,
      contact_number,
      country_code,
      reporting_manager,
      reporting_manager_id,
      location_id,
      department_id,
      role_master_id,
      designation_id,
      emplyoment_type_id,
      employee_photo,
      exp_joining_date,
      entity_id,
      entity_name,
      present_country_id,
      present_state_id,
      present_city_id,
      permanent_country_id,
      permanent_state_id,
      permanent_city_id,
      personal_country_id,
      personal_state_id,
      personal_city_id,
      present_address,
      address_check_value,
      parmanent_address,
      DIRE_number,
      driving_license_number,
      blood_group,
      id_number,
      issued_date,
      exp_date,
      tax_number,
      passport_number,
      marital_status,
      spouse_name,
      family_details,
      prev_employer_details,
      basic_salary,
      history_salary,
      bank_id,
      employee_name_in_bank,
      bank_address,
      account_number,
      re_enter_account_no,
      nuit_number,
      bank_district_name,
      inss_number,
      documents_detail,
      tab_type,
    } = req.body;

    if (emp_personal_email && !employee_id) {
      const alreadyexist = await db.user.findOne({
        where: { emp_personal_email, isDeleted: false },
      });
      if (!alreadyexist) {
        const employee_save = await User.create({
          title,
          primary_entity_id: entity_id,
          role_master_id,
          first_name,
          middle_name,
          last_name,
          gender,
          date_of_birth,
          emp_personal_email,
          contact_number,
          country_code,
          reporting_manager,
          reporting_manager_id,
          location_id,
          department_id,
          designation_id,
          emplyoment_type_id,
          emp_join_date: exp_joining_date,
          employee_photo,
          status: "ONBOARDED",
          candidate_id,
        });
        const candidate_entity = await db.user_entity.create({
          entity_id,
          entity_name,
          employee_id: employee_save.employee_id,
        });
        const update_status = await db.candidate_offer_letter.update(
          {
            candidate_offer_status: "ONBOARDED",
          },
          { where: { candidate_id } }
        );
        if (employee_save && candidate_entity && update_status) {
          return res
            .status(200)
            .send({
              code: 200,
              message: "Candidate Registered Successfully!",
              user_id: employee_save.employee_id,
            });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Registered" });
        }
      } else {
        const basic_details = await User.update(
          {
            title,
            primary_entity_id: entity_id,
            role_master_id,
            first_name,
            middle_name,
            last_name,
            gender,
            date_of_birth,
            emp_personal_email,
            contact_number,
            country_code,
            reporting_manager,
            reporting_manager_id,
            location_id,
            department_id,
            designation_id,
            emplyoment_type_id,
            emp_join_date: exp_joining_date,
            employee_photo,
          },
          { where: { emp_personal_email } }
        );
        if (basic_details) {
          return res
            .status(200)
            .send({
              code: 200,
              message: "Basic Details Updated Successfully!",
              user_id: alreadyexist.employee_id,
            });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      }
    } else {
      if (employee_id && tab_type == "Personal") {
        var personal_details = await User.update(
          {
            present_country_id,
            present_state_id,
            present_city_id,
            permanent_country_id,
            permanent_state_id,
            permanent_city_id,
            personal_country_id,
            personal_state_id,
            personal_city_id,
            present_address,
            address_check_value,
            parmanent_address,
            DIRE_number,
            driving_license_number,
            blood_group,
            id_number,
            issued_date,
            exp_date,
            tax_number,
            passport_number,
            marital_status,
            spouse_name,
          },
          { where: { employee_id: employee_id } }
        );
        if (family_details) {
          await db.user_family.destroy({ where: { employee_id } });
          await Promise.all(
            family_details.map(async (details) => {
              const {
                member_name,
                date_of_birth,
                relation,
                country_code,
                contact_number,
                remarks,
                emergency_contact,
              } = details;
              const family_detailss = await db.user_family.create({
                member_name,
                date_of_birth,
                relation,
                country_code,
                contact_number,
                remarks,
                emergency_contact,
                employee_id,
              });
              return family_detailss;
            })
          );
        }
        if (prev_employer_details) {
          await db.user_prev_employer.destroy({ where: { employee_id } });
          await Promise.all(
            prev_employer_details.map(async (details) => {
              const {
                company_name,
                from_date,
                to_date,
                last_salary,
                reason_of_leaving,
                location,
              } = details;
              const prev_emp = await db.user_prev_employer.create({
                company_name,
                from_date,
                to_date,
                last_salary,
                reason_of_leaving,
                location,
                employee_id,
              });
              return prev_emp;
            })
          );
        }
        if (personal_details) {
          return res
            .status(200)
            .send({
              code: 200,
              message: "Family Details Updated Successfully!",
              user_id: employee_id,
            });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      } else if (employee_id && tab_type == "Salary") {
        var salary = await User.update(
          {
            basic_salary,
          },
          { where: { employee_id } }
        );

        await db.user_salary.destroy({ where: { employee_id } });
        const salary_history = await Promise.all(
          history_salary.map(async (details) => {
            const {
              salary_Year,
              salary_month,
              new_salary,
              old_salary,
              percent_increment,
              remarks,
            } = details;
            const salaryy = await db.user_salary.create({
              salary_Year,
              salary_month,
              new_salary,
              old_salary,
              percent_increment,
              remarks,
              employee_id,
            });
            return salaryy;
          })
        );
        if (salary && salary_history) {
          return res
            .status(200)
            .send({
              code: 200,
              message: "Salary Details Updated Successfully!",
              user_id: employee_id,
            });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      } else if (employee_id && tab_type == "Payment") {
        var bank_details = await User.update(
          {
            bank_id,
            employee_name_in_bank,
            bank_address,
            account_number,
            re_enter_account_no,
            nuit_number,
            bank_district_name,
            inss_number,
          },
          { where: { employee_id } }
        );
        if (bank_details) {
          return res
            .status(200)
            .send({
              code: 200,
              message: "Salary Details Updated Successfully!",
              user_id: employee_id,
            });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      } else if (employee_id && tab_type == "Document") {
        await db.user_documents.destroy({ where: { employee_id } });
        const documents_details = await Promise.all(
          documents_detail.map(async (details) => {
            const { document_name, document_description, documents } = details;
            const doc_details = await db.user_documents.create({
              document_name,
              document_description,
              documents,
              employee_id,
            });
            return doc_details;
          })
        );
        const candidate_status = await db.job_descripition_email.update(
          {
            onboarding_status: "ONBOARDED",
          },
          { where: { id: candidate_id } }
        );
        if (documents_details && candidate_status) {
          return res
            .status(200)
            .send({
              code: 200,
              message: "Document Details Updated Successfully!",
              user_id: employee_id,
            });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      }
      return res
        .status(200)
        .send({
          code: 200,
          message: "Employee Details Updated Successfully!",
          user_id: employee_id,
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Server Error" });
  }
};

exports.update_onboarded_employee_status = async (req, res) => {
  try {
    const { employee_official_email, candidate_id, status, primary_entity_id } =
      req.body;
    const entity_id = parseInt(primary_entity_id);
    const alreadyexist = await db.user.findOne({
      where: { candidate_id, status: "ACTIVE" },
    });

    // ==================== Leave Allotment If Already Onboarded ====================
    if (alreadyexist) {
      const existingLeave = await db.hrmsLeaveAllotment.findOne({
        where: { employee_id: alreadyexist.employee_id },
      });
      console.log("Existing Leave Allotment:", existingLeave);

      if (existingLeave) {
        return res.status(200).send({
          code: 200,
          message: "Candidate Already Onboarded and Leave Already Allotted!",
        });
      } else {
        console.log("Fetching Leave Master Info...");
        const [leaveAllot] = await db.sequelize.query(`
                    SELECT DISTINCT 
                        LM.total_available AS total_leaves, 
                        LM.id AS leave_id,
                        LM.entity_id, 
                        LPE.from AS applicable_from,
                        LPD.includeWeekendHoliday, 
                        LPD.isApplAftrProb, 
                        LPD.onceInServiceLeave,
                        LPD.isQuotaAllotedMonthly
                    FROM HRMS_LEAVE_MASTER AS LM
                    INNER JOIN HRMS_LEAVE_POLICY_DETAIL AS LPD ON LM.id = LPD.leaveId AND LPD.isDeleted = false
                    INNER JOIN HRMS_LEAVE_POLICY_ENTITLEMENT AS LPE ON LM.id = LPE.leaveId AND LPE.isDeleted = false
                    INNER JOIN HRMS_LEAVE_POLICY_RESTRICTIONS AS LPR ON LM.id = LPR.leaveId AND LPR.isDeleted = false
                    WHERE LM.entity_id = ${entity_id} AND LM.isDeleted = false;
                `);

        console.log("Leave Master Result:", leaveAllot);

        if (leaveAllot.length) {
          const updatedLeaveAllot = leaveAllot.map((leave) => {
            console.log("Processing Leave:", leave);

            let adjusted = Math.round(leave.total_leaves);

            if (
              leave.applicable_from === "JAN-DEC" &&
              !leave.onceInServiceLeave
            ) {
              const referenceDate = leave.isApplAftrProb
                ? new Date(alreadyexist.emp_probation_date)
                : new Date(alreadyexist.emp_join_date);
              const joinMonth = referenceDate.getMonth() + 1;
              let startMonth = joinMonth + 1;
              if (joinMonth === 12) startMonth = 1;

              const monthsPassed = 12 - startMonth + 1;
              const monthlyLeave = leave.total_leaves / 12;
              adjusted = Math.round(monthsPassed * monthlyLeave);
            }

            console.log("Adjusted Leaves:", adjusted);

            return { ...leave, adjusted_leaves: adjusted };
          });

          const allotmentData = updatedLeaveAllot.map((leave) => {
            const policy = leaveAllot.find(
              (p) => p.leave_id === leave.leave_id
            );
            if (policy && policy.isQuotaAllotedMonthly == false) {
              return {
                no_of_days: leave.adjusted_leaves,
                available_days: leave.adjusted_leaves,
                leave_id: leave.leave_id,
                employee_id: alreadyexist.employee_id,
              };
            } else {
              return {
                no_of_days: leave.adjusted_leaves,
                leave_id: leave.leave_id,
                employee_id: alreadyexist.employee_id,
              };
            }
          });

          console.log("Final Allotment Data to Insert:", allotmentData);

          await db.hrmsLeaveAllotment.bulkCreate(allotmentData);
        }

        return res.status(200).send({
          code: 200,
          message: "Candidate Already Onboarded! Leave Allotment Completed.",
        });
      }
    }

    //====================End the Logic leave create =====================================

    const emp_code = await db.user_login.findOne({
      where: {
        isDeleted: false,
        status: "ACTIVE",
      },
      order: [["id", "DESC"]],
      limit: 1,
    });

    const candidate = await db.user.findOne({
      where: { isDeleted: false, candidate_id },
    });
    let fullDate = new Date(candidate.emp_join_date);
    let currentYear = fullDate.getFullYear().toString().slice(2, 4);
    let currentMonth = (fullDate.getMonth() + 1).toString().padStart(2, "0");
    let employeeCode = `${currentMonth}${currentYear}`;

    let serial_number = 1;
    if (emp_code && emp_code.employee_code) {
      const match = emp_code.employee_code.match(/(\d{4})(\d{4})$/);
      if (match) {
        serial_number = parseInt(match[2], 10) + 1;
      }
    }

    const employee_code = `${employeeCode}${String(serial_number).padStart(
      4,
      "0"
    )}`;
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 14;
    let password = "123456789";
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      "password"
    ).toString();

    const module_detail = await db.role_module_master.findOne({
      where: { module_master_link: "ess", status: "ACTIVE" },
      attributes: ["role_module_master_id"],
    });
    const menu_details = await db.menu_master.findAll({
      where: {
        role_module_master_id: module_detail.role_module_master_id,
        status: "ACTIVE",
      },
      attributes: ["menu_master_id", "role_module_master_id"],
    });
    const assign_module = await Promise.all(
      menu_details.map(async ({ menu_master_id, role_module_master_id }) => {
        const role_access = await db.role_menu_access.create({
          role_master_id: candidate.role_master_id,
          employee_id: candidate.employee_id,
          role_module_master_id: role_module_master_id,
          role_module_master_completed: true,
          menu_master_id: menu_master_id,
          menu_completed: true,
          entity_id: entity_id,
        });
        const read_write_access = await db.read_write_access.create({
          role_master_id: candidate.role_master_id,
          employee_id: candidate.employee_id,
          role_module_master_id: role_module_master_id,
          menu_master_id: menu_master_id,
          entity_id: entity_id,
          forAll: true,
          forSingle: false,
          Write: true,
          Read: true,
          Delete: true,
        });
        return role_access, read_write_access;
      })
    );

    const update_status = await db.user.update(
      {
        status,
        employee_code,
        employee_official_email,
        primary_entity_id: entity_id,
      },
      { where: { candidate_id } }
    );
    const login_save = await db.user_login.create({
      employee_code,
      password: encryptedPassword,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      primary_entity_id: entity_id,
      employee_photo: candidate.employee_photo,
      employee_id: candidate.employee_id,
      role_master_id: candidate.role_master_id,
      employee_official_email,
    });
    const update_candistatus = await db.job_descripition_email.update(
      { onboarding_status: "COMPLETED" },
      { where: { id: candidate_id } }
    );
    const first_name = candidate?.first_name;
    const last_name = candidate?.last_name;
    const link_details = {
      web_url: (process.env.APP_FRONTEND_URL || "https://ravikrpandey.github.io/hrms-erp").replace(/\/?$/, "/"),
      emp_code: employee_code,
      password: "123456789",
    };
    await sendCandidateonboardingmail(
      employee_official_email,
      first_name,
      last_name,
      link_details,
      entity_id
    );

    if ((update_status && login_save) || update_candistatus) {
      return res
        .status(200)
        .send({ code: 200, message: "Candidate Onboarded Successfully!!" });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "Candidate Didn't Onboard!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.download_resume = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const resume_details = await db.job_descripition_email.findOne({
      where: { id: candidate_id, status: "ACTIVE" },
      order: [["id", "DESC"]],
    });
    if (!resume_details) {
      return res.status(404).send({ message: "Resume not found." });
    }
    const filePath = resume_details.cv_upload;
    res.download(filePath, (err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Could not download the file. " + err });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "An error occurred. " + error });
  }
};
