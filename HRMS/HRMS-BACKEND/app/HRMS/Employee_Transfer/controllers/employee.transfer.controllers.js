const { where } = require("sequelize");
const db = require("../../../models/index");
const EmployeeTransfer = db.employee_Transfer;
const EntityMaster = db.entityMaster;
const User = db.user;

exports.getAllEntity = async (req, res) => {
  const query = `
      SELECT 
      EM.entity_name,
      HRU.primary_entity_id AS entity_id,
      EM.id  AS id, 
      HRU.first_name,
      HRU.middle_name,
      HRU.last_name,
      HRU.employee_id,
      EM.company_branch,
      HRU.employee_code 
      FROM HRMS_REGISTERED_USER HRU
      JOIN ENTITY_MASTER EM 
      ON HRU.primary_entity_id = EM.id;
  `;
  try {
    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });
    if (result && result.length > 0) {
      res.status(200).json({ data: result });
    } else {
      res.status(404).json({ message: "No data found." });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res
      .status(500)
      .json({ message: `Failed to fetch entities: ${error.message}` });
  }
};

exports.save_Data_Employee_Transfer = async (req, res) => {
  try {
    const {
      toRemark,
      fromEntityId,
      toEntityId,
      approvalEntityId,
      fromEmpId,
      approvalEmpId,
      createdBy,
    } = req.body;

    const newTransfer = await db.employee_Transfer.create({
      toRemark,
      status: "ACTIVE",
      isDeleted: false,
      fromEntityId,
      toEntityId,
      approvalEntityId,
      fromEmpId,
      approvalEmpId,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Employee transfer saved successfully",
      data: newTransfer,
    });
  } catch (error) {
    console.error("Error saving employee transfer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save employee transfer",
      error: error.message,
    });
  }
};

exports.getAllEmployeeTransfers = async (req, res) => {
  try {
    const { createdBy } = req.params;

    const query = `
      SELECT 
        het.fromEntityId, 
        het.id,
        em.id AS entity_id, 
        em.entity_name, 
        het.fromEmpId, 
        het.approvalEmpId,
        het.toRemark, 
        het.IsStatus,
        het.status,
        CONCAT_WS(' ', fromEmp.first_name, fromEmp.middle_name, fromEmp.last_name) AS from_employee_name,
        fromEmp.employee_code AS from_employee_code,
        CONCAT_WS(' ', approvalEmp.first_name, approvalEmp.middle_name, approvalEmp.last_name) AS approval_employee_name,
        approvalEmp.employee_code AS approval_employee_code
      FROM 
        HRMS_EMPLOYEE_TRANSFER het
      JOIN 
        ENTITY_MASTER em ON em.id = het.fromEntityId
      JOIN 
        HRMS_REGISTERED_USER fromEmp ON het.fromEmpId = fromEmp.employee_id
      JOIN 
        HRMS_REGISTERED_USER approvalEmp ON het.approvalEmpId = approvalEmp.employee_id
      WHERE 
        het.isDeleted = 0
        AND het.createdBy = ${createdBy};
    `;

    const [result] = await db.sequelize.query(query);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch employee transfers",
      details: error.message,
    });
  }
};

// exports.getAllEmployeeTransfers = async (req, res) => {
//   try {
//     const { createdBy } = req.params;
//     const query = `
//       SELECT
//         het.fromEntityId,
//         het.id,
//         em.id AS entity_id,
//         em.entity_name,
//         het.fromEmpId,
//         het.toRemark,
//         hru.employee_id,
//         het.IsStatus,
//         het.status,
//         CONCAT_WS(' ', hru.first_name, hru.middle_name, hru.last_name) AS full_name,
//         hru.employee_code
//       FROM
//         HRMS_EMPLOYEE_TRANSFER het
//       JOIN
//         ENTITY_MASTER em
//       ON
//         em.id = het.fromEntityId
//       JOIN
//         HRMS_REGISTERED_USER hru
//       ON
//         het.fromEmpId = hru.employee_id
//       WHERE
//         het.isDeleted = 0
//         AND het.createdBy = ${createdBy};
//     `;

//     const [result] = await db.sequelize.query(query);
//     res.status(200).json({ data: result });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to fetch employee transfers",
//       details: error.message,
//     });
//   }
// };

exports.getSingleUserdata = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
    SELECT  HRMS_EMPLOYEE_TRANSFER.*,
    HRMS_EMPLOYEE_TRANSFER.fromEmpId ,
    HRMS_REGISTERED_USER.employee_id,
    HRMS_REGISTERED_USER.primary_entity_id,
    HRMS_REGISTERED_USER.role_master_id FROM
    HRMS_EMPLOYEE_TRANSFER JOIN HRMS_REGISTERED_USER 
    ON HRMS_EMPLOYEE_TRANSFER.fromEmpId  = HRMS_REGISTERED_USER.employee_id 
    WHERE id= ?`;
    const [results] = await db.sequelize.query(query, {
      replacements: [id],
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: results });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.statusUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid ID provided" });
    }
    if (status === undefined || status === null) {
      return res.status(400).json({
        code: 400,
        message:
          "Bad Request: 'status' property is missing in the request body",
      });
    }
    console.log(`Updating Employee Transfer ID: ${id} to status: ${status}`);
    const getData = await db.employee_Transfer.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!getData) {
      return res.status(404).json({ code: 404, message: "Record Not Found" });
    }
    const [updatedRows] = await db.employee_Transfer.update(
      { status },
      { where: { id: id } }
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
    console.error("Error in CHECKLISTStatus:", error);

    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.deleteTherecordEmployeeTransfer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).send({ code: 400, message: "Invalid ID format" });
    }
    const checklistData = await db.employee_Transfer.findOne({
      where: { id, isDeleted: 0 },
    });
    if (!checklistData) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
    await db.employee_Transfer.update({ isDeleted: 1 }, { where: { id } });
    return res
      .status(200)
      .send({ code: 200, message: "Data deleted successfully!" });
  } catch (error) {
    console.error("Error deleting record:", error);
    return res.status(500).send({ code: 500, message: "Server Error", error });
  }
};

exports.updateTheEmployeeTranfer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      toRemark,
      fromEntityId,
      toEntityId,
      approvalEntityId,
      fromEmpId,
      approvalEmpId,
    } = req.body;
    const checklistdata = await db.employee_Transfer.findOne({
      where: { id: id },
    });
    if (!checklistdata) {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
    await db.employee_Transfer.update(
      {
        toRemark,
        fromEntityId,
        toEntityId,
        approvalEntityId,
        fromEmpId,
        approvalEmpId,
      },
      { where: { id: id } }
    );
    return res
      .status(200)
      .send({ code: 200, message: "Data is Updated Successfully!" });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getAfterLoginPendingApproval = async (req, res) => {
  try {
    const { approvalEmpId } = req.params;
    const query = `
      SELECT 
        het.fromEntityId, 
        het.approvalEmpId,
        het.id,
        em.id AS entity_id, 
        em.entity_name, 
        het.fromEmpId, 
        het.toRemark, 
        hru_approval.employee_id,
        het.IsStatus,
        het.status, 
        CONCAT_WS(' ', hru_approval.first_name, hru_approval.middle_name, hru_approval.last_name) AS approval_full_name, 
        hru_approval.employee_code AS approval_employee_code,
        CONCAT_WS(' ', hru_from.first_name, hru_from.middle_name, hru_from.last_name) AS from_employee_full_name,
        hru_from.employee_code AS from_employee_code
      FROM 
        HRMS_EMPLOYEE_TRANSFER het
      JOIN 
        ENTITY_MASTER em ON em.id = het.fromEntityId 
      JOIN 
        HRMS_REGISTERED_USER hru_approval ON het.approvalEmpId = hru_approval.employee_id
      JOIN 
        HRMS_REGISTERED_USER hru_from ON het.fromEmpId = hru_from.employee_id
      WHERE 
        het.isDeleted = 0
        AND het.approvalEmpId = ${approvalEmpId}
        AND het.IsStatus = 'PENDING';  
    `;

    const [result] = await db.sequelize.query(query);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch employee transfers",
      details: error.message,
    });
  }
};

// exports.getAfterLoginPendingApproval = async (req, res) => {
//   try {
//     const { approvalEmpId } = req.params;
//     const query = `
//       SELECT
//         het.fromEntityId,
//         het.approvalEmpId,
//         het.id,
//         em.id AS entity_id,
//         em.entity_name,
//         het.fromEmpId,
//         het.toRemark,
//         hru.employee_id,
//         het.IsStatus,
//         het.status,
//         CONCAT_WS(' ', hru.first_name, hru.middle_name, hru.last_name) AS full_name,
//         hru.employee_code
//       FROM
//         HRMS_EMPLOYEE_TRANSFER het
//       JOIN
//         ENTITY_MASTER em
//       ON
//         em.id = het.fromEntityId
//       JOIN
//         HRMS_REGISTERED_USER hru
//       ON
//         het.approvalEmpId = hru.employee_id
//       WHERE
//         het.isDeleted = 0
//         AND het.approvalEmpId = ${approvalEmpId}
//         AND het.IsStatus = 'PENDING';
//     `;

//     const [result] = await db.sequelize.query(query);
//     res.status(200).json({ data: result });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to fetch employee transfers",
//       details: error.message,
//     });
//   }
// };

exports.approvedTheEmployee = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      toRemark,
      fromEntityId,
      toEntityId,
      approvalEntityId,
      fromEmpId,
      approvalEmpId,
      ApprovalRemarks,
      role_master_id,
      primary_entity_id,
      employee_id,
    } = req.body;
    if (
      !toRemark ||
      !fromEntityId ||
      !toEntityId ||
      !approvalEntityId ||
      !fromEmpId ||
      !approvalEmpId ||
      !ApprovalRemarks ||
      !role_master_id ||
      !primary_entity_id ||
      !employee_id
    ) {
      return res.status(400).send({
        code: 400,
        message: "All fields are required",
        missingFields: {
          toRemark,
          fromEntityId,
          toEntityId,
          approvalEntityId,
          fromEmpId,
          approvalEmpId,
          ApprovalRemarks,
          role_master_id,
          primary_entity_id,
          employee_id,
        },
      });
    }
    const checklistdata = await db.employee_Transfer.findOne({
      where: { id: id },
    });
    if (!checklistdata) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
    const transaction = await db.sequelize.transaction();
    try {
      await db.employee_Transfer.update(
        {
          toRemark,
          fromEntityId,
          toEntityId,
          approvalEntityId,
          fromEmpId,
          approvalEmpId,
          ApprovalRemarks,
          IsStatus: "APPROVED",
        },
        { where: { id: id }, transaction }
      );
      await db.role_menu_access.destroy({
        where: {
          role_master_id: role_master_id,
          entity_id: primary_entity_id,
          employee_id: employee_id,
        },
        transaction,
      });
      await db.read_write_access.destroy({
        where: {
          role_master_id: role_master_id,
          entity_id: primary_entity_id,
          employee_id: employee_id,
        },
        transaction,
      });
      const userLogin = await db.user_login.findOne({
        where: { role_master_id, employee_id },
      });
      const user = await db.user.findOne({
        where: { role_master_id, employee_id },
      });
      if (!userLogin || !user) {
        console.error(
          `User or User Login record not found for role_master_id: ${role_master_id}, employee_id: ${employee_id}`
        );
        await transaction.rollback();
        return res.status(404).send({
          code: 404,
          message: `User or User Login record not found for role_master_id: ${role_master_id}, employee_id: ${employee_id}`,
        });
      }
      await db.user_login.update(
        { primary_entity_id: toEntityId },
        { where: { role_master_id, employee_id }, transaction }
      );
      await db.user.update(
        { primary_entity_id: toEntityId },
        { where: { role_master_id, employee_id }, transaction }
      );
      await transaction.commit();
      return res
        .status(200)
        .send({ code: 200, message: "Data is Updated Successfully!" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error during transaction:", error);
      return res.status(500).send({
        code: 500,
        message: "Failed to update the record",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Error in approvedTheEmployee:", error);
    return res.status(500).send({
      code: 500,
      message: "Server Error",
      details: error.message,
    });
  }
};

exports.employeeRejected = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      toRemark,
      fromEntityId,
      toEntityId,
      approvalEntityId,
      fromEmpId,
      approvalEmpId,
      ApprovalRemarks,
    } = req.body;
    if (
      !toRemark ||
      !fromEntityId ||
      !toEntityId ||
      !approvalEntityId ||
      !fromEmpId ||
      !approvalEmpId ||
      !ApprovalRemarks
    ) {
      return res
        .status(400)
        .send({ code: 400, message: "All fields are required" });
    }
    const checklistdata = await db.employee_Transfer.findOne({
      where: { id: id },
    });
    if (!checklistdata) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
    await db.employee_Transfer.update(
      {
        toRemark,
        fromEntityId,
        toEntityId,
        approvalEntityId,
        fromEmpId,
        approvalEmpId,
        ApprovalRemarks,
        IsStatus: "REJECTED",
      },
      { where: { id: id } }
    );
    return res
      .status(200)
      .send({ code: 200, message: "Data is Updated Successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: "Server Error", details: error.message });
  }
};

exports.getApprovedEmployee = async (req, res) => {
  try {
    const { approvalEmpId } = req.params;
    const query = `
      SELECT 
        het.fromEntityId, 
        em.id AS entity_id, 
        em.entity_name AS from_entity_name,

        het.toEntityId,
        em_to.entity_name AS to_entity_name,

        het.id,
        het.approvalEmpId, 
        het.fromEmpId,
        het.toRemark, 
        hru_approval.employee_id,
        het.IsStatus,
        het.status, 

        CONCAT_WS(' ', hru_approval.first_name, hru_approval.middle_name, hru_approval.last_name) AS approval_full_name, 
        hru_approval.employee_code AS approval_employee_code,

        CONCAT_WS(' ', hru_from.first_name, hru_from.middle_name, hru_from.last_name) AS from_employee_full_name,
        hru_from.employee_code AS from_employee_code

      FROM 
        HRMS_EMPLOYEE_TRANSFER het

      JOIN ENTITY_MASTER em 
        ON em.id = het.fromEntityId

      JOIN ENTITY_MASTER em_to 
        ON em_to.id = het.toEntityId

      JOIN HRMS_REGISTERED_USER hru_approval 
        ON het.approvalEmpId = hru_approval.employee_id

      JOIN HRMS_REGISTERED_USER hru_from 
        ON het.fromEmpId = hru_from.employee_id

      WHERE 
        het.isDeleted = 0
        AND het.approvalEmpId = ${approvalEmpId}
        AND het.IsStatus = 'APPROVED';  
    `;

    const [result] = await db.sequelize.query(query);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch employee transfers",
      details: error.message,
    });
  }
};

// exports.getApprovedEmployee = async (req, res) => {
//   try {
//     const { approvalEmpId } = req.params;
//     const query = `
//       SELECT
//         het.fromEntityId,
//         het.id,
//         em.id AS entity_id,
//         em.entity_name,
//         het.approvalEmpId,
//         het.toRemark,
//         hru.employee_id,
//         het.IsStatus,
//         het.status,
//         CONCAT_WS(' ', hru.first_name, hru.middle_name, hru.last_name) AS full_name,
//         hru.employee_code
//       FROM
//         HRMS_EMPLOYEE_TRANSFER het
//       JOIN
//         ENTITY_MASTER em
//       ON
//         em.id = het.fromEntityId
//       JOIN
//         HRMS_REGISTERED_USER hru
//       ON
//         het.approvalEmpId = hru.employee_id
//       WHERE
//         het.isDeleted = 0
//         AND het.approvalEmpId = ${approvalEmpId}
//         AND het.IsStatus = 'APPROVED';
//     `;

//     const [result] = await db.sequelize.query(query);
//     res.status(200).json({ data: result });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to fetch employee transfers",
//       details: error.message,
//     });
//   }
// };

// exports.getlistingrejectedEmployee = async (req, res) => {
//   try {
//     const { approvalEmpId } = req.params;
//     const query = `
//       SELECT
//         het.fromEntityId,
//         het.id,
//         em.id AS entity_id,
//         em.entity_name,
//         het.approvalEmpId,
//         het.toRemark,
//         hru.employee_id,
//         het.IsStatus,
//         het.status,
//         CONCAT_WS(' ', hru.first_name, hru.middle_name, hru.last_name) AS full_name,
//         hru.employee_code
//       FROM
//         HRMS_EMPLOYEE_TRANSFER het
//       JOIN
//         ENTITY_MASTER em
//       ON
//         em.id = het.fromEntityId
//       JOIN
//         HRMS_REGISTERED_USER hru
//       ON
//         het.approvalEmpId = hru.employee_id
//       WHERE
//         het.isDeleted = 0
//         AND het.approvalEmpId = ${approvalEmpId}
//         AND het.IsStatus = 'REJECTED';
//     `;

//     const [result] = await db.sequelize.query(query);
//     res.status(200).json({ data: result });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to fetch employee transfers",
//       details: error.message,
//     });
//   }
// };

exports.getlistingrejectedEmployee = async (req, res) => {
  try {
    const { approvalEmpId } = req.params;
    const query = `
      SELECT 
        het.fromEntityId, 
        het.id,
        em.id AS entity_id, 
        em.entity_name, 
        het.approvalEmpId, 
        het.fromEmpId,
        het.toRemark, 
        hru.employee_id,
        het.IsStatus,
        het.status, 
        CONCAT_WS(' ', hru.first_name, hru.middle_name, hru.last_name) AS approval_full_name, 
        hru.employee_code AS approval_employee_code,
        CONCAT_WS(' ', hru_from.first_name, hru_from.middle_name, hru_from.last_name) AS from_employee_full_name,
        hru_from.employee_code AS from_employee_code
      FROM 
        HRMS_EMPLOYEE_TRANSFER het
      JOIN 
        ENTITY_MASTER em ON em.id = het.fromEntityId 
      JOIN 
        HRMS_REGISTERED_USER hru ON het.approvalEmpId = hru.employee_id
      JOIN 
        HRMS_REGISTERED_USER hru_from ON het.fromEmpId = hru_from.employee_id
      WHERE 
        het.isDeleted = 0
        AND het.approvalEmpId = ${approvalEmpId}
        AND het.IsStatus = 'REJECTED';  
    `;

    const [result] = await db.sequelize.query(query);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch rejected employee transfers",
      details: error.message,
    });
  }
};
