const db = require("../../../models/index");
const { sendPdfInvoice, sendPdfMail } = require("../utils/pdfController/pdf")
const fs = require("fs");
const path = require("path");
const moment = require('moment');
const { generatePDF } = require("../../../common/pdfConverter");

module.exports.pdfSalesInvoice = async (req, res) => {
    try {
        const { proposal_id, do_id, entity_id, urlData } = req.query;
        const dataExist = await db.sales_delivery_challan.findOne({ where: { proposal_id, id: do_id } });

        if (!dataExist) {
            return res.status(200).send({ code: 404, message: "Please Create The Sales Invoice First" });
        }

        // const [result] = await db.sequelize.query(`
        //     SELECT CA.*, 
        //            C.proposal_no, C.mail_id, C.company_name, C.contact_number, C.contact_person_name, C.additional_charges, 
        //            E.*, 
        //            CSI.sales_invoice_no, CSI.sales_invoice_date
        //     FROM CRM_ADD_DO_MST AS CA
        //     INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON C.id = CA.proposal_id
        //     INNER JOIN ENTITY_MASTER AS E ON E.id = ${entity_id} 
        //     LEFT JOIN CRM_SALES_INVOICE_MST AS CSI ON CSI.do_id = CA.id AND CSI.proposal_id = C.id
        //     WHERE C.id = ${proposal_id} AND CA.id = ${do_id} 
        //     ORDER BY C.id DESC
        // `);

        // const [allResult] = await db.sequelize.query(`
        //     SELECT C.*, P.product_name, P.product_code,  PV.product_description, T.uom_name,
        //         (C.qty * C.price_per_unit) AS amount, 
        //         (COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) AS discount_amount,
        //         ((C.qty * C.price_per_unit) - COALESCE((C.qty * C.price_per_unit * C.discount_request / 100), 0)) AS total_amount,
        //         (COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS tax_amount,
        //         (COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)), 0) 
        //         + COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS final_amount
        //     FROM CRM_ADD_DO_MST AS CA
        //     INNER JOIN CRM_ADD_DO_ITEMS_MST AS C ON C.addDo_id = CA.id
        //     INNER JOIN MASTER_PRODUCT AS P ON P.id = C.product_master_id

        //     INNER JOIN MASTER_UOM AS T ON PV.uom_id = T.uom_id
        //     WHERE CA.proposal_id = ${proposal_id} AND CA.id = ${do_id}
        //     AND CA.createdAt = (SELECT MAX(createdAt) FROM CRM_ADD_DO_ITEMS_MST WHERE addDo_id = ${dataExist.id})
        // `);
        const [result] = await db.sequelize.query(`
            SELECT CA.*,CA.id AS do_id, BR.branch_name,BR.branch_gstnumber, CTR.countryss_name,ST.states_name,CTY.city_name,  
SCTR.countryss_name AS shipping_country_name,SST.states_name AS shipping_state_name,SCTY.city_name AS shipping_city_name,
                 C.proposal_no, C.mail_id, C.company_name, C.contact_number, C.contact_person_name, C.additional_charges, 
                 E.*, 
                 CSI.sales_invoice_no, CSI.sales_invoice_date
          FROM CRM_DELIVERY_CHALLAN_MST AS CA
          INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON C.id = CA.proposal_id
          INNER JOIN ENTITY_MASTER AS E ON E.id =${entity_id}
          LEFT JOIN CRM_SALES_INVOICE_MST AS CSI ON CSI.do_id = CA.id AND CSI.proposal_id = C.id
           INNER JOIN MASTER_COUNTRY AS CTR ON CA.customer_billing_country_id=CTR.countryss_id
          INNER JOIN MASTER_STATE AS ST ON CA.customer_billing_state_id =ST.states_id
          INNER JOIN MASTER_CITY AS CTY ON CA.customer_billing_city_id = CTY.city_id
        INNER JOIN MASTER_BRANCH AS BR ON CA.billing_branch_id = BR.id
            LEFT JOIN MASTER_COUNTRY AS SCTR ON CA.shipping_country_id=SCTR.countryss_id
          LEFT JOIN MASTER_STATE AS SST ON CA.shipping_state_id =SST.states_id
          LEFT JOIN MASTER_CITY AS SCTY ON CA.shipping_city_id = SCTY.city_id
          WHERE C.id = ${proposal_id} AND CA.id = ${do_id} 
          ORDER BY C.id DESC
      `);

        const [allResult] = await db.sequelize.query(`
          SELECT 
    C.*, 
    P.item_name AS product_name, 
    P.item_code AS product_code,
    MHSC.hsn_sac_code, 
    T.uom_name,
    
    (C.quantity * C.price_per_unit) AS amount, 
    
    COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0) AS discount_amount,
    
    (C.quantity * C.price_per_unit) 
    - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0) AS total_amount,
    
    COALESCE(
        ((C.quantity * C.price_per_unit) 
        - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
        * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 
        0
    ) AS tax_amount,
    
    COALESCE(
        ((C.quantity * C.price_per_unit) 
        - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)), 0
    ) 
    + COALESCE(
        ((C.quantity * C.price_per_unit) 
        - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
        * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0
    ) AS final_amount

FROM CRM_DELIVERY_CHALLAN_MST AS CA

INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C 
    ON C.sales_delivery_challan_id = CA.id

INNER JOIN MASTER_ITEM AS P 
    ON P.id = C.product_master_id

LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC 
    ON P.hsn_code_id = MHSC.id

INNER JOIN MASTER_UOM AS T 
    ON P.uom_id = T.uom_id

WHERE CA.proposal_id = ${proposal_id}
  AND CA.id = ${do_id}
  AND C.createdAt = (
    SELECT MAX(createdAt) 
    FROM CRM_DELIVERY_CHALLAN_ITEM_MST 
    WHERE sales_delivery_challan_id =${dataExist.id}
  );

      `);
        //   const [allResult] = await db.sequelize.query(`
        //       SELECT C.*, P.product_name, P.product_code,P.hsn_code_id,MHSC.hsn_sac_code,  T.uom_name,
        //           (C.quantity * C.price_per_unit) AS amount, 
        //           (COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) AS discount_amount,
        //           ((C.quantity * C.price_per_unit) - COALESCE((C.quantity * C.price_per_unit * C.discount_request / 100), 0)) AS total_amount,
        //           (COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS tax_amount,
        //           (COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)), 0) 
        //           + COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS final_amount
        //       FROM CRM_DELIVERY_CHALLAN_MST AS CA
        //       INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C ON C.sales_delivery_challan_id = CA.id
        //       INNER JOIN MASTER_PRODUCT AS P ON P.id = C.product_master_id

        //       INNER JOIN MASTER_UOM AS T ON P.uom_id = T.uom_id
        //       LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC ON P.hsn_code_id = MHSC.id
        //       WHERE CA.proposal_id = ${proposal_id} AND CA.id = ${do_id}
        //       AND CA.createdAt = (SELECT MAX(createdAt) FROM CRM_DELIVERY_CHALLAN_ITEM_MST WHERE sales_delivery_challan_id = ${dataExist.id})
        //   `);
        let additional_charges = await db.proposalAddtionalCharges.findAll({
            where: { proposal_id: proposal_id },
            include: [
                {
                    model: db.hsn_sac_master
                }
            ]
        })
        let pdfInvoiceResult = await sendPdfInvoice(result, allResult, res, urlData, additional_charges);
        console.log(result, "11111111111111111111111111111111111")
        console.log(urlData, "22222222222222222222222222222222")
        console.log(allResult, "33333333333333333333333333333333333333")

        if (result.length > 0) {
            return res.status(200).send({ code: 200, message: 'success', data: result, urlData, pdfInvoiceResult });
        } else {
            return res.status(404).send({ code: 404, message: 'data not found', data: result });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.createSalesInvoice = async (req, res) => {

    const transaction =
        await db.sequelize.transaction();

    try {

        const { payment_terms, id, financial_year_id, entity_id, customer_id, subtotal, discount_amount, taxable_amount, cgst_amount,
            sgst_amount, total_gst, igst_amount, grand_total, SALES_ORDER_ITEM_LIST_NEWs, selectedCurrency, shippingAddress, CRM_VERSION_PROPOSAL_MST, warehouseData, shipping_contact_person, billing_contact_person, utilize_amount, utilize_gross_dic_amt } = req.body;
        const billingAddress = CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST;

        const today = moment().format('YYYYMMDD');
        const currentDate = moment().format('YYYY-MM-DD');
        const lastRecord =
            await db.salesInvoiceData.findOne({ order: [['id', 'DESC']], transaction });

        let nextNumber = 1;

        if (lastRecord && lastRecord.sales_invoice_no) {

            const parts = lastRecord.sales_invoice_no.split('-');
            const lastIncrement = parseInt(parts[2] || 0);
            nextNumber = lastIncrement + 1;
        }

        const paddedNumber = String(nextNumber).padStart(4, '0');

        const invoiceNo = `INV-${today}-${paddedNumber}`;
        const billingState = await db.states.findOne({ where: { states_id: billingAddress?.billing_state_id } })
        const shippingState = await db.states.findOne({ where: { states_id: shippingAddress?.shipping_state_id } })
        const dispatchState = await db.locationMaster.findOne({
            where: { id: warehouseData?.location_id },
            include: [
                {
                    model: db.city,
                    include: [
                        {
                            model: db.states
                        }
                    ]
                }
            ]
        })
        const createData = await db.salesInvoiceData.create({
            sales_invoice_no: invoiceNo, sales_invoice_date: currentDate, payment_terms, so_id: id, financial_year_id, entity_id,
            payment_due_days: payment_terms,
            customer_id, created_by_id: req.userId, subtotal, discount_amount, taxable_amount, cgst_amount, sgst_amount, igst_amount,
            total_gst,
            grand_total,
            currency_id: selectedCurrency?.Currency_Convert_id, exchange_rate: selectedCurrency?.rate,
            utilize_advance_amount: utilize_amount,
            billing_address: billingAddress?.billing_address,
            billing_postal_address: billingAddress?.billing_postal_address,
            billing_state: billingState?.states_name,
            billing_gst: billingAddress?.gst_in,
            billing_state_id: billingAddress?.billing_state_id,
            billing_contact_person: billing_contact_person.split('|')[0],
            billing_contact_person_no: billing_contact_person.split('|')[1],
            shipping_address: shippingAddress?.shipping_address,
            shipping_postal_address: shippingAddress?.shipping_postal_address,
            shipping_state: shippingState?.states_name,
            shipping_gst: shippingAddress?.shipping_gst_in,
            shipping_state_id: shippingAddress?.shipping_state_id,
            shipping_contact_person: shipping_contact_person.split('|')[0],
            shipping_contact_person_no: shipping_contact_person.split('|')[1],
            utilize_gross_dic_amt,
            dispatch_address: warehouseData?.address,
            dispatch_postal_address: warehouseData?.postal_address?.Block + ',' + warehouseData?.postal_address?.Division,
            dispatch_state: warehouseData?.postal_address?.State,
            dispatch_gst: warehouseData?.gst,
            dispatch_state_id: dispatchState?.MASTER_CITY?.MASTER_STATE?.states_id
        }, { transaction });
        if (SALES_ORDER_ITEM_LIST_NEWs?.length) {
            for (const elem of SALES_ORDER_ITEM_LIST_NEWs) {
                let parentItemId = null;
                if (elem.parent_item_id) {
                    const parentItem = await db.salesInvoiceItem.findOne({
                        where: {
                            so_item_ids: elem.parent_item_id,   
                            invoice_id: createData.id
                        },
                        transaction
                    });

                    parentItemId = parentItem ? parentItem.id : null;
                }
                let ids = elem.id;
                //    if(soExist){
                delete elem.id;
                //    }
                const createdItem =
                    await db.salesInvoiceItem.create({

                        invoice_id: createData.id,

                        so_item_ids: ids,
                        ...elem,
                        parent_item_id: parentItemId

                    }, { transaction });
            }
        }

        await db.salesOrder.update(
            {
                invoice_status: 'APPROVED',
                invoice_no: invoiceNo
            },
            {
                where: {
                    id: id
                },
                transaction
            }
        );


        const currencyExist = await db.currency_convert.findOne({ where: { Currency_Convert_id: req.body?.selectedCurrency?.Currency_Convert_id }, attributes: ['Currency_Convert_id', 'rate'], transaction })
        const convertToINR = (amount) => {
            return Number((Number(amount || 0) / Number(currencyExist?.rate || 1)).toFixed(2));
        };

        const customerExist = await db.customerAddress.findOne({ where: { customer_id: customer_id, id: req.body.CRM_VERSION_PROPOSAL_MST?.billing_address_id }, attributes: ['id', 'customer_id', 'billing_state_id'], transaction })
        const customerShippingData = await db.customerShippingAddress.findOne({ where: { customer_id: customer_id, id: req.body.CRM_VERSION_PROPOSAL_MST?.shipping_address_id }, attributes: ['id', 'customer_id', 'shipping_state_id'], transaction })

        const isIntraState = customerShippingData?.shipping_state_id == customerExist?.billing_state_id;

        const receivableAmount = Number(grand_total || 0);
        const journalEntries = [];
        journalEntries.push(
            {
                debit_amount: convertToINR(receivableAmount),
                credit_amount: 0,
                entry_status: 'Sales Invoice',
                document_number: invoiceNo,
                chart_account_id: 168,
                party_type: 'CUSTOMER',
                customer_id,
                entity_id,
                financial_id: financial_year_id
            }
        );
        journalEntries.push(
            {
                debit_amount: 0,
                credit_amount: convertToINR(subtotal || 0),
                entry_status: 'Sales Invoice',
                document_number: invoiceNo,
                chart_account_id: 203,
                entity_id,
                financial_id: financial_year_id
            }
        );
        if (total_gst > 0) {
            if (isIntraState) {
                const divideGST = convertToINR(total_gst) / 2;
                journalEntries.push(
                    {
                        debit_amount: 0,
                        credit_amount: divideGST,
                        chart_account_id: 43,
                        entity_id,
                        entry_status: 'Sales Invoice',
                        document_number: invoiceNo,
                        financial_id: financial_year_id,
                        customer_id
                    });
                journalEntries.push(
                    {
                        debit_amount: 0,
                        credit_amount: divideGST,
                        chart_account_id: 23,
                        entity_id,
                        entry_status: 'Sales Invoice',
                        document_number: invoiceNo,
                        financial_id: financial_year_id,
                        customer_id
                    });
            } else {
                journalEntries.push({
                    debit_amount: 0,
                    credit_amount: convertToINR(total_gst),
                    chart_account_id: 31,
                    entity_id,
                    entry_status: 'Sales Invoice',
                    document_number: invoiceNo,
                    financial_id: financial_year_id,
                    customer_id
                });
            }
        }
        if (Number(discount_amount) > 0) {
            journalEntries.push(
                {
                    debit_amount: convertToINR(discount_amount),
                    credit_amount: 0,
                    entry_status: 'Sales Invoice',
                    document_number: invoiceNo,
                    chart_account_id: 201,
                    entity_id,
                    financial_id: financial_year_id
                }
            );
        }
        if (Number(utilize_amount) > 0) {
            journalEntries.push(
                {
                    debit_amount: convertToINR(utilize_amount),
                    credit_amount: 0,
                    entry_status: 'Sales Invoice',
                    document_number: invoiceNo,
                    chart_account_id: 50,
                    customer_id,
                    party_type: 'CUSTOMER',
                    entity_id,
                    financial_id: financial_year_id
                });
        }

        await db.financial_And_Account_Journal_List.bulkCreate(journalEntries, { transaction });
        await transaction.commit();

        return res.status(200).send({
            code: 200,
            message: 'Sales Invoice created successfully!',
        });

    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};
module.exports.createSalesInvoiceold = async (req, res) => {

    const transaction =
        await db.sequelize.transaction();

    try {

        const { payment_terms, so_id, financial_year_id, entity_id, customer_id, subtotal, discount_amount, taxable_amount, cgst_amount,
            sgst_amount, igst_amount, grand_total, productDetailList } = req.body;

        const today = moment().format('YYYYMMDD');
        const currentDate = moment().format('YYYY-MM-DD');
        const lastRecord =
            await db.salesInvoiceData.findOne({ order: [['id', 'DESC']], transaction });

        let nextNumber = 1;

        if (lastRecord && lastRecord.sales_invoice_no) {

            const parts = lastRecord.sales_invoice_no.split('-');
            const lastIncrement = parseInt(parts[2] || 0);
            nextNumber = lastIncrement + 1;
        }

        const paddedNumber = String(nextNumber).padStart(4, '0');

        const invoiceNo = `INV-${today}-${paddedNumber}`;

        const createData = await db.salesInvoiceData.create({
            sales_invoice_no: invoiceNo, sales_invoice_date: currentDate, payment_terms, so_id, financial_year_id, entity_id,
            payment_due_days: payment_terms,
            customer_id, created_by_id: req.userId, subtotal, discount_amount, taxable_amount, cgst_amount, sgst_amount, igst_amount,

            grand_total
        }, { transaction });

        if (productDetailList?.length) {

            for (const elem of productDetailList) {

                await db.salesInvoiceItem.create({

                    qty: elem.so_item_qty, price_per_unit: elem.price_per_unit, invoice_id: createData.id, so_item_id: elem.soi_id,

                    item_id: elem.product_master_id, igst: elem.igst
                }, { transaction });
                // if(elem.custom_branding.length){
                //     for (const element of elem.custom_branding) {
                //         if(element.branding_data){

                //         }
                //     }

                // } 
            }
        }
        await transaction.commit();

        return res.status(200).send({

            code: 200,
            message: 'Sales Invoice created successfully!',
        });

    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};


module.exports.getSalesInvoiceData = async (req, res) => {
    try {
        const { do_id, so_id, } = req.params;
        const invoiceData = await db.salesInvoiceData.findOne({
            where: { do_id, so_id, isDeleted: false }
        });
        if (invoiceData) {
            return res.status(200).send({ code: 200, data: invoiceData, message: 'Sales Invoice data fetched succesfully!' });
        } else {
            return res.status(201).send({ code: 404, message: 'Sales Invoice not found!' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getAllSalesInvoiceData = async (req, res) => {
    try {

        const invoiceData = await db.salesInvoiceData.findAll({
            where: { isDeleted: false },
            include: [
                {
                    model: db.salesOrder,
                    as: "sales_order"
                },
                {
                    model: db.customerProfile,
                    as: "customer"
                }
            ],
            order: [['id', 'DESC']]
        });

        if (!invoiceData?.length) {
            return res.status(404).send({
                code: 404,
                message: 'Sales Invoices not found!'
            });
        }

        const soIds = invoiceData.map(item => item.so_id);

        const vehiclePlanningData = await db.vehiclePlanningSo.findAll({
            where: {
                sale_order_id: soIds,
                isDeleted: false
            },
            attributes: ['sale_order_id'],
            raw: true
        });

        const vehiclePlanningSet = new Set(
            vehiclePlanningData.map(item => item.sale_order_id)
        );

        const result = invoiceData.map(item => ({
            ...item.toJSON(),
            vehiclePlanning: vehiclePlanningSet.has(item.so_id)
        }));

        return res.status(200).send({
            code: 200,
            data: result,
            message: 'Sales Invoices data fetched successfully!'
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};

module.exports.getAllPendingSalesInvoiceData = async (req, res) => {
    try {
        let status = req.params.status;

        const invoiceData = await db.salesInvoiceData.findAll({
            where: { isDeleted: false, status },
            attributes: [
                'id',
                'sales_invoice_no',
                'sales_invoice_date',
                'irn_no',
                'so_id',
                'do_id',
                'isEwayCreated',
                'status',
                ['createdAt', 'invoiceCreatedAt']
            ]
            // attribute:['id','sales_invoice_no','sales_invoice_date','irn_no','so_id','do_id',  ['createdAt', 'invoiceCreatedAt']]
        });

        if (!invoiceData || invoiceData.length === 0) {
            return res.status(201).send({ code: 201, message: 'Pending sales invoices not found!' });
        }

        const invoiceWithDetails = await Promise.all(invoiceData.map(async (invoice) => {
            let proposalCode = null;
            let companyName = invoice.customer_name;
            let deliveryChallanData = null;

            if (invoice.invoice_mode !== "DIRECT") {

                let soDetail = await db.salesOrder.findOne({
                    where: { id: invoice.so_id },
                    include: [
                        {
                            model: await db.proposalData,
                            include: [
                                {
                                    model: await db.customerProfile,
                                    as: 'customerData'
                                }
                            ],
                            as: 'proposalData'
                        },
                    ]
                })
                // const proposal = await db.proposalData.findOne({
                //     where: { id: invoice.proposal_id }
                // });
                console.log('so ====>', invoice.so_id)
                console.log('soDetail ====>', soDetail)
                if (soDetail) {
                    proposalCode = soDetail.proposalData.proposal_no;
                    companyName = soDetail.proposalData.customerData.company_name;
                }
                deliveryChallanData = await db.sales_delivery_challan.findOne({
                    where: { id: invoice.do_id }
                });
            }

            return {
                ...invoice.toJSON(),
                proposalCode,
                companyName,
                deliveryChallanData
            };
        }));

        return res.status(200).send({
            code: 200,
            data: invoiceWithDetails.reverse(),
            message: 'Pending sales data fetched successfully!'
        });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};
module.exports.getAllApprovedSalesInvoiceData = async (req, res) => {
    try {
        const invoiceData = await db.salesInvoiceData.findAll({
            where: { isDeleted: false, status: "APPROVED", isEwayCreated: 0 }
        });

        if (!invoiceData || invoiceData.length === 0) {
            return res.status(201).send({ code: 201, message: 'Approved sales invoices not found!' });
        }

        // Fetch proposal details for each invoice
        const invoiceWithProposal = await Promise.all(invoiceData.map(async (invoice) => {
            let soDetail = await db.salesOrder.findOne({
                where: { id: invoice.so_id },
                include: [
                    {
                        model: await db.proposalData,
                        include: [
                            {
                                model: await db.customerProfile,
                                as: 'customerData'
                            }
                        ],
                        as: 'proposalData'
                    },
                    {
                        model: db.sales_delivery_challan
                    }
                ]
            })
            // const proposal = await db.proposalData.findOne({
            //     where: { id: invoice.proposal_id }
            // });
            if (soDetail) {
                proposalCode = soDetail.proposalData.proposal_no;
                companyName = soDetail.proposalData.customerData.company_name;
            }
            return {
                ...invoice.toJSON(),
                proposalCode,
                billing_branch_id: soDetail?.CRM_DELIVERY_CHALLAN_MSTs[0]?.billing_branch_id,
                companyName
            };
        }));

        return res.status(200).send({
            code: 200,
            data: invoiceWithProposal.reverse(),
            message: 'Approved sales invoices data fetched successfully!'
        });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};





////////////////////////
module.exports.createDirectInvoice = async (req, res) => {
    try {
        let {
            entity_id,
            financial_year_id,
            sales_invoice_no,
            sales_invoice_date,
            customer_id,
            supply_type,
            customer_name,
            customer_code,
            transition_type,
            billing_branch,
            billing_country,
            billing_state,
            billing_city,
            billing_pin,
            billing_add1,
            billing_add2,
            supplier_gst,
            gst_supplier_name,
            trade_name,
            shipping_country,
            shipping_state,
            shipping_city,
            shipping_pin,
            shipping_add1,
            shipping_add2,
            notes,
            terms_and_conditions,
            items,
            chargesDetailList,
            do_type_id,
            invoice_doc,
            states_code,
            customer_billing_country,
            customer_billing_state,
            customer_billing_city,
            customer_billing_pin,
            customer_billing_add1,
            customer_billing_add2,
            customer_gst_number,
            additional_charges,
            total_discount,
            total_gst,
            grand_total,
            payment_terms,
        } = req.body;
        if (transition_type == 1) {
            (shipping_country = null),
                (shipping_state = null),
                (shipping_city = null),
                (shipping_pin = null),
                (shipping_add1 = null),
                (shipping_add2 = null);
        }
        const createData = await db.salesInvoiceData.create({
            sales_invoice_no,
            sales_invoice_date,
            supply_type_id: supply_type,
            customer_id,
            customer_name,
            customer_code,
            trans_type_id: transition_type,
            billing_branch_id: billing_branch,
            billing_country_id: billing_country,
            billing_state_id: billing_state,
            billing_city_id: billing_city,
            billing_pin,
            billing_add1,
            billing_add2,
            supplier_gst,
            gst_supplier_name,
            trade_name,
            do_type_id,
            shipping_country_id: shipping_country,
            shipping_state_id: shipping_state,
            shipping_city_id: shipping_city,
            shipping_pin,
            shipping_add1,
            shipping_add2,
            customer_billing_country_id: customer_billing_country,
            customer_billing_state_id: customer_billing_state,
            customer_billing_city_id: customer_billing_city,
            customer_billing_pin,
            customer_billing_add1,
            customer_billing_add2,
            notes,
            terms_and_conditions,
            entity_id,
            financial_year_id,
            invoice_doc,
            states_code,
            customer_gst_number,
            additional_charges,
            total_discount,
            total_gst,
            invoice_grand_total: grand_total,
            payment_terms,
            invoice_mode: "DIRECT",
        });

        await Promise.all(
            items.map(async (item) => {
                const {
                    product_category_id,
                    product_master_id,
                    variant_id,
                    product_sub_category_id,
                    hsn_code,
                    quantity,
                    discount,
                    igst,
                    gst,
                    sgst,
                    cgst,
                    price_per_unit,
                } = item;
                await db.salesDirectInvoiceItem.create({
                    sales_direct_invoice_id: createData.id,
                    product_category_id,
                    product_sub_category_id,
                    product_master_id,
                    variant_id,
                    hsn_code,
                    quantity,
                    maximum_discount: discount,
                    igst: igst ? igst : gst,
                    sgst,
                    cgst,
                    price_per_unit,
                });
            })
        );
        // await Promise.all(
        //     chargesDetailList.map(async (charges_list) => {
        //         const {
        //             charges_name,
        //             charges_amount,
        //             charges_hsn_id,
        //         } = charges_list;
        //         await db.salesDirectInvoiceCharges.create({
        //             sales_direct_invoice_id: createData.id,
        //             charges_name,
        //             charges_amount,
        //             charges_hsn_id,
        //         });
        //     })
        // );

        if (createData) {
            return res
                .status(200)
                .send({ code: 200, message: "Direct invoice created successfully!" });
        } else {
            return res.status(400).send({ code: 400, message: "Not created!" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const salesInvoiceData = await db.salesInvoiceData.findOne({
            where: { id: id },

            include: [
                {
                    model: db.customerProfile,
                    as: "customer"
                },
                {
                    model: db.salesInvoiceItem,
                    as: "items"
                },
                {
                    model: db.user,
                    as: "created_by"
                },
                {
                    model: db.salesOrder,
                    as: "sales_order",
                    include: [
                        {
                            model: db.customerAddressContact
                        },
                        {
                            model: db.versionData,
                            include: [
                                {
                                    model: db.customerShippingAddress
                                },
                                {
                                    model: db.customerAddress
                                }
                            ]
                        },
                    ]
                }
            ]
        });

        if (!salesInvoiceData) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const { pdfBuffer, fileName } = await generateSalesInvoicePdf(salesInvoiceData);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Content-Length": pdfBuffer.length
        });
        // res.setHeader("Content-Type","application/pdf");

        // res.setHeader("Content-Disposition",`attachment; filename="${fileName}"`);

        return res.send(pdfBuffer);

    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: error.message });
    }
};


function generateItemRows(items, level = 0, parentNo = "") {
    let rows = "";

    items.forEach((item, index) => {

        let rowNo = "";

        if (level === 0) {
            rowNo = `${index + 1}`;
        } else {
            rowNo = `${parentNo}${getAlpha(index)}`;
        }

        const total =
            (item.dataValues.qty || 0) *
            (
                (item.dataValues.price_per_unit || 0) -
                (item.dataValues.discount_per_unit || 0)
            );

        rows += `
      <tr>
        <td>${rowNo}</td>

        <td style="padding-left:${level * 25}px;">
          ${level > 0 ? "└ " : " "}
         &nbsp; ${item.dataValues.item_name || ""}
          <span style="color:#777">
            (${item.dataValues.item_type || ""})
          </span>
        </td>

        <td>${item.dataValues.hsncode || ""}</td>
        <td>${item.dataValues.igst || 0}</td>

        <td>
          ${item.dataValues.qty || 0}
          ${item.dataValues.UOM || ""}
        </td>

        <td style="text-align:right">
          ${Number(item.dataValues.price_per_unit || 0).toFixed(2)}
        </td>

        <td style="text-align:right">
          ${Number(item.dataValues.discount_per_unit || 0).toFixed(2)}
        </td>

        <td style="text-align:right">
          ${total.toFixed(2)}
        </td>
      </tr>
    `;

        if (item.children?.length) {
            rows += generateItemRows(
                item.children,
                level + 1,
                rowNo + "."
            );
        }
    });

    return rows;
}



async function generateSalesInvoicePdf(salesInvoiceData) {
    const htmlPath = path.join(__dirname, "../../utils/templates/salesInvoice.html");

    let htmlTemplate = fs.readFileSync(htmlPath, "utf8");

    const treeItems = buildTree(
        salesInvoiceData.items || []
    );

    const itemRows = generateItemRows(treeItems);

    let heading = "Sales Invoice";
    let elanName = salesInvoiceData?.dealer == 1 ? salesInvoiceData?.dealer_company_name : "Elan Professional Appliances Pvt. Ltd.";
    let mainAddress = salesInvoiceData?.dealer == 1 ? `${salesInvoiceData?.warehouse_address},${salesInvoiceData?.warehouse_postal_address},${salesInvoiceData?.warehouse_pin}` : 'Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004'

    let datas = salesInvoiceData?.sales_order
    let company_gstin = salesInvoiceData?.company_gstin;
    let billing = salesInvoiceData?.sales_order?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST
    let shipping = salesInvoiceData?.sales_order?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST
    const finalHtml = htmlTemplate.replace(/{{invoice_no}}/g, salesInvoiceData.sales_invoice_no || "")
        .replace(/{{customer_name}}/g, salesInvoiceData.customer?.company_name || "")
        .replace(/{{invoice_date}}/g, salesInvoiceData.sales_invoice_date || "")
        .replace(/{{warehouse_name}}/g, salesInvoiceData.warehouse_name || "")
        .replace(/{{net_amount}}/g, Number(salesInvoiceData.grand_total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, }))
        .replace(/{{gst_amount}}/g, Number(salesInvoiceData.total_gst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, }))
        .replace(/{{gross_amount}}/g, Number(salesInvoiceData.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, }))
        .replace(/{{itemRows}}/g, itemRows)
        .replace(/{{company_gstin}}/g, company_gstin ? company_gstin : '')
        .replace(/{{elanName}}/g, elanName)
        .replace(/{{mainAddress}}/g, mainAddress)
        .replace(/{{employee_official_email}}/g, salesInvoiceData?.created_by?.employee_official_email)
        .replace(/{{contact_number}}/g, salesInvoiceData?.created_by?.contact_number)
        .replace(/{{first_name}}/g, salesInvoiceData?.created_by?.first_name)
        .replace(/{{last_name}}/g, salesInvoiceData?.created_by?.last_name)
        .replace(/{{middel_name}}/g, salesInvoiceData?.created_by?.middel_name)
        .replace(/{{titles}}/g, salesInvoiceData?.created_by?.title)
        .replace(/{{contact_person_name}}/g, '')
        .replace(/{{billing_postal_address}}/g, salesInvoiceData?.billing_postal_address)
        .replace(/{{billing_address}}/g, salesInvoiceData?.billing_address)
        .replace(/{{billing_pin_code}}/g, billing?.billing_pin_code)
        .replace(/{{billing_gst_in}}/g, salesInvoiceData?.billing_gst ? salesInvoiceData?.billing_gst : '')
        .replace(/{{shipping_pin_code}}/g, shipping?.shipping_pin_code)
        .replace(/{{shipping_postal_address}}/g, salesInvoiceData?.shipping_postal_address)
        .replace(/{{shipping_address}}/g, salesInvoiceData?.shipping_address)
        .replace(/{{shipping_gst_in}}/g, salesInvoiceData?.shipping_gst ? salesInvoiceData?.shipping_gst : '')
        .replace(/{{mobile}}/g, salesInvoiceData?.billing_contact_person_no)
        .replace(/{{title}}/g, salesInvoiceData?.billing_contact_person);

    const pdfBuffer = await generatePDF(finalHtml);

    return {
        pdfBuffer,
        fileName: `Invoice-${salesInvoiceData.invoice_no}.pdf`
    };
}
function buildTree(data = []) {
    const map = new Map();
    const roots = [];

    data.forEach(item => {
        map.set(Number(item.so_item_ids), {
            ...item,
            children: []
        });
    });

    data.forEach(item => {
        const node = map.get(Number(item.so_item_ids));

        const parentId =
            item.parent_item_id == null ||
                item.parent_item_id === ""
                ? null
                : Number(item.parent_item_id);

        if (!parentId || !map.has(parentId)) {
            roots.push(node);
        } else {
            map.get(parentId).children.push(node);
        }
    });

    return roots;
}

function getAlpha(index) {
    return String.fromCharCode(97 + index);
}