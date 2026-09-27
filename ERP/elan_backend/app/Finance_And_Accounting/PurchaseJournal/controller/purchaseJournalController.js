const db = require('../../../models/index')


module.exports.createPurchaseJournal = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      document_number, posting_date, Account_details, voucher_id, transaction_date, notes, reference_number, purchase_value, additional_charges,
      bill_amount, total_tds_amount, branch_id, vendor_id, entity_id, po_id, grn_id, invoice_id, tds_id, nature_id, total_gst_amount, financial_id,
      taxable,
      cgst,
      billing_id,
      less_amount,
      sgst, vendorPayable,
      igst,
      gstTotal,
      gross,
      net, currency_id,
      tdsAmt,
      rcmLiability
    } = req.body;

    const currencyExist = await db.currency_convert.findOne({
      where: { Currency_Convert_id: currency_id },
      attributes: ['Currency_Convert_id', 'rate'],
      transaction
    })

    const party_type = 'VENDOR';

    const VendorExist = await db.vendor_basic_details.findOne({
      where: { id: vendor_id },
      attributes: ['id', 'chart_of_account_id', 'state_id', 'rcm_charge'],
      transaction
    });

    if (!VendorExist) {
      return res.status(404).send({ code: 404, message: 'Vendor not found' });
    }

 
    const createPurchaseJournal = await db.purchaseJournal.create({
      document_number, posting_date, transaction_date, notes,
      reference_number, purchase_value, additional_charges, bill_amount, total_tds_amount, party_type, branch_id, vendor_id, taxable,
      cgst, sgst, igst, gstTotal, gross, net, tdsAmt, rcmLiability, billing_id,
      less_amount, currency_id: currency_id,
      currency_rate: currencyExist?.rate,
      entity_id, voucher_list_id: voucher_id, document_type: 'Purchase Journal', po_id,
      grn_id, invoice_id, tds_id, nature_id
    }, { transaction });

    for (const item of Account_details) {
      const { item_id, qty, rate, gst_amount, cost_center_id, profit_center_id, tds_rate_amount,remarks } = item;

      const lineAmount = Number(qty) * Number(rate);

      await db.purchaseJournalAccount.create({
        purchase_journal_id: createPurchaseJournal.id, item_id, qty, rate, debit_amount: lineAmount, credit_amount: 0.00,
        cost_center_id, profit_center_id, tds_id, nature_id, tds_rate_amount,remarks,
        gst_amount, currency_id
      }, { transaction });

    }

    const journalEntries = [];

  
    journalEntries.push({
      debit_amount: (taxable),
      credit_amount: 0.00,
      chart_account_id: 229,
      entity_id, financial_id,
      entry_status: 'Purchase Journal',
      document_number,
      branch_id,
      currency_id: currency_id,
      currency_rate: currencyExist?.rate,
      billing_id
    });


    if (VendorExist.rcm_charge) {
      if (cgst > 0 && sgst > 0) {
        const divideGST = (gstTotal) / 2;
        journalEntries.push({
          debit_amount: divideGST,
          credit_amount: 0.00,
          chart_account_id: 404,
          entity_id, financial_id,
          branch_id,
          currency_id: currency_id,
          currency_rate: currencyExist?.rate,
          entry_status: 'RCM GST Purchase Journal',
          document_number,
          cgst: (cgst), vendor_id,billing_id
        });
        journalEntries.push({
          debit_amount: divideGST,
          credit_amount: 0.00,
          chart_account_id: 405,
          entity_id, financial_id,
          branch_id,
          currency_id: currency_id,
          currency_rate: currencyExist?.rate,
          entry_status: 'RCM GST Purchase Journal',
          document_number, vendor_id,
          sgst: (sgst),
          billing_id
        });
        journalEntries.push({
          debit_amount: 0.00,
          credit_amount: divideGST,
          chart_account_id: 401,
          entity_id, financial_id,
          branch_id,
          currency_id: currency_id,
          currency_rate: currencyExist?.rate,
          entry_status: 'RCM GST Purchase Journal',
          document_number,
          cgst: (cgst), vendor_id,billing_id
        });
        journalEntries.push({
          debit_amount: 0.00,
          credit_amount: divideGST,
          chart_account_id: 402,
          entity_id, financial_id,
          branch_id,
          currency_id: currency_id,
          currency_rate: currencyExist?.rate,
          entry_status: 'RCM GST Purchase Journal',
          document_number,
          sgst: (sgst), vendor_id,billing_id
        });
      } else {
        journalEntries.push({
          debit_amount: (gstTotal),
          credit_amount: 0.00,
          chart_account_id: 403,
          entity_id, financial_id,
          branch_id,
          currency_id: currency_id,
          currency_rate: currencyExist?.rate,
          entry_status: 'RCM GST Purchase Journal',
          document_number,
          igst: (igst), vendor_id,billing_id
        });
        journalEntries.push({
          debit_amount: 0.00,
          credit_amount: (gstTotal),
          chart_account_id: 400,
          entity_id, financial_id,
          branch_id, vendor_id,
          currency_id: currency_id,
          currency_rate: currencyExist?.rate,
          entry_status: 'RCM GST Purchase Journal',
          document_number,
          igst: (igst),billing_id
        });
      }
    } else {
     
      if (gstTotal > 0) {
        if (cgst > 0 && sgst > 0) {
          const divideGST = (gstTotal) / 2;
          journalEntries.push({
            debit_amount: divideGST,
            credit_amount: 0.00,
            chart_account_id: 21,
            entity_id, financial_id,
            branch_id,
            currency_id: currency_id,
            currency_rate: currencyExist?.rate,
            entry_status: 'Purchase Journal',
            document_number, vendor_id,
            cgst: (cgst),billing_id
          });
          journalEntries.push({
            debit_amount: divideGST,
            credit_amount: 0.00,
            chart_account_id: 41,
            entity_id, financial_id,
            branch_id,
            currency_id: currency_id,
            currency_rate: currencyExist?.rate,
            entry_status: 'Purchase Journal',
            document_number, vendor_id,
            sgst: (sgst),billing_id
          });
        } else {
          journalEntries.push({
            debit_amount: (gstTotal),
            credit_amount: 0.00,
            chart_account_id: 29,
            entity_id, financial_id,
            branch_id,
            currency_id: currency_id,
            currency_rate: currencyExist?.rate,
            entry_status: 'Purchase Journal',
            document_number,
            igst: (igst), vendor_id,billing_id
          });
        }
      }
    }

  
    if (tdsAmt > 0) {
      journalEntries.push({
        debit_amount: 0.00,
        credit_amount: (tdsAmt),
        tds_rate_amount: (tdsAmt),
        tds_id,
        nature_id, financial_id,
        chart_account_id: 45,
        entity_id,
        branch_id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        entry_status: 'Purchase Journal',
        document_number,billing_id
      });
    }

    journalEntries.push({
      debit_amount: 0.00,
      credit_amount: (net),
      chart_account_id: 51,
      entity_id,
      vendor_id,
      party_type, financial_id,
      branch_id,
      currency_id: currency_id,
      currency_rate: currencyExist?.rate,
      entry_status: 'Purchase Journal',
      document_number,billing_id
    });

    const createData = await db.paymentProgram.create({
      amount: (net),
      reference_number: document_number,
      document_type: 'Purchase Journal',
      entity_id, financial_id,
      document_number: document_number,
      payment_status: 'Purchase Journal',
      payment_program_status: 'Approved'
    }, { transaction });

    await db.paymentProgramList.create({
      vendor_id,
      purchase_journal_id: createPurchaseJournal.id,
      amount_due: (net),
      paid_amount: 0,
      total_amount: (net),
      tds_id, nature_id, tds_rate_amount: (tdsAmt),
      payment_program_id: createData.id,
      currency_id: currency_id,
      currency_rate: currencyExist?.rate,
    }, { transaction });

 
    if (less_amount && less_amount > 0) {
      journalEntries.push({
        debit_amount: less_amount,
        credit_amount: 0.00,
        chart_account_id: 51,
        entity_id,
        financial_id,
        branch_id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        entry_status: 'Purchase Journal Credit Note',
        document_number,
        vendor_id: vendor_id,
        party_type: 'VENDOR',billing_id
      });

      journalEntries.push({
        debit_amount: 0.00,
        credit_amount: less_amount,
        chart_account_id: 229,
        entity_id,
        financial_id,
        branch_id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        entry_status: 'Purchase Journal Credit Note',
        document_number,
        vendor_id: vendor_id,billing_id
      });


    
      const createNote = await db.creditDebitNote.create({
        amount: less_amount,
        builder_date: transaction_date || new Date(),
        document_number: document_number,
        note_type: 'CREDIT NOTE',
        entity_id: entity_id,
        sales_journal_id: null,
        purchase_journal_id: createPurchaseJournal.id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        vendor_id: vendor_id,
        status: 'ACTIVE'
      }, { transaction });

     
      await db.creditDebitNoteItem.create({
        credit_debit_note_id: createNote.id,
        total_with_gst: less_amount,
        total_discount_amount: 0,
        total_price: less_amount,
        quantity: 1,
        price_per_unit: less_amount,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        status: 'ACTIVE'
      }, { transaction });

    }

    await db.financial_And_Account_Journal_List.bulkCreate(journalEntries, { transaction });

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

module.exports.getPurchaseJournalList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
        const [getDataList] = await db.sequelize.query(
            `SELECT P.* ,MB.branch_name,V.vendor_name,P.gross AS net
FROM PURCHASE_JOURNAL AS P
INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id =P.vendor_id
            WHERE P.entity_id=${entity_id} ORDER BY P.id DESC`
        )
        
        if(getDataList.length >0){
            return res.status(200).send({code:200,message:'success',data:getDataList})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:[]})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message   })
    }
}


module.exports.generatePurchaseJournalNumber = async (req, res) => {
  try {
   
    const {branch_id,voucher_id} = req.body

    const branchExist = await db.tbl_branch.findOne({where:{id:branch_id},attributes:['id','branch_name']})
    const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();
    const voucherMainListExist = await db.voucherMainList.findOne({where:{id:voucher_id},attributes:['id','series','voucher_main_id','voucher_name']})
    const voucherMainExist = await db.voucherMain.findOne({where:{id:voucherMainListExist.voucher_main_id},attributes:['id','name']})
    const voucherPrefixed = voucherMainExist.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const voucherPrefixedMainList = voucherMainListExist.voucher_name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const lastEntry = await db.purchaseJournal.findOne({
      order: [["id", "DESC"]],
      attributes: ['id',"document_number"],
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

module.exports.purchaseJournalById = async(req,res) =>{
try {

    const { id } = req.query;

    const [purchaseData] = await db.sequelize.query(`
      SELECT  PJ.*,VBD.rcm_charge FROM PURCHASE_JOURNAL AS PJ
    INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON PJ.vendor_id = VBD.id
    WHERE PJ.id = ${id}
      `)
    const [purchaseJournalList] = await db.sequelize.query(`
   SELECT PJA.*,MI.item_code,MH.hsn_sac_code,MRR.value,TL.current_rate
FROM PURCHASE_JOURNAL_ACCOUNT_LIST AS PJA
INNER JOIN PURCHASE_JOURNAL AS P ON P.id= PJA.purchase_journal_id
    INNER JOIN MASTER_ITEM AS MI ON PJA.item_id = MI.id
    INNER JOIN MASTER_HSN_SAC_CODE AS MH ON MI.hsn_code_id = MH.id
    INNER JOIN GST_RATE_MASTER AS MRR ON MH.gst_rate_id = MRR.id
    LEFT JOIN TDS_LIST_MST AS TL ON TL.id = P.nature_id
      WHERE PJA.purchase_journal_id = ${id}
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

module.exports.getBillingAddressById=  async(req,res)=>{
try {
  let {vendor_id} = req.query
  let datalist = await db.vendorBillingAddress.findAll({where:{vendor_id:vendor_id}})

  if(datalist){
return res.status(200).send({code:200,message:res.message,data:datalist})

  }
} catch (error) {
return res.status(500).send({code:500,message:error.error.message})

  
}

}

 
