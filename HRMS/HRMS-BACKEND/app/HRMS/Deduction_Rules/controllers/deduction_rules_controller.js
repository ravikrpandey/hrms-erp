const db = require("../../../models/index");

exports.createDeductionRule = async (req, res) => {
  try {
    const { deduction_rule_name, deduction_type, shift_id, time,  days_rebate, deduction_action, remarks , completed_shift_hr, from_time, to_time, entity_id} = req.body;

    if (!deduction_rule_name || !deduction_type ||  !days_rebate || !deduction_action || !from_time) {
      return res.status(400).json({
        code: 400,
        message: "All required fields must be provided!",
      });
    }


    const saveRule = await db.deduction_rules.create({
      deduction_rule_name,
      deduction_type,
      days_rebate,
      deduction_action,
      remarks,
      shift_id,
      time,
      from_time, to_time,
      completed_shift_hr,
      entity_id,
    });

    return res.status(201).json({
      code: 201,
      message: "Deduction rule created successfully",
      data: saveRule,
    });

  } catch (error) {
    console.error("Error creating deduction rule:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllDeductionRules = async (req, res) => {
  try {
    const [rules] = await db.sequelize.query(`
      SELECT id, deduction_rule_name, deduction_type,  days_rebate, time, entity_id, from_time, to_time, shift_id, deduction_action, completed_shift_hr, remarks, status,  createdAt, updatedAt
      FROM DEDUCTION_RULES
      ORDER BY id DESC
    `);

    if (!rules || rules.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "No deduction rules found",
        data: [],
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Deduction rules fetched successfully",
      data: rules,
    });

  } catch (error) {
    console.error("Error fetching deduction rules:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.getDeductionRuleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        code: 400,
        message: "Rule ID is required!",
      });
    }

    const [rule] = await db.sequelize.query(
      `
      SELECT id, deduction_rule_name, deduction_type,  days_rebate, shift_id, time, from_time, to_time, completed_shift_hr, entity_id, deduction_action, status, remarks, createdAt, updatedAt
      FROM DEDUCTION_RULES
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!rule) {
      return res.status(404).json({
        code: 404,
        message: "Deduction rule not found",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Deduction rule fetched successfully",
      data: rule,
    });

  } catch (error) {
    console.error("Error fetching deduction rule by ID:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};




exports.updateDeductionRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { deduction_rule_name, deduction_type, time, days_rebate, deduction_action, remarks } = req.body;

    if (!id) return res.status(400).json({ code: 400, message: "Rule ID is required!" });

    const [exist] = await db.sequelize.query("SELECT id FROM DEDUCTION_RULES WHERE id = :id", {
      replacements: { id }, type: db.Sequelize.QueryTypes.SELECT,
    });
    if (!exist) return res.status(404).json({ code: 404, message: "Deduction rule not found" });

    await db.sequelize.query(
      `UPDATE DEDUCTION_RULES SET deduction_rule_name=:deduction_rule_name, deduction_type=:deduction_type, from_time=:from_time, entity_id=:entity_id, completed_shift_hr=:completed_shift_hr, to_time=:to_time, shift_id=:shift_id, time=:time, days_rebate=:days_rebate, deduction_action=:deduction_action, remarks=:remarks, updatedAt=NOW() WHERE id=:id`,
      { replacements: { id, deduction_rule_name, deduction_type, time, days_rebate, deduction_action, remarks } }
    );

    const [updated] = await db.sequelize.query("SELECT * FROM DEDUCTION_RULES WHERE id = :id", {
      replacements: { id }, type: db.Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({ code: 200, message: "Deduction rule updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating rule:", error);
    res.status(500).json({ code: 500, message: "Internal server error", error: error.message });
  }
};


exports.updateDeductionRuleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || status === undefined)
      return res.status(400).json({ code: 400, message: "Rule ID and status are required!" });

    const [exist] = await db.sequelize.query("SELECT id FROM DEDUCTION_RULES WHERE id = :id", {
      replacements: { id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    if (!exist)
      return res.status(404).json({ code: 404, message: "Deduction rule not found" });

    await db.sequelize.query(
      "UPDATE DEDUCTION_RULES SET status = :status, updatedAt = NOW() WHERE id = :id",
      { replacements: { id, status } }
    );

    res.status(200).json({ code: 200, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ code: 500, message: "Internal server error", error: error.message });
  }
};



exports.deleteDeductionRule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ code: 400, message: "Rule ID is required!" });

    const [exist] = await db.sequelize.query("SELECT id FROM DEDUCTION_RULES WHERE id = :id", {
      replacements: { id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    if (!exist)
      return res.status(404).json({ code: 404, message: "Deduction rule not found" });

    await db.sequelize.query("DELETE FROM DEDUCTION_RULES WHERE id = :id", {
      replacements: { id },
    });

    res.status(200).json({ code: 200, message: "Deduction rule deleted successfully" });
  } catch (error) {
    console.error("Error deleting deduction rule:", error);
    res.status(500).json({ code: 500, message: "Internal server error", error: error.message });
  }
};
