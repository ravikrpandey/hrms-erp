const db = require("../../../models/index");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getPaymentTermMasterList = async (req, res) => {
  try {
    const { entity_id, status } = req.query;

    const whereCondition = {
      is_Deleted: false,
      // entity_id: entity_id
    };

    if (status && status !== "ALL") {
      whereCondition.status = status;
    }

    const getAllData = await db.customerPaymentTermMaster.findAll({
      where: whereCondition,
    });

    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Data fetched successfully!",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Records not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

module.exports.createUpdate_customerCreditLimit = async (req, res) => {
  try {
    const { customer_id, payment_term_id, effective_from, ...rest } = req.body;

    // Find latest active record for this customer
    const existingRecord = await db.customerCreditLimit.findOne({
      where: { customer_id, status: "ACTIVE" },
      order: [["id", "DESC"]],
    });

    if (!existingRecord) {
      // No record exists, create new
      await db.customerCreditLimit.create({
        customer_id,
        payment_term_id,
        effective_from,
        ...rest,
        status: "ACTIVE",
      });
      return res
        .status(200)
        .send({
          code: 200,
          message: "Customer credit limit has been successfully created",
        });
    } else {
      // Check if payment_term_id or effective_from changed
      if (
        existingRecord.payment_term_id !== payment_term_id ||
        existingRecord.effective_from !== effective_from
      ) {
        // Deactivate old record
        await db.customerCreditLimit.update(
          { status: "INACTIVE" },
          { where: { id: existingRecord.id } },
        );

        // Create new record
        await db.customerCreditLimit.create({
          customer_id,
          payment_term_id,
          effective_from,
          ...rest,
          status: "ACTIVE",
        });
        return res
          .status(200)
          .send({
            code: 200,
            message:
              "Previous record inactivated and new customer credit limit has been successfully created",
          });
      } else {
        // Just update existing record
        await db.customerCreditLimit.update(rest, {
          where: { id: existingRecord.id },
        });
        return res
          .status(200)
          .send({
            code: 200,
            message: "Customer credit limit has been successfully updated",
          });
      }
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.getCreditLimitListByCustomerId = async (req, res) => {
  try {
    const { customer_id, entity_id } = req.query;

    const whereCondition = {
      customer_id: customer_id,
      entity_id: entity_id,
    };

    const getAllData = await db.customerCreditLimit.findAll({
      where: whereCondition,
      order: [
        ["status", "ASC"],
        ["id", "DESC"],
      ],
    });

    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Data fetched successfully!",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Records not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

module.exports.advanceCustomerReciept = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      customer_id,
      current_advance,
      transaction_type,
      advance_amount,
      payment_mode,
      bank_account_id,
      chart_account_id,
      cheque_number,
      entity_id,
      financial_id,
      terms_conditions,
      tab_type,
    } = req.body;

    const Obj = {
      customer_id,
      transaction_type,
      advance_amount,
      payment_mode,
      cheque_number,
      entity_id,
      financial_id,
      terms_conditions,
      tab_type,
    };

    if (current_advance) {
      Obj.current_advance = current_advance;
    }

    if (chart_account_id) {
      Obj.chart_account_id = chart_account_id;
    }
    if (bank_account_id) {
      Obj.bank_account_id = bank_account_id;
    }

    const customerExist = await db.customerProfile.findOne({
      where: { id: customer_id },
      attributes: ["advance_amount"],
      transaction,
    });

    const currentAdvance = parseFloat(customerExist?.advance_amount || 0);
    const changeAmount = parseFloat(advance_amount || 0);

    let updatedAdvance = currentAdvance;

    if (transaction_type === "increase") {
      updatedAdvance += changeAmount;
    }

    if (transaction_type === "reduce") {
      if (changeAmount > currentAdvance) {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: "Advance cannot be reduced below 0",
        });
      }

      updatedAdvance -= changeAmount;
    }

    const paymentChartAccount =
      payment_mode === "cash" ? 147 : chart_account_id;

    const journalData = [
      {
        chart_account_id: paymentChartAccount,
        debit_amount: transaction_type === "increase" ? changeAmount : 0.0,
        credit_amount: transaction_type === "reduce" ? changeAmount : 0.0,
        entity_id,
        entry_status: "Advances Receipt",
        document_number: "Advances Receipt",
        financial_id,
      },
      {
        chart_account_id: 50,
        debit_amount: transaction_type === "reduce" ? changeAmount : 0.0,
        credit_amount: transaction_type === "increase" ? changeAmount : 0.0,
        entity_id,
        entry_status: "Advances Receipt",
        document_number: "Advances Receipt",
        customer_id,
        party_type: "CUSTOMER",
        financial_id,
      },
    ];

    await db.financial_And_Account_Journal_List.bulkCreate(journalData, {
      transaction,
    });

    await db.customerProfile.update(
      {
        advance_amount: updatedAdvance,
      },
      {
        where: { id: customer_id },
        transaction,
      },
    );

    await db.advanceAmountCustomer.create(Obj, { transaction });

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Successfully Created",
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};
module.exports.advanceCustomerRecieptById = async (req, res) => {
  try {
    const { id } = req.query;

    const customerExist = await db.customerProfile.findOne({
      where: { id },
      attributes: ["advance_amount", "id"],
    });

    if (customerExist) {
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: customerExist });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
module.exports.suspenseCustomerAccountById = async (req, res) => {
  try {
    const { id } = req.query;

    const [customerExist] = await db.sequelize.query(`
          SELECT S.*,C.account_name
FROM SUSPENSE_ACCOUNT_CUSTOMER AS S
LEFT JOIN CHART_OF_ACCOUNTS AS C ON C.id = S.chart_account_id
WHERE S.id=${id}`);

    return res
      .status(200)
      .send({ code: 200, message: "Success", data: customerExist[0] });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
module.exports.suspenseCustomerAccountList = async (req, res) => {
  try {
    const { entity_id } = req.query;

    const customerExist = await db.suspenseAccountCustomer.findAll({
      where: { entity_id, payment_status: "PENDING" },
      order: [["id", "DESC"]],
    });

    if (customerExist) {
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: customerExist });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.suspenseCustomerAccount = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      id,
      name,
      advance_amount,
      payment_mode,
      bank_account_id,
      chart_account_id,
      cheque_number,
      entity_id,
      financial_id,
      terms_conditions,
      tab_type,
    } = req.body;

    const Obj = {
      name,
      advance_amount,
      payment_mode,
      cheque_number,
      entity_id,
      financial_id,
      terms_conditions,
      tab_type,
    };

    if (chart_account_id) {
      Obj.chart_account_id = chart_account_id;
    }

    if (bank_account_id) {
      Obj.bank_account_id = bank_account_id;
    }

    let message = "";

    if (id) {
      await db.suspenseAccountCustomer.update(Obj, {
        where: { id },
        transaction,
      });

      message = "Successfully Updated";
    } else {
      await db.suspenseAccountCustomer.create(Obj, { transaction });
      if (payment_mode == "cash") {
        await db.financial_And_Account_Journal_List.bulkCreate(
          [
            {
              chart_account_id: 72,
              debit_amount: 0.0,
              credit_amount: advance_amount,
              entity_id,
              entry_status: "Advances Receipt",
              document_number: "Advances Receipt",
              financial_id,
            },
            {
              chart_account_id: 147,
              debit_amount: advance_amount,
              credit_amount: 0.0,
              entity_id,
              entry_status: "Advances Receipt",
              document_number: "Advances Receipt",
              financial_id,
            },
          ],
          { transaction },
        );
      }
      if (payment_mode == "bank") {
        await db.financial_And_Account_Journal_List.bulkCreate(
          [
            {
              chart_account_id: 72,
              debit_amount: 0.0,
              credit_amount: advance_amount,
              entity_id,
              entry_status: "Advances Receipt",
              document_number: "Advances Receipt",
              financial_id,
            },
            {
              chart_account_id: chart_account_id,
              debit_amount: advance_amount,
              credit_amount: 0.0,
              entity_id,
              entry_status: "Advances Receipt",
              document_number: "Advances Receipt",
              financial_id,
            },
          ],
          { transaction },
        );
      }
      message = "Successfully Created";
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

// vendor aging reports starts here

module.exports.getVendorAgingReport = async (req, res) => {
  try {
    const {
      entity_id,
      vendor_id,
      from_date,
      to_date,
      aging_bucket,
      payment_term_id,
      search_text,
    } = req.query;

    if (!entity_id || isNaN(parseInt(entity_id))) {
      return res.status(400).send({
        code: 400,
        message: "Invalid entity_id",
        data: [],
      });
    }

    // Base query with vendor data
    let sql = `
            WITH vendor_invoice_data AS (
                SELECT 
                    V.id AS vendor_id,
                    V.vendor_name,
                    V.vendor_code,
                    V.gst_in,
                    V.state_id AS vendor_state_id,
                    CPT.term_name AS payment_terms,
                    CPT.credit_days AS payment_credit_days,
                    PO.payment_term_id,
                    GRN.id AS grn_id,
                    GRN.total_amount,
                    GRN.invoiceDate,
                    COALESCE(PPL.paid_amount, 0) AS paid_amount,
                    DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY) AS due_date
                FROM VENDOR_BASIC_DETAILS V
                INNER JOIN PROCUREMENT_PURCHASE_ORDER PO ON PO.vendor_id = V.id AND PO.entity_id = ? AND PO.status = 'ACTIVE' AND PO.isDeleted = 0
                INNER JOIN GRN_MASTER GRN ON GRN.po_Id = PO.id 
                    AND GRN.grnStatus = 'COMPLETED' 
                    AND GRN.status = 'ACTIVE' 
                    AND GRN.isDeleted = 0 
                    AND GRN.invoice_status = 'COMPLETED'
                    AND GRN.invoice_status != 'CANCELLED'
                    AND GRN.invoiceDate IS NOT NULL
                LEFT JOIN CUSTOMER_PAYMENT_TERM_MST CPT ON CPT.id = PO.payment_term_id AND CPT.status = 'ACTIVE' AND CPT.is_Deleted = 0
                LEFT JOIN (
                    SELECT 
                        invoice_id,
                        SUM(paid_amount) AS paid_amount
                    FROM PAYMENT_PROGRAM_LIST
                    WHERE status = 'ACTIVE' AND isDeleted = 0
                    GROUP BY invoice_id
                ) PPL ON PPL.invoice_id = GRN.id
                WHERE V.entity_id = ?
                    AND V.status = 'ACTIVE'
                    AND V.isDeleted = 0
        `;

    let queryParams = [parseInt(entity_id), parseInt(entity_id)];

    if (
      vendor_id &&
      vendor_id !== "null" &&
      vendor_id !== "" &&
      vendor_id !== "undefined" &&
      !isNaN(parseInt(vendor_id))
    ) {
      sql += ` AND V.id = ?`;
      queryParams.push(parseInt(vendor_id));
    }

    if (
      from_date &&
      from_date !== "null" &&
      from_date !== "" &&
      from_date !== "undefined"
    ) {
      sql += ` AND GRN.invoiceDate >= ?`;
      queryParams.push(from_date);
    }
    if (
      to_date &&
      to_date !== "null" &&
      to_date !== "" &&
      to_date !== "undefined"
    ) {
      sql += ` AND GRN.invoiceDate <= ?`;
      queryParams.push(to_date);
    }

    if (
      payment_term_id &&
      payment_term_id !== "null" &&
      payment_term_id !== "" &&
      payment_term_id !== "undefined" &&
      !isNaN(parseInt(payment_term_id))
    ) {
      sql += ` AND PO.payment_term_id = ?`;
      queryParams.push(parseInt(payment_term_id));
    }

    if (
      search_text &&
      search_text !== "null" &&
      search_text !== "" &&
      search_text !== "undefined"
    ) {
      sql += ` AND (V.vendor_name LIKE ? OR V.vendor_code LIKE ? OR V.gst_in LIKE ?)`;
      queryParams.push(`%${search_text}%`);
      queryParams.push(`%${search_text}%`);
      queryParams.push(`%${search_text}%`);
    }

    sql += `)
            SELECT 
                vendor_id,
                vendor_name,
                vendor_code,
                gst_in,
                vendor_state_id,
                MAX(payment_terms) AS payment_terms,
                MAX(payment_credit_days) AS payment_credit_days,
                MAX(payment_term_id) AS payment_term_id,
                COUNT(DISTINCT grn_id) AS total_invoices,
                COALESCE(SUM(total_amount), 0) AS total_invoice_amount,
                COALESCE(SUM(paid_amount), 0) AS total_paid,
                COALESCE(SUM(total_amount) - SUM(paid_amount), 0) AS total_outstanding,
                COALESCE(SUM(CASE 
                    WHEN DATEDIFF(CURDATE(), due_date) <= 0 
                    THEN (total_amount - paid_amount)
                    ELSE 0 
                END), 0) AS current_amount,
                COALESCE(SUM(CASE 
                    WHEN DATEDIFF(CURDATE(), due_date) BETWEEN 1 AND 30 
                    THEN (total_amount - paid_amount)
                    ELSE 0 
                END), 0) AS days_1_30,
                COALESCE(SUM(CASE 
                    WHEN DATEDIFF(CURDATE(), due_date) BETWEEN 31 AND 60 
                    THEN (total_amount - paid_amount)
                    ELSE 0 
                END), 0) AS days_31_60,
                COALESCE(SUM(CASE 
                    WHEN DATEDIFF(CURDATE(), due_date) BETWEEN 61 AND 90 
                    THEN (total_amount - paid_amount)
                    ELSE 0 
                END), 0) AS days_61_90,
                COALESCE(SUM(CASE 
                    WHEN DATEDIFF(CURDATE(), due_date) > 90 
                    THEN (total_amount - paid_amount)
                    ELSE 0 
                END), 0) AS days_over_90,
                MIN(due_date) AS oldest_due_date,
                MAX(due_date) AS newest_due_date
            FROM vendor_invoice_data
            GROUP BY vendor_id, vendor_name, vendor_code, gst_in, vendor_state_id
            ORDER BY vendor_name ASC
        `;

    const [results] = await db.sequelize.query(sql, {
      replacements: queryParams,
    });

    if (results && results.length > 0) {
      let filteredResults = results;

      if (
        aging_bucket &&
        aging_bucket !== "null" &&
        aging_bucket !== "" &&
        aging_bucket !== "undefined" &&
        aging_bucket !== "all"
      ) {
        filteredResults = results.filter((row) => {
          if (parseInt(row.total_invoices) === 0) {
            return false;
          }

          switch (aging_bucket) {
            case "current":
              return parseFloat(row.current_amount) > 0;
            case "1_30":
              return parseFloat(row.days_1_30) > 0;
            case "31_60":
              return parseFloat(row.days_31_60) > 0;
            case "61_90":
              return parseFloat(row.days_61_90) > 0;
            case "over_90":
              return parseFloat(row.days_over_90) > 0;
            default:
              return true;
          }
        });
      } else {
        filteredResults = results.filter(
          (row) => parseInt(row.total_invoices) > 0,
        );
      }

      return res.status(200).send({
        code: 200,
        message: "Success",
        data: filteredResults,
        total_vendors: filteredResults.length,
        total_outstanding: filteredResults.reduce(
          (sum, row) => sum + parseFloat(row.total_outstanding),
          0,
        ),
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "No data found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error in getVendorAgingReport:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.getVendorAgingDetails = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    const { entity_id, from_date, to_date } = req.query;

    if (!entity_id || isNaN(parseInt(entity_id))) {
      return res.status(400).send({
        code: 400,
        message: "Invalid entity_id",
        data: [],
      });
    }

    if (
      !vendor_id ||
      vendor_id === "null" ||
      vendor_id === "" ||
      vendor_id === "undefined" ||
      isNaN(parseInt(vendor_id))
    ) {
      return res.status(400).send({
        code: 400,
        message: "Invalid vendor_id",
        data: [],
      });
    }

    let sql = `
            SELECT 
                GRN.id AS invoice_id,
                GRN.invoiceNo AS invoice_number,
                GRN.invoiceDate AS invoice_date,
                DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY) AS due_date,
                COALESCE(CPT.term_name, '30 Days') AS payment_terms,
                CPT.credit_days AS credit_days,
                GRN.total_amount AS total_amount,
                COALESCE(PPL.paid_amount, 0) AS paid_amount,
                COALESCE(GRN.total_amount - COALESCE(PPL.paid_amount, 0), GRN.total_amount) AS outstanding_amount,
                COALESCE(DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)), 0) AS days_overdue,
                CASE 
                    WHEN COALESCE(DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)), 0) <= 0 THEN 'Current'
                    WHEN COALESCE(DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)), 0) <= 30 THEN '1-30 Days'
                    WHEN COALESCE(DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)), 0) <= 60 THEN '31-60 Days'
                    WHEN COALESCE(DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)), 0) <= 90 THEN '61-90 Days'
                    ELSE 'Over 90 Days'
                END AS aging_bucket,
                CASE 
                    WHEN COALESCE(GRN.total_amount - COALESCE(PPL.paid_amount, 0), GRN.total_amount) = 0 THEN 'Fully Paid'
                    WHEN COALESCE(DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)), 0) > 0 THEN 'Overdue'
                    ELSE 'Pending'
                END AS payment_status
            FROM PROCUREMENT_PURCHASE_ORDER PO
            INNER JOIN VENDOR_BASIC_DETAILS V ON V.id = PO.vendor_id
            LEFT JOIN CUSTOMER_PAYMENT_TERM_MST CPT ON CPT.id = PO.payment_term_id AND CPT.status = 'ACTIVE' AND CPT.is_Deleted = 0
            INNER JOIN GRN_MASTER GRN ON GRN.po_Id = PO.id 
                AND GRN.grnStatus = 'COMPLETED' 
                AND GRN.status = 'ACTIVE' 
                AND GRN.isDeleted = 0
                AND GRN.invoice_status = 'COMPLETED'
                AND GRN.invoice_status != 'CANCELLED'
                AND GRN.invoiceDate IS NOT NULL
            LEFT JOIN (
                SELECT 
                    invoice_id,
                    SUM(paid_amount) AS paid_amount
                FROM PAYMENT_PROGRAM_LIST
                WHERE status = 'ACTIVE' AND isDeleted = 0
                GROUP BY invoice_id
            ) PPL ON PPL.invoice_id = GRN.id
            WHERE PO.entity_id = ?
            AND V.id = ?
            AND PO.status = 'ACTIVE'
            AND PO.isDeleted = 0
        `;

    let queryParams = [parseInt(entity_id), parseInt(vendor_id)];

    if (
      from_date &&
      from_date !== "null" &&
      from_date !== "" &&
      from_date !== "undefined"
    ) {
      sql += ` AND GRN.invoiceDate >= ?`;
      queryParams.push(from_date);
    }
    if (
      to_date &&
      to_date !== "null" &&
      to_date !== "" &&
      to_date !== "undefined"
    ) {
      sql += ` AND GRN.invoiceDate <= ?`;
      queryParams.push(to_date);
    }

    sql += ` GROUP BY GRN.id, GRN.invoiceNo, GRN.invoiceDate, CPT.term_name, CPT.credit_days, GRN.total_amount`;
    sql += ` ORDER BY GRN.invoiceDate DESC`;

    const [results] = await db.sequelize.query(sql, {
      replacements: queryParams,
    });

    if (results && results.length > 0) {
      // Calculate summary statistics
      const summary = {
        total_invoices: results.length,
        total_amount: results.reduce(
          (sum, row) => sum + parseFloat(row.total_amount),
          0,
        ),
        total_paid: results.reduce(
          (sum, row) => sum + parseFloat(row.paid_amount),
          0,
        ),
        total_outstanding: results.reduce(
          (sum, row) => sum + parseFloat(row.outstanding_amount),
          0,
        ),
        overdue_count: results.filter((row) => row.payment_status === "Overdue")
          .length,
        fully_paid_count: results.filter(
          (row) => row.payment_status === "Fully Paid",
        ).length,
        pending_count: results.filter((row) => row.payment_status === "Pending")
          .length,
        aging_summary: {
          current: results.filter((row) => row.aging_bucket === "Current")
            .length,
          days_1_30: results.filter((row) => row.aging_bucket === "1-30 Days")
            .length,
          days_31_60: results.filter((row) => row.aging_bucket === "31-60 Days")
            .length,
          days_61_90: results.filter((row) => row.aging_bucket === "61-90 Days")
            .length,
          over_90: results.filter((row) => row.aging_bucket === "Over 90 Days")
            .length,
        },
      };

      return res.status(200).send({
        code: 200,
        message: "Success",
        data: results,
        summary: summary,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "No details found",
        data: [],
        summary: {
          total_invoices: 0,
          total_amount: 0,
          total_paid: 0,
          total_outstanding: 0,
          overdue_count: 0,
          fully_paid_count: 0,
          pending_count: 0,
          aging_summary: {
            current: 0,
            days_1_30: 0,
            days_31_60: 0,
            days_61_90: 0,
            over_90: 0,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error in getVendorAgingDetails:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.getPaymentTermsList = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (
      !entity_id ||
      entity_id === "null" ||
      entity_id === "" ||
      entity_id === "undefined" ||
      isNaN(parseInt(entity_id))
    ) {
      return res.status(400).send({
        code: 400,
        message: "Invalid entity_id",
        data: [],
      });
    }

    const query = `
            SELECT 
                id,
                term_name,
                credit_days,
                status
            FROM CUSTOMER_PAYMENT_TERM_MST
            WHERE entity_id = ?
            AND status = 'ACTIVE'
            AND is_Deleted = 0
            ORDER BY credit_days ASC
        `;

    const [results] = await db.sequelize.query(query, {
      replacements: [parseInt(entity_id)],
    });

    return res.status(200).send({
      code: 200,
      message: "Success",
      data: results,
    });
  } catch (error) {
    console.error("Error in getPaymentTermsList:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.getVendorAgingSummary = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (
      !entity_id ||
      entity_id === "null" ||
      entity_id === "" ||
      entity_id === "undefined" ||
      isNaN(parseInt(entity_id))
    ) {
      return res.status(400).send({
        code: 400,
        message: "Invalid entity_id",
        data: [],
      });
    }

    const query = `
            SELECT 
                COUNT(DISTINCT V.id) AS total_vendors,
                COALESCE(SUM(GRN.total_amount), 0) AS total_invoice_amount,
                COALESCE(SUM(COALESCE(PPL.paid_amount, 0)), 0) AS total_paid,
                COALESCE(SUM(GRN.total_amount) - SUM(COALESCE(PPL.paid_amount, 0)), 0) AS total_outstanding,
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) <= 0 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS total_current,
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) > 0 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS total_overdue,
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) BETWEEN 1 AND 30 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS total_1_30,
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) BETWEEN 31 AND 60 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS total_31_60,
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) BETWEEN 61 AND 90 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS total_61_90,
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) > 90 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS total_over_90
            FROM PROCUREMENT_PURCHASE_ORDER PO
            INNER JOIN VENDOR_BASIC_DETAILS V ON V.id = PO.vendor_id
            LEFT JOIN CUSTOMER_PAYMENT_TERM_MST CPT ON CPT.id = PO.payment_term_id AND CPT.status = 'ACTIVE' AND CPT.is_Deleted = 0
            INNER JOIN GRN_MASTER GRN ON GRN.po_Id = PO.id AND GRN.grnStatus = 'COMPLETED' AND GRN.status = 'ACTIVE' AND GRN.isDeleted = 0
            LEFT JOIN (
                SELECT 
                    invoice_id,
                    SUM(paid_amount) AS paid_amount
                FROM PAYMENT_PROGRAM_LIST
                WHERE status = 'ACTIVE' AND isDeleted = 0
                GROUP BY invoice_id
            ) PPL ON PPL.invoice_id = GRN.id
            WHERE PO.entity_id = ?
            AND PO.status = 'ACTIVE'
            AND PO.isDeleted = 0
            AND GRN.status = 'ACTIVE'
            AND GRN.isDeleted = 0
            AND V.status = 'ACTIVE'
            AND V.isDeleted = 0
            AND GRN.invoiceDate IS NOT NULL
        `;

    const [results] = await db.sequelize.query(query, {
      replacements: [parseInt(entity_id)],
    });

    return res.status(200).send({
      code: 200,
      message: "Success",
      data: results[0] || {
        total_vendors: 0,
        total_invoice_amount: 0,
        total_paid: 0,
        total_outstanding: 0,
        total_current: 0,
        total_overdue: 0,
        total_1_30: 0,
        total_31_60: 0,
        total_61_90: 0,
        total_over_90: 0,
      },
    });
  } catch (error) {
    console.error("Error in getVendorAgingSummary:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.exportVendorAgingReport = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (
      !entity_id ||
      entity_id === "null" ||
      entity_id === "" ||
      entity_id === "undefined" ||
      isNaN(parseInt(entity_id))
    ) {
      return res.status(400).send({
        code: 400,
        message: "Invalid entity_id",
        data: [],
      });
    }

    const query = `
            SELECT 
                V.vendor_name AS 'Vendor Name',
                V.vendor_code AS 'Vendor Code',
                V.gst_in AS 'GSTIN',
                CPT.term_name AS 'Payment Terms',
                COALESCE(SUM(GRN.total_amount), 0) AS 'Total Invoice Amount',
                COALESCE(SUM(COALESCE(PPL.paid_amount, 0)), 0) AS 'Total Paid',
                COALESCE(SUM(GRN.total_amount) - SUM(COALESCE(PPL.paid_amount, 0)), 0) AS 'Total Outstanding',
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) <= 0 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS 'Current',
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) BETWEEN 1 AND 30 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS '1-30 Days',
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) BETWEEN 31 AND 60 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS '31-60 Days',
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) BETWEEN 61 AND 90 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS '61-90 Days',
                COALESCE(SUM(CASE 
                    WHEN GRN.invoiceDate IS NOT NULL AND DATEDIFF(CURDATE(), DATE_ADD(GRN.invoiceDate, INTERVAL COALESCE(CPT.credit_days, 30) DAY)) > 90 
                    THEN (GRN.total_amount - COALESCE(PPL.paid_amount, 0))
                    ELSE 0 
                END), 0) AS 'Over 90 Days',
                COUNT(DISTINCT GRN.id) AS 'Total Invoices'
            FROM PROCUREMENT_PURCHASE_ORDER PO
            INNER JOIN VENDOR_BASIC_DETAILS V ON V.id = PO.vendor_id
            LEFT JOIN CUSTOMER_PAYMENT_TERM_MST CPT ON CPT.id = PO.payment_term_id AND CPT.status = 'ACTIVE' AND CPT.is_Deleted = 0
            INNER JOIN GRN_MASTER GRN ON GRN.po_Id = PO.id AND GRN.grnStatus = 'COMPLETED' AND GRN.status = 'ACTIVE' AND GRN.isDeleted = 0
            LEFT JOIN (
                SELECT 
                    invoice_id,
                    SUM(paid_amount) AS paid_amount
                FROM PAYMENT_PROGRAM_LIST
                WHERE status = 'ACTIVE' AND isDeleted = 0
                GROUP BY invoice_id
            ) PPL ON PPL.invoice_id = GRN.id
            WHERE PO.entity_id = ?
            AND PO.status = 'ACTIVE'
            AND PO.isDeleted = 0
            AND GRN.status = 'ACTIVE'
            AND GRN.isDeleted = 0
            AND V.status = 'ACTIVE'
            AND V.isDeleted = 0
            AND GRN.invoiceDate IS NOT NULL
            GROUP BY V.id, V.vendor_name, V.vendor_code, V.gst_in, CPT.term_name
            ORDER BY V.vendor_name ASC
        `;

    const [results] = await db.sequelize.query(query, {
      replacements: [parseInt(entity_id)],
    });

    return res.status(200).send({
      code: 200,
      message: "Success",
      data: results,
    });
  } catch (error) {
    console.error("Error in exportVendorAgingReport:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};
module.exports.getCustomerBillingList = async (req, res) => {
  try {
    const { customer_id } = req.query;

    const [results] = await db.sequelize.query(
      `SELECT CA.customer_id,CONCAT_WS(' ', CA.billing_address, M.states_name) AS billing_address,CA.id AS billing_id,C.company_name,CA.billing_state_id AS state_id
 FROM CUSTOMER_PROFILE_MST AS C
INNER JOIN CUSTOMER_ADDRESS_MST AS CA ON CA.customer_id=C.id
INNER JOIN MASTER_STATE AS M ON M.states_id=CA.billing_state_id
WHERE C.id=${customer_id}`,
    );

    return res.status(200).send({
      code: 200,
      message: "Success",
      data: results,
    });
  } catch (error) {
    console.error("Error in exportVendorAgingReport:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.createPaymentTermMaster = async (req, res) => {
  try {
    const { term_name, credit_days, status } = req.body;
    
    const duplicate = await db.customerPaymentTermMaster.findOne({
      where: { term_name, is_Deleted: false }
    });
    
    if (duplicate) {
      return res.status(400).send({ code: 400, message: "Payment Term already exists!" });
    }

    const newData = await db.customerPaymentTermMaster.create({
      term_name,
      credit_days,
      status: status || "ACTIVE"
    });

    return res.status(200).send({
      code: 200,
      message: "Payment Term created successfully!",
      data: newData
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal server error!" });
  }
};

module.exports.updatePaymentTermMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { term_name, credit_days, status } = req.body;

    const record = await db.customerPaymentTermMaster.findOne({
      where: { id, is_Deleted: false }
    });

    if (!record) {
      return res.status(404).send({ code: 404, message: "Record not found!" });
    }

    if (term_name && term_name !== record.term_name) {
      const duplicate = await db.customerPaymentTermMaster.findOne({
        where: { term_name, is_Deleted: false, id: { [Op.ne]: id } }
      });
      if (duplicate) {
        return res.status(400).send({ code: 400, message: "Payment Term already exists!" });
      }
    }

    await db.customerPaymentTermMaster.update(
      { term_name, credit_days, status },
      { where: { id } }
    );

    return res.status(200).send({
      code: 200,
      message: "Payment Term updated successfully!"
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal server error!" });
  }
};

module.exports.deletePaymentTermMaster = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await db.customerPaymentTermMaster.findOne({
      where: { id, is_Deleted: false }
    });

    if (!record) {
      return res.status(404).send({ code: 404, message: "Record not found!" });
    }

    await db.customerPaymentTermMaster.update(
      { is_Deleted: true },
      { where: { id } }
    );

    return res.status(200).send({
      code: 200,
      message: "Payment Term deleted successfully!"
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal server error!" });
  }
};

module.exports.getPaymentTermMasterById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await db.customerPaymentTermMaster.findOne({
      where: { id, is_Deleted: false }
    });

    if (!record) {
      return res.status(404).send({ code: 404, message: "Record not found!" });
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully!",
      data: record
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal server error!" });
  }
};

module.exports.getCustomerAdvanceHistory=async(req,res)=>{
try {
  const {customer_id} = req.query;
  const dataList = await db.advanceAmountCustomer.findAll({where:{customer_id},attributes:['current_advance','advance_amount','payment_mode','cheque_number','createdAt']})
if(dataList.length>0){
  return res.status(200).send({code:200,message:'Success',data:dataList})
}else{
  return res.status(404).send({code:404,message:'Data Not Found!',data:[]})
}
} catch (error) {
  return res.status(500).send({code:500,message:error.message})
}
}