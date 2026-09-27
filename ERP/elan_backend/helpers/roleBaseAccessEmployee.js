const db = require("../app/models/index");
module.exports.getEmployee=async(empid)=>{
    // Assume empid is an array of manager IDs as strings

const [dataList] = await db.sequelize.query(`
  SELECT 
    GROUP_CONCAT(DISTINCT u.employee_id) AS loginIds
  FROM HRMS_REGISTERED_USER AS u
  WHERE u.reporting_manager_id IN (:empids)
    AND u.role_master_id = 2;
`, {
  replacements: { empids: empid },
  type: db.sequelize.QueryTypes.SELECT
});

// Combine empid + fetched employee IDs



return dataList;

}

