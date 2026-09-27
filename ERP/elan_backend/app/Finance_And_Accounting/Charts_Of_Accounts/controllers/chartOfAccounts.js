const { response } = require("express");
const { Op } = require('sequelize');
const Sequelize = require("sequelize");
const db = require("../../../models/index");

exports.get_Master_Account_Type = async (req, res) => {
    try {
        const query = `select * from MASTER_ACCOUNT_TYPE where status = 'ACTIVE' and isDeleted = '0'`;

        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.checkBankAccountForJournal = async (req, res) => {
    try {
        const ids = req.body?.Account_details.map(account => account.chart_account_id);

        if (ids.length === 0) {
            return res.status(400).send({ code: 400, message: "No account IDs provided" });
        }
       
        const idsString = ids.join(',');

        const [query] = await db.sequelize.query(
            `SELECT id FROM CHART_OF_ACCOUNTS WHERE id IN (${idsString}) AND parent_account = 5`
        );

        
        if (query.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched Data Successfully!",
                data: query,
            });
        } else {
        
            return res.status(200).send({ code: 200, message: "No records found", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};



exports.getMonthList = async (req, res) => {
    try {
        const [query] = await db.sequelize.query(
            `SELECT * FROM MASTER_MONTH_LIST`
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
            return res.status(404).send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "error.message" });
    }
  };






  exports.getDefaultCurrencyId = async (req, res) => {
    try {
        const [query] = await db.sequelize.query(
            `SELECT Currency_Convert_id AS currency_id FROM MASTER_CURRENCY_CONVERT WHERE default_status = 'ACTIVE'`
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
            
            return res.status(404).send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "error.message" });
    }
  };


exports.get_Company_Name_List = async (req, res) => {
    try {
        const data = await db.sequelize.query(
            `SELECT id,code,company_name FROM MASTER_COMPANY WHERE isDeleted = '0' AND status = 'ACTIVE'`
        );
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.getRootTypeByChartId = async (req, res) => {
  try {
    let id = req.params.id;
    const [query] = await db.sequelize.query(
      `SELECT root_name, account_code 
       FROM CHART_OF_ACCOUNTS 
       WHERE id = ${id}`
    );
    
    if (query.length > 0) {
      const accountCode = query[0].account_code.toString();
      const firstDigit = accountCode.charAt(0);
    
      let newAccountCode;
      let isExist = true;
    
      while (isExist) {
        const randomPart = Math.floor(1000 + Math.random() * 9000);
    
        newAccountCode = `${firstDigit}${randomPart}`;
    
        const [existing] = await db.sequelize.query(`
          SELECT id
          FROM CHART_OF_ACCOUNTS
          WHERE account_code = '${newAccountCode}'
          LIMIT 1
        `);
    
        isExist = existing.length > 0;
      }
    
      query[0].account_code = newAccountCode;
    }
    
 
    
      if (query.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
                  data: query,
              });
      } else {
          return res.status(404).send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: "error.message" });
  }
};



exports.getCurrencyList = async (req, res) => {
  try {
      const [query] = await db.sequelize.query(
          `SELECT Currency_Convert_id AS id, Currency_Type AS currency FROM MASTER_CURRENCY_CONVERT`
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
          return res.status(404).send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: "error.message" });
  }
};








exports.get_Parent_Account_List = async (req, res) => {
    try {
        const query = `SELECT id, account_name FROM CHART_OF_ACCOUNTS WHERE status = 'ACTIVE' AND  isDeleted = '0' AND is_group = 'yes' `;


        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.get_Charts_Of_Account_By_Id = async (req, res) => {
    try {
        let id = req.params.id;
        const query = `select * from CHART_OF_ACCOUNTS where id = ${id}`;


        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        const [tdsListData] = await db.sequelize.query(
            `SELECT CT.*,ST.section,TL.threshold_limit,TL.rate,TL.nature_of_transaction
FROM CHART_OF_ACCOUNTS AS C 
INNER JOIN CHART_OF_ACCOUNT_TDS_LIST AS CT ON CT.chart_account_id = C.id
INNER JOIN SYS_TDS_MST AS ST ON ST.id = CT.tds_id
INNER JOIN TDS_LIST_MST AS TL ON TL.id = CT.nature_id
WHERE C.id = ${id}`
        )
        const Obj={
            ...data,
            tdsList:tdsListData
        }
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: Obj,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.get_Charts_Of_Account_Details_By_Id = async (req, res) => {
    try {
        let id = req.params.id;

        const [query] = await db.sequelize.query(`
    SELECT 
    MB.bank_name,

    PARENT_CA.account_name AS parent_account_name,

    COA.*,

    COALESCE(SUM(FACL.credit_amount), 0) AS credit_balance,

    COALESCE(SUM(FACL.debit_amount), 0) AS debit_balance,

    COALESCE(SUM(FACL.debit_amount), 0) - 
    COALESCE(SUM(FACL.credit_amount), 0) AS balance

FROM CHART_OF_ACCOUNTS AS COA 

LEFT JOIN CHART_OF_ACCOUNTS AS PARENT_CA 
    ON PARENT_CA.id = COA.parent_account

LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FACL 
    ON COA.id = FACL.chart_account_id

LEFT JOIN MASTER_BANK AS MB 
    ON MB.id = COA.bank_id

WHERE COA.id = ${id}

GROUP BY 
    COA.id,
    MB.bank_name,
    PARENT_CA.account_name;
         `);


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

exports.get_Trial_Balance_Report_List = async (req, res) => {
    try {
        let {entity_id,financial_id} = req.query;
        const [query] = await db.sequelize.query(`SELECT 
          COA.account_name, 
          SUM(FAJL.debit_amount) AS total_debit_amount, 
          SUM(FAJL.credit_amount) AS total_credit_amount,
          SUM(FAJL.debit_amount - FAJL.credit_amount) AS balance,
          MIN(FAJL.createdAt) AS posting_date 
        FROM 
        FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL
        LEFT JOIN 
          CHART_OF_ACCOUNTS AS COA ON COA.id = FAJL.chart_account_id 
        WHERE 
          FAJL.isDeleted = '0' 
          AND FAJL.status = 'ACTIVE' 
          AND FAJL.entity_id = ${entity_id} 
        GROUP BY 
          COA.account_name
        ORDER BY 
          COA.account_name`);

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

exports.get_Account_Group_By_Id = async (req, res) => {
    try {
        let id = req.params.id;
        const query = `select * from MASTER_ACCOUNT_GROUP where account_type_id = ${id} and status = 'ACTIVE' and isDeleted = '0'`;


        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.get_Chart_Of_Account_List = async (req, res) => {
    try {
        const entity_id = req.params?.id;

        const query = `
            SELECT CA.*, 
            CONCAT(CA.account_code, ' - ', CA.account_name) AS account_names,
                   MCC.Currency_Type AS currency, 
                   PARENT_CA.account_name AS parent_account_name  
            FROM CHART_OF_ACCOUNTS AS CA
            LEFT JOIN MASTER_CURRENCY_CONVERT AS MCC 
                ON MCC.Currency_Convert_id = CA.currency_id
            LEFT JOIN CHART_OF_ACCOUNTS AS PARENT_CA 
                ON PARENT_CA.id = CA.parent_account
            WHERE CA.isDeleted = '0' 
              AND CA.entity_id = :entity_id
            ORDER BY CA.id DESC
        `;

        const data = await db.sequelize.query(query, {
            replacements: { entity_id },
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (data.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched Data Successfully!",
                data: data,
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "Record Not Found",
            });
        }
    } catch (error) {
        console.error("Error fetching Chart of Accounts:", error);
        return res.status(500).send({
            code: 500,
            message: "Server Error",
        });
    }
};
exports.BankClearenceAccountList = async (req, res) => {
    try {
        const {entity_id} = req.query;
        const [dataList] = await db.sequelize.query(`
            SELECT M.*
FROM MASTER_BANK_ACCOUNT AS M 
LEFT JOIN CHART_OF_ACCOUNTS AS CA ON CA.id= M.chart_account_id
  WHERE M.isDeleted = '0' AND M.entity_id = ${entity_id}
              ORDER BY M.id DESC
        `)

      

        if (dataList.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched Data Successfully!",
                data: dataList,
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "Record Not Found",
            });
        }
    } catch (error) {
        console.error("Error fetching Chart of Accounts:", error);
        return res.status(500).send({
            code: 500,
            message: "Server Error",
        });
    }
};











exports.getProductList = async (req, res) => {
    try {
 
        const query = `SELECT * from SYS_PRODUCT_MASTER_MST WHERE isDeleted = 0 AND status = 'ACTIVE'`;


        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

// exports.delete_Chart_Of_Accounts = async (req, res) => {
//     try {
//         let id = req.params?.id;
//         let query = "";

//         query = `update CHART_OF_ACCOUNTS set isDeleted = '1' where id = ${id}`;

//         await db.sequelize.query(query, { type: db.sequelize.QueryTypes.UPDATE });

//         return res
//             .status(200)
//             .send({ code: 200, message: "Deleted Successfully!" });
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     }
// };


exports.delete_Chart_Of_Accounts = async (req, res) => {
  try {
    const {id} =req.params;
   
    await db.createChartOfAccounts.update({isDeleted:'1'},{where:{id}})

    return res
      .status(200)
      .send({ code: 200, message: "Deleted Successfully!" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.save_Chart_Of_Accounts = async (req, res) => {
    try {
        let id = req.params?.id;
        const {
            account_type_id,
            account_no,
            entity_id,
            currency_id,
            parent_account_id,
            report_type,
            balance_must_be,
            status_type,
            status,
            account_name,
            is_group,
            account_remarks,
            debit_balance,
            credit_balance, 
            balance,
            root_name,
            bank_id,
            marks_cash_account,
           
        } = req.body;
     
        const payload={
            account_type_id,
            account_code:account_no,
            entity_id,
            status,
            currency_id,marks_cash_account,
            report_type,
            balance_must_be,
            status_type,
            account_name,
            balance,
            remarks:account_remarks,
            root_name
        }
      
        let getChartOfAccounts;
        if (id != "null" && id != undefined && id != null && id != "") {
            getChartOfAccounts = await db.createChartOfAccounts.findAll({
                where: { status: "ACTIVE" , isDeleted: 0 ,id: {
                    [Op.ne]: id
                }}
            })
        }
       else{
            getChartOfAccounts = await db.createChartOfAccounts.findAll({
                where: { status: "ACTIVE" , isDeleted: 0 }
            })
        }
        
        let getSingleChartOfAccounts = await getChartOfAccounts.find(element => element.account_code === account_no);
        
        if(getSingleChartOfAccounts){
            return res.status(400).send({ code: 409, message: "Account Code Already Exist"});
        }
        if(is_group == 'yes'){
            payload.is_group=is_group
        }
        else{
          payload.is_group = 'no'
        }
        if (!parent_account_id == '') {
            payload.parent_account = parent_account_id;
            payload.root_type_status = 'N'
          }
          else{
            payload.root_type_status = 'R'
          }

          if (!bank_id == '') {
            payload.bank_id = bank_id;
          }

          if(debit_balance == ''){
            payload.debit_balance = 0
          }
          else{
            payload.debit_balance = debit_balance
          }

          if(credit_balance == ''){
            payload.credit_balance = 0
          }
          else{
            payload.credit_balance = credit_balance
          }
       

        if (id != "null" && id != undefined && id != null && id != "") {
           await db.createChartOfAccounts.update(payload,{where:{id}})
          
           

            return res
                .status(200)
                .send({ code: 200, message: "Updated Successfully!" });
        } else {
       
            const dataList = await db.createChartOfAccounts.create(
                payload
            )
            

            return res
                .status(201)
                .send({ code: 201, message: "Added Successfully!" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message});
    }
};

exports.get_Party_Type_List = async (req, res) => {
    const { partyType } = req.query;
    let data;

    try {
        if (partyType === "VENDOR") {
            
            [data] = await db.sequelize.query(`
                SELECT 
    V.id,
    CONCAT(V.vendor_name, ' (', V.vendor_code, ')') AS vendor_name,
    V.vendor_address,
    V.gst_in,
    V.rcm_charge,
    V.status,
    V.chart_of_account_id,
    C.status_type
FROM VENDOR_BASIC_DETAILS AS V
LEFT JOIN CHART_OF_ACCOUNTS AS C 
    ON C.id = V.chart_of_account_id
WHERE V.status = 'ACTIVE'
  AND V.isDeleted = 0`);
            data.partyType = "VENDOR";
        } else if (partyType === "EMPLOYEE") {
            data = await db.user.findAll({
    where: {
        status: "ACTIVE",
        isDeleted: 0
    },
    attributes: [
        "employee_id",
        "employee_code",
        "first_name",
        "last_name",
        "gender",
        "department_id",
        "employee_official_email",
    ],
    raw: true
});

data = data.map(employee => ({
    ...employee,
    employee_name: `${employee.first_name} ${employee.last_name} (${employee.employee_code})`,
    partyType: "EMPLOYEE"
}));
        }else if (partyType === "CUSTOMER") {
            [data] = await db.sequelize.query(`
                  SELECT 
    CPM.*,
    CONCAT(CPM.company_name, ' (', CPM.customer_code, ')') AS company_name,
    CSA.shipping_address,
    CSA.shipping_postal_address,
    CSA.shipping_state_id,
    CSA.shipping_city_id,
    CSA.shipping_country_id,
    MS.states_name,
    MC.countryss_name,
    MCTY.city_name
FROM CUSTOMER_PROFILE_MST CPM
LEFT JOIN (
    SELECT *
    FROM CUSTOMER_SHIPPING_ADDRESS_MST
    WHERE is_Deleted = '0'
    AND id IN (
        SELECT MAX(id)
        FROM CUSTOMER_SHIPPING_ADDRESS_MST
        WHERE is_Deleted = '0'
        GROUP BY customer_id
    )
) CSA ON CPM.id = CSA.customer_id
LEFT JOIN MASTER_STATE MS 
    ON CSA.shipping_state_id = MS.states_id
LEFT JOIN MASTER_COUNTRY MC 
    ON CSA.shipping_country_id = MC.countryss_id
LEFT JOIN MASTER_CITY MCTY 
    ON CSA.shipping_city_id = MCTY.city_id;
      
                `)
            data.partyType = "CUSTOMER";
        } else {
            return res
                .status(401)
                .send({ code: 401, message: "Please enter invalid party type" });
        }

        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};





exports.get_Party_Name_List = async (req, res) => {
    const { partyType,entity_id } = req.query;
    let data;
    try {
        if (partyType === "VENDOR") {
            
            data = await db.vendor_basic_details.findAll({
                where: { status: "ACTIVE" , isDeleted: 0 ,entity_id},

                attributes: [
                    ['id', 'id'],
                    ['vendor_name', 'party_name'],
                ],
            });
            data.partyType = "VENDOR";
        } else if (partyType === "EMPLOYEE") {
            data = await db.user.findAll({
                where: { status: "ACTIVE" , isDeleted: 0,primary_entity_id:entity_id },
                attributes: [
                    ['employee_id' , 'id'],
                
                    ['first_name' , 'party_name']
                ],
            });
            data.partyType = "EMPLOYEE";
        }


       else if (partyType === "CUSTOMER") {

            
            data = await db.customerProfile.findAll({
                where: { customer_status: "ACTIVE" , is_deleted: 0,entity_id },

                attributes: [
                    ['id', 'id'],
                    ['company_name', 'party_name']
                ],
            });
            data.partyType = "CUSTOMER";
        }
        
        else {
            return res
                .status(401)
                .send({ code: 401, message: "Invalid party type!!" });
        }

        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getTrialBalance22 = async (req, res) => {
    try {
        const { entity_id } = req.query;
    
        // Query for account types
        const accountTypeQuery = `
            SELECT 
                id AS id,
                account_name AS name,
                account_code,
                'accountType' AS type,
                parent_account
            FROM CHART_OF_ACCOUNTS 
            WHERE  isDeleted = '0' AND status = 'ACTIVE' AND entity_id = ${entity_id};
        `;
    
        const accountTypes = await db.sequelize.query(accountTypeQuery, {
            type: db.sequelize.QueryTypes.SELECT,
        });
    
        // Create a map to hold the accounts by id
        const accountMap = {};
        accountTypes.forEach(account => {
            account.children = []; // Initialize children array
            accountMap[account.id] = account; // Map account by id
        });
    
        // Build the hierarchy
        const rootAccounts = [];
        accountTypes.forEach(account => {
            if (account.parent_account === null) {
                rootAccounts.push(account); // Top-level accounts
            } else {
                const parent = accountMap[account.parent_account];
                if (parent) {
                    parent.children.push(account); // Push the account to its parent's children
                }
            }
        });
    
        // Construct the response
        const response = {
            accountTypes: rootAccounts,
        };
    
        // Send the response
        res.json(response);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
    
    
    
  };







// exports.getTrialBalance22 = async (req, res) => {
//   try {
//       const { entity_id } = req.query;

//       // Query for account types with their total debit and credit
//       const accountTypeQuery = `
//            SELECT 
//               id AS id,
//               account_name AS name,
//                 'accounType' as type
//             FROM CHART_OF_ACCOUNTS WHERE root_type_status='R'
//           AND isDeleted = 0
//           ;
//       `;

//       // Query for chart of accounts
//       const chartOfAccountsQuery = `
//           SELECT  
//               id,
//               account_name AS name, 
//               'chartOfAccountType' as type,
//               parent_account,
//               parent_account AS account_type_id
              
//           FROM CHART_OF_ACCOUNTS 
//           WHERE entity_id = ${entity_id} AND isDeleted = 0
//       `;

//       const [
//           accountTypes,
//           chartOfAccounts,
//       ] = await Promise.all([
//           db.sequelize.query(accountTypeQuery, {
//               type: db.sequelize.QueryTypes.SELECT,
//           }),
//           db.sequelize.query(chartOfAccountsQuery, {
//               type: db.sequelize.QueryTypes.SELECT,
//           }),
//       ]);

//       // Recursive function to find children accounts
//       const findChildren = (account, allAccounts) => {
//         const children = allAccounts.filter(acc => acc.parent_account === account.id);
//         return {
//             children: children.map(child => ({
//                 ...child,
//                 children: findChildren(child, allAccounts).children,
//             })),
//         };
//     };
    

//       const response = {
//         accountTypes: accountTypes.map((type) => ({
//             ...type,
//             children: chartOfAccounts
//                 .filter((account) => account.account_type_id === type.id && account.parent_account === null)
//                 .map((account) => {
//                     const accountData = findChildren(account, chartOfAccounts);
//                     return {
//                         ...account,
//                         children: accountData.children,
//                     };
//                 }),
//         })),
//     };
    


//       return res.json({
//           code: 200,
//           message: "Trial balance data retrieved successfully",
//           data: response,
//       });
//   } catch (error) {
//       return res.json({
//           code: 500,
//           message: error.message,
//       });
//   }
// };






exports.getTrialBalance2 = async (req, res) => {
  try {
    const  {account_type,account_group,company_id  }= req.query;

    // Query to get total debit and credit amounts
    const totalDebitQuery = `
      SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
      WHERE CA.company_id = ${company_id};
    `;

    // Query for account types with their total debit and credit
    const accountTypeQuery = `
      SELECT 
        MAT.id AS account_type_id,
        MAT.account_type_name AS name
       
      FROM MASTER_ACCOUNT_TYPE AS MAT
      LEFT JOIN CHART_OF_ACCOUNTS AS CA ON MAT.id = CA.account_type_id AND CA.isDeleted = 0
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS jl ON CA.id = jl.chart_account_id AND jl.isDeleted = 0 
      AND CA.company_id = ${company_id} 
      WHERE MAT.isDeleted = 0
      GROUP BY MAT.id, MAT.account_type_name;
    `;

    // Query for account groups based on account type ID
    const accountGroupQuery = `
      SELECT 
      MAG.id,
        MAG.account_type_id,
        MAG.account_group AS name
        
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS jl
      INNER JOIN CHART_OF_ACCOUNTS AS CA ON jl.chart_account_id = CA.id AND CA.company_id = ${company_id} AND CA.isDeleted = 0 AND jl.isDeleted = 0
      RIGHT JOIN MASTER_ACCOUNT_GROUP AS MAG ON CA.account_group = MAG.id 
      WHERE MAG.isDeleted = 0
      GROUP BY MAG.id, MAG.account_group, MAG.account_type_id
      ORDER BY MAG.account_group
    `;

    // Query for chart of accounts matching the company ID
    const chartOfAccountsQuery = `
     
      SELECT  
      *
      FROM
      chart_of_accounts where account_group=${account_group} AND account_type_id = ${account_type} AND company_id =${company_id}
    `;

    // Execute all queries in parallel
    const [totalResults, accountTypes, accountGroups, chartOfAccounts] = await Promise.all([
      db.sequelize.query(totalDebitQuery, { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query(accountTypeQuery, { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query(accountGroupQuery, { type: db.sequelize.QueryTypes.SELECT }),
      db.sequelize.query(chartOfAccountsQuery, { type: db.sequelize.QueryTypes.SELECT }),
    ]);

    const totals = totalResults[0]; 

    // Nesting the results
    const response = {
      totals,
      accountTypes: accountTypes.map(type => ({
        ...type,
        children: accountGroups.filter(group => group.account_type_id === type.account_type_id).map(group => ({
          ...group,
          children: chartOfAccounts.filter(account => 
            account.account_type_id === type.account_type_id && 
            account.account_group === group.id
            
          )
        }))
      }))
    };

   

    return res.json({
      code: 200,
      message: "Trial balance data retrieved successfully",
      data: response,
    });

  } catch (error) {
    return res.json({
      code: 500,
      message: "Server error",
    });
  }
};



// Example chartOfAccounts to work with












exports.getProfitAndLoss = async (req, res) => {
    
  let {entity_id} = req.query;
  try {
    
    const totalDebitQuery = `
    SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
    INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
    WHERE CA.entity_id =${entity_id}
`;
    // SQL query to fetch account data
    const chartOfAccountQuery = `
        SELECT 
            CA.id AS id,
            CA.account_name AS name,
            CA.parent_account,
            COALESCE(SUM(JL.debit_amount), 0) AS debit_amount,
            COALESCE(SUM(JL.credit_amount), 0) AS credit_amount
        FROM CHART_OF_ACCOUNTS AS CA 
        LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL ON JL.chart_account_id = CA.id
        WHERE CA.isDeleted = '0' AND CA.status = 'ACTIVE' AND CA.entity_id = ${entity_id}
        GROUP BY CA.id
    `;

    const [
      totalResults,
      accountData,
  ] = await Promise.all([
      db.sequelize.query(totalDebitQuery, {
        replacements: { companyId: entity_id },
        type: db.sequelize.QueryTypes.SELECT,
      }),

      db.sequelize.query(chartOfAccountQuery, {
        replacements: { companyId: entity_id },
        type: db.sequelize.QueryTypes.SELECT,
    }),
  ]);
    const totals = totalResults[0];
    // Group accounts into a hierarchy
    const accounts = accountData.map(({ id, name, parent_account, debit_amount, credit_amount }) => ({
        id,
        name,
        parent_account,
        debit_amount: parseFloat(debit_amount),
        credit_amount: parseFloat(credit_amount),
        account_type: String(id).startsWith('4') || String(id).startsWith('5') || String(id).startsWith('6') || String(id).startsWith('7') 
            ? 'EXPENSE' 
            : (String(id).startsWith('50') || String(id).startsWith('51')) 
            ? 'INCOME' 
            : 'OTHER'
    }));

    // Function to recursively find children accounts
    const findChildren = (account, allAccounts) => {
        const children = allAccounts.filter(acc => acc.parent_account === account.id);
        let amount = 0;

        if (account.account_type === 'INCOME') {
            amount = account.credit_amount - account.debit_amount;
        } else if (account.account_type === 'EXPENSE' || account.account_type === 'OTHER') {
            amount = account.debit_amount - account.credit_amount;
        }

        const childAccounts = children.map(child => {
            const childData = findChildren(child, allAccounts);
            amount += childData.amount; // Add child's amount to the parent's total
            return {
                ...child,
                children: childData.children,
                amount: childData.amount
            };
        });

        return {
            children: childAccounts,
            amount
        };
    };

    // Building the final response structure
    const response = {
      totals,
        accountTypes: accounts.filter(account => account.parent_account === null).map(parentAccount => {
            const accountData = findChildren(parentAccount, accounts);
            return {
                ...parentAccount,
                children: accountData.children,
                amount: accountData.amount
            };
        })
    };
    return res.json({
        code: 200,
        message: "Profit and loss data retrieved successfully",
        data: response
    });
} catch (error) {
    return res.json({
        code: 500,
        message: error.message,
    });
}
//   try {
//     const { entity_id } = req.query;
//     if (!entity_id) {
//         return res.status(404).json({
//             success: false,
//             message: "Undefined companyID",
//         });
//     }

//     // Query to get total debit and credit amounts
//     const totalDebitQuery = `
//         SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
//         FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
//         INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
//         WHERE CA.entity_id =${entity_id} AND CA.account_name in ('Income','Expenses');
          
//     `;

//     // Query for account types with their total debit and credit
//     const chartOfAccountQuery = `
//         SELECT 
//             CA.id AS id,
//             CA.account_name AS name,
//             'accountType' AS type,
//             CA.parent_account,
//             COALESCE(SUM(JL.debit_amount), 0) AS debit_amount,
//             COALESCE(SUM(JL.credit_amount), 0) AS credit_amount
//         FROM CHART_OF_ACCOUNTS AS CA 
//         LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL ON JL.chart_account_id = CA.id
//         WHERE CA.isDeleted = '0' AND CA.status = 'ACTIVE' AND CA.entity_id =${entity_id} 
//         AND CA.id IN ('Income','Expenses')          
//         GROUP BY CA.id
//     `;

//     const [
//         totalResults,
//         chartOfAccounts,
//     ] = await Promise.all([
//         db.sequelize.query(totalDebitQuery, {
//             replacements: { companyId: entity_id },
//             type: db.sequelize.QueryTypes.SELECT,
//         }),

//         db.sequelize.query(chartOfAccountQuery, {
//             replacements: { companyId: entity_id },
//             type: db.sequelize.QueryTypes.SELECT,
//         }),
//     ]);

//     const totals = totalResults[0];
    
//     // Function to recursively find children accounts and sum their values
//     const findChildren = (account, allAccounts) => {
//         const children = allAccounts.filter(
//             (acc) => acc.parent_account === account.id
//         );

//         let debit = account.debit_amount || 0; // Start with the parent's debit
//         let credit = account.credit_amount || 0; // Start with the parent's credit

//         const childAccounts = children.map((child) => {
//             const childData = findChildren(child, allAccounts); // Recursively find children

//             // Add child's debit and credit to the parent's total
//             debit += childData.debit;
//             credit += childData.credit;

//             return {
//                 ...child,
//                 children: childData.children,
//                 debit: childData.debit,
//                 credit: childData.credit,
//             };
//         });

//         return {
//             children: childAccounts,
//             debit,
//             credit,
//         };
//     };

//     // Building the final response structure
//     const response = {
//         totals,
//         accountTypes: chartOfAccounts.filter((account) => account.parent_account === null)
//             .map((parentAccount) => {
//                 const accountData = findChildren(parentAccount, chartOfAccounts);
//                 return {
//                     ...parentAccount,
//                     children: accountData.children,
//                     debit: accountData.debit,
//                     credit: accountData.credit,
//                 };
//             }),
//     };

//     console.log(JSON.stringify(response, null, 2));

//     return res.json({
//         code: 200,
//         message: "Trial balance data retrieved successfully",
//         data: response,
//     });
// } catch (error) {
//     return res.json({
//         code: 500,
//         message: error.message,
//     });
// }
};
exports.get_All_Bank_Acc_List = async (req, res) => {
    try {
        const query = `
        SELECT id, CONCAT(account_code, ' - ', account_name) AS account_names 
        FROM CHART_OF_ACCOUNTS WHERE parent_account = 5
AND status = 'ACTIVE' AND isDeleted = 0 AND is_group = 'no';`


        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.filterVendorLedgerReport = async (req,res)=>{
    try {
      
     
      let {from_date,to_date, chart_of_account, party_type, chart_account_id, report_type,}= req.body;
       
      let entity_id = req.params?.entity_id;
      let condition='';
      let condition1 ='';

     if (report_type == 'bank-ledger'){
        condition = `JL.entity_id = ${entity_id} `;
        condition1 =` INNER JOIN MASTER_BANK AS MB ON MB.id=COA.bank_id`
        if(chart_account_id){
            condition += `AND JL.chart_account_id = ${chart_account_id}`
        }
     }
     
     if (report_type == 'vendor-ledger' ){
        condition = `JL.entity_id = ${entity_id} AND (JL.party_type='Vendor' OR JL.party_type='VENDOR')`; 
    }
    if (report_type == 'customer-ledger' ){
        condition = `JL.entity_id = ${entity_id} AND (JL.party_type='Customer' OR JL.party_type='CUSTOMER') AND JL.chart_account_id = 168 `; 
        if(chart_account_id){
            condition += `AND JL.chart_account_id = ${chart_account_id}`
        }
    }


  


  if (from_date) {
    condition += ` AND JL.createdAt >= '${from_date}' `;
  }
  
  if (to_date) {
    const endDate = new Date(to_date);
    endDate.setUTCDate(endDate.getUTCDate() + 1); 
    const toDateStr = endDate.toISOString().split('.')[0] + 'Z';
    condition += ` AND JL.createdAt < '${toDateStr}' `;
  }



//   else{
//     condition += ` AND JL.chart_account_id = ${chart_of_account} `;
//   }

  
  
//   if(party_type == 'VENDOR' && party_type_id){
//     condition += ` AND JL.vendor_id = ${party_type_id}`
//   }

//   if(party_type == 'CUSTOMER' && party_type_id){
//     condition += ` AND JL.customer_id = ${party_type_id}`
//   }
  
  
  
      let sqlQuery = `
    SELECT 
       FJ.id,JL.document_number,FJ.posting_date,JL.createdAt AS date,COA.account_name,COA.account_code,
    COALESCE(JL.debit_amount, 0.00) AS debit_amount,COALESCE(JL.credit_amount, 0.00) AS credit_amount,
      JL.party_type, VM.vendor_name AS party_name,CP.company_name,
  
      CASE 
          WHEN JL.entry_status = 'Journal' THEN FJ.journal_no
          ELSE
          JL.document_number
          END AS journal_no,
      CONCAT_WS(' ', REJ.first_name,  REJ.middle_name, REJ.last_name) AS employee_name,  
      REJ.employee_code,  FJ.journal_book_status,FJ.status,JL.entry_status,CAA.account_name AS parent_account_name
     
  FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL
  LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id AND FJ.isDeleted = false AND FJ.status = 'ACTIVE'
  LEFT JOIN HRMS_REGISTERED_USER AS REJ ON JL.employee_id = REJ.employee_id
  LEFT JOIN VENDOR_BASIC_DETAILS AS VM ON JL.vendor_id = VM.id
  LEFT JOIN CHART_OF_ACCOUNTS AS COA ON JL.chart_account_id = COA.id
 INNER JOIN CHART_OF_ACCOUNTS AS CAA ON CAA.id = COA.parent_account
    LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id=JL.customer_id
      ${condition1}
  WHERE 
      ${condition} 
     ORDER BY JL.createdAt DESC
    `;
  
    const journalData = await db.sequelize.query(sqlQuery, {
    
      type: db.sequelize.QueryTypes.SELECT
  });
  
  
  
  const totalDebitQuery = `
        SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
        FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
        LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id
        WHERE 
          ${condition}
      `;
  
      const totalResults = await db.sequelize.query(totalDebitQuery, {
        type: db.sequelize.QueryTypes.SELECT
      });
  
      const totals = totalResults[0]; 
  
    if(!journalData){
      return res.status(400).json({
        success:false,
        message:'Journal details does not found',
        })
    }
    return res.status(200).json(
      {
        success:true,
        message:'Journal details',
        data:journalData,
        totalSum:totals
      }
    )
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }



  module.exports.getCostCenterLedger = async (req, res) => {
    try {
        let { from_date, to_date, cost_center_id,branch_id,warehouse_id,vendor_id,customer_id } = req.body;
        let entity_id = req.params?.entity_id;
        let condition = '';
        if (!cost_center_id) {
          return res.status(404).send({code:404,message:'Please select the cost center'})
        }
        if (vendor_id) {
          condition += ` AND FAJL.vendor_id = ${vendor_id}`;
        }
        if (warehouse_id) {
          condition += ` AND P.warehouse_id = ${warehouse_id}`;
        }
        if (branch_id) {
          condition += ` AND P.billing_address_id = ${branch_id}`;
        } 
        if (customer_id) {
          condition += ` AND FAJL.customer_id = ${customer_id}`;
        }
        
        if (from_date && to_date) {
                   condition +=`DATE(FAJL.createdAt) BETWEEN '${from_date}' AND '${to_date}'`
        }
    
        const query = `
        WITH LedgerData AS (
    SELECT FAJL.id,FAJL.createdAt AS posting_date,FAJL.document_number,CONCAT(COA.account_code, ' - ', COA.account_name) AS account_name,
    COALESCE(FAJL.debit_amount,0) AS debit_amount,COALESCE(FAJL.credit_amount,0) AS credit_amount,V.vendor_name,W.name AS warehouse_name,
MFY.financial_year,FCC.cost_center_code,FCC.cost_center_name,FCC.amount AS budget_amount,FAJL.entry_status,FAJL.cost_center_id,
(COALESCE(FAJL.debit_amount,0) - COALESCE(FAJL.credit_amount,0)) AS transaction_amount,B.branch_name,C.company_name AS customer_name
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FAJL
LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL FJ ON FJ.id = FAJL.journal_id
INNER JOIN CHART_OF_ACCOUNTS COA ON COA.id = FAJL.chart_account_id
INNER JOIN FINANCE_COST_CENTER FCC ON FCC.id = FAJL.cost_center_id
LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = FAJL.vendor_id
LEFT JOIN GRN_MASTER AS G ON G.invoiceNo = FAJL.document_number
LEFT JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = G.po_id
LEFT JOIN WAREHOUSE_MASTER AS W ON W.id= P.warehouse_id
LEFT JOIN MASTER_BRANCH AS B ON W.id= P.billing_address_id
LEFT JOIN CUSTOMER_PROFILE_MST AS C ON C.id= FAJL.customer_id
LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = FAJL.financial_id
WHERE FAJL.entity_id = ${entity_id} AND FAJL.cost_center_id = ${cost_center_id} AND FCC.isDeleted = 0 ${condition}
)
SELECT posting_date AS date, document_number,account_name,debit_amount,credit_amount,financial_year,
    cost_center_code,cost_center_name,budget_amount,transaction_amount AS utilizedBudget,
    budget_amount -SUM(transaction_amount) OVER ( PARTITION BY cost_center_id ORDER BY posting_date,id) AS remainingBudget,
    SUM(transaction_amount) OVER ( PARTITION BY cost_center_id ORDER BY posting_date,id) AS runningBalance,
    entry_status,cost_center_id,vendor_name,warehouse_name,branch_name,customer_name
FROM LedgerData
ORDER BY posting_date,id
        `;
    
        const data = await db.sequelize.query(query, {
          type: db.sequelize.QueryTypes.SELECT,
        });
    
        if (data.length > 0) {
          return res.status(200).send({
            code: 200,
            message: "Fetched Data Successfully!",
            data: data,
          });
        } else {
          return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
      } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
      }
  };

// module.exports.getCostCenterLedger = async (req, res) => {
//   try {
//     const {
//       from_date,
//       to_date,
//       cost_center_id,
//       branch_id,
//       warehouse_id,
//       vendor_id
//     } = req.body;

//     if (!cost_center_id) {
//       return res.status(400).send({
//         code: 400,
//         message: "cost_center_id is required."
//       });
//     }

//     const isWarehouseFilter = !!warehouse_id;

//     let poConditions = [
//       "P.final_status='APPROVED'",
//       `P.cost_center_id = ${cost_center_id}`
//     ];

//     if (branch_id) {
//       poConditions.push(`P.billing_address_id = ${branch_id}`);
//     }

//     if (warehouse_id) {
//       poConditions.push(`P.warehouse_id = ${warehouse_id}`);
//     }

//     if (vendor_id) {
//       poConditions.push(`P.vendor_id = ${vendor_id}`);
//     }

//     if (from_date && to_date) {
//       poConditions.push(
//         `DATE(P.createdAt) BETWEEN '${from_date}' AND '${to_date}'`
//       );
//     }

//     const poWhere = `WHERE ${poConditions.join(" AND ")}`;

//     let journalQuery = "";

//     if (!isWarehouseFilter) {
//       let journalConditions = [
//         `FL.cost_center_id = ${cost_center_id}`
//       ];

//       if (branch_id) {
//         journalConditions.push(`FL.branch_id = ${branch_id}`);
//       }

//       if (vendor_id) {
//         journalConditions.push(`FL.vendor_id = ${vendor_id}`);
//       }

//       if (from_date && to_date) {
//         journalConditions.push(
//           `DATE(FL.createdAt) BETWEEN '${from_date}' AND '${to_date}'`
//         );
//       }

//       const journalWhere = `WHERE ${journalConditions.join(" AND ")}`;

//       journalQuery = `
//         UNION ALL

//         SELECT
//           DATE_FORMAT(FL.createdAt,'%Y-%m-%d') AS date,
//           F.amount AS budget_amount,
//           F.cost_center_name,
//           F.cost_center_code,
//           FL.entry_status,
//           M.branch_name,
//           V.vendor_name,
//           '-' AS warehouse_name,
//           COALESCE(FL.debit_amount,0) AS debit_amount,
//           COALESCE(FL.credit_amount,0) AS credit_amount,
//           FL.document_number,
//           COA.account_name,
//           FL.cost_center_id,
//           FL.vendor_id,
//           NULL AS warehouse_id,
//           FL.branch_id
//         FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FL
//         INNER JOIN FINANCE_COST_CENTER F
//           ON F.id = FL.cost_center_id
//         INNER JOIN CHART_OF_ACCOUNTS COA
//           ON COA.id = FL.chart_account_id
//         LEFT JOIN MASTER_BRANCH M
//           ON M.id = FL.branch_id
//         LEFT JOIN VENDOR_BASIC_DETAILS V
//           ON V.id = FL.vendor_id
//         ${journalWhere}
//       `;
//     }

//     const query = `
//       SELECT *
//       FROM (
//         SELECT
//           DATE_FORMAT(P.createdAt,'%Y-%m-%d') AS date,
//           F.amount AS budget_amount,
//           F.cost_center_name,
//           F.cost_center_code,
//           'PO' AS entry_status,
//           M.branch_name,
//           V.vendor_name,
//           W.name AS warehouse_name,
//           COALESCE(P.total_purchase,0) AS debit_amount,
//           0 AS credit_amount,
//           '-' AS document_number,
//           '-' AS account_name,
//           P.cost_center_id,
//           P.vendor_id,
//           P.warehouse_id,
//           P.billing_address_id AS branch_id
//         FROM PROCUREMENT_PURCHASE_ORDER P
//         INNER JOIN FINANCE_COST_CENTER F
//           ON F.id = P.cost_center_id
//         INNER JOIN VENDOR_BASIC_DETAILS V
//           ON V.id = P.vendor_id
//         INNER JOIN WAREHOUSE_MASTER W
//           ON W.id = P.warehouse_id
//         INNER JOIN MASTER_BRANCH M
//           ON M.id = P.billing_address_id
//         ${poWhere}

//         ${journalQuery}
//       ) X
//       ORDER BY X.cost_center_id, X.date ASC
//     `;

//     const [dataList] = await db.sequelize.query(query);

//     const ledgerMap = {};
//     const finalData = [];

//     for (const row of dataList) {
//       const ccId = row.cost_center_id;
//       const budget = Number(row.budget_amount || 0);
//       const debit = Number(row.debit_amount || 0);
//       const credit = Number(row.credit_amount || 0);

//       if (!ledgerMap[ccId]) {
//         ledgerMap[ccId] = {
//           budgetAmount: budget,
//           utilized: 0
//         };
//       }

//       ledgerMap[ccId].utilized += debit;
//       ledgerMap[ccId].utilized -= credit;

//       const utilizedBudget = ledgerMap[ccId].utilized;
//       const remainingBudget =
//         ledgerMap[ccId].budgetAmount - utilizedBudget;

//       finalData.push({
//         ...row,
//         amount: ledgerMap[ccId].budgetAmount,
//         utilizedBudget: Number(utilizedBudget.toFixed(2)),
//         remainingAmount: Number(remainingBudget.toFixed(2))
//       });
//     }

//     return res.status(200).send({
//       code: 200,
//       message: "Cost Center Ledger fetched successfully!",
//       data: finalData
//     });

//   } catch (error) {
//     return res.status(500).send({
//       code: 500,
//       message: error.message
//     });
//   }
// };

module.exports.getProfitCenterLedger = async (req, res) => {
    try {
        let { from_date, to_date, cost_center_id, department_id } = req.body;
        let entity_id = req.params?.entity_id;
        let condition = '';

        if (department_id && department_id.length > 0) {
            condition += ` AND FCC.department_id IN (${department_id.join(",")}) `;
        }

        if (cost_center_id) {
            condition += ` AND FAJL.profit_center_id = ${cost_center_id} `;
        }

        if (from_date) {
            condition += ` AND (
                (FAJL.journal_id IS NOT NULL AND FAJL.entry_status NOT IN ('Sales Invoice', 'Sales Invoice Payment', 'Purchase Invoice Payment') AND FJ.posting_date >= '${from_date}')
                OR (FAJL.entry_status IN ('Sales Invoice', 'Sales Invoice Payment', 'Purchase Invoice Payment'))
                OR (FAJL.journal_id IS NULL AND FAJL.entry_status NOT IN ('Sales Invoice', 'Sales Invoice Payment', 'Purchase Invoice Payment') AND FAJL.createdAt >= '${from_date}')
            )`;
        }

        if (to_date) {
            const endDate = new Date(to_date);
            endDate.setUTCDate(endDate.getUTCDate() + 1);
            const toDateStr = endDate.toISOString().split('.')[0] + 'Z';
            condition += ` AND (
                (FAJL.journal_id IS NOT NULL AND FAJL.entry_status NOT IN ('Sales Invoice', 'Sales Invoice Payment', 'Purchase Invoice Payment') AND FJ.posting_date < '${toDateStr}')
                OR (FAJL.entry_status IN ('Sales Invoice', 'Sales Invoice Payment', 'Purchase Invoice Payment'))
                OR (FAJL.journal_id IS NULL AND FAJL.entry_status NOT IN ('Sales Invoice', 'Sales Invoice Payment', 'Purchase Invoice Payment') AND FAJL.createdAt < '${toDateStr}')
            )`;
        }

        const query = `
            SELECT
                pc.id AS profit_row_id,
                pc.profit_center_id,
                pc.profit_center_name,
                pc.is_group,
                pc.status AS profit_center_status,
                pc.remark,
                pc.created_on,
                pc.from_date,
                pc.to_date,
                parent.id AS parent_profit_center_id,
                parent.profit_center_id AS parent_profit_center_id,
                parent.profit_center_name AS parent_profit_center_name,
                pc.manager_id,
                CONCAT(m.first_name,' ',m.last_name) AS manager_name,
                m.employee_code AS manager_code,
                pc.employee_id,
                e.first_name AS created_by_employee,
                d.department_name,
                pc.cost_profit_center_id,
                cpc.profit_center_id AS cost_profit_center_id,
                cpc.profit_center_name AS cost_profit_center_name,
                pc.currency_id,
                cur.currency_type,
                cur.symbols AS currency_symbol,
                cur.rate AS currency_rate,
                pc.entity_id,
                ent.entity_name,
                COUNT(DISTINCT FAJL.id) AS total_transactions,
                COUNT(DISTINCT FAJL.document_number) AS total_documents,
                COUNT(DISTINCT FAJL.entry_status) AS unique_entry_statuses,
                COALESCE(SUM(FAJL.debit_amount), 0) AS total_debit,
                COALESCE(SUM(FAJL.credit_amount), 0) AS total_credit,
                COALESCE(SUM(FAJL.debit_amount) - SUM(FAJL.credit_amount), 0) AS net_balance,
                COALESCE(SUM(FAJL.igst), 0) AS total_igst,
                COALESCE(SUM(FAJL.cgst), 0) AS total_cgst,
                COALESCE(SUM(FAJL.sgst), 0) AS total_sgst,
                COALESCE(SUM(FAJL.igst + FAJL.cgst + FAJL.sgst), 0) AS total_gst,
                COALESCE(SUM(FAJL.tds_rate_amount), 0) AS total_tds,
                COALESCE(SUM(CASE WHEN FAJL.party_type = 'VENDOR' THEN FAJL.debit_amount ELSE 0 END), 0) AS vendor_debit,
                COALESCE(SUM(CASE WHEN FAJL.party_type = 'VENDOR' THEN FAJL.credit_amount ELSE 0 END), 0) AS vendor_credit,
                COALESCE(SUM(CASE WHEN FAJL.party_type = 'CUSTOMER' THEN FAJL.debit_amount ELSE 0 END), 0) AS customer_debit,
                COALESCE(SUM(CASE WHEN FAJL.party_type = 'CUSTOMER' THEN FAJL.credit_amount ELSE 0 END), 0) AS customer_credit,
                COALESCE(SUM(CASE WHEN FAJL.party_type = 'EMPLOYEE' THEN FAJL.debit_amount ELSE 0 END), 0) AS employee_debit,
                COALESCE(SUM(CASE WHEN FAJL.party_type = 'EMPLOYEE' THEN FAJL.credit_amount ELSE 0 END), 0) AS employee_credit,
                COALESCE(SUM(CASE WHEN FAJL.entry_status LIKE '%Sales%' OR FAJL.entry_status LIKE '%Invoice%' THEN FAJL.debit_amount ELSE 0 END), 0) AS sales_amount,
                COALESCE(SUM(CASE WHEN FAJL.entry_status LIKE '%Purchase%' OR FAJL.entry_status LIKE '%PO%' THEN FAJL.credit_amount ELSE 0 END), 0) AS purchase_amount,
                COALESCE(SUM(CASE WHEN FAJL.entry_status LIKE '%Cancellation%' OR FAJL.entry_status LIKE '%Cancel%' THEN FAJL.debit_amount ELSE 0 END), 0) AS cancellation_amount,
                COALESCE(SUM(CASE WHEN FAJL.entry_status LIKE '%Payment%' OR FAJL.entry_status LIKE '%PV%' THEN FAJL.credit_amount ELSE 0 END), 0) AS payment_amount,
                COALESCE(SUM(CASE WHEN FAJL.entry_status LIKE '%Receipt%' OR FAJL.entry_status LIKE '%RV%' THEN FAJL.debit_amount ELSE 0 END), 0) AS receipt_amount,
                COUNT(DISTINCT FAJL.chart_account_id) AS unique_chart_accounts,
                MIN(FAJL.createdAt) AS first_transaction_date,
                MAX(FAJL.createdAt) AS last_transaction_date,
                DATEDIFF(MAX(FAJL.createdAt), MIN(FAJL.createdAt)) AS transaction_days_span,
                COUNT(CASE WHEN FAJL.status = 'ACTIVE' THEN 1 END) AS active_transactions,
                COUNT(CASE WHEN FAJL.status = 'PENDING' THEN 1 END) AS pending_transactions,
                COUNT(CASE WHEN FAJL.status = 'APPROVED' THEN 1 END) AS approved_transactions,
                COUNT(CASE WHEN FAJL.status = 'REJECTED' THEN 1 END) AS rejected_transactions,
                CASE
                    WHEN COALESCE(SUM(FAJL.debit_amount) - SUM(FAJL.credit_amount), 0) > 0 THEN 'PROFIT'
                    WHEN COALESCE(SUM(FAJL.debit_amount) - SUM(FAJL.credit_amount), 0) < 0 THEN 'LOSS'
                    ELSE 'BREAK EVEN'
                END AS financial_performance,
                CASE
                    WHEN COALESCE(SUM(FAJL.debit_amount), 0) = 0 THEN 0
                    ELSE ROUND(COALESCE(SUM(FAJL.credit_amount), 0) / NULLIF(COALESCE(SUM(FAJL.debit_amount), 0), 0) * 100, 2)
                END AS credit_to_debit_ratio,
                (
                    SELECT FAJL2.document_number
                    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FAJL2
                    WHERE FAJL2.profit_center_id = pc.id
                    AND FAJL2.isDeleted = 0
                    ORDER BY FAJL2.createdAt DESC
                    LIMIT 1
                ) AS last_document_number,
                (
                    SELECT FAJL2.entry_status
                    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FAJL2
                    WHERE FAJL2.profit_center_id = pc.id
                    AND FAJL2.isDeleted = 0
                    ORDER BY FAJL2.createdAt DESC
                    LIMIT 1
                ) AS last_entry_status,
                (
                    SELECT FAJL2.createdAt
                    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FAJL2
                    WHERE FAJL2.profit_center_id = pc.id
                    AND FAJL2.isDeleted = 0
                    ORDER BY FAJL2.createdAt DESC
                    LIMIT 1
                ) AS last_transaction_datetime,
                pc.createdAt AS profit_center_created_at,
                pc.updatedAt AS profit_center_updated_at

            FROM FINANCE_PROFIT_CENTER pc

            LEFT JOIN FINANCE_PROFIT_CENTER parent ON pc.parent_profit_center_id = parent.id AND parent.isDeleted = 0
            LEFT JOIN HRMS_REGISTERED_USER m ON pc.manager_id = m.employee_id
            LEFT JOIN HRMS_REGISTERED_USER e ON pc.employee_id = e.employee_id
            LEFT JOIN MASTER_DEPARTMENT d ON pc.department_id = d.dept_id
            LEFT JOIN FINANCE_PROFIT_CENTER cpc ON pc.cost_profit_center_id = cpc.id AND cpc.isDeleted = 0
            LEFT JOIN MASTER_CURRENCY_CONVERT cur ON pc.currency_id = cur.Currency_Convert_id
            LEFT JOIN ENTITY_MASTER ent ON pc.entity_id = ent.id
            LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FAJL ON pc.id = FAJL.profit_center_id AND FAJL.isDeleted = 0
            LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL FJ ON FJ.id = FAJL.journal_id

            WHERE pc.isDeleted = 0
            AND pc.entity_id = ${entity_id}
            ${condition}

            GROUP BY pc.id

            
        `;

        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (data.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched Data Successfully!",
                data: data,
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.error('Error in getProfitCenterLedger:', error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getProfitCenterDetailedLedger = async (req, res) => {
    try {
        let { from_date, to_date } = req.query;
        let entity_id = req.params?.entity_id;
        let profit_center_id = req.params?.profit_center_id;
        let condition = '';

        if (from_date) {
            condition += ` AND DATE(fajl.createdAt) >= '${from_date}'`;
        }

        if (to_date) {
            condition += ` AND DATE(fajl.createdAt) <= '${to_date}'`;
        }

        const query = `
            SELECT
                pc.id AS profit_center_id,
                pc.profit_center_id,
                pc.profit_center_name,
                pc.is_group,
                pc.status AS profit_center_status,
                pc.remark,
                pc.created_on,
                pc.from_date,
                pc.to_date,
                parent.id AS parent_profit_center_id,
                parent.profit_center_id AS parent_profit_center_id,
                parent.profit_center_name AS parent_profit_center_name,
                pc.manager_id,
                m.first_name AS manager_name,
                m.employee_code AS manager_code,
                pc.employee_id,
                e.first_name AS created_by_employee,
                pc.department_id,
                d.department_name,
                pc.cost_profit_center_id,
                cpc.profit_center_id AS cost_profit_center_id,
                cpc.profit_center_name AS cost_profit_center_name,
                pc.currency_id,
                cur.currency_type,
                cur.symbols AS currency_symbol,
                cur.rate AS currency_rate,
                pc.entity_id,
                ent.entity_name,
                fajl.id AS transaction_id,
                fajl.document_number,
                DATE_FORMAT(fajl.createdAt, '%Y-%m-%d') AS transaction_date,
                fajl.entry_status,
                fajl.debit_amount,
                fajl.credit_amount,
                fajl.debit_amount - fajl.credit_amount AS net_amount,
                fajl.igst,
                fajl.cgst,
                fajl.sgst,
                fajl.igst + fajl.cgst + fajl.sgst AS total_gst,
                fajl.tds_rate_amount AS tds_amount,
                fajl.status AS transaction_status,
                fajl.party_type,
                coa.account_name AS chart_account_name,
                coa.account_code,
                CASE
                    WHEN fajl.party_type = 'VENDOR' THEN v.vendor_name
                    WHEN fajl.party_type = 'CUSTOMER' THEN c.company_name
                    WHEN fajl.party_type = 'EMPLOYEE' THEN emp.first_name
                    ELSE NULL
                END AS party_name,
                b.branch_name,
                fj.journal_no,
                fajl.createdAt AS transaction_created_at,
                pc.createdAt AS profit_center_created_at,
                pc.updatedAt AS profit_center_updated_at

            FROM FINANCE_PROFIT_CENTER pc

            LEFT JOIN FINANCE_PROFIT_CENTER parent ON pc.parent_profit_center_id = parent.id AND parent.isDeleted = 0
            LEFT JOIN HRMS_REGISTERED_USER m ON pc.manager_id = m.employee_id
            LEFT JOIN HRMS_REGISTERED_USER e ON pc.employee_id = e.employee_id
            LEFT JOIN MASTER_DEPARTMENT d ON pc.department_id = d.dept_id
            LEFT JOIN FINANCE_PROFIT_CENTER cpc ON pc.cost_profit_center_id = cpc.id AND cpc.isDeleted = 0
            LEFT JOIN MASTER_CURRENCY_CONVERT cur ON pc.currency_id = cur.Currency_Convert_id
            LEFT JOIN ENTITY_MASTER ent ON pc.entity_id = ent.id

            LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST fajl ON pc.id = fajl.profit_center_id AND fajl.isDeleted = 0
            LEFT JOIN CHART_OF_ACCOUNTS coa ON fajl.chart_account_id = coa.id
            LEFT JOIN VENDOR_BASIC_DETAILS v ON fajl.party_type = 'VENDOR' AND fajl.vendor_id = v.id
            LEFT JOIN CUSTOMER_PROFILE_MST c ON fajl.party_type = 'CUSTOMER' AND fajl.customer_id = c.id
            LEFT JOIN HRMS_REGISTERED_USER emp ON fajl.party_type = 'EMPLOYEE' AND fajl.employee_id = emp.employee_id
            LEFT JOIN MASTER_BRANCH b ON fajl.branch_id = b.id
            LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL fj ON fajl.journal_id = fj.id

            WHERE pc.isDeleted = 0
            AND pc.id = ${profit_center_id}
            AND pc.entity_id = ${entity_id}
            ${condition}

            ORDER BY fajl.createdAt DESC
        `;

        const transactions = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (transactions.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched Data Successfully!",
                data: transactions,
            });
        } else {
            return res.status(404).send({ 
                code: 404, 
                message: "Record Not Found" 
            });
        }
    } catch (error) {
        console.error('Error in getProfitCenterDetailedLedger:', error);
        return res.status(500).send({ 
            code: 500, 
            message: error.message 
        });
    }
};


module.exports.getAllServiceDataById = async(req,res)=>{
  try {
    const {id}=req.query;
    const [dataList] = await db.sequelize.query(`
      SELECT S.* ,M.hsn_sac_code AS service_code
FROM MASTER_SERVICE AS S
INNER JOIN CHART_OF_ACCOUNTS AS C ON C.id=S.chart_of_account_id
INNER JOIN MASTER_HSN_SAC_CODE AS M ON M.id=S.sac_code_id
WHERE C.id= ${id}
      `) 
    if(dataList){
      return res.status(200).send({code:200,message:'Success',data:dataList})
    }else{
      return res.status(404).send({code:404,message:'Data Not Found',data:[]})
    }
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}

module.exports.getChartOfAccountById = async (req, res) => {
  try {
      let {id} = req.query;
      const [data] =await db.sequelize.query( `
        WITH RECURSIVE coa_tree AS (

    SELECT
        id,
        account_name,
        parent_account,
        is_group
    FROM CHART_OF_ACCOUNTS
    WHERE id = ${id}

    UNION ALL

    SELECT
        c.id,
        c.account_name,
        c.parent_account,
        c.is_group
    FROM CHART_OF_ACCOUNTS c
    INNER JOIN coa_tree t
        ON c.parent_account = t.id
)
SELECT *
FROM coa_tree
WHERE is_group = 'no'`);


      if (data.length > 0) {
          return res
              .status(200)
              .send({
                  code: 200,
                  message: "Fetched Data Successfully !",
                  data: data,
              });
      } else {
          return res.status(404).send({ code: 404, message: "Record Not Found" });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: "Server Error" });
  }
};