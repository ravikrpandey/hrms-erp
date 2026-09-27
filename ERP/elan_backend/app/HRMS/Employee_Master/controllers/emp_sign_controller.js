const e = require("express")
const db=require("../../../models/index")
const emp_document_model=db.emp_sign_data
const User_model=db.user;

exports.create_emp_sign=async(req,res)=>{
    try{
        const employee_id=req.params.id        
        const emp_signature=req.file.path==undefined?" ":req.file.path
        const verify_employee=await User_model.findOne({where:{employee_id:employee_id}})
        if(verify_employee){
            const find_previous_signature=await emp_document_model.findOne({where:{employee_id:employee_id}})
            if(find_previous_signature){
                return res.status(403).send({code:403,message:"Employee Signature already exists"})
            }
            else{
            const create_emp_sign=await emp_document_model.create({
                    employee_id,
                    emp_signature:baseUrl+emp_signature
            })
            return res.status(200).send({code:200,message:"signed Registered",data:create_emp_sign})
        }
        }
        else{
            return res.status(404).send({code:404,message:"No Such employee for this Id"})
        }
    }
    catch(error){
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}

exports.get_emp_document_by_id=async(req,res)=>{
    try{
        const employee_id=req.params.id
        const verify_emp=await emp_document_model.findOne({where:{employee_id:employee_id}})
        if(verify_emp){
            return res.status(200).send({code:200,message:"signature found",data:verify_emp})
        }
        else{
            return res.status(404).send({code:400,message:"No such employee with employee_id"})
        }
    }
    catch(error){
        logger.error(`Error ${error.message}`, { error });
        console.error(error)
        return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}

exports.get_all_employee_sign=async(req,res)=>{
    try{
    const   employee_data=await emp_document_model.findAll({where:{status:"ACTIVE"}})
    return res.status(200).send({code:200,message:"signatures found",data:employee_data})
}
catch(error){
    logger.error(`Error ${error.message}`, { error });
    console.log(error)
    return res.status(500).send({code:500,message:"Internal Server Error"})
}
}

exports.update_emp_sign=async(req,res)=>{
    try{
        const employee_id=req.params.id
        const emp_signature=req.file.path==undefined?" ":req.file.path
        const get_document=await emp_document_model.findOne({where: {employee_id: employee_id}})
        if(get_document){
            const update_emp_sign=await emp_document_model.update({
                emp_signature:baseUrl+emp_signature
            },{where:{employee_id:employee_id}})
            return res.status(200).send({code:200, message:"employe_sign updated"})
        }
        else{
            return res.status(404).send({code:404,message:"No such document"})
        }
    }
    catch(error){
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}

exports.Inactive_employee_sign=async(req,res)=>{
    try{
        const employee_id=req.params.id
        const employee_data=await emp_document_model.findOne({where:{ employee_id: employee_id}})
        if(employee_data){
            const delete_document=await emp_document_model.update({
                status:"INACTIVE"
            },{where:{ employee_id: employee_id}})
            return res.status(200).send({code:200,message:"Employee signature Deleted"})
        }
        else{
            return res.status(404).send({code:404,message:"No Such Employee Found"})
        }
    }
    catch(error){
        logger.error(`Error ${error.message}`, { error });
    console.log(error)
    return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}
exports.delete_employe_sign=async(req,res)=>{
    try{
        const employee_id=req.params.id
        const employe_data=await emp_document_model.findOne({where:{employee_id:employee_id}})
        if(employe_data){
            const delete_emp=await emp_document_model.destroy({where:{employee_id:employee_id}})
            return res.status(200).send({code:200,message:"Employee signature deleted successfully"})
        }
        else{
            return res.status(404).send({code:404,message:"No such employee Found"})
        }
    }
    catch(error){
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}