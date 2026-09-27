const { json } = require("body-parser");
const db = require("../../../models/index");
const { Op, where } = require("sequelize");
const mailQueue = require("../../utils/mail/mailQueue");
const { sendMail, generateInvoicePdf, sendPerformaInoviceMail, sendQuotationVersionMail, sendPerformaInoviceReMail } = require("../../utils/mail/mail");
const createLeadDetails = require("../../CreateLead/model/createLeadDetails");
const chartOfAccountsModel = require("../../../Finance_And_Accounting/Charts_Of_Accounts/models/chartOfAccountsModel");
const { version } = require("pdfkit");
const { GoogleGenAI } = require('@google/genai');
const fs = require("fs");
const path = require("path");
const { includes } = require("lodash");

module.exports.getProposalCompanyData = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { proposal_no } = req.body;

    // Fetch the company data
    const companyData = await db.sequelize.query(
      `SELECT CLM.id, CLM.company_name, MS.source_name, CLM.entity_id, CLM.financial_year_id, 
                    CLM.dynamic_fields, CLM.address, CLM.mail_id, CLM.contact_number, CLM.contact_person_name, CLM.lead_owner 
             FROM CRM_CREATE_LEAD_MST AS CLM 
             INNER JOIN MASTER_SOURCE AS MS ON CLM.source_id = MS.id 
             WHERE CLM.id = :id`,

      { replacements: { id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!companyData || companyData.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "Company data not found" });
    }

    // await remove_scheme_handler(id, proposal_no)
    // Fetch CRM details with product and uom info
    const crmDetailRecords = await db.createLeadDetails.findAll({
      where: { create_lead_id: id, isDeleted: false },
      include: {
        model: db.ItemMaster,
        include: {
          model: db.uom,
        },
      },
    });

    const crmDetails = [];
    let scheme_id = null;

    for (const record of crmDetailRecords) {
      const detail = record.toJSON();

      // Set scheme_id if applicable
      if (!scheme_id && detail.apply_scheme) {
        scheme_id = detail.scheme_id;
      }

      // Get scheme details if available
      const schemeRecord = await db.proposal_scheme_type.findOne({
        where: { proposal_item_id: detail.id },
        attributes: [
          "id",
          "select_scheme",
          "order_qty",
          "qty",
          "total_in_gst",
          "grand_in_total",
          "grand_out_total",
          "substract_total",
          "add_total",
          "proposal_no",
          "customer_type",
          "remarks",
          "proposal_item_id",
          "customer_item_id",
        ],
      });

      detail.select_scheme = schemeRecord ? schemeRecord.select_scheme : null;
      detail.order_qty = schemeRecord ? schemeRecord.order_qty : null;
      detail.customization = schemeRecord || null;

      // Fetch related scheme data (array of rows)
      let customisation_data = [];
      if (schemeRecord && schemeRecord.id) {
        customisation_data = await db.proposal_scheme_data.findAll({
          where: { proposal_scheme_type_id: schemeRecord.id },
        });
      }

      // Fetch branding scheme data for the detail item
      let branding_data = [];
      branding_data = await db.proposal_branding_scheme.findAll({
        where: { proposal_item_id: detail.id },
      });

      // Attach these additional fields to the detail
      detail.customisation_data = customisation_data;
      detail.branding_data = branding_data;

      crmDetails.push(detail);
    }

    let schemeData;
    if (scheme_id) {
      schemeData = await db.scheme_master_promo_item.findAll({
        where: { scheme_mst_id: scheme_id },
      });
    }

    // Check if proposal exists
    const proposalExist = await db.proposalData.findOne({
      where: { create_lead_id: companyData[0].id },
      order: [["createdAt", "DESC"]],
    });

    if (!proposalExist) {
      return res.status(200).send({
        code: 200,
        message: "Success",
        data: companyData[0],
        scheme_id,
        schemeData,
        crmDetails,
      });
    }

    // Fetch proposal metadata
    const dataExist = await db.proposalData.findOne({
      attributes: [
        "id",
        "proposal_no",
        "proposal_type",
        "gst_no",
        "total_cost",
        "additional_charges",
        "discount",
        "taxable_value",
        "sgst",
        "cgst",
        "company_name",
        "contact_person_name",
        "contact_number",
        "lead_owner",
        "igst",
        "grant_total",
        "mail_id",
        "proposal_status",
      ],
      where: { id: proposalExist.id },
    });

    if (!dataExist) {
      return res
        .status(404)
        .send({ code: 404, message: "Proposal data not found" });
    }

    // Fetch related product data P.maximum_discount,
    const [productData] = await db.sequelize.query(
      `SELECT DISTINCT CL.qty, CL.cgst, CL.sgst, CL.igst, CL.gst_type, CL.discount_request,
                    CL.product_category_id, CL.discount_approved, CL.product_master_id, CL.pro_sub_cat_id,
                    P.hsn_code_id, HSN.hsn_sac_code, P.igst AS gst, P.item_name AS product_name, P.item_code AS product_code, P.description AS product_description,
                    CL.price_per_unit,  B.uom_name, B.uom_id
             FROM CRM_PROPOSAL_LIST_MST AS CL
             INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CL.proposal_id = C.id
             INNER JOIN MASTER_ITEM AS P ON P.id = CL.product_master_id
             INNER JOIN MASTER_UOM AS B ON B.uom_id = CL.uom_id
             LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = P.hsn_code_id
             WHERE CL.proposal_id = ${proposalExist.id}`
    );

    const responseObj = {
      ...dataExist.dataValues,
      productDetailList: productData,
      companyData,
      crmDetails,
    };

    return res.status(200).send({
      code: 200,
      message: "Success",
      scheme_id: scheme_id,
      responseObj,
      //  productDetailList: productData,
      companyData,
      crmDetails,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

const remove_scheme_handler = async (quotation_id, proposal_no) => {
  try {
    let isExist = await db.createLeadDetails.findOne({
      where: { create_lead_id: quotation_id, proposal_no: proposal_no },
    });
    if (isExist) {
      return { code: 200, message: "Proposal already existed" };
    }
    const whereCondition = {
      apply_scheme: true,
    };

    if (quotation_id) {
      whereCondition.create_lead_id = quotation_id;
    }

    // Delete promo items
    const deleteCondition = {
      proposal_no: { [Op.ne]: proposal_no },
      isDeleted: { [Op.ne]: 1 },
    };

    if (quotation_id) {
      deleteCondition.create_lead_id = quotation_id;

      // Fetch all items
      let itemNo = await db.createLeadDetails.findAll({
        where: { create_lead_id: quotation_id, isDeleted: false },
      });

      if (itemNo.length) {
        for (let item of itemNo) {
          if (item.id) {
            await db.proposal_branding_scheme.destroy({
              where: { proposal_item_id: item.id },
            });

            const schemeTypes = await db.proposal_scheme_type.findAll({
              where: { proposal_item_id: item.id },
            });

            for (let schemeType of schemeTypes) {
              if (schemeType.id) {
                await db.proposal_scheme_data.destroy({
                  where: { proposal_scheme_type_id: schemeType.id },
                });

                await db.proposal_scheme_type.destroy({
                  where: { id: schemeType.id },
                });
              }
            }
          }
        }
      }

      await db.createLeadDetails.update(
        { proposal_no: null },
        { where: { create_lead_id: quotation_id, isDeleted: true } }
      );

      await db.createLeadDetails.destroy({ where: deleteCondition });
      await db.createLeadDetails.update(
        { isDeleted: false },
        { where: { create_lead_id: quotation_id } }
      );
    }

    // Reset scheme flags
    const updateCondition = {
      apply_scheme: 0,
      scheme_id: null,
    };

    if (quotation_id) {
      await db.createLeadDetails.update(updateCondition, {
        where: { create_lead_id: quotation_id },
      });
    }

    return { code: 200, message: "Promo scheme removed successfully." };
  } catch (error) {
    console.error("Error in remove_scheme_handler:", error.message);
    return { code: 500, message: error.message };
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

module.exports.createProposal = async (req, res) => {
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
      is_same_as_shipping,
      dealer,
      currency_id,
      billing_address_id,
      shipping_address_id
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
    let autoApprovedPI = false;
    let isExistProposal = await db.proposalData.findOne({ where: { id: id } });
    let isCustomerShippingAddress;
const exchangeRate = await db.currency_convert.findOne({where:{Currency_Convert_id:currency_id}});
    if (is_same_as_shipping) {

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
    }else{
      isCustomerShippingAddress={id:shipping_address_id}
    }
    if (!isExistProposal) {
      proposal_no = await generateNextProposalNo(1);
    } else {
      proposal_no = isExistProposal.proposal_no;
    }

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
    let level1;
    let getLevels;
    if (request_type == "discount") {
      let getResult = await newWorkFlow(employee_id, productDetailList, id ? isExistProposal.customer_id : customer_id);
      getLevels = getResult.matchedLevel
      level1 = getLevels.find(l => l.level_type === "Level 1");
      level1.approval_status === "APPROVED"
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
    if (!level1) {
      level1 = { approval_status: "approved" };
    }
    if (!id) {
      if (!existing_client) {
        const leadExists = await db.createLead.findOne({
          where: { id: create_lead_id },
        });
        if (!leadExists) {
          return res.status(404).send({ code: 404, message: "Lead not found" });
        }
      }

      const existingProposalsCount = await db.proposalData.count({
        where: { id: null },
      });
      const versionId = `V${existingProposalsCount + 1}`;
      customer_id ? customer_id : null;
      const proposalObject = {
        financial_year_id,
        entity_id,
        proposal_no,
        proposal_type_id,
        gst_no,
        create_lead_id,
        employee_id,
        // mail_id,
        common_id,
        // company_name,
        lead_owner,
        // contact_person_name,
        // contact_number,
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
        dealer,
        existing_client,
        // proposal_status: request_type !== "normal" ? "pending" : "approved",
        proposal_status: quotationType == true ? "approved" : "draft",
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
        location_id, advance_amount, advance_check,
        warehouse_id,
        // grossTotal: grossTotal ? grossTotal : grant_total
        grossTotal: grossTotal,
        quotation_type: quotationType == true ? 'direct' : 'in direct'
      };


      if (!employee_id) await sendMail(mail_id);

      const createdProposal = await db.proposalData.create(proposalObject);

      if (!createdProposal || !createdProposal.id) {
        return res.status(500).send({
          code: 500,
          message: "Failed to create proposal, ID is null",
        });
      }
      if (!level1) {
        level1 = { approval_status: "approved" };
      }
      const createVersion = await db.versionData.create({
        version: versionId,
        proposal_id: createdProposal.id,
        version_status: level1.approval_status,
        // version_status: request_type !== "normal" ? "pending" : "approved",
        shipping_address_id: isCustomerShippingAddress.id,
        billing_address_id: billing_address_id,
        is_same_as_shipping,
        is_discount_requested: is__discount_requested,
        currency_id,
        exchange_rate:exchangeRate?.rate
      });

      // use for Approval Mechanism Workflow
      await insertApprovalWorkflow(request_type, getLevels, entity_id, financial_year_id, createdProposal.id, createVersion.id);

      // Delete existing proposal list items before adding new ones
      await db.proposalList.destroy({
        where: { proposal_id: createdProposal.id },
      });

      try {
        await Promise.all(
          productDetailList.map(async (product, index) => {
            try {
              const savedProduct = await insertProductData(product, createdProposal.id, createVersion.id, schemeData, request_type, index, level1.approval_status);

              // If product failed → skip everything for this item
              if (!savedProduct.success || !savedProduct.id) {
                console.warn(`Skipping index ${index}, product insert failed`);
                return; // ← THIS CONTINUES LOOP AUTOMATICALLY
              }

              // distribute gross discount per item (only item level, no sub-items)
              await insertGrossDiscountBreakup(product?.grossDiscountBreakup, createdProposal.id, createVersion.id, savedProduct.id);

              // use for Installation Kit (BOM)
              if (Array.isArray(product.bomArray) && product.bomArray.length > 0) {
                await insertInstallationKitBOM(product.bomArray, savedProduct.id);
              }

              if (Array.isArray(product.subItems) && product.subItems.length > 0) {
                // discount customization or branding
                await insertCustomizationsAndBranding(product.subItems, savedProduct.id, proposal_no, createVersion.id);
              }
              else if (Array.isArray(product?.custom_branding)) {
                // without discount customization or branding
                await insertCustomizationsAndBrandingWOD(product?.custom_branding, savedProduct.id, proposal_no, createVersion.id);
              } else {
                console.warn(`Missing custom_branding array for product ID: ${savedProduct.id}`);
              }
            } catch (err) {
              console.error(`Error processing product at index ${index}:`, err);
            }
          })
        );

        // insert gross discount details
        await insertGrossDiscount(grossDiscountDetails, createdProposal.id, createVersion.id);

        // insert payment term details
        await insertPaymentTerm(PaymentArray, createdProposal.id, createVersion.id);
      } catch (error) {
        console.error("Unexpected error in proposal creation:", error);
      }

      if (quotationType) {
        let pi_number = await generateNextProposalNo(2);
        // await db.proposal_performa_invoice.destroy({ where: { version_id: createVersion.id } })
        let isCreated = await db.proposal_performa_invoice.create({
          proposal_id: createdProposal.id,
          version_id: createVersion.id,
          remark: '',
          financial_year_id,
          entity_id,
          created_by: login_id,
          expiry_date: expiry_date === 'Invalid date' ? null : expiry_date,
          pi_number: pi_number,
          approvel_status: request_type !== "discount" ? "APPROVED" : "PENDING",
          quotation_type: request_type !== "discount" ? "in direct" : "direct"
        });
        if (isCreated && request_type !== "discount") {
          await db.versionData.update(
        
            { exchange_rate:exchangeRate?.rate,is_booking_created: true, shipping_address_id: isCustomerShippingAddress.id, is_same_as_shipping: is_same_as_shipping, billing_address_id: billing_address_id },

            { where: { id: createVersion.id } }
          );
        }
        // save documents
        if (sales_documents) {
          await db.proposal_documents.create({
            documents: sales_documents,
            proposal_id: createdProposal.id,
            version_id: createVersion.id,
          })
        }
      }
      let previewData = {
        proposal_id: createdProposal.id,
        version_id: createVersion.id,
      }
      return res
        .status(201)
        .send({ code: 201, message: "Created successfully", data: previewData });
    } else {
      const proposalExists = await db.proposalData.findOne({ where: { id } });

      if (!proposalExists) {
        return res.status(404).send({ code: 404, message: "Proposal not found" });
      }

      // const existingProposalsCount1 = await db.versionData.max('version', { where: { proposal_id: id } });
      // const versionId1 = existingProposalsCount1;
      // const tempVersionNumber = parseInt(versionId1.slice(1), 10) + 1;
      // const versionNumber = `V${tempVersionNumber}`;

      const proposalObject = {
        financial_year_id,
        entity_id,
        proposal_no,
        proposal_type_id,
        gst_no,
        create_lead_id,
        employee_id,
        // mail_id,
        common_id,
        // company_name,
        lead_owner,
        // contact_person_name,
        // contact_number,
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
        // proposal_status: request_type !== "normal" ? "pending" : "approved",
        //proposal_status: "draft",
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
        versionId = req.body?.version_id ?? req.body?.isPreviewVersion
      }
      let versionData = await db.versionData.findOne({ where: { id: versionId } });

      let versionNumber;
      if (versionData?.is_quotation_created === true && !proformaStatus) {
        const existingProposalsCount1 = await db.versionData.max('version', { where: { proposal_id: id } });
        const versionId1 = existingProposalsCount1;
        const tempVersionNumber = parseInt(versionId1.slice(1), 10) + 1;
        versionNumber = `V${tempVersionNumber}`;
      }
      else if (versionData?.is_quotation_created === true && proformaStatus) {
        const existingProposalsCount1 = await db.versionData.max('version', { where: { proposal_id: id, is_pi_created: true } });
        const versionId1 = existingProposalsCount1;
        const tempVersionNumber = 1;
        versionNumber = `V${1}`;
      }
      else if (pi && versionData?.is_pi_created) {
        const existingProposalsCount1 = await db.versionData.max('version', { where: { proposal_id: id, is_pi_created: true } });
        const versionId1 = existingProposalsCount1;
        const tempVersionNumber = parseInt(versionId1.slice(1), 10) + 1;
        versionNumber = `V${tempVersionNumber}`;
      }







      let versionData2 = await db.versionData.findOne({ where: { proposal_id: id, is_pi_created: false, is_sales_booking_version: false, is_quotation_created: false } });
      if (versionData2 && versionData2.is_quotation_created === false) {
        versionData = versionData2
      }

      if (type === "edit" && !isPreviewVersion || changed) {
        delete proposalObject.customer_id;
        // delete proposalObject.is__discount_requested;
        // let x=request_type !== "normal" && changed ? "pending" : "approved";
        //         console.log('request_type ====>',x)

        await db.proposalData.update(proposalObject, { where: { id } });
        // is_quotation_created
        let createVersion
        let isPiCreated = false;
        if (proformaStatus || pi) {

          // await db.versionData.update({
          //   is_quotation_created: true,
          //   // is_pi_created: true
          // }, { where: { id: req.body.version_id } });
          // isPiCreated = true;
        }
        if ((versionData?.is_quotation_created === true && !proformaStatus) || (versionData?.is_quotation_created === true && proformaStatus) || (pi && versionData?.is_pi_created)) {
          console.log(quotationType)
          if (!level1) {
            level1 = { approval_status: "approved" };
          }

          createVersion = await db.versionData.create({
            version: versionNumber,
            proposal_id: id,
            version_status: level1.approval_status,
            // version_status: request_type !== "normal" ? "pending" : "approved",
            shipping_address_id: isCustomerShippingAddress.id,
            is_same_as_shipping,
            billing_address_id: billing_address_id,
            is_pi_created: isPiCreated,
            is_discount_requested: is__discount_requested,
            currency_id,exchange_rate:exchangeRate?.rate
          });
        } else {
          if (versionData2) {

            createVersion = { id: changed ? isPreviewVersion : versionData2.id };
          } else {

            createVersion = { id: changed ? isPreviewVersion : req.body?.version_id };
          }

          await db.versionData.update({
            version_status: level1.approval_status, shipping_address_id: isCustomerShippingAddress.id, is_same_as_shipping: is_same_as_shipping,
            // version_status: request_type !== "normal" ? "pending" : "approved", shipping_address_id: isCustomerShippingAddress.id, is_same_as_shipping: is_same_as_shipping,
            billing_address_id: billing_address_id,
            is_discount_requested: is__discount_requested,
            currency_id,exchange_rate:exchangeRate?.rate
          }, { where: { id: createVersion.id } });
        }

        if (proformaStatus) {
          let oldAmt = parseFloat(proposalExists.grant_total);
          let newAmt = parseFloat(finalGrandTotal ? finalGrandTotal : grant_total);
          if (proposalExists.is__discount_requested && oldAmt == newAmt) {

            await db.versionData.update({ exchange_rate:exchangeRate?.rate,version_status: "approved",currency_id }, { where: { id: createVersion.id } });
            autoApprovedPI = true;
            request_type = 'normal';
          }
          let pi_number = await generateNextProposalNo(2);
          const dealerValue = proposalExists?.dealer ?? 0;

          await db.proposal_performa_invoice.destroy({ where: { version_id: createVersion.id } })
          await db.proposal_performa_invoice.create({
            proposal_id: id,
            version_id: createVersion.id,
            remark: '',
            financial_year_id,
            entity_id,
            created_by: login_id,
            expiry_date: expiry_date === 'Invalid date' ? null : expiry_date,
            pi_number: pi_number,
            dealer: dealerValue
          });

          if (advance_check) {
            await db.proposalData.update({ advance_amount, advance_check }, { where: { id } })
          }
          // destroy table for version update case
          await destroyProposalData(createVersion?.id);

        } else if (pi) {
          await db.proposal_performa_invoice.update({
            version_id: createVersion.id,
            remark: '',
            financial_year_id,
            entity_id,
            created_by: login_id,
            expiry_date: expiry_date === 'Invalid date' ? null : expiry_date,

          }, { where: { proposal_id: id } });

          // destroy table for version update case
          await destroyProposalData(createVersion?.id);
        }
        else {
          // destroy table for version update case
          await destroyProposalData(createVersion?.id);
        }

        // use for Approval Mechanism Workflow
        await insertApprovalWorkflow(request_type, getLevels, entity_id, financial_year_id, id, createVersion.id);

        try {
          await Promise.all(
            productDetailList.map(async (product, index) => {
              try {
                const savedProduct = await insertProductData(product, id, createVersion.id, schemeData, request_type, index, level1.approval_status);

                // If product failed → skip everything for this item
                if (!savedProduct.success || !savedProduct.id) {
                  console.warn(`Skipping index ${index}, product insert failed`);
                  return; // ← THIS CONTINUES LOOP AUTOMATICALLY
                }

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
        }

        return res
          .status(200)
          .send({ code: 200, message: "Updated successfully", data: previewData });
      }
      else if (type === "edit" && isPreview) {
        const proposalObject = {
          financial_year_id,
          entity_id,
          proposal_no,
          proposal_type_id,
          gst_no,
          create_lead_id,
          employee_id,
          // mail_id,
          common_id,
          // company_name,
          lead_owner,
          // contact_person_name,
          // contact_number,
          is__discount_requested: request_type == "discount" ? true : false,
          total_cost,
          additional_charges,
          //customer_id: customer_id ? customer_id : contact_person_id,
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
          // proposal_status: request_type !== "normal" ? "pending" : "approved",
          //proposal_status: "draft",
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
        await db.proposalData.update(proposalObject, { where: { id } });
        await db.versionData.update({ exchange_rate:exchangeRate?.rate,currency_id,shipping_address_id: isCustomerShippingAddress.id, is_same_as_shipping,   billing_address_id: billing_address_id, is_discount_requested: is__discount_requested }, { where: { id: isPreviewVersion } });
        // await insertPaymentTerm(PaymentArray, id, isPreviewVersion);

        // destroy table for version update case
        await destroyProposalData(isPreviewVersion);
        try {
          // use for Approval Mechanism Workflow
          await insertApprovalWorkflow(request_type, getLevels, entity_id, financial_year_id, id, isPreviewVersion);

          await Promise.all(
            productDetailList.map(async (product, index) => {
              try {
                const savedProduct = await insertProductData(product, id, isPreviewVersion, schemeData, request_type, index, level1.approval_status);

                // If product failed → skip everything for this item
                if (!savedProduct.success || !savedProduct.id) {
                  console.warn(`Skipping index ${index}, product insert failed`);
                  return; // ← THIS CONTINUES LOOP AUTOMATICALLY
                }

                // distribute gross discount per item (only item level, no sub-items)
                await insertGrossDiscountBreakup(product?.grossDiscountBreakup, id, isPreviewVersion, savedProduct.id);

                // use for Installation Kit (BOM)
                if (Array.isArray(product.bomArray) && product.bomArray.length > 0) {
                  await insertInstallationKitBOM(product.bomArray, savedProduct.id);
                }

                if (Array.isArray(product.subItems) && product.subItems.length > 0) {
                  // discount customization or branding
                  await insertCustomizationsAndBranding(product.subItems, savedProduct.id, proposal_no, isPreviewVersion);
                }
                else if (Array.isArray(product?.custom_branding)) {
                  // without discount customization or branding
                  await insertCustomizationsAndBrandingWOD(product?.custom_branding, savedProduct.id, proposal_no, isPreviewVersion);
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
          await insertGrossDiscount(grossDiscountDetails, id, isPreviewVersion);

          // insert payment term details
          await insertPaymentTerm(PaymentArray, id, isPreviewVersion);
        } catch (error) {
          console.error("Unexpected error in proposal creation:", error);
        }

        let previewData = {
          proposal_id: id,
          version_id: isPreviewVersion,
        }
        return res.status(200).send({ code: 200, message: "Updated successfully", data: previewData });
      }
      else {
        await db.proposalData.update(proposalObject, { where: { id } });
        let createVersion;
        createVersion = { id: req.body?.version_id };

        // save documents
        if (sales_documents) {
          await db.proposal_documents.create({
            documents: sales_documents,
            proposal_id: id,
            version_id: createVersion.id,
          })
        }
        let previewData = {
          proposal_id: createdProposal.id ?? id,
          version_id: createVersion.id,
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

// use for insert product data one by one
async function insertProductData(product, createdProposalId, createVersionId, schemeData, request_type, index, status) {

  try {
    if (!product) {
      console.warn(`Product ${index !== null ? "at index " + index : ""} is null. Skipping...`);
      return { success: false, id: null };
    }

    let versionStatus = await db.versionData.findOne({ where: { id: createVersionId } })
    let totalPrice = product?.totalPrice ? product.totalPrice : (product?.qty ?? 0) * (product?.max_price ?? product?.price_per_unit ?? 0);
    let GST = product?.gst ? product?.gst : product?.igst;
    let gstAmount = (totalPrice * GST) / 100; // GST amount
    let grandTotal = totalPrice + gstAmount; // Grand total with GST
    let TotalWIthGST = product?.totalWithGst ? product?.totalWithGst : grandTotal;

    const savedProduct = await db.proposalList.create({
      ...product,
      price_per_unit: product?.maxPrice ?? product?.max_price ?? product?.dbp ?? product?.price_per_unit,
      igst: GST,
      totalPrice: totalPrice,
      totalWithGst: TotalWIthGST,
      min_price: product?.minPrice ?? product?.min_price ?? product?.dbp ?? product?.max_price ?? product?.price_per_unit,
      dbp: product?.dbp ?? product?.max_price ?? product?.price_per_unit,
      warranty: product?.warranty,
      discount1Mode: product?.discount1Mode,
      discount2Mode: product?.discount2Mode,
      discount3Mode: product?.discount3Mode,
      discount1Flat: product?.discount1Flat,
      discount2Flat: product?.discount2Flat,
      discount3Flat: product?.discount3Flat,
      flatPercentage1: product?.flatPercentage1,
      flatPercentage2: product?.flatPercentage2,
      flatPercentage3: product?.flatPercentage3,
      totalDiscountAmount: product?.totalDiscountAmountItem,
      totalDiscountAmountPerQTY: product?.totalDiscountAmountPerQTY,
      discount_request: product?.discount_request || product?.totalDiscountPercentItem,
      new_item: product.new_item || false,
      apply_scheme: product.apply_scheme,
      promo_item: product.promo_item || false,
      pro_sub_cat_id: product.product_sub_category_id,
      approvel_status: versionStatus?.version_status,
      // approvel_status:
      //   request_type === "discount"
      //     ? "PENDING"
      //     : request_type === "normal"
      //       ? "APPROVED"
      //       : "UNKNOWN",
      scheme_id: schemeData,
      action_type: true,
      version_status: product.promo_item
        ? product.version_status
        : "draft",
      qty: product.qty,
      select_scheme: product.select_scheme || [],
      proposal_id: createdProposalId,
      version_id: createVersionId
    });

    // Return full savedProduct (or just ID)
    //return savedProduct;
    return { success: true, id: savedProduct.id };

  } catch (err) {
    console.error("Error inserting product:", err.message);
    return { success: false, id: null };
  }
}

// distribute gross discount per item (only item level, no sub-items)
async function insertGrossDiscountBreakup(grossDiscountBreakup, proposalId, versionId, savedProductId) {

  if (grossDiscountBreakup && grossDiscountBreakup.length) {
    grossDiscountBreakup.forEach(async el => {
      if (el.enterValue) {
        await db.grossDiscountBreakup.create({
          gross_discount_id: el.id,
          discount_type: el.type,
          discount_value: el.enterValue,
          perQtyAmount: el.perQtyAmount,
          perQtyPercent: el.perQtyPercent,
          proposal_id: proposalId,
          version_id: versionId,
          proposal_list_id: savedProductId
        })
      }
    });
  }

}

// use for insert gross discount values
async function insertGrossDiscount(grossDiscountDetails, proposalId, versionId) {

  if (grossDiscountDetails && grossDiscountDetails.length) {
    for (const el of grossDiscountDetails) {
      if (el.value) {
        await db.discountDetails.create({
          gross_discount_id: el.id,
          discount_type: el.type,
          discount_value: el.value,
          discount_amount: el.amount,
          proposal_id: proposalId,
          version_id: versionId
        })
      }
    }
  }

}

// use for insert payment term values
async function insertPaymentTerm(PaymentArray, proposalId, versionId) {

  if (PaymentArray && PaymentArray.length) {
    for (const el of PaymentArray) {
      if (el.payment_value) {
        await db.paymentDetails.create({
          payment_id: el.payment_id,
          payment_value: el.payment_value,
          proposal_id: proposalId,
          version_id: versionId
        })
      }
    }
  }
}

// use for Installation Kit (BOM)
async function insertInstallationKitBOM(bomArray, savedProductId) {

  if (!bomArray?.length) return;

  for (const bom of bomArray) {

    // Create BOM Header
    const createdBom = await db.SALESCRM_BOM_KIT.create({
      item_list_id: savedProductId,
      bom_id: bom.bom_id ?? bom.subItemId,
      bom_qty: bom.qty,
      pending_qty: bom.qty,
      price_per_unit: bom.price_per_unit ?? bom.dbp,
      gst: bom.gst,
      bom_name: bom.bom_name ?? bom.subItemName,
      hsn_code: bom.hsn_code,
      discountType: bom.discountType ?? bom.discountType1,
      discount: bom.discount ?? bom.discount1,
      totalDiscountAmountPerQTY: bom.totalDiscountAmountPerQTY,
      totalDiscountAmount: bom.totalDiscountAmount ?? bom.totalDiscountAmountItem,
      total_price: bom.total_price ?? bom.totalPrice,
      totalWithGst: bom.totalWithGst
    });

    // Prepare BOM Items
    const bomItems = bom.items.map(item => ({
      sc_bom_id: createdBom.id,
      bom_item_id: item.item_id,
      qty_per_bom: item.qty,
      bom_subitem_id: item.substitute_item_id
    }));

    if (bomItems.length) {
      await db.SALESCRM_BOM_KIT_ITEM.bulkCreate(bomItems);
    }
  }
}

// use for discount customization or branding
async function insertCustomizationsAndBranding(subItems, savedProductId, proposalNo, versionId) {

  // Get unique indexes
  const uniqueIndexes = [...new Set(subItems.map(i => i.customization_type_table_index))];

  for (const index of uniqueIndexes) {
    const subItemsForIndex = subItems.filter(i => i.customization_type_table_index === index);

    // Create proposal_customisation_type once per index
    const customizationType = await db.proposal_customisation_type.create({
      proposal_item_id: savedProductId,
      proposal_no: proposalNo,
      qty: subItemsForIndex[0]?.customisationType?.qty ? subItemsForIndex[0]?.customisationType?.qty : subItemsForIndex[0]?.qty || 0,
      select_scheme: subItemsForIndex[0]?.customisationType
        ? subItemsForIndex[0].customisationType.select_scheme || []
        : subItemsForIndex[0]?.select_scheme || [],
      total_in_gst: subItemsForIndex[0]?.customisationType?.total_in_gst || 0,
      total_out_gst: subItemsForIndex[0]?.customisationType?.total_out_gst || 0,
      grand_in_total: subItemsForIndex[0]?.customisationType?.grand_in_total || 0,
      grand_out_total: subItemsForIndex[0]?.customisationType?.grand_out_total || 0,
      substract_total: subItemsForIndex[0]?.customisationType?.substract_total || 0,
      add_total: subItemsForIndex[0]?.customisationType?.add_total || 0,
      remarks: subItemsForIndex[0]?.customisationType?.remarks || "",
      order_qty: subItemsForIndex[0]?.customisationType?.order_qty,
      version_id: versionId,
      action_type: true,
      remaining_qty: subItemsForIndex[0]?.customisationType?.remaining_qty || 0,
    });

    // Insert all subItems for this index
    const customizationData = subItemsForIndex
      .filter(item => item.subItemType === 'Customization')
      .map(item => ({
        proposal_customisation_id: customizationType.id,
        qty: item.qty || 0,
        price_per_unit: item.minPrice || 0,
        accessory_in_category: item.accessory_in_category || null,
        accessory_in_sub_category: item.accessory_in_sub_category || null,
        accessory_in_name: item.accessory_in_name || null,
        total_price: item.totalPrice || 0,
        gst: item.gst || 0,
        discount: item?.discount1,
        discountType: item?.discountType1,
        totalDiscountAmount: item?.totalDiscountAmountItem,
        totalDiscountAmountPerQTY: item?.totalDiscountAmountPerQTY,
        after_discount: item.totalPrice,
        with_gst: item?.totalWithGst,
        customization_type: item.customization_type || "",
        custome_type: item.custome_type || null,
        basket_mst_id: item.basket_mst_id || null,
        no_of_partician: item.no_of_partician || null,
      }));

    if (customizationData.length > 0) {
      await db.proposal_customisation_data.bulkCreate(customizationData);
    }

    const brandingData = subItemsForIndex
      .filter(item => item.subItemType === 'Branding')
      .map(item => ({
        proposal_customisation_id: customizationType.id,
        branding_mst_id: item.brandingTypes,
        qty: item.qty || 0,
        proposal_no: proposalNo,
        branding_description: item.subItemName || "",
        discount: item?.discount1,
        discountType: item?.discountType1,
        totalDiscountAmount: item?.totalDiscountAmountItem,
        totalDiscountAmountPerQTY: item?.totalDiscountAmountPerQTY,
        with_gst: item?.totalWithGst,
        after_discount: item.totalPrice,
        branding_amt: item.maxPrice || 0,
        branding_sides: item.branding_sides || [],
        proposal_item_id: savedProductId,
        version_id: versionId,
        action_type: true,
        gst: item.gst || 0,
      }));

    if (brandingData.length > 0) {
      await db.proposal_branding.bulkCreate(brandingData);
    }
  }
}

// use for without discount customization or branding
async function insertCustomizationsAndBrandingWOD(subItems, savedProductId, proposalNo, versionId) {

  for (const customItem of subItems) {
    if (!customItem) continue;

    // 1 Create parent row (one per item)
    const customizationType = await db.proposal_customisation_type.create({
      proposal_item_id: savedProductId,
      proposal_no: proposalNo,
      version_id: versionId,
      qty: customItem?.qty || 0,
      select_scheme: customItem?.customisationType ? customItem.customisationType.select_scheme || [] : customItem?.select_scheme || [],
      total_in_gst: customItem?.total_in_gst || 0,
      grand_in_total: customItem?.grand_in_total || 0,
      substract_total: customItem?.substract_total || 0,
      add_total: customItem?.customisationType?.add_total || 0,
      remarks: customItem?.customisationType?.remarks || "",
      order_qty: customItem?.order_qty,
      action_type: true,
      remaining_qty: customItem?.remaining_qty || 0,
    });

    // 2 Prepare customization_data bulk rows
    let customizationRows = [];

    if (Array.isArray(customItem.customisation_data)) {
      customizationRows = customItem.customisation_data.map((el) => ({
        proposal_customisation_id: customizationType.id,
        qty: el.qty || 0,
        price_per_unit: el.price_per_unit || 0,
        accessory_in_name: el.accessory_in_name || null,
        total_price: el.totalPrice || 0,
        gst: el.gst || 0,
        discount: el?.discount1,
        discountType: el?.discountType1,
        totalDiscountAmount: el?.totalDiscountAmountItem,
        totalDiscountAmountPerQTY: el?.totalDiscountAmountPerQTY,
        after_discount: el.totalPrice,
        with_gst: el?.totalWithGst,
        customization_type: el.customization_type || null,
        custome_type: el.custome_type || null,
        basket_mst_id: el.basket_mst_id || null,
        no_of_partician: el.no_of_partician || null,
      }));
    }

    // 3 Bulk insert customisation_data (fast)
    if (customizationRows.length > 0) {
      await db.proposal_customisation_data.bulkCreate(customizationRows);
    }

    // 4 Prepare branding_data bulk rows
    let brandingRows = [];
    const branding = customItem?.branding_data;

    if (branding) {
      brandingRows.push({
        proposal_customisation_id: customizationType.id,
        proposal_no: proposalNo,
        proposal_item_id: savedProductId,
        version_id: versionId,
        branding_mst_id: branding?.brandingTypes ? branding?.brandingTypes : customItem.brandingTypes,
        qty: branding?.qty ? branding?.qty : customItem.qty || 0,
        branding_description: branding?.branding_description || "",
        discount: branding?.discount1,
        discountType: branding?.discountType1,
        totalDiscountAmount: branding?.totalDiscountAmountItem,
        totalDiscountAmountPerQTY: branding?.totalDiscountAmountPerQTY,
        with_gst: branding?.totalWithGst,
        after_discount: branding?.totalPrice,
        branding_amt: branding?.branding_amt || 0,
        gst: branding?.gst || 0,
        branding_sides: branding?.branding_sides || [],
        action_type: true
      });
    }

    // 5 Bulk insert branding_data (fast)
    if (brandingRows.length > 0) {
      await db.proposal_branding.bulkCreate(brandingRows);
    }
  }
}

// use for Approval Mechanism Workflow
async function insertApprovalWorkflow(request_type, getLevels, entity_id, financial_year_id, proposalNo, versionId) {
  // approvel_status: isLevelExist.approval_status=="APPROVED"?"APPROVED":"PENDING",
  // progressStatus: isLevelExist.approval_status=="APPROVED"?"CLOSE":"OPEN",
  if (request_type === "discount") {
    const isLevelExist = getLevels[0];
    for (let level of getLevels) {
      await db.proposalApprovel.create({
        level: level.level,
        employee_id: level.employee_id,
        workflow_id: level.workflow_id,
        role_id: level.role_id,
        workflow_type: "Quotation",
        qa_detail_id: level.id,
        entity_id: entity_id,
        financial_year_id: financial_year_id,
        proposal_id: proposalNo,
        version_id: versionId,
        approvel_status: isLevelExist.approval_status == "APPROVED" ? "APPROVED" : "PENDING",
        progressStatus: isLevelExist.approval_status == "APPROVED" ? "CLOSE" : "OPEN",
        // approvel_status: level.approval_status ,
        // progressStatus: level.progressStatus,
      });
    }
  } else if (request_type !== "discount" && getLevels) {
    for (let level of getLevels) {
      await db.proposalApprovel.create({
        level: level.level,
        employee_id: level.employee_id,
        workflow_id: level.workflow_id,
        role_id: level.role_id,
        workflow_type: "Quotation",
        qa_detail_id: level.id,
        entity_id: entity_id,
        financial_year_id: financial_year_id,
        approvel_status: "APPROVED",
        progressStatus: "CLOSE",
        proposal_id: proposalNo,
        version_id: versionId,
      });
    }
  }

}

// use for update version destroy table data 
async function destroyProposalData(versionId) {

  const itemIds = await db.proposalList.findAll({where: { version_id: versionId },attributes: ["id"]});
  const proposalItemIds = itemIds.map(x => x.id);

  if (proposalItemIds.length) {

    const bomKits = await db.SALESCRM_BOM_KIT.findAll({
      where: {
        item_list_id: {
          [Op.in]: proposalItemIds
        }
      },
      attributes: ["id"]
    });

    const bomIds = bomKits.map(x => x.id);

    if (bomIds.length) {
      await db.SALESCRM_BOM_KIT_ITEM.destroy({
        where: {
          sc_bom_id: {
            [Op.in]: bomIds
          }
        }
      });
    }

    await db.SALESCRM_BOM_KIT.destroy({
      where: {
        item_list_id: {
          [Op.in]: proposalItemIds
        }
      }
    });
  }

  let isExistCustomisationType = await db.proposal_customisation_type.findAll({ where: { version_id: versionId }, attributes: ["id"] });
  if (isExistCustomisationType.length) {
    for (const element of isExistCustomisationType) {
      await db.proposal_customisation_data.destroy({ where: { proposal_customisation_id: element.id } });
      await db.proposal_branding.destroy({ where: { proposal_customisation_id: element.id, version_id: versionId } });
    }
  }

  await db.proposal_customisation_type.destroy({ where: { version_id: versionId } });
  await db.proposalList.destroy({ where: { version_id: versionId } });
  await db.discountDetails.destroy({ where: { version_id: versionId } });
  await db.paymentDetails.destroy({ where: { version_id: versionId } });
  await db.proposalApprovel.destroy({ where: { version_id: versionId } });
  await db.grossDiscountBreakup.destroy({ where: { version_id: versionId } });

}

const newWorkFlow = async (employee_id, productDetailList, customer_id) => {
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
          item_id = product.product
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


  let [priceMaster] = await db.sequelize.query(`
    SELECT * FROM MASTER_PRICE AS MP  INNER JOIN MASTER_ITEM_PRICE AS MIP ON MP.id = MIP.price_master_id
    WHERE MP.customer_id=${customer_id} 
    `)
  const priceMasterWithDiscount = priceMaster.map(el => ({
    ...el,
    discount: el.discount_1 + el.discount_2 + el.discount_3
  }));

  // console.log(priceMasterWithDiscount, 'get price master', priceMaster)
  // let matchedLevel = matchedLevels.map(elem => {
  //   let approval_status = "PENDING";
  //   let progressStatus = "OPEN";
  //   let levelStatus=[];
  //   productDetailList.forEach(item => {
  //     if (elem.sub_category_id == item.product_sub_category_id) {
  //       if ((elem.discount >= item.totalDiscountPercentItem)||(elem.discount >= item.discount_request )) {
  //         approval_status = "APPROVED";
  //         progressStatus = "CLOSE";
  //         console.log("approved by category");
  //       }else {
  //         priceMasterWithDiscount.forEach(pi => {
  //           if (pi.item_id == item.product_master_id) {
  //             if ((pi.discount >= item.totalDiscountPercentItem)||(pi.discount >= item.discount_request )) {
  //               approval_status = "APPROVED";
  //               progressStatus = "CLOSE";
  //               console.log("approved by item");
  //             }              
  //           }
  //         });
  //       }
  //       levelStatus.push({
  //         status:approval_status,
  //         level_type:elem.level_type,
  //         ...item
  //       })
  //       return;
  //     } 
  //   });
  //   const isExist = levelStatus.find(x=>x.status=="PENDING");
  //   if(isExist){

  //     return {
  //       ...elem,
  //       approval_status:isExist.status,
  //       progressStatus:"OPEN"
  //     };
  //   }else{

  //     return {
  //       ...elem,
  //       approval_status:"APPROVED",
  //       progressStatus:"CLOSE"
  //     };
  //   }

  // });
  // -----------------------------------------------------
  // STEP 1: Build item × level approval matrix
  // -----------------------------------------------------

  let itemLevelStatus = {};  // { itemID: { Level 1: APPROVED, Level 2: PENDING } }

  productDetailList.forEach(item => {

    matchedLevels.forEach(level => {

      if (level.sub_category_id !== item.product_sub_category_id) return;

      let isApproved = false;

      // -------- CATEGORY APPROVAL --------
      if (
        level.discount >= item.totalDiscountPercentItem ||
        level.discount >= item.discount_request
      ) {
        isApproved = true;
      }

      // -------- ITEM APPROVAL --------
      if (!isApproved) {
        const pi = priceMasterWithDiscount.find(
          p => p.item_id === item.product_master_id
        );

        if (pi) {
          if (
            pi.discount >= item.totalDiscountPercentItem ||
            pi.discount >= item.discount_request
          ) {
            isApproved = true;
          }
        }
      }

      // -------- SAVE STATUS (per item per level) --------
      if (!itemLevelStatus[item.product_master_id]) {
        itemLevelStatus[item.product_master_id] = {};
      }

      itemLevelStatus[item.product_master_id][level.level_type] =
        isApproved ? "APPROVED" : "PENDING";

    });

  });


  // -----------------------------------------------------
  // STEP 2: APPLY FIRST-LEVEL RULE
  // (Item first level status → all levels same)
  // -----------------------------------------------------

  Object.keys(itemLevelStatus).forEach(itemID => {

    const levelObj = itemLevelStatus[itemID];

    // Sort levels like: Level 1, Level 2, Level 3, ...
    const levelKeys = Object.keys(levelObj).sort();

    const firstLevel = levelKeys[0];
    const firstApprovalStatus = levelObj[firstLevel];

    // Apply same status to all levels for that item
    levelKeys.forEach(levelKey => {
      itemLevelStatus[itemID][levelKey] = firstApprovalStatus;
    });

  });


  // -----------------------------------------------------
  // STEP 3: Build final LEVEL response
  // -----------------------------------------------------

  let matchedLevel = matchedLevels.map(level => {

    // Gather approval of all items for this particular level
    let itemsForThisLevel = Object.values(itemLevelStatus)
      .map(item => item[level.level_type])
      .filter(x => x !== undefined);

    // If no items → default pending
    if (itemsForThisLevel.length === 0) {
      return {
        ...level,
        approval_status: "PENDING",
        progressStatus: "OPEN"
      };
    }

    // If ANY item pending → level pending
    const hasPending = itemsForThisLevel.includes("PENDING");

    const approval_status = hasPending ? "PENDING" : "APPROVED";
    const progressStatus = hasPending ? "OPEN" : "CLOSE";

    return {
      ...level,
      approval_status,
      progressStatus
    };

  });

  return { matchedLevel, maxDisountLevel }


  // const level = matchedLevel.filter(l => l.level_type  === "Level 1");
  // const level1 = level.find(x=>x.approval_status!=='PENDING');
  // if (level1) {
  //   if (level1.approval_status === "APPROVED") {
  //     console.log("LEVEL1 approved → all levels approved!");

  //     matchedLevel = matchedLevel.map(l => ({
  //       ...l,
  //       approval_status: "APPROVED",
  //       progressStatus: "CLOSE"
  //     }));

  //   } else {
  //     console.log("LEVEL1 pending → all levels pending!");

  //     matchedLevel = matchedLevel.map(l => ({
  //       ...l,
  //       approval_status: "PENDING",
  //       progressStatus: "OPEN"
  //     }));
  //   }
  // }

  // return { matchedLevel, maxDisountLevel };


}

function assignIncrementalLevels(data) {
  const counters = {}; // sub_category_id => current level

  return data.map(item => {
    const catId = item.sub_category_id;

    // Initialize counter if not present
    if (!counters[catId]) {
      counters[catId] = 1;
    }

    // Assign level
    const level = counters[catId];

    // Increment for next item in same category
    counters[catId]++;

    return {
      ...item,
      level: level
    };
  });
}

// In some utility file or service layer (e.g., services/customisationService.js)
const getCustomisationwithbranding = async (
  proposal_item_id,
  proposal_no,
  db
) => {
  if (isNaN(proposal_item_id)) {
    throw new Error("Invalid proposal item ID");
  }

  const result = await db.sequelize.query(
    `
        SELECT 
            pst.id AS scheme_type_id,
            pst.proposal_item_id,
            pst.qty AS item_qty,
            pst.total_in_gst,
            pst.grand_in_total,
            pst.grand_out_total,
            pst.scheme_id,
            pst.order_qty, 
            pst.substract_total,
            pst.add_total,
            psd.id AS scheme_data_id,
            psd.qty AS psd_qty,
            psd.price_per_unit,
            psd.status,
            psd.accessory_in_category,
            psd.accessory_in_sub_category,
            psd.accessory_in_name,
            psd.total_price,
            psd.gst,
            psd.customization_type,
            psd.proposal_scheme_type_id,
        
            ma.asset_category_name,
            msc.sub_category_name,
            mi.item_name

        FROM CRM_PROPOSAL_SCHEME_TYPE pst
        LEFT JOIN CRM_PROPOSAL_SCHEME_DATA psd ON psd.proposal_scheme_type_id = pst.id
        LEFT JOIN MASTER_ASSET ma ON ma.id = psd.accessory_in_category
        LEFT JOIN MASTER_SUB_CATEGORY msc ON msc.id = psd.accessory_in_sub_category
        LEFT JOIN MASTER_ITEM mi ON mi.id = psd.accessory_in_name

        WHERE pst.proposal_item_id = :proposal_item_id
        AND pst.proposal_no = :proposal_no
        GROUP BY pst.id, psd.id
    `,
    {
      replacements: { proposal_item_id, proposal_no },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!result.length) {
    return [];
  }

  const grouped = {};

  result.forEach((row) => {
    const {
      scheme_type_id,
      proposal_item_id,
      item_qty,
      total_in_gst,
      grand_in_total,
      grand_out_total,
      scheme_id,
      order_qty,
      scheme_data_id,
      psd_qty,
      price_per_unit,
      status,
      accessory_in_category,
      accessory_in_sub_category,
      accessory_in_name,
      total_price,
      gst,
      substract_total,
      add_total,
      customization_type,
      asset_category_name,
      sub_category_name,
      item_name,
    } = row;

    if (!grouped[scheme_type_id]) {
      grouped[scheme_type_id] = {
        proposal_item_id,
        qty: item_qty,
        total_in_gst,
        grand_in_total,
        grand_out_total,
        substract_total,
        add_total,
        scheme_id,
        order_qty,
        customization: [],
      };
    }

    if (scheme_data_id) {
      grouped[scheme_type_id].customization.push({
        scheme_data_id,
        qty: psd_qty,
        price_per_unit,
        status,
        accessory_in_category,
        accessory_in_sub_category,
        accessory_in_name,
        total_price,
        gst,
        customization_type,
        asset_category_name,
        sub_category_name,
        item_name,
      });
    }
  });

  const finalData = Object.values(grouped);

  const findBrand = await db.proposal_branding_scheme.findOne({
    where: { proposal_item_id },
  });
  if (finalData.length > 0) {
    finalData[0].branding = findBrand || null;
  }

  return finalData;
};

let getProposalList_workflow = async (status, login_id, action) => {
  try {
    let id;
    let condition = "";
    let groupBy = "";
    let listType = "";
    if (action == 'Quotation') {
      listType = 'AND V.is_quotation_created=TRUE';
    } else if (action == 'PI') {
      listType = 'AND V.is_pi_created=TRUE';
    } else if (action == 'SB') {
      listType = 'AND V.is_sales_booking_version=TRUE';
      listType = 'AND V.is_booking_created=TRUE';
    }
    let emplData = await db.user.findOne({ where: { employee_id: login_id } });
    let role = await db.role_master.findOne({ where: { role_master_id: emplData?.role_master_id } });

    if (status == "0") {
      groupBy = "GROUP BY V.id";
      if (role?.role_master_name == "Super Admin") {
        condition = `
                    V.version_status = 'pending'                   
                    AND PA.status = 'ACTIVE'
                    
                    AND PA.approvel_status = 'PENDING'
                    AND C.is__discount_requested=1
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM PROPOSAL_APPROVAL AS prev
                        WHERE prev.proposal_id = C.id 
                        AND prev.level < PA.level
                        AND prev.approvel_status NOT IN ('APPROVED', 'FORWARD')
                    )
                `;
        // condition = `V.version_status = 'pending' AND CP.discount_request IS NOT NULL AND C.is__discount_requested = 1`;
      } else {
        condition = `
                    V.version_status = 'pending'
                    AND PA.employee_id = ${login_id}
                    AND PA.status = 'ACTIVE'
                    AND PA.approvel_status = 'PENDING'
                    AND C.is__discount_requested=1
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM PROPOSAL_APPROVAL AS prev
                        WHERE prev.proposal_id = C.id 
                        AND prev.level < PA.level
                        AND prev.approvel_status NOT IN ('APPROVED', 'FORWARD')
                    )
                `;
      }
    } else if (status == "1") {

      groupBy = "GROUP BY V.id";
      if (role?.role_master_name == "Super Admin") {
        condition = `    
        V.version_status = 'approved' AND CP.discount_request IS NOT NULL AND C.is__discount_requested = 1`
      } else {


        condition = `
    
     V.version_status = 'approved'
    AND (
        C.employee_id = ${login_id}
        OR (
            PA.employee_id = ${login_id} 
            AND (
                PA.approvel_status = 'approved' 
                OR (PA.approvel_status = 'FORWARD' AND PA.progressStatus = 'CLOSE')
            )
        )
    )
    AND C.is__discount_requested = 1

    -- Exclude proposals rejected at any level
    AND NOT EXISTS (
        SELECT 1
        FROM PROPOSAL_APPROVAL AS PA2
        WHERE PA2.proposal_id = C.id
          AND PA2.approvel_status = 'REJECTED'
    )

`
      }
      // login_id == "1" || login_id == "Super Admin"
      //   ? `V.version_status = 'approved'`
      //   : `V.version_status = 'approved' AND C.employee_id = ${login_id} OR PA.employee_id=${login_id} AND PA.approvel_status='APPROVED' OR PA.approvel_status='FORWARD' AND PA.progressStatus='CLOSE'`;
    } else if (status == "2") {
      groupBy = "GROUP BY V.id";
      if (role?.role_master_name == "Super Admin") {
        condition = `V.version_status = 'reject' AND CP.discount_request IS NOT NULL AND C.is__discount_requested = 1`
      } else {
        condition = `
      V.version_status = 'reject'
    AND (C.employee_id =  ${login_id} OR PA.employee_id =  ${login_id})    
      `
      }
      // login_id == "1" || login_id == "Super Admin"
      //   ? `V.version_status = 'reject'`
      //   : `V.version_status = 'reject' AND C.employee_id = ${login_id}`;

    } else if (status == "3") {
      groupBy = "GROUP BY V.id";
      if (role?.role_master_name == "Super Admin") {
        condition = `CP.discount_request IS NOT NULL AND C.is__discount_requested = 1`;
      } else {

        condition = `CP.discount_request IS NOT NULL
    AND C.is__discount_requested = 1
    AND (
        C.employee_id = ${login_id}
        OR (
            PA.employee_id = ${login_id}
            AND PA.approvel_status IN ('approved', 'forward', 'rejected', 'pending')
            AND (
                PA.approvel_status != 'pending'
                OR NOT EXISTS (
                    SELECT 1
                    FROM PROPOSAL_APPROVAL AS PrevPA
                    WHERE PrevPA.proposal_id = C.id
                      AND PrevPA.level < PA.level
                )
                OR EXISTS (
                    SELECT 1
                    FROM PROPOSAL_APPROVAL AS PrevPA
                    WHERE PrevPA.proposal_id = C.id
                      AND PrevPA.level < PA.level
                      AND PrevPA.approvel_status IN ('approved', 'FORWARD')
                )
            )
        )
    )`;
      }
    } else if (status == "4") {
      groupBy = "GROUP BY C.id";
      condition = `C.proposal_status = 'approved'`; // Same for all
    } else if (id) {
      condition = `C.id = '${id}'`;
    } else {
      condition = `1=1`;
    }

    let loginIdCondition = "";
    // if (login_id !== "1" && login_id !== "Super Admin") {
    //   loginIdCondition = ` AND (CL.login_id = ${login_id} OR C.employee_id = ${login_id})`;
    // }

    await db.sequelize.query(
      `SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`
    );

    const result = await db.sequelize.query(`
            SELECT DISTINCT C.proposal_no, PA.department_id, PA.id AS proposal_approvel_id, C.id, C.create_lead_id, 
            -- C.proposal_type,
             C.gst_no, C.total_cost, C.additional_charges, C.discount, C.taxable_value, 
            C.sgst, C.cgst, C.igst, C.grant_total, C.mail_id, C.proposal_status, C.request_type, 
            CUST.company_name, 
           
            C.lead_owner, C.contact_person_name, C.contact_number, C.mail_id, 
            JSON_UNQUOTE(JSON_EXTRACT(CL.dynamic_fields, '$.status')) AS field_value,
            R.first_name, R.middle_name, R.last_name, R.employee_official_email, R.contact_number,
            DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt,
            V.version, V.id AS version_id, V.version_status AS proposal_status,
            PA.approvel_status AS approvel_status
            FROM CRM_CREATE_PROPOSAL_MST AS C
            LEFT JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
            INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
            LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.employee_id        
            LEFT JOIN CRM_VERSION_PROPOSAL_MST AS V ON V.proposal_id = C.id
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON PA.proposal_id = C.id
            LEFT JOIN ESS_WORK_FLOW_MASTER AS WM ON WM.id = PA.workflow_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CUST ON C.customer_id=CUST.id
            WHERE ${condition}  AND V.is_version_approvel_status=TRUE AND C.is__discount_requested=1 AND C.proposal_status="approved" ${listType} ${groupBy} ORDER BY V.id DESC
        `);

    if (id) {
      const allResult = await db.sequelize.query(`
                SELECT DISTINCT CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, 
                CP.discount_request, CP.discount_approved,
                P.id AS product_master_id, P.product_name, P.product_code, PV.variant_name,
                PV.product_description, CP.price_per_unit, PV.maximum_discount, T.uom_name, T.uom_id
                FROM CRM_PROPOSAL_LIST_MST AS CP
                INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
                INNER JOIN MASTER_PRODUCT AS P ON P.id = CP.product_master_id
                LEFT JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id 
                WHERE CP.proposal_id = ${id} AND C.proposal_status="approved"
                AND CP.createdAt = (
                    SELECT MAX(createdAt) 
                    FROM CRM_PROPOSAL_LIST_MST 
                    WHERE proposal_id = ${id}
                )
            `);

      const transformedResult = {
        ...result[0][0],
        productDetailList: allResult[0],
      };

      return { code: 200, message: "success", data: transformedResult };
    }

    return result.length > 0
      ? { code: 200, message: "success", data: result[0] }
      : { code: 404, message: "data not found", data: result };
  } catch (error) {
    return { code: 500, message: error.message };
  }
};

module.exports.getProposalList = async (req, res) => {
  try {
    const { status, id, login_id, typecheck, role_master_id, action } = req.query;

    if (typecheck === "WorkFlow") {
      const response = await getProposalList_workflow(status, login_id, action);
      return res.status(response.code).send({
        code: response.code,
        message: response.message,
        data: response.data,
      });
    }

    let condition = "";
    let groupBy = "";
    let versionJoin = `
      LEFT JOIN CRM_VERSION_PROPOSAL_MST AS V ON V.proposal_id = C.id
    `;

    if (status == "0") {
      groupBy = "GROUP BY V.id";
      if (login_id == "1" || login_id == "Super Admin") {
        condition = `V.version_status = 'pending'`;
      } else {
        condition = `
          V.version_status = 'pending'
          AND PA.employee_id = ${login_id}
          AND PA.status = 'ACTIVE'
          AND PA.approvel_status = 'PENDING'
          AND NOT EXISTS (
            SELECT 1
            FROM PROPOSAL_APPROVAL AS prev
            WHERE prev.proposal_id = C.id
              AND prev.level < PA.level
              AND prev.approvel_status NOT IN ('APPROVED', 'REJECTED')
          )
        `;
      }
    } else if (status == "1") {
      groupBy = "GROUP BY V.id";
      condition =
        login_id == "1" || login_id == "Super Admin"
          ? `V.version_status = 'approved'`
          : `V.version_status = 'approved' AND C.employee_id = ${login_id}`;
    } else if (status == "2") {
      groupBy = "GROUP BY V.id";
      condition =
        login_id == "1" || login_id == "Super Admin"
          ? `V.version_status = 'reject'`
          : `V.version_status = 'reject' AND C.employee_id = ${login_id}`;
    } else if (status == "3") {
      groupBy = "GROUP BY V.id";
      condition =
        login_id == "1" || login_id == "Super Admin"
          ? `CP.discount_request IS NOT NULL`
          : `CP.discount_request IS NOT NULL AND CL.login_id = ${login_id}`;
    } else if (status == "4") {
      groupBy = "GROUP BY C.id";
      condition = `C.proposal_status = 'approved' AND V.id IS NOT NULL`;

      // 👇 Join only latest approved version per proposal
      versionJoin = `
        LEFT JOIN (
          SELECT vp1.*
          FROM CRM_VERSION_PROPOSAL_MST vp1
          INNER JOIN (
            SELECT proposal_id, MAX(id) AS max_id
            FROM CRM_VERSION_PROPOSAL_MST
            WHERE version_status = 'approved'
            GROUP BY proposal_id
          ) vp2 ON vp1.id = vp2.max_id
        ) AS V ON V.proposal_id = C.id
      `;
    } else if (id) {
      condition = `C.id = '${id}'`;
    } else {
      condition = `1=1`;
    }

    // ✅ Apply login_id filter ONLY if role_master_id != 1
    let loginIdCondition = "";
    if (
      parseInt(role_master_id) !== 1 &&
      login_id !== "1" &&
      login_id !== "Super Admin"
    ) {
      loginIdCondition = ` AND C.employee_id = ${login_id}`;
    }

    // Disable ONLY_FULL_GROUP_BY
    await db.sequelize.query(
      `SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`
    );

    // Main query
    const result = await db.sequelize.query(`
      SELECT DISTINCT 
        C.proposal_no, PA.department_id, PA.id AS proposal_approvel_id,
        C.id, C.create_lead_id, PT.perposal_type, C.gst_no,
        C.total_cost, C.additional_charges, C.discount,
        C.taxable_value, C.sgst, C.cgst, C.igst, C.grant_total,
        C.mail_id, C.proposal_status, C.request_type,
        CPM.company_name, C.lead_owner, C.contact_person_name,
        C.contact_number, C.mail_id,
        JSON_UNQUOTE(JSON_EXTRACT(CL.dynamic_fields, '$.status')) AS field_value,
        R.first_name, R.middle_name, R.last_name,R.reporting_manager_id,
        R.employee_official_email, R.contact_number,
        DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt,
        V.version, V.id AS version_id, V.version_status AS proposal_status,
        PI.approvel_status AS pi_status
      FROM CRM_CREATE_PROPOSAL_MST AS C
      LEFT JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
      INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
      LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
      LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.employee_id
      LEFT JOIN MASTER_PERPOSAL_TYPE AS PT ON C.proposal_type_id = PT.id
      LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PI ON PI.proposal_id = C.id
      ${versionJoin}
      LEFT JOIN PROPOSAL_APPROVAL AS PA ON PA.proposal_id = C.id
      LEFT JOIN ESS_WORK_FLOW_MASTER AS WM ON WM.id = PA.workflow_id
      WHERE ${condition} ${loginIdCondition} AND CP.proposal_status='approved'
      ${groupBy}
      ORDER BY V.id DESC
    `);

    // If requesting by ID, return with product details
    if (id) {
      const allResult = await db.sequelize.query(`
        SELECT DISTINCT CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst,
          CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
          P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code,
          PV.variant_name, PV.product_description, CP.price_per_unit,
          PV.maximum_discount, T.uom_name, T.uom_id
        FROM CRM_PROPOSAL_LIST_MST AS CP
        INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
        INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
        LEFT JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id
        WHERE  C.proposal_status="approved" AND  CP.proposal_id = ${id}
        AND CP.createdAt = (
          SELECT MAX(createdAt)
          FROM CRM_PROPOSAL_LIST_MST
          WHERE proposal_id = ${id}
        )
      `);

      const transformedResult = {
        ...result[0][0],
        productDetailList: allResult[0],
      };

      return res
        .status(200)
        .send({ code: 200, message: "success", data: transformedResult });
    }

    // Response for list
    if (result.length > 0 && result[0].length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: result[0] });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "data not found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getAllProposalList = async (req, res) => {
  try {
    const { status, id, login_id, dealer } = req.query;
    let version_status = "version_status = 'approved'"
    let condition = "";
    let dealer_status;

    let groupBy = "";
    let dynamicColumn = "'pending' AS actionStatus";
    let isQuotationCreated = null;
    if (dealer == 'true') {
      dealer_status = true;
    } else {
      dealer_status = false;
    }
    // Status-based filtering
    if (status == "1") {
      groupBy = "GROUP BY C.id";
      condition = `V.id IS NOT NULL AND C.proposal_status = 'Approved'`;
      version_status += ` AND is_quotation_created = true`;

    } else if (status == "2") {
      groupBy = "GROUP BY C.id";
      condition = `C.proposal_status = 'draft'`;
      version_status = "version_status IN ('approved','pending')"
      isQuotationCreated = false;
      dynamicColumn = "'draft' AS actionStatus";
      version_status += ` AND is_quotation_created = false`;
    } else if (status == "3") {
      groupBy = "GROUP BY C.id";
      dynamicColumn = "'pending' AS actionStatus,'pending' AS pending_list";
      version_status += ` AND is_quotation_created = true`;
      condition = `V.id IS NOT NULL AND CPM2.data_status = 'PENDING' AND C.proposal_status = 'Approved'`;
    } else if (status == "4") {
      groupBy = "GROUP BY C.id";
      condition = `V.id IS NOT NULL AND CPM2.data_status = 'APPROVE' AND C.proposal_status = 'Approved'`;
      dynamicColumn = "'approved' AS actionStatus";
      version_status += ` AND is_quotation_created = true`;
    } else if (status == "5") {
      groupBy = "GROUP BY C.id";
      version_status += ` AND is_quotation_created = true`;
      condition = `V.id IS NOT NULL AND CPM2.data_status = 'REJECTED' AND C.proposal_status = 'Approved'`;
    } else if (id) {
      condition = `C.id = '${id}'`;
    } else {
      condition = `1=1`;
    }



    // Role-based access control
    let loginIdCondition = "";
    if (req.user.role_master_id !== 1) {
      loginIdCondition = `
    AND (
      C.employee_id = ${login_id}
      OR (R.reporting_manager_id IS NOT NULL AND R.reporting_manager_id = ${login_id})
    )
  `;
    }

    // Disable ONLY_FULL_GROUP_BY for MySQL strict mode compatibility
    await db.sequelize.query(
      `SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));`
    );



    let versionJoin = `
      LEFT JOIN (
        SELECT vp1.*
        FROM CRM_VERSION_PROPOSAL_MST vp1
        INNER JOIN (
          SELECT proposal_id, MAX(id) AS max_id
          FROM CRM_VERSION_PROPOSAL_MST
          WHERE ${version_status} AND is_pi_created=false 
          GROUP BY proposal_id
        ) vp2 ON vp1.id = vp2.max_id
      ) AS V ON V.proposal_id = C.id
    `;


    // Main query
    const result = await db.sequelize.query(`
      SELECT DISTINCT 
        ${dynamicColumn},
        CPM2.company_name,
        C.proposal_no, PA.department_id, PA.id AS proposal_approvel_id,
        C.id, C.create_lead_id, PT.perposal_type, C.gst_no,
        C.total_cost, C.additional_charges, C.discount,
        C.taxable_value, C.sgst, C.cgst, C.igst, C.grant_total,
        C.mail_id, C.proposal_status, C.request_type,
        CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,
        CPM.company_name AS company_name2, C.contact_person_name,
        C.contact_number, C.mail_id,
        JSON_UNQUOTE(JSON_EXTRACT(CL.dynamic_fields, '$.status')) AS field_value,
        R.first_name, R.middle_name, R.last_name, C.employee_id, R.reporting_manager_id, 
        R.employee_official_email, R.contact_number,
        DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt,
        V.follow_up_date,
        V.version, V.id AS version_id, V.version_status AS proposal_status,V.currency_id,
        PI.approvel_status AS pi_status,
        PI.document, PI.pi_number,
        CPM2.data_status AS customer_status
      FROM CRM_CREATE_PROPOSAL_MST AS C
      LEFT JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
      INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON C.id = CP.proposal_id
      LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON C.parent_customer_id = CPM.id
      INNER JOIN CUSTOMER_PROFILE_MST AS CPM2 ON C.customer_id = CPM2.id
      LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.employee_id
      LEFT JOIN MASTER_PERPOSAL_TYPE AS PT ON C.proposal_type_id = PT.id
      LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PI ON PI.proposal_id = C.id
      ${versionJoin}
      LEFT JOIN PROPOSAL_APPROVAL AS PA ON PA.proposal_id = C.id
      LEFT JOIN ESS_WORK_FLOW_MASTER AS WM ON WM.id = PA.workflow_id
      WHERE  ${condition} ${loginIdCondition} AND C.quotation_type='in direct' AND C.dealer=${dealer_status}
      ${groupBy}
      ORDER BY V.id DESC
    `);

    // If specific proposal ID is passed, return detail with product list
    if (id) {
      const allResult = await db.sequelize.query(`
        SELECT DISTINCT 
          CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst,
          CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
          P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code,
          PV.variant_name, PV.product_description, CP.price_per_unit,
          PV.maximum_discount, T.uom_name, T.uom_id
        FROM CRM_PROPOSAL_LIST_MST AS CP
        INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
        INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
        LEFT JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id
        LEFT JOIN PRODUCT_VARIANTS AS PV ON PV.id = CP.variant_id
        WHERE CP.proposal_id = ${id}
          AND CP.createdAt = (
            SELECT MAX(createdAt)
            FROM CRM_PROPOSAL_LIST_MST
            WHERE proposal_id = ${id}
          )
      `);


      const transformedResult = {
        ...result[0][0],
        productDetailList: allResult[0],
        
      };

      return res.status(200).send({
        code: 200,
        message: "success",
        data: transformedResult,
      });
    }
    const currencyData = await db.currency_convert.findAll();
    

    // Return list
    if (result.length > 0 && result[0].length > 0) {
      return res
      .status(200)
      .send({ code: 200, message: "success", data: result[0], currencyData:currencyData});
    } else {
      return res
      .status(404)
      .send({ code: 404, message: "data not found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.updateProposalStatus = async (req, res) => {
  try {
    const {
      proposal_status,
      id,
      productDetailList,
      total_cost,
      additional_charges,
      discount,
      taxable_value,
      sgst,
      cgst,
      igst,
      grant_total,
      proposal_approval_id,
      approvalRemark,
    } = req.body;
    const dataExists = await db.proposalData.findOne({
      where: { id },
    });
    if (!dataExists) {
      return res.status(404).send({ code: 404, message: "Proposal not found" });
    }

    // const statusChange = await db.proposalData.update({
    //     proposal_status: proposal_status, total_cost, additional_charges,
    //     discount, taxable_value, sgst, cgst, igst, grant_total
    // }, { where: { id: id } });
    const createdProductList = await Promise.all(
      productDetailList.map(async (product) => {
        const { discount_approved, id } = product;
        const da = parseFloat(discount_approved);
        return await db.proposalList.update(
          {
            discount_approved: da ? da : null,
          },
          { where: { id: id } }
        );
      })
    );
    let statusChange;
    let isUpdated = await db.proposalApprovel.update(
      {
        approvel_status: proposal_status,
        progressStatus: "CLOSE",
        remark: approvalRemark,
      },
      { where: { id: proposal_approval_id } }
    );
    if (isUpdated) {
      let exist = await db.proposalApprovel.findOne({
        where: {
          proposal_id: id,
          approvel_status: "PENDING",
          progressStatus: "OPEN",
        },
      });
      if (!exist) {
        statusChange = await db.proposalData.update(
          {
            proposal_status: proposal_status,
            total_cost,
            additional_charges,
            discount,
            taxable_value,
            sgst,
            cgst,
            igst,
            grant_total,
          },
          { where: { id: id } }
        );
      } else {
        return res
          .status(200)
          .send({ code: 200, message: "Approved discount request this level" });
      }
    }
    if (statusChange && createdProductList) {
      // await sendMail(dataExists.mail_id);
      return res
        .status(200)
        .send({ code: 200, message: "Proposal updated successfully" });
    } else {
      return res.status(404).send({ code: 404, message: "Not Updated" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server error" });
  }
};

module.exports.proposalVersionList = async (req, res) => {
  try {
    let { id, isPiCreated, isSalesBooking } = req.query;
    let wherePiCondition = '';
    let whereSalesBookingCondition = '';

    if (isPiCreated === 'true') {
      isPiCreated = true;
      wherePiCondition = `AND CI.is_pi_created = ${isPiCreated}`;
    } else if (isPiCreated === 'sales booking') {
      isSalesBooking = true;
      whereSalesBookingCondition = `AND CI.is_sales_booking_version = ${isSalesBooking}`;
    } else {
      isPiCreated = false;
      wherePiCondition = `AND CI.is_quotation_created=TRUE AND CI.is_pi_created = ${isPiCreated} AND CI.is_sales_booking_version=FALSE`;
    }

    const versionList = await db.sequelize.query(
      `SELECT DISTINCT 
    CI.id,
    CP.id AS proposal_id,
    CP.proposal_no,
    CP.customer_id,
    CPM.customer_type_id,
    CPM.customer_category_id,
    CI.is_so_created,
    CPM.data_status AS customer_profile_status,  
    PI.approvel_status AS pi_status,
    CI.is_booking_created,
    CI.follow_up_date,
    PI.document,
    DATE_FORMAT(CP.createdAt, '%Y-%m-%d') AS createdAt,
    CI.version,
    (
        SELECT CASE 
            WHEN COUNT(*) > 0 THEN TRUE 
            ELSE FALSE 
        END
        FROM CRM_VERSION_PROPOSAL_MST
        WHERE proposal_id = CP.id AND is_so_created = 1
    ) AS is_so_created_any_version
FROM CRM_CREATE_PROPOSAL_MST AS CP
LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
LEFT JOIN CRM_PROPOSAL_LIST_MST AS CL ON CL.proposal_id = CP.id
LEFT JOIN CRM_VERSION_PROPOSAL_MST AS CI ON CI.id = CL.version_id
LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CPM.id = CP.customer_id
LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PI ON PI.proposal_id = CP.id 

WHERE  
    CP.id = ${id}  ${wherePiCondition}
  ${whereSalesBookingCondition}
    AND CI.version_status = 'approved'

   
    AND NOT EXISTS (
        SELECT 1 
        FROM CRM_PROPOSAL_LIST_MST AS PI2
        WHERE PI2.version_id = CI.id
          AND PI2.approvel_status IN ('FORWARD', 'PENDING')
    )

   
    AND EXISTS (
        SELECT 1 
        FROM CRM_PROPOSAL_LIST_MST AS PI3
        WHERE PI3.version_id = CI.id
          AND PI3.approvel_status NOT IN ('REJECTED')
    )

ORDER BY CI.id DESC;

`
    );
    //         const versionList = await db.sequelize.query(
    //             `SELECT DISTINCT
    //                 CI.id,
    //                 CP.id AS proposal_id,
    //                 CP.proposal_no,
    //                 CI.is_so_created,
    //                 DATE_FORMAT(CP.createdAt, '%Y-%m-%d') AS createdAt,
    //                 CI.version,
    //                 (
    //                     SELECT CASE
    //                         WHEN COUNT(*) > 0 THEN TRUE
    //                         ELSE FALSE
    //                     END
    //                     FROM CRM_VERSION_PROPOSAL_MST
    //                     WHERE proposal_id = CP.id AND is_so_created = 1
    //                 ) AS is_so_created_any_version
    //             FROM CRM_CREATE_PROPOSAL_MST AS CP
    //             LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
    //             INNER JOIN CRM_PROPOSAL_LIST_MST AS CL ON CL.proposal_id = CP.id
    //             INNER JOIN CRM_VERSION_PROPOSAL_MST AS CI ON CI.id = CL.version_id
    //             WHERE CI.proposal_id = ${id} AND CI.version_status = 'approved'
    //             ORDER BY CI.id DESC;
    // `
    //         );

    let billing_status;
    if (versionList.length > 0) {

      if (Array.isArray(versionList[0])) {

        for (let item of versionList[0]) {
          let [add, profile] = await Promise.all([
            db.customerAddress.findOne({ where: { customer_id: item.customer_id } }),
            // db.customerBilling.findOne({ where: { customer_id: item.customer_id } }),
            // db.customer_business_details.findOne({ where: { customer_id: item.customer_id } }),
            db.customerProfile.findOne({
              where: {
                id: item.customer_id,
                customer_type_id: { [Op.ne]: null }
              }
            })
          ]);

          if (add && profile) {
            item.billing_status = true;
          } else {
            item.billing_status = false;
          }
        }


      }


      return res
        .status(200)
        .send({ code: 200, message: "success", data: versionList[0] });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "data not found", data: versionList[0] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Server error" });
  }
};

const remove_proposal_changes_onclick = async (
  version_id,
  action_type,
  proposal_id
) => {
  try {
    if (action_type == "false") {
      action_type = 0;
    } else {
      action_type = 1;
    }

    if (action_type === 0) {
      let isPromoExist = await db.proposalList.findOne({
        where: {
          proposal_id: proposal_id,
          version_id: version_id,
          promo_item: true,
          apply_scheme: true,
          version_status: "safe",
          isDeleted: true,
        },
      });
      if (isPromoExist) {
        return { code: 200, message: "Fetched successfully" };
      }
    }

    let isExist = await db.proposalList.findOne({
      where: {
        version_id: version_id,
        action_type: action_type,
        proposal_id: proposal_id,
      },
    });
    if (isExist) {
      return { code: 200, message: "Fetched successfully" };
    }

    if (version_id && proposal_id) {
      // Fetch all items
      let itemNo = await db.proposalList.findAll({
        where: {
          version_id: version_id,
          action_type: true,
          proposal_id: proposal_id,
        },
      });

      if (itemNo.length) {
        for (let item of itemNo) {
          if (item.id) {
            await db.proposal_branding.destroy({
              where: { proposal_item_id: item.id, version_id: version_id },
            });

            const schemeTypes = await db.proposal_customisation_type.findAll({
              where: { proposal_item_id: item.id, version_id: version_id },
            });

            for (let schemeType of schemeTypes) {
              if (schemeType.id) {
                await db.proposal_customisation_data.destroy({
                  where: { proposal_customisation_id: schemeType.id },
                });

                await db.proposal_customisation_type.destroy({
                  where: { id: schemeType.id },
                });
              }
            }
          }
        }
      }

      await db.proposalList.destroy({
        where: {
          version_id: version_id,
          action_type: false,
          proposal_id: proposal_id,
        },
      });
      await db.proposalList.update(
        { isDeleted: false },
        {
          where: {
            version_id: version_id,
            action_type: true,
            proposal_id: proposal_id,
          },
        }
      );
      let findScheme = await db.proposalList.findOne({
        where: {
          proposal_id,
          version_status: "safe",
          promo_item: true,
          apply_scheme: true,
          version_id,
        },
      });
      if (findScheme) {
        await db.proposalList.update(
          { scheme_id: findScheme.scheme_id },
          {
            where: {
              proposal_id,
              version_status: "draft",
              promo_item: false,
              apply_scheme: false,
              version_id,
            },
          }
        );
      }
    }

    return { code: 200, message: "Promo scheme removed successfully." };
  } catch (error) {
    console.error("Error in remove_scheme_handler:", error.message);
    return { code: 500, message: error.message };
  }
};

module.exports.proposalVersionListById = async (req, res) => {
  try {
    const { id, proposal_id, proposalApprovelId, action_type, userLoginId } = req.query;
    let condition = ``;
    if (proposalApprovelId !== "") {
      condition = `AND PA.id=${proposalApprovelId}`;
    }
    // let user= await db.user.findOne({where:{employee_id:userLoginId}});
    // let role = await db.role_master.findOne({where:{role_master_id:user.role_master_id}});
    // if(role.role_master_name=='Super Admin'){

    // }
    let isExistEmp = ``;
    let emp = await db.proposalApprovel.findOne({ where: { id: proposalApprovelId } });
    if (emp) {
      isExistEmp = `AND PA.employee_id=${emp.employee_id}`;
    }
    const proposalData = await db.sequelize.query(
      `SELECT PA.approvel_status,CV.currency_id, CV.exchange_rate, CC.Currency_Type, CV.is_same_as_shipping,	CV.is_discount_requested,CV.billing_address_id,
            	SA.shipping_country_id,
              SA.shipping_state_id,
              SA.shipping_city_id,
              SA.shipping_postal_address,
              SA.shipping_address,
              SA.shipping_pin_code,
              CV.shipping_address_id,
              SA.shipping_gst_in,
            F.freight_name,I.insurance_name,
            PM.payment_name, SP.sub_payment_name,
            B.branch_name,W.name AS warehouse_name,DT.delivery_term, UL.unloading, 
            CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
            CPM2.company_name, sb.id AS sales_booking_id,
            sb.profit_center_id,sb.cost_center_id ,sb.schedule_delivery_date,CPM.customer_category_id,
            CAM.billing_address AS address, CAM.billing_pin_code AS pincode, CAM.billing_country_id AS country_id,
            CAM.billing_state_id AS state_id, CAM.billing_city_id AS city_id, CAM.billing_postal_address AS postal_address
            -- , SCDM.sactioned_credit_limit, SCDM.utilized_credit_limit, SCDM.sactioned_credit_period, SCDM.available_credit_limit
            FROM CRM_VERSION_PROPOSAL_MST AS CV
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = CV.proposal_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
           -- LEFT JOIN SALES_SUPER_CREDIT_DEBIT_MST AS SCDM ON CPM.id = SCDM.customer_id
            LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.id = CV.billing_address_id
            LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
            LEFT JOIN MASTER_SOURCE AS MS ON C.source_id = MS.id
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON CP.id = PA.proposal_id
            LEFT JOIN SALES_BOOKING AS sb ON sb.proposal_id = ${proposal_id} AND sb.version_id = ${id}
            LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = ${proposal_id} AND PPI.version_id = ${id}
             INNER  JOIN CUSTOMER_PROFILE_MST AS CPM2 ON CP.customer_id = CPM2.id
              LEFT JOIN MASTER_BRANCH AS B ON CP.location_id = B.id
             LEFT JOIN WAREHOUSE_MASTER AS W ON CP.warehouse_id = W.id
             LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS DT ON CP.delivery_term_id = DT.id
              LEFT JOIN CRM_DELIVERY_TERM_AND_UNLOADING AS UL ON CP.unloading_resp_id = UL.id
              LEFT JOIN CRM_PAYMENT_MAIN_MST AS PM ON CP.payment_main_id = PM.id
              LEFT JOIN CRM_SUB_PAYMENT_MAIN_MST AS SP ON CP.sub_payment_main_id = SP.id
              LEFT JOIN CRM_FREIGHT_MST AS F ON CP.freight_id = F.id
              LEFT JOIN CRM_INSURANCE_MST AS I ON CP.insurance_id = I.id
              LEFT JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS SA ON CV.shipping_address_id = SA.id
              LEFT JOIN MASTER_CURRENCY_CONVERT AS CC ON CC.Currency_Convert_id = CV.currency_id
            WHERE CV.id = ${id} ${condition}`
    );

    let [dataList] = await db.sequelize.query(
      `SELECT 
      ANY_VALUE(QAD.id) AS QAD_id,
      ANY_VALUE(PA.id ) AS approval_id,
          ANY_VALUE(QAD.discount) AS QAD_Discount,
  ANY_VALUE(QAD.level_id) AS level_id,
  ANY_VALUE(PCD.with_gst) AS customisation_with_gst,
  ANY_VALUE(PCD.after_discount) AS customisation_after_discount,
  ANY_VALUE(PCD.discount) AS customisation_discount,
  ANY_VALUE(PCD.discountType) AS customisation_discountType,
  ANY_VALUE(CRB.with_gst) AS branding_with_gst,
  ANY_VALUE(CRB.after_discount) AS branding_after_discount,
  ANY_VALUE(CRB.discount) AS branding_discount,
  ANY_VALUE(CRB.discountType) AS branding_discountType,
  ANY_VALUE(ACC.accessories_name) AS accessories_name,
  ANY_VALUE(CP.discount2) AS discount2,
  ANY_VALUE(CP.discount3) AS discount3,

 COALESCE(NULLIF(CP.discount1, 0), MIP.discount_1) AS discount1,
  COALESCE(NULLIF(CP.discount1Flat, 0), MIP.discount1Flat) AS discount1Flat,
  
  ANY_VALUE(CP.discount1Mode) AS discount1Mode,
  ANY_VALUE(CP.discount2Mode) AS discount2Mode,
  ANY_VALUE(CP.discount3Mode) AS discount3Mode,

  ANY_VALUE(CP.discount2Flat) AS discount2Flat,
  ANY_VALUE(CP.discount3Flat) AS discount3Flat,
  ANY_VALUE(CP.flatPercentage1) AS flatPercentage1,
  ANY_VALUE(CP.flatPercentage2) AS flatPercentage2,
  ANY_VALUE(CP.flatPercentage3) AS flatPercentage3,
  CP.id AS product_id,
  ANY_VALUE(CP.qty) AS qty,
  ANY_VALUE(CP.cgst) AS cgst,
  ANY_VALUE(CP.approvel_status) AS approvel_status,
  ANY_VALUE(CP.igst) AS igst,
  ANY_VALUE(CP.sgst) AS sgst,
  ANY_VALUE(CP.proposal_id) AS proposal_id,
  ANY_VALUE(CP.gst_type) AS gst_type,
  ANY_VALUE(CP.discount_request) AS discount_request,
  ANY_VALUE(CP.discount_approved) AS discount_approved,
  ANY_VALUE(P.id) AS product_master_id,
  ANY_VALUE(P.item_name) AS product_name,
  ANY_VALUE(P.item_code) AS product_code,
  ANY_VALUE(P.description) AS product_description,
  ANY_VALUE(CP.new_item) AS new_item,
  ANY_VALUE(CP.promo_item) AS promo_item,
  ANY_VALUE(CP.apply_scheme) AS apply_scheme,
  ANY_VALUE(CP.scheme_id) AS scheme_id,
  ANY_VALUE(CP.dbp) AS price_per_unit,
  ANY_VALUE(CP.min_price) AS min_price,
  ANY_VALUE(CP.price_per_unit) AS max_price,
  ANY_VALUE(CP.maximum_discount) AS maximum_discount,
  ANY_VALUE(CP.product_category_id) AS product_category_id,
  ANY_VALUE(U.uom_name) AS uom_name,
  ANY_VALUE(U.uom_id) AS uom_id,
  ANY_VALUE(CP.pro_sub_cat_id) AS pro_sub_cat_id,
  ANY_VALUE(CP.select_scheme) AS select_scheme,
  ANY_VALUE(PCT.id) AS proposal_customisation_id,
  ANY_VALUE(PCD.id) AS customisation_data_id,
  ANY_VALUE(PCD.customization_type) AS customization_type,
  ANY_VALUE(PCD.qty) AS custom_qty,
  ANY_VALUE(PCT.qty) AS product_qty,
  ANY_VALUE(PCT.order_qty) AS order_qty,
  ANY_VALUE(PCT.total_in_gst) AS total_in_gst,
  ANY_VALUE(PCT.grand_in_total) AS grand_in_total,
  ANY_VALUE(PCD.gst) AS gst,
  ANY_VALUE(PCD.total_price) AS total_price,
  ANY_VALUE(PCD.price_per_unit) AS unit_price,
  ANY_VALUE(PCT.grand_out_total) AS grand_out_total,
  ANY_VALUE(PCT.substract_total) AS substract_total,
  ANY_VALUE(PCT.add_total) AS add_total,
  ANY_VALUE(PCT.proposal_no) AS proposal_no,
  ANY_VALUE(PCT.remarks) AS remarks,
  ANY_VALUE(PCT.status) AS status,
  ANY_VALUE(PCT.createdAt) AS createdAt,
  ANY_VALUE(PCT.updatedAt) AS updatedAt,
  ANY_VALUE(PCT.proposal_item_id) AS proposal_item_id,
  ANY_VALUE(PCT.version_id) AS version_id,
  ANY_VALUE(P.hsn_code_id) AS hsn_code_id,
  ANY_VALUE(HSN.hsn_sac_code) AS hsn_sac_code,
  ANY_VALUE(P.uom_id) AS p_uom_id,
  ANY_VALUE(UM.uom_name) AS p_uom_name,
  ANY_VALUE(CRB.id) AS branding_id,
  ANY_VALUE(CRB.qty) AS branding_qty,
  ANY_VALUE(CRB.branding_description) AS branding_description,
  ANY_VALUE(CRB.branding_sides) AS branding_sides,
  ANY_VALUE(CRB.branding_amt) AS branding_amt,
  ANY_VALUE(CRB.proposal_no) AS branding_proposal_no,
  ANY_VALUE(CRB.status) AS branding_status,
  ANY_VALUE(CRB.createdAt) AS branding_createdAt,
  ANY_VALUE(PCD.accessory_in_category) AS accessory_in_category,
  ANY_VALUE(PCD.accessory_in_sub_category) AS accessory_in_sub_category,
  ANY_VALUE(PCD.accessory_in_name) AS accessory_in_name,
  ANY_VALUE(ma.asset_category_name) AS asset_category_name,
  ANY_VALUE(msc.sub_category_name) AS sub_category_name,
  ANY_VALUE(mi.item_name) AS accessory_item_name,
  ANY_VALUE(CRB.updatedAt) AS branding_updatedAt,
  ANY_VALUE(CRB.proposal_item_id) AS branding_proposal_item_id,
  ANY_VALUE(CRB.version_id) AS branding_version_id,
  ANY_VALUE(CRB.branding_mst_id) AS brandingTypes,
  ANY_VALUE(MBR.type_of_branding) AS type_of_branding,
  ANY_VALUE(MBR.price_per_unit) AS branding_price_per_unit,
  ANY_VALUE(BHSN.hsn_sac_code) AS acce_hsn_code,
  ANY_VALUE(PCD.custome_type) AS custome_type,
  ANY_VALUE(MB.type_of_basket) AS type_of_basket,

  COALESCE(PCD.no_of_partician, MB.no_of_partition) AS no_of_partition,
  ANY_VALUE(CP.totalPrice) AS totalPrice,
  ANY_VALUE(CP.totalWithGst) AS totalWithGst,
  ANY_VALUE(MHSN.hsn_sac_code) AS basket_hsn_code,
  ANY_VALUE(MGRN.value) AS value,
  ANY_VALUE(CP.warranty) AS warranty, 
  ANY_VALUE(CP.totalDiscountAmount) AS totalDiscountAmount,
  ANY_VALUE(CRB.totalDiscountAmount) AS totalDiscountAmountBR,
  ANY_VALUE(PCD.totalDiscountAmount) AS totalDiscountAmountCM,
  ANY_VALUE(CP.totalDiscountAmountPerQTY) AS totalDiscountAmountPerQTY,
  ANY_VALUE(CRB.totalDiscountAmountPerQTY) AS totalDiscountAmountPerQTYBR,
  ANY_VALUE(PCD.totalDiscountAmountPerQTY) AS totalDiscountAmountPerQTYCM,
  ANY_VALUE(PCD.basket_mst_id) AS basket_mst_id
            FROM CRM_CREATE_PROPOSAL_MST AS C
            LEFT JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
            INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON CP.proposal_id = C.id

            LEFT JOIN MASTER_PRICE AS MP ON MP.customer_id = C.customer_id 
            LEFT JOIN MASTER_ITEM_PRICE AS MIP ON MIP.item_id = CP.product_master_id AND MP.id = MIP.price_master_id 

            LEFT JOIN MASTER_ITEM AS P ON CP.product_master_id = P.id 
            LEFT JOIN MASTER_UOM AS U ON U.uom_id = CP.uom_id
            LEFT JOIN MASTER_UOM AS UM ON UM.uom_id = P.uom_id
            LEFT JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = CP.version_id
            LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE AS PCT ON PCT.proposal_item_id = CP.id
            LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_DATA AS PCD ON PCD.proposal_customisation_id = PCT.id
            LEFT JOIN MASTER_BASKET AS MB ON MB.id = PCD.basket_mst_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS MHSN ON MHSN.id = MB.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS GRMM ON GRMM.id = MHSN.gst_rate_id
            LEFT JOIN CRM_PROPOSAL_BRANDING AS CRB ON PCT.id = CRB.proposal_customisation_id
            LEFT JOIN MASTER_BRANDING AS MBR ON MBR.id = CRB.branding_mst_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS BHSN ON BHSN.id = MBR.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS MGRN ON MGRN.id = BHSN.gst_rate_id 
            LEFT JOIN MASTER_ACCESSORIES_NAME AS ACC ON ACC.id = PCD.accessory_in_name
            LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = P.hsn_code_id
            LEFT JOIN MASTER_ITEM AS mi ON mi.id = PCD.accessory_in_name
            LEFT JOIN MASTER_ASSET AS ma ON ma.id = PCD.accessory_in_category
            LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = PCD.accessory_in_sub_category
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON CP.version_id = PA.version_id
            LEFT JOIN MASTER_QUOTATION_APPROVAL_DETAILS AS QAD ON PA.qa_detail_id = QAD.id
            AND CP.pro_sub_cat_id = QAD.sub_category_id
            WHERE CV.id = ${id} AND CV.proposal_id = ${proposal_id} AND CP.isDeleted = 0 ${isExistEmp}`
    );

    let proposalDiscount = await db.discountDetails.findAll({ where: { proposal_id, version_id: id } });
    let paymentDetails = await db.paymentDetails.findAll({ where: { proposal_id, version_id: id } });

    const charges = await db.proposalAddtionalCharges.findAll({
      where: { proposal_id: proposal_id, version_id: id },
    });
    let dealerName;
    if (proposalData[0][0].dealer) {
      const customer = await db.customerProfile.findOne({ where: { id: proposalData[0][0].customer_id } });
      dealerName = await db.customerProfile.findOne({ where: { id: customer.dealer_id } });
      proposalData[0][0]['dealerName'] = dealerName?.company_name
    }
    const productMap = new Map();
    //return res.status(200).send({ code: 200, message: "success", data: dataList });
    console.log('proposalData[0]?.is__discount_requested', proposalData[0][0]?.is__discount_requested)
    if (proposalData[0][0]?.is_discount_requested == 1) {
      dataList = dataList.filter(x => x?.QAD_id !== null);
    }

    for (const row of dataList) {
      const productKey = `${row.approval_id}_${row.product_id}`;


      if (!productMap.has(productKey)) {
        console.log('==============>', row.approval_id);
        const baseProduct = {
          totalPrice: row.totalPrice,
          totalWithGst: row.totalWithGst,
          approval_id: row.approval_id,
          product_id: row.product_id,
          qty: row.qty,
          cgst: row.cgst,
          approvel_status: row.approvel_status,
          igst: row.igst,
          sgst: row.sgst,
          hsn_code_id: row.hsn_code_id,
          hsn_sac_code: row.hsn_sac_code,
          proposal_id: row.proposal_id,
          warranty: row.warranty,
          gst_type: row.gst_type,
          discount_request: row.discount_request,
          discount_approved: row.discount_approved,
          product_master_id: row.product_master_id,
          product_name: row.product_name,
          product_code: row.product_code,
          product_description: row.product_description,
          new_item: row.new_item,
          promo_item: row.promo_item,
          apply_scheme: row.apply_scheme,
          scheme_id: row.scheme_id,
          price_per_unit: row.price_per_unit,
          min_price: row.min_price,
          max_price: row.max_price,
          maximum_discount: row.maximum_discount,
          product_category_id: row.product_category_id,
          uom_name: row.uom_name,
          uom_id: row.uom_id,
          paymentTC: row.paymentTC,
          pro_sub_cat_id: row.pro_sub_cat_id,
          select_scheme: row.select_scheme,
          custom_branding: [], // <- Instead of 3 separate fields
          discount1: row.discount1,
          discount2: row.discount2,
          discount3: row.discount3,
          discount1Mode: row.discount1Mode,
          discount2Mode: row.discount2Mode,
          discount3Mode: row.discount3Mode,
          discount1Flat: row.discount1Flat,
          discount2Flat: row.discount2Flat,
          discount3Flat: row.discount3Flat,
          flatPercentage1: row.flatPercentage1,
          flatPercentage2: row.flatPercentage2,
          flatPercentage3: row.flatPercentage3,
          qad_discount: row.QAD_Discount,
          totalDiscountAmountItem: row.totalDiscountAmount,
          totalDiscountAmountPerQTY: row.totalDiscountAmountPerQTY
        };
        productMap.set(productKey, baseProduct);
      }

      const product = productMap.get(productKey);

      // add Installation Kit (BOM) 
      const bomKits = await db.SALESCRM_BOM_KIT.findAll({ where: { item_list_id: row.product_id }});

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
          qty: row.product_qty,
          order_qty: row.order_qty,
          select_scheme: row.select_scheme,
          total_in_gst: row.total_in_gst,
          accessories_name: row.accessories_name,
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
          //discount1: row?.customisation_discount,
          totalPrice: row?.customisation_after_discount,
          totalWithGst: row?.customisation_with_gst,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          proposal_item_id: row.proposal_item_id,
          version_id: row.version_id,
          schedule_delivery_date: row.schedule_delivery_date,
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
          gst: row.gst,
          total_price: row.total_price,
          qty: row.custom_qty,
          price_per_unit: row.unit_price,
          accessory_in_name: row.accessory_in_name,
          accessories_name: row.accessories_name,
          accessory_in_category: row.accessory_in_category,
          accessory_in_sub_category: row.accessory_in_sub_category,
          item_name: row.item_name,
          asset_category_name: row.asset_category_name,
          discount1: row?.customisation_discount,
          discountType1: row?.customisation_discountType,
          totalDiscountAmountItem: row?.totalDiscountAmountCM,
          totalDiscountAmountPerQTY: row?.totalDiscountAmountPerQTYCM,
          totalPrice: row?.customisation_after_discount,
          totalWithGst: row?.customisation_with_gst,
          sub_category_name: row.sub_category_name,
          custome_type: row.custome_type,
          no_of_partician: row.no_of_partician,
          basket_mst_id: row.basket_mst_id,
          //price_per_unit:row.price_per_unit,
          basket_qty: row.basket_qty,
          type_of_basket: row.type_of_basket,
          basket_hsn_code: row.basket_hsn_code,
          basket_gst_value: row.basket_gst_value,
          custome_type: row.custome_type,
          // acce_hsn_code: row.acce_hsn_code,
          basket_hsn_code: row.basket_hsn_code,
          acce_hsn_code: row.acce_hsn_code,
          no_of_partition: row.no_of_partition,


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
          branding_description: row.branding_description,
          branding_amt: row.branding_amt,
          branding_sides: row.branding_sides,
          proposal_no: row.branding_proposal_no,
          status: row.branding_status,
          qty: row?.branding_qty,
          createdAt: row.branding_createdAt,
          updatedAt: row.brandingUpdatedAt,
          discount1: row?.branding_discount,
          discountType1: row?.branding_discountType,
          totalDiscountAmountItem: row?.totalDiscountAmountBR,
          totalDiscountAmountPerQTY: row?.totalDiscountAmountPerQTYBR,
          totalPrice: row?.branding_after_discount,
          totalWithGst: row?.branding_with_gst,
          proposal_item_id: row.branding_proposal_item_id,
          version_id: row.branding_version_id,
          proposal_customisation_id: row.proposal_scheme_type_id || null,
          brandingTypes: row.brandingTypes, // If you're selecting this in query
          type_of_branding: row.type_of_branding,
          price_per_unit: row.branding_price_per_unit,
          hsn_sac_code: row.hsn_sac_code,
          value: row.value,
          gst: row.value,
        };
      }
    }

    // ✅ Convert map to array
    const productDetailList = Array.from(productMap.values());
    // ✅ Filter: Unique approval_id AND unique product_id
    const seenApprovalIds = new Set();
    const seenProductIds = new Set();
    let finalFilteredProducts = [];

    if (productDetailList[0]?.approval_id) {

      for (const product of productDetailList) {
        if (!seenApprovalIds.has(product.approval_id) && !seenProductIds.has(product.product_id)) {
          finalFilteredProducts.push(product);
          seenApprovalIds.add(product.approval_id);
          seenProductIds.add(product.product_id);
        }
      }
    } else {
      finalFilteredProducts = [...productDetailList];

    }

    // Extract first valid scheme_id
    let scheme_id = null;
    for (const item of finalFilteredProducts) {

      if (item.custom_branding) {
        item.custom_branding = item.custom_branding.map(branding => {
          if (branding.customisation_data) {

            const uniqueMap = new Map();
            for (const data of branding.customisation_data) {
              if (!uniqueMap.has(data.id)) {
                uniqueMap.set(data.id, data);
              }
            }
            branding.customisation_data = Array.from(uniqueMap.values());
          }
          return branding;
        });
      }
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


    proposalDiscount = proposalDiscount.map(x => ({
      id: x?.gross_discount_id,
      type: x?.discount_type,
      value: x?.discount_value,
      amount: x?.discount_amount
    }))
    const Obj = {
      ...proposalData[0][0],
      charges: charges,
      productDetailList: finalFilteredProducts,
      sales_documents: sales_documents,
      scheme_id: scheme_id,
      proposalDiscount: proposalDiscount,
      paymentDetails: paymentDetails
    };

    if (proposalApprovelId !== "") {
      const approvalData = await db.proposalApprovel.findAll({
        where: { version_id: id, employee_id: userLoginId },
      });

      let totalApproval = await db.proposalApprovel.findAll({ where: { version_id: id } })
      let totalLevel = totalApproval.length / Obj.productDetailList.length;
      let groupedByLevel = {};
      for (let row of totalApproval) {
        let lvl = row.level;
        if (!groupedByLevel[lvl]) {
          groupedByLevel[lvl] = [];
        }
        groupedByLevel[lvl].push(row);
      }
      for (let level in groupedByLevel) {
        groupedByLevel[level] = groupedByLevel[level].map((row, index) => ({
          ...row.dataValues,
          levelIndex: index
        }));
      }


      for (const elem of approvalData) {

        let discount = await db.quotationApprovalDetails.findOne({ where: { id: elem.qa_detail_id } })

        for (const item of Obj.productDetailList) {
          let updated = null;
          if (elem.level == '1' && elem.approvel_status == "PENDING") {
            const [priceMaster] = await db.sequelize.query(`
               SELECT * FROM MASTER_PRICE AS MP  INNER JOIN MASTER_ITEM_PRICE AS MIP ON MP.id = MIP.price_master_id
              WHERE MIP.item_id=${item.product_master_id} AND MP.customer_id=${Obj.customer_id}
              `)
            const price = priceMaster[0];
            const discountPrice = price?.discount_1 + price?.discount_2 + price?.discount_3;
            if (item.discount_request <= discountPrice) {
              let indexOfLevel = totalApproval.findIndex(a => a.id === item.approval_id);
              console.log(groupedByLevel, 'indexOfLevel', indexOfLevel);

              updated = await db.proposalApprovel.update({ approvel_status: "APPROVED", progressStatus: "CLOSE", remark: "Auto Approved" }, { where: { id: item.approval_id } });
              let sortedLevels = Object.keys(groupedByLevel).sort((a, b) => Number(a) - Number(b));

              for (let lvl of sortedLevels) {
                let groupedData = groupedByLevel[lvl];
                console.log(groupedData)
                await db.proposalApprovel.update({ approvel_status: "APPROVED", progressStatus: "CLOSE", remark: "Auto Approved" }, { where: { id: groupedData[indexOfLevel].id } });
              }
            }
          }
          if (updated && updated[0] === 1) {
            item.approvel_status = "APPROVED";
            await db.proposalList.update({ approvel_status: 'APPROVED' }, { where: { id: item.product_id } })
          }
          let qal = await db.quotationApprovalDetails.findAll({
            where: {
              sub_category_id: item.pro_sub_cat_id, isDeleted: 0
            }
          });

          item.isClicked = false;
          if (elem.approvel_status == 'APPROVED' && elem.level == '1') {
            item.approvel_status = "APPROVED"
          }
          const remainingLevel = await db.proposalApprovel.findAll({
            where: { proposal_id: proposal_id, approvel_status: "PENDING", version_id: id },
          });
          // for (const elem of getItems) {
          if (item.pro_sub_cat_id === discount?.sub_category_id) {
            if (discount.discount >= item.discount_request) {
              item.discountStatus =
                item.approvel_status === "APPROVED"
                  ? "AlreadyApproved"
                  : "Approved";
            } else if (item.approvel_status === "APPROVED") {

              item.discountStatus = "AlreadyApproved";
            }
            else if (remainingLevel.length > 1 && qal.length > remainingLevel[0].level) {
              item.discountStatus = "Forward";
            } else {
              item.discountStatus = "Rejected";
              Obj.finalStatus = "Rejected";
            }
          }
          // }
        }
      }
    }


    let customer_data = await db.customerProfile.findOne({ where: { id: Obj.customer_id, data_status: 'Approve' } })
    if (customer_data) {
      Obj.isCustomerApprove = true;
    } else {
      Obj.isCustomerApprove = false;
    }

    let isForwordBtnShow = false;
    if (req.user.role_master_id === 7 || req.user.role_master_id === 1) {
      isForwordBtnShow = true;
    }

    const CLAW_Data = await db.credit_limit_approval_workflow.findOne({
      where: { proposal_id, version_id: id, reporting_manager_id: req.user.employee_id, final_credit_status: 'PENDING' },
      attributes: ['id', 'credit_approval_status', 'final_credit_status', 'approval_type', 'level_id'],
      include: [
        {
          model: db.level_master, attributes: ['id', 'level_type'],
          include: [{ model: db.creditLimit, attributes: ['id', 'credit_limit', 'over_due_days'], 
            where: {
              status: 'ACTIVE',
              isDeleted: 0
            } 
          }]
        }
      ]
    })

    const lastCreditLimit = await db.creditLimit.findOne({
      where: {
        status: 'ACTIVE',
        isDeleted: 0
      },
      order: [['id', 'DESC']],
      attributes: ['id']
    });

    CLAW_Data?.MASTER_LEVEL?.MASTER_CREDIT_LIMITs?.forEach(item => {
      if (item.id === lastCreditLimit.id) {
        item.credit_limit = 1000000000;
      }
    });

    const currencyData = await db.currency_convert.findAll();
    if (CLAW_Data) {
      Obj.CLAW_Data = CLAW_Data;
      isForwordBtnShow = true;
    } else {
      Obj.CLAW_Data = null
    }
    Obj.isForwordBtnShow = isForwordBtnShow;

    if (Obj) {
      return res.status(200).send({ code: 200, message: "success", data: Obj,currencyData:currencyData });
    } else {
      return res.status(404).send({ code: 404, message: "Data not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

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
      const bomKits = await db.SALESCRM_BOM_KIT.findAll({ where: { item_list_id: row.product_id }});

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

module.exports.previewProposal = async (req, res) => {
  try {
    const { id, proposal_id, proposalApprovelId, action_type } = req.query;
    let condition = ``;
   
    await db.sequelize.query(`SET SESSION sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '');`);

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
            CV.currency_id,
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
            STA2.states_name AS shipping_state_name, CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code,CSA.shipping_gst_in
            FROM CRM_VERSION_PROPOSAL_MST AS CV
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = CV.proposal_id
            LEFT JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
            LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.id = CV.billing_address_id
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
            WHERE CV.id = ${id} ${condition} GROUP BY EMP.employee_id`
    );

    const dataList = await db.sequelize.query(
      `SELECT CP.dbp,CP.totalPrice,CP.totalWithGst,CP.id AS product_id, CP.qty, CP.cgst, CP.approvel_status, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, 
            CP.discount_request, CP.discount_approved, P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, 
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
          PCD.custome_type, PCD.basket_mst_id,
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
          BHSN.hsn_sac_code AS branding_hsn_sac_code ,
          BHSN.description,
          MGRN.value,          
          MB.type_of_basket,MB.basket_qty, MB.price_per_unit, MHSN.hsn_sac_code AS basket_hsn_code, GRMM.value As basket_gst_value,
          CP.discount1,CP.discount2,CP.discount3,
          CP.discount1Mode,CP.discount2Mode,CP.discount3Mode,
          CP.discount1Flat,CP.discount2Flat,CP.discount3Flat,
          CP.flatPercentage1,CP.flatPercentage2,CP.flatPercentage3,MID.image AS item_img_path,
          CP.totalDiscountAmount,CRB.totalDiscountAmount as totalDiscountAmountB,PCD.totalDiscountAmount as totalDiscountAmountC,
          CP.totalDiscountAmountPerQTY,CRB.totalDiscountAmountPerQTY as totalDiscountAmountPerQTYB,PCD.totalDiscountAmountPerQTY as totalDiscountAmountPerQTYC,
          CP.warranty,CRB.gst as branding_gst,
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
            LEFT JOIN MASTER_BASKET AS MB ON MB.id = PCD.basket_mst_id
            LEFT JOIN MASTER_UOM AS BASUOM ON BASUOM.uom_id = MB.uom_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS MHSN ON MHSN.id = MB.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS GRMM ON GRMM.id = MHSN.gst_rate_id
            LEFT JOIN CRM_PROPOSAL_BRANDING AS CRB ON PCT.id = CRB.proposal_customisation_id
            LEFT JOIN MASTER_BRANDING AS MBR ON MBR.id = CRB.branding_mst_id
            LEFT JOIN MASTER_UOM AS BRAUOM ON BRAUOM.uom_id = MBR.uom_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS BHSN ON BHSN.id = MBR.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS MGRN ON MGRN.id = BHSN.gst_rate_id 
            LEFT JOIN MASTER_ACCESSORIES_NAME AS ACC ON ACC.id = PCD.accessory_in_name
            LEFT JOIN MASTER_UOM AS ACCUOM ON ACCUOM.uom_id = ACC.uom_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS AHSN ON AHSN.id = ACC.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS AGRM ON AGRM.id = AHSN.gst_rate_id 
            LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = P.hsn_code_id 
            LEFT JOIN MASTER_ITEM AS mi ON mi.id = PCD.accessory_in_name
            LEFT JOIN MASTER_ASSET AS ma ON ma.id = PCD.accessory_in_category
            LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = PCD.accessory_in_sub_category
            WHERE CV.id = ${id} AND CV.proposal_id = ${proposal_id} AND CP.isDeleted = 0`
    );

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
            WHERE GD.proposal_id = ${proposal_id} 
              AND GD.version_id = ${id}
              AND GD.discount_type IS NOT NULL
              AND GD.discount_value IS NOT NULL`
    );

    let currencyData = await db.currency_convert.findOne({where:{Currency_Convert_id:proposalData[0][0]?.currency_id}})
    let bankData;
    if (proposalData[0][0]?.dealer) {
      bankData = await db.customer_business_details.findOne({ where: { customer_id: proposalData[0][0]?.dealer_id } });
    } else {
      bankData = await this.bankDetails(dataList[0]?.entity_id);
    }

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
          dbp: row.dbp,
          totalPrice: row.totalPrice,
          totalWithGst: row.totalWithGst,
          currency_symbol: row.currency_symbol,
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
          price_per_unit: row.price_per_unit,
          maximum_discount: row.maximum_discount,
          product_category_id: row.product_category_id,
          uom_name: row.uom_name,
          uom_id: row.uom_id,
          item_img_path: row.item_img_path,
          paymentTC: row.paymentTC,
          pro_sub_cat_id: row.pro_sub_cat_id,
          select_scheme: row.select_scheme,
          custom_branding: [] // <- Instead of 3 separate fields
        };
        productMap.set(productId, baseProduct);
      }
      const product = productMap.get(productId);

      // add Installation Kit (BOM) 
      const bomKits = await db.SALESCRM_BOM_KIT.findAll({ where: { item_list_id: row.product_id }});

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
          discount: row.customisation_discount ? (row.customisation_discount || 0) + '%' : 0,
          totalDiscountAmountC: row.totalDiscountAmountC,
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
          totalDiscountAmountC: row.totalDiscountAmountC,
          totalDiscountAmountPerQTYC: row.totalDiscountAmountPerQTYC,
          gst: row.gst,
          total_price: row.total_price,
          qty: row.custom_qty,
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
          updatedAt: row.brandingUpdatedAt,
          proposal_item_id: row.branding_proposal_item_id,
          version_id: row.branding_version_id,
          proposal_customisation_id: row.proposal_scheme_type_id || null,
          gst: row.branding_gst,
          bra_uom_name: row.brauom_name
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
      currencyData:currencyData,
      charges: charges,
      productDetailList: productDetailList,
      grossDiscountDetail: grossDiscountData,
      bankData: bankData,
      paymentDetails: paymentDetails,
      sales_documents: sales_documents,
      scheme_id: scheme_id,
    };

    if (Obj) {
      return res.status(200).send({ code: 200, message: "success", data: Obj });
    } else {
      return res.status(404).send({ code: 404, message: "Data not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.bankDetails = async (entityid) => {
  let entity_id = entityid ? entityid : 1;
  let [result] = await db.sequelize.query(
    `SELECT 
      MB.bank_name, 
      MB.ifsc_code,
      MBA.account_name,
      MBA.bank_account_no,
      MBA.account_type
    FROM MASTER_BANK AS MB
    LEFT JOIN MASTER_BANK_ACCOUNT AS MBA
      ON MBA.bank_id = MB.id
    WHERE MB.isDeleted = false
      AND MB.status = true
      AND MB.entity_id = ${entity_id}
    ORDER BY MB.id DESC
    LIMIT 1`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );

  if (!result) {
    return {
      bank_name: "NA",
      ifsc_code: "NA",
      account_name: "NA",
      bank_account_no: "NA",
      account_type: "NA",
    };
  }
  return result;
};

module.exports.getExistingProposalById = async (req, res) => {
  try {
    const { id } = req.query;
    const [result] = await db.sequelize.query(`
        SELECT DISTINCT C.proposal_no, C.id, C.proposal_type, C.gst_no, C.total_cost, C.additional_charges, C.discount, C.taxable_value, C.sgst, C.cgst,
        C.igst, C.grant_total, C.mail_id , C.proposal_status, C.request_type, C.company_name,C.lead_owner,C.contact_person_name,C.contact_number,
        C.mail_id,
        DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt
        FROM CRM_CREATE_PROPOSAL_MST AS C
        WHERE C.id =${id} ORDER BY C.id DESC`);

    const [allResult] = await db.sequelize.query(
      `SELECT DISTINCT CP.id, CP.qty, CP.cgst, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, CP.discount_request, CP.discount_approved,
                P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, PV.variant_name,
                PV.product_description, CP.price_per_unit, PV.maximum_discount, T.uom_name, T.uom_id, 
                FROM CRM_PROPOSAL_LIST_MST AS CP
                INNER JOIN CRM_CREATE_PROPOSAL_MST AS C ON CP.proposal_id = C.id
                INNER JOIN MASTER_ITEM AS P ON P.id = CP.product_master_id
               
                INNER JOIN MASTER_UOM AS T ON CP.uom_id = T.uom_id 
                WHERE CP.proposal_id = ${id}
                AND CP.createdAt = (SELECT MAX(createdAt) 
                               FROM CRM_PROPOSAL_LIST_MST 
                               WHERE proposal_id = ${id})`
    );
    const transformedResult = {
      ...result[0],
      productDetailList: allResult,
    };

    if (transformedResult) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: transformedResult });
    } else {
      return res.status(404).send({
        code: 404,
        message: " data not found ",
        data: transformedResult,
      });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.add_customisation_branding = async (req, res) => {
  try {
    let {
      customization,
      branding,
      createLeadDetails,
      customer_type,
      quotation_id,
      proposal_no,
      customer_id,
      remarks,
    } = req.body;

    let proposalData;
    proposalData = customization[0];
    let createdProduct;
    if (
      proposalData.proposal_item_id === null &&
      createLeadDetails !== null &&
      customer_type == "NEW"
    ) {
      createdProduct = await db.createLeadDetails.create({
        product_category_id: createLeadDetails.product_category_id,
        product_id: createLeadDetails.product_master_id,
        pro_sub_cat_id: createLeadDetails.product_sub_category_id,
        create_lead_id: quotation_id,
        proposal_no: proposal_no,
      });

      proposalData.proposal_item_id = createdProduct.id;
    }
    if (
      proposalData.proposal_item_id !== null &&
      createLeadDetails == null &&
      customer_type == "NEW"
    ) {
      createdProduct = await db.createLeadDetails.update(
        {
          proposal_no: proposal_no,
        },
        { where: { id: proposalData.proposal_item_id } }
      );

      proposalData.proposal_item_id = proposalData.proposal_item_id;
    }

    if (
      proposalData.customer_item_id === null &&
      createLeadDetails !== null &&
      customer_type == "EXISTING"
    ) {
      const createdProduct = await db.customer_item_list.create({
        product_category_id: createLeadDetails.product_category_id,
        product_id: createLeadDetails.product_master_id,
        pro_sub_cat_id: createLeadDetails.product_sub_category_id,
        order_qty: createLeadDetails.order_qty,
        gst: createLeadDetails.gst,
        discount: createLeadDetails.discount,
        customer_id: customer_id,
        proposal_no: proposal_no,
      });

      proposalData.customer_item_id = createdProduct.id;
    }

    if (
      proposalData.customer_item_id === null &&
      createLeadDetails !== null &&
      customer_type == "EXISTING"
    ) {
      const createdProduct = await db.customer_item_list.create({
        product_category_id: createLeadDetails.product_category_id,
        product_id: createLeadDetails.product_master_id,
        pro_sub_cat_id: createLeadDetails.product_sub_category_id,
        order_qty: createLeadDetails.order_qty,
        gst: createLeadDetails.gst,
        discount: createLeadDetails.discount,
        customer_id: customer_id,
        proposal_no: proposal_no,
      });

      proposalData.customer_item_id = createdProduct.id;
    }

    if (customization.length > 0 && customer_type == "NEW") {
      const existingProposal = await db.proposal_scheme_type.findOne({
        where: { proposal_item_id: proposalData.proposal_item_id },
      });

      if (existingProposal) {
        await db.proposal_scheme_data.destroy({
          where: { proposal_scheme_type_id: existingProposal.id },
        });

        await existingProposal.destroy();
      }

      const saveProposalType = await db.proposal_scheme_type.create({
        proposal_item_id: proposalData.proposal_item_id,
        proposal_no: proposal_no,
        qty: proposalData.qty,
        select_scheme: proposalData.select_scheme,
        total_in_gst: proposalData.total_in_gst,
        total_out_gst: proposalData.total_out_gst,
        grand_in_total: proposalData.grand_in_total,
        grand_out_total: proposalData.grand_out_total,
        substract_total: proposalData.substract_total,
        add_total: proposalData.add_total,
        remarks: remarks,
        order_qty: proposalData.order_qty,
      });

      const customizationRecords = proposalData.customization.map(
        (customizationItem) => {
          return db.proposal_scheme_data.create({
            proposal_scheme_type_id: saveProposalType.id,
            qty: customizationItem.qty,
            price_per_unit: customizationItem.price_per_unit,
            accessory_in_category: customizationItem.accessory_in_category,
            accessory_in_sub_category:
              customizationItem.accessory_in_sub_category,
            accessory_in_name: customizationItem.accessory_in_name,
            total_price: customizationItem.total_price,
            gst: customizationItem.gst,
            customization_type: customizationItem.customization_type,
          });
        }
      );

      await Promise.all(customizationRecords);
    }

    if (customization.length > 0 && customer_type == "EXISTING") {
      const existingProposal = await db.proposal_scheme_type.findOne({
        where: { customer_item_id: proposalData.customer_item_id },
      });

      if (existingProposal) {
        await db.proposal_scheme_data.destroy({
          where: { proposal_scheme_type_id: existingProposal.id },
        });

        await existingProposal.destroy();
      }

      const saveProposalType = await db.proposal_scheme_type.create({
        customer_item_id: proposalData.customer_item_id,
        proposal_no: proposal_no,
        qty: proposalData.qty,
        select_scheme: proposalData.select_scheme,
        total_in_gst: proposalData.total_in_gst,
        grand_in_total: proposalData.grand_in_total,
        grand_out_total: proposalData.grand_out_total,
        substract_total: proposalData.substract_total,
        add_total: proposalData.add_total,
        customer_type: customer_type,
        remarks: remarks,
      });

      const customizationRecords = proposalData.customization.map(
        (customizationItem) => {
          return db.proposal_scheme_data.create({
            proposal_scheme_type_id: saveProposalType.id,
            qty: customizationItem.qty,
            price_per_unit: customizationItem.price_per_unit,
            accessory_in_category: customizationItem.accessory_in_category,
            accessory_in_sub_category:
              customizationItem.accessory_in_sub_category,
            accessory_in_name: customizationItem.accessory_in_name,
            total_price: customizationItem.total_price,
            gst: customizationItem.gst,
            customization_type: customizationItem.customization_type,
          });
        }
      );

      await Promise.all(customizationRecords);
    }

    if (branding && customer_type == "NEW") {
      const existingBranding = await db.proposal_branding_scheme.findOne({
        where: { proposal_item_id: proposalData.proposal_item_id },
      });

      if (existingBranding) {
        await existingBranding.destroy();
      }

      await db.proposal_branding_scheme.create({
        qty: branding.qty,
        proposal_no: proposal_no,
        branding_description: branding.branding_description,
        branding_amt: branding.branding_amt,
        branding_sides: branding.branding_sides,
        proposal_item_id: proposalData.proposal_item_id,
      });
    }
    if (branding && customer_type == "EXISTING") {
      const existingBranding = await db.proposal_branding_scheme.findOne({
        where: { customer_item_id: proposalData.customer_item_id },
      });

      if (existingBranding) {
        await existingBranding.destroy();
      }

      await db.proposal_branding_scheme.create({
        qty: branding.qty,
        proposal_no: proposal_no,
        branding_description: branding.branding_description,
        branding_amt: branding.branding_amt,
        branding_sides: branding.branding_sides,
        customer_item_id: proposalData.customer_item_id,
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Customisation & Branding Successfully created",
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.add_proposal_customisation_branding = async (req, res) => {
  try {
    const {
      customization = [],
      branding,
      createLeadDetails,
      proposal_id,
      proposal_no,
      remarks,
      version_id,
      action_type,
    } = req.body;

    if (!customization.length) {
      return res
        .status(400)
        .send({ code: 400, message: "Customization data is required" });
    }

    let proposalData = customization[0];
    let createdProduct;
    // Update if exists and createLeadDetails present
    if (proposalData.proposal_item_id && createLeadDetails) {
      await db.proposalList.update(
        {
          product_category_id: createLeadDetails.product_category_id,
          product_master_id: createLeadDetails.product_master_id,
          pro_sub_cat_id: createLeadDetails.product_sub_category_id,
          proposal_id: proposal_id,
          qty: createLeadDetails.qty,
          price_per_unit: createLeadDetails.price_per_unit,
          apply_scheme: createLeadDetails.apply_scheme,
          promo_item: createLeadDetails.promo_item,
          new_item: createLeadDetails.new_item,
          uom_id: createLeadDetails.uom_id,
          scheme_id: createLeadDetails.scheme_id,
          version_id: createLeadDetails.version_id,
          action_type: action_type,
          select_scheme: createLeadDetails.select_scheme,
        },
        {
          where: { id: proposalData.proposal_item_id },
        }
      );
    }

    // Create if not exists and createLeadDetails present
    if (proposalData.proposal_item_id == null && createLeadDetails) {
      createdProduct = await db.proposalList.create({
        product_category_id: createLeadDetails.product_category_id,
        product_master_id: createLeadDetails.product_master_id,
        pro_sub_cat_id: createLeadDetails.product_sub_category_id,
        proposal_id: proposal_id,
        qty: createLeadDetails.qty,
        price_per_unit: createLeadDetails.price_per_unit,
        apply_scheme: createLeadDetails.apply_scheme,
        promo_item: createLeadDetails.promo_item,
        new_item: createLeadDetails.new_item,
        uom_id: createLeadDetails.uom_id,
        scheme_id: createLeadDetails.scheme_id,
        version_id: createLeadDetails.version_id,
        action_type: action_type,
        select_scheme: createLeadDetails.select_scheme,
      });
      proposalData.proposal_item_id = createdProduct.id;
    }

    // Update only action_type if createLeadDetails is null
    if (proposalData.proposal_item_id && !createLeadDetails) {
      await db.proposalList.update(
        {
          action_type: action_type,
          select_scheme: proposalData.scheme_id,
        },
        {
          where: {
            id: proposalData.proposal_item_id,
            version_id: version_id,
          },
        }
      );
    }

    // Handle Customization
    const existingProposal = await db.proposal_customisation_type.findOne({
      where: {
        proposal_item_id: proposalData.proposal_item_id,
        version_id: version_id,
      },
    });

    if (existingProposal) {
      await db.proposal_customisation_data.destroy({
        where: { proposal_customisation_id: existingProposal.id },
      });
      await existingProposal.destroy();
    }

    const saveProposalType = await db.proposal_customisation_type.create({
      proposal_item_id: proposalData.proposal_item_id,
      proposal_no: proposal_no,
      qty: proposalData.qty,
      order_qty: proposalData.order_qty,
      select_scheme: proposalData.select_scheme,
      total_in_gst: proposalData.total_in_gst,
      total_out_gst: proposalData.total_out_gst,
      grand_in_total: proposalData.grand_in_total,
      grand_out_total: proposalData.grand_out_total,
      substract_total: proposalData.substract_total,
      add_total: proposalData.add_total,
      remarks: remarks,
      version_id: version_id,
      action_type: action_type,
    });

    const customizationRecords = proposalData.customization.map((item) => {
      return db.proposal_customisation_data.create({
        proposal_customisation_id: saveProposalType.id,
        qty: item.qty,
        price_per_unit: item.price_per_unit,
        accessory_in_category: item.accessory_in_category,
        accessory_in_sub_category: item.accessory_in_sub_category,
        accessory_in_name: item.accessory_in_name,
        total_price: item.total_price,
        gst: item.gst,
        customization_type: item.customization_type,
      });
    });

    await Promise.all(customizationRecords);

    // Handle Branding
    if (branding) {
      const existingBranding = await db.proposal_branding.findOne({
        where: {
          proposal_item_id: proposalData.proposal_item_id,
          version_id: version_id,
        },
      });

      if (existingBranding) {
        await existingBranding.destroy();
      }

      await db.proposal_branding.create({
        qty: branding.qty,
        proposal_no: proposal_no,
        branding_description: branding.branding_description,
        branding_amt: branding.branding_amt,
        branding_sides: branding.branding_sides,
        proposal_item_id: proposalData.proposal_item_id,
        version_id: version_id,
        action_type: action_type,
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Customisation & Branding successfully created",
    });
  } catch (error) {
    console.error("Error in add_proposal_customisation_branding:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error",
    });
  }
};

module.exports.get_customisation_branding = async (req, res) => {
  try {
    let proposal_item_id = req.params.id;
    let { proposal_no } = req.body;

    if (isNaN(proposal_item_id)) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid proposal item ID" });
    }

    const result = await db.sequelize.query(
      `
            SELECT 
                pst.id AS scheme_type_id,
                pst.proposal_item_id,
                pst.qty AS item_qty,
                pst.total_in_gst,
                pst.grand_in_total,
                pst.grand_out_total,
                pst.select_scheme,
                pst.order_qty, 
                pst.substract_total,
                pst.add_total,
                psd.id AS scheme_data_id,
                psd.qty AS psd_qty,
                psd.price_per_unit,
                psd.status,
                psd.accessory_in_category,
                psd.accessory_in_sub_category,
                psd.accessory_in_name,
                psd.total_price,
                psd.gst,
                psd.customization_type,
                psd.proposal_scheme_type_id,
            
                ma.asset_category_name,
                msc.sub_category_name,
                mi.item_name

            FROM CRM_PROPOSAL_SCHEME_TYPE pst
            LEFT JOIN CRM_PROPOSAL_SCHEME_DATA psd ON psd.proposal_scheme_type_id = pst.id
            LEFT JOIN MASTER_ASSET ma ON ma.id = psd.accessory_in_category
            LEFT JOIN MASTER_SUB_CATEGORY msc ON msc.id = psd.accessory_in_sub_category
            LEFT JOIN MASTER_ITEM mi ON mi.id = psd.accessory_in_name

            WHERE pst.proposal_item_id = :proposal_item_id
            AND pst.proposal_no = :proposal_no
            GROUP BY pst.id, psd.id
        `,
      {
        replacements: { proposal_item_id, proposal_no },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!result.length) {
      return res.status(404).send({ code: 404, message: "No data found" });
    }

    // Group and format the result
    const grouped = {};

    result.forEach((row) => {
      const {
        scheme_type_id,
        proposal_item_id,
        item_qty,
        total_in_gst,
        grand_in_total,
        grand_out_total,
        scheme_id,
        order_qty,
        scheme_data_id,
        psd_qty,
        price_per_unit,
        status,
        accessory_in_category,
        accessory_in_sub_category,
        accessory_in_name,
        total_price,
        gst,
        substract_total,
        add_total,
        customization_type,
        asset_category_name,
        sub_category_name,
        item_name,
      } = row;

      if (!grouped[scheme_type_id]) {
        grouped[scheme_type_id] = {
          proposal_item_id,
          qty: item_qty,
          total_in_gst,
          grand_in_total,
          grand_out_total,
          substract_total,
          add_total,
          scheme_id,
          order_qty,
          customization: [],
        };
      }

      if (scheme_data_id) {
        grouped[scheme_type_id].customization.push({
          scheme_data_id,
          qty: psd_qty,
          price_per_unit,
          status,
          accessory_in_category,
          accessory_in_sub_category,
          accessory_in_name,
          total_price,
          gst,
          customization_type,
          asset_category_name,
          sub_category_name,
          item_name,
        });
      }
    });

    const finalData = Object.values(grouped);

    let findBrand = await db.proposal_branding_scheme.findOne({
      where: { proposal_item_id },
    });
    if (finalData.length > 0) {
      finalData[0].branding = findBrand || null;
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.get_proposal_customisation_branding = async (req, res) => {
  try {
    let proposal_item_id = req.params.id;
    let { proposal_no } = req.body;

    if (isNaN(proposal_item_id)) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid proposal item ID" });
    }

    const result = await db.sequelize.query(
      `
            SELECT 
                pst.id AS scheme_type_id,
                pst.proposal_item_id,
                pst.qty AS item_qty,
                pst.total_in_gst,
                pst.grand_in_total,
                pst.grand_out_total,
                pst.select_scheme,
                pst.order_qty, 
                pst.substract_total,
                pst.add_total,
                psd.id AS scheme_data_id,
                psd.qty AS psd_qty,
                psd.price_per_unit,
                psd.status,
                psd.accessory_in_category,
                psd.accessory_in_sub_category,
                psd.accessory_in_name,
                psd.total_price,
                psd.gst,
                psd.customization_type,
                psd.proposal_customisation_id,
                psd.custome_type,
                psd.basket_mst_id,
                psd.no_of_partician,
            
                ma.asset_category_name,
                msc.sub_category_name,
                mi.accessories_name AS item_name

            FROM CRM_PROPOSAL_CUSTOMISATION_TYPE pst
            LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_DATA psd ON psd.proposal_customisation_id = pst.id
            LEFT JOIN MASTER_ASSET ma ON ma.id = psd.accessory_in_category
            LEFT JOIN MASTER_SUB_CATEGORY msc ON msc.id = psd.accessory_in_sub_category
            LEFT JOIN MASTER_ACCESSORIES_NAME mi ON mi.id = psd.accessory_in_name

            WHERE pst.proposal_item_id = :proposal_item_id
            AND pst.proposal_no = :proposal_no
            GROUP BY pst.id, psd.id
        `,
      {
        replacements: { proposal_item_id, proposal_no },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!result.length) {
      return res.status(404).send({ code: 404, message: "No data found" });
    }

    // Group and format the result
    const grouped = {};

    result.forEach((row) => {
      const {
        scheme_type_id,
        proposal_item_id,
        item_qty,
        total_in_gst,
        grand_in_total,
        grand_out_total,
        scheme_id,
        order_qty,
        scheme_data_id,
        psd_qty,
        price_per_unit,
        status,
        accessory_in_category,
        accessory_in_sub_category,
        accessory_in_name,
        total_price,
        gst,
        substract_total,
        add_total,
        customization_type,
        asset_category_name,
        sub_category_name,
        item_name,
      } = row;

      if (!grouped[scheme_type_id]) {
        grouped[scheme_type_id] = {
          proposal_item_id,
          qty: item_qty,
          total_in_gst,
          grand_in_total,
          grand_out_total,
          substract_total,
          add_total,
          scheme_id,
          order_qty,
          customization: [],
        };
      }

      if (scheme_data_id) {
        grouped[scheme_type_id].customization.push({
          scheme_data_id,
          qty: psd_qty,
          price_per_unit,
          status,
          accessory_in_category,
          accessory_in_sub_category,
          accessory_in_name,
          total_price,
          gst,
          customization_type,
          asset_category_name,
          sub_category_name,
          item_name,
          no_of_partician,
          basket_mst_id,
          custome_type,
        });
      }
    });

    const finalData = Object.values(grouped);

    let findBrand = await db.proposal_branding.findOne({
      where: { proposal_item_id },
    });
    if (finalData.length > 0) {
      finalData[0].branding = findBrand || null;
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.updateProposalVersion = async (req, res) => {
  try {
    let version_id = req.params.version_id;
    if (!version_id) {
      return res.status(200).send({
        code: 400,
        message: "Undefined version please select valid version",
      });
    }
    let isExistVersion = await db.salesBooking.findOne({
      where: { id: version_id },
    });
    if (!isExistVersion) {
      return res.status(200).send({ code: 400, message: "Version not found" });
    }
    let updatedVersion = await db.salesBooking.update(
      { is_book_created: true },
      { where: { id: version_id } }
    );
    if (updatedVersion) {
      return res
        .status(200)
        .send({ code: 200, message: "Proposal has been send for SO !" });
    } else {
      return res.status(200).send({ code: 200, message: "Failed, Try again!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.updateBookingProposalVersion = async (req, res) => {
  try {
    let version_id = req.params.version_id;
    let proposal_id = req.params.proposal_id
    if (!version_id) {
      return res.status(200).send({
        code: 400,
        message: "Undefined version please select valid version",
      });
    }
    let isExistVersion = await db.versionData.findOne({
      where: { id: version_id },
    });
    if (!isExistVersion) {
      return res.status(200).send({ code: 400, message: "Version not found" });
    }
    let updatedVersion = await db.versionData.update(
      { is_booking_created: true },
      { where: { id: version_id } }
    );

    await db.proposal_performa_invoice.update(
      { approvel_status: "APPROVED" }, { where: { version_id: version_id, proposal_id: proposal_id } }
    )
    if (updatedVersion) {
      return res
        .status(200)
        .send({ code: 200, message: "Proposal booking has been successfully sent for sales booking!" });
    } else {
      return res.status(200).send({ code: 200, message: "Failed, Try again!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.get_customisation_branding_existing_client = async (
  req,
  res
) => {
  try {
    let customer_item_id = req.params.id;
    let { proposal_no } = req.body;

    if (isNaN(customer_item_id)) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid proposal item ID" });
    }

    const result = await db.sequelize.query(
      `
            SELECT 
                pst.id AS scheme_type_id,
                pst.customer_item_id,
                pst.qty AS item_qty,
                pst.total_in_gst,
                pst.grand_in_total,
                pst.grand_out_total,
                pst.select_scheme,
                pst.substract_total,
                pst.add_total,
                psd.id AS scheme_data_id,
                psd.qty AS psd_qty,
                psd.price_per_unit,
                psd.status,
                psd.accessory_in_category,
                psd.accessory_in_sub_category,
                psd.accessory_in_name,
                psd.total_price,
                psd.gst,
                psd.customization_type,
                psd.proposal_scheme_type_id,
            
                ma.asset_category_name,
                msc.sub_category_name,
                mi.item_name,
                mi.item_code,
                mi.description

            FROM CRM_PROPOSAL_SCHEME_TYPE pst
            LEFT JOIN CRM_PROPOSAL_SCHEME_DATA psd ON psd.proposal_scheme_type_id = pst.id
            LEFT JOIN MASTER_ASSET ma ON ma.id = psd.accessory_in_category
            LEFT JOIN MASTER_SUB_CATEGORY msc ON msc.id = psd.accessory_in_sub_category
            LEFT JOIN MASTER_ITEM mi ON mi.id = psd.accessory_in_name

            WHERE pst.customer_item_id = :customer_item_id
            GROUP BY pst.id, psd.id
        `,
      {
        replacements: { customer_item_id, proposal_no },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!result.length) {
      return res.status(404).send({ code: 404, message: "No data found" });
    }

    // Group and format the result
    const grouped = {};

    result.forEach((row) => {
      const {
        scheme_type_id,
        customer_item_id,
        item_qty,
        total_in_gst,
        grand_in_total,
        grand_out_total,
        select_scheme,
        scheme_data_id,
        psd_qty,
        price_per_unit,
        status,
        accessory_in_category,
        accessory_in_sub_category,
        accessory_in_name,
        total_price,
        gst,
        substract_total,
        add_total,
        customization_type,
        asset_category_name,
        sub_category_name,
        item_name,
        item_code,
        description,
      } = row;

      if (!grouped[scheme_type_id]) {
        grouped[scheme_type_id] = {
          customer_item_id,
          qty: item_qty,
          total_in_gst,
          grand_in_total,
          grand_out_total,
          substract_total,
          add_total,
          select_scheme,
          customization: [],
        };
      }

      if (scheme_data_id) {
        grouped[scheme_type_id].customization.push({
          scheme_data_id,
          qty: psd_qty,
          price_per_unit,
          status,
          accessory_in_category,
          accessory_in_sub_category,
          accessory_in_name,
          total_price,
          gst,
          customization_type,
          asset_category_name,
          sub_category_name,
          item_name,
          item_code,
          description,
        });
      }
    });

    const finalData = Object.values(grouped);

    let findBrand = await db.proposal_branding_scheme.findOne({
      where: { customer_item_id },
    });
    if (finalData.length > 0) {
      finalData[0].branding = findBrand || null;
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.createNewCustomer = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      gst_no,
      mail_id,
      company_name,
      contact_person_name,
      contact_number,
      financial_year_id,
      entity_id,
      employee_id,
      country_id,
      state_id,
      city_id,
      address,
      pincode,
      postal_address,
      title,
      dealer_id
    } = req.body;

    // ✅ Generate customer_code safely
    const customer_code = btoa(Math.random().toString()).slice(0, 10).toUpperCase();

    // 1. Create customer profile
    const newCustomer = await db.customerProfile.create(
      {
        gst_in: gst_no,
        company_name,
        entity_id,
        customer_code,
        financial_year_id,
        employee_id,
        dealer_id
      },
      { transaction: t }
    );

    if (!newCustomer) {
      await t.rollback();
      return res
        .status(500)
        .send({ code: 500, message: "Failed to create customer profile" });
    }

    // 2. Create customer address
    const customerAddress = await db.customerAddress.create(
      {
        customer_id: newCustomer.id,
        billing_country_id: country_id,
        billing_state_id: state_id,
        billing_city_id: city_id,
        shipping_country_id: country_id,
        shipping_state_id: state_id,
        shipping_city_id: city_id,
        billing_address: address,
        shipping_address: address,
        billing_pin_code: pincode,
        shipping_pin_code: pincode,
        shipping_postal_address: postal_address,
        billing_postal_address: postal_address,
      },
      { transaction: t }
    );

    // 3. Create contact
    const customerContact = await db.customerAddressContact.create(
      {
        customer_id: newCustomer.id,
        title: title,
        contact_person_name,
        mobile: contact_number,
        email_id: mail_id,
      },
      { transaction: t }
    );

    // 4. Create credit/debit record
    const createData = await db.customerCreditDebit.create(
      {
        customer_id: newCustomer.id,
        utilized_credit_limit: 0,
      },
      { transaction: t }
    );

    // ✅ Commit transaction
    await t.commit();

    return res.status(200).send({
      code: 200,
      message: "Customer created successfully",
      customer: newCustomer,
      customer_id: newCustomer.id,
      contact_id: customerContact.id,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    await t.rollback();
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error", error: error.message });
  }
};

exports.getAllApprovalLevelProposal = async (req, res) => {
  try {
    const { dep_id, workflow_type, id, version_id } = req.query;

    const getData = await db.proposalApprovel.findAll({
      where: {
        proposal_id: id,
        workflow_type,
        version_id,
      },
      attributes: [
        "employee_id",
        [db.Sequelize.fn("MAX", db.Sequelize.col("level")), "level"],
        [db.Sequelize.fn("MAX", db.Sequelize.col("approvel_status")), "approvel_status"],
        [db.Sequelize.fn("MAX", db.Sequelize.col("department_id")), "department_id"],
        // [db.Sequelize.fn("MAX", db.Sequelize.col("remark")), "remark"],
        [db.Sequelize.fn("GROUP_CONCAT", db.Sequelize.col("remark")), "remark"],
        [db.Sequelize.fn("MAX", db.Sequelize.col("workflow_type")), "workflow_type"],
        [db.Sequelize.fn("MAX", db.Sequelize.col("role_id")), "role_id"],
        [db.Sequelize.fn("MAX", db.Sequelize.col("workflow_id")), "workflow_id"],


      ],
      group: ["employee_id"],
    });

    if (!getData || getData.length === 0) {
      return res.status(400).send({ code: 400, message: "Data not found" });
    }

    if (dep_id) {
      getData.forEach((levelInfo) => {
        //levelInfo.department_id = dep_id;
        levelInfo.workflow_type = workflow_type;
      });
    }
    let count = 0;
    let levelsWithNames = [];
    for (const levelInfo of getData) {
      count = count + 1
      const employeeInfo = await db.user.findOne({
        where: {
          employee_id: levelInfo.employee_id,
        },
        attributes: ["first_name", "last_name"],
      });

      if (!employeeInfo) {
        return res.status(400).send({
          code: 400,
          message: "User not found for level" + levelInfo.level,
        });
      }
      let remarkData = await db.Work_Flow_range.findOne({
        where: {
          workflow_id: levelInfo.workflow_id,
          employee_id: levelInfo.employee_id,
        },
      });

      const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;

      const levelWithName = {
        level: levelInfo.level,
        name: fullName,
        status: levelInfo.approvel_status,
        remark: levelInfo.remark,
      };
      levelsWithNames.push(levelWithName);
    }
    levelsWithNames = levelsWithNames.sort((a, b) => a.level - b.level);
    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully!",
      data: levelsWithNames,
    });
  } catch (error) {
    // logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.updateProposalItemStatus = async (req, res) => {
  try {
    let { status, proposalApprovalId, version_id, proposal_id } = req.query;
    let { discount_approved, id_product, remark } = req.body;

    let id = id_product;
    let isExistProposal = await db.proposalData.findOne({ where: { id: proposal_id } });

    if (!id) {
      return res.status(400).send({ code: 400, message: "Undefined Item" });
    }

    let approval = await db.proposalApprovel.findOne({
      where: { id: proposalApprovalId },
    });
    if (!approval) {
      return res
        .status(400)
        .send({ code: 400, message: "Approval not found!" });
    }
    // let availableDiscount = await db.Work_Flow_range.findOne({
    //   where: {
    //     workflow_id: approval.workflow_id,
    //     employee_id: approval.employee_id,
    //   },
    // });
    let availableDiscount = await db.quotationApprovalDetails.findOne({ where: { id: approval.qa_detail_id } })
    if (
      availableDiscount.discount &&
      availableDiscount.discount < discount_approved
    ) {
      return res.status(400).send({
        code: 400,
        message: `Available discount ${availableDiscount.discount_percent}%, You can approved discount less than or equal to available discount `,
      });
    }

    let isUpdated = await db.proposalList.update(
      { approvel_status: status, discount_approved: discount_approved },
      { where: { id: id } }
    );
    if (isUpdated) {
      await db.proposalData.update(
        { proposal_status: "approved" },
        { where: { id: proposal_id } }
      );

      await db.proposalApprovel.update(
        { approvel_status: status, progressStatus: "CLOSE", remark: remark },
        { where: { id: proposalApprovalId } }
      );

      let approvedLevel = await db.proposalApprovel.findOne({ where: { id: proposalApprovalId } });
      let approvelDetail = await db.quotationApprovalDetails.findOne({ where: { id: approvedLevel.qa_detail_id } });
      let approvelDetailCategory = await db.quotationApprovalDetails.findAll({ where: { isDeleted: 0, sub_category_id: approvelDetail.sub_category_id } });
      if (status === 'Approved') {
        let levelCount = parseInt(approvedLevel?.level);
        for (const el of approvelDetailCategory) {

          let xx = await db.proposalApprovel.findOne(
            //  { approvel_status: status, progressStatus: "CLOSE" },
            { where: { qa_detail_id: el.id, approvel_status: 'PENDING', progressStatus: 'OPEN', proposal_id: proposal_id, version_id: version_id } }
          );
          console.log('==============>', xx);
          if (xx) {

            let isUpdateds = await db.proposalApprovel.update(
              { approvel_status: status, progressStatus: "CLOSE" },
              { where: { id: xx.id, qa_detail_id: el.id } }
            );
            if (isUpdateds) {
              levelCount = levelCount + 1;
            }
          }
        }
      }
      // await db.proposalApprovel.update(
      //   { approvel_status: status, progressStatus: "CLOSE" },
      //   { where: { id: proposalApprovalId } }
      // );
      let levelData = await db.proposalApprovel.findOne({
        where: {
          version_id: version_id,
          approvel_status: "PENDING",
          progressStatus: "OPEN",
        },
      });
      if (!levelData) {
        await db.versionData.update(
          { version_status: "approved" },
          { where: { id: version_id } }
        );
      }
      if (status === "Rejected") {
        await db.versionData.update(
          { version_status: "reject", remark: remark },
          { where: { id: version_id } }
        );
      }
      let proposalList = await db.proposalList.findOne({
        where: {
          version_id: version_id,
          approvel_status: { [Op.in]: ["PENDING", "FORWARD"] },
        },
      });
      if (!proposalList) {
        let approvelId = await db.proposalApprovel.findAll({
          where: { version_id: version_id, approvel_status: "PENDING" },
        });
        let remainingLevel = approvelId.filter(
          (x) => x.id !== proposalApprovalId
        );
        if (Array.isArray(remainingLevel) && remainingLevel.length) {

          for (let level of remainingLevel) {
            if (status === 'Rejected') {
              await db.versionData.update(
                { version_status: "reject" },
                { where: { id: version_id } }
              );
              await db.proposalApprovel.update(
                { approvel_status: status, progressStatus: "CLOSE" },
                { where: { id: level.id } }
              );
            } else {
              await db.proposalApprovel.update(
                { approvel_status: status, progressStatus: "CLOSE" },
                { where: { id: level.id } }
              );
              await db.versionData.update(
                { version_status: "approved" },
                { where: { id: version_id } }
              );
              if (isExistProposal.quotation_type === 'direct') {
                await db.versionData.update(
                  { is_booking_created: true },
                  { where: { id: version_id } }
                );
                await db.proposal_performa_invoice.update(
                  { approvel_status: "APPROVED" }, { where: { version_id: version_id, proposal_id: proposal_id } }
                )
              }
            }
          }
        } else if (status === "Approved" && isExistProposal.quotation_type === 'direct') {
          await db.versionData.update(
            { is_booking_created: true },
            { where: { id: version_id } }
          );
          await db.proposal_performa_invoice.update(
            { approvel_status: "APPROVED" }, { where: { version_id: version_id, proposal_id: proposal_id } }
          )
        }


      }
      return res
        .status(200)
        .send({ code: 200, message: `Item ${status} Successfully!` });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: `Item ${status} Failed!` });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.generate_performa_invoice = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    let { proposal_id, version_id, send_pi_link, page_mode, approvel_status, entity_id,
      status,idPI
     } = req.body;

    // agar send_pi_link hai to bas wahi chalega, baki kuch nahi
    let data = await getProposalPreviewData(version_id, proposal_id);


    if (send_pi_link) {
      await sendPerformaInoviceReMail(entity_id, data.company_name,data.mail_id,data.proposal_no,send_pi_link);
      // await sendPerformaInoviceReMail(entity_id,status,idPI,proposal_id,version_id, data.contact_person_name, data.mail_id, data.proposal_no,req.headers.origin);   //mail_id
      await t.commit();
      return res.status(200).send({
        code: 200,
        message: "Proforma invoice re-sent successfully.",
      });
    }
    await db.sequelize.query(`SET SESSION sql_mode = REPLACE(@@SESSION.sql_mode,'ONLY_FULL_GROUP_BY','');`);
    // await db.sequelize.query(`SET SESSION sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '');`);
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
           CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CAM.gst_in AS billing_gst, CUT.countryss_name AS billing_country_name,
            STA.states_name AS billing_state_name, CIT.city_name AS billing_city_name, 
           
            CUT2.countryss_name AS shipping_country_name,
            STA2.states_name AS shipping_state_name, CPM3.company_name AS shipping_customer_name,  CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code, CSA.shipping_gst_in,
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
            WHERE CV.id = ${version_id} GROUP BY CP.id`, { transaction: t }
    );
const versionCurrency = await db.versionData.findOne({
  where:{id:version_id},include:[
    {
      model:db.currency_convert
    }
  ]
})

    // quotation case
    let existVersion = await db.versionData.findOne({ where: { id: version_id }, transaction: t });
    let is_version_approvel_status = false;
    if (existVersion.version_status == 'pending') {
      is_version_approvel_status = true;
    }
    if (page_mode === 'quotation') {
      await db.versionData.update({ is_quotation_created: true, is_version_approvel_status: is_version_approvel_status }, { where: { id: version_id }, transaction: t })

      if (approvel_status === 'approved') {
        await db.proposalData.update({
          proposal_status: approvel_status
        }, { where: { id: proposal_id }, transaction: t });
        // pdf + mail
        // let data = await getProposalPreviewData(version_id, proposal_id);



        let result = await generateInvoicePdf(data, proposalData[0][0], proposal_id, version_id, page_mode,versionCurrency); // yha aap proposalData bhi bhej skte ho
        // const mailResult =  await sendPerformaInoviceMail(data.entity_id, proposalData[0][0].company_name, data.created_by_email, data.proposal_no, result, page_mode);  //data.mail_id,
        // if (!mailResult.success) {
        //   console.log("Email failed, rolling back...");
        //   throw new Error("EMAIL SENDING FAILED");
        // }
        mailQueue.add({
          type: "PERFORMA_INVOICE",
          entity_id: data.entity_id,
          contact_person_name: proposalData[0][0].company_name,
          created_by_email: data.mail_id,
          proposal_no: data.proposal_no,
          page_mode,
          fileName: result.fileName,
          pdfBase64: result.pdfBuffer.toString("base64")   // ✅ Base64 safe!
        });

        await db.proposal_performa_invoice.update({
          document: `/uploads/quotation_invoices/${result.fileName}`
        }, { where: { proposal_id, version_id }, transaction: t });
        await t.commit();
        return res.status(200).send({
          code: 200,
          message: 'Quotation mail sent successfully.',
        });
      } else if (approvel_status === 'pending') {
        // no pdf, no mail, only status update
        await t.commit();
        return res.status(200).send({
          code: 200,
          message: "Status updated successfully (No mail sent for pending).",

        });
      }
    }

    // PI case
    if (page_mode === 'pi') {
      await db.versionData.update({ is_pi_created: true, is_version_approvel_status: is_version_approvel_status }, { where: { id: version_id }, transaction: t })

      if (approvel_status === 'approved') {


        await db.proposalData.update({
          proposal_status: approvel_status,
        }, { where: { id: proposal_id }, transaction: t });

        let result = await generateInvoicePdf(data, proposalData[0][0], proposal_id, version_id, page_mode,versionCurrency); // yha aap proposalData bhi bhej skte ho

        // await sendPerformaInoviceMail(data.entity_id, proposalData[0][0].company_name, data.created_by_email, data.pi_number, result, page_mode, proposalData[0][0].pi_number);
        mailQueue.add({
          type: "PERFORMA_INVOICE",
          entity_id: data.entity_id,
          contact_person_name: proposalData[0][0].company_name,
          created_by_email: data.mail_id,
          proposal_no: data.proposal_no,
          page_mode,
          fileName: result.fileName,
          pdfBase64: result.pdfBuffer.toString("base64")   // ✅ Base64 safe!
        });
        await db.proposal_performa_invoice.update({
          document: `/uploads/performa_invoices/${result.fileName}`

        }, { where: { proposal_id, version_id }, transaction: t });
        await t.commit();
        return res.status(200).send({
          code: 200,
          message: 'Performa Invoice mail sent successfully.',
        });
      } else if (approvel_status === 'pending') {
        await t.commit();
        return res.status(200).send({
          code: 200,
          message: "PI is pending, no mail sent.",
        });
      }
    }
    await t.commit();
    return res.status(200).send({
      code: 200,
      message: "No matching condition found.",
    });

  } catch (error) {
    if (t) await t.rollback();
    console.error('generate_performa_invoice error:', error.message);
    return res.status(500).send({ code: 500, message: 'Internal Server Error', error: error.message });
  }
};

module.exports.getAll_generate_performa = async (req, res) => {
  try {
    let { entity_id, financial_year_id, role_master_id, login_id, dealer } = req.query;
    let dealer_status;
    if (dealer == 'true') {
      dealer_status = true;
    } else {
      dealer_status = false;

    }
    // Validate required fields for non-admin roles
    if (role_master_id != 1 && (!entity_id || !financial_year_id || !login_id)) {
      return res.status(400).send({
        code: 400,
        message: 'Missing required parameters: entity_id, financial_year_id or login_id'
      });
    }

    let query = `
  SELECT 
  cvm.is_version_approvel_status,
    cvm.version_status,
    ppi.*,  
    cpm.proposal_no, 
    cp.company_name,
    cp.gst_in,
    cpm.mail_id, 
    cpm.grant_total, 
    cvm.version, 
    cvm.currency_id,
    hru.reporting_manager_id,
    cpm.contact_person_name,  
        cp.customer_type_id,
        cp.id AS customer_id,
    cp.customer_category_id,
    CONCAT(hru.first_name, ' ', hru.last_name) AS lead_owner,

    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', cdm.id,
          'document_name', cdm.document_name,
          'document_type', cdm.upload_document
          
        ) 
      )
      FROM CUSTOMER_DOCUMENT_MST AS cdm
      WHERE cdm.customer_id = cpm.customer_id
    ) AS customer_documents

  FROM PROPOSAL_PERFORMA_INVOICE AS ppi
  LEFT JOIN CRM_CREATE_PROPOSAL_MST AS cpm ON cpm.id = ppi.proposal_id
  LEFT JOIN CRM_VERSION_PROPOSAL_MST AS cvm ON cvm.id = ppi.version_id
  LEFT JOIN HRMS_REGISTERED_USER AS hru ON hru.employee_id = cpm.employee_id
  LEFT JOIN CUSTOMER_PROFILE_MST AS cp ON cp.id = cpm.customer_id
  WHERE 
    ppi.approvel_status = 'PENDING' AND ppi.quotation_type='in direct' AND ppi.dealer=${dealer_status}
`;

    const replacements = {};

    if (role_master_id != 1) {
      query += `
        AND ppi.entity_id = :entity_id 
        AND ppi.financial_year_id = :financial_year_id 
        AND (cpm.employee_id = :login_id OR hru.reporting_manager_id = :login_id)
      `;
      replacements.entity_id = entity_id;
      replacements.financial_year_id = financial_year_id;
      replacements.login_id = login_id;
    }

    query += ` ORDER BY ppi.createdAt DESC`;

    const [result] = await db.sequelize.query(query, { replacements });

    const currencyData = await db.currency_convert.findAll();
    if (result.length > 0) {
      return res.status(200).send({
        code: 200,
        message: 'Fetched successfully',
        data: result,
        currencyData:currencyData
      });
    }

    return res.status(404).send({ code: 404, message: 'Record not found!' });

  } catch (error) {
    console.error('generate_performa_invoice error:', error.message);
    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

module.exports.updateMailStatus = async (req, res) => {
  try {
    let { pi_id, email_status, customer_status, sales_reason_id, reason_remarks, reason_rejectedBy } = req.body;


    // await db.versionData.update({ is_so_created: true }, { where: { id: version_id } })
    if (email_status === "ACCEPTED") {
      await db.proposal_performa_invoice.update({ email_status: email_status, customer_status: customer_status, so_status: "PENDING" }, { where: { id: pi_id } });
    }
    if (email_status === "REJECTED" || customer_status === "REJECTED") {
      await db.proposal_performa_invoice.update({
        email_status: email_status,
        customer_status: customer_status,
        so_status: "REJECTED",
        sales_reason_id: sales_reason_id,
        reason_remarks: reason_remarks,
        reason_rejectedBy: reason_rejectedBy,

      }, { where: { id: pi_id } });
    }
    // await db.salesBooking.update({ booking_status: booking_status }, { where: { proposal_id: proposal_id, version_id: version_id } });

    if (email_status === "ACCEPTED") {
      return res.status(200).send({ code: 200, message: 'Proposal Accepted Successfully.' });
    }
    if (email_status === "REJECTED" || customer_status === "REJECTED") {
      return res.status(200).send({ code: 200, message: 'Proposal Rejected Successfully.' });
    }
  } catch (error) {
    console.error('generate_performa_invoice error:', error.message);
    return res.status(500).send({ code: 500, message: 'Internal Server Error', error: error.message });
  }
};

module.exports.updateBookingStatus = async (req, res) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let { pi_id, booking_status, version_id, proposal_id, so_status, login_id, reason_remarks, sales_reason_id, credit_remark, sales_booking_id } = req.body;

    pi_id = parseInt(pi_id)
    version_id = parseInt(version_id)
    proposal_id = parseInt(proposal_id)

    const checkValidation = await db.credit_limit_approval_workflow.findOne({
      where: {
        proposal_id,
        version_id,
        final_credit_status: {
          [Op.in]: ['APPROVED', 'REJECTED']
        }
      },
      transaction
    });

    if (checkValidation) {
      return res.status(400).send({ code: 400, message: `Sales Order already processed!` });
    }

    if (booking_status === 'REJECTED') {
      await db.salesBooking.update({ booking_status: booking_status }, { where: { proposal_id: proposal_id, version_id: version_id }, transaction });
      await db.proposal_performa_invoice.update({
        back_office_rejected: true,
        sales_reason_id: sales_reason_id,
        reason_remarks: reason_remarks,
        reason_rejectedBy: login_id,
        so_status: so_status
      }, { where: { id: pi_id }, transaction });

      await db.credit_limit_approval_workflow.create({
        sales_booking_id: sales_booking_id,
        credit_approval_status: 'Rejected',
        final_credit_status: 'REJECTED',
        proposal_id: proposal_id,
        version_id: version_id,
        approval_type: "with_approval",
        // sanction_credit_id: sanctionCreditLimit.id,
        created_by: req.user.employee_id,
        remarks: credit_remark
      },{transaction});

      await transaction.commit();
      return res.status(200).send({ code: 200, message: 'Order rejected successfully.' });
    }

    await db.versionData.update({ is_so_created: true }, { where: { id: version_id }, transaction })
    await db.salesBooking.update({ booking_status: booking_status }, { where: { proposal_id: proposal_id, version_id: version_id }, transaction });
    await db.proposal_performa_invoice.update({ so_status: so_status }, { where: { id: pi_id }, transaction })

    await db.credit_limit_approval_workflow.create({
      sales_booking_id: sales_booking_id,
      credit_approval_status: 'Approved',
      final_credit_status: 'APPROVED',
      proposal_id: proposal_id,
      version_id: version_id,
      approval_type: "with_approval",
      // sanction_credit_id: sanctionCreditLimit.id,
      created_by: req.user.employee_id,
      remarks: credit_remark
    },{ transaction });

    // Installation Kit BOM Sales CRM for sales order
    //await insertBom(proposal_id, version_id, transaction); // I'll handle the BOM-related case later.

    await transaction.commit();
    return res.status(200).send({ code: 200, message: 'Order approved successfully.' });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('generate_performa_invoice error:', error.message);
    return res.status(500).send({ code: 500, message: 'Internal Server Error', error: error.message });
  }
};

// Installation Kit BOM Sales CRM for sales order
async function insertBom(proposal_id, version_id, transaction){
  const getAllItemIds = await db.proposalList.findAll({
    where: { proposal_id, version_id },
    attributes: ["id"],
    transaction,
  });

  const itemIds = getAllItemIds.map(item => item.id);

  const getAllBomIds = await db.SALESCRM_BOM_KIT.findAll({
    where: {
      item_list_id: {
        [Op.in]: itemIds,
      },
    },
    attributes: ["id", "bom_qty"],
    transaction,
  });

  if (getAllBomIds.length) {
    // Fetch all BOM Items in one query
    const bomIds = getAllBomIds.map(b => b.id);

    const allBomItems = await db.SALESCRM_BOM_KIT_ITEM.findAll({
      where: {
        sc_bom_id: {
          [Op.in]: bomIds,
        },
      },
      attributes: [
        "id",
        "sc_bom_id",
        "qty_per_bom",
        "bom_item_id",
        "bom_subitem_id",
      ],
      transaction,
    });

    // Group items by BOM
    const bomItemMap = {};

    for (const item of allBomItems) {
      if (!bomItemMap[item.sc_bom_id]) {
        bomItemMap[item.sc_bom_id] = [];
      }

      bomItemMap[item.sc_bom_id].push(item);
    }

    // Collect BOM Item & Substitute IDs
    let bomItemIds = [];
    let bomSubItemIds = [];

    for (const item of allBomItems) {
      if (item.bom_item_id) {
        bomItemIds.push(item.bom_item_id);
      }

      if (item.bom_subitem_id) {
        bomSubItemIds.push(item.bom_subitem_id);
      }
    }

    // Remove duplicates here
    bomItemIds = [...new Set(bomItemIds)];
    bomSubItemIds = [...new Set(bomSubItemIds)];

    // Fetch all Item IDs in one query
    const bomKitItems = await db.BOM_KIT_ITEM.findAll({
      where: {
        id: {
          [Op.in]: bomItemIds,
        },
      },
      attributes: ["id", "item_id"],
      transaction,
    });

    // Fetch all Substitute Item IDs in one query
    const bomSubstituteItems = await db.BOM_KIT_SUBSTITUTE_ITEM.findAll({
      where: {
        id: {
          [Op.in]: bomSubItemIds,
        },
      },
      attributes: ["id", "substitute_item_id"],
      transaction,
    });

    // Create lookup maps
    const bomKitItemMap = {};
    for (const item of bomKitItems) {
      bomKitItemMap[item.id] = item.item_id;
    }

    const bomSubstituteItemMap = {};
    for (const item of bomSubstituteItems) {
      bomSubstituteItemMap[item.id] = item.substitute_item_id;
    }

    // Process every BOM
    for (const bom of getAllBomIds) {

      const instanceRows = [];

      for (let i = 1; i <= bom.bom_qty; i++) {
        instanceRows.push({
          bom_kit_id: bom.id,
          instance_no: i,
        });
      }

      // Bulk create instances
      const instances = await db.SALESCRM_BOM_KIT_INSTANCE.bulkCreate(
        instanceRows,
        {
          returning: true,
          transaction,
        }
      );

      const instanceItemRows = [];

      const bomItems = bomItemMap[bom.id] || [];

      for (const instance of instances) {

        for (const bomItem of bomItems) {
          const itemId = bomItem.bom_subitem_id
          ? bomSubstituteItemMap[bomItem.bom_subitem_id]
          : bomKitItemMap[bomItem.bom_item_id];

          if (!itemId) {
            throw new Error(
              `Master Item not found for BOM Item ID: ${bomItem.bom_item_id}, Substitute ID: ${bomItem.bom_subitem_id}`
            );
          }

          instanceItemRows.push({
            required_qty: bomItem.qty_per_bom,
            pending_qty: bomItem.qty_per_bom,
            instance_id: instance.id,
            bom_item_id: bomItem.id,
            item_id: itemId,
          });

        }
      }

      if (instanceItemRows.length) {
        await db.SALESCRM_BOM_KIT_INSTANCE_ITEM.bulkCreate(
          instanceItemRows,
          {
            transaction,
          }
        );
      }
    }
  }
}

module.exports.proposalVersionMailData = async (req, res) => {
  try {
    const { id, proposal_id, proposalApprovelId, action_type } = req.query;
    let condition = ``;
    if (proposalApprovelId !== "") {
      condition = `AND PA.id=${proposalApprovelId}`;
    }

    const proposalData = await db.sequelize.query(
      `SELECT CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
      CPM.company_name,  CACM.contact_person_name AS contact_name,PT.perposal_type,
            CAM.billing_address AS address, CAM.billing_pin_code AS pincode, CAM.billing_country_id AS country_id,
            CAM.billing_state_id AS state_id, CAM.billing_city_id AS city_id
            FROM CRM_VERSION_PROPOSAL_MST AS CV
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = CV.proposal_id
            INNER JOIN CUSTOMER_PROFILE_MST AS CPM ON CP.parent_customer_id = CPM.id
            INNER JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.customer_id = CP.customer_id
            LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST CACM on CACM.customer_id = CPM.id
            LEFT JOIN CRM_CREATE_LEAD_MST AS C ON C.id = CP.create_lead_id
            LEFT JOIN MASTER_SOURCE AS MS ON C.source_id = MS.id
            LEFT JOIN PROPOSAL_APPROVAL AS PA ON CP.id = PA.proposal_id
            LEFT JOIN MASTER_PERPOSAL_TYPE AS PT ON CP.proposal_type_id = PT.id
            LEFT JOIN PROPOSAL_PERFORMA_INVOICE AS PPI ON PPI.proposal_id = ${proposal_id} AND PPI.version_id = ${id}
            WHERE CV.id = ${id} ${condition}`
    );

    const dataList = await db.sequelize.query(
      `SELECT CP.id AS product_id, CP.qty, CP.cgst, CP.approvel_status, CP.igst, CP.sgst, CP.proposal_id, CP.gst_type, 
            CP.discount_request, CP.discount_approved, P.id AS product_master_id, P.item_name AS product_name, P.item_code AS product_code, 
            P.description AS product_description, CP.new_item, CP.promo_item, CP.apply_scheme, CP.scheme_id, MS.scheme_name, CP.price_per_unit, 
            CP.maximum_discount, CP.product_category_id, U.uom_name, U.uom_id, CP.pro_sub_cat_id, CP.select_scheme, 
            PCT.id AS proposal_customisation_id, PCD.id AS customisation_data_id, PCD.customization_type,
            PCT.qty AS order_qty, PCT.total_in_gst, PCT.grand_in_total,  PCD.gst, PCD.total_price, PCD.price_per_unit AS unit_price,
            PCT.grand_out_total, PCT.substract_total, PCT.add_total, PCT.proposal_no, PCT.remarks, PCT.status, 
            PCT.createdAt, PCT.updatedAt, PCT.proposal_item_id, PCT.version_id, P.hsn_code_id, HSN.hsn_sac_code, P.uom_id, UM.uom_name,
            CRB.id AS branding_id, CRB.qty AS branding_qty, CRB.branding_description, CRB.branding_sides, CRB.branding_amt,
            CRB.proposal_no AS branding_proposal_no, CRB.status AS branding_status, CRB.createdAt AS branding_createdAt, 
            CRB.branding_mst_id AS brandingTypes, MBR.hsn_code_id, MBR.type_of_branding, MBR.price_per_unit, BHSN.hsn_sac_code, MGRN.value,
            CRB.updatedAt AS branding_updatedAt, CRB.proposal_item_id AS branding_proposal_item_id, CRB.version_id AS branding_version_id
            FROM CRM_CREATE_PROPOSAL_MST AS C
            LEFT JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = C.create_lead_id
            INNER JOIN CRM_PROPOSAL_LIST_MST AS CP ON CP.proposal_id = C.id
            LEFT JOIN MASTER_ITEM AS P ON CP.product_master_id = P.id 
            LEFT JOIN MASTER_UOM AS U ON U.uom_id = CP.uom_id
            LEFT JOIN MASTER_UOM AS UM ON UM.uom_id = P.uom_id
            LEFT JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = CP.version_id
            LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_TYPE AS PCT ON PCT.proposal_item_id = CP.id
            LEFT JOIN CRM_PROPOSAL_CUSTOMISATION_DATA AS PCD ON PCD.proposal_customisation_id = PCT.id
            LEFT JOIN CRM_PROPOSAL_BRANDING AS CRB ON CRB.proposal_item_id = CP.id
            LEFT JOIN MASTER_BRANDING AS MBR ON MBR.id = CRB.branding_mst_id
            LEFT JOIN MASTER_HSN_SAC_CODE AS BHSN ON BHSN.id = MBR.hsn_code_id
            LEFT JOIN GST_RATE_MASTER AS MGRN ON MGRN.id = BHSN.gst_rate_id 
            LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = P.hsn_code_id
             LEFT JOIN MASTER_SCHEME AS MS ON MS.id = CP.scheme_id
            WHERE CV.id = ${id} AND CV.proposal_id = ${proposal_id} AND CP.isDeleted = 0`
    );

    const charges = await db.proposalAddtionalCharges.findAll({
      where: { proposal_id: proposal_id, version_id: id },
    });

    const productMap = new Map();

    for (const row of dataList[0]) {
      const productId = row.product_id;

      if (!productMap.has(productId)) {
        const baseProduct = {
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
          product_master_id: row.product_master_id,
          product_name: row.product_name,
          product_code: row.product_code,
          product_description: row.product_description,
          new_item: row.new_item,
          promo_item: row.promo_item,
          apply_scheme: row.apply_scheme,
          scheme_id: row.scheme_id,
          scheme_name: row.scheme_name,
          price_per_unit: row.price_per_unit,
          maximum_discount: row.maximum_discount,
          product_category_id: row.product_category_id,
          uom_name: row.uom_name,
          uom_id: row.uom_id,
          paymentTC: row.paymentTC,
          pro_sub_cat_id: row.pro_sub_cat_id,
          select_scheme: row.select_scheme,
          customisation_data: [],
          customization: null,
          branding_data: null
        };
        productMap.set(productId, baseProduct);
      }

      // Add only relevant customisation_data fields
      if (row.customisation_data_id) {
        const customisationEntry = {
          id: row.customisation_data_id,
          proposal_customisation_id: row.proposal_customisation_id,
          ...row,
        };
        productMap.get(productId).customisation_data.push(customisationEntry);
      }

      // Add separate customisation object
      if (row.proposal_customisation_id) {
        productMap.get(productId).customization = {
          id: row.proposal_customisation_id,
          qty: row.qty,
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
        };
      }


      console.log('-------------    qty: row.branding_qty,------------', row.branding_qty)
      // Add branding_data separately
      if (row.branding_id && row.branding_proposal_item_id) {
        productMap.get(productId).branding_data = {
          id: row.branding_id,
          qty: row.branding_qty,
          branding_description: row.branding_description,
          branding_amt: row.branding.branding_amt,
          branding_sides: row.branding_sides,
          proposal_no: row.branding_proposal_no,
          status: row.branding_status,
          createdAt: row.branding_createdAt,
          updatedAt: row.branding_updatedAt,
          proposal_item_id: row.branding_proposal_item_id,
          version_id: row.branding_version_id,
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

    const Obj = {
      ...proposalData[0][0],
      charges: charges,
      productDetailList: productDetailList,
      scheme_id: scheme_id,
    };

    if (proposalApprovelId !== "") {
      const approvalData = await db.proposalApprovel.findOne({
        where: { id: proposalApprovelId },
      });

      const remainingLevel = await db.proposalApprovel.findAll({
        where: { proposal_id: proposal_id, approvel_status: "PENDING" },
      });

      const discount = await db.Work_Flow_range.findOne({
        where: {
          workflow_id: approvalData.workflow_id,
          employee_id: approvalData.employee_id,
          status: "ACTIVE",
        },
      });

      for (const item of Obj.productDetailList) {
        let getItems = await db.workFlowItems.findAll({
          where: { workflow_range_id: discount.id },
        });

        item.isClicked = false;

        for (const elem of getItems) {
          if (
            item.product_category_id === elem.product_category_id &&
            item.pro_sub_cat_id === elem.product_sub_category_id
          ) {
            if (elem.discount_percent >= item.discount_request) {
              item.discountStatus =
                item.approvel_status === "APPROVED"
                  ? "AlreadyApproved"
                  : "Approved";
            } else if (remainingLevel.length > 1) {
              item.discountStatus = "Forward";
            } else {
              item.discountStatus = "Rejected";
              Obj.finalStatus = "Rejected";
            }
          }
        }
      }
    }

    if (Obj) {
      return res.status(200).send({ code: 200, message: "success", data: Obj });
    } else {
      return res.status(404).send({ code: 404, message: "Data not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.updateFollowupDate = async (req, res) => {
  try {
    let { follow_up_date, id } = req.body
    console.log(follow_up_date, id);

    if (!follow_up_date) {

      return res.status(400).send({ code: 200, message: "Follow up date is required" });
    }
    let isUpdated = await db.versionData.update({ follow_up_date: follow_up_date }, { where: { id: id } });
    if (isUpdated) {

      return res.status(200).send({ code: 200, message: "Follow up date updated successfully" });
    } else {
      return res.status(400).send({ code: 400, message: "Failed " });

    }


  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });

  }
}

// Create Lead Source
module.exports.createLeadSource = async (req, res) => {
  try {
    const { lead_source, status, financial_year_id, entity_id } = req.body;

    if (!lead_source || !financial_year_id || !entity_id) {
      return res.status(400).send({ code: 400, message: "Lead Source, Financial Year, and Entity are required" });
    }

    const leadSource = await db.leadSource.create({
      lead_source,
      status,
      financial_year_id,
      entity_id,
    });

    return res.status(201).send({
      code: 201,
      message: "Lead source created successfully",
      data: leadSource,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get All Lead Sources by Financial Year & Entity
module.exports.getAllLeadSource = async (req, res) => {
  try {
    const { financial_year_id, entity_id } = req.query;

    const getLeadData = await db.leadSource.findAll({
      // where: { financial_year_id, entity_id },
  
    });

    if (getLeadData.length) {
      return res.status(200).send({ code: 200, message: "Lead source lists", data: getLeadData });
    } else {
      return res.status(404).send({ code: 404, message: "Lead sources not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get Single Lead Source
module.exports.getLeadSourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const leadSource = await db.leadSource.findByPk(id);

    if (!leadSource) {
      return res.status(404).send({ code: 404, message: "Lead source not found" });
    }

    return res.status(200).send({ code: 200, message: "Lead source details", data: leadSource });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Update Lead Source
module.exports.updateLeadSource = async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_source, status, financial_year_id, entity_id } = req.body;

    const leadSource = await db.leadSource.findByPk(id);
    if (!leadSource) {
      return res.status(404).send({ code: 404, message: "Lead source not found" });
    }

    await leadSource.update({
      lead_source,
      status,
      financial_year_id,
      entity_id,
    });

    return res.status(200).send({
      code: 200,
      message: "Lead source updated successfully",
      data: leadSource,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Delete Lead Source
module.exports.deleteLeadSource = async (req, res) => {
  try {
    const { id } = req.params;

    const leadSource = await db.leadSource.findByPk(id);
    if (!leadSource) {
      return res.status(404).send({ code: 404, message: "Lead source not found" });
    }

    await leadSource.destroy();

    return res.status(200).send({ code: 200, message: "Lead source deleted successfully" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getSalesCustomers = async (req, res) => {
  try {
    let { financial_year_id, entity_id } = req.query;
    let role = await db.role_master.findOne({ where: { role_master_name: 'Sales' } });
    if (!role) {
      return res.status(400).send({ code: 400, message: "Sale role not found " });
    }
    console.log(role)

    let users = await db.user.findAll({ where: { role_master_id: role.role_master_id } });
    if (!users.length) {
      return res.status(400).send({ code: 400, message: "Employee not found!" });
    }
    return res.status(200).send({ code: 200, message: "Lead source lists", data: users });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}

module.exports.getsCustomerByDealer = async (req, res) => {
  try {
    let dealer_id = req.params.dealer_id;
    let customers = await db.customerProfile.findAll({ where: { dealer_id, is_Deleted: 0 } });
    if (!customers) {
      return res.status(400).send({ code: 400, message: "Customers not found " });
    }
    return res.status(200).send({ code: 200, message: "Customers lists", data: customers });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}

// Create Delivery Term & Unloading
module.exports.createDeliveryTermUnloading = async (req, res) => {
  try {
    const { type, delivery_term, unloading } = req.body;

    if (!type) {
      return res.status(400).send({ code: 400, message: "Type is required" });
    }

    const deliveryTermUnloading = await db.deliveryTermAndUnloading.create({
      type, delivery_term, unloading
    });

    return res.status(201).send({
      code: 201,
      message: "Delivery term and unloading created successfully",
      data: deliveryTermUnloading,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get All
module.exports.deliveryTermUnloadings = async (req, res) => {
  try {
    const deliveryTermUnloading = await db.deliveryTermAndUnloading.findAll();

    if (!deliveryTermUnloading || !deliveryTermUnloading.length) {
      return res.status(404).send({
        code: 404,
        message: "Delivery term and unloading not found",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Delivery term and unloading lists",
      data: deliveryTermUnloading,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get Single by ID
module.exports.getDeliveryTermUnloadingById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.deliveryTermAndUnloading.findByPk(id);

    if (!item) {
      return res.status(404).send({ code: 404, message: "Delivery term and unloading not found" });
    }

    return res.status(200).send({ code: 200, message: "Delivery term and unloading details", data: item });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Update
module.exports.updateDeliveryTermUnloading = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, delivery_term, unloading } = req.body;

    const item = await db.deliveryTermAndUnloading.findByPk(id);
    if (!item) {
      return res.status(404).send({ code: 404, message: "Delivery term and unloading not found" });
    }

    await item.update({ type, delivery_term, unloading });

    return res.status(200).send({
      code: 200,
      message: "Delivery term and unloading updated successfully",
      data: item,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Delete
module.exports.deleteDeliveryTermUnloading = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.deliveryTermAndUnloading.findByPk(id);

    if (!item) {
      return res.status(404).send({ code: 404, message: "Delivery term and unloading not found" });
    }

    await item.destroy();

    return res.status(200).send({
      code: 200,
      message: "Delivery term and unloading deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Create Payment Main Category
module.exports.createPaymentMainCategory = async (req, res) => {
  try {
    const { payment_name, status } = req.body;

    if (!payment_name) {
      return res.status(400).send({ code: 400, message: "Name is required" });
    }

    const paymentMainCategory = await db.paymentMainCategory.create({ payment_name, status });

    return res.status(201).send({
      code: 201,
      message: "Payment main category created successfully",
      data: paymentMainCategory,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get All Payment Main Categories
module.exports.paymentMainList = async (req, res) => {
  try {
    const paymentMainCategory = await db.paymentMainCategory.findAll();

    if (!paymentMainCategory || !paymentMainCategory.length) {
      return res.status(404).send({ code: 404, message: "Payment main categories not found" });
    }

    return res.status(200).send({
      code: 200,
      message: "Payment main category lists",
      data: paymentMainCategory,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get Single Payment Main Category by ID
module.exports.getPaymentMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.paymentMainCategory.findByPk(id);

    if (!category) {
      return res.status(404).send({ code: 404, message: "Payment main category not found" });
    }

    return res.status(200).send({ code: 200, message: "Payment main category details", data: category });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Update Payment Main Category
module.exports.updatePaymentMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_name, status } = req.body;

    const category = await db.paymentMainCategory.findByPk(id);
    if (!category) {
      return res.status(404).send({ code: 404, message: "Payment main category not found" });
    }

    await category.update({ payment_name, status });

    return res.status(200).send({
      code: 200,
      message: "Payment main category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Delete Payment Main Category
module.exports.deletePaymentMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.paymentMainCategory.findByPk(id);

    if (!category) {
      return res.status(404).send({ code: 404, message: "Payment main category not found" });
    }

    await category.destroy();

    return res.status(200).send({ code: 200, message: "Payment main category deleted successfully" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Create Sub Category
module.exports.createSubPaymentMain = async (req, res) => {
  try {
    const { payment_main_id, sub_payment_name, status } = req.body;

    if (!payment_main_id || !sub_payment_name) {
      return res.status(400).send({ code: 400, message: "Payment Main ID and Name are required" });
    }

    // check if parent exists
    const mainCategory = await db.paymentMainCategory.findByPk(payment_main_id);
    if (!mainCategory) {
      return res.status(404).send({ code: 404, message: "Parent Payment Main Category not found" });
    }

    const subCategory = await db.paymentMainSubCategory.create({
      payment_main_id,
      sub_payment_name,
      status,
    });

    return res.status(201).send({
      code: 201,
      message: "Payment main sub category created successfully",
      data: subCategory,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get All Sub Categories by Parent
module.exports.getAllSubPaymentMainList = async (req, res) => {
  try {

    const paymentMainSubCategory = await db.paymentMainSubCategory.findAll({
      include: [
        {
          model: db.paymentMainCategory,
          as: 'paymentMainData',
          attributes: ['payment_name']
        }
      ]
    });

    if (!paymentMainSubCategory || !paymentMainSubCategory.length) {
      return res.status(404).send({
        code: 404,
        message: "Payment main sub categories not found",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Payment main sub category lists",
      data: paymentMainSubCategory,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get All Sub Categories by Parent
module.exports.subPaymentMainList = async (req, res) => {
  try {
    const { payment_main_id } = req.params;

    const paymentMainSubCategory = await db.paymentMainSubCategory.findAll({
      where: { payment_main_id },
    });

    if (!paymentMainSubCategory || !paymentMainSubCategory.length) {
      return res.status(404).send({
        code: 404,
        message: "Payment main sub categories not found",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Payment main sub category lists",
      data: paymentMainSubCategory,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get Single Sub Category
module.exports.getSubPaymentMainById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await db.paymentMainSubCategory.findByPk(id);

    if (!subCategory) {
      return res.status(404).send({ code: 404, message: "Payment main sub category not found" });
    }

    return res.status(200).send({ code: 200, message: "Payment main sub category details", data: subCategory });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Update Sub Category
module.exports.updateSubPaymentMain = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_main_id, sub_payment_name, status } = req.body;

    const subCategory = await db.paymentMainSubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).send({ code: 404, message: "Payment main sub category not found" });
    }

    if (payment_main_id) {
      const mainCategory = await db.paymentMainCategory.findByPk(payment_main_id);
      if (!mainCategory) {
        return res.status(404).send({ code: 404, message: "Parent Payment Main Category not found" });
      }
    }

    await subCategory.update({ payment_main_id, sub_payment_name, status });

    return res.status(200).send({
      code: 200,
      message: "Payment main sub category updated successfully",
      data: subCategory,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Delete Sub Category
module.exports.deleteSubPaymentMain = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await db.paymentMainSubCategory.findByPk(id);

    if (!subCategory) {
      return res.status(404).send({ code: 404, message: "Payment main sub category not found" });
    }

    await subCategory.destroy();

    return res.status(200).send({ code: 200, message: "Payment main sub category deleted successfully" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Create Insurance
module.exports.createInsurance = async (req, res) => {
  try {
    const { insurance_name, status } = req.body;

    if (!insurance_name) {
      return res.status(400).send({ code: 400, message: "Name are required" });
    }

    const insurance = await db.crm_insurance.create({
      insurance_name,
      status,
    });

    return res.status(201).send({ code: 201, message: "Insurance created successfully", data: insurance });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get All Insurances
module.exports.insuranceList = async (req, res) => {
  try {
    const insuranceList = await db.crm_insurance.findAll();

    if (!insuranceList || !insuranceList.length) {
      return res.status(404).send({ code: 404, message: "Insurance list not found" });
    }

    return res.status(200).send({ code: 200, message: "Insurance lists", data: insuranceList });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get Insurance by ID
module.exports.getInsuranceById = async (req, res) => {
  try {
    const { id } = req.params;
    const insurance = await db.crm_insurance.findByPk(id);

    if (!insurance) {
      return res.status(404).send({ code: 404, message: "Insurance not found" });
    }

    return res.status(200).send({ code: 200, message: "Insurance details", data: insurance });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Update Insurance
module.exports.updateInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const { insurance_name, status } = req.body;

    const insurance = await db.crm_insurance.findByPk(id);
    if (!insurance) {
      return res.status(404).send({ code: 404, message: "Insurance not found" });
    }

    await insurance.update({ insurance_name, status });

    return res.status(200).send({ code: 200, message: "Insurance updated successfully", data: insurance });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Delete Insurance
module.exports.deleteInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const insurance = await db.crm_insurance.findByPk(id);

    if (!insurance) {
      return res.status(404).send({ code: 404, message: "Insurance not found" });
    }

    await insurance.destroy();

    return res.status(200).send({ code: 200, message: "Insurance deleted successfully" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Create Freight
module.exports.createFreight = async (req, res) => {
  try {
    const { freight_name, status } = req.body;

    if (!freight_name) {
      return res.status(400).send({ code: 400, message: "Name are required" });
    }

    const freight = await db.crm_freight.create({ freight_name, status });

    return res.status(201).send({ code: 201, message: "Freight created successfully", data: freight });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get All Freights
module.exports.freightList = async (req, res) => {
  try {
    const freightList = await db.crm_freight.findAll();

    if (!freightList || !freightList.length) {
      return res.status(404).send({ code: 404, message: "Freight list not found" });
    }

    return res.status(200).send({ code: 200, message: "Freight lists", data: freightList });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Get Single Freight by ID
module.exports.getFreightById = async (req, res) => {
  try {
    const { id } = req.params;
    const freight = await db.crm_freight.findByPk(id);

    if (!freight) {
      return res.status(404).send({ code: 404, message: "Freight not found" });
    }
    return res.status(200).send({ code: 200, message: "Freight details", data: freight });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Update Freight
module.exports.updateFreight = async (req, res) => {
  try {
    const { id } = req.params;
    const { freight_name, status } = req.body;

    const freight = await db.crm_freight.findByPk(id);
    if (!freight) {
      return res.status(404).send({ code: 404, message: "Freight not found" });
    }

    await freight.update({ freight_name, status });

    return res.status(200).send({ code: 200, message: "Freight updated successfully", data: freight });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// Delete Freight
module.exports.deleteFreight = async (req, res) => {
  try {
    const { id } = req.params;
    const freight = await db.crm_freight.findByPk(id);

    if (!freight) {
      return res.status(404).send({ code: 404, message: "Freight not found" });
    }

    await freight.destroy();

    return res.status(200).send({ code: 200, message: "Freight deleted successfully" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// here code for mail options 
module.exports.pdfQuotationVersionMail = async (req, res) => {
  try {

    let { to_email, cc_email, bcc_email, subject, message, attach_file } = req.body;
    const { proposal_id, version_id } = req.body;
    console.log('hey=======>', JSON.parse(to_email))
    if (to_email) {
      to_email = JSON.parse(to_email);
      console.log('hey=======>', to_email)
    }
    if (cc_email) {
      cc_email = JSON.parse(cc_email);
      console.log('hey=======>', cc_email)
    }
    if (bcc_email) {
      bcc_email = JSON.parse(bcc_email);
      console.log('hey=======>', bcc_email)

    }

    let mailObject = { to_email, cc_email, bcc_email, subject, message };
    let data = await getProposalPreviewData(version_id, proposal_id);
    const proposalData = await db.sequelize.query(
      `SELECT
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
            W.pin AS warehouse_pin,
            W.address AS warehouse_address,
            W.gst AS warehouse_gst,
           -- W.email AS warehouse_email,
          --  W.contact_number AS warehouse_contact_no,
            CP.valid_till_date,
            F.freight_name,I.insurance_name,
            PM.payment_name, SP.sub_payment_name,
           CONCAT(B.location_name, ' - ', B.location_code) AS branch_name, W.name AS warehouse_name,DT.delivery_term, UL.unloading, 
            CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
            CPM2.company_name, sb.schedule_delivery_date,
           CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT.countryss_name AS billing_country_name,
            STA.states_name AS billing_state_name, CIT.city_name AS billing_city_name, 
           
            CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT2.countryss_name AS shipping_country_name,
            STA2.states_name AS shipping_state_name, CPM3.company_name AS shipping_customer_name,  CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code, cplm.*
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
            WHERE CV.id = ${version_id} `
    );
    const page_mode = 'quotation';
    const uploadedFiles = req.files || req.file;
    let result = await generateInvoicePdf(data, proposalData[0][0], proposal_id, version_id, page_mode); // yha aap proposalData bhi bhej skte ho
    await sendQuotationVersionMail(data.entity_id, proposalData[0][0].company_name, data.created_by_email, data.proposal_no, result, page_mode, mailObject, uploadedFiles);  //data.mail_id,



    return res.status(200).send({ code: 200, message: 'Email sent successfully' })

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}

const envGEMINI_API_KEY = 'AIzaSyB8ZlhkRTC93lz8CdLu_jy0utjJRz6rRbE';
const GEMINI_API_KEY = envGEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
module.exports.googleGeminiAi = async (req, res) => {
  try {
    const inputText = req.body.text || req.body.content; // formData or JSON
    if (!inputText) {
      return res.status(400).send({ code: 400, message: "Text input is required" });
    }

    // Prompt Gemini to ONLY return the corrected version (no extra text)
    const prompt = `
     You are a grammar correction assistant.
      Correct the grammar and spelling of the following HTML content,
      but preserve its HTML structure, tags, and formatting exactly as given.
      Return only valid HTML as output (no explanations, no markdown, no code blocks)..
      
      HTML Content:
       """${inputText}"""
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });


    let correctedHtml = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    correctedHtml = correctedHtml
      .replace(/^```html\s*/i, "") // remove starting ```html
      .replace(/^```/i, "")        // remove starting ```
      .replace(/```$/i, "")        // remove ending ```
      .trim();
    console.log("Corrected:", correctedHtml);

    return res.status(200).send({
      code: 200,
      message: "Text improved successfully",
      data: correctedHtml,
    });

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}

exports.download_qoutationProforma_pdf = async (req, res) => {
  try {
    let { proposal_id, version_id, page_mode } = req.query;

    let data = await getProposalPreviewData(version_id, proposal_id);

    if (!data) {
      return res
        .status(404)
        .send({ message: "Proposal Preview Data not found." });
    }

    const proposalData = await db.sequelize.query(
      `SELECT
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
                W.pin AS warehouse_pin,
                W.address AS warehouse_address,
                W.gst AS warehouse_gst,
                -- W.email AS warehouse_email,
               -- W.contact_number AS warehouse_contact_no,
                CP.valid_till_date,
                F.freight_name,I.insurance_name,
                PM.payment_name, SP.sub_payment_name,
               CONCAT(B.location_name, ' - ', B.location_code) AS branch_name, W.name AS warehouse_name,DT.delivery_term, UL.unloading, 
                CP.*, MS.source_name, PA.id AS proposal_approval_id, PA.employee_id, PA.workflow_id,PPI.paymentTC,PPI.expiry_date,PPI.email_status,
                CPM2.company_name, sb.schedule_delivery_date,
               CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CAM.gst_in AS billing_gst, CUT.countryss_name AS billing_country_name,
                STA.states_name AS billing_state_name, CIT.city_name AS billing_city_name, 
               
                CAM.billing_address AS billing_address, CAM.billing_pin_code AS billing_pincode, CUT2.countryss_name AS shipping_country_name,
                STA2.states_name AS shipping_state_name, CPM3.company_name AS shipping_customer_name,  CIT2.city_name AS shipping_city_name,CSA.shipping_address,CSA.shipping_pin_code,CSA.shipping_gst_in, cplm.*
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
                WHERE CV.id = ${version_id} `
    );
    if (!proposalData) {
      return res.status(404).send({ message: "Proposal Data not found." });
    }

    const versionCurrency = await db.versionData.findOne({
      where:{
        id:version_id
      },include:[{
        model:db.currency_convert
      }]
    })
    let { pdfBuffer } = await generateInvoicePdf(
      data,
      proposalData[0][0],
      proposal_id,
      version_id,
      page_mode,
      versionCurrency
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send({ message: "An error occurred. " + error });
  }
};

module.exports.checkSchemeStatusByClientCategory = async (req, res) => {
  try {
    const clientId = req.query.clientId;
    if (!clientId) {
      return res.status(200).send({ code: 200, message: "Client ID missing", data: "INACTIVE" });
    }

    const [rows] = await db.sequelize.query(
      `SELECT cc.quotation_scheme_status 
       FROM CUSTOMER_PROFILE_MST AS c 
       LEFT JOIN MASTER_CUSTOMER_CATEGORY AS cc 
         ON cc.customer_category_id = c.customer_category_id
       WHERE c.id = :id`,
      { replacements: { id: clientId } }
    );

    let status = (rows && rows.length > 0 && rows[0].quotation_scheme_status)
      ? rows[0].quotation_scheme_status
      : 'INACTIVE';

    return res.status(200).send({ code: 200, message: "success", data: status });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getProposalDocumentsList = async (req, res) => {
  try {
    const { proposalId, versionId } = req.query;

    // const [data] = await db.sequelize.query(
    //   `SELECT d.id,d.documents_name,d.documents 
    //    FROM CRM_PROPOSAL_DOCUMENTS AS d
    //    WHERE d.proposal_id = :proposalId AND d.version_id = :versionId AND d.isDeleted = 0 ORDER BY d.id DESC`,
    //   { replacements: { proposalId, versionId } }
    // );
    const [data] = await db.sequelize.query(
      `SELECT d.id,d.documents_name,d.documents 
       FROM CRM_PROPOSAL_DOCUMENTS AS d
       WHERE d.proposal_id = :proposalId AND d.documents_name IS NOT NULL 
       AND d.documents_name <> '' AND d.isDeleted = 0 ORDER BY d.id DESC`,
      { replacements: { proposalId } }
    );

    return res.status(200).send({ code: 200, message: "success", data: data });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.uploadMultipleDocuments = async (req, res) => {
  try {
    const { proposal_id, version_id } = req.body;
    const files = req.files;

    if (!proposal_id || !version_id) {
      return res.status(400).send({ message: "proposal_id and version_id required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).send({ message: "No files uploaded" });
    }

    const folderName = "quotationdocuments";  // STATIC FOR THIS ROUTE

    // Filter valid files
    const validFiles = files.filter(f => f.originalname && f.originalname.trim() !== "");

    // If no valid files
    if (validFiles.length === 0) {
      return res.status(400).send({
        status: false,
        message: "No valid files to upload!"
      });
    }

    const fileRows = validFiles.map(f => ({
      proposal_id,
      version_id,
      documents_name: f.originalname,
      documents: `uploaded_files/${folderName}/${f.filename}`
    }));

    await db.proposal_documents.bulkCreate(fileRows);

    return res.status(200).send({
      message: "Files uploaded successfully",
      files: fileRows
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).send({ message: "Server Error" });
  }
};

module.exports.deleteProposalDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.proposal_documents.findByPk(id);

    if (!data) {
      return res.status(404).send({ code: 404, message: "Document not found" });
    }

    await data.update({
      isDeleted: 1
    });

    // ---------------------------------------------------
    // DELETE FILE FROM FOLDER
    // ---------------------------------------------------

    // const pathToRoot = path.join(__dirname, "../../../.."); // go back to root (elan_backend)
    // const filePath = path.join(pathToRoot, data.documents);

    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath); // delete file
    // }

    // await data.destroy();

    return res.status(200).send({ code: 200, message: "Document deleted successfully" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
module.exports.getsCustomerAddress = async (req, res) => {
  try {
    let customer_id = req.params.customer_id;
    let customersBillingAddress = await db.customerAddress.findAll({ where: { customer_id: customer_id, is_Deleted: 0 } });
    let customersShippingAddress = await db.customerShippingAddress.findAll({ where: { customer_id: customer_id, is_Deleted: 0 } });
    if (!customersBillingAddress && !customersShippingAddress) {
      return res.status(400).send({ code: 400, message: "Customers address not found " });
    }
    return res.status(200).send({ code: 200, message: "Customers address list", data: { billingAddress: customersBillingAddress, shippingAddress: customersShippingAddress } });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}

exports.getInstallationKitBomList = async (req, res) => {
  try {
    const {
        entity_id,
        item_list_id,
        item_id,
        qty,
        proposal_no,
        actionType,
        version_id,
        proposal_id,
        client_id
    } = req.query;

    // #region last use
    let lastUsedMap = {};

    if (client_id) {

      const proposalWhere = {
        customer_id: client_id
      };

      // for ignore Current proposal
      if (proposal_id) {
        proposalWhere.id = {
          [Op.ne]: proposal_id
        };
      }

      // if (version_id) {
      //   proposalWhere.version_id = {
      //     [Op.ne]: version_id
      //   };
      // }

      const proposals = await db.proposalData.findAll({
        where: proposalWhere,
        attributes: [
          "id",
          "proposal_no",
          "createdAt"
        ],
        order: [["createdAt", "DESC"]]
      });

      const proposalIds = proposals.map(x => x.id);

      if (proposalIds.length) {

        const proposalLists = await db.proposalList.findAll({
          where: {
            proposal_id: proposalIds
          },
          attributes: [
            "id",
            "proposal_id"
          ]
        });

        const itemListMap = {};
        const proposalMap = {};

        proposalLists.forEach(x => {
          itemListMap[x.id] = x.proposal_id;
        });

        proposals.forEach(x => {
          proposalMap[x.id] = {
            proposal_no: x.proposal_no,
            created_at: x.createdAt
          };
        });

        const itemListIds = proposalLists.map(x => x.id);

        if (itemListIds.length) {

          const bomData = await db.SALESCRM_BOM_KIT.findAll({
            where: {
              item_list_id: itemListIds
            },
            attributes: [
              "bom_id",
              "item_list_id"
            ]
          });

          bomData.forEach(x => {
            if (!lastUsedMap[x.bom_id]) {
              const proposalId = itemListMap[x.item_list_id];
              lastUsedMap[x.bom_id] = {
                last_used: true,
                proposal_no: proposalMap[proposalId]?.proposal_no || null,
                created_at: proposalMap[proposalId]?.created_at || null
              };
            }
          });
        }
      }
    }
    // #endregion last use

    const savedBomIds = await db.SALESCRM_BOM_KIT.findAll({
      where: { item_list_id },
      attributes: ["bom_id"]
    });

    const selectedBomIds = savedBomIds.map(x => x.bom_id);

    const data = await db.BOM_KIT_MASTER.findAll({
      // where: {
      //   status: "Approved", isDeleted: false
      // },
      where: {
          [Op.or]: [
              {
                  status: "Approved",
                  isDeleted: false
              },
              {
                  id: {
                      [Op.in]: selectedBomIds
                  }
              }
          ]
      },
      attributes: [
        "id",
        "version_no",
        "bom_name",
        "bom_price",
        "gst"
      ],
      include: [
        {
          model: db.BOM_KIT_GROUP,
          as: "bomGroup",
          required: true,
          where: {
            entity_id: entity_id
          },
          attributes: ["bom_code"]
        },
        {
          model: db.BOM_KIT_ITEM,
          as: "bomItems",
          attributes: ["id", "quantity"],
          include: [
            {
              model: db.ItemMaster,
              as: "itemMaster",
              attributes: ["item_name", "item_code"]
            },
            {
              model: db.BOM_KIT_SUBSTITUTE_ITEM,
              as: "substituteItems",
              attributes: ["id"],
              required: false,
              include: [
                {
                  model: db.ItemMaster,
                  as: "itemSubstitute",
                  attributes: ["item_name", "item_code"]
                }
              ]
            }
          ]
        },
        {
          model: db.hsn_sac_master,
          as: "hsnCode",
          attributes: ["hsn_sac_code"]
        },
        // Proposal Saved Data
        {
          model: db.SALESCRM_BOM_KIT,
          as: "salesBom",
          required: false,
          where: {
            item_list_id
          },
          attributes: [
            "id",
            "bom_id"
          ],
          include: [
            {
              model: db.SALESCRM_BOM_KIT_ITEM,
              as: "items",
              attributes: [
                "bom_item_id",
                "bom_subitem_id"
              ]
            }
          ]
        }
      ],
      order: [
        [{ model: db.BOM_KIT_GROUP, as: "bomGroup" }, "bom_code", "DESC"],
        ["version_no", "DESC"]
      ]
    });

    const result = data.map((row) => {
      const salesBom = row.salesBom?.[0];

      return {
        bom_code: row.bomGroup?.bom_code || "",
        id: row.id,
        bom_name: row.bom_name || "",
        bom_price: row.bom_price || 0,
        hsn_code: row?.hsnCode?.hsn_sac_code || "",
        gst: row.gst || 0,
        version_no: row.version_no || 1,
        item_count: row?.bomItems?.length || 0,
        selected: !!salesBom,
        last_used: !!lastUsedMap[row.id],
        last_proposal_no: lastUsedMap[row.id]?.proposal_no || null,
        last_proposal_date: lastUsedMap[row.id]?.created_at || null,
        items: (row.bomItems || []).map((item) => {
          const savedItem = salesBom?.items?.find(
              x => x.bom_item_id == item.id
          );
          return {
            id: item.id,
            item_name: `${item.itemMaster?.item_name || ""} | ${item.itemMaster?.item_code || ""}`,
            quantity: item.quantity,
            selected: !!savedItem,
            substitute_item_id: savedItem?.bom_subitem_id ?? null,
            substitute_bom: (item.substituteItems || []).map((sub) => ({
                id: sub.id,
                item_name: `${sub.itemSubstitute?.item_name || ""} | ${sub.itemSubstitute?.item_code || ""}`
            }))
          };
        })
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: result
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};

module.exports.insertProductData = insertProductData;
module.exports.insertGrossDiscountBreakup = insertGrossDiscountBreakup;
module.exports.insertGrossDiscount = insertGrossDiscount;
module.exports.insertPaymentTerm = insertPaymentTerm;
module.exports.insertInstallationKitBOM = insertInstallationKitBOM;
module.exports.insertCustomizationsAndBranding = insertCustomizationsAndBranding;
module.exports.insertCustomizationsAndBrandingWOD = insertCustomizationsAndBrandingWOD;
module.exports.insertApprovalWorkflow = insertApprovalWorkflow;
module.exports.destroyProposalData = destroyProposalData;