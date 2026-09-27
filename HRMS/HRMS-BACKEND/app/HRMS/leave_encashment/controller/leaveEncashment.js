
const db = require("../../../models/index");
const { Op } = require('sequelize');

const logger = require('../../../../logger/index');
class leaveEncashment {
  

async create_Encashment(req, res) {
  try {
    const {
      id, 
      entity_id,
      financial_year_id,
      employee_ids,
      created_by,
      description,
      month,
      leave_type,
      is_taxable
    } = req.body;

    if (!financial_year_id || !employee_ids?.length || !description || !leave_type?.length) {
      return res.status(403).send({ code: 403, message: 'All fields Required!' });
    }

    const months = Array.isArray(month) ? month : [month];
    let request = [];

    for (const emp_id of employee_ids) {
      const emp_data = await db.user.findOne({ where: { employee_id: emp_id } });
      if (!emp_data) continue;

      for (const m of months) {
        const existing = await db.encashment.findOne({
          where: {
            employee_id: emp_id,
            financial_year_id,
            month: m,
            isDeleted: false
          }
        });

       
        if (id && existing && existing.id === Number(id)) {
          await db.encashment.update(
            {
              description,
              leaveId: leave_type.join(','), 
              month: m,
              is_taxable,
              updatedAt: new Date(),
              updated_by: created_by
            },
            { where: { id } }
          );

          return res.status(200).send({
            code: 200,
            message: 'Encashment Updated Successfully',
          });
        }

     
        if (existing && !id) {
          return res.status(409).send({
            code: 409,
            message: `Encashment already exists for Employee ${emp_id} for month ${m}`,
          });
        }

        
        if (!existing) {
          request.push({
            entity_id,
            financial_year_id,
            description,
            created_by,
            employee_id: emp_id,
            department_id: emp_data.department_id,
            month: m,
            leaveId: leave_type.join(','), 
            is_taxable,
            status: 'ACTIVE',
            isDeleted: false
          });
        }
      }
    }

    if (request.length > 0) {
      const response = await db.encashment.bulkCreate(request);
      return res.status(200).send({
        code: 200,
        message: 'Encashment Created Successfully',
        data: response
      });
    }

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || 'Internal Server Error' });
  }
}




async getAll_Encashment(req, res) {
  try {
    const { entity_id, employee_id, role } = req.query;
    if (!entity_id || !employee_id || !role) {
      return res.status(403).send({ code: 403, message: 'All fields are required' });
    }

    let base_query = `
      SELECT 
        GROUP_CONCAT(DISTINCT B.id) AS id,
        B.employee_id,
        F.financial_year,
        D.department_name,
        CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
        GROUP_CONCAT(DISTINCT B.leaveId) AS leaveIds,
        GROUP_CONCAT(DISTINCT LM.leave_name) AS leave_types,
        GROUP_CONCAT(DISTINCT CONCAT(U1.first_name, ' ', U1.last_name)) AS created_by,
        CASE B.month
          WHEN '1' THEN 'January'
          WHEN '2' THEN 'February'
          WHEN '3' THEN 'March'
          WHEN '4' THEN 'April'
          WHEN '5' THEN 'May'
          WHEN '6' THEN 'June'
          WHEN '7' THEN 'July'
          WHEN '8' THEN 'August'
          WHEN '9' THEN 'September'
          WHEN '10' THEN 'October'
          WHEN '11' THEN 'November'
          WHEN '12' THEN 'December'
          ELSE 'Invalid Month'
        END AS month_name
      FROM PAYROLL_LEAVE_ENCASHMENT AS B
      LEFT JOIN HRMS_LEAVE_MASTER AS LM ON FIND_IN_SET(LM.id, B.leaveId)
      INNER JOIN MASTER_DEPARTMENT AS D ON D.dept_id = B.department_id
      INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = B.employee_id
      INNER JOIN HRMS_REGISTERED_USER AS U1 ON U1.employee_id = B.created_by
      INNER JOIN MASTER_FINANCIAL_YEAR AS F ON F.id = B.financial_year_id
      WHERE B.isDeleted = false
        AND LM.entity_id = ${entity_id}
    `;

    if (role != 'Super Admin') {
      base_query += ` AND B.created_by = ${employee_id}`;
    }

    base_query += `
      GROUP BY B.employee_id, B.month, F.financial_year, D.department_name, U.first_name, U.last_name
      ORDER BY B.employee_id, B.month
    `;

    let [response] = await db.sequelize.query(base_query);

    return res.status(200).send({
      code: 200,
      message: 'Fetched Successfully',
      data: response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
}






async getEncashmentById(req, res) {
  try {
    const { bonus_id } = req.query;
    if (!bonus_id) {
      return res.status(403).send({ code: 403, message: 'Bonus id is required' });
    }

    let base_query = `
      SELECT 
        B.id,
        B.employee_id,
        B.month,
        B.description,
        B.status,
        B.isDeleted,
        B.createdAt,
        B.updatedAt,
        B.created_by,
        B.department_id,
        B.financial_year_id,
        B.is_taxable,
        B.leaveId,
        F.financial_year,
        D.department_name,
        CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
        GROUP_CONCAT(DISTINCT LM.leave_name) AS leave_types,
        CONCAT(U1.first_name, ' ', U1.last_name) AS created_BY,
        CASE B.month
          WHEN '1' THEN 'January'
          WHEN '2' THEN 'February'
          WHEN '3' THEN 'March'
          WHEN '4' THEN 'April'
          WHEN '5' THEN 'May'
          WHEN '6' THEN 'June'
          WHEN '7' THEN 'July'
          WHEN '8' THEN 'August'
          WHEN '9' THEN 'September'
          WHEN '10' THEN 'October'
          WHEN '11' THEN 'November'
          WHEN '12' THEN 'December'
          ELSE 'Invalid Month'
        END AS month_name
      FROM PAYROLL_LEAVE_ENCASHMENT AS B
      LEFT JOIN HRMS_LEAVE_MASTER AS LM ON FIND_IN_SET(LM.id, B.leaveId)
      INNER JOIN MASTER_DEPARTMENT AS D ON D.dept_id = B.department_id
      INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = B.employee_id
      INNER JOIN HRMS_REGISTERED_USER AS U1 ON U1.employee_id = B.created_by
      INNER JOIN MASTER_FINANCIAL_YEAR AS F ON F.id = B.financial_year_id
      WHERE B.id = ${bonus_id}
      GROUP BY B.id
    `;

    let [response] = await db.sequelize.query(base_query);

    return res.status(200).send({
      code: 200,
      message: 'Fetched Successfully',
      data: response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
}



  async deleteEncashmentById(req, res) {
    try {
      const bonus_id = req.params.id
      const dltStage = await db.encashment.findOne({ where: { id: bonus_id } });
      if (dltStage) {
        const deleteData = await db.encashment.update({ isDeleted: true }, { where: { id: bonus_id } });
        return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
      } else {
        return res.status(404).send({ code: 404, message: "Record Not Found" });
      }
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      return res.status(500).send({ code: 500, message: "Server Error" });
    };
  }

  async getEncashmentEmployeesById(req, res) {
    try {
      const departmentIdString = req.params.id;
      const departmentIds = departmentIdString.split(',').map(id => parseInt(id.trim(), 10));

      const employees = await db.user.findAll({
        where: {
          department_id: {
            [Op.in]: departmentIds
          },
          isDeleted: false,
          status: 'ACTIVE'
        },
        attributes: [
          'employee_id',
          'title',
          'first_name',
          'middle_name',
          'last_name',
          'gender',
          'emp_personal_email'
        ]
      });

      if (employees.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "All employee KPA fetched successfully!",
          data: employees
        });
      } else {
        return res.status(201).send({
          code: 201,
          message: "No employee found!"
        });
      }

    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error"
      });
    }
  }


async getEncashLeave(req, res) {
  try {
    const [result] = await db.sequelize.query(`
      SELECT M.leave_name,M.id
      FROM HRMS_LEAVE_POLICY_ENTITLEMENT AS PE
      LEFT JOIN HRMS_LEAVE_MASTER AS M ON M.id = PE.leaveId
      WHERE PE.is_encash = 1 AND M.entity_id=${req.query.entity_id}
    `);

    return res.status(200).send({
      message: "Leave entitlement fetched successfully",
      data: result
    });

  } catch (error) {
    return res.status(500).send({
      message: "Error in fetching leave entitlement",
      data: { error: error.message }
    });
  }
}


}


module.exports = new leaveEncashment();