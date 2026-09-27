const { list } = require("pdfkit");
const db = require("../../../models/index");
const { Op } = require("sequelize");
const product_master = db.product_master;
const uom_detail = db.uomdetails;
const bom = db.bom;
const bomDetails = db.bomDetails;
const item_details = db.ItemMaster;
const asset_details = db.asset;
const user_detail = db.user;
const Sequelize = require("sequelize");

module.exports.createBom = async (req, res) => {
    try {
        const { bom_type, product_id, product_variant, bomDetails, employee_id } = req.body;

        const bomExists = await db.bom.findOne({
            where: { product_variant, product_id, isDeleted: false }
        });
        if (bomExists) {
            return res.status(404).send({ code: 404, message: "BOM Already Exists!" });
        }
        const dublicateData = await db.bom.findOne({
            where: {
                product_variant,
                isDeleted: false
            }
        })
        const itemExist = await Promise.all(bomDetails.map(async (item) => {
            const { item_master_id } = item;
            const data = await db.ItemMaster.findOne({ where: { id: item_master_id } });
            return data !== null;
        }));

        if (itemExist.includes(false)) {
            return res.status(400).send({ code: 400, message: "One or more items do not exist!" });
        }

        const assetExist = await Promise.all(bomDetails.map(async (item) => {
            const { asset_id } = item;
            const data = await db.asset.findOne({ where: { id: asset_id } });
            return data !== null;
        }));

        if (assetExist.includes(false)) {
            return res.status(400).send({ code: 400, message: "One or more asset do not exist!" });
        }
      
        if (dublicateData == null) {
            const createBom = await db.bom.create({
                bom_type,
                product_id,
                product_variant,
                employee_id
            });
            const dataValue = Promise.all(bomDetails.map((item) => {
                const { bom_qty, type, scrape, asset_id, item_master_id, scrape_reuseable } = item;
                return db.bomDetails.create({
                    bom_qty,
                    type,
                    scrape,
                    scrape_reuseable,
                    asset_id,
                    item_master_id,
                    bom_id: createBom.id
                });
            }))
            if (createBom && dataValue) {
                return res.status(201).send({ code: 201, message: "BOM Created Successfully" });
            } else {
                return res.status(404).send({ code: 404, message: "BOM not Created" })
            }
        } else {
            const dataExist = await db.bomDetails.findAll({
                where: { bom_id: dublicateData.id ,isDeleted: false },
                attributes: ['asset_id', 'item_master_id']
            })
            // const matchRecord = dataExist.map(item => {
            //     const { asset_id, item_master_id } = item;
            // })
            if (dataExist) {
                return res.status(404).send({ code: 404, message: "Data Allready Exist!" });
            }
            const createBom = await db.bom.create({
                bom_type,
                product_id,
                product_variant,
                employee_id
            });
            const dataValue = Promise.all(bomDetails.map((item) => {
                const { bom_qty, type, scrape, asset_id, item_master_id, scrape_reuseable } = item;
                return db.bomDetails.create({
                    bom_qty,
                    type,
                    scrape,
                    scrape_reuseable,
                    asset_id,
                    item_master_id,
                    bom_id: createBom.id
                });
            }))
            if (createBom && dataValue.length > 0) {
                return res.status(201).send({ code: 201, message: "BOM Created Successfully" });
            } else {
                return res.status(404).send({ code: 404, message: "BOM not Created" })
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

module.exports.getBomAll = async (req, res) => {
    try {
        const { id } = req.params;
        let condition = ''
        if (id) {
            condition = ` P.id = ${id}`
        } else {
            condition = '1=1'
        }
        const data = await db.sequelize.query(
            `SELECT P.id,P.bom_type, P.product_variant,P.status,PM.product_name,P.product_id,
            R.first_name,R.last_name,R.middle_name,
            DATE_FORMAT(P.createdAt,'%Y-%m-%d') AS createdAt,
            DATE_FORMAT(P.updatedAt,'%Y-%m-%d') AS updatedAt
            FROM PRO_BOM_MST AS P
            INNER JOIN product_master AS PM ON PM.id= P.product_id
            INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id=P.employee_id
             WHERE ${condition} AND P.isDeleted = false ORDER BY P.id DESC`)
        if (id) {
            const dataValue = await db.sequelize.query(
                `SELECT P.*,AC.asset_category_name,I.item_name,I.item_code,U.uom_name  FROM PRO_BOM_DETAILS_MST AS P
                INNER JOIN PRO_BOM_MST AS PM ON PM.id=P.bom_id
                INNER JOIN MASTER_ASSET AS AC ON AC.id= P.asset_id
                INNER JOIN MASTER_ITEM AS I ON I.id= P.item_master_id 
                LEFT JOIN MASTER_UOM AS U ON U.uom_id= I.uom_id
                WHERE  P.bom_id = ${id} AND PM.isDeleted = false `
            )
            const Obj = {
                ...data[0][0],
                bomDetails: dataValue[0]
            }
            return res.status(200).send({ code: 200, message: "success", data: Obj })
        }
        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "success", data: data[0] })
        } else {
            return res.status(404).send({ code: 404, message: 'data not found', data: data })
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });

    }
}

module.exports.bomStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }
        const getData = await db.bom.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await db.bom.update(
                {
                    status,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).send({
                code: 200,
                message: "BOM Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

module.exports.bomDelete = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await db.bom.findOne({ where: { id: id } });
        if (getAllData) {
            await db.bom.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "BOM is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

module.exports.updateBom = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const { bom_type, product_id, product_variant, bomDetails, employee_id } = req.body;
            const existingBom = await db.bom.findOne({ where: { id: id, status: "ACTIVE" ,isDeleted:false} });
            if (existingBom) {
                await db.bom.update({
                    bom_type, product_id, product_variant, employee_id
                }, { where: { id: id, status: "ACTIVE" } });
                await db.bomDetails.destroy({
                    where: { bom_id: id }
                })
                await Promise.all(bomDetails.map(async (item) => {
                    const { bom_qty, type, scrape, scrape_reuseable, asset_id, item_master_id, } = item;
                    return await db.bomDetails.create({
                        bom_qty, type, scrape, scrape_reuseable,
                        asset_id, item_master_id,
                        bom_id: id
                    })
                }))
                return res.status(200).send({
                    code: 200, message: "BOM update Successfully!",
                });
            } else {
                return res.status(404).send({ code: 404, message: "BOM not found" });
            }
        } else {
            return res.status(404).send({ code: 404, message: "ID not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

module.exports.get_Bom_By_Type = async (req, res) => {
    try {
        const bom_type = req.body.bom_type;
        const getData = await bom.findAll({
            where: { bom_type: bom_type },
            attributes: ["product_id"]
        });
        if (getData.length > 0) {
            const productName = getData.map(item => item.product_id);
            var getData2 = await product_master.findAll({
                where: { id: productName }
            });
            return res.status(200).send({
                code: 200, message: "Data Fetched Successfully", result: getData2
            });
        }
        else {
            return res.status(404).send({ code: 404, message: "BOM not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

module.exports.productVarient = async (req, res) => {
    try {
        const product_id = req.params.id
        const getProduct = await bom.findAll({
            where: {
                product_id: product_id
            },
            attributes: ["product_variant", "product_id"]
        })
        if (getProduct) {
            return res.status(200).send({
                code: 200, message: "Data Fetched Successfully", productName: getProduct
            })
        } else {
            return res.status(404).send({ code: 404, message: "Product Variant Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

module.exports.getAllItems = async (req, res) => {
    try {
        const product_id = req.params.id;
        const product_variant = req.body.product_variant;
        const getData = await bom.findOne({
            where: {
                [Op.and]: [
                    { product_id: product_id },
                    { product_variant: product_variant }
                ]
            },
            attributes: ["id"]
        });
        if (!getData) {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }

        const list1 = await item_details.findAll({
            include: [{
                model: bomDetails,
                where: { bom_id: getData.id },
                attributes: ["bom_qty"]
            }],
            where: {
                id: {
                    [Op.in]: Sequelize.literal(`(SELECT item_master_id FROM PRO_BOM_DETAILS_MST WHERE bom_id = ${getData.id})`),
                }
            },
            attributes: ["id", "item_name", "item_code", "item_document", "MVP"]
        });

        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully",
            data: list1
        });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


module.exports.BOM_get_id = async (req, res) => {
    try {
        const asset_id = req.params.id;
        const getData = await db.asset.findAll({
            where: { id: asset_id, isDeleted: false },
            attributes: ["id", "asset_category_name"],
            include: [
                {
                    model: db.ItemMaster,
                    attributes: ["item_name", "item_code","id"],
                    include: [
                        { model: db.uomdetails, attributes: ["uom_name"] },
                    ]
                }
            ]
        });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Get Data Succssesfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};







