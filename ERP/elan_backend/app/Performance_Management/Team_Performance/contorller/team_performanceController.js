const db = require('../../../models/index');
const logger = require('../../../../logger/index');



exports.getAll_selfAssessment = async (req, res) => {
    try {
        const entity_id = req.params.entity_id
        console.log("jd",entity_id);
        const financial_year_id = req.query.financial_id
        console.log("jd",financial_year_id);
        const query = `
               SELECT 
        MFY.financial_year,
       CONCAT(U.first_name, ' ', U.last_name) AS full_name,
       U.employee_id,
        U.employee_code,
        YA.financial_year_id,
        YA.entity_id,
         CONCAT (YA.id) AS yearly_assessment_id,
        YA.status
        FROM PM_YEARLY_ASSESSMENT_SETUP AS YA
        LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY
        ON YA.financial_year_id = MFY.id
        LEFT JOIN HRMS_REGISTERED_USER AS U
        ON YA.employee_id = U.employee_id
        WHERE YA.entity_id = ${entity_id}
      
        AND YA.isDeleted = false
        AND YA.status = 'Pending For Manager Review';

    `
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData});
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_SelfAssessmentEmployee = async (req, res) => {
    try {
        const entity_id = req.params.entity_id;
        const employee_id = req.query.employee_id;
        const year_assessment_id = req.query.yearly_assessment_id;
        
        const query = ` SELECT
    CONCAT(U.first_name, ' ', U.last_name) AS full_name,
    U.employee_code,
    MA.area_name,
    D.department_name,
    U.reporting_manager,
    YA.start_date,
    YA.end_date,
    YA.employee_id,
    YA.assessment_name,
    SK.remarks
    FROM HRMS_REGISTERED_USER AS U
    LEFT JOIN HRMS_REGISTERED_USERS_ENTITY AS UE
    ON U.employee_id = UE.employee_id
    LEFT JOIN MASTER_AREA AS MA
    ON U.area_id = MA.id
    LEFT JOIN MASTER_DEPARTMENT AS D
    ON U.department_id = D.dept_id
    LEFT JOIN PM_YEARLY_ASSESSMENT_SETUP AS YA
    ON UE.entity_id = YA.entity_id 
    LEFT JOIN ESS_SKILL_DEVELOPMENT_PLAN AS SK
    ON YA.id = SK.year_assessment_id 
    AND U.employee_id = SK.employee_id  
    WHERE YA.entity_id = ${entity_id}
    AND YA.employee_id = ${employee_id}
    AND YA.id = ${year_assessment_id}
    AND U.isDeleted = false;

    `
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData[0] });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message:error.message || "Server Error" });
    }
};



exports.getAll_kpaSelfAssessment = async (req, res) => {
    try {
        const entity_id = req.params.id;
        const employee_id = req.query.employee_id;
        const query = `SELECT
                    K.activity,
                    K.id, 
                    HKO.objective_name,
                    K.kpi_data, 
                    MFY.financial_year
            FROM HRMS_KPA_MASTER AS K 
            LEFT JOIN HRMS_KPA_OBJECTIVE AS HKO
            ON K.objective_id = HKO.id
            LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY
            ON K.financial_year_id = MFY.id
            
            WHERE K.entity_id = ${entity_id} AND K.employee_id = ${employee_id} AND K.isDeleted = false;

    `
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
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


