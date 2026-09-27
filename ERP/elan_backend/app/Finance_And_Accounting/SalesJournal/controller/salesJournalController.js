const db = require('../../../models/index')


module.exports.createSalesJournal = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      document_number,
      posting_date,
      Account_details,
      transaction_date,
      notes, currency_id,
      reference_number,
      voucher_id,
      sales_value,
      bill_amount,
      branch_id,
      customer_id,
      entity_id, taxable_value,
      document_type,
      sales_booking_id,
      sales_invoice_id,
      sales_order_id,
      sales_quotation_id,
      proforma_invoice_id,
      financial_id,
      gross,
      taxable,
      total_discount,
      igst,
      cgst, less_amount,
      sgst,
      gstTotal, billing_id,
      net, grand_total,
      currency_rate
    } = req.body;
 
    const currencyExist = await db.currency_convert.findOne({
      where: { Currency_Convert_id: currency_id },
      attributes: ['Currency_Convert_id', 'rate'],
      transaction
    })

    const createSalesJournal = await db.salesJournal.create({
      document_number,
      voucher_list_id: voucher_id,
      posting_date,
      transaction_date,
      notes,
      reference_number,
      sales_value,
      bill_amount,
      branch_id,
      customer_id,
      entity_id,
      document_type,
      sales_booking_id,
      sales_invoice_id,
      sales_order_id, billing_id,
      proforma_invoice_id,
      quotation_id: sales_quotation_id,
      gross,
      taxable,
      total_discount,
      igst,
      cgst,
      sgst,
      gstTotal,
      net,
      less_amount,
      currency_id,
      rate: currency_rate
    }, { transaction });

    await Promise.all(
      Account_details.map(async (i) => {
        const {
          narration,
          item_id,
          cost_center_id,
          profit_center_id,
          qty,
          rate,
          discount_amount,
          discount_type,
          discount_value,
          total_value,
          gst_rate,
          gst_amount,
          remarks

        } = i;

        await db.salesJournalAccount.create({
          narration,
          item_id,
          cost_center_id,
          profit_center_id,
          qty,
          rate,
          discount_amount,
          discount_type,
          discount_value,
          total_value,
          gst_rate,
          gst_amount,
          remarks,
          sales_journal_id: createSalesJournal.id
        }, { transaction });
      })
    );

    const journalEntries = [];

    journalEntries.push({
      debit_amount: 0.00,
      credit_amount: parseFloat(taxable_value) + parseFloat(total_discount),
      chart_account_id: 203,
      entity_id,
      financial_id,
      entry_status: 'Sales Voucher',
      document_number,
      branch_id, billing_id,
      currency_id: currency_id,
      currency_rate: currencyExist?.rate,
    });

    if (Number(igst) > 0) {
      journalEntries.push({
        debit_amount: 0.00,
        credit_amount: (igst),
        financial_id,
        chart_account_id: 31,
        entity_id,
        entry_status: 'Sales Voucher',
        document_number,
        branch_id, billing_id,
        currency_id: currency_id,
        igst: (igst),
        currency_rate: currencyExist?.rate,
        customer_id
      });
    }

    if (Number(cgst) > 0) {
      journalEntries.push({
        debit_amount: 0.00,
        credit_amount: (cgst),
        financial_id,
        chart_account_id: 23,
        entity_id,
        entry_status: 'Sales Voucher',
        document_number,
        branch_id, billing_id,
        currency_id: currency_id,
        cgst: (cgst),
        currency_rate: currencyExist?.rate,
        customer_id
      });
    }

    if (Number(sgst) > 0) {
      journalEntries.push({
        debit_amount: 0.00,
        credit_amount: (sgst),
        financial_id,
        chart_account_id: 43,
        entity_id,
        entry_status: 'Sales Voucher',
        document_number,
        branch_id, billing_id,
        currency_id: currency_id,
        sgst: (sgst),
        currency_rate: currencyExist?.rate,
        customer_id
      });
    }

    if (Number(total_discount) > 0) {
      journalEntries.push({
        debit_amount: (total_discount),
        credit_amount: 0.00,
        financial_id,
        chart_account_id: 201,
        entity_id,
        entry_status: 'Sales Voucher',
        document_number,
        branch_id, billing_id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        customer_id
      });
    }

    journalEntries.push({
      debit_amount: (grand_total),
      credit_amount: 0,
      chart_account_id: 168,
      entity_id,
      financial_id,
      entry_status: 'Sales Voucher',
      document_number,
      customer_id,
      branch_id,
      billing_id,
      party_type: 'CUSTOMER',
      currency_id: currency_id,
      currency_rate: currencyExist?.rate,
    });

    if (parseInt(less_amount) > 0) {
      journalEntries.push({
        debit_amount: 0.00,
        credit_amount: (less_amount),
        chart_account_id: 168,
        entity_id,
        customer_id: customer_id,
        branch_id,
        financial_id, billing_id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        entry_status: 'CREDIT NOTE',
        document_number: document_number,
        party_type: 'CUSTOMER'
      });

      journalEntries.push({
        debit_amount: (less_amount),
        credit_amount: 0.00,
        chart_account_id: 209,
        entity_id,
        branch_id, billing_id,
        financial_id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        entry_status: 'CREDIT NOTE',
        document_number: document_number,
        customer_id
      });

      const debitNote = await db.creditDebitNote.create({
        amount: (less_amount),
        builder_date: transaction_date,
        document_number: document_number,
        note_type: 'CREDIT NOTE',
        entity_id,
        sales_journal_id: createSalesJournal.id,
        currency_id: currency_id,
        currency_rate: currencyExist?.rate,
        customer_id,
      }, { transaction });

      await db.creditDebitNoteItem.create({
        credit_debit_note_id: debitNote.id,
        total_with_gst: (less_amount),
        total_discount_amount: 0.00,
        total_price: (less_amount)
      }, { transaction });
    }

    await db.financial_And_Account_Journal_List.bulkCreate(
      journalEntries,
      { transaction }
    );

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: 'Sales Journal Created Successfully'
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};
module.exports.getSalesJournalList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
        const [getDataList] = await db.sequelize.query(
            `SELECT P.* ,MB.branch_name,S.company_name AS customer_name,'CUSTOMER' AS party_type
FROM SALES_JOURNAL AS P
LEFT JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
LEFT JOIN CUSTOMER_PROFILE_MST AS S ON S.id=P.customer_id
            WHERE P.entity_id=${entity_id} ORDER BY P.id DESC`
        )
       
        if(getDataList){
            return res.status(200).send({code:200,message:'success',data:getDataList})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:[]})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message   })
    }
}

module.exports.generateSalesJournalNumber = async (req, res) => {
    try {
      const lastEntry = await db.salesJournal.findOne({
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
        number = `ACC-SJ-${currentYear}-00001`;
      }
      return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


module.exports.generatesalesJournalNumber = async (req, res) => {
  try {
    const { branch_id, voucher_id } = req.body;

    const branchExist = await db.tbl_branch.findOne({
      where: { id: branch_id },
      attributes: ['id', 'branch_name']
    });
    if (!branchExist) {
      return res.status(400).send({ message: "Invalid branch" });
    }

    const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();

    const voucherMainListExist = await db.voucherMainList.findOne({
      where: { id: voucher_id },
      attributes: ['id', 'voucher_main_id', 'voucher_name']
    });
    if (!voucherMainListExist) {
      return res.status(400).send({ message: "Invalid voucher" });
    }

    const voucherMainExist = await db.voucherMain.findOne({
      where: { id: voucherMainListExist.voucher_main_id },
      attributes: ['id', 'name']
    });

    const voucherPrefixed = voucherMainExist.name
      .split(' ')
      .map(w => w[0].toUpperCase())
      .join('');

    const voucherPrefixedMainList = voucherMainListExist.voucher_name
      .split(' ')
      .map(w => w[0].toUpperCase())
      .join('');

    // 🔑 Get last number for SAME branch + voucher
    const lastEntry = await db.salesJournal.findOne({
      where: {
        document_number: {
          [db.Sequelize.Op.like]:
            `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-%`
        }
      },
      order: [["createdAt", "DESC"]],
      attributes: ["document_number"],
    });

    const currentYear = new Date().getFullYear();
    let number;

    if (lastEntry?.document_number) {
      const lastCode = lastEntry.document_number;
      const parts = lastCode.split('-');

      const lastYear = parts[3];        // year
      let running = parseInt(parts[4]); // running number

      if (lastYear !== String(currentYear)) {
        number = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-00001`;
      } else {
        running += 1;
        number = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-${String(running).padStart(5, '0')}`;
      }
    } else {
      number = `${branchPrefix}-${voucherPrefixed}-${voucherPrefixedMainList}-${currentYear}-00001`;
    }

    return res.status(200).send({
      code: 200,
      message: "Code Generated",
      data: number
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};


module.exports.getsalesJournalById = async (req, res) => {
  try {
    const { id } = req.query;
    const [getDataList] = await db.sequelize.query(
      `SELECT P.* ,MB.branch_name,S.company_name AS customer_name
      FROM SALES_JOURNAL AS P
        INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
      LEFT JOIN CUSTOMER_PROFILE_MST AS S ON S.id=P.customer_id
      WHERE P.id=${id}`
  )
  const [itemList] = await db.sequelize.query(
    `SELECT S.*,M.item_code
FROM SALES_JOURNAL AS P
INNER JOIN SALES_JOURNAL_ACCOUNT_LIST AS S ON S.sales_journal_id=P.id
INNER JOIN MASTER_ITEM AS M ON M.id=S.item_id
    WHERE P.id=${id}`
)
  const Obj = {
    ...getDataList[0],
    Account_details:itemList
  }
  if(getDataList.length > 0){
    return res.status(200).send({code:200,message:'Success',data:Obj})
  }else{
    return res.status(404).send({code:404,message:'Data Not Found',data:[]})
  }

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};