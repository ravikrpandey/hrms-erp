const { where } = require('sequelize');
const db = require('../../../models/index');
const { attribute } = require('@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js');


exports.createKtAssignment = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const {
            category_name,
            created_by,
            employee,
            assigned_date,
            remarks,
            entity_id,
            from_emp
        } = req.body;

        const assignment = await db.ktassignment.create({
            category_id: category_name,
            created_by,
            created_date: assigned_date,
            remarks,
            entity_id,
            from_emp
        }, { transaction: t });

        const mappingRows = employee.map(empId => ({
            assignment_id: assignment.id,
            employee_id: empId,
        }));

        await db.ktassignmentemployee.bulkCreate(mappingRows, { transaction: t });

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "KT Assignment Created Successfully",
            data: assignment
        });

    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports.getAllKtAssignment = async (req, res) => {
    const { entity_id ,employee_id } = req.query;

    try {
        if (!entity_id && !employee_id) {
            return res.status(404).send({
                code: 404,
                message: "Entity Id & Employee Id not found!",
            });
        }

        const data = await db.sequelize.query(
            `
            SELECT 
                KA.id,
                KA.remarks,
                KA.created_date,
                KA.approval_status,
                KTM.category_name,

                -- Created By
                KA.created_by,
                CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,

                -- From Employee
                KA.from_emp,
                CONCAT(fromEmp.first_name, ' ', fromEmp.last_name) AS from_employee_name,

                -- Assigned Employees (grouped)
                GROUP_CONCAT(KAE.employee_id) AS assigned_employee_ids,
                GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name)) AS assigned_employee_names

            FROM KT_ASSIGNMENT AS KA
            INNER JOIN KT_ASSIGNMENT_EMPLOYEE AS KAE 
                ON KAE.assignment_id = KA.id

            INNER JOIN KNOWLEDGE_TRANSFER_MASTER AS KTM 
                ON KTM.id = KA.category_id

            INNER JOIN HRMS_REGISTERED_USER AS creator 
                ON creator.employee_id = KA.created_by

            INNER JOIN HRMS_REGISTERED_USER AS fromEmp 
                ON fromEmp.employee_id = KA.from_emp

            INNER JOIN HRMS_REGISTERED_USER AS emp 
                ON emp.employee_id = KAE.employee_id

            WHERE KA.isDeleted = false 
            AND KA.entity_id = :entity_id
            AND KA.created_by = :employee_id

            GROUP BY KA.id
            `,
            {
                replacements: { entity_id,employee_id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully!",
            data
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error!"
        });
    }
};


module.exports.getKtAssignmentById = async (req, res) => {
  
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(404).send({
                code: 404,
                message: "Entity Id not found!",
            });
        }

        const data = await db.sequelize.query(
            `
            SELECT 
                KA.id,
                KA.remarks,
                KA.created_date,
                KA.approval_status,
                KTM.category_name,

                -- Created By
                KA.created_by,
                CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,

                -- From Employee
                KA.from_emp,
                CONCAT(fromEmp.first_name, ' ', fromEmp.last_name) AS from_employee_name,

                -- Assigned Employees (grouped)
                GROUP_CONCAT(KAE.employee_id) AS assigned_employee_ids,
                GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name)) AS assigned_employee_names

            FROM KT_ASSIGNMENT AS KA
            INNER JOIN KT_ASSIGNMENT_EMPLOYEE AS KAE 
                ON KAE.assignment_id = KA.id

            INNER JOIN KNOWLEDGE_TRANSFER_MASTER AS KTM 
                ON KTM.id = KA.category_id

            INNER JOIN HRMS_REGISTERED_USER AS creator 
                ON creator.employee_id = KA.created_by

            INNER JOIN HRMS_REGISTERED_USER AS fromEmp 
                ON fromEmp.employee_id = KA.from_emp

            INNER JOIN HRMS_REGISTERED_USER AS emp 
                ON emp.employee_id = KAE.employee_id

            WHERE KA.isDeleted = false 
            AND KA.id = :id

            GROUP BY KA.id
            `,
            {
                replacements: { id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully!",
            data
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error!"
        });
    }
};

exports.updateKtAssignment = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { id } = req.params; 

        const {
            category_name,
            created_by,
            employee,
            assigned_date,
            remarks,
            entity_id,
            from_emp
        } = req.body;

        
        const assignment = await db.ktassignment.findByPk(id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "KT Assignment not found"
            });
        }

        await db.ktassignment.update(
            {
                category_id: category_name,
                created_by,
                created_date: assigned_date,
                remarks,
                entity_id,
                from_emp
            },
            { where: { id }, transaction: t }
        );

     
        await db.ktassignmentemployee.destroy(
            { where: { assignment_id: id }, transaction: t }
        );

       
        if (employee && employee.length > 0) {
            const mappingRows = employee.map(empId => ({
                assignment_id: id,
                employee_id: empId,
            }));

            await db.ktassignmentemployee.bulkCreate(mappingRows, { transaction: t });
        }

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "KT Assignment Updated Successfully"
        });

    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE KT Assignment + Related Employees
exports.deleteKtAssignment = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const id = req.params.id;

    const assignment = await db.ktassignment.findOne({ where: { id ,isDeleted : false} });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "KT Assignment not found"
      });
    }

    // Delete from child table first
    await db.ktassignmentemployee.destroy(
      { where: { assignment_id: id } },
      { transaction: t }
    );

    // Delete from main table
    await db.ktassignment.destroy(
      { where: { id } },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "KT Assignment Deleted Successfully from both tables"
    });

  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


module.exports.getMyKtRequests = async (req, res) => {
  const { entity_id, employee_id } = req.query;

  try {
    if (!entity_id || !employee_id) {
      return res.status(400).send({ code: 400, message: "Missing params" });
    }

    const sql = `
      SELECT 
        KA.id,
        KA.remarks,
        KA.created_date,
        KA.approval_status,
        KTM.category_name,

        KA.created_by,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,

        KA.from_emp,
        CONCAT(fromEmp.first_name, ' ', fromEmp.last_name) AS from_employee_name,

        GROUP_CONCAT(KAE.employee_id) AS assigned_employee_ids,
        GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name)) AS assigned_employee_names


      FROM KT_ASSIGNMENT KA
      INNER JOIN KT_ASSIGNMENT_EMPLOYEE KAE ON KAE.assignment_id = KA.id
      INNER JOIN KNOWLEDGE_TRANSFER_MASTER KTM ON KTM.id = KA.category_id
      INNER JOIN HRMS_REGISTERED_USER creator ON creator.employee_id = KA.created_by
      INNER JOIN HRMS_REGISTERED_USER fromEmp ON fromEmp.employee_id = KA.from_emp
      INNER JOIN HRMS_REGISTERED_USER emp ON emp.employee_id = KAE.employee_id

      WHERE 
          KA.isDeleted = false
          AND KA.entity_id = :entity_id
          AND KA.from_emp = :employee_id
         -- AND KA.approval_status = 'PENDING'   

      GROUP BY KA.id
    `;

    const data = await db.sequelize.query(sql, {
      replacements: { entity_id, employee_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).send({
      code: 200,
      message: "Pending My Requests",
      data
    });

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getPendingForApproval = async (req, res) => {
  const { entity_id, employee_id } = req.query;

  try {
    const sql = `
    SELECT 
        KA.id,
        KA.remarks,
        KA.created_date,
        KAE.emp_approval_status,
        KTM.category_name,

        KA.created_by,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,

        KA.from_emp,
        CONCAT(fromEmp.first_name, ' ', fromEmp.last_name) AS from_employee_name,

        GROUP_CONCAT(KAE.employee_id) AS assigned_employee_ids,
        GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name)) AS assigned_employee_names


      FROM KT_ASSIGNMENT KA
      INNER JOIN KT_ASSIGNMENT_EMPLOYEE KAE ON KAE.assignment_id = KA.id
      INNER JOIN KNOWLEDGE_TRANSFER_MASTER KTM ON KTM.id = KA.category_id
      INNER JOIN HRMS_REGISTERED_USER creator ON creator.employee_id = KA.created_by
      INNER JOIN HRMS_REGISTERED_USER fromEmp ON fromEmp.employee_id = KA.from_emp
      INNER JOIN HRMS_REGISTERED_USER emp ON emp.employee_id = KAE.employee_id

      WHERE 
          KA.isDeleted = false
          AND KA.entity_id = :entity_id
          AND KAE.employee_id = :employee_id
          AND KAE.emp_approval_status = 'PENDING'   

      GROUP BY KA.id
    `;

    const data = await db.sequelize.query(sql, {
      replacements: { entity_id, employee_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: 'Pending for Approval',
      data,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getApprovedRequests = async (req, res) => {
  const { entity_id, employee_id } = req.query;

  try {
    const sql = `
    SELECT 
        KA.id,
        KA.remarks,
        KA.created_date,
        KAE.emp_approval_status,
        KTM.category_name,

        KA.created_by,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,

        KA.from_emp,
        CONCAT(fromEmp.first_name, ' ', fromEmp.last_name) AS from_employee_name,

        GROUP_CONCAT(KAE.employee_id) AS assigned_employee_ids,
        GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name)) AS assigned_employee_names


      FROM KT_ASSIGNMENT KA
      INNER JOIN KT_ASSIGNMENT_EMPLOYEE KAE ON KAE.assignment_id = KA.id
      INNER JOIN KNOWLEDGE_TRANSFER_MASTER KTM ON KTM.id = KA.category_id
      INNER JOIN HRMS_REGISTERED_USER creator ON creator.employee_id = KA.created_by
      INNER JOIN HRMS_REGISTERED_USER fromEmp ON fromEmp.employee_id = KA.from_emp
      INNER JOIN HRMS_REGISTERED_USER emp ON emp.employee_id = KAE.employee_id

      WHERE 
          KA.isDeleted = false
          AND KA.entity_id = :entity_id
          AND KAE.employee_id = :employee_id
          AND KAE.emp_approval_status = 'COMPLETE'   

      GROUP BY KA.id
    `;

    const data = await db.sequelize.query(sql, {
      replacements: { entity_id, employee_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: 'Approved for Approval',
      data,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};


module.exports.getRejectedRequests = async (req, res) => {
  const { entity_id, employee_id } = req.query;

  try {
    const sql = `
    SELECT 
        KA.id,
        KA.remarks,
        KA.created_date,
        KAE.emp_approval_status,
        KTM.category_name,

        KA.created_by,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,

        KA.from_emp,
        CONCAT(fromEmp.first_name, ' ', fromEmp.last_name) AS from_employee_name,

        GROUP_CONCAT(KAE.employee_id) AS assigned_employee_ids,
        GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name)) AS assigned_employee_names


      FROM KT_ASSIGNMENT KA
      INNER JOIN KT_ASSIGNMENT_EMPLOYEE KAE ON KAE.assignment_id = KA.id
      INNER JOIN KNOWLEDGE_TRANSFER_MASTER KTM ON KTM.id = KA.category_id
      INNER JOIN HRMS_REGISTERED_USER creator ON creator.employee_id = KA.created_by
      INNER JOIN HRMS_REGISTERED_USER fromEmp ON fromEmp.employee_id = KA.from_emp
      INNER JOIN HRMS_REGISTERED_USER emp ON emp.employee_id = KAE.employee_id

      WHERE 
          KA.isDeleted = false
          AND KA.entity_id = :entity_id
          AND KAE.employee_id = :employee_id
          AND KAE.emp_approval_status = 'REJECTED'  

      GROUP BY KA.id
    `;

    const data = await db.sequelize.query(sql, {
      replacements: { entity_id, employee_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: 'Rejected for Approval',
      data,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};


// exports.updateKTApprovalStatus = async (req, res) => {
//   const t = await db.sequelize.transaction();
//   try {
//     const { assignment_id, approval_status, remarks, employee_id } = req.body;

//     if (!assignment_id || !approval_status) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const assignment = await db.ktassignmentemployee.findOne({
//       where: { 
//         assignment_id: assignment_id,
//         employee_id: employee_id   
//       }
//     });

//     if (!assignment) {
//       return res.status(404).json({ success: false, message: "KT Assignment not found or not authorized" });
//     }

//     await assignment.update({
//       emp_approval_status:approval_status,
//       remarks,
//     }, { transaction: t });

//     await t.commit();

//     return res.status(200).json({
//       success: true,
//       message: `KT assignment ${approval_status.toLowerCase()} successfully`,
//       data: assignment
//     });

//   } catch (error) {
//     console.error("Error updating KT status:", error);
//     await t.rollback();
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

exports.updateKTApprovalStatus = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { assignment_id, approval_status, approval_remark, employee_id } = req.body;

    console.log(req.body,"gfnsdk");
    if (!assignment_id || !approval_status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1️⃣ Update child assignment
    const assignment = await db.ktassignmentemployee.findOne({
      where: { assignment_id: assignment_id, employee_id }
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: "KT Assignment not found or not authorized" });
    }

    await assignment.update({
      emp_approval_status: approval_status,
      approval_remark
    }, { transaction: t });

    // 2️⃣ Get all children statuses of the same parent
    const parent_id = assignment.assignment_id;
    const childStatuses = await db.ktassignmentemployee.findAll({
      where: { assignment_id: parent_id },
      attributes: ['emp_approval_status'],
      transaction: t
    });

    const statuses = childStatuses.map(c => c.emp_approval_status);

    // 3️⃣ Determine parent status
    let parentStatus = 'PENDING'; // default
    if (statuses.includes('REJECTED')) {
      parentStatus = 'REJECTED';
    } else if (statuses.every(s => s === 'COMPLETE')) {
      parentStatus = 'COMPLETE';
    } // else parent stays PENDING

    // 4️⃣ Update parent
    await db.ktassignment.update(
      { approval_status: parentStatus },
      { where: { id: parent_id }, transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `KT assignment ${approval_status.toLowerCase()} successfully`,
      data: assignment
    });

  } catch (error) {
    console.error("Error updating KT status:", error);
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getCompletedAssignmentDetails = async (req, res) => {
  try {
    const { assignment_id, status } = req.params;

    if (!assignment_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required params: assignment_id" 
      });
    }

    const replacements = { assignment_id };
    let statusFilter = '';

    if (status) {
      statusFilter = ` AND KA.approval_status = :status `;
      replacements.status = status;
    }

    const sql = `
      SELECT 
          KA.id AS assignment_id,
          KA.remarks AS parent_remarks,
          KA.created_date,
          KA.approval_status AS parent_status,
          KTM.category_name,

          KA.created_by,
          CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,

          KA.from_emp,
          CONCAT(fromEmp.first_name, ' ', fromEmp.last_name) AS from_employee_name,

          KAE.employee_id AS assigned_employee_id,
          CONCAT(emp.first_name, ' ', emp.last_name) AS assigned_employee_name,
          KAE.emp_approval_status AS child_status,
          KAE.approval_remark AS child_remark

      FROM KT_ASSIGNMENT KA
      INNER JOIN KT_ASSIGNMENT_EMPLOYEE KAE ON KAE.assignment_id = KA.id
      INNER JOIN KNOWLEDGE_TRANSFER_MASTER KTM ON KTM.id = KA.category_id
      INNER JOIN HRMS_REGISTERED_USER creator ON creator.employee_id = KA.created_by
      INNER JOIN HRMS_REGISTERED_USER fromEmp ON fromEmp.employee_id = KA.from_emp
      INNER JOIN HRMS_REGISTERED_USER emp ON emp.employee_id = KAE.employee_id

      WHERE 
          KA.isDeleted = false
          AND KA.id = :assignment_id
          ${statusFilter}
      ORDER BY KAE.employee_id
    `;

    const data = await db.sequelize.query(sql, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      success: true,
      message: "Assignment details fetched successfully",
      data
    });

  } catch (error) {
    console.error("Error fetching assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


module.exports.getAllResignationEmp = async (req, res) => {
  const { entity_id } = req.query;

  try {
    const data = await db.sequelize.query(
      `
      SELECT 
        R.employee_id,
        CONCAT(U.first_name, ' ', U.last_name) AS full_name 
      FROM ESS_EMPLOYEE_RESIGNATION AS R
      INNER JOIN ESS_EXIT_FORM AS EF
          ON R.id = EF.resignation_id
      INNER JOIN HRMS_REGISTERED_USER AS U
          ON R.employee_id = U.employee_id
      WHERE R.status = 'APPROVED'
        AND EF.approval_status = 'APPROVED'
        AND R.entity_id = :entity_id
      `,
      {
        replacements: { entity_id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    return res.status(200).send({
      code: 200,
      message: "All data fetched successfully!",
      data
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};
