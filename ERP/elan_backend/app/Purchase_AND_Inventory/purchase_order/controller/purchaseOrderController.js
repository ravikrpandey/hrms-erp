const db = require("../../../models/index");
const { sendMailPO } = require("../../../Recruitment/utils/mail/mail");
const { generatePOPDF } = require("../../../CRM/utils/mail/mail");
const logger = require("../../../../logger/index");
const path = require("path");
const mailQueue = require("../../../CRM/utils/mail/mailQueue");
const { encrypt, decrypt } = require("../../../utils/crypto");
const { QueryTypes, Op } = require("sequelize");
const { generatePDF } = require("../../../../app/common/pdfConverter");

const fs = require("fs");
const moment = require("moment");
exports.getAllLocation = async (req, res) => {
  try {
    const query = await db.sequelize.query(
      `SELECT T.id, T.branch_name, T.branch_code, T.branch_contact_person_name, T.branch_contact_no,
         T.branch_email, T.branch_alt_email, T.branch_pin_code, T.branch_address, 
        T.status AS branch_status,T.billing_status,
        T.branch_gstnumber
        FROM MASTER_BRANCH AS T
        WHERE T.billing_status = 1
        ORDER BY T.id DESC`,
    );
    if (query.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Branch Details found", data: query[0] });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Branch Details found for the given user_id and entity_id",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllCostCenterbyDep = async (req, res) => {
  try {
    const { dept_id } = req.params;
    const { entity_id, financial_year_id } = req.query;

    const [query] = await db.sequelize.query(
      `SELECT  D.dept_id, D.department_name, D.department_code, D.cc_code, D.employee_id, D.role_master_id, D.entity_id,
            FC.cost_center_name, FC.cost_center_code, FC.remainingAmount, FC.amount, FC.cost_center_type,
            FC.financial_year_id, FC.department_id, FC.region_id, FC.id, FC.status
             FROM MASTER_DEPARTMENT AS D
             INNER JOIN FINANCE_COST_CENTER AS FC ON FC.department_id = D.dept_id
             INNER JOIN ENTITY_MASTER AS E ON E.id = D.entity_id
             INNER JOIN MASTER_FINANCIAL_YEAR AS Y ON Y.id = FC.financial_year_id
             WHERE D.dept_id = ${dept_id} AND D.entity_id = ${entity_id}
              AND FC.financial_year_id = ${financial_year_id} 
              AND FC.isDeleted = 0
               AND FC.status != 'INACTIVE'
              `,
    );
    for (const item of query) {
      const PO_purchase_details = await db.purchase_order.findAll({
        where: {
          department_id: dept_id,
          financial_year_id,
          entity_id,
          cost_center_id: item.id,
          final_status: "APPROVED",
        },
      });

      const totalPO = PO_purchase_details.reduce((sum, row) => {
        return sum + parseFloat(row.total_purchase || 0);
      }, 0);

      const finalTotal = totalPO;

      const remaining_budget =
        parseFloat(item.remainingAmount || 0) - finalTotal;

      item.remainingAmount = remaining_budget;
      item.totalPurchaseAmount = finalTotal;
    }

    if (query && query.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Cost Center Details found", data: query });
    } else {
      return res.status(404).send({
        code: 404,
        message:
          "No Cost Center Details found for the given dept_id and entity_id",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error fetching cost center data:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.createPO = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      entity_id,
      financial_year_id,
      cost_center_id,
      profit_center_id,
      warehouse_id,
      department_id,
      po_category,
      po_type,
      po_number,
      po_remark,
      employee_id,
      po_date,
      uploade_image,
      item_detail,
      vendor_id,
      purchase_request_id,
      final_status,
      billing_address_id,
      delivery_term,
      delivery_term_remark,
      payment_term_id,
      payment_term_remark,
      port_id,
      incoterm_id,
      advance_utilization_percent,
      currency_id,
      currency_rate,
      quotation_id,
    } = req.body;

    // ── 1. Input validation ───────────────────────────────────────────────────
    if (!po_number || !po_category || !department_id || !entity_id) {
      await transaction.rollback();
      return res.status(400).send({
        code: 400,
        message:
          "Missing required fields: po_number, po_category, department_id, entity_id",
      });
    }

    // ── 2. Duplicate PO Number check (entity-scoped) ──────────────────────────
    const existingPO = await db.purchase_order.findOne({
      where: { po_number, entity_id, isDeleted: false, status: "ACTIVE" },
      transaction,
      lock: transaction.LOCK.UPDATE, // pessimistic lock prevents race condition
    });

    if (existingPO) {
      await transaction.rollback();
      return res.status(409).send({
        code: 409,
        message: `PO number '${po_number}' already exists for this entity.`,
      });
    }

    // ── 3. Duplicate Purchase Request check ──────────────────────────────────
    if (purchase_request_id) {
      const prUsed = await db.purchase_order.findOne({
        where: {
          purchase_request_id,
          vendor_id,
          ...(quotation_id ? { quotation_id } : {}),
          isDeleted: false,
          status: "ACTIVE",
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (prUsed) {
        await transaction.rollback();
        return res.status(409).send({
          code: 409,
          message: `Purchase Request ID '${purchase_request_id}' with Quotation ID '${quotation_id}' is already linked to PO #${prUsed.po_number} for same vendor.`,
        });
      }
    }

    // ── 4. Department check ───────────────────────────────────────────────────
    const departmentInfo = await db.department.findOne({
      where: { dept_id: department_id, isDeleted: false, status: "ACTIVE" },
      attributes: ["dept_id", "department_name"],
      transaction,
    });

    if (!departmentInfo) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ code: 404, message: "Department not found!" });
    }

    // ── 5. Workflow check ─────────────────────────────────────────────────────
    const getData = await db.WorkFlow_Master.findAll({
      where: { entity_id, department_id, job_name: "Purchase" },
      transaction,
    });

    if (!getData || getData.length === 0) {
      await transaction.rollback();
      return res.status(404).send({
        code: 404,
        message:
          "Workflow is not created for required department for Purchase!",
      });
    }

    // ── 6. Duplicate item_master_id check within the request ─────────────────
    if (
      (po_category === "Item" || po_category === "Service") &&
      Array.isArray(item_detail) &&
      item_detail.length > 0
    ) {
      const itemIds = item_detail.map((i) => i.item_master_id);
      const uniqueItemIds = new Set(itemIds);
      if (uniqueItemIds.size !== itemIds.length) {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: "Duplicate item_master_id entries found in item_detail.",
        });
      }
    }

    // ── 8. Create PO main record ──────────────────────────────────────────────
    const response = await db.purchase_order.create(
      {
        entity_id,
        financial_year_id,
        cost_center_id,
        profit_center_id,
        department_id,
        po_category,
        po_type,
        po_number,
        po_remark,
        vendor_id,
        employee_id,
        purchase_request_id,
        po_date,
        total_purchase: 0,
        billing_address_id,
        final_status,
        warehouse_id,
        delivery_term,
        delivery_term_remark,
        payment_term_id,
        payment_term_remark,
        port_id,
        incoterm_id,
        advance_utilization_percent,
        currency_id,
        currency_rate,
        quotation_id,
      },
      { transaction },
    );

    // ── 9. Save Images ────────────────────────────────────────────────────────
    if (Array.isArray(uploade_image) && uploade_image.length > 0) {
      const imageRecords = uploade_image.map((image) => ({
        uploade_image: image,
        purchase_order_id: response.id,
      }));
      await db.purchase_order_image.bulkCreate(imageRecords, { transaction });
    }

    // ── 10. Item PO ───────────────────────────────────────────────────────────
    let total_purchase = 0;
    let itemResults = [];
    let serviceResults = [];

    if (
      (po_category === "Item" || po_category === "Service") &&
      Array.isArray(item_detail) &&
      item_detail.length > 0
    ) {
      const items = item_detail.map((data) => {
        total_purchase += Number(data.grand_total || 0);
        return {
          item_master_id: data.item_master_id,
          purchase_order_id: response.id,
          quantity: data.quantity,
          unit_price: data.unit_price,
          total_mvp: data.total_mvp,
          gst_percentage: data.tax,
          discount_percentage: data.discount,
          grand_total: data.grand_total,
        };
      });

      itemResults = await db.purchase_order_item.bulkCreate(items, {
        transaction,
        ignoreDuplicates: false, // let the DB unique constraint surface if hit
      });
    }

    // ── 12. Update total_purchase ─────────────────────────────────────────────
    await db.purchase_order.update(
      { total_purchase },
      { where: { id: response.id }, transaction },
    );

    // ── 13. Workflow Approval levels (guard against duplicates) ───────────────
    const getLevels = await db.Work_Flow_range.findAll({
      where: { workflow_id: getData[0].id, status: "ACTIVE" },
      attributes: ["level", "employee_id", "role_id", "workflow_id"],
      transaction,
    });

    // Deduplicate levels by (level, employee_id) before inserting
    const seenLevels = new Set();
    const approvalRecords = [];

    for (const level of getLevels) {
      const key = `${level.level}_${level.employee_id}`;
      if (seenLevels.has(key)) continue;
      seenLevels.add(key);

      approvalRecords.push({
        level: level.level,
        employee_id: level.employee_id,
        workflow_id: level.workflow_id,
        purchase_order_id: response.id,
        role_id: level.role_id,
        department_id: response.department_id,
        workflow_type: "Purchase",
      });
    }

    await db.purchase_order_approval.bulkCreate(approvalRecords, {
      transaction,
    });
    // ── 14. Commit ────────────────────────────────────────────────────────────
    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Created PO Successfully!",
      data: response,
      itemResults,
      serviceResults,
    });
  } catch (error) {
    await transaction.rollback();

    // Surface DB-level unique constraint violations cleanly
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).send({
        code: 409,
        message:
          "Duplicate entry detected. A record with the same key already exists.",
        detail: error.errors?.map((e) => e.message),
      });
    }

    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.approve_levels_po = async (req, res) => {
  try {
    const po_id = req.params.id;
    const {
      approvel_status,
      progressStatus,
      employee_id,
      final_status,
      workflow_type,
      remark,
      item_detail,
      service_detail,
    } = req.body;

    if (progressStatus && progressStatus.length > 20) {
      return res.status(400).send({
        code: 400,
        message: "Progress Status value is too long.",
      });
    }
    const purchaseOrderExist = await db.purchase_order.findOne({
      where: { id: po_id },
    });
    if (approvel_status == "APPROVED" && purchaseOrderExist) {
      const costCenterExist = await db.cost_center.findOne({
        where: {
          financial_year_id: purchaseOrderExist.financial_year_id,
          department_id: purchaseOrderExist.department_id,
          entity_id: purchaseOrderExist.entity_id,
          id: purchaseOrderExist.cost_center_id,
          status: "ACTIVE",
          isDeleted: 0,
        },
      });
      if (
        parseFloat(costCenterExist.remainingAmount) <
        parseFloat(purchaseOrderExist.total_purchase)
      ) {
        return res.status(404).send({
          code: 404,
          message:
            "Purchase total amount exceeds the remaining cost center amount.",
        });
      }
    }

    const allLevelsData = await db.purchase_order_approval.findAll({
      where: { employee_id, purchase_order_id: po_id },
      order: [["level", "ASC"]],
    });

    if (!allLevelsData || allLevelsData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Level has been Assigned to this Employee!",
      });
    }

    const maxLevel = await db.purchase_order_approval.max("level", {
      where: { purchase_order_id: po_id },
    });

    const currentLevelData = await db.purchase_order_approval.findOne({
      attributes: ["level"],
      where: { employee_id, purchase_order_id: po_id },
    });
    const currentLevelValue = currentLevelData?.level;

    if (!currentLevelValue) {
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }

    await db.purchase_order_approval.update(
      { approvel_status, progressStatus, workflow_type, remark },
      { where: { employee_id, purchase_order_id: po_id } },
    );

    if (approvel_status === "REJECTED") {
      await db.purchase_order_approval.update(
        { approvel_status },
        { where: { purchase_order_id: po_id, employee_id } },
      );

      if (final_status === "REJECTED") {
        await db.purchase_order.update(
          { final_status: "REJECTED" },
          { where: { id: po_id } },
        );
        return res.status(200).send({
          code: 200,
          message: "Purchase Order Rejected Successfully!",
        });
      }
    } else if (approvel_status === "PUSH BACK") {
      await db.purchase_order_approval.update(
        { approvel_status },
        { where: { purchase_order_id: po_id, employee_id } },
      );
      if (final_status === "PUSH BACK") {
        await db.purchase_order.update(
          { final_status: "PUSH BACK" },
          { where: { id: po_id } },
        );
        return res.status(200).send({
          code: 200,
          message: "Purchase Order PUSHED BACK Successfully!",
        });
      }
      return res.status(200).send({
        code: 200,
        message: "Push Back Status Updated Successfully!",
      });
    } else if (approvel_status === "APPROVED") {
      if (currentLevelValue === maxLevel) {
        const po_det = await db.sequelize.query(
          `SELECT PO.*, V.vendor_name, V.vendor_email, V.vendor_address,
          W.name AS warehouse_name, W.address AS warehouse_address,RU.first_name AS employee_name,RU.last_name AS employee_last_name,
          RU.employee_official_email, RU.contact_number
          FROM PROCUREMENT_PURCHASE_ORDER AS PO
          INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = PO.vendor_id
          INNER JOIN WAREHOUSE_MASTER AS W ON W.id = PO.warehouse_id 
          INNER JOIN HRMS_REGISTERED_USER AS RU ON RU.employee_id = PO.employee_id
          where PO.id=${po_id}
          `,
          {
            type: db.sequelize.QueryTypes.SELECT,
          },
        );
        const po_detail = po_det[0];
        const entityId = po_detail.entity_id;
        await db.purchase_order.update(
          { final_status: "APPROVED" },
          { where: { id: po_id } },
        );
        if (purchaseOrderExist?.po_category == "Service") {
          await db.financial_And_Account_Journal_List.create({
            entry_status: "Service Purchase Order",
            debit_amount: purchaseOrderExist.total_purchase,
            credit_amount: 0.0,
            entity_id: purchaseOrderExist.entity_id,
            chart_account_id: 343,
            financial_id: purchaseOrderExist.financial_year_id,
            document_number: purchaseOrderExist?.po_number,
          });
          await db.financial_And_Account_Journal_List.create({
            entry_status: "Service Purchase Order",
            debit_amount: 0.0,
            credit_amount: purchaseOrderExist.total_purchase,
            entity_id: purchaseOrderExist.entity_id,
            employee_id: employee_id,
            chart_account_id: 393,
            financial_id: purchaseOrderExist.financial_year_id,
            document_number: purchaseOrderExist?.po_number,
          });
        }

        ////here code for send link on vendor mail for creating shipping alert 20/3/2026
        const vendorDetails = await db.vendor_basic_details.findOne({
          where: { id: purchaseOrderExist.vendor_id },
        });

        const link = `${req.headers.origin}/approved-shipping-alert?po_id=${encodeURIComponent(encrypt(purchaseOrderExist.id))}&vendor_id=${encodeURIComponent(encrypt(purchaseOrderExist.vendor_id))}`;

        await mailQueue.add({
          type: "CREATE_SHIPPING_ALERT_LINK",
          vendor_email: vendorDetails.vendor_email,
          vendor_name: vendorDetails.vendor_name,
          link,
          entity_id: entityId,
          po_number: purchaseOrderExist.po_number,
          po_detail,
          entityId,
          item_detail,
          service_detail,
        });
      }
      await db.purchase_order_approval.update(
        { approvel_status: "APPROVED" },
        { where: { level: currentLevelValue, purchase_order_id: po_id } },
      );
      return res.status(200).send({
        code: 200,
        message: "Purchase Order Approved Successfully!",
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Approval Progressed to Next Level Successfully!",
      });
    }
    return res
      .status(200)
      .send({ code: 200, message: "Update Processed Successfully!" });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAll_Approval_level_po = async (req, res) => {
  try {
    const po_id = req.params.po_id;
    const { dep_id, workflow_type } = req.body;

    const getData = await db.purchase_order_approval.findAll({
      where: {
        purchase_order_id: po_id,
        workflow_type,
      },
      attributes: [
        "approvel_status",
        "level",
        "employee_id",
        "department_id",
        "remark",
        "workflow_type",
        "role_id",
      ],
    });

    if (!getData || getData.length === 0) {
      return res.status(400).send({ code: 400, message: "Data not found" });
    }

    if (dep_id) {
      getData.forEach((levelInfo) => {
        levelInfo.department_id = dep_id;
        levelInfo.workflow_type = req.body.workflow_type;
      });
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
          message: "User not found for level" + levelInfo.level,
        });
      }

      const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
      const levelWithName = {
        level: levelInfo.level,
        name: fullName,
        status: levelInfo.approvel_status,
        remark: levelInfo.remark,
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

exports.get_to_be_approved_po = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const query = `
        SELECT DISTINCT PA.*, PR.id As PO_id, PR.po_category, PR.po_type, PR.po_number, PR.po_date, PR.po_remark, PR.final_status,
        PR.financial_year_id, PR.entity_id, PR.department_id, PR.cost_center_id, PR.vendor_id, PR.total_purchase, 
        PR.purchase_request_id, MD.department_name, VB.vendor_name,
        CONCAT(HRU.first_name, ' ', HRU.last_name) AS created_by

        FROM PROCUREMENT_PURCHASE_ORDER_APPROVAL AS PA
        JOIN PROCUREMENT_PURCHASE_ORDER AS PR ON PR.id = PA.purchase_order_id
        JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        LEFT JOIN VENDOR_BASIC_DETAILS VB ON VB.id = PR.vendor_id
        INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id
        WHERE PA.employee_id = :employeeId
        AND PA.status = 'ACTIVE' 
        AND PR.status ='ACTIVE'
        AND PR.isDeleted = 0
        AND PA.approvel_status = 'PENDING'
        AND NOT EXISTS (
          SELECT 1 
          FROM PROCUREMENT_PURCHASE_ORDER_APPROVAL AS prev
          WHERE prev.purchase_order_id = PR.id 
            AND prev.level < PA.level
            AND prev.approvel_status != 'APPROVED'
        )
        ORDER BY PR.id DESC
        `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        employeeId: employee_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All PO Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found !",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.get_Approved_Approvals_po = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const query = `
        SELECT DISTINCT PA.*, PR.id As PO_id, PR.po_category, PR.po_type, PR.po_number, PR.po_date, PR.po_remark, PR.final_status,
        PR.financial_year_id, PR.entity_id, PR.department_id, PR.cost_center_id, PR.vendor_id, PR.total_purchase,
        PR.purchase_request_id, MD.department_name, F.cost_center_name, VB.vendor_name,
        CONCAT(HRU.first_name, ' ', HRU.last_name) AS created_by

        FROM PROCUREMENT_PURCHASE_ORDER_APPROVAL AS PA
        JOIN PROCUREMENT_PURCHASE_ORDER AS PR ON PR.id = PA.purchase_order_id
        JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
        JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PR.vendor_id
        INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id

        WHERE PA.employee_id = '${employee_id}'
        AND PA.approvel_status = 'APPROVED'
        ORDER BY PA.id DESC;
        `;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Approved Approvals Successfully !",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Approved Approvals Found for This Employee !",
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

exports.get_Rejected_Approvals_po = async (req, res) => {
  try {
    const employee_id = req.params.id;
    let getAllData;
    const query = `
        SELECT DISTINCT PA.*, PR.id As PO_id, PR.po_category, PR.po_type, PR.po_number, PR.po_remark, PR.final_status,
        PR.financial_year_id, PR.entity_id, PR.department_id, PR.cost_center_id, PR.vendor_id, PR.total_purchase,
        PR.purchase_request_id, HRU.first_name, HRU.last_name, MD.department_name, MD.department_code, F.cost_center_name, F.cost_center_code,
        VB.vendor_name,
        CONCAT(HRU.first_name, ' ', HRU.last_name) AS created_by

        FROM PROCUREMENT_PURCHASE_ORDER_APPROVAL AS PA
        JOIN PROCUREMENT_PURCHASE_ORDER AS PR ON PR.id = PA.purchase_order_id
        INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PA.employee_id
		    JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
        JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PR.vendor_id
        WHERE PA.employee_id = '${employee_id}'
        AND PA.approvel_status = 'REJECTED'
        ORDER BY PA.id DESC;`;

    getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_allPO = async (req, res) => {
  try {
    const { user_id, entity_id, user_role, financial_year_id } = req.query;

    let query = `
      SELECT 
        PR.id AS PO_id,
        PR.po_category,
        PR.po_type,
        PR.po_number,
        PR.po_remark,
        PR.final_status,
        PR.purchase_request_id,
        PR.financial_year_id,
        PR.entity_id,

        /* GRN STATUS (SAFE SUBQUERY) */
        (
          SELECT MAX(GM.grnStatus)
          FROM GRN_MASTER GM
          WHERE GM.po_Id = PR.id
        ) AS grn_service_status,

        PR.department_id,
        PR.cost_center_id,
        PR.vendor_id,
        VB.vendor_name,
        PR.total_purchase,
        PR.po_date,

        /* APPROVAL STATUS (SAFE SUBQUERY) */
        (
          SELECT MAX(approvel_status)
          FROM PROCUREMENT_PURCHASE_ORDER_APPROVAL PA
          WHERE PA.purchase_order_id = PR.id
        ) AS approvel_status,

        ${user_role !== "Super Admin" ? "HRU.first_name, HRU.last_name," : ""}

        MD.department_name,
        MD.department_code,
        F.cost_center_name,
        F.cost_center_code,
        CONCAT(HRU.first_name, ' ', HRU.last_name) AS created_by

      FROM PROCUREMENT_PURCHASE_ORDER PR
      INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD ON MD.dept_id = PR.department_id
      LEFT JOIN FINANCE_COST_CENTER F ON PR.cost_center_id = F.id
      LEFT JOIN VENDOR_BASIC_DETAILS VB ON VB.id = PR.vendor_id
      
      WHERE 
        PR.isDeleted = 0 AND
        ${user_role !== "Super Admin" ? "PR.employee_id = :user_id AND" : ""}
        PR.entity_id = :entity_id
        AND PR.financial_year_id = :financial_year_id
      
      ORDER BY PR.id DESC
    `;

    const replacements = { user_id, entity_id, financial_year_id };

    const purchase_Order_details = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: purchase_Order_details.length > 0 ? 200 : 404,
      message:
        purchase_Order_details.length > 0
          ? "PO Details found"
          : "No PO Details found",
      data: purchase_Order_details,
    });
  } catch (error) {
    console.error("Error in get_allPO:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.get_allPO_id = async (req, res) => {
  try {
    const id = req.params.id;

    // Main PO data
    const [rows] = await db.sequelize.query(
      `SELECT PR.id, PR.po_category, PR.po_number, PR.vendor_id, PR.currency_id, PR.advance_utilization_percent, PR.currency_rate, PR.purchase_request_id, PR.employee_id,
      PR.final_status, PR.billing_address_id,PR.delivery_term,PR.delivery_term_remark,PR.payment_term_id,PR.payment_term_remark,
      PR.po_type, PR.total_purchase, PR.po_remark, PR.entity_id, PR.po_date, PR.port_id, PR.incoterm_id,
      PR.financial_year_id, PR.cost_center_id, PR.profit_center_id, PR.warehouse_id, PR.department_id,
      EM.entity_name, FY.financial_year, GM.grn_number, GM.grn_date
      FROM PROCUREMENT_PURCHASE_ORDER AS PR 
      LEFT JOIN ENTITY_MASTER AS EM ON EM.id = PR.entity_id 
      LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
      LEFT JOIN MASTER_FINANCIAL_YEAR AS FY ON FY.id = PR.financial_year_id
      LEFT JOIN FINANCE_COST_CENTER AS FC ON FC.id = PR.cost_center_id
      LEFT JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PR.vendor_id
      LEFT JOIN MASTER_BRANCH AS MB2 ON MB2.id = PR.billing_address_id
      LEFT JOIN GRN_MASTER AS GM ON GM.po_Id = PR.id
      WHERE PR.id = :id
    `,
      { replacements: { id } },
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }

    const data = rows[0];

    // PO Approval details
    const [data_details] = await db.sequelize.query(
      `
      SELECT PRA.id, PRA.level, PRA.approvel_status, PRA.progressStatus, PRA.final_quantity,
             PRA.final_MVP, PRA.purchase_order_id, PRA.employee_id, PRA.department_id,
             PRA.role_id, PRA.workflow_id
      FROM PROCUREMENT_PURCHASE_ORDER_APPROVAL AS PRA 
      WHERE PRA.purchase_order_id = :id
    `,
      { replacements: { id } },
    );

    // PO Images
    const [data_image] = await db.sequelize.query(
      `
      SELECT PM.id, PM.uploade_image, PM.purchase_order_id
      FROM PROCUREMENT_PURCHASE_ORDER_IMAGE AS PM
      WHERE PM.purchase_order_id = :id
    `,
      { replacements: { id } },
    );

    // PO Items
    const [data_Item] = await db.sequelize.query(
      `
      SELECT PI.*, MI.item_name, MI.item_code, MI.MVP, MI.description, MI.hsn_code_id, HSN.hsn_sac_code,
      MI.manage_by, MI.status, MI.asset_id, MI.uom_id, MID.image AS item_document
      FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS PI
      LEFT JOIN MASTER_ITEM AS MI ON MI.id = PI.item_master_id
      LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT AS MID ON MID.item_id = MI.id
      LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = MI.hsn_code_id
      WHERE PI.purchase_order_id = :id
    `,
      { replacements: { id } },
    );

    // Convert items to numbers
    const data_Item_numbered = data_Item.map((item) => ({
      ...item,
      quantity: Number(item.quantity || 0),
      unit_price: Number(item.unit_price || item.MVP || 0),
      igst: Number(item.igst || 0),
      discount: Number(item.discount || 0),
      grand_total: Number(item.grand_total || 0),
    }));
    // total_purchase as number
    const total_purchase_number = Number(data.total_purchase || 0);

    const Obj = {
      ...data,
      total_purchase: total_purchase_number,
      data_details,
      data_image,
      data_Item: data_Item_numbered,
    };

    return res
      .status(200)
      .send({ code: 200, message: "Data fetched successfully!", data: Obj });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  }
};

exports.generate_Po_No = async (req, res) => {
  try {
    const po_type = req.body.po_type;
    const po_Variable = "PO";
    const lastEntry = await db.purchase_order.findOne({
      where: { status: "ACTIVE" },
      order: [["id", "DESC"]],
      attributes: ["po_number", "id"],
    });

    if (lastEntry != null) {
      const last_digit = lastEntry.po_number;
      if (last_digit) {
        const lastNumber = parseInt(last_digit.slice(-2), 10);
        var number = lastNumber + 1;
      } else if (last_digit.length == 0 || last_digit.length == null) {
        var number = 1;
      }
    } else {
      var number = 1;
    }
    const code = `${number}`.padStart(3, "0");
    const po_number = po_Variable + code;
    if (po_type === "") {
      return res
        .status(200)
        .send({ code: 200, message: "Please Select PO Type", data: null });
    } else {
      return res.status(200).send({
        code: 200,
        message: "PO Number has been Generated Purchase Order",
        data: po_number,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.getAll_draftPO = async (req, res) => {
  try {
    let getAllData;

    if (req.user.role_master_id === 1) {
      const query = `SELECT pp.*, MA.department_name, VBD.vendor_name
                 FROM PROCUREMENT_PURCHASE_ORDER AS pp 
                 JOIN MASTER_DEPARTMENT AS MA ON MA.dept_id = pp.department_id 
                 JOIN VENDOR_BASIC_DETAILS AS VBD ON VBD.id = pp.vendor_id
                 WHERE pp.status ='ACTIVE' and pp.final_status ='PUSH BACK'`;
      getAllData = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });
    } else {
      const query = `SELECT pp.*, MA.department_name
                FROM PROCUREMENT_PURCHASE_ORDER AS pp 
                JOIN MASTER_DEPARTMENT AS MA ON MA.dept_id = pp.department_id
                WHERE pp.employee_id = ${req.user.employee_id} AND pp.final_status = 'PUSH BACK' AND pp.status='ACTIVE' `;
      getAllData = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });
    }

    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: getAllData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "No Records Found", data: getAllData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.update_draft_po = async (req, res) => {
  try {
    const po_id = req.params.po_id;
    const {
      cost_center_id,
      location_id,
      department_id,
      po_category,
      po_type,
      po_number,
      po_remark,
      uploade_image,
      department_name,
      vendor_id,
      service_detail,
      item_detail,
      total_purchase,
    } = req.body;

    const Po_detail = await db.purchase_order.findOne({ where: { id: po_id } });
    const Budget_Details = await db.cost_center.findOne({
      where: { id: cost_center_id },
    });

    const Total_Remaining_budget = Budget_Details.remainingAmount;
    const remainingAmount = Total_Remaining_budget + Po_detail.total_purchase;
    const remainingAmountMinus = remainingAmount - total_purchase;

    if (!Total_Remaining_budget == 0 && !Po_detail.total_purchase == 0) {
      const budget_Update = await db.cost_center.update(
        { remainingAmount: remainingAmountMinus },
        { where: { id: cost_center_id } },
      );
      if (!budget_Update) {
        return res.status(404).send({
          code: 404,
          message: "Unable to update Budget",
        });
      }
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Your Remaining Amount is too lOW" });
    }

    const updateData = await db.purchase_order.update(
      {
        location_id,
        department_id,
        po_category,
        po_type,
        po_number,
        po_remark,
        uploade_image,
        department_name,
        vendor_id,
        po_remark: po_remark,
        final_status: "PENDING",
      },
      {
        where: {
          id: po_id,
        },
      },
    );
    const updateData2 = await db.purchase_order_approval.update(
      {
        approvel_status: "PENDING",
        progressStatus: "OPEN",
      },
      { where: { purchase_order_id: po_id } },
    );

    if (item_detail && item_detail.length > 0) {
      await db.purchase_order_item.destroy({
        where: { purchase_order_id: po_id },
      });
    } else if (service_detail && service_detail.length > 0) {
      await db.purchase_order_service.destroy({
        where: { purchase_order_id: po_id },
      });
    }
    let itemPromises = [];
    let servicePromises = [];

    if (po_category === "Item_PO") {
      if (Array.isArray(item_detail) && item_detail.length > 0) {
        itemPromises = item_detail.map(async (data) => {
          const calculatedTax = (data.total_mvp * data.tax) / 100;
          const grandTotal = data.total_mvp + calculatedTax;
          const item_details = {
            item_master_id: data.item_master_id,
            purchase_order_id: Po_detail.id,
            po_type: Po_detail.po_type,
            item_categroy_id: data.item_categroy_id,
            total_mvp: data.total_mvp,
            quantity: data.quantity,
            tax: data.tax,
            total_cgst: data.total_cgst,
            total_sgst: data.total_sgst,
            total_igst: data.total_igst,
            total_discount: data.total_discount,
            unit_price: data.unit_price,
            grand_total: data.grand_total,
          };
          try {
            let result = await db.purchase_order_item.create(item_details);
            console.log("Item Created Successfully:", result);
            return result;
          } catch (error) {
            console.error("Item Creation Error:", error);
            throw error;
          }
        });
      } else {
        console.log("No valid Item details found");
      }
    } else if (po_category === "Service_PO") {
      if (Array.isArray(service_detail) && service_detail.length > 0) {
        servicePromises = service_detail.map(async (data) => {
          const calculatedTax = (data.total_mvp * data.tax) / 100;
          const grandTotal = data.total_mvp + calculatedTax;
          const service_details = {
            service_master_id: data.service_master_id,
            service_categroy_id: data.service_categroy_id,
            po_type: Po_detail.po_type,
            purchase_order_id: Po_detail.id,
            total_mvp: data.total_mvp,
            quantity: data.quantity,
            tax: data.tax,
            total_cgst: data.total_cgst,
            total_sgst: data.total_sgst,
            total_igst: data.total_igst,
            total_discount: data.total_discount,
            unit_price: data.unit_price,
            grand_total: data.grand_total,
          };

          try {
            result = db.purchase_order_service.create(service_details);
            console.log("Service Created Successfully:", result);
            return result;
          } catch (error) {
            console.error("Service Creation Error:", error);
            throw error;
          }
        });
      } else {
        console.log("No valid Service details found");
      }
    }

    const itemResults = await Promise.all(itemPromises);
    const serviceResults = await Promise.all(servicePromises);

    if (updateData || updateData2) {
      return res.status(200).send({
        code: 200,
        message: "Record Updated Successfully",
        data: updateData,
        itemResults,
        serviceResults,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Unable to Update" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_all_PR_for_PO = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.query;

    // ── 1. Validate ───────────────────────────────────────────────────────────
    if (!entity_id || !financial_year_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id and financial_year_id are required.",
      });
    }

    // ── 2. Fetch all PR + their vendors in one query (no GROUP BY) ────────────
    //
    //  Only exclude PRs already converted to a direct (non-quotation) PO.
    //  PRs that went through RFP / Negotiation are shown in the separate
    //  get_all_Quotation_for_PO endpoint and must NOT be excluded here.
    //
    const query = `
      SELECT
        RP.id                                              AS pr_id,
        RP.pr_number,
        RP.pr_date,
        RP.pr_category,
        RP.pr_type,
        RP.remark                                          AS pr_remark,
        RP.final_status,
        RP.entity_id,
        RP.financial_year_id,
        RP.department_id,
        RP.employee_id,
        RP.rfp_start_date,
        RP.rfp_end_date,
        MD.department_name,
        VB.id                                              AS vendor_id,
        CONCAT(VB.vendor_name, ' [', VB.vendor_code, ']') AS vendor_name
      FROM PROCUREMENT_PURCHASE_REQUEST AS RP
      INNER JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR AS PV
        ON PV.Purchase_req_id = RP.id
      INNER JOIN VENDOR_BASIC_DETAILS AS VB
        ON VB.id = PV.vendor_id
      LEFT JOIN MASTER_DEPARTMENT AS MD
        ON MD.dept_id = RP.department_id
      WHERE RP.status            = 'ACTIVE'
        AND RP.final_status      = 'APPROVED'
        AND RP.entity_id         = :entity_id
        AND RP.financial_year_id = :financial_year_id
        -- Exclude PRs already converted to a direct (non-quotation) PO
        AND RP.id NOT IN (
          SELECT PO.purchase_request_id
          FROM PROCUREMENT_PURCHASE_ORDER AS PO
          WHERE PO.status              = 'ACTIVE'
            AND PO.purchase_request_id IS NOT NULL
            AND PO.vendor_id = PV.vendor_id
        )   
        AND RP.id NOT IN (
          SELECT rfp.purchase_request_id
          FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS rfp
          WHERE rfp.purchase_request_id IS NOT NULL
        )
      ORDER BY RP.id DESC, VB.vendor_name ASC
    `;

    const rawData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { entity_id, financial_year_id },
    });

    if (!rawData.length) {
      return res.status(200).send({
        code: 404,
        message: "Record Not Found",
        data: [],
      });
    }

    // ── 3. Build tree: PR (parent) → Vendors (children) ──────────────────────
    //
    //  Each unique PR → one parent node (first vendor encountered).
    //  Additional vendors for the same PR → child nodes.
    //
    const prMap = new Map();

    rawData.forEach((row) => {
      const prId = row.pr_id;

      // ── Shared node shape ──────────────────────────────────────────────────
      const vendorNode = {
        pr_id: prId,
        pr_number: row.pr_number,
        pr_date: row.pr_date,
        pr_category: row.pr_category,
        pr_type: row.pr_type,
        pr_remark: row.pr_remark,
        final_status: row.final_status,
        entity_id: row.entity_id,
        financial_year_id: row.financial_year_id,
        department_id: row.department_id,
        department_name: row.department_name,
        employee_id: row.employee_id,
        rfp_start_date: row.rfp_start_date,
        rfp_end_date: row.rfp_end_date,
        vendor_id: row.vendor_id,
        vendor_name: row.vendor_name,
        children: [],
      };

      if (!prMap.has(prId)) {
        // First vendor for this PR → parent node
        prMap.set(prId, vendorNode);
        return;
      }

      // ── Additional vendor → child node ─────────────────────────────────────
      const parent = prMap.get(prId);

      if (row.vendor_id === parent.vendor_id) return; // same vendor, skip

      const alreadyAdded = parent.children.some(
        (child) => child.vendor_id === row.vendor_id,
      );

      if (!alreadyAdded) {
        parent.children.push(vendorNode);
      }
    });

    const treeData = [];
    prMap.forEach((pr) => treeData.push(pr));

    return res.status(200).send({
      code: 200,
      message: "Fetch All PR Data Successfully",
      data: treeData,
    });
  } catch (error) {
    logger.error(`Error in get_all_PR_for_PO: ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.get_all_Quotation_for_PO = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.query;

    // ── 1. Validate ───────────────────────────────────────────────────────────
    if (!entity_id || !financial_year_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id and financial_year_id are required.",
      });
    }

    // ── 2. Fetch all PR + their vendors in one query (no GROUP BY) ────────────
    const query = `
      SELECT
      PV.id, PV.item_id, PV.vendor_id, PV.price_amt, vq.quotation_for, vq.negotiation_id, vq.quotation_code, 
      PV.quotation_id, PR.pr_number, PR.pr_type, PR.id AS pr_id, PR.pr_category, MD.department_name, VB.id AS vendor_id, 
      CONCAT(VB.vendor_name, ' [', VB.vendor_code,']') AS vendor_name
		FROM PROCUREMENT_PURCHASE_VENDOR_QUOTATION AS vq
		INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = vq.pr_id
      INNER JOIN PROCUREMENT_PURCHASE_QUOTATION_ITEM AS PV
        ON PV.purchase_request_id = PR.id AND PV.quotation_id = vq.id
      INNER JOIN VENDOR_BASIC_DETAILS AS VB
        ON VB.id = PV.vendor_id
      LEFT JOIN MASTER_DEPARTMENT AS MD
        ON MD.dept_id = PR.department_id
      WHERE PR.status           = 'ACTIVE'
        AND PR.final_status     = 'APPROVED'
        AND vq.approval_status     = 'APPROVED'
        AND PR.entity_id        = :entity_id
        AND PR.financial_year_id = :financial_year_id
        AND vq.id NOT IN (
          SELECT PO.quotation_id
          FROM PROCUREMENT_PURCHASE_ORDER AS PO
          WHERE PO.status = 'ACTIVE'
            AND PO.quotation_id IS NOT NULL
            AND PO.vendor_id = PV.vendor_id
        )
      ORDER BY PR.id DESC, VB.vendor_name ASC
    `;

    const rawData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { entity_id, financial_year_id },
    });

    if (!rawData.length) {
      return res.status(200).send({
        code: 404,
        message: "Record Not Found",
        data: [],
      });
    }

    // ── 3. Build tree: PR (parent) → Quotations/Vendors (children) ───────────
    const prMap = new Map();

    rawData.forEach((row) => {
      if (!prMap.has(row.pr_id)) {
        prMap.set(row.pr_id, {
          id: row.id,
          pr_id: row.pr_id,
          quotation_id: null,
          quotation_code: null,
          pr_number: row.pr_number,
          pr_date: row.pr_date,
          pr_category: row.pr_category,
          pr_remark: row.remarks_approval,
          final_status: row.approval_status,
          entity_id: row.entity_id,
          financial_year_id: row.financial_year_id,
          department_id: row.department_id,
          department_name: row.department_name,
          employee_id: row.employee_id,
          vendor_id: null,
          vendor_name: null,
          children: [],
        });
      }

      const pr = prMap.get(row.pr_id);

      // Check if this quotation/vendor is already added as a child of this PR
      const childExists = pr.children.some(
        (child) =>
          child.quotation_id === row.quotation_id &&
          child.vendor_id === row.vendor_id,
      );

      if (!childExists) {
        pr.children.push({
          id: row.id,
          pr_id: row.pr_id,
          quotation_id: row.quotation_id,
          quotation_code: row.quotation_code,
          pr_number: row.pr_number,
          pr_date: row.pr_date,
          pr_category: row.pr_category,
          pr_remark: row.remarks_approval,
          final_status: row.approval_status,
          entity_id: row.entity_id,
          financial_year_id: row.financial_year_id,
          department_id: row.department_id,
          department_name: row.department_name,
          employee_id: row.employee_id,
          vendor_id: row.vendor_id,
          vendor_name: row.vendor_name,
          children: [],
        });
      }
    });

    const treeData = Array.from(prMap.values());

    return res.status(200).send({
      code: 200,
      message: "Fetch All PO Data Successfully",
      data: treeData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

// exports.UpdatePO = async (req, res) => {
//     try {
//         const po_id = req.params.po_id;
//         const {
//             entity_id, financial_year_id, cost_center_id, location_id, department_id,
//             po_category, po_type, po_number, po_remark, employee_id, po_date, total_tax,
//             uploade_image, item_detail, service_detail, department_name, vendor_id, total_purchase,
//             purchase_request_id, po_state, po_address
//         } = req.body;

//         const departmentInfo = await db.department.findOne({
//             where: { department_name: req.body.department_name, isDeleted: false, status: "ACTIVE" },
//             attributes: ["dept_id", "department_name"],
//         });
//         if (!departmentInfo) {
//             return res.status(500).send({ code: 500, message: "Department not found!" });
//         }

//         const getData = await db.WorkFlow_Master.findAll({
//             where: {
//                 entity_id: entity_id,
//                 department_id: department_id,
//                 job_name: po_category,
//             }
//         });

//         if (!getData || getData.length === 0) {
//             return res.status(500).send({
//                 code: 500,
//                 message: "Workflow is not created for required department And PO!",
//             });
//         } else {
//             await db.purchase_order.update({
//                 entity_id, financial_year_id, cost_center_id, department_id, po_category,
//                 department_name, location_id, po_type, po_number, po_remark, vendor_id,
//                 total_purchase, employee_id, purchase_request_id, po_date, total_tax, po_state, po_address
//             }, { where: { id: po_id } });

//             await db.purchase_order_image.destroy({
//                 where: { purchase_order_id: po_id }
//             });
//             await Promise.all(uploade_image.map(async (image) => {
//                 await db.purchase_order_image.create({
//                     uploade_image: image,
//                     purchase_order_id: po_id,
//                 });
//             }));

//             await db.purchase_order_item.destroy({
//                 where: { purchase_order_id: po_id }
//             });

//             let itemResults = [];
//             if (po_category === "Item_PO" && Array.isArray(item_detail) && item_detail.length > 0) {
//                 await Promise.all(item_detail.map(async (data) => {
//                     const calculatedTax = data.total_mvp * data.tax / 100;
//                     const grandTotal = data.total_mvp + calculatedTax;

//                     const result = await db.purchase_order_item.create({
//                         item_master_id: data.item_master_id,
//                         purchase_order_id: po_id,
//                         item_categroy_id: data.item_categroy_id,
//                         total_mvp: data.total_mvp,
//                         quantity: data.quantity,
//                         tax: data.tax,
//                         unit_price: data.unit_price,
//                         //  hsn_sac_code: data.hsn_sac_code,
//                         grand_total: data.grand_total,
//                         po_type: data.po_type,
//                         total_cgst: data.total_cgst,
//                         total_sgst: data.total_sgst,
//                         total_igst: data.total_igst,
//                         total_discount: data.total_discount,
//                     });

//                     itemResults.push(result);
//                 }));
//             }

//             await db.purchase_order_service.destroy({
//                 where: { purchase_order_id: po_id }
//             });

//             let serviceResults = [];
//             if (po_category === "Service_PO" && Array.isArray(service_detail) && service_detail.length > 0) {
//                 await Promise.all(service_detail.map(async (data) => {
//                     const calculatedTax = data.total_mvp * data.tax / 100;
//                     const grandTotal = data.total_mvp + calculatedTax;

//                     const result = await db.purchase_order_service.create({
//                         service_master_id: data.service_master_id,
//                         service_categroy_id: data.service_categroy_id,
//                         purchase_order_id: po_id,
//                         total_mvp: data.total_mvp,
//                         quantity: data.quantity,
//                         tax: data.tax,
//                         unit_price: data.unit_price,
//                         po_type: data.po_type,
//                         total_cgst: data.total_cgst,
//                         total_sgst: data.total_sgst,
//                         total_igst: data.total_igst,
//                         total_discount: data.total_discount,
//                         grand_total: data.grand_total
//                     });

//                     serviceResults.push(result);
//                 }));
//             }

//             const getLevels = await db.Work_Flow_range.findAll({
//                 where: {
//                     workflow_id: getData[0].id,
//                     status: "ACTIVE"
//                 },
//                 attributes: ["level", "employee_id", "role_id", "workflow_id"]
//             });

//             // const levelPromises = getLevels.map(async (level) => {
//             //     return await db.purchase_order_approval.update({
//             //         level: level.level,
//             //         employee_id: level.employee_id,
//             //         workflow_id: level.workflow_id,
//             //         purchase_order_id: po_id,
//             //         role_id: level.role_id,
//             //         department_id: departmentInfo.dept_id,
//             //         workflow_type: po_category,
//             //     }, { where: { purchase_order_id: po_id, workflow_id: level.workflow_id } });
//             // });

//             // await Promise.all(levelPromises);
//             return res.status(200).send({
//                 code: 200,
//                 message: "Update PO Successfully!",
//                 data: po_id,
//                 // itemResults,
//                 // serviceResults,
//             });
//         }
//     } catch (error) {
//         logger.error(`Error ${error.message}`, { error });
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// }

exports.UpdatePO = async (req, res) => {
  try {
    const po_id = req.params.po_id;
    const {
      entity_id,
      financial_year_id,
      cost_center_id,
      profit_center_id,
      warehouse_id,
      department_id,
      po_category,
      po_type,
      po_number,
      po_remark,
      employee_id,
      po_date,
      uploade_image,
      item_detail,
      service_detail,
      vendor_id,
      purchase_request_id,
      delivery_term,
      delivery_term_remark,
      payment_term_id,
      payment_term_remark,
      port_id,
      incoterm_id,
      currency_id,
      advance_utilization_percent,
      currency_rate,
    } = req.body;

    // Department check.....
    const departmentInfo = await db.department.findOne({
      where: {
        dept_id: department_id,
        isDeleted: false,
        status: "ACTIVE",
      },
      attributes: ["dept_id", "department_name"],
    });
    if (!departmentInfo) {
      return res
        .status(500)
        .send({ code: 500, message: "Department not found!" });
    }

    // Workflow check...
    const getData = await db.WorkFlow_Master.findAll({
      where: {
        entity_id: entity_id,
        department_id: department_id,
        job_name: "Purchase",
      },
    });

    if (!getData || getData.length === 0) {
      return res.status(500).send({
        code: 500,
        message: "Workflow is not created for required department And PO!",
      });
    } else {
      let total_purchase = 0;

      // Update PO main details...
      await db.purchase_order.update(
        {
          entity_id,
          financial_year_id,
          cost_center_id,
          profit_center_id,
          department_id,
          po_category,
          warehouse_id,
          po_type,
          po_number,
          po_remark,
          vendor_id,
          employee_id,
          purchase_request_id,
          po_date,
          delivery_term,
          delivery_term_remark,
          payment_term_id,
          payment_term_remark,
          port_id,
          incoterm_id,
          currency_id,
          advance_utilization_percent,
          currency_rate,
        },
        { where: { id: po_id } },
      );

      // Images update...
      await db.purchase_order_image.destroy({
        where: { purchase_order_id: po_id },
      });
      if (Array.isArray(uploade_image)) {
        await Promise.all(
          uploade_image.map(async (image) => {
            await db.purchase_order_image.create({
              uploade_image: image,
              purchase_order_id: po_id,
            });
          }),
        );
      }

      // ================== ITEM PO ==================
      await db.purchase_order_item.destroy({
        where: { purchase_order_id: po_id },
      });
      let itemResults = [];
      if (
        po_category === "Item" &&
        Array.isArray(item_detail) &&
        item_detail.length > 0
      ) {
        itemResults = await Promise.all(
          item_detail.map(async (data) => {
            total_purchase += data.grand_total;

            return await db.purchase_order_item.create({
              item_master_id: data.item_master_id,
              purchase_order_id: po_id,
              total_mvp: data.total_mvp,
              quantity: data.quantity,
              unit_price: data.unit_price,
              gst_percentage: data.tax,
              total_igst: data.total_igst,
              discount_percentage: data.discount,
              grand_total: data.grand_total,
            });
          }),
        );
      }

      // ================== SERVICE PO ==================
      await db.purchase_order_service.destroy({
        where: { purchase_order_id: po_id },
      });

      // Update PO total_purchase
      await db.purchase_order.update(
        { total_purchase: total_purchase },
        { where: { id: po_id } },
      );

      return res.status(200).send({
        code: 200,
        message: "Update PO Successfully!",
        data: po_id,
        itemResults,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);

    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getPurchaseDataCount = async (req, res) => {
  try {
    const { entity_id, emp_id } = req.params;
    const { fromMonth, toMonth } = req.body;

    const fromMonthInt = parseInt(fromMonth, 10);
    const toMonthInt = parseInt(toMonth, 10);

    const monthFilter = [
      db.Sequelize.where(
        db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
        { [db.Sequelize.Op.gte]: fromMonthInt },
      ),
      db.Sequelize.where(
        db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
        { [db.Sequelize.Op.lte]: toMonthInt },
      ),
    ];

    const queries = {
      purchaseOrderCount: db.purchase_order.count({
        where: {
          entity_id: entity_id,
          employee_id: emp_id,
          [db.Sequelize.Op.and]: monthFilter,
        },
      }),
      prCount: db.purchase_details.count({
        where: {
          entity_id: entity_id,
          employee_id: emp_id,
          [db.Sequelize.Op.and]: monthFilter,
        },
      }),
      supplierCount: db.purchase_order.count({
        distinct: true,
        col: "vendor_id",
        where: {
          entity_id: entity_id,
          employee_id: emp_id,
          [db.Sequelize.Op.and]: monthFilter,
        },
      }),
      openPo: db.purchase_order.count({
        where: {
          entity_id: entity_id,
          employee_id: emp_id,
          final_status: "PENDING",
          [db.Sequelize.Op.and]: monthFilter,
        },
      }),
      openPoAmount: db.purchase_order.sum("total_purchase", {
        where: {
          entity_id: entity_id,
          employee_id: emp_id,
          final_status: "PENDING",
          [db.Sequelize.Op.and]: monthFilter,
        },
      }),
      invoiceCount: db.grnMaster.count({
        where: {
          entity_id: entity_id,
          employee_id: emp_id,
          [db.Sequelize.Op.and]: monthFilter,
        },
      }),
      grnCount: db.grnMaster.count({
        where: {
          entity_id: entity_id,
          employee_id: emp_id,
          [db.Sequelize.Op.and]: monthFilter,
        },
      }),
    };

    const results = await Promise.all(Object.values(queries));

    const [
      purchaseOrderCount,
      prCount,
      supplierCount,
      openPo,
      openPoAmount,
      invoiceCount,
      grnCount,
    ] = results;

    return res.status(200).send({
      code: 200,
      message: "Count fetched successfully",
      data: {
        purchaseOrderCount,
        prCount,
        supplierCount,
        openPo,
        openPoAmount,
        invoiceCount,
        grnCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase order count",
    });
  }
};

exports.download_purchase_order_pdf = async (req, res) => {
  try {
    const { po_id } = req.query;
    const purchaseOrderdata = await db.purchase_order.findOne({
      where: { id: po_id },
      include: [
        {
          model: db.purchase_order_item,
          attributes: [
            "id",
            "quantity",
            "unit_price",
            "total_mvp",
            "tax",
            "total_cgst",
            "total_sgst",
            "total_igst",
            "total_discount",
            "grand_total",
          ],
          include: [
            {
              model: db.ItemMaster,
              attributes: ["item_name", "description"],
              include: [
                { model: db.hsn_sac_master, attributes: ["hsn_sac_code"] },
                { model: db.uom, attributes: ["uom_name"] },
              ],
            },
          ],
        },
        {
          model: db.vendor_basic_details,
          attributes: ["vendor_name", "vendor_address"],
          include: [
            { model: db.states, attributes: ["states_name", "states_code"] },
            { model: db.city, attributes: ["city_name"] },
          ],
        },
        {
          model: db.tbl_branch,
          attributes: [
            "branch_name",
            "branch_address",
            "branch_gstnumber",
            "branch_pin_code",
          ],
          include: [
            { model: db.states, attributes: ["states_name", "states_code"] },
            { model: db.city, attributes: ["city_name"] },
          ],
        },
      ],
    });
    if (!purchaseOrderdata) {
      return res.status(404).send({ message: "Purchase Order not found." });
    }
    // const filePath = path.join(
    //   __dirname,
    //   "../../../../uploaded_files/",
    //   purchaseOrderdata.pdf_data
    // );
    // res.download(filePath, (err) => {
    //   if (err) {
    //     return res
    //       .status(500)
    //       .send({ message: "Could not download the file. " + err });
    //   }
    // });

    const pdfBuffer = await generatePOPDF(purchaseOrderdata);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    res.status(500).send({ message: "An error occurred. " + error });
  }
};

exports.updateshipingstatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { shipping_status, expected_ship_date } = req.body;
    const [getdata] = await db.purchase_order_approval.update(
      {
        shipping_status: shipping_status,
        expected_ship_date: expected_ship_date,
      },
      {
        where: { purchase_order_id: id },
      },
    );
    if (getdata === 0) {
      return res.status(404).send({ message: "No record found to update." });
    }

    return res
      .status(200)
      .send({ message: "Shipping status updated successfully." });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    res.status(500).send({ message: "An error occurred. " + error });
  }
};

exports.get_Creator_Approved_POs = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const userRoleId = req.user?.role_master_id || "";

    let whereCondition = `PA.approvel_status = 'APPROVED'`;

    if (userRoleId !== 1) {
      whereCondition += ` AND PR.employee_id = '${employee_id}'`;
    }

    const query = `
      SELECT DISTINCT 
        PA.*, 
        PR.id AS PO_id,
        PR.po_category,
        PR.po_type,
        PR.po_number,
        PR.po_remark,
        PR.final_status,
        PR.financial_year_id,
        PR.entity_id,
        PR.warehouse_id,
        PR.department_id,
        PR.cost_center_id,
        PR.vendor_id,
        PR.total_purchase,
        PR.purchase_request_id,
        HRU.first_name,
        HRU.last_name,
        MD.department_name,
        MD.department_code,
        F.cost_center_name,
        F.cost_center_code
      FROM PROCUREMENT_PURCHASE_ORDER_APPROVAL AS PA
      JOIN PROCUREMENT_PURCHASE_ORDER AS PR ON PR.id = PA.purchase_order_id
      INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PR.employee_id
      JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
      JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
      WHERE ${whereCondition}
      ORDER BY PA.id DESC;
    `;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData && getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message:
          userRoleId === 1
            ? "Fetched All Approved POs (Superadmin View) Successfully !"
            : "Fetched All Approved POs for Creator Successfully !",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message:
          userRoleId === 1
            ? "No Approved POs Found (Superadmin View)!"
            : "No Approved POs Found for This Employee (as Creator)!",
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

exports.getCHAForwarderList = async (req, res) => {
  try {
    const { page } = req.query;
    let auditStatus = [];

    if (page === "TRANSPORT") {
      auditStatus = ["CHA_BILL_GENERATED", "OUT_FOR_DELIVERY", "RECEIVED"];
    } else if (page === "CHA") {
      auditStatus = [
        "ARRIVED",
        "CLEARANCE",
        "BOE_APPROVED",
        "ITEMS_CLAIM",
        "CHA_APPROVED",
        "CHA_BILL_GENERATED",
        "OUT_FOR_DELIVERY",
        "RECEIVED",
      ];
    } else if (page === "FORWARDER") {
      auditStatus = [
        "FORWARDER_ARRIVED",
        "ARRIVED",
        "CLEARANCE",
        "BOE_APPROVED",
        "ITEMS_CLAIM",
        "CHA_APPROVED",
        "CHA_BILL_GENERATED",
        "OUT_FOR_DELIVERY",
        "RECEIVED",
      ];
    }

    const query = `
      SELECT DISTINCT SAS.*,PR.po_number,CONCAT(V.vendor_name, ' - ', V.vendor_code) AS vendorName,V.contact_number
      FROM SHIPPING_ALERT_SCHEDULE AS SAS
      JOIN PROCUREMENT_PURCHASE_ORDER AS PR ON PR.id = SAS.po_id
      INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = SAS.vendor_id AND V.vendor_category = 'International'
      WHERE SAS.audit IN (:auditStatus) AND SAS.mode NOT IN ('COURIER')  ORDER BY SAS.createdAt DESC;`;

    const getAllData = await db.sequelize.query(query, {
      replacements: { auditStatus },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully !",
      data: getAllData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

async function updateStatusCHA(id, status, employee_id) {
  await db.createShippingAlert.update({ audit: status }, { where: { id } });
  await db.shippingAlertHistory.create({
    shipping_alert_id: id,
    shipped_status: status,
    employee_id: employee_id,
  });
}

async function currencyConverterAPI(vendorCurrency) {
  try {
    // 1 API call to get latest rates with INR as base
    const response = await fetch("https://open.er-api.com/v6/latest/INR");
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    // 2 Parse JSON response
    const data = await response.json();

    // 3 Check if rates exist
    if (!data.rates) {
      throw new Error("No rates data available");
    }

    // 4 Get vendor currency rate
    const rate = data.rates[vendorCurrency];
    if (!rate) {
      throw new Error(`Exchange rate for ${vendorCurrency} not found`);
    }

    // If API gives decimal < 1, assume base INR → divide to get INR per vendor currency
    let inrPerVendorCurrency = rate < 1 ? 1 / rate : rate;

    return parseFloat(inrPerVendorCurrency.toFixed(4)); // round to 4 decimals
  } catch (error) {
    console.error("Currency API error:", error.message);
    return null; // fallback if API fails
  }
}

exports.getCHAForwarderModeList = async (req, res) => {
  try {
    const { id } = req.query;

    const query = db.createShippingAlert.findOne({ where: { id } });

    const record = await query;

    if (record?.audit === "ARRIVED") {
      await updateStatusCHA(id, "CLEARANCE", req.user?.employee_id);
    }

    // Vendor Data
    const baseQuery = `
      SELECT SAS.*,PR.po_number,CONCAT(V.vendor_name, ' - ', V.vendor_code) AS vendorName,V.contact_number,VC.Currency_Type
      ,CONCAT(PP.port_name, ' - ', PP.unlocode) AS pickup, CONCAT(DP.port_name, ' - ', DP.unlocode) AS delivery,V.advance_amount,
      CONCAT(W.name, ' - ', W.code, ', ',W.address, ', ',W.pin) AS wdelivery, V.vendor_category, SAS.departure_location, 
      SAS.port_id, W.address AS delivery_location
      FROM SHIPPING_ALERT_SCHEDULE AS SAS
      JOIN PROCUREMENT_PURCHASE_ORDER AS PR ON PR.id = SAS.po_id
      INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = SAS.vendor_id
      INNER JOIN MASTER_CURRENCY_CONVERT AS VC ON VC.Currency_Convert_id = PR.currency_id
      LEFT JOIN MASTER_PORT AS PP ON PP.id = SAS.port_id
      LEFT JOIN MASTER_PORT AS DP ON DP.id = PR.port_id
      INNER JOIN WAREHOUSE_MASTER AS W ON W.id = PR.warehouse_id
      WHERE SAS.id = :id;
    `;

    const [mainData] = await db.sequelize.query(baseQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    // Trans Mode decide from Vendor
    let modeTable = "";
    switch (mainData.mode) {
      case "ROAD":
        modeTable = "SHIPPING_TRNS_MODE_ROAD";
        break;
      case "RAIL":
        modeTable = "SHIPPING_TRNS_MODE_RAIL";
        break;
      case "SEA":
        modeTable = "SHIPPING_TRNS_MODE_SEA";
        break;
      case "AIR":
        modeTable = "SHIPPING_TRNS_MODE_AIR";
        break;
    }

    // Mode data fetch
    let modeData = null;

    if (modeTable) {
      const modeQuery = `
        SELECT * FROM ${modeTable}
        WHERE shipping_alert_id = :id AND status = 'ACTIVE'
        LIMIT 1;
      `;

      const [modeResult] = await db.sequelize.query(modeQuery, {
        replacements: { id },
        type: db.sequelize.QueryTypes.SELECT,
      });

      if (modeResult) {
        const {
          id,
          shipping_alert_id,
          updatedAt,
          status,
          entryType,
          lastUpdatedBy,
          ...rest
        } = modeResult;
        modeData = rest; // unwanted fields removed
      } else {
        modeData = null;
      }
    }

    // BOE Details
    const BOEQuery = `
      SELECT BOE.*,CONCAT(U.first_name, ' ',U.last_name, ' - ', U.employee_code) AS userName
      FROM SHIPPING_BOE_DETAILS AS BOE
      JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = BOE.lastUpdatedBy
      WHERE BOE.shipping_alert_id = :id;
    `;

    const [BOEDetails] = await db.sequelize.query(BOEQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    // currency converter
    const amtDetails = { exchange_rate: 0, invoice_amount: 0 };
    if (BOEDetails) {
      amtDetails.exchange_rate = parseFloat(BOEDetails.exchange_rate || 0);
      amtDetails.invoice_amount = parseFloat(BOEDetails.invoice_amount || 0);
    } else {
      if (mainData.Currency_Type === "INR") {
        amtDetails.exchange_rate = 1;
        amtDetails.invoice_amount = parseFloat(mainData.invoice_amount || 0);
      } else {
        const currentRate = await currencyConverterAPI(mainData.Currency_Type);
        if (!currentRate) {
          amtDetails.exchange_rate = 1; // INR Rate for API failure or missing currency
        } else {
          amtDetails.exchange_rate = parseFloat(currentRate || 0);
        }
        amtDetails.invoice_amount =
          parseFloat(mainData.invoice_amount || 0) * amtDetails.exchange_rate;
      }
    }
    amtDetails.invoice_amount = parseFloat(
      amtDetails.invoice_amount.toFixed(2),
    );

    // Item List
    const itemQuery = `
      SELECT SAI.*,CONCAT(I.item_name, ' - ', I.item_code) AS itemName,POI.unit_price
      FROM SHIPPING_ALERT_ITEMS AS SAI
      JOIN MASTER_ITEM AS I ON I.id = SAI.item_master_id
      INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.id = SAI.po_item_id
      AND POI.item_master_id = SAI.item_master_id
      WHERE SAI.shipping_alert_id = :id;
    `;

    const itemList = await db.sequelize.query(itemQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    // CHA Document List
    const docQuery = `SELECT D.* FROM SHIPPING_ALERT_DOCUMENTS AS D WHERE D.shipping_alert_id = :id;`;

    const docList = await db.sequelize.query(docQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    // Forwarder Details
    const ForQuery = `
      SELECT R.*,CONCAT(U.first_name, ' ',U.last_name, ' - ', U.employee_code) AS userName
      FROM SHIPPING_TRNS_MODE_ROAD AS R
      LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = R.lastUpdatedBy
      WHERE R.shipping_alert_id = :id AND R.status = 'ACTIVE' AND R.entryType = 'TRANSPORT';
    `;

    const [ForDetails] = await db.sequelize.query(ForQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    // Final Response
    const finalData = {
      ...mainData,
      modeData,
      BOEDetails,
      amtDetails,
      itemList,
      docList,
      ForDetails,
    };

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully !",
      data: finalData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.createOrUpdateBOE = async (req, res) => {
  try {
    let data = req.body;

    data.lastUpdatedBy = req.user?.employee_id;

    if (!data.id || data.id === "") {
      delete data.id;
      let result = await db.shippingBOEDetails.create(data);
      if (result) {
        await updateStatusCHA(
          data.shipping_alert_id,
          "BOE_APPROVED",
          req.user?.employee_id,
        );
      }
      return res
        .status(201)
        .json({ message: "BOE created successfully", id: result.id });
    }

    const existingData = await db.shippingBOEDetails.findOne({
      where: { id: data.id, shipping_alert_id: data.shipping_alert_id },
    });

    if (!existingData) {
      return res.status(404).json({ message: "Record not found" });
    }

    delete data.id;

    await db.shippingBOEDetails.update(
      { ...data },
      {
        where: {
          id: existingData.id,
          shipping_alert_id: existingData.shipping_alert_id,
        },
      },
    );

    return res
      .status(200)
      .json({ message: "BOE updated successfully", id: existingData.id });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.claimItemsCHA = async (req, res) => {
  try {
    let data = req.body;

    const results = await Promise.all(
      data.map((item) =>
        db.shippingAlertItems.update(
          { claim_qty: item.claim_qty },
          {
            where: {
              id: item.id,
              shipping_alert_id: item.shipping_alert_id,
            },
          },
        ),
      ),
    );

    // check if all updates happened
    const isSuccess = results.every((res) => res[0] > 0);

    if (isSuccess) {
      await db.createShippingAlert.update(
        { audit: "ITEMS_CLAIM", variance_remark: data[0].variance_remark },
        {
          where: {
            id: data[0].shipping_alert_id,
          },
        },
      );
      await db.shippingAlertHistory.create({
        shipping_alert_id: data[0].shipping_alert_id,
        shipped_status: "ITEMS_CLAIM",
        employee_id: req.user?.employee_id,
      });
    }

    return res.status(200).json({ message: "Item claimed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.updateCHACharges = async (req, res) => {
  try {
    const {
      id,
      cha_service_charges,
      cha_other_charges,
      documentsArray = [],
    } = req.body;

    // documents save
    let results = [];

    if (documentsArray.length > 0) {
      results = await Promise.all(
        documentsArray.map((name) =>
          db.shippingAlertDocuments.create({
            document_type: "Other",
            document_name: name,
            shipping_alert_id: id,
            entryType: "CHA",
          }),
        ),
      );
    }

    const isSuccess =
      documentsArray.length === 0 || results.length === documentsArray.length;

    if (isSuccess) {
      await db.createShippingAlert.update(
        { audit: "CHA_APPROVED", cha_service_charges, cha_other_charges },
        {
          where: { id },
        },
      );
    }

    return res
      .status(200)
      .json({ message: "CHA details updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.deleteCHADocument = async (req, res) => {
  try {
    const { id } = req.query;

    // 1. Document fetch from DB
    const doc = await db.shippingAlertDocuments.findOne({
      where: { id },
    });

    if (!doc) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // 2. Dynamic file path
    const filePath = path.join(
      process.cwd(),
      "uploaded_files",
      "cha_documents",
      doc.document_name,
    );

    // 3. Delete file from folder
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      } else {
        console.log("File not found on server:", filePath);
      }
    } catch (err) {
      console.log("File delete error:", err.message);
    }

    // 4. Delete from DB
    await db.shippingAlertDocuments.destroy({
      where: { id },
    });

    // 5. Response
    return res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete API Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.generateCHABill = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const record = await db.createShippingAlert.findOne({ where: { id } });

    if (record?.audit !== "CHA_APPROVED") {
      return res
        .status(400)
        .json({ message: "CHA must be approved before generating bill" });
    }

    await updateStatusCHA(id, "CHA_BILL_GENERATED", req.user?.employee_id);

    return res.status(200).json({ message: "CHA Bill generated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.createOrUpdateForwarder = async (req, res) => {
  try {
    let data = req.body;
    let id = 0;

    const {
      freight_charges,
      loading_unloading_charges,
      port_to_warehouse_charges,
      entryType,
      vehicle_number,
      driver_name,
      driver_mobile,
      transporter_name,
      lr_number,
    } = data;

    data.lastUpdatedBy = req.user?.employee_id;

    await db.createShippingAlert.update(
      { freight_charges, loading_unloading_charges, port_to_warehouse_charges },
      {
        where: { id: data.shipping_alert_id },
      },
    );

    if (entryType === "TRANSPORT") {
      const roadData = {
        entryType,
        vehicle_number,
        driver_name,
        driver_mobile,
        transporter_name,
        lr_number,
        shipping_alert_id: data.shipping_alert_id,
        lastUpdatedBy: data.lastUpdatedBy,
      };
      const existingRoad = await db.shippingTransportModeRoad.findOne({
        where: { shipping_alert_id: data.shipping_alert_id },
      });
      if (existingRoad) {
        await db.shippingTransportModeRoad.update(roadData, {
          where: { id: existingRoad.id },
        });
        id = existingRoad.id;
      } else {
        const result = await db.shippingTransportModeRoad.create(roadData);
        id = result.id;
      }
    }

    // Save or update transport mode details based on data.mode
    if (data.mode === "ROAD" && data.road) {
      const roadData = {
        ...data.road,
        shipping_alert_id: data.shipping_alert_id,
      };
      const existingRoad = await db.shippingTransportModeRoad.findOne({
        where: { shipping_alert_id: data.shipping_alert_id },
      });
      if (existingRoad) {
        await db.shippingTransportModeRoad.update(roadData, {
          where: { id: existingRoad.id },
        });
        id = existingRoad.id;
      } else {
        const result = await db.shippingTransportModeRoad.create(roadData);
        id = result.id;
      }
    } else if (data.mode === "COURIER" && data.courier) {
      const courierData = {
        ...data.courier,
        shipping_alert_id: data.shipping_alert_id,
      };
      const existingCourier = await db.shippingTransportModeCourier.findOne({
        where: { shipping_alert_id: data.shipping_alert_id },
      });
      if (existingCourier) {
        await db.shippingTransportModeCourier.update(courierData, {
          where: { id: existingCourier.id },
        });
        id = existingCourier.id;
      } else {
        const result =
          await db.shippingTransportModeCourier.create(courierData);
        id = result.id;
      }
    } else if (data.mode === "AIR" && data.air) {
      const airData = {
        ...data.air,
        shipping_alert_id: data.shipping_alert_id,
      };
      const existingAir = await db.shippingTransportModeAir.findOne({
        where: { shipping_alert_id: data.shipping_alert_id },
      });
      if (existingAir) {
        await db.shippingTransportModeAir.update(airData, {
          where: { id: existingAir.id },
        });
        id = existingAir.id;
      } else {
        const result = await db.shippingTransportModeAir.create(airData);
        id = result.id;
      }
    } else if (data.mode === "SEA" && data.sea) {
      const containers = data.sea.containers || [];
      const firstContainer = containers[0] || {};

      const containerNumbers = containers
        .map((c) => c.container_number)
        .filter(Boolean)
        .join(", ");
      const containerTypes = containers
        .map((c) => c.container_type)
        .filter(Boolean)
        .join(", ");
      const sealNumbers = containers
        .map((c) => c.seal_number)
        .filter(Boolean)
        .join(", ");

      const seaData = {
        ...data.sea,
        container_number:
          containerNumbers || firstContainer.container_number || "",
        container_type:
          containerTypes || firstContainer.container_type || "20FT",
        seal_number: sealNumbers || firstContainer.seal_number || "",
        containers: JSON.stringify(containers),
        shipping_alert_id: data.shipping_alert_id,
      };
      const existingSea = await db.shippingTransportModeSea.findOne({
        where: { shipping_alert_id: data.shipping_alert_id },
      });
      if (existingSea) {
        await db.shippingTransportModeSea.update(seaData, {
          where: { id: existingSea.id },
        });
        id = existingSea.id;
      } else {
        const result = await db.shippingTransportModeSea.create(seaData);
        id = result.id;
      }
    }

    if (data.buttonAction === "out") {
      await updateStatusCHA(
        data.shipping_alert_id,
        "OUT_FOR_DELIVERY",
        req.user?.employee_id,
      );
    } else if (data.buttonAction === "FORWARDER") {
      await updateStatusCHA(
        data.shipping_alert_id,
        "ARRIVED",
        req.user?.employee_id,
      );
    }

    return res
      .status(200)
      .json({ message: "Forwarder details updated successfully", id: id });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.getGateInwardList = async (req, res) => {
  try {
    let auditStatus = ["OUT_FOR_DELIVERY", "RECEIVED"];

    const query = `
      SELECT DISTINCT SAS.*,PR.po_number,CONCAT(V.vendor_name, ' - ', V.vendor_code) AS vendorName,V.contact_number
      FROM SHIPPING_ALERT_SCHEDULE AS SAS
      JOIN PROCUREMENT_PURCHASE_ORDER AS PR ON PR.id = SAS.po_id
      INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = SAS.vendor_id
      WHERE SAS.audit IN (:auditStatus) ORDER BY SAS.createdAt DESC;`;

    const getAllData = await db.sequelize.query(query, {
      replacements: { auditStatus },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully !",
      data: getAllData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.receivedPOFromGateInward = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const record = await db.createShippingAlert.findOne({ where: { id } });

    if (!record) {
      return res.status(400).json({ message: "Record not found" });
    }

    if (record.audit !== "OUT_FOR_DELIVERY") {
      return res.status(400).json({
        message: `Status change not allowed. Current status is ${record.audit}`,
      });
    }

    await updateStatusCHA(id, "RECEIVED", req.user?.employee_id);

    return res.status(200).json({ message: "PO Received successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.deletePO = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const po_id = req.params.po_id;
    const po = await db.purchase_order.findOne({
      where: { id: po_id, isDeleted: false },
      transaction,
    });

    if (!po) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ code: 404, message: "Purchase Order not found" });
    }

    if (po.final_status === "APPROVED" || po.final_status === "REJECTED") {
      await transaction.rollback();
      return res.status(400).send({
        code: 400,
        message: "Only PENDING or draft Purchase Orders can be deleted",
      });
    }

    // Soft delete PO
    await po.update({ isDeleted: true, status: "INACTIVE" }, { transaction });

    // Soft delete PO items
    await db.purchase_order_item.update(
      { isDeleted: true, status: "INACTIVE" },
      { where: { purchase_order_id: po_id }, transaction },
    );

    // Soft delete PO images
    await db.purchase_order_image.update(
      { isDeleted: true, status: "INACTIVE" },
      { where: { purchase_order_id: po_id }, transaction },
    );

    await transaction.commit();
    return res
      .status(200)
      .send({ code: 200, message: "Purchase Order deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in deletePO:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getQuantityLedger = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required parameter: entity_id",
      });
    }

    const query = `
      SELECT * FROM (
          SELECT 
              PR.pr_number,
              PRI.id AS pr_item_id,
              IM.item_name,
              IM.item_code,
              PRI.quantity AS total_pr_qty,
              
              -- Qty on RFP
              CASE WHEN EXISTS (
                  SELECT 1
                  FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
                  WHERE VP.procurement_product_id = PRI.id
              ) THEN PRI.quantity ELSE 0 END AS rfp_qty,

              -- Qty in Negotiation
              CASE WHEN EXISTS (
                  SELECT 1
                  FROM PROCUREMENT_PURCHASE_NEGOTIATION_ITEM AS VND
                  WHERE VND.item_id = PRI.id OR VND.service_id = PRI.id
              ) THEN PRI.quantity ELSE 0 END AS nego_qty,

              -- Qty on PO
              COALESCE((
                  SELECT SUM(POI.quantity)
                  FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS POI
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                  WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                    AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                    AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
              ), 0) AS po_qty,

              -- Qty in Shipping Alert
              COALESCE((
                  SELECT SUM(SAI.quantity)
                  FROM SHIPPING_ALERT_ITEMS AS SAI
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.id = SAI.po_item_id
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                  WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                    AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                    AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
                    AND SAI.status = 'ACTIVE'
              ), 0) AS ship_qty,

              -- Qty GRN'd
              COALESCE((
                  SELECT SUM(GRNI.receiveQty)
                  FROM GRN_ITEM AS GRNI
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.id = GRNI.po_item_id
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                  WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                    AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                    AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
                    AND GRNI.isDeleted = 0 AND GRNI.status = 'ACTIVE'
              ), 0) AS grn_qty,

              -- Current Stage
              CASE 
                  WHEN COALESCE((
                      SELECT SUM(GRNI.receiveQty)
                      FROM GRN_ITEM AS GRNI
                      INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.id = GRNI.po_item_id
                      INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                      WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                        AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                        AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
                        AND GRNI.isDeleted = 0 AND GRNI.status = 'ACTIVE'
                  ), 0) >= PRI.quantity THEN 'GRN'
                  WHEN COALESCE((
                      SELECT SUM(SAI.quantity)
                      FROM SHIPPING_ALERT_ITEMS AS SAI
                      INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.id = SAI.po_item_id
                      INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                      WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                        AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                        AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
                        AND SAI.status = 'ACTIVE'
                  ), 0) > 0 THEN 'Shipping Alert'
                  WHEN COALESCE((
                      SELECT SUM(POI.quantity)
                      FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS POI
                      INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                      WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                        AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                        AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
                  ), 0) > 0 THEN 'PO'
                  WHEN EXISTS (
                      SELECT 1 FROM PROCUREMENT_PURCHASE_NEGOTIATION_ITEM AS VND 
                      WHERE VND.item_id = PRI.id OR VND.service_id = PRI.id
                  ) THEN 'Negotiation'
                  WHEN EXISTS (
                      SELECT 1 FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP 
                      WHERE VP.procurement_product_id = PRI.id
                  ) THEN 'RFP'
                  ELSE 'PR'
              END AS current_stage,
              
              PR.final_status AS pr_status,
              COALESCE((
                  SELECT MAX(PO.createdAt)
                  FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS POI
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                  WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                    AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                    AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
              ), PR.createdAt) AS sort_time,

              -- Numbers details
              (
                  SELECT GROUP_CONCAT(DISTINCT VP.rfp_number SEPARATOR ', ')
                  FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
                  WHERE VP.procurement_product_id = PRI.id
              ) AS rfp_numbers,
              (
                  SELECT GROUP_CONCAT(DISTINCT VN.negotiation_code SEPARATOR ', ')
                  FROM PROCUREMENT_PURCHASE_NEGOTIATION_ITEM AS VND
                  INNER JOIN PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VN ON VN.id = VND.negotiation_id
                  WHERE VND.item_id = PRI.id OR VND.service_id = PRI.id
              ) AS nego_numbers,
              (
                  SELECT GROUP_CONCAT(DISTINCT PO.po_number SEPARATOR ', ')
                  FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS POI
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                  WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                    AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                    AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
              ) AS po_numbers,
              (
                  SELECT GROUP_CONCAT(DISTINCT SP.shiped_no SEPARATOR ', ')
                  FROM SHIPPING_ALERT_ITEMS AS SAI
                  INNER JOIN SHIPPING_ALERT_SCHEDULE AS SP ON SP.id = SAI.shipping_alert_id
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.id = SAI.po_item_id
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                  WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                    AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                    AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
                    AND SAI.status = 'ACTIVE'
              ) AS ship_numbers,
              (
                  SELECT GROUP_CONCAT(DISTINCT GM.grn_number SEPARATOR ', ')
                  FROM GRN_ITEM AS GRNI
                  INNER JOIN GRN_MASTER AS GM ON GM.id = GRNI.grn_Id
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.id = GRNI.po_item_id
                  INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
                  WHERE PO.purchase_request_id = PRI.purchase_request_id AND POI.item_master_id = PRI.item_master_id
                    AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
                    AND POI.isDeleted = 0 AND POI.status = 'ACTIVE'
                    AND GRNI.isDeleted = 0 AND GRNI.status = 'ACTIVE'
              ) AS grn_numbers

          FROM PROCUREMENT_PURCHASE_REQUEST_ITEM AS PRI
          INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = PRI.purchase_request_id
          INNER JOIN MASTER_ITEM AS IM ON IM.id = PRI.item_master_id
          WHERE PRI.isDeleted = 0 AND PRI.status = 'ACTIVE'
            AND PR.isDeleted = 0 AND PR.status = 'ACTIVE'
            AND PR.entity_id = :entity_id

          UNION ALL

          SELECT 
              CONCAT('Direct PO: ', PO.po_number) AS pr_number,
              POI.id AS pr_item_id,
              IM.item_name,
              IM.item_code,
              POI.quantity AS total_pr_qty,
              
              0 AS rfp_qty,
              0 AS nego_qty,
              POI.quantity AS po_qty,

              -- Qty in Shipping Alert
              COALESCE((
                  SELECT SUM(SAI.quantity)
                  FROM SHIPPING_ALERT_ITEMS AS SAI
                  WHERE SAI.po_item_id = POI.id
                    AND SAI.status = 'ACTIVE'
              ), 0) AS ship_qty,

              -- Qty GRN'd
              COALESCE((
                  SELECT SUM(GRNI.receiveQty)
                  FROM GRN_ITEM AS GRNI
                  WHERE GRNI.po_item_id = POI.id
                    AND GRNI.isDeleted = 0 AND GRNI.status = 'ACTIVE'
              ), 0) AS grn_qty,

              -- Current Stage
              CASE 
                  WHEN COALESCE((
                      SELECT SUM(GRNI.receiveQty)
                      FROM GRN_ITEM AS GRNI
                      WHERE GRNI.po_item_id = POI.id
                        AND GRNI.isDeleted = 0 AND GRNI.status = 'ACTIVE'
                  ), 0) >= POI.quantity THEN 'GRN'
                  WHEN COALESCE((
                      SELECT SUM(SAI.quantity)
                      FROM SHIPPING_ALERT_ITEMS AS SAI
                      WHERE SAI.po_item_id = POI.id
                        AND SAI.status = 'ACTIVE'
                  ), 0) > 0 THEN 'Shipping Alert'
                  ELSE 'PO'
              END AS current_stage,
              
              PO.final_status AS pr_status,
              PO.createdAt AS sort_time,

              -- Numbers details
              NULL AS rfp_numbers,
              NULL AS nego_numbers,
              PO.po_number AS po_numbers,
              (
                  SELECT GROUP_CONCAT(DISTINCT SP.shiped_no SEPARATOR ', ')
                  FROM SHIPPING_ALERT_ITEMS AS SAI
                  INNER JOIN SHIPPING_ALERT_SCHEDULE AS SP ON SP.id = SAI.shipping_alert_id
                  WHERE SAI.po_item_id = POI.id
                    AND SAI.status = 'ACTIVE'
              ) AS ship_numbers,
              (
                  SELECT GROUP_CONCAT(DISTINCT GM.grn_number SEPARATOR ', ')
                  FROM GRN_ITEM AS GRNI
                  INNER JOIN GRN_MASTER AS GM ON GM.id = GRNI.grn_Id
                  WHERE GRNI.po_item_id = POI.id
                    AND GRNI.isDeleted = 0 AND GRNI.status = 'ACTIVE'
              ) AS grn_numbers

          FROM PROCUREMENT_PURCHASE_ORDER_ITEM AS POI
          INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = POI.purchase_order_id
          INNER JOIN MASTER_ITEM AS IM ON IM.id = POI.item_master_id
          WHERE POI.isDeleted = 0 AND POI.status = 'ACTIVE'
            AND PO.isDeleted = 0 AND PO.status = 'ACTIVE'
            AND (PO.purchase_request_id IS NULL OR PO.purchase_request_id = 0)
            AND PO.entity_id = :entity_id
      ) AS combined
      ORDER BY combined.sort_time DESC;
    `;

    const data = await db.sequelize.query(query, {
      replacements: { entity_id: parseInt(entity_id, 10) },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched Quantity Ledger Successfully",
      data,
    });
  } catch (error) {
    console.error("Error in getQuantityLedger:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.downloadPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ SECURE QUERY
    const valueData = await db.sequelize.query(
      `SELECT 
    P.*, 
    V.vendor_name, 
    V.vendor_address, 
    V.contact_number,
    C.symbols AS currency, 
    C.rate AS exchange_rate, 
    V.gst_in, 
    V.vendor_pincode, 
    E.entity_name,
    E.tax_registration_number AS entity_gst_in, 
    E.registered_office, 
    E.logo, 
    W.address AS warehouse_address, 
    W.pin AS warehouse_pin, 
    W.postal_address,
    VSAM.gst_in AS vendor_gstin, 
    VBA.gst_in AS vendor_billing_gstin,
    ST.states_name, ST.states_code

FROM PROCUREMENT_PURCHASE_ORDER P

LEFT JOIN VENDOR_BASIC_DETAILS V 
    ON V.id = P.vendor_id

LEFT JOIN MASTER_STATE ST
    ON ST.states_id = V.state_id

LEFT JOIN MASTER_CURRENCY_CONVERT C 
    ON C.Currency_Convert_id = V.currency_id

LEFT JOIN ENTITY_MASTER E 
    ON E.id = P.entity_id

LEFT JOIN WAREHOUSE_MASTER W 
    ON W.id = P.warehouse_id

LEFT JOIN VENDOR_BILLING_ADDRESS VBA 
    ON VBA.vendor_id = P.vendor_id

LEFT JOIN VENDOR_SHIPPING_ADDRESS_MST VSAM 
    ON VSAM.vendor_id = P.vendor_id

WHERE P.id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      },
    );

    const items = await db.sequelize.query(
      `SELECT POI.*, I.item_name, I.description, GRM.value AS gstRate, HSN.hsn_sac_code, MU.uom_name AS uom
       FROM PROCUREMENT_PURCHASE_ORDER_ITEM POI
       INNER JOIN MASTER_ITEM I ON I.id = POI.item_master_id
       INNER JOIN MASTER_HSN_SAC_CODE HSN ON HSN.id = I.hsn_code_id
       INNER JOIN GST_RATE_MASTER GRM ON GRM.id = HSN.gst_rate_id
       LEFT JOIN MASTER_UOM MU ON MU.uom_id = I.uom_id
       WHERE POI.purchase_order_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      },
    );

    // console.log("valueData", valueData);
    // console.log("items", items);

    if (!valueData.length) {
      return res.status(404).send({ message: "No Data Found" });
    }

    const header = valueData[0];

    // Determine interstate or intrastate tax type
    const entityGST = header.entity_gst_in || "";
    const vendorGST = header.vendor_gstin || header.vendor_billing_gstin || header.gst_in || "";
    const entityStateCode = entityGST.trim().substring(0, 2);
    const vendorStateCode = vendorGST.trim().substring(0, 2);
    const isInterState = entityStateCode && vendorStateCode && entityStateCode !== vendorStateCode;

    // ✅ GENERATE TABLE & CALCULATE TAXES
    const {
      html: itemsTable,
      totalQty,
      totalTaxableAmt,
      totalCGSTAmt,
      totalSGSTAmt,
      totalIGSTAmt,
    } = generatePOItemsTable(items, isInterState);

    const sub_total = totalTaxableAmt;
    const gst_tax_amount = totalCGSTAmt + totalSGSTAmt + totalIGSTAmt;
    const bill_amount = sub_total + gst_tax_amount;
    const amountInWords = convertNumberToWords(bill_amount);

    // ✅ LOAD TEMPLATE
    const htmlPath = path.resolve(
      __dirname,
      "../../../../src/assets/templates/purchase_order.html",
    );

    let html = fs.readFileSync(htmlPath, "utf-8");

    // ✅ BIND DATA
    const bindData = (template, data) => {
      return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] !== undefined ? data[key.trim()] : "");
    };

    const logoPath = path.join(
      __dirname,
      "../../../../src/assets/selected-logo.jpg",
    );
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    let mainAddress =
      `${header?.warehouse_address}, ${header?.warehouse_pin}` ||
      "Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004";

    const formatCurrency = (val) => {
      return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
    };

    html = bindData(html, {
      heading: "PURCHASE ORDER",
      entityName: header.entity_name,
      entityAddress: header.registered_office,
      entity_gst_in: `${header.entity_gst_in || "-"}`,
      entityLogo: logoBase64,
      mainAddress: mainAddress,
      RefDocNo: header.ref_doc_no || "KG/26-27/0280",
      RefDocDate: header.ref_doc_date ? moment(header.ref_doc_date).format("DD/MM/YYYY") : "-",
      po_number: header.po_number,
      po_date: header.po_date ? moment(header.po_date).format("DD/MM/YYYY") : "-",
      ParentDocNo: header.parent_doc_no || "HRF/PRQ/26/0027",

      vendor_name: header.vendor_name,
      vendor_address: header.vendor_address,
      vendor_pincode: header.vendor_pincode || "-",
      vendor_gstin: `${header.vendor_gstin || header.vendor_billing_gstin || header.gst_in || "-"}`,
      vendor_state: header.states_name,
      vendor_state_code: header.states_code,

      warehouse_address: header.warehouse_address || "-",
      warehouse_pin: header.warehouse_pin || "-",

      itemsTable,
      total_qty: totalQty.toFixed(2),

      sub_total: formatCurrency(sub_total),
      gst_tax_amount: formatCurrency(gst_tax_amount),
      bill_amount: formatCurrency(bill_amount),
      amount_in_words: `₹ ${amountInWords}`,
      po_remark: header.po_remark || "-",

      delivery_term: header.delivery_term || "-",
      payment_term: header.payment_term || "-",
      delivery_term_remark: header.delivery_term_remark || "",
      payment_term_remark: header.payment_term_remark || "",
      prepared_by: header.prepared_by || "Muniraju K",
    });

    const pdfBuffer = await generatePDF(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=grn.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

function generatePOItemsTable(items, isInterState) {
  let html = "";
  let i = 1;
  let totalQty = 0;
  let totalTaxableAmt = 0;
  let totalCGSTAmt = 0;
  let totalSGSTAmt = 0;
  let totalIGSTAmt = 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  items.forEach((item) => {
    const qty = Number(item.quantity || 0);
    const rate = Number(item.unit_price || 0);
    const taxableAmt = Number(item.total_mvp || (qty * rate));
    const gstRate = Number(item.gstRate || 0);

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (isInterState) {
      igstAmount = taxableAmt * (gstRate / 100);
    } else {
      cgstAmount = taxableAmt * ((gstRate / 2) / 100);
      sgstAmount = taxableAmt * ((gstRate / 2) / 100);
    }

    totalQty += qty;
    totalTaxableAmt += taxableAmt;
    totalCGSTAmt += cgstAmount;
    totalSGSTAmt += sgstAmount;
    totalIGSTAmt += igstAmount;

    html += `
      <tr>  
        <td style="text-align: center; border: 1px solid #000;">${i++}</td>
        <td style="border: 1px solid #000;">${item.item_name || ""}</td>
        <td style="text-align: center; border: 1px solid #000;">${item.hsn_sac_code || ""}</td>
        <td style="text-align: right; border: 1px solid #000;">${qty.toFixed(2)}</td>
        <td style="text-align: center; border: 1px solid #000;">${item.uom || "NOS"}</td>
        <td style="text-align: right; border: 1px solid #000;">${formatCurrency(rate)}</td>
        <td style="text-align: right; border: 1px solid #000;">${formatCurrency(taxableAmt)}</td>
        <td style="text-align: center; border: 1px solid #000;">${gstRate}</td>
        <td style="text-align: right; border: 1px solid #000;">${formatCurrency(cgstAmount)}</td>
        <td style="text-align: right; border: 1px solid #000;">${formatCurrency(sgstAmount)}</td>
        <td style="text-align: right; border: 1px solid #000;">${formatCurrency(igstAmount)}</td>
      </tr>`;
  });

  html += `
    <tr style="font-weight: bold; background-color: #f2f2f2;">  
      <td colspan="3" style="text-align: right; border: 1px solid #000;">Total</td>
      <td style="text-align: right; border: 1px solid #000;">${totalQty.toFixed(2)}</td>
      <td style="border: 1px solid #000;"></td>
      <td style="border: 1px solid #000;"></td>
      <td style="text-align: right; border: 1px solid #000;">${formatCurrency(totalTaxableAmt)}</td>
      <td style="border: 1px solid #000;"></td>
      <td style="text-align: right; border: 1px solid #000;">${formatCurrency(totalCGSTAmt)}</td>
      <td style="text-align: right; border: 1px solid #000;">${formatCurrency(totalSGSTAmt)}</td>
      <td style="text-align: right; border: 1px solid #000;">${formatCurrency(totalIGSTAmt)}</td>
    </tr>`;

  return {
    html,
    totalQty,
    totalTaxableAmt,
    totalCGSTAmt,
    totalSGSTAmt,
    totalIGSTAmt,
  };
}

function convertNumberToWords(num) {
  if (num === 0) return "Zero Only";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const scales = [
    "", "Thousand", "Lac", "Crore"
  ];

  function twoDigits(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    let t = Math.floor(n / 10);
    let o = n % 10;
    return tens[t] + (o ? " " + ones[o] : "");
  }

  function threeDigits(n) {
    if (n === 0) return "";
    let h = Math.floor(n / 100);
    let r = n % 100;
    let str = "";
    if (h > 0) str += ones[h] + " Hundred";
    if (r > 0) str += (str ? " " : "") + twoDigits(r);
    return str;
  }

  function splitNumber(n) {
    let parts = [];
    parts.push(n % 1000); 
    n = Math.floor(n / 1000);
    while (n > 0) {
      parts.push(n % 100); 
      n = Math.floor(n / 100);
    }
    return parts;
  }

  function convertInteger(n) {
    if (n === 0) return "Zero";
    let parts = splitNumber(n);
    let words = [];
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i]) {
        let word = (i === 0) ? threeDigits(parts[i]) : twoDigits(parts[i]);
        if (word) {
          words.push(word + (scales[i] ? " " + scales[i] : ""));
        }
      }
    }
    return words.join(" ").trim();
  }

  let [integerPart, decimalPart] = num.toFixed(2).split(".");
  let intNum = parseInt(integerPart, 10);
  let decNum = parseInt(decimalPart, 10);

  let result = convertInteger(intNum);
  if (decNum > 0) {
    result += " And Paisa " + convertInteger(decNum);
  }
  return result + " Only";
}
