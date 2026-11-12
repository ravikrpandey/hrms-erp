
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const numberToWords = require('number-to-words');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER || 'hr@kiranautomation.com',
    pass: process.env.SMTP_PASS || ''
  },
  logger: true,
  debug: process.env.SMTP_DEBUG || false,
  tls: {
    rejectUnauthorized: false,
  },
});

const send = (mailOptions, otp) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response, otp);
        resolve(info);
      }
    });
  });
};


module.exports.sendPdfPo = async (
  result, allResult,
  res, urlData,additional_charges
) => {
  return serviceDataPo(
    result, allResult,
    res, urlData,additional_charges
  );
};

const serviceDataPo = async (
  result, allResult,
  res, urlData,additional_charges
) => {
  const browser = await puppeteer.launch({
    headless: true,  
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

  const htmlFilePath = path.resolve(__dirname, "../template/WAP.html");
  const html = fs.readFileSync(htmlFilePath, "utf-8");
  let serviceItemTable = "";
  if (allResult) {
    serviceItemTable = generateServiceItemTable(
      allResult,

    );
  }
  let addtionalCharges='';
  if(additional_charges.length>0){
    addtionalCharges = generateAdditionalCharges(additional_charges)
  }



  const replaceNullWithEmpty = (str) => str == null ? "" : str;
  let amount = allResult.reduce((sum, item) => sum + parseInt(item.amount), 0);



  let {
    subtotal,
    discountedPrice,
    totalDiscount,
    sgst,
    cgst,
    igst,
    grandTotal
  } = allResult.reduce((acc, item) => {
    let qty = parseFloat(item.quantity) || 0;
    let pricePerUnit = parseFloat(item.price_per_unit) || 0;
    let discountPercent = parseFloat(item.maximum_discount) || 0;
    let sgstPercentage = parseFloat(item.sgst) || 0;
    let cgstPercentage = parseFloat(item.cgst) || 0;
    let igstPercentage = parseFloat(item.igst) || 0;
    let additionalCharges = parseFloat(item.additionalChar) || 0;

    let totalPrice = qty * pricePerUnit;
    let discountAmount = (totalPrice * discountPercent) / 100;
    let discountedPrice = totalPrice - discountAmount;

    acc.subtotal += totalPrice;
    acc.discountedPrice += discountedPrice;
    acc.totalDiscount += discountAmount;

    let sgstAmount = (discountedPrice * sgstPercentage) / 100;
    let cgstAmount = (discountedPrice * cgstPercentage) / 100;
    let igstAmount = (discountedPrice * igstPercentage) / 100;

    acc.sgst += sgstAmount;
    acc.cgst += cgstAmount;
    acc.igst += igstAmount;

    let additionalSgstTax = (additionalCharges * sgstPercentage) / 100;
    let additionalCgstTax = (additionalCharges * cgstPercentage) / 100;
    let additionalIgstTax = (additionalCharges * igstPercentage) / 100;

    acc.sgst += additionalSgstTax + (parseFloat(addtionalCharges.totalGST) /2);
    acc.cgst += additionalCgstTax + (parseFloat(addtionalCharges.totalGST) /2);
    acc.igst += acc.igst ?additionalIgstTax + parseFloat(addtionalCharges.totalGST):0;

    acc.grandTotal = acc.discountedPrice + acc.sgst + acc.cgst + acc.igst + additionalCharges;
    if (addtionalCharges.totalAmount) {
      acc.grandTotal += parseFloat(addtionalCharges.totalAmount);
    }
    return acc;
  }, {
    subtotal: 0,
    discountedPrice: 0,
    totalDiscount: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    grandTotal: 0
  });

  // console.log('Subtotal:', subtotal.toFixed(2));
  // console.log('Discounted Price:', discountedPrice.toFixed(2));
  // console.log('Total Discount:', totalDiscount.toFixed(2));
  // console.log('SGST:', sgst.toFixed(2));
  // console.log('CGST:', cgst.toFixed(2)); 
  // console.log('IGST:', igst.toFixed(2)); 
  // console.log('Grand Total:', grandTotal.toFixed(2));

  const numberToWords = require('number-to-words');
  function convertToWords(number) {
    let integerPart = Math.floor(number);
    let decimalPart = number % 1;
    let words = numberToWords.toWords(integerPart);
    if (decimalPart > 0) {
      let decimalString = decimalPart.toFixed(2).split('.')[1];
      words += " Point " + numberToWords.toWords(parseInt(decimalString, 10));
    }
    words = words.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return words;
  }

  let amountInWords = convertToWords(grandTotal);
  let cgstRow = '';
  let sgstRow = '';
  let igstRow = '';
  function hideRowIfZero(html, value, rowId) {
    if (value === 0) {
      // If the value is zero, add the style display: none to the row with the specified ID
      return html.replace(
        `<tr id="${rowId}">`,
        `<tr id="${rowId}" style="display: none;">`
      );
    }
    return html;
  }
  if (cgst !== 0) {
  
    cgstRow += `<tr><td style="padding: 5px 5px 0px 0px; text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span style="font-size: 15px; font-weight: 600; color:#000; margin-bottom: 5px;">CGST</span>
                  </td>
                  <td style="padding: 5px 5px 0px 0px;text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span>${cgst.toFixed(2)}&nbsp;</span>
                  </td></tr>`;
  }

  if (sgst !== 0) {
   
    sgstRow += `<tr><td style="padding: 5px 5px 0px 0px; text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span style="font-size: 15px; font-weight: 600; color:#000; margin-bottom: 5px;">SGST</span>
                  </td>
                  <td style="padding: 5px 5px 0px 0px;text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span>${sgst.toFixed(2)}&nbsp;</span>
                  </td></tr>`;
  }

  if (igst !== 0) {
 
    igstRow += `<tr><td style="padding: 5px 5px 0px 0px; text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span style="font-size: 15px; font-weight: 600; color:#000; margin-bottom: 5px;">IGST</span>
                  </td>
                  <td style="padding: 5px 5px 0px 0px;text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span>${igst.toFixed(2)}&nbsp;</span>
                  </td></tr>`;
  }

  let htmlWithData = html
    .replace('{entity_name}', replaceNullWithEmpty(result[0].entity_name))
    .replace('{registered_office}', replaceNullWithEmpty(result[0].registered_office))
    .replace('{smtp_username}', replaceNullWithEmpty(result[0].smtp_username))
    .replace('{urlData}', replaceNullWithEmpty(urlData))
    .replace('{logo}', replaceNullWithEmpty(result[0].logo))
    .replace('{billing_branch}', replaceNullWithEmpty(result[0].branch_name))

    .replace('{proposal_no}', replaceNullWithEmpty(result[0].proposal_no))
    .replace('{do_date}', replaceNullWithEmpty(result[0].do_date))
    .replace('{order_number}', replaceNullWithEmpty(result[0].do_no))

    .replace('{countryss_name}', replaceNullWithEmpty(result[0].countryss_name))
    .replace('{states_name}', replaceNullWithEmpty(result[0].states_name))
    .replace('{city_name}', replaceNullWithEmpty(result[0].city_name))
    .replace('{customer_billing_add1}', replaceNullWithEmpty(result[0].customer_billing_add1))
    .replace('{customer_billing_add2}', replaceNullWithEmpty(result[0].customer_billing_add2))
    .replace('{customer_billing_pin}', replaceNullWithEmpty(result[0].customer_billing_pin))

    .replace('{shipping_country_name}', replaceNullWithEmpty(result[0].shipping_country_name))
    .replace('{shipping_state_name}', replaceNullWithEmpty(result[0].shipping_state_name))
    .replace('{shipping_city_name}', replaceNullWithEmpty(result[0].shipping_city_name))
    .replace('{shipping_add1}', replaceNullWithEmpty(result[0].shipping_add1))
    .replace('{shipping_address}', replaceNullWithEmpty(result[0].shipping_add2))
    .replace('{shipping_pin}', replaceNullWithEmpty(result[0].shipping_pin))
    .replace('{serviceItemTable}', replaceNullWithEmpty(serviceItemTable))
    .replace('{addtionalCharges}', replaceNullWithEmpty(addtionalCharges.html))
    .replace('{amountInWords}', replaceNullWithEmpty(amountInWords))
    .replace('{notes}', replaceNullWithEmpty(result[0].notes))
    .replace('{hsn_sac_code}', replaceNullWithEmpty(result[0].hsn_sac_code))
    .replace('{terms_and_conditions}', replaceNullWithEmpty(result[0].terms_and_conditions))

    .replace('{sub_total}', replaceNullWithEmpty(subtotal.toFixed(2)))
    .replace('{total_discount}', replaceNullWithEmpty(totalDiscount.toFixed(2)))
    .replace('{additional_charges}', replaceNullWithEmpty(result[0].additional_charges))
    .replace('{cgst_row}', cgstRow)
    .replace('{sgst_row}', sgstRow)
    .replace('{igst_row}', igstRow)
    .replace('{grand_total}', replaceNullWithEmpty( grandTotal.toFixed(2)))
  // htmlWithData = hideRowIfZero(htmlWithData, cgst, 'row_cgst');
  // htmlWithData = hideRowIfZero(htmlWithData, sgst, 'row_sgst');
  // htmlWithData = hideRowIfZero(htmlWithData, igst, 'row_igst');
  // htmlWithData = htmlWithData.replace('{cgst_row}', cgstRow);
  // htmlWithData = htmlWithData.replace('{sgst_row}', sgstRow);
  // htmlWithData = htmlWithData.replace('{igst_row}', igstRow);

  // Insert the grand total row with its dynamic value
  await page.setContent(htmlWithData);
  const pdfBuffer = await page.pdf();
  await browser.close();

  const pdfFileName = `delivery_note_invoice_${new Date().toISOString().replace(/:/g, '-')}.pdf`;
  const folderPath = path.join(__dirname, 'Delivery_note_doc');

  try {
    fs.mkdirSync(folderPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  const fileName = path.basename(pdfFileName);
  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, pdfBuffer);

  return fileName;

}




function generateServiceItemTable(allResult) {
  let tableHTML = "";

  if (allResult && allResult.length > 0) {


    allResult.forEach((item, index) => {
      tableHTML += `
          <table style="width:100%;margin: 0;border-left:0pt;border-right:0pt; border-color:#1C0808 !important;"
    cellspacing="0" border="1">
                  <tr>
                      <th>S.NO</th>
                      <th>Product Name</th>
                      <th>Product Code</th>
                     
                      <th>UOM</th>
                      <th>Quantity</th>
                      <th>HSN Code</th>
                      <th>Rate</th>
                      ${((Number(item.cgst) || 0) > 0) ? '<th>CGST %</th>' : ''}
                      ${((Number(item.sgst) || 0) > 0) ? '<th>SGST %</th>' : ''}
                      ${((Number(item.igst) || 0) > 0) ? '<th>IGST %</th>' : ''}
                  </tr>
                  <tr>
                  <td>${index + 1}</td>
                  <td>${item.product_name ?? ""}</td>
                  <td>${item.product_code ?? ""}</td>
                 
                  
                  <td>${item.uom_name ?? ""}</td>
                  <td>${item.quantity ?? ""}</td>
                  <td>${item.hsn_sac_code ?? ""}</td>
                  <td>${(Number(item.price_per_unit) || 0).toFixed(2)}</td>
                  ${((Number(item.cgst) || 0) > 0) ? `<td>${(Number(item.cgst) || 0).toFixed(2)}</td>` : ''}
                ${((Number(item.sgst) || 0) > 0) ? `<td>${(Number(item.sgst) || 0).toFixed(2)}</td>` : ''}
                ${((Number(item.igst) || 0) > 0) ? `<td>${(Number(item.igst) || 0).toFixed(2)}</td>` : ''}
                  </tr>`;
    });

    tableHTML += `</table><br><br>`;
  }


  return tableHTML;
}
function generateAdditionalCharges(charges) {
  let tableHTML = "";
  let totalGST = 0;
  let totalAmount = 0;

  if (charges && charges.length > 0) {
    tableHTML += `
      <table style="width:100%;margin: 0;border-left:0pt;border-right:0pt; border-color:#1C0808 !important;"
    cellspacing="0" border="1">
        <thead>
          <tr>
            <th colspan="7" style="text-align: center; background-color: #f2f2f2;">Additional Charges Details</th>
          </tr>
          <tr>
            <th>S.NO</th>
            <th>Service Name</th>
            <th>Description</th>
            <th>HSN Code</th>
            <th>Amount</th>
            <th>Rate (%)</th>
            
          </tr>
        </thead>
        <tbody>
    `;

    charges.forEach((item, index) => {
      const amount = parseFloat(item.amount) || 0;
      const rate = parseFloat(item.tax_rate) || 0;
      const gstAmount = (amount * rate) / 100;

      totalGST += gstAmount;
      totalAmount += amount + gstAmount;

      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.charge_name ?? ""}</td>
          <td>${item.description ?? ""}</td>
          <td>${item.MASTER_HSN_SAC_CODE?.hsn_sac_code ?? ""}</td>
          <td>${amount.toFixed(2)}</td>
          <td>${rate.toFixed(2)}</td>
       
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table><br><br>
    `;
  }

  return {
    html: tableHTML,
    totalGST: totalGST.toFixed(2),
    totalAmount: totalAmount.toFixed(2)
  };
}





module.exports.download = async (req, res) => {
  const filename = req.params.fileName;
  let folderPath = "";

  if (filename) {
    folderPath = path.resolve(__dirname, "Delivery_note_doc", filename);
  } else {
    return res.status(400).send({ code: 400, message: "Invalid file type." });
  }

  if (fs.existsSync(folderPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
    res.sendFile(folderPath, (err) => {
      if (err) {
        res.status(500).send({ code: 500, message: "Failed to send file." });
      }
    });
  } else {
    return res.status(404).send({ code: 404, message: "File not found." });
  }
};

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

module.exports.sendPdfMail = async (
  subject, message, to_email, cc_email, bcc_email, attach_file, result, allResult
) => {
  return servicePdfMail(
    subject, message, to_email, cc_email, bcc_email, attach_file, result, allResult
  );
};

const servicePdfMail = async (
  subject, message, to_email, cc_email, bcc_email, attach_file, result, allResult
) => {

  const htmlFilePath = path.resolve(__dirname, "../template/WAP.html");
  const html = fs.readFileSync(htmlFilePath, "utf-8");
  let serviceItemTable = "";
  if (allResult) {
    serviceItemTable = generateServiceItemTable(
      allResult
    );
  }
  
  let {
    subtotal,
    discountedPrice,
    totalDiscount,
    sgst,
    cgst,
    igst,
    grandTotal
  } = allResult.reduce((acc, item) => {
    let qty = parseFloat(item.quantity) || 0;
    let pricePerUnit = parseFloat(item.price_per_unit) || 0;
    let discountPercent = parseFloat(item.maximum_discount) || 0;
    let sgstPercentage = parseFloat(item.sgst) || 0;
    let cgstPercentage = parseFloat(item.cgst) || 0;
    let igstPercentage = parseFloat(item.igst) || 0;
    let additionalCharges = parseFloat(item.additionalChar) || 0;

    let totalPrice = qty * pricePerUnit;
    let discountAmount = (totalPrice * discountPercent) / 100;
    let discountedPrice = totalPrice - discountAmount;

    acc.subtotal += totalPrice;
    acc.discountedPrice += discountedPrice;
    acc.totalDiscount += discountAmount;

    let sgstAmount = (discountedPrice * sgstPercentage) / 100;
    let cgstAmount = (discountedPrice * cgstPercentage) / 100;
    let igstAmount = (discountedPrice * igstPercentage) / 100;

    acc.sgst += sgstAmount;
    acc.cgst += cgstAmount;
    acc.igst += igstAmount;

    let additionalSgstTax = (additionalCharges * sgstPercentage) / 100;
    let additionalCgstTax = (additionalCharges * cgstPercentage) / 100;
    let additionalIgstTax = (additionalCharges * igstPercentage) / 100;

    acc.sgst += additionalSgstTax;
    acc.cgst += additionalCgstTax;
    acc.igst += additionalIgstTax;



    acc.grandTotal = acc.discountedPrice + acc.sgst + acc.cgst + acc.igst + additionalCharges;

    return acc;
  }, {
    subtotal: 0,
    discountedPrice: 0,
    totalDiscount: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    grandTotal: 0
  });


  const replaceNullWithEmpty = (str) => str == null ? "" : str;
  let amount = allResult.reduce((sum, item) => sum + parseInt(item.amount), 0);
   sgst = allResult.reduce((sum, item) => sum + parseInt(item.sgst), 0);
   cgst = allResult.reduce((sum, item) => sum + parseInt(item.cgst), 0);
  // let discount = allResult.reduce((sum, item) => sum + parseInt(item.discount_amount), 0);
  let amountInWords = numberToWords.toWords(amount);
  let total_amount = allResult.reduce((sum, item) => sum + parseInt(item.amount), 0);

  // let amountInWords = convertToWords(grandTotal);
  let cgstRow = '';
  let sgstRow = '';
  let igstRow = '';
  if (cgst !== 0) {
    cgstRow += `<tr><td style="padding: 5px 5px 0px 0px; text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span style="font-size: 15px; font-weight: 600; color:#000; margin-bottom: 5px;">CGST</span>
                  </td>
                  <td style="padding: 5px 5px 0px 0px;text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span>${cgst.toFixed(2)}&nbsp;</span>
                  </td></tr>`;
  }

  if (sgst !== 0) {
    sgstRow += `<tr><td style="padding: 5px 5px 0px 0px; text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span style="font-size: 15px; font-weight: 600; color:#000; margin-bottom: 5px;">SGST</span>
                  </td>
                  <td style="padding: 5px 5px 0px 0px;text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span>${sgst.toFixed(2)}&nbsp;</span>
                  </td></tr>`;
  }

  if (igst !== 0) {
    igstRow += `<tr><td style="padding: 5px 5px 0px 0px; text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span style="font-size: 15px; font-weight: 600; color:#000; margin-bottom: 5px;">IGST</span>
                  </td>
                  <td style="padding: 5px 5px 0px 0px;text-align: right;border-color:#1C0808 !important;" valign="top">
                     <span>${igst.toFixed(2)}&nbsp;</span>
                  </td></tr>`;
  }

  const htmlWithData = html
  .replace('{entity_name}', replaceNullWithEmpty(result[0].entity_name))
  .replace('{registered_office}', replaceNullWithEmpty(result[0].registered_office))
  .replace('{smtp_username}', replaceNullWithEmpty(result[0].smtp_username))
  // .replace('{urlData}', replaceNullWithEmpty(urlData))
  .replace('{logo}', replaceNullWithEmpty(result[0].logo))
  .replace('{billing_branch}', replaceNullWithEmpty(result[0].branch_name))

  .replace('{proposal_no}', replaceNullWithEmpty(result[0].proposal_no))
  .replace('{do_date}', replaceNullWithEmpty(result[0].do_date))
  .replace('{order_number}', replaceNullWithEmpty(result[0].do_no))

  .replace('{countryss_name}', replaceNullWithEmpty(result[0].countryss_name))
  .replace('{states_name}', replaceNullWithEmpty(result[0].states_name))
  .replace('{city_name}', replaceNullWithEmpty(result[0].city_name))
  .replace('{customer_billing_add1}', replaceNullWithEmpty(result[0].customer_billing_add1))
  .replace('{customer_billing_add2}', replaceNullWithEmpty(result[0].customer_billing_add2))
  .replace('{customer_billing_pin}', replaceNullWithEmpty(result[0].customer_billing_pin))

  .replace('{shipping_country_name}', replaceNullWithEmpty(result[0].shipping_country_name))
  .replace('{shipping_state_name}', replaceNullWithEmpty(result[0].shipping_state_name))
  .replace('{shipping_city_name}', replaceNullWithEmpty(result[0].shipping_city_name))
  .replace('{shipping_add1}', replaceNullWithEmpty(result[0].shipping_add1))
  .replace('{shipping_address}', replaceNullWithEmpty(result[0].shipping_add2))
  .replace('{shipping_pin}', replaceNullWithEmpty(result[0].shipping_pin))
  .replace('{serviceItemTable}', replaceNullWithEmpty(serviceItemTable))
  .replace('{amountInWords}', replaceNullWithEmpty(amountInWords))
  .replace('{notes}', replaceNullWithEmpty(result[0].notes))
  .replace('{hsn_sac_code}', replaceNullWithEmpty(result[0].hsn_sac_code))
  .replace('{terms_and_conditions}', replaceNullWithEmpty(result[0].terms_and_conditions))

  .replace('{sub_total}', replaceNullWithEmpty(subtotal.toFixed(2)))
  .replace('{total_discount}', replaceNullWithEmpty(totalDiscount.toFixed(2)))
  .replace('{additional_charges}', replaceNullWithEmpty(result[0].additional_charges))
  .replace('{cgst_row}', cgstRow)
  .replace('{sgst_row}', sgstRow)
  .replace('{igst_row}', igstRow)
  .replace('{grand_total}', replaceNullWithEmpty(grandTotal.toFixed(2)))
  const pdfBuffer = await generatePDF(htmlWithData);

  const mailOptions = {
    from: `"System Admin" <${process.env.SMTP_USER || "hr@kiranautomation.com"}>`,
    to: to_email,
    cc: cc_email,
    bcc: bcc_email,
    subject: subject,
    html: message,
    attachments: [
      {
        filename: "sales order.pdf",
        content: pdfBuffer,
      },
    ],
  };
  if (attach_file) {
    const attachmentPath = path.join("app/CRM/CRMDocument/upload", attach_file);
    const attachmentContent = fs.readFileSync(attachmentPath);
    mailOptions.attachments.push({
      filename: path.basename(attach_file),
      content: attachmentContent,
      cid: "attachedImage",
    });
  }
  let response = await send(mailOptions, to_email);
  return response;
};



