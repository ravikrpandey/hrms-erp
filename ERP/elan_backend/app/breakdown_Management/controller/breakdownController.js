const { forEach } = require("mathjs");
const path = require('path');
const moment = require('moment');
const { Op, sequelize, fn, col, where } = require('sequelize');
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../models/index");
const addbreakdown=db.addbreakdown
exports.createBreakdownIndent = async (req, res) => {
    try {
        const {
            workstation_id,
            line,
            name,
            breakdown_code,
            image_upload,
            entity_id,
            financial_year_id,
            shift_id,
            issue_id,
            priority,
            description,
            allocated_emp_id,
        } = req.body;

        if (
            !workstation_id || 
            !line || 
            !name || 
            !entity_id || 
            !financial_year_id || 
            !shift_id || 
            !issue_id || 
            !priority || 
            !description 
        ) {
            return res.status(400).send({
                code: 400,
                message: "All fields are required",
            });
        }

        let formattedUploadDoc = req.file 
            ? req.file.path.replace(/\\/g, '/') 
            : (image_upload ? image_upload.replace(/\\/g, '/') : '');
            let data = await addbreakdown.findAll(); 
            let count = data.length + 1;            
            let newcode = `BREAK${String(count).padStart(2, '0')}`;

         let response=await addbreakdown.create({
            workstation_id:workstation_id,
            line: line,
            name:name,
            breakdown_code:breakdown_code,
            image_upload:formattedUploadDoc,
            entity_id: entity_id,
            financial_year_id: financial_year_id,
            shift_id:shift_id,
            issue_id: issue_id,
            priority: priority,
            description: description,
            allocated_empId:allocated_emp_id,
            breakdown_code:newcode
         })

        return res.status(200).send({
            code: 200,
            message: "Breakdown indent created successfully",
            data: response,
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};

exports.getAll_BreakdownIndent = async(req,res)=>{
    const {entity_id,financial_year_id} = req.query;
    try{
       if(entity_id && financial_year_id){
          let [response] = await db.sequelize.query(
            `SELECT ABM.id, ABM.line,ABM.name,ABM.breakdown_code,ABM.priority,WS.name_of_workstation,
        ABM.breakSatus,TS.status_name
        FROM 
            ADD_BREAKDOWN_MST AS ABM
        INNER JOIN 
            MASTER_WORKSTATION AS WS 
        ON 
        ABM.workstation_id = WS.id
        LEFT JOIN 
        TBL_STATUS AS TS ON ABM.status_id=TS.id
        where ABM.entity_id=${entity_id} and ABM.financial_year_id=${financial_year_id};`
          )
          return res.status(200).send({
            code: 200,
            message: "data fetch successfully",
            data: response,
        });
       }
       else{
        return res.status(404).send({
            code: 404,
            message: "data not found",
            data: [],
        });
       }
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
}

exports.getBreakIndent_byId = async (req,res)=>{
    const {id}=req.query;
    try{
       if(id){
          let [response]=await db.sequelize.query(`
            Select * from ADD_BREAKDOWN_MST where id=${id}
            `)
            return res.status(200).send({
                code: 200,
                data:response,
                message: 'data fetch successfully'
            });
       }
       else{
        return res.status(404).send({
            code: 404,
            message: error.message || "Id not found!!",
        });
       }
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
}
exports.getAll_OpenIndent = async (req,res)=>{
    const {entity_id,financial_year_id}=req.query;
    try{
       if(entity_id && financial_year_id){
          let [response]=await db.sequelize.query(`
                     SELECT 
                ABM.id, 
                ABM.line, 
                ABM.name, 
                ABM.breakdown_code, 
                ABM.priority, 
                WS.name_of_workstation, 
                ABM.breakSatus,
                TS.status_name
               
            FROM 
                ADD_BREAKDOWN_MST AS ABM
            INNER JOIN 
                MASTER_WORKSTATION AS WS ON ABM.workstation_id = WS.id
            LEFT JOIN
             TBL_STATUS AS TS ON ABM.status_id=TS.id
            WHERE 
                ABM.entity_id = ${entity_id}
                AND ABM.financial_year_id = ${financial_year_id}
                AND ABM.breakSatus='PENDING'
            `)
            return res.status(200).send({
                code: 200,
                data:response,
                message: 'data fetch successfully'
            });
       }
       else{
        return res.status(404).send({
            code: 404,
            message: error.message || "Id not found!!",
        });
       }
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
}
exports.getAll_AllocatedIndent = async (req,res)=>{
    const {entity_id,financial_year_id}=req.query;
    try{
       if(entity_id && financial_year_id){
          let [response]=await db.sequelize.query(`
                 SELECT 
    ABM.id, 
    ABM.line, 
    ABM.name, 
    ABM.breakdown_code, 
    ABM.priority, 
    WS.name_of_workstation, 
    ABM.breakSatus, 
    CONCAT(HRU.first_name, ' ', HRU.middle_name, ' ', HRU.last_name) AS Emp_Name,
    TS.status_name
    FROM 
        ADD_BREAKDOWN_MST AS ABM
    INNER JOIN 
        MASTER_WORKSTATION AS WS ON ABM.workstation_id = WS.id
    INNER JOIN 
        HRMS_REGISTERED_USER AS HRU ON ABM.employee_id = HRU.employee_id
    LEFT JOIN 
    TBL_STATUS AS TS ON ABM.status_id=TS.id
    WHERE 
    ABM.entity_id = ${entity_id}
    AND ABM.financial_year_id = ${financial_year_id}
    AND ABM.employee_id IS NOT NULL;
            `)
            return res.status(200).send({
                code: 200,
                data:response,
                message: 'data fetch successfully'
            });
       }
       else{
        return res.status(404).send({
            code: 404,
            message: error.message || "Id not found!!",
        });
       }
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
}
exports.getAll_AssignedIndent = async (req,res)=>{
    const {emp_id}=req.query;
    try{
       if(emp_id){
          let [response]=await db.sequelize.query(`
                      SELECT 
                ABM.id, 
                ABM.line, 
                ABM.name, 
                ABM.breakdown_code, 
                ABM.priority, 
                WS.name_of_workstation, 
                ABM.breakSatus, 
                CONCAT(HRU.first_name, ' ', HRU.middle_name, ' ', HRU.last_name) AS Emp_Name,
                TS.status_name
            FROM 
                ADD_BREAKDOWN_MST AS ABM
            INNER JOIN 
                MASTER_WORKSTATION AS WS ON ABM.workstation_id = WS.id
            INNER JOIN 
                HRMS_REGISTERED_USER AS HRU ON ABM.employee_id = HRU.employee_id
			LEFT JOIN 
            TBL_STATUS  AS TS ON ABM.status_id=TS.id
            WHERE 
                 ABM.employee_id=${emp_id} and ABM.breakSatus='ASSIGNED';
            `)
            return res.status(200).send({
                code: 200,
                data:response,
                message: 'data fetch successfully'
            });
       }
       else{
        return res.status(404).send({
            code: 404,
            message: error.message || "Id not found!!",
        });
       }
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
}
exports.assigned_breakdownIndent = async (req,res)=>{
    const {emp_id,id,item_details,remark,status,spare_part}=req.body;
    try{
        if(spare_part==true){
           
            for(let i=0;i<item_details.length;i++){
                let response=await db.addbreakdownItem.create({
                    item_id:item_details[i]?.item_id,
                    category_id:item_details[i]?.category_id,
                    quantity:item_details[i]?.quantity,
                    breakdown_id:id
                })
            }
            let response=db.addbreakdown.update({
                remark:remark,
                status_id:status
              },{
                where:{
                    id:id
                }
              })
              if(response){
                return res.status(200).send({
                    code: 200,
                    data:response,
                    message: 'data Updated successfully'
                });
              }
        }
        else if(remark && status){
            let response=db.addbreakdown.update({
                remark:remark,
                status_id:status
              },{
                where:{
                    id:id
                }
              })
              if(response){
                return res.status(200).send({
                    code: 200,
                    data:response,
                    message: 'data Updated successfully'
                });
              }
        }
        else{
            if(emp_id && id){
                let [response]=await db.sequelize.query(`
                 UPDATE ADD_BREAKDOWN_MST 
                SET employee_id = ${emp_id},breakSatus='ASSIGNED'
                   WHERE id = ${id};  
                   `)
               return res.status(200).send({
                   code: 200,
                   data:response,
                   message: 'data Updated successfully'
               });
          }
          else{
           return res.status(404).send({
               code: 404,
               message: error.message || "Id not found!!",
           });
          }
        }
      
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
}
exports.getAll_Status = async (req,res)=>{
    try{
      
             let [response]=await db.sequelize.query(`
              select * from TBL_STATUS as t where t.status='ACTIVE' and isDeleted=0 `)
            return res.status(200).send({
                code: 200,
                data:response,
                message: 'data Updated successfully'
            });
       
      
       
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
}