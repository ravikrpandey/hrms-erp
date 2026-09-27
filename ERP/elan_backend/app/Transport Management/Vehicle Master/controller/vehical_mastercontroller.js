const db = require("../../../../app/models/index");
const logger = require('../../../../logger/index');
const CryptoJS = require("crypto-js");


exports.create_vehicle = async (req, res) => {
    try {
        const {
            vehicle_number,
            vehicle_model,
            vehicle_make,
            manufacture_year,
            chassis_number,
            engine_number,
            max_load_capacity,
            length,
            width,
            height,
            volume_capacity,
            number_of_axles,
            number_of_tyres,
            tyre_type,
            tyre_size,
            fuel_type,
            fuel_tank_capacity,
            mileage,
            gps_enabled,
            rc_number,
            registration_expiry_date,
            insurance_policy_number,
            insurance_expiry_date,
            // pollution_certificate_number,
            // pollution_expiry_date,
            fitness_expiry_date,
            permit_type,
            permit_expiry_date,
            tax_paid_upto_date,
            brake_condition,
            rc_copy_upload,
            insurance_copy_upload,
            fitness_certificate_upload,
            permit_document_upload,
            pollution_certificate_upload,
            vehicle_category_id,
            end_date,
            start_date,
            battery_health,
            motor_charging_cycle,
            motor_serial_no,
            motor_power,
            range_per_hour,
            b_serial_no,
            battery_type,
            vin,
            entity_id,
            financial_year_id,
            created_by,vendor_id
        } = req.body;
    let vehicle_code=await generate_vehical_categoryCode();
        const newVehicle = await db.vehicle_master.create({
            vehicle_category_id,
            entity_id,
            financial_year_id,
            vehicle_number,
            vehicle_code,
            vehicle_model,
            vehicle_make,
            manufacture_year,
            chassis_number,
            engine_number,
            max_load_capacity,
            length,
            width,
            height,
            volume_capacity,
            number_of_axles,
            number_of_tyres,
            tyre_type,
            tyre_size,
            fuel_type,
            fuel_tank_capacity,
            mileage,
            gps_enabled,
            rc_number,
            registration_expiry_date,
            insurance_policy_number,
            insurance_expiry_date,
            // pollution_certificate_number,
            // pollution_expiry_date,
            fitness_expiry_date,
            permit_type,
            permit_expiry_date,
            tax_paid_upto_date,
            brake_condition,
            rc_copy_upload,
            insurance_copy_upload,
            fitness_certificate_upload,
            permit_document_upload,
            pollution_certificate_upload,
            end_date,
            start_date,
            battery_health,
            motor_charging_cycle,
            motor_serial_no,
            motor_power,
            range_per_hour,
            b_serial_no,
            battery_type,
            vin,
            created_by,
            vendor_id
        });
        if(newVehicle){
            return res.status(200).send({ code: 200, message: "create SuccessFully",data:newVehicle });
        }
       
    } catch (error) {
        console.error("Error creating vehicle:", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.getAll_vehicleMaster=async (req,res)=>{
   try{
      const{entity_id,financial_year_id,role,employee_id}=req.query;
    //   if(role=='Super Admin'){
        let [response]=await db.sequelize.query(`
            SELECT TV.*,TVC.vehical_category_name,VT.vehicle_type_name,FT.fuelType
            FROM TM_VEHICLE_MASTER AS TV 
            INNER JOIN TM_VEHICLETYPE_MASTER AS VT ON VT.vehicle_type_id=TV.vehicle_type_id
            INNER JOIN TM_VEHICAL_CATEGORY AS TVC ON TVC.id=VT.vehicle_category_id
            INNER JOIN TM_FUELTYPE_MASTER AS FT ON FT.id=TV.fuel_type_id
            WHERE TV.entity_id=${entity_id}  AND TV.isDeleted=0 ORDER BY TV.id DESC`);
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
    //                     SELECT TV.id,TV.vehicle_number,TV.manufacture_year,TV.rc_number,TV.permit_type,
    //         TV.vehicle_code,TV.fuel_type,TVC.vehical_category_code,TVC.vehical_category_name
    //         FROM TM_VEHICLE_MASTER AS TV INNER JOIN TM_VEHICAL_CATEGORY AS TVC ON
    //         TV.vehicle_category_id=TVC.id WHERE TV.entity_id=${entity_id} AND TV.financial_year_id=${financial_year_id} AND TV.created_by=${employee_id} ORDER BY TV.id DESC`);
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

exports.get_vehicle_master_byId=async(req,res)=>{
    try{
      const{id}=req.query;
      if(!id){
        return res.status(404).send({
            message: "Id Not found...",
            error: error.message
        });
      }
      let [response]=await db.sequelize.query(`
        SELECT * FROM TM_VEHICLE_MASTER AS TV WHERE TV.id=${id}`);
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

exports.get_vehicles_by_vendorId = async (req, res) => {
    const { vendor_id } = req.params;

    try {
        const data = await db.vehicle_master.findAll({
            where: {
                vendor_id,
                isDeleted: false
            },
            include: [{
                model: db.vehical_category,
                attributes: ["vehical_category_name"]
            }]
        })

        if (!data) {
            return res.status(200).send({ message: "No Data Found!", data })
        }
        else {
            return res.status(200).send({ message: "Data Found!", data })
        }

    }
    catch (error) {
        return res.status(500).send({ message: error.message || "Internal server Error" })
    }
}

exports.update_vehicle = async (req, res) => {
    try {
        const { id } = req.query; 
        const {
            vehicle_number,
            vehicle_model,
            vehicle_make,
            manufacture_year,
            chassis_number,
            engine_number,
            max_load_capacity,
            length,
            width,
            height,
            volume_capacity,
            number_of_axles,
            number_of_tyres,
            tyre_type,
            tyre_size,
            fuel_type,
            fuel_tank_capacity,
            mileage,
            gps_enabled,
            rc_number,
            registration_expiry_date,
            insurance_policy_number,
            insurance_expiry_date,
            fitness_expiry_date,
            permit_type,
            permit_expiry_date,
            tax_paid_upto_date,
            brake_condition,
            rc_copy_upload,
            insurance_copy_upload,
            fitness_certificate_upload,
            permit_document_upload,
            pollution_certificate_upload,
            vehicle_category_id,
            end_date,
            start_date,
            battery_health,
            motor_charging_cycle,
            motor_serial_no,
            motor_power,
            range_per_hour,
            b_serial_no,
            battery_type,
            vin,
        } = req.body;

        const updatedVehicle = await db.vehicle_master.update({
            vehicle_category_id,
            vehicle_number,
            vehicle_model,
            vehicle_make,
            manufacture_year,
            chassis_number,
            engine_number,
            max_load_capacity,
            length,
            width,
            height,
            volume_capacity,
            number_of_axles,
            number_of_tyres,
            tyre_type,
            tyre_size,
            fuel_type,
            fuel_tank_capacity,
            mileage,
            gps_enabled,
            rc_number,
            registration_expiry_date,
            insurance_policy_number,
            insurance_expiry_date,
            fitness_expiry_date,
            permit_type,
            permit_expiry_date,
            tax_paid_upto_date,
            brake_condition,
            rc_copy_upload,
            insurance_copy_upload,
            fitness_certificate_upload,
            permit_document_upload,
            pollution_certificate_upload,
            end_date,
            start_date,
            battery_health,
            motor_charging_cycle,
            motor_serial_no,
            motor_power,
            range_per_hour,
            b_serial_no,
            battery_type,
            vin,
        }, {
            where: { id } 
        });

        if (updatedVehicle) {
            return res.status(200).send({ code: 200, message: "Update Successful", data: updatedVehicle });
        } else {
            return res.status(404).send({ code: 404, message: "Vehicle not found" });
        }
    } catch (error) {
        console.error("Error updating vehicle:", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    }
};

////............generate vehicle master code
async function generate_vehical_categoryCode () {
  
      const Variable = "VH";
      const lastEntry = await db.vehicle_master.findOne({
        where: { status: "ACTIVE" },
        order: [["createdAt", "DESC"]],
        attributes: ["vehicle_code"],
      });
      let number = 1;
      if (lastEntry && lastEntry.vehicle_code) {
        const lastNumber = parseInt(lastEntry.vehicle_code.slice(-5), 10);
        if (!isNaN(lastNumber)) {
          number = lastNumber + 1;
        }
      }
      const code = String(number).padStart(5, "0");
      const vehicle_code = `${Variable}${code}`;
      return vehicle_code
  };

  exports.get_vehicles_by_vehcle_catId = async (req, res) => {
    const { vehicle_category_id, entity_id } = req.params;

    try {
        const data = await db.vehicle_master.findAll({
            where: {
                vehicle_category_id,
                entity_id,
                vendor_id: null,
                isDeleted: false
            },
            include: [{
                model: db.vehical_category,
                attributes: ["vehical_category_name", "id"]
            }]
        })

        if (!data) {
            return res.status(200).send({ message: "No Data Found!", data })
        }
        else {
            return res.status(200).send({ message: "Data Found!", data })
        }

    }
    catch (error) {
        return res.status(500).send({ message: error.message || "Internal server Error" })
    }
}
exports.get_vehicles_by_vehcle_catIdAndVendorId = async (req, res) => {
    const { vehicle_category_id, vendor_id ,entity_id } = req.params;

    try {
        const data = await db.vehicle_master.findAll({
            where: {
                vehicle_category_id,
                vendor_id,
                entity_id,
                isDeleted: false
            },
            include: [{
                model: db.vehical_category,
                attributes: ["vehical_category_name", "id"]
            }]
        })

        if (!data) {
            return res.status(200).send({ message: "No Data Found!", data })
        }
        else {
            return res.status(200).send({ message: "Data Found!", data })
        }

    }
    catch (error) {
        return res.status(500).send({ message: error.message || "Internal server Error" })
    }
 }