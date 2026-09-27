const mailQueue = require("../../../CRM/utils/mail/mailQueue");
const db = require("../../../models/index");

exports.getPoWithVendorDetails = async (req, res) => {
  try {
    const { po_id } = req.params;
    let poDetails = await db.purchase_order.findOne({
      where: { id: po_id },
      include: [
        {
          model: db.currency_convert,
        },
        {
          model: db.vendor_basic_details,
          include: [
            {
              model: db.currency_convert,
            },
          ],
        },
        {
          model: db.purchase_order_item,
          include: [
            {
              model: db.ItemMaster,
            },
          ],
        },
        {
          model: db.portMaster,
        },
        {
          model: db.warehouse,
          include: [
            {
              model: db.locationMaster,
              include: [
                {
                  model: db.city,
                },
              ],
            },
          ],
        },
      ],
    });

    const allShippingAlerts = await db.createShippingAlert.findAll({
      where: { po_id, buyer_status: "APPROVED" },
      include: [{ model: db.shippingAlertItems, as: "items" }],
    });
    const poData = poDetails.get({ plain: true });
    poData.PROCUREMENT_PURCHASE_ORDER_ITEMs.forEach((poItem) => {
      const totalShipped = allShippingAlerts.reduce((acc, alert) => {
        const matchingItem = alert.items.find(
          (shipItem) => shipItem.po_item_id === poItem.id,
        );
        return acc + (matchingItem ? Number(matchingItem.quantity) : 0);
      }, 0);

      poItem.shipped_quantity = totalShipped;
      poItem.remaining_quantity = Math.max(
        0,
        Number(poItem.quantity) - totalShipped,
      );
    });
    if (!poDetails) {
      return res
        .status(200)
        .send({ code: 200, message: "PO details not found" });
    }
    return res
      .status(200)
      .send({ code: 200, message: "PO details found", data: poData });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error" });
  }
};

async function generateShippingAlertNo() {
  const lastRecord = await db.createShippingAlert.findOne({
    attributes: ["shiped_no"],
    order: [["shiped_no", "DESC"]],
  });

  let newNumber = 1;

  if (lastRecord && lastRecord.shiped_no) {
    const lastNumber = parseInt(lastRecord.shiped_no.replace("SA", ""), 10);
    newNumber = lastNumber + 1;
  }

  const shiped_no = `SA${String(newNumber).padStart(3, "0")}`;

  return shiped_no;
}
exports.createShippingAlert = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const documentTypes = [
      "transportDocument",
      "packingList",
      "otherDocument",
      "invoice",
    ];

    const {
      mode,
      shipment_date,
      invoice_no,
      invoice_date,
      expected_arrival,
      po_id,
      vendor_id,
      items,
      terms_condition,
      documents,
      port_id,
      invoice_amount,
      departure_location,
    } = req.body;
    const road = req.body.road || {};
    const air = req.body.air || {};
    const rail = req.body.rail || {};
    const sea = req.body.sea || {};
    const courier = req.body.courier || {};
    const shiped_no = await generateShippingAlertNo();
    if (!shipment_date || !expected_arrival || !mode) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing required shipment fields" });
    }
    const isExistInvoice = await db.createShippingAlert.findOne({
      where: { invoice_no },
    });
    if (isExistInvoice) {
      return res
        .status(400)
        .send({
          code: 400,
          message:
            "Invoice number already exists. Please try another invoice number.",
        });
    }
    const createShipping = await db.createShippingAlert.create(
      {
        mode,
        shipment_date,
        expected_arrival,
        po_id,
        vendor_id,
        invoice_no,
        invoice_date,
        shiped_no,
        terms_condition,
        port_id,
        invoice_amount,
        departure_location,
      },
      { transaction },
    );

    for (const type of documentTypes) {
      if (documents[type]) {
        const files = documents[type];
        for (const element of files) {
          await db.shippingAlertDocuments.create(
            {
              document_type: type,
              shipping_alert_id: createShipping.id,
              document_name: element,
            },
            { transaction },
          );
        }
      }
    }

    if (createShipping) {
      if (items && items.length > 0) {
        const itemPromises = items.map((item) => {
          return db.shippingAlertItems.create(
            {
              quantity: item.this_shipment,
              po_item_id: item.po_item_id,
              item_master_id: item.item_master_id,
              shipping_alert_id: createShipping.id,
              claim_qty: item.this_shipment,
            },
            { transaction },
          );
        });
        await Promise.all(itemPromises);
      }

      if (mode === "ROAD") {
        await db.shippingTransportModeRoad.create(
          {
            ...road,
            shipping_alert_id: createShipping.id,
          },
          { transaction },
        );
      } else if (mode === "AIR") {
        await db.shippingTransportModeAir.create(
          {
            ...air,
            shipping_alert_id: createShipping.id,
          },
          { transaction },
        );
      } else if (mode === "RAIL") {
        await db.shippingTransportModeRail.create(
          {
            ...rail,
            shipping_alert_id: createShipping.id,
          },
          { transaction },
        );
      } else if (mode === "SEA") {
        await db.shippingTransportModeSea.create(
          {
            ...sea,
            shipping_alert_id: createShipping.id,
          },
          { transaction },
        );
      } else if (mode === "COURIER") {
        await db.shippingTransportModeCourier.create(
          {
            ...courier,
            shipping_alert_id: createShipping.id,
          },
          { transaction },
        );
      }
    }

    await db.shippingAlertHistory.create(
      {
        shipping_alert_id: createShipping.id,
        shipped_status: createShipping.audit,
      },
      { transaction },
    );
    const vendorDetails = await db.vendor_basic_details.findOne({
      where: { id: vendor_id },
    });
    const poDetails = await db.purchase_order.findOne({ where: { id: po_id } });
    const link = `${req.headers.origin}/approved-shipping-alert?po_id=${po_id}&vendor_id=${vendor_id}&type=history`;

    await mailQueue.add({
      type: "SHIPPING_ALERT_HISTORY_LINK",
      vendor_email: vendorDetails.vendor_email,
      vendor_name: vendorDetails.vendor_name,
      link,
      entity_id: poDetails.entity_id,
      po_number: poDetails.po_number,
    });
    await transaction.commit();

    return res
      .status(200)
      .send({ code: 200, message: "Shipping alert created successfully" });
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
};

exports.getsShippingAlert = async (req, res) => {
  try {
    const { status } = req.query;
    let whereCondition = {};
    if (status && status !== "All") {
      whereCondition.buyer_status = status;
    }

    let shippingAlert = await db.createShippingAlert.findAll({
      where: whereCondition,
      include: [
        {
          model: db.purchase_order,
          as: "purchaseOrder",
          attributes: ["po_number"],
        },
        {
          model: db.vendor_basic_details,
          as: "vendor",
          attributes: ["vendor_name", "vendor_category"],
        },
      ],
      order: [["id", "DESC"]],
    });
    if (!shippingAlert.length) {
      return res
        .status(400)
        .send({ code: 400, message: "Shipping alert not found!" });
    }

    const plainAlerts = shippingAlert.map((alert) =>
      alert.get({ plain: true }),
    );
    const flattenedAlerts = plainAlerts.map((x) => ({
      ...x,
      po_number: x.purchaseOrder?.po_number,
      vendor_name: x.vendor?.vendor_name,
      vendor_category: x.vendor?.vendor_category,
    }));

    return res.status(200).send({ code: 200, data: flattenedAlerts });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
};

exports.getsShippingAlertHistory = async (req, res) => {
  try {
    const { po_id, vendor_id } = req.query;
    let shippingAlert = await db.createShippingAlert.findAll({
      where: { po_id, vendor_id },
      include: [
        {
          model: db.purchase_order,
          as: "purchaseOrder",
          attributes: ["po_number"],
        },
        {
          model: db.vendor_basic_details,
          as: "vendor",
          attributes: ["vendor_name", "vendor_category"],
        },
      ],
    });
    if (!shippingAlert.length) {
      return res
        .status(400)
        .send({ code: 400, message: "Shipping alert not found!" });
    }

    const plainAlerts = shippingAlert.map((alert) =>
      alert.get({ plain: true }),
    );
    const flattenedAlerts = plainAlerts.map((x) => ({
      ...x,
      po_number: x.purchaseOrder?.po_number,
      vendor_name: x.vendor?.vendor_name,
      vendor_category: x.vendor?.vendor_category,
    }));

    return res.status(200).send({ code: 200, data: flattenedAlerts });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
};
exports.getShippingAlertHistory = async (req, res) => {
  try {
    const { id } = req.params;
    let shippingAlert = await db.createShippingAlert.findOne({
      where: { id },
      include: [
        {
          model: db.purchase_order,
          as: "purchaseOrder",
          attributes: ["po_number", "currency_id"],
          include: [
            {
              model: db.currency_convert,
            },
          ],
        },
        {
          model: db.vendor_basic_details,
          as: "vendor",
          attributes: ["vendor_name", "vendor_category","advance_amount"],
        },
        {
          model: db.shippingAlertItems,
          include: [
            {
              model: db.ItemMaster,
              as: "itemMaster",
            },
            {
              model: db.purchase_order_item,
              as: "poItem",
            },
          ],

          as: "items",
        },
        {
          model: db.shippingTransportModeRail,
          as: "railDetails",
        },
        {
          model: db.shippingTransportModeRoad,
          as: "roadDetails",
          attributes: [
            "vehicle_number",
            "driver_name",
            "driver_mobile",
            "transporter_name",
            "lr_number",
          ],
        },
        {
          model: db.shippingTransportModeSea,
          as: "seaDetails",
        },
        {
          model: db.shippingTransportModeAir,
          as: "airDetails",
        },
        {
          model: db.shippingTransportModeCourier,
          as: "courierDetails",
          attributes: [
            "courier_name",
            "awb_number",
            "tracking_url",
            "remarks",
          ],
        },
        {
          model: db.shippingAlertHistory,
          as: "shippingAlertHistory",
          separate: true,
          include: [
            {
              model: db.user,
              as: "userDetail",
            },
          ],
          // order: [['createdAt', 'DESC']]
        },
        {
          model: db.shippingAlertDocuments,
          as: "documents",
        },
      ],
    });
    if (!shippingAlert) {
      return res
        .status(400)
        .send({ code: 400, message: "Shipping alert not found!" });
    }
    const [shippedItemDetails] = await db.sequelize.query(`
            SELECT SAI.po_item_id,SUM(SAI.quantity) AS vendor_shipped_quantity, SUM(SAI.claim_qty) AS claim_qty 
            FROM SHIPPING_ALERT_SCHEDULE AS SAS  
            INNER JOIN SHIPPING_ALERT_ITEMS AS SAI
            ON SAS.id = SAI.shipping_alert_id
            WHERE SAS.buyer_status = 'PENDING' AND SAS.po_id = ${shippingAlert.po_id}
            GROUP BY SAI.po_item_id`);

    const plainAlert = shippingAlert.get({ plain: true });
    const shippedMap = {};
    shippedItemDetails.forEach((row) => {
      shippedMap[row.po_item_id] = row;
    });

    plainAlert.items = plainAlert.items.map((item) => {
      const row = shippedMap[item.po_item_id];

      return {
        ...item,
        vendor_shiped_qty: row ? Number(row.vendor_shipped_quantity) : 0,
        claim_qty: row ? Number(row.claim_qty) : 0,
      };
    });
    const response = {
      ...plainAlert,
      po_number: plainAlert.purchaseOrder?.po_number,
      vendor_name: plainAlert.vendor?.vendor_name,
      vendor_category: plainAlert.vendor?.vendor_category,

      active_transport_details:
        plainAlert.seaDetails ||
        plainAlert.airDetails ||
        plainAlert.roadDetails ||
        plainAlert.railDetails ||
        plainAlert.courierDetails,
    };
    return res
      .status(200)
      .send({ code: 200, message: "Shipping alert history", data: response });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message:error.message });
  }
};
exports.updateShippingAlertStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id, status } = req.body;

    const shippedData = await db.createShippingAlert.findOne({
      where: { id },
      transaction,
    });

    if (!shippedData) {
      await transaction.rollback();
      return res
        .status(400)
        .send({ code: 400, message: "Shipping alert not found!" });
    }

    await db.createShippingAlert.update(
      { audit: status },
      { where: { id }, transaction },
    );

    await db.shippingAlertHistory.create(
      { shipped_status: status, shipping_alert_id: id },
      { transaction },
    );

    await transaction.commit();

    return res
      .status(200)
      .send({ code: 200, message: "Shipping status updated successfully" });
  } catch (error) {
    await transaction.rollback();

    return res
      .status(500)
      .send({
        code: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

exports.updateBuyerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      buyer_status,
      buyer_remark,
      shipment_type,
      cha_other_charges,
      cha_service_charges,
      freight_charges,
      loading_unloading_charges,
    } = req.body;

    let getdata;
    if (buyer_status === "APPROVED" && shipment_type === "Domestic") {
      [getdata] = await db.createShippingAlert.update(
        {
          buyer_status: buyer_status,
          buyer_remark,
          cha_other_charges,
          cha_service_charges,
          freight_charges,
          loading_unloading_charges,
        },
        {
          where: { id },
        },
      );
    } else {
      [getdata] = await db.createShippingAlert.update(
        {
          buyer_status: buyer_status,
          buyer_remark,
        },
        {
          where: { id },
        },
      );
    }

    if (getdata === 0) {
      return res.status(404).send({ message: "No record found to update." });
    }

    return res
      .status(200)
      .send({
        message: "Shipping alert has been approved by buyer successfully.",
      });
  } catch (error) {
    console.error(`Error ${error.message}`, { error });
    res.status(500).send({ message: "An error occurred. " + error });
  }
};

exports.getVendorDashboard = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    if (!vendor_id) {
      return res.status(400).send({
        code: 400,
        message: "vendor_id is required",
      });
    }

    const query = `

    SELECT 
        COUNT(DISTINCT P.id) AS total_po,
        0 AS return_po,
        (
        SELECT COUNT(DISTINCT VN.id)
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR AS PV ON PV.Purchase_req_id = PR.id
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VN ON VN.purchase_request_id = PR.id
        WHERE PV.vendor_id = :vendor_id
        AND PR.status = 'ACTIVE' AND VN.nego_status = 'LIVE NEGO'
        ) AS live_nego,

        (
        SELECT COUNT(DISTINCT VN.id)
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR AS PV ON PV.Purchase_req_id = PR.id
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VN ON VN.purchase_request_id = PR.id
        WHERE PV.vendor_id = :vendor_id
        AND PR.status = 'ACTIVE' AND VN.nego_status = 'CLOSE NEGO'
        )  AS close_nego,

        (
            SELECT COUNT(DISTINCT PR.id)
            FROM PROCUREMENT_PURCHASE_REQUEST PR
            INNER JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR PV
                ON PV.Purchase_req_id = PR.id
            WHERE PV.vendor_id = :vendor_id
            AND PR.status = 'ACTIVE'
            AND PR.rfp_number IS NOT NULL
            AND PR.rfp_number <> ''
            AND PR.rfp_status = 'LIVE RFP'
        ) AS live_rfp,

        (
            SELECT COUNT(DISTINCT PR.id)
            FROM PROCUREMENT_PURCHASE_REQUEST PR
            INNER JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR PV
                ON PV.Purchase_req_id = PR.id
            WHERE PV.vendor_id = :vendor_id
            AND PR.status = 'ACTIVE'
            AND PR.rfp_number IS NOT NULL
            AND PR.rfp_number <> ''
            AND PR.rfp_status = 'CLOSE RFP'
        ) AS close_rfp,

        /* Completed PO */
        COUNT(
            DISTINCT CASE
                WHEN PO_STATUS.po_status = 'Completed'
                THEN P.id
            END
        ) AS completed_po,

        /* In Progress PO */
        COUNT(
            DISTINCT CASE
                WHEN PO_STATUS.po_status = 'In Progress'
                THEN P.id
            END
        ) AS inprogress_po,

        /* Pending PO */
        COUNT(
            DISTINCT CASE
                WHEN PO_STATUS.po_status = 'Pending'
                THEN P.id
            END
        ) AS pending_po

    FROM PROCUREMENT_PURCHASE_ORDER AS P

    LEFT JOIN (

        SELECT 
            PI.purchase_order_id,

            CASE

                /* Shipping entry hi nahi hai */
                WHEN COUNT(SI.item_master_id) = 0
                THEN 'Pending'

                /* Sab qty match ho gayi */
                WHEN COUNT(*) = SUM(
                    CASE
                        WHEN IFNULL(SI.total_claim_qty, 0) >= PI.quantity
                        THEN 1
                        ELSE 0
                    END
                )
                THEN 'Completed'

                /* Partial / mismatch */
                ELSE 'In Progress'

            END AS po_status

        FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS PI

        LEFT JOIN (

            SELECT
                S.po_id,
                SI.item_master_id,
                SUM(SI.claim_qty) AS total_claim_qty

            FROM SHIPPING_ALERT_SCHEDULE AS S

            INNER JOIN SHIPPING_ALERT_ITEMS AS SI
                ON SI.shipping_alert_id = S.id

            GROUP BY
                S.po_id,
                SI.item_master_id

        ) AS SI

            ON SI.po_id = PI.purchase_order_id
            AND SI.item_master_id = PI.item_master_id

        GROUP BY PI.purchase_order_id

    ) AS PO_STATUS

        ON PO_STATUS.purchase_order_id = P.id

    WHERE P.vendor_id = :vendor_id
    AND P.final_status = 'APPROVED'
    AND P.isDeleted = 0
        `;

    const result = await db.sequelize.query(query, {
      replacements: { vendor_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      data: result[0],
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
};

exports.getPOListForVendor = async (req, res) => {
  try {
    const { vendor_id } = req.query;
    const query = `

            SELECT 
                P.id,
                P.po_number,
                P.po_date,
                P.total_purchase,
                P.po_type,

                CASE

                    /* Shipping entry nahi hai */
                    WHEN COUNT(SI.item_master_id) = 0
                    THEN 'Pending'

                    /* Sab item qty match */
                    WHEN COUNT(*) = SUM(
                        CASE
                            WHEN IFNULL(SI.total_claim_qty, 0) >= PI.quantity
                            THEN 1
                            ELSE 0
                        END
                    )
                    THEN 'Completed'

                    /* Partial qty */
                    ELSE 'In Progress'

                END AS status

            FROM PROCUREMENT_PURCHASE_ORDER AS P

            INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS PI
                ON PI.purchase_order_id = P.id

            LEFT JOIN (

                SELECT
                    S.po_id,
                    SI.item_master_id,
                    SUM(SI.claim_qty) AS total_claim_qty

                FROM SHIPPING_ALERT_SCHEDULE AS S

                INNER JOIN SHIPPING_ALERT_ITEMS AS SI
                    ON SI.shipping_alert_id = S.id

                GROUP BY
                    S.po_id,
                    SI.item_master_id

            ) AS SI

                ON SI.po_id = PI.purchase_order_id
                AND SI.item_master_id = PI.item_master_id

            WHERE P.vendor_id = :vendor_id
            AND P.final_status = 'APPROVED'
            AND P.isDeleted = 0

            GROUP BY 
                P.id,
                P.po_number,
                P.po_date,
                P.total_purchase,
                P.po_type

            ORDER BY P.id DESC
        `;

    const poList = await db.sequelize.query(query, {
      replacements: { vendor_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({ code: 200, data: poList });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
};
