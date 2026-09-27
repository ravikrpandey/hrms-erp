const db = require('../../../models/index');
const basketdb = db.Master_basket
const logger = require('../../../../logger/index');

const generateItemCode = async (transaction) => {
    try {
        const lastItem = await db.ItemMaster.findOne({
            order: [['id', 'DESC']],
            attributes: ['item_code', 'id'],
            transaction
        });

        const newId = lastItem ? lastItem.id + 1 : 1;
        return `BSKT${newId.toString().padStart(5, '0')}`;
    } catch (error) {
        return `BSKT${Date.now().toString().slice(-5)}`;
    }
};

exports.create_basket = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { type_of_basket, no_of_partition, basket_qty, price_per_unit, entity_id, hsn_code_id, uom_id } = req.body;
        const existingbasket = await basketdb.findOne({
            where: {
                type_of_basket: type_of_basket,
                entity_id: entity_id,
                isDeleted: false
            },
            transaction: t
        });

        if (existingbasket) {
            await t.rollback();
            return res.status(403).send({ code: 403, message: "Basket Type Already Exists" });
        }

        const newBasket = await basketdb.create({
            type_of_basket: type_of_basket,
            no_of_partition: no_of_partition,
            basket_qty: basket_qty,
            price_per_unit: price_per_unit,
            hsn_code_id: hsn_code_id,
            entity_id: entity_id,
            uom_id: uom_id
        }, { transaction: t });

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Basket", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
            transaction: t
        });

        const asset = await db.asset.findOne({
            where: { asset_category_name: "Basket", isDeleted: false },
            attributes: ["id"],
            transaction: t
        });

        const subCategory = await db.SubCategory.findOne({
            where: { sub_category_name: "Basket", isDeleted: false },
            attributes: ["id"],
            transaction: t
        });

        if (itemType) {
            let item_code = req.body.item_code;
            if (!item_code) {
                item_code = await generateItemCode(t);
            }

            await db.ItemMaster.create({
                item_name: type_of_basket,
                item_type_id: itemType.id,
                hsn_code_id: hsn_code_id,
                uom_id: uom_id,
                entity_id: entity_id,
                MVP: price_per_unit,
                MRP: price_per_unit,
                item_code: item_code,
                asset_id: asset ? asset.id : null,
                sub_category_id: subCategory ? subCategory.id : null,
                basket_id: newBasket.id
            }, { transaction: t });
        }

        await t.commit();
        return res.status(200).send({ code: 200, message: "Basket Created Successfully", data: newBasket });

    } catch (error) {
        await t.rollback();
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};



exports.getAllBasket = async (req, res) => {
    try {
        const entity_id = req.params.entity_id;

        const basket = await db.sequelize.query(
            `SELECT 
                A.*, 
                HSN.hsn_sac_code AS basket_hsn_code,
                GRM.value AS basket_gst_value,U.uom_name
             FROM MASTER_BASKET AS A
             INNER JOIN MASTER_ITEM AS MI ON MI.basket_id = A.id
             LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = A.hsn_code_id
             LEFT JOIN GST_RATE_MASTER AS GRM ON GRM.id = HSN.gst_rate_id
             LEFT JOIN MASTER_UOM AS U ON U.uom_id=A.uom_id
             WHERE A.isDeleted = false 
             AND A.entity_id = :entity_id 
             ORDER BY A.id DESC`,
            {
                replacements: { entity_id }, // safely inject parameter
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (basket.length > 0) {
            return res.status(200).send({ code: 200, message: "All Basket Found", data: basket });
        } else {
            return res.status(404).send({ code: 404, message: "No Basket Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};



exports.get_basket_by_id = async (req, res) => {
    try {
        const basketId = req.params.id;

        const baskets = await basketdb.sequelize.query(
            `SELECT MB.*, MHSC.hsn_sac_code,grm.value
             FROM MASTER_BASKET MB
             LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC ON MHSC.id = MB.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS grm ON grm.id = MHSC.gst_rate_id
             WHERE MB.id = :basketId 
               AND MB.isDeleted = false
             LIMIT 1`,
            {
                replacements: { basketId },
                type: basketdb.sequelize.QueryTypes.SELECT
            }
        );

        if (!baskets || baskets.length === 0) {
            return res.status(404).send({ code: 404, message: "Basket not found" });
        }

        return res.status(200).send({ code: 200, message: "Success", data: baskets[0] });
    } catch (error) {
        console.error("Error:", error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message });
    }
};



exports.update_basket_by_id = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const basketId = req.params.id;
        const { type_of_basket, no_of_partition, basket_qty, price_per_unit, hsn_code_id, uom_id, entity_id } = req.body;

        let basket = await basketdb.findOne({ where: { id: basketId, isDeleted: false }, transaction: t });

        if (!basket) {
            await t.rollback();
            return res.status(404).send({ code: 404, message: "Basket not found" });
        }

        const existingBasket = await basketdb.findOne({
            where: {
                type_of_basket: type_of_basket,
                entity_id: entity_id,
                isDeleted: false,
                id: { [db.Sequelize.Op.ne]: basketId }
            },
            transaction: t
        });

        if (existingBasket) {
            await t.rollback();
            return res.status(409).send({ code: 409, message: "Basket Already Exists" });
        }

        const oldBasketType = basket.type_of_basket;

        await basketdb.update({
            type_of_basket, no_of_partition, basket_qty, price_per_unit, hsn_code_id, uom_id
        }, {
            where: { id: basketId },
            transaction: t
        });

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Basket", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
            transaction: t
        });

        const asset = await db.asset.findOne({
            where: { asset_category_name: "Basket", isDeleted: false },
            attributes: ["id"],
            transaction: t
        });

        const subCategory = await db.SubCategory.findOne({
            where: { sub_category_name: "Basket", isDeleted: false },
            attributes: ["id"],
            transaction: t
        });

        if (itemType) {
            let item_code = null;

            const item = await db.ItemMaster.findOne({
                where: {
                    item_name: oldBasketType,
                    item_type_id: itemType.id,
                    entity_id: entity_id
                },
                transaction: t
            });

            if (item) {
                await item.update({
                    item_name: type_of_basket,
                    hsn_code_id: hsn_code_id,
                    uom_id: uom_id,
                    MVP: price_per_unit,
                    MRP: price_per_unit,
                    item_code: item_code || item.item_code,
                    asset_id: asset ? asset.id : null,
                    sub_category_id: subCategory ? subCategory.id : null,
                    basket_id: basketId
                }, { transaction: t });
            } else {
                if (!item_code) {
                    item_code = await generateItemCode(t);
                }
                await db.ItemMaster.create({
                    item_name: type_of_basket,
                    item_type_id: itemType.id,
                    hsn_code_id: hsn_code_id,
                    uom_id: uom_id,
                    entity_id: entity_id,
                    MVP: price_per_unit,
                    MRP: price_per_unit,
                    item_code: item_code,
                    asset_id: asset ? asset.id : null,
                    sub_category_id: subCategory ? subCategory.id : null,
                    basket_id: basketId
                }, { transaction: t });
            }
        }

        await t.commit();

        const updatedBasket = await basketdb.findOne({ where: { id: basketId, isDeleted: false } });

        return res.status(200).send({ code: 200, message: "Basket updated successfully", data: updatedBasket });

    } catch (error) {
        await t.rollback();
        console.error("Error:", error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.delete_Basket_by_id = async (req, res) => {
    try {
        const basketId = req.params.id
        const dltStage = await basketdb.findOne({ where: { id: basketId } });
        if (dltStage) {
            const deleteData = await basketdb.update({ isDeleted: true }, { where: { id: basketId } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


