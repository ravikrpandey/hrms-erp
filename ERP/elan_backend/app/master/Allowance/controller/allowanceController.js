const { where } = require('sequelize');
const db = require('../../../models/index')
const Allowance = db.allowance;
const logger = require('../../../../logger/index');

exports.create_Allowance = async (req, res) => {
    try {
        const { allowance_name, domestic_allowance, international_allowance, entity_id, financial_id, amount_type } = req.body;

        if (!allowance_name || allowance_name.trim().length === 0) {
            return res.status(400).send({ code: 400, message: "Allowance name is required and cannot be empty or contain only spaces" });
        }

        const existingAllowance = await Allowance.findOne({
            where: {
                allowance_name: allowance_name,
                entity_id: entity_id,
                financial_id: financial_id,
                isDeleted: false, amount_type
            }
        });

        if (existingAllowance) {
            return res.status(403).send({ code: 403, message: "Allowance Already Exists" });
        } else {
            const newAllowance = await Allowance.create({
                allowance_name: allowance_name,
                domestic_allowance: domestic_allowance,
                international_allowance: international_allowance,
                entity_id: entity_id,
                financial_id: financial_id, amount_type

            });
            return res.status(200).send({ code: 200, message: "Allowance Created Successfully", data: newAllowance });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_Allowance = async (req, res) => {
    try {
        const { entity_id, financial_id } = req.query;
        const allowances = await Allowance.findAll({
            where: { entity_id, financial_id, isDeleted: false },
            order: [['id', 'DESC']],
        });
        if (allowances && allowances.length > 0) {
            return res.status(200).json({ code: 200, message: "All Data Retrieved", data: allowances });
        } else {
            return res.status(404).json({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error('Error retrieving allowances:', error);
        return res.status(500).json({ code: 500, message: "Server Error" });
    }
};

/** get active allowance by entity and fy */
exports.getActive_Allowance = async (req, res) => {
    try {
        const { entity_id, fy_id } = req.query;

        const getAllData = await Allowance.findAll({
            where: { entity_id: entity_id, financial_id: fy_id, isDeleted: false, status: 'ACTIVE' },

        });

        if (getAllData.length > 0) {

            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {

            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};

exports.Allowance_getById = async (req, res) => {
    try {
        const AllowanceId = req.params.id
        const allowance = await Allowance.findOne({
            where: { id: AllowanceId, isDeleted: false },
        })
        if (!allowance) {
            return res.status(404).send({ code: 404, message: "Allowance not found" });
        }
        return res.status(200).send({ code: 200, message: "Success", data: allowance });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
}


exports.updateAllowanceById = async (req, res) => {
    try {
        const AllowanceId = req.params.id;
        const { allowance_name, domestic_allowance, international_allowance, entity_id, financial_id, amount_type } = req.body;

        const allowance = await Allowance.findOne({ where: { id: AllowanceId, isDeleted: false } });
        if (!allowance) {
            return res.status(404).send({ code: 404, message: "Allowance not Found" });
        } else {
            const allowances = await Allowance.findOne({
                where: { allowance_name: allowance_name, id: { [db.Sequelize.Op.ne]: AllowanceId } }
            });
            if (allowances) {
                return res.status(409).send({ code: 409, message: "Allowance Already Exists" });
            } else {
                await Allowance.update({
                    allowance_name,
                    domestic_allowance,
                    international_allowance,
                    entity_id,
                    financial_id, amount_type

                }, {
                    where: {
                        id: AllowanceId
                    }
                });

                const updatedAllowance = await Allowance.findOne({ where: { id: AllowanceId } });
                return res.status(200).send({ code: 200, message: "Allowance updated successfully", data: updatedAllowance });
            }
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


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
        logger.error(`Error ${error.message}`, { error });
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
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message });
    };
};

/** Get all employee*/
exports.getEmployeebyEntityId = async (req, res) => {
    const entity_id = req.params.entity_id;
    try {
        const baseQuery = `
            SELECT 
                fc.employee_id AS employee_id,
                fc.first_name AS first_name,
                fc.last_name AS last_name,
                ft.entity_id AS entity_id,
                ft.entity_name,fc.employee_code
            FROM
                HRMS_REGISTERED_USERS_ENTITY AS ft
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON ft.employee_id = fc.employee_id
            WHERE 
                fc.isDeleted = false 
                AND ft.entity_id = :entity_id;
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
        logger.error(`Error ${error.message}`, { error });
        console.error('Error in getting data:', error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
};


