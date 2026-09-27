const db = require("../../../models/index");

module.exports.getFieldType = async (req, res) =>{
    try{
        const getFieldType= await db.fieldType.findAll({attributes:['id','field_type'],
        order: [['id', 'DESC']]})
        if(getFieldType){
            return res.status(200).send({code:200, message:'Success',data:getFieldType})
        }else{
            return res.status(404).send({code: 404,message:'Not Created'})
        }
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Server Error" });
        }
};

module.exports.getCreateModuleData = async (req, res) =>{
    try{
        const getData= await db.models.crmModule.findAll({attributes:['menuLink','menuName'],
        order: [['id', 'DESC']]})
        if(getData){
            return res.status(200).send({code:200, message:'Success',data:getData})
        }else{
            return res.status(404).send({code: 404,message:'Not Created'})
        }
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Server Error" });
        }
};