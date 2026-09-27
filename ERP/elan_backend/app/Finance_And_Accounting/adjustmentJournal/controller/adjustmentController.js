const db = require('../../../models/index')
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const numberToWords = require('number-to-words');

module.exports.createAdjustmentJournal = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      posting_date,
      voucher_id,
      financial_posting,
      entity_id,
      bill_number,
      general_number,
      transaction_date,
      notes,
      journalDocument,
      Account_details,
      reference,
      reference_date,
      financial_id,
      currency_id,
      currency_rate
    } = req.body;

    const currencyExist = await db.currency_convert.findOne({where:{Currency_Convert_id:currency_id},attributes:['Currency_Convert_id','rate'],transaction})

    const createAdjustmentJournal = await db.adjustmentJournal.create({
      posting_date,
      voucher_id,
      financial_posting,
      entity_id,
      bill_number,
      document_number:general_number,
      transaction_date,
      notes,
      reference,
      reference_date,
      currency_id,
      financial_year_id:financial_id,
      rate:currency_rate
    }, { transaction });

   
    for (const i of Account_details) {
      await db.adjustmentJournalList.create({
        adjustment_id: createAdjustmentJournal.id,
        chart_account_id: i.chart_account_id,
        party_type: i.party_type,
        employee_id: i.employee_id,
        customer_id: i.customer_id,
        vendor_id: i.vendor_id,
        product_id: i.product_id,
        debit_amount: (i.debit_amount),
        credit_amount: (i.credit_amount ),
        profit_center_id: i.profit_center_id,
        cost_center_id: i.cost_center_id,
        currency_id:currency_id,
        remarks:i.remarks,
        currency_rate:currencyExist?.rate,
      }, { transaction });
    }

    const journalEntries = [];

    for (const i of Account_details) {

      journalEntries.push({
        debit_amount: (i.debit_amount),
        credit_amount: (i.credit_amount),
        chart_account_id: i.chart_account_id,
        financial_id: financial_id,
        document_number: general_number,
        entry_status: 'Adjustment Journal',
        entity_id,
        vendor_id: i.vendor_id,
        customer_id: i.customer_id,
        employee_id: i.employee_id,
        party_type: i.party_type,
        cost_center_id: i.cost_center_id,
        profit_center_id: i.profit_center_id,
        currency_id:currency_id,
        currency_rate:currencyExist?.rate,
      });
    }

    await db.financial_And_Account_Journal_List.bulkCreate(
      journalEntries,
      { transaction }
    );

   

    if (journalDocument?.length > 0) {
      const validDocuments = journalDocument.filter(
        (i) => i && i.file
      );
      await Promise.all(
        validDocuments.map(async (i) => {
          await db.adjustmentJournalDocument.create({
            file: i.file,
            title:i.title,
            adjustment_id: createAdjustmentJournal.id
          }, { transaction });
        })
      );
    }

    await transaction.commit();
    return res.status(200).send({code: 200,message: "Adjustment Journal Created Successfully",data: createAdjustmentJournal});
  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({ code: 500,message: error.message || "Internal Server Error"});

  }

};

module.exports.getAllAdjustmentJournalList=async(req,res)=>{
const transaction = await db.sequelize.transaction();
  try {
    
    const [dataList] = await db.sequelize.query(`
       SELECT AJ.*,VML.voucher_name FROM ADJUSTMENT_JOURNAL AS AJ
         LEFT JOIN ADJUSTMENT_JOURNAL_ACCOUNT_LIST AS AJL ON AJ.id = AJL.adjustment_id
         INNER JOIN VOUCHER_MAIN_LIST_MST AS VML ON AJ.voucher_id = VML.id
         GROUP BY AJL.adjustment_id ORDER BY AJ.id DESC
      `)
   if(dataList)
{
  return res.status(200).send({
      code: 200,
      message: "Fetched Data",
      data:dataList

    });
}
  } catch (error) {
  
    return res.status(500).send({

      code: 500,

      message: error.message || "Internal Server Error"

    });
  }
}
module.exports.getAdjustmentJournalBYId=async(req,res)=>{
const transaction = await db.sequelize.transaction();
try {
  debugger
    const {  id  }  = req.query;
    
    const [data] = await db.sequelize.query(`
      SELECT * FROM ADJUSTMENT_JOURNAL
      WHERE id = ${id}
      `)

const [dataList]  =  await db.sequelize.query(`
      SELECT * FROM ADJUSTMENT_JOURNAL_ACCOUNT_LIST
      WHERE adjustment_id = ${id}
      `)

const [dataListDocument]  =  await db.sequelize.query(`
      SELECT * FROM ADJUSTMENT_DOCUMENT
      WHERE adjustment_id = ${id}
      `)
let finalData = {
  ...data[0],
  account_detail:dataList,
  document:dataListDocument
} 
   if(dataList)
{
  return res.status(200).send({
      code: 200,
      message: "Fetched Data",
      data:finalData

    });
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
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome Beta\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];
  
  for (const chromePath of commonPaths) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }
  return null;
}

// Helper function to convert amount to words
function convertToWords(number) {
  try {
    const integerPart = Math.floor(number);
    const decimalPart = number % 1;
    let words = numberToWords.toWords(integerPart);
    if (decimalPart > 0) {
      const decimalString = decimalPart.toFixed(2).split('.')[1];
      words += " Point " + numberToWords.toWords(parseInt(decimalString, 10));
    }
    words = words.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return words + " Rupees Only";
  } catch (error) {
    return "Rupees " + number.toFixed(2);
  }
}

// Helper to replace null values
const replaceNull = (str) => str == null || str === 'null' || str === '""' ? "" : String(str);

// Helper function to get currency symbol
function getCurrencySymbol(currencyCode) {
  const symbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CNY': '¥',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'Fr',
    'SGD': 'S$'
  };
  return symbols[currencyCode] || '₹';
}


async function getVoucherData(id) {
  try {
   
    const mainQuery = `
      SELECT 
        AJ.*,
        EM.id as entity_id,
        EM.entity_name,
        EM.tax_registration_number as gstin,
        EM.registered_office,
        EM.logo,
        MFY.financial_year,
        MFY.year_start_date,
        MFY.year_end_date,
        MCC.Currency_Type as currency,
        VML.voucher_name as document_type
      FROM ADJUSTMENT_JOURNAL AS AJ
      INNER JOIN ENTITY_MASTER AS EM ON AJ.entity_id = EM.id
      INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON AJ.financial_year_id = MFY.id
      INNER JOIN MASTER_CURRENCY_CONVERT AS MCC ON AJ.currency_id = MCC.Currency_Convert_id
      INNER JOIN VOUCHER_MAIN_LIST_MST AS VML ON AJ.voucher_id = VML.id
      WHERE AJ.id = :id
    `;
    
    const mainData = await db.sequelize.query(mainQuery, {
      replacements: { id: id },
      type: db.sequelize.QueryTypes.SELECT
    });
    
    if (!mainData || mainData.length === 0) {
      throw new Error(`Adjustment journal with ID ${id} not found`);
    }
    
    const voucher = mainData[0];
    
    const accountsQuery = `
      SELECT 
        AJAL.*,
        AM.account_name,
        AM.account_code
      FROM ADJUSTMENT_JOURNAL_ACCOUNT_LIST AS AJAL
      INNER JOIN CHART_OF_ACCOUNTS AS AM ON AJAL.chart_account_id = AM.id
      WHERE AJAL.adjustment_id = :id
      ORDER BY AJAL.id ASC
    `;
    
    const accounts = await db.sequelize.query(accountsQuery, {
      replacements: { id: id },
      type: db.sequelize.QueryTypes.SELECT
    });
    
    return {
      voucher,
      accounts: accounts || []
    };
  } catch (error) {
    console.error('Error fetching voucher data:', error);
    throw error;
  }
}

// Generate adjustment voucher PDF
module.exports.generateAdjustmentVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Adjustment ID:', id);
    
    if (!id) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Adjustment ID is required'
      });
    }
    
    // Fetch data from database
    let voucherData;
    try {
      voucherData = await getVoucherData(id);
    } catch (dbError) {
      console.error('Database Error:', dbError);
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Adjustment journal not found',
        error: dbError.message
      });
    }
    
    const { voucher, accounts } = voucherData;
    
    // Validate accounts
    if (!accounts || accounts.length === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'No accounts found for this adjustment'
      });
    }
    
    // Calculate totals
    let totalDebit = 0;
    let totalCredit = 0;
    
    accounts.forEach(account => {
      totalDebit += parseFloat(account.credit_amount || 0);
      totalCredit += parseFloat(account.debit_amount || 0);
    });
    
    const difference = totalDebit - totalCredit;
    let differenceClass = 'zero';
    if (difference > 0) differenceClass = 'positive';
    else if (difference < 0) differenceClass = 'negative';
    
    const amountInWords = convertToWords(totalDebit);
    
    // Prepare template data
     const logoPath = path.join(__dirname, "../../../../src/assets/selected-logo.jpg");
    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    }
    company_logo = logoBase64;
console.log(company_logo,'company_logo')
    const templateData = {
      companyLogo: company_logo,
      companyName: replaceNull(voucher.entity_name),
      registeredOffice: replaceNull(voucher.registered_office),
      gstin: replaceNull(voucher.gstin),
      company: replaceNull(voucher.entity_name),
      entity: replaceNull(voucher.entity_name),
      financialYear: replaceNull(voucher.financial_year),
      voucherNumber: replaceNull(voucher.document_number),
      date: voucher.transaction_date ? new Date(voucher.transaction_date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
      status: replaceNull(voucher.status),
      statusClass: voucher.status ? voucher.status.toLowerCase() : 'approved',
      adjustmentType: replaceNull(voucher.document_type || 'Adjustment Entry'),
      documentType: replaceNull(voucher.document_type || 'Journal Entry'),
      currency: replaceNull(voucher.currency || 'INR'),
      currencySymbol: getCurrencySymbol(voucher.currency || 'INR'),
      description: replaceNull(voucher.notes || 'Adjustment entry'),
      remarks: replaceNull(voucher.notes || ''),
      preparedBy: replaceNull(voucher.created_by || 'System'),
      preparedDate: voucher.createdAt ? new Date(voucher.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
      approvedBy: replaceNull(voucher.approved_by || 'System'),
      approvedDate: voucher.updatedAt ? new Date(voucher.updatedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
      authorizedBy: replaceNull(voucher.authorized_by || 'System'),
      authorizedDate: voucher.updatedAt ? new Date(voucher.updatedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
      totalDebit: totalDebit.toFixed(2),
      totalCredit: totalCredit.toFixed(2),
      difference: difference.toFixed(2),
      differenceClass: differenceClass,
      amountInWords: amountInWords,
      accounts: accounts
    };
    
    // Read HTML template
    const htmlFilePath = path.resolve(__dirname, "../template/adjustmentVoucher.html");
    
    if (!fs.existsSync(htmlFilePath)) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'HTML template file not found'
      });
    }
    
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
    
    // Generate account rows
    let accountRows = '';
    accounts.forEach((account, index) => {
      accountRows += `
        <tr>
          <td>${index + 1}</td>
          <td class="left">${replaceNull(account.account_name)}</td>
          <td>${replaceNull(account.account_code)}</td>
          <td class="right">${parseFloat(account.debit_amount || 0).toFixed(2)}</td>
          <td class="right">${parseFloat(account.credit_amount || 0).toFixed(2)}</td>
        </tr>
      `;
    });
    
    // Replace all placeholders
    const htmlWithData = htmlContent
      .replace(/{companyLogo}/g, templateData.companyLogo)
      .replace(/{companyName}/g, templateData.companyName)
      .replace(/{registeredOffice}/g, templateData.registeredOffice)
      .replace(/{gstin}/g, templateData.gstin)
      .replace(/{company}/g, templateData.company)
      .replace(/{entity}/g, templateData.entity)
      .replace(/{financialYear}/g, templateData.financialYear)
      .replace(/{voucherNumber}/g, templateData.voucherNumber)
      .replace(/{date}/g, templateData.date)
      .replace(/{status}/g, templateData.status)
      .replace(/{statusClass}/g, templateData.statusClass)
      .replace(/{adjustmentType}/g, templateData.adjustmentType)
      .replace(/{documentType}/g, templateData.documentType)
      .replace(/{currency}/g, templateData.currency)
      .replace(/{currencySymbol}/g, templateData.currencySymbol)
      .replace(/{description}/g, templateData.description)
      .replace(/{remarks}/g, templateData.remarks)
      .replace(/{preparedBy}/g, templateData.preparedBy)
      .replace(/{preparedDate}/g, templateData.preparedDate)
      .replace(/{approvedBy}/g, templateData.approvedBy)
      .replace(/{approvedDate}/g, templateData.approvedDate)
      .replace(/{authorizedBy}/g, templateData.authorizedBy)
      .replace(/{authorizedDate}/g, templateData.authorizedDate)
      .replace(/{generatedDate}/g, new Date().toLocaleString('en-IN'))
      .replace(/{totalDebit}/g, templateData.totalDebit)
      .replace(/{totalCredit}/g, templateData.totalCredit)
      .replace(/{difference}/g, templateData.difference)
      .replace(/{differenceClass}/g, templateData.differenceClass)
      .replace(/{amountInWords}/g, templateData.amountInWords)
      .replace(/{accounts}/g, accountRows);
    
    // Generate PDF
    let browser = null;
    
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
    } catch (error) {
      console.log('Puppeteer launch failed, trying with custom Chrome path:', error.message);
      const chromePath = getChromePath();
      if (chromePath) {
        browser = await puppeteer.launch({
          headless: 'new',
          executablePath: chromePath,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
      }
    }
    
    if (!browser) {
      return res.status(500).json({
        code: 500,
        success: false,
        message: 'Failed to launch browser. Please install Chrome.'
      });
    }
    
    const page = await browser.newPage();
    await page.setContent(htmlWithData, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    });
    
    await browser.close();
    
    // Save PDF
    const pdfFileName = `adjustment_voucher_${voucher.document_number}_${Date.now()}.pdf`;
    const folderPath = path.resolve(__dirname, '../../../../uploaded_files');
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const filePath = path.join(folderPath, pdfFileName);
    fs.writeFileSync(filePath, pdfBuffer);
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploaded_files/${pdfFileName}`;
    
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'PDF generated successfully',
      data: {
        fileName: pdfFileName,
        filePath: filePath,
        fileUrl: fileUrl,
        voucherNumber: voucher.document_number,
        id: id,
        totalDebit: totalDebit.toFixed(2),
        totalCredit: totalCredit.toFixed(2),
        difference: difference.toFixed(2),
        totalAccounts: accounts.length
      }
    });
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};

// View adjustment voucher PDF
module.exports.viewAdjustmentVoucher = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'File name is required'
      });
    }
    
    const folderPath = path.resolve(__dirname, '../../../../uploaded_files');
    const filePath = path.join(folderPath, fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'File not found'
      });
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    
    res.send(fileBuffer);
    
  } catch (error) {
    console.error('Error viewing PDF:', error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Failed to open PDF',
      error: error.message
    });
  }
};

// Download adjustment voucher PDF
module.exports.downloadAdjustmentVoucher = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'File name is required'
      });
    }
    
    const folderPath = path.resolve(__dirname, '../../../../uploaded_files');
    const filePath = path.join(folderPath, fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'File not found'
      });
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    
    res.send(fileBuffer);
    
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Failed to download PDF',
      error: error.message
    });
  }
};
