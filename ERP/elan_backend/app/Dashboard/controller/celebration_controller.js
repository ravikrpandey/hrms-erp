const db = require("../../models/index");
const user_entity = db.user_entity;
const logger = require('../../../logger/index');

//////////////////////////////// Get all user profile ///////////////////////////////////

exports.getAllUserProfile = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const userDetails = 
    `SELECT 
    first_name, middle_name, last_name, employee_photo, date_of_birth, start_working_date, employee_id, designation_name,
    GROUP_CONCAT(DISTINCT event_type ORDER BY event_type SEPARATOR ', ') AS event_type
FROM (
    SELECT 
        u.first_name, u.middle_name, u.last_name, u.employee_photo, u.date_of_birth, u.start_working_date, u.employee_id, d.designation_name,
        ' Happy Birthday' AS event_type
    FROM HRMS_REGISTERED_USER AS u
    INNER JOIN HRMS_REGISTERED_USERS_ENTITY AS ue ON ue.employee_id = u.employee_id
    INNER JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
    WHERE ue.entity_id = ${entity_id}
      AND u.status = 'Active'
      AND MONTH(u.date_of_birth) = MONTH(CURDATE()) 
      AND DAY(u.date_of_birth) = DAY(CURDATE())
    UNION ALL
    SELECT 
        u.first_name, u.middle_name, u.last_name, u.employee_photo, u.date_of_birth, u.start_working_date, u.employee_id, d.designation_name,
        'Happy Work Anniversary' AS event_type
    FROM HRMS_REGISTERED_USER AS u
    INNER JOIN HRMS_REGISTERED_USERS_ENTITY AS ue ON ue.employee_id = u.employee_id
    INNER JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
    WHERE ue.entity_id = ${entity_id}
      AND u.status = 'Active'
      AND MONTH(u.start_working_date) = MONTH(CURDATE()) 
      AND DAY(u.start_working_date) = DAY(CURDATE())
) AS combined_events
GROUP BY first_name, middle_name, last_name, employee_photo, date_of_birth, start_working_date, employee_id, designation_name
ORDER BY last_name ASC, first_name ASC`;

    const get_employee_Data = await db.sequelize.query(userDetails, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (get_employee_Data) {
      get_employee_Data.sort((a, b) => {
        return b.employee_id - a.employee_id;
      });
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All User Profile Successfully!!",
          data: get_employee_Data,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};