const db = require("../../../../app/models/index");

exports.create_customer_approval = async (req, res) => {
  try {
    const { employee_ids, approval_option, status } = req.body;

    if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "Please provide at least one employee_id"
      });
    }

    if (!approval_option) {
      return res.status(400).send({
        code: 400,
        message: "Document option is required"
      });
    }

    const response = await db.customerApproval.create({
      employee_ids,
      approval_option,
      status: status || "ACTIVE", 
    });

    return res.status(200).send({
      code: 200,
      message: "Customer Approval Created Successfully!",
      data: response,
    });

  } catch (error) {
    console.log("Error in create_customer_approval:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

exports.get_all_customer_approvals = async (req, res) => {
  try {
    const approvals = await db.customerApproval.findAll({
      where: { isDeleted: false },
      order: [["id", "DESC"]],
    });

    return res.status(200).send({
      code: 200,
      message: "Customer Approvals fetched successfully!",
      data: approvals,
    });

  } catch (error) {
    console.log("Error in get_all_customer_approvals:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

exports.get_customer_approvalById = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await db.customerApproval.findOne({
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


exports.update_customer_approval = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_ids, approval_option, status } = req.body;

    if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "Please provide at least one employee_id",
      });
    }

    if (!approval_option) {
      return res.status(400).send({
        code: 400,
        message: "Document option is required",
      });
    }

 
    const approval = await db.customerApproval.findOne({
      where: { id, isDeleted: false },
    });

    if (!approval) {
      return res.status(404).send({
        code: 404,
        message: "Customer Approval not found!",
      });
    }


    const [updated] = await db.customerApproval.update(
      {
        employee_ids,
        approval_option,
        status: status || "ACTIVE",
      },
      {
        where: { id, isDeleted: false },
      }
    );

    if (!updated) {
      return res.status(400).send({
        code: 400,
        message: "Customer Approval update failed!",
      });
    }


    const updatedApproval = await db.customerApproval.findOne({
      where: { id, isDeleted: false },
    });

    return res.status(200).send({
      code: 200,
      message: "Customer Approval Updated Successfully!",
      data: updatedApproval,
    });

  } catch (error) {
    console.log("Error in update_customer_approval:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.delete_customer_approval = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await db.customerApproval.findOne({
      where: { id, isDeleted: false },
    });

    if (!approval) {
      return res.status(404).send({
        code: 404,
        message: "Customer Approval not found!",
      });
    }

    await db.customerApproval.update(
      { isDeleted: true },
      { where: { id } }
    );

    return res.status(200).send({
      code: 200,
      message: "Customer Approval Deleted Successfully!",
    });

  } catch (error) {
    console.log("Error in delete_customer_approval:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};



exports.getEmployeeListForAll = async (req, res) => {
  try {
    const { approval_option } = req.query;

    if (!approval_option) {
      return res.status(400).send({
        code: 400,
        message: "approval_option is required"
      });
    }

    let employees = await db.user.findAll({
      where: {
        isDeleted: false,
        status: "ACTIVE"
      },
      attributes: ["employee_id", "first_name", "last_name", "employee_code"]
    });
   
    const approvals = await db.customerApproval.findAll({
      where: { isDeleted: false },
      attributes: ["employee_ids", "approval_option"]
    });

    let usedEmployeesMap = {};
    approvals.forEach((appr) => {
      let empIds = appr.employee_ids;

      if (typeof empIds === "string") {
        try {
          empIds = JSON.parse(empIds);
        } catch (err) {
          empIds = [];
        }
      }

      if (Array.isArray(empIds)) {
        empIds.forEach(empId => {
          if (!usedEmployeesMap[empId]) usedEmployeesMap[empId] = [];
          usedEmployeesMap[empId].push(appr.approval_option);
        });
      }
    });

    let filteredEmployees = employees.filter(emp => {
      let usedOptions = usedEmployeesMap[emp.employee_id] || [];

      if (usedOptions.includes(approval_option)) {
        return false;
      }

      return true;
    });

    return res.status(200).send({
      code: 200,
      message: "Employee list fetched successfully",
      data: filteredEmployees
    });

  } catch (error) {
    console.error("Error in getEmployeeListForAll:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};



