const db = require("../../../models/index");
const ExcelJS = require('exceljs');
const path = require('path');
const CryptoJS = require("crypto-js");


exports.getAllEmployeeWithCode = async (req, res) => {
  try {

    const employees = await db.user.findAll({
      where: {
        status: "ACTIVE",
      },
      attributes: ['employee_id','first_name', 'last_name', 'employee_code']
    });

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No manager found!.",
      });
    }

    return res.status(200).json({
      status: 200,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching manager details:", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch manager details.",
      error: error.message,
    });
  }
};

async function getPrimaryEntityId(value) {
  if (!value) return null;
  const record = await db.entityMaster.findOne({ where: { entity_name: value } });
  return record ? record.dataValues.id : null;
}
async function getEmploymentTypeId(value) {
  if (!value) return null;
  const record = await db.employmenttype.findOne({ where: { emptype_name: value } });
  return record ? record.dataValues.emptype_id : null;
}
async function getCountryId(value) {
  if (!value) return null;
  const record = await db.countryss.findOne({ where: { countryss_name: value } });
  return record ? record.dataValues.countryss_id : null;
}
async function getStateId(value) {
  if (!value) return null;
  const record = await db.states.findOne({ where: { states_name: value } });
  return record ? record.dataValues.states_id : null;
}
async function getCityId(value) {
  if (!value) return null;
  const record = await db.city.findOne({ where: { city_name: value } });
  return record ? record.dataValues.city_id : null;
}
async function getDesignationId(value) {
  if (!value) return null;
  const record = await db.designation.findOne({ where: { designation_name: value } });
  return record ? record.dataValues.designation_id : null;
}
async function getBranchId(value) {
  if (!value) return null;
  const record = await db.tbl_branch.findOne({ where: { branch_name: value } });
  return record ? record.dataValues.id : null;
}
async function getDepartmentId(value) {
  if (!value) return null;
  const record = await db.department.findOne({ where: { department_name: value } });
  return record ? record.dataValues.dept_id : null;
}
async function getManagerId(fullName) {
  if (!fullName) return null;
  const [firstName, ...rest] = fullName.trim().split(" ");
  const lastName = rest.join(" ");
  const user = await db.user.findOne({ where: { first_name: firstName, last_name: lastName } });
  return user ? user.employee_id : null;
}

exports.upload_employee_excelData = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({
      success: false,
      message: "file is not provided",
    });
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  if (fileExtension !== ".xlsx") {
    return res.status(404).json({
      success: false,
      message: "Invalid file format. Only '.xlsx' is allowed.",
    });
  }

  const filePath = req.file.path;

  //direct logic 

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const rows = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    const data = {};
    worksheet.getRow(1).eachCell((cell, index) => {
      data[cell.value] = row.getCell(index).value;
    });
    const isEmpty = Object.values(data).every(val => val === null || val === '');
    if (isEmpty) return;
    rows.push(data);
  });

  for (let row of rows) {
    const { isValid, missingFields } = validateHeadersForEmployee(row);
    if (!isValid) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missingFields.join(", ")}` });
    }

    const formatted = formatRowData(row);


    const existingPersonalEmail = await db.user.findOne({
      where: { emp_personal_email: formatted.emp_personal_email }
    });

    if (existingPersonalEmail) {
      return res.status(400).json({ success: false, message: "Email Id or Employee Number could not be same!." });
    }

    try {
      let emp_join_date = formatted.emp_join_date;

      if (emp_join_date) {
        function convertToIST(utcDateString) {
          return new Date(
            new Date(utcDateString).getTime() +
            5 * 60 * 60 * 1000 +
            30 * 60 * 1000
          ).toISOString().slice(0, 10);
        }
        emp_join_date = convertToIST(emp_join_date);
      }

      // Assuming employee_id is undefined for new entries
      const employee_id = null;  // Or get this from formatted or row if exists

      if (!employee_id) {
        let password = "123456789";
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          "password"
        ).toString();
        const emp_code = await db.user.findOne({
          where: { isDeleted: false, status: "ACTIVE" },
          order: [["employee_id", "DESC"]],
        });
        let fullDate = new Date(emp_join_date);
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
        const generated_employee_code = `${employeeCode}${String(serial_number).padStart(4, "0")}`;

        const employee_save = await db.user.create({
          title: formatted.title,
          employee_code: generated_employee_code,
          first_name: formatted.first_name,
          middle_name: formatted.middle_name,
          last_name: formatted.last_name,
          gender: formatted.gender,
          date_of_birth: formatted.date_of_birth,
          emp_personal_email: formatted.emp_personal_email,
          employee_official_email: formatted.employee_official_email,
          contact_number: formatted.contact_number,
          official_contact_number: formatted.official_contact_number,
          reporting_manager_id: await getManagerId(formatted.reporting_manager_id),
          approval_manager_id: await getManagerId(formatted.approval_manager_id),
          primary_entity_id: await getPrimaryEntityId(formatted.primary_entity_id),
          primary_branch_id: await getBranchId(formatted.primary_branch_id),
          department_id: await getDepartmentId(formatted.department_id),
          emplyoment_type_id: await getEmploymentTypeId(formatted.emplyoment_type_id),
          emp_join_date: emp_join_date,
          emp_probation_date: formatted.emp_probation_date,
          ESIC_number: formatted.ESIC_number,
          designation_id: await getDesignationId(formatted.designation_id),
          status: formatted.status,
          isHandiCap: formatted.isHandiCap,
          employee_country_id: await getCountryId(formatted.employee_country_id),
          employee_state_id: await getStateId(formatted.employee_state_id),
          employee_city_id: await getCityId(formatted.employee_city_id),
        });


        const login_save = await db.user_login.create({
          first_name: employee_save.first_name,
          last_name: employee_save.last_name,
          employee_code: employee_save.employee_code,
          primary_entity_id: employee_save.primary_entity_id,
          password: encryptedPassword,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message || "Internal server error." });
    }
  }

  res.status(200).json({ success: true, message: "File uploaded successfully!." });

};


const validateHeadersForEmployee = (dataRow) => {
  const requiredHeaders = [
    'Title',
    'First Name',
    'Middle Name',
    'Last Name',
    'Entity',
    'Gender',
    'Date Of Birth',
    'Country',
    'State',
    'City',
    'Personal Email Id',
    'Official Email Id',
    'Contact Number',
    'Official Contact Number',
    'Reporting Manager',
    'Approval Manager',
    'Primary Branch',
    'Department',
    'Employment Type',
    'Date Of Joining',
    'Date Of Probation',
    'ESIC Number',
    'Designation',
    'Status',
    'Handicapped',
  ];

  console.log("--------inside employeee data-------");
  console.log("Row received:", dataRow);

  // Extract actual header keys from object
  const headers = Object.keys(dataRow);

  const missingHeaders = requiredHeaders.filter(field => !headers.includes(field));
  const extraHeaders = headers.filter(field => !requiredHeaders.includes(field));

  return {
    isValid: missingHeaders.length === 0 && extraHeaders.length === 0,
    missingHeaders,
    extraHeaders
  };
};



const validateHeadersForAttendance = (headers) => {
  const requiredHeaders = [
    'Select Employee',
    'Present Days',
    'Absent Days',
    'Unpaid Leaves',
    'Half Days',
    'Unpaid Half Leaves',
    'Week Off Full Day',
    'Week Off Half Day',
    'Paid Leave Full Day',
    'Paid Leave Half Day',
    'Half Paid Leave Full Day',
    'Half Paid Leave Half Day',
    'Non Paid Leave Full Day',
    'Non Paid Leave Half Day',
    'Holiday',
    'Attendance Month',
    'Salary Process Month',
    'Attendance Year',
    'Payroll Cycle Start Date',
    'Payroll Cycle End Date',
    'Total Days In Months',
    'Total Paid Days',
    'Financial Year',
  ];

  const missingHeaders = requiredHeaders.filter(field => !headers.includes(field));
  const extraHeaders = headers.filter(field => !requiredHeaders.includes(field));

  return {
    isValid: missingHeaders.length === 0 && extraHeaders.length === 0,
    missingHeaders,
    extraHeaders
  };
};


const formatValue = (val) => {
  if (val == null) return null;
  if (typeof val === "object" && val.text) return val.text.trim(); // ExcelJS rich text
  return String(val).trim();
};

const formatRowData = (row) => {
  const formatted = {
    title: formatValue(row["Title"]),
    // employee_code: formatValue(row["Employee Number"]),
    first_name: formatValue(row["First Name"]),
    middle_name: formatValue(row["Middle Name"]),
    last_name: formatValue(row["Last Name"]),
    primary_entity_id: formatValue(row["Entity"]),
    gender: formatValue(row["Gender"]),
    date_of_birth: formatValue(row["Date Of Birth"]),
    employee_country_id: formatValue(row["Country"]),
    employee_state_id: formatValue(row["State"]),
    employee_city_id: formatValue(row["City"]),
    emp_personal_email: formatValue(row["Personal Email Id"]),
    employee_official_email: formatValue(row["Official Email Id"]),
    contact_number: formatValue(row["Contact Number"]),
    official_contact_number: formatValue(row["Official Contact Number"]),
    reporting_manager_id: formatValue(row["Reporting Manager"]),
    approval_manager_id: formatValue(row["Approval Manager"]),
    primary_branch_id: formatValue(row["Primary Branch"]),
    department_id: formatValue(row["Department"]),
    emplyoment_type_id: formatValue(row["Employment Type"]),
    emp_join_date: formatValue(row["Date Of Joining"]),
    emp_probation_date: formatValue(row["Date Of Probation"]),
    ESIC_number: formatValue(row["ESIC Number"]),
    designation_id: formatValue(row["Designation"]),
    status: formatValue(row["Status"]),
    isHandiCap: formatValue(row["Handicapped"]),
    specification_fields: [],
  };

  for (let i = 1; i <= 20; i++) {
    const key = formatValue(row[`Key${i}`]);
    const value = formatValue(row[`Value${i}`]);
    if (key && value) {
      formatted.specification_fields.push({ key, value });
    }
  }

  return formatted;
};

const formatRowDataForAttendance = (row) => {
  const formatted = {
    employee: formatValue(row["Select Employee"]),
    total_P: formatValue(row["Present Days"]),
    total_A: formatValue(row["Absent Days"]),
    total_UL: formatValue(row["Unpaid Leaves"]),
    total_HD: formatValue(row["Half Days"]),
    total_UHL: formatValue(row["Unpaid Half Leaves"]),
    total_WFO: formatValue(row["Week Off Full Day"]),
    total_WHO: formatValue(row["Week Off Half Day"]),
    total_PFD: formatValue(row["Paid Leave Full Day"]),
    total_PHD: formatValue(row["Paid Leave Half Day"]),
    total_HPFD: formatValue(row["Half Paid Leave Full Day"]),
    total_HPHD: formatValue(row["Half Paid Leave Half Day"]),
    total_NPFD: formatValue(row["Non Paid Leave Full Day"]),
    total_NPHD: formatValue(row["Non Paid Leave Half Day"]),
    total_H: formatValue(row["Holiday"]),
    att_month: formatValue(row["Attendance Month"]),
    salary_process_month: formatValue(row["Salary Process Month"]),
    att_year: formatValue(row["Attendance Year"]),
    payroll_cycle_start_date: formatValue(row["Payroll Cycle Start Date"]),
    payroll_cycle_end_date: formatValue(row["Payroll Cycle End Date"]),
    working_days: formatValue(row["Total Days In Months"]),
    total_present_day: formatValue(row["Total Paid Days"]),
    financial_year: formatValue(row["Financial Year"]),
    // status: formatValue(row["Status"]),
    specification_fields: [],
  };

  for (let i = 1; i <= 23; i++) {
    const key = formatValue(row[`Key${i}`]);
    const value = formatValue(row[`Value${i}`]);
    if (key && value) {
      formatted.specification_fields.push({ key, value });
    }
  }

  return formatted;
};

/////////FOR ATTENDANCE DATA UPLOAD//////////
exports.upload_attendance_excelData = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({
      success: false,
      message: "file is not provided",
    });
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  if (fileExtension !== ".xlsx") {
    return res.status(404).json({
      success: false,
      message: "Invalid file format. Only '.xlsx' is allowed.",
    });
  }

  const filePath = req.file.path;

  //direct logic 

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const rows = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    const data = {};
    worksheet.getRow(1).eachCell((cell, index) => {
      data[cell.value] = row.getCell(index).value;
    });
    const isEmpty = Object.values(data).every(val => val === null || val === '');
    if (isEmpty) return;
    rows.push(data);
  });
  // Extract headers
  const headers = worksheet.getRow(1).values.slice(1); // remove null index 0

  // Validate headers
  const { isValid, missingHeaders, extraHeaders } = validateHeadersForAttendance(headers);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: `Header mismatch! Missing: ${missingHeaders.join(", ")}, Extra: ${extraHeaders.join(", ")}`
    });
  }

  for (let row of rows) {
    // if (!isValid) {
    //   return res.status(400).json({ success: false, message: `Missing fields: ${missingFields.join(", ")}` });
    // }

    const formatted = formatRowDataForAttendance(row);

    const empString = formatted.employee; // "Dinesh Chomal 05230147"
    const parts = empString.split(" ");
    const emp_code = parts.pop(); // last item → "05230147"
    const last_name = parts.pop(); // second last item → "Chomal"
    const first_name = parts.join(" "); // remaining → "Dinesh"


    const employee = await db.user.findOne({
      where: {
        first_name: first_name,
        last_name: last_name,
        employee_code: emp_code
      }
    });
    const financialYearId = await db.financial_year.findOne({
      where: {
        financial_year: formatted.financial_year,
      }
    });

    const employeeId = employee ? employee.employee_id : null;
    const empEntityId = employee ? employee.primary_entity_id : null;
    const financialId = financialYearId ? financialYearId.id : null;


    try {
      // Check if record already exists for same employee + financial year + payroll cycle dates
      const existingRecord = await db.payroll_att_month.findOne({
        where: {
          employee_id: employeeId,
          financial_year_id: financialId,
          att_month:formatted.att_month,
        },
      });

      if (existingRecord) {
        // Update existing record
        await existingRecord.update({
          total_P: formatted.total_P,
          total_A: formatted.total_A,
          total_UL: formatted.total_UL,
          total_DA: 0,
          total_HD: formatted.total_HD,
          total_UHL: formatted.total_UHL,
          total_CO: 0,
          total_WFO: formatted.total_WFO,
          total_WHO: formatted.total_WHO,
          att_month: formatted.att_month,
          salary_process_month: formatted.salary_process_month,
          att_year: formatted.att_year,
          payroll_cycle_start_date: formatted.payroll_cycle_start_date,
          payroll_cycle_end_date: formatted.payroll_cycle_end_date,
          working_days: formatted.working_days,
          total_present_day: formatted.total_present_day,
          status: "ACTIVE",
          entity_id: empEntityId,
          total_DP: 0,
          financial_year_id: financialId,
          total_PFD: formatted.total_PFD,
          total_PHD: formatted.total_PHD,
          total_HPFD: formatted.total_HPFD,
          total_HPHD: formatted.total_HPHD,
          total_NPFD: formatted.total_NPFD,
          total_NPHD: formatted.total_NPHD,
          total_H: formatted.total_H,
        });
      } else {
        // Create new record
        await db.payroll_att_month.create({
          total_P: formatted.total_P,
          total_A: formatted.total_A,
          total_UL: formatted.total_UL,
          total_DA: 0,
          total_HD: formatted.total_HD,
          total_UHL: formatted.total_UHL,
          total_CO: 0,
          total_WFO: formatted.total_WFO,
          total_WHO: formatted.total_WHO,
          att_month: formatted.att_month,
          salary_process_month: formatted.salary_process_month,
          att_year: formatted.att_year,
          payroll_cycle_start_date: formatted.payroll_cycle_start_date,
          payroll_cycle_end_date: formatted.payroll_cycle_end_date,
          working_days: formatted.working_days,
          total_present_day: formatted.total_present_day,
          status: "ACTIVE",
          employee_id: employeeId,
          entity_id: empEntityId,
          financial_year_id: financialId,
          total_DP: 0,
          total_PFD: formatted.total_PFD,
          total_PHD: formatted.total_PHD,
          total_HPFD: formatted.total_HPFD,
          total_HPHD: formatted.total_HPHD,
          total_NPFD: formatted.total_NPFD,
          total_NPHD: formatted.total_NPHD,
          total_H: formatted.total_H,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message || "Internal server error." });
    }

  }

  res.status(200).json({ success: true, message: "File uploaded successfully!." });

};