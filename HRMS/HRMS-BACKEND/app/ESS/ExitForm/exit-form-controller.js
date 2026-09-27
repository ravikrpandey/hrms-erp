const db = require("../../models/index");

exports.createExitInterview = async (req, res) => {
    try {
        const {
            primaryReason,
            decisionTrigger,
            preventReason,
            jobMatch,
            workEnvironment,
            challenges,
            managerRelation,
            managerSupport,
            teamCommunication,
            compensationSatisfaction,
            growthFeedback,
            recommendation,
            suggestions,
            entity_id,
            employee_id,
            resignation_id
        } = req.body;

        // 1️⃣ Get the last generated exit_form_code
        const [lastRecord] = await db.sequelize.query(
            `
            SELECT exit_form_code
            FROM ESS_EXIT_FORM
            ORDER BY id DESC
            LIMIT 1
            `,
            { type: db.Sequelize.QueryTypes.SELECT }
        );

        let newCode = "EXIT-0001";  // default for first record

        if (lastRecord && lastRecord.exit_form_code) {
            const lastNumber = parseInt(lastRecord.exit_form_code.split("-")[1], 10);
            const nextNumber = lastNumber + 1;
            newCode = `EXIT-${nextNumber.toString().padStart(4, "0")}`;
        }

        // 2️⃣ Create the exit interview with generated code
        const response = await db.exit_form.create({
            exit_form_code: newCode,
            primaryReason,
            decisionTrigger,
            preventReason,
            jobMatch,
            workEnvironment,
            challenges,
            managerRelation,
            managerSupport,
            teamCommunication,
            compensationSatisfaction,
            growthFeedback,
            recommendation,
            suggestions,
            entity_id,
            employee_id,
            resignation_id
        });

        return res.status(200).json({
            code: 200,
            message: "Data submitted successfully!",
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal server error!"
        });
    }
};

exports.getExitFormByEmpId = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const results = await db.sequelize.query(
            `
            SELECT 
                EF.exit_form_code,
                EF.id AS exit_form_id,
                EF.resignation_id,
                EF.approval_status,
                EF.approver_remarks,
                EF.approver_id,
                CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
                RU.employee_code
            FROM ESS_EXIT_FORM AS EF
            LEFT JOIN HRMS_REGISTERED_USER AS RU 
                ON EF.employee_id = RU.employee_id
            WHERE EF.employee_id = :employee_id
            `,
            {
                replacements: { employee_id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            code: 200,
            message: "Data fetched successfully!",
            data: results 
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal server error!"
        });
    }
};
exports.getExitFormById = async (req, res) => {
    try {
        const { exit_form_id } = req.params;

        const results = await db.sequelize.query(
            `
            SELECT *
            FROM ESS_EXIT_FORM
            WHERE id = :exit_form_id
            `,
            {
                replacements: { exit_form_id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            code: 200,
            message: "Data fetched successfully!",
            data: results 
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal server error!"
        });
    }
};


exports.getAllExitFormToBeApproved = async (req, res) => {
    try {
        const results = await db.sequelize.query(
            `
            SELECT 
                EF.exit_form_code,
                EF.id AS exit_form_id,
                EF.resignation_id,
                EF.approval_status,
                EF.approver_remarks,
                EF.approver_id,
                CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
                RU.employee_code
            FROM ESS_EXIT_FORM AS EF
            LEFT JOIN HRMS_REGISTERED_USER AS RU 
                ON EF.employee_id = RU.employee_id
            WHERE EF.approval_status = 'Pending' OR EF.approval_status = 'REJECTED'
            `,
            {
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            code: 200,
            message: "Data fetched successfully!",
            data: results 
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal server error!"
        });
    }
};

exports.approveRejExitFormStatus = async (req, res) => {
  try {
    const { approval_status, exit_form_id,approver_id, approver_remarks,rehire_eligibility } = req.body;
    const updated = await db.exit_form.update(
      {
        approval_status,
        approver_remarks,
        approver_id,
        rehire_eligibility
      },
      {
        where: { id: exit_form_id },
      }
    );

    if (updated[0] === 0) {
      return res.status(404).send({
        code: 404,
        message: "Exit form not found!",
      });
    }

    return res.status(200).send({
      code: 200,
      message: `Exit Form ${approval_status} successfully!`,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message||"Internal server error!",
    });
  }
};

exports.getExitFormDetailsById = async (req, res) => {
  try {
    const { exit_form_id } = req.params;

    const results = await db.sequelize.query(
      `
        SELECT 
        EF.approval_status, 
        EF.approver_remarks, 
        EF.approver_id, 
        EF.exit_form_code, 
        CONCAT(RU.first_name, ' ', RU.last_name) AS approver_name
        FROM ESS_EXIT_FORM EF
        LEFT JOIN HRMS_REGISTERED_USER RU 
        ON EF.approver_id = RU.employee_id
        WHERE EF.id = :exit_form_id
      `,
      {
        replacements: { exit_form_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const data = results.length ? results[0] : null;

    return res.status(200).json({
      code: 200,
      message: "Data fetched successfully!",
      data: data,
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal server error!",
    });
  }
};
