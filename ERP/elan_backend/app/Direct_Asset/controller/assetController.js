const db = require("../../models/index");
const logger = require("../../../logger/index");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const { Op } = db.Sequelize;
const {
  calculateDepreciation,
} = require("../../../app/utils/depreciationUtil");
const { validationResult } = require("express-validator");
const puppeteer = require("puppeteer");
const { Queue } = require("bullmq");
const mailQueue = require("../../../app/CRM/utils/mail/mailQueue");

exports.createBatchCode = async (req, res) => {
  try {
    let generatedCode = "";
    const latestBatch = await db.grnItemStatus.max("batchNo");
    if (latestBatch) {
      generatedCode =
        "BN" +
        (parseInt(latestBatch.substring(2)) + 1).toString().padStart(4, "0");
    } else {
      generatedCode = "BN0001";
    }
    if (generatedCode) {
      return res.status(200).send({
        code: 200,
        message: "Batch Code generated successfully!",
        data: generatedCode,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Batch Code generated not created!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

exports.createAssetTagId = async (req, res) => {
  try {
    let [s] = await db.sequelize.query(
      `SELECT MAX(id) AS last_id FROM GRN_ITEM_STATUS`,
    );
    let lastId = s[0].last_id || 0;
    const generatedCode = "AST" + String(lastId + 1 + 1).padStart(3, "0");

    if (generatedCode) {
      return res.status(200).send({
        code: 200,
        message: "Serial Code generated successfully!",
        data: generatedCode,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Serial Code generated not created!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

exports.CreateDirectAsset = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    let {
      amount,
      asset_category,
      asset_tag_id,
      batch_number,
      item_id,
      item_use_date,
      purchase_date,
      quantity,
      serial_number,
      suplier_id,
      total_amt,
      grn_number,
      depriciation_by,
      gst,
      vat,
      depriciated_value,
      branch,
      asset_for_pm,
      asset_type,
      file,
      frequency,
      use_full_life,
      salvage_value,
      itemSpecification,
      Account_details,
      assetStatus,
      depMethod_id,
      accumulated_dep,
    } = req.body;

    const { entity_id, financial_year_id, employee_id } = req.params;

    const masterItem = await db.ItemMaster.findOne({
      where: { id: item_id },
      transaction,
    });

    if (!masterItem) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ code: 404, message: `Item with ID ${item_id} not found` });
    }

    const item_name = masterItem.item_name;
    const mvp = masterItem.standard_rate
      ? parseInt(masterItem.standard_rate)
      : 0;
    const useful_life_days = Math.round(use_full_life * 365.25);

    const createGrn = await db.grnMaster.create(
      {
        grn_number,
        grn_date: new Date(),
        total_amount: amount,
        grnStatus: "COMPLETED",
        financial_year_id,
        entity_id,
        employee_id,
        vendor_id: suplier_id,
        goodInventoryStatus: "DIRECT_ASSET",
        purchase_date,
        depriciation_by,
        vat,
        gst,
        depriciated_value,
        branch_id: branch,
        asset_for_pm,
        item_use_date,
        asset_type,
        asset_status_id: assetStatus,
        depreciation_rate: salvage_value,
        useful_life_days,
        frequency,
        use_full_life,
        invoiceDoc: file?.[0]?.upload_document,
        depreciationMethod: depMethod_id,
      },
      { transaction },
    );

    // Create GRN Item
    const createdData = await db.grnItem.create(
      {
        total_mvp: mvp,
        item_id,
        selection_item: 1,
        asset_id: asset_category,
        itemQty: quantity || 1,
        amount,
        grn_Id: createGrn.id,
      },
      { transaction },
    );

    // Create GRN Item Status
    const createGrnItem = await db.grnItemStatus.create(
      {
        batchType: "S.No. Only",
        expiryDate: item_use_date,
        itemSerialNo: serial_number,
        itemStatus: "SELECTED",
        item_id,
        Item_name: item_name,
        grn_item_id: createdData.id,
        asset_tagId: asset_tag_id,
      },
      { transaction },
    );

    // Update / create asset inventory
    const inventoryRecord = await db.asset_inventory.findOne({
      where: { asset_category_id: asset_category, item_id },
      transaction,
    });

    if (inventoryRecord) {
      const updatedQuantity =
        Number(quantity) + Number(inventoryRecord.item_quantity || 0);
      await db.asset_inventory.update(
        { item_quantity: updatedQuantity },
        { where: { id: inventoryRecord.id }, transaction },
      );
    } else {
      await db.asset_inventory.create(
        {
          asset_category_id: asset_category,
          item_id,
          item_quantity: Number(quantity),
          grn_id: createGrn.id,
        },
        { transaction },
      );
    }

    // Add specifications if any
    if (itemSpecification?.[0]?.specificationType) {
      const createSpecification = itemSpecification.map((element) => ({
        grn_item_status_id: createGrnItem.id,
        grn_id: createGrn.id,
        specificationType: element.specificationType,
        specificationDetails: element.specificationDetails,
      }));
      await db.asset_specification.bulkCreate(createSpecification, {
        transaction,
      });
    }

    // Add documents if any
    if (file?.length > 0) {
      const createDocuments = file.map((element) => ({
        grn_item_status_id: createGrnItem.id,
        grn_id: createGrn.id,
        document_name: element.document_name,
        upload_document: element.upload_document,
      }));
      await db.asset_documents.bulkCreate(createDocuments, { transaction });
    }

    // Journal entries
    const receipt_no = "GPMT" + Math.floor(100000 + Math.random() * 900000);

    const jurnalData = Account_details.map((element) => ({
      chart_account_id: element.chart_account_id,
      debit_amount: element.debit_amount,
      credit_amount: element.credit_amount,
      entity_id,
      vendor_id: suplier_id,
      grn_status_id: createGrnItem.id,
      entry_status: "Direct Asset Add",
      document_number: receipt_no,
      financial_id:financial_year_id
    }));

    await db.financial_And_Account_Journal_List.bulkCreate(jurnalData, {
      transaction,
    });

    await transaction.commit();

    return res
      .status(200)
      .send({ code: 200, message: "Asset Created Successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.updateDirectAsset = async (req, res) => {
  try {
    let {
      amount,
      asset_category,
      asset_tag_id,
      item_id,
      item_use_date,
      purchase_date,
      gst,
      hsn_code_id,
      quantity,
      serial_number,
      suplier_id,
      total_amt,
      depriciation_by,
      vat,
      depriciated_value,
      branch,
      asset_for_pm,
      asset_type,
      file,
      frequency,
      use_full_life,
      salvage_value,
      itemSpecification,
      assetStatus,
      Account_details,
    } = req.body;

    const grn_status_id = req.params?.id;

    const masterItem = await db.ItemMaster.findOne({
      where: { id: item_id },
    });

    if (!masterItem) {
      return res
        .status(404)
        .send({ code: 404, message: `Item with ID ${item_id} not found` });
    }
    const item_name = masterItem.item_name;
    const mvp = masterItem.standard_rate
      ? parseInt(masterItem.standard_rate)
      : 0;
    const entity_id = parseInt(masterItem?.entity_id);

    const grnStatus = await db.grnItemStatus.findOne({
      attributes: ["grn_item_id"],
      where: { id: grn_status_id },
    });

    const grn_data = await db.grnItem.findOne({
      attributes: ["grn_Id"],
      where: { id: grnStatus.grn_item_id },
    });

    const updateGrn = await db.grnMaster.update(
      {
        total_amount: total_amt,
        vendor_id: suplier_id,
        purchase_date,
        gst,
        hsn_code_id,
        depriciation_by,
        vat,
        depriciated_value,
        branch_id: branch,
        asset_for_pm,
        item_use_date,
        asset_type,
        invoiceDoc: file[0].upload_document,
        asset_status_id: assetStatus,
        frequency,
        depreciation_rate: salvage_value,
        use_full_life,
      },
      {
        where: { id: grn_data.grn_Id },
      },
    );

    const updateItem = await db.grnItem.update(
      {
        total_mvp: mvp,
        item_id,
        asset_id: asset_category,
        itemQty: quantity,
        amount: amount,
      },
      {
        where: { id: grnStatus.grn_item_id },
      },
    );

    const updateStatus = await db.grnItemStatus.update(
      {
        expiryDate: item_use_date,
        itemSerialNo: serial_number,
        item_id,
        Item_name: item_name,
        asset_tagId: asset_tag_id,
      },
      {
        where: { id: grn_status_id },
      },
    );

    // specification start
    const createSpecification = await itemSpecification.map((element) => ({
      grn_item_status_id: grn_status_id,
      grn_id: grn_data.grn_Id,
      specificationType: element.specificationType,
      specificationDetails: element.specificationDetails,
    }));

    await db.asset_specification.destroy({
      where: { grn_item_status_id: grn_status_id },
    });
    await db.asset_specification.bulkCreate(createSpecification);
    // specification end
    // start image
    const createDocuments = file.map((element) => ({
      grn_item_status_id: grn_status_id,
      grn_id: grn_data.grn_Id,
      document_name: element.document_name,
      upload_document: element.upload_document,
    }));

    await db.asset_documents.destroy({
      where: { grn_item_status_id: grn_status_id },
    });

    await db.asset_documents.bulkCreate(createDocuments);

    // end image

    if (Account_details && Account_details.length > 0) {
      const receipt_no = "GPMT" + Math.floor(100000 + Math.random() * 900000);
      const jurnalData = Account_details.map((element) => ({
        chart_account_id: element.chart_account_id,
        debit_amount: element.debit_amount,
        credit_amount: element.credit_amount,
        entity_id,
        vendor_id: suplier_id,
        grn_status_id: grn_status_id,
        entry_status: "Direct Asset Add",
        document_number: receipt_no,
      }));

      await db.financial_And_Account_Journal_List.destroy({
        where: { grn_status_id: grn_status_id },
      });
      await db.financial_And_Account_Journal_List.bulkCreate(jurnalData);
    }

    if (updateStatus) {
      return res
        .status(200)
        .send({ code: 200, message: "Asset Updated Successfully!" });
    } else {
      return res
        .status(500)
        .send({ code: 500, message: "Failed to Updated Asset" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error " });
  }
};

exports.getAllAsset = async (req, res) => {
  try {
    const { employee_id, entity_id } = req.params;

    const query = `SELECT 
    GM.*,
    MI.item_name,
    GIS.batchType,
    GIS.asset_tagId,
    MA.asset_category_name,
    GIS.itemSerialNo,
    GIS.itemStatus,
    GIS.batchNo,
    GIS.asset_loc_status,
    GIS.allocation_type,
    AssetStatuses.status_name,
    MB.branch_address,
    MB.branch_name,
    MB.branch_name AS allocated_branch,
    PPO.po_number,
    (GM.total_amount - COALESCE(GM.accumulated_dep, 0)) AS net_value,
    PPO.po_date,
    GI.grn_Id AS grn_id,
    GIS.id AS grn_item_status_id,
    DM.department_name AS asset_allocated_dept,
    MID.image,
    CONCAT(HRU.first_name, ' ', HRU.last_name) AS asset_allocated_emp,
    GI.amount
FROM GRN_MASTER AS GM
INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
LEFT JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id
LEFT JOIN AssetStatuses ON GM.asset_status_id = AssetStatuses.id
INNER JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
LEFT JOIN PROCUREMENT_PURCHASE_ORDER AS PPO ON PPO.id = GM.po_Id
LEFT JOIN MASTER_BRANCH AS MB ON MB.id = COALESCE(GM.branch_id, PPO.billing_address_id)
LEFT JOIN (
    SELECT item_id, MAX(image) AS image
    FROM ITEM_IMAGE_DOCUMENTs
    GROUP BY item_id
) AS MID ON MID.item_id = MI.id
LEFT JOIN (
    SELECT *
    FROM GRN_ASSET_TRANSFER_HISTORY AS GAT1
    WHERE GAT1.id IN (
        SELECT MAX(id)
        FROM GRN_ASSET_TRANSFER_HISTORY
        GROUP BY grn_item_status_id
    )
) AS GAT ON GAT.grn_id = GM.id AND GAT.grn_item_status_id = GIS.id
LEFT JOIN MASTER_DEPARTMENT AS DM ON DM.dept_id = GAT.department_id
LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = GAT.employee_id
WHERE 
    GM.entity_id = ${entity_id}
    AND MI.item_type_id = '2' 
    AND GM.disposition_status IS NULL
ORDER BY GM.createdAt DESC;`;

    const grnData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Asset list data successfully",
        data: grnData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAssetAllocatedEmp = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const query = `SELECT 
      HRU.employee_code,
      HRU.employee_id, 
      CONCAT(HRU.first_name, ' ', HRU.last_name) AS employee_name, 
      MD.department_name, 
      MB.branch_name, 
      MAX(GAT.grn_id) AS grn_id, 
      MAX(GAT.id) AS allocated_id, 
      MAX(GAT.grn_item_status_id) AS grn_item_status_id, 
      COUNT(DISTINCT GIS.id) AS total_quantity 
    FROM HRMS_REGISTERED_USER AS HRU 
    INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = HRU.department_id 
    LEFT JOIN MASTER_BRANCH AS MB ON MB.id = HRU.location_id 
    LEFT JOIN GRN_ASSET_TRANSFER_HISTORY AS GAT 
        ON HRU.employee_id = GAT.employee_id 
        AND GAT.assign_status = 'ALLOCATED' 
    LEFT JOIN GRN_ITEM_STATUS AS GIS 
        ON (GIS.id = GAT.grn_item_status_id 
            AND GIS.asset_loc_status = 'ALLOCATED' 
            AND GIS.allocation_type ='allocated to employee' 
            AND GIS.assigned_to = GAT.employee_id) 
    WHERE HRU.primary_entity_id = ${entity_id}
    GROUP BY 
        HRU.employee_code,
        HRU.employee_id,
        HRU.first_name,
        HRU.last_name,
        MD.department_name,
        MB.branch_name`;

    const grnData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Allocated Asset list data successfully",
        data: grnData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
        data: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAssetAssignList = async (req, res) => {
  try {
    const { entity_id, employee_id } = req.params;

    const query = `SELECT 
      GAT.grn_item_status_id, 
      GM.id AS grn_id, 
      GAT.id AS allocated_id,
      GIS.Item_name,
      GIS.itemSerialNo, 
      GIS.asset_tagId, 
      DM.department_name, 
      BM.branch_name,
      GAT.createdAt, 
      CONCAT(HRUT.first_name, ' ', HRUT.last_name) AS assigned_to, 
      CONCAT(HRUF.first_name, ' ', HRUF.last_name) AS assigned_from 
    FROM HRMS_REGISTERED_USER AS HRU 
    LEFT JOIN MASTER_DEPARTMENT AS DM ON DM.dept_id = HRU.department_id 
    LEFT JOIN MASTER_BRANCH AS BM ON HRU.location_id = BM.id 
    LEFT JOIN GRN_ASSET_TRANSFER_HISTORY AS GAT ON GAT.employee_id = ${employee_id} 
    LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.id = GAT.grn_item_status_id AND GIS.allocation_type = 'allocated to employee' AND GAT.employee_id = GIS.assigned_to 
    LEFT JOIN GRN_MASTER AS GM ON GM.id = GAT.grn_id 
    LEFT JOIN HRMS_REGISTERED_USER AS HRUT ON HRUT.employee_id = GAT.assigned_to 
    LEFT JOIN HRMS_REGISTERED_USER AS HRUF ON HRUF.employee_id = GAT.assigned_from 
    WHERE GM.entity_id = ${entity_id} 
      AND GAT.employee_id = ${employee_id} 
      AND GIS.asset_loc_status = 'ALLOCATED' 
      AND GAT.id IN (
          SELECT MAX(id)
          FROM GRN_ASSET_TRANSFER_HISTORY
          WHERE employee_id = ${employee_id}
          GROUP BY grn_item_status_id
      )
    ORDER BY GAT.id DESC`;

    const grnData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get employee assigned asset list data successfully",
        data: grnData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
        data: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAssetEmployeeById = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const query = `SELECT HRU.employee_code,HRU.employee_id, CONCAT(HRU.first_name, ' ', HRU.last_name) AS employee_name, MD.department_name, MB.branch_name, DSG.designation_name FROM HRMS_REGISTERED_USER AS HRU LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = HRU.department_id LEFT JOIN MASTER_BRANCH AS MB ON MB.id = HRU.location_id LEFT JOIN DESIGNATION AS DSG ON DSG.designation_id = HRU.designation_id WHERE HRU.employee_id=${employee_id}`;

    const [grnData] = await Promise.all([
      db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }),
    ]);

    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Allocated Asset list data successfully",
        data: grnData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
        data: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAllAssetHistory = async (req, res) => {
  try {
    const { entity_id, employee_id } = req.params;

    const query = `SELECT GAT.grn_item_status_id, GM.id AS grn_id, GAT.id AS allocated_id,MI.Item_name,GIS.itemSerialNo,GIS.asset_tagId, DM.department_name, BM.branch_name,GAT.createdAt,GAT.assign_status, CONCAT(HRUT.first_name, ' ', HRUT.last_name) AS assigned_to, CONCAT(HRUF.first_name, ' ', HRUF.last_name) AS assigned_from FROM HRMS_REGISTERED_USER AS HRU LEFT JOIN MASTER_DEPARTMENT AS DM ON DM.dept_id = HRU.department_id LEFT JOIN MASTER_BRANCH AS BM ON HRU.location_id = BM.id LEFT JOIN GRN_ASSET_TRANSFER_HISTORY AS GAT ON GAT.employee_id = ${employee_id} LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.id = GAT.grn_item_status_id LEFT JOIN GRN_MASTER AS GM ON (GM.id = GAT.grn_id AND GM.entity_id = ${entity_id}) LEFT JOIN MASTER_ITEM AS MI ON MI.id = GIS.item_id LEFT JOIN HRMS_REGISTERED_USER AS HRUT ON HRUT.employee_id = GAT.assigned_to LEFT JOIN HRMS_REGISTERED_USER AS HRUF ON HRUF.employee_id = GAT.assigned_from WHERE HRU.employee_id = ${employee_id} AND GAT.employee_id = ${employee_id} ORDER BY GAT.id DESC`;

    const [grnData] = await Promise.all([
      db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }),
    ]);

    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Allocated Asset list data successfully",
        data: grnData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset History Items found..",
        data: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};
exports.getAllAssetStatuses = async (req, res) => {
  try {
    const statuses = await db.AssetStatus.findAll();

    if (statuses.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Asset Statuses successfully",
        data: statuses,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Statuses found..",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAssetDetailsById = async (req, res) => {
  try {
    const { grn_status_id } = req.params;

    const query = `SELECT GM.id AS grn_id, GM.depreciationMethod, GM.invoiceDoc AS file, GM.total_amount, GM.vendor_id, GM.vat, GM.frequency, GM.use_full_life, 
GM.depreciation_rate, GM.depriciation_by, GM.gst, GM.depriciated_value, GM.branch_id, 
GM.asset_for_pm, GM.item_use_date, GM.purchase_date, GM.asset_type, GI.total_mvp, GI.item_id, GI.selection_item, 
MI.asset_id,   -- ✅ ab ye MASTER_ITEM se aayega GI.item_id ke through
GI.selection_item, GI.amount, GIS.id AS grn_status_id, GIS.batchType, GIS.itemSerialNo, GIS.asset_tagId, GM.asset_status_id,
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', ASPEC.id,
            'specificationType', ASPEC.specificationType,
            'specificationDetails', ASPEC.specificationDetails
        ))
        FROM ASSET_SPECIFICATION AS ASPEC
        WHERE ASPEC.grn_item_status_id = GIS.id
    ) AS Specificationlist,
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', ASTD.id,
            'document_name', ASTD.document_name,
            'upload_document', ASTD.upload_document
        ))
        FROM ASSET_DOCUMENTS AS ASTD
        WHERE ASTD.grn_item_status_id = GIS.id
    ) AS uploaded_documents,
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', FAJL.id,
            'chart_account_id', FAJL.chart_account_id,
            'debit_amount', FAJL.debit_amount,
            'credit_amount', FAJL.credit_amount
        ))
        FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL
        WHERE FAJL.grn_status_id = GIS.id
    ) AS Accountlist 
FROM GRN_MASTER AS GM 
LEFT JOIN GRN_ITEM AS GI ON GM.id = GI.grn_Id  
LEFT JOIN GRN_ITEM_STATUS AS GIS ON GI.id = GIS.grn_item_id
INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id 
WHERE GIS.id = ${grn_status_id}`;

    const [grnData] = await Promise.all([
      db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }),
    ]);

    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get Asset details data successfully",
        data: grnData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Data not found..",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAllNearToSalvageAsset = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const nearSalvageMonths = 12; // Will be configurable later

    const [rows] = await db.sequelize.query(`
            SELECT 
                GM.*, 
                MI.item_name,
                GIS.asset_tagId,
                GIS.itemSerialNo,
                GIS.batchNo,
                GIS.id AS grn_item_status_id,
                MA.asset_category_name,
                AC.salvage_value,
                AC.use_full_life,
                AC.calculation_id,
                GI.grn_Id AS grn_id,
                GIS.asset_loc_status,
                MB.branch_address,
                MB.branch_name,
                PPO.po_number,
                PPO.po_date
            FROM GRN_MASTER AS GM
            LEFT JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
            LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
            LEFT JOIN MASTER_ASSET AS MA ON MA.id = GI.asset_id
            LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = GM.branch_id
            LEFT JOIN PROCUREMENT_PURCHASE_ORDER AS PPO ON PPO.id = GM.po_Id
            INNER JOIN ASSETCOMPANYDEPRECIATION_CALCULATION AS AC ON AC.asset_id = MA.id
            WHERE GM.entity_id = ${entity_id}
            ORDER BY GM.createdAt DESC
        `);

    const now = new Date();

    const results = rows.map((asset) => {
      const purchaseCost = asset.total_amount;
      const salvagePercent = asset.salvage_value;
      const usefulLife = asset.use_full_life;
      const depreciationMethod = asset.calculation_id === 1 ? "SLM" : "WDV";
      const salvageAmount = purchaseCost * (salvagePercent / 100);

      let currentValue = purchaseCost;
      let assetStatus = "Normal";

      // If user provided depriciated value manually
      if (asset.depriciation_by === "by_value") {
        currentValue = asset.depriciated_value;

        if (currentValue <= salvageAmount) {
          assetStatus = "Salvaged";
        } else if (currentValue <= salvageAmount * 1.1) {
          assetStatus = "Near Salvage";
        }
      } else {
        // Use calculation based on dates
        const putToUseDate =
          asset.depriciation_by === "put_to_use_date"
            ? asset.item_use_date
            : asset.purchase_date;

        const depResults = calculateDepreciation(
          purchaseCost,
          salvageAmount,
          usefulLife,
          putToUseDate,
          depreciationMethod,
        );

        let yearSalvageWillHit = null;

        for (let i = 0; i < depResults.length; i++) {
          const yearResult = depResults[i];
          const closingValue = parseFloat(yearResult.closingValue);

          if (closingValue <= salvageAmount) {
            yearSalvageWillHit = i;
            currentValue = closingValue;
            break;
          }
        }

        if (yearSalvageWillHit !== null) {
          const salvageDate = new Date(putToUseDate);
          salvageDate.setFullYear(
            salvageDate.getFullYear() + yearSalvageWillHit,
          );

          const diffInMonths =
            (salvageDate.getFullYear() - now.getFullYear()) * 12 +
            (salvageDate.getMonth() - now.getMonth());

          if (diffInMonths <= 0) {
            assetStatus = "Salvaged";
          } else if (diffInMonths <= nearSalvageMonths) {
            assetStatus = "Near Salvage";
          }
        }
      }

      return {
        ...asset,
        currentValue: parseFloat(currentValue).toFixed(2),
        salvageAmount: parseFloat(salvageAmount).toFixed(2),
        assetStatus,
      };
    });

    // Filter: return only Near Salvage or Salvaged assets
    const filtered = results.filter((r) => r.assetStatus === "Near Salvage");

    return res.status(200).json({
      code: 200,
      data: filtered,
      message: "Near to salvage and salvaged assets fetched successfully.",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};
exports.getAllAlreadySalvageAsset = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const nearSalvageMonths = 12; // Will be configurable later

    const [rows] = await db.sequelize.query(`
            SELECT 
                GM.*, 
                MI.item_name,
                GIS.asset_tagId,
                GIS.itemSerialNo,
                GIS.batchNo,
                GIS.id AS grn_item_status_id,
                MA.asset_category_name,
                AC.salvage_value,
                AC.use_full_life,
                AC.calculation_id,
                GI.grn_Id AS grn_id,
                GIS.asset_loc_status,
                MB.branch_address,
                MB.branch_name,
                PPO.po_number,
                PPO.po_date
            FROM GRN_MASTER AS GM
            LEFT JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
            LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
            LEFT JOIN MASTER_ASSET AS MA ON MA.id = GI.asset_id
            LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = GM.branch_id
            LEFT JOIN PROCUREMENT_PURCHASE_ORDER AS PPO ON PPO.id = GM.po_Id
            INNER JOIN ASSETCOMPANYDEPRECIATION_CALCULATION AS AC ON AC.asset_id = MA.id
            WHERE GM.entity_id = ${entity_id}
            ORDER BY GM.createdAt DESC
        `);

    const now = new Date();

    const results = rows.map((asset) => {
      const purchaseCost = asset.total_amount;
      const salvagePercent = asset.salvage_value;
      const usefulLife = asset.use_full_life;
      const depreciationMethod = asset.calculation_id === 1 ? "SLM" : "WDV";
      const salvageAmount = purchaseCost * (salvagePercent / 100);

      let currentValue = purchaseCost;
      let assetStatus = "Normal";

      // If user provided depriciated value manually
      if (asset.depriciation_by === "by_value") {
        currentValue = asset.depriciated_value;

        if (currentValue <= salvageAmount) {
          assetStatus = "Salvaged";
        } else if (currentValue <= salvageAmount * 1.1) {
          assetStatus = "Near Salvage";
        }
      } else {
        // Use calculation based on dates
        const putToUseDate =
          asset.depriciation_by === "put_to_use_date"
            ? asset.item_use_date
            : asset.purchase_date;

        const depResults = calculateDepreciation(
          purchaseCost,
          salvageAmount,
          usefulLife,
          putToUseDate,
          depreciationMethod,
        );

        let yearSalvageWillHit = null;

        for (let i = 0; i < depResults.length; i++) {
          const yearResult = depResults[i];
          const closingValue = parseFloat(yearResult.closingValue);

          if (closingValue <= salvageAmount) {
            yearSalvageWillHit = i;
            currentValue = closingValue;
            break;
          }
        }

        if (yearSalvageWillHit !== null) {
          const salvageDate = new Date(putToUseDate);
          salvageDate.setFullYear(
            salvageDate.getFullYear() + yearSalvageWillHit,
          );

          const diffInMonths =
            (salvageDate.getFullYear() - now.getFullYear()) * 12 +
            (salvageDate.getMonth() - now.getMonth());

          if (diffInMonths <= 0) {
            assetStatus = "Salvaged";
          } else if (diffInMonths <= nearSalvageMonths) {
            assetStatus = "Near Salvage";
          }
        }
      }

      return {
        ...asset,
        currentValue: parseFloat(currentValue).toFixed(2),
        salvageAmount: parseFloat(salvageAmount).toFixed(2),
        assetStatus,
      };
    });

    // Filter: return only Near Salvage or Salvaged assets
    const filtered = results.filter((r) => r.assetStatus === "Salvaged");

    return res.status(200).json({
      code: 200,
      data: filtered,
      message: "Salvaged assets fetched successfully.",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

// exports.CreateAssetAllocate = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ code: 422, errors: errors.array() });
//   }
//   try {
//     const { assign_by, grn_item_status_id, grn_id } = req.params;
//     let { allocation_type, department_id, employee_id, branch_id, remarks } =
//       req.body;

//     const existdata = await db.grnItemStatus.findOne({
//       where: { id: grn_item_status_id },
//     });

//     if (
//       existdata.asset_loc_status == "ALLOCATED" &&
//       existdata?.allocation_type == "allocated to employee"
//     ) {
//       return res
//         .status(404)
//         .json({
//           code: 404,
//           message: `This asset is already assigned to another user.`,
//         });
//     }

//     if (allocation_type == "transfer to other location") {
//       await db.grnMaster.update(
//         { branch_id: branch_id },
//         { where: { id: grn_id } }
//       );

//       await db.grnItemStatus.update(
//         {
//           asset_loc_status: "ALLOCATED",
//           allocation_type: "transfer to other location",
//         },
//         { where: { id: grn_item_status_id } }
//       );

//       const createAssetNode = await db.asset_transfer_note.create({
//         remarks,
//         branch_id: branch_id,
//         assign_by
//       });
//       const createallocate = await db.assetHistory.create({
//         assign_by,
//         grn_item_status_id: grn_item_status_id,
//         assign_status: "ALLOCATED",
//         // assigned_from: existdata?.assigned_to || null,
//         branch_id,
//         remarks,
//         grn_id: grn_id,
//         transfer_note_id: createAssetNode.id,
//       });
//       return res
//         .status(200)
//         .json({ code: 200, message: "Asset Allocate Successfully" });
//     } else {
//       const createAssetNode = await db.asset_transfer_note.create({
//         remarks,
//         employee_id: employee_id,
//         assign_by
//       });

//       const createallocate = await db.assetHistory.create({
//         assign_by: assign_by,
//         grn_item_status_id: grn_item_status_id,
//         assign_status: "ALLOCATED",
//         assigned_from: existdata.assigned_to,
//         department_id,
//         employee_id,
//         assigned_to: employee_id,
//         remarks,
//         grn_id,
//         transfer_note_id: createAssetNode.id,
//       });

//       const existHdata = await db.assetHistory.findOne({
//         where: {
//           grn_item_status_id: grn_item_status_id,
//           assigned_to: null,
//           assign_status: "DEALLOCATED",
//         },
//       });

//       if (existHdata) {
//         await db.assetHistory.update(
//           {
//             assigned_to: employee_id,
//           },
//           { where: { id: existHdata.id } }
//         );
//       }

//       await db.grnItemStatus.update(
//         {
//           asset_loc_status: "ALLOCATED",
//           allocation_type: "allocated to employee",
//           assigned_to: employee_id,
//         },
//         { where: { id: grn_item_status_id } }
//       );

//       if (createallocate) {
//         return res
//           .status(200)
//           .json({ code: 200, message: "Asset Allocate Successfully" });
//       } else {
//         return res
//           .status(500)
//           .json({ code: 500, message: "Failed to create GRN" });
//       }
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ code: 500, message: error.message || "Internal Server Error" });
//   }
// };
exports.CreateAssetAllocate = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ code: 422, errors: errors.array() });
    }

    const { assign_by, grn_item_status_id, grn_id } = req.params;
    const { allocation_type, department_id, employee_id, branch_id, remarks } =
      req.body;

    //  STEP 1: check exist
    const existdata = await db.grnItemStatus.findOne({
      where: { id: grn_item_status_id },
      transaction: t,
    });

    if (!existdata) {
      await t.rollback();
      return res.status(404).json({
        code: 404,
        message: "GRN Item Status not found",
      });
    }

    console.log("BEFORE UPDATE:", existdata.toJSON());

    // STEP 2: already allocated check
    if (existdata.asset_loc_status === "ALLOCATED") {
      await t.rollback();
      return res.status(400).json({
        code: 400,
        message: "Asset already allocated",
      });
    }

    // =====================================================
    // LOCATION TRANSFER
    // =====================================================
    if (allocation_type === "transfer to other location") {
      await db.grnMaster.update(
        { branch_id: branch_id },
        { where: { id: grn_id }, transaction: t },
      );

      // MAIN FIX (IMPORTANT)
      const updateResult = await db.grnItemStatus.update(
        {
          asset_loc_status: "ALLOCATED",
          allocation_type: "transfer to other location",
        },
        { where: { id: grn_item_status_id }, transaction: t },
      );

      console.log("UPDATE RESULT:", updateResult);

      const transferNote = await db.asset_transfer_note.create(
        {
          remarks,
          branch_id,
          assign_by,
        },
        { transaction: t },
      );

      await db.assetHistory.create(
        {
          assign_by,
          grn_item_status_id,
          assign_status: "ALLOCATED",
          branch_id,
          remarks,
          grn_id,
          transfer_note_id: transferNote.id,
        },
        { transaction: t },
      );

      await t.commit();

      return res.status(200).json({
        code: 200,
        message: "Asset transferred successfully",
      });
    }

    // =====================================================
    //  EMPLOYEE ALLOCATION
    // =====================================================

    const transferNote = await db.asset_transfer_note.create(
      {
        remarks,
        employee_id,
        assign_by,
      },
      { transaction: t },
    );

    await db.assetHistory.create(
      {
        assign_by,
        grn_item_status_id,
        assign_status: "ALLOCATED",
        assigned_from: existdata.assigned_to || null,
        department_id,
        employee_id,
        assigned_to: employee_id,
        remarks,
        grn_id,
        transfer_note_id: transferNote.id,
      },
      { transaction: t },
    );

    // DEALLOCATED FIX
    const existHdata = await db.assetHistory.findOne({
      where: {
        grn_item_status_id,
        assigned_to: null,
        assign_status: "DEALLOCATED",
      },
      transaction: t,
    });

    if (existHdata) {
      await db.assetHistory.update(
        { assigned_to: employee_id },
        { where: { id: existHdata.id }, transaction: t },
      );
    }

    // MAIN FIX (IMPORTANT)
    const updateResult = await db.grnItemStatus.update(
      {
        asset_loc_status: "ALLOCATED",
        allocation_type: "allocated to employee",
        assigned_to: employee_id,
      },
      { where: { id: grn_item_status_id }, transaction: t },
    );

    console.log("UPDATE RESULT:", updateResult);

    // VERIFY UPDATE
    const updatedRecord = await db.grnItemStatus.findOne({
      where: { id: grn_item_status_id },
      transaction: t,
    });

    console.log("AFTER UPDATE:", updatedRecord.toJSON());

    await t.commit();

    return res.status(200).json({
      code: 200,
      message: "Asset allocated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    await t.rollback();
    console.error("ERROR:", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.deallocateAsset = async (req, res) => {
  try {
    const body = req.body.assetdeAllocate;

    if (!Array.isArray(body) || body.length === 0) {
      return res
        .status(400)
        .json({ code: 400, message: "No allocated_id(s) provided." });
    }

    const results = [];

    for (const data of body) {
      const { allocated_id } = data;

      const existdata = await db.assetHistory.findOne({
        where: { id: allocated_id },
      });

      if (!existdata) {
        results.push({
          id: allocated_id,
          status: "fail",
          message: "Asset not assigned to any user",
        });
        continue;
      }

      const createallocate = await db.assetHistory.create({
        assign_by: existdata.assign_by,
        grn_item_status_id: existdata.grn_item_status_id,
        assign_status: "DEALLOCATED",
        department_id: existdata.department_id,
        employee_id: existdata.employee_id,
        assigned_from: existdata.employee_id,
        remarks: existdata.remarks,
        grn_id: existdata.grn_id,
      });

      await db.grnItemStatus.update(
        { asset_loc_status: "DEALLOCATED" },
        { where: { id: existdata.grn_item_status_id } },
      );

      results.push({
        id: allocated_id,
        status: "success",
        message: "Asset deallocated",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Asset deallocation process completed.",
      results,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.upload_asset_list = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({
      success: false,
      message: "file is not provided",
    });
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  const fileName = req.file.originalname.toLowerCase();
  const entity_id = req.body.entity_id;
  if (fileExtension !== ".xlsx") {
    return res.status(404).json({
      success: false,
      message: "Invalid file format. Only '.xlsx' is allowed.",
    });
  }

  const filePath = req.file.path;

  await mailQueue.add("process-assets", { filePath, entity_id });
  res
    .status(200)
    .json({ success: true, message: "File uploaded and job queued." });
};

// controllers/dashboardController.js
module.exports.getDashboardStats = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const totalAssets = await db.grnMaster.count({
      where: {
        disposition_status: { [Op.is]: null },
        entity_id: entity_id,
      },
    });

    const byType = await db.asset.count();

    const totalValue = await db.grnMaster.sum("total_amount", {
      where: {
        disposition_status: null,
        entity_id: entity_id,
      },
    });

    const [lifecycleStatusRaw] = await db.sequelize.query(`
    SELECT lifecycle_status, COUNT(*) as count
FROM (
  SELECT
    CASE
    WHEN grn.disposition_status IS NOT NULL AND LOWER(TRIM(grn.disposition_status)) = 'sell' THEN 'SOLD'
    WHEN grn.disposition_status IS NOT NULL AND LOWER(TRIM(grn.disposition_status)) = 'writeOff' THEN 'Written Off'
    WHEN LOWER(TRIM(s.status_name)) = 'in use' THEN 'In Use'
    WHEN LOWER(TRIM(s.status_name)) = 'maintenance' THEN 'Under Maintenance'
    WHEN grn.purchase_date IS NOT NULL AND grn.purchase_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 'Newly Acquired'
      ELSE 'Unknown'
    END AS lifecycle_status
  FROM GRN_MASTER grn
  LEFT JOIN AssetStatuses s ON grn.asset_status_id = s.id
) AS status_group
GROUP BY lifecycle_status;
      `);

    const lifecycleStatus = lifecycleStatusRaw.map((item) => ({
      status: item.lifecycle_status,
      count: Number(item.count),
    }));

    const [valueDistributionRaw] = await db.sequelize.query(`
SELECT 
  ma.asset_category_name AS category,
  SUM(grn.total_amount) AS total
FROM GRN_MASTER grn
JOIN GRN_ITEM gi ON grn.id = gi.grn_id
JOIN MASTER_ASSET ma ON gi.asset_id = ma.id
GROUP BY ma.asset_category_name
      `);

    const valueDistribution = valueDistributionRaw.map((item) => ({
      category: item.category,
      total: Number(item.total),
    }));

    const [assetsPerLocationRaw] = await db.sequelize.query(`
        SELECT 
          mb.branch_name AS location,
          COUNT(gi.id) AS asset_count
        FROM GRN_MASTER grn
        JOIN MASTER_BRANCH mb ON grn.branch_id = mb.id
        JOIN GRN_ITEM gi ON grn.id = gi.grn_id
        GROUP BY mb.branch_name
      `);
    const assetsPerLocation = assetsPerLocationRaw.map((item) => ({
      location: item.location,
      asset_count: Number(item.asset_count),
    }));

    const [assetsPerDepartmentRaw] = await db.sequelize.query(`
        SELECT 
          md.department_name AS department,
          COUNT(gi.id) AS asset_count
        FROM GRN_ASSET_TRANSFER_HISTORY gath
        JOIN MASTER_DEPARTMENT md ON gath.department_id = md.dept_id
        JOIN GRN_MASTER grn ON gath.grn_id = grn.id
        JOIN GRN_ITEM gi ON grn.id = gi.grn_id
        GROUP BY md.department_name
      `);

    const assetsPerDepartment = assetsPerDepartmentRaw.map((item) => ({
      department: item.department,
      asset_count: Number(item.asset_count),
    }));

    res.status(200).send({
      code: 200,
      message: "Success",
      data: {
        totalAssets,
        byType,
        totalValue,
        lifecycleStatus,
        valueDistribution,
        assetsPerLocation,
        assetsPerDepartment,
      },
    });
  } catch (error) {
    res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getDepreciationForAsset = async (req, res) => {
  try {
    const grn_id = req.params.grn_id;
    const [result] = await db.sequelize.query(`
            SELECT * FROM ASSETCOMPANY_DEPRECIATIONCALCULATION_DAILYLOGs WHERE grn_id=${grn_id};
`);

    if (result.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Success!", data: result });
    } else {
      return res.status(404).send({ code: 404, message: "Data not found!" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.allocateBulkAsset = async (req, res) => {
  let t;
  try {
    let { formdata, assets } = req.body;
    let {
      allocation_type,
      department_id,
      employee_id,
      branch_id,
      assign_by,
      remarks,
    } = formdata;

    // Ensure the required history tables exist in the database (resolving missing table errors)
    // await db.assetHistoryLog.sync();
    // await db.assetHistory.sync();

    t = await db.sequelize.transaction();

    if (allocation_type === "transfer to other location") {
      const createAssetNode = await db.asset_transfer_note.create(
        {
          remarks,
          branch_id: branch_id,
          assign_by,
        },
        { transaction: t },
      );

      for (const element of assets) {
        await db.grnMaster.update(
          { branch_id: branch_id },
          { where: { id: element.grn_id }, transaction: t },
        );

        await db.grnItemStatus.update(
          {
            asset_loc_status: "ALLOCATED",
            allocation_type: "transfer to other location",
          },
          { where: { id: element.grn_item_status_id }, transaction: t },
        );

        await db.assetHistory.create(
          {
            assign_by,
            grn_item_status_id: element.grn_item_status_id,
            assign_status: "ALLOCATED",
            branch_id,
            remarks,
            grn_id: element.grn_id,
            transfer_note_id: createAssetNode.id,
          },
          { transaction: t },
        );
      }

      await t.commit();
      return res
        .status(200)
        .json({
          code: 200,
          message: "Asset allocated successfully to other location.",
        });
    } else {
      const createAssetNode = await db.asset_transfer_note.create(
        {
          remarks,
          employee_id: employee_id,
          assign_by,
        },
        { transaction: t },
      );

      for (const element of assets) {
        const existdata = await db.grnItemStatus.findOne({
          where: { id: element.grn_item_status_id },
          transaction: t,
        });

        if (
          existdata?.asset_loc_status === "ALLOCATED" &&
          existdata?.allocation_type === "allocated to employee"
        ) {
          await t.rollback();
          return res.status(409).json({
            code: 409,
            message: `${element.item_name} asset is already assigned to another user.`,
          });
        }

        const createallocate = await db.assetHistory.create(
          {
            assign_by,
            grn_item_status_id: element.grn_item_status_id,
            assign_status: "ALLOCATED",
            assigned_from: existdata?.assigned_to || null,
            department_id,
            employee_id,
            assigned_to: employee_id,
            remarks,
            grn_id: element.grn_id,
            transfer_note_id: createAssetNode.id,
          },
          { transaction: t },
        );

        if (!createallocate) {
          throw new Error("Failed to create asset history.");
        }

        const existHdata = await db.assetHistory.findOne({
          where: {
            grn_item_status_id: element.grn_item_status_id,
            assigned_to: null,
            assign_status: "DEALLOCATED",
          },
          transaction: t,
        });

        if (existHdata) {
          await db.assetHistory.update(
            { assigned_to: employee_id },
            { where: { id: existHdata.id }, transaction: t },
          );
        }

        await db.grnItemStatus.update(
          {
            asset_loc_status: "ALLOCATED",
            allocation_type: "allocated to employee",
            assigned_to: employee_id,
          },
          { where: { id: element.grn_item_status_id }, transaction: t },
        );
      }

      await t.commit();
      return res
        .status(200)
        .json({
          code: 200,
          message: "Asset allocated successfully to employee.",
        });
    }
  } catch (error) {
    if (t) {
      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAssetAssetNoteList = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const query = `SELECT ATN.id AS tranfer_node_id, CONCAT(HRU.first_name, ' ', HRU.last_name) AS employee_name, CONCAT(HRUT.first_name, ' ', HRUT.last_name) AS assign_by, MB.branch_name, ATN.remarks,
        (
            SELECT COUNT(*) 
            FROM GRN_ASSET_TRANSFER_HISTORY AS GATH 
            WHERE GATH.transfer_note_id = ATN.id
        ) AS quantity
    FROM ASSET_TRANSFER_NOTE AS ATN LEFT JOIN MASTER_BRANCH AS MB ON MB.id = ATN.branch_id LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = ATN.employee_id LEFT JOIN HRMS_REGISTERED_USER AS HRUT ON HRUT.employee_id = ATN.assign_by ORDER BY ATN.id DESC`;

    const [grnData] = await Promise.all([
      db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }),
    ]);

    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Allocated Asset list data successfully",
        data: grnData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
        data: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

module.exports.downloadAssetNote = async (req, res) => {
  try {
    const { tranfer_note_id } = req.query;
    const [AssetData] = await db.sequelize.query(`
        SELECT CONCAT(HRU.first_name, ' ', HRU.last_name) AS employee_name, CONCAT(HRUF.first_name, ' ', HRUF.last_name) AS assignedBy, MI.item_name AS asset_name, ATN.id AS transfer_note_id, GIS.asset_tagId AS asset_no, MB.branch_name, ATN.remarks,DATE_FORMAT(GATH.createdAt, '%d-%m-%Y') AS formatted_date FROM ASSET_TRANSFER_NOTE AS ATN 
        LEFT JOIN GRN_ASSET_TRANSFER_HISTORY AS GATH ON GATH.transfer_note_id = ATN.id
        LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = GATH.employee_id 
        LEFT JOIN MASTER_BRANCH AS MB ON MB.id = GATH.branch_id 
        LEFT JOIN HRMS_REGISTERED_USER AS HRUF 
        ON HRUF.employee_id = GATH.assign_by 
        LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.id = GATH.grn_item_status_id
        LEFT JOIN GRN_ITEM AS GI ON GI.id = GIS.grn_item_id
        LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id WHERE GATH.transfer_note_id =${tranfer_note_id}
      `);

    //   console.log("AssetDataAssetDataAssetDataAssetData",AssetData);
    const logoPath = path.resolve(
      __dirname,
      "../../CRM/utils/templates/selected-logo.jpg",
    );
    const logoBuffer = fs.readFileSync(logoPath);
    const logoUrl = `data:image/jpg;base64,${logoBuffer.toString("base64")}`;

    const htmlFilePath = path.resolve(
      __dirname,
      "../../utils/template/Asset_node.html",
    );
    const html = fs.readFileSync(htmlFilePath, "utf-8");
    const receiverName = AssetData[0].employee_name || AssetData[0].branch_name;
    const htmlWithData = html
      .replace("{getData}", generateGrnTable(AssetData))
      .replace("{receiverName}", receiverName || "")
      .replace("{assignedBy}", AssetData[0].assignedBy)
      .replace("{createdAt}", AssetData[0].formatted_date)
      .replace("{logoUrl}", logoUrl);

    const pdfBuffer = await generatePDF(htmlWithData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=assetTransfer_${tranfer_note_id}.pdf`);
    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

async function generatePDF(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();
  return pdfBuffer;
}

function generateGrnTable(assetList) {
  return assetList
    .map(
      (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.asset_name}</td>
      <td>${item.asset_no}</td>
      <td>${item.remarks || ""}</td>
    </tr>
  `,
    )
    .join("");
}

exports.createDisposition = async (req, res) => {
  const t = await db.sequelize.transaction();
  let isCommitted = false;
  try {
    let {
      actionType,
      saleDate,
      buyerName,
      buyerContact,
      buyerCompany,
      paymentMode,
      invoiceUpload,
      discardDate,
      writeoffReason,
      disposalMethod,
      supportingDocs,
      notes,
      employee_id,
      entity_id,
      assets,
      Account_details,
    } = req.body;

    if (supportingDocs && Object.keys(supportingDocs).length === 0) {
      supportingDocs = null;
    }
    if (invoiceUpload && Object.keys(invoiceUpload).length === 0) {
      invoiceUpload = null;
    }
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res
        .status(400)
        .send({ code: 400, message: "No asset items provided." });
    }

    const disposition = await db.AssetDisposition.create(
      {
        disposition_type: actionType,
        buyer_name: buyerName,
        buyer_contact: buyerContact,
        buyer_company: buyerCompany,
        paymentMode: paymentMode ? paymentMode : null,
        note: notes,
        disposal_method: disposalMethod,
        discard_reason: writeoffReason,
        supportingDocs,
        discard_date: discardDate ? discardDate : null,
        invoiceUpload,
        employee_id,
        entity_id,
        disposition_date: saleDate ? saleDate : null,
      },
      { transaction: t },
    );

    const results = [];

    for (const item of assets) {
      const { grn_id, salePrice, profitLoss, scrapValue } = item;

      const grnExists = await db.grnMaster.findOne({ where: { id: grn_id } });
      if (!grnExists) {
        results.push({ grn_id, status: "fail", message: "Asset not found." });
        continue;
      }

      await db.AssetDispositionItem.create(
        {
          disposition_id: disposition.id,
          grn_id,
          sell_price: salePrice === "" ? null : salePrice,
          profitOrLoss: profitLoss === "" ? null : profitLoss,
          scrap_value: scrapValue === "" ? null : scrapValue,
        },
        { transaction: t },
      );

      await db.grnMaster.update(
        {
          disposition_status: actionType,
          updatedAt: new Date(),
        },
        { where: { id: grn_id }, transaction: t },
      );

      results.push({
        grn_id,
        status: "success",
        message: `Asset marked as ${actionType}`,
      });
    }

    const receipt_no = "GPMT" + Math.floor(100000 + Math.random() * 900000);

    const jurnalData = await Account_details.map((element) => ({
      chart_account_id: element.chart_account_id,
      debit_amount: element.debit_amount,
      credit_amount: element.credit_amount,
      entity_id: entity_id,
      disposition_id: disposition.id,
      entry_status: "Asset Sold",
      document_number: receipt_no,
    }));

    await db.financial_And_Account_Journal_List.bulkCreate(jurnalData, {
      transaction: t,
    });
    await t.commit();
    isCommitted = true;

    return res.status(200).send({
      code: 200,
      message: "Disposition processed successfully.",
      disposition_id: disposition.id,
      results,
    });
  } catch (error) {
    if (!isCommitted) {
      await t.rollback();
    }
    console.log("error", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllDisposedAssets = async (req, res) => {
  try {
    const [data] = await db.sequelize.query(`
            SELECT 
                adi.id AS disposition_item_id,
                ad.id AS disposition_id,
                ad.disposition_type,
                CASE 
                    WHEN ad.disposition_type = 'sell' THEN 'Sold'
                    WHEN ad.disposition_type = 'writeOff' THEN 'Written Off'
                    ELSE 'Unknown'
                END AS disposition_label,
                ad.disposition_date,
                ad.discard_date,
                ad.note AS disposition_note,
                grn.id AS grn_id,
                grn.total_amount,
                grn.asset_type,
                grn.vat,
                MB.branch_address,
                MB.branch_name,
                GIS.id AS grn_item_status_id,
                GIS.asset_tagId,
                GIS.batchNo,
                GIS.itemSerialNo,
                MA.asset_category_name,
                MID.image,
                MI.item_name,
                grn.depriciated_value,
                grn.accumulated_dep,
                (grn.total_amount - COALESCE(grn.accumulated_dep, 0)) AS net_value,
                adi.sell_price,
                adi.profitOrLoss,
                adi.scrap_value,
                ad.buyer_name,
                ad.buyer_contact,
                ad.buyer_company,
                ad.paymentMode,
                ad.disposal_method,
                ad.discard_reason

            FROM ASSET_DISPOSITION_ITEMS AS adi
            LEFT JOIN ASSET_DISPOSITION AS ad ON ad.id = adi.disposition_id
            LEFT JOIN GRN_MASTER AS grn ON grn.id = adi.grn_id

            LEFT JOIN GRN_ITEM AS GI ON GI.grn_id = adi.grn_id
            LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
            LEFT JOIN ITEM_IMAGE_DOCUMENTs AS MID ON MID.item_id = MI.id
            LEFT JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id   
            LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
            INNER JOIN MASTER_BRANCH AS MB ON MB.id = grn.branch_id

            ORDER BY ad.createdAt DESC
        `);

    return res.status(200).json({
      code: 200,
      message: "Disposed assets fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
exports.createRevaluation = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      revaluation_date,
      // invoiceUpload,
      notes,
      employee_id,
      entity_id,
      assets,
      approvalStatus,
    } = req.body;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res
        .status(400)
        .json({ code: 400, message: "No asset items provided." });
    }
    const results = [];

    for (const asset of assets) {
      const { grn_id, netBookValue, newValue } = asset;

      if (!grn_id || newValue == null || netBookValue == null) {
        throw new Error("Missing fields in one of the asset entries.");
      }

      // Insert into asset revaluation table
      const revaluationEntry = await db.assetRevaluation.create(
        {
          grn_id,
          old_value: netBookValue,
          new_value: newValue,
          revaluation_date: revaluation_date,
          reason_notes: notes,
          employee_id,
          status: approvalStatus,
          entity_id,
        },
        { transaction: t },
      );

      // Update GRN_MASTER with latest value
      await db.grnMaster.update(
        {
          is_revaluated: true,
          total_amount: newValue,
        },
        {
          where: { id: grn_id },
          transaction: t,
        },
      );

      results.push(revaluationEntry);
    }
    await t.commit();
    return res.status(200).send({
      code: 200,
      message: "Revaluation processed successfully.",
      // revaluation_id: revaluation.id,
      results,
    });
  } catch (error) {
    await t.rollback();
    console.log("error", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllRevaluedAssets = async (req, res) => {
  try {
    const [data] = await db.sequelize.query(`
          SELECT 
              ar.id AS revaluation_id,
              ar.grn_id,
              ar.old_value,
              ar.new_value,
              ar.revaluation_date,
              ar.reason_notes,
              ar.createdAt AS revalued_on,
              grn.total_amount,
              grn.asset_type,
              grn.vat,
              grn.depriciated_value,
              grn.accumulated_dep,
              grn.branch_id,
              (grn.total_amount - COALESCE(grn.accumulated_dep, 0)) AS net_value_before_revaluation,
              (ar.new_value - COALESCE(grn.accumulated_dep, 0)) AS net_value_after_revaluation,
              MB.branch_address,
              MB.branch_name,
              GIS.asset_tagId,
              GIS.batchNo,
              MA.asset_category_name,
              MID.image,
              MI.item_name

          FROM ASSET_REVALUATION AS ar
          LEFT JOIN GRN_MASTER AS grn ON grn.id = ar.grn_id
          LEFT JOIN GRN_ITEM AS GI ON GI.grn_id = ar.grn_id
          LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
          LEFT JOIN ITEM_IMAGE_DOCUMENTs AS MID ON MI.id = MID.item_id
          LEFT JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id
          LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
          LEFT JOIN MASTER_BRANCH AS MB ON MB.id = grn.branch_id

          ORDER BY ar.createdAt DESC
      `);

    return res.status(200).json({
      code: 200,
      message: "Revalued assets fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports.getAssetDashboard = async (req, res) => {
  const { entity_id, financial_id } = req.params;
  const { fromMonth, toMonth, is_filter } = req.body;
  let condition;
  try {
    if (is_filter) {
      condition = `AND MONTH(ER.createdAt) BETWEEN ${fromMonth} AND ${toMonth}`;
    } else {
      condition = "";
    }

    const [Assetdata] = await db.sequelize.query(`
      SELECT COUNT(GIS.id) as count , SUM(GI.amount) AS total_amount, SUM(GM.accumulated_dep) AS depreciated_amount
      FROM GRN_MASTER AS GM INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
      INNER JOIN GRN_ITEM_STATUS GIS ON GI.id = GIS.grn_item_id
      INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id AND MI.itemType = '2'  WHERE GM.disposition_status IS NULL AND GM.entity_id = ${entity_id} AND GM.financial_year_id = ${financial_id} AND MONTH(GM.createdAt) BETWEEN ${fromMonth} AND ${toMonth}`);

    const [assetByValue] = await db.sequelize.query(`
      SELECT MA.asset_category_name , SUM(GI.amount) AS total_amount, COUNT(GI.id) AS total_used_asset, GI.item_id
      FROM GRN_MASTER AS GM INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
      INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id AND MI.itemType = '2' INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id WHERE GM.disposition_status IS NULL AND GM.entity_id = ${entity_id} AND GM.financial_year_id = ${financial_id} AND MONTH(GM.createdAt) BETWEEN ${fromMonth} AND ${toMonth} GROUP BY MA.id,GI.item_id
    `);

    const [assetByType] = await db.sequelize.query(`
      SELECT MA.asset_category_name, SUM(GI.amount) AS total_amount, COUNT(GI.id) AS total_used_asset, GI.item_id, GM.accumulated_dep AS depreciated_amount
      FROM GRN_MASTER AS GM INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
      INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id AND MI.itemType = '2' INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id WHERE GM.disposition_status IS NULL AND GM.entity_id = ${entity_id} AND GM.financial_year_id = ${financial_id} AND MONTH(GM.createdAt) BETWEEN ${fromMonth} AND ${toMonth} GROUP BY MA.id,GI.item_id ORDER BY GI.id DESC LIMIT 5
    `);

    const [totalOutOfStockItem] = await db.sequelize.query(`
      SELECT COUNT(ER.requester_id) as count
      FROM ESS_RAISE_INDENT AS ER INNER JOIN ESS_RAISE_INDENT_ITEM AS ERI
      ON ER.requester_id = ERI.requester_id WHERE ER.allocate_status = 'ALLOCATED' AND ER.entity_id = ${entity_id} AND ER.financial_year_id = ${financial_id} ${condition}
    `);

    const [OutOfStockItem] = await db.sequelize.query(`
      SELECT MA.asset_category_name, MI.item_name, MI.item_code,MI.item_document
      FROM ESS_RAISE_INDENT AS ER INNER JOIN ESS_RAISE_INDENT_ITEM AS ERI
      ON ER.requester_id = ERI.requester_id INNER JOIN MASTER_ITEM AS MI ON MI.id = ERI.item_name INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id WHERE ER.allocate_status = 'ALLOCATED' AND ER.entity_id = ${entity_id} AND ER.financial_year_id = ${financial_id} ${condition} GROUP BY MA.id,ERI.item_name ORDER BY ERI.indent_Item_id DESC LIMIT 5
    `);

    res.status(200).send({
      code: 200,
      message: "Success",
      data: {
        Assetdata: Assetdata[0],
        totalOutOfStockItem: totalOutOfStockItem[0],
        assetByValue: assetByValue,
        assetByType: assetByType,
        OutOfStockItem: OutOfStockItem,
      },
    });
  } catch (error) {
    res.status(500).send({ code: 500, message: error.message });
  }
};

exports.getWriteOffAssetList = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const [dispositionData] = await db.sequelize.query(
      `SELECT AD.id AS disposition_id, SUM(ADI.sell_price) AS sell_price, AD.approval_status, CONCAT(HRU.first_name, ' ', HRU.last_name) AS owner_name, GROUP_CONCAT(DISTINCT GIS.asset_tagId) AS asset_tagIds ,GROUP_CONCAT(GM.total_amount) AS total_amount, GM.accumulated_dep,MI.item_name, (GM.total_amount - COALESCE(GM.accumulated_dep, 0)) AS net_value FROM ASSET_DISPOSITION AS AD LEFT JOIN ASSET_DISPOSITION_ITEMS AS ADI ON ADI.disposition_id = AD.id LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = AD.employee_id LEFT JOIN GRN_MASTER AS GM ON GM.id = ADI.grn_id LEFT JOIN GRN_ITEM AS GI ON GI.grn_Id = ADI.grn_id LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id WHERE AD.entity_id = ${entity_id} AND AD.disposition_type = 'writeOff' GROUP BY AD.id ORDER BY AD.createdAt DESC`,
    );

    if (dispositionData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Asset list data successfully",
        data: dispositionData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getWriteOffAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const [dispositionData] = await db.sequelize.query(`SELECT 
        AD.id AS disposition_id,
        AD.discard_date,
        AD.discard_reason,
        AD.disposal_method,
        AD.invoiceUpload,
        AD.approval_status,
        AD.note,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', GM.id,
              'sell_price', ADI.sell_price,
              'accumulated_dep', GM.accumulated_dep,
              'asset_tagId', GIS.asset_tagId,
              'item_name', MI.item_name,
              'net_value', (GM.total_amount - COALESCE(GM.accumulated_dep, 0)),
              'total_amount', GM.total_amount
            )
          )
          FROM ASSET_DISPOSITION_ITEMS AS ADI
          LEFT JOIN GRN_MASTER AS GM ON GM.id = ADI.grn_id
          LEFT JOIN GRN_ITEM AS GI ON GI.grn_Id = ADI.grn_id
          LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
          LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
          WHERE ADI.disposition_id = AD.id
        ) AS item_list,
        (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', FAJL.id,
            'chart_account_id', FAJL.chart_account_id,
            'debit_amount', FAJL.debit_amount,
            'credit_amount', FAJL.credit_amount
        ))
        FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL
        WHERE FAJL.disposition_id = AD.id
    ) AS Accountlist
      FROM ASSET_DISPOSITION AS AD
      WHERE AD.id = ${id} AND AD.disposition_type = 'writeOff';
    `);
    if (dispositionData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Asset list data successfully",
        data: dispositionData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.updateDisposition = async (req, res) => {
  const { disposition_id } = req.params;
  const t = await db.sequelize.transaction();
  let isCommitted = false;
  try {
    const {
      actionType,
      saleDate,
      buyerName,
      buyerContact,
      buyerCompany,
      paymentMode,
      invoiceUpload,
      discardDate,
      writeoffReason,
      disposalMethod,
      supportingDocs,
      notes,
      employee_id,
      entity_id,
      approvalStatus,
      assets,
    } = req.body;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res
        .status(400)
        .json({ code: 400, message: "No asset items provided." });
    }
    if (actionType == "writeOff") {
      await db.AssetDisposition.update(
        {
          disposition_type: actionType,
          note: notes,
          disposal_method: disposalMethod,
          discard_reason: writeoffReason,
          discard_date: discardDate ?? null,
          disposition_date: saleDate ?? null,
          approval_status: approvalStatus ?? null,
        },
        {
          where: { id: disposition_id },
          transaction: t,
        },
      );
    } else {
      await db.AssetDisposition.update(
        {
          buyer_name: buyerName,
          buyer_contact: buyerContact,
          buyer_company: buyerCompany,
          paymentMode: paymentMode ?? null,
          disposition_type: actionType,
          note: notes,
          approval_status: approvalStatus ?? null,
        },
        {
          where: { id: disposition_id },
          transaction: t,
        },
      );
    }

    const results = [];

    for (const item of assets) {
      const { grn_id, salePrice, profitLoss, scrapValue } = item;

      const grnExists = await db.grnMaster.findOne({ where: { id: grn_id } });
      if (!grnExists) {
        results.push({ grn_id, status: "fail", message: "Asset not found." });
        continue;
      }

      await db.AssetDispositionItem.update(
        {
          sell_price: salePrice === "" ? null : salePrice,
          profitOrLoss: profitLoss === "" ? null : profitLoss,
          // scrap_value: scrapValue === '' ? null : scrapValue
        },
        {
          where: { grn_id, disposition_id: disposition_id },
          transaction: t,
        },
      );

      results.push({
        grn_id,
        status: "success",
        message: `Asset marked as ${actionType}`,
      });
    }

    await t.commit();
    isCommitted = true;

    return res.status(200).json({
      code: 200,
      message: "Disposition processed successfully.",
      disposition_id: disposition_id,
      results,
    });
  } catch (error) {
    if (!isCommitted) {
      await t.rollback();
    }
    console.log("error", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getSellAssetList = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const [dispositionData] = await db.sequelize.query(
      `SELECT AD.id AS disposition_id, SUM(ADI.sell_price) AS sell_price, AD.buyer_name, AD.approval_status, CONCAT(HRU.first_name, ' ', HRU.last_name) AS owner_name, GROUP_CONCAT(DISTINCT GIS.asset_tagId) AS asset_tagIds ,GROUP_CONCAT(GM.total_amount) AS total_amount, GM.accumulated_dep,MI.item_name, (GM.total_amount - COALESCE(GM.accumulated_dep, 0)) AS net_value FROM ASSET_DISPOSITION AS AD LEFT JOIN ASSET_DISPOSITION_ITEMS AS ADI ON ADI.disposition_id = AD.id LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = AD.employee_id LEFT JOIN GRN_MASTER AS GM ON GM.id = ADI.grn_id LEFT JOIN GRN_ITEM AS GI ON GI.grn_Id = ADI.grn_id LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id WHERE AD.entity_id = ${entity_id} AND AD.disposition_type = 'sell' GROUP BY AD.id ORDER BY AD.createdAt DESC`,
    );

    if (dispositionData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Asset list data successfully",
        data: dispositionData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getSoldAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const [dispositionData] = await db.sequelize.query(`SELECT 
        AD.id AS disposition_id,
        AD.discard_date,
        AD.disposition_date,
        AD.discard_reason,
        AD.disposal_method,
        AD.invoiceUpload,
        AD.buyer_name,
        AD.buyer_contact,
        AD.buyer_company,
        AD.scrap_value,
        AD.paymentMode,
        AD.approval_status,
        AD.invoiceUpload,
        AD.note,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', GM.id,
              'sell_price', ADI.sell_price,
              'accumulated_dep', GM.accumulated_dep,
              'asset_tagId', GIS.asset_tagId,
              'item_name', MI.item_name,
              'profitOrLoss', ADI.profitOrLoss,
              'net_value', (GM.total_amount - COALESCE(GM.accumulated_dep, 0)),
              'total_amount', GM.total_amount
            )
          )
          FROM ASSET_DISPOSITION_ITEMS AS ADI
          LEFT JOIN GRN_MASTER AS GM ON GM.id = ADI.grn_id
          LEFT JOIN GRN_ITEM AS GI ON GI.grn_Id = ADI.grn_id
          LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
          LEFT JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id
          WHERE ADI.disposition_id = AD.id
        ) AS item_list,
        (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', FAJL.id,
            'chart_account_id', FAJL.chart_account_id,
            'debit_amount', FAJL.debit_amount,
            'credit_amount', FAJL.credit_amount
        ))
        FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL
        WHERE FAJL.disposition_id = AD.id
    ) AS Accountlist
      FROM ASSET_DISPOSITION AS AD
      WHERE AD.id = ${id} AND AD.disposition_type = 'sell';
    `);
    if (dispositionData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Asset list data successfully",
        data: dispositionData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Asset Items found..",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Internal Server Error" });
  }
};
