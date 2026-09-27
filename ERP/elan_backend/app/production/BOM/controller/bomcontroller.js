const { list } = require("pdfkit");
const db = require("../../../models/index");
const { Op } = require("sequelize");
const product_master = db.product_master;
const bom = db.bom;
const bomDetails = db.bomDetails;
const item_details = db.ItemMaster;
const asset_details = db.asset;
const Sequelize = require("sequelize");

module.exports.createBom = async (req, res) => {
    try {
        const { bom_type, product_id, product_category_id, product_code, sfg_id, bomDetails, employee_id,entity_id,financial_year_id } = req.body;
        let createBom;
        if (bom_type == 'SFG') {
            const bomExists = await db.bom.findOne({
                where: { bom_type, sfg_id, isDeleted: false }
            });
            if (bomExists) {
                return res.status(404).send({ code: 404, message: "BOM Already Exists!" });
            }
            createBom = await db.bom.create({
                bom_type,
                sfg_id,
                employee_id,
                financial_year_id,
                entity_id
            });

        } else {
            const bomExists = await db.bom.findOne({
                where: { bom_type, product_category_id, product_id, isDeleted: false }
            });
            if (bomExists) {
                return res.status(404).send({ code: 404, message: "BOM Already Exists!" });
            }
            createBom = await db.bom.create({
                bom_type,
                product_category_id,
                product_id,
                employee_id,
                financial_year_id,
                entity_id
            });

        }
        if (createBom) {
            const dataValue = Promise.all(bomDetails.map((item) => {
                const { bom_qty, item_type_id, type, scrape, asset_id, item_master_id, scrape_reuseable } = item;
                return db.bomDetails.create({
                    item_type_id,
                    bom_qty,
                    type,
                    scrape,
                    scrape_reuseable,
                    asset_id,
                    item_master_id,
                    bom_id: createBom.id
                });
            }))
            return res.status(201).send({ code: 200, message: "BOM Created Successfully" });
        } else {
            return res.status(404).send({ code: 404, message: "BOM not Created" })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

module.exports.getBomAll = async (req, res) => {
    try {
        const financial_year_id = req.params.financial_year_id;
        const entity_id = req.params.entity_id;
        const getData = await bom.findAll({
            where: { isDeleted: 0,entity_id,financial_year_id },
            include: [
                {
                    model:item_details,
                    attributes:[
                        ['id', 'sfg_id'],
                        ['item_name', 'sfg_name']
                    ]
                },
                {
                    model: product_master,
                    attributes: ['id', 'product_name', 'product_code']
                },
                {
                    model: db.productcategory,
                    attributes: ['id', 'category_name']
                },
                {
                    model: db.user,
                    attributes: ['employee_id', 'first_name', 'middle_name', 'last_name']
                },
            ]
        });
        if (getData.length > 0) {
            return res.status(200).send({ code: 200, message: "success", data: getData })
        } else {
            return res.status(404).send({ code: 404, message: 'data not found', data: getData })
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });

    }
}
module.exports.getBomDetailById = async (req, res) => {
    try {
        const bom_id = req.params.id;
        const getData = await bom.findOne({
            where: { isDeleted: 0, id: bom_id },
            include: [
                {
                    model: bomDetails,
                    where: { isDeleted: 0 }
                },
                {
                    model: product_master,
                    attributes: ['id', 'product_name', 'product_code','product_rating','product_description']
                },
                {
                    model: db.productcategory,
                    attributes: ['id', 'category_name']
                },
                {
                    model: db.product__variant_master,
                    attributes: ['product_variant_code', 'variant_name']
                },
                {
                    model: db.user,
                    attributes: ['employee_id', 'first_name', 'middle_name', 'last_name']
                }
            ]
        });
        if (getData) {
            return res.status(200).send({ code: 200, message: "success", data: getData })
        } else {
            return res.status(404).send({ code: 404, message: 'data not found', data: getData })
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
            return res.status(404).send({ code: 403, message: "BOM not found" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

module.exports.updateBom = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const { bom_type, product_id, product_category_id, product_subcategory_id, product_code, sfg_id, bomDetails, employee_id } = req.body;
            const getBom = await db.bom.findOne({ where: { id: id, status: "ACTIVE", isDeleted: false } });
            if (getBom) {
                let updateBom;
                if (bom_type == 'SFG') {
                    updateBom = await db.bom.update({
                        bom_type,
                        sfg_id,
                        employee_id
                    },
                        { where: { id: id, status: "ACTIVE" } }
                    );

                } else {
                    updateBom = await db.bom.update({
                        bom_type,
                        product_category_id,
                        product_subcategory_id,
                        product_id,
                        employee_id
                    }, { where: { id: id, status: "ACTIVE" } });

                }
                if (updateBom) {
                    await db.bomDetails.destroy({
                        where: { bom_id: id }
                    });
                    await Promise.all(bomDetails.map(async (item) => {
                        const { bom_qty, item_type_id, type, scrape, asset_id, item_master_id, scrape_reuseable } = item;
                        return await db.bomDetails.create({
                            bom_qty,item_type_id,type, scrape, scrape_reuseable,
                            asset_id, item_master_id,
                            bom_id: id
                        })
                    }))
                }
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
                    attributes: ["item_name", "item_code", "id"],
                    include: [
                        { model: db.uom, attributes: ["uom_name"] },
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

module.exports.SFG_data_by_id = async (req, res) => {
    try {
        const { item_type, item_master_id } = req.body;

        const getBomData = await db.bom.findOne({
            where: {
                bom_type: item_type,
                sfg_id: item_master_id,
                isDeleted: false
            },
        });

        if (!getBomData) {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

        const bomId = getBomData.id;
        
        const proBomDetails = await db.bomDetails.findAll({
            where: { bom_id: bomId },
            include:[
                {
                 model:item_details
                },
                {
                    model:asset_details
                },
                {
                    model:db.tbl_itemType
                }
            ]
        });

        if (!proBomDetails.length) {
            return res.status(404).send({ code: 404, message: "No Details Found for this BOM ID" });
        }
        return res.status(200).send({
            code: 200,
            message: "Data Retrieved Successfully",
            data:proBomDetails,

        });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
