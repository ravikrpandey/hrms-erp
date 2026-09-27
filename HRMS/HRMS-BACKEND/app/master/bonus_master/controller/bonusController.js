
const db = require("../../../models/index");
const { Op } = require('sequelize');

const logger = require('../../../../logger/index');
class bonusController {
  // async create_bonus(req, res) {
  //   try {
  //     const { bonus_id, entity_id, financial_year_id, employee_ids, created_by, amount, description, bonus_type, bonus_name, month, amount_type } = req.body;
  //     if (!financial_year_id || employee_ids.length == 0 || !amount || !description || !bonus_type || !bonus_name) {
  //       return res.status(403).send({ code: 403, message: 'All field Required!' })
  //     }
  //     let request = [];
  //     for (const item of employee_ids) {
  //       const emp_data = await db.user.findOne({
  //         where: {
  //           employee_id: item
  //         }
  //       });

  //       const bouns_master = await db.masterBonus.findOne({
  //         where: {
  //           employee_id: item,
  //           financial_year_id,
  //           month,
  //           bonus_type
  //         }
  //       })
  //       if (!bouns_master && emp_data) {
  //         request.push({
  //           entity_id,
  //           financial_year_id,
  //           amount,
  //           bonus_type,
  //           bonus_name,
  //           description,
  //           created_by,
  //           employee_id: item,
  //           department_id: emp_data.department_id,
  //           month,
  //           amount_type
  //         });
  //       }
  //     }

  //     if (request.length > 0) {
  //       let response;
  //       if (bonus_id) {
  //         response = await db.masterBonus.update(
  //           { financial_year_id, month, bonus_type, bonus_name, amount, description, amount_type },
  //           { where: { id: bonus_id } }
  //         );
  //       }
  //       else {
  //         response = await db.masterBonus.bulkCreate(request);
  //       }
  //       if (response) {
  //         let msg = bonus_id ? 'Bonus Updated Successfully' : 'Bonus Create Successfully'
  //         return res.status(200).send({ code: 200, message: msg, data: response })
  //       }
  //     }
  //     else {
  //       return res.status(404).send({ code: 404, message: 'Record Not found' })
  //     }
  //   }
  //   catch (error) {
  //     logger.error(`Error ${error.message}`, { error });
  //     console.log(error, "Error");
  //     return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  //   };
  // }
  async create_bonus(req, res) {
    try {
      const {
        bonus_id,
        entity_id,
        financial_year_id,
        employee_ids,
        created_by,
        amount,
        description,
        bonus_type,
        bonus_name,
        month,
        amount_type
      } = req.body;

      if (!financial_year_id || employee_ids.length == 0 || !amount || !description || !bonus_type || !bonus_name) {
        return res.status(403).send({ code: 403, message: 'All fields Required!' });
      }

      let request = [];
      let response;

      const months = Array.isArray(month) ? month : [month];

      for (const item of employee_ids) {
        const emp_data = await db.user.findOne({
          where: { employee_id: item }
        });

        // If emp_data exists and bonus_id is provided => UPDATE
        if (emp_data && bonus_id) {
          await db.masterBonus.destroy({ where: { id: bonus_id, employee_id: item, isDeleted: false } });
        }
        for (const m of months) {
          const bonus_master = await db.masterBonus.findOne({
            where: {
              employee_id: item,
              financial_year_id,
              month: m,
              bonus_type,
              isDeleted: false
            }
          });

          if (!bonus_master) {
            request.push({
              entity_id,
              financial_year_id,
              amount,
              bonus_type,
              bonus_name,
              description,
              created_by,
              employee_id: item,
              department_id: emp_data ? emp_data.department_id : null,
              month: m,
              amount_type,
              status: 'ACTIVE',
              isDeleted: false
            });
          }
        }
      }

      // Handle bulk insert if needed
      if (request.length > 0) {
        response = await db.masterBonus.bulkCreate(request);
      }

      if (response) {
        let msg = bonus_id ? 'Bonus Updated Successfully' : 'Bonus Created Successfully';
        return res.status(200).send({ code: 200, message: msg, data: response });
      } else {
        return res.status(404).send({ code: 404, message: 'Record Not Found' });
      }

    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error, "Error");
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
  }

  async getAll_Bonus(req, res) {
    try {
      const { entity_id, employee_id, role } = req.query;
      if (!entity_id || !employee_id || !role) {
        return res.status(403).send({ code: 403, message: 'All field is require' })
      }

      let base_query = `SELECT 
  B.id AS bonus_id,
  B.amount,
  F.financial_year,
  B.bonus_type,
  B.status,
  D.department_name, 
  CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
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
FROM PAYROLL_BONUS_DEDUCTION AS B 
INNER JOIN MASTER_DEPARTMENT AS D ON D.dept_id = B.department_id 
INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = B.employee_id 
INNER JOIN HRMS_REGISTERED_USER AS U1 ON U1.employee_id = B.created_by 
INNER JOIN MASTER_FINANCIAL_YEAR AS F ON F.id = B.financial_year_id
WHERE B.entity_id = ${entity_id} AND B.isDeleted = ${false}`;

      if (role != 'Super Admin') {
        base_query += ` AND B.created_by = ${employee_id}`;
      }
      let [response] = await db.sequelize.query(base_query);
      if (response) {
        return res.status(200).send({ code: 200, message: 'fetch Successfully', data: response })
      }
    }
    catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.log(error, "Error");
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
  }

  async getBonusById(req, res) {
    try {
      const { bonus_id } = req.query;
      if (!bonus_id) {
        return res.status(403).send({ code: 403, message: 'Bonus id is require' })
      }

      let base_query = `SELECT 
  B.*,
  F.financial_year,
  D.department_name, 
  CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
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
FROM PAYROLL_BONUS_DEDUCTION AS B 
INNER JOIN MASTER_DEPARTMENT AS D ON D.dept_id = B.department_id 
INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = B.employee_id 
INNER JOIN HRMS_REGISTERED_USER AS U1 ON U1.employee_id = B.created_by 
INNER JOIN MASTER_FINANCIAL_YEAR AS F ON F.id = B.financial_year_id
WHERE B.id = ${bonus_id}`;
      let [response] = await db.sequelize.query(base_query);
      if (response) {
        return res.status(200).send({ code: 200, message: 'fetch Successfully', data: response })
      }
    }
    catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.log(error, "Error");
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
  }

  async deleteBonusById(req, res) {
    try {
      const bonus_id = req.params.id
      const dltStage = await db.masterBonus.findOne({ where: { id: bonus_id } });
      if (dltStage) {
        const deleteData = await db.masterBonus.update({ isDeleted: true }, { where: { id: bonus_id } });
        return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
      } else {
        return res.status(404).send({ code: 404, message: "Record Not Found" });
      }
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      return res.status(500).send({ code: 500, message: "Server Error" });
    };
  }

  async getBonusEmployeesById(req, res) {
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
}




module.exports = new bonusController();