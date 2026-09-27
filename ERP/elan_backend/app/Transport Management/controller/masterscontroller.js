const db = require("../../../app/models/index");
const { Op } = require("sequelize");

////////////// Common Documents Upload //////////////
module.exports.uploadDoc = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
          const filesArray = [];
          req.files.forEach(file => {
              filesArray.push(file.filename);
          });
          return res.status(200).send({code: 200, message: 'Your file has been uploaded successfully.', url: filesArray});
      }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}

/*** Generate sequential code based on total record count, Example: DRV00001, TRP00025 */
async function generateSequentialCode(model,prefix,organization_id = null,digits = 3,where = {}) {
  if (!model || !prefix) {
    throw new Error("model and prefix are required");
  }

  const finalWhere = { ...where };

  if (organization_id !== null && organization_id !== undefined) {
    finalWhere.organization_id = organization_id;
  } else {
    finalWhere.organization_id = null;
  }

  const totalCount = await model.count({ where: finalWhere });

  const nextNumber = totalCount + 1;
  const code = String(nextNumber).padStart(digits, "0");
  const clientPart =
  organization_id === null || organization_id === undefined
    ? 'EP0'
    : `TP${organization_id}`;

  return `${prefix}-${clientPart}-${code}`;
}

////////////// Fuel Type //////////////
exports.cu_fueltype = async(req,res)=>{
    try{
      const {fuelType,description,entity_id,financial_year_id, id} = req.body;
      
      // Check duplicate record
      const existingRecord = await db.fuelType_master.findOne({where: {fuelType, entity_id}});

      if(id){
        if (existingRecord && Number(existingRecord.id) !== Number(id)) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        await db.fuelType_master.update({fuelType,description}, { where: {id}})
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        if (existingRecord) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        await db.fuelType_master.create({fuelType,description,financial_year_id,entity_id})
        return res.status(201).send({ code: 201, message: "Record created successfully" });
    }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_fuelType = async (req, res) => {
  try {
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id is required"
      });
    }

    // 🔹 Base query
    let query = `
      SELECT VC.*
      FROM TM_FUELTYPE_MASTER AS VC
      WHERE VC.entity_id = :entity_id
    `;

    // 🔹 Optional status filter
    if (status) {
      query += ` AND VC.status = :status`;
    }

    query += ` ORDER BY VC.id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(status && { status })
      }
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched successfully",
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

////////////// Vehicle Type //////////////
exports.getAll_vehicleType = async (req, res) => {
  try {
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id is required"
      });
    }

    // 🔹 Base query
    let query = `
      SELECT VC.*,C.vehical_category_name
      FROM TM_VEHICLETYPE_MASTER AS VC
      INNER JOIN TM_VEHICAL_CATEGORY AS C ON C.id=VC.vehicle_category_id
      WHERE VC.entity_id = :entity_id AND VC.isDeleted=0
    `;

    // 🔹 Optional status filter
    if (status) {
      query += ` AND VC.status = :status`;
    }

    query += ` ORDER BY VC.vehicle_type_id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(status && { status })
      }
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched successfully",
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}
  
exports.createUpdate_vehicleType = async(req,res)=>{
    try{
      const {vehicle_type_name ,entity_id, vehicle_type_id, vehicle_category_id} = req.body;
      
      // Check duplicate record
      const existingRecord = await db.vehicleType_master.findOne({where: {vehicle_type_name, vehicle_category_id, entity_id}});

      if(vehicle_type_id){
        if (existingRecord && Number(existingRecord.vehicle_type_id) !== Number(vehicle_type_id)) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        const updatePayload = { ...req.body };
        delete updatePayload.entity_id;
        delete updatePayload.financial_year_id;
        delete updatePayload.vehicle_type_id;

        await db.vehicleType_master.update( updatePayload, { where: {vehicle_type_id}})
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        if (existingRecord) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        const updatePayload = { ...req.body };
        delete updatePayload.vehicle_type_id;

        await db.vehicleType_master.create(updatePayload)
        return res.status(201).send({ code: 201, message: "Record created successfully" });
      }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getVehicleTypebyId = async(req,res)=>{
    try{
      const{vehicle_type_id}=req.query;
      
      let [response]=await db.sequelize.query(`
        SELECT * FROM TM_VEHICLETYPE_MASTER AS TV WHERE TV.vehicle_type_id=${vehicle_type_id}`);
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

exports.deleteVehicleType = async (req, res) => {
    try {
        const {id}=req.params;
        const data = await db.vehicleType_master.findOne({where: {vehicle_type_id: id}});
        if (!data) {
            return res.status(404).send({message: "Record Not Found"})
        } else {
            await db.vehicleType_master.update({ isDeleted: true },{where: {vehicle_type_id: id}})
            return res.status(200).send({message: "Record deleted successfully"})
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error "
        })
    }
}

////////////// Vehicle Master //////////////
exports.getAllVehicleMaster = async (req,res)=>{
   try{
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;
    // 🔹 Base query
    let query = `
      SELECT TV.*,TVC.vehical_category_name,VT.vehicle_type_name,FT.fuelType
      ,CONCAT(T.tm_name, ' (', T.tm_code, ')') AS tname FROM TM_VEHICLE_MASTER AS TV 
      INNER JOIN TM_VEHICLETYPE_MASTER AS VT ON VT.vehicle_type_id=TV.vehicle_type_id
      INNER JOIN TM_VEHICAL_CATEGORY AS TVC ON TVC.id=VT.vehicle_category_id
      INNER JOIN TM_FUELTYPE_MASTER AS FT ON FT.id=TV.fuel_type_id
      LEFT JOIN TM_VEHICLES_MAPPING AS V ON V.vehicle_id=TV.id AND V.status='LINKED'
      LEFT JOIN TM_TRANSPORTER_MASTER AS T ON T.id=V.transporter_id
      WHERE TV.entity_id=:entity_id AND TV.isDeleted=0`;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TV.organization_id = :organization_id`;
    } else {
      query += ` AND TV.organization_id IS NULL`;
    }

    // 🔹 Optional status filter
    if (status) {
      query += ` AND TV.status = :status`;
    }

    query += ` ORDER BY TV.id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(organization_id && { organization_id }),
        ...(status && { status })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

exports.createUpdate_vehicleMaster = async(req,res)=>{
    try{
      const {id, vehicle_number, chassis_number, engine_number, entity_id} = req.body;
      
      // Check duplicate record
      const orConditions = [];
      if (vehicle_number) orConditions.push({ vehicle_number });
      if (chassis_number) orConditions.push({ chassis_number });
      if (engine_number) orConditions.push({ engine_number });

      if (orConditions.length) {
        const whereClause = {
          entity_id,
          [Op.or]: orConditions
        };

        // UPDATE case → current record ignore
        if (id) {
          whereClause.id = { [Op.ne]: Number(id) };
        }

        const existingRecord = await db.vehicle_master.findOne({
          where: whereClause
        });

        if (existingRecord) {
          return res.status(400).send({code: 400,message: "Record already exists"});
        }
      }

      if(id){
        const updatePayload = { ...req.body };
        delete updatePayload.entity_id;
        delete updatePayload.financial_year_id;
        delete updatePayload.id;

        await db.vehicle_master.update( updatePayload, { where: {id}})
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        const updatePayload = { ...req.body };
        delete updatePayload.id;
        updatePayload.createdBy = req.user?.employee_id;
        updatePayload.organization_id = req.user?.organization_id;

        await db.vehicle_master.create(updatePayload)
        return res.status(201).send({ code: 201, message: "Record created successfully" });
      }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.deleteVehicleMaster = async (req, res) => {
    try {
        const {id}=req.params;
        const data = await db.vehicle_master.findOne({where: {vehicle_type_id: id}});
        if (!data) {
            return res.status(404).send({message: "Record Not Found"})
        } else {
            await db.vehicle_master.update({ isDeleted: true },{where: {vehicle_type_id: id}})
            return res.status(200).send({message: "Record deleted successfully"})
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error "
        })
    }
}

////////////// Driver Master //////////////
exports.getAllDriverMaster = async(req,res)=>{
  try{
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    // 🔹 Base query
    let query = `
      SELECT TD.*,CONCAT(T.tm_name, ' (', T.tm_code, ')') AS tname FROM TM_VEHICAL_DRIVER AS TD
      LEFT JOIN TM_DRIVERS_MAPPING AS D ON D.driver_id=TD.driver_id AND D.status='LINKED'
      LEFT JOIN TM_TRANSPORTER_MASTER AS T ON T.id=D.transporter_id
      WHERE TD.entity_id=:entity_id AND TD.isDeleted=0`;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TD.organization_id = :organization_id`;
    } else {
      query += ` AND TD.organization_id IS NULL`;
    }

    // 🔹 Optional status filter
    if (status) {
      query += ` AND TD.status = :status`;
    }

    query += ` ORDER BY TD.driver_id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(organization_id && { organization_id }),
        ...(status && { status })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
  }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  } 
}

exports.createUpdate_driverMaster = async(req,res)=>{
    try{
      const {driver_id, mobile_number, aadhar_number, driving_license_number, entity_id} = req.body;
      
      // Check duplicate record
      const orConditions = [];
      if (mobile_number) orConditions.push({ mobile_number });
      if (aadhar_number) orConditions.push({ aadhar_number });
      if (driving_license_number) orConditions.push({ driving_license_number });

      if (orConditions.length) {
        const whereClause = {
          entity_id,
          [Op.or]: orConditions
        };

        // UPDATE case → current record ignore
        if (driver_id) {
          whereClause.driver_id = { [Op.ne]: Number(driver_id) };
        }

        const existingRecord = await db.vehicle_driver.findOne({
          where: whereClause
        });

        if (existingRecord) {
          return res.status(400).send({code: 400,message: "Record already exists"});
        }
      }

      if(driver_id){
        const updatePayload = { ...req.body };
        delete updatePayload.entity_id;
        delete updatePayload.financial_year_id;
        delete updatePayload.driver_id;

        await db.vehicle_driver.update( updatePayload, { where: {driver_id}})
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        const organization_id = req.user?.organization_id;
        const autoGenerateCode = await generateSequentialCode(db.vehicle_driver, "DRV", organization_id);

        const updatePayload = { ...req.body };
        delete updatePayload.driver_id;
        updatePayload.createdBy = req.user?.employee_id;
        updatePayload.driver_code = autoGenerateCode;
        updatePayload.organization_id = organization_id;

        await db.vehicle_driver.create(updatePayload)
        return res.status(201).send({ code: 201, message: "Record created successfully" });
      }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.deleteDriverMaster = async (req, res) => {
    try {
        const {id}=req.params;
        const data = await db.vehicle_driver.findOne({where: {driver_id: id}});
        if (!data) {
            return res.status(404).send({message: "Record Not Found"})
        } else {
            await db.vehicle_driver.update({ isDeleted: true },{where: {driver_id: id}})
            return res.status(200).send({message: "Record deleted successfully"})
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error "
        })
    }
}

////////////// Transporter Type //////////////
exports.createUpdate_transporterType = async(req,res)=>{
    try{
      const {typeName,description,entity_id,financial_year_id, id} = req.body;
      
      // Check duplicate record
      const existingRecord = await db.transporterType_master.findOne({where: {typeName, entity_id}});

      if(id){
        if (existingRecord && Number(existingRecord.id) !== Number(id)) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        await db.transporterType_master.update({typeName,description}, { where: {id}})
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        if (existingRecord) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        await db.transporterType_master.create({typeName,description,financial_year_id,entity_id})
        return res.status(201).send({ code: 201, message: "Record created successfully" });
    }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_transporterType = async (req, res) => {
  try {
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id is required"
      });
    }

    // 🔹 Base query
    let query = `
      SELECT VC.*
      FROM TM_TRANSPORTERTYPE_MASTER AS VC
      WHERE VC.entity_id = :entity_id AND VC.isDeleted=0
    `;

    // 🔹 Optional status filter
    if (status) {
      query += ` AND VC.status = :status`;
    }

    query += ` ORDER BY VC.id ASC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(status && { status })
      }
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched successfully",
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

////////////// Transport Type //////////////
exports.createUpdate_transportType = async(req,res)=>{
    try{
      const {typeName,description,entity_id,financial_year_id, id} = req.body;
      
      // Check duplicate record
      const existingRecord = await db.transportType_master.findOne({where: {typeName, entity_id}});

      if(id){
        if (existingRecord && Number(existingRecord.id) !== Number(id)) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        await db.transportType_master.update({typeName,description}, { where: {id}})
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        if (existingRecord) {
            return res.status(400).send({code: 400,message: "Record already exists"});
        }

        await db.transportType_master.create({typeName,description,financial_year_id,entity_id})
        return res.status(201).send({ code: 201, message: "Record created successfully" });
    }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_transportType = async (req, res) => {
  try {
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id is required"
      });
    }

    // 🔹 Base query
    let query = `
      SELECT VC.*
      FROM TM_TRANSPORTTYPE_MASTER AS VC
      WHERE VC.entity_id = :entity_id
    `;

    // 🔹 Optional status filter
    if (status) {
      query += ` AND VC.status = :status`;
    }

    query += ` ORDER BY VC.id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(status && { status })
      }
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched successfully",
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

////////////// Transporter Master //////////////
exports.getAllTransporterMaster = async (req,res)=>{
   try{
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;
    // 🔹 Base query
    let query = `
      SELECT TM.*,TT.typeName,TT.typeCode
      FROM TM_TRANSPORTER_MASTER AS TM
      INNER JOIN TM_TRANSPORTERTYPE_MASTER AS TT ON TT.id=TM.transporter_type_id
      WHERE TM.entity_id=:entity_id AND TM.isDeleted=0`;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TM.organization_id = :organization_id`;
    } else {
      query += ` AND TM.organization_id IS NULL`;
    }

    // 🔹 Optional status filter
    if (status) {
      query += ` AND TM.status = :status`;
    }

    query += ` ORDER BY TM.id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(organization_id && { organization_id }),
        ...(status && { status })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

exports.createUpdate_transporterMaster = async(req,res)=>{
    try{
      const {id} = req.body;

      if(id){
        const updatePayload = { ...req.body };
        delete updatePayload.entity_id;
        delete updatePayload.financial_year_id;
        delete updatePayload.id;
        await db.transport_master.update( updatePayload, { where: {id}})
        await db.transporterTds.destroy({where:{transporter_id:id}})
        await Promise.all(req.body.tdsList.map(async (i)=>{
          const {tds_id,nature_id}=i;
          await db.transporterTds.create({tds_id,nature_id,transporter_id:id})
        }))
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        const organization_id = req.user?.organization_id;
        const autoGenerateCode = await generateSequentialCode(db.transport_master, "TRP", organization_id);

        const updatePayload = { ...req.body };
        delete updatePayload.id;
        updatePayload.createdBy = req.user?.employee_id;
        updatePayload.tm_code = autoGenerateCode;
        updatePayload.organization_id = organization_id;

        const createdData = await db.transport_master.create(updatePayload)
        await Promise.all(req.body.tdsList.map(async (i)=>{
          const {tds_id,nature_id}=i;
          await db.transporterTds.create({tds_id,nature_id,transporter_id:createdData.id})
        }))
        return res.status(201).send({ code: 201, message: "Record created successfully" });
      }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getTransporterMasterById = async (req,res)=>{
  try{
      const{id}=req.query;
      let response=await db.transport_master.findOne({where:{id}})
      const [dataList] = await db.sequelize.query(
        `SELECT T.*,TL.*,S.section,S.nature
        FROM TRANSPORTER_TDS_MST AS T
INNER JOIN TDS_LIST_MST AS TL ON TL.id=T.nature_id
INNER JOIN SYS_TDS_MST AS S ON S.id=T.tds_id
WHERE T.transporter_id=${id}`
      )
const Obj = {
  ...response.dataValues,
  tdsList:dataList
}
      if(response){
        return res.status(200).send({message: "Record fetch successfully",data:Obj});
      }
      else{
        return res.status(200).send({message: "Record fetch successfully",data:[]});
      }
  }
  catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  } 
}

exports.deleteTransporterMaster = async (req, res) => {
  try {
      const {id}=req.params;
      const data = await db.transport_master.findOne({where: {id: id}});
      if (!data) {
          return res.status(404).send({message: "Record Not Found"})
      } else {
          await db.transport_master.update({ isDeleted: true },{where: {id: id}})
          return res.status(200).send({message: "Record deleted successfully"})
      }
  } catch (error) {
      return res.status(500).send({
          message: "Internal Server Error "
      })
  }
}

exports.getTransporterMasterListByTransporterTypeId = async (req,res)=>{
  try{
      const{id}=req.query;
      let response=await db.transport_master.findAll({where:{transporter_type_id:id,status: 'ACTIVE',isDeleted: 0}})
      if(response){
        return res.status(200).send({message: "Record fetch successfully",data:response});
      }
      else{
        return res.status(200).send({message: "Record fetch successfully",data:[]});
      }
  }
  catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  } 
}

////////////// Driver Vehicle Mapping With Transporter //////////////
exports.getAllDriverListUnlinked = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    let query = `
      SELECT TD.*
      FROM TM_VEHICAL_DRIVER AS TD
      WHERE TD.entity_id = :entity_id
        AND TD.isDeleted = 0 AND TD.status = 'ACTIVE'
    `;

    //  Exclude LINKED drivers from mapping table
    query += `
      AND NOT EXISTS (
        SELECT 1
        FROM TM_DRIVERS_MAPPING DM
        WHERE DM.driver_id = TD.driver_id
          AND DM.status = 'LINKED'
      )
    `;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TD.organization_id = :organization_id`;
    } else {
      query += ` AND TD.organization_id IS NULL`;
    }

    query += ` ORDER BY TD.full_name ASC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {entity_id,...(organization_id && { organization_id })}
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});

  } catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }
}

exports.getAllVehicleListUnlinked = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    let query = `
      SELECT TD.*
      FROM TM_VEHICLE_MASTER AS TD
      WHERE TD.entity_id = :entity_id
        AND TD.isDeleted = 0 AND TD.status = 'ACTIVE'
    `;

    //  Exclude LINKED vehicle from mapping table
    query += `
      AND NOT EXISTS (
        SELECT 1
        FROM TM_VEHICLES_MAPPING DM
        WHERE DM.vehicle_id = TD.id
          AND DM.status = 'LINKED'
      )
    `;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TD.organization_id = :organization_id`;
    } else {
      query += ` AND TD.organization_id IS NULL`;
    }

    query += ` ORDER BY TD.id ASC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {entity_id,...(organization_id && { organization_id })}
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});

  } catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }
}

exports.getAllDriverVehicleMapping = async (req,res)=>{
   try{
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    // 🔹 Base query with driver & vehicle count
    let query = `
      SELECT TM.id,TM.tm_code,TM.tm_name,
        COUNT(DISTINCT TDM.driver_id) AS driver_count,
        COUNT(DISTINCT TVM.vehicle_id) AS vehicle_count
      FROM TM_TRANSPORTER_MASTER AS TM
      LEFT JOIN TM_DRIVERS_MAPPING AS TDM
        ON TDM.transporter_id = TM.id
        AND TDM.status = 'LINKED'

      LEFT JOIN TM_VEHICLES_MAPPING AS TVM
        ON TVM.transporter_id = TM.id
        AND TVM.status = 'LINKED'

      WHERE TM.entity_id = :entity_id
        AND TM.isDeleted = 0`;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TM.organization_id = :organization_id`;
    } else {
      query += ` AND TM.organization_id IS NULL`;
    }

    query += ` GROUP BY TM.id ORDER BY TM.id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: { entity_id,...(organization_id && { organization_id }), }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

exports.createDriverVehicleMapping = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      transporter_id,
      driver_id = [],
      vehicle_id = [],
      entity_id,
      financial_year_id
    } = req.body;

    // Validation
    if (
      (!Array.isArray(driver_id) || driver_id.length === 0) &&
      (!Array.isArray(vehicle_id) || vehicle_id.length === 0)
    ) {
      await transaction.rollback();
      return res.status(400).send({code: 400,
        message: "Please select at least one option: Driver or Vehicle."
      });
    }

    // Driver Mapping
    if (Array.isArray(driver_id) && driver_id.length > 0) {
      await db.drivers_mapping.bulkCreate(
        driver_id.map(id => ({
          transporter_id,
          driver_id: id,
          entity_id,
          financial_year_id,
          createdBy: req.user?.employee_id
        })),
        { transaction }
      );
    }

    // Vehicle Mapping
    if (Array.isArray(vehicle_id) && vehicle_id.length > 0) {
      await db.vehicles_mapping.bulkCreate(
        vehicle_id.map(id => ({
          transporter_id,
          vehicle_id: id,
          entity_id,
          financial_year_id,
          createdBy: req.user?.employee_id
        })),
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(201).send({
      code: 201,
      message: "Record created successfully"
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

exports.getAllDriverVehicleMappingList = async (req,res)=>{
   try{
    const { transporter_id } = req.query;

    if (!transporter_id) {
      return res.status(400).send({code: 400,message: "transporter_id is required"});
    }

    // 🔹 Fetch drivers mapping
    const drivers = await db.sequelize.query(
      `
      SELECT 
        DM.id,
        DM.status,
        DM.createdAt,
        DM.updatedAt,
        D.full_name,
        D.driver_code,
        D.mobile_number
      FROM TM_DRIVERS_MAPPING DM
      LEFT JOIN TM_VEHICAL_DRIVER D
        ON D.driver_id = DM.driver_id
      WHERE DM.transporter_id = :transporter_id
      ORDER BY DM.id DESC
      `,
      {
        replacements: { transporter_id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    // 🔹 Fetch vehicles mapping
    const vehicles = await db.sequelize.query(
      `
      SELECT 
        VM.id,
        VM.status,
        VM.createdAt,
        VM.updatedAt,
        V.vehicle_number,
        V.vehicle_model
      FROM TM_VEHICLES_MAPPING VM
      LEFT JOIN TM_VEHICLE_MASTER V
        ON V.id = VM.vehicle_id
      WHERE VM.transporter_id = :transporter_id
      ORDER BY VM.id DESC
      `,
      {
        replacements: { transporter_id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: {drivers,vehicles}});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

exports.delinkDriverVehicleMapping = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id, type } = req.body;

    if (!id || !type) {
      await transaction.rollback();
      return res.status(400).send({
        code: 400,
        message: "id and type are required"
      });
    }

    let Model;

    // 🔹 Decide table based on type
    if (type === 'driver') {
      Model = db.drivers_mapping;
    } else if (type === 'vehicle') {
      Model = db.vehicles_mapping;
    } else {
      await transaction.rollback();
      return res.status(400).send({
        code: 400,
        message: "Invalid type. Must be driver or vehicle"
      });
    }

    // 🔹 Update mapping (DELINK)
    const [affectedRows] = await Model.update(
      {
        status: 'UNLINKED',
        updatedBy: req.user?.employee_id
      },
      {
        where: { id },
        transaction
      }
    );

    if (affectedRows === 0) {
      await transaction.rollback();
      return res.status(404).send({
        code: 404,
        message: "Record not found"
      });
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: `${type === 'driver' ? 'Driver' : 'Vehicle'} delinked successfully`
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

////////////// Rate Agreement Master //////////////
exports.createUpdate_rateAgreementMaster = async(req,res)=>{
    try{
      const {id,agrno_type,agreement_no,agreement_type,valid_from,valid_to,transporter_id,entity_id} = req.body;

      /* ============ DATE OVERLAP + DUPLICATE CHECK ============ */
      const whereCondition = {
        agreement_type,
        transporter_id,
        entity_id,
        isDeleted: 0,

        [Op.and]: [
          { valid_from: { [Op.lte]: valid_to } }, // existing.from <= new.to
          { valid_to: { [Op.gte]: valid_from } }  // existing.to >= new.from
        ]
      };

      // 👉 update case → self id ignore
      if (id) {
        whereCondition.id = { [Op.ne]: id };
      }

      const existingAgreement = await db.rateAgreement_master.findOne({
        where: whereCondition
      });

      if (existingAgreement) {
        return res.status(409).send({
          code: 409,
          message:
            "Active Rate Agreement already exists for this transporter and agreement type in the given date range"
        });
      }
      /* ======================================================= */

      if(id){
        const updatePayload = { ...req.body };
        updatePayload.updatedBy = req.user?.employee_id;
        delete updatePayload.agreement_no;
        delete updatePayload.entity_id;
        delete updatePayload.financial_year_id;
        delete updatePayload.id;

        await db.rateAgreement_master.update( updatePayload, { where: {id}})
        return res.status(201).send({ code: 200, message: "Record updated successfully" });
      }else{
        const organization_id = req.user?.organization_id;
        const autoGenerateCode = await generateSequentialCode(db.rateAgreement_master, "AGR",organization_id);

        const updatePayload = { ...req.body };
        delete updatePayload.id;
        updatePayload.createdBy = req.user?.employee_id;
        updatePayload.agreement_no = agrno_type=='Auto' ? autoGenerateCode :agreement_no;
        updatePayload.organization_id = organization_id;

        const createdRecord = await db.rateAgreement_master.create(updatePayload)
        return res.status(201).send({ code: 201, message: "Record created successfully",data: {
          id: createdRecord.id
        }});
      }
    }
    catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAllRateAgreementList = async (req,res)=>{
   try{
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    let query = `
      SELECT RA.*,
            CONCAT(TM.tm_name, ' (', TM.tm_code, ')') AS tname,
            CONCAT(
              DATE_FORMAT(RA.valid_from, '%d-%m-%Y'),
              ' To ',
              DATE_FORMAT(RA.valid_to, '%d-%m-%Y')
            ) AS validity_period,
            CASE
              WHEN RA.valid_to < CURDATE() THEN 'Expired'
              ELSE 'Active'
            END AS validityStatus,
            COUNT(RAD.id) AS locationCount
      FROM TM_RATEAGREEMENT AS RA
      INNER JOIN TM_TRANSPORTER_MASTER AS TM
        ON TM.id = RA.transporter_id
      LEFT JOIN TM_RATE_AGREEMENT_DETAIL AS RAD
        ON RAD.rate_agreement_id = RA.id
      AND RAD.isDeleted = 0
      WHERE RA.entity_id = :entity_id
        AND RA.isDeleted = 0
    `;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND RA.organization_id = :organization_id`;
    } else {
      query += ` AND RA.organization_id IS NULL`;
    }

    // 🔹 GROUP BY / ORDER BY
    query += `
      GROUP BY RA.id
      ORDER BY RA.id DESC
    `;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(organization_id && { organization_id })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

exports.getRateAgreementById = async (req,res)=>{
  try{
      const{id}=req.query;
      let response=await db.rateAgreement_master.findOne({where:{id}})
      if(response){
        return res.status(200).send({message: "Record fetch successfully",data:response});
      }
      else{
        return res.status(200).send({message: "Record fetch successfully",data:[]});
      }
  }
  catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  } 
}

exports.deleteRateAgreement = async (req, res) => {
  try {
    const {id}=req.params;
    const data = await db.rateAgreement_master.findOne({where: {id: id}});
    if (!data) {
      return res.status(404).send({message: "Record Not Found"})
    } else {
      await db.rateAgreement_master.update({ isDeleted: true, updatedBy: req.user?.employee_id },{where: {id: id}})
      return res.status(200).send({message: "Record deleted successfully"})
    }
  } catch (error) {
    return res.status(500).send({
        message: "Internal Server Error "
    })
  }
}

exports.createUpdate_rateAgreementdetails = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { rate_agreement_id, rateArray } = req.body;
    const userId = req.user?.employee_id;

    let duplicateFound = false;

    for (const row of rateArray) {

      // 🔴 Duplicate check
      const whereCondition = {
        rate_agreement_id,
        vehicle_type_id: row.vehicle_type_id,
        from_city_id: row.from_city_id,
        to_city_id: row.to_city_id,
        isDeleted: 0
      };

      // update case me apna hi record exclude
      if (row.id) {
        whereCondition.id = { [db.Sequelize.Op.ne]: row.id };
      }

      const duplicate = await db.rateAgreementDetails_mapping.findOne({
        where: whereCondition,
        transaction: t
      });

      if (duplicate) {
        duplicateFound = true;
        continue; // ⚠️ is row ko skip karo, baaki process hoga
      }

      // ✅ UPDATE
      if (row.id) {
        await db.rateAgreementDetails_mapping.update(
          {
            ...row,
            updatedBy: userId
          },
          { where: { id: row.id }, transaction: t }
        );
      }
      // ✅ CREATE
      else {
        await db.rateAgreementDetails_mapping.create(
          {
            ...row,
            rate_agreement_id,
            createdBy: userId
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    return res.status(200).send({
      code: 200,
      message: duplicateFound
        ? "Some records were duplicate and skipped. Remaining records saved successfully."
        : "Records saved successfully."
    });

  } catch (error) {
    await t.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

exports.getRateAgreementDetailsById = async (req,res)=>{
  try{
      const{rate_agreement_id}=req.query;
      const response = await db.rateAgreementDetails_mapping.findAll({
        where: {
          rate_agreement_id,
          isDeleted: 0 
        },
        order: [['id', 'ASC']]
      });
      return res.status(200).send({message: "Record fetch successfully",data:response});
  }
  catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  } 
}

exports.deleteRateAgreementDetails = async (req, res) => {
  try {
    const {id}=req.params;
    const data = await db.rateAgreementDetails_mapping.findOne({where: {id: id}});
    if (!data) {
      return res.status(404).send({message: "Record Not Found"})
    } else {
      await db.rateAgreementDetails_mapping.update({ isDeleted: true, updatedBy: req.user?.employee_id },{where: {id: id}})
      return res.status(200).send({message: "Record deleted successfully"})
    }
  } catch (error) {
    return res.status(500).send({
        message: "Internal Server Error "
    })
  }
}

////////////// Transporter RFQ List //////////////
exports.getAllRFQList = async (req,res)=>{
   try{
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    // let query = `
    //   SELECT P.*, MAX(VT.vehicle_type_name) AS vehicle_type_name,
    //   MAX(TT.typeName) AS typeName,
    //   MAX(CONCAT(TM.tm_name, ' (', TM.tm_code, ')')) AS tm_name,
    //   MAX(PT.transporter_status) AS transporter_status,
    //   MAX(PT.admin_status) AS admin_status,
    //   MAX(PT.id) AS pt_id
    //   FROM WH_VH_PLANNING_MST AS P
    //   INNER JOIN TM_VEHICLETYPE_MASTER AS VT ON VT.vehicle_type_id = P.vehicle_type_id
    //   INNER JOIN TM_TRANSPORTTYPE_MASTER AS TT ON TT.id = P.transport_type_id
    //   INNER JOIN WH_VH_PLANNING_TRANSPORTER AS PT ON PT.vehicle_planing_id = P.id AND PT.isDeleted = 0
    //   INNER JOIN TM_TRANSPORTER_MASTER AS TM ON TM.id = PT.transportor_id
    //   WHERE P.entity_id = :entity_id AND P.isDeleted = 0`;
    let query = `
      SELECT P.*,VT.vehicle_type_name,
      TT.typeName,
      CONCAT(TM.tm_name, ' (', TM.tm_code, ')') AS tm_name,
      PT.transporter_status,
      PT.admin_status,
      PT.id AS pt_id
      FROM WH_VH_PLANNING_MST AS P
      INNER JOIN TM_VEHICLETYPE_MASTER AS VT ON VT.vehicle_type_id = P.vehicle_type_id
      INNER JOIN TM_TRANSPORTTYPE_MASTER AS TT ON TT.id = P.transport_type_id
      INNER JOIN WH_VH_PLANNING_TRANSPORTER AS PT ON PT.vehicle_planing_id = P.id AND PT.isDeleted = 0
      INNER JOIN TM_TRANSPORTER_MASTER AS TM ON TM.id = PT.transportor_id
      WHERE P.entity_id = :entity_id AND P.isDeleted = 0`;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TM.organization_id = :organization_id`;
    } else {
      query += ` AND TM.organization_id IS NULL`;
    }

    // 🔹 Transporter Status Filter
    if (status && status !== 'ALL') {
      query += ` AND PT.transporter_status = :status`;
    }

    // 🔹 GROUP BY / ORDER BY
    // query += `
    //   GROUP BY P.id 
    //   ORDER BY P.id DESC
    // `;
    query += `
      ORDER BY P.id DESC
    `;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        ...(organization_id && { organization_id }),
        ...(status && status !== 'ALL' && { status })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

////////////// Transporter Vehicle Dispatch Planning List //////////////
exports.getAllVehicleDispatchPlannigList = async (req,res)=>{
   try{
    const { entity_id, status } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    let query = `
      SELECT 
    MAX(P.planning_code) AS planning_code,
    MAX(P.vehicle_root_status) AS vehicle_root_status,
    MAX(VT.vehicle_type_name) AS vehicle_type_name,
    MAX(VT.vehicle_type_id) AS vehicle_type_id,
    MAX(PT.id) AS id,
    MAX(PT.trip_status) AS trip_status,
    MAX(PT.pod_status) AS pod_status,
    MAX(CONCAT(TM.tm_name, ' (', TM.tm_code, ')')) AS tm_name,
    MAX(
      CONVERT(
        COALESCE(
          VM.vehicle_number,
          PGIO.vehicle_number
        ) USING utf8mb4
      )
    ) AS vehicle_number,

    MAX(
      CONVERT(
        COALESCE(
          CONCAT(VD.full_name, ' (', VD.driver_code, ')'),
          PGIO.driver_name
        ) USING utf8mb4
      )
    ) AS drivername,

    MAX(
      CONVERT(
        COALESCE(
          VD.mobile_number,
          PGIO.driver_contact
        ) USING utf8mb4
      )
    ) AS mobile_number,

    MAX(
      CONVERT(
        PGIO.LR_number USING utf8mb4
      )
    ) AS LR_number,
    MAX(PT.vehicle_id) AS vehicle_id,
    MAX(PT.driver_id) AS driver_id,
    MAX(SO.warehouse_id) AS warehouse_id,
    COUNT(SO.id) AS delivery_point,
    COUNT(DISTINCT SO.warehouse_id) AS pickup_point,
    MIN(SO.pickup_date) AS pickup_date,
    CASE
        WHEN COUNT(*) = SUM(
            CASE
                WHEN MSO.dispatch_status = 'APPROVED' THEN 1
                ELSE 0
            END
        )
        THEN 'Verify'
        ELSE 'Unverify'
    END AS pod_allstatus,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'so_id', MSO.id,
            'invoice_no', SOINV.sales_invoice_no,
            'delivered_on_date', MSO.delivered_on_date,
            'file', MSO.file,
            'dispatch_status', MSO.dispatch_status,
            'pod_remark', MSO.pod_remark,
            'so_number', MSO.sales_order_no,
            'so_loading_priority', SO.priority,
            'so_pick_date', SO.pickup_date,
            'so_delivery_date', SO.expected_delivery_date,
            'company_name', CONCAT(CP.company_name,' (',CP.customer_code,')'),
            'contact_person_name', CC.contact_person_name,
            'mobile', CC.mobile,
            'shipping_address', CA.shipping_address,
            'shipping_pin_code', CA.shipping_pin_code,
            'shipping_postal_address', CA.shipping_postal_address,
            'warehouse_name', CONCAT(W.name,' (',W.code,')'),
            'warehouse_address', W.address,
            'warehouse_pin', W.pin
        )
    ) AS so_details
      FROM WH_VH_PLANNING_MST AS P 
      INNER JOIN WH_VH_PLANNING_TRANSPORTER AS PT ON PT.vehicle_planing_id=P.id
      INNER JOIN TM_TRANSPORTER_MASTER AS TM ON TM.id=PT.transportor_id
      INNER JOIN TM_VEHICLETYPE_MASTER AS VT ON VT.vehicle_type_id=P.vehicle_type_id 
      INNER JOIN WH_VH_PLANNING_SO AS SO ON SO.planning_id = P.id
      INNER JOIN WAREHOUSE_MASTER AS W ON W.id = SO.warehouse_id
      INNER JOIN SALES_ORDER_MST AS MSO ON MSO.id = SO.sale_order_id
      LEFT JOIN CRM_SALES_INVOICE_MST AS SOINV ON SOINV.so_id = MSO.id AND SOINV.invoice_status != 'CANCELLED'
      LEFT JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CA ON CA.id = MSO.shipping_address_id
      LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = MSO.customer_id
      LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CC ON CC.id = MSO.customer_contact_id
      LEFT JOIN TM_VEHICLE_MASTER AS VM ON VM.id=PT.vehicle_id
      LEFT JOIN TM_VEHICAL_DRIVER AS VD ON VD.driver_id=PT.driver_id
      LEFT JOIN (
      SELECT
        vehicle_planing_id,

        MAX(
          CONVERT(vehicle_number USING utf8mb4)
        ) AS vehicle_number,

        MAX(
          CONVERT(driver_name USING utf8mb4)
        ) AS driver_name,

        MAX(
          CONVERT(driver_contact USING utf8mb4)
        ) AS driver_contact,

        MAX(
          CONVERT(LR_number USING utf8mb4)
        ) AS LR_number

      FROM WH_VH_PLANNING_GATEIN_OUT

      GROUP BY vehicle_planing_id
    ) AS PGIO
      ON PGIO.vehicle_planing_id = P.id
      WHERE P.status='Approved' AND P.isDeleted=0 AND P.entity_id=:entity_id AND PT.isDeleted=0 
      AND PT.transporter_status='ACCEPTED' AND PT.admin_status='ACCEPTED' AND SO.isDeleted = 0
      AND PT.trip_status=:status`

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TM.organization_id = :organization_id`;
    } else {
      query += ` AND TM.organization_id IS NULL`;
    }

    // 🔹 GROUP BY / ORDER BY
    query += `
      GROUP BY P.id 
      ORDER BY pickup_date DESC
    `;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,status,
        ...(organization_id && { organization_id })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

exports.getVehicleListForDispatch = async (req,res)=>{
  try{
    const { entity_id, vehicleTypeId, vehicle_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;
    // 🔹 Base query
    let query = `
      SELECT DISTINCT
        TV.id,
        TV.vehicle_number
      FROM TM_VEHICLE_MASTER TV

      LEFT JOIN TM_VEHICLES_MAPPING V
        ON V.vehicle_id = TV.id
        AND V.status = 'LINKED'

      LEFT JOIN WH_VH_PLANNING_TRANSPORTER WVPT
        ON WVPT.vehicle_id = TV.id
        AND WVPT.isDeleted = 0
        AND WVPT.transporter_status = 'ACCEPTED'
        AND WVPT.admin_status = 'ACCEPTED'
        AND WVPT.trip_status != 'DELIVERED'

      WHERE
        TV.entity_id = :entity_id
        AND TV.isDeleted = 0
        AND TV.vehicle_type_id = :vehicleTypeId
        AND (V.status = 'LINKED' OR TV.id = :vehicle_id)

        -- Hide only busy vehicles
        AND (
          WVPT.vehicle_id IS NULL
          OR TV.id = :vehicle_id
        )
    `;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TV.organization_id = :organization_id`;
    } else {
      query += ` AND TV.organization_id IS NULL`;
    }

    query += ` ORDER BY TV.id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,vehicleTypeId,vehicle_id: vehicle_id || 0,
        ...(organization_id && { organization_id })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
   }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  }  
}

exports.getDriverListForDispatch = async(req,res)=>{
  try{
    const { entity_id, driver_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({code: 400,message: "entity_id is required"});
    }

    const organization_id = req.user?.organization_id;

    // 🔹 Base query
    let query = `
      SELECT 
        TD.driver_id,
        CONCAT(TD.full_name, ' (', TD.driver_code, ')') AS dname
      FROM TM_VEHICAL_DRIVER TD

      LEFT JOIN TM_DRIVERS_MAPPING D 
        ON D.driver_id = TD.driver_id 
        AND D.status = 'LINKED'

      LEFT JOIN WH_VH_PLANNING_TRANSPORTER WVPT
        ON WVPT.driver_id = TD.driver_id
        AND WVPT.isDeleted = 0
        AND WVPT.transporter_status = 'ACCEPTED'
        AND WVPT.admin_status = 'ACCEPTED'
        AND WVPT.trip_status != 'DELIVERED'

      WHERE 
        TD.entity_id = :entity_id
        AND TD.isDeleted = 0
        AND (D.status = 'LINKED' OR TD.driver_id = :driver_id)

        -- Exclude delivered drivers except edit one
        AND (
          WVPT.driver_id IS NULL 
          OR TD.driver_id = :driver_id
        )
    `;

    // 🔹 Organization-wise visibility
    if (organization_id) {
      query += ` AND TD.organization_id = :organization_id`;
    } else {
      query += ` AND TD.organization_id IS NULL`;
    }

    query += ` ORDER BY TD.driver_id DESC`;

    const [response] = await db.sequelize.query(query, {
      replacements: {
        entity_id,driver_id: driver_id || 0,
        ...(organization_id && { organization_id })
      }
    });

    return res.status(200).send({code: 200,message: "Record fetched successfully",data: response});
  }
   catch (error) {
    return res.status(500).send({message: "Internal server error",error: error.message});
  } 
}

exports.assignDriverVehicleForDispatch = async (req, res) => {
  try {
    const { table_id, driver_id, vehicle_id, trip_status } = req.body;

    const updatePayload = {
      driver_id,
      vehicle_id,
      updatedAt: new Date()
    };

    // 🔹 Ready to Pickup case
    if (trip_status === 'READY_FOR_PICKUP') {
      if (!table_id || !driver_id || !vehicle_id) {
        return res.status(400).json({message: "planning_id, driver_id and vehicle_id are required"});
      }
      updatePayload.trip_status = 'READY_FOR_PICKUP';
    }else if (trip_status === 'DISPATCHED') {
      updatePayload.trip_status = 'OUT_FOR_DELIVERY';
      updatePayload.out_for_delivery_at = new Date();
      delete updatePayload.driver_id;
      delete updatePayload.vehicle_id;
      delete updatePayload.updatedAt;
    }else if (trip_status === 'OUT_FOR_DELIVERY') {
      updatePayload.trip_status = 'DELIVERED';
      updatePayload.delivery_at = new Date();
      delete updatePayload.driver_id;
      delete updatePayload.vehicle_id;
      delete updatePayload.updatedAt;
    }

    await db.vehiclePlanningTransporter.update(
      updatePayload,
      { where: { id: table_id } }
    );

    return res.status(200).json({
      message: trip_status === 'READY_FOR_PICKUP'
        ? 'Driver & Vehicle assigned and status updated.'
        : trip_status === 'DISPATCHED' ? 'Your shipment is out for delivery and will reach you soon.' : trip_status === 'OUT_FOR_DELIVERY' ? 'Shipment marked as delivered successfully.' : 'Driver & Vehicle saved successfully.'
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}


module.exports.getRateAgreementLevelType = async(req,res)=>{
  try {
    const levelType = await db.agreementLevelType.findAll();
    if(!levelType.length){
      return res.status(200).send({
        success:true,
        message:'Rate agreement level type not found',
        data:[]
      });     
    }
    return res.status(200).send({
      success:true,
      message:'Rate agreement level type list',
      data:levelType
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:"Internal server error",
      error:error.message
    })
  }
}