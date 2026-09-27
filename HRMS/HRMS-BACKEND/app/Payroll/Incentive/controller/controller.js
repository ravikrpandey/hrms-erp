const db = require("../../../models/index");
const { Op } = require('sequelize');

exports.createOrUpdateIncentive = async (req, res) => {
  try {
    const {
      id,
      entity_id,
      financial_year_id,
      employee_id,
      incentive_type,
      plan_name,
      start_date,
      end_date,
      target_kpi,
      target_value,
      achieved_value,
      multiplier,
      payment_mode,
      frequency,
      payroll_financial_year_id,
      payroll_month,
      recurring_payroll_fy_id,
      payroll_start_month,
      payroll_end_month,
      is_taxable,
      remark
    } = req.body;

    let response;
    if (id) {
      const existingRecord = await db.payroll_incentive.findByPk(id);

      if (!existingRecord) {
        return res.status(404).send({
          status: false,
          message: "Record not found!",
        });
      }

      await existingRecord.update({
        id,
        entity_id,
        financial_year_id,
        employee_id,
        incentive_type,
        plan_name,
        start_date,
        end_date,
        target_kpi,
        target_value,
        achieved_value,
        multiplier,
        payment_mode,
        frequency,
        payroll_financial_year_id,
        payroll_month,
        recurring_payroll_fy_id,
        payroll_start_month,
        payroll_end_month,
        is_taxable,
        remark
      });

      response = existingRecord;

      return res.status(200).send({
        status: true,
        message: "Data updated successfully!",
        data: response,
      });
    }
    response = await db.payroll_incentive.create({
      entity_id,
      financial_year_id,
      employee_id,
      incentive_type,
      plan_name,
      start_date,
      end_date,
      target_kpi,
      target_value,
      achieved_value,
      multiplier,
      payment_mode,
      frequency,
      payroll_financial_year_id,
      payroll_month,
      recurring_payroll_fy_id,
      payroll_start_month,
      payroll_end_month,
      is_taxable,
      remark
    });

    return res.status(200).send({
      status: true,
      message: "Data added successfully!",
      data: response,
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.getAllIncentive = async (req, res) => {
  try {
    const { entity_id } = req.query;
    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity id is required!",
      });
    }
    let base_query = `
  SELECT 
      PI.*, 
      CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
      MD.department_name,MFY.financial_year
  FROM PAYROLL_INCENTIVE AS PI
  LEFT JOIN HRMS_REGISTERED_USER AS RU 
      ON RU.employee_id = PI.employee_id
  LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY 
      ON MFY.id = PI.financial_year_id
      
 LEFT JOIN MASTER_DEPARTMENT AS MD 
      ON RU.department_id = MD.dept_id

  WHERE PI.isDeleted = false 
    AND PI.entity_id = ?
`;
    const replacements = [entity_id];
    const response = await db.sequelize.query(base_query, {
      replacements: replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully!",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error!",
    });
  }
}

exports.getAllIncentiveById = async (req, res) => {
  try {
    const { id, entity_id } = req.query;

    // Validation
    if (!id || !entity_id) {
      return res.status(400).json({
        code: 400,
        message: "Both id and entity_id are required!",
      });
    }

    const base_query = `
      SELECT 
        PI.*, 
        CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
        MD.department_name,
        MD.dept_id,
        MFY.financial_year
      FROM PAYROLL_INCENTIVE AS PI
      LEFT JOIN HRMS_REGISTERED_USER AS RU 
        ON RU.employee_id = PI.employee_id
      LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY 
        ON MFY.id = PI.financial_year_id
      LEFT JOIN MASTER_DEPARTMENT AS MD 
        ON RU.department_id = MD.dept_id
      WHERE PI.isDeleted = false 
        AND PI.entity_id = :entity_id
        AND PI.id = :id
    `;

    const response = await db.sequelize.query(base_query, {
      replacements: { id, entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      code: 200,
      message: "Data fetched successfully!",
      data: response,
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal server error!",
    });
  }
}
exports.deleteIncentive = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await db.payroll_incentive.findOne({ where: { id: id } });

    if (!data) {
      return res.status(404).send({ code: 404, message: "Record not found!" });
    }

    await db.payroll_incentive.update({ isDeleted: true }, { where: { id: id } });
    return res.status(200).send({ code: 200, message: "Deleted successfully!" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Internal server error!" });
  }
}
