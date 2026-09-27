const { forEach } = require("mathjs");
const path = require('path');
const moment = require('moment');
const { Op, sequelize, fn, col, where } = require('sequelize');
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../models/index");

exports.create_plan_maintenance = async (req, res) => {
    try {
        const {
            workstation_id,
            asset_tag_id,
            maintenance_type,
            priority,
            image_upload,
            entity_id,
            financial_year_id,
            start_date,
            end_date,
            frequency,
            remark,
            approval_required,
            item_required,
            asset_required,
            item_details,
            asset_details,
            emp_id,
            vendor_id,
        } = req.body;
        let asset_data;
        let item_data;
        let data = await db.planmaintenance.findAll();
        let count = data.length + 1;
        let newcode = `MAIN${String(count).padStart(2, '0')}`;
        let response = await db.planmaintenance.create({
            workstation_id,
            asset_tag_id,
            maintenance_type,
            priority,
            entity_id,
            financial_year_id,
            start_date,
            end_date,
            frequency,
            remark,
            approval_require: approval_required,
            item_require: item_required,
            asset_require: asset_required,
            employee_id: emp_id,
            vendor_id,
            maintenance_code: newcode
        });

        if (asset_required === true && Array.isArray(asset_details)) {
            for (let i = 0; i < asset_details.length; i++) {
                asset_data = await db.assetmaintenance.create({
                    asset_id: asset_details[i]?.asset_id,
                    aaset_category_id: asset_details[i]?.asset_category_id,
                    quantity: asset_details[i]?.quantity,
                    plan_id: response?.id
                });
            }
        }

        if (item_required === true && Array.isArray(item_details)) {
            for (let i = 0; i < item_details.length; i++) {
                item_data = await db.itemMaintenance.create({
                    item_id: item_details[i]?.item_id,
                    category_id: item_details[i]?.category_id,
                    quantity: item_details[i]?.quantity,
                    plan_id: response?.id
                });
            }
        }

        if (Array.isArray(image_upload) && image_upload.length > 0) {
            for (let i = 0; i < image_upload.length; i++) {
                let doc_data = await db.docMaintenance.create({
                    image_upload: image_upload[i]?.url,
                    plan_id: response?.id
                });
            }
        }
       

        if (response) {
            return res.status(200).send({
                code: 200,
                message: "Maintenance created successfully",
                data: response,
                asset_data,
                item_data,
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};


exports.getall_Plan_Maintenance=async (req,res)=>{
    try{
      const {entity_id,financial_year_id}=req.query;
      if(entity_id && financial_year_id){
        let [response]=await db.sequelize.query(`
         SELECT PM.id, PM.priority,PM.maintenance_type,PM.start_date,PM.end_date,PM.maintenance_code,
            MW.name_of_workstation, TS.status_name,PM.approver_status
            FROM MM_PLAN_MAINTENANCE AS PM 
            INNER JOIN MASTER_WORKSTATION  AS MW ON PM.workstation_id=MW.id
            LEFT JOIN TBL_STATUS AS TS ON PM.status_id=TS.id
            WHERE PM.entity_id=${entity_id} AND PM.financial_year_id=${financial_year_id} and PM.isDeleted=0
            `);
            if(response){
                return res.status(200).send({
                    code: 200,
                    message: "data fetch successfully",
                    data: response,
                });
            }
      }else{
        return res.status(404).send({
            code: 404,
            message:  "ID not found!",
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
exports.getAllPending_maintenance=async (req,res)=>{
    try{
      const {emp_id,status}=req.query;
      if(emp_id){
        let [response]=await db.sequelize.query(`
        SELECT PM.id, PM.priority,PM.maintenance_type,PM.start_date,PM.end_date,PM.maintenance_code,
            MW.name_of_workstation, TS.status_name,PM.approver_status
            FROM MM_PLAN_MAINTENANCE AS PM 
            INNER JOIN MASTER_WORKSTATION  AS MW ON PM.workstation_id=MW.id
            LEFT JOIN TBL_STATUS AS TS ON PM.status_id=TS.id
            WHERE PM.employee_id=1 and PM.isDeleted=0 AND TS.status_name='CLOSED' AND PM.approver_status='${status}'
            `);
            if(response){
                return res.status(200).send({
                    code: 200,
                    message: "data fetch successfully",
                    data: response,
                });
            }
      }else{
        return res.status(404).send({
            code: 404,
            message:  "ID not found!",
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
exports.getall_Schedule_Maintenanceby_status=async (req,res)=>{
    try{
      const {entity_id,financial_year_id,status}=req.query;
      if(entity_id && financial_year_id){
        let [response] = await db.sequelize.query(`
            SELECT PM.id, PM.priority, PM.maintenance_type, PM.start_date, PM.end_date, PM.maintenance_code,
                   MW.name_of_workstation,
                   TS.status_name, PM.approver_status
            FROM MM_PLAN_MAINTENANCE AS PM
            INNER JOIN MASTER_WORKSTATION AS MW ON PM.workstation_id = MW.id
            LEFT JOIN TBL_STATUS AS TS ON PM.status_id = TS.id
            WHERE PM.entity_id = ${entity_id}
              AND PM.financial_year_id = ${financial_year_id}
              AND PM.maintenance_type = '${status}' 
              AND PM.isDeleted = 0
        `);
        
            if(response){
                return res.status(200).send({
                    code: 200,
                    message: "data fetch successfully",
                    data: response,
                });
            }
      }else{
        return res.status(404).send({
            code: 404,
            message:  "ID not found!",
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
exports.getSchedule_Maintenanceby_Id = async (req, res) => {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).send({
          code: 400,
          message: "ID is required",
        });
      }
  
      let planMaintenance = [];
      let itemData = [];
      let assetData = [];
      let docs = [];
  
      const [planResponse] = await db.sequelize.query(
        `SELECT * FROM MM_PLAN_MAINTENANCE WHERE id = :id AND isDeleted = 0`,
        { replacements: { id }, type: db.sequelize.QueryTypes.SELECT }
      );
  
      if (planResponse) {
        planMaintenance = planResponse;
  
        const [itemResponse, assetResponse, docsResponse] = await Promise.all([
          db.sequelize.query(
            `SELECT * FROM MM_ITEM_MAINTENANCE WHERE plan_id = :id AND isDeleted = 0`,
            { replacements: { id }, type: db.sequelize.QueryTypes.SELECT }
          ),
          db.sequelize.query(
            `SELECT * FROM MM_ASSET_MAINTENANCE WHERE plan_id = :id AND isDeleted = 0`,
            { replacements: { id }, type: db.sequelize.QueryTypes.SELECT }
          ),
          db.sequelize.query(
            `SELECT * FROM MM_DOC_MAINTENANCE WHERE plan_id = :id AND isDeleted = 0`,
            { replacements: { id }, type: db.sequelize.QueryTypes.SELECT }
          ),
        ]);
  
        itemData = itemResponse;
        assetData = assetResponse;
        docs = docsResponse;
  
        return res.status(200).send({
          code: 200,
          message: "Data fetched successfully",
          data: {
            planMaintenance,
            itemData,
            assetData,
            docs,
          },
        });
      } else {
        return res.status(404).send({
          code: 404,
          message: "No data found for the given ID",
        });
      }
    } catch (error) {
      console.error("Error fetching schedule maintenance:", error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error",
      });
    }
  };
  
exports.getAllAssetTag_id=async (req,res)=>{
    try{
      const {entity_id}=req.query;
      if(entity_id){
      
        let [response]=await db.sequelize.query(`
           SELECT GS.id,GS.asset_tagId,MI.item_name,ASM.isUnderAmc FROM GRN_ITEM_STATUS AS GS INNER JOIN
            MASTER_ITEM AS MI ON GS.item_id=MI.id INNER JOIN 
            ASSETMAINTENANCE_MAPPING AS AM ON GS.id=AM.asset_tagIds INNER JOIN
            ASSETMAINTENANCE AS ASM ON ASM.id=AM.maintenanceMappingId
            WHERE GS.asset_tagId IS NOT NULL AND ASM.entity_id=${entity_id}
           `);
          
            if(response){
                return res.status(200).send({
                    code: 200,
                    message: "data fetch successfully",
                    data: response
                });
            }
      }else{
        return res.status(404).send({
            code: 404,
            message:  "ID not found!",
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
exports.getAllAssetbyCat_id=async (req,res)=>{
    try{
      const {entity_id,cat_id}=req.query;
      if(entity_id){
      
        let [response]=await db.sequelize.query(`
         SELECT * FROM MASTER_ITEM AS MI WHERE  MI.item_type_id=2 AND MI.asset_id=${cat_id} AND MI.entity_id=${entity_id}
           `);
          
            if(response){
                return res.status(200).send({
                    code: 200,
                    message: "data fetch successfully",
                    data: response
                });
            }
      }else{
        return res.status(404).send({
            code: 404,
            message:  "ID not found!",
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

exports.Update_plan_maintenance = async (req, res) => {
    try {
        const {id} =req.query
        const {
            workstation_id,
            asset_tag_id,
            maintenance_type,
            priority,
            image_upload,
            entity_id,
            financial_year_id,
            start_date,
            end_date,
            frequency,
            remark,
            approval_required,
            item_required,
            asset_required,
            item_details,
            asset_details,
            emp_id,
            vendor_id,
            status,
            status_remark,
            maintenance_details

        } = req.body;
        let asset_data;
        let item_data;
   
        let response = await db.planmaintenance.update(
            {
                workstation_id,
                asset_tag_id,
                maintenance_type,
                priority,
                entity_id,
                financial_year_id,
                start_date,
                end_date,
                frequency,
                remark,
                approval_required,
                item_required,
                asset_required,
                employee_id: emp_id,
                vendor_id,
                status_id: status,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        
        if(response){
            let remark=await db.remarkMaintenance.create({
                remark:status_remark,
                plan_id:id
            })
        }

        if (asset_required == true||1 && Array.isArray(asset_details)) {
            for (let i = 0; i < asset_details.length; i++) {
                if(!asset_details[i]?.id){
                    asset_data = await db.assetmaintenance.create({
                        asset_id: asset_details[i]?.asset_id,
                        aaset_category_id: asset_details[i]?.asset_category_id,
                        quantity: asset_details[i]?.quantity,
                        plan_id:id
                    });
                }
                else{
                    asset_data = await db.assetmaintenance.update({
                        asset_id: asset_details[i]?.asset_id,
                        aaset_category_id: asset_details[i]?.asset_category_id,
                        quantity: asset_details[i]?.quantity,
                        plan_id:id
                    },{
                        where:{
                            id:asset_details[i]?.id
                        }
                    });
                }
                
            }
        }

        if (item_required == true || 1 && Array.isArray(item_details)) {
            for (let i = 0; i < item_details.length; i++) {
                if(!item_details[i]?.id)
                {
                    item_data = await db.itemMaintenance.create({
                        item_id: item_details[i]?.item_id,
                        category_id: item_details[i]?.category_id,
                        quantity: item_details[i]?.quantity,
                        plan_id:id
                });
                }
                else{
                    item_data = await db.itemMaintenance.update({
                        item_id: item_details[i]?.item_id,
                        category_id: item_details[i]?.category_id,
                        quantity: item_details[i]?.quantity,
                        plan_id:id
                },{
                    where:{
                        id:item_details[i]?.id
                    }
                });
                }
              
            }
        }

        // if (Array.isArray(image_upload) && image_upload.length > 0) {
        //     for (let i = 0; i < image_upload.length; i++) {
                
        //         let doc_data = await db.docMaintenance.create({
        //             image_upload: image_upload[i]?.url,
        //         },
        //         {
        //             where:{
        //                 plan_id:id
        //             }
        //     });
        //     }
        // }
        if (Array.isArray(maintenance_details) &&  Array.isArray(maintenance_details)) {
            for (let i = 0; i < maintenance_details.length; i++) {
                let maintenance = await db.maintenanceCheckList.create({
                    plan_id:id,
                    maintenance_type_id:maintenance_details[i].id
                });
            }
        }
        if (response) {
            return res.status(200).send({
                code: 200,
                message: "Maintenance Updated successfully",
                data: response,
                asset_data,
                item_data,
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};

exports.maintenanceApprove_Reject=async (req,res)=>{
    try{
      const {id,status,remark}=req.body;
      if(id){
      
        let response=await db.planmaintenance.update({
            Approver_remark:remark,
            approver_status:status
            
        },{
            where:{
                id:id
            }
        })
          
            if(response){
                return res.status(200).send({
                    code: 200,
                    message: "data fetch successfully",
                    data: response
                });
            }
      }else{
        return res.status(404).send({
            code: 404,
            message:  "ID not found!",
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

exports.getAll_remark_ByPlanId = async (req, res) => {
    try {
      const { id } = req.query;
     
      if (!id) {
        return res.status(400).send({
          code: 400,
          message: "ID is required",
        });
      }
     else{
        let [response]=await db.sequelize.query(`
            
            SELECT * FROM MM_REMARK_MAINTENANCE WHERE plan_id=${id} AND isDeleted=0
            `)
        return res.status(200).send({
            code: 200,
            message: "Data fetched successfully",
            data: response
          });
     }
     
  
       
      
    } catch (error) {
      console.error("Error fetching schedule maintenance:", error);
      return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error",
      });
    }
  };

  exports.getAll_maintenanceTypeby_Workstation_id = async (req, res) => {
    try {
        const { workstation_id } = req.query;

        if (!workstation_id) {
            return res.status(400).send({
                code: 400,
                message: "workstation_id is required",
            });
        }

        let [response] =await db.sequelize.query( `
            SELECT MT.*, MW.name_of_workstation 
            FROM MAINTENANCE_TYPE AS MT
            INNER JOIN MASTER_MAINTENANCE AS MM ON MT.maintenance_master_id = MM.id
            INNER JOIN MASTER_WORKSTATION AS MW ON MM.workstation_id = MW.id
            WHERE MM.workstation_id = ${workstation_id}
        `);

        if (response) {
            return res.status(200).send({
                code: 200,
                data: response,
                message: "Data retrieved successfully",
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No data found for the given workstation_id",
            });
        }
    } catch (error) {
        console.error("Error fetching maintenance types:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};
