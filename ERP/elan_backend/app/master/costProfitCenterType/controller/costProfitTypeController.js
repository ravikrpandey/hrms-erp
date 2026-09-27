const db = require('../../../models/index')

module.exports.createCostProfitType= async(req,res)=>{
try {
    const {entity_id,selected_type,name,id}=req.body;
   let  createData;
    if(!id){
     createData = await db.costProfitCenterType.create({entity_id,selected_type,name})
    }else{
        createData = await db.costProfitCenterType.update({selected_type,name},{where:{id}})
    }
    if(createData){
        return res.status(200).send({code:201,message:id?'Updated Successfully':'Successfully Created'})
    }else{
        return res.status(404).send({code:404,message:'Not created'})
    }
} catch (error) {
    return res.status(500).send({code:500,message:error.message})
}
}


module.exports.getCostProfitType= async(req,res)=>{
    try {
        const {entity_id}=req.query;
        const getData = await db.costProfitCenterType.findAll({where:{entity_id,isDeleted:false}})
        if(getData){
            return res.status(200).send({code:200,message:'Success',data:getData})
        }else{
            return res.status(404).send({code:404,message:'Not created'})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.deleteCostProfitTypeById= async(req,res)=>{
    try {
        const {id}=req.query;
        const getData = await db.costProfitCenterType.update({isDeleted:true},{where:{id}})
        if(getData){
            return res.status(200).send({code:200,message:'Deleted Successfully',data:getData})
        }else{
            return res.status(404).send({code:404,message:'Not created'})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}
