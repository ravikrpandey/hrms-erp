const db = require('../../../models/index')
const { Op } = require('sequelize');
const path = require("path");
const fs = require("fs");
const { generatePDF } = require("../../../../app/common/pdfConverter");

module.exports.createPaymentAdvice = async(req,res)=>{
  const transaction =await db.sequelize.transaction();
    try {
        const {posting_date,amount_due, document_number,others, transaction_date, notes, reference_date, reference,journalDocument,document_type,  branch_id, entity_id,voucher_id,Account_details,manage_advance, party_type, vendor_id, customer_id, po_id, grn_id, invoice_id, sales_order_id, delivery_order_id, sales_invoice_id,document_value
        } = req.body; 
        
        let vendorExist;
        let account_id

        if(vendor_id){
          vendorExist = await db.vendor_basic_details.findOne({where:{id:vendor_id},attributes:['id','chart_of_account_id','advanced_chart_of_account_id'],transaction})
        }
        if(document_type == 'PO' || document_type == 'GRN'){
          account_id = vendorExist.advanced_chart_of_account_id
        }
        if(document_type=='INVOICES'){
          account_id = vendorExist.chart_of_account_id
        }
if(po_id){
  const poExist = await db.purchase_order.findOne({where:{id:po_id},attributes:['id','payment_term','total_purchase','vendor_id'],transaction});
        
  const [cashPaymentAccountExist] = await db.sequelize.query(`
    SELECT 
${po_id} AS po_id,
SUM(total_amount) AS total_amount
FROM (

SELECT SUM(CP.credit_amount) AS total_amount
FROM CASH_PAYMENT AS C
INNER JOIN CASH_PAYMENT_ACCOUNT_LIST AS CP 
ON CP.cash_payment_id = C.id
WHERE C.po_id = ${po_id}

UNION ALL

SELECT SUM(CP.credit_amount) AS total_amount
FROM BANK_PAYMENT AS C
INNER JOIN BANK_PAYMENT_ACCOUNT_LIST AS CP 
ON CP.bank_payment_id = C.id
WHERE C.po_id = ${po_id}

UNION ALL

SELECT SUM(CP.debit_amount) AS total_amount
FROM PAYMENT_ADVICE AS C
INNER JOIN PAYMENT_ADVICE_ACCOUNT_LIST AS CP 
ON CP.payment_advice_id = C.id
WHERE C.po_id = ${po_id}

) AS combined;
`)
if(cashPaymentAccountExist){
  if(parseFloat(poExist.total_purchase) == parseFloat(cashPaymentAccountExist[0].cashPaymentAccountExist)){
    return res.status(404).send({code:404,message:'This PO has been raise the Payment Advice OR Bank Payment Due to You can can select the Document Type'})
  }
}

}

        const createPaymentAdvice = await db.paymentAdvice.create({posting_date,others, document_number,document_type, transaction_date, notes, cheque_ref_no:reference, cheque_ref_date:reference_date,  branch_id, entity_id,voucher_list_id:voucher_id,manage_advance, party_type, vendor_id, customer_id, po_id, grn_id, invoice_id, sales_order_id,
           delivery_order_id, sales_invoice_id,document_value},{transaction})
              
        await Promise.all(Account_details.map(async i => {
              const {
                debit_amount, party_type,credit_amount, narration, cess_rate, tds, current_rate, tds_rate_amount,
                surcharge,  cess, gross_amount,surcharge_rate,surcharge_rate_amount,cess_rate_amount,
                vendor_id, product_id,
                cost_center_id, profit_center_id, chart_account_id, currency_id,nature,tds_id,nature_id
              } = i;
               await db.paymentAdviceAccount.create({
                debit_amount, credit_amount, narration, tds, current_rate, tds_rate_amount,party_type,
                surcharge, surcharge_amount:surcharge_rate_amount, cess, cess_amount:cess_rate_amount, gross_amount, surcharge_rate,
                payment_advice_id: createPaymentAdvice.id, cess_rate,amount_due,
                product_id, cost_center_id, 
                profit_center_id, chart_account_id, currency_id,nature,tds_id,nature_id
              },{transaction});
              await db.financial_And_Account_Journal_List.create({
                debit_amount, credit_amount, narration,current_rate,party_type:createPaymentAdvice.party_type,
                vendor_id:createPaymentAdvice.vendor_id, product_id, cost_center_id,document_number:createPaymentAdvice.document_number,entry_status:'Payment Advice',
                profit_center_id, chart_account_id:account_id ?? chart_account_id,tds_id,nature_id,entity_id,payment_advice_id: createPaymentAdvice.id
              },{transaction})
            })
        );
        
        if(journalDocument[0] != null){
            await Promise.all(journalDocument.map(async (i)=>{
                const {file} =i;
                await db.paymentAdviceDoc.create({upload_doc:file,payment_advice_id: createPaymentAdvice.id},{transaction})
            }))
        }
       await transaction.commit()
        return res.status(200).send({code:200,message:'Payment Advice Created Succesffully'})

    } catch (error) {
      await transaction.rollback()
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.getPaymentAdviceList = async(req,res)=>{
  const {type,party_type} = req.body
   
    try {
        const {entity_id} = req.query;
        let [programPayment] = [];

if(type == 'PAYMENT_ADVICE' && party_type == 'CUSTOMER'){
 [programPayment] = await db.sequelize.query(`
  SELECT PP.total_amount,PP.amount_due,PP.sales_invoice_id,PP.createdAt,PP.customer_id,P.id,P.amount AS amount_paid,P.document_number,VB.company_name AS customer_name
FROM PAYMENT_PROGRAM AS P
INNER JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.payment_program_id = P.id
INNER JOIN CUSTOMER_PROFILE_MST AS VB ON VB.id = PP.customer_id
WHERE P.entity_id = ${entity_id} AND P.document_type = 'Payment Advice' `)
 }
 if(type == 'PAYMENT_ADVICE_NUMBER'){
 [programPayment] = await db.sequelize.query(`
  SELECT PP.total_amount,PP.amount_due,PP.invoice_id,PP.createdAt,PP.vendor_id,P.id,P.amount AS amount_paid,P.document_number,VB.vendor_name
FROM PAYMENT_PROGRAM AS P
INNER JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.payment_program_id = P.id
INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PP.vendor_id
WHERE P.entity_id = ${entity_id} AND P.document_type = 'Payment Advice' `)
 }
 if(type == 'Transport'){
  [programPayment] = await db.sequelize.query(`
     SELECT P.*,VB.tm_name,P.bill_invoice_number AS document_number,P.grand_total AS total_amount,P.createdAt,PP.transport_voucher_id
  FROM TRANSPORT_VOUCHER AS P
  INNER JOIN TRANSPORT_VOUCHER_ACCOUNT_LIST AS PP ON PP.transport_voucher_id = P.id
  INNER JOIN TM_TRANSPORTER_MASTER AS VB ON VB.id = P.transport_id
  WHERE VB.entity_id = ${entity_id};
`)
 }
 if(type == 'Service'){
  [programPayment] = await db.sequelize.query(`
    SELECT PP.total_value,PP.createdAt,P.customer_id,P.id,SUM(PP.total_value) AS amount_paid,P.document_number,VB.company_name
  FROM SERVICE_VOUCHER AS P
  INNER JOIN SERVICE_VOUCHER_ACCOUNT_LIST AS PP ON PP.service_voucher_id = P.id
  INNER JOIN CUSTOMER_PROFILE_MST AS VB ON VB.id = P.customer_id
  WHERE VB.entity_id = ${entity_id} GROUP BY P.id
 `)
 }
 if(type == 'PURCHASE_JOURNAL_NUMBER'){
  [programPayment] = await db.sequelize.query(`
   SELECT P.net AS bill_amount,P.vendor_id,P.id,P.net AS amount_paid,P.document_number,VB.vendor_name
 FROM PURCHASE_JOURNAL AS P
 INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = P.vendor_id
 WHERE P.entity_id = ${entity_id}`)
  }
  if(type == undefined){
    [programPayment] = await db.sequelize.query(`
     SELECT PP.total_amount,PP.amount_due,PP.invoice_id,PP.createdAt,PP.vendor_id,P.id,CP.company_name,
     P.amount AS amount_paid,P.document_number,VB.vendor_name
   FROM PAYMENT_PROGRAM AS P
   INNER JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.payment_program_id = P.id
   LEFT JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PP.vendor_id
   LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = PP.customer_id
   WHERE P.entity_id = ${entity_id} AND P.payment_status= 'Program Payment' GROUP BY P.id`)
    }

    if(type == 'Sales Journal'){
      [programPayment] = await db.sequelize.query(`
        SELECT PP.total_value,P.customer_id,P.id,SUM(PP.total_value) AS amount_paid,P.document_number,VB.company_name
      FROM SALES_JOURNAL AS P
      INNER JOIN SALES_JOURNAL_ACCOUNT_LIST AS PP ON PP.sales_journal_id = P.id
      INNER JOIN CUSTOMER_PROFILE_MST AS VB ON VB.id = P.customer_id
      WHERE VB.entity_id = ${entity_id} GROUP BY P.id
     `)
     }
     if(type == 'travel_expense'){
      [programPayment] = await db.sequelize.query(`
         SELECT ER.expense_request_number AS document_number,ER.id
          FROM EXPENSE_REQUEST AS ER
WHERE ER.expense_final_status ='APPROVED' AND ER.entity_id = ${entity_id} AND ER.expense_request_type ='Indirect_Expense'
    `)
     }
     if(type == 'other_expense'){
      [programPayment] = await db.sequelize.query(`
         SELECT ER.expense_request_number AS document_number,ER.id
          FROM EXPENSE_REQUEST AS ER
WHERE ER.expense_final_status ='APPROVED' AND ER.entity_id = ${entity_id} AND ER.expense_request_type ='Other_Expense'
   `)
     }
     if(type == 'Reimbursement_expense'){
      [programPayment] = await db.sequelize.query(`
          SELECT ER.expense_request_number AS document_number,ER.id
          FROM EXPENSE_REQUEST AS ER
WHERE ER.expense_final_status ='APPROVED' AND ER.entity_id = ${entity_id} AND ER.expense_request_type ='Reimbursement_Expense'
   
    `)
     }


      if(type == 'Purchase_service_voucher'){
      [programPayment] = await db.sequelize.query(`
        SELECT  PSV.document_number,PSV.id FROM PURCHASE_SERVICE_VOUCHER AS PSV
        WHERE PSV.entity_id = ${entity_id}
   
    `)
     }
     
 if(programPayment?.length > 0){
  return res.status(200).send({code:200,message:'success',data:programPayment})
 }
else{
  return res.status(404).send({code:404,message:'Data Not Found!',data:programPayment})
}

       
    } catch (error) {
        return res.status(500).send({code:500,message:error.message   })
    }
}


module.exports.generatePaymentAdviceNumber = async (req, res) => {
    try {
     
  
      const {branch_id,voucher_id} = req.body

      const branchExist = await db.tbl_branch.findOne({where:{id:branch_id},attributes:['id','branch_name']})
      const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();
      const voucherMainListExist = await db.voucherMainList.findOne({where:{id:voucher_id},attributes:['id','series','voucher_main_id','voucher_name']})
      const voucherMainExist = await db.voucherMain.findOne({where:{id:voucherMainListExist.voucher_main_id},attributes:['id','name']})
      const voucherPrefixed = voucherMainExist.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
      const voucherPrefixedMainList = voucherMainListExist.voucher_name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
      const lastEntry = await db.paymentAdvice.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["document_number"],
      });
    
        let number;
        const currentYear = new Date().getFullYear();
        if (lastEntry) {
          const lastCode = lastEntry.document_number;
          const parts = lastCode.split('-');
          parts[parts.length - 2] = currentYear;
          let numberPart = parseInt(parts[3], 10);
          numberPart++;
          const newNumberPart = String(numberPart).padStart(5, '0');
        
          const newCode = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-${newNumberPart}`;
          number = newCode;
          
        } else {
          number = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-00001`;
          
        }
      return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


module.exports.getPaymentAdviceById = async(req,res)=>{
  try {
      const {id} = req.query;
//       const [getDataList] = await db.sequelize.query(
//           `SELECT P.* ,MB.branch_name,P.voucher_list_id AS voucher_id
// FROM PAYMENT_ADVICE AS P
// INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
//           WHERE P.id=${id}`
//       )
//       const [itemList] = await db.sequelize.query(
//         `SELECT PL.*
// FROM PAYMENT_ADVICE AS P
// INNER JOIN PAYMENT_ADVICE_ACCOUNT_LIST AS PL ON PL.payment_advice_id=P.id
// WHERE PL.payment_advice_id=${id}`
//       )

//       const upadateData = await Promise.all(getDataList.map((i)=>{
//         const matchingUpdatedData = itemList.find((item)=> i.id == item.payment_advice_id)
//         if(matchingUpdatedData){
//           return {
//             ...i,
//             total_of_credit:matchingUpdatedData.debit_amount,
//             total_of_debit:matchingUpdatedData.debit_amount
//           }
//         }
//         return  i
//       }))
     
//       const [DocumentList] = await db.sequelize.query(
//         `SELECT PL.*
// FROM PAYMENT_ADVICE AS P
// INNER JOIN PAYMENT_ADVICE_DOCUMENT AS PL ON PL.payment_advice_id=P.id
// WHERE PL.payment_advice_id=${id}`
//       )
//      const Obj ={
//       ...upadateData[0],
//       Account_details:itemList,
//       journalDocument:DocumentList
//      }
const [programPayment] = await db.sequelize.query(`
  SELECT PP.*,PP.paid_amount AS amount_paid,P.document_number,VB.vendor_name,G.*,CP.company_name,DATE_FORMAT(PP.createdAt,'%Y-%m-%d') AS createdAt
FROM PAYMENT_PROGRAM AS P
INNER JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.payment_program_id = P.id
LEFT JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PP.vendor_id
LEFT JOIN GRN_MASTER AS G ON G.id = PP.invoice_id
LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = PP.customer_id
WHERE PP.payment_program_id = ${id} `)


      if(programPayment){
          return res.status(200).send({code:200,message:'success',data:programPayment})
      }else{
          return res.status(200).send({code:404,message:'Data Not Found',data:programPayment})
      }
  } catch (error) {
      return res.status(500).send({code:500,message:error.message   })
  }
}


module.exports.getPaymentAdviceReportList = async(req,res)=>{
  
  try {
      const {entity_id} = req.query;
      const [getDataList] = await db.sequelize.query(
          `SELECT P.* ,MB.branch_name
FROM PAYMENT_ADVICE AS P
INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
          WHERE P.entity_id=${entity_id}`
      )
      const [itemList] = await db.sequelize.query(
        `SELECT DISTINCT PL.* ,FC.cost_center_name,FP.profit_center_name,C.account_name AS chart_account_name,
 V.vendor_name,S.company_name AS customer_name,MP.item_name AS product_name,MC.Currency_Type
FROM PAYMENT_ADVICE AS P
INNER JOIN PAYMENT_ADVICE_ACCOUNT_LIST AS PL ON PL.payment_advice_id=P.id
LEFT JOIN FINANCE_COST_CENTER AS FC ON FC.id=PL.cost_center_id
LEFT JOIN FINANCE_PROFIT_CENTER AS FP ON FP.id=PL.profit_center_id
LEFT JOIN CHART_OF_ACCOUNTS AS C ON C.id = PL.chart_account_id
LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = P.vendor_id
LEFT JOIN CUSTOMER_PROFILE_MST AS S ON S.id=P.customer_id
LEFT JOIN MASTER_ITEM AS MP ON MP.id=PL.product_id
LEFT JOIN MASTER_CURRENCY_CONVERT AS MC ON MC.Currency_Convert_id = PL.currency_id`
      )
      const finalValue = getDataList.map((md) => {
        const matchingUpdatedData = itemList.find((ud) =>
            ud.payment_advice_id === md.id );
     
        if (matchingUpdatedData) {
            return {
                ...md,
                ...matchingUpdatedData
               
            };
        }
    
        return md; 
      });
      if(finalValue){
          return res.status(200).send({code:200,message:'success',data:finalValue})
      }else{
          return res.status(200).send({code:404,message:'Data Not Found',data:finalValue})
      }
  } catch (error) {
      return res.status(500).send({code:500,message:error.message   })
  }
}


module.exports.getAllPoGrnSoByVendorId = async(req,res)=>{
  try {
    const {vendor_id, document_type,entity_id,customer_id} = req.body;
    let dataList=[]
    if(document_type == 'PO'){
      dataList = await db.purchase_order.findAll({where:{entity_id,vendor_id,final_status:"APPROVED"},attributes:['po_number','cost_center_id','vendor_id',['id','po_id'],['total_purchase','total_amount']]})
    }
    if(document_type == 'GRN'){
      [dataList] = await db.sequelize.query(
       `SELECT G.grn_number,G.id AS grn_id,P.cost_center_id
FROM GRN_MASTER AS G
INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
WHERE G.entity_id = ${entity_id} AND G.vendor_id = ${vendor_id} AND grnStatus = "COMPLETED"`)
    }
    if(document_type == 'INVOICES'){
    dataList = await db.grnMaster.findAll({where:{entity_id,vendor_id,invoice_status:'COMPLETED', payment_status: {
      [Op.ne]: 'PAID'
    }},attributes:['invoiceNo',['id','invoice_id']]})
    }
    if(document_type == 'sales_quotation'){
      dataList = await db.proposalData.findAll({where:{customer_id,entity_id,proposal_status:'approved',new_version:'approved'},attributes:['proposal_no',['id','quation_id']]})
    }
    if(document_type == 'proforma_invoice'){
      [dataList] = await db.sequelize.query(`
            SELECT DISTINCT P.id AS proforma_invoice_id,P.pi_number,P.proposal_id
        FROM CRM_CREATE_PROPOSAL_MST AS C 
        INNER JOIN PROPOSAL_PERFORMA_INVOICE AS P ON P.proposal_id = C.id
        WHERE C.customer_id = ${customer_id} AND C.entity_id = ${entity_id} AND P.approvel_status="APPROVED"
        GROUP BY P.id`)
       
    }
    if(document_type == 'sales_order'){
      dataList = await db.salesOrder.findAll({where:{customer_id,entity_id,status:'APPROVED'},attributes:['sales_order_no',['id','sales_order_id']]})
    }
    if(document_type == 'sales_invoice'){
      dataList = await db.salesInvoiceData.findAll({
        where: {
          customer_id,
          entity_id,
          invoice_status: 'APPROVED',
          // payment_status: {
          //   [Op.ne]: 'PAID'
          // }
        },
        attributes: [
          ['sales_invoice_no', 'invoiceNo'],
          ['id', 'sales_invoice_id']
        ]
      });}
    if(document_type=='PA'){
      [dataList] = await db.sequelize.query(`
        SELECT PA.* FROM PAYMENT_ADVICE AS PA
        WHERE PA.vendor_id=${vendor_id}
        `)
    }
    if(document_type == 'Purchase Journal'){
      dataList = await db.purchaseJournal.findAll({where:{vendor_id,entity_id},attributes:[['id','purchase_journal_id'],'document_number']})
    }
    if(document_type == 'sales_journal'){
     [dataList] = await db.sequelize.query(`
       SELECT * FROM SALES_JOURNAL WHERE customer_id = ${customer_id}
      `) 
    }
    if(document_type == 'purchase_invoice'){
      dataList = await db.grnMaster.findAll({where:{entity_id,vendor_id,invoice_status:'COMPLETED', payment_status: {
        [Op.ne]: 'PAID'
      }},attributes:['invoiceNo',['id','sales_invoice_id']]})
      }
      if(document_type == 'purchase_return'){
        dataList = await db.purchaseReturn.findAll({where:{entity_id,vendor_id,return_status:'Pending'}, attributes:[['return_no','invoiceNo'],['grn_id','sales_invoice_id'],['id','purchase_return_id']]})
        }
        if(document_type == 'sales_return'){
          dataList = await db.salesReturnMst.findAll({where:{entity_id,customer_id}, attributes:[['return_no','invoiceNo'],['sales_order_id','sales_invoice_id'],['id','purchase_return_id']]})
          }
  
    if(dataList.length >0){
      
      return res.status(200).send({code:200,message:'Success',data:dataList})
    }else{
      return res.status(404).send({code:404,message:'No Document is available against this.',data :[]})
    }
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}



module.exports.downloadPaymentAdviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [getDataList] = await db.sequelize.query(
      `SELECT  B.*,V.vendor_name AS company_name,E.entity_name,DATE_FORMAT(B.createdAt, '%Y-%m-%d') AS posting_date,
        E.tax_registration_number AS entity_gst_in, E.registered_office,E.logo
      FROM PAYMENT_PROGRAM AS B
      INNER JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.payment_program_id = B.id
      LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = PP.vendor_id
      LEFT JOIN ENTITY_MASTER AS E  ON E.id = B.entity_id
      WHERE B.id = ${ id }
      `
    )

    const [itemList] = await db.sequelize.query(
      `
SELECT DISTINCT P.document_number AS journal_document_number, DATE_FORMAT(P.createdAt, '%Y-%m-%d') AS posting_date,
        DATE_FORMAT(P.createdAt, '%Y-%m-%d') AS journal_posting_date,P.amount AS credit_amount, P.document_number,
       'Cr.' AS  dcType,
       CASE WHEN PL.vendor_id THEN 'Sundry Creditors'
		ELSE 'Sundry Debitors'
       END account_name,
	  CASE WHEN PL.vendor_id THEN '2322'
		ELSE '1135'
       END account_code
      FROM PAYMENT_PROGRAM AS P
      INNER JOIN PAYMENT_PROGRAM_LIST AS PL ON PL.payment_program_id = P.id
      WHERE P.id = ${ id }
      `
    );
    const totalAmount = itemList.reduce(
      (sum, item) => sum + Number(item.credit_amount || 0),
      0
    );

    if (!getDataList || getDataList.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "Data Not Found"
      });
    }

    const header = getDataList[0];

    const htmlPath = path.resolve(
      __dirname,
      "../../../../src/assets/templates/bank_payment.html"
    );

    let html = fs.readFileSync(htmlPath, "utf-8");

    const logoPath = path.join(
      __dirname,
      "../../../../src/assets/selected-logo.jpg"
    );

    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);

      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString(
        "base64"
      )}`;
    }
    const getValue = (obj, keys, defaultValue = "") => {
      for (const key of keys) {
        if (
          obj[key] !== undefined &&
          obj[key] !== null &&
          obj[key] !== ""
        ) {
          return obj[key];
        }
      }

      return defaultValue;
    };

    const formatDate = (date) => {
      if (!date) return "";

      try {
        return new Date(date).toLocaleDateString("en-GB");
      } catch (error) {
        return "";
      }
    };

    const formatAmount = (value) => {
      const number = Number(value);

      if (isNaN(number)) {
        return "0.00";
      }

      return number.toFixed(2);
    };

    let accountRows = "";
    if (itemList && itemList.length > 0) {
      let amount =0
      itemList.forEach((item, index) => {
        if (Number(item.credit_amount) > 0) {
          amount = Number(item.credit_amount);
        } else if (Number(item.debit_amount) > 0) {
          amount = Number(item.debit_amount);
        } else {
          amount = Number(
            getValue(
              item,
              [
                "amount",
                "total_amount",
                "paid_amount",
                "amount_adjusted"
              ],
              0
            )
          );
        }


        const accountName = getValue(
          item,
          [
            "account_name",
            "ledger_name",
            "sub_ledger_name"
          ],
          ""
        );

        const accountCode = getValue(
          item,
          [
            "account_code",
            "ledger_code"
          ],
          ""
        );

     
        const chequeNo = getValue(
          item,
          [
            "cheque_ref_no",
          ],
          ""
        );

        const chequeDate = getValue(
          item,
          [
            "cheque_ref_date",
          ],
          ""
        );

     
        const narration = getValue(
          item,
          [
            "notes",
            "remarks",
          ],
          ""
        );

        const referenceNumber = getValue(
          item,
          [
            "reference_number",
            "reference_no",
            "ref_no",
            "document_number",
            "journal_document_number"
          ],
          ""
        );

  
        const billNo = getValue(
          item,
          [
            "document_number",
          ],
          ""
        );

        const billDate = getValue(
          item,
          [
            "posting_date",
          ],
          ""
        );

        const billAmount = Number(
          getValue(
            item,
            [
              "bill_amount",
              "billAmount",
              "invoice_amount",
              "invoiceAmount"
            ],
            0
          )
        );

        const amountAdjusted = Number(
          getValue(
            item,
            [
              "amount_adjusted",
              "amountAdjusted",
              "adjusted_amount",
              "adjustedAmount"
            ],
            amount
          )
        );

        accountRows += `
          <tr class="main-row">

            <td class="center serial-cell">
              ${index + 1}
            </td>

            <td class="particular-cell">

              <div class="account-name">
                ${accountName}
              </div>

              ${
                accountCode
                  ? `
                    <div class="account-code">
                      ${accountCode}
                    </div>
                  `
                  : ""
              }

              ${
                chequeNo || chequeDate
                  ? `
                    <div class="cheque-details">

                      ${
                        chequeNo
                          ? `
                            <span>
                              Cheque No. - ${chequeNo}
                            </span>
                          `
                          : ""
                      }

                      ${
                        chequeDate
                          ? `
                            <span class="cheque-date">
                              Cheque Date : ${formatDate(chequeDate)}
                            </span>
                          `
                          : ""
                      }

                    </div>
                  `
                  : ""
              }

              ${
                narration
                  ? `
                    <div class="transaction-details">
                      ( ${narration} )
                    </div>
                  `
                  : ""
              }

              ${
                referenceNumber
                  ? `
                    <div class="transaction-details">
                      ${referenceNumber}
                    </div>
                  `
                  : ""
              }
              ${
                billNo ||
                billDate ||
                billAmount ||
                amountAdjusted
                  ? `
                    <div class="bill-section">
                      <div class="bill-heading">

                        <span>
                          Bill No
                        </span>

                        <span>
                          Bill Date
                        </span>

                        <span>
                          Bill Amount
                        </span>

                        <span>
                          Amount Adjusted
                        </span>

                      </div>

                      <div class="bill-values">

                        <span>
                          ${billNo || "-"}
                        </span>

                        <span>
                          ${
                            billDate
                              ? formatDate(billDate)
                              : "-"
                          }
                        </span>

                        <span>
                          ${formatAmount(billAmount)}
                        </span>

                        <span>
                          ${formatAmount(amountAdjusted)}
                        </span>

                      </div>

                    </div>
                  `
                  : ""
              }

            </td>

            <td class="center dc-cell">
              ${item.dcType}
            </td>

            <td class="right amount-cell">
              ${formatAmount(amount)}
            </td>

          </tr>
        `;
      });
    }

    const amountInWords = numberToWords(totalAmount);

    const bindData = (template, data) => {
      return template.replace(
        /{{{?([^{}]+)}}}?/g,
        (_, key) => {
          const cleanKey = key.trim();

          if (
            data[cleanKey] === undefined ||
            data[cleanKey] === null
          ) {
            return "";
          }

          return data[cleanKey];
        }
      );
    };

    const mainAddress =
      header?.registered_office ||
      "Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004";

    html = bindData(html, {

      heading: "PAYMENT ADVICE VOUCHER",

      entityName:
        header.entity_name || "",

      entityAddress:
        header.registered_office || "",

      entity_gst_in:
        `PAN No. ${header.tax_registration_number || "-"}`,

      entityLogo:
        logoBase64,

      mainAddress:
        mainAddress,

      voucher_no:
        header.document_number || "",

      voucher_date:
        header.posting_date
          ? formatDate(header.posting_date)
          : "",

      bank_name:
        header.bank_name || "",

      sub_ledger:
        header.sub_ledger || "",

      amount:
        formatAmount(totalAmount),

      company_name:
        header.company_name || "",

      currency:
        header.currency || "₹",

      accountRows:
        accountRows,

      totalAmount:
        formatAmount(totalAmount),

      amount_in_words:
        amountInWords,

      remarks:
        header.remarks ||
        header.narration ||
        "",

      prepared_by:
        header.prepared_by || "",

      received_by:
        header.received_by || "",

      authorize_by:
        header.authorize_by || "",

      invoice_no:
        header.document_number || "",

      invoice_date:
        header.transaction_date
          ? formatDate(header.transaction_date)
          : "",

      invoice_amount:
        formatAmount(totalAmount),

      amount_adjusted:
        formatAmount(totalAmount)
    });

    const pdfBuffer = await generatePDF(html);

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="payment_advice${
        header.document_number || id
      }.pdf"`
    );

    res.setHeader(
      "Content-Length",
      pdfBuffer.length
    );

    return res.end(pdfBuffer);

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message:
        error.message ||
        "Server Error"
    });
  }
};

function numberToWords(num) {
  if (num === 0) return "Zero Only";
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertToWords(n) {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertToWords(n % 100) : '');
    if (n < 100000) return convertToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convertToWords(n % 1000) : '');
    if (n < 10000000) return convertToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convertToWords(n % 100000) : '');
    return convertToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convertToWords(n % 10000000) : '');
  }
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let words = convertToWords(rupees) + ' Rupees';
  if (paise > 0) {
    words += ' And ' + convertToWords(paise) + ' Paise';
  }
  return words + ' Only';
}