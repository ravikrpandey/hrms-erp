const db = require("../../../models/index");


const { Op } = require('sequelize');

const generateItemCode = async (transaction) => {
    try {
        const lastItem = await db.ItemMaster.findOne({
            where: {
                item_code: {
                    [Op.like]: 'ACESR%'
                }
            },
            order: [['item_code', 'DESC']],
            attributes: ['item_code'],
            transaction
        });

        let newId = 1;
        if (lastItem && lastItem.item_code) {
            const numStr = lastItem.item_code.replace('ACESR', '');
            const parsed = parseInt(numStr, 10);
            if (!isNaN(parsed)) {
                newId = parsed + 1;
            }
        } else {
            const lastById = await db.ItemMaster.findOne({
                order: [['id', 'DESC']],
                attributes: ['id'],
                transaction
            });
            newId = lastById ? lastById.id + 1 : 1;
        }

        return `ACESR${newId.toString().padStart(5, '0')}`;
    } catch (error) {
        return `ACESR${Date.now().toString().slice(-5)}`;
    }
};

exports.create_accessories_master = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const {
            asset_id,
            sub_category_id,
            financial_year_id,
            entity_id,
            accesseryArray,
        } = req.body;

        if (!asset_id || !sub_category_id || !financial_year_id || !entity_id) {
            await t.rollback();
            return res.status(400).json({
                code: 400,
                message: "Missing required fields"
            });
        }

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Accessory", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
            transaction: t
        });

        if (!itemType) {
            await t.rollback();
            return res.status(404).json({
                code: 404,
                message: "Accessory item type not found"
            });
        }
        // item_code generation moved inside loop

        const isExist = await db.ItemMaster.findOne({
            where: {
                item_type_id: itemType.id,
                asset_id,
                sub_category_id,
                isDeleted: false,
                financial_year_id,
                entity_id
            },
            transaction: t
        });

        if (isExist) {
            await t.rollback();
            return res.status(409).json({
                code: 409,
                message: "Accessories already exist"
            });
        }

        const newMaster = await db.accessories_master.create({
            accessories_cat_id: asset_id,
            sub_category_id: sub_category_id,
            financial_year_id: financial_year_id,
            entity_id: entity_id,
            status: "ACTIVE",
            isDeleted: false
        }, { transaction: t });

        const saveData = [];
        for (let item of accesseryArray) {
            let item_code = req.body.item_code;
            if (!item_code) {
                item_code = await generateItemCode(t);
            }

            const newAccessoryName = await db.accessories_mst_name.create({
                accessories_mst_id: newMaster.id,
                accessories_name: item.item_name,
                accessories_price: item.accessories_price,
                accessories_doc: item.accessories_doc,
                removal_qty: item.removal_qty,
                fitment_qty: item.fitment_qty,
                status: "ACTIVE",
                isDeleted: false
            }, { transaction: t });

            const newItem = await db.ItemMaster.create({
                item_type_id: itemType.id,
                item_name: item.item_name,
                item_code: item_code,
                hsn_code_id: item.hsn_code_id,
                uom_id: item.uom_id,
                asset_id,
                sub_category_id,
                financial_year_id,
                entity_id,
                MVP: item.accessories_price,
                MRP: item.accessories_price,
                removal_qty: item.removal_qty,
                fitment_qty: item.fitment_qty,
                isDeleted: false,
                accessories_doc: item.accessories_doc,
                accessory_id: newAccessoryName.id
            }, { transaction: t });
            saveData.push(newItem);
        }

        await t.commit();
        return res.status(201).json({
            code: 201,
            message: "Accessories created successfully",
            data: saveData
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.getAll_accessories_master = async (req, res) => {
    try {
        const { financial_year_id, entity_id } = req.query;

        if (!financial_year_id || !entity_id) {
            return res.status(400).json({
                code: 400,
                message: "Missing required parameters: financial_year_id, entity_id"
            });
        }

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Accessory", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
        });

        if (!itemType) {
            return res.status(404).json({
                code: 404,
                message: "Accessory item type not found"
            });
        }

        const accessoriesList = await db.sequelize.query(
            `
            SELECT MIN(ma.id) as id, ma.asset_id, ma.sub_category_id, ast.asset_category_name, msc.sub_category_name
            FROM MASTER_ITEM AS ma
            LEFT JOIN MASTER_ASSET AS ast ON ast.id = ma.asset_id
            LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = ma.sub_category_id
            WHERE ma.isDeleted = false
              AND ma.entity_id = :entity_id
              AND ma.item_type_id = :item_type_id
            GROUP BY ma.asset_id, ma.sub_category_id, ast.asset_category_name, msc.sub_category_name
            ORDER BY MIN(ma.id) ASC 
            `,
            {
                replacements: { entity_id, item_type_id: itemType.id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (accessoriesList.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "Accessories not found"
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Accessories fetched successfully",
            data: accessoriesList
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.getAll_active_accessories = async (req, res) => {
    try {
        const { financial_year_id, entity_id } = req.query;

        if (!financial_year_id || !entity_id) {
            return res.status(400).json({
                code: 400,
                message: "Missing required parameters: financial_year_id, entity_id"
            });
        }

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Accessory", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
        });

        if (!itemType) {
            return res.status(404).json({
                code: 404,
                message: "Accessory item type not found"
            });
        }

        const activeAccessoriesList = await db.sequelize.query(
            `
            SELECT MIN(ma.id) as id, ma.asset_id as accessories_cat_id, ma.sub_category_id, ast.asset_category_name, msc.sub_category_name
            FROM MASTER_ITEM AS ma
            LEFT JOIN MASTER_ASSET AS ast ON ast.id = ma.asset_id
            LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = ma.sub_category_id
            WHERE ma.isDeleted = false
              AND ma.status = 'ACTIVE'
              AND ma.financial_year_id = :financial_year_id
              AND ma.entity_id = :entity_id
              AND ma.item_type_id = :item_type_id
            GROUP BY ma.asset_id, ma.sub_category_id, ast.asset_category_name, msc.sub_category_name
            ORDER BY MIN(ma.id) ASC
            `,
            {
                replacements: { financial_year_id, entity_id, item_type_id: itemType.id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (activeAccessoriesList.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "Active accessories not found"
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Active accessories fetched successfully",
            data: activeAccessoriesList
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.getById_accessories_master = async (req, res) => {
    try {
        const { id } = req.params;
        let { asset_id, sub_category_id } = req.query;

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Accessory", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
        });

        if (!itemType) {
            return res.status(404).json({
                code: 404,
                message: "Accessory item type not found"
            });
        }

        if (!asset_id || !sub_category_id) {
            if (!id) {
                return res.status(400).json({
                    code: 400,
                    message: "Missing required parameter: id or (asset_id and sub_category_id)"
                });
            }
            const baseItem = await db.ItemMaster.findOne({ where: { id: id, isDeleted: false } });
            if (!baseItem) {
                return res.status(404).json({
                    code: 404,
                    message: "Accessory not found"
                });
            }
            asset_id = baseItem.asset_id;
            sub_category_id = baseItem.sub_category_id;
        }

        const parentAccessory = await db.sequelize.query(
            `
            SELECT im.asset_id as accessories_cat_id, im.sub_category_id, ast.asset_category_name, msc.sub_category_name
            FROM MASTER_ITEM AS im
            LEFT JOIN MASTER_ASSET AS ast ON ast.id = im.asset_id
            LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = im.sub_category_id
            WHERE im.asset_id = :asset_id
              AND im.sub_category_id = :sub_category_id
              AND im.item_type_id = :item_type_id
              AND im.isDeleted = false
            LIMIT 1
            `,
            {
                replacements: { asset_id, sub_category_id, item_type_id: itemType.id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (!parentAccessory || parentAccessory.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "Accessory not found"
            });
        }

        const childAccessories = await db.sequelize.query(
            `
            SELECT MAN.id, MAN.item_name, MAN.hsn_code_id, MAN.uom_id, MAN.MVP as accessories_price, MAN.removal_qty, MAN.fitment_qty, MHSC.hsn_sac_code as hsn_name, grm.value as igst, u.uom_name
            FROM MASTER_ITEM AS MAN
            LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC ON MHSC.id = MAN.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS grm ON grm.id = MHSC.gst_rate_id
            LEFT JOIN MASTER_UOM AS u ON u.uom_id = MAN.uom_id
            WHERE MAN.asset_id = :asset_id
              AND MAN.sub_category_id = :sub_category_id
              AND MAN.item_type_id = :item_type_id
              AND MAN.isDeleted = false
            ORDER BY MAN.id ASC
            `,
            {
                replacements: {
                    asset_id,
                    sub_category_id,
                    item_type_id: itemType.id
                },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        const response = {
            ...parentAccessory[0],
            accesseryArray: childAccessories
        };

        return res.status(200).json({
            code: 200,
            message: "Accessory fetched successfully",
            data: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.delete_accessories_master = async (req, res) => {
    try {
        const { id } = req.params;
        let { asset_id, sub_category_id } = req.query;

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Accessory", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
        });

        if (!itemType) {
            return res.status(404).json({
                code: 404,
                message: "Accessory item type not found"
            });
        }

        if (!asset_id || !sub_category_id) {
            if (!id || id === 'undefined' || id === 'null') {
                return res.status(400).json({
                    code: 400,
                    message: "Missing required parameter: id or (asset_id and sub_category_id)"
                });
            }
            const baseItem = await db.ItemMaster.findOne({
                where: {
                    id,
                    isDeleted: false
                }
            });

            if (!baseItem) {
                return res.status(404).json({
                    code: 404,
                    message: "Accessories not found"
                });
            }
            asset_id = baseItem.asset_id;
            sub_category_id = baseItem.sub_category_id;
        }

        await db.ItemMaster.update(
            { isDeleted: true },
            {
                where: {
                    asset_id: asset_id,
                    sub_category_id: sub_category_id,
                    item_type_id: itemType.id
                }
            }
        );

        return res.status(200).json({
            code: 200,
            message: "Accessories deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.update_accessories_master = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const {
            asset_id,
            sub_category_id,
            financial_year_id,
            entity_id,
            accesseryArray = [],
            id
        } = req.body;

        if (!asset_id || !sub_category_id || !financial_year_id || !entity_id) {
            await t.rollback();
            return res.status(400).json({
                code: 400,
                message: "Missing required fields"
            });
        }

        const itemType = await db.tbl_itemType.findOne({
            where: { itemType: "Accessory", isDeleted: false, status: "ACTIVE" },
            attributes: ["id"],
            transaction: t
        });

        if (!itemType) {
            await t.rollback();
            return res.status(404).json({
                code: 404,
                message: "Accessory item type not found"
            });
        }

        // Determine original category and sub-category to handle deletions properly
        let original_asset_id = asset_id;
        let original_sub_category_id = sub_category_id;

        if (id) {
            const originalItem = await db.ItemMaster.findOne({
                where: { id: id, isDeleted: false },
                transaction: t
            });
            if (originalItem) {
                original_asset_id = originalItem.asset_id;
                original_sub_category_id = originalItem.sub_category_id;
            }
        }

        // Fetch all currently active items in the original group
        const existingItems = await db.ItemMaster.findAll({
            where: {
                asset_id: original_asset_id,
                sub_category_id: original_sub_category_id,
                item_type_id: itemType.id,
                isDeleted: false
            },
            attributes: ["id"],
            transaction: t
        });

        const incomingIds = accesseryArray.map(item => item.id).filter(id => id);
        const existingIds = existingItems.map(item => item.id);

        let masterRecord = await db.accessories_master.findOne({
            where: {
                accessories_cat_id: original_asset_id,
                sub_category_id: original_sub_category_id,
                isDeleted: false
            },
            transaction: t
        });

        if (!masterRecord) {
            masterRecord = await db.accessories_master.create({
                accessories_cat_id: asset_id,
                sub_category_id: sub_category_id,
                financial_year_id: financial_year_id,
                entity_id: entity_id,
                status: "ACTIVE",
                isDeleted: false
            }, { transaction: t });
        } else {
            await db.accessories_master.update({
                accessories_cat_id: asset_id,
                sub_category_id: sub_category_id,
                financial_year_id: financial_year_id,
                entity_id: entity_id
            }, { where: { id: masterRecord.id }, transaction: t });
        }

        // Delete any existing items that are not in the incoming array
        const idsToDelete = existingIds.filter(x => !incomingIds.includes(x));
        if (idsToDelete.length > 0) {
            await db.ItemMaster.update(
                { isDeleted: true },
                {
                    where: { id: idsToDelete },
                    transaction: t
                }
            );
            
            const itemsToDelete = await db.ItemMaster.findAll({
                where: { id: idsToDelete },
                attributes: ["accessory_id"],
                transaction: t
            });
            const accIdsToDelete = itemsToDelete.map(x => x.accessory_id).filter(id => id);
            if (accIdsToDelete.length > 0) {
                await db.accessories_mst_name.update(
                    { isDeleted: true },
                    {
                        where: { id: accIdsToDelete },
                        transaction: t
                    }
                );
            }
        }

        for (let item of accesseryArray) {
            if (item.id) {
                const existingItem = await db.ItemMaster.findByPk(item.id, { transaction: t });
                let item_code = existingItem ? existingItem.item_code : null;
                let accNameId = existingItem ? existingItem.accessory_id : null;

                if (!item_code) {
                    item_code = await generateItemCode(t);
                } else {
                    const count = await db.ItemMaster.count({
                        where: { item_code: item_code },
                        transaction: t
                    });
                    if (count > 1) {
                        item_code = await generateItemCode(t);
                    }
                }

                if (accNameId) {
                    await db.accessories_mst_name.update({
                        accessories_name: item.item_name,
                        accessories_price: item.accessories_price,
                        accessories_doc: item.accessories_doc,
                        removal_qty: item.removal_qty,
                        fitment_qty: item.fitment_qty,
                        hsn_code_id: item.hsn_code_id,
                        uom_id: item.uom_id
                    }, { where: { id: accNameId }, transaction: t });
                } else {
                    const newAccessoryName = await db.accessories_mst_name.create({
                        accessories_mst_id: masterRecord.id,
                        accessories_name: item.item_name,
                        accessories_price: item.accessories_price,
                        accessories_doc: item.accessories_doc,
                        removal_qty: item.removal_qty,
                        fitment_qty: item.fitment_qty,
                        hsn_code_id: item.hsn_code_id,
                        uom_id: item.uom_id,
                        status: "ACTIVE",
                        isDeleted: false
                    }, { transaction: t });
                    accNameId = newAccessoryName.id;
                }

                let updateData = {
                    item_type_id: itemType.id,
                    item_name: item.item_name,
                    item_code: item_code,
                    hsn_code_id: item.hsn_code_id,
                    uom_id: item.uom_id,
                    asset_id,
                    sub_category_id,
                    financial_year_id,
                    entity_id,
                    MVP: item.accessories_price,
                    MRP: item.accessories_price,
                    removal_qty: item.removal_qty,
                    fitment_qty: item.fitment_qty,
                    isDeleted: false,
                    accessories_doc: item.accessories_doc,
                    accessory_id: accNameId
                };
                if (req.body.item_code) {
                    updateData.item_code = req.body.item_code;
                }
                await db.ItemMaster.update(
                    updateData,
                    { where: { id: item.id }, transaction: t }
                );
            } else {
                let item_code = req.body.item_code;
                if (!item_code) {
                    item_code = await generateItemCode(t);
                }

                const newAccessoryName = await db.accessories_mst_name.create({
                    accessories_mst_id: masterRecord.id,
                    accessories_name: item.item_name,
                    accessories_price: item.accessories_price,
                    accessories_doc: item.accessories_doc,
                    removal_qty: item.removal_qty,
                    fitment_qty: item.fitment_qty,
                    hsn_code_id: item.hsn_code_id,
                    uom_id: item.uom_id,
                    status: "ACTIVE",
                    isDeleted: false
                }, { transaction: t });

                await db.ItemMaster.create({
                    item_type_id: itemType.id,
                    item_name: item.item_name,
                    item_code: item_code,
                    hsn_code_id: item.hsn_code_id,
                    uom_id: item.uom_id,
                    asset_id,
                    sub_category_id,
                    financial_year_id,
                    entity_id,
                    MVP: item.accessories_price,
                    MRP: item.accessories_price,
                    removal_qty: item.removal_qty,
                    fitment_qty: item.fitment_qty,
                    isDeleted: false,
                    accessories_doc: item.accessories_doc,
                    accessory_id: newAccessoryName.id
                }, { transaction: t });
            }
        }

        await t.commit();
        return res.status(200).json({
            code: 200,
            message: "Accessories updated successfully"
        });
    } catch (error) {
        if (t) await t.rollback();
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.update_accessories_status = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id) {
            return res.status(400).json({
                code: 400,
                message: "Missing required parameter: id"
            });
        }
        if (!status) {
            return res.status(400).json({
                code: 400,
                message: "Missing required field: status"
            });
        }

        const accessory = await db.accessories_master.findOne({
            where: { id, isDeleted: false }
        });

        if (!accessory) {
            return res.status(404).json({
                code: 404,
                message: "Accessories not found"
            });
        }

        await db.accessories_master.update(
            { status },
            { where: { id } }
        );

        return res.status(200).json({
            code: 200,
            message: "Accessories status updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.getAccessoriesBySubCategory = async (req, res) => {
    try {
        let { accessories_cat_id, sub_category_id } = req.params;

        // Step 1: Fetch master records (in case multiple masters exist for same cat+subcat)
        const masters = await db.sequelize.query(
            `
            SELECT
                ma.id,
                ma.accessories_cat_id,
                ma.sub_category_id,
                ma.entity_id,
                ma.financial_year_id
            FROM MASTER_ACCESSORIES AS ma
            WHERE ma.isDeleted = false
              AND ma.status = 'ACTIVE'
              AND ma.accessories_cat_id = :accessories_cat_id
              AND ma.sub_category_id = :sub_category_id
            `,
            {
                replacements: { accessories_cat_id, sub_category_id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (!masters || masters.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "No master accessories found"
            });
        }

        // Step 2: Loop masters and fetch children
        let finalResult = [];
        for (const master of masters) {
            const children = await db.sequelize.query(
                `
                SELECT
                    man.id,
                    man.accessories_name,
                    man.hsn_code_id,
                    man.accessories_mst_id,
                    man.accessories_discount,
                    man.accessories_price,
                    man.accessories_doc,
                    man.removal_qty,
                    man.fitment_qty,
                    hsn.hsn_sac_code,
                    grm.value,
                    man.uom_id
                FROM MASTER_ACCESSORIES_NAME AS man
                INNER JOIN MASTER_ITEM AS MI ON MI.accessory_id = man.id
                LEFT JOIN MASTER_HSN_SAC_CODE AS hsn ON hsn.id = man.hsn_code_id
                LEFT JOIN GST_RATE_MASTER AS grm ON grm.id = hsn.gst_rate_id
                WHERE man.isDeleted = false
                  AND man.status = 'ACTIVE'
                  AND man.accessories_mst_id = :parent_id
                ORDER BY man.id DESC
                `,
                {
                    replacements: { parent_id: master.id },
                    type: db.Sequelize.QueryTypes.SELECT
                }
            );

            finalResult.push({
                ...master,
                accessories: children
            });
        }

        // Final response
        return res.status(200).json(finalResult);

    } catch (error) {
        console.error("Error in getAccessoriesBySubCategory:", error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};



