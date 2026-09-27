const db = require("../../../models/index");
const { Op } = require("sequelize");

module.exports.salesOrderList = async (req, res) => {
  try {
    const login_id = req.params.employee_id;
    let condition;
    if (login_id === 23 || login_id == "23" || login_id == "Super Admin") {
      condition = `1=1`;
    } else {
      condition = `CL.login_id=${login_id} OR CP.employee_id=${login_id}`;
    }
    const [getDealClose] = await db.sequelize.query(
      `SELECT 
             CP.proposal_no,CP.grant_total, CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,CL.contact_person_name,
			       CADM.order_number,CADM.do_date,CADM.id AS order_no_id,
             DATE_FORMAT(CP.createdAt,'%Y-%m-%d') AS createdAt,CL.company_name,C.proposal_id,'pending' AS status
       FROM 
             CRM_PROPOSAL_DEAL_CLOSE_MST AS C
       INNER JOIN 
             CRM_CREATE_PROPOSAL_MST AS CP ON CP.id=C.proposal_id
       INNER JOIN 
             CRM_VERSION_PROPOSAL_MST AS CV ON CV.id=C.version_id 
       INNER JOIN 
             CRM_CREATE_LEAD_MST AS CL ON CL.id= CP.create_lead_id
                    INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id=CL.login_id
                     LEFT JOIN CRM_ADD_DO_MST AS CADM ON CADM.proposal_id=CP.id
                    WHERE ${condition}  AND CADM.order_number IS  NOT NULL AND CADM.order_number <> '' AND dispatch_status="PENDING" ORDER BY CP.id DESC`
    );

    const [dataList] = await db.sequelize.query(`
                SELECT C.id AS proposal_id,C.lead_owner,C.company_name,C.proposal_no,CADM.order_number,CADM.do_date,CADM.id  AS order_no_id,C.contact_person_name,
                DATE_FORMAT(C.createdAt,'%Y-%m-%d') AS createdAt,C.grant_total,'pending' AS status FROM CRM_CREATE_PROPOSAL_MST AS C
                  LEFT JOIN CRM_ADD_DO_MST AS CADM ON CADM.proposal_id=C.id
                WHERE C.existing_client = true AND dispatch_status='PENDING' AND proposal_status='approved'  AND CADM.order_number IS  NOT NULL AND CADM.order_number <> '' ORDER BY C.id DESC
                `);

    const Obj = [...getDealClose, ...dataList];
    const sortedResults = Obj.sort((a, b) => b.proposal_id - a.proposal_id);
    if (getDealClose) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: sortedResults });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: " not data found", data: sortedResults });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};





module.exports.dispatchedOrderList = async (req, res) => {
  try {
    const login_id = req.params.employee_id;
    let condition;
    if (login_id === 23 || login_id == "23" || login_id == "Super Admin") {
      condition = `1=1`;
    } else {
      condition = `CL.login_id=${login_id} OR CP.employee_id=${login_id}`;
    }
    const [getDealClose] = await db.sequelize.query(
      `SELECT CP.proposal_no,CP.grant_total, CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,CL.contact_person_name,
			  CADM.order_number,CADM.do_date,CADM.id AS order_no_id,
                    DATE_FORMAT(CP.createdAt,'%Y-%m-%d') AS createdAt,CL.company_name,C.proposal_id,
                    'complete' AS status
                    FROM CRM_PROPOSAL_DEAL_CLOSE_MST AS C
                    INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id=C.proposal_id
                    INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id=C.version_id 
                    INNER JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id= CP.create_lead_id
                    INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id=CL.login_id
                     LEFT JOIN CRM_ADD_DO_MST AS CADM ON CADM.proposal_id=CP.id
                     
                    WHERE ${condition}  AND CADM.id IN (SELECT addDO_id FROM DISPATCH_ORDER ORDER BY id DESC)  AND CADM.order_number IS  NOT NULL AND CADM.order_number <> '' AND dispatch_status="APPROVED" `
    );

    const [dataList] = await db.sequelize.query(`
                SELECT C.id AS proposal_id,C.lead_owner,C.company_name,C.proposal_no, C.contact_person_name ,CADM.order_number,CADM.do_date,CADM.id  AS order_no_id,
                DATE_FORMAT(C.createdAt,'%Y-%m-%d') AS createdAt,C.grant_total, 'complete' AS status FROM CRM_CREATE_PROPOSAL_MST AS C
                  LEFT JOIN CRM_ADD_DO_MST AS CADM ON CADM.proposal_id=C.id
                WHERE C.existing_client = true AND  CADM.id IN (SELECT addDO_id FROM DISPATCH_ORDER ORDER BY id DESC) AND proposal_status='approved' AND dispatch_status='APPROVED'  AND CADM.order_number IS  NOT NULL AND CADM.order_number <> ''   
                `);

    const Obj = [...getDealClose, ...dataList];
    const sortedResults = Obj.sort((a, b) => b.proposal_id - a.proposal_id);
    if (getDealClose) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: sortedResults });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: " not data found", data: sortedResults });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
module.exports.getSaleByOrder = async (req, res) => {
  try {
    const orderNoId = req.params.order_no_id;
        await db.sequelize.query(`SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);

    //     let crmAddDO = await db.models.addDo.findOne({where:{id:orderNoId}},{attributes:["proposal_id"]});

    const [result] = await db.sequelize.query(`
           SELECT DISTINCT CA.id,CA.do_date, CA.order_number,CA.billing_address,CA.shipping_address,CA.upload_file,CA.notes,CA.terms_and_conditions,C.proposal_no, C.id,
      
           C.mail_id , C.company_name,C.contact_person_name,C.contact_number,
          
           DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
           
           FROM CRM_CREATE_PROPOSAL_MST AS C
           
           INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
          
           INNER JOIN CRM_ADD_DO_MST AS CA ON C.id=CA.proposal_id
           
           WHERE CA.id=${orderNoId}`);

    const [allResult] = await db.sequelize.query(
      `
                  SELECT DISTINCT CA.id,CA.do_date, CA.order_number,CA.billing_address,CA.shipping_address, CA.upload_file, CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
                  
                  P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, PV.variant_name,
                 
                  P.product_description, P.product_list_price as price_per_unit, P.maximum_discount, T.uom_name, T.uom_id,CP.product_category_id, CP.variant_id
                  
                  FROM CRM_PROPOSAL_LIST_MST AS CP
                  
                  INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
                  
                  INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
                 
                  INNER JOIN MASTER_PRODUCT_VARIANT AS PV ON CP.variant_id = PV.id
                 
                  INNER JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id 
                 
                  INNER JOIN CRM_ADD_DO_MST AS CA ON C.id=CA.proposal_id
                 
                  WHERE CA.id=${orderNoId}  GROUP BY CA.id` 
    );
    const transformedResult = {
      ...result[0],
      productDetailList: allResult,
    };
    if (transformedResult) {
      return res.status(200).send({ code: 200, message: "success", data: transformedResult });
    } else {
      return res.status(404).send({ code: 404, message: " data not found ", data: transformedResult, });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getWarehouseListByProductQuantityback = async (req, res) => {
  try {
    let productData = req.query;
    let parseData = JSON.parse(productData.product_id);
    let warehouseList = [];

    if (parseData.length > 0) {
      const productIds = parseData.map((x) => x.product_master_id);
      const qtyConditions = parseData
        .map(
          (x) =>
            `SUM(CASE WHEN SL.product_id = ${x.product_master_id} THEN SL.quantity ELSE 0 END) >= ${x.qty}`
        )
        .join(" AND ");

      console.log(productIds);
      console.log(qtyConditions);
      return

      let query = `
           SELECT 
      wd.id AS warehouse_id,
      wd.name AS warehouse_name,
      wd.status,
      PL.date AS date,
      PL.status AS production_status,
      SL.block_id,
      SL.bay_id,
      SL.rack_id,
      SL.quality_id,
      SUM(SL.quantity) AS total_quantity,  -- Aggregating quantity
      SL.product_id
    FROM WAREHOUSE_MASTER AS wd
    INNER JOIN STOCK_LOCATION AS SL ON wd.id = SL.warehouse_id
    INNER JOIN PRODUCTION_LIST_MST_SHIFT AS PL ON SL.quality_id = PL.id
    WHERE SL.product_id IN (${productIds.join(",")}) 
    GROUP BY wd.id, wd.name, wd.status, PL.date, PL.status, SL.block_id, SL.bay_id, SL.rack_id, SL.quality_id, SL.product_id
    HAVING ${qtyConditions} AND SUM(SL.quantity) >= 1
        `;

      let result = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      warehouseList.push(...result);
      return res.status(400).json({ success: false, message: "ddd", data: warehouseList });

      // Using Promise.all to fetch block, bay, and rack data concurrently
      let blockPromises = [];
      let bayPromises = [];
      let rackPromises = [];
      let rackAcknowledgPromises = [];

      for (let item of warehouseList) {
        blockPromises.push(...item.block_id.map(block => db.bayBlock.findOne({ where: { id: block } })));
        bayPromises.push(...item.bay_id.map(bay => db.bayBlockBay.findOne({ where: { id: bay } })));
        rackPromises.push(...item.rack_id.map(rack => db.bayRack.findOne({ where: { id: rack } })));
        rackAcknowledgPromises.push(...item.rack_id.map(rack => db.stockAcknowledgedRack.findOne({ where: { rack_id: rack } })));
      }

      const blockData = await Promise.all(blockPromises);
      const bayData = await Promise.all(bayPromises);
      const rackData = await Promise.all(rackPromises);
      const rackAcknowledgData = await Promise.all(rackAcknowledgPromises);

      if (warehouseList.length === 0) {
        return res.status(400).json({ success: false, message: "Item not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Warehouse list",
        data: {
          warehouseList,
          blockData,
          bayData,
          rackData,
          rackAcknowledgData
        },
      });
    } else {
      return res.status(400).json({ success: false, message: "No products provided" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

};

module.exports.getWarehouseListByProductQuantity = async (req, res) => {
  try {
    let productData = req.query;
    let parseData = JSON.parse(productData.product_id);
    let warehouseList = [];

    if (parseData.length > 0) {
      const productIds = parseData.map((x) => x.product_master_id);
      const qtyConditions = parseData
        .map(
          (x) =>
            `SUM(CASE WHEN SL.product_id = ${x.product_master_id} THEN SL.quantity ELSE 0 END) >= 0`
        )
        .join(" AND ");

      let query = `
           SELECT 
      wd.id AS warehouse_id,
      wd.name AS warehouse_name,
      wd.status,
      SL.block_id,
      SL.bay_id,
      SL.rack_id,
      SL.quality_id,
      SUM(SL.quantity) AS total_quantity,  -- Aggregating quantity
      SL.product_id
    FROM WAREHOUSE_MASTER AS wd
    INNER JOIN STOCK_LOCATION AS SL ON wd.id = SL.warehouse_id
    WHERE SL.product_id IN (${productIds.join(",")}) 
    GROUP BY wd.id, wd.name, wd.status,  SL.block_id, SL.bay_id, SL.rack_id, SL.quality_id, SL.product_id
    HAVING ${qtyConditions} AND SUM(SL.quantity) >= 1
        `;

      let result = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      warehouseList.push(...result);

      // Using Promise.all to fetch block, bay, and rack data concurrently
      let blockPromises = [];
      let bayPromises = [];
      let rackPromises = [];
      let rackAcknowledgPromises = [];

      for (let item of warehouseList) {
        blockPromises.push(...item.block_id.map(block => db.warehouseBifurcationRow.findOne({ where: { id: block } })));
        bayPromises.push(...item.bay_id.map(bay => db.warehouseBifurcationSelf.findOne({ where: { id: bay } })));
        rackPromises.push(...item.rack_id.map(rack => db.warehouseBifurcationSection.findOne({ where: { id: rack } })));
        rackAcknowledgPromises.push(...item.rack_id.map(rack => db.stockAcknowledgedRack.findOne({ where: { rack_id: rack } })));
      }

      const blockData = await Promise.all(blockPromises);
      const bayData = await Promise.all(bayPromises);
      const rackData = await Promise.all(rackPromises);
      const rackAcknowledgData = await Promise.all(rackAcknowledgPromises);

      if (warehouseList.length === 0) {
        return res.status(400).json({ success: false, message: "Item not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Warehouse list",
        data: {
          warehouseList,
          blockData,
          bayData,
          rackData,
          rackAcknowledgData
        },
      });
    } else {
      return res.status(400).json({ success: false, message: "No products provided" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }

};

module.exports.createDispatch = async (req, res) => {

  try {
    const { proposal_id, warehouse_id, productDetailList, vehicle_type, vehicle_number, rackArray } = req.body;
    const do_id = proposal_id.split("_")[1];
    const createDispatchPromises = [];
    let grandTotal = 0;
    let productData;
  for (const item of productDetailList) {
     productData = await db.product_master.findOne({
      where: {
        id: item.product_master_id
      },
      attributes: ['id', 'product_name', 'capacity']
    });

    if (productData) {
      const totalCapacity = item.qty * productData.capacity;
      grandTotal += totalCapacity;
    }
  }
    
    if (!warehouse_id || !vehicle_number || !vehicle_type) {
      const missingFields = [];
      if (!warehouse_id) missingFields.push('Warehouse');
      if (!vehicle_number) missingFields.push('Vehicle Number');
      if (!vehicle_type) missingFields.push('Vehicle Type');

      return res.status(400).json({
        success: false,
        message: `${missingFields.join(', ')} fields are required!`
      });
    }

    let flag = 0;
    for (let rack of rackArray) {
      let rackAcknowledgData = await db.stockAcknowledgedRack.findOne({ where: { rack_id: rack.rackId, quantity: { [Op.gt]: 0 } } })
      await rackAcknowledgData.decrement('quantity', { by: rack.quantity });

      let stockData = await db.stockLocation.findOne({ where: { id: rackAcknowledgData.stock_location_id } });
      await stockData.decrement('quantity', { by: rack.quantity });
      console.log(rackAcknowledgData);

      let dispatchedData = await db.dispatchOrder.create({
        rack_id: rack.rackId,
        quantity: rack.quantity,
        addDo_id: do_id,
        stock_location_id: stockData.id,
        vehicle_number: vehicle_number,
        vehicle_type: vehicle_type
      })
      if (dispatchedData) {

        let xRack = await db.stockAcknowledgedRack.findOne({ where: { stock_location_id: stockData.id, rack_id: rack.rackId } });
        if (xRack.quantity <= 0) {
          // await db.bayRack.update({space:"EMPTY"},{where:{id:rack.rackId}});
          // let bayId = await db.bayRack.findOne({where:{id:rack.rackId,space:"EMPTY"}});
          // await db.bayBlockBay.update({space:"EMPTY"},{where:{id:bayId.bay_id}});
          // let blockId = await db.bayBlockBay.findOne({where:{id:bayId.bay_id, space:"EMPTY"}});
          // await db.bayBlock.update({space:"EMPTY"},{where:{id:blockId.block_id}});
          // let warehouseDetails = await db.bayBlock.findOne({where:{id:blockId.block_id}});
          // let warehouseId = await db.bayManagement.findOne({where:{id:warehouseDetails.bay_id}});
          // await db.warehouse.update({space:"EMPTY"},{where:{id:warehouseId.warehouse_id}})



        }
        flag = 1;
      }
    }
    if (flag === 1) {
      // --------------------------------
      const blockQuantities = {};
      const bayQuantities = {};
      const rackQuantities = {};

      rackArray.forEach((rack) => {
        const { block_id, bay_id, rackId, quantity } = rack;
        const qty = parseInt(quantity, 10);
        blockQuantities[block_id] = (blockQuantities[block_id] || 0) + qty;
        bayQuantities[bay_id] = (bayQuantities[bay_id] || 0) + qty;
        rackQuantities[rackId] = (rackQuantities[rackId] || 0) + qty;
      });

      console.log("Block Quantities:", blockQuantities);
      console.log("Bay Quantities:", bayQuantities);
      console.log("Rack Quantities:", rackQuantities);
      // let productData = await db.product_master.findOne({
      //   where: {
      //     id: product_id
      //   },
      //   attribute: ['id', 'product_name', 'capacity']
      // });
    
      for (const block_id in blockQuantities) {
        if (blockQuantities.hasOwnProperty(block_id)) {
          const quantity = blockQuantities[block_id];
          const blockData = await db.warehouseBifurcationRow.findOne({ where: { id: block_id }, attributes: ['capacity', 'remaining_capacity'] });
          const productCapacity = blockData?.capacity || 0; // Use 0 as fallback if no capacity found
           let total_capacity = quantity * productData?.capacity;
          try {
            const new_remaining = blockData.remaining_capacity + total_capacity;
            await db.warehouseBifurcationRow.update(
              { remaining_capacity: new_remaining },
              { where: { id: block_id } }
            );
            console.log(`Block ID ${block_id} updated with capacity ${total_capacity} new: ${new_remaining}`);
          } catch (error) {
            console.error(`Failed to update Block ID ${block_id}:`, error.message);
          }
        }
      }

      for (const self_id in bayQuantities) {
        if (bayQuantities.hasOwnProperty(self_id)) {
          const quantity = bayQuantities[self_id];
          const bayData = await db.warehouseBifurcationSelf.findOne({ where: { id: self_id }, attributes: ['capacity', 'remaining_capacity'] });
           let total_capacity = quantity * productData?.capacity;
          try {
            const new_remaining = bayData.remaining_capacity + total_capacity;
            await db.warehouseBifurcationSelf.update(
              { remaining_capacity: new_remaining },
              { where: { id: self_id } }
            );
            console.log(`Self ID ${self_id} updated with capacity ${total_capacity} new ${new_remaining}`);

          } catch (error) {
            console.error(`Failed to update Self ID ${self_id}:`, error.message);
          }
        }
      }

      for (const section_id in rackQuantities) {
        if (rackQuantities.hasOwnProperty(section_id)) {
          const quantity = rackQuantities[section_id];
          const rackData = await db.warehouseBifurcationSection.findOne({ where: { id: section_id }, attributes: ['capacity', 'remaining_capacity'] });
           let total_capacity = quantity * productData?.capacity;
          try {
            const new_remaining = rackData.remaining_capacity + total_capacity;
            await db.warehouseBifurcationSection.update(
              { remaining_capacity: new_remaining },
              { where: { id: section_id } }
            );
            console.log(`section ID ${section_id} updated with capacity ${total_capacity} new ${new_remaining}`);

          } catch (error) {
            console.error(`Failed to update Self ID ${section_id}:`, error.message);
          }
        }
      }

      let totalQuantity = 0;
      rackArray.forEach(rack => {
        const quantity = parseFloat(rack?.quantity) || 0;
        totalQuantity += quantity;
      })
      let warehouseData = await db.warehouse.findOne({
        where: {
          id: warehouse_id
        },
        attribute: ['id', 'name', 'code', 'remaining_capacity']
      })
       let total_capacity = totalQuantity * productData?.capacity;
      let leftCapacity = warehouseData?.remaining_capacity + total_capacity;

      await db.warehouse.update({ remaining_capacity: leftCapacity }, { where: { id: warehouse_id } });

      // ----------------------------------
      await db.addDo.update({ dispatch_status: "APPROVED" }, { where: { id: do_id } });


      return res.status(200).json({ success: true, message: "Order has been dispatched" });
    }
    else {
      return res.status(400).json({ success: false, message: "Failed!" });
    }




  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }


};


//////////////////////////
///////// here code for show dispatched order details
///////////
module.exports.getDispachedOrderDetails = async (req, res) => {
  try {
    const orderNoId = req.params.order_no_id;
    await db.sequelize.query(`SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);

    //     let crmAddDO = await db.models.addDo.findOne({where:{id:orderNoId}},{attributes:["proposal_id"]});

    const [result] = await db.sequelize.query(`
           SELECT DISTINCT CA.id,CA.do_date, CA.order_number,CA.billing_address,CA.shipping_address,CA.upload_file,CA.notes,CA.terms_and_conditions,C.proposal_no, C.id,
      
           C.mail_id ,DO.vehicle_type,DO.vehicle_number, C.company_name,C.contact_person_name,C.contact_number,
          
           DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
           
           FROM CRM_CREATE_PROPOSAL_MST AS C
           
           INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
          
           INNER JOIN CRM_ADD_DO_MST AS CA ON C.id=CA.proposal_id
           LEFT JOIN DISPATCH_ORDER AS DO ON DO.addDo_id= CA.id
           WHERE CA.id=${orderNoId}`);

    const [allResult] = await db.sequelize.query(
      `
                  SELECT DISTINCT CA.id,CA.do_date, CA.order_number,CA.billing_address,CA.shipping_address, CA.upload_file, CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
                  
                  P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, PV.Variant AS variant_name,
                 
                  P.description AS product_description, P.product_list_price as price_per_unit,  T.uom_name, T.uom_id, CP.variant_id
                  
                  FROM CRM_PROPOSAL_LIST_MST AS CP
                  
                  INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
                  
                  INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
                 
                  INNER JOIN MASTER_PRODUCT_VARIANT AS PV ON CP.variant_id = PV.id
                 
                  INNER JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id 
                 
                  INNER JOIN CRM_ADD_DO_MST AS CA ON C.id=CA.proposal_id
                 
                  WHERE CA.id=${orderNoId} group by CA.id`
    );


    let wData = await db.dispatchOrder.findAll({
      where: { addDo_id: orderNoId },
      include: [{
        model: db.warehouseBifurcationSection,
        include: [{
          model: db.warehouseBifurcationSelf,
          include: [{
            model: db.warehouseBifurcationRow
          }]
        }]
      }]
    });

    let warehouse = await db.stockLocation.findOne({
      where: { id: wData[0].stock_location_id },
      include: [{
        model: db.warehouse,
      }]
    },

    )
    console.log(warehouse)
    const transformedResult = {
      ...result[0],
      productDetailList: allResult,
      warehouse,
      wData
    };
    if (transformedResult) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: transformedResult });
    } else {
      return res
        .status(404)
        .send({
          code: 404,
          message: " data not found ",
          data: transformedResult,
        });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};






///////////////////
/////// here to set trial balance parent chiled   hyrerchey
///////////
exports.getTrialBalance = async (req, res) => {
  try {
    const { company_id } = req.query;
    if (!company_id) {
      return res.status(404).json({
        success: false,
        message: "Undefined companyID",
      });
    }

    // Query to get total debit and credit amounts
    const totalDebitQuery = `
        SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
        FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
        INNER JOIN CHART_OF_ACCOUNTS AS CA ON JL.chart_account_id = CA.id
        WHERE CA.company_id =${company_id}
    `;

    // Query for account types with their total debit and credit
    const chartOfAccountQuery = `
        SELECT 
            CA.id AS id,
            CA.account_name AS name,
            'accountType' AS type,
            CA.parent_account,
            COALESCE(SUM(JL.debit_amount), 0) AS debit_amount,
            COALESCE(SUM(JL.credit_amount), 0) AS credit_amount
        FROM CHART_OF_ACCOUNTS AS CA 
        LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL ON JL.chart_account_id = CA.id
        WHERE CA.isDeleted = '0' AND CA.status = 'ACTIVE' AND CA.company_id =${company_id}
        GROUP BY CA.id
    `;

    const [
      totalResults,
      chartOfAccounts,
    ] = await Promise.all([
      db.sequelize.query(totalDebitQuery, {
        replacements: { companyId: company_id },
        type: db.sequelize.QueryTypes.SELECT,
      }),

      db.sequelize.query(chartOfAccountQuery, {
        replacements: { companyId: company_id },
        type: db.sequelize.QueryTypes.SELECT,
      }),
    ]);

    const totals = totalResults[0];

    // Function to recursively find children accounts and sum their values
    const findChildren = (account, allAccounts) => {
      const children = allAccounts.filter(
        (acc) => acc.parent_account === account.id
      );

      let debit = account.debit_amount || 0; // Start with the parent's debit
      let credit = account.credit_amount || 0; // Start with the parent's credit

      const childAccounts = children.map((child) => {
        const childData = findChildren(child, allAccounts); // Recursively find children

        // Add child's debit and credit to the parent's total
        debit += childData.debit;
        credit += childData.credit;

        return {
          ...child,
          children: childData.children,
          debit: childData.debit,
          credit: childData.credit,
        };
      });

      return {
        children: childAccounts,
        debit,
        credit,
      };
    };

    // Building the final response structure
    const response = {
      totals,
      accountTypes: chartOfAccounts.filter((account) => account.parent_account === null)
        .map((parentAccount) => {
          const accountData = findChildren(parentAccount, chartOfAccounts);
          return {
            ...parentAccount,
            children: accountData.children,
            debit: accountData.debit,
            credit: accountData.credit,
          };
        }),
    };

    console.log(JSON.stringify(response, null, 2));

    return res.json({
      code: 200,
      message: "Trial balance data retrieved successfully",
      data: response,
    });
  } catch (error) {
    return res.json({
      code: 500,
      message: error.message,
    });
  }


};


const calculateGrandTotalCapacity = async (productDetailList) => {
  let grandTotal = 0;

  for (const item of productDetailList) {
    const productData = await db.product_master.findOne({
      where: {
        id: item.product_master_id
      },
      attributes: ['id', 'product_name', 'capacity']
    });

    if (productData) {
      const totalCapacity = item.qty * productData.capacity;
      grandTotal += totalCapacity;
    }
  }

  return grandTotal;
};