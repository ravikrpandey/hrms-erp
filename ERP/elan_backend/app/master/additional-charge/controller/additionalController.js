const db = require("../../../models/index")



// ---------------- create Additional Charges -------------  //
exports.create_additional = async(req, res)=>{
    try{
const {additional_name,description_additional,additional_hsn_code, additional_tax_rate,financial_id,entity_id} = req.body;

const additonalCharge =  await db.additionalCharge.create({
    additional_name:additional_name,
    additional_hsn_code:additional_hsn_code,
    additional_tax_rate:additional_tax_rate,
    financial_id:financial_id,
    entity_id:entity_id,
    description_additional:description_additional
})
return res.status(200).send({ code: 200, message: "Additional Charge Created Successfully", data: additonalCharge });

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

exports.updateAdditionalById = async (req, res) => {
    try {
        const UpdatedId = req.params.id;
        const {
            additional_name,
            additional_hsn_code,
            // additional_tax_rate,
            financial_id,
            entity_id,
            description_additional
        } = req.body;

        // Check if the additional charge exists
        const additional = await db.additionalCharge.findOne({
            where: { id: UpdatedId, isDeleted: false }
        });

        if (!additional) {
            return res.status(404).send({ code: 404, message: "Additional not Found" });
        }

        // Check for duplicates (excluding the current record)
        const duplicate = await db.additionalCharge.findOne({
            where: {
                additional_name,
                additional_hsn_code,
                // additional_tax_rate,
                description_additional,
                id: { [db.Sequelize.Op.ne]: UpdatedId },
                isDeleted: false
            }
        });

        if (duplicate) {
            return res.status(409).send({ code: 409, message: "Additional Already Exists" });
        }

        // Perform the update
        await db.additionalCharge.update({
            additional_name,
            additional_hsn_code,
            // additional_tax_rate,
            financial_id,
            entity_id,
            description_additional
        }, {
            where: { id: UpdatedId }
        });

        const updatedAdditional = await db.additionalCharge.findOne({
            where: { id: UpdatedId }
        });

        return res.status(200).send({
            code: 200,
            message: "Additional updated successfully",
            data: updatedAdditional
        });

    } catch (error) {
        // logger.error(`Error: ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message:error.message || "Internal server error" });
    }
};


//  -------------------- delete ----------------- //

exports.deleteAdditionalById = async (req, res) => {
    try {
        const idToDelete = req.params.id;

        // Check if the record exists and is not already deleted
        const additional = await db.additionalCharge.findOne({
            where: { id: idToDelete, isDeleted: false }
        });

        if (!additional) {
            return res.status(404).send({
                code: 404,
                message: "Additional not found or already deleted"
            });
        }

        // Perform the soft delete
        await db.additionalCharge.update(
            { isDeleted: true },
            { where: { id: idToDelete } }
        );

        return res.status(200).send({
            code: 200,
            message: "Additional deleted successfully"
        });

    } catch (error) {
        logger.error(`Error while deleting additional: ${error.message}`, { error });
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




