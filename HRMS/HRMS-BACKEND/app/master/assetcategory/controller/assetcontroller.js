const db = require("../../../models/index");
// const RegisterEmployee = db.assets;


exports.createAssets = async (req, res) => {
    try {
        const {
            asset_category_name, asset_category_description
        } = req.body;
        const asset_category_code = btoa(Math.random()).slice(0, 10).toUpperCase();
        const user = await db.asset.findOne({
            where: { asset_category_name: asset_category_name, isDeleted: false }
        });
        if (user) {
            return res.status(201).send({ code: 201, message: "Assets  Already Exists!" })
        } else if (!user) {
            const response = await db.asset.create({
                asset_category_name,
                asset_category_code,
                asset_category_description,
            });
            return res.status(200).send({ code: 200, message: "Assets Created Successfully!", data: response });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};
exports.assets_get = async (req, res) => {
    try {
        const getAllData = await db.asset.findAll({ where: { isDeleted: false }, order: [['id', 'DESC']], });
        return res.status(200).send({ code: 200, message: "Get All Assets Data Successfully", data: getAllData });
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.active_assets_get = async (req, res) => {
    try {
        const getAllData = await db.asset.findAll({ where: { isDeleted: false, status: "ACTIVE" }, order: [['id', 'DESC']], });
        return res.status(200).send({ code: 200, message: "Get All Assets Data Successfully", data: getAllData });
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.get_All_Category_Master = async (req, res) => {
    try {
        const getAllData = await db.asset.findAll({ where: { isDeleted: false, status: "ACTIVE" }, order: [['id', 'DESC']], });
        return res.status(200).send({ code: 200, message: "Get All Asset Category Successfully", data: getAllData });
    } catch (error) {
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
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.update_asset = async (req, res) => {
    try {
        const id = req.params.id
        if (id) {
            const { asset_category_name, asset_category_description } = req.body;
            const getAllData = await db.asset.findOne({ where: { id: id, status: "ACTIVE" } });
            if (getAllData) {
                const asset_category_namee = await db.asset.findAll({
                    where: {
                        asset_category_name: asset_category_name,
                        id: { [db.Sequelize.Op.ne]: id },
                        asset_category_description: asset_category_description
                    }
                });
                if (asset_category_namee[0]) {
                    return res.status(409).send({ code: 409, message: "Assets  Already Exists!" });
                } else {
                    await db.asset.update({
                        asset_category_name, asset_category_description
                    },
                        {
                            where: { id: id }
                        });
                    return res.status(200).send({
                        code: 200, message: "Asset update Successfully!",
                    });
                }
            } else {
                return res.status(404).send({ code: 403, message: "id not found" });
            };
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.delete_asset = async (req, res) => {
    try {
        const id = req.params.id
        // if(!id){
        const getAllData = await db.asset.findOne({ where: { id: id } });
        if (getAllData) {
            await db.asset.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Asset is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }
        // }
        // else{
        //     return res.status(200).send({ code: 200, message: "id not found" });
        // }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
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
                // data: updated
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

