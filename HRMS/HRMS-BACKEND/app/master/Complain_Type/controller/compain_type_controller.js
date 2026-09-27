const db = require('../../../models/index')

exports.create_complaint_type = async (req, res) => {
    try {
        const { complaint_type, entity_id, financial_year_id } = req.body;

        if (!complaint_type || !entity_id || !financial_year_id) {
            return res.status(400).send({
                code: 400,
                message: "All fields (complaint_type, entity_id, financial_year_id) are required!"
            });
        }
        const IssueData = await db.Master_Complaint.findOne({ where: { complaint_type: complaint_type,isDeleted:false } });
        if (IssueData) {
            return res.status(201).send({ code: 201, message: "Complaint Type is Already Exits!" });
        }
        const complaint_code = btoa(Math.random()).slice(0, 10).toUpperCase();
        const response = await db.Master_Complaint.create({
            complaint_type,
            entity_id,
            financial_year_id,
            complaint_code
        });

        if (response) {
            return res.status(200).send({
                code: 200,
                message: "Complaint type created successfully!",
                data: response,
            });
        }

        return res.status(404).send({
            code: 404,
            message: "Failed to create complaint type. Please try again!",
        });
    } catch (error) {
  
        console.error("Error:", error);

        return res.status(500).send({
            code: 500,
            message: "Internal Server Error. ",
        });
    }
};

exports.get_all_complaint_type=async(req,res)=>{
    try{
      const{entity_id,financial_year_id}=req.query;
      if(!entity_id || !financial_year_id){
        return res.status(403).send({
            code: 403,
            message: "Id not found. ",
        });
      }
      let [response]=await db.sequelize.query(`
        SELECT * FROM  MASTER_COMPLAINT_TYPE WHERE entity_id=${entity_id} AND financial_year_id=${financial_year_id};
        `)
        if(response){
            return res.status(200).send({
                code: 200,
                message: "fetch successfully... ",
                data:response
            });
        }
        else{
            return res.status(404).send({
                code: 404,
                message: "Record not found........ ",
                data:[]
            });
        }
    }
    catch (error) {
  
        console.error("Error:", error);

        return res.status(500).send({
            code: 500,
            message: "Internal Server Error. ",
        });
    }
}
exports.get_all_complaint_typeActive=async(req,res)=>{
    try{
      const{entity_id,financial_year_id}=req.query;
      if(!entity_id || !financial_year_id){
        return res.status(403).send({
            code: 403,
            message: "Id not found. ",
        });
      }
      let [response]=await db.sequelize.query(`
        SELECT * FROM  MASTER_COMPLAINT_TYPE WHERE entity_id=${entity_id} AND financial_year_id=${financial_year_id} AND status='ACTIVE';
        `)
        if(response){
            return res.status(200).send({
                code: 200,
                message: "fetch successfully... ",
                data:response
            });
        }
        else{
            return res.status(404).send({
                code: 404,
                message: "Record not found........ ",
                data:[]
            });
        }
    }
    catch (error) {

        console.error("Error:", error);

        return res.status(500).send({
            code: 500,
            message: "Internal Server Error. ",
        });
    }
}

exports.get_complaint_type_byId=async(req,res)=>{
    try{
        const{id}=req.query;
        if(!id){
            return res.status(404).send({
                code: 404,
                message: "Id not found.... ",
            });
        }
        let [response]=await db.sequelize.query(`
             SELECT * FROM  MASTER_COMPLAINT_TYPE WHERE id=${id};
            `)
            if(response){
                return res.status(200).send({
                    code: 200,
                    message: "fetch successfully... ",
                    data:response
                });
            }
            else{
                return res.status(404).send({
                    code: 404,
                    message: "Record not found........ ",
                    data:[]
                });
            }
    }
    catch (error) {

        console.error("Error:", error);

        return res.status(500).send({
            code: 500,
            message: "Internal Server Error. ",
        });
    }
}

exports.update_complaint_type=async(req,res)=>{
    try{
       const{id,complaint_type,status}=req.body;
      
       if(status){
         let [response]=await db.sequelize.query(`
           UPDATE  MASTER_COMPLAINT_TYPE AS C SET C.status='${status}' WHERE C.id=${id}
            `)
            return res.status(200).send({
                code: 200,
                message: "Complaint type update successfully!",
                data: response,
            });
       }else{
        let [response]=await db.sequelize.query(`
           UPDATE  MASTER_COMPLAINT_TYPE AS C SET C.complaint_type='${complaint_type}' WHERE C.id=${id}
            `)
            return res.status(200).send({
                code: 200,
                message: "Complaint type update successfully!",
                data: response,
            });
       }
     
    }catch (error) {
       
        console.error("Error:", error);

        return res.status(500).send({
            code: 500,
            message: "Internal Server Error. ",
        });
    }
}