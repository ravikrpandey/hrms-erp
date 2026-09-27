const db = require('../../../models/index')
module.exports.getPurchaseCreditLimitList = async (req, res) => {
    try {
        const { entity_id } = req.query;

        const [valueList] = await db.sequelize.query(`
            SELECT F.id,F.builder_date,F.document_number,F.note_type,F.amount,F.remark,F.invoice_id,F.vendor_id,F.currency_id,F.currency_rate,F.createdAt,
            V.gst_in,V.vendor_name,V.state_id AS vendor_state_id, FC.total_with_gst, FC.total_price,FC.total_discount_amount,
            FC.quantity,FC.price_per_unit, (FC.total_with_gst - FC.total_price) AS taxble_value, MI.item_code, MI.item_name,H.hsn_sac_code,
            COALESCE(GR.value, 0) AS gst_rate, GR.value AS gst_rate_value
            FROM FINANCE_CREDIT_DEBIT_NOTE AS F
            LEFT JOIN FINANCE_CREDIT_DEBIT_NOTE_ITEM AS FC ON FC.credit_debit_note_id = F.id
            INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = F.vendor_id
            LEFT JOIN MASTER_ITEM AS MI ON MI.id = FC.product_master_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS H ON H.id = MI.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS GR ON GR.id = H.gst_rate_id
            WHERE F.entity_id = ${entity_id}
            AND F.note_type = 'CREDIT NOTE'
            AND F.status = 'ACTIVE'
            AND F.vendor_id IS NOT NULL
            ORDER BY F.createdAt DESC
        `);

        if (valueList.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Success",
                data: valueList
            });
        } 

    } catch (error) {
        
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};



module.exports.getPurchaseDebitLimitList = async (req, res) => {
    try {
        const { entity_id } = req.query;

        if (!entity_id || isNaN(parseInt(entity_id))) {
            return res.status(400).send({
                code: 400,
                message: "Invalid entity_id",
                data: []
            });
        }

        const [valueList] = await db.sequelize.query(`
            SELECT 
                F.id,
                F.builder_date,
                F.document_number,
                F.note_type,
                F.amount,
                F.remark,
                F.invoice_id,
                F.vendor_id,
                V.gst_in,
                V.vendor_name,
                V.state_id AS vendor_state_id,
                E.state_id AS entity_state_id,
                FC.total_with_gst,
                FC.total_price,
                FC.total_discount_amount,
                FC.quantity,
                FC.price_per_unit,
                (FC.total_with_gst - FC.total_price) AS taxble_value,
                MI.item_code,
                MI.item_name,
                H.hsn_sac_code,
                COALESCE(GR.value, 0) AS gst_rate
            FROM FINANCE_CREDIT_DEBIT_NOTE AS F
            LEFT JOIN FINANCE_CREDIT_DEBIT_NOTE_ITEM AS FC ON FC.credit_debit_note_id = F.id
            LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = F.vendor_id
            LEFT JOIN MASTER_ITEM AS MI ON MI.id = FC.product_master_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS H ON H.id = MI.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS GR ON GR.id = H.gst_rate_id
            LEFT JOIN ENTITY_MASTER AS E ON E.id = F.entity_id
            WHERE F.entity_id = ?
            AND F.note_type = 'DEBIT NOTE'
            AND F.status = 'ACTIVE'
            AND F.vendor_id IS NOT NULL
            ORDER BY F.createdAt DESC
        `, {
            replacements: [parseInt(entity_id)]
        });

        if (valueList && valueList.length > 0) {
            const groupedData = {};
            
            valueList.forEach(row => {
                const id = row.id;
                if (!groupedData[id]) {
                    groupedData[id] = {
                        id: row.id,
                        builder_date: row.builder_date,
                        document_number: row.document_number,
                        note_type: row.note_type,
                        amount: parseFloat(row.amount) || 0,
                        remark: row.remark,
                        invoice_id: row.invoice_id,
                        vendor_id: row.vendor_id,
                        gst_in: row.gst_in || '-',
                        vendor_name: row.vendor_name || '-',
                        vendor_state_id: parseInt(row.vendor_state_id) || 0,
                        entity_state_id: parseInt(row.entity_state_id) || 0,
                        items: [],
                        total_taxable_value: 0,
                        total_cgst: 0,
                        total_sgst: 0,
                        total_igst: 0,
                        total_gst: 0,
                        total_amount: 0
                    };
                }
                
                const totalPrice = parseFloat(row.total_price) || 0;
                const totalWithGst = parseFloat(row.total_with_gst) || 0;
                const gstRate = parseFloat(row.gst_rate) || 0;
                const taxbleValue = totalWithGst - totalPrice;
                const vendorStateId = parseInt(row.vendor_state_id) || 0;
                const entityStateId = parseInt(row.entity_state_id) || 0;
                
                let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;
                let cgstRate = 0, sgstRate = 0, igstRate = 0;
                
                if (vendorStateId === entityStateId || vendorStateId === 0 || entityStateId === 0) {
                    cgstRate = gstRate / 2;
                    sgstRate = gstRate / 2;
                    cgstAmount = (totalPrice * cgstRate) / 100;
                    sgstAmount = (totalPrice * sgstRate) / 100;
                } else {
                    igstRate = gstRate;
                    igstAmount = (totalPrice * igstRate) / 100;
                }
                
                const item = {
                    total_price: parseFloat(totalPrice.toFixed(2)),
                    total_with_gst: parseFloat(totalWithGst.toFixed(2)),
                    total_discount_amount: parseFloat(row.total_discount_amount) || 0,
                    quantity: parseFloat(row.quantity) || 0,
                    price_per_unit: parseFloat(row.price_per_unit) || 0,
                    taxble_value: parseFloat(taxbleValue.toFixed(2)),
                    item_code: row.item_code || '-',
                    item_name: row.item_name || '-',
                    hsn_sac_code: row.hsn_sac_code || '-',
                    gst_rate: parseFloat(gstRate.toFixed(2)),
                    cgst_rate: parseFloat(cgstRate.toFixed(2)),
                    sgst_rate: parseFloat(sgstRate.toFixed(2)),
                    igst_rate: parseFloat(igstRate.toFixed(2)),
                    cgst_amount: parseFloat(cgstAmount.toFixed(2)),
                    sgst_amount: parseFloat(sgstAmount.toFixed(2)),
                    igst_amount: parseFloat(igstAmount.toFixed(2))
                };
                
                groupedData[id].items.push(item);
                groupedData[id].total_taxable_value += item.taxble_value;
                groupedData[id].total_cgst += item.cgst_amount;
                groupedData[id].total_sgst += item.sgst_amount;
                groupedData[id].total_igst += item.igst_amount;
                groupedData[id].total_gst += (item.cgst_amount + item.sgst_amount + item.igst_amount);
            });
            
            const processedData = Object.values(groupedData).map(group => ({
                ...group,
                total_taxable_value: parseFloat(group.total_taxable_value.toFixed(2)),
                total_cgst: parseFloat(group.total_cgst.toFixed(2)),
                total_sgst: parseFloat(group.total_sgst.toFixed(2)),
                total_igst: parseFloat(group.total_igst.toFixed(2)),
                total_gst: parseFloat(group.total_gst.toFixed(2)),
                total_amount: parseFloat((group.total_taxable_value + group.total_gst).toFixed(2))
            }));

            return res.status(200).send({
                code: 200,
                message: "Success",
                data: processedData
            });
        } else {
            return res.status(200).send({
                code: 200,
                message: "Data Not Found!",
                data: []
            });
        }

    } catch (error) {
        console.error('Error in getPurchaseDebitLimitList:', error);
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};





module.exports.purchaseRegister = async(req,res)=>{
    try {
        const {entity_id} = req.query;
    
const [valueList] = await db.sequelize.query(`
SELECT DISTINCT P.posting_date AS invoiceDate,P.document_number AS invoiceNo, H.hsn_sac_code,GR.value AS gst_rate,
    CASE
        WHEN P.igst > 0 THEN GR.value
        ELSE NULL
    END AS igst_rate,
    CASE
        WHEN P.sgst > 0 THEN GR.value / 2
        ELSE NULL
    END AS sgst_rate,
    CASE
        WHEN P.cgst > 0 THEN GR.value / 2
        ELSE NULL
    END AS cgst_rate,
    P.taxable AS net_taxable,P.sgst AS sgst_amount, P.cgst AS cgst_amount,P.igst AS igst_amount,
    P.gstTotal AS gst_total,(P.taxable + P.gstTotal) AS invoice_total,P.net AS net_amount,P.id,
    VB.vendor_name,VB.pan_number,VB.vendor_code, VB.gst_in,P.updatedAt,P.document_number AS reference_number,
    'Goods' AS goods_services,'PURCHASE_JOURNAL' AS source_type,B.branch_name AS Place_of_Supply,
    VBA.billing_address AS Type_of_Supply,P.tdsAmt AS tds_amount,
    CASE
        WHEN VB.rcm_charge = 1 THEN 'Yes'
        ELSE 'No'
    END AS rcm_applicable,
    CASE
        WHEN VB.gst_in IS NULL OR VB.gst_in = '' THEN 'B2C'
        ELSE 'B2B'
    END AS b2b_b2c
FROM PURCHASE_JOURNAL AS P
INNER JOIN PURCHASE_JOURNAL_ACCOUNT_LIST AS PL ON PL.purchase_journal_id = P.id
INNER JOIN VENDOR_BASIC_DETAILS AS VB ON P.vendor_id = VB.id
INNER JOIN MASTER_ITEM AS MI ON MI.id = PL.item_id
LEFT JOIN MASTER_HSN_SAC_CODE AS H ON H.id = MI.hsn_code_id
LEFT JOIN GST_RATE_MASTER AS GR ON GR.id = H.gst_rate_id
INNER JOIN MASTER_BRANCH AS B ON B.id = P.branch_id
INNER JOIN VENDOR_BILLING_ADDRESS AS VBA ON VBA.id = P.billing_id
WHERE P.entity_id = ${entity_id}
GROUP BY P.id

UNION ALL

SELECT DISTINCT P.grn_date AS invoiceDate,P.invoiceNo AS invoiceNo,H.hsn_sac_code,GR.value AS gst_rate,
    CASE
        WHEN P.igst > 0 THEN GR.value
        ELSE NULL
    END AS igst_rate,
    CASE
        WHEN P.sgst > 0 THEN GR.value / 2
        ELSE NULL
    END AS sgst_rate,
    CASE
        WHEN P.cgst > 0 THEN GR.value / 2
        ELSE NULL
    END AS cgst_rate,
    P.total_amount AS net_taxable,P.sgst AS sgst_amount,P.cgst AS cgst_amount,P.igst AS igst_amount,
    P.total_gst_amount AS gst_total,P.total_amount AS invoice_total,P.grand_total AS net_amount,P.id,
    VB.vendor_name,VB.pan_number,VB.vendor_code,VB.gst_in,P.updatedAt,P.invoiceNo AS reference_number,
    'Goods' AS goods_services,'GRN' AS source_type,B.branch_name AS Place_of_Supply,
    W.address AS Type_of_Supply, P.tds_amount AS tds_amount, 
    CASE
        WHEN VB.rcm_charge = 1 THEN 'Yes'
        ELSE 'No'
    END AS rcm_applicable,
    CASE
        WHEN VB.gst_in IS NULL OR VB.gst_in = '' THEN 'B2C'
        ELSE 'B2B'
    END AS b2b_b2c
FROM GRN_MASTER AS P
INNER JOIN GRN_ITEM AS GI ON GI.grn_id = P.id
INNER JOIN VENDOR_BASIC_DETAILS AS VB ON P.vendor_id = VB.id
INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
LEFT JOIN MASTER_HSN_SAC_CODE AS H ON H.id = MI.hsn_code_id
LEFT JOIN GST_RATE_MASTER AS GR ON GR.id = H.gst_rate_id
INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PP ON PP.id = P.po_Id
INNER JOIN MASTER_BRANCH AS B ON B.id = PP.billing_address_id
INNER JOIN WAREHOUSE_MASTER AS W ON W.id = PP.warehouse_id
WHERE P.entity_id = ${entity_id} AND P.invoice_status = 'COMPLETED'
GROUP BY P.id

UNION ALL

SELECT DISTINCT P.posting_date AS invoiceDate,P.document_number AS invoiceNo,MH.hsn_sac_code,MS.igst AS gst_rate,  
    CASE
        WHEN P.igst > 0 THEN MS.igst
        ELSE NULL
    END AS igst_rate,
    CASE
        WHEN P.sgst > 0 THEN MS.igst / 2
        ELSE NULL
    END AS sgst_rate,
    CASE
        WHEN P.cgst > 0 THEN MS.igst / 2
        ELSE NULL
    END AS cgst_rate,
    P.taxable AS net_taxable,P.sgst AS sgst_amount,P.cgst AS cgst_amount,P.igst AS igst_amount,
    P.gstTotal AS gst_total,P.gross AS invoice_total,P.net AS net_amount,P.id,VB.vendor_name,
    VB.pan_number,VB.vendor_code,VB.gst_in,P.updatedAt,P.document_number AS reference_number,
    'Services' AS goods_services,'PURCHASE_SERVICE_VOUCHER' AS source_type,B.branch_name AS Place_of_Supply,
    VBA.billing_address AS Type_of_Supply, P.tdsAmt AS tds_amount,  
    CASE
        WHEN VB.rcm_charge = 1 THEN 'Yes'
        ELSE 'No'
    END AS rcm_applicable,
    CASE
        WHEN VB.gst_in IS NULL OR VB.gst_in = '' THEN 'B2C'
        ELSE 'B2B'
    END AS b2b_b2c
FROM PURCHASE_SERVICE_VOUCHER AS P
INNER JOIN PURCHASE_SERVICE_ACCOUNT_LIST AS PL ON PL.purchase_service_voucher_id = P.id
INNER JOIN VENDOR_BASIC_DETAILS AS VB ON P.vendor_id = VB.id
INNER JOIN MASTER_SERVICE AS MS ON MS.service_id = PL.service_id 
INNER JOIN MASTER_HSN_SAC_CODE AS MH ON MH.id = MS.sac_code_id  
INNER JOIN MASTER_BRANCH AS B ON B.id = P.branch_id
INNER JOIN VENDOR_BILLING_ADDRESS AS VBA ON VBA.id = P.billing_id
WHERE P.entity_id = ${entity_id}
GROUP BY P.id

ORDER BY updatedAt DESC
           `)
      
        if(valueList){
            return res.status(200).send({code:200,message:"Success",data:valueList})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}
module.exports.getSalesCreditLimitList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
    
        const [valueList]= await db.sequelize.query(`
SELECT FL.document_number,DATE_FORMAT(MAX(FL.createdAt), '%Y-%m-%d') AS credit_note_date,
MAX(C.company_name) AS customer_name,MAX(CS.gst_in) AS gst_in,MAX(M.states_name) AS place_of_supply,
    CASE
        WHEN MAX(CS.gst_in) IS NULL OR MAX(CS.gst_in) = ''
        THEN 'B2C'
        ELSE 'B2B'
    END AS customer_type,
    ROUND(SUM(CASE
        WHEN FL.chart_account_id = 168
        THEN FL.credit_amount
        ELSE 0
    END), 2) AS total_amount,
    ROUND(
        SUM(CASE
            WHEN FL.chart_account_id = 168
            THEN FL.credit_amount
            ELSE 0
        END) / 1.18,
    2) AS taxable_value,
    ROUND(
        SUM(CASE
            WHEN FL.chart_account_id = 168
            THEN FL.credit_amount
            ELSE 0
        END)
        -
        (
            SUM(CASE
                WHEN FL.chart_account_id = 168
                THEN FL.credit_amount
                ELSE 0
            END) / 1.18
        ),
    2) AS gst_total,
    CASE
        WHEN MAX(B.state_id) <> MAX(CS.billing_state_id)
        THEN ROUND(
            SUM(CASE
                WHEN FL.chart_account_id = 168
                THEN FL.credit_amount
                ELSE 0
            END)
            -
            (
                SUM(CASE
                    WHEN FL.chart_account_id = 168
                    THEN FL.credit_amount
                    ELSE 0
                END) / 1.18
            ),
        2)
        ELSE 0
    END AS igst,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN ROUND(
            (
                SUM(CASE
                    WHEN FL.chart_account_id = 168
                    THEN FL.credit_amount
                    ELSE 0
                END)
                -
                (
                    SUM(CASE
                        WHEN FL.chart_account_id = 168
                        THEN FL.credit_amount
                        ELSE 0
                    END) / 1.18
                )
            ) / 2,
        2)
        ELSE 0
    END AS cgst,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN ROUND(
            (
                SUM(CASE
                    WHEN FL.chart_account_id = 168
                    THEN FL.credit_amount
                    ELSE 0
                END)
                -
                (
                    SUM(CASE
                        WHEN FL.chart_account_id = 168
                        THEN FL.credit_amount
                        ELSE 0
                    END) / 1.18
                )
            ) / 2,
        2)
        ELSE 0
    END AS sgst,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN '9%'
        ELSE '-'
    END AS cgst_rate,

    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN '9%'
        ELSE '-'
    END AS sgst_rate,
    CASE
        WHEN MAX(B.state_id) <> MAX(CS.billing_state_id)
        THEN '18%'
        ELSE '-'
    END AS igst_rate,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN 'Intra State'
        ELSE 'Inter State'
    END AS supply_type

FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FL
INNER JOIN CUSTOMER_PROFILE_MST C ON C.id = FL.customer_id
INNER JOIN CUSTOMER_ADDRESS_MST CS ON CS.id = FL.billing_id
INNER JOIN MASTER_BRANCH B ON B.id = FL.branch_id
LEFT JOIN MASTER_STATE M ON M.states_id = CS.billing_state_id
WHERE FL.entry_status = 'CREDIT NOTE'
  AND FL.chart_account_id = 168
  AND FL.entity_id = ${entity_id}
GROUP BY FL.document_number
ORDER BY MAX(FL.createdAt) DESC;
           `)
      
        if(valueList){
            return res.status(200).send({code:200,message:"Success",data:valueList})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}
module.exports.getSalesDebitNoteList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
    
        const [valueList]= await db.sequelize.query(`
SELECT FL.document_number,DATE_FORMAT(MAX(FL.createdAt), '%Y-%m-%d') AS debit_note_date,MAX(C.company_name) AS customer_name,
    MAX(CS.gst_in) AS gst_in,MAX(M.states_name) AS place_of_supply,
    CASE
        WHEN MAX(CS.gst_in) IS NULL OR MAX(CS.gst_in) = ''
        THEN 'B2C'
        ELSE 'B2B'
    END AS customer_type,
    ROUND(
        SUM(
            CASE
                WHEN FL.chart_account_id = 168
                THEN FL.debit_amount
                ELSE 0
            END
        ),2
    ) AS total_amount,
    ROUND(
        SUM(
            CASE
                WHEN FL.chart_account_id = 168
                THEN FL.debit_amount
                ELSE 0
            END
        ) / 1.18,
    2) AS taxable_value,
    ROUND(
        SUM(
            CASE
                WHEN FL.chart_account_id = 168
                THEN FL.debit_amount
                ELSE 0
            END
        )
        -
        (
            SUM(
                CASE
                    WHEN FL.chart_account_id = 168
                    THEN FL.debit_amount
                    ELSE 0
                END
            ) / 1.18
        ),
    2) AS gst_total,
    CASE
        WHEN MAX(B.state_id) <> MAX(CS.billing_state_id)
        THEN ROUND(
            SUM(
                CASE
                    WHEN FL.chart_account_id = 168
                    THEN FL.debit_amount
                    ELSE 0
                END
            )
            -
            (
                SUM(
                    CASE
                        WHEN FL.chart_account_id = 168
                        THEN FL.debit_amount
                        ELSE 0
                    END
                ) / 1.18
            ),
        2)
        ELSE 0
    END AS igst,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN ROUND(
            (
                SUM(
                    CASE
                        WHEN FL.chart_account_id = 168
                        THEN FL.debit_amount
                        ELSE 0
                    END
                )
                -
                (
                    SUM(
                        CASE
                            WHEN FL.chart_account_id = 168
                            THEN FL.debit_amount
                            ELSE 0
                        END
                    ) / 1.18
                )
            ) / 2,
        2)
        ELSE 0
    END AS cgst,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN ROUND(
            (
                SUM(
                    CASE
                        WHEN FL.chart_account_id = 168
                        THEN FL.debit_amount
                        ELSE 0
                    END
                )
                -
                (
                    SUM(
                        CASE
                            WHEN FL.chart_account_id = 168
                            THEN FL.debit_amount
                            ELSE 0
                        END
                    ) / 1.18
                )
            ) / 2,
        2)
        ELSE 0
    END AS sgst,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN '9%'
        ELSE '-'
    END AS cgst_rate,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN '9%'
        ELSE '-'
    END AS sgst_rate,
    CASE
        WHEN MAX(B.state_id) <> MAX(CS.billing_state_id)
        THEN '18%'
        ELSE '-'
    END AS igst_rate,
    CASE
        WHEN MAX(B.state_id) = MAX(CS.billing_state_id)
        THEN 'Intra State'
        ELSE 'Inter State'
    END AS supply_type
FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FL
INNER JOIN CUSTOMER_PROFILE_MST C ON C.id = FL.customer_id
INNER JOIN CUSTOMER_ADDRESS_MST CS ON CS.id = FL.billing_id
INNER JOIN MASTER_BRANCH B ON B.id = FL.branch_id
LEFT JOIN MASTER_STATE M ON M.states_id = CS.billing_state_id
WHERE FL.entry_status = 'DEBIT NOTE' AND FL.chart_account_id = 168 AND FL.entity_id = ${entity_id}
GROUP BY FL.document_number
ORDER BY MAX(FL.createdAt) DESC
           `)
      
        if(valueList){
            return res.status(200).send({code:200,message:"Success",data:valueList})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.getInputOutputGstReport = async(req,res)=>{
    try {
        const {entity_id} = req.query;
    
        const [valueList]= await db.sequelize.query(`
SELECT DATE_FORMAT(MAX(FL.createdAt), '%Y-%m-%d') AS posting_date,MAX(V.vendor_name) AS vendor_name,
FL.document_number,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 29
            THEN FL.debit_amount
            ELSE 0
        END
    ), 2) AS igst,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 21
            THEN FL.debit_amount
            ELSE 0
        END
    ), 2) AS cgst,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 41
            THEN FL.debit_amount
            ELSE 0
        END
    ), 2) AS sgst,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id IN (21,29,41)
            THEN FL.debit_amount
            ELSE 0
        END
    ), 2) AS gst_total,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 51
            THEN FL.credit_amount
            ELSE 0
        END
    ), 2) AS vendor_amount,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 45
            THEN FL.credit_amount
            ELSE 0
        END
    ), 2) AS tds_amount,
    ROUND(
        SUM(
            CASE
                WHEN FL.chart_account_id = 51
                THEN FL.credit_amount
                ELSE 0
            END
        ) +
        SUM(
            CASE
                WHEN FL.chart_account_id = 45
                THEN FL.credit_amount
                ELSE 0
            END
        ),
    2) AS total_amount,
    ROUND(
        (
            SUM(
                CASE
                    WHEN FL.chart_account_id = 51
                    THEN FL.credit_amount
                    ELSE 0
                END
            ) +
            SUM(
                CASE
                    WHEN FL.chart_account_id = 45
                    THEN FL.credit_amount
                    ELSE 0
                END
            )
        ) -
        SUM(
            CASE
                WHEN FL.chart_account_id IN (21,29,41)
                THEN FL.debit_amount
                ELSE 0
            END
        ),
    2) AS base_amount

FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FL
INNER JOIN VENDOR_BASIC_DETAILS V ON V.id = FL.vendor_id
WHERE FL.chart_account_id IN (21,29,41,45,51) AND FL.entity_id = ${entity_id}
GROUP BY FL.document_number
HAVING SUM(
    CASE
        WHEN FL.chart_account_id IN (21,29,41)
        THEN 1
        ELSE 0
    END
) > 0
ORDER BY MAX(FL.createdAt) DESC
           `)
         const [dataList]= await db.sequelize.query(`
SELECT DATE_FORMAT(MAX(FL.createdAt), '%Y-%m-%d') AS posting_date,
MAX(CP.company_name) AS customer_name,FL.document_number,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 31
            THEN FL.credit_amount
            ELSE 0
        END
    ), 2) AS igst,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 23
            THEN FL.credit_amount
            ELSE 0
        END
    ), 2) AS cgst,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 43
            THEN FL.credit_amount
            ELSE 0
        END
    ), 2) AS sgst,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id IN (31,23,43)
            THEN FL.credit_amount
            ELSE 0
        END
    ), 2) AS gst_total,
    ROUND(SUM(
        CASE
            WHEN FL.chart_account_id = 168
            THEN FL.debit_amount
            ELSE 0
        END
    ), 2) AS total_amount,
    ROUND(
        SUM(
            CASE
                WHEN FL.chart_account_id = 168
                THEN FL.debit_amount
                ELSE 0
            END
        )
        -
        SUM(
            CASE
                WHEN FL.chart_account_id IN (31,23,43)
                THEN FL.credit_amount
                ELSE 0
            END
        ),
    2) AS base_amount

FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST FL
INNER JOIN CUSTOMER_PROFILE_MST CP ON CP.id = FL.customer_id
WHERE FL.chart_account_id IN (31,23,43,168) AND FL.entity_id = ${entity_id}
GROUP BY FL.document_number
HAVING SUM(
    CASE
        WHEN FL.chart_account_id IN (31,23,43)
        THEN 1
        ELSE 0
    END
) > 0

ORDER BY MAX(FL.createdAt) DESC;
           `)

        const Obj ={
            inputGstReport:valueList,
            outputGstReport:dataList
        }
      
        if(valueList){
            return res.status(200).send({code:200,message:"Success",data:Obj})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.getSalesRegisterGSTReport = async(req,res)=>{
    try {
        const {entity_id} = req.query;
    
        const [valueList]= await db.sequelize.query(`
SELECT DISTINCT C.sales_invoice_no, C.sales_invoice_date, payment_due_days, C.invoice_status, C.discount_amount,C.grand_total,
C.remarks,C.billing_state, C.billing_gst,CS.igst,CS.sgst,CS.cgst,CS.hsncode,CS.qty,CS.discount_per_unit,
    ROUND(
        CASE 
            WHEN CS.igst > 0 THEN C.grand_total / (1 + (CS.igst / 100))
            WHEN CS.cgst > 0 AND CS.sgst > 0 THEN C.grand_total / (1 + ((CS.cgst + CS.sgst) / 100))
            ELSE C.grand_total
        END, 2
    ) AS taxable_amount,
    ROUND(
        CASE 
            WHEN CS.cgst > 0 THEN (C.grand_total / (1 + ((CS.cgst + CS.sgst) / 100))) * (CS.cgst / 100)
            ELSE 0
        END, 2
    ) AS cgst_amount,
    ROUND(
        CASE 
            WHEN CS.sgst > 0 THEN (C.grand_total / (1 + ((CS.cgst + CS.sgst) / 100))) * (CS.sgst / 100)
            ELSE 0
        END, 2
    ) AS sgst_amount,
    ROUND(
        CASE 
            WHEN CS.igst > 0 THEN (C.grand_total / (1 + (CS.igst / 100))) * (CS.igst / 100)
            ELSE 0
        END, 2
    ) AS igst_amount,
    ROUND(
        CASE 
            WHEN CS.igst > 0 THEN C.grand_total - (C.grand_total / (1 + (CS.igst / 100)))
            WHEN CS.cgst > 0 AND CS.sgst > 0 THEN C.grand_total - (C.grand_total / (1 + ((CS.cgst + CS.sgst) / 100)))
            ELSE 0
        END, 2
    ) AS total_gst,'Goods' AS goods
FROM CRM_SALES_INVOICE_MST AS C
INNER JOIN CRM_SALES_INVOICE_ITEM AS CS ON CS.invoice_id = C.id
WHERE C.entity_id=${entity_id} AND C.invoice_status = 'APPROVED'
           `)
      
        if(valueList){
            return res.status(200).send({code:200,message:"Success",data:valueList})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}