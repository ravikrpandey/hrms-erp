const db = require("../../../models/index");
const logger = require('../../../../logger/index');


exports.generate_cost_center_code = async (req, res) => {
    try {
        const { department_id, region_id, cost_center_name } = req.body;

        if (!department_id || !region_id || !cost_center_name) {
            return res.status(400).send({ code: 400, message: "Missing required fields", data: null });
        }

        const department = await db.department.findOne({
            where: { dept_id: department_id, status: "ACTIVE", isDeleted: false },
            attributes: ["cc_code"]
        });

        if (!department) {
            return res.status(404).send({ code: 404, message: "Department not found", data: null });
        }

        const region = await db.regionMaster.findOne({
            where: { id: region_id, status: "ACTIVE", isDeleted: false },
            attributes: ["region_code"]
        });

        if (!region) {
            return res.status(404).send({ code: 404, message: "Region not found", data: null });
        }

        const lastEntry = await db.cost_center.findOne({
            where: { department_id, region_id },
            order: [['createdAt', 'DESC']],
            attributes: ["cost_center_code"]
        });

        let number;
        if (lastEntry) {
            const lastCode = lastEntry.cost_center_code;
            const lastNumber = parseInt(lastCode.slice(-3), 10);
            number = lastNumber + 1;
        } else {
            number = 100;
        }

        const costCenterCode = `${department.cc_code}${region.region_code}${number}`;

        return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: costCenterCode });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.create_cost_center = async (req, res) => {
    try {
        const {
            department_id, region_id, cost_center_name, cost_center_code, financial_year_id, cost_center_type,
            extend_type, amount, id
        } = req.body;
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        if (!department_id || !region_id || !cost_center_name) {
            return res.status(400).send({ code: 400, message: "Missing required fields", data: null });
        }

        const department = await db.department.findOne({
            where: { dept_id: department_id, status: "ACTIVE", isDeleted: false },
        });
        if (!department) {
            return res.status(404).send({ code: 404, message: "Department not found", data: null });
        }

        const region = await db.regionMaster.findOne({
            where: { id: region_id, status: "ACTIVE", isDeleted: false },
        });
        if (!region) {
            return res.status(404).send({ code: 404, message: "Region not found", data: null });
        }

        let createData;
        let updatedAmount;
        let updatedRemainingAmount;

        const findData = await db.cost_center.findOne({
            where: {
                id,
                department_id,
                financial_year_id,
                isDeleted: false
            }
        });
       
        if (!extend_type) {
            createData = await db.cost_center.create({
                department_id: department_id, region_id: region_id, cost_center_name: cost_center_name,
                cost_center_code: cost_center_code,entity_id,
                financial_year_id, cost_center_amt: amount, amount, remainingAmount: amount, cost_center_type
            });
            return res.status(200).send({ code: 200, message: "Cost center created successfully", data: createData });
        } else {
            if (!findData) {
                return res.status(404).send({ code: 404, message: "Cost center not found" });
            }
            if (extend_type === "Increase") {
                updatedAmount = parseFloat(findData.amount) + parseFloat(amount);
                updatedRemainingAmount = parseFloat(findData.remainingAmount) + parseFloat(amount);
            } else if (extend_type === "Decrease") {
                updatedAmount = parseFloat(findData.amount) - parseFloat(amount);
                updatedRemainingAmount = parseFloat(findData.remainingAmount) - parseFloat(amount);
            } else {
                return res.status(400).send({ code: 400, message: "Invalid extend_type" });
            }

            await db.cost_center.update({
                amount: updatedAmount,
                remainingAmount: updatedRemainingAmount,
                extend_type,
            }, {
                where: {
                    id: findData.id
                }
            });

            await db.cost_center_map.create({
                cost_center_id: findData.id, cost_amount: amount, cost_center_type,
                extend_type,
            });

            return res.status(200).send({ code: 200, message: "Cost center updated successfully" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server error" });
    }
};

exports.getAll_Active_Cost_Center = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        let sqlQuery = `
                SELECT FC.id AS cost_center_id,FC.cost_center_name, FC.cost_center_type ,FC.status AS cost_center_status,
                FC.createdAt AS cost_center_createdAt,
                FC.updatedAt AS cost_center_updatedAt,FC.cost_center_code,FC.remainingAmount,FC.amount,FC.financial_year_id,
                MD.dept_id,MD.department_name,MD.department_code,FY.financial_year,
                MD.cc_code,MR.id AS region_id,MR.region_name,MR.region_code
                FROM FINANCE_COST_CENTER FC
                JOIN MASTER_DEPARTMENT MD ON FC.department_id = MD.dept_id AND MD.isDeleted = false
                JOIN MASTER_REGION MR ON FC.region_id = MR.id AND MR.isDeleted = false
                JOIN MASTER_FINANCIAL_YEAR  FY ON FY.id = FC.financial_year_id AND FY.isDeleted = false
                WHERE FC.isDeleted = false AND FC.status = 'ACTIVE'
        `;

        const queryParams = [];

        if (!isNaN(entity_id)) {
            sqlQuery += ' AND FC.entity_id = ?';
            queryParams.push(entity_id);
        }

        sqlQuery += ' ORDER BY FC.cost_center_code ASC';

        const results = await db.sequelize.query(sqlQuery, {
            replacements: queryParams,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (results.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: results });
        } else {
            return res.status(200).send({ code: 404, message: "Record Not Found", data: results });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAll_Cost_Center = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        let sqlQuery = `
            SELECT 
                FC.id AS cost_center_id,
                FC.cost_center_name,
                FC.cost_center_type,
                FC.status AS cost_center_status,
                FC.createdAt AS cost_center_createdAt,
                FC.updatedAt AS cost_center_updatedAt,
                FC.cost_center_code,
                FC.cost_center_code,
                FC.remainingAmount,
                FC.amount,
                FC.financial_year_id,
                MD.dept_id,
                MD.department_name,
                MD.department_code,
                MD.cc_code,
                MR.id AS region_id,
                MR.region_name,
                MR.region_code,
                FY.financial_year
            FROM FINANCE_COST_CENTER FC
            JOIN MASTER_DEPARTMENT MD ON FC.department_id = MD.dept_id AND MD.isDeleted = false
            JOIN MASTER_REGION MR ON FC.region_id = MR.id AND MR.isDeleted = false
            JOIN MASTER_FINANCIAL_YEAR  FY ON FY.id = FC.financial_year_id AND FY.isDeleted = false
            WHERE FC.isDeleted = false
        `;

        const queryParams = [];

        if (!isNaN(entity_id)) {
            sqlQuery += ' AND FC.entity_id = ?';
            queryParams.push(entity_id);
        }

        sqlQuery += ' ORDER BY FC.cost_center_code ASC';

        const results = await db.sequelize.query(sqlQuery, {
            replacements: queryParams,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (results.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: results });
        } else {
            return res.status(200).send({ code: 404, message: "Record Not Found", data: results });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.get_Cost_Center_ById = async (req, res) => {
    try {
        const costCenterId = req.params.id;
        const [cost_center] = await db.sequelize.query(`
			    SELECT FC.id,FY.financial_year,MD.department_name,FC.cost_center_type,FC.amount,
                FC.remainingAmount,FC.financial_year_id,
                FC.department_id,FC.cost_center_name,FC.cost_center_code,FC.region_id,R.region_name
                FROM FINANCE_COST_CENTER FC
                JOIN MASTER_DEPARTMENT MD ON FC.department_id = MD.dept_id 
                JOIN MASTER_REGION MR ON FC.region_id = MR.id 
                JOIN MASTER_FINANCIAL_YEAR  FY ON FY.id = FC.financial_year_id 
                JOIN MASTER_REGION  R ON R.id = FC.region_id
                WHERE FC.isDeleted = false AND FC.id = ${costCenterId}
                ORDER BY FC.cost_center_code ASC`)

        const [cost_center_map] = await db.sequelize.query(`
        SELECT FM.*,FC.amount,FC.remainingAmount
		FROM FINANCE_COST_CENTER_MAPPING AS FM 
        JOIN FINANCE_COST_CENTER AS FC ON FC.id = FM.cost_center_id
        WHERE  FM.cost_center_id =  ${costCenterId}
        `)
        const Obj = {
            ...cost_center[0],
            cost_center_map,
        }
        if (cost_center.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: Obj });
        }


        if (cost_center_map.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: cost_center_map });
        }

        return res.status(200).send({ code: 404, message: "Record not found", data: null });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.update_cost_center = async (req, res) => {
    try {
        const costCenterId = req.params.id;
        const { department_id, region_id, cost_center_name, cost_center_code } = req.body;

        const isDuplicateName = await db.cost_center.findOne({
            where: {
                department_id: department_id,
                region_id: region_id,
                cost_center_name: cost_center_name,
                isDeleted: false,
                id: { [db.Sequelize.Op.ne]: costCenterId }
            }
        });

        if (isDuplicateName) {
            return res.status(400).send({ code: 400, message: "Cost Center Name already exists!" });
        }


        let isExistCode = await db.cost_center.findOne({
            where: {
                cost_center_code: cost_center_code,
                isDeleted: false,
                id: { [db.Sequelize.Op.ne]: costCenterId }
            }
        })

        if (isExistCode) {
            return res.status(400).send({ code: 400, message: "Cost Center Code already exists!" });
        }

        let existingCostCenter = {};
        if (department_id) existingCostCenter.department_id = department_id;
        if (region_id) existingCostCenter.region_id = region_id;
        if (cost_center_name) existingCostCenter.cost_center_name = cost_center_name;
        if (cost_center_code) existingCostCenter.cost_center_code = cost_center_code;

        await db.cost_center.update(existingCostCenter, { where: { id: costCenterId } });
        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.update_cost_center_status = async (req, res) => {
    try {
        const costCenterId = req.params.id;
        const { status } = req.body;
        await db.cost_center.update({ status: status }, { where: { id: costCenterId } });
        return res.status(200).send({ code: 200, message: "Status Updated Successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.delete_Cost_Center_ById = async (req, res) => {
    try {
        const costCenterId = req.params.id;

        let isExist = await db.cost_center.findOne({ where: { id: costCenterId } })
        if (isExist) {
            if (isExist.isDeleted === true) {
                return res.status(400).send({ code: 400, message: "Cost Center Already Deleted!" })
            }

            let destroy = await db.cost_center.update({ isDeleted: true }, { where: { id: costCenterId } })
            return res.status(200).send({ code: 200, message: "Deleted Successfully" })
        }

        return res.status(200).send({ code: 404, message: "Record not found", data: null });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.get_all_cost = async (req, res) => {
    try {
        const { dept_id } = req.params;
        let { entity_id } = req.query;

        entity_id = entity_id ? parseInt(entity_id) : null;

        const department = await db.department.findOne({
            where: { dept_id: dept_id, status: 'ACTIVE' },
            attributes: ['dept_id']
        });
        if (!department) {
            return res.status(404).send({
                code: 404,
                message: "Department not found"
            });
        }

        const whereClause = {
            department_id: dept_id,
            status: 'ACTIVE'
        };

        if (entity_id) {
            whereClause.entity_id = entity_id;
        }

        const areas = await db.cost_center.findAll({
            where: whereClause,
            attributes: ['id', 'cost_center_name', 'cost_center_code']
        });

        if (areas.length > 0) {
            return res.status(200).send({ code: 200,message: `Found ${areas.length} cost center(s) for department: ${department.dept_id}`,data: areas});
        } else {
            return res.status(200).send({code: 404, message: "No cost centers found for this department"});
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

