const db = require("../../../models/index");
const { Op } = require("sequelize");
const moment = require('moment');

module.exports.getSODetailsByDocType = async (req, res) => {
    try {

        const { id, sales_order_id, type } = req.query;
        let data;
        let responseData;
        if (type !== 'INVOICE_CANCEL' && type !== 'RETURN') {

            data = await db.salesOrder.findOne({
                where: { id },
                include: [
                    {
                        model: db.versionData,
                        include: [
                            {
                                model: db.currency_convert
                            },
                            {
                                model: db.customerAddress
                            }
                        ]
                    },
                    {
                        model: db.proposalData,
                        as: 'proposalData'
                    },
                    {
                        model: db.salesOrderItemNew,
                    },
                    {
                        model: db.warehouse,
                        as: 'warehouseData'
                    },
                    {
                        model: db.customerProfile,

                    },
                    {
                        model: db.customerShippingAddress,
                        as: 'shippingAddress'

                    }

                ]
            })
        } else if (type == 'RETURN' && type !== 'INVOICE_CANCEL') {
            data = await db.salesOrder.findOne({
                where: { id },
                include: [
                    {
                        model: db.salesOrderItemNew,
                        include: [
                            {
                                model: db.stockTransferSerialnew,
                                include: [
                                    {
                                        model: db.grnItemStatus
                                    }
                                ]
                            }
                        ]

                    },
                    {
                        model: db.warehouse,
                        as: 'warehouseData'
                    },
                    {
                        model: db.customerProfile,

                    },
                    {
                        model: db.versionData,
                        include: [
                            {
                                model: db.currency_convert
                            }
                        ]
                    },

                ]
            })
            responseData = data.toJSON();

            responseData.SALES_ORDER_ITEM_LIST_NEWs = responseData.SALES_ORDER_ITEM_LIST_NEWs
                .map(item => ({
                    ...item,
                    qty: Number(item.qty || 0) - Number(item.goods_return_qty || 0)
                }))
                .filter(item => item.qty > 0);

        } else {
            data = await db.salesInvoiceData.findOne({
                where: { id },
                include: [
                    {
                        model: db.salesInvoiceItem,
                        as: 'items'
                    },
                    {
                        model: db.salesOrder,
                        as: 'sales_order',
                        include: [
                            {
                                model: db.warehouse,
                                as: 'warehouseData'
                            },
                            {
                                model: db.versionData,
                                include: [
                                    {
                                        model: db.currency_convert
                                    }
                                ]
                            },
                        ]
                    },

                    {
                        model: db.customerProfile,
                        as: 'customer'
                    }
                ]
            })

        }
        const chargeRuleMst = await db.salesReturnChargesMst.findAll();

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "Data not found!"
            });
        }
        const sb = await db.salesBooking.findOne({ where: { version_id: data?.version_id ?? data?.sales_order?.version_id, proposal_id: data?.proposal_id ?? data?.sales_order?.proposal_id } });
        const advancePayment = await db.salesBookingAdvanceAmt.findAll({ where: { sales_booking_id: sb.id } });
        const custumerAdvanceExist = await db.customerProfile.findOne({ where: { id: sb?.customer_id } })

        const [utilizedExist] = await db.sequelize.query(`
            SELECT C.so_id,COALESCE(SUM(C.utilize_advance_amount), 0) AS utilize_advance_amount
             FROM CRM_SALES_INVOICE_MST AS C 
             INNER JOIN SALES_ORDER_MST AS S ON S.id=C.so_id
             WHERE S.proposal_id = ${data?.proposal_id ?? data?.sales_order?.proposal_id}  AND S.version_id = ${data?.version_id??  data?.sales_order?.version_id} AND C.customer_id = ${sb?.customer_id} AND C.invoice_status = 'APPROVED'
              GROUP BY C.so_id`)

        const advanceAmount = parseFloat(custumerAdvanceExist?.advance_amount || 0);
        const utilizedAmount = parseFloat(utilizedExist[0]?.utilize_advance_amount || 0);
        const remainingAmount = advanceAmount - utilizedAmount;
        let proposalDiscount = await db.discountDetails.findAll({ where: { version_id: data?.version_id ?? data?.sales_order?.version_id, proposal_id: data?.proposal_id ?? data?.sales_order?.proposal_id } });
        const totalDiscountAmount = proposalDiscount.reduce(
            (sum, item) => sum + Number(item.discount_amount || 0),
            0
        );

        const soData = await db.salesOrder.findAll({ attributes: ['id'], where: { version_id: data?.version_id ?? data?.sales_order?.version_id, proposal_id: data?.proposal_id ?? data?.sales_order?.proposal_id } });
        const soIds = soData.map(item => item.id);
        const existingInvoiceData = await db.salesInvoiceData.findAll({
            where: {
                so_id: { [Op.in]: soIds },
                invoice_status: {
                    [Op.ne]: 'CANCELLED'
                }
            }
        });
        const existingTotalDiscountAmount = existingInvoiceData.reduce(
            (sum, item) => sum + Number(item.utilize_gross_dic_amt || 0),
            0
        );
        return res.json({
            success: true,
            data: responseData ? responseData : data,
            chargeRuleMst: chargeRuleMst,
            advancePayment: {
                advanceAmt: remainingAmount, advance_adjustment_percentage: advancePayment[0]?.advance_adjustment_percentage, currency_id: advancePayment[0]?.currency_id,
                exchangeRate: advancePayment[0]?.currency_rate
            },
            grossDiscount: totalDiscountAmount,
            existingTotalDiscountAmount: existingTotalDiscountAmount,
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
module.exports.getSODetailsByDocType2 = async (req, res) => {
    try {

        const { id, sales_order_id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "sales_order_id is required"
            });
        }

        await db.sequelize.query(
            `SET SESSION sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '');`
        );

        // =========================
        // SALES ORDER HEADER
        // =========================
        const proposalData = await db.sequelize.query(
            `
      SELECT  SO.sales_order_date,
      SO.sales_order_no,SO.id AS so_id,CV.id AS version_id,
      	  CASE
          WHEN CP.dealer = 1 THEN DP.company_name
          ELSE NULL
          END AS dealer_company_name,

          CASE 
          WHEN CP.dealer = 1 THEN DADD.gst_in 
          ELSE W.gst 
          END AS warehouse_gst,       
                  
          CASE 
          WHEN CP.dealer = 1 THEN DADD.billing_pin_code 
          ELSE W.pin 
          END AS warehouse_pin,
          
          CASE 
          WHEN CP.dealer = 1 THEN DADD.billing_address 
          ELSE W.address 
          END AS warehouse_address,
          
          CASE 
          WHEN CP.dealer = 1 THEN DADD.billing_postal_address 
          ELSE NULL 
          END AS warehouse_postal_address,
            DP.id AS dealer_id,
            CV.is_same_as_shipping,
            PPI.pi_number,CV.version_status,
            LS.lead_source,
            EMP.first_name,
            EMP.middle_name,
            EMP.last_name,
            EMP.contact_number AS sales_number,
            CAC.contact_person_name AS personName,
            CAC.mobile,
            EMP.employee_official_email,
            -- W.pin AS warehouse_pin,W.address AS warehouse_address,W.gst AS warehouse_gst,W.email AS warehouse_email,W.contact_number AS warehouse_contact_no,
            CP.valid_till_date,
            F.freight_name,I.insurance_name,
            PM.payment_name, SP.sub_payment_name,
            CONCAT(B.location_name, ' - ', B.location_code) AS branch_name, W.name AS warehouse_name,DT.delivery_term, UL.unloading, 
            CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
            CPM2.company_name, sb.schedule_delivery_date,
           CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT.countryss_name AS billing_country_name,
            STA.states_name AS billing_state_name, CIT.city_name AS billing_city_name,CAM.gst_in, CP.currency_symbol,
            
            CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT2.countryss_name AS shipping_country_name,
            STA2.states_name AS shipping_state_name, CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code
            FROM CRM_VERSION_PROPOSAL_MST AS CV
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = CV.proposal_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
            LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.id = CV.billing_address_id
            LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
            LEFT JOIN MASTER_SOURCE AS MS ON C.source_id = MS.id
            INNER JOIN SALES_ORDER_MST AS SO ON CP.id=SO.proposal_id
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON CP.id = PA.proposal_id
            LEFT JOIN SALES_BOOKING AS sb ON sb.proposal_id = SO.proposal_id AND sb.version_id = SO.version_id
            LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id =SO.proposal_id AND PPI.version_id = SO.version_id
             INNER  JOIN CUSTOMER_PROFILE_MST AS CPM2 ON CP.customer_id = CPM2.id
              LEFT JOIN LOCATION_MASTER AS B ON CP.location_id = B.id
             LEFT JOIN WAREHOUSE_MASTER AS W ON CP.warehouse_id = W.id
             LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS DT ON CP.delivery_term_id = DT.id
              LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS UL ON CP.unloading_resp_id = UL.id
              LEFT JOIN CRM_PAYMENT_MAIN_MST AS PM ON CP.payment_main_id = PM.id
              LEFT JOIN CRM_SUB_PAYMENT_MAIN_MST AS SP ON CP.sub_payment_main_id = SP.id
              LEFT JOIN CRM_FREIGHT_MST AS F ON CP.freight_id = F.id
              LEFT JOIN CRM_INSURANCE_MST AS I ON CP.insurance_id = I.id
            --  LEFT JOIN HRMS_REGISTERED_USER AS EMP ON CP.created_by_id = EMP.employee_id
              LEFT JOIN CRM_LEAD_SOURCE_MST AS LS ON CP.lead_source_id = LS.id
             LEFT JOIN HRMS_REGISTERED_USER AS EMP  
											    ON (
											        (CP.created_by = 'self' AND CP.employee_id = EMP.employee_id)
											        OR 
											        (CP.created_by <> 'self' AND CP.created_by_id = EMP.employee_id)
											    )
              LEFT JOIN MASTER_COUNTRY AS CUT ON CAM.billing_country_id = CUT.countryss_id
							LEFT JOIN MASTER_STATE AS STA ON CAM.billing_state_id = STA.states_id
							LEFT JOIN MASTER_CITY AS CIT ON CAM.billing_city_id = CIT.city_id
														
						--	LEFT JOIN MASTER_COUNTRY AS CUT2 ON CAM.shipping_country_id = CUT2.countryss_id
						--	LEFT JOIN MASTER_STATE AS STA2 ON CAM.shipping_state_id = STA2.states_id
						--	LEFT JOIN MASTER_CITY AS CIT2 ON CAM.shipping_city_id = CIT2.city_id
              
							INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CAC ON CP.customer_id = CAC.customer_id
              LEFT JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CSA ON CV.shipping_address_id = CSA.id
              
							LEFT JOIN MASTER_COUNTRY AS CUT2 ON CSA.shipping_country_id = CUT2.countryss_id
              LEFT JOIN MASTER_STATE AS STA2 ON CSA.shipping_state_id = STA2.states_id
              LEFT JOIN MASTER_CITY AS CIT2 ON CSA.shipping_city_id = CIT2.city_id

               -- here code for dealer address
														LEFT JOIN CUSTOMER_PROFILE_MST AS DP ON CPM2.dealer_id = DP.id
														LEFT JOIN CUSTOMER_ADDRESS_MST AS DADD ON DP.id=DADD.customer_id
														
              	LEFT JOIN MASTER_COUNTRY AS DC ON DADD.billing_country_id = DC.countryss_id
							LEFT JOIN MASTER_STATE AS DS ON DADD.billing_state_id = DS.states_id
							LEFT JOIN MASTER_CITY AS DCITY ON DADD.billing_city_id = DCITY.city_id
            WHERE SO.id = ${id}
      `
        );

        // =========================
        // SALES ORDER ITEMS (NO DUPLICATION BASE)
        // =========================
        const dataList = await db.sequelize.query(
            `
    SELECT DISTINCT 
    SOI.id AS soi_id,
    SOI.quantity AS so_item_qty,

    CP.dbp,
    CP.totalPrice,
    CP.totalWithGst,
    CP.id AS product_id,
    CP.qty,
    CP.cgst,
    CP.approvel_status,
    CP.igst,
    CP.sgst,
    CP.proposal_id,
    CP.gst_type,
    CP.discount_request,
    CP.discount_approved,

    P.id AS product_master_id,
    P.item_name AS product_name,
    P.item_code AS product_code,
    P.description AS product_description,

    CP.new_item,
    CP.promo_item,
    CP.apply_scheme,
    CP.scheme_id,
    CP.price_per_unit AS price_per_qty,
    CP.maximum_discount,
    CP.product_category_id,

    U.uom_name,
    U.uom_id,

    CP.pro_sub_cat_id,
    CP.select_scheme,

    PCT.id AS proposal_customisation_id,
    PCD.id AS customisation_data_id,
    PCD.customization_type,
    PCD.qty AS custom_qty,

    PCT.qty AS product_qty,
    PCT.order_qty,
    PCT.total_in_gst,
    PCT.grand_in_total,
    PCD.gst,
    PCD.total_price,
    PCD.price_per_unit AS unit_price,

    PCT.grand_out_total,
    PCT.substract_total,
    PCT.add_total,
    PCT.proposal_no,
    PCT.remarks,
    PCT.status,

    PCT.createdAt,
    PCT.updatedAt,
    PCT.proposal_item_id,
    PCT.version_id,

    P.hsn_code_id,
    HSN.hsn_sac_code,

    UM.uom_name,

    CRB.id AS branding_id,
    CRB.qty AS branding_qty,
    CRB.branding_description,
    CRB.branding_sides,
    CRB.branding_amt,
    CRB.proposal_no AS branding_proposal_no,
    CRB.status AS branding_status,
    CRB.createdAt AS branding_createdAt,

    PCD.accessory_in_category,
    PCD.accessory_in_sub_category,
    PCD.accessory_in_name,

    ma.asset_category_name,
    msc.sub_category_name,
    mi.item_name,

    PCD.with_gst AS customisation_with_gst,
    PCD.after_discount AS customisation_after_discount,
    PCD.discount AS customisation_discount,

    PCD.custome_type,
    PCD.basket_mst_id,

    CRB.with_gst AS branding_with_gst,
    CRB.after_discount AS branding_after_discount,
    CRB.discount AS branding_discount,

    ACC.accessories_name,
    ACC.hsn_code_id AS acce_hsn_id,
    AHSN.hsn_sac_code AS acce_hsn_sac_code,
    AGRM.value AS acce_gst_value,

    CRB.branding_mst_id AS brandingTypes,
    MBR.type_of_branding,
    MBR.branding_sides,
    MBR.price_per_unit,
    MBR.hsn_code_id,
    BHSN.hsn_sac_code AS branding_hsn_sac_code,
    BHSN.description,
    MGRN.value,

    MB.type_of_basket,
    MB.basket_qty,
    MB.price_per_unit,
    MHSN.hsn_sac_code AS basket_hsn_code,
    GRMM.value AS basket_gst_value,

    CP.discount1,
    CP.discount2,
    CP.discount3,
    CP.discount1Mode,
    CP.discount2Mode,
    CP.discount3Mode,
    CP.discount1Flat,
    CP.discount2Flat,
    CP.discount3Flat,
    CP.flatPercentage1,
    CP.flatPercentage2,
    CP.flatPercentage3,

    MID.image AS item_img_path,

    CP.totalDiscountAmount,
    CRB.totalDiscountAmount AS totalDiscountAmountB,
    PCD.totalDiscountAmount AS totalDiscountAmountC,

    CP.totalDiscountAmountPerQTY,
    CRB.totalDiscountAmountPerQTY AS totalDiscountAmountPerQTYB,
    PCD.totalDiscountAmountPerQTY AS totalDiscountAmountPerQTYC,

    CP.warranty,

    CRB.gst AS branding_gst,
    CRB.updatedAt AS branding_updatedAt,
    CRB.proposal_item_id AS branding_proposal_item_id,
    CRB.version_id AS branding_version_id,

    ACCUOM.uom_name AS accuom_name,
    BRAUOM.uom_name AS brauom_name,
    BASUOM.uom_name AS basuom_name

FROM CRM_CREATE_PROPOSAL_MST AS C

LEFT JOIN CRM_CREATE_LEAD_MST AS CL 
    ON CL.id = C.create_lead_id

INNER JOIN CRM_PROPOSAL_LIST_MST AS CP 
    ON CP.proposal_id = C.id

LEFT JOIN MASTER_ITEM AS P 
    ON CP.product_master_id = P.id 

LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT AS MID 
    ON MID.item_id = P.id 

LEFT JOIN MASTER_UOM AS U 
    ON U.uom_id = CP.uom_id

LEFT JOIN MASTER_UOM AS UM 
    ON UM.uom_id = P.uom_id

LEFT JOIN CRM_VERSION_PROPOSAL_MST AS CV 
    ON CV.id = CP.version_id

/* ✅ FIXED: SOI-based join */
INNER JOIN SALES_ORDER_MST AS SO 
    ON C.id = SO.proposal_id 
   AND CV.id = SO.version_id

INNER JOIN SALES_ORDER_ITEM_LIST AS SOI 
    ON SO.id = SOI.sales_order_id
   AND SOI.product_master_id = CP.product_master_id

/* ✅ FIXED: SOI-level mapping (IMPORTANT) */
LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE AS PCT 
    ON PCT.id = SOI.customization_type_id

LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_DATA AS PCD 
    ON PCD.proposal_customisation_id = PCT.id

LEFT JOIN CRM_PROPOSAL_BRANDING AS CRB 
    ON CRB.id = SOI.branding_data_id

LEFT JOIN MASTER_BASKET AS MB 
    ON MB.id = PCD.basket_mst_id

LEFT JOIN MASTER_UOM AS BASUOM 
    ON BASUOM.uom_id = MB.uom_id

LEFT JOIN MASTER_HSN_SAC_CODE AS MHSN 
    ON MHSN.id = MB.hsn_code_id

LEFT JOIN GST_RATE_MASTER AS GRMM 
    ON GRMM.id = MHSN.gst_rate_id

LEFT JOIN MASTER_BRANDING AS MBR 
    ON MBR.id = CRB.branding_mst_id

LEFT JOIN MASTER_UOM AS BRAUOM 
    ON BRAUOM.uom_id = MBR.uom_id

LEFT JOIN MASTER_HSN_SAC_CODE AS BHSN 
    ON BHSN.id = MBR.hsn_code_id

LEFT JOIN GST_RATE_MASTER AS MGRN 
    ON MGRN.id = BHSN.gst_rate_id 

LEFT JOIN MASTER_ACCESSORIES_NAME AS ACC 
    ON ACC.id = PCD.accessory_in_name

LEFT JOIN MASTER_UOM AS ACCUOM 
    ON ACCUOM.uom_id = ACC.uom_id

LEFT JOIN MASTER_HSN_SAC_CODE AS AHSN 
    ON AHSN.id = ACC.hsn_code_id

LEFT JOIN GST_RATE_MASTER AS AGRM 
    ON AGRM.id = AHSN.gst_rate_id 

LEFT JOIN MASTER_HSN_SAC_CODE AS HSN 
    ON HSN.id = P.hsn_code_id 

LEFT JOIN MASTER_ITEM AS mi 
    ON mi.id = PCD.accessory_in_name

LEFT JOIN MASTER_ASSET AS ma 
    ON ma.id = PCD.accessory_in_category

LEFT JOIN MASTER_SUB_CATEGORY AS msc 
    ON msc.id = PCD.accessory_in_sub_category

WHERE SO.id = ${id}
AND CP.isDeleted = 0;
      `
        );
        //         const dataList = await db.sequelize.query(
        //             `
        //     SELECT DISTINCT SOI.id AS soi_id, SOI.quantity AS so_item_qty, CP.dbp,CP.totalPrice,CP.totalWithGst,CP.id AS product_id, CP.qty, CP.cgst, CP.approvel_status, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, 
        //             CP.discount_request, CP.discount_approved, P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, 
        //             P.description AS product_description, CP.new_item, CP.promo_item, CP.apply_scheme, CP.scheme_id, CP.price_per_unit AS price_per_qty, 
        //             CP.maximum_discount, CP.product_category_id, U.uom_name, U.uom_id, CP.pro_sub_cat_id, CP.select_scheme, 
        //             PCT.id AS proposal_customisation_id, PCD.id AS customisation_data_id, PCD.customization_type, PCD.qty AS custom_qty,
        //             PCT.qty AS product_qty, PCT.order_qty, PCT.total_in_gst, PCT.grand_in_total,  PCD.gst, PCD.total_price, PCD.price_per_unit AS unit_price,
        //             PCT.grand_out_total, PCT.substract_total, PCT.add_total, PCT.proposal_no, PCT.remarks, PCT.status, 
        //             PCT.createdAt, PCT.updatedAt, PCT.proposal_item_id, PCT.version_id, P.hsn_code_id, HSN.hsn_sac_code, P.uom_id, UM.uom_name,
        //             CRB.id AS branding_id, CRB.qty AS branding_qty, CRB.branding_description, CRB.branding_sides, CRB.branding_amt,
        //             CRB.proposal_no AS branding_proposal_no, CRB.status AS branding_status, CRB.createdAt AS branding_createdAt,
        //             PCD.accessory_in_category, PCD.accessory_in_sub_category, PCD.accessory_in_name, 
        //             ma.asset_category_name, msc.sub_category_name, mi.item_name,
        //             PCD.with_gst AS customisation_with_gst,
        //           PCD.after_discount AS customisation_after_discount,
        //           PCD.discount AS customisation_discount,
        //           PCD.custome_type, PCD.basket_mst_id,
        //           CRB.with_gst AS branding_with_gst,
        //           CRB.after_discount AS branding_after_discount,
        //           CRB.discount AS branding_discount,
        //           ACC.accessories_name,
        //           ACC.hsn_code_id AS acce_hsn_id,
        //           AHSN.hsn_sac_code AS acce_hsn_sac_code,
        //           AGRM.value AS acce_gst_value,
        //           CRB.branding_mst_id AS brandingTypes,
        //           MBR.type_of_branding,
        //           MBR.branding_sides,
        //           MBR.price_per_unit,
        //           MBR.hsn_code_id,
        //           BHSN.hsn_sac_code AS branding_hsn_sac_code ,
        //           BHSN.description,
        //           MGRN.value,          
        //           MB.type_of_basket,MB.basket_qty, MB.price_per_unit, MHSN.hsn_sac_code AS basket_hsn_code, GRMM.value As basket_gst_value,
        //           CP.discount1,CP.discount2,CP.discount3,
        //           CP.discount1Mode,CP.discount2Mode,CP.discount3Mode,
        //           CP.discount1Flat,CP.discount2Flat,CP.discount3Flat,
        //           CP.flatPercentage1,CP.flatPercentage2,CP.flatPercentage3,MID.image AS item_img_path,
        //           CP.totalDiscountAmount,CRB.totalDiscountAmount as totalDiscountAmountB,PCD.totalDiscountAmount as totalDiscountAmountC,
        //           CP.totalDiscountAmountPerQTY,CRB.totalDiscountAmountPerQTY as totalDiscountAmountPerQTYB,PCD.totalDiscountAmountPerQTY as totalDiscountAmountPerQTYC,
        //           CP.warranty,CRB.gst as branding_gst,
        //             CRB.updatedAt AS branding_updatedAt, CRB.proposal_item_id AS branding_proposal_item_id, CRB.version_id AS branding_version_id
        //             ,ACCUOM.uom_name as accuom_name,BRAUOM.uom_name as brauom_name,BASUOM.uom_name as basuom_name
        //             FROM CRM_CREATE_PROPOSAL_MST AS C
        //             LEFT JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
        //             INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON CP.proposal_id = C.id
        //             LEFT JOIN MASTER_ITEM AS P ON CP.product_master_id = P.id 
        //             LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT AS MID ON MID.item_id = P.id 
        //             LEFT JOIN MASTER_UOM AS U ON U.uom_id = CP.uom_id
        //             LEFT JOIN MASTER_UOM AS UM ON UM.uom_id = P.uom_id
        //             LEFT JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = CP.version_id
        //             LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE AS PCT ON PCT.proposal_item_id = CP.id
        //             LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_DATA AS PCD ON PCD.proposal_customisation_id = PCT.id
        //             LEFT JOIN MASTER_BASKET AS MB ON MB.id = PCD.basket_mst_id
        //             LEFT JOIN MASTER_UOM AS BASUOM ON BASUOM.uom_id = MB.uom_id
        //             LEFT JOIN MASTER_HSN_SAC_CODE AS MHSN ON MHSN.id = MB.hsn_code_id
        //             LEFT JOIN GST_RATE_MASTER AS GRMM ON GRMM.id = MHSN.gst_rate_id
        //             LEFT JOIN CRM_PROPOSAL_BRANDING AS CRB ON PCT.id = CRB.proposal_customisation_id
        //             LEFT JOIN MASTER_BRANDING AS MBR ON MBR.id = CRB.branding_mst_id
        //             LEFT JOIN MASTER_UOM AS BRAUOM ON BRAUOM.uom_id = MBR.uom_id
        //             LEFT JOIN MASTER_HSN_SAC_CODE AS BHSN ON BHSN.id = MBR.hsn_code_id
        //             LEFT JOIN GST_RATE_MASTER AS MGRN ON MGRN.id = BHSN.gst_rate_id 
        //             LEFT JOIN MASTER_ACCESSORIES_NAME AS ACC ON ACC.id = PCD.accessory_in_name
        //             LEFT JOIN MASTER_UOM AS ACCUOM ON ACCUOM.uom_id = ACC.uom_id
        //             LEFT JOIN MASTER_HSN_SAC_CODE AS AHSN ON AHSN.id = ACC.hsn_code_id
        //             LEFT JOIN GST_RATE_MASTER AS AGRM ON AGRM.id = AHSN.gst_rate_id 
        //             LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = P.hsn_code_id 
        //             LEFT JOIN MASTER_ITEM AS mi ON mi.id = PCD.accessory_in_name
        //             LEFT JOIN MASTER_ASSET AS ma ON ma.id = PCD.accessory_in_category
        //             LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = PCD.accessory_in_sub_category
        //             INNER JOIN SALES_ORDER_MST AS SO ON C.id = SO.proposal_id AND CV.id = SO.version_id
        //           INNER JOIN SALES_ORDER_ITEM_LIST AS SOI 
        // ON SO.id = SOI.sales_order_id
        // AND SOI.product_master_id = CP.product_master_id
        //             WHERE SO.id=${id} AND CP.isDeleted = 0  GROUP BY SOI.id
        //       `
        //         );
        const [grossDiscountData] = await db.sequelize.query(
            `SELECT DISTINCT
                CASE 
                  WHEN GD.discount_type = 'percent' THEN
                      CONCAT(
                          CASE 
                              WHEN GD.discount_value = ROUND(GD.discount_value,0) THEN CAST(ROUND(GD.discount_value,0) AS CHAR)
                              ELSE CAST(GD.discount_value AS CHAR)
                          END,
                          '%'
                      )
                  ELSE CAST(GD.discount_value AS CHAR)
                END AS discount,
                GDM.discount_name,
                GD.discount_type, GD.discount_amount AS amount
            FROM CRM_PROPOSAL_GROSS_DISCOUNT AS GD
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP 
                ON CP.id = GD.proposal_id
            INNER JOIN CRM_PROPOSAL_GROSS_DISCOUNT_MST AS GDM 
                ON GDM.id = GD.gross_discount_id
            WHERE GD.proposal_id = ${proposalData[0][0].id} 
              AND GD.version_id = ${proposalData[0][0].version_id}
              AND GD.discount_type IS NOT NULL
              AND GD.discount_value IS NOT NULL`
        );
        const productMap = new Map();

        // for (const row of dataList[0]) {
        //     const productId = row.product_id;

        //     if (!productMap.has(productId)) {
        //         const baseProduct = {
        //             dbp: row.dbp,
        //             totalPrice: row.totalPrice,
        //             totalWithGst: row.totalWithGst,
        //             currency_symbol: row.currency_symbol,
        //             product_id: row.product_id,
        //             qty: row.qty,
        //             so_item_qty: row.so_item_qty,
        //             soi_id: row.soi_id,

        //             cgst: row.cgst,
        //             approvel_status: row.approvel_status,
        //             igst: row.igst,
        //             sgst: row.sgst,
        //             hsn_code_id: row.hsn_code_id,
        //             hsn_sac_code: row.hsn_sac_code,
        //             proposal_id: row.proposal_id,
        //             gst_type: row.gst_type,
        //             discount_request: row.discount_request,
        //             discount_approved: row.discount_approved,
        //             discount1: (row.discount1Mode ?? '') === 'percent' ? (row.discount1 || 0) + '%' : (row.discount1Flat || 0),
        //             discount2: (row.discount2Mode ?? '') === 'percent' ? (row.discount2 || 0) + '%' : (row.discount2Flat || 0),
        //             discount3: (row.discount3Mode ?? '') === 'percent' ? (row.discount3 || 0) + '%' : (row.discount3Flat || 0),
        //             totalDiscountAmount: row.totalDiscountAmount,
        //             totalDiscountAmountPerQTY: row.totalDiscountAmountPerQTY,
        //             warranty: row.warranty,
        //             product_master_id: row.product_master_id,
        //             product_name: row.product_name,
        //             product_code: row.product_code,
        //             product_description: row.product_description,
        //             new_item: row.new_item,
        //             promo_item: row.promo_item,
        //             apply_scheme: row.apply_scheme,
        //             scheme_id: row.scheme_id,
        //             price_per_unit: row.price_per_qty,
        //             maximum_discount: row.maximum_discount,
        //             product_category_id: row.product_category_id,
        //             uom_name: row.uom_name,
        //             uom_id: row.uom_id,
        //             item_img_path: row.item_img_path,
        //             paymentTC: row.paymentTC,
        //             pro_sub_cat_id: row.pro_sub_cat_id,
        //             select_scheme: row.select_scheme,
        //             custom_branding: [] // <- Instead of 3 separate fields
        //         };
        //         productMap.set(productId, baseProduct);
        //     }
        //     const product = productMap.get(productId);

        //     // Find or create the custom_branding entry by proposal_customisation_id
        //     let customBrandingEntry = product.custom_branding.find(cb => cb.id === row.proposal_customisation_id);
        //     if (!customBrandingEntry && row.proposal_customisation_id) {
        //         customBrandingEntry = {
        //             id: row.proposal_customisation_id,
        //             qty: row.branding_qty,
        //             order_qty: row.order_qty,
        //             select_scheme: row.select_scheme,
        //             total_in_gst: row.total_in_gst,
        //             grand_in_total: row.grand_in_total,
        //             grand_out_total: row.grand_out_total,
        //             substract_total: row.substract_total,
        //             customization_type: row.customization_type,
        //             gst: row.gst,
        //             unit_price: row.unit_price,
        //             total_price: row.total_price,
        //             add_total: row.add_total,
        //             proposal_no: row.proposal_no,
        //             remarks: row.remarks,
        //             status: row.status,
        //             createdAt: row.createdAt,
        //             updatedAt: row.updatedAt,
        //             proposal_item_id: row.proposal_item_id,
        //             version_id: row.version_id,
        //             with_gst: row.branding_with_gst,
        //             discount: row.customisation_discount ? (row.customisation_discount || 0) + '%' : 0,
        //             totalDiscountAmountC: row.totalDiscountAmountC,
        //             schedule_delivery_date: row.schedule_delivery_date,
        //             branding_after_discount: row.branding_after_discount,
        //             customisation_with_gst: row.customisation_with_gst,
        //             customisation_data: [],
        //             branding_data: null
        //         };
        //         product.custom_branding.push(customBrandingEntry);
        //     }

        //     // Push customisation_data
        //     if (row.customisation_data_id && customBrandingEntry) {
        //         customBrandingEntry.customisation_data.push({
        //             id: row.customisation_data_id,
        //             proposal_customisation_id: row.proposal_customisation_id,
        //             customization_type: row.customization_type,
        //             discount: row.customisation_discount ? (row.customisation_discount || 0) + '%' : 0,
        //             totalDiscountAmountC: row.totalDiscountAmountC,
        //             totalDiscountAmountPerQTYC: row.totalDiscountAmountPerQTYC,
        //             gst: row.gst,
        //             total_price: row.total_price,
        //             qty: row.custom_qty,
        //             price_per_unit: row.unit_price,
        //             accessory_in_name: row.accessory_in_name,
        //             accessory_in_category: row.accessory_in_category,
        //             accessory_in_sub_category: row.accessory_in_sub_category,
        //             item_name: row.accessories_name,
        //             asset_category_name: row.asset_category_name,
        //             sub_category_name: row.sub_category_name,
        //             custome_type: row.custome_type,
        //             basket_mst_id: row.basket_mst_id,
        //             type_of_basket: row.type_of_basket,
        //             basket_gst_value: row.basket_gst_value,
        //             basket_hsn_code: row.basket_hsn_code,
        //             acce_hsn_sac_code: row.acce_hsn_sac_code,
        //             acce_gst_value: row.acce_gst_value,
        //             acc_uom_name: row.accuom_name,
        //             bas_uom_name: row.basuom_name
        //         });
        //     }

        //     // Add branding_data (inside the same custom_branding entry)
        //     if (
        //         row.branding_id &&
        //         row.branding_proposal_item_id &&
        //         customBrandingEntry &&
        //         customBrandingEntry.id === row.proposal_customisation_id
        //     ) {
        //         customBrandingEntry.branding_data = {
        //             id: row.branding_id,
        //             qty: row.branding_qty,
        //             order_qty: row.order_qty,
        //             discount: row.branding_discount ? (row.branding_discount || 0) + '%' : 0,
        //             totalDiscountAmountB: row.totalDiscountAmountB,
        //             totalDiscountAmountPerQTYB: row.totalDiscountAmountPerQTYB,
        //             branding_after_discount: row.branding_after_discount,
        //             branding_with_gst: row.branding_with_gst,
        //             branding_description: row.branding_description,
        //             branding_amt: row.branding_amt,
        //             branding_sides: row.branding_sides,
        //             proposal_no: row.branding_proposal_no,
        //             hsn_sac_code: row.branding_hsn_sac_code,
        //             status: row.branding_status,
        //             createdAt: row.branding_createdAt,
        //             updatedAt: row.brandingUpdatedAt,
        //             proposal_item_id: row.branding_proposal_item_id,
        //             version_id: row.branding_version_id,
        //             proposal_customisation_id: row.proposal_scheme_type_id || null,
        //             gst: row.branding_gst,
        //             bra_uom_name: row.brauom_name
        //         };
        //     }
        // }

        for (const row of dataList[0]) {
            const productId = row.product_id;

            if (!productMap.has(productId)) {
                productMap.set(productId, {
                    dbp: row.dbp,
                    totalPrice: row.totalPrice,
                    totalWithGst: row.totalWithGst,
                    currency_symbol: row.currency_symbol,
                    product_id: row.product_id,
                    qty: row.qty,
                    so_item_qty: row.so_item_qty,
                    soi_id: row.soi_id,

                    cgst: row.cgst,
                    approvel_status: row.approvel_status,
                    igst: row.igst,
                    sgst: row.sgst,

                    hsn_code_id: row.hsn_code_id,
                    hsn_sac_code: row.hsn_sac_code,

                    proposal_id: row.proposal_id,
                    gst_type: row.gst_type,

                    discount_request: row.discount_request,
                    discount_approved: row.discount_approved,

                    discount1: (row.discount1Mode ?? '') === 'percent'
                        ? `${row.discount1 || 0}%`
                        : (row.discount1Flat || 0),

                    discount2: (row.discount2Mode ?? '') === 'percent'
                        ? `${row.discount2 || 0}%`
                        : (row.discount2Flat || 0),

                    discount3: (row.discount3Mode ?? '') === 'percent'
                        ? `${row.discount3 || 0}%`
                        : (row.discount3Flat || 0),

                    totalDiscountAmount: row.totalDiscountAmount,
                    totalDiscountAmountPerQTY: row.totalDiscountAmountPerQTY,
                    warranty: row.warranty,

                    product_master_id: row.product_master_id,
                    product_name: row.product_name,
                    product_code: row.product_code,
                    product_description: row.product_description,

                    new_item: row.new_item,
                    promo_item: row.promo_item,
                    apply_scheme: row.apply_scheme,
                    scheme_id: row.scheme_id,

                    price_per_unit: row.price_per_qty,
                    maximum_discount: row.maximum_discount,

                    product_category_id: row.product_category_id,
                    uom_name: row.uom_name,
                    uom_id: row.uom_id,

                    item_img_path: row.item_img_path,
                    paymentTC: row.paymentTC,
                    pro_sub_cat_id: row.pro_sub_cat_id,
                    select_scheme: row.select_scheme,

                    custom_branding: [],

                    // 👇 important: map to avoid duplicates
                    _brandingMap: new Map()
                });
            }

            const product = productMap.get(productId);

            if (!row.proposal_customisation_id) continue;

            // =========================
            // CUSTOM BRANDING ENTRY
            // =========================
            let customBrandingEntry = product.custom_branding.find(
                cb => cb.id === row.proposal_customisation_id
            );

            if (!customBrandingEntry) {
                customBrandingEntry = {
                    id: row.proposal_customisation_id,
                    qty: row.so_item_qty,
                    order_qty: row.order_qty,
                    select_scheme: row.select_scheme,

                    total_in_gst: row.total_in_gst,
                    grand_in_total: row.grand_in_total,
                    grand_out_total: row.grand_out_total,
                    substract_total: row.substract_total,

                    customization_type: row.customization_type,
                    gst: row.gst,
                    unit_price: row.unit_price,
                    total_price: row.total_price,

                    add_total: row.add_total,
                    proposal_no: row.proposal_no,
                    remarks: row.remarks,
                    status: row.status,

                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,

                    proposal_item_id: row.proposal_item_id,
                    version_id: row.version_id,

                    with_gst: row.branding_with_gst,

                    discount: row.customisation_discount
                        ? `${row.customisation_discount || 0}%`
                        : '0%',

                    totalDiscountAmountC: row.totalDiscountAmountC,
                    schedule_delivery_date: row.schedule_delivery_date,
                    branding_after_discount: row.branding_after_discount,
                    customisation_with_gst: row.customisation_with_gst,

                    customisation_data: [],
                    branding_data: null
                };

                product.custom_branding.push(customBrandingEntry);
            }

            // =========================
            // CUSTOMISATION DATA (NO DUPLICATES)
            // =========================
            if (row.customisation_data_id) {
                const exists = customBrandingEntry.customisation_data.some(
                    c => c.id === row.customisation_data_id
                );

                if (!exists) {
                    customBrandingEntry.customisation_data.push({
                        id: row.customisation_data_id,
                        proposal_customisation_id: row.proposal_customisation_id,
                        customization_type: row.customization_type,

                        discount: row.customisation_discount
                            ? `${row.customisation_discount || 0}%`
                            : '0%',

                        totalDiscountAmountC: row.totalDiscountAmountC,
                        totalDiscountAmountPerQTYC: row.totalDiscountAmountPerQTYC,

                        gst: row.gst,
                        total_price: row.total_price,
                        qty: row.so_item_qty,
                        price_per_unit: row.unit_price,

                        accessory_in_name: row.accessory_in_name,
                        accessory_in_category: row.accessory_in_category,
                        accessory_in_sub_category: row.accessory_in_sub_category,

                        item_name: row.accessories_name,
                        asset_category_name: row.asset_category_name,
                        sub_category_name: row.sub_category_name,

                        custome_type: row.custome_type,
                        basket_mst_id: row.basket_mst_id,

                        type_of_basket: row.type_of_basket,
                        basket_gst_value: row.basket_gst_value,
                        basket_hsn_code: row.basket_hsn_code,

                        acce_hsn_sac_code: row.acce_hsn_sac_code,
                        acce_gst_value: row.acce_gst_value,

                        acc_uom_name: row.accuom_name,
                        bas_uom_name: row.basuom_name
                    });
                }
            }

            // =========================
            // BRANDING DATA (FIXED - NO OVERWRITE)
            // =========================
            if (row.branding_id && row.branding_proposal_item_id) {

                const existingBranding = customBrandingEntry.branding_data;

                if (!existingBranding || existingBranding.id !== row.branding_id) {
                    customBrandingEntry.branding_data = {
                        id: row.branding_id,
                        qty: row.so_item_qty,
                        order_qty: row.order_qty,

                        discount: row.branding_discount
                            ? `${row.branding_discount || 0}%`
                            : '0%',

                        totalDiscountAmountB: row.totalDiscountAmountB,
                        totalDiscountAmountPerQTYB: row.totalDiscountAmountPerQTYB,

                        branding_after_discount: row.branding_after_discount,
                        branding_with_gst: row.branding_with_gst,

                        branding_description: row.branding_description,
                        branding_amt: row.branding_amt,
                        branding_sides: row.branding_sides,

                        proposal_no: row.branding_proposal_no,
                        hsn_sac_code: row.branding_hsn_sac_code,
                        status: row.branding_status,

                        createdAt: row.branding_createdAt,
                        updatedAt: row.branding_updatedAt,

                        proposal_item_id: row.branding_proposal_item_id,
                        version_id: row.branding_version_id,

                        gst: row.branding_gst,
                        bra_uom_name: row.brauom_name
                    };
                }
            }
        }

        const productDetailList = Array.from(productMap.values());
        const chargeRuleMst = await db.salesReturnChargesMst.findAll({ where: { reference_type: 'SO_CANCEL' } });

        const Obj = {
            ...proposalData[0][0],
            //   charges,
            productDetailList,
            grossDiscountDetail: grossDiscountData,
            chargeRuleMst: chargeRuleMst
        };

        return res.json({
            success: true,
            data: Obj
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports.createSalesReturn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { so_id, itemList, so_no, warehouse_id, finance_id, entity_id, customer_id, invoice_id, return_type, total_amount, total_charge, net_amount } = req.body;


        const date = moment().format('YYYY-MM-DD');

        const generateReturnNo = async () => {
            const today = moment().format('YYYYMMDD');
            const lastRecord = await db.salesReturnMst.findOne({ order: [['id', 'DESC']] });

            const nextNumber = lastRecord?.return_no ? parseInt(lastRecord.return_no.split('-')[2]) + 1 : 1;

            return `RE-${today}-${String(nextNumber).padStart(4, '0')}`;
        };

        const createLedger = async (item_id, qty, referenceId, remark) => {
            await db.inventory_ledger.create({
                quantity: qty,
                type: 'RETURN_IN',
                reference_table: 'SO',
                reference_table_id: referenceId,
                remark,
                warehouse_id,
                financial_year_id: finance_id,
                entity_id,
                item_id,
                created_by: req.userId
            }, { transaction });
        };

        const updateStock = async (item_id, field, qty) => {
            const stock = await db.inventory_stock.findOne({
                where: {
                    warehouse_id,
                    entity_id,
                    item_id
                },
                transaction
            });

            if (!stock) {
                throw new Error(`Stock not found for item ${item_id}`);
            }

            await stock.decrement(
                { [field]: qty },
                { transaction }
            );

            await stock.increment(
                { available_qty: qty },
                { transaction }
            );
        };

        if (invoice_id) {

            await db.salesInvoiceData.update({
                invoice_status: "CANCELLED",
                cancelled_invoice_date: date,
                cancel_by_id: req.userId
            }, {
                where: { id: invoice_id },
                transaction
            });
            // await db.financial_And_Account_Journal_List.bulkCreate

        } else {

            if (!so_id || !finance_id || !entity_id || !Array.isArray(itemList) || !itemList.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Required fields are missing'
                });
            }

            const return_no = await generateReturnNo();

            const dataMst = await db.salesReturnMst.create({
                reference_type:
                    return_type === 'RETURN'
                        ? 'GOODS_RETURN'
                        : 'SO_CANCEL',
                sales_order_id: so_id,
                return_no,
                so_no,
                warehouse_id,
                financial_id: finance_id,
                entity_id,
                customer_id,
                created_by_id: req.userId,
                total_amount, total_charge, net_amount
            }, { transaction });

            for (const el of itemList) {

                if (return_type === 'RETURN') {

                    await db.salesOrderItemNew.increment({
                        goods_return_qty: el.return_qty
                    }, {
                        where: { id: el.soi_id },
                        transaction
                    });
                    const itemType = await db.salesOrderItemNew.findAll({ where: { parent_item_id: el.soi_id } });
                    for (const elem of itemType) {





                        if (elem.item_type === 'Accessories') {
                            let accReturn = (elem.qty / el.qty) * el.return_qty;
                            await db.salesOrderItemNew.increment({
                                goods_return_qty: accReturn
                            }, {
                                where: { id: elem.id },
                                transaction
                            });
                            await db.salesReturnItem.create({
                                qty: elem.qty,
                                return_qty: accReturn,
                                rate: elem.price_per_unit,
                                gst: elem.igst,

                                sales_return_id: dataMst.id,
                                item_id: elem.item_id,
                                so_item_id: elem.id
                            }, { transaction });
                            await createLedger(elem.item_id, accReturn, elem.id, `Stock Return Against SO - ${so_no}`);
                            await updateStock(elem.item_id, 'delivered_qty', accReturn);
                        }
                        if (elem.item_type === 'Branding') {
                            await db.salesOrderItemNew.increment({
                                goods_return_qty: el.return_qty
                            }, {
                                where: { id: elem.id },
                                transaction
                            });
                            await db.salesReturnItem.create({
                                qty: elem.qty,
                                return_qty: el.return_qty,
                                rate: elem.price_per_unit,
                                gst: elem.igst,
                                sales_return_id: dataMst.id,
                                item_id: elem.item_id,
                                so_item_id: elem.id
                            }, { transaction });
                            await createLedger(elem.item_id, el.return_qty, elem.id, `Stock Return Against SO - ${so_no}`);
                            await updateStock(elem.item_id, 'delivered_qty', el.return_qty);
                        }

                        if (elem.item_type === 'Baskets') {
                            const basketReturn = (elem.qty / el.qty) * el.return_qty;
                            await db.salesOrderItemNew.increment({
                                goods_return_qty: basketReturn
                            }, {
                                where: { id: elem.id },
                                transaction
                            });
                            await db.salesReturnItem.create({
                                qty: elem.qty,
                                return_qty: basketReturn,
                                rate: elem.price_per_unit,
                                gst: elem.igst,
                                sales_return_id: dataMst.id,
                                item_id: elem.item_id,
                                so_item_id: elem.id
                            }, { transaction });
                            await createLedger(elem.item_id, basketReturn, elem.id, `Stock Return Against SO - ${so_no}`);
                            await updateStock(elem.item_id, 'delivered_qty', basketReturn);
                        }

                    }
                    await db.stockTransferSerialnew.update({
                        status: 'RETURNED'
                    }, {
                        where: { id: el.sts_id },
                        transaction
                    });

                    await db.salesReturnItem.create({
                        qty: el.qty,
                        return_qty: el.return_qty,
                        rate: el.price_per_unit,
                        gst: el.igst,
                        remarks: el.remark,
                        return_reason: el.return_reason,
                        sales_return_id: dataMst.id,
                        item_id: el.item_id,
                        so_item_id: el.soi_id
                    }, { transaction });

                    await createLedger(
                        el.item_id,
                        el.return_qty,
                        el.soi_id,
                        `Goods Return Against SO - ${so_no}`
                    );

                    await updateStock(
                        el.item_id,
                        'delivered_qty',
                        el.return_qty
                    );

                } else {
                    if (el.item_type !== 'Kit') {


                        await db.salesReturnItem.create({
                            qty: el.qty,
                            return_qty: el.return_qty,
                            rate: el.price_per_unit,
                            gst: el.igst,
                            remarks: el.remark,
                            return_reason: el.return_reason,
                            sales_return_id: dataMst.id,
                            item_id: el.item_id,
                            so_item_id: el.id
                        }, { transaction });

                        if (el.children?.length) {

                            for (const elem of el.children) {

                                let returnQty = 0;

                                if (elem.item_type === 'Accessories') {
                                    returnQty = (elem.qty / el.qty) * el.return_qty;
                                }

                                if (elem.item_type === 'Baskets') {
                                    returnQty = (elem.qty / el.qty) * el.return_qty;
                                }

                                if (returnQty > 0) {

                                    await db.salesOrderItemNew.decrement({ qty: returnQty }, { where: { id: elem.id }, transaction });

                                    await createLedger(elem.item_id, returnQty, el.id, `Stock Return Against SO - ${so_no}`);

                                    await updateStock(elem.item_id, 'hold_qty', returnQty);
                                }
                            }
                        }

                        await db.salesOrderItemNew.decrement({ qty: el.return_qty }, { where: { id: el.id }, transaction });

                        await createLedger(el.item_id, el.return_qty, el.id, `Stock Return Against SO - ${so_no}`);
                        await updateStock(el.item_id, 'hold_qty', el.return_qty);
                    } else {
                        for (const x of el.children) {


                            await db.salesReturnItem.create({
                                qty: x.qty,
                                return_qty: el.return_qty,
                                rate: el.price_per_unit,
                                gst: el.igst,
                                remarks: el.remark,
                                return_reason: el.return_reason,
                                sales_return_id: dataMst.id,
                                item_id: el.item_id,
                                so_item_id: el.id
                            }, { transaction });

                            // if (x.children?.length) {

                            //     for (const elem of x.children) {

                                    let returnQty = 0;

                                    if (x.item_type === 'Primary Item') {
                                        returnQty = (x.qty / el.qty) * el.return_qty;
                                    }

                                    if (x.item_type === 'Substitute Item') {
                                        returnQty = (x.qty / el.qty) * el.return_qty;
                                    }

                                    if (returnQty > 0) {

                                        await db.salesOrderItemNew.decrement({ qty: returnQty }, { where: { id: x.id }, transaction });

                                        await createLedger(x.item_id, returnQty, el.id, `Stock Return Against SO - ${so_no}`);

                                        await updateStock(x.item_id, 'hold_qty', returnQty);
                                    }
                            //     }
                            // }

                            
                            await createLedger(x.item_id, el.return_qty, el.id, `Stock Return Against SO - ${so_no}`);
                            
                            await updateStock(x.item_id, 'hold_qty', el.return_qty);
                        }
                        await db.salesOrderItemNew.decrement({ qty: el.return_qty }, { where: { id: el.id }, transaction });
                    }
                }
            }

            await db.salesReturnCharges.create({
                sales_return_id: dataMst.id,
                charge_type: 'CANCELLATION'
            }, { transaction });
        }



        let message = '';

        if (invoice_id) {
            const salesExist = await db.salesInvoiceData.findOne({
                where: { id: invoice_id },
                transaction
            });

            const journalEntries = await db.financial_And_Account_Journal_List.findAll({
                where: {
                    document_number: salesExist.sales_invoice_no,
                    entry_status: 'Sales Invoice'
                },
                transaction
            });

            const reversalEntries = journalEntries.map(entry => ({
                party_type: entry.party_type,
                debit_amount: Number(entry.credit_amount || 0),
                credit_amount: Number(entry.debit_amount || 0),
                entry_status: 'Sales Cancellation',
                document_number: salesExist.sales_invoice_no,
                chart_account_id: entry.chart_account_id,
                customer_id: entry.customer_id,
                entity_id: entry.entity_id,
                cost_center_id: entry.cost_center_id,
                profit_center_id: entry.profit_center_id,
                financial_id: entry.financial_id,
            }));

            await db.financial_And_Account_Journal_List.bulkCreate(
                reversalEntries,
                { transaction }
            );
            message = 'Invoice cancelled successfully';
        } else if (return_type === 'RETURN') {

            const customerExist = await db.customerAddress.findOne({ where: { customer_id: customer_id }, attributes: ['customer_id', 'billing_state_id'] })
            if (!customerExist) {
                return res.status(404).send({ code: 404, message: 'Customer billing State is not mapped' })
            }
            const entityExist = await db.entityMaster.findOne({ where: { id: entity_id } })
            if (!entityExist) {
                return res.status(404).send({ code: 404, message: 'In Entity Master State is not mapped' })
            }
            const isIntraState =
                entityExist?.state_id === customerExist?.billing_state_id;

            const gstData = itemList.reduce(
                (acc, item) => {
                    const taxable =
                        Number(item.price_per_unit) *
                        Number(item.return_qty || 1);

                    if (isIntraState) {

                        const cgstRate =
                            Number(item.cgst || item.igst / 2 || 0);

                        const sgstRate =
                            Number(item.sgst || item.igst / 2 || 0);

                        acc.cgst += taxable * (cgstRate / 100);
                        acc.sgst += taxable * (sgstRate / 100);

                    } else {

                        acc.igst +=
                            taxable * (Number(item.igst || 0) / 100);

                    }

                    return acc;
                },
                {
                    cgst: 0,
                    sgst: 0,
                    igst: 0
                }
            );

            const gst_amount = gstData.cgst + gstData.sgst + gstData.igst;

            await db.financial_And_Account_Journal_List.create({
                debit_amount: parseFloat(total_amount) + parseFloat(gst_amount),
                credit_amount: 0.00,
                entry_status: 'Sales Return',
                document_number: so_no,
                chart_account_id: 209,
                entity_id: entity_id,
                financial_id: finance_id,
            });

            await db.financial_And_Account_Journal_List.create({
                debit_amount: 0.00,
                credit_amount: total_amount,
                entry_status: 'Sales Return',
                document_number: so_no,
                chart_account_id: 163,
                entity_id: entity_id,
                financial_id: finance_id,
                party_type: 'CUSTOMER',
                customer_id: customer_id,
            });

            if (gst_amount > 0) {

                if (entityExist?.state_id == customerExist?.billing_state_id) {

                    const divideGST = gst_amount / 2;
                    await db.financial_And_Account_Journal_List.create({
                        debit_amount: 0.00,
                        credit_amount: divideGST,
                        chart_account_id: 43,
                        entity_id: entity_id,
                        entry_status: 'Sales Return',
                        document_number: so_no,
                        financial_id: finance_id,
                        customer_id
                    });

                    await db.financial_And_Account_Journal_List.create({
                        debit_amount: 0.00,
                        credit_amount: divideGST,
                        chart_account_id: 23,
                        entity_id: entity_id,
                        entry_status: 'Sales Return',
                        document_number: so_no,
                        financial_id: finance_id,
                        customer_id
                    });

                } else {
                    await db.financial_And_Account_Journal_List.create({
                        debit_amount: 0.00,
                        credit_amount: gst_amount,
                        chart_account_id: 31,
                        entity_id: entity_id,
                        entry_status: 'Sales Return',
                        document_number: so_no,
                        financial_id: finance_id,
                        customer_id
                    });

                }

            }



            message = 'Sales return created successfully';
        } else {
            message = 'Sales order cancelled successfully';

        }
        await transaction.commit();
        return res.status(200).json({
            success: true,
            message
        });

    } catch (error) {

        await transaction.rollback();

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
    // try {
    //     const { so_id, itemList, so_no, warehouse_id, finance_id, entity_id, customer_id, invoice_id, return_type } = req.body;
    //     const date = moment().format('YYYY-MM-DD');
    //     if (return_type == 'RETURN') {
    //         const today = moment().format('YYYYMMDD');
    //         const lastRecord = await db.salesReturnMst.findOne({ order: [['id', 'DESC']] });
    //         let nextNumber = 1;
    //         if (lastRecord && lastRecord.return_no) {
    //             const lastIncrement = parseInt(lastRecord.return_no.split('-')[2]);
    //             nextNumber = lastIncrement + 1;
    //         }

    //         const paddedNumber = String(nextNumber).padStart(4, '0');
    //         const return_no = `RE-${today}-${paddedNumber}`;
    //         console.log('hellooooooooooooooo');
    //         if (!so_id || !finance_id || !entity_id || !Array.isArray(itemList) || itemList.length === 0) {
    //             return res.status(400).json({ success: false, message: 'Required fields are missing' });
    //         }

    //         const dataMst = await db.salesReturnMst.create({
    //             reference_type: 'GOODS_RETURN',
    //             sales_order_id: so_id,
    //             return_no: return_no,
    //             so_no: so_no,
    //             warehouse_id: warehouse_id,
    //             financial_id: finance_id,
    //             entity_id: entity_id,
    //             customer_id: customer_id,
    //             created_by_id: req.userId
    //         }, { transaction });
    //         for (const el of itemList) {
    //             await db.salesOrderItemNew.increment({ goods_return_qty: el.return_qty }, { where: { id: el.soi_id }, transaction });
    //             await db.stockTransferSerialnew.update({ status: "RETURNED" }, { where: { id: el.sts_id } }, { transaction });
    //             await db.salesReturnItem.create({
    //                 qty: el.qty,
    //                 return_qty: el.return_qty,
    //                 rate: el.price_per_unit,
    //                 gst: el.igst,
    //                 remarks: el.remark,
    //                 return_reason: el.return_reason,
    //                 sales_return_id: dataMst.id,
    //                 item_id: el.item_id,
    //                 so_item_id: el.soi_id
    //             }, { transaction });
    //             await db.inventory_ledger.create({
    //                 quantity: el.return_qty,
    //                 type: 'RETURN_IN',
    //                 reference_table: 'SO',
    //                 reference_table_id: el.soi_id,
    //                 remark: `Goods Return Against SO -${so_no}`,
    //                 warehouse_id: warehouse_id,
    //                 financial_year_id: finance_id,
    //                 entity_id: entity_id,
    //                 item_id: el.item_id,
    //                 created_by: req.userId
    //             }, { transaction })

    //             const stock = await db.inventory_stock.findOne({ where: { warehouse_id, entity_id, item_id: el.item_id, }, transaction });

    //             if (!stock) { throw new Error('Stock not found'); }

    //             await stock.decrement({ delivered_qty: el.return_qty }, { transaction });

    //             await stock.increment({ available_qty: el.return_qty }, { transaction });
    //             await db.salesReturnCharges.create({
    //                 sales_return_id: dataMst.id,
    //                 charge_type: 'CANCELLATION',
    //             }, { transaction });
    //         }


    //     } else if (invoice_id) {
    //         console.log('hello');
    //         await db.salesInvoiceData.update({ invoice_status: "CANCELLED", cancelled_invoice_date: date, cancel_by_id: req.userId }, { where: { id: invoice_id } });
    //     } else {


    //         const today = moment().format('YYYYMMDD');
    //         const lastRecord = await db.salesReturnMst.findOne({ order: [['id', 'DESC']] });
    //         let nextNumber = 1;
    //         if (lastRecord && lastRecord.return_no) {
    //             const lastIncrement = parseInt(lastRecord.return_no.split('-')[2]);
    //             nextNumber = lastIncrement + 1;
    //         }

    //         const paddedNumber = String(nextNumber).padStart(4, '0');
    //         const return_no = `RE-${today}-${paddedNumber}`;

    //         if (!so_id || !finance_id || !entity_id || !Array.isArray(itemList) || itemList.length === 0) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Required fields are missing'
    //             });
    //         }

    //         // create master
    //         const dataMst = await db.salesReturnMst.create({
    //             reference_type: 'SO_CANCEL',
    //             sales_order_id: so_id,
    //             return_no: return_no,
    //             so_no: so_no,
    //             warehouse_id: warehouse_id,
    //             financial_id: finance_id,
    //             entity_id: entity_id,
    //             customer_id: customer_id,
    //             created_by_id: req.userId
    //         }, { transaction });

    //         // create items
    //         for (const el of itemList) {

    //             await db.salesReturnItem.create({
    //                 qty: el.qty,
    //                 return_qty: el.return_qty,
    //                 rate: el.price_per_unit,
    //                 gst: el.igst,
    //                 remarks: el.remark,
    //                 return_reason: el.return_reason,
    //                 sales_return_id: dataMst.id,
    //                 item_id: el.item_id,
    //                 so_item_id: el.id
    //             }, { transaction });
    //             if (el.children.length) {
    //                 for (const elem of el.children) {
    //                     const basket = el.qty / elem.qty;

    //                     if (elem.item_type == 'Accessories') {
    //                         const acce = elem.qty / el.qty;
    //                         const returnQty = acce * el.return_qty;
    //                         await db.salesOrderItemNew.decrement({
    //                             qty: returnQty
    //                         }, { where: { id: elem.id }, transaction }
    //                         );
    //                         await db.inventory_ledger.create({
    //                             quantity: returnQty,
    //                             type: 'RETURN_IN',
    //                             reference_table: 'SO',
    //                             reference_table_id: el.id,
    //                             remark: `Stock Return Against SO -${so_no}`,
    //                             warehouse_id: warehouse_id,
    //                             financial_year_id: finance_id,
    //                             entity_id: entity_id,
    //                             item_id: elem.item_id,
    //                             created_by: req.userId
    //                         }, { transaction })

    //                         const stock = await db.inventory_stock.findOne({
    //                             // where: { warehouse_id, financial_year_id: finance_id, entity_id, item_id: el.item_id, },
    //                             where: { warehouse_id, entity_id, item_id: elem.item_id, },
    //                             transaction
    //                         });

    //                         if (!stock) { throw new Error('Stock not found'); }


    //                         await stock.decrement({ hold_qty: returnQty }, { transaction });

    //                         await stock.increment({ available_qty: returnQty }, { transaction });
    //                     }
    //                     if (elem.item_type == 'Baskets') {
    //                         const basket = elem.qty / el.qty;
    //                         const returnQty = basket * el.return_qty;

    //                         await db.salesOrderItemNew.decrement({
    //                             qty: returnQty
    //                         }, { where: { id: elem.id }, transaction }
    //                         );
    //                         await db.inventory_ledger.create({
    //                             quantity: returnQty,
    //                             type: 'RETURN_IN',
    //                             reference_table: 'SO',
    //                             reference_table_id: el.id,
    //                             remark: `Stock Return Against SO -${so_no}`,
    //                             warehouse_id: warehouse_id,
    //                             financial_year_id: finance_id,
    //                             entity_id: entity_id,
    //                             item_id: elem.item_id,
    //                             created_by: req.userId
    //                         }, { transaction })

    //                         const stock = await db.inventory_stock.findOne({
    //                             // where: { warehouse_id, financial_year_id: finance_id, entity_id, item_id: el.item_id, },
    //                             where: { warehouse_id, entity_id, item_id: elem.item_id, },
    //                             transaction
    //                         });

    //                         if (!stock) { throw new Error('Stock not found'); }


    //                         await stock.decrement({ hold_qty: returnQty }, { transaction });

    //                         await stock.increment({ available_qty: returnQty }, { transaction });
    //                     }

    //                 }
    //             }
    //             await db.salesOrderItemNew.decrement({
    //                 qty: el.return_qty
    //             }, { where: { id: el.id }, transaction }
    //             );
    //             await db.inventory_ledger.create({
    //                 quantity: el.return_qty,
    //                 type: 'RETURN_IN',
    //                 reference_table: 'SO',
    //                 reference_table_id: el.id,
    //                 remark: `Stock Return Against SO -${so_no}`,
    //                 warehouse_id: warehouse_id,
    //                 financial_year_id: finance_id,
    //                 entity_id: entity_id,
    //                 item_id: el.item_id,
    //                 created_by: req.userId
    //             }, { transaction })

    //             const stock = await db.inventory_stock.findOne({
    //                 // where: { warehouse_id, financial_year_id: finance_id, entity_id, item_id: el.item_id, },
    //                 where: { warehouse_id, entity_id, item_id: el.item_id, },
    //                 transaction
    //             });

    //             if (!stock) { throw new Error('Stock not found'); }

    //             // if (stock.hold_qty < el.return_qty) {
    //             //     throw new Error('Insufficient hold qty');
    //             // }
    //             await stock.decrement({ hold_qty: el.return_qty }, { transaction });

    //             await stock.increment({ available_qty: el.return_qty }, { transaction });
    //         }

    //         // create charges
    //         await db.salesReturnCharges.create({
    //             sales_return_id: dataMst.id,
    //             charge_type: 'CANCELLATION',
    //         }, { transaction });
    //     }
    //     // commit
    //     await transaction.commit();

    //     return res.status(200).json({
    //         success: true,
    //         message: invoice_id
    //             ? 'Invoice cancelled successfully'
    //             : 'Sales return created successfully'
    //     });

    // } catch (error) {

    //     await transaction.rollback();

    //     return res.status(500).json({
    //         success: false,
    //         message: error.message
    //     });
    // }
};

module.exports.getsSalesReturn = async (req, res) => {
    try {
        const { financial_id, entity_id } = req.query;
        let data = await db.salesReturnMst.findAll({
            where: { financial_id, entity_id }, include: [

                {
                    model: db.salesReturnItem,
                    as: 'SALES_RETURN_ITEMS'
                },
                {
                    model: db.customerProfile,
                    as: 'CUSTOMER'
                },
                {
                    model: db.salesOrder,
                    include: [
                        {
                            model: db.proposalData,
                            include: [
                                {
                                    model: db.warehouse,
                                    as: 'warehouseData'
                                }
                            ],
                            as: 'proposalData'
                        }
                    ],
                    as: 'SALES_ORDER'
                }
            ],
            order: [['id', 'DESC']]
        });
        if (!data.length) {
            return res.status(404).json({
                success: true,
                message: 'Sales return not found!',
                code: 200,
                data: []
            });
        }

        data = data.map((el) => ({
            ...el.toJSON(),
            customer: el.CUSTOMER.company_name,
            sales_order_no: el.SALES_ORDER?.sales_order_no || null,
            warehouse: el.SALES_ORDER?.proposalData?.warehouseData?.name || null
        }));

        return res.status(200).json({
            success: true,
            message: 'Sales return fetched successfully',
            code: 200,
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports.getSalesReturn = async (req, res) => {
    try {
        const { financial_id, entity_id, id } = req.query;
        let data = await db.salesReturnMst.findOne({
            where: { id }, include: [

                {
                    model: db.salesReturnItem,
                    include: [
                        {
                            model: db.salesOrderItemNew,
                            as: 'soItemList',
                            attributes: [
                                'parent_item_id',
                                'item_name',
                                'item_type',
                                'hsncode',
                                'UOM'
                            ]
                        }
                    ],
                    as: 'SALES_RETURN_ITEMS'
                },
                {
                    model: db.customerProfile,
                    as: 'CUSTOMER'
                },
                {
                    model: db.salesOrder,
                    include: [
                        {
                            model: db.proposalData,
                            include: [
                                {
                                    model: db.warehouse,
                                    as: 'warehouseData'
                                }
                            ],
                            as: 'proposalData'
                        }
                    ],
                    as: 'SALES_ORDER'
                }
            ],
            order: [['id', 'DESC']]
        });
        if (!data) {
            return res.status(404).json({
                success: true,
                message: 'Sales return not found!',
                code: 200,
                data: []
            });

        }
        let items = data.SALES_RETURN_ITEMS.map(x => {
            const item = x.toJSON();

            const { soItemList, ...rest } = item;

            return {
                ...rest,
                ...(soItemList || {})
            };
        });
        delete data.SALES_RETURN_ITEMS;
        const result = {
            ...data.toJSON(),
            items: items,
            customer: data.CUSTOMER?.company_name || null,
            sales_order_no: data.SALES_ORDER?.sales_order_no || null,
            warehouse: data.SALES_ORDER?.proposalData?.warehouseData?.name || null
        };

        return res.status(200).json({
            success: true,
            message: 'Sales return fetched successfully',
            code: 200,
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports.getSODetailsByDocType2 = async (req, res) => {
    try {
        const { id, finance_id } = req.query;
        const dataExist = await db.salesOrder.findOne({ where: { id } });

        if (!dataExist) {
            return res.status(404).send({ code: 404, message: "No Data found for this SO Id" });
        }

        const [result] = await db.sequelize.query(
            `SELECT SO.*, CONCAT('INV-',SO.sales_order_no) AS invoiceNo, 
             CONCAT(CP.company_name, ' - ', CP.customer_code) AS cname, CA.contact_person_name, CA.mobile, PI.pi_number, 
             CONCAT(CSA.shipping_address, ', ', CSA.shipping_postal_address, ', ', CSA.shipping_pin_code) AS shippingAddress
             FROM SALES_ORDER_MST AS SO 
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
                     (PL.qty) AS proposed_quantity,
                      PL.price_per_unit AS rate,
                    -- PL.totalPrice,
                     C.quantity AS delivered_qty,
                     IMG.image ,
                     SUM(C.quantity) OVER (PARTITION BY C.product_master_id ORDER BY CA.id, CA.sales_order_no ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total_delivered_quantity
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
                 rate,(rate * delivered_qty) AS totalPrice,
                 proposed_quantity,
                 delivered_qty,
                 total_delivered_quantity,
                 select_scheme,
                 (proposed_quantity - total_delivered_quantity) AS remaining_quantity
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

        const enrichedProductList = await getCustomisationBrandingData(id, allResult, 'B');

        const obj = {
            ...result[0],
            productDetailList: enrichedProductList,

        };



        if (dataExist?.invoice_status == 'PENDING') {
            const total_amount = enrichedProductList.reduce(
                (total, row) => total + parseFloat(row.totalPrice || 0),
                0
            );
            const gst_amount = enrichedProductList.reduce(
                (sum, i) => sum + ((Number(i.totalPrice || 0) * Number(i.gst_rate || 0)) / 100),
                0
            );
            const customerExist = await db.customerAddress.findOne({ where: { customer_id: dataExist?.customer_id }, attributes: ['customer_id', 'billing_state_id'] })
            if (!customerExist) {
                return res.status(404).send({ code: 404, message: 'Customer billing State is not mapped' })
            }
            const entityExist = await db.entityMaster.findOne({ where: { id: dataExist.entity_id } })
            if (!entityExist) {
                return res.status(404).send({ code: 404, message: 'In Entity Master State is not mapped' })
            }


            await db.salesOrder.update({ invoice_status: 'APPROVED' }, { where: { id } })
        }

        return res.status(200).send({ code: 200, message: 'success', data: obj });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};

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