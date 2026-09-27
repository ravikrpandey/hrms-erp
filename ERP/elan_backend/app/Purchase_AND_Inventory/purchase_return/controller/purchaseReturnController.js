const db = require("../../../models/index");
const { Op } = require("sequelize");
const transport = require("../../../master/services/nodemailer");

// Generate purchase return code
const generateReturnCode = async () => {
    const lastReturn = await db.purchaseReturn.findOne({
        order: [['id', 'DESC']],
        paranoid: false
    });
    const nextId = lastReturn ? lastReturn.id + 1 : 1;
    return 'PR' + String(nextId).padStart(4, '0');
};

// Create Purchase Return (DRAFT)
exports.createReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const {
            vendor_id,
            grn_id,
            po_id,
            invoice_id,
            return_date,
            return_reason_id,
            remarks,
            items,
            financial_year_id,
            entity_id,
            employee_id
        } = req.body;

        if (!vendor_id || !grn_id || !return_date || !items || !items.length) {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Required fields are missing" });
        }

        const return_no = await generateReturnCode();

        // Calculate totals
        let sub_total = 0;
        let tax_amount = 0;
        let final_amount = 0;

        const returnItemsData = items.map(item => {
            const qty = parseFloat(item.return_qty) || 0;
            const rate = parseFloat(item.rate) || 0;
            const taxPercent = parseFloat(item.tax_percent) || 0;
            const amount = qty * rate;
            const taxAmt = amount * (taxPercent / 100);
            const total = amount + taxAmt;

            sub_total += amount;
            tax_amount += taxAmt;
            final_amount += total;

            return {
                grn_item_id: item.grn_item_id,
                item_id: item.item_id,
                received_qty: item.received_qty,
                already_returned_qty: item.already_returned_qty || 0,
                return_qty: qty,
                rate: rate,
                tax_percent: taxPercent,
                tax_amount: taxAmt,
                amount: total,
                warehouse_id: item.warehouse_id || null,
                zone_id: item.zone_id || null,
                rack_id: item.rack_id || null,
                bin_id: item.bin_id || null,
                batch_no: item.batch_no || null,
                serial_no: item.serial_no || null,
                remarks: item.remarks || null
            };
        });

        // Create Header
        const newReturn = await db.purchaseReturn.create({
            return_no,
            vendor_id,
            po_id: po_id || null,
            grn_id,
            invoice_id: invoice_id || null,
            return_date,
            return_reason_id: return_reason_id || null,
            remarks,
            status: "DRAFT",
            sub_total,
            tax_amount,
            final_amount,
            created_by: employee_id || req.user?.employee_id || 1,
            financial_year_id: financial_year_id || 3,
            entity_id: entity_id || 1
        }, { transaction });

        // Create items
        const returnItems = returnItemsData.map(item => ({
            ...item,
            purchase_return_id: newReturn.id
        }));
        await db.purchaseReturnItem.bulkCreate(returnItems, { transaction });

        // Log status change
        await db.purchaseReturnStatusLog.create({
            purchase_return_id: newReturn.id,
            status: "DRAFT",
            remarks: "Purchase Return Created as Draft",
            created_by: employee_id || req.user?.employee_id || 1
        }, { transaction });

        await transaction.commit();
        return res.status(201).send({ code: 201, message: "Purchase Return created successfully as Draft", data: newReturn });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in createReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Update Purchase Return (Only in DRAFT)
exports.updateReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const {
            return_date,
            return_reason_id,
            remarks,
            items,
            employee_id
        } = req.body;

        const pr = await db.purchaseReturn.findOne({ where: { id, isDeleted: false }, transaction });
        if (!pr) {
            await transaction.rollback();
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        if (pr.status !== "DRAFT") {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Only Draft purchase returns can be updated" });
        }

        // Calculate totals
        let sub_total = 0;
        let tax_amount = 0;
        let final_amount = 0;

        const returnItemsData = items.map(item => {
            const qty = parseFloat(item.return_qty) || 0;
            const rate = parseFloat(item.rate) || 0;
            const taxPercent = parseFloat(item.tax_percent) || 0;
            const amount = qty * rate;
            const taxAmt = amount * (taxPercent / 100);
            const total = amount + taxAmt;

            sub_total += amount;
            tax_amount += taxAmt;
            final_amount += total;

            return {
                purchase_return_id: pr.id,
                grn_item_id: item.grn_item_id,
                item_id: item.item_id,
                received_qty: item.received_qty,
                already_returned_qty: item.already_returned_qty || 0,
                return_qty: qty,
                rate: rate,
                tax_percent: taxPercent,
                tax_amount: taxAmt,
                amount: total,
                warehouse_id: item.warehouse_id || null,
                zone_id: item.zone_id || null,
                rack_id: item.rack_id || null,
                bin_id: item.bin_id || null,
                batch_no: item.batch_no || null,
                serial_no: item.serial_no || null,
                remarks: item.remarks || null
            };
        });

        // Update Header
        await pr.update({
            return_date,
            return_reason_id: return_reason_id || null,
            remarks,
            sub_total,
            tax_amount,
            final_amount
        }, { transaction });

        // Remove old items
        await db.purchaseReturnItem.destroy({ where: { purchase_return_id: pr.id }, transaction });

        // Insert new items
        await db.purchaseReturnItem.bulkCreate(returnItemsData, { transaction });

        // Log status change
        await db.purchaseReturnStatusLog.create({
            purchase_return_id: pr.id,
            status: "DRAFT",
            remarks: "Purchase Return Updated",
            created_by: employee_id || req.user?.employee_id || 1
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Purchase Return updated successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in updateReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Delete Purchase Return (Only in DRAFT)
exports.deleteReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const pr = await db.purchaseReturn.findOne({ where: { id, isDeleted: false }, transaction });
        if (!pr) {
            await transaction.rollback();
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        if (pr.status !== "DRAFT") {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Only Draft purchase returns can be deleted" });
        }

        await pr.update({ isDeleted: true }, { transaction });
        await db.purchaseReturnItem.update({ isDeleted: true }, { where: { purchase_return_id: pr.id }, transaction });

        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Purchase Return deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in deleteReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Get Returns List
exports.getReturns = async (req, res) => {
    try {
        const { vendor_id, status, return_no } = req.query;
        const where = { isDeleted: false };

        if (vendor_id) {
            where.vendor_id = vendor_id;
            // Vendor Panel is limited to showing APPROVED and COMPLETED returns
            where.status = { [Op.in]: ["APPROVED", "COMPLETED"] };
        } else if (status && status !== 'All') {
            where.status = status;
        }

        if (return_no) {
            where.return_no = { [Op.like]: `%${return_no}%` };
        }

        const list = await db.purchaseReturn.findAll({
            where,
            include: [
                {
                    model: db.vendor_basic_details,
                    as: "vendor",
                    attributes: ["vendor_name", "vendor_code"]
                },
                {
                    model: db.grnMaster,
                    as: "grn",
                    attributes: ["grn_number"]
                },
                {
                    model: db.user,
                    as: "creator",
                    attributes: ["first_name", "last_name"]
                }
            ],
            order: [["id", "DESC"]]
        });

        return res.status(200).send({ code: 200, data: list });
    } catch (error) {
        console.error("Error in getReturns:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Get Return by ID
exports.getReturnById = async (req, res) => {
    try {
        const { id } = req.params;
        const pr = await db.purchaseReturn.findOne({
            where: { id, isDeleted: false },
            include: [
                {
                    model: db.vendor_basic_details,
                    as: "vendor"
                },
                {
                    model: db.grnMaster,
                    as: "grn",
                    attributes: ["grn_number", "grn_date", "invoiceNo", "invoiceDate"]
                },
                {
                    model: db.purchase_order,
                    as: "purchaseOrder",
                    attributes: ["po_number"]
                },
                {
                    model: db.user,
                    as: "creator",
                    attributes: ["first_name", "last_name"]
                },
                {
                    model: db.purchaseReturnItem,
                    as: "items",
                    where: { isDeleted: false },
                    required: false,
                    include: [
                        {
                            model: db.ItemMaster,
                            as: "item",
                            attributes: ["item_name", "item_code", "manage_by"]
                        },
                        {
                            model: db.warehouse,
                            as: "warehouse",
                            attributes: ["name"]
                        },
                        {
                            model: db.grnItem,
                            as: "grnItem",
                            attributes: ["po_item_id"],
                            include: [
                                {
                                    model: db.purchase_order_item,
                                    attributes: ["unit_price", "discount_percentage", "gst_percentage"]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: db.purchaseReturnStatusLog,
                    as: "statusLogs",
                    include: [
                        {
                            model: db.user,
                            as: "creator",
                            attributes: ["first_name", "last_name"]
                        }
                    ]
                }
            ]
        });

        if (!pr) {
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        return res.status(200).send({ code: 200, data: pr });
    } catch (error) {
        console.error("Error in getReturnById:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Submit Purchase Return
exports.submitReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { remarks, employee_id } = req.body;

        const pr = await db.purchaseReturn.findOne({
            where: { id, isDeleted: false },
            include: [{
                model: db.vendor_basic_details,
                as: "vendor"
            }],
            transaction
        });
        if (!pr) {
            await transaction.rollback();
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        if (pr.status !== "DRAFT") {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Only Draft purchase returns can be submitted" });
        }

        await pr.update({ status: "SUBMITTED" }, { transaction });

        await db.purchaseReturnStatusLog.create({
            purchase_return_id: pr.id,
            status: "SUBMITTED",
            remarks: remarks || "Purchase Return Submitted for Approval",
            created_by: employee_id || req.user?.employee_id || 1
        }, { transaction });

        await transaction.commit();

        // Send email to vendor after successful commit
        if (pr && pr.vendor && pr.vendor.vendor_email) {
            try {
                const link = `${req.headers.origin}/auth/login`;
                const mailBody = {
                    to: pr.vendor.vendor_email,
                    subject: `Elite ERP - Purchase Return Request ${pr.return_no} Submitted`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #0f766e;">Purchase Return Submitted</h2>
                            <p>Dear <strong>${pr.vendor.vendor_name}</strong>,</p>
                            <p>A new Purchase Return request <strong>${pr.return_no}</strong> has been submitted for your review.</p>
                            <p><strong>Return Details:</strong></p>
                            <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                                <tr style="background-color: #f2f2f2;">
                                    <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Field</th>
                                    <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Value</th>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #dddddd; padding: 8px;">Return No</td>
                                    <td style="border: 1px solid #dddddd; padding: 8px;"><strong>${pr.return_no}</strong></td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #dddddd; padding: 8px;">Return Date</td>
                                    <td style="border: 1px solid #dddddd; padding: 8px;">${pr.return_date}</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #dddddd; padding: 8px;">Total Amount</td>
                                    <td style="border: 1px solid #dddddd; padding: 8px;">₹ ${parseFloat(pr.final_amount).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #dddddd; padding: 8px;">Remarks</td>
                                    <td style="border: 1px solid #dddddd; padding: 8px;">${pr.remarks || 'N/A'}</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px;">Please login to your Vendor Portal to review and acknowledge this request.</p>
                            <p><a href="${link}" style="background-color: #0f766e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Login to Vendor Portal</a></p>
                            <br>
                            <p>Best Regards,</p>
                            <p><strong>Elite ERP Procurement Team</strong></p>
                        </div>
                    `
                };
                transport.mailsend(mailBody, pr.entity_id || 1).then(() => {
                    console.log(`Notification email sent to vendor: ${pr.vendor.vendor_email}`);
                }).catch(err => {
                    console.error("Failed to send notification email to vendor:", err);
                });
            } catch (mailError) {
                console.error("Error in mail sending setup:", mailError);
            }
        }

        return res.status(200).send({ code: 200, message: "Purchase Return submitted successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in submitReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Reject Purchase Return
exports.rejectReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { remarks, employee_id } = req.body;

        const pr = await db.purchaseReturn.findOne({ where: { id, isDeleted: false }, transaction });
        if (!pr) {
            await transaction.rollback();
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        if (pr.status !== "SUBMITTED") {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Only Submitted returns can be rejected" });
        }

        await pr.update({ status: "REJECTED" }, { transaction });

        await db.purchaseReturnStatusLog.create({
            purchase_return_id: pr.id,
            status: "REJECTED",
            remarks: remarks || "Purchase Return Rejected",
            created_by: employee_id || req.user?.employee_id || 1
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Purchase Return rejected successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in rejectReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Cancel Purchase Return
exports.cancelReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { remarks, employee_id } = req.body;

        const pr = await db.purchaseReturn.findOne({ where: { id, isDeleted: false }, transaction });
        if (!pr) {
            await transaction.rollback();
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        if (pr.status === "APPROVED" || pr.status === "COMPLETED" || pr.status === "CANCELLED") {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Cannot cancel return after approval/completion or cancellation" });
        }

        await pr.update({ status: "CANCELLED" }, { transaction });

        await db.purchaseReturnStatusLog.create({
            purchase_return_id: pr.id,
            status: "CANCELLED",
            remarks: remarks || "Purchase Return Cancelled",
            created_by: employee_id || req.user?.employee_id || 1
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Purchase Return cancelled successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in cancelReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Approve Purchase Return (Deducts stock & generates Credit Note)
exports.approveReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { remarks, employee_id } = req.body;
        const empId = employee_id || req.user?.employee_id || 1;
        
        const pr = await db.purchaseReturn.findOne({
            where: { id, isDeleted: false },
            include: [{ model: db.purchaseReturnItem, as: "items", where: { isDeleted: false } }],
            transaction
        });

        if (!pr) {
            await transaction.rollback();
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        if (pr.status !== "SUBMITTED") {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Only Submitted returns can be approved" });
        }

        // Loop items to validate limits and available stock
        for (const item of pr.items) {
            // 1. Check return limit
            const previousReturns = await db.purchaseReturnItem.findAll({
                include: [{
                    model: db.purchaseReturn,
                    as: "purchaseReturn",
                    where: {
                        status: { [Op.in]: ["APPROVED", "COMPLETED"] },
                        grn_id: pr.grn_id
                    }
                }],
                where: {
                    grn_item_id: item.grn_item_id,
                    isDeleted: false
                },
                transaction
            });

            const alreadyReturned = previousReturns.reduce((sum, el) => sum + el.return_qty, 0);
            if (item.return_qty > (item.received_qty - alreadyReturned)) {
                await transaction.rollback();
                return res.status(400).send({
                    code: 400,
                    message: `Return quantity (${item.return_qty}) exceeds remaining returnable quantity for item ID ${item.item_id}. Previously returned: ${alreadyReturned}.`
                });
            }

            // 2. Check available stock in warehouse
            if (item.warehouse_id) {
                const stock = await db.inventory_stock.findOne({
                    where: {
                        item_id: item.item_id,
                        warehouse_id: item.warehouse_id
                    },
                    transaction
                });

                if (!stock || stock.available_qty < item.return_qty) {
                    await transaction.rollback();
                    return res.status(400).send({
                        code: 400,
                        message: `Insufficient stock in selected warehouse for item ID ${item.item_id}. Available: ${stock ? stock.available_qty : 0}. Requested return: ${item.return_qty}.`
                    });
                }

                // Decrement stock
                await stock.decrement({ available_qty: item.return_qty }, { transaction });

                // Decrement warehouse allocations
                const allocationWhere = {
                    item_id: item.item_id,
                    warehouse_id: item.warehouse_id
                };
                
                let statusRecord = null;
                if (item.serial_no || item.batch_no) {
                    const statusWhere = { grn_item_id: item.grn_item_id };
                    if (item.serial_no) statusWhere.itemSerialNo = item.serial_no;
                    if (item.batch_no) statusWhere.batchNo = item.batch_no;

                    statusRecord = await db.grnItemStatus.findOne({
                        where: statusWhere,
                        transaction
                    });
                } else {
                    statusRecord = await db.grnItemStatus.findOne({
                        where: { grn_item_id: item.grn_item_id },
                        transaction
                    });
                }

                if (statusRecord) {
                    allocationWhere.grn_item_status_id = statusRecord.id;
                }

                const allocation = await db.warehouseAllocation.findOne({
                    where: allocationWhere,
                    transaction
                });

                if (allocation) {
                    if (allocation.receiveQty > item.return_qty) {
                        await allocation.decrement({ receiveQty: item.return_qty }, { transaction });
                    } else {
                        await allocation.update({ receiveQty: 0, status: "INACTIVE" }, { transaction });
                    }
                }

                // Log Stock Ledger Outward entry
                await db.inventory_ledger.create({
                    quantity: item.return_qty,
                    type: "RETURN_OUT",
                    reference_table: "PURCHASE_RETURN",
                    reference_table_id: item.id,
                    remark: `Purchase Return Outward - Ref: ${pr.return_no}`,
                    financial_year_id: pr.financial_year_id,
                    entity_id: pr.entity_id,
                    warehouse_id: item.warehouse_id,
                    item_id: item.item_id,
                    created_by: empId
                }, { transaction });
            }
        }

        // Update Return Status
        await pr.update({ status: "APPROVED", approved_by: empId }, { transaction });

        // Log status change
        await db.purchaseReturnStatusLog.create({
            purchase_return_id: pr.id,
            status: "APPROVED",
            remarks: remarks || "Purchase Return Approved",
            created_by: empId
        }, { transaction });

        // 3. VENDOR FINANCIAL ADJUSTMENT: Create Credit Note
        const grnExist = await db.grnMaster.findOne({ where: { id: pr.grn_id }, transaction });
        if (grnExist) {
       
            const entityExist = await db.entityMaster.findOne({where:{id:pr.entity_id},transaction})
            const vendorExist = await db.vendorShippingAddress.findOne({where:{vendor_id:pr.vendor_id},transaction})
            const vendorExistDetails = await db.vendor_basic_details.findOne({where:{id:pr.vendor_id},attributes:['id','rcm_charge'],transaction})
        
              const sameState = entityExist?.state_id === vendorExist?.billing_state_id;

              
              
              const journalEntries = [];
             
              journalEntries.push({
                chart_account_id: 51,
                debit_amount: Number(pr.final_amount),
                credit_amount: 0,
                vendor_id: pr.vendor_id,
                party_type: 'VENDOR',
                entity_id: pr.entity_id,
                entry_status: 'Purchase Return',
                document_number: pr.return_no,
                financial_id: pr.financial_year_id
              });
              
             if(vendorExistDetails?.rcm_charge){
                journalEntries.push({
                    chart_account_id: 398,
                    debit_amount: 0,
                    credit_amount: Number(pr.final_amount),
                    entity_id: pr.entity_id,
                    entry_status: 'Purchase Return',
                    document_number: pr.return_no,
                    financial_id: pr.financial_year_id
                  });
             }else{
                journalEntries.push({
                    chart_account_id: 398,
                    debit_amount: 0,
                    credit_amount: Number(pr.sub_total),
                    entity_id: pr.entity_id,
                    entry_status: 'Purchase Return',
                    document_number: pr.return_no,
                    financial_id: pr.financial_year_id
                  });
             }
              
              
         

if (vendorExistDetails?.rcm_charge) {


    if (sameState) {

        const halfTax = Number(pr.tax_amount) / 2;

        journalEntries.push(

            {
                chart_account_id: 404, // CGST RCM INPUT TAX
                financial_id: pr.financial_year_id,
                debit_amount: 0,
                credit_amount: halfTax,
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                vendor_id: pr.vendor_id,
                document_number: pr.return_no
            },

            {
                chart_account_id: 405, // SGST RCM INPUT TAX
                financial_id: pr.financial_year_id,
                debit_amount: 0,
                credit_amount: halfTax,
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                vendor_id: pr.vendor_id,
                document_number: pr.return_no
            },

      
            {
                chart_account_id: 401, // CGST RCM OUTPUT LIABILITY
                financial_id: pr.financial_year_id,
                debit_amount: halfTax,
                credit_amount: 0,
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                vendor_id: pr.vendor_id,
                document_number: pr.return_no
            },

   
            {
                chart_account_id: 402, // SGST RCM OUTPUT LIABILITY
                financial_id: pr.financial_year_id,
                debit_amount: halfTax,
                credit_amount: 0,
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                vendor_id: pr.vendor_id,
                document_number: pr.return_no
            }
        );

    } else {


        journalEntries.push(

       
            {
                chart_account_id: 403, // IGST RCM INPUT TAX
                financial_id: pr.financial_year_id,
                debit_amount: 0,
                credit_amount: Number(pr.tax_amount),
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                vendor_id: pr.vendor_id,
                document_number: pr.return_no
            },

            {
                chart_account_id: 400, // IGST RCM OUTPUT LIABILITY
                financial_id: pr.financial_year_id,
                debit_amount: Number(pr.tax_amount),
                credit_amount: 0,
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                vendor_id: pr.vendor_id,
                document_number: pr.return_no
            }
        );
    }

} else {



    if (sameState) {

        const halfTax = Number(pr.tax_amount) / 2;

        journalEntries.push(

            {
                chart_account_id: 29, // INPUT CGST
                financial_id: pr.financial_year_id,
                debit_amount: 0,
                credit_amount: halfTax,
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                document_number: pr.return_no
            },

            {
                chart_account_id: 30, // INPUT SGST
                financial_id: pr.financial_year_id,
                debit_amount: 0,
                credit_amount: halfTax,
                entry_status: 'Purchase Return',
                entity_id: pr.entity_id,
                document_number: pr.return_no
            }
        );

    } else {

        journalEntries.push({

            chart_account_id: 21, // INPUT IGST
            financial_id: pr.financial_year_id,
            debit_amount: 0,
            credit_amount: Number(pr.tax_amount),
            entry_status: 'Purchase Return',
            entity_id: pr.entity_id,
            document_number: pr.return_no

        });

    }
}
              
              await db.financial_And_Account_Journal_List.bulkCreate(
                journalEntries,
                { transaction }
              );
        }

        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Purchase Return approved successfully, inventory reduced, credit note generated" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in approveReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Fetch GRN Items for Return utility
exports.getGrnItemsForReturn = async (req, res) => {
    try {
        const { id } = req.params; // grn_id

        const grn = await db.grnMaster.findOne({
            where: { id },
            attributes: ["id", "grn_number", "po_Id", "invoiceNo", "invoiceDate"]
        });

        if (!grn) {
            return res.status(404).send({ code: 404, message: "GRN not found" });
        }

        // Fetch GRN items along with their details
        const query = `
            SELECT GI.id AS grn_item_id, GI.receiveQty, GI.amount, I.id AS item_id, I.item_name, I.item_code, I.manage_by,
                   COALESCE(GRM.value, 18.00) AS gstRate, HSN.hsn_sac_code,
                   WA.warehouse_id, WA.zone_id, WA.rack_id, WA.bin_id, WA.receiveQty AS waReceiveQty,
                   GIS.batchNo, GIS.itemSerialNo, W.name AS warehouse_name,
                   POI.unit_price AS po_unit_price, COALESCE(POI.discount_percentage, 0) AS discount_percentage
            FROM GRN_ITEM GI
            INNER JOIN MASTER_ITEM I ON I.id = GI.item_id
            LEFT JOIN MASTER_HSN_SAC_CODE HSN ON HSN.id = I.hsn_code_id
            LEFT JOIN GST_RATE_MASTER GRM ON GRM.id = HSN.gst_rate_id
            LEFT JOIN GRN_ITEM_STATUS GIS ON GIS.grn_item_id = GI.id
            LEFT JOIN WAREHOUSE_ALLOCATION WA ON WA.grn_item_status_id = GIS.id
            LEFT JOIN WAREHOUSE_MASTER W ON W.id = WA.warehouse_id
            LEFT JOIN PROCUREMENT_PURCHASE_ORDER_ITEM POI ON POI.id = GI.po_item_id
            WHERE GI.grn_Id = :grn_id AND GI.isDeleted = false AND GIS.allocation_status = 'SELECTED'
        `;

        const grnItems = await db.sequelize.query(query, {
            replacements: { grn_id: id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        // Loop and attach already returned quantity
        const finalItems = await Promise.all(grnItems.map(async (el) => {
            const previousReturns = await db.purchaseReturnItem.findAll({
                include: [{
                    model: db.purchaseReturn,
                    as: "purchaseReturn",
                    where: {
                        status: { [Op.in]: ["SUBMITTED", "APPROVED", "COMPLETED"] },
                        grn_id: id
                    }
                }],
                where: {
                    grn_item_id: el.grn_item_id,
                    isDeleted: false,
                    // If batch controlled or serial controlled, filter precisely
                    ...(el.batchNo ? { batch_no: el.batchNo } : {}),
                    ...(el.itemSerialNo ? { serial_no: el.itemSerialNo } : {})
                }
            });

            const returnedQty = previousReturns.reduce((sum, item) => sum + item.return_qty, 0);

            // Fetch available stock in the warehouse
            let availableStock = 0;
            if (el.warehouse_id) {
                const stock = await db.inventory_stock.findOne({
                    where: { item_id: el.item_id, warehouse_id: el.warehouse_id }
                });
                if (stock) {
                    availableStock = stock.available_qty;
                }
            }

            const isSerialOnly = el.manage_by === 'S.No. Only';
            const finalReceivedQty = isSerialOnly ? 1 : (el.waReceiveQty !== null ? parseFloat(el.waReceiveQty) : el.receiveQty);
            const finalReturnedQty = isSerialOnly ? Math.min(1, returnedQty) : returnedQty;
            const remainingQty = Math.max(0, finalReceivedQty - finalReturnedQty);
            const finalAvailableStock = isSerialOnly ? Math.min(1, availableStock) : Math.min(availableStock, (el.waReceiveQty !== null ? parseFloat(el.waReceiveQty) : availableStock));

            const gstRate = parseFloat(el.gstRate) || 0;
            const discountPercent = parseFloat(el.discount_percentage) || 0;

            let rateExcludingGst = 0;
            if (el.po_unit_price !== null) {
                const unitPrice = parseFloat(el.po_unit_price) || 0;
                rateExcludingGst = unitPrice * (1 - discountPercent / 100);
            } else {
                const amountExcludingGst = parseFloat(el.amount) / (1 + gstRate / 100);
                rateExcludingGst = amountExcludingGst / parseFloat(el.receiveQty);
            }
            rateExcludingGst = parseFloat(rateExcludingGst.toFixed(2)) || 0;

            return {
                grn_item_id: el.grn_item_id,
                item_id: el.item_id,
                item_name: el.item_name,
                item_code: el.item_code,
                manage_by: el.manage_by,
                received_qty: finalReceivedQty,
                already_returned_qty: finalReturnedQty,
                remaining_qty: remainingQty,
                available_stock: finalAvailableStock,
                rate: rateExcludingGst,
                tax_percent: gstRate,
                discount_percentage: discountPercent,
                gross_rate: el.po_unit_price !== null ? parseFloat(el.po_unit_price) : rateExcludingGst,
                hsn_sac_code: el.hsn_sac_code,
                warehouse_id: el.warehouse_id,
                warehouse_name: el.warehouse_name,
                zone_id: el.zone_id,
                rack_id: el.rack_id,
                bin_id: el.bin_id,
                batch_no: el.batchNo,
                serial_no: el.itemSerialNo
            };
        }));

        return res.status(200).send({ code: 200, data: finalItems });
    } catch (error) {
        console.error("Error in getGrnItemsForReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Fetch Vendors with GRNs (utility)
exports.getVendors = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT V.id, V.vendor_name, V.vendor_code
            FROM VENDOR_BASIC_DETAILS V
            INNER JOIN GRN_MASTER G ON G.vendor_id = V.id
            WHERE V.isDeleted = false AND G.isDeleted = false AND G.grnStatus = 'COMPLETED'
        `;
        const list = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        return res.status(200).send({ code: 200, data: list });
    } catch (error) {
        console.error("Error in getVendors:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Fetch GRNs for a specific Vendor
exports.getGrnsByVendor = async (req, res) => {
    try {
        const { vendor_id } = req.params;
        const list = await db.grnMaster.findAll({
            where: {
                vendor_id,
                grnStatus: "COMPLETED",
                isDeleted: false
            },
            attributes: ["id", "grn_number", "grn_date", "invoiceNo", "invoiceDate"],
            order: [["id", "DESC"]]
        });
        return res.status(200).send({ code: 200, data: list });
    } catch (error) {
        console.error("Error in getGrnsByVendor:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

// Complete Purchase Return (Acknowledge by Vendor)
exports.completeReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { remarks, employee_id } = req.body;

        const pr = await db.purchaseReturn.findOne({ where: { id, isDeleted: false }, transaction });
        if (!pr) {
            await transaction.rollback();
            return res.status(404).send({ code: 404, message: "Purchase Return not found" });
        }

        if (pr.status !== "APPROVED") {
            await transaction.rollback();
            return res.status(400).send({ code: 400, message: "Only Approved purchase returns can be completed" });
        }

        await pr.update({ status: "COMPLETED" }, { transaction });

        await db.purchaseReturnStatusLog.create({
            purchase_return_id: pr.id,
            status: "COMPLETED",
            remarks: remarks || "Purchase Return Completed & Acknowledged by Vendor",
            created_by: employee_id || req.user?.employee_id || 1
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Purchase Return completed and acknowledged successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error in completeReturn:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};
// Fetch Statuses list
exports.getStatusList = async (req, res) => {
    try {
        const statuses = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];
        return res.status(200).send({ code: 200, data: statuses });
    } catch (error) {
        console.error("Error in getStatusList:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};
