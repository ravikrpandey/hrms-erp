const { where } = require('sequelize');
const db=require('../../../models/index')
const Currency_Conversion=db.currency_convert;

exports.Make_Currency=async(req,res)=>{
    try{
        const {Currency_Type, rate}=req.body;
        const findCurrency= await Currency_Conversion.findOne({
            where: {Currency_Type: Currency_Type}
        })
    
       if(findCurrency || findCurrency!= null){
        const Update_Currency=await Currency_Conversion.update({
            Currency_Type: Currency_Type,
            rate: rate
        },{where:{Currency_Convert_id: findCurrency.Currency_Convert_id }})
            res.status(200).send({code :200,message:"Successfully Updated",data:Update_Currency})
       }
       else {
        const Create_Currency=await Currency_Conversion.create({
            Currency_Type: Currency_Type, 
            rate: rate
        })
        res.status(200).send({code :200,message : "Currency created successfully",data: Create_Currency})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send({code : 500, message : "Server error"})
    }
}

/////////////////Get ALL //////////////////////////////////
exports.getAll_Currency=async(req,res)=>{
    try{
        const Get_Currency=await Currency_Conversion.findAll()
        if(Get_Currency){
            res.status(200).send({code : 200,message :"Data found successfully",data:Get_Currency})
        }
        else{
            res.status(404).send({code:404,message:"No  currency id Found"})
        }
    }
    catch(error){
        res.status(500).send({code : 500, message : "Server error"})
    }

}

/////////////////Get ALL //////////////////////////////////
exports.getByIdAll_Currency=async(req,res)=>{
    try{
        const Get_Currency=await Currency_Conversion.findOne({
            where: {Currency_Convert_id: req.params.id}
        })
        if(Get_Currency){
            res.status(200).send({code : 200,message :"Data found successfully",data:Get_Currency})
        }
        else{
            res.status(404).send({code:404,message:"No  currency id Found"})
        }
    }
    catch(error){
        res.status(500).send({code : 500, message : "Server error"})
    }

}


///////////////////////Update_Currency //////////////////////////////////
exports.Update_Currency=async(req,res)=>{
    try{
        const {Currency_Type,rate} = req.body
        const Currency_Convert_id=parseInt(req.params.id)
        const Update_Currency=await Currency_Conversion.findOne({Currency_Convert_id:Currency_Convert_id})
     
        if(Update_Currency){
            const Update_Currency=await Currency_Conversion.update({
                Currency_Type:Currency_Type,
                rate:rate

            },{where:{Currency_Convert_id:Currency_Convert_id}})
            res.status(200).send({code :200, message : "Update Successfully",data:Update_Currency})
        }
        else{
            res.status(404).send({code:404,message:"No currency Id Found"})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send({code : 500, message : "Server error"})
    }
}




exports.getall_currency_payroll = async (req, res) => {
    try {
        const Get_Currency = await Currency_Conversion.findAll({ where: { default_status: "ACTIVE" } });
        if (Get_Currency) {
            res.status(200).send({ code: 200, message: "Currency Data found successfully", data: Get_Currency })
        }
        else {
            res.status(404).send({ code: 404, message: "No  currency id Found" })
        }
    }
    catch (error) {
        res.status(500).send({ code: 500, message: error.message ||"Server error" })
    }

}