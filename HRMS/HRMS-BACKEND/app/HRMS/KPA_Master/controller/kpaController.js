const db = require('../../../models/index')
const KPA = db.kpa_master;
const KPAEMPLOYEE = db.kpa_employee;
 const { attribute } = require('@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js');



/** create KPA */


exports.createKpa = async (req, res) => {
    try {
        const { financial_id, entity_id,employee_id } = req.body.endpoints;
        const {
            objective_id, activity, aplicable_for, probation_employee, kpi_data, aplicable_department_id, employee_name
        } = req.body.body;

        
        const parsedEmployeeName = Array.isArray(employee_name) ? employee_name : [employee_name];

       
        const isExist = await KPA.findOne({
            where: {
                activity,
                entity_id,
                isDeleted: false
            }
        });

        if (isExist) {
            return res.status(400).send({ code: 400, message: "KPA Already Exists" });
        }

        
        const newKpa = await KPA.create({
            objective_id,
            activity,
            kpi_data,
            aplicable_for,
            probation_employee,
            entity_id,
            financial_year_id: financial_id,
            employee_id
        });
        
        if (aplicable_for === "Selected_User") {
            const updatedEmployeeArray = parsedEmployeeName.map(emp => ({
                kpa_master_id: newKpa.id,
                employee_id: emp,
                applicable_department_id: aplicable_department_id,
                isDeleted: false 
            }));
            await KPAEMPLOYEE.bulkCreate(updatedEmployeeArray);
        }

        return res.status(200).send({ code: 200, message: "KPA Created Successfully", data: newKpa });
    } catch (error) {
         console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};





/** get All KPA */

exports.getallKpa = async (req, res) => {
    const entity_id = req.params.id;
    const financial_year_id = req.query.financial_id;
    try {
        const query = `
        SELECT K.id,K.activity,KO.objective_name,K.kpi_data,K.status,K.aplicable_for,F.financial_year,K.probation_employee
            FROM HRMS_KPA_MASTER AS K
            LEFT JOIN MASTER_FINANCIAL_YEAR AS F ON K.financial_year_id = F.id
            LEFT JOIN HRMS_KPA_OBJECTIVE AS KO ON K.objective_id = KO.id
            WHERE K.entity_id = ${entity_id} AND K.financial_year_id=${financial_year_id} AND K.isDeleted = false
        `;

        
        const kpa = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (kpa.length > 0) {
            return res.status(200).send({ code: 200, message: "All KPA Patch Successfully!", data: kpa });
        } else {
            return res.status(404).send({ code: 404, message: "No KPA Found" });
        }
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
}


/** get KPA by id */
exports.getKpaById = async (req, res) => {
    try {
        let id = req.params.id;

        const kpa = await KPA.findOne({ where: { id: id, isDeleted: false } });
        const kpaemp = await KPAEMPLOYEE.findAll({ 
            where: { kpa_master_id: id, isDeleted: false },
         });
        if (kpa) {
            return res.status(200).send({ code: 200, message: "KPA retrieved successfully!", data: kpa, employee: kpaemp });
        } else {
            return res.status(404).send({ code: 404, message: "No KPA Found" });
        }
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};




exports.getkpaemployeeById = async (req, res) => {
    try {
        let id = req.params.id;
        const query = `
            SELECT U.employee_id, U.title, U.first_name, U.middle_name, U.last_name, U.gender, U.emp_personal_email
            FROM HRMS_REGISTERED_USER U
            WHERE U.department_id = :id AND U.isDeleted = false AND U.status = 'ACTIVE'
        `;
        const kpaemp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { id }
        });

        if (kpaemp.length > 0) {
            return res.status(200).send({ code: 200, message: "All employee KPA fetched successfully!", data: kpaemp });
        } else {
            return res.status(404).send({ code: 404, message: "No employee found!" });
        }
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};



/** update KPA  */

exports.updateKpa = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            objective_id, activity, aplicable_for, probation_employee, kpi_data, aplicable_department_id, employee_name
        } = req.body;
        const parsedEmployeeName = Array.isArray(employee_name) ? employee_name : [employee_name];

        const existingKpa = await KPA.findOne({
            where: {
                id: id,
                objective_id: objective_id,
                activity: activity,
                aplicable_for: aplicable_for,
                probation_employee: probation_employee,
                kpi_data: kpi_data,
                isDeleted: false,
            }
        });

        if (existingKpa) {
            if (aplicable_for === 'Selected_User') {
                const existingKpaEmployee = await KPAEMPLOYEE.findOne({
                    where: {
                        kpa_master_id: id,
                        employee_id: parsedEmployeeName,
                        applicable_department_id: aplicable_department_id,
                        isDeleted: false,
                    }
                });

                if (existingKpaEmployee) {
                    return res.status(400).send({ code: 400, message: "KPA already exists with the same data" });
                }
            } else {
                return res.status(400).send({ code: 400, message: "KPA already exists with the same data" });
            }
        }

         await KPAEMPLOYEE.update({
            isDeleted: true,
            status: 'INACTIVE'
        }, { where: { kpa_master_id: id } });

        await KPA.update({
            objective_id: objective_id,
            activity: activity,
            kpi_data: kpi_data,
            aplicable_for: aplicable_for,
            probation_employee: probation_employee,
        }, { where: { id: id } });

        if (aplicable_for === 'Selected_User') {
            await Promise.all(parsedEmployeeName.map(async (emp_id) => {
                await KPAEMPLOYEE.create({
                    kpa_master_id: id,
                    employee_id: emp_id,
                    applicable_department_id: aplicable_department_id,
                    isDeleted: false,
                    status: 'ACTIVE',
                });
            }));
        }

        return res.status(200).send({ code: 200, message: "KPA Updated Successfully" });
    } catch (error) {
         console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

/** delete KPA */
exports.deleteKpa = async (req, res) => {
    try {
        const id = req.params.id;

        const kpa = await KPA.findOne({ where: { id: id, isDeleted: false } });

        if (kpa) {
            kpa.isDeleted = true;
            kpa.status = 'INACTIVE';
            await kpa.save();

            return res.status(200).send({ code: 200, message: "KPA deleted successfully"});
        } else {
            return res.status(404).send({ code: 404, message: "No KPA Found" });
        }
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

/** GET STATUS */
exports.KpaStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const kpa = await KPA.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (kpa) {
            await KPA.update(
                { status },
                { where: { id: id } }
            );

            return res.status(200).send({
                code: 200,
                message: "Status Changed successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record not found" });
        }
    } catch (error) {
         return res.status(500).send({ code: 500, message: error.message || "Server error" });
    }
};

