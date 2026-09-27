const db = require("../../../models/index");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { Op } = require("sequelize");
const mail = require("../../../CRM/utils/mail/mail");

module.exports.createWarehouseManagement = async (req, res) => {
  const t = await db.sequelize.transaction(); // 🔁 Start transaction
  try {
    const {
      batch_number,
      inward_date,
      quantity,
      cost_price,
      total_value,
      document_type_id,
      item_id,
      sub_category_id,
      item_name_id,
      warehouse_id,
      vendor_id,
      uploaded_mode,
      serialNumber,
      warehouseRow_id,
      warehouseShalf_id,
      warehouseSection_id,
    } = req.body;

    let mappingData = [];

    // Step 1: Gather serial numbers
    if (uploaded_mode === "manual" && serialNumber) {
      const serials =
        typeof serialNumber === "string"
          ? JSON.parse(serialNumber)
          : serialNumber;

      mappingData = serials.map((entry) => ({
        serial_number: entry.serialNumber,
        uploaded_mode,
      }));
    } else if (uploaded_mode === "excel" && req.file) {
      const filePath = path.join(__dirname, "../../../../", req.file.path);

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
      });

      mappingData = sheetData
        .filter(
          (row) =>
            row["serialNumber"] || row["Serial Number"] || row["serial_number"]
        )
        .map((row) => ({
          serial_number:
            row["serialNumber"] || row["Serial Number"] || row["serial_number"],
          uploaded_mode,
        }));

      fs.unlinkSync(filePath);
    }

    // Step 2: Validations
    if (mappingData.length === 0) {
      await t.rollback();
      return res.status(400).json({
        code: 400,
        message: "No serial numbers provided.",
      });
    }

    const serialNumbers = mappingData.map((item) => item.serial_number);

    if (serialNumbers.length !== Number(quantity)) {
      await t.rollback();
      return res.status(400).json({
        code: 400,
        message: `Quantity (${quantity}) does not match number of serial numbers (${serialNumbers.length}).`,
      });
    }

    const duplicateInUploaded = serialNumbers.filter(
      (val, idx, arr) => arr.indexOf(val) !== idx
    );
    if (duplicateInUploaded.length > 0) {
      await t.rollback();
      return res.status(400).json({
        code: 400,
        message: "Duplicate serial numbers found in uploaded data.",
        duplicate_serial_numbers: [...new Set(duplicateInUploaded)],
      });
    }

    const existingSerials = await db.warehouseManagementMapping.findAll({
      where: { serial_number: serialNumbers },
      attributes: ["serial_number"],
      raw: true,
    });

    if (existingSerials.length > 0) {
      await t.rollback();
      return res.status(409).json({
        code: 409,
        message:
          "Some serial numbers already exist in the Warehouse. No data inserted.",
        duplicate_count: existingSerials.length,
        duplicate_serial_numbers: existingSerials.map((e) => e.serial_number),
      });
    }

    // Step 3: Insert into warehousemanagement table
    const warehouseData = await db.warehousemanagement.create(
      {
        batch_number,
        inward_date,
        quantity,
        cost_price,
        total_value,
        document_type_id,
        item_id,
        sub_category_id,
        item_name_id,
        warehouse_id,
        vendor_id,
        warehouseRow_id,
        warehouseShalf_id,
        warehouseSection_id,
      },
      { transaction: t }
    );

    // Step 4: Insert into warehouseManagementMapping table
    const finalMappingData = mappingData.map((item) => ({
      ...item,
      warehousemanagement_id: warehouseData.id,
    }));

    await db.warehouseManagementMapping.bulkCreate(finalMappingData, {
      transaction: t,
    });

    let getRemainingQuantity = await db.warehouseBifurcationSection.findOne({
      where: { id: warehouseSection_id },
    });
    console.log("sdsds", getRemainingQuantity);
    let getOnyQuantity =
      (await getRemainingQuantity.remaining_capacity) - quantity;

    await db.warehouseBifurcationSection.update(
      { remaining_capacity: getOnyQuantity },
      {
        where: { id: warehouseSection_id },
        transaction: t,
      }
    );

    // ✅ Commit transaction
    await t.commit();

    return res.status(201).json({
      code: 201,
      message: "Warehouse data processed successfully",
      inserted_count: finalMappingData.length,
      duplicate_count: 0,
      duplicate_serial_numbers: [],
    });
  } catch (err) {
    console.error("Upload error:", err);
    await t.rollback(); // ❌ Rollback on error
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.getWarehouseForDisatch = async (req, res) => {
  try {
    let { item_id, quantity } = req.query;
    let warehouseData = await db.warehousemanagement.findAll({
      where: { item_name_id: item_id, quantity: { [Op.gte]: quantity } },
      include: [
        {
          model: db.warehouse,
        },
        {
          model: db.ItemMaster,
        },
      ],
      group: ["warehouse_id"],
    });
    if (warehouseData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Warehouse successfully",
        data: warehouseData,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.getRowForDisatch = async (req, res) => {
  try {
    let { item_id, warehouse_id } = req.query;
    let rowData = await db.warehousemanagement.findAll({
      where: { item_name_id: item_id, warehouse_id: warehouse_id },
      include: [
        {
          model: db.warehouseBifurcationRow,
        },
      ],
      group: ["warehouseRow_id"],
    });

    rowData = rowData.map((x) => x.WAREHOUSE_BIFURCATION_Row);
    if (rowData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Warehouse successfully",
        data: rowData,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
module.exports.getShelfForDisatch = async (req, res) => {
  try {
    let { item_id, warehouseRow_id } = req.query;
    let rowData = await db.warehousemanagement.findAll({
      where: { item_name_id: item_id, warehouseRow_id: warehouseRow_id },
      include: [
        {
          model: db.warehouseBifurcationSelf,
        },
      ],
      group: ["warehouseShalf_id"],
    });

    rowData = rowData.map((x) => x.WAREHOUSE_BIFURCATION_SELF);
    if (rowData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Warehouse successfully",
        data: rowData,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
module.exports.getSectionForDisatch = async (req, res) => {
  try {
    let { item_id, warehouseShalf_id } = req.query;
    let rowData = await db.warehousemanagement.findAll({
      where: { item_name_id: item_id, warehouseShalf_id: warehouseShalf_id },
      include: [
        {
          model: db.warehouseBifurcationSection,
        },
      ],
      group: ["warehouseSection_id"],
    });

    rowData = rowData.map((x) => ({
      warehouseMana_id: x.id,
      ...x.WAREHOUSE_BIFURCATION_SECTION.dataValues,
    }));

    if (rowData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Warehouse successfully",
        data: rowData,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
module.exports.getSerialNoBySection = async (req, res) => {
  try {
    let { section_id, item_id } = req.query;
    let warehouseMapping = await db.warehousemanagement.findAll({
      where: {
        warehouseSection_id: section_id,
        item_name_id: item_id,
      },
    });
    let warehouseIds = warehouseMapping.map((item) => item.id);
    let rowData = await db.warehouseManagementMapping.findAll({
      where: {
        warehousemanagement_id: {
          [Op.in]: warehouseIds,
        },
        is_dispatched: false,
      },
    });
    if (rowData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All serial no successfully",
        data: rowData,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.dispatchedOrder = async (req, res) => {
  const {
    terms_and_conditions,
    notes,
    expected_delivery_date,
    expected_dispatch_date,
    financial_id,
    entity_id,
    sales_order_id,
    is_proceed_to_dispatched,
    reason,
    isDispatchExceeded,
  } = req.body;

  if (
    !financial_id ||
    !entity_id ||
    !expected_delivery_date ||
    !expected_dispatch_date ||
    !sales_order_id ||
    !is_proceed_to_dispatched
  ) {
    return res
      .status(400)
      .send({ code: 400, message: "All fields are required" });
  }

  const transaction = await db.sequelize.transaction();

  try {
    const dispatchedData = await db.salesOrderDispatched.create(
      {
        terms_and_conditions,
        notes,
        financial_id,
        entity_id,
        sales_order_id,
      },
      { transaction }
    );

    // const serialData = serialNoList.map((srNo) => ({
    //   dispatched_id: dispatchedData.id,
    //   warehouse_mapping_id: srNo.id,
    // }));
    // await db.reserveSerialNo.bulkCreate(serialData, { transaction });
    // for (const srNo of serialNoList) {
    //   await db.warehouseManagementMapping.update(
    //     { is_dispatched: true },
    //     { where: { id: srNo.id }, transaction }
    //   );

    //   const section = await db.warehousemanagement.findOne({
    //     where: { id: srNo.warehousemanagement_id },
    //     transaction,
    //   });

    //   if (section) {
    //     await db.warehouseBifurcationSection.increment(
    //       { remaining_capacity: 1 },
    //       { where: { id: section.warehouseSection_id }, transaction }
    //     );
    //   }
    // }
    await db.salesOrder.update(
      {
        is_dispatched: true,
        is_proceed_to_dispatched: is_proceed_to_dispatched,
        expected_delivery_date: expected_delivery_date,
        expected_dispatch_date: expected_dispatch_date,
      },
      { where: { id: sales_order_id }, transaction }
    );

    if (isDispatchExceeded && reason) {
      const [soData] = await db.sequelize.query(
        `
    SELECT 
      so.id AS sales_order_id,
      so.sales_order_no,
      so.proposal_id,
      pd.employee_id,
      pd.proposal_no,
      u.employee_official_email AS assigned_employee_email,
      uu.employee_official_email AS created_by_email
    FROM SALES_ORDER_MST AS so
    LEFT JOIN CRM_CREATE_PROPOSAL_MST AS pd 
      ON so.proposal_id = pd.id
    LEFT JOIN HRMS_REGISTERED_USER AS u 
      ON pd.employee_id = u.employee_id
    LEFT JOIN HRMS_REGISTERED_USER AS uu 
      ON pd.created_by_id = uu.employee_id
    WHERE so.id = :sales_order_id
    LIMIT 1
    `,
        {
          replacements: { sales_order_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (soData) {
        const recipientEmail =
          soData.created_by_email || soData.assigned_employee_email;

        if (!recipientEmail) {
          console.warn(
            `⚠️ No valid email found for Sales Order ID ${sales_order_id}`
          );
          return;
        }

        console.log("📦 Dispatch mismatch details:", {
          sales_order_no: soData.sales_order_no,
          proposal_no: soData.proposal_no,
          recipientEmail,
          reason,
        });

        await mail.sendMailForDispatchMismatch(
          entity_id,
          recipientEmail,
          soData,
          reason
        );
      } else {
        console.warn(`⚠️ No Sales Order found for ID ${sales_order_id}`);
      }
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Proceed to dispatched and serial numbers reserved successfully",
      data: dispatchedData,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error during dispatch order:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.viewItemSerialNo = async (req, res) => {
  try {
    let { item_id, warehouse_id, section_id } = req.query;
    let [serialNoData] = await await db.sequelize.query(`
        SELECT WR.row_name,WS.section_name,SF.self_name,WMM.* 
        FROM WAREHOUSE_MANAGEMENT AS WM 
        INNER JOIN
        WAREHOUSE_MANAGEMENT_MAPPING AS WMM 
        on WM.id = WMM.warehousemanagement_id
        INNER JOIN 
        WAREHOUSE_BIFURCATION_Row AS WR 
        ON WM.warehouseRow_id = WR.id
        INNER JOIN 
        WAREHOUSE_BIFURCATION_SECTION AS WS 
        ON 
        WM.warehouseSection_id = WS.id
        INNER JOIN WAREHOUSE_BIFURCATION_SELF AS SF 
        ON 
        WM.warehouseShalf_id = SF.id
        WHERE WM.item_id=${item_id}  AND WM.warehouse_id=${warehouse_id}
`);
    if (serialNoData.length > 0) {
      res.status(200).send({
        code: 200,
        message: "Item serial no list ",
        data: serialNoData,
      });
    } else {
      res.status(200).send({ code: 200, message: "Data not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.proceedToDispatched = async (req, res) => {
  try {
    let id = req.params.id;
    let { is_proceed_to_dispatched } = req.body;
    if (!is_proceed_to_dispatched) {
      return res.status(400).send({ success: false, message: "failed" });
    }
    let isUpdated = await db.salesOrder.update(
      { is_proceed_to_dispatched: true },
      { where: { id: id } }
    );
    if (isUpdated) {
      return res.status(200).send({
        code: 200,
        success: false,
        message: "Successfully proceed to dispatch",
      });
    } else {
      return res.status(400).send({ success: false, message: "failed" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: "Something went wrong", error: err.message });
  }
};


exports.allwarehouseuserlist = async (req, res) => {
  try {
    const { organization_id } = req.user;
    const userDetails = `
      SELECT u.employee_code,
             u.first_name, u.middle_name, u.last_name, u.contact_number, 
             u.employee_id,
             u.country_code, u.employee_official_email, u.status,
             r.role_master_name
      FROM HRMS_REGISTERED_USER AS u
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON u.role_master_id = r.role_master_id
      WHERE u.isDeleted = 0
        ${organization_id ? `AND u.organization_id = ${organization_id}` : 'AND u.organization_id IS NULL'}
      ORDER BY u.first_name ASC;
    `;
    // ${excludedContactPersons.length > 0 ? `AND u.employee_id NOT IN (${excludedContactPersons.join(',')})` : ''}

    const [response] = await db.sequelize.query(userDetails);

    if (response.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Success",
        data: response,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No data found",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
