const db = require("../../models");


exports.generateBatchNumber = async (req, res) => {
    try {
      const lastEntry = await db.goodsInventory.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["batch_number"],
      });
  
      let number;
      const currentYear = new Date().getFullYear();
      if (lastEntry) {
        const lastCode = lastEntry.batch_number;
        const parts = lastCode.split('-');
        parts[parts.length - 2] = currentYear;
        let numberPart = parseInt(parts[2], 10);
        numberPart++;
        const newNumberPart = String(numberPart).padStart(5, '0');
        const newCode = `${parts[0]}-${parts[1]}-${newNumberPart}`;
        number =  newCode;
      } else {
        number = `BN-${currentYear}-00001`;
      }
      return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getAllGoodsInventory = async (req, res) => {
    try {
        const {entity_id} = req.params;
        const [inventoryList] = await db.sequelize.query(
        `SELECT GI.item_id,GI.asset_id,GI.product_id,GI.uses_id,GI.warehouse_id,GI.entity_id,CAST(GI.quantity AS UNSIGNED) AS quantity,MI.manage_by AS batchType,
        MI.item_name,MI.item_code, MA.asset_category_name,SPM.name AS product_name,MU.uom_name ,GI.item_id
        FROM GOODS_INVENTORY AS GI 
        LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id 
        LEFT JOIN MASTER_ASSET AS MA ON MA.id = GI.asset_id 
        LEFT JOIN SYS_PRODUCT_MASTER_MST as SPM ON SPM.id = GI.product_id 
        LEFT JOIN MASTER_UOM as MU ON MU.uom_id = MI.uom_id 
        WHERE GI.entity_id = ${entity_id} AND GI.isDeleted = false`);
        
        const [grnData] = await db.sequelize.query(
            `SELECT G.entity_id,G.warehouse_id ,CAST(GI.selection_item AS UNSIGNED) AS quantity,GS.batchType,GS.batchNo,SPM.name AS product_name,
            GS.expiryDate,GS.itemSerialNo,GS.item_id,MI.item_name,MI.item_code,MA.asset_category_name,MU.uom_name ,MI.product_id 
            FROM GRN_MASTER AS G
            INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
            INNER JOIN GRN_ITEM_STATUS AS GS ON GS.grn_item_id=GI.id
            INNER JOIN MASTER_ITEM AS MI ON MI.id=GS.item_id
            INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id 
            INNER JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id 
            INNER JOIN SYS_PRODUCT_MASTER_MST AS SPM ON SPM.id = MI.product_id 
            WHERE G.grnStatus = 'COMPLETED'`
           )
           
           const finalList = [...grnData,...inventoryList]
           const batchData = await finalList.filter(i => i.batchType === 'Batch Only');
           function mergeDataValue(batchData) {
            const mergedData = [];
            batchData.forEach(item => {
              const existingItem = mergedData.find(
                i =>
                  i.item_id === item.item_id
                 
              );
              
              if (existingItem) {
                existingItem.quantity += parseInt(item.quantity);
              } else {
                mergedData.push({ ...item });
              }
            });
            
            return mergedData;
          }
          const result = mergeDataValue(batchData);
          
           const SnoData = await grnData.filter(i => i.batchType === 'S.No. Only');
           const uniqueData = Object.values(
            SnoData.reduce((acc, current) => {
                const key = `${current.batchType}-${current.batchNo}-${current.item_id}`;
                if (!acc[key]) {
                    acc[key] = current;
                }
                return acc;
            }, {})
        );
        const SndataList  = await inventoryList.filter(i => i.batchType === 'S.No. Only')
        const newData = [...uniqueData,...SndataList]
       
        function mergeDataList(newData) {
            const mergedData = [];
            newData.forEach(item => {
              const existingItem = mergedData.find(
                i =>
                  i.item_id === item.item_id
                 
              );
              if (existingItem) {
               existingItem.quantity += parseInt(item.quantity);
              } else {
                mergedData.push({ ...item });
              }
            });
          
            return mergedData;
        }
        const finalResultList = mergeDataList(newData);
        const finalData = [...result,...finalResultList];
        if(finalData){
            return res.status(200).send({ code: 200, message: 'Available list', data: finalData });
        }else{
            return res.status(200).send({ code: 200, message: 'No data found', data: [] });
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getGoodsInventoryHistory = async (req, res) => {
    try {
        const {item_id} = req.params;
        const [result] = await db.sequelize.query(`
        SELECT MI.item_name, MI.item_code, GI.*,A.asset_category_name,S.name,P.name AS product_name,
        (GI.quantity * GI.basic_rate) AS value
        FROM GOODS_INVENTORY AS GI 
        INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
        INNER JOIN MASTER_ASSET AS A ON A.id=GI.asset_id
        INNER JOIN SYS_USES_MST AS S ON S.id= GI.uses_id
        INNER JOIN SYS_PRODUCT_MASTER_MST AS P ON P.id = GI.product_id
        WHERE GI.item_id = ${item_id} AND GI.isDeleted = false`);

        const [valueData] = await db.sequelize.query(
            `SELECT GI.item_id,I.item_name,I.item_code,I.capacity,GS.batchNo AS batch_number,GS.expiryDate AS batch_expiry_date,
           CAST( GI.invoice_qty AS UNSIGNED) AS invoice_qty,P.name AS product_name,A.asset_category_name,GI.invoice_qty AS quantity,
           G.invoiceDate AS inward_date,( GI.total_mvp /GI.invoice_qty) AS basic_rate,(GI.total_mvp * GI.invoice_qty) AS value
            FROM GRN_MASTER AS G
            INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
            INNER JOIN GRN_ITEM_STATUS AS GS ON GS.grn_item_id=GI.id
            INNER JOIN MASTER_ITEM AS I ON GI.item_id=I.id
            INNER JOIN MASTER_ASSET AS A ON A.id=I.asset_id
            INNER JOIN SYS_PRODUCT_MASTER_MST AS P ON P.id = I.product_id
            WHERE GI.item_id = ${item_id} AND G.grnStatus ='completed' `
        )
        const finalData = [...result,...valueData]
        
        res.status(200).send({ code: 200, message: 'Available list', data: finalData });
    } catch (error) {
        res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.createGoodsInventory = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const { body } = req;

        if (!entity_id) {
            return res.status(400).json({
                code: 400,
                message: "entity_id is required!"
            });
        }
        const checkValidation = await db.warehouse.sum('remaining_capacity', {
            where:{
                id:body.warehouse_id,isDeleted:false
            }
        })
        const itemExist = await db.ItemMaster.findOne({where:{id:body.item_id}})
        let total = itemExist.capacity * parseInt(body.quantity)
        if(checkValidation < parseInt(total)) {
            return res.status(404).send({code:404,message:"There is not enough space left in this warehouse, please go to warehosue master and create a new warehouse"})
        }
        const countValidation = await db.warehouseBifurcationRow.sum('remaining_capacity', {
            where: {
                id: body.row_id,
                isDeleted: false
            }
        });
        if(body.row_id != null){
            if(countValidation < parseInt(total)) {
                return res.status(404).send({code:404,message:"There is not enough space left in this row, please go to warehosue bifurcation and create a new row for this particular warehouse"})
            }
        }
       
        const countValidationSelf = await db.warehouseBifurcationSelf.sum('remaining_capacity', {
            where: {
                id: body.shelf_id ,  
                isDeleted: false
            }
        });

    
        if(body.shelf_id != null){
            if(countValidationSelf < parseInt(total) ) {
                return res.status(404).send({code:404,message:"There is not enough space left in this shelf, please go to warehosue bifurcation and create a new shelf for this particular warehouse"})
            }
        }
        
        const countValidationSection = await db.warehouseBifurcationSection.sum('remaining_capacity', {
            where: {
                id: body.section_id,
                isDeleted: false
            }
        });
        if(body.section_id != null){
            if(countValidationSection < parseInt(total)) {
                return res.status(404).send({code:404,message:"There is not enough space left in this section, please go to warehosue bifurcation and create a new section for this particular warehouse"})
            }
        }
        if(body.warehouse_id){
            await db.warehouse.update({remaining_capacity:checkValidation-parseInt(total)},{where:{id:body.warehouse_id}})
        }
        if(body.row_id){
            await db.warehouseBifurcationRow.update({remaining_capacity:countValidation-parseInt(total)},{where:{id:body.row_id}})
        }
        if(body.shelf_id){
            await db.warehouseBifurcationSelf.update({remaining_capacity:countValidationSelf-parseInt(total)},{where:{id:body.shelf_id}})
        }
        if(body.section_id){
            await db.warehouseBifurcationSection.update({remaining_capacity:countValidationSection-parseInt(total)},{where:{id:body.section_id}})
        }
        const createdGoodsInventory = await db.goodsInventory.create({
            item_id: body.item_id,
            asset_id: body.asset_id,
            product_id: body.product_id,
            batch_number: body.batch_number,
            inward_date: body.inward_date,
            batch_expiry_date: body.batch_expiry_date,
            quantity: body.quantity,
            basic_rate: body.basic_rate,
            total_value: body.total_value,
            warehouse_id: body.warehouse_id,
            uses_id: body.uses_id,
            upload_document: body.uploadedFile,
            remarks: body.remarks,
            entity_id: parseInt(entity_id),
            shelf_id: body.shelf_id,
            row_id: body.row_id,
            section_id: body.section_id,
        });
  
               db.financial_And_Account_Journal_List.bulkCreate([
                    {
                    chart_account_id: 97,
                  debit_amount: body.total_value,
                   credit_amount: 0.00,
                     entity_id:entity_id,
                    entry_status:'-----'
                 },
                  {
                      chart_account_id: 105,
                      debit_amount: 0.00,
                    credit_amount: body.total_value,
                     entity_id:entity_id,
                    entry_status:'-----'
                    
                  }
               ]);
          
       if(createdGoodsInventory){
        return res.status(201).send({code: 201,message:'Created Successfully'})
       }else{
        return res.status(200).send({code: 400,message: 'Failed to create goods inventory'})
       }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error?.message || "Internal server error"
        });
    }
};

exports.getWarehouseDashboard = async (req, res) => {
    try {
        const {entity_id} = req.params;
        const query = `
        SELECT name,code,capacity ,(capacity-remaining_capacity) AS used_capacity
        FROM WAREHOUSE_MASTER 
        WHERE entity_id = ${entity_id} AND isDeleted = false`;
        const result = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });
        res.status(200).send({ code: 200, message: 'Available list', data: result });
    } catch (error) {
        res.status(500).send({ code: 500, message: error?.message || "Internal server error" });
    }
}

exports.getAllInventoryRegister = async (req, res) => {
    try {
        const {entity_id,asset_id,item_id,to_date,from_date,warehouse_id} = req.query;

        let conditionInventory = '';
       if (warehouse_id) {
           conditionInventory += ` AND G.warehouse_id=${warehouse_id}`;
       }
       if (item_id) {
           conditionInventory += ` AND G.item_id=${item_id}`;
       }
       if (asset_id) {
           conditionInventory += ` AND G.asset_id=${asset_id}`;
       }
       if (to_date && from_date) {
           conditionInventory += ` AND G.updatedAt BETWEEN '${from_date}' AND '${to_date}'`;
       }
       if (!conditionInventory) {
           conditionInventory = 'AND 1=1';
       }

       let conditionGrn = '';
       if (warehouse_id) {
           conditionGrn += ` AND G.warehouse_id=${warehouse_id}`;
       }
       if (item_id) {
           conditionGrn += ` AND GS.item_id=${item_id}`;
       }
       if (asset_id) {
           conditionGrn += ` AND MI.asset_id=${asset_id}`;
       }
       if (to_date && from_date) {
           conditionGrn += ` AND G.updatedAt BETWEEN '${from_date}' AND '${to_date}'`;
       }
       if (!conditionGrn) {
           conditionGrn = 'AND 1=1';
       }

        const [inventoryList] = await db.sequelize.query(
        `SELECT G.item_id,G.asset_id,G.product_id,G.uses_id,G.warehouse_id,G.entity_id,CAST(G.quantity AS UNSIGNED) AS quantity,MI.manage_by AS batchType,
        MI.item_name,MI.item_code, MA.asset_category_name,SPM.name AS product_name,MU.uom_name ,G.item_id,G.basic_rate AS incomming_rate,G.total_value,
        '0' AS opening_stock,DATE_FORMAT(G.createdAt,'%Y-%m-%d') AS updatedAt,G.createdAt,G.batch_number
        FROM GOODS_INVENTORY AS G 
        LEFT JOIN MASTER_ITEM AS MI ON MI.id = G.item_id 
        LEFT JOIN MASTER_ASSET AS MA ON MA.id = G.asset_id 
        LEFT JOIN SYS_PRODUCT_MASTER_MST as SPM ON SPM.id = G.product_id 
        LEFT JOIN MASTER_UOM as MU ON MU.uom_id = MI.uom_id
        WHERE G.entity_id = ${entity_id} AND G.isDeleted = false ${conditionInventory}`);
        
        const [grnData] = await db.sequelize.query(
            `SELECT G.entity_id,G.warehouse_id ,CAST(GI.selection_item AS UNSIGNED) AS quantity,GS.batchType,GS.batchNo,SPM.name AS product_name,
            (G.total_amount / GI.invoice_qty) AS incomming_rate,G.total_amount AS total_value,'0' AS opening_stock,DATE_FORMAT(G.createdAt,'%Y-%m-%d') AS updatedAt,
            GS.expiryDate,GS.itemSerialNo,GS.item_id,MI.createdAt,MI.item_name,MI.item_code,MA.asset_category_name,MU.uom_name ,MI.product_id,GS.batchNo AS batch_number
            FROM GRN_MASTER AS G
            INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
            INNER JOIN GRN_ITEM_STATUS AS GS ON GS.grn_item_id=GI.id
            INNER JOIN MASTER_ITEM AS MI ON MI.id=GS.item_id
            INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id 
            INNER JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id 
            INNER JOIN SYS_PRODUCT_MASTER_MST AS SPM ON SPM.id = MI.product_id 
            WHERE G.grnStatus = 'COMPLETED'  ${conditionGrn}`
           )
           
           const finalList = [...grnData,...inventoryList]
           const batchData = await finalList.filter(i => i.batchType === 'Batch Only');
           function mergeDataValue(batchData) {
            const mergedData = [];
            batchData.forEach(item => {
              const existingItem = mergedData.find(
                i =>
                  i.item_id === item.item_id && i.createdAt === item.createdAt
                 
              );
              
              if (existingItem) {
                existingItem.quantity += parseInt(item.quantity);
              } else {
                mergedData.push({ ...item });
              }
            });
            
            return mergedData;
          }
          const result = mergeDataValue(batchData);
          
           const SnoData = await grnData.filter(i => i.batchType === 'S.No. Only');
           const uniqueData = Object.values(
            SnoData.reduce((acc, current) => {
                const key = `${current.batchType}-${current.batchNo}-${current.item_id} - ${current.createdAt}`;
                if (!acc[key]) {
                    acc[key] = current;
                }
                return acc;
            }, {})
        );
        const SndataList  = await inventoryList.filter(i => i.batchType === 'S.No. Only')
        const newData = [...uniqueData,...SndataList]
       
        function mergeDataList(newData) {
            const mergedData = [];
            newData.forEach(item => {
              const existingItem = mergedData.find(
                i =>
                    i.item_id === item.item_id && i.createdAt === item.createdAt
                 
              );
              if (existingItem) {
               existingItem.quantity += parseInt(item.quantity);
              } else {
                mergedData.push({ ...item });
              }
            });
          
            return mergedData;
        }
        const finalResultList = mergeDataList(newData);
        const finalData = [...result,...finalResultList];
        if(finalData){
            return res.status(200).send({ code: 200, message: 'Available list', data: finalData });
        }else{
            return res.status(200).send({ code: 200, message: 'No data found', data: [] });
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
    }
}









