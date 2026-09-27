const db = require("../../../models/index");
const logger = require('../../../../logger/index');

exports.createAssets = async (req, res) => {
    try {
        const {
            asset_category_name, asset_category_description, entity_id
        } = req.body;
        const asset_category_code = btoa(Math.random()).slice(0, 10).toUpperCase();
        const user = await db.asset.findOne({
            where: { asset_category_name: asset_category_name, isDeleted: false }
        });
        const product_cate = await db.productcategory.findOne({ where: { category_name: asset_category_name, status: 'ACTIVE', isDeleted: false } });
        if (user) {
            return res.status(400).send({ code: 400, message: "product Cateogry Already Exists!" })
        }
        else if (user && product_cate) {
            if (user.status === 'INACTIVE') {
                await db.asset.update({ status: 'ACTIVE' }, { where: { id: user.id } });
                return res.status(200).send({ code: 200, message: "product Categroy Updated Successfully", data: user });
            } else {
                return res.status(403).send({ code: 403, message: "product Categroy Already Exists!" });
            }
        }
        else {
            const response = await db.asset.create({
                asset_category_name,
                asset_category_code,
                asset_category_description,
                entity_id
            });
            const responsepro = await db.productcategory.create({
                id: response.id,
                category_name: response.asset_category_name,
                category_code: response.asset_category_code,
                entity_id: response.entity_id
            });
            return res.status(200).send({ code: 200, message: "Product Cateogry Created Successfully!", data: responsepro });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.assets_get = async (req, res) => {
    try {
        const getAllData = await db.asset.findAll({ where: { isDeleted: false }, order: [['id', 'DESC']], });
        return res.status(200).send({ code: 200, message: "Get All Item Cateogry Data Successfully", data: getAllData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.active_assets_get = async (req, res) => {
    try {
        const getAllData = await db.asset.findAll({ where: { isDeleted: false, status: "ACTIVE" }, order: [['id', 'DESC']], });
        return res.status(200).send({ code: 200, message: "Get All Item Cateogry Data Successfully", data: getAllData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.get_All_Category_Master = async (req, res) => {
    try {
        const getAllData = await db.asset.findAll({ where: { isDeleted: false, status: "ACTIVE" }, order: [['id', 'DESC']], });
        return res.status(200).send({ code: 200, message: "Get All Item Cateogry Successfully", data: getAllData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.assets_get_id = async (req, res) => {
    try {
        const asset_id = req.params.id;
        const getData = await db.asset.findOne({
            where: { id: asset_id, isDeleted: false },
        });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Get Data Succssesfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.update_asset = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const { asset_category_name, asset_category_description } = req.body;

            const getAllData = await db.asset.findOne({
                where: { id: id, status: "ACTIVE" }
            });

            if (getAllData) {
                const asset_category_namee = await db.asset.findOne({
                    where: {
                        asset_category_name: asset_category_name,
                        // id: { [db.Sequelize.Op.ne]: id },
                        // asset_category_description: asset_category_description,
                        status:'ACTIVE',
                        isDeleted: false
                    }
                });
                if (asset_category_namee) {
                    return res.status(201).send({
                        code: 201,
                        message: "Item Category Already Exists!"
                    });
                } else {
                    await db.asset.update({
                        asset_category_name,
                        asset_category_description
                    }, {
                        where: { id: id }
                    });

                    const updatedAsset = await db.asset.findOne({
                        where: { id: id }
                    });

                    if (updatedAsset) {
                        await db.productcategory.update({
                            category_name: updatedAsset.asset_category_name,
                        }, {
                            where: { id: updatedAsset.id }
                        });

                        return res.status(200).send({
                            code: 200,
                            message: "Product Category updated successfully!"
                        });
                    } else {
                        return res.status(404).send({
                            code: 404,
                            message: "Updated asset not found"
                        });
                    }
                }
            } else {
                return res.status(404).send({
                    code: 404,
                    message: "Asset not found or inactive"
                });
            }
        } else {
            return res.status(400).send({
                code: 400,
                message: "ID is required"
            });
        }
    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


exports.delete_asset = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send({ code: 400, message: "Id is required" });
        }

        const getAllData = await db.asset.findOne({ where: { id: id } });

        if (getAllData) {
            await db.asset.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Item Category is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Asset not found" });
        }
    } catch (error) {
        logger.error(`Error occurred while deleting asset with ID ${req.params.id}: ${error.message}`, { error });
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" });
    }
};




exports.assetStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }
        console.log(status)
        const getData = await db.asset.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            await db.asset.update(
                {
                    status
                },
                {
                    where: {
                        id: id
                    }
                }
            );
            return res.status(200).send({
                code: 200,
                message: "Status Updated Successfully",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

