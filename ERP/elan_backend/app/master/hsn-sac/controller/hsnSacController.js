const db = require("../../../models/index");
const branch = db.tbl_branch;
const logger = require('../../../../logger/index');




exports.getGSTRate = async (req, res) => { 
    try {

          const [query] = await db.sequelize.query(`SELECT * FROM GST_RATE_MASTER WHERE status = 'ACTIVE' AND isDeleted = 0`);
    
    
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
                  .status(400)
                  .send({ code: 404, message: "Record Not Found", data: query });
          }
      } catch (error) {
          return res.status(500).send({ code: 500, message: error.message });
      }
  };


  exports.create_hsn_sac = async (req, res) => {
    try {
        
        
        const {
            hsn_sac_code,
            description ,
            gst_rate_id,
            code_type,
            exemption,
        } = req.body.formData;

        const {form_id,entity_id} = req.body;

        const payload={
            hsn_sac_code,
            description ,
            gst_rate_id,
            code_type,
            exemption,
            entity_id
        }

      
        //   if (!bank_id == '') {
        //     payload.bank_id = bank_id;
        //   }


        if (form_id != "null" && form_id != undefined && form_id != null && form_id != "" && form_id != 'undefined') {
           await db.hsn_sac_master.update(payload,{where:{id: form_id}})

            return res
                .status(200)
                .send({ code: 200, message: "Updated Successfully!" });
        } else {
            await db.hsn_sac_master.create(
                payload
            )

            return res
                .status(201)
                .send({ code: 201, message: "Created Successfully!" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message});
    }
};

exports.getHsnSacById = async (req, res) => { 
    try {
   let id = req.params?.id;
          const [query] = await db.sequelize.query(`SELECT MHSC.*, GRM.value AS gst_rate FROM MASTER_HSN_SAC_CODE AS MHSC 
LEFT JOIN GST_RATE_MASTER AS GRM ON GRM.id = MHSC.gst_rate_id
WHERE MHSC.id = ${id}`);
    
    
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
                  .status(400)
                  .send({ code: 404, message: "Record Not Found", data: query });
          }
      } catch (error) {
          return res.status(500).send({ code: 500, message: error.message });
      }
  };

  exports.getHsnSacList = async (req, res) => { 
    try {
   
          const [query] = await db.sequelize.query(`SELECT MHSC.*, GRM.value AS gst_rate FROM MASTER_HSN_SAC_CODE AS MHSC 
LEFT JOIN GST_RATE_MASTER AS GRM ON GRM.id = MHSC.gst_rate_id
WHERE MHSC.isDeleted = 0 ORDER BY MHSC.id DESC`);
    
    
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
                  .status(200)
                  .send({ code: 404, message: "Record Not Found", data: query });
          }
      } catch (error) {
          return res.status(500).send({ code: 500, message: error.message });
      }
  };


exports.delete_HSN_SAC = async (req, res) => {
    try {
      const {id} =req.params;
     
      await db.hsn_sac_master.update({ isDeleted: true }, { where: { id: id } });
  
      return res
        .status(200)
        .send({ code: 200, message: "Deleted Successfully!" });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  };

exports.branchStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }

        console.log(status);
        const getData = await branch.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await branch.update(
                {
                    status,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).send({
                code: 200,
                message: "Branch Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);

        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

