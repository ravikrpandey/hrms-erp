const db = require('../../../models/index')


module.exports.createCustomerRecordPayment = async(req,res) => {
    try {
        let {  documentNo, document_type, payment_type, date, payment_method,  total_amount, amount_due, record_amount,  others, 
          sales_quotation_id,party_type, proforma_invoice_id, sales_order_id, sales_invoice_id,chartOfAccountList,customer_id,entity_id
        } = req.body;

        if(sales_quotation_id == ''){
          sales_quotation_id = null;
        }
        if(proforma_invoice_id == ''){
          proforma_invoice_id =null;
        }
        if(!total_amount){
          total_amount =record_amount
        }

        const journalExist = await db.financial_And_Account_Journal.findOne({where:{proforma_invoice_id:proforma_invoice_id,customer_id,entity_id}})
     
        if(!journalExist || payment_type == 'general'){

          const customerExistData = await db.customerRecordPayment.findOne({where:{proforma_invoice_id,customer_id}})
          
      
          if ((!customerExistData && ((journalExist && payment_type != 'general') || !journalExist && payment_type == 'general'))) {
            return res.status(404).send({
                code: 404,
                message: "No invoice has been recorded for this transaction. Only advance payments can be processed at this time."
            });
        }
  
          const  customerExist = await db.customerProfile.findOne({where:{id:customer_id},attributes:['id','chart_of_account_id','advanced_chart_of_account_id']})
         
          const customerPayment = await db.customerRecordPayment.create({documentNo, document_type, payment_type, date, payment_method, 
             total_amount, amount_due, record_amount,  others, entity_id,customer_id,
            quation_id:sales_quotation_id, proforma_invoice_id,party_type, sales_order_id: typeof sales_order_id === 'string' ? null : sales_order_id, sales_invoice_id: typeof sales_invoice_id === 'string' ? null : sales_invoice_id})
          if(chartOfAccountList){
            await Promise.all(chartOfAccountList.map(async i => {
              const {  payment_mode,amount,chart_of_account_id
              } = i;
              
              await db.customerRecordPaymentAccount.create({
                payment_mode,amount,chart_of_account_id,
                customer_record_payment_id: customerPayment.id
               
              });
            })
          );
          }
          if(payment_type == 'general'){
            await db.financial_And_Account_Journal_List.bulkCreate([
              {
              debit_amount:'0.00', credit_amount : parseFloat(record_amount),chart_account_id:customerExist.chart_of_account_id,
              customer_id, document_number:documentNo,entry_status:'Customer Record Payment',party_type:'CUSTOMER',
           entity_id
            },
           
          ])
          }
          if(payment_type == 'advance_payment'){
            
            await db.financial_And_Account_Journal_List.bulkCreate([
              {
              debit_amount:'0.00', credit_amount : parseFloat(record_amount),chart_account_id:customerExist.advanced_chart_of_account_id,
              customer_id, document_number:documentNo,entry_status:'Customer Record Payment',party_type:'CUSTOMER',
           entity_id
            },
          ])
          }
         
          await db.financial_And_Account_Journal_List.bulkCreate([
          
            {
            debit_amount:parseFloat(record_amount), credit_amount:'0.00',entry_status:'Customer Record Payment',party_type:'CUSTOMER',
            customer_id,entity_id,document_number:documentNo,chart_account_id:chartOfAccountList[0].chart_of_account_id
            }
      
          ])
  
          return res.status(200).send({code:200,message:'Customer Payment Created Succesfully'})
         }else{
         
            return res.status(404).send({code:404,message:'This transaction has already been fully invoiced. Further advances cannot be recorded against it. '})
        }
  
       
       

    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.getDataDynamicById = async(req,res)=>{
  try {
    const {quotation_id,customer_id,entity_id,documentType,proforma_id} =req.body;
  
    let dataList ;
    let totals ;
    if(documentType == 'sales_quotation'){
      [dataList] = await db.sequelize.query(`
        SELECT C.proposal_no,C.entity_id,C.customer_id,C.id AS quotation_id,C.grant_total
        FROM CRM_CREATE_PROPOSAL_MST AS C 
        WHERE C.entity_id = ${entity_id}   AND C.proposal_status = 'approved' AND C.id = ${proforma_id} AND C.customer_id = ${customer_id}
      `);
    }
    if(documentType == 'proforma_invoice'){
     [dataList] = await db.sequelize.query(`
        SELECT DISTINCT P.id AS proforma_invoice_id,P.pi_number,P.proposal_id,C.grant_total,C.grossTotal,C.igst,C.gstTotal,
        C.totalAMTAfterDiscount,C.sgst,C.cgst,CP.chart_of_account_id,CP.advanced_chart_of_account_id,'201' AS hard_coded_discount_id 
          FROM CRM_CREATE_PROPOSAL_MST AS C
          INNER JOIN PROPOSAL_PERFORMA_INVOICE AS P ON P.proposal_id = C.id
          INNER JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id=C.customer_id
          WHERE C.entity_id = ${entity_id}  AND P.id = ${proforma_id} AND C.customer_id = ${customer_id}
      `)
    }
   if (documentType == 'sales_invoice') {

  const [dataListValue] = await db.sequelize.query(`
    SELECT CSM.*
    FROM CRM_SALES_INVOICE_MST AS CSM
    WHERE CSM.id = ${proforma_id}
  `);


  totals = dataListValue.reduce(

    (acc, row) => {

      acc.taxable_amount += Number(row.taxable_amount || 0);

      acc.gst_amount += Number(
        Number(row.cgst_amount || 0) +
        Number(row.sgst_amount || 0) +
        Number(row.igst_amount || 0)
      );

      acc.total_value += Number(row.grand_total || 0);

      acc.amount += Number(row.grand_total || 0);

      return acc;

    },

    {
      taxable_amount: 0,
      gst_amount: 0,
      total_value: 0,
      amount: 0,
      amount_paid: 0,
      amount_due: 0,
    }

  );


  const [dataListNew] = await db.sequelize.query(`

    SELECT P.sales_invoice_id,
        SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P

    WHERE P.sales_invoice_id = ${proforma_id}

    GROUP BY P.sales_invoice_id

  `);


  const paidAmount = dataListNew.reduce(

    (sum, item) => {

      return sum + parseFloat(item.amount || 0);

    },

    0

  );


  totals.amount_paid = paidAmount;

  totals.amount_due =
    Number(totals.amount || 0) -
    Number(totals.amount_paid || 0);

  totals.sales_invoice_id = proforma_id;

  dataList = totals;

}


      
    const [historyDataRecordPayment]= await db.sequelize.query(
      ` SELECT C.*, SO.invoice_no AS pi_number,CP.company_name AS customer_name,C.paid_amount AS record_amount,PP.document_number,PP.document_type
  FROM PAYMENT_PROGRAM_LIST AS C
  INNER JOIN PAYMENT_PROGRAM AS PP ON PP.id=C.payment_program_id
  INNER JOIN SALES_ORDER_MST AS SO ON SO.id=C.sales_invoice_id
  INNER JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = C.customer_id
  WHERE C.sales_invoice_id=${proforma_id} `,
    )


const Obj ={
  ...dataList,
  historyData:historyDataRecordPayment,
  amount_due:totals?.amount_due
}
const [historyDataCount]= await db.sequelize.query(
  `SELECT P.pi_number,C.id,SUM(C.record_amount) AS advance_amount
FROM CUSTOMER_RECORD_PAYMENT AS C
INNER JOIN PROPOSAL_PERFORMA_INVOICE AS P ON P.id = C.proforma_invoice_id
WHERE C.entity_id = ${entity_id} AND P.id=${proforma_id} AND C.customer_id =${customer_id}`
)

return res.status(200).send({code:200,message:'Success',data:Obj,advance_amount:historyDataCount[0].advance_amount})



  } catch (error) {
    
  }
}

module.exports.getCustomerPaymentHistoryByVendor = async(req,res)=>{
  try {
    const { entity_id, vendor_id, document_type, po_id, invoice_id, grn_id } = req.body;

    let condition =``;
 
    if(po_id){
      condition += `AND VRP.po_id=${po_id}`
    }
    if(invoice_id){
      condition += `AND VRP.invoice_id = ${invoice_id}`
    }
    if(grn_id){
      condition += `AND VRP.grn_id = ${grn_id}`
    }

    const [vendorPaymentHistory] = await db.sequelize.query(`
      SELECT VRP.*
      FROM VENDOR_RECORD_PAYMENT AS VRP
      INNER JOIN MASTER_BRANCH AS MB ON VRP.branch_id = MB.id
      INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON VRP.vendor_id = VBD.id
      INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = VRP.po_id
      LEFT JOIN GRN_MASTER AS G ON G.id = VRP.grn_id
      LEFT JOIN GRN_MASTER AS GM ON GM.id = VRP.invoice_id
      WHERE VRP.entity_id = ${entity_id} AND VRP.vendor_id = ${vendor_id} ${condition}
    `)

    const [dataCount] = await db.sequelize.query(
      `
       SELECT SUM(VRP.record_amount) AS paid_amount_till_now,VRP.vendor_id,VRP.po_id,VRP.grn_id,VRP.invoice_id
      FROM VENDOR_RECORD_PAYMENT AS VRP
      INNER JOIN MASTER_BRANCH AS MB ON VRP.branch_id = MB.id
      INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON VRP.vendor_id = VBD.id
      INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = VRP.po_id
      LEFT JOIN GRN_MASTER AS G ON G.id = VRP.grn_id
      LEFT JOIN GRN_MASTER AS GM ON GM.id = VRP.invoice_id
      WHERE VRP.entity_id = ${entity_id} AND VRP.vendor_id = ${vendor_id} ${condition}
      GROUP BY VRP.vendor_id,VRP.po_id,VRP.grn_id,VRP.invoice_id
      `
    )

    const newData = await Promise.all(vendorPaymentHistory.map((md)=>{
      const matchingData = dataCount.find((ud)=>
        ud.vendor_id == md.vendor_id && ud.po_id == md.po_id && ud.grn_id == md.grn_id && ud.invoice_id == md.invoice_id
      )
      if(matchingData){
        return {
          ...md,
          paid_amount_till_now : matchingData.paid_amount_till_now
        }
      }
      return md
    }
  ))
  if (newData.length > 0) {
    return res.status(200).send({
      code: 200,
      message: 'Success',
      data: newData
    });
  } else {
    return res.status(200).send({
      code: 200,
      message: 'No data found',
      data: []
    });
  }
  
    
    
  } catch (error) {
      return res.status(500).send({code:500,message:error.message})
  }
}


module.exports.getListCustomerRecordPayment = async(req,res)=>{
  try {
    const {entity_id} = req.query;
    const [dataList] = await db.sequelize.query(`
     SELECT C.*,CP.company_name,COALESCE(P.pi_number, CCP.proposal_no,SO.sales_order_no,SI.invoice_doc_code) AS proforma_name
FROM CUSTOMER_RECORD_PAYMENT AS C
INNER JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = C.customer_id
LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS P ON P.id = C.proforma_invoice_id
LEFT JOIN CRM_CREATE_PROPOSAL_MST AS CCP ON CCP.id = C.quation_id
LEFT JOIN SALES_ORDER_MST AS SO ON SO.id=C.sales_order_id
LEFT JOIN SALES_INVOICE_MST AS SI ON SI.id=C.sales_invoice_id
WHERE C.entity_id = ${entity_id} ORDER BY C.id DESC
      `)
    
      return res.status(200).send({code:200,message:'Success',data:dataList})
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}