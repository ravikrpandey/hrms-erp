const { response } = require("express");
const Sequelize = require("sequelize");
const db = require("../../../models/index");
const { Op } = require('sequelize');


exports.getAccountListForCashBook = async (req, res) => {
  try {
    let data = await db.createChartOfAccounts.findAll({
  where: {
      status: "ACTIVE",
      isDeleted: 0,
      is_group: "no",
      parent_account: {
          [Op.in]: [14, 4, 5, 41] 
      }
  },
  attributes: [
      "id",
      "account_name",
      "parent_account"
  ],
});

    
    if (data) {
      return res.status(201).send({ code: 201, message: "Fetch data successfully", data: data });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to fetching data" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}


exports.getAllCashAccount = async (req, res) => {
  try {
    let entity_id = req.params?.entity_id;
      const [query] = await db.sequelize.query(
          `SELECT id, account_name, CONCAT(account_code, ' - ', account_name) AS account_names FROM CHART_OF_ACCOUNTS WHERE parent_account in (2,3,10,5) 
AND status = 'ACTIVE' AND isDeleted = 0 AND is_group = 'no' AND entity_id = ${entity_id};`);
      if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
                  data: query,
              });
      } else {
          
          return res.status(400).send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: "error.message" });
  }
};




exports.getInterestIncomeAccountList = async (req, res) => {
  try {
    let data = await db.createChartOfAccounts.findAll({
  where: {
      status: "ACTIVE",
      parent_account: 52,
      isDeleted: 0,
      is_group: "no"
      // parent_account: {
      //     [Op.in]: [14, 4, 5, 41] 
      // }
  },
  attributes: [
      "id",
      "account_name",
      "parent_account"
  ],
});

    
    if (data) {
      return res.status(201).send({ code: 201, message: "Fetch data successfully", data: data });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to fetching data" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}

exports.getOtherIncomeAccountList = async (req, res) => {
  try {
    let data = await db.createChartOfAccounts.findAll({
  where: {
      status: "ACTIVE",
      isDeleted: 0,
      is_group: "no",
      parent_account: {
          [Op.in]: [100,53,54] 
      }
  },
  attributes: [
      "id",
      "account_name",
      "parent_account"
  ],
});

    
    if (data) {
      return res.status(201).send({ code: 201, message: "Fetch data successfully", data: data });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to fetching data" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}

exports.getAllEquityAccountList = async (req, res) => {
  try {
    let data = await db.createChartOfAccounts.findAll({
  where: {
      status: "ACTIVE",
      parent_account: 41,
      isDeleted: 0,
      is_group: "no"
  },
  attributes: [
      "id",
      "account_name",
      "parent_account"
  ],
});

    
    if (data) {
      return res.status(201).send({ code: 201, message: "Fetch data successfully", data: data });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to fetching data" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}



exports.getMoneyOutToAccountList = async (req, res) => {
  try {
    let entity_id = req.params?.id;
    let data = await db.createChartOfAccounts.findAll({
  where: {
      status: "ACTIVE",
      entity_id: entity_id,
      isDeleted: 0,
      is_group: "no",
      parent_account: {
          [Op.in]: [5,41] 
      }
  },
  attributes: [
      "id",
      "account_name",
      "parent_account"
  ],
});

    
    if (data) {
      return res.status(201).send({ code: 201, message: "Fetch data successfully", data: data });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to fetching data" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}

exports.getExpenseAccountList = async (req, res) => {
  try {
    let entity_id = req.params?.id;
    let data = await db.createChartOfAccounts.findAll({
      where: {
        status: "ACTIVE",
        entity_id: entity_id,
        isDeleted: 0,
        is_group: "no",
        parent_account: {
          [Op.in]: [64]
        },
        id: {
          [Op.notIn]: [69, 75, 83]
        }
      },
      attributes: [
        "id",
        "account_name",
        "parent_account"
      ],
    });

    if (data) {
      return res.status(201).send({ code: 201, message: "Fetch data successfully", data: data });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to fetching data" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}


exports.getVendorList = async (req, res) => {
  try {
    let data = await db.vendor_basic_details.findAll({
  where: {
      status: "ACTIVE",
      isDeleted: 0
  },
  attributes: [
      "id",
      "vendor_name"
  ],
});

    
    if (data) {
      return res.status(201).send({ code: 201, message: "Fetch data successfully", data: data });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to fetching data" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}



exports.addCashBookMoneyIn = async (req, res) => { 
  try {
    const {
      to_account,
      from_account,
      date,
      form_type,
      amount,
      description,
      reference,
      financial_id,
      entity_id
    } = req.body;

    const payload = {
      to_account,
      from_account,
      date,
      form_type,
      amount,
      description,
      reference,
      entity_id
    };
    
      const createCashBook = await db.createCashBookMoneyIn.create(payload);

      if (createCashBook) {

        db.financial_And_Account_Journal_List.create({
          debit_amount:amount,
          chart_account_id: to_account,
          financial_id,
          entry_status: 'Cash Book',
          document_number: 'Cash Book',
          entity_id: entity_id
        })

        db.financial_And_Account_Journal_List.create({
          credit_amount:amount,
          chart_account_id: from_account,
          entry_status: 'Cash Book',
          document_number: 'Cash Book',
          financial_id,
          entity_id: entity_id
        })
        // posting_period_id = createData.id; // Get the new ID from the created record

        return res.status(200).send({
          code: 200,
          message: "Added Successfully"
        });
      } else {
        return res.status(400).send({
          code: 400,
          message: "Cash Book not added!!"
        });
      }

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};



exports.addCashBookMoneyOut = async (req, res) => { 
  try {
    const {
      to_account,
      from_account,
      date,
      form_type,
      amount,
      description,
      reference,
      entity_id,
      financial_id
    } = req.body;

    const payload = {
      to_account,
      from_account,
      date,
      form_type,
      amount,
      description,
      reference,
      entity_id,
      
    };
    
      const createCashBook = await db.createCashBookMoneyOut.create(payload);

      if (createCashBook) {

        db.financial_And_Account_Journal_List.create({
          debit_amount:amount,
          chart_account_id: to_account,
          entry_status: 'Cash Book',
          document_number: 'Cash Book',
          financial_id,
          entity_id: entity_id
        })

        db.financial_And_Account_Journal_List.create({
          credit_amount:amount,
          chart_account_id: from_account,
          entry_status: 'Cash Book',
          financial_id,
          document_number: 'Cash Book',
          entity_id: entity_id
        })
        // posting_period_id = createData.id; // Get the new ID from the created record

        return res.status(200).send({
          code: 200,
          message: "Added Successfully"
        });
      } else {
        return res.status(400).send({
          code: 400,
          message: "Cash Book not added!!"
        });
      }

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};


exports.getCashBookData = async (req, res) => {
  try {
    let entity_id = req.params?.id;
      const [query] = await db.sequelize.query(
          `SELECT amount AS debit_amount , '0.00' AS credit_amount, form_type,reference, createdAt AS date FROM CASH_BOOK_MONEY_IN 
WHERE entity_id = ${entity_id} AND status = 'ACTIVE' AND isDeleted = '0'
UNION
SELECT debit_amount , credit_amount , entry_status AS form_type , '' AS reference , createdAt AS date 
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST WHERE entity_id = ${entity_id} AND entry_status != 'Cash Book' AND chart_account_id = 6
AND status = 'ACTIVE' AND isDeleted = '0'
UNION
SELECT '0.00' AS debit_amount,amount AS credit_amount ,  form_type,reference, createdAt AS date FROM CASH_BOOK_MONEY_OUT
WHERE entity_id = ${entity_id} AND status = 'ACTIVE' AND isDeleted = '0'
ORDER BY date DESC`
      );
      if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
                  data: query,
              });
      } else {
          
          return res.status(400).send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: "error.message" });
  }
};






exports.getDepartmentById = async (req, res) => {
  try {
    const department_id = req.params.id;
    console.log('hhh>', department_id)
      const [query] = await db.sequelize.query(`SELECT department_name FROM MASTER_DEPARTMENT 
        WHERE dept_id = ${department_id} AND isDeleted = '0'`);
       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Department Successfully !",
                  data: query,
              });
      } else {
          return res
              .status(404)
              .send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.getCashBookDataById = async (req, res) => {
  try {
    const id = req.query?.id;
    let form_type = req.query?.form_type;
    

if (form_type == 'Transfer To Another Account' || form_type == 'Expense' || form_type == 'Owner Drawings'){
  const [query] = await db.sequelize.query(`SELECT CBMI.*, COA.account_name AS account_from, COAA.account_name AS account_to FROM CASH_BOOK_MONEY_OUT AS CBMI 
LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = CBMI.from_account
LEFT JOIN CHART_OF_ACCOUNTS AS COAA ON COAA.id = CBMI.to_account
WHERE CBMI.id = ${id}`);
}

else if(form_type == 'Transfer From Another Account' || form_type == 'Interest Income' || form_type == 'Other Income' || form_type == 'Owner Contribution'){
  const [query] = await db.sequelize.query(`SELECT CBMI.*, COA.account_name AS account_from, COAA.account_name AS account_to FROM CASH_BOOK_MONEY_IN AS CBMI 
LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = CBMI.from_account
LEFT JOIN CHART_OF_ACCOUNTS AS COAA ON COAA.id = CBMI.to_account
WHERE CBMI.id = ${id}`);
}
else {
  const [query] = await db.sequelize.query(`SELECT FAJL.debit_amount, FAJL.credit_amount, FAJL.entry_status, COA.account_name FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL 
LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = FAJL.chart_account_id
WHERE FAJL.id = ${id}`);
}
       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Department Successfully !",
                  data: query,
              });
      } else {
          return res
              .status(404)
              .send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
  }
};