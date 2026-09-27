const db = require("../../models");


exports.generateRandomStockId = async (req, res) => {
    try {
      const lastEntry = await db.store_stock_transfer.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["random_id"],
      });
  
      let number;
      if(lastEntry) {
        const lastCode = parseInt(lastEntry.random_id.split('WSE')[0]);
        const newCode = lastCode + 1;
        number = newCode.toString().padStart(2, '0') + 'WSE';
      } else {
        number = `01WSE`;
      }
      return res.status(200).send({ code: 200, message: "Random Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.createStockTransfer = async (req, res) => {
     const transaction = await db.sequelize.transaction();
    try {
        const {entity_id} = req.params;
        const {body} = req;
        const {item_details} = req.body;
        if (!entity_id) {
            await transaction.rollback();
            return res.status(500).json({
                code: 500,
                message: "entity_id is Required!"
            });
        }
       
        const createdstock = await db.store_stock_transfer.create({
            stock_entry_type: body.stock_entry_type,
            date: body.date,
            reason: body.reason,
            source_store_id: body.source_store_id,
            target_store_id: body.target_store_id,
            expected_transfer_date: body.expected_transfer_date,
            driver_name: body.driver_name,
            vehicle_no: body.vehicle_no,
            uploadedFile: body.uploadedFile,
            remarks: body.remarks,
            random_id: body.random_id,
            entity_id: parseInt(entity_id)
        },{transaction});

        if(createdstock){
            await Promise.all(item_details.map(item => {
                const { quantity, item_id, item_code } = item;
                return db.store_stock_transfer_list.create({
                    quantity,
                    stock_transfer_id: createdstock.id,
                    item_id,
                    item_code
                }, { transaction });
            }));
        }
        await transaction.commit();
        res.status(201).json({
            code: 201,
            message: 'Stock Transfer successfully!'
        });
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
        }
    
        if (!res.headersSent) {
            return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
        }
    }
}

exports.getAllStockTransfer = async (req, res) => {
    try {
        const {entity_id,employee_id,role} = req.query;
        let employeeWise;
        if(role == 'Super Admin'){
            employeeWise = ''
        }else{
            employeeWise =`INNER JOIN STORE_ASSIGNED_EMPLOYEE AS SAE ON (SAE.store_id = ST.source_store_id AND SAE.status = 'ACTIVE' AND SAE.employee_id = ${employee_id})`
        }
        const [result] = await db.sequelize.query(
        `SELECT ST.id, ST.random_id, ST.stock_entry_type, ST.store_transfer_status, ST.date, SM.name AS warehouse_source_name, SMS.name AS target_ware_house FROM STORE_STOCK_TRANSFER AS ST ${employeeWise} LEFT JOIN STORE_MASTER AS SM ON SM.id = ST.source_store_id LEFT JOIN STORE_MASTER AS SMS ON SMS.id = ST.target_store_id WHERE ST.entity_id = ${entity_id} AND ST.isDeleted = false ORDER BY ST.id DESC`);

        if(result){
            return res.status(200).send({ code: 200, message: 'Available list', data: result });
        }else{
            return res.status(404).send({ code: 404, message: ' No Data Found'})
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getStockTransferById = async (req, res) => {
    try {
        const stock_id = req.params.id;
        // const [result] = await db.sequelize.query(
        // `SELECT ST.id, ST.random_id, ST.stock_entry_type, ST.date, ST.remarks, ST.uploadedFile, ST.vehicle_no, ST.expected_transfer_date, ST.driver_name, ST.reason, ST.source_store_id, ST.target_store_id 
        // FROM STORE_STOCK_TRANSFER AS ST 
        // LEFT JOIN STORE_STOCK_TRANSFER_LIST AS STL ON STL.stock_transfer_id = ST.id 
        // WHERE ST.id = ${stock_id} AND ST.isDeleted = false 
        // ORDER BY ST.id DESC;
        // `);

        stockdata = await db.store_stock_transfer.findOne({
            where: { id: stock_id, isDeleted: false, status: "ACTIVE" },
            attributes: [
                "id",
                "random_id",
                "stock_entry_type",
                "date",
                "remarks",
                "uploadedFile",
                "vehicle_no",
                "expected_transfer_date",
                "driver_name",
                "reason",
                "source_store_id",
                "target_store_id",
                "store_transfer_status"
            ]
        });
        const [stocklist] = await db.sequelize.query(`
            SELECT 
                STL.id,
                STL.item_code,
                STL.item_id,
                STL.quantity,
                IM.item_name
            FROM STORE_STOCK_TRANSFER_LIST AS STL
            LEFT JOIN MASTER_ITEM AS IM ON IM.id = STL.item_id
            WHERE STL.stock_transfer_id = ${stockdata.id} AND STL.isDeleted = false AND STL.status = 'ACTIVE'
        `);

        if(stockdata){
            return res.status(200).send({ code: 200, message: 'Available list', data: stockdata,list:stocklist });
        }else{
            return res.status(404).send({ code: 404, message: ' No Data Found'})
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getAllRecieveStockTransfer= async (req, res) => {
    try {
        const {entity_id,employee_id,role} = req.query;
        let query;
        if(role == 'Super Admin'){
            query = `SELECT ST.id,ST.random_id,ST.stock_entry_type,ST.store_transfer_status,ST.date,SSM.name AS stock_source_name,TSM.name AS stock_target_name, ST.stock_receiver_acknowlwdge 
            FROM STORE_STOCK_TRANSFER AS ST INNER JOIN STORE_MASTER AS SSM ON SSM.id = ST.source_store_id 
            INNER JOIN STORE_MASTER AS TSM ON TSM.id = ST.target_store_id 
            WHERE ST.entity_id = ${entity_id} AND (ST.isDeleted = false AND ST.store_transfer_status = 'Approved') ORDER BY ST.id DESC`;
        }else{
            query = `SELECT ST.id,ST.random_id,ST.stock_entry_type,ST.store_transfer_status,ST.date,SSM.name AS stock_source_name,TSM.name AS stock_target_name, ST.stock_receiver_acknowlwdge 
            FROM STORE_STOCK_TRANSFER AS ST INNER JOIN STORE_MASTER AS SSM ON SSM.id = ST.source_store_id 
            INNER JOIN STORE_MASTER AS TSM ON TSM.id = ST.target_store_id INNER JOIN STORE_ASSIGNED_EMPLOYEE AS SAE ON (SAE.store_id = ST.source_store_id AND SAE.status = 'ACTIVE' AND SAE.employee_id = ${employee_id})
            WHERE ST.entity_id = ${entity_id}  AND (ST.isDeleted = false AND ST.store_transfer_status = 'Approved') ORDER BY ST.id DESC`;
        }

        const result = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });
        if(result){
            return res.status(200).send({ code: 200, message: 'Available list', data: result });
        }else{
            return res.status(404).send({ code: 404, message: ' No Data Found'})
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
    }
}


exports.createReceivedStockTransfer = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { entity_id } = req.params;
        const { item_details, source_store_id, target_store_id,acknowledge,date,date_recieved,expected_transfer_date,reason,recieve_by,remarks,stock_entry_type, id } = req.body;

        if (!entity_id) {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "entity_id is required" });
        }

        if (!Array.isArray(item_details) || item_details.length === 0) {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Invalid item_details array" });
        }

        const createStockTransfer = await db.receive_store_stock_transfer.create({
            stock_transfer_id: id,
            source_store_id: source_store_id,
            target_store_id: target_store_id,
            acknowledge: acknowledge,
            date: date,
            date_recieved: date_recieved,
            expected_transfer_date: expected_transfer_date,
            reason: reason,
            recieve_by: recieve_by,
            remarks: remarks,
            stock_entry_type: stock_entry_type,
            entity_id: parseInt(entity_id)
        }, { transaction });

        await db.store_stock_transfer.update({ stock_receiver_acknowlwdge: "Completed" }, { where: { id }, transaction });

        await Promise.all(item_details.map(item => {
            const { quantity, accepted_qty, item_id, item_code } = item;
          
            return db.receive_store_stock_transfer_list.create({
                quantity,
                accepted_qty: accepted_qty,
                rec_stock_transfer_id: createStockTransfer.id,
                item_id,
                item_code
            }, { transaction });
        }));

        await transaction.commit();
        return res.status(201).send({ code: 201, message: "Received Stock Transfer Created successfully!" });
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
        }
    
        if (!res.headersSent) {
            return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
        }
    }
};

exports.getAllReceiveStockTransferById = async (req, res) => {
    try {
        const stock_id = req.params.id;
        stockdata = await db.receive_store_stock_transfer.findOne({
            where: { stock_transfer_id: stock_id, isDeleted: false, status: "ACTIVE" },
            attributes: [
                "id",
                "stock_entry_type",
                "date",
                "date_recieved",
                "reason",
                "recieve_by",
                "remarks",
                "expected_transfer_date",
                "acknowledge",
                "stock_transfer_id",
                "source_store_id",
                "target_store_id"
            ]
        });
        const [stocklist] = await db.sequelize.query(`
            SELECT 
                RSTL.id,
                RSTL.item_code,
                RSTL.item_id,
                RSTL.quantity,
                RSTL.accepted_qty,
                IM.item_name
            FROM RECEIVE_STORE_STOCK_TRANSFER_LIST AS RSTL
            LEFT JOIN MASTER_ITEM AS IM ON IM.id = RSTL.item_id
            WHERE RSTL.rec_stock_transfer_id = ${stockdata.id} AND RSTL.isDeleted = false AND RSTL.status = 'ACTIVE'
        `);

        if(stockdata){
            return res.status(200).send({ code: 200, message: 'Available list', data: stockdata,list:stocklist });
        }else{
            return res.status(404).send({ code: 404, message: ' No Data Found'})
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getAssignedStoreList = async (req, res) => {
    try {
        const {entity_id,employee_id,role} = req.params;
        let employeeWise;
        if(role == 'Super Admin'){
            employeeWise =''
        }else{
            employeeWise = `AND SAE.employee_id = ${employee_id}`
        }
        const query = `SELECT SM.id, SM.name, SM.code FROM STORE_MASTER AS SM INNER JOIN STORE_ASSIGNED_EMPLOYEE AS SAE ON (SAE.store_id = SM.id AND SAE.status = 'ACTIVE' ${employeeWise}) WHERE SM.entity_id = ${entity_id} AND SM.isDeleted = false`;
        const result = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });
        res.status(200).send({ code: 200, message: 'Available list', data: result });
    } catch (error) {
    res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getTargetStockList = async (req, res) => {
    try {
        const {entity_id} = req.params;
        const item = req.body;

        const queries = item.map(item => {
            let itemQty;
            let itemId;
            if(item.quantity && !item.item_id){
                itemQty = `GI.itemQty >= ${item.quantity}`
                itemId = ''
            }else if(item.item_id && !item.quantity){
                itemId = `GI.item_id = ${item.item_id}`
                itemQty = ''
            }else if(item.item_id && item.quantity){
                itemId = `GI.item_id = ${item.item_id}`
                itemQty = `HAVING SUM(GI.itemQty) >= ${item.quantity}`
            }else{
                itemId = ''
                itemQty = ''
            }
            
          return `SELECT GI.item_id, SM.name AS store_name, SM.id AS store_id,SUM(GI.itemQty) AS itemQty FROM GRN_MASTER AS GM INNER JOIN GRN_ITEM AS GI ON GM.id = GI.grn_Id AND GM.container_type = 'store' INNER JOIN STORE_MASTER AS SM ON SM.id = GM.store_id AND GM.container_type = 'store' WHERE SM.entity_id = ${entity_id} AND ${itemId} AND GM.isDeleted = false AND SM.isDeleted = false GROUP BY GI.item_id, GM.store_id ${itemQty}`;
        });
        await db.sequelize.query(`SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);
        const result = await Promise.all(queries.map(query => 
          db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT })
        ));
        const flattenedResult = result.flat();

        if(flattenedResult.length === 0){
            return res.status(404).send({ code: 404, message: 'The requested item is not exist in the store', data: flattenedResult });
        }else{
            return res.status(200).send({ code: 200, message: 'Available store list', data: flattenedResult });
        }
       
    } catch (error) {
    res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getAllStoreTransferList = async (req, res) => {
    try {
        const {entity_id, status} = req.params;
        const {employee_id, role} = req.query;
        let query;
        let stock_status;
        if(status == 'All'){
            stock_status = ''
        }
        else{
            stock_status = `AND SST.store_transfer_status = '${status}'`
        }

        if(role == 'Super Admin' && status == 'All'){
            query = `SELECT SM.name AS store_name, SM.id AS store_id, SST.id AS stock_transfer_id, MI.item_name, MI.item_code,MU.uom_name, SUM(SSTL.quantity) AS total_item_qty FROM STORE_STOCK_TRANSFER AS SST LEFT JOIN STORE_STOCK_TRANSFER_LIST AS SSTL ON SST.id = SSTL.stock_transfer_id LEFT JOIN STORE_MASTER AS SM ON SM.id = SST.target_store_id LEFT JOIN MASTER_ITEM AS MI ON MI.id = SSTL.item_id LEFT JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id WHERE SST.entity_id = ${entity_id} AND SM.isDeleted = false ${stock_status} GROUP BY SSTL.stock_transfer_id, SST.target_store_id ORDER BY SST.id DESC`;
        }else{
            query = `SELECT SM.name AS store_name, SM.id AS store_id, SST.id AS stock_transfer_id, MI.item_name, MI.item_code,MU.uom_name, SUM(SSTL.quantity) AS total_item_qty FROM STORE_STOCK_TRANSFER AS SST LEFT JOIN STORE_STOCK_TRANSFER_LIST AS SSTL ON SST.id = SSTL.stock_transfer_id LEFT JOIN STORE_MASTER AS SM ON SM.id = SST.target_store_id LEFT JOIN MASTER_ITEM AS MI ON MI.id = SSTL.item_id LEFT JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id INNER JOIN STORE_ASSIGNED_EMPLOYEE AS SAE ON (SAE.store_id = SM.id AND SAE.status = 'ACTIVE' AND SAE.employee_id = ${employee_id}) WHERE SST.entity_id = ${entity_id} AND SM.isDeleted = false ${stock_status} GROUP BY SSTL.stock_transfer_id, SST.target_store_id ORDER BY SST.id DESC`;
        }
         await db.sequelize.query(`SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);
        const result = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });
        res.status(200).send({ code: 200, message: 'Available store list', data: result });
    } catch (error) {
    res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}


exports.storeStockRequest = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { stock_transfer_id, stockReq } = req.body;

        if (!stock_transfer_id) {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Stock transfer ID is required!" });
        }

        const stockdata = await db.store_stock_transfer.findOne({
            where: { id: stock_transfer_id, isDeleted: false, status: "ACTIVE" },
            transaction
        });

        if (!stockdata) {
            await transaction.rollback();
            return res.status(409).send({ code: 409, message: "Stock transfer ID does not exist or is inactive!" });
        }

        await db.store_stock_transfer.update(
            { store_transfer_status: stockReq }, 
            { where: { id: stock_transfer_id }, transaction }
        );
        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Stock Transfer Updated successfully!" });
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
        }

        if (!res.headersSent) {
            console.error(error);
            return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
        }
    }
};


exports.stockTransferApprover = async (req, res) => {
    try {
        const {store_id,stock_transfer_id} = req.params;
        if(!store_id || !stock_transfer_id) {
            return res.status(400).send({ code: 409, message: 'The store_id and stock_transfer_id are required!' });
        }
          
        const query = `SELECT SAE.employee_id, SST.store_transfer_status, CONCAT(HRU.first_name, ' ', HRU.last_name) AS employee_full_name FROM STORE_MASTER AS SM INNER JOIN STORE_ASSIGNED_EMPLOYEE AS SAE ON (SM.id = SAE.store_id AND SAE.status = 'ACTIVE' AND SAE.store_id = ${store_id}) INNER JOIN HRMS_REGISTERED_USER AS HRU ON (HRU.employee_id = SAE.employee_id AND SAE.status = 'ACTIVE') INNER JOIN STORE_STOCK_TRANSFER AS SST ON (SST.target_store_id = SM.id AND SST.id = ${stock_transfer_id}) WHERE SM.id = ${store_id} AND SST.id = ${stock_transfer_id} AND SM.isDeleted = false`;
        const result = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });
        return res.status(200).send({ code: 200, message: 'Available store list', data: result });
       
    } catch (error) {
    res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}
