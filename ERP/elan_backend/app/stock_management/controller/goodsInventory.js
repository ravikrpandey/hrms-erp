const db = require("../../models");

exports.generateBatchNumber = async (req, res) => {
    try {
      const lastEntry = await db.grnMaster.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["grn_number"],  
      });
  
      let number;
      if(lastEntry) {
        const lastCode = parseInt(lastEntry.grn_number.split('GN')[1]);
        const newCode = lastCode + 1;
        number = 'GN' + newCode.toString().padStart(5, '0');
      } else {
        number = `GN00001`;
      }
      return res.status(200).send({ code: 200, message: "Batch Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getStockDashboard = async (req, res) => {
      try {
        const {entity_id,employee_id} = req.params;
      const {role} = req.query;
      let employeeWise;
      if(role == 'Super Admin'){
        employeeWise = ''
      }else{
        employeeWise = `INNER JOIN STORE_ASSIGNED_EMPLOYEE AS SAE ON (SAE.store_id = SM.id AND SAE.status = 'ACTIVE' AND SAE.employee_id = ${employee_id})`
      }
        const query = `SELECT MI.id AS item_id, SUM(GI.itemQty) AS itemQty,MI.item_code, MI.item_name, MA.asset_category_name,MU.uom_name, SM.id AS store_id,SM.name AS store_name, CASE 
        WHEN GM.goodInventoryStatus = 'INDIRECT' THEN 'GRN' ELSE 'Direct Inventory' END AS goodInventoryStatus,COUNT(DISTINCT MI.asset_id) AS asset_count FROM GRN_MASTER AS GM INNER JOIN GRN_ITEM AS GI ON GM.id = GI.grn_Id
        INNER JOIN STORE_MASTER AS SM ON SM.id = GM.store_id ${employeeWise} INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id INNER JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id WHERE GM.container_type = 'store' AND GI.isDeleted = false AND GM.entity_id = ${entity_id} GROUP BY GM.store_id
        UNION
        SELECT MI.id AS item_id, SUM(SSTL.quantity) AS itemQty, MI.item_code, MI.item_name, MA.asset_category_name, MU.uom_name, SM.id AS store_id, SM.name AS store_name,CASE 
        WHEN SST.stock_receiver_acknowlwdge = 'Completed' THEN 'Stock Transfer' ELSE '' END AS goodInventoryStatus,COUNT(DISTINCT MI.asset_id) AS asset_count FROM STORE_STOCK_TRANSFER AS SST INNER JOIN STORE_STOCK_TRANSFER_LIST AS SSTL ON SST.id = SSTL.stock_transfer_id LEFT JOIN MASTER_ITEM AS MI ON MI.id = SSTL.item_id INNER JOIN STORE_MASTER AS SM ON SM.id = SST.source_store_id ${employeeWise} INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id INNER JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id WHERE SST.stock_receiver_acknowlwdge = 'Completed' AND SM.isDeleted = false AND SST.entity_id = ${entity_id} GROUP BY SST.source_store_id ORDER BY store_id`;
        await db.sequelize.query(`SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);

        const result1 = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if(result1){
            const combinedResults = [];
            const resultMap = new Map();
            await result1.forEach(item => {
                const key = `${item.store_id}`;
                if (resultMap.has(key)) {
                  resultMap.get(key).itemQty += Number(item.itemQty);
                } else {
                  resultMap.set(key, { ...item, itemQty: Number(item.itemQty) });
                }
            });

            resultMap.forEach((value) => {
                combinedResults.push(value);
            });
            const result = combinedResults;
           return res.status(200).send({ code: 200, message: 'Available list', data: result });
        }else{
            return res.status(404).send({ code: 404, message: 'Data not found!'});
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}


// grn save data
exports.createGrnGoodsInventory = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const { body } = req;
        const { item_details } = body;
        if (!entity_id) {
            return res.status(400).send({
                code: 400,
                message: "entity_id is required!"
            });
        }

        const grnMastert = await db.grnMaster.create({
            grn_number: body.grn_number,
            invoiceDate: body.invoice_date,
            po_date: body.po_date,
            invoiceNo:body.invoice_number,
            po_number:body.po_number,
            vendor_id: body.po_supplier_vendor_name,
            po_category_type: body.po_type,
            invoiceDoc: body.uploadedFile,
            store_id: parseInt(body.store_id),
            usage_id: parseInt(body.uses_id),
            remarks: body.remarks,
            grnStatus: 'COMPLETED',
            goodInventoryStatus: 'DIRECT',
            container_type: 'store',
            entity_id: parseInt(entity_id),
            financial_year_id: body.financial_year_id,
            employee_id:body.employee_id
        });
        if(grnMastert){ 
            item_details.forEach(async element => {
                await db.grnItem.create({
                    asset_id: element.asset_id,
                    item_id: element.item_id,
                    itemCode: element.item_code,
                    itemQty:element.quantity,
                    invoice_qty:element.invoice_quantity,
                    price: element.price,
                    discount: element.discount,
                    total_discount: element.total_discount,
                    amount: element.amount,
                    grn_Id:grnMastert.dataValues.id,
                    invoice_status: 'COMPLETED'
                });
            });
        }
        return res.status(201).send({
            code: 201,
            message: 'Goods inventory created successfully!',
            data: grnMastert
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error?.message || "Internal server error"
        });
    }
};

exports.getAllGrnGoodsInventory = async (req, res) => {
    try {
        const {entity_id,employee_id} = req.params;
        const {role} = req.query;
        let employeeWise;
        if(role == 'Super Admin'){
            employeeWise = '';
        }
        else{
            employeeWise = `INNER JOIN STORE_ASSIGNED_EMPLOYEE AS SAE ON (SAE.store_id = SM.id AND SAE.status = 'ACTIVE' AND SAE.employee_id = ${employee_id})`
        }
        const query = `SELECT MI.id AS item_id, SUM(GI.itemQty) AS itemQty, MI.item_code, MI.item_name, MA.asset_category_name,MU.uom_name, SM.id AS store_id ,SM.name AS store_name, CASE WHEN GM.goodInventoryStatus = 'INDIRECT' THEN 'GRN' ELSE 'Direct Inventory' END AS goodInventoryStatus FROM GRN_MASTER AS GM INNER JOIN GRN_ITEM AS GI ON GM.id = GI.grn_Id INNER JOIN STORE_MASTER AS SM ON SM.id = GM.store_id ${employeeWise} INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id INNER JOIN MASTER_UOM as MU ON MU.uom_id = MI.uom_id WHERE GM.container_type ='store' AND GI.isDeleted = false AND GM.entity_id = ${entity_id} GROUP BY GI.item_id,GM.goodInventoryStatus,GM.store_id ORDER BY GM.id`;
        
        const query1 = `SELECT MI.id AS item_id, SUM(SSTL.quantity) AS itemQty, MI.item_code, MI.item_name, MA.asset_category_name,MU.uom_name, SM.id AS store_id ,SM.name AS store_name, CASE WHEN SST.stock_receiver_acknowlwdge = 'Completed' THEN 'Stock Transfer' ELSE '' END AS goodInventoryStatus FROM STORE_STOCK_TRANSFER AS SST INNER JOIN STORE_STOCK_TRANSFER_LIST AS SSTL ON SST.id = SSTL.stock_transfer_id LEFT JOIN MASTER_ITEM AS MI ON MI.id = SSTL.item_id INNER JOIN STORE_MASTER AS SM ON SM.id = SST.source_store_id ${employeeWise} INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id INNER JOIN MASTER_UOM as MU ON MU.uom_id = MI.uom_id WHERE SST.stock_receiver_acknowlwdge = 'Completed' AND SM.isDeleted = false  AND SST.entity_id = ${entity_id} GROUP BY SSTL.item_id,SST.source_store_id ORDER BY SM.id`;
        await db.sequelize.query(`SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);

        const [result1, result2] = await Promise.all([
            db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }),
            db.sequelize.query(query1, { type: db.sequelize.QueryTypes.SELECT })
        ]);
        
        // const combinedResults = [...result1, ...result2];
        // const result = combinedResults;
        const combinedResults = [];
        const resultMap = new Map();

        result1.forEach(item => {
            const key = `${item.store_id}_${item.item_id}`;
            if (resultMap.has(key)) {
              resultMap.get(key).itemQty += Number(item.itemQty);
            } else {
              resultMap.set(key, { ...item, itemQty: Number(item.itemQty) });
            }
        });
          
        result2.forEach(item => {
            const key = `${item.store_id}_${item.item_id}`;
            if (resultMap.has(key)) {
              resultMap.get(key).itemQty += Number(item.itemQty);
            } else {
              resultMap.set(key, { ...item, itemQty: Number(item.itemQty) });
            }
        });

        resultMap.forEach((value) => {
            combinedResults.push(value);
        });
        const result = combinedResults;

        res.status(200).send({ code: 200, message: 'Available list', data: result });
    } catch (error) {
        res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getAllGrnGoodsInventoryByGrnId = async (req, res) => {
    try {
        const {store_id} = req.params;
        const {item_id,goodInventoryStatus} = req.query;
        let status;
        // if(goodInventoryStatus == 'GRN'){
        //     status = `AND GM.goodInventoryStatus = 'INDIRECT'`
        // }
        // else if(goodInventoryStatus == 'Direct Inventory'){
        //     status = `AND GM.goodInventoryStatus = 'DIRECT'`
        // }else{
        //     status = ''
        // } 
    
       const query = `SELECT GM.grn_number, SM.name AS store_name, GI.item_id, GI.grn_Id, GI.itemQty, MI.item_code, MI.item_name, MA.asset_category_name, MU.uom_name, DATE_FORMAT(GI.createdAt, '%Y-%m-%d') AS createdAt,CASE WHEN GM.goodInventoryStatus = 'INDIRECT' THEN 'GRN' ELSE 'Direct Inventory' END AS goodInventoryStatus FROM GRN_MASTER AS GM INNER JOIN GRN_ITEM AS GI ON(GI.grn_Id = GM.id AND GM.store_id = ${store_id} AND container_type = 'store') INNER JOIN MASTER_ITEM AS MI ON (MI.id = GI.item_id AND GI.item_id = ${item_id}) INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id INNER JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id LEFT JOIN STORE_MASTER AS SM ON SM.id = GM.store_id WHERE GM.isDeleted = false ORDER BY GI.grn_Id`;
    
        const query1 = `SELECT SM.name AS store_name, SSTL.item_id, SSTL.quantity AS itemQty, MI.item_code, MI.item_name, MA.asset_category_name, MU.uom_name, DATE_FORMAT(SST.createdAt, '%Y-%m-%d') AS createdAt,CASE WHEN SST.stock_receiver_acknowlwdge = 'Completed' THEN 'Stock Transfer' ELSE '' END AS goodInventoryStatus FROM STORE_STOCK_TRANSFER AS SST INNER JOIN STORE_STOCK_TRANSFER_LIST AS SSTL ON (SST.id = SSTL.stock_transfer_id AND SST.stock_receiver_acknowlwdge = 'Completed') LEFT JOIN MASTER_ITEM AS MI ON (MI.id = SSTL.item_id AND SSTL.item_id = ${item_id}) INNER JOIN STORE_MASTER AS SM ON (SM.id = SST.source_store_id AND SST.source_store_id = ${store_id}) INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id INNER JOIN MASTER_UOM as MU ON MU.uom_id = MI.uom_id WHERE SST.stock_receiver_acknowlwdge = 'Completed' AND SM.isDeleted = false ORDER BY SSTL.stock_transfer_id`;
   
        const [result1, result2] = await Promise.all([
            db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }),
            db.sequelize.query(query1, { type: db.sequelize.QueryTypes.SELECT })
        ]);
        
        const combinedResults = [...result1, ...result2];
        const result = combinedResults;

        res.status(200).send({ code: 200, message: 'Available list', data: result });
    } catch (error) {
        res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.generateGrnNumber = async (req, res) => {
    try {
      const lastEntry = await db.grnMaster.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["grn_number"],  
      });
  
      let number;
      if(lastEntry) {
        const lastCode = parseInt(lastEntry.grn_number.split('GN')[1]);
        const newCode = lastCode + 1;
        number = 'GN' + newCode.toString().padStart(5, '0');
      } else {
        number = `GN00001`;
      }
      return res.status(200).send({ code: 200, message: "Batch Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};









