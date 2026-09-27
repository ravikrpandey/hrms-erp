const db = require('../../../models/index')
const {Op} = require('sequelize')

module.exports.getAllPaymentVoucherData = async (req, res) => {
        
try {
    const {entity_id} = req.query;
const paymentAdviceVoucher = await db.paymentAdviceVoucher.findAll({where:{isDeleted:false,entity_id},order:[['id','DESC']]})
if(paymentAdviceVoucher){
    return res.status(200).send({code:200,data:paymentAdviceVoucher})
}else{
    return res.status(200).send({code:404,message:'No Record Found',data:paymentAdviceVoucher})
}

} catch (error) {
     return res.status(500).send({code:500,message:error.message})
}


}


module.exports.generateSeriesData =  async (req,res)=>{
       let inputData = req.query.input
      try {
       const paymentAdviceVoucher = await db.paymentAdviceVoucher.findAll({where:{isDeleted:false}}) 
       let finalData = `${inputData}-000-${paymentAdviceVoucher.length}`
       return res.status(200).send({code:200,data:finalData,message:'Payment Advice Voucher Series Generated Succesfully'})
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
      }
   }
   

   module.exports.createPaymentAdviceData=(req,res)=>{
       try {
           // let {payload}  = req.body;
         let create = db.paymentAdviceVoucher.create(req.body)
            if(create){
               return res.status(200).send({code:200,data:create,message:'Payment Advice Voucher Created Successfully'})
            }
       } catch (error) {
           return res.status(500).send({code:500,message:error.message})
            
       }
   }

   module.exports.deletePaymentAdviceData= async (req,res)=>{
       let id = req.params.id
      try {
       const [updatedCount] = await db.paymentAdviceVoucher.update(
           { isDeleted : true },          
           { where: { id : id } }         
         ); 
       if(updatedCount){
           return res.status(200).send({code:200,message:'Payment Advice Voucher Deleted Successfully'})
       }
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
       
      }
   }


   module.exports.getPaymentAdviceVoucher= async (req,res)=>{
       let id = req.params.id
      try {
       const paymentAdviceVoucher = await db.paymentAdviceVoucher.findOne({where:{isDeleted:false,id:id}})  
       if(paymentAdviceVoucher){
           return res.status(200).send({code:200,data:paymentAdviceVoucher})
       }
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
       
      }
   }

   module.exports.updatePaymentVoucherData= async (req,res)=>{
       let id = req.params.id
      try {
       const [updatedCount] = await db.paymentAdviceVoucher.update(
           req.body,          
           { where: { id : id } }         
         ); 
       if(updatedCount){
           return res.status(200).send({code:200,message:'Payment Advice Voucher Updated Successfully'})
       }
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
       
      }
   }



   module.exports.getVendorByIdTdsValue= async (req,res)=>{
   try {
    const {id} = req.query;
     const [dataList] = await db.sequelize.query(
        `SELECT VTM.*,STM.* FROM VENDOR_TDS_MST AS VTM 
            INNER JOIN SYS_TDS_MST AS STM ON VTM.tds_id = STM.id
            WHERE VTM.vendor_id=${id}`
     )
    const [totalAmountValue] = await db.sequelize.query(
        `SELECT V.vendor_id,COALESCE(SUM(V.paid_amount),0) AS totalAmount FROM PAYMENT_PROGRAM_LIST AS V
        WHERE V.vendor_id=${id} GROUP BY V.vendor_id`
    )
   
   
    if(dataList){
        return res.status(200).send({code:200,message:'Successfully',data:dataList,totalAmount:totalAmountValue?.[0]?.totalAmount || 0})
    }else{
        return res.status(200).send({code:400,message:'Data Not Found',data:dataList,})
    }
   } catch (error) {
    return res.status(500).send({code:500,message:error.message})
    
   }
}

exports.getTdsNatureOfTransaction = async(req,res)=>{
    try {
        const {nature_id,vendor_id} = req.query;
       
        const [natureData]=await db.sequelize.query(`   
 SELECT
    TL.id,
    TL.threshold_limit,
    TL.tds_id,
    TL.nature_of_transaction,
    TL.maximum_amount,
    TL.from_date,

    S.section,
    S.chart_account_id,

    VB.chart_of_account_id,
    VB.advanced_chart_of_account_id,
    VB.isChecked,
    VB.certificate_doc,
    VB.time_periods_from,
    VB.time_periods_to,
    VB.rate,
    VB.isChecked_194,
    VB.rate_194,
    VB.declaration_doc,
    VB.from_month,
    VB.to_month,

    CASE
        WHEN VB.isChecked = 1
             AND CURDATE() BETWEEN VB.time_periods_from AND VB.time_periods_to
        THEN COALESCE(VB.rate, TL.new_rate, TL.rate)

        WHEN VB.isChecked_194 = 1
             AND CURDATE() BETWEEN VB.from_month AND VB.to_month
        THEN COALESCE(VB.rate_194, TL.new_rate, TL.rate)

        WHEN TL.from_date IS NOT NULL
             AND DATE(TL.from_date) <= CURDATE()
        THEN COALESCE(TL.new_rate, TL.rate)

        ELSE COALESCE(TL.rate, 0)
    END AS current_rate,

    COALESCE(PP.total_amount, 0) AS total_amount

FROM TDS_LIST_MST TL

INNER JOIN SYS_TDS_MST S
    ON S.id = TL.tds_id

INNER JOIN VENDOR_TDS_MST VT
    ON VT.tds_id = S.id
   AND VT.nature_id = TL.id

INNER JOIN VENDOR_BASIC_DETAILS VB
    ON VB.id = VT.vendor_id

LEFT JOIN
(
    SELECT
        vendor_id,
        nature_id,
        SUM(paid_amount) AS total_amount
    FROM PAYMENT_PROGRAM_LIST
    GROUP BY vendor_id, nature_id
) PP
    ON PP.vendor_id = VB.id
   AND PP.nature_id = TL.id

WHERE TL.id = ${nature_id}
  AND VB.id = ${vendor_id};`)
 


            if(natureData){
                return res.status(200).send({code:200,message:'Successfully',data:natureData})
            }else{
                return res.status(200).send({code:400,message:'Data Not Found',data:natureData})
            }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}


module.exports.getPOInvoiceDataListById = async (req, res) => {
    try {
        const { po_id, invoice_id, grn_id, purchase_journal_id } = req.body;

        // let paymentProgramList = [];

        let mainPoId = po_id;
        let relatedGrnIds = [];
        let relatedInvoiceIds = [];

//         if (po_id) {
//             const grns = await db.grnMaster.findAll({
//                 where: { po_Id: po_id, grnStatus: 'COMPLETED' },
//                 attributes: ['id']
//             });
//             relatedGrnIds = grns.map(g => g.id);
//         } else if (grn_id || invoice_id) {
//             const grn = await db.grnMaster.findOne({
//                 where: { id: grn_id || invoice_id, grnStatus: 'COMPLETED' },
//                 attributes: ['id', 'po_Id']
//             });
//             if (!grn) return res.status(404).send({ code: 404, message: 'Data Not Found' });

//             mainPoId = grn.po_Id;
//             relatedGrnIds = [grn.id];
//             relatedInvoiceIds = [grn.id];
//         }

//         if (mainPoId || relatedGrnIds.length > 0 || relatedInvoiceIds.length > 0 ) {
//             const poCondition = mainPoId ? `P.po_id = ${mainPoId}` : '1=0';
//             const grnCondition = relatedGrnIds.length ? `P.grn_id IN (${relatedGrnIds.join(',')})` : '1=0';
//             const invoiceCondition = relatedInvoiceIds.length ? `P.invoice_id IN (${relatedInvoiceIds.join(',')})` : '1=0';
          
//             [paymentProgramList] = await db.sequelize.query(`
//                 SELECT P.*, V.vendor_name, TL.rate, 'Vendor' AS party_name, PL.document_number,
//                        P.paid_amount AS record_amount, P.total_amount AS document_value
//                 FROM PAYMENT_PROGRAM AS PL
//                 INNER JOIN PAYMENT_PROGRAM_LIST AS P ON P.payment_program_id = PL.id
//                 INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = P.vendor_id
//                 LEFT JOIN SYS_TDS_MST AS ST ON ST.id = P.tds_id
//                 LEFT JOIN TDS_LIST_MST AS TL ON TL.id = P.nature_id
//                 WHERE (${poCondition} OR ${grnCondition} OR ${invoiceCondition})
//                 ORDER BY P.createdAt ASC
//             `);
//         }
// console.log('====================',mainPoId)
//         let poExist;
//         if (mainPoId) {
//             poExist = await db.purchase_order.findOne({ where: { id: mainPoId }, attributes: ['id', 'total_purchase'] });
//         } else {
//             const grn = await db.grnMaster.findOne({ where: { id: relatedGrnIds[0] }, attributes: ['id', ['total_amount', 'total_purchase']] });
//             poExist = grn;
//         }

//         let amountDue, countValue, latestRecord;

//         if (!paymentProgramList || paymentProgramList.length === 0) {
//             amountDue = poExist.dataValues?.total_purchase || 0;
//             countValue = 0;
//             latestRecord = null;
//             paymentProgramList = [];
//         } else {
//             latestRecord = paymentProgramList[paymentProgramList.length - 1];
//             amountDue = latestRecord?.amount_due;
//             countValue = paymentProgramList.reduce((a, b) => a + parseFloat(b.record_amount || 0), 0);
//         }

//         let payment, done_payment_from_vendor;
//         if (amountDue <= 0) {
//             done_payment_from_vendor = 'Done Payment';
//         } else {
//             payment = 'No';
//         }
                const grn = await db.grnMaster.findOne({
                    where: { id:  invoice_id,  },
                    attributes:['id', ['total_amount', 'total_purchase']]
                });
               let [paymentProgramList] = await db.sequelize.query(`
                                  SELECT P.*, V.vendor_name, TL.rate, 'Vendor' AS party_name, PL.document_number,
                                           P.paid_amount AS record_amount, P.total_amount AS document_value,'Purchase Invoice' AS document_type
                                    FROM PAYMENT_PROGRAM AS PL
                                    INNER JOIN PAYMENT_PROGRAM_LIST AS P ON P.payment_program_id = PL.id
                                   INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = P.vendor_id
                                     LEFT JOIN SYS_TDS_MST AS ST ON ST.id = P.tds_id
                                   LEFT JOIN TDS_LIST_MST AS TL ON TL.id = P.nature_id
                                   WHERE P.invoice_id = ${invoice_id}
                                    ORDER BY P.createdAt ASC
                                 `);

                                 let amountDue, countValue, latestRecord;

        if (!paymentProgramList || paymentProgramList.length === 0) {
            amountDue = grn.dataValues?.total_purchase || 0;
            countValue = 0;
            latestRecord = null;
            paymentProgramList = [];
        } else {
            latestRecord = paymentProgramList[paymentProgramList.length - 1];
            amountDue = latestRecord?.amount_due;
            countValue = paymentProgramList.reduce((a, b) => a + parseFloat(b.record_amount || 0), 0);
        }
        
        let payment, done_payment_from_vendor;
                if (amountDue <= 0) {
                    done_payment_from_vendor = 'Done Payment';
                } else {
                    payment = 'No';
                }
        return res.status(200).send({
            code: 200,
            message: 'success',
            data: paymentProgramList,
            document_value: grn.dataValues?.total_purchase || 0,
            amount_paid_now: countValue || 0,
            amount_due: amountDue || 0,
            payment_type: payment,
            done_payment_from_vendor: done_payment_from_vendor
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};