const db = require("../../../../models/index");

const AssetCategory = db.asset_category_master;
const Op = db.Sequelize.Op;

exports.assetCategoryCreate = async (req, res) => {
    try {
        console.log('Received payload:', req.body);

        const { asset_category_name, entity_id, description, created_by } = req.body;

        // Validate required fields
        if (!asset_category_name || !entity_id) {
            return res.status(400).send({
                code: 400,
                message: "Asset category name and entity_id are required!"
            });
        }

        const assetcategorydata = await AssetCategory.findOne({
            where: {
                asset_category_name: asset_category_name.trim(),
                entity_id,
                isDeleted: 0
            },
        });

        if (assetcategorydata) {
            return res.status(409).send({
                code: 409,
                message: "Asset category already exists!"
            });
        }

        const assetcategoryData = await AssetCategory.create({
            asset_category_name: asset_category_name.trim(),
            entity_id,
            description: description ? description.trim() : null,
            created_by: created_by || null
        });

        return res.status(200).send({
            code: 200,
            message: "Created successfully",
            data: assetcategoryData
        });
    } catch (err) {
        console.error('Error details:', err);
        return res.status(500).send({
            code: 500,
            message: "Server error",
            error: err.message
        });
    }
};

exports.assetCategoryList = async (req, res) => {
    try {
        const { entity_id } = req.query;

        if (!entity_id) {
            return res.status(400).send({
                code: 400,
                message: "entity_id is required"
            });
        }

        const assetcategoryData = await AssetCategory.findAll({
            where: { isDeleted: false, entity_id },
            attributes: [
                "asset_category_id",
                "asset_category_name",
                "description",
                "created_by",
                "status"
            ],
            order: [["asset_category_id", "DESC"]],
        });

        res.status(200).send({
            code: 200,
            message: "Asset category data list fetched successfully",
            data: assetcategoryData,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            code: 500,
            message: "Error",
            error: err.message
        });
    }
};

exports.getassetCategoryListActiveStatus = async (req, res) => {
    try {
        const { entity_id } = req.query;

        if (!entity_id) {
            return res.status(400).send({
                code: 400,
                message: "entity_id is required"
            });
        }

        const assetcategoryData = await AssetCategory.findAll({
            where: {
                isDeleted: false,
                entity_id,
                status: "ACTIVE"
            },
            attributes: [
                "asset_category_id",
                "asset_category_name",
                "description",
                "created_by",
                "status"
            ],
            order: [["asset_category_id", "DESC"]]
        });

        res.status(200).send({
            code: 200,
            message: "Asset category data list fetched successfully",
            data: assetcategoryData,
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            code: 500,
            message: "Error",
            error: err.message
        });
    }
};


exports.assetCategoryById = async (req, res) => {
    try {
        const asset_category_id = parseInt(req.params.asset_category_id);

        if (!asset_category_id) {
            return res.status(400).send({
                code: 400,
                message: "Invalid asset_category_id"
            });
        }

        const assetcategoryData = await AssetCategory.findOne({
            where: { asset_category_id, isDeleted: false },
            attributes: [
                "asset_category_id",
                "asset_category_name",
                "description",
                "created_by",
                "status"
            ],
        });

        if (!assetcategoryData) {
            return res.status(404).send({
                code: 404,
                message: "Asset category not found"
            });
        }

        res.status(200).send({
            code: 200,
            message: "Asset category fetched successfully",
            data: assetcategoryData,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Error",
            error: err.message
        });
    }
};

exports.assetCategoryUpdate = async (req, res) => {
    try {
        const asset_category_id = parseInt(req.params.asset_category_id);
        const { asset_category_name, description, entity_id } = req.body;

        console.log('Update payload:', req.body);
        console.log('Asset category ID:', asset_category_id);

        if (!asset_category_id) {
            return res.status(400).send({
                code: 400,
                message: "Invalid asset_category_id"
            })
        }

        const assetCategoryDetails = await AssetCategory.findOne({
            where: { asset_category_id, isDeleted: false }
        });

        if (!assetCategoryDetails) {
            return res.status(404).send({
                code: 404,
                message: "Record not found"
            });
        }

        // Check if another record with same name exists (if name is being changed)
        if (asset_category_name && asset_category_name.trim() !== assetCategoryDetails.asset_category_name) {
            const gradeExists = await AssetCategory.findOne({
                where: {
                    asset_category_name: asset_category_name.trim(),
                    entity_id: entity_id || assetCategoryDetails.entity_id,
                    asset_category_id: { [Op.ne]: asset_category_id },
                    isDeleted: 0
                },
            });

            if (gradeExists) {
                return res.status(409).send({
                    code: 409,
                    message: "Asset category already exists!"
                });
            }
        }

        // Build update data object
        const updateData = {};
        if (asset_category_name) {
            updateData.asset_category_name = asset_category_name.trim();
        }
        if (description !== undefined) {
            updateData.description = description ? description.trim() : null;
        }

        await AssetCategory.update(updateData, {
            where: { asset_category_id },
        });

        // Fetch updated record
        const updatedRecord = await AssetCategory.findOne({
            where: { asset_category_id }
        });

        return res.status(200).send({
            code: 200,
            message: "Asset category updated successfully",
            data: updatedRecord
        });

    } catch (err) {
        console.error('Update Error:', err);
        return res.status(500).send({
            code: 500,
            message: "Server error",
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.updateAssetCategoryStatus = async (req, res) => {
    try {
        const asset_category_id = parseInt(req.params.asset_category_id);
        const { status } = req.body;

        if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
            return res.status(400).send({
                code: 400,
                message: "Valid status is required (ACTIVE or INACTIVE)"
            });
        }

        const editData = await AssetCategory.findOne({
            where: { asset_category_id, isDeleted: false }
        });

        if (!editData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await AssetCategory.update(
            { status },
            { where: { asset_category_id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Status updated successfully!",
        });
    } catch (error) {
        console.error('Status update error:', error);
        return res.status(500).send({
            code: 500,
            message: "Internal server error!"
        });
    }
};

exports.deleteAssetCategoryById = async (req, res) => {
    try {
        const asset_category_id = parseInt(req.params.asset_category_id);

        if (!asset_category_id) {
            return res.status(400).send({
                code: 400,
                message: "Invalid asset_category_id"
            });
        }

        const assetCategoryDetails = await AssetCategory.findOne({
            where: { asset_category_id, isDeleted: false }
        });

        if (!assetCategoryDetails) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await AssetCategory.update(
            { isDeleted: true },
            { where: { asset_category_id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Deleted successfully!"
        });
    } catch (err) {
        console.error('Delete error:', err);
        return res.status(500).send({
            code: 500,
            message: "Internal server error!"
        });
    }
};