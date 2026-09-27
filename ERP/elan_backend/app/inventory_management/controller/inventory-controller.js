const db = require("../../../app/models/index");
const { Op } = require("sequelize");
const { manageInventoryLedger } = require("../../../src/common/common.controller");

exports.getDashboardData = async (req, res) => {
  try {
    const { entity_id, warehouse_id } = req.query;
    const { organization_id, role_name, role_code, employee_id } = req.user; // role_name/role_code=Super Admin, 3PL_Org_Admin

    if (!entity_id) {
      return res.status(400).send({ code: 400, message: "entity_id is required" });
    }

    // 🔹 Base query
    let query = `
      SELECT W.id,CONCAT(W.name, ' (', W.code, ')') AS name
      FROM WAREHOUSE_MASTER AS W
      WHERE W.entity_id=:entity_id AND W.isDeleted=0`;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND W.organization_id = :organization_id`;
    } else {
      query += ` AND W.organization_id IS NULL`;
    }

    query += ` ORDER BY W.name ASC`;

    const [warehouseList] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(organization_id && { organization_id })
      }
    });

    let selectedWarehouseId = warehouse_id;

    if (selectedWarehouseId === 'null' && warehouseList.length > 0) {
      selectedWarehouseId = warehouseList[0].id;
    }

    // =============================
    // 🔹 INVENTORY STOCK DATA
    // =============================

    let dataList = {};
    let sellingList = [];
    let lowList = [];

    if (selectedWarehouseId) {

      const stockQuery = `SELECT
          COUNT(DISTINCT item_id) AS totalItems,
          COALESCE(SUM(available_qty),0) AS availableQty,
          COALESCE(SUM(hold_qty),0) AS holdQty,
          COALESCE(SUM(delivered_qty),0) AS deliveredQty,
          COALESCE(SUM(scrap_qty),0) AS scrapQty,
          COALESCE(SUM(available_qty + hold_qty + scrap_qty),0) AS totalStock
          FROM INVENTORY_STOCK
          WHERE entity_id=:entity_id AND warehouse_id = :warehouse_id;`;
      const [stockData] = await db.sequelize.query(stockQuery, {
        replacements: { entity_id, warehouse_id: selectedWarehouseId }
      });

      dataList = stockData[0] || {};

      const sellingQuery = `SELECT DISTINCT
            L.item_id,
            MI.item_name,
            MI.item_code,
            COALESCE(
                SUM(L.quantity) OVER (PARTITION BY L.item_id),
                0
            ) AS qty
        FROM INVENTORY_LEDGER AS L
        INNER JOIN MASTER_ITEM AS MI 
            ON MI.id = L.item_id

        WHERE 
            L.entity_id = :entity_id
            AND L.warehouse_id = :warehouse_id
            AND L.type = 'OUT'

        ORDER BY qty DESC
        LIMIT 5;
        `;
      const [sellingData] = await db.sequelize.query(sellingQuery, {
        replacements: { entity_id, warehouse_id: selectedWarehouseId }
      });

      sellingList = sellingData;

      const LOW_STOCK_LIMIT = 20;
      const lowStockQuery = `
          SELECT
              S.item_id,
              MI.item_name,
              MI.item_code,
              COALESCE(S.available_qty,0) AS availableQty,
              :low_stock_limit as min
          FROM INVENTORY_STOCK AS S
          INNER JOIN MASTER_ITEM AS MI 
              ON MI.id = S.item_id
          WHERE
              S.entity_id = :entity_id
              AND S.warehouse_id = :warehouse_id
              AND COALESCE(S.available_qty,0) < :low_stock_limit
          ORDER BY S.available_qty ASC
          LIMIT 5;
          `;

      const [lowStockData] = await db.sequelize.query(lowStockQuery, {
        replacements: {
          entity_id,
          warehouse_id: selectedWarehouseId,
          low_stock_limit: LOW_STOCK_LIMIT
        }
      });

      lowList = lowStockData;

    }

    const responseData = { WarehouseList: warehouseList, stockData: dataList, sellingData: sellingList, lowStockData: lowList, selectedWarehouseId };
    return res.status(200).send({ code: 200, message: "Record fetched successfully", data: responseData });
  }
  catch (error) {
    return res.status(500).send({ message: "Internal server error", error: error.message });
  }
}

exports.getInvStockData = async (req, res) => {
  try {
    const { entity_id, warehouse_id } = req.query;
    const { organization_id, role_name, role_code, employee_id } = req.user; // role_name/role_code=Super Admin, 3PL_Org_Admin

    if (!entity_id) {
      return res.status(400).send({ code: 400, message: "entity_id is required" });
    }

    // 🔹 Base query
    let query = `
      SELECT W.id,CONCAT(W.name, ' (', W.code, ')') AS name
      FROM WAREHOUSE_MASTER AS W
      WHERE W.entity_id=:entity_id AND W.isDeleted=0`;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND W.organization_id = :organization_id`;
    } else {
      query += ` AND W.organization_id IS NULL`;
    }

    query += ` ORDER BY W.name ASC`;

    const [warehouseList] = await db.sequelize.query(query, { replacements: { entity_id } });

    let selectedWarehouseId = warehouse_id;

    if (selectedWarehouseId === 'null' && warehouseList.length > 0) {
      selectedWarehouseId = warehouseList[0].id;
    }

    // =============================
    // 🔹 INVENTORY STOCK DATA
    // =============================

    let StockList = [];

    if (selectedWarehouseId) {

      const stockQuery = `SELECT I.*,MI.item_name,MI.item_code,MI.manage_by FROM INVENTORY_STOCK AS I
        INNER JOIN MASTER_ITEM AS MI ON MI.id = I.item_id
        WHERE I.warehouse_id = :warehouse_id ORDER BY MI.item_name ASC`;
      const [stockData] = await db.sequelize.query(stockQuery, {
        replacements: { warehouse_id: selectedWarehouseId }
      });

      StockList = stockData;
    }

    const responseData = { WarehouseList: warehouseList, StockList: StockList, selectedWarehouseId };
    return res.status(200).send({ code: 200, message: "Record fetched successfully", data: responseData });
  }
  catch (error) {
    return res.status(500).send({ message: "Internal server error", error: error.message });
  }
}

exports.getInvLedgerData = async (req, res) => {
  try {
    const { entity_id, warehouse_id, item_id } = req.query;

    if (!entity_id || !warehouse_id || !item_id) {
      return res.status(400).send({ code: 400, message: "entity_id, warehouse_id, item_id is required" });
    }

    // Ledger sign logic
    const LEDGER_SIGN_CASE = `
    CASE
        WHEN L.type IN (
            'IN',
            'TRANSFER_IN',
            'RETURN_IN',
            'ADJUSTMENT_IN',
            'RELEASE'
        ) THEN '+'

        WHEN L.type IN (
            'OUT',
            'HOLD',
            'SCRAP',
            'TRANSFER_OUT',
            'RETURN_OUT',
            'ADJUSTMENT_OUT'
        ) THEN '-'

        ELSE ''
    END
    `;

    const ledgerQuery = `SELECT L.*,CONCAT(W.name, ' (', W.code, ')') AS warehouse_name,${LEDGER_SIGN_CASE} AS sign,
    CONCAT(MI.item_name, ' (', MI.item_code, ')') AS item_name,S.available_qty,S.hold_qty,S.delivered_qty,S.scrap_qty,
    '' AS invoiceno, '' AS grnsono
    FROM INVENTORY_LEDGER AS L
    INNER JOIN INVENTORY_STOCK AS S ON S.entity_id = :entity_id AND S.warehouse_id = :warehouse_id AND S.item_id = :item_id
    INNER JOIN MASTER_ITEM AS MI ON MI.id = L.item_id
    INNER JOIN WAREHOUSE_MASTER AS W ON W.id = L.warehouse_id
    WHERE L.entity_id = :entity_id AND L.warehouse_id = :warehouse_id AND L.item_id = :item_id ORDER BY L.id DESC`;

    const [ledgerData] = await db.sequelize.query(ledgerQuery, {
      replacements: { entity_id: entity_id, warehouse_id: warehouse_id, item_id: item_id }
    });

    return res.status(200).send({ code: 200, message: "Record fetched successfully", data: ledgerData });
  }
  catch (error) {
    return res.status(500).send({ message: "Internal server error", error: error.message });
  }
}

exports.getStockInTransit = async (req, res) => {
  try {
    const { entity_id, warehouse_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id is required"
      });
    }

    // Base Query
    let query = `
            SELECT
                PO.po_number, PO.po_date, PO.createdAt, SAS.shiped_no, SAS.audit, SAS.mode, SAS.shipment_date, SAS.expected_arrival,
                WM.name AS warehouse_name, WM.address AS warehouse_address, WM.pin AS warehouse_pin
            FROM SHIPPING_ALERT_SCHEDULE SAS
            INNER JOIN PROCUREMENT_PURCHASE_ORDER PO ON PO.id = SAS.po_id
            INNER JOIN WAREHOUSE_MASTER WM ON WM.id = PO.warehouse_id
            WHERE SAS.status = 'ACTIVE' AND SAS.audit != 'RECEIVED' AND SAS.buyer_status = 'APPROVED'
            AND PO.entity_id = :entity_id
        `;

    const replacements = { entity_id };

    if (warehouse_id && warehouse_id !== 'null' && warehouse_id !== 'undefined') {
      query += ` AND PO.warehouse_id = :warehouse_id`;
      replacements.warehouse_id = warehouse_id;
    }

    query += ` ORDER BY SAS.id DESC`;

    const stockInTransitData = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT
    });

    return res.status(200).send({
      code: 200,
      message: "Stock in transit data fetched successfully",
      data: stockInTransitData
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getItemList = async (req, res) => {
  try {
    const itemData = await db.ItemMaster.findAll({
      where: {
        status: 'ACTIVE',
        isDeleted: false,
        // entity_id: req.query.entity_id,
        item_type_id: {
          [Op.in]: [1, 7, 8],
        },
      },
      attributes: ["id", "item_code", "item_name", "manage_by", "asset_id"],
      include: [
        {
          model: db.tbl_itemType,
          attributes: ["itemType"],
        },
      ],
      order: [["item_name", "ASC"]],
    });

    if (itemData) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: itemData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.insertDirectInventory = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { entity_id, financial_id, inventory_date, warehouse_id, items, totalAmount } = req.body;

    if (!entity_id || !financial_id || !inventory_date || !warehouse_id || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).send({code: 400, message: "All required fields are mandatory"});
    }

    // PROCESS ITEMS BEFORE INSERT
    const processedItems = [];
    const duplicateSerials = [];

    // Get last batch only ONCE
    const lastBatch = await db.grnItemStatus.findOne({
      where: {
        batchNo: {
          [Op.like]: "BN%"
        }
      },
      order: [["id", "DESC"]],
      attributes: ["batchNo"],
      transaction
    });

    let nextBatchNumber = 1;

    if (lastBatch?.batchNo) {
      const lastNumber = parseInt(
        lastBatch.batchNo.replace("BN", ""),
        10
      );

      if (!isNaN(lastNumber)) {
        nextBatchNumber = lastNumber + 1;
      }
    }

    for (const item of items) {

      if (!item.itemId || !item.quantity || Number(item.quantity) <= 0 || !item.manageBy) {
        await transaction.rollback();

        return res.status(400).send({
          code: 400,
          message: "Item ID, quantity and manageBy are required"
        });
      }

      const originalQuantity = Number(item.quantity);

      let finalQuantity = originalQuantity;
      let newSerials = [];
      let batchNo = null;

      // SERIAL NUMBER ONLY
      if (item.manageBy === "S.No. Only") {

        const serialNumbers = Array.isArray(item.serialNumbers)
          ? item.serialNumbers
              .map(serial => String(serial).trim())
              .filter(Boolean)
          : [];

        // SERIAL COUNT CANNOT BE GREATER THAN QUANTITY
        if (serialNumbers.length > originalQuantity) {

          await transaction.rollback();

          return res.status(400).send({
            code: 400,
            message:
              `Serial numbers cannot be greater than quantity for item ${item.itemId}`
          });
        }

        // SAME REQUEST DUPLICATE SERIAL CHECK
        const uniqueSerials = [...new Set(serialNumbers)];

        // DB EXISTING SERIAL CHECK
        let existingSerials = [];

        if (uniqueSerials.length > 0) {

          const existingRows =
            await db.grnItemStatus.findAll({
              where: {
                // item_id: item.itemId,
                itemSerialNo: uniqueSerials
              },
              attributes: ["itemSerialNo"],
              transaction
            });

          existingSerials = existingRows
            .map(row => String(row.itemSerialNo));
        }

        const existingSerialSet = new Set(existingSerials);

        const duplicates = uniqueSerials.filter(serial =>
          existingSerialSet.has(serial)
        );

        duplicates.forEach(serial => {
          duplicateSerials.push({
            itemId: item.itemId,
            serialNo: serial
          });
        });

        newSerials = uniqueSerials.filter(
          serial => !existingSerialSet.has(serial)
        );

        finalQuantity = newSerials.length;

        // NO NEW SERIAL
        if (finalQuantity === 0) {
          continue;
        }

        batchNo = `BN${String(nextBatchNumber).padStart(4, "0")}`;
        nextBatchNumber++;
      }

      // BATCH ONLY
      else if (item.manageBy === "Batch Only") {
        finalQuantity = originalQuantity;
        batchNo = `BN${String(nextBatchNumber).padStart(4, "0")}`;
        nextBatchNumber++;
        newSerials = [];
      }

      // INVALID manageBy
      else {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message:
            `Invalid manageBy '${item.manageBy}' for item ${item.itemId}`
        });
      }

      // SAVE PROCESSED ITEM
      processedItems.push({
        itemId: item.itemId,
        item_category_id: item.item_category_id,
        quantity: finalQuantity,
        manageBy: item.manageBy,
        expiryDate: item.expiryDate || null,
        totalAmount: item.totalAmount,
        newSerials,
        batchNo,
        zone_id: item.zone_id,
        zone_type_id: item.zone_type_id,
        bin_id: item.bin_id,
        rack_id: item.rack_id,
        bay_id: item.bay_id
      });
    }

    // NO ITEM AVAILABLE TO INSERT
    if (processedItems.length === 0) {

      await transaction.rollback();

      return res.status(400).send({
        code: 400,
        message: "No new inventory found to insert",
        duplicateSerials
      });
    }

    // CREATE GRN MASTER
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const grnNumber = `DIRINV-${timestamp}`;

    const grnMain = await db.grnMaster.create(
      {
        grn_number: grnNumber,
        grnStatus: "COMPLETED",
        po_category_type: "Item_PO",
        grn_date: inventory_date,
        employee_id: req.user?.employee_id,
        source_type: "DIRECT_INVENTORY",
        warehouse_id: warehouse_id,
        financial_year_id: financial_id,
        entity_id: entity_id,
        total_amount: totalAmount,
        grand_total: totalAmount
      },
      { transaction }
    );

    const grnMainId = grnMain.id;

    // ITEM WISE INSERT
    for (const item of processedItems) {

      const finalQty = item.quantity;

      // GRN ITEM
      const grnItem = await db.grnItem.create(
        {
          receiveQty: finalQty,
          po_qty: finalQty,
          selection_item: finalQty,
          grn_Id: grnMainId,
          item_id: item.itemId,
          asset_id: item.item_category_id,
          amount: item.totalAmount,
          total_mvp: item.totalAmount
        },
        { transaction }
      );

      const grnItemId = grnItem.id;
      const allocationIds = [];

      if (item.manageBy === "S.No. Only") {

        // EVERY NEW SERIAL = ONE STATUS ROW
        for (const serialNo of item.newSerials) {

          const grnItemStatus =
            await db.grnItemStatus.create(
              {
                batchType: "S.No. Only",
                batchNo: item.batchNo,
                expiryDate: item.expiryDate,
                itemSerialNo: serialNo,
                allocation_status: "SELECTED",
                grn_item_id: grnItemId,
                item_id: item.itemId
              },
              { transaction }
            );

          // ONE SERIAL = ONE ALLOCATION = QTY 1
          const allocation = await db.warehouseAllocation.create(
            {
              receiveQty: 1,
              allocation_status: "ALLOCATED",
              grn_item_status_id: grnItemStatus.id,
              item_id: item.itemId,
              warehouse_id: warehouse_id,
              zone_id: item.zone_id,
              zone_type_id: item.zone_type_id,
              bin_id: item.bin_id,
              rack_id: item.rack_id,
              bay_id: item.bay_id
            },
            { transaction }
          );
          allocationIds.push(allocation.id);
        }
      }
      else if (item.manageBy === "Batch Only") {
        // ONE BATCH = ONE STATUS ROW
        const grnItemStatus =
          await db.grnItemStatus.create(
            {
              batchType: "Batch Only",
              batchNo: item.batchNo,
              expiryDate: item.expiryDate,
              itemSerialNo: null,
              allocation_status: "SELECTED",
              grn_item_id: grnItemId,
              item_id: item.itemId
            },
            { transaction }
          );

        // ONE BATCH = ONE ALLOCATION - FULL QUANTITY
        const allocation = await db.warehouseAllocation.create(
          {
            receiveQty: finalQty,
            allocation_status: "ALLOCATED",
            grn_item_status_id: grnItemStatus.id,
            item_id: item.itemId,
            warehouse_id: warehouse_id,
            zone_id: item.zone_id,
            zone_type_id: item.zone_type_id,
            bin_id: item.bin_id,
            rack_id: item.rack_id,
            bay_id: item.bay_id
          },
          { transaction }
        );
        allocationIds.push(allocation.id);
      }

      // insert inventory
      for (const allocationId of allocationIds) {
        await manageInventoryLedger(
          {
            id: allocationId,
            sales_order_no: grnNumber,
            warehouse_id: warehouse_id,
            financial_id: financial_id,
            entity_id: entity_id,
            loginEmployee: req.user.employee_id,
          },
          "GRN",
          transaction,
        );
      }
    }

    await transaction.commit();

    return res.status(200).send({code: 200,message: "Inventory saved. Duplicate serial numbers skipped.",
      insertedItems: processedItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity
      })),
      duplicateSerials
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({code: 500, message: "Internal Server Error", error: error.message});
  }
};