const db = require('../../../models/index')

module.exports.getAllVoucherData = async (req, res) => {
   
try {
    const {entity_id} = req.query;
const getAllVoucher = await db.voucherMaster.findAll({where:{isDeleted:false,entity_id},order:[['id','DESC']]})
if(getAllVoucher){
    return res.status(200).send({code:200,data:getAllVoucher})
}else{
    return res.status(200).send({code:404,message:'No Record Found',data:getAllVoucher})
}

} catch (error) {
     return res.status(500).send({code:500,message:error.message})
}


}

module.exports.generateSeriesData =  async (req,res)=>{
    let inputData = req.query.input
   try {
    const getAllVoucher = await db.voucherMaster.findAll({where:{isDeleted:false}}) 
    let finalData = `${inputData}-000-${getAllVoucher.length}`
    return res.status(200).send({code:200,data:finalData,message:'Journal Voucher Series Generated Succesfully'})
   } catch (error) {
    return res.status(500).send({code:500,message:error.message})
   }
}




module.exports.createVoucherData=(req,res)=>{
    try {
        // let {payload}  = req.body;
      let create = db.voucherMaster.create(req.body)
         if(create){
            return res.status(200).send({code:200,data:create,message:'Voucher Created Successfully'})
         }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
         
    }
}

module.exports.getVoucherById= async (req,res)=>{
    let id = req.params.id
   try {
    const getAllVoucher = await db.voucherMaster.findOne({where:{isDeleted:false,id:id}})  
    if(getAllVoucher){
        return res.status(200).send({code:200,data:getAllVoucher})
    }
   } catch (error) {
    return res.status(500).send({code:500,message:error.message})
    
   }
}
module.exports.deleteVoucherById= async (req,res)=>{
    let id = req.params.id
   try {
    const [updatedCount] = await db.voucherMaster.update(
        { isDeleted : true },          
        { where: { id : id } }         
      ); 
    if(updatedCount){
        return res.status(200).send({code:200,message:'Voucher Deleted Successfully'})
    }
   } catch (error) {
    return res.status(500).send({code:500,message:error.message})
    
   }
}
module.exports.updateVoucherData= async (req,res)=>{
    let id = req.params.id
   try {
    const [updatedCount] = await db.voucherMaster.update(
        req.body,          
        { where: { id : id } }         
      ); 
    if(updatedCount){
        return res.status(200).send({code:200,message:'Voucher Updated Successfully'})
    }
   } catch (error) {
    return res.status(500).send({code:500,message:error.message})
    
   }
}