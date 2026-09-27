const { where } = require('sequelize');
const db = require('../../../models/index')
const Allowance = db.allowance;


exports.create_Allowance = async (req, res) => {
    try {
        const { allowance_name, domestic_allowance, international_allowance, entity_id, financial_id, employee_id } = req.body;
        if (!allowance_name || allowance_name.trim().length === 0) {
            return res.status(400).send({ code: 400, message: "Allowance name is required and cannot be empty or contain only spaces" });
        }
        const existingAllowance = await Allowance.findOne({
            where: {
                allowance_name: allowance_name,
                entity_id: entity_id,
                financial_id: financial_id,
                isDeleted: false
            }
        });
        if (existingAllowance) {
            return res.status(403).send({ code: 403, message: "Allowance Already Exists" });
        } else {
            const newAllowance = await Allowance.create({
                allowance_name: allowance_name,
                domestic_allowance: domestic_allowance,
                international_allowance: international_allowance,
                entity_id:entity_id,
                financial_id: financial_id,
                employee_id: employee_id,
            });
            return res.status(200).send({ code: 200, message: "Allowance Created Successfully", data: newAllowance });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_Allowance = async (req, res) => {
    try {

        const getAllData = await Allowance.findAll({ where: { isDeleted: false } });

        if (getAllData.length > 0) {

            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {

            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {

        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.getActive_Allowance = async (req, res) => {
    try {

        const getAllData = await Allowance.findAll({ where: { isDeleted: false, status: 'ACTIVE' } });

        if (getAllData.length > 0) {

            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {

            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {

        console.log(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.Allowance_getById = async (req, res) => {
    try {
        const AllowanceId = req.params.id
        const allowance = await Allowance.findOne({ where: { id: AllowanceId, isDeleted: false } })
        if (!allowance) {
            return res.status(404).send({ code: 404, message: "Allowance not found" });
        }
        return res.status(200).send({ code: 200, message: "Success", data: allowance });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
}


exports.updateAllowanceById = async (req, res) => {
    try {

        const AllowanceId = req.params.id
        const { allowance_name, domestic_allowance, international_allowance, } = req.body

        const allowance = await Allowance.findOne({ where: { id: AllowanceId, isDeleted: false } })
        if (!allowance) {
            return res.status(404).send({ code: 404, message: "Allowance not Found" });
        } else {
            const allowances = await Allowance.findOne({
                where: { allowance_name: allowance_name,
                     id: { [db.Sequelize.Op.ne]: AllowanceId } ,
                     isDeleted:false
            }
            })
            if (allowances) {
                return res.status(409).send({ code: 409, message: "Allowance Already Exists" });
            } else {
                const allowance = await Allowance.update({
                    allowance_name,
                    domestic_allowance,
                    international_allowance,

                }, {
                    where: {
                        id: AllowanceId
                    }
                });

                return res.status(200).send({ code: 200, message: "Allowance updated successfully", data: allowance });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
}


exports.allowanceStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await Allowance.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await Allowance.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!"
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.deleteAllowanceById = async (req, res) => {
    try {
        const AllowanceId = req.params.id
        const dltStage = await Allowance.findOne({ where: { id: AllowanceId } });
        if (dltStage) {
            const deleteData = await Allowance.update({ isDeleted: true }, { where: { id: AllowanceId } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    };
};

/** Get all employee*/
exports.getEmployeebyEntityId = async (req, res) => {
    const entity_id = req.params.entity_id;
    try {
      const baseQuery = `
              SELECT
              ad.dept_id,
              ad.department_name,
              fc.employee_id,
              fc.first_name,
              fc.last_name,
              fc.employee_code,
              fc.designation_id,
              ea.job_type,
              ft.entity_name,
              ft.id AS entity_id
          FROM
              MASTER_DEPARTMENT AS ad
          INNER JOIN HRMS_REGISTERED_USER AS fc
              ON fc.department_id = ad.dept_id AND fc.isDeleted = false
          LEFT JOIN (
          SELECT *
          FROM ESS_ATTENDANCE_USERID ea1
          WHERE ea1.id = (
          SELECT MIN(ea2.id)
          FROM ESS_ATTENDANCE_USERID ea2
          WHERE ea1.employee_id = ea2.employee_id
          )
          ) AS ea
          ON fc.employee_id = ea.employee_id
          LEFT JOIN ENTITY_MASTER AS ft
              ON ad.entity_id = ft.id
          WHERE
              ad.entity_id = :entity_id
              AND ad.isDeleted = false;
          `;
      const getAllData = await db.sequelize.query(baseQuery, {
        replacements: { entity_id },
        type: db.sequelize.QueryTypes.SELECT,
      });
   
      if (getAllData.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Fetched All Data Successfully!",
          data: getAllData,
        });
      } else {
        return res.status(404).send({
          code: 404,
          message: "No Data Found!",
        });
      }
    } catch (error) {
      console.error("Error in getting data:", error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Server Error" });
    }
};

   
