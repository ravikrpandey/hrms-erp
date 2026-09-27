
const db = require("../../../models/index");
const logger = require('../../../../logger/index');
const moment = require('moment');
const { where } = require("sequelize");


exports.createDirectInvoice = async (req, res) => {
    try {

        const { vendor_code,
            invoice_no,
            date_original,
            date_internal,
            date_expiry,
            currency,
            payment_mode,
            vendor_id,
            proforma_invoice_id,
            customer_id,
            cost_center_id,
            isVendorSelected,
            upload_doc,
            isItemSelected,
            customer_code,
            rows,
            document_type_id,
            location_id,
            bank_id,
            chart_account_id,
            totalAmount,
            entity_id,
            purchase_vat_account_id,
            purchase_account_id,
            cash_account_id,
            totalVAT,
            grandTotal } = req.body;

        const payload = {
            vendor_code,
            invoice_no,
            date_original,
            date_internal,
            date_expiry,
            currency,
            payment_mode,
            customer_code,
            isItemSelected,
            vendor_code,
            rows,
            document_type_id,
            currency_id: currency,
            location_id,
            totalAmount,
            totalVAT,
            grandTotal,
            upload_doc,
            isVendorSelected
        }

        if (!vendor_id == '') {
            payload.coa_id = vendor_id;

        }

        if(!proforma_invoice_id == ''){
            payload.proforma_invoice_id = proforma_invoice_id;
        }

         if(!cost_center_id == ''){
            payload.cost_center_id = cost_center_id;
         }

        if (!customer_id == '') {
            payload.coa_id = customer_id;

        }
        if (!bank_id == '') {
            payload.bank_id = bank_id;

        }
        if (!chart_account_id == '') {
            payload.chart_account_id = chart_account_id;

        }
        if (!purchase_vat_account_id == '') {
            payload.purchase_vat_account_id = purchase_vat_account_id;

        }
        if (!purchase_account_id == '') {
            payload.purchase_account_id = purchase_account_id;

        }
        if (!cash_account_id == '') {
            payload.cash_account_id = cash_account_id;

        }

        let currencyRate = 0.00;

        if (currency) {
            const currencyData = await db.currency_convert.findOne({
                where: {
                    Currency_Convert_id: currency
                }
            });

            if (currencyData) {
                currencyRate = parseFloat(currencyData.rate).toFixed(2);

            }
        }

        if (document_type_id === 16) {
            payload.isDebitNote = 1;
            payload.debit_no = invoice_no
            payload.directDebitNote = true
        }
        const isInvoiceExist = await db.directInvoice.findOne({
            where: {
                invoice_no: invoice_no
            }
        });
        if (isInvoiceExist) {
            return res.status(400).send({
                code: 400,
                message: 'Invoice/Debit number already exists.'
            });
        }

        const newInvoice = await db.directInvoice.create(payload);

        await Promise.all(
            rows.map((item) => {
                const {
                    item_category,
                    service_category,
                    service_id,
                    item_id,
                    referenceNo,
                    description,
                    quantity,
                    amount,
                    discount1,
                    discount2,
                    vatRate,
                    vatIncluded,
                    totalAmount
                } = item;

                const createObject = {
                    referenceNo,
                    description,
                    quantity,
                    amount,
                    discount1,
                    discount2,
                    vatRate,
                    vatIncluded,
                    direct_invoice_id: newInvoice.id,
                    totalAmount
                };

                // Only include item_category and item_id if they are provided and not empty
                if(isItemSelected){
                    if (item_category) createObject.item_category = item_category;
                    if (item_id) createObject.item_id = item_id;
                    return db.directInvoiceItems.create(createObject);
                }
               else{
                if (service_category) createObject.service_category = service_category;
                if (service_id) createObject.service_id = service_id;
                return db.directInvoiceService.create(createObject);
               }

               
            })
        );

        let cost_price = parseFloat(Number(totalAmount).toFixed(2));
        cost_price = cost_price * currencyRate;
        console.log(cost_price, 'cost-price');
        let calculatedVAT = totalVAT;
        if (calculatedVAT) {
            calculatedVAT = (parseFloat(calculatedVAT) * currencyRate).toFixed(2);
        }

        if (customer_id && document_type_id != 13) {

            //    for direct invoice cash sales
            if (cash_account_id || chart_account_id) {
                let sales_account_id;

                if (cost_price % 2835 === 0) {
                    sales_account_id = 3239;
                } else if (cost_price % 3780 === 0) {
                    sales_account_id = 3240;
                } else if (cost_price % 4095 === 0) {
                    sales_account_id = 3241;
                } else {
                    sales_account_id = 3242;
                }

//

   if(chart_account_id && document_type_id != 13){
         
                const parentAccount = await db.sequelize.query(`SELECT parent_account FROM CHART_OF_ACCOUNTS WHERE id = ?`,
                    {
                        replacements: [chart_account_id], type: db.sequelize.QueryTypes.SELECT
                    }
                );
                let parent_account_id = parentAccount.length > 0 ? parentAccount[0].parent_account : null;
         
if(parent_account_id == 12 || parent_account_id == 13 || parent_account_id == 14 || parent_account_id == 35 || parent_account_id == 37){
    const journal = await db.financial_And_Account_Journal.create({
        journal_book_status: 'Other',
        journal_status: 'Other',
        journal_no: invoice_no,
        posting_date: date_original,
        entity_id: entity_id,
        currency_id: currency

    });

if(journal){

    if(calculatedVAT){
        await db.financial_And_Account_Journal_List.bulkCreate([
            {
                chart_account_id: chart_account_id,
                credit_amount: 0.00,
                debit_amount: parseFloat(cost_price) + parseFloat(calculatedVAT),
                entity_id: entity_id,
                entry_status: 'Direct Invoice',
                
                document_number: invoice_no,
                currency_id: currency,
                journal_id: journal?.id
            },
            {
                chart_account_id: sales_account_id,
                debit_amount: 0.00,
                credit_amount: cost_price,
                entity_id: entity_id,
                entry_status: 'Direct Invoice',
                
                document_number: invoice_no,
                currency_id: currency,
                journal_id: journal?.id


            },

            {
                credit_amount: calculatedVAT,
                chart_account_id: 2513,
                entry_status: 'Direct Invoice',
                entity_id: entity_id,
                document_number: invoice_no,
                
                currency_id: currency,
                journal_id: journal?.id



            }

        ]);
    }
    else{
        await db.financial_And_Account_Journal_List.bulkCreate([
            {
                chart_account_id: typeData,
                credit_amount: 0.00,
                debit_amount: cost_price,
                entity_id: entity_id,
                entry_status: 'Direct Invoice',
                
                document_number: invoice_no,
                currency_id: currency,
                journal_id: journal?.id

            },
            {
                chart_account_id: sales_account_id,
                debit_amount: 0.00,
                credit_amount: cost_price,
                entity_id: entity_id,
                entry_status: 'Direct Invoice',
                
                document_number: invoice_no,
                currency_id: currency,
                journal_id: journal?.id


            }

        ]);
    }







}


}
    }




       //         
                if (payment_mode == 'CASH') {
                   let typeData = cash_account_id
                



                if(calculatedVAT){
                    await db.financial_And_Account_Journal_List.bulkCreate([
                        {
                            chart_account_id: typeData,
                            credit_amount: 0.00,
                            debit_amount: parseFloat(cost_price) + parseFloat(calculatedVAT),
                            entity_id: entity_id,
                            entry_status: 'Direct Invoice',
                            
                            document_number: invoice_no,
                            currency_id: currency
                        },
                        {
                            chart_account_id: sales_account_id,
                            debit_amount: 0.00,
                            credit_amount: cost_price,
                            entity_id: entity_id,
                            entry_status: 'Direct Invoice',
                            
                            document_number: invoice_no,
                            currency_id: currency
    
                        },
    
                        {
                            credit_amount: calculatedVAT,
                            chart_account_id: 2513,
                            entry_status: 'Direct Invoice',
                            entity_id: entity_id,
                            
                            document_number: invoice_no,
                            currency_id: currency
    
    
                        }
    
                    ]);
                }
                else{
                    await db.financial_And_Account_Journal_List.bulkCreate([
                        {
                            chart_account_id: typeData,
                            credit_amount: 0.00,
                            debit_amount: cost_price,
                            entity_id: entity_id,
                            entry_status: 'Direct Invoice',
                            document_number: invoice_no,
                            
                            currency_id: currency
                        },
                        {
                            chart_account_id: sales_account_id,
                            debit_amount: 0.00,
                            credit_amount: cost_price,
                            entity_id: entity_id,
                            entry_status: 'Direct Invoice',
                            
                            document_number: invoice_no,
                            currency_id: currency
    
                        }
    
                    ]);
                }
             
            
            }
            }


            else {

                // const customerQuery = await db.sequelize.query(
                //     `SELECT cc_account_code AS account_code FROM SALES_SUPER_USER_MST WHERE id = ?`,
                //     { replacements: [customer_id], type: db.sequelize.QueryTypes.SELECT }
                // );


                // if (customerQuery.length > 0) {
                //     let account_code = customerQuery[0]?.account_code;

                //     const clientAccount = await db.sequelize.query(
                //         `SELECT id FROM CHART_OF_ACCOUNTS WHERE account_code = ?`,
                //         { replacements: [account_code], type: db.sequelize.QueryTypes.SELECT }
                //     );

                //     client_acc_id = clientAccount.length > 0 ? clientAccount[0].id : null;
                // }

                client_acc_id = customer_id;
                let sales_account_id;

                if (cost_price % 2835 === 0) {
                    sales_account_id = 3239;
                } else if (cost_price % 3780 === 0) {
                    sales_account_id = 3240;
                } else if (cost_price % 4095 === 0) {
                    sales_account_id = 3241;
                } else {
                    sales_account_id = 3242;
                }

                if (client_acc_id && sales_account_id) {
                  


                    if (calculatedVAT) {
                        await db.financial_And_Account_Journal_List.bulkCreate([
                            {
    
                                debit_amount: parseFloat(calculatedVAT) + parseFloat(cost_price),  chart_account_id: client_acc_id, entry_status: 'Direct Invoice', entity_id, document_number: invoice_no, currency_id: currency
                            },
                            //    { credit_amount: cost_price, chart_account_id: 2513, entry_status: 'Direct Invoice', entity_id },
                            {
                                credit_amount: cost_price,  chart_account_id: sales_account_id, entry_status: 'Direct Invoice', entity_id, document_number: invoice_no, currency_id: currency
                            },
    
                            {
                                credit_amount: calculatedVAT,
                                chart_account_id: 2513,
                                entry_status: 'Direct Invoice',
                                
                                entity_id: entity_id,
                                document_number: invoice_no,
                                currency_id: currency
    
                            }
    
                        ]);
                    }

                    else{
                        await db.financial_And_Account_Journal_List.bulkCreate([
                            {
    
                                debit_amount: cost_price, chart_account_id: client_acc_id, entry_status: 'Direct Invoice', entity_id, document_number: invoice_no, currency_id: currency
                            },
                            //    { credit_amount: cost_price, chart_account_id: 2513, entry_status: 'Direct Invoice', entity_id },
                            {
                                credit_amount: cost_price , chart_account_id: sales_account_id, entry_status: 'Direct Invoice', entity_id, document_number: invoice_no, currency_id: currency
                            }
    
                        ]);
                    }
                }

            }
        }
        else if (vendor_id) {
            let vendor_acc_id = vendor_id;

            // const vendorQuery = await db.sequelize.query(
            //     `SELECT cc_account_code AS account_code FROM VENDOR_BASIC_DETAILS WHERE id = ?`,
            //     { replacements: [vendor_id], type: db.sequelize.QueryTypes.SELECT }
            // );


            // if (vendorQuery.length > 0) {
            //     let account_code = vendorQuery[0]?.account_code;

            //     const vendorAccount = await db.sequelize.query(
            //         `SELECT id FROM CHART_OF_ACCOUNTS WHERE account_code = ?`,
            //         { replacements: [account_code], type: db.sequelize.QueryTypes.SELECT }
            //     );

            //     vendor_acc_id = vendorAccount.length > 0 ? vendorAccount[0].id : null;
            // }

            if (vendor_acc_id && purchase_account_id) {


                if (calculatedVAT && purchase_vat_account_id) {
                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: purchase_account_id,
                        credit_amount: 0.00,
                        debit_amount: cost_price,
                        entity_id: entity_id,
                        entry_status: 'Direct Invoice Purchase',
                        cost_center_id: cost_center_id ? cost_center_id: null,
                        document_number: invoice_no,
                        currency_id: currency
                    },
                    {
                        chart_account_id: vendor_acc_id,
                        debit_amount: 0.00,
                        credit_amount: parseFloat(calculatedVAT) + parseFloat(cost_price),
                        entity_id: entity_id,
                        entry_status: 'Direct Invoice Purchase',
                        cost_center_id: cost_center_id ? cost_center_id: null,
                        document_number: invoice_no,
                        currency_id: currency

                    },
                    {
                        debit_amount: calculatedVAT,
                        chart_account_id: purchase_vat_account_id,
                        entry_status: 'Direct Invoice Purchase',
                        entity_id: entity_id,
                        document_number: invoice_no,
                        cost_center_id: cost_center_id ? cost_center_id: null,
                        currency_id: currency
    
                    }

                ]);
            }
            else{

                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: purchase_account_id,
                        credit_amount: 0.00,
                        debit_amount: cost_price,
                        entity_id: entity_id,
                        entry_status: 'Direct Invoice Purchase',
                        document_number: invoice_no,
                        cost_center_id: cost_center_id ? cost_center_id: null,
                        currency_id: currency
                    },
                    {
                        chart_account_id: vendor_acc_id,
                        debit_amount: 0.00,
                        credit_amount: cost_price,
                        cost_center_id: cost_center_id ? cost_center_id: null,
                        entity_id: entity_id,
                        entry_status: 'Direct Invoice Purchase',
                        document_number: invoice_no,
                        currency_id: currency

                    }

                ]);

            }
            }


        }
        else {





        }

        return res.status(200).send({
            code: 200,
            message: "Direct Invoice generated successfully!",
            data: newInvoice
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
}

exports.getAllDirectInvoices = async (req, res) => {
    try {
        // const invoices = await db.directInvoice.findAll({
        //     include: [
        //         {
        //             model: db.directInvoiceItems, 
        //             as: 'DIRECT_INVOICE_ITEMs'
        //         },
        //         {
        //             model: db.vendor_basic_details, 
        //             as: 'VENDOR_BASIC_DETAILS' 
        //         }
        //     ],
        //     order: [
        //         ['createdAt', 'DESC'] 
        //     ]
        // });
        const query = `SELECT DI.*,
             CASE 
           WHEN DI.customer_code IS NOT NULL AND DI.customer_code != '' THEN COA.account_name
           ELSE NULL 
       END AS customer_name,

       CASE 
           WHEN DI.vendor_code IS NOT NULL AND DI.vendor_code != '' THEN COA.account_name
           ELSE NULL 
       END AS vendor_name,
        
        MCC.Currency_Type,CASE 
            WHEN DI.credit_no IS NOT NULL THEN DI.credit_no 
            ELSE DI.debit_no 
        END AS credit_debit_no FROM DIRECT_INVOICE AS DI
        LEFT JOIN MASTER_CURRENCY_CONVERT AS MCC ON MCC.Currency_Convert_id = DI.currency_id
        LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = DI.coa_id
        WHERE DI.parentInvoiceNo is NULL OR DI.directDebitNote= 1
        ORDER BY DI.createdAt DESC;`
        const totalResults = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });
        if (query.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "All Direct Invoices retrieved successfully!",
                data: totalResults
            });
        } else {
            return res.status(400).send({
                code: 400,
                message: "No Data Found!",
                error: res.message
            });
        }


    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
}
exports.issueNote = async (req, res) => {
    try {


        const { isDebitNote, isCreditNote, cost_center_id, invoice_id, invoice_no, customer_id, vendor_id, purchase_account_id, entity_id, item, grandTotal,
            totalAmount, upload_doc, document_type_id,
            totalVAT } = req.body;
        item.forEach(e => {
            const amountAsString = String(e?.amount);
            const amountWithoutThousandSeparator = amountAsString.replace(/\./g, '');
            const formattedAmount = amountAsString.replace(/(\d+)\.(\d+)/, '$1,$2');
            e.amount = parseFloat(formattedAmount.replace(/\./g, '').replace(',', '.'));
        })
        const id = invoice_id;
        const amountAsString = String(item[0]?.amount);
        const amountWithoutThousandSeparator = amountAsString.replace(/\./g, '');

        const formattedAmount = amountAsString.replace(/(\d+)\.(\d+)/, '$1,$2');
        const amount = parseFloat(formattedAmount.replace(/\./g, '').replace(',', '.'));
        let gl_amount = Math.abs(grandTotal.toFixed(2));

        // const amount = item[0]?.amount;

        if (!invoice_id) {
            return res.status(400).send({
                code: 400,
                message: "Missing required parameter id"
            });
        }
        if (isDebitNote === undefined && isCreditNote === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Missing required query: isDebitNote or isCreditNote"
            });
        }
        const [direct_invoice] = 
            await db.sequelize.query(`SELECT DI.*,VBD.vendor_name,MDT.document_type,CBD.customer_name,CBD.customer_auto_code,MCC.Currency_Type FROM DIRECT_INVOICE AS DI
    LEFT JOIN VENDOR_BASIC_DETAILS AS VBD ON VBD.id = DI.vendor_id
    LEFT JOIN MASTER_DOCUMENT_TYPE AS MDT ON  MDT.id= DI.document_type_id
    LEFT JOIN MASTER_CURRENCY_CONVERT AS MCC ON MCC.Currency_Convert_id = DI.currency_id
    LEFT JOIN SALES_SUPER_USER_MST AS CBD ON CBD.id = DI.customer_id
    WHERE DI.id = ${id}
    ORDER BY DI.createdAt DESC;`)

        const [direct_invoice_items] = await db.sequelize.query(`
        SELECT DII.* FROM DIRECT_INVOICE AS DI
        LEFT JOIN DIRECT_INVOICE_ITEMS AS DII ON DI.id = DII.direct_invoice_id
        WHERE DI.id = ${id}
        ORDER BY DI.createdAt DESC;
        `)

        // const lastEntryCredit = await db.directInvoice.findOne({
        //     attributes: [[db.sequelize.fn('MAX', db.sequelize.col('credit_no')), 'maxCreditNo']],
        //     raw: true,
        // });

        // const lastEntryDebit = await db.directInvoice.findOne({
        //     attributes: [[db.sequelize.fn('MAX', db.sequelize.col('debit_no')), 'maxDebitNo']],
        //     raw: true,
        // });
        // let creditNumber,debitNumber;
        // if (lastEntryCredit.maxCreditNo) {
        //     const lastCode = parseInt(lastEntryCredit.maxCreditNo.split('NC')[1]);
        //     const newCode = lastCode + 1;
        //     creditNumber = 'NC' + newCode.toString().padStart(5, '0');
        // } else {
        //     creditNumber = `NC00001`;
        // }
        // if (lastEntryDebit.maxDebitNo) {
        //     const lastCode = parseInt(lastEntryDebit.maxDebitNo.split('ND')[1]);
        //     const newCode = lastCode + 1;
        //     debitNumber = 'ND' + newCode.toString().padStart(5, '0');
        // } else {
        //     debitNumber = `ND00001`;
        // }
        let currencyRate = 0.00;

        if (direct_invoice[0]?.currency_id) {
            const currencyData = await db.currency_convert.findOne({
                where: {
                    Currency_Convert_id: direct_invoice[0]?.currency_id
                }
            });

            if (currencyData) {
                currencyRate = parseFloat(currencyData.rate).toFixed(2);

            }
        }

        let converted_gl_amount = (parseFloat(gl_amount) * currencyRate).toFixed(2);



        const updateFields = {};
        let newInvoiceStatus = ''
        if (customer_id) {
            if (isCreditNote !== undefined) {
                if (parseFloat(direct_invoice[0].grandTotal) == parseInt(gl_amount)) {
                    updateFields.payment_status = "PAID"
                    updateFields.invoice_status = "PAID"
                    newInvoiceStatus = "PAID"

                } else {
                    updateFields.payment_status = "PARTIALLY PAID"
                    updateFields.invoice_status = "PARTIALLY RETURNED"
                    newInvoiceStatus = "PARTIALLY RETURNED"

                }
                let credit_due;
                if (direct_invoice[0].credit_due === null) {

                    credit_due = gl_amount
                } else {
                    credit_due = (parseFloat(direct_invoice[0].credit_due) + gl_amount)

                }
                const createDIPayment = await db.directInvoice.update({ credit_due: credit_due.toFixed(2) }, { where: { id: invoice_id } })
                updateFields.isCreditNote = 1;
                // updateFields.invoice_status = 'RETURNED';
                // updateFields.credit_no = creditNumber

            } else {
                updateFields.isDebitNote = 1;
                updateFields.debit_no = invoice_no

            }
        } else {    //Vendor Case
            if (isCreditNote !== undefined) {

                if (parseFloat(direct_invoice[0].grandTotal) == parseInt(gl_amount)) {
                    updateFields.payment_status = "PAID"
                    updateFields.invoice_status = "PAID"
                    newInvoiceStatus = "PAID"

                } else {
                    updateFields.payment_status = "PARTIALLY PAID"
                    updateFields.invoice_status = "PARTIALLY RETURNED"
                    newInvoiceStatus = "PARTIALLY RETURNED"

                }
                let credit_due;
                if (direct_invoice[0].credit_due === null) {

                    credit_due = gl_amount
                } else {
                    credit_due = (parseFloat(direct_invoice[0].credit_due) + gl_amount)

                }
                const createDIPayment = await db.directInvoice.update({ credit_due: credit_due }, { where: { id: invoice_id } })


                updateFields.isCreditNote = 1;
                // updateFields.credit_no = invoice_no;
                // updateFields.invoice_status = 'RETURNED';
                // updateFields.upload_doc = upload_doc;



            } else {
                updateFields.isDebitNote = 1;
                updateFields.debit_no = invoice_no;


            }
        }




        await db.directInvoice.update(updateFields, { where: { id: id } })
        //for debit note and credit note sales


        if (customer_id) {
            let sales_account_id;
            let client_acc_id = customer_id
            // const customerQuery = await db.sequelize.query(
            //     `SELECT cc_account_code AS account_code FROM SALES_SUPER_USER_MST WHERE id = ?`,
            //     { replacements: [customer_id], type: db.sequelize.QueryTypes.SELECT }
            // );


            // if (customerQuery.length > 0) {
            //     let account_code = customerQuery[0]?.account_code;

            //     const clientAccount = await db.sequelize.query(
            //         `SELECT id FROM CHART_OF_ACCOUNTS WHERE account_code = ?`,
            //         { replacements: [account_code], type: db.sequelize.QueryTypes.SELECT }
            //     );


            //     client_acc_id = clientAccount.length > 0 ? clientAccount[0].id : null;
            // }



            if (amount % 2835 === 0) {
                sales_account_id = 3239;
            } else if (amount % 3780 === 0) {
                sales_account_id = 3240;
            } else if (amount % 4095 === 0) {
                sales_account_id = 3241;
            } else {
                sales_account_id = 3242;
            }







            if (isDebitNote && client_acc_id) {

                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: client_acc_id,
                        credit_amount: 0.00,
                        debit_amount: converted_gl_amount,
                        entity_id: entity_id,
                        entry_status: 'Sales Debit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    },
                    {
                        chart_account_id: sales_account_id,
                        debit_amount: 0.00,
                        credit_amount: converted_gl_amount,
                        entity_id: entity_id,
                        entry_status: 'Sales Debit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    }

                ]);

                //new column add
                delete direct_invoice[0].id
                // delete direct_invoice_items.id
                const formattedDate = moment().format('YYYY-MM-DD HH:mm:ss');
                const newInvoiceData = {
                    ...direct_invoice[0],
                    grandTotal,
                    totalAmount,
                    debit_no: invoice_no,
                    totalVAT,
                    purchase_account_id,
                    upload_doc,
                    parentInvoiceNo: direct_invoice[0]?.invoice_no,
                    createdAt: formattedDate,
                    document_type_id,
                    isDebitNote: 1,
                    directDebitNote: 1

                };
                const newInvoice = await db.directInvoice.create(newInvoiceData);
             
                await Promise.all(
                    item.map((item) => {
                        const {
                            item_category,
                            service_category,
                            service_id,
                            item_id,
                            referenceNo,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            totalAmount
                        } = item;

                        const createObject = {
                            referenceNo,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            direct_invoice_id: newInvoice.id,
                            totalAmount
                        };

let itemSelected = direct_invoice[0]?.isItemSelected;
if(itemSelected){
                    if (item_category) createObject.item_category = item_category;
                    if (item_id) createObject.item_id = item_id;
                    return db.directInvoiceItems.create(createObject);
                }
               else{
                if (service_category) createObject.service_category = service_category;
                if (service_id) createObject.service_id = service_id;
                return db.directInvoiceService.create(createObject);
               }

                    })
                );

            }

            if (isCreditNote && client_acc_id) {

                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: client_acc_id,
                        credit_amount: converted_gl_amount,
                        debit_amount: 0.00,
                        entity_id: entity_id,
                        entry_status: 'Sales Credit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    },
                    {
                        chart_account_id: sales_account_id,
                        debit_amount: converted_gl_amount,
                        credit_amount: 0.00,
                        entity_id: entity_id,
                        entry_status: 'Sales Credit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    }

                ]);

                //new column add RETURNED Case Customer
                delete direct_invoice[0].id
                // delete direct_invoice_items.id
                const formattedDate = moment().format('YYYY-MM-DD HH:mm:ss');
                const newInvoiceData = {
                    ...direct_invoice[0],
                    grandTotal,
                    totalAmount,
                    credit_no: invoice_no,
                    isCreditNote: true,
                    invoice_status: newInvoiceStatus,
                    totalVAT,
                    purchase_account_id,
                    upload_doc,
                    parentInvoiceNo: direct_invoice[0]?.invoice_no,
                    createdAt: formattedDate,
                    document_type_id

                };
                const newInvoice = await db.directInvoice.create(newInvoiceData);

                await Promise.all(
                    item.map((item) => {
                        const {
                            item_category,
                            item_id,
                            service_category,
                            service_id,
                            referenceNo,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            totalAmount
                        } = item;

                        const createObject = {
                            referenceNo,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            direct_invoice_id: newInvoice.id,
                            totalAmount
                        };

                        let itemSelected = direct_invoice[0]?.isItemSelected;
if(itemSelected){
                    if (item_category) createObject.item_category = item_category;
                    if (item_id) createObject.item_id = item_id;
                    return db.directInvoiceItems.create(createObject);
                }
               else{
                if (service_category) createObject.service_category = service_category;
                if (service_id) createObject.service_id = service_id;
                return db.directInvoiceService.create(createObject);
               }

                    
                    })
                );
            }


        } else if (vendor_id && purchase_account_id) {
            let vendor_acc_id = vendor_id;

            // const vendorQuery = await db.sequelize.query(
            //     `SELECT cc_account_code AS account_code FROM VENDOR_BASIC_DETAILS WHERE id = ?`,
            //     { replacements: [vendor_id], type: db.sequelize.QueryTypes.SELECT }
            // );


            // if (vendorQuery.length > 0) {
            //     let account_code = vendorQuery[0]?.account_code;

            //     const vendorAccount = await db.sequelize.query(
            //         `SELECT id FROM CHART_OF_ACCOUNTS WHERE account_code = ?`,
            //         { replacements: [account_code], type: db.sequelize.QueryTypes.SELECT }
            //     );

            //     vendor_acc_id = vendorAccount.length > 0 ? vendorAccount[0].id : null;
            // }



            if (isDebitNote && vendor_acc_id) {

                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: vendor_acc_id,
                        credit_amount: 0.00,
                        debit_amount: converted_gl_amount,
                        entity_id: entity_id,
                        entry_status: 'Purchase Debit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    },
                    {
                        chart_account_id: purchase_account_id,
                        debit_amount: 0.00,
                        credit_amount: converted_gl_amount,
                        entity_id: entity_id,
                        entry_status: 'Purchase Debit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    }

                ]);
                //new column add
                delete direct_invoice[0].id
                // delete direct_invoice_items.id
                const formattedDate = moment().format('YYYY-MM-DD HH:mm:ss');

                const newInvoiceData = {
                    ...direct_invoice[0],
                    grandTotal,
                    totalAmount,
                    debit_no: invoice_no,
                    totalVAT,
                    purchase_account_id,
                    upload_doc,
                    parentInvoiceNo: direct_invoice[0]?.invoice_no,
                    createdAt: formattedDate,
                    document_type_id,
                    isDebitNote: 1,
                    directDebitNote: 1

                };
                const newInvoice = await db.directInvoice.create(newInvoiceData);

                await Promise.all(
                    item.map((item) => {
                        const {
                            item_category,
                            item_id,
                            referenceNo,
                            service_category,
                            service_id,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            totalAmount
                        } = item;

                        const createObject = {
                            referenceNo,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            direct_invoice_id: newInvoice.id,
                            totalAmount
                        };

                        let itemSelected = direct_invoice[0]?.isItemSelected;
                        if(itemSelected){
                                            if (item_category) createObject.item_category = item_category;
                                            if (item_id) createObject.item_id = item_id;
                                            return db.directInvoiceItems.create(createObject);
                                        }
                                       else{
                                        if (service_category) createObject.service_category = service_category;
                                        if (service_id) createObject.service_id = service_id;
                                        return db.directInvoiceService.create(createObject);
                                       }
                    })
                );
            }

            if (isCreditNote && vendor_acc_id) {

                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: purchase_account_id,
                        credit_amount: converted_gl_amount,
                        debit_amount: 0.00,
                        entity_id: entity_id,
                        entry_status: 'Purchase Credit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    },
                    {
                        chart_account_id: vendor_acc_id,
                        debit_amount: converted_gl_amount,
                        credit_amount: 0.00,
                        entity_id: entity_id,
                        entry_status: 'Purchase Credit Note',
                        document_number: invoice_no,
                        currency_id: direct_invoice[0]?.currency_id
                    }

                ]);
                //new column add RETURNED Case Vendor
                delete direct_invoice[0].id
                // delete direct_invoice_items.id
                const formattedDate = moment().format('YYYY-MM-DD HH:mm:ss');
                const newInvoiceData = {
                    ...direct_invoice[0],
                    grandTotal,
                    totalAmount,
                    credit_no: invoice_no,
                    isCreditNote: true,
                    invoice_status: newInvoiceStatus,
                    totalVAT,
                    purchase_account_id,
                    upload_doc,
                    parentInvoiceNo: direct_invoice[0]?.invoice_no,
                    createdAt: formattedDate,
                    document_type_id

                };
                const newInvoice = await db.directInvoice.create(newInvoiceData);

                await Promise.all(
                    item.map((item) => {
                        const {
                            item_category,
                            item_id,
                            referenceNo,
                            service_category,
                            service_id,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            totalAmount
                        } = item;

                        const createObject = {
                            referenceNo,
                            description,
                            quantity,
                            amount,
                            discount1,
                            discount2,
                            vatRate,
                            vatIncluded,
                            direct_invoice_id: newInvoice.id,
                            totalAmount
                        };

                        let itemSelected = direct_invoice[0]?.isItemSelected;
                        if(itemSelected){
                                            if (item_category) createObject.item_category = item_category;
                                            if (item_id) createObject.item_id = item_id;
                                            return db.directInvoiceItems.create(createObject);
                                        }
                                       else{
                                        if (service_category) createObject.service_category = service_category;
                                        if (service_id) createObject.service_id = service_id;
                                        return db.directInvoiceService.create(createObject);
                                       }
                    })
                );

            }
        }
        return res.status(200).send({
            code: 200,
            message: "Successfully updated the invoice fields.",
        });



    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
}
exports.get_Purchase_Account_List = async (req, res) => {
    try {
        const query = `SELECT id, account_name FROM CHART_OF_ACCOUNTS WHERE id IN (2507 , 2508 , 2509) AND status = 'ACTIVE' AND  isDeleted = '0' AND is_group = 'no' `;


        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};
exports.get_Purchase_VAT_Account_List = async (req, res) => {
    try {
        const query = `SELECT id, account_name FROM CHART_OF_ACCOUNTS WHERE id IN (2510 , 2511) AND status = 'ACTIVE' AND  isDeleted = '0' AND is_group = 'no' `;


        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: data,
                });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};
exports.getDirectInvoice = async (req, res) => {
    try {
        const { id, vendor_code } = req.query;
        if (!id && !vendor_code) {
            return res.status(400).send({
                code: 400,
                message: "Either id or vendor_code is required"
            });
        }

        const [direct_invoice] =
            await db.sequelize.query(`SELECT 
    DI.*, 
    CASE 
        WHEN DI.customer_code IS NOT NULL AND DI.customer_code != '' THEN COA.account_name
        ELSE NULL 
    END AS customer_name,
    VBD.vendor_address, 
    VBD.vendor_contact_num,
    CBD.customer_address, 
    CBD.customer_contact_num,
    CASE 
        WHEN DI.vendor_code IS NOT NULL AND DI.vendor_code != '' THEN COA.account_name
        ELSE NULL 
    END AS vendor_name,
    MDT.document_type,
    MCC.Currency_Type,
    COA.account_code 
FROM 
    DIRECT_INVOICE AS DI
LEFT JOIN 
    CHART_OF_ACCOUNTS AS COA ON COA.id = DI.coa_id
LEFT JOIN 
    SALES_SUPER_USER_MST AS CBD ON (
        CBD.cc_account_code = COA.account_code OR 
        CBD.sns_details_security = COA.account_code OR 
        CBD.pgc_account = COA.account_code
    )
LEFT JOIN 
    VENDOR_BASIC_DETAILS AS VBD ON (
        VBD.cc_account_code = COA.account_code OR 
        VBD.sns_details_security = COA.account_code OR 
        VBD.pgc_account = COA.account_code
    )
LEFT JOIN 
    MASTER_DOCUMENT_TYPE AS MDT ON MDT.id = DI.document_type_id
LEFT JOIN 
    MASTER_CURRENCY_CONVERT AS MCC ON MCC.Currency_Convert_id = DI.currency_id
WHERE 
    DI.id = ${id}
ORDER BY 
    DI.createdAt DESC;`)

    let direct_invoice_items;

    if(direct_invoice){
        let isItemSelected = direct_invoice[0]?.isItemSelected
if(isItemSelected){
    [direct_invoice_items] = await db.sequelize.query(`
        SELECT DII.* FROM DIRECT_INVOICE AS DI
        LEFT JOIN DIRECT_INVOICE_ITEMS AS DII ON DI.id = DII.direct_invoice_id
        WHERE DI.id = ${id}
        ORDER BY DI.createdAt DESC;
        `)
}
else{
    [direct_invoice_items] = await db.sequelize.query(`
     SELECT * FROM DIRECT_INVOICE_SERVICE WHERE direct_invoice_id = ${id}
     ORDER BY createdAt DESC;`)
}

    }



    


        if (!direct_invoice && !direct_invoice_items) {
            return res.status(404).send({
                code: 404,
                message: "Invoice not found"
            });
        }

        return res.status(200).send({
            code: 200,
            message: "Direct Invoice retrieved successfully!",
            data: direct_invoice[0],
            items: direct_invoice_items
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
}

exports.generateDirectInvoiceNumber = async (req, res) => {
    try {
        const id = req.params.id;
        let lastEntry;
        const prefixMapping = {
            12: 'FT',
            13: 'FP',
            14: 'NE',
            15: 'NC',
            16: 'ND',
            17: 'VVM',
            18: 'VV',
        };
        const prefix = prefixMapping[id] || 'FT';
        if (id === '12') {

       lastEntry = await db.directInvoice.findOne({
    where: {
        invoice_no: {
            [db.Sequelize.Op.like]: `${prefix}%`
        },
        invoice_type: 'DIRECT',
        isVendorSelected: false 
    },
    order: [["createdAt", "DESC"]],
    attributes: ["invoice_no"],
});

        }
          else if (id === '13') {

       lastEntry = await db.directInvoice.findOne({
    where: {
        invoice_no: {
            [db.Sequelize.Op.like]: `${prefix}%`
        },
        invoice_type: 'DIRECT',
        isVendorSelected: false 
    },
    order: [["createdAt", "DESC"]],
    attributes: ["invoice_no"],
});

        }
        
        else if (id === '15') {
            lastEntry = await db.directInvoice.findOne({
                where: {
                    credit_no: {
                        [db.Sequelize.Op.like]: `${prefix}%`
                    }
                },
                order: [["createdAt", "DESC"]],
                attributes: ["credit_no"],
            });
        } else if (id === '16') {
            lastEntry = await db.directInvoice.findOne({
                where: {
                    debit_no: {
                        [db.Sequelize.Op.like]: `${prefix}%`
                    }
                },
                order: [["createdAt", "DESC"]],
                attributes: ["debit_no"],
            });
        }
        let number, lastCode;
        if (lastEntry) {
            if (lastEntry?.invoice_no) lastCode = parseInt(lastEntry.invoice_no.split(prefix)[1]);
            if (lastEntry?.credit_no) lastCode = parseInt(lastEntry.credit_no.split(prefix)[1]);
            if (lastEntry?.debit_no) lastCode = parseInt(lastEntry.debit_no.split(prefix)[1]);


            const newCode = lastCode + 1;
            number = `${prefix}${newCode.toString().padStart(5, '0')}`;
        } else {
            number = `${prefix}00001`;
        }
        return res.status(200).send({ code: 200, message: "Direct Invoice Number Generated", data: number });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};
exports.isChartOfAccountExist = async (req, res) => {
    try {
        let account_code = req.params?.account_code;
        let isVendor = req.params?.isVendor;
        let query;
        if (isVendor) {

            [query] = await db.sequelize.query(`SELECT vendor_auto_code AS code FROM VENDOR_BASIC_DETAILS WHERE cc_account_code = ${account_code} OR sns_details_security = ${account_code}
OR pgc_account = ${account_code} AND isDeleted = 0 AND status = 'ACTIVE'`);
        } else {
            [query] = await db.sequelize.query(`SELECT customer_auto_code AS code FROM SALES_SUPER_USER_MST WHERE cc_account_code = ${account_code} OR sns_details_security = ${account_code}
OR pgc_account = ${account_code} AND isDeleted = 0 AND status = 'ACTIVE'`);
        }
        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {

            return res.status(400).send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};
exports.getCustomerCOA = async (req, res) => {
    try {
        const [query] = await db.sequelize.query(`
            SELECT id ,  CONCAT (account_code, ' - ', account_name) AS account_name,account_code FROM CHART_OF_ACCOUNTS 
WHERE is_group = 'no'  AND isDeleted = 0 AND status = 'ACTIVE' ;


`);
        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {

            return res.status(400).send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};







exports.getProformaInvoiceById = async (req, res) => {
    try {
        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT DI.id, DI.coa_id, CONCAT(DI.invoice_no, ' - ', COA.account_name) AS proforma_invoice_no  FROM DIRECT_INVOICE AS DI
    INNER JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = DI.coa_id
    WHERE DI.document_type_id = 13 AND DI.isVendorSelected = false AND DI.coa_id = ${id} ORDER BY DI.createdAt DESC;`);
        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {

            return res.status(400).send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};





exports.getVendorCOA = async (req, res) => {
    try {
        const [query] = await db.sequelize.query(`SELECT id ,  CONCAT (account_code, ' - ', account_name) AS account_name,account_code FROM CHART_OF_ACCOUNTS 
WHERE is_group = 'no'  AND isDeleted = 0 AND status = 'ACTIVE' AND parent_account in (51)`);
        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {

            return res.status(400).send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};
exports.getIssueNotes = async (req, res) => {
    try {
        const invoice_no = req.params?.invoice_no;
        const [query] = await db.sequelize.query(`SELECT 
            CASE 
           WHEN DI.customer_code IS NOT NULL AND DI.customer_code != '' THEN COA.account_name
           ELSE NULL 
       END AS customer_name,

       CASE 
           WHEN DI.vendor_code IS NOT NULL AND DI.vendor_code != '' THEN COA.account_name
           ELSE NULL 
       END AS vendor_name,
       CASE 
            WHEN DI.credit_no IS NOT NULL THEN DI.credit_no 
            ELSE DI.debit_no 
        END AS credit_debit_no,
            
            DI.* FROM DIRECT_INVOICE AS DI 
            LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = DI.coa_id
WHERE DI.parentInvoiceNo = '${invoice_no}'`);
        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Issue Note Data Successfully !",
                    data: query,
                });
        } else {

            return res.status(400).send({ code: 404, message: "Records Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};
exports.getNuitNo = async (req, res) => {
    try {
        const { isVendor, account_code } = req.query;
        let query;
        if (isVendor !== '1') {

            [query] = await db.sequelize.query(`SELECT CBDM.nuit_number FROM SALES_SUPER_USER_MST AS CBD
LEFT JOIN CUSTOMER_BANK_DETAILS_MAPPING AS CBDM ON CBDM.customer_basic_id = CBD.id
WHERE CBD.cc_account_code = ${account_code} OR CBD.sns_details_security = ${account_code}
OR CBD.pgc_account = ${account_code} AND CBD.isDeleted = 0 AND CBD.status = 'ACTIVE'`);
        } else {

            [query] = await db.sequelize.query(`SELECT VBDM.nuit_number FROM VENDOR_BASIC_DETAILS AS VBD
                LEFT JOIN VENDOR_BANK_DETAILS_MAPPING AS VBDM ON VBDM.vendor_basic_id = VBD.id
                WHERE VBD.cc_account_code = ${account_code} OR VBD.sns_details_security = ${account_code}
                OR VBD.pgc_account = ${account_code} AND VBD.isDeleted = 0 AND VBD.status = 'ACTIVE'`);

        }
        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched NUI Data Successfully !",
                    data: query,
                });
        } else {

            return res.status(400).send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};