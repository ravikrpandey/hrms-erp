const db = require("../../../../app/models/index");

exports.create_level_employee = async (req, res) => {
  try {
    const { level, employee_ids } = req.body;
    if (!level) {
      return res.status(400).send({
        code: 400,
        message: "Level is required"
      });
    }

    if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "Please provide at least one employee_id"
      });
    }

    // Create new record
    const response = await db.levelEmployee.create({
      level,
      employee_ids
    });

    return res.status(200).send({
      code: 200,
      message: "Level-Employee mapping created successfully!",
      data: response,
    });

  } catch (error) {
    console.log("Error in create_level_employee:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

exports.get_all_emplevel_map = async (req, res) => {
  try {
    const approvals = await db.levelEmployee.findAll({
      where: { isDeleted: false },
      order: [["id", "DESC"]],
    });

    return res.status(200).send({
      code: 200,
      message: "Employee Level Mapping fetched successfully!",
      data: approvals,
    });

  } catch (error) {
    console.log("Error in get_all_emplevel_map:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

exports.get_levelmap_employeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await db.levelEmployee.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!approval) {
      return res.status(404).send({
        code: 404,
        message: "Customer Approval not found!",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Customer Approval fetched successfully!",
      data: approval,
    });

  } catch (error) {
    console.log("Error in get_customer_approvalById:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.update_level_employee = async (req, res) => {
  try {
    const { id } = req.params;
    const { level, employee_ids } = req.body;

    if (!level) {
      return res.status(400).send({
        code: 400,
        message: "Level is required"
      });
    }

    if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "Please provide at least one employee_id"
      });
    }
    const response = await db.levelEmployee.update(
      { level, employee_ids },
      { where: { id } }
    );

    return res.status(200).send({
      code: 200,
      message: "Level-Employee mapping updated successfully!",
      data: response,
    });

  } catch (error) {
    console.log("Error in update_level_employee:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

exports.getEmployeeListForLevel = async (req, res) => {
  try {
    let employees = await db.user.findAll({
      where: {
        isDeleted: false,
        status: "ACTIVE",
        organization_id: null
      },
      attributes: ["employee_id", "first_name", "last_name", "employee_code"]
    });

    const levelMappings = await db.levelEmployee.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
      attributes: ["employee_ids", "level"]
    });

    let usedEmployeesSet = new Set();
    let usedLevelsSet = new Set();

    levelMappings.forEach((mapping) => {
      // collect used levels
      if (mapping.level) {
        usedLevelsSet.add(mapping.level);
      }

      let empIds = mapping.employee_ids;

      if (typeof empIds === "string") {
        try {
          empIds = JSON.parse(empIds);
        } catch (err) {
          empIds = [];
        }
      }

      if (Array.isArray(empIds)) {
        empIds.forEach(empId => usedEmployeesSet.add(empId));
      }
    });

    let filteredEmployees = employees.filter(emp => !usedEmployeesSet.has(emp.employee_id));
    return res.status(200).send({
      code: 200,
      message: "Employee list fetched successfully",
      data: filteredEmployees, employees,
      usedLevels: Array.from(usedLevelsSet)
    });

  } catch (error) {
    console.error("Error in getEmployeeListForLevel:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};


exports.delete_levelmap_employee = async (req, res) => {
  try {
    const { id } = req.params;

    const levelEmployee = await db.levelEmployee.findOne({
      where: { id, isDeleted: false },
    });

    if (!levelEmployee) {
      return res.status(404).send({
        code: 404,
        message: "Level-Employee mapping not found!",
      });
    }

    await db.levelEmployee.update(
      { isDeleted: true },
      { where: { id } }
    );

    return res.status(200).send({
      code: 200,
      message: "Level-Employee mapping deleted successfully!",
    });

  } catch (error) {
    console.log("Error in delete_level_employee:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};


exports.reportingManager_ExistinWorkflow = async (req, res) => {
  try {
    let login_id = req.params.id;

    // Step 1: Find employee
    let findRM = await db.user.findOne({ where: { employee_id: login_id } });
    if (!findRM) {
      return res.status(404).send({
        code: 404,
        message: "Employee not found"
      });
    }

    let reporting_Man_id = findRM.reporting_manager_id;

    // Step 2: Get all workflow levels
    let isExistReporting = await db.levelEmployee.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
      raw: true
    });

    // Step 3: Build trace for all levels
    let trace = isExistReporting.map(level => ({
      level: level.level,
      exists: Array.isArray(level.employee_ids) && level.employee_ids.includes(reporting_Man_id),
      employee_ids: level.employee_ids
    }));

    // Step 4: Check if reporting manager exists in any level
    let existsInAny = trace.some(t => t.exists);

    return res.status(200).send({
      code: 200,
      message: "Reporting Manager does not exist in workflow list!",
      exists: existsInAny,
      trace,
      reporting_Man_id
    });

  } catch (error) {
    console.log("Error in reportingManager_ExistinWorkflow:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

