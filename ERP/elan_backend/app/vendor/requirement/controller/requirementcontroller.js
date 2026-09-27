const db = require("../../../../app/models/index");
const logger = require('../../../../logger/index');

exports.getAll_job_requirement=async (req,res)=>{
    try{
      const{entity_id,vendor_id}=req.query;
      if(entity_id && vendor_id){
         let [response]= await db.sequelize.query(`
            SELECT RJ.*,D.designation_name,MC.contract_Type,MD.department_name,
                MA.area_name,MB.branch_name,
                HR.first_name,HR.last_name
                FROM RECRUITMENT_JOB_DESCRIPITION AS RJ
                LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
                LEFT JOIN MASTER_CONTRACT AS MC ON MC.id = RJ.contract_types_id
                LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
                LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
                JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
                LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = RJ.spoc_id
                WHERE RJ.entity_id=${entity_id} and RJ.vendor_id=${vendor_id}`)
                if(response){
                    return res.status(200).send({ code: 200, message: "data fetch successfully",data:response });
                }
                else{
                    return res.status(200).send({ code: 200, message: "data not found",data:[] });
                }
      }
      else{
        return res.status(404).send({ code: 404, message: "Ids not found" });
      }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}
exports.getAll_Candidate_ProfilebyVendor=async (req,res)=>{
    try{
      const{entity_id,vendor_id}=req.query;
      if(entity_id && vendor_id){
         let [response]= await db.sequelize.query(`
            SELECT RJ.id AS JD_id,RJ.job_title,RJ.jd_number,RJ.entity_id,RJ.assign_id, RJ.number_of_positions,D.designation_name,
            MC.contract_type,MD.department_name,MA.area_name,MB.branch_name,HRU.first_name AS assignee_first_name,
            HRU.last_name AS assignee_last_name,RJ.created_by
            FROM RECRUITMENT_JOB_DESCRIPITION AS RJ 
				LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
            LEFT JOIN MASTER_CONTRACT AS MC ON MC.id = RJ.contract_types_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
            LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
            LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
            WHERE RJ.entity_id=${entity_id} AND RJ.vendor_id=${vendor_id}  AND RJ.isCompletedJd="COMPLETED";`)
                if(response){
                    return res.status(200).send({ code: 200, message: "data fetch successfully",data:response });
                }
                else{
                    return res.status(200).send({ code: 200, message: "data not found",data:[] });
                }
      }
      else{
        return res.status(404).send({ code: 404, message: "Ids not found" });
      }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}
exports.getAll_candidate_BY_JD_idByVendor= async (req, res) => {
    try {
        const { jd_id, selection_status,vendor_id } = req.query;
        const getdata = `
            SELECT RJ.id AS JD_id,RJ.job_title,RJ.jd_number,RJ.entity_id,RJ.assign_id, RJ.number_of_positions,RJ.end_date,RJ.experience,RJ.level_of_interview,D.designation_name,MC.contract_type,MD.department_name,MA.area_name,MB.branch_name AS location,HRU.first_name AS assignee_first_name,HRU.last_name AS assignee_last_name,RJ.created_by
            FROM RECRUITMENT_JOB_DESCRIPITION AS RJ 
				LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
            LEFT JOIN MASTER_CONTRACT AS MC ON MC.id = RJ.contract_types_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
            LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
            LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
            WHERE RJ.id=${jd_id} AND RJ.vendor_id=${vendor_id}`

        const getAllData = await db.sequelize.query(getdata, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        let profile_details;
        if (selection_status == "SELECTED") {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id, selection_status: "SELECTED",created_by:vendor_id } });
        } else if (selection_status == "APPROVED") {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id, selection_status: "APPROVED",created_by:vendor_id } });
        } else if (selection_status == "REJECTED") {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id,created_by:vendor_id, [Op.or]: [{ selection_status: "REJECTED" }, { bgv_status: "REJECTED" }] } });
        } 
        else if(selection_status=='All'){
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id,created_by:vendor_id} });
        }
        else {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id,created_by: vendor_id,[Op.or]: [{ selection_status: "HOLD" }, { bgv_status: "HOLD" }] } });
        }
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Job Descripition Successfully!", data: getAllData, profile_details });
        } else {
            return res.status(200).send({ code: 200, message: "No Record Found!", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}


exports.getAll_recruiment_report_byvendor=async(req,res)=>{
    try{
      const{vendor_id}=req.query;
      if(!vendor_id){
        return res.status(404).send({ code: 404, message:"Vendor_id not found... " });
      }
      else{
        let [response]=await db.sequelize.query(`
            SELECT RJ.id,RJ.first_name,RJ.middle_name,RJ.onboarding_status,RJ.profile_type,
            RJ.selection_status,RJ.selected_percentage,RJ.bgv_status,
            RJ.contact_number,RJ.email,RJ.cv_upload,
            JD.job_title,JD.jd_number,JD.start_date,JD.end_date FROM 
            RECRUITMENT_JOB_DESCRIPITION_EMAIL AS RJ INNER JOIN 
            RECRUITMENT_JOB_DESCRIPITION AS JD ON RJ.job_descripition_id=JD.ID
            WHERE RJ.created_by=${vendor_id} and RJ.STATUS='ACTIVE';
            `)
            if(response){
                return res.status(200).send({ code: 200, message: "data fetch successfully",data:response });
            }
      }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}