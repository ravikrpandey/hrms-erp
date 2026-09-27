const db = require('../../../models/index')
const logger = require('../../../../logger/index');

exports.getAll_Job_Profile_Type=async(req,res)=>{

  try{
    let [response]=await db.sequelize.query(`
        SELECT * FROM MASTER_SHARE_PROFILE WHERE status='ACTIVE'
        `)
        if(response){
            return res.status(200).send({
                code: 200,
                message: "job profile fecth successfully ",
                data:response
            });
        }else{
            return res.status(200).send({
                code: 200,
                message: "job profile not found....... ",
                data:[]
            });
        }
  
}
catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    console.error("Error:", error);

    return res.status(500).send({
        code: 500,
        message: "Internal Server Error. ",
    });
}
}
exports.getAll_Job_Type=async(req,res)=>{

  try{
    let [response]=await db.sequelize.query(`
        SELECT * FROM MASTER_JOB_TYPE WHERE status='ACTIVE'
        `)
        if(response){
            return res.status(200).send({
                code: 200,
                message: "job profile fecth successfully ",
                data:response
            });
        }else{
            return res.status(200).send({
                code: 200,
                message: "job profile not found....... ",
                data:[]
            });
        }
  
}
catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    console.error("Error:", error);

    return res.status(500).send({
        code: 500,
        message: "Internal Server Error. ",
    });
}
}
