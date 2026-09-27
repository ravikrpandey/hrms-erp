const db = require("../../../models/index");

const logger = require('../../../../logger/index');

exports.createPrice = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { customer_type_id, customer_id, itemList, category_id, subcategory_id, entity_id, financial_year_id } = req.body;

        let isExistItem = await db.price_master.findOne({
            where: {
                entity_id: entity_id,
                financial_year_id: financial_year_id,
                category_id: category_id,
                subcategory_id: subcategory_id,
                customer_id: customer_id,
                customer_type_id: customer_type_id,
                isDeleted: false,
                status: 'ACTIVE'
            }
        })

        if (isExistItem) {
            return res.status(400).send({ code: 400, message: "Customer Already Exist with Same category, subcategory." })
        }

        const response = await db.price_master.create(
            { customer_type_id, customer_id, category_id, subcategory_id, entity_id, financial_year_id },
            { transaction: t }
        );


        if (response && itemList?.length) {
            for (const elem of itemList) {
                await db.priceMasterItem.create(
                    {
                        discount_1: elem.discount_1,
                        discount_2: elem.discount_2,
                        discount_3: elem.discount_3,
                        discount1Flat: elem.discount1Flat,
                        discount2Flat: elem.discount2Flat,
                        discount3Flat: elem.discount3Flat,
                        price_master_id: response.id,
                        final_price: elem.final_price,
                        rest_price: elem.rest_price,
                        item_id: elem.item_id,

                    },
                    { transaction: t }
                );
            }
        }

        await t.commit();
        return res.status(200).send({ code: 200, message: "Price Created Successfully" });

    } catch (error) {
        await t.rollback();
        logger.error(`Transaction Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllPrice = async (req, res) => {
    try {
        let { entity_id, financial_year_id } = req.query;

        entity_id = entity_id ? parseInt(entity_id) : null;
        financial_year_id = financial_year_id ? parseInt(financial_year_id) : null;

        let whereClause = "pm.isDeleted = false";
        let replacements = {};

        if (entity_id) {
            whereClause += " AND pm.entity_id = :entity_id";
            replacements.entity_id = entity_id;
        }

        if (financial_year_id) {
            whereClause += " AND pm.financial_year_id = :financial_year_id";
            replacements.financial_year_id = financial_year_id;
        }

        const sql = `
            SELECT 
                pm.id, 
                pm.status, 
                em.entity_name,
                mct.customer_type_name,
                cpm.company_name,
                cpm.customer_code,
                cpm.data_status AS customer_status,
                ma.asset_category_name,
                msc.sub_category_name
            FROM MASTER_PRICE pm
            LEFT JOIN MASTER_ASSET AS ma ON ma.id = pm.category_id
            LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = pm.subcategory_id
            LEFT JOIN ENTITY_MASTER em ON pm.entity_id = em.id
            LEFT JOIN MASTER_CUSTOMER_TYPE mct ON mct.id = pm.customer_type_id
            LEFT JOIN CUSTOMER_PROFILE_MST cpm ON cpm.id = pm.customer_id

            WHERE ${whereClause}
            ORDER BY pm.id DESC
        `;

        const priceData = await db.sequelize.query(sql, {
            replacements,
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (priceData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Get All Price data successfully",
                data: priceData
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Data found",
                data: []
            });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error fetching price data: ", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


exports.getByIdPrice = async (req, res) => {
    try {
        const priceId = req.params.id ? parseInt(req.params.id) : null;

        if (!priceId) {
            return res.status(400).send({
                code: 400,
                message: "Invalid Price ID"
            });
        }

        const sql = `
            SELECT 
                pm.*,
                em.entity_name,
                mct.customer_type_name,
                cpm.company_name,
                cpm.customer_code,
                cpm.data_status AS customer_status
            FROM MASTER_PRICE pm
            LEFT JOIN ENTITY_MASTER em ON pm.entity_id = em.id
            LEFT JOIN MASTER_CUSTOMER_TYPE mct ON mct.id = pm.customer_type_id
            LEFT JOIN CUSTOMER_PROFILE_MST cpm ON cpm.id = pm.customer_id
            WHERE pm.id = :priceId AND pm.isDeleted = false
            LIMIT 1
        `;

        const priceData = await db.sequelize.query(sql, {
            replacements: { priceId },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (priceData.length === 0) {
            return res.status(404).send({
                code: 404,
                message: "Record Not Found",
                data: []
            });
        }

        // Fetch price item list also
        const sqlItems = `
            SELECT 
                mip.*, mi.item_name, mi.MVP, mi.MRP
            FROM MASTER_ITEM_PRICE mip
            LEFT JOIN MASTER_ITEM AS mi ON mi.id = mip.item_id
            WHERE mip.price_master_id = :priceId
              AND mip.isDeleted = false
        `;

        const disList = await db.sequelize.query(sqlItems, {
            replacements: { priceId },
            type: db.Sequelize.QueryTypes.SELECT
        });

        const finalData = {
            ...priceData[0],
            disList
        };

        return res.status(200).send({
            code: 200,
            message: "Fetch Data Successfully",
            data: finalData
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error fetching price data by id: ", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


exports.updatePriceById = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const id = req.params.id ? parseInt(req.params.id) : null;
        if (!id) {
            return res.status(400).send({ code: 400, message: "Invalid ID" });
        }

        const { customer_type_id, customer_id, itemList, category_id, subcategory_id, entity_id, financial_year_id } = req.body;

        // Check record exists or not
        const existing = await db.price_master.findOne({
            where: { id, isDeleted: false },
            transaction: t
        });


        if (!existing) {
            await t.rollback();
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

        // Update main price_master record
        await db.price_master.update(
            { customer_type_id, customer_id, category_id, subcategory_id, entity_id, financial_year_id },
            { where: { id }, transaction: t }
        );

        if (itemList && itemList.length > 0) {
            // Delete old items (soft delete OR hard delete as per your requirement)
            await db.priceMasterItem.destroy({
                where: { price_master_id: id },
                transaction: t
            });

            // Insert updated itemList
            for (const elem of itemList) {
                await db.priceMasterItem.create(
                    {
                        discount_1: elem.discount_1,
                        discount_2: elem.discount_2,
                        discount_3: elem.discount_3,
                        discount1Flat: elem.discount1Flat,
                        discount2Flat: elem.discount2Flat,
                        discount3Flat: elem.discount3Flat,
                        final_price: elem.final_price,
                        rest_price: elem.rest_price,
                        price_master_id: id,
                        item_id: elem.item_id,
                    },
                    { transaction: t }
                );
            }
        }

        await t.commit();
        return res.status(200).send({ code: 200, message: "Price Updated Successfully" });

    } catch (error) {
        await t.rollback();
        logger.error(`Transaction Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.priceStatus = async (req, res) => {
    try {
        const id = req.params.id ? parseInt(req.params.id) : null;
        const { status } = req.body;

        if (!id) {
            return res.status(400).send({ code: 400, message: "Invalid Price ID" });
        }

        const getData = await db.price_master.findOne({
            where: { id, isDeleted: false }
        });

        if (!getData) {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

        await db.price_master.update(
            { status },
            { where: { id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Price Status Changed Successfully!"
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.deletePrice = async (req, res) => {
    try {
        const id = req.params.id ? parseInt(req.params.id) : null;

        if (!id) {
            return res.status(400).send({ code: 400, message: "Invalid Price ID" });
        }

        const existing = await db.price_master.findOne({
            where: { id, isDeleted: false }
        });

        if (!existing) {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

        await db.price_master.update(
            { isDeleted: true },
            { where: { id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Price Deleted Successfully!"
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


