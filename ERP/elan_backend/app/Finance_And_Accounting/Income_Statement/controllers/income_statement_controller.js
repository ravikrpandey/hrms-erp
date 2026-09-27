
const db = require("../../../models/index");
const logger = require('../../../../logger/index');




//---funciton--
let getall_total_revenue = async (entity_id, budgetFinancialYear_id, filter_fy) => {
    try {
        entity_id = entity_id ? parseInt(entity_id) : null;
        budgetFinancialYear_id = budgetFinancialYear_id ? parseInt(budgetFinancialYear_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        const sqlQuery = `
            SELECT 
                BIFR.id as forcast_revenue_id,
                BIFR.forcast_month,
                BIFR.entity_id, 
                BIFR.financial_year_id,
                BIFRS.seal_volume,
                BIFRS.seal_amount,
                BIFRS.sealType_id,
                MS.seal_type
            FROM 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE BIFR
            LEFT JOIN 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE_SEAL BIFRS 
            ON 
                BIFRS.forcast_revenue_id = BIFR.id
            LEFT JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = BIFR.entity_id
            LEFT JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = BIFR.financial_year_id
            LEFT JOIN 
                MASTER_SEAL MS 
            ON 
                MS.id = BIFRS.sealType_id
            WHERE 
                BIFR.isDeleted = false 
                AND BIFR.status = 'ACTIVE'
                ${entity_id ? `AND BIFR.entity_id = :entity_id` : ''}
                ${budgetFinancialYear_id ? `AND BIFR.financial_year_id = :budgetFinancialYear_id` : ''}
                ${filter_fy ? `AND BIFR.filter_fy = :filter_fy` : ''}
            ORDER BY 
                BIFR.forcast_month ASC;
        `;

        const replacements = {};
        if (entity_id) replacements.entity_id = entity_id;
        if (budgetFinancialYear_id) replacements.budgetFinancialYear_id = budgetFinancialYear_id;
        if (filter_fy) replacements.filter_fy = filter_fy;

        const data = await db.sequelize.query(sqlQuery, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let result;

        if (data.length > 0) {
            result = data.reduce((acc, curr) => {
                let yearData = acc.find(f => f.financial_year_id === curr.financial_year_id && f.entity_id === curr.entity_id);
                if (!yearData) {
                    yearData = {
                        financial_year_id: curr.financial_year_id,
                        financial_year: curr.financial_year_id,
                        total_Revenue: 0,
                        entity_id: curr.entity_id,
                        month: monthOrder.map(month => ({ forcast_month: month, seal_type: [] }))
                    };
                    acc.push(yearData);
                }

                yearData.total_Revenue += parseFloat(curr.seal_amount) || 0;

                let monthData = yearData.month.find(m => m.forcast_month === curr.forcast_month);
                if (monthData) {
                    monthData.seal_type.push({
                        seal_volume: parseFloat(curr.seal_volume) || 0,
                        seal_amount: parseFloat(curr.seal_amount) || 0,
                        sealType_id: curr.sealType_id,
                        seal_type: curr.seal_type
                    });
                }

                return acc;
            }, []);

        } else {
            result = [{
                financial_year_id: budgetFinancialYear_id || null,
                financial_year: budgetFinancialYear_id || null,
                total_Revenue: 0,
                entity_id: entity_id || null,
                month: monthOrder.map(month => ({ forcast_month: month, seal_type: [] }))
            }];
        }

        return result;  // Return the result instead of sending the response here
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return { code: 500, message: error.message || "Server Error" };
    }
};

let getall_operating_expense = async (entity_id, budgetFinancialYear_id, filter_fy) => {
    try {
        entity_id = entity_id ? parseInt(entity_id) : null;
        budgetFinancialYear_id = budgetFinancialYear_id ? parseInt(budgetFinancialYear_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        let findPlanDate = await db.budgetPlanDate.findOne({
            where: {
                financial_year_id: budgetFinancialYear_id,
                filter_fy: filter_fy,
                entity_id: entity_id,
                isDeleted: false
            }
        });

        if (!findPlanDate) {
            return res.status(404).json({ code: 404, message: "Budget Plan Not Found!" });
        }

        budgetFinancialYear_id = findPlanDate.id;


        let conditions = `
            WHERE BP.isDeleted = false
            AND BPA.approval_status = 'APPROVED'
            AND BP.budgetFinancialYear_id = :budgetFinancialYear_id
        `;

        if (entity_id) {
            conditions += ` AND BP.entity_id = :entity_id`;
        }

        const query = `
            SELECT 
                BPA.id,
                BPA.status AS approval_status,
                BPA.budgetPlanning_Id, 
                BPA.employee_id, 
                BPA.role_id, 
                BPA.approval_status,
                BP.total_Value, 
                BP.month, 
                MFY.financial_year,
                BP.status AS budget_status, 
                BP.budgetFinancialYear_id, 
                BP.entity_id, 
                MBC.budget_category AS budget_category_name
            FROM FINANCE_BUDGET_PLANNING BP
            INNER JOIN FINANCE_BUDGET_PLANNING_APPROVAL BPA ON BP.id = BPA.budgetPlanning_Id
            INNER JOIN MASTER_BUDGET_CATEGORY MBC ON BP.budgetCategory_id = MBC.id
            INNER JOIN FINANCE_BUDGET_PLAN_DATE FBPD ON FBPD.id = BP.budgetFinancialYear_id
            INNER JOIN MASTER_FINANCIAL_YEAR MFY ON MFY.id = FBPD.financial_year_id
            ${conditions}
            ORDER BY  
                CASE 
                    WHEN BPA.approval_status = 'DRAFT' THEN 0 
                    ELSE 1 
                END ASC,
                BP.createdAt ASC;
        `;

        const replacements = { budgetFinancialYear_id };
        if (entity_id) replacements.entity_id = entity_id;

        const data = await db.sequelize.query(query, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        let result;
        if (data.length > 0) {
            result = data.reduce((acc, curr) => {
                let financialYearEntry = acc.find(entry => entry.financial_year_id === curr.budgetFinancialYear_id && entry.entity_id === curr.entity_id);
                if (!financialYearEntry) {
                    financialYearEntry = {
                        financial_year_id: curr.budgetFinancialYear_id,
                        financial_year: curr.financial_year,
                        operating_expense: 0,
                        entity_id: curr.entity_id,
                        budget_category: []
                    };
                    acc.push(financialYearEntry);
                }

                financialYearEntry.operating_expense += parseFloat(curr.total_Value);

                let budgetCategoryEntry = financialYearEntry.budget_category.find(category => category.budget_category === curr.budget_category_name);
                if (!budgetCategoryEntry) {
                    budgetCategoryEntry = {
                        budget_category: curr.budget_category_name,
                        month: {}
                    };
                    financialYearEntry.budget_category.push(budgetCategoryEntry);
                }

                let monthList = Array.isArray(curr.month) ? curr.month : [curr.month];
                monthList.forEach(month => {
                    let months = month.split(',').map(m => m.trim());
                    months.forEach(m => {
                        if (!budgetCategoryEntry.month[m]) {
                            budgetCategoryEntry.month[m] = 0;
                        }
                        budgetCategoryEntry.month[m] += parseFloat(curr.total_Value);
                    });
                });

                return acc;
            }, []);

            const allMonths = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            result.forEach(entry => {
                entry.budget_category.forEach(category => {
                    const monthObj = {};
                    allMonths.forEach(month => {
                        monthObj[month] = category.month[month] || 0;
                    });
                    category.month = monthObj;
                });

                entry.operating_expense = entry.budget_category.reduce((sum, category) => {
                    return sum + Object.values(category.month).reduce((mSum, value) => mSum + value, 0);
                }, 0);
            });

            return result;
        } else {
            return [];
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return { code: 500, message: error.message || "Server Error" };
    }
};

let getall_variable_cost = async (entity_id, budgetFinancialYear_id, filter_fy) => {
    try {
        entity_id = entity_id ? parseInt(entity_id) : null;
        budgetFinancialYear_id = budgetFinancialYear_id ? parseInt(budgetFinancialYear_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        const sqlQuery = `
            SELECT 
                BIFR.id as forcast_revenue_id,
                BIFR.forcast_month,
                BIFR.entity_id, 
                BIFR.financial_year_id,
                BIFRS.seal_volume,
                BIFRS.seal_amount,
                BIFRS.sealType_id,
                MFY.financial_year,
                MS.seal_type
            FROM 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE BIFR
            LEFT JOIN 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE_SEAL BIFRS 
            ON 
                BIFRS.forcast_revenue_id = BIFR.id
            LEFT JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = BIFR.entity_id
            LEFT JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = BIFR.financial_year_id
            INNER JOIN 
                MASTER_SEAL MS 
            ON 
                MS.id = BIFRS.sealType_id AND MS.seal_manual = false
            WHERE 
                BIFR.isDeleted = false 
                AND BIFR.status = 'ACTIVE'
                ${entity_id ? `AND BIFR.entity_id = :entity_id` : ''}
                ${budgetFinancialYear_id ? `AND BIFR.financial_year_id = :budgetFinancialYear_id` : ''}
                ${filter_fy ? `AND BIFR.filter_fy = :filter_fy` : ''}
            ORDER BY 
                BIFR.forcast_month ASC;
        `;

        const replacements = {};
        if (entity_id) replacements.entity_id = entity_id;
        if (budgetFinancialYear_id) replacements.budgetFinancialYear_id = budgetFinancialYear_id;
        if (filter_fy) replacements.filter_fy = filter_fy;

        const data = await db.sequelize.query(sqlQuery, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let result;
        if (data.length > 0) {
            result = data.reduce((acc, curr) => {
                let yearData = acc.find(f => f.financial_year_id === curr.financial_year_id && f.entity_id === curr.entity_id);
                if (!yearData) {
                    yearData = {
                        financial_year_id: curr.financial_year_id,
                        financial_year: curr.financial_year,
                        total_Revenue: 0,
                        collection_fee: 0,
                        institutional_support_fee: 0,
                        concession_fee: 0,
                        consultation_fee: 0,
                        variable_cost_amount: 0,
                        gross_profit_loss: 0,
                        entity_id: curr.entity_id,
                        month: monthOrder.map(month => ({ forcast_month: month, seal_amount: 0 }))
                    };
                    acc.push(yearData);
                }

                if (curr.seal_amount) {
                    yearData.total_Revenue += parseFloat(curr.seal_amount) || 0;

                    let monthData = yearData.month.find(m => m.forcast_month === curr.forcast_month);
                    if (monthData) {
                        monthData.seal_amount += parseFloat(curr.seal_amount) || 0;
                    }
                }

                return acc;
            }, []);

            result.forEach(yearData => {
                yearData.total_Revenue = Math.round(yearData.total_Revenue);
                yearData.collection_fee = Math.round(0.04 * yearData.total_Revenue);
                yearData.institutional_support_fee = Math.round(0.10 * (yearData.total_Revenue - yearData.collection_fee));
                yearData.concession_fee = Math.round(0.05 * (yearData.total_Revenue - yearData.collection_fee));
                yearData.consultation_fee = Math.round(0.03 * (yearData.total_Revenue - yearData.collection_fee));
                yearData.variable_cost_amount = yearData.collection_fee + yearData.institutional_support_fee + yearData.concession_fee + yearData.consultation_fee;
                yearData.gross_profit_loss = yearData.total_Revenue - yearData.variable_cost_amount;
            });

            return { code: 200, message: "Fetched Successfully", data: result };
        } else {
            result = {
                financial_year_id: budgetFinancialYear_id || null,
                financial_year: budgetFinancialYear_id || null,
                total_Revenue: 0,
                collection_fee: 0,
                institutional_support_fee: 0,
                concession_fee: 0,
                consultation_fee: 0,
                variable_cost_amount: 0,
                gross_profit_loss: 0,
                entity_id: entity_id || null,
                month: monthOrder.map(month => ({ forcast_month: month, seal_amount: 0 }))
            };
            return { code: 200, message: "Fetched Successfully", data: [result] };
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return { code: 500, message: error.message || "Server Error" };
    }
};


//---
exports.getall_total_revenue = async (req, res) => {
    try {
        let { entity_id, budgetFinancialYear_id, filter_fy } = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;
        budgetFinancialYear_id = budgetFinancialYear_id ? parseInt(budgetFinancialYear_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        const sqlQuery = `
            SELECT 
                BIFR.id as forcast_revenue_id,
                BIFR.forcast_month,
                BIFR.entity_id, 
                BIFR.financial_year_id,
                BIFRS.seal_volume,
                BIFRS.seal_amount,
                BIFRS.sealType_id,
                MS.seal_type
            FROM 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE BIFR
            LEFT JOIN 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE_SEAL BIFRS 
            ON 
                BIFRS.forcast_revenue_id = BIFR.id
            LEFT JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = BIFR.entity_id
            LEFT JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = BIFR.financial_year_id
            LEFT JOIN 
                MASTER_SEAL MS 
            ON 
                MS.id = BIFRS.sealType_id
            WHERE 
                BIFR.isDeleted = false 
                AND BIFR.status = 'ACTIVE'
                ${entity_id ? `AND BIFR.entity_id = :entity_id` : ''}
                ${budgetFinancialYear_id ? `AND BIFR.financial_year_id = :budgetFinancialYear_id` : ''}
                ${filter_fy ? `AND BIFR.filter_fy = :filter_fy` : ''}
            ORDER BY 
                BIFR.forcast_month ASC;
        `;

        const replacements = {};
        if (entity_id) replacements.entity_id = entity_id;
        if (budgetFinancialYear_id) replacements.budgetFinancialYear_id = budgetFinancialYear_id;
        if (filter_fy) replacements.filter_fy = filter_fy;

        const data = await db.sequelize.query(sqlQuery, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        if (data.length > 0) {
            const result = data.reduce((acc, curr) => {
                let yearData = acc.find(f => f.financial_year_id === curr.financial_year_id && f.entity_id === curr.entity_id);
                if (!yearData) {
                    yearData = {
                        financial_year_id: curr.financial_year_id,
                        financial_year: curr.financial_year_id,
                        total_Revenue: 0,
                        entity_id: curr.entity_id,
                        month: monthOrder.map(month => ({ forcast_month: month, seal_type: [] }))
                    };
                    acc.push(yearData);
                }

                yearData.total_Revenue += parseFloat(curr.seal_amount) || 0;

                let monthData = yearData.month.find(m => m.forcast_month === curr.forcast_month);
                if (monthData) {
                    monthData.seal_type.push({
                        seal_volume: parseFloat(curr.seal_volume) || 0,
                        seal_amount: parseFloat(curr.seal_amount) || 0,
                        sealType_id: curr.sealType_id,
                        seal_type: curr.seal_type
                    });
                }

                return acc;
            }, []);

            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: result });
        } else {
            const emptyResult = {
                financial_year_id: budgetFinancialYear_id || null,
                financial_year: budgetFinancialYear_id || null,
                total_Revenue: 0,
                entity_id: entity_id || null,
                month: monthOrder.map(month => ({ forcast_month: month, seal_type: [] }))
            };
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: [emptyResult] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getall_operating_expense = async (req, res) => {
    try {
        let { entity_id, budgetFinancialYear_id, filter_fy } = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;
        budgetFinancialYear_id = budgetFinancialYear_id ? parseInt(budgetFinancialYear_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        let findPlanDate = await db.budgetPlanDate.findOne({
            where: {
                financial_year_id: budgetFinancialYear_id,
                filter_fy: filter_fy,
                entity_id: entity_id,
                isDeleted: false
            }
        });

        if (!findPlanDate) {
            return res.status(404).json({ code: 404, message: "Budget Plan Not Found!" });
        }

        budgetFinancialYear_id = findPlanDate.id;

        let conditions = `
            WHERE BP.isDeleted = false
            AND BPA.approval_status = 'APPROVED'
            AND BP.budgetFinancialYear_id = :budgetFinancialYear_id
        `;

        if (entity_id) {
            conditions += ` AND BP.entity_id = :entity_id`;
        }

        let query = `
            SELECT 
                BPA.id,
                BPA.status AS approval_status,
                BPA.budgetPlanning_Id, 
                BPA.employee_id, 
                BPA.role_id, 
                BPA.approval_status,
                BP.total_Value, 
                BP.month, 
                MFY.financial_year,
                BP.status AS budget_status, 
                BP.budgetFinancialYear_id, 
                BP.entity_id, 
                MBC.budget_category AS budget_category_name
            FROM FINANCE_BUDGET_PLANNING BP
            INNER JOIN FINANCE_BUDGET_PLANNING_APPROVAL BPA ON BP.id = BPA.budgetPlanning_Id
            INNER JOIN MASTER_BUDGET_CATEGORY MBC ON BP.budgetCategory_id = MBC.id
            INNER JOIN FINANCE_BUDGET_PLAN_DATE FBPD ON FBPD.id = BP.budgetFinancialYear_id
            INNER JOIN MASTER_FINANCIAL_YEAR MFY ON MFY.id = FBPD.financial_year_id
            ${conditions}
            ORDER BY  
                CASE 
                    WHEN BPA.approval_status = 'DRAFT' THEN 0 
                    ELSE 1 
                END ASC,
                BP.createdAt ASC;
        `;

        const replacements = { budgetFinancialYear_id };
        if (entity_id) replacements.entity_id = entity_id;

        const data = await db.sequelize.query(query, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data.length > 0) {
            const result = data.reduce((acc, curr) => {
                let financialYearEntry = acc.find(entry => entry.financial_year_id === curr.budgetFinancialYear_id && entry.entity_id === curr.entity_id);
                if (!financialYearEntry) {
                    financialYearEntry = {
                        financial_year_id: curr.budgetFinancialYear_id,
                        financial_year: curr.financial_year,
                        operating_expense: 0,
                        entity_id: curr.entity_id,
                        budget_category: []
                    };
                    acc.push(financialYearEntry);
                }

                financialYearEntry.operating_expense += parseFloat(curr.total_Value);

                let budgetCategoryEntry = financialYearEntry.budget_category.find(category => category.budget_category === curr.budget_category_name);
                if (!budgetCategoryEntry) {
                    budgetCategoryEntry = {
                        budget_category: curr.budget_category_name,
                        month: {}
                    };
                    financialYearEntry.budget_category.push(budgetCategoryEntry);
                }

                let monthList = Array.isArray(curr.month) ? curr.month : [curr.month];
                monthList.forEach(month => {
                    let months = month.split(',').map(m => m.trim());
                    months.forEach(m => {
                        if (!budgetCategoryEntry.month[m]) {
                            budgetCategoryEntry.month[m] = 0;
                        }
                        budgetCategoryEntry.month[m] += parseFloat(curr.total_Value);
                    });
                });

                return acc;
            }, []);

            const allMonths = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            result.forEach(entry => {
                entry.budget_category.forEach(category => {
                    const monthObj = {};
                    allMonths.forEach(month => {
                        monthObj[month] = category.month[month] || 0;
                    });
                    category.month = monthObj;
                });

                entry.operating_expense = entry.budget_category.reduce((sum, category) => {
                    return sum + Object.values(category.month).reduce((mSum, value) => mSum + value, 0);
                }, 0);
            });

            return res.status(200).json({ code: 200, message: "Fetched Successfully", data: result });
        } else {
            return res.status(404).json({ code: 404, message: "Record Not Found", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Database query error: ", error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getall_variable_cost = async (req, res) => {
    try {
        let { entity_id, budgetFinancialYear_id, filter_fy } = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;
        budgetFinancialYear_id = budgetFinancialYear_id ? parseInt(budgetFinancialYear_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        const sqlQuery = `
            SELECT 
                BIFR.id as forcast_revenue_id,
                BIFR.forcast_month,
                BIFR.entity_id, 
                BIFR.financial_year_id,
                BIFRS.seal_volume,
                BIFRS.seal_amount,
                BIFRS.sealType_id,
                MFY.financial_year,
                MS.seal_type
            FROM 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE BIFR
            LEFT JOIN 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE_SEAL BIFRS 
            ON 
                BIFRS.forcast_revenue_id = BIFR.id
            LEFT JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = BIFR.entity_id
            LEFT JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = BIFR.financial_year_id
            INNER JOIN 
                MASTER_SEAL MS 
            ON 
                MS.id = BIFRS.sealType_id AND MS.seal_manual = false
            WHERE 
                BIFR.isDeleted = false 
                AND BIFR.status = 'ACTIVE'
                ${entity_id ? `AND BIFR.entity_id = :entity_id` : ''}
                ${budgetFinancialYear_id ? `AND BIFR.financial_year_id = :budgetFinancialYear_id` : ''}
                ${filter_fy ? `AND BIFR.filter_fy = :filter_fy` : ''}
            ORDER BY 
                BIFR.forcast_month ASC;
        `;

        const replacements = {};
        if (entity_id) replacements.entity_id = entity_id;
        if (budgetFinancialYear_id) replacements.budgetFinancialYear_id = budgetFinancialYear_id;
        if (filter_fy) replacements.filter_fy = filter_fy;

        const data = await db.sequelize.query(sqlQuery, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        if (data.length > 0) {
            const result = data.reduce((acc, curr) => {
                let yearData = acc.find(f => f.financial_year_id === curr.financial_year_id && f.entity_id === curr.entity_id);
                if (!yearData) {
                    yearData = {
                        financial_year_id: curr.financial_year_id,
                        financial_year: curr.financial_year,
                        total_Revenue: 0,
                        collection_fee: 0,
                        institutional_support_fee: 0,
                        concession_fee: 0,
                        consultation_fee: 0,
                        variable_cost_amount: 0,
                        gross_profit_loss: 0,
                        entity_id: curr.entity_id,
                        month: monthOrder.map(month => ({ forcast_month: month, seal_amount: 0 }))
                    };
                    acc.push(yearData);
                }

                if (curr.seal_amount) {
                    yearData.total_Revenue += parseFloat(curr.seal_amount) || 0;

                    let monthData = yearData.month.find(m => m.forcast_month === curr.forcast_month);
                    if (monthData) {
                        monthData.seal_amount += parseFloat(curr.seal_amount) || 0;
                    }
                }

                return acc;
            }, []);

            result.forEach(yearData => {
                yearData.total_Revenue = Math.round(yearData.total_Revenue);
                yearData.collection_fee = Math.round(0.04 * yearData.total_Revenue);
                yearData.institutional_support_fee = Math.round(0.10 * (yearData.total_Revenue - yearData.collection_fee));
                yearData.concession_fee = Math.round(0.05 * (yearData.total_Revenue - yearData.collection_fee));
                yearData.consultation_fee = Math.round(0.03 * (yearData.total_Revenue - yearData.collection_fee));
                yearData.variable_cost_amount = yearData.collection_fee + yearData.institutional_support_fee + yearData.concession_fee + yearData.consultation_fee;
                yearData.gross_profit_loss = yearData.total_Revenue - yearData.variable_cost_amount;
            });

            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: result });
        } else {
            const emptyResult = {
                financial_year_id: budgetFinancialYear_id || null,
                financial_year: budgetFinancialYear_id || null,
                total_Revenue: 0,
                collection_fee: 0,
                institutional_support_fee: 0,
                concession_fee: 0,
                consultation_fee: 0,
                variable_cost_amount: 0,
                gross_profit_loss: 0,
                entity_id: entity_id || null,
                month: monthOrder.map(month => ({ forcast_month: month, seal_amount: 0 }))
            };
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: [emptyResult] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.generate_income_statement = async (req, res) => {
    try {
        let { entity_id, budgetFinancialYear_id, filter_fy } = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;
        budgetFinancialYear_id = budgetFinancialYear_id ? parseInt(budgetFinancialYear_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        let result = await getall_total_revenue(entity_id, budgetFinancialYear_id, filter_fy);
        let result_operating = await getall_operating_expense(entity_id, budgetFinancialYear_id, filter_fy);
        let result_variable_cost = await getall_variable_cost(entity_id, budgetFinancialYear_id, filter_fy);

        let data = {
            total_revenue: (result && result.length > 0) ? result[0].total_Revenue : 0,
            operating_expense: (result_operating && result_operating.length > 0) ? result_operating[0].operating_expense : 0,
            variable_cost: (result_variable_cost && result_variable_cost.data && result_variable_cost.data.length > 0) ? result_variable_cost.data[0].variable_cost_amount : 0,
            gross_profit_loss: (result_variable_cost && result_variable_cost.data && result_variable_cost.data.length > 0) ? result_variable_cost.data[0].gross_profit_loss : 0,
            operating_profit_loss: 0,
            investment_income: 0,
            interest_paid_and_finance_charges: 0,
            depreciation_amortization: 0,
            net_income: 0,
            attribute_earning: 0,


        };
        data.ebitda = data.gross_profit_loss - data.operating_expense;


        return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.create_income_statement = async (req, res) => {
    try {
        let { income_type, total_revenue, operating_expense, variable_cost, ebitda, gross_profit_loss, depreciation_and_amortization, operating_profit_loss, investment_income, interest_paid_and_finance_charges, net_income_loss_before_tax, attributable_earning, remarks, financial_year_id, user_id, department_id, entity_id, filter_fy } = req.body;

        entity_id = parseInt(entity_id);

        let saveIncomeData = await db.income_statement.create({
            income_type, total_revenue, operating_expense, variable_cost, ebitda, gross_profit_loss, depreciation_and_amortization, operating_profit_loss, investment_income, interest_paid_and_finance_charges, net_income_loss_before_tax, attributable_earning, remarks, entity_id, financial_year_id, filter_fy, department_id, user_id,
        })


        const getData = await db.WorkFlow_Master.findOne({
            where: {
                department_id: department_id,
                job_name: "Income Statement",
                entity_id: entity_id,
                status: "ACTIVE"
            },
            attributes: ["id"]
        });

        if (!getData) {
            return res.status(400).send({
                code: 400,
                message: "Workflow is not created for required department and Generate Income!"
            });
        }

        const incomeStatementId = saveIncomeData.id;
        const dept_id = saveIncomeData.department_id;

        const getLevels = await db.Work_Flow_range.findAll({
            where: {
                workflow_id: getData.id,
                status: "ACTIVE"
            },
            attributes: ["level", "employee_id", "role_id", "workflow_id"]
        });

        const levelPromises = getLevels.map(async (level) => {
            const createdLevel = await db.income_statement_approval.create({
                level: level.level,
                employee_id: level.employee_id,
                workflow_id: level.workflow_id,
                income_statement_id: incomeStatementId,
                role_id: level.role_id,
                department_id: dept_id,
                login_id: user_id,
                filter_fy: filter_fy,
            });
            return createdLevel;
        });

        await Promise.all(levelPromises);

        return res.status(200).send({
            code: 200,
            message: 'Income Statement Generated Successfully',
            data: saveIncomeData
        });


    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getById_income_statement = async (req, res) => {
    try {
        const income_id = req.params.id;

        const incomeStatement = await db.income_statement.findOne({
            where: { id: parseInt(income_id) },
        });

        if (!incomeStatement) {
            return res.status(404).send({ code: 404, message: "Income Statement not found!" });
        }

        return res.status(200).send({
            code: 200,
            message: 'Income Statement Fetched Successfully',
            data: incomeStatement
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getall_income_statement = async (req, res) => {
    try {
        const { login_id, entity_id, user_role, filter_fy } = req.query;
        let income_details;
        if (user_role == 'Super Admin') {
            income_details = await db.sequelize.query(
                `SELECT FIS.*, FIS.entity_id, MFY.financial_year, FIS.user_id,
             MD.department_name, FIS.final_status
             FROM FINANCE_INCOME_STATEMENT AS FIS
             INNER JOIN ENTITY_MASTER AS EM ON EM.id = FIS.entity_id
             INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = FIS.financial_year_id
             INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = FIS.department_id
             WHERE FIS.entity_id = ${entity_id} AND FIS.filter_fy=${filter_fy} ORDER BY FIS.id DESC`,
                {
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
        } else {
            income_details = await db.sequelize.query(
                `SELECT FIS.*, FIS.entity_id, MFY.financial_year, FIS.user_id,
             MD.department_name, FIS.final_status
             FROM FINANCE_INCOME_STATEMENT AS FIS
             INNER JOIN ENTITY_MASTER AS EM ON EM.id = FIS.entity_id
             INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = FIS.financial_year_id
             INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = FIS.department_id
             WHERE FIS.user_id = ${login_id} AND FIS.entity_id = ${entity_id} AND FIS.filter_fy=${filter_fy}
             ORDER BY FIS.id DESC`,
                {
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
        }

        if (income_details.length > 0) {
            return res.status(200).send({ code: 200, message: "Income Details Fetched Successfully.", data: income_details });
        } else {
            return res.status(404).send({ code: 404, message: "No Income Details found for the given login_id and entity_id", data: [] });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.get_levels_to_be_approved_income = async (req, res) => {
    try {
        const { login_id, entity_id, filter_fy } = req.query;
        const query = `
        SELECT FISA.*,FIS.*,FIS.entity_id, MFY.financial_year, FIS.user_id,
             MD.department_name, FIS.final_status
        FROM FINANCE_INCOME_STATEMENT_APPROVAL AS FISA
        INNER JOIN FINANCE_INCOME_STATEMENT AS FIS ON FIS.id = FISA.income_statement_id
        INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = FIS.financial_year_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = FIS.department_id
        WHERE FISA.employee_id =${login_id} AND FIS.entity_id = ${entity_id} AND FIS.filter_fy=${filter_fy}
        AND FISA.status = 'ACTIVE' 
        AND FISA.approval_status = 'PENDING'
        AND NOT EXISTS (
            SELECT 1
            FROM FINANCE_INCOME_STATEMENT_APPROVAL AS prev
            WHERE prev.income_statement_id = FISA.income_statement_id 
              AND prev.level < FISA.level
              AND prev.approval_status != 'APPROVED'
          )
          `;

        const getAllData = await db.sequelize.query(query, {
            replacements: { employeeId: login_id },
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 404,
                message: "Fetch All Income Data Successfully",
                data: getAllData,
            });
        } else {
            return res.status(200).send({
                code: 404,
                message: "Record Not Found !",
                data: []

            });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
}


exports.get_approved_approval_income = async (req, res) => {
    try {
        const { login_id, entity_id, filter_fy } = req.query;

        // Define the SQL query with parameter placeholders
        const query = `
            SELECT 
                FISA.*, 
                FIS.*, 
                FIS.entity_id, 
                MFY.financial_year, 
                FIS.user_id,
                MD.department_name, 
                FIS.final_status
            FROM FINANCE_INCOME_STATEMENT_APPROVAL AS FISA
            INNER JOIN FINANCE_INCOME_STATEMENT AS FIS ON FIS.id = FISA.income_statement_id
            INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = FIS.financial_year_id
            INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = FIS.department_id
            WHERE FISA.employee_id = :login_id 
              AND FIS.entity_id = :entity_id 
              AND FIS.filter_fy = :filter_fy
              AND FISA.approval_status = 'APPROVED'
            ORDER BY FISA.id DESC
        `;

        // Execute the query with parameters
        const getAllData = await db.sequelize.query(query, {
            replacements: { login_id, entity_id, filter_fy },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Approved Approvals Successfully!",
                data: getAllData
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Approved Approvals Found for This Employee!"
            });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


exports.get_rejected_approval_income = async (req, res) => {
    try {
        const { login_id, entity_id, filter_fy } = req.query;

        // Define the SQL query with parameter placeholders
        const query = `
            SELECT 
                FISA.*, 
                FIS.*, 
                FIS.entity_id, 
                MFY.financial_year, 
                FIS.user_id,
                MD.department_name, 
                FIS.final_status
            FROM FINANCE_INCOME_STATEMENT_APPROVAL AS FISA
            INNER JOIN FINANCE_INCOME_STATEMENT AS FIS ON FIS.id = FISA.income_statement_id
            INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = FIS.financial_year_id
            INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = FIS.department_id
            WHERE FISA.employee_id = :login_id 
              AND FIS.entity_id = :entity_id 
              AND FIS.filter_fy = :filter_fy
              AND FISA.approval_status = 'REJECTED'
            ORDER BY FISA.id DESC
        `;

        // Execute the query with parameters
        const getAllData = await db.sequelize.query(query, {
            replacements: { login_id, entity_id, filter_fy },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Rejected Income Successfully!",
                data: getAllData
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Rejected Data Found for This Employee!"
            });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


exports.getall_income_Approval_level = async (req, res) => {
    try {
        const income_id = req.params.id;
        const { dep_id, employeeId } = req.body;

        const getData = await db.income_statement_approval.findAll({
            where: {
                income_statement_id: income_id,
            },
            attributes: ["approval_status", "level", "employee_id", "department_id", "remarks"],
        });

        if (!getData || getData.length === 0) {
            return res.status(400).send({ code: 400, message: "Data not found" });
        }

        if (dep_id && employeeId) {
            getData.employee_id = employeeId;
            getData.department_id = dep_id;
        }
        const levelsWithNames = [];
        for (const levelInfo of getData) {
            const employeeInfo = await db.user.findOne({
                where: {
                    employee_id: levelInfo.employee_id,
                },
                attributes: ["first_name", "last_name"],
            });

            if (!employeeInfo) {
                return res.status(400).send({
                    code: 400,
                    message: "User not found for level " + levelInfo.level,
                });
            }

            const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
            const levelWithName = {
                level: levelInfo.level,
                name: fullName,
                status: levelInfo.approval_status,
                remarks: levelInfo.remarks
            };
            levelsWithNames.push(levelWithName);
        }

        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully!",
            data: levelsWithNames,
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.income_approve_levels = async (req, res) => {
    try {
        const income_id = req.params.id;
        const { approval_status, progressStatus, employee_id, final_status, remarks } = req.body;

        const allLevelsData = await db.income_statement_approval.findAll({
            where: { employee_id, income_statement_id: income_id },
            order: [["level", "ASC"]],
        });
        if (!allLevelsData || allLevelsData.length === 0) {
            return res.status(404).send({
                code: 404,
                message: "No Level has been Assigned to this Employee!",
            });
        }
        const maxLevel = await db.income_statement_approval.max("level", {
            where: { income_statement_id: income_id },
        });
        const currentLevelData = await db.income_statement_approval.findOne({
            attributes: ["level"],
            where: { employee_id, income_statement_id: income_id },
        });
        const currentLevelValue = currentLevelData?.level;
        if (!currentLevelValue) {
            return res.status(404).send({
                code: 404,
                message: "Current level not found for the given employee",
            });
        }
        await db.income_statement_approval.update(
            { approval_status, progressStatus, remarks },
            { where: { employee_id, income_statement_id: income_id } }
        );
        if (approval_status === "REJECTED") {
            await db.Job_approval.update(
                { approval_status },
                { where: { income_statement_id: income_id, employee_id } }
            );
        }
        if (final_status === "REJECTED") {
            await db.income_statement.update(
                { final_status: "REJECTED" },
                { where: { id: income_id } }
            );
        }
        if (currentLevelValue === maxLevel) {
            await db.income_statement_approval.update(
                { final_status: approval_status },
                { where: { id: income_id } }
            );
            return res.status(200).send({
                code: 200,
                message: "Updated Successfully",
            });
        } else if (currentLevelValue === "REJECTED") {
            return res.status(200).send({
                code: 200,
                message: "Final Approval Rejected Successfully!",
            });
        }
        return res.status(200).send({
            code: 200,
            message: "Updated Successfully!",
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};










