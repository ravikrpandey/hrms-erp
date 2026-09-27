const db = require("../../../../app/models/index");
const logger = require('../../../../logger/index');
const CryptoJS = require("crypto-js");

exports.create_vehical_category=async(req,res)=>{
    try{
      const{vehical_category_name,description,entity_id,financial_year_id} = req.body;
      if(!vehical_category_name || !description || !entity_id || !financial_year_id){
        return res.status(403).send({ code: 403, message:"All Fields required....." });
      }
      let response=await db.vehical_category.create({vehical_category_name,description,financial_year_id,entity_id})
      if(response){
        return res.status(200).send({ code: 200, message: "create SuccessFully",data:response });
      }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_vehical_category=async (req,res)=>{
    try{
      const{entity_id,financial_year_id}=req.query;
      if(!entity_id || !financial_year_id){
        return res.status(404).send({ code: 404, message: "Id not found...." });
      }
      let [response]=await db.sequelize.query(`
        SELECT VC.* FROM TM_VEHICAL_CATEGORY AS VC WHERE VC.entity_id=${entity_id} AND VC.isDeleted=0 ORDER BY VC.id DESC`)
        if(response){
            return res.status(200).send({ code: 200, message: "fetch successfully",data:response });
        }
        else{
            return res.status(404).send({ code: 404, message: "data not found..",data:[] });
        }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.update_vehical_category = async (req, res) => {
    try {
        const { id, status, vehical_category_name, description } = req.body;

        if (!id) {
            return res.status(400).json({ code: 400, message: "Vehicle category ID is required" });
        }

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (vehical_category_name !== undefined) updateData.vehical_category_name = vehical_category_name;
        if (description !== undefined) updateData.description = description;

         if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ code: 400, message: "No valid fields provided for update" });
        }

        const vehicleCategory = await db.vehical_category.findOne({ where: { id } });

        if (!vehicleCategory) {
            return res.status(404).json({ code: 404, message: "Vehicle category not found" });
        }

        Object.assign(vehicleCategory, updateData);
        await vehicleCategory.save();

        return res.status(200).json({ code: 200, message: "Update successful", data: vehicleCategory });

    } catch (error) {
        console.error(`Error: ${error.message}`, error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};

exports.get_vehical_category_byId=async(req,res)=>{
    try{
        const{id}=req.query;
        if (!id) {
            return res.status(400).json({ code: 400, message: "Vehicle category ID is required" });
        }
        let [response]=await db.sequelize.query(`SELECT VC.* FROM TM_VEHICAL_CATEGORY AS VC WHERE VC.id=${id}`);
            if(response){
                return res.status(200).json({ code: 200, message: "fetch successfully",data:response });
            }
            else{
                return res.status(404).json({ code: 404, message: "data not found",data:[] });
            }
    }
    catch (error) {
        console.error(`Error: ${error.message}`, error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
}
exports.get_vehical_category_Active=async(req,res)=>{
    try{
        const{entity_id,financial_year_id}=req.query;
        let [response]=await db.sequelize.query(`
            SELECT VC.* FROM TM_VEHICAL_CATEGORY AS VC WHERE VC.entity_id=${entity_id} AND VC.status='ACTIVE' AND VC.isDeleted=0 order by VC.id DESC`);
            if(response){
                return res.status(200).json({ code: 200, message: "fetch successfully",data:response });
            }
            else{
                return res.status(404).json({ code: 404, message: "data not found",data:[] });
            }
    }
    catch (error) {
        console.error(`Error: ${error.message}`, error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
}
