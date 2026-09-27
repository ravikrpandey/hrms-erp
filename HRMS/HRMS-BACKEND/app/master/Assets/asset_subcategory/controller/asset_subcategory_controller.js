const db = require("../../../../models/index");

const AssetSubcategory = db.asset_subcategory_master;
const Op = db.Sequelize.Op;

exports.assetSubcategoryCreate = async (req, res) => {
    try {
        const {
            asset_category_id,
            asset_subcategory_name,
            entity_id,
            description,
            created_by
        } = req.body;

        const exist = await AssetSubcategory.findOne({
            where: {
                asset_subcategory_name: asset_subcategory_name.trim(),
                entity_id,
                isDeleted: 0
            }
        });

        if (exist) {
            return res.status(409).send({
                code: 409,
                message: "Asset subcategory already exists!"
            });
        }

        const created = await AssetSubcategory.create({
            asset_category_id,
            asset_subcategory_name: asset_subcategory_name.trim(),
            description: description ? description.trim() : null,
            entity_id,
            created_by
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


exports.getAllAssetSubcat = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const assetsubcategoryData = await AssetSubcategory.findAll({
            where: { isDeleted: false, entity_id },
            attributes: [
                "asset_category_id",
                "asset_subcategory_id",
                "asset_subcategory_name",
                "description",
                "created_by",
                "status"
            ],
            order: [["asset_subcategory_id", "DESC"]],
        });

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: assetsubcategoryData,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.getAllAssetSubcatActiveStatus = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const assetsubcategoryData = await AssetSubcategory.findAll({
            where: { isDeleted: false, entity_id, status: "ACTIVE" },
            attributes: [
                "asset_category_id",
                "asset_subcategory_id",
                "asset_subcategory_name",
                "description",
                "created_by",
                "status"
            ],
            order: [["asset_subcategory_id", "DESC"]],
        });

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: assetsubcategoryData,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};
exports.getAssetSubcatById = async (req, res) => {
    try {
        const asset_subcategory_id = parseInt(req.params.asset_subcategory_id);
        const assetsubcategoryData = await AssetSubcategory.findOne({
            where: { asset_subcategory_id, isDeleted: false },
            attributes: [
                "asset_category_id",
                "asset_subcategory_id",
                "asset_subcategory_name",
                "description",
                "created_by",
                "status"
            ],
        });

        if (!assetsubcategoryData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: assetsubcategoryData,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.assetSubcategoryUpdate = async (req, res) => {
    try {
        const asset_subcategory_id = parseInt(req.params.asset_subcategory_id);
        const { asset_category_id, asset_subcategory_name, description, entity_id } = req.body;
        await AssetSubcategory.update(
            {
                asset_category_id,
                asset_subcategory_name,
                description,
                entity_id
            },
            { where: { asset_subcategory_id } }
        );
        const updatedRecord = await AssetSubcategory.findOne({
            where: { asset_subcategory_id }
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


exports.updateAssetSubcategoryStatus = async (req, res) => {
    try {
        const asset_subcategory_id = parseInt(req.params.asset_subcategory_id);
        const { status } = req.body;
        const editData = await AssetSubcategory.findOne({
            where: { asset_subcategory_id, isDeleted: false }
        });

        if (!editData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await AssetSubcategory.update(
            { status },
            { where: { asset_subcategory_id } }
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

exports.deleteAssetSubcategoryById = async (req, res) => {
    try {
        const asset_subcategory_id = parseInt(req.params.asset_subcategory_id);
        const assetSubcategoryDetails = await AssetSubcategory.findOne({
            where: { asset_subcategory_id, isDeleted: false }
        });
        if (!assetSubcategoryDetails) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await AssetSubcategory.update(
            { isDeleted: true },
            { where: { asset_subcategory_id } }
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