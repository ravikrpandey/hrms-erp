const db = require('../../../models/index')
const { Op } = require('sequelize');
const Assessment = db.assessment
const logger = require('../../../../logger/index');


exports.createAssessment = async (req, res) => {
    try {
        const { assessment_name, start_date, assessment_degree, end_date, filter_fy, entity_id ,employee_id, financial_year_id } = req.body;
        const existingAssessment = await Assessment.findOne({
            where: {
                entity_id: entity_id,
                filter_fy:filter_fy,
                employee_id: employee_id,
                financial_year_id: financial_year_id,
                assessment_name:assessment_name,
                isDeleted: false
            }
        });
        if (existingAssessment) {
            return res.status(403).send({ code: 404,message: "Assessment Already Exists" });
        } else {
            const newAssessment = await Assessment.create({
                assessment_name,
                entity_id,
                financial_year_id,
                filter_fy,
                employee_id,
                assessment_degree,
                start_date,
                end_date
            });

            return res.status(200).send({ code: 200, message: "Assessment  Created", data: newAssessment });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}


exports.getAll_Assessment = async (req, res) => {
    try {

        const entity_id = req.params.id;
        const {filter_fy} = req.query;
      
        const query = `SELECT YA.assessment_name,
                          YA.start_date,
                          YA.end_date,
                          YA.assessment_degree,
                          YA.id,
                          YA.financial_year_id,
                          MFY.financial_year
                      FROM PM_YEARLY_ASSESSMENT_SETUP AS YA
                      LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY
                      ON YA.financial_year_id = MFY.id
                      WHERE YA.entity_id = ${entity_id} AND YA.filter_fy = ${filter_fy}
                    AND YA.isDeleted = false`
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });


        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message:error.message ||  "Server Error" });
    }
};

exports.getAssessmentById = async (req, res) => {
    const assessmentId = req.params.id;
    try {
        const assessment = await Assessment.findOne({ where: { id: assessmentId, isDeleted: false } });

        if (!assessment) {
            return res.status(404).send({ code: 404, message: "Assessment not found" });
        }

        return res.status(200).send({ code: 200, message: "Assessment found", data: assessment });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


exports.updateAssessmentById = async (req, res) => {
    const assessmentId = req.params.id;
    const { assessment_name, assessment_degree, financial_year_id, start_date, end_date } = req.body;
    
    try {
        let assessment = await Assessment.findOne({ where: { id: assessmentId , isDeleted: false } });

        if (!assessment) {
            return res.status(404).send({ code: 404, message: "Assessment Record not found" });
        } else {
            const Assessmentt = await Assessment.findAll(
                { 
                    where: { 
                        assessment_name: assessment_name,
                        financial_year_id: financial_year_id,
                        isDeleted: false,
                        id: {
                            [Op.not]: assessmentId
                        }
                    }
                });
            if (Assessmentt.length >0) {
                return res.status(409).send({ code: 409, data:Assessmentt,message: "Yearly Assessment Already Exist" });
            } else {
                const Assessmentt_Setup = await Assessment.update({
                    assessment_name: assessment_name,
                    assessment_degree: assessment_degree,
                    financial_year_id: financial_year_id,
                    start_date: start_date,
                    end_date: end_date,
                }, {
                    where: {
                        id: assessmentId,
                        isDeleted:false
                    }
                })
                if (Assessmentt_Setup) {
                    return res.status(200).send({ code: 200, message: "Assessment updated successfully", data: Assessmentt_Setup });
                } else {
                    return res.status(200).send({ code: 501, message: "Assessment not able to update!", data: Assessmentt_Setup });
                }
            }
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


exports.deleteAssessmentById = async (req, res) => {
    try {
        const assessmentId = req.params.id
        const dltStage = await Assessment.findOne({ where: { id: assessmentId } });
        if (dltStage) {
            const deleteData = await Assessment.update({ isDeleted: true }, { where: { id: assessmentId } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.get_Assessment_financeYear = async (req, res) => {
    try {

        const getAllData = await db.financial_year.findAll({ where: { isDeleted: false } });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.YrAssessmentStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await Assessment.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await Assessment.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
