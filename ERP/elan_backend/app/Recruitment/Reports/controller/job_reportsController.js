const db = require("../../../models/index");

exports.getJobdescriptionReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, department_id, branch_id, financial_year_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity ID is required.",
      });
    }

    let query = `
            SELECT 
                JD.id,
                JD.jd_number,
                JD.job_title,
                JD.financial_year_id,
                JD.descripition,
                JD.branch_id,
                MB.branch_name,
                JD.department_id,
                MD.department_name,
                JD.entity_id,
                JD.monthly_salary,
                JD.start_date,
                JD.end_date,
                JD.experience,
                GROUP_CONCAT(JS.skill_name SEPARATOR ', ') AS skill_name,
                JD.isCompletedJd,
                JD.createdAt,
                (
                    SELECT COUNT(email.id) 
                    FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS email
                    WHERE email.job_descripition_id = JD.id
                ) AS total_application_received
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            LEFT JOIN 
                MASTER_DEPARTMENT AS MD 
            ON 
                MD.dept_id = JD.department_id
            LEFT JOIN 
                MASTER_BRANCH AS MB
            ON 
                MB.id = JD.branch_id
            LEFT JOIN 
                RECRUITMENT_JOB_SKILL AS JS
            ON
                JS.job_descripition_id = JD.id
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
        `;

    if (month_id) {
      query += ` AND MONTH(JD.start_date) = :month_id`;
    }

    if (department_id) {
      query += ` AND JD.department_id = :department_id`;
    }

    if (branch_id) {
      query += ` AND JD.branch_id = :branch_id`;
    }

    if (financial_year_id) {
      query += ` AND JD.financial_year_id = :financial_year_id`;
    }

    query += `
            GROUP BY 
                JD.id, JD.jd_number, JD.job_title, JD.descripition, JD.branch_id, MB.branch_name, 
                JD.department_id, MD.department_name, JD.entity_id, JD.monthly_salary, JD.start_date, 
                JD.end_date, JD.experience, JD.isCompletedJd, JD.createdAt
            ORDER BY 
                JD.createdAt DESC;
        `;

    const jobDescriptions = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        month_id,
        department_id,
        branch_id,
        financial_year_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (jobDescriptions.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No job descriptions found for the given filters.",
      });
    }

    jobDescriptions.forEach((job) => {
      if (job.descripition) {
        job.descripition = job.descripition.replace(/(<([^>]+)>)/gi, "");
      }
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully.",
      data: jobDescriptions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.getRecruiterMonthReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, assign_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity ID is required.",
      });
    }

    let query = `
        WITH AverageDaysToClose AS (
            SELECT 
                JD.assign_id,
                ROUND(AVG(DATEDIFF(RCOL.updatedAt, JD.start_date)), 1) AS average_days_to_close_position
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            LEFT JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                ON JDE.id = RCOL.candidate_id 
                AND RCOL.candidate_offer_status = 'ONBOARDED'
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
                AND RCOL.candidate_offer_status IS NOT NULL
            GROUP BY 
                JD.assign_id
        ),
        TotalCandidates AS (
            SELECT 
                JD.assign_id,
                COUNT(JD.id) AS total_candidates_handled
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            INNER JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                ON JDE.id = RCOL.candidate_id 
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
            GROUP BY 
                JD.assign_id
        ),
        RejectedCandidates AS (
            SELECT 
                JD.assign_id,
                COUNT(JD.id) AS total_rejected_candidates
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            INNER JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                ON JDE.id = RCOL.candidate_id 
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
                AND JDE.selection_status IN ('REJECTED', 'HOLD') 
            GROUP BY 
                JD.assign_id
        )
        SELECT 
            HRU.employee_id,
            HRU.employee_code,
            CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,
            SUM(JD.number_of_positions) AS total_positions_handled,
            SUM(CASE WHEN JD.isCompletedJd = 'COMPLETED' THEN JD.number_of_positions ELSE 0 END) AS total_positions_closed,
            COALESCE(SUM(
                (SELECT COUNT(RJDE.id) 
                 FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS RJDE 
                 WHERE RJDE.job_descripition_id = JD.id)
            ), 0) AS total_candidates_submitted,
            COALESCE(ADTC.average_days_to_close_position, 0) AS average_days_to_close_position,
            COALESCE(TC.total_candidates_handled, 0) AS total_candidates_handled,
            COALESCE(RC.total_rejected_candidates, 0) AS total_rejected_candidates,
            CASE 
                WHEN COALESCE(TC.total_candidates_handled, 0) > 0 THEN 
                    ROUND((COALESCE(RC.total_rejected_candidates, 0) * 100.0) / COALESCE(TC.total_candidates_handled, 1), 2)
                ELSE 
                    0
            END AS rejection_rate
        FROM 
            HRMS_REGISTERED_USER AS HRU
        INNER JOIN 
            RECRUITMENT_JOB_DESCRIPITION AS JD 
            ON HRU.employee_id = JD.assign_id
        LEFT JOIN 
            AverageDaysToClose AS ADTC 
            ON HRU.employee_id = ADTC.assign_id
        LEFT JOIN 
            TotalCandidates AS TC 
            ON HRU.employee_id = TC.assign_id
        LEFT JOIN 
            RejectedCandidates AS RC 
            ON HRU.employee_id = RC.assign_id
        WHERE 
            JD.entity_id = :entity_id
            AND JD.isDeleted = 0
        `;

    if (month_id) {
      query += ` AND MONTH(JD.start_date) = :month_id`;
    }

    if (financial_year_id) {
      query += ` AND JD.financial_year_id = :financial_year_id`;
    }

    if (assign_id) {
      query += ` AND JD.assign_id = :assign_id`;
    }

    query += `
        GROUP BY 
            HRU.employee_id, HRU.employee_code, HRU.first_name, HRU.last_name, 
            ADTC.average_days_to_close_position, TC.total_candidates_handled, RC.total_rejected_candidates;
        `;

    const recruiterReport = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        month_id,
        financial_year_id,
        assign_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (recruiterReport.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the given filters.",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Recruiter month report fetched successfully.",
      data: recruiterReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.getPositionTimeReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, department_id, branch_id, financial_year_id, assign_id } =
      req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity ID is required.",
      });
    }

    let query = `
            SELECT 
                JD.id AS job_id,
                JD.jd_number,
                JD.job_title,
                JD.financial_year_id,
                JD.branch_id,
                MB.branch_name,
                JD.department_id,
                MD.department_name,
                JD.entity_id,
                JD.start_date,
                JD.end_date,
                JD.isCompletedJd,
                JD.createdAt,
                CONCAT(HRU.first_name, ' ', HRU.last_name) AS recruiter_name,
                (
                    SELECT COUNT(email.id) 
                    FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS email
                    WHERE email.job_descripition_id = JD.id
                ) AS total_application_received,
                MIN(COL.createdAt) AS first_offer_letter_date,
                MAX(COL.createdAt) AS last_offer_letter_date,
                ROUND(DATEDIFF(MAX(COL.createdAt), JD.start_date), 1) AS total_days_to_fill_position,
                ROUND(AVG(DATEDIFF(COL.createdAt, JD.start_date)), 1) AS average_days_to_hire 
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            LEFT JOIN 
                MASTER_DEPARTMENT AS MD 
                ON MD.dept_id = JD.department_id
            LEFT JOIN 
                MASTER_BRANCH AS MB
                ON MB.id = JD.branch_id
            LEFT JOIN 
                HRMS_REGISTERED_USER AS HRU
                ON HRU.employee_id = JD.assign_id
            LEFT JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
                ON JDE.job_descripition_id = JD.id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS COL
                ON COL.candidate_id = JDE.id
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
                AND COL.createdAt IS NOT NULL
        `;

    if (month_id) {
      query += ` AND MONTH(JD.start_date) = :month_id`;
    }

    if (department_id) {
      query += ` AND JD.department_id = :department_id`;
    }

    if (branch_id) {
      query += ` AND JD.branch_id = :branch_id`;
    }

    if (financial_year_id) {
      query += ` AND JD.financial_year_id = :financial_year_id`;
    }

    if (assign_id) {
      query += ` AND JD.assign_id = :assign_id`;
    }

    query += `
            GROUP BY 
                JD.id, JD.jd_number, JD.job_title, JD.financial_year_id, JD.branch_id, MB.branch_name, 
                JD.department_id, MD.department_name, JD.entity_id, JD.start_date, JD.end_date, JD.isCompletedJd, 
                JD.createdAt, HRU.first_name, HRU.last_name
            ORDER BY 
                total_days_to_fill_position DESC;
        `;

    const jobDescriptions = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        month_id,
        department_id,
        branch_id,
        financial_year_id,
        assign_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (jobDescriptions.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No job descriptions found for the given filters.",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully.",
      data: jobDescriptions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.getRecruiterLocationReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, assign_id, branch_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity ID is required.",
      });
    }

    let query = `
            WITH AverageDaysToClose AS (
                SELECT 
                    JD.assign_id,
                    ROUND(AVG(DATEDIFF(RCOL.updatedAt, JD.start_date)), 1) AS average_days_to_close_position
                FROM 
                    RECRUITMENT_JOB_DESCRIPITION AS JD
                LEFT JOIN 
                    RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                    ON JD.id = JDE.job_descripition_id
                LEFT JOIN 
                    RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                    ON JDE.id = RCOL.candidate_id 
                    AND RCOL.candidate_offer_status = 'ONBOARDED'
                WHERE 
                    JD.entity_id = :entity_id
                    AND JD.isDeleted = 0
                    AND JDE.isDeleted = 0
                    AND RCOL.candidate_offer_status IS NOT NULL
                GROUP BY 
                    JD.assign_id
            ),
            TotalCandidates AS (
                SELECT 
                    JD.assign_id,
                    COUNT(JDE.id) AS total_candidates_handled
                FROM 
                    RECRUITMENT_JOB_DESCRIPITION AS JD
                INNER JOIN 
                    RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                    ON JD.id = JDE.job_descripition_id
                LEFT JOIN 
                    RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                    ON JDE.id = RCOL.candidate_id 
                WHERE 
                    JD.entity_id = :entity_id
                    AND JD.isDeleted = 0
                    AND JDE.isDeleted = 0
                    AND RCOL.candidate_offer_status IS NOT NULL
                GROUP BY 
                    JD.assign_id
            ),
            RejectedCandidates AS (
                SELECT 
                    JD.assign_id,
                    COUNT(JDE.id) AS total_rejected_candidates
                FROM 
                    RECRUITMENT_JOB_DESCRIPITION AS JD
                INNER JOIN 
                    RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                    ON JD.id = JDE.job_descripition_id
                LEFT JOIN 
                    RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                    ON JDE.id = RCOL.candidate_id 
                WHERE 
                    JD.entity_id = :entity_id
                    AND JD.isDeleted = 0
                    AND JDE.isDeleted = 0
                    AND JDE.selection_status IN ('REJECTED', 'HOLD') 
                    AND RCOL.candidate_offer_status IS NOT NULL
                GROUP BY 
                    JD.assign_id
            )
            SELECT 
                HRU.employee_id,
                HRU.employee_code,
                JD.job_title,
                JD.branch_id,
                MB.branch_name,
                CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,
                SUM(JD.number_of_positions) AS total_positions_handled,
                SUM(CASE WHEN JD.isCompletedJd = 'COMPLETED' THEN JD.number_of_positions ELSE 0 END) AS total_positions_closed,
                COUNT(JDE.id) AS total_candidates_submitted,
                COALESCE(ADTC.average_days_to_close_position, 0) AS average_days_to_close_position,
                COALESCE(TC.total_candidates_handled, 0) AS total_candidates_handled,
                COALESCE(RC.total_rejected_candidates, 0) AS total_rejected_candidates,
                CASE 
                    WHEN COALESCE(TC.total_candidates_handled, 0) > 0 THEN 
                        ROUND((COALESCE(RC.total_rejected_candidates, 0) * 100.0) / COALESCE(TC.total_candidates_handled, 1), 2)
                    ELSE 
                        0
                END AS rejection_rate
            FROM 
                HRMS_REGISTERED_USER AS HRU
            INNER JOIN 
                RECRUITMENT_JOB_DESCRIPITION AS JD 
                ON HRU.employee_id = JD.assign_id
            LEFT JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                AverageDaysToClose AS ADTC 
                ON HRU.employee_id = ADTC.assign_id
            LEFT JOIN 
                TotalCandidates AS TC 
                ON HRU.employee_id = TC.assign_id
            LEFT JOIN 
                RejectedCandidates AS RC 
                ON HRU.employee_id = RC.assign_id
            LEFT JOIN 
                MASTER_BRANCH AS MB
                ON MB.id = JD.branch_id
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
        `;

    if (month_id) {
      query += ` AND MONTH(JD.start_date) = :month_id`;
    }

    if (financial_year_id) {
      query += ` AND JD.financial_year_id = :financial_year_id`;
    }

    if (assign_id) {
      query += ` AND JD.assign_id = :assign_id`;
    }

    if (branch_id) {
      query += ` AND JD.branch_id = :branch_id`;
    }

    query += `
        GROUP BY 
    HRU.employee_id, HRU.employee_code, JD.job_title, JD.branch_id, MB.branch_name, HRU.first_name, HRU.last_name, 
    ADTC.average_days_to_close_position, TC.total_candidates_handled, RC.total_rejected_candidates;
        `;

    const recruiterReport = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        month_id,
        financial_year_id,
        assign_id,
        branch_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (recruiterReport.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the given filters.",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Recruiter location report fetched successfully.",
      data: recruiterReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.getCandidateInterviewRoundReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const {
      selection_status,
      selectedRound,
      selectedStatus,
      month_id,
      financial_year_id,
    } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity ID is required.",
      });
    }

    let query = `
            SELECT
                JD.id,
                JD.job_title,
                JD.jd_number,
                CONCAT(JDE.first_name, ' ', JDE.last_name) AS full_name,
                CONCAT(JDE.email, ' | ', JDE.contact_number) AS email_and_contact,
                JD.level_of_interview,
                RCI.interview_round,
                RCI.interview_date,
                RCI.interview_time,
                JDE.selection_status,
                RCI.candidate_id,
                RCIR.interviewer_id,
                CONCAT(HR.first_name, ' ', HR.last_name) AS interviewer_name
            FROM
                RECRUITMENT_JOB_DESCRIPITION AS JD
            LEFT JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE
                ON JDE.job_descripition_id = JD.id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_INTERVIEW AS RCI
                ON RCI.candidate_id = JDE.id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_INTERVIEWER AS RCIR
                ON RCIR.round_id = RCI.id
            LEFT JOIN 
                HRMS_REGISTERED_USER AS HR
                ON HR.employee_id = RCIR.interviewer_id
            WHERE
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
        `;

    if (selection_status) {
      query += ` AND JDE.selection_status = :selection_status`;
    }

    if (selectedRound === "First Round") {
      query += ` AND RCI.interview_round = 1`;
    } else if (selectedRound === "Final Round") {
      query += ` AND RCI.interview_round = JD.level_of_interview`;
    }

    if (selectedStatus) {
      query += ` AND JDE.selection_status = :selectedStatus`;
    }

    if (month_id) {
      query += ` AND MONTH(RCI.interview_date) = :month_id`;
    }

    if (financial_year_id) {
      query += ` AND YEAR(RCI.interview_date) = :financial_year_id`;
    }

    const candidateInterviewDetails = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        selection_status,
        selectedRound,
        selectedStatus,
        month_id,
        financial_year_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (candidateInterviewDetails.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the given filters.",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Candidate interview details fetched successfully.",
      data: candidateInterviewDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.getRecruiterProductivityReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, assign_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity ID is required.",
      });
    }

    let query = `
        WITH AverageDaysToClose AS (
            SELECT 
                JD.assign_id,
                ROUND(AVG(DATEDIFF(RCOL.updatedAt, JD.start_date)), 1) AS average_days_to_close_position
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            LEFT JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                ON JDE.id = RCOL.candidate_id 
                AND RCOL.candidate_offer_status = 'ONBOARDED'
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
            GROUP BY 
                JD.assign_id
        ),

        AverageDaysToSubmit AS (
            SELECT 
                JD.assign_id,
                ROUND(AVG(DATEDIFF(JDE.createdAt, JD.start_date)), 1) AS average_days_to_submit
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            INNER JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
            GROUP BY 
                JD.assign_id
        ),

        TotalCandidates AS (
            SELECT 
                JD.assign_id,
                COUNT(JD.id) AS total_candidates_handled
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            INNER JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                ON JDE.id = RCOL.candidate_id 
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
            GROUP BY 
                JD.assign_id
        ),
        RejectedCandidates AS (
            SELECT 
                JD.assign_id,
                COUNT(JD.id) AS total_rejected_candidates
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            INNER JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                ON JDE.id = RCOL.candidate_id 
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
                AND JDE.selection_status IN ('REJECTED', 'HOLD') 
            GROUP BY 
                JD.assign_id
        ),
        SelectedCandidates AS (
            SELECT 
                JD.assign_id,
                COUNT(JD.id) AS total_selected_candidates
            FROM 
                RECRUITMENT_JOB_DESCRIPITION AS JD
            INNER JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JD.id = JDE.job_descripition_id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                ON JDE.id = RCOL.candidate_id 
            WHERE 
                JD.entity_id = :entity_id
                AND JD.isDeleted = 0
                AND JDE.isDeleted = 0
                AND JDE.selection_status IN ('GO_FOR_BGV', 'SELECTED', 'APPROVED') 
            GROUP BY 
                JD.assign_id
        )
        SELECT 
            HRU.employee_id,
            HRU.employee_code,
            CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,
            SUM(JD.number_of_positions) AS total_positions_handled,
            SUM(CASE WHEN JD.isCompletedJd = 'COMPLETED' THEN JD.number_of_positions ELSE 0 END) AS total_positions_closed,
            COALESCE(SUM(
                (SELECT COUNT(RJDE.id) 
                 FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS RJDE 
                 WHERE RJDE.job_descripition_id = JD.id)
            ), 0) AS total_candidates_submitted,
            COALESCE(ADTC.average_days_to_close_position, 0) AS average_days_to_close_position,
            COALESCE(ADTS.average_days_to_submit, 0) AS average_days_to_submit,
            COALESCE(TC.total_candidates_handled, 0) AS total_candidates_handled,
            COALESCE(RC.total_rejected_candidates, 0) AS total_rejected_candidates,
            COALESCE(SC.total_selected_candidates, 0) AS total_selected_candidates,
            CASE 
                WHEN COALESCE(TC.total_candidates_handled, 0) > 0 THEN 
                    ROUND((COALESCE(RC.total_rejected_candidates, 0) * 100.0) / COALESCE(TC.total_candidates_handled, 1), 2)
                ELSE 
                    0
            END AS rejection_rate,
            CASE 
                WHEN COALESCE(TC.total_candidates_handled, 0) > 0 THEN 
                    ROUND((COALESCE(SC.total_selected_candidates, 0) * 100.0) / COALESCE(TC.total_candidates_handled, 1), 2)
                ELSE 
                    0
            END AS selection_rate
        FROM 
            HRMS_REGISTERED_USER AS HRU
        INNER JOIN 
            RECRUITMENT_JOB_DESCRIPITION AS JD 
            ON HRU.employee_id = JD.assign_id
        LEFT JOIN 
            AverageDaysToClose AS ADTC 
            ON HRU.employee_id = ADTC.assign_id
        LEFT JOIN 
            AverageDaysToSubmit AS ADTS 
            ON HRU.employee_id = ADTS.assign_id
        LEFT JOIN 
            TotalCandidates AS TC 
            ON HRU.employee_id = TC.assign_id
        LEFT JOIN 
            RejectedCandidates AS RC 
            ON HRU.employee_id = RC.assign_id
        LEFT JOIN 
            SelectedCandidates AS SC
            ON HRU.employee_id = SC.assign_id
        WHERE 
            JD.entity_id = :entity_id
            AND JD.isDeleted = 0
        `;

    if (month_id) {
      query += ` AND MONTH(JD.start_date) = :month_id`;
    }

    if (financial_year_id) {
      query += ` AND JD.financial_year_id = :financial_year_id`;
    }

    if (assign_id) {
      query += ` AND JD.assign_id = :assign_id`;
    }

    query += `
        GROUP BY 
            HRU.employee_id, HRU.employee_code, HRU.first_name, HRU.last_name, 
            ADTC.average_days_to_close_position, ADTS.average_days_to_submit, 
            TC.total_candidates_handled, RC.total_rejected_candidates, SC.total_selected_candidates;
        `;

    const recruiterReport = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        month_id,
        financial_year_id,
        assign_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (recruiterReport.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the given filters.",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Recruiter month report fetched successfully.",
      data: recruiterReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.getRecruiterRoundReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, assign_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Entity ID is required.",
      });
    }

    let query = `
                WITH AverageDaysToClose AS (
                    SELECT 
                        JD.assign_id,
                        ROUND(AVG(DATEDIFF(RCOL.updatedAt, JD.start_date)), 1) AS average_days_to_close_position
                    FROM 
                        RECRUITMENT_JOB_DESCRIPITION AS JD
                    LEFT JOIN 
                        RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                        ON JD.id = JDE.job_descripition_id
                    LEFT JOIN 
                        RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                        ON JDE.id = RCOL.candidate_id 
                        AND RCOL.candidate_offer_status = 'ONBOARDED'
                    WHERE 
                        JD.entity_id = :entity_id
                        AND JD.isDeleted = 0
                        AND JDE.isDeleted = 0
                    GROUP BY 
                        JD.assign_id
                ),

                AverageDaysToSubmit AS (
                    SELECT 
                        JD.assign_id,
                        ROUND(AVG(DATEDIFF(JDE.createdAt, JD.start_date)), 1) AS average_days_to_submit
                    FROM 
                        RECRUITMENT_JOB_DESCRIPITION AS JD
                    INNER JOIN 
                        RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                        ON JD.id = JDE.job_descripition_id
                    WHERE 
                        JD.entity_id = :entity_id
                        AND JD.isDeleted = 0
                        AND JDE.isDeleted = 0
                    GROUP BY 
                        JD.assign_id
                ),

                TotalCandidates AS (
                    SELECT 
                        JD.assign_id,
                        COUNT(JD.id) AS total_candidates_handled
                    FROM 
                        RECRUITMENT_JOB_DESCRIPITION AS JD
                    INNER JOIN 
                        RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                        ON JD.id = JDE.job_descripition_id
                    LEFT JOIN 
                        RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                        ON JDE.id = RCOL.candidate_id 
                    WHERE 
                        JD.entity_id = :entity_id
                        AND JD.isDeleted = 0
                        AND JDE.isDeleted = 0
                    GROUP BY 
                        JD.assign_id
                ),
                RejectedCandidates AS (
                    SELECT 
                        JD.assign_id,
                        COUNT(JD.id) AS total_rejected_candidates
                    FROM 
                        RECRUITMENT_JOB_DESCRIPITION AS JD
                    INNER JOIN 
                        RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                        ON JD.id = JDE.job_descripition_id
                    LEFT JOIN 
                        RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                        ON JDE.id = RCOL.candidate_id 
                    WHERE 
                        JD.entity_id = :entity_id
                        AND JD.isDeleted = 0
                        AND JDE.isDeleted = 0
                        AND JDE.selection_status IN ('REJECTED', 'HOLD') 
                    GROUP BY 
                        JD.assign_id
                ),
                SelectedCandidates AS (
                    SELECT 
                        JD.assign_id,
                        COUNT(JD.id) AS total_selected_candidates
                    FROM 
                        RECRUITMENT_JOB_DESCRIPITION AS JD
                    INNER JOIN 
                        RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                        ON JD.id = JDE.job_descripition_id
                    LEFT JOIN 
                        RECRUITMENT_CANDIDATE_OFFER_LETTER AS RCOL 
                        ON JDE.id = RCOL.candidate_id 
                    WHERE 
                        JD.entity_id = :entity_id
                        AND JD.isDeleted = 0
                        AND JDE.isDeleted = 0
                        AND JDE.selection_status IN ('GO_FOR_BGV', 'SELECTED', 'APPROVED') 
                    GROUP BY 
                        JD.assign_id
                ),
                CandidateInterviews AS (
                    SELECT 
                        RCI.jd_id,
                        RCI.interview_round,
                        JD.level_of_interview,
                        CASE 
                            WHEN EXISTS (
                                SELECT 1 
                                FROM RECRUITMENT_CANDIDATE_INTERVIEW AS subRCI 
                                WHERE subRCI.jd_id = RCI.jd_id 
                                AND subRCI.interview_round = 1 
                                AND subRCI.round_status = 'COMPLETED'
                            ) THEN 'YES' 
                            ELSE 'NO' 
                        END AS first_round_completed,
                        CASE 
                            WHEN EXISTS (
                                SELECT 1 
                                FROM RECRUITMENT_CANDIDATE_INTERVIEW AS subRCI 
                                WHERE subRCI.jd_id = RCI.jd_id 
                                AND subRCI.interview_round = JD.level_of_interview 
                                AND subRCI.round_status = 'COMPLETED'
                            ) THEN 'YES' 
                            ELSE 'NO' 
                        END AS last_round_completed
                    FROM 
                        RECRUITMENT_CANDIDATE_INTERVIEW AS RCI
                    LEFT JOIN 
                        RECRUITMENT_JOB_DESCRIPITION AS JD 
                        ON RCI.jd_id = JD.id
                    WHERE JD.isDeleted = 0
                )

                SELECT 
                    HRU.employee_id,
                    HRU.employee_code,
                    JD.jd_number,
                    JD.job_title,
                    CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,
                    SUM(JD.number_of_positions) AS total_positions_handled,
                    SUM(CASE WHEN JD.isCompletedJd = 'COMPLETED' THEN JD.number_of_positions ELSE 0 END) AS total_positions_closed,
                    COALESCE(
                        (SELECT COUNT(DISTINCT RJDE.id) 
                        FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS RJDE 
                        WHERE RJDE.job_descripition_id = JD.id), 
                        0
                    ) AS total_candidates_submitted,
                    COALESCE(ADTC.average_days_to_close_position, 0) AS average_days_to_close_position,
                    COALESCE(ADTS.average_days_to_submit, 0) AS average_days_to_submit,
                    COALESCE(TC.total_candidates_handled, 0) AS total_candidates_handled,
                    COALESCE(RC.total_rejected_candidates, 0) AS total_rejected_candidates,
                    COALESCE(SC.total_selected_candidates, 0) AS total_selected_candidates,
                    COALESCE(CI.first_round_completed, 'NO') AS first_round_completed,
                    COALESCE(CI.last_round_completed, 'NO') AS last_round_completed,
                    CASE 
                        WHEN COALESCE(TC.total_candidates_handled, 0) > 0 THEN 
                            ROUND((COALESCE(RC.total_rejected_candidates, 0) * 100.0) / COALESCE(TC.total_candidates_handled, 1), 2)
                        ELSE 
                            0
                    END AS rejection_rate,
                    CASE 
                        WHEN COALESCE(TC.total_candidates_handled, 0) > 0 THEN 
                            ROUND((COALESCE(SC.total_selected_candidates, 0) * 100.0) / COALESCE(TC.total_candidates_handled, 1), 2)
                        ELSE 
                            0
                    END AS selection_rate
                FROM 
                    HRMS_REGISTERED_USER AS HRU
                INNER JOIN 
                    RECRUITMENT_JOB_DESCRIPITION AS JD 
                    ON HRU.employee_id = JD.assign_id
                LEFT JOIN 
                    AverageDaysToClose AS ADTC 
                    ON HRU.employee_id = ADTC.assign_id
                LEFT JOIN 
                    AverageDaysToSubmit AS ADTS 
                    ON HRU.employee_id = ADTS.assign_id
                LEFT JOIN 
                    TotalCandidates AS TC 
                    ON HRU.employee_id = TC.assign_id
                LEFT JOIN 
                    RejectedCandidates AS RC 
                    ON HRU.employee_id = RC.assign_id
                LEFT JOIN 
                    SelectedCandidates AS SC
                    ON HRU.employee_id = SC.assign_id
                LEFT JOIN 
                    CandidateInterviews AS CI
                    ON JD.id = CI.jd_id
                WHERE 
                    JD.entity_id = :entity_id
                    AND JD.isDeleted = 0
        `;

    if (month_id) {
      query += ` AND MONTH(JD.start_date) = :month_id`;
    }

    if (financial_year_id) {
      query += ` AND JD.financial_year_id = :financial_year_id`;
    }

    if (assign_id) {
      query += ` AND JD.assign_id = :assign_id`;
    }

    query += `
            GROUP BY 
                HRU.employee_id, HRU.employee_code, JD.jd_number,
                JD.job_title, HRU.first_name, HRU.last_name, 
                ADTC.average_days_to_close_position, ADTS.average_days_to_submit, 
                TC.total_candidates_handled, RC.total_rejected_candidates, SC.total_selected_candidates,
                CI.first_round_completed, CI.last_round_completed, JD.id;
        `;

    const recruiterReport = await db.sequelize.query(query, {
      replacements: {
        entity_id,
        month_id,
        financial_year_id,
        assign_id,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (recruiterReport.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the given filters.",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Recruiter month report fetched successfully.",
      data: recruiterReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching the data. Please try again later.",
    });
  }
};

exports.getBackoutCandidatesReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT 
                JD.id,
                JD.jd_number,
                JD.job_title,
                JDE.id AS candidate_id,
                CONCAT(JDE.first_name, ' ', JDE.last_name) AS candidate_name,
                CONCAT(JDE.email, ' | ', JDE.contact_number) AS contact_details,
                COL.exp_joining_date,
                DATE_FORMAT(COL.updatedAt, '%Y-%m-%d') AS backout_date,
                COL.candidate_remarks
            FROM 
                RECRUITMENT_JOB_DESCRIPITION JD
            LEFT JOIN 
                RECRUITMENT_JOB_DESCRIPITION_EMAIL JDE ON JDE.job_descripition_id = JD.id
            LEFT JOIN 
                RECRUITMENT_CANDIDATE_OFFER_LETTER COL ON COL.candidate_id = JDE.id
            WHERE 
                JD.isDeleted = 0 AND JD.entity_id = :entity_id
                AND JDE.isDeleted = 0
                AND COL.isDeleted = 0 AND COL.entity_id = 1
                AND COL.candidate_offer_status IN ('REJECTED', 'PENDING')
                AND COL.exp_joining_date < CURDATE()
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(COL.updatedAt) = :month_id`;
      replacements.month_id = month_id;
    }

    if (financial_year_id) {
      query += ` AND YEAR(COL.updatedAt) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }

    const backoutCandidates = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!backoutCandidates.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Backout candidates report fetched successfully.",
      data: backoutCandidates,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getInterviewerReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const {
      month_id,
      financial_year_id,
      selected_round,
      interviewer_id,
      selectedStatus,
    } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
                        SELECT
                RCI.interviewer_id,
                CONCAT(HR.first_name,' ' ,HR.last_name) AS interviewer_name,
                CI.jd_id,
                JD.jd_number,
                JD.job_title,
                CI.candidate_id,
                CONCAT(JDE.first_name,' ',JDE.last_name) AS candidate_name,
                CI.interview_date,
                CI.interview_round as interview_stage,
                JDE.selection_status
            FROM
                RECRUITMENT_CANDIDATE_INTERVIEWER AS RCI
                LEFT JOIN RECRUITMENT_CANDIDATE_INTERVIEW AS CI ON CI.candidate_id = RCI.candidate_id
                LEFT JOIN HRMS_REGISTERED_USER HR ON HR.employee_id = RCI.interviewer_id
                LEFT JOIN RECRUITMENT_JOB_DESCRIPITION JD ON JD.id = CI.jd_id
                LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL JDE ON JDE.id= CI.candidate_id
            WHERE JD.entity_id = :entity_id
            AND CI.entity_id = :entity_id
            AND JD.isDeleted = 0
            AND JDE.isDeleted = 0
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(CI.interview_date) = :month_id`;
      replacements.month_id = month_id;
    }

    if (financial_year_id) {
      query += ` AND YEAR(CI.interview_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }

    if (selected_round) {
      if (selected_round === "First Round") {
        query += ` AND CI.interview_round = 1`;
      } else if (selected_round === "Final Round") {
        query += ` AND CI.interview_round = JD.level_of_interview`;
      }
    }

    if (interviewer_id) {
      query += ` AND RCI.interviewer_id = :interviewer_id`;
      replacements.interviewer_id = interviewer_id;
    }

    if (selectedStatus) {
      query += ` AND JDE.selection_status = :selectedStatus`;
      replacements.selectedStatus = selectedStatus;
    }

    const interviewerReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!interviewerReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Interviewer report fetched successfully.",
      data: interviewerReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getMonthlyInterviewerReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const {
      month_id,
      financial_year_id,
      selected_round,
      interviewer_id,
      selectedStatus,
    } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT 
                JD.id,
                JD.jd_number, 
                JD.job_title,
                JD.assign_id,
                JDE.id AS candidate_id,
                CONCAT(JDE.first_name, ' ', JDE.last_name) AS candidate_name,
                CONCAT(HRR.first_name, ' ', HRR.last_name) AS recruiter_name,
                CI.interview_date,
                CI.interview_round,
                RCI.interview_status,
                RCI.interviewer_id,
                CONCAT(HRI.first_name, ' ', HRI.last_name) AS interviewer_name
            FROM RECRUITMENT_JOB_DESCRIPITION AS JD
            LEFT JOIN HRMS_REGISTERED_USER AS HRR 
                ON HRR.employee_id = JD.assign_id 
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JDE.job_descripition_id = JD.id 
            LEFT JOIN RECRUITMENT_CANDIDATE_INTERVIEW AS CI 
                ON CI.candidate_id = JDE.id 
            LEFT JOIN RECRUITMENT_CANDIDATE_INTERVIEWER AS RCI 
                ON RCI.candidate_id = CI.candidate_id 
                AND RCI.interview_round = CI.interview_round
            LEFT JOIN HRMS_REGISTERED_USER AS HRI 
                ON HRI.employee_id = RCI.interviewer_id 
            WHERE JD.entity_id = :entity_id
            AND JD.isDeleted = 0
            AND JDE.isDeleted = 0
            AND JDE.selection_status IN ('GO_FOR_BGV','SELECTED','APPROVED')
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(CI.interview_date) = :month_id`;
      replacements.month_id = month_id;
    }

    if (financial_year_id) {
      query += ` AND YEAR(CI.interview_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }

    if (selected_round) {
      if (selected_round === "First Round") {
        query += ` AND CI.interview_round = 1`;
      } else if (selected_round === "Final Round") {
        query += ` AND CI.interview_round = JD.level_of_interview`;
      }
    }

    if (interviewer_id) {
      query += ` AND RCI.interviewer_id = :interviewer_id`;
      replacements.interviewer_id = interviewer_id;
    }

    if (selectedStatus) {
      query += ` AND RCI.interview_status = :selectedStatus`;
      replacements.selectedStatus = selectedStatus;
    }

    query += ` ORDER BY JD.id DESC`;

    const interviewerReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!interviewerReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Interviewer report fetched successfully.",
      data: interviewerReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.getInterviewerStatusReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, interviewer_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
SELECT 
    CIR.interviewer_id,
    CONCAT(HRU.first_name, ' ', HRU.last_name) AS interviewer_name,
    JD.jd_number,
    JD.job_title,
    COUNT(CIR.candidate_id) AS total_interviews_conducted,
    SUM(CASE WHEN JDE.selection_status IN ('GO_FOR_BGV', 'SELECTED', 'APPROVED', 'COMPLETED') THEN 1 ELSE 0 END) AS total_selected_candidates,
    SUM(CASE WHEN JDE.selection_status = 'REJECTED' THEN 1 ELSE 0 END) AS total_rejected_candidates,
    SUM(CASE WHEN JDE.selection_status = 'HOLD' THEN 1 ELSE 0 END) AS total_hold_candidates
FROM RECRUITMENT_CANDIDATE_INTERVIEWER AS CIR
LEFT JOIN HRMS_REGISTERED_USER AS HRU 
    ON HRU.employee_id = CIR.interviewer_id
LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
    ON JDE.id = CIR.candidate_id
LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD 
    ON JD.id = JDE.job_descripition_id
WHERE JD.entity_id = 1
AND JD.isDeleted = 0
AND JDE.isDeleted = 0
        `;

    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(CIR.createdAt) = :month_id`;
      replacements.month_id = month_id;
    }

    if (financial_year_id) {
      query += ` AND YEAR(CIR.createdAt) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }

    if (interviewer_id) {
      query += ` AND CIR.interviewer_id = :interviewer_id`;
      replacements.interviewer_id = interviewer_id;
    }

    query += ` GROUP BY CIR.interviewer_id, HRU.first_name, HRU.last_name, JD.jd_number, JD.job_title;`;

    const interviewerReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!interviewerReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Interviewer report fetched successfully.",
      data: interviewerReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};
exports.getOnboardingReport = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { month_id, financial_year_id, department_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .json({ code: 400, message: "Entity ID is required." });
    }

    let query = `
            SELECT 
                JDE.id as candidate_id, 
                CONCAT(JDE.first_name, ' ', JDE.last_name) AS candidate_name,
                JD.job_title,
                JD.department_id,
                MD.department_name,
                DATE_FORMAT(COL.exp_joining_date, '%Y-%m-%d') AS exp_joining_date,
                DATE_FORMAT(COL.updatedAt, '%Y-%m-%d') AS onboarding_completion_date,
                JDE.bgv_status AS induction_status
            FROM RECRUITMENT_JOB_DESCRIPITION AS JD
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS JDE 
                ON JDE.job_descripition_id = JD.id
            LEFT JOIN RECRUITMENT_CANDIDATE_OFFER_LETTER AS COL 
                ON COL.candidate_id = JDE.id
            LEFT JOIN MASTER_DEPARTMENT AS MD
                ON MD.dept_id = JD.department_id
            WHERE JD.entity_id = :entity_id
            AND JD.isDeleted = 0
            AND COL.candidate_offer_status = 'ONBOARDED'
        `;
    const replacements = { entity_id };

    if (month_id) {
      query += ` AND MONTH(COL.exp_joining_date) = :month_id`;
      replacements.month_id = month_id;
    }

    if (financial_year_id) {
      query += ` AND YEAR(COL.exp_joining_date) = :financial_year_id`;
      replacements.financial_year_id = financial_year_id;
    }

    if (department_id) {
      query += ` AND JD.department_id = :department_id`;
      replacements.department_id = department_id;
    }

    const onboardingReport = await db.sequelize.query(query, {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!onboardingReport.length) {
      return res
        .status(404)
        .json({ code: 404, message: "No data found for the given filters." });
    }

    return res.status(200).json({
      code: 200,
      message: "Onboarding report fetched successfully.",
      data: onboardingReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "An error occurred. Please try again later.",
    });
  }
};
