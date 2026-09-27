const db = require("../../../../app/models/index");


exports.create_credit_limit = async (req, res) => {
  try {
    const rows = req.body;
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "Please provide at least one Level of credit limit data"
      });
    }

    for (const row of rows) {
      if (!row.level_id) {
        return res.status(400).send({
          code: 400,
          message: "Level is required"
        });
      }
      if (!row.over_due_days) {
        return res.status(400).send({
          code: 400,
          message: "Over due days is required"
        });
      }
      if (row.credit_limit === undefined || row.credit_limit === null) {
        return res.status(400).send({
          code: 400,
          message: "Credit limit is required"
        });
      }
    }

    const response = await db.creditLimit.bulkCreate(rows, {
      returning: true,
    });

    return res.status(200).send({
      code: 200,
      message: "Credit Limit Records Created Successfully!",
      data: response,
    });

  } catch (error) {
    console.error("Error in create_credit_limit:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

exports.get_all_credit_limits = async (req, res) => {
  try {
    const response = await db.creditLimit.findAll({
      where: { isDeleted: false },
      order: [["id", "ASC"]]
    });

    return res.status(200).send({
      code: 200,
      message: "Credit Limits fetched successfully",
      data: response
    });
  } catch (error) {
    console.error("Error in get_all_credit_limits:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};


exports.update_all_credit_limits = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const rows = req.body;
    if (!rows || !Array.isArray(rows)) {
      await t.rollback();
      return res.status(400).send({
        code: 400,
        message: "Invalid payload"
      });
    }

    const levelIds = rows.map(row => row.level_id).filter(id => id);

    // Soft delete records not in the payload
    await db.creditLimit.update(
      { isDeleted: true },
      {
        where: {
          level_id: { [db.Sequelize.Op.notIn]: levelIds }
        },
        transaction: t
      }
    );

    const results = [];

    for (const row of rows) {
      const existing = await db.creditLimit.findOne({
        where: { level_id: row.level_id },
        transaction: t
      });

      if (existing) {
        await db.creditLimit.update(
          {
            over_due_days: row.over_due_days,
            credit_limit: row.credit_limit,
            status: row.status || "ACTIVE",
            isDeleted: false
          },
          { 
            where: { level_id: row.level_id },
            transaction: t
          }
        );

        const updated = await db.creditLimit.findOne({ 
          where: { level_id: row.level_id },
          transaction: t
        });
        results.push(updated);
      } else {
        const created = await db.creditLimit.create({
          level_id: row.level_id,
          over_due_days: row.over_due_days,
          credit_limit: row.credit_limit,
          status: row.status || "ACTIVE",
          isDeleted: false
        }, { transaction: t });
        results.push(created);
      }
    }

    await t.commit();

    return res.status(200).send({
      code: 200,
      message: "Credit Limits processed successfully",
      data: results
    });

  } catch (error) {
    await t.rollback();
    console.error("Error in update_all_credit_limits:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};

