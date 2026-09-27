const db = require("../../../../models/index");

const AssetMaster = db.asset_master;
const Op = db.Sequelize.Op;

exports.assetMasterCreate = async (req, res) => {
    try {
        const {
            asset_category_id,
            asset_subcategory_id,
            asset_master_name,
            brand,
            model,
            serial_no,
            purchase_date,
            purchase_cost,
            warranty_end_date,
            remark,
            entity_id } = req.body;

        const exist = await AssetMaster.findOne({
            where: {
                asset_master_name: asset_master_name.trim(),
                entity_id,
                isDeleted: 0
            }
        });

        if (exist) {
            return res.status(409).send({
                code: 409,
                message: "Asset master already exists!"
            });
        }

        const created = await AssetMaster.create({
            asset_category_id,
            asset_subcategory_id: asset_subcategory_id,
            asset_master_name: asset_master_name.trim(),
            brand: brand,
            model: model,
            serial_no: serial_no,
            purchase_date: purchase_date,
            purchase_cost: purchase_cost,
            warranty_end_date: warranty_end_date,
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


exports.getAllAssetMaster = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const assetmasterData = await AssetMaster.findAll({
            where: { isDeleted: false, entity_id },
            attributes: [
                "asset_category_id",
                "asset_subcategory_id",
                "asset_master_id",
                "asset_master_name",
                "brand",
                "model",
                "serial_no",
                "purchase_date",
                "purchase_cost",
                "warranty_end_date",
                "remark",
                "current_status",
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

exports.getAllAssetMasterActiveStatus = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const assetmasterData = await AssetMaster.findAll({
            where: { isDeleted: false, entity_id, status: "ACTIVE" },
            attributes: [
                "asset_category_id",
                "asset_subcategory_id",
                "asset_master_id",
                "asset_master_name",
                "brand",
                "model",
                "serial_no",
                "purchase_date",
                "purchase_cost",
                "warranty_end_date",
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
exports.getAssetMasterById = async (req, res) => {
    try {
        const asset_master_id = parseInt(req.params.asset_master_id);
        const assetmasterData = await AssetMaster.findOne({
            where: { asset_master_id, isDeleted: false },
            attributes: [
                "asset_category_id",
                "asset_subcategory_id",
                "asset_master_id",
                "asset_master_name",
                "brand",
                "model",
                "serial_no",
                "purchase_date",
                "purchase_cost",
                "warranty_end_date",
                "remark",
                "current_status",
                "status"
            ],
        });

        if (!assetmasterData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

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

exports.assetMasterUpdate = async (req, res) => {
    try {
        const asset_master_id = parseInt(req.params.asset_master_id);
        const { asset_category_id, asset_subcategory_id, asset_master_name, brand, model, serial_no, purchase_date, purchase_cost, warranty_end_date, remark, entity_id } = req.body;
        await AssetMaster.update(
            {
                asset_category_id,
                asset_subcategory_id,
                asset_master_id,
                asset_master_name,
                brand,
                model,
                serial_no,
                purchase_date,
                purchase_cost,
                warranty_end_date,
                remark,
                entity_id,
            },
            { where: { asset_master_id } }
        );
        const updatedRecord = await AssetMaster.findOne({
            where: { asset_master_id }
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


exports.assetMasterStatusUpdate = async (req, res) => {
    try {
        const asset_master_id = parseInt(req.params.asset_master_id);
        const { status } = req.body;
        const editData = await AssetMaster.findOne({
            where: { asset_master_id, isDeleted: false }
        });

        if (!editData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await AssetMaster.update(
            { status },
            { where: { asset_master_id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Status updated successfully!",
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.deleteAsseMasterById = async (req, res) => {
    try {
        const asset_master_id = parseInt(req.params.asset_master_id);
        const assetMasterDetails = await AssetMaster.findOne({
            where: { asset_master_id, isDeleted: false }
        });
        if (!assetMasterDetails) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await AssetMaster.update(
            { isDeleted: true },
            { where: { asset_master_id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Deleted successfully!"
        });
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }

};
exports.getAllAvailableAssetMaster = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const assetmasterData = await AssetMaster.findAll({
            where: { isDeleted: false, entity_id, status: "ACTIVE", current_status: "AVAILABLE" },
            attributes: [
                "asset_category_id",
                "asset_subcategory_id",
                "asset_master_id",
                "asset_master_name",
                "brand",
                "model",
                "serial_no",
                "purchase_date",
                "purchase_cost",
                "warranty_end_date",
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