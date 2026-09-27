const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../../models/index");
const sequelize = require("sequelize");

module.exports.createDealClosed = async (req, res) => {
    try {
        const { proposal_id, version_id, lead_id,customer_code, address,employee_id,entity_id,financial_year_id ,company_name, contact_number, contact_person_name, description, follow_up_date, lead_created_date, lead_owner, mail_id } = req.body;
        const dealClosed = await db.dealClose.create({ proposal_id, version_id });

        if (!dealClosed) {
            return res.status(400).send({ code: 400, message: 'Failed to create deal close entry' });
        }

        await db.createLead.update(
            {
                dynamic_fields: sequelize.literal('JSON_SET(dynamic_fields, "$.status", "Deal Close")'),
                customer_code: customer_code
            },
            { where: { id: lead_id } }
        );

        if (company_name && customer_code) {
          let customerProfile =   await db.customerProfile.create({
                employee_id,
                entity_id,
                financial_year_id,
                company_name,
                customer_code
                
            });
            await db.customerBilling.create(
                {
                    customer_id: customerProfile.id, full_billing_add:address,billing_mobile_no1:contact_number,  billing_email_id1:mail_id,
                }
            );
            await db.customerAddress.create({
                billing_address: address, shipping_address: address, customer_id: customerProfile.id
            });
            await db.proposalData.update(
                { customer_id: customerProfile.id },
                { where: { id: proposal_id } }
            );

        } else {
            return res.status(400).send({ code: 400, message: 'Company name and customer code are required' });
        }

        return res.status(200).send({ code: 200, message: 'Successfully created' });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}

module.exports.getDealClosedList = async (req, res) => {
    try {
        const { login_id } = req.query;
        let condition;
        if (login_id === 23 || login_id == '23' || login_id == 'Super Admin') {
            condition = `1=1`
        } else {
            condition = `CL.login_id=${login_id} OR CP.employee_id=${login_id}`
        }
        const [getDealClose] = await db.sequelize.query(
            `SELECT CP.id,CP.proposal_no,CP.grant_total,
                CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,
                DATE_FORMAT(CP.createdAt,'%Y-%m-%d') AS createdAt,CL.company_name
                FROM CRM_PROPOSAL_DEAL_CLOSE_MST AS C
                INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id=C.proposal_id
                INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id=C.version_id 
                INNER JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id= CP.create_lead_id
                INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id=CL.login_id
                WHERE ${condition} ORDER BY C.id DESC`
        )
        const dataList = await db.proposalData.findAll({
            where: { existing_client: true, proposal_status: 'approved' },
            order: [["id", "DESC"]]
        });
        const Obj = [...getDealClose, ...dataList]
        const sortedResults = Obj.sort((a, b) => b.id - a.id);
        if (sortedResults.length > 0) {
            return res.status(200).send({ code: 200, message: 'success', data: sortedResults });
        } else {
            return res.status(200).send({ code: 404, message: ' not data found' });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}

module.exports.dealCloseVersionByLeadId = async (req, res) => {
    try {
        const { lead_id, login_id } = req.query;
        let condition;
        if (login_id === 23 || login_id == '23' || login_id == 'Super Admin') {
            condition = `1=1`
        } else {
            condition = `(CL.login_id=${login_id} OR C.employee_id=${login_id})`;
        }
        const dataList = await db.sequelize.query(
            `SELECT proposal_id, proposal_no, lead_id, version_id, version
            FROM ( SELECT DISTINCT C.id AS proposal_id, C.proposal_no, CL.id AS lead_id, PL.version_id, CV.version
            FROM CRM_CREATE_PROPOSAL_MST AS C
            INNER JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
            INNER JOIN CRM_PROPOSAL_LIST_MST AS PL ON PL.proposal_id = C.id
            INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = PL.version_id
            WHERE ${condition} AND CL.id=${lead_id}
            ) AS distinct_proposals
            ORDER BY version_id DESC`
        )
        if (dataList.length > 0) {
            return res.status(200).send({ code: 200, message: "success", data: dataList[0] });
        } else {
            return res.status(404).send({ code: 404, message: ' not data found' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


module.exports.getDealCloseById = async (req, res) => {
    try {
        const { id,proposalApprovalId } = req.query;
        const dataExist = await db.proposalData.findOne({ where: { id } })
        const getData = await db.dealClose.findOne({ where: { proposal_id: dataExist.id } })
        if (!getData) {

            const result = await db.sequelize.query(`
            SELECT DISTINCT C.proposal_no, PA.id AS proposal_approval_id,PA.employee_id,PA.workflow_id, C.id,C.create_lead_id, C.proposal_type, C.gst_no, C.total_cost, C.additional_charges, C.discount, C.taxable_value, C.sgst, C.cgst,
            C.igst, C.grant_total, C.mail_id , C.proposal_status, C.request_type, C.company_name,
            C.lead_owner,C.contact_person_name,C.contact_number,
            C.mail_id,R.first_name, R.middle_name, R.last_name, R.employee_official_email, 
            DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
            FROM CRM_CREATE_PROPOSAL_MST AS C
            INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
            LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.employee_id
             LEFT JOIN PROPOSAL_APPROVAL AS PA ON  C.id =  PA.proposal_id
            WHERE C.id =${dataExist.id} ORDER BY C.id DESC`
            );
            const allResult = await db.sequelize.query(
                `SELECT DISTINCT CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
                    P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, CP.product_category_id,CP.pro_sub_cat_id,
                    P.description AS product_description, P.MVP AS price_per_unit, P.hsn_code_id, P.igst AS gst, P.maximum_discount, T.uom_name, T.uom_id
                    FROM CRM_PROPOSAL_LIST_MST AS CP
                    INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
                    INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
                    
                    INNER JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id 
                    WHERE CP.proposal_id = ${dataExist.id}
                    `
            )
            let charges = await db.proposalAddtionalCharges.findAll({where:{proposal_id:dataExist.id}})

            const maxDiscount = Math.max(... allResult[0].map(p => p.discount_request));
            console.log('-------------------', maxDiscount, '--------------------')
            const transformedResult = {
                ...result[0][0],
                productDetailList: allResult[0],
                charges:charges
            }
            let approvalData = await db.proposalApprovel.findOne({where:{id:proposalApprovalId}});


            let discount = await db.Work_Flow_range.findOne({where:{workflow_id:approvalData.workflow_id,employee_id:approvalData.employee_id}});
            console.log(discount);
            if(discount.discount_percent >=maxDiscount){
                transformedResult.discountStatus='Approved'
            }else{
                transformedResult.discountStatus='Farword'

            }

            if (transformedResult) {
                return res.status(200).send({ code: 200, message: 'success', data: transformedResult });
            } else {
                return res.status(404).send({ code: 404, message: ' data not found ', data: transformedResult });
            }
        } else {


            const result = await db.sequelize.query(`
            SELECT DISTINCT C.proposal_no, C.id,C.create_lead_id,PA.id AS proposal_approval_id, C.proposal_type, C.gst_no, C.total_cost, C.additional_charges, C.discount, C.taxable_value, C.sgst, C.cgst,
            C.igst, C.grant_total, C.mail_id , C.proposal_status, C.request_type, C.company_name,
            C.lead_owner,C.contact_person_name,C.contact_number,
            C.mail_id,R.first_name, R.middle_name, R.last_name, R.employee_official_email,
            DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
            FROM CRM_CREATE_PROPOSAL_MST AS C
            INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
            INNER JOIN CRM_PROPOSAL_DEAL_CLOSE_MST AS CD ON CD.proposal_id=C.id
            LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.employee_id
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON  C.id =  PA.proposal_id
        WHERE CD.id =${getData.id} ORDER BY C.id DESC`
            );
            const allResult = await db.sequelize.query(
                `SELECT DISTINCT CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
                P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, CP.product_category_id,CP.pro_sub_cat_id,
                P.description AS product_description, CP.price_per_unit, P.maximum_discount, P.hsn_code_id, P.igst AS gst, T.uom_name, T.uom_id
                FROM CRM_PROPOSAL_LIST_MST AS CP
                INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
                INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
                
                INNER JOIN CRM_PROPOSAL_DEAL_CLOSE_MST AS CD ON CD.proposal_id=C.id
                INNER JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id 
                WHERE CD.id =${getData.id}
                AND CP.createdAt = (SELECT MAX(createdAt) 
                               FROM CRM_PROPOSAL_LIST_MST 
                               WHERE proposal_id = ${getData.proposal_id})`
            )
            const transformedResult = {
                ...result[0][0],
                productDetailList: allResult[0]
            }


            if (transformedResult) {
                return res.status(200).send({ code: 200, message: 'success', data: transformedResult });
            } else {
                return res.status(404).send({ code: 404, message: ' data not found ', data: transformedResult });
            }
        }


    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || 'Server error' });
    }
}

// module.exports.getSalesOrderList = async (req, res) => {
//     try {
//         const { login_id } = req.query;
//         let condition;

//         if (login_id === 23 || login_id == '23' || login_id == 'Super Admin') {
//             condition = `1=1`;
//         } else {
//             condition = `CL.login_id=${login_id} OR CP.employee_id=${login_id}`;
//         }

//         // Fetch Deal Close data with order_number and do_id if available
//         const [getDealClose] = await db.sequelize.query(`
//             SELECT CP.proposal_no, CP.grant_total, CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,
//                 DATE_FORMAT(CP.createdAt, '%Y-%m-%d') AS createdAt, CL.company_name, C.proposal_id,
//                 A.order_number, A.id AS do_id
//             FROM CRM_PROPOSAL_DEAL_CLOSE_MST AS C
//             INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = C.proposal_id
//             INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = C.version_id
//             INNER JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = CP.create_lead_id
//             INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = CL.login_id
//             LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.proposal_id  
//             WHERE ${condition}
//             ORDER BY CP.id DESC
//         `);

//         // Fetch Approved Proposals (existing clients) with order_number and do_id if available
//         const [dataList] = await db.sequelize.query(`
//             SELECT C.id AS proposal_id, C.lead_owner, C.company_name, C.proposal_no,
//                 DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt, C.grant_total,
//                 A.order_number, A.id AS do_id
//             FROM CRM_CREATE_PROPOSAL_MST AS C
//             LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.id 
//             WHERE C.existing_client = true AND C.proposal_status = 'approved'
//             ORDER BY C.id DESC
//         `);

//         // Merging both lists and sorting them
//         const Obj = [...getDealClose, ...dataList];
//         const sortedResults = Obj.sort((a, b) => b.proposal_id - a.proposal_id);

//         if (sortedResults.length > 0) {
//             return res.status(200).send({ code: 200, message: 'success', data: sortedResults });
//         } else {
//             return res.status(200).send({ code: 404, message: 'no data found', data: sortedResults });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
// };

// module.exports.getSalesOrderList = async (req, res) => {
//     try {
//         const { login_id } = req.query;
//         let condition;
//         if (login_id === 23 || login_id == '23' || login_id == 'Super Admin') {
//             condition = `1=1`;
//         } else {
//             condition = `CL.login_id = ${login_id} OR CP.employee_id = ${login_id}`;
//         }
//         const [getDealClose] = await db.sequelize.query(`
//             WITH DeliveredQuantities AS (
//                 SELECT 
//                     CA.proposal_id,
//                     SUM(C.qty) AS cumulative_delivered_qty
//                 FROM CRM_ADD_DO_ITEMS_MST AS C
//                 INNER JOIN CRM_ADD_DO_MST AS CA ON C.addDo_id = CA.id
//                 GROUP BY CA.proposal_id
//             ),
//             ProposedQuantities AS (
//                 SELECT 
//                     PL.proposal_id,
//                     SUM(PL.qty) AS total_proposed_qty
//                 FROM CRM_PROPOSAL_LIST_MST AS PL
//                 GROUP BY PL.proposal_id
//             )
//             SELECT CP.proposal_no, CP.grant_total, CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,
//                 DATE_FORMAT(CP.createdAt, '%Y-%m-%d') AS createdAt, CL.company_name, C.proposal_id,
//                 A.order_number, A.id AS do_id,
//                 COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) AS delivered_qty,
//                 COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) AS total_proposed_qty
//             FROM CRM_PROPOSAL_DEAL_CLOSE_MST AS C
//             INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = C.proposal_id
//             INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = C.version_id
//             INNER JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = CP.create_lead_id
//             INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = CL.login_id
//             LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.proposal_id
//             LEFT JOIN DeliveredQuantities AS DQ ON DQ.proposal_id = C.proposal_id
//             LEFT JOIN ProposedQuantities AS PQ ON PQ.proposal_id = C.proposal_id
//             WHERE ${condition}
//             ORDER BY CP.id DESC
//         `);
//         const [dataList] = await db.sequelize.query(`
//             WITH DeliveredQuantities AS (
//                 SELECT 
//                     CA.proposal_id,
//                     SUM(C.qty) AS cumulative_delivered_qty
//                 FROM CRM_ADD_DO_ITEMS_MST AS C
//                 INNER JOIN CRM_ADD_DO_MST AS CA ON C.addDo_id = CA.id
//                 GROUP BY CA.proposal_id
//             ),
//             ProposedQuantities AS (
//                 SELECT 
//                     PL.proposal_id,
//                     SUM(PL.qty) AS total_proposed_qty
//                 FROM CRM_PROPOSAL_LIST_MST AS PL
//                 GROUP BY PL.proposal_id
//             )
//             SELECT C.id AS proposal_id, C.lead_owner, C.company_name, C.proposal_no,
//                 DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt, C.grant_total,
//                 A.order_number, A.id AS do_id,
//                 COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) AS delivered_qty,
//                 COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) AS total_proposed_qty
//             FROM CRM_CREATE_PROPOSAL_MST AS C
//             LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.id
//             LEFT JOIN DeliveredQuantities AS DQ ON DQ.proposal_id = C.id
//             LEFT JOIN ProposedQuantities AS PQ ON PQ.proposal_id = C.id
//             WHERE C.existing_client = true AND C.proposal_status = 'approved' AND (
//                 C.create_lead_id IN (SELECT id FROM CRM_CREATE_LEAD_MST WHERE login_id = ${login_id}) 
//                 OR C.employee_id = ${login_id}
//             )
//             ORDER BY C.id DESC
//         `);
//         const Obj = [...getDealClose, ...dataList];
//         const sortedResults = Obj.sort((a, b) => b.proposal_id - a.proposal_id);

//         if (sortedResults.length > 0) {
//             return res.status(200).send({ code: 200, message: 'success', data: sortedResults });
//         } else {
//             return res.status(200).send({ code: 404, message: 'no data found', data: sortedResults });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
// };


module.  exports.getSalesOrderList = async (req, res) => {
    try {
        const { login_id } = req.query;
        let condition;
        if (login_id === 1 || login_id == '1' || login_id == 'Super Admin') {
            condition = `1=1`;
        } else {
            condition = `CL.login_id = ${login_id} OR CP.employee_id = ${login_id}`;
        }

        const [getDealClose] = await db.sequelize.query(`
            WITH DeliveredQuantities AS (
                SELECT 
                    CA.proposal_id,
                    SUM(C.qty) AS cumulative_delivered_qty
                FROM CRM_ADD_DO_ITEMS_MST AS C
                INNER JOIN CRM_ADD_DO_MST AS CA ON C.addDo_id = CA.id
                GROUP BY CA.proposal_id
            ),
            ProposedQuantities AS (
                SELECT 
                    PL.proposal_id,
                    SUM(PL.qty) AS total_proposed_qty
                FROM CRM_PROPOSAL_LIST_MST AS PL
                GROUP BY PL.proposal_id
            )
            SELECT CP.proposal_no, CP.parent_customer_id, CPM.company_name,  CP.grant_total, CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,
                DATE_FORMAT(CP.createdAt, '%Y-%m-%d') AS createdAt, CL.company_name, C.proposal_id,
                MAX(A.order_number) AS order_number, MAX(A.id) AS do_id,
                COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) AS delivered_qty,
                COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) AS total_proposed_qty
            FROM CRM_PROPOSAL_DEAL_CLOSE_MST AS C
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = C.proposal_id
            INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = C.version_id
            INNER JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = CP.create_lead_id
            INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = CL.login_id
            LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.proposal_id
            LEFT JOIN DeliveredQuantities AS DQ ON DQ.proposal_id = C.proposal_id
            LEFT JOIN ProposedQuantities AS PQ ON PQ.proposal_id = C.proposal_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
            WHERE ${condition}
            GROUP BY CP.proposal_no, CP.grant_total, R.first_name, R.last_name, CP.createdAt, 
                     CL.company_name, C.proposal_id, DQ.cumulative_delivered_qty, PQ.total_proposed_qty
            ORDER BY CP.id DESC
        `);

        const [dataList] = await db.sequelize.query(`
            WITH DeliveredQuantities AS (
                SELECT 
                    CA.proposal_id,
                    SUM(C.qty) AS cumulative_delivered_qty
                FROM CRM_ADD_DO_ITEMS_MST AS C
                INNER JOIN CRM_ADD_DO_MST AS CA ON C.addDo_id = CA.id
                GROUP BY CA.proposal_id
            ),
            ProposedQuantities AS (
                SELECT 
                    PL.proposal_id,
                    SUM(PL.qty) AS total_proposed_qty
                FROM CRM_PROPOSAL_LIST_MST AS PL
                GROUP BY PL.proposal_id
            ),
            LatestVersions AS (
                SELECT 
                    proposal_id,
                    MAX(id) AS latest_version_id
                FROM CRM_VERSION_PROPOSAL_MST
                WHERE is_so_created = 1
                GROUP BY proposal_id
            )
            SELECT 
                V.id AS version_id,
                C.id AS proposal_id,
                C.lead_owner,
                CPM.company_name,
                C.proposal_no,
                DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt,
                C.grant_total,
                MAX(A.order_number) AS order_number,
                MAX(A.id) AS do_id,
                COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) AS delivered_qty,
                COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) AS total_proposed_qty
            FROM CRM_CREATE_PROPOSAL_MST AS C
            LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.id
            LEFT JOIN DeliveredQuantities AS DQ ON DQ.proposal_id = C.id
            LEFT JOIN ProposedQuantities AS PQ ON PQ.proposal_id = C.id
            INNER JOIN LatestVersions AS LV ON LV.proposal_id = C.id
            INNER JOIN CRM_VERSION_PROPOSAL_MST AS V ON V.id = LV.latest_version_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
            WHERE 
                C.existing_client = true AND 
                C.proposal_status = 'approved'
            GROUP BY 
                V.id, C.id, C.lead_owner, C.company_name, C.proposal_no, C.createdAt, 
                C.grant_total, DQ.cumulative_delivered_qty, PQ.total_proposed_qty
            ORDER BY 
                C.id DESC;

        `);

        const Obj = [...getDealClose, ...dataList];
        const sortedResults = Obj.sort((a, b) => b.proposal_id - a.proposal_id);

        if (sortedResults.length > 0) {
            return res.status(200).send({ code: 200, message: 'success', data: sortedResults });
        } else {
            return res.status(200).send({ code: 404, message: 'no data found', data: sortedResults });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};






