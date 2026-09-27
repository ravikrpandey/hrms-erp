const createProposal = require('../../../CRM/CreateProposal/model/createProposal');
const db = require('../../../models/index');
const userDetails = db.user;
const financialYear = db.MASTER_FINANCIAL_YEAR;
const { Op, where } = require("sequelize");
const sequelize = require("sequelize");


module.exports.salesDashboard = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const { fromMonth, toMonth, financial_id } = req.body;

        if (!entity_id || !fromMonth || !toMonth || !financial_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id, fromMonth, toMonth, financial_id are required'
            });
        }
        const fromMonthInt = parseInt(fromMonth, 10);
        const toMonthInt = parseInt(toMonth, 10);

        if (isNaN(fromMonthInt) || isNaN(toMonthInt)) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid month format. Please provide valid integers for fromMonth and toMonth'
            });
        }

        if (fromMonthInt < 1 || fromMonthInt > 12 || toMonthInt < 1 || toMonthInt > 12) {
            return res.status(400).send({
                code: 400,
                message: 'Months should be between 1 and 12'
            });
        }

        if (fromMonthInt > toMonthInt) {
            return res.status(400).send({
                code: 400,
                message: 'fromMonth cannot be greater than toMonth'
            });
        }

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: {
                id: financial_id
            }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }
        const monthFilter = [
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.gte]: fromMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.lte]: toMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.eq]: financialYear.financial_year } 
            ),
        ];

        const totalOrders = await db.dealClose.findAll({
            where: {
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalOrders.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No orders found for the specified months and financial year'
            });
        }

        const proposalIds = totalOrders.map(data => data.proposal_id);

        if (proposalIds.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No proposalIds available for these months and year'
            });
        }

        const totalGrant = await db.proposalData.sum('grant_total', {
            where: {
                entity_id:entity_id,
                id: proposalIds
            }
        });

        const averageDealSize =totalGrant/totalOrders.length


        res.status(200).send({
            message: "Total orders and total grant fetched successfully",
            data: {
                totalOrders: totalOrders.length,
                totalGrant: totalGrant ? totalGrant.toFixed(2) : '0.00', 
                averageDealSize:averageDealSize.toFixed(2)
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};

exports.getRevenueTrends = async (req, res) => {
    try {
        const { entity_id, financial_id } = req.params;
        const financialYear = await db.financial_year.findByPk(financial_id);
        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const startDate = new Date(financialYear.financial_year, 0, 1); 
        const endDate = new Date(financialYear.financial_year, 11, 31, 23, 59, 59, 999);

     
        const revenueTrends = Array(12).fill(0); 
        const totalOrders = await db.dealClose.findAll({
            where: {
                createdAt: {
                    [db.Sequelize.Op.gte]: startDate,
                    [db.Sequelize.Op.lte]: endDate
                }
            }
        });

        if (totalOrders.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No orders found for the specified financial year'
            });
        }

        const proposalIds = totalOrders.map(data => data.proposal_id);

        if (proposalIds.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No proposalIds available for the given orders'
            });
        }
        const revenueData = await db.proposalData.findAll({
            attributes: [
                [db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), 'month'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('grant_total')), 'total_revenue']
            ],
            where: {
                entity_id,
                id: proposalIds,
                createdAt: {
                    [db.Sequelize.Op.gte]: startDate,
                    [db.Sequelize.Op.lte]: endDate
                }
            },
            group: [db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt'))]
        });

        revenueData.forEach(item => {
            const month = item.get('month') - 1;
            revenueTrends[month] = parseFloat(item.get('total_revenue')) || 0;
        });

        const formattedRevenueTrends = revenueTrends.map((revenue, index) => ({
            month_id: index + 1, 
            total_revenue: revenue.toFixed(2)
        }));

        return res.status(200).send({
            code: 200,
            message: 'Revenue trends fetched successfully',
            data: formattedRevenueTrends
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};
module.exports.getTotalSalesEmployeeWise = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const { fromMonth, toMonth, financial_id } = req.body;

        if (!entity_id || !fromMonth || !toMonth || !financial_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id, fromMonth, toMonth, financial_id are required'
            });
        }

        const fromMonthInt = parseInt(fromMonth, 10);
        const toMonthInt = parseInt(toMonth, 10);

        if (isNaN(fromMonthInt) || isNaN(toMonthInt)) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid month format. Please provide valid integers for fromMonth and toMonth'
            });
        }

        if (fromMonthInt < 1 || fromMonthInt > 12 || toMonthInt < 1 || toMonthInt > 12) {
            return res.status(400).send({
                code: 400,
                message: 'Months should be between 1 and 12'
            });
        }

        if (fromMonthInt > toMonthInt) {
            return res.status(400).send({
                code: 400,
                message: 'fromMonth cannot be greater than toMonth'
            });
        }

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: {
                id: financial_id
            }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const monthFilter = [
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.gte]: fromMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.lte]: toMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.eq]: financialYear.financial_year }
            ),
        ];

        const totalOrders = await db.dealClose.findAll({
            where: {
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalOrders.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No orders found for the specified months and financial year'
            });
        }

        const proposalIds = totalOrders.map(data => data.proposal_id);

        if (proposalIds.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No proposalIds available for these months and year'
            });
        }
        
        const totalGrantPerEmployee = await db.sequelize.query(
            `SELECT 
                pd.employee_id,
                ru.first_name,
                ROUND(SUM(pd.grant_total), 2) AS totalGrant
            FROM 
                CRM_CREATE_PROPOSAL_MST pd
            INNER JOIN 
                HRMS_REGISTERED_USER ru ON pd.employee_id = ru.employee_id
            WHERE 
                pd.entity_id = :entity_id
                AND pd.id IN (:proposalIds)
            GROUP BY 
                pd.employee_id, ru.first_name
            HAVING 
                SUM(pd.grant_total) > 0;`,
            {
                replacements: { entity_id: entity_id, proposalIds: proposalIds },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        

        if (totalGrantPerEmployee.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No sales data found for employees'
            });
        }
        res.status(200).send({
            message: "Total sales per employee fetched successfully",
            data: totalGrantPerEmployee
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};


module.exports.getTotalSalesProductWise = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const { fromMonth, toMonth, financial_id } = req.body;

        if (!entity_id || !fromMonth || !toMonth || !financial_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id, fromMonth, toMonth, financial_id are required'
            });
        }

        const fromMonthInt = parseInt(fromMonth, 10);
        const toMonthInt = parseInt(toMonth, 10);

        if (isNaN(fromMonthInt) || isNaN(toMonthInt)) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid month format. Please provide valid integers for fromMonth and toMonth'
            });
        }

        if (fromMonthInt < 1 || fromMonthInt > 12 || toMonthInt < 1 || toMonthInt > 12) {
            return res.status(400).send({
                code: 400,
                message: 'Months should be between 1 and 12'
            });
        }

        if (fromMonthInt > toMonthInt) {
            return res.status(400).send({
                code: 400,
                message: 'fromMonth cannot be greater than toMonth'
            });
        }

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: {
                id: financial_id
            }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const monthFilter = [
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.gte]: fromMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.lte]: toMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.eq]: financialYear.financial_year }
            ),
        ];

        const totalOrders = await db.dealClose.findAll({
            where: {
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalOrders.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No orders found for the specified months and financial year'
            });
        }

        const proposalIds = totalOrders.map(data => data.proposal_id);

        if (proposalIds.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No proposalIds available for these months and year'
            });
        }
        
        const totalGrantPerEmployee = await db.sequelize.query(
            `WITH TotalSales AS (
                SELECT 
                    SUM(lm.qty * lm.price_per_unit * (1 - COALESCE(lm.discount_approved, 0) / 100)) 
                    + SUM(lm.qty * lm.price_per_unit * 
                        CASE
                            WHEN lm.igst IS NOT NULL THEN lm.igst / 100
                            ELSE (COALESCE(lm.cgst, 0) + COALESCE(lm.sgst, 0)) / 100
                        END) AS total_sales_value
                FROM 
                    CRM_PROPOSAL_DEAL_CLOSE_MST pd
                INNER JOIN 
                    CRM_PROPOSAL_LIST_MST lm ON pd.proposal_id = lm.proposal_id
                WHERE 
                    pd.proposal_id IN (:proposalIds)
            )
            SELECT 
                mp.item_name AS product_name,
                SUM(lm.qty) AS total_qty,
                SUM(lm.qty * lm.price_per_unit) AS total_price,
                SUM(lm.qty * lm.price_per_unit * (1 - COALESCE(lm.discount_approved, 0) / 100)) AS total_discounted_price,
                SUM(
                    lm.qty * lm.price_per_unit * 
                    CASE
                        WHEN lm.igst IS NOT NULL THEN lm.igst / 100
                        ELSE (COALESCE(lm.cgst, 0) + COALESCE(lm.sgst, 0)) / 100
                    END
                ) AS total_tax,
                -- Calculate totalSales by accumulating the sales including the tax
                SUM(
                    lm.qty * lm.price_per_unit * (1 - COALESCE(lm.discount_approved, 0) / 100)
                ) + SUM(
                    lm.qty * lm.price_per_unit * 
                    CASE
                        WHEN lm.igst IS NOT NULL THEN lm.igst / 100
                        ELSE (COALESCE(lm.cgst, 0) + COALESCE(lm.sgst, 0)) / 100
                    END
                ) AS totalSales,
                
                -- Calculate sales percentage of each product based on the total sales across proposals and round it to 2 decimal places
                ROUND((
                    (SUM(lm.qty * lm.price_per_unit * (1 - COALESCE(lm.discount_approved, 0) / 100)) 
                    + SUM(lm.qty * lm.price_per_unit * 
                        CASE
                            WHEN lm.igst IS NOT NULL THEN lm.igst / 100
                            ELSE (COALESCE(lm.cgst, 0) + COALESCE(lm.sgst, 0)) / 100
                        END)
                    ) 
                    / ts.total_sales_value
                ) * 100, 2) AS sales_percentage
        
            FROM 
                CRM_PROPOSAL_DEAL_CLOSE_MST pd
            INNER JOIN 
                CRM_PROPOSAL_LIST_MST lm ON pd.proposal_id = lm.proposal_id
            INNER JOIN 
                MASTER_ITEM mp ON lm.product_master_id = mp.id
            CROSS JOIN 
                TotalSales ts  -- This allows us to reference the total sales value across all products
            WHERE 
                pd.proposal_id IN (:proposalIds)
            GROUP BY 
                mp.product_name, lm.product_master_id, ts.total_sales_value;
            `,
            {
                replacements: { entity_id: entity_id, proposalIds: proposalIds },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        
         if (totalGrantPerEmployee.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No sales data found for employees'
            });
        }
        res.status(200).send({
            message: "Total sales per employee fetched successfully",
            data: totalGrantPerEmployee
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};


module.exports.getSalesTrends =async(req,res) =>{
    try{
        const{entity_id} =req.params
      
        const totalSalesTrends = await db.sequelize.query(
            `WITH SalesData AS (
    -- Calculate the total sales for the current month and previous month
    SELECT 
        -- Calculate total sales for the current month
        ROUND(SUM(CASE 
                WHEN MONTH(pm.createdAt) = MONTH(CURRENT_DATE) 
                     AND YEAR(pm.createdAt) = YEAR(CURRENT_DATE) 
                THEN pm.grant_total 
                ELSE 0 
            END), 2) AS current_month_sales,
        
        -- Calculate total sales for the previous month
        ROUND(SUM(CASE 
                WHEN MONTH(pm.createdAt) = MONTH(CURRENT_DATE) - 1 
                     AND YEAR(pm.createdAt) = YEAR(CURRENT_DATE) 
                THEN pm.grant_total
                -- Handle case when current month is January (previous month will be December of the previous year)
                WHEN MONTH(CURRENT_DATE) = 1 AND MONTH(pm.createdAt) = 12 
                     AND YEAR(pm.createdAt) = YEAR(CURRENT_DATE) - 1
                THEN pm.grant_total
                ELSE 0 
            END), 2) AS previous_month_sales
    FROM 
        CRM_PROPOSAL_DEAL_CLOSE_MST pd
    INNER JOIN 
        CRM_CREATE_PROPOSAL_MST pm ON pd.proposal_id = pm.id
    WHERE 
        pm.entity_id = :entity_id
)

SELECT 
    current_month_sales,
    previous_month_sales,
    -- Calculate the percentage change and round it to 2 decimal places
    ROUND(
        CASE 
            WHEN previous_month_sales = 0 THEN NULL  -- Avoid division by zero, return NULL if previous month's sales are zero
            ELSE ((current_month_sales - previous_month_sales) / previous_month_sales) * 100
        END, 2) AS sales_percentage_change
FROM 
    SalesData;

            `,
            {
                replacements: { entity_id: entity_id,},
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        
         if (totalSalesTrends.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No sales data found for employees'
            });
        }
        res.status(200).send({
            message: "Total sales trends  fetched successfully",
            data: totalSalesTrends
        });


     
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
}

module.exports.getSalesForecasting = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const { financial_id } = req.body;

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; 

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: { id: financial_id }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const previousYearSales = await db.sequelize.query(
            `
            SELECT 
                MONTH(pm.createdAt) AS month, 
                COALESCE(SUM(pm.grant_total), 0) AS grant_total
            FROM 
                CRM_PROPOSAL_DEAL_CLOSE_MST pd
            INNER JOIN 
                CRM_CREATE_PROPOSAL_MST pm ON pd.proposal_id = pm.id
            WHERE 
                pm.entity_id = :entity_id
                AND YEAR(pm.createdAt) = :previousYear
            GROUP BY 
                MONTH(pm.createdAt)
            ORDER BY 
                month
            `,
            {
                replacements: { entity_id: entity_id, previousYear: currentYear - 1 },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        const currentYearSales = await db.sequelize.query(
            `
            SELECT 
                MONTH(pm.createdAt) AS month, 
               ROUND( COALESCE(SUM(pm.grant_total), 0),2) AS grant_total
            FROM 
                CRM_PROPOSAL_DEAL_CLOSE_MST pd
            INNER JOIN 
                CRM_CREATE_PROPOSAL_MST pm ON pd.proposal_id = pm.id
            WHERE 
                pm.entity_id = :entity_id
                AND YEAR(pm.createdAt) = :currentYear
                AND MONTH(pm.createdAt) <= :currentMonth
            GROUP BY 
                MONTH(pm.createdAt)
            ORDER BY 
                month
            `,
            {
                replacements: { entity_id: entity_id, currentYear: currentYear, currentMonth: currentMonth },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        const allSalesData = [...previousYearSales, ...currentYearSales];

        const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
        const previousYearData = months.map(month => {
            const monthData = previousYearSales.find(item => item.month === month);
            return {
                month: month,
                grant_total: monthData ? parseFloat(monthData.grant_total).toFixed(2) : '0.00'
            };
        });
        const completedCurrentYearData = months.slice(0, currentMonth - 1).map(month => {
            const monthData = currentYearSales.find(item => item.month === month);
            return {
                month: month,
                grant_total: monthData ? parseFloat(monthData.grant_total).toFixed(2) : '0.00'
            };
        });

        const completeSalesData = [...previousYearData, ...completedCurrentYearData];

        const calculatePercentageChange = (previousValue, currentValue) => {
            if (previousValue === 0 && currentValue === 0) {
                return 0;
            }
            if (previousValue === 0) {
                return 100; 
            }
            return ((currentValue - previousValue) / previousValue) * 100;
        };

        const percentageChanges = [];
        for (let i = 1; i < completeSalesData.length; i++) {
            const previousValue = parseFloat(completeSalesData[i - 1].grant_total);
            const currentValue = parseFloat(completeSalesData[i].grant_total);
            percentageChanges.push(calculatePercentageChange(previousValue, currentValue));
        }

        const validPercentageChanges = percentageChanges.filter(change => !isNaN(change));
        const averagePercentageChange = validPercentageChanges.length > 0
            ? (validPercentageChanges.reduce((a, b) => a + b, 0) / validPercentageChanges.length).toFixed(2)
            : 0;

        let forecastedGrantTotal = 0;

        if (currentMonth === 1) {
            const decemberData = parseFloat(previousYearData[11].grant_total); // December of the previous year
            forecastedGrantTotal = decemberData + (decemberData * (averagePercentageChange / 100));
        } else {
            const lastMonthIndex = currentMonth - 2;
            const lastMonthData = completedCurrentYearData[lastMonthIndex] 
                ? parseFloat(completedCurrentYearData[lastMonthIndex].grant_total) 
                : 0;
        
            forecastedGrantTotal = lastMonthData + (lastMonthData * (averagePercentageChange / 100));
        }
        
        let forecastedMonthData = {
            month: currentMonth,
            forecasted_grant_total: forecastedGrantTotal.toFixed(2),
        };
        
        res.status(200).send({
            message: "Sales forecasting data fetched successfully",
            data: {
                previousYearSales: previousYearData,
                currentYearSales: currentYearSales,
                forecastedData: [forecastedMonthData],
                averageGrowthPercentage: averagePercentageChange,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};






