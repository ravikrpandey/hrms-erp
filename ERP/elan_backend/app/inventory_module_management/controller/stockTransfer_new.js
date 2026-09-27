const db = require("../../models");
const {
  manageInventoryLedger,
} = require("../../../src/common/common.controller");

exports.generateRandomStockId = async (req, res) => {
  try {
    const lastEntry = await db.stockTransfernew.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["random_id"],
    });

    let number;
    if (lastEntry && lastEntry.random_id) {
      const match = lastEntry.random_id.match(/(\d+)WST$/);
      if (match) {
        const newCode = parseInt(match[1]) + 1;
        number = newCode.toString().padStart(4, "0") + "WST";
      } else {
        number = "0001WST";
      }
    } else {
      number = "0001WST";
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

exports.createStockTransferNew = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { entity_id } = req.params;
    const { body } = req;
    const itemDetails = req.body.item_details;
    const transfer_status = req.body.transfer_status || "Draft";

    const parseLayoutId = (val) => {
      if (val === "" || val === "null" || val === null || val === undefined)
        return null;
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed <= 0) return null;
      return parsed;
    };

    body.source_row_id = parseLayoutId(body.source_row_id);
    body.source_shelf_id = parseLayoutId(body.source_shelf_id);
    body.source_section_id = parseLayoutId(body.source_section_id);
    body.target_row_id = parseLayoutId(body.target_row_id);
    body.target_shelf_id = parseLayoutId(body.target_shelf_id);
    body.target_section_id = parseLayoutId(body.target_section_id);

    if (!entity_id) {
      await transaction.rollback();
      return res.status(400).send({
        code: 400,
        message: "entity_id is Required!",
      });
    }

    // Validate stock availability if status is Submitted
    if (transfer_status === "Submitted") {
      for (const item of itemDetails) {
        const stock = await db.inventory_stock.findOne({
          where: {
            item_id: item.item_id,
            warehouse_id: body.source_warehouse_id,
          },
          transaction,
        });
        if (
          !stock ||
          parseInt(stock.available_qty || 0) < parseInt(item.quantity || 0)
        ) {
          await transaction.rollback();
          return res.status(400).send({
            code: 400,
            message: `Insufficient stock for item code: ${item.item_code || item.item_id}`,
          });
        }
      }
    }

    let createStockTransfer;
    if (body.id) {
      createStockTransfer = await db.stockTransfernew.findOne({
        where: { id: body.id, transfer_status: "Draft" },
        transaction,
      });
      if (!createStockTransfer) {
        await transaction.rollback();
        return res.status(404).send({
          code: 404,
          message: "Draft stock transfer not found or cannot be edited!",
        });
      }
      await createStockTransfer.update(
        {
          date: body.date,
          driver_name: body.driver_name,
          expected_transfer_date: body.expected_transfer_date,
          reason: body.reason,
          remarks: body.remarks,
          source_warehouse_id: body.source_warehouse_id,
          target_warehouse_id: body.target_warehouse_id,
          stock_entry_type: body.stock_entry_type,
          vehicle_no: body.vehicle_no,
          uploadedFile: body.uploadedFile,
          source_shelf_id: body.source_shelf_id,
          source_section_id: body.source_section_id,
          source_row_id: body.source_row_id,
          target_shelf_id: body.target_shelf_id,
          target_section_id: body.target_section_id,
          target_row_id: body.target_row_id,
          transfer_status: transfer_status,
          uses_id: body.uses_id,
        },
        { transaction },
      );

      const oldItems = await db.stockTransferListnew.findAll({
        where: { stock_transfer_id: createStockTransfer.id },
        transaction,
      });
      const oldItemIds = oldItems.map((i) => i.id);
      await db.stockTransferSerialnew.destroy({
        where: { stock_transfer_list_id: oldItemIds },
        transaction,
      });
      await db.stockTransferListnew.destroy({
        where: { stock_transfer_id: createStockTransfer.id },
        transaction,
      });
    } else {
      createStockTransfer = await db.stockTransfernew.create(
        {
          date: body.date,
          driver_name: body.driver_name,
          expected_transfer_date: body.expected_transfer_date,
          reason: body.reason,
          remarks: body.remarks,
          source_warehouse_id: body.source_warehouse_id,
          target_warehouse_id: body.target_warehouse_id,
          stock_entry_type: body.stock_entry_type,
          vehicle_no: body.vehicle_no,
          uploadedFile: body.uploadedFile,
          random_id: body.random_id,
          entity_id: parseInt(entity_id),
          source_shelf_id: body.source_shelf_id,
          source_section_id: body.source_section_id,
          source_row_id: body.source_row_id,
          target_shelf_id: body.target_shelf_id,
          target_section_id: body.target_section_id,
          target_row_id: body.target_row_id,
          transfer_status: transfer_status,
          uses_id: body.uses_id,
          created_by: req.user
            ? req.user.employee_id
            : body.employee_id || req.body.employee_id,
        },
        { transaction },
      );
    }

    if (createStockTransfer && itemDetails) {
      for (const element of itemDetails) {
        const transferListItem = await db.stockTransferListnew.create(
          {
            item_id: element.item_id,
            quantity: element.quantity,
            basic_rate: element.basic_rate || 0,
            value: element.value || 0,
            batch_no: element.batch_no || null,
            stock_transfer_id: parseInt(createStockTransfer.id),
          },
          { transaction },
        );

        // If serial numbers are provided, insert into STOCK_TRANSFER_SERIAL_NEW
        if (element.serial_ids && Array.isArray(element.serial_ids)) {
          for (const serialId of element.serial_ids) {
            await db.stockTransferSerialnew.create(
              {
                stock_transfer_list_id: transferListItem.id,
                grn_item_status_id: serialId,
                status: "RESERVED",
              },
              { transaction },
            );
          }
        }
      }
    }

    // Trigger inventory reserve if submitted directly
    if (transfer_status === "Submitted") {
      await manageInventoryLedger(
        {
          id: createStockTransfer.id,
          source_warehouse_id: body.source_warehouse_id,
          financial_id: body.financial_year_id || req.body.financial_year_id,
          entity_id: parseInt(entity_id),
          loginEmployee: body.employee_id || req.body.employee_id,
          referenceNo: body.random_id,
        },
        "TRANSFER_SUBMIT",
        transaction,
      );
    }

    await transaction.commit();
    res.status(201).json({
      code: 201,
      message: "Stock Transfer Created successfully!",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({
      code: 500,
      message: error?.message || "Internal server error",
    });
  }
};

exports.getAllStockTransferNew = async (req, res) => {
  try {
    const { entity_id, employee_id } = req.params;
    const empId = parseInt(
      employee_id || (req.user ? req.user.employee_id : 0),
    );
    const isSuperAdmin =
      req.user &&
      (req.user.role_name === "Super Admin" ||
        req.user.role_code === "Super Admin");

    let condition = "";
    if (isSuperAdmin) {
      condition = `1=1`;
    } else {
      condition = `(ST.created_by = ${empId} OR U.reporting_manager_id = ${empId})`;
    }

    const [result] = await db.sequelize.query(
      `SELECT ST.id, ST.random_id, ST.stock_entry_type, ST.transfer_status, ST.default_status, ST.date, 
                    WM.name AS warehouse_source_name, WMT.name AS target_ware_house, 
                    ST.created_by, U.reporting_manager_id
            FROM STOCK_TRANSFER_NEW AS ST 
            INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = ST.source_warehouse_id 
            INNER JOIN WAREHOUSE_MASTER AS WMT ON WMT.id = ST.target_warehouse_id 
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = ST.created_by
            WHERE ST.entity_id = ${entity_id} AND ${condition} AND ST.isDeleted = false 
            ORDER BY ST.id DESC`,
    );

    if (result && result.length > 0) {
      const data = result.map((row) => {
        const isCreator = row.created_by === empId;
        const isReportingManager = row.reporting_manager_id === empId;

        return {
          ...row,
          can_submit:
            row.transfer_status === "Draft" && (isCreator || isSuperAdmin),
          can_edit:
            row.transfer_status === "Draft" && (isCreator || isSuperAdmin),
          can_approve:
            row.transfer_status === "Submitted" &&
            (isReportingManager || isSuperAdmin),
          can_dispatch:
            row.transfer_status === "Approved" &&
            (isCreator || isReportingManager || isSuperAdmin),
          can_cancel:
            ["Draft", "Submitted", "Approved"].includes(row.transfer_status) &&
            (isCreator || isReportingManager || isSuperAdmin),
        };
      });
      return res
        .status(200)
        .send({ code: 200, message: "Available list", data });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "No Data Found", data: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: error?.message || "Internal server error" });
  }
};

// Transition controller for stock transfer workflow
exports.updateStockTransferStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      status,
      driver_name,
      vehicle_no,
      remarks,
      expected_transfer_date,
      uploadedFile,
      employee_id,
      financial_year_id,
    } = req.body;

    const transfer = await db.stockTransfernew.findOne({
      where: { id },
      transaction,
    });
    if (!transfer) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ code: 404, message: "Stock Transfer not found!" });
    }

    const oldStatus = transfer.transfer_status;
    const currentUserEmpId = req.user
      ? req.user.employee_id
      : parseInt(employee_id);
    const isSuperAdmin =
      req.user &&
      (req.user.role_code === "Super Admin" ||
        req.user.role_name === "Super Admin");
    const isCreator = transfer.created_by === currentUserEmpId;

    let isReportingManager = false;
    if (transfer.created_by) {
      const creator = await db.user.findOne({
        where: { employee_id: transfer.created_by },
        transaction,
      });
      if (creator && creator.reporting_manager_id === currentUserEmpId) {
        isReportingManager = true;
      }
    }

    // Enforce permissions for status changes
    if (status === "Submitted") {
      if (oldStatus !== "Draft") {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: `Cannot submit transfer with status ${oldStatus}`,
        });
      }
      if (!isCreator && !isSuperAdmin) {
        await transaction.rollback();
        return res.status(403).send({
          code: 403,
          message: "Only the creator or Super Admin can submit the request!",
        });
      }

      // Reserve stock (HOLD +, AVAILABLE -)
      await manageInventoryLedger(
        {
          id: transfer.id,
          source_warehouse_id: transfer.source_warehouse_id,
          financial_id: financial_year_id || transfer.financial_year_id || 1,
          entity_id: transfer.entity_id,
          loginEmployee: currentUserEmpId,
          referenceNo: transfer.random_id,
        },
        "TRANSFER_SUBMIT",
        transaction,
      );

      // Update status of any associated serials to RESERVED
      const items = await db.stockTransferListnew.findAll({
        where: { stock_transfer_id: transfer.id },
        transaction,
      });
      for (const item of items) {
        await db.stockTransferSerialnew.update(
          { status: "RESERVED" },
          { where: { stock_transfer_list_id: item.id }, transaction },
        );
      }
    } else if (status === "Approved") {
      if (oldStatus !== "Submitted") {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: `Cannot approve transfer with status ${oldStatus}`,
        });
      }
      if (!isReportingManager && !isSuperAdmin) {
        await transaction.rollback();
        return res.status(403).send({
          code: 403,
          message:
            "Only the reporting manager of the creator or Super Admin can approve the request!",
        });
      }
      // Approve has no ledger impact (stock remains reserved)
    } else if (status === "Dispatched") {
      if (oldStatus !== "Approved") {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: `Cannot dispatch transfer with status ${oldStatus}`,
        });
      }
      if (!isCreator && !isReportingManager && !isSuperAdmin) {
        await transaction.rollback();
        return res.status(403).send({
          code: 403,
          message: "Not authorized to dispatch this transfer!",
        });
      }

      // Move reserved stock to transit (HOLD -, TRANSIT +)
      await manageInventoryLedger(
        {
          id: transfer.id,
          source_warehouse_id: transfer.source_warehouse_id,
          financial_id: financial_year_id || transfer.financial_year_id || 1,
          entity_id: transfer.entity_id,
          loginEmployee: currentUserEmpId,
          referenceNo: transfer.random_id,
        },
        "TRANSFER_DISPATCH",
        transaction,
      );

      // Update associated serials status to TRANSIT
      const items = await db.stockTransferListnew.findAll({
        where: { stock_transfer_id: transfer.id },
        transaction,
      });
      for (const item of items) {
        await db.stockTransferSerialnew.update(
          { status: "TRANSIT" },
          { where: { stock_transfer_list_id: item.id }, transaction },
        );
      }

      // Save transport details
      await transfer.update(
        {
          driver_name: driver_name || transfer.driver_name,
          vehicle_no: vehicle_no || transfer.vehicle_no,
          remarks: remarks || transfer.remarks,
          expected_transfer_date:
            expected_transfer_date || transfer.expected_transfer_date,
          uploadedFile: uploadedFile || transfer.uploadedFile,
        },
        { transaction },
      );
    } else if (status === "Cancelled") {
      if (!["Draft", "Submitted", "Approved"].includes(oldStatus)) {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: `Cannot cancel transfer with status ${oldStatus}`,
        });
      }
      if (!isCreator && !isReportingManager && !isSuperAdmin) {
        await transaction.rollback();
        return res.status(403).send({
          code: 403,
          message: "Not authorized to cancel this transfer!",
        });
      }

      // Roll back reservations if it was Submitted or Approved
      if (oldStatus === "Submitted" || oldStatus === "Approved") {
        const items = await db.stockTransferListnew.findAll({
          where: { stock_transfer_id: transfer.id },
          transaction,
        });
        for (const el of items) {
          let stock = await db.inventory_stock.findOne({
            where: {
              item_id: el.item_id,
              warehouse_id: transfer.source_warehouse_id,
            },
            transaction,
          });
          const qtyVal = parseInt(el.quantity || 0);
          if (stock) {
            await db.inventory_stock.increment(
              { available_qty: qtyVal },
              { where: { id: stock.id }, transaction },
            );
            await db.inventory_stock.decrement(
              { hold_qty: qtyVal },
              { where: { id: stock.id }, transaction },
            );
          }
          await db.inventory_ledger.create(
            {
              quantity: qtyVal,
              type: "RELEASE",
              reference_table: "STOCK_TRANSFER",
              reference_table_id: el.id,
              remark: `Stock Reservation Cancelled - ${transfer.random_id}`,
              financial_year_id:
                financial_year_id || transfer.financial_year_id || 1,
              entity_id: transfer.entity_id,
              warehouse_id: transfer.source_warehouse_id,
              item_id: el.item_id,
              created_by: currentUserEmpId,
            },
            { transaction },
          );
        }

        // Delete serial reservations or deactivate them
        const itemIds = items.map((i) => i.id);
        await db.stockTransferSerialnew.destroy({
          where: { stock_transfer_list_id: itemIds },
          transaction,
        });
      }
    } else {
      await transaction.rollback();
      return res
        .status(400)
        .send({ code: 400, message: `Unsupported status update: ${status}` });
    }

    await transfer.update({ transfer_status: status }, { transaction });
    await transaction.commit();
    return res.status(200).send({
      code: 200,
      message: `Status updated to ${status} successfully!`,
    });
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error" });
  }
};

// Get a single stock transfer by ID with full details (layout names + item details)
exports.getStockTransferNewById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch header with warehouse names and layout names via LEFT JOIN
    const [headerRows] = await db.sequelize.query(`
            SELECT
                ST.id,
                ST.random_id,
                ST.stock_entry_type,
                ST.transfer_status,
                ST.default_status,
                ST.date,
                ST.reason,
                ST.remarks,
                ST.uploadedFile,
                ST.driver_name,
                ST.vehicle_no,
                ST.expected_transfer_date,
                ST.source_warehouse_id,
                ST.target_warehouse_id,
                ST.source_row_id,
                ST.source_shelf_id,
                ST.source_section_id,
                ST.target_row_id,
                ST.target_shelf_id,
                ST.target_section_id,
                ST.created_by,
                ST.entity_id,
                WMS.name  AS source_warehouse_name,
                WMT.name  AS target_warehouse_name,
                SRZ.name  AS source_zone_name,
                SRB.name  AS source_bay_name,
                SRR.name  AS source_rack_name,
                SRN.name  AS source_bin_name,
                TRZ.name  AS target_zone_name,
                TRB.name  AS target_bay_name,
                TRR.name  AS target_rack_name,
                TRN.name  AS target_bin_name
            FROM STOCK_TRANSFER_NEW AS ST
            LEFT JOIN WAREHOUSE_MASTER          AS WMS  ON WMS.id  = ST.source_warehouse_id
            LEFT JOIN WAREHOUSE_MASTER          AS WMT  ON WMT.id  = ST.target_warehouse_id
            LEFT JOIN WAREHOUSE_BAY             AS SRB  ON SRB.id  = ST.source_row_id
            LEFT JOIN WAREHOUSE_RACK            AS SRR  ON SRR.id  = ST.source_shelf_id
            LEFT JOIN WAREHOUSE_BIN             AS SRN  ON SRN.id  = ST.source_section_id
            LEFT JOIN WAREHOUSE_BAY             AS TRB  ON TRB.id  = ST.target_row_id
            LEFT JOIN WAREHOUSE_RACK            AS TRR  ON TRR.id  = ST.target_shelf_id
            LEFT JOIN WAREHOUSE_BIN             AS TRN  ON TRN.id  = ST.target_section_id
            LEFT JOIN WAREHOUSE_BIFURCATION_ZONE AS SRZ ON SRZ.id  = SRB.zone_id
            LEFT JOIN WAREHOUSE_BIFURCATION_ZONE AS TRZ ON TRZ.id  = TRB.zone_id
            WHERE ST.id = ${id} AND ST.isDeleted = false
            LIMIT 1
        `);

    if (!headerRows || headerRows.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "Stock Transfer not found!" });
    }

    const header = headerRows[0];

    // Fetch item details with item master info
    const [itemRows] = await db.sequelize.query(`
            SELECT
                STL.id,
                STL.item_id,
                STL.quantity,
                STL.batch_no,
                STL.basic_rate,
                STL.value,
                IM.item_code,
                IM.item_name,
                IM.manage_by
            FROM STOCK_TRANSFER_LIST_NEW AS STL
            LEFT JOIN MASTER_ITEM AS IM ON IM.id = STL.item_id
            WHERE STL.stock_transfer_id = ${id}
        `);

    // For each item, fetch its serials
    for (const item of itemRows) {
      const [serialRows] = await db.sequelize.query(`
                SELECT
                    STS.id,
                    STS.grn_item_status_id,
                    STS.status,
                    GIS.itemSerialNo,
                    GIS.batchNo
                FROM STOCK_TRANSFER_SERIAL_NEW AS STS
                LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.id = STS.grn_item_status_id
                WHERE STS.stock_transfer_list_id = ${item.id}
            `);
      item.serials = serialRows;
    }

    header.itemDetails = itemRows;

    return res
      .status(200)
      .send({ code: 200, message: "Stock Transfer Detail", data: header });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error" });
  }
};

// Fetch available serial numbers and batches for specific item and layout locations
exports.getAvailableSerialsAndBatches = async (req, res) => {
  try {
    const {
      item_id,
      warehouse_id,
      row_id,
      shelf_id,
      section_id,
      exclude_transfer_id,
    } = req.query;

    if (!item_id || !warehouse_id) {
      return res
        .status(400)
        .send({ code: 400, message: "item_id and warehouse_id are required!" });
    }

    // Parse and validate layout IDs — reject 0, NaN, 'null', 'undefined'
    const parsedItemId = parseInt(item_id);
    const parsedWarehouseId = parseInt(warehouse_id);
    const parsedRowId =
      row_id && row_id !== "null" && row_id !== "undefined"
        ? parseInt(row_id)
        : null;
    const parsedShelfId =
      shelf_id && shelf_id !== "null" && shelf_id !== "undefined"
        ? parseInt(shelf_id)
        : null;
    const parsedSectionId =
      section_id && section_id !== "null" && section_id !== "undefined"
        ? parseInt(section_id)
        : null;
    const parsedExcludeTransferId =
      exclude_transfer_id &&
      exclude_transfer_id !== "null" &&
      exclude_transfer_id !== "undefined"
        ? parseInt(exclude_transfer_id)
        : null;

    if (isNaN(parsedItemId) || isNaN(parsedWarehouseId)) {
      return res.status(400).send({
        code: 400,
        message: "item_id and warehouse_id must be valid numbers!",
      });
    }

    // Build layout conditions with parameterized replacements
    const layoutConditions = [];
    const replacements = {
      item_id: parsedItemId,
      warehouse_id: parsedWarehouseId,
    };

    if (parsedRowId && parsedRowId > 0) {
      layoutConditions.push(`WA.bay_id = :row_id`);
      replacements.row_id = parsedRowId;
    }
    if (parsedShelfId && parsedShelfId > 0) {
      layoutConditions.push(`WA.rack_id = :shelf_id`);
      replacements.shelf_id = parsedShelfId;
    }
    if (parsedSectionId && parsedSectionId > 0) {
      layoutConditions.push(`WA.bin_id = :section_id`);
      replacements.section_id = parsedSectionId;
    }

    if (parsedExcludeTransferId) {
      replacements.exclude_transfer_id = parsedExcludeTransferId;
    }

    const layoutQuery =
      layoutConditions.length > 0
        ? `AND ${layoutConditions.join(" AND ")}`
        : "";

    // Build layout conditions for reserved query
    const layoutConditionsReserved = [];
    if (parsedRowId && parsedRowId > 0) {
      layoutConditionsReserved.push(`ST.source_row_id = :row_id`);
    }
    if (parsedShelfId && parsedShelfId > 0) {
      layoutConditionsReserved.push(`ST.source_shelf_id = :shelf_id`);
    }
    if (parsedSectionId && parsedSectionId > 0) {
      layoutConditionsReserved.push(`ST.source_section_id = :section_id`);
    }
    const layoutQueryReserved =
      layoutConditionsReserved.length > 0
        ? `AND ${layoutConditionsReserved.join(" AND ")}`
        : "";

    console.log("[getAvailableSerialsAndBatches] Params:", {
      item_id: parsedItemId,
      warehouse_id: parsedWarehouseId,
      row_id: parsedRowId,
      shelf_id: parsedShelfId,
      section_id: parsedSectionId,
      exclude_transfer_id: parsedExcludeTransferId,
      layoutQuery,
    });

    // Query available Serials (excluding those that are currently RESERVED or TRANSIT in other transfers)
    const serialQuery = `
            SELECT GS.id AS grn_item_status_id, GS.itemSerialNo, GS.batchNo, 
                   WA.id AS allocation_id, WA.receiveQty
            FROM WAREHOUSE_ALLOCATION AS WA
            INNER JOIN GRN_ITEM_STATUS AS GS ON WA.grn_item_status_id = GS.id
            WHERE WA.item_id = :item_id
              AND WA.warehouse_id = :warehouse_id
              ${layoutQuery}
              AND WA.status = 'ACTIVE'
              AND GS.isDeleted = false
              AND GS.itemSerialNo IS NOT NULL
              AND GS.itemSerialNo != ''
              AND GS.id NOT IN (
                SELECT STS.grn_item_status_id 
                FROM STOCK_TRANSFER_SERIAL_NEW AS STS
                LEFT JOIN STOCK_TRANSFER_LIST_NEW AS STL ON STL.id = STS.stock_transfer_list_id
                LEFT JOIN STOCK_TRANSFER_NEW AS ST ON ST.id = STL.stock_transfer_id
                WHERE STS.status IN ('RESERVED', 'TRANSIT')
                  AND ST.isDeleted = false
                  ${parsedExcludeTransferId ? `AND ST.id != :exclude_transfer_id` : ""}
              )
              AND GS.id NOT IN (
                SELECT STS.grn_item_status_id 
                FROM STOCK_TRANSFER_SERIAL_NEW AS STS
                WHERE STS.stock_transfer_list_id IS NULL
                  AND STS.status != 'RETURNED'
              )
        `;
    const serials = await db.sequelize.query(serialQuery, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements,
    });

    // Query available Batches (subtracting quantity reserved or transit in other transfers)
    const batchQuery = `
            SELECT GS.batchNo, 
                   (SUM(WA.receiveQty) - COALESCE(Reserved.reservedQty, 0)) AS availableQty
            FROM WAREHOUSE_ALLOCATION AS WA
            INNER JOIN GRN_ITEM_STATUS AS GS ON WA.grn_item_status_id = GS.id
            LEFT JOIN (
                SELECT STL.batch_no, SUM(STL.quantity) AS reservedQty
                FROM STOCK_TRANSFER_LIST_NEW AS STL
                INNER JOIN STOCK_TRANSFER_NEW AS ST ON ST.id = STL.stock_transfer_id
                WHERE STL.item_id = :item_id
                  AND ST.source_warehouse_id = :warehouse_id
                  ${layoutQueryReserved}
                  AND ST.transfer_status IN ('Draft', 'Submitted', 'Approved', 'Dispatched')
                  AND ST.isDeleted = false
                  ${parsedExcludeTransferId ? `AND ST.id != :exclude_transfer_id` : ""}
                GROUP BY STL.batch_no
            ) AS Reserved ON Reserved.batch_no = GS.batchNo
            WHERE WA.item_id = :item_id
              AND WA.warehouse_id = :warehouse_id
              ${layoutQuery}
              AND WA.status = 'ACTIVE'
              AND GS.isDeleted = false
              AND GS.batchNo IS NOT NULL
              AND GS.batchNo != ''
            GROUP BY GS.batchNo, Reserved.reservedQty
            HAVING availableQty > 0
        `;
    const batches = await db.sequelize.query(batchQuery, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements,
    });

    console.log(
      `[getAvailableSerialsAndBatches] Found ${serials.length} serials, ${batches.length} batches`,
    );

    return res.status(200).send({
      code: 200,
      message: "Available layout items",
      data: { serials, batches },
    });
  } catch (error) {
    console.error("[getAvailableSerialsAndBatches] Error:", error.message);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error" });
  }
};
