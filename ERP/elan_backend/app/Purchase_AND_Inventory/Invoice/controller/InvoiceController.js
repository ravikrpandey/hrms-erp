const db = require("../../../models/index");
const logger = require("../../../../logger/index");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const pdf = require("html-pdf");
const { Op } = require("sequelize");

exports.get_all_completedGRNInvoice = async (req, res) => {
  try {
    const { financial_year_id, entity_id, employee_id } = req.query;
    const userExist = await db.user.findOne({ where: { employee_id } });
    const userRoleExist = await db.role_master.findOne({
      where: { role_master_id: userExist.role_master_id },
    });
    let condition = "";
    if (userRoleExist.role_master_name == "Super Admin") {
      condition = ` 1=1 `;
    } else {
      condition = ` GM.employee_id=${employee_id}`;
    }
    if (!financial_year_id || !entity_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing query parameters" });
    }
    let baseQuery = `
SELECT * FROM (
    SELECT  GM.shiping_id, GM.id, GM.grn_number, GM.invoiceNo, GM.invoiceDate, G.version,
        GM.payment_status, GM.upload_doc, GM.grnStatus, GM.po_Id, GM.version_id,
        PO.po_category, PO.po_type,
        
        PO_ALL.po_numbers AS po_number,
        VB.vendor_name, W.name AS warehouse_name,
        GM.total_amount, GM.invoice_status, GM.grand_total,
        ROW_NUMBER() OVER (PARTITION BY GM.invoiceNo ORDER BY GM.id DESC) AS rn
    FROM GRN_MASTER AS GM
    INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_Id
    INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PO.vendor_id
    INNER JOIN WAREHOUSE_MASTER AS W ON W.id = PO.warehouse_id
    INNER JOIN GRN_VERSION_MST AS G ON G.id = GM.version_id
    LEFT JOIN (
        SELECT GM.invoiceNo,
            GROUP_CONCAT(DISTINCT PO.po_number) AS po_numbers
        FROM GRN_MASTER AS GM
        INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_Id
        WHERE GM.grnStatus = "COMPLETED"
          AND GM.invoice_status = "COMPLETED"
        GROUP BY GM.invoiceNo
    ) AS PO_ALL ON PO_ALL.invoiceNo = GM.invoiceNo
    WHERE GM.grnStatus = "COMPLETED"
      AND GM.invoice_status = "COMPLETED"
      AND GM.financial_year_id = ${financial_year_id}
      AND GM.entity_id = ${entity_id}
      AND ${condition}
      AND GM.isDeleted = FALSE
      AND GM.status = "ACTIVE"
) AS completed
WHERE completed.rn = 1

UNION ALL

SELECT  GM.shiping_id, GM.id, GM.grn_number, GM.invoiceNo, GM.invoiceDate, G.version,
    GM.payment_status, GM.upload_doc, GM.grnStatus, GM.po_Id, GM.version_id,
    PO.po_category, PO.po_type,
    PO.po_number AS po_number,
    VB.vendor_name, W.name AS warehouse_name,
    GM.total_amount, GM.invoice_status, GM.grand_total,
    NULL AS rn  
FROM GRN_MASTER AS GM
INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_Id
INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PO.vendor_id
INNER JOIN WAREHOUSE_MASTER AS W ON W.id = PO.warehouse_id
INNER JOIN GRN_VERSION_MST AS G ON G.id = GM.version_id
WHERE GM.grnStatus = "COMPLETED"
  AND GM.invoice_status != "COMPLETED"
  AND GM.financial_year_id = ${financial_year_id}
  AND GM.entity_id = ${entity_id}
  AND ${condition}
  AND GM.isDeleted = FALSE
  AND GM.status = "ACTIVE"

ORDER BY id DESC
    `;

    const [getData] = await db.sequelize.query(baseQuery);

    const [itemList] = await db.sequelize.query(
      `SELECT G.id, SUM(GI.receiveQty) AS qty, SUM(GI.amount) AS grn_amount, G.invoiceNo, G.invoice_status
             FROM GRN_MASTER AS G
             INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = G.id
             GROUP BY G.id, G.invoiceNo, G.invoice_status`
    );

    const qtyMap = {};
    const amountMap = {};
    const qtyByIdMap = {};
    itemList.forEach((item) => {
      qtyByIdMap[item.id] = parseFloat(item.qty);
    });
    itemList.forEach((item) => {
      // Sum quantities by invoiceNo
      if (qtyMap[item.invoiceNo]) {
        qtyMap[item.invoiceNo] += parseFloat(item.qty);
      } else {
        qtyMap[item.invoiceNo] = parseFloat(item.qty);
      }

      // Sum amounts by id ONLY if invoice_status is NOT "COMPLETED"
      if (item.invoice_status.toUpperCase() !== "COMPLETED") {
        if (amountMap[item.id]) {
          amountMap[item.id] += parseFloat(item.grn_amount);
        } else {
          amountMap[item.id] = parseFloat(item.grn_amount);
        }
      }
    });

    // Now map the final data properly
    const finalData = getData.map((md) => {
      md.item_quantity = qtyMap[md.invoiceNo] || 0;

      // Set total_amount only if invoice_status is not "COMPLETED", else 0
      if ((md.invoice_status || "").toUpperCase() !== "COMPLETED") {
        md.total_amount = amountMap[md.id] || 0;
        md.item_quantity = qtyByIdMap[md.id] || md.item_quantity;
      } else {
        md.total_amount = md.total_amount;
      }

      return md;
    });

    // const [paymentExist] = await db.sequelize.query(
    //   `SELECT * from SYS_PO_PAYMENT_MST
    //   GROUP BY grn_id ORDER BY grn_id DESC`
    // )

    // const finalList = finalData.map((md)=>{
    //   const matchingItems = paymentExist.find((ud)=>ud.grn_id == md.id)
    //   if(matchingItems){
    //     return {
    //       ...md,
    //       amount_due:matchingItems.amount_due
    //     }
    //   }
    //   return {
    //     ...md,
    //     amount_due:md.total_amount
    //   }
    // })
const finalList = finalData.map((md) => ({
  ...md,
  amount_due: md.total_amount
}));
  
    if (finalData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: finalList,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: finalData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);

    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.getCompleteGRNInvoiceById = async (req, res) => {
  try {
    const { id, version_id } = req.query;

    const [getData] = await db.sequelize.query(`
                     SELECT GM.grn_number, GM.invoiceNo, GM.invoiceDate, GM.id,G.version,GM.payment_status,GM.advance_payment,
                     GM.grnStatus, GM.po_Id, PO.vendor_id, GM.version_id,PO.po_number,VB.vendor_name,W.name AS warehouse_name, GM.total_amount
                     FROM GRN_MASTER AS GM 
                     INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id=GM.po_Id
                     INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id=PO.vendor_id
                     INNER JOIN WAREHOUSE_MASTER AS W ON W.id=PO.warehouse_id
                     INNER JOIN GRN_VERSION_MST AS G ON G.id= GM.version_id
                     WHERE GM.id = ${id} AND GM.version_id = ${version_id}`);
    const [history] = await db.sequelize.query(
      `SELECT S.*,G.total_amount
                     FROM SYS_PO_PAYMENT_MST AS S
                     INNER JOIN GRN_MASTER AS G ON S.grn_id= G.id
                     WHERE S.grn_id = ${id} AND G.version_id = ${version_id} 
                     `
    );

    const Obj = {
      ...getData[0],
      historyBank: history,
    };
    if (getData.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Data Retrieved Successfully", data: Obj });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: getData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
module.exports.createPayment = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      date,
      entity_id,
      cheque_ref_date,
      payment_method,
      cheque_number,
      vendor_id,
      amount_paid,
      upload_document,
      terms,
      remarks,
      bank_id,
      account_number_id,
      grn_id,
    } = req.body;

    const grnExist = await db.grnMaster.findOne({
      where: { id: grn_id },
      transaction,
    });
    const finalTotal =
      parseFloat(grnExist.total_amount) - parseFloat(amount_paid);
    const paymentExist = await db.poPayment.findOne({
      where: { grn_id: grn_id },
      order: [["id", "DESC"]],
      transaction,
    });
    const receipt_no = "IPMT" + Math.floor(100000 + Math.random() * 900000);
    if (!paymentExist) {
      let Obj = {};
      if (parseFloat(grnExist.total_amount) == parseInt(amount_paid)) {
        Obj.payment_status = "PAID";
      } else {
        Obj.payment_status = "PARTIALLY PAID";
      }
      await db.grnMaster.update(Obj, { where: { id: grn_id }, transaction });

      const createPoPayment = await db.poPayment.create(
        {
          date,
          payment_method,
          cheque_number,
          amount_paid,
          amount_due: finalTotal,
          upload_document,
          terms,
          remarks,
          bank_id,
          chart_of_account_id: account_number_id,
          grn_id,
          receipt_no,
        },
        { transaction }
      );

      let typeData;
      if (payment_method == "Cash") {
        typeData = 4;
      } else {
        typeData = account_number_id;
      }

      //

      if (account_number_id) {
        const journal = await db.financial_And_Account_Journal.create({
          journal_book_status: "Other",
          journal_status: "Other",
          journal_no: receipt_no,
          reference: cheque_number,
          reference_date: cheque_ref_date,
          posting_date: date,
          entity_id: entity_id,
        });

        if (journal) {
          await db.financial_And_Account_Journal_List.bulkCreate(
            [
              {
                chart_account_id: 31,
                debit_amount: amount_paid,
                credit_amount: 0.0,
                vendor_id: vendor_id,
                party_type: "VENDOR",
                entity_id: entity_id,
                entry_status: "Payment",
                journal_id: journal?.id,
                document_number: receipt_no,
              },
              {
                chart_account_id: typeData,
                debit_amount: 0.0,
                credit_amount: amount_paid,
                vendor_id: vendor_id,
                party_type: "VENDOR",
                entity_id: entity_id,
                journal_id: journal?.id,
                entry_status: "Payment",
                document_number: receipt_no,
              },
            ],
            { transaction }
          );
        }
      } else {
        await db.financial_And_Account_Journal_List.bulkCreate(
          [
            {
              chart_account_id: 31,
              debit_amount: amount_paid,
              credit_amount: 0.0,
              vendor_id: vendor_id,
              party_type: "VENDOR",
              entity_id: entity_id,
              entry_status: "Payment",
              document_number: receipt_no,
              //   product_id:product_id
            },
            {
              chart_account_id: typeData,
              debit_amount: 0.0,
              credit_amount: amount_paid,
              vendor_id: vendor_id,
              party_type: "VENDOR",
              entity_id: entity_id,
              entry_status: "Payment",
              document_number: receipt_no,
            },
          ],
          { transaction }
        );
      }

      //

      if (createPoPayment) {
        await transaction.commit();
        return res
          .status(200)
          .send({ code: 200, message: "Payment Created Successfully" });
      }
    } else {
      let Obj = {};
      let count = parseFloat(paymentExist.amount_due) - parseFloat(amount_paid);
      if (parseFloat(paymentExist.amount_due) == parseFloat(amount_paid)) {
        Obj.payment_status = "PAID";
      } else {
        Obj.payment_status = "PARTIALLY PAID";
      }
      await db.grnMaster.update(Obj, { where: { id: grn_id }, transaction });

      const createPoPayment = await db.poPayment.create(
        {
          date,
          payment_method,
          cheque_number,
          amount_paid,
          amount_due: count,
          upload_document,
          terms,
          remarks,
          bank_id,
          chart_of_account_id: account_number_id,
          grn_id,
          receipt_no,
        },
        { transaction }
      );

      let typeData;
      if (payment_method == "Cash") {
        typeData = 4;
      } else {
        typeData = account_number_id;
      }

      if (account_number_id) {
        const journal = await db.financial_And_Account_Journal.create({
          journal_book_status: "Other",
          journal_status: "Other",
          journal_no: receipt_no,
          reference_date: cheque_ref_date,
          posting_date: date,
          reference: cheque_number,
          entity_id: entity_id,
        });
        if (journal) {
          await db.financial_And_Account_Journal_List.bulkCreate(
            [
              {
                chart_account_id: 31,
                debit_amount: amount_paid,
                credit_amount: 0.0,
                vendor_id: vendor_id,
                party_type: "VENDOR",
                entity_id: entity_id,
                entry_status: "Payment",
                journal_id: journal?.id,
                document_number: receipt_no,
                //   product_id:product_id
              },
              {
                chart_account_id: typeData,
                debit_amount: 0.0,
                credit_amount: amount_paid,
                journal_id: journal?.id,
                vendor_id: vendor_id,
                party_type: "VENDOR",
                entity_id: entity_id,
                entry_status: "Payment",
                document_number: receipt_no,
              },
            ],
            { transaction }
          );
        }
      } else {
        await db.financial_And_Account_Journal_List.bulkCreate(
          [
            {
              chart_account_id: 31,
              debit_amount: amount_paid,
              credit_amount: 0.0,
              vendor_id: vendor_id,
              party_type: "VENDOR",
              entity_id: entity_id,
              entry_status: "Payment",
              document_number: receipt_no,
              //   product_id:product_id
            },
            {
              chart_account_id: typeData,
              debit_amount: 0.0,
              credit_amount: amount_paid,
              vendor_id: vendor_id,
              party_type: "VENDOR",
              entity_id: entity_id,
              entry_status: "Payment",
              document_number: receipt_no,
            },
          ],
          { transaction }
        );
      }

      if (createPoPayment) {
        await transaction.commit();
        return res
          .status(200)
          .send({ code: 200, message: "Payment Created Successfully" });
      }
    }
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.getDownloadPayments = async (req, res) => {
  try {
    const { po_Id, version_id } = req.query;
    const [valueData] = await db.sequelize.query(
      `SELECT G.grn_number,G.invoiceDate,G.invoiceNo,G.invoiceDoc,G.po_Id,G.id,G.version_id,G.total_amount,P.advance_payment,
            P.po_number,P.po_date,P.vendor_id,V.vendor_name,G.uses_id,SUM(SP.amount_paid) AS paid_amount
            FROM GRN_MASTER AS G
            INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
            INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id=P.vendor_id
            INNER JOIN SYS_PO_PAYMENT_MST AS SP ON SP.grn_id = G.id
            WHERE G.po_Id  =${po_Id} AND G.version_id=${version_id}`
    );
    const [getData] = await db.sequelize.query(
      `SELECT DISTINCT GI.id AS grn_item_id, GI.receiveQty, GI.invoice_qty,GI.amount,GI.total_mvp,PP.tax,PP.discount,
            COALESCE(GI.rejectQty, 0) AS rejectQty, GI.selection_item,GI.po_qty AS quantity,
            GI.invoice_status,I.item_name,I.manage_by,I.item_code,A.asset_category_name,
            GI.grn_Id, GI.item_id, GI.po_item_id, GI.version_id
            FROM GRN_MASTER AS G
            INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
            INNER JOIN MASTER_ITEM AS I ON I.id = GI.item_id
            INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
            INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
            INNER JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS PP ON PP.purchase_order_id=P.id
            WHERE P.id =${po_Id} AND GI.version_id=${version_id}`
    );

    const htmlFilePath = path.resolve(
      __dirname,
      "../../utils/template/invoice-2.html"
    );
    const html = fs.readFileSync(htmlFilePath, "utf-8");
    const htmlWithData = html
      .replace("{getData}", generateGrnTable(getData))
      .replace("{po_no}", valueData[0].po_number)
      .replace("{invoiceNo}", valueData[0].invoiceNo)
      .replace("{invoiceDate}", valueData[0].invoiceDate)
      .replace("{total_amount}", valueData[0].total_amount)
      .replace("{paid_amount}", valueData[0].paid_amount)
      .replace("{grand_amount}", valueData[0].total_amount)
      .replace("{balance}", valueData[0].total_amount)
      .replace("{old_amount}", valueData[0].total_amount)
      .replace(
        "{new_amount}",
        valueData[0].total_amount - valueData[0].paid_amount
      );

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const pdfBuffer = await generatePDF(htmlWithData);

    const dirPath = path.resolve(__dirname, "../../utils/template/InvoicePdf");

    const fileName = `invoice_${valueData[0].invoice_doc_code}.pdf`;
    const pdfPath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(pdfPath, pdfBuffer);

    await page.setContent(htmlWithData);
    await browser.close();

    return res
      .status(200)
      .send({ code: 200, message: " Success", backend_url: pdfPath });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

function generateGrnTable(getData) {
  let tableHTML = "";
  let counter = 1;

  tableHTML += `
      <table>
        <tr style="border-bottom: 2px solid black;  "width": 100%; "border-collapse": collapse; ">
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">S.NO.</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Item Code</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Item Name</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Quantity</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Price Sold</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Discount</th>
          <th style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">Amount</th>
        </tr>`;

  const combinedList = [...getData];

  combinedList.forEach((item) => {
    tableHTML += `
        <tr>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${counter++}</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.item_code || "-"
      }</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.item_name
      }</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.invoice_qty || 0
      }</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.discount || "-"
      }</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.total_mvp || 0
      }</td>
          <td style="border: 1px solid black; padding: 8px;  text-align: center; "border-collapse": collapse;">${item.amount || 0
      }</td>
        </tr>`;
  });

  tableHTML += `</table>`;
  tableHTML += `</div>`;

  return tableHTML;
}

function generatePDF(htmlContent) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlContent).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}
// /////////////////////////////invoice api //////////////////////////

// module.exports.createPOInvoice = async (req, res) => {
//     try {
//         const { type, po_number,invoice_status, invoice_version,invoice_number, purchase_oredr_id, entity_id, financial_year_id } = req.body;

//         const existingInvoice = await db.InvoiceModel.findOne({
//             where: {
//                 po_number: po_number,
//                 invoice_number: invoice_number
//             }
//         });

//         if (existingInvoice) {
//             return res.status(400).send({
//                 code: 400,
//                 message: "Invoice with the same PO number and Invoice number already exists!"
//             });
//         }
//         const response = await db.InvoiceModel.create({
//             entity_id,
//             financial_year_id,
//             type,
//             invoice_number,
//             po_number,
//             purchase_oredr_id,
//             invoice_status,
//             invoice_version
//         });

//         return res.status(200).send({
//             code: 200,
//             message: "Created PO Successfully!",
//             data: response,
//         });

//     } catch (error) {
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Vendor account not found!!"
//         });
//     }
// }

exports.get_all_grnnumberInvoice = async (req, res) => {
  try {
    const { po_number } = req.query;

    const [getData] = await db.sequelize.query(
      `SELECT DISTINCT G.grn_number,G.version_id,G.id,G.po_Id,P.po_type,P.po_number
FROM GRN_MASTER AS G
INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
WHERE G.invoice_status ='PENDING' AND P.po_number = '${po_number}' 
GROUP BY G.id`
    );

    const [itemList] = await db.sequelize.query(
      ` SELECT DISTINCT 
      G.grn_number, G.version_id, G.id, G.po_Id, GI.receiveQty, M.item_name, M.item_code, M.manage_by,
      MA.asset_category_name, GI.amount, GI.total_mvp, HC.hsn_sac_code AS hsnCode, GR.value AS gstRate
FROM GRN_MASTER AS G
INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
INNER JOIN MASTER_ITEM AS M ON M.id=GI.item_id
INNER JOIN MASTER_HSN_SAC_CODE AS HC ON HC.id = M.hsn_code_id
INNER JOIN GST_RATE_MASTER AS GR ON GR.id = HC.gst_rate_id
INNER JOIN MASTER_ASSET AS MA ON MA.id=M.asset_id`
    );

    const valueData = getData
      .map((md) => {
        const matchingItems = itemList.filter((ud) => md.id === ud.id);
        return matchingItems.map((item) => ({
          ...md,
          receiveQty: item.receiveQty,
          item_name: item.item_name,
          item_code: item.item_code,
          manage_by: item.manage_by,
          asset_category_name: item.asset_category_name,
          amount: item.amount,
          total_mvp: item.total_mvp,
          hsnCode: item.hsnCode,
          gstRate: item.gstRate,
        }));
      })
      .flat();

    if (getData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: getData,
        itemList: valueData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: getData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// module.exports.createPOInvoice = async (req, res) => {
//     try {
//         const {
//             invoice_version,
//             type,
//             purchase_oredr_id,
//             chargesDetailList,
//         } = req.body;

//         if (type == 'InDirect') {
//              await Promise.all(invoice_version.map(async (i) => {
//             const { version_id } = i
//             await db.grnMaster.update({ invoice_status: 'COMPLETED' }, { where: { version_id: version_id, po_Id: purchase_oredr_id } })
//             }))
//             const grnRecords = await db.grnMaster.findAll({
//                 where: {
//                     version_id: invoice_version,
//                     po_Id: purchase_oredr_id
//                 }
//             });

//             await Promise.all(grnRecords.map(async (grn) => {
//                 await Promise.all(chargesDetailList.map(async (charges) => {
//                     return db.poPaymentAddtion.create({
//                         additional_charges_name: charges.additional_charges_name,
//                         description: charges.description,
//                         hsn_code_id: charges.hsn_code_id,
//                         amount: charges.amount,
//                         tax_rate: charges.tax_rate,
//                         grn_master_id: grn.id,
//                         version_id: grn.version_id,
//                         po_id:grn.po_Id

//                     });
//                 }));
//             }));
//         } else {
//             await db.grnMaster.update({ invoice_status: 'COMPLETED' }, { where: { version_id: invoice_version, po_Id: purchase_oredr_id } })

//             const grn = await db.grnMaster.findOne({
//                 where: {
//                     version_id: invoice_version,
//                     po_Id: purchase_oredr_id
//                 }
//             });

//             await Promise.all(chargesDetailList.map(async (charges) => {
//                 return db.poPaymentAddtion.create({
//                     additional_charges_name: charges.additional_charges_name,
//                     description: charges.description,
//                     hsn_code_id: charges.hsn_code_id,
//                     amount: charges.amount,
//                     tax_rate: charges.tax_rate,
//                     grn_master_id: grn?.id || null,
//                     version_id:  grn.version_id,
//                     po_id:grn.po_Id
//                 });
//             }));
//         }
//         return res.status(200).send({
//             code: 200, message: "Created PO Invoices Successfully!",
//         });

//     } catch (error) {
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Vendor account not found!!"
//         });
//     }
// };

module.exports.createPOInvoice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {

    const {
      invoice_version,
      type,entity_id,
      purchase_oredr_id,
      shippingCharge,
      chargesDetailList,
      invoice_number,total_gst_amount,
      financial_year_id,
      vendor_id,tds_id,nature_id,tds_rate,
      tds_rate_amount,
      grand_total,
        total_without_advance,
        original_advance_amount,
        advance_amount,
        advance_utilization_percent,
        calculated_advance_amount,
        advance_adjustment_amount,
        advance_adjustment_type,
        adjusted_total,
        total_invoice_amount,
        items_total,
        items_gst_total,
        charges_total,
        tds_amount,
        shiping_id,
        amount_after_tds,
    rcm_amount,
   total_charges_amount, adjusted_advance_amount, net_payable_amount, igst, cgst, sgst

    } = req.body;

let grn_cgst,grn_sgst,grn_igst

    if (type == "InDirect") {

      const versionIds = invoice_version.map((i) => i.version_id);

      await db.grnMaster.update(
        {
          invoice_status: "COMPLETED",
          grand_total: adjusted_total,
          invoiceNo: invoice_number,
        },
        {
          where: {
            version_id: versionIds,
            po_Id: purchase_oredr_id
          }
        },transaction
      );

      const grnRecords = await db.grnMaster.findAll({
        where: {
          version_id: versionIds,
          po_Id: purchase_oredr_id,
        },transaction
      });

      await Promise.all(
        grnRecords.map(async (grn) => {

          await Promise.all(
            chargesDetailList.map(async (charges) => {

              return db.poPaymentAddtion.create({
                additional_charges_name:
                  charges.additional_charges_name,

                description: charges.description,

                hsn_code_id: charges.hsn_code_id,

                amount: charges.amount,

                tax_rate: charges.tax_rate,

                grn_master_id: grn.id,

                version_id: grn.version_id,

                po_id: grn.po_Id,

                vendor_id: grn.vendor_id
              },{transaction});
         
            })
          );

        })
      );
      await db.financial_And_Account_Journal_List.create({
        chart_account_id:51,
          financial_id:financial_year_id,
        debit_amount: 0.00,
        credit_amount: parseFloat(adjusted_total),
        entry_status: 'PO Invoice Vendor',
        entity_id: req.body.entity_id,
        vendor_id: vendor_id,
        party_type:'VENDOR',
      },{transaction});
      await db.financial_And_Account_Journal_List.create({
        chart_account_id:393,
          financial_id:financial_year_id,
        debit_amount: adjusted_total,
        credit_amount: 0.00,
         vendor_id: vendor_id,
        entry_status: 'PO Invoice Vendor',
        entity_id: req.body.entity_id,
      },{transaction});

    }

    let total_amount=0 ;
    const entityExist = await db.entityMaster.findOne({where:{id:entity_id},transaction})
    const vendorExist = await db.vendorShippingAddress.findOne({where:{vendor_id},transaction})
    const grn = await db.grnMaster.findOne({where: {version_id: invoice_version,po_Id: purchase_oredr_id},transaction});
    const total_amount_value = shippingCharge.reduce(
      (total, row) => total + parseFloat(row.value || 0),
      0
    );
   
    const vendorExistDetails = await db.vendor_basic_details.findOne({where:{id:vendor_id},attributes:['id','rcm_charge'],transaction})
    if(vendorExistDetails.rcm_charge){
      total_amount = (parseFloat(grand_total) + parseFloat(total_amount_value))-parseFloat(tds_rate_amount)
      if(entityExist?.state_id == vendorExist?.billing_state_id){
        grn_igst=items_gst_total
        await db.financial_And_Account_Journal_List.bulkCreate([
          {
          chart_account_id:403,
            financial_id:financial_year_id,
          debit_amount: items_gst_total,
          credit_amount: 0.00,
          entry_status: 'Purchase Invoice',
          entity_id: req.body.entity_id,
           vendor_id: vendor_id,
          document_number:invoice_number
        },
       {
          chart_account_id:400,
            financial_id:financial_year_id,
          debit_amount: 0.00,
          credit_amount: items_gst_total,
          entry_status: 'Purchase Invoice',
          entity_id: req.body.entity_id,
           vendor_id: vendor_id,
          document_number:invoice_number
        } ], { transaction });
      }else{
        grn_cgst=items_gst_total/2
        grn_sgst=items_gst_total/2
        await db.financial_And_Account_Journal_List.bulkCreate([
          {
            chart_account_id: 404,
            financial_id: financial_year_id,
            debit_amount: items_gst_total / 2,
            credit_amount: 0.00,
            entry_status: 'Purchase Invoice',
             vendor_id: vendor_id,
            entity_id: req.body.entity_id,
            document_number: invoice_number
          },
          {
            chart_account_id: 405,
            financial_id: financial_year_id,
            debit_amount: items_gst_total / 2,
            credit_amount: 0.00,
            entry_status: 'Purchase Invoice',
             vendor_id: vendor_id,
            entity_id: req.body.entity_id,
            document_number: invoice_number
          },
          {
            chart_account_id: 401,
            financial_id: financial_year_id,
            debit_amount: 0.00,
            credit_amount: items_gst_total / 2,
            entry_status: 'Purchase Invoice',
             vendor_id: vendor_id,
            entity_id: req.body.entity_id,
            document_number:invoice_number
          },
          {
            chart_account_id: 402,
            financial_id: financial_year_id,
            debit_amount: 0.00,
            credit_amount: items_gst_total / 2,
            entry_status: 'Purchase Invoice',
             vendor_id: vendor_id,
            entity_id: req.body.entity_id,
            document_number:invoice_number
          }
        ], { transaction });
       
      }
    }else{
      total_amount = ((parseFloat(grand_total) + parseFloat(total_amount_value))-parseFloat(tds_rate_amount)) + parseFloat(total_gst_amount)
      if(entityExist?.state_id == vendorExist?.billing_state_id){
        grn_igst=items_gst_total
        await db.financial_And_Account_Journal_List.create({
          chart_account_id:29,
            financial_id:financial_year_id,
          debit_amount: items_gst_total,
          credit_amount: 0.00,
          entry_status: 'Purchase Invoice',
          entity_id: req.body.entity_id,
          vendor_id: vendor_id,
          document_number:invoice_number
        },{transaction});
      }else{
        grn_cgst=items_gst_total/2
        grn_sgst=items_gst_total/2
        await db.financial_And_Account_Journal_List.create({
          chart_account_id:21,
            financial_id:financial_year_id,
          debit_amount: items_gst_total/2,
          credit_amount: 0.00,
          entry_status: 'Purchase Invoice',
          entity_id: req.body.entity_id,
          document_number:invoice_number,
          vendor_id: vendor_id,
        },{transaction});
        await db.financial_And_Account_Journal_List.create({
          chart_account_id:41,
            financial_id:financial_year_id,
          debit_amount: items_gst_total/2,
          credit_amount: 0.00,
          entry_status: 'Purchase Invoice',
          entity_id: req.body.entity_id,
          document_number:invoice_number,
          vendor_id: vendor_id,
        },{transaction});
       
      }
    }


if (parseFloat(advance_adjustment_amount) > 0) {
  
      await db.financial_And_Account_Journal_List.create({
        chart_account_id: 51,
        financial_id: financial_year_id,
        debit_amount: parseFloat(advance_adjustment_amount),
        credit_amount: 0.00,
        entry_status: 'Advance Adjustment',
        entity_id: req.body.entity_id,
        vendor_id: vendor_id,
        party_type: 'VENDOR',
        document_number: invoice_number,
        reference_id: grn?.id || null
      }, { transaction });

   
      await db.financial_And_Account_Journal_List.create({
        chart_account_id: 370,
        financial_id: financial_year_id,
        debit_amount: 0.00,
        credit_amount: parseFloat(advance_adjustment_amount),
        entry_status: 'Advance Adjustment',
        entity_id: req.body.entity_id,
        vendor_id: vendor_id,
        party_type: 'VENDOR',
        document_number: invoice_number,
        reference_id: grn?.id || null
      }, { transaction });

    }
  
    if (tds_amount > 0 ) {

        await db.financial_And_Account_Journal_List.create({
          chart_account_id:45,
          debit_amount: 0.00,
          financial_id:financial_year_id,
          credit_amount: tds_amount,
          document_number:invoice_number,
          entry_status: 'TDS Payable',
           vendor_id: vendor_id,
          entity_id: req.body.entity_id,
          reference_id: grn?.id || null
        },{transaction});

    }

      await Promise.all(
        shippingCharge.map(async (charge) => {

         await db.pochargesDetailsList.create({
        po_id:grn.po_Id,
        vendor_id:charge.vendor_id,
        chart_account_id:charge.coa_id,
        shiping_id:shiping_id
       })
          
          await db.financial_And_Account_Journal_List.create({
            chart_account_id: charge.coa_id,
            debit_amount: charge.value,
            financial_id:financial_year_id,
            credit_amount: 0.00,
            entry_status: 'Purchase Invoice',
            entity_id: req.body.entity_id,
            document_number:invoice_number
          },{transaction});
          await db.financial_And_Account_Journal_List.create({
            chart_account_id: charge.coa_id,
            credit_amount: charge.value,
            financial_id:financial_year_id,
            debit_amount: 0.00,
            entry_status: 'Purchase Invoice',
            entity_id: req.body.entity_id,
            party_type:'VENDOR',
            vendor_id: charge.vendor_id ,
            document_number:invoice_number
          },{transaction});

        })

      ); 
     
      await db.financial_And_Account_Journal_List.create({
        chart_account_id:51,
          financial_id:financial_year_id,
        debit_amount: 0.00,
        credit_amount: adjusted_total,
        entry_status: 'Purchase Invoice',
        entity_id: req.body.entity_id,
        vendor_id: vendor_id,
        party_type:'VENDOR',
        document_number:invoice_number
      },{transaction});
      await db.financial_And_Account_Journal_List.create({
        chart_account_id:393,
          financial_id:financial_year_id,
        debit_amount: parseFloat(adjusted_total), 
        credit_amount: 0.00,
        entry_status: 'Purchase Invoice',
        entity_id: req.body.entity_id,
        document_number:invoice_number
      },{transaction});
    
  
        const createData = await db.paymentProgram.create({
          amount: adjusted_total,
          reference_number: invoice_number,
          document_type: 'Purchase Invoice',
          entity_id,
          document_number: invoice_number,
          payment_status: 'Purchase Invoice' 
        }, { transaction });
      
        await db.paymentProgramList.create({
          vendor_id,
          po_id: purchase_oredr_id,
          amount_due: parseFloat(adjusted_total),
          paid_amount: 0,
          total_amount: parseFloat(adjusted_total),
          tds_id,nature_id,tds_rate_amount:tds_rate_amount,current_rate:tds_rate,
          payment_program_id: createData.id,
          invoice_id: grn.id,
          PO_invoice_id:grn.id,
          adjustment_type:advance_adjustment_type,
          adjusted_amount:advance_adjustment_amount,
          calculated_amount:calculated_advance_amount,
        }, { transaction });

        await db.grnMaster.update({invoice_status: "COMPLETED",total_amount:(parseFloat(adjusted_total)),grand_total:(parseFloat(adjusted_total)),
          tds_amount, total_gst_amount, total_charges_amount, adjusted_advance_amount, net_payable_amount, amount_after_tds, igst:grn_igst, cgst:grn_cgst, sgst:grn_sgst,invoiceNo: invoice_number},
          {where: {version_id: invoice_version,po_Id: purchase_oredr_id},transaction});

          const dataList = await db.grnItem.findAll({
            where: {grn_Id: grn.id, version_id: invoice_version },
            attributes: ['id','selection_item', 'amount','total_mvp', 'item_id'],
            raw: true
          });
          
          const charges = Number(charges_total || 0);
          
          const totalQty = dataList.reduce(
            (sum, item) => sum + Number(item.selection_item || 0),
            0
          );
          
          if (totalQty > 0 && charges > 0) {
          
            for (const item of dataList) {
              const qty = Number(item.selection_item || 0);
              const amount = Number(item.amount || 0);
              const totalMvp = Number(item.total_mvp || 0);
              const itemCharge = (qty / totalQty) * charges;
              const newAmount = amount + itemCharge;
              const newTotalMvp = totalMvp + itemCharge;
              await db.grnItem.update(
                {
                  amount: newAmount.toFixed(2),
                  total_mvp: newTotalMvp.toFixed(2)
                },
                {
                  where: {
                    id: item.id,grn_Id: grn.id, version_id: invoice_version
                  }
                }
              );
            }
          }
    await transaction.commit()
    return res.status(200).send({
      code: 200,
      message: "Created PO Invoices Successfully!",
    });

  } catch (error) {
    await transaction.rollback()
    return res.status(500).send({
      code: 500,
      message: error.message || "Something went wrong!",
    });

  }
};

module.exports.getAllInvoiceList = async (req, res) => {
  try {
    const { financial_year_id, entity_id, employee_id } = req.query;
    const userExist = await db.user.findOne({ where: { employee_id } });
    const userRoleExist = await db.role_master.findOne({
      where: { role_master_id: userExist.role_master_id },
    });
    let condition = "";
    if (userRoleExist.role_master_name == "Super Admin") {
      condition = ` 1=1 `;
    } else {
      condition = ` GM.employee_id=${employee_id}`;
    }
    if (!financial_year_id || !entity_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing query parameters" });
    }

    // const [getData] = await db.sequelize.query(`
    //         SELECT DISTINCT GM.id,GM.grn_number, GM.invoiceNo, GM.invoiceDate, GM.id AS grn_id,G.version,GM.payment_status,GM.upload_doc,
    //         GM.grnStatus, GM.po_Id,  GM.version_id,PO.po_number,VB.vendor_name,B.branch_name, GM.total_amount,PO.po_type
    //         FROM GRN_MASTER AS GM
    //         INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id=GM.po_Id
    //         INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id=PO.vendor_id
    //         INNER JOIN MASTER_BRANCH AS B ON B.id=PO.location_id
    //         INNER JOIN GRN_VERSION_MST AS G ON G.id= GM.version_id
    //         WHERE GM.grnStatus="COMPLETED" AND GM.financial_year_id=${financial_year_id} AND GM.entity_id=${entity_id}
    //         AND ${condition} AND GM.isDeleted=FALSE AND GM.status="ACTIVE" AND GM.invoice_status ='COMPLETED' ORDER BY GM.id DESC`,
    // )
    let baseQuery = `
        SELECT * FROM (
        SELECT GM.id, GM.grn_number, GM.invoiceNo, GM.invoiceDate, G.version,
        GM.payment_status, GM.upload_doc, GM.grnStatus, GM.po_Id, GM.version_id,
        PO.po_category,PO.po_type,
        PO_ALL.po_numbers AS po_number,  
        VB.vendor_name, B.branch_name,
        GM.total_amount, GM.invoice_status, GM.grand_total,
        ROW_NUMBER() OVER (PARTITION BY GM.invoiceNo ORDER BY GM.id DESC) AS rn
        FROM GRN_MASTER AS GM
        INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_Id
        INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PO.vendor_id
        INNER JOIN MASTER_BRANCH AS B ON B.id = PO.location_id
        INNER JOIN GRN_VERSION_MST AS G ON G.id = GM.version_id
        INNER JOIN (
        SELECT GM.invoiceNo,
        GROUP_CONCAT(DISTINCT PO.po_number) AS po_numbers
        FROM GRN_MASTER AS GM
        INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_Id
        WHERE GM.grnStatus = "COMPLETED"
        GROUP BY GM.invoiceNo
        ) AS PO_ALL ON PO_ALL.invoiceNo = GM.invoiceNo

      WHERE GM.grnStatus = "COMPLETED"
      AND GM.financial_year_id = ${financial_year_id}
      AND GM.entity_id = ${entity_id}
      AND ${condition}
      AND GM.isDeleted = FALSE
      AND GM.status = "ACTIVE"

       GROUP BY GM.id, GM.grn_number, GM.invoiceNo, GM.invoiceDate, G.version,
    GM.payment_status, GM.upload_doc, GM.grnStatus, GM.po_Id, GM.version_id,
    PO.po_category, PO_ALL.po_numbers, VB.vendor_name, B.branch_name,
    GM.total_amount, GM.invoice_status, GM.grand_total
    ) AS sub
    WHERE sub.rn = 1
    ORDER BY sub.id DESC`;
    const [getData] = await db.sequelize.query(baseQuery);

    const [itemList] = await db.sequelize.query(
      `SELECT G.id,SUM(GI.receiveQty) AS qty,G.invoiceNo
              FROM GRN_MASTER AS G
              INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
              GROUP BY G.id`
    );

    const qtyMap = {};
    itemList.forEach((item) => {
      if (qtyMap[item.invoiceNo]) {
        qtyMap[item.invoiceNo] += parseFloat(item.qty);
      } else {
        qtyMap[item.invoiceNo] = parseFloat(item.qty);
      }
    });

    const finalData = getData.map((md) => {
      md.item_quantity = qtyMap[md.invoiceNo] || 0;
      return md;
    });

    if (finalData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: finalData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: finalData });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.allExistingPo = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const [existingPo] = await db.sequelize.query(
      `SELECT DISTINCT G.po_Id ,P.po_number
             FROM GRN_MASTER AS G
             INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
             WHERE G.invoice_status ='PENDING' AND G.entity_id=${entity_id}`
    );
    if (existingPo) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: existingPo });
    } else {
      return res.status(404).send({ code: 404, message: "Data Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// module.exports.getCompleteGRNInvoice = async (req, res) => {
//     try {
//         const { vendor_id, version_id, po_id } = req.query;

//         const grnData = await db.grnMaster.findAll({
//             where: { vendor_id: vendor_id, version_id: version_id, po_Id: po_id },
//             include: [
//                 {
//                     model: db.purchase_order,
//                     include: [
//                         {
//                             model: db.purchase_order_item
//                         }
//                     ]
//                 },
//                 {
//                     model: db.poPaymentAddtion,
//                 },
//             ]
//         });
//         const grnMap = {};

//         grnData.forEach(item => {
//             const grn = item.grnnumber;
//             if (!grnMap[grn]) {
//                 grnMap[grn] = [];
//             }
//             grnMap[grn].push(item.po_Id);
//         });

//         // Filter only duplicate grnnumber entries
//         const result = [];

//         Object.entries(grnMap).forEach(([grn, po_ids]) => {
//             if (po_ids.length > 1) {
//                 result.push({
//                     grnnumber: grn,
//                     po_ids: [...new Set(po_ids.map(id => parseInt(id)))],
//                 });
//             }
//         });

//         if (grnData.length > 0) {
//             return res.status(200).send({ code: 200, message: "Data Retrieved Successfully", data: grnData });
//         } else {
//             return res.status(200).send({ code: 404, message: "Record Not Found", });
//         }
//     } catch (error) {
//         logger.error(`Error ${error.message}`, { error });
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// }

module.exports.getCompleteGRNInvoice = async (req, res) => {
  try {
    const { vendor_id, po_id } = req.query;

    let poIdArray = [];

    if (Array.isArray(po_id)) {
      poIdArray = po_id.map((id) => parseInt(id));
    } else if (typeof po_id === "string") {
      poIdArray = po_id.split(",").map((id) => parseInt(id));
    } else if (typeof po_id === "number") {
      poIdArray = [po_id];
    }

    const grnData = await db.grnMaster.findAll({
      where: {
        vendor_id: vendor_id,
        po_Id: poIdArray,
      },
      include: [
        {
          model: db.purchase_order,
          include: [{ model: db.purchase_order_item }],
        },
        {
          model: db.poPaymentAddtion,
        },
      ],
    });

    const grnMap = {};
    grnData.forEach((item) => {
      const grn = item.grn_number;
      if (!grnMap[grn]) {
        grnMap[grn] = [];
      }
      grnMap[grn].push(item.po_Id);
    });

    const duplicateGRNs = {};
    Object.entries(grnMap).forEach(([grn, po_ids]) => {
      if (po_ids.length > 1) {
        duplicateGRNs[grn] = [...new Set(po_ids.map((id) => parseInt(id)))];
      }
    });

    const updatedGRNData = grnData
      .map((item) => {
        const grn = item.grn_number;
        if (duplicateGRNs[grn]) {
          return {
            ...item.toJSON(),
            po_Id: duplicateGRNs[grn],
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    if (updatedGRNData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Filtered GRN Data Retrieved Successfully",
        data: updatedGRNData,
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "No Duplicate GRNs Found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

module.exports.getvendorwithdatepo = async (req, res) => {
  try {
    const { vendor_id, grnNumber } = req.query;

    const grnData = await db.grnMaster.findAll({
      where: {
        vendor_id: vendor_id,
        grn_number: grnNumber,
      },
      include: [
        {
          model: db.grnItem,
          attributes: ["receiveQty", "total_mvp", "po_qty", "amount"],
        },
        {
          model: db.purchase_order,
          attributes: ["id", "po_number", "po_date"],
          include: [
            {
              model: db.purchase_order_item,
              attributes: ["quantity"],
              include: [
                {
                  model: db.ItemMaster,
                  attributes: ["id", "item_name", "manage_by", "item_code"],
                  include: [
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
            },
          ],
        },
      ],
    });

    if (grnData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Filtered GRN Data Retrieved Successfully",
        data: grnData,
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "No GRNs Found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

module.exports.getvendorwithdatepolist = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    const polist = await db.grnMaster.findAll({
      where: {
        vendor_id,
        invoice_status: "PENDING",
      },
      attributes: ["po_Id", "grn_number"],
      include: [
        {
          model: db.purchase_order,
          attributes: ["po_number"],
        },
      ],
    });

    // Group by grn_number
    const grnMap = {};

    polist.forEach((item) => {
      const grn = item.grn_number;
      if (!grnMap[grn]) {
        grnMap[grn] = {
          grn_number: grn,
          po_ids: [],
          po_numbers: [],
        };
      }
      grnMap[grn].po_ids.push(item.po_Id);
      grnMap[grn].po_numbers.push(
        item.PROCUREMENT_PURCHASE_ORDER?.po_number || null
      );
    });

    const result = Object.values(grnMap).map((group) => ({
      grn_number: group.grn_number,
      po_numbers: group.po_numbers,
      po_ids: group.po_ids,
      label: `${group.grn_number} [${group.po_numbers.join(", ")}]`,
    }));
    if (result.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Filtered GRN Data Retrieved Successfully",
        data: result,
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "No GRNs Found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

module.exports.createmultipleposingalInvoice = async (req, res) => {
  try {
    let { vendor_id, grn_number, chargesDetailList, grand_total, invoice_no } = req.body;

    await db.grnMaster.update(
      { invoice_status: "COMPLETED", grand_total: grand_total, invoiceNo: invoice_no },
      { where: { vendor_id: vendor_id, grn_number: grn_number } }
    );

    const grns = await db.grnMaster.findAll({
      where: {
        vendor_id: vendor_id,
        grn_number: grn_number,
      },
    });

    for (const grn of grns) {
      await Promise.all(
        chargesDetailList.map(async (charges) => {
          return db.poPaymentAddtion.create({
            additional_charges_name: charges.additional_charges_name,
            description: charges.description,
            hsn_code_id: charges.hsn_code_id,
            amount: charges.amount,
            tax_rate: charges.tax_rate,
            grn_master_id: grn.id,
            vendor_id: vendor_id,
            po_id: grn.po_Id,
            version_id: grn.version_id,
          });
        })
      );
    }

    return res.status(200).send({
      code: 200,
      message: "Created PO Invoices Successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};




module.exports.getPOAdvanceUtilization = async (req, res) => {
  try {
    const { poId } = req.query;

    const query = `
      SELECT 
        VBD.advance_amount AS total_advance,
        COALESCE(SUM(PPL.adjusted_amount), 0) AS advance_used,
        PPL.calculated_amount - COALESCE(SUM(PPL.adjusted_amount), 0) AS remaining_advance
      FROM PROCUREMENT_PURCHASE_ORDER PPO
      LEFT JOIN GRN_MASTER GM ON PPO.id = GM.po_Id 
          AND GM.invoice_status = 'COMPLETED' 
          AND GM.grnStatus = 'COMPLETED'
      LEFT JOIN PAYMENT_PROGRAM_LIST PPL ON GM.id = PPL.PO_invoice_id 
          AND PPL.vendor_id = PPO.vendor_id
          AND PPL.adjusted_amount > 0
          LEFT JOIN VENDOR_BASIC_DETAILS AS VBD ON PPO.vendor_id = VBD.id
      WHERE PPO.id = ?
      GROUP BY PPO.id, VBD.advance_amount;
    `;

    const [results] = await db.sequelize.query(query, {
      replacements: [poId],
      type: db.sequelize.QueryTypes.SELECT
    });

    if (!results) {
      return res.status(404).send({
        code: 404,
        success: false,
        message: 'Purchase Order not found'
      });
    }

    return res.status(200).send({
      code: 200,
      success: true,
      data: {
        total_advance: parseFloat(results.total_advance || 0),
        advance_used: parseFloat(results.advance_used || 0),
        remaining_advance: parseFloat(results.remaining_advance || 0)
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send({
      code: 500,
      success: false,
      message: error.message || 'Something went wrong!'
    });
  }
};



