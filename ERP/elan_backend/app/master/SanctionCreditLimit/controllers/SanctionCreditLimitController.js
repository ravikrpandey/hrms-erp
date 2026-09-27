const db = require("../../../../app/models/index");

exports.createSanction_CreditLimit = async (req, res) => {
  try {
    const rows = req.body;
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "Please provide at least one row of sanction credit limit data"
      });
    }

    for (const row of rows) {
      if (!row.customer_category_id) {
        return res.status(400).send({
          code: 400,
          message: "Customer Category ID is required"
        });
      }
      if (!row.amount) {
        return res.status(400).send({
          code: 400,
          message: "Amount is required"
        });
      }
      if (!row.credit_period) {
        return res.status(400).send({
          code: 400,
          message: "Credit Period is required"
        });
      }
    }

    const response = await db.sanctionCreditLimit.bulkCreate(rows, {
      returning: true,
    });

    return res.status(200).send({
      code: 200,
      message: "Sanction Credit Limit Records Created Successfully!",
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


exports.getAllSanction_CreditLimits = async (req, res) => {
  try {
    const response = await db.sanctionCreditLimit.findAll({
      where: { isDeleted: false },
      order: [["id", "ASC"]]
    });

    return res.status(200).send({
      code: 200,
      message: "Sanction Credit Limits fetched successfully",
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


exports.updateSanction_CreditLimit = async (req, res) => {
  try {
    const rows = req.body;

    if (!rows || !Array.isArray(rows)) {
      return res.status(400).send({
        code: 400,
        message: "Invalid payload"
      });
    }

    const results = [];

    for (const row of rows) {
      const existing = await db.sanctionCreditLimit.findOne({
        where: { customer_category_id: row.customer_category_id }
      });

      if (existing) {
        await db.sanctionCreditLimit.update(
          {
            amount: row.amount,
            credit_period: row.credit_period,
            status: row.status || "ACTIVE"
          },
          { where: { customer_category_id: row.customer_category_id } }
        );

        const updated = await db.sanctionCreditLimit.findOne({ where: { customer_category_id: row.customer_category_id } });
        results.push(updated);
//         const query = `
//         UPDATE SALES_SUPER_CREDIT_DEBIT_MST s
// JOIN customerprofile c 
//   ON s.customer_id = c.customer_id
// SET s.available_credit_limit = s.available_credit_limit + :amount
// WHERE c.customer_category_id = :customer_category_id;`
//         await db.sequelize.query(query, {
//           replacements: { amount: row.amount, customer_category_id: row.customer_category_id },
//           type: db.sequelize.QueryTypes.UPDATE
//         });
      } else {
        const created = await db.sanctionCreditLimit.create({
          customer_category_id: row.customer_category_id,
          amount: row.amount,
          credit_period: row.credit_period,
          status: row.status || "ACTIVE"
        });
        results.push(created);
      }
    }

    return res.status(200).send({
      code: 200,
      message: "Sanction Credit Limits Updated Successfully",
      data: results
    });

  } catch (error) {
    console.error("Error in update_all_credit_limits:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};
