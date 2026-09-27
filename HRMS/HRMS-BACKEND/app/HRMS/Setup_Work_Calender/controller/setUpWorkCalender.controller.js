const db = require("../../../models/index");
const { sequelize } = require("../../../models/index");

//============= create createSetupWorkCalendder ==========================//

exports.createSetupWorkCalender = async (req, res) => {
  try {
    const {
      financial_year_id,
      entity_id,
      createdBy,
      month_name,
      weekDetails,
      dept_id,
      employee_id,
    } = req.body;

    const existingEntries = await db.setup_work_calender.findAll({
      where: {
        financial_year_id: financial_year_id,
        entity_id: entity_id,
        dept_id: dept_id
      },
    });

    if (existingEntries && existingEntries.length > 0) {
      for (let entry of existingEntries) {
        await db.setup_work_calender.destroy({
          where: {
            financial_year_id: entry.financial_year_id,
            entity_id: entry.entity_id,
            dept_id:entry.dept_id
          },
        });
      }
    }
    let employeeIdsArray = [];
    try {
      if (typeof employee_id === "string") {
        employee_id = employee_id.trim(); 
        if (employee_id.startsWith("[") && employee_id.endsWith("]")) {
          employeeIdsArray = JSON.parse(employee_id); 
        } else {
          throw new Error(
            "Invalid format: employee_id should be a JSON array string"
          );
        }
      } else if (Array.isArray(employee_id)) {
        employeeIdsArray = employee_id; 
      } else {
        throw new Error(
          "Invalid type: employee_id should be a string or array"
        );
      }
    } catch (error) {
      console.error("Error parsing employee_id:", error.message);
      employeeIdsArray = []; 
    }
    console.log("Parsed Employee IDs:", employeeIdsArray); 
    let createweekentries = [];
    for (let week of weekDetails) {
      for (let emp of employeeIdsArray) {
        const newEntry = await db.setup_work_calender.create({
          financial_year_id: financial_year_id,
          entity_id: entity_id,
          createdBy: createdBy,
          month_name: month_name,
          dept_id: dept_id,
          employee_id: emp, 
          week_name: week.week_name,
          check_week: week.check_week,
          week_1st: week.week_1st,
          week_2nd: week.week_2nd,
          week_3rd: week.week_3rd,
          week_4th: week.week_4th,
          week_5th: week.week_5th,
        });
        createweekentries.push(newEntry);
      }
    }

    return res.status(200).send({
      code: 200,
      message: "Setup work calendar is created successfully",
      data: createweekentries,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).send({ message: error.message, data: { error } });
  }
};

//============= getAll SetupWorkCalendder ==========================//

exports.getAllSetupWorkCalender = async (req, res) => {
  try {
    const { financial_year_id, entity_id } = req.params;
    const query = `
            SELECT * 
        FROM SETUP_WORK_CALENDERS 
        WHERE financial_year_id = :financial_year_id
        AND entity_id = :entity_id
        AND isDeleted = false;

    `;
    const findData = await sequelize.query(query, {
      replacements: { financial_year_id, entity_id },
      type: sequelize.QueryTypes.SELECT,
    });

    const secondQuery = `
      SELECT 
      dept_id,
      GROUP_CONCAT(DISTINCT employee_id ORDER BY employee_id ASC) AS employee_ids
      FROM SETUP_WORK_CALENDERS
      GROUP BY dept_id;
    `;
    const [departmentResults] = await sequelize.query(secondQuery);
    console.log(departmentResults);

    // Safely process departmentResults with null check on employee_ids
    const deptData = departmentResults.map(department => {
      return {
        dept_id: department.dept_id,
        employee_ids: department.employee_ids && department.employee_ids.trim() !== '' 
          ? department.employee_ids.split(',').map(id => parseInt(id, 10)) 
          : []
      };
    });

    const seen = new Set();
    const uniqueResult = findData.filter((item) => {
      const uniqueKey = `${item.week_name}-${item.dept_id}`;
      if (seen.has(uniqueKey)) {
        return false;
      } else {
        seen.add(uniqueKey);
        return true;
      }
    });


    const finalData = uniqueResult.map(item => {
      const deptEmployees = deptData.find(dept => dept.dept_id === item.dept_id);
      return {
        ...item,
        employee_ids: deptEmployees ? deptEmployees.employee_ids : []
      };
    });

    console.log(finalData);
    return res.status(200).send({
      code: "SetupWorkCalender is fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).send({
      message: "Internal Server Error", 
      error: error.message
    });
  }
};



exports.getAllSetupWorkcalendarByid = async (req, res) => {
  try {
    const { dept_id, entity_id } = req.params;

    // Fix the query by adding the correct condition for entity_id
    const query = `
      SELECT * FROM SETUP_WORK_CALENDERS 
      WHERE dept_id = :dept_id AND entity_id = :entity_id AND isDeleted = false;
    `;

    const findData = await sequelize.query(query, {
      replacements: { dept_id, entity_id }, // Pass both dept_id and entity_id to replacements
      type: sequelize.QueryTypes.SELECT,
    });

    const secondQuery = `
      SELECT 
      dept_id,
      GROUP_CONCAT(DISTINCT employee_id ORDER BY employee_id ASC) AS employee_ids
      FROM SETUP_WORK_CALENDERS
      WHERE dept_id = :dept_id
      GROUP BY dept_id;
    `;

    // Fetch department results correctly
    const departmentResults = await sequelize.query(secondQuery, {
      replacements: { dept_id },
      type: sequelize.QueryTypes.SELECT,
    });

    console.log("Department Results:", departmentResults);

    // Ensure departmentResults is an array before calling map()
    const deptData = Array.isArray(departmentResults)
      ? departmentResults.map(department => ({
          dept_id: department.dept_id,
          employee_ids: department.employee_ids 
            ? department.employee_ids.split(',').map(id => parseInt(id, 10)) 
            : []
        }))
      : [];

    const seen = new Set();
    const uniqueResult = findData.filter((item) => {
      const uniqueKey = `${item.week_name}-${item.dept_id}`;
      if (seen.has(uniqueKey)) {
        return false;
      } else {
        seen.add(uniqueKey);
        return true;
      }
    });

    const finalData = uniqueResult.map(item => {
      const deptEmployees = deptData.find(dept => dept.dept_id === item.dept_id);
      return {
        ...item,
        employee_ids: deptEmployees ? deptEmployees.employee_ids : []
      };
    });

    console.log("Final Data:", finalData);
    return res.status(200).send({
      code: "SetupWorkCalender is fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
