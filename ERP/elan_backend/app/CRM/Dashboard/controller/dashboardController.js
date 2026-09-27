const Sequelize = require('sequelize');
const db = require('../../../models/index')



exports.getDashboardCard = async (req, res) => {
    try {
        const { entity_id } = req.params;

      
        const ActiveLeadsCount = await db.createLead.count({
            where: { entity_id: entity_id, status: 1 },
        });
        const TotalLeadsCount = await db.createLead.count({
            where: { entity_id: entity_id },
        });
        const InProgressLeadsCount = await db.createLead.count({
            where: Sequelize.and(
                { entity_id: entity_id },
                Sequelize.where(
                    Sequelize.json('dynamic_fields.status'),
                    'Followup'
                )
            )
        });
        const contractCount = await db.createLead.count({
            where: Sequelize.and(
                { entity_id: entity_id },
                Sequelize.where(
                    Sequelize.json('dynamic_fields.status'),
                    'Deal Close'
                )
            )
        });

        const followupCountsQuery = `
            SELECT 
                SUM(CASE WHEN DATE(C.follow_up_date) = CURDATE() THEN 1 ELSE 0 END) AS todaysFollowUpCount,
                SUM(CASE WHEN C.follow_up_date < CURDATE() THEN 1 ELSE 0 END) AS missedFollowUpCount,
                SUM(CASE WHEN C.follow_up_date >CURDATE() THEN 1 ELSE 0 END) AS UpcomingFollowUpCount
            FROM 
                CRM_CREATE_LEAD_MST AS C
            WHERE 
                C.entity_id = :entity_id
            AND 
                JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != "Deal Close"
        `;

        const followupCounts = await db.sequelize.query(followupCountsQuery, { 
            replacements: { entity_id: entity_id }, 
            type: db.sequelize.QueryTypes.SELECT 
        });
        const { todaysFollowUpCount, missedFollowUpCount ,UpcomingFollowUpCount} = followupCounts[0];
        const conversionRate = TotalLeadsCount > 0 
        ? (contractCount / TotalLeadsCount) * 100 
        : 0;

        const data_list = {
            TotalLeadsCount: TotalLeadsCount,
            ActiveLeadsCount: ActiveLeadsCount,
            InProgressLeadsCount: InProgressLeadsCount,
            contractCount: contractCount,
            todaysFollowUpCount: todaysFollowUpCount || 0,
            missedFollowUpCount: missedFollowUpCount || 0,
            upcomingFollowUpCount: UpcomingFollowUpCount || 0,
            conversionRate: conversionRate.toFixed(1) 
        };

        return res.status(200).json({
            code: 200,
            message: "All Data Retrieved",
            data: data_list,
        });

    } catch (error) {
        console.error('Error retrieving dashboard:', error);
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message,
        });
    }
};

exports.getLeadSourceAnalysis = async (req, res) => {
    try {
        const { entity_id } = req.params;

        const leadData = await db.sequelize.query(
            `SELECT 
    ms.source_name,
    COUNT(c.id) AS total_leads,
    ROUND((COUNT(c.id) * 100.0 / (SELECT COUNT(*) FROM CRM_CREATE_LEAD_MST WHERE entity_id = :entity_id)), 1) AS lead_percentage
FROM 
    CRM_CREATE_LEAD_MST c
INNER JOIN 
    MASTER_SOURCE ms ON c.source_id = ms.id
WHERE 
    c.entity_id = :entity_id
GROUP BY 
    ms.source_name;
`,
            {
                replacements: { entity_id },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        res.status(200).send({
            code: 200,
            message: "Lead Source Percentage Fetched Successfully",
            data: leadData
        });
    } catch (error) {
        console.error('Error retrieving lead source analysis:', error);
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message,
        });
    }
}

exports.getDetailsForDashboard = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const userLeadsData = await db.sequelize.query(`
            SELECT 
                C.login_id,
                CONCAT(E.title, ' ', E.first_name, ' ', E.last_name) AS employee_name,
                COUNT(*) AS TotalLeadsCount,
                SUM(CASE WHEN C.status = 1 THEN 1 ELSE 0 END) AS ActiveLeadsCount,
                SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) = 'Followup' AND JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != 'Deal Close' THEN 1 ELSE 0 END) AS InProgressLeadsCount,
                SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) = 'Deal Close' THEN 1 ELSE 0 END) AS contractCount,
                SUM(CASE WHEN DATE(C.follow_up_date) = CURDATE() AND JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != 'Deal Close' THEN 1 ELSE 0 END) AS todaysFollowUpCount,
                SUM(CASE WHEN C.follow_up_date < CURDATE() AND JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != 'Deal Close' THEN 1 ELSE 0 END) AS missedFollowUpCount,
                SUM(CASE WHEN C.follow_up_date > CURDATE() AND JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != 'Deal Close' THEN 1 ELSE 0 END) AS upcomingFollowUpCount,
                IF(COUNT(*) > 0, 
                    ROUND((SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) = 'Deal Close' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1), 
                    0) AS conversionRate
            FROM 
                CRM_CREATE_LEAD_MST AS C
            LEFT JOIN 
                HRMS_REGISTERED_USER AS E ON C.login_id = E.employee_id
            WHERE 
                C.entity_id = :entity_id
            GROUP BY 
                C.login_id, employee_name
        `, { 
            replacements: { entity_id: entity_id }, 
            type: db.sequelize.QueryTypes.SELECT 
        });

        return res.status(200).json({
            code: 200,
            message: "All Data Retrieved",
            data: userLeadsData,
        });

    } catch (error) {
        console.error('Error retrieving dashboard:', error);
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message,
        });
    }
};


exports.getConversionRate = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const TotalLeadsCount = await db.createLead.count({
            where: { entity_id: entity_id },
        });

        const contractCount = await db.createLead.count({
            where: Sequelize.and(
                { entity_id: entity_id },
                Sequelize.where(
                    Sequelize.json('dynamic_fields.status'),
                    'Deal Close'
                )
            )
        });
        const conversionRate = TotalLeadsCount > 0 
        ? (contractCount / TotalLeadsCount) * 100 
        : 0;

        const data_list = {
            conversionRate: conversionRate.toFixed(2) 
        };

        return res.status(200).json({
            code: 200,
            message: "All Data Retrieved",
            data: data_list,
        });

    } catch (error) {
        console.error('Error retrieving dashboard:', error);
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message,
        });
    }
};










