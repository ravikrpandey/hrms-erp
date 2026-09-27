const { where } = require("sequelize");
const db = require("../../../../app/models/index");
const logger = require('../../../../logger/index');

exports.create_vehicle_driver = async (req, res) => {
    try {
        const {
            driver_id, full_name, date_of_birth, profile_picture, gender, blood_group,
            email_address, alternate_contact_number, mobile_number, nationality,
            driving_license_number, permanent_address, residential_address, aadhar_number,
            license_expiry_date, license_type, license_issuing_authority, police_verification_status,
            work_permit_expiry_date, passport_number, pan_number, experience_years, date_of_joining,
            vendor_agency_name, employment_type, created_by, work_permit_document, medical_fitness_certificate,
            police_verification_document, id_proof_copy, driving_license_copy, entity_id, financial_year_id,
            employee_id, tab_type
        } = req.body;

        if (!driver_id) {
            let driver_code=await generate_vehical_DriverCode();
            let response = await db.vehicle_driver.create({
                full_name, employee_id, date_of_birth, gender, profile_picture, blood_group, nationality,
                created_by, entity_id, financial_year_id,driver_code
            });

            if (response) {
                return res.status(200).send({ code: 200, message: "Vehicle driver created successfully.", data: response });
            }
        } else {
            let updateData = {};

            if (tab_type === 'basic') {
                updateData = { full_name, employee_id, date_of_birth, gender, profile_picture, blood_group, nationality };
            } else if (tab_type === 'contact') {
                updateData = { mobile_number, alternate_contact_number, email_address, residential_address, permanent_address };
            } else if (tab_type === 'license') {
                updateData = {
                    driving_license_number, license_issuing_authority, license_expiry_date,
                    license_type, aadhar_number, pan_number, passport_number, work_permit_expiry_date,
                    police_verification_status
                };
            } else if (tab_type === 'employment') {
                updateData = { employment_type, vendor_agency_name, date_of_joining, experience_years };
            } else if (tab_type === 'attachments') {
                updateData = { driving_license_copy, id_proof_copy, police_verification_document, medical_fitness_certificate, work_permit_document };
            }

            if (Object.keys(updateData).length > 0) {
                let response = await db.vehicle_driver.update(updateData, { where: { driver_id } });
               
                if (response) {
                    let data={
                        driver_id:driver_id
                    }
                    return res.status(200).send({ code: 200, message: "Vehicle driver updated successfully.", data: data });
                }
            }
        }
    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
exports.getAll_Vehicle_driver=async(req,res)=>{
    try{
          const{entity_id,financial_year_id,role,emp_id}=req.query;
          //if(role=='Super Admin'){
            let [response]=await db.sequelize.query(`
                           SELECT TD.driver_id,TD.full_name,TD.driver_code,TD.nationality,TD.mobile_number,TD.email_address,
                            TD.date_of_birth,TD.driving_license_number
                                FROM TM_VEHICAL_DRIVER AS TD WHERE TD.entity_id=${entity_id} AND TD.isDeleted=0 ORDER BY TD.driver_id DESC`);
                if(response){
                    return res.status(200).send({
                        message: "fetch successfully",
                       data:response
                    });
                }
                else{
                    return res.status(200).send({
                        message: "fetch successfully",
                       data:[]
                    });
                }
        //   }
        //   else{
        //      let [response]=await db.sequelize.query(`
        //             SELECT TD.driver_id,TD.full_name,TD.driver_code,TD.nationality,TD.mobile_number,TD.email_address,
        //                     TD.date_of_birth
        //                         FROM TM_VEHICAL_DRIVER AS TD WHERE TD.entity_id=${entity_id} AND TD.financial_year_id=${financial_year_id} AND TD.created_by=${emp_id} ORDER BY TD.driver_id DESC`);
        //         if(response){
        //             return res.status(200).send({
        //                 message: "fetch successfully",
        //                data:response
        //             });
        //         }
        //         else{
        //             return res.status(200).send({
        //                 message: "fetch successfully",
        //                data:[]
        //             });
        //         }
        //   }
       }
       catch (error) {
        console.error("Error creating vehicle:", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    } 
}
exports.get_vehicle_driver_by_id=async (req,res)=>{
    try{
        const{driver_id}=req.query;
        if(!driver_id){
            return res.status(500).send({
                message: "driver Id not found",
                error: error.message
            });
        }
        let response=await db.vehicle_driver.findOne({
            where:{
                driver_id
            }
        })
        if(response){
            return res.status(200).send({
                message: "fetch successfully",
               data:response
            });
        }
        else{
            return res.status(200).send({
                message: "fetch successfully",
               data:[]
            });
        }
    }
    catch (error) {
        console.error("Error creating vehicle:", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    } 
}



async function generate_vehical_DriverCode () {
  
      const Variable = "DRIVER";
      const lastEntry = await db.vehicle_driver.findOne({
        where: { status: "ACTIVE" },
        order: [["createdAt", "DESC"]],
        attributes: ["driver_code"],
      });
      let number = 1;
      if (lastEntry && lastEntry.driver_code) {
        const lastNumber = parseInt(lastEntry.driver_code.slice(-5), 10);
        if (!isNaN(lastNumber)) {
          number = lastNumber + 1;
        }
      }
      const code = String(number).padStart(5, "0");
      const vehicle_code = `${Variable}${code}`;
      return vehicle_code
  };