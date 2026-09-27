const axios = require("axios");
const db = require("../../app/models/index");
class CommonController {
  constructor() {}

  async getPostOfficeByPincode(req, res) {
    try {
      const pincode = req.params.pincode;
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = response.data;
      res.json(data[0]);
    } catch (error) {
      console.error(error);
      const fallbackData = [
        {
          Message: "Number of pincode(s) found:5",
          Status: "Success",
          PostOffice: [
            {
              Name: "D.E.S.U. Colony",
              Description: null,
              BranchType: "Sub Post Office",
              DeliveryStatus: "Non-Delivery",
              Circle: "Delhi",
              District: "West Delhi",
              Division: "New Delhi West",
              Region: "Delhi",
              Block: "New Delhi",
              State: "Delhi",
              Country: "India",
              Pincode: "110058",
            },
            {
              Name: "Jail Road (West Delhi)",
              Description: null,
              BranchType: "Sub Post Office",
              DeliveryStatus: "Non-Delivery",
              Circle: "Delhi",
              District: "West Delhi",
              Division: "New Delhi West",
              Region: "Delhi",
              Block: "New Delhi",
              State: "Delhi",
              Country: "India",
              Pincode: "110058",
            },
            {
              Name: "Janakpuri A-3",
              Description: null,
              BranchType: "Sub Post Office",
              DeliveryStatus: "Non-Delivery",
              Circle: "Delhi",
              District: "West Delhi",
              Division: "New Delhi West",
              Region: "Delhi",
              Block: "New Delhi",
              State: "Delhi",
              Country: "India",
              Pincode: "110058",
            },
            {
              Name: "Janakpuri B-1",
              Description: null,
              BranchType: "Sub Post Office",
              DeliveryStatus: "Delivery",
              Circle: "Delhi",
              District: "West Delhi",
              Division: "New Delhi West",
              Region: "Delhi",
              Block: "New Delhi",
              State: "Delhi",
              Country: "India",
              Pincode: "110058",
            },
            {
              Name: "Janakpuri C-4",
              Description: null,
              BranchType: "Sub Post Office",
              DeliveryStatus: "Non-Delivery",
              Circle: "Delhi",
              District: "West Delhi",
              Division: "New Delhi West",
              Region: "Delhi",
              Block: "New Delhi",
              State: "Delhi",
              Country: "India",
              Pincode: "110058",
            },
          ],
        },
      ];
      res.json(fallbackData[0]);
    }
  }

  async manageInventoryLedger(data, actionType, t) {
    const {
      id,
      sales_order_no,
      warehouse_id,
      financial_id,
      entity_id,
      loginEmployee,
    } = data;

    let items = [];
    let referenceTable = "";
    let referenceNo = "";
    let ledgerType = "";
    let msg = "";
    switch (actionType) {
      case "SO":
      case "POD":
        if (actionType === "SO") {
          ledgerType = "HOLD";
          msg = "Stock Reserved";
        } else if (actionType === "POD") {
          ledgerType = "OUT";
          msg = "Delivered";
        }

        items = await db.salesOrderItemNew.findAll({
          where: { sales_order_id: id },
          transaction: t,
        });
        referenceTable = "SO";
        referenceNo = sales_order_no;
        for (const el of items) {
          let isExist = await db.inventory_stock.findOne({
            where: { item_id: el.item_id, warehouse_id: warehouse_id },
            transaction: t,
          });
          if (isExist) {
            if (actionType === "POD") {
              await db.inventory_stock.increment(
                { delivered_qty: el.qty },
                { where: { id: isExist.id }, transaction: t },
              );
              await db.inventory_stock.decrement(
                { hold_qty: el.qty },
                { where: { id: isExist.id }, transaction: t },
              );
            } else {
              await db.inventory_stock.increment(
                { hold_qty: el.qty },
                { where: { id: isExist.id }, transaction: t },
              );
              await db.inventory_stock.decrement(
                { available_qty: el.qty },
                { where: { id: isExist.id }, transaction: t },
              );
            }

            await db.inventory_ledger.create(
              {
                quantity: el.qty,
                type: ledgerType,
                reference_table: referenceTable,
                reference_table_id: el.id,
                remark: `${msg} Against SO - ${referenceNo}`,
                financial_year_id: financial_id,
                entity_id: entity_id,
                warehouse_id: warehouse_id,
                item_id: el.item_id,
                created_by: loginEmployee,
              },
              { transaction: t },
            );
          }
        }
        break;

      case "GRN":
        const allocationData = await db.warehouseAllocation.findOne({
          where: { id: data.id },
          transaction: t,
        });

        let isExist = await db.inventory_stock.findOne({
          where: {
            item_id: allocationData.item_id,
            warehouse_id: allocationData.warehouse_id,
          },
          transaction: t,
        });
        if (isExist) {
          await db.inventory_stock.increment(
            { available_qty: allocationData.receiveQty },
            { where: { id: isExist.id }, transaction: t },
          );
        } else {
          await db.inventory_stock.create(
            {
              item_id: allocationData.item_id,
              warehouse_id: allocationData.warehouse_id,
              available_qty: allocationData.receiveQty,
              financial_year_id: financial_id,
              entity_id: entity_id,
            },
            { transaction: t },
          );
        }

        await db.inventory_ledger.create(
          {
            quantity: allocationData.receiveQty,
            type: "IN",
            reference_table: "GRN",
            reference_table_id: allocationData.id,
            remark: `Stock Received Against GRN - ${data.sales_order_no}`,
            financial_year_id: financial_id,
            entity_id: entity_id,
            warehouse_id: allocationData.warehouse_id,
            item_id: allocationData.item_id,
            created_by: loginEmployee,
          },
          { transaction: t },
        );
        break;

      case "TRANSFER_SUBMIT":
        // Reserve inventory at source warehouse: available_qty ↓, hold_qty ↑
        items = await db.stockTransferListnew.findAll({
          where: { stock_transfer_id: id },
          transaction: t,
        });
        referenceTable = "STOCK_TRANSFER";
        referenceNo = data.referenceNo || id;
        for (const el of items) {
          let stock = await db.inventory_stock.findOne({
            where: {
              item_id: el.item_id,
              warehouse_id: data.source_warehouse_id,
            },
            transaction: t,
          });
          const qtyVal = parseInt(el.quantity || 0);
          if (stock) {
            await db.inventory_stock.decrement(
              { available_qty: qtyVal },
              { where: { id: stock.id }, transaction: t },
            );
            await db.inventory_stock.increment(
              { hold_qty: qtyVal },
              { where: { id: stock.id }, transaction: t },
            );
          } else {
            throw new Error(
              `Insufficient stock for item ID ${el.item_id} in source warehouse.`,
            );
          }

          await db.inventory_ledger.create(
            {
              quantity: qtyVal,
              type: "HOLD",
              reference_table: referenceTable,
              reference_table_id: el.id,
              remark: `Stock Reserved Against Transfer - ${referenceNo}`,
              financial_year_id: financial_id,
              entity_id: entity_id,
              warehouse_id: data.source_warehouse_id,
              item_id: el.item_id,
              created_by: loginEmployee,
            },
            { transaction: t },
          );
        }
        break;

      case "TRANSFER_DISPATCH":
        // Move from hold to transit: hold_qty ↓, transit_qty ↑ at source warehouse
        items = await db.stockTransferListnew.findAll({
          where: { stock_transfer_id: id },
          transaction: t,
        });
        referenceTable = "STOCK_TRANSFER";
        referenceNo = data.referenceNo || id;
        for (const el of items) {
          let stock = await db.inventory_stock.findOne({
            where: {
              item_id: el.item_id,
              warehouse_id: data.source_warehouse_id,
            },
            transaction: t,
          });
          const qtyVal = parseInt(el.quantity || 0);
          if (stock) {
            await db.inventory_stock.decrement(
              { hold_qty: qtyVal },
              { where: { id: stock.id }, transaction: t },
            );
            await db.inventory_stock.increment(
              { transit_qty: qtyVal },
              { where: { id: stock.id }, transaction: t },
            );
          }

          await db.inventory_ledger.create(
            {
              quantity: qtyVal,
              type: "TRANSFER_OUT",
              reference_table: referenceTable,
              reference_table_id: el.id,
              remark: `Stock Dispatched (In-Transit) Against Transfer - ${referenceNo}`,
              financial_year_id: financial_id,
              entity_id: entity_id,
              warehouse_id: data.source_warehouse_id,
              item_id: el.item_id,
              created_by: loginEmployee,
            },
            { transaction: t },
          );
        }
        break;

      case "TRANSFER_RECEIVE":
        // Move from transit to available: transit_qty ↓ at source. target available_qty ↑, target scrap_qty ↑
        items = await db.receiveStockTransferList.findAll({
          where: { recerivedstock_transfer_id: id },
          transaction: t,
        });
        referenceTable = "STOCK_TRANSFER";
        referenceNo = data.referenceNo || id;
        for (const el of items) {
          const originalQty = parseInt(el.quantity || 0);
          const acceptedQty = parseInt(el.accepted_quantities || 0);
          const damagedQty = parseInt(el.quantities_damaged || 0);

          // 1. Decrement transit_qty at source warehouse
          let sourceStock = await db.inventory_stock.findOne({
            where: {
              item_id: el.item_id,
              warehouse_id: data.source_warehouse_id,
            },
            transaction: t,
          });
          if (sourceStock) {
            await db.inventory_stock.decrement(
              { transit_qty: originalQty },
              { where: { id: sourceStock.id }, transaction: t },
            );
          }

          // 2. Increment target available / scrap at destination warehouse
          let targetStock = await db.inventory_stock.findOne({
            where: {
              item_id: el.item_id,
              warehouse_id: data.target_warehouse_id,
            },
            transaction: t,
          });
          if (!targetStock) {
            targetStock = await db.inventory_stock.create(
              {
                item_id: el.item_id,
                warehouse_id: data.target_warehouse_id,
                available_qty: 0,
                hold_qty: 0,
                delivered_qty: 0,
                scrap_qty: 0,
                transit_qty: 0,
                financial_year_id: financial_id,
                entity_id: entity_id,
              },
              { transaction: t },
            );
          }

          if (acceptedQty > 0) {
            await db.inventory_stock.increment(
              { available_qty: acceptedQty },
              { where: { id: targetStock.id }, transaction: t },
            );
            await db.inventory_ledger.create(
              {
                quantity: acceptedQty,
                type: "TRANSFER_IN",
                reference_table: referenceTable,
                reference_table_id: el.id,
                remark: `Stock Received Against Transfer - ${referenceNo}`,
                financial_year_id: financial_id,
                entity_id: entity_id,
                warehouse_id: data.target_warehouse_id,
                item_id: el.item_id,
                created_by: loginEmployee,
              },
              { transaction: t },
            );
          }

          if (damagedQty > 0) {
            await db.inventory_stock.increment(
              { scrap_qty: damagedQty },
              { where: { id: targetStock.id }, transaction: t },
            );
            await db.inventory_ledger.create(
              {
                quantity: damagedQty,
                type: "SCRAP",
                reference_table: referenceTable,
                reference_table_id: el.id,
                remark: `Stock Received Damaged Against Transfer - ${referenceNo}`,
                financial_year_id: financial_id,
                entity_id: entity_id,
                warehouse_id: data.target_warehouse_id,
                item_id: el.item_id,
                created_by: loginEmployee,
              },
              { transaction: t },
            );
          }
        }
        break;
    }
  }
}

module.exports = new CommonController();
