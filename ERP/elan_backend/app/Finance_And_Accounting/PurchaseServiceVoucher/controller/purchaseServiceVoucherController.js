const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const db = require('../../../models/index')

module.exports.createPurchaseService = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {document_number,posting_date,Account_details,voucher_id,transaction_date,notes,reference_number,purchase_value,additional_charges,
      bill_amount,total_tds,branch_id,vendor_id,entity_id,gross_total,grn_id,invoice_id,tds_id,nature_id,total_gst_amount,financial_id,
      rcm_liability ,cgst ,sgst ,igst,billing_id,grand_total,gst_total,gstTotal,gross,net,tdsAmt,rcmLiability,less_amt,currency_id,taxable_value} = req.body;

      const currencyExist = await db.currency_convert.findOne({where:{Currency_Convert_id:currency_id},attributes:['Currency_Convert_id','rate'],transaction})
    const party_type = 'VENDOR';
   
    const VendorExist = await db.vendor_basic_details.findOne({
      where: { id: vendor_id },
      attributes: ['id','rcm_charge'],
      transaction
    });
  
    const createPurchaseJournal = await db.purchaseServiceVoucher.create({
      document_number,posting_date,transaction_date,notes,taxable:taxable_value,
      reference_number,purchase_value,additional_charges,bill_amount:grand_total,total_tds_amount:total_tds,party_type,branch_id,vendor_id,
      cgst,sgst,igst,gstTotal:gst_total,gross:gross_total,net:grand_total,tdsAmt:total_tds,rcmLiability:rcm_liability,currency_id,   currency_rate:currencyExist?.rate,
      entity_id,voucher_list_id: voucher_id,document_type: 'Purchase Service Voucher',less_amt,billing_id,igst,
      grn_id,invoice_id,tds_id,nature_id}, { transaction });


   

    for (const item of Account_details) {
      const {service_id,service_code,rate,tax,gst_amount,cost_center_id,profit_center_id,tds_rate_amount,final_amount,remarks
      } = item;
    

      await db.purchaseServiceVoucherAccount.create({
        purchase_service_voucher_id: createPurchaseJournal.id,service_id,service_code,rate,tax,gst_amount,cost_center_id,profit_center_id,tds_rate_amount,final_amount,remarks
      }, { transaction });
      const serviceExist = await db.Service_master.findOne({where:{service_id},attributes:['service_id','chart_of_account_id'],transaction})
      await db.financial_And_Account_Journal_List.create({
        debit_amount: (rate),
        credit_amount: 0.00,
        branch_id,
        chart_account_id: serviceExist?.chart_of_account_id,
        entity_id,financial_id,
        currency_id:currency_id,
        currency_rate:currencyExist?.rate,
        entry_status: 'Purchase Service Voucher',
        document_number,billing_id
      }, { transaction });

    }

  if(VendorExist.rcm_charge){
 if (cgst > 0 && sgst > 0) {
        const divideGST = (gst_total) / 2;
        await db.financial_And_Account_Journal_List.create({
          debit_amount: divideGST,
          credit_amount: 0.00,
          chart_account_id: 404,
          entity_id,financial_id,
          branch_id,
          cgst:(cgst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,
          billing_id
        }, { transaction });

        await db.financial_And_Account_Journal_List.create({
          debit_amount: divideGST,
          credit_amount: 0.00,
          chart_account_id: 405,
          entity_id,financial_id,
          branch_id,
          sgst:(sgst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,
          billing_id
        }, { transaction });

 await db.financial_And_Account_Journal_List.create({
          debit_amount: 0.00,
          credit_amount: divideGST,
          chart_account_id: 401,
          entity_id,financial_id,
          branch_id,
          cgst:(cgst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,
          billing_id
        }, { transaction });

        await db.financial_And_Account_Journal_List.create({
          debit_amount: 0.00,
          credit_amount: divideGST,
          chart_account_id: 402,
          entity_id,financial_id,
          branch_id,
          sgst:(sgst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,
          billing_id
        }, { transaction });
      } else {
        await db.financial_And_Account_Journal_List.create({
          debit_amount: (gst_total),
          credit_amount: 0.00,
          chart_account_id: 403,
          entity_id,financial_id,
          branch_id,
          igst:(igst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,
          billing_id
        }, { transaction });

       await db.financial_And_Account_Journal_List.create({
          debit_amount: 0.00,
          credit_amount: (gst_total),
          chart_account_id: 400,
          entity_id,financial_id,
          branch_id,
          igst:(igst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,billing_id
        }, { transaction });
      }
  }else{
      if (gst_total > 0) {
      if ((cgst > 0 && sgst > 0) ) {
        const divideGST = (gst_total) / 2;
        await db.financial_And_Account_Journal_List.create({
          debit_amount: divideGST,
          credit_amount: 0.00,
          chart_account_id: 21,
          entity_id,financial_id,
          branch_id,
          cgst:(cgst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,billing_id
        }, { transaction });

        await db.financial_And_Account_Journal_List.create({
          debit_amount: divideGST,
          credit_amount: 0.00,
          chart_account_id: 41,
          entity_id,financial_id,
          branch_id, 
          sgst:(sgst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucher',
          document_number,vendor_id,billing_id
        }, { transaction });

      } else {
        await db.financial_And_Account_Journal_List.create({
          debit_amount: (gst_total),
          credit_amount: 0.00,
          chart_account_id: 29,
          entity_id,financial_id,
          branch_id,
          igst:(igst),
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'Purchase Service Voucherl',
          document_number,vendor_id,billing_id
        }, { transaction });

      }

    }

  }
 
    if (total_tds > 0) {

      await db.financial_And_Account_Journal_List.create({
        debit_amount: 0.00,
        credit_amount: (total_tds),
        tds_rate_amount: (total_tds),
        tds_id,
        nature_id,financial_id,
        chart_account_id: 45,
        entity_id,
        branch_id,
        currency_id:currency_id,
        currency_rate:currencyExist?.rate,
        entry_status: 'Purchase Service Voucher',
        document_number,
        billing_id
      }, { transaction });

    }
 
    await db.financial_And_Account_Journal_List.create({
      debit_amount: 0.00,
      credit_amount: (grand_total),
      chart_account_id: 51,
      entity_id,
      vendor_id,
      branch_id,
      financial_id,
      currency_id:currency_id,
      currency_rate:currencyExist?.rate,
      entry_status: 'Purchase Service Voucher',
      document_number,
      party_type:'VENDOR',
      billing_id
    }, { transaction });

    if(parseInt(less_amt) > 0){
      await db.financial_And_Account_Journal_List.create({
        debit_amount: (less_amt),
        credit_amount: 0.00,
        chart_account_id: 51,
        entity_id,
        vendor_id,
        branch_id,
        financial_id,
        currency_id:currency_id,
        currency_rate:currencyExist?.rate,
        entry_status: 'DEBIT NOTE',
        document_number,
        party_type:'VENDOR',
        billing_id
      }, { transaction });
      const debitNote = await db.creditDebitNote.create({
        amount:(less_amt), builder_date:posting_date, document_number, note_type:'DEBIT NOTE', vendor_id,
        entity_id,purchase_service_voucher_id: createPurchaseJournal.id,currency_id:currency_id,
        currency_rate:currencyExist?.rate,
     },{transaction})
      const perRowAmount = parseFloat((less_amt) / Account_details.length)
      for (const item of Account_details) {
        const {service_id,
        } = item;
        const serviceExist = await db.Service_master.findOne({where:{service_id},attributes:['service_id','chart_of_account_id'],transaction})
        await db.financial_And_Account_Journal_List.create({
          debit_amount: 0.00,
          credit_amount: perRowAmount,
          chart_account_id: serviceExist?.chart_of_account_id,
          entity_id,
          branch_id,
          financial_id,
          currency_id:currency_id,
          currency_rate:currencyExist?.rate,
          entry_status: 'DEBIT NOTE',
          document_number,billing_id
        }, { transaction });
        await db.creditDebitNoteItem.create({
          credit_debit_note_id:debitNote.id,  total_with_gst:(less_amt), total_discount_amount:(less_amt), total_price:(less_amt), service_id
        },{transaction})
      }
      
    }
    

    const createData = await db.paymentProgram.create({
      amount: (grand_total),
      reference_number: document_number,
      document_type: 'Purchase Service Voucher',
      entity_id,financial_id,
      document_number: document_number,
      payment_status: 'Purchase Service Voucher' ,
      payment_program_status:'Approved'
    }, { transaction });
  
    await db.paymentProgramList.create({
      vendor_id,
      purchase_service_voucher_id: createPurchaseJournal.id,
      amount_due: (grand_total),
      paid_amount: 0,
      total_amount: (grand_total),
      tds_id,nature_id,tds_rate_amount:total_tds,
      payment_program_id: createData.id,
      currency_id:currency_id,
      currency_rate:currencyExist?.rate,
    }, { transaction });
   
    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: 'Purchase Journal Created Successfully'
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message
    });

  }

};

module.exports.getPurchaseServiceList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
        const [finalValue] = await db.sequelize.query(
            `SELECT P.* ,MB.branch_name,V.vendor_name
            FROM PURCHASE_SERVICE_VOUCHER AS P
            INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
            LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id =P.vendor_id
            WHERE P.entity_id=${entity_id} ORDER BY P.id DESC`
        )
       
        if(finalValue){
            return res.status(200).send({code:200,message:'success',data:finalValue})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:finalValue})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message   })
    }
}


module.exports.generatePurchaseServiceNumber = async (req, res) => {
  try {
   
    const {branch_id,voucher_id} = req.body
    const branchExist = await db.tbl_branch.findOne({where:{id:branch_id},attributes:['id','branch_name']})
    const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();
    const voucherMainListExist = await db.voucherMainList.findOne({where:{id:voucher_id},attributes:['id','series','voucher_main_id','voucher_name']})
    const voucherMainExist = await db.voucherMain.findOne({where:{id:voucherMainListExist.voucher_main_id},attributes:['id','name']})
    const voucherPrefixed = voucherMainExist.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const voucherPrefixedMainList = voucherMainListExist.voucher_name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const lastEntry = await db.purchaseServiceVoucher.findOne({
      order: [["id", "DESC"]],
      attributes: ['id',"document_number"],
    });
  
      let number;
      const currentYear = new Date().getFullYear();
      if (lastEntry) {
        const newCode = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-${lastEntry?.id+1}`;
        number = newCode;
        
      } else {
        number = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-00001`;
        
      }
    return res.status(200).send({ code: 200, message: "Code Generated", data: number });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

module.exports.purchaseServiceById = async(req,res) =>{
try {

    const { id } = req.query;

    const [purchaseData] = await db.sequelize.query(`
      SELECT  PJ.*,VBD.rcm_charge FROM 
      PURCHASE_SERVICE_VOUCHER AS PJ
    INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON PJ.vendor_id = VBD.id
    WHERE PJ.id = ${id}
      `)
    const [purchaseJournalList] = await db.sequelize.query(`
   SELECT PJA.*,M.igst AS gst_amount
    FROM PURCHASE_SERVICE_ACCOUNT_LIST AS PJA
    INNER JOIN MASTER_SERVICE AS M ON M.service_id = PJA.service_id
      WHERE PJA.purchase_service_voucher_id = ${id}
      `)
     

    let obj = {
        ...purchaseData[0],
        account_list: purchaseJournalList
    };

    return res.status(200).send({
        code: 200,
        message: "Fetched Data",
        data: obj
    });

} catch (error) {

    return res.status(500).send({
        code: 500,
        message: error.message || "Internal Server Error"
    });

}
}

 
module.exports.getVendorBillingList = async(req,res)=>{
  try {
    const {entity_id} = req.query;
    const [dataList] = await db.sequelize.query(`
      SELECT V.id,VB.vendor_id,  CONCAT(V.vendor_name, ' - ', S.states_name) AS vendor_name,VB.billing_state_id,V.rcm_charge
FROM VENDOR_BASIC_DETAILS AS V
INNER JOIN VENDOR_BILLING_ADDRESS AS VB ON VB.vendor_id = V.id
LEFT JOIN MASTER_STATE AS S ON S.states_id=VB.billing_state_id
WHERE V.entity_id=${entity_id}`)

if(dataList.length >0){
  return res.status(200).send({code:200,message:'Success',data:dataList})
}else{
  return res.status(404).send({code:404,message:'Data Not Found',data:[]})
}

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
  });
  }
}






function getChromePath() {
  const commonPaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    process.env.LOCALAPPDATA ? process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe" : "",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const chromePath of commonPaths) {
    if (chromePath && fs.existsSync(chromePath)) return chromePath;
  }
  return null;
}

const replaceNull = (value) => {
  if (value === null || value === undefined || value === "null" || value === "undefined") return "";
  return String(value);
};

const num = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const money = (value) => {
  return num(value).toFixed(2);
};

const dateIN = (value) => {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return replaceNull(value);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch (error) {
    return replaceNull(value);
  }
};

const dateTimeIN = (value) => {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return replaceNull(value);
    return date.toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return replaceNull(value);
  }
};

const pick = (obj, fields, fallback = "") => {
  for (const field of fields) {
    if (obj && obj[field] !== undefined && obj[field] !== null && obj[field] !== "" && obj[field] !== "null") {
      return obj[field];
    }
  }
  return fallback;
};

const escapeHtml = (value) => {
  return replaceNull(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

function numberToWordsIndian(number) {
  number = Math.round(num(number));
  if (number === 0) return "Zero Rupees Only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function twoDigits(n) { if (n < 20) return ones[n]; return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : ""); }
  function threeDigits(n) { if (n < 100) return twoDigits(n); return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + twoDigits(n % 100) : ""); }
  let result = "";
  const crore = Math.floor(number / 10000000);
  number %= 10000000;
  const lakh = Math.floor(number / 100000);
  number %= 100000;
  const thousand = Math.floor(number / 1000);
  number %= 1000;
  const hundred = number;
  if (crore) result += threeDigits(crore) + " Crore ";
  if (lakh) result += twoDigits(lakh) + " Lakh ";
  if (thousand) result += twoDigits(thousand) + " Thousand ";
  if (hundred) result += threeDigits(hundred);
  return result.trim() + " Rupees Only";
}

async function getPurchaseServiceVoucherData(id) {
  try {
    // FINAL QUERY (Aapki di gayi query)
    const mainQuery = `
      SELECT 
        PSV.*,
        EM.entity_name,
        EM.tax_registration_number as gstin,
        EM.registered_office,
        EM.logo,
        BR.branch_name,
        VD.vendor_name,
        NAT.nature_of_transaction as nature_name,
        
        -- Billing Address Details
        VBA.billing_address,
        VBA.billing_postal_address,
        VBA.billing_pin_code,
        VBA.gst_in as vendor_gstin,
        VBA.gst_category,
        BS.states_name as billing_state_name,
        BC.city_name as billing_city_name,
        
        -- Shipping Address Details
        VSA.shipping_address,
        VSA.shipping_postal_address,
        VSA.shipping_pin_code,
        VSA.gst_in as shipping_gstin,
        VSA.gst_category,
        SS.states_name as shipping_state_name,
        SC.city_name as shipping_city_name
      FROM PURCHASE_SERVICE_VOUCHER AS PSV
      INNER JOIN ENTITY_MASTER AS EM ON PSV.entity_id = EM.id
      INNER JOIN MASTER_BRANCH AS BR ON PSV.branch_id = BR.id
      INNER JOIN VENDOR_BASIC_DETAILS AS VD ON PSV.vendor_id = VD.id
      INNER JOIN TDS_LIST_MST AS NAT ON PSV.nature_id = NAT.id

      LEFT JOIN VENDOR_BILLING_ADDRESS AS VBA ON PSV.vendor_id = VBA.vendor_id AND VBA.status = 'ACTIVE'
      LEFT JOIN MASTER_STATE AS BS ON VBA.billing_state_id = BS.states_id
      LEFT JOIN MASTER_CITY AS BC ON VBA.billing_city_id = BC.city_id

      LEFT JOIN VENDOR_SHIPPING_ADDRESS_MST AS VSA ON PSV.vendor_id = VSA.vendor_id AND VSA.status = 'ACTIVE'
      LEFT JOIN MASTER_STATE AS SS ON VSA.shipping_state_id = SS.states_id
      LEFT JOIN MASTER_CITY AS SC ON VSA.shipping_city_id = SC.city_id

      WHERE PSV.id = :id AND PSV.isDeleted = '0';
    `;
    
    const mainData = await db.sequelize.query(mainQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!mainData || mainData.length === 0) {
      throw new Error("Purchase Service Voucher not found");
    }

    const voucher = mainData[0];

    const accountsQuery = `
      SELECT
        PSAL.*,
        AM.service_name
      FROM PURCHASE_SERVICE_ACCOUNT_LIST AS PSAL
      LEFT JOIN MASTER_SERVICE AS AM ON PSAL.service_id = AM.service_id
      WHERE PSAL.purchase_service_voucher_id = :id
      ORDER BY PSAL.id ASC
    `;

    const accounts = await db.sequelize.query(accountsQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return { voucher, accounts: accounts || [] };
  } catch (error) {
    console.error("Error fetching purchase service voucher:", error);
    throw error;
  }
}

module.exports.generatePurchaseServiceVoucherPDF = async (req, res) => {
  let browser = null;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ code: 400, success: false, message: "Voucher ID is required" });
    }

    let voucherData;
    try {
      voucherData = await getPurchaseServiceVoucherData(id);
    } catch (dbError) {
      return res.status(404).json({ code: 404, success: false, message: "Voucher not found", error: dbError.message });
    }

    const { voucher, accounts } = voucherData;

    // Company Details
    const companyName = pick(voucher, ["entity_name", "company_name"], "");
    const gstin = pick(voucher, ["gstin", "tax_registration_number"], "");
    const registeredOffice = pick(voucher, ["registered_office", "registeredOffice", "address"], "");
    const companyPin = pick(voucher, ["company_pin", "pin_code", "pincode", "postal_code", "pin"], "");
    const companyTagline = pick(voucher, ["company_tagline", "tagline"], "");
    const unitNo = pick(voucher, ["unit_no", "unitNo", "unit_number"], "");
    const floor = pick(voucher, ["floor", "floor_no", "floor_number"], "");

    // Invoice Details
    const invoiceNumber = pick(voucher, ["document_number", "invoice_number", "voucher_number", "reference_number"], "");
    const invoiceDateValue = pick(voucher, ["invoice_date", "posting_date", "document_date", "voucher_date"], "");
    const invoiceDate = dateIN(invoiceDateValue);
    const dueDate = dateIN(pick(voucher, ["due_date", "payment_due_date"], ""));
    const placeOfSupply = pick(voucher, ["place_of_supply", "placeOfSupply", "supply_place", "state_name"], "");
    const supplyDateTime = dateTimeIN(pick(voucher, ["supply_date_time", "date_time_of_supply", "supply_datetime", "posting_date"], ""));
    const referenceNumber = pick(voucher, ["reference_number", "doc_ref_no", "document_reference_number"], "");
    const referenceDate = dateIN(pick(voucher, ["reference_date", "doc_ref_date", "document_reference_date"], ""));

    // Transporter (Vendor Name)
    const transporterName = pick(voucher, ["transporter_name", "transporterName", "vendor_name"], "");
    const transporterDocNo = pick(voucher, ["transporter_doc_no", "transporter_document_no", "transporterDocNo"], "");
    const reverseCharge = pick(voucher, ["reverse_charge", "rcmLiability", "rcm_liability", "is_reverse_charge"], "");

    // Billing Details (From Query)
    const billingPartyName = pick(voucher, ["billing_party_name", "billingPartyName", "bill_to_name", "billing_name", "vendor_name"], voucher.vendor_name);
    const billingAddress = pick(voucher, ["billing_address", "billing_postal_address", "billingAddress", "bill_to_address", "vendor_address"], "");
    const billingState = pick(voucher, ["billing_state_name", "billing_state", "billingState", "bill_to_state"], "");
    const billingStateCode = pick(voucher, ["billing_state_code", "billingStateCode", "bill_to_state_code", "state_code"], "");
    const billingGstin = pick(voucher, ["vendor_gstin", "billing_gstin", "billingGstin", "bill_to_gstin", "vendor_tax_number"], "");
    const billingCity = pick(voucher, ["billing_city_name", "billing_city"], "");

    // Shipping Details (From Query)
    const shippingPartyName = pick(voucher, ["shipping_party_name", "shippingPartyName", "ship_to_name", "consignee", "consignee_name", "shipping_name"], billingPartyName);
    const shippingAddress = pick(voucher, ["shipping_address", "shipping_postal_address", "shippingAddress", "ship_to_address", "consignee_address"], billingAddress);
    const shippingState = pick(voucher, ["shipping_state_name", "shipping_state", "shippingState", "ship_to_state"], billingState);
    const shippingStateCode = pick(voucher, ["shipping_state_code", "shippingStateCode", "ship_to_state_code", "consignee_state_code"], billingStateCode);
    const shippingGstin = pick(voucher, ["shipping_gstin", "shippingGstin", "ship_to_gstin", "consignee_gstin"], billingGstin);
    const shippingCity = pick(voucher, ["shipping_city_name", "shipping_city"], billingCity);

    // Account Rows
    let accountRows = "";
    let totalAmount = 0, totalTaxable = 0, totalTax = 0, totalCgst = 0, totalSgst = 0, totalIgst = 0, totalGst = 0, totalTds = 0, totalFinal = 0;

    accounts.forEach((account, index) => {
      const serviceName = pick(account, ["service_name", "description", "service_description"], "");
      const serviceCode = pick(account, ["service_code", "hsn_code", "sac_code", "hsn_sac"], "");
      const qty = num(pick(account, ["qty", "quantity"], 1));
      const rate = num(pick(account, ["rate", "service_rate"], 0));
      const amount = num(pick(account, ["amount", "gross_amount", "total_amount", "final_amount_before_tax"], rate * qty));
      const taxableAmount = num(pick(account, ["taxable_amount", "taxable_amt", "taxable"], amount));
      const taxRate = num(pick(account, ["tax", "tax_rate", "gst_rate"], 0));
      const gstAmount = num(pick(account, ["gst_amount", "gst_amt"], 0));
      const cgstAmount = num(pick(account, ["cgst", "cgst_amount", "cgst_amt"], gstAmount / 2));
      const sgstAmount = num(pick(account, ["sgst", "sgst_amount", "sgst_amt"], gstAmount / 2));
      const igstAmount = num(pick(account, ["igst", "igst_amount", "igst_amt"], 0));
      const tdsAmount = num(pick(account, ["tds_rate_amount", "tds_amount", "tds_amt"], 0));
      const finalAmount = num(pick(account, ["final_amount", "net_amount", "amount_after_tax"], taxableAmount + gstAmount - tdsAmount));

      totalAmount += amount;
      totalTaxable += taxableAmount;
      totalTax += taxRate;
      totalCgst += cgstAmount;
      totalSgst += sgstAmount;
      totalIgst += igstAmount;
      totalGst += gstAmount;
      totalTds += tdsAmount;
      totalFinal += finalAmount;

      accountRows += `
        <tr>
          <td class="center">${index + 1}</td>
          <td class="description">${escapeHtml(serviceName)}</td>
          <td class="code">${escapeHtml(serviceCode)}</td>
          <td class="qty">${qty.toFixed(2)}</td>
          <td class="number">${money(rate)}</td>
          <td class="number">${money(amount)}</td>
          <td class="number">${money(taxableAmount)}</td>
          <td class="center">${taxRate.toFixed(2)}</td>
          <td class="number">${money(cgstAmount)}</td>
          <td class="number">${money(sgstAmount)}</td>
          <td class="number">${money(igstAmount)}</td>
        </tr>
      `;
    });

    // Totals
    const taxable = num(pick(voucher, ["taxable", "taxable_amount", "taxable_value"], totalTaxable));
    const cgst = num(pick(voucher, ["cgst", "cgst_amount"], totalCgst));
    const sgst = num(pick(voucher, ["sgst", "sgst_amount"], totalSgst));
    const igst = num(pick(voucher, ["igst", "igst_amount"], totalIgst));
    const gstTotal = num(pick(voucher, ["gstTotal", "gst_total", "gst_amount"], cgst + sgst + igst));
    const gross = num(pick(voucher, ["gross", "gross_amount", "total_amount"], taxable + gstTotal));
    const tdsAmt = num(pick(voucher, ["tdsAmt", "tds_amount", "tds_amt"], totalTds));
    const lessAmt = num(pick(voucher, ["less_amt", "less_amount"], tdsAmt));
    const net = num(pick(voucher, ["net", "net_amount", "net_payable"], gross - lessAmt));

    const totalAmountFinal = num(pick(voucher, ["totalAmount", "total_amount"], totalAmount));
    const totalTaxFinal = num(pick(voucher, ["tax", "total_tax"], totalTax));
    const totalGstFinal = totalGst || gstTotal;
    const totalTdsFinal = totalTds || tdsAmt;
    const totalFinalFinal = totalFinal || net;

    // Other Details
    const nature = pick(voucher, ["nature_name", "nature", "nature_of_transaction"], "");
    const branch = pick(voucher, ["branch_name", "branch"], "");
    const entity = pick(voucher, ["entity_name", "entity"], "");
    const vendor = pick(voucher, ["vendor_name", "vendor"], "");
    const status = pick(voucher, ["status"], "");
    const tdsRate = pick(voucher, ["tds_rate", "tdsRate", "tds_percentage"], "");
    const description = pick(voucher, ["notes", "description", "narration", "remarks"], "Purchase service voucher entry");
    const amountInWords = pick(voucher, ["amount_in_words", "amountInWords"], numberToWordsIndian(net));
    const electronicReferenceNo = pick(voucher, ["electronic_reference_no", "electronicReferenceNo", "irn", "reference_number"], "");
    const preparedBy = pick(voucher, ["created_by_name", "created_by"], "System");
    const approvedBy = pick(voucher, ["approved_by_name", "approved_by"], "System");
    const authorizedBy = pick(voucher, ["authorized_by_name", "authorized_by"], "System");

    // HTML Template
    const htmlFilePath = path.resolve(__dirname, "../template/purchaseService.html");
    if (!fs.existsSync(htmlFilePath)) {
      return res.status(404).json({ code: 404, success: false, message: "HTML template not found" });
    }

    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    const logoPath = path.join(__dirname, "../../../../src/assets/selected-logo.jpg");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,` + imageBuffer.toString("base64");
    }

    const replacements = {
      companyLogo: logoBase64,
      companyTagline,
      companyName,
      registeredOffice,
      gstin,
      companyPin,
      unitNo,
      floor,
      invoiceNumber,
      invoiceDate,
      dueDate,
      placeOfSupply,
      transporterName,
      transporterDocNo,
      reverseCharge,
      supplyDateTime,
      referenceNumber,
      referenceDate,
      entity,
      branch,
      vendor,
      nature,
      status,
      billingPartyName,
      billingAddress,
      billingState,
      billingStateCode,
      billingGstin,
      shippingPartyName,
      shippingAddress,
      shippingState,
      shippingStateCode,
      shippingGstin,
      taxable: money(taxable),
      cgst: money(cgst),
      sgst: money(sgst),
      igst: money(igst),
      gstTotal: money(gstTotal),
      gross: money(gross),
      tdsAmt: money(tdsAmt),
      lessAmt: money(lessAmt),
      net: money(net),
      totalAmount: money(totalAmountFinal),
      totalTax: totalTaxFinal.toFixed(2),
      totalGst: money(totalGstFinal),
      totalTds: money(totalTdsFinal),
      totalFinal: money(totalFinalFinal),
      tdsRate,
      amountInWords,
      electronicReferenceNo,
      description,
      preparedBy,
      approvedBy,
      authorizedBy,
      accounts: accountRows,
    };

    Object.keys(replacements).forEach((key) => {
      const value = replacements[key];
      htmlContent = htmlContent.replace(new RegExp(`{${key}}`, "g"), String(value ?? ""));
    });

    // Launch Chrome
    try {
      browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] });
    } catch (launchError) {
      console.error("Default Chrome launch failed:", launchError.message);
      const chromePath = getChromePath();
      if (!chromePath) return res.status(500).json({ code: 500, success: false, message: "Chrome executable not found." });
      browser = await puppeteer.launch({ headless: "new", executablePath: chromePath, args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1 });
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "5mm", bottom: "5mm", left: "5mm", right: "5mm" },
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    const safeDocumentNumber = String(voucher.document_number || id).replace(/[^a-zA-Z0-9_-]/g, "_");
    const pdfFileName = `purchase_service_voucher_${safeDocumentNumber}_${Date.now()}.pdf`;
    const folderPath = path.resolve(__dirname, "../../../../uploaded_files");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    const filePath = path.join(folderPath, pdfFileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return res.status(200).json({
      code: 200,
      success: true,
      message: "PDF generated successfully",
      data: {
        fileName: pdfFileName,
        filePath,
        fileUrl: `${baseUrl}/uploaded_files/${pdfFileName}`,
        voucherNumber: voucher.document_number,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    if (browser) { try { await browser.close(); } catch (e) {} }
    return res.status(500).json({ code: 500, success: false, message: "Failed to generate PDF", error: error.message });
  }
};