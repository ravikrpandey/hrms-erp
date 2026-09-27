const { filter } = require('mathjs');
const db = require('../../../models/index');
const technical_assessment = require('../model/technical_assessment');
const Assessment = db.assessment
const moment = require('moment')



exports.getAll_Assessment = async (req, res) => {
    try {
        const entity_id = req.params.id;
        const { employee_id, filter_fy } = req.query;

        const assessmentsQuery = `
            SELECT
    YA.id,
    YA.assessment_name,
    YA.start_date,
    YA.end_date,
    YA.financial_year_id,
    YA.employee_id,
    HRU.first_name,
    HRU.employee_code,
    HRU.department_id,
    HRU.area_id,
    HRU.reporting_manager_id,
    AYD.dept_id AS assessment_dept_id,  
    AYD.employee_id AS assessment_employee_id,
    MFY.financial_year,
    COALESCE(PSA.status, 'Pending For Self Assessment') AS status
FROM
    PM_YEARLY_ASSESSMENT_SETUP AS YA
LEFT JOIN
    PM_SUBMITTED_ASSESSMENT AS PSA 
    ON PSA.user_id = :employee_id
   AND PSA.entity_id = :entity_id
   AND PSA.financial_year_id = YA.financial_year_id
   AND PSA.yearly_assessment_id = YA.id
   AND PSA.isDeleted = false
LEFT JOIN
    MASTER_FINANCIAL_YEAR AS MFY ON YA.financial_year_id = MFY.id
LEFT JOIN
    HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = YA.employee_id
LEFT JOIN
    PM_YEARLY_ASSESSMENT_DEPARTMENT AS AYD ON AYD.yearly_assessment_id = YA.id
LEFT JOIN
    MASTER_DEPARTMENT AS MD ON AYD.dept_id = MD.dept_id   -- changed
LEFT JOIN
    MASTER_AREA AS MA ON HRU.area_id = MA.id              -- changed
WHERE
    YA.filter_fy = :filter_fy
    AND YA.entity_id = :entity_id
    AND YA.isDeleted = false
    AND AYD.employee_id = :employee_id
    AND AYD.isDeleted = false;

        `;

        const assessmentsData = await db.sequelize.query(assessmentsQuery, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { entity_id, employee_id, filter_fy }
        });

        if (assessmentsData.length === 0) {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }

        const validStatuses = [
            "Committee Review Completed",
            "Manager Review Completed",
            "Pending For Manager Review",
            "Pending Committee Review",
            "Pending For Approval",
            "Approval Review Completed"
        ];

        // Assign default status if it is not valid
        for (const assessment of assessmentsData) {
            if (!validStatuses.includes(assessment.status)) {
                assessment.status = 'Pending For Self Assessment';
            }
        }

        return res.status(200).send({ code: 200, message: "All Data Retrieved", data: assessmentsData });

    } catch (error) {
        console.error("Error in getAll_Assessment:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getAll_Manager_Assessment = async (req, res) => {
    try {
        const entity_id = req.params.id;
        const { employee_id, filter_fy } = req.query;

        const assessmentsQuery = `
        SELECT 
            PSA.id, 
            PYAS.id AS assessment_id,
            PYAS.assessment_name, 
            PSA.status,
            PSA.yearly_assessment_id,
            PYAS.start_date, 
            PYAS.end_date, 
            PYAS.financial_year_id, 
            PSA.user_id, 
            HRU.first_name,
            HRU.employee_code,
            HRU.department_id,
            HRU.area_id,
            HRU.reporting_manager_id,
            MFY.financial_year  
        FROM 
            PM_SUBMITTED_ASSESSMENT AS PSA
        INNER JOIN 
            PM_YEARLY_ASSESSMENT_SETUP AS PYAS ON PSA.yearly_assessment_id = PYAS.id
        LEFT JOIN 
            MASTER_FINANCIAL_YEAR AS MFY ON PYAS.financial_year_id = MFY.id
        LEFT JOIN 
            HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PSA.user_id
        INNER JOIN 
            MASTER_DEPARTMENT AS MD ON HRU.department_id = MD.dept_id
        INNER JOIN 
            MASTER_AREA AS MA ON HRU.area_id = MA.id
        WHERE 
            PSA.financial_year_id = :filter_fy  
            AND PSA.entity_id = :entity_id 
            AND PSA.isDeleted = false
            AND HRU.reporting_manager_id = :employee_id
    `;

        const assessmentsData = await db.sequelize.query(assessmentsQuery, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { entity_id, employee_id, filter_fy }
        });

        return res.status(200).send({ code: 200, message: "All Data Retrieved", data: assessmentsData });

    } catch (error) {
        console.error("Error in getAll_Manager_Assessment:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.getAll_Approval_Manager = async (req, res) => {
    try {
        const entity_id = req.params.id;
        const { employee_id, filter_fy } = req.query;
        if (!employee_id || !filter_fy) {
            return res.status(400).send({ code: 400, message: "employee_id and filter_fy are required." });
        }

        // SQL query to fetch the assessments where approval_manager_id matches the employee_id
        const assessmentsQuery = `
            SELECT 
                PSA.id, 
                PYAS.id AS assessment_id,
                PYAS.assessment_name, 
                PSA.status,
                PSA.yearly_assessment_id,
                PYAS.start_date, 
                PYAS.end_date, 
                PYAS.financial_year_id, 
                PSA.user_id, 
                HRU.first_name,
                HRU.employee_code,
                HRU.department_id,
                HRU.area_id,
                HRU.approval_manager_id,
                MFY.financial_year  
            FROM 
                PM_SUBMITTED_ASSESSMENT AS PSA
            INNER JOIN 
                PM_YEARLY_ASSESSMENT_SETUP AS PYAS ON PSA.yearly_assessment_id = PYAS.id
            LEFT JOIN 
                MASTER_FINANCIAL_YEAR AS MFY ON PYAS.financial_year_id = MFY.id
            LEFT JOIN 
                HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PSA.user_id
            INNER JOIN 
                MASTER_DEPARTMENT AS MD ON HRU.department_id = MD.dept_id
            INNER JOIN 
                MASTER_AREA AS MA ON HRU.area_id = MA.id
            WHERE 
                PSA.financial_year_id = :filter_fy  
                AND PSA.entity_id = :entity_id 
                AND PSA.isDeleted = false
                AND HRU.approval_manager_id = :employee_id
        `;
        const assessmentsData = await db.sequelize.query(assessmentsQuery, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { entity_id, employee_id, filter_fy }
        });

        if (assessmentsData.length === 0) {
            return res.status(404).send({ code: 404, message: "No assessments found for the given criteria." });
        }

        // Return the retrieved assessments
        return res.status(200).send({
            code: 200,
            message: "All Data Retrieved",
            data: assessmentsData
        });

    } catch (error) {
        console.error("Error in getAll_Manager_Assessment:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getAll_kpaSelfAssessment = async (req, res) => {
    try {
        const entity_id = req.params.id;
        const financial_year_id = req.query.financial_id;
        const employee_id = req.query.employee_id;

        // Query to get probation status and end date from HRMS_REGISTERED_USER
        const employeeDetailsQuery = `
            SELECT 
                K.probation_employee, 
                HRU.end_date_probation
            FROM HRMS_KPA_MASTER AS K
            LEFT JOIN HRMS_REGISTERED_USER AS HRU
                ON HRU.employee_id = ${employee_id}
            WHERE K.entity_id = ${entity_id} 
                AND K.financial_year_id = ${financial_year_id}
                AND K.isDeleted = false
            LIMIT 1;
        `;

        const employeeDetails = await db.sequelize.query(employeeDetailsQuery, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (employeeDetails.length === 0) {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }

        const { probation_employee, end_date_probation } = employeeDetails[0];
        const today = new Date().toISOString().split('T')[0];

        // Main query to get all KPAs
        const query = `
            SELECT DISTINCT
                K.activity,
                K.id, 
                HKO.objective_name,
                K.kpi_data, 
                MFY.financial_year,
                K.probation_employee, 
                HRU.end_date_probation
            FROM HRMS_KPA_MASTER AS K 
            LEFT JOIN HRMS_KPA_OBJECTIVE AS HKO
                ON K.objective_id = HKO.id
            LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY
                ON K.financial_year_id = MFY.id
            LEFT JOIN HRMS_REGISTERED_USER AS HRU
                ON HRU.employee_id = ${employee_id}
            WHERE 
                K.entity_id = ${entity_id} 
                AND K.financial_year_id = ${financial_year_id}
                AND K.isDeleted = false
                AND K.status = 'ACTIVE'
                AND (
                    (K.aplicable_for = 'Department_User')
                    OR (K.aplicable_for = 'Selected_User' AND K.id IN (
                        SELECT KPE.kpa_master_id 
                        FROM HRMS_KPA_EMPLOYEE AS KPE 
                        WHERE KPE.employee_id = ${employee_id} 
                        AND KPE.isDeleted = false
                    ))
                );
        `;

        let getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        getAllData = getAllData.filter(data => {
            if (probation_employee && data.probation_employee) {
                return !(data.end_date_probation && new Date(data.end_date_probation) > new Date(today));
            }
            return true;
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.get_SelfAssessmentEmployee = async (req, res) => {
    try {
        const entity_id = req.params.id;
        const { employee_id, id } = req.query

        const query = `
            SELECT
                U.first_name,
                U.last_name,
                U.employee_code,
                MA.area_name,
                D.department_name,
                U.reporting_manager,
                PYAS.start_date,
                PYAS.end_date
            FROM HRMS_REGISTERED_USER AS U
            LEFT JOIN MASTER_AREA AS MA
                ON U.area_id = MA.id
            LEFT JOIN PM_YEARLY_ASSESSMENT_SETUP AS PYAS 
                ON PYAS.id = ${id}
            LEFT JOIN MASTER_DEPARTMENT AS D
                ON U.department_id = D.dept_id
            LEFT JOIN HRMS_REGISTERED_USERS_ENTITY AS UE
                ON U.employee_id = UE.employee_id  
            WHERE UE.entity_id = ${entity_id} 
                AND UE.employee_id = ${employee_id} 
                AND U.isDeleted = false;
        `;

        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.submitAssessment = async (req, res) => {
    const { financial_id, entity_id, employee_id, technical_average_rating, behavioural_average_rating } = req.body.endpoints;
    const { skillDevelopmentForm, behaviorAssessment, technicalAssement, rating_status, yearly_assessment_id, remark } = req.body.body;


    try {
        let submittedData = await db.submitted_assessment.create({
            status: rating_status,
            yearly_assessment_id: yearly_assessment_id,
            remark: remark,
            user_id: employee_id,
            financial_year_id: financial_id,
            entity_id: entity_id
        })

        if (technicalAssement.technicalItems && technicalAssement.technicalItems.length > 0) {
            const techAssessment = technicalAssement.technicalItems.map(
              (element) => ({
                self_rating_id: element.self_rating_id,
                submit_assessment_id: submittedData.id,
                financial_year_id: financial_id,
                entity_id: entity_id,
                employee_id: employee_id,
                kpa_id: element.kpa_id,
                technical_average_rating: technical_average_rating,
                self_remark: element.self_remark,
                self_attachment: element.self_attachment,
              })
            );
            await db.technical_assessment.bulkCreate(techAssessment);
        }

        if (behaviorAssessment.behaviorItems && behaviorAssessment.behaviorItems.length > 0) {
            const newBehaviorAssessment = behaviorAssessment.behaviorItems.map(element => ({
                competence: element.Competence,
                self_rating: element.self_rating_id,
                financial_year_id: financial_id,
                entity_id: entity_id,
                employee_id: employee_id,
                submit_assessment_id: submittedData.id,
                behavioural_average_rating: behavioural_average_rating,
            }));

            await db.behaviour.bulkCreate(newBehaviorAssessment);
        }

        if (skillDevelopmentForm.items && skillDevelopmentForm.items.length > 0) {
            const newSkillDevelopmentForm = skillDevelopmentForm.items.map(element => ({
                need_for_development: element.development,
                action_plan: element.action_plan,
                initiate_date: element.initiate_date,
                end_date: element.end_date,
                file_document: element.files,
                financial_year_id: financial_id,
                entity_id: entity_id,
                employee_id: employee_id,
                submit_assessment_id: submittedData.id,
            }));

            await db.skillDevelopment.bulkCreate(newSkillDevelopmentForm);
        }

        if (behaviorAssessment || skillDevelopmentForm || technicalAssement) {
            return res.status(200).send({ code: 200, message: "Saved Successfully!" });
        } else {
            const errorMessage = "Not able to Save!";
            return res.status(404).send({ code: 404, message: errorMessage });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}



exports.getSubmit_SelfAssessment = async (req, res) => {
    try {
        const entity_id = Number(req.params.id);
        const financial_year_id = req.query.financial_id;
        const employee_id = Number(req.query.employee_id);
        const submit_assessment_id = Number(req.query.submit_assessment_id);

        const getAllBehavior = await db.behaviour.findAll({
            where: { entity_id, employee_id, financial_year_id, submit_assessment_id: submit_assessment_id, isDeleted: false }
        });

        if (getAllBehavior.length === 0) {
            return res.status(404).send({ code: 404, message: "Behavior records not found !" });
        }

        const getSkillDevelopment = await db.skillDevelopment.findAll({
            where: { entity_id, employee_id, financial_year_id, submit_assessment_id: submit_assessment_id, isDeleted: false }
        });

        if (getSkillDevelopment.length === 0) {
            return res.status(404).send({ code: 404, message: "Skill development records not found !" });
        }

        const getKpaMaster = await db.technical_assessment.findAll({
            where: { entity_id, employee_id, financial_year_id, submit_assessment_id: submit_assessment_id, isDeleted: false }
        });

        if (getKpaMaster.length === 0) {
            return res.status(404).send({ code: 404, message: "Technical assessment records not found !" });
        }

        return res.status(200).send({
            code: 200,
            message: "All self assessment data retrieved successfully !",
            data: { getAllBehavior, getSkillDevelopment, getKpaMaster }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.get_by_id_self_assessment = async (req, res) => {
    try {
        const { entity_id, filter_fy, yearly_assessment_id, employee_id, login_id } = req.query;
        const query = `
    SELECT DISTINCT
        psa.id AS submitted_assessment_id,
        psa.status,
        psa.remark,
        psa.createdAt,
        psa.updatedAt,
        CONCAT(hru.first_name, ' ', hru.last_name) AS first_name,
        hru.last_name,
        hru.employee_code,
        ma.area_name,
        md.department_name,
        hru.reporting_manager,
        ebva.id AS behavioral_assessment_id,
        ebva.competence,
        ebva.self_rating AS self_rating_id,
        ebva.manager_self_rating,
        ebva.final_rating AS behave_final_rating,
        ersa.self_rating AS self_rating,
        esdp.id AS skill_development_id,
        esdp.need_for_development,
        esdp.action_plan,
        esdp.initiate_date,
        esdp.end_date AS end_date_skill,
        esdp.file_document,
        essdp.id AS suggest_skill_development_id,
        essdp.need_for_development AS suggest_need_for_development,
        ecau.id AS committee_assign_user_id,
        ecau.role_master_id,
        ecau.assign_user_id AS committee_user_id,
        ecau.submit_assessment_id AS committee_submit_id,
        ecau.employee_id AS committee_employee_id,
        ecau.login_id AS committee_login_id,
        ecau.status AS committee_status,
        hrm.role_master_name AS committee_role_name,
        hrua.first_name AS assign_user_first_name,
        hrua.last_name AS assign_user_last_name,
        eta.id AS technical_assessment_id,
        hkm.id AS kpa_master_id,
        hkm.activity AS kpa_activity,
        hkm.kpi_data AS kpa_kpi_data,
        hkm.aplicable_for AS kpa_applicable_for,
        hkm.objective_id,
        hko.objective_name,
        eta.self_rating_id AS kpa_self_rating_id,
        esrak.self_rating AS kpa_self_rating,
        eta.self_remark AS kpa_self_remark,
        eta.self_attachment AS kpa_self_attachment,
        eta.manager_rating_id,
        eta.final_rating,
        ecar.assign_user_id,
        ecr.id AS colleague_review_id,
        ecr.competence AS colleague_competence,
        ecr.self_rating_id AS colleague_self_rating_id,
        ersa_a_a.self_rating AS colleague_self_rating,
        ersa_a_a.self_rating_value AS colleague_self_rating_value,
        ecar.id AS committee_review_id,
        ecar.assign_user_id AS committee_review_assign_userid,
        ecar.submit_assessment_id AS committee_submitted_id,
        ecar.entity_id AS committee_entity_id,
        ecar.financial_year_id AS committee_financial_year_id, 
        ecar.competence AS committee_competence,
        ecar.self_rating_id AS committee_self_rating_id,
        ecar.remark AS committee_remark,
        ersa_a.self_rating AS committee_self_rating,
        pyas.start_date,
        pyas.end_date,
        pyas.assessment_name,
        psa.entity_id,
        psa.yearly_assessment_id,
        psa.financial_year_id,
        psa.user_id AS employee_id,
        psa.manager_review_date,
        psa.manager_remark,
        eta.approval_manager_rating_Id,
        ebva.approval_m_r_id
    FROM
        PM_SUBMITTED_ASSESSMENT psa
    INNER JOIN 
        PM_YEARLY_ASSESSMENT_SETUP pyas ON pyas.id = :yearly_assessment_id
    INNER JOIN 
        HRMS_REGISTERED_USER hru ON hru.employee_id = psa.user_id
    INNER JOIN 
        MASTER_AREA ma ON hru.area_id = ma.id
    INNER JOIN 
        MASTER_DEPARTMENT md ON hru.department_id = md.dept_id
    INNER JOIN 
        ESS_BEHAVIORAL_VL_ASSESSMENT ebva ON psa.id = ebva.submit_assessment_id AND ebva.isDeleted = 0
    INNER JOIN 
        ESS_SKILL_DEVELOPMENT_PLAN esdp ON psa.id = esdp.submit_assessment_id AND esdp.isDeleted = 0
    INNER JOIN 
        ESS_TECHNICAL_ASSESSMENT eta ON psa.id = eta.submit_assessment_id AND eta.isDeleted = 0
    INNER JOIN 
        HRMS_KPA_MASTER hkm ON eta.kpa_id = hkm.id AND hkm.isDeleted = 0
    INNER JOIN 
        ESS_SELF_RATING_ASSESSMENT ersa ON ebva.self_rating = ersa.id
    INNER JOIN 
        HRMS_KPA_OBJECTIVE hko ON hkm.objective_id = hko.id
    INNER JOIN 
        ESS_SELF_RATING_ASSESSMENT esrak ON eta.self_rating_id = esrak.id
    LEFT JOIN 
        ESS_SUGGEST_SKILL_DEVELOPMENT_PLAN essdp ON psa.id = essdp.submit_assessment_id AND essdp.isDeleted = 0
    LEFT JOIN
        ESS_COMMITTEE_ASSIGN_USER ecau ON psa.id = ecau.submit_assessment_id AND ecau.isDeleted = 0
    LEFT JOIN
        HRMS_RBAC_ROLE_MASTER hrm ON ecau.role_master_id = hrm.role_master_id
    LEFT JOIN 
        HRMS_REGISTERED_USER hrua ON hrua.employee_id = ecau.assign_user_id
    LEFT JOIN ESS_COMMITTEE_ASSESSMENT_RATING ecar ON psa.id = ecar.submit_assessment_id AND ecar.isDeleted = 0
        ${login_id ? "AND ecar.assign_user_id = :login_id" : ""} 
    LEFT JOIN 
        ESS_SELF_RATING_ASSESSMENT ersa_a ON ecar.self_rating_id = ersa_a.id
    LEFT JOIN 
        ESS_COLLEAGUE_REVIEW ecr ON psa.id = ecr.submit_assessment_id 
        AND ecr.isDeleted = 0
        AND ecr.yearly_assessment_id = :yearly_assessment_id
        AND ecr.entity_id = :entity_id
        AND ecr.filter_fy = :filter_fy
    LEFT JOIN 
        ESS_SELF_RATING_ASSESSMENT ersa_a_a ON ecr.self_rating_id = ersa_a_a.id
    WHERE
        psa.entity_id = :entity_id
        AND psa.yearly_assessment_id = :yearly_assessment_id
        AND psa.financial_year_id = :filter_fy
        AND psa.isDeleted = 0
        AND hru.employee_id = :employee_id
`;

        const replacements = { entity_id, yearly_assessment_id, filter_fy, employee_id };
        if (login_id) {
            replacements.login_id = login_id;
        }

        const results = await db.sequelize.query(query, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (results.length === 0) {
            return res.status(404).send({ code: 404, message: "Assessment records not found!" });
        }

        const getUniqueById = (items, idKey) => {
            const seen = new Set();
            return items.filter(item => {
                const id = item[idKey];
                if (seen.has(id) || !id) return false;
                seen.add(id);
                return true;
            });
        };

        const committeeAssignUsers = getUniqueById(results.map(item => ({
            committee_assign_user_id: item.committee_assign_user_id,
            committee_submit_assessment_id: item.committee_submit_id,
            role_master_id: item.role_master_id,
            role_name: item.committee_role_name,
            assign_user_id: item.committee_user_id,
            assign_user_first_name: item.assign_user_first_name,
            assign_user_last_name: item.assign_user_last_name,
            committee_employee_id: item.committee_employee_id,
            committee_login_id: item.committee_login_id,
            committee_status: item.committee_status
        })), 'committee_assign_user_id');

        const reviewPromises = committeeAssignUsers.map(async (user) => {
            const reviews = await db.committee_assess_rating.findAll({
                where: { assign_user_id: user.assign_user_id, submit_assessment_id: user.committee_submit_assessment_id, }
            });
            return { ...user, committee_reviews: reviews };
        });

        const committeeAssignUsersWithReviews = await Promise.all(reviewPromises);
        const assessmentData = {
          submitted_assessment_id: results[0].submitted_assessment_id,
          status: results[0].status,
          remark: results[0].remark,
          first_name: results[0].first_name,
          last_name: results[0].last_name,
          employee_code: results[0].employee_code,
          area_name: results[0].area_name,
          department_name: results[0].department_name,
          reporting_manager: results[0].reporting_manager,
          start_date: results[0].start_date,
          end_date: results[0].end_date,
          assessment_name: results[0].assessment_name,
          manager_review_date: results[0].manager_review_date,
          manager_remark: results[0].manager_remark,
          behavioral_assessments:
            getUniqueById(
              results.map((item) => ({
                behavioral_assessment_id: item.behavioral_assessment_id,
                competence: item.competence,
                self_rating_id: item.self_rating_id,
                self_rating: item.self_rating,
                manager_self_rating: item.manager_self_rating,
                final_rating: item.behave_final_rating,
                approval_manager_rating_Id: item.approval_m_r_id,
              })),
              "behavioral_assessment_id"
            ) || [],
          skill_development_plans:
            getUniqueById(
              results.map((item) => ({
                skill_development_id: item.skill_development_id,
                need_for_development: item.need_for_development,
                action_plan: item.action_plan,
                initiate_date: item.initiate_date,
                end_date: item.end_date_skill,
                file_document: item.file_document,
              })),
              "skill_development_id"
            ) || [],
          suggest_skill_development_plans:
            getUniqueById(
              results.map((item) => ({
                suggest_skill_development_id: item.suggest_skill_development_id,
                need_for_development: item.suggest_need_for_development,
              })),
              "suggest_skill_development_id"
            ) || [],
          technical_assessments:
            getUniqueById(
              results.map((item) => ({
                technical_assessment_id: item.technical_assessment_id,
                kpa_master_id: item.kpa_master_id,
                kpa_activity: item.kpa_activity,
                kpa_kpi_data: item.kpa_kpi_data,
                kpa_applicable_for: item.kpa_applicable_for,
                kpa_objective_id: item.objective_id,
                kpa_objective_name: item.objective_name,
                kpa_self_rating_id: item.kpa_self_rating_id,
                kpa_self_rating: item.kpa_self_rating,
                kpa_self_attachment:
                  item.kpa_self_attachment,
                kpa_self_remark: item.kpa_self_remark,
                kpa_manager_rating_id: item.manager_rating_id,
                kpa_final_rating: item.final_rating,
                approval_manager_rating_Id: item.approval_manager_rating_Id,
              })),
              "technical_assessment_id"
            ) || [],
          committee_assign_user: committeeAssignUsersWithReviews,
          committee_reviews:
            getUniqueById(
              results.map((item) => ({
                committee_review_id: item.committee_review_id,
                committee_review_assign_userid:
                  item.committee_review_assign_userid,
                committee_competence: item.committee_competence,
                committee_remark: item.committee_remark,
                committee_self_rating: item.committee_self_rating,
                committee_self_rating_id: item.committee_self_rating_id,
              })),
              "committee_review_id"
            ) || [],
          colleague_reviews:
            getUniqueById(
              results.map((item) => ({
                colleague_review_id: item.colleague_review_id,
                colleague_competence: item.colleague_competence,
                colleague_self_rating_id: item.colleague_self_rating_id,
                colleague_self_rating: item.colleague_self_rating,
                colleague_self_rating_value: item.colleague_self_rating_value,
              })),
              "colleague_review_id"
            ) || [],
          entity_id: results[0].entity_id,
          yearly_assessment_id: results[0].yearly_assessment_id,
          financial_year_id: results[0].financial_year_id,
          employee_id: results[0].employee_id,
        };

        return res.status(200).send({
            code: 200,
            message: "Self-assessment data retrieved successfully!",
            data: assessmentData
        });

    } catch (error) {
        
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.updateSubmit_SelfAssessment = async (req, res) => {
    try {
        let { entity_id, financial_id, employee_id, technical_average_rating, behavioural_average_rating } = req.body.endpoints


        let { skillDevelopmentForm, behaviorAssessment, technicalAssement, suggestSkillDevelopmentForm, submitted_assessment_id, rating_status, yearly_assessment_id, remark, manager_remark, date } = req.body.body;
        console.log(req.body.body)
        let dateStr
        if (date) {
            dateStr = moment(date, 'DD-MM-YYYY').toDate();
        }

        // return;

        if (behaviorAssessment && behaviorAssessment.behaviorItems && behaviorAssessment.behaviorItems.length > 0) {
            await db.behaviour.destroy({
                where: {
                    submit_assessment_id: submitted_assessment_id,
                    employee_id: employee_id,
                    entity_id: entity_id,
                    financial_year_id: financial_id,
                    isDeleted: false
                }
            });
        }

        if (skillDevelopmentForm && skillDevelopmentForm.items && skillDevelopmentForm.items.length > 0) {
            await db.skillDevelopment.destroy({
                where: {
                    submit_assessment_id: submitted_assessment_id,
                    employee_id: employee_id,
                    entity_id: entity_id,
                    financial_year_id: financial_id,
                    isDeleted: false
                }
            });
        }

        if (technicalAssement && technicalAssement.technicalItems && technicalAssement.technicalItems.length > 0) {
            await db.technical_assessment.destroy({
                where: {
                    submit_assessment_id: submitted_assessment_id,
                    employee_id: employee_id,
                    entity_id: entity_id,
                    financial_year_id: financial_id,
                    isDeleted: false
                }
            });
        }

        if (suggestSkillDevelopmentForm && suggestSkillDevelopmentForm && suggestSkillDevelopmentForm.length > 0) {
            await db.suggest_skillDevelopment.destroy({
                where: {
                    submit_assessment_id: submitted_assessment_id,
                    employee_id: employee_id,
                    entity_id: entity_id,
                    financial_year_id: financial_id,
                    isDeleted: false
                }
            });
        }

        if (behaviorAssessment && behaviorAssessment.behaviorItems && behaviorAssessment.behaviorItems.length > 0) {
            const newBehaviorAssessment = behaviorAssessment.behaviorItems.map(element => ({
                competence: element.Competence,
                self_rating: element.self_rating_id,
                financial_year_id: financial_id,
                entity_id,
                employee_id,
                submit_assessment_id: submitted_assessment_id,
                manager_self_rating: element.manager_rating_id,
                final_rating: element.final_rating,
                behavioural_average_rating: behavioural_average_rating,
                approval_m_r_id: element.approval_manager_rating_Id,


            }));

            await db.behaviour.bulkCreate(newBehaviorAssessment);

        }

        if (skillDevelopmentForm && skillDevelopmentForm.items && skillDevelopmentForm.items.length > 0) {
            const newSkillDevelopmentForm = skillDevelopmentForm.items.map(element => ({
                need_for_development: element.development,
                action_plan: element.action_plan,
                initiate_date: element.initiate_date,
                end_date: element.end_date,
                file_document: element.files,
                financial_year_id: financial_id,
                entity_id,
                employee_id,
                submit_assessment_id: submitted_assessment_id
            }));

            await db.skillDevelopment.bulkCreate(newSkillDevelopmentForm);
        }


        if (technicalAssement && technicalAssement.technicalItems && technicalAssement.technicalItems.length > 0) {
            const techAssessment = technicalAssement.technicalItems.map(element => ({
                self_rating_id: element.self_rating_id,
                submit_assessment_id: submitted_assessment_id,
                financial_year_id: financial_id,
                entity_id,
                employee_id,
                kpa_id: element.kpa_id,
                approval_manager_rating_Id: element.approval_manager_rating_Id,
                final_rating: element.final_rating,
                technical_average_rating: technical_average_rating,
                manager_rating_id: element.manager_rating_id,
                self_attachment: element.self_attachment,
                self_remark: element.self_remark
            }));

            // Log the processed data
            console.log('Technical Assessment Data:', techAssessment);

            await db.technical_assessment.bulkCreate(techAssessment);
        }

        if (suggestSkillDevelopmentForm && suggestSkillDevelopmentForm.suggestDevelopment && suggestSkillDevelopmentForm.suggestDevelopment.length > 0) {
            const suggest_skill = suggestSkillDevelopmentForm.suggestDevelopment.map(element => ({
                need_for_development: element.development,
                submit_assessment_id: submitted_assessment_id,
                financial_year_id: financial_id,
                entity_id,
                employee_id,
            }));

            await db.suggest_skillDevelopment.bulkCreate(suggest_skill);
        }



        if (rating_status || remark || dateStr || manager_remark) {
            await db.submitted_assessment.update({
                status: rating_status,
                remark: remark,
                manager_remark: manager_remark,
                manager_review_date: dateStr,

            }, {
                where: { id: submitted_assessment_id, yearly_assessment_id, entity_id, financial_year_id: financial_id, }
            });
        }

        if (rating_status === "Manager Review Completed") {
            return res.status(200).send({
                code: 200,
                message: "Manager assessment successfully!"
            })
        } else {
            return res.status(200).send({
                code: 200,
                message: "Self-assessment data updated successfully!"
            })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.assign_committee_user_for_assessment = async (req, res) => {
    try {
        let { entity_id, financial_id, status, employee_id, submitted_assessment_id, committee_assign_users, login_id } = req.body
        console.log(req.body)
        console.log(req.body)
        // return;
        if (committee_assign_users && committee_assign_users.length > 0) {
            const committee_review = committee_assign_users.map(element => ({
                role_master_id: element.designation_id,
                assign_user_id: element.employee_id,
                submit_assessment_id: submitted_assessment_id,
                financial_year_id: financial_id,
                entity_id,
                employee_id,
                login_id,
            }));

            await db.committee_assign_user.bulkCreate(committee_review);
        }

        if (status) {
            await db.submitted_assessment.update({
                status: status,
            }, {
                where: { id: submitted_assessment_id, entity_id, financial_year_id: financial_id, }
            });
        }

        return res.status(200).send({
            code: 200,
            message: "Send For Committee Review Successfully!"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.getall_total_team_member = async (req, res) => {
    try {
        const { entity_id, employee_id } = req.query;

        const query = `
            SELECT 
                u.employee_id, 
                u.first_name, 
                u.last_name, 
                u.role_master_name, 
                u.employee_official_email, 
                u.reporting_manager_id,
                rm.first_name AS manager_first_name,
                rm.last_name AS manager_last_name
            FROM HRMS_REGISTERED_USER u
            JOIN HRMS_REGISTERED_USERS_ENTITY ue ON u.employee_id = ue.employee_id
            INNER JOIN HRMS_REGISTERED_USER rm ON u.reporting_manager_id = rm.employee_id
            WHERE u.reporting_manager_id = :employee_id 
              AND ue.entity_id = :entity_id 
              AND u.isDeleted = false
              AND u.status = 'ACTIVE'
        `;

        const results = await db.sequelize.query(query, {
            replacements: { employee_id, entity_id },
            type: db.sequelize.QueryTypes.SELECT
        });

        return res.status(200).send({
            code: 200,
            message: "Success",
            total_team_members: results.length,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};






















// exports.getAll_Assessment = async (req, res) => {
//     try {
//         const entity_id = req.params.id;
//         const { employee_id, filter_fy } = req.query;
//         const assessmentsQuery = `
//             SELECT 
//                 YA.id, 
//                 YA.assessment_name, 
//                 YA.start_date, 
//                 YA.end_date, 
//                 YA.financial_year_id, 
//                 YA.employee_id, 
//                 HRU.first_name,
//                 HRU.employee_code,
//                 HRU.department_id,
//                 HRU.area_id,
//                 HRU.reporting_manager_id,
//                 MFY.financial_year,
//                 COALESCE(PSA.status, 'Pending For Self Assessment') AS status
//             FROM 
//                 PM_YEARLY_ASSESSMENT_SETUP AS YA
//             LEFT JOIN 
//                 PM_SUBMITTED_ASSESSMENT AS PSA ON PSA.user_id = :employee_id 
//                 AND PSA.entity_id = :entity_id
//                 AND PSA.financial_year_id = YA.financial_year_id
//                 AND PSA.yearly_assessment_id = YA.id
//                 AND PSA.isDeleted = false
//             LEFT JOIN 
//                 MASTER_FINANCIAL_YEAR AS MFY ON YA.financial_year_id = MFY.id
//             LEFT JOIN 
//                 HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = YA.employee_id
//             INNER JOIN 
//                 MASTER_DEPARTMENT AS MD ON HRU.department_id = MD.dept_id
//             INNER JOIN 
//                 MASTER_AREA AS MA ON HRU.area_id = MA.id
//             WHERE 
//                 YA.filter_fy = :filter_fy  
//                 AND YA.entity_id = :entity_id 
//                 AND YA.isDeleted = false;
//         `;

//         const assessmentsData = await db.sequelize.query(assessmentsQuery, {
//             type: db.sequelize.QueryTypes.SELECT,
//             replacements: { entity_id, employee_id, filter_fy }
//         });

//         if (assessmentsData.length === 0) {
//             return res.status(404).send({ code: 404, message: "Records not found" });
//         }

//         const validStatuses = [
//             "Committee Review Completed",
//             "Manager Review Completed",
//             "Pending For Manager Review",
//             "Pending Committee Review",
//             "Pending For Approval",
//             "Approval Review Completed"
//         ];

//         // Assign statuses to assessments
//         for (const assessment of assessmentsData) {
//             if (!validStatuses.includes(assessment.status)) {
//                 assessment.status = 'Pending For Self Assessment';
//             }
//         }

//         return res.status(200).send({ code: 200, message: "All Data Retrieved", data: assessmentsData });

//     } catch (error) {
//         console.error("Error in getAll_Assessment:", error);
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// };



// exports.getAll_Assessment = async (req, res) => {
//     try {
//         const entity_id = req.params.id;
//         const { employee_id, filter_fy } = req.query;

//         const assessmentsQuery = `
//             SELECT 
//                 YA.id, 
//                 YA.assessment_name, 
//                 YA.start_date, 
//                 YA.end_date, 
//                 YA.financial_year_id, 
//                 YA.employee_id, 
//                 HRU.first_name,
//                 HRU.employee_code,
//                 HRU.department_id,
//                 HRU.area_id,
//                 HRU.reporting_manager_id,
//                 MFY.financial_year,
//                 COALESCE(PSA.status, 'Pending For Self Assessment') AS status,
//                 AYD.dept_id AS department_id,
//                 AYD.employee_id AS department_employee_id 
//             FROM 
//                 PM_YEARLY_ASSESSMENT_SETUP AS YA
//             LEFT JOIN 
//                 PM_SUBMITTED_ASSESSMENT AS PSA ON PSA.user_id = :employee_id 
//                 AND PSA.entity_id = :entity_id
//                 AND PSA.financial_year_id = YA.financial_year_id
//                 AND PSA.yearly_assessment_id = YA.id
//                 AND PSA.isDeleted = false
//             LEFT JOIN 
//                 MASTER_FINANCIAL_YEAR AS MFY ON YA.financial_year_id = MFY.id
//             LEFT JOIN 
//                 HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = YA.employee_id
//             INNER JOIN 
//                 MASTER_DEPARTMENT AS MD ON HRU.department_id = MD.dept_id
//             INNER JOIN 
//                 MASTER_AREA AS MA ON HRU.area_id = MA.id
//             LEFT JOIN 
//                 PM_YEARLY_ASSESSMENT_DEPARTMENT AS AYD ON 1=1  
//             WHERE 
//                 YA.filter_fy = :filter_fy  
//                 AND YA.entity_id = :entity_id   
//                 AND YA.isDeleted = false;
//         `;

//         const assessmentsData = await db.sequelize.query(assessmentsQuery, {
//             type: db.sequelize.QueryTypes.SELECT,
//             replacements: { entity_id, employee_id, filter_fy }
//         });

//         if (assessmentsData.length === 0) {
//             return res.status(404).send({ code: 404, message: "Records not found" });
//         }

    
//         const uniqueAssessments = [];
//         const seenDepartmentEmployeeIds = new Set();

//         for (const assessment of assessmentsData) {
//             if (!seenDepartmentEmployeeIds.has(assessment.department_employee_id)) {
//                 seenDepartmentEmployeeIds.add(assessment.department_employee_id);
//                 uniqueAssessments.push(assessment);
//             }
//         }

//         const validStatuses = [
//             "Committee Review Completed",
//             "Manager Review Completed",
//             "Pending For Manager Review",
//             "Pending Committee Review",
//             "Pending For Approval",
//             "Approval Review Completed"
//         ];

    
//         for (const assessment of uniqueAssessments) {
//             if (!validStatuses.includes(assessment.status)) {
//                 assessment.status = 'Pending For Self Assessment';
//             }
//         }

//         return res.status(200).send({ code: 200, message: "All Data Retrieved", data: uniqueAssessments });

//     } catch (error) {
//         console.error("Error in getAll_Assessment:", error);
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// };