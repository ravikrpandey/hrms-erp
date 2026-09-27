const db = require('../../models/index');
const logger = require('../../../logger/index');
const { QueryTypes } = require('sequelize'); // Import QueryTypes from sequelize
const committee_approved_model = require('../../ESS/Self_Assessment/model/committee_approved_model');



exports.getall_assessment_dept_wise = async (req, res) => {
    try {
        const { entity_id, filter_fy, yearly_assessment_id } = req.query;

        if (!entity_id || !filter_fy || !yearly_assessment_id) {
            return res.status(400).send({ code: 400, message: "Missing required query parameters." });
        }

        const query = `
            SELECT 
                u.employee_id, 
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                u.role_master_name, 
                u.employee_official_email, 
                md.dept_id AS department_id,
                md.department_name,
                COUNT(CASE WHEN psa.status = 'Committee Review Completed' THEN 1 END) AS completed_assessment,
                COUNT(CASE WHEN psa.status IN ('Pending For Manager Review', 'Manager Review Completed') THEN 1 END) AS pending_review_assessment,
                COUNT(CASE WHEN psa.status IN ('Pending For Manager Review') THEN 1 END) AS pending_manager_review,
                COUNT(CASE WHEN psa.status IN ('Manager Review Completed') THEN 1 END) AS pending_commitee_review,
                COUNT(CASE WHEN psa.status IS NULL THEN 1 END) AS pending_self_assessment,
                COUNT(psa.id) AS all_submitted_num
            FROM HRMS_REGISTERED_USER u
            JOIN HRMS_REGISTERED_USERS_ENTITY ue ON u.employee_id = ue.employee_id
            JOIN MASTER_DEPARTMENT md ON u.department_id = md.dept_id
            LEFT JOIN PM_SUBMITTED_ASSESSMENT psa ON u.employee_id = psa.user_id
                AND psa.yearly_assessment_id = :yearly_assessment_id
                AND psa.entity_id = :entity_id
                AND psa.financial_year_id = :filter_fy
                AND psa.isDeleted = false
            WHERE 
                ue.entity_id = :entity_id 
                AND u.isDeleted = false
                AND u.status = 'ACTIVE'
            GROUP BY u.employee_id, md.dept_id, md.department_name
        `;

        const results = await db.sequelize.query(query, {
            replacements: { entity_id, filter_fy, yearly_assessment_id },
            type: db.sequelize.QueryTypes.SELECT
        });

        const departmentData = results.reduce((acc, employee) => {
            const departmentId = employee.department_id;
            const departmentName = employee.department_name;

            if (!acc[departmentId]) {
                acc[departmentId] = {
                    department_id: departmentId,
                    department_name: departmentName,
                    no_of_employee: 0,
                    completed_assessment: 0,
                    pending_assessment: 0,
                    pending_self_assessment: 0,
                    pending_manager_review: 0,
                    pending_commitee_review: 0,
                };
            }

            acc[departmentId].no_of_employee += 1;
            acc[departmentId].completed_assessment += parseInt(employee.completed_assessment) || 0;
            acc[departmentId].pending_assessment += parseInt(employee.pending_review_assessment) + parseInt(employee.pending_self_assessment) || 0;
            acc[departmentId].pending_self_assessment += parseInt(employee.pending_self_assessment) || 0;
            acc[departmentId].pending_manager_review += parseInt(employee.pending_manager_review) || 0;
            acc[departmentId].pending_commitee_review += parseInt(employee.pending_commitee_review) || 0;

            return acc;
        }, {});

        const responseData = Object.values(departmentData);

        return res.status(200).send({
            code: 200,
            message: "Data fetched successfully",
            data: responseData,
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_assessmentlist_by_dept = async (req, res) => {
    try {
        const { entity_id, filter_fy, yearly_assessment_id, department_id } = req.query;

        if (!entity_id || !filter_fy || !yearly_assessment_id) {
            return res.status(400).send({ code: 400, message: "Missing required query parameters." });
        }

        const query = `
            SELECT 
                u.employee_id, 
                CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
                u.employee_code,
                COALESCE(psa.status, 'Pending For Self Assessment') AS status, 
                psa.id AS submitted_assessment_id, -- Fetch the primary key of the submitted assessment
                u.role_master_name, 
                u.employee_official_email, 
                md.dept_id AS department_id,
                md.department_name,
                COUNT(CASE WHEN psa.status = 'Committee Review Completed' THEN 1 END) AS completed_assessment,
                COUNT(CASE WHEN psa.status IN ('Pending For Manager Review','Manager Review Completed') THEN 1 END) AS pending_review_assessment,
                COUNT(CASE WHEN psa.status IN ('Pending For Manager Review') THEN 1 END) AS pending_manager_review,
                COUNT(CASE WHEN psa.status IN ('Pending Committee Review') THEN 1 END) AS pending_commitee_review,
                COUNT(CASE WHEN psa.status IS NULL THEN 1 END) AS pending_self_assessment,
                COUNT(psa.id) AS all_submitted_num
            FROM HRMS_REGISTERED_USER u
            JOIN HRMS_REGISTERED_USERS_ENTITY ue ON u.employee_id = ue.employee_id
            JOIN MASTER_DEPARTMENT md ON u.department_id = md.dept_id
            LEFT JOIN PM_SUBMITTED_ASSESSMENT psa ON u.employee_id = psa.user_id
                AND psa.yearly_assessment_id = :yearly_assessment_id
                AND psa.entity_id = :entity_id
                AND psa.financial_year_id = :filter_fy
                AND psa.isDeleted = false
            WHERE 
                ue.entity_id = :entity_id 
                AND u.isDeleted = false
                AND u.status = 'ACTIVE'
                ${department_id ? 'AND md.dept_id = :department_id' : ''}
            GROUP BY u.employee_id, md.dept_id, md.department_name, psa.status, psa.id
        `;

        const replacements = { entity_id, filter_fy, yearly_assessment_id };
        if (department_id) replacements.department_id = department_id;

        const results = await db.sequelize.query(query, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        const departmentData = results.reduce((acc, employee) => {
            const departmentId = employee.department_id;
            const departmentName = employee.department_name;

            if (!acc[departmentId]) {
                acc[departmentId] = {
                    department_id: departmentId,
                    department_name: departmentName,
                    no_of_employee: 0,
                    completed_assessment: 0,
                    pending_assessment: 0,
                    pending_self_assessment: 0,
                    pending_manager_review: 0,
                    pending_commitee_review: 0,
                    user_data: []
                };
            }

            acc[departmentId].no_of_employee += 1;
            acc[departmentId].completed_assessment += parseInt(employee.completed_assessment) || 0;
            acc[departmentId].pending_assessment += parseInt(employee.pending_review_assessment) + parseInt(employee.pending_self_assessment) || 0;
            acc[departmentId].pending_self_assessment += parseInt(employee.pending_self_assessment) || 0;
            acc[departmentId].pending_manager_review += parseInt(employee.pending_manager_review) || 0;
            acc[departmentId].pending_commitee_review += parseInt(employee.pending_commitee_review) || 0;

            if (acc[departmentId].user_data.length < 6) {
                acc[departmentId].user_data.push({
                    employee_id: employee.employee_id,
                    employee_name: employee.employee_name,
                    employee_code: employee.employee_code,
                    status: employee.status,
                    submitted_assessment_id: employee.submitted_assessment_id
                });
            }

            return acc;
        }, {});

        const responseData = Object.values(departmentData);

        return res.status(200).send({
            code: 200,
            message: "Data fetched successfully",
            data: responseData,
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.getall_committee_review_list = async (req, res) => {
    try {
        const { entity_id, filter_fy, status, login_id } = req.query;

        if (!entity_id || !filter_fy || !status || !login_id) {
            return res.status(400).send({ code: 400, message: "Missing required query parameters." });
        }

        const query = `
            SELECT 
                ecu.id AS committee_assign_user_id,
                ecu.status AS committee_status,
                
                ecu.entity_id,
                ecu.financial_year_id,
                ecu.submit_assessment_id,
                ecu.employee_id,
                ecu.role_master_id,
                ecu.login_id,
                ecu.assign_user_id,
                psa.id AS submitted_assessment_id,
                psa.status AS submitted_assessment_status,
                psa.remark AS submitted_assessment_remark,
                mfy.financial_year,
            ecu.committee_rating_status,
                psa.manager_review_date,
                psa.manager_remark,
                fyas.id AS yearly_assessment_id,
                fyas.assessment_name,
                fyas.start_date AS assessment_start_date,
                fyas.end_date AS assessment_end_date,
                fyas.assessment_degree,
                CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                e.employee_code
            FROM 
                ESS_COMMITTEE_ASSIGN_USER ecu
            INNER JOIN 
                PM_SUBMITTED_ASSESSMENT psa ON ecu.submit_assessment_id = psa.id
            INNER JOIN 
                PM_YEARLY_ASSESSMENT_SETUP fyas ON psa.yearly_assessment_id = fyas.id
            INNER JOIN 
                    MASTER_FINANCIAL_YEAR mfy ON fyas.financial_year_id = mfy.id 
           INNER JOIN 
                HRMS_REGISTERED_USER e ON ecu.employee_id = e.employee_id
            WHERE 
                ecu.entity_id = :entity_id
                AND ecu.financial_year_id = :filter_fy
                AND ecu.assign_user_id = :login_id -- Filter by login_id
                AND ecu.isDeleted = 0
                AND (
                    psa.status = :status OR ecu.status = :status
                );
        `;

        const responseData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: {
                entity_id,
                filter_fy,
                status,
                login_id
            }
        });

        return res.status(200).send({
            code: 200,
            message: "Data fetched successfully",
            data: responseData,
        });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



exports.committee_user_self_assessment = async (req, res) => {
    try {
        const { 
            entity_id, 
            financial_id, 
            status, 
            remark, 
            submitted_assessment_id, 
            assign_user_id, 
            employee_id, 
            self_committee_review ,
            committee_average_rating,
        } = req.body;

        console.log(req.body); 
    //   return;  
        if (self_committee_review && self_committee_review.reviews && self_committee_review.reviews.length > 0) {
            const committee_assess_review = self_committee_review.reviews.map(element => ({
                competence: element.Competence,
                submit_assessment_id: submitted_assessment_id,
                assign_user_id: assign_user_id,
                entity_id: entity_id,
                self_rating_id: element.rating,
                financial_year_id: financial_id,
                employee_id: employee_id,
                remark: remark,
            }));

            await db.committee_assess_rating.bulkCreate(committee_assess_review);
        }

        await db.committee_assign_user.update(
            { committee_rating_status: 'CLOSE', committee_average_rating: committee_average_rating },
            {
                where: {
                    submit_assessment_id: submitted_assessment_id,
                    assign_user_id: assign_user_id,
                    entity_id: entity_id,
                    financial_year_id: financial_id,
                    isDeleted: false
                }
            }
        );

        const allStatus = await db.committee_assign_user.findAll({
            where: {
                submit_assessment_id: submitted_assessment_id,
                entity_id: entity_id,
                financial_year_id: financial_id,
                isDeleted: false
            }
        });

        const isAnyOpen = allStatus.some(item => item.committee_rating_status === 'OPEN');

        if (!isAnyOpen) {
            await db.submitted_assessment.update(
                { status: status },
                {
                    where: {
                        id: submitted_assessment_id,
                        entity_id: entity_id,
                        financial_year_id: financial_id,
                    }
                }
            );
        }

        return res.status(200).send({
            code: 200,
            message: "Send For Committee Review Successfully!"
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



