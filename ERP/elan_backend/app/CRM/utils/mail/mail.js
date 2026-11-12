const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const writtenNumber = require("written-number");
const numberToWordsIndian = require("../mail/writtenNumber");
const dotenv = require("dotenv");
dotenv.config();
const db = require("../../../models/index");
const express = require("express");
const app = express();
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const pdfDir = path.join(__dirname, "../pdfs"); // Update as needed
const dayjs = require("dayjs");
// const { getLatestBankDataByEntityId } = require("../../CreateProposal/controllers/grossDiscountController");
const numberToWords = require("number-to-words");

const getTransporterBy_EntityId = async (entityId) => {
  const entityConfig = await db.entityMaster.findByPk(entityId);
  if (!entityConfig) {
    throw new Error(`Entity not found with ID ${entityId}`);
  }
  const transporter = nodemailer.createTransport({
    host: entityConfig.smtp_server_address,
    SSL: true,
    port: entityConfig.smtp_port_number,
    requireTLS: true,
    auth: {
      user: entityConfig.smtp_username,
      pass: entityConfig.smtp_password,
    },
    logger: true,
    debug: process.env.SMTP_DEBUG || false,
    tls: {
      rejectUnauthorized: false,
    },
  });
  return {
    transporter,
    fromEmail: entityConfig.smtp_username,
    entity_name: entityConfig.entity_name,
  };
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "hr@kiranautomation.com",
    pass: process.env.SMTP_PASS || "",
  },
});

const send = (mailOptions, otp) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response, otp);
    }
  });
};

const welcomeProposal = async (name) => {
  let mail_id = name;
  const mailOptions = {
    to: mail_id,
    subject: "Proposal Created",
    text: "Your proposal has been created successfully.",
  };
  let response = await send(mailOptions, mail_id);
  return response;
};

module.exports.sendMail = async (name) => {
  return welcomeProposal(name);
};

module.exports.generateInvoicePdf = async (
  data,
  proposalData,
  proposal_id,
  version_id,
  page_mode,
  versionCurrency
) => {
  try {
    let bankDetails = require("../../CreateProposal/controllers/createProposalController");
    let {
      proposal_no,
      proposal_type_id,
      entity_id,
      discount,
      igst,
      grant_total,
      totalAMTAfterDiscount,
      productDetailList = [],
      company_logo = "",
      allowances = "",
      reimbursements = "",
      gstTotal,
      //currency_symbol,
    } = data;
    const currency_symbol = versionCurrency?.MASTER_CURRENCY_CONVERT?.symbols;
    // let paymentRows = "<tr>";
    // for (const pay of data.paymentData) {
    //   if (pay.id == 4) {
    //     paymentRows += `<td>${pay.payment_name}: ${parseInt(
    //       pay.payment_value
    //     )}</td>`;
    //   } else {
    //     paymentRows += `<td>${pay.payment_name}: ${currency_symbol}${pay.payment_value}</td>`;
    //   }
    // }
    // paymentRows += "</tr>";

    // total calculate (excluding id 4)
    const total = data.paymentData
      .filter(p => p.id !== 4)
      .map(p => Number(p.payment_value) || 0)
      .reduce((a, b) => a + b, 0);

    let paymentRows = "<tr>";
    for (const pay of data.paymentData) {
      let displayValue = "";
      if (pay.id === 4) {
        displayValue = parseInt(pay.payment_value);
      } else {
        const value = Number(pay.payment_value);
        if (total === 100) {
          const formatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
          displayValue = `${formatted}%`;
        } else {
          displayValue = `${currency_symbol}${value.toFixed(2)}`;
        }
      }
      paymentRows += `<td>${pay.payment_name}: ${displayValue}</td>`;
    }
    paymentRows += "</tr>";

    // yahan colspan calculate karo
    const paymentColspan = data.paymentData.length;

    if (productDetailList && productDetailList.length > 0) {
      for (let items of productDetailList) {
        let item_id = items.id_product;

        let [rows] = await db.sequelize.query(
          `
            SELECT cplm.totalPrice, cplm.totalWithGst, cplm.dbp, mi.MRP
            FROM CRM_PROPOSAL_LIST_MST AS cplm
            LEFT JOIN MASTER_ITEM AS mi ON mi.id = cplm.product_master_id
            WHERE cplm.id = :item_id
            LIMIT 1
        `,
          {
            replacements: { item_id },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );

        if (rows) {
          items.totalPrice = rows.totalPrice;
          items.totalWithGst = rows.totalWithGst;
          items.dbp = rows.dbp;
          items.MRP = rows.MRP;
        }
      }
    }

    // console.log(proposalData)
    const logoPath = path.join(__dirname, "../templates/selected-logo.jpg");
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    company_logo = logoBase64;
    let isExist;
    if (proposal_type_id) {
      isExist = await db.perposal_type.findOne({
        where: { id: proposal_type_id },
      });
      proposal_type_id = isExist.perposal_type;
    }

    const htmlPath = path.join(
      __dirname,
      "../templates/quotationPerformapdf.html"
    );
    if (!fs.existsSync(htmlPath)) throw new Error("Template not found.");

    let htmlTemplate = fs.readFileSync(htmlPath, "utf8");

    let finalRows = "";
    const noImagePath = path.join(__dirname, "../templates/No-Image.png");

    // project root detect karo (go 2-3 levels up from current file)
    const projectRoot = path.resolve(__dirname, "../../../.."); // adjust if needed
    const uploadBasePath = path.join(projectRoot, "uploaded_files");

    for (const [index, p] of productDetailList.entries()) {
      try {
        let imgBase64 = "";
        let imgSource = "";

        if (p.item_img_path) {
          // handle if path already includes "uploaded_files" or not
          let fullImgPath = p.item_img_path.includes("uploaded_files")
            ? path.join(projectRoot, p.item_img_path)
            : path.join(uploadBasePath, p.item_img_path);

          // normalize path (to avoid double slashes or backslashes)
          fullImgPath = path.normalize(fullImgPath);

          // ✅ check if actual image exists
          if (fs.existsSync(fullImgPath)) {
            const imgBuffer = fs.readFileSync(fullImgPath);
            imgBase64 = `data:image/jpeg;base64,${imgBuffer.toString("base64")}`;
            imgSource = fullImgPath;
          } else {
            // fallback if file missing
            const noImgBuffer = fs.readFileSync(noImagePath);
            imgBase64 = `data:image/png;base64,${noImgBuffer.toString("base64")}`;
            imgSource = "templates/No-Image.png";
          }
        } else {
          // if item_img_path is null
          const noImgBuffer = fs.readFileSync(noImagePath);
          imgBase64 = `data:image/png;base64,${noImgBuffer.toString("base64")}`;
          imgSource = "templates/No-Image.png";
        }

        console.log(`✅ Product ${index + 1}:`, {
          productName: p.product_name,
          imgSource,
        });

        // ---- Main Product Row ----
        finalRows += `
  <tr class="product-row">
    <td style="text-align:center;"><strong>${index + 1}</strong></td>
    <td>
      ${p.product_name || p.name_product || ""}<br>
      ${p.product_description || ""}<br>
      Warranty: ${p.warranty || ""}
    </td>
    <td style="text-align:center;">
      <img src="${imgBase64}" width="40" height="55" />
    </td>
    <td style="text-align:center;">${p.hsn_sac_code || ""}</td>
    <td style="text-align:center;">${p.igst != null ? p.igst : ""}</td>
    <td style="text-align:center;">
      ${p.qty ? p.qty : ""} ${p.uom_name ? p.uom_name : ""}
    </td>
    <td style="text-align:right;">${currency_symbol}${p.MRP}</td>
    <td style="text-align:right;">
      ${p.totalDiscountAmountPerQTY && parseFloat(p.totalDiscountAmountPerQTY) !== 0
            ? currency_symbol + (parseFloat(p.totalDiscountAmountPerQTY).toFixed(2))
            : "-"
          }
    </td>
    <td style="text-align:right;">${currency_symbol}${p.totalPrice != null ? p.totalPrice.toLocaleString("en-IN") : ""
          }</td>
  </tr>
`;
        let subItemCounter = 1;
        // ---- customization & branding ----
        if (p.custom_branding && p.custom_branding.length > 0) {
          for (const cb of p.custom_branding) {
            try {
              // Customisation Subitems
              if (cb.customisation_data && cb.customisation_data.length > 0) {
                for (const cd of cb.customisation_data) {
                  const qty = cd.qty || 0;
                  const uom = cd.uom_name || '';
                  const pricePerUnit =
                    cd.price_per_unit || cd.acce_price_per_unit || 0;
                  const totalMrp = cd.total_price || 0;
                  const gstPercent = cd.gst || 0;
                  const discount = cd.totalDiscountAmountPerQTY && parseFloat(cd.totalDiscountAmountPerQTY) !== 0
                    ? currency_symbol + (parseFloat(cd.totalDiscountAmountPerQTY).toFixed(2))
                    : "-";

                  finalRows += `
                <tr>
                  <td style="text-align:end;">${index + 1}${String.fromCharCode(
                    96 + subItemCounter
                  )}</td>
                  <td>${cd.item_name || cd.type_of_basket || ""}</td>
                  <td style="text-align:center;"></td>
                  <td style="text-align:center;">${cd.basket_hsn_code || cd.acce_hsn_sac_code || ""
                    }</td>
                  <td style="text-align:center;">${gstPercent}</td>
                  <td style="text-align:center;">${qty} ${uom}</td>
                  <td style="text-align:end;">${currency_symbol}${parseFloat(pricePerUnit).toFixed(2)}</td>
                  <td style="text-align:end;">${discount}</td>
                  <td style="text-align:end;">${currency_symbol}${parseFloat(totalMrp).toFixed(2)}</td>
                </tr>
              `;
                  subItemCounter++;
                }
              }

              // Branding Subitems
              if (cb.branding_data) {
                const bd = cb.branding_data;
                const qty = bd.qty || 0;
                const uom = bd.uom_name || '';
                const amt = bd.branding_price_per_unit || 0;
                const discount = bd.totalDiscountAmountPerQTY && parseFloat(bd.totalDiscountAmountPerQTY) !== 0
                  ? currency_symbol + (parseFloat(bd.totalDiscountAmountPerQTY).toFixed(2))
                  : "-";
                const grandTotal = bd.branding_after_discount || "&nbsp;";

                finalRows += `
              <tr>
                <td style="text-align:end;">${index + 1}${String.fromCharCode(
                  96 + subItemCounter
                )}</td>
                <td>Branding: ${bd.branding_description || ""}</td>
                <td></td>
                <td style="text-align:center;">${bd.branding_hsn_sac_code}</td>
                <td style="text-align:center;">${bd.branding_gst_value}</td>
                <td style="text-align:center;">${qty} ${uom}</td>
                <td style="text-align:end;">${currency_symbol}${parseFloat(amt).toFixed(2)}</td>
                <td style="text-align:end;">${discount}</td>
                <td style="text-align:end;"
                >${currency_symbol}${parseFloat(grandTotal).toFixed(2)}</td>
              </tr>
            `;
                subItemCounter++;
              }
            } catch (subErr) {
              console.error(" Subitem render error:", subErr);
              finalRows += `
            <tr>
              <td colspan="9" style="color:red;">Error loading subitem</td>
            </tr>
          `;
            }
          }
        }

        // ---- Installation Kit (BOM) ----
        if (p.bomArray && p.bomArray.length > 0) {
          for (const ba of p.bomArray) {
            try {
                  const qty = ba.qty || 0;
                  const uom = 'KIT';
                  const pricePerUnit = ba.price_per_unit || 0;
                  const totalMrp = ba.total_price || 0;
                  const gstPercent = ba.gst || 0;
                  const discount = ba.totalDiscountAmountPerQTY && parseFloat(ba.totalDiscountAmountPerQTY) !== 0
                    ? currency_symbol + (parseFloat(ba.totalDiscountAmountPerQTY).toFixed(2))
                    : "-";

                  finalRows += `
                <tr>
                  <td style="text-align:end;">${index + 1}${String.fromCharCode(
                    96 + subItemCounter
                  )}</td>
                  <td>${ba.bom_name || ""}</td>
                  <td style="text-align:center;"></td>
                  <td style="text-align:center;">${ba.hsn_code || ""
                    }</td>
                  <td style="text-align:center;">${gstPercent}</td>
                  <td style="text-align:center;">${qty} ${uom}</td>
                  <td style="text-align:end;">${currency_symbol}${parseFloat(pricePerUnit).toFixed(2)}</td>
                  <td style="text-align:end;">${discount}</td>
                  <td style="text-align:end;">${currency_symbol}${parseFloat(totalMrp).toFixed(2)}</td>
                </tr>
              `;
              subItemCounter++;
            } catch (subErr) {
              console.error(" Subitem render error:", subErr);
              finalRows += `
            <tr>
              <td colspan="9" style="color:red;">Error loading subitem</td>
            </tr>
          `;
            }
          }
        }
      } catch (err) {
        console.error(" Product row render error:", err);
        finalRows += `
      <tr>
        <td colspan="9" style="color:red;">Error loading product row</td>
      </tr>
    `;
      }
    }

    let unloading_data = "";
    if (proposalData.unloading === "Elanpro") {
      if (proposalData.unloading_resp_amount) {
        unloading_data = proposalData?.unloading_resp_remark + " | " + currency_symbol + "" + proposalData.unloading_resp_amount;
      }
    } else {
      unloading_data = proposalData.unloading + " | " + proposalData?.unloading_resp_remark;
    }

    let insurance_name = "";
    if (proposalData.insurance_name === "Elanpro") {
      if (proposalData.insurance_amt) {
        insurance_name = currency_symbol + "" + proposalData.insurance_amt;
      }
    } else {
      insurance_name = proposalData.insurance_name;
    }

    const proposalTypes = {
      10: "Government Client",
      11: "Private Client",
    };

    const d = new Date(proposalData?.valid_till_date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    let validDate = `${day}-${month}-${year}`;

    // let proposalListData = await db.proposalList.findOne
    let discData = await db.sequelize.query(
      `
            SELECT DISTINCT
                gd.discount_type,gd.discount_value, gd.discount_type, gd.gross_discount_id, 
                gdm.discount_name,gd.discount_amount
            FROM CRM_PROPOSAL_GROSS_DISCOUNT gd
            INNER JOIN CRM_PROPOSAL_GROSS_DISCOUNT_MST gdm 
                ON gdm.id = gd.gross_discount_id
            WHERE gd.proposal_id = :proposal_id
            AND gd.version_id = :version_id
            AND gd.discount_type IS NOT NULL;
            `,
      {
        replacements: { proposal_id, version_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    let heading = "QUOTATION";
    let elanName = proposalData?.dealer == 1 ? proposalData?.dealer_company_name : "Elan Professional Appliances Pvt. Ltd.";
    let mainAddress = proposalData?.dealer == 1 ? `${proposalData?.warehouse_address},${proposalData?.warehouse_postal_address},${proposalData?.warehouse_pin}` : 'Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004'
    // PO to be issued in the name of
    let poIssueName = `<b>${elanName}</b><br />
        ${proposalData.warehouse_address || ""},${proposalData.warehouse_postal_address || ""}, ${proposalData.warehouse_pin || ""
      }<br />
        GSTIN: ${proposalData.warehouse_gst || ""}<br />`;
    // <b>${proposalData.warehouse_name || ""}</b><br />
    // Email: ${proposalData.warehouse_email || ""}<br />
    // Mobile No: ${proposalData.warehouse_contact_no || ""}`;

    let dateValue = proposalData.valid_till_date || "";
    let formattedDate = "";

    if (dateValue) {
      const d = new Date(dateValue);
      if (!isNaN(d)) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "short" });
        // const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        formattedDate = `${day}-${month}-${year}`;
      }
    }

    let quotationPiRows = "";
    const now = new Date();
    const day1 = String(now.getDate()).padStart(2, "0");
    const month1 = now.toLocaleString("en-US", { month: "short" });
    const year1 = now.getFullYear();
    const currentDate = `${day1}-${month1}-${year1}`;

    if (proposalData?.pi_number && proposalData?.proposal_no) {
      // Case 1: PI & quotation available
      quotationPiRows = `
    <tr>
      <td rowspan="3" style="width:50%;">
        ${poIssueName}
      </td>
      <td style="width:30%;"><b>PI No:</b> ${proposalData.pi_number}</td>
      <td style="width:20%;">
      <b>Date:</b> ${currentDate} <br>
      
    </td>
    </tr>
    <tr>
      <td colspan="2"><b>Ref. Quotation No:</b> ${proposalData.proposal_no}</td>
    </tr>`;

      heading = "PROFORMA INVOICE";
    } else if (proposalData?.proposal_no) {
      // Case 2: only quotation available
      quotationPiRows = `
    <tr>
      <td rowspan="2" style="width:50%;">
        ${poIssueName}
      </td>
      <td style="width:30%;"><b>Quotation No:</b> ${proposalData.proposal_no}</td>
      <td style="width:20%;"> 
      <b>Date:</b> ${currentDate} <br>
      
    </td>
    </tr>`;

      heading = "QUOTATION";
    }

    // generate HTML rows
    // generate HTML rows
    let payment_discount = "";
    discData.forEach((d) => {
      //   const value =
      //     d.discount_type === "flat"
      //       ? `${currency_symbol} ${d.discount_value}`
      //       : `${d.discount_value} %`;

      const per =
        d.discount_type === "percent"
          ? `(${Number(d.discount_value) % 1 === 0
            ? parseInt(d.discount_value)
            : d.discount_value
          }%)`
          : "";

      payment_discount += `
    <tr>
      <td colspan="7" style="text-align:right;"><b>${d.discount_name}</b></td>
      <td colspan="2" style="text-align:right;">${currency_symbol} ${d.discount_amount} ${per}</td>
    </tr>
  `;
    });

    // // Sequelize objects ko plain JS object me convert
    // discData = discData.map(d => d.toJSON ? d.toJSON() : d);

    // // header row (use discount_name)
    // let discountHeaders = discData.map(d => {
    //     return `<td style="text-align:center;"><b>${d.discount_name}</b></td>`;
    // }).join("");

    // // value row (use discount_value + Rs/%)
    // let discountValues = discData.map(d => {
    //     let symbol = d.discount_type === 'flat' ? ' ₹' : d.discount_type === 'percent' ? ' %' : '';
    //     return `<td style="text-align:center;">${d.discount_value}${symbol}</td>`;
    // }).join("");

    // // total discount (numeric only)
    // let totalDiscount = discData.reduce((sum, d) => sum + Number(d.discount_value || 0), 0);

    //let bankData = await getLatestBankDataByEntityId(entity_id);
    let bankData;
    if (proposalData?.dealer) {
      bankData = await db.customer_business_details.findOne({ where: { customer_id: proposalData?.dealer_id } });
    } else {
      bankData = await bankDetails.bankDetails(entity_id);
    }

    // let bankData = await bankDetails.bankDetails(entity_id);
    // console.log("bankData============>", bankData);
    let headingName =
      proposalData?.quotation_type === "direct" ? "Sales Booking" : "";
    // Replace placeholders
    let finalHtml = htmlTemplate
      .replace(/{{title}}/g, proposalData?.title || "")
      .replace(/{{quotation_type }}/g, proposalData?.quotation_type || "")
      .replace(/{{currency_symbol}}/g, currency_symbol || "")
      .replace(/{{first_name}}/g, proposalData?.first_name || "NA")
      .replace(/{{middle_name}}/g, proposalData?.middle_name || "")
      .replace(/{{last_name}}/g, proposalData?.last_name || "NA")
      .replace(/{{contact_number}}/g, data?.sales_number || "NA")
      .replace(/{{contact_person_name}}/g, proposalData?.personName || "NA")
      .replace(/{{person_title}}/g, proposalData?.title || "")
      .replace(/{{mobile}}/g, proposalData?.mobile || "NA")
      .replace(
        /{{employee_official_email}}/g,
        proposalData.employee_official_email || "NA"
      )
      .replace(/{{warehouse_pin}}/g, proposalData.warehouse_pin || "NA")
      .replace(/{{warehouse_address}}/g, proposalData.warehouse_address || "NA")
      .replace(/{{warehouse_gst}}/g, proposalData?.warehouse_gst || "NA")
      .replace(/{{warehouse_email}}/g, proposalData.warehouse_email || "NA")
      .replace(
        /{{warehouse_contact_no}}/g,
        proposalData?.warehouse_contact_no || "NA"
      )
      .replace(/{{valid_till_date}}/g, validDate || "NA")
      .replace(/{{freight_name}}/g, proposalData?.freight_name || "NA")
      // .replace(/{{pi_number}}/g, proposalData?.pi_number || '')
      .replace(/{{lead_source}}/g, proposalData?.lead_source || "NA")
      .replace(/{{quotation_pi_rows}}/g, quotationPiRows || "")
      .replace(/{{validTill}}/g, formattedDate || "")
      .replace(/{{poIssueName}}/g, poIssueName || "")
      //.replace(/{{insurance_name}}/g, proposalData?.insurance_name || "NA")
      .replace(/{{insurance}}/g, insurance_name || "NA")
      //.replace(/{{insurance_amount}}/g, insurance_amount)
      .replace(/{{payment_name}}/g, proposalData?.payment_name || "NA")
      .replace(/{{sub_payment_name}}/g, proposalData?.sub_payment_name || "NA")
      .replace(/{{branch_name}}/g, proposalData?.branch_name || "NA")
      .replace(/{{warehouse_name}}/g, proposalData?.warehouse_name || "NA")
      .replace(/{{delivery_term}}/g, proposalData?.delivery_term || "NA")
      // .replace(/{{unloading}}/g, proposalData?.unloading || "NA")
      .replace(/{{unloading}}/g, unloading_data || "NA")
      // .replace(/{{proposal_no}}/g, proposalData?.proposal_no || 'NA')
      .replace(/{{mail_id}}/g, proposalData?.mail_id || "NA")
      .replace(/{{company_name}}/g, proposalData?.company_name || "NA")
      .replace(/{{created_by}}/g, proposalData?.created_by || "NA")
      .replace(/{{delivery_term_remark}}/g, proposalData?.delivery_term_remark || "")
      //.replace(/{{unloading_resp_remark}}/g,proposalData?.unloading_resp_remark || "NA")
      //.replace(/{{unloading_resp_amount}}/g, unloading_amount)
      .replace(/{{warranty_month_remark}}/g, proposalData?.warranty_month_remark || "NA") // use for Special Warranty Terms
      .replace(/{{warranty_month}}/g, proposalData?.warranty_month || "NA")
      .replace(/{{billing_address}}/g, proposalData?.billing_address || "")
      .replace(/{{billing_pincode}}/g, proposalData?.billing_pincode || "")
      .replace(/{{gst_in}}/g, proposalData?.billing_gst || "")
      .replace(
        /{{billing_country_name}}/g,
        proposalData?.billing_country_name || "NA"
      )
      .replace(
        /{{billing_state_name}}/g,
        proposalData?.billing_state_name || "NA"
      )
      .replace(/{{billing_city_name}}/g, proposalData?.billing_city_name || " ")
      .replace(
        /{{shipping_country_name}}/g,
        proposalData?.shipping_country_name || "NA"
      )
      .replace(
        /{{shipping_state_name}}/g,
        proposalData?.shipping_state_name || "NA"
      )
      .replace(
        /{{shipping_city_name}}/g,
        proposalData?.shipping_city_name || "NA"
      )
      .replace(/{{shipping_address}}/g, proposalData?.shipping_address || "NA")
      .replace(/{{shipping_pin_code}}/g,proposalData?.shipping_pin_code || "NA")
      .replace(/{{shipping_gst_in}}/g,proposalData?.shipping_gst_in || "NA")
      .replace(
        /{{shipping_customer_name}}/g,
        proposalData?.shipping_customer_name || "NA"
      )
      .replace(/{{paymentRows}}/g, ` ${paymentRows || "0.00"}`)
      .replace(/{{paymentColspan}}/g, `${paymentColspan || ""}`)
      .replace(/{{igst}}/g, `${currency_symbol} ${igst || "0.00"}`)
      .replace(
        /{{grossTotal}}/g,
        `${currency_symbol} ${proposalData?.grossTotal || "0.00"}`
      )
      .replace(
        /{{grant_total}}/g,
        `${currency_symbol} ${grant_total || "0.00"}`
      )
      .replace(
        /{{totalAMTAfterDiscount}}/g,
        `${currency_symbol} ${totalAMTAfterDiscount || "0.00"}`
      )
      .replace(/{{payment_discount}}/g, ` ${payment_discount}`)
      .replace(/{{totalInWord}}/g, `${numberToWordsIndian(grant_total)}`)
      .replace(/{{finalRows}}/g, finalRows)
      .replace(/{{gstin}}/g, proposalData?.gst_no || "")
      // .replace(/{{productSubItemRows}}/g, productSubItemRows)
      .replace(/{{logo}}/g, company_logo)
      .replace(/{{proposal_type}}/g, proposalTypes[proposal_type_id] || "NA")
      .replace(/{{gstTotal}}/g, gstTotal || "0.00")
      .replace(/{{totalAMTAfterDiscount}}/g, totalAMTAfterDiscount || "0.00")
      .replace(/{{allowance_details}}/g, allowances + reimbursements)
      // .replace(/{{discountHeaders}}/g, discountHeaders)
      // .replace(/{{discountValues}}/, discountValues)
      // .replace(/{{totalDiscount}}/, totalDiscount)
      .replace(/{{banName}}/, bankData?.account_name ?? bankData?.beneficiary_name ?? "NA")
      .replace(/{{bankName}}/, bankData?.bank_name || "NA")
      .replace(/{{bankType}}/, bankData?.account_type || "NA")
      .replace(/{{bankIFSC}}/, bankData?.ifsc_code || "NA")
      .replace(/{{bankAccount}}/, bankData?.bank_account_no ?? bankData?.bank_account_number ?? "NA")
      .replace(/{{heading}}/, headingName ? headingName : heading || "")
      .replace(/{{elanName}}/g, elanName || "")
      .replace(/{{mainAddress}}/g, mainAddress || "");

    // Generate PDF
    const pdfBuffer = await generatePDF(finalHtml);

    // Save
    let fileName = "";
    if (proposalData?.quotation_type === "direct") {
      fileName = `Sales-Booking_${proposalData.pi_number}.pdf`;
    } else {
      fileName =
        page_mode === "quotation"
          ? `Quotation_${proposal_no}.pdf`
          : `Proforma_Invoice_${proposalData.pi_number}.pdf`;
    }

    // const pdfPath = path.join(pdfDir, fileName);
    // if (!fs.existsSync(pdfDir)) {
    //   fs.mkdirSync(pdfDir, { recursive: true });
    // }
    // fs.writeFileSync(pdfPath, pdfBuffer);
    return { fileName, pdfBuffer };
  } catch (err) {
    console.error("PDF generation failed:", err.message);
    throw err;
  }
};


module.exports.sendQuotationVersionMail = async function (
  entity_id, contact_person_name, created_by_email, proposal_no, result, page_mode, mailObject, uploadedFiles
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterBy_EntityId(entity_id);
    // const fileExists = require("fs").existsSync(result.pdfPath);

    const invoiceType =
      page_mode === "quotation" ? "Quotation" : "Proforma Invoice";

    const toEmails = [
      created_by_email,
      ...(Array.isArray(mailObject?.to_email)
        ? mailObject.to_email
        : mailObject?.to_email
          ? [mailObject.to_email]
          : []),
    ].filter(Boolean);
    const ccEmails = Array.isArray(mailObject?.cc_email)
      ? mailObject.cc_email
      : mailObject?.cc_email
        ? [mailObject.cc_email]
        : [];


    const bccEmails = [
      "hr@kiranautomation.com",
      ...(Array.isArray(mailObject?.bcc_email)
        ? mailObject.bcc_email
        : mailObject?.bcc_email
          ? [mailObject.bcc_email]
          : []),
    ];

    const attachments = [];

    if (result?.pdfBuffer) {
      attachments.push({
        filename: result.fileName || "quotation.pdf",
        content: result.pdfBuffer,
        contentType: "application/pdf",
      });
    }

    if (uploadedFiles) {
      if (Array.isArray(uploadedFiles)) {
        uploadedFiles.forEach((file) => {
          attachments.push({
            filename: file.originalname,
            path: file.path,
          });
        });
      } else {

        attachments.push({
          filename: uploadedFiles.originalname,
          path: uploadedFiles.path,
        });
      }
    }

    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: toEmails.join(", "),
      cc: ccEmails.length ? ccEmails.join(", ") : undefined,
      bcc: bccEmails.length ? bccEmails.join(", ") : undefined,
      subject: `${mailObject?.subject}`,
      html: `
                Dear ${contact_person_name},<br/><br/>
                ${mailObject?.message}
                Please find the attached ${invoiceType}.<br/><br/>
                Regards,<br/>${entity_name}
            `,
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${created_by_email}:`, info.response);
  } catch (error) {
    console.error(`Error sending email to ${created_by_email}:`, error); // log full error
  }
};
//---------------------------- Proposal----------------------------------------
module.exports.sendPerformaInoviceMail = async function (
  entity_id, contact_person_name,
  // mail_id,
  created_by_email, proposal_no, result, page_mode
) {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterBy_EntityId(entity_id);
    // const fileExists = require("fs").existsSync(result.pdfPath);
    // 🟢 Dynamic subject/body text
    // const invoiceType =page_mode === "quotation" ? "Quotation" : "Proforma Invoice";
const invoiceType =page_mode === 'quotation'? 'Quotation': page_mode === 'salesbooking'? 'Sales Booking': 'Proforma Invoice';
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: created_by_email,
      bcc: "ajayem@yopmail.com",
      subject: `${invoiceType} - ${proposal_no}`,
      html: `
                Dear ${contact_person_name},<br/><br/>
                Please find the attached ${invoiceType}.<br/><br/>
                Regards,<br/>${entity_name}
            `,
      attachments: [
        {
          filename: result.fileName,
          content: result.pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${created_by_email}:`, info.response);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email to ${created_by_email}:`, error); // log full error
    return { success: false, error };
  }
};

//---------------------------- Proposal----------------------------------------
module.exports.sendPerformaInoviceReMail = async function (
  entity_id, contact_person_name, created_by_email, proposal_no, send_pi_link
) {
  try {
    //const send_pi_link = `${origin}/send-pi-link?proposalId=${proposal_id}&version_id=${version_id}&status=proformaAddMail&idPI=${idPI}`

    // Assuming this function returns the transporter and other details for email setup
    const { transporter, fromEmail, entity_name } =
      await getTransporterBy_EntityId(entity_id);

    // Define the email content
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: created_by_email,
      bcc: "ajayem@yopmail.com",
      subject: `Proforma Invoice for Proposal ${proposal_no}`,
      html: `
                <p>Dear ${contact_person_name},</p>
                <p>Please find attached the Proforma Invoice. You can view and accept the proposal by clicking the following link:</p>
                <p><a href="${send_pi_link}" target="_blank">Confirm the Proposal</a></p>
                <p>Should you have any questions or need further assistance, feel free to reach out.</p>
                <br/>
                <p>Regards,</p>
                <p>${entity_name}</p>
            `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error(`Error sending email to ${created_by_email}:`, error.message);
    // Do not rethrow – skip and continue
  }
};

module.exports.generateSOInvoice = async (planning) => {
  try {
    const so = planning.sale_orders?.[0];

    console.log(planning);
    console.log(planning.sale_orders?.[0]);

    if (!so) {
      throw new Error("No sales order data found in planning object.");
    }

    const items = so.sale_order_items || [];

    // Load HTML template
    const htmlPath = path.join(__dirname, "../templates/invoicePickList.html");
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`HTML template not found at path: ${htmlPath}`);
    }

    let htmlTemplate = fs.readFileSync(htmlPath, "utf8");

    // console.log(proposalData)
    const logoPath = path.join(__dirname, "../templates/elan_logo.jpg");
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    company_logo = logoBase64;

    // console.log(proposalData)
    const logoPath1 = path.join(__dirname, "../templates/Elan_QR.jpeg");
    let logoBase641 = "";

    if (fs.existsSync(logoPath1)) {
      const imageBuffer = fs.readFileSync(logoPath1);
      logoBase641 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    elanQR_logo = logoBase641;

    // Generate item rows
    let itemRows = "";
    let totalAmount = 0;
    items.forEach((item, index) => {
      const rate = parseFloat(item.price_per_unit || 0);
      const qty = parseFloat(item.quantity || 0);
      const total = rate * qty;
      totalAmount += total;

      itemRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.item_name || "-"} ${item.item_description || "-"}</td>
          <td>${item.item_code || "-"}</td>
          <td>${qty}</td>
          
        </tr>
      `;
    });
    // <td>${rate.toFixed(2)}</td>
    // <td>${total.toFixed(2)}</td>
    // Replace placeholders in the template
    let expectedDeliveryDate = so.pickup_info?.expected_delivery_date || "-";
    const termsAndConditions =
      so.terms_and_conditions ||
      "1. Payment due within 30 days. <br> 2. No returns accepted after dispatch.";
    const pickupAdd = so.pickup_info?.pickup_address || "-";
    const pickup_pincode = so.pickup_info?.pickup_pincode || "-";
    const delivery_address = so.sale_order_items[0]?.delivery_address || "-";
    const delivery_pincode = so.sale_order_items[0]?.delivery_pincode || "-";

    // Format to YYYY-MM-DD if it exists
    if (expectedDeliveryDate && expectedDeliveryDate !== "-") {
      const dateObj = new Date(expectedDeliveryDate);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months start from 0
      const dd = String(dateObj.getDate()).padStart(2, '0');

      expectedDeliveryDate = `${yyyy}-${mm}-${dd}`;
    }
    const filledHtml = htmlTemplate
      .replace(/{{sales_order_no}}/, planning.sales_order_no || "NA")
      .replace(/{{sales_order_date}}/, planning.sales_order_date || "NA")
      .replace(/{{expected_delivery_date}}/, expectedDeliveryDate || "NA")
      .replace(/{{itemRows}}/, itemRows || "<tr><td colspan='5'>NA</td></tr>")
      .replace(/{{totalAmount}}/, totalAmount ? totalAmount.toFixed(2) : "NA")
      .replace(/{{terms_and_conditions}}/, termsAndConditions || "NA")
      .replace(/{{pickupAdd}}/, pickupAdd || "NA")
      .replace(/{{delivery_address}}/, delivery_address || "NA")
      .replace(/{{pickup_pincode}}/, pickup_pincode || "NA")
      .replace(/{{delivery_pincode}}/, delivery_pincode || "NA")
      .replace(/{{company_logo}}/, company_logo || "NA")
      .replace(/{{vehicle_root_status}}/, planning.vehicle_root_status || "NA")
      .replace(/{{planning_code}}/, planning.planning_code || "NA")
      .replace(/{{tm_name}}/, planning.tm_name || "NA")
      .replace(/{{elanQR_logo}}/, elanQR_logo || "NA")
      .replace(/{{loading_priority}}/, planning.priority || "NA");

    // Safe file name
    const safeOrderNo = so.sales_order_no?.replace(/[\/\\]/g, "_") || "unknown";
    const filename = `dispatch_pick_list_${safeOrderNo}.pdf`;
    const savePath = path.join("uploaded_files", filename);
    //  const pdfDir = 'uploaded_files';

    // Ensure directory exists
    const saveDir = path.dirname(savePath);
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    const pdfBuffer = await generatePDF(filledHtml);

    return {
      pdfBuffer,
      fileName: `dispatch_pick_list_${so.sales_order_no?.replace(/[\/\\]/g, "_") || "unknown"}.pdf`,
    };

    // Save PDF
    // fs.writeFileSync(savePath, pdfBuffer);

    // return { pdfBuffer, fileName: filename };
  } catch (error) {
    console.error("Error generating SO invoice PDF:", error.message);
    throw error;
  }
};

async function generatePDF(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}

module.exports.generatePOPDF = async function (poData) {
  try {
    // const {transporter, fromEmail, entity_name} = await getTransporterByEntityId(entityId);
    // const entityConfig = await db.entityMaster.findByPk(entityId);
    const htmlFilePath = path.resolve(
      __dirname,
      "../templates/po.template.html"
    );
    const html = fs.readFileSync(htmlFilePath, "utf-8");
    const replaceNullWithEmpty = (str) => (str == null ? "" : str);

    // let serviceItemTable = "";
    // if (Item_Detail || Service_Detail) {
    //     serviceItemTable = generateServiceItemTable(
    //         Item_Detail || [],
    //         Service_Detail || [],
    //         itemResults, serviceResults, response
    //     );
    // }
    let subTotal = 0;
    let gstAmount = 0;
    let total_purchase = 0;

    const itemRows = poData.PROCUREMENT_PURCHASE_ORDER_ITEMs.map((it, i) => {
      // Safely parse numeric values
      const total_mvp = parseFloat(replaceNullWithEmpty(it.total_mvp) || 0);
      const total_cgst = parseFloat(replaceNullWithEmpty(it.total_cgst) || 0);
      const total_sgst = parseFloat(replaceNullWithEmpty(it.total_sgst) || 0);
      const total_igst = parseFloat(replaceNullWithEmpty(it.total_igst) || 0);

      // Accumulate totals
      subTotal += total_mvp;
      gstAmount += total_cgst + total_sgst + total_igst;
      total_purchase = subTotal + gstAmount;

      // Return table row HTML
      return `
      <tr>
        <td>${i + 1}</td>
        <td>${it.MASTER_ITEM.item_name || ""} ${it.MASTER_ITEM.description || ""
        }</td>
        <td>${it.MASTER_ITEM.MASTER_HSN_SAC_CODE?.hsn_sac_code || ""}</td>
        <td>${it.quantity || ""}</td>
        <td>${it.MASTER_ITEM.MASTER_UOM?.uom_name || ""}</td>
        <td>${it.unit_price || ""}</td>
        <td>${it.total_mvp || ""}</td>
        <td>${it.total_cgst || ""}</td>
        <td>${it.total_sgst || ""}</td>
        <td>${it.total_igst || ""}</td>
      </tr>`;
    }).join("");

    // Now you can safely use subTotal, gstAmount, and total_purchase below
    function convertToWords(number) {
      let integerPart = Math.floor(number);
      let decimalPart = number % 1;
      let words = numberToWords.toWords(integerPart);
      if (decimalPart > 0) {
        let decimalString = decimalPart.toFixed(2).split(".")[1];
        words += " Point " + numberToWords.toWords(parseInt(decimalString, 10));
      }
      words = words
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return words;
    }

    let amountInWords = convertToWords(total_purchase) + " Only";
    const logoPath = path.join(__dirname, "../templates/selected-logo.jpg");
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }

    company_logo = logoBase64;
    const htmlWithData = html
      .replace("{{companyGST}}", poData.companyGST)
      .replace("{{refDocNo}}", poData.refDocNo)
      .replace("{{refDocDate}}", poData.refDocDate)
      .replace("{{orderNo}}", poData.po_number)
      .replace("{{orderDate}}", poData.po_date)
      .replace("{{parentDocNo}}", poData.parentDocNo)
      .replace("{{billingParty}}", poData.VENDOR_BASIC_DETAIL.vendor_name)
      .replace(
        "{{billingAddress}}",
        `${poData.VENDOR_BASIC_DETAIL.vendor_address}, ${poData.VENDOR_BASIC_DETAIL.MASTER_CITY.city_name}`
      )
      .replace(
        "{{billingState}}",
        poData.VENDOR_BASIC_DETAIL.MASTER_STATE.states_name
      )
      .replace(
        "{{billingCode}}",
        poData.VENDOR_BASIC_DETAIL.MASTER_STATE.states_code
      )
      .replace("{{billingGST}}", poData.VENDOR_BASIC_DETAIL.billing_gst || "")
      .replace(
        "{{shippingAddress}}",
        `${poData.MASTER_BRANCH.branch_name}, ${poData.MASTER_BRANCH.branch_address}, ${poData.MASTER_BRANCH.MASTER_CITY.city_name}, ${poData.MASTER_BRANCH.MASTER_STATE.states_name}, ${poData.MASTER_BRANCH.branch_pin_code}`
      )
      .replace("{{itemsTable}}", itemRows)
      .replace("{{subTotal}}", subTotal)
      .replace("{{gstAmount}}", gstAmount)
      .replace("{{billAmount}}", total_purchase)
      .replace("{{amountInWords}}", amountInWords)
      .replace(/{{logo}}/g, company_logo)
      .replace("{{narration}}", poData.narration || "N/A");
    const pdfBuffer = await generatePDF(htmlWithData);

    return pdfBuffer;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports.sendMailForDispatchMismatch = async (
  entity_id,
  recipientEmail,
  soData,
  reason
) => {
  try {
    const { transporter, fromEmail, entity_name } =
      await getTransporterBy_EntityId(entity_id);

    if (!recipientEmail) {
      console.warn("⚠️ No recipient email found for dispatch mismatch alert.");
      return;
    }

    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: recipientEmail,
      bcc: "ajayem@yopmail.com",
      subject: `Delay in Delivery - Sales Order ${soData.sales_order_no}`,
      html: `
        <p>Dear Team,</p>
        <p>There is a delay in the dispatch for the following sales order:</p>
        <ul>
          <li><b>Sales Order No:</b> ${soData.sales_order_no}</li>
          <li><b>Proposal No:</b> ${soData.proposal_no}</li>
          <li><b>Reason:</b> ${reason}</li>
        </ul>
        <p>Please take the necessary action or follow up accordingly.</p>
        <br/>
        <p>Best regards,</p>
        <p><b>${entity_name}</b></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `✅ Dispatch mismatch email sent to ${recipientEmail}: ${info.response}`
    );
  } catch (error) {
    console.error(`❌ Error sending dispatch mismatch email:`, error.message);
  }
};



module.exports.sendLinkForTransporterRequest = async function (created_by_email, contact_person_name, send_pi_link, entity_id, planning_code) {
  try {
    // Assuming this function returns the transporter and other details for email setup
    const { transporter, fromEmail, entity_name } = await getTransporterBy_EntityId(entity_id);

    // Define the email content
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: created_by_email,
      bcc: "ajayem@yopmail.com",
      subject: `Vehicle Planning Completed – Confirmation Required ${planning_code}`,
      html: `
                <p>Dear ${contact_person_name},</p>
                <p>Vehicle planning has been completed. Please arrange the vehicle as per the planned details and confirm availability. You can view and accept the transporter request by clicking the following link:</p>
                <p><a href="${send_pi_link}" target="_blank"  style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirm the vehicle planning request</a></p>
                <p>Should you have any questions or need further assistance, feel free to reach out.</p>
                <br/>
                <p>Regards,</p>
                <p>${entity_name}</p>
            `,
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error(`Error sending email to ${created_by_email}:`, error.message);

  }
};
// module.exports.sendLinkForCreateShippingAlert = async function (vendor_email,vendor_name,link,entity_id,po_number) {
//   try {

//     const { transporter, fromEmail, entity_name } = await getTransporterBy_EntityId(entity_id);

//     const mailOptions = {
//       from: `${entity_name} <${fromEmail}>`,
//       to: vendor_email,
//       bcc: "ajayem@yopmail.com",
//       subject: `Action Required: Create Shipping Alert for PO #${po_number}`,
//       html: `
//                 <p>Dear ${contact_person_name},</p>
//                 <p>Vehicle planning has been completed. Please arrange the vehicle as per the planned details and confirm availability. You can view and accept the transporter request by clicking the following link:</p>
//                 <p><a href="${send_pi_link}" target="_blank">Confirm the vehicle planning request</a></p>
//                 <p>Should you have any questions or need further assistance, feel free to reach out.</p>
//                 <br/>
//                 <p>Regards,</p>
//                 <p>${entity_name}</p>
//             `,
//     };


//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.response);
//   } catch (error) {
//     console.error(`Error sending email to ${created_by_email}:`, error.message);

//   }
// };
module.exports.sendLinkForCreateShippingAlert = async function (vendor_email, vendor_name, link, entity_id, po_number) {
  try {
    const { transporter, fromEmail, entity_name } = await getTransporterBy_EntityId(entity_id);

    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: vendor_email,
      bcc: "ajayem@yopmail.com",
      subject: `Action Required: Create Shipping Alert for PO #${po_number}`,
      html: `
            <p>Dear ${vendor_name},</p>
            <p>This is a notification to create a <strong>Shipping Alert</strong> for Purchase Order <strong>${po_number}</strong>.</p>
            <p>Please click the link below to provide the shipment details and generate the alert:</p>
            <p>
              <a href="${link}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Create Shipping Alert
              </a>
            </p>
            <p>If the button above does not work, copy and paste this link into your browser:<br/> ${link}</p>
            <p>Should you have any questions regarding this shipment, please reach out to us immediately.</p>
            <br/>
            <p>Regards,</p>
            <p><strong>${entity_name}</strong></p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Shipping Alert Email sent:", info.response);
  } catch (error) {
    console.error(`Error sending shipping alert to ${vendor_email}:`, error.message);
  }
};
module.exports.sendLinkForShippingAlertHistory = async function (vendor_email, vendor_name, link, entity_id, po_number) {
  try {
    const { transporter, fromEmail, entity_name } = await getTransporterBy_EntityId(entity_id);

    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: vendor_email,
      bcc: "ajayem@yopmail.com",
      subject: `Action Required: Shipping Alert History Of PO #${po_number}`,
      html: `
            <p>Dear ${vendor_name},</p>
            <p>This is a notification to create a <strong>Shipping Alert</strong> for Purchase Order <strong>${po_number}</strong>.</p>
            <p>Please click the link below to provide the shipment details and generate the alert:</p>
            <p>
              <a href="${link}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Create Shipping Alert
              </a>
            </p>
            <p>If the button above does not work, copy and paste this link into your browser:<br/> ${link}</p>
            <p>Should you have any questions regarding this shipment, please reach out to us immediately.</p>
            <br/>
            <p>Regards,</p>
            <p><strong>${entity_name}</strong></p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Shipping Alert Email sent:", info.response);
  } catch (error) {
    console.error(`Error sending shipping alert to ${vendor_email}:`, error.message);
  }
};

module.exports.sendAdminApprovelTransporterRequest = async function (created_by_email, contact_person_name, entity_id, planning_code, request_data,
  admin_status) {
  try {
    const { transporter, fromEmail, entity_name } = await getTransporterBy_EntityId(entity_id);

    // Define the email content
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: created_by_email,
      bcc: "ajayem@yopmail.com",
      subject: `Vehicle Planning Completed – Confirmation Required ${planning_code}`,
      html: `
                <p>Dear ${contact_person_name},</p>
                <p>We are pleased to inform you that your vehicle planning request with ID <strong>${planning_code}</strong> has been <strong>approved by the Admin</strong>.</p>

                <p>Details:</p>
                <ul>
                  <li>Vehicle Plan ID: ${planning_code}</li>
                  <li>Date of Request: ${request_data}</li>
                  <li>Admin Status: ${admin_status}</li>
                </ul>

                <p>Please proceed with the necessary arrangements for the transport.</p>

                <p>Thank you for your cooperation.</p>

                <p>Regards,</p>
                <p>${entity_name}</p>
            `,
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error(`Error sending email to ${created_by_email}:`, error.message);

  }
};


module.exports.sendMailPO = async function (
  vendor, entityId, response, biling, Item_Detail, Service_Detail, itemResults, serviceResults
) {
  try {
    const { transporter, fromEmail, entity_name } = await getTransporterBy_EntityId(entityId);
    const entityConfig = await db.entityMaster.findByPk(entityId);
    const htmlFilePath = path.resolve(__dirname, "../templates/po.html");
    const html = fs.readFileSync(htmlFilePath, "utf-8");
    const replaceNullWithEmpty = (str) => str == null ? "" : str;
    const logoPath = path.join(__dirname, "../../../../../src/assets/selected-logo.jpg");
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }


    let serviceItemTable = "";
    if (Item_Detail || Service_Detail) {
      // serviceItemTable = generateServiceItemTable(
      //   Item_Detail || [],
      //   Service_Detail || [],
      //   itemResults, serviceResults, response
      // );
    }
    const htmlWithData = html
      .replace("{po_number}", replaceNullWithEmpty(response.po_number))
      .replace("{po_date}", replaceNullWithEmpty(response.po_date))
      .replace("{entity_name}", replaceNullWithEmpty(entity_name))
      .replace("{registered_office}", replaceNullWithEmpty(entityConfig.registered_office))
      .replace("{smtp_server_address}", replaceNullWithEmpty(entityConfig.smtp_server_address))
      .replace("{logo}", replaceNullWithEmpty(logoBase64))
      .replace("{vendor_name}", replaceNullWithEmpty(vendor.vendor_name))
      .replace("{vendor_address}", replaceNullWithEmpty(vendor.vendor_address))
      .replace("{vendor_contact_num}", replaceNullWithEmpty(vendor.vendor_contact_num))
      .replace("{vendor_email}", replaceNullWithEmpty(vendor.vendor_email))
      .replace("{branch_name}", replaceNullWithEmpty(vendor.warehouse_name))
      .replace("{branch_address}", replaceNullWithEmpty(vendor.warehouse_address))
      .replace("{branch_contact_no}", replaceNullWithEmpty(vendor.contact_number))
      .replace("{branch_email}", replaceNullWithEmpty(vendor.employee_official_email))
      .replace('{serviceItemTable}', replaceNullWithEmpty(serviceItemTable))

    const pdfBuffer = await generatePDF(htmlWithData);
    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: vendor.vendor_email,
      bcc: "ajayem@yopmail.com",
      subject: "Purchase Order!",
      html: `<p>Hello, please find the attached Purchase Order.</p>`,
      attachments: [
        {
          filename: "Purchase_Order.pdf",
          content: pdfBuffer,
        },
      ],
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

module.exports.sendSOMail = async function (entity_id, name, to_email, so_number, itemHtml, deliveryAddress, deliveryDate) {
  try {
    const { transporter, fromEmail, entity_name } =
    await getTransporterBy_EntityId(entity_id);

    const mailOptions = {
      from: `${entity_name} <${fromEmail}>`,
      to: to_email,
      bcc: "ajayem@yopmail.com",
      subject: `SO - ${so_number}`,
      html: `Dear ${name},<br/><br/>
          We are pleased to inform you that your Sales Order ${so_number} has been successfully created.<br/><br/>
          <div style="font-family:Arial,sans-serif">
          <p>
            <strong>Sales Order No:</strong> ${so_number}
          </p>

          <table
            border="1"
            cellpadding="8"
            cellspacing="0"
            width="100%"
            style="border-collapse:collapse;"
          >
            <thead style="background:#00644d;color:#fff;">
              <tr>
                <th>Item Type</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Price/Unit</th>
              </tr>
            </thead>

            <tbody>
              ${itemHtml}
            </tbody>
          </table>
          <p>
            <strong>Delivery Address:</strong> ${deliveryAddress}
          </p>
          <p>
            <strong>Expected Delivery Date:</strong> ${deliveryDate}
          </p>
        </div><br/><br/>
          Regards,<br/>${entity_name}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to_email}:`, info.response);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email to ${to_email}:`, error); // log full error
    return { success: false, error };
  }
};