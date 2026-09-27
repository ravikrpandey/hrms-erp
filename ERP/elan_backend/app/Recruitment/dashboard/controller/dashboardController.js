const db = require("../../../models/index");
const { Op, where } = require("sequelize");
const path = require('path');
const { sendmailsforcompanydetails } = require("../../utils/mail/mail");
const logger = require('../../../../logger/index');

exports.getRecruitmentDashboard = async (req, res) => {
    try {
        const { entity_id, created_by } = req.params;
        const { fromMonth, toMonth, financial_id } = req.body;

        if (!entity_id || !fromMonth || !toMonth || !financial_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id, fromMonth, toMonth, financial_id are required'
            });
        }

        const fromMonthInt = parseInt(fromMonth, 10);
        const toMonthInt = parseInt(toMonth, 10);

        if (isNaN(fromMonthInt) || isNaN(toMonthInt)) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid month format. Please provide valid integers for fromMonth and toMonth'
            });
        }

        if (fromMonthInt < 1 || fromMonthInt > 12 || toMonthInt < 1 || toMonthInt > 12) {
            return res.status(400).send({
                code: 400,
                message: 'Months should be between 1 and 12'
            });
        }

        if (fromMonthInt > toMonthInt) {
            return res.status(400).send({
                code: 400,
                message: 'fromMonth cannot be greater than toMonth'
            });
        }

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: { id: financial_id }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const monthFilter = [
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.gte]: fromMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.lte]: toMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.eq]: financialYear.financial_year }
            )
        ];

        const totalJobRequisitions = await db.job_descripition.findAll({
            where: {
                entity_id: entity_id,
                financial_year_id: financial_id,
                created_by: created_by,
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalJobRequisitions === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No JD found for the specified months and financial year'
            });
        }

        const totalActiveJobRequisitions = await db.job_descripition.count({
            where: {
                entity_id: entity_id,
                financial_year_id: financial_id,
                created_by: created_by,
                job_status: 'Active',
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalActiveJobRequisitions === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No Active JD found for the specified months and financial year'
            });
        }

        const jobIds = totalJobRequisitions.map(data => data.id);

        const totalPipelineCandidates = await db.job_descripition_email.count({
            where: {
                job_descripition_id: jobIds,
                onboarding_status: 'PENDING',
            }
        });
      
       res.status(200).send({
            message: 'Recruitment dashboard data fetched successfully',
            data: {
                totalJobRequisitions: totalJobRequisitions.length,
                totalActiveJobRequisitions: totalActiveJobRequisitions,
                totalPipelineCandidates: totalPipelineCandidates,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};

module.exports.getRecruitmentsForCurrentMonth = async (req, res) => {
    try {
        const { entity_id, created_by } = req.params;

        const [totalRecruitments] = await db.sequelize.query(
            `SELECT COUNT(*) AS totalRecruitments
            FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL
            WHERE OL.entity_id = :entity_id
              AND OL.candidate_offer_status = 'ONBOARDED'
              AND OL.created_by = :created_by
              AND OL.approval_status = 'APPROVED'
              AND MONTH(OL.createdAt) = MONTH(CURRENT_DATE)
              AND YEAR(OL.createdAt) = YEAR(CURRENT_DATE)`,
            {
                replacements: { entity_id, created_by },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).send({
            message: "Total recruitments fetched successfully",
            data: totalRecruitments
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};
exports.getRecruitmentAverageTime = async (req, res) => {
    try {
        const { entity_id, created_by } = req.params;
        const { fromMonth, toMonth, financial_id } = req.body;

        if (!entity_id || !fromMonth || !toMonth || !financial_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id, fromMonth, toMonth, financial_id are required'
            });
        }

        const fromMonthInt = parseInt(fromMonth, 10);
        const toMonthInt = parseInt(toMonth, 10);

        if (isNaN(fromMonthInt) || isNaN(toMonthInt)) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid month format. Please provide valid integers for fromMonth and toMonth'
            });
        }

        if (fromMonthInt < 1 || fromMonthInt > 12 || toMonthInt < 1 || toMonthInt > 12) {
            return res.status(400).send({
                code: 400,
                message: 'Months should be between 1 and 12'
            });
        }

        if (fromMonthInt > toMonthInt) {
            return res.status(400).send({
                code: 400,
                message: 'fromMonth cannot be greater than toMonth'
            });
        }

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: { id: financial_id }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const monthFilter = [
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.gte]: fromMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.lte]: toMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.eq]: financialYear.financial_year }
            )
        ];

        const totalJobRequisitions = await db.job_descripition.findAll({
            where: {
                entity_id: entity_id,
                financial_year_id: financial_id,
                created_by: created_by,
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalJobRequisitions.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No JD found for the specified months and financial year'
            });
        }

        const jobIds = totalJobRequisitions.map(data => data.id);

        if (jobIds.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No valid job IDs found for the specified criteria'
            });
        }

        const [totalAverageToFill] = await db.sequelize.query(`
            SELECT 
                ROUND(AVG(DATEDIFF(E.updatedAt, JD.start_date)), 1) AS avg_days_to_fill
            FROM 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E
            LEFT JOIN 
                RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id = E.job_descripition_id
            WHERE 
                E.onboarding_status = 'COMPLETED'
                AND JD.id IN (:jobIds)`, {
            replacements: {
                jobIds: jobIds
            },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!totalAverageToFill || totalAverageToFill.avg_days_to_fill === null) {
            return res.status(404).send({
                code: 404,
                message: 'No data found for the specified job IDs or the dates are not valid'
            });
        }

        res.status(200).send({
            message: 'Recruitment average time data fetched successfully',
            data: {
                totalAverageToFill: totalAverageToFill.avg_days_to_fill 
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};

module.exports.getRecruitmentsTrends = async (req, res) => {
    try {
        const { entity_id, created_by, financial_id } = req.params;

          const financialYear = await db.financial_year.findOne({
                    attributes: ['id', 'financial_year'],
                    where: { id: financial_id }
                });
        
                if (!financialYear) {
                    return res.status(404).send({
                        code: 404,
                        message: 'Financial year not found'
                    });
                }

        // Define the query to get the count of onboarded people per month based on createdAt
        const recruitmentTrends = await db.sequelize.query(
            `
           SELECT 
    MONTH(JD.createdAt) AS month, 
    COALESCE(SUM(JD.number_of_positions), 0) AS total_positions
FROM 
    RECRUITMENT_JOB_DESCRIPITION JD
WHERE 
    JD.entity_id = :entity_id
    AND JD.created_by = :created_by
    AND JD.financial_year_id = :financial_id
GROUP BY 
    MONTH(JD.createdAt)
ORDER BY 
    MONTH(JD.createdAt) 
            `,
            {
                replacements: { entity_id, created_by, financial_id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        res.status(200).send({
            message: "Recruitment trends fetched successfully",
            data: recruitmentTrends
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};


exports.getRecruitmentPipelineFunnel = async (req, res) => {
    try {
        const { entity_id, created_by } = req.params;
        const { fromMonth, toMonth, financial_id } = req.body;

         if (!entity_id || !fromMonth || !toMonth || !financial_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id, fromMonth, toMonth, financial_id are required'
            });
        }

        const fromMonthInt = parseInt(fromMonth, 10);
        const toMonthInt = parseInt(toMonth, 10);

        if (isNaN(fromMonthInt) || isNaN(toMonthInt)) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid month format. Please provide valid integers for fromMonth and toMonth'
            });
        }

        if (fromMonthInt < 1 || fromMonthInt > 12 || toMonthInt < 1 || toMonthInt > 12) {
            return res.status(400).send({
                code: 400,
                message: 'Months should be between 1 and 12'
            });
        }

        if (fromMonthInt > toMonthInt) {
            return res.status(400).send({
                code: 400,
                message: 'fromMonth cannot be greater than toMonth'
            });
        }

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: { id: financial_id }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const monthFilter = [
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.gte]: fromMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.lte]: toMonthInt }
            ),
            db.Sequelize.where(
                db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')),
                { [db.Sequelize.Op.eq]: financialYear.financial_year }
            )
        ];

        const totalJobRequisitions = await db.job_descripition.findAll({
            where: {
                entity_id: entity_id,
                financial_year_id: financial_id,
                created_by: created_by,
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalJobRequisitions.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No JD found for the specified months and financial year'
            });
        }

        const jobIds = totalJobRequisitions.map(data => data.id);

        if (jobIds.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No valid job IDs found for the specified criteria'
            });
        }

        const [totalAppliedCandidates] = await db.sequelize.query(`
           SELECT COUNT(*) AS TotalApplieds FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
            INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JDE.job_descripition_id=JD.id WHERE 
            JD.entity_id = :entity_id
            AND JD.created_by = :created_by
            AND JD.financial_year_id = :financial_id
                AND JD.id IN (:jobIds)`, {
            replacements: {
                jobIds,
                entity_id,created_by,financial_id
            },
            type: db.Sequelize.QueryTypes.SELECT
        });
        const [totalscreenedCandidates] = await db.sequelize.query(`
            SELECT COUNT(*) AS TotalScreened FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
             INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JDE.job_descripition_id=JD.id WHERE 
             JD.entity_id = :entity_id
             AND JD.created_by = :created_by
             AND JD.financial_year_id = :financial_id
             AND JDE.selection_status <> 'REJECTED'
                 AND JD.id IN (:jobIds)`, {
             replacements: {
                 jobIds,
                 entity_id,created_by,financial_id
             },
             type: db.Sequelize.QueryTypes.SELECT
         });
         const [totalInterviewedCandidates] = await db.sequelize.query(`
            SELECT COUNT(*) AS TotalInterviewed 
            FROM RECRUITMENT_CANDIDATE_INTERVIEW AS JDE
            INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS JD 
             ON JDE.jd_id = JD.id WHERE 
             JD.entity_id = :entity_id
             AND JD.created_by = :created_by
             AND JD.financial_year_id = :financial_id
                 AND JD.id IN (:jobIds)`, {
             replacements: {
                 jobIds,
                 entity_id,created_by,financial_id
             },
             type: db.Sequelize.QueryTypes.SELECT
         });
         const [totalOfferedCandidates] = await db.sequelize.query(`
                SELECT COUNT(*) AS TotalOffered
                FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS JDO
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
                ON JDO.candidate_id = JDE.id
                WHERE JDO.entity_id = :entity_id
                AND JDO.created_by = :created_by
                AND JDO.financial_year_id = :financial_id
                AND JDE.job_descripition_id IN (:jobIds);
                 `, {
             replacements: {
                 jobIds,
                 entity_id,created_by,financial_id
             },
             type: db.Sequelize.QueryTypes.SELECT
         });
         const [totalHiredCandidates] = await db.sequelize.query(`
                SELECT COUNT(*) AS TotalHired
                FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS JDO
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
                ON JDO.candidate_id = JDE.id
                WHERE JDO.entity_id = :entity_id
                AND JDO.created_by = :created_by
                AND JDO.financial_year_id = :financial_id
                AND (JDO.candidate_offer_status = 'ONBOARDED' OR JDO.candidate_offer_status = 'ACCEPTED')
                AND JDE.job_descripition_id IN (:jobIds);
             `, {
         replacements: {
             jobIds,
             entity_id,created_by,financial_id
         },
         type: db.Sequelize.QueryTypes.SELECT
     });
        res.    status(200).send({
            message: 'Recruitment average time data fetched successfully',
            data: {
                totalApplied: totalAppliedCandidates.TotalApplieds,
                totalScreened: totalscreenedCandidates.TotalScreened,
                totalInterviewed: totalInterviewedCandidates.TotalInterviewed,
                totalOffered : totalOfferedCandidates.TotalOffered,
                totalHired : totalHiredCandidates.TotalHired
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};

exports.getRecruiterData = async (req, res) => {
    try {
        const { entity_id, created_by } = req.params;
        const { fromMonth, toMonth, financial_id, recruiter_id } = req.body;

        if (!entity_id || !fromMonth || !toMonth || !financial_id || !recruiter_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id, fromMonth, toMonth, financial_id, and recruiter_id are required'
            });
        }

        const fromMonthInt = parseInt(fromMonth, 10);
        const toMonthInt = parseInt(toMonth, 10);

        if (isNaN(fromMonthInt) || isNaN(toMonthInt) || fromMonthInt < 1 || fromMonthInt > 12 || toMonthInt < 1 || toMonthInt > 12 || fromMonthInt > toMonthInt) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid month range. Ensure months are between 1-12 and fromMonth is less than or equal to toMonth.'
            });
        }

        const financialYear = await db.financial_year.findOne({
            attributes: ['id', 'financial_year'],
            where: { id: financial_id }
        });

        if (!financialYear) {
            return res.status(404).send({
                code: 404,
                message: 'Financial year not found'
            });
        }

        const monthFilter = [
            db.Sequelize.where(db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), { [db.Sequelize.Op.gte]: fromMonthInt }),
            db.Sequelize.where(db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), { [db.Sequelize.Op.lte]: toMonthInt }),
            db.Sequelize.where(db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')), { [db.Sequelize.Op.eq]: financialYear.financial_year })
        ];

        const totalJobRequisitions = await db.job_descripition.findAll({
            where: {
                entity_id,
                financial_year_id: financial_id,
                created_by,
                [db.Sequelize.Op.and]: monthFilter
            }
        });

        if (totalJobRequisitions.length === 0) {
            return res.status(404).send({
                code: 404,
                message: 'No JD found for the specified months and financial year'
            });
        }

        const jobIds = totalJobRequisitions.map(data => data.id);

        const queries = [
            db.sequelize.query(`
                SELECT SUM(number_of_positions) AS TotalRequisitionsHandled
                FROM RECRUITMENT_JOB_DESCRIPITION
                WHERE created_by = :recruiter_id
                  AND entity_id = :entity_id
                  AND financial_year_id = :financial_id
                  AND MONTH(createdAt) BETWEEN :fromMonth AND :toMonth
                  AND YEAR(createdAt) = :financial_year
            `, {
                replacements: { recruiter_id, entity_id, financial_id, fromMonth: fromMonthInt, toMonth: toMonthInt, financial_year: financialYear.financial_year },
                type: db.Sequelize.QueryTypes.SELECT
            }),

            db.sequelize.query(`
                SELECT COUNT(*) AS TotalShortlisted
                FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS JDO
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
                ON JDO.candidate_id = JDE.id
                WHERE JDO.entity_id = :entity_id
                  AND JDO.created_by = :recruiter_id
                  AND JDO.financial_year_id = :financial_id
                  AND JDE.job_descripition_id IN (:jobIds)
            `, {
                replacements: { recruiter_id,jobIds, entity_id, created_by, financial_id },
                type: db.Sequelize.QueryTypes.SELECT
            }),

            db.sequelize.query(`
                SELECT COUNT(*) AS TotalHired
                FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS JDO
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
                ON JDO.candidate_id = JDE.id
                WHERE JDO.entity_id = :entity_id
                  AND JDO.created_by = :recruiter_id
                  AND JDO.financial_year_id = :financial_id
                  AND (JDO.candidate_offer_status = 'ONBOARDED' OR JDO.candidate_offer_status = 'ACCEPTED')
                  AND JDE.job_descripition_id IN (:jobIds)
            `, {
                replacements: { recruiter_id,jobIds, entity_id, created_by, financial_id },
                type: db.Sequelize.QueryTypes.SELECT
            })
        ];

        const [totalRequisitionsHandled, totalShortlistedCandidates, totalHiredCandidates] = await Promise.all(queries);

        res.status(200).send({
            message: 'Recruitment average time data fetched successfully',
            data: {
                totalRequisitionsHandled: String(totalRequisitionsHandled[0]?.TotalRequisitionsHandled || '0'),
                totalShortlistedCandidates: String(totalShortlistedCandidates[0]?.TotalShortlisted || '0'),
                totalHiredCandidates: String(totalHiredCandidates[0]?.TotalHired || '0')
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.'
        });
    }
};


exports.getRecruiters = async (req, res) => {
    try {
        const { entity_id } = req.params;
        if (!entity_id) {
            return res.status(400).send({
                code: 400,
                message: 'Missing required parameters: entity_id is required'
            });
        }
        const recruiterNames = await db.sequelize.query(`
            SELECT DISTINCT HRU.employee_id, HRU.first_name, HRU.last_name
            FROM HRMS_REGISTERED_USER AS HRU
            INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS RJD
            ON HRU.employee_id = RJD.created_by
            WHERE RJD.entity_id= :entity_id;
        `, {
            replacements: { entity_id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!recruiterNames || recruiterNames.length === 0) {
            return res.status(404).send({
                message: 'No recruiters found.',
                data: []
            });
        }

        res.status(200).send({
            message: 'Recruiters fetched succesfully!',
            data: recruiterNames, 
        });

    } catch (error) {
        console.error('Error fetching recruiter data:', error);
        return res.status(500).send({
            code: 500,
            message: 'An error occurred while fetching the data. Please try again later.',
            error: error.message 
        });
    }
};