const { EntityResolution } = require("aws-sdk");
const db = require("../../../models/index")



exports.get_GST_Type = async (req, res) => {
    try {

        const [query] = await db.sequelize.query(`SELECT * FROM MASTER_GST_TYPE
             WHERE status = 'ACTIVE' AND isDeleted = 0;`);


         if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(404)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};



exports.get_GST_GL_Mapping_List = async (req, res) => {
    try {
       
        let entity_id = req.params?.entity_id;
        const [query] = await db.sequelize.query(`SELECT GAM.*, MGT.gst_type, COA.account_code, COA.account_name 
            FROM GST_GL_ACCOUNT_MAPPING  AS GAM
LEFT JOIN MASTER_GST_TYPE AS MGT ON MGT.id = GAM.gst_type_id
LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = GAM.chart_account_id
WHERE GAM.status = 'ACTIVE' AND GAM.isDeleted = 0 AND GAM.entity_id = ${entity_id} ;`);


         if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(404)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.get_GST_GL_Mapping_By_Id = async (req, res) => {
    try {
       
        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT GAM.*, MGT.gst_type, COA.account_code, COA.account_name FROM GST_GL_ACCOUNT_MAPPING  AS GAM
LEFT JOIN MASTER_GST_TYPE AS MGT ON MGT.id = GAM.gst_type_id
LEFT JOIN CHART_OF_ACCOUNTS AS COA ON COA.id = GAM.chart_account_id
WHERE GAM.status = 'ACTIVE' AND GAM.isDeleted = 0 AND GAM.id = ${id} ;`);


         if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(404)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};





exports.get_mapped_sales_gl = async (req, res) => {
    try {
       
        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT * FROM MAP_SALE_ACCOUNT WHERE entity_id = ${id};`);


         if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(404)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


// ---------------- create Additional Charges -------------  //
exports.addGSTGlMapping = async(req, res)=>{
    try{
const {    entity_id,
      gst_type_id,
      direction,
      description,
      chart_account_id,
      applicable_for,
      status} = req.body;

const gstGLMapping =  await db.gstGlAccountMapping.create({
    gst_type_id:gst_type_id,
    direction:direction,
    description:description,
    chart_account_id:chart_account_id,
    applicable_for:applicable_for,
    status:status,
    entity_id: entity_id
})
return res.status(200).send({ code: 200, message: "GST GL Account Mapping Successfully", data: gstGLMapping });

    }catch(error){
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });

    }
}

// ----------------  get All Additional Charges -----------  //
exports.getAllAdditional = async (req, res) => {
    try {
        const { entity_id, financial_id } = req.query;

        const additional = await db.sequelize.query(`
            SELECT 
                ac.*, hc.hsn_sac_code,gr.value as gstRate
            FROM 
                MASTER_ADDITIONAL_CHARGE AS ac 
            LEFT JOIN 
                MASTER_HSN_SAC_CODE AS hc 
            ON 
                ac.additional_hsn_code = hc.id

                LEFT JOIN 
                GST_RATE_MASTER AS gr 
            ON 
                hc.gst_rate_id = gr.id
            WHERE 
                ac.entity_id = :entity_id AND 
                ac.financial_id = :financial_id AND 
                ac.isDeleted = false
            ORDER BY 
                ac.id DESC
        `, {
            replacements: { entity_id, financial_id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (additional && additional.length > 0) {
            return res.status(200).json({ code: 200, message: "All Data Retrieved", data: additional });
        } else {
            return res.status(404).json({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        console.error('Error retrieving additional charges:', error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};


// -----------------  get by ----------------  //
exports.Additional_getById = async (req, res) => {
    try {
        const AdditionalId = req.params.id;

        const [additionalData] = await db.sequelize.query(`
            SELECT 
                ac.*, hc.hsn_sac_code , gr.value as gstRate
            FROM 
                MASTER_ADDITIONAL_CHARGE AS ac
            LEFT JOIN 
                MASTER_HSN_SAC_CODE AS hc 
            ON 
                ac.additional_hsn_code = hc.id
                
                LEFT JOIN 
                GST_RATE_MASTER AS gr 
            ON 
                 hc.gst_rate_id = gr.id
            WHERE 
                ac.id = :id AND 
                ac.isDeleted = false
            LIMIT 1
        `, {
            replacements: { id: AdditionalId },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!additionalData) {
            return res.status(404).send({ code: 404, message: "Additional Charges not found" });
        }

        return res.status(200).send({ code: 200, message: "Success", data: additionalData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

// ------------------  update Additional Charge ------------ //

exports.updateGstGlMapping = async (req, res) => {
    try {
        const UpdatedId = req.params?.id;
      const {    entity_id,
      gst_type_id,
      direction,
      description,
      chart_account_id,
      applicable_for,
      status} = req.body;



        // Check if the additional charge exists
        const gstGlMapping = await db.gstGlAccountMapping.findOne({
            where: { id: UpdatedId, isDeleted: false }
        });

        if (!gstGlMapping) {
            return res.status(404).send({ code: 404, message: "Data not Found" });
        }

        // Check for duplicates (excluding the current record)
        // const duplicate = await db.additionalCharge.findOne({
        //     where: {
        //         additional_name,
        //         additional_hsn_code,
        //         // additional_tax_rate,
        //         description_additional,
        //         id: { [db.Sequelize.Op.ne]: UpdatedId },
        //         isDeleted: false
        //     }
        // });

        // if (duplicate) {
        //     return res.status(409).send({ code: 409, message: "Additional Already Exists" });
        // }

        // Perform the update

 await db.gstGlAccountMapping.update({
    gst_type_id:gst_type_id,
    direction:direction,
    description:description,
    chart_account_id:chart_account_id,
    applicable_for:applicable_for,
    status:status,
    entity_id: entity_id
},
{
    where: { id: UpdatedId }
})


        const updatedGstGlAccountMapping = await db.gstGlAccountMapping.findOne({
            where: { id: UpdatedId }
        });

        return res.status(200).send({
            code: 200,
            message: "Updated Successfully",
            data: updatedGstGlAccountMapping
        });

    } catch (error) {
        // logger.error(`Error: ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message:error.message || "Internal server error" });
    }
};





module.exports.mapSalesCA = async (req, res) => {
    try {
      const { entity_id, chart_account_id, purchase_chart_account_id, status_value } = req.body;
  
//   console.log('==============',req.body)
//   return trueee
      let updateData = {};
  
      if (status_value === 'sales') {
        updateData.chart_account_id = chart_account_id;
      } else if (status_value === 'purchase') {
        updateData.purchase_chart_account_id = purchase_chart_account_id;
      } else {
        return res.status(400).send({ code: 400, message: "Invalid status" });
      }
  
      const count = await db.mapSalesAccount.count({ where: { entity_id } });
  
      if (count === 0) {
        await db.mapSalesAccount.create({
          entity_id,
          ...updateData
        });
  
        return res.status(200).send({
          code: 200,
          message: "Successfully created"
        });
      }
  
    
      await db.mapSalesAccount.update(updateData, {
        where: { entity_id }
      });
  
      return res.status(200).send({
        code: 200,
        message: "Successfully updated"
      });
  
    } catch (error) {
      return res.status(500).send({
        code: 500,
        message: error.message
      });
    }
  };



//  -------------------- delete ----------------- //

exports.deleteGstGlMappingById = async (req, res) => {
    try {
        const idToDelete = req.params.id;

        // Check if the record exists and is not already deleted
        const gstGlMapping = await db.gstGlAccountMapping.findOne({
            where: { id: idToDelete, isDeleted: false }
        });

        if (!gstGlMapping) {
            return res.status(404).send({
                code: 404,
                message: "Data not found or already deleted"
            });
        }

        // Perform the soft delete
        await db.gstGlAccountMapping.update(
            { isDeleted: true },
            { where: { id: idToDelete } }
        );

        return res.status(200).send({
            code: 200,
            message: "Deleted Successfully"
        });

    } catch (error) {
        logger.error(`Error while deleting: ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        });
    }
};



//  ------------------ status update additional  --------- //

exports.statusUpdateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await db.additionalCharge.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await db.additionalCharge.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!"
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        // logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




