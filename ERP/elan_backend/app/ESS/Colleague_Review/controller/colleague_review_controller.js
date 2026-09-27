const db = require('../../../models/index');
const logger = require('../../../../logger/index');

exports.get_assessment_by_year = async (req, res) => {
    try {
        const { entity_id, filter_fy, financial_year_id } = req.query;

        if (!entity_id || !filter_fy || !financial_year_id) {
            return res.status(400).send({ code: 400, message: "Missing required fields" });
        }

        const getAllData = await db.sequelize.query(
            `SELECT DISTINCT 
                PYAS.id AS yearly_assessment_id,
                PYAS.assessment_name, 
                PYAS.assessment_degree
            FROM PM_YEARLY_ASSESSMENT_SETUP AS PYAS
            WHERE PYAS.isDeleted = 0 
            AND PYAS.entity_id = :entity_id
            AND PYAS.financial_year_id = :financial_year_id
            AND PYAS.filter_fy = :filter_fy
            AND PYAS.assessment_degree = '360 Degree'`,
            {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: { entity_id, financial_year_id, filter_fy }
            }
        );

        if (getAllData && getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "No data found" });
        }
    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_employee_by_assessment_id = async (req, res) => {
    try {
        const { entity_id, filter_fy, yearly_assessment_id, role_master_id, login_id } = req.query;

        const getAllData = await db.sequelize.query(
            `SELECT DISTINCT 
                PSA.id AS submit_assessment_id,
                PSA.user_id AS employee_id,
                CONCAT(HRU.first_name, ' ', HRU.last_name, ' (', HRU.employee_code, ')') AS employee_name
            FROM PM_SUBMITTED_ASSESSMENT AS PSA
            INNER JOIN HRMS_REGISTERED_USER AS HRU ON PSA.user_id = HRU.employee_id
            INNER JOIN PM_YEARLY_ASSESSMENT_SETUP AS PYAS ON PSA.yearly_assessment_id = PYAS.id
            LEFT JOIN ESS_COLLEAGUE_REVIEW AS CR ON CR.submit_assessment_id = PSA.id 
                AND CR.entity_id = PSA.entity_id 
                AND CR.filter_fy = PSA.financial_year_id 
                AND CR.login_id = :login_id
            WHERE PSA.isDeleted = 0 
            AND HRU.role_master_id = :role_master_id
            AND PSA.entity_id = :entity_id
            AND PSA.financial_year_id = :filter_fy
            AND PSA.yearly_assessment_id = :yearly_assessment_id 
            AND PYAS.assessment_degree = '360 Degree'
            AND CR.id IS NULL
            AND PSA.user_id != :login_id`, 
            {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: { entity_id, filter_fy, yearly_assessment_id, role_master_id, login_id }
            }
        );

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch Employee Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "No data found" });
        }
    } catch (error) {
        logger.error(`Error in get_employee_by_assessment_id: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.create_colleague_review = async (req, res) => {
    try {
        const { entity_id, filter_fy, login_id, submit_assessment_id, review } = req.body;

        if (!entity_id || !filter_fy || !login_id || !submit_assessment_id || !review) {
            return res.status(400).send({ code: 400, message: "Missing required fields" });
        }
        if (review && Array.isArray(review.reviews) && review.reviews.length > 0) {
            const colleagueReview = review.reviews.map((element) => ({
                competence: element.Competence,
                self_rating_id: element.rating,
                financial_year_id: review.financial_year_id,
                employee_id: review.employee_id,
                role_master_id: review.role_id,
                yearly_assessment_id: review.assessment_name,
                submit_assessment_id: submit_assessment_id,
                entity_id: entity_id,
                filter_fy: filter_fy,
                login_id: login_id,
            }));

            await db.colleague_review.bulkCreate(colleagueReview);
            
        } else {
            return res.status(400).send({ code: 400, message: "Invalid or empty reviews" });
        }
        return res.status(200).send({ code: 200, message: "Colleague Review Submitted Successfully!" });
    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



exports.get_colleague_review_list = async (req, res) => {
    try {
        const { entity_id, filter_fy, login_id } = req.query;

        if (!entity_id || !filter_fy || !login_id) {
            return res.status(400).send({ code: 400, message: "Missing required fields" });
        }

        const query = `
        SELECT 
            psa.id AS submit_assessment_id,
            yas.assessment_name,
            psa.yearly_assessment_id,
            CONCAT(hru.first_name, ' ', hru.last_name) AS employee_name,
            hru.employee_code,
            psa.user_id
        FROM 
            PM_SUBMITTED_ASSESSMENT psa
        INNER JOIN 
            PM_YEARLY_ASSESSMENT_SETUP yas
        ON 
            psa.yearly_assessment_id = yas.id
        INNER JOIN 
            HRMS_REGISTERED_USER hru
        ON 
            psa.user_id = hru.employee_id
        WHERE 
            psa.entity_id = :entity_id
            AND psa.isDeleted = 0
            AND yas.filter_fy = :filter_fy
            AND yas.entity_id = :entity_id
            AND yas.isDeleted = 0;
        `;
        
        const assessments = await db.sequelize.query(query, {
            replacements: { entity_id, filter_fy },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (assessments.length === 0) {
            return res.status(404).send({ code: 404, message: "No assessments found for the user." });
        }

        let finalResult = [];
        let totalFinalRating = 0;
        let ratingCount = 0;

        for (const assessment of assessments) {
            const { submit_assessment_id, yearly_assessment_id, assessment_name, employee_name, employee_code, user_id } = assessment;

            const behavioralQuery = `
                SELECT 
                    eva.behavioural_average_rating AS final_rating_behave
                FROM 
                    ESS_BEHAVIORAL_VL_ASSESSMENT eva
                WHERE 
                    eva.entity_id = :entity_id
                    AND eva.submit_assessment_id = :submit_assessment_id
                    AND eva.financial_year_id = :filter_fy
                    AND eva.isDeleted = 0;
            `;
            const behavioralData = await db.sequelize.query(behavioralQuery, {
                replacements: { entity_id, submit_assessment_id, filter_fy },
                type: db.sequelize.QueryTypes.SELECT
            });

            const technicalQuery = `
                SELECT 
                    eta.technical_average_rating AS final_rating_technical
                FROM 
                    ESS_TECHNICAL_ASSESSMENT eta
                WHERE 
                    eta.entity_id = :entity_id
                    AND eta.submit_assessment_id = :submit_assessment_id
                    AND eta.financial_year_id = :filter_fy
                    AND eta.isDeleted = 0;
            `;
            const technicalData = await db.sequelize.query(technicalQuery, {
                replacements: { entity_id, submit_assessment_id, filter_fy },
                type: db.sequelize.QueryTypes.SELECT
            });

            const committeeQuery = `
                SELECT 
                    eca.committee_average_rating
                FROM 
                    ESS_COMMITTEE_ASSIGN_USER eca
                WHERE 
                    eca.entity_id = :entity_id
                    AND eca.submit_assessment_id = :submit_assessment_id
                    AND eca.financial_year_id = :filter_fy
                    AND eca.isDeleted = 0;
            `;
            const committeeData = await db.sequelize.query(committeeQuery, {
                replacements: { entity_id, submit_assessment_id, filter_fy },
                type: db.sequelize.QueryTypes.SELECT
            });

            const final_rating_behave = behavioralData.length > 0 ? parseFloat(behavioralData[0].final_rating_behave) : null;
            const final_rating_technical = technicalData.length > 0 ? parseFloat(technicalData[0].final_rating_technical) : null;

            let totalCommitteeRating = 0;
            let committeeCount = 0;

            for (const committee of committeeData) {
                const committeeRating = parseFloat(committee.committee_average_rating);
                if (committeeRating && committeeRating > 0) {  
                    totalCommitteeRating += committeeRating;
                    committeeCount += 1;
                }
            }

            const final_committe_rating = committeeCount > 0 ? (totalCommitteeRating / committeeCount).toFixed(2) : null;

            const colleagueQuery = `
                SELECT 
                    ecr.login_id,
                    ecr.self_rating_id
                FROM 
                    ESS_COLLEAGUE_REVIEW ecr
                WHERE 
                    ecr.entity_id = :entity_id
                    AND ecr.submit_assessment_id = :submit_assessment_id
                    AND ecr.filter_fy = :filter_fy
                    AND ecr.yearly_assessment_id = :yearly_assessment_id
                    AND ecr.isDeleted = 0;
            `;
            const colleagueReviews = await db.sequelize.query(colleagueQuery, {
                replacements: { entity_id, submit_assessment_id, filter_fy, yearly_assessment_id },
                type: db.sequelize.QueryTypes.SELECT
            });

            let totalColleagueRating = 0;
            let uniqueCount = 0;

            let colleagueRatings = {};

            for (const review of colleagueReviews) {
                const selfRatingQuery = `
                    SELECT 
                        sr.self_rating_value 
                    FROM 
                        ESS_SELF_RATING_ASSESSMENT sr
                    WHERE 
                        sr.id = :self_rating_id 
                        AND sr.isDeleted = 0;
                `;
                const selfRatingData = await db.sequelize.query(selfRatingQuery, {
                    replacements: { self_rating_id: review.self_rating_id },
                    type: db.sequelize.QueryTypes.SELECT
                });

                if (selfRatingData.length > 0) {
                    const selfRatingValue = parseFloat(selfRatingData[0].self_rating_value);
                    if (!colleagueRatings[review.login_id]) {
                        colleagueRatings[review.login_id] = { total: 0, count: 0 };
                    }
                    if (selfRatingValue) {
                        colleagueRatings[review.login_id].total += selfRatingValue;
                        colleagueRatings[review.login_id].count += 1;
                    }
                }
            }

            for (const key in colleagueRatings) {
                if (colleagueRatings[key].count > 0) {
                    totalColleagueRating += (colleagueRatings[key].total / colleagueRatings[key].count);
                    uniqueCount += 1;
                }
            }

            const final_colleague_rating = uniqueCount > 0 ? (totalColleagueRating / uniqueCount).toFixed(2) : null;

            if (final_colleague_rating === null) {
                continue;
            }

            let totalRating = 0;
            let count = 0;

            if (final_rating_behave !== null) {
                totalRating += final_rating_behave;
                count += 1;
            }

            if (final_rating_technical !== null) {
                totalRating += final_rating_technical;
                count += 1;
            }

            if (final_committe_rating !== null) {
                totalRating += parseFloat(final_committe_rating);  
                count += 1;
            }

            totalRating += parseFloat(final_colleague_rating);
            count += 1;

            const final_rating = count > 0 ? (totalRating / count).toFixed(2) : null;

            finalResult.push({
                employee_id: user_id,
                employee_name,  
                employee_code,
                assessment_name,
                submit_assessment_id,
                yearly_assessment_id,
                final_rating_behave,
                final_rating_technical,
                final_committe_rating,
                final_colleague_rating,
                final_rating  
            });

            if (final_rating !== null) {
                totalFinalRating += parseFloat(final_rating);
                ratingCount += 1;
            }
        }

        const final_average_rating = ratingCount > 0 ? (totalFinalRating / ratingCount).toFixed(2) : null;

        return res.status(200).send({ code: 200, final_average_rating, data: finalResult });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};






exports.get_user_ranking = async (req, res) => {
    try {
        const { entity_id, filter_fy, login_id } = req.query;

        if (!entity_id || !filter_fy || !login_id) {
            return res.status(400).send({ code: 400, message: "Missing required fields" });
        }

        const query = `
        SELECT 
            psa.id AS submit_assessment_id,
            yas.assessment_name,
            psa.yearly_assessment_id,
            CONCAT(hru.first_name, ' ', hru.last_name) AS employee_name,
            hru.employee_code
        FROM 
            PM_SUBMITTED_ASSESSMENT psa
        INNER JOIN 
            PM_YEARLY_ASSESSMENT_SETUP yas
        ON 
            psa.yearly_assessment_id = yas.id
        INNER JOIN 
            HRMS_REGISTERED_USER hru
        ON 
            psa.user_id = hru.employee_id
        WHERE 
            psa.user_id = :login_id
            AND psa.entity_id = :entity_id
            AND psa.isDeleted = 0
            AND yas.filter_fy = :filter_fy
            AND yas.entity_id = :entity_id
            AND yas.isDeleted = 0;
    `;
    

        const assessments = await db.sequelize.query(query, {
            replacements: { login_id, entity_id, filter_fy },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (assessments.length === 0) {
            return res.status(404).send({ code: 404, message: "No assessments found for the user." });
        }

        let finalResult = [];
        let totalFinalRating = 0;  
        let ratingCount = 0;      

        for (const assessment of assessments) {
            const { submit_assessment_id, yearly_assessment_id, assessment_name, employee_name,  employee_code  } = assessment;

            const behavioralQuery = `
                SELECT 
                    eva.behavioural_average_rating AS final_rating_behave
                FROM 
                    ESS_BEHAVIORAL_VL_ASSESSMENT eva
                WHERE 
                    eva.employee_id = :login_id
                    AND eva.entity_id = :entity_id
                    AND eva.submit_assessment_id = :submit_assessment_id
                    AND eva.financial_year_id = :filter_fy
                    AND eva.isDeleted = 0;
            `;
            const behavioralData = await db.sequelize.query(behavioralQuery, {
                replacements: { login_id, entity_id, submit_assessment_id, filter_fy },
                type: db.sequelize.QueryTypes.SELECT
            });

            const technicalQuery = `
                SELECT 
                    eta.technical_average_rating AS final_rating_technical
                FROM 
                    ESS_TECHNICAL_ASSESSMENT eta
                WHERE 
                    eta.employee_id = :login_id
                    AND eta.entity_id = :entity_id
                    AND eta.submit_assessment_id = :submit_assessment_id
                    AND eta.financial_year_id = :filter_fy
                    AND eta.isDeleted = 0;
            `;
            const technicalData = await db.sequelize.query(technicalQuery, {
                replacements: { login_id, entity_id, submit_assessment_id, filter_fy },
                type: db.sequelize.QueryTypes.SELECT
            });

            const committeeQuery = `
                SELECT 
                    eca.committee_average_rating
                FROM 
                    ESS_COMMITTEE_ASSIGN_USER eca
                WHERE 
                    eca.employee_id = :login_id
                    AND eca.entity_id = :entity_id
                    AND eca.submit_assessment_id = :submit_assessment_id
                    AND eca.financial_year_id = :filter_fy
                    AND eca.isDeleted = 0;
            `;
            const committeeData = await db.sequelize.query(committeeQuery, {
                replacements: { login_id, entity_id, submit_assessment_id, filter_fy },
                type: db.sequelize.QueryTypes.SELECT
            });

            const final_rating_behave = behavioralData.length > 0 ? parseFloat(behavioralData[0].final_rating_behave) : null;
            const final_rating_technical = technicalData.length > 0 ? parseFloat(technicalData[0].final_rating_technical) : null;

            let totalCommitteeRating = 0;
            let committeeCount = 0;

            for (const committee of committeeData) {
                const committeeRating = parseFloat(committee.committee_average_rating);
                if (committeeRating && committeeRating > 0) {  
                    totalCommitteeRating += committeeRating;
                    committeeCount += 1;
                }
            }

            const final_committe_rating = committeeCount > 0 ? (totalCommitteeRating / committeeCount).toFixed(2) : null;

            const colleagueQuery = `
                SELECT 
                    ecr.self_rating_id
                FROM 
                    ESS_COLLEAGUE_REVIEW ecr
                WHERE 
                    ecr.employee_id = :login_id
                    AND ecr.entity_id = :entity_id
                    AND ecr.submit_assessment_id = :submit_assessment_id
                    AND ecr.filter_fy = :filter_fy
                    AND ecr.yearly_assessment_id = :yearly_assessment_id
                    AND ecr.isDeleted = 0;
            `;
            const colleagueReviews = await db.sequelize.query(colleagueQuery, {
                replacements: { login_id, entity_id, submit_assessment_id, filter_fy, yearly_assessment_id },
                type: db.sequelize.QueryTypes.SELECT
            });

            let colleagueRatings = {};
            for (const review of colleagueReviews) {
                const selfRatingQuery = `
                    SELECT 
                        sr.self_rating_value 
                    FROM 
                        ESS_SELF_RATING_ASSESSMENT sr
                    WHERE 
                        sr.id = :self_rating_id 
                        AND sr.isDeleted = 0;
                `;
                const selfRatingData = await db.sequelize.query(selfRatingQuery, {
                    replacements: { self_rating_id: review.self_rating_id },
                    type: db.sequelize.QueryTypes.SELECT
                });

                if (selfRatingData.length > 0) {
                    const selfRatingValue = parseFloat(selfRatingData[0].self_rating_value);
                    if (!colleagueRatings[login_id]) {
                        colleagueRatings[login_id] = { total: 0, count: 0 };
                    }
                    if (selfRatingValue) {
                        colleagueRatings[login_id].total += selfRatingValue;
                        colleagueRatings[login_id].count += 1;
                    }
                }
            }

            let totalColleagueRating = 0;
            let uniqueCount = 0;
            for (const key in colleagueRatings) {
                if (colleagueRatings[key].count > 0) {
                    totalColleagueRating += (colleagueRatings[key].total / colleagueRatings[key].count);
                    uniqueCount += 1;
                }
            }
            const final_colleague_rating = uniqueCount > 0 ? (totalColleagueRating / uniqueCount).toFixed(2) : null;

            let totalRating = 0;
            let count = 0;

            if (final_rating_behave !== null) {
                totalRating += final_rating_behave;
                count += 1;
            }

            if (final_rating_technical !== null) {
                totalRating += final_rating_technical;
                count += 1;
            }

            if (final_committe_rating !== null) {
                totalRating += parseFloat(final_committe_rating);  
                count += 1;
            }

            if (final_colleague_rating !== null) {
                totalRating += parseFloat(final_colleague_rating); 
                count += 1;
            }

            const final_rating = count > 0 ? (totalRating / count).toFixed(2) : null;

            finalResult.push({
                employee_id: login_id,
                employee_name,  
                employee_code,
                assessment_name,
                submit_assessment_id,
                yearly_assessment_id,
                final_rating_behave,
                final_rating_technical,
                final_committe_rating,
                final_colleague_rating,
                final_rating  
            });

            if (final_rating !== null) {
                totalFinalRating += parseFloat(final_rating);
                ratingCount += 1;
            }
        }

        const final_average_rating = ratingCount > 0 ? (totalFinalRating / ratingCount).toFixed(2) : null;

        return res.status(200).send({ code: 200, final_average_rating, data: finalResult });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};





