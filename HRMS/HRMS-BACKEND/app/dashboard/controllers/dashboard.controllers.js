const db = require("../../models/index");
const crmCreateLeadMasterModels = db.createLead;
const { Op } = require('sequelize');

/////////////// Get All Dashboard Card Count ///////////////

exports.get_All_Dashboard_Card_Count = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
        const futureData = await crmCreateLeadMasterModels.findAll({
            where: {
                follow_up_date: {
                    [Op.gt]: endOfDay
                }
            }
        });
        const pastData = await crmCreateLeadMasterModels.findAll({
            where: {
                follow_up_date: {
                    [Op.lt]: startOfDay
                }
            }
        });
        const currentData = await crmCreateLeadMasterModels.findAll({
            where: {
                follow_up_date: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            }
        });
        const leadSummaryData = await crmCreateLeadMasterModels.findAll();
        const filterLeadSummary = leadSummaryData.filter(lead => lead.dynamic_fields.status !== "Prospect");

        const upcommingFollowUpCount = futureData.length;
        const missedFollowUpCount = pastData.length;
        const todayFollowUpCount = currentData.length;
        const leadSummaryCount = filterLeadSummary.length;

        return res.status(200).send({
            code: 200,
            message: "Fetch All Dashboard Card Counts Successfully!",
            data: {
                upcommingFollowUpCount,
                missedFollowUpCount,
                todayFollowUpCount,
                leadSummaryCount
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.globalSearch = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).send({ code: 400, message: 'Keyword is required' });
        }

        let query = `
  SELECT 
    mm.id,
    mm.menu_master_name AS name,
    CONCAT('/', rm.module_link, '/', mm.menu_master_link) AS path,
    'menu' AS type
  FROM MENU_MASTER mm
  JOIN ROLE_MODULE_MASTER rm ON rm.id = mm.role_module_master_id
  WHERE mm.menu_master_name LIKE '%${keyword}%'

  UNION

  SELECT 
    sm.id,
    sm.submenu_name AS name,
    CONCAT('/', rm.module_link, '/', mm.menu_master_link, '/', sm.submenu_link) AS path,
    'submenu' AS type
  FROM SUBMENU_MASTER sm
  JOIN MENU_MASTER mm ON mm.id = sm.menu_master_id
  JOIN ROLE_MODULE_MASTER rm ON rm.id = mm.role_module_master_id
  WHERE sm.submenu_name LIKE '%${keyword}%'

  UNION

  SELECT 
    rm.id,
    rm.module_name AS name,
    CONCAT('/', rm.module_link) AS path,
    'module' AS type
  FROM ROLE_MODULE_MASTER rm
  WHERE rm.module_name LIKE '%${keyword}%'`;

        const [results] = await db.sequelize.query(query);

        res.status(200).send({
            code: 200,
            message: "Search results fetched",
            data: results
        });

    } catch (error) {
        console.error('Global search error:', error);
        res.status(500).send({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
};
