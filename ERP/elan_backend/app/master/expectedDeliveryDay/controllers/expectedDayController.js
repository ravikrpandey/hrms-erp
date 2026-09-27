const db = require("../../../models/index");
module.exports.expectedDay = async (req, res) => {
    try {
        let {days} = req.body;
        if(!days){
            return res.status(400).send({code:400,success:false,message:'Expected days is required'});
        }
        let isExist = await db.expectedDays.findOne({where:{days}});
        if(isExist){
            return res.status(400).send({code:400,success:false,message:'Expected days is alerady exist'});
        }
        await db.expectedDays.update({status:'INACTIVE'},{where:{}});
        let isCreated = await db.expectedDays.create({days});
        if(isCreated){
            return res.status(200).send({code:200,success:false,message:'Expected days created successfully'});            
        }else{
            return res.status(400).send({code:400,success:false,message:'Failed'});            
        }
        
    } catch (error) {
        return res.status(500).send({code:500,success:false,message:error.error.message});
    }
}
module.exports.updateExpectedDeliveryDays = async (req, res) => {
    try {
        let {status} = req.body;
        let id = req.params.id;
        await db.expectedDays.update({status:'INACTIVE'},{where:{}});
        let isUpdated = await db.expectedDays.update({status},{where:{id:id}});
        if(isUpdated){
            return res.status(200).send({code:200,success:false,message:'Expected days updated successfully'});            
        }else{
            return res.status(400).send({code:400,success:false,message:'Failed'});            
        }        
    } catch (error) {
        return res.status(500).send({code:500,success:false,message:error.message});
    }
}
module.exports.getExpectedDay = async (req, res) => {
    try {
       
        let isExist = await db.expectedDays.findAll({
            order:[['createdAt','DESC']]
        });
        if(!isExist){
            return res.status(200).send({code:200,success:false,message:'Expected days is not found'});
        }
        
        
            return res.status(200).send({code:200,success:false,message:'Expected days list',data:isExist});            
        
        
    } catch (error) {
        return res.status(500).send({code:500,success:false,message:error.message});
    }
}