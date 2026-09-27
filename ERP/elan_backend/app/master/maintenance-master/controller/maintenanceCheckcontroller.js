const db = require("../../../models/index");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const logger = require('../../../../logger/index');
const fs = require('fs');
const path = require('path');

exports.create_maintenance_master = async (req, res) => {
    try {
        const { maintenance_type, workstation_id, entity_id, financial_year_id } = req.body;

        if (!workstation_id) {
            return res.status(404).send({ 
                code: 404, 
                message: "WorkStation Id not found!" 
            });
        }

        if (!maintenance_type || maintenance_type.length === 0) {
            return res.status(400).send({ 
                code: 400, 
                message: "Maintenance type is required!" 
            });
        }

        const response = await db.masterMaintenance.create({
            workstation_id,
            entity_id,
            financial_year_id,
        });

        for (const type of maintenance_type) {
            await db.Manitenance_Type.create({
                maintenance: type.maintenance,
                maintenance_master_id: response.id,
            });
        }

        return res.status(200).send({ 
            code: 200, 
            data: response, 
            message: "Maintenance Check created successfully" 
        });
    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ 
            code: 500, 
            message: error.message || "Server Error" 
        });
    }
};


exports.getAll_Maintenance_check=async (req,res)=>{
   try{
        const{entity_id,financial_year_id}=req.query;
        if(entity_id && financial_year_id){
            let response = await db.sequelize.query(`
                SELECT 
                    mm.id,
                    mw.name_of_workstation,
                    mm.entity_id,
                    mm.financial_year_id,
                    mm.status
                FROM 
                    MASTER_MAINTENANCE AS mm
                INNER JOIN 
                    MASTER_WORKSTATION AS mw
                ON 
                    mm.workstation_id = mw.id
                WHERE 
                    mm.entity_id = :entity_id 
                    AND mm.financial_year_id = :financial_year_id
            `, {
                replacements: { entity_id, financial_year_id }, 
                type: db.sequelize.QueryTypes.SELECT 
            });
            
                if(response){
                    return res.status(200).send({ 
                        code: 200, 
                        data: response, 
                        message: "Maintenance Check fetch successfully" 
                    });
                }
        }else{
            return res.status(404).send({ code: 404, message:" Id not found!" });
        }
   }
   catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
}
}