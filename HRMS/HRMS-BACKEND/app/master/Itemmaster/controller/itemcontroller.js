const db = require("../../../models/index");
const Sequelize = require('sequelize');
const itemSpecifications = db.itemSpecification;
const MASTER_ITEM = db.ItemMaster;
const asset = db.asset
const MASTER_UOM = db.uom

//============= Create Item ==============//

exports.createItem = async (req, res) => {
    try {
        const {
            asset_id, item_name, MVP, uom_id, manage_by, Bar_QR_Code, description, threshold_stock
        } = req.body;
        const allItemSpecification = req.body.itemSpecification;
        let main_specification = JSON.parse(allItemSpecification);

        const item_code = btoa(Math.random()).slice(0, 10).toUpperCase();
        let image = "";
        if (req.file && req.file['filename'] && req.file['filename'].length > 0) {
            image = req.file.path;
        } else {
            image = "";
        }
        const Item = await MASTER_ITEM.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { item_name },
                    { item_code }
                ]
            }
        })

        const item2 = await MASTER_ITEM.findOne({
            where: {
                item_name:item_name,asset_id:asset_id
            }
        })
        if (Item || item2) {
            return res.status(403).send({ code: 403, message: "Item Already Exists" });
        } else if (!Item && !item2) {
            const item_image = image.replace(/\\/g, '/');
            const createData = await MASTER_ITEM.create({
                item_name, asset_id, item_code, MVP, uom_id, manage_by, Bar_QR_Code, threshold_stock,
                description, item_document: item_image
            })
            let response;
            if (createData) {
                for (let i = 0; i < main_specification.length; i++) {
                    response = await itemSpecifications.create({
                        item_id: createData.id,
                        specificationType: main_specification[i].specificationType,
                        specificationDetails: main_specification[i].specificationDetails
                    });
                }
            }
            return res.status(200).json({
                code: 200, message: "Item Created Successfully",
                data: { ...createData, ItemSpecification: response },
            })
        }
    } catch (error) {
        console.error("Error", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" })
    }
}

exports.getAllItem = async (req, res) => {
    try {
        const serviceData = await MASTER_ITEM.findAll({
            where: { isDeleted: false },
            include: [
                { model: asset },
                { model: MASTER_UOM },
                { model: itemSpecifications, where: { isDeleted: false } }
            ],
            order: [['id', 'DESC']],
        });

        const [countData] = await db.sequelize.query(
            `SELECT DISTINCT(GI.Item_Id) as Item_Id, sim.Total_inventory,sim.status AS inventory_status,
            (SELECT SUM(GI_sub.selection_item)
            FROM GRN_SUBMASTER_ITEM AS GI_sub WHERE GI_sub.Item_Id = GI.Item_Id) AS selection_item
            FROM GRN_MASTER AS G
            INNER JOIN PROCUREMENT_PO_MASTER AS P ON P.id = G.PO_Id
            INNER JOIN GRN_SUBMASTER_ITEM AS GI ON GI.grn_Id = G.id
            LEFT JOIN (
                SELECT Item_id, Total_inventory,status
                FROM INVENTORY_MASTER
                WHERE (Item_id, createdAt) IN (
                    SELECT Item_id, MAX(createdAt) AS createdAt
                    FROM INVENTORY_MASTER
                    GROUP BY Item_id
                )
            ) AS sim ON sim.Item_id = GI.Item_Id 
            INNER JOIN MASTER_ITEM AS I ON I.id = GI.Item_Id
            INNER JOIN GRN_UNDER_SUBMASTER_ITEM_STATUS AS GIS ON GIS.grn_Item_Id = GI.id
            WHERE P.status='ACTIVE' AND P.isDeleted='0' AND GI.updatedAt = (
                    SELECT MAX(GI_updated.updatedAt)
                    FROM GRN_SUBMASTER_ITEM AS GI_updated
                    WHERE GI_updated.grn_Id = G.id
            )
        `);
        const inventoryMap = countData.reduce((acc, inventoryDetail) => {
            if (!acc[inventoryDetail.Item_Id]) {
                acc[inventoryDetail.Item_Id] = {
                    totalInventory: inventoryDetail.Total_inventory,
                    selectionItem: inventoryDetail.selection_item,
                    inventory_status : inventoryDetail.inventory_status
                };
            }
            return acc;
        }, {});
     
        const detailedServiceData = serviceData.map(item => {
            const inventoryDetail = inventoryMap[item.id] || {};
            const totalItemCount = inventoryDetail.totalInventory || 0;
            const selectionItem = inventoryDetail.selectionItem || 0;
            
            return {
                ...item.dataValues,
                totalItemCount: totalItemCount === 0 ? selectionItem : totalItemCount,
                inventory_status: inventoryDetail.inventory_status
            };
        });
        

        return res.status(200).send({code: 200,message: "Get All Item data successfully",data: detailedServiceData});
    } catch (error) {
        return res.status(500).send({code: 500, message: error.message || "Internal Server Error"
        });
    }
};


exports.getAllItemByAsset = async (req, res) => {
    try {
        serviceData = await MASTER_ITEM.findAll({
            where: {
                isDeleted: false,
                asset_id: req.params.id
            },
            include: [
                {
                    model: asset,
                },
                {
                    model: MASTER_UOM,
                },
                {
                    model: itemSpecifications,
                    where: { isDeleted: false }
                }
            ],
            order: [['id', 'DESC']],
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.getItemById = async (req, res) => {
    try {
        const item_id = req.params.id;
        serviceData = await MASTER_ITEM.findOne({
            where: {
                id: item_id,
                isDeleted: false
            },
            include: [
                {
                    model: asset,
                },
                {
                    model: MASTER_UOM,
                },
                {
                    model: itemSpecifications,
                    where: { isDeleted: false }
                }
            ],
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get Item data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.updateItemMaster = async (req, res) => {
    try {
        const Item_id = req.params.id
        const {
            asset_id, item_name, MVP, uom_id, manage_by, Bar_QR_Code, description, threshold_stock
        } = req.body;

        const getAllData = await MASTER_ITEM.findOne({
            include: [
                {
                    model: itemSpecifications
                }
            ],
            where: { id: Item_id }
        });
        const allItemSpecification = req.body.itemSpecification || '[]'
        let main_specification = JSON.parse(allItemSpecification);

        let image = "";
        if (req.file && req.file['filename'] && req.file['filename'].length > 0) {
            image = req.file.path;
        } else {
            image = "";
        }

        if (getAllData) {
            const item_image = image.replace(/\\/g, '/');
            const updateData = await MASTER_ITEM.update({
                asset_id, item_name, MVP, uom_id, manage_by, Bar_QR_Code, threshold_stock, description, item_document: item_image
            },
                {
                    where: { id: Item_id }
                });
            let response;
            if (updateData) {
                await itemSpecifications.destroy({ where: { item_id: Item_id } });

                for (let i = 0; i < main_specification.length; i++) {
                    response = await itemSpecifications.create({
                        item_id: Item_id,
                        specificationType: main_specification[i].specificationType,
                        specificationDetails: main_specification[i].specificationDetails
                    });
                }

                const updatedItemWithSpecifications = await MASTER_ITEM.findOne({
                    include: [{
                        model: itemSpecifications
                    }],
                    where: { id: Item_id },
                });

                return res.status(200).send({
                    code: 200,
                    message: "Item updated successfully",
                    data: updatedItemWithSpecifications
                });
            }
        } else {
            return res.status(404).send({ code: 403, message: "Data not found" });
        };
    } catch (error) {
        console.error(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.deleteItemMaster = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await MASTER_ITEM.findOne({ where: { id: id } });
        if (getAllData) {
            await MASTER_ITEM.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Item is Deleted Successfully!", });
        } else {
            return res.status(404).send({ code: 403, message: "Data not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
}

exports.updateItemStatus = async (req, res) => {
    try {
        const Item_id = req.params.itemId;
        const { status } = req.body;
        const editData = await MASTER_ITEM.findOne({ where: { id: Item_id } });
        if (editData) {
            const updateData = await MASTER_ITEM.update(
                {
                    status
                }, { where: { id: Item_id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}





