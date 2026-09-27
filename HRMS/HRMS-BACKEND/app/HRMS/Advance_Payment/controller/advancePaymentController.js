const db = require("../../../models/index");
const { Op } = require("sequelize");
const logger = require("../../../../logger/index");

class AdvancePaymentController {
  /**
   * Create Advance Payment
   */
  async create_Advancepayment(req, res) {
    try {
      const {
        id,
        employee_id,
        department_id,
        amount,
        advanceFor,
        payroll_adjustment_type,
        allotment_type,
        month,
        financial_year_id,
        adjustments,
        status = "ACTIVE"
      } = req.body;

      if (id) {
        await db.payroll_loan_advance.update({
          employee_id,
          department_id,
          amount: Number(amount),
          payroll_adjustment_type,
          allotment_type,
          month,
          advance_for: advanceFor,
          financial_year_id,
          adjustments: JSON.stringify(adjustments),
          status
        }, { where: { id } });

        const updated = await db.payroll_loan_advance.findOne({ where: { id } });
        return res.status(200).send({
          code: 200,
          message: "One Time advance payment updated successfully",
        });
      }
      const advancePayment = await db.payroll_loan_advance.create({
        employee_id,
        department_id,
        amount: Number(amount),
        payroll_adjustment_type,
        allotment_type,
        month,
        advance_for: advanceFor,
        financial_year_id,
        adjustments: JSON.stringify(adjustments),
        status
      });

      return res.status(201).send({
        code: 201,
        message: "One Time advance payment created successfully",
      });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
  }

  /**
   * Get all Advance Payments
   */
  async getAll_Advancepayment(req, res) {
    try {
      const { entity_id, employee_id, role } = req.query;

      let whereConditions = ['A.isDeleted = 0'];
      let replacements = {};

      if (employee_id) {
        whereConditions.push('A.employee_id = :employee_id');
        replacements.employee_id = employee_id;
      }

      if (entity_id) {
        whereConditions.push('U.entity_id = :entity_id');
        replacements.entity_id = entity_id;
      }

      let query = `
      SELECT 
          A.id, 
          A.amount, 
          A.payroll_adjustment_type, 
          A.allotment_type, 
          A.adjustments,
          A.status,
          A.employee_id,
          A.advance_for,
          A.month,
          F.financial_year, 
          D.department_name,
          CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
          CASE 
              WHEN A.month = 1 THEN 'January'
              WHEN A.month = 2 THEN 'February'
              WHEN A.month = 3 THEN 'March'
              WHEN A.month = 4 THEN 'April'
              WHEN A.month = 5 THEN 'May'
              WHEN A.month = 6 THEN 'June'
              WHEN A.month = 7 THEN 'July'
              WHEN A.month = 8 THEN 'August'
              WHEN A.month = 9 THEN 'September'
              WHEN A.month = 10 THEN 'October'
              WHEN A.month = 11 THEN 'November'
              WHEN A.month = 12 THEN 'December'
              WHEN A.month IS NULL THEN 'Not Specified'
              ELSE 'Invalid Month'
          END AS month_name
      FROM PAYROLL_LOAN_ADVANCE A
      LEFT JOIN MASTER_FINANCIAL_YEAR F ON F.id = A.financial_year_id
      LEFT JOIN MASTER_DEPARTMENT D ON D.dept_id = A.department_id
      LEFT JOIN HRMS_REGISTERED_USER U ON U.employee_id = A.employee_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY A.id DESC
    `;

      let response = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: replacements
      });

      // Helper function to get month name for adjustments
      const getMonthName = (month) => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return month >= 1 && month <= 12 ? months[month - 1] : 'Not Specified';
      };

      const processedResponse = response.map(item => {
        // For "One Time" adjustment type
        if (item.payroll_adjustment_type === "One Time") {
          return {
            ...item,
            adjustments: [{
              year: item.financial_year_id,
              month: item.month,
              month_name: getMonthName(item.month),
              amount: item.amount
            }],
            total_adjustment_amount: parseFloat(item.amount || 0),
            adjustment_count: 1
          };
        }

        // For "Multiple Time" adjustment type
        if (item.payroll_adjustment_type === "Multiple Time") {
          let processedAdjustments = [];

          if (item.adjustments) {
            try {
              let adjData = typeof item.adjustments === 'string'
                ? JSON.parse(item.adjustments)
                : item.adjustments;

              if (Array.isArray(adjData)) {
                processedAdjustments = adjData.map(adj => ({
                  ...adj,
                  month_name: getMonthName(adj.month)
                }));
              }
            } catch (error) {
              console.error('Error parsing adjustments JSON:', error);
              processedAdjustments = [];
            }
          }

          return {
            ...item,
            adjustments: processedAdjustments,
            total_adjustment_amount: processedAdjustments.reduce(
              (sum, adj) => sum + parseFloat(adj.amount || 0),
              0
            ),
            adjustment_count: processedAdjustments.length
          };
        }

        // Default case for other types
        return {
          ...item,
          adjustments: [],
          total_adjustment_amount: 0,
          adjustment_count: 0
        };
      });

      return res.status(200).send({
        code: 200,
        message: "Fetched Successfully",
        data: processedResponse
      });

    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error"
      });
    }
  }

  /**
   * Get Advance Payment by ID
   */
  // inside advancepayment_controller.js
  async getAdvancepaymentById(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).send({
          code: 400,
          message: "Advance Payment ID is required"
        });
      }

      const query = `
      SELECT 
          A.id, 
          A.amount, 
          A.payroll_adjustment_type, 
          A.allotment_type, 
          A.adjustments,
          A.status,
          A.employee_id,
          A.advance_for,
          A.month,
          A.department_id,          
          A.financial_year_id,          
          F.financial_year, 
          D.department_name,
          CONCAT(U.first_name, ' ', U.last_name) AS employee_name,
          CASE 
              WHEN A.month = 1 THEN 'January'
              WHEN A.month = 2 THEN 'February'
              WHEN A.month = 3 THEN 'March'
              WHEN A.month = 4 THEN 'April'
              WHEN A.month = 5 THEN 'May'
              WHEN A.month = 6 THEN 'June'
              WHEN A.month = 7 THEN 'July'
              WHEN A.month = 8 THEN 'August'
              WHEN A.month = 9 THEN 'September'
              WHEN A.month = 10 THEN 'October'
              WHEN A.month = 11 THEN 'November'
              WHEN A.month = 12 THEN 'December'
              WHEN A.month IS NULL THEN 'Not Specified'
              ELSE 'Invalid Month'
          END AS month_name
      FROM PAYROLL_LOAN_ADVANCE A
      LEFT JOIN MASTER_FINANCIAL_YEAR F ON F.id = A.financial_year_id
      LEFT JOIN MASTER_DEPARTMENT D ON D.dept_id = A.department_id
      LEFT JOIN HRMS_REGISTERED_USER U ON U.employee_id = A.employee_id
      WHERE A.isDeleted = 0 AND A.id = :id
      LIMIT 1
    `;

      const [item] = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { id }
      });

      if (!item) {
        return res.status(404).send({
          code: 404,
          message: "Advance Payment not found"
        });
      }

      // Helper to get month name
      const getMonthName = (month) => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return month >= 1 && month <= 12 ? months[month - 1] : 'Not Specified';
      };

      let adjustments = [];

      // Parse adjustments from DB if type is One Time or Multiple Time
      if (
        item.payroll_adjustment_type === "One Time" ||
        item.payroll_adjustment_type === "Multiple Time"
      ) {
        if (item.adjustments) {
          try {
            const adjData = typeof item.adjustments === "string"
              ? JSON.parse(item.adjustments)
              : item.adjustments;

            if (Array.isArray(adjData)) {
              adjustments = adjData.map(adj => ({
                ...adj,
                month_name: getMonthName(adj.month)
              }));
            }
          } catch (error) {
            console.error("Error parsing adjustments JSON:", error);
          }
        }
      }

      // Return full parent data with parsed adjustments
      const responseData = {
        ...item,
        adjustments
      };

      return res.status(200).send({
        code: 200,
        message: "Fetched Successfully",
        data: responseData
      });

    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error"
      });
    }
  }



  /**
   * Soft Delete Advance Payment
   */
  async deleteAdvancepaymentById(req, res) {
    try {
      const { id } = req.params;

      // Check if record exists
      const existing = await db.payroll_loan_advance.findOne({
        where: { id, isDeleted: 0 }
      });

      if (!existing) {
        return res.status(404).send({
          code: 404,
          message: "Record Not Found"
        });
      }

      // Soft delete (set isDeleted = 1)
      await db.payroll_loan_advance.update(
        { isDeleted: 1 },
        { where: { id } }
      );

      return res.status(200).send({
        code: 200,
        message: "Advance Payment Deleted Successfully!"
      });

    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error("Error:", error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error"
      });
    }
  }

  /**
   * Get Employees by Department IDs
   */
  async getAdvancepaymentEmployeesById(req, res) {
    try {
      const departmentIdString = req.params.id;
      const departmentIds = departmentIdString.split(",").map(id => parseInt(id.trim(), 10));

      const employees = await db.user.findAll({
        where: {
          department_id: { [Op.in]: departmentIds },
          isDeleted: false,
          status: "ACTIVE"
        },
        attributes: ["employee_id", "title", "first_name", "middle_name", "last_name", "gender", "emp_personal_email"]
      });

      if (employees.length > 0) {
        return res.status(200).send({ code: 200, message: "Employees fetched successfully!", data: employees });
      } else {
        return res.status(201).send({ code: 201, message: "No employee found!" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
  }
}

module.exports = new AdvancePaymentController();
