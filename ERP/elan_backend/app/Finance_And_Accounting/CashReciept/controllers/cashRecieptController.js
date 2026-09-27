const db = require('../../../models/index')
const path = require("path");
const fs = require("fs");
const { generatePDF } = require("../../../../app/common/pdfConverter");


module.exports.createCashReciept = async (req, res) => {

  const transaction = await db.sequelize.transaction();

  try {

    const {
      posting_date,
      others,document_value,
      amount_due,document_number_id,
      document_number,
      transaction_date,
      journalDocument,
      notes,financial_id,
      amount_paid_now,
      cheque_ref_no,
      cheque_ref_date,
      voucher_id,
      branch_id,
      entity_id,
      Account_details,
      manage_advance,
      document_type,
      party_type,payment_advice_ids,
      customer_id,proforma_invoice_id,
      sales_quotation_id,
      sales_order_id,
      employee_id,
      delivery_order_id,
      sales_invoice_id,
      reference_number,
      vendor_id,
      po_id,
      grn_id,
      invoice_id,
      gst_amount,
      taxable_amount,
      currency_id,
      currency_rate
      
    } = req.body;
    if (payment_advice_ids === 'Sales Journal') {
      const total_amount = Account_details.reduce(
        (total, row) => total + parseFloat(row.debit_amount || 0),
        0
      );
    
      const serviceExist = await db.salesJournal.findOne({
        where: { id: document_number_id },
        transaction
      });
    
      if (!serviceExist) {
        return res.status(404).send({
          code: 404,
          message: 'Service voucher not found.'
        });
      }
    
     
      const createData = await db.paymentProgram.create({
        amount: document_value,
        reference_number: document_number,
        document_type: 'Sales Journal',
        entity_id,
        document_number: serviceExist.document_number,
        payment_status: 'sales Journal Payment'
      }, { transaction });
    
      
      const createbankReciept = await db.cashReciept.create({
        posting_date,
        amount_due:0,
        others,
        vendor_id,
        po_id,
        grn_id,
        invoice_id,
        document_number,
        reference_number,
        transaction_date,
        employee_id,
        notes,
        cheque_ref_no,
        currency_id,
      currency_rate,
        voucher_list_id: voucher_id,
        branch_id,
        entity_id,
        manage_advance,
        document_type,
        party_type,
        customer_id,
        sales_order_id,
        delivery_order_id,
        sales_invoice_id,
        sales_quotation_id
      }, { transaction });
    
      await db.paymentProgramList.create({
        customer_id,
        sales_journal_id: document_number_id,
        amount_due: parseFloat(document_value) - parseFloat(total_amount),
        paid_amount: total_amount,
        total_amount: document_value,
        payment_program_id: createData.id,
        cash_reciept_id: createbankReciept.id,
      }, { transaction });
      await Promise.all(
        Account_details.map((i) => {
          const {
            credit_amount,
            narration,
            party_type,
            debit_amount,
            chart_account_id,
            gross_amount,
            customer_id,
            product_id,
            cost_center_id,
            profit_center_id,
            bank_id,
            currency_id,
            remarks
          } = i;
    
         db.cashRecieptAccount.create({
            debit_amount,
            credit_amount,
            narration,
            party_type,
            remarks,
            gross_amount,
            cash_reciept_id: createbankReciept.id,
       
            bank_id,
            customer_id,
            product_id,
            cost_center_id,
            profit_center_id,
            chart_account_id: chart_account_id,
            currency_id
          }, { transaction }); 
           db.cashRecieptAccount.create({
            debit_amount:0.00,
            credit_amount:total_amount,
            narration,
            party_type,
           
            gross_amount,
            cash_reciept_id: createbankReciept.id,
       
            bank_id,
            customer_id,
            product_id,
            cost_center_id,
            profit_center_id,
            chart_account_id: 168,
            currency_id
          }, { transaction });
        })
      );
    
      // Grouped entries
      const groupedEntries = {};
      Account_details.forEach((item) => {
        const key = `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;
        if (!groupedEntries[key]) {
          groupedEntries[key] = {
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            debit_amount: 0
          };
        }
        groupedEntries[key].debit_amount += parseFloat(item.debit_amount || 0);
      });
    
      // Create all journal entries in parallel
      const journalPromises = [];
      for (const key in groupedEntries) {
        const item = groupedEntries[key];
        journalPromises.push(
          db.financial_And_Account_Journal_List.create({
            debit_amount: 0.00,
            credit_amount: item.debit_amount,
            party_type: 'CUSTOMER',
            entry_status: 'Sales Journal Payment',
            document_number: createData.document_number,
            vendor_id,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: 168,
            financial_id,
            customer_id,
            entity_id,
            currency_id,
      currency_rate
          }, { transaction }),
    
          db.financial_And_Account_Journal_List.create({
            debit_amount: item.debit_amount,
            credit_amount: 0.00,
            entry_status: 'sales Journal Payment',
            document_number: createData.document_number,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            financial_id,currency_id,
            currency_rate,
            entity_id
          }, { transaction })
        );
      }
    
      await Promise.all(journalPromises);
    
      await transaction.commit();
    
      return res.status(200).send({
        code: 200,
        message: 'Cash Receipt Created Successfully'
      });
    }
    if(payment_advice_ids == 'PAYMENT_ADVICE'){
      const total_amount = Account_details.reduce(
        (total, row) => total + parseFloat(row.debit_amount || 0),
        0
      );

      const createData = await db.paymentProgram.create(
        {
          amount: document_value,
          reference_number: reference_number,
          document_type: 'Cash Reciept Advice Payment',
          entity_id: entity_id,
          document_number: reference_number,
          payment_status: 'Cash Reciept Advice Payment',
          payment_program_status:'Approved'
        },{transaction}
      );
    
      const createbankReciept = await db.cashReciept.create({
        posting_date,
        amount_due,
        document_number,
        reference_number,
        transaction_date,
        employee_id,
        notes,
        cheque_ref_no,
        cheque_ref_date,
        voucher_list_id: voucher_id,
        branch_id,
        entity_id,
        manage_advance,
        document_type,
        party_type,
        customer_id,currency_id,
        currency_rate
      }, { transaction });

    
      await db.paymentProgramList.create(
        {
          customer_id,
          document_no:reference_number,
          amount_due:amount_due,
          paid_amount: total_amount,
          total_amount: document_value,
          payment_program_id: createData.id,
          cash_reciept_id: createbankReciept.id,
        },{transaction}
      );
    
      await Promise.all(
        Account_details.map(async (i) => {
          let {
            debit_amount,
      credit_amount,
      profit_center_id,
      chart_account_id,
      cost_center_id,
          } = i;
  
        
        
          await db.cashRecieptAccount.create({
            debit_amount,
            credit_amount,
            profit_center_id,
            cost_center_id,
            cash_reciept_id: createbankReciept.id,
            party_type,
            customer_id,
            amount_due,
            currency_id,
            chart_account_id: chart_account_id,
          }, { transaction });
          await db.cashRecieptAccount.create({
            debit_amount:0.00,
            credit_amount:total_amount,
            profit_center_id,
            cost_center_id,
            cash_reciept_id: createbankReciept.id,
            party_type,
            customer_id,
            amount_due,
            currency_id,
            chart_account_id: 168,
          }, { transaction });
    
        })
    
      );
    
    
      const groupedEntries = {};
      for (const item of Account_details) {
       
        const costCenterKey = item.cost_center_id || 'null';
        const profitCenterKey = item.profit_center_id || 'null';
      
        const key =
          `${costCenterKey}_${profitCenterKey}_${item.chart_account_id}`;
      
        if (!groupedEntries[key]) {
      
          groupedEntries[key] = {
      
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id, 
            debit_amount: item.debit_amount,
          };
      
        }
     
        
      }
    
      for (const key in groupedEntries) {
    
        const item = groupedEntries[key];
          await db.financial_And_Account_Journal_List.create({
            debit_amount: item.debit_amount,
            credit_amount: 0.00,
            entry_status: 'Cash Reciept Advice Payment',
            document_number: document_number,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            entity_id, financial_id,
            currency_id,
            currency_rate,branch_id
          }, { transaction });
      }
      

        await db.financial_And_Account_Journal_List.create({
          debit_amount: 0.00,
          credit_amount: total_amount,
          party_type: 'CUSTOMER',
          entry_status: 'Cash Reciept Advice Payment',
          document_number: document_number,
          customer_id,
          chart_account_id: 168,
          entity_id,
          financial_id,
            currency_id,
            currency_rate,branch_id
        }, { transaction });
      
    
      await transaction.commit();
    
      return res.status(200).send({
        code: 200,
        message: 'Cash Reciept Created Successfully'
      });
    }
    const createbankReciept = await db.cashReciept.create({

      posting_date,
      amount_due,
      document_number,
      reference_number,
      transaction_date,
      notes,document_value,
      cheque_ref_no,
    
      voucher_list_id: voucher_id,
      branch_id,
      entity_id,
      document_type,
      party_type,
      customer_id

    }, { transaction });


    const total_amount = Account_details.reduce(
      (total, row) => total + parseFloat(row.debit_amount || 0),
      0
    );
    for (const i of Account_details) {

      await db.cashRecieptAccount.create({
        debit_amount: Number(i.debit_amount || 0),
        credit_amount: Number(i.credit_amount || 0),
        party_type: i.party_type,
        gross_amount: i.gross_amount,
        cash_reciept_id: createbankReciept.id,
        bank_id: i.bank_id,
        customer_id: i.customer_id,
        cost_center_id: i.cost_center_id,
        profit_center_id: i.profit_center_id,
        chart_account_id: i.chart_account_id,
        currency_id: i.currency_id
      }, { transaction });
      await db.cashRecieptAccount.create({
        debit_amount:0.00,
        credit_amount:total_amount,
        party_type: i.party_type,
        gross_amount: i.gross_amount,
        cash_reciept_id: createbankReciept.id,
        bank_id: i.bank_id,
        customer_id: i.customer_id,
        cost_center_id: i.cost_center_id,
        profit_center_id: i.profit_center_id,
        chart_account_id: 168,
        currency_id: i.currency_id
      }, { transaction });

    }

   
    if (sales_invoice_id) {
      let Obj = {};
      if (Number(amount_due) === 0) {
        Obj.payment_status = "PAID";
      } else {
        Obj.payment_status = "PARTIALLY PAID";
      }
     
      await db.salesInvoiceData.update(
        Obj,
        {
          where: { id: sales_invoice_id },
          transaction
        }
      );
    }
    const createData = await db.paymentProgram.create({
      amount: document_value,
      reference_number: document_number,
      document_type: 'Cash Reciept',
      entity_id,
      document_number: document_number,
      payment_status: 'Cash Reciept'
    }, { transaction });

   
    await db.paymentProgramList.create({
      customer_id,
      sales_invoice_id: sales_invoice_id,
      amount_due: amount_due,
      paid_amount: total_amount,
      total_amount: document_value,
      payment_program_id: createData.id,
      cash_reciept_id: createbankReciept.id,
    }, { transaction });
 
    const journalEntries = [];


    for (const i of Account_details) {

      journalEntries.push({
        debit_amount: Number(i.debit_amount || 0),
        credit_amount: 0,
    
        financial_id,
        document_number,
        entry_status: 'Cash Receipt',
    
        chart_account_id: i.chart_account_id,
        entity_id,
    
        bank_id: i.bank_id,currency_id,
        currency_rate
      });
    
    }


    journalEntries.push({
      debit_amount: 0,
      credit_amount: total_amount,
      financial_id,
      party_type: 'CUSTOMER',
      document_number,
      entry_status: 'Cash Receipt',
      customer_id,
      chart_account_id: 168,
      entity_id,
      currency_id,
      currency_rate
    });

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

          await db.paymentAdviceDoc.create({

            upload_doc: i.file,

            bank_reciept_id: createbankReciept.id

          }, { transaction });

        })

      );

    }
 
    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: 'Cash Receipt Created Successfully'
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message
    });

  }

};

module.exports.generateCashRecieptNumber = async (req, res) => {
    try {
      const lastEntry = await db.cashReciept.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["document_number"],
      });
  
      let number;
      const currentYear = new Date().getFullYear();
      if (lastEntry) {
        const lastCode = lastEntry.document_number;
        const parts = lastCode.split('-');
        parts[parts.length - 2] = currentYear;
        let numberPart = parseInt(parts[3], 10);
        numberPart++;
        const newNumberPart = String(numberPart).padStart(5, '0');
        const newCode = `${parts[0]}-${parts[1]}-${parts[2]}-${newNumberPart}`;
        number = newCode;
      } else {
        number = `ACC-CR-${currentYear}-00001`;
      }
      return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
  };

  

module.exports.getCashRecieptList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
        const [getDataList] = await db.sequelize.query(
            `SELECT B.* ,MB.branch_name,VM.voucher_name,SUM(CR.debit_amount) AS debit_amount
             FROM CASH_RECIEPT AS B
             INNER JOIN MASTER_BRANCH AS MB ON MB.id = B.branch_id
             INNER JOIN CASH_RECIEPT_ACCOUNT_LIST AS CR ON CR.cash_reciept_id = B.id
             LEFT JOIN VOUCHER_MAIN_LIST_MST AS VM ON VM.id = B.voucher_list_id
            WHERE B.entity_id=${entity_id}
             GROUP BY B.id ORDER BY B.id DESC`
        )
      
        if(getDataList){
            return res.status(200).send({code:200,message:'success',data:getDataList})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:getDataList})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message   })
    }
}

module.exports.getCashRecieptById = async(req,res)=>{
  try {
      const {id} = req.query;
      const [getDataList] = await db.sequelize.query(
          `SELECT B.* ,MB.branch_name,B.voucher_list_id AS voucher_id,
           PP.sales_journal_id,
    PP.sales_invoice_id,
    PP.service_voucher_id,

    CASE 
        WHEN PP.sales_journal_id IS NOT NULL THEN 'Sales Journal'
        WHEN PP.service_voucher_id IS NOT NULL THEN 'Service'
        ELSE 'Unknown'
    END AS payment_advice_ids

           FROM CASH_RECIEPT AS B
           INNER JOIN MASTER_BRANCH AS MB ON MB.id = B.branch_id
           LEFT JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.cash_reciept_id=B.id
          WHERE B.id=${id}`
      )
      const [itemList] = await db.sequelize.query(
        `SELECT PL.*
           FROM CASH_RECIEPT AS P
           INNER JOIN CASH_RECIEPT_ACCOUNT_LIST AS PL ON PL.cash_reciept_id=P.id
           WHERE P.id=${id}`
      )
     
      const [DocumentList] = await db.sequelize.query(
        `SELECT PL.*
FROM PAYMENT_ADVICE AS P
INNER JOIN CASH_RECIEPT_DOCUMENT AS PL ON PL.cash_reciept_id=P.id
WHERE P.id=${id}`
      )
     const Obj ={
      ...getDataList[0],
      Account_details:itemList,
      journalDocument:DocumentList
     }
        if(Obj){
            return res.status(200).send({code:200,message:'success',data:Obj})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:Obj})
        }
  } catch (error) {
      return res.status(500).send({code:500,message:error.message   })
  }
}

module.exports.getCashRecieptReportList = async(req,res)=>{
  try {
      const {entity_id} = req.query;
      const [getDataList] = await db.sequelize.query(
          `SELECT P.* ,MB.branch_name
FROM CASH_RECIEPT AS P
INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
          WHERE P.entity_id=${entity_id}`
      )
      const [itemList] = await db.sequelize.query(
        `SELECT DISTINCT PL.* ,FC.cost_center_name,FP.profit_center_name,C.account_name AS chart_account_name,
CONCAT(HR.first_name,' ',HR.last_name),S.company_name AS customer_name,MP.item_name AS product_name
FROM CASH_RECIEPT AS P
INNER JOIN CASH_RECIEPT_ACCOUNT_LIST AS PL ON PL.cash_reciept_id=P.id
LEFT JOIN FINANCE_COST_CENTER AS FC ON FC.id=PL.cost_center_id
LEFT JOIN FINANCE_PROFIT_CENTER AS FP ON FP.id=PL.profit_center_id
LEFT JOIN CHART_OF_ACCOUNTS AS C ON C.id = PL.chart_account_id
LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PL.employee_id
LEFT JOIN CUSTOMER_PROFILE_MST AS S ON S.id=PL.customer_id
LEFT JOIN MASTER_ITEM AS MP ON MP.id=PL.product_id`
      )
      const finalValue = getDataList.map((md) => {
        const matchingUpdatedData = itemList.find((ud) =>
            ud.cash_reciept_id == md.id );
     
        if (matchingUpdatedData) {
            return {
                ...md,
                ...matchingUpdatedData
               
            };
        }
    
        return md; 
      });
      if(finalValue){
          return res.status(200).send({code:200,message:'success',data:finalValue})
      }else{
          return res.status(200).send({code:404,message:'Data Not Found',data:finalValue})
      }
  } catch (error) {
      return res.status(500).send({code:500,message:error.message   })
  }
}


module.exports.generateBankRecieptNumber = async (req, res) => {
  try {
   

    const {branch_id,voucher_id} = req.body

    const branchExist = await db.tbl_branch.findOne({where:{id:branch_id},attributes:['id','branch_name']})
    const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();
    const voucherMainListExist = await db.voucherMainList.findOne({where:{id:voucher_id},attributes:['id','series','voucher_main_id','voucher_name']})
    const voucherMainExist = await db.voucherMain.findOne({where:{id:voucherMainListExist.voucher_main_id},attributes:['id','name']})
    const voucherPrefixed = voucherMainExist.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const voucherPrefixedMainList = voucherMainListExist.voucher_name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const lastEntry = await db.cashReciept.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["document_number"],
    });
  
      let number;
      const currentYear = new Date().getFullYear();
      if (lastEntry) {
        const lastCode = lastEntry.document_number;
        const parts = lastCode.split('-');
        parts[parts.length - 2] = currentYear;
        let numberPart = parseInt(parts[3], 10);
        numberPart++;
        const newNumberPart = String(numberPart).padStart(5, '0');
      
        const newCode = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-${newNumberPart}`;
        number = newCode;
        
      } else {
        number = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-00001`;
        
      }
    return res.status(200).send({ code: 200, message: "Code Generated", data: number });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};


module.exports.downloadCashRecieptById = async (req, res) => {
  try {
    const { id } = req.query;
    const [getDataList] = await db.sequelize.query(
      `
 SELECT  B.*,MB.branch_name,B.voucher_list_id AS voucher_id,V.company_name,E.entity_name,
        E.tax_registration_number AS entity_gst_in, E.registered_office,E.logo
      FROM CASH_RECIEPT AS B
      INNER JOIN MASTER_BRANCH AS MB ON MB.id = B.branch_id
      LEFT JOIN CUSTOMER_PROFILE_MST AS V ON V.id = B.customer_id
      LEFT JOIN ENTITY_MASTER AS E  ON E.id = B.entity_id
      WHERE B.id = ${ id }
      `
    )

    const [itemList] = await db.sequelize.query(
      `
      SELECT DISTINCT CA.account_name, CA.account_code,P.document_number AS journal_document_number,
        P.posting_date AS journal_posting_date,PL.credit_amount, PL.debit_amount,P.*,
        CASE WHEN PL.credit_amount THEN 'Cr.'
        ELSE 'Dr.'
        END dcType
      FROM CASH_RECIEPT AS P
      INNER JOIN CASH_RECIEPT_ACCOUNT_LIST AS PL ON PL.cash_reciept_id = P.id
	  INNER JOIN CHART_OF_ACCOUNTS AS CA  ON CA.id = PL.chart_account_id
      WHERE P.id = ${ id }
      `
    );
    const totalAmount = itemList.reduce(
      (sum, item) => sum + Number(item.credit_amount || 0),
      0
    );
    if (!getDataList || getDataList.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "Data Not Found"
      });
    }

    const header = getDataList[0];

    const htmlPath = path.resolve(
      __dirname,
      "../../../../src/assets/templates/cash_receipt.html"
    );

    let html = fs.readFileSync(htmlPath, "utf-8");

    const logoPath = path.join(
      __dirname,
      "../../../../src/assets/selected-logo.jpg"
    );

    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);

      logoBase64 = `data:image/jpeg;base64,${imageBuffer.toString(
        "base64"
      )}`;
    }
    const getValue = (obj, keys, defaultValue = "") => {
      for (const key of keys) {
        if (
          obj[key] !== undefined &&
          obj[key] !== null &&
          obj[key] !== ""
        ) {
          return obj[key];
        }
      }

      return defaultValue;
    };

    const formatDate = (date) => {
      if (!date) return "";

      try {
        return new Date(date).toLocaleDateString("en-GB");
      } catch (error) {
        return "";
      }
    };

    const formatAmount = (value) => {
      const number = Number(value);

      if (isNaN(number)) {
        return "0.00";
      }

      return number.toFixed(2);
    };

    let accountRows = "";
    if (itemList && itemList.length > 0) {
      let amount =0
      itemList.forEach((item, index) => {
        if (Number(item.credit_amount) > 0) {
          amount = Number(item.credit_amount);
        } else if (Number(item.debit_amount) > 0) {
          amount = Number(item.debit_amount);
        } else {
          amount = Number(
            getValue(
              item,
              [
                "amount",
                "total_amount",
                "paid_amount",
                "amount_adjusted"
              ],
              0
            )
          );
        }


        const accountName = getValue(
          item,
          [
            "account_name",
            "ledger_name",
            "sub_ledger_name"
          ],
          ""
        );

        const accountCode = getValue(
          item,
          [
            "account_code",
            "ledger_code"
          ],
          ""
        );

     
        const chequeNo = getValue(
          item,
          [
            "cheque_ref_no",
          ],
          ""
        );

        const chequeDate = getValue(
          item,
          [
            "cheque_ref_date",
          ],
          ""
        );

     
        const narration = getValue(
          item,
          [
            "notes",
            "remarks",
          ],
          ""
        );

        const referenceNumber = getValue(
          item,
          [
            "reference_number",
            "reference_no",
            "ref_no",
            "document_number",
            "journal_document_number"
          ],
          ""
        );

  
        const billNo = getValue(
          item,
          [
            "document_number",
          ],
          ""
        );

        const billDate = getValue(
          item,
          [
            "posting_date",
          ],
          ""
        );

        const billAmount = Number(
          getValue(
            item,
            [
              "bill_amount",
              "billAmount",
              "invoice_amount",
              "invoiceAmount"
            ],
            0
          )
        );

        const amountAdjusted = Number(
          getValue(
            item,
            [
              "amount_adjusted",
              "amountAdjusted",
              "adjusted_amount",
              "adjustedAmount"
            ],
            amount
          )
        );

        accountRows += `
          <tr class="main-row">

            <td class="center serial-cell">
              ${index + 1}
            </td>

            <td class="particular-cell">

              <div class="account-name">
                ${accountName}
              </div>

              ${
                accountCode
                  ? `
                    <div class="account-code">
                      ${accountCode}
                    </div>
                  `
                  : ""
              }

              ${
                chequeNo || chequeDate
                  ? `
                    <div class="cheque-details">

                      ${
                        chequeNo
                          ? `
                            <span>
                              Cheque No. - ${chequeNo}
                            </span>
                          `
                          : ""
                      }

                      ${
                        chequeDate
                          ? `
                            <span class="cheque-date">
                              Cheque Date : ${formatDate(chequeDate)}
                            </span>
                          `
                          : ""
                      }

                    </div>
                  `
                  : ""
              }

              ${
                narration
                  ? `
                    <div class="transaction-details">
                      ( ${narration} )
                    </div>
                  `
                  : ""
              }

              ${
                referenceNumber
                  ? `
                    <div class="transaction-details">
                      ${referenceNumber}
                    </div>
                  `
                  : ""
              }
              ${
                billNo ||
                billDate ||
                billAmount ||
                amountAdjusted
                  ? `
                    <div class="bill-section">
                      <div class="bill-heading">

                        <span>
                          Bill No
                        </span>

                        <span>
                          Bill Date
                        </span>

                        <span>
                          Bill Amount
                        </span>

                        <span>
                          Amount Adjusted
                        </span>

                      </div>

                      <div class="bill-values">

                        <span>
                          ${billNo || "-"}
                        </span>

                        <span>
                          ${
                            billDate
                              ? formatDate(billDate)
                              : "-"
                          }
                        </span>

                        <span>
                          ${formatAmount(billAmount)}
                        </span>

                        <span>
                          ${formatAmount(amountAdjusted)}
                        </span>

                      </div>

                    </div>
                  `
                  : ""
              }

            </td>

            <!-- D/C -->
            <td class="center dc-cell">
              ${item.dcType}
            </td>

            <!-- AMOUNT -->
            <td class="right amount-cell">
              ${formatAmount(amount)}
            </td>

          </tr>
        `;
      });
    }

    const amountInWords = numberToWords(totalAmount);

    const bindData = (template, data) => {
      return template.replace(
        /{{{?([^{}]+)}}}?/g,
        (_, key) => {
          const cleanKey = key.trim();

          if (
            data[cleanKey] === undefined ||
            data[cleanKey] === null
          ) {
            return "";
          }

          return data[cleanKey];
        }
      );
    };

    const mainAddress =
      header?.registered_office ||
      "Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004";

    html = bindData(html, {

      heading: "CASH RECEIPT VOUCHER",

      entityName:
        header.entity_name || "",

      entityAddress:
        header.registered_office || "",

      entity_gst_in:
        `PAN No. ${header.tax_registration_number || "-"}`,

      entityLogo:
        logoBase64,

      mainAddress:
        mainAddress,

      voucher_no:
        header.document_number || "",

      voucher_date:
        header.posting_date
          ? formatDate(header.posting_date)
          : "",

      bank_name:
        header.bank_name || "",

      sub_ledger:
        header.sub_ledger || "",

      amount:
        formatAmount(totalAmount),

      company_name:
        header.company_name || "",

      currency:
        header.currency || "₹",

      accountRows:
        accountRows,

      totalAmount:
        formatAmount(totalAmount),

      amount_in_words:
        amountInWords,

      remarks:
        header.remarks ||
        header.narration ||
        "",

      prepared_by:
        header.prepared_by || "",

      received_by:
        header.received_by || "",

      authorize_by:
        header.authorize_by || "",

      invoice_no:
        header.document_number || "",

      invoice_date:
        header.transaction_date
          ? formatDate(header.transaction_date)
          : "",

      invoice_amount:
        formatAmount(totalAmount),

      amount_adjusted:
        formatAmount(totalAmount)
    });

    const pdfBuffer = await generatePDF(html);

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cash_receipt_${
        header.document_number || id
      }.pdf"`
    );

    res.setHeader(
      "Content-Length",
      pdfBuffer.length
    );

    return res.end(pdfBuffer);

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message:
        error.message ||
        "Server Error"
    });
  }
};

function numberToWords(num) {
  if (num === 0) return "Zero Only";
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertToWords(n) {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertToWords(n % 100) : '');
    if (n < 100000) return convertToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convertToWords(n % 1000) : '');
    if (n < 10000000) return convertToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convertToWords(n % 100000) : '');
    return convertToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convertToWords(n % 10000000) : '');
  }
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let words = convertToWords(rupees) + ' Rupees';
  if (paise > 0) {
    words += ' And ' + convertToWords(paise) + ' Paise';
  }
  return words + ' Only';
}