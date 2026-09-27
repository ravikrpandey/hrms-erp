
const db = require("../../../models/index");
let fs = require("fs");
const XLSX = require("xlsx");
const ExcelJS = require('exceljs');
const { resStatus } = require("../../../master/reason/controller/reasonController");
const logger = require('../../../../logger/index');

exports.getCalculationMethods = async (req, res) => {
    try {
        const data = await db.calculationMethod.findAll({});

        return res.status(201).send({
            code: 201,
            message: "Data fetched successfully",
            data: data
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}


exports.createDepreciationCalculations = async (req, res) => {
    try {
        const { entity_id, calculation_id, asset_id, salvage_value, frequency, use_full_life } = req.body;

        const isexistCategory = await db.depreciationCalculation.findOne({ where: { asset_id: asset_id } });
        if (isexistCategory) {
            return res.status(409).send({ message: "Depreciation with the same asset category already exists" });
        }

        let use_full_life_days;
        if (frequency == 'Yearly') {
            use_full_life_days = 365 * use_full_life;
        } else if (frequency == 'monthly') {
            use_full_life_days = 30 * use_full_life;
        } else {
            use_full_life_days = use_full_life;
        }

        const data = await db.depreciationCalculation.create({
            asset_id,
            entity_id,
            calculation_id,
            salvage_value,
            frequency,
            use_full_life,
            use_full_life_days
        });

        return res.status(201).send({ message: "Depreciation calculation created successfully.", data });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


exports.getDepreciationCalculationsById = async (req, res) => {
    try {
        const { id, entity_id } = req.params;

        const data = await db.depreciationCalculation.findAll({
            where: {
                id: id,
                entity_id: entity_id
            }
        });

        return res.status(201).send({ message: "Depreciation calculation details fetched successfully.", data });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


exports.getAllCreateDepreciationCalculations = async (req, res) => {
    try {
        const { entity_id } = req.params;

        const data = await db.depreciationCalculation.findAll({
            where: {
                entity_id: entity_id
            },
            order: [['id', 'DESC']]
        });

        const calculationIds = data.map(calculation => calculation.calculation_id);
        const calculationMethods = await db.calculationMethod.findAll({
            attributes: ["id", "calculationMethod"],
            where: {
                id: calculationIds
            }
        });

        const calculationMethodMap = {};
        calculationMethods.forEach(method => {
            calculationMethodMap[method.id] = method.calculationMethod;
        });

        const assetIds = data.map(asset => asset.asset_id);
        const assetCategories = await db.asset.findAll({
            attributes: ["id", "asset_category_name"],
            where: { id: assetIds }
        });

        const assetCategoryMap = {};
        assetCategories.forEach(category => {
            assetCategoryMap[category.id] = category.asset_category_name;
        });

        const enrichedDataWithCategory = data.map(item => {
            return {
                ...item.dataValues,
                asset_category_name: assetCategoryMap[item.asset_id] || null,
                calculationMethod: calculationMethodMap[item.calculation_id] || null
            };
        });

        return res.status(200).send({
            message: "Depreciation calculation details fetched successfully.",
            data: enrichedDataWithCategory
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.updateDepreciationCalculations = async (req, res) => {
    try {
        const { id } = req.params;
        const { calculation_id, asset_id, salvage_value, frequency, use_full_life } = req.body;
        let use_full_life_days;
        if (frequency == 'Yearly') {
            use_full_life_days = 365 * use_full_life;
        } else if (frequency == 'monthly') {
            use_full_life_days = 30 * use_full_life;
        } else {
            use_full_life_days = use_full_life;
        }
        const existingCalculation = await db.depreciationCalculation.findByPk(id);
        if (!existingCalculation) {
            return res.status(404).send({ message: "Depreciation calculation not found." });
        }
        const updatedCalculation = await db.depreciationCalculation.update({
            asset_id,
            calculation_id,
            salvage_value,
            frequency,
            use_full_life,
            use_full_life_days
        },
            {
                where: { id: id }
            });

        return res.status(200).send({ message: "Depreciation calculation updated successfully.", data: updatedCalculation });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.deleteDepreciationCalculation = async (req, res) => {
    try {
        const { id } = req.params;

        const existingCalculation = await db.depreciationCalculation.findByPk(id);
        if (!existingCalculation) {
            return res.status(404).send({ message: "Depreciation calculation not found." });
        }

        await db.depreciationCalculation.update(
            { isDeleted: true },
            { where: { id } }
        );

        return res.status(200).send({ message: "Depreciation calculation Data deleted successfully." });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.getBasicDetailsForAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const grnStatusData = await db.grnItemStatus.findOne({
            where: { id },
            include: [
                {
                    model: db.grnItem,
                    include: [
                        {
                            model: db.grnMaster,
                            attributes: ['id', 'goodInventoryStatus', 'item_use_date']
                        }
                    ]
                }
            ]
        });

        const grn_data = grnStatusData?.GRN_ITEM?.GRN_MASTER;

        if (grn_data && grn_data.goodInventoryStatus == 'DIRECT_ASSET') {
            const query = `SELECT 
    GIS.grn_item_id, GIS.createdAt, GIS.asset_tagId, GIS.itemSerialNo, 
    MI.id AS item_id, MI.item_name, 
    AssetStatuses.status_name, 
    GM.accumulated_dep, 
    AR.new_value, AR.old_value, AR.revaluation_date, 
    GM.total_amount,
    (GM.total_amount - COALESCE(GM.accumulated_dep, 0)) AS net_value, 
    MI.MVP, MI.item_code, 
    MA.id AS asset_id, MA.asset_category_name,
    MB.branch_name, MB.branch_address, 
    MB.id AS branch_id,
    VBD.vendor_name, VBD.vendor_category, VBD.status, VBD.id AS vendor_id, 
    HRU.employee_id, 
    CONCAT(HRU.first_name, ' ', HRU.last_name) AS employee_name, 
    EM.entity_name AS company_name, 
    CONCAT(HRUT.first_name, ' ', HRUT.last_name) AS assignTo, 
    GM.item_use_date AS putto_use_date, 
    GM.purchase_date 
FROM GRN_MASTER AS GM 
LEFT JOIN GRN_ITEM AS GI ON GM.id = GI.grn_Id
LEFT JOIN GRN_ITEM_STATUS AS GIS ON GI.id = GIS.grn_item_id 
LEFT JOIN MASTER_BRANCH AS MB ON GM.branch_id = MB.id 
LEFT JOIN MASTER_ITEM AS MI ON GIS.item_id = MI.id
LEFT JOIN MASTER_ASSET AS MA ON MI.asset_id = MA.id 
LEFT JOIN VENDOR_BASIC_DETAILS AS VBD ON GM.vendor_id = VBD.id 
LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = GM.employee_id 
LEFT JOIN ENTITY_MASTER AS EM ON EM.id = GM.entity_id 
LEFT JOIN GRN_ASSET_TRANSFER_HISTORY AS GAT 
    ON GIS.id = GAT.grn_item_status_id 
    AND GIS.asset_loc_status = 'ALLOCATED' 
    AND GIS.assigned_to = GAT.employee_id 
LEFT JOIN AssetStatuses ON AssetStatuses.id = GM.asset_status_id 
LEFT JOIN HRMS_REGISTERED_USER AS HRUT ON HRUT.employee_id = GAT.employee_id 
LEFT JOIN ASSET_REVALUATION AS AR ON AR.grn_id = GM.id 
WHERE GIS.id = ${id}`

            const assetData = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT
            });

            if (assetData.length > 0) {
                return res.status(200).send({
                    code: 200,
                    message: "Get All Asset details successfully",
                    response: assetData[0]
                });
            } else {
                return res.status(404).send({
                    code: 404,
                    message: "No Asset details found.."
                });
            }

        } else {
            const data = await db.grnItemStatus.findOne({
                attributes: ["id", "po_item_id", "grn_item_id", "createdAt", "item_id", "asset_tagId", "itemSerialNo", "assigned_to"],
                where: { id }
            });

            if (!data) {
                return res.status(404).send({ message: "Record not found." });
            }

            const purchaseCost = await db.ItemMaster.findOne({
                attributes: ["id", "MVP", "item_code", "asset_id"],
                where: { id: data.item_id }
            });

            if (!purchaseCost) {
                return res.status(404).send({ message: "Purchase cost not found." });
            }

            data.dataValues.purchaseCost = purchaseCost.MVP;
            data.dataValues.item_code = purchaseCost.item_code;
            data.dataValues.asset_id = purchaseCost.asset_id;

            const category = await db.asset.findOne({
                attributes: ["id", "asset_category_name"],
                where: { id: purchaseCost.asset_id }
            });
            data.dataValues.asset_category_name = category?.asset_category_name || null;

            const purchaseOrderIds = await db.purchase_order_item.findOne({
                attributes: ["id", "purchase_order_id", "total_mvp"],
                where: { id: data.po_item_id }
            });

            data.dataValues.purchase_order_id = purchaseOrderIds?.purchase_order_id || null;

            const poNumbers = await db.purchase_order.findAll({
                attributes: ["id", "po_number", "po_date", "vendor_id", "employee_id"],
                // ✅ location_id REMOVED — ye column exist nahi karta
                where: { id: data.dataValues.purchase_order_id }
            });

            const poInfo = poNumbers.length > 0 ? poNumbers[0] : null;

            const response = {
                ...data.dataValues,
                po_number: poInfo ? poInfo.po_number : null,
                po_date: poInfo ? poInfo.po_date : null,
                vendor_id: poInfo ? poInfo.vendor_id : null,
                employee_id: poInfo ? poInfo.employee_id : null,
                location_id: null  // ✅ default null rakho, branch GM se aayega
            };

            // ✅ Branch — PO ki location_id nahi, GM.branch_id se lo
            if (data.dataValues.grn_item_id) {
                const grnIds = await db.grnItem.findOne({
                    where: { id: data.grn_item_id }
                });

                if (grnIds) {
                    const invoices = await db.grnMaster.findOne({
                        where: { id: grnIds.grn_Id }
                    });

                    if (invoices) {
                        response.InvoiceCode = invoices.invoiceNo;
                        response.invoiceDate = invoices.invoiceDate;

                        // ✅ branch_id ab GRN_MASTER se aayega
                        if (invoices.branch_id) {
                            const branch = await db.tbl_branch.findOne({
                                attributes: ["id", "branch_name", "branch_address"],
                                where: { id: invoices.branch_id }
                            });
                            response.branch_name = branch?.branch_name || null;
                            response.branch_address = branch?.branch_address || null;
                            response.location_id = invoices.branch_id; // ✅ ab sahi value
                        }
                    } else {
                        response.InvoiceCode = null;
                        response.invoiceDate = null;
                    }
                }
            }

            if (response.vendor_id) {
                const vendor = await db.vendor_basic_details.findOne({
                    attributes: ["id", "vendor_name", "vendor_category", "status"],
                    where: { id: response.vendor_id }
                });
                response.vendor_name = vendor?.vendor_name || null;
                response.vendor_category = vendor?.vendor_category || null;
                response.status = vendor?.status || null;
            }

            const assignedId = response.assigned_to ? response.assigned_to : response.employee_id;
            if (assignedId) {
                const user = await db.user.findOne({
                    attributes: ["employee_id", "first_name", "last_name"],
                    where: { employee_id: assignedId }
                });
                response.assignTo = user ? `${user.first_name} ${user.last_name}` : null;
            }

            return res.status(200).send({
                message: "Basic Details Data fetched successfully.",
                response
            });
        }

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// exports.getAllPurchaseOrderDetails = async(req,res) =>{
//     try{
//         const{id} = req.params
//         let vendor;
//         const data = await db.purchase_order.findAll({
//             attributes:["id","po_category","po_type","po_number","po_remark","po_date","location_id","vendor_id"],
//             where:{
//                 id:id
//             }
//         })
//         const purchaseCost = await db.ItemMaster.findOne({
//             attributes: ["id", "MVP", "item_code", "description","asset_id"],
//             where: {
//                 id: data.item_id
//             }
//         });



//         const category = await db.asset.findOne({
//             attributes: ["id", "asset_category_name"],
//             where:{
//                 id:purchaseCost.asset_id
//             }
//         })
//         data.dataValues.asset_category_name = category.asset_category_name;


//         if (data.vendor_id){
//             vendor = await db.vendor_basic_details.findOne({
//                 attributes: ["id", "vendor_name","vendor_category","status","phone_code","vendor_contact_num","vendor_email","vendor_address"],
//                 where: { id: data.vendor_id }
//             })
//                 data.vendor_name = vendor.vendor_name;
//                 data.vendor_email = vendor.vendor_email;
//                 data.phone_code = vendor.phone_code;
//                 data.vendor_contact_num = vendor.vendor_contact_num;
//                 data.vendor_email = vendor.vendor_contact_num;
//                 data.vendor_address = vendor.vendor_address;

//         }

//         if (data.location_id) {
//             const branch = await db.tbl_branch.findOne({
//                 attributes: ["id", "branch_name", "branch_address"],
//                 where: { id: data.location_id }
//             });

//             if (branch) {
//                 data.branch_name = branch.branch_name;
//                 data.branch_address = branch.branch_address;
//             } else {
//                 data.branch_name = null;
//                 data.branch_address = null;
//             }
//         }


//   } catch (error) {
//         return res.status(500).send({ message: error.message });
//     }
// }


exports.getAllPoDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const [data] = await db.sequelize.query(`
         SELECT PR.id,PR.po_category,PR.po_number,PR.vendor_id,PR.purchase_request_id,
        PR.po_type,PR.total_purchase,PR.po_remark,PR.entity_id,PR.po_date,
        PR.financial_year_id,PR.cost_center_id,PR.location_id,PR.department_id,EM.entity_name,
        MD.department_name,FY.financial_year,FC.cost_center_name,FC.cost_center_code,
        MB.branch_name,VB.vendor_name,MD.department_code
        FROM PROCUREMENT_PURCHASE_ORDER AS PR 
        JOIN ENTITY_MASTER AS EM ON EM.id = PR.entity_id
        JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        JOIN MASTER_FINANCIAL_YEAR AS FY ON FY.id = PR.financial_year_id
        JOIN FINANCE_COST_CENTER AS FC ON FC.id = PR.cost_center_id
        JOIN MASTER_BRANCH AS MB ON MB.id = PR.location_id
        JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PR.vendor_id
        WHERE PR.id = :id 
      `, {
            replacements: { id }
        });


        if (data[0].vendor_id) {
            vendor = await db.vendor_basic_details.findOne({
                attributes: ["id", "vendor_name", "vendor_category", "status", "phone_code", "vendor_contact_num", "vendor_email", "vendor_address"],
                where: { id: data[0].vendor_id }
            })
            data[0].vendor_name = vendor.vendor_name;
            data[0].vendor_email = vendor.vendor_email;
            data[0].phone_code = vendor.phone_code;
            data[0].vendor_contact_num = vendor.vendor_contact_num;
            // data[0].vendor_email = vendor.vendor_contact_num;
            data[0].vendor_address = vendor.vendor_address;

        }

        if (data[0].location_id) {
            const branch = await db.tbl_branch.findOne({
                where: { id: data[0].location_id }
            });
            data[0].branch_name = branch.branch_name;
            data[0].branch_address = branch.branch_address;
            data[0].branch_code = branch.branch_code;
            data[0].branch_contact_no = branch.branch_contact_no;
            data[0].branch_alt_contact_no = branch.branch_alt_contact_no;
            data[0].branch_pin_code = branch.branch_pin_code;
            data[0].branch_gstnumber = branch.branch_gstnumber;
            data[0].branch_email = branch.branch_email;
            data[0].billing_status = branch.billing_status;
            data[0].city_id = branch.city_id;
            data[0].state_id = branch.state_id;

        }
        let city;
        if (data[0].city_id) {
            city = await db.city.findOne({
                where: { city_id: data[0].city_id }
            });
        }
        data[0].city_name = city.city_name;

        let state;
        if (data[0].city_id) {
            state = await db.states.findOne({
                where: { states_id: data[0].state_id }
            });
        }
        data[0].states_name = state.states_name;


        const [data_Item] = await db.sequelize.query(`
        SELECT PI.*,
        MI.item_name,MI.item_code,MI.MVP,MI.manage_by,MI.status,MI.asset_id,MI.uom_id,
        MA.asset_category_code,MA.asset_category_name,MA.asset_category_description,MA.status
        FROM PROCUREMENT_PURCHASE_ORDER AS PR
        JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS PI ON PI.purchase_order_id = PR.id
        JOIN MASTER_ASSET AS MA ON MA.id = PI.item_categroy_id
        JOIN MASTER_ITEM AS MI ON MI.id = PI.item_master_id
        WHERE PI.purchase_order_id= :id
       `, {
            replacements: { id }
        });
        //     const [data_service] = await db.sequelize.query(`
        //    SELECT PI.*,MI.service_category_code,MI.service_category_name,MI.service_category_description,MI.status,
        //     MA.service_id,MA.service_code,MA.service_name,MA.service_description,MA.MVP,MA.service_document,
        //     MA.service_category_id
        //     FROM PROCUREMENT_PURCHASE_ORDER AS PR
        //     JOIN PROCUREMENT_PURCHASE_ORDER_SERVICE AS PI ON PI.purchase_order_id = PR.id
        //     JOIN MASTER_SERVICE AS MA ON MA.service_id = PI.service_master_id
        //     JOIN MASTER_SERVICE_CATEGARY AS MI ON MI.id = PI.service_categroy_id
        //     WHERE PI.purchase_order_id = :id
        //    `, {
        //         replacements: { id }
        //     });
        const Obj = {
            ...data[0],
            // data_details,

            data_Item,
            // data_service
        }
        if (data) {
            return res.status(200).send({ code: 200, message: "Data fetched successfully!", data: Obj });
        } else {
            return res.status(404).send({ code: 404, message: "Data Not Found", data: [] });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: 'An error occurred while fetching data.', error: error.message });
    }
};

exports.createCompanyDepreciationDocs = async (req, res) => {
    try {
        const { description, po_itemId, files } = req.body

        if (!po_itemId) {
            return res.status(400).send({ code: 400, message: "Item ID must be provided." });
        }

        const existingDoc = await db.companyDepreciationDocs.findOne({ where: { po_itemId, isDeleted: false } });

        if (existingDoc) {
            await db.companyDepreciationDocs.update(
                { isDeleted: true },
                { where: { po_itemId } }
            );
        }


        const results = await Promise.all(files.map(async (file, index) => {

            const attachment = file;


            const desc = description[index] ? description[index] : null;

            return await db.companyDepreciationDocs.create({
                po_itemId,
                attachment,
                description: desc
            });
        }));

        return res.status(200).send({ code: 200, message: "Data created successfully!", data: results });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: 'An error occurred while creating data.', error: error.message });
    }
};


// exports.updateCompanyDepreciationDocs = async (req, res) => {
//     try {
//         const {id,po_itemId } = req.params; 
//         // const { po_itemId } = req.body; 
//         const description = req.body.description ? req.body.description : [];
//         const files = req.files;


//         if (!id || !po_itemId) {
//             return res.status(400).send({ code: 400, message: "Document ID and Item ID must be provided." });
//         }

//      const existingDoc = await db.companyDepreciationDocs.findOne({ where: { id, po_itemId } });
//         if (!existingDoc) {
//             return res.status(404).send({ code: 404, message: "Document not found." });
//         }


//         const updates = {
//             po_itemId: po_itemId || existingDoc.po_itemId,
//             description: description.length > 0 ? description : existingDoc.description 
//         };


//         if (files.length > 0) {
//             updates.attachment = files[0].filename;
//         }  


//         await db.companyDepreciationDocs.update(updates, { where: { id, po_itemId } });

//         return res.status(200).send({ code: 200, message: "Document updated successfully!" });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ code: 500, message: 'An error occurred while updating the data.', error: error.message });
//     }
// };


exports.getAssetCompanyDepriciation = async (req, res) => {
    try {
        const { asset_id } = req.params;

        const result = await db.depreciationCalculation.findOne({
            where: {
                asset_id: asset_id,
                isDeleted: false
            }
        });

        if (result) {
            return res.status(200).send({ code: 200, message: "Depreciation data get successfully!", data: result });
        } else {
            return res.status(404).send({ code: 200, message: "Depreciation data not found!", data: [] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: 'An error occurred while creating data.', error: error.message });
    }
}


exports.getAllDocsByPO_itemId = async (req, res) => {
    try {
        const { po_itemId } = req.params;

        const result = await db.companyDepreciationDocs.findAll({
            where: {
                po_itemId: po_itemId,
                isDeleted: false
            }
        })
        return res.status(200).send({ code: 200, message: "Data created successfully!", data: result });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: 'An error occurred while creating data.', error: error.message });
    }
}


exports.calculateAssetDepreciation = async (req, res) => {
    try {
        const { asset_id } = req.params;
        const depreciationRecord = await db.depreciationCalculationYearLog.findAll({
            where: {
                grn_item_status_id: asset_id
            }
        });

        if (depreciationRecord.length > 0) {
            return res.status(200).send({ code: 200, message: "Depreciation calculation data!", data: depreciationRecord });
        } else {
            return res.status(404).send({ code: 404, message: "Depreciation calculation data not found!", data: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message || 'Error in calculating depreciation' });
    }
}




exports.getAllCompanyDepreciationDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const grnStatusData = await db.grnItemStatus.findOne({
            where: { id },
            include: [
                {
                    model: db.grnItem,
                    include: [
                        {
                            model: db.grnMaster,
                            attributes: ['id', 'item_use_date']
                        }
                    ]
                }
            ]
        });

        const grn_data = grnStatusData?.GRN_ITEM?.GRN_MASTER;

        const data = await db.grnItemStatus.findOne({
            attributes: ["id", "po_item_id", "grn_item_id", "createdAt", "item_id", "asset_tagId"],
            where: {
                id: id
            },
        });


        if (!data) {
            return res.status(404).send({ message: "Record not found." });
        }

        const purchaseCost = await db.ItemMaster.findOne({
            attributes: ["id", "MVP", "item_code", "description", "asset_id"],
            where: {
                id: data.item_id
            }
        });

        if (!purchaseCost) {
            return res.status(404).send({ message: "Purchase cost not found." });
        }
        data.dataValues.purchaseCost = purchaseCost.MVP;
        data.dataValues.item_code = purchaseCost.item_code;
        // data.dataValues.description = purchaseCost.description;
        data.dataValues.asset_id = purchaseCost.asset_id;
        data.dataValues.putto_use_date = grn_data?.item_use_date;

        const result = await db.depreciationCalculation.findOne({

            where: {
                asset_id: data.dataValues.asset_id
            }
        })
        if (!result) {
            return res.status(404).send({ message: "Depreciation details not found !" });
        }
        data.dataValues.salvage_value = result.salvage_value;
        data.dataValues.use_full_life = result.use_full_life;
        data.dataValues.calculation_id = result.calculation_id;
        netValue = (purchaseCost.MVP - (result.salvage_value));

        const calculationMethods = await db.calculationMethod.findOne({
            attributes: ["id", "calculationMethod"],
            where: {
                id: result.calculation_id
            }
        });
        data.dataValues.netValue = netValue;
        data.dataValues.calculationMethod = calculationMethods.calculationMethod;


        return res.status(200).send({ code: 200, message: "Data fetched successfully!", data });
    } catch (error) {
        res.status(500).send({ error: error.message || 'Error in calculating depreciation' });
    }
}