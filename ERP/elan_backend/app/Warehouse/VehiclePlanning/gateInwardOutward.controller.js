const { x } = require("pdfkit");
const db = require("../../models/index");
const moment = require("moment");
const { Op } = require('sequelize');
const fs = require("fs");
const path = require("path");
const { generatePDF } = require("../../common/pdfConverter");
class GateInwardOutwardController {

    constructor() {
        this.commonQuery = this.commonQuery.bind(this);
        this.generateNumber = this.generateNumber.bind(this);
        this.updateStatusTransporter = this.updateStatusTransporter.bind(this);
        this.generateUniqueLR = this.generateUniqueLR.bind(this);
        this.getGateInwardOutwardList = this.getGateInwardOutwardList.bind(this);
        this.updateGateInwardOutward = this.updateGateInwardOutward.bind(this);
        this.getPickList = this.getPickList.bind(this);
        this.updatePickData = this.updatePickData.bind(this);
        this.getLRList = this.getLRList.bind(this);
        this.updateLRData = this.updateLRData.bind(this);
    }

    async commonQuery(condition, req) {
        const organization_id = req.user?.organization_id;

        const query = `
            SELECT 
            MAX(G.id) AS id,
            MAX(G.gate_inward_status) AS gate_inward_status,
            MAX(G.gate_inward_date) AS gate_inward_date,
            MAX(G.gate_outward_status) AS gate_outward_status,
            MAX(G.gate_outward_date) AS gate_outward_date,
            MAX(G.pickList_status) AS pickList_status,
            MAX(G.LR_status) AS LR_status,
            MAX(G.LR_number) AS LR_number,
            MAX(G.vehicle_number) AS vehicle_number,
            MAX(G.driver_name) AS driver_name,
            MAX(G.driver_contact) AS driver_contact,
            MAX(G.vehicle_driver_remark) AS vehicle_driver_remark,
            MAX(G.createdAt) AS createdAt,
            MAX(G.updatedAt) AS updatedAt,
            MAX(G.gateIn_updated_by) AS gateIn_updated_by,
            MAX(G.gateOut_updated_by) AS gateOut_updated_by,
            MAX(G.vehicle_planing_id) AS vehicle_planing_id,
            MAX(G.warehouse_id) AS warehouse_id,
            MAX(P.irn_status) AS irn_status,

            MAX(P.planning_code) AS planning_code,
            MAX(P.vehicle_root_status) AS vehicle_root_status,

            MAX(CONCAT(W.name COLLATE utf8mb4_bin, ' - ' COLLATE utf8mb4_bin, W.code COLLATE utf8mb4_bin)) AS warehouse_name,

            MAX(S.pickup_date) AS pickup_date,
            MAX(S.gate_by_pass) AS gate_by_pass,

            MAX(
                COALESCE(
                    NULLIF(G.driver_name COLLATE utf8mb4_bin, '' COLLATE utf8mb4_bin),
                    CONCAT(D.full_name COLLATE utf8mb4_bin, ' - ' COLLATE utf8mb4_bin, D.driver_code COLLATE utf8mb4_bin)
                )
            ) AS driver_name,

            MAX(
                COALESCE(
                    NULLIF(G.driver_contact COLLATE utf8mb4_bin, '' COLLATE utf8mb4_bin),
                    D.mobile_number COLLATE utf8mb4_bin
                )
            ) AS driver_contact,

            MAX(
                COALESCE(
                    NULLIF(G.vehicle_number COLLATE utf8mb4_bin, '' COLLATE utf8mb4_bin),
                    V.vehicle_number COLLATE utf8mb4_bin
                )
            ) AS vehicle_number,

            MAX(CONCAT(TM.tm_name COLLATE utf8mb4_bin, ' - ' COLLATE utf8mb4_bin, TM.tm_code COLLATE utf8mb4_bin)) AS tm_name,
            IF(
                EXISTS (
                    SELECT 1
                    FROM STOCK_TRANSFER_SERIAL_NEW STSN
                    WHERE STSN.vehicle_planning_id = P.id
                )
                OR EXISTS (
                    SELECT 1
                    FROM STOCK_TRANSFER_NEW STN
                    WHERE STN.vehicle_planning_id = P.id
                ),
                1,
                0
            ) AS mapSerialNoStatus

        FROM WH_VH_PLANNING_GATEIN_OUT AS G        

        INNER JOIN WH_VH_PLANNING_MST AS P 
            ON P.id = G.vehicle_planing_id

        INNER JOIN WAREHOUSE_MASTER AS W 
            ON W.id = G.warehouse_id

        INNER JOIN (
            SELECT planning_id, warehouse_id, MAX(id) AS max_id
            FROM WH_VH_PLANNING_SO
            GROUP BY planning_id, warehouse_id
        ) AS S1
            ON S1.planning_id = P.id
        AND S1.warehouse_id = W.id

        INNER JOIN WH_VH_PLANNING_SO AS S
            ON S.id = S1.max_id

        LEFT JOIN WH_VH_PLANNING_TRANSPORTER AS T 
            ON T.vehicle_planing_id = G.vehicle_planing_id

        LEFT JOIN TM_TRANSPORTER_MASTER AS TM 
            ON TM.id = T.transportor_id

        LEFT JOIN TM_VEHICAL_DRIVER AS D 
            ON D.driver_id = T.driver_id

        LEFT JOIN TM_VEHICLE_MASTER AS V 
            ON V.id = T.vehicle_id

        WHERE 
            P.status = 'Approved'
            AND IF(
                    :organization_id IS NULL,
                    W.organization_id IS NULL,
                    W.organization_id = :organization_id
                )
            ${condition}
        GROUP BY S1.planning_id,S1.warehouse_id
        ORDER BY createdAt DESC;`;

        const result = await db.sequelize.query(query, {
            replacements: { organization_id },
            type: db.Sequelize.QueryTypes.SELECT,
        });
        return result;
    }

    async updateStatusTransporter(id, status) {
        return await db.vehiclePlanningTransporter.update({ trip_status: status }, {
            where: { vehicle_planing_id: id, admin_status: 'ACCEPTED' }
        });
    }

    async generateUniqueLR() {
        let lrNumber;
        let exists = true;

        while (exists) {
            const random = Math.floor(Math.random() * 900) + 100; // 100–999
            lrNumber = `LRN${moment().format("DDMMYY")}${random}`;

            const already = await db.vehicleGateInOutword.findOne({
                where: { LR_number: lrNumber },
                raw: true
            });

            exists = !!already;
        }
        return lrNumber;
    }

    async getGateInwardOutwardList(req, res) {
        try {
            const { type, activeLabel } = req.query;
            let condition = "";

            if (type === "inward" && activeLabel === "inward") {
                condition = `AND G.gate_inward_status = 'Pending'`;
            }
            else if (type === "outward" && activeLabel === "outward") {
                condition = `AND G.gate_outward_status = 'Pending'
                    AND G.pickList_status = 'Approved'
                    AND G.LR_status = 'Approved'
                `;
            }
            else if (type === "approved" && activeLabel === "inward") {
                condition = `AND G.gate_inward_status = 'Approved'`;
            }
            else if (type === "approved" && activeLabel === "outward") {
                condition = `
                    AND G.gate_outward_status = 'Approved'
                    AND G.pickList_status = 'Approved'
                    AND G.LR_status = 'Approved'
                `;
            }

            const result = await this.commonQuery(condition, req);
            return res.status(200).send({ code: 200, message: "Fetch data successfully", data: result });
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Server Error:" + error });
        }
    }

    async generateNumber(fieldName, prefixCode) {
        const year = new Date().getFullYear();
        const prefix = `SL/${prefixCode}/${year}`;

        const lastRecord = await db.vehicleGateInOutword.findOne({
            where: {
                [fieldName]: {
                    [Op.like]: `${prefix}/%`
                }
            },
            order: [['id', 'DESC']]
        });

        let nextNumber = 1;

        if (lastRecord?.[fieldName]) {
            const lastNumber = parseInt(
                lastRecord[fieldName].split('/').pop(),
                10
            );

            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }

        return `${prefix}/${String(nextNumber).padStart(4, '0')}`;
    }

    async updateGateInwardOutward(req, res) {
        try {
            const { id, type, vehicle_planing_id } = req.body;
            let updatedResponse;
            let updateData = {};
            const currentDate = new Date().toISOString();
            const empId = req.user.employee_id;

            if (type === 'inward') {
                const gatePassNumber = await this.generateNumber('gate_pass_number', 'GPN');

                updateData = {
                    gate_inward_status: 'Approved',
                    gate_inward_date: currentDate,
                    gateIn_updated_by: empId,
                    gate_pass_number: gatePassNumber
                };
            } else if (type === 'outward') {
                updateData = {
                    gate_outward_status: 'Approved',
                    gate_outward_date: currentDate,
                    gateOut_updated_by: empId
                };
            }

            updatedResponse = await db.vehicleGateInOutword.update(updateData, { where: { id: id } });

            if (updatedResponse) {
                await this.updateStatusTransporter(vehicle_planing_id, type === 'inward' ? 'AT_WAREHOUSE' : 'DISPATCHED');
                return res.status(200).send({ code: 200, message: "Data updated successfully" });
            } else {
                return res.status(400).send({ code: 400, message: "Update Failed" });
            }

        } catch (error) {
            return res.status(500).send({ code: 500, message: "Server Error", error: error.message });
        }
    }

    async getPickList(req, res) {
        try {
            const type = req.query.type;
            let condition = ` AND G.pickList_status = '${type}' AND G.gate_inward_status = 'Approved'`;
            const result = await this.commonQuery(condition, req);
            return res.status(200).send({ code: 200, message: "Fetch data successfully", data: result });
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Server Error: " + error });
        }
    }

    async updatePickData(req, res) {
        try {
            const { id, vehicle_planing_id } = req.body;
            const packingListNumber = await this.generateNumber('packing_list_number', 'PLN');

            let updatedResponse = await db.vehicleGateInOutword.update(
                { pickList_status: 'Approved', packing_list_number: packingListNumber, packing_list_date: new Date().toISOString(), picklist_updated_by: req.userId },
                { where: { id: id } });
            if (updatedResponse) {
                await this.updateStatusTransporter(vehicle_planing_id, 'AT_WAREHOUSE');
                return res.status(200).send({ code: 200, message: "Data updated successfully" });
            } else {
                return res.status(400).send({ code: 400, message: "Update Failed" });
            }

        } catch (error) {
            return res.status(500).send({ code: 500, message: "Server Error", error: error.message });
        }
    }

    async getLRList(req, res) {
        try {
            const type = req.query.type;
            let condition = ` AND G.LR_status = '${type}' AND G.gate_inward_status = 'Approved' AND G.pickList_status = 'Approved'`;
            const result = await this.commonQuery(condition, req);
            return res.status(200).send({ code: 200, message: "Fetch data successfully", data: result });
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Server Error: " + error });
        }
    }

    async updateLRData(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const loginId = req.user?.employee_id;
            let lrNumber = data.lr_no;

            if (data.generate_lr_no === "AUTO") {
                lrNumber = await this.generateUniqueLR();
            } else if (lrNumber) {
                const exists = await db.vehicleGateInOutword.findOne({
                    where: { LR_number: lrNumber },
                    raw: true
                });

                if (exists) {
                    return res.status(400).json({ message: "Manual LR number already exists!" });
                }
            }

            data.LR_status = 'Approved';
            data.LR_number = lrNumber;
            data.lr_updated_by = req.userId;

            if (data.buttonAction === 'VERIFY') {
                // extra fields remove
                delete data.driver_name;
                delete data.driver_contact;
                delete data.vehicle_number;
            }

            const checkGatePass = await db.vehiclePlanningSo.findOne({
                attributes: [
                    [db.Sequelize.fn('MAX', db.Sequelize.col('gate_by_pass')), 'gate_by_pass']
                ],
                where: {
                    planning_id: data.vehicle_planing_id,
                    warehouse_id: data.warehouse_id
                },
                raw: true
            });

            if (checkGatePass?.gate_by_pass === 'YES') {
                data.gate_outward_status = 'Approved';
                data.gate_outward_date = new Date();
                data.gateOut_updated_by = loginId;
                await this.updateStatusTransporter(data.vehicle_planing_id, 'DISPATCHED');
            }

            const updateData = await db.vehicleGateInOutword.update(data, { where: { id: id } });

            if (!updateData || updateData[0] === 0) {
                return res.status(404).json({ message: "Data not found" });
            }

            return res.status(200).json(data.buttonAction === 'VERIFY'
                ? 'LR Verified Successfully'
                : 'LR Saved & Verified Successfully'
            );
        } catch (error) {
            console.log(error);
            res.status(500).send({ code: 500, message: error.message });
        }
    }

    async getInvoiceList(req, res) {
        try {
            const list = await db.vehiclePlanningMst.findAll({
                where: {
                    status: 'Approved',
                },
                include: [
                    {
                        model: db.vehicleGateInOutword,
                        as: 'vehiclePlaningMst',
                        where: {
                            gate_inward_status: 'Approved',
                            // pickList_status: 'Approved'
                        },
                    },
                    {
                        model: db.vehicleType_master,
                        as: 'vehicleTypeMST',
                        attributes: ['vehicle_type_name']
                    },
                    {
                        model: db.vehiclePlanningTransporter,
                        as: 'transporters',
                        include: [
                            {
                                model: db.transport_master,
                                as: 'transporterDetails'
                            }
                        ]
                    }
                ],
                order: [['id', 'DESC']]
            })
            return res.status(200).send({ code: 200, message: "Fetch data successfully", data: list });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Server Error" });
        }
    }
    async downloadDispatchPickList(req, res) {
        try {
            const vehicle_id = req.params.id;
            const { pdfName } = req.query;

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
                    include: [
                        {
                            model: db.versionData,
                            include: [
                                {
                                    model: db.customerShippingAddress

                                },
                                {
                                    model: db.customerAddress,
                                    include: [
                                        {
                                            model: db.states
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: db.customerProfile
                        },
                        {
                            model: db.salesInvoiceData,
                            as: 'invoices'
                        }
                    ],
                    where: {
                        id: so.sale_order_id
                    },
                    // raw: true
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
                const stateData = await db.states.findOne({
                    where: {
                        states_id:
                            salesOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_state_id
                    }
                });

                if (salesOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST) {
                    salesOrder.CRM_VERSION_PROPOSAL_MST.CUSTOMER_ADDRESS_MST.MASTER_STATE = stateData;
                }

                sale_orders.push({
                    ...salesOrder,
                    pickup_info: {
                        id: so.id,
                        pickup_date: so.pickup_date,
                        priority: so.priority,
                        expected_delivery_date: so.expected_delivery_date,
                        warehouse_name: wh.name,
                        warehouse_gst: wh.gst,
                        warehouse_pan: wh.pan_tin,
                        warehouse_address: wh.address + ', ' + wh.pin,
                        gate_bypass_status: so.gate_by_pass
                    },

                    sale_order_items: saleOrderItems
                });
            }
            const getData = await db.vehicleGateInOutword.findOne({
                where: { vehicle_planing_id: vehicle_id },
                include: [
                    {
                        model: db.user,
                        as: "getInByUser"
                    },
                    {
                        model: db.user,
                        as: "getOutByUser"
                    },
                    {
                        model: db.user,
                        as: "lrUpdatedBy"
                    },
                    {
                        model: db.user,
                        as: "picklistUpdatedBy"
                    }
                ]
            })
            const planning = {
                ...mainData[0],
                sale_orders: [],
                gateInOutData: getData
            };

            planning.sale_orders = sale_orders;
            planning.transportor_name = transporter.transporterDetails.tm_name;

            const { pdfBuffer, fileName } = await generateDispatchPickPdf(planning, pdfName);
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Length": pdfBuffer.length
            });

            return res.send(pdfBuffer);

        } catch (error) {
            console.error(error);

            return res.status(500).json({ message: error.message });
        }
    }
}
const ROWS_PER_PAGE = 18;

const PARENT_QTY_INCLUDES_CHILDREN = false;

function flattenItems(items, level = 0, parentNo = "", result = []) {

    items.forEach((item, index) => {

        const rowNo =
            level === 0
                ? `${index + 1}`
                : `${parentNo}${getAlpha(index)}`;

        result.push({ item, level, rowNo });

        if (item.children?.length) {
            flattenItems(item.children, level + 1, `${rowNo}.`, result);
        }
    });

    return result;
}

function renderItemRow({ item, level, rowNo, pdfName }) {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.price_per_unit) || 0;
    const amount = qty * rate;

    const isGateOutWard = pdfName === 'outward';
    const isGateInWard = pdfName === 'inward';
    const serialBatchData = item.serial_batch_data || [];

    // Separate Batch No. and Serial No.
    const batchNos = serialBatchData
        .map(data => data.batch_no || "")
        .join("<br>");

    const serialNos = serialBatchData
        .map(data => data.serial_no || "")
        .join("<br>");

    return `
      <tr>
        <td>${rowNo}</td>

        <td style="padding-left:${level * 25}px;">
          ${level > 0 ? "└ " : ""}
          ${isGateInWard ? `${item.item_name || item.item_code || ""}` : `${item.item_code || ""} ${item.item_name || ""}`}
          ${!isGateInWard ? `<span style="color:#777;">(${item.item_type || ""})</span>` : ""}
          <br>
            ${serialNos ? serialNos : batchNos}
             
        </td>

        ${!isGateOutWard && !isGateInWard
            ? `<td>${item.hsncode || ""}</td>`
            : ""
        }
 
       
        <td>${qty}</td>

        ${isGateOutWard
            ? `<td>${item.UOM || ""}</td>`
            : ""
        }

        ${isGateInWard
            ? `
                <td>${item.UOM || ""}</td>
                <td>${rate.toFixed(2)}</td>
                <td>${amount.toFixed(2)}</td>
              `
            : ""
        }
      </tr>
    `;
}

function renderTableHeader(pdfName) {
    const isGateOutWard = pdfName === 'outward';
    const isGateInWard = pdfName === 'inward';

    return `
      <tr>
        <th>S. No.</th>
        <th>${isGateInWard ? "Description" : "Item"}</th>

        ${!isGateOutWard && !isGateInWard ? `<th>HSN</th>` : ""}

        

        <th>${isGateInWard ? "Quantity" : "Qty"}</th>

        ${isGateOutWard ? `<th>UOM</th>` : ""}

        ${isGateInWard
            ? `
                <th>Unit</th>
                <th>Rate</th>
                <th>Amount</th>
              `
            : ""
        }
      </tr>
    `;
}


function getColumnCount(pdfName) {
    return pdfName === 'inward' ? 6 : 4;
}

function generateItemRows(items = [], isFirstSaleOrder = false, pdfName) {

    const flatRows = flattenItems(items);

    const isGateInWard = pdfName === 'inward';

    const columnCount = getColumnCount(pdfName);

    if (!flatRows.length) {
        return `
          <table class="item-table">
            <thead>
              ${renderTableHeader(pdfName)}
            </thead>

            <tbody>
              <tr>
                <td colspan="${columnCount}" style="text-align:center;">
                  No items
                </td>
              </tr>
            </tbody>
          </table>
        `;
    }

    // ---- Totals ----
    const rowsForTotal = PARENT_QTY_INCLUDES_CHILDREN
        ? flatRows.filter(r => r.level === 0)
        : flatRows;

    const totalQty = rowsForTotal.reduce(
        (sum, r) => sum + (Number(r.item.qty) || 0),
        0
    );

    const totalAmount = rowsForTotal.reduce(
        (sum, r) => sum + ((Number(r.item.qty) || 0) * (Number(r.item.price_per_unit) || 0)),
        0
    );

    function renderTotalRow() {
        if (pdfName === 'inward') {
            // Columns: S.No | Description | Batch | Serial | Quantity | Unit | Rate | Amount
            return `
              <tr class="total-row" style="font-weight:bold; border-top:2px solid #000;">
                <td colspan="2" style="text-align:right;">Total</td>
                
                <td>${totalQty}</td>
                <td></td>
                <td></td>
                <td>${totalAmount.toFixed(2)}</td>
              </tr>
            `;
        }

        if (pdfName === 'outward') {
            // Columns: S.No | Item | Batch | Serial | Qty | UOM
            return `
              <tr class="total-row" style="font-weight:bold; border-top:2px solid #000;">
                <td colspan="2" style="text-align:right;">Total</td>
               
                <td>${totalQty}</td>
                <td></td>
              </tr>
            `;
        }

        // Generic (dispatch): S.No | Item | HSN | Batch | Serial | Qty
        return `
          <tr class="total-row" style="font-weight:bold; border-top:2px solid #000;">
            <td colspan="3" style="text-align:right;">Total</td>
            
        
            <td>${totalQty}</td>
          </tr>
        `;
    }

    const pages = [];

    for (let i = 0; i < flatRows.length; i += ROWS_PER_PAGE) {
        pages.push(flatRows.slice(i, i + ROWS_PER_PAGE));
    }

    return pages.map((pageRows, pageIndex) => {

        // Break before every page except the very first page of the
        // very first sale order (that one flows straight after the
        // document header). Sale-order-to-sale-order breaks are handled
        // separately by the wrapping <div> in generateDispatchPickPdf,
        // so we only need this for pagination *within* one sale order
        // (pageIndex > 0) to avoid inserting a duplicate/blank page.
        const needsBreak = pageIndex > 0;
        const isLastPage = pageIndex === pages.length - 1;

        return `
          <table class="item-table" style="${needsBreak ? 'page-break-before: always;' : ''}">
            <thead>
              ${renderTableHeader(pdfName)}
            </thead>

            <tbody>
              ${pageRows
                .map((item) =>
                    renderItemRow({
                        item: item.item,
                        level: item.level,
                        rowNo: item.rowNo,
                        pdfName
                    })
                )
                .join('')
            }
              ${isLastPage ? renderTotalRow() : ""}
            </tbody>
          </table>
        `;
    }).join('');
}

function calculateTotals(items) {

    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let totalAmount = 0;

    function processItems(items) {

        items.forEach(item => {

            const qty = Number(item.qty) || 0;

            const price = Number(item.price_per_unit) || 0;

            const discount = Number(item.discount_per_unit) || 0;

            const grossAmount = price * qty;

            const discountAmount = discount * qty;
            const taxableAmount = grossAmount - discountAmount;
            const igstRate = Number(item.igstRate) || 0;
            const igst = Number(item.igst) || 0;
            const cgst = Number(item.cgst) || 0;
            const sgst = Number(item.sgst) || 0;

            let cgstAmount = 0;
            let sgstAmount = 0;
            let igstAmount = 0;

            if (igstRate > 0) {
                igstAmount = taxableAmount * igst / 100;
            } else {
                cgstAmount = taxableAmount * cgst / 100;
                sgstAmount = taxableAmount * sgst / 100;
            }
            totalDiscount += discountAmount;
            totalTaxableAmount += taxableAmount;
            totalCGST += cgstAmount;
            totalSGST += sgstAmount;
            totalIGST += igstAmount;

            totalAmount += grossAmount;


            if (item.children?.length) {
                processItems(item.children);
            }

        });
    }

    processItems(items);
    const subTotal = totalTaxableAmount;


    const totalGSTAmount =
        totalCGST +
        totalSGST +
        totalIGST;


    const totalBillAmount =
        subTotal +
        totalGSTAmount;
    return {
        totalDiscount,
        totalTaxableAmount,
        totalAmount,

        totalCGST,
        totalSGST,
        totalIGST,

        subTotal,
        totalGSTAmount,
        totalBillAmount
    };
}

async function generateDispatchPickPdf(planningData, pdfName) {

    let htmlPath = "";
    if (pdfName !== 'outward' && pdfName !== 'inward') {

        htmlPath = path.join(
            __dirname,
            "../../../src/assets/templates/dispatchPdf.html"
        );
    } else if (pdfName == 'outward' && pdfName !== 'inward') {
        htmlPath = path.join(
            __dirname,
            "../../../src/assets/templates/gateoutwordPdf.html"
        );

    } else if (pdfName !== 'outward' && pdfName == 'inward') {
        htmlPath = path.join(
            __dirname,
            "../../../src/assets/templates/gateinwordPdf.html"
        );

    }

    let htmlTemplate = fs.readFileSync(htmlPath, "utf8");

    const logoPath = path.join(
        __dirname,
        "../../../src/assets/selected-logo.jpg"
    );

    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
        const imageBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    // FIX: was an undeclared/implicit global assignment (`company_logo = logoBase64`)
    const company_logo = logoBase64;

    const elanName = "Elan Professional Appliances Pvt. Ltd.";

    let saleOrderSections = "";

    const saleOrders = planningData?.sale_orders || [];


    for (let soIndex = 0; soIndex < saleOrders.length; soIndex++) {
        const saleOrder = saleOrders[soIndex];

        const saleOrderItems = saleOrder?.sale_order_items || [];
        const data = await getMapSerialNoBySOId(saleOrder?.dataValues.id, planningData?.id);

        const groupedItems = Object.values(
            saleOrderItems.reduce((acc, item) => {
                const itemId = item.item_id;

                if (!acc[itemId]) {
                    acc[itemId] = {
                        ...item,
                        qty: Number(item.qty) || 0
                    };
                } else {
                    acc[itemId].qty += Number(item.qty) || 0;
                }

                return acc;
            }, {})
        );
        groupedItems.forEach(item => {

            const mappedItem = data.find(
                x => Number(x.item_id) === Number(item.item_id)
            );

            if (mappedItem) {
                item.serial_batch_data = mappedItem.serial_batch_data || [];
            }

        });
        const treeItems = buildTree(groupedItems);


        const itemTablesHtml = generateItemRows(treeItems, soIndex === 0, pdfName);


        const footerRow = calculateTotals(treeItems);

        const saleOrderNumber = saleOrder?.dataValues?.sales_order_no || `Sale Order ${soIndex + 1}`;
        const sales_invoice_no = saleOrder?.dataValues?.invoices[0]?.sales_invoice_no;

        saleOrderSections += `
      <div class="sale-order-section" style="${soIndex > 0 ? 'page-break-before: always;' : ''}">
        <div class="sale-order-header " style="display:flex">
          <h3>Sale Order: ${saleOrderNumber}-${sales_invoice_no}</h3>
          
        </div>
<table style="width:100%; border-collapse:collapse; margin-top:4px;">
<tr>
  <td class="section-header" style="width:50%; border-right:1px solid #000; border-left: 1px solid;">Billing Details</td>
  <td class="section-header" style="width:50%; border-right: 1px solid;">Shipping Details</td>
</tr>
</table>

<table class="party-table">
<tr>
  <td class="party-col">
    <table class="party-table" style="width:100%;">
      <tr>
        <td class="party-label">Party Name</td>
        <td class="party-colon">:</td>
        <td><strong>${saleOrder?.CUSTOMER_PROFILE_MST?.company_name}</strong></td>
      </tr>
    </table>
  </td>
  <td class="party-col">
    <table class="party-table" style="width:100%;">
      <tr>
        <td class="party-label">Address</td>
        <td class="party-colon">:</td>
        <td><strong>${[
                saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST?.shipping_address,
                saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST?.shipping_postal_address,
                saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST?.shipping_pin_code
            ]
                .filter(Boolean)
                .join('<br>')

            }</strong></td>
      </tr>
    </table>
  </td>
</tr>
<tr>
  <td class="party-col" style="vertical-align:top;">
    <table class="party-table" style="width:100%;">
      <tr>
        <td class="party-label">Address</td>
        <td class="party-colon">:</td>
        <td>${[
                saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_address,
                saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_postal_address,
                saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_pin_code
            ]
                .filter(Boolean)
                .join('<br>')

            }</td>
      </tr>
      <tr>
        <td class="party-label">State</td>
        <td class="party-colon">:</td>
        <td>${saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.MASTER_STATE?.states_name}</td>
      </tr>
      <tr>
        <td class="party-label">State Code</td>
        <td class="party-colon">:</td>
        <td>${saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.MASTER_STATE?.states_code}</td>
      </tr>
      <tr>
        <td class="party-label">GSTIN No.</td>
        <td class="party-colon">:</td>
        <td>${saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.gst_in}</td>
      </tr>
    </table>
  </td>
  <td class="party-col"></td>
</tr>
</table>


        ${itemTablesHtml}

      </div>
      
    `;
    }


    const planningCode = planningData?.planning_code || "";
    const picklistData = planningData?.gateInOutData?.dataValues;
    const pickupAddress = planningData?.sale_orders[0]?.pickup_info;
    const inOutUser = planningData?.gateInOutData?.dataValues;

    const finalHtml = htmlTemplate
        .replace(/{{company_logo}}/g, company_logo)
        .replace(/{{elanName}}/g, elanName)
        .replace(/{{vehicle_no}}/g, picklistData?.vehicle_number ?? "")
        .replace(/{{lr_no}}/g, picklistData?.LR_number ?? "")
        .replace(/{{lr_date}}/g, picklistData?.packing_list_date ? moment(picklistData.packing_list_date).format("DD/MM/YYYY") : '')
        .replace(/{{packing_list_number}}/g, picklistData?.packing_list_number ?? "")
        .replace(/{{packing_list_date}}/g, picklistData?.packing_list_date ? moment(picklistData.packing_list_date).format("DD/MM/YYYY") : "")
        .replace(/{{transportor_name}}/g, planningData?.transportor_name ?? "")
        .replace(/{{planningCode}}/g, planningCode ?? "")
        .replace(/{{gate_outward_date}}/g, picklistData?.gate_outward_date ? moment(picklistData.gate_outward_date).format("DD/MM/YYYY") : "")
        .replace(/{{gate_pass_time}}/g, picklistData?.gate_outward_date ? moment(picklistData.gate_outward_date).format("hh:mm A") : "")
        .replace(/{{gate_pass_number}}/g, picklistData?.gate_pass_number ?? "")
        .replace(/{{driver_contact}}/g, picklistData?.driver_contact ?? "")
        .replace(/{{driver_name}}/g, picklistData?.driver_name ?? "")
        .replace(/{{warehouse_gst}}/g, pickupAddress?.warehouse_gst ?? "")
        .replace(/{{warehouse_pan}}/g, pickupAddress?.warehouse_pan ?? "")
        .replace(/{{warehouse_address}}/g, pickupAddress?.warehouse_address ?? "")
        .replace(/{{getInByUser}}/g, `${inOutUser?.getInByUser?.first_name ?? ""} ${inOutUser?.getInByUser?.last_name ?? ""}`.trim())

        .replace(/{{getOutByUser}}/g, `${inOutUser?.getOutByUser?.first_name ?? ""} ${inOutUser?.getOutByUser?.last_name ?? ""}`.trim())

        .replace(/{{lrUpdatedBy}}/g, `${inOutUser?.lrUpdatedBy?.first_name ?? ""} ${inOutUser?.lrUpdatedBy?.last_name ?? ""}`.trim())

        .replace(/{{picklistUpdatedBy}}/g, `${inOutUser?.picklistUpdatedBy?.first_name ?? ""} ${inOutUser?.picklistUpdatedBy?.last_name ?? ""}`.trim())
        // .replace(/{{getInByUser}}/g, inOutUser?.getInByUser?.first_name + ' ' + inOutUser?.getInByUser?.last_name ?? "")
        // .replace(/{{getOutByUser}}/g, inOutUser?.getOutByUser?.first_name + ' ' + inOutUser?.getOutByUser?.last_name ?? "")
        // .replace(/{{lrUpdatedBy}}/g, inOutUser?.lrUpdatedBy?.first_name + ' ' + inOutUser?.lrUpdatedBy?.last_name ?? "")
        // .replace(/{{picklistUpdatedBy}}/g, inOutUser?.picklistUpdatedBy?.first_name + ' ' + inOutUser?.picklistUpdatedBy?.last_name ?? "")
        .replace(/{{saleOrderSections}}/g, saleOrderSections);


    const pdfBuffer = await generatePDF(finalHtml);

    return {
        pdfBuffer,
        fileName: `Dispatch-Pick-List-${planningCode}.pdf`
    };
}

function buildTree(data = []) {

    const map = new Map();

    const roots = [];

    data.forEach(item => {

        const itemId =
            Number(item.id);

        map.set(itemId, {
            ...item,
            children: []
        });

    });

    data.forEach(item => {

        const itemId =
            Number(item.id);

        const node =
            map.get(itemId);

        const parentId =
            item.parent_item_id == null ||
                item.parent_item_id === ""
                ? null
                : Number(item.parent_item_id);

        if (
            !parentId ||
            !map.has(parentId)
        ) {

            roots.push(node);

        } else {


            map
                .get(parentId)
                .children
                .push(node);

        }

    });

    return roots;
}

function getAlpha(index) {
    return String.fromCharCode(97 + index);
}
async function getMapSerialNoBySOId(so_id, planningId) {
    try {
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

      WHERE SN.sales_order_id = :so_id
        AND SN.vehicle_planning_id = :planningId
        AND SN.status = 'RESERVED'

      GROUP BY SOI.item_id
    `, {
            replacements: { so_id, planningId }
        });

        const [batch_no] = await db.sequelize.query(`
      SELECT 
          SOI.item_id, 
          SOI.item_name, 
          COALESCE(SOI.item_code, '-') AS item_code,

          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'serial_no', '',
                  'batch_no', B.batchNo
              )
          ) AS serial_batch_data

      FROM (
          SELECT 
              SN.item_id,
              GI.batchNo,
              MAX(SN.quantity) AS quantity

          FROM STOCK_TRANSFER_NEW AS TN

          INNER JOIN STOCK_TRANSFER_LIST_NEW AS SN 
              ON SN.stock_transfer_id = TN.id

          INNER JOIN GRN_ITEM_STATUS AS GI 
              ON GI.id = SN.grn_item_status_id

          WHERE SN.sales_order_id = :so_id
            AND TN.vehicle_planning_id = :planningId

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

      GROUP BY SOI.item_id
    `, {
            replacements: { so_id, planningId }
        });

        const finalData = [...serial_no, ...batch_no];

        return finalData;

    } catch (error) {
        console.error("Error fetching serial/batch data:", error);
        throw error;
    }
}

// module.exports = { generateDispatchPickPdf };
// const ROWS_PER_PAGE = 18;

// // 👉 Set this based on your data:
// // false = every row (parent + children) is an independent line item, sum ALL rows (DEFAULT)
// // true  = parent qty already includes children's qty, sum ONLY level-0 rows
// const PARENT_QTY_INCLUDES_CHILDREN = false;

// function flattenItems(items, level = 0, parentNo = "", result = []) {

//     items.forEach((item, index) => {

//         const rowNo =
//             level === 0
//                 ? `${index + 1}`
//                 : `${parentNo}${getAlpha(index)}`;

//         result.push({ item, level, rowNo });

//         if (item.children?.length) {
//             flattenItems(item.children, level + 1, `${rowNo}.`, result);
//         }
//     });

//     return result;
// }

// function renderItemRow({ item, level, rowNo, pdfName }) {
//     const qty = Number(item.qty) || 0;
//     const rate = Number(item.price_per_unit) || 0;
//     const amount = qty * rate;

//     const isGateOutWard = pdfName === 'outward';
//     const isGateInWard = pdfName === 'inward';
//     const serialBatchData = item.serial_batch_data || [];

//     // Separate Batch No. and Serial No.
//     const batchNos = serialBatchData
//         .map(data => data.batch_no || "")
//         .join("<br>");

//     const serialNos = serialBatchData
//         .map(data => data.serial_no || "")
//         .join("<br>");

//     return `
//       <tr>
//         <td>${rowNo}</td>

//         <td style="padding-left:${level * 25}px;">
//           ${level > 0 ? "└ " : ""}
//           ${isGateInWard
//             ? `${item.item_name || item.item_code || ""}`
//             : `${item.item_code || ""} ${item.item_name || ""}`
//         }
//           ${!isGateInWard ? `<span style="color:#777;">(${item.item_type || ""})</span>` : ""}
//         </td>

//         ${!isGateOutWard && !isGateInWard
//             ? `<td>${item.hsncode || ""}</td>`
//             : ""
//         }

//         <td style="white-space:nowrap;">
//             ${batchNos}
//         </td>


//         <td style="white-space:nowrap;">
//             ${serialNos}
//         </td>
//         <td>${qty}</td>

//         ${isGateOutWard
//             ? `<td>${item.UOM || ""}</td>`
//             : ""
//         }

//         ${isGateInWard
//             ? `
//                 <td>${item.UOM || ""}</td>
//                 <td>${rate.toFixed(2)}</td>
//                 <td>${amount.toFixed(2)}</td>
//               `
//             : ""
//         }
//       </tr>
//     `;
// }

// function generateItemRows(items = [], isFirstSaleOrder = false, pdfName) {

//     const flatRows = flattenItems(items);

//     const isGateOutWard = pdfName === 'outward';
//     const isGateInWard = pdfName === 'inward';

//     // Columns count
//     const columnCount = isGateInWard
//         ? 6
//         : 4;

//     if (!flatRows.length) {
//         return `
//           <table class="item-table">
//             <thead>
//               <tr>
//                 <th>S. No.</th>
//                 <th>${isGateInWard ? "Description" : "Item"}</th>

//                 ${!isGateOutWard && !isGateInWard? `<th>HSN</th>`: ""}
//                 <th>Batch No.</th>

//                 <th>Serial No.</th>
//                 <th>${isGateInWard ? "Quantity" : "Qty"}</th>

//                 ${isGateOutWard
//                 ? `<th>UOM</th>`
//                 : ""
//             }

//                 ${isGateInWard
//                 ? `
//                         <th>Unit</th>
//                         <th>Rate</th>
//                         <th>Amount</th>
//                       `
//                 : ""
//             }
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 <td colspan="${columnCount}" style="text-align:center;">
//                   No items
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         `;
//     }

//     // ---- Totals ----
//     const rowsForTotal = PARENT_QTY_INCLUDES_CHILDREN
//         ? flatRows.filter(r => r.level === 0)
//         : flatRows;

//     const totalQty = rowsForTotal.reduce(
//         (sum, r) => sum + (Number(r.item.qty) || 0),
//         0
//     );

//     const totalAmount = rowsForTotal.reduce(
//         (sum, r) => sum + ((Number(r.item.qty) || 0) * (Number(r.item.price_per_unit) || 0)),
//         0
//     );

//     function renderTotalRow() {
//         if (isGateInWard) {
//             // Columns: S.No | Description | Quantity | Unit | Rate | Amount
//             return `
//               <tr class="total-row" style="font-weight:bold; border-top:2px solid #000;">
//                 <td colspan="2" style="text-align:right;">Total</td>
//                 <td>${totalQty}</td>
//                 <td></td>
//                 <td></td>
//                 <td>${totalAmount.toFixed(2)}</td>
//               </tr>
//             `;
//         }

//         if (isGateOutWard) {
//             // Columns: S.No | Item | Qty | UOM
//             return `
//               <tr class="total-row" style="font-weight:bold; border-top:2px solid #000;">
//                 <td colspan="2" style="text-align:right;">Total</td>
//                 <td>${totalQty}</td>
//                 <td></td>
//               </tr>
//             `;
//         }

//         // Generic (dispatch): S.No | Item | HSN | Qty
//         return `
//           <tr class="total-row" style="font-weight:bold; border-top:2px solid #000;">
//             <td colspan="3" style="text-align:right;">Total</td>
//             <td>${totalQty}</td>
//           </tr>
//         `;
//     }

//     const pages = [];

//     for (let i = 0; i < flatRows.length; i += ROWS_PER_PAGE) {
//         pages.push(flatRows.slice(i, i + ROWS_PER_PAGE));
//     }

//     return pages.map((pageRows, pageIndex) => {

//         const needsBreak = !(isFirstSaleOrder && pageIndex === 0);
//         const isLastPage = pageIndex === pages.length - 1;

//         return `
//           <table class="item-table">
//             <thead>
//               <tr>
//                 <th>S. No.</th>
//                 <th>${isGateInWard ? "Description" : "Item"}</th>

//                 ${!isGateOutWard && !isGateInWard
//                 ? `<th>HSN</th>`
//                 : ""
//             }

//                 <th>${isGateInWard ? "Quantity" : "Qty"}</th>

//                 ${isGateOutWard
//                 ? `<th>UOM</th>`
//                 : ""
//             }

//                 ${isGateInWard
//                 ? `
//                         <th>Unit</th>
//                         <th>Rate</th>
//                         <th>Amount</th>
//                       `
//                 : ""
//             }
//               </tr>
//             </thead>

//             <tbody>
//               ${pageRows
//                 .map((item) =>
//                     renderItemRow({
//                         item: item.item,
//                         level: item.level,
//                         rowNo: item.rowNo,
//                         pdfName
//                     })
//                 )
//                 .join('')
//             }
//               ${isLastPage ? renderTotalRow() : ""}
//             </tbody>
//           </table>
//         `;
//     }).join('');
// }

// function calculateTotals(items) {

//     let totalDiscount = 0;
//     let totalTaxableAmount = 0;
//     let totalCGST = 0;
//     let totalSGST = 0;
//     let totalIGST = 0;
//     let totalAmount = 0;

//     function processItems(items) {

//         items.forEach(item => {

//             const qty = Number(item.qty) || 0;

//             const price = Number(item.price_per_unit) || 0;

//             const discount = Number(item.discount_per_unit) || 0;

//             const grossAmount = price * qty;

//             const discountAmount = discount * qty;
//             const taxableAmount = grossAmount - discountAmount;
//             const igstRate = Number(item.igstRate) || 0;
//             const igst = Number(item.igst) || 0;
//             const cgst = Number(item.cgst) || 0;
//             const sgst = Number(item.sgst) || 0;

//             let cgstAmount = 0;
//             let sgstAmount = 0;
//             let igstAmount = 0;

//             if (igstRate > 0) {
//                 igstAmount = taxableAmount * igst / 100;
//             } else {
//                 cgstAmount = taxableAmount * cgst / 100;
//                 sgstAmount = taxableAmount * sgst / 100;
//             }
//             totalDiscount += discountAmount;
//             totalTaxableAmount += taxableAmount;
//             totalCGST += cgstAmount;
//             totalSGST += sgstAmount;
//             totalIGST += igstAmount;

//             totalAmount += grossAmount;


//             if (item.children?.length) {
//                 processItems(item.children);
//             }

//         });
//     }

//     processItems(items);
//     const subTotal = totalTaxableAmount;


//     const totalGSTAmount =
//         totalCGST +
//         totalSGST +
//         totalIGST;


//     const totalBillAmount =
//         subTotal +
//         totalGSTAmount;
//     return {
//         totalDiscount,
//         totalTaxableAmount,
//         totalAmount,

//         totalCGST,
//         totalSGST,
//         totalIGST,

//         subTotal,
//         totalGSTAmount,
//         totalBillAmount
//     };
// }

// async function generateDispatchPickPdf(planningData, pdfName) {

//     let htmlPath = "";
//     if (pdfName !== 'outward' && pdfName !== 'inward') {

//         htmlPath = path.join(
//             __dirname,
//             "../../../src/assets/templates/dispatchPdf.html"
//         );
//     } else if (pdfName == 'outward' && pdfName !== 'inward') {
//         htmlPath = path.join(
//             __dirname,
//             "../../../src/assets/templates/gateoutwordPdf.html"
//         );

//     } else if (pdfName !== 'outward' && pdfName == 'inward') {
//         htmlPath = path.join(
//             __dirname,
//             "../../../src/assets/templates/gateinwordPdf.html"
//         );

//     }

//     let htmlTemplate = fs.readFileSync(htmlPath, "utf8");

//     const logoPath = path.join(
//         __dirname,
//         "../../../src/assets/selected-logo.jpg"
//     );

//     let logoBase64 = "";

//     if (fs.existsSync(logoPath)) {
//         const imageBuffer = fs.readFileSync(logoPath);
//         logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
//     }

//     company_logo = logoBase64;

//     const elanName = "Elan Professional Appliances Pvt. Ltd.";

//     let saleOrderSections = "";

//     const saleOrders = planningData?.sale_orders || [];

//     saleOrders.forEach(async (saleOrder, soIndex) => {

//         const saleOrderItems = saleOrder?.sale_order_items || [];
//         const data =  getMapSerialNoBySOId(saleOrder?.dataValues.id, planningData?.id);
//         // console.log(data);

//         const groupedItems = Object.values(
//             saleOrderItems.reduce((acc, item) => {
//                 const itemId = item.item_id;

//                 if (!acc[itemId]) {
//                     acc[itemId] = {
//                         ...item,
//                         qty: Number(item.qty) || 0
//                     };
//                 } else {
//                     acc[itemId].qty += Number(item.qty) || 0;
//                 }

//                 return acc;
//             }, {})
//         );
//         groupedItems.forEach(item => {

//             const mappedItem = data.find(
//                 x => Number(x.item_id) === Number(item.item_id)
//             );

//             if (mappedItem) {
//                 item.serial_batch_data = mappedItem.serial_batch_data || [];
//             }

//         });
//         const treeItems = buildTree(groupedItems);


//         const itemTablesHtml = generateItemRows(treeItems, soIndex === 0, pdfName);

//         const footerRow = calculateTotals(treeItems);

//         const saleOrderNumber = saleOrder?.dataValues?.sales_order_no || `Sale Order ${soIndex + 1}`;
//         const sales_invoice_no = saleOrder?.dataValues?.invoices[0]?.sales_invoice_no;

//         saleOrderSections += `
//       <div class="sale-order-section" style="${soIndex > 0 ? 'page-break-before: always;' : ''}">
//         <div class="sale-order-header " style="display:flex">
//           <h3>Sale Order: ${saleOrderNumber}-${sales_invoice_no}</h3>

//         </div>
// <table style="width:100%; border-collapse:collapse; margin-top:4px;">
// <tr>
//   <td class="section-header" style="width:50%; border-right:1px solid #000; border-left: 1px solid;">Billing Details</td>
//   <td class="section-header" style="width:50%; border-right: 1px solid;">Shipping Details</td>
// </tr>
// </table>

// <table class="party-table">
// <tr>
//   <td class="party-col">
//     <table class="party-table" style="width:100%;">
//       <tr>
//         <td class="party-label">Party Name</td>
//         <td class="party-colon">:</td>
//         <td><strong>${saleOrder?.CUSTOMER_PROFILE_MST?.company_name}</strong></td>
//       </tr>
//     </table>
//   </td>
//   <td class="party-col">
//     <table class="party-table" style="width:100%;">
//       <tr>
//         <td class="party-label">Address</td>
//         <td class="party-colon">:</td>
//         <td><strong>${[
//                 saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST?.shipping_address,
//                 saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST?.shipping_postal_address,
//                 saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST?.shipping_pin_code
//             ]
//                 .filter(Boolean)
//                 .join('<br>')

//             }</strong></td>
//       </tr>
//     </table>
//   </td>
// </tr>
// <tr>
//   <td class="party-col" style="vertical-align:top;">
//     <table class="party-table" style="width:100%;">
//       <tr>
//         <td class="party-label">Address</td>
//         <td class="party-colon">:</td>
//         <td>${[
//                 saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_address,
//                 saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_postal_address,
//                 saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_pin_code
//             ]
//                 .filter(Boolean)
//                 .join('<br>')

//             }</td>
//       </tr>
//       <tr>
//         <td class="party-label">State</td>
//         <td class="party-colon">:</td>
//         <td>${saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.MASTER_STATE?.states_name}</td>
//       </tr>
//       <tr>
//         <td class="party-label">State Code</td>
//         <td class="party-colon">:</td>
//         <td>${saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.MASTER_STATE?.states_code}</td>
//       </tr>
//       <tr>
//         <td class="party-label">GSTIN No.</td>
//         <td class="party-colon">:</td>
//         <td>${saleOrder?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.gst_in}</td>
//       </tr>
//     </table>
//   </td>
//   <td class="party-col"></td>
// </tr>
// </table>


//         ${itemTablesHtml}

//       </div>

//     `;
//     });


//     const planningCode = planningData?.planning_code || "";
//     const picklistData = planningData?.gateInOutData?.dataValues;
//     const pickupAddress = planningData?.sale_orders[0]?.pickup_info;

//     const finalHtml = htmlTemplate
//         .replace(/{{company_logo}}/g, company_logo)
//         .replace(/{{elanName}}/g, elanName)
//         .replace(/{{vehicle_no}}/g, picklistData?.vehicle_number ?? "")
//         .replace(/{{lr_no}}/g, picklistData?.LR_number ?? "")
//         .replace(/{{lr_date}}/g, picklistData?.lr_date ?? "")
//         .replace(/{{packing_list_number}}/g, picklistData?.packing_list_number ?? "")
//         .replace(/{{packing_list_date}}/g, picklistData?.packing_list_date ?? "")
//         .replace(/{{transportor_name}}/g, planningData?.transportor_name ?? "")
//         .replace(/{{planningCode}}/g, planningCode ?? "")
//         .replace(/{{gate_outward_date}}/g, moment(picklistData.gate_outward_date).format("DD/MM/YYYY") ?? "")
//         .replace(/{{gate_pass_number}}/g, picklistData?.gate_pass_number ?? "")
//         .replace(/{{driver_contact}}/g, picklistData?.driver_contact ?? "")
//         .replace(/{{driver_name}}/g, picklistData?.driver_name ?? "")
//         .replace(/{{warehouse_gst}}/g, pickupAddress?.warehouse_gst ?? "")
//         .replace(/{{warehouse_pan}}/g, pickupAddress?.warehouse_pan ?? "")
//         .replace(/{{warehouse_address}}/g, pickupAddress?.warehouse_address ?? "")
//         .replace(/{{saleOrderSections}}/g, saleOrderSections);


//     const pdfBuffer = await generatePDF(finalHtml);

//     return {
//         pdfBuffer,
//         fileName: `Dispatch-Pick-List-${planningCode}.pdf`
//     };
// }

// function buildTree(data = []) {

//     const map = new Map();

//     const roots = [];

//     data.forEach(item => {

//         const itemId =
//             Number(item.id);

//         map.set(itemId, {
//             ...item,
//             children: []
//         });

//     });

//     data.forEach(item => {

//         const itemId =
//             Number(item.id);

//         const node =
//             map.get(itemId);

//         const parentId =
//             item.parent_item_id == null ||
//                 item.parent_item_id === ""
//                 ? null
//                 : Number(item.parent_item_id);

//         if (
//             !parentId ||
//             !map.has(parentId)
//         ) {

//             roots.push(node);

//         } else {


//             map
//                 .get(parentId)
//                 .children
//                 .push(node);

//         }

//     });

//     return roots;
// }

// function getAlpha(index) {
//     return String.fromCharCode(97 + index);
// }
// async function getMapSerialNoBySOId(so_id, planningId) {
//     try {
//         const [serial_no] = await db.sequelize.query(`
//       SELECT 
//           SOI.item_id, 
//           SOI.item_name, 
//           COALESCE(SOI.item_code, '-') AS item_code,

//           JSON_ARRAYAGG(
//               JSON_OBJECT(
//                   'serial_no', GI.itemSerialNo,
//                   'batch_no', GI.batchNo
//               )
//           ) AS serial_batch_data

//       FROM STOCK_TRANSFER_SERIAL_NEW AS SN

//       INNER JOIN GRN_ITEM_STATUS AS GI 
//           ON GI.id = SN.grn_item_status_id

//       INNER JOIN SALES_ORDER_ITEM_LIST_NEW AS SOI 
//           ON SOI.id = SN.sales_order_item_id

//       WHERE SN.sales_order_id = :so_id
//         AND SN.vehicle_planning_id = :planningId
//         AND SN.status = 'RESERVED'

//       GROUP BY SOI.item_id
//     `, {
//             replacements: { so_id, planningId }
//         });

//         const [batch_no] = await db.sequelize.query(`
//       SELECT 
//           SOI.item_id, 
//           SOI.item_name, 
//           COALESCE(SOI.item_code, '-') AS item_code,

//           JSON_ARRAYAGG(
//               JSON_OBJECT(
//                   'serial_no', CONCAT(B.quantity, ' QTY'),
//                   'batch_no', B.batchNo
//               )
//           ) AS serial_batch_data

//       FROM (
//           SELECT 
//               SN.item_id,
//               GI.batchNo,
//               MAX(SN.quantity) AS quantity

//           FROM STOCK_TRANSFER_NEW AS TN

//           INNER JOIN STOCK_TRANSFER_LIST_NEW AS SN 
//               ON SN.stock_transfer_id = TN.id

//           INNER JOIN GRN_ITEM_STATUS AS GI 
//               ON GI.id = SN.grn_item_status_id

//           WHERE SN.sales_order_id = :so_id
//             AND TN.vehicle_planning_id = :planningId

//           GROUP BY 
//               SN.item_id,
//               GI.batchNo
//       ) AS B

//       INNER JOIN (
//           SELECT 
//               item_id,
//               MAX(item_name) AS item_name,
//               MAX(item_code) AS item_code

//           FROM SALES_ORDER_ITEM_LIST_NEW

//           WHERE sales_order_id = :so_id

//           GROUP BY item_id
//       ) AS SOI 
//           ON SOI.item_id = B.item_id

//       GROUP BY SOI.item_id
//     `, {
//             replacements: { so_id, planningId }
//         });

//         const finalData = [...serial_no, ...batch_no];

//         return finalData;

//     } catch (error) {
//         console.error("Error fetching serial/batch data:", error);
//         throw error;
//     }
// }
module.exports = new GateInwardOutwardController();