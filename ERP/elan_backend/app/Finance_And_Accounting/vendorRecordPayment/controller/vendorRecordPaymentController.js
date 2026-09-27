const { where } = require('sequelize');
const db = require('../../../models/index')


module.exports.createVendorRecordPayment = async(req,res)=>{
    try {
        let {  finalTdsAmt,date,document_type,others,po_id,grn_id,invoice_id,payment_type,documentNo,payment_method,tds_id,total_amount,amount_due,record_amount,nature_id,tds_amount,net_amount, branch_id, vendor_id,entity_id,chartOfAccountList
        } = req.body;

        const journalExist = await db.financial_And_Account_Journal.findOne({where:{po_id,vendor_id}})
      
        if(!journalExist || payment_type == 'general'){

          const vendorExistData = await db.vendorRecordPayment.findOne({where:{po_id,vendor_id}})

     

          if ((!vendorExistData && ((journalExist && payment_type != 'general') || !journalExist && payment_type == 'general'))) {
            return res.status(404).send({
                code: 404,
                message: "The invoice for this vendor hasn't been booked yet, so only the advance payment can be recorded."
            });
        }

          if(finalTdsAmt < 0){
            finalTdsAmt = 0
          }
     
          const validFinalTdsAmt = !isNaN(parseFloat(finalTdsAmt)) ? parseFloat(finalTdsAmt) : 0;
          const validTdsAmount = !isNaN(parseFloat(tds_amount)) ? parseFloat(tds_amount) : 0;
          let finalValue ;
          if(finalTdsAmt == 0){
            finalValue = parseFloat(net_amount) + parseFloat(validFinalTdsAmt)
          }else{
            finalValue = parseFloat(record_amount) - parseFloat(validFinalTdsAmt)
          }
         
          const  vendorExist = await db.vendor_basic_details.findOne({where:{id:vendor_id},attributes:['id','chart_of_account_id','advanced_chart_of_account_id']})
          const tdsExist = await db.tds.findOne({where:{entity_id}})
          const vendorPayment = await db.vendorRecordPayment.create({date,document_type,others,po_id,grn_id,invoice_id,payment_type,documentNo,payment_method,tds_id,branch_id
            ,total_amount,amount_due,record_amount:  parseFloat(record_amount) ,recieved_amount:parseFloat(record_amount),nature_id,tds_amount : finalTdsAmt ?? tds_amount  ,net_amount:finalValue , vendor_id, entity_id})
          if(chartOfAccountList){
            await Promise.all(chartOfAccountList.map(async i => {
              const {  payment_mode,amount,chart_of_account_id
              } = i;
              
              await db.vendorRecordPaymentAccount.create({
                payment_mode,amount,chart_of_account_id,
                vendor_record_payment_id: vendorPayment.id
               
              });
            })
          );
          }
          if(payment_type == 'general'){
            await db.financial_And_Account_Journal_List.bulkCreate([
              {
              debit_amount:parseFloat(record_amount), credit_amount : '0.00',chart_account_id:vendorExist.chart_of_account_id,
              vendor_id, document_number:documentNo,entry_status:'Vendor Record Payment',party_type:'VENDOR',
             tds_id,nature_id,entity_id
            },
           
          ])
          }
          if(payment_type == 'advance_payment'){
            await db.financial_And_Account_Journal_List.bulkCreate([
              {
              debit_amount:parseFloat(record_amount), credit_amount : '0.00',chart_account_id:vendorExist.advanced_chart_of_account_id,
              vendor_id, document_number:documentNo,entry_status:'Vendor Record Payment',party_type:'VENDOR',
             tds_id,nature_id,entity_id
            },
          ])
          }
         
          await db.financial_And_Account_Journal_List.bulkCreate([
          
            {
            debit_amount:'0.00', credit_amount:finalValue,entry_status:'Vendor Record Payment',party_type:'VENDOR',
            vendor_id,tds_id,nature_id,entity_id,document_number:documentNo,chart_account_id:chartOfAccountList[0].chart_of_account_id
            },
              {
              debit_amount:'0.00',  credit_amount: validFinalTdsAmt > 0 ? validFinalTdsAmt : validTdsAmount,entry_status:'Vendor Record Payment',party_type:'VENDOR',
              vendor_id,tds_id,nature_id,entity_id,document_number:documentNo,chart_account_id:tdsExist.chart_account_id
              },
          ])
  
          return res.status(200).send({code:200,message:'Vendor Payment Created Succesfully'})
         }else{
         
            return res.status(404).send({code:404,message:'Your expense has already been recorded against this Purchase Order, you cannot record any more advance against this Purchase Order.'})
        }
  
       
       

    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.getAllVendorRecordPayment = async(req,res)=>{
  try {
      let entity_id = req.query.entity_id;


      const [dataList] = await db.sequelize.query(`
          SELECT  VRP.*,MB.branch_name,VBD.vendor_name FROM VENDOR_RECORD_PAYMENT AS VRP
INNER JOIN MASTER_BRANCH AS MB ON VRP.branch_id = MB.id
INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON VRP.vendor_id = VBD.id
WHERE VRP.entity_id=${entity_id}
        `)
    if(dataList){
      return res.status(200).send({code:200,message:'Success',data:dataList})
    }else{
      return res.status(200).send({code:200,message:'No data found',data:[]})
    }

  } catch (error) {
      return res.status(500).send({code:500,message:error.message})
  }
}

module.exports.createVendorPaymentVoucherSeries = async(req,res)=>{
  try {
      const  {branch_id} = req.query;
       
      const branchData = await db.tbl_branch.findOne({where:{id:branch_id}})
      const vendorRecordPayment = await db.vendorRecordPayment.findAll()
      let financial_year = new Date()
      let year = financial_year.getFullYear()
      let VendorCodePattern = `${branchData.branch_code}-${year}-00${vendorRecordPayment.length}`
      
    if(branchData){
      return res.status(200).send({code:200,message:'Success',data:VendorCodePattern})
    }else{
      return res.status(200).send({code:200,message:'No data found',data:[]})
    }

  } catch (error) {
      return res.status(500).send({code:500,message:error.message})
  }
}


module.exports.getVendorPaymentHistoryByVendor = async(req,res)=>{
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

    const [vendorPaymentHistoryData] = await db.sequelize.query(`
      SELECT VRP.*
      FROM VENDOR_RECORD_PAYMENT AS VRP
      INNER JOIN MASTER_BRANCH AS MB ON VRP.branch_id = MB.id
      INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON VRP.vendor_id = VBD.id
      INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = VRP.po_id
      LEFT JOIN GRN_MASTER AS G ON G.id = VRP.grn_id
      LEFT JOIN GRN_MASTER AS GM ON GM.id = VRP.invoice_id
      WHERE VRP.entity_id = ${entity_id} AND VRP.vendor_id = ${vendor_id} ${condition}
    `)

    const [purchaseJournalPaymentHistory] = await db.sequelize.query(`
      SELECT VRP.*
      FROM PURCHASE_JOURNAL AS VRP
      INNER JOIN MASTER_BRANCH AS MB ON VRP.branch_id = MB.id
      INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON VRP.vendor_id = VBD.id
      INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = VRP.po_id
      LEFT JOIN GRN_MASTER AS G ON G.id = VRP.grn_id
      LEFT JOIN GRN_MASTER AS GM ON GM.id = VRP.invoice_id
      WHERE VRP.entity_id = ${entity_id} AND VRP.vendor_id = ${vendor_id} ${condition}
    `)

    const vendorPaymentHistory = [...vendorPaymentHistoryData,...purchaseJournalPaymentHistory]

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
          paid_amount_till_now : matchingData.paid_amount_till_now,
        }
      }
      return md
    }
  ))
  const poExist = await db.purchase_order.findOne({where:{id:po_id}})

  const [poItems] = await db.sequelize.query(`
    SELECT  PPOI.*,MI.item_code,PPO.cost_center_id FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS PPOI 
 INNER JOIN MASTER_ITEM AS MI ON MI.id = PPOI.item_master_id
 INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PPO ON PPOI.purchase_order_id = PPO.id
WHERE PPOI.purchase_order_id=${po_id}
    `)

  const journalExist = await db.financial_And_Account_Journal.findOne({where:{po_id}})
  if(!journalExist){
    if (newData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: 'Success',
        data: newData,poItems:poItems
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: 'No data found',
        data: [], po_total_amount:poExist.total_purchase,poItems:poItems
      });
    }
  }else{
    const tdsGetData = await db.financial_And_Account_Journal_List.findOne({where:{journal_id:journalExist.id}})
    if (newData) {
      if(vendorPaymentHistory.length ==  1){
        return res.status(200).send({
          code: 200,
          message: 'Success',
          data: newData,tds_valid:'No',tds_amount:tdsGetData.tds_rate_amount,poItems:poItems
        });
      }else{
      
        if(vendorPaymentHistory.length == 0){
          return res.status(200).send({
            code: 200,
            message: 'Success',
            data: newData,tds_valid:'No',tds_amount:tdsGetData.tds_rate_amount,poItems:poItems
          });
        }else{
          return res.status(200).send({
            code: 200,
            message: 'Success',
            data: newData,tds_valid:'No',tds_amount:0,poItems:poItems
          });
        }
       
      }
      
    } else {
      return res.status(200).send({
        code: 200,
        message: 'No data found',
        data: [],tds_valid:'No',tds_amount:tdsGetData.tds_rate_amount,poItems:poItems
      });
    }
  }
    
    
  } catch (error) {
      return res.status(500).send({code:500,message:error.message})
  }
}