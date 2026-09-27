const db = require("../../../models/index");
const axios = require('axios')
// const ewayPdfController= require("../utils/pdfController/pdf")
// module.exports.salesOrderById = async (req, res) => {
//     try {
//         const { proposal_id } = req.query;


//         const [result] = await db.sequelize.query(`
//         SELECT DISTINCT C.proposal_no, C.id,
//         C.mail_id , C.company_name,C.contact_person_name,C.contact_number,
//         DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
//         FROM CRM_CREATE_PROPOSAL_MST AS C
//         INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
//         WHERE C.id=${proposal_id} ORDER BY C.id DESC`
//         );

//         const [allResult] = await db.sequelize.query(
//             `SELECT DISTINCT CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
//                 P.id AS product_master_id, P.product_name, P.product_code, PV.variant_name,
//                 P.product_description, P.product_list_price as price_per_unit, P.maximum_discount, T.uom_name, T.uom_id,CP.product_category_id, CP.variant_id
//                 FROM CRM_PROPOSAL_LIST_MST AS CP
//                 INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
//                 INNER JOIN MASTER_PRODUCT AS P ON P.id = CP.product_master_id
//                 INNER JOIN MASTER_PRODUCT_VARIANT AS PV ON CP.variant_id = PV.id
//                 INNER JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id 
//                 WHERE CP.proposal_id = ${proposal_id}
//                 AND CP.createdAt = (SELECT MAX(createdAt) 
//                                FROM CRM_PROPOSAL_LIST_MST 
//                                WHERE proposal_id = ${proposal_id})`
//         )
//         const transformedResult = {
//             ...result[0],
//             productDetailList: allResult
//         }
//         if (transformedResult) {
//             return res.status(200).send({ code: 200, message: 'success', data: transformedResult });
//         } else {
//             return res.status(404).send({ code: 404, message: ' data not found ', data: transformedResult });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
// }


module.exports.salesOrderById = async (req, res) => {
    try {
        const { proposal_id } = req.query;

        const [result] = await db.sequelize.query(`
            SELECT DISTINCT CAC.contact_person_name,CU.supply_type,CU.customer_code,SO.sales_order_no,CA.billing_address,
                CA.billing_pin_code,
                CA.billing_country_id,
                CA.billing_state_id,
                CA.billing_city_id,
                CA.billing_postal_address,
                CA.gst_in,
                CA.shipping_address,
                CA.shipping_pin_code,
                CA.shipping_country_id,
                CA.shipping_state_id,
                CA.shipping_city_id,
                CA.shipping_postal_address
                ,C.proposal_no, C.id, C.customer_id,
                C.mail_id, C.company_name,  C.contact_number,C.totalAMTAfterDiscount,C.discount,C.igst,C.grant_total,VP.billing_address_id,
                DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
                         FROM CRM_CREATE_PROPOSAL_MST AS C
                         
                            INNER JOIN SALES_ORDER_MST AS SO ON C.id = SO.proposal_id
												INNER JOIN CUSTOMER_PROFILE_MST AS CU ON C.customer_id = CU.id
												INNER JOIN CRM_VERSION_PROPOSAL_MST AS VP ON SO.version_id = VP.id
												INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CAC ON SO.customer_contact_id = CAC.id  
												LEFT JOIN CUSTOMER_ADDRESS_MST AS CA ON VP.billing_address_id = CA.id
            WHERE SO.id =${proposal_id} ORDER BY C.id DESC`
        );

        const [allResult] = await db.sequelize.query(`
            SELECT 
            MAX(PL.id) AS id,
    SOL.product_master_id , 
    MAX(I.item_name) AS item_name,
    MAX(I.description) AS product_description,
				 MAX(HSN.hsn_sac_code) AS hsn_code,
    MAX(U.uom_name) AS uom_name,
    MAX(SO.sales_order_no) AS sales_order_no,
    MAX(SOL.quantity) AS quantity,
    MAX(PL.qty) AS total_proposal_qty,
    MAX(PL.dbp) AS avg_dbp,
    MAX(PL.price_per_unit) AS price_per_unit,
    MAX(PL.calculated_price) AS total_calc_price,
    MAX(PL.totalPrice) AS total_price,
    MAX(PL.totalWithGst) AS total_with_gst,
    MAX(PL.igst) AS igst,
    MAX(PL.cgst) AS cgst,
    MAX(PL.sgst) AS sgst,
    MAX(PL.gst_type) AS gst_type,
    MAX(PL.product_category_id) AS product_category_id,
    MAX(PL.pro_sub_cat_id) AS product_sub_category_id,
    MAX(A.asset_category_name) AS category_name,
    MAX(SUB.sub_category_name) AS sub_category_name
FROM SALES_ORDER_MST AS SO 
INNER JOIN SALES_ORDER_ITEM_LIST AS SOL ON SO.id = SOL.sales_order_id
INNER JOIN CRM_PROPOSAL_LIST_MST AS PL ON SO.proposal_id = PL.proposal_id AND SOL.product_master_id = PL.product_master_id
INNER JOIN MASTER_ITEM AS I ON SOL.product_master_id = I.id
INNER JOIN MASTER_UOM AS U ON I.uom_id = U.uom_id
INNER JOIN MASTER_HSN_SAC_CODE AS HSN ON I.hsn_code_id = HSN.id 
INNER JOIN MASTER_ASSET AS A ON PL.product_category_id = A.id
INNER JOIN MASTER_SUB_CATEGORY AS SUB ON PL.pro_sub_cat_id  = SUB.id
WHERE SO.id = ${proposal_id}
GROUP BY SOL.product_master_id;

            `
        );
        let [charges] = await db.sequelize.query(`
            SELECT * FROM CRM_PROPOSAL_ADDTIONAL_LIST_MST AS A
            INNER JOIN CRM_VERSION_PROPOSAL_MST AS V ON  A.version_id = V.id
            WHERE A.proposal_id =${proposal_id} AND V.is_so_created=1
        `)
        // let charges  = await db.proposalAddtionalCharges.findAll({where:{proposal_id:proposal_id}});

        // let [customisation] = await db.sequelize.query(`

        //             SELECT
        //             SOI.id AS so_item_id,
        //             CP.id AS proposal_item_id,
        //             'Customisation' AS item_type,
        //             ACC.accessories_name AS item_name,
        //             AHSN.hsn_sac_code AS hsn_code,
        //             AGRM.value AS gst_rate,
        //             ACC.accessories_price AS price_per_unit,
        //             SOI.quantity AS quantity
        //             FROM CRM_PROPOSAL_LIST_MST CP
        //             JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE CT ON CP.id = CT.proposal_item_id
        //             JOIN CRM_PROPOSAL_CUSTOMISATION_DATA PCD ON PCD.proposal_customisation_id = CT.id
        //             JOIN MASTER_ACCESSORIES_NAME ACC ON ACC.id = PCD.accessory_in_name
        //             JOIN MASTER_HSN_SAC_CODE AHSN ON AHSN.id = ACC.hsn_code_id
        //             JOIN GST_RATE_MASTER AGRM ON AGRM.id = AHSN.gst_rate_id
        //             JOIN SALES_ORDER_ITEM_LIST SOI ON SOI.customization_type_id = CT.id
        //             WHERE SOI.sales_order_id = ${proposal_id}
        //             AND ACC.accessories_name IS NOT NULL

        //             UNION ALL


        //             SELECT
        //             SOI2.id AS so_item_id,
        //             CP.id AS proposal_item_id,
        //             'Branding' AS item_type,
        //             MBR.type_of_branding AS item_name,
        //             BHSN.hsn_sac_code AS hsn_code,
        //             MGRN.value AS gst_rate,
        //             MBR.price_per_unit AS price_per_unit,
        //             SOI2.quantity AS quantity
        //             FROM CRM_PROPOSAL_LIST_MST CP
        //             JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE CT ON CP.id = CT.proposal_item_id
        //             JOIN CRM_PROPOSAL_BRANDING CRB ON CRB.proposal_customisation_id = CT.id
        //             JOIN MASTER_BRANDING MBR ON MBR.id = CRB.branding_mst_id
        //             JOIN MASTER_HSN_SAC_CODE BHSN ON BHSN.id = MBR.hsn_code_id
        //             JOIN GST_RATE_MASTER MGRN ON MGRN.id = BHSN.gst_rate_id
        //             JOIN SALES_ORDER_ITEM_LIST SOI2 ON SOI2.branding_data_id = CRB.id
        //             WHERE SOI2.sales_order_id = ${proposal_id}
        //             AND MBR.type_of_branding IS NOT NULL

        //             UNION ALL


        //             SELECT
        //             SOI.id AS so_item_id,
        //             CP.id AS proposal_item_id,
        //             'Basket' AS item_type,
        //             MB.type_of_basket AS item_name,
        //             MHSN.hsn_sac_code AS hsn_code,
        //             GRMM.value AS gst_rate,
        //             MB.price_per_unit AS price_per_unit,
        //             NULL AS quantity
        //             FROM CRM_PROPOSAL_LIST_MST CP
        //             JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE CT ON CP.id = CT.proposal_item_id
        //             JOIN CRM_PROPOSAL_CUSTOMISATION_DATA PCD ON PCD.proposal_customisation_id = CT.id
        //             JOIN MASTER_BASKET MB ON MB.id = PCD.basket_mst_id
        //             JOIN MASTER_HSN_SAC_CODE MHSN ON MHSN.id = MB.hsn_code_id
        //             JOIN GST_RATE_MASTER GRMM ON GRMM.id = MHSN.gst_rate_id
        //             JOIN SALES_ORDER_ITEM_LIST SOI ON SOI.customization_type_id = CT.id
        //             WHERE SOI.sales_order_id = ${proposal_id}
        //             AND MB.type_of_basket IS NOT NULL;

        //         `)



        // const mapCustomisationsToProducts = (products, customisations) => {
        //     const grouped = {};

        //     for (const item of customisations || []) {
        //         const key = item.proposal_item_id;
        //         if (!grouped[key]) grouped[key] = [];
        //         grouped[key].push(item);
        //     }

        //     return (products || []).map(product => {
        //         const relatedItems = grouped[product.id] || [];

        //         const customisation_data = relatedItems.filter(c => c.item_type === 'Customisation');
        //         const branding_data = relatedItems.filter(c => c.item_type === 'Branding');

        //         return {
        //             ...product,
        //             customisation_data,
        //             branding_data
        //         };
        //     });
        // };

        const enrichedProductList = await getCustomisationBrandingData(proposal_id, allResult, 'A');

        const transformedResult = {
            ...result[0],
            productDetailList: enrichedProductList,
            charges: charges || []

        };


        if (transformedResult && transformedResult.productDetailList?.length) {
            return res.status(200).send({
                code: 200,
                message: 'Success',
                data: transformedResult
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: 'Data not found',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
};


module.exports.createAddDo = async (req, res) => {
    try {

        const { do_date, billing_address, shipping_address, proposal_no, order_number, notes, terms_and_conditions, upload_file, productDetailList, proposal_id, branch_id,
            state_id } = req.body;



        const createData = await db.addDo.create({
            do_date, billing_address, shipping_address, proposal_no, order_number, notes, terms_and_conditions, upload_file, proposal_id, branch_id,
            state_id
        })
        await Promise.all(productDetailList.map(async (item) => {
            const { qty, price_per_unit, cgst, sgst, igst, product_master_id, variant_id } = item;
            await db.addDoItem.create({
                addDo_id: createData.id, qty, price_per_unit, cgst, sgst, igst, product_master_id, variant_id
            })
        }))
        if (createData) {
            return res.status(201).send({ code: 201, message: 'Do Created SuccessFully' });
        } else {
            return res.status(200).send({ code: 400, message: 'Not Created ' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


// module.exports.salesOrderByProposalId = async (req, res) => {
//     try {
//         const {  proposal_id } = req.query;
//         const dataExist = await db.addDo.findOne({where:{proposal_id}})
//         if(!dataExist){
//             return res.status(404).send({code:404,message:"Please Create The Do First"})
//         }
//         const [result] = await db.sequelize.query(`
//         SELECT CA.* ,C.proposal_no,C.mail_id,C.company_name,C.contact_number,C.contact_person_name,C.lead_owner,C.additional_charges
//         FROM CRM_ADD_DO_MST AS CA
//         INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON C.id=CA.proposal_id
//         WHERE C.id=${proposal_id} ORDER BY C.id DESC`
//         );
//             const [allResult] = await db.sequelize.query(
//                 `SELECT C.*, P.product_name, P.product_code, PV.variant_name,P.product_description, T.uom_name,
//                 (C.qty * C.price_per_unit) AS amount, 
//                 (COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) AS discount_amount,
//                 ((C.qty * C.price_per_unit) - COALESCE((C.qty * C.price_per_unit * C.discount_request / 100), 0)) AS total_amount,
//                 (COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst+C.sgst+cgst, 0) / 100, 0)) AS tax_amount,
//                 (COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)), 0) 
//                 + COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst+ C.sgst + cgst, 0) / 100, 0)) AS final_amount
//             FROM CRM_ADD_DO_MST AS CA
//             INNER JOIN CRM_ADD_DO_ITEMS_MST AS C ON C.addDo_id = CA.id
//             INNER JOIN MASTER_PRODUCT AS P ON P.id = C.product_master_id
//             INNER JOIN MASTER_PRODUCT_VARIANT AS PV ON C.variant_id = PV.id
//             INNER JOIN MASTER_UOM AS T ON P.uom_id = T.uom_id
//                 WHERE CA.proposal_id = ${proposal_id}
//                 AND CA.createdAt = (SELECT MAX(createdAt) 
//                                FROM CRM_ADD_DO_ITEMS_MST 
//                                WHERE addDo_id = ${dataExist.id})`
//             )

//             const transformedResult = {
//                 ...result[0],
//                 productDetailList: allResult
//             }
//         if (result.length > 0) {
//             return res.status(200).send({ code: 200, message: 'success', data: transformedResult });
//         } else {
//             return res.status(404).send({ code: 404, message: ' data not found ', data: transformedResult });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
// }


module.exports.salesOrderByProposalId = async (req, res) => {
    try {
        const { so_id, do_id } = req.query;
        const dataExist = await db.sales_delivery_challan.findOne({ where: { so_id, id: do_id }, order: [['createdAt', 'DESC']], });

        if (!dataExist) {
            return res.status(404).send({ code: 404, message: "No DO found for this Proposal ID and DO ID" });
        }
        const [result] = await db.sequelize.query(`
            SELECT C.id AS proposal_id,SO.version_id, BR.branch_name,CTR.countryss_name,ST.states_name,CTY.city_name,CA.*, C.proposal_no, C.mail_id, C.company_name, CUST.mobile AS contact_number, CUST.contact_person_name, 
            SCTR.countryss_name AS shipping_country_name,SST.states_name AS shipping_state_name,SCTY.city_name AS shipping_city_name, 
                   C.lead_owner, C.additional_charges
            FROM CRM_DELIVERY_CHALLAN_MST AS CA
            INNER JOIN SALES_ORDER_MST AS SO ON CA.so_id=SO.id
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON SO.proposal_id = C.id
            INNER JOIN MASTER_COUNTRY AS CTR ON CA.customer_billing_country_id=CTR.countryss_id
            INNER JOIN MASTER_STATE AS ST ON CA.customer_billing_state_id =ST.states_id
            INNER JOIN MASTER_CITY AS CTY ON CA.customer_billing_city_id = CTY.city_id
            INNER JOIN MASTER_BRANCH AS BR ON CA.billing_branch_id = BR.id
            LEFT JOIN MASTER_COUNTRY AS SCTR ON CA.shipping_country_id=SCTR.countryss_id
            LEFT JOIN MASTER_STATE AS SST ON CA.shipping_state_id =SST.states_id
            LEFT JOIN MASTER_CITY AS SCTY ON CA.shipping_city_id = SCTY.city_id
            INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CUST ON C.customer_id = CUST.customer_id
            WHERE CA.so_id = ${so_id} AND CA.id = ${do_id}
            ORDER BY CA.createdAt DESC
            LIMIT 1
        `);
        // const [allResult] = await db.sequelize.query(`
        //     SELECT 
        //     PL.totalDiscountAmountPerQTY,
        //         PL.id AS proposal_item_id,
        //         (PL.totalDiscountAmount/PL.qty) AS singleItemDiscount,
        //         (PL.totalWithGst/PL.qty) AS singleItemDiscount,
        //         PL.version_id,
        //         PL.discount1,PL.discount2, PL.discount3, PL.discount1Flat, PL.discount2Flat, PL.discount3Flat,
        //         PL.discount1Mode, PL.discount2Mode, PL.discount3Mode, PL.totalDiscountAmount,
        //         PL.totalWithGst,PL.totalPrice,C.*, P.item_name AS product_name, P.item_code AS product_code,P.hsn_code_id,MHSC.hsn_sac_code,  P.description AS product_description, T.uom_name,
        //         (C.quantity * C.price_per_unit) AS amount, 
        //         (COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) AS discount_amount,
        //         ((C.quantity * C.price_per_unit) - COALESCE((C.quantity * C.price_per_unit * C.discount_request / 100), 0)) AS total_amount,
        //         (COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
        //             * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS tax_amount,
        //         (COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)), 0) 
        //         + COALESCE(((C.quantity * C.price_per_unit) - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)) 
        //             * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS final_amount
        //     FROM CRM_DELIVERY_CHALLAN_MST AS CA
        //     INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C ON C.sales_delivery_challan_id = CA.id
        //     INNER JOIN MASTER_ITEM AS P ON P.id = C.product_master_id
        //  	INNER JOIN SALES_ORDER_MST AS SO ON CA.so_id=SO.id 
        //  	INNER JOIN CRM_PROPOSAL_LIST_MST AS PL ON SO.proposal_id = PL.proposal_id 
        //  	AND SO.version_id = PL.version_id AND C.product_master_id = PL.product_master_id
        //     INNER JOIN MASTER_UOM AS T ON P.uom_id = T.uom_id
        //     LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC ON P.hsn_code_id = MHSC.id
        //     WHERE CA.so_id = ${so_id}  AND C.quantity > 0 AND CA.id = ${do_id} GROUP BY C.id
        // `);
        const [allResult] = await db.sequelize.query(`
            SELECT 
    PL.totalDiscountAmountPerQTY,
    PL.id AS proposal_item_id,
    (PL.totalDiscountAmount / PL.qty) AS singleItemDiscount,
    (PL.totalWithGst / PL.qty) AS singleItemWithGst,
    PL.version_id,
    PL.discount1, PL.discount2, PL.discount3,
    PL.discount1Flat, PL.discount2Flat, PL.discount3Flat,
    PL.discount1Mode, PL.discount2Mode, PL.discount3Mode,
    PL.totalDiscountAmount,
    PL.totalWithGst,
    PL.totalPrice,
    C.*,
    P.item_name AS product_name,
    P.item_code AS product_code,
    P.hsn_code_id,
    MHSC.hsn_sac_code,
    P.description AS product_description,
    T.uom_name,

    (C.quantity * C.price_per_unit) AS amount,

    COALESCE(
        C.quantity * C.price_per_unit * C.discount_request / 100,
        0
    ) AS discount_amount,

    ((C.quantity * C.price_per_unit)
      - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)
    ) AS total_amount,

    COALESCE(
        (
            ((C.quantity * C.price_per_unit)
             - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)
            )
            * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100
        ),
        0
    ) AS tax_amount,

    (
        ((C.quantity * C.price_per_unit)
         - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)
        )
        + COALESCE(
            (
                ((C.quantity * C.price_per_unit)
                 - COALESCE(C.quantity * C.price_per_unit * C.discount_request / 100, 0)
                )
                * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100
            ),
            0
        )
    ) AS final_amount

FROM CRM_DELIVERY_CHALLAN_MST AS CA
INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C 
    ON C.sales_delivery_challan_id = CA.id
INNER JOIN MASTER_ITEM AS P 
    ON P.id = C.product_master_id
INNER JOIN SALES_ORDER_MST AS SO 
    ON CA.so_id = SO.id
INNER JOIN CRM_PROPOSAL_LIST_MST AS PL 
    ON SO.proposal_id = PL.proposal_id 
   AND SO.version_id = PL.version_id 
   AND C.product_master_id = PL.product_master_id
INNER JOIN MASTER_UOM AS T 
    ON P.uom_id = T.uom_id
LEFT JOIN MASTER_HSN_SAC_CODE AS MHSC 
    ON P.hsn_code_id = MHSC.id
WHERE 
    CA.so_id = ${so_id}
    AND CA.id = ${do_id}
    AND C.quantity > 0;

        `);
        let itemId = Array.from(
            new Set(
                allResult
                    .filter(x => x.proposal_item_id)
                    .map(x => x.proposal_item_id)
            )
        );
        let itemIdList = itemId.join(',');
        let [cashDiscountList] = await db.sequelize.query(`
            SELECT  DM.discount_name, SUM(DB.perQtyAmount) AS discount_amount FROM CRM_PROPOSAL_GROSS_DISCOUNT_BREAKUP AS DB 
            INNER JOIN CRM_PROPOSAL_GROSS_DISCOUNT_MST AS DM 
            ON DB.gross_discount_id = DM.id
            WHERE DB.proposal_id = ${result[0].proposal_id} AND DB.version_id=${result[0].version_id} AND DB.proposal_list_id IN (${itemIdList})
            GROUP BY DB.gross_discount_id
            `)
        const enrichedProductList = await getCustomisationBrandingData(so_id, allResult, 'B');
        // const cashDiscountList  = 
        // let charges = await db.proposalAddtionalCharges.findAll({
        //     where: { proposal_id: proposal_id },
        //     include: [
        //         {
        //             model: db.hsn_sac_master
        //         },

        //         {
        //             model: db.versionData,
        //             where: { is_so_created: 1 },
        //             required: true
        //         },
        //     ]
        // })
        // let flatCharges = charges.map(charge => {
        //     const hsn = charge.MASTER_HSN_SAC_CODE;

        //     return {
        //         id: charge.id,
        //         charge_name: charge.charge_name,
        //         amount: charge.amount,
        //         tax_rate: charge.tax_rate,
        //         description: charge.description,
        //         hsn_code_id: charge.hsn_code_id,
        //         hsn_code: hsn ? hsn.hsn_sac_code : null,
        //         hsn_description: hsn ? hsn.description : null,
        //         exemption: hsn ? hsn.exemption : null,
        //         gst_rate: hsn ? hsn.gst_rate_id : null,
        //         createdAt: charge.createdAt,
        //         updatedAt: charge.updatedAt

        //     };
        // });
        const transformedResult = {
            ...result[0],
            productDetailList: enrichedProductList,
            charges: [],
            cashDiscountList
        };
        return res.status(200).send({ code: 200, message: 'success', data: transformedResult });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};




exports.generateDeliveryOrderNumber = async (req, res) => {
    try {
        const financial_year_id = req.query.financial_year_id;
        const financialYearEntry = await db.financial_year.findOne({
            where: { id: financial_year_id },
            attributes: ["financial_year"],
        });
        if (!financialYearEntry) {
            return res.status(400).send({ code: 400, message: "Invalid financial year ID" });
        }
        const financialYear = financialYearEntry.financial_year;
        const lastEntry = await db.sales_delivery_challan.findOne({
            order: [["createdAt", "DESC"]],
            attributes: ["do_no"],
        });
        let number;
        if (lastEntry) {
            const lastCode = parseInt(lastEntry.do_no.split('/').pop());
            const newCode = lastCode + 1;
            number = `DO/${financialYear}/${newCode.toString().padStart(4, '0')}`;
        } else {
            number = `DO/${financialYear}/0001`;
        }

        return res.status(200).send({ code: 200, message: "Delivery Order Number Generated", data: number });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


// module.exports.salesOrderHistory = async (req, res) => {
//     try {
//         const { proposal_id } = req.query;
//         const dataExist = await db.addDo.findOne({ where: { proposal_id } });
//         if (!dataExist) {
//             return res.status(200).send({ code: 404, message: "No record available", data: [] });
//         }
//         const [result] = await db.sequelize.query(`
//             SELECT 
//                 C.*, 
//                 P.product_name, 
//                 P.product_code, 
//                 PV.variant_name,
//                 P.product_description, 
//                 T.uom_name,
//                 CA.do_date,
//                 CA.order_number,
//                 CA.proposal_no,
//                 (C.qty * C.price_per_unit) AS amount, 
//                 (COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) AS discount_amount,
//                 ((C.qty * C.price_per_unit) - COALESCE((C.qty * C.price_per_unit * C.discount_request / 100), 0)) AS total_amount,
//                 (COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS tax_amount,
//                 (COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)), 0) 
//                 + COALESCE(((C.qty * C.price_per_unit) - COALESCE(C.qty * C.price_per_unit * C.discount_request / 100, 0)) * COALESCE(C.igst + C.sgst + C.cgst, 0) / 100, 0)) AS final_amount,
//                 PL.qty AS proposed_quantity,
//                 (PL.qty - C.qty) AS remaining_quantity  -- Calculate the remaining quantity
//             FROM CRM_ADD_DO_MST AS CA
//             INNER JOIN CRM_ADD_DO_ITEMS_MST AS C ON C.addDo_id = CA.id
//             INNER JOIN MASTER_PRODUCT AS P ON P.id = C.product_master_id
//             INNER JOIN MASTER_PRODUCT_VARIANT AS PV ON C.variant_id = PV.id
//             INNER JOIN MASTER_UOM AS T ON P.uom_id = T.uom_id
//             LEFT JOIN CRM_PROPOSAL_LIST_MST AS PL ON PL.proposal_id = CA.proposal_id AND PL.product_master_id = P.id
//             WHERE CA.proposal_id = ${proposal_id}
//         `);

//         if (result.length > 0) {
//             return res.status(200).send({ code: 200, message: 'success', data: result });
//         } else {
//             return res.status(404).send({ code: 404, message: 'data not found', data: result });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
// }
module.exports.salesOrderHistory = async (req, res) => {
    try {
        const { proposal_id } = req.query;
        const dataExist = await db.sales_delivery_challan.findOne({ where: { proposal_id } });

        if (!dataExist) {
            return res.status(200).send({ code: 404, message: "No record available", data: [] });
        }
        const proposalDetails = await db.proposalData.findOne({ where: { id: proposal_id } });

        const [result] = await db.sequelize.query(`
            WITH DeliveredQuantities AS (
                SELECT 
                    C.*, 
                    P.product_name, 
                    P.product_code, 
                 
                    P.product_description, 
                    T.uom_name,
                    CA.do_date,
                    CA.do_no,
                    PR.proposal_no,
                    CA.id AS do_id, 
                    PL.qty AS proposed_quantity,
                    C.quantity AS delivered_qty,
                    SUM(C.quantity) OVER (PARTITION BY C.product_master_id ORDER BY CA.id, CA.do_no ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total_delivered_quantity
                FROM CRM_DELIVERY_CHALLAN_MST AS CA
                INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS C ON C.sales_delivery_challan_id = CA.id
                INNER JOIN MASTER_PRODUCT AS P ON P.id = C.product_master_id
              
                LEFT JOIN MASTER_UOM AS T ON P.uom_id = T.uom_id
                LEFT JOIN CRM_PROPOSAL_LIST_MST AS PL ON PL.proposal_id = CA.proposal_id AND PL.product_master_id = P.id
                  INNER JOIN CRM_VERSION_PROPOSAL_MST AS V ON  PL.version_id = V.id
                INNER JOIN CRM_CREATE_PROPOSAL_MST AS PR ON PL.proposal_id = PR.id
                WHERE CA.proposal_id = ${proposal_id}  AND V.is_so_created=1
            )
            SELECT 
                product_name, 
                product_code, 
           
                product_description,
                uom_name,
                do_date,
                do_no,
                proposal_no,
                do_id,  
                ${proposal_id} AS proposal_id, 
                proposed_quantity,
                delivered_qty,
                total_delivered_quantity,
                (proposed_quantity - total_delivered_quantity) AS remaining_quantity
            FROM DeliveredQuantities
            ORDER BY do_id DESC 


        `);
        if (result.length > 0) {
            return res.status(200).send({
                code: 200,
                message: 'success',
                data: result,
                proposalDetails: proposalDetails || {},
                proposal_id: proposal_id
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: 'data not found',
                data: result,
                proposalDetails: proposalDetails || {},
                proposal_id: proposal_id
            });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};











module.exports.getAllActiveTransType = async (req, res) => {
    try {
        const getTransAllData = await db.transType.findAll({ where: { status: "ACTIVE", isDeleted: false } })
        if (getTransAllData) {
            return res.status(200).send({ code: 200, message: 'Trans type data fetched successfully!', data: getTransAllData })
        } else {
            return res.send(201).send({ code: 201, message: 'Data not found!' })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || 'Internal server error!' })

    }
}

module.exports.getSupplyType = async (req, res) => {
    try {
        const getsupplyType = await db.supplyType.findAll({ where: { status: "ACTIVE", isDeleted: false } })
        if (getsupplyType) {
            return res.status(200).send({ code: 200, message: 'Supply type data fetched successfully!', data: getsupplyType })
        } else {
            return res.send(201).send({ code: 201, message: 'Data not found!' })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || 'Internal server error!' })

    }
}
module.exports.getDocumentType = async (req, res) => {
    try {
        const getDocument = await db.documentType.findAll({ where: { status: "ACTIVE", isDeleted: false } })
        if (getDocument) {
            return res.status(200).send({ code: 200, message: 'Supply type data fetched successfully!', data: getDocument })
        } else {
            return res.send(201).send({ code: 201, message: 'Data not found!' })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || 'Internal server error!' })

    }
}




////////////////////////////////////////////////////////////////////////
exports.getCdkDataByEntityId = async (req, res) => {
    try {
        const entity_id = req.params.entity_id;
        const getData = await db.gstInfo.findOne({
            where: { entity_id: entity_id }
        });

        if (!getData) {
            return res.status(404).send({ code: 404, message: "CDK details not found!" });
        }
        return res.status(200).send({
            code: 200,
            data: getData,
            message: "CDK data fetched successfully!"
        });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal server error!" });
    }
};


// module.exports.getInvoiceIrnDataByDoId = async (req, res) => {
//     try {
//         const dataExist = await db.ewayData.findOne({
//             where: {
//                 do_id: req.params.do_id
//             },
//         });

//         if (!dataExist) {
//             return res.status(404).send({ code: 404, message: "IRN data not found!" });
//         }
//         return res.status(200).send({ code: 200, message: 'IRN data fetched successfully!', data: dataExist });

//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
// };


exports.getDeliveryChallanDataById = async (req, res) => {
    try {
        const { do_id, invoice_mode } = req.params;


        if (invoice_mode !== 'DIRECT') {


            const getData = await db.sales_delivery_challan.findOne({
                where: { id: do_id }
            });
            if (!getData) {
                return res.status(404).send({ code: 404, message: "Delivery challan details not found!" });
            }
            const additional_charges = await db.proposalData.findOne({
                where: { id: getData.so_id },
                attributes: ['additional_charges']
            });
            const [productData] = await db.sequelize.query(`
                 SELECT 
            MAX(PL.id) AS id,
    SOL.product_master_id , 
    MAX(I.item_name) AS item_name,
     MAX(PL.totalDiscountAmountPerQTY) AS discount,
    MAX(I.description) AS product_description,
				 MAX(HSN.hsn_sac_code) AS hsn_code,
    MAX(U.uom_name) AS uom_name,
    MAX(SO.sales_order_no) AS sales_order_no,
    MAX(SOL.quantity) AS quantity,
    MAX(PL.qty) AS total_proposal_qty,
    MAX(PL.dbp) AS avg_dbp,
    MAX(PL.price_per_unit) AS price_per_unit,
    MAX(PL.calculated_price) AS total_calc_price,
    MAX(PL.totalPrice) AS total_price,
    MAX(PL.totalWithGst) AS total_with_gst,
    MAX(PL.igst) AS igst,
    MAX(PL.cgst) AS cgst,
    MAX(PL.sgst) AS sgst,
    MAX(PL.gst_type) AS gst_type,
    MAX(PL.product_category_id) AS product_category_id,
    MAX(PL.pro_sub_cat_id) AS product_sub_category_id,
    MAX(A.asset_category_name) AS category_name,
    MAX(SUB.sub_category_name) AS sub_category_name
FROM SALES_ORDER_MST AS SO 
INNER JOIN SALES_ORDER_ITEM_LIST AS SOL ON SO.id = SOL.sales_order_id
INNER JOIN CRM_PROPOSAL_LIST_MST AS PL ON SO.proposal_id = PL.proposal_id AND SOL.product_master_id = PL.product_master_id
INNER JOIN MASTER_ITEM AS I ON SOL.product_master_id = I.id
INNER JOIN MASTER_UOM AS U ON I.uom_id = U.uom_id
INNER JOIN MASTER_HSN_SAC_CODE AS HSN ON I.hsn_code_id = HSN.id 
INNER JOIN MASTER_ASSET AS A ON PL.product_category_id = A.id
INNER JOIN MASTER_SUB_CATEGORY AS SUB ON PL.pro_sub_cat_id  = SUB.id
WHERE SO.id = ${getData.so_id}
GROUP BY SOL.product_master_id;
                `);



            const [Quantity] = await db.sequelize.query(`SELECT 
            CI.product_master_id, CI.sales_delivery_challan_id, CI.quantity AS tempQuantity FROM CRM_DELIVERY_CHALLAN_MST AS CM INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS CI ON CI.sales_delivery_challan_id = CM.id`
            )

            // productData.forEach(product => {
            //     Quantity.forEach(item => {
            //         if (product.product_master_id == item.product_master_id) {
            //             product.tempQuantity = item.tempQuantity
            //         }
            //     });
            // });

            // let charges = await db.proposalAddtionalCharges.findAll({
            //     where: { proposal_id: getData.proposal_id },
            //     include: [
            //         {
            //             model: db.versionData,
            //             where: { is_so_created: 1 }
            //         }
            //     ]
            // })


            const enrichedProductList = await getCustomisationBrandingData(getData.so_id, productData, 'A');


            return res.status(200).send({
                code: 200,
                data: {
                    challanData: {
                        ...getData.dataValues,
                        // additional_charges: additional_charges?.additional_charges || 0
                    },
                    productData: enrichedProductList,
                    // charges: charges
                },
                message: "Data fetched successfully!"
            });
        } else {
            let irnData = await db.salesInvoiceData.findOne({
                where: { id: do_id },
                include: [
                    {
                        model: db.salesDirectInvoiceItem,
                        include: [
                            {
                                model: db.ItemMaster,
                                include: [
                                    {
                                        model: db.uom
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (irnData) {


                let items = irnData?.CRM_DIRECT_INVOICE_ITEM_MSTs.map(item => ({
                    product_category_id: item.product_category_id,
                    product_master_id: item.product_master_id,
                    pro_sub_cat_id: item.product_sub_category_id,
                    product_description: item.MASTER_ITEM?.description,
                    hsn_sac_code: item.hsn_code,
                    proposed_quantity: item?.proposed_quantity,
                    delivered_qty: item?.delivered_qty,
                    tempQuantity: item?.quantity,
                    uom_name: item.MASTER_ITEM?.MASTER_UOM?.uom_name,
                    maximum_discount: item?.maximum_discount,
                    discount_request: item?.discount_request,
                    igst: item?.MASTER_ITEM?.igst,
                    sgst: 0,
                    cgst: 0,
                    price_per_unit: item.price_per_unit,
                }))


                return res.status(200).send({
                    code: 200,
                    data: {
                        challanData: {
                            ...irnData.dataValues,
                        }, productData: items
                    },
                    message: "Data fetched successfully!"
                });
            } else {
                return res.status(200).send({
                    code: 200,
                    message: "Data not found!"
                });
            }
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal server error!" });
    }
};


module.exports.generateIRNforSalesInvoice = async (req, res) => {
    try {
        const response = await axios.post("http://EinvSandbox.webtel.in/v1.03/GenIRN2", req.body, {
        });
        const responseData = response.data[0];
        const entity_id = req.params.entity_id;
        if (responseData.Status === "1") {
            const generatedData = await db.salesIrnData.create({
                entity_id: entity_id,
                financial_year_id: req.params.financial_year_id,
                do_id: req.params.do_id,
                invoice_id: req.params.invoice_id,
                GSTIN: responseData.GSTIN,
                DocNo: responseData.DocNo,
                DocType: responseData.DocType,
                DocDate: responseData.DocDate,
                Irn: responseData.Irn,
                AckDate: responseData.AckDate,
                AckNo: responseData.AckNo,
                EwbNo: responseData.EwbNo,
                EwbDt: responseData.EwbDt,
                EwbValidTill: responseData.EwbValidTill,
                SignedQRCode: responseData.SignedQRCode,
                SignedInvoice: responseData.SignedInvoice,
                InfoDtls: responseData.InfoDtls,
                Remarks: responseData.Remarks,
            });
            const updateInvoiceStatus = await db.salesInvoiceData.update(
                { status: 'APPROVED', irn_no: responseData.Irn },
                { where: { id: req.params.invoice_id } }
            );
            if (req.body.ValDtls.CgstVal && req.body.ValDtls.SgstVal) {
                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: 8,
                        debit_amount: req.body.ValDtls.TotInvVal,
                        credit_amount: 0.00,
                        party_type: 'Customer',
                        entry_status: 'Payment',
                        entity_id: entity_id,
                        document_number: req.body.DocDtls.No
                    },
                    {
                        chart_account_id: 49,
                        debit_amount: 0.00,
                        credit_amount: req.body.ValDtls.AssVal,
                        entry_status: 'Payment',
                        entity_id: entity_id,
                        document_number: req.body.DocDtls.No
                    },
                    {
                        chart_account_id: 121,
                        debit_amount: 0.00,
                        credit_amount: req.body.ValDtls.CgstVal,
                        entry_status: 'Payment',
                        entity_id: entity_id,
                        document_number: req.body.DocDtls.No
                    },
                    {
                        chart_account_id: 122,
                        debit_amount: 0.00,
                        credit_amount: req.body.ValDtls.SgstVal,
                        entry_status: 'Payment',
                        entity_id: entity_id,
                        document_number: req.body.DocDtls.No
                    },
                ]);
            }

            if (req.body.ValDtls.IgstVal) {
                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: 8,
                        debit_amount: req.body.ValDtls.TotInvVal,
                        credit_amount: 0.00,
                        party_type: 'Customer',
                        entry_status: 'Payment',
                        entity_id: entity_id,
                        document_number: req.body.DocDtls.No
                    },
                    {
                        chart_account_id: 49,
                        debit_amount: 0.00,
                        credit_amount: req.body.ValDtls.AssVal,
                        entry_status: 'Payment',
                        entity_id: entity_id,
                        document_number: req.body.DocDtls.No
                    },
                    {
                        chart_account_id: 123,
                        debit_amount: 0.00,
                        credit_amount: req.body.ValDtls.IgstVal,
                        entry_status: 'Payment',
                        entity_id: entity_id,
                        document_number: req.body.DocDtls.No
                    },
                ]);
            }

            return res.status(200).json({ code: 200, message: "IRN generated successfully!", irnData: generatedData });
        } else {
            return res.status(201).json({ code: 201, message: "IRN generation failed!", error: responseData.ErrorMessage });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.response?.data || error.message });
    }
};


module.exports.generateEwayByIrn = async (req, res) => {
    try {
        const response = await axios.post("https://ewaysandbox.webtel.in/Sandbox/EWayBill/v1.3/GenEWaybyIRN", req.body, {
            headers: { "Content-Type": "application/json" }
        });
        console.log(req.body, "kkkkkkkkkkkkkkkkkkkkkk")

        console.log("API Response:", JSON.stringify(response.data, null, 2));

        const responseData = response.data[0];
        if (responseData.IsSuccess == "True") {

            const createEwayData = await db.ewayData.create({
                irnNo: req.body.Push_Data_List[0].Irn,
                distance: req.body.Push_Data_List[0].Distance,
                transportMode: req.body.Push_Data_List[0].TransMode == "1" ? "ROAD" :
                    req.body.Push_Data_List[0].TransMode == "2" ? "RAIL" :
                        req.body.Push_Data_List[0].TransMode == "3" ? "AIR" :
                            req.body.Push_Data_List[0].TransMode == "4" ? "SHIP" :
                                req.body.Push_Data_List[0].TransMode,
                transportName: req.body.Push_Data_List[0].Transname,
                transportDate: req.body.Push_Data_List[0].TransdocDt,
                transportBiltyNo: req.body.Push_Data_List[0].Transdocno,
                vehicleNo: req.body.Push_Data_List[0].Vehno,
                vehicleType: req.body.Push_Data_List[0].Vehtype == "O" ? "ODC" : req.body.Push_Data_List[0].Vehtype == "R" ? "REGULAR" : req.body.Push_Data_List[0].Vehtype,
                EwbNo: responseData.EwbNo,
                EwbDt: responseData.EwbDt,
                EwbValidTill: responseData.EwbValidTill,
                invoice_id: req.params.invoiceMode == "DIRECT" ? req.params.do_id : null,
                do_id: req.params.invoiceMode !== "DIRECT" ? req.params.do_id : null,
                financial_year_id: req.params.financial_year_id,
                entity_id: req.params.entity_id
            }
            );
            let updatesalesInvoice;
            if (req.params.invoiceMode !== "DIRECT") {


                updatesalesInvoice = await db.salesInvoiceData.update(
                    {
                        isEwayCreated: 1
                    },
                    {
                        where: {
                            do_id: req.params.do_id,
                            irn_no: req.body.Push_Data_List[0].Irn
                        }
                    }
                );
            } else {
                updatesalesInvoice = await db.salesInvoiceData.update(
                    {
                        isEwayCreated: 1
                    },
                    {
                        where: {
                            id: req.params.do_id,
                            irn_no: req.body.Push_Data_List[0].Irn
                        }
                    }
                );
            }
            if (createEwayData && updatesalesInvoice) {
                return res.status(200).json({ code: 200, message: "E-way bill generated and data submitted successfully!", irnData: createEwayData });

            }
            else {
                return res.status(201).json({ code: 201, message: "E-way bill generation and data submission failed!", error: responseData.ErrorMessage });
            }
        } else {
            return res.status(201).json({ code: 201, message: "E-way bill generation failed!", error: responseData.ErrorMessage });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports.getInvoiceIrnDataByDoId = async (req, res) => {
    try {
        const dataExist = await db.salesIrnData.findOne({
            where: {
                do_id: req.params.do_id
                // DocNo: req.params.do_id
            },
        });

        if (!dataExist) {
            return res.status(404).send({ code: 404, message: "IRN data not found!" });
        }
        return res.status(200).send({ code: 200, message: 'IRN data fetched successfully!', data: dataExist });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getAllEwayData = async (req, res) => {
    try {
        const { entity_id, financial_year_id } = req.params;
        const [dataExist] = await db.sequelize.query(`
            SELECT CIIM.id AS irn_invoice_id, EWD.*, DC.do_no ,DC.customer_name,SI.sales_invoice_no, SI.id AS sales_invoice_id 
            FROM CRM_IRN_EWAY_DATA_MST EWD
            LEFT JOIN CRM_DELIVERY_CHALLAN_MST DC ON EWD.do_id = DC.id
            LEFT JOIN CRM_SALES_INVOICE_MST SI ON EWD.do_id = SI.do_id
            LEFT JOIN CRM_INVOICE_IRN_MST AS CIIM ON EWD.do_id=CIIM.do_id
            WHERE EWD.entity_id = ${entity_id}
            AND EWD.financial_year_id = ${financial_year_id}
            ORDER BY EWD.createdAt DESC
        `);
        // const [dataExist] = await db.sequelize.query(`
        //     SELECT EWD.*, DC.do_no ,DC.customer_name,SI.sales_invoice_no, SI.id AS sales_invoice_id 
        //     FROM CRM_IRN_EWAY_DATA_MST EWD
        //     LEFT JOIN CRM_DELIVERY_CHALLAN_MST DC ON EWD.do_id = DC.id
        //     LEFT JOIN CRM_SALES_INVOICE_MST SI ON EWD.do_id = SI.do_id
        //     WHERE EWD.entity_id = ${entity_id}
        //     AND EWD.financial_year_id = ${financial_year_id}
        //     ORDER BY EWD.createdAt DESC
        // `);

        if (!dataExist.length) {
            return res.status(404).send({ code: 404, message: "E-way data not found!" });
        }
        return res.status(200).send({ code: 200, message: 'E-way data fetched successfully!', data: dataExist });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getAllEwayDataById = async (req, res) => {
    try {
        let dataExist;
        if (
            req.params.invoice_id &&
            req.params.invoice_id !== "undefined" &&
            req.params.invoice_id !== "null"
        ) {
            dataExist = await db.ewayData.findOne({
                where: {
                    id: req.params.eway_id,
                },
            });
        } else {
            dataExist = await db.ewayData.findOne({
                where: {
                    entity_id: req.params.entity_id,
                    financial_year_id: req.params.financial_year_id,
                    id: req.params.eway_id,
                },
            });
        }
        let charges = await db.sales_delivery_challan.findOne({
            where: { id: dataExist.do_id },
            include: [
                {
                    model: await db.salesOrder,
                    include: [
                        {
                            model: db.proposalData,
                            include: [
                                {
                                    model: db.proposalAddtionalCharges,
                                    // include: [
                                    //     {
                                    //         model: db.hsn_sac_master
                                    //     }
                                    // ]
                                }
                            ],
                            as: 'proposalData'
                        }
                    ]
                }
            ]
        })

        if (!dataExist) {
            return res
                .status(404)
                .send({ code: 404, message: "E-way data not found!" });
        }
        let data = {
            ...dataExist.dataValues,
            charges: charges?.SALES_ORDER_MST.proposalData?.CRM_PROPOSAL_ADDTIONAL_LIST_MSTs
        }
        return res
            .status(200)
            .send({
                code: 200,
                message: "E-way data fetched successfully!",
                data: data,
            });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.downloadEway = async (req, res) => {
    try {
        const { entity_id, financial_year_id, do_id, urlData } = req.query;
        let pdfEwayResult = await sendEway(entity_id, do_id, financial_year_id, urlData);
        if (pdfEwayResult.length > 0) {
            return res.status(200).send({ code: 200, message: 'Success!', data: urlData, pdfEwayResult });
        } else {
            return res.status(404).send({ code: 404, message: 'Data not found!' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.getDeliveryChallanById = async (req, res) => {
    try {
        const do_id = req.params.do_id;
        const getData = await db.sales_delivery_challan.findOne({
            where: { id: do_id },
        });
        if (!getData) {
            return res
                .status(404)
                .send({ code: 404, message: "Delivery challan details not found!" });
        }

        const [productData] = await db.sequelize.query(`
            SELECT 
       MAX(PL.id) AS id,
SOL.product_master_id , 
MAX(I.item_name) AS item_name,
MAX(I.description) AS product_description,
            MAX(HSN.hsn_sac_code) AS hsn_code,
MAX(U.uom_name) AS uom_name,
MAX(SO.sales_order_no) AS sales_order_no,
MAX(SOL.quantity) AS quantity,
MAX(PL.qty) AS total_proposal_qty,
MAX(PL.dbp) AS avg_dbp,
MAX(PL.price_per_unit) AS price_per_unit,
MAX(PL.calculated_price) AS total_calc_price,
MAX(PL.totalPrice) AS total_price,
MAX(PL.totalWithGst) AS total_with_gst,
MAX(PL.igst) AS igst,
MAX(PL.cgst) AS cgst,
MAX(PL.sgst) AS sgst,
MAX(PL.gst_type) AS gst_type,
MAX(PL.product_category_id) AS product_category_id,
MAX(PL.pro_sub_cat_id) AS product_sub_category_id,
MAX(A.asset_category_name) AS category_name,
MAX(SUB.sub_category_name) AS sub_category_name
FROM SALES_ORDER_MST AS SO 
INNER JOIN SALES_ORDER_ITEM_LIST AS SOL ON SO.id = SOL.sales_order_id
INNER JOIN CRM_PROPOSAL_LIST_MST AS PL ON SO.proposal_id = PL.proposal_id AND SOL.product_master_id = PL.product_master_id
INNER JOIN MASTER_ITEM AS I ON SOL.product_master_id = I.id
INNER JOIN MASTER_UOM AS U ON I.uom_id = U.uom_id
INNER JOIN MASTER_HSN_SAC_CODE AS HSN ON I.hsn_code_id = HSN.id 
INNER JOIN MASTER_ASSET AS A ON PL.product_category_id = A.id
INNER JOIN MASTER_SUB_CATEGORY AS SUB ON PL.pro_sub_cat_id  = SUB.id
WHERE SO.id = ${getData.so_id}
GROUP BY SOL.product_master_id;
           `);



        const [Quantity] = await db.sequelize.query(`SELECT 
       CI.product_master_id, CI.sales_delivery_challan_id, CI.quantity AS tempQuantity FROM CRM_DELIVERY_CHALLAN_MST AS CM INNER JOIN CRM_DELIVERY_CHALLAN_ITEM_MST AS CI ON CI.sales_delivery_challan_id = CM.id`
        )

        productData.forEach(product => {
            Quantity.forEach(item => {
                if (product.product_master_id == item.product_master_id) {
                    product.tempQuantity = item.tempQuantity
                }
            });
        });




        const enrichedProductList = await getCustomisationBrandingData(getData.so_id, productData, 'A');


        return res.status(200).send({
            code: 200,
            data: {
                challanData: {
                    ...getData.dataValues,
                },
                productData: enrichedProductList,
            },
            message: "Data fetched successfully!",
        });
    } catch (error) {
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Internal server error!" });
    }
};


module.exports.generateEwayWithoutIrn = async (req, res) => {

    try {
        const response = await axios.post(
            "http://ewaysandbox.webtel.in/Sandbox/EWayBill/v1.3/GenEWB",
            req.body,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        console.log(req.body, "kkkkkkkkkkkkkkkkkkkkkk");

        const responseData = JSON.parse(response.data);

        console.log("responseDataresponseData", responseData);
        const isSucccess = responseData[0]?.IsSuccess;

        console.log("isSucccessisSucccess", isSucccess);
        if (isSucccess == true || isSucccess == "true") {
            let isSameState = false;
            let totalAssVal;
            let totalIgstVal;
            let totalCgstVal;
            let totalSgstVal;
            let totalInvoiceValue;
            if (req.body.Push_Data_List[0].SupState === req.body.Push_Data_List[0].RecState) {
                isSameState = true;
            } else {
                isSameState = false;
            }

            if (isSameState) {
                totalAssVal = await req.body.Push_Data_List.reduce((sum, item) => {
                    return sum + (Number(item.TaxableValue) || 0);
                }, 0);

                totalIgstVal = isSameState
                    ? 0
                    : req.body.Push_Data_List.reduce((sum, item) => sum + (Number(item.IGSTValue) || 0), 0);

                totalCgstVal = isSameState
                    ? req.body.Push_Data_List.reduce((sum, item) => sum + (Number(item.CGSTValue) || 0), 0)
                    : 0;

                totalSgstVal = isSameState
                    ? req.body.Push_Data_List.reduce((sum, item) => sum + (Number(item.SGSTValue) || 0), 0)
                    : 0;

                totalInvoiceValue = totalAssVal + totalIgstVal + totalCgstVal + totalSgstVal;
            }

            const createEwayData = await db.ewayData.create({
                distance: req.body.Push_Data_List[0].TransDistance,
                transportMode:
                    req.body.Push_Data_List[0].TransMode == "1"
                        ? "ROAD"
                        : req.body.Push_Data_List[0].TransMode == "2"
                            ? "RAIL"
                            : req.body.Push_Data_List[0].TransMode == "3"
                                ? "AIR"
                                : req.body.Push_Data_List[0].TransMode == "4"
                                    ? "SHIP"
                                    : req.body.Push_Data_List[0].TransMode,
                transportName: req.body.Push_Data_List[0].TransporterName,
                transportDate: req.body.Push_Data_List[0].TransDocDate,
                transportBiltyNo: req.body.Push_Data_List[0].TransDocNo,
                vehicleNo: req.body.Push_Data_List[0].VehicleNo,
                vehicleType:
                    req.body.Push_Data_List[0].VehicleType == "O"
                        ? "ODC"
                        : req.body.Push_Data_List[0].VehicleType == "R"
                            ? "REGULAR"
                            : req.body.Push_Data_List[0].VehicleType,
                EwbNo: responseData[0].EWayBill,
                EwbDt: responseData[0].Date,
                EwbValidTill: responseData[0].ValidUpTo,
                dispatch_from_gstin: req.body.Push_Data_List[0].dispatchFromGSTIN,
                ship_to_gstin: req.body.Push_Data_List[0].ShipToGSTIN,
                ship_to_state_id: req.body.Push_Data_List[0].ShipToStateCode,
                ship_from_state_id: req.body.Push_Data_List[0].ShipFromStateCode,
                dispatch_from_trade_name:
                    req.body.Push_Data_List[0].dispatchFromTradeName,
                dispatch_to_trade_name: req.body.Push_Data_List[0].ShipToTradeName,
                rec_address: req.body.Push_Data_List[0].RecAdd1,
                rec_pincode: req.body.Push_Data_List[0].Recpincode,
                sup_address: req.body.Push_Data_List[0].SupAdd1,
                sup_pincode: req.body.Push_Data_List[0].SupPincode,
                do_id: req.params.do_id,
                SgstVal: totalSgstVal,
                CgstVal: totalCgstVal,
                IgstVal: totalIgstVal,
                AssVal: totalAssVal,
                CesVal: req.body.Push_Data_List[0].CessValue,
                OthChrg: req.body.Push_Data_List[0].OtherValue,
                TotInvVal: totalInvoiceValue,
                // invoice_id: req.params.invoice_id,
                financial_year_id: req.params.financial_year_id,
                entity_id: req.params.entity_id,
                customer_id: req.params.customer_id,
            });

            await req.body.Push_Data_List.forEach(async (item) => {
                await db.ewayDatalIST.create({
                    PrdDesc: item.ProductDesc,
                    HsnCd: item.HSNCode,
                    Qty: item.Quantity,
                    PreTaxVal: item.TaxableValue,
                    GstRt: item.GstRt,
                    eway_id: createEwayData.id,
                });
            });

            const updatesalesInvoice = await db.salesInvoiceData.update(
                {
                    isEwayCreated: 1,
                },
                {
                    where: {
                        do_id: req.params.do_id,
                    },
                }
            );

            const updatechallan = await db.sales_delivery_challan.update(
                {
                    eway_type: "DIRECT",
                },
                {
                    where: {
                        id: req.params.do_id,
                    },
                }
            );

            if (createEwayData && updatesalesInvoice && updatechallan) {
                return res
                    .status(200)
                    .json({
                        code: 200,
                        message: "E-way bill generated and data submitted successfully!",
                        ewayData: createEwayData,
                    });
            } else {
                return res
                    .status(400)
                    .json({
                        code: 400,
                        message:
                            responseData[0]?.ErrorMessage ||
                            "E-way bill generation and data submission failed!",
                    });
            }
        } else {
            return res
                .status(400)
                .json({
                    code: 400,
                    message:
                        responseData[0]?.ErrorMessage || "E-way bill generation failed!",
                });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

module.exports.getEwayListDetails = async (req, res) => {
    try {
        const [ewayData] = await db.sequelize.query(`
          SELECT 
              EWD.*, 
              MS.states_name AS seller_states_name, 
              MST.states_name AS buyer_states_name
          FROM CRM_IRN_EWAY_DATA_MST AS EWD
          LEFT JOIN MASTER_STATE AS MS ON MS.states_id = EWD.ship_from_state_id
          LEFT JOIN MASTER_STATE AS MST ON MST.states_id = EWD.ship_to_state_id
          WHERE 
              EWD.id = ${req.params.eway_id} AND 
              EWD.entity_id = ${req.params.entity_id} AND 
              EWD.financial_year_id = ${req.params.financial_year_id}
      `);

        if (!ewayData || ewayData.length === 0) {
            return res.status(404).send({ code: 404, message: "E-way data not found!" });
        }

        const [productData] = await db.sequelize.query(`
          SELECT *
          FROM CRM_EWAY_DATA_LIST_MST
          WHERE eway_id = ${req.params.eway_id}
      `);

        return res.status(200).send({
            code: 200,
            message: "E-way data fetched successfully!",
            data: {
                ...ewayData[0],
                productData,
            },
        });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getInvoiceIrnDataByInvoiceId = async (req, res) => {
    try {
        const dataExist = await db.salesIrnData.findOne({
            where: {
                id: req.params.invoice_id,
            },
        });

        if (!dataExist) {
            return res
                .status(404)
                .send({ code: 404, message: "IRN data not found!" });
        }
        return res
            .status(200)
            .send({
                code: 200,
                message: "IRN data fetched successfully!",
                data: dataExist,
            });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};




//////////////////////////////////
///////////////////// here code for set sub item 
/////////////////////////////
async function getCustomisationBrandingData(proposal_id, products, str) {
    // Run the combined query once
    const [customisation] = await db.sequelize.query(`
      SELECT
        SOI.id AS so_item_id,
        CP.id AS proposal_item_id,
        'Customisation' AS item_type,
        ACC.accessories_name AS item_name,
        AHSN.hsn_sac_code AS hsn_code,
        AGRM.value AS gst_rate,
        ACC.accessories_price AS price_per_unit,
        SOI.quantity AS quantity,
         PCD.totalDiscountAmountPerQTY
      FROM CRM_PROPOSAL_LIST_MST CP
      JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE CT ON CP.id = CT.proposal_item_id
      JOIN CRM_PROPOSAL_CUSTOMISATION_DATA PCD ON PCD.proposal_customisation_id = CT.id
      JOIN MASTER_ACCESSORIES_NAME ACC ON ACC.id = PCD.accessory_in_name
      JOIN MASTER_HSN_SAC_CODE AHSN ON AHSN.id = ACC.hsn_code_id
      JOIN GST_RATE_MASTER AGRM ON AGRM.id = AHSN.gst_rate_id
      JOIN SALES_ORDER_ITEM_LIST SOI ON SOI.customization_type_id = CT.id
      WHERE SOI.sales_order_id = ${proposal_id}
      AND ACC.accessories_name IS NOT NULL
  
      UNION ALL
  
      SELECT
        SOI2.id AS so_item_id,
        CP.id AS proposal_item_id,
        'Branding' AS item_type,
        MBR.type_of_branding AS item_name,
        BHSN.hsn_sac_code AS hsn_code,
        MGRN.value AS gst_rate,
        MBR.price_per_unit AS price_per_unit,
        SOI2.quantity AS quantity,
         CRB.totalDiscountAmountPerQTY
      FROM CRM_PROPOSAL_LIST_MST CP
      JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE CT ON CP.id = CT.proposal_item_id
      JOIN CRM_PROPOSAL_BRANDING CRB ON CRB.proposal_customisation_id = CT.id
      JOIN MASTER_BRANDING MBR ON MBR.id = CRB.branding_mst_id
      JOIN MASTER_HSN_SAC_CODE BHSN ON BHSN.id = MBR.hsn_code_id
      JOIN GST_RATE_MASTER MGRN ON MGRN.id = BHSN.gst_rate_id
      JOIN SALES_ORDER_ITEM_LIST SOI2 ON SOI2.branding_data_id = CRB.id
      WHERE SOI2.sales_order_id = ${proposal_id}
      AND MBR.type_of_branding IS NOT NULL
  
      UNION ALL
  
      SELECT
        SOI.id AS so_item_id,
        CP.id AS proposal_item_id,
        'Basket' AS item_type,
        MB.type_of_basket AS item_name,
        MHSN.hsn_sac_code AS hsn_code,
        GRMM.value AS gst_rate,
        MB.price_per_unit AS price_per_unit,
        CT.qty AS  quantity,
         PCD.totalDiscountAmountPerQTY
      FROM CRM_PROPOSAL_LIST_MST CP
      JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE CT ON CP.id = CT.proposal_item_id
      JOIN CRM_PROPOSAL_CUSTOMISATION_DATA PCD ON PCD.proposal_customisation_id = CT.id
      JOIN MASTER_BASKET MB ON MB.id = PCD.basket_mst_id
      JOIN MASTER_HSN_SAC_CODE MHSN ON MHSN.id = MB.hsn_code_id
      JOIN GST_RATE_MASTER GRMM ON GRMM.id = MHSN.gst_rate_id
      JOIN SALES_ORDER_ITEM_LIST SOI ON SOI.customization_type_id = CT.id
      WHERE SOI.sales_order_id = ${proposal_id}
      AND MB.type_of_basket IS NOT NULL;
    `);

    // Group the customisation data by proposal_item_id
    const grouped = {};
    for (const item of customisation || []) {
        const key = item.proposal_item_id;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    }

    // Map the grouped customisation data to products
    const enrichedProducts = (products || []).map(product => {
        const relatedItems = grouped[str === 'A' ? product.id : product.proposal_item_id] || [];

        const customisation_data = relatedItems.filter(c => c.item_type === 'Customisation' || c.item_type === 'Basket');
        const branding_data = relatedItems.filter(c => c.item_type === 'Branding');
        //   const basket_data = relatedItems.filter(c => c.item_type === 'Basket');

        return {
            ...product,
            customisation_data,
            branding_data,
            // basket_data
        };
    });

    return enrichedProducts;
}
module.exports.cancelIRNforSalesInvoice = async (req, res) => {
    try {
        let data = {
            CDKey: req.body?.CDKey,
            EInvUserName: req.body?.EInvUserName,
            EInvPassword: req.body?.EInvPassword,
            EFUserName: req.body?.EFUserName,
            EFPassword: req.body?.EFPassword,
            GSTIN: req.body?.GSTIN,
            CnlRsn: "1",
            CnlRem: "Wrong Entry",
            Irn: req.body?.CDKey,
        };

        let data1 = {
            Push_Data_List: {
                Data: [
                    {
                        CDKey: req.body?.CDKey,
                        EInvUserName: req.body?.EInvUserName,
                        EInvPassword: req.body?.EInvPassword,
                        EFUserName: req.body?.EFUserName,
                        EFPassword: req.body?.EFPassword,
                        GSTIN: req.body?.GSTIN,
                        CnlRsn: "1",
                        CnlRem: "Wrong Entry",
                        Irn: req.body?.Irn,
                    },
                ],
            },
        };

        const response = await axios.post(
            "http://einvsandbox.webtel.in/v1.03/CanIRN",
            data1,
            {}
        );
        const responseData = response.data[0];
        const entity_id = req.params.entity_id;
        if (responseData.Status === "1") {
            // const generatedData = await db.salesIrnData.create({
            //     entity_id: entity_id,
            //     financial_year_id: req.params.financial_year_id,
            //     do_id: req.params.do_id,
            //     GSTIN: responseData.GSTIN,
            //     DocNo: responseData.DocNo,
            //     DocType: responseData.DocType,
            //     DocDate: responseData.DocDate,
            //     Irn: responseData.Irn,
            //     AckDate: responseData.AckDate,
            //     AckNo: responseData.AckNo,
            //     EwbNo: responseData.EwbNo,
            //     EwbDt: responseData.EwbDt,
            //     EwbValidTill: responseData.EwbValidTill,
            //     SignedQRCode: responseData.SignedQRCode,
            //     SignedInvoice: responseData.SignedInvoice,
            //     InfoDtls: responseData.InfoDtls,
            //     Remarks: responseData.Remarks,
            // });
            const updateInvoiceStatus = await db.salesInvoiceData.update(
                { status: "CANCELLED", irn_cancel_date: responseData?.CancelDate },
                { where: { id: req.params.invoice_id } }
            );

            const updateIrnStatus = await db.salesIrnData.update(
                { status: "INACTIVE" },
                { where: { invoice_id: req.params.invoice_id } }
            );

            if (req.body.ValDtls.CgstVal && req.body.ValDtls.SgstVal) {
                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: 8,
                        debit_amount: 0.0,
                        credit_amount: req.body.ValDtls.TotInvVal,
                        party_type: "Customer",
                        entry_status: "Cancel Payment",
                        entity_id: entity_id,
                        document_number: req.body?.doc_no?.do_no,
                    },
                    {
                        chart_account_id: 49,
                        debit_amount: req.body.ValDtls.AssVal,
                        credit_amount: 0.0,
                        entry_status: "Cancel Payment",
                        entity_id: entity_id,
                        document_number: req.body?.doc_no?.do_no,
                    },
                    {
                        chart_account_id: 121,
                        debit_amount: req.body.ValDtls.CgstVal,
                        credit_amount: 0.0,
                        entry_status: "Cancel Payment",
                        entity_id: entity_id,
                        document_number: req.body?.doc_no?.do_no,
                    },
                    {
                        chart_account_id: 122,
                        debit_amount: req.body.ValDtls.SgstVal,
                        credit_amount: 0.0,
                        entry_status: "Cancel Payment",
                        entity_id: entity_id,
                        document_number: req.body?.doc_no?.do_no,
                    },
                ]);
            }

            if (req.body.ValDtls.IgstVal) {
                await db.financial_And_Account_Journal_List.bulkCreate([
                    {
                        chart_account_id: 8,
                        debit_amount: 0.0,
                        credit_amount: req.body.ValDtls.TotInvVal,
                        party_type: "Customer",
                        entry_status: "Cancel Payment",
                        entity_id: entity_id,
                        document_number: req.body?.doc_no?.do_no,
                    },
                    {
                        chart_account_id: 49,
                        debit_amount: req.body.ValDtls.AssVal,
                        credit_amount: 0.0,
                        entry_status: "Cancel Payment",
                        entity_id: entity_id,
                        document_number: req.body?.doc_no?.do_no,
                    },
                    {
                        chart_account_id: 123,
                        debit_amount: req.body.ValDtls.IgstVal,
                        credit_amount: 0.0,
                        entry_status: "Cancel Payment",
                        entity_id: entity_id,
                        document_number: req.body?.doc_no?.do_no,
                    },
                ]);
            }

            return res
                .status(200)
                .json({ code: 200, message: "IRN cancelled successfully!" });
        } else {
            return res
                .status(201)
                .json({
                    code: 201,
                    message: "IRN cancellation failed!",
                    error: responseData.ErrorMessage,
                });
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Internal Server Error",
                error: error.response?.data || error.message,
            });
    }
};

module.exports.getSalesOrderInvoice = async (req, res) => {
    try {
        const { id ,finance_id} = req.query;
        const dataExist = await db.salesOrder.findOne({ where: { id } });

        if (!dataExist) {
            return res.status(404).send({ code: 404, message: "No Data found for this SO Id" });
        }
    
        const [result] = await db.sequelize.query(
            `SELECT P.warehouse_id,W.name,W.code,W.address,SO.*, CONCAT('INV-',SO.sales_order_no) AS invoiceNo, 
            CONCAT(CP.company_name, ' - ', CP.customer_code) AS cname, CA.contact_person_name, CA.mobile, PI.pi_number, 
            CONCAT(CSA.shipping_address, ', ', CSA.shipping_postal_address, ', ', CSA.shipping_pin_code) AS shippingAddress
            FROM SALES_ORDER_MST AS SO 
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS P ON SO.proposal_id = P.id
            INNER JOIN WAREHOUSE_MASTER AS W ON P.warehouse_id = W.id
            INNER JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = SO.customer_id
            LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CA ON CA.id = SO.customer_contact_id
            LEFT JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CSA ON CSA.id = SO.shipping_address_id
            LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PI ON PI.proposal_id = SO.proposal_id AND PI.version_id = SO.version_id
            WHERE SO.id = ${id} `);

        const [allResult] = await db.sequelize.query(`
           WITH DeliveredQuantities AS (
                SELECT 
                    C.*, 
                    P.item_name AS product_name, 
                    P.id AS item_id,
                    P.item_code AS product_code,                  
                    P.description AS product_description, 
                    T.uom_name,
                    AGRM.value AS gst_rate,
                    CA.sales_order_date,
                    CA.expected_delivery_date,
                    CA.sales_order_no,
                    CA.elan_sales_order_no,
                    CA.elan_so_date,
                    PR.proposal_no,
                    PR.id AS proposal_id,
                    CA.id AS do_id, 
                   -- (PL.qty) AS proposed_quantity,
                     PL.price_per_unit AS rate,
                   -- PL.totalPrice,
                    C.quantity AS so_quantity,
                    IMG.image 
                  --  SUM(C.quantity) OVER (PARTITION BY C.product_master_id ORDER BY CA.id, CA.sales_order_no ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total_delivered_quantity
                FROM SALES_ORDER_MST AS CA
                INNER JOIN SALES_ORDER_ITEM_LIST AS C ON C.sales_order_id = CA.id
                INNER JOIN MASTER_ITEM AS P ON P.id = C.product_master_id
                INNER JOIN MASTER_HSN_SAC_CODE AHSN ON AHSN.id = P.hsn_code_id
                INNER JOIN GST_RATE_MASTER AGRM ON AGRM.id = AHSN.gst_rate_id
                LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT	AS IMG ON P.id=IMG.item_id
                LEFT JOIN MASTER_UOM AS T ON P.uom_id = T.uom_id
                LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE AS CPC ON CPC.id = C.customization_type_id
                LEFT JOIN CRM_PROPOSAL_BRANDING AS CPB ON CPB.id = C.branding_data_id
                LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE AS CPCB ON CPCB.id = CPB.proposal_customisation_id
                LEFT JOIN CRM_PROPOSAL_LIST_MST AS PL ON PL.proposal_id = CA.proposal_id AND PL.product_master_id = P.id
                  INNER JOIN CRM_VERSION_PROPOSAL_MST AS V ON  PL.version_id = V.id
                INNER JOIN CRM_CREATE_PROPOSAL_MST AS PR ON PL.proposal_id = PR.id
                WHERE CA.id=${id} AND V.is_so_created=1
            )
            SELECT 
                gst_rate,
                image,
                product_name, 
                product_code, 
                address,
                product_description,
                uom_name,
                sales_order_date,
                expected_delivery_date,
                sales_order_no,
                elan_sales_order_no,
                elan_so_date,
                proposal_no,
                do_id,  
                rate,(rate * so_quantity) AS totalPrice,
              --  proposed_quantity,
                so_quantity,
              --  total_delivered_quantity,
                select_scheme
              --  (proposed_quantity - total_delivered_quantity) AS remaining_quantity
            FROM DeliveredQuantities
          --  GROUP BY sales_order_no
            ORDER BY do_id DESC 
        `);
        let itemId = Array.from(
            new Set(
                allResult
                    .filter(x => x.proposal_item_id)
                    .map(x => x.proposal_item_id)
            )
        );
        // let itemIdList = itemId.join(',');
        // let [cashDiscountList] = await db.sequelize.query(`
        //     SELECT  DM.discount_name, SUM(DB.perQtyAmount) AS discount_amount FROM CRM_PROPOSAL_GROSS_DISCOUNT_BREAKUP AS DB 
        //     INNER JOIN CRM_PROPOSAL_GROSS_DISCOUNT_MST AS DM 
        //     ON DB.gross_discount_id = DM.id
        //     WHERE DB.proposal_id = ${result[0].proposal_id} AND DB.version_id=${result[0].version_id} AND DB.proposal_list_id IN (${itemIdList})
        //     GROUP BY DB.gross_discount_id
        //     `)
        const enrichedProductList = await getCustomisationBrandingData(id, allResult, 'B');

        const obj = {
            ...result[0],
            productDetailList: enrichedProductList,
            // charges: [],
            // cashDiscountList
        };
        // const obj = {
        //     ...result[0],
        // };
       
         
        if(dataExist?.invoice_status == 'PENDING'){
            const total_amount = enrichedProductList.reduce(
                (total, row) => total + parseFloat(row.totalPrice || 0),
                0
              );
              const gst_amount = enrichedProductList.reduce(
                (sum, i) => sum + ((Number(i.totalPrice || 0) * Number(i.gst_rate || 0)) / 100),
                0
              );
              const customerExist = await db.customerAddress.findOne({where:{customer_id:dataExist?.customer_id},attributes:['customer_id','billing_state_id']})
              if(!customerExist){
                return res.status(404).send({code:404,message:'Customer billing State is not mapped'})
              }
              const entityExist =  await db.entityMaster.findOne({where:{id:dataExist.entity_id}})
              if(!entityExist){
                return res.status(404).send({code:404,message:'In Entity Master State is not mapped'})
              }
             
          
            await db.financial_And_Account_Journal_List.create({
                debit_amount: total_amount+gst_amount,
                credit_amount: 0.00,
                entry_status: 'Sales Invoice',
                document_number: dataExist?.invoice_no,
                chart_account_id: 168,
                party_type:'CUSTOMER',
                customer_id:dataExist?.customer_id,
                entity_id:dataExist?.entity_id,
                financial_id:finance_id,
              });

              await db.financial_And_Account_Journal_List.create({
                debit_amount: 0.00,
                credit_amount:total_amount,
                entry_status: 'Sales Invoice',
                document_number: dataExist?.invoice_no,
                chart_account_id: 203,
                entity_id:dataExist?.entity_id,
                financial_id:finance_id,
              });

              if (gst_amount > 0) {

                if (entityExist?.state_id == customerExist?.billing_state_id) {
          
                  const divideGST = gst_amount / 2;
                  await db.financial_And_Account_Journal_List.create({
                    debit_amount: 0.00,
                    credit_amount: divideGST,
                    chart_account_id: 43,
                    entity_id:dataExist?.entity_id,
                    entry_status: 'Sales Invoice',
                    document_number:dataExist?.invoice_no,
                    financial_id:finance_id,
                  });
          
                  await db.financial_And_Account_Journal_List.create({
                    debit_amount: 0.00,
                    credit_amount: divideGST,
                    chart_account_id: 23,
                    entity_id:dataExist?.entity_id,
                    entry_status: 'Sales Invoice',
                    document_number:dataExist?.invoice_no,
                    financial_id:finance_id,
                  });
          
                } else {
                  await db.financial_And_Account_Journal_List.create({
                    debit_amount: 0.00,
                    credit_amount: gst_amount,
                    chart_account_id: 31,
                    entity_id:dataExist?.entity_id,
                    entry_status: 'Sales Invoice',
                    document_number:dataExist?.invoice_no,
                    financial_id:finance_id,
                  });
          
                }
          
              }
              await db.salesOrder.update({invoice_status:'APPROVED'},{where:{id}})
        }

        return res.status(200).send({ code: 200, message: 'success', data: obj });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};