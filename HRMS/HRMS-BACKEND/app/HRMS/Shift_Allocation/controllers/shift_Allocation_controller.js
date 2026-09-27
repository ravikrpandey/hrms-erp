const db = require("../../../models/index");
const ExcelJS = require('exceljs');
const { response } = require("express");
const XLSX = require('xlsx');

exports.departMentSelected = async (req, res) => {
  const { entity_id } = req.params;
  try {
    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id is required",
      });
    }

    const departmentQuery = `
      SELECT 
          hru.employee_id, 
          hru.first_name, 
          hru.middle_name, 
          hru.last_name,
          md.dept_id,
          md.department_name  
      FROM 
          MASTER_DEPARTMENT AS md
      LEFT JOIN 
          HRMS_REGISTERED_USER AS hru
      ON 
          hru.department_id = md.dept_id
      WHERE 
          md.entity_id = :entity_id;
    `;

    const departments = await db.sequelize.query(departmentQuery, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { entity_id },
    });

    return res.status(200).send({
      code: 200,
      message: "Departments and employees fetched successfully",
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};


exports.getAllShiftBasedOnEntity = async (req, res) => {
  const { entity_id } = req.params;

  try {
    const getData = await db.sequelize.query(
      `SELECT *FROM MASTER_SHIFT 
       WHERE MASTER_SHIFT.isDeleted = false AND MASTER_SHIFT.entity_id = :entity_id`,
      {
        replacements: { entity_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      code: 200,
      message: "Shifts fetched successfully",
      data: Array.isArray(getData) ? getData : [],
    });
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.create_Shift_Allocation = async (req, res) => {
  try {
    const { dept_id, employee_id, entity_id, shift_id } = req.body;
    if (!Array.isArray(employee_id) || employee_id.length === 0) {
      return res.status(400).json({
        message: "Employee ID should be an array with at least one employee.",
      });
    }
    const shiftAllocations = [];
    const skippedAllocations = [];
    const replacedAllocations = [];
    for (let empId of employee_id) {
      const existing = await db.shift_Allocation.findOne({
        where: {
          dept_id,
          employee_id: empId,
          isDeleted: false,
        },
      });

      if (existing) {
        if (existing.shift_master_id === shift_id) {
          skippedAllocations.push({ employee_id: empId, message: "Already assigned to same shift" });
          continue;
        } else {
          await db.shift_Allocation.destroy({
            where: {
              dept_id,
              employee_id: empId,
              isDeleted: false,
            },
          });
          replacedAllocations.push({ employee_id: empId, old_shift_id: existing.shift_master_id });
        }
      }
      const result = await db.shift_Allocation.create({
        dept_id,
        entity_id,
        employee_id: empId,
        shift_master_id: shift_id,
        status: "ACTIVE",
        isDeleted: false,
      });
      shiftAllocations.push(result);
    }

    return res.status(201).json({
      message: "Shift allocation processed successfully.",
      data: {
        new_allocations: shiftAllocations,
        replaced_allocations: replacedAllocations,
        skipped_allocations: skippedAllocations,
      },
    });
  } catch (error) {
    console.error("Error in create_Shift_Allocation:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.getshiftAllocationListData = async (req, res) => {
  const { entity_id } = req.params;
  try {
    const getData = await db.sequelize.query(
      `SELECT 
          hsa.employee_id,
          hsa.id AS shift_allocation_id,
          hsa.status AS status,
          hsa.dept_id,
          hru.employee_code,
          hru.first_name,
          hru.last_name,
          hru.middle_name,
          md.department_name,
          hsa.shift_master_id,
          ms.id AS shift_id,
          ms.shift_name
      FROM 
          HRMS_SHIFT_ALLOCATION hsa
      JOIN 
          HRMS_REGISTERED_USER hru 
          ON hsa.employee_id = hru.employee_id
      JOIN 
          MASTER_DEPARTMENT md 
          ON hsa.dept_id = md.dept_id
      JOIN 
          MASTER_SHIFT ms 
          ON hsa.shift_master_id = ms.id
      WHERE 
          hsa.isDeleted = 0 
          AND hsa.entity_id = :entity_id;
`,
      {
        replacements: { entity_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    const uniqueData = getData.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.dept_id === value.dept_id && t.shift_id === value.shift_id  ) 
    );

    return res.status(200).json({
      code: 200,
      message: "Shifts fetched successfully",
      data: Array.isArray(uniqueData) ? uniqueData : [],
    });
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};



exports.statusUpdate = async (req, res) => {
  try {
    const { dept_id } = req.params;
    console.log("Received request params:", req.params);
    const { status } = req.body;
    if (!dept_id || isNaN(Number(dept_id))) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid department ID provided" });
    }
    if (status === undefined || status === null || status === "") {
      return res.status(400).json({
        code: 400,
        message:
          "Bad Request: 'status' property is missing or invalid in the request body",
      });
    }
    console.log(`Updating department ID: ${dept_id} to status: ${status}`);
    const getData = await db.shift_Allocation.findOne({
      where: {
        dept_id: dept_id,
        isDeleted: false,
      },
    });
    if (!getData) {
      return res.status(404).json({ code: 404, message: "Record Not Found" });
    }
    const [updatedRows] = await db.shift_Allocation.update(
      { status },
      { where: { dept_id } }
    );
    if (updatedRows === 0) {
      return res.status(500).json({
        code: 500,
        message: "Failed to update status. No rows were affected.",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Checklist details status changed successfully!",
    });
  } catch (error) {
    console.error("Error in statusUpdate:", error);

    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};



exports.deleteShiftAllocationRecord = async (req, res) => {
  try {
    const shiftAllocation = req.params.dept_id;
    const dltStage = await db.shift_Allocation.findOne({
      where: { dept_id: shiftAllocation },
    });
    if (dltStage) {
      const deleteData = await db.shift_Allocation.update(
        { isDeleted: true },
        { where: { dept_id: shiftAllocation } }
      );

      return res.status(200).send({
        code: 200,
        message: "Data Deleted Successfully!",
        data: deleteData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};



exports.getSingleShiftAllocateddata = async (req, res) => {
  const dept_id = req.query.dept_id;
  const shift_id = req.query.shift_id;

  try {
    const shiftAllocationdata = await db.shift_Allocation.findAll({
      where: { dept_id: dept_id, isDeleted: false },
    });
    if (!shiftAllocationdata || shiftAllocationdata.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "Shift Allocation data not found",
      });
    }
    let filteredData = shiftAllocationdata;
    if (shift_id) {
      filteredData = shiftAllocationdata.filter(
        (item) => item.shift_master_id == shift_id
      );
    }
    if (!filteredData || filteredData.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "No shift allocation found for the given shift_id",
      });
    }
    const employeedata = filteredData.map((item) => item.employee_id);
    return res.status(200).json({
      code: 200,
      message: "Shift Allocation data found",
      data: filteredData,
      employeedata: employeedata,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};


exports.update_Shift_Allocation = async (req, res) => {
  try {
    const id = req.params.dept_id;
    const { dept_id, employee_id, entity_id, shift_id } = req.body;

    if (Array.isArray(employee_id) && employee_id.length > 0) {
      const updatedAllocations = [];
      const deletedAllocations = [];
      const existingEmployeeIds = [];
      const currentAllocations = await db.shift_Allocation.findAll({
        where: { dept_id, isDeleted: false, shift_master_id: shift_id },
      });
      for (let allocation of currentAllocations) {
        existingEmployeeIds.push(allocation.employee_id);
      }
      for (let empId of existingEmployeeIds) {
        if (!employee_id.includes(empId)) {
          await db.shift_Allocation.destroy({
            where: {
              dept_id,
              employee_id: empId,
              isDeleted: false,
              shift_master_id: shift_id,
            },
          });
          deletedAllocations.push({ employee_id: empId, dept_id });
        }
      }
      const newAllocations = [];
      for (let empId of employee_id) {
        let shiftAllocation = await db.shift_Allocation.findOne({
          where: {
            dept_id,
            employee_id: empId,
            isDeleted: false,
            shift_master_id: shift_id,
          },
        });
        if (shiftAllocation) {
          await db.shift_Allocation.update(
            { dept_id, entity_id, shift_master_id: shift_id },
            {
              where: {
                dept_id,
                employee_id: empId,
                shift_master_id: shift_id,
                isDeleted: false,
              },
            }
          );
          updatedAllocations.push({ employee_id: empId, dept_id, shift_id });
        } else {
          const newShiftAllocation = await db.shift_Allocation.create({
            dept_id,
            entity_id,
            employee_id: empId,
            shift_master_id: shift_id,
            status: "ACTIVE",
            isDeleted: false,
          });
          newAllocations.push({
            employee_id: empId,
            dept_id,
            shift_id,
            shift_allocation_id: newShiftAllocation.id,
          });
        }
      }
      return res.status(200).json({
        message: "Shift allocation updated and/or created successfully",
        data: {
          updated_allocations: updatedAllocations,
          new_allocations: newAllocations,
          deleted_allocations: deletedAllocations,
        },
      });
    }

    return res.status(400).json({
      message: "Employee ID should be an array with at least one employee.",
    });
  } catch (error) {
    console.error("Error in update_Shift_Allocation:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



///////////////////For Any Excel Upload///////////////////
exports.upload_excel_data = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileBuffer = req.file.buffer;
    const workbook = XLSX.read(fileBuffer, { type: "buffer", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let formattedData = sheetData
      .map(row => {
        const filteredRow = Object.fromEntries(
          Object.entries(row).filter(([_, value]) => value !== null && value !== undefined && value !== "")
        );
        return Object.keys(filteredRow).length > 0 ? formatRowData(filteredRow) : null;
      })
      .filter(row => row !== null);

    if (formattedData.length === 0) {
      return res.status(400).json({ message: "No valid data found in the file" });
    }

    // const batchSize = 1000;
    // let insertedCount = 0;
    // for (let i = 0; i < formattedData.length; i += batchSize) {
    //     const batch = formattedData.slice(i, i + batchSize);
    //     await db.sales_invoice.bulkCreate(batch, { ignoreDuplicates: true });
    //     insertedCount += batch.length;
    // }

    res.status(200).json({
      code: 200, message: "Excel processed successfully!",
      // insertedRecords: insertedCount,
    });
    setImmediate(() => processInvoicesInBackground(formattedData));
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

function formatRowData(row) {
  return {
    title: row["title"] || null,
    employee_code: row["employee_code"] || null,
    first_name: row["first_name"] || null,
    middle_name: row["middle_name"] || null,
    last_name: row["last_name"] || null,
    gender: row["gender"] || null,
    date_of_birth: row["date_of_birth"] || null,
    employee_official_email: row["employee_official_email"] || null,
    contact_number: row["contact_number"] || null,
    country_code: row["country_code"] || null,
    role_master_name: row["role_master_name"] || null,
    employee_name_in_bank: row["employee_name_in_bank"] || null,
    account_number: row["account_number"] || null,
    emp_personal_email: row["emp_personal_email"] || null,
    passport_number: row["passport_number"] || null,
    start_working_date: row["start_working_date"] || null,
    present_country_id: row["present_country_id"] || null,
    present_state_id: row["present_state_id"] || null,
    present_city_id: row["present_city_id"] || null,
    permanent_country_id: row["permanent_country_id"] || null,
    department_id: row["department_id"] || null,
    Subdepartment_id: row["Subdepartment_id"] || null,
    marital_status: row["marital_status"] || null,
    emp_join_date: row["emp_join_date"] || null,
    official_contact_number: row["official_contact_number"] || null,
    visa_number: row["visa_number"] || null,
    emirates_id_number: row["emirates_id_number"] || null,
    approval_manager_id: row["approval_manager_id"] || null,
    reporting_manager_id: row["reporting_manager_id"] || null,
    primary_entity_id: row["primary_entity_id"] || null,
    designation_id: row["designation_id"] || null,
    department_name: row["department_name"] || null,
    department_id: row["department_id"] || null,
    area_name: row["area_name"] || null,
    entity_id: row["entity_id"] || null,
  };
}

const processInvoicesInBackground = async (formattedData) => {
  console.log("Background processing started...");
  const delay = 1;
  const delayFunction = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 0; i < formattedData.length; i++) {
    let rowdata;
    let employee;
    let employee_detail;
    try {
      await delayFunction(i * delay);
      rowdata = formattedData[i];
      const reporting = rowdata.reporting_manager_id;
      const approval = rowdata.approval_manager_id;
      const report_part = splitName(reporting);
      const rfirst_name = report_part.first_name;
      const rmiddle_name = report_part.middle_name;
      const rlast_name = report_part.last_name;
      const approv_part = splitName(approval);
      const afirst_name = approv_part.first_name;
      const amiddle_name = approv_part.middle_name;
      const alast_name = approv_part.last_name;

      const dob = new Date(rowdata.date_of_birth);
      dob.setDate(dob.getDate() + 1);
      const new_dob = dob.toISOString().split('T')[0];

      employee_detail = await db.sequelize.query(
        `SELECT R.* FROM HRMS_REGISTERED_USER AS R
          WHERE TRIM((R.first_name)) = ? AND TRIM((R.last_name)) = ? AND R.date_of_birth = ?`,
        {
          replacements: [
            String(rowdata.first_name).trim(), String(rowdata.last_name).trim(), new_dob
          ], type: db.sequelize.QueryTypes.SELECT
        }
      );
      employee = employee_detail.length > 0 ? employee_detail[0] : null;


      const report_detail = await db.sequelize.query(
        `SELECT R.* FROM HRMS_REGISTERED_USER AS R
          WHERE TRIM(REPLACE(R.first_name, ' ', '')) = ? AND TRIM(REPLACE(R.last_name, ' ', '')) = ?`,
        {
          replacements: [
            String(rfirst_name).replace(/\s+/g, ''), String(rlast_name).replace(/\s+/g, '')
          ], type: db.sequelize.QueryTypes.SELECT
        }
      );
      const reporting_manager_id = report_detail.length > 0 ? report_detail[0].employee_id : null;

      const approve_detail = await db.sequelize.query(
        `SELECT R.* FROM HRMS_REGISTERED_USER AS R
          WHERE TRIM(REPLACE(R.first_name, ' ', '')) = ? AND TRIM(REPLACE(R.last_name, ' ', '')) = ?`,
        {
          replacements: [
            String(afirst_name).replace(/\s+/g, ''), String(alast_name).replace(/\s+/g, '')
          ], type: db.sequelize.QueryTypes.SELECT
        }
      );
      const approval_manager_id = approve_detail.length > 0 ? approve_detail[0].employee_id : null;

      console.log(reporting_manager_id, "reporting_manager_id");
      console.log(approval_manager_id, "approval_manager_id");
      console.log(employee.employee_id, "employee_id");
      if (employee) {
        await db.user.update({
          reporting_manager_id, approval_manager_id
        }, { where: { employee_id: employee.employee_id } });
        console.log(`Employee at ${employee.first_name} Updated`);
      }

      // const de_user_id = rowdata.Bio_Metric_ID;
      // console.log(employee, "employee");
      // console.log(de_user_id, "de_user_id");

      // if (employee) {
      //   await db.attendance_userid.create({
      //     de_user_id, employee_id: employee.employee_id, entity_id: employee.primary_entity_id
      //   });
      //   console.log(`Employee at ${employee.first_name + employee.last_name} Updated`);
      // }

      // var entity_details = await db.sequelize.query(
      //   `SELECT C.* FROM ENTITY_MASTER AS C
      //     WHERE TRIM(REPLACE(C.entity_name, ' ', '')) = ?`,
      //   {
      //     replacements: [
      //       String(rowdata.primary_entity_id).replace(/\s+/g, '')
      //     ], type: db.sequelize.QueryTypes.SELECT
      //   }
      // );
      // const entity_id = entity_details[0].id;

      // var depart_details = await db.sequelize.query(
      //   `SELECT C.* FROM MASTER_DEPARTMENT AS C
      //    WHERE TRIM(C.department_name) = ? AND C.entity_id=?`,
      //   {
      //     replacements: [rowdata.department_id.trim(), 3],
      //     type: db.sequelize.QueryTypes.SELECT
      //   }
      // );
      // const department_id = depart_details[0].dept_id;
      // // console.log(employee.first_name, "first_name");
      // // console.log(entity_id, "entity_id");
      // console.log(department_id, "department_id");
      // if (department_id) {
      //   await db.area.create({
      //     area_name: rowdata.area_name, department_id: department_id, entity_id:3
      //   });
      //   console.log(`Employee at ${rowdata.area_name} created`);
      // }
      // const entity_details = await db.sequelize.query(
      //   `SELECT C.* FROM ENTITY_MASTER AS C where C.id > 3`,
      //   {
      //     replacements: [
      //     ], type: db.sequelize.QueryTypes.SELECT
      //   }
      // );
      // const department_name=rowdata.department_name.trim();

      // for (let j = 0; j < entity_details.length; j++) {
      //   const entity_id = entity_details[j].id;
      //   await db.department.create({
      //     department_name: department_name, entity_id
      //   });
      //   console.log(`Employee at ${department_name} Created`);
      // }

      // var country_details = await db.sequelize.query(
      //   `SELECT C.* FROM MASTER_COUNTRY AS C
      //     WHERE TRIM(REPLACE(C.countryss_name, ' ', '')) = ?`,
      //   {
      //     replacements: [
      //       String(rowdata.present_country_id).replace(/\s+/g, '')
      //     ], type: db.sequelize.QueryTypes.SELECT
      //   }
      // );
      // const country = country_details[0];

      // if (rowdata.present_state_id == null) {
      //   present_states_id = rowdata.present_city_id;
      // } else {
      //   present_states_id = rowdata.present_state_id;
      // }
      // var state_details = await db.sequelize.query(
      //   `SELECT S.* FROM MASTER_STATE AS S
      //     WHERE TRIM(REPLACE(S.states_name, ' ', '')) = ?`,
      //   {
      //     replacements: [
      //       String(present_states_id).replace(/\s+/g, '')
      //     ], type: db.sequelize.QueryTypes.SELECT
      //   }
      // );
      // const present_state_id = state_details[0].states_id;

      // var city_details = await db.sequelize.query(
      //   `SELECT D.* FROM MASTER_CITY AS D
      //     WHERE TRIM(REPLACE(D.city_name, ' ', '')) = ?`,
      //   {
      //     replacements: [
      //       String(rowdata.present_city_id).replace(/\s+/g, '')
      //     ], type: db.sequelize.QueryTypes.SELECT
      //   }
      // );
      // const present_city_id = city_details[0].city_id;
      // console.log(`present_city_id:`, present_city_id);

    } catch (error) {
      console.error(`Error processing invoice ${rowdata.area_name}:`, error);
    }
  }
};

function splitName(fullName) {
  if (typeof fullName !== "string" || fullName.trim() === "") {
    return { first_name: "", middle_name: "", last_name: "" };
  }

  const nameParts = fullName.trim().split(/\s+/);

  const first_name = nameParts[0];
  const last_name = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const middle_name = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

  return { first_name, middle_name, last_name };
}
