const db = require("../../../models/index");
const { Op } = require("sequelize");

exports.customerWiseSalesBooking = async (req, res) =>{
    try {
        
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);

        const offset = (page - 1) * limit;

        const query = `
          
            SELECT * FROM (

                -- ------------------------------------------------------------------
                -- QUOTATION — only proposals with NO PI created yet (PI.id IS NULL)
                -- ------------------------------------------------------------------
                SELECT
                    'quotation' AS trackingType,
                    C.id AS quotationId,
                    V.id AS versionId,
                    CAST(NULL AS UNSIGNED) AS piId,
                    CAST(NULL AS UNSIGNED) AS sbId,
                    CONVERT(C.proposal_no USING utf8mb4) AS proposalNo,
                    CONVERT(CPM2.company_name USING utf8mb4) AS companyName,
                    CONVERT(CONCAT(R.first_name, ' ', R.last_name) USING utf8mb4) AS leadOwner,
                    C.grant_total AS grantTotal,
                    V.currency_id AS currencyId,
                    V.version AS version,
                    CONVERT(C.mail_id USING utf8mb4) AS mailId,
                    CONVERT(C.contact_person_name USING utf8mb4) AS contactPersonName,
                    CONVERT(C.gst_no USING utf8mb4) AS gstNo,
                    CONVERT(PI.pi_number USING utf8mb4) AS piNumber,
                    CONVERT(NULL USING utf8mb4) AS salesBookingNo,
                    CONVERT(DATE_FORMAT(C.createdAt, '%Y-%m-%d') USING utf8mb4) AS createdAt,
                    CONVERT(C.proposal_status USING utf8mb4) AS actionStatus
                FROM CRM_CREATE_PROPOSAL_MST AS C
                INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
                INNER JOIN CUSTOMER_PROFILE_MST AS CPM2 ON C.customer_id = CPM2.id
                LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.employee_id
                LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PI ON PI.proposal_id = C.id
                LEFT JOIN (
                    SELECT vp1.*
                    FROM CRM_VERSION_PROPOSAL_MST vp1
                    INNER JOIN (
                        SELECT proposal_id, MAX(id) AS max_id
                        FROM CRM_VERSION_PROPOSAL_MST
                        GROUP BY proposal_id
                    ) vp2 ON vp1.id = vp2.max_id
                ) AS V ON V.proposal_id = C.id
                WHERE V.id IS NOT NULL
                AND C.quotation_type = 'in direct'
                AND C.dealer = false
                AND PI.id IS NULL
                AND C.customer_id = ${req.query?.customer_id}                                                -- << stops showing once a PI exists
                -- AND C.employee_id = 107                                        -- optional self-only filter
                -- AND (C.employee_id = 107 OR R.reporting_manager_id = 107)      -- optional team filter
                GROUP BY C.id

                UNION ALL

                -- ------------------------------------------------------------------
                -- PERFORMA INVOICE — only PIs with NO sales booking created yet
                -- ------------------------------------------------------------------
                SELECT
                    'pi' AS trackingType,
                    cpm.id AS quotationId,
                    cvm.id AS versionId,
                    ppi.id AS piId,
                    CAST(NULL AS UNSIGNED) AS sbId,
                    CONVERT(cpm.proposal_no USING utf8mb4) AS proposalNo,
                    CONVERT(cp.company_name USING utf8mb4) AS companyName,
                    CONVERT(CONCAT(hru.first_name, ' ', hru.last_name) USING utf8mb4) AS leadOwner,
                    cpm.grant_total AS grantTotal,
                    cvm.currency_id AS currencyId,
                    cvm.version AS version,
                    CONVERT(cpm.mail_id USING utf8mb4) AS mailId,
                    CONVERT(cpm.contact_person_name USING utf8mb4) AS contactPersonName,
                    CONVERT(cp.gst_in USING utf8mb4) AS gstNo,
                    CONVERT(ppi.pi_number USING utf8mb4) AS piNumber,
                    CONVERT(NULL USING utf8mb4) AS salesBookingNo,
                    CONVERT(DATE_FORMAT(ppi.createdAt, '%Y-%m-%d') USING utf8mb4) AS createdAt,
                    CONVERT(LOWER(ppi.approvel_status) USING utf8mb4) AS actionStatus
                FROM PROPOSAL_PERFORMA_INVOICE AS ppi
                LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm ON cpm.id = ppi.proposal_id
                LEFT JOIN CRM_VERSION_PROPOSAL_MST AS cvm ON cvm.id = ppi.version_id
                LEFT JOIN HRMS_REGISTERED_USER AS hru ON hru.employee_id = cpm.employee_id
                LEFT JOIN CUSTOMER_PROFILE_MST AS cp ON cp.id = cpm.customer_id
                WHERE ppi.quotation_type = 'in direct'
                AND ppi.dealer = false
                AND (cvm.is_booking_created IS NULL OR cvm.is_booking_created = false)  -- << stops showing once booking exists
                -- AND cpm.employee_id = 107                                      -- optional self-only filter
                AND cpm.customer_id = ${req.query?.customer_id}                                                
                UNION ALL

                -- ------------------------------------------------------------------
                -- SALES BOOKING — final stage, always shown once it exists
                -- ------------------------------------------------------------------
                SELECT
                    'sales_booking' AS trackingType,
                    MAX(cpm.id) AS quotationId,
                    MAX(cvm.id) AS versionId,
                    MAX(ppi.id) AS piId,
                    MAX(sb.sb_id) AS sbId,
                    CONVERT(cpm.proposal_no USING utf8mb4) AS proposalNo,
                    CONVERT(MAX(cp.company_name) USING utf8mb4) AS companyName,
                    CONVERT(CONCAT(MAX(hru.first_name), ' ', MAX(hru.last_name)) USING utf8mb4) AS leadOwner,
                    MAX(cpm.grant_total) AS grantTotal,
                    MAX(cvm.currency_id) AS currencyId,
                    MAX(cvm.version) AS version,
                    CONVERT(MAX(cpm.mail_id) USING utf8mb4) AS mailId,
                    CONVERT(MAX(cpm.contact_person_name) USING utf8mb4) AS contactPersonName,
                    CONVERT(NULL USING utf8mb4) AS gstNo,
                    CONVERT(MAX(ppi.pi_number) USING utf8mb4) AS piNumber,
                    CONVERT(MAX(sb.sales_booking_no) USING utf8mb4) AS salesBookingNo,
                    CONVERT(MAX(DATE_FORMAT(ppi.createdAt, '%Y-%m-%d')) USING utf8mb4) AS createdAt,
                    CONVERT(MAX(sb.booking_status) USING utf8mb4) AS actionStatus
                FROM PROPOSAL_PERFORMA_INVOICE AS ppi
                LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm ON cpm.id = ppi.proposal_id
                INNER JOIN CRM_VERSION_PROPOSAL_MST AS cvm
                    ON cvm.id = ppi.version_id AND cvm.is_booking_created = true
                LEFT JOIN HRMS_REGISTERED_USER AS hru ON hru.employee_id = cpm.employee_id
                LEFT JOIN CUSTOMER_PROFILE_MST AS cp ON cp.id = cpm.customer_id
                INNER JOIN CRM_PROPOSAL_LIST_MST AS PLT ON cpm.id = PLT.proposal_id
                INNER JOIN MASTER_ITEM AS MI ON PLT.product_master_id = MI.id
                LEFT JOIN MASTER_SALES_REASON AS msr ON msr.id = ppi.sales_reason_id
                LEFT JOIN HRMS_REGISTERED_USER AS hrur ON hrur.employee_id = ppi.reason_rejectedBy
                LEFT JOIN (
                    SELECT
                        proposal_id,
                        version_id,
                        MAX(id) AS sb_id,
                        MAX(booking_status) AS booking_status,
                        MAX(sales_booking_no) AS sales_booking_no      -- confirm this is the actual column name in SALES_BOOKING
                    FROM SALES_BOOKING
                    -- WHERE booking_status IS NOT NULL AND booking_status != 'APPROVED'   -- currently off, per your last edit
                    GROUP BY proposal_id, version_id
                ) AS sb ON sb.proposal_id = ppi.proposal_id AND sb.version_id = ppi.version_id
                -- AND cpm.employee_id = 107
               WHERE  cpm.customer_id = ${req.query?.customer_id}                                                
                                                               
                GROUP BY cpm.proposal_no

            ) AS combined

            ORDER BY createdAt DESC
            LIMIT ${limit} OFFSET ${offset};
        `;

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM (
                
                -- =========================================================
                -- QUOTATION
                -- =========================================================
                SELECT C.id
                FROM CRM_CREATE_PROPOSAL_MST AS C

                INNER JOIN CRM_PROPOSAL_LIST_MST AS CP 
                    ON C.id = CP.proposal_id

                INNER JOIN CUSTOMER_PROFILE_MST AS CPM2 
                    ON C.customer_id = CPM2.id

                LEFT JOIN HRMS_REGISTERED_USER AS R 
                    ON R.employee_id = C.employee_id

                LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PI 
                    ON PI.proposal_id = C.id

                LEFT JOIN (
                    SELECT vp1.*
                    FROM CRM_VERSION_PROPOSAL_MST vp1
                    INNER JOIN (
                        SELECT 
                            proposal_id, 
                            MAX(id) AS max_id
                        FROM CRM_VERSION_PROPOSAL_MST
                        GROUP BY proposal_id
                    ) vp2 
                        ON vp1.id = vp2.max_id
                ) AS V 
                    ON V.proposal_id = C.id

                WHERE V.id IS NOT NULL
                    AND C.quotation_type = 'in direct'
                    AND C.dealer = false
                    AND PI.id IS NULL
                    AND C.customer_id=${req.query?.customer_id}
                GROUP BY C.id


                UNION ALL


                -- =========================================================
                -- PI
                -- =========================================================
                SELECT ppi.id
                FROM PROPOSAL_PERFORMA_INVOICE AS ppi

                LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm 
                    ON cpm.id = ppi.proposal_id

                LEFT JOIN CRM_VERSION_PROPOSAL_MST AS cvm 
                    ON cvm.id = ppi.version_id

                WHERE ppi.quotation_type = 'in direct'
                    AND ppi.dealer = false
                    AND (
                        cvm.is_booking_created IS NULL
                        OR cvm.is_booking_created = false
                    )
                    AND cpm.customer_id =${req.query?.customer_id}

                UNION ALL


                -- =========================================================
                -- SALES BOOKING
                -- =========================================================
                SELECT MAX(ppi.id)
                FROM PROPOSAL_PERFORMA_INVOICE AS ppi

                LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm 
                    ON cpm.id = ppi.proposal_id

                INNER JOIN CRM_VERSION_PROPOSAL_MST AS cvm
                    ON cvm.id = ppi.version_id
                    AND cvm.is_booking_created = true

                INNER JOIN CRM_PROPOSAL_LIST_MST AS PLT
                    ON cpm.id = PLT.proposal_id

                INNER JOIN MASTER_ITEM AS MI
                    ON PLT.product_master_id = MI.id

                LEFT JOIN (
                    SELECT 
                        proposal_id,
                        version_id,
                        MAX(id) AS sb_id
                    FROM SALES_BOOKING
                    GROUP BY proposal_id, version_id
                ) AS sb
                    ON sb.proposal_id = ppi.proposal_id
                    AND sb.version_id = ppi.version_id
                    WHERE cpm.customer_id = ${req.query?.customer_id}
                GROUP BY cpm.proposal_no

            ) AS totalData;
        `;

        // Execute both queries in parallel
        const [getAllData, countResult] = await Promise.all([
            db.sequelize.query(query),
            db.sequelize.query(countQuery)
        ]);

        const total = Number(countResult[0]?.[0]?.total || 0);
        const totalPages = Math.ceil(total / limit);

        return res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: getAllData[0],
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching proposal tracking:", error);

        return res.status(500).send({
            code: 500,
            message: error.message || "Internal server error!"
        });
    }
};