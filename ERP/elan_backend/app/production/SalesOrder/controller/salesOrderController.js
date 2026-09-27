const { sendPdfPo, sendPdfMail } = require("../../utils/pdfController/pdf")
const db = require("../../../models/index")

module.exports.pdfSalesOrder = async (req, res) => {
    try {
        const { proposal_id, do_id, entity_id, urlData } = req.query;
        const dataExist = await db.sales_delivery_challan.findOne({ where: { proposal_id, id: do_id } });

        if (!dataExist) {
            return res.status(200).send({ code: 404, message: "Please Create The Challan First" });
        }

        const [result] = await db.sequelize.query(`
         
    SELECT 
    BR.branch_name,BR.branch_gstnumber, CTR.countryss_name,ST.states_name,CTY.city_name,  
  SCTR.countryss_name AS shipping_country_name,SST.states_name AS shipping_state_name,SCTY.city_name AS shipping_city_name,
    CA.*, C.proposal_no, C.mail_id, C.company_name, C.contact_number, C.contact_person_name, C.additional_charges, E.*
    
            FROM CRM_DELIVERY_CHALLAN_MST AS CA
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON C.id = CA.proposal_id
            INNER JOIN MASTER_COUNTRY AS CTR ON CA.customer_billing_country_id=CTR.countryss_id
            INNER JOIN MASTER_STATE AS ST ON CA.customer_billing_state_id =ST.states_id
            INNER JOIN MASTER_CITY AS CTY ON CA.customer_billing_city_id = CTY.city_id
		  INNER JOIN MASTER_BRANCH AS BR ON CA.billing_branch_id = BR.id
              LEFT JOIN MASTER_COUNTRY AS SCTR ON CA.shipping_country_id=SCTR.countryss_id
            LEFT JOIN MASTER_STATE AS SST ON CA.shipping_state_id =SST.states_id
            LEFT JOIN MASTER_CITY AS SCTY ON CA.shipping_city_id = SCTY.city_id
                   

            INNER JOIN ENTITY_MASTER AS E ON E.id = ${entity_id} 
            WHERE C.id = ${proposal_id} AND CA.id = ${do_id} ORDER BY C.id DESC
        `);

        const [allResult] = await db.sequelize.query(`
                    SELECT 
                        C.*, 
                        P.item_name AS product_name, 
                        P.item_code AS product_code,
                        MHSC.hsn_sac_code, 
                        T.uom_name,
                        
                        (C.quantity * C.price_per_unit) AS amount, 
                        
                        COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0) AS discount_amount,
                        
                        (C.quantity * C.price_per_unit) 
                        - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0) AS total_amount,
                        
                        COALESCE(
                            ((C.quantity * C.price_per_unit) 
                            - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
                            * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 
                            0
                        ) AS tax_amount,
                        
                        COALESCE(
                            ((C.quantity * C.price_per_unit) 
                            - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)), 0
                        ) 
                        + COALESCE(
                            ((C.quantity * C.price_per_unit) 
                            - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
                            * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0
                        ) AS final_amount

                    FROM CRM_DELIVERY_CHALLAN_MST AS CA

                    INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C 
                        ON C.sales_delivery_challan_id = CA.id

                    INNER JOIN MASTER_ITEM AS P 
                        ON P.id = C.product_master_id

                    LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC 
                        ON P.hsn_code_id = MHSC.id

                    INNER JOIN MASTER_UOM AS T 
                        ON P.uom_id = T.uom_id

                    WHERE CA.proposal_id = ${proposal_id}
                    AND CA.id = ${do_id}
                    AND C.createdAt = (
                        SELECT MAX(createdAt) 
                        FROM CRM_DELIVERY_CHALLAN_ITEM_MST 
                        WHERE sales_delivery_challan_id = ${dataExist.id}
                    );

        `);
        // const [allResult] = await db.sequelize.query(`
        //     SELECT C.*, P.product_name, P.product_code,MHSC.hsn_sac_code, T.uom_name,
        //         (C.quantity * C.price_per_unit) AS amount, 
        //         (COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) AS discount_amount,
        //         ((C.quantity * C.price_per_unit) - COALESCE((C.quantity * C.price_per_unit * C.discount_request / 100), 0)) AS total_amount,
        //         (COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS tax_amount,
        //         (COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)), 0) 
        //         + COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS final_amount
        //     FROM CRM_DELIVERY_CHALLAN_MST AS CA
        //     INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C ON C.sales_delivery_challan_id = CA.id
        //     INNER JOIN MASTER_PRODUCT AS P ON P.id = C.product_master_id

        //     LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC ON P.hsn_code_id = MHSC.id
        //     INNER JOIN MASTER_UOM AS T ON P.uom_id = T.uom_id
        //     WHERE CA.proposal_id = ${proposal_id} AND CA.id = ${do_id}
        //     AND CA.createdAt = (SELECT MAX(createdAt) FROM CRM_DELIVERY_CHALLAN_ITEM_MST WHERE sales_delivery_challan_id = ${dataExist.id})
        // `);

        let additional_charges = await db.proposalAddtionalCharges.findAll({where:{proposal_id:proposal_id},
        include:[
            {
                model:db.hsn_sac_master
            }
        ]}) 
        const fileName = await sendPdfPo(result, allResult, res, urlData,additional_charges);

        if (result.length > 0) {
            return res.status(200).send({ code: 200, message: 'success', data: result, urlData, fileName });
        } else {
            return res.status(404).send({ code: 404, message: 'data not found', data: result });
        }
    } catch (error) {
        console.log('aditya', error)
        return res.status(500).send({ code: 500, message: error.message });
    }
};




module.exports.pdfSalesOrderMail = async (req, res) => {
    try {

        const { to_email, cc_email, bcc_email, subject, message, attach_file, proposal_id } = req.body;

        const dataExist = await db.sales_delivery_challan.findOne({ where: { proposal_id } })
        

        if (!dataExist) {
            return res.status(200).send({ code: 404, message: "Please Create The Challan First" });
        }

        const [result] = await db.sequelize.query(`
         
    SELECT 
    BR.branch_name,BR.branch_gstnumber, CTR.countryss_name,ST.states_name,CTY.city_name,  
  SCTR.countryss_name AS shipping_country_name,SST.states_name AS shipping_state_name,SCTY.city_name AS shipping_city_name,
    CA.*, C.proposal_no, C.mail_id, C.company_name, C.contact_number, C.contact_person_name, C.additional_charges, E.*
    
            FROM CRM_DELIVERY_CHALLAN_MST AS CA
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON C.id = CA.proposal_id
            INNER JOIN MASTER_COUNTRY AS CTR ON CA.customer_billing_country_id=CTR.countryss_id
            INNER JOIN MASTER_STATE AS ST ON CA.customer_billing_state_id =ST.states_id
            INNER JOIN MASTER_CITY AS CTY ON CA.customer_billing_city_id = CTY.city_id
		  INNER JOIN MASTER_BRANCH AS BR ON CA.billing_branch_id = BR.id
              LEFT JOIN MASTER_COUNTRY AS SCTR ON CA.shipping_country_id=SCTR.countryss_id
            LEFT JOIN MASTER_STATE AS SST ON CA.shipping_state_id =SST.states_id
            LEFT JOIN MASTER_CITY AS SCTY ON CA.shipping_city_id = SCTY.city_id
                   

            INNER JOIN ENTITY_MASTER AS E ON E.id = ${dataExist.entity_id} 
            WHERE C.id = ${proposal_id}  ORDER BY C.id DESC
        `);



        const [allResult] = await db.sequelize.query(
            ` SELECT 
                        C.*, 
                        P.item_name AS product_name, 
                        P.item_code AS product_code,
                        MHSC.hsn_sac_code, 
                        T.uom_name,
                        
                        (C.quantity * C.price_per_unit) AS amount, 
                        
                        COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0) AS discount_amount,
                        
                        (C.quantity * C.price_per_unit) 
                        - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0) AS total_amount,
                        
                        COALESCE(
                            ((C.quantity * C.price_per_unit) 
                            - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
                            * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 
                            0
                        ) AS tax_amount,
                        
                        COALESCE(
                            ((C.quantity * C.price_per_unit) 
                            - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)), 0
                        ) 
                        + COALESCE(
                            ((C.quantity * C.price_per_unit) 
                            - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
                            * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0
                        ) AS final_amount

                    FROM CRM_DELIVERY_CHALLAN_MST AS CA

                    INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C 
                        ON C.sales_delivery_challan_id = CA.id

                    INNER JOIN MASTER_ITEM AS P 
                        ON P.id = C.product_master_id

                    LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC 
                        ON P.hsn_code_id = MHSC.id

                    INNER JOIN MASTER_UOM AS T 
                        ON P.uom_id = T.uom_id

                    WHERE CA.proposal_id = ${proposal_id}
                    
                    AND C.createdAt = (
                        SELECT MAX(createdAt) 
                        FROM CRM_DELIVERY_CHALLAN_ITEM_MST 
                        WHERE sales_delivery_challan_id = ${dataExist.id}
                    );`
        )


        await sendPdfMail(subject, message, to_email, cc_email, bcc_email, attach_file, result, allResult);
        return res.status(200).send({ code: 200, message: 'Email sent successfully' })

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


module.exports.orderList = async (req, res) => {
    try {
        const [getDealClose] = await db.sequelize.query(
            `SELECT CP.proposal_no,C.*,P.item_name AS product_name,CA.id AS doItem_id,CA.sales_status,
            DATE_FORMAT(C.createdAt,'%Y-%m-%d') AS createdAt,CP.company_name,C.proposal_id,PV.variant_name
            FROM CRM_ADD_DO_MST AS C
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id=C.proposal_id
            INNER JOIN CRM_ADD_DO_ITEMS_MST AS CA ON CA.addDo_id=C.id
            INNER JOIN MASTER_ITEM AS P ON P.id=CA.product_master_id
            INNER JOIN MASTER_PRODUCT_VARIANT AS PV ON PV.id = CA.variant_id
            ORDER BY C.id DESC`
        )

        if (getDealClose) {
            return res.status(200).send({ code: 200, message: 'success', data: getDealClose });
        } else {
            return res.status(200).send({ code: 404, message: ' not data found', data: getDealClose });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


module.exports.orderListById = async (req, res) => {
    try {
        const { id, doItem_id } = req.query;
        const [getData] = await db.sequelize.query(
            `SELECT CP.proposal_no,C.*,P.item_name AS product_name,CA.id AS doItem_id,P.id AS product_id,P.product_category_id,PV.id AS product_varient_id,
            DATE_FORMAT(C.createdAt,'%Y-%m-%d') AS createdAt,CP.company_name,PV.variant_name,P.item_code AS product_code,P.description AS product_description,CA.qty
            FROM CRM_ADD_DO_MST AS C
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id=C.proposal_id
            INNER JOIN CRM_ADD_DO_ITEMS_MST AS CA ON CA.addDo_id=C.id
            INNER JOIN MASTER_ITEM AS P ON P.id=CA.product_master_id
            INNER JOIN MASTER_PRODUCT_VARIANT AS PV ON PV.id = CA.variant_id
            WHERE C.id=${id} AND  CA.id = ${doItem_id}`
        )

        if (getData) {
            return res.status(200).send({ code: 200, message: 'success', data: getData[0] });
        } else {
            return res.status(200).send({ code: 404, message: ' not data found', data: getData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}