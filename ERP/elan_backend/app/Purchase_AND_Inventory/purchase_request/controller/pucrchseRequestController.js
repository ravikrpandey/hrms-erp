const db = require("../../../models/index");
const WorkFlow = db.WorkFlow_Master;
const userdetail = db.user;
const logger = require("../../../../logger/index");
const { QueryTypes, Op } = require("sequelize");
const { generatePDF } = require("../../../../app/common/pdfConverter");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

exports.createPer = async (req, res) => {
  try {
    const {
      entity_id,
      financial_year_id,
      cost_center_id,
      billing_branch_id,
      warehouse_id,
      department_id,
      pr_category,
      pr_date,
      pr_number,
      pr_type,
      employee_id,
      remark,
      uploade_image,
      item_detail,
      service_detail,
      total_purchase,
      remainingAmount,
    } = req.body;

    function convertToIST(utcDateString) {
      const date = new Date(utcDateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return new Date(date.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
    }

    let startDate = convertToIST(pr_date);

    const departmentInfo = await db.department.findOne({
      where: { dept_id: department_id, isDeleted: false, status: "ACTIVE" },
      attributes: ["dept_id", "department_name"],
    });
    if (!departmentInfo) {
      return res
        .status(500)
        .send({ code: 500, message: "Department not found!" });
    }
    const getData = await WorkFlow.findAll({
      where: {
        entity_id: entity_id,
        department_id: department_id,
        job_name: "Purchase",
      },
    });

    if (!getData || getData.length === 0) {
      return res.status(500).send({
        code: 500,
        message:
          "Workflow is not created for required department for Purchase!",
      });
    } else {
      const response = await db.purchase_details.create({
        entity_id,
        financial_year_id,
        cost_center_id,
        billing_branch_id,
        warehouse_id,
        department_id: department_id,
        pr_category,
        pr_date: startDate,
        pr_number,
        pr_type,
        remark,
        employee_id,
        total_purchase,
      });

      if (Array.isArray(uploade_image) && uploade_image.length > 0) {
        await Promise.all(
          uploade_image.map(async (image) => {
            await db.purchase_imgae.create({
              uploade_image: image,
              purchase_details_id: response.id,
              entity_id: entity_id,
              department_id: department_id,
              financial_year_id: financial_year_id,
            });
          }),
        );
      }

      let itemResults = [];
      if (Array.isArray(item_detail) && item_detail.length > 0) {
        itemResults = await Promise.all(
          item_detail.map(async (data) => {
            const itemDetails = {
              item_master_id: data.item_master_id,
              purchase_request_id: response.id,
              item_categroy_id: data.item_categroy_id,
              priority: data.priority,
              total_mvp: data.total_mvp,
              quantity: data.quantity,
              tax: data.tax,
              grand_total: data.grand_total,
            };

            const itemRecord = await db.purchase_item.create(itemDetails);
            if (Array.isArray(data.vendor_ids) && data.vendor_ids.length > 0) {
              const vendorEntries = data.vendor_ids.map(async (vendor_id) => {
                await db.purchase_vendor.create({
                  Purchase_req_item_id: itemRecord.id,
                  vendor_id: vendor_id,
                  Purchase_req_id: response.id,
                });
              });

              await Promise.all(vendorEntries);
            }
            return itemRecord;
          }),
        );
      } else {
        console.log("No valid Item details found");
      }

      const getLevels = await db.Work_Flow_range.findAll({
        where: {
          workflow_id: getData[0].id,
          status: "ACTIVE",
        },
        attributes: ["level", "employee_id", "role_id", "workflow_id"],
      });
      const levelPromises = getLevels.map(async (level) => {
        const createdLevel = await db.procurement_approval.create({
          level: level.level,
          employee_id: level.employee_id,
          workflow_id: level.workflow_id,
          purchase_request_id: response.id,
          role_id: level.role_id,
          workflow_type: "Purchase",
          entity_id: entity_id,
          department_id: department_id,
          financial_year_id: financial_year_id,
        });
        return createdLevel;
      });
      await Promise.all(levelPromises);

      return res.status(200).send({
        code: 200,
        message: "Created PR Successfully!",
        data: response,
        itemResults,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_levels_to_be_approved_pr = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const { entity_id, financial_year_id } = req.body;

    const query = `
        SELECT DISTINCT PA.id AS approval_id, PA.level, PA.approvel_status AS final_status, PA.progressStatus,
        PA.employee_id, PA.workflow_id, PR.id,
        PR.pr_category, PR.pr_date, PR.pr_number, PR.pr_type, PR.total_purchase,
        PR.remark, PR.entity_id, PR.financial_year_id, PR.cost_center_id, PR.warehouse_id,
        PR.department_id, MD.department_name, WM.name, F.cost_center_name, 
        CONCAT(HRU.first_name, ' ', HRU.last_name) AS created_by
        FROM PROCUREMENT_PURCHASE_REQUEST_APPROVAL AS PA
        JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = PA.purchase_request_id
        INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id
        JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        JOIN WAREHOUSE_MASTER AS WM ON WM.id = PR.warehouse_id
        JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
        WHERE PA.employee_id = :employeeId
        AND PA.status = 'ACTIVE' 
        AND PA.approvel_status = 'PENDING'
        AND PR.entity_id = :entityId
        AND PR.financial_year_id = :financialYearId
        AND NOT EXISTS (
          SELECT 1 
          FROM PROCUREMENT_PURCHASE_REQUEST_APPROVAL AS prev
          WHERE prev.purchase_request_id = PR.id 
            AND prev.level < PA.level
            AND prev.approvel_status != 'APPROVED'
        )
        `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        employeeId: employee_id,
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All PR Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found!",
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

exports.get_Rejected_Approvals_pr = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const { entity_id, financial_year_id } = req.body;

    const query = `
      SELECT DISTINCT PA.*, PR.*, MD.department_name, WM.name, F.cost_center_name,
        CONCAT(HRU.first_name, ' ', HRU.last_name) AS created_by
      FROM PROCUREMENT_PURCHASE_REQUEST_APPROVAL AS PA
      JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = PA.purchase_request_id
      JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
      JOIN WAREHOUSE_MASTER AS WM ON WM.id = PR.warehouse_id
      JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
      INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id
      WHERE PA.employee_id = :employeeId
      AND PR.entity_id = :entityId
      AND PR.financial_year_id = :financialYearId
      AND PA.approvel_status = 'REJECTED'
      ORDER BY PA.id DESC;
        `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        employeeId: employee_id,
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Rejected Approvals Successfully!",
        data: getAllData,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Rejected Approvals Found!", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_Approved_Approvals_pr = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const { entity_id, financial_year_id } = req.body;

    const query = `
      SELECT DISTINCT PA.*, PR.*, MD.department_name, WM.name, F.cost_center_name,
        CONCAT(HRU.first_name, ' ', HRU.last_name) AS created_by
      FROM PROCUREMENT_PURCHASE_REQUEST_APPROVAL AS PA
      JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = PA.purchase_request_id
      JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
      JOIN WAREHOUSE_MASTER AS WM ON WM.id = PR.warehouse_id
      JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
      INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id
      WHERE PA.employee_id = :employeeId
      AND PR.entity_id = :entityId
      AND PR.financial_year_id = :financialYearId
      AND PA.approvel_status = 'APPROVED'
      ORDER BY PA.id DESC;
      `;

    const getAllData = await db.sequelize.query(query, {
      replacements: {
        employeeId: employee_id,
        entityId: entity_id,
        financialYearId: financial_year_id,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData && getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Approved Approvals Successfully!",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Approved Approvals Found for This Employee!",
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

exports.approve_levels_pr = async (req, res) => {
  try {
    const pr_id = req.params.id;
    const {
      approvel_status,
      progressStatus,
      employee_id,
      final_status,
      workflow_type,
      remark,
    } = req.body;

    if (progressStatus && progressStatus.length > 20) {
      return res.status(400).send({
        code: 400,
        message: "Progress Status value is too long.",
      });
    }
    const allLevelsData = await db.procurement_approval.findAll({
      where: { employee_id, purchase_request_id: pr_id },
      order: [["level", "ASC"]],
    });

    if (!allLevelsData || allLevelsData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Level has been Assigned to this Employee!",
      });
    }

    const maxLevel = await db.procurement_approval.max("level", {
      where: { purchase_request_id: pr_id },
    });

    const currentLevelData = await db.procurement_approval.findOne({
      attributes: ["level"],
      where: { employee_id, purchase_request_id: pr_id },
    });

    const currentLevelValue = currentLevelData?.level;

    if (!currentLevelValue) {
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }

    await db.procurement_approval.update(
      { approvel_status, progressStatus, workflow_type: "Purchase", remark },
      { where: { employee_id, purchase_request_id: pr_id } },
    );

    if (approvel_status === "REJECTED") {
      await db.procurement_approval.update(
        { approvel_status },
        { where: { purchase_request_id: pr_id, employee_id } },
      );

      if (final_status === "REJECTED") {
        await db.purchase_details.update(
          { final_status: "REJECTED" },
          { where: { id: pr_id } },
        );
        return res.status(200).send({
          code: 200,
          message: "Purchase Request Rejected Successfully!",
        });
      }
    } else if (approvel_status === "APPROVED") {
      if (currentLevelValue === maxLevel) {
        await db.purchase_details.update(
          { final_status: "APPROVED" },
          { where: { id: pr_id } },
        );
      }
      await db.procurement_approval.update(
        { approvel_status: "APPROVED" },
        { where: { level: currentLevelValue, purchase_request_id: pr_id } },
      );

      return res.status(200).send({
        code: 200,
        message: "Purchase Request Approved Successfully!",
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Approval Progressed to Next Level Successfully!",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Update Processed Successfully!",
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

exports.getAll_Approval_level_pr = async (req, res) => {
  try {
    const pr_id = req.params.pr_id;
    const { dep_id, workflow_type } = req.body;

    const getData = await db.procurement_approval.findAll({
      where: {
        purchase_request_id: pr_id,
        workflow_type,
      },
      attributes: [
        "approvel_status",
        "level",
        "employee_id",
        "remark",
        "workflow_type",
      ],
    });

    if (!getData || getData.length === 0) {
      return res.status(400).send({ code: 400, message: "Data not found" });
    }

    if (dep_id) {
      getData.forEach((levelInfo) => {
        // levelInfo.department_id = dep_id;
        levelInfo.workflow_type = req.body.workflow_type;
      });
    }

    const levelsWithNames = [];
    for (const levelInfo of getData) {
      const employeeInfo = await userdetail.findOne({
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

exports.get_item_master = async (req, res) => {
  try {
    const asset_id = req.params.id;
    const sub_category_id = req.params.sub_category_id;
    const item_type_id = req.query.item_type_id;

    let whereClause = {
      asset_id: asset_id,
      isDeleted: false,
      status: "ACTIVE",
      sub_category_id: sub_category_id,
    };

    if (
      item_type_id &&
      item_type_id !== "undefined" &&
      item_type_id !== "null"
    ) {
      whereClause.item_type_id = item_type_id;
    }

    const item_details = await db.ItemMaster.findAll({
      where: whereClause,
      include: [
        {
          model: db.imageDocument,
        },
        {
          model: db.hsn_sac_master,
          attributes: ["id", "gst_rate_id", "hsn_sac_code"],
          include: [
            {
              model: db.gst_rate_master,
              attributes: ["id", "value"],
            },
          ],
        },
      ],
    });
    if (item_details.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for the given asset ID." });
    }
    const items = item_details.map((item) => {
      const obj = item.toJSON();
      const gstRateValue = obj.MASTER_HSN_SAC_CODE.GST_RATE_MASTER.value;
      const halfGst = gstRateValue / 2;
      obj.igst = gstRateValue;
      obj.cgst = halfGst;
      obj.sgst = halfGst;
      return obj;
    });
    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully!",
      data: items,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).json({
      message: error.message || "An error occurred while fetching data.",
    });
  }
};

exports.get_employee_data = async (req, res) => {
  try {
    const employee_id = req.params.id;

    const data = await db.user.findAll({
      where: {
        employee_id: employee_id,
      },
      include: [
        {
          model: db.department,
          attributes: ["dept_id", "department_name"],
        },
      ],
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No employee found for the given employee ID." });
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully!",
      data: data,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching data." });
  }
};

exports.budget_data = async (req, res) => {
  try {
    const { department_id, financial_year_id, pr_type } = req.body;
    const data = await db.cost_center.findAll({
      where: {
        financial_year_id: financial_year_id,
        department_id: department_id,
        cost_center_type: pr_type,
      },
      include: [
        {
          model: db.financial_year,
        },
      ],
    });
    if (data) {
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched successfully!", data: data });
    } else {
      return res
        .status(403)
        .send({ code: 403, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: "An error occurred while fetching data." || error.message,
    });
  }
};

exports.get_all_pr = async (req, res) => {
  try {
    const { user_id, entity_id, user_role, financial_year_id } = req.query;
    let purchase_request_details;

    if (user_role == "Super Admin") {
      purchase_request_details = await db.sequelize.query(
        `SELECT DISTINCT PR.id, PR.pr_category, PR.pr_date, PR.pr_number, PR.pr_type, PR.total_purchase,
                PR.remark, PR.entity_id, PR.financial_year_id, PR.cost_center_id, PR.warehouse_id,
                PR.department_id, MD.department_name, WM.name, F.cost_center_name, HRU.first_name, HRU.last_name, PR.final_status,
                PRA.approvel_status AS approval_status
                FROM PROCUREMENT_PURCHASE_REQUEST AS PR
                JOIN PROCUREMENT_PURCHASE_REQUEST_IMAGE AS PI ON PI.purchase_details_id = PR.id
                JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
                INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PR.employee_id
                JOIN WAREHOUSE_MASTER AS WM ON WM.id = PR.warehouse_id
                JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
                INNER JOIN ESS_WORK_FLOW_MASTER AS EWF ON EWF.department_id = PR.department_id AND EWF.job_name = PR.pr_category
                LEFT JOIN PROCUREMENT_PURCHASE_REQUEST_APPROVAL AS PRA ON PRA.purchase_request_id = PR.id AND PRA.workflow_id = EWF.id AND PRA.workflow_type = PR.pr_category
                WHERE PR.entity_id = :entity_id AND PR.financial_year_id = :financial_year_id
                ORDER BY PR.id DESC`,
        {
          replacements: { entity_id, financial_year_id },
          type: db.sequelize.QueryTypes.SELECT,
        },
      );
    } else {
      purchase_request_details = await db.sequelize.query(
        `SELECT DISTINCT PR.id, PR.pr_category, PR.pr_date, PR.pr_number, PR.pr_type, PR.total_purchase,
                PR.remark, PR.entity_id, PR.financial_year_id, PR.cost_center_id, PR.warehouse_id,
                PR.department_id, MD.department_name, WM.name, F.cost_center_name, HRU.first_name, HRU.last_name, PR.final_status,
                PRA.approvel_status AS approval_status
                FROM PROCUREMENT_PURCHASE_REQUEST AS PR
                LEFT JOIN PROCUREMENT_PURCHASE_REQUEST_IMAGE AS PI ON PI.purchase_details_id = PR.id
                LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
                INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PR.employee_id
                LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = PR.warehouse_id
                LEFT JOIN FINANCE_COST_CENTER AS F ON PR.cost_center_id = F.id
                INNER JOIN ESS_WORK_FLOW_MASTER AS EWF ON EWF.department_id = PR.department_id AND EWF.job_name = 'Purchase'
                LEFT JOIN PROCUREMENT_PURCHASE_REQUEST_APPROVAL AS PRA ON PRA.purchase_request_id = PR.id AND PRA.workflow_id = EWF.id AND PRA.workflow_type = 'Purchase'
                WHERE PR.employee_id = :user_id AND PR.entity_id = :entity_id AND PR.financial_year_id = :financial_year_id
                ORDER BY PR.id DESC`,
        {
          replacements: { user_id, entity_id, financial_year_id },
          type: db.sequelize.QueryTypes.SELECT,
        },
      );
    }

    if (purchase_request_details.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "PR Details found",
        data: purchase_request_details,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message:
          "No PR Details found for the given user_id, entity_id, and financial_year_id",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Server Error" || error.message });
  }
};

exports.get_all_pr_id = async (req, res) => {
  try {
    const id = req.params.id;
    const [data] = await db.sequelize.query(
      `
        SELECT DISTINCT PR.id, PR.pr_category, PR.pr_date, PR.pr_number,
        PR.pr_type, PR.total_purchase, PR.remark, PR.entity_id,
        PR.financial_year_id, PR.cost_center_id, PR.warehouse_id, PR.billing_branch_id, PR.department_id, EM.entity_name,
        MD.department_name, FY.financial_year, FC.cost_center_name,
        MB.branch_name, HRM.employee_code, HRM.first_name, HRM.last_name, HRM.employee_id
        
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR 
        LEFT JOIN ENTITY_MASTER AS EM ON EM.id = PR.entity_id
        LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        LEFT JOIN MASTER_FINANCIAL_YEAR AS FY ON FY.id = PR.financial_year_id
        LEFT JOIN FINANCE_COST_CENTER AS FC ON FC.id = PR.cost_center_id
        LEFT JOIN MASTER_BRANCH AS MB ON MB.id = PR.billing_branch_id
        LEFT JOIN HRMS_REGISTERED_USER AS HRM ON HRM.employee_id = PR.employee_id
        WHERE PR.id = :id 
      `,
      {
        replacements: { id },
      },
    );
    const [data_details] = await db.sequelize.query(
      `
        SELECT DISTINCT PRA.id, PRA.level,PRA.approvel_status,PRA.progressStatus,PRA.purchase_request_id,PRA.employee_id,PR.department_id,
        PRA.workflow_id
        FROM PROCUREMENT_PURCHASE_REQUEST_APPROVAL AS PRA 
        JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = PRA.purchase_request_id
        WHERE PRA.purchase_request_id = :id
         `,
      {
        replacements: { id },
      },
    );
    const [data_image] = await db.sequelize.query(
      `
        SELECT DISTINCT PM.id,PM.uploade_image,PM.purchase_details_id
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR
        JOIN PROCUREMENT_PURCHASE_REQUEST_IMAGE AS PM ON PM.purchase_details_id = PR.id
        WHERE PM.purchase_details_id = :id
        `,
      {
        replacements: { id },
      },
    );

    const allItem = await db.purchase_item.findAll({
      include: [
        {
          model: db.purchase_vendor,
          where: { Purchase_req_id: id },
          attributes: [
            "id",
            "vendor_id",
            "Purchase_req_item_id",
            "Purchase_req_id",
          ],
        },
        {
          model: db.ItemMaster,
          attributes: ["item_name", "item_code", "id", "MVP", "MRP"],
          include: [
            {
              model: db.imageDocument,
              attributes: ["image", "id"],
            },
            {
              model: db.asset,
              attributes: ["asset_category_name"],
            },
            {
              model: db.hsn_sac_master,
              attributes: ["hsn_sac_code"],
              include: [
                {
                  model: db.gst_rate_master,
                  attributes: ["value"],
                },
              ],
            },
          ],
        },
      ],
      where: { purchase_request_id: id },
      attributes: [
        "id",
        "grand_total",
        "item_categroy_id",
        "item_master_id",
        "purchase_request_id",
        "quantity",
        "total_mvp",
        "priority",
      ],
    });

    const Obj = {
      ...data[0],
      data_details,
      data_image,
      data_Item: allItem,
    };
    if (data) {
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched successfully!", data: Obj });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
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

exports.get_service_master = async (req, res) => {
  try {
    const service_id = req.params.id;
    const data = await db.Service_master.findAll({
      where: {
        service_category_id: service_id,
        isDeleted: false,
        status: "ACTIVE",
      },
      include: [
        {
          model: db.hsn_sac_master,
          attributes: ["id", "hsn_sac_code", "code_type"],
        },
      ],
    });
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for the given service ID." });
    }
    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully!",
      data: data,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching data." });
  }
};

exports.get_budget_details_pr = async (req, res) => {
  try {
    const { dept_id, type, financial_year, entity_id, cost_center_id } =
      req.body;
    if (!dept_id || !type || !financial_year || !entity_id || !cost_center_id) {
      return res
        .status(400)
        .send({ code: 400, message: "All fields are required." });
    }
    const Depart_detail = await db.department.findOne({
      where: { dept_id: dept_id, isDeleted: false, status: "ACTIVE" },
    });

    if (!Depart_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Department not found." });
    }

    const Budget_Details = await db.cost_center.findOne({
      where: {
        id: cost_center_id,
        department_id: Depart_detail.dept_id,
        cost_center_type: type,
        entity_id: entity_id,
        financial_year_id: financial_year,
        status: "ACTIVE",
        isDeleted: false,
      },
    });

    if (!Budget_Details) {
      return res
        .status(404)
        .send({ code: 404, message: "Budget details not found." });
    }

    const PO_purchase_details = await db.purchase_order.findAll({
      where: {
        department_id: dept_id,
        financial_year_id: financial_year,
        po_type: type,
        entity_id: entity_id,
        cost_center_id: cost_center_id,
        final_status: "APPROVED",
      },
    });

    const finalTotal = PO_purchase_details.reduce((total, item) => {
      return total + parseFloat(item.total_purchase || 0);
    }, 0);

    const remaining_budget =
      parseFloat(Budget_Details.amount) - parseFloat(finalTotal);

    Budget_Details.remainingAmount = remaining_budget;
    Budget_Details.totalPurchaseAmount = finalTotal;

    return res.status(200).send({
      code: 200,
      message: "Budget details fetched successfully",
      data: Budget_Details,
      Total_purchase: finalTotal,
      remainingAmount: remaining_budget,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.generate_PR_No = async (req, res) => {
  try {
    const po_type = req.body.pr_type;
    const po_Variable = "PR";

    const lastEntry = await db.purchase_details.findOne({
      where: { status: "ACTIVE" },
      order: [["id", "DESC"]],
      attributes: ["pr_number"],
    });

    let number = 1;
    if (lastEntry && lastEntry.pr_number) {
      const last_digit = lastEntry.pr_number;
      const lastNumber = parseInt(last_digit.slice(2), 10);
      if (!isNaN(lastNumber)) {
        number = lastNumber + 1;
      }
    }

    const code = `${number}`.padStart(3, "0");
    const po_number = `${po_Variable}${code}`;

    if (!po_type) {
      return res
        .status(200)
        .send({ code: 200, message: "Please Select PR Type", data: null });
    } else {
      return res.status(200).send({
        code: 200,
        message: "PR Number has been Generated Purchase Request",
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

exports.get_all_vendor_name = async (req, res) => {
  try {
    const { entity_id, item_categray_id } = req.query;
    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id parameter is required",
        data: [],
      });
    }
    const productions = await db.vendor_basic_details.findAll({
      where: {
        entity_id,
        item_categray_id,
        isDeleted: false,
      },
      order: [["id", "DESC"]],
    });

    if (productions.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Productions data successfully",
        data: productions,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.UpdatePer = async (req, res) => {
  try {
    const pr_id = parseInt(req.params.pr_id);
    const {
      entity_id,
      financial_year_id,
      cost_center_id,
      billing_branch_id,
      warehouse_id,
      department_id,
      pr_category,
      pr_date,
      pr_number,
      pr_type,
      employee_id,
      remark,
      uploade_image,
      item_detail,
      service_detail,
      remainingAmount,
      total_purchase,
    } = req.body;
    function convertToIST(utcDateString) {
      return new Date(
        new Date(utcDateString).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
      )
        .toISOString()
        .slice(0, 10);
    }

    let startDate = convertToIST(pr_date);
    const departmentInfo = await db.department.findOne({
      where: { dept_id: department_id, isDeleted: false, status: "ACTIVE" },
      attributes: ["dept_id", "department_name"],
    });

    if (!departmentInfo) {
      return res
        .status(500)
        .send({ code: 500, message: "Department not found!" });
    }

    const getData = await WorkFlow.findAll({
      where: {
        entity_id: entity_id,
        department_id: department_id,
        job_name: "Purchase",
      },
    });

    if (!getData || getData.length === 0) {
      return res.status(500).send({
        code: 500,
        message: "Workflow is not created for required department And PR!",
      });
    }

    const [affectedCount] = await db.purchase_details.update(
      {
        entity_id,
        financial_year_id,
        cost_center_id,
        billing_branch_id,
        warehouse_id,
        department_id,
        pr_category,
        pr_date: startDate,
        pr_number,
        pr_type,
        remark,
        employee_id,
        total_purchase,
      },
      { where: { id: pr_id } },
    );

    if (affectedCount === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "Purchase request not found!" });
    }
    await db.purchase_imgae.destroy({
      where: { purchase_details_id: pr_id },
    });
    if (Array.isArray(uploade_image) && uploade_image.length > 0) {
      await Promise.all(
        uploade_image.map(async (image) => {
          await db.purchase_imgae.create({
            uploade_image: image,
            purchase_details_id: pr_id,
            entity_id: entity_id,
            department_id: department_id,
            financial_year_id: financial_year_id,
          });
        }),
      );
    }
    await db.purchase_item.destroy({
      where: { purchase_request_id: pr_id },
    });
    if (Array.isArray(item_detail) && item_detail.length > 0) {
      await Promise.all(
        item_detail.map(async (data) => {
          // const calculatedTax = data.total_mvp * data.tax / 100;
          // const grandTotal = data.total_mvp + calculatedTax;
          const result = {
            item_master_id: data.item_master_id,
            priority: data.priority,
            total_mvp: data.total_mvp,
            quantity: data.quantity,
            tax: data.tax,
            grand_total: data.grand_total,
            purchase_request_id: pr_id,
            item_categroy_id: data.item_categroy_id,
          };

          const itemRecord = await db.purchase_item.create(result);

          if (Array.isArray(data.vendor_ids) && data.vendor_ids.length > 0) {
            const vendorEntries = data.vendor_ids.map(async (vendor_id) => {
              await db.purchase_vendor.create({
                Purchase_req_item_id: itemRecord.id,
                vendor_id: vendor_id,
                Purchase_req_id: pr_id,
              });
            });

            await Promise.all(vendorEntries);
          }
          return itemRecord;
        }),
      );
    }

    const getLevels = await db.Work_Flow_range.findAll({
      where: {
        workflow_id: getData[0].id,
        status: "ACTIVE",
      },
      attributes: ["level", "employee_id", "role_id", "workflow_id"],
    });

    await db.cost_center.update(
      { remainingAmount: remainingAmount - total_purchase },
      {
        where: {
          id: cost_center_id,
          isDeleted: false,
          department_id: department_id,
          cost_center_type: pr_type,
          financial_year_id: financial_year_id,
          status: "ACTIVE",
          entity_id: entity_id,
        },
      },
    );

    return res.status(200).send({
      code: 200,
      message: "PR updated Successfully!",
      data: pr_id,
      // itemResults,
      // serviceResults
    });
  } catch (error) {
    console.log(error);
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getSpendByPRcategory = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { fromMonth, toMonth } = req.body;

    if (!fromMonth || !toMonth) {
      return res.status(400).send({
        code: 400,
        message:
          "Both fromMonth and toMonth parameters are required in YYYY-MM-DD format.",
      });
    }

    const fromMonthNumber = parseInt(fromMonth);
    const toMonthNumber = parseInt(toMonth);
    const poData = await db.purchase_order.findAll({
      where: {
        entity_id: entity_id,
      },
      attributes: ["id", "po_type"],
    });

    const POIds = poData.map((data) => data.id);
    if (POIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No purchase orders found for the given entity.",
        data: [],
      });
    }

    const grnData = await db.grnMaster.findAll({
      attributes: ["id", "entity_id", "po_Id", "invoiceDate", "payment_status"],
      where: {
        po_Id: POIds,
        entity_id,
        payment_status: { [db.Sequelize.Op.in]: ["PAID", "PARTIALLY PAID"] },
      },
    });

    const grnIds = grnData
      .filter((data) => {
        const invoiceMonth = new Date(data.invoiceDate).getMonth() + 1;
        return invoiceMonth >= fromMonthNumber && invoiceMonth <= toMonthNumber;
      })
      .map((data) => data.id);

    if (grnIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No GRN data found for the given date range.",
        data: [],
      });
    }

    const grnIdsStr = grnIds.join(",");

    const query = `
            SELECT 
               
                SUM(SYS_PO_PAYMENT_MST.amount_paid) AS total_amount_paid,
                PROCUREMENT_PURCHASE_ORDER.po_type
            FROM 
                SYS_PO_PAYMENT_MST
            JOIN 
                GRN_MASTER ON GRN_MASTER.id = SYS_PO_PAYMENT_MST.grn_id
            JOIN 
                PROCUREMENT_PURCHASE_ORDER ON PROCUREMENT_PURCHASE_ORDER.id = GRN_MASTER.po_Id
            WHERE 
                SYS_PO_PAYMENT_MST.grn_id IN (${grnIdsStr})
            GROUP BY 
                 PROCUREMENT_PURCHASE_ORDER.po_type
        `;

    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Total Purchase by PO Type fetched successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getSpendTrends = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const currentYear = new Date().getFullYear();

    const grnData = await db.grnMaster.findAll({
      attributes: ["id", "po_Id", "invoiceDate"],
      where: {
        entity_id,
        payment_status: { [db.Sequelize.Op.in]: ["PAID", "PARTIALLY PAID"] },
        invoiceDate: {
          [db.Sequelize.Op.gte]: new Date(currentYear, 0, 1),
          [db.Sequelize.Op.lte]: new Date(currentYear, 11, 31),
        },
      },
    });

    if (grnData.length === 0) {
      return res.status(200).send({
        code: 200,
        message:
          "No data found for the given entity in the current calendar year.",
        data: [],
      });
    }

    const grnIds = grnData.map((data) => data.id);

    const totalPurchaseData = await db.sequelize.query(
      `SELECT 
                MONTH(GRN_MASTER.invoiceDate) AS month,
                YEAR(GRN_MASTER.invoiceDate) AS year,
                SUM(poPayment.amount_paid) AS total_amount_paid
            FROM 
                SYS_PO_PAYMENT_MST AS poPayment
            JOIN 
                GRN_MASTER ON poPayment.grn_id = GRN_MASTER.id
            WHERE 
                poPayment.grn_id IN (:grnIds)
                AND GRN_MASTER.invoiceDate >= :startDate
                AND GRN_MASTER.invoiceDate <= :endDate
            GROUP BY 
                MONTH(GRN_MASTER.invoiceDate), 
                YEAR(GRN_MASTER.invoiceDate)
            ORDER BY 
                MONTH(GRN_MASTER.invoiceDate)`,
      {
        replacements: {
          grnIds: grnIds,
          startDate: new Date(currentYear, 0, 1),
          endDate: new Date(currentYear, 11, 31),
        },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    return res.status(200).send({
      code: 200,
      message:
        "Total Purchase by Month fetched successfully for the current calendar year",
      data: totalPurchaseData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getTotalSpendByVendors = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { fromMonth, toMonth } = req.body;

    if (!fromMonth || !toMonth) {
      return res.status(400).send({
        code: 400,
        message:
          "Both fromMonth and toMonth parameters are required in YYYY-MM-DD format.",
      });
    }

    const fromMonthNumber = parseInt(fromMonth);
    const toMonthNumber = parseInt(toMonth);

    const poData = await db.purchase_order.findAll({
      where: {
        entity_id: entity_id,
      },
      attributes: ["id", "po_type", "vendor_id"],
    });

    const POIds = poData.map((data) => data.id);
    if (POIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No purchase orders found for the given entity.",
        data: [],
      });
    }

    const grnData = await db.grnMaster.findAll({
      attributes: [
        "id",
        "entity_id",
        "po_Id",
        "invoiceDate",
        "payment_status",
        "vendor_id",
      ],
      where: {
        po_Id: POIds,
        entity_id,
        payment_status: { [db.Sequelize.Op.in]: ["PAID", "PARTIALLY PAID"] },
      },
    });

    const grnIds = grnData
      .filter((data) => {
        const invoiceMonth = new Date(data.invoiceDate).getMonth() + 1;
        return invoiceMonth >= fromMonthNumber && invoiceMonth <= toMonthNumber;
      })
      .map((data) => data.id);

    if (grnIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No GRN data found for the given date range.",
        data: [],
      });
    }

    const grnIdsStr = grnIds.join(",");
    const query = `
        SELECT 
            PROCUREMENT_PURCHASE_ORDER.vendor_id,
            VENDOR_BASIC_DETAILS.vendor_name,
            SUM(SYS_PO_PAYMENT_MST.amount_paid) AS total_amount_paid
        FROM 
            SYS_PO_PAYMENT_MST
        JOIN 
            GRN_MASTER ON GRN_MASTER.id = SYS_PO_PAYMENT_MST.grn_id
        JOIN 
            PROCUREMENT_PURCHASE_ORDER ON PROCUREMENT_PURCHASE_ORDER.id = GRN_MASTER.po_Id
        JOIN 
            VENDOR_BASIC_DETAILS ON VENDOR_BASIC_DETAILS.id = PROCUREMENT_PURCHASE_ORDER.vendor_id
        WHERE 
            SYS_PO_PAYMENT_MST.grn_id IN (${grnIdsStr})
        GROUP BY 
            PROCUREMENT_PURCHASE_ORDER.vendor_id, VENDOR_BASIC_DETAILS.vendor_name
    `;

    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Total Spend by Vendor fetched successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
exports.getTotalSpendByDepartment = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { fromMonth, toMonth } = req.body;

    if (!fromMonth || !toMonth) {
      return res.status(400).send({
        code: 400,
        message:
          "Both fromMonth and toMonth parameters are required in YYYY-MM-DD format.",
      });
    }

    const fromMonthNumber = parseInt(fromMonth);
    const toMonthNumber = parseInt(toMonth);

    const poData = await db.purchase_order.findAll({
      where: {
        entity_id: entity_id,
      },
      attributes: ["id", "po_type", "vendor_id", "department_id"],
    });

    const POIds = poData.map((data) => data.id);
    if (POIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No purchase orders found for the given entity.",
        data: [],
      });
    }
    const grnData = await db.grnMaster.findAll({
      attributes: [
        "id",
        "entity_id",
        "po_Id",
        "invoiceDate",
        "payment_status",
        "vendor_id",
      ],
      where: {
        po_Id: POIds,
        entity_id,
        payment_status: { [db.Sequelize.Op.in]: ["PAID", "PARTIALLY PAID"] },
      },
    });

    const grnIds = grnData
      .filter((data) => {
        const invoiceMonth = new Date(data.invoiceDate).getMonth() + 1;
        return invoiceMonth >= fromMonthNumber && invoiceMonth <= toMonthNumber;
      })
      .map((data) => data.id);

    if (grnIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No GRN data found for the given date range.",
        data: [],
      });
    }

    const grnIdsStr = grnIds.join(",");
    const query = `
        SELECT 
            PROCUREMENT_PURCHASE_ORDER.department_id,
            MASTER_DEPARTMENT.department_name,
            SUM(SYS_PO_PAYMENT_MST.amount_paid) AS total_amount_paid
        FROM 
            SYS_PO_PAYMENT_MST
        JOIN 
            GRN_MASTER ON GRN_MASTER.id = SYS_PO_PAYMENT_MST.grn_id
        JOIN 
            PROCUREMENT_PURCHASE_ORDER ON PROCUREMENT_PURCHASE_ORDER.id = GRN_MASTER.po_Id
        JOIN 
            MASTER_DEPARTMENT ON MASTER_DEPARTMENT.dept_id = PROCUREMENT_PURCHASE_ORDER.department_id
        WHERE 
            SYS_PO_PAYMENT_MST.grn_id IN (${grnIdsStr})
        GROUP BY 
            PROCUREMENT_PURCHASE_ORDER.department_id, MASTER_DEPARTMENT.department_name
    `;

    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Total Spend by Vendor fetched successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
exports.getTotalSpendOnCategory = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { fromMonth, toMonth } = req.body;

    if (!fromMonth || !toMonth) {
      return res.status(400).send({
        code: 400,
        message:
          "Both fromMonth and toMonth parameters are required in YYYY-MM-DD format.",
      });
    }

    const fromMonthNumber = parseInt(fromMonth);
    const toMonthNumber = parseInt(toMonth);
    const poData = await db.purchase_order.findAll({
      where: {
        entity_id: entity_id,
      },
      attributes: ["id", "po_type", "vendor_id", "department_id"],
    });

    const POIds = poData.map((data) => data.id);
    if (POIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No purchase orders found for the given entity.",
        data: [],
      });
    }
    const grnData = await db.grnMaster.findAll({
      attributes: [
        "id",
        "entity_id",
        "po_Id",
        "invoiceDate",
        "payment_status",
        "vendor_id",
      ],
      where: {
        po_Id: POIds,
        entity_id,
        payment_status: { [db.Sequelize.Op.in]: ["PAID", "PARTIALLY PAID"] },
      },
    });

    const grnIds = grnData
      .filter((data) => {
        const invoiceMonth = new Date(data.invoiceDate).getMonth() + 1;
        return invoiceMonth >= fromMonthNumber && invoiceMonth <= toMonthNumber;
      })
      .map((data) => data.id);

    if (grnIds.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No GRN data found for the given date range.",
        data: [],
      });
    }

    const grnIdsStr = grnIds.join(",");

    const query = `
            SELECT 
                PROCUREMENT_PURCHASE_ORDER_ITEM.item_categroy_id,
                MASTER_ASSET.asset_category_name,
                SUM(SYS_PO_PAYMENT_MST.amount_paid) AS total_amount_paid
            FROM 
                SYS_PO_PAYMENT_MST
            JOIN 
                GRN_MASTER ON GRN_MASTER.id = SYS_PO_PAYMENT_MST.grn_id
            JOIN 
                PROCUREMENT_PURCHASE_ORDER ON PROCUREMENT_PURCHASE_ORDER.id = GRN_MASTER.po_Id
            JOIN 
                PROCUREMENT_PURCHASE_ORDER_ITEM ON PROCUREMENT_PURCHASE_ORDER_ITEM.purchase_order_id = PROCUREMENT_PURCHASE_ORDER.id
            JOIN 
                MASTER_ASSET ON MASTER_ASSET.id = PROCUREMENT_PURCHASE_ORDER_ITEM.item_categroy_id
            WHERE 
                SYS_PO_PAYMENT_MST.grn_id IN (${grnIdsStr})
            GROUP BY 
                PROCUREMENT_PURCHASE_ORDER_ITEM.item_categroy_id, MASTER_ASSET.asset_category_name
        `;

    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const totalSpend = result.reduce(
      (sum, item) => sum + parseFloat(item.total_amount_paid),
      0,
    );

    const resultWithPercentage = result.map((item) => {
      const percentage =
        (parseFloat(item.total_amount_paid) / totalSpend) * 100;
      return {
        ...item,
        percentage: percentage.toFixed(2),
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Total Spend by Category with Percentage fetched successfully",
      data: resultWithPercentage,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getSpendForecastTrends = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const currentYear = new Date().getFullYear();
    const startOfCurrentYear = new Date(currentYear, 0, 1);
    const endOfCurrentYear = new Date(currentYear, 11, 31);

    const grnData = await db.grnMaster.findAll({
      attributes: ["id", "po_Id", "invoiceDate"],
      where: {
        entity_id,
        payment_status: { [db.Sequelize.Op.in]: ["PAID", "PARTIALLY PAID"] },
        invoiceDate: {
          [db.Sequelize.Op.gte]: new Date(currentYear - 1, 0, 1),
          [db.Sequelize.Op.lte]: endOfCurrentYear,
        },
      },
    });

    if (grnData.length === 0) {
      return res.status(200).send({
        code: 200,
        message:
          "No data found for the given entity in the current or previous year.",
        data: [],
      });
    }

    const grnIds = grnData.map((data) => data.id);

    const totalPurchaseData = await db.sequelize.query(
      `SELECT 
                MONTH(GRN_MASTER.invoiceDate) AS month,
                YEAR(GRN_MASTER.invoiceDate) AS year,
                SUM(poPayment.amount_paid) AS total_amount_paid
            FROM 
                SYS_PO_PAYMENT_MST AS poPayment
            JOIN 
                GRN_MASTER ON poPayment.grn_id = GRN_MASTER.id
            WHERE 
                poPayment.grn_id IN (:grnIds)
                AND GRN_MASTER.invoiceDate >= :startDate
                AND GRN_MASTER.invoiceDate <= :endDate
            GROUP BY 
                MONTH(GRN_MASTER.invoiceDate), 
                YEAR(GRN_MASTER.invoiceDate)
            ORDER BY 
                YEAR(GRN_MASTER.invoiceDate), MONTH(GRN_MASTER.invoiceDate)`,
      {
        replacements: {
          grnIds: grnIds,
          startDate: new Date(currentYear - 1, 0, 1),
          endDate: endOfCurrentYear,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    const monthlySpendByYear = {};

    totalPurchaseData.forEach((row) => {
      const { year, month, total_amount_paid } = row;
      if (!monthlySpendByYear[year]) {
        monthlySpendByYear[year] = Array(12).fill(0);
      }
      monthlySpendByYear[year][month - 1] = parseFloat(total_amount_paid);
    });
    const currentYearSpend = monthlySpendByYear[currentYear]
      ? monthlySpendByYear[currentYear].reduce((sum, value) => sum + value, 0)
      : 0;
    const previousYearSpend = monthlySpendByYear[currentYear - 1]
      ? monthlySpendByYear[currentYear - 1].reduce(
          (sum, value) => sum + value,
          0,
        )
      : 0;
    let growthRate = 0;
    if (previousYearSpend > 0) {
      growthRate =
        ((currentYearSpend - previousYearSpend) / previousYearSpend) * 100;
    }

    const forecastedSpendByMonth = Array(12).fill(0);
    if (growthRate >= 0) {
      for (let month = 0; month < 12; month++) {
        forecastedSpendByMonth[month] =
          monthlySpendByYear[currentYear][month] * (1 + growthRate / 100);
      }
    }

    const spendData = [];
    for (let month = 0; month < 12; month++) {
      const currentMonthSpend =
        monthlySpendByYear[currentYear] &&
        monthlySpendByYear[currentYear][month] !== undefined
          ? monthlySpendByYear[currentYear][month].toFixed(2)
          : 0;

      const previousMonthSpend =
        monthlySpendByYear[currentYear - 1] &&
        monthlySpendByYear[currentYear - 1][month] !== undefined
          ? monthlySpendByYear[currentYear - 1][month].toFixed(2)
          : 0;

      const forecastedNextMonthSpend =
        forecastedSpendByMonth[month] !== undefined
          ? forecastedSpendByMonth[month].toFixed(2)
          : 0;

      spendData.push({
        month: month + 1,
        currentYearSpend: currentMonthSpend,
        previousYearSpend: previousMonthSpend,
        forecastedNextYearSpend: forecastedNextMonthSpend,
      });
    }

    return res.status(200).send({
      code: 200,
      message:
        "Spend trends for the current and previous years with forecast for the next year",
      data: {
        currentYear: currentYear,
        previousYear: currentYear - 1,
        forecastedNextYear: currentYear + 1,
        growthRate: growthRate.toFixed(2),
        spendData: spendData,
      },
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getTotalSpend = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { fromMonth, toMonth } = req.body;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const calendarYearStart = new Date(currentYear, 0, 1);
    const calendarYearEnd = new Date(currentYear, 11, 31);

    if (fromMonth && toMonth) {
      const fromMonthNumber = parseInt(fromMonth);
      const toMonthNumber = parseInt(toMonth);

      if (
        isNaN(fromMonthNumber) ||
        isNaN(toMonthNumber) ||
        fromMonthNumber < 1 ||
        fromMonthNumber > 12 ||
        toMonthNumber < 1 ||
        toMonthNumber > 12
      ) {
        return res.status(400).send({
          code: 400,
          message:
            "Both fromMonth and toMonth parameters should be valid numbers between 1 and 12.",
        });
      }

      const fromMonthDate = new Date(currentYear, fromMonthNumber - 1, 1);
      const toMonthDate = new Date(currentYear, toMonthNumber, 0);

      if (fromMonthDate > toMonthDate) {
        return res.status(400).send({
          code: 400,
          message: "fromMonth cannot be later than toMonth.",
        });
      }

      if (fromMonthDate < calendarYearStart || toMonthDate > calendarYearEnd) {
        return res.status(400).send({
          code: 400,
          message: "The selected months are outside the current calendar year.",
        });
      }

      var dateStart = fromMonthDate;
      var dateEnd = toMonthDate;
    } else {
      var dateStart = calendarYearStart;
      var dateEnd = calendarYearEnd;
    }
    const grnData = await db.grnMaster.findAll({
      attributes: ["id", "entity_id", "po_Id", "invoiceDate", "payment_status"],
      where: {
        entity_id,
        payment_status: { [db.Sequelize.Op.in]: ["PAID", "PARTIALLY PAID"] },
        invoiceDate: {
          [db.Sequelize.Op.gte]: dateStart,
          [db.Sequelize.Op.lte]: dateEnd,
        },
      },
    });
    if (grnData.length === 0) {
      return res.status(200).send({
        code: 200,
        message: "No GRN data found for the given date range.",
        data: [],
      });
    }
    const grnIds = grnData.map((data) => data.id);

    const grnIdsStr = grnIds.join(",");

    const query = `
            SELECT 
                SUM(SYS_PO_PAYMENT_MST.amount_paid) AS total_amount_paid
            FROM 
                SYS_PO_PAYMENT_MST
            WHERE 
                SYS_PO_PAYMENT_MST.grn_id IN (${grnIdsStr});
        `;

    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const totalAmountPaid = result.length > 0 ? result[0].total_amount_paid : 0;
    return res.status(200).send({
      code: 200,
      message: "Total Spend fetched successfully.",
      data: { total_amount_paid: totalAmountPaid },
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.downloadPRById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ SECURE QUERY
    const valueData = await db.sequelize.query(
      `SELECT DISTINCT
    P.*, 
    V.vendor_name, 
    CONCAT(HRU.first_name, ' ', HRU.last_name) AS requested_by,
    E.entity_name,
    E.tax_registration_number AS entity_gst_in, 
    E.registered_office, 
    E.logo, 
    W.address AS warehouse_address, 
    W.pin AS warehouse_pin, 
    W.postal_address

FROM PROCUREMENT_PURCHASE_REQUEST P

LEFT JOIN ENTITY_MASTER E 
    ON E.id = P.entity_id

LEFT JOIN WAREHOUSE_MASTER W 
    ON W.id = P.warehouse_id

LEFT JOIN PROCUREMENT_PURCHASE_REQUEST_VENDOR PRV
    ON PRV.Purchase_req_id = P.id

LEFT JOIN VENDOR_BASIC_DETAILS V
    ON V.id = PRV.vendor_id

LEFT JOIN HRMS_REGISTERED_USER HRU
    ON HRU.employee_id = P.employee_id

WHERE P.id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      },
    );

    const items = await db.sequelize.query(
      `SELECT POI.*, I.item_name, I.description, GRM.value AS gstRate, HSN.hsn_sac_code, MU.uom_name AS uom, MA.asset_category_name AS sub_group
       FROM PROCUREMENT_PURCHASE_REQUEST_ITEM POI
       INNER JOIN MASTER_ITEM I ON I.id = POI.item_master_id
       INNER JOIN MASTER_HSN_SAC_CODE HSN ON HSN.id = I.hsn_code_id
       INNER JOIN GST_RATE_MASTER GRM ON GRM.id = HSN.gst_rate_id
       LEFT JOIN MASTER_UOM MU ON MU.uom_id = I.uom_id
       LEFT JOIN MASTER_ASSET MA ON MA.id = POI.item_categroy_id
       WHERE POI.purchase_request_id = :id`,
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

    // ✅ GENERATE TABLE
    const { html: itemsTable, totalQty } = generatePRItemsTable(items);

    // ✅ LOAD TEMPLATE
    const htmlPath = path.resolve(
      __dirname,
      "../../../../src/assets/templates/purchase_requisition.html",
    );

    let html = fs.readFileSync(htmlPath, "utf-8");

    // ✅ BIND DATA HELPER
    const bindData = (template, data) => {
      return template.replace(/{{(.*?)}}/g, (_, key) =>
        data[key.trim()] !== undefined ? data[key.trim()] : "",
      );
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

    html = bindData(html, {
      heading: "Purchase Requisition",
      entityName: header.entity_name,
      entityAddress: header.registered_office,
      entityLogo: logoBase64,
      mainAddress: mainAddress,
      
      pr_number: header.pr_number,
      pr_date: header.pr_date ? moment(header.pr_date).format("DD-MMM-YYYY") : "-",
      requested_by: header.requested_by || "-",
      ref_no: header.ref_no || "KG/26-27/0280",
      vendor_name: header.vendor_name || "-",

      itemsTable,
      total_qty: totalQty.toFixed(3),
      po_remark: header.remark || "-",
    });

    const pdfBuffer = await generatePDF(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=purchase_requisition.pdf");
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

function generatePRItemsTable(items) {
  let html = "";
  let i = 1;
  let totalQty = 0;

  items.forEach((item) => {
    const qty = Number(item.quantity || 0);
    const rate = Number(item.unit_price || 0);
    totalQty += qty;

    html += `
      <tr>  
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${i++}</td>
        <td style="border: 1px solid #000; padding: 6px;">${item.sub_group || "-"}</td>
        <td style="border: 1px solid #000; padding: 6px;">${item.item_name || ""}</td>
        <td style="text-align: center; border: 1px solid #000; padding: 6px;">${item.uom || "NOS"}</td>
        <td style="text-align: right; border: 1px solid #000; padding: 6px;">${qty.toFixed(3)}</td>
        <td style="text-align: right; border: 1px solid #000; padding: 6px;">${rate}</td>
        <td style="border: 1px solid #000; padding: 6px;">${item.remark || ""}</td>
      </tr>`;
  });

  html += `
    <tr style="font-weight: bold; background-color: #f2f2f2;">  
      <td colspan="3" style="text-align: right; border: 1px solid #000; padding: 6px;">Total</td>
      <td style="border: 1px solid #000;"></td>
      <td style="text-align: right; border: 1px solid #000; padding: 6px;">${totalQty.toFixed(3)}</td>
      <td style="border: 1px solid #000;"></td>
      <td style="border: 1px solid #000;"></td>
    </tr>`;

  return { html, totalQty };
}
