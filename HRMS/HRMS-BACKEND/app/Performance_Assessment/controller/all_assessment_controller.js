const db = require("../../models/index");
const { QueryTypes } = require("sequelize");
const committee_approved_model = require("../../ESS/Self_Assessment/model/committee_approved_model");

exports.getall_assessment_dept_wise = async (req, res) => {
  try {
    const { entity_id, filter_fy, yearly_assessment_id } = req.query;
    if (!entity_id || !filter_fy || !yearly_assessment_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing required query parameters." });
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
    COUNT(CASE WHEN psa.status IN ('Approval Review Completed') THEN 1 END) AS pending_commitee_review,
    COUNT(CASE WHEN psa.status IS NULL THEN 1 END) AS pending_self_assessment,
    COUNT(psa.id) AS all_submitted_num
FROM 
    HRMS_REGISTERED_USER u
JOIN 
    MASTER_DEPARTMENT md 
    ON u.department_id = md.dept_id
LEFT JOIN 
    PM_SUBMITTED_ASSESSMENT psa 
    ON u.employee_id = psa.user_id
    AND psa.yearly_assessment_id = :yearly_assessment_id
    AND psa.entity_id = :entity_id
    AND psa.financial_year_id = :filter_fy
    AND psa.isDeleted = false
WHERE 
    u.isDeleted = false
    AND u.status = 'ACTIVE'
    AND psa.user_id = u.employee_id  -- Ensuring only matching user_id to employee_id
GROUP BY 
    u.employee_id, md.dept_id, md.department_name;
        `;
    const results = await db.sequelize.query(query, {
      replacements: { entity_id, filter_fy, yearly_assessment_id },
      type: db.sequelize.QueryTypes.SELECT,
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
      acc[departmentId].completed_assessment +=
        parseInt(employee.completed_assessment) || 0;
      acc[departmentId].pending_assessment +=
        parseInt(employee.pending_review_assessment) +
          parseInt(employee.pending_self_assessment) || 0;
      acc[departmentId].pending_self_assessment +=
        parseInt(employee.pending_self_assessment) || 0;
      acc[departmentId].pending_manager_review +=
        parseInt(employee.pending_manager_review) || 0;
      acc[departmentId].pending_commitee_review +=
        parseInt(employee.pending_commitee_review) || 0;

      return acc;
    }, {});
    const responseData = Object.values(departmentData);

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_assessmentlist_by_dept = async (req, res) => {
  try {
    const { entity_id, filter_fy, yearly_assessment_id, department_id } =
      req.query;

    if (!entity_id || !filter_fy || !yearly_assessment_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing required query parameters." });
    }
    const query = `
       WITH behavioral_ratings AS (
            SELECT 
                u.employee_id, 
                u.first_name, 
                u.last_name, 
                u.employee_code, 
                SUM(CAST(REGEXP_SUBSTR(evl.final_rating, '[0-9.]+') AS DECIMAL) / 5) AS total_behavioral_final_rating
            FROM 
                HRMS_REGISTERED_USER u
            LEFT JOIN 
                ESS_BEHAVIORAL_VL_ASSESSMENT evl ON u.employee_id = evl.employee_id
            GROUP BY 
                u.employee_id, u.first_name, u.last_name, u.employee_code
        ),
        committee_ratings AS (
            SELECT 
                eca.employee_id AS committee_employee_id,
                u.employee_id AS user_employee_id,
                u.first_name,
                u.last_name,
                u.employee_code,
                (SUM(CAST(esra.self_rating_value AS DECIMAL)) / 5) - 1 AS final_rating
            FROM 
                ESS_COMMITTEE_ASSESSMENT_RATING eca
            INNER JOIN
                ESS_SELF_RATING_ASSESSMENT esra ON eca.self_rating_id = esra.id
            LEFT JOIN 
                HRMS_REGISTERED_USER u ON eca.employee_id = u.employee_id
            GROUP BY 
                eca.employee_id, u.employee_id, u.first_name, u.last_name, u.employee_code
        ),
        kpi_ratings AS (
            SELECT 
                u.employee_id,
                u.first_name,
                u.last_name,
                u.employee_code,
                MAX(CAST(REGEXP_SUBSTR(eta.final_rating, '[0-9.]+') AS DECIMAL)) AS final_rating_numeric,
                COUNT(eta.kpa_id) AS kpi_count,
                CASE 
                    WHEN COUNT(eta.kpa_id) > 0 THEN 
                        SUM(CAST(REGEXP_SUBSTR(eta.final_rating, '[0-9.]+') AS DECIMAL)) / COUNT(eta.kpa_id)
                    ELSE 0
                END AS final_rating_per_kpi
            FROM 
                HRMS_REGISTERED_USER u
            LEFT JOIN 
                ESS_TECHNICAL_ASSESSMENT eta ON u.employee_id = eta.employee_id
            GROUP BY 
                u.employee_id, u.first_name, u.last_name, u.employee_code
        ),
        RatingData AS (
              SELECT 
                u.employee_id, 
                u.first_name, 
                u.last_name, 
                u.employee_code, 
                -- Safeguard against division by zero for Collouage_Final_Rating
                COALESCE(
                    (SUM(sra.self_rating_value) / NULLIF(COUNT(sra.self_rating_value), 0)) - 1, 
                    0
                ) AS Collouage_Final_Rating,
                COUNT(sra.self_rating_value) AS self_rating_count,
                GROUP_CONCAT(sra.self_rating_value ORDER BY sra.self_rating_value) AS self_rating_values
            FROM 
                HRMS_REGISTERED_USER u
            JOIN 
                ESS_COLLEAGUE_REVIEW ecr ON u.employee_id = ecr.employee_id
            JOIN 
                ESS_SELF_RATING_ASSESSMENT sra ON sra.id = ecr.self_rating_id
            GROUP BY 
                u.employee_id, u.first_name, u.last_name, u.employee_code
                )
    
        SELECT 
            u.employee_id,
            CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
            u.employee_code,
            COALESCE(psa.status, 'Pending For Self Assessment') AS status, 
            psa.id AS submitted_assessment_id,
            u.role_master_name, 
            u.employee_official_email, 
            md.dept_id AS department_id,
            md.department_name,
            COUNT(CASE WHEN psa.status = 'Committee Review Completed' THEN 1 END) AS completed_assessment,
            COUNT(CASE WHEN psa.status IN ('Pending For Manager Review', 'Manager Review Completed') THEN 1 END) AS pending_review_assessment,
            COUNT(CASE WHEN psa.status IN ('Pending For Manager Review') THEN 1 END) AS pending_manager_review,
            COUNT(CASE WHEN psa.status IN ('Pending Committee Review') THEN 1 END) AS pending_commitee_review,
            COUNT(CASE WHEN COALESCE(psa.status, 'Pending For Self Assessment') = 'Pending Committee Review' THEN 1 END) AS pending_commitee_review,
            COUNT(CASE WHEN psa.status IS NULL THEN 1 END) AS pending_self_assessment,
            COUNT(psa.id) AS all_submitted_num,
            eta.final_rating, 
            br.total_behavioral_final_rating,
            cr.final_rating AS committee_final_rating,
            kr.final_rating_numeric, 
            rd.Collouage_Final_Rating, -- Use the Collouage_Final_Rating from the RatingData CTE
            kr.kpi_count,
            kr.final_rating_per_kpi,
            CASE
                WHEN rd.Collouage_Final_Rating IS NOT NULL AND rd.Collouage_Final_Rating != 0 AND cr.final_rating IS NOT NULL THEN
                    (br.total_behavioral_final_rating + cr.final_rating + rd.Collouage_Final_Rating) / 3
                WHEN rd.Collouage_Final_Rating IS NULL AND cr.final_rating IS NOT NULL THEN
                    (br.total_behavioral_final_rating + cr.final_rating) / 2
                WHEN rd.Collouage_Final_Rating IS NOT NULL AND cr.final_rating IS NULL THEN
                    (br.total_behavioral_final_rating + rd.Collouage_Final_Rating) / 2
                ELSE
                    br.total_behavioral_final_rating
            END AS combined_final_rating
        FROM 
            HRMS_REGISTERED_USER u
        JOIN 
            HRMS_REGISTERED_USERS_ENTITY ue ON u.employee_id = ue.employee_id
        JOIN 
            MASTER_DEPARTMENT md ON u.department_id = md.dept_id
        LEFT JOIN 
            PM_SUBMITTED_ASSESSMENT psa ON u.employee_id = psa.user_id
            AND psa.yearly_assessment_id = :yearly_assessment_id
            AND psa.entity_id = :entity_id
            AND psa.financial_year_id = :filter_fy
            AND psa.isDeleted = false
        LEFT JOIN 
            ESS_TECHNICAL_ASSESSMENT eta ON u.employee_id = eta.employee_id
        LEFT JOIN 
            behavioral_ratings br ON u.employee_id = br.employee_id
        LEFT JOIN 
            committee_ratings cr ON u.employee_id = cr.user_employee_id
        LEFT JOIN 
            kpi_ratings kr ON u.employee_id = kr.employee_id
        LEFT JOIN 
            RatingData rd ON u.employee_id = rd.employee_id -- Join with RatingData CTE
        WHERE 
            ue.entity_id = :entity_id 
            AND u.isDeleted = false
            AND u.status = 'ACTIVE'
            ${department_id ? "AND md.dept_id = :department_id" : ""}
        GROUP BY 
            u.employee_id, 
            md.dept_id, 
            md.department_name, 
            psa.status, 
            psa.id, 
            eta.final_rating, 
            br.total_behavioral_final_rating, 
            cr.final_rating, 
            kr.final_rating_numeric, 
            kr.kpi_count;

        `;

    const replacements = {
      entity_id,
      filter_fy,
      yearly_assessment_id,
    };
    if (department_id) replacements.department_id = department_id;

    console.log("Executing SQL query with replacements:", query);
    console.log("Replacements:", replacements);

    const results = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });
    console.log("Query Results:", results);
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
          user_data: [],
        };
      }
      acc[departmentId].no_of_employee += 1;
      acc[departmentId].completed_assessment +=
        parseInt(employee.completed_assessment) || 0;
      acc[departmentId].pending_assessment +=
        parseInt(employee.pending_review_assessment) +
          parseInt(employee.pending_self_assessment) || 0;
      acc[departmentId].pending_self_assessment +=
        parseInt(employee.pending_self_assessment) || 0;
      acc[departmentId].pending_manager_review +=
        parseInt(employee.pending_manager_review) || 0;
      acc[departmentId].pending_commitee_review +=
        parseInt(employee.pending_commitee_review) || 0;

      if (acc[departmentId].user_data.length < 6) {
        const formattedFinalRatingPerKpi = parseFloat(
          employee.final_rating_per_kpi
        ).toFixed(2);
        const formattedCombinedFinalRating = parseFloat(
          employee.combined_final_rating
        ).toFixed(2);
        const formattedCollouageFinalRating = isNaN(
          parseFloat(employee.Collouage_Final_Rating)
        )
          ? 0
          : parseFloat(employee.Collouage_Final_Rating).toFixed(2);

        const OverAll =
          parseFloat(formattedFinalRatingPerKpi) +
          parseFloat(formattedCombinedFinalRating);
        const FinalOverAll = OverAll / 2;
        acc[departmentId].user_data.push({
          employee_id: employee.employee_id,
          employee_name: employee.employee_name,
          employee_code: employee.employee_code,
          status: employee.status,
          final_rating_per_kpi: formattedFinalRatingPerKpi,
          combined_final_rating: formattedCombinedFinalRating,
          Collouage_Final_Rating: formattedCollouageFinalRating,
          final_overall_rating: FinalOverAll.toFixed(2),
          submitted_assessment_id: employee.submitted_assessment_id,
        });
      }

      return acc;
    }, {});
    console.log("Department Data Accumulator:", departmentData);
    const responseData = Object.values(departmentData);
    if (responseData.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "No data found for the given criteria." });
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getall_committee_review_list = async (req, res) => {
  try {
    const { entity_id, filter_fy, status, login_id } = req.query;

    if (!entity_id || !filter_fy || !status || !login_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing required query parameters." });
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
        login_id,
      },
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
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
      self_committee_review,
      committee_average_rating,
    } = req.body;

    console.log(req.body);
    //   return;
    if (
      self_committee_review &&
      self_committee_review.reviews &&
      self_committee_review.reviews.length > 0
    ) {
      const committee_assess_review = self_committee_review.reviews.map(
        (element) => ({
          competence: element.Competence,
          submit_assessment_id: submitted_assessment_id,
          assign_user_id: assign_user_id,
          entity_id: entity_id,
          self_rating_id: element.rating,
          financial_year_id: financial_id,
          employee_id: employee_id,
          remark: remark,
        })
      );

      await db.committee_assess_rating.bulkCreate(committee_assess_review);
    }

    await db.committee_assign_user.update(
      {
        committee_rating_status: "CLOSE",
        committee_average_rating: committee_average_rating,
      },
      {
        where: {
          submit_assessment_id: submitted_assessment_id,
          assign_user_id: assign_user_id,
          entity_id: entity_id,
          financial_year_id: financial_id,
          isDeleted: false,
        },
      }
    );

    const allStatus = await db.committee_assign_user.findAll({
      where: {
        submit_assessment_id: submitted_assessment_id,
        entity_id: entity_id,
        financial_year_id: financial_id,
        isDeleted: false,
      },
    });

    const isAnyOpen = allStatus.some(
      (item) => item.committee_rating_status === "OPEN"
    );

    if (!isAnyOpen) {
      await db.submitted_assessment.update(
        { status: status },
        {
          where: {
            id: submitted_assessment_id,
            entity_id: entity_id,
            financial_year_id: financial_id,
          },
        }
      );
    }

    return res.status(200).send({
      code: 200,
      message: "Send For Committee Review Successfully!",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_Alldata_Showdashboard = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing required query parameters." });
    }
    const query = `
      SELECT 
        COUNT(CASE WHEN status = 'Pending For Manager Review' THEN 1 END) AS pending_manager_review,
        COUNT(CASE WHEN status = 'Pending Committee Review' THEN 1 END) AS pending_commitee_review,
        COUNT(CASE WHEN status = 'Pending For Approval' THEN 1 END) AS pending_for_approval,
        COUNT(CASE WHEN status = 'Manager Review Completed' THEN 1 END) AS self_assessment_completed
      FROM PM_SUBMITTED_ASSESSMENT
      WHERE entity_id = :entity_id;
    `;
    const results = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the provided entity_id",
      });
    }

    const renamedResults = [
      {
        status: "Pending For Manager Review",
        count: results[0].pending_manager_review,
      },
      {
        status: "Pending Committee Review",
        count: results[0].pending_commitee_review,
      },
      {
        status: "Pending For Approval",
        count: results[0].pending_for_approval,
      },
      {
        status: "Self Assessment Completed",
        count: results[0].self_assessment_completed,
      },
    ];

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: renamedResults,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_Alldata_ShowDashboard_Selfrating = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required query parameters.",
      });
    }
    const query = `
        SELECT 
        ESS_TECHNICAL_ASSESSMENT.kpa_id, 
        HRMS_KPA_MASTER.id AS kpa_master_id, 
        HRMS_KPA_MASTER.activity,
        HRMS_KPA_MASTER.kpi_data,
        ESS_TECHNICAL_ASSESSMENT.employee_id,
        ESS_TECHNICAL_ASSESSMENT.self_rating_id,
        ESS_SELF_RATING_ASSESSMENT.id AS self_rating_assessment_id,
        ESS_SELF_RATING_ASSESSMENT.self_rating,
        ESS_SELF_RATING_ASSESSMENT.self_rating_value,
        ESS_TECHNICAL_ASSESSMENT.submit_assessment_id,
        PM_SUBMITTED_ASSESSMENT.id AS pm_submitted_assessment_id,
        PM_SUBMITTED_ASSESSMENT.yearly_assessment_id,
        PM_YEARLY_ASSESSMENT_SETUP.assessment_name,
        PM_SUBMITTED_ASSESSMENT.user_id,
        HRMS_REGISTERED_USER.employee_id AS registered_user_employee_id,
        HRMS_REGISTERED_USER.employee_code,
        HRMS_REGISTERED_USER.first_name,
        HRMS_REGISTERED_USER.middle_name,
        HRMS_REGISTERED_USER.last_name
    FROM 
        ESS_TECHNICAL_ASSESSMENT
    JOIN 
        HRMS_KPA_MASTER ON HRMS_KPA_MASTER.id = ESS_TECHNICAL_ASSESSMENT.kpa_id
    JOIN 
        ESS_SELF_RATING_ASSESSMENT ON ESS_SELF_RATING_ASSESSMENT.id = ESS_TECHNICAL_ASSESSMENT.self_rating_id
    JOIN
        PM_SUBMITTED_ASSESSMENT ON PM_SUBMITTED_ASSESSMENT.id = ESS_TECHNICAL_ASSESSMENT.submit_assessment_id
    JOIN 
        PM_YEARLY_ASSESSMENT_SETUP 
        ON PM_YEARLY_ASSESSMENT_SETUP.id = PM_SUBMITTED_ASSESSMENT.yearly_assessment_id
    JOIN 
        HRMS_REGISTERED_USER 
        ON HRMS_REGISTERED_USER.employee_id = PM_SUBMITTED_ASSESSMENT.user_id
    WHERE 
        PM_SUBMITTED_ASSESSMENT.entity_id = :entity_id;

    `;
    const results = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (results.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the provided entity_id",
      });
    }
    const data = results;
    return res.status(200).send({
      code: 200,
      data,
      message: "Data fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).send({
      code: 500,
      message: "An error occurred while processing your request.",
    });
  }
};

exports.get_Alldata_ShowDashboard_ReportingManager = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required query parameters.",
      });
    }
    const query = `
              SELECT 
              ESS_TECHNICAL_ASSESSMENT.kpa_id,
              HRMS_KPA_MASTER.id AS kpa_master_id,
              HRMS_KPA_MASTER.activity,
              HRMS_KPA_MASTER.kpi_data,
              ESS_TECHNICAL_ASSESSMENT.employee_id,
              HRMS_REGISTERED_USER.employee_id AS hrms_employee_id,
              HRMS_REGISTERED_USER.employee_code,
              HRMS_REGISTERED_USER.first_name,
              HRMS_REGISTERED_USER.middle_name,
              HRMS_REGISTERED_USER.last_name,
              ESS_TECHNICAL_ASSESSMENT.submit_assessment_id,
              PM_SUBMITTED_ASSESSMENT.id AS pm_assessment_id,
              PM_SUBMITTED_ASSESSMENT.yearly_assessment_id,
              ESS_TECHNICAL_ASSESSMENT.manager_rating_id,
              ESS_SELF_RATING_ASSESSMENT.self_rating,
              ESS_SELF_RATING_ASSESSMENT.id AS self_rating_assessment_id,
              ESS_SELF_RATING_ASSESSMENT.self_rating_value AS Manager_Rating_Value,
              ESS_TECHNICAL_ASSESSMENT.approval_manager_rating_id,
              approval_rating.self_rating_value AS approval_manager_self_rating_value,
              approval_rating.self_rating AS approval_manager_self_rating
          FROM 
              ESS_TECHNICAL_ASSESSMENT
          JOIN 
              HRMS_KPA_MASTER ON ESS_TECHNICAL_ASSESSMENT.kpa_id = HRMS_KPA_MASTER.id
          JOIN 
              HRMS_REGISTERED_USER ON ESS_TECHNICAL_ASSESSMENT.employee_id = HRMS_REGISTERED_USER.employee_id
          JOIN 
              PM_SUBMITTED_ASSESSMENT ON ESS_TECHNICAL_ASSESSMENT.submit_assessment_id = PM_SUBMITTED_ASSESSMENT.id
          JOIN 
              ESS_SELF_RATING_ASSESSMENT ON ESS_TECHNICAL_ASSESSMENT.manager_rating_id = ESS_SELF_RATING_ASSESSMENT.id
          LEFT JOIN 
              ESS_SELF_RATING_ASSESSMENT AS approval_rating 
              ON ESS_TECHNICAL_ASSESSMENT.approval_manager_rating_id = approval_rating.id
          WHERE 
              PM_SUBMITTED_ASSESSMENT.entity_id = :entity_id;

      `;
    const results = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the provided entity_id",
      });
    }
    return res.status(200).send({
      code: 200,
      data: results,
      message: "Data fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching data for dashboard:", error);
    return res.status(500).send({
      code: 500,
      message: "An error occurred while processing your request.",
    });
  }
};

exports.get_BehviourRating_Alldata = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required query parameters.",
      });
    }

    const query = `
                SELECT 
                ESS_BEHAVIORAL_VL_ASSESSMENT.submit_assessment_id, 
                PM_SUBMITTED_ASSESSMENT.id AS pm_assessment_id, 
                PM_SUBMITTED_ASSESSMENT.yearly_assessment_id,
                ESS_BEHAVIORAL_VL_ASSESSMENT.manager_self_rating AS manager_rating, 
                ESS_SELF_RATING_ASSESSMENT.id AS self_rating_id,
                ESS_SELF_RATING_ASSESSMENT.self_rating AS manager_self_rating_value, 
                ESS_SELF_RATING_ASSESSMENT.self_rating_value AS manager_rating_value,
                ESS_BEHAVIORAL_VL_ASSESSMENT.competence,
                ESS_BEHAVIORAL_VL_ASSESSMENT.approval_m_r_id AS approval_manager_rating_id,
                approval_assessment.self_rating AS approval_manager_rating_value,
                approval_assessment.self_rating_value AS approval_manager_rating_value_value,
                ESS_BEHAVIORAL_VL_ASSESSMENT.employee_id AS employee_id,
                HRMS_REGISTERED_USER.employee_id AS hrms_employee_id
            FROM 
                ESS_BEHAVIORAL_VL_ASSESSMENT
            JOIN 
                PM_SUBMITTED_ASSESSMENT 
                    ON ESS_BEHAVIORAL_VL_ASSESSMENT.submit_assessment_id = PM_SUBMITTED_ASSESSMENT.id
            JOIN 
                ESS_SELF_RATING_ASSESSMENT 
                    ON ESS_BEHAVIORAL_VL_ASSESSMENT.manager_self_rating = ESS_SELF_RATING_ASSESSMENT.id
            JOIN 
                ESS_SELF_RATING_ASSESSMENT AS approval_assessment
                    ON approval_assessment.id = ESS_BEHAVIORAL_VL_ASSESSMENT.approval_m_r_id
            JOIN 
                HRMS_REGISTERED_USER 
                    ON HRMS_REGISTERED_USER.employee_id = ESS_BEHAVIORAL_VL_ASSESSMENT.employee_id
            WHERE 
                ESS_BEHAVIORAL_VL_ASSESSMENT.entity_id = :entity_id;

      `;

    const results = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the provided entity_id",
      });
    }

    return res.status(200).send({
      code: 200,
      data: results,
      message: "Data fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching data for dashboard:", error);
    return res.status(500).send({
      code: 500,
      message: "An error occurred while processing your request.",
    });
  }
};

exports.getAll_doughnutchartData = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required query parameter: entity_id.",
      });
    }

        const query = `
          SELECT 
          PM_SUBMITTED_ASSESSMENT.*
          FROM 
            PM_SUBMITTED_ASSESSMENT 
          WHERE 
            entity_id = :entity_id;
        `;
    const results = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No data found for the provided entity_id.",
      });
    }

    return res.status(200).send({
      code: 200,
      data: results,
      message: "Data fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching data for dashboard:", error);
    return res.status(500).send({
      code: 500,
      message: "An error occurred while processing your request.",
    
    });
  }
};

