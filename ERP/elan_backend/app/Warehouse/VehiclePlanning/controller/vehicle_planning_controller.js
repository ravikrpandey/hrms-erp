const { generateSOInvoice } = require("../../../CRM/utils/mail/mail");
const db = require("../../../models/index");
const { Op } = require("sequelize");

module.exports.getVehiclePlanningById = async (req, res) => {
  try {
    const vehicle_id = req.params.id;

    const [mainData] = await db.sequelize.query(`
      SELECT vp.*, TT2.typeName AS transported_by, VT.vehicle_type_name, TT.typeName AS transporter_type
      FROM WH_VH_PLANNING_MST AS vp
        INNER JOIN TM_VEHICLETYPE_MASTER AS VT ON vp.vehicle_type_id = VT.vehicle_type_id
        INNER JOIN TM_TRANSPORTTYPE_MASTER AS TT ON vp.transport_type_id = TT.id
        INNER JOIN TM_TRANSPORTERTYPE_MASTER AS TT2 ON vp.transported_by_id = TT2.id
      WHERE vp.id = :vehicle_id`, {
      replacements: { vehicle_id }
    });

    if (!mainData.length) {
      return res.status(200).send({ code: 404, message: "No data found", data: [] });
    }
   
    const transporter = await db.vehiclePlanningTransporter.findOne({
      where: { vehicle_planing_id: vehicle_id, isDeleted: false, admin_status: 'ACCEPTED' },
      include: [
        {
          model: db.transport_master,
          as: 'transporterDetails'
        }
      ]
    });

    const soList = await db.vehiclePlanningSo.findAll({
      where: {
        planning_id: vehicle_id
      }
    });

    const sale_orders = [];

    for (const so of soList) {

      const salesOrder = await db.salesOrder.findOne({
        where: {
          id: so.sale_order_id
        },
        raw: true
      });

      const saleOrderItems = await db.salesOrderItemNew.findAll({
        where: {
          sales_order_id: so.sale_order_id
        },
        raw: true
      });

      const wh = await db.warehouse.findOne({
        where: {
          id: so.warehouse_id
        },
        raw: true
      });

      sale_orders.push({
        ...salesOrder,
        pickup_info: {
          id: so.id,
          pickup_date: so.pickup_date,
          priority: so.priority,
          expected_delivery_date: so.expected_delivery_date,
          warehouse_name: wh.name,
          warehouse_address: wh.address+', '+wh.pin,
          gate_bypass_status: so.gate_by_pass
        },

        sale_order_items: saleOrderItems
      });
    }

    const planning = {
      ...mainData[0],
      sale_orders: [],
    };

    planning.sale_orders = sale_orders;
    planning.transportor_name = transporter.transporterDetails.tm_name;
    return res.status(200).send({
      code: 200,
      message: "Vehicle planning data fetched successfully",
      data: planning
    });

  } catch (error) {
    console.error("Error fetching vehicle planning data:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports.downloadSOInvoice = async (req, res) => {
  try {
    const { vehicle_id, so_id } = req.params;

    if (!vehicle_id || !so_id) {
      return res.status(400).send({
        code: 400,
        message: "Vehicle ID and Sales Order ID are required"
      });
    }
await db.sequelize.query(`SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`);
    const [rawData] = await db.sequelize.query(`
      SELECT 
        TM.tm_name,
        vp.*, 

        -- Pickup Info
        vpp.id AS pickup_id,
        vpp.pickup_date,
        vpp.priority,
        vpp.expected_delivery_date,
        vpp.isDeleted AS pickup_isDeleted,
       -- vpp.createdAt AS pickup_createdAt,
       -- vpp.updatedAt AS pickup_updatedAt,
        vpp.warehouse_id,
        wm.address AS pickup_address,
        wm.pin AS pickup_pincode,
       


        -- Sales Order
        so.id AS sale_order_id,
        so.sales_order_no,
        so.sales_order_date,
        so.notes,
        so.terms_and_conditions,
        so.remark,
        so.status AS sale_order_status,
        so.is_deleted AS sale_order_is_deleted,
        so.is_dispatched,
        so.createdAt AS sale_order_createdAt,
        so.updatedAt AS sale_order_updatedAt,
        so.proposal_id,
        so.financial_id,
        so.entity_id,
        so.customer_id,
        so.is_deviation,
        so.customisation_branding_date,
        so.is_proceed_to_dispatched,

        -- Items
        soi.id AS item_id,
        soi.quantity,
        soi.maximum_discount,
        soi.discount_request,
        soi.igst,
        soi.sgst,
        soi.cgst,
        soi.price_per_unit,
        soi.status AS item_status,
        soi.product_master_id,
        soi.sales_order_id,
        soi.product_category_id,
        soi.product_sub_category_id,
        soi.customisation,
        soi.customisation_data,
        soi.branding_data,
        soi.apply_scheme,
        soi.promo_item,
        soi.select_scheme,
        soi.scheme_id,
        soi.sales_booking_id,
        soi.pincode AS delivery_pincode,
        soi.address AS delivery_address,

        -- Item Details
        MI.item_name,
        MI.item_code,
        MI.description AS item_description,
        -- Category
        MA.asset_category_name,
        MA.asset_category_code,
        MA.asset_category_description,

        -- Sub-category
        MAC.sub_category_name, 
        MAC.sub_category_code

      FROM 
        WH_VH_PLANNING_MST AS vp
      LEFT JOIN 
        WH_VH_PLANNING_SO AS vpp ON vpp.planning_id = vp.id
      LEFT JOIN 
        SALES_ORDER_MST AS so ON so.id = vpp.sale_order_id
      LEFT JOIN 
        SALES_ORDER_ITEM_LIST_NEW AS soi ON soi.sales_order_id = so.id
        LEFT JOIN WAREHOUSE_MASTER AS wm ON wm.id = vpp.warehouse_id
          INNER JOIN WH_VH_PLANNING_TRANSPORTER AS VT ON vp.id = VT.vehicle_planing_id
        INNER JOIN TM_TRANSPORTER_MASTER AS TM ON VT.transportor_id = TM.id
      WHERE 
        vp.id = :vehicle_id
        AND so.id = :so_id
        GROUP BY soi.id
      ORDER BY 
        vp.id DESC
    `, {
      replacements: { vehicle_id, so_id }
    });

    if (!rawData.length) {
      return res.status(200).send({ code: 404, message: "No data found", data: [] });
    }

    const planning = {
      ...rawData[0],
      sale_orders: []
    };

    const saleOrderMap = new Map();

    rawData.forEach(row => {
      if (row.sale_order_id && !saleOrderMap.has(row.sale_order_id)) {
        saleOrderMap.set(row.sale_order_id, {
          id: row.sale_order_id,
          sales_order_no: row.sales_order_no,
          sales_order_date: row.sales_order_date,
          notes: row.notes,
          terms_and_conditions: row.terms_and_conditions,
          remark: row.remark,
          is_deleted: row.sale_order_is_deleted,
          is_dispatched: row.is_dispatched,
          status: row.sale_order_status,
          createdAt: row.sale_order_createdAt,
          updatedAt: row.sale_order_updatedAt,
          proposal_id: row.proposal_id,
          financial_id: row.financial_id,
          entity_id: row.entity_id,
          customer_id: row.customer_id,
          is_deviation: row.is_deviation,
          customisation_branding_date: row.customisation_branding_date,
          is_proceed_to_dispatched: row.is_proceed_to_dispatched,
          planning_code: row.planning_code,
          tm_name: row.tm_name,
          vehicle_root_status: row.vehicle_root_status,
          // Pickup Info
          pickup_info: {
            id: row.pickup_id,
            pickup_date: row.pickup_date,
            priority: row.priority,
            expected_delivery_date: row.expected_delivery_date,
            isDeleted: row.pickup_isDeleted,
            // createdAt: row.pickup_createdAt,
            // updatedAt: row.pickup_updatedAt,
            warehouse_id: row.warehouse_id,
            pickup_pincode: row.pickup_pincode,
            pickup_address: row.pickup_address,
          },

          sale_order_items: []
        });
      }

      const saleOrder = saleOrderMap.get(row.sale_order_id);
      if (row.item_id && saleOrder) {
        saleOrder.sale_order_items.push({
          id: row.item_id,
          quantity: row.quantity,
          maximum_discount: row.maximum_discount,
          discount_request: row.discount_request,
          igst: row.igst,
          sgst: row.sgst,
          cgst: row.cgst,
          price_per_unit: row.price_per_unit,
          status: row.item_status,
          product_master_id: row.product_master_id,
          product_category_id: row.product_category_id,
          product_sub_category_id: row.product_sub_category_id,
          sub_category_name: row.sub_category_name,
          item_name: row.item_name,
          item_code: row.item_code,
          item_description: row.item_description,
          asset_category_name: row.asset_category_name,
          asset_category_code: row.asset_category_code,
          asset_category_description: row.asset_category_description,
          sub_category_code: row.sub_category_code,
          customisation: row.customisation,
          customisation_data: row.customisation_data,
          branding_data: row.branding_data,
          apply_scheme: row.apply_scheme,
          promo_item: row.promo_item,
          select_scheme: row.select_scheme,
          scheme_id: row.scheme_id,
          sales_booking_id: row.sales_booking_id,
          delivery_pincode: row.delivery_pincode,
          delivery_address: row.delivery_address
        });
      }
    });

    planning.sale_orders = Array.from(saleOrderMap.values());

    const selectedOrder = planning.sale_orders[0]; // Only 1 because we filtered by so_id

    if (!selectedOrder) {
      return res.status(404).send({ code: 404, message: "Sales Order not found under the vehicle plan." });
    }

    const pdfData = await generateSOInvoice({
      ...planning,
      sale_orders: [selectedOrder]
    });


    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${pdfData.fileName}"`);
    res.send(pdfData.pdfBuffer);


  } catch (error) {
    console.error("downloadSOInvoice error:", error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getMapItemDetailsById = async (req, res) => {
  try {
    const vehicle_id = req.params.id;

    // Get SOs linked with vehicle planning
    const soList = await db.vehiclePlanningSo.findAll({
      where: { planning_id: vehicle_id },
      raw: true
    });

    const saleOrderIds = soList.map(x => x.sale_order_id);

    if (!saleOrderIds.length) {
      return res.status(200).send({
        code: 200,
        message: "No Sales Orders Found",
        data: []
      });
    }

    // Item Wise Qty
    const [itemList] = await db.sequelize.query(`
      SELECT
        SOI.sales_order_id,
        SOI.item_id,
        SOI.item_name,
        SOI.item_code,
        SUM(SOI.qty) AS quantity,
        SO.warehouse_id,
        I.manage_by,
        SO.sales_order_no
      FROM SALES_ORDER_ITEM_LIST_NEW SOI
      INNER JOIN SALES_ORDER_MST SO
        ON SO.id = SOI.sales_order_id
      INNER JOIN MASTER_ITEM I
        ON I.id = SOI.item_id
      WHERE SOI.sales_order_id IN (:saleOrderIds)
        AND SOI.item_id IS NOT NULL
      GROUP BY
        SOI.sales_order_id,
        SOI.item_id,
        SO.warehouse_id,
        I.manage_by
    `, {
      replacements: { saleOrderIds }
    });

    if (!itemList.length) {
      return res.status(200).send({
        code: 200,
        message: "No Items Found",
        data: []
      });
    }

    const warehouse_id = itemList[0].warehouse_id;

    const itemIds = [...new Set(itemList.map(x => x.item_id))];

    // Available Serials
    const [availableSerials] = await db.sequelize.query(`
      SELECT
        GIS.id,
        GIS.item_id,
        GIS.itemSerialNo,
        GIS.batchNo,
        W.warehouse_id,

        STSN.sales_order_id,
        STSN.vehicle_planning_id,

        CASE
          WHEN STSN.vehicle_planning_id = :vehicle_id
          THEN 1
          ELSE 0
        END AS isSelected

      FROM GRN_ITEM_STATUS GIS

      INNER JOIN GRN_ITEM GI
        ON GI.id = GIS.grn_item_id

      INNER JOIN WAREHOUSE_ALLOCATION AS W
        ON W.grn_item_status_id = GIS.id
        AND W.allocation_status = 'ALLOCATED'
        AND W.warehouse_id = :warehouse_id

      LEFT JOIN STOCK_TRANSFER_SERIAL_NEW STSN
        ON STSN.grn_item_status_id = GIS.id
        AND STSN.status != 'RETURNED'

      WHERE GIS.item_id IN (:itemIds)

      AND (
        STSN.id IS NULL
        OR STSN.vehicle_planning_id = :vehicle_id
      )

    `, {
      replacements: {
        itemIds,
        vehicle_id,
        warehouse_id
      }
    });

    const [selectedSerials] = await db.sequelize.query(`
      SELECT
        STSN.grn_item_status_id,
        GIS.item_id,
        STSN.sales_order_id,
        STSN.vehicle_planning_id

      FROM STOCK_TRANSFER_SERIAL_NEW STSN
      LEFT JOIN GRN_ITEM_STATUS GIS ON GIS.id = STSN.grn_item_status_id

      WHERE STSN.vehicle_planning_id = :vehicle_id
        AND STSN.sales_order_id IN (:saleOrderIds)
        AND GIS.item_id IN (:itemIds)
        AND STSN.status != 'RETURNED'
    `, {
      replacements: {
        vehicle_id,
        saleOrderIds,
        itemIds
      }
    });

    // Available Batches
    const [availableBatches] = await db.sequelize.query(`
      SELECT
        GIS.id,
        GI.item_id,
        '' AS itemSerialNo,
        GIS.batchNo,
        W.warehouse_id,

        (
          GI.receiveQty
          -
          IFNULL(
            (
              SELECT SUM(STL2.quantity)
              FROM STOCK_TRANSFER_LIST_NEW STL2

              INNER JOIN STOCK_TRANSFER_NEW STN2
                ON STN2.id = STL2.stock_transfer_id

              WHERE STL2.item_id = GI.item_id
                AND STL2.batch_no = GIS.batchNo

                AND (
                  STN2.vehicle_planning_id IS NULL
                  OR STN2.vehicle_planning_id != :vehicle_id
                )

                AND STN2.transfer_status NOT IN (
                  'Cancelled',
                  'Returned'
                )
            ),
            0
          )
        ) AS available_qty

      FROM GRN_ITEM GI

      INNER JOIN GRN_ITEM_STATUS GIS
        ON GIS.grn_item_id = GI.id

      INNER JOIN WAREHOUSE_ALLOCATION AS W
        ON W.grn_item_status_id = GIS.id
        AND W.allocation_status = 'ALLOCATED'
        AND W.warehouse_id = :warehouse_id

      WHERE GI.item_id IN (:itemIds)

      GROUP BY
        GIS.id,
        GI.item_id,
        W.warehouse_id,
        GI.receiveQty,
        GIS.batchNo

      HAVING available_qty > 0

    `, {
      replacements: {
        itemIds,
        warehouse_id,
        vehicle_id
      }
    });

    const [selectedBatches] = await db.sequelize.query(`
      SELECT
        STN.vehicle_planning_id,
        STL.sales_order_id,
        STL.item_id,
        STL.batch_no,
        SUM(STL.quantity) AS selected_qty

      FROM STOCK_TRANSFER_LIST_NEW STL

      INNER JOIN STOCK_TRANSFER_NEW STN
        ON STN.id = STL.stock_transfer_id

      WHERE STN.vehicle_planning_id = :vehicle_id
        AND STL.sales_order_id IN (:saleOrderIds)
        AND STL.item_id IN (:itemIds)

      GROUP BY
        STN.vehicle_planning_id,
        STL.sales_order_id,
        STL.item_id,
        STL.batch_no
    `, {
      replacements: {
        vehicle_id,
        saleOrderIds,
        itemIds
      }
    });


    const finalData = itemList.map(item => {
      let serialBatch = [];

      if (item.manage_by === 'S.No. Only') {
        serialBatch = availableSerials
          .filter(s =>
            s.item_id == item.item_id
          )
          .map(serial => {

            const selected = selectedSerials.find(
              s =>
                s.grn_item_status_id == serial.id
            );

            return {
              ...serial,

              // Selected by the current SO
              isSelected:
                selected &&
                Number(selected.sales_order_id) ===
                Number(item.sales_order_id)
                  ? 1
                  : 0,

              // Selected by another SO
              isDisabled:
                selected &&
                Number(selected.sales_order_id) !==
                Number(item.sales_order_id)
                  ? 1
                  : 0
            };
          });
      }

      if (item.manage_by === 'Batch Only') {
        serialBatch = availableBatches.filter(b => b.item_id == item.item_id).map(batch => {

          const selected = selectedBatches.find(
            s =>
              s.sales_order_id == item.sales_order_id &&
              s.item_id == item.item_id &&
              s.batch_no == batch.batchNo
          );

          return {
            ...batch,
            selected_qty: selected
              ? Number(selected.selected_qty)
              : 0
          };
        });
      }

      return {
        ...item,
        serialBatch
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Item Details fetched successfully",
      data: finalData
    });

  } catch (error) {
    console.error("Error fetching item details data:", error);

    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports.saveMappedItemsSerialNo = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const payload = req.body;

    if (!payload || !payload.length) {
      return res.status(400).send({code: 400,message: "No data received"});
    }

    const planning_id = payload[0].vehicle_planning_id;

    // delete existing data for serial no
    await db.stockTransferSerialnew.destroy({
      where: {vehicle_planning_id: planning_id},
      transaction
    });

    // delete existing data for batch no
    const existingTransfers = await db.stockTransfernew.findAll({
      attributes: ['id'],
      where: {
        vehicle_planning_id: planning_id
      },
      transaction
    });

    const transferIds = existingTransfers.map(x => x.id);

    if (transferIds.length) {
      await db.stockTransferListnew.destroy({
        where: {
          stock_transfer_id: transferIds
        },
        transaction
      });

      await db.stockTransfernew.destroy({
        where: {
          vehicle_planning_id: planning_id
        },
        transaction
      });
    }

    const hasAnyBatchMapping = payload.some(
      row => Array.isArray(row.batchArray) && row.batchArray.length > 0
    );

    let stockTransferId = null;

    if (hasAnyBatchMapping) {

      const getWH = await db.vehiclePlanningSo.findOne({
        attributes: ['warehouse_id'],
        where: {
          planning_id: planning_id
        },
        transaction
      });

      const source_warehouse_id = getWH?.warehouse_id;

      const stockTransfer = await db.stockTransfernew.create(
        {
          random_id: Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase(),

          stock_entry_type: "Dispatch",
          source_warehouse_id: source_warehouse_id,
          transfer_status: "Dispatched",
          vehicle_planning_id: planning_id
        },
        { transaction }
      );

      stockTransferId = stockTransfer.id;
    }

    const insertData = [];
    // item wise group
    const groupedItems = {};
    for (const row of payload) {
      const key = `${row.sales_order_id}_${row.item_id}`;
      if (!groupedItems[key]) {
        groupedItems[key] = [];
      }
      groupedItems[key].push(row);
    }

    // process each item
    for (const key of Object.keys(groupedItems)) {
      const itemRows = groupedItems[key];
      const sales_order_id = itemRows[0].sales_order_id;
      const item_id = itemRows[0].item_id;

      // Check if batch mapping is present
      const hasBatchMapping = itemRows.some(
        row => Array.isArray(row.batchArray) && row.batchArray.length > 0
      );

      if (hasBatchMapping) {
      // Prepare Child Records
      const batchInsertData = [];
      for (const row of itemRows) {

        if (!Array.isArray(row.batchArray) || !row.batchArray.length) {
          continue;
        }

        for (const batch of row.batchArray) {
          batchInsertData.push({
            stock_transfer_id: stockTransferId,
            sales_order_id: row.sales_order_id,
            grn_item_status_id: batch.id,
            item_id: row.item_id,
            batch_no: batch.batchNo,
            quantity: Number(batch.qty)
          });
        }
      }

      // Insert all child records at once
      if (batchInsertData.length) {
        await db.stockTransferListnew.bulkCreate(
          batchInsertData,
          { transaction }
        );
      }
      continue;
    }

      const serialRows = itemRows;
      const soItems = await db.sequelize.query(`SELECT id,qty FROM SALES_ORDER_ITEM_LIST_NEW 
        WHERE sales_order_id = :sales_order_id AND item_id = :item_id ORDER BY id ASC`,
        {
          replacements: {sales_order_id,item_id},
          type: db.Sequelize.QueryTypes.SELECT,
          transaction
        }
      );

      let serialIndex = 0;
      for (const soItem of soItems) {
        for (let i = 0; i < Number(soItem.qty); i++) {
          const serial = serialRows[serialIndex];
          if (!serial) {
            break;
          }

          insertData.push({
            vehicle_planning_id: serial.vehicle_planning_id,
            sales_order_item_id: soItem.id,
            sales_order_id: serial.sales_order_id,
            item_id: serial.item_id,
            grn_item_status_id: serial.serial_id,
            serial_no: serial.serial_no,
            batch_no: serial.batch_no
          });
          serialIndex++;
        }
      }
    }

    if (insertData.length) {
      await db.stockTransferSerialnew.bulkCreate(insertData,{ transaction });
    }
    await transaction.commit();

    return res.status(200).send({code: 200,message: "Mapping saved successfully"});
  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({code: 500,message: "Internal Server Error",error: error.message});
  }
};

module.exports.getMapSerialNoBySOId = async (req, res) => {
  try {
    const param = req.params;
    const so_id = param.id;
    const planningId = param.planningId;

    const [serial_no] = await db.sequelize.query(`
        SELECT
            SOI.item_id,
            SOI.item_name,
            COALESCE(SOI.item_code, '-') AS item_code,

            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'serial_no', GI.itemSerialNo,
                    'batch_no', GI.batchNo
                )
            ) AS serial_batch_data

        FROM STOCK_TRANSFER_SERIAL_NEW AS SN
        INNER JOIN GRN_ITEM_STATUS AS GI
            ON GI.id = SN.grn_item_status_id
        INNER JOIN SALES_ORDER_ITEM_LIST_NEW AS SOI
            ON SOI.id = SN.sales_order_item_id
        WHERE SN.sales_order_id = :so_id AND SN.vehicle_planning_id = :planningId
          AND SN.status = 'RESERVED'
        GROUP BY SOI.item_id `, {
      replacements: { so_id, planningId }
    });

    const [batch_no] = await db.sequelize.query(`
      SELECT
          SOI.item_id,
          SOI.item_name,
          COALESCE(SOI.item_code, '-') AS item_code,

          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'serial_no', CONCAT(B.quantity, ' QTY'),
                  'batch_no', B.batchNo
              )
          ) AS serial_batch_data

      FROM (
          SELECT
              SN.item_id,
              GI.batchNo,
              MAX(SN.quantity) AS quantity
          FROM STOCK_TRANSFER_NEW AS TN
        INNER JOIN STOCK_TRANSFER_LIST_NEW AS SN ON SN.stock_transfer_id = TN.id
          INNER JOIN GRN_ITEM_STATUS AS GI
              ON GI.id = SN.grn_item_status_id
          WHERE SN.sales_order_id = :so_id AND TN.vehicle_planning_id = :planningId
          GROUP BY
              SN.item_id,
              GI.batchNo
      ) AS B

      INNER JOIN (
          SELECT
              item_id,
              MAX(item_name) AS item_name,
              MAX(item_code) AS item_code
          FROM SALES_ORDER_ITEM_LIST_NEW
          WHERE sales_order_id = :so_id
          GROUP BY item_id
      ) AS SOI
          ON SOI.item_id = B.item_id

      GROUP BY
      SOI.item_id `, {
      replacements: { so_id, planningId }
    });

    const finalData = [...serial_no, ...batch_no];

    if (!finalData.length) {
      return res.status(200).send({ code: 404, message: "No data found", data: [] });
    }
   
    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: finalData
    });

  } catch (error) {
    console.error("Error fetching vehicle planning data:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};