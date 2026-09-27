const logger = require("../../../../logger");
const db = require("../../../models");
const { Op, where } = require("sequelize");
const {
  sendMailRFP,
  sendRFPMail,
  sendRFPMailforService,
  sendRFPMailNegoService,
  sendRFPMailRENegoService,
} = require("../../../Recruitment/utils/mail/mail");
const model = require("../../../master/Currency_Convert/models/model");

exports.get_Approved_Pr = async (req, res) => {
  try {
    const { employee_id, entity_id, financial_year_id } = req.query;

    if (!employee_id || !entity_id || !financial_year_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing required query parameters" });
    }

    const data = await db.purchase_details.findAll({
      where: {
        final_status: "APPROVED",
        entity_id: entity_id,
        financial_year_id: financial_year_id,
        employee_id: employee_id,
        pr_category: { [Op.ne]: "Service" },
      },
      include: [
        { model: db.department, attributes: ["department_name", "dept_id"] },
        {
          model: db.purchase_item,
          where: { status: "ACTIVE" },
          required: true,
          include: [
            {
              model: db.PROCUREMENT_PURCHASE_VENDOR_RFP,
              required: false,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    const filteredPRs = data.filter((pr) => {
      return pr.PROCUREMENT_PURCHASE_REQUEST_ITEMs.some((item) => {
        return (
          !item.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEMs ||
          item.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEMs.length === 0
        );
      });
    });

    if (filteredPRs.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "APPROVED PR's Fetched Successfully",
        data: filteredPRs,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Records Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_All_Vendor_Management = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const getAllData = await db.vendor_basic_details.findAll({
      where: {
        isDeleted: false,
        entity_id: entity_id,
      },
    });

    if (!getAllData || getAllData.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "No data found for approved vendors" });
    }

    return res.status(200).send({
      code: 200,
      message: "Fetch All Vendor Management Data Successfully",
      data: getAllData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error fetching vendor management data:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.generate_RfP_Number = async (req, res) => {
  try {
    let result = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findOne({
      attributes: ["id", "rfp_number"],
      where: {
        rfp_number: {
          [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }],
        },
      },
      order: [["id", "DESC"]],
    });

    let Rfp_id;
    if (result && result.rfp_number) {
      const parts = result.rfp_number.split("-");
      const lastPart = parts[parts.length - 1];
      const lastNumber = parseInt(lastPart);
      Rfp_id = `RFP-${isNaN(lastNumber) ? result.id + 1 : lastNumber + 1}`;
    } else {
      let prResult = await db.purchase_details.findOne({
        order: [["id", "DESC"]],
      });
      Rfp_id = `RFP-${prResult ? prResult.id + 1 : 1}`;
    }

    return res.status(200).send({
      code: 200,
      message: "Unique RFP_Number has been Generated",
      data: Rfp_id,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_ById_PR = async (req, res) => {
  try {
    const { procurementId, pr_category, rfp_number } = req.query;
    let getData = null;

    if (pr_category === "Item") {
      getData = await db.purchase_details.findOne({
        where: { id: procurementId },
        include: [
          {
            model: db.warehouse,
            attributes: ["id", "name", "code", "address", "postal_address"],
          },
          {
            model: db.tbl_branch,
            attributes: ["id", "branch_name", "branch_code", "branch_address"],
          },
          {
            model: db.purchase_imgae,
          },
          {
            model: db.department,
            attributes: ["department_name", "dept_id"],
          },
          {
            model: db.purchase_item,
            where: { status: "ACTIVE" },
            include: [
              {
                model: db.ItemMaster,
                where: { status: "ACTIVE" },
                attributes: ["item_code", "item_name", "MVP"],
                include: [
                  {
                    model: db.imageDocument,
                    attributes: ["image"],
                  },
                  {
                    model: db.asset,
                    where: { status: "ACTIVE" },
                    attributes: ["asset_category_name"],
                  },
                ],
              },
              {
                model: db.purchase_vendor,
                attributes: [
                  "id",
                  "Purchase_req_item_id",
                  "vendor_id",
                  "Purchase_req_id",
                ],
              },
              {
                model: db.PROCUREMENT_PURCHASE_VENDOR_RFP,
                where: rfp_number ? { rfp_number: rfp_number } : undefined,
                required: rfp_number ? true : false,
                attributes: [
                  "expected_delivery_date",
                  "rfp_number",
                  "rfp_status",
                  "rfp_start_date",
                  "rfp_end_date",
                  "rfp_stop_date",
                ],
              },
            ],
          },
        ],
      });
    }

    if (!getData) {
      return res.status(404).send({ code: 404, message: "PR Data not found" });
    }

    if (getData && rfp_number) {
      const isArray = Array.isArray(getData);
      const objectsToUpdate = isArray ? getData : [getData];

      for (const obj of objectsToUpdate) {
        const rfpRecord = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findOne({
          where: {
            purchase_request_id: procurementId,
            rfp_number: rfp_number,
          },
        });
        if (rfpRecord) {
          obj.setDataValue("rfp_start_date", rfpRecord.rfp_start_date);
          obj.setDataValue("rfp_end_date", rfpRecord.rfp_end_date);
          obj.setDataValue(
            "rfp_delivery_date",
            rfpRecord.expected_delivery_date || rfpRecord.rfp_delivery_date,
          );
          obj.setDataValue("rfp_stop_date", rfpRecord.rfp_stop_date);
          obj.setDataValue("rfp_number", rfp_number);
        }
      }
    }

    const delivery_date = Array.isArray(getData)
      ? getData[0]?.getDataValue("rfp_delivery_date")
      : getData?.getDataValue("rfp_delivery_date");

    const quoteWhere = { pr_id: procurementId };
    if (rfp_number) {
      quoteWhere.rfp_number = rfp_number;
    }
    const quotationData =
      await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
        where: quoteWhere,
        attributes: ["approval_status", "pr_id", "rfp_number"],
      });

    const negoWhere = { purchase_request_id: procurementId };
    if (rfp_number) {
      negoWhere.rfp_number = rfp_number;
    }
    const vendor_details =
      await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.findOne({
        where: negoWhere,
        attributes: ["stop_nego_date", "negotiation_code"],
      });

    const name = await db.user.findOne({
      where: {
        employee_id: Array.isArray(getData)
          ? getData[0].employee_id
          : getData.employee_id,
      },
      attributes: ["first_name", "last_name"],
    });
    const result = name.first_name + " " + name.last_name;

    if (getData) {
      let approval_status;
      if (procurementId) {
        const existWhere = { pr_id: procurementId };
        if (rfp_number) {
          existWhere.rfp_number = rfp_number;
        }
        let isExist = await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
          where: existWhere,
        });
        if (isExist) {
          approval_status = true;
        } else {
          approval_status = false;
        }
      }

      return res.status(200).send({
        code: 200,
        message: "Fetch Data Successfully",
        data: Array.isArray(getData) ? getData : [getData],
        result,
        vendor_details,
        RFP_details: quotationData,
        quotationData,
        approval_status,
        delivery_date,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Record Not Found", data: getData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.sendRFP = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      end_date,
      start_date,
      delivery_date,
      item_detail,
      site_url,
      rfp_number,
      procurement_type,
      procurement_id,
    } = req.body;

    // ─── Input Validation ────────────────────────────────────────────
    if (!procurement_id) {
      await transaction.rollback();
      return res
        .status(400)
        .send({ code: 400, message: "Procurement ID is required!" });
    }

    if (!item_detail || item_detail.length === 0) {
      await transaction.rollback();
      return res
        .status(400)
        .send({ code: 400, message: "Item details are required!" });
    }

    const pr_code = await db.purchase_details.findOne({
      where: { id: procurement_id },
      attributes: ["pr_number"],
      transaction,
    });

    if (!pr_code) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ code: 404, message: "Purchase request not found!" });
    }

    const updatedProducts = [];
    const vendorIdsToSendMail = new Set();
    const procurementProductIds = [];
    const vendorIds = new Set();
    // ─── Validate all items first before making any DB changes ──────
    for (let item of item_detail) {
      const item_master_id = item.item_master_id;

      if (!item.vendor_ids || item.vendor_ids.length === 0) {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: `Vendor list is empty for ${item_master_id}`,
        });
      }
      item.vendor_ids.forEach((id) => vendorIds.add(id));
    }

    // ─── Process each item ──────────────────────────────────────────
    for (let item of item_detail) {
      const item_master_id = item.item_master_id;
      const pr_item_id = item.item_id;

      const getData = await db.purchase_item.findOne({
        where: {
          purchase_request_id: procurement_id,
          item_master_id: item_master_id,
          id: pr_item_id,
        },
        transaction,
      });

      if (!getData) {
        await transaction.rollback();
        return res.status(403).send({
          code: 403,
          message: `Record Not Found for ${item_master_id}`,
        });
      }

      procurementProductIds.push({ id: getData.id });

      // ─── Create question records for vendors ────────────────────
      if (item.questions?.length > 0 && item.vendor_ids?.length > 0) {
        const questionData = [];

        for (const ques of item.questions) {
          for (const vendorId of item.vendor_ids) {
            questionData.push({
              question_type: ques.type,
              vendor_id: vendorId,
              question: ques.question,
              purchase_item_id: item.item_id,
              purchase_request_id: procurement_id,
            });
          }
        }

        if (questionData.length > 0) {
          await db.purchase_item_ques.bulkCreate(questionData, { transaction });
        }
      }

      // Re-fetch the item data after update
      const prItemData = await db.purchase_item.findOne({
        where: {
          item_master_id: item_master_id,
          purchase_request_id: procurement_id,
        },
        transaction,
      });

      await prItemData.update(
        {
          vendor_ids: item.vendor_ids,
        },
        { transaction },
      );

      // ─── Create PROCUREMENT_PURCHASE_VENDOR_RFP for each vendor ──────────
      for (const vendorId of item.vendor_ids) {
        vendorIdsToSendMail.add(vendorId);

        const obj = {
          item_id: prItemData.item_master_id,
          procurement_product_id: prItemData.id,
          mvp: prItemData.total_mvp,
          delivery_address: prItemData.delivery_address,
          expected_delivery_date: item.expected_delivery_date,
          remarks: prItemData.remarks,
          approvel_status: prItemData.approvel_status,
          status: prItemData.status,
          vendors: vendorId,
          procurement_type: procurement_type,
          purchase_request_id: procurement_id,
          entity_id: req.body.entity_id,
          department_id: req.body.department_id,
          financial_year_id: req.body.financial_year_id,
          updateValue: false,
          rfp_number: rfp_number,
          rfp_start_date: start_date,
          rfp_end_date: end_date,
          rfp_status: "LIVE RFP",
        };
        await db.PROCUREMENT_PURCHASE_VENDOR_RFP.create(obj, { transaction });
      }

      updatedProducts.push({ item_id: item_master_id });
    }

    // Check if all active items in this PR have an RFP initiated
    const totalItemsCount = await db.purchase_item.count({
      where: { purchase_request_id: procurement_id, status: "ACTIVE" },
      transaction,
    });

    const initiatedItemsCount = await db.purchase_item.count({
      where: { purchase_request_id: procurement_id, status: "ACTIVE" },
      include: [
        {
          model: db.PROCUREMENT_PURCHASE_VENDOR_RFP,
          required: true,
        },
      ],
      distinct: true,
      col: "id",
      transaction,
    });

    const allInitiated = totalItemsCount === initiatedItemsCount;

    // ─── Update purchase_details (once, outside item loop) ──────────
    await db.purchase_details.update(
      {
        rfp_Initiated: allInitiated,
        rfp_number: rfp_number,
        rfp_start_date: start_date,
        rfp_end_date: end_date,
        // rfp_delivery_date: delivery_date,
        rfp_status: "LIVE RFP",
        vendors_invited_count: vendorIds.size,
      },
      { where: { id: procurement_id }, transaction },
    );

    // ─── Commit transaction ─────────────────────────────────────────
    await transaction.commit();

    // ─── Send emails AFTER successful commit ────────────────────────
    for (const vendorId of vendorIdsToSendMail) {
      const get_vendorData = await db.vendor_basic_details.findOne({
        where: { id: vendorId },
      });

      if (get_vendorData) {
        sendRFPMail(
          site_url,
          vendorId,
          rfp_number,
          procurement_type,
          get_vendorData,
        );
      }
    }

    return res.status(200).send({
      code: 200,
      message: "Updated Successfully",
      data: updatedProducts,
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in sendRFP: ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAll_Product = async (req, res) => {
  try {
    const loggedEmployeeId = req.params.id;
    const loggedUserRole = req.body.loggedUserRole;
    let getAllData;

    if (loggedUserRole === "Super Admin") {
      const query = `
            SELECT * FROM PROCUREMENT_PURCHASE_REQUEST AS pp 
            WHERE pp.status = 'ACTIVE' ORDER BY pp.id DESC `;

      getAllData = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });
    } else {
      const query = `
            SELECT * FROM PROCUREMENT_PURCHASE_REQUEST AS pp 
            WHERE pp.employee_id = ${loggedEmployeeId} and pp.status='ACTIVE' 
            ORDER BY pp.id DESC `;

      getAllData = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });
    }

    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Product Successfully",
        data: getAllData,
      });
    } else {
      return res
        .status(403)
        .send({ code: 403, message: "Record Not Found", data: getAllData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAll_Product_ByID = async (req, res) => {
  try {
    const procurementId = req.params.id;
    if (procurementId) {
      const getData = await db.purchase_details.findOne({
        where: {
          id: procurementId,
        },
      });
      return res.status(200).send({
        code: 200,
        message: "Fetch All Product Successfully",
        data: getData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 403, message: "Record Not Found", data: getData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_ById_RFP = async (req, res) => {
  try {
    const { procurementId, pr_category, rfp_number } = req.body;

    if (!procurementId || !pr_category) {
      return res.status(400).send({ code: 400, message: "Bad Request" });
    }

    let getData = null;

    if (pr_category === "Item") {
      getData = await db.purchase_details.findAll({
        where: { id: procurementId },
        include: [
          {
            model: db.warehouse,
            attributes: ["name", "postal_address", "code", "address"],
          },
          {
            model: db.department,
            attributes: ["department_name"],
          },
          {
            model: db.purchase_item,
            where: { status: "ACTIVE" },
            include: [
              {
                model: db.ItemMaster,
                where: { status: "ACTIVE" },
                attributes: ["item_code", "item_name", "MVP"],
                include: [
                  {
                    model: db.asset,
                    where: { status: "ACTIVE" },
                    attributes: ["asset_category_name"],
                  },
                  {
                    model: db.imageDocument,
                    attributes: ["image"],
                  },
                ],
              },
              {
                model: db.PROCUREMENT_PURCHASE_VENDOR_RFP,
                where: {
                  purchase_request_id: procurementId,
                  ...(rfp_number ? { rfp_number: rfp_number } : {}),
                },
                attributes: ["vendors", "item_id", "rfp_number"],
                include: {
                  model: db.vendor_basic_details,
                  attributes: ["vendor_name"],
                },
              },
            ],
          },
        ],
      });
    } else if (pr_category === "Service") {
      getData = await db.purchase_details.findOne({
        where: { id: procurementId },
        include: [
          {
            model: db.tbl_branch,
            attributes: ["branch_name"],
          },
          {
            model: db.purchase_service,
            where: { status: "ACTIVE" },
            include: [
              {
                model: db.Service_master,
                where: { status: "ACTIVE" },
                attributes: [
                  "service_code",
                  "service_name",
                  "service_description",
                  "MVP",
                  "service_document",
                ],
                include: [
                  {
                    model: db.ServicesCategory,
                    where: { status: "ACTIVE" },
                    attributes: ["service_category_name"],
                  },
                  {
                    model: db.PROCUREMENT_PURCHASE_VENDOR_RFP,
                    where: {
                      purchase_request_id: procurementId,
                      ...(rfp_number ? { rfp_number: rfp_number } : {}),
                    },
                    attributes: ["vendors", "item_id", "rfp_number"],
                    include: {
                      model: db.vendor_basic_details,
                      attributes: ["vendor_name"],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    }
    if (!getData) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
    const employeeIdData = await db.purchase_details.findOne({
      where: { id: procurementId },
    });

    if (!employeeIdData) {
      return res
        .status(404)
        .send({ code: 404, message: "Employee Record Not Found" });
    }

    const nameData = await db.user.findOne({
      where: { employee_id: employeeIdData.employee_id },
      attributes: ["first_name", "last_name"],
    });

    if (!nameData) {
      return res
        .status(404)
        .send({ code: 404, message: "User Record Not Found" });
    }

    const fullName = `${nameData.first_name} ${nameData.last_name}`;

    //   let nego_id = null;
    //   const nego_id_data = await vendor_negotiation_detail.findOne({
    //     where: { procurement_id: procurementId },
    //     attributes: ["negotiation_id"],
    //   });

    //   if (nego_id_data) {
    //     nego_id = nego_id_data.negotiation_id;
    //   }

    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully",
      data: getData,
      employeeName: fullName,
      // nego_id: nego_id,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.GetAll_liveRFP = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.body;

    const query = `
        SELECT VP.rfp_number, PR.id AS id, PR.pr_number, PR.pr_category, VP.rfp_status,
        VP.rfp_end_date AS end_date, VP.rfp_start_date AS start_date, MD.department_name,
        COUNT(DISTINCT VP.vendors) AS vendors_invited_count,
        COUNT(DISTINCT CASE WHEN VP.vendor_responded = 1 THEN VP.vendors END) AS vendors_responded_count
        FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VP.purchase_request_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        WHERE PR.entity_id = :entityId
        AND PR.financial_year_id = :financialYearId
        AND PR.status = 'ACTIVE'
        AND VP.rfp_status = 'LIVE RFP'
        GROUP BY VP.rfp_number, PR.id, PR.pr_number, PR.pr_category, VP.rfp_status, VP.rfp_end_date, VP.rfp_start_date, MD.department_name
        ORDER BY PR.id DESC;
          `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    // const getAllData = await db.purchase_item.findAll({
    //   where: {
    //     status: "ACTIVE",
    //     entity_id,
    //     financial_year_id,
    //   },
    // });

    // const rfp = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
    //   where: {
    //     status: "ACTIVE",
    //     rfp_status: "LIVE RFP",
    //   },
    //   attributes: [
    //     "Rfp_Number",
    //     "purchase_request_id",
    //     "end_date",
    //     "start_date",
    //   ],
    // });

    // const vendor_count = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
    //   where: {
    //     is_submitted: "TRUE",
    //   },
    //   attributes: ["vendors", "purchase_request_id"],
    // });

    // let combinedData = [...getAllData];
    // let unique_id = new Set();
    // let separate_id = new Set();
    // let uniqueArr = [];
    // let rfpArr = [];
    // let v_count = [];
    // // let rfp = []

    // combinedData.forEach((i) => {
    //   if (!unique_id.has(i.purchase_request_id)) {
    //     unique_id.add(i.purchase_request_id);
    //     uniqueArr.push(i);
    //   }
    // });

    // rfp.forEach((i) => {
    //   if (!separate_id.has(i.purchase_request_id)) {
    //     separate_id.add(i.purchase_request_id);
    //     rfpArr.push(i);
    //   }
    // });

    // separate_id.forEach((id) => {
    //   let vendors = new Set();
    //   vendor_count.forEach((item) => {
    //     if (item.purchase_request_id === id) {
    //       vendors.add(item.vendors);
    //     }
    //   });
    //   v_count.push({ purchase_request_id: id, vendor_count: vendors.size });
    // });

    if (getAllData.length > 0) {
      return res.status(200).json({
        code: 200,
        message: "Data retrieved successfully",
        data: getAllData,
        // rfpArr,
        // v_count,
      });
    } else {
      return res.status(404).json({ code: 404, message: "No records found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Server Error" });
  }
};
////////////////////////////////////////// Vendor Mangement //////////////////////////////////////////////

exports.get_levels_to_be_approved_rfp = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.body;
    const employee_id = req.params.id;
    const query = `
      SELECT DISTINCT pr.id, pp.level, pp.approval_status, pp.progress_status, pp.status, pp.approval_for, pp.createdAt, pp.updatedAt,
      pp.purchase_request_id, pp.quotation_id, pp.employee_id, pp.workflow_range_id, pp.department_id, pr.entity_id, pr.financial_year_id, pr.pr_number,
      rad.quotation_for, rad.quotation_code, rad.approval_status, rad.pr_id, MD.department_name, pr.rfp_start_date AS start_date,
      pr.rfp_end_date AS end_date, pr.pr_category
      
      FROM PROCUREMENT_PURCHASE_QUOTATION_APPROVAL_LEVEL AS pp
      INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS pr ON pr.id = pp.purchase_request_id
      INNER JOIN PROCUREMENT_PURCHASE_VENDOR_QUOTATION AS rad ON rad.id = pp.quotation_id
      INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = pp.department_id

      WHERE pp.employee_id = :employeeId
      AND pp.status = 'ACTIVE'
      AND pp.approval_status = 'PENDING'
      AND rad.approval_status = 'PENDING'
      AND pr.entity_id =:entityId
      AND pr.financial_year_id =:financialYearId
      AND NOT EXISTS (
            SELECT 1 
            FROM PROCUREMENT_PURCHASE_QUOTATION_APPROVAL_LEVEL AS prev
            WHERE prev.quotation_id = pp.quotation_id
              AND prev.level < pp.level
              AND prev.approval_status != 'APPROVED'
              AND prev.approval_for = pp.approval_for
          )
          ORDER BY pr.id DESC
        `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        employeeId: employee_id,
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    const uniqueArr = [
      ...new Map(getAllData.map((item) => [item.pr_id, item])).values(),
    ];

    if (uniqueArr.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found!",
        data: [],
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Fetch All Products Successfully",
      data: uniqueArr,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/* RFP VENDOR QUOTATION START */
exports.getVendor_replyData = async (req, res) => {
  const { vendor_id, Rfp_no, type } = req.query;

  try {
    const vendorQuery = `SELECT VP.purchase_request_id, VP.item_id, VP.vendor_responded, MD.department_name, VP.expected_delivery_date, VP.rfp_start_date, VP.rfp_end_date, VP.rfp_status
      FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
      INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VP.purchase_request_id
      INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
      WHERE VP.rfp_number = :Rfp_no 
      AND VP.vendors = :vendor_id 
      AND PR.pr_category = :type
      AND PR.status = 'ACTIVE'`;

    const [vendorData] = await db.sequelize.query(vendorQuery, {
      replacements: {
        Rfp_no: Rfp_no,
        vendor_id: vendor_id,
        type: type,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    const valueData = await db.purchase_details.findOne({
      where: {
        id: vendorData.purchase_request_id,
        status: "ACTIVE",
      },
      include: [
        {
          model: db.purchase_imgae,
        },
      ],
    });

    const result = await db.sequelize.query(
      `SELECT DISTINCT PS.id, PS.priority, PS.total_mvp, PS.tax, PS.quantity, PS.status, PS.isDeleted, PS.vendor_ids,
  PR.vendors_invited_count, PR.vendors_responded_count, PS.po_status, PR.nego_status, 
  PS.item_categroy_id, PS.item_master_id, PS.purchase_request_id, PS.grand_total, PS.quantity, PS.priority,
  VP.procurement_product_id, VP.expected_delivery_date,
  VP.price_amt, VP.sgst, VP.cgst, VP.igst, VP.delivery_charges, VP.additional_charges,
  VP.currency_id, VP.vendor_remarks, VP.vendor_uploaded_document, VP.remarks_approvel,
  VP.checked, VP.vendor_responded, VP.purchase_request_id, VP.vendors, VP.item_id,
  TS.item_name, TS.item_name, TS.item_code, TS.MVP, TS.description,
  TS.manage_by, TS.status, TS.isDeleted, TS.asset_id, TS.uom_id, TS.hsn_code_id, HSN.hsn_sac_code, MID.image AS item_document

  FROM PROCUREMENT_PURCHASE_REQUEST_ITEM AS PS
  INNER JOIN PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP ON VP.procurement_product_id = PS.id
  INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VP.purchase_request_id
  INNER JOIN MASTER_ITEM AS TS ON TS.id = PS.item_master_id
  LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT AS MID ON MID.item_id = TS.id
  INNER JOIN MASTER_ASSET AS S ON S.id = TS.asset_id
  LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = TS.hsn_code_id

  WHERE VP.purchase_request_id = ${vendorData.purchase_request_id}
          AND VP.rfp_number = '${Rfp_no}'
          AND VP.vendors = ${vendor_id}
          AND PR.pr_category = '${type}'
          AND PS.status = 'Active'
          AND TS.status = 'Active';
      `,
    );

    let procurementItems = [];

    if (result[0]) {
      for (let items of result[0]) {
        const item_id = items.id;

        const question_data = await db.sequelize.query(
          `SELECT DISTINCT PPRIQ.*, CONCAT(HRU.first_name, ' ', HRU.last_name) AS answered_emp_name
        FROM PROCUREMENT_PURCHASE_REQUEST_ITEM_QUES AS PPRIQ
        LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PPRIQ.answered_by
        WHERE PPRIQ.purchase_item_id = ${item_id} AND vendor_id = ${vendor_id}`,
        );

        procurementItems.push({
          ...items,
          questionForm: question_data[0] || [],
        });
      }
    }

    const Obj = {
      ...valueData.dataValues,
      start_date: vendorData.rfp_start_date,
      end_date: vendorData.rfp_end_date,
      rfp_status: vendorData.rfp_status,
      procurement_Item_requests: procurementItems,
      department_name: vendorData.department_name,
    };

    if (Obj) {
      return res.status(200).send({
        code: 200,
        message: "success",
        data: Obj,
        item_Data: vendorData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Data Not Found" });
    }
  } catch (error) {
    console.log(error);

    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.update_vendorData = async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);
    const {
      type,
      product_details,
      procurement_id,
      rfp_number,
      vendor_remarks,
    } = req.body;
    const parseData = JSON.parse(product_details);
    if (!parseData) {
      return res
        .status(400)
        .json({ code: 400, message: "Product details are required" });
    }

    const vendorQuery = `SELECT VP.*
      FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
      INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VP.purchase_request_id
      INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
      WHERE VP.rfp_number = :Rfp_no 
      AND VP.vendors = :vendor_id 
      AND PR.pr_category = :type
      AND PR.status = 'ACTIVE'`;

    const getData = await db.sequelize.query(vendorQuery, {
      replacements: {
        Rfp_no: rfp_number,
        vendor_id: vendorId,
        type: type,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getData.length > 0) {
      const updatePromises = [];
      for (let item of parseData) {
        const data = item;
        const { procurement_product_id } = getData.find(
          (el) => el.item_id === data.item_id,
        );

        const updateData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.update(
          {
            price_amt: data.price_amt,
            igst: data.igst || null,
            delivery_charges: data.delivery_charges,
            additional_charges: data.additional_charges,
            currency_id: data.currency_id,
            vendor_remarks: data.vendor_remarks,
            vendor_responded: true,
            confirm_date: data.delivery_date,
            vendor_remarks: vendor_remarks,
          },
          {
            where: {
              procurement_product_id: procurement_product_id,
              vendors: vendorId,
              rfp_number: rfp_number,
            },
          },
        );

        if (data.questionForm && data.questionForm.length > 0) {
          for (let ques of data.questionForm) {
            await db.purchase_item_ques.update(
              { answer: ques.answer },
              { where: { id: ques.id } },
            );
          }
        }

        //-- update questionForm data with vendor Ans
        const newData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findOne({
          where: {
            procurement_product_id: procurement_product_id,
            vendors: vendorId,
            rfp_number: rfp_number,
          },
          attributes: ["vendor_responded"],
        });

        if (newData.vendor_responded == true) {
          const vendorsRespondedCount =
            await db.PROCUREMENT_PURCHASE_VENDOR_RFP.count({
              where: {
                purchase_request_id: procurement_id,
                rfp_number: rfp_number,
                vendor_responded: true,
              },
              distinct: true,
              col: "vendors",
            });

          await db.purchase_details.update(
            { vendors_responded_count: vendorsRespondedCount },
            {
              where: {
                id: procurement_id,
              },
            },
          );
        }
        updatePromises.push(updateData);
      }

      await Promise.all(updatePromises);
      return res
        .status(200)
        .json({ code: 200, message: "Quotation sent successfully" });
    } else {
      return res.status(403).json({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Server Error" });
  }
};
/* RFP VENDOR QUOTATION END */

/* STOP LIVE RFP START */
exports.stop_live_rfp = async (req, res) => {
  try {
    const procurement_id = req.params.id;
    const { rfp_status, nego_status, rfp_number } = req.body;
    const stop_rfp_date = req.body.stop_rfp_date
      ? req.body.stop_rfp_date.split("-").reverse().join("-")
      : null;

    if (!procurement_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Procurement ID is required" });
    }

    await db.PROCUREMENT_PURCHASE_VENDOR_RFP.update(
      {
        rfp_stop_date: stop_rfp_date,
        rfp_status: rfp_status,
      },
      {
        where: {
          purchase_request_id: procurement_id,
          rfp_number: rfp_number,
        },
      },
    );

    await db.purchase_details.update(
      {
        nego_status: nego_status,
      },
      { where: { id: procurement_id } },
    );

    return res
      .status(200)
      .send({ code: 200, message: "RFP stopped successfully" });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};
/* STOP LIVE RFP END */

/* GET ALL CLOSE RFP START */
exports.GetAll_CloseRFP = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.body;

    const query = `
        SELECT VP.rfp_number, PR.id AS id, PR.pr_number, PR.pr_category, VP.rfp_status,
        VP.rfp_end_date AS end_date, VP.rfp_start_date AS start_date, MD.department_name,
        COUNT(DISTINCT VP.vendors) AS vendors_invited_count,
        COUNT(DISTINCT CASE WHEN VP.vendor_responded = 1 THEN VP.vendors END) AS vendors_responded_count
        FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VP.purchase_request_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        WHERE PR.entity_id = :entityId
        AND PR.financial_year_id = :financialYearId
        AND PR.status = 'ACTIVE'
        AND VP.rfp_status = 'CLOSE RFP'
        AND VP.rfp_number IS NOT NULL
        GROUP BY VP.rfp_number, PR.id, PR.pr_number, PR.pr_category, VP.rfp_status, VP.rfp_end_date, VP.rfp_start_date, MD.department_name
        ORDER BY PR.id DESC;
          `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData.length > 0) {
      await Promise.all(
        getAllData.map(async (pr) => {
          if (pr.id) {
            const result =
              await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
                where: { pr_id: pr.id, rfp_number: pr.rfp_number },
              });

            pr.approval_status = result ? "Approved" : "Pending";
          } else {
            pr.approval_status = "Pending";
          }
        }),
      );

      return res.status(200).json({
        code: 200,
        message: "Data retrieved successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).json({ code: 404, message: "No records found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};
/* GET ALL CLOSE RFP END */

/* GET ITEM BY LOWEST PRICE START */
exports.getItemByLowestPrice = async (req, res) => {
  try {
    const procurement_id = req.params.id;
    const { rfp_number, rfp_approval_id } = req.query;

    let finalRfpNumber = rfp_number;
    if (!finalRfpNumber && rfp_approval_id) {
      const quotation = await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
        where: { quotation_code: rfp_approval_id },
      });
      if (quotation) {
        finalRfpNumber = quotation.rfp_number;
      }
    }

    const whereClause = {
      purchase_request_id: procurement_id,
    };
    if (finalRfpNumber) {
      whereClause.rfp_number = finalRfpNumber;
    }
    const vendors = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
      where: whereClause,
      order: [["price_amt", "ASC"]],
      attributes: [
        "vendors",
        "procurement_product_id",
        // "procurement_service_id",
        // "stop_Rfp_date",
        // "end_date",
        "createdAt",
        "price_amt",
        "igst",
        "delivery_charges",
        "additional_charges",
        "currency_id",
        "vendor_remarks",
        "purchase_request_id",
      ],
    });
    const vendorIds = vendors.map((vendor) => vendor.vendors);

    const vendorNames = await db.vendor_basic_details.findAll({
      where: {
        id: vendorIds,
      },
      attributes: ["vendor_name", "id"],
    });

    const vendorNameMap = {};
    vendorNames.forEach((vendor) => {
      vendorNameMap[vendor.id] = vendor.vendor_name;
    });

    let questionForm;
    const getItemName = async (vendor) => {
      if (vendor.procurement_product_id) {
        const ItemName = await db.purchase_item.findOne({
          where: {
            id: vendor.procurement_product_id,
          },
          attributes: ["item_master_id", "id"],
        });

        if (ItemName) {
          const itemNameDetails = await db.ItemMaster.findOne({
            where: {
              id: ItemName.item_master_id,
            },
            attributes: ["item_name"],
          });
          return itemNameDetails ? itemNameDetails.item_name : null;
        }
      }
      return null;
    };

    // const getServiceName = async (vendor) => {
    //   console.log(vendor, "datata");
    //   if (vendor.procurement_service_id) {
    //     console.log(vendor, "datata");
    //     const ServiceName = await db.purchase_service.findOne({
    //       where: {
    //         id: vendor.procurement_service_id,
    //       },
    //       attributes: ["service_master_id"],
    //     });
    //     if (ServiceName) {
    //       const serviceNameDetails = await db.Service_master.findOne({
    //         where: {
    //           service_id: ServiceName.service_master_id,
    //         },
    //         attributes: ["service_name"],
    //       });
    //       return serviceNameDetails ? serviceNameDetails.service_name : null;
    //     }
    //   }
    //   return null;
    // };

    //   const getBOMName = async (vendor) => {
    //     if (vendor.procurement_bomItem_id) {
    //       const bomItem = await Procurement_BomItemDetails.findOne({
    //         where: {
    //           procurement_bomItem_id: vendor.procurement_bomItem_id,
    //         },
    //         attributes: ["product_name"],
    //       });
    //       return bomItem ? bomItem.product_name : null;
    //     }
    //     return null;
    //   };

    const groupedData = {};

    for (const vendor of vendors) {
      const itemName = await getItemName(vendor);
      // const serviceName = await getServiceName(vendor);

      const ItemName = await db.purchase_item.findOne({
        where: {
          id: vendor.procurement_product_id,
        },
        attributes: ["item_master_id", "id"],
      });

      questionForm = await db.purchase_item_ques.findAll({
        where: {
          purchase_request_id: vendor.purchase_request_id,
          purchase_item_id: ItemName.id,
          vendor_id: vendor.vendors,
        },
      });

      const currency_type = await db.currency_convert.findOne({
        where: { Currency_Convert_id: vendor.currency_id },
        raw: true,
      });

      const vendorData = {
        vendor_id: vendor.vendors,
        vendor_name: vendorNameMap[vendor.vendors],
        price_amt: vendor.price_amt,
        itemName,
        // serviceName,
        //   bomName,
        stop_Rfp_date: vendor.stop_Rfp_date,
        end_date: vendor.end_date,
        createdAt: vendor.createdAt,
        igst: vendor.igst,
        delivery_charges: vendor.delivery_charges,
        additional_charges: vendor.additional_charges,
        currency_id: vendor.currency_id,
        currency_type: currency_type ? currency_type.Currency_Type : null,
        vendor_remarks: vendor.vendor_remarks,
        questionForm: questionForm || [],
      };

      // const key = itemName || serviceName || bomName;
      const key = itemName;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(vendorData);
    }

    const levelsWithData = {
      Level1: [],
      Level2: [],
      Level3: [],
      Extra: [],
    };

    for (const key in groupedData) {
      const filteredVendors = groupedData[key].filter(
        (vendor) => vendor.price_amt !== null || 0,
      );
      const sortedVendors = filteredVendors.sort(
        (a, b) => a.price_amt - b.price_amt,
      );

      if (sortedVendors.length > 0) {
        levelsWithData.Level1.push(sortedVendors[0]);
      }
      if (sortedVendors.length > 1) {
        levelsWithData.Level2.push(sortedVendors[1]);
      }
      if (sortedVendors.length > 2) {
        levelsWithData.Level3.push(sortedVendors[2]);
      }
      if (sortedVendors.length > 3) {
        for (let i = 3; i < sortedVendors.length; i++) {
          levelsWithData.Extra.push(sortedVendors[i]);
        }
      }
    }

    const prData = await db.purchase_details.findOne({
      where: {
        id: procurement_id,
      },
      attributes: ["rfp_stop_date", "rfp_end_date", "createdAt"],
    });

    const additionalInfo = {
      stop_Rfp_date: prData.rfp_stop_date,
      end_date: prData.rfp_end_date,
      createdAt: prData.createdAt,
    };

    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully",
      data: levelsWithData,
      vendors,
      additionalInfo,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.sendRFP_for_Service = async (req, res) => {
  try {
    const {
      vendors,
      vendors_invited_count,
      services_details,
      site_url,
      Rfp_Number,
      procurement_type,
      rfp_Initiated,
      procurement_id,
      end_date,
      start_date,
      entity_id,
      department_id,
    } = req.body;

    const pr_code = await db.purchase_details.findOne({
      where: {
        id: procurement_id,
      },
      attributes: ["pr_number"],
    });

    let all_Data = vendors;
    let all_Data2 = services_details;

    const updatedProducts = [];
    const vendorIdsToSendMail = new Set();
    const procurementProductIds = [];

    for (let i = 0; i < all_Data2.length; i++) {
      const currentProduct = all_Data2[i];
      const currentProductId = currentProduct.service_id;

      if (!currentProduct.list || currentProduct.list.length === 0) {
        return res.status(400).send({
          code: 400,
          message: `Vendor list is empty for ${currentProductId}`,
        });
      }

      const vendorIds = currentProduct.list.map((vendor) => vendor.id);

      const getData = await db.purchase_service.findOne({
        where: { service_master_id: currentProductId },
      });

      if (getData) {
        procurementProductIds.push({ id: getData.id });
        await db.purchase_service.update(
          {
            vendors: vendorIds,
            end_date,
            vendors_invited_count,
            pr_code: pr_code.pr_number,
            rfp_status: "LIVE RFP",
          },
          { where: { purchase_request_id: procurement_id } },
        );

        //   await PROCUREMENT_PURCHASE_VENDOR_RFP.update(
        //     {
        //       rfp_status: "LIVE RFP",
        //     },
        //     { where: { procurement_id: procurement_id } }
        //   );

        const getAll_data = await db.purchase_service.findOne({
          where: { service_master_id: currentProductId },
        });

        for (const vendorId of vendorIds) {
          vendorIdsToSendMail.add(vendorId);
          const get_vendorData = await db.vendor_basic_details.findOne({
            where: { id: vendorId },
          });
          if (get_vendorData) {
            const obj = {
              service_id: getAll_data.service_master_id,
              procurement_service_id: getAll_data.id,
              product_image: getAll_data.product_image,
              item_name: getAll_data.item_name,
              item_code: getAll_data.item_code,
              unit: getAll_data.unit,
              priority: getAll_data.priority,
              mvp: getAll_data.total_mvp,
              location: getAll_data.location,
              state: getAll_data.state,
              city: getAll_data.city,
              pin: getAll_data.pin,
              delivery_address: getAll_data.delivery_address,
              file: getAll_data.file,
              remarks: getAll_data.remarks,
              name: getAll_data.name,
              department: getAll_data.department,
              emp_id: getAll_data.emp_id,
              approvel_status: getAll_data.approvel_status,
              status: getAll_data.status,
              start_date: req.body.start_date,
              end_date: req.body.end_date,
              vendors: vendorId,
              rfp_status: "LIVE RFP",
              Rfp_Number: req.body.Rfp_Number,
              procurement_type: req.body.procurement_type,
              purchase_request_id: req.body.procurement_id,
              entity_id: req.body.entity_id,
              department_id: req.body.department_id,
              financial_year_id: req.body.financial_year_id,
              rfp_number: req.body.Rfp_Number,
              rfp_start_date: req.body.start_date,
              rfp_end_date: req.body.end_date,
            };
            await db.PROCUREMENT_PURCHASE_VENDOR_RFP.create(obj);
          }
        }

        const totalServicesCount = await db.purchase_service.count({
          where: { purchase_request_id: procurement_id, status: "ACTIVE" },
        });

        const initiatedServicesCount = await db.purchase_service.count({
          where: { purchase_request_id: procurement_id, status: "ACTIVE" },
          include: [
            {
              model: db.PROCUREMENT_PURCHASE_VENDOR_RFP,
              required: true,
            },
          ],
          distinct: true,
          col: "id",
        });

        const allServicesInitiated =
          totalServicesCount === initiatedServicesCount;

        await db.purchase_details.update(
          {
            rfp_Initiated: allServicesInitiated,
            rfp_number: Rfp_Number,
            rfp_start_date: start_date,
            rfp_end_date: end_date,
            rfp_status: "LIVE RFP",
          },
          { where: { id: procurement_id } },
        );

        await db.PROCUREMENT_PURCHASE_VENDOR_RFP.update(
          {
            updateValue: false,
          },
          {
            where: {
              purchase_request_id: procurement_id,
              rfp_number: Rfp_Number,
            },
          },
        );

        updatedProducts.push({ service_master_id: currentProductId });
      } else {
        return res.status(403).send({
          code: 403,
          message: `Record Not Found for ${currentProductId}`,
        });
      }
    }

    for (const vendorId of vendorIdsToSendMail) {
      const get_vendorData = await db.vendor_basic_details.findOne({
        where: { id: vendorId },
      });
      sendRFPMailforService(
        site_url,
        vendorId,
        Rfp_Number,
        procurement_type,
        get_vendorData,
      );
    }

    const updatedDetails = await db.purchase_details.update(
      {
        rfp_Initiated: req.body.rfp_Initiated,
      },
      {
        where: {
          id: procurement_id,
        },
      },
    );

    return res.status(200).send({
      code: 200,
      message: "Updated Successfully",
      data: updatedProducts,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getVendor_replyData_for_service = async (req, res) => {
  try {
    const { vendor_id, Rfp_no, type, service_id } = req.query;
    const [serviceData] = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
      where: {
        Rfp_Number: Rfp_no,
        vendors: parseInt(vendor_id),
        procurement_type: type,
      },
      attributes: [
        "procurement_service_id",
        "purchase_request_id",
        "start_date",
        "end_date",
        "vendor_responded",
        "rfp_status",
      ],
    });
    const valueData = await db.purchase_details.findOne({
      where: {
        id: serviceData.purchase_request_id,
        status: "ACTIVE",
      },
      include: [
        {
          model: db.purchase_imgae,
        },
      ],
    });
    const result = await db.sequelize.query(
      `SELECT DISTINCT 
  PS.id,PS.pr_type,PS.priority,PS.total_mvp,PS.quantity,PS.status,PS.isDeleted,PS.department_name,
  PS.pr_category,PS.vendors_invited_count,PS.vendors_responded_count,PS.rfp_status,PS.statusVendor,PS.nego_status,
  PS.pr_code,PS.rfp_approvel_status,PS.service_master_id,PS.service_categroy_id,PS.purchase_request_id,PS.vendor_id,
  PS.department_id,PS.entity_id,PS.employee_id,PS.financial_year_id,PS.grand_total,PS.tax,
  VP.procurement_product_id,VP.expected_delivery_date,VP.product_image,VP.item_name,VP.item_code,VP.unit,VP.priority,VP.mvp,VP.location,
  VP.state,VP.city,VP.pin,VP.delivery_address,VP.file,VP.remarks,VP.name,VP.department,VP.emp_id,VP.approvel_status,
  VP.status,VP.end_date,VP.start_date,VP.rfp_status,VP.price_amt,VP.sgst,VP.cgst,VP.igst,VP.delivery_charges,VP.additional_charges,
  VP.currency_id,VP.vendor_remarks,VP.vendor_uploaded_document,VP.remarks_approvel,VP.approvel_vendor,VP.final_remarks,
  VP.checked,VP.is_disabled,VP.updateValue,VP.Rfp_Number,VP.procurement_type,VP.vendor_responded,VP.stop_Rfp_date,
  VP.target_amount,VP.start_date_nego,VP.end_date_nego,VP.is_submitted,VP.purchase_request_id,VP.vendors,VP.item_id,
  VP.procurement_service_id,VP.service_id,VP.department_id,VP.entity_id,VP.financial_year_id,
  TS.service_id,TS.service_code,TS.service_name,TS.service_description,TS.MVP,TS.service_document,
  TS.status,TS.isDeleted,TS.service_category_id,
  S.service_category_code,S.service_category_name,S.service_category_description,S.status,S.isDeleted
  FROM PROCUREMENT_PR_REQUEST_SERVICE AS PS 
  INNER JOIN PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP ON VP.procurement_service_id = PS.id
  INNER JOIN MASTER_SERVICE AS TS ON TS.service_id = PS.service_master_id
  INNER JOIN MASTER_SERVICE_CATEGARY AS S ON S.id = TS.service_category_id
  WHERE VP.purchase_request_id =${serviceData.purchase_request_id}
          AND VP.Rfp_Number= '${Rfp_no}'
          AND VP.vendors=${vendor_id}
          AND VP.procurement_type ='${type}'
          AND PS.status = 'Active'
          AND TS.status = 'Active';
      `,
    );

    const Obj = {
      ...valueData.dataValues,
      start_date: serviceData.start_date,
      end_date: serviceData.end_date,
      rfp_status: serviceData.rfp_status,
      procurement_serviceItem_requests: result[0],
    };

    if (Obj) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: Obj, serviceData });
    } else {
      return res.status(404).send({ code: 404, message: "Data Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.update_vendorData_for_service = async (req, res) => {
  try {
    const vendors = req.params.id;
    const rfp_number = req.body.rfp_number;
    const procurement_id = req.body.procurement_id;
    const product_details = req.body.product_details;
    if (!product_details) {
      return res
        .status(400)
        .json({ code: 400, message: "Product details are required" });
    }

    const all_Data2 = JSON.parse(product_details);

    const getData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
      where: {
        [Op.and]: [
          { vendors: vendors },
          { Rfp_Number: rfp_number },
          { purchase_request_id: procurement_id },
        ],
      },
    });

    if (getData.length > 0) {
      const updatePromises = [];
      for (let i = 0; i < all_Data2.length; i++) {
        const data = all_Data2[i];
        const pp_id = getData[i].procurement_service_id;

        const updateData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.update(
          {
            price_amt: data.price_amt,
            igst: data.igst,
            delivery_charges: data.delivery_charges,
            additional_charges: data.additional_charges,
            currency_id: data.currency_id,
            vendor_remarks: data.vendor_remarks,
            is_submitted: req.body.is_submitted,
            mvp: data.mvp,
          },
          {
            where: {
              procurement_service_id: pp_id,
              vendors: vendors,
              rfp_number: rfp_number,
            },
          },
        );

        const newData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
          where: {
            procurement_service_id: pp_id,
            vendors: vendors,
            rfp_number: rfp_number,
          },
        });

        if (newData[0].vendor_responded == "FALSE") {
          let vendor_responded_count = 0;
          for (let j = 0; j < newData.length; j++) {
            const sgst = newData[j].sgst;
            if (sgst != null) {
              vendor_responded_count++;
            }
          }

          await db.purchase_service.update(
            { vendors_responded_count: vendor_responded_count },
            {
              where: {
                purchase_request_id: procurement_id,
                id: pp_id,
              },
            },
          );
        }

        updatePromises.push(updateData);
      }

      await Promise.all(updatePromises);
      return res
        .status(200)
        .json({ code: 200, message: "Update Successfully" });
    } else {
      return res.status(403).json({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).json({ code: 500, message: "Server Error" });
  }
};

// Negotiations API

exports.get_ById_RFP_Renego_Vendors = async (req, res) => {
  try {
    const { procurementId } = req.body;

    if (!procurementId) {
      return res.status(400).send({ code: 400, message: "Bad Request" });
    }

    const nego_id_data = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findOne(
      {
        where: { purchase_request_id: procurementId },
        // attributes: ["negotiation_id"],
      },
    );

    console.log(
      nego_id_data,
      nego_id_data.negotiation_id,
      procurementId,
      "datanego",
    );

    let itemPRData = await db.sequelize.query(
      `SELECT DISTINCT 
        'Item' AS PR_category,
        PB.department_name,
        PB.quantity,
        PB.total_mvp,
        PB.item_master_id,
        PB.pr_category AS PB_PR_category,
        PB.item_categroy_id,
        PB.priority,
        PB.total_mvp AS PB_mvp,
        PB.item_master_id AS PB_item_id,
        PB.item_categroy_id AS PB_asset_category_id,
        vnd.vendors,
        vnd.re_negotiation,
        I.item_name,
        I.MVP AS I_MVP,
        I.item_code,
        vnd.item_id AS vnd_item_id,
        vm.vendor_name,
        P.*
    FROM 
        PROCUREMENT_PURCHASE_REQUEST AS P
    INNER JOIN 
        PROCUREMENT_PURCHASE_REQUEST_ITEM AS PB ON PB.purchase_request_id = P.id AND PB.PR_category = 'Item'
    INNER JOIN 
        MASTER_ITEM AS I ON I.id = PB.item_master_id
    INNER JOIN 
        PROCUREMENT_PURCHASE_NEGOTIATION_ITEM AS vnd ON vnd.purchase_request_id = P.id AND vnd.item_id = I.id
    INNER JOIN 
        VENDOR_BASIC_DETAILS AS vm ON vm.id = vnd.vendors 
    WHERE 
        P.id = ${procurementId}
        AND P.status = 'ACTIVE' 
        AND PB.status = 'ACTIVE' 
        AND I.status = 'ACTIVE';
    
      `,
    );

    let servicePRData = await db.sequelize.query(
      `SELECT DISTINCT 
        'Service' AS PR_category,
        PB.department_name,
        PB.total_mvp,
        PB.service_master_id ,
        PB.PR_category AS PB_PR_category,
        PB.priority,
        PB.total_mvp AS PB_mvp,
        PB.service_master_id  AS PB_item_id,
        vnd.vendors,
        vnd.re_negotiation,
        I.service_name ,
        I.MVP AS I_MVP,
        I.service_document ,
        I.service_code ,
        vnd.item_id AS vnd_item_id,
        vm.vendor_name,
        P.*
    FROM 
        PROCUREMENT_PURCHASE_REQUEST AS P
    INNER JOIN 
        PROCUREMENT_PR_REQUEST_SERVICE AS PB ON PB.purchase_request_id = P.id AND PB.PR_category = 'Service'
    INNER JOIN 
        MASTER_SERVICE AS I ON I.service_id  = PB.service_master_id 
    INNER JOIN 
        PROCUREMENT_PURCHASE_NEGOTIATION_ITEM AS vnd ON vnd.purchase_request_id = P.id AND vnd.service_id  = I.service_id
    INNER JOIN 
        VENDOR_BASIC_DETAILS AS vm ON vm.id = vnd.vendors 
    WHERE 
        P.id = ${procurementId}
        AND P.status = 'ACTIVE' 
        AND PB.status = 'ACTIVE' 
        AND I.status = 'ACTIVE';
      `,
    );

    // let bomPRData = await db.sequelize.query(
    //   `SELECT  DISTINCT 'BOM PR' AS PR_category,PB.product_name, PB.product_varient, PB.item_quantity, PB.mvp, PB.mvp_product,PB.PR_category, P.procurement_id,
    //   PB.product_quantity, PB.PR_category , PB.item_id , P.PR_code, P.PR_type, P.department,vpd.vendors, vpd.re_negotiation , I.item_code ,I.item_document ,vm.vendor_name, P.*
    //   FROM PROCUREMENT_PURCHASE_REQUESTs AS P
    //   INNER JOIN procurement_BomItem_requests AS PB ON PB.procurement_id = P.procurement_id AND PB.PR_category = 'BOM PR'
    //   INNER JOIN ItemMasters AS I ON I.id= PB.item_id
    //   INNER JOIN PROCUREMENT_PURCHASE_NEGOTIATION_ITEM  AS vpd ON vpd.procurement_id = P.procurement_id AND vpd.item_id=I.id
    //   INNER JOIN vendor_managements AS vm ON vm.vendor_management_id = vpd.vendors
    //   WHERE P.procurement_id=${procurementId} AND P.status= "ACTIVE" AND PB.status= "ACTIVE" AND I.status= "ACTIVE"
    // `
    // );

    const employeeIdData = await db.purchase_details.findOne({
      where: { id: procurementId },
    });

    if (!employeeIdData) {
      return res
        .status(404)
        .send({ code: 404, message: "Employee Record Not Found" });
    }

    const nameData = await db.user.findOne({
      where: { employee_id: employeeIdData.employee_id },
      attributes: ["first_name", "last_name"],
    });

    if (!nameData) {
      return res
        .status(404)
        .send({ code: 404, message: "User Record Not Found" });
    }

    const fullName = `${nameData.first_name} ${nameData.last_name}`;

    const filteredItemPRData = itemPRData[0].filter(
      (item) => item.re_negotiation == true,
    );
    const filteredServicePRData = servicePRData[0].filter(
      (item) => item.re_negotiation == true,
    );
    // const filteredBomPRData = bomPRData[0].filter(item => item.re_negotiation == true);
    console.log("========serviceData========>", filteredServicePRData);
    return res.status(200).send({
      code: 200,
      message: "success",
      itemPRData:
        filteredItemPRData.length > 0 ? filteredItemPRData : itemPRData[0],
      servicePRData:
        filteredServicePRData.length > 0
          ? filteredServicePRData
          : servicePRData[0],
      // bomPRData: filteredBomPRData.length > 0 ? filteredBomPRData : bomPRData[0],
      employeeName: fullName,
      nego_id: nego_id_data.negotiation_id,
      // itemPRData:itemPRData
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.sendMailForRenegotiation = async (req, res) => {
  try {
    const { id: procurement_id } = req.params;
    const {
      rfpNumber,
      start_date_nego,
      end_date_nego,
      is_submitted,
      nego_status,
      site_url,
      item_detail,
      Negotiation_Id,
      procurement_type,
      re_negotiation,
    } = req.body;

    if (!item_detail || item_detail.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Item details are missing",
      });
    }

    const sentVendors = new Set();
    const sentEmails = new Set();

    for (const item of item_detail) {
      const { item_id, list, target_amount } = item;

      if (!list || list.length === 0) {
        continue;
      }

      for (const vendor of list) {
        const vendorId = vendor.id;

        const uniqueKey = `${item_id}-${vendorId}`;

        if (sentVendors.has(uniqueKey)) {
          continue;
        }

        sentVendors.add(uniqueKey);

        const get_vendorData = await db.vendor_basic_details.findOne({
          where: { id: vendorId },
        });
        // const entity = await db.entityMaster.findOne({ where: { id: get_vendorData.entity_id } });
        // const smtpUsername = entity ? entity.smtp_server_address : process.env.DEFAULT_EMAIL_FROM;
        // console.log("smtpUsername---------------",smtpUsername)

        const getAllData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
          where: {
            [Op.and]: [
              { vendors: vendorId },
              { purchase_request_id: procurement_id },
              { item_id: item_id },
            ],
          },
        });

        await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.update(
          {
            target_amount: item.target_amount,
            start_date_nego: req.body.start_date_nego,
            end_date_nego: req.body.end_date_nego,
            is_submitted: req.body.is_submitted,
            nego_status: req.body.nego_status,
            re_negotiation: req.body.re_negotiation,
          },
          {
            where: {
              [Op.and]: [
                { vendors: vendorId },
                { purchase_request_id: procurement_id },
                { item_id: item_id },
              ],
            },
          },
        );

        await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.update(
          { nego_status: nego_status },
          {
            where: {
              [Op.and]: [
                { vendors: vendorId },
                { purchase_request_id: procurement_id },
                { item_id: item_id },
                { negotiation_id: Negotiation_Id },
              ],
            },
          },
        );
        sendMailRFP(
          site_url,
          vendorId,
          Negotiation_Id,
          procurement_id,
          procurement_type,
          re_negotiation,
          get_vendorData,
        );
      }
    }

    return res.status(200).json({
      code: 200,
      message: "Mail Sent Successfully",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).json({ code: 500, message: "Server Error" });
  }
};

exports.getVendrosDataByIdforRenegoItem = async (req, res) => {
  try {
    const All_id = req.params.id;
    const splitData = All_id.split(",");
    const nego_id = splitData[0];
    const re_negotiation = splitData[1];
    const vendors = splitData.slice(2);

    const booleanValue = re_negotiation === "true" || re_negotiation === true;

    const vendorData = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
      where: {
        negotiation_id: nego_id,
        vendors: vendors,
        re_negotiation: booleanValue,
      },
      attributes: ["purchase_request_id", "item_id"],
    });

    const proc_id = vendorData.map((data) => data.purchase_request_id);
    const item_id = vendorData.map((data) => data.item_id);

    const getAllData2 = await db.purchase_item.findAll({
      where: {
        [Op.and]: [
          { item_master_id: item_id },
          { purchase_request_id: proc_id },
        ],
      },
    });
    const procurementIds2 = getAllData2.map((data) => data.purchase_request_id);
    const getData3 = await db.purchase_details.findAll({
      where: { id: proc_id },
      include: [
        {
          model: db.purchase_item,
          where: {
            [Op.and]: [
              { item_master_id: item_id },
              { purchase_request_id: proc_id },
            ],
          },
          attributes: [
            "quantity",
            "priority",
            "total_mvp",
            "item_categroy_id",
            "item_master_id",
            "grand_total",
          ],
          include: {
            model: db.ItemMaster,
            where: { status: "Active" },
            attributes: ["item_code", "item_name", "MVP"], //"item_document",
            include: {
              model: db.asset,
              where: { status: "Active" },
              attributes: ["asset_category_name"],
            },
          },
        },
        {
          model: db.purchase_imgae,
        },
      ],
    });

    const VData = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
      where: {
        [Op.and]: [
          { vendors: vendors },
          { purchase_request_id: getData3[0].id },
          { negotiation_id: nego_id },
          { re_negotiation: booleanValue },
        ],
      },
    });

    const result = [...getData3, ...VData];
    return res.status(200).send({
      code: 200,
      message: "Fetch data successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.sendMailForNegotiation_service = async (req, res) => {
  try {
    const { id: procurement_id } = req.params;
    const {
      rfpNumber,
      start_date_nego,
      end_date_nego,
      site_url,
      vendors_invited_count,
      item_detail,
      nego_status,
      Negotiation_Id,
      procurement_type,
      entity_id,
      department_id,
      financial_year_id,
    } = req.body;

    if (!item_detail || item_detail.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Item details are missing",
      });
    }

    const sentVendors = new Set();

    for (const item of item_detail) {
      const { service_id, list, target_amount } = item;

      if (!list || list.length === 0) {
        continue;
      }

      for (const vendor of list) {
        const vendorId = vendor.id;

        const uniqueKey = `${service_id}-${vendorId}`;

        if (sentVendors.has(uniqueKey)) {
          continue;
        }

        sentVendors.add(uniqueKey);

        await db.PROCUREMENT_PURCHASE_VENDOR_RFP.update(
          {
            target_amount: target_amount,
            start_date_nego: start_date_nego,
            end_date_nego: end_date_nego,
          },
          {
            where: {
              vendors: vendorId,
              purchase_request_id: procurement_id,
              service_id: service_id,
            },
          },
        );

        const get_vendorData = await db.vendor_basic_details.findOne({
          where: { id: vendorId },
        });

        const getAllData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
          where: {
            vendors: vendorId,
            purchase_request_id: procurement_id,
            service_id: service_id,
          },
        });

        // Create negotiation detail and log for each vendor
        for (const data of getAllData) {
          const negotiationDetail = {
            ...data.dataValues,
            negotiation_id: Negotiation_Id,
            procurement_type: procurement_type,
            end_date_nego: end_date_nego,
            start_date_nego: start_date_nego,
            entity_id: entity_id,
            department_id: department_id,
            financial_year_id: financial_year_id,
          };
          if (negotiationDetail.hasOwnProperty("checked")) {
            negotiationDetail.checked = false;
          }

          await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.create(
            negotiationDetail,
          );
        }

        await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.update(
          {
            is_submitted: "FALSE",
          },
          {
            where: {
              vendors: vendorId,
              purchase_request_id: procurement_id,
              service_id: service_id,
            },
          },
        );
        sendRFPMailNegoService(
          site_url,
          vendorId,
          Negotiation_Id,
          procurement_id,
          get_vendorData,
          procurement_type,
        );
      }
    }

    await db.purchase_service.update(
      {
        nego_status: nego_status,
      },
      {
        where: {
          purchase_request_id: procurement_id,
        },
      },
    );

    return res.status(200).json({
      code: 200,
      message: "Mail Sent Successfully",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error in sendMailForNegotiation_service:", error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Failed to send mail" });
  }
};

exports.getVendor_replyData_for_service_Negotiation = async (req, res) => {
  try {
    const All_id = req.params.id;
    const splitData = All_id.split(",");
    const nego_id = splitData[0];
    const vendors = splitData.slice(1);

    const vendorData = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
      where: {
        negotiation_id: nego_id,
        vendors: vendors,
      },
      attributes: ["purchase_request_id", "service_id", "nego_status"],
    });

    const proc_id = vendorData.map((data) => data.purchase_request_id);
    const service_id = vendorData.map((data) => data.service_id);

    const getAllData2 = await db.purchase_service.findAll({
      where: {
        [Op.and]: [
          { service_master_id: service_id },
          { purchase_request_id: proc_id },
        ],
      },
    });
    const procurementIds2 = getAllData2.map((data) => data.purchase_request_id);
    const getData3 = await db.purchase_details.findAll({
      where: { id: proc_id },
      include: [
        {
          model: db.purchase_service,
          where: {
            [Op.and]: [
              { service_master_id: service_id },
              { purchase_request_id: proc_id },
            ],
          },
          attributes: [
            "department_name",
            "pr_category",
            "quantity",
            "priority",
            "total_mvp",
            "service_categroy_id",
            "purchase_request_id",
            "service_master_id",
          ],
          include: {
            model: db.Service_master,
            where: { status: "Active" },
            attributes: [
              "service_code",
              "service_name",
              "service_description",
              "service_document",
              "service_category_id",
              "service_id",
            ],
          },
        },
        {
          model: db.purchase_imgae,
        },
      ],
    });

    const VData = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
      where: {
        [Op.and]: [
          { vendors: vendors },
          { purchase_request_id: getData3[0].id },
          { negotiation_id: nego_id },
        ],
      },
    });

    const result = [...getData3, ...VData];
    return res.status(200).send({
      code: 200,
      message: "Fetch data successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.updateVendorsBidForService = async (req, res) => {
  try {
    const vIds = req.params.id;
    const procure_id = req.body.procure_id;
    const itemDetails = req.body.item_details;
    const is_submitted = req.body.is_submitted;

    for (const item of itemDetails) {
      const service_id = item.service_id;

      await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.update(
        {
          price_amt: item.price_amt,
          sgst: item.sgst,
          cgst: item.cgst,
          igst: item.igst,
          delivery_charges: item.delivery_charges,
          additional_charges: item.additional_charges,
          currency_id: item.currency_id,
          products_amount: item.totelAmount,
          is_submitted: req.body.is_submitted,
        },
        {
          where: {
            [Op.and]: [
              { vendors: vIds },
              { purchase_request_id: procure_id },
              { service_id: service_id },
            ],
          },
        },
      );
    }

    return res.status(200).send({
      code: 200,
      message: "Data Updated Successfully",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.sendMailForRenegotiation_service = async (req, res) => {
  try {
    const { id: procurement_id } = req.params;
    const {
      rfpNumber,
      start_date_nego,
      end_date_nego,
      is_submitted,
      nego_status,
      site_url,
      item_detail,
      Negotiation_Id,
      procurement_type,
      re_negotiation,
    } = req.body;

    if (!item_detail || item_detail.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Item details are missing",
      });
    }

    const sentEmails = new Set();

    for (const item of item_detail) {
      const { service_id, list, target_amount } = item;

      if (!list || list.length === 0) {
        continue;
      }

      for (const vendor of list) {
        const vendorId = vendor.id;
        const get_vendorData = await db.vendor_basic_details.findOne({
          where: { id: vendorId },
        });

        sendRFPMailRENegoService(
          site_url,
          vendorId,
          Negotiation_Id,
          procurement_id,
          procurement_type,
          re_negotiation,
          get_vendorData,
        );
        await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.update(
          {
            target_amount: target_amount,
            start_date_nego: start_date_nego,
            end_date_nego: end_date_nego,
            is_submitted: is_submitted,
            nego_status: nego_status,
            re_negotiation: re_negotiation,
          },
          {
            where: {
              vendors: vendorId,
              purchase_request_id: procurement_id,
              service_id: service_id,
            },
          },
        );
      }
    }

    return res.status(200).json({
      code: 200,
      message: "Mail Sent Successfully",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error in sendMailForRenegotiation_service:", error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Failed to send mail" });
  }
};

exports.getVendor_replyData_for_service_ReNegotiation = async (req, res) => {
  try {
    const All_id = req.params.id;
    const splitData = All_id.split(",");
    const nego_id = splitData[0];
    const re_negotiation = splitData[1];
    const vendors = splitData.slice(2);

    const booleanValue = re_negotiation === "true" || re_negotiation === true;

    const vendorData = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
      where: {
        negotiation_id: nego_id,
        vendors: vendors,
        re_negotiation: booleanValue,
      },
      attributes: ["purchase_request_id", "service_id"],
    });

    const proc_id = vendorData.map((data) => data.purchase_request_id);
    const service_id = vendorData.map((data) => data.service_id);

    const getAllData2 = await db.purchase_service.findAll({
      where: {
        [Op.and]: [
          { service_master_id: service_id },
          { purchase_request_id: proc_id },
        ],
      },
    });
    const procurementIds2 = getAllData2.map((data) => data.purchase_request_id);
    const getData3 = await db.purchase_details.findAll({
      where: { id: proc_id },
      include: [
        {
          model: db.purchase_service,
          where: {
            [Op.and]: [
              { service_master_id: service_id },
              { purchase_request_id: proc_id },
            ],
          },
          attributes: [
            "department_name",
            "pr_category",
            "quantity",
            "priority",
            "total_mvp",
            "service_categroy_id",
            "purchase_request_id",
            "service_master_id",
          ],
          include: {
            model: db.Service_master,
            where: { status: "Active" },
            attributes: [
              "service_code",
              "service_name",
              "service_description",
              "service_document",
              "service_category_id",
              "service_id",
            ],
          },
        },
        {
          model: db.purchase_imgae,
        },
      ],
    });

    const VData = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
      where: {
        [Op.and]: [
          { vendors: vendors },
          { purchase_request_id: getData3[0].id },
          { negotiation_id: nego_id },
          { re_negotiation: booleanValue },
        ],
      },
    });

    const result = [...getData3, ...VData];
    return res.status(200).send({
      code: 200,
      message: "Fetch data successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.update_endDate = async (req, res) => {
  try {
    const procurement_id = req.params.id;
    const { end_date, rfp_number } = req.body;

    const updateData2 = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.update(
      { rfp_end_date: end_date },
      {
        where: { purchase_request_id: procurement_id, rfp_number: rfp_number },
      },
    );

    const updateData1 = await db.purchase_details.update(
      { rfp_end_date: end_date },
      { where: { id: procurement_id } },
    );

    if (updateData2[0] || updateData1[0]) {
      return res
        .status(200)
        .send({ code: 200, message: "End Date Updated Successfully" });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getAllRfpList = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.body;

    const query = `
        SELECT VP.rfp_number, PR.id AS id, PR.pr_number, PR.pr_category, VP.rfp_status,
        VP.rfp_end_date AS end_date, VP.rfp_start_date AS start_date, MD.department_name,
        COUNT(DISTINCT VP.vendors) AS vendors_invited_count,
        COUNT(DISTINCT CASE WHEN VP.vendor_responded = 1 THEN VP.vendors END) AS vendors_responded_count
        FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VP.purchase_request_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        WHERE PR.entity_id = :entityId
        AND PR.financial_year_id = :financialYearId
        AND PR.status = 'ACTIVE'
        AND VP.rfp_number IS NOT NULL
        GROUP BY VP.rfp_number, PR.id, PR.pr_number, PR.pr_category, VP.rfp_status, VP.rfp_end_date, VP.rfp_start_date, MD.department_name
        ORDER BY PR.id DESC;
          `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData.length > 0) {
      return res.status(200).json({
        code: 200,
        message: "Data retrieved successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).json({ code: 404, message: "No records found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_sended_approval_data = async (req, res) => {
  try {
    const { entity_id, financial_year_id, login_employe_id } = req.body;
    const role_id = req.user.role_master_id;

    // Fixed and Improved Query:
    // 1. Migrated from old RFP_APPROVAL table to new VENDOR_QUOTATION (RAD).
    // 2. Used DISTINCT to prevent row explosion from multiple items or levels.
    // 3. Removed redundant joins with VPD (items) which were and causing data explosion.
    // 4. Correctly filters by 'sent' approvals using created_emp_id in the level table.
    const query = `
        SELECT DISTINCT 
          PR.id AS purchase_request_id, 
          PR.pr_number, 
          PR.rfp_start_date AS start_date, 
          PR.rfp_end_date AS end_date, 
          MD.department_name, 
          PR.department_id,
          RAD.id AS quotation_id, 
          RAD.quotation_for AS approval_for, 
          RAD.quotation_code,
          RAD.approval_status
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_QUOTATION AS RAD ON RAD.pr_id = PR.id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        INNER JOIN PROCUREMENT_PURCHASE_QUOTATION_APPROVAL_LEVEL AS L ON L.purchase_request_id = PR.id
        WHERE PR.entity_id = :entityId 
          AND PR.financial_year_id = :financialYearId
          AND PR.status = 'ACTIVE'
          ${role_id !== 1 ? "AND L.created_emp_id = :loginEmpId" : ""}
        ORDER BY PR.id DESC;
      `;

    const rfpdata = await db.sequelize.query(query, {
      replacements: {
        entityId: entity_id,
        financialYearId: financial_year_id,
        loginEmpId: login_employe_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (rfpdata && rfpdata.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Record Found!",
        data: rfpdata,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Record Found!",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error in get_sended_approval_data: ${error.message}`, {
      error,
    });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getAllDataForApprovalRFP = async (req, res) => {
  try {
    const procurement_id = req.params.id;
    const { rfp_number } = req.query;
    if (procurement_id) {
      const whereClause = {
        purchase_request_id: procurement_id,
      };
      if (rfp_number) {
        whereClause.rfp_number = rfp_number;
      }
      const data = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
        where: whereClause,
        attributes: [
          "vendors",
          "price_amt",
          "item_id",
          // "service_id",
          "confirm_date",
          "checked",
        ],
      });

      const vendorIds = [...new Set(data.map((entry) => entry.vendors))];
      const vendorDetails = await db.vendor_basic_details.findAll({
        where: {
          id: vendorIds,
        },
        attributes: ["id", "vendor_name"],
      });
      const vendorNameMap = vendorDetails.reduce((map, vendor) => {
        map[vendor.id] = vendor.vendor_name;
        return map;
      }, {});
      const itemIds = [...new Set(data.map((entry) => entry.item_id))];
      const productDetails = await db.ItemMaster.findAll({
        where: {
          id: itemIds,
        },
        attributes: ["id", "item_name"],
      });
      const itemDetailsMap = productDetails.reduce((map, item) => {
        map[item.id] = item.item_name;
        return map;
      }, {});
      // const serviceIds = [...new Set(data.map((entry) => entry.service_id))];
      // const serviceDetails = await db.Service_master.findAll({
      //   where: {
      //     service_id: serviceIds,
      //   },
      //   attributes: ["service_id", "service_name"],
      // });
      // const serviceDetailsMap = serviceDetails.reduce((map, service) => {
      //   map[service.service_id] = service.service_name;
      //   return map;
      // }, {});

      const groupedData = vendorIds.map((vendorId) => {
        const vendorItems = data
          .filter((entry) => entry.vendors === vendorId)
          .map((entry) => ({
            item_name: itemDetailsMap[entry.item_id],
            // service_name: serviceDetailsMap[entry.service_id],
            price_amt: entry.price_amt,
            item_id: entry.item_id,
            // service_id: entry.service_id,
            checked: entry.checked,
            confirm_date: entry.confirm_date,
          }));
        return {
          vendor_id: vendorId,
          vendor_name: vendorNameMap[vendorId],
          items: vendorItems,
        };
      });
      return res.status(200).send({
        code: 200,
        message: "Fetched Successfully!",
        data: groupedData,
      });
    } else {
      return res.status(403).send({
        code: 403,
        message: "No Record Found !",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.generate_Rfp_Approval_Id = async (req, res) => {
  try {
    let result = await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
      attributes: ["id", "quotation_code"],
      order: [["createdAt", "DESC"]],
    });

    let Rfp_id;
    if (result && result.quotation_code) {
      const parts = result.quotation_code.split("-");
      const lastNumber = parseInt(parts[parts.length - 1]);
      Rfp_id = `RFP-Approval-${isNaN(lastNumber) ? result.id + 1 : lastNumber + 1}`;
    } else if (result) {
      Rfp_id = `RFP-Approval-${result.id + 1}`;
    } else {
      Rfp_id = "RFP-Approval-1";
    }

    return res.status(200).send({
      code: 200,
      message: "Unique RFP-Approval Id has been Generated",
      data: Rfp_id,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.Create_Approval_Data_For_RFP = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      purchase_request_id,
      approval_code,
      items_data,
      service_data,
      department_id,
      approval_for,
      entity_id,
      remarks_approval,
      rfp_number,
    } = req.body;

    // ─── Input Validation ────────────────────────────────────────────
    if (!purchase_request_id) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Purchase Request Id is required!" });
    }

    if (!approval_code) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Approval Code is required!" });
    }

    if (!department_id) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Department Id is required!" });
    }

    if (!approval_for) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Approval For is required!" });
    }

    if (!items_data?.length && !service_data?.length) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Items or Service data is required!" });
    }

    // ─── Department Validation ───────────────────────────────────────
    const departmentInfo = await db.department.findOne({
      where: {
        dept_id: department_id,
        isDeleted: false,
        status: "ACTIVE",
      },
      attributes: ["dept_id", "department_name"],
      transaction,
    });

    if (!departmentInfo) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ code: 404, message: "Department not found!" });
    }

    // ─── Workflow Validation ─────────────────────────────────────────

    const workflow = await db.WorkFlow_Master.findOne({
      where: {
        department_id: departmentInfo.dept_id,
        job_name: "Purchase",
      },
      attributes: ["id"],
      transaction,
    });

    if (!workflow) {
      await transaction.rollback();
      return res.status(404).json({
        code: 404,
        message: "Workflow is not created for required department!",
      });
    }

    // ─── Check for Duplicate Approvals ───────────────────────────────
    const existingQuotation =
      await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findAll({
        where: {
          quotation_code: approval_code,
        },
        attributes: ["pr_id", "quotation_code"],
        transaction,
      });

    if (existingQuotation.length > 0) {
      await transaction.rollback();
      return res.status(409).json({
        code: 409,
        message: "Approval for This Code already exists!",
        existingQuotation: existingQuotation.map((p) => p.quotation_code),
      });
    }

    // ─── Fetch Workflow Role & Levels (once, outside the loop) ───────
    const workflowRole = await db.WorkFlow_Map.findOne({
      where: { workflow_id: workflow.id },
      attributes: ["role_id", "employee_id", "workflow_id"],
      transaction,
    });

    if (!workflowRole) {
      await transaction.rollback();
      return res.status(404).json({
        code: 404,
        message: "Role not found for the workflow!",
      });
    }

    const workflowLevels = await db.Work_Flow_range.findAll({
      where: { workflow_id: workflowRole.workflow_id, status: "ACTIVE" },
      attributes: ["level", "employee_id", "status", "id"],
      transaction,
    });

    if (!workflowLevels.length) {
      await transaction.rollback();
      return res.status(404).json({
        code: 404,
        message: "No active workflow levels found!",
      });
    }

    // ─── Collect Checked Items for Bulk Operations ───────────────────

    const vendorUpdatePromises = [];

    const processCheckedItems = async (data) => {
      for (const vendorData of data) {
        const { vendor_id, items } = vendorData;

        for (const item of items) {
          if (!item.checked) continue;
          // Queue vendor product & negotiation detail updates
          if (approval_for === "Negotiation") {
            const negotiationData =
              await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.findOne({
                where: {
                  purchase_request_id,
                  ...(rfp_number ? { rfp_number } : {}),
                },
                transaction,
              });

            if (negotiationData) {
              await negotiationData.update(
                {
                  approval_status: "APPROVED",
                  remarks_approval: remarks_approval,
                },
                { transaction },
              );

              let quotationData =
                await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
                  where: {
                    pr_id: purchase_request_id,
                    negotiation_id: negotiationData.id,
                  },
                  transaction,
                });

              if (!quotationData) {
                quotationData =
                  await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.create(
                    {
                      pr_id: purchase_request_id,
                      negotiation_id: negotiationData.id,
                      quotation_for: "Negotiation",
                      quotation_code: approval_code,
                      rfp_number: rfp_number || negotiationData.rfp_number,
                    },
                    { transaction },
                  );
              }
              if (quotationData) {
                const negotiationItem =
                  await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findOne({
                    where: {
                      negotiation_id: negotiationData.id,
                      item_id: item.item_id,
                      vendor_id: vendor_id,
                      // service_id: item.service_id || null,
                    },
                    transaction,
                  });
                await db.PROCUREMENT_PURCHASE_QUOTATION_ITEM.create(
                  {
                    purchase_request_id: purchase_request_id,
                    negotiation_item_id: negotiationItem.id,
                    quotation_id: quotationData.id,
                    item_id: negotiationItem.item_id,
                    vendor_id: negotiationItem.vendor_id,
                    // service_id: negotiationItem.service_id || null,
                    price_amt: negotiationItem.price_amt,
                    sgst: negotiationItem.sgst,
                    cgst: negotiationItem.cgst,
                    igst: negotiationItem.igst,
                    delivery_charges: negotiationItem.delivery_charges,
                    additional_charges: negotiationItem.additional_charges,
                  },
                  { transaction },
                );
              }

              vendorUpdatePromises.push(
                db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.update(
                  { checked: item.checked },
                  {
                    where: {
                      negotiation_id: negotiationData.id,
                      item_id: item.item_id,
                      vendor_id: vendor_id,
                      // service_id: item.service_id || null,
                    },
                    transaction,
                  },
                ),
              );
            }
          } else {
            vendorUpdatePromises.push(
              db.PROCUREMENT_PURCHASE_VENDOR_RFP.update(
                { checked: item.checked, remarks_approvel: remarks_approval },
                {
                  where: {
                    purchase_request_id,
                    item_id: item.item_id,
                    vendors: vendor_id,
                    // service_id: item.service_id || null,
                    ...(rfp_number ? { rfp_number } : {}),
                  },
                  transaction,
                },
              ),
            );

            let quotationData =
              await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
                where: {
                  pr_id: purchase_request_id,
                  quotation_code: approval_code,
                },
                transaction,
              });

            if (!quotationData) {
              quotationData =
                await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.create(
                  {
                    pr_id: purchase_request_id,
                    quotation_for: "RFP",
                    quotation_code: approval_code,
                    rfp_number: rfp_number,
                  },
                  { transaction },
                );
            }

            if (quotationData) {
              const rfpItem = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findOne({
                where: {
                  purchase_request_id: purchase_request_id,
                  item_id: item.item_id,
                  vendors: vendor_id,
                  // service_id: item.service_id || null,
                  ...(rfp_number ? { rfp_number } : {}),
                },
                transaction,
              });
              await db.PROCUREMENT_PURCHASE_QUOTATION_ITEM.create(
                {
                  purchase_request_id: purchase_request_id,
                  rfp_item_id: rfpItem.id,
                  quotation_id: quotationData.id,
                  item_id: rfpItem.item_id,
                  vendor_id: rfpItem.vendors,
                  // service_id: rfpItem.service_id || null,
                  price_amt: rfpItem.price_amt,
                  sgst: rfpItem.sgst,
                  cgst: rfpItem.cgst,
                  igst: rfpItem.igst,
                  delivery_charges: rfpItem.delivery_charges,
                  additional_charges: rfpItem.additional_charges,
                },
                { transaction },
              );
            }
          }
        }
      }
    };

    if (items_data?.length) await processCheckedItems(items_data);
    if (service_data?.length) await processCheckedItems(service_data);

    // ─── Execute All Remaining Vendor Updates in Parallel ───────────
    const vendorUpdateResults = await Promise.all(vendorUpdatePromises);

    const quotationDataFinal =
      await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
        where: {
          pr_id: purchase_request_id,
          quotation_code: approval_code,
        },
        transaction,
      });

    if (!quotationDataFinal) {
      await transaction.rollback();
      return res.status(400).json({
        code: 400,
        message: "No checked items found to create approval!",
      });
    }

    // ─── Build Level Approval Data (deduplicated via Map) ────────────
    const levelDetailsMap = new Map();

    for (const level of workflowLevels) {
      const key = `${level.level}-${purchase_request_id}-${level.employee_id}-${level.id}`;
      if (!levelDetailsMap.has(key)) {
        levelDetailsMap.set(key, {
          level: level.level,
          purchase_request_id,
          employee_id: level.employee_id,
          workflow_range_id: level.id,
          approval_for: approval_for,
          created_emp_id: req.user.employee_id,
          department_id,
          entity_id,
          quotation_id: quotationDataFinal.id,
        });
      }
    }

    const uniqueLevelDetails = Array.from(levelDetailsMap.values());

    if (uniqueLevelDetails.length) {
      await db.quotationApprovalLevel.bulkCreate(uniqueLevelDetails, {
        transaction,
      });
    }

    // ─── Update Purchase Request Negotiation Status ──────────────────
    await db.purchase_details.update(
      { nego_status: "CLOSE NEGO" },
      { where: { id: purchase_request_id }, transaction },
    );

    // ─── Commit Transaction ──────────────────────────────────────────
    await transaction.commit();

    return res.status(200).json({
      code: 200,
      message: "Entries created successfully!",
      data: uniqueLevelDetails,
    });
  } catch (error) {
    // ─── Rollback on Any Error ───────────────────────────────────────
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    logger.error(`Error in Create_Approval_Data_For_RFP: ${error.message}`, {
      error,
    });
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
      details: error.message,
    });
  }
};

exports.getAll_Levels_List = async (req, res) => {
  try {
    const purchase_request_id = req.params.id;
    const { approval_for } = req.body;

    const getData = await db.quotationApprovalLevel.findAll({
      where: {
        purchase_request_id: purchase_request_id,
        approval_for: approval_for,
      },
      attributes: [
        "approval_status",
        "level",
        "employee_id",
        "department_id",
        "approval_for",
      ],
    });

    if (!getData || getData.length === 0) {
      return res.status(400).send({ code: 400, message: "Data not found" });
    }

    const levelsWithNames = [];
    for (const levelInfo of getData) {
      const employeeInfo = await db.user.findOne({
        where: {
          employee_id: levelInfo.employee_id,
        },
        attributes: ["first_name", "last_name"],
      });

      if (!employeeInfo) {
        return res.status(400).send({
          code: 400,
          message: "User not found for level " + levelInfo.level,
        });
      }

      const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
      const levelWithName = {
        level: levelInfo.level,
        name: fullName,
        status: levelInfo.approval_status,
        renego: levelInfo.approval_for,
        // re_nago: adjustedApprovalFor
      };
      levelsWithNames.push(levelWithName);
    }

    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully!",
      data: levelsWithNames,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_By_Id_Approval_Data = async (req, res) => {
  try {
    const procurement_id = req.params.id;
    const { rfp_approval_id, nego_approval_id, re_nego_approval_id } =
      req.query;

    let query = `
        SELECT RAD.id, RAD.department_id, RAD.rfp_approval_id, RAD.login_employe_id, 
        RAD.createdAt, RAD.updatedAt, RAD.item_id, RAD.purchase_request_id, RAD.vendors_id, 
        RAD.approval_for, VPD.price_amt, VPD.checked
        FROM PROCUREMENT_PURCHASE_RFP_APPROVAL AS RAD
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VPD
        ON VPD.procurement_product_id = RAD.purchase_request_id
        WHERE RAD.purchase_request_id = :procurement_id
        AND VPD.checked = true
      `;

    const replacements = { procurement_id };

    if (rfp_approval_id) {
      query += ` AND RAD.rfp_approval_id = :rfp_approval_id`;
      replacements.rfp_approval_id = rfp_approval_id;
    }
    if (nego_approval_id) {
      query += ` AND RAD.nego_approval_id = :nego_approval_id`;
      replacements.nego_approval_id = nego_approval_id;
    }
    if (re_nego_approval_id) {
      query += ` AND RAD.re_nego_approval_id = :re_nego_approval_id`;
      replacements.re_nego_approval_id = re_nego_approval_id;
    }

    const data = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (data.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No records found matching the criteria.",
        data: [],
      });
    }

    const vendorIds = data.map((item) => item.vendors_id).flat();
    const itemIds = data.map((item) => item.item_id).flat();
    // const serviceIds = data.map((item) => item.service_id).flat();

    const [vendorDetails, itemDetails, serviceDetails] = await Promise.all([
      db.vendor_basic_details.findAll({
        where: {
          id: vendorIds,
        },
        attributes: ["id", "vendor_name"],
      }),
      db.ItemMaster.findAll({
        where: {
          id: itemIds,
        },
        attributes: ["id", "item_name"],
      }),
      // db.Service_master.findAll({
      //   where: {
      //     service_id: serviceIds,
      //   },
      //   attributes: ["service_id", "service_name"],
      // }),
    ]);

    const vendorNameMap = {};
    vendorDetails.forEach((vendor) => {
      vendorNameMap[vendor.id] = vendor.vendor_name;
    });

    const itemNameMap = {};
    itemDetails.forEach((item) => {
      itemNameMap[item.id] = item.item_name;
    });

    // const serviceNameMap = {};
    // serviceDetails.forEach((service) => {
    //   serviceNameMap[service.service_id] = service.service_name;
    // });

    const itemPriceMap = {};
    const itemrenego = {};
    data.forEach((item) => {
      itemPriceMap[item.id] = item.price_amt;
      itemrenego[item.id] = item.approval_for;
    });

    const uniqueItemsMap = new Map();

    data.forEach((item) => {
      const vendorId = item.vendors_id;
      const itemId = item.item_id;
      // const serviceId = item.service_id;

      const uniqueKey = `${vendorId}-${itemId}-${serviceId}`;

      if (!uniqueItemsMap.has(uniqueKey)) {
        uniqueItemsMap.set(uniqueKey, {
          vendor_id: vendorId,
          vendor_name: vendorNameMap[vendorId],
          item_id: itemId,
          item_name: itemNameMap[itemId],
          // service_id: serviceId,
          // service_name: serviceNameMap[serviceId] || null,
          price_amt: itemPriceMap[item.id],
          reneg: itemrenego[item.id],
        });
      }
    });

    const responseData = Array.from(uniqueItemsMap.values()).reduce(
      (acc, item) => {
        const vendorId = item.vendor_id;

        const existingVendor = acc.find(
          (vendor) => vendor.vendor_id === vendorId,
        );
        if (existingVendor) {
          existingVendor.items.push({
            item_id: item.item_id,
            item_name: item.item_name,
            // service_id: item.service_id,
            // service_name: item.service_name,
            price_amt: item.price_amt,
            reneg: item.reneg,
          });
        } else {
          acc.push({
            vendor_id: vendorId,
            vendor_name: item.vendor_name,
            items: [
              {
                item_id: item.item_id,
                item_name: item.item_name,
                // service_id: item.service_id,
                service_name: item.service_name,
                price_amt: item.price_amt,
                reneg: item.reneg,
              },
            ],
          });
        }

        return acc;
      },
      [],
    );

    return res.send({
      code: 200,
      message: "Record Found!",
      data: responseData,
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getVendorQuotationById = async (req, res) => {
  try {
    const id = req.params.id;
    const { vendor_id, quotation_id } = req.query;

    const prData = await db.sequelize.query(
      `
        SELECT DISTINCT 
          PR.id, PR.pr_category, PR.pr_date, PR.pr_number, PR.pr_type AS po_type, PR.total_purchase, 
          PR.remark, PR.entity_id, PR.financial_year_id, PR.cost_center_id, PR.department_id, 
          EM.entity_name, MD.department_name, FY.financial_year, FC.cost_center_name, FC.cost_center_code,
          HRM.employee_code, HRM.first_name, HRM.last_name, HRM.employee_id, PR.warehouse_id, VBD.vendor_name, VBD.payment_term_id
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR 
        JOIN ENTITY_MASTER AS EM ON EM.id = PR.entity_id
        JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        JOIN VENDOR_BASIC_DETAILS AS VBD ON VBD.id = :vendor_id
        JOIN MASTER_FINANCIAL_YEAR AS FY ON FY.id = PR.financial_year_id
        JOIN FINANCE_COST_CENTER AS FC ON FC.id = PR.cost_center_id
        JOIN HRMS_REGISTERED_USER AS HRM ON HRM.employee_id = PR.employee_id
        WHERE PR.id = :id
      `,
      {
        replacements: { id, vendor_id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    const approvalData = await db.sequelize.query(
      `
        SELECT DISTINCT 
          PRA.id, PRA.level, PRA.approval_status, PRA.progress_status, PRA.purchase_request_id, PRA.employee_id, PRA.department_id, PRA.workflow_range_id
        FROM PROCUREMENT_PURCHASE_QUOTATION_APPROVAL_LEVEL AS PRA 
        WHERE PRA.purchase_request_id = :id
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    const data_image = await db.sequelize.query(
      `
        SELECT DISTINCT 
          PM.id, PM.uploade_image, PM.purchase_details_id
        FROM PROCUREMENT_PURCHASE_REQUEST_IMAGE AS PM
        WHERE PM.purchase_details_id = :id
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    const itemData = await db.sequelize.query(
      `
      SELECT 
      qi.price_amt AS unit_price,
      pi.quantity,
      qi.vendor_id,
      im.item_name,
      im.item_code,
      im.MVP,
      im.MRP,
      im.manage_by,
      im.uom_id,
      im.description,
      MAX(img.image) AS image,
      MAX(img.id) AS image_id,
      HSC.hsn_sac_code,
      im.item_name,
      GRM.value AS total_igst,
      a.asset_category_name,
      im.id AS item_master_id
    FROM PROCUREMENT_PURCHASE_QUOTATION_ITEM qi
    INNER JOIN PROCUREMENT_PURCHASE_REQUEST pr 
      ON pr.id = qi.purchase_request_id
    INNER JOIN PROCUREMENT_PURCHASE_REQUEST_ITEM pi 
      ON pi.purchase_request_id = pr.id AND pi.item_master_id = qi.item_id
    JOIN MASTER_ITEM im 
      ON im.id = qi.item_id
    LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT img 
      ON img.item_id = im.id
    LEFT JOIN MASTER_ASSET a 
      ON a.id = im.asset_id
    LEFT JOIN MASTER_HSN_SAC_CODE HSC 
      ON HSC.id = im.hsn_code_id
    LEFT JOIN GST_RATE_MASTER GRM
      ON GRM.id = HSC.gst_rate_id
    LEFT JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR pv 
      ON pv.Purchase_req_item_id = qi.id
    LEFT JOIN PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM VPD
      ON VPD.purchase_request_id = :pr_id
    WHERE qi.purchase_request_id = :pr_id AND qi.vendor_id = :vendor_id AND qi.quotation_id = :quotation_id

    GROUP BY qi.id,
  				pi.quantity
    ORDER BY qi.id ASC
  `,
      {
        replacements: { pr_id: id, vendor_id, quotation_id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    if (prData && prData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data fetched successfully!",
        data: {
          ...prData[0],
          vendor_id: vendor_id || null,
          approvalData,
          itemData,
          data_image,
        },
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Data Not Found",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  }
};

/* Approved Vendor Quotation Start */
exports.approve_levels_rfp = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const pr_id = req.params.id;
    const {
      approval_status,
      progress_status,
      employee_id,
      final_approval_status,
      workflow_type,
      remark,
      rfp_approval_id,
    } = req.body;

    if (progress_status && progress_status.length > 20) {
      await transaction.rollback();
      return res.status(400).send({
        code: 400,
        message: "Progress Status value is too long.",
      });
    }

    // 1. Fetch Quotation and Level Data
    const quoteWhere = { pr_id };
    if (rfp_approval_id) {
      quoteWhere.quotation_code = rfp_approval_id;
    }
    const quotationData =
      await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
        where: quoteWhere,
        transaction,
      });

    if (!quotationData) {
      await transaction.rollback();
      return res.status(404).send({
        code: 404,
        message: "Quotation Data not found!",
      });
    }

    const currentLevelData = await db.quotationApprovalLevel.findOne({
      attributes: ["level"],
      where: {
        employee_id,
        purchase_request_id: pr_id,
        approval_for: quotationData.quotation_for,
        quotation_id: quotationData.id,
      },
      transaction,
    });

    if (!currentLevelData) {
      await transaction.rollback();
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }

    const currentLevelValue = currentLevelData.level;

    // 2. Update status for the current level
    await db.quotationApprovalLevel.update(
      { approval_status, progress_status },
      {
        where: {
          employee_id,
          purchase_request_id: pr_id,
          approval_for: workflow_type,
          quotation_id: quotationData.id,
        },
        transaction,
      },
    );

    // 3. Handle Rejection
    if (approval_status === "REJECTED") {
      // Mark all levels for this PR as Rejected
      await db.quotationApprovalLevel.update(
        { approval_status: "REJECTED" },
        {
          where: {
            purchase_request_id: pr_id,
            approval_for: workflow_type,
          },
          transaction,
        },
      );

      if (final_approval_status === "REJECTED") {
        await Promise.all([
          db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.update(
            { approval_status: "REJECTED", remarks_approval: remark },
            { where: { pr_id }, transaction },
          ),
          db.purchase_item.update(
            { rfp_approvel_status: "REJECTED" },
            { where: { purchase_request_id: pr_id }, transaction },
          ),
          db.purchase_service.update(
            { rfp_approvel_status: "REJECTED" },
            { where: { purchase_request_id: pr_id }, transaction },
          ),
        ]);

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: "Purchase Request Rejected Successfully!",
        });
      }
    }
    // 4. Handle Approval
    else if (approval_status === "APPROVED") {
      const maxLevel = await db.quotationApprovalLevel.max("level", {
        where: { purchase_request_id: pr_id, approval_for: workflow_type },
        transaction,
      });

      if (currentLevelValue === maxLevel) {
        const updateTasks = [
          db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.update(
            {
              approval_status: final_approval_status,
              remarks_approval: remark,
            },
            { where: { pr_id }, transaction },
          ),
        ];

        await Promise.all(updateTasks);
      }
    }

    await transaction.commit();
    return res.status(200).send({
      code: 200,
      message: "Update Processed Successfully!",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error(`Error in approve_levels_rfp: ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
/* Approved Vendor Quotation End */

/* Get Approved Approvals Quotation Start */
exports.get_Approved_Approvals_rfp = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.body;
    const employee_id = req.params.id;

    const query = `
        SELECT DISTINCT
          pp.purchase_request_id,
          pp.quotation_id, 
          pp.approval_status AS level_approval_status, 
          pp.progress_status, 
          pp.status, 
          pp.approval_for,
          pr.pr_number,
          pr.pr_category,
          pr.rfp_start_date AS start_date, 
          pr.rfp_end_date AS end_date,
          pr.department_id,
          rad.quotation_code,
          rad.approval_status,
          rad.pr_id,
          MD.department_name
        FROM PROCUREMENT_PURCHASE_QUOTATION_APPROVAL_LEVEL AS pp 
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS pr ON pr.id = pp.purchase_request_id
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_QUOTATION AS rad ON rad.id = pp.quotation_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = pr.department_id
        WHERE (pp.employee_id = :employeeId OR pp.created_emp_id = :employeeId)
          AND pp.approval_status = 'APPROVED'
          AND rad.approval_status = 'APPROVED'
          AND pr.entity_id = :entityId
          AND pr.financial_year_id = :financialYearId
          AND pr.status = 'ACTIVE'
        ORDER BY pp.purchase_request_id DESC;
    `;

    const approvedData = await db.sequelize.query(query, {
      replacements: {
        employeeId: employee_id,
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (approvedData && approvedData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Approved Approvals Successfully!",
        data: approvedData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Approved Approvals Found for This Employee!",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error in get_Approved_Approvals_rfp: ${error.message}`, {
      error,
    });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.get_Rejected_Approvals_rfp = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.body;
    const employee_id = req.params.id;

    // Use DISTINCT in SQL to handle uniqueness efficiently
    const query = `
        SELECT DISTINCT
          pp.purchase_request_id,
          pp.approval_status AS level_approval_status, 
          pp.progress_status, 
          pp.status, 
          pp.approval_for,
          pr.pr_number,
          pr.rfp_start_date AS start_date, 
          pr.rfp_end_date AS end_date, 
          rad.quotation_code, 
          rad.approval_status,
          rad.pr_id,
          MD.department_name
        FROM PROCUREMENT_PURCHASE_QUOTATION_APPROVAL_LEVEL AS pp
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS pr ON pr.id = pp.purchase_request_id
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_QUOTATION AS rad ON rad.id = pp.quotation_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = pr.department_id
        WHERE pp.employee_id = :employeeId
          AND pp.approval_status = 'REJECTED'
          AND rad.approval_status = 'REJECTED'
          AND pr.entity_id = :entityId
          AND pr.financial_year_id = :financialYearId
          AND pr.status = 'ACTIVE'
        ORDER BY pp.purchase_request_id DESC;
    `;

    const rejectedData = await db.sequelize.query(query, {
      replacements: {
        employeeId: employee_id,
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (rejectedData && rejectedData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Rejected Approvals Successfully!",
        data: rejectedData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Rejected Approvals Found for This Employee!",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error in get_Rejected_Approvals_rfp: ${error.message}`, {
      error,
    });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getRFPNegoQuotationDetails = async (req, res) => {
  try {
    const pr_id = req.params.id;
    const { rfp_approval_id } = req.query;

    const whereClause = { pr_id };
    if (rfp_approval_id) {
      whereClause.quotation_code = rfp_approval_id;
    }

    // 1. Fetch initial quotation data
    const quotationData =
      await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
        where: whereClause,
        attributes: [
          "id",
          "quotation_for",
          "negotiation_id",
          "pr_id",
          "quotation_code",
          "approval_status",
          "remarks_approval",
          "rfp_number",
        ],
      });

    if (!quotationData) {
      return res.status(404).send({
        code: 404,
        message: "No Quotation Data Found for This PR!",
        data: [],
      });
    }

    let rawItems = await db.PROCUREMENT_PURCHASE_QUOTATION_ITEM.findAll({
      where: {
        purchase_request_id: pr_id,
        quotation_id: quotationData.id,
      },
      attributes: ["vendor_id", "price_amt", "item_id"],
      include: [
        {
          model: db.PROCUREMENT_PURCHASE_VENDOR_RFP,
          attributes: ["confirm_date", "vendors"],
        },
      ],
    });

    if (!rawItems.length) {
      return res.status(200).send({
        code: 200,
        message: "No items found for this quotation.",
        data: [],
      });
    }

    // 3. Collect unique IDs for metadata fetching
    const vendorIds = [...new Set(rawItems.map((i) => i.vendor_id))];
    const itemIds = [...new Set(rawItems.map((i) => i.item_id))];
    // const serviceIds = [
    //   ...new Set(rawItems.map((i) => i.service_id).filter(Boolean)),
    // ];

    // 4. Fetch all metadata in parallel
    const [vendors, products, services] = await Promise.all([
      db.vendor_basic_details.findAll({
        where: { id: vendorIds },
        attributes: ["id", "vendor_name"],
      }),
      db.ItemMaster.findAll({
        where: { id: itemIds },
        attributes: ["id", "item_name"],
      }),
      // db.Service_master.findAll({
      //   where: { service_id: serviceIds },
      //   attributes: ["service_id", "service_name"],
      // }),
    ]);

    // 5. Create maps for O(1) lookup
    const vendorMap = new Map(vendors.map((v) => [v.id, v.vendor_name]));
    const itemMap = new Map(products.map((i) => [i.id, i.item_name]));
    // const serviceMap = new Map(
    //   services.map((s) => [s.service_id, s.service_name]),
    // );

    // 6. Efficient single-pass grouping
    const groupedDataMap = new Map();

    for (const item of rawItems) {
      const vId = item.vendor_id;

      if (!groupedDataMap.has(vId)) {
        groupedDataMap.set(vId, {
          vendor_id: vId,
          vendor_name: vendorMap.get(vId) || "Unknown Vendor",
          items: [],
        });
      }

      groupedDataMap.get(vId).items.push({
        item_name: itemMap.get(item.item_id) || "Unknown Item",
        // service_name: serviceMap.get(item.service_id) || null,
        price_amt: item.price_amt,
        item_id: item.item_id,
        // service_id: item.service_id,
        checked: item.checked,
        confirm_date: item.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM?.confirm_date,
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Fetched Successfully!",
      data: Array.from(groupedDataMap.values()),
      quotationData,
    });
  } catch (error) {
    logger.error(`Error in getRFPNegoQuotationDetails: ${error.message}`, {
      error,
    });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getAllRfpListForVendor = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    const query = `
        SELECT DISTINCT VP.rfp_number, PR.id AS id, PR.pr_number, PR.pr_category, VP.rfp_status,
        VP.rfp_end_date AS end_date, VP.rfp_start_date AS start_date, MD.department_name
        FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VP.purchase_request_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        WHERE VP.vendors = :vendor_id
        AND PR.status = 'ACTIVE' AND VP.rfp_number IS NOT NULL AND VP.rfp_number <> ''
        ORDER BY PR.id DESC;
        `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        vendor_id: vendor_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData.length > 0) {
      return res.status(200).json({
        code: 200,
        message: "Data retrieved successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).json({ code: 404, message: "No records found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllNegotiationListForVendor = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    const query = `
        SELECT DISTINCT VN.*, PR.pr_category
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR AS PV ON PV.Purchase_req_id = PR.id
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VN ON VN.purchase_request_id = PR.id
        WHERE PV.vendor_id = :vendor_id
        AND PR.status = 'ACTIVE'
        ORDER BY PR.id DESC;
        `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        vendor_id: vendor_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData.length > 0) {
      return res.status(200).json({
        code: 200,
        message: "Data retrieved successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).json({ code: 404, message: "No records found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Server Error" });
  }
};
