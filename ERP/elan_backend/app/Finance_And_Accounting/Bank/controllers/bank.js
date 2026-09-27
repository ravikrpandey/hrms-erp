const { response } = require("express");
const Sequelize = require("sequelize");
const db = require("../../../models/index");




exports.getBankList = async (req, res) => {
  try {
     const {entity_id} = req.query;
      const [query] = await db.sequelize.query(`SELECT MB.*, CS.countryss_name AS country_name FROM MASTER_BANK AS MB

LEFT JOIN MASTER_COUNTRY AS CS ON CS.countryss_id = MB.country_id
WHERE MB.isDeleted = '0' AND MB.entity_id=${entity_id}`);


       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
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

exports.getBankAccount = async (req, res) => {
  try {
     const {entity_id} = req.query;
      const [query] = await db.sequelize.query(`
       SELECT  B.id AS id,B.account_name AS bank_name,B.chart_account_id,C.account_name
FROM MASTER_BANK_ACCOUNT AS B  
INNER JOIN CHART_OF_ACCOUNTS AS C ON C.id=B.chart_account_id
WHERE B.isDeleted = false AND B.entity_id=${entity_id}`);


       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
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



exports.getCashInBankCOA = async (req, res) => {
  try {

    let entity_id = req.params?.id;

      const [query] = await db.sequelize.query(`SELECT id, account_name FROM CHART_OF_ACCOUNTS WHERE parent_account = 5 
AND status = 'ACTIVE' AND isDeleted = '0' AND entity_id = ${entity_id}`);


       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
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






// exports.getJournalEntriesForBankClearance = async (req, res) => {
//   try {
//     let entity_id = req.params?.entity_id;
//     let account_id = req.params?.account_id;

//     // First query to get journal entries
//     const [journalEntries] = await db.sequelize.query(`
//       SELECT 
//           FAAJ.journal_no, FAAJ.posting_date, FAAJ.reference, FAAJ.reference_date, FAJL.journal_id, 
//           (CASE 
//               WHEN FAJL.credit_amount > 0 THEN FAJL.credit_amount 
//               ELSE FAJL.debit_amount 
//           END) AS amount,
//           (CASE 
//               WHEN FAJL.credit_amount > 0 THEN 'debit_amount' 
//               ELSE 'credit_amount' 
//           END) AS typeen,
//           FAJL.chart_account_id 
//       FROM 
//           FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL 
//           LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FAAJ ON FAAJ.id = FAJL.journal_id
//       WHERE 
//           FAAJ.entity_id = ${entity_id} AND FAJL.chart_account_id = ${account_id}
//     `);

//     if (journalEntries.length > 0) {
//       // Prepare an array to hold the results of the additional queries
//       const chartAccountPromises = journalEntries.map(async (entry) => {
//         const journalId = entry.journal_id;
//         const typeen = entry.typeen; // Either 'credit_amount' or 'debit_amount'

//         // Determine the condition for the additional query
//         const additionalQuery = `
//           SELECT 
//               GROUP_CONCAT(COA.account_name) AS chart_accounts
//           FROM 
//               FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAAJL
//               LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = FAAJL.chart_account_id
//           WHERE 
//               FAAJL.journal_id = ${journalId} AND FAAJL.${typeen} > 0;
//         `;

//         // Execute the additional query
//         const [chartAccounts] = await db.sequelize.query(additionalQuery);
//         return { ...entry, chart_accounts: chartAccounts[0]?.chart_accounts || null }; // Add the result to the entry
//       });

//       // Wait for all additional queries to complete
//       const enrichedEntries = await Promise.all(chartAccountPromises);

//       return res.status(200).send({
//         code: 200,
//         message: "Fetched Data Successfully!",
//         data: enrichedEntries,
//       });
//     } else {
//       return res.status(404).send({ code: 404, message: "Record Not Found", data: journalEntries });
//     }
//   } catch (error) {
//     return res.status(500).send({ code: 500, message: error.message });
//   }
// };


exports.updateClearanceDates = async (req, res) => {
  try {
 

    
    for (const item of req.body) {
      const { journal_id, bank_clearance_date } = item;

      // Update the bank_clearance_date where id matches journal_id
      await db.financial_And_Account_Journal.update(
        { bank_clearance_date: bank_clearance_date }, // Update value
        { where: { id: journal_id } } // Condition
      );
    }

    return res.status(200).send({ code: 200, message: "Updated Successfully!" });
  } catch (error) {
    console.error(error); 
    return res.status(500).send({ code: 500, message: error.message });
  }
};



exports.getJournalEntriesForBankClearance = async (req, res) => {
  try {
    let {entity_id,account_id} = req.params;
   
    let condition =''
  
    const { from_date, to_date } = req.body;
    
    if(from_date && to_date){
      const fromDate = new Date(from_date);
      fromDate.setHours(0, 0, 0, 0);
      const formattedFromDate = fromDate.toISOString().slice(0, 19).replace('T', ' ');
      const toDate = new Date(to_date);
      toDate.setHours(23, 59, 59, 999);
      const formattedToDate = toDate.toISOString().slice(0, 19).replace('T', ' ');
      condition += `AND FAAJ.createdAt BETWEEN '${formattedFromDate}' AND '${formattedToDate}'`
    }

    const [journalEntries] = await db.sequelize.query(`
     SELECT FAAJ.journal_no,FAAJ.posting_date,C2.account_name AS chart_accounts,  
FAAJ.reference,FAAJ.reference_date,FAJL.journal_id,
    (CASE
        WHEN FAJL2.credit_amount > 0 THEN CONCAT(FAJL2.credit_amount, ' cr.')
        WHEN FAJL2.debit_amount > 0 THEN CONCAT(FAJL2.debit_amount, ' dr.')
        ELSE '0'
    END) AS amount,

    (CASE
        WHEN FAJL2.credit_amount > 0 THEN 'cr.'
        WHEN FAJL2.debit_amount > 0 THEN 'dr.'
        ELSE ''
    END) AS typeen,


    FAJL.chart_account_id

FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL
INNER JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FAAJ ON FAAJ.id = FAJL.journal_id
INNER JOIN CHART_OF_ACCOUNTS AS C ON C.id = FAJL.chart_account_id
INNER JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL2 ON FAJL.journal_id = FAJL2.journal_id
    AND FAJL2.chart_account_id != ${account_id} 
INNER JOIN CHART_OF_ACCOUNTS AS C2 ON C2.id = FAJL2.chart_account_id
WHERE FAAJ.entity_id = ${entity_id} AND FAJL.chart_account_id = ${account_id}
AND FAAJ.bank_clearance_date IS NULL AND C.marks_cash_account ='Bank'
          ${condition}`); 

    if (journalEntries.length > 0) {
    

      const dataList = await db.bankClearence.findAll({where:{entity_id,reference_status:'UnReconcile',chart_account_id:account_id}})
      return res.status(200).send({
        code: 200,
        message: "Fetched Data Successfully!",
        data: journalEntries,
        bankClearenceData:dataList
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found", data: journalEntries });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};


exports.getAllJournalEntriesForBankClearance = async (req, res) => {

  try {
    let entity_id = req.params?.entity_id;
    let account_id = req.params?.account_id;

    // Parse from_date and to_date from the request body
    const { from_date, to_date } = req.body;

    // Set from_date to the start of the day
    const fromDate = new Date(from_date);
    fromDate.setHours(0, 0, 0, 0);
    const formattedFromDate = fromDate.toISOString().slice(0, 19).replace('T', ' ');

    // Set to_date to the end of the day
    const toDate = new Date(to_date);
    toDate.setHours(23, 59, 59, 999);
    const formattedToDate = toDate.toISOString().slice(0, 19).replace('T', ' ');

    const [journalEntries] = await db.sequelize.query(`
      SELECT 
          FAAJ.journal_no, FAAJ.posting_date, FAAJ.reference, FAAJ.reference_date, FAJL.journal_id, FAAJ.bank_clearance_date,
          (CASE 
              WHEN FAJL.credit_amount > 0 THEN FAJL.credit_amount 
              ELSE FAJL.debit_amount 
          END) AS amount,
          (CASE 
              WHEN FAJL.credit_amount > 0 THEN 'debit_amount' 
              ELSE 'credit_amount' 
          END) AS typeen,
          FAJL.chart_account_id 
      FROM 
          FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL 
          LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FAAJ ON FAAJ.id = FAJL.journal_id
      WHERE 
          FAAJ.entity_id = ${entity_id} 
          AND FAJL.chart_account_id = ${account_id} 
          AND FAAJ.journal_status = 'APPROVED' 
          AND FAAJ.createdAt BETWEEN '${formattedFromDate}' AND '${formattedToDate}'`); // Use formatted dates

    if (journalEntries.length > 0) {
      const chartAccountPromises = journalEntries.map(async (entry) => {
        const journalId = entry.journal_id;
        const typeen = entry.typeen;

        const additionalQuery = `
          SELECT 
              GROUP_CONCAT(COA.account_name) AS chart_accounts
          FROM 
              FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAAJL
              LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = FAAJL.chart_account_id
          WHERE 
              FAAJL.journal_id = ${journalId} AND FAAJL.${typeen} > 0;
        `;

        const [chartAccounts] = await db.sequelize.query(additionalQuery);
        const chart_accounts = chartAccounts[0]?.chart_accounts || null;

        // Modify the amount to include " Cr" or " Dr"
        const modifiedAmount = ` ${entry.amount} ${typeen === 'credit_amount' ? 'Dr' : 'Cr'}`;

        return { ...entry, chart_accounts, amount: modifiedAmount, clearance_date: null };
      });

      const enrichedEntries = await Promise.all(chartAccountPromises);

      return res.status(200).send({
        code: 200,
        message: "Fetched Data Successfully!",
        data: enrichedEntries,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found", data: journalEntries });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};



// exports.getClosingBalanceForBankReconciliation = async (req, res) => {
//   try {
    
//     let entity_id = req.params?.entity_id;
//     let account_id = req.params?.account_id;
    
//     const { from_date, to_date} = req.body;

//     // Set from_date to the start of the day
//     const fromDate = new Date(from_date);
//     fromDate.setHours(0, 0, 0, 0);
//     const formattedFromDate = fromDate.toISOString().slice(0, 19).replace('T', ' ');

//     // Set to_date to the end of the day
//     const toDate = new Date(to_date);
//     toDate.setHours(23, 59, 59, 999);
//     const formattedToDate = toDate.toISOString().slice(0, 19).replace('T', ' ');
//       const [query] = await db.sequelize.query(`SELECT (SUM(FAJL.debit_amount)-SUM(FAJL.credit_amount)) AS closing_balance  FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL
// LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FAJ ON FAJ.id = FAJL.journal_id
// WHERE FAJL.chart_account_id = ${account_id} AND FAJ.bank_clearance_date IS NOT NULL AND FAJ.entity_id = ${entity_id}
// AND FAJ.bank_clearance_date BETWEEN '${from_date}' AND '${to_date}'`);


//        if (query.length > 0) {
//           return res
//               .status(200)
//               .send({
//                   code: 200,
//                   message: "Fetched Data Successfully !",
//                   data: query,
//               });
//       } else {
//           return res
//               .status(404)
//               .send({ code: 404, message: "Record Not Found", data: query });
//       }
//   } catch (error) {
//       return res.status(500).send({ code: 500, message: error.message });
//   }
// };









// exports.getJournalEntriesForBankClearance = async (req, res) => {
//   try {
//     
//     let entity_id = req.params?.entity_id;
//     let account_id = req.params?.account_id;
     
//     const [journalEntries] = await db.sequelize.query(`
//       SELECT 
//           FAAJ.journal_no, FAAJ.posting_date, FAAJ.reference, FAAJ.reference_date, FAJL.journal_id, 
//           (CASE 
//               WHEN FAJL.credit_amount > 0 THEN FAJL.credit_amount 
//               ELSE FAJL.debit_amount 
//           END) AS amount,
//           (CASE 
//               WHEN FAJL.credit_amount > 0 THEN 'debit_amount' 
//               ELSE 'credit_amount' 
//           END) AS typeen,
//           FAJL.chart_account_id 
//       FROM 
//           FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL 
//           LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FAAJ ON FAAJ.id = FAJL.journal_id
//       WHERE 
//           FAAJ.entity_id = ${entity_id} AND FAJL.chart_account_id = ${account_id} AND FAAJ.bank_clearance_date IS NULL`);

//     if (journalEntries.length > 0) {
//       const chartAccountPromises = journalEntries.map(async (entry) => {
//         const journalId = entry.journal_id;
//         const typeen = entry.typeen;

//         const additionalQuery = `
//           SELECT 
//               GROUP_CONCAT(COA.account_name) AS chart_accounts
//           FROM 
//               FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAAJL
//               LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = FAAJL.chart_account_id
//           WHERE 
//               FAAJL.journal_id = ${journalId} AND FAAJL.${typeen} > 0;
//         `;

//         const [chartAccounts] = await db.sequelize.query(additionalQuery);
//         const chart_accounts = chartAccounts[0]?.chart_accounts || null;

//         // Modify the amount to include " Cr" or " Dr"
//         const modifiedAmount = `₹ ${entry.amount} ${typeen === 'credit_amount' ? 'Dr' : 'Cr'}`;

//         return { ...entry, chart_accounts, amount: modifiedAmount, clearance_date: null }; // Add clearance_date
//       });

//       const enrichedEntries = await Promise.all(chartAccountPromises);

//       return res.status(200).send({
//         code: 200,
//         message: "Fetched Data Successfully!",
//         data: enrichedEntries,
//       });
//     } else {
//       return res.status(404).send({ code: 404, message: "Record Not Found", data: journalEntries });
//     }
//   } catch (error) {
//     return res.status(500).send({ code: 500, message: error.message });
//   }
// };


exports.getClosingBalanceForBankReconciliation = async (req, res) => {
  try {
    let entity_id = req.params?.entity_id;
    let account_id = req.params?.account_id;
    
    const { from_date, to_date } = req.body;
    console.log(req.body)
    // Format dates to YYYY-MM-DD
    const formattedFromDate = new Date(from_date).toISOString().slice(0, 10);
    const formattedToDate = new Date(to_date).toISOString().slice(0, 10);

    const [query] = await db.sequelize.query(`
      SELECT (SUM(FAJL.debit_amount) - SUM(FAJL.credit_amount)) AS closing_balance 
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FAJ ON FAJ.id = FAJL.journal_id
      WHERE FAJL.chart_account_id = ${account_id} 
      AND FAJ.bank_clearance_date IS NOT NULL 
      AND FAJ.entity_id = ${entity_id}
      AND FAJ.bank_clearance_date >= '${from_date}' 
      AND FAJ.bank_clearance_date <= '${to_date}'
    `);

    if (query.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched Data Successfully!",
        data: query,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found", data: query });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};







exports.getJournalPaymentEnteries = async (req, res) => {
  try {

    let entity_id = req.params?.id;

      const [query] = await db.sequelize.query(`SELECT FAJL.*,  FAJ.reference, FAJ.reference_date, faj.journal
 FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL 
LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FAJ ON FAJ. id = FAJL.journal_id
where FAJL.chart_account_id = ${account_id} AND FAJ.entity_id = ${entity_id} OR createdAt::DATE <=  OR createdAt::DATE >= `);


       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
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


exports.getCountryList = async (req, res) => {
  try {

      const [query] = await db.sequelize.query(`SELECT * FROM MASTER_COUNTRY WHERE status = 'ACTIVE'`);


       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
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


exports.getBankDetailsById = async (req, res) => {
  try {


    let id = req.params?.id;
    
      const [query] = await db.sequelize.query(`SELECT MB.*, CS.countryss_name AS country_name FROM MASTER_BANK AS MB
INNER JOIN MASTER_COUNTRY AS CS ON CS.countryss_id = MB.country_id
WHERE MB.isDeleted = '0' AND MB.id = ${id}`);


       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
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


exports.getBankById = async (req, res) => {
  try {

    let id = req.params?.id;
      const [query] = await db.sequelize.query(`SELECT * FROM MASTER_BANK WHERE id = ${id}`);


       if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
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


exports.addBank = async (req, res) => { 
   
  try {
    const {
      bank_name,
      swift_number,
      branch,
      state,
      country_id,
      status,entity_id,
      ifsc_code,
    } = req.body;

    const payload = {
      bank_name,
      swift_number,
      branch,
      state,
      country_id,
      status,entity_id,
      ifsc_code
    };

    let id = req.params?.id;
   

    if (id != 'null' && id != '' && id != 'undefined' && id != null && id != undefined) {
    
         await db.createBank.update(
           payload,{where:{id}}
         )

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } else {

    const createData = await db.createBank.create(payload);
    if (createData) {
      return res
        .status(201)
        .send({ code: 201, message: "Bank Added Successfully" });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Bank not added" });
    }

    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};




exports.deleteBank = async (req, res) => {
  try {
    const {id} =req.params;
   
    await db.createBank.update({isDeleted:'1'},{where:{id}})

    return res
      .status(200)
      .send({ code: 200, message: "Deleted Successfully!" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};






exports.getTrialBalance = async (req, res) => {
  try {
    const { entity_id ,financial_id} = req.query;

    if (!entity_id) {
      return res.status(404).json({
        success: false,
        message: "Undefined entityID",
      });
    }

    // Query for total debit and credit
    const totalDebitQuery = `
      SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
      WHERE JL.entity_id = ${entity_id} AND JL.financial_id = ${financial_id}
    `;
    

    // Query for chart of accounts with journal data
    const chartOfAccountQuery = `
      SELECT 
          CA.id AS id,
          CA.account_name AS name,
          'accountType' AS type,
          JL.entity_id,
          CA.parent_account,
          COALESCE(SUM(CASE WHEN JL.entity_id =${entity_id}  THEN JL.debit_amount ELSE 0 END), 0) AS debit_amount,
              COALESCE(SUM(CASE WHEN JL.entity_id = ${entity_id}  THEN JL.credit_amount ELSE 0 END), 0) AS credit_amount
      FROM CHART_OF_ACCOUNTS AS CA 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL ON JL.chart_account_id = CA.id 
      WHERE CA.isDeleted = '0' AND CA.status = 'ACTIVE' AND  JL.entity_id=${entity_id}  OR JL.entity_id IS NULL
      GROUP BY JL.entity_id , CA.id 
    `;

    const [totalResults, chartOfAccountsRaw] = await Promise.all([
      db.sequelize.query(totalDebitQuery, {
        type: db.sequelize.QueryTypes.SELECT,
      }),
      db.sequelize.query(chartOfAccountQuery, {
        type: db.sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totals = totalResults[0];

    // Map with entity_id preserved
    const chartOfAccounts = chartOfAccountsRaw.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      parent_account: account.parent_account,
      entity_id: account.entity_id,
      debit_amount: parseFloat(account.debit_amount) || 0,
      credit_amount: parseFloat(account.credit_amount) || 0,
    }));

    // Recursive function to build hierarchy and calculate filtered amounts
    const findChildren = (account, allAccounts) => {
      const children = allAccounts.filter(acc => acc.parent_account === account.id);

      // Filter amount based on entity_id
      let debit = ((account.entity_id) == (entity_id)) ? account.debit_amount : 0;
      let credit = ((account.entity_id) == (entity_id)) ? account.credit_amount : 0;

      const childAccounts = children.map(child => {
        const childData = findChildren(child, allAccounts);
        debit += childData.debit;
        credit += childData.credit;

        return {
          ...child,
          children: childData.children,
          debit: childData.debit,
          credit: childData.credit,
        };
      });

      return {
        children: childAccounts,
        debit,
        credit,
      };
    };

    // Build the full response with parent-level accounts and children
    const response = {
      totals,
      accountTypes: chartOfAccounts
        .filter(account => account.parent_account === null)
        .map(parent => {
          const data = findChildren(parent, chartOfAccounts);
          return {
            ...parent,
            children: data.children,
            debit: data.debit,
            credit: data.credit,
          };
        }),
    };

    return res.json({
      code: 200,
      message: "Trial balance data retrieved successfully",
      data: response,
    });

  } catch (error) {
    return res.json({
      code: 500,
      message: error.message,
    });
  }
};


