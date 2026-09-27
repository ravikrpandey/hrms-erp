const db = require('../../../models/index')

module.exports.getAllBankPaymentVoucherData = async (req, res) => {
        
try {
    const {entity_id} = req.query;
const bankPaymentVoucher = await db.bankPaymentVoucher.findAll({where:{isDeleted:false,entity_id},order:[['id','DESC']]})
if(bankPaymentVoucher){
    return res.status(200).send({code:200,data:bankPaymentVoucher})
}else{
    return res.status(200).send({code:404,message:'No Record Found',data:bankPaymentVoucher})
}

} catch (error) {
     return res.status(500).send({code:500,message:error.message})
}


}


module.exports.generateBankPaymentVoucher =  async (req,res)=>{
       let inputData = req.query.input
      try {
       const bankPaymentVoucher = await db.bankPaymentVoucher.findAll({where:{isDeleted:false}}) 
       let finalData = `${inputData}-000-${bankPaymentVoucher.length}`
       return res.status(200).send({code:200,data:finalData,message:'Bank Reciept Voucher Series Generated Succesfully'})
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
      }
   }
   

   module.exports.createBankPaymentVoucherData=(req,res)=>{
       try {
           // let {payload}  = req.body;
         let create = db.bankPaymentVoucher.create(req.body)
            if(create){
               return res.status(200).send({code:200,data:create,message:'Bank Payment Voucher Created Successfully'})
            }
       } catch (error) {
           return res.status(500).send({code:500,message:error.message})
            
       }
   }

   module.exports.deletebankPaymentData= async (req,res)=>{
       let id = req.params.id
      try {
       const [updatedCount] = await db.bankPaymentVoucher.update(
           { isDeleted : true },          
           { where: { id : id } }         
         ); 
       if(updatedCount){
           return res.status(200).send({code:200,message:'Bank Payment Voucher Deleted Successfully'})
       }
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
       
      }
   }


   module.exports.getBankPaymentVoucher= async (req,res)=>{
       let id = req.params.id
      try {
       const bankPaymentVoucher = await db.bankPaymentVoucher.findOne({where:{isDeleted:false,id:id}})  
       if(bankPaymentVoucher){
           return res.status(200).send({code:200,data:bankPaymentVoucher})
       }
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
       
      }
   }

   module.exports.updateBankPaymentVoucherData= async (req,res)=>{
       let id = req.params.id
      try {
       const [updatedCount] = await db.bankPaymentVoucher.update(
           req.body,          
           { where: { id : id } }         
         ); 
       if(updatedCount){
           return res.status(200).send({code:200,message:'Bank Payment Voucher Updated Successfully'})
       }
      } catch (error) {
       return res.status(500).send({code:500,message:error.message})
       
      }
   }

   module.exports.generateBankPaymentNumber = async (req, res) => {
    try {
     
  
      const {branch_id,voucher_id} = req.body

      const branchExist = await db.tbl_branch.findOne({where:{id:branch_id},attributes:['id','branch_name']})
      const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();
      const voucherMainListExist = await db.voucherMainList.findOne({where:{id:voucher_id},attributes:['id','series','voucher_main_id','voucher_name']})
      const voucherMainExist = await db.voucherMain.findOne({where:{id:voucherMainListExist.voucher_main_id},attributes:['id','name']})
      const voucherPrefixed = voucherMainExist.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
      const voucherPrefixedMainList = voucherMainListExist.voucher_name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
      const lastEntry = await db.bankPayment.findOne({
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
      return res.status(200).send({ code: 200, message: "Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

