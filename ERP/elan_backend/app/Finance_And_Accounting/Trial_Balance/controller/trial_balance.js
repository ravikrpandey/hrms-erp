const db = require("../../../models/index");

exports.getTrialBalance = async (req, res) => {
  try {
    
    const { entity_id } = req.query;
    if (!entity_id) {
        return res.status(404).json({
            success: false,
            message: "Undefined entityId",
        });
    }

    // Query to get total debit and credit amounts
    const totalDebitQuery = `
        SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
        FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
        INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
        WHERE CA.entity_id =${entity_id}
    `;

    // Query for account types with their total debit and credit
    const chartOfAccountQuery = `
        SELECT 
            CA.id AS id,
            CA.account_name AS name,
            'accountType' AS type,
            CA.parent_account,
            COALESCE(SUM(JL.debit_amount), 0) AS debit_amount,
            COALESCE(SUM(JL.credit_amount), 0) AS credit_amount
        FROM CHART_OF_ACCOUNTS AS CA 
        LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL ON JL.chart_account_id = CA.id
        WHERE CA.isDeleted = '0' AND CA.status = 'ACTIVE' AND CA.entity_id =${entity_id}
        GROUP BY CA.id
    `;

    const [
        totalResults,
        chartOfAccounts,
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
    
    // Function to recursively find children accounts and sum their values
    const findChildren = (account, allAccounts) => {
        const children = allAccounts.filter(
            (acc) => acc.parent_account === account.id
        );

        let debit = account.debit_amount || 0; // Start with the parent's debit
        let credit = account.credit_amount || 0; // Start with the parent's credit

        const childAccounts = children.map((child) => {
            const childData = findChildren(child, allAccounts); // Recursively find children

            // Add child's debit and credit to the parent's total
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

    // Building the final response structure
    const response = {
        totals,
        accountTypes: chartOfAccounts.filter((account) => account.parent_account === null)
            .map((parentAccount) => {
                const accountData = findChildren(parentAccount, chartOfAccounts);
                return {
                    ...parentAccount,
                    children: accountData.children,
                    debit: accountData.debit,
                    credit: accountData.credit,
                };
            }),
    };

    console.log(JSON.stringify(response, null, 2));

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

//   try {
//     const { company_id } = req.query;
//     if (!company_id) {
//       return res.status(404).json({
//         success: false,
//         message: "Undefind companyID ",
//       });
//     }
//     // Query to get total debit and credit amounts
//     const totalDebitQuery = `
//       SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
//       FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
//       INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
//       WHERE CA.company_id = ${company_id};
//     `;

//     // Query for account types with their total debit and credit
//     const accountTypeQuery = `
//       SELECT 
//         MAT.id AS id,
//         MAT.account_type_name AS name,
//         COALESCE(SUM(jl.debit_amount), 0) AS debit,
//         COALESCE(SUM(jl.credit_amount), 0) AS credit
//       FROM MASTER_ACCOUNT_TYPE AS MAT
//       LEFT JOIN CHART_OF_ACCOUNTS AS CA ON MAT.id = CA.account_type_id AND CA.isDeleted = 0
//       LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS jl ON CA.id = jl.chart_account_id AND jl.isDeleted = 0 
//       AND CA.company_id = ${company_id} 
//       WHERE MAT.isDeleted = 0
//       GROUP BY MAT.id, MAT.account_type_name;
//     `;

//     // Query for account groups based on account type ID
//     const accountGroupQuery = `
//       SELECT 
//       MAG.id,
//         MAG.account_type_id,
//         MAG.account_group AS name,
//         COALESCE(SUM(jl.debit_amount), 0) AS debit,
//         COALESCE(SUM(jl.credit_amount), 0) AS credit
//       FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS jl
//       INNER JOIN CHART_OF_ACCOUNTS AS CA ON jl.chart_account_id = CA.id AND CA.company_id = ${company_id} AND CA.isDeleted = 0 AND jl.isDeleted = 0
//       RIGHT JOIN MASTER_ACCOUNT_GROUP AS MAG ON CA.account_group = MAG.id 
//       WHERE MAG.isDeleted = 0
//       GROUP BY MAG.id, MAG.account_group, MAG.account_type_id
//       ORDER BY MAG.account_group
//     `;

//     // Query for chart of accounts matching the company ID
//     const chartOfAccountsQuery = `
//       SELECT  
//         JL.chart_account_id, 
//         CA.account_name AS name, 
//         SUM(JL.debit_amount) AS debit, 
//         SUM(JL.credit_amount) AS credit, 
//         CA.parent_account,
//         CA.account_type_id,
//         CA.account_group
//       FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
//       LEFT JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id 
//       WHERE CA.company_id = ${company_id} AND CA.isDeleted = 0 AND JL.isDeleted = 0
//       GROUP BY JL.chart_account_id, CA.account_name, CA.parent_account, CA.account_type_id, CA.account_group 
//       ORDER BY CA.account_name
//     `;

//     const slefChartOfAccount = `select    ca.id , 
// ca.account_name as name,  
                                        
// ca.account_type_id,
// ca.account_group,
// ca.company_id ,
// ca.parent_account,
//         COALESCE(SUM(jl.debit_amount), 0) AS debit,
//         COALESCE(SUM(jl.credit_amount), 0) AS credit
//         from CHART_OF_ACCOUNTS as ca left join CHART_OF_ACCOUNTS as ca2 on ca.id =ca2.parent_account AND ca.isDeleted=0
// left join FINANCIAL_AND_ACCOUNT_JOURNAL_LIST as jl on ca.id = jl.chart_account_id AND jl.isDeleted=0
// group by ca.id
// `;

//     const [
//       totalResults,
//       accountTypes,
//       accountGroups,
//       chartOfAccounts,
//       slefChartOfAccount2,
//     ] = await Promise.all([
//       db.sequelize.query(totalDebitQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(accountTypeQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(accountGroupQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(chartOfAccountsQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(slefChartOfAccount, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//     ]);

//     const totals = totalResults[0];
//     const findChildren = (account, allAccounts) => {
//       const children = allAccounts.filter(
//         (acc) => acc.parent_account === account.id
//       );

//       let debit = 0;
//       let credit = 0;

//       const childAccounts = children.map((child) => {
//         const childData = findChildren(child, allAccounts);

//         debit += childData.debit;
//         credit += childData.credit;

//         return {
//           ...child,
//           children: childData.children,
//           debit: child.debit || 0,
//           credit: child.credit || 0,
//         };
//       });

//       debit += account.debit || 0;
//       credit += account.credit || 0;

//       return {
//         children: childAccounts,
//         debit,
//         credit,
//       };
//     };

//     const response = {
//       totals,
//       accountTypes: accountTypes.map((type) => ({
//         ...type,
//         children: accountGroups
//           .filter((group) => group.account_type_id === type.id)
//           .map((group) => ({
//             ...group,
//             children: slefChartOfAccount2
//               .filter(
//                 (account) =>
//                   account.account_type_id === type.id &&
//                   account.account_group === group.id &&
//                   account.parent_account === null
//               )
//               .map((account) => {
//                 const accountData = findChildren(account, slefChartOfAccount2);
//                 return {
//                   ...account,
//                   children: accountData.children,
//                   debit: accountData.debit,
//                   credit: accountData.credit,
//                 };
//               }),
//           })),
//       })),
//     };

//     // const findChildren = (account, allAccounts) => {
//     //   const children = allAccounts.filter(
//     //     (acc) => acc.parent_account === account.id
//     //   );
//     //   return children.map((child) => ({

//     //     ...child,
//     //     children: findChildren(child, allAccounts),
//     //   }));
//     // };
//     // const response = {
//     //   totals,
//     //   accountTypes: accountTypes.map((type) => ({
//     //     ...type,
//     //     children: accountGroups
//     //       .filter((group) => group.account_type_id === type.id)
//     //       .map((group) => ({
//     //         ...group,
//     //         children: slefChartOfAccount2
//     //           .filter(
//     //             (account) =>
//     //               account.account_type_id === type.id &&
//     //               account.account_group === group.id &&
//     //               account.parent_account === null
//     //           )
//     //           .map((account) => ({
//     //             ...account,
//     //             children: findChildren(account, slefChartOfAccount2),
//     //           })),
//     //       })),
//     //   })),
//     // };

//     console.log(JSON.stringify(response, null, 2));

// exports.getTrialBalance = async (req, res) => {
//   try {
//     const { company_id } = req.query;
//     if (!company_id) {
//       return res.status(404).json({
//         success: false,
//         message: "Undefind companyID ",
//       });
//     }
//     // Query to get total debit and credit amounts
//     const totalDebitQuery = `
//       SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
//       FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
//       INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
//       WHERE CA.company_id = ${company_id};
//     `;

//     // Query for account types with their total debit and credit
//     const accountTypeQuery = `
//       SELECT 
//         MAT.id AS id,
//         MAT.account_type_name AS name,
//         COALESCE(SUM(jl.debit_amount), 0) AS debit,
//         COALESCE(SUM(jl.credit_amount), 0) AS credit
//       FROM MASTER_ACCOUNT_TYPE AS MAT
//       LEFT JOIN CHART_OF_ACCOUNTS AS CA ON MAT.id = CA.account_type_id AND CA.isDeleted = 0
//       LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS jl ON CA.id = jl.chart_account_id AND jl.isDeleted = 0 
//       AND CA.company_id = ${company_id} 
//       WHERE MAT.isDeleted = 0
//       GROUP BY MAT.id, MAT.account_type_name;
//     `;

//     // Query for account groups based on account type ID
//     const accountGroupQuery = `
//       SELECT 
//       MAG.id,
//         MAG.account_type_id,
//         MAG.account_group AS name,
//         COALESCE(SUM(jl.debit_amount), 0) AS debit,
//         COALESCE(SUM(jl.credit_amount), 0) AS credit
//       FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS jl
//       INNER JOIN CHART_OF_ACCOUNTS AS CA ON jl.chart_account_id = CA.id AND CA.company_id = ${company_id} AND CA.isDeleted = 0 AND jl.isDeleted = 0
//       RIGHT JOIN MASTER_ACCOUNT_GROUP AS MAG ON CA.account_group = MAG.id 
//       WHERE MAG.isDeleted = 0
//       GROUP BY MAG.id, MAG.account_group, MAG.account_type_id
//       ORDER BY MAG.account_group
//     `;

//     // Query for chart of accounts matching the company ID
//     const chartOfAccountsQuery = `
//       SELECT  
//         JL.chart_account_id, 
//         CA.account_name AS name, 
//         SUM(JL.debit_amount) AS debit, 
//         SUM(JL.credit_amount) AS credit, 
//         CA.parent_account,
//         CA.account_type_id,
//         CA.account_group
//       FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
//       LEFT JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id 
//       WHERE CA.company_id = ${company_id} AND CA.isDeleted = 0 AND JL.isDeleted = 0
//       GROUP BY JL.chart_account_id, CA.account_name, CA.parent_account, CA.account_type_id, CA.account_group 
//       ORDER BY CA.account_name
//     `;

//     const slefChartOfAccount = `select    ca.id , 
// ca.account_name as name,  
                                        
// ca.account_type_id,
// ca.account_group,
// ca.company_id ,
// ca.parent_account,
//         COALESCE(SUM(jl.debit_amount), 0) AS debit,
//         COALESCE(SUM(jl.credit_amount), 0) AS credit
//         from CHART_OF_ACCOUNTS as ca left join CHART_OF_ACCOUNTS as ca2 on ca.id =ca2.parent_account AND ca.isDeleted=0
// left join FINANCIAL_AND_ACCOUNT_JOURNAL_LIST as jl on ca.id = jl.chart_account_id AND jl.isDeleted=0
// group by ca.id
// `;

//     const [
//       totalResults,
//       accountTypes,
//       accountGroups,
//       chartOfAccounts,
//       slefChartOfAccount2,
//     ] = await Promise.all([
//       db.sequelize.query(totalDebitQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(accountTypeQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(accountGroupQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(chartOfAccountsQuery, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//       db.sequelize.query(slefChartOfAccount, {
//         type: db.sequelize.QueryTypes.SELECT,
//       }),
//     ]);

//     const totals = totalResults[0];
//     const findChildren = (account, allAccounts) => {
//       const children = allAccounts.filter(
//         (acc) => acc.parent_account === account.id
//       );

//       let debit = 0;
//       let credit = 0;

//       const childAccounts = children.map((child) => {
//         const childData = findChildren(child, allAccounts);

//         debit += childData.debit;
//         credit += childData.credit;

//         return {
//           ...child,
//           children: childData.children,
//           debit: child.debit || 0,
//           credit: child.credit || 0,
//         };
//       });

//       debit += account.debit || 0;
//       credit += account.credit || 0;

//       return {
//         children: childAccounts,
//         debit,
//         credit,
//       };
//     };

//     const response = {
//       totals,
//       accountTypes: accountTypes.map((type) => ({
//         ...type,
//         children: accountGroups
//           .filter((group) => group.account_type_id === type.id)
//           .map((group) => ({
//             ...group,
//             children: slefChartOfAccount2
//               .filter(
//                 (account) =>
//                   account.account_type_id === type.id &&
//                   account.account_group === group.id &&
//                   account.parent_account === null
//               )
//               .map((account) => {
//                 const accountData = findChildren(account, slefChartOfAccount2);
//                 return {
//                   ...account,
//                   children: accountData.children,
//                   debit: accountData.debit,
//                   credit: accountData.credit,
//                 };
//               }),
//           })),
//       })),
//     };

//     // const findChildren = (account, allAccounts) => {
//     //   const children = allAccounts.filter(
//     //     (acc) => acc.parent_account === account.id
//     //   );
//     //   return children.map((child) => ({

//     //     ...child,
//     //     children: findChildren(child, allAccounts),
//     //   }));
//     // };
//     // const response = {
//     //   totals,
//     //   accountTypes: accountTypes.map((type) => ({
//     //     ...type,
//     //     children: accountGroups
//     //       .filter((group) => group.account_type_id === type.id)
//     //       .map((group) => ({
//     //         ...group,
//     //         children: slefChartOfAccount2
//     //           .filter(
//     //             (account) =>
//     //               account.account_type_id === type.id &&
//     //               account.account_group === group.id &&
//     //               account.parent_account === null
//     //           )
//     //           .map((account) => ({
//     //             ...account,
//     //             children: findChildren(account, slefChartOfAccount2),
//     //           })),
//     //       })),
//     //   })),
//     // };

//     console.log(JSON.stringify(response, null, 2));

//     return res.json({
//       code: 200,
//       message: "Trial balance data retrieved successfully",
//       data: response,
//     });
//   } catch (error) {
//     return res.json({
//       code: 500,
//       message: error.message,
//     });
//   }
};

////////////////////////////////////////////////////////////////
//////////////////////////////
/////////////////////// here code for getting profit and loss ( income and expense)
//////////



exports.getProfitAndLoss = async (req, res) => {
    let { entity_id,financial_id } = req.query;

    if (!entity_id) {
        return res.status(400).json({
            code: 400,
            message: "Missing entity_id in request",
        });
    }

    try {
        const totalDebitQuery = `
            SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
            FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
            INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
            WHERE JL.entity_id = ${entity_id} AND JL.financial_id=${financial_id}
        `;

        const chartOfAccountQuery = `
            SELECT 
          CA.id AS id,
          CA.account_name AS name,
          'accountType' AS type,
          JL.entity_id,
          CA.parent_account,
          COALESCE(SUM(CASE WHEN JL.entity_id =${entity_id} AND JL.financial_id=${financial_id} THEN JL.debit_amount ELSE 0 END), 0) AS debit_amount,
              COALESCE(SUM(CASE WHEN JL.entity_id = ${entity_id} AND JL.financial_id=${financial_id} THEN JL.credit_amount ELSE 0 END), 0) AS credit_amount
      FROM CHART_OF_ACCOUNTS AS CA 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL ON JL.chart_account_id = CA.id
      WHERE CA.isDeleted = '0' AND CA.status = 'ACTIVE' AND  JL.entity_id=${entity_id} AND JL.financial_id=${financial_id} OR JL.entity_id IS NULL
      GROUP BY JL.entity_id , CA.id`;

        const [totalResults, accountData] = await Promise.all([
            db.sequelize.query(totalDebitQuery, {
                type: db.sequelize.QueryTypes.SELECT,
            }),
            db.sequelize.query(chartOfAccountQuery, {
                type: db.sequelize.QueryTypes.SELECT,
            }),
        ]);

        const totals = totalResults[0];

        const accounts = accountData.map(({ id, name, parent_account, debit_amount, credit_amount, entity_id }) => ({
            id,
            name,
            parent_account,
            entity_id, // ✅ include this so we can use it in filtering
            debit_amount: parseFloat(debit_amount),
            credit_amount: parseFloat(credit_amount),
            account_type: String(id).startsWith('4') || String(id).startsWith('5') || String(id).startsWith('6') || String(id).startsWith('7')
                ? 'EXPENSE'
                : (String(id).startsWith('50') || String(id).startsWith('51'))
                    ? 'INCOME'
                    : 'OTHER'
        }));

        // ✅ Use entity_id when calculating amount
        const findChildren = (account, allAccounts) => {
            const children = allAccounts.filter(acc => acc.parent_account === account.id);
            let amount = 0;

            // ✅ Only calculate amount if the account belongs to the requested entity
            if (String(account.entity_id) === String(entity_id)) {
                if (account.account_type === 'INCOME') {
                    amount = account.credit_amount - account.debit_amount;
                } else {
                    amount = account.debit_amount - account.credit_amount;
                }
            }

            const childAccounts = children.map(child => {
                const childData = findChildren(child, allAccounts);
                amount += childData.amount;
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

        // ✅ Keep full hierarchy; only filter amounts
        const response = {
            totals,
            accountTypes: accounts
                .filter(account => account.parent_account === null)
                .map(parentAccount => {
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
};

// exports.getProfitAndLoss = async (req, res) => {
//     const { entity_id, financial_id } = req.query;

//     if (!entity_id || !financial_id) {
//         return res.status(400).json({
//             code: 400,
//             message: "entity_id and financial_id are required"
//         });
//     }

//     try {

//         const totalQuery = `
//             SELECT
//                 COALESCE(SUM(debit_amount),0) AS total_debit,
//                 COALESCE(SUM(credit_amount),0) AS total_credit
//             FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST
//             WHERE entity_id = ${entity_id}
//             AND financial_id = ${financial_id}
//         `;

//         const coaQuery = `
//             SELECT
//                 CA.id,
//                 CA.account_name,
//                 CA.account_code,
//                 CA.parent_account,
//                 CA.root_name,
//                 CA.report_type,
//                 CA.root_type_status,

//                 COALESCE(SUM(JL.debit_amount),0) AS debit_amount,
//                 COALESCE(SUM(JL.credit_amount),0) AS credit_amount

//             FROM CHART_OF_ACCOUNTS CA

//             LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST JL
//                 ON JL.chart_account_id = CA.id
//                 AND JL.entity_id = ${entity_id}
//                 AND JL.financial_id = ${financial_id}

//             WHERE
//                 CA.isDeleted = 0
//                 AND CA.status = 'ACTIVE'
//                 AND CA.report_type = 'PROFIT & LOSS'

//             GROUP BY
//                 CA.id,
//                 CA.account_name,
//                 CA.account_code,
//                 CA.parent_account,
//                 CA.root_name,
//                 CA.report_type,
//                 CA.root_type_status

//             ORDER BY CA.id
//         `;

//         const [totalResult, accountData] = await Promise.all([
//             db.sequelize.query(totalQuery, {
//                 type: db.sequelize.QueryTypes.SELECT
//             }),
//             db.sequelize.query(coaQuery, {
//                 type: db.sequelize.QueryTypes.SELECT
//             })
//         ]);

//         const totals = totalResult[0];

//         const accounts = accountData.map(acc => {

//             let account_type = "OTHER";

//             if (
//                 acc.root_name === "Trading Income" ||
//                 acc.root_name === "P & L Income"
//             ) {
//                 account_type = "INCOME";
//             }

//             if (
//                 acc.root_name === "Trading Expenses" ||
//                 acc.root_name === "P & L Expenses"
//             ) {
//                 account_type = "EXPENSE";
//             }

//             return {
//                 id: acc.id,
//                 // account_name: acc.account_name,
//                 name: acc.account_name,
//                 account_code: acc.account_code,
//                 parent_account: acc.parent_account,
//                 root_name: acc.root_name,
//                 report_type: acc.report_type,
//                 root_type_status: acc.root_type_status,

//                 debit_amount: Number(acc.debit_amount || 0),
//                 credit_amount: Number(acc.credit_amount || 0),

//                 account_type
//             };
//         });

//         const buildHierarchy = (account) => {

//             const children = accounts.filter(
//                 item => Number(item.parent_account) === Number(account.id)
//             );

//             let amount = 0;

//             if (account.account_type === "INCOME") {
//                 amount =
//                     Number(account.credit_amount) -
//                     Number(account.debit_amount);
//             }
//             else if (account.account_type === "EXPENSE") {
//                 amount =
//                     Number(account.debit_amount) -
//                     Number(account.credit_amount);
//             }

//             const childAccounts = children.map(child => {

//                 const childNode = buildHierarchy(child);

//                 amount += childNode.amount;

//                 return childNode;
//             });

//             return {
//                 ...account,
//                 amount,
//                 children: childAccounts
//             };
//         };

//         // Only P&L Root Accounts
//         const hierarchy = accounts
//             .filter(
//                 item =>
//                     item.root_type_status === 'R' &&
//                     [
//                         'Trading Income',
//                         'Trading Expenses',
//                         'P & L Income',
//                         'P & L Expenses'
//                     ].includes(item.name )
//             )
//             .map(root => buildHierarchy(root));

//         const tradingIncome =
//             hierarchy.find(
//                 x => x.name  === 'Trading Income'
//             )?.amount || 0;

//         const tradingExpense =
//             hierarchy.find(
//                 x => x.name  === 'Trading Expenses'
//             )?.amount || 0;

//         const pnlIncome =
//             hierarchy.find(
//                 x => x.name  === 'P & L Income'
//             )?.amount || 0;

//         const pnlExpense =
//             hierarchy.find(
//                 x => x.name  === 'P & L Expenses'
//             )?.amount || 0;

//         const grossProfit =
//             tradingIncome - tradingExpense;

//         const netProfit =
//             grossProfit + pnlIncome - pnlExpense;

//         return res.status(200).json({
//             code: 200,
//             message: "Profit & Loss generated successfully",
//             data: {
//                 totals,
//                 tradingIncome,
//                 tradingExpense,
//                 pnlIncome,
//                 pnlExpense,
//                 grossProfit,
//                 netProfit,
//                 accountTypes: hierarchy
//             }
//         });

//     } catch (error) {

//         console.error(error);

//         return res.status(500).json({
//             code: 500,
//             message: error.message
//         });
//     }
// };

////////////////////////////////////////////////////////////////
//////////////////////////////
/////////////////////// here code for getting Balance sheet ('Assets', 'Liabilities','Equity')
//////////
const schedule = require('node-schedule');
exports.getBalanceSheet = async (req, res) => {
    const { entity_id } = req.query;

    try {

        const query = `
            SELECT
                CA.id,
                CA.account_name AS name,
                CA.parent_account,
                CA.root_name,
                COALESCE(SUM(JL.debit_amount),0) AS debit_amount,
                COALESCE(SUM(JL.credit_amount),0) AS credit_amount
            FROM CHART_OF_ACCOUNTS CA
            LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST JL
                ON JL.chart_account_id = CA.id
            WHERE
                CA.isDeleted = 0
                AND CA.status = 'ACTIVE'
                AND CA.entity_id = ${entity_id}
            GROUP BY
                CA.id,
                CA.account_name,
                CA.parent_account,
                CA.root_name
        `;

        const result = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        const accounts = result.map(row => ({
            id: row.id,
            name: row.name,
            parent_account: row.parent_account,
            root_name: row.root_name,
            debit_amount: Number(row.debit_amount || 0),
            credit_amount: Number(row.credit_amount || 0)
        }));


        // --------------------------
        // Account Balance Logic
        // --------------------------
        const getBalance = (account) => {

            switch ((account.root_name || '').toUpperCase()) {

                case 'ASSET':
                case 'EXPENSE':
                case 'COST OF GOODS SOLD':
                    return account.debit_amount - account.credit_amount;

                case 'LIABILITY':
                case 'EQUITY':
                case 'INCOME':
                    return account.credit_amount - account.debit_amount;

                default:
                    return account.debit_amount - account.credit_amount;
            }
        };


        // --------------------------
        // Recursive Tree Builder
        // --------------------------
        const buildTree = (account) => {

            const children = accounts.filter(
                x => x.parent_account === account.id
            );

            // Leaf Account
            if (children.length === 0) {

                return {
                    ...account,
                    amount: getBalance(account),
                    children: []
                };
            }

            // Parent Account
            const childNodes = children.map(child =>
                buildTree(child)
            );

            const totalAmount = childNodes.reduce(
                (sum, child) => sum + child.amount,
                0
            );

            return {
                ...account,
                amount: totalAmount,
                children: childNodes
            };
        };


        // --------------------------
        // Root Accounts
        // --------------------------
        const rootAccounts = accounts
            .filter(acc => acc.parent_account == null)
            .map(acc => buildTree(acc));


        // --------------------------
        // Total Asset
        // --------------------------
        const totalAsset = rootAccounts
            .filter(acc =>
                (acc.root_name || '').toUpperCase() === 'ASSET'
            )
            .reduce((sum, acc) => sum + acc.amount, 0);


        // --------------------------
        // Total Liability
        // --------------------------
        const totalLiability = rootAccounts
            .filter(acc =>
                ['LIABILITY', 'EQUITY'].includes(
                    (acc.root_name || '').toUpperCase()
                )
            )
            .reduce((sum, acc) => sum + acc.amount, 0);


        return res.json({
            code: 200,
            message: "Balance Sheet fetched successfully",
            data: {
                assets: totalAsset,
                liabilities: totalLiability,
                accountTypes: rootAccounts
            }
        });

    } catch (error) {

        return res.status(500).json({
            code: 500,
            message: error.message
        });

    }
};
  
//   try {
//     const { entity_id } = req.query;
//     if (!entity_id) {
//       return res.status(404).json({
//         success: false,
//         message: "Undefind companyID ",
//       });
//     }
//     // Query to get total debit and credit amounts
//     const totalDebitQuery = `
//      SELECT 
   
//  account_type_id,  total_debit - total_credit AS total 
// FROM (
//     SELECT 
//         CA.account_type_id AS account_type_id,
//         SUM(JL.debit_amount) AS total_debit, 
//         SUM(JL.credit_amount) AS total_credit
//     FROM 
//         FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
//     INNER JOIN 
//         CHART_OF_ACCOUNTS AS CA 
//         ON JL.chart_account_id = CA.id  
//     WHERE 
//         CA.entity_id IN (
//             SELECT entity_id 
//             FROM MASTER_FISCAL_YEAR 
//             WHERE  entity_id =${entity_id}
//         ) 
//         AND CA.account_type_id IN (
//             SELECT id 
//             FROM MASTER_ACCOUNT_TYPE 
//             WHERE account_type_name IN ('Assets', 'Liabilities', 'Equity')
//         )
//     GROUP BY 
//         CA.account_type_id
// ) AS account_totals
//     `;

//   catch (error) {

//     console.log(error);

//     return res.status(500).json({

//       code: 500,

//       message: error.message

//     });

//   }


