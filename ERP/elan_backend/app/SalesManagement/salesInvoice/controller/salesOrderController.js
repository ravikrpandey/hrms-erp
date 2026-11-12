const { x } = require("pdfkit");
const { sendPerformaInoviceReMail, sendMail, sendSOMail, generateInvoicePdf } = require("../../../CRM/utils/mail/mail");
const db = require("../../../models/index");
const employeeFunc = require("../../../../helpers/roleBaseAccessEmployee");
const { where } = require("sequelize");
const {
  insertProductData,
  insertGrossDiscountBreakup,
  insertGrossDiscount,
  insertPaymentTerm,
  insertCustomizationsAndBranding,
  insertCustomizationsAndBrandingWOD,
  insertApprovalWorkflow,
  destroyProposalData,
  insertInstallationKitBOM
} = require("../../../../app/CRM/CreateProposal/controllers/createProposalController");
const { Op, Sequelize } = require('sequelize');
const { manageInventoryLedger } = require('../../../../src/common/common.controller');
const mailQueue = require("../../../CRM/utils/mail/mailQueue");
const fs = require("fs");
const path = require("path");
const { generatePDF } = require("../../../common/pdfConverter");
const numberToWordsIndian = require("../../../CRM/utils/mail/writtenNumber");
module.exports.getSOByProposal = async (req, res) => {
  try {
    const { proposal_id, version_id } = req.params;

    // Basic proposal
    const [[proposal]] = await db.sequelize.query(`
     SELECT DISTINCT CSA.shipping_postal_address,
     CUT2.countryss_name AS shipping_country_name,
     STA2.states_name AS shipping_state_name, CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code,
     CSA.shipping_city_id,CSA.shipping_state_id,CSA.shipping_country_id,CSA.shipping_gst_category,CSA.shipping_gst_in,CV.shipping_address_id,
     C.created_by,
     C.warranty_month,
      C.delivery_term_remark,
      C.unloading_resp_remark,
      C.warranty_month_remark,
      C.valid_till_date,
      LS.lead_source,EMP.first_name,
      EMP.middle_name,
      EMP.last_name,
      PPI.pi_number,
      F.freight_name,I.insurance_name,
      PM.payment_name, SP.sub_payment_name,
      -- B.branch_name
      B.location_name AS branch_name,C.location_id
      ,CONCAT(W.name, ' - ',W.code) AS warehouse_name, W.address, W.pin, W.id AS warehouse_id,DT.delivery_term, UL.unloading,C.proposal_no, C.id, C.customer_id,
        CACM.email_id as mail_id, C.contact_person_id, CONCAT(CPM.company_name,' - ',CPM.customer_code) AS company_name, CACM.contact_person_name, CACM.mobile AS contact_number,
        PT.perposal_type, C.totalAMTAfterDiscount, C.discount, C.igst, CPM.gst_in AS gst_no, C.grant_total, SB.schedule_delivery_date,
        DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
      FROM CRM_CREATE_PROPOSAL_MST AS C
      INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
      LEFT JOIN MASTER_PERPOSAL_TYPE AS PT ON C.proposal_type_id = PT.id
      INNER JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
      LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CACM ON C.contact_person_id = CACM.id
      LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = ${proposal_id} AND PPI.version_id = ${version_id}
            -- LEFT JOIN MASTER_BRANCH AS B ON C.location_id = B.id
            LEFT JOIN LOCATION_MASTER AS B ON C.location_id = B.id
             LEFT JOIN WAREHOUSE_MASTER AS W ON C.warehouse_id = W.id
             LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS DT ON C.delivery_term_id = DT.id
              LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS UL ON C.unloading_resp_id = UL.id
              LEFT JOIN CRM_PAYMENT_MAIN_MST AS PM ON C.payment_main_id = PM.id
              LEFT JOIN CRM_SUB_PAYMENT_MAIN_MST AS SP ON C.sub_payment_main_id = SP.id
              LEFT JOIN CRM_FREIGHT_MST AS F ON C.freight_id = F.id
              LEFT JOIN CRM_INSURANCE_MST AS I ON C.insurance_id = I.id
              LEFT JOIN CRM_LEAD_SOURCE_MST AS LS ON C.lead_source_id = LS.id
              LEFT JOIN SALES_BOOKING AS SB ON C.id = SB.proposal_id
              LEFT JOIN HRMS_REGISTERED_USER AS EMP 
											    ON (
											        (C.created_by = 'self' AND C.employee_id = EMP.employee_id)
											        OR 
											        (C.created_by <> 'self' AND C.created_by_id = EMP.employee_id)
											    )
      INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON 
														PPI.version_id = CV.id 
              LEFT JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CSA ON CV.shipping_address_id = CSA.id
              
														  LEFT JOIN MASTER_COUNTRY AS CUT2 ON CSA.shipping_country_id = CUT2.countryss_id
              LEFT JOIN MASTER_STATE AS STA2 ON CSA.shipping_state_id = STA2.states_id
              LEFT JOIN MASTER_CITY AS CIT2 ON CSA.shipping_city_id = CIT2.city_id  
      WHERE C.id = ${proposal_id} ORDER BY C.id DESC
    `);

    // Full product list
    const [allResult] = await db.sequelize.query(`
      SELECT DISTINCT V.id AS Version_id, CP.id, CP.cgst, CP.price_per_unit, CP.igst, CP.sgst,
        CP.qty AS base_proposed_quantity, CP.proposal_id, CP.discount_request, CP.discount_approved,
        CP.promo_item, CP.apply_scheme, CP.scheme_id,CP.totalDiscountAmountPerQTY,
        P.id AS product_master_id, P.hsn_code_id, HSN.hsn_sac_code, P.item_name AS product_name, P.item_code AS product_code,
        P.description AS product_description,  T.uom_name, T.uom_id, CP.product_category_id, CP.pro_sub_cat_id
      FROM CRM_PROPOSAL_LIST_MST AS CP
      INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
      INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
      LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON P.hsn_code_id = HSN.id
      LEFT JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id
      INNER JOIN CRM_VERSION_PROPOSAL_MST AS V ON CP.version_id = V.id
      WHERE CP.proposal_id = ${proposal_id} AND V.id = ${version_id} AND V.is_so_created = 1
    `);

    let scheme_id = null;
    const flatItemList = [];

    // Process each proposal item
    for (const record of allResult) {
      const detailId = record.id;

      const [customisationTypeList] = await db.sequelize.query(`
        SELECT * FROM CRM_PROPOSAL_CUSTOMISATION_TYPE
        WHERE proposal_item_id = ${detailId}
      `);

      const [brandingList] = await db.sequelize.query(`
        SELECT * FROM CRM_PROPOSAL_BRANDING
        WHERE proposal_item_id = ${detailId}
      `);

      const combinations = [];

      if (customisationTypeList.length === 0 && brandingList.length === 0) {
        combinations.push({
          customization_type_id: null,
          branding_data_id: null,
          qty: record.base_proposed_quantity,
          select_scheme: [],
        });
      } else if (customisationTypeList.length && brandingList.length) {
        let afterCustomizeQty = record.base_proposed_quantity;
        for (const c of customisationTypeList) {
          const brandingIndex = brandingList.findIndex(
            (b) => b.proposal_customisation_id === c.id
          );
          const matchingBranding =
            brandingIndex !== -1 ? brandingList[brandingIndex] : null;

          combinations.push({
            customization_type_id: c.id,
            branding_data_id: matchingBranding?.id || null,
            qty: c.qty,
            select_scheme: c.select_scheme,
          });
          afterCustomizeQty = afterCustomizeQty - c.qty;
        }
        if (afterCustomizeQty > 0) {
          combinations.push({
            customization_type_id: null,
            branding_data_id: null,
            qty: afterCustomizeQty,
            select_scheme: [],
          });
        }
      } else if (customisationTypeList.length) {
        let afterCustomizeQty = record.base_proposed_quantity;
        for (const c of customisationTypeList) {
          combinations.push({
            customization_type_id: c.id,
            branding_data_id: null,
            qty: c.qty,
            select_scheme: c.select_scheme,
          });
          afterCustomizeQty = afterCustomizeQty - c.qty;
        }
        if (afterCustomizeQty > 0) {
          combinations.push({
            customization_type_id: null,
            branding_data_id: null,
            qty: afterCustomizeQty,
            select_scheme: [],
          });
        }
      } else if (brandingList.length) {
        for (const b of brandingList) {
          if (customisationTypeList.length > 0) {
            // const custom = customisationTypeList.find(value => value.)
          }
          combinations.push({
            customization_type_id: null,
            branding_data_id: b.id,
            qty: b.qty,
          });
        }
      }

      for (const comb of combinations) {
        const [customisationData] = comb.customization_type_id
          ? await db.sequelize.query(`
             SELECT  ACC.accessories_name,CPD.*,BS.type_of_basket, MA.asset_category_name, 0 AS dispatchQty,
             COALESCE(HSNA.hsn_sac_code, HSNB.hsn_sac_code) AS hsn_code, MIA.id AS accessory_item_id, MIA.item_code AS acc_item_code,
             COALESCE(UOMA.uom_name, UOMB.uom_name) AS uom_name, MIB.id AS basket_item_id, MIB.item_code AS bas_item_code
              FROM CRM_PROPOSAL_CUSTOMISATION_DATA AS CPD
              LEFT JOIN MASTER_ACCESSORIES_NAME AS ACC ON CPD.accessory_in_name = ACC.id
              LEFT JOIN MASTER_ITEM AS MIA ON MIA.accessory_id = CPD.accessory_in_name
              LEFT JOIN MASTER_ASSET AS MA ON MA.id = CPD.accessory_in_category
              LEFT JOIN MASTER_BASKET AS BS ON CPD.basket_mst_id=BS.id
              LEFT JOIN MASTER_ITEM AS MIB ON MIB.basket_id = CPD.basket_mst_id
              LEFT JOIN MASTER_HSN_SAC_CODE AS HSNA ON HSNA.id = ACC.hsn_code_id
              LEFT JOIN MASTER_HSN_SAC_CODE AS HSNB ON HSNB.id = BS.hsn_code_id
              LEFT JOIN MASTER_UOM AS UOMA ON UOMA.uom_id = ACC.uom_id
              LEFT JOIN MASTER_UOM AS UOMB ON UOMB.uom_id = BS.uom_id
              WHERE CPD.proposal_customisation_id =  ${comb.customization_type_id}
            `)
          : [[]];

        const [brandingData] = comb.branding_data_id
          ? await db.sequelize.query(`
              SELECT HSN.hsn_sac_code,PB.*,MB.type_of_branding AS brandingName FROM CRM_PROPOSAL_BRANDING AS PB 
														INNER JOIN MASTER_BRANDING AS MB ON PB.branding_mst_id = MB.id
														  JOIN MASTER_HSN_SAC_CODE AS HSN ON MB.hsn_code_id=HSN.id WHERE PB.id = ${comb.branding_data_id}
            `)
          : [[]];

        const custom_branding = [];

        if (comb.customization_type_id) {
          const matchingCustomization = customisationTypeList.find(
            (c) => c.id === comb.customization_type_id
          );
          custom_branding.push({
            ...matchingCustomization,
            customisation_data: customisationData || [],
            branding_data: comb.branding_data_id ? brandingData : null,
          });
        } else if (comb.branding_data_id) {
          custom_branding.push({
            customisation_data: [],
            branding_data: brandingData,
          });
        } else {
          custom_branding.push({
            customisation_data: [],
            branding_data: null,
          });
        }

        flatItemList.push({
          ...record,
          proposed_quantity: comb.qty,
          customization_type_id: comb.customization_type_id,
          branding_data_id: comb.branding_data_id,
          select_scheme: comb.select_scheme,
          customisation: customisationTypeList.length
            ? customisationTypeList
            : null,
          customisation_data: customisationData || null,
          branding_data: brandingData || null,
          custom_branding,
        });

        if (record.scheme_id && !scheme_id) scheme_id = record.scheme_id;
      }
    }

    // SO item delivered qty map
    const [soItemList] = await db.sequelize.query(`
      SELECT SO.*, SOI.* FROM SALES_ORDER_MST AS SO
      INNER JOIN SALES_ORDER_ITEM_LIST_NEW AS SOI ON SOI.sales_order_id = SO.id
      WHERE SO.proposal_id = ${proposal_id} AND SO.version_id = ${version_id} AND SOI.parent_item_id IS NULL
    `);

    const soItemMap = {};

    soItemList.forEach(soItem => {
      const key = `${soItem.item_id}_${soItem.item_type}`;

      if (!soItemMap[key]) {
        soItemMap[key] = 0;
      }

      soItemMap[key] += Number(soItem.qty || 0);
    });

    const updatedFlatItemList = flatItemList.map(item => {
      const hasCustomization =
        item.customisation_data &&
        item.customisation_data.length > 0;

      const hasBranding =
        item.branding_data &&
        item.branding_data.length > 0;

      let item_type = 'Standard';

      if (hasCustomization && hasBranding) {
        item_type = 'Customization & Branding';
      } else if (hasCustomization) {
        item_type = 'Customization';
      } else if (hasBranding) {
        item_type = 'Branding';
      }

      const key = `${item.product_master_id}_${item_type}`;

      const delivered_qty = soItemMap[key] || 0;

      return {
        ...item,
        item_type,
        delivered_qty,
        remaining_quantity: Math.max(
          0,
          Number(item.proposed_quantity || 0) - delivered_qty
        )
      };
    });

    const getAllItemIds = await db.proposalList.findAll({ where: { proposal_id, version_id }, attributes: ["id"] });
    const itemIds = getAllItemIds.map(item => item.id);

    // 1. BOM Fetch
    const bomArray = await db.SALESCRM_BOM_KIT.findAll({
      where: {
        item_list_id: {
          [Op.in]: itemIds
        }
      },
      include: [
        {
          model: db.proposalList,
          as: "proposal",
          attributes: ['id', 'product_master_id'],
          include: [
            {
              model: db.ItemMaster,
              attributes: ['item_name', 'item_code']
            }
          ]
        },
        {
          model: db.SALESCRM_BOM_KIT_ITEM,
          as: "items",
          include: [
            {
              model: db.BOM_KIT_ITEM,
              as: "bomItem",
              include: [
                {
                  model: db.ItemMaster,
                  as: "itemMaster",
                  attributes: ['id', 'item_name', 'item_code']
                },
                {
                  model: db.BOM_KIT_SUBSTITUTE_ITEM,
                  as: "substituteItems",
                  include: [
                    {
                      model: db.ItemMaster,
                      as: "itemSubstitute",
                      attributes: ['id', 'item_name', 'item_code']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    // 2. Dispatch Qty Fetch  <-- YAHAN LAGANA HAI
    const bomDispatchData = await db.salesOrderItemNew.findAll({
      attributes: [
        "bom_id",
        [
          Sequelize.fn("SUM", Sequelize.col("qty")),
          "dispatch_qty"
        ]
      ],
      where: {
        bom_id: {
          [Op.ne]: null
        },
        item_type: "Kit"
      },
      group: ["bom_id"],
      raw: true
    });

    const bomDispatchMap = {};

    bomDispatchData.forEach(x => {
      bomDispatchMap[x.bom_id] = Number(x.dispatch_qty);
    });

    // 3. Final Mapping
    const finalBomArray = bomArray.map(bom => {
      const item = bom.proposal?.MASTER_ITEM;

      const dispatchQty = bomDispatchMap[bom.id] || 0;
      const pendingQty = bom.bom_qty - dispatchQty;

      return {
        ...bom.toJSON(),
        item_name: item
          ? `${item.item_name}${item.item_code ? ` - ${item.item_code}` : ""}`
          : "", // Main Quotation Item
        dispatch_qty: dispatchQty,
        pending_qty: pendingQty,
        bom_item_count: bom.items?.length || 0,
        bom_items: bom.items.map(x => ({
          id: x.id,
          bom_item_id: x.bom_item_id,
          qty_per_bom: x.qty_per_bom,
          total_qty: x.qty_per_bom * bom.bom_qty,
          item_id: x.bomItem?.itemMaster.id,
          item_name: x.bomItem?.itemMaster
            ? `${x.bomItem.itemMaster.item_name}${x.bomItem.itemMaster.item_code
              ? ` - ${x.bomItem.itemMaster.item_code}`
              : ""
            }`
            : "",
          substitute_items: (x.bomItem?.substituteItems || []).map(s => ({
            id: s.id,
            item_id: s.itemSubstitute?.id,
            item_name: s.itemSubstitute
              ? `${s.itemSubstitute.item_name}${s.itemSubstitute.item_code
                ? ` - ${s.itemSubstitute.item_code}`
                : ""
              }`
              : ""
          }))
        }))
      };
    });

    // 4. Response
    const transformedResult = {
      ...proposal,
      scheme_id,
      productDetailList: updatedFlatItemList,
      bomArray: finalBomArray
    };

    const { updatedData, stockSummary } = await fetchStock(transformedResult);
    updatedData.stockSummary = stockSummary;
    return res.status(200).json({ code: 200, message: "Success", data: updatedData });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

async function generateSalesOrderNumber2(financial_id) {
  try {
    const financial_year_id = financial_id;
    const financialYearEntry = await db.financial_year.findOne({
      where: { id: financial_year_id },
      attributes: ["financial_year"],
    });

    const financialYear = financialYearEntry.financial_year;
    const lastEntry = await db.salesOrder.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["sales_order_no"],
    });
    let number;
    if (lastEntry) {
      const lastCode = parseInt(lastEntry.sales_order_no.split("/").pop());
      const newCode = lastCode + 1;
      number = `SO/${financialYear}/${newCode.toString().padStart(4, "0")}`;
    } else {
      number = `SO/${financialYear}/0001`;
    }

    return number;
  } catch (error) { }
}

module.exports.createSalesOrder = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      customer_id,
      company_name,
      financial_id,
      entity_id,
      proposal_id,
      sales_order_no,
      scheme_id,
      sales_order_date,
      notes,
      terms_and_conditions,
      // items,
      version_id,
      selectedItems,
      selectedBoms,
      contact_person_name,
      mobile,
      email_id,
      pincode,
      postal_address,
      address,
      expected_delivery_date,
      contact_person_id,
      elan_sales_order_no,
      elan_so_date,
      warehouse_id,
      warehouse_name,
      loginEmployee,
      shippingAddressArray
    } = req.body;

    if (
      !customer_id ||
      !financial_id ||
      !entity_id ||
      !proposal_id ||
      !sales_order_date ||
      !elan_sales_order_no ||
      !elan_so_date
    ) {
      return res.status(400).send({ code: 400, message: "All fields are required." });
    }

    const stockValidation = await validateDispatchStock(selectedItems, selectedBoms, warehouse_id);

    if (!stockValidation.valid) {
      return res.status(422).json({
        code: 422,
        message: "Stock has changed. Please refresh and try again.",
        data: stockValidation.insufficientItems
      });
    }

    let isExistElanSO = await db.salesOrder.findOne({
      where: { elan_sales_order_no: elan_sales_order_no },
    });
    if (isExistElanSO) {
      return res.status(400).send({ code: 400, message: "Elan SO No. already exist, Please try another" });
    }

    let shipping_address = shippingAddressArray.shipping_address;
    let shipping_pin_code = shippingAddressArray.shipping_pin_code;
    let shipping_postal_address = shippingAddressArray.shipping_postal_address;
    let shipping_address_id = shippingAddressArray.shipping_address_id;
    let shipping_city_id = shippingAddressArray.shipping_city_id;

    const city = shipping_postal_address.split(',')[1]?.trim() || '';

    const masterCity = await db.city.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn('LOWER', db.Sequelize.col('city_name')),
        city.toLowerCase()
      ),
      include: [{ model: db.states }]
    });

    if (!masterCity) {
      await t.rollback();
      return res.status(400).send({ code: 400, message: `Shipping city '${city}' does not exist. Please create it in City Master first.` });
    }

    let shippingAddress = await db.customerShippingAddress.findOne({
      where: {
        shipping_state_id: masterCity.states_id,
        shipping_city_id: masterCity.city_id,
        shipping_postal_address: shipping_postal_address,
        shipping_address: shipping_address,
        shipping_pin_code: shipping_pin_code,
        customer_id
      }
    });

    if (!shippingAddress) {
      shippingAddress = await db.customerShippingAddress.create({
        shipping_country_id: masterCity.MASTER_STATE?.countryss_id,
        shipping_state_id: masterCity.states_id,
        shipping_city_id: masterCity.city_id,
        shipping_postal_address: shipping_postal_address,
        shipping_address: shipping_address,
        shipping_pin_code: shipping_pin_code,
        customer_id
      });
    }

    shipping_city_id = masterCity.city_id;
    shipping_address_id = shippingAddress.id;

    const financialYearEntry = await db.financial_year.findOne({
      where: { id: financial_id },
      attributes: ["financial_year"],
      transaction: t,
    });

    if (!financialYearEntry) {
      await t.rollback();
      return res.status(400).send({ code: 400, message: "Invalid financial year ID" });
    }

    const financialYear = financialYearEntry.financial_year;

    let count = await db.salesOrder.count({
      where: { financial_id: financial_id },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    let newSalesOrderNo = `SO/${financialYear}/${(parseInt(count) + 1).toString().padStart(4, "0")}`;

    let expected_delivery_days = await db.expectedDays.findOne({
      where: { status: "ACTIVE" },
    });

    const deliveryDays = expected_delivery_days?.days ?? 3;

    const soCreated = await db.salesOrder.create(
      {
        customer_id,
        financial_id,
        entity_id,
        elan_sales_order_no,
        elan_so_date,
        proposal_id,
        sales_order_no: newSalesOrderNo,
        sales_order_date,
        version_id,
        notes,
        terms_and_conditions,
        expected_delivery_days: deliveryDays,
        expected_delivery_date: expected_delivery_date,
        pincode: shipping_pin_code,
        postal_address: shipping_postal_address,
        address: shipping_address,
        shipping_address_id: shipping_address_id,
        customer_contact_id: contact_person_id,
        city_id: shipping_city_id,
        warehouse_id
      },
      { transaction: t }
    );

    if (!soCreated) {
      await t.rollback();
      return res.status(500).send({ code: 500, message: "Failed to create sales order." });
    }

    // 1. Main Items Create
    const mainItems = selectedItems
      .filter(item => item.quantity > 0)
      .map(item => ({
        sales_order_id: soCreated.id,
        item_list_id: item.item_list_id,
        parent_item_id: null,
        item_type: item.item_type,
        item_name: item.product_name,
        item_code: item.product_code,
        item_description: item.product_description,
        item_id: item.product_master_id,
        branding_id: null,
        qty: item.quantity,
        price_per_unit: item.price_per_unit,
        discount_per_unit: item.totalDiscountAmountPerQTY,
        igst: item.gst_per,
        sgst: item.gst_per / 2,
        cgst: item.gst_per / 2,
        hsncode: item.hsn_code,
        UOM: item.uom_name
      }));

    const createdMainItems = await db.salesOrderItemNew.bulkCreate(mainItems, { transaction: t, returning: true });

    const brandingItems = [];

    createdMainItems.forEach((createdItem, index) => {
      const originalItem = selectedItems[index];

      if (
        originalItem.branding_data &&
        Array.isArray(originalItem.branding_data)
      ) {
        originalItem.branding_data.forEach((branding) => {
          brandingItems.push({
            sales_order_id: soCreated.id,
            parent_item_id: createdItem.id,
            item_type: 'Branding',
            item_name: `${branding.branding_description} - ${branding.brandingName}`,
            item_code: null,
            item_description: `${branding.branding_sides?.join(', ') || ''}`,
            item_id: null,
            branding_id: branding.branding_mst_id,
            qty: createdItem.qty,
            price_per_unit: branding.branding_amt || 0,
            discount_per_unit: branding.totalDiscountAmountPerQTY || 0,
            igst: branding.gst,
            sgst: branding.gst / 2,
            cgst: branding.gst / 2,
            hsncode: branding.hsn_sac_code,
            UOM: null
          });
        });
      }
    });

    if (brandingItems.length) {
      await db.salesOrderItemNew.bulkCreate(brandingItems, { transaction: t });
    }

    const customizationItems = [];

    createdMainItems.forEach((createdItem, index) => {
      const originalItem = selectedItems[index];

      if (
        originalItem.customisation_data &&
        Array.isArray(originalItem.customisation_data)
      ) {
        originalItem.customisation_data.forEach((custom) => {
          customizationItems.push({
            sales_order_id: soCreated.id,
            parent_item_id: createdItem.id,
            item_type: custom.custome_type, // Accessories / Baskets
            item_name: custom.accessories_name || custom.type_of_basket,
            item_code: custom.acc_item_code || custom.bas_item_code,
            item_description: null,
            item_id: custom.accessory_item_id || custom.basket_item_id,
            branding_id: null,
            qty: custom.dispatchQty,
            price_per_unit: custom.price_per_unit,
            discount_per_unit: custom.totalDiscountAmountPerQTY || 0,
            igst: custom.gst,
            sgst: custom.gst / 2,
            cgst: custom.gst / 2,
            hsncode: custom.hsn_code,
            UOM: custom.uom_name
          });
        });
      }
    });

    if (customizationItems.length) {
      await db.salesOrderItemNew.bulkCreate(customizationItems, { transaction: t });
    }

    // 1. Prepare BOM Parents
    const bomItems = [];

    selectedBoms.forEach((bom) => {

      if (Number(bom.enterDispatchQty) <= 0) return;

      bomItems.push({
        sales_order_id: soCreated.id,
        item_list_id: bom.item_list_id,
        parent_item_id: null,
        item_type: 'Kit',
        item_name: bom.bom_name,
        item_code: null,
        item_description: null,
        item_id: null,
        bom_id: bom.id,
        branding_id: null,
        qty: Number(bom.enterDispatchQty),
        price_per_unit: Number(bom.price_per_unit || 0),
        discount_per_unit: Number(bom.totalDiscountAmountPerQTY || 0),
        igst: Number(bom.gst || 0),
        sgst: Number(bom.gst || 0) / 2,
        cgst: Number(bom.gst || 0) / 2,
        hsncode: bom.hsn_code,
        UOM: null
      });

    });

    // 2. Save BOM Parents
    const createdBomItems = await db.salesOrderItemNew.bulkCreate(bomItems, {
      transaction: t,
      returning: true
    });

    // 3. Prepare Children
    const bomChildItems = [];

    createdBomItems.forEach((createdBom, index) => {

      const bom = selectedBoms[index];

      (bom.bom_items || []).forEach((primary) => {

        const hasPrimary = Number(primary.dispatchQty) > 0;
        const hasSubstitute = (primary.substitute_items || [])
          .some(sub => Number(sub.dispatchQty) > 0);

        if (!hasPrimary && !hasSubstitute) return;

        // Primary
        if (hasPrimary) {
          bomChildItems.push({
            sales_order_id: soCreated.id,
            item_list_id: bom.item_list_id,
            parent_item_id: createdBom.id,
            item_type: 'Primary Item',
            item_name: primary.item_name,
            item_code: null,
            item_description: null,
            item_id: primary.item_id,
            bom_id: bom.id,
            bom_item_id: primary.id,
            branding_id: null,
            qty: Number(primary.dispatchQty),
            price_per_unit: 0,
            discount_per_unit: 0,
            igst: 0,
            sgst: 0,
            cgst: 0,
            hsncode: null,
            UOM: null
          });
        }

        // Substitute
        (primary.substitute_items || [])
          .filter(sub => Number(sub.dispatchQty) > 0)
          .forEach(sub => {

            bomChildItems.push({
              sales_order_id: soCreated.id,
              item_list_id: bom.item_list_id,
              parent_item_id: createdBom.id,
              item_type: 'Substitute Item',
              item_name: sub.item_name,
              item_code: null,
              item_description: null,
              item_id: sub.item_id,
              bom_id: bom.id,
              bom_item_id: primary.id,
              branding_id: null,
              qty: Number(sub.dispatchQty),
              price_per_unit: 0,
              discount_per_unit: 0,
              igst: 0,
              sgst: 0,
              cgst: 0,
              hsncode: null,
              UOM: null
            });
          });
      });
    });

    // 4. Save Children
    if (bomChildItems.length) {
      await db.salesOrderItemNew.bulkCreate(bomChildItems, {
        transaction: t
      });
    }

    // use for mail
    let itemHtml = '';
    itemHtml = createdMainItems.map(mainItem => {

      const brandingRows = brandingItems
        .filter(b => b.parent_item_id === mainItem.id)
        .map(b => `
          <tr>
            <td style="padding-left:30px;">↳ Branding</td>
            <td>${b.item_name}</td>
            <td>${b.qty}</td>
            <td>${b.price_per_unit}</td>
          </tr>
        `).join('');

      const customizationRows = customizationItems
        .filter(c => c.parent_item_id === mainItem.id)
        .map(c => `
          <tr>
            <td style="padding-left:30px;">↳ ${c.item_type}</td>
            <td>${c.item_name}</td>
            <td>${c.qty}</td>
            <td>${c.price_per_unit}</td>
          </tr>
        `).join('');

      return `
        <tr style="background:#f5f5f5;font-weight:bold;">
          <td>${mainItem.item_type}</td>
          <td>${mainItem.item_name}</td>
          <td>${mainItem.qty}</td>
          <td>${mainItem.price_per_unit}</td>
        </tr>

        ${brandingRows}
        ${customizationRows}
      `;
    }).join('');


    soCreated.warehouse_id = warehouse_id;
    soCreated.loginEmployee = loginEmployee;
    await manageInventoryLedger(soCreated, 'SO', t);

    const salesOrderNo = newSalesOrderNo;
    const deliveryAddress = [shipping_address, shipping_postal_address, shipping_pin_code].filter(Boolean).join(' ');

    const deliveryDate = expected_delivery_date;

    const [customerRows] = await db.sequelize.query(`
      SELECT
        C.id,
        C.company_name AS name,
        COALESCE(CA.email_id, 'hr@kiranautomation.com') AS email
      FROM CUSTOMER_PROFILE_MST AS C
      LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CA
        ON CA.customer_id = C.id
        AND CA.email_id IS NOT NULL
        AND CA.email_id <> ''
      WHERE C.id = ${customer_id}
      LIMIT 1
    `);

    const customerDetails = customerRows?.[0] || null;

    if (customerDetails?.email) {
      sendSOMail(entity_id, customerDetails.name, customerDetails.email, salesOrderNo, itemHtml, deliveryAddress, deliveryDate);
    }

    const [salesPersonRows] = await db.sequelize.query(`
      SELECT
        C.id, C.employee_id,
        CONCAT_WS(' ', CA.title, CA.first_name) AS name, CA.employee_official_email AS email
      FROM CRM_CREATE_PROPOSAL_MST AS C
      INNER JOIN HRMS_REGISTERED_USER AS CA
        ON CA.employee_id = C.employee_id
      WHERE C.id = ${proposal_id}
    `);

    const salesperson = salesPersonRows?.[0] || null;

    if (salesperson?.email) {
      sendSOMail(entity_id, salesperson.name, salesperson.email, salesOrderNo, itemHtml, deliveryAddress, deliveryDate);
    }

    await t.commit();
    return res.status(201).send({ code: 201, message: "Sales orders created successfully" });
  } catch (error) {
    await t.rollback();
    // console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getSOHistory = async (req, res) => {
  try {

    const proposal_id = req.params.proposal_id;

    let proposalDetails = {};

    if (proposal_id > 0) {

      const dataExist = await db.salesOrder.findOne({
        where: { proposal_id }
      });

      if (!dataExist) {
        return res.status(200).send({
          code: 404,
          message: "No record available",
          data: []
        });
      }

      const [proposalData] = await db.sequelize.query(`
        SELECT
          PT.perposal_type,
          CP.*,
          CPM.company_name,
          CAM.billing_address AS address,
          CAM.billing_pin_code AS pincode,
          CAM.billing_country_id AS country_id,
          CAM.billing_state_id AS state_id,
          CAM.billing_city_id AS city_id,
          CACM.contact_person_name,
          CACM.mobile AS contact_number,
          CACM.email_id AS mail_id
        FROM CRM_CREATE_PROPOSAL_MST AS CP
        LEFT JOIN CUSTOMER_PROFILE_MST AS CPM
          ON CP.parent_customer_id = CPM.id
        LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM
          ON CAM.customer_id = CP.customer_id
        LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CACM
          ON CP.contact_person_id = CACM.id
        INNER JOIN MASTER_PERPOSAL_TYPE AS PT
          ON CP.proposal_type_id = PT.id
        WHERE CP.id = :proposal_id
      `, {
        replacements: { proposal_id }
      });

      proposalDetails = proposalData[0] || {};
    }

    const whereCondition = proposal_id > 0
      ? `WHERE CA.proposal_id = :proposal_id`
      : '';

    const [result] = await db.sequelize.query(`
      SELECT
        CA.*,
        COALESCE(SUM(C.qty), 0) AS total_delivered_quantity,
        CONCAT_WS(', ', CA.address, CA.postal_address, CA.pincode) AS delivery_address,
        CASE
        WHEN EXISTS (
            SELECT 1
            FROM CRM_SALES_INVOICE_MST SI
            WHERE SI.so_id = CA.id
              AND SI.invoice_status = 'APPROVED'
        ) THEN 'APPROVED'
        ELSE 'PENDING'
    END AS so_invoice_status
      FROM SALES_ORDER_MST AS CA
      INNER JOIN SALES_ORDER_ITEM_LIST_NEW AS C
        ON C.sales_order_id = CA.id
        AND C.parent_item_id IS NULL
      ${whereCondition}
      GROUP BY CA.id
      ORDER BY CA.id DESC
    `, {
      replacements: proposal_id ? { proposal_id } : {}
    });

    return res.status(200).send({
      code: 200,
      message: "Record fetched successfully",
      data: result,
      proposalDetails,
      proposal_id: proposal_id || null
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};

exports.generateSalesOrderNumber = async (req, res) => {
  try {
    const financial_year_id = req.params.financial_year_id;
    const financialYearEntry = await db.financial_year.findOne({
      where: { id: financial_year_id },
      attributes: ["financial_year"],
    });
    if (!financialYearEntry) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid financial year ID" });
    }
    const financialYear = financialYearEntry.financial_year;
    const lastEntry = await db.salesOrder.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["sales_order_no"],
    });
    let number;
    if (lastEntry) {
      const lastCode = parseInt(lastEntry.sales_order_no.split("/").pop());
      const newCode = lastCode + 1;
      number = `SO/${financialYear}/${newCode.toString().padStart(4, "0")}`;
    } else {
      number = `SO/${financialYear}/0001`;
    }

    return res.status(200).send({
      code: 200,
      message: "Sales Order Number Generated",
      data: number,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

module.exports.getAllSOList = async (req, res) => {
  try {
    const { login_id, role_master_id, status } = req.query;
    let dynamicallyColumns = ``;
    if (!login_id || !role_master_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing login_id or role_master_id" });
    }

    // Prepare condition based on role
    let whereCondition = `C.proposal_status = 'approved' AND PPI.approvel_status = "APPROVED"`;
    if (parseInt(role_master_id) !== 1) {
      if (parseInt(role_master_id) !== 7) {
        let empid = await employeeFunc.getEmployee(login_id);
        if (empid.loginIds) {
          const loginIdArray = empid.loginIds.split(",").map((id) => id.trim());

          const allIds = [...loginIdArray, login_id];

          whereCondition = `C.employee_id IN (${allIds
            .map((id) => `'${id}'`)
            .join(",")})`;
        }
      }
    }
    let havingCaluse = ``;
    switch (status) {
      case "0": // In Process List
        dynamicallyColumns = `MAX(ACT.sales_reason) AS salesReason,`;
        whereCondition += ` AND PPI.proposal_version_status !='REJECTED'`;
        havingCaluse = `HAVING COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) < 1`;
        break;
      case "1": // Partially List
        dynamicallyColumns = `MAX(ACT.sales_reason) AS salesReason,`;
        whereCondition += ` AND PPI.proposal_version_status !='REJECTED'`;
        havingCaluse = ` HAVING COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) > 0 AND
                        COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) - COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) > 0`;
        break;
      case "2": // Completed List
        dynamicallyColumns = `MAX(ACT.sales_reason) AS salesReason, 'completed' AS completedStatus,`;
        whereCondition += `-- AND PPI.proposal_version_status !='REJECTED'`;
        // havingCaluse = ` HAVING COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) - COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) = 0 OR 
        //  COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) - COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) >0 AND
        //   COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) >0`;
        havingCaluse = `HAVING COALESCE(CAST(PQ.total_proposed_qty AS SIGNED),0) = COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED),0)`;
        break;
      case "3": // Rejected List
        dynamicallyColumns = `MAX(PPI.version_rejected_remark) AS salesReason,`;
        whereCondition += ` AND PPI.proposal_version_status ='REJECTED'`;
        // havingCaluse = `COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) - COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) = 0`;
        break;

      default:
        break;
    }
    const [dataList] = await db.sequelize.query(`
      WITH DeliveredQuantities AS (
          SELECT
              CA.proposal_id,
              SUM(C.qty) AS cumulative_delivered_qty
          FROM SALES_ORDER_ITEM_LIST_NEW AS C
          INNER JOIN SALES_ORDER_MST AS CA ON C.sales_order_id = CA.id
          WHERE C.parent_item_id IS NULL
          GROUP BY CA.proposal_id
      ),
      BomQty AS (
          SELECT
              PL.proposal_id,
              SUM(BK.bom_qty) AS bom_qty
          FROM CRM_PROPOSAL_LIST_MST PL
          INNER JOIN CRM_VERSION_PROPOSAL_MST V
              ON V.id = PL.version_id
          LEFT JOIN CRM_PROPOSAL_LIST_MST_BOM_KIT BK
              ON BK.item_list_id = PL.id
          WHERE V.is_so_created = 1
          GROUP BY PL.proposal_id
      ),
      ProposedQuantities AS (
          SELECT
              PL.proposal_id,
              SUM(PL.qty) + COALESCE(B.bom_qty, 0) AS total_proposed_qty
          FROM CRM_PROPOSAL_LIST_MST AS PL
          LEFT JOIN BomQty B
        ON B.proposal_id = PL.proposal_id
          INNER JOIN CRM_VERSION_PROPOSAL_MST AS V ON V.id = PL.version_id
          WHERE V.is_so_created = 1
          GROUP BY PL.proposal_id
      ),
      LatestVersions AS (
          SELECT
              proposal_id,
              MAX(id) AS latest_version_id
          FROM CRM_VERSION_PROPOSAL_MST
          WHERE is_so_created = 1
          GROUP BY proposal_id
      ),
      ActiveStatus AS (
    SELECT
        PS.version_id,
        PS.remark,
        MSR.sales_reason
    FROM SALES_SO_PROGRESS_STATUS PS
    INNER JOIN MASTER_SALES_REASON MSR ON PS.resion_id = MSR.id
    WHERE PS.status = 'active'
)
      SELECT

          MAX(PPI.proposal_version_status) AS proposal_version_status,
         MAX(ACT.remark) AS remark,
         ${dynamicallyColumns}
   -- MAX(ACT.sales_reason) AS salesReason,
          V.id AS version_id,
          V.currency_id AS currency_id,
          C.id AS proposal_id,
          CONCAT(hru.first_name, ' ', hru.last_name) AS lead_owner,
          MAX(PPI.so_status) AS so_status,
          MAX(PPI.version_id),
          MAX(PPI.email_status) AS email_status,
          MAX(PPI.id) AS pi_id,
         -- MAX(PPI.version_rejected_remark) AS versionRejectedRemark,
          CPM.company_name, 
          MAX(PPI.pi_number)AS pi_number,
          V.version,
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
      INNER JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
      INNER JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = C.id AND PPI.version_id = V.id
      LEFT JOIN ActiveStatus AS ACT ON V.id = ACT.version_id
      LEFT JOIN HRMS_REGISTERED_USER AS hru ON hru.employee_id = C.employee_id
      WHERE ${whereCondition}
      GROUP BY
          V.id, C.id, C.lead_owner, C.company_name, C.proposal_no, C.createdAt,
          C.grant_total, DQ.cumulative_delivered_qty, PQ.total_proposed_qty
           ${havingCaluse}
      ORDER BY C.id DESC;
    `);

    if (parseInt(role_master_id) !== 1 && dataList.length === 0) {
      return res
        .status(200)
        .send({ code: 403, message: "Access denied", data: [] });
    }
    const currencyData = await db.currency_convert.findAll();

    return res.status(200).send({
      code: dataList.length > 0 ? 200 : 404,
      message: dataList.length > 0 ? "success" : "no data found",
      data: dataList,
      currencyData: currencyData

    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getSOFORDispatch = async (req, res) => {
  try {
    let status = req.params.status;
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 5);
    const organization_id = req.user?.organization_id ?? null;
    const x = futureDate.toISOString().split("T")[0];
    console.log(x);

    let condition = ``;
    let dynamicInnerJoin = ``;
    let dynamicColumns = "";
    if (status == 0) {
      dynamicColumns = `,'edit' AS status`;
      condition = `SO.is_dispatched = 0
    AND SO.is_proceed_to_dispatched = 0
    AND SO.expected_delivery_date <= DATE_ADD(CURDATE(), INTERVAL SO.expected_delivery_days DAY) `;
    } else if (status == 1) {
      // dynamicColumns=`,'customisation' AS status`
      condition = `SO.is_dispatched = 0 
            AND SO.is_proceed_to_dispatched=0 
            AND EXISTS (
            SELECT 1
            FROM SALES_ORDER_ITEM_LIST_NEW X
            WHERE X.sales_order_id = SO.id
            AND X.item_type NOT IN ('Standard', 'Kit', 'Primary Item', 'Substitute Item')
         )
              `;
    } else if (status == 2) {
      dynamicColumns = `,'isFuture' AS status`;
      condition = `SO.is_dispatched = 0
    AND SO.is_proceed_to_dispatched = 0
    AND SO.expected_delivery_date >= DATE_ADD(CURDATE(), INTERVAL SO.expected_delivery_days DAY)`;
    } else if (status == 3) {
      dynamicColumns = `,'proceedToDispatch' AS status, MAX(VP.gate_outward_status) AS gate_outward_status,MAX(VP2.planning_code) AS planning_code`;
      condition = ` SO.is_dispatched =1 
            AND SO.is_proceed_to_dispatched=1 AND
            SO.dispatch_status !='APPROVED'
            `;

      dynamicInnerJoin = `
            LEFT JOIN WH_VH_PLANNING_SO AS VPM
             ON SO.id=VPM.sale_order_id
            LEFT JOIN WH_VH_PLANNING_GATEIN_OUT AS VP
             ON VPM.planning_id = VP.vehicle_planing_id
            LEFT JOIN WH_VH_PLANNING_MST AS VP2 
					   ON VPM.planning_id = VP2.id
            `;
    }

    let [data] = await db.sequelize.query(`
           SELECT 
              	MAX(WH.organization_id) AS organization_id,
              	MAX(P.warehouse_id) AS warehouse_id,
                MAX(SO.address) AS address ,
                GROUP_CONCAT(SOI.item_id) AS item_id,
                GROUP_CONCAT(SOI.sales_order_id) AS sales_order_ids,
                SUM(SOI.qty) AS total_quantity,
                MAX(P.proposal_no) AS proposal_no,
                MAX(P.id) AS proposal_id,
                MAX(CU.company_name) AS company_name,
                MAX(CA.contact_person_name) AS contact_person_name,
                MAX(SO.sales_order_no) AS sales_order_no,
                MAX(SO.id) AS salesOrderId,
                MAX(SO.expected_delivery_date) AS expected_delivery_date,
                MAX(SO.sales_order_date) AS sales_order_date,
                MAX(SO.customisation_branding_date) AS customisationDate,
                MAX(SO.is_dispatched) AS is_dispatched,
                MAX(SOINV.sales_invoice_no) AS sales_invoice_no,
                MAX(SO.pod_remark) AS pod_remark,
                MAX(SO.dispatch_status) AS dispatch_status,
                MAX(SO.delivered_on_date) AS delivered_on_date
                ${dynamicColumns}
            FROM SALES_ORDER_ITEM_LIST_NEW AS SOI
            INNER JOIN SALES_ORDER_MST AS SO
                ON SOI.sales_order_id = SO.id
            LEFT JOIN CRM_SALES_INVOICE_MST AS SOINV ON SOINV.so_id = SO.id
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS P
                ON SO.proposal_id = P.id
            INNER JOIN CUSTOMER_PROFILE_MST AS CU 
                ON P.customer_id = CU.id
            INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CA 
                ON P.contact_person_id = CA.id
            INNER JOIN  CRM_PROPOSAL_LIST_MST AS PI 
                ON P.id = PI.proposal_id
            LEFT JOIN  CRM_PROPOSAL_BRANDING AS PB 
                ON PI.id = PB.proposal_item_id
            LEFT JOIN  CRM_PROPOSAL_CUSTOMISATION_TYPE AS PC 
                ON PI.id = PC.proposal_item_id
            INNER JOIN WAREHOUSE_MASTER AS WH 
                ON P.warehouse_id = WH.id
                ${dynamicInnerJoin}
            WHERE  ${condition} 
            AND WH.organization_id IS NULL OR WH.organization_id = ${organization_id}          
            GROUP BY SOI.sales_order_id
            ORDER BY SO.sales_order_no DESC;

        `);

    // console.log(data, "=========formattedList==========");
    if (Array.isArray(data)) {
      return res
        .status(200)
        .send({ code: 200, message: "Order list data", data: data });
    } else {
      return res.status(200).send({ code: 200, message: "data not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getSOForDispatchAcknowledge = async (req, res) => {
  try {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 5);

    let condition = ``;
    let dynamicInnerJoin = ``;
    let dynamicColumns = "";

    dynamicColumns = `,'proceedToDispatch' AS status,   VP.gate_outward_status `;
    condition = ` SO.is_dispatched =1 
            AND SO.is_proceed_to_dispatched=1 AND
            SO.dispatch_status='PENDING'
            `;

    dynamicInnerJoin = `
            LEFT JOIN WH_VH_PLANNING_SO AS VPM
            ON SO.id=VPM.sale_order_id
            LEFT JOIN VEHICLE_IN_OUT_PLANNING_MST AS VP
            ON VPM.planning_id = VP.id
            `;
    let [data] = await db.sequelize.query(`
           SELECT 
                SOI.address,
                GROUP_CONCAT(SOI.id) AS item_id,
                GROUP_CONCAT(SOI.sales_order_id) AS sales_order_ids,
                SUM(SOI.quantity) AS total_quantity,
                MAX(P.proposal_no) AS proposal_no,
                MAX(P.id) AS proposal_id,
                MAX(CU.company_name) AS company_name,
                MAX(CA.contact_person_name) AS contact_person_name,
                MAX(SO.sales_order_no) AS sales_order_no,
                MAX(SO.id) AS salesOrderId,
                MAX(SO.expected_delivery_date) AS expected_delivery_date,
                MAX(SO.sales_order_date) AS sales_order_date,
                MAX(SO.customisation_branding_date) AS customisationDate,
                MAX(SO.is_dispatched) AS is_dispatched
                ${dynamicColumns}
            FROM SALES_ORDER_ITEM_LIST AS SOI
            INNER JOIN SALES_ORDER_MST AS SO
                ON SOI.sales_order_id = SO.id
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS P
                ON SO.proposal_id = P.id
            INNER JOIN CUSTOMER_PROFILE_MST AS CU 
                ON P.customer_id = CU.id
            INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CA 
                ON P.contact_person_id = CA.id
            INNER JOIN  CRM_PROPOSAL_LIST_MST AS PI 
                ON P.id = PI.proposal_id
            LEFT JOIN  CRM_PROPOSAL_BRANDING AS PB 
                ON PI.id = PB.proposal_item_id
            LEFT JOIN  CRM_PROPOSAL_CUSTOMISATION_TYPE AS PC 
                ON PI.id = PC.proposal_item_id
                ${dynamicInnerJoin}
            WHERE  ${condition}                
            GROUP BY SOI.address, SOI.sales_order_id
            ORDER BY SO.sales_order_no DESC;
        `);

    // console.log(data, "=========formattedList==========");
    if (Array.isArray(data)) {
      return res
        .status(200)
        .send({ code: 200, message: "Order list data", data: data });
    } else {
      return res.status(200).send({ code: 200, message: "data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ code: 500, message: error.message });
  }
};

async function get_custom_branding(detailId, qty, item_id) {

  const [customisationTypeList] = await db.sequelize.query(`
      SELECT * FROM CRM_PROPOSAL_CUSTOMISATION_TYPE
      WHERE proposal_item_id = ${detailId}
    `);

  const [brandingList] = await db.sequelize.query(`
      SELECT * FROM CRM_PROPOSAL_BRANDING
      WHERE proposal_item_id = ${detailId}
    `);

  const combinations = [];

  if (customisationTypeList.length === 0 && brandingList.length === 0) {
    combinations.push({
      customization_type_id: null,
      branding_data_id: null,
      qty: qty,
      select_scheme: [],
    });
  } else if (customisationTypeList.length && brandingList.length) {
    let afterCustomizeQty = qty;
    for (const c of customisationTypeList) {
      const brandingIndex = brandingList.findIndex(
        (b) => b.proposal_customisation_id === c.id
      );
      const matchingBranding =
        brandingIndex !== -1 ? brandingList[brandingIndex] : null;

      combinations.push({
        customization_type_id: c.id,
        branding_data_id: matchingBranding?.id || null,
        qty: c.qty,
        select_scheme: c.select_scheme,
      });
      afterCustomizeQty = afterCustomizeQty - c.qty;
    }
    if (afterCustomizeQty > 0) {
      combinations.push({
        customization_type_id: null,
        branding_data_id: null,
        qty: afterCustomizeQty,
        select_scheme: [],
      });
    }
  } else if (customisationTypeList.length) {
    let afterCustomizeQty = qty;
    for (const c of customisationTypeList) {
      combinations.push({
        customization_type_id: c.id,
        branding_data_id: null,
        qty: c.qty,
        select_scheme: c.select_scheme,
      });
      afterCustomizeQty = afterCustomizeQty - c.qty;
    }
    if (afterCustomizeQty > 0) {
      combinations.push({
        customization_type_id: null,
        branding_data_id: null,
        qty: afterCustomizeQty,
        select_scheme: [],
      });
    }
  } else if (brandingList.length) {
    for (const b of brandingList) {
      combinations.push({
        customization_type_id: null,
        branding_data_id: b.id,
        qty: b.qty,
      });
    }
  }

  for (const comb of combinations) {
    const [customisationData] = comb.customization_type_id
      ? await db.sequelize.query(`
             SELECT  ACC.accessories_name,CPD.*,BS.type_of_basket, MA.asset_category_name
              FROM CRM_PROPOSAL_CUSTOMISATION_DATA AS CPD
              LEFT JOIN MASTER_ACCESSORIES_NAME AS ACC ON CPD.accessory_in_name = ACC.id
              LEFT JOIN MASTER_ASSET AS MA ON MA.id = CPD.accessory_in_category
              LEFT JOIN MASTER_BASKET AS BS ON CPD.basket_mst_id=BS.id
              WHERE CPD.proposal_customisation_id =  ${comb.customization_type_id}
            `)
      : [[]];


    const [brandingData] = comb.branding_data_id
      ? await db.sequelize.query(`
              SELECT HSN.hsn_sac_code,PB.*,PB.branding_mst_id AS brandingTypes,MB.type_of_branding FROM CRM_PROPOSAL_BRANDING AS PB 
							INNER JOIN MASTER_BRANDING AS MB ON PB.branding_mst_id = MB.id
							JOIN MASTER_HSN_SAC_CODE AS HSN ON MB.hsn_code_id=HSN.id WHERE PB.id = ${comb.branding_data_id}
            `)
      : [[]];

    // Build custom_branding array
    const custom_branding = [];

    if (comb.customization_type_id) {
      const matchingCustomization = customisationTypeList.find(
        (c) => c.id === comb.customization_type_id
      );
      custom_branding.push({
        ...matchingCustomization,
        customisation_data: customisationData || [],
        branding_data: comb.branding_data_id ? brandingData[0] : null,
      });
    } else if (comb.branding_data_id) {
      custom_branding.push({
        customisation_data: [],
        branding_data: brandingData[0],
      });
    } else {
      custom_branding.push({
        customisation_data: [],
        branding_data: null,
      });
    }

    let selectScheme = [];
    let hasCustomization = false;
    if (
      Array.isArray(customisationTypeList) &&
      customisationTypeList.length > 0
    ) {
      for (const c of customisationTypeList) {
        selectScheme = c.select_scheme || [];
        hasCustomization = selectScheme.includes("1");
      }
    }

    if (!brandingData.length) {
      comb.select_scheme.splice(1);
    }
    if (!customisationData.length) {
      comb.select_scheme.splice(0, 1);
    }
    return custom_branding;
  }
}

module.exports.getSOByid = async (req, res) => {
  try {
    let id = req.params.id;
    let idString = req.params.id;
    let idArray = idString.split(",").map((id) => parseInt(id));
    let soList = await db.salesOrder.findOne({
      where: { id },
      include: [
        {
          model: db.proposalData,
          include: [

            {
              model: db.customerProfile,
              as: "parentCustomer",
            },
            {
              model: db.customerProfile,
              as: "customerData",
            },
            {
              model: db.perposal_type,
              as: "proposalType",
            },
          ],
          as: "proposalData",
        },
        {
          model: db.customerAddressContact
        },
        {
          model: db.salesOrderItemNew,
          // model: db.salesOrderItemList,
          // include: [
          //   {
          //     model: db.ItemMaster,
          //     include: [
          //       {
          //         model: db.hsn_sac_master,
          //       },
          //       {
          //         model: db.uom,
          //       },
          //     ],
          //   },
          // ],
        },
      ],
    });

    let dispatchedData = await db.salesOrderDispatched.findOne({
      where: { sales_order_id: id },
    });

    // let charges = await db.proposalAddtionalCharges.findAll({
    //   where: { proposal_id: soList.proposal_id },
    //   include: [
    //     {
    //       model: db.versionData,
    //       where: { is_so_created: 1 },
    //     },
    //   ],
    // });

    // let scheme = await db.proposalList.findAll({
    //   where: { proposal_id: soList.proposal_id, version_id: soList.version_id },
    //   attributes: {
    //     exclude: ['select_scheme']
    //   }
    // });

    // let updatedSchemeList = await Promise.all(
    //   scheme.map(async (scheme) => {
    //     let customisationType = await db.proposal_customisation_type.findOne({
    //       where: {
    //         proposal_item_id: scheme.id,
    //         version_id: scheme.version_id,
    //       },
    //       attributes: {
    //         exclude: ['select_scheme']
    //       }
    //     });
    // let branding = await db.proposal_branding.findAll({
    //   where: {
    //     proposal_item_id: scheme.id,
    //     version_id: scheme.version_id,
    //   },
    // });
    // let customisation_data = customisationType
    //   ? await db.proposal_customisation_data.findAll({
    //     where: { proposal_customisation_id: customisationType?.id },
    //     include: [
    //       {
    //         model: db.asset,
    //       },
    //       {
    //         model: db.SubCategory,
    //       },
    //       // {
    //       //   model: db.ItemMaster,
    //       // },
    //     ],
    //   })
    //   : [];

    // customisation_data = customisation_data.map((x) => {
    //   const json = x.toJSON();
    //   return {
    //     ...json,
    //     sub_category_name:
    //       json.MASTER_SUB_CATEGORY?.sub_category_name || "",
    //     item_name: json.MASTER_ITEM?.item_name || "",
    //     asset_category_name: json.MASTER_ASSET?.asset_category_name || "",
    //   };
    // });

    //     return {
    //       branding_data: branding,
    //       customisation_data,
    //       custom_branding: await get_custom_branding(scheme.id,scheme.qty,scheme.product_master_id),
    //       ...(scheme.toJSON?.() || scheme),
    //       customisation: customisationType
    //         ? customisationType.toJSON?.() || customisationType
    //         : null,
    //     };
    //   })
    // );

    let soList2 = {
      id: soList.id,
      sales_order_no: soList.sales_order_no,
      elan_sales_order_no: soList.elan_sales_order_no,
      elan_so_date: soList.elan_so_date,
      sales_order_date: soList.sales_order_date,
      is_dispatched: soList.is_dispatched,
      expected_delivery_date: soList.expected_delivery_date,
      expected_dispatch_date: soList.expected_dispatch_date,
      remark: soList.remark,
      customisation_branding_date: soList.customisation_branding_date,
      version_id: soList.version_id,
      deliveryAddress: [
        soList?.address,
        soList?.postal_address,
        soList?.pincode
      ].filter(Boolean).join(' '),
      proposal_no: soList?.proposalData?.proposal_no,
      company_name: soList?.proposalData?.customerData?.company_name,
      contact_person_name:
        soList?.CUSTOMER_ADDRESS_CONTACT_MST?.contact_person_name,
      mail_id: soList?.CUSTOMER_ADDRESS_CONTACT_MST?.email_id,
      contact_number: soList?.CUSTOMER_ADDRESS_CONTACT_MST?.mobile,
      proposal_type: soList?.proposalData?.proposalType?.perposal_type,

      //charges: charges,
      dispatched_date: dispatchedData
        ? dispatchedData.dataValues.dispatched_date
        : "",
      notes: dispatchedData ? dispatchedData.dataValues.notes : "",
      terms_and_conditions: dispatchedData
        ? dispatchedData.dataValues.terms_and_conditons
        : "",
      productDetailList: soList?.SALES_ORDER_ITEM_LIST_NEWs?.map(
        item => item.dataValues
      )
      // productDetailList: soList?.SALES_ORDER_ITEM_LIST_NEW.map((item) => {
      //   let matchedScheme = updatedSchemeList.find(
      //     (s) => s.product_master_id === item.product_master_id
      //   );
      //   return {
      //     ...(item.toJSON?.() || item),
      //     ...(matchedScheme || null),
      //   };
      // }),
    };

    if (soList2) {
      return res
        .status(200)
        .send({ code: 200, message: "Order list data", data: soList2 });
    } else {
      return res.status(200).send({ code: 200, message: "data not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// ------------------------ ADD PO----------------------------------//

const getEmail_data = async (id, proposal_id) => {
  try {
    // const { id, proposal_id, proposalApprovelId, action_type } = req.query;

    const proposalData = await db.sequelize.query(
      `SELECT DISTINCT
      PPI.pi_number,
             LS.lead_source,
            EMP.first_name,
            EMP.middle_name,
            EMP.last_name,
            EMP.contact_number AS  sales_number,
            CAC.contact_person_name, CAC.mobile,
            EMP.employee_official_email,
            CPHR.employee_official_email AS created_by_email,
            W.pin AS warehouse_pin,
            W.address AS warehouse_address,
            W.gst AS warehouse_gst,
           
            CP.valid_till_date,
            F.freight_name,I.insurance_name, 
            PM.payment_name, SP.sub_payment_name,
            CONCAT(B.location_name, ' - ', B.location_code) AS branch_name,W.name AS warehouse_name,DT.delivery_term, UL.unloading, 
            CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
            CPM2.company_name, sb.schedule_delivery_date,
           CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT.countryss_name AS billing_country_name,
            STA.states_name AS billing_state_name, CIT.city_name AS billing_city_name, CACM.email_id as mail_id,  CP.currency_symbol,
            
            CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT2.countryss_name AS shipping_country_name,
            STA2.states_name AS shipping_state_name, CIT2.city_name AS shipping_city_name,CAM.shipping_address,CAM.shipping_pin_code
            FROM CRM_VERSION_PROPOSAL_MST AS CV 
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = CV.proposal_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
            LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.customer_id = CP.customer_id
            LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CACM ON CACM.customer_id = CP.customer_id
            LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
            LEFT JOIN MASTER_SOURCE AS MS ON C.source_id = MS.id
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON CP.id = PA.proposal_id
            LEFT JOIN SALES_BOOKING AS sb ON sb.proposal_id = ${proposal_id} AND sb.version_id = ${id}
            LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = ${proposal_id} AND PPI.version_id = ${id}
             INNER  JOIN CUSTOMER_PROFILE_MST AS CPM2 ON CP.customer_id = CPM2.id
              LEFT JOIN LOCATION_MASTER AS B ON CP.location_id = B.id
             LEFT JOIN WAREHOUSE_MASTER AS W ON CP.warehouse_id = W.id
             LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS DT ON CP.delivery_term_id = DT.id
              LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS UL ON CP.unloading_resp_id = UL.id
              LEFT JOIN CRM_PAYMENT_MAIN_MST AS PM ON CP.payment_main_id = PM.id
              LEFT JOIN CRM_SUB_PAYMENT_MAIN_MST AS SP ON CP.sub_payment_main_id = SP.id
              LEFT JOIN CRM_FREIGHT_MST AS F ON CP.freight_id = F.id
              LEFT JOIN CRM_INSURANCE_MST AS I ON CP.insurance_id = I.id
              LEFT JOIN HRMS_REGISTERED_USER AS CPHR ON CP.employee_id = CPHR.employee_id
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
                            
              LEFT JOIN MASTER_COUNTRY AS CUT2 ON CAM.shipping_country_id = CUT2.countryss_id
              LEFT JOIN MASTER_STATE AS STA2 ON CAM.shipping_state_id = STA2.states_id
              LEFT JOIN MASTER_CITY AS CIT2 ON CAM.shipping_city_id = CIT2.city_id
              
              INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CAC ON CP.customer_id = CAC.customer_id
            WHERE CV.id = ${id}`
    );

    const Obj = {
      ...proposalData[0][0],
    };

    return Obj;
  } catch (error) {
    return;
  }
};

module.exports.create_addPO = async (req, res) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    let { proposal_no, upload_files, customer_id, financial_id, entity_id, mail_id, contact_person_name, proposal_id, sales_booking_no, scheme_id, sales_booking_date, schedule_delivery_date, notes,
      productDetailList, send_pi_link, is_withPO, po_items, is_deviation, version_id, is_book_created, so_status, uploadedFiles, po_number, po_date,
      sanction_credit_id, currency_id, grant_total, available_credit_limit, credit_approval_status, login_id, level_id, profit_center_id, cost_center_id,
      paymentDetails
    } = req.body;

    if (!customer_id || !financial_id || !entity_id || !proposal_id || !sales_booking_no || !sales_booking_date || !schedule_delivery_date) {
      return res.status(400).send({ code: 400, message: "All fields are required." });
    }

    let inputDate = new Date(schedule_delivery_date);
    schedule_delivery_date = inputDate.toISOString().split("T")[0];

    const bookingCreated = await db.salesBooking.create({
      is_deviation, customer_id, financial_year_id: financial_id, entity_id, proposal_id, sales_booking_no, sales_booking_date, schedule_delivery_date,
      notes, send_pi_link, version_id, is_book_created: is_book_created, po_number, po_date,
      profit_center_id, cost_center_id, advance_adjustment_percentage: paymentDetails?.advance_adjustment_percentage, advance_amount: paymentDetails?.grandTotalAmt2,
    }, { transaction });

    if (uploadedFiles) {
      for (const element of uploadedFiles) {
        await db.salesBookingDocs.create({
          sales_booking_id: bookingCreated.id,
          file_name: element,
        }, { transaction });
      }
    }
    if (paymentDetails) {
      const currencyExist = await db.currency_convert.findOne({ where: { Currency_Convert_id: currency_id }, attributes: ['Currency_Convert_id', 'rate'], transaction })

      const customerExist = await db.customerProfile.findOne({
        where: { id: customer_id },
        attributes: ['advance_amount'],
        transaction
      });
      const total_amount = paymentDetails?.paymentDetails.reduce(
        (total, row) => total + parseFloat(row.amount || 0),
        0
      );

      await db.customerProfile.update(
        {
          advance_amount: parseFloat(customerExist?.advance_amount) + parseFloat(total_amount)
        },
        {
          where: { id: customer_id },
          transaction
        }
      );

      Promise.all((paymentDetails?.paymentDetails || []).map(async (i) => {
        const { amount, bank_id, payment_mode, cheque_no, suspense_account_id } = i
        const chartOfAccount = await db.createBankAccount.findOne({
          where: { id: bank_id },
          transaction
        });
        await db.salesBookingAdvanceAmt.create({
          transaction_date: paymentDetails?.transaction_date, grandTotalAmt2: paymentDetails?.grandTotalAmt2, amount, remarks: paymentDetails?.remarks, payment_mode,
          cheque_no, bank_account_id: bank_id, customer_id, chart_account_id: chartOfAccount?.chart_account_id, suspense_account_id,
          advance_adjustment_percentage: paymentDetails?.advance_adjustment_percentage, sales_booking_id: bookingCreated.id, currency_id, currency_rate: currencyExist?.rate
        }, { transaction })
        if (payment_mode == 'Cash') {
          await db.financial_And_Account_Journal_List.bulkCreate([
            {
              chart_account_id: 50,
              debit_amount: 0.00,
              credit_amount: amount,
              entity_id,
              entry_status: 'Advances Receipt',
              document_number: 'Advances Receipt',
              customer_id,
              party_type: 'CUSTOMER',
              financial_id
            },
            {
              chart_account_id: 147,
              debit_amount: amount,
              credit_amount: 0.00,
              entity_id,
              entry_status: 'Advances Receipt',
              document_number: 'Advances Receipt',
              financial_id
            }
          ], { transaction })
        }
        if (payment_mode == 'Bank') {

          await db.financial_And_Account_Journal_List.bulkCreate([
            {
              chart_account_id: 50,
              debit_amount: 0.00,
              credit_amount: amount,
              entity_id,
              entry_status: 'Advances Receipt',
              document_number: 'Advances Receipt',
              customer_id,
              party_type: 'CUSTOMER',
              financial_id
            },
            {
              chart_account_id: chartOfAccount?.chart_account_id,
              debit_amount: amount,
              credit_amount: 0.00,
              entity_id,
              entry_status: 'Advances Receipt',
              document_number: 'Advances Receipt',
              financial_id
            }
          ], { transaction })
        }
        if (payment_mode == 'Suspense') {
          await db.suspenseAccountCustomer.update({ payment_status: 'APPROVED' }, { where: { id: suspense_account_id }, transaction })
          await db.financial_And_Account_Journal_List.bulkCreate([
            {
              chart_account_id: 50,
              debit_amount: 0.00,
              credit_amount: amount,
              entity_id,
              entry_status: 'Advances Receipt',
              document_number: 'Advances Receipt',
              customer_id,
              party_type: 'CUSTOMER',
              financial_id
            },
            {
              chart_account_id: 72,
              debit_amount: amount,
              credit_amount: 0.00,
              entity_id,
              entry_status: 'Advances Receipt',
              document_number: 'Advances Receipt',
              financial_id
            }
          ], { transaction })
        }
      }))

    }

    if (!bookingCreated) {
      await transaction.rollback();
      return res.status(500).send({ code: 500, message: "Failed to create sales order." });
    }
    // for (const elem of upload_files) {
    //       await db.financial_And_Account_Journal_Document.create({
    //         sales_booking_id: bookingCreated.id,
    //         image: elem.file
    //       });
    //     }

    if (bookingCreated && Array.isArray(productDetailList) && productDetailList.length > 0) {
      console.log("Creating booking items:", productDetailList);

      const itemsToCreate = productDetailList
        .map((item) => {
          const hasRequiredFields =
            item.qty > 0 && item.product_master_id && item.product_category_id;

          if (!hasRequiredFields) return null;

          return {
            product_category_id: item.product_category_id,
            product_sub_category_id: item.product_sub_category_id || null,
            product_master_id: item.product_master_id,
            quantity: parseFloat(item.qty),
            sale_booking_id: bookingCreated.id,
            address: item.address?.trim() || null,
            customisation: item.customization || null,
            customisation_data: item.customisation_data || null,
            branding_data: item.branding_data || null,
            apply_scheme: item.apply_scheme ?? false,
            promo_item: item.promo_item ?? false,
            select_scheme: Array.isArray(item.select_scheme)
              ? item.select_scheme.join(",")
              : item.select_scheme || null,
            scheme_id: item.scheme_id || scheme_id || null,
          };
        })
        .filter(Boolean); // remove any nulls
      if (is_withPO === false) {
        if (send_pi_link) {
          let data = await getEmail_data(version_id, proposal_id);
          await sendPerformaInoviceReMail(
            entity_id,
            data.company_name,
            // contact_person_name,
            data.mail_id,
            // (mail_id = data.created_by_email),
            proposal_no,
            send_pi_link
          );
        }
      }

      if (itemsToCreate.length === 0) {
        return res.status(400).send({
          code: 400,
          message: "No valid products to create sales booking items.",
        });
      }

      await db.salesBookingItem.bulkCreate(itemsToCreate, { transaction });
    }

    if (is_withPO === true) {
      let isRMExist = await db.user.findOne({
        where: { employee_id: login_id },
      });

      let reporting_manager_id = isRMExist.reporting_manager_id;
      let final_credit_status;
      // --------- workflow-------------
      //   if (grant_total > available_credit_limit) {

      //     if (credit_approval_status === "Forward") {
      //       credit_approval_status = "Approved"
      //       final_credit_status = "PENDING"
      //     }
      //     if (credit_approval_status === "Approved") {
      //       final_credit_status = "APPROVED"
      //     }
      //     if (credit_approval_status === "Pending") {
      //       final_credit_status = "PENDING"
      //     }
      //      if (credit_approval_status === "Rejected") {
      //       final_credit_status = "REJECTED"
      //     }

      //      await db.credit_limit_approval_workflow.create({
      //       sales_booking_id: bookingCreated.id,
      //       credit_approval_status,
      //       final_credit_status,
      //       proposal_id: proposal_id,
      //       version_id: version_id,
      //       approval_type: "with_approval",
      //       sanction_credit_id: sanction_credit_id,
      //       reporting_manager_id: reporting_manager_id,
      //       created_by: login_id,
      //       level_id: level_id,

      //     })
      //   }
      //   else {
      //    await db.credit_limit_approval_workflow.create({
      //       sales_booking_id: bookingCreated.id,
      //       credit_approval_status : "Approved",
      //       final_credit_status : "APPROVED",
      //       approval_type: "without_approval",
      //       proposal_id: proposal_id,
      //       version_id: version_id,
      //       sanction_credit_id: sanction_credit_id,
      //       reporting_manager_id: reporting_manager_id,
      //       created_by: login_id,
      //       level_id: level_id,
      //   })
      // }

      if (po_items && Array.isArray(po_items) && po_items.length > 0) {
        console.log("Creating booking items:", po_items);

        const itemsToCreate = po_items
          .map((item) => {
            const hasRequiredFields =
              item.qty > 0 &&
              item.product_master_id &&
              item.product_category_id;

            if (!hasRequiredFields) return null;

            return {
              product_category_id: item.product_category_id,
              product_sub_category_id: item.product_sub_category_id || null,
              product_master_id: item.product_master_id,
              quantity: parseFloat(item.qty),
              sale_booking_id: bookingCreated.id,
              address: item.address?.trim() || null,
              customisation: item.customization || null,
              customisation_data: item.customisation_data || null,
              branding_data: item.branding_data || null,
              apply_scheme: item.apply_scheme ?? false,
              promo_item: item.promo_item ?? false,
              select_scheme: Array.isArray(item.select_scheme)
                ? item.select_scheme.join(",")
                : item.select_scheme || null,
              scheme_id: item.scheme_id || scheme_id || null,
            };
          })
          .filter(Boolean); // remove any nulls

        if (itemsToCreate.length === 0) {
          return res.status(400).send({
            code: 400,
            message: "No valid products to create sales booking items.",
          });
        }

        await db.salesOrderPOItemList.bulkCreate(itemsToCreate, { transaction });
      }
      // if (is_deviation === false) {
      //   await db.salesBooking.update({ booking_status: 'APPROVED' }, { where: { version_id: version_id, proposal_id: proposal_id } })
      //   await db.versionData.update({ is_so_created: true }, { where: { id: version_id } })
      // }
      await db.proposal_performa_invoice.update(
        { is_addpo: "With_PO" },
        { where: { version_id: version_id, proposal_id: proposal_id }, transaction }
      );
    }

    await db.proposal_performa_invoice.update(
      { so_status: so_status },
      { where: { version_id: version_id, proposal_id: proposal_id }, transaction }
    );

    if (is_withPO === true) {
      await transaction.commit();

      return res.status(201).send({
        code: 201,
        message: "Sales Added with PO Successfully",
        data: bookingCreated,
      });
    } else {
      await db.proposal_performa_invoice.update(
        { is_addpo: "Without_PO" },
        { where: { version_id: version_id, proposal_id: proposal_id }, transaction }
      );

      await transaction.commit();

      return res.status(201).send({
        code: 201,
        message: "Sales Added without PO Successfully",
        data: bookingCreated,
      });
    }
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.forwardSOToRM = async (req, res) => {
  try {
    let {
      pi_id,
      version_id,
      proposal_id,
      is_withPO,
      booking_status,
      sales_booking_id,
      forward_to_level,
      customer_id,
      forward_to_id,
      from_user_id,
      credit_approval_status,
      grant_total,
      sactioned_credit_limit,
      available_credit_limit,
      remarks,
    } = req.body;

    // Ensure numeric values
    pi_id = parseInt(pi_id);
    version_id = parseInt(version_id);
    proposal_id = parseInt(proposal_id);

    if (!is_withPO) {
      return res
        .status(400)
        .send({ code: 400, message: "Feature is coming soon!" });
    }

    // ✅ Validate user + reporting manager
    const user = await db.user.findOne({
      where: { employee_id: from_user_id },
    });
    if (!user) {
      return res.status(404).send({ code: 404, message: "User not found." });
    }
    const reporting_manager_id = user.reporting_manager_id;
    if (!reporting_manager_id) {
      return res.status(400).send({
        code: 400,
        message: "Reporting manager not assigned to the user.",
      });
    }

    // ✅ Validate customer
    const customer = await db.customerProfile.findOne({
      where: { id: customer_id },
      attributes: ["customer_category_id"],
    });
    if (!customer) {
      return res
        .status(404)
        .send({ code: 404, message: "Customer not found." });
    }

    // ✅ Validate sanction credit limit
    const sanctionCreditLimit = await db.sanctionCreditLimit.findOne({
      where: { customer_category_id: customer.customer_category_id },
      attributes: [
        "id",
        "customer_category_id",
        "amount",
        "credit_period",
        "status",
      ],
    });
    if (!sanctionCreditLimit) {
      return res.status(404).send({
        code: 404,
        message: "Sanction Credit Limit not found for the customer's category.",
      });
    }

    // --------- workflow-------------
    if (grant_total > available_credit_limit) {
      // Credit exceeded → needs approval
      let final_credit_status;
      switch (credit_approval_status) {
        case "Forward":
        case "Pending":
          final_credit_status = "PENDING";
          break;
        case "Approved":
          final_credit_status = "APPROVED";
          break;
        case "Rejected":
          final_credit_status = "REJECTED";
          break;
        default:
          final_credit_status = "PENDING";
      }

      // ✅ Check if workflow exists
      const creditData = await db.credit_limit_approval_workflow.findOne({
        where: { sales_booking_id, approval_type: "with_approval" },
        order: [["id", "DESC"]],
      });

      if (!creditData && req.user.role_master_id !== 7) {
        return res.status(400).send({
          code: 400,
          message: "You are not authorized to forward this request!",
        });
      }

      if (!creditData) {
        const workflow = await db.levelEmployee.findOne({
          where: { level: 1, isDeleted: false },
          attributes: ["employee_ids"],
        });
        if (!workflow) {
          return res.status(400).send({
            code: 400,
            message: "Workflow is not created at Level-1.",
          });
        }
        if (!workflow.employee_ids.includes(reporting_manager_id)) {
          return res.status(400).send({
            code: 400,
            message: "Reporting Manager is not at Level-1.",
          });
        }
      }

      // ✅ Prevent duplicate forwarding
      const existingForward = await db.credit_limit_approval_workflow.findOne({
        where: {
          sales_booking_id,
          approval_type: "with_approval",
          reporting_manager_id: forward_to_id,
          created_by: from_user_id,
          level_id: forward_to_level,
        },
        order: [["id", "DESC"]],
      });
      if (existingForward) {
        return res.status(400).send({
          code: 400,
          message: "Sales Booking already forwarded to this Reporting Manager.",
        });
      }

      await db.credit_limit_approval_workflow.create({
        sales_booking_id,
        credit_approval_status,
        final_credit_status,
        proposal_id,
        version_id,
        approval_type: "with_approval",
        sanction_credit_id: sanctionCreditLimit.id,
        reporting_manager_id: forward_to_id,
        created_by: from_user_id,
        level_id: forward_to_level,
        remarks,
      });

      return res.status(201).send({
        code: 201,
        message: "Sales Booking forwarded to RM successfully (with approval).",
      });
    } else {
      // ✅ Within credit limit → auto-approve
      await db.credit_limit_approval_workflow.create({
        sales_booking_id,
        credit_approval_status: "Approved",
        final_credit_status: "APPROVED",
        approval_type: "without_approval",
        proposal_id,
        version_id,
        sanction_credit_id: sanctionCreditLimit.id,
        reporting_manager_id: forward_to_id,
        created_by: from_user_id,
        level_id: forward_to_level,
      });

      return res.status(201).send({
        code: 201,
        message: "Sales Booking forwarded to RM successfully (auto-approved).",
      });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getCreditWorklowApprovalList = async (req, res) => {
  try {
    const { sales_booking_id, proposal_id, version_id } = req.query;

    const approvalList = await db.credit_limit_approval_workflow.findAll({
      where: { sales_booking_id, proposal_id, version_id },
      include: [
        { model: db.level_master, attributes: ["id", "level_type"] },
        {
          model: db.user,
          as: "reportingManager",
          attributes: ["employee_id", "first_name", "last_name"],
        },
        {
          model: db.user,
          as: "createdBy",
          attributes: ["employee_id", "first_name", "last_name"],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).send({
      code: 200,
      message: "Approval list fetched successfully",
      data: approvalList,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getBookingById = async (req, res) => {
  try {
    const idString = req.params.id;
    const idArray = idString.split(",").map((i) => parseInt(i));
    const mainId = idArray[0]; // Use first ID for main shipping info

    // 1. Shipping + Proposal Info
    const [shippingResult] = await sequelize.query(
      `
            SELECT 
                ss.id AS shipping_id,
                ss.shipping_no,
                ss.shipping_date,
                ss.is_dispatched,
                ss.proposal_id,
                pd.proposal_no,
                pd.company_name,
                pd.contact_person_name,
                pd.mail_id,
                pd.contact_number,
                pd.proposal_type
            FROM SALES_SHIPPING ss
            LEFT JOIN crm_create_proposal_mst pd ON ss.proposal_id = pd.id
            WHERE ss.id = :mainId
            LIMIT 1
        `,
      {
        replacements: { mainId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!shippingResult) {
      return res
        .status(404)
        .send({ code: 404, message: "Shipping record not found" });
    }

    // 2. Product Details
    const productDetails = await sequelize.query(
      `
            SELECT 
                ssi.id AS item_id,
                ssi.shipping_id,
                ssi.product_id,
                pm.product_name,
                pm.product_description,
                hsn.hsn_code,
                uom.uom_name
            FROM SALES_SHIPPING_ITEM_LIST ssi
            LEFT JOIN product_master pm ON ssi.product_id = pm.id
            LEFT JOIN hsn_sac_master hsn ON pm.hsn_sac_id = hsn.id
            LEFT JOIN uom ON pm.uom_id = uom.id
            WHERE ssi.id IN (:idArray)
        `,
      {
        replacements: { idArray },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 3. Additional Charges
    const charges = await sequelize.query(
      `
            SELECT ac.charge_name, ac.charge_amount
            FROM proposal_additional_charges ac
            INNER JOIN version_data vd ON ac.proposal_id = vd.proposal_id
            WHERE ac.proposal_id = :proposalId AND vd.is_so_created = 1
        `,
      {
        replacements: { proposalId: shippingResult.proposal_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 4. Final Response
    const result = {
      id: shippingResult.shipping_id,
      shipping_no: shippingResult.shipping_no,
      shipping_date: shippingResult.shipping_date,
      is_dispatched: shippingResult.is_dispatched,
      proposal_no: shippingResult.proposal_no,
      company_name: shippingResult.company_name,
      contact_person_name: shippingResult.contact_person_name,
      mail_id: shippingResult.mail_id,
      contact_number: shippingResult.contact_number,
      proposal_type: shippingResult.proposal_type,
      productDetailList: productDetails,
      charges: charges,
    };

    return res.status(200).send({
      code: 200,
      message: "Shipping data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getShippingById:", error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getAllBookingList2 = async (req, res) => {
  try {
    const { login_id, status } = req.query;

    if (!login_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required parameter: login_id",
      });
    }

    const result = await db.sequelize.query(
      `
      SELECT 
          ppi.*,
          cpm.proposal_no, 
          cpm.mail_id, 
          cp.company_name,
          cp.id AS customer_id,
          cpm.grant_total, 
          cvm.version, 
          cvm.is_so_created,
          cpm.contact_person_name, 
          hru.role_master_name AS lead_owner,
          sb.booking_status,
          CASE 
              WHEN ppi.email_status = 'PENDING' 
                   AND ppi.customer_status = 'PENDING' 
                   AND ppi.so_status IS NULL 
              THEN 'DRAFT'
              ELSE ppi.so_status
          END AS effective_so_status
      FROM PROPOSAL_PERFORMA_INVOICE AS ppi
      LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm 
          ON cpm.id = ppi.proposal_id
      INNER JOIN CRM_VERSION_PROPOSAL_MST AS cvm 
          ON cvm.id = ppi.version_id 
         AND cvm.is_booking_created = true
      LEFT JOIN HRMS_REGISTERED_USER AS hru 
          ON hru.employee_id = ppi.created_by
      LEFT JOIN CUSTOMER_PROFILE_MST AS cp 
          ON cp.id = cpm.customer_id
      LEFT JOIN (
          SELECT proposal_id, version_id, MAX(booking_status) AS booking_status
          FROM SALES_BOOKING
          WHERE booking_status IS NOT NULL AND booking_status != 'APPROVED'
          GROUP BY proposal_id, version_id
      ) AS sb 
          ON sb.proposal_id = ppi.proposal_id 
         AND sb.version_id = ppi.version_id
      WHERE ppi.created_by = :login_id
        AND (
              (ppi.email_status = 'PENDING' 
               AND ppi.customer_status = 'PENDING' 
               AND ppi.so_status IS NULL 
               AND :status = 'DRAFT')
           OR 
              (ppi.so_status = :status)
           OR
              (ppi.email_status = 'PENDING' 
               AND ppi.customer_status = 'PENDING' 
               AND ppi.so_status = 'PENDING' 
               AND :status = 'PENDING')
        )
        AND NOT EXISTS (
            SELECT 1 
            FROM SALES_BOOKING AS sb2 
            WHERE sb2.proposal_id = ppi.proposal_id 
              AND sb2.version_id = ppi.version_id 
              AND sb2.booking_status = 'APPROVED'
        )
      ORDER BY ppi.createdAt DESC
      `,
      {
        replacements: { login_id, status },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched successfully",
        data: result,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No records found!",
      });
    }
  } catch (error) {
    console.error("Error in getAllBookingList:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getAllBookingList = async (req, res) => {
  try {
    const { login_id, status, role_master_id } = req.query;

    if (!role_master_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required parameter: role_master_id",
      });
    }

    if (role_master_id !== "1" && !login_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required parameter: login_id",
      });
    }
    // await db.sequelize.query(
    //   `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`
    // );
    const result = await db.sequelize.query(
      `
      SELECT 
      MAX(ppi.pi_number) AS pi_number,
      MAX(cvm.is_version_approvel_status) AS  is_version_approvel_status,
      MAX(cvm.version_status) AS version_status,
        MAX(MI.item_name) AS item_name,
        MAX(MI.id) AS item_id,
        MAX(cp.company_name) AS company_name,
        MAX(cp.id) AS customer_id,
        MAX(ppi.id) AS ppi_id, 
        MAX(ppi.id) AS id, 
        MAX(ppi.email_status) AS email_status,
        MAX(ppi.customer_status) AS customer_status,
        MAX(ppi.so_status) AS so_status,
        MAX(ppi.expiry_date) AS expiry_date,
        MAX(ppi.approvel_status) AS approvel_status,
        MAX(DATE_FORMAT(ppi.createdAt, '%Y-%m-%d')) AS createdAt,
        cpm.proposal_no,
        MAX(cpm.mail_id) AS mail_id,
        MAX(cpm.grant_total) AS grant_total,
        MAX(cvm.version) AS version,
        MAX(cvm.currency_id) AS currency_id,
        MAX(cvm.is_so_created) AS is_so_created,
        MAX(cpm.contact_person_name) AS contact_person_name,
        MAX(sb.booking_status) AS booking_status,
        MAX(ppi.is_addpo) AS is_addpo,
        MAX(ppi.proposal_id) AS proposal_id,
        MAX(ppi.version_id) AS version_id,
        MAX(ppi.sales_reason_id) AS sales_reason_id,
        MAX(msr.sales_reason) AS sales_reason,
        MAX(ppi.reason_rejectedBy) AS reason_rejectedBy,
        CONCAT(MAX(hrur.first_name), ' ' , MAX(hrur.last_name)) AS rejectedBy, 
        MAX(ppi.reason_remarks) AS reason_remarks,
        MAX(hru.reporting_manager_id) AS reporting_manager_id,
        CONCAT(MAX(hru.first_name), ' ', MAX(hru.last_name)) AS lead_owner,
        CASE
            WHEN MAX(ppi.email_status) = 'PENDING'
                 AND MAX(ppi.customer_status) = 'PENDING'
                 AND MAX(ppi.so_status) IS NULL
            THEN 'DRAFT'
            ELSE MAX(ppi.so_status)
        END AS effective_so_status

      FROM PROPOSAL_PERFORMA_INVOICE AS ppi
      LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm 
          ON cpm.id = ppi.proposal_id
      INNER JOIN CRM_VERSION_PROPOSAL_MST AS cvm 
          ON cvm.id = ppi.version_id 
         AND cvm.is_booking_created = true
      LEFT JOIN HRMS_REGISTERED_USER AS hru 
          ON hru.employee_id = cpm.employee_id
      LEFT JOIN CUSTOMER_PROFILE_MST AS cp 
          ON cp.id = cpm.customer_id
      INNER JOIN CRM_PROPOSAL_LIST_MST AS PLT
          ON cpm.id = PLT.proposal_id
      INNER JOIN MASTER_ITEM AS MI 
          ON PLT.product_master_id = MI.id
      LEFT JOIN MASTER_SALES_REASON AS msr 
          ON msr.id = ppi.sales_reason_id
      LEFT JOIN HRMS_REGISTERED_USER AS hrur 
          ON hrur.employee_id = ppi.reason_rejectedBy
      LEFT JOIN (
          SELECT proposal_id, version_id, MAX(booking_status) AS booking_status
          FROM SALES_BOOKING
          WHERE booking_status IS NOT NULL AND booking_status != 'APPROVED'
          GROUP BY proposal_id, version_id
      ) AS sb 
          ON sb.proposal_id = ppi.proposal_id 
         AND sb.version_id = ppi.version_id

      WHERE 
        (
          :role_master_id = '1'
          OR (
            :role_master_id != '1' AND (
              cpm.employee_id = :login_id
              OR (:role_master_id = '2' AND hru.reporting_manager_id = :login_id)
              OR (:role_master_id != '2' AND hru.reporting_manager_id IS NOT NULL AND hru.reporting_manager_id = :login_id)
              OR (:role_master_id = '7')
            )
          )
        )
        AND (
            (ppi.email_status = 'PENDING' 
              AND ppi.customer_status = 'PENDING' 
              AND ppi.so_status IS NULL 
              AND :status = 'DRAFT')
         OR 
            (ppi.so_status = :status)
         OR
            (ppi.email_status = 'PENDING' 
              AND ppi.customer_status = 'PENDING' 
              AND ppi.so_status = 'PENDING' 
              AND :status = 'PENDING')
        )
        AND NOT (:status = 'REJECTED' AND IFNULL(ppi.back_office_rejected, 0) = 1)

      GROUP BY cpm.proposal_no
      ORDER BY MAX(ppi.id) DESC;
      `,
      {
        replacements: { login_id, status, role_master_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    const currencyData = await db.currency_convert.findAll();

    if (result.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched successfully",
        data: result,
        currencyData: currencyData

      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No records found!",
      });
    }
  } catch (error) {
    console.error("Error in getAllBookingList:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getAllBookingList_backOffice = async (req, res) => {
  try {
    const { login_id, status, role_master_id } = req.query;

    if (!role_master_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required parameter: role_master_id",
      });
    }

    if (role_master_id !== "1" && !login_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required parameter: login_id",
      });
    }

    await db.sequelize.query(
      `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`
    );

    const result = await db.sequelize.query(
      `
      SELECT ppi.pi_number,
        MAX(MI.item_name) AS item_name,
        MAX(MI.id) AS item_id,
        MAX(cp.company_name) AS company_name,
        MAX(cp.id) AS customer_id,
        MAX(ppi.id) AS ppi_id, 
        MAX(ppi.id) AS id, 
        MAX(ppi.email_status) AS email_status,
        MAX(ppi.customer_status) AS customer_status,
        MAX(ppi.so_status) AS so_status,
        MAX(ppi.expiry_date) AS expiry_date,
        MAX(ppi.approvel_status) AS approvel_status,
        MAX(DATE_FORMAT(ppi.createdAt, '%Y-%m-%d')) AS createdAt,
        cpm.proposal_no,
        MAX(cpm.mail_id) AS mail_id,
        MAX(cpm.grant_total) AS grant_total,
        MAX(cvm.version) AS version,
        MAX(cvm.is_so_created) AS is_so_created,
        MAX(cpm.contact_person_name) AS contact_person_name,
        MAX(sb.booking_status) AS booking_status,
        MAX(ppi.is_addpo) AS is_addpo,
        MAX(ppi.proposal_id) AS proposal_id,
        MAX(ppi.version_id) AS version_id,
        MAX(ppi.sales_reason_id) AS sales_reason_id,
        MAX(msr.sales_reason) AS sales_reason,
        MAX(ppi.reason_rejectedBy) AS reason_rejectedBy,
        CONCAT(MAX(hrur.first_name), ' ' , MAX(hrur.last_name)) AS rejectedBy, 
        MAX(ppi.reason_remarks) AS reason_remarks,
        CONCAT(MAX(hru.first_name), ' ', MAX(hru.last_name)) AS lead_owner,

        CASE
            WHEN MAX(ppi.email_status) = 'PENDING'
                 AND MAX(ppi.customer_status) = 'PENDING'
                 AND MAX(ppi.so_status) IS NULL
            THEN 'DRAFT'
            ELSE MAX(ppi.so_status)
        END AS effective_so_status

      FROM PROPOSAL_PERFORMA_INVOICE AS ppi
      LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm 
          ON cpm.id = ppi.proposal_id
      INNER JOIN CRM_VERSION_PROPOSAL_MST AS cvm 
          ON cvm.id = ppi.version_id 
         AND cvm.is_booking_created = true
      LEFT JOIN HRMS_REGISTERED_USER AS hru 
          ON hru.employee_id = cpm.employee_id
      LEFT JOIN CUSTOMER_PROFILE_MST AS cp 
          ON cp.id = cpm.customer_id
      INNER JOIN CRM_PROPOSAL_LIST_MST AS PLT
          ON cpm.id = PLT.proposal_id
      INNER JOIN MASTER_ITEM AS MI 
          ON PLT.product_master_id = MI.id
      LEFT JOIN MASTER_SALES_REASON AS msr 
          ON msr.id = ppi.sales_reason_id
      LEFT JOIN HRMS_REGISTERED_USER AS hrur 
          ON hrur.employee_id = ppi.reason_rejectedBy
      LEFT JOIN (
          SELECT proposal_id, version_id, MAX(booking_status) AS booking_status
          FROM SALES_BOOKING
          WHERE booking_status IS NOT NULL AND booking_status != 'APPROVED'
          GROUP BY proposal_id, version_id
      ) AS sb 
          ON sb.proposal_id = ppi.proposal_id 
         AND sb.version_id = ppi.version_id

      WHERE 
        (
          :role_master_id = '1'
          OR (
            :role_master_id != '1' AND (
              cpm.employee_id = :login_id
              OR (:role_master_id = '2' AND hru.reporting_manager_id = :login_id)
              OR (:role_master_id != '2' AND hru.reporting_manager_id IS NOT NULL AND hru.reporting_manager_id = :login_id)
              OR (:role_master_id = '7')
            )
          )
        )
        AND (
            (ppi.email_status = 'PENDING' 
              AND ppi.customer_status = 'PENDING' 
              AND ppi.so_status IS NULL 
              AND :status = 'DRAFT')
         OR 
            (ppi.so_status = :status)
         OR
            (ppi.email_status = 'PENDING' 
              AND ppi.customer_status = 'PENDING' 
              AND ppi.so_status = 'PENDING' 
              AND :status = 'PENDING')
        )
        AND (:status != 'REJECTED' OR IFNULL(ppi.back_office_rejected, 0) = 1)

      GROUP BY cpm.proposal_no
      ORDER BY MAX(ppi.createdAt) DESC;
      `,
      {
        replacements: { login_id, status, role_master_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched successfully",
        data: result,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No records found!",
      });
    }
  } catch (error) {
    console.error("Error in getAllBookingList_backOffice:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getAllPendingBookingList = async (req, res) => {
  try {
    const { login_id, status } = req.query;

    if (!login_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required parameter: login_id",
      });
    }

    const role_master_id = req.user.role_master_id;

    const [result] = await db.sequelize.query(
      `
      SELECT 
      MAX(ppi.pi_number) AS pi_number,
  MAX(MI.item_name) AS item_name,
  MAX(MI.id) AS item_id,
  MAX(cp.company_name) AS company_name,
  MAX(cp.id) AS customer_id,
  MAX(ppi.id) AS ppi_id,
  MAX(ppi.id) AS id,
  MAX(ppi.email_status) AS email_status,
  MAX(ppi.customer_status) AS customer_status,
  MAX(ppi.so_status) AS so_status,
  MAX(ppi.approvel_status) AS approvel_status,
  MAX(ppi.createdAt) AS createdAt,
  cpm.proposal_no,
  MAX(cpm.mail_id) AS mail_id,
  MAX(cpm.grant_total) AS grant_total,
  MAX(cvm.version) AS version,
  MAX(cvm.currency_id) AS currency_id,
  MAX(cvm.is_so_created) AS is_so_created,
  MAX(cpm.contact_person_name) AS contact_person_name,
  CONCAT(MAX(hru.first_name), ' ', MAX(hru.last_name)) AS lead_owner,
  MAX(sb.booking_status) AS booking_status,
  MAX(ppi.is_addpo) AS is_addpo,
  MAX(ppi.proposal_id) AS proposal_id,
  MAX(ppi.version_id) AS version_id,
  CASE
    WHEN MAX(ppi.email_status) = 'PENDING'
      AND MAX(ppi.customer_status) = 'PENDING'
      AND MAX(ppi.so_status) IS NULL
    THEN 'DRAFT'
    ELSE MAX(ppi.so_status)
  END AS effective_so_status

FROM PROPOSAL_PERFORMA_INVOICE AS ppi
LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm
  ON cpm.id = ppi.proposal_id
INNER JOIN CRM_VERSION_PROPOSAL_MST AS cvm
  ON cvm.id = ppi.version_id
  AND cvm.is_booking_created = true
LEFT JOIN HRMS_REGISTERED_USER AS hru
  ON hru.employee_id = cpm.employee_id
LEFT JOIN CUSTOMER_PROFILE_MST AS cp
  ON cp.id = cpm.customer_id
INNER JOIN CRM_PROPOSAL_LIST_MST AS PLT
  ON cpm.id = PLT.proposal_id
INNER JOIN MASTER_ITEM AS MI
  ON PLT.product_master_id = MI.id

-- bring latest booking status
LEFT JOIN (
  SELECT proposal_id, version_id, MAX(id) AS latest_booking_id, MAX(booking_status) AS booking_status
  FROM SALES_BOOKING
  WHERE booking_status IS NOT NULL AND booking_status != 'APPROVED'
  GROUP BY proposal_id, version_id
) AS sb
  ON sb.proposal_id = ppi.proposal_id
  AND sb.version_id = ppi.version_id

-- 🔥 NEW: join CREDIT_LIMIT_APPROVAL_WORKFLOW
LEFT JOIN CREDIT_LIMIT_APPROVAL_WORKFLOW AS claw
  ON claw.sales_booking_id = sb.latest_booking_id
  AND claw.proposal_id = ppi.proposal_id
  AND claw.version_id = ppi.version_id

WHERE 
  (
    ${role_master_id} = 1 -- super admin
    OR (
      ${role_master_id} != 1 AND (
        -- cpm.employee_id = ${login_id}
        -- OR 
        (${role_master_id} = 2 AND hru.reporting_manager_id = ${login_id})
        OR (${role_master_id} != 2 AND hru.reporting_manager_id IS NOT NULL AND hru.reporting_manager_id = ${login_id})
        OR (${role_master_id} = 7)
        -- 🔥 also allow access if CLAW has reporting manager match
        OR (claw.reporting_manager_id = ${login_id} AND claw.credit_approval_status = 'Forward' AND claw.final_credit_status = 'PENDING')
      )
    )
  )
  AND ppi.is_addpo = '${status}'
  AND (
    (ppi.email_status = 'PENDING'
      AND ppi.customer_status = 'PENDING'
      AND ppi.so_status IS NULL)
  OR
    (ppi.so_status = 'PENDING')
  OR
    (ppi.email_status = 'PENDING'
      AND ppi.customer_status = 'PENDING'
      AND ppi.so_status = 'PENDING')
  )
  AND NOT EXISTS (
    SELECT 1
    FROM SALES_BOOKING AS sb2
    WHERE sb2.proposal_id = ppi.proposal_id
      AND sb2.version_id = ppi.version_id
      AND sb2.booking_status = 'APPROVED'
  )

GROUP BY cpm.proposal_no
ORDER BY MAX(ppi.createdAt) DESC;
      `
    );
    const currencyData = await db.currency_convert.findAll();

    if (result.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched successfully",
        data: result,
        currencyData: currencyData

      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No records found!",
      });
    }
  } catch (error) {
    console.error("Error in getAllPendingBookingList:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.generateSalesBookingNumber = async (req, res) => {
  try {
    const financial_year_id = req.params.financial_year_id;
    const financialYearEntry = await db.financial_year.findOne({
      where: { id: financial_year_id },
      attributes: ["financial_year"],
    });
    if (!financialYearEntry) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid financial year ID" });
    }
    const financialYear = financialYearEntry.financial_year;
    const lastEntry = await db.salesBooking.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["sales_booking_no"],
    });
    let number;
    if (lastEntry) {
      const lastCode = parseInt(lastEntry.sales_booking_no.split("/").pop());
      const newCode = lastCode + 1;
      number = `SB/${financialYear}/${newCode.toString().padStart(4, "0")}`;
    } else {
      number = `SB/${financialYear}/0001`;
    }

    return res.status(200).send({
      code: 200,
      message: "Sales Booking Number Generated",
      data: number,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

module.exports.getDispatchedSO = async (req, res) => {
  try {
    const { vpId } = req.query;
    const safeVpId = parseInt(vpId);

    const extraCondition = !isNaN(safeVpId) ? `OR WVP.id = ${safeVpId}` : "";
    const [dataList] = await db.sequelize.query(`
            SELECT
            
      MAX(W.name) AS warehouse_name,
      MAX(W.id) AS warehouse_id,
      MAX(L2.city_id) AS pickup_city_id,
      MAX(W.code) AS warehouse_code,
        MAX(W.address)AS pickup_address,
      MAX(L.location_name) AS location_name,
      MAX(L.location_code) AS location_code,
      
      MAX(C.id) AS proposal_id,
    MAX(C.lead_owner) AS lead_owner,
    MAX(CPM.company_name) AS company_name, 
    MAX(C.proposal_no) AS proposal_no,
    MAX(SO.city_id) AS delivery_city_id,
    MAX(SO.sales_order_no) AS sales_order_no,
    MAX(SO.is_proceed_to_dispatched) AS is_proceed_to_dispatched,
    MAX(SO.expected_delivery_date) AS expected_delivery_date,
    MAX(SO.expected_dispatch_date) AS expected_dispatch_date,
   MAX(CS.shipping_address)AS address,
    MAX(CS.shipping_postal_address) AS delivery_postal_address,
    SUM(SOI.quantity) AS quantity,
    SOI.sales_order_id,
    MAX(EM.entity_name) AS entity_name,
    MAX(DATE_FORMAT(C.createdAt, '%Y-%m-%d')) AS createdAt
FROM CRM_CREATE_PROPOSAL_MST AS C
INNER JOIN SALES_ORDER_MST AS SO ON SO.proposal_id = C.id
INNER JOIN SALES_ORDER_ITEM_LIST AS SOI ON SOI.sales_order_id = SO.id
INNER JOIN ENTITY_MASTER AS EM ON EM.id = SO.entity_id
LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.id
LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.customer_id = C.customer_id
LEFT JOIN WH_VH_PLANNING_SO AS WVPP ON WVPP.sale_order_id = SO.id
LEFT JOIN WH_VH_PLANNING_MST AS WVP ON WVP.id = WVPP.planning_id
INNER JOIN WAREHOUSE_MASTER AS W ON C.warehouse_id = W.id
INNER JOIN LOCATION_MASTER AS L ON C.location_id = L.id
INNER JOIN LOCATION_MASTER AS L2 ON W.location_id=L2.id
INNER JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CS ON SO.shipping_address_id =CS.id
WHERE 
    SO.is_proceed_to_dispatched = 1
    AND (
        WVPP.sale_order_id IS NULL -- Not in pickup list
        OR WVP.status = 'Rejected'   -- Or in planning with Reject status
        ${extraCondition}
    )
        GROUP BY  SOI.sales_order_id
ORDER BY  MAX(C.id) DESC;
        `);
    return res.status(200).send({
      code: 200,
      message: "Data Retrieved Successfully",
      data: dataList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

// use for vehicle planning frontend
module.exports.getDispatchedSOByWareouseId = async (req, res) => {
  try {
    const { vpId, warehouse_id } = req.query;
    const safeVpId = parseInt(vpId);

    const extraCondition = !isNaN(safeVpId)
      ? ` OR WVP.id = :vpId `
      : "";

    const [dataList] = await db.sequelize.query(
      `
      SELECT
        MAX(W.name) AS warehouse_name,
        MAX(W.id) AS warehouse_id,
        MAX(L2.city_id) AS pickup_city_id,
        MAX(MCP.city_name) AS pickup_city_name,
        MAX(W.code) AS warehouse_code,
        MAX(W.address) AS pickup_address,
        MAX(L.location_name) AS location_name,
        MAX(L.location_code) AS location_code,
        MAX(C.id) AS proposal_id,
        MAX(C.lead_owner) AS lead_owner,
        MAX(CPM.company_name) AS company_name,
        MAX(C.proposal_no) AS proposal_no,
        MAX(SO.city_id) AS delivery_city_id,
        MAX(MCD.city_name) AS delivery_city_name,
        MAX(SO.sales_order_no) AS sales_order_no,
        MAX(SO.is_proceed_to_dispatched) AS is_proceed_to_dispatched,
        MAX(SO.expected_delivery_date) AS expected_delivery_date,
        MAX(SO.expected_dispatch_date) AS expected_dispatch_date,
        MAX(WVPP.pickup_date) AS pickup_date,
        MAX(SO.address) AS address,
        MAX(SO.postal_address) AS delivery_postal_address,
        MAX(SO.pincode) AS pincode,
        SUM(SOI.qty) AS quantity,
        SOI.sales_order_id,
        MAX(SOINV.sales_invoice_no) AS sales_invoice_no,
        MAX(EM.entity_name) AS entity_name,
        MAX(DATE_FORMAT(C.createdAt, '%Y-%m-%d')) AS createdAt
      FROM CRM_CREATE_PROPOSAL_MST AS C
      INNER JOIN SALES_ORDER_MST AS SO ON SO.proposal_id = C.id
      INNER JOIN SALES_ORDER_ITEM_LIST_NEW AS SOI ON SOI.sales_order_id = SO.id
      LEFT JOIN MASTER_CITY AS MCD ON MCD.city_id = SO.city_id
      LEFT JOIN CRM_SALES_INVOICE_MST AS SOINV ON SOINV.so_id = SO.id AND SOINV.invoice_status = 'APPROVED'
      INNER JOIN ENTITY_MASTER AS EM ON EM.id = SO.entity_id
      LEFT JOIN CRM_ADD_DO_MST AS A ON A.proposal_id = C.id
      LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
      LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.customer_id = C.customer_id
      LEFT JOIN WH_VH_PLANNING_SO AS WVPP ON WVPP.sale_order_id = SO.id
      LEFT JOIN WH_VH_PLANNING_MST AS WVP ON WVP.id = WVPP.planning_id
      INNER JOIN WAREHOUSE_MASTER AS W ON C.warehouse_id = W.id
      INNER JOIN LOCATION_MASTER AS L ON C.location_id = L.id
      INNER JOIN LOCATION_MASTER AS L2 ON W.location_id=L2.id
      LEFT JOIN MASTER_CITY AS MCP ON MCP.city_id = L2.city_id
      WHERE
        W.id = :warehouse_id
        AND SO.is_proceed_to_dispatched = 1
        AND (
          WVPP.sale_order_id IS NULL OR WVPP.isDeleted=true
          OR WVP.status = 'Rejected'
          ${extraCondition}
        )
      GROUP BY SOI.sales_order_id
      ORDER BY MAX(C.id) DESC
      `,
      {
        replacements: {
          warehouse_id,
          vpId: safeVpId,
        },
      }
    );

    return res.status(200).send({
      code: 200,
      message: "Record fetch successfully",
      data: dataList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.applyCustBranding = async (req, res) => {
  try {
    const sales_id = req.params.id;
    let { remark, customisation_branding_date } = req.body;
    if (!sales_id) {
      return res.status(400).send({ code: 400, message: "Undefined sales id" });
    }
    if (!remark || !customisation_branding_date) {
      return res
        .status(400)
        .send({ code: 400, message: "Remark and customisation is required" });
    }

    let updatedSales = await db.salesOrder.update(
      { remark, customisation_branding_date },
      { where: { id: sales_id } }
    );
    if (updatedSales) {
      return res.status(200).send({
        code: 200,
        message: "Schedule apply customisation and branding",
      });
    } else {
      return res.status(400).send({
        code: 400,
        message: "Failed schedule apply customisation and branding",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.updateSoDate = async (req, res) => {
  try {
    const sales_id = req.params.id;
    let { sales_order_date } = req.body;
    if (!sales_id) {
      return res.status(400).send({ code: 400, message: "Undefined sales id" });
    }
    if (!sales_order_date) {
      return res
        .status(400)
        .send({ code: 400, message: "Sales order date is required" });
    }

    let updatedSales = await db.salesOrder.update(
      { expected_delivery_date: sales_order_date },
      { where: { id: sales_id } }
    );
    if (updatedSales) {
      return res
        .status(200)
        .send({ code: 200, message: "Sales order date has been updated" });
    } else {
      return res
        .status(400)
        .send({ code: 400, message: "Failed sales order date updation" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.uploadSoDoc = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const so_id = req.params.id;
    let { delivered_on_date, file, invoice_no, pod_remark } = req.body;

    if (!so_id || !delivered_on_date || !file || !invoice_no || !pod_remark) {
      return res.status(400).send({ code: 400, message: "so_id, delivery date, POD file, invoice_no, remark are required" });
    }

    const soData = await db.salesOrder.findOne({ where: { id: so_id }, transaction });
    if (!soData) throw new Error('Sales order not found');

    const inv_prefix = `${soData.sales_order_no}/INV-`;
    invoice_no = invoice_no.trim();
    const finalInvoice = invoice_no.startsWith(inv_prefix) ? invoice_no : inv_prefix + invoice_no;

    await db.salesOrder.update(
      {
        delivered_on_date,
        file,
        dispatch_status: "APPROVED",
        invoice_no: finalInvoice,
        pod_remark
      },
      { where: { id: so_id }, transaction }
    );

    const planning = await db.vehiclePlanningSo.findOne({ where: { sale_order_id: so_id }, transaction });
    if (!planning) throw new Error('Planning not found');
    const pid = planning.planning_id;

    const planningSos = await db.vehiclePlanningSo.findAll({
      where: { planning_id: pid },
      attributes: ['sale_order_id'],
      transaction
    });

    const soIds = planningSos.map(x => x.sale_order_id);
    if (!soIds.length) throw new Error('No SO found for this planning');

    const pendingCount = await db.salesOrder.count({
      where: { id: soIds, dispatch_status: "PENDING" }, transaction
    });

    if (pendingCount === 0) {
      await db.vehiclePlanningTransporter.update(
        { pod_status: "COMPLETED" },
        {
          where: { vehicle_planing_id: pid, admin_status: "ACCEPTED" },
          transaction
        }
      );
    }

    await transaction.commit();

    return res.status(200).send({ code: 200, message: "POD uploaded successfully" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.uploadPODDoc = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  const uploadedFiles = []; // use for rollback
  try {
    let { so_id, delivered_on_date, invoice_no, pod_remark, warehouse_id, financial_id, entity_id } = req.body;
    let fileName = null;
    let loginEmployee = req.user.employee_id;

    if (req.files && req.files.length > 0) {
      const f = req.files[0]; // single file

      fileName = f.filename;   // use for DB
      uploadedFiles.push(f.path); // use for rollback full path
    }

    if (!so_id || !delivered_on_date || !fileName || !invoice_no || !pod_remark) {
      return res.status(400).send({ code: 400, message: "delivery date, POD file, invoice_no, remark are required" });
    }

    const soData = await db.salesOrder.findOne({ where: { id: so_id }, transaction });
    if (!soData) throw new Error('Sales order not found');
    const isFirstPODUpload = soData.dispatch_status;
    const finalInvoice = invoice_no.trim();

    await db.salesOrder.update(
      {
        delivered_on_date,
        file: fileName,
        dispatch_status: "PENDING",
        invoice_no: finalInvoice,
        pod_remark
      },
      { where: { id: so_id }, transaction }
    );

    const planning = await db.vehiclePlanningSo.findOne({ where: { sale_order_id: so_id }, transaction });
    if (!planning) throw new Error('Planning not found');
    const pid = planning.planning_id;

    const planningSos = await db.vehiclePlanningSo.findAll({
      where: { planning_id: pid },
      attributes: ['sale_order_id'],
      transaction
    });

    const soIds = planningSos.map(x => x.sale_order_id);
    if (!soIds.length) throw new Error('No SO found for this planning');

    const pendingCount = await db.salesOrder.count({
      where: { id: soIds, dispatch_status: "PENDING" }, transaction
    });

    if (pendingCount === 0) {
      await db.vehiclePlanningTransporter.update(
        { pod_status: "COMPLETED" },
        {
          where: { vehicle_planing_id: pid, admin_status: "ACCEPTED" },
          transaction
        }
      );
    }

    if (isFirstPODUpload == 'PENDING') {
      soData.warehouse_id = warehouse_id;
      soData.financial_id = financial_id;
      soData.entity_id = entity_id;
      soData.loginEmployee = loginEmployee;

      await manageInventoryLedger(soData, 'POD', transaction)
    }
    await transaction.commit();

    return res.status(200).send({ code: 200, message: "POD uploaded successfully" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    // FILE rollback
    uploadedFiles.forEach(fp => {
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
      }
    });
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.allProposalNo = async (req, res) => {
  try {
    const { financial_year_id, status } = req.params;

    if (!financial_year_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Undefined financial year" });
    }
    const invoiceWhere = {};

    if (status != "0") {
      invoiceWhere.so_status = status;
    }
    let getData = await db.proposalData.findAll({
      where: {
        financial_year_id,
        proposal_status: "approved",
      },
      attributes: ["id", "proposal_no"],
      include: [
        {
          model: db.proposal_performa_invoice,
          required: true,
          where: invoiceWhere,
        },
      ],
    });

    if (!getData.length) {
      return res.status(400).send({ code: 400, message: "Proposal not found" });
    }

    return res
      .status(200)
      .send({ code: 200, message: "Proposal no list ", data: getData });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.allProposalCustomer = async (req, res) => {
  try {
    const { financial_year_id, status } = req.params;

    if (!financial_year_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Undefined financial year" });
    }
    let invoiceWhere = "";
    if (status != "0") {
      invoiceWhere.so_status = status;
    }
    let getData = await db.proposalData.findAll({
      where: { financial_year_id, proposal_status: "approved" },
      include: [
        {
          model: db.customerProfile,
          as: "customerData",
        },
        {
          model: db.proposal_performa_invoice,
          required: true,
          where: invoiceWhere,
        },
      ],
      distinct: true,
    });
    if (!getData.length) {
      return res.status(400).send({ code: 400, message: "Proposal not found" });
    }
    getData = getData.map((x) => {
      return {
        id: x?.customerData?.id,
        company_name: x?.customerData?.company_name,
      };
    });
    let uniqueData = Object.values(
      getData.reduce((acc, cust) => {
        acc[cust.id] = cust;
        return acc;
      }, {})
    );
    return res
      .status(200)
      .send({ code: 200, message: "Proposal no list ", data: uniqueData });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.allProposalItems = async (req, res) => {
  try {
    const financial_year_id = req.params.financial_year_id;

    if (!financial_year_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Undefined financial year" });
    }

    let getData = await db.proposalData.findAll({
      where: { financial_year_id, proposal_status: "approved" },
      include: [
        {
          model: db.proposalList,
          include: [
            {
              model: db.ItemMaster,
            },
          ],
        },
      ],
    });
    if (!getData.length) {
      return res.status(400).send({ code: 400, message: "Proposal not found" });
    }

    getData = getData.map((x) => {
      return {
        id: x?.CRM_PROPOSAL_LIST_MST?.MASTER_ITEM?.id,
        item_name: x?.CRM_PROPOSAL_LIST_MST?.MASTER_ITEM?.item_name,
      };
    });
    let uniqueData = Object.values(
      getData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {})
    );
    return res
      .status(200)
      .send({ code: 200, message: "Proposal no list ", data: uniqueData });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

module.exports.getAllPartiallyList = async (req, res) => {
  try {
    const { login_id, role_master_id } = req.query;

    if (!login_id || !role_master_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing login_id or role_master_id" });
    }

    // Prepare condition based on role
    let whereCondition = `C.proposal_status = 'approved' AND PPI.approvel_status = "APPROVED"`;

    if (parseInt(role_master_id) !== 1) {
      // For non-admin users, restrict to only their created proposals
      whereCondition += ` AND C.employee_id = ${login_id}`;
    }

    const [dataList] = await db.sequelize.query(`
           WITH DeliveredQuantities AS (
          SELECT
              CA.proposal_id,
              SUM(C.quantity) AS cumulative_delivered_qty
          FROM SALES_ORDER_ITEM_LIST AS C
          INNER JOIN SALES_ORDER_MST AS CA ON C.sales_order_id = CA.id
          GROUP BY CA.proposal_id
      ),
      ProposedQuantities AS (
          SELECT
              PL.proposal_id,
              SUM(PL.qty) AS total_proposed_qty
          FROM CRM_PROPOSAL_LIST_MST AS PL
          INNER JOIN CRM_VERSION_PROPOSAL_MST AS V ON V.id = PL.version_id
          WHERE V.is_so_created = 1
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
          MAX(PPI.so_status) AS so_status,
          MAX(PPI.version_id),
          MAX(PPI.email_status) AS email_status,
          CPM.company_name,
          V.version,
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
      INNER JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
      INNER JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = C.id AND PPI.version_id = V.id
      WHERE C.proposal_status = 'approved' AND PPI.approvel_status = "APPROVED"
      GROUP BY
          V.id, C.id, C.lead_owner, C.company_name, C.proposal_no, C.createdAt,
          C.grant_total, DQ.cumulative_delivered_qty, PQ.total_proposed_qty
          HAVING
    COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) > 0 AND
    COALESCE(CAST(PQ.total_proposed_qty AS SIGNED), 0) - COALESCE(CAST(DQ.cumulative_delivered_qty AS SIGNED), 0) > 0

      ORDER BY C.id DESC;











        `);

    if (parseInt(role_master_id) !== 1 && dataList.length === 0) {
      return res
        .status(200)
        .send({ code: 403, message: "Access denied", data: [] });
    }

    return res.status(200).send({
      code: dataList.length > 0 ? 200 : 404,
      message: dataList.length > 0 ? "success" : "no data found",
      data: dataList,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.updateSoStatus = async (req, res) => {
  try {
    let { proposal_id, version_id, reason_id, remark, emp_id } = req.body;
    if (!proposal_id || !version_id || !reason_id || !remark || !emp_id) {
      let missingFields = [];

      if (!proposal_id) missingFields.push("proposal");
      if (!version_id) missingFields.push("version");
      if (!reason_id) missingFields.push("resion");
      if (!remark) missingFields.push("remark");
      if (!emp_id) missingFields.push("emp_id");

      return res.status(400).send({
        code: 400,
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }
    await db.salesSoProgressStatus.update(
      { status: "INACTIVE" },
      { where: { proposal_id: proposal_id, version_id: version_id } }
    );
    let create = await db.salesSoProgressStatus.create({
      proposal_id,
      version_id,
      resion_id: reason_id,
      remark,
      progress_status_updated_by: emp_id,
    });
    if (!create.id) {
      return res
        .status(400)
        .send({ code: 400, message: "So status updation has been failed" });
    }

    return res
      .status(200)
      .send({ code: 200, message: "Status has been successfully updated." });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.proposalVersionRejected = async (req, res) => {
  try {
    let { proposal_id, version_id, reason_id, remark, emp_id, pi_id } =
      req.body;
    if (
      !proposal_id ||
      !version_id ||
      !reason_id ||
      !remark ||
      !emp_id ||
      !pi_id
    ) {
      let missingFields = [];

      if (!proposal_id) missingFields.push("proposal");
      if (!version_id) missingFields.push("version");
      if (!reason_id) missingFields.push("resion");
      if (!remark) missingFields.push("remark");
      if (!emp_id) missingFields.push("emp_id");
      if (!pi_id) missingFields.push("pi_id");

      return res.status(400).send({
        code: 400,
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }
    // await db.salesSoProgressStatus.update({status:'INACTIVE'},{where:{proposal_id:proposal_id,version_id:version_id}});
    let updated = await db.proposal_performa_invoice.update(
      {
        proposal_version_status: "REJECTED",
        version_reason_id: reason_id,
        version_rejected_remark: remark,
        version_rejected_by: emp_id,
      },
      { where: { id: req.params.pi_id } }
    );
    if (updated) {
      return res.status(200).send({
        code: 200,
        message: "Proposal has been successfully rejected.",
      });
    } else {
      return res.status(400).send({ code: 400, message: "PI undefined " });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.reasonStatusList = async (req, res) => {
  try {
    let { reason_id, tab } = req.query;
    let reasonData;
    if (tab != 3) {
      reasonData = await db.salesSoProgressStatus.findAll({
        where: { version_id: reason_id },
        include: [
          {
            model: db.salesReason,
            as: "resionData",
          },
        ],
      });
    } else {
      reasonData = await db.proposal_performa_invoice.findAll({
        where: { id: reason_id },
        include: [
          {
            model: db.salesReason,
            as: "versionRejectedReason",
          },
        ],
      });
    }
    if (reasonData.length) {
      return res
        .status(200)
        .send({ code: 200, message: "Reason list ", data: reasonData });
    } else {
      return res.status(400).send({ code: 400, message: "Reason not found " });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

const generateNextProposalNo = async (id) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    let prefix_is;

    const findPrefix = await db.prefix_mst.findOne({ where: { id } });

    if (findPrefix && findPrefix.prefix) {
      prefix_is = findPrefix.prefix;
    } else {
      if (id === 1) {
        prefix_is = 'QUO';
      } else if (id === 2) {
        prefix_is = 'PI';
      }
    }

    const prefix = `${prefix_is}${formattedDate}`;

    // Get latest proposal number for today
    const [lastProposal] = await db.proposalData.findAll({
      where: {
        proposal_no: {
          [db.Sequelize.Op.like]: `${prefix}%`
        }
      },
      order: [['proposal_no', 'DESC']],
      limit: 1
    });
    const [lastPI] = await db.proposal_performa_invoice.findAll({
      where: {
        pi_number: {
          [db.Sequelize.Op.like]: `${prefix}%`
        }
      },
      order: [['pi_number', 'DESC']],
      limit: 1
    });

    let nextNumber = 1000; // default starting number

    if (lastProposal?.proposal_no) {
      const lastSuffix = parseInt(lastProposal.proposal_no.slice(-4), 10);
      if (!isNaN(lastSuffix)) {
        nextNumber = lastSuffix + 1;
      }
    } else if (lastPI?.pi_number) {
      const lastSuffix = parseInt(lastPI.pi_number.slice(-4), 10);
      if (!isNaN(lastSuffix)) {
        nextNumber = lastSuffix + 1;
      }
    }

    const proposal_no = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    return proposal_no;
  } catch (error) {
    console.error("Error generating proposal number:", error);
    throw error;
  }
};

module.exports.updateSalesBooking = async (req, res) => {
  try {
    let {
      id,
      login_id,
      pageModeURL,
      expiry_date,
      pi,
      proformaStatus,
      proposal_type_id,
      gst_no,
      create_lead_id,
      employee_id,
      mail_id,
      common_id,
      company_name,
      lead_owner,
      contact_person_name,
      contact_number,
      chargesDetailList,
      total_cost,
      additional_charges,
      customer_id,
      totalAMTAfterDiscount,
      discount,
      taxable_value,
      sgst,
      cgst,
      igst,
      department_id,
      schemeData,
      grant_total,
      productDetailList,
      request_type,
      type,
      existing_client,
      financial_year_id,
      entity_id,
      contact_person_id,
      old_version,
      sales_documents,
      postal_address,
      valid_till_date,
      lead_source,
      created_by,
      created_by_id,
      delivery_term_id,
      delivery_term_remark,
      unloading_resp_id,
      unloading_resp_remark,
      unloading_resp_amount,
      warranty_month,
      warranty_month_remark,
      payment_main_id,
      sub_payment_main_id,
      freight_id,
      insurance_id,
      location_id,
      warehouse_id,
      items,
      changed,
      is_so_created,
      isPreview,
      isPreviewVersion,
      totalDiscountPercent,
      totalDiscountAmount,
      gstTotal,
      grossTotal,
      finalGrossAfterDiscount,
      finalGrandTotal,
      grossDiscountDetails, advance_amount, advance_check,
      PaymentArray,
      insurance_amt, quotationType,
      shipping_country_id,
      shipping_state_id,
      shipping_city_id,
      shipping_postal_address,
      shipping_address,
      shipping_pin_code,
      is_same_as_shipping
    } = req.body;
    let shippingAddress = {
      shipping_country_id,
      shipping_state_id,
      shipping_city_id,
      shipping_postal_address,
      shipping_address,
      shipping_pin_code,
    }
    // generate proposal NO
    let proposal_no;

    let isExistProposal = await db.proposalData.findOne({ where: { id: id } });
    let isCustomerShippingAddress;
    let isExistShippingAddress = await db.customerShippingAddress.findOne({
      where: {
        shipping_country_id,
        shipping_state_id,
        shipping_city_id,
        shipping_postal_address,
        shipping_address,
        shipping_pin_code,
        customer_id: id ? isExistProposal.customer_id : customer_id
      }
    })
    if (!isExistShippingAddress) {
      isCustomerShippingAddress = await db.customerShippingAddress.create({
        shipping_country_id,
        shipping_state_id,
        shipping_city_id,
        shipping_postal_address,
        shipping_address,
        shipping_pin_code,
        customer_id: id ? isExistProposal.customer_id : customer_id
      });
    } else { isCustomerShippingAddress = isExistShippingAddress }

    const maxDiscount = Math.max(
      ...productDetailList.map((p) => p.discount_request)
    );

    productDetailList.forEach((element) => {
      if (!element.discount_approved) {
        let discount =
          (element.price_per_unit * element.maximum_discount) / 100;
        element.calculated_price = element.price_per_unit - discount;
      } else {
        let discount =
          (element.price_per_unit * element.discount_approved) / 100;
        element.calculated_price = element.price_per_unit - discount;
      }
    });

    if (totalDiscountAmount > 0 || maxDiscount > 0) {
      request_type = "discount";
    }

    let getLevels;
    if (request_type == "discount") {
      let getResult = await newWorkFlow(employee_id, productDetailList);
      getLevels = getResult.matchedLevels
      const uniqueByLevelId = [...new Map(getLevels.map(item => [item.level_id, item])).values()];
      let minDiscount = getResult.maxDisountLevel;
      console.log(uniqueByLevelId);

      const maxDiscount2 = Math.max(
        ...productDetailList.map(item => item.totalDiscountPercentItem)
      );

      console.log("Max totalDiscountPercentItem:", maxDiscount);

      const _minDiscount2 = Math.min(
        ...getLevels.map(item => item.discount)
      );
      if (_minDiscount2 >= maxDiscount2 || _minDiscount2 >= maxDiscount) {
        request_type = "normal";
      }
    }

    let is__discount_requested = request_type == "discount" ? true : false

    console.log('is__discount_requested=====>', is__discount_requested)
    if (id) {
      const proposalExists = await db.proposalData.findOne({ where: { id } });

      if (!proposalExists) {
        return res.status(404).send({ code: 404, message: "Proposal not found" });
      }

      const existingProposalsCount1 = await db.versionData.max('version', { where: { proposal_id: id } });
      const versionId1 = existingProposalsCount1;
      const tempVersionNumber = parseInt(versionId1.slice(1), 10) + 1;
      const versionNumber = `V${tempVersionNumber}`;

      const proposalObject = {
        financial_year_id,
        entity_id,
        proposal_no,
        proposal_type_id,
        gst_no,
        create_lead_id,
        employee_id,
        common_id,
        lead_owner,
        is__discount_requested: request_type == "discount" ? true : false,
        total_cost,
        additional_charges,
        customer_id: customer_id ? customer_id : contact_person_id,
        totalAMTAfterDiscount: finalGrossAfterDiscount ? finalGrossAfterDiscount : totalAMTAfterDiscount,
        discount: totalDiscountAmount,
        taxable_value,
        sgst,
        cgst,
        igst,
        gstTotal: gstTotal ? gstTotal : igst,
        grant_total: finalGrandTotal ? finalGrandTotal : grant_total,
        totalDiscountPercent: totalDiscountPercent,
        request_type,
        existing_client,
        new_version: request_type !== "normal" ? "pending" : "approved",
        parent_customer_id: customer_id,
        contact_person_id,
        valid_till_date,
        lead_source_id: lead_source,
        created_by,
        created_by_id,
        delivery_term_id,
        delivery_term_remark,
        unloading_resp_id,
        unloading_resp_remark,
        unloading_resp_amount,
        warranty_month,
        warranty_month_remark,
        payment_main_id,
        sub_payment_main_id,
        freight_id,
        insurance_id,
        insurance_amt,
        location_id,
        warehouse_id, advance_amount, advance_check,
        // grossTotal: grossTotal ? grossTotal : grant_total
        grossTotal: grossTotal
      };
      // if (!employee_id) await sendmailnewcustomer(mail_id, entity_id);
      let versionId;
      if (changed) {
        versionId = isPreviewVersion;
      } else {
        // versionId = req.body?.version_id ?? req.body?.isPreviewVersion
        if (isPreviewVersion) {
          versionId = isPreviewVersion;
        } else {
          versionId = req.body?.version_id;
        }
      }
      let versionData = await db.versionData.findOne({ where: { id: versionId } })
      if (type === "edit" && !isPreviewVersion || changed) {
        delete proposalObject.customer_id;

        await db.proposalData.update(proposalObject, { where: { id } });
        // is_quotation_created
        let createVersion
        let isPiCreated = false;

        if (versionData?.is_sales_booking_version) {

          createVersion = await db.versionData.create({
            version: versionNumber,
            proposal_id: id,
            version_status: request_type !== "normal" ? "pending" : "approved",
            shipping_address_id: isCustomerShippingAddress.id,
            is_same_as_shipping,
            is_pi_created: isPiCreated,
            is_discount_requested: is__discount_requested,
            // is_sales_booking_version:true,
            is_booking_created: true,
            // is_version_status:'Sales Booking'
          });
        } else {
          createVersion = { id: changed ? isPreviewVersion : req.body?.version_id };

          await db.versionData.update({
            version_status: request_type !== "normal" ? "pending" : "approved", shipping_address_id: isCustomerShippingAddress.id, is_same_as_shipping: is_same_as_shipping,
            is_discount_requested: is__discount_requested,
            is_version_approvel_status: false,
          }, { where: { id: createVersion.id } });
        }

        await db.proposal_performa_invoice.update({
          version_id: createVersion.id,
          remark: '',
          financial_year_id,
          entity_id,
          created_by: login_id,
          expiry_date: expiry_date === 'Invalid date' ? null : expiry_date,

        }, { where: { proposal_id: id } });

        if (!versionData?.is_sales_booking_version) {
          // destroy table for version update case
          await destroyProposalData(createVersion?.id);
        }

        // use for Approval Mechanism Workflow
        await insertApprovalWorkflow(request_type, getLevels, entity_id, financial_year_id, id, createVersion.id);

        try {
          await Promise.all(
            productDetailList.map(async (product, index) => {
              try {
                const savedProduct = await insertProductData(product, id, createVersion.id, schemeData, request_type, index);

                // distribute gross discount per item (only item level, no sub-items)
                await insertGrossDiscountBreakup(product?.grossDiscountBreakup, id, createVersion.id, savedProduct.id);

                // use for Installation Kit (BOM)
                if (Array.isArray(product.bomArray) && product.bomArray.length > 0) {
                  await insertInstallationKitBOM(product.bomArray, savedProduct.id);
                }

                if (Array.isArray(product.subItems) && product.subItems.length > 0) {
                  // discount customization or branding
                  await insertCustomizationsAndBranding(product.subItems, savedProduct.id, proposal_no, createVersion.id);
                }
                else if (Array.isArray(product?.custom_branding) && product.custom_branding.length > 0) {
                  // without discount customization or branding
                  await insertCustomizationsAndBrandingWOD(product?.custom_branding, savedProduct.id, proposal_no, createVersion.id);
                }
                else {
                  console.warn(`Missing custom_branding array for product ID: ${savedProduct.id}`);
                }

              } catch (err) {
                console.error(`Error processing product at index ${index}:`, err);
              }
            })
          );

          // insert gross discount details
          await insertGrossDiscount(grossDiscountDetails, id, createVersion.id);

          // insert payment term details
          await insertPaymentTerm(PaymentArray, id, createVersion.id);

        } catch (error) {
          console.error("Unexpected error in proposal creation:", error);
        }

        // save documents
        if (sales_documents) {
          await db.proposal_documents.create({
            documents: sales_documents,
            proposal_id: id,
            version_id: createVersion.id,
          })
        }
        let previewData = {
          proposal_id: id,
          version_id: createVersion.id,
          is_sales_booking: true
        }

        return res
          .status(200)
          .send({ code: 200, message: "Updated successfully", data: previewData });
      }
      else {
        await db.proposalData.update(proposalObject, { where: { id } });
        let createVersion;

        createVersion = { id: req.body?.version_id };
        if (isPreviewVersion) {
          createVersion = { id: isPreviewVersion }
        } else {
          createVersion = { id: req.body?.version_id }
        }

        // save documents
        if (sales_documents) {
          await db.proposal_documents.create({
            documents: sales_documents,
            proposal_id: id,
            version_id: createVersion.id,
          })
        }
        let previewData = {
          proposal_id: id,
          version_id: createVersion.id,
          is_sales_booking: true
        }
        return res
          .status(201)
          .send({ code: 201, message: "Created successfully", data: previewData });
      }
    }
  } catch (error) {

    return res.status(500).send({
      code: 500,
      message: error.message,
      error: error.message,
    });
  }
};

module.exports.updateVersionStatus = async (req, res) => {
  try {
    const { version_id } = req.params;

    // Check if the record exists before updating
    const versionRecord = await db.versionData.findOne({ where: { id: version_id } });
    if (!versionRecord) {
      return res.status(404).send({
        code: 404,
        message: "Version not found",
      });
    }

    const updatedData = await db.versionData.findOne({ where: { id: version_id } });
    // Perform the update

    let is_version_approvel_status = false;
    const proposal_id = versionRecord?.proposal_id;
    if (updatedData.version_status == 'pending') {
      is_version_approvel_status = true;
    }
    const [updatedRows] = await db.versionData.update(
      {
        is_booking_created: true,
        is_sales_booking_version: true,
        is_version_approvel_status: is_version_approvel_status,
        is_version_status: "Sales Booking",
      },
      { where: { id: version_id } }
    );
    let data = await getProposalPreviewData(version_id, proposal_id);
    const proposalData = await db.sequelize.query(
      `SELECT
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
            LS.lead_source,
            PPI.pi_number,
            EMP.title, 
            EMP.first_name,
            EMP.middle_name,
            EMP.last_name,
            EMP.contact_number,
            CAC.contact_person_name AS personName,
            CAC.title, 
            CAC.mobile,
            EMP.employee_official_email,
            -- W.pin AS warehouse_pin,W.address AS warehouse_address,W.gst AS warehouse_gst,
          --  W.email AS warehouse_email,W.contact_number AS warehouse_contact_no,
            CP.valid_till_date,
            F.freight_name,I.insurance_name,
            PM.payment_name, SP.sub_payment_name,
           CONCAT(B.location_name, ' - ', B.location_code) AS branch_name, W.name AS warehouse_name,DT.delivery_term, UL.unloading, 
            CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
            CPM2.company_name, sb.schedule_delivery_date,
           CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT.countryss_name AS billing_country_name,
            STA.states_name AS billing_state_name, CIT.city_name AS billing_city_name, 
           
            CUT2.countryss_name AS shipping_country_name,
            STA2.states_name AS shipping_state_name, CPM3.company_name AS shipping_customer_name,  CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code, 
            cplm.*
            FROM CRM_VERSION_PROPOSAL_MST AS CV
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = CV.proposal_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
            LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.customer_id = CP.customer_id
            LEFT JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CSA ON CV.shipping_address_id = CSA.id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM3 ON CAM.customer_id = CPM3.id 
            LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
            LEFT JOIN MASTER_SOURCE AS MS ON C.source_id = MS.id 
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON CP.id = PA.proposal_id
            LEFT JOIN SALES_BOOKING AS sb ON sb.proposal_id = ${proposal_id} AND sb.version_id = ${version_id}
            LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = ${proposal_id} AND PPI.version_id = ${version_id}
             INNER  JOIN CUSTOMER_PROFILE_MST AS CPM2 ON CP.customer_id = CPM2.id
              LEFT JOIN LOCATION_MASTER AS B ON CP.location_id = B.id
             LEFT JOIN WAREHOUSE_MASTER AS W ON CP.warehouse_id = W.id
             LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS DT ON CP.delivery_term_id = DT.id
              LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS UL ON CP.unloading_resp_id = UL.id
              LEFT JOIN CRM_PAYMENT_MAIN_MST AS PM ON CP.payment_main_id = PM.id
              LEFT JOIN CRM_SUB_PAYMENT_MAIN_MST AS SP ON CP.sub_payment_main_id = SP.id
              LEFT JOIN CRM_FREIGHT_MST AS F ON CP.freight_id = F.id
              LEFT JOIN CRM_INSURANCE_MST AS I ON CP.insurance_id = I.id
              LEFT JOIN CRM_PROPOSAL_LIST_MST AS cplm ON cplm.id = ${proposal_id}
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
                           
              LEFT JOIN MASTER_COUNTRY AS CUT2 ON CAM.shipping_country_id = CUT2.countryss_id
              LEFT JOIN MASTER_STATE AS STA2 ON CAM.shipping_state_id = STA2.states_id
              LEFT JOIN MASTER_CITY AS CIT2 ON CAM.shipping_city_id = CIT2.city_id
             
              INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CAC ON CP.customer_id = CAC.customer_id
              
                -- here code for dealer address
														LEFT JOIN CUSTOMER_PROFILE_MST AS DP ON CPM2.dealer_id = DP.id
														LEFT JOIN CUSTOMER_ADDRESS_MST AS DADD ON DP.id=DADD.customer_id
														
              	LEFT JOIN MASTER_COUNTRY AS DC ON DADD.billing_country_id = DC.countryss_id
							LEFT JOIN MASTER_STATE AS DS ON DADD.billing_state_id = DS.states_id
							LEFT JOIN MASTER_CITY AS DCITY ON DADD.billing_city_id = DCITY.city_id
            WHERE CV.id = ${version_id} 
            -- GROUP BY CP.id
            `
    );
    const versionCurrency = await db.versionData.findOne({
      where: { id: version_id }, include: [
        {
          model: db.currency_convert
        }
      ]
    })
    let result = await generateInvoicePdf(data, proposalData[0][0], proposal_id, version_id, 'salesbooking', versionCurrency); // yha aap proposalData bhi bhej skte ho

    // await sendPerformaInoviceMail(data.entity_id, proposalData[0][0].company_name, data.created_by_email, data.pi_number, result, page_mode, proposalData[0][0].pi_number);
    mailQueue.add({
      type: "SALES_BOOKING",
      entity_id: data.entity_id,
      contact_person_name: proposalData[0][0].company_name,
      created_by_email: data.mail_id,
      proposal_no: data.proposal_no,
      page_mode: 'salesbooking',
      fileName: result.fileName,
      pdfBase64: result.pdfBuffer.toString("base64")   // ✅ Base64 safe!
    });
    // Sequelize update returns [numberOfRowsUpdated]
    if (updatedRows === 0) {
      return res.status(400).send({
        code: 400,
        message: "Update failed — no rows affected.",
      });
    }

    // Fetch updated record (optional)

    return res.status(200).send({
      code: 200,
      message: "Version updated successfully",

    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
      error: error,
    });
  }

}

const newWorkFlow = async (employee_id, productDetailList) => {
  let maxDisountLevel = 0;
  let employee = await db.user.findOne({
    where: { employee_id: employee_id }
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const getLevels = await db.sequelize.query(
    `SELECT  MQAD.id,MQAD.sub_category_id, MQAD.level_id,MQAD.discount, EMPL.level_type
     FROM MASTER_QUOTATION_APPROVAL_DETAILS AS MQAD
          INNER JOIN  MASTER_LEVEL AS EMPL
          ON MQAD.level_id = EMPL.id
           WHERE MQAD.isDeleted=false`,
    { type: db.sequelize.QueryTypes.SELECT }
  );
  // const getLevels = await db.sequelize.query(
  //   `SELECT  id,sub_category_id, level_id,discount
  //    FROM MASTER_QUOTATION_APPROVAL_DETAILS WHERE isDeleted=false`,
  //   { type: db.sequelize.QueryTypes.SELECT }
  // );


  console.log(getLevels);
  if (!getLevels.length) {
    throw new Error('Workflow does not exist');
  }
  const uniqueLevels = [...new Set(getLevels.map(level => level.level_id))];

  let currentEmployeeId = employee.employee_id;
  const matchedLevels = [];
  for (const currentLevel of uniqueLevels) {

    for (const product of productDetailList) {
      const productSubCategoryId = product.product_sub_category_id;


      const exists = getLevels.some(
        level => level.level_id === currentLevel && level.sub_category_id === productSubCategoryId
      );

      if (!exists) {
        throw new Error(
          `Sub Category does not exist at level ${currentLevel}`
        );
      }
      const matchedLevel = getLevels.find(
        level => level.level_id === currentLevel && level.sub_category_id === productSubCategoryId
      );
      if (matchedLevel) {
        matchedLevels.push(matchedLevel);
        if (maxDisountLevel < matchedLevel.discount) {
          maxDisountLevel = matchedLevel.discount;
        }
      }
    }


    let currentEmployee = await db.user.findOne({
      where: { employee_id: currentEmployeeId }
    });

    if (!currentEmployee || !currentEmployee.reporting_manager_id) {
      throw new Error(`Reporting manager not found for employee ${currentEmployeeId} at level ${currentLevel}`);
    }

    const reportingManagerId = currentEmployee.reporting_manager_id;

    let levelMapping = await db.levelEmployee.findOne({
      where: db.Sequelize.literal(`
      level = ${currentLevel} AND JSON_CONTAINS(employee_ids, '[${reportingManagerId}]')
    `)
    });
    let reportingManager = await db.user.findOne({ where: { employee_id: reportingManagerId } })
    if (!levelMapping) {
      throw new Error(`Reporting manager ${reportingManager.first_name + ' ' + reportingManager.last_name} not found at level ${currentLevel}`);
    }

    console.log(`✅ Reporting Manager at level ${currentLevel}: ${reportingManagerId}`);

    matchedLevels.forEach((level, index) => {
      let level2 = level?.level_type.split(' ')[1];
      console.log('get level ============>', level2)
      if (level.level_id === currentLevel) {
        level.employee_id = reportingManagerId;
        level.level = level2;
      }
    });
    currentEmployeeId = reportingManagerId;
  }
  //  let xmatchedLevels= assignIncrementalLevels(matchedLevels);
  return { matchedLevels, maxDisountLevel };


}








module.exports.getAllSalesOrder = async (req, res) => {
  try {
    const getSo = await db.salesOrder.findAll({
      include: [{ model: db.customerProfile }],
    });

    const getSO = getSo.map(item => {
      const plain = item.get({ plain: true });

      const { CUSTOMER_PROFILE_MST, ...soData } = plain;

      if (CUSTOMER_PROFILE_MST) {
        const { id, ...customerData } = CUSTOMER_PROFILE_MST;

        return {
          ...soData,
          ...customerData
        };
      }

      return soData;
    });

    if (!Array.isArray(getSO)) {
      return res.status(200).send({
        code: 200,
        message: "Sales order does not found!",
      });

    }
    return res.status(200).send({
      code: 200,
      message: "Sales order list!",
      data: getSO
    })
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
      error: error,
    });
  }
}

async function getOrCreateCustomerContact({
  customer_id,
  contact_person_name,
  mobile,
  email_id,
  transaction
}) {
  if (!customer_id || !contact_person_name || !mobile || !email_id) return null;

  const [contact] = await db.customerAddressContact.findOrCreate({
    where: {
      customer_id,
      contact_person_name,
      mobile,
      email_id
    },
    defaults: {
      customer_id,
      contact_person_name,
      mobile,
      email_id
    },
    transaction
  });

  return contact.id;
}

async function getStockMap(itemIds, warehouse_id) {
  const inventory = await db.inventory_stock.findAll({
    where: {
      warehouse_id,
      item_id: itemIds
    }
  });

  const stockMap = {};
  inventory.forEach(stock => {
    stockMap[stock.item_id] = Number(stock.available_qty);
  });

  return stockMap;
}

function addStock(stockSummary, itemId, stockMap, itemName = '', itemCode = '') {

  if (stockSummary[itemId]) return;

  stockSummary[itemId] = {
    item_id: itemId,
    item_name: itemName,
    item_code: itemCode,
    available_qty: stockMap[itemId] || 0
  };
}

async function fetchStock(data) {

  const stockSummary = {};

  const itemIds = new Set();

  // Products
  data.productDetailList.forEach(product => {

    itemIds.add(product.product_master_id);

    (product.customisation_data || []).forEach(custom => {

      const id =
        custom.accessory_item_id ||
        custom.basket_item_id;

      if (id) itemIds.add(id);

    });

  });

  // BOM
  data.bomArray.forEach(bom => {

    bom.bom_items.forEach(item => {

      itemIds.add(item.item_id);

      (item.substitute_items || []).forEach(sub => {
        itemIds.add(sub.item_id);
      });

    });

  });

  // Single Inventory Query
  const stockMap = await getStockMap(
    [...itemIds],
    data.warehouse_id
  );

  // Products
  data.productDetailList.forEach(product => {

    product.avlStock =
      stockMap[product.product_master_id] || 0;

    addStock(
      stockSummary,
      product.product_master_id,
      stockMap,
      product.product_name,
      product.product_code
    );

    (product.customisation_data || []).forEach(custom => {

      const id =
        custom.accessory_item_id ||
        custom.basket_item_id;

      if (!id) return;

      custom.avlStock =
        stockMap[id] || 0;

      addStock(
        stockSummary,
        id,
        stockMap,
        custom.accessories_name || custom.type_of_basket,
        custom.acc_item_code || custom.bas_item_code
      );

    });

  });

  // BOM
  data.bomArray.forEach(bom => {

    bom.bom_items.forEach(item => {

      item.avlStock =
        stockMap[item.item_id] || 0;

      addStock(
        stockSummary,
        item.item_id,
        stockMap,
        item.item_name
      );

      (item.substitute_items || []).forEach(sub => {

        sub.avlStock =
          stockMap[sub.item_id] || 0;

        addStock(
          stockSummary,
          sub.item_id,
          stockMap,
          sub.item_name
        );

      });

    });

  });

  return {
    updatedData: data,
    stockSummary: Object.values(stockSummary)
  };

}

async function validateDispatchStock(selectedItems, selectedBoms, warehouse_id) {

  const dispatchSummary = {};

  // Products
  for (const product of selectedItems) {

    if (product.quantity > 0) {
      if (!dispatchSummary[product.item_id]) {
        dispatchSummary[product.item_id] = {
          item_id: product.item_id,
          item_name: product.product_name,
          item_code: product.product_code,
          quantity: 0
        };
      }

      dispatchSummary[product.item_id].quantity += Number(product.quantity);
    }

    for (const custom of (product.customisation_data || [])) {

      const itemId =
        custom.accessory_item_id ||
        custom.basket_item_id;

      if (!itemId) continue;

      if (!dispatchSummary[itemId]) {
        dispatchSummary[itemId] = {
          item_id: itemId,
          item_name:
            custom.accessories_name ||
            custom.type_of_basket ||
            '',
          item_code:
            custom.acc_item_code ||
            custom.bas_item_code ||
            '',
          quantity: 0
        };
      }

      dispatchSummary[itemId].quantity += Number(custom.dispatchQty || 0);
    }
  }

  // BOM
  for (const bom of selectedBoms) {

    for (const item of bom.bom_items) {

      if (item.dispatchQty > 0) {

        if (!dispatchSummary[item.item_id]) {
          dispatchSummary[item.item_id] = {
            item_id: item.item_id,
            item_name: item.item_name || '',
            item_code: '',
            quantity: 0
          };
        }

        dispatchSummary[item.item_id].quantity += Number(item.dispatchQty);
      }

      for (const sub of (item.substitute_items || [])) {

        if (sub.dispatchQty > 0) {

          if (!dispatchSummary[sub.item_id]) {
            dispatchSummary[sub.item_id] = {
              item_id: sub.item_id,
              item_name: sub.item_name || '',
              item_code: '',
              quantity: 0
            };
          }

          dispatchSummary[sub.item_id].quantity += Number(sub.dispatchQty);
        }
      }
    }
  }

  const itemIds = Object.keys(dispatchSummary).map(Number);

  const stockMap = await getStockMap(
    itemIds,
    warehouse_id
  );

  const insufficientItems = [];

  for (const itemId of itemIds) {

    const required = dispatchSummary[itemId].quantity;
    const available = stockMap[itemId] || 0;

    if (required > available) {

      insufficientItems.push({
        item_id: Number(itemId),
        product_name: dispatchSummary[itemId].item_name,
        product_code: dispatchSummary[itemId].item_code,
        required_qty: required,
        available_qty: available
      });
    }
  }

  return {
    valid: insufficientItems.length === 0,
    insufficientItems
  };
}

// async function fetchStock(data) {
//   const insufficientItems = [];
//   const stockSummary = {};

//   async function addStock(itemId, warehouseId, itemName = '', itemCode = '') {

//     if (stockSummary[itemId]) return;

//     const stock = await db.inventory_stock.findOne({
//       where: {
//         item_id: itemId,
//         warehouse_id: warehouseId
//       }
//     });

//     stockSummary[itemId] = {
//       item_id: itemId,
//       item_name: itemName,
//       item_code: itemCode,
//       available_qty: stock ? stock.available_qty : 0
//     };
//   }

//   for (const element of data.productDetailList) {

//     await addStock(
//       element.product_master_id,
//       data.warehouse_id,
//       element.product_name,
//       element.product_code
//     );

//     const stock = await db.inventory_stock.findOne({
//       where: {
//         item_id: element.product_master_id,
//         warehouse_id: data.warehouse_id
//       }
//     });

//     const availableQty = stock ? stock.available_qty : 0;
//     element.avlStock = availableQty;

//     if (availableQty < element.quantity) {
//       insufficientItems.push({
//         product_name: element.product_name,
//         product_code: element.product_code,
//         required_qty: element.quantity,
//         available_qty: availableQty
//       });
//     }

//     // accessories/ baskets
//     for (const abData of element.customisation_data) {
//       await addStock(
//         abData.basket_item_id || abData.accessory_item_id,
//         data.warehouse_id,
//         abData.accessories_name || abData.type_of_basket,
//         abData.acc_item_code || abData.bas_item_code
//       );

//       const abstock = await db.inventory_stock.findOne({
//         where: {
//           item_id: abData.basket_item_id || abData.accessory_item_id,
//           warehouse_id: data.warehouse_id
//         }
//       });

//       const availableQtyAB = abstock ? abstock.available_qty : 0;
//       abData.avlStock = availableQtyAB;

//       const perQty = abData.qty / element.proposed_quantity;
//       const requiredQty = perQty * element.quantity;

//       if (availableQtyAB < requiredQty) {
//         insufficientItems.push({
//           product_name: abData.accessories_name || abData.type_of_basket,
//           product_code: abData.acc_item_code || abData.bas_item_code,
//           required_qty: requiredQty,
//           available_qty: availableQtyAB
//         });
//       }
//     }
//   }

//   for (const ba of data.bomArray) {
//     for (const i of ba.bom_items) {
//       await addStock(
//         i.item_id,
//         data.warehouse_id,
//         i.item_name,
//         ""
//       );

//       const stock = await db.inventory_stock.findOne({
//         where: {
//           item_id: i.item_id,
//           warehouse_id: data.warehouse_id
//         }
//       });

//       const availableQty = stock ? stock.available_qty : 0;
//       i.avlStock = availableQty;

//       if (availableQty < i.quantity) {
//         insufficientItems.push({
//           product_name: i.item_name,
//           product_code: '',
//           required_qty: i.quantity,
//           available_qty: availableQty
//         });
//       }

//       // substitute items
//       for (const j of i.substitute_items) {
//         await addStock(
//           j.item_id,
//           data.warehouse_id,
//           j.item_name,
//           ""
//         );

//         const stock = await db.inventory_stock.findOne({
//           where: {
//             item_id: j.item_id,
//             warehouse_id: data.warehouse_id
//           }
//         });

//         const availableQty = stock ? stock.available_qty : 0;
//         j.avlStock = availableQty;

//         if (availableQty < i.quantity) {
//           insufficientItems.push({
//             product_name: j.item_name,
//             product_code: '',
//             required_qty: i.quantity,
//             available_qty: availableQty
//           });
//         }
//       }
//     }
//   }

//   return { updatedData: data, stockSummary: Object.values(stockSummary), insufficientItems };
// }

// async function manageInventoryLedger(data, actionType,t) {
//   const {
//     id,
//     sales_order_no,
//     grn_no,
//     warehouse_id,
//     financial_id,
//     entity_id,
//     loginEmployee,
//   } = data;

//   let items = [];
//   let referenceTable = "";
//   let referenceNo = "";
//   let ledgerType = "";
//   let msg = "";
//   switch (actionType) {
//     case 'SO':
//     case 'POD':


//       if (actionType === "SO") {
//         ledgerType = "HOLD";
//         msg='Stock Reserved'
//       } else if (actionType === "POD") {
//         ledgerType = "OUT";
//         msg='Delivered'
//       }

//       items = await db.salesOrderItemList.findAll({
//         where: { sales_order_id: id },
//         transaction: t,
//       });
//       referenceTable = "SO";
//       referenceNo = sales_order_no;
//       for (const el of items) {
//         let isExist = await db.inventory_stock.findOne({ where: { item_id: el.product_master_id, warehouse_id: warehouse_id } });
//         if (isExist) {
//           if(actionType === "POD"){

//             await db.inventory_stock.increment({ delivered_qty: el.quantity }, { where: { id: isExist.id }, transaction: t, });
//             await db.inventory_stock.decrement({ hold_qty: el.quantity }, { where: { id: isExist.id }, transaction: t, });
//           }else{
//             await db.inventory_stock.increment({ hold_qty: el.quantity }, { where: { id: isExist.id }, transaction: t, });
//             await db.inventory_stock.decrement({ available_qty: el.quantity }, { where: { id: isExist.id }, transaction: t, });

//           }

//           await db.inventory_ledger.create({
//             quantity: el.quantity, type: ledgerType, reference_table: referenceTable, reference_table_id: el.id,
//             remark: `${msg} Against SO - ${referenceNo}`, financial_year_id: financial_id,
//             entity_id: entity_id, warehouse_id: warehouse_id, item_id: el.product_master_id, created_by: loginEmployee
//           }, { transaction: t });
//         }
//       }
//       break;

//     case 'GRN':
//       // const grnItem = await db.salesOrderItemList.findAll({
//       //   where: { sales_order_id: data.id },
//       //   transaction: t,
//       // });

//       // for (const el of grnItem) {
//       //   let isExist = await db.inventory_stock.findOne({ where: { item_id: el.product_master_id, warehouse_id: warehouse_id } });
//       //   if (isExist) {
//       //     await db.inventory_stock.increment({ hold_qty: el.quantity }, { where: { id: isExist.id }, transaction: t, });
//       //     await db.inventory_stock.decrement({ available_qty: el.quantity }, { where: { id: isExist.id }, transaction: t, });

//       //     await db.inventory_ledger.create({
//       //       quantity: el.quantity, type: "HOLD", reference_table: "SO", reference_table_id: el.id,
//       //       remark: `Stock Reserved Against SO - ${data.sales_order_no}`, financial_year_id: financial_id,
//       //       entity_id: entity_id, warehouse_id: warehouse_id, item_id: el.product_master_id, created_by: loginEmployee
//       //     }, { transaction: t });
//       //   }
//       // }
//       break;
//   }
// }

module.exports.getCustomerAging = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const [dataList] = await db.sequelize.query(`
SELECT S.customer_id,C.company_name AS customer_name,C.customer_code,SC.sactioned_credit_limit,SC.utilized_credit_days,
    SUM(CASE WHEN (S.payment_due_days = '01-30' OR S.payment_due_days = '1-30') THEN S.grand_total ELSE 0 END) AS amt_0_30,
    SUM(CASE WHEN S.payment_due_days = '31-60' THEN S.grand_total ELSE 0 END) AS amt_31_60,
    SUM(CASE WHEN S.payment_due_days = '61-90' THEN S.grand_total ELSE 0 END) AS amt_61_90,
    SUM(CASE WHEN S.payment_due_days = '91-120' THEN S.grand_total ELSE 0 END) AS amt_91_120,
    SUM(CASE WHEN S.payment_due_days = '121-150' THEN S.grand_total ELSE 0 END) AS amt_121_150,
    SUM(CASE WHEN S.payment_due_days = '151-180' THEN S.grand_total ELSE 0 END) AS amt_151_180,
    SUM(CASE WHEN S.payment_due_days = '181-210' THEN S.grand_total ELSE 0 END) AS amt_181_210,
    SUM(CASE WHEN S.payment_due_days = '211-240' THEN S.grand_total ELSE 0 END) AS amt_211_240,
    SUM(CASE WHEN S.payment_due_days = '241-270' THEN S.grand_total ELSE 0 END) AS amt_241_270,
    SUM(CASE WHEN S.payment_due_days = '271-300' THEN S.grand_total ELSE 0 END) AS amt_271_300,
    SUM(CASE WHEN S.payment_due_days = '301-330' THEN S.grand_total ELSE 0 END) AS amt_301_330,
    SUM(CASE WHEN S.payment_due_days = '330+' THEN S.grand_total ELSE 0 END) AS amt_330_plus,
    (SUM(S.grand_total) - COALESCE(P.total_paid, 0)) AS total_amount
FROM CRM_SALES_INVOICE_MST AS S
INNER JOIN CUSTOMER_PROFILE_MST C ON C.id = S.customer_id
INNER JOIN SALES_SUPER_CREDIT_DEBIT_MST AS  SC ON SC.customer_id = S.customer_id
LEFT JOIN (SELECT customer_id,SUM(paid_amount) AS total_paid
FROM PAYMENT_PROGRAM_LIST GROUP BY customer_id) P ON P.customer_id = S.customer_id
WHERE S.entity_id = ${entity_id} AND S.invoice_status ='APPROVED'
GROUP BY S.customer_id, C.company_name`)
    return res.status(200).send({
      code: 200,
      message: "Sales Successfully",
      data: dataList
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
}

module.exports.getCustomerAgingByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;
    const [dataList] = await db.sequelize.query(`
      SELECT S.id,S.customer_id,C.company_name AS customer_name,S.sales_invoice_no,SC.sactioned_credit_limit,SC.utilized_credit_days,
    SUM(CASE WHEN (S.payment_due_days = '01-30' OR S.payment_due_days = '1-30')  THEN S.grand_total ELSE 0 END) AS amt_0_30,
    SUM(CASE WHEN S.payment_due_days = '31-60' THEN S.grand_total ELSE 0 END) AS amt_31_60,
    SUM(CASE WHEN S.payment_due_days = '61-90' THEN S.grand_total ELSE 0 END) AS amt_61_90,
    SUM(CASE WHEN S.payment_due_days = '91-120' THEN S.grand_total ELSE 0 END) AS amt_91_120,
    SUM(CASE WHEN S.payment_due_days = '121-150' THEN S.grand_total ELSE 0 END) AS amt_121_150,
    SUM(CASE WHEN S.payment_due_days = '151-180' THEN S.grand_total ELSE 0 END) AS amt_151_180,
    SUM(CASE WHEN S.payment_due_days = '181-210' THEN S.grand_total ELSE 0 END) AS amt_181_210,
    SUM(CASE WHEN S.payment_due_days = '211-240' THEN S.grand_total ELSE 0 END) AS amt_211_240,
    SUM(CASE WHEN S.payment_due_days = '241-270' THEN S.grand_total ELSE 0 END) AS amt_241_270,
    SUM(CASE WHEN S.payment_due_days = '271-300' THEN S.grand_total ELSE 0 END) AS amt_271_300,
    SUM(CASE WHEN S.payment_due_days = '301-330' THEN S.grand_total ELSE 0 END) AS amt_301_330,
    SUM(CASE WHEN S.payment_due_days = '330+' THEN S.grand_total ELSE 0 END) AS amt_330_plus
FROM CRM_SALES_INVOICE_MST S
INNER JOIN CUSTOMER_PROFILE_MST C ON C.id = S.customer_id
INNER JOIN SALES_SUPER_CREDIT_DEBIT_MST AS  SC ON SC.customer_id = S.customer_id
WHERE  S.customer_id=${id}
GROUP BY S.customer_id, C.company_name,S.id`)
    return res.status(200).send({
      code: 200,
      message: "Sales Successfully",
      data: dataList
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
}

module.exports.getAllcollectionReportData = async (req, res) => {
  try {
    const { id } = req.params;
    const [dataList] = await db.sequelize.query(`
      SELECT 
    PP.*,
    PPL.*,
    CPM.company_name,
    CPM.customer_code,
    CSI.sales_invoice_no,
    CSI.payment_due_days

FROM PAYMENT_PROGRAM AS PP

INNER JOIN PAYMENT_PROGRAM_LIST AS PPL 
    ON PP.id = PPL.payment_program_id

INNER JOIN CUSTOMER_PROFILE_MST AS CPM 
    ON PPL.customer_id = CPM.id

INNER JOIN CRM_SALES_INVOICE_MST AS CSI 
    ON PPL.sales_invoice_id = CSI.id

WHERE 
    PP.document_type IN ('Bank Reciept', 'Cash Reciept')
      `)
    return res.status(200).send({
      code: 200,
      message: "Sales Successfully",
      data: dataList
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
}

const getProposalPreviewData = async (id, proposal_id) => {
  try {

    const proposalData = await db.sequelize.query(
      `SELECT DISTINCT
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
      PPI.pi_number,
             LS.lead_source,
            EMP.first_name,
            EMP.middle_name,
            EMP.last_name,
            EMP.contact_number AS  sales_number,
            CAC.contact_person_name, CAC.mobile,
            EMP.employee_official_email,
            CPHR.employee_official_email AS created_by_email,
           -- W.pin AS warehouse_pin,W.address AS warehouse_address,W.gst AS warehouse_gst,W.email AS warehouse_email,W.contact_number AS warehouse_contact_no,
            CP.valid_till_date,
            F.freight_name,I.insurance_name, 
            PM.payment_name, SP.sub_payment_name,
            CONCAT(B.location_name, ' - ', B.location_code) AS branch_name,W.name AS warehouse_name,DT.delivery_term, UL.unloading, 
            CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
            CPM2.company_name, sb.schedule_delivery_date,
           CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT.countryss_name AS billing_country_name,
            STA.states_name AS billing_state_name, CIT.city_name AS billing_city_name, CACM.email_id as mail_id,  CP.currency_symbol,
            
            CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT2.countryss_name AS shipping_country_name,
            STA2.states_name AS shipping_state_name, CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code
            FROM CRM_VERSION_PROPOSAL_MST AS CV 
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = CV.proposal_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
            LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.customer_id = CP.customer_id
            LEFT JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CSA ON CV.shipping_address_id = CSA.id
            LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CACM ON CACM.customer_id = CP.customer_id
            LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
            LEFT JOIN MASTER_SOURCE AS MS ON C.source_id = MS.id
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON CP.id = PA.proposal_id
            LEFT JOIN SALES_BOOKING AS sb ON sb.proposal_id = ${proposal_id} AND sb.version_id = ${id}
            LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = ${proposal_id} AND PPI.version_id = ${id}
             INNER  JOIN CUSTOMER_PROFILE_MST AS CPM2 ON CP.customer_id = CPM2.id
              LEFT JOIN LOCATION_MASTER AS B ON CP.location_id = B.id
             LEFT JOIN WAREHOUSE_MASTER AS W ON CP.warehouse_id = W.id
             LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS DT ON CP.delivery_term_id = DT.id
              LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS UL ON CP.unloading_resp_id = UL.id
              LEFT JOIN CRM_PAYMENT_MAIN_MST AS PM ON CP.payment_main_id = PM.id
              LEFT JOIN CRM_SUB_PAYMENT_MAIN_MST AS SP ON CP.sub_payment_main_id = SP.id
              LEFT JOIN CRM_FREIGHT_MST AS F ON CP.freight_id = F.id
              LEFT JOIN CRM_INSURANCE_MST AS I ON CP.insurance_id = I.id
              LEFT JOIN HRMS_REGISTERED_USER AS CPHR ON CP.employee_id = CPHR.employee_id
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
                            
              LEFT JOIN MASTER_COUNTRY AS CUT2 ON CAM.shipping_country_id = CUT2.countryss_id
              LEFT JOIN MASTER_STATE AS STA2 ON CAM.shipping_state_id = STA2.states_id
              LEFT JOIN MASTER_CITY AS CIT2 ON CAM.shipping_city_id = CIT2.city_id
              
              INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CAC ON CP.customer_id = CAC.customer_id


                -- here code for dealer address
                            LEFT JOIN CUSTOMER_PROFILE_MST AS DP ON CPM2.dealer_id = DP.id
                            LEFT JOIN CUSTOMER_ADDRESS_MST AS DADD ON DP.id=DADD.customer_id
                            
                LEFT JOIN MASTER_COUNTRY AS DC ON DADD.billing_country_id = DC.countryss_id
              LEFT JOIN MASTER_STATE AS DS ON DADD.billing_state_id = DS.states_id
              LEFT JOIN MASTER_CITY AS DCITY ON DADD.billing_city_id = DCITY.city_id
            WHERE CV.id = ${id}`
    );

    const dataList = await db.sequelize.query(
      `SELECT DISTINCT CP.id AS id_product, CP.dbp,CP.totalPrice,CP.totalWithGst,CP.id AS product_id, CP.qty, CP.cgst, CP.approvel_status, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, CP.totalDiscountAmount,
            CP.discount_request, CP.discount_approved, P.id AS product_master_id, 
          --  P.item_name AS product_name, 
          COALESCE(CI.item_name, P.item_name) AS product_name,
            P.item_code AS product_code, 
            P.description AS product_description, CP.new_item, CP.promo_item, CP.apply_scheme, CP.scheme_id, CP.price_per_unit, 
            CP.maximum_discount, CP.product_category_id, U.uom_name, U.uom_id, CP.pro_sub_cat_id, CP.select_scheme, 
            PCT.id AS proposal_customisation_id, PCD.id AS customisation_data_id, PCD.customization_type, PCD.qty AS custom_qty,
            PCT.qty AS product_qty, PCT.order_qty, PCT.total_in_gst, PCT.grand_in_total,  PCD.gst, PCD.total_price, PCD.price_per_unit AS unit_price,
            PCT.grand_out_total, PCT.substract_total, PCT.add_total, PCT.proposal_no, PCT.remarks, PCT.status, 
            PCT.createdAt, PCT.updatedAt, PCT.proposal_item_id, PCT.version_id, P.hsn_code_id, HSN.hsn_sac_code, P.uom_id, UM.uom_name,
            CRB.id AS branding_id, CRB.qty AS branding_qty, CRB.branding_description, CRB.branding_sides, CRB.branding_amt,
            CRB.proposal_no AS branding_proposal_no, CRB.status AS branding_status, CRB.createdAt AS branding_createdAt,
            PCD.accessory_in_category, PCD.accessory_in_sub_category, PCD.accessory_in_name,
            ma.asset_category_name, msc.sub_category_name, mi.item_name,
            PCD.with_gst AS customisation_with_gst,
          PCD.after_discount AS customisation_after_discount,
          PCD.discount AS customisation_discount,
          CRB.with_gst AS branding_with_gst,
          MBR.type_of_branding,
          MBR.price_per_unit AS branding_price_per_unit, 
          CRB.after_discount AS branding_after_discount,
          CRB.discount AS branding_discount,
          ACC.accessories_name, ACC.accessories_price,
          ACC.hsn_code_id AS acce_hsn_id,
          AHSN.hsn_sac_code AS acce_hsn_sac_code,AGRM.value AS acce_gst_value,
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
          CP.totalDiscountAmount,
          PCD.totalDiscountAmount AS customisation_totalDisAmt, 
          CRB.totalDiscountAmount AS branding_totalDisAmt,
          CP.totalDiscountAmountPerQTY,
          PCD.totalDiscountAmountPerQTY AS totalDiscountAmountPerQTYC, 
          CRB.totalDiscountAmountPerQTY AS totalDiscountAmountPerQTYB, 
          CP.warranty,  BHSN.hsn_sac_code AS branding_hsn_sac_code ,
          MGRN.value AS branding_gst_value,MID.image AS item_img_path,
          MB.type_of_basket,MB.basket_qty, MB.price_per_unit AS basket_price_per_unit, MHSN.hsn_sac_code AS basket_hsn_code, GRMM.value As basket_gst_value,
            CRB.updatedAt AS branding_updatedAt, CRB.proposal_item_id AS branding_proposal_item_id, CRB.version_id AS branding_version_id
            ,ACCUOM.uom_name as accuom_name,BRAUOM.uom_name as brauom_name,BASUOM.uom_name as basuom_name
            FROM CRM_CREATE_PROPOSAL_MST AS C  
            LEFT JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
            INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON CP.proposal_id = C.id
            LEFT JOIN MASTER_ITEM AS P ON CP.product_master_id = P.id 
            LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT AS MID ON MID.item_id = P.id
            LEFT JOIN MASTER_UOM AS U ON U.uom_id = CP.uom_id
            LEFT JOIN MASTER_UOM AS UM ON UM.uom_id = P.uom_id
            LEFT JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = CP.version_id
            LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE AS PCT ON PCT.proposal_item_id = CP.id
            LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_DATA AS PCD ON PCD.proposal_customisation_id = PCT.id
            LEFT JOIN MASTER_ACCESSORIES_NAME AS ACC ON ACC.id = PCD.accessory_in_name
            LEFT JOIN MASTER_UOM AS ACCUOM ON ACCUOM.uom_id = ACC.uom_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS AHSN ON AHSN.id = ACC.hsn_code_id
            LEFT JOIN CRM_PROPOSAL_BRANDING AS CRB ON PCT.id = CRB.proposal_customisation_id
            LEFT JOIN MASTER_BRANDING AS MBR ON MBR.id = CRB.branding_mst_id
            LEFT JOIN MASTER_UOM AS BRAUOM ON BRAUOM.uom_id = MBR.uom_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS BHSN ON BHSN.id = MBR.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS MGRN ON MGRN.id = BHSN.gst_rate_id
            LEFT JOIN GST_RATE_MASTER AS AGRM ON AGRM.id = AHSN.gst_rate_id 
            LEFT JOIN MASTER_BASKET AS MB ON MB.id = PCD.basket_mst_id
            LEFT JOIN MASTER_UOM AS BASUOM ON BASUOM.uom_id = MB.uom_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS MHSN ON MHSN.id = MB.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS GRMM ON GRMM.id = MHSN.gst_rate_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = P.hsn_code_id
            LEFT JOIN MASTER_ITEM AS mi ON mi.id = PCD.accessory_in_name
            LEFT JOIN MASTER_ASSET AS ma ON ma.id = PCD.accessory_in_category
            LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = PCD.accessory_in_sub_category
            LEFT JOIN CUSTOMER_ITEM_MAPPING AS CI ON P.id = CI.item_id
            WHERE CV.id = ${id} AND CV.proposal_id = ${proposal_id} AND CP.isDeleted = 0`
    );

    const [grossDiscountData] = await db.sequelize.query(
      `SELECT DISTINCT
                CASE 
                    WHEN GD.discount_type = 'percent' 
                        THEN CONCAT(GD.discount_value, '%')
                    ELSE CAST(GD.discount_value AS CHAR)
                END AS discount,
                GDM.discount_name
            FROM CRM_PROPOSAL_GROSS_DISCOUNT AS GD
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP 
                ON CP.id = GD.proposal_id
            INNER JOIN CRM_PROPOSAL_GROSS_DISCOUNT_MST AS GDM 
                ON GDM.id = GD.gross_discount_id
            WHERE GD.proposal_id = ${proposal_id} 
              AND GD.version_id = ${id}
              AND GD.discount_type IS NOT NULL
              AND GD.discount_value IS NOT NULL`
    );


    const [paymentDetails] = await db.sequelize.query(
      `SELECT DISTINCT CP.id,CP.payment_name,PD.payment_value
            FROM CRM_PROPOSAL_PAYMENT_DETAILS AS PD
            INNER JOIN CRM_PAYMENT_MAIN_MST AS CP 
                ON CP.id = PD.payment_id
            WHERE PD.proposal_id = ${proposal_id} 
              AND PD.version_id = ${id} ORDER BY CP.id`
    );

    const charges = await db.proposalAddtionalCharges.findAll({
      where: { proposal_id: proposal_id, version_id: id },
    });

    const productMap = new Map();

    for (const row of dataList[0]) {
      const productId = row.product_id;

      if (!productMap.has(productId)) {
        const baseProduct = {
          id_product: row.id_product,
          dbp: row.dbp,
          totalPrice: row.totalPrice,
          totalWithGst: row.totalWithGst,
          product_id: row.product_id,
          qty: row.qty,
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
          discount1: (row.discount1Mode ?? '') === 'percent' ? (row.discount1 || 0) + '%' : (row.discount1Flat || 0),
          discount2: (row.discount2Mode ?? '') === 'percent' ? (row.discount2 || 0) + '%' : (row.discount2Flat || 0),
          discount3: (row.discount3Mode ?? '') === 'percent' ? (row.discount3 || 0) + '%' : (row.discount3Flat || 0),
          product_master_id: row.product_master_id,
          product_name: row.product_name,
          product_code: row.product_code,
          product_description: row.product_description,
          new_item: row.new_item,
          promo_item: row.promo_item,
          apply_scheme: row.apply_scheme,
          scheme_id: row.scheme_id,
          price_per_unit: row.price_per_unit,
          maximum_discount: row.maximum_discount,
          product_category_id: row.product_category_id,
          uom_name: row.uom_name,
          uom_id: row.uom_id,
          item_img_path: row.item_img_path,
          warranty: row.warranty,
          totalDiscountAmount: row.totalDiscountAmount,
          totalDiscountAmountPerQTY: row.totalDiscountAmountPerQTY,
          paymentTC: row.paymentTC,
          pro_sub_cat_id: row.pro_sub_cat_id,
          select_scheme: row.select_scheme,
          custom_branding: [] // <- Instead of 3 separate fields
        };
        productMap.set(productId, baseProduct);
      }

      const product = productMap.get(productId);

      // add Installation Kit (BOM) 
      const bomKits = await db.SALESCRM_BOM_KIT.findAll({ where: { item_list_id: row.product_id } });

      if (bomKits.length > 0) {
        product.bomArray = [];
        for (const bom of bomKits) {
          const bomItems = await db.SALESCRM_BOM_KIT_ITEM.findAll({
            where: {
              sc_bom_id: bom.id
            }
          });

          product.bomArray.push({
            bom_id: bom.bom_id,
            item_list_id: bom.item_list_id,
            bom_name: bom.bom_name,
            price_per_unit: bom.price_per_unit,
            gst: bom.gst,
            hsn_code: bom.hsn_code,
            qty: bom.bom_qty,
            discountType: bom.discountType,
            discount: bom.discount,
            totalDiscountAmountPerQTY: bom.totalDiscountAmountPerQTY,
            totalDiscountAmount: bom.totalDiscountAmount,
            total_price: bom.total_price,
            totalWithGst: bom.totalWithGst,

            items: bomItems.map(item => ({
              item_id: item.bom_item_id,
              item_name: '',
              qty: item.qty_per_bom,
              substitute_item_id: item.bom_subitem_id,
              substitute_item_name: ''
            }))
          });
        }
      }

      // Find or create the custom_branding entry by proposal_customisation_id
      let customBrandingEntry = product.custom_branding.find(cb => cb.id === row.proposal_customisation_id);
      if (!customBrandingEntry && row.proposal_customisation_id) {
        customBrandingEntry = {
          id: row.proposal_customisation_id,
          qty: row.branding_qty,
          order_qty: row.order_qty,
          select_scheme: row.select_scheme,
          total_in_gst: row.total_in_gst,
          grand_in_total: row.grand_in_total,
          grand_out_total: row.grand_out_total,
          substract_total: row.substract_total,
          customization_type: row.customization_type,
          gst: row.gst,
          unit_price: row.unit_price,
          add_total: row.add_total,
          proposal_no: row.proposal_no,
          remarks: row.remarks,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          proposal_item_id: row.proposal_item_id,
          version_id: row.version_id,
          with_gst: row.branding_with_gst,
          discount: row.customisation_discount ? (row.customisation_discount || 0) + '%' : 0,
          schedule_delivery_date: row.schedule_delivery_date,
          branding_after_discount: row.branding_after_discount,
          customisation_with_gst: row.customisation_with_gst,
          customisation_data: [],
          branding_data: null
        };
        product.custom_branding.push(customBrandingEntry);
      }

      // Push customisation_data
      if (row.customisation_data_id && customBrandingEntry) {
        customBrandingEntry.customisation_data.push({
          id: row.customisation_data_id,
          proposal_customisation_id: row.proposal_customisation_id,
          customization_type: row.customization_type,
          discount: row.customisation_discount ? (row.customisation_discount || 0) + '%' : 0,
          gst: row.gst,
          total_price: row.total_price,
          qty: row.custom_qty,
          acce_price_per_unit: row.unit_price,
          accessory_in_name: row.accessory_in_name,
          accessory_in_category: row.accessory_in_category,
          accessory_in_sub_category: row.accessory_in_sub_category,
          item_name: row.accessories_name,
          asset_category_name: row.asset_category_name,
          sub_category_name: row.sub_category_name,
          type_of_basket: row.type_of_basket,
          basket_qty: row.basket_qty,
          price_per_unit: row.basket_price_per_unit,
          basket_hsn_code: row.basket_hsn_code,
          basket_gst_value: row.basket_gst_value,
          acce_hsn_sac_code: row.acce_hsn_sac_code,
          acce_gst_value: row.acce_gst_value,
          totalDiscountAmount: row.customisation_totalDisAmt,
          totalDiscountAmountPerQTY: row.totalDiscountAmountPerQTYC,
          uom_name: row.accuom_name || row.basuom_name
        });
      }

      // Add branding_data (inside the same custom_branding entry)
      if (
        row.branding_id &&
        row.branding_proposal_item_id &&
        customBrandingEntry &&
        customBrandingEntry.id === row.proposal_customisation_id
      ) {
        customBrandingEntry.branding_data = {
          id: row.branding_id,
          qty: row.branding_qty,
          order_qty: row.order_qty,
          discount: row.branding_discount ? (row.branding_discount || 0) + '%' : 0,
          branding_after_discount: row.branding_after_discount,
          branding_with_gst: row.branding_with_gst,
          branding_description: row.branding_description,
          branding_amt: row.branding_amt,
          branding_sides: row.branding_sides,
          proposal_no: row.branding_proposal_no,
          status: row.branding_status,
          createdAt: row.branding_createdAt,
          updatedAt: row.brandingUpdatedAt,
          proposal_item_id: row.branding_proposal_item_id,
          version_id: row.branding_version_id,
          proposal_customisation_id: row.proposal_scheme_type_id || null,  // If you're selecting this in query
          branding_hsn_sac_code: row.branding_hsn_sac_code,
          branding_gst_value: row.branding_gst_value,
          type_of_branding: row.type_of_branding,
          branding_price_per_unit: row.branding_price_per_unit,
          totalDiscountAmount: row.branding_totalDisAmt,
          totalDiscountAmountPerQTY: row.totalDiscountAmountPerQTYB,
          uom_name: row.brauom_name
        };
      }
    }

    const productDetailList = Array.from(productMap.values());

    // Extract first valid scheme_id
    let scheme_id = null;
    for (const item of productDetailList) {
      if (item.scheme_id !== null) {
        scheme_id = item.scheme_id;
        break;
      }
    }

    let sales_documents = await db.proposal_documents.findAll({
      where: {
        proposal_id: proposal_id,
        version_id: id
      },
      attributes: ['documents', 'proposal_id', 'version_id']
    });



    const Obj = {
      ...proposalData[0][0],
      charges: charges,
      productDetailList: productDetailList,
      grossDiscountDetail: grossDiscountData,
      sales_documents: sales_documents,
      paymentData: paymentDetails,
      scheme_id: scheme_id,
    };

    return Obj;

  } catch (error) {
    return;
  }
};

module.exports.downloadSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const salesInvoiceData = await db.salesOrder.findOne({
      where: { id: id },

      include: [
        {
          model: db.customerProfile,
          // as: "customer"
        },
        {
          model: db.salesOrderItemNew,

        },
        {
          model: db.customerAddressContact,

        },
        {
          model: db.warehouse,
          as: "warehouseData"
        },
        {
          model: db.versionData,
          include: [
            {
              model: db.customerShippingAddress
            },
            {
              model: db.customerAddress,
              include: [
                {
                  model: db.states
                }
              ]
            }
          ]
        },


      ]
    });

    if (!salesInvoiceData) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const { pdfBuffer, fileName } = await generateSOPdf(salesInvoiceData);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdfBuffer.length
    });
    // res.setHeader("Content-Type","application/pdf");

    // res.setHeader("Content-Disposition",`attachment; filename="${fileName}"`);

    return res.send(pdfBuffer);

  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: error.message });
  }
};


function generateItemRows(items, level = 0, parentNo = "") {
  let rows = "";

  items.forEach((item, index) => {

    let rowNo = "";

    if (level === 0) {
      rowNo = `${index + 1}`;
    } else {
      rowNo = `${parentNo}${getAlpha(index)}`;
    }

    const total =
      (item.dataValues.qty || 0) *
      (
        (item.dataValues.price_per_unit || 0) -
        (item.dataValues.discount_per_unit || 0)
      );
    const qty = Number(item.dataValues.qty) || 0;
    const pricePerUnit = Number(item.dataValues.price_per_unit) || 0;
    const discountPerUnit = Number(item.dataValues.discount_per_unit) || 0;

    const grossAmount = pricePerUnit * qty;
    const discountAmount = discountPerUnit * qty;
    const taxableAmount = grossAmount - discountAmount;

    let igstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let gstRate = 0;

    if (item.dataValues.igstRate > 0) {
      gstRate = item.dataValues.igst;
      igstAmount = (taxableAmount * item.dataValues.igst) / 100;

    } else {
      gstRate = item.dataValues.cgst + item.dataValues.sgst;
      cgstAmount = (taxableAmount * item.dataValues.cgst) / 100;
      sgstAmount = (taxableAmount * item.dataValues.sgst) / 100;

    }
    rows += `
      <tr style="height:100px;">
        <td style="border-left: none;">${rowNo}</td>
        <td>${item.dataValues.item_code ?? ''}</td>

        <td style="padding-left:${level * 25}px;">
          ${level > 0 ? "└ " : " "}
         &nbsp; ${item.dataValues.item_name || ""}
          <span style="color:#777">
            (${item.dataValues.item_type || ""})
          </span>
        </td>

        <td>${item.dataValues.hsncode || ""}</td>


        <td>
          ${item.dataValues.qty || 0}
          ${item.dataValues.UOM || ""}
        </td>

        <td style="text-align:right">
          ${Number(item.dataValues.price_per_unit || 0).toFixed(2)}
        </td>
        <td style="text-align:right">
        ${((item.dataValues.price_per_unit || 0) * (item.dataValues.qty || 0)).toFixed(2)}
        </td>

        <td style="text-align:right">
          ${Number(item.dataValues.discount_per_unit || 0).toFixed(2)}
        </td>
        <td style="text-align:right">
          ${Number(taxableAmount || 0).toFixed(2)}
        </td>
        <td style="text-align:right">
          ${Number(gstRate || 0).toFixed(2)}
        </td>
        <td style="text-align:right">
          ${Number(cgstAmount || 0).toFixed(2)}
        </td>
        <td style="text-align:right">
          ${Number(sgstAmount || 0).toFixed(2)}
        </td>
        <td style="text-align:right; border-right:none">
          ${Number(igstAmount || 0).toFixed(2)}
        </td>

      
      </tr>
    `;

    if (item.children?.length) {
      rows += generateItemRows(
        item.children,
        level + 1,
        rowNo + "."
      );
    }
  });

  return rows;
}


function calculateTotals(items) {

  let totalDiscount = 0;
  let totalTaxableAmount = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalAmount = 0;

  function processItems(items) {

    items.forEach(item => {

      const qty = Number(item.dataValues.qty) || 0;

      const price = Number(item.dataValues.price_per_unit) || 0;

      const discount = Number(item.dataValues.discount_per_unit) || 0;

      const grossAmount = price * qty;

      const discountAmount = discount * qty;
      const taxableAmount = grossAmount - discountAmount;
      const igstRate = Number(item.dataValues.igstRate) || 0;
      const igst = Number(item.dataValues.igst) || 0;
      const cgst = Number(item.dataValues.cgst) || 0;
      const sgst = Number(item.dataValues.sgst) || 0;

      let cgstAmount = 0;
      let sgstAmount = 0;
      let igstAmount = 0;

      if (igstRate > 0) {
        igstAmount = taxableAmount * igst / 100;
      } else {
        cgstAmount = taxableAmount * cgst / 100;
        sgstAmount = taxableAmount * sgst / 100;
      }
      totalDiscount += discountAmount;
      totalTaxableAmount += taxableAmount;
      totalCGST += cgstAmount;
      totalSGST += sgstAmount;
      totalIGST += igstAmount;

      totalAmount += grossAmount;

      // Child items
      if (item.children?.length) {
        processItems(item.children);
      }

    });
  }

  processItems(items);
  const subTotal = totalTaxableAmount;

  // Total GST
  const totalGSTAmount =
    totalCGST +
    totalSGST +
    totalIGST;

  // Final Bill Amount
  const totalBillAmount =
    subTotal +
    totalGSTAmount;
  return {
    totalDiscount,
    totalTaxableAmount,
    totalAmount,

    totalCGST,
    totalSGST,
    totalIGST,

    subTotal,
    totalGSTAmount,
    totalBillAmount
  };
}
async function generateSOPdf(salesInvoiceData) {
  const htmlPath = path.join(__dirname, "../../../CRM/utils/templates/salesOrderPdf.html");
  let htmlTemplate = fs.readFileSync(htmlPath, "utf8");

  const treeItems = buildTree(
    salesInvoiceData.SALES_ORDER_ITEM_LIST_NEWs || []
  );
const logoPath = path.join(__dirname, "../../../CRM/utils/templates/selected-logo.jpg");
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    company_logo = logoBase64;
  const itemRows = generateItemRows(treeItems);
  const footerRow = calculateTotals(treeItems)
  let heading = "Sales Invoice";
  let elanName = salesInvoiceData?.dealer == 1 ? salesInvoiceData?.dealer_company_name : "Elan Professional Appliances Pvt. Ltd.";
  let mainAddress = salesInvoiceData?.dealer == 1 ? `${salesInvoiceData?.warehouseData?.address},${salesInvoiceData?.warehouseData?.pin}` : 'Tower-2, DLF Corporate Greens, 802, Sector 74A </br> Gurugram, Haryana 122004'

  let datas = salesInvoiceData?.sales_order_no
  let company_gstin = salesInvoiceData?.company_gstin;
  let billing = salesInvoiceData?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST
  const stateData = await db.states.findOne({where:{states_id:billing?.billing_state_id}});
  let shipping = salesInvoiceData?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_SHIPPING_ADDRESS_MST
  const finalHtml = htmlTemplate.replace(/{{sales_order_no}}/g, salesInvoiceData.sales_order_no || "")
    .replace(/{{customer_name}}/g, salesInvoiceData?.CUSTOMER_PROFILE_MST?.company_name || "")
    .replace(/{{sales_order_date}}/g, salesInvoiceData.sales_order_date || "")
    .replace(/{{warehouse_name}}/g, salesInvoiceData?.warehouseData?.name || "")
    .replace(/{{warehouse_gst}}/g, salesInvoiceData?.warehouseData?.gst || "")
    .replace(/{{net_amount}}/g, Number(salesInvoiceData.grand_total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, }))
    .replace(/{{gst_amount}}/g, Number(salesInvoiceData.total_gst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, }))
    .replace(/{{gross_amount}}/g, Number(salesInvoiceData.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, }))
    .replace(/{{itemRows}}/g, itemRows)
    .replace(/{{totalAmount}}/g, footerRow.totalAmount)
    .replace(/{{totalDiscount}}/g, footerRow.totalDiscount)
    .replace(/{{totalTaxableAmount}}/g, footerRow.totalTaxableAmount)
    .replace(/{{totalCGST}}/g, footerRow.totalCGST)
    .replace(/{{totalSGST}}/g, footerRow.totalSGST)
    .replace(/{{totalIGST}}/g, footerRow.totalIGST)
    .replace(/{{subTotal}}/g, footerRow.subTotal)
    .replace(/{{totalGSTAmount}}/g, footerRow.totalGSTAmount)
    .replace(/{{totalBillAmount}}/g, footerRow.totalBillAmount)
    .replace(/{{company_gstin}}/g, company_gstin ? company_gstin : '')
    .replace(/{{elanName}}/g, elanName)
    .replace(/{{mainAddress}}/g, mainAddress)
    .replace(/{{employee_official_email}}/g, salesInvoiceData?.created_by?.employee_official_email)
    .replace(/{{contact_number}}/g, salesInvoiceData?.created_by?.contact_number)
    .replace(/{{first_name}}/g, salesInvoiceData?.created_by?.first_name)
    .replace(/{{last_name}}/g, salesInvoiceData?.created_by?.last_name)
    .replace(/{{middel_name}}/g, salesInvoiceData?.created_by?.middel_name)
    .replace(/{{titles}}/g, salesInvoiceData?.created_by?.title)
    .replace(/{{contact_person_name}}/g, '')
    .replace(/{{billing_postal_address}}/g, salesInvoiceData?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_postal_address)
    .replace(/{{billing_address}}/g, salesInvoiceData?.CRM_VERSION_PROPOSAL_MST?.CUSTOMER_ADDRESS_MST?.billing_address)
    .replace(/{{billing_pin_code}}/g, billing?.billing_pin_code)
    .replace(/{{states_code}}/g, stateData?.states_code)
    .replace(/{{states_name}}/g, stateData?.states_name)
    .replace(/{{billing_gst_in}}/g, billing.gst_in ? billing?.gst_in : '')
    .replace(/{{shipping_pin_code}}/g, shipping?.shipping_pin_code)
    .replace(/{{shipping_postal_address}}/g, shipping?.shipping_postal_address)
    .replace(/{{shipping_address}}/g, shipping?.shipping_address)
    .replace(/{{shipping_gst_in}}/g, shipping.shipping_gst_in ? shipping?.shipping_gst_in : '')
    .replace(/{{mobile}}/g, salesInvoiceData?.billing_contact_person_no)
    .replace(/{{title}}/g, salesInvoiceData?.billing_contact_person)
    .replace(/{{company_logo}}/g, company_logo)
    .replace(/{{totalInWords}}/g, `${numberToWordsIndian(footerRow.totalBillAmount)}`);

  const pdfBuffer = await generatePDF(finalHtml);

  return {
    pdfBuffer,
    fileName: `Invoice-${salesInvoiceData.invoice_no}.pdf`
  };
}
function buildTree(data = []) {

    const map = new Map();

    const roots = [];

    data.forEach(item => {

        const itemId =
            Number(item.id);

        map.set(itemId, {
            ...item,
            children: []
        });

    });

    data.forEach(item => {

        const itemId =
            Number(item.id);

        const node =
            map.get(itemId);

        const parentId =
            item.parent_item_id == null ||
                item.parent_item_id === ""
                ? null
                : Number(item.parent_item_id);

        if (
            !parentId ||
            !map.has(parentId)
        ) {

            roots.push(node);

        } else {


            map
                .get(parentId)
                .children
                .push(node);

        }

    });

    return roots;
}

function getAlpha(index) {
  return String.fromCharCode(97 + index);
}