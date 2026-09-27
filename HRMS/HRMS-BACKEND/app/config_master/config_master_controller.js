const db=require("../models/index")
const role_menu_access_model=db.role_menu_access;
const User=db.user
const Submenu_model=db.submenu_master


exports.get_role_data=async(req,res)=>{
    try{
        const employee_id=req.params.id
        const employee_data=await User.findOne({where:{employee_id:employee_id}})
        const role_master_id=employee_data.role_master_id;
        if(employee_data){
            const role_master_data=await role_menu_access_model.findAll({where:{role_master_id:role_master_id}})
            if(role_master_data){
                let submenu_master_id;
                let submenudata;
                for(let i=0;i<role_master_data.length;i++){
                    submenu_master_id=role_master_data[i].submenu_master_id
                    submenudata=await Submenu_model.findAll({where:{submenu_master_id:submenu_master_id}})   
                }
                return res.status(200).send({code:200,message:"Submenu Access data",data:submenudata});
            }
            else{
                return res.status(403).send({code:403,message:"Couldn't find role_master_id"})
            }
        }
        else{
            return res.status(404).send({code:404,message:"could not find the employee"})
        }
    }
    catch(error){
        console.error(error)
        return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}


exports.get_master_submenus=async(req,res)=>{
    try{
        
    }
    catch(error){
        console.log(error)
        return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}