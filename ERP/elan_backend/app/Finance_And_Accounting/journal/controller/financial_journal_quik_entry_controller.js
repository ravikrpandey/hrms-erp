const { where } = require("sequelize");
const db = require("../../../models/index");
// const model = require("../../../Currency_Convert/Model/model");
const { mode } = require("mathjs");
const {
  attribute,
} = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");

const addFinancialAccountQuikEntry = async (req, res) => {
  let id = parseInt(req.query.id);

  let {
    posting_Date,
    journal_no,
    transaction_date,
    notes,
    quik_debit_amount,
    quik_credit_amount,
    amount,
    currency_id,
    company_id,
    journal_book_status,
    journal_status,
  } = req.body;

  // Validation checks
  const requiredFields = [
    "posting_Date",
    "journal_no",
    "currency_id",
    "company_id",
  ];

  for (const field of requiredFields) {
    if (req.body[field] === undefined || req.body[field] === null) {
      return res.status(400).send({
        message: `JournalBook payload is incomplete: ${field} is missing`,
        data: [],
      });
    }
  }

  if (id) {
    await db.financial_And_Account_Journal.update(
      { isDeleted: true, status: "INACTIVE" },
      { where: { id } }
    );

    // await db.financial_And_Account_Journal.destroy({where:{id}})
  }

  let createQuickEntryBook = await db.financial_And_Account_Journal.create({
    posting_Date: posting_Date,
    journal_no: journal_no,
    transaction_date: transaction_date,
    notes: notes,
    journal_status,
    quik_debit_amount,
    quik_credit_amount,
    amount,
    journal_book_status,
    company_id: company_id,
    currency_id: currency_id,
  });

  if (createQuickEntryBook) {
    return res.json({
      code: 200,
      message: "Journal has been created successfully",
      data: createQuickEntryBook,
    });
  } else {
    return res.json({
      code: 500,
      message: "Server error",
    });
  }
};

module.exports={
      addFinancialAccountQuikEntry   
}
