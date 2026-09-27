const db = require("../../models");
const {
  manageInventoryLedger,
} = require("../../../src/common/common.controller");

exports.getAllReceivedStockTransfer = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `SELECT RST.id,RST.random_id,RST.stock_entry_type,RST.default_status,RST.date,WM.name AS warehouse_source_name, WMT.name AS target_ware_house 
        FROM RECEIVE_STOCK_TRANSFER AS RST 
        LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = RST.source_warehouse_id 
        LEFT JOIN WAREHOUSE_MASTER AS WMT ON WMT.id = RST.target_warehouse_id 
        WHERE RST.entity_id = ${entity_id} AND RST.isDeleted = false`;
    const result = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    res
      .status(200)
      .json({ code: 200, message: "Available list", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: error?.message || "Internal server error" });
  }
};

exports.generateRandomReceivedStockId = async (req, res) => {
  try {
    const lastEntry = await db.receiveStockTransfer.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["random_id"],
    });

    let number;
    if (lastEntry) {
      const lastCode = parseInt(lastEntry.random_id.split("WSE")[0]);
      const newCode = lastCode + 1;
      number = newCode.toString().padStart(2, "0") + "WSE";
    } else {
      number = `01WSE`;
    }
    return res
      .status(200)
      .send({ code: 200, message: "Random Code Generated", data: number });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

async function checkAndUpdateCapacity(
  db,
  entityType,
  sourceId,
  targetId,
  total,
  transaction,
) {
  const currentCapacity = await db[entityType].sum("remaining_capacity", {
    where: { id: sourceId, isDeleted: false },
    transaction,
  });
  const targetCapacity = await db[entityType].sum("remaining_capacity", {
    where: { id: targetId, isDeleted: false },
    transaction,
  });
  const sourceCapacity = currentCapacity + total;
  const targetCapacityTotal = targetCapacity - total;

  const sourceCheck = await db[entityType].findOne({
    where: { id: sourceId, isDeleted: false },
    transaction,
  });
  if (!sourceCheck || sourceCheck.capacity < sourceCapacity) {
    const error = new Error(`Source ${entityType} has insufficient capacity.`);
    error.statusCode = 404;
    throw error;
  }

  const targetCheck = await db[entityType].findOne({
    where: { id: targetId, isDeleted: false },
    transaction,
  });

  if (!targetCheck || targetCheck.capacity < targetCapacityTotal) {
    const error = new Error(`Target ${entityType} has insufficient capacity.`);
    error.statusCode = 404;
    throw error;
  }

  await db[entityType].update(
    { remaining_capacity: Math.abs(sourceCapacity) },
    { where: { id: sourceId }, transaction },
  );
  await db[entityType].update(
    { remaining_capacity: Math.abs(targetCapacityTotal) },
    { where: { id: targetId }, transaction },
  );
}

exports.createReceivedStockTransfer = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { entity_id } = req.params;
    const {
      item_details,
      source_warehouse_id,
      target_warehouse_id,
      id,
    } = req.body;

    const parseLayoutId = (val) => {
      if (val === "" || val === "null" || val === null || val === undefined) return null;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0) return null;
      return parsed;
    };

    const source_row_id = parseLayoutId(req.body.source_row_id);
    const target_row_id = parseLayoutId(req.body.target_row_id);
    const source_shelf_id = parseLayoutId(req.body.source_shelf_id);
    const target_shelf_id = parseLayoutId(req.body.target_shelf_id);
    const source_section_id = parseLayoutId(req.body.source_section_id);
    const target_section_id = parseLayoutId(req.body.target_section_id);

    // Also update req.body values to match since they are used in db.receiveStockTransfer.create
    req.body.source_row_id = source_row_id;
    req.body.target_row_id = target_row_id;
    req.body.source_shelf_id = source_shelf_id;
    req.body.target_shelf_id = target_shelf_id;
    req.body.source_section_id = source_section_id;
    req.body.target_section_id = target_section_id;

    if (!entity_id) {
      await transaction.rollback();
      return res
        .status(400)
        .send({ code: 400, message: "entity_id is required" });
    }

    if (!Array.isArray(item_details) || item_details.length === 0) {
      await transaction.rollback();
      return res
        .status(400)
        .send({ code: 400, message: "Invalid item_details array" });
    }

    const finalCapacity = await Promise.all(
      item_details.map(async (item) => {
        const { accepted_qty, item_id } = item;
        const itemExist = await db.ItemMaster.findOne({
          where: { id: item_id },
        });
        return itemExist ? itemExist.capacity * parseInt(accepted_qty, 10) : 0;
      }),
    );

    const total = finalCapacity.reduce((sum, capacity) => sum + capacity, 0);

    const entities = [
      {
        entity: "warehouse",
        sourceId: source_warehouse_id,
        targetId: target_warehouse_id,
      },
      {
        entity: "warehouseBifurcationRow",
        sourceId: source_row_id,
        targetId: target_row_id,
      },
      {
        entity: "warehouseBifurcationSelf",
        sourceId: source_shelf_id,
        targetId: target_shelf_id,
      },
      {
        entity: "warehouseBifurcationSection",
        sourceId: source_section_id,
        targetId: target_section_id,
      },
    ];

    for (const { entity, sourceId, targetId } of entities) {
      if (sourceId) {
        await checkAndUpdateCapacity(
          db,
          entity,
          sourceId,
          targetId,
          total,
          transaction,
        );
      }
    }
    const createStockTransfer = await db.receiveStockTransfer.create(
      {
        stock_transfer_id: id,
        // ...req.body,
        random_id: req.body.random_id,
        stock_entry_type: req.body.stock_entry_type,
        date: req.body.date,
        reason: req.body.reason,
        received_by: req.body.recieve_by,
        date_received: req.body.date_recieved,
        acknowledged: req.body.acknowledge,
        remarks: req.body.remarks,
        source_section_id: req.body.source_section_id,
        target_section_id: req.body.target_section_id,
        source_shelf_id: req.body.source_shelf_id,
        target_shelf_id: req.body.target_shelf_id,
        source_warehouse_id: req.body.source_warehouse_id,
        target_warehouse_id: req.body.target_warehouse_id,
        source_row_id: req.body.source_row_id,
        target_row_id: req.body.target_row_id,
        entity_id: parseInt(entity_id),
      },
      {
        transaction,
        logging: console.log, // Log the SQL query
      },
    );

    await db.stockTransfernew.update(
      {
        default_status: "Completed",
        transfer_status: "Received",
      },
      { where: { id }, transaction },
    );

    // Loop through each item to create receipt list records and update layout allocations
    for (const item of item_details) {
      const { quantity, damaged_qty, accepted_qty, item_id, batch_no } = item;

      const receiptListItem = await db.receiveStockTransferList.create(
        {
          quantity,
          quantities_damaged: damaged_qty,
          accepted_quantities: accepted_qty,
          recerivedstock_transfer_id: createStockTransfer.id,
          item_id,
        },
        { transaction },
      );

      // Fetch the original transfer list item to identify serials
      const transferListItem = await db.stockTransferListnew.findOne({
        where: { stock_transfer_id: id, item_id },
        transaction,
      });

      if (transferListItem) {
        // Find reserved serials for this item
        const serials = await db.stockTransferSerialnew.findAll({
          where: {
            stock_transfer_list_id: transferListItem.id,
            status: "TRANSIT",
          },
          transaction,
        });

        if (serials && serials.length > 0) {
          // Update location and status for each serial number
          for (let sIdx = 0; sIdx < serials.length; sIdx++) {
            const serialRecord = serials[sIdx];
            const isDamaged = sIdx >= accepted_qty; // damaged serials placed after accepted

            await serialRecord.update(
              {
                status: isDamaged ? "DAMAGED" : "RECEIVED",
              },
              { transaction },
            );

            await db.warehouseAllocation.update(
              {
                warehouse_id: target_warehouse_id,
                bay_id: target_row_id,
                rack_id: target_shelf_id,
                bin_id: target_section_id,
                status: isDamaged ? "INACTIVE" : "ACTIVE",
                allocation_status: isDamaged ? "REJECTED" : "ALLOCATED",
              },
              {
                where: { grn_item_status_id: serialRecord.grn_item_status_id },
                transaction,
              },
            );
          }
        } else {
          // For batch / standard items: Update layout allocations
          const qtyVal = parseInt(quantity || 0);
          const acceptVal = parseInt(accepted_qty || 0);
          const damageVal = parseInt(damaged_qty || 0);

          // 1. Decrement source layout allocation
          const [sourceAllocResults] = await db.sequelize.query(
            `
                        SELECT WA.id
                        FROM WAREHOUSE_ALLOCATION AS WA
                        INNER JOIN GRN_ITEM_STATUS AS GS ON GS.id = WA.grn_item_status_id
                        WHERE WA.item_id = ${item_id}
                          AND WA.warehouse_id = ${source_warehouse_id}
                          AND ${source_row_id ? `WA.bay_id = ${source_row_id}` : `WA.bay_id IS NULL`}
                          AND ${source_shelf_id ? `WA.rack_id = ${source_shelf_id}` : `WA.rack_id IS NULL`}
                          AND ${source_section_id ? `WA.bin_id = ${source_section_id}` : `WA.bin_id IS NULL`}
                          AND GS.batchNo = '${batch_no}'
                          AND WA.status = 'ACTIVE'
                        LIMIT 1
                    `,
            { transaction },
          );

          if (sourceAllocResults && sourceAllocResults.length > 0) {
            const sourceAllocId = sourceAllocResults[0].id;
            await db.sequelize.query(
              `
                            UPDATE WAREHOUSE_ALLOCATION
                            SET receiveQty = receiveQty - ${qtyVal}
                            WHERE id = ${sourceAllocId}
                        `,
              { transaction },
            );
          }

          // Mark empty source allocations as inactive
          await db.sequelize.query(
            `
                        UPDATE WAREHOUSE_ALLOCATION 
                        SET status = 'INACTIVE' 
                        WHERE item_id = ${item_id} 
                          AND warehouse_id = ${source_warehouse_id} 
                          AND receiveQty <= 0
                    `,
            { transaction },
          );

          // 2. Increment/Create target layout allocation for accepted qty
          if (acceptVal > 0) {
            const [destAllocResults] = await db.sequelize.query(
              `
                            SELECT WA.id
                            FROM WAREHOUSE_ALLOCATION AS WA
                            INNER JOIN GRN_ITEM_STATUS AS GS ON GS.id = WA.grn_item_status_id
                            WHERE WA.item_id = ${item_id}
                              AND WA.warehouse_id = ${target_warehouse_id}
                              AND ${target_row_id ? `WA.bay_id = ${target_row_id}` : `WA.bay_id IS NULL`}
                              AND ${target_shelf_id ? `WA.rack_id = ${target_shelf_id}` : `WA.rack_id IS NULL`}
                              AND ${target_section_id ? `WA.bin_id = ${target_section_id}` : `WA.bin_id IS NULL`}
                              AND GS.batchNo = '${batch_no}'
                              AND WA.status = 'ACTIVE'
                            LIMIT 1
                        `,
              { transaction },
            );

            if (destAllocResults && destAllocResults.length > 0) {
              const destAllocId = destAllocResults[0].id;
              await db.sequelize.query(
                `
                                UPDATE WAREHOUSE_ALLOCATION
                                SET receiveQty = receiveQty + ${acceptVal}
                                WHERE id = ${destAllocId}
                            `,
                { transaction },
              );
            } else {
              const [grnStatusResults] = await db.sequelize.query(
                `
                                SELECT id
                                FROM GRN_ITEM_STATUS
                                WHERE item_id = ${item_id}
                                  AND batchNo = '${batch_no}'
                                  AND isDeleted = false
                                LIMIT 1
                            `,
                { transaction },
              );

              const grnItemStatusId =
                grnStatusResults && grnStatusResults.length > 0
                  ? grnStatusResults[0].id
                  : null;

              await db.warehouseAllocation.create(
                {
                  item_id,
                  warehouse_id: target_warehouse_id,
                  bay_id: target_row_id || null,
                  rack_id: target_shelf_id || null,
                  bin_id: target_section_id || null,
                  grn_item_status_id: grnItemStatusId,
                  receiveQty: acceptVal,
                  status: "ACTIVE",
                  allocation_status: "ALLOCATED",
                  order_status: "PENDING",
                },
                { transaction },
              );
            }
          }

          // 3. Create inactive layout allocation for damaged qty
          if (damageVal > 0) {
            const [grnStatusResults] = await db.sequelize.query(
              `
                            SELECT id
                            FROM GRN_ITEM_STATUS
                            WHERE item_id = ${item_id}
                              AND batchNo = '${batch_no}'
                              AND isDeleted = false
                            LIMIT 1
                        `,
              { transaction },
            );

            const grnItemStatusId =
              grnStatusResults && grnStatusResults.length > 0
                ? grnStatusResults[0].id
                : null;

            await db.warehouseAllocation.create(
              {
                item_id,
                warehouse_id: target_warehouse_id,
                bay_id: target_row_id || null,
                rack_id: target_shelf_id || null,
                bin_id: target_section_id || null,
                grn_item_status_id: grnItemStatusId,
                receiveQty: damageVal,
                status: "INACTIVE",
                allocation_status: "REJECTED",
                order_status: "PENDING",
              },
              { transaction },
            );
          }
        }
      }
    }

    // Call common controller to process ledger changes
    await manageInventoryLedger(
      {
        id: createStockTransfer.id,
        source_warehouse_id,
        target_warehouse_id,
        financial_id: req.body.financial_year_id || 1,
        entity_id: parseInt(entity_id),
        loginEmployee: req.body.employee_id || 1,
        referenceNo: createStockTransfer.random_id,
      },
      "TRANSFER_RECEIVE",
      transaction,
    );

    await transaction.commit();
    return res
      .status(201)
      .send({
        code: 201,
        message: "Received Stock Transfer Created successfully!",
      });
  } catch (error) {
    await transaction.rollback();
    console.error("Error during rollback:", error);
    const status = error.statusCode || 500;
    return res
      .status(status)
      .send({ code: status, message: error.message || "Internal server error" });
  }
};

exports.getAllRecieveStockTransferNew = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const roleName = req.user?.role_name || req.user?.role_code || '';
    let condition = '';
    if (roleName === 'Super Admin') {
      condition = `1=1`;
    } else {
      condition = `ST.entity_id = ${entity_id}`;
    }
    const [result] = await db.sequelize.query(
      `SELECT ST.id,ST.random_id,ST.stock_entry_type,ST.default_status,ST.transfer_status,ST.date,WM.name AS warehouse_source_name, 
      WMT.name AS target_ware_house 
      FROM STOCK_TRANSFER_NEW AS ST 
      INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = ST.source_warehouse_id 
      INNER JOIN WAREHOUSE_MASTER AS WMT ON WMT.id = ST.target_warehouse_id 
      WHERE ST.entity_id = ${entity_id} AND ${condition} AND ST.isDeleted = false AND ST.transfer_status = 'Dispatched' ORDER BY ST.id DESC`
    );

    if (result) {
      return res.status(200).send({ code: 200, message: 'Available list', data: result });
    } else {
      return res.status(404).send({ code: 404, message: ' No Data Found' })
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: error?.message || "Internal server error" });
  }
};

