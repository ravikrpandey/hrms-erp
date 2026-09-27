const db = require("../../../models/index");
const logger = require("../../../../logger/index");
const path = require("path");
const fs = require("fs");
const { generatePDF } = require("../../../../app/common/pdfConverter");
const { QueryTypes, Op, fn, col, where } = require("sequelize");
const moment = require("moment");

exports.Code_grn_create = async (req, res) => {
  try {
    const id = req.body;
    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "ID parameter is missing",
      });
    }
    const grn_code = btoa(Math.random()).slice(0, 10).toUpperCase();

    if (grn_code) {
      return res.status(200).send({
        code: 200,
        message: "Code generated successfully!",
        data: grn_code,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Code generated not created!",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

exports.create_grn = async (req, res) => {
  try {
    let {
      batchType,
      batchNo,
      expiryDate,
      item,
      rejectQty,
      receiveQty,
      amount,
      total_mvp,
      item_id,
      po_item_id,
      remaining_qty,
      grn_item_id,
      po_qty,
      claim_qty,
    } = req.body;
    rejectQty = claim_qty - receiveQty;
    item_id = parseInt(item_id);
    const masterItem = await db.ItemMaster.findOne({
      where: { id: item_id },
    });
    if (!masterItem) {
      return res
        .status(404)
        .json({ code: 404, message: `Item with ID ${item_id} not found` });
    }
    let asset_tagId;
    if (masterItem.use_an_asset) {
      let [s] = await db.sequelize.query(
        `SELECT MAX(id) AS last_id FROM GRN_ITEM_STATUS`,
      );
      let lastId = s[0].last_id || 0;
      asset_tagId = "AST" + String(lastId + 1).padStart(3, "0");
    } else {
      asset_tagId = null;
    }

    const finalQty =
      parseInt(claim_qty) - (parseInt(receiveQty) + parseInt(rejectQty));
    if (batchType === "Batch Only") {
      const dataExist = await db.grnItem.findOne({
        where: { id: grn_item_id },
      });

      if (!dataExist) {
        const createdData = await db.grnItem.create({
          po_item_id,
          receiveQty,
          amount,
          total_mvp,
          rejectQty,
          po_qty,
          item_id,
          selection_item: receiveQty,
          // remaining_qty: finalQty,
        });

        const createdGRN = await db.grnItemStatus.create({
          grn_item_id: createdData.id,
          batchType,
          batchNo,
          expiryDate,
          po_item_id,
          item_id,
          asset_tagId: asset_tagId,
        });

        const Obj = {
          ...createdGRN[0],
          item_list: createdData,
        };

        if (createdGRN) {
          return res.status(200).json({
            code: 200,
            message: "GRN Status Data Created Successfully",
            data: Obj,
          });
        } else {
          return res
            .status(500)
            .json({ code: 500, message: "Failed to create GRN" });
        }
      } else {
        const final =
          parseInt(remaining_qty) -
          (parseInt(receiveQty) + parseInt(rejectQty));
        if (dataExist.version_id != null) {
          const newData = await db.grnItem.create({
            po_item_id,
            receiveQty,
            po_qty,
            rejectQty,
            item_id,
            amount,
            total_mvp,
            selection_item: receiveQty,
            // remaining_qty: final,
          });
          const createdGRN = await db.grnItemStatus.create({
            grn_item_id: newData.id,
            batchType,
            batchNo,
            expiryDate,
            po_item_id,
            item_id,
            asset_tagId: asset_tagId,
          });
          const Obj = {
            ...createdGRN[0],
            item_list: newData,
          };

          if (createdGRN) {
            return res.status(200).json({
              code: 200,
              message: "GRN Status Data Created Successfully",
              data: Obj,
            });
          } else {
            return res
              .status(500)
              .json({ code: 500, message: "Failed to create GRN" });
          }
        } else {
          const itemdata = await db.grnItem.update(
            {
              po_item_id,
              receiveQty,
              po_qty,
              amount,
              rejectQty,
              total_mvp,
              item_id,
              selection_item: rejectQty,
              // remaining_qty,
            },
            { where: { item_id, po_item_id, id: grn_item_id } },
          );
          await db.grnItemStatus.destroy({
            where: { grn_item_id: grn_item_id },
          });
          const createdGRN = await db.grnItemStatus.create({
            grn_item_id: grn_item_id,
            batchType,
            batchNo,
            expiryDate,
            po_item_id,
            item_id,
            asset_tagId: asset_tagId,
          });
          const Obj = {
            ...createdGRN[0],
            item_list: itemdata,
          };
          if (createdGRN) {
            return res.status(200).json({
              code: 200,
              message: "GRN Status Data Created Successfully",
              data: Obj,
            });
          } else {
            return res
              .status(500)
              .json({ code: 500, message: "Failed to create GRN" });
          }
        }
      }
    } else {
      if (item && Array.isArray(item)) {
        const serialNos = item
          .map((i) => i.itemSerialNo)
          .filter((sn) => sn && sn.trim() !== "");
        if (serialNos.length > 0) {
          const duplicateInDb = await db.grnItemStatus.findOne({
            where: {
              itemSerialNo: { [Op.in]: serialNos },
              status: "ACTIVE",
              isDeleted: false,
            },
          });
          if (duplicateInDb) {
            return res.status(400).send({
              code: 400,
              message: `Serial number '${duplicateInDb.itemSerialNo}' for Batch '${duplicateInDb.batchNo}' already exists in the system.`,
            });
          }
        }
      }

      let rcqty = 0;
      let rjqty = 0;

      item.forEach((singleItem) => {
        if (singleItem.itemStatus === "SELECTED") {
          rcqty++;
        } else {
          rjqty++;
        }
      });

      const finalQty = parseInt(po_qty) - (parseInt(rcqty) + parseInt(rjqty));
      const grnExist = await db.grnItem.findOne({ where: { id: grn_item_id } });

      if (!grnExist) {
        const createdData = await db.grnItem.create({
          po_item_id,
          receiveQty: rcqty,
          po_qty,
          amount,
          rejectQty: rejectQty,
          total_mvp,
          item_id,
          selection_item: rcqty,
          // remaining_qty: finalQty,
        });

        const promises = item.map(async (singleItem, index) => {
          const { itemSerialNo, itemStatus, item_id, po_item_id, Item_name } =
            singleItem;
          const createdGRNItem = await db.grnItemStatus.create({
            batchType,
            batchNo,
            expiryDate,
            itemSerialNo,
            itemStatus,
            item_id,
            po_item_id,
            Item_name,
            grn_item_id: createdData.id,
            asset_tagId,
          });

          return createdGRNItem;
        });
        const createdGRNItems = await Promise.all(promises);
        const Obj = {
          ...createdGRNItems[0],
          item_list: createdData,
        };
        return res.status(200).json({
          code: 200,
          message: "GRN Status Data Created Successfully",
          data: Obj,
        });
      } else {
        const final =
          parseInt(remaining_qty) - (parseInt(rcqty) + parseInt(rjqty));
        if (grnExist.version_id != null) {
          const valueData = await db.grnItem.create({
            po_item_id,
            receiveQty: rcqty,
            rejectQty: rejectQty,
            po_qty,
            amount,
            total_mvp,
            item_id,
            selection_item: rcqty,
            // remaining_qty: final,
          });
          // let createdGRNItem
          const promises = item.map(async (singleItem, index) => {
            const { itemSerialNo, itemStatus, item_id, po_item_id, Item_name } =
              singleItem;
            const createdGRNItem = await db.grnItemStatus.create({
              batchType,
              batchNo,
              expiryDate,
              itemSerialNo,
              itemStatus,
              item_id,
              po_item_id,
              Item_name,
              grn_item_id: valueData.id,
              asset_tagId,
            });
            return createdGRNItem;
          });

          const createdGRNItems = await Promise.all(promises);
          const Obj = {
            ...createdGRNItems[0],
            item_list: valueData,
          };
          return res.status(200).json({
            code: 200,
            message: "GRN Status Data Created Successfully",
            data: Obj,
          });
        } else {
          // let createdGRNItem
          const item_list = await db.grnItem.update(
            {
              po_item_id,
              receiveQty: rcqty,
              total_mvp,
              rejectQty: rjqty,
              po_qty,
              amount,
              item_id,
              selection_item: rcqty,
              // remaining_qty: finalQty,
            },
            { where: { item_id, po_item_id, id: grn_item_id } },
          );
          await db.grnItemStatus.destroy({ where: { grn_item_id } });
          const promises = item.map(async (singleItem, index) => {
            const { itemSerialNo, itemStatus, item_id, po_item_id, Item_name } =
              singleItem;
            const createdGRNItem = await db.grnItemStatus.create({
              batchType,
              batchNo,
              expiryDate,
              itemSerialNo,
              itemStatus,
              item_id,
              po_item_id,
              Item_name,
              grn_item_id: grn_item_id,
              asset_tagId,
            });
            return createdGRNItem;
          });
          const createdGRNItems = await Promise.all(promises);
          const Obj = {
            ...createdGRNItems[0]?.dataValues,
            item_list: item_list,
          };
          return res.status(200).json({
            code: 200,
            message: "GRN Status Data Created Successfully",
            data: Obj,
          });
        }
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.updateData_GRN = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      batchType,
      batchNo,
      expiryDate,
      po_item_id,
      item_id,
      po_qty,
      receiveQty,
      final_reject,
      rejectQty,
      item,
      amount,
      total_mvp,
    } = req.body;

    amount = amount ? parseFloat(amount) : 0;
    total_mvp = total_mvp ? parseFloat(total_mvp) : 0;

    if (!id) {
      return res
        .status(400)
        .send({ code: 400, message: "GRN Status ID is required for update" });
    }
    const dataExist = await db.grnItemStatus.findOne({
      where: { grn_item_id: id },
    });
    if (!dataExist) {
      return res
        .status(404)
        .send({ code: 404, message: "GRN item Status Data not found" });
    }
    if (batchType === "Batch Only") {
      const grnItemValue = await db.grnItem.create({
        rejectQty: final_reject - receiveQty,
        remaining_qty: final_reject - receiveQty,
        receiveQty,
        selection_item: receiveQty,
        po_item_id,
        item_id,
        po_qty,
        amount,
        total_mvp,
      });
      const createdGRN = await db.grnItemStatus.create({
        batchType,
        batchNo,
        po_item_id,
        item_id,
        expiryDate,
        grn_item_id: grnItemValue.id,
      });
      const Obj = {
        ...createdGRN[0],
        item_list: grnItemValue,
      };

      return res.status(200).json({
        code: 200,
        message: "GRN Status Data Updated Successfully",
        data: Obj,
      });
    } else {
      if (item && Array.isArray(item)) {
        const serialNos = item
          .map((i) => i.itemSerialNo)
          .filter((sn) => sn && sn.trim() !== "");
        if (serialNos.length > 0) {
          const { Op } = require("sequelize");
          const duplicateInDb = await db.grnItemStatus.findOne({
            where: {
              itemSerialNo: { [Op.in]: serialNos },
              status: "ACTIVE",
              isDeleted: false,
              grn_item_id: { [Op.ne]: id },
            },
          });
          if (duplicateInDb) {
            return res.status(400).send({
              code: 400,
              message: `Serial number '${duplicateInDb.itemSerialNo}' already exists in the system.`,
            });
          }
        }
      }

      let rcqty = 0;
      let rjqty = 0;

      item.forEach((singleItem) => {
        if (singleItem.itemStatus === "SELECTED") {
          rcqty++;
        } else {
          rjqty++;
        }
      });

      const grnItemValue = await db.grnItem.create({
        receiveQty: rcqty,
        rejectQty: rjqty,
        remaining_qty: final_reject - rcqty,
        selection_item: rcqty,
        po_item_id,
        item_id,
        po_qty,
        amount,
        total_mvp,
      });
      await Promise.all(
        item.map(async (grmItem) => {
          const { itemSerialNo, Item_name, po_item_id, item_id } = grmItem;
          await db.grnItemStatus.create({
            batchType: batchType,
            batchNo: batchNo,
            expiryDate: expiryDate,
            itemStatus: "SELECTED",
            itemSerialNo,
            Item_name,
            po_item_id,
            item_id,
            grn_item_id: grnItemValue.id,
          });
        }),
      );
      const Obj = {
        item_list: grnItemValue,
      };
      return res.status(200).json({
        code: 200,
        message: "GRN Status Data Updated Successfully",
        data: Obj,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.createCode = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "ID parameter is missing",
      });
    }

    const existingQuality = await db.purchase_order_item.findOne({
      where: {
        id: id,
        status: "ACTIVE",
      },
    });

    if (!existingQuality) {
      return res.status(404).send({
        code: 404,
        message: "GRN not found with the given ID",
      });
    }

    const latestBatch = await db.grnItemStatus.findOne({
      where: {
        batchNo: {
          [Op.like]: "BN%",
        },
      },
      order: [["id", "DESC"]],
      attributes: ["batchNo"],
    });

    let nextNumber = 1;

    if (latestBatch?.batchNo) {
      const match = latestBatch.batchNo.match(/^BN(\d+)$/);

      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const generatedCode = "BN" + nextNumber.toString().padStart(4, "0");

    return res.status(200).send({
      code: 200,
      message: "Code generated successfully!",
      data: generatedCode,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });

    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

// exports.createCode = async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return res.status(400).send({
//         code: 400,
//         message: "ID parameter is missing",
//       });
//     }

//     const existingQuality = await db.purchase_order_item.findOne({
//       where: { id: id, status: "ACTIVE" },
//     });
//     if (!existingQuality) {
//       return res.status(404).send({
//         code: 404,
//         message: "GRN not found with the given ID",
//       });
//     }

//     let generatedCode = "";
//     const latestBatch = await db.grnItemStatus.max("batchNo");
//     if (latestBatch) {
//       generatedCode =
//         "BN" +
//         (parseInt(latestBatch.substring(2)) + 1).toString().padStart(4, "0");
//     } else {
//       generatedCode = "BN0001";
//     }
//     if (generatedCode) {
//       return res.status(200).send({
//         code: 200,
//         message: "Code generated successfully!",
//         data: generatedCode,
//       });
//     } else {
//       return res.status(404).send({
//         code: 404,
//         message: "Code generated not created!",
//       });
//     }
//   } catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     return res.status(500).send({
//       code: 500,
//       message: error.message,
//     });
//   }
// };

exports.get_all_po_id = async (req, res) => {
  try {
    let { id, ship_id, status, version_id } = req.query;
    // ajay invoice
    /*
    For Initial Po List Data
    */
    if (status == 0) {
      const [getData] = await db.sequelize.query(
        `SELECT  V.vendor_category,V.rcm_charge, SA.freight_charges,SA.cha_service_charges,SA.cha_other_charges,SA.loading_unloading_charges,SA.port_to_warehouse_charges, SA.updatedAt AS grn_date,
        B.freight_charges AS boe_freight_charges, B.insurance_charges,B.duty_amount,B.duty_percent,P.po_number,P.po_date,P.vendor_id,V.vendor_name,P.po_type, P.warehouse_id, WM.name,
                SA.shiped_no, SA.invoice_date, SA.invoice_no, SA.id AS ship_id,V.advance_amount
                FROM SHIPPING_ALERT_SCHEDULE AS SA
                INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = SA.po_id
                LEFT JOIN SHIPPING_BOE_DETAILS AS B ON SA.id = B.shipping_alert_id
                INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id=P.vendor_id
                LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = P.warehouse_id
                WHERE SA.po_id = ${id} AND SA.id = ${ship_id}`,
      );

      const [dataList] = await db.sequelize.query(
        `WITH FilteredData AS (
        SELECT SI.claim_qty,PP.quantity, I.item_name, I.manage_by, I.item_code, A.asset_category_name, I.asset_id,
        GI.version_id, PP.item_master_id AS item_id, PP.unit_price, PP.grand_total AS total_mvp, GI.amount,
        PP.id AS po_item_id, GI.receiveQty, GI.rejectQty, GI.id AS grn_item_id,
        ROW_NUMBER() OVER (PARTITION BY PP.item_master_id, PP.id ORDER BY GI.id DESC,
        CASE WHEN GI.version_id IS NULL THEN 1 ELSE 2 END) AS row_num,

        CASE 
            WHEN I.manage_by = 'S.No. Only' THEN 
                SI.quantity - (
                    SELECT COALESCE(SUM(GI2.receiveQty), 0)
                    FROM GRN_MASTER AS G2
                    INNER JOIN GRN_ITEM AS GI2 ON GI2.grn_Id = G2.id
                    WHERE G2.po_Id = P.Id
                    AND GI2.po_item_id = PP.id
                )
            ELSE 
                SI.quantity - (
                    SELECT COALESCE(SUM(GI2.receiveQty), 0)
                    FROM GRN_MASTER AS G2
                    INNER JOIN GRN_ITEM AS GI2 ON GI2.grn_Id = G2.id
                    WHERE G2.po_Id = P.Id
                    AND GI2.po_item_id = PP.id
                )
        END AS remaining_qty
        FROM PROCUREMENT_PURCHASE_ORDER AS P
        INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS PP ON PP.purchase_order_id = P.id
        INNER JOIN MASTER_ITEM AS I ON I.id = PP.item_master_id
        INNER JOIN SHIPPING_ALERT_SCHEDULE AS SP ON P.id = SP.po_id
        INNER JOIN SHIPPING_ALERT_ITEMS AS SI ON SP.id = SI.shipping_alert_id AND SI.po_item_id = PP.id
        INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
        LEFT JOIN GRN_ITEM AS GI ON GI.po_item_id = PP.id
        WHERE SP.id = ${ship_id}
        )
        SELECT claim_qty,quantity, item_name, manage_by, item_code, asset_category_name, asset_id, version_id, item_id, po_item_id,
        remaining_qty, total_mvp, amount, unit_price,
        CASE WHEN version_id IS NULL THEN receiveQty ELSE NULL END AS receiveQty,
        CASE WHEN version_id IS NULL THEN rejectQty ELSE NULL END AS rejectQty,
        grn_item_id FROM FilteredData
        WHERE row_num = 1`,
      );

      const [grnExistData] = await db.sequelize.query(
        `SELECT GI.remaining_qty, GI.grn_Id, G.po_Id, G.id, G.version_id, GI.po_item_id
         FROM GRN_MASTER AS G
         INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
         WHERE G.po_Id=${id} AND GI.remaining_qty !=0 AND G.version_status ='PENDING'
         ORDER BY G.id DESC`,
      );

      if (grnExistData.length == 0) {
        const Obj = {
          ...getData[0],
          itemList: dataList,
        };
        if (Obj) {
          return res
            .status(200)
            .send({ code: 200, message: "success", data: Obj });
        }
      }
      const [allGrnExist] = await db.sequelize.query(
        `SELECT SUM(GI.receiveQty) AS qty,G.po_Id, 
      P.warehouse_id
          FROM GRN_MASTER AS G
          INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
          INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = G.po_Id
          LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = P.warehouse_id
          WHERE G.po_Id =${id}
          GROUP BY G.po_Id
        `,
      );
      const [dataListCount] = await db.sequelize.query(
        `SELECT SUM(A.quantity) AS qty,A.purchase_order_id 
         FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS A 
         WHERE A.purchase_order_id  = ${id}
          GROUP BY purchase_order_id`,
      );

      if (parseInt(allGrnExist[0].qty) != parseInt(dataListCount[0].qty)) {
        const [finalValue] = await db.sequelize.query(`
          SELECT 
            GI.po_qty AS quantity,
            I.item_name,
            I.manage_by,
            I.item_code,
            A.asset_category_name,
            I.asset_id,
            G.version_id,
            GI.item_id,
            GI.total_mvp,
            POI.unit_price,
            GI.amount,
            GI.invoice_qty,
            GI.selection_item,
            GI.po_item_id,
            GI.id AS grn_item_id,
            WM.name,


            -- ✅ Remaining Qty Logic
            CASE 
                WHEN I.manage_by = 'S.No. Only' THEN 
                    GI.po_qty - (
                        SELECT COALESCE(SUM(GI2.receiveQty), 0)
                        FROM GRN_MASTER AS G2
                        INNER JOIN GRN_ITEM AS GI2 ON GI2.grn_Id = G2.id
                        WHERE G2.po_Id = G.po_Id
                        AND GI2.item_id = GI.item_id
                    )
                ELSE 
                    GI.remaining_qty
            END AS remaining_qty

        FROM GRN_MASTER AS G
        INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = G.id
        INNER JOIN MASTER_ITEM AS I ON I.id = GI.item_id
        INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
        INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = G.po_Id
        LEFT JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.purchase_order_id = G.po_Id

        WHERE 
            G.po_Id = ${id}
            AND G.version_status = 'PENDING'
            AND G.id = (
                SELECT MAX(G2.id)
                FROM GRN_MASTER AS G2
                INNER JOIN GRN_ITEM AS GI2 ON GI2.grn_Id = G2.id
                WHERE 
                    G2.po_Id = G.po_Id
                    AND GI2.item_id = GI.item_id
                    AND G2.version_status = 'PENDING'
            )
        ORDER BY 
            G.id DESC;

        `);

        const recoveryResult = finalValue.map((md) => {
          const matchingUpdatedData = dataList.find(
            (ud) => ud.item_id === md.item_id && ud.version_id == null,
          );

          if (matchingUpdatedData) {
            return {
              ...md,
              receiveQty: parseInt(matchingUpdatedData.receiveQty),
              rejectQty: parseInt(matchingUpdatedData.rejectQty),
              remaining_qty: parseInt(matchingUpdatedData.remaining_qty),
            };
          }

          return md;
        });

        const finalValueData = await recoveryResult.filter(
          (i) => i.receiveQty != null || i.remaining_qty != 0,
        );

        const Obj = {
          ...getData[0],
          itemList: finalValueData,
        };

        return res
          .status(200)
          .send({ code: 200, message: "success", data: Obj });
      } else {
        const Obj = {
          ...getData[0],
          itemList: dataList,
          // promotion_detail: promotion_detail
        };
        if (Obj) {
          return res
            .status(200)
            .send({ code: 200, message: "success", data: Obj });
        }
      }
    } else if (status == 1) {
      const [valueData] = await db.sequelize.query(
        `SELECT G.grn_number,G.po_category_type,V.rcm_charge,P.po_type,G.invoiceDate,G.invoiceNo,G.invoiceDoc,G.po_Id,G.id,G.version_id,G.total_amount,
                P.po_number,P.po_date,P.vendor_id,V.vendor_name,G.grn_date,P.grn_status, P.warehouse_id,
                SAS.shiped_no, SAS.invoice_date, SAS.invoice_no, SAS.id AS ship_id,V.advance_amount
                FROM GRN_MASTER AS G
                INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
                INNER JOIN SHIPPING_ALERT_SCHEDULE AS SAS ON SAS.po_id = P.id
                INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id=P.vendor_id
                WHERE P.id =${id} AND G.version_id=${version_id} AND SAS.id=${ship_id}`,
      );

      let [getDataPresent] = await db.sequelize.query(
        `WITH FilteredData AS (
                 SELECT PP.quantity,I.item_name,I.manage_by,I.item_code,A.asset_category_name,I.asset_id,
                 GI.version_id,PP.item_master_id AS item_id,PP.total_mvp,GI.amount,
                 PP.id AS po_item_id,GI.receiveQty,GI.rejectQty,GI.remaining_qty,GI.id AS grn_item_id,
                 ROW_NUMBER() OVER (PARTITION BY PP.item_master_id, PP.id
                 ORDER BY GI.id DESC, CASE WHEN GI.version_id IS NULL THEN 1 ELSE 2 END) AS row_num
                 FROM PROCUREMENT_PURCHASE_ORDER AS P
                 INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS PP ON PP.purchase_order_id = P.id
                 INNER JOIN MASTER_ITEM AS I ON I.id = PP.item_master_id
                 INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
                 LEFT JOIN GRN_ITEM AS GI ON GI.po_item_id = PP.id
                 WHERE P.id = ${id} ORDER BY GI.id DESC
                )
            SELECT quantity,item_name,manage_by,item_code,asset_category_name,version_id,item_id,po_item_id,
            remaining_qty,total_mvp,amount,
            CASE WHEN version_id IS NULL THEN receiveQty ELSE NULL END AS receiveQty,
            CASE WHEN version_id IS NULL THEN rejectQty ELSE NULL END AS rejectQty,

            grn_item_id FROM FilteredData
            WHERE row_num = 1`,
      );

      let [getData] = await db.sequelize.query(
        `SELECT DISTINCT GI.id AS grn_item_id,'0' AS receiveQty,'0' AS rejectQty,GI.amount,GI.total_mvp,
                COALESCE(GI.rejectQty, 0) AS final_reject, GI.selection_item,GI.po_qty AS quantity,
                GI.invoice_status,I.item_name,I.manage_by,I.item_code,A.asset_category_name,I.asset_id,
                GI.grn_Id, GI.item_id, GI.po_item_id
                FROM GRN_MASTER AS G
                INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
                INNER JOIN MASTER_ITEM AS I ON I.id = GI.item_id
                INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
                INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
                WHERE P.id =${id} AND GI.version_id=${version_id}
`,
      );

      const finalValue = getData.filter((i) => i.final_reject !== 0);

      const recoveryResult = finalValue.map((md) => {
        const matchingUpdatedData = getDataPresent.find(
          (ud) => ud.item_id === md.item_id && ud.version_id == null,
        );

        if (matchingUpdatedData) {
          return {
            ...md,
            receiveQty: parseInt(matchingUpdatedData.receiveQty),
            rejectQty: parseInt(matchingUpdatedData.rejectQty),
          };
        }

        return md;
      });

      const Obj = {
        ...valueData[0],
        ItemList: recoveryResult,
      };
      if (Obj) {
        return res.status(200).send({
          code: 200,
          message: "Get Data Successfully",
          data: Obj,
        });
      } else {
        return res.status(200).send({
          code: 404,
          message: "Record Not Found",
        });
      }
    } else {
      const { invoice_number } = req.query;
      version_id = version_id && version_id != "undefined" ? version_id : 0;

      if (invoice_number && invoice_number != "undefined") {
        const [grnResult] = await db.sequelize.query(
          `SELECT group_concat(GM.po_Id) as po_Id 
                             FROM GRN_MASTER AS GM
                             WHERE invoiceNo = '${invoice_number}'`,
        );

        if (grnResult) {
          id = grnResult[0].po_Id;
        } else {
          return res.status(404).send({
            code: 404,
            message: "No PO found for given invoice number",
          });
        }
      } else {
        id = id;
      }

      const [valueData] = await db.sequelize.query(
        `SELECT DISTINCT G.id AS grn_id,V.vendor_category,V.rcm_charge, G.shiping_id, SA.freight_charges,SA.cha_service_charges,SA.cha_other_charges,SA.loading_unloading_charges,SA.port_to_warehouse_charges,
        B.freight_charges AS boe_freight_charges, B.insurance_charges,B.duty_amount,B.duty_percent,G.grn_number, G.po_category_type, P.po_type, G.invoiceDate, G.invoiceNo, G.invoiceDoc, G.po_Id, G.id, G.version_id, G.total_amount,
                P.po_number, P.po_date, G.vendor_id, V.vendor_name, G.grn_date, P.grn_status, G.grnStatus, P.warehouse_id, WM.name AS warehouse_name,PPL.current_rate,PPL.tds_rate_amount,
                SAS.shiped_no, SAS.invoice_date, SAS.invoice_no,V.advance_amount,P.advance_utilization_percent,PPL.adjusted_amount,PPL.adjustment_type, SAS.id AS ship_id,PPL.PO_invoice_id,PPL.nature_id,PPL.tds_id,TLM.nature_of_transaction
                FROM GRN_MASTER AS G
                INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = G.po_Id
                INNER JOIN SHIPPING_ALERT_SCHEDULE AS SAS ON SAS.po_id = P.id
                INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = G.vendor_id
                INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = P.warehouse_id
                LEFT JOIN PAYMENT_PROGRAM_LIST AS PPL ON G.id = PPL.PO_invoice_id
                LEFT JOIN TDS_LIST_MST AS TLM ON PPL.tds_id = TLM.tds_id
                 INNER JOIN SHIPPING_ALERT_SCHEDULE AS SA ON G.shiping_id = SA.id
                LEFT JOIN SHIPPING_BOE_DETAILS AS B ON SA.id = B.shipping_alert_id
                WHERE   SAS.id=${ship_id} AND G.version_id = ${version_id}`,
      );
      const [itemList] = await db.sequelize.query(
        `SELECT DISTINCT GI.rejectQty,SI.claim_qty, G.po_Id,P.po_number,GI.id AS grn_item_id, GI.receiveQty,GI.amount,GI.total_mvp,
                COALESCE(GI.rejectQty, 0) AS final_reject, GI.selection_item,GI.po_qty AS quantity,
                GI.invoice_status,I.item_name,I.manage_by,I.item_code,A.asset_category_name,I.asset_id,
                GI.grn_Id, GI.item_id, GI.po_item_id, GI.version_id,GIS.batchNo,I.sub_category_id,I.asset_id, HC.hsn_sac_code AS hsnCode, GR.value AS gstRate
                FROM GRN_MASTER AS G
                INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
                INNER JOIN MASTER_ITEM AS I ON I.id = GI.item_id
                INNER JOIN MASTER_HSN_SAC_CODE AS HC ON HC.id = I.hsn_code_id
                INNER JOIN GST_RATE_MASTER AS GR ON GR.id = HC.gst_rate_id
                INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
                INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
                LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
                LEFT JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.purchase_order_id = G.po_Id
                INNER JOIN SHIPPING_ALERT_ITEMS AS SI ON G.shiping_id = SI.shipping_alert_id AND GI.item_id = SI.item_master_id
                WHERE  G.shiping_id=${ship_id} 
                `,
      );
      const chargesList = await db.pochargesDetailsList.findAll({
        where: { po_id: id, shiping_id: ship_id },
      });
      if (invoice_number !== "undefined") {
        const idArray = id.split(",").map(Number);
        id = [idArray[0]].join(",");
      }
      const [addtiondata] = await db.sequelize.query(
        `SELECT PP.*
                 FROM PO_PAYMENT_ADDTIONAL_LIST_MST AS PP
                 WHERE  PP.po_id IN (${id}) AND PP.version_id=${version_id}`,
      );

      const Obj = {
        ...valueData[0],
        ItemList: itemList,
        list: addtiondata,
        chargesList: chargesList,
      };
      if (Obj) {
        return res.status(200).send({
          code: 200,
          message: "Get Data Successfully",
          data: Obj,
        });
      } else {
        return res.status(200).send({
          code: 404,
          message: "Record Not Found",
        });
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.updateGRN = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      financial_year_id,
      entity_id,
      invoiceNo,
      invoiceDate,
      grnStatus,
      po_Id,
      item,
    } = req.body;

    const existingGRN = await db.grnMaster.findOne({
      where: { id: id, isDeleted: false },
    });
    if (!existingGRN) {
      return res.status(404).json({ code: 404, message: "GRN Not Found" });
    }
    await existingGRN.update({
      invoiceNo,
      invoiceDate,
      grnStatus,
      po_Id,
      financial_year_id,
      entity_id,
    });
    await Promise.all(
      item.map(async (singleItem) => {
        const { item_id, receiveQty, rejectQty } = singleItem;
        const existingItem = await db.grnItem.findOne({
          where: { grn_Id: id, item_id },
        });

        if (existingItem) {
          await existingItem.update({ receiveQty, rejectQty });
        } else {
          await db.grnItem.create({
            grn_Id: id,
            receiveQty,
            rejectQty,
            item_id,
          });
        }
      }),
    );
    return res
      .status(200)
      .json({ code: 200, message: "GRN data updated successfully!" });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.get_all_completedGRN = async (req, res) => {
  try {
    const { financial_year_id, entity_id, employee_id, status } = req.query;
    const userExist = await db.user.findOne({ where: { employee_id } });
    const userRoleExist = await db.role_master.findOne({
      where: { role_master_id: userExist.role_master_id },
    });
    let condition = "";
    if (userRoleExist.role_master_name == "Super Admin") {
      condition = ` 1=1 `;
    } else {
      condition = ` PO.employee_id=${employee_id}`;
    }
    if (!financial_year_id || !entity_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing query parameters" });
    }
    /*
    For Open PO GRN List
    */
    if (status == 0) {
      const [poData] = await db.sequelize.query(`
   SELECT DISTINCT
    PO.id,
    SAS.shiped_no,
    SAS.id AS shipment_id,

    COALESCE(SBD.invoice_amount, SAS.invoice_amount) AS invoice_amount,

    PO.createdAt AS po_date,
    PO.po_category,
    PO.po_type,
    PO.po_number,
    PO.grn_status,
    PO.total_purchase,
    SAS.audit AS shipping_status,
    PO.final_status,

    V.vendor_name,
WH.name AS warehouse_name,
    PO.warehouse_id,
    PO.vendor_id,

    -- Total Ordered Qty
    (
        SELECT COALESCE(SUM(PI.quantity), 0)
        FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS PI
        WHERE PI.purchase_order_id = PO.id
    ) AS total_order_qty,

    -- Total Claim Qty
    (
        SELECT COALESCE(SUM(SAI.claim_qty), 0)
        FROM SHIPPING_ALERT_ITEMS AS SAI
        WHERE SAI.shipping_alert_id = SAS.id
    ) AS claim_qty

FROM SHIPPING_ALERT_SCHEDULE AS SAS

INNER JOIN SHIPPING_ALERT_ITEMS AS SI
    ON SAS.id = SI.shipping_alert_id

INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO
    ON SAS.po_id = PO.id

LEFT JOIN SHIPPING_BOE_DETAILS AS SBD
    ON SBD.shipping_alert_id = SAS.id

INNER JOIN VENDOR_BASIC_DETAILS AS V
    ON V.id = PO.vendor_id
INNER JOIN WAREHOUSE_MASTER AS WH ON PO.warehouse_id=WH.id
LEFT JOIN GRN_MASTER AS G
    ON SAS.id = G.shiping_id

WHERE G.id IS NULL  AND PO.financial_year_id = ${financial_year_id}
        AND PO.entity_id = ${entity_id}
        AND ${condition} AND SAS.audit = 'RECEIVED'
ORDER BY SAS.id DESC
        ;
  `);

      // ✅ Include only POs where GRN not fully received
      const pendingPOs = poData.filter((po) => {
        const totalOrderQty = parseInt(po.total_order_qty || 0);
        const totalReceivedQty = parseInt(po.total_received_qty || 0);
        return totalReceivedQty < totalOrderQty;
      });

      // ✅ Get total item quantity for each PO
      const [itemList] = await db.sequelize.query(`
    SELECT 
        P.id, 
        SUM(PI.quantity) AS qty
    FROM PROCUREMENT_PURCHASE_ORDER AS P
    INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS PI 
        ON PI.purchase_order_id = P.id
    GROUP BY P.id;
  `);

      // Convert quantities to integers
      const itemQtyMap = new Map(
        itemList.map((item) => [item.id, parseInt(item.qty || 0)]),
      );

      // ✅ Merge quantities directly
      const finalData = pendingPOs.map((po) => ({
        ...po,
        item_quantity: itemQtyMap.get(po.id) || 0,
      }));

      // ✅ Response handling
      if (finalData.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Data Retrieved Successfully",
          data: finalData,
        });
      } else {
        return res.status(404).send({
          code: 404,
          message: "Record Not Found",
          data: [],
        });
      }
    } else if (status == 1) {
      /*
    For Partial PO GRN List
    */
      const [getData] = await db.sequelize.query(`


        SELECT DISTINCT
                  PO.id,
                  SAS.shiped_no,
                  SAS.id AS shipment_id,
                  G.grn_number,
                  COALESCE(SBD.invoice_amount, SAS.invoice_amount) AS invoice_amount,
 G.grnStatus,
                  PO.createdAt AS po_date,
                  PO.po_category,
                  PO.po_type,
                  PO.po_number,
                  PO.grn_status,
                  PO.total_purchase,
                  SAS.audit AS shipping_status,
                  PO.final_status,
 G.version_id,
                  V.vendor_name,
WH.name AS warehouse_name,
                  PO.warehouse_id,
                  PO.vendor_id,

                  -- Total Ordered Qty
                  (
                      SELECT COALESCE(SUM(PI.quantity), 0)
                      FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS PI
                      WHERE PI.purchase_order_id = PO.id
                  ) AS total_order_qty,

                  -- Total Received Qty (NEW)
                  (
                      SELECT COALESCE(SUM(GI.rejectQty), 0)
                      FROM GRN_MASTER GM
                      INNER JOIN GRN_ITEM GI ON GI.grn_Id = GM.id
                      WHERE GM.shiping_id = SAS.id
                  ) AS item_quantity,

                  -- Total Claim Qty
                  (
                      SELECT COALESCE(SUM(SAI.claim_qty), 0)
                      FROM SHIPPING_ALERT_ITEMS AS SAI
                      WHERE SAI.shipping_alert_id = SAS.id
                  ) AS claim_qty

              FROM SHIPPING_ALERT_SCHEDULE AS SAS

              INNER JOIN SHIPPING_ALERT_ITEMS AS SI
                  ON SAS.id = SI.shipping_alert_id

              INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO
                  ON SAS.po_id = PO.id

              LEFT JOIN SHIPPING_BOE_DETAILS AS SBD
                  ON SBD.shipping_alert_id = SAS.id

              INNER JOIN VENDOR_BASIC_DETAILS AS V
                  ON V.id = PO.vendor_id

              INNER JOIN GRN_MASTER AS G
                  ON SAS.id = G.shiping_id

              INNER JOIN GRN_ITEM AS GI
                  ON GI.grn_Id = G.id
INNER JOIN WAREHOUSE_MASTER AS WH ON PO.warehouse_id=WH.id
              WHERE COALESCE(GI.rejectQty, 0) > 0 AND  ${condition} AND G.isDeleted=FALSE AND G.status="ACTIVE";
               `);
      // const [itemList] = await db.sequelize.query(
      //   `SELECT G.id,G.po_Id,SUM(GI.rejectQty) AS qty,G.version_id
      //           FROM GRN_MASTER AS G
      //           INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
      //           GROUP BY G.id,G.po_Id`
      // );
      // const finalData = await getData.map((md) => {
      //   const item = itemList.find(
      //     (item) => item.po_Id == md.po_Id && item.version_id == md.version_id
      //   );
      //   md.item_quantity = item ? item.qty : 0;
      //   return md;
      // });
      // const final = await finalData.filter(
      //   (i) => i.item_quantity != null && i.item_quantity != 0
      // );
      if (getData) {
        return res.status(200).send({
          code: 200,
          message: "Data Retrieved Successfully",
          data: getData,
        });
      } else {
        return res
          .status(200)
          .send({ code: 404, message: "Record Not Found", data: final });
      }
    } else if (status == 2) {
      /*
    For Completed PO GRN List
    */
      const [getData] = await db.sequelize.query(`
    SELECT
      GM.grn_number,
      GM.grnStatus AS discardStatus,
      GM.id,
      G.version,
      GM.total_amount AS total_purchase,
      GM.invoiceDoc,
      GM.grnStatus,
      GM.po_Id,
      GM.financial_year_id,
      GM.entity_id,
      GM.employee_id,
      GM.version_id,
      GM.grn_date,
      PO.po_number,
      PO.po_type,
      PO.po_category,
      PO.createdAt AS po_date,
      GM.mltiple_data,
      VB.vendor_name,
      W.name AS warehouse_name,
      GM.addstock_status,
      SAS.shiped_no,SAS.id AS shipment_id,COALESCE(SBD.invoice_amount, SAS.invoice_amount) AS invoice_amount
      -- 👇 removed IM.invoice_status, IM.mode, IM.invoice_number
    FROM GRN_MASTER AS GM
    INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_Id
    INNER JOIN SHIPPING_ALERT_SCHEDULE AS SAS ON SAS.id = GM.shiping_id
    LEFT JOIN SHIPPING_BOE_DETAILS AS SBD ON SBD.shipping_alert_id = SAS.id
    INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PO.vendor_id
    INNER JOIN WAREHOUSE_MASTER AS W ON W.id = PO.warehouse_id
    INNER JOIN GRN_VERSION_MST AS G ON G.id = GM.version_id
    WHERE GM.grnStatus = 'COMPLETED'
      AND GM.financial_year_id = ${financial_year_id}
      AND GM.entity_id = ${entity_id}
      AND ${condition}
      AND GM.isDeleted = FALSE
      AND GM.status = 'ACTIVE'
    ORDER BY GM.id DESC
`);

      const [itemList] = await db.sequelize.query(
        `SELECT G.id,G.po_Id,SUM(GI.selection_item) AS qty,G.version_id
         FROM GRN_MASTER AS G
         INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
         GROUP BY G.id,G.po_Id`,
      );

      const itemListWithQtyAsInt = itemList.map((item) => ({
        ...item,
        qty: parseInt(item.qty, 10) || 0,
      }));

      const finalCount = [...itemListWithQtyAsInt];

      function mergeDataValue(finalCount) {
        const mergedData = [];
        finalCount.forEach((item) => {
          const existingItem = mergedData.find(
            (i) => i.id === item.id && i.version_id == item.version_id,
          );
          if (existingItem) {
            existingItem.qty += parseInt(item.qty);
          } else {
            mergedData.push({ ...item });
          }
        });

        return mergedData;
      }
      const result = mergeDataValue(finalCount);
      const finalData = await getData.map((md) => {
        const item = result.find(
          (item) => item.po_Id == md.po_Id && item.version_id == md.version_id,
        );
        md.item_quantity = item ? item.qty : 0;
        return md;
      });

      if (finalData.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Data Retrieved Successfully",
          data: finalData,
        });
      } else {
        return res
          .status(200)
          .send({ code: 404, message: "Record Not Found", data: finalData });
      }
    } else {
      return res.status(400).send({ code: 400, message: "Invalid status" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_all_GRN_ID = async (req, res) => {
  try {
    const { id } = req.params;
    const [getData] = await db.sequelize.query(
      `
           SELECT GM.id,GM.grn_number,GM.po_category_type,GM.invoiceNo,GM.invoiceDate,GM.invoiceDoc,GM.grnStatus,
           GM.isDeleted,GM.status,GM.po_Id,
           GM.financial_year_id,GM.entity_id,
           GI.id AS GI_ID,GI.receiveQty,GI.rejectQty,GI.selection_item,
           GI.status,GI.isDeleted,GI.grn_Id,GI.item_id,GI.po_item_id
           FROM GRN_MASTER AS GM 
           JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
           WHERE GM.id = :id AND GM.grnStatus ='COMPLETE'
            `,
      {
        replacements: { id },
      },
    );
    const [getData_item_status] = await db.sequelize.query(
      `
          SELECT GI.id,GI.grn_Id,GIS.id AS GIS_ID,GIS.batchType,GIS.batchNo,GIS.expiryDate,GIS.itemSerialNo,
           GIS.Item_name,GIS.itemStatus,GIS.po_item_id,GIS.item_id,GIS.grn_item_id
           FROM GRN_ITEM AS GI 
           JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
           WHERE GI.grn_Id = :id AND GIS.itemStatus = 'SELECTED'
            `,
      {
        replacements: { id },
      },
    );
    const Obj = {
      ...getData[0],
      getData_item_status,
    };
    if (getData) {
      return res
        .status(200)
        .send({ code: 200, message: "Data Retrieved Successfully", data: Obj });
    } else {
      return res.status(200).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_all_grnItem_id = async (req, res) => {
  try {
    const { id, status } = req.query;

    if (status == "partial-list") {
      const getData = await db.grnItemStatus.findAll({
        where: { grn_item_id: id, itemStatus: "REJECTED" },
      });
      const Obj = {
        ...getData[0].dataValues,
        itemList: getData,
      };

      if (getData.length > 0) {
        return res
          .status(200)
          .send({ code: 200, message: "Get Data Successfully", data: Obj });
      } else {
        return res.status(404).send({ code: 404, message: "Record Not Found" });
      }
    }
    const getData = await db.grnItemStatus.findAll({
      where: { grn_item_id: id },
    });
    const Obj = {
      ...getData[0].dataValues,
      itemList: getData,
    };

    if (getData.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Get Data Successfully", data: Obj });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_by_Id_grn = async (req, res) => {
  try {
    const GrnPurchase = await db.grnMaster.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.grnItem,
          attributes: ["id", "receiveQty", "rejectQty", "grn_Id", "Item_Id"],
          include: [
            {
              model: db.ItemMaster,
            },
            {
              model: db.purchase_order_item,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    if (GrnPurchase && GrnPurchase.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: GrnPurchase,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.get_GRN_ByPO_AND_GRN_id = async (req, res) => {
  try {
    const { po_id, grn_id } = req.query;

    const GrnPurchase = await db.grnMaster.findAll({
      where: { po_Id: po_id, id: grn_id },
      include: [
        {
          model: db.purchase_order,
          attributes: ["id", "po_number", "po_date", "po_type"],
        },
        {
          model: db.grnItem,
          attributes: ["id", "receiveQty", "rejectQty", "selection_item"],
          required: false,
          include: [
            {
              model: db.ItemMaster,
              attributes: ["id", "item_name", "item_code"],
              include: {
                model: db.asset,
                attributes: ["asset_category_name"],
              },
            },
            {
              model: db.purchase_order_item,
              attributes: ["quantity"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    if (GrnPurchase && GrnPurchase.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: GrnPurchase,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.patchGrnDiscard = async (req, res) => {
  try {
    const { grn_id } = req.query;
    const grnExist = await db.grnMaster.findOne({ where: { id: grn_id } });
    const updateData = await db.grnMaster.update(
      { discardStatus: "DISCARDED" },
      { where: { id: grn_id } },
    );
    const [allGrnExist] = await db.sequelize.query(
      `SELECT SUM(GI.receiveQty) AS qty,G.po_Id
        FROM GRN_MASTER AS G
        INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
        WHERE po_Id =${grnExist.po_Id}
        GROUP BY G.po_Id
        `,
    );
    const [allGrnExistClosed] = await db.sequelize.query(
      `SELECT SUM(GI.rejectQty) AS reject,G.po_Id
        FROM GRN_MASTER AS G
        INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
        WHERE po_Id =${grnExist.po_Id} AND discardStatus ='DISCARDED'
        GROUP BY G.po_Id
        `,
    );
    let closedCount = 0;
    if (allGrnExistClosed.length != 0) {
      closedCount = allGrnExistClosed[0].reject;
    }
    const [dataList] = await db.sequelize.query(
      `SELECT SUM(A.quantity) AS qty,A.purchase_order_id 
         FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS A 
         WHERE A.purchase_order_id  = ${grnExist.po_Id}
          GROUP BY purchase_order_id`,
    );
    if (
      parseInt(allGrnExist[0].qty) + parseInt(closedCount) ==
      parseInt(dataList[0].qty)
    ) {
      await db.purchase_order.update(
        { grn_status: "APPROVED" },
        { where: { id: grnExist.po_Id } },
      );
    }

    if (updateData) {
      return res
        .status(200)
        .send({ code: 200, message: "Discard SuccessFully" });
    } else {
      return res.status(200).send({ code: 404, message: "Not Updated" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.downloadPurchaseGRNById = async (req, res) => {
  try {
    const { id, version_id } = req.query;

    // ✅ SECURE QUERY
    const valueData = await db.sequelize.query(
      `SELECT 
    G.*, 
    P.po_type, 
    P.po_number,
    P.po_date,
    V.vendor_name, 
    V.vendor_address, 
    V.contact_number,
    C.symbols AS currency, 
    C.rate AS exchange_rate, 
    G.invoiceNo, 
    G.invoiceDate, 
    V.gst_in, 
    V.vendor_pincode, 
    E.entity_name,
    E.tax_registration_number AS entity_gst_in, 
    E.registered_office, 
    E.logo, 
    W.address AS warehouse_address, 
    W.pin AS warehouse_pin, 
    W.postal_address,
    VSAM.gst_in AS vendor_gstin, 
    VBA.gst_in AS vendor_billing_gstin

FROM GRN_MASTER G

LEFT JOIN PROCUREMENT_PURCHASE_ORDER P 
    ON P.id = G.po_Id

LEFT JOIN VENDOR_BASIC_DETAILS V 
    ON V.id = G.vendor_id

LEFT JOIN MASTER_CURRENCY_CONVERT C 
    ON C.Currency_Convert_id = V.currency_id

LEFT JOIN ENTITY_MASTER E 
    ON E.id = G.entity_id

LEFT JOIN WAREHOUSE_MASTER W 
    ON W.id = P.warehouse_id

LEFT JOIN VENDOR_BILLING_ADDRESS VBA 
    ON VBA.vendor_id = G.vendor_id

LEFT JOIN VENDOR_SHIPPING_ADDRESS_MST VSAM 
    ON VSAM.vendor_id = G.vendor_id

WHERE G.id = :id 
AND G.version_id = :version_id`,
      {
        replacements: { id, version_id },
        type: QueryTypes.SELECT,
      },
    );

    const items = await db.sequelize.query(
      `SELECT GI.*, I.item_code, I.item_name, I.description, GRM.value AS gstRate, HSN.hsn_sac_code, MU.uom_name AS uom
       FROM GRN_ITEM GI
       INNER JOIN MASTER_ITEM I ON I.id = GI.item_id
       INNER JOIN MASTER_HSN_SAC_CODE HSN ON HSN.id = I.hsn_code_id
       INNER JOIN GST_RATE_MASTER GRM ON GRM.id = HSN.gst_rate_id
       LEFT JOIN MASTER_UOM MU ON MU.uom_id = I.uom_id
       WHERE GI.version_id = :version_id`,
      {
        replacements: { version_id },
        type: QueryTypes.SELECT,
      },
    );

    // console.log("valueData", valueData);
    // console.log("items", items);

    if (!valueData.length) {
      return res.status(404).send({ message: "No Data Found" });
    }

    const header = valueData[0];

    // ✅ LOAD TEMPLATE
    const htmlPath = path.resolve(
      __dirname,
      "../../../../src/assets/templates/purchase_grn.html",
    );

    let html = fs.readFileSync(htmlPath, "utf-8");

    // ✅ GENERATE TABLE
    const { html: itemsTable, totalQty } = generateGRNItemsTable(items);
    const logoPath = path.join(
      __dirname,
      "../../../../src/assets/selected-logo.jpg",
    );
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    let mainAddress =
      `${header?.warehouse_address}, ${header?.warehouse_pin}` ||
      "Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004";

    console.log(header);

    // ✅ BIND DATA HELPER
    const bindData = (template, data) => {
      return template.replace(/{{(.*?)}}/g, (_, key) =>
        data[key.trim()] !== undefined ? data[key.trim()] : "",
      );
    };

    // Format dates
    const formattedVoucherDate = header.grn_date
      ? moment(header.grn_date).format("DD/MM/YYYY")
      : "-";
    const formattedInvDate = header.invoiceDate
      ? moment(header.invoiceDate).format("DD/MM/YYYY")
      : "-";
    const formattedPODate = header.po_date
      ? moment(header.po_date).format("DD/MM/YYYY")
      : "";
    const poNumberDate = header.po_number
      ? `${header.po_number}${formattedPODate ? ` & ${formattedPODate}` : ""}`
      : "-";

    html = bindData(html, {
      heading: "Purchase GRN",
      contact_number: header.contact_number,

      voucher_no: header.grn_number,
      voucher_date: formattedVoucherDate,

      total_qty: totalQty,

      itemsTable,

      vendor_name: header.vendor_name,
      vendor_address: header.vendor_address,
      vendor_pincode: header.vendor_pincode || "-",
      vendor_gstin: `${header.vendor_gstin || header.vendor_billing_gstin || header.gst_in || "-"}`,
      vendor_invoice_no: header.invoiceNo || "-",
      vendor_invoice_date: formattedInvDate,

      po_number_date: poNumberDate,
      prepared_by: header.prepared_by || "Dileep Kumar",

      entityName: header.entity_name,
      entityAddress: header.registered_office,
      entity_gst_in: `${header.entity_gst_in || "-"}`,
      entityLogo: logoBase64,
      mainAddress: mainAddress,
    });

    const pdfBuffer = await generatePDF(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=grn.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

function generateGRNItemsTable(items) {
  let html = "";
  let i = 1;
  let totalQty = 0;

  items.forEach((item) => {
    const invQty = Number(item.po_qty || 0);
    const recQty = Number(item.receiveQty || 0);
    const diff = invQty - recQty;
    totalQty += recQty;

    html += `
      <tr>  
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${i++}</td>
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${item.item_code || ""}</td>
        <td style="border: 1px solid #000; padding: 6px;">${item.item_name || ""}</td>
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${invQty}</td>
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${diff === 0 ? ".00" : diff.toFixed(2)}</td>
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${recQty}</td>
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${item.uom || "NOS"}</td>
      </tr>`;
  });

  html += `
    <tr style="font-weight: bold; background-color: #f2f2f2;">
      <td colspan="5" style="text-align: right; border: 1px solid #000; padding: 6px;">Total</td>
      <td style="text-align: center; border: 1px solid #000; padding: 6px;">${totalQty}</td>
      <td style="border: 1px solid #000; padding: 6px;"></td>
    </tr>`;

  return { html, totalQty };
}

module.exports.downloadPurchaseInvoiceById = async (req, res) => {
  try {
    const { id, version_id } = req.query;

    // ✅ SECURE QUERY
    const valueData = await db.sequelize.query(
      `SELECT 
    G.*, 
    P.po_type, 
    V.vendor_name, 
    V.vendor_address, 
    V.contact_number,
    C.symbols AS currency, 
    C.rate AS exchange_rate, 
    G.invoiceNo, 
    G.invoiceDate, 
    V.gst_in, 
    V.vendor_pincode, 
    E.entity_name,
    E.tax_registration_number AS entity_gst_in, 
    E.registered_office, 
    E.logo, 
    W.address AS warehouse_address, 
    W.pin AS warehouse_pin, 
    W.postal_address,
    VSAM.gst_in AS vendor_gstin, 
    VBA.gst_in AS vendor_billing_gstin

FROM GRN_MASTER G

LEFT JOIN PROCUREMENT_PURCHASE_ORDER P 
    ON P.id = G.po_Id

LEFT JOIN VENDOR_BASIC_DETAILS V 
    ON V.id = G.vendor_id

LEFT JOIN MASTER_CURRENCY_CONVERT C 
    ON C.Currency_Convert_id = V.currency_id

LEFT JOIN ENTITY_MASTER E 
    ON E.id = G.entity_id

LEFT JOIN WAREHOUSE_MASTER W 
    ON W.id = P.warehouse_id

LEFT JOIN VENDOR_BILLING_ADDRESS VBA 
    ON VBA.vendor_id = G.vendor_id

LEFT JOIN VENDOR_SHIPPING_ADDRESS_MST VSAM 
    ON VSAM.vendor_id = G.vendor_id

WHERE G.id = :id 
AND G.version_id = :version_id`,
      {
        replacements: { id, version_id },
        type: QueryTypes.SELECT,
      },
    );

    const items = await db.sequelize.query(
      `SELECT GI.*, I.item_name, I.description, GRM.value AS gstRate, HSN.hsn_sac_code
       FROM GRN_ITEM GI
       INNER JOIN MASTER_ITEM I ON I.id = GI.item_id
       INNER JOIN MASTER_HSN_SAC_CODE HSN ON HSN.id = I.hsn_code_id
       INNER JOIN GST_RATE_MASTER GRM ON GRM.id = HSN.gst_rate_id
       WHERE GI.version_id = :version_id`,
      {
        replacements: { version_id },
        type: QueryTypes.SELECT,
      },
    );

    // console.log("valueData", valueData);
    // console.log("items", items);

    if (!valueData.length) {
      return res.status(404).send({ message: "No Data Found" });
    }

    const header = valueData[0];

    // ✅ DETECT TYPE
    const isInternational = header.currency !== "INR";

    // ✅ CALCULATIONS
    const summary = items.reduce(
      (acc, item) => {
        acc.qty += item.receiveQty || 0;
        acc.subTotal += parseFloat(item.amount) || 0;
        return acc;
      },
      { qty: 0, subTotal: 0 },
    );

    let finalData = {
      total_qty: summary.qty,
      sub_total: summary.subTotal.toFixed(2),
      final_total: summary.subTotal.toFixed(2),
    };

    // ✅ CONDITIONAL LOGIC
    let gst_block = "";
    let usd_block = "";
    let dynamic_columns_header = "";
    let extra_header_field = "";

    if (isInternational) {
      const exchangeRate = header.exchange_rate || 1;

      const totalINR = summary.subTotal * exchangeRate;

      dynamic_columns_header = `
        <th>Rate ($)</th>
        <th>Rate (₹)</th>
        <th>Amount ($)</th>
        <th>Amount (₹)</th>
      `;

      usd_block = `
<tr>
  <td colspan="5"></td>
  <td class="right">Total ($)</td>
  <td class="right">$ ${summary?.subTotal?.toFixed(2)}</td>
</tr>
<tr>
  <td colspan="5"></td>
  <td class="right">Total (INR)</td>
  <td class="right">₹ ${totalINR.toFixed(2)}</td>
</tr>
`;

      extra_header_field = `Exchange Rate: ${exchangeRate}`;

      finalData.final_total = `₹ ${totalINR.toFixed(2)}`;
    } else {
      const igst = summary?.subTotal * 0.18; // example
      const tds = 0;
      const rounding = 0;

      const finalTotal = summary?.subTotal + igst - tds + rounding;

      dynamic_columns_header = `
        <th>Rate (₹)</th>
        <th>Amount (₹)</th>
      `;
      gst_block = `
<tr>
  <td colspan="5"></td>
  <td class="right">IGST</td>
  <td class="right">₹ ${igst.toFixed(2)}</td>
</tr>
<tr>
  <td colspan="5"></td>
  <td class="right">TDS on purchasing (194Q)</td>
  <td class="right">₹ ${tds.toFixed(2)}</td>
</tr>
<tr>
  <td colspan="5"></td>
  <td class="right">Rounding</td>
  <td class="right">₹ ${rounding.toFixed(2)}</td>
</tr>
`;
      finalData.final_total = `₹ ${finalTotal.toFixed(2)}`;
    }

    // ✅ LOAD TEMPLATE
    const htmlPath = path.resolve(
      __dirname,
      "../../../../src/assets/templates/purchase_invoice_inr.html",
    );

    let html = fs.readFileSync(htmlPath, "utf-8");

    // ✅ BIND DATA
    const bindData = (template, data) => {
      return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || "");
    };

    // ✅ GENERATE TABLE
    const itemsTable = generateItemsTable(items, isInternational);
    const hsnTable = items.map(
      (item) => `
            <tr>
              <td class="right">${item.hsn_sac_code || ""}</td>
              <td class="right">${item.amount || 0}</td>
              <td class="right">${item.gstRate || 0}%</td>
              <td class="right">${(item.gstRate / 100) * parseFloat(item.amount) || 0}</td>
            </tr>
        `,
    );
    const logoPath = path.join(
      __dirname,
      "../../../../src/assets/selected-logo.jpg",
    );
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    let mainAddress =
      `${header?.warehouse_address}, ${header?.warehouse_pin}` ||
      "Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004";

    console.log(header);

    html = bindData(html, {
      heading: "Purchase Invoice",
      contact_number: header.contact_number,

      voucher_no: header.grn_number,
      voucher_date: header.grn_date,

      total_qty: finalData.total_qty,
      sub_total: finalData.sub_total,
      final_total: finalData.final_total,

      itemsTable,
      hsnTable,
      gst_block,
      usd_block,
      dynamic_columns_header,
      extra_header_field,

      vendor_name: header.vendor_name,
      vendor_address: header.vendor_address,
      vendor_pincode: `PIN Code: ${header.vendor_pincode || "-"}`,
      vendor_gstin: `GSTIN: ${header.vendor_gstin || header.vendor_billing_gstin || "-"}`,
      vendor_invoice_no: header.invoiceNo,
      vendor_invoice_date: header.invoiceDate,

      due_date: "-",
      e_way_bill_no: "-",
      docket_no: "-",
      courier_company: "-",

      amount_in_words: "TODO",
      entityName: header.entity_name,
      entityAddress: header.registered_office,
      entity_gst_in: `GSTIN: ${header.entity_gst_in || "-"}`,
      entityLogo: logoBase64,
      mainAddress: mainAddress,
    });

    const pdfBuffer = await generatePDF(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

function generateItemsTable(items, isInternational) {
  let html = "";
  let i = 1;

  items.forEach((item) => {
    let taxAmount = (item.gstRate / 100) * parseFloat(item.amount) || 0;
    if (isInternational) {
      const rateUSD = item.unit_price || 0;
      const rateINR = rateUSD * 80; // example
      const amountUSD = parseFloat(item.amount) || 0;
      const amountINR = amountUSD * 80;

      html += `
      <tr>
        <td>${i++}</td>
        <td>${item.item_name}</td>
        <td>${item.description || ""}</td>
        <td>${item.hsn_sac_code || ""}</td>
        <td class="right">${item.selection_item || 0}</td>
        <td class="right">$ ${rateUSD.toFixed(2)}</td>
        <td class="right">₹ ${rateINR.toFixed(2)}</td>
        <td class="right">$ ${amountUSD.toFixed(2)}</td>
        <td class="right">₹ ${amountINR.toFixed(2)}</td>
      </tr>`;
    } else {
      html += `
      <tr>  
        <td>${i++}</td>
        <td>${item.item_name}</td>
        <td>${item.description || ""}</td>
        <td>${item.hsn_sac_code || ""}</td>
        <td class="right">${item.selection_item || 0}</td>
        <td class="right">(${item.gstRate || 0}%) ₹ ${taxAmount.toFixed(2)}</td>
        <td class="right">₹ ${(parseFloat(item.amount) || 0).toFixed(2)}</td>
      </tr>`;
    }
  });

  return html;
}

exports.get_vendor_po_list = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    if (!vendor_id) {
      return res
        .status(400)
        .send({ code: 400, message: "vendor_id is required" });
    }
    const grnPoIds = await db.grnMaster.findAll({
      attributes: ["po_Id"],
      raw: true,
    });

    const excludedPoIds = grnPoIds.map((g) => g.po_Id);
    const poList = await db.purchase_order.findAll({
      where: {
        vendor_id,
        id: {
          [db.Sequelize.Op.notIn]: excludedPoIds,
        },
      },
      include: [
        {
          model: db.createShippingAlert,
          as: "shippingAlerts",
          required: true,
          where: {
            audit: {
              [db.Sequelize.Op.ne]: "OUT_FOR_DELIVERY",
            },
          },
        },
        {
          model: db.purchase_order_item,
          include: [
            {
              model: db.grnItem,
            },
            {
              model: db.ItemMaster,
              include: {
                model: db.asset,
              },
            },
          ],
        },
      ],
    });

    return res.status(200).send({ code: 200, data: poList });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.get_po_vendor_Data = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    if (!vendor_id) {
      return res
        .status(400)
        .send({ code: 400, message: "vendor_id is required" });
    }
    const grnPoIds = await db.grnMaster.findAll({
      attributes: ["po_Id"],
      raw: true,
    });

    const excludedPoIds = grnPoIds.map((g) => g.po_Id);
    const poList = await db.purchase_order.findAll({
      where: {
        vendor_id,
        id: {
          [db.Sequelize.Op.notIn]: excludedPoIds,
        },
      },
      include: [
        {
          model: db.purchase_order_item,
          include: [
            {
              model: db.grnItem,
            },
            {
              model: db.ItemMaster,
              include: {
                model: db.asset,
              },
            },
          ],
        },
      ],
    });

    return res.status(200).send({ code: 200, data: poList });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.create_final_GRN = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    let createdGRN;
    let {
      po_Id,
      financial_year_id,
      entity_id,
      vendor_id,
      promotional_details,
      advance_payment,
      grn_date,
      invoiceNo,
      total_amount,
      warehouse_id,
      shelf_id,
      section_id,
      row_id,
      invoiceDate,
      grnStatus,
      invoiceDoc,
      item,
      grn_number,
      po_category_type,
      employee_id,
      shiping_id,
      version_id,
      uses_id,
      chargesDetailList,
      status,
    } = req.body;

    // For Asset
    let {
      branch_id,
      asset_status_id,
      depreciationMethod,
      purchase_date,
      depreciation_by,
      gst,
      item_use_date,
      asset_type,
      depreciation_rate,
      useful_life_days,
      frequency,
      use_full_life,
      goodInventoryStatus,
    } = req.body;

    const poData = await db.purchase_order.findOne({
      where: { id: po_Id },
      transaction,
    });

    const grnExists = await db.grnMaster.findOne({
      where: { invoiceNo: invoiceNo || 0 },
      transaction,
    });

    if (grnExists) {
      return res
        .status(409)
        .send({ code: 409, message: "Invoice No Already Exists" });
    }

    // Helper: compute and update per-PO discardStatus & purchase_order logic (based on reference API)
    const finalizePoLogic = async (
      poId,
      currentVersionId,
      createdGrnId,
      itemsForPo,
    ) => {
      // itemsForPo = array of items belonging to this PO (as passed from request)
      // currentVersionId = the version.id we created for this GRN (createVersion.id)
      // version_id (from req.body) used in some updates like reference code

      // CASE A: If items come with status not 'po-list' (reference handled this as one branch)
      if (status !== 0) {
        // Fix 1: safe numeric compare
        const allItemsMatch = item.every(
          (singleItem) =>
            (singleItem.remaining_qty ?? 0) == (singleItem.reject_qty ?? 0),
        );

        const rejectMatch = itemsForPo.every(
          (singleItem) => (singleItem.rejectQty ?? 0) != 0,
        );
        // ====== If all items match (full closed) =====================================
        if (allItemsMatch) {
          // Update current version
          if (rejectMatch) {
            await db.grnMaster.update(
              {
                // invoice_status: "COMPLETED",
                discardStatus: "OPEN",
                version_status: "COMPLETED",
              },
              {
                where: { po_Id: poId, version_id: currentVersionId },
                transaction,
              },
            );
          } else {
            await db.grnMaster.update(
              {
                // invoice_status: "COMPLETED",
                discardStatus: "CLOSED",
              },
              {
                where: { po_Id: poId, version_id: currentVersionId },
                transaction,
              },
            );
          }

          // Update referenced version
          if (version_id) {
            await db.grnMaster.update(
              {
                // invoice_status: "COMPLETED",
                discardStatus: "CLOSED",
              },
              { where: { po_Id: poId, version_id: version_id }, transaction },
            );
          }

          // ===== Recalculate full GRN received (using DB — not itemsForPo) ==========
          const [[grnReceived = {}]] = await db.sequelize.query(
            `
      SELECT SUM(GI.receiveQty) AS totalReceived
      FROM GRN_MASTER G
      INNER JOIN GRN_ITEM GI ON GI.grn_Id = G.id
      WHERE G.po_Id = ${poId}
      `,
            { transaction },
          );

          const [[grnRejected = {}]] = await db.sequelize.query(
            `
      SELECT SUM(GI.rejectQty) AS totalRejected
      FROM GRN_MASTER G
      INNER JOIN GRN_ITEM GI ON GI.grn_Id = G.id
      WHERE G.po_Id = ${poId} AND G.discardStatus = 'DISCARDED'
      `,
            { transaction },
          );

          const [[poTotal = {}]] = await db.sequelize.query(
            `
      SELECT SUM(quantity) AS totalOrdered
      FROM PROCUREMENT_PURCHASE_ORDER_ITEM
      WHERE purchase_order_id = ${poId}
      `,
            { transaction },
          );

          const receivedQty = Number(grnReceived.totalReceived || 0);
          const rejectedQty = Number(grnRejected.totalRejected || 0);
          const orderedQty = Number(poTotal.totalOrdered || 0);

          // ====== Full Complete Logic FIXED ==========================================
          if (receivedQty + rejectedQty === orderedQty) {
            await db.purchase_order.update(
              { grn_status: "APPROVED" },
              { where: { id: poId }, transaction },
            );
          }
        }

        // ===== Not all items match: still close reference version only ==============
        else {
          if (version_id) {
            await db.grnMaster.update(
              {
                // invoice_status: "COMPLETED",
                discardStatus: "CLOSED",
              },
              { where: { po_Id: poId, version_id: version_id }, transaction },
            );
          }
        }
      } else {
        // CASE B: items status == 'po-list' branch (or default branch in reference)
        // Use matching logic with final_reject and rejectQty presence
        const allItemsMatch = itemsForPo.every(
          (singleItem) =>
            (singleItem.remaining_qty ?? 0) == (singleItem.final_reject ?? 0),
        );
        const rejectMatch = itemsForPo.every(
          (singleItem) => (singleItem.rejectQty ?? 0) != 0,
        );

        if (allItemsMatch) {
          // if every item has some rejectQty -> OPEN discardStatus else CLOSED
          if (rejectMatch) {
            await db.grnMaster.update(
              {
                // invoice_status: "COMPLETED",
                discardStatus: "OPEN",
                version_status: "COMPLETED",
              },
              {
                where: { po_Id: poId, version_id: currentVersionId },
                transaction,
              },
            );
          } else {
            await db.grnMaster.update(
              {
                // invoice_status: "COMPLETED",
                discardStatus: "CLOSED",
                version_status: "COMPLETED",
              },
              {
                where: { po_Id: poId, version_id: currentVersionId },
                transaction,
              },
            );
          }

          // ensure previous version (if provided) is CLOSED too (as in reference)
          if (version_id) {
            await db.grnMaster.update(
              {
                // invoice_status: "COMPLETED",
                discardStatus: "CLOSED",
                version_status: "COMPLETED",
              },
              { where: { po_Id: poId, version_id: version_id }, transaction },
            );
          }

          // compute sums and possibly approve PO
          const [allGrnExist] = await db.sequelize.query(
            `SELECT SUM(GI.receiveQty) AS qty, G.po_Id
                         FROM GRN_MASTER AS G
                         INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
                         WHERE G.po_Id = ${poId}
                         GROUP BY G.po_Id`,
            { transaction },
          );

          const [allGrnExistClosed] = await db.sequelize.query(
            `SELECT SUM(GI.rejectQty) AS reject, G.po_Id
                         FROM GRN_MASTER AS G
                         INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
                         WHERE G.po_Id = ${poId} AND G.discardStatus = 'DISCARDED'
                         GROUP BY G.po_Id`,
            { transaction },
          );

          let closedCount = 0;
          if (allGrnExistClosed.length != 0) {
            closedCount = allGrnExistClosed[0].reject;
          }

          const [dataList] = await db.sequelize.query(
            `SELECT SUM(A.quantity) AS qty, A.purchase_order_id
                         FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS A
                         WHERE A.purchase_order_id = ${poId}
                         GROUP BY purchase_order_id`,
            { transaction },
          );

          const count = itemsForPo.reduce(
            (acc, i) => acc + (parseInt(i.receiveQty) || 0),
            0,
          );

          if (allGrnExist.length && dataList.length) {
            if (
              parseInt(allGrnExist[0].qty) + count + parseInt(closedCount) ==
              parseInt(dataList[0].qty)
            ) {
              await db.purchase_order.update(
                { grn_status: "APPROVED" },
                { where: { id: poId }, transaction },
              );
            }
          }
        } else {
          // not allItemsMatch in this branch -> mark version_status completed for previous version
          if (version_id) {
            await db.grnMaster.update(
              { version_status: "COMPLETED" },
              { where: { po_Id: poId, version_id: version_id }, transaction },
            );
          }
        }
      }
    };

    // main flow: handle array of po_Id or single po_Id
    if (Array.isArray(po_Id)) {
      for (let idx = 0; idx < po_Id.length; idx++) {
        const curPoId = po_Id[idx];

        // Create version
        const versionCount = await db.grnVersion.count({
          where: { po_id: curPoId },
          transaction,
        });

        const nextVersion = `V${versionCount + 1}`;

        const newVersion = await db.grnVersion.create(
          { version: nextVersion, po_id: curPoId },
          // { transaction }
        );

        const curPoData = await db.purchase_order.findOne({
          where: { id: curPoId },
          transaction,
        });

        // Create GRN Master (same as single PO)
        createdGRN = await db.grnMaster.create(
          {
            grn_number,
            advance_payment,
            invoiceNo,
            grn_date,
            total_amount,
            invoiceDate,
            warehouse_id,
            shelf_id,
            section_id,
            row_id,
            vendor_id,
            branch_id: branch_id || curPoData?.billing_address_id,
            asset_status_id,
            purchase_date,
            gst,
            item_use_date,
            asset_type,
            depreciation_rate,
            useful_life_days,
            frequency,
            use_full_life,
            goodInventoryStatus,
            grnStatus: "COMPLETED",
            po_Id: curPoId,
            uses_id,
            invoiceDoc,
            shiping_id,
            po_category_type,
            financial_year_id,
            entity_id,
            employee_id,
            version_id: newVersion.id,
          },
          { transaction },
        );

        // Items for this PO only
        const itemsForCurrentPO = item.filter((it) => it.po_id == curPoId);

        // Update GRN items (same as single PO)
        await Promise.all(
          itemsForCurrentPO.map(async (singleItem) => {
            const { receiveQty, rejectQty, po_qty, item_id, po_item_id } =
              singleItem;

            await db.grnItem.update(
              {
                po_qty,
                receiveQty,
                rejectQty,
                // invoice_status: "COMPLETED",
                grn_Id: createdGRN.id,
                version_id: newVersion.id,
              },
              {
                where: {
                  item_id: item_id,
                  po_item_id: po_item_id,
                  invoice_status: "PENDING",
                },
                transaction,
              },
            );
          }),
        );

        // FULLY RECEIVED CHECK (same as single PO logic)
        const [[{ fullyReceived } = { fullyReceived: 0 }]] =
          await db.sequelize.query(
            `
      SELECT 
        CASE 
          WHEN SUM(A.quantity) = (
            SELECT COALESCE(SUM(GI.receiveQty), 0)
            FROM GRN_MASTER AS G
            INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = G.id
            WHERE G.po_Id = ${curPoId}
          )
          THEN 1 ELSE 0 
        END AS fullyReceived
      FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS A
      WHERE A.purchase_order_id = ${curPoId};
    `,
            { transaction },
          );

        if (fullyReceived === 1) {
          // All PO qty received
          await db.grnMaster.update(
            {
              grnStatus: "COMPLETED",
              version_status: "COMPLETED",
            },
            { where: { id: createdGRN.id }, transaction },
          );

          await db.purchase_order.update(
            { grn_status: "APPROVED" },
            { where: { id: curPoId }, transaction },
          );
        } else {
          // Partial – still completed GRN, PO stays pending
          await db.grnMaster.update(
            {
              grnStatus: "COMPLETED",
              version_status: "COMPLETED",
            },
            { where: { id: createdGRN.id }, transaction },
          );

          await db.purchase_order.update(
            { grn_status: "PENDING" },
            { where: { id: curPoId }, transaction },
          );
        }

        // Apply discard & final PO update logic (same as single PO)
        await finalizePoLogic(
          curPoId,
          newVersion.id,
          createdGRN.id,
          itemsForCurrentPO,
        );

        await db.financial_And_Account_Journal_List.create(
          {
            debit_amount: total_amount,
            credit_amount: 0.0,
            entry_status: "GRN ENtry",
            document_number: grn_number,
            chart_account_id: 144,
            financial_id: financial_year_id,
            entity_id,
          },
          { transaction },
        );
        await db.financial_And_Account_Journal_List.create(
          {
            debit_amount: 0.0,
            credit_amount: total_amount,
            entry_status: "GRN ENtry",
            document_number: grn_number,
            financial_id: financial_year_id,
            chart_account_id: 393,
            party_type: "VENDOR",
            vendor_id,
            entity_id,
          },
          { transaction },
        );
      }

      // Commit after all POs done
      await transaction.commit();
      return res.status(201).send({
        code: 201,
        message: "GRN Created Successfully for all POs",
        data: createdGRN,
      });
    } else {
      // single PO flow
      const versionCount = await db.grnVersion.count({
        where: { po_id: po_Id },
        transaction,
      });
      const nextVersion = `V${versionCount + 1}`;

      const newVersion = await db.grnVersion.create(
        { version: nextVersion, po_id: po_Id },
        { transaction },
      );

      const poData = await db.purchase_order.findOne({
        where: { id: po_Id },
        transaction,
      });

      createdGRN = await db.grnMaster.create(
        {
          grn_number,
          advance_payment,
          invoiceNo,
          grn_date,
          total_amount,
          invoiceDate,
          warehouse_id,
          shiping_id,
          vendor_id,
          branch_id: branch_id || poData?.billing_address_id,
          asset_status_id,
          purchase_date,
          gst,
          item_use_date,
          asset_type,
          depreciation_rate,
          useful_life_days,
          frequency,
          use_full_life,
          goodInventoryStatus,
          grnStatus: "COMPLETED",
          po_Id: po_Id,
          uses_id,
          invoiceDoc,
          po_category_type,
          financial_year_id,
          entity_id,
          employee_id,
          version_id: newVersion.id,
        },
        { transaction },
      );

      // ✅ Update GRN items for this GRN
      await Promise.all(
        item.map(async (singleItem) => {
          const { receiveQty, rejectQty, po_qty, item_id, po_item_id } =
            singleItem;
          await db.grnItem.update(
            {
              po_qty,
              receiveQty,
              rejectQty,
              invoice_status: "COMPLETED",
              grn_Id: createdGRN.id,
              version_id: newVersion.id,
            },
            {
              where: {
                item_id: item_id,
                po_item_id: po_item_id,
                invoice_status: "PENDING",
              },
              transaction,
            },
          );
        }),
      );

      // ✅ Step 1: Check from DB if all PO items are fully received across all GRNs
      const [[{ fullyReceived } = { fullyReceived: 0 }]] =
        await db.sequelize.query(
          `
  SELECT 
    CASE 
      WHEN SUM(A.quantity) = (
        SELECT COALESCE(SUM(GI.receiveQty), 0)
        FROM GRN_MASTER AS G
        INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = G.id
        WHERE G.po_Id = ${po_Id}
      )
      THEN 1 ELSE 0 
    END AS fullyReceived
  FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS A
  WHERE A.purchase_order_id = ${po_Id};
`,
          { transaction },
        );

      // ✅ Step 2: If all quantities match, update GRN Master and Purchase Order
      if (fullyReceived === 1) {
        // All PO items fully received → mark completed + approve PO
        await db.grnMaster.update(
          {
            grnStatus: "COMPLETED",
            version_status: "COMPLETED",
          },
          { where: { id: createdGRN.id }, transaction },
        );

        await db.purchase_order.update(
          { grn_status: "APPROVED" },
          { where: { id: po_Id }, transaction },
        );
      } else {
        // Partial receipt → mark GRN partial, keep PO pending
        await db.grnMaster.update(
          {
            grnStatus: "COMPLETED",
            version_status: "COMPLETED",
          },
          { where: { id: createdGRN.id }, transaction },
        );
        await db.purchase_order.update(
          { grn_status: "PENDING" },
          { where: { id: po_Id }, transaction },
        );
      }

      await finalizePoLogic(po_Id, newVersion.id, createdGRN.id, item);
      await db.financial_And_Account_Journal_List.create(
        {
          debit_amount: total_amount,
          credit_amount: 0.0,
          entry_status: "GRN ENtry",
          document_number: grn_number,
          chart_account_id: 144,
          financial_id: financial_year_id,
          entity_id,
        },
        { transaction },
      );
      await db.financial_And_Account_Journal_List.create(
        {
          debit_amount: 0.0,
          credit_amount: total_amount,
          entry_status: "GRN ENtry",
          document_number: grn_number,
          financial_id: financial_year_id,
          chart_account_id: 393,
          party_type: "VENDOR",
          vendor_id,
          entity_id,
        },
        { transaction },
      );

      await transaction.commit();
      return res.status(201).send({
        code: 201,
        message: "GRN Created Successfully",
        data: createdGRN,
      });
    }
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error: ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.bulkUploadSBExcel = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    let { grn_item_data } = req.body;

    // CHECK ALL SERIAL NUMBERS BEFORE PROCESSING
    const allSerialNumbers = [];
    for (const item of grn_item_data) {
      if (item.manageBy === "S.No. Only" && item.serialNo) {
        const serial = String(item.serialNo).trim();

        if (serial) {
          allSerialNumbers.push(serial);
        }
      }
    }

    // DUPLICATE SERIALS INSIDE REQUEST
    const serialCountMap = new Map();
    for (const serial of allSerialNumbers) {
      const key = serial.toLowerCase();

      serialCountMap.set(key, (serialCountMap.get(key) || 0) + 1);
    }

    const requestDuplicateSerials = [...serialCountMap.entries()]
      .filter(([_, count]) => count > 1)
      .map(([serial]) => serial);

    // IF EXCEL DUPLICATE FOUND -> RETURN
    if (requestDuplicateSerials.length > 0) {
      await transaction.rollback();
      const duplicateSerials = requestDuplicateSerials.slice(0, 5);

      return res.status(400).send({
        code: 400,
        message:
          `Duplicate Serial Numbers found (${duplicateSerials.join(", ")}). ` +
          `Total duplicates: ${requestDuplicateSerials.length}.`,
        duplicateCount: requestDuplicateSerials.length,
        duplicateSerials,
      });
    }

    // CHECK SERIALS FROM DATABASE
    const uniqueSerials = [
      ...new Set(allSerialNumbers.map((serial) => serial.toLowerCase())),
    ];

    let dbDuplicateSerials = [];
    if (uniqueSerials.length > 0) {
      const existingRows = await db.grnItemStatus.findAll({
        where: db.Sequelize.where(
          db.Sequelize.fn("LOWER", db.Sequelize.col("itemSerialNo")),
          {
            [Op.in]: uniqueSerials,
          },
        ),
        attributes: ["itemSerialNo"],
        transaction,
      });

      const existingSerialSet = new Set(
        existingRows.map((row) => String(row.itemSerialNo).toLowerCase()),
      );

      dbDuplicateSerials = uniqueSerials.filter((serial) =>
        existingSerialSet.has(serial),
      );
    }

    // IF DB DUPLICATE FOUND -> RETURN
    if (dbDuplicateSerials.length > 0) {
      await transaction.rollback();
      const duplicateSerials = dbDuplicateSerials.slice(0, 5);

      return res.status(400).send({
        code: 400,
        message:
          `Duplicate Serial Numbers found (${duplicateSerials.join(", ")}). ` +
          `Total duplicates: ${duplicateSerials.length}.`,
        duplicateCount: dbDuplicateSerials.length,
        duplicateSerials,
      });
    }

    // GET LAST BATCH ONLY ONCE
    const lastBatch = await db.grnItemStatus.findOne({
      where: {
        batchNo: {
          [Op.like]: "BN%",
        },
      },
      order: [["id", "DESC"]],
      attributes: ["batchNo"],
      transaction,
    });

    let nextBatchNumber = 1;

    if (lastBatch?.batchNo) {
      const lastNumber = parseInt(lastBatch.batchNo.replace("BN", ""), 10);

      if (!isNaN(lastNumber)) {
        nextBatchNumber = lastNumber + 1;
      }
    }

    // GROUP SAME ITEM
    const groupedItems = new Map();

    for (const item of grn_item_data) {
      const key = `${item.po_item_id || ""}_${item.item_id}_${item.manageBy}`;

      if (!groupedItems.has(key)) {
        groupedItems.set(key, {
          ...item,
          serialRows: [],
        });
      }

      const group = groupedItems.get(key);

      if (item.manageBy === "S.No. Only") {
        group.serialRows.push(item);
      }
    }

    // PROCESS ITEM
    for (const [, item] of groupedItems) {
      if (item.manageBy === "S.No. Only") {
        const serialRows = item.serialRows || [];
        let receiveQty = 0;
        let rejectQty = 0;

        // CALCULATE SELECTED / REJECTED / NOT RECEIVED
        for (const serial of serialRows) {
          const status = serial.status;

          if (status === "SELECTED") {
            receiveQty++;
          } else if (status === "REJECTED" || status === "NOT RECEIVED") {
            rejectQty++;
          }
        }

        // CREATE ONE BATCH FOR THIS ITEM
        const batchNo = `BN${String(nextBatchNumber).padStart(4, "0")}`;
        nextBatchNumber++;

        // CREATE ONE GRN ITEM
        const createdData = await db.grnItem.create(
          {
            po_item_id: item.po_item_id || null,
            receiveQty,
            amount: item.amount || 0,
            total_mvp: item.total_mvp || 0,
            rejectQty,
            po_qty: item.po_qty,
            asset_id: item.item_category_id,
            item_id: item.item_id,
            selection_item: receiveQty,
          },
          {
            transaction,
          },
        );

        // CREATE STATUS FOR EVERY SERIAL - SAME BATCH NUMBER
        for (const serial of serialRows) {
          const status = serial.status;

          await db.grnItemStatus.create(
            {
              grn_item_id: createdData.id,
              batchType: item.manageBy,
              batchNo,
              expiryDate: item.expiryDate || null,
              Item_name: item.itemName,
              po_item_id: item.po_item_id || null,
              item_id: item.item_id,
              itemSerialNo: serial.serialNo
                ? String(serial.serialNo).trim()
                : null,
              itemStatus: status,
            },
            {
              transaction,
            },
          );
        }
      } else if (item.manageBy === "Batch Only") {
        const qty = Number(item.qty || 0);

        let receiveQty = 0;
        let rejectQty = 0;

        if (item.status === "SELECTED") {
          receiveQty = qty;
          rejectQty = 0;
        } else {
          receiveQty = 0;
          rejectQty = qty;
        }

        const batchNo = `BN${String(nextBatchNumber).padStart(4, "0")}`;
        nextBatchNumber++;

        // CREATE ONE GRN ITEM
        const createdData = await db.grnItem.create(
          {
            po_item_id: item.po_item_id || null,
            receiveQty,
            amount: item.amount || 0,
            total_mvp: item.total_mvp || 0,
            rejectQty,
            po_qty: item.po_qty,
            asset_id: item.item_category_id,
            item_id: item.item_id,
            selection_item: receiveQty,
          },
          {
            transaction,
          },
        );

        // CREATE ONE STATUS
        await db.grnItemStatus.create(
          {
            grn_item_id: createdData.id,
            batchType: item.manageBy,
            batchNo,
            expiryDate: item.expiryDate || null,
            Item_name: item.itemName,
            po_item_id: item.po_item_id || null,
            item_id: item.item_id,
            itemStatus: item.status,
          },
          {
            transaction,
          },
        );
      } else {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: `Invalid manageBy '${item.manageBy}' for item ${item.itemName || item.item_id}`,
        });
      }
    }

    // COMMIT
    await transaction.commit();
    return res.status(200).send({
      code: 200,
      message: "Serial numbers validated successfully.",
      duplicateCount: 0,
    });
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};
