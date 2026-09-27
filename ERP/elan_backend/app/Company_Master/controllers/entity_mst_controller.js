const db = require("../../models/index");
const logger = require('../../../logger/index');
const {registerForGSTPortalLink,verifyOtpForGSTPortalLink} = require('../../Kdk/kdkController')


exports.createEntityMaster = async (req, res) => {
    try {
        let {
            stake_holder_form,
            financial_id,
            entity_name,
            tax_registeration_number,
            registered_office,
            employee_prefix,
            management_form,
            smtp_server_address,
            smtp_port_no,
            username,
            password,
            is_group,
            parent_entity_id,
            city_id,
            state_id,
            country_id,
            cin,
            pan,
            tan,
            pf,
            esi,
            gst_in,
            msme_certificate,
            msme_category,
            branch_id
        } = req.body;
    
if (parent_entity_id === 'null' || parent_entity_id === 'undefined') {
     parent_entity_id = null; 
    }
        let stakeHolderId = JSON.parse(stake_holder_form);
        management_form = JSON.parse(management_form);

        let financial_year_id = financial_id.split(',').map(Number);

        let isExitEntity = await db.entityMaster.findOne({
            where: { entity_name: entity_name, isDeleted: false }
        });

        if (isExitEntity) {
            return res.status(400).send({
                code: 400,
                message: "Entity Name Already Exist"
            });
        }

        let logo;
        let files = req.files;

        if (req.files.length > 0 && files) {
            logo = files[0].path.replace(/\\\\/g, '/');
            logo = logo.substring(logo.lastIndexOf('/') + 1);
        }

        let isExitSmtp = await db.entityMaster.findOne({
            where: {
                smtp_server_address: smtp_server_address,
                isDeleted: false
            }
        });

        if (isExitSmtp) {
            return res.status(400).send({
                code: 400,
                message: "SMTP Server Adress Already Exist!"
            });
        }

        const saveEntity = await db.entityMaster.create({
            entity_name: entity_name,
            tax_registration_number: tax_registeration_number,
            registered_office: registered_office,
            employee_prefix: employee_prefix,
            logo: logo,
            financial_id: financial_year_id,
            smtp_server_address: smtp_server_address,
            smtp_port_number: smtp_port_no,
            smtp_username: username,
            smtp_password: password,
            is_group: is_group,
            ...(parent_entity_id != null && parent_entity_id !== '' ? { parent_entity_id: parseInt(parent_entity_id) } : {}) ,
            city_id,
            state_id,
            country_id,
            cin,
            pan,
            tan,gst_in,
            pf,
            esi,
            msme_certificate,
            msme_category,
            branch_id
        });

        if (saveEntity) {
            const stakeHolder_data = stakeHolderId.map(stakeHolder => ({
                ...stakeHolder,
                entity_id: saveEntity.id
            }));

            const managementData = management_form.map(mg => ({
                ...mg,
                entity_id: saveEntity.id
            }));

            await db.entityStake.bulkCreate(stakeHolder_data);
            await db.entityManagement.bulkCreate(managementData);
        }

        return res.status(200).send({
            code: 200,
            message: "Entity Created Succssesfully"
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};

exports.getAll_Entity = async (req, res) => {
    try {
        const query = `
        SELECT 
            EM.id AS entity_id,
            EM.entity_name,
            EM.tax_registration_number,
            EM.registered_office,
            EM.employee_prefix,
            EM.logo,
            EM.smtp_server_address,
            EM.smtp_port_number,
            EM.smtp_username,
            EM.smtp_password,
            EM.status,
            EM.createdAt AS entity_createdAt,
            EM.updatedAt AS entity_updatedAt,
            ES.id AS stakeholder_id,
            ES.stakeholder_name AS stakeholder_name,
            ES.designation AS stakeholder_designation,
            ES.status AS stakeholder_status,
            ES.createdAt AS stakeholder_createdAt,
            ES.updatedAt AS stakeholder_updatedAt,
            ES.contact_no AS stakeholder_contact_no,
            ES.email_id AS stakeholder_email_id,
            ES.country_code, EM.financial_id,EM.is_group
        FROM ENTITY_MASTER EM
        LEFT JOIN ENTITY_STAKEHOLDER ES ON EM.id = ES.entity_id AND ES.isDeleted = false
        WHERE EM.isDeleted = false`;

        const results = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        const entities = [];

        const entityMap = new Map();

        results.forEach(row => {
            const entityKey = row.entity_id;

            if (!entityMap.has(entityKey)) {
                entityMap.set(entityKey, {
                    entity_id: row.entity_id,
                    entity_name: row.entity_name,
                    tax_registration_number: row.tax_registration_number,
                    registered_office: row.registered_office,
                    employee_prefix: row.employee_prefix,
                    logo: row.logo,
                    smtp_server_address: row.smtp_server_address,
                    smtp_port_number: row.smtp_port_number,
                    smtp_username: row.smtp_username,
                    smtp_password: row.smtp_password,
                    status: row.status,
                    entity_createdAt: row.entity_createdAt,
                    entity_updatedAt: row.entity_updatedAt,
                    financial_id: row.financial_id,
                    is_group: row.is_group,
                    stakeholders: []
                });
            }

            if (row.stakeholder_id) {
                entityMap.get(entityKey).stakeholders.push({
                    stakeholder_id: row.stakeholder_id,
                    stakeholder_name: row.stakeholder_name,
                    stakeholder_designation: row.stakeholder_designation,
                    stakeholder_status: row.stakeholder_status,
                    stakeholder_createdAt: row.stakeholder_createdAt,
                    stakeholder_updatedAt: row.stakeholder_updatedAt,
                    stakeholder_contact_no: row.stakeholder_contact_no,
                    stakeholder_email_id: row.stakeholder_email_id,
                    stakeholder_country_code: row.country_code
                });
            }
        });

        entityMap.forEach(value => {
            entities.push(value);
        });

        return res.status(200).send({ code: 200, message: "Get All Data Successfully", data: entities });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error fetching entity data: ", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllactive_Entity = async (req, res) => {
    try {
        const query = `
        SELECT 
            EM.id AS entity_id,
            EM.entity_name,
            EM.tax_registration_number,
            EM.registered_office,
            EM.employee_prefix,
            EM.logo,
            EM.smtp_server_address,
            EM.smtp_port_number,
            EM.smtp_username,
            EM.smtp_password,
            EM.status,
            EM.createdAt AS entity_createdAt,
            EM.updatedAt AS entity_updatedAt,
            ES.id AS stakeholder_id,
            ES.stakeholder_name AS stakeholder_name,
            ES.designation AS stakeholder_designation,
            ES.status AS stakeholder_status,
            ES.createdAt AS stakeholder_createdAt,
            ES.updatedAt AS stakeholder_updatedAt,
            ES.contact_no AS stakeholder_contact_no,
            ES.email_id AS stakeholder_email_id,ES.country_code,
             EM.financial_id,EM.is_group
        FROM ENTITY_MASTER EM
        LEFT JOIN ENTITY_STAKEHOLDER ES ON EM.id = ES.entity_id AND ES.isDeleted = false
        WHERE EM.isDeleted = false AND EM.status = "ACTIVE"`;

        const results = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        const entities = [];

        const entityMap = new Map();

        results.forEach(row => {
            const entityKey = row.entity_id;

            if (!entityMap.has(entityKey)) {
                entityMap.set(entityKey, {
                    entity_id: row.entity_id,
                    entity_name: row.entity_name,
                    tax_registration_number: row.tax_registration_number,
                    registered_office: row.registered_office,
                    employee_prefix: row.employee_prefix,
                    logo: row.logo,
                    smtp_server_address: row.smtp_server_address,
                    smtp_port_number: row.smtp_port_number,
                    smtp_username: row.smtp_username,
                    smtp_password: row.smtp_password,
                    status: row.status,
                    entity_createdAt: row.entity_createdAt,
                    entity_updatedAt: row.entity_updatedAt,
                    stakeholders: []
                });
            }

            if (row.stakeholder_id) {
                entityMap.get(entityKey).stakeholders.push({
                    stakeholder_id: row.stakeholder_id,
                    stakeholder_name: row.stakeholder_name,
                    stakeholder_designation: row.stakeholder_designation,
                    stakeholder_status: row.stakeholder_status,
                    stakeholder_createdAt: row.stakeholder_createdAt,
                    stakeholder_updatedAt: row.stakeholder_updatedAt,
                    stakeholder_contact_no: row.stakeholder_contact_no,
                    stakeholder_email_id: row.stakeholder_email_id,
                    stakeholder_country_code: row.country_code
                });
            }
        });

        entityMap.forEach(value => {
            entities.push(value);
        });

        return res.status(200).send({ code: 200, message: "Get All Data Successfully", data: entities });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error fetching entity data: ", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getById_Entity = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
        SELECT 
            EM.id AS entity_id,
            EM.entity_name,
            EM.tax_registration_number,
            EM.registered_office,
            EM.employee_prefix,
            EM.logo,
            EM.gst_in,
            EM.smtp_server_address,
            EM.smtp_port_number,
            EM.smtp_username,
            EM.smtp_password,
            EM.status,
            EM.city_id,
            EM.state_id,
            EM.country_id,
            EM.createdAt AS entity_createdAt,
            EM.updatedAt AS entity_updatedAt,
            ES.id AS stakeholder_id,
            ES.stakeholder_name AS stakeholder_name,
            ES.designation AS stakeholder_designation,
            ES.status AS stakeholder_status,
            ES.createdAt AS stakeholder_createdAt,
            ES.updatedAt AS stakeholder_updatedAt,
            ES.contact_no AS stakeholder_contact_no,
            ES.email_id AS stakeholder_email_id,ES.country_code,
            EM.financial_id,EM.is_group,EM.cin, EM.pan, EM.tan, EM.pf, EM.esi, EM.msme_certificate, EM.msme_category, EM.branch_id
        FROM ENTITY_MASTER EM
        LEFT JOIN ENTITY_STAKEHOLDER ES ON EM.id = ES.entity_id AND ES.isDeleted = false
        WHERE EM.isDeleted = false AND EM.id = :entity_id`;

        const results = await db.sequelize.query(query, {
            replacements: { entity_id: id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (results.length === 0) {
            return res.status(404).send({ code: 404, message: "Entity not found" });
        }      

        const entity = {
            entity_id: results[0].entity_id,
            entity_name: results[0].entity_name,
            tax_registration_number: results[0].tax_registration_number,
            registered_office: results[0].registered_office,
            employee_prefix: results[0].employee_prefix,
            logo: results[0].logo,
            smtp_server_address: results[0].smtp_server_address,
            smtp_port_number: results[0].smtp_port_number,
            smtp_username: results[0].smtp_username,
            smtp_password: results[0].smtp_password,
            status: results[0].status,
            entity_createdAt: results[0].entity_createdAt,
            entity_updatedAt: results[0].entity_updatedAt,
            financial_id:results[0].financial_id,
            country_id:results[0].country_id,
            state_id:results[0].state_id,
            city_id:results[0].city_id,
            is_group:results[0].is_group,
            cin:results[0].cin,
            pan:results[0].pan,
            tan:results[0].tan,
            pf:results[0].pf,
            gst_in:results[0].gst_in,
            esi:results[0].esi,
            msme_certificate:results[0].msme_certificate,
            msme_category:results[0].msme_category,
            branch_id:results[0].branch_id,
            stakeholders: results.filter(row => row.stakeholder_id).map(row => ({
                stakeholder_id: row.stakeholder_id,
                stakeholder_name: row.stakeholder_name,
                stakeholder_designation: row.stakeholder_designation,
                stakeholder_status: row.stakeholder_status,
                stakeholder_createdAt: row.stakeholder_createdAt,
                stakeholder_updatedAt: row.stakeholder_updatedAt,
                stakeholder_contact_no: row.stakeholder_contact_no,
                stakeholder_email_id: row.stakeholder_email_id,
                stakeholder_country_code: row.country_code
            })),
        };
        const [dataList] = await db.sequelize.query(
            `
            SELECT * FROM ENTITY_MANAGEMENT_DETAILS WHERE entity_id=${id}`
        )
        const Obj = {
            ...entity,
            management:dataList
        }

        return res.status(200).send({ code: 200, message: "Entity fetched successfully", data: Obj });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error fetching entity data: ", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.update_Entity = async (req, res) => {
    try {
        let entity_id = req.params.id;
        let {
            stake_holder_form,financial_id, entity_name, tax_registeration_number, registered_office,employee_prefix, smtp_server_address, smtp_port_no, username, password,city_id,
            state_id,
            country_id,cin, pan, tan, pf, gst_in,esi, msme_certificate, msme_category, branch_id,management_form
        } = req.body;
        stake_holder_form = JSON.parse(stake_holder_form);
        management_form = JSON.parse(management_form);
        let financial_year_id = financial_id.split(',').map(Number);

        const existingEntity = await db.entityMaster.findOne({
            where: {
                entity_name: entity_name,
                isDeleted : false,
                id: { [db.Sequelize.Op.ne]: entity_id } 
            }
        });

        if (existingEntity) {
            return res.status(400).send({ code: 400, message: "Entity name already exists" });
        }

        let logo;
        let files = req.files;
        if (req.files.length > 0 && files) {
            logo = files[0].path.replace(/\\/g, '/');
            logo = logo.substring(
                logo.lastIndexOf('/') + 1
            );
        }

        const saveEntity = await db.entityMaster.update({
            entity_name: entity_name,
            tax_registration_number: tax_registeration_number,
            registered_office: registered_office,
            employee_prefix: employee_prefix,
            logo: logo,gst_in,
            smtp_server_address: smtp_server_address,
            smtp_port_number: smtp_port_no,financial_id:financial_year_id,
            smtp_username: username,
            smtp_password: password,
            city_id,
            state_id,
            country_id,cin, pan, tan, pf, esi, msme_certificate, msme_category, branch_id
        }, { where: { id: entity_id } });

        if (saveEntity) {
            await db.entityStake.destroy({
                where: { entity_id: entity_id },
            });
             await db.entityManagement.destroy({
                where: { entity_id: entity_id },
            });

            const stakeHolder_data = stake_holder_form.map(stakeHolder => ({
                ...stakeHolder,
                entity_id: entity_id
            })); 
            const managementData = management_form.map(mg => ({
                ...mg,
                entity_id: entity_id
            }));

            let saveStake = await db.entityStake.bulkCreate(stakeHolder_data);
            await db.entityManagement.bulkCreate(managementData);
        }

        return res.status(200).send({ code: 200, message: "Entity Updated Successfully" });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.delete_Entity = async (req, res) => {
    try {
        const entity_id = req.params.id;

        let existCompany = await db.entityMaster.findOne({ where: { id: entity_id, isDeleted: true } })
        if (existCompany) {
            return res.status(404).send({ code: 404, message: "Entity Already Deleted" })
        }

        let del_stack = await db.entityStake.update(
            { isDeleted: true },
            { where: { entity_id: entity_id } }
        )

        let del_Company = await db.entityMaster.update(
            { isDeleted: true },
            { where: { id: entity_id } }
        );

        return res.status(200).send({ code: 200, message: "Entity Deleted Successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error deleting entity data: ", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.status_entity = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }

        await db.entityMaster.update(
            {
                status: status,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        return res.status(200).send({
            code: 200,
            message: "Entity Status Changed Successfully!",
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getEntityDataByGroupName =async (req,res)=>{
   let is_group = req.query.is_group
try {
       let isGroupData =await db.entityMaster.findAll({
        where: {
        is_group: is_group, 
        isDeleted: false
    }})
       if(isGroupData){
        return res.status(200).send({code:200,message:'Fetched Data Successfully',data:isGroupData})
       }
       else{
        return res.status(200).send({code:404,message:'Not Found',data:isGroupData})

       }
} catch (error) {
     return res.status(500).send({code:500,message:error.message})
}
 
 

}


exports.getEntityDataHierarchyView = async (req, res) => {
    try {
        

        const [getEntityDataHierarchyView] = await db.sequelize.query(`
            SELECT  id,entity_name AS name,parent_entity_id
            FROM ENTITY_MASTER 
            WHERE  isDeleted = '0' AND status = 'ACTIVE'
            ORDER BY id DESC`)

        const accountMap = {};
        getEntityDataHierarchyView.forEach(account => {
            account.children = [];
            accountMap[account.id] = account;
        });

        const rootAccounts = [];
        getEntityDataHierarchyView.forEach(account => {
            if (account.parent_entity_id === null || account.parent_entity_id === '' || account.parent_entity_id === 'null') {
                rootAccounts.push(account);
            } else {
                const parent = accountMap[account.parent_entity_id];
                if (parent) {
                    parent.children.push(account);
                }
            }
        });


        const response = {
            getEntityDataHierarchyView: rootAccounts,
        };

        return res.status(200).send({ code: 200, message: 'success', data: response });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }



};


module.exports.verifyOtpForGSTPortalEntity = async (req, res) => {
    try {
      const { id, otp } = req.body;
  
      const entityExist = await db.entityMaster.findOne({
        where: { id   },
        attributes: [ "id", "entity_name" ]});
  
      if (!entityExist) {
        return res.status(404).send({
          code: 404,
          message: "Entity not found"
        });
      }
  
      const addressContactExist =
        await db.entityStake.findOne({
          where: {
            customer_id: id
          }
        });
  
      if (!addressContactExist) {
        return res.status(404).send({
          code: 404,
          message: "Entity contact details not found"
        });
      }
  
      const otpVerification =
        await db.otpVerificationEntity.findOne({
          where: {
            entity_id: id
          }
        });
  
      if (!otpVerification) {
        return res.status(404).send({
          code: 404,
          message: "OTP verification record not found"
        });
      }
  
      const data = {
        mobile: addressContactExist.contact_no,
        email_id: addressContactExist.email_id,
        contact_person_name: addressContactExist.stakeholder_name,
        company_name: entityExist.entity_name,
        otp_verification_id: otpVerification.otp_verification_id,
        otp: otp
      };
  
      const result =await verifyOtpForGSTPortalLink(data);
  
      return res.status(200).send({
        code: 200,
        message: "OTP verified and GST portal account created successfully",
        data: result
      });
  
    } catch (error) {
      
      return res.status(404).send({
        code: 404,
        message: error.message
      });
    }
};
  
  module.exports.registerForGSTPortalEntity = async (req, res) => {
    try {
      const { id } = req.query;
      const customerExist = await db.entityMaster.findOne({
        where: { id },
        attributes: [
          "id",
          "entity_name",
          "gst_in"
        ]
      });
  
      const AddressContactExist =
        await db.entityStake.findOne({
          where: {
            entity_id: id
          }
        });

      if (!AddressContactExist) {
        return res.status(404).send({
          code: 404,
          message: "Customer address/contact not found"
        });
      }
      const data = {
        mobile: AddressContactExist.contact_no,
        email: AddressContactExist.email_id,
        company_name: customerExist.entity_name
      };
  
  
      const sendOtpSignup =  await registerForGSTPortalLink(data);
      const otpVerificationId =  sendOtpSignup.data?.data?.otp_verification_id;
  
      if (!otpVerificationId) {
        return res.status(400).send({
          code: 400,
          message: "OTP verification ID not received",
          data: sendOtpSignup.data
        });
      }
  
      await db.otpVerificationEntity.destroy({
        where: {
          entity_id: id
        }
      });
  
      await db.otpVerificationEntity.create({
        otp_verification_id: otpVerificationId,
        entity_id: id
      });
  
      return res.status(200).send({
        code: 200,
        message: "OTP has been sent successfully via WhatsApp.",
        data: sendOtpSignup.data
      });
  
    } catch (error) {
  
      const errMsg =
        error.response?.data?.errors?.[0] ||
        error.message ||
        "Something went wrong";
  
      return res.status(404).send({
        code: 404,
        message: errMsg
      });
    }
  };