const db = require("../../../models/index");
const fnf_employee_details = db.fnf_emp_details;
const Fnf_Earnings = db.fnf_earning;
const fnf_Deduction_details = db.fnf_deduction;
const fnf_Summary_details = db.fnf_summary;
const fnf_document_details = db.fnf_doc;
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const sendMail = require('../../../../app/master/services/nodemailer');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.createFnfFullData = async (req, res) => {

  try {
    const {
      employee_details,
      earning_details,
      deduction_details,
      summary_details,
      document_details
    } = req.body;

    if (!employee_details) {
      return res.status(400).json({ message: 'Employee details are required' });
    }

    const employee_id = employee_details.employee_id;
    const employee_code = employee_details.employee_code


    const existingFnf = await db.fnf_emp_details.findOne({
      where: { employee_id }
    });

    if (existingFnf) {
      return res.status(409).json({
        message: `FnF record already exists  ${employee_code}`
      });
    }


    const employee = await db.fnf_emp_details.create(employee_details);
    const fnf_employee_id = employee.id;

    if (earning_details) {
      await db.fnf_earning.create({ ...earning_details, fnf_employee_id, employee_id });
    }

    if (deduction_details) {
      await db.fnf_deduction.create({ ...deduction_details, fnf_employee_id, employee_id });
    }

    if (summary_details) {
      await db.fnf_summary.create({ ...summary_details, fnf_employee_id, employee_id });
    }

    if (document_details) {
      await db.fnf_doc.create({ ...document_details, fnf_employee_id, employee_id });
    }

    return res.status(200).json({
      message: 'FnF details saved successfully',
      fnf_employee_id
    });

  } catch (error) {
    console.error('FnF Submit Error:', error);
    return res.status(500).json({
      message: 'Submission failed',
      error: error.message
    });
  }
};


exports.updateFnfFullData = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const employee_id = req.params.employee_id;

    const {
      employee_details,
      earning_details,
      deduction_details,
      summary_details,
      document_details
    } = req.body;

    if (!employee_id) {
      return res.status(400).json({ message: 'employee_id is required in URL' });
    }

    // Check if employee record exists
    let emp = await db.fnf_emp_details.findOne({ where: { employee_id } });

    // If not exists, create basic record
    if (!emp) {
      if (employee_details) {
        emp = await db.fnf_emp_details.create({ employee_id, ...employee_details });
      } else {
        return res.status(404).json({ message: 'FnF record not found and no employee_details provided to create one' });
      }
    } else {
      // If exists and basic details provided, update them
      if (employee_details) {
        await db.fnf_emp_details.update(employee_details, { where: { employee_id } });
      }
    }

    const fnf_employee_id = emp.id;

    // Earning
    if (earning_details) {
      const earningExists = await db.fnf_earning.findOne({ where: { fnf_employee_id } });

      if (earningExists) {
        await db.fnf_earning.update(earning_details, { where: { fnf_employee_id } });
      } else {
        await db.fnf_earning.create({ ...earning_details, fnf_employee_id });
      }
    }

    // Deduction
    if (deduction_details) {
      const deductionExists = await db.fnf_deduction.findOne({ where: { fnf_employee_id } });

      if (deductionExists) {
        await db.fnf_deduction.update(deduction_details, { where: { fnf_employee_id } });
      } else {
        await db.fnf_deduction.create({ ...deduction_details, fnf_employee_id });
      }
    }

    // Summary
    if (summary_details) {
      const summaryExists = await db.fnf_summary.findOne({ where: { fnf_employee_id } });

      if (summaryExists) {
        await db.fnf_summary.update({
          ...summary_details,
          audit_log: summary_details.timestamp_log,
          hr_approval_date: summary_details.date_of_approval
        }, {
          where: { fnf_employee_id }
        });
      } else {
        await db.fnf_summary.create({ ...summary_details, fnf_employee_id, audit_log: summary_details.timestamp_log });
      }
    }
     
    // Document
    if (document_details) {
      const docExists = await db.fnf_doc.findOne({ where: { fnf_employee_id } });

      if (docExists) {
        await db.fnf_doc.update({ ...document_details, payment_status: document_details.final_payment_status }, { where: { fnf_employee_id } });
      } else {
        await db.fnf_doc.create({ ...document_details, payment_status: document_details.final_payment_status, fnf_employee_id, });
      }
    }

  // Make employee INACTIVE
    const exit = await db.user_login.update(
      { status: "INACTIVE" },
      { where: { employee_id }, transaction: t }
    );

    const exit2 = await db.user.update(
      { status: "INACTIVE" },
      { where: { employee_id }, transaction: t }
    );

    await t.commit();
    return res.status(200).json({ message: "FnF data updated successfully and employee set to INACTIVE", data: exit, data:exit2 });

  } catch (error) {
    await t.rollback();
    console.error('FnF update error:', error);
    return res.status(500).json({ message: 'Update failed', error: error.message });
  }
};




exports.getFnfFullDataById = async (req, res) => {
  try {
    const employee_id= req.params.employee_id;

    if (!employee_id) {
      return res.status(400).json({ message: 'employee_id is required' });
    }

    const [rows] = await db.sequelize.query(`
      SELECT 
        ER.*, 
        MD.department_name, 
        RU.employee_code, 
        fmd.fnf_status, 
        RU.start_working_date,
        fmd.resignation_type,
        ED.designation_name,
        fmd.id AS fnf_employee_id,

        -- Earning Details
        fe.final_salary, fe.bonus_amount, fe.gratuity_amount, fe.leave_encashment_amount, fe.leave_encashment_days,

        -- Deduction Details
        fed.lop_days, fed.lop_deduction_amount, fed.loan_recovery_amount, fed.assets_recovery_amount, fed.notice_pay_recovery,

        -- Summary Details
        fsd.tds_tax_deductions, fsd.hr_approval, fsd.hr_approval_date, fsd.finance_approval, fsd.comments, fsd.audit_log,

        -- Document Details
        fdd.payment_status, fdd.payment_date, fdd.payment_method, fdd.transaction_id, fdd.remark

      FROM ESS_EMPLOYEE_RESIGNATION AS ER
      LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = ER.department_id
      LEFT JOIN HRMS_REGISTERED_USER AS RU ON RU.employee_id = ER.employee_id
      LEFT JOIN DESIGNATION AS ED ON ED.designation_id = RU.designation_id
      LEFT JOIN FNF_EMPLOYEE_DETAILS AS fmd ON ER.employee_id = fmd.employee_id
      LEFT JOIN FNF_EARNING AS fe ON fe.fnf_employee_id = fmd.id
      LEFT JOIN FNF_DEDUCTION_DETAILS AS fed ON fed.fnf_employee_id = fmd.id
      LEFT JOIN FNF_SUMMARY_DETAILS AS fsd ON fsd.fnf_employee_id = fmd.id
      LEFT JOIN FNF_DOCUMENT_DETAILS AS fdd ON fdd.fnf_employee_id = fmd.id

      WHERE ER.isDeleted = false 
        AND ER.status = 'APPROVED' 
        AND ER.employee_id = ?;
    `, {
      replacements: [employee_id]
    });

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'FnF employee record not found' });
    }

    const data = rows[0];

    // Safely parse earning values
    const final_salary = parseFloat(data.final_salary) || 0;
    const bonus_amount = parseFloat(data.bonus_amount) || 0;
    const gratuity_amount = parseFloat(data.gratuity_amount) || 0;
    const leave_encashment_amount = parseFloat(data.leave_encashment_amount) || 0;
    const total_earnings = final_salary + bonus_amount + gratuity_amount + leave_encashment_amount;

    // Safely parse deduction values
    const lop_deduction_amount = parseFloat(data.lop_deduction_amount) || 0;
    const loan_recovery_amount = parseFloat(data.loan_recovery_amount) || 0;
    const assets_recovery_amount = parseFloat(data.assets_recovery_amount) || 0;
    const notice_pay_recovery = parseFloat(data.notice_pay_recovery) || 0;
    const total_deductions = lop_deduction_amount + loan_recovery_amount + assets_recovery_amount + notice_pay_recovery;

    // Tax and Net Calculations
    const tds_tax_deductions = parseFloat(data.tds_tax_deductions) || 0;
    const net_fnf_payable = total_earnings - total_deductions;
    const final_amount_payable = net_fnf_payable - tds_tax_deductions;

    const response = {
      employee_details: {
        resignation_id: data.id,
        employee_id: data.employee_id,
        employee_name: data.employee_name,
        resignation_type: data.resignation_type,
        last_working_day: data.last_working_day,
        date_of_joining: data.start_working_date,
        department_id: data.department_id,
        department_name: data.department_name,
        employee_code: data.employee_code,
        designation_name: data.designation_name,
        fnf_status: data.fnf_status,
      },
      earning_details: {
        final_salary: data.final_salary,
        bonus_amount: data.bonus_amount,
        gratuity_amount: data.gratuity_amount,
        leave_encashment_amount: data.leave_encashment_amount,
        leave_encashment_days: data.leave_encashment_days,
        total_earnings
      },
      deduction_details: {
        lop_days: data.lop_days,
        lop_deduction_amount,
        loan_recovery_amount,
        assets_recovery_amount,
        notice_pay_recovery,
        total_deductions
      },
      summary_details: {
        total_earnings,
        total_deductions,
        net_fnf_payable,
        tds_tax_deductions,
        final_amount_payable,
        hr_approval: data.hr_approval,
        hr_approval_date: data.hr_approval_date,
        finance_approval: data.finance_approval,
        audit_log: data.audit_log,
        comments: data.comments
      },
      document_details: {
        payment_status: data.payment_status,
        payment_date: data.payment_date,
        payment_method: data.payment_method,
        transaction_id: data.transaction_id,
        remark: data.remark
      }
    };

    return res.status(200).json({ data: response });

  } catch (error) {
    console.error('Get FnF error:', error);
    return res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};
exports.getMinimalFnfList = async (req, res) => {
  try {
    const records = await db.fnf_emp_details.findAll({
      include: [
        { model: db.fnf_earning, as: 'earningsByFnfId' },
        { model: db.fnf_summary, as: 'summariesByFnfId' },
        { model: db.fnf_doc, as: 'documentsByFnfId' }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const minimalList = records.map(item => ({
      employee_id: item.employee_id,
      employee_name: item.employee_name,
      department: item.department,
      designation: item.designation,
      fnf_status: item.fnf_status,
      final_salary: item.earningsByFnfId?.[0]?.final_salary || null,
      net_fnf_payable: item.summariesByFnfId?.[0]?.net_fnf_payable || null,
      payment_status: item.documentsByFnfId?.[0]?.payment_status || null
    }));

    return res.status(200).json({ data: minimalList });

  } catch (error) {
    console.error('FnF List Fetch Error:', error);
    return res.status(500).json({
      message: 'Failed to fetch FnF list',
      error: error.message
    });
  }
};
module.exports.sendMailFnf = async (req, res) => {
  try {
    const { to, sub, html } = req.body;
    const file = req.file;

    // Log what's actually received
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!to || !sub || !html) {
      return res.status(400).json({ status: 400, message: 'Missing required fields: to, sub, html' });
    }
    // OPTIONAL: Skip PDF generation if you're uploading PDF
    const pdfPath = file?.path;

    const mailOptions = {
      from: '"HRMS" <elitemindz99@gmail.com>',
      to,
      subject: sub,
      html,
      attachments: [
        {
          filename: 'FNF_Details.pdf',
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    const result = await sendMail.mailsend(mailOptions);

    // Delete the uploaded PDF
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    if (result) {
      return res.status(200).json({ status: true, message: 'Email sent successfully' });
    } else {
      return res.status(500).json({ status: false, message: 'Failed to send email' });
    }

  } catch (error) {
    console.error("sendMailFnf Error:", error);
    return res.status(500).json({ status: false, message: error.message || 'Internal Server Error' });
  }
};
