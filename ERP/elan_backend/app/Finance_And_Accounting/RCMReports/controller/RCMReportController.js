const db = require('../../../models/index')

module.exports.getRCMPurchaseRegister = async(req,res)=>{
    try {
        const {entity_id,financial_id,type} = req.query;
        let dataList =[];
       if(type == 'RCM Purchase Register') {

[dataList] = await db.sequelize.query(
`SELECT F.document_number,COALESCE(V.vendor_name, T.tm_name) AS vendor_name,V.rcm_charge,
COALESCE(V.gst_in, T.tm_gst_number) AS gst_in,DATE_FORMAT( COALESCE(G.createdAt, PJ.createdAt, TV.createdAt), '%Y-%m-%d') AS invoiceDate,
DATE_FORMAT(MAX(F.createdAt), '%Y-%m-%d') AS posting_date,COALESCE(G.payment_status, 'Pending') AS payment_status,
    CASE
        WHEN VB.gst_category = 'RP' THEN 'Registered Party'
        WHEN VB.gst_category = 'URP' THEN 'Un-Registered Party'
        ELSE VB.gst_category
    END AS gst_category_name,
    CASE
        WHEN SUM(IFNULL(F.igst,0)) > 0 THEN 'Inter State'
        WHEN SUM(IFNULL(F.cgst,0)) > 0
          OR SUM(IFNULL(F.sgst,0)) > 0 THEN 'Intra State'
        ELSE NULL
    END AS supply_type,
    ROUND(
        SUM(
            CASE
                WHEN C.root_name = 'Expense'
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS taxable_value,
    ROUND(SUM(IFNULL(F.cgst,0)),2) AS cgst_amount,ROUND(SUM(IFNULL(F.sgst,0)),2) AS sgst_amount,
    ROUND(SUM(IFNULL(F.igst,0)),2) AS igst_amount,
    ROUND(
        SUM(IFNULL(F.cgst,0))
        + SUM(IFNULL(F.sgst,0))
        + SUM(IFNULL(F.igst,0))
    ,2) AS total_gst_rcm,
    ROUND(
        SUM(
            CASE
                WHEN C.root_name = 'Expense'
                THEN F.debit_amount
                ELSE 0
            END
        )
        + SUM(IFNULL(F.cgst,0))
        + SUM(IFNULL(F.sgst,0))
        + SUM(IFNULL(F.igst,0))
    ,2) AS total_amount,
    CASE
        WHEN V.rcm_charge = 'Y'
        THEN 'Y'
        ELSE 'N'
    END AS ITC_Eligible,
    CASE
        WHEN COALESCE(G.payment_status,'Pending') = 'Paid'
        THEN 'Y'
        ELSE 'N'
    END AS ITC_Claimed,
    MAX(
        CASE
            WHEN F.chart_account_id IN (400,401,402)
            THEN C.account_name
        END
    ) AS RCM_Payable_GL,
    MAX(
        CASE
            WHEN F.chart_account_id IN (403,404,405)
            THEN C.account_name
        END
    ) AS Input_GST_GL,
    MAX(
        CASE
            WHEN C.root_name = 'Expense'
            THEN C.account_name
        END
    ) AS GL_Posted_Expense,
    MAX(
        CASE
            WHEN F.chart_account_id IN (400,401,402,403,404,405)
            THEN C.account_name
        END
    ) AS Reverse_Charge_Tax_Code,
    NULL AS Cash_Ledger_Ref_No
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST F
LEFT JOIN GRN_MASTER G  ON G.invoiceNo = F.document_number
LEFT JOIN PURCHASE_JOURNAL PJ ON PJ.document_number = F.document_number
LEFT JOIN TRANSPORT_VOUCHER TV ON TV.bill_invoice_number = F.document_number
LEFT JOIN CHART_OF_ACCOUNTS C ON C.id = F.chart_account_id
LEFT JOIN (
    SELECT
        document_number,
        MAX(vendor_id) AS vendor_id
    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST
    WHERE vendor_id IS NOT NULL
    GROUP BY document_number
) VMAP
    ON VMAP.document_number = F.document_number
LEFT JOIN VENDOR_BASIC_DETAILS V ON V.id = VMAP.vendor_id
LEFT JOIN VENDOR_BILLING_ADDRESS VB ON VB.vendor_id = V.id
LEFT JOIN TM_TRANSPORTER_MASTER T ON T.id = F.transport_id
WHERE F.entity_id = ${entity_id} AND F.financial_id = ${financial_id}
 AND ( C.root_name = 'Expense' OR F.chart_account_id IN (400,401,402,403,404,405) )
GROUP BY F.document_number, COALESCE(V.vendor_name, T.tm_name), V.rcm_charge, COALESCE(V.gst_in, T.tm_gst_number),
 VB.gst_category, COALESCE(G.payment_status,'Pending'), VB.billing_state_id, G.createdAt, PJ.createdAt, TV.createdAt
ORDER BY MAX(F.createdAt) DESC`
)
}
if(type == 'RCM Liability Summary'){
    [dataList] = await db.sequelize.query(
`SELECT SUM(F.debit_amount) AS debit_amount, SUM(F.credit_amount) AS credit_amount,
    COALESCE(V.vendor_name, T.tm_name) AS vendor_name, V.rcm_charge, COALESCE(V.gst_in, T.tm_gst_number) AS gst_in,
    F.document_number AS invoiceNo,
    DATE_FORMAT(
        COALESCE(G.createdAt, PJ.createdAt, TV.createdAt),
        '%Y-%m-%d'
    ) AS posting_date,
    COALESCE(G.payment_status, 'Pending') AS payment_status,
    CASE
        WHEN SUM(IFNULL(F.igst,0)) > 0 THEN 'Inter State'
        WHEN SUM(IFNULL(F.cgst,0)) > 0
          OR SUM(IFNULL(F.sgst,0)) > 0 THEN 'Intra State'
        ELSE NULL
    END AS supply_type,
    CASE
        WHEN SUM(IFNULL(F.igst,0)) > 0
        THEN 0.00
        ELSE ROUND(SUM(F.credit_amount)/2,2)
    END AS cgst_amount,
    CASE
        WHEN SUM(IFNULL(F.igst,0)) > 0
        THEN 0.00
        ELSE ROUND(SUM(F.credit_amount)/2,2)
    END AS sgst_amount,
    CASE
        WHEN SUM(IFNULL(F.igst,0)) > 0
        THEN ROUND(SUM(F.credit_amount),2)
        ELSE 0.00
    END AS igst_amount,
    ROUND(SUM(F.credit_amount),2) AS total_rcm_liability,
    CASE
        WHEN COALESCE(G.payment_status,'Pending')='Paid'
        THEN 'Yes'
        ELSE 'No'
    END AS rcmPaid,
    CASE
        WHEN COALESCE(G.payment_status,'Pending')='Paid'
        THEN 0
        ELSE ROUND(SUM(F.credit_amount),2)
    END AS balancePayable
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST F
LEFT JOIN GRN_MASTER G  ON G.invoiceNo = F.document_number
LEFT JOIN PURCHASE_JOURNAL PJ ON PJ.document_number = F.document_number
LEFT JOIN TRANSPORT_VOUCHER TV  ON TV.bill_invoice_number = F.document_number
LEFT JOIN (
    SELECT
        document_number,
        MAX(vendor_id) AS vendor_id
    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST
    WHERE vendor_id IS NOT NULL
    GROUP BY document_number
) VMAP
    ON VMAP.document_number = F.document_number
LEFT JOIN VENDOR_BASIC_DETAILS V ON V.id = VMAP.vendor_id
LEFT JOIN VENDOR_BILLING_ADDRESS VB ON VB.vendor_id = V.id
LEFT JOIN TM_TRANSPORTER_MASTER T ON T.id = F.transport_id
WHERE F.entity_id = ${entity_id} AND F.financial_id = ${financial_id} AND F.chart_account_id IN (400,401,402,403,404,405)
GROUP BY F.document_number,COALESCE(V.vendor_name, T.tm_name),V.rcm_charge,COALESCE(V.gst_in, T.tm_gst_number),
COALESCE(G.payment_status,'Pending'),VB.billing_state_id,G.createdAt,PJ.createdAt,TV.createdAt
ORDER BY MAX(F.createdAt) DESC`
    )
}

        if(type == 'RCM ITC Summary'){
            [dataList] = await db.sequelize.query(
    `SELECT DATE_FORMAT(F.createdAt, '%Y-%m') AS month,
    ROUND(
        SUM(
            CASE
                WHEN C.root_name = 'Expense'
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS taxableValue,
    ROUND(
        SUM(
            CASE
                WHEN F.chart_account_id = 404
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS cgstItc,
    ROUND(
        SUM(
            CASE
                WHEN F.chart_account_id = 405
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS sgstItc,
    ROUND(
        SUM(
            CASE
                WHEN F.chart_account_id = 403
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS igstItc,
    ROUND(
        SUM(
            CASE
                WHEN F.chart_account_id IN (403,404,405)
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS totalItcAvailable,
    ROUND(
        SUM(
            CASE
                WHEN F.chart_account_id IN (403,404,405)
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS itcClaimedThisMonth,

    0 AS itcReversed,

    ROUND(
        SUM(
            CASE
                WHEN F.chart_account_id IN (403,404,405)
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS netItcAvailed
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST F
LEFT JOIN CHART_OF_ACCOUNTS C ON C.id = F.chart_account_id
WHERE F.entity_id = ${entity_id} AND F.financial_id = ${financial_id}
AND ( C.root_name = 'Expense' OR F.chart_account_id IN (400,401,402,403,404,405) )
GROUP BY DATE_FORMAT(F.createdAt, '%Y-%m')
ORDER BY month`
)
        }

        if(type == 'Vendor-wise RCM Report'){
            [dataList] = await db.sequelize.query(
     `SELECT COALESCE(V.vendor_name, T.tm_name) AS vendorName, COALESCE(V.gst_in, T.tm_gst_number) AS vendorGstin,
    ROUND(
        SUM(
            CASE
                WHEN C.root_name = 'Expense'
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS totalTaxableValueRcm,
    ROUND(SUM(IFNULL(F.cgst,0)),2) AS totalCgst, ROUND(SUM(IFNULL(F.sgst,0)),2) AS totalSgst, ROUND(SUM(IFNULL(F.igst,0)),2) AS totalIgst,     
    ROUND(
        SUM(IFNULL(F.cgst,0)) + SUM(IFNULL(F.sgst,0)) + SUM(IFNULL(F.igst,0)) , 2) AS totalRcmLiability,
    COUNT(DISTINCT F.document_number) AS invoiceCount,
    ROUND(
        SUM(
            CASE
                WHEN F.chart_account_id IN (403,404,405)
                THEN F.debit_amount
                ELSE 0
            END
        ),2
    ) AS itcClaimed, 0 AS itcPending
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST F
LEFT JOIN CHART_OF_ACCOUNTS C ON C.id = F.chart_account_id
LEFT JOIN (
    SELECT
        document_number,
        MAX(vendor_id) AS vendor_id
    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST
    WHERE vendor_id IS NOT NULL
    GROUP BY document_number
) VMAP
    ON VMAP.document_number = F.document_number

LEFT JOIN VENDOR_BASIC_DETAILS V ON V.id = VMAP.vendor_id
LEFT JOIN TM_TRANSPORTER_MASTER T  ON T.id = F.transport_id

WHERE
    F.entity_id = ${entity_id}
    AND F.financial_id = ${financial_id}
    AND (
        C.root_name = 'Expense'
        OR F.chart_account_id IN (400,401,402,403,404,405)
    )

GROUP BY COALESCE(V.id, T.id), COALESCE(V.vendor_name, T.tm_name), COALESCE(V.gst_in, T.tm_gst_number)
ORDER BY vendorName`
            )
        }
        if(type == 'RCM Payment Tracking Report'){
            [dataList] = await db.sequelize.query(
                `SELECT
    month_data.month,

    ROUND(month_data.openingRcmLiability,2) AS openingRcmLiability,
    ROUND(month_data.currentMonthRcm,2) AS currentMonthRcm,

    ROUND(
        month_data.openingRcmLiability +
        month_data.currentMonthRcm,
    2) AS totalLiability,

    ROUND(month_data.cashPaid,2) AS cashPaid,

    month_data.paymentDate,
    month_data.challanNo,

    ROUND(
        (
            month_data.openingRcmLiability +
            month_data.currentMonthRcm
        ) - month_data.cashPaid,
    2) AS closingBalance

FROM (
    SELECT
        DATE_FORMAT(F.createdAt, '%Y-%m') AS month,

        /* Opening Liability only */
        (
            SELECT ROUND(
                COALESCE(SUM(X.credit_amount),0) -
                COALESCE(SUM(X.debit_amount),0),
            2)
            FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST X
            WHERE
                X.chart_account_id IN (400,401,402)
                AND X.entity_id = ${entity_id}
                AND X.financial_id = ${financial_id}
                AND X.createdAt < DATE_FORMAT(F.createdAt, '%Y-%m-01')
        ) AS openingRcmLiability,

        /* Current Month Liability only */
        ROUND(
            SUM(
                CASE
                    WHEN F.chart_account_id IN (400,401,402)
                    THEN F.credit_amount
                    ELSE 0
                END
            ),2
        ) AS currentMonthRcm,

        /* Cash Paid only (bank/cash GL assumption needed) */
        ROUND(
            SUM(
                CASE
                    WHEN F.chart_account_id NOT IN (400,401,402,403,404,405)
                    THEN F.debit_amount
                    ELSE 0
                END
            ),2
        ) AS cashPaid,

        DATE_FORMAT(MAX(F.createdAt), '%Y-%m-%d') AS paymentDate,
        MAX(F.document_number) AS challanNo

    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST F

    WHERE
        F.entity_id = ${entity_id}
        AND F.financial_id = ${financial_id}
        AND F.chart_account_id IN (400,401,402,403,404,405,45,51)

    GROUP BY DATE_FORMAT(F.createdAt, '%Y-%m')
) month_data

ORDER BY month_data.month
                `
            )
        } 
        if(type == 'RCM GL Reconciliation Report'){
            [dataList] = await db.sequelize.query(
                `SELECT
    ROUND(
        COALESCE(SUM(
            CASE
                WHEN F.chart_account_id IN (400,401,402,403,404,405)
                THEN F.credit_amount - F.debit_amount
                ELSE 0
            END
        ),0),
    2) AS rcmPayableGlBalance,
    ROUND(
        COALESCE(SUM(
            CASE
                WHEN F.chart_account_id IN (400,401,402,403,404,405)
                THEN F.debit_amount - F.credit_amount
                ELSE 0
            END
        ),0),
    2) AS inputGstRcmGlBalance,
    ROUND(
        COALESCE(SUM(
            CASE
                WHEN F.chart_account_id IN (400,401,402,403,404,405)
                THEN F.credit_amount
                ELSE 0
            END
        ),0),
    2) AS gstr3bLiability,
    ROUND(
        (
            COALESCE(SUM(
                CASE
                    WHEN F.chart_account_id IN (400,401,402)
                    THEN F.credit_amount - F.debit_amount
                    ELSE 0
                END
            ),0)
        )
        -
        (
            COALESCE(SUM(
                CASE
                    WHEN F.chart_account_id IN (400,401,402,403,404,405)
                    THEN F.credit_amount
                    ELSE 0
                END
            ),0)
        ),
    2) AS difference
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST F
WHERE F.entity_id = ${entity_id} AND F.financial_id = ${financial_id}
                `
            )
        }
               
        if(type == 'RCM Compliance Exception Report'){
            [dataList] = await db.sequelize.query(
                `SELECT F.document_number AS invoiceNo,V.vendor_name AS vendor,
    CASE
        WHEN TV.id IS NOT NULL THEN '9965'
        ELSE 'N/A'
    END AS sac,
    CASE
        WHEN
            V.rcm_charge = 'Y'
        THEN 'Yes'
        ELSE 'No'
    END AS rcmApplicable,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST X
            WHERE
                X.document_number = F.document_number
                AND X.chart_account_id IN (400,401,402)
        )
        THEN 'Yes'
        ELSE 'No'
    END AS rcmTaxCodeUsed,
    CASE
        WHEN SUM(F.credit_amount) > 0
        THEN 'Yes'
        ELSE 'No'
    END AS gstCalculated,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST X
            WHERE
                X.document_number = F.document_number
                AND X.chart_account_id IN (400,401,402)
        )
        THEN 'Yes'
        ELSE 'No'
    END AS liabilityPosted,

    -- ITC claimed
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST X
            WHERE
                X.document_number = F.document_number
                AND X.chart_account_id IN (403,404,405)
        )
        THEN 'Yes'
        ELSE 'No'
    END AS itcClaimed,

    CASE

        WHEN V.rcm_charge = 'Y'
             AND NOT EXISTS (
                SELECT 1
                FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST X
                WHERE
                    X.document_number = F.document_number
                    AND X.chart_account_id IN (400,401,402)
             )
        THEN 'RCM Applicable But Liability Not Posted'

        WHEN V.rcm_charge = 'Y'
             AND NOT EXISTS (
                SELECT 1
                FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST X
                WHERE
                    X.document_number = F.document_number
                    AND X.chart_account_id IN (403,404,405)
             )
        THEN 'ITC Not Claimed'

        WHEN V.rcm_charge != 'Y'
             AND EXISTS (
                SELECT 1
                FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST X
                WHERE
                    X.document_number = F.document_number
                    AND X.chart_account_id IN (400,401,402,403,404,405)
             )
        THEN 'RCM Posted For Non-RCM Vendor'

        ELSE 'OK'

    END AS errorType
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST F
LEFT JOIN GRN_MASTER G ON G.invoiceNo = F.document_number
LEFT JOIN PURCHASE_JOURNAL PJ ON PJ.document_number = F.document_number
LEFT JOIN TRANSPORT_VOUCHER TV ON TV.bill_invoice_number = F.document_number
INNER JOIN VENDOR_BASIC_DETAILS V ON V.id = COALESCE(G.vendor_id, PJ.vendor_id, TV.vendor_id)
WHERE F.entity_id = ${entity_id} AND F.financial_id = ${financial_id}
GROUP BY F.document_number,V.vendor_name,V.rcm_charge,TV.id
HAVING errorType != 'OK'
ORDER BY F.document_number
                `
            )
        }
        if(type== 'SAC-wise RCM Report'){
            [dataList] = await db.sequelize.query(
             `
             SELECT 
    HC.hsn_sac_code AS sac_code,

    GROUP_CONCAT(DISTINCT I.item_name) AS description,

    GR.value AS gst_rate,

    COUNT(DISTINCT G.id) AS no_of_transactions,

    SUM(GI.amount) AS total_taxable_value,

    SUM(
        CASE 
            WHEN V.state_id = E.state_id 
            THEN (GI.amount * GR.value / 100) / 2
            ELSE 0
        END
    ) AS cgst,

    SUM(
        CASE 
            WHEN V.state_id = E.state_id 
            THEN (GI.amount * GR.value / 100) / 2
            ELSE 0
        END
    ) AS sgst,

    SUM(
        CASE 
            WHEN V.state_id != E.state_id 
            THEN (GI.amount * GR.value / 100)
            ELSE 0
        END
    ) AS igst,

    SUM(
        GI.amount * GR.value / 100
    ) AS total_rcm_amount

FROM GRN_MASTER G

INNER JOIN PROCUREMENT_PURCHASE_ORDER P 
    ON P.id = G.po_Id

INNER JOIN VENDOR_BASIC_DETAILS V 
    ON V.id = P.vendor_id

INNER JOIN GRN_ITEM GI 
    ON GI.grn_Id = G.id

INNER JOIN MASTER_ITEM I 
    ON I.id = GI.item_id

INNER JOIN MASTER_HSN_SAC_CODE HC 
    ON HC.id = I.hsn_code_id

INNER JOIN GST_RATE_MASTER GR 
    ON GR.id = HC.gst_rate_id

INNER JOIN ENTITY_MASTER E
    ON E.id = G.entity_id

WHERE 
    V.rcm_charge = true

GROUP BY 
    HC.hsn_sac_code,
    GR.value

ORDER BY 
    HC.hsn_sac_code ASC
             `

            )
        }
        
        return res.status(200).send({code:200,messege:'Success',data:dataList})
    } catch (error) {
        return res.status(500).send({code:500,messege:error.messege})
    }
}

module.exports.getSacWiseTransactions = async (req, res) => {

  try {

    const { sac_code } = req.query;

    const [data] = await db.sequelize.query(`

      SELECT DISTINCT

        G.id AS grn_id,

        G.invoiceNo,

        G.invoiceDate,

        P.po_number,

        V.vendor_name,

        I.item_name,

        HC.hsn_sac_code AS sac_code,

        GI.amount AS taxable_value,

        GR.value AS gst_rate,

        CASE
            WHEN V.state_id = E.state_id
            THEN (GI.amount * GR.value / 100) / 2
            ELSE 0
        END AS cgst,

        CASE
            WHEN V.state_id = E.state_id
            THEN (GI.amount * GR.value / 100) / 2
            ELSE 0
        END AS sgst,

        CASE
            WHEN V.state_id != E.state_id
            THEN (GI.amount * GR.value / 100)
            ELSE 0
        END AS igst,

        (GI.amount * GR.value / 100) AS total_rcm_amount

      FROM GRN_MASTER G

      INNER JOIN PROCUREMENT_PURCHASE_ORDER P
          ON P.id = G.po_Id

      INNER JOIN VENDOR_BASIC_DETAILS V
          ON V.id = P.vendor_id

      INNER JOIN GRN_ITEM GI
          ON GI.grn_Id = G.id

      INNER JOIN MASTER_ITEM I
          ON I.id = GI.item_id

      INNER JOIN MASTER_HSN_SAC_CODE HC
          ON HC.id = I.hsn_code_id

      INNER JOIN GST_RATE_MASTER GR
          ON GR.id = HC.gst_rate_id

      INNER JOIN ENTITY_MASTER E
          ON E.id = G.entity_id

      WHERE
          V.rcm_charge = true
          AND HC.hsn_sac_code = :sac_code

      ORDER BY G.invoiceDate DESC

    `, {
      replacements: { sac_code }
    });

    return res.status(200).send({
      code: 200,
      data
    });

  } catch (error) {

    return res.status(500).send({
      code: 500,
      message: error.message
    });

  }

};