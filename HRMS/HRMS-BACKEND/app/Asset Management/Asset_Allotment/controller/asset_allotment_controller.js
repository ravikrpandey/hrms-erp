const db = require("../../../models/index");

const AssetAllotment = db.asset_allotment;
const Op = db.Sequelize.Op;

exports.assetAllotmentCreate = async (req, res) => {
    try {
        const {
            asset_allotment_id,
            assigned_to,
            alloted_by,
            asset_master_id,
            asset_allotment_date,
            condition_on_allotment,
            remark,
            entity_id
        } = req.body;

        const exist = await AssetAllotment.findOne({
            where: {
                asset_master_id: asset_master_id,
                entity_id,
                isDeleted: 0
            }
        });

        // if (exist) {
        //     return res.status(409).send({
        //         code: 409,
        //         message: "Asset master already exists!"
        //     });
        // }

        const created = await AssetAllotment.create({
            asset_allotment_id,
            assigned_to: assigned_to,
            alloted_by: alloted_by,
            asset_master_id: asset_master_id,
            asset_allotment_date: asset_allotment_date,
            condition_on_allotment: condition_on_allotment,
            remark: remark ? remark.trim() : null,
            entity_id
        });

        return res.status(200).send({
            code: 200,
            message: "Created successfully!",
            data: created
        });

    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.getAllAssetAllotmentList = async (req, res) => {
    try {
        const { entity_id } = req.query;

        if (!entity_id) {
            return res.status(400).send({
                code: 400,
                message: "entity_id is required"
            });
        }

        const sql = `
            SELECT 
                AA.asset_allotment_id,
                AA.assigned_to,
                AA.alloted_by,
                AA.asset_master_id,
                AA.asset_allotment_date,
                AA.condition_on_allotment,
                AA.remark,
                AA.status,
                AA.current_status,
                AM.asset_master_name,
                CONCAT(AU.first_name, ' ', AU.last_name) AS assigned_user_name,
                CONCAT(AB.first_name, ' ', AB.last_name) AS alloted_by_user_name
            FROM ASSET_ALLOTMENT AS AA
            LEFT JOIN ASSET_MASTER AS AM 
                ON AA.asset_master_id = AM.asset_master_id
                AND AM.isDeleted = 0
            -- JOIN for assigned_to (user)
            LEFT JOIN HRMS_REGISTERED_USER AS AU
                ON AA.assigned_to = AU.employee_id
                AND AU.isDeleted = 0
            -- JOIN for alloted_by (user)
            LEFT JOIN HRMS_REGISTERED_USER AS AB
                ON AA.alloted_by = AB.employee_id
                AND AB.isDeleted = 0
            WHERE AA.isDeleted = 0 
                AND AA.entity_id = :entity_id
            ORDER BY AA.asset_master_id DESC
        `;

        const assetmasterData = await db.sequelize.query(sql, {
            replacements: { entity_id },
            type: db.sequelize.QueryTypes.SELECT
        });

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: assetmasterData,
        });

    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};




exports.getAllssetAllotmentListActiveStatus = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const assetmasterData = await AssetAllotment.findAll({
            where: { isDeleted: false, entity_id, status: "ACTIVE" },
            attributes: [
                "asset_allotment_id",
                "assigned_to",
                "alloted_by",
                "asset_master_id",
                "asset_allotment_date",
                "condition_on_allotment",
                "remark",
                "status"
            ],
            order: [["asset_master_id", "DESC"]],
        });

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: assetmasterData,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

// FIXED: Corrected parameter name
exports.getassetAllotmentById = async (req, res) => {
    try {
        const asset_allotment_id = parseInt(req.params.asset_allotment_id);

        if (!asset_allotment_id) {
            return res.status(400).send({
                code: 400,
                message: "asset_allotment_id is required"
            });
        }

        const sql = `
            SELECT 
                AA.asset_allotment_id,
                AA.assigned_to,
                AA.alloted_by,
                AA.asset_master_id,
                AA.asset_allotment_date,
                AA.condition_on_allotment,
                AA.remark,
                AA.status,
                AA.current_status,
                AM.asset_master_name,
                MD.department_name,
                MD.dept_id,
                CONCAT(AU.first_name, ' ', AU.last_name) AS assigned_user_name,
                CONCAT(AB.first_name, ' ', AB.last_name) AS alloted_by_user_name
            FROM ASSET_ALLOTMENT AS AA
            LEFT JOIN ASSET_MASTER AS AM 
                ON AA.asset_master_id = AM.asset_master_id
                AND AM.isDeleted = 0
            LEFT JOIN HRMS_REGISTERED_USER AS AU
                ON AA.assigned_to = AU.employee_id
                AND AU.isDeleted = 0
            LEFT JOIN HRMS_REGISTERED_USER AS AB
                ON AA.alloted_by = AB.employee_id
                AND AB.isDeleted = 0
            LEFT JOIN MASTER_DEPARTMENT AS MD
                ON AU.department_id = MD.dept_id
                AND MD.isDeleted = 0
            WHERE AA.isDeleted = 0
                AND AA.asset_allotment_id = :asset_allotment_id
            LIMIT 1
        `;

        const data = await db.sequelize.query(sql, {
            replacements: { asset_allotment_id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data.length === 0) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: data[0],
        });

    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

// FIXED: Corrected update function
exports.assetAllotmentUpdate = async (req, res) => {
    try {
        const asset_allotment_id = parseInt(req.params.asset_allotment_id); // Changed parameter name
        const {
            assigned_to,
            alloted_by,
            asset_master_id,
            asset_allotment_date,
            condition_on_allotment,
            remark,
            entity_id
        } = req.body;

        // Check if record exists
        const existingRecord = await AssetAllotment.findOne({
            where: { asset_allotment_id, isDeleted: false }
        });

        if (!existingRecord) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        // Check if asset_master_id is being changed to one that already exists
        if (asset_master_id && asset_master_id !== existingRecord.asset_master_id) {
            const exist = await AssetAllotment.findOne({
                where: {
                    asset_master_id: asset_master_id,
                    entity_id,
                    isDeleted: 0,
                    asset_allotment_id: { [Op.ne]: asset_allotment_id }
                }
            });

            if (exist) {
                return res.status(409).send({
                    code: 409,
                    message: "Asset master already exists!"
                });
            }
        }

        // Perform update
        await AssetAllotment.update(
            {
                assigned_to,
                alloted_by,
                asset_master_id,
                asset_allotment_date,
                condition_on_allotment,
                remark: remark ? remark.trim() : null,
                entity_id,
            },
            { where: { asset_allotment_id } }
        );

        const updatedRecord = await AssetAllotment.findOne({
            where: { asset_allotment_id }
        });

        return res.status(200).send({
            code: 200,
            message: "Updated successfully!",
            data: updatedRecord
        });

    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.updateAssetAllotmentStatus = async (req, res) => {
    try {
        const asset_allotment_id = parseInt(req.params.asset_allotment_id);
        const { status } = req.body;

        const editData = await AssetAllotment.findOne({
            where: { asset_allotment_id, isDeleted: false }
        });

        if (!editData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await AssetAllotment.update(
            { status },
            { where: { asset_allotment_id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Status updated successfully!",
        });
    } catch (err) { // Fixed: changed 'error' to 'err' to match the variable
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};
