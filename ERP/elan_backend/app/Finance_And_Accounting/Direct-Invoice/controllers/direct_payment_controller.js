const db = require("../../../models/index");
const logger = require('../../../../logger/index');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const { type } = require("os");




module.exports.getCompleteDirectInvoiceById = async(req,res)=>{
   try {
            const { id } = req.query;

           
    
                const [getData] = await db.sequelize.query(`SELECT DI.*, MB.bank_name,  CASE 
           WHEN DI.customer_code IS NOT NULL AND DI.customer_code != '' THEN COA.account_name
           ELSE NULL 
       END AS customer_name,

       CASE 
           WHEN DI.vendor_code IS NOT NULL AND DI.vendor_code != '' THEN COA.account_name
           ELSE NULL 
       END AS vendor_name,COA.account_code,MDT.document_type,MCC.Currency_Type FROM DIRECT_INVOICE AS DI
        LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = DI.coa_id
        LEFT JOIN MASTER_BANK AS MB ON MB.id = DI.bank_id
        LEFT JOIN MASTER_CURRENCY_CONVERT AS MCC ON MCC.Currency_Convert_id = DI.currency_id
        LEFT JOIN MASTER_DOCUMENT_TYPE AS MDT ON  MDT.id= DI.document_type_id

        WHERE DI.id = ${id}
        ORDER BY DI.createdAt DESC;`,
                )
                const [history] = await db.sequelize.query(
                    `SELECT S.*,DI.grandTotal, MB.bank_name
                    FROM SYS_DI_PAYMENT_MST AS S
                    INNER JOIN DIRECT_INVOICE AS DI ON S.invoice_id= DI.id
                    LEFT JOIN MASTER_BANK AS MB ON MB.id = S.bank_id
                    WHERE S.invoice_id = ${id}
                    `
                )
                const Obj={
                    ...getData[0],
                    historyBank:history
                }
                if (getData.length > 0) {
                    return res.status(200).send({ code: 200, message: "Data Retrieved Successfully", data: Obj });
                } else {
                    return res.status(200).send({ code: 404, message: "Record Not Found", data:getData});
                }
            
            
           
        } catch (error) {
            logger.error(`Error ${error.message}`, { error });
            return res.status(500).send({ code: 500, message: error.message || "Server Error" });
        }
}
module.exports.createPaymentDI = async(req,res)=>{
    try {
        
        const {date, payment_method, amount_paid, upload_document, terms, remarks, bank_id,invoice_id,entity_id,vendor_id,account_number_id,customer_id,cash_account_id,coa_id,isVendor,credit_due,currency_id} = req.body;
        let payload = {date, payment_method, amount_paid, upload_document, terms, remarks,invoice_id,entity_id,coa_id,
            isVendor};
        // if (!vendor_id == '') {
        //     payload.vendor_id = vendor_id;

        // }
        // if (!customer_id == '') {
        //     payload.customer_id = customer_id;

        // }

        let credit_due_amt = credit_due ||0;
        if (!bank_id == '') {
            payload.bank_id = bank_id;

        }
        if (!account_number_id == '') {
            payload.chart_account_id = account_number_id;

        }
        if (!cash_account_id == '') {
            payload.cash_account_id = cash_account_id;

        }

        let currencyRate = 0.00;

        if(currency_id){
            const currencyData = await db.currency_convert.findOne({
                where: {
                    Currency_Convert_id: currency_id
                }
            });

            if(currencyData){
                currencyRate = parseFloat(currencyData.rate).toFixed(2);

            }
        }

       let gl_amount = (parseFloat(amount_paid) * currencyRate).toFixed(2);

        const direct_invoice_exist = await db.directInvoice.findOne({where:{id:invoice_id}})
        
        let totalVAT = direct_invoice_exist?.totalVAT;
        const finalTotal = parseFloat(direct_invoice_exist.grandTotal)-parseFloat(amount_paid)
        const paymentExist = await db.direct_invoice_payment.findOne({where:{invoice_id:invoice_id},order:[['id','DESC']]})
        const receipt_no = 'IPMT' + Math.floor(100000 + Math.random() * 900000);
        payload.receipt_no = receipt_no;
        let newInvoiceStatus = ''
        if(!paymentExist){
            let Obj = {}
            let amountPaidIncCredit = parseFloat(amount_paid) + parseFloat(credit_due_amt)
            if(parseFloat(direct_invoice_exist.grandTotal) == amountPaidIncCredit){
                Obj.payment_status = "PAID"
                Obj.invoice_status = "PAID"

            }else{
                Obj.payment_status = "PARTIALLY PAID"
                Obj.invoice_status = "PARTIALLY PAID"

            }
            await db.directInvoice.update(Obj,{where:{id:invoice_id}})

            payload.amount_due = finalTotal
            

            const createDIPayment = await db.direct_invoice_payment.create(payload)
    
           
            if(!isVendor){
                let client_acc_id = coa_id;
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
    if(account_number_id){
         
                const parentAccount = await db.sequelize.query(`SELECT parent_account FROM CHART_OF_ACCOUNTS WHERE id = ?`,
                    {
                        replacements: [account_number_id], type: db.sequelize.QueryTypes.SELECT
                    }
                );
                let parent_account_id = parentAccount.length > 0 ? parentAccount[0].parent_account : null;
         
if(parent_account_id == 12 || parent_account_id == 13 || parent_account_id == 14 || parent_account_id == 35 || parent_account_id == 37){
    const journal = await db.financial_And_Account_Journal.create({
        journal_book_status: 'Other',
        journal_status: 'Other',
        journal_no: receipt_no,
        posting_date: date,
        entity_id: entity_id,
        currency_id: currency_id

    });

if(journal){
    await db.financial_And_Account_Journal_List.bulkCreate([
        {
            chart_account_id: account_number_id,
            credit_amount: 0.00,
            debit_amount: gl_amount,
            entity_id:entity_id,
            entry_status:'Sales Invoice Payment',
            journal_id: journal?.id,
            document_number: receipt_no,
            currency_id
          },
        {
          chart_account_id: client_acc_id,
          debit_amount: 0.00,
          credit_amount: gl_amount,
          entity_id:entity_id,
          entry_status:'Sales Invoice Payment',
          journal_id: journal?.id,
          document_number: receipt_no,
          currency_id
        }
       
      ]);
}


}
    }


                
    
                
                if(payment_method == 'Cash'){
                  let  typeData = cash_account_id
                if(client_acc_id && typeData ){

                    await db.financial_And_Account_Journal_List.bulkCreate([
                        {
                            chart_account_id: typeData,
                            credit_amount: 0.00,
                            debit_amount: gl_amount,
                            entity_id:entity_id,
                            entry_status:'Sales Invoice Payment',
                            document_number: receipt_no,
                            currency_id
                          },
                        {
                          chart_account_id: client_acc_id,
                          debit_amount: 0.00,
                          credit_amount: gl_amount,
                          entity_id:entity_id,
                          entry_status:'Sales Invoice Payment',
                          document_number: receipt_no,
                          currency_id
                        }
                       
                      ]);
                    }
                }
               }else if(isVendor){

                let vendor_acc_id = coa_id;
              
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
                if(account_number_id){
         
                    const parentAccount = await db.sequelize.query(`SELECT parent_account FROM CHART_OF_ACCOUNTS WHERE id = ?`,
                        {
                            replacements: [account_number_id], type: db.sequelize.QueryTypes.SELECT
                        }
                    );
                    let parent_account_id = parentAccount.length > 0 ? parentAccount[0].parent_account : null;
             
    if(parent_account_id == 12 || parent_account_id == 13 || parent_account_id == 14 || parent_account_id == 35 || parent_account_id == 37){
        const journal = await db.financial_And_Account_Journal.create({
            journal_book_status: 'Other',
            journal_status: 'Other',
            journal_no: receipt_no,
            posting_date: date,
            entity_id: entity_id,
            currency_id: currency_id
    
        });
    
    if(journal){
        await db.financial_And_Account_Journal_List.bulkCreate([
            {
                chart_account_id: vendor_acc_id,
                debit_amount: gl_amount,
                credit_amount: 0.00,
                journal_id: journal?.id,
                entity_id:entity_id,
                entry_status:'Purchase Invoice Payment',
                document_number: receipt_no,
                currency_id
              },
            {
                chart_account_id: account_number_id,
                credit_amount: gl_amount,
                debit_amount: 0.00,
                journal_id: journal?.id,
                entity_id:entity_id,
                entry_status:'Purchase Invoice Payment',
                document_number: receipt_no,
                currency_id
              },
        
           
          ]);
    }
    
    
    }
        }
                
                if(payment_method == 'Cash'){
                  let  typeData = cash_account_id
                
                if(vendor_acc_id && typeData){
                    
                    await db.financial_And_Account_Journal_List.bulkCreate([
                        {
                            chart_account_id: vendor_acc_id,
                            debit_amount: gl_amount,
                            credit_amount: 0.00,
                            entity_id:entity_id,
                            entry_status:'Purchase Invoice Payment',
                            document_number: receipt_no,
                            currency_id
                          },
                        {
                            chart_account_id: typeData,
                            credit_amount: gl_amount,
                            debit_amount: 0.00,
                            entity_id:entity_id,
                            entry_status:'Purchase Invoice Payment',
                            document_number: receipt_no,
                            currency_id
                          },
                    
                       
                      ]);
                }

            }

               }
            if(createDIPayment){
                return res.status(200).send({ code: 200, message: "Direct Invoice Payment Created Successfully" });
            }else{
                return res.status(200).send({ code: 404, message: "Payment not added!" });
            }
        }else{
            let Obj = {}
            let count = parseFloat(paymentExist.amount_due) - parseFloat(amount_paid) ;
            let amountPaidIncCredit = parseFloat(amount_paid) + parseFloat(credit_due_amt)
            if(parseFloat(paymentExist.amount_due) == amountPaidIncCredit){
                Obj.payment_status = "PAID"
                Obj.invoice_status = "PAID"

            }else{
                Obj.payment_status = "PARTIALLY PAID"
                Obj.invoice_status = "PARTIALLY PAID"
            }
            await db.directInvoice.update(Obj,{where:{id:invoice_id}})
            payload.amount_due = count
            
            const createDIPayment = await db.direct_invoice_payment.create(payload)
    
            if(!isVendor){
                let client_acc_id = coa_id;
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
    
                if(account_number_id){
         
                    const parentAccount = await db.sequelize.query(`SELECT parent_account FROM CHART_OF_ACCOUNTS WHERE id = ?`,
                        {
                            replacements: [account_number_id], type: db.sequelize.QueryTypes.SELECT
                        }
                    );
                    let parent_account_id = parentAccount.length > 0 ? parentAccount[0].parent_account : null;
             
    if(parent_account_id == 12 || parent_account_id == 13 || parent_account_id == 14 || parent_account_id == 35 || parent_account_id == 37){
        const journal = await db.financial_And_Account_Journal.create({
            journal_book_status: 'Other',
            journal_status: 'Other',
            journal_no: receipt_no,
            posting_date: date,
            entity_id: entity_id,
            currency_id: currency_id
    
        });
    
    if(journal){
        await db.financial_And_Account_Journal_List.bulkCreate([
            {
                chart_account_id: account_number_id,
                credit_amount: 0.00,
                debit_amount: gl_amount,
                journal_id: journal?.id,
                entity_id:entity_id,
                entry_status:'Sales Invoice Payment',
                document_number: receipt_no,
                currency_id
              },
            {
              chart_account_id: client_acc_id,
              debit_amount: 0.00,
              credit_amount: gl_amount,
              entity_id:entity_id,
              entry_status:'Sales Invoice Payment',
              document_number: receipt_no,
              currency_id
            }
           
          ]);
    }
    
    
    }
        }
    
                
                if(payment_method == 'Cash'){
                 let  typeData = cash_account_id
                
                if(client_acc_id && typeData){
                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: typeData,
                        credit_amount: 0.00,
                        debit_amount: gl_amount,
                        entity_id:entity_id,
                        entry_status:'Sales Invoice Payment',
                        document_number: receipt_no,
                        currency_id
                      },
                    {
                      chart_account_id: client_acc_id,
                      debit_amount: 0.00,
                      credit_amount: gl_amount,
                      entity_id:entity_id,
                      entry_status:'Sales Invoice Payment',
                      document_number: receipt_no,
                      currency_id
                    }
                   
                  ]);
                }
                }
               }else if(isVendor){

                let vendor_acc_id = coa_id;
              
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
                if(account_number_id){
         
                    const parentAccount = await db.sequelize.query(`SELECT parent_account FROM CHART_OF_ACCOUNTS WHERE id = ?`,
                        {
                            replacements: [account_number_id], type: db.sequelize.QueryTypes.SELECT
                        }
                    );
                    let parent_account_id = parentAccount.length > 0 ? parentAccount[0].parent_account : null;
             
    if(parent_account_id == 12 || parent_account_id == 13 || parent_account_id == 14 || parent_account_id == 35 || parent_account_id == 37){
        const journal = await db.financial_And_Account_Journal.create({
            journal_book_status: 'Other',
            journal_status: 'Other',
            journal_no: receipt_no,
            posting_date: date,
            entity_id: entity_id,
            currency_id: currency_id
    
        });
    
    if(journal){
        await db.financial_And_Account_Journal_List.bulkCreate([
            {
                chart_account_id: vendor_acc_id,
                debit_amount: gl_amount,
                credit_amount: 0.00,
                entity_id:entity_id,
                journal_id: journal?.id,
                entry_status:'Purchase Invoice Payment',
                document_number: receipt_no,
                currency_id
              },
            {
                chart_account_id: account_number_id,
                credit_amount: gl_amount,
                debit_amount: 0.00,
                entity_id:entity_id,
                journal_id: journal?.id,
                entry_status:'Purchase Invoice Payment',
                document_number: receipt_no,
                currency_id
              },
        
           
          ]);
    }
    
    
    }
        }
                
                if(payment_method == 'Cash'){
                  let  typeData = cash_account_id
                
                if(vendor_acc_id && typeData){
                    await db.financial_And_Account_Journal_List.bulkCreate([
                        {
                            chart_account_id: vendor_acc_id,
                            debit_amount: gl_amount,
                            credit_amount: 0.00,
                            entity_id:entity_id,
                            entry_status:'Purchase Invoice Payment',
                            document_number: receipt_no,
                            currency_id
                          },
                        {
                            chart_account_id: typeData,
                            credit_amount: gl_amount,
                            debit_amount: 0.00,
                            entity_id:entity_id,
                            entry_status:'Purchase Invoice Payment',
                            document_number: receipt_no,
                            currency_id
                          },
                    
                       
                      ]);
                }
            }
               }
            if(createDIPayment){
                return res.status(200).send({ code: 200, message: "Direct Invoice Payment Created Successfully" });
            }else{
                return res.status(200).send({ code: 404, message: "Payment not added!" });
            }
        }
       
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

module.exports.getDownloadPayments = async(req,res)=>{
    try {
        const {po_Id,version_id}= req.query;
        const [valueData] = await db.sequelize.query(
            `SELECT G.grn_number,G.invoiceDate,G.invoiceNo,G.invoiceDoc,G.po_Id,G.id,G.version_id,G.total_amount,P.advance_payment,
            P.po_number,P.po_date,P.vendor_id,V.vendor_name,G.uses_id,SUM(SP.amount_paid) AS paid_amount
            FROM GRN_MASTER AS G
            INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
            INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id=P.vendor_id
            INNER JOIN SYS_PO_PAYMENT_MST AS SP ON SP.invoice_id = G.id
            WHERE G.po_Id  =${po_Id} AND G.version_id=${version_id} `
        )
        const [getData] = await db.sequelize.query(
            `SELECT DISTINCT GI.id AS grn_item_id, GI.receiveQty, GI.invoice_qty,GI.amount,GI.total_mvp,PP.tax,PP.discount,
            COALESCE(GI.rejectQty, 0) AS rejectQty, GI.selection_item,GI.po_qty AS quantity,
            GI.invoice_status,I.item_name,I.manage_by,I.item_code,A.asset_category_name,
            GI.invoice_id, GI.item_id, GI.po_item_id, GI.version_id
            FROM GRN_MASTER AS G
            INNER JOIN GRN_ITEM AS GI ON GI.invoice_id=G.id
            INNER JOIN MASTER_ITEM AS I ON I.id = GI.item_id
            INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
            INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
            INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS PP ON PP.purchase_order_id=P.id
            WHERE P.id =${po_Id} AND GI.version_id=${version_id}
            `
        )
     
        const htmlFilePath = path.resolve(__dirname, "../../utils/template/invoice-2.html");
        const html = fs.readFileSync(htmlFilePath, "utf-8");
        const htmlWithData = html.replace(
          "{getData}",
          generateGrnTable(getData)
        ).replace("{po_no}", valueData[0].po_number)  
        .replace("{invoiceNo}",valueData[0].invoiceNo )
        .replace("{invoiceDate}", valueData[0].invoiceDate)
        .replace("{total_amount}", valueData[0].total_amount)
        .replace("{paid_amount}", valueData[0].paid_amount)
        .replace("{grand_amount}", valueData[0].total_amount)
        .replace("{balance}", valueData[0].total_amount)
        .replace("{old_amount}", valueData[0].total_amount)
        .replace("{new_amount}", valueData[0].total_amount - valueData[0].paid_amount)
        
        const browser = await puppeteer.launch({
            headless: true,  
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
 const page = await browser.newPage();
const pdfBuffer = await generatePDF(htmlWithData);


  const dirPath = path.resolve(__dirname, "../../utils/template/InvoicePdf");

const fileName = `invoice_${valueData[0].invoice_doc_code}.pdf`;
        const pdfPath = path.join(dirPath, fileName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(pdfPath, pdfBuffer);

        await page.setContent(htmlWithData);
        await browser.close();



return res.status(200).send({code:200, message: " Success",backend_url: pdfPath});

      

    } catch (error) {
        return res.status(500).send({code: 500, message: error.message })
    }
}

function generateGrnTable(getData) {
    let tableHTML = '';
    let counter = 1;
  
    tableHTML += `
      <table>
        <tr style="border-bottom: 2px solid black;  "width": 100%; "border-collapse": collapse; ">
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">S.NO.</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Item Code</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Item Name</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Quantity</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Price Sold</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Discount</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Amount</th>
        </tr>`;
  
    const combinedList = [
      ...getData
    ];
  
    combinedList.forEach((item) => {
  
      tableHTML += `
        <tr>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${counter++}</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.item_code || '-'}</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.item_name}</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.invoice_qty || 0}</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.discount || '-'}</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.total_mvp ||  0}</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.amount || 0}</td>
        </tr>`;
    });
  
    tableHTML += `</table>`;
    tableHTML += `</div>`;
  
    return tableHTML;
  }


  function generatePDF(htmlContent) {
    return new Promise((resolve, reject) => {
      pdf.create(htmlContent).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }