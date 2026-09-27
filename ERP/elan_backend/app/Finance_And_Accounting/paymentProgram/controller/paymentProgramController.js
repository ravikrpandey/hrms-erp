const db = require("../../../models");

module.exports.paymentProgram = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { amount, remarks, dataList, invoice_number } = req.body;
  
    let remainingAmount = parseFloat(amount);
  
    const createData = await db.paymentProgram.create(
      { amount, remarks, entity_id: dataList[0].entity_id, document_number: invoice_number ,document_type:'Payment Advice',reference_number:'Payment Advice'},
      { transaction }
    );

    for (const i of dataList) {
      const { vendor_id, invoice_id, total_amount,customer_id } = i;
      let Obj = {};
      const invoiceTotal = parseFloat(total_amount);
      if(vendor_id){
        if (remainingAmount <= 0) break;
      const invoiceExist = await db.paymentProgramList.findOne({
        where: { invoice_id },
        attributes: ['invoice_id', 'amount_due', 'total_amount'],
        order: [['id', 'DESC']],
      });

      let dueAmount = invoiceExist ? parseFloat(invoiceExist.amount_due) : invoiceTotal;

      if (remainingAmount >= dueAmount) {
        Obj.payment_status = "PAID";

        await db.grnMaster.update(Obj, { where: { id: invoice_id }, transaction });

        await db.paymentProgramList.create(
          {
            vendor_id,
            invoice_id,
            amount_due: 0,
            paid_amount: dueAmount,
            total_amount: invoiceTotal,
            payment_program_id: createData.id,
          },
          { transaction }
        );

        remainingAmount -= dueAmount; 
      } else {
       
        Obj.payment_status = "PARTIALLY PAID";

        await db.grnMaster.update(Obj, { where: { id: invoice_id }, transaction });

        await db.paymentProgramList.create(
          {
            vendor_id,
            invoice_id,
            amount_due: dueAmount - remainingAmount,
            paid_amount: remainingAmount,
            total_amount: invoiceTotal,
            payment_program_id: createData.id,
          },
          { transaction }
        );

        remainingAmount = 0; 
        break; 
      }
      }
      if(customer_id){
        if (remainingAmount <= 0) break;
      const invoiceExist = await db.paymentProgramList.findOne({
        where: { sales_invoice_id:invoice_id },
        attributes: ['sales_invoice_id', 'amount_due', 'total_amount'],
        order: [['id', 'DESC']],
      });

      let dueAmount = invoiceExist ? parseFloat(invoiceExist.amount_due) : invoiceTotal;

      if (remainingAmount >= dueAmount) {
        Obj.payment_status = "PAID";

        await db.salesInvoiceData.update(Obj, { where: { id: invoice_id }, transaction });

        await db.paymentProgramList.create(
          {
            customer_id,
            sales_invoice_id:invoice_id,
            amount_due: 0,
            paid_amount: dueAmount,
            total_amount: invoiceTotal,
            payment_program_id: createData.id,
          },
          { transaction }
        );

        remainingAmount -= dueAmount; 
      } else {
       
        Obj.payment_status = "PARTIALLY PAID";

        await db.salesInvoiceData.update(Obj, { where: { id: invoice_id }, transaction });

        await db.paymentProgramList.create(
          {
            customer_id,
            sales_invoice_id:invoice_id,
            amount_due: dueAmount - remainingAmount,
            paid_amount: remainingAmount,
            total_amount: invoiceTotal,
            payment_program_id: createData.id,
          },
          { transaction }
        );

        remainingAmount = 0; 
        break; 
      }
      }
      
    }

    await transaction.commit();
    return res.status(201).send({ code: 201, message: 'Successfully created' });

  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
  module.exports.generatePaymentProgramNumber = async (req, res) => {
    try {
        const lastEntry = await db.paymentProgram.findOne({
            order: [["createdAt", "DESC"]],
            attributes: ["id","document_number"],
          });
        
            let number;
            const currentYear = new Date().getFullYear();
            if (lastEntry) {
              const lastCode = lastEntry.id;
              const newCode = `PP-INV-${currentYear}-0${lastCode + 1}`;
              number = newCode;
              
            } else {
              number = `PP-INV-${currentYear}-01`;
              
            }
        return res.status(200).send({code:200,message:'success',data:number})

      

    } catch (error) {
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Server Error" });
    }
  };

module.exports.getAllCompletedInvoice = async (req, res) => {
    try {
      const { financial_year_id, entity_id,  } = req.query;
      const {party_type_id,party_type} = req.body;
      if(!party_type_id){
        return res.status(404).send({code:404,message:'Data Not Found',data:[]})
      }
if(party_type == 'VENDOR'){
  const [dataExist] = await db.sequelize.query(`
    SELECT G.* ,G.id AS invoice_id,G.total_amount AS amount_due,VB.vendor_name
FROM GRN_MASTER AS G
INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = G.vendor_id
WHERE G.entity_id = ${entity_id} AND G.financial_year_id=${financial_year_id} AND G.vendor_id = ${party_type_id} AND G.invoice_status='COMPLETED'`)
   

const [paidAmountList] = await db.sequelize.query(`
    SELECT SUM(PP.paid_amount) AS paid_amount,PP.invoice_id,PP.total_amount
FROM PAYMENT_PROGRAM AS P
INNER JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.payment_program_id = P.id
WHERE P.entity_id = ${entity_id} AND PP.vendor_id = ${party_type_id} 
GROUP BY PP.invoice_id`)

const [invoiceTotalAmt] = await db.sequelize.query(`
SELECT  COALESCE(SUM(DISTINCT  PL.paid_amount),0) AS paid_amount,COALESCE(SUM(GM.total_amount),0) - COALESCE(SUM(PL.paid_amount),0) AS amount_due,
COALESCE(SUM(GM.total_amount),0) AS total_amount FROM GRN_MASTER AS GM
LEFT JOIN PAYMENT_PROGRAM_LIST AS PL ON GM.vendor_id = PL.vendor_id
WHERE GM.invoice_status = 'COMPLETED' AND GM.vendor_id = ${party_type_id}

`)
  
const finalData = await Promise.all(dataExist.map((md)=>{
  const matchingData = paidAmountList.find((ud)=> ud.invoice_id == md.invoice_id)
  if(matchingData){
      return {
          ...md,
          amount_due:parseFloat(matchingData.total_amount) - parseFloat(matchingData.paid_amount),
          paid_amount:parseFloat(matchingData.paid_amount)
      }
  }else{
      return {
        ...md,
        paid_amount:0.00
      }
  }
}))
    if (finalData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: finalData,
        totalAmount:invoiceTotalAmt[0]
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: finalData ,totalAmount:invoiceTotalAmt[0]});
    }
}
if(party_type == 'CUSTOMER'){
  const [dataExist] = await db.sequelize.query(`
    SELECT C.id AS invoice_id,C.grand_total AS amount_due,C.grand_total AS total_amount,C.sales_invoice_date AS invoiceDate,
    CP.company_name AS vendor_name,C.sales_invoice_no AS invoiceNo,C.payment_status, C.customer_id,C.entity_id
FROM CRM_SALES_INVOICE_MST AS C
INNER JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = C.customer_id
WHERE C.entity_id = ${entity_id} AND C.financial_year_id=${financial_year_id} AND C.customer_id = ${party_type_id} AND C.invoice_status='APPROVED'`)
   

const [paidAmountList] = await db.sequelize.query(`
    SELECT SUM(PP.paid_amount) AS paid_amount,PP.sales_invoice_id,PP.total_amount
FROM PAYMENT_PROGRAM AS P
INNER JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.payment_program_id = P.id
WHERE P.entity_id = ${entity_id} AND PP.customer_id = ${party_type_id} 
GROUP BY PP.sales_invoice_id`)

const [invoiceTotalAmt] = await db.sequelize.query(`
SELECT  COALESCE(SUM(DISTINCT  PL.paid_amount),0) AS paid_amount,COALESCE(SUM(GM.grand_total),0) - COALESCE(SUM(PL.paid_amount),0) AS amount_due,
COALESCE(SUM(GM.grand_total),0) AS total_amount 
FROM CRM_SALES_INVOICE_MST AS GM
LEFT JOIN PAYMENT_PROGRAM_LIST AS PL ON GM.customer_id = PL.customer_id
WHERE GM.invoice_status = 'APPROVED' AND GM.customer_id = ${party_type_id}

`)
  
const finalData = await Promise.all(dataExist.map((md)=>{
  const matchingData = paidAmountList.find((ud)=> ud.sales_invoice_id == md.invoice_id)
  if(matchingData){
      return {
          ...md,
          amount_due:parseFloat(matchingData.total_amount) - parseFloat(matchingData.paid_amount),
          paid_amount:parseFloat(matchingData.paid_amount)
      }
  }else{
      return {
        ...md,
        paid_amount:0.00
      }
  }
}))
    if (finalData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: finalData,
        totalAmount:invoiceTotalAmt[0]
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: finalData ,totalAmount:invoiceTotalAmt[0]});
    }
}
     
    } catch (error) {
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Server Error" });
    }
};


