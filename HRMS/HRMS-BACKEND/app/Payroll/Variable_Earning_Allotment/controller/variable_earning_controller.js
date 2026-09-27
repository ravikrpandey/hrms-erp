const db = require("../../../models/index");
const { Sequelize } = require('sequelize');

/////////////// Create variable Earning ///////////////

exports.createVariableEarning = async (req, res) => {
  try {
    let {
      entity_id,
      financial_year_id,
      employee_ids,
      approve_salary_percentage,
      approve_salary_amount,
      total_annual_amount,
      variable_component_details,
      credit_type,
      allotment_type,
      credit_allotment_details,
    } = req.body;

    if (!employee_ids || employee_ids.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Employee(s) required" });
    }

    const empId = employee_ids[0]; // only first employee

    const query = `
  INSERT INTO PAYROLL_VARIABLE_EARNING_ALLOTMENT 
  (variable_component_details, approve_salary_percentage, total_annual_amount, approve_salary_amount, credit_type, allotment_type, credit_allotment_details, status, isDeleted, createdAt, updatedAt, employee_id, financial_id, entity_id) 
  VALUES (:variable_component_details, :approve_salary_percentage, :total_annual_amount, :approve_salary_amount, :credit_type, :allotment_type, :credit_allotment_details, 'ACTIVE', 0, :createdAt, :updatedAt, :employee_id, :financial_id, :entity_id)
`;


    const replacements = {
      variable_component_details: JSON.stringify(variable_component_details),
      approve_salary_percentage,
      approve_salary_amount,
      credit_type,
      allotment_type,
      total_annual_amount,
      credit_allotment_details: JSON.stringify(credit_allotment_details),
      createdAt: new Date(),
      updatedAt: new Date(),
      employee_id: empId,
      financial_id: financial_year_id,
      entity_id,
    };

    const [result] = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.INSERT,
    });

    return res.status(201).send({
      status: true,
      message: "Variable earning created successfully",
      insertId: result, // ID of inserted row
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

///////////////Update variable earning////////////////

exports.updateVariableEarning = async (req, res) => {
  try {
    const { id } = req.params; // id will come from URL like /api/payroll/variable-earning/:id
    let {
      entity_id,
      financial_year_id,
      employee_ids,
      approve_salary_percentage,
      approve_salary_amount,
      variable_component_details,
      credit_type,
      total_annual_amount,
      allotment_type,
      credit_allotment_details,
    } = req.body;

    if (!id) {
      return res.status(400).send({ status: false, message: "ID is required" });
    }

    if (!employee_ids || employee_ids.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Employee(s) required" });
    }

    const empId = employee_ids[0]; // only first employee

    const query = `
      UPDATE PAYROLL_VARIABLE_EARNING_ALLOTMENT
      SET variable_component_details = :variable_component_details,
          approve_salary_percentage = :approve_salary_percentage,
          approve_salary_amount = :approve_salary_amount,
          credit_type = :credit_type,
          total_annual_amount= :total_annual_amount,
          allotment_type = :allotment_type,
          credit_allotment_details = :credit_allotment_details,
          employee_id = :employee_id,
          financial_id = :financial_id,
          entity_id = :entity_id,
          updatedAt = :updatedAt
      WHERE id = :id AND isDeleted = 0
    `;

    const replacements = {
      id,
      variable_component_details: JSON.stringify(variable_component_details),
      approve_salary_percentage,
      approve_salary_amount,
      credit_type,
      total_annual_amount,
      allotment_type,
      credit_allotment_details: JSON.stringify(credit_allotment_details),
      employee_id: empId,
      financial_id: financial_year_id,
      entity_id,
      updatedAt: new Date(),
    };

    const [result] = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.UPDATE,
    });

    if (result === 0) {
      return res
        .status(404)
        .send({ status: false, message: "Record not found or already deleted" });
    }

    return res.status(200).send({
      status: true,
      message: "Variable earning updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/////////////// Get All Variable Earning Complaint ///////////////

exports.getAllVariableEarning = async (req, res) => {
  try {
    // fetch all records with join on user table
    const records = await db.VariableEarningAllotment.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.user,
          attributes: ["first_name", "middle_name", "last_name"]
        }
      ],
      order: [["id", "DESC"]]
    });

    if (!records || records.length === 0) {
      return res.status(404).send({ code: 404, message: "No Records Found" });
    }

    // Convert and parse JSON fields
    const data = records.map((rec) => {
      let obj = rec.toJSON();

      try {
        if (obj.variable_component_details) {
          obj.variable_component_details = JSON.parse(obj.variable_component_details);
        }
        if (obj.credit_allotment_details) {
          obj.credit_allotment_details = JSON.parse(obj.credit_allotment_details);
        }
      } catch (e) {
        console.warn("JSON parse error:", e.message);
      }

      // Replace employee_id with employee_name
      if (obj.employee) {
        const { first_name, middle_name, last_name } = obj.employee;
        obj.employee_name = [first_name, middle_name, last_name].filter(Boolean).join(" ");
      }
      delete obj.employee_id; // remove employee_id if not needed
      delete obj.employee;    // remove full object if not needed

      return obj;
    });

    return res.status(200).send({
      code: 200,
      message: "Fetch Data Successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};

////////////// Get Variable Earning by ID/////////
exports.getVariableEarningById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ code: 400, message: "ID is required in query parameters" });
    }

    const record = await db.VariableEarningAllotment.findOne({
      where: {
        id,
        isDeleted: false,
      },
      include: [
        {
          model: db.user,
          attributes: ["first_name", "middle_name", "last_name", "department_id"],
          include: [
            {
              model: db.department,
              attributes: ["department_name"],
              where: { isDeleted: false },
              required: false,
            }
          ],
        }
      ],
    });

    if (!record) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }

    let data = record.toJSON();

    // Parse JSON fields safely
    try {
      if (data.variable_component_details) {
        data.variable_component_details = JSON.parse(data.variable_component_details);
      }
      if (data.credit_allotment_details) {
        data.credit_allotment_details = JSON.parse(data.credit_allotment_details);
      }
    } catch (e) {
      console.warn("JSON parse error:", e.message);
    }

    // Construct full employee name
    if (data.HRMS_REGISTERED_USER) {
      const { first_name, middle_name, last_name } = data.HRMS_REGISTERED_USER;
      data.full_name = [first_name, middle_name, last_name].filter(Boolean).join(" ");

      // Add department name from nested include
      if (data.HRMS_REGISTERED_USER.department) {
        data.department_name = data.user.department.department_name;
      }
    }

    // Optionally remove redundant keys
    delete data.user_id;
    delete data.user;

    return res.status(200).send({
      code: 200,
      message: "Record fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};


exports.getAllEmployeeByVarEarning = async (req, res) => {
  try {
    let { deptIds } = req.body;

    if (!deptIds || !Array.isArray(deptIds) || deptIds.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "No departments provided", data: [] });
    }

    // Dynamically create placeholders like :dept0, :dept1 ...
    const deptPlaceholders = deptIds.map((_, i) => `:dept${i}`).join(", ");

    let query = `
      SELECT 
        e.employee_id, 
        e.employee_code, 
        CONCAT(e.first_name, ' ', e.last_name) AS full_name,
        e.department_id,
        d.department_name,
        d.entity_id
      FROM HRMS_REGISTERED_USER e
      JOIN HRMS_EMPLOYEE_PAY_SALARY s 
        ON e.employee_id = s.employee_id
      JOIN MASTER_DEPARTMENT d
        ON e.department_id = d.dept_id
      WHERE e.department_id IN (${deptPlaceholders})
        AND s.variableearningComponentList IS NOT NULL
        AND TRIM(s.variableearningComponentList) <> ''
    `;

    // Build replacements object dynamically
    const replacements = deptIds.reduce((acc, id, i) => {
      acc[`dept${i}`] = id;
      return acc;
    }, {});

    const [employeeList] = await db.sequelize.query(query, { replacements });

    if (employeeList.length <= 0) {
      return res.status(400).send({
        status: false,
        message: "No employees found with variable earnings",
        data: [],
      });
    }

    return res.status(200).send({
      status: true,
      message: "Employees listed successfully",
      data: employeeList,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message || "Server Error" });
  }
};


exports.getVarEarningData = async (req, res) => {
  try {
    const emp_ids = req.body.employee_ids; // Corrected to match the key in your payload

    // Log emp_ids to check the input
    console.log('Employee IDs:', emp_ids);

    // Perform the database query
    const getAllData = await db.payroll_pay_salary.findAll({
      where: {
        employee_id: { [Sequelize.Op.in]: emp_ids } // using Sequelize.Op.in for array matching
      },
      attributes: ['employee_id', 'variableearningComponentList']
    });

    // Log the result of the query
    console.log('Query Result:', getAllData);

    // Check if the query result is valid and contains data
    if (getAllData && getAllData.length > 0) {
      const responseData = getAllData.map(item => {
        // Check if variableearningComponentList is a string and needs parsing
        let variableearningComponentList;
        try {
          variableearningComponentList = (typeof item.variableearningComponentList === 'string')
            ? JSON.parse(item.variableearningComponentList)
            : item.variableearningComponentList;
        } catch (err) {
          console.log('Error parsing variableearningComponentList:', err);
          variableearningComponentList = [];
        }

        return {
          employee_id: item.employee_id,
          variableearningComponentList
        };
      });

      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: responseData
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found"
      });
    }
  } catch (error) {
    // Log the error for debugging
    console.log('Error:', error);

    return res.status(500).send({
      code: 500,
      message: "Server Error"
    });
  }
};
/////////////// Delete Complaint ///////////////

exports.deleteVariableAllotmentEarning = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const Data = await db.VariableEarningAllotment.findOne({
      where: { id: id },
    });
    if (Data) {
      await db.VariableEarningAllotment.update(
        { isDeleted: true },
        { where: { id: id } }
      );
      return res
        .status(200)
        .send({ code: 200, message: "Data is Deleted Successfully!" });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.updateStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    const Data = await db.VariableEarningAllotment.findOne({
      where: { id: id },
    });
    if (Data) {
      const updateData = await db.VariableEarningAllotment.update(req.body, {
        where: { id: id },
      });
      return res
        .status(200)
        .send({
          code: 200,
          message: "Status updated successfully!",
        });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};