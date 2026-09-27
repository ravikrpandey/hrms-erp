// const { exp } = require("mathjs");
// const path = require('path');
// const Sequelize = require('sequelize');
// const { QueryTypes } = require('sequelize');

// const db = require("../../models");
// const { Console } = require("console");

// exports.getList = async (req, res) => {
//     try {
//         const result = await db.masters_inventory_stores.findAll({
//             where: {
//                 isDeleted: false
//             },
//             include: [{
//                 model: db.tbl_branch,
//                 attributes: ["branch_name"]
//             }]
//         });
//         res.status(200).json({ code: 200, message: 'Available list', data: result });
//     } catch (error) {
//         res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
//     }
// }

// exports.saveStore = async (req, res) => {
//     try {
//         const { store_name, branch_id } = req.body;
//         if (!store_name) {
//             return res.status(500)
//                 .json({
//                     code: 500,
//                     message: "Store name not found!"
//                 });
//         }
//         if (!branch_id) {
//             return res.status(500)
//                 .json({
//                     code: 500,
//                     message: "Branch Id not found!"
//                 });
//         }
//         const createdStore = await db.masters_inventory_stores.create({
//             store_name,
//             branch_id: parseInt(branch_id)
//         });
//         res.status(201).json({
//             code: 201,
//             message: 'Store saved successfully!',
//             data: createdStore
//         });
//     } catch (error) {
//         res.status(500)
//             .json({
//                 code: 500,
//                 message: error?.message || "Internal server error"
//             });
//     }
// }

// exports.getSingle = async (req, res) => {
//     try {
//         const { id } = req.query;
//         const _currentStore = await db.masters_inventory_stores.findByPk(id);
//         if (!_currentStore) {
//             return res.status(500)
//                 .json({
//                     code: 500,
//                     message: "No Inventory store found!"
//                 });
//         }

//         res.status(200).json({
//             code: 200,
//             message: 'Inventory store found!',
//             data: _currentStore
//         });
//     } catch (error) {
//         res.status(500)
//             .json({
//                 code: 500,
//                 message: error?.message || "Internal server error"
//             });
//     }
// }

// exports.updateStore = async (req, res) => {
//     try {
//         const { id, values } = req.body;
//         const { store_name, branch_id, isDeleted, status } = values;
//         const _values = {
//             ...(store_name ? { store_name } : {}),
//             ...(branch_id ? { branch_id: parseInt(branch_id) } : {}),
//             ...(isDeleted ? { isDeleted: Boolean(isDeleted) } : {}),
//             ...(status ? { status: status.toLowerCase() == 'active' ? 'ACTIVE' : 'INACTIVE' } : {}),
//         };

//         const _currentStore = await db.masters_inventory_stores.findByPk(id);
//         if (!_currentStore) {
//             return res.status(500)
//                 .json({
//                     code: 500,
//                     message: "No Inventory store found!"
//                 });
//         }
//         _currentStore.update(_values);
//         await _currentStore.save();

//         res.status(200).json({
//             code: 200,
//             message: 'Updated Successfully!'
//         });
//     } catch (error) {
//         res.status(500)
//             .json({
//                 code: 500,
//                 message: error?.message || "Internal server error"
//             });
//     }
// }

// exports.getAllInventory = async (req, res) => {
//     try {
//         const { login_id } = req.query;
//         const empData = await db.user.findOne({
//             attribute: ["employee_id", "branch_id"],
//             where: { employee_id: login_id }
//         })
//         let condition;
//         if (login_id == 23 || login_id == 'Super Admin') {
//             condition = `1=1`
//         } else {
//             condition = `P.employee_id=${login_id} AND P.branch_id=${empData.branch_id}`
//         }

//         const [InventoryController] = await db.sequelize.query(
//             `SELECT DISTINCT GI.Item_Id AS Item_Id,P.delivery_branch,DATE_FORMAT(GI.updatedAt,'%Y-%m-%d') AS updatedAt,
//             I.item_name,I.manage_by,I.asset_id,A.asset_category_name,
//             (SELECT SUM(GI_sub.selection_item) FROM grn_items AS GI_sub 
//                 WHERE GI_sub.Item_Id = GI.Item_Id
//             ) AS selection_item
//             FROM grn_master AS G
//             INNER JOIN procurement_po_details AS P ON P.id = G.PO_Id
//             INNER JOIN grn_items AS GI ON GI.grn_Id = G.id
//             INNER JOIN ItemMasters AS I ON I.id = GI.Item_Id
//             INNER JOIN asset_category AS A ON A.id = I.asset_id
//             INNER JOIN grn_item_status AS GIS ON GIS.grn_Item_Id = GI.id
//             WHERE ${condition} AND P.status='ACTIVE' AND P.isDeleted='0' AND GI.updatedAt = (
//                 SELECT MAX(GI_updated.updatedAt)
//                 FROM grn_items AS GI_updated
//                 WHERE GI_updated.grn_Id = G.id
//             )
//             `)
//         const [assetContractsData] = await db.sequelize.query(
//             `SELECT sib.*, sim.manage_by FROM Inventory_batch as sib
//             INNER JOIN SYS_INVENTORY_MASTER AS sim ON sim.id = sib.inventory_master_id
//                     ORDER BY sib.id DESC
//             `)

//         if (assetContractsData.length == 0) {
//             return res.status(200).send({ code: 200, message: 'success', data: InventoryController })
//         } else {
//             const [updatedServiceData] = await db.sequelize.query(
//                 `SELECT DISTINCT(GI.Item_Id) as Item_Id,P.delivery_branch,
//                 DATE_FORMAT(GI.updatedAt,'%Y-%m-%d') AS updatedAt,I.item_name,
//                 I.manage_by,I.asset_id,A.asset_category_name,sim.Total_inventory,
//                 (SELECT SUM(GI_sub.selection_item) 
//                 FROM grn_items AS GI_sub WHERE GI_sub.Item_Id = GI.Item_Id) AS selection_item
//                 FROM grn_master AS G
//                 INNER JOIN procurement_po_details AS P ON P.id = G.PO_Id
//                 INNER JOIN grn_items AS GI ON GI.grn_Id = G.id
//                 LEFT JOIN (
//                     SELECT Item_id,Total_inventory
//                     FROM SYS_INVENTORY_MASTER
//                     WHERE (Item_id, createdAt) IN (
//                         SELECT Item_id, MAX(createdAt) AS createdAt
//                         FROM SYS_INVENTORY_MASTER
//                         GROUP BY Item_id
//                     )
//                 ) AS sim ON sim.Item_id = GI.Item_Id 
//                 INNER JOIN ItemMasters AS I ON I.id = GI.Item_Id
//                 INNER JOIN asset_category AS A ON A.id = I.asset_id
//                 INNER JOIN grn_item_status AS GIS ON GIS.grn_Item_Id = GI.id
//                 WHERE ${condition} AND P.status='ACTIVE' AND P.isDeleted='0' AND GI.updatedAt = (
//                         SELECT MAX(GI_updated.updatedAt)
//                         FROM grn_items AS GI_updated
//                         WHERE GI_updated.grn_Id = G.id
//                 ) AND sim.Total_inventory !=0 OR sim.Total_inventory IS NULL`)

//             if (updatedServiceData) {
//                 return res.status(200).send({ code: 200, message: "Get All Inventory data successfully", data: updatedServiceData });
//             } else {
//                 return res.status(404).send({ code: 404, message: "No Data found" });
//             }
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// };


// exports.getBatchInventory = async (req, res) => {
//     try {
//         let orderByClause = ``;
//         if (req.body.in_type === 'Last_IN') {
//             orderByClause = 'ORDER BY G.id DESC';
//         } else if (req.body.in_type === 'First_IN') {
//             orderByClause = 'ORDER BY G.id ASC';
//         }
//         let batchTypeCondition = ``;
//         if (req.body.managed_by === 'S.No. Only') {
//             batchTypeCondition = "AND GI.batchType = 'S.No. Only'";
//         } else if (req.body.managed_by == 'Batch Only') {
//             batchTypeCondition = `AND GI.batchType = 'Batch Only'`;
//         }
//         const Item_Id = req.body.Item_Id;
//         let condition = ''
//         if (Item_Id) {
//             condition += `AND GI.Item_Id = ${Item_Id}`
//         }

//         const [InventoryController] = await db.sequelize.query(
//             `SELECT DISTINCT G.id, G.receiveQty, GI.id AS grn_item_id, GI.batchType, GI.batchNo, 
//             GI.itemSerialNo, GI.expiryDate, GI.Item_Id, I.item_name,DATE_FORMAT(G.createdAt,'%Y-%m-%d') 
//             AS createdAt, GI.itemStatus,G.selection_item 
//             FROM grn_items AS G
//             INNER JOIN grn_item_status AS GI ON GI.grn_Item_Id = G.id
//             LEFT JOIN ItemMasters AS I ON I.id = GI.Item_Id
//             WHERE GI.itemStatus = 'SELECTED' AND GI.isDeleted = 0
//             ${batchTypeCondition}
//             ${condition}
//             ${orderByClause}`,
//         );

//         const assetContractsData = await db.InventoryBatch.findAll({ where: { Item_id: Item_Id }, order: [["id", "DESC"]] });
//         if (assetContractsData.length == 0) {
//             return res.status(200).send({ code: 200, message: 'success', data: InventoryController })
//         } else {
//             if (req.body.managed_by === 'S.No. Only') {

//                 const updatedServiceData = InventoryController.filter((item) => {
//                     return !assetContractsData.some((contract) => contract.grn_status_id === item.grn_item_id
//                     );
//                 });

//                 const inventoryMaster = await db.inventoryDetails.findOne({ where: { id: assetContractsData[0].inventory_master_id } });

//                 await updatedServiceData.map(async (item) => {
//                     item.selection_item = inventoryMaster.Total_inventory;
//                     return item
//                 },
//                     { where: { Item_id: Item_Id, manage_by: batchTypeCondition } }
//                 );

//                 if (InventoryController && InventoryController.length > 0) {
//                     return res.status(200).send({ code: 200, message: "Get All Inventory data successfully", data: updatedServiceData });
//                 } else {
//                     return res.status(404).send({ code: 404, message: "No Data found" });
//                 }
//             }
//             else {
//                 const InventoryData = await db.InventoryBatch.findAll({ where: { Item_id: Item_Id }, order: [["id", "ASC"]] });
//                 for (let i = 0; i < InventoryData.length; i++) {
//                     const allocatedInventory = InventoryData[i].allocated_inventory;
//                     const grnStatusId = InventoryData[i].grn_status_id;
//                     const currentItemId = InventoryData[i].Item_id;

//                     await Promise.all(InventoryController.map(async (item) => {
//                         if (item.grn_item_id === grnStatusId && item.Item_Id === currentItemId) {
//                             item.selection_item -= allocatedInventory;
//                             return item;
//                         }
//                         return item;
//                     }));
//                 }

//                 if (InventoryController && InventoryController.length > 0) {
//                     return res.status(200).send({ code: 200, message: "Get All Inventory data successfully", data: InventoryController });
//                 }
//                 else {
//                     return res.status(404).send({ code: 404, message: "No Data found" });
//                 }
//             }
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// };

// exports.createInventory = async (req, res) => {
//     try {
//         const { type, in_type, employee_id, allocate_inventory, remark, branch_id, Inv_item, inventory_type, Item_id, Total_inventory, raise_indent_id, manage_by } = req.body;

//         const Total_inventory_check = Total_inventory - allocate_inventory;
//         if (inventory_type === 'Inventory') {
//             const createINV = await db.inventoryDetails.create({
//                 type, in_type, employee_id, allocate_inventory, remark, branch_id, inventory_type, manage_by,
//                 Total_inventory: Total_inventory - allocate_inventory, Item_id
//             });

//             const dataValue = await Promise.all(Inv_item.map(async (item) => {
//                 const { Item_id, grn_status_id, allocated_inventory, allocated_status } = item;
//                 await db.InventoryBatch.create({
//                     grn_status_id, allocated_inventory, Item_id, allocated_status,
//                     inventory_master_id: createINV.id
//                 });
//             }
//             ));

//             if (Total_inventory_check === 0) {
//                 await db.inventoryDetails.update({ status: "ALLOCATED" }, {
//                     where: {
//                         id: createINV.id
//                     }
//                 });
//             }
           
//             if (createINV && dataValue) {
//                 return res.status(201).send({ code: 201, message: "Inventory Created Successfully" });
//             } else {
//                 return res.status(404).send({ code: 404, message: "Inventory not Created" });
//             }
//         }
//         else if (inventory_type === 'Production') {
//             const createPro = await db.inventoryDetails.create({
//                 in_type, remark, inventory_type, manage_by, raise_indent_id, allocate_inventory, Item_id,
//                 Total_inventory: Total_inventory - allocate_inventory
//             });

//             const data = await Promise.all(Inv_item.map(async (item) => {
//                 const { Item_id, selection_id, allocated_inventory, allocated_status, grn_status_id } = item;
//                 await db.InventoryBatch.create({
//                     selection_id, Item_id, allocated_inventory, allocated_status, grn_status_id,
//                     inventory_master_id: createPro.id
//                 });
//             }
//             ));

//             if (Total_inventory_check === 0) {
//                 await db.inventoryDetails.update({ status: "ALLOCATED" }, {
//                     where: {
//                         id: createPro.id
//                     }
//                 });
//             }
           
//             if (createPro && data) {
//                 return res.status(201).send({ code: 201, message: "Inventory Created Successfully" });
//             } else {
//                 return res.status(404).send({ code: 404, message: "Inventory not Created" });
//             }
//         } else {
//             return res.status(400).send({ code: 400, message: "Invalid inventory_type" });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// };

// exports.getFilteredInventory = async (req, res) => {
//     try {
//         const { grn_date_from, grn_date_to, mfg_date_from, mfg_date_to, managed_by, Item_Id } = req.query;
//         let grnDateCondition = ``;
//         let mfgDateCondition = ``;
//         let batchTypeCondition = ``;

//         if (grn_date_from && grn_date_to) {
//             grnDateCondition = `AND G.createdAt BETWEEN '${grn_date_from}' AND '${grn_date_to}'`;
//         }

//         if (mfg_date_from && mfg_date_to) {
//             mfgDateCondition = `AND GI.expiryDate BETWEEN '${mfg_date_from}' AND '${mfg_date_to}'`;
//         }

//         if (managed_by === 'S.No.Only') {
//             batchTypeCondition = "AND GI.batchType = 'S.No. Only'";
//         }
//         let condition = ''
//         if (Item_Id) {
//             condition += `AND GI.Item_Id = ${Item_Id}`
//         }

//         const [InventoryController] = await db.sequelize.query(
//             `SELECT DISTINCT GI.id,GI.expiryDate, GI.batchType,GI.itemSerialNo,GI.Item_Id,I.item_name,
//             DATE_FORMAT(G.createdAt,'%Y-%m-%d') AS createdAt
//             FROM grn_items AS G
//             INNER JOIN grn_item_status AS GI ON GI.grn_Item_Id = G.id
//             LEFT JOIN ItemMasters AS I ON I.id = GI.Item_Id
//             WHERE GI.status='ACTIVE' AND GI.isDeleted=0
//             ${grnDateCondition}
//             ${mfgDateCondition}
//             ${condition}
//             ${batchTypeCondition}
//             `
//         );

//         if (InventoryController && InventoryController.length > 0) {
//             return res.status(200).send({ code: 200, message: "Filtered Inventory data retrieved successfully", data: InventoryController });
//         } else {
//             return res.status(404).send({ code: 404, message: "No Data found matching the provided criteria" });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// };

// exports.getProductionData = async (req, res) => {
//     try {
//         const itemDetailsQuery = await db.sequelize.query(`
//         SELECT DISTINCT A.product_id,PM.product_name,PL.production_order_no,PL.id,P.plant_name
//         FROM ADD_PRODUCTION_MST AS A
//         INNER JOIN PRODUCT_MASTER AS PM ON A.product_id = PM.id
//         INNER JOIN PRODUCTION_LIST_MST AS PL ON A.id = PL.production_id
//         INNER JOIN  plant_master AS P ON PL.plant_id = P.id
//         WHERE A.isDeleted = false AND A.status = 'ACTIVE'
//         ORDER BY PL.id DESC`, {
//             type: db.sequelize.QueryTypes.SELECT
//         });

//         if (itemDetailsQuery && itemDetailsQuery.length > 0) {
//             const formattedData = itemDetailsQuery.map(item => ({
//                 id: item.id,
//                 production_order_no: item.production_order_no,
//                 product_name: item.product_name,
//                 plantName: item.plant_name,
//             }));

//             return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: formattedData });
//         } else {
//             return res.status(404).send({ code: 404, message: "Data Not found" });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// };

// exports.getProductionbyId = async (req, res) => {
//     try {
//         const { production_mapping_id } = req.body;
//         const [production] = await db.sequelize.query(
//             `SELECT DISTINCT P.product_name,P.product_code,
//             PR.production_mapping_id, PR.product_id,
//             PL.production_order_no,PR.remark
//             FROM PROD_RAISE_INDENT AS PR    
//             INNER JOIN PRODUCT_MASTER AS P ON P.id = PR.product_id
//             INNER JOIN PRODUCTION_LIST_MST As PL ON PR.production_mapping_id=PL.id
//             WHERE  PR.production_mapping_id= ${production_mapping_id}`)

//         const [productionQuery] = await db.sequelize.query(
//             `SELECT DISTINCT PR.item_master_id, PR.BOM_qty, PR.total_required_qty,TU.uom_name,
//             A.asset_category_name,  PR.production_mapping_id,
//             PR.product_id,I.item_name,GI.itemStatus,I.item_code,
//             GI.batchType,
//             CASE 
//                 WHEN (SELECT SIM.Total_inventory 
//                         FROM SYS_INVENTORY_MASTER AS SIM 
//                         WHERE SIM.Item_id = GI.Item_Id 
//                         ORDER BY SIM.id DESC LIMIT 1) IS NOT NULL 
//                 THEN (SELECT SIM.Total_inventory 
//                         FROM SYS_INVENTORY_MASTER AS SIM 
//                         WHERE SIM.Item_id = GI.Item_Id 
//                         ORDER BY SIM.id DESC LIMIT 1)
//                 ELSE selection_item 
//             END AS selection_item
//             FROM PROD_RAISE_INDENT AS PR    
//             INNER JOIN ItemMasters AS I ON I.id= PR.item_master_id
//             LEFT JOIN tbl_uom AS TU ON TU.uom_id=I.uom_id
//             LEFT JOIN grn_items AS G ON G.Item_Id=I.id
//             LEFT JOIN grn_item_status AS GI ON GI.grn_Item_Id= G.id
//             LEFT JOIN grn_master AS GM ON GM.id=G.grn_Id
//             LEFT JOIN asset_category As A ON I.asset_id = A.id
//             WHERE PR.production_mapping_id =${production_mapping_id}  `)
//         const Obj = {
//             ...production[0],
//             productionQuery
//         }
//         if (productionQuery) {
//             return res.status(200).send({
//                 code: 200,
//                 message: "Get data successfully",
//                 data: Obj,
//             });
//         } else {
//             return res.status(404).send({ code: 404, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// }

// exports.getProductionbyId_Inside = async (req, res) => {
//     try {
//         const { Item_Id, in_type, managed_by } = req.body;

//         let batchTypeCondition = '';
//         if (managed_by === 'S.No. Only') {
//             batchTypeCondition = 'AND I.manage_by = "S.No. Only"';
//         } else if (managed_by === 'Batch Only') {
//             batchTypeCondition = 'AND I.manage_by = "Batch Only"';
//         }
//         let sortOrder = [['id', 'ASC']];
//         if (in_type === 'Last_IN') {
//             sortOrder = [['id', 'DESC']];
//         }
//         const itemDetailsQuery = `
//         SELECT DISTINCT GS.id, GS.itemStatus, GS.batchType, I.Item_name, GS.itemSerialNo,
//         GS.batchNo, GS.Item_Id, GS.expiryDate, GS.itemStatus,I.threshold_stock,
//         (SELECT (SIM.Total_inventory) FROM SYS_INVENTORY_MASTER AS SIM WHERE SIM.Item_id = GI.Item_Id 
//         ORDER BY SIM.id DESC LIMIT 1) AS Total_inventory,GI.selection_item,
//         DATE_FORMAT(G.createdAt, '%Y-%m-%d') AS createdAt
//         FROM ItemMasters AS I 
//         INNER JOIN grn_item_status AS GS ON I.id = GS.Item_Id
//         INNER JOIN grn_items AS GI ON GS.grn_Item_Id = GI.id   
//         INNER JOIN grn_master AS G ON G.id = GI.grn_id
//         INNER JOIN PROD_RAISE_INDENT AS PR ON I.id= PR.item_master_id
//         WHERE GS.Item_Id = :Item_Id AND GS.itemStatus = 'SELECTED' ${batchTypeCondition}`;

//         const itemDetails = await db.sequelize.query(itemDetailsQuery, {
//             replacements: { Item_Id },
//             type: db.sequelize.QueryTypes.SELECT
//         });
//         const countData = await db.inventoryDetails.count({ where: { Item_id: itemDetails[0].Item_Id } })
//         const assetContractsData = await db.InventoryBatch.findAll({ where: { Item_id: Item_Id }, order: [["id", "DESC"]] });
//         if (assetContractsData.length == 0) {
//             return res.status(200).send({ code: 200, message: 'success', data: itemDetails })
//         } else {
//             if (req.body.managed_by === 'S.No. Only') {
//                 const updatedServiceData = itemDetails.filter((item) => {
//                     return !assetContractsData.some((contract) => contract.grn_status_id === item.id
//                     );
//                 });

//                 const inventoryMaster = await db.inventoryDetails.findOne({ where: { id: assetContractsData[0].inventory_master_id } });

//                 await updatedServiceData.map(async (item) => {
//                     item.selection_item = inventoryMaster.Total_inventory;
//                     return item
//                 },
//                     { where: { Item_id: Item_Id, manage_by: batchTypeCondition } }
//                 );

//                 if (itemDetails && itemDetails.length > 0) {
//                     return res.status(200).send({
//                         code: 200, message: "Get All Serial data successfully",
//                         remaining: parseInt(itemDetails[0].threshold_stock) - countData, data: updatedServiceData
//                     });
//                 } else {
//                     return res.status(404).send({ code: 404, message: "No Data found" });
//                 }
//             }
//             else {
//                 const InventoryData = await db.InventoryBatch.findAll({ where: { Item_id: Item_Id }, order: [["id", "ASC"]] });
//                 for (let i = 0; i < InventoryData.length; i++) {
//                     const allocatedInventory = InventoryData[i].allocated_inventory;
//                     const grnStatusId = InventoryData[i].grn_status_id;
//                     const currentItemId = InventoryData[i].Item_id;

//                     await Promise.all(itemDetails.map(async (item) => {
//                         if (item.id === grnStatusId && item.Item_Id === currentItemId) {
//                             item.selection_item -= allocatedInventory;
//                             return item;
//                         }
//                         return item;
//                     }));
//                 }

//                 if (itemDetails && itemDetails.length > 0) {
//                     return res.status(200).send({ code: 200, message: "Get All Batch data successfully", data: itemDetails });
//                 }
//                 else {
//                     return res.status(404).send({ code: 404, message: "No Data found" });
//                 }
//             }
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// }










