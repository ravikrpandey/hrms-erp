const db = require('../../../models/index')
const path = require("path");
const fs = require("fs");
const { generatePDF } = require("../../../../app/common/pdfConverter");


module.exports.createCashPayment = async(req,res)=>{
  const transaction =await db.sequelize.transaction();
    try {
        let {posting_date,document_value,employee_id, payment_advice_ids,document_number_id,amount_due,document_number, transaction_date,journalDocument, notes, reference, reference_date,voucher_id, branch_id, entity_id,Account_details,manage_advance,document_type, party_type, vendor_id, 
          customer_id,sales_quotation_id,
          currency_rate, po_id, grn_id,financial_id, reference_number,invoice_id, sales_order_id, delivery_order_id, sales_invoice_id,others,purchase_journal_id,
           currency_id
        } = req.body;
     
        if (!reference_date || reference_date === 'Invalid date') {
          reference_date = null;
        }
        
     if (payment_advice_ids == 'PAYMENT_ADVICE_NUMBER') {

  const total_amount = Account_details.reduce(
    (total, row) => total + parseFloat(row.credit_amount || 0),
    0
  );



 
  const createCashPayment = await db.cashPayment.create({
    posting_date,
    document_value: document_value,
    document_number,
    transaction_date,
    cheque_ref_no: reference,
    branch_id,
    entity_id,
    voucher_list_id: voucher_id,
    manage_advance,
    document_type,
    party_type,
    currency_id,
      currency_rate,
    vendor_id,
    purchase_journal_id,
    payment_advice_ids,
    others
  }, { transaction });

  const amountDue = parseFloat(amount_due);
  const paymentAmount = parseFloat(total_amount || 0);

  if (paymentAmount > amountDue) {
    await transaction.rollback();
    return res.status(400).send({
      code: 400,
      message: `Payment amount cannot exceed Amount Due. Amount Due is ${amountDue}`
    });
  }

  const createData = await db.paymentProgram.create(
    {
      amount: document_value,
      reference_number: document_number,
      document_type: 'Payment Program Advice',
      entity_id: entity_id,
      document_number: document_number,
      payment_status: 'Payment Program Advice',
      payment_program_status:'Approved'
    },{transaction}
  );

  await db.paymentProgramList.create(
    {
      vendor_id,
      document_no:reference_number,
      amount_due:amount_due,
      paid_amount: total_amount,
      total_amount: document_value,
      cash_payment_id: createCashPayment.id,
      payment_program_id : createData.id
    },{transaction}
  );

  await Promise.all(
    Account_details.map(async (i) => {
      let {
        chart_account_id,
        debit_amount,
        nature_id,
        credit_amount,
        bank_id,
        tds_id,
        tds,
        tds_rate,
        tds_rate_amount,
        gross_amount,
        cost_center_id,
        profit_center_id,
        currency_id,
        remarks
      } = i;

      await db.cashPaymentAccount.create({
        debit_amount,
        credit_amount,
        tds,
        nature_id,
        tds_rate,
        tds_rate_amount,
        tds_id,
        gross_amount,
        cash_payment_id: createCashPayment.id,
        bank_id,
        party_type,
        amount_due: parseFloat(total_amount || 0) - parseFloat(amount_due || 0),
        vendor_id,
        cost_center_id,
        profit_center_id,
        chart_account_id,
        remarks,
        currency_id
      }, { transaction }); 
      await db.cashPaymentAccount.create({
        debit_amount: total_amount,
        credit_amount: 0.00,
        tds,
        nature_id,
        tds_rate,
        tds_rate_amount,
        tds_id,
        gross_amount,
        cash_payment_id: createCashPayment.id,
        bank_id,
        party_type,
        amount_due: parseFloat(total_amount || 0) - parseFloat(amount_due || 0),
        vendor_id,
        cost_center_id,
        profit_center_id,
        chart_account_id:51,
        currency_id
      }, { transaction });
    })
  );

  const groupedEntries = {};

  Account_details.forEach((item) => {
    const key = `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;

    if (!groupedEntries[key]) {
      groupedEntries[key] = {
        cost_center_id: item.cost_center_id,
        profit_center_id: item.profit_center_id,
        chart_account_id: item.chart_account_id,
        credit_amount: 0,
        tds_rate_amount: 0,
        nature_id: item.nature_id,
        tds_id: item.tds_id
      };
    }

    groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
    groupedEntries[key].tds_rate_amount += parseFloat(item.tds_rate_amount || 0);
  });

  let totalVendorAmount = 0;

  for (const key in groupedEntries) {
    const item = groupedEntries[key];
    totalVendorAmount += parseFloat(item.credit_amount || 0);
  }

  for (const key in groupedEntries) {
    const item = groupedEntries[key];

    if (parseFloat(item.tds_rate_amount || 0) > 0) {
      await db.financial_And_Account_Journal_List.create({
        debit_amount: 0.00,
        credit_amount: item.tds_rate_amount,
        entry_status: 'Payment Advice Payment',
        document_number: document_number,
        cost_center_id: item.cost_center_id,
        profit_center_id: item.profit_center_id,
        chart_account_id: tdsData.chart_account_id,
        tds_id: item.tds_id,
        nature_id: item.nature_id,
        entity_id,
        financial_id,currency_id,
        currency_rate
      }, { transaction });
    }

    await db.financial_And_Account_Journal_List.create({
      debit_amount: 0.00,
      credit_amount: parseFloat(item.credit_amount || 0) - parseFloat(item.tds_rate_amount || 0),
      entry_status: 'Payment Advice Payment',
      document_number: document_number,
      cost_center_id: item.cost_center_id,
      profit_center_id: item.profit_center_id,
      chart_account_id: item.chart_account_id,
      entity_id,
      financial_id,currency_id,
      currency_rate
    }, { transaction });
  }

  await db.financial_And_Account_Journal_List.create({
    debit_amount: total_amount,
    credit_amount: 0.00,
    party_type: 'VENDOR',
    entry_status: 'Payment Advice Payment',
    document_number: document_number,
    vendor_id,
    chart_account_id: 51,
    entity_id,
    financial_id,currency_id,
    currency_rate
  }, { transaction });

  await transaction.commit();

  return res.status(200).send({
    code: 200,
    message: 'Payment Advice Payment Created Successfully'
  });

}

        if (payment_advice_ids == 'Transport') {

          const total_amount = Account_details.reduce(
            (total, row) => total + parseFloat(row.credit_amount || 0),
            0
          );
        
         
          const transportExist = await db.transportVoucher.findOne({
            where: { id: document_number_id },
            transaction
          });
        
          if (!transportExist) {
            throw new Error('Transport Voucher Not Found');
          }
        
       
          const paymentProgramExist = await db.paymentProgramList.findOne({
            where: {
              transport_voucher_id: transportExist.id
            },
            order: [['id', 'DESC']],
            transaction
          });
        
          if (!paymentProgramExist) {
            throw new Error('Payment Program List Not Found');
          }
        
         
          const updatedRows = await db.paymentProgram.create(
            {
              amount: paymentProgramExist.total_amount,
              reference_number: document_number,
              document_type: 'Transport',
              entity_id,
              document_number:document_number,
              payment_status: 'Transport Payment',
              payment_program_status: 'Approved'
            },
            {
              transaction
            }
          );
      
         
          
        
      
          const createCashPayment = await db.cashPayment.create({
        
            posting_date,
        
            document_value: transportExist.grand_total,
        
            document_number,
        
            transaction_date,
        
            notes,
        
            cheque_ref_no: reference,
        
            branch_id,
        
            entity_id,
        
            voucher_list_id: voucher_id,
        
            manage_advance,
        
            document_type,
        
            party_type,
        
            vendor_id,
        
            purchase_journal_id,
        
            payment_advice_ids,
        
            others
        
          }, { transaction });

          const amountDue = parseFloat(paymentProgramExist.amount_due || 0);
          const paymentAmount = parseFloat(total_amount || 0);
          
          if (paymentAmount > amountDue) {
            await transaction.rollback();
          
            return res.status(400).send({
              code: 400,
              message: `Payment amount cannot exceed Amount Due. Amount Due is ${amountDue}`
            });
          }
          await db.paymentProgramList.create(
            {
              vendor_id,
              amount_due: parseFloat(paymentProgramExist.amount_due) - parseFloat(total_amount),
              paid_amount: total_amount,
              total_amount: paymentProgramExist.total_amount,
              cash_payment_id: createCashPayment.id,
              transport_voucher_id:document_number_id,
              payment_program_id:updatedRows.id,
            },
            {
              transaction
            }
          );
          await Promise.all(
        
            Account_details.map(async (i) => {
              let {
                debit_amount,
                credit_amount,
                bank_id,
                chart_account_id,
                gross_amount,
                cost_center_id,
                profit_center_id,
         
                remarks,
                currency_id
        
              } = i;
        
              await db.cashPaymentAccount.create({
                debit_amount,
                credit_amount,
                gross_amount,
                cash_payment_id: createCashPayment.id,
                bank_id,
                party_type,
                amount_due: 0.00,
                vendor_id,
                remarks,
                cost_center_id,
                profit_center_id,
                chart_account_id,
                currency_id
              }, { transaction });
        await db.cashPaymentAccount.create({
                debit_amount: total_amount,
                credit_amount: 0.00,
                gross_amount,
                cash_payment_id: createCashPayment.id,
                bank_id,
                party_type,
                amount_due: 0.00,
                vendor_id,
                cost_center_id,
                profit_center_id,
                chart_account_id:51,
                currency_id
              }, { transaction });
        
            })
        
          );
       
          const groupedEntries = {};
        
          Account_details.forEach((item) => {
        
            const key =
              `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;
            if (!groupedEntries[key]) {
              groupedEntries[key] = {
                cost_center_id: item.cost_center_id,
                profit_center_id: item.profit_center_id,
                chart_account_id: item.chart_account_id,
                credit_amount: 0
              };
            }
        
            groupedEntries[key].credit_amount +=
              parseFloat(item.credit_amount || 0);
          });
      
          for (const key in groupedEntries) {
            const item = groupedEntries[key];
        
            await db.financial_And_Account_Journal_List.create({
        
              debit_amount: 0.00,
        
              credit_amount: parseFloat(item.credit_amount || 0),
        
              entry_status: 'Transport Payment',
        
              document_number: document_number,
        
              cost_center_id: item.cost_center_id,
        
              profit_center_id: item.profit_center_id,
        
              chart_account_id: item.chart_account_id,
        
              entity_id,
        
              financial_id,currency_id,
              currency_rate
        
            }, { transaction });
        
          }
          await db.financial_And_Account_Journal_List.create({
            debit_amount: total_amount,
            credit_amount: 0.00,
            party_type: 'VENDOR',
            entry_status: 'Transport Payment',
            document_number: document_number,
            vendor_id,
            chart_account_id: 51,
            entity_id,
            financial_id,currency_id,
            currency_rate
          }, { transaction });
      
         
          await transaction.commit();
        
          return res.status(200).send({
            code: 200,
            message: 'Transport Payment Created Successfully'
          });
        
        }
        if (payment_advice_ids == 'PURCHASE_JOURNAL_NUMBER') {
        
                  const total_amount = Account_details.reduce(
                    (total, row) => total + parseFloat(row.credit_amount || 0),
                    0
                  );
               
                  const serviceExist = await db.purchaseJournal.findOne({
                    where: { id: document_number_id },
                    transaction
                  });
                  const paymentProgramExist = await db.paymentProgramList.findOne({
                    where: { purchase_journal_id: document_number_id },
                    order: [['id', 'DESC']],
                    transaction
                  });
               
                  const updatedRows = await db.paymentProgram.create(
                    {
                      amount:  paymentProgramExist.total_amount,
                      reference_number: document_number,
                      document_type: 'Purchase Journal',
                      entity_id,
                      document_number: reference_number,
                      payment_status: 'Purchase Journal',
                      payment_program_status: 'Approved'
                    },{transaction}
                  );
                  
                  const createBankPayment = await db.cashPayment.create(
                    {
                      posting_date,
                      document_value: serviceExist.grand_total,
                      document_number,
                      transaction_date,
                      notes,
                      cheque_ref_no: reference,
                     
                      branch_id,
                      entity_id,
                      voucher_list_id: voucher_id,
                      manage_advance,
                      document_type,
                      party_type,
                      vendor_id,
                      purchase_journal_id,
                      payment_advice_ids,
                      others
                    },
                    { transaction }
                  );
                  const amountDue = parseFloat(paymentProgramExist.amount_due || 0);
const paymentAmount = parseFloat(total_amount || 0);

if (paymentAmount > amountDue) {
  await transaction.rollback();

  return res.status(400).send({
    code: 400,
    message: `Payment amount cannot exceed Amount Due. Amount Due is ${amountDue}`
  });
}
                  await db.paymentProgramList.create(
                    {
                      vendor_id,
                      amount_due: parseFloat(paymentProgramExist.amount_due) - parseFloat(total_amount),
                      paid_amount: total_amount,
                      total_amount: paymentProgramExist.total_amount,
                      cash_payment_id: createBankPayment.id,
                      purchase_journal_id:document_number_id,
                      payment_program_id:updatedRows.id,
                    },
                    {transaction }
                  );
                 
                  await Promise.all(
                    Account_details.map(async (i) => {
                
                      let {
                        debit_amount,
                        nature_id,
                        credit_amount,
                        bank_id,
                        chart_account_id,
                        cost_center_id,
                        profit_center_id,
                        currency_id,
                        remarks
                      } = i;
                
                      await db.cashPaymentAccount.create({
                        debit_amount,
                        credit_amount,
                      remarks,
                      
                        cash_payment_id: createBankPayment.id,
                        bank_id,
                        amount_due: 0.00,
                        vendor_id,
                        cost_center_id,
                        profit_center_id,
                        chart_account_id: chart_account_id,
                      }, { transaction });
                       await db.cashPaymentAccount.create({
                        debit_amount: total_amount,
                        credit_amount: 0.00,
                        cash_payment_id: createBankPayment.id,
                        bank_id,
                        amount_due: 0.00,
                        vendor_id,
                        cost_center_id,
                        profit_center_id,
                        chart_account_id: 51,
                      }, { transaction });
                
                    })
                  );
                
                
                  const groupedEntries = {};
                
                  Account_details.forEach((item) => {
                
                    const key = `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;
                
                    if (!groupedEntries[key]) {
                      groupedEntries[key] = {
                        cost_center_id: item.cost_center_id,
                        profit_center_id: item.profit_center_id,
                        chart_account_id: item.chart_account_id,
                        credit_amount: 0,
                        // tds_rate_amount: 0,
                        // nature_id: item.nature_id,
                        // tds_id: item.tds_id
                      };
                    }
                
                    groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
                
                    // groupedEntries[key].tds_rate_amount += parseFloat(item.tds_rate_amount || 0);
                
                  });
                
            
                  for (const key in groupedEntries) {
                
                    const item = groupedEntries[key];
                
                    // if (item.tds_rate_amount > 0) {
                
                    //   await db.financial_And_Account_Journal_List.create({
                    //     debit_amount: 0.00,
                    //     credit_amount: item.tds_rate_amount,
                    //     entry_status: 'Purchase Payment',
                    //     document_number: createData.document_number,
                    //     cost_center_id: item.cost_center_id,
                    //     profit_center_id: item.profit_center_id,
                    //     chart_account_id: tdsData.chart_account_id,
                    //     tds_id: item.tds_id,
                    //     nature_id: item.nature_id,
                    //     entity_id,
                    //   }, { transaction });
                
                    // }
                
                  
                    await db.financial_And_Account_Journal_List.create({
                      debit_amount: item.credit_amount,
                      credit_amount: 0.00,
                      party_type: 'VENDOR',
                      entry_status: 'Purchase Payment',
                      document_number: document_number,
                      vendor_id,financial_id,
                      cost_center_id: item.cost_center_id,
                      profit_center_id: item.profit_center_id,
                      chart_account_id: 51,
                      entity_id,
                      currency_id,currency_rate
                    }, { transaction });
                
              
                    await db.financial_And_Account_Journal_List.create({
                      debit_amount: 0.00,
                      credit_amount:
                        parseFloat(item.credit_amount) ,
                      entry_status: 'Purchase Payment',
                      document_number: document_number,
                      financial_id,
                      cost_center_id: item.cost_center_id,
                      profit_center_id: item.profit_center_id,
                
                      chart_account_id: item.chart_account_id,
                      currency_id,currency_rate,
                      entity_id,
                
                    }, { transaction });
                
                  }
                
                  await transaction.commit();
                
                  return res.status(200).send({
                    code: 200,
                    message: 'Cash Payment Created Successfully'
                  });
                
        }
        if (payment_advice_ids == 'travel_expense') {

          const total_amount = Account_details.reduce(
            (total, row) => total + parseFloat(row.credit_amount || 0),
            0
          );
      
          const paymentProgramExist = await db.paymentProgramList.findOne({
            where: { expense_request_id: document_number_id },
            order: [['id', 'DESC']],
            transaction
          });
       
          const updatedRows = await db.paymentProgram.create(
            {
              amount: paymentProgramExist.total_amount,
              reference_number: document_number,
              document_type: 'Travel Expence Cash Payment',
              entity_id,
              document_number: reference_number,
              payment_status: 'Travel Expence Cash Payment',
              payment_program_status:'Approved'
            },{transaction}
          );
          

          const createBankPayment = await db.cashPayment.create(
            {
              posting_date,
              document_value: paymentProgramExist.total_amount,
              document_number,
              transaction_date,
              notes,
              cheque_ref_no: reference,
              voucher_type : payment_advice_ids,
              branch_id,
              entity_id,
              voucher_list_id: voucher_id,
              manage_advance,
              document_type,
              party_type,
              vendor_id,
              purchase_journal_id,
              payment_advice_ids,
              others
            },
            { transaction }
          );
          const amountDue = parseFloat(paymentProgramExist.amount_due || 0);
          const paymentAmount = parseFloat(total_amount || 0);
          
          if (paymentAmount > amountDue) {
            await transaction.rollback();
          
            return res.status(400).send({
              code: 400,
              message: `Payment amount cannot exceed Amount Due. Amount Due is ${amountDue}`
            });
          }
          await db.paymentProgramList.create(
            {
              employee_id,
              amount_due: parseFloat(paymentProgramExist.amount_due) - parseFloat(total_amount),
              paid_amount: total_amount,
              total_amount: paymentProgramExist.total_amount,
              bank_payment_id: createBankPayment.id,
              expense_request_id:document_number_id,
              payment_program_id:updatedRows.id
            },
           { transaction}
          );
          await Promise.all(
            Account_details.map(async (i) => {
              let {
                debit_amount,
                nature_id,
                credit_amount,
                bank_id,
                cost_center_id,
                profit_center_id,
                currency_id,
                chart_account_id,
                remarks
              } = i;
        
              await db.cashPaymentAccount.create({
                debit_amount,
                credit_amount,
                cash_payment_id: createBankPayment.id,
                bank_id,
                amount_due: 0.00,
                vendor_id,
                cost_center_id,
                profit_center_id,
                remarks,
                chart_account_id: chart_account_id,
              }, { transaction });
              await db.cashPaymentAccount.create({
                debit_amount: total_amount,
                credit_amount: 0.00,
                cash_payment_id: createBankPayment.id,
                bank_id,
                amount_due: 0.00,
                vendor_id,
                cost_center_id,
                profit_center_id,
                chart_account_id: 85,
              }, { transaction });
        
            })
          );
        
          const groupedEntries = {};
        
          for (const item of Account_details) {
            const key = `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;
            if (!groupedEntries[key]) {
              groupedEntries[key] = {
                cost_center_id: item.cost_center_id,
                profit_center_id: item.profit_center_id,
                chart_account_id: chart_account_id, 
                credit_amount: 0,
              };
            }
          
            groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
          }
        
    
          for (const key in groupedEntries) {
            const item = groupedEntries[key];
            await db.financial_And_Account_Journal_List.create({
              debit_amount: 0.00,
              credit_amount:
                parseFloat(item.credit_amount) ,
              entry_status: 'Travel Expence Cash Payment',
              document_number: document_number,
              financial_id,
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: item.chart_account_id,
              entity_id, currency_id,currency_rate
            }, { transaction });
        
          }
       
          await db.financial_And_Account_Journal_List.create({
            debit_amount: total_amount,
            credit_amount: 0.00,
            party_type: 'EMPLOYEE',
            entry_status: 'Travel Expence Cash Payment',
            document_number: document_number,
            financial_id,
            chart_account_id: 85,
            entity_id,
            employee_id, currency_id,currency_rate
          }, { transaction });
          await transaction.commit();
        
          return res.status(200).send({
            code: 200,
            message: 'Cash Payment Created Successfully'
          });
        
        }
     if (payment_advice_ids == 'other_expense') {

  const total_amount = Account_details.reduce(
    (total, row) => total + parseFloat(row.credit_amount || 0),
    0
  );

  const paymentProgramExist = await db.paymentProgramList.findOne({
    where: { expense_request_id: document_number_id },
    order: [['id', 'DESC']],
    transaction
  });

  const updatedRows = await db.paymentProgram.create(
    {
      amount: paymentProgramExist.total_amount,
      reference_number: document_number,
      document_type: 'Other Expence Cash Payment',
      entity_id,
      document_number: reference_number,
      payment_status: 'Other Expence Cash Payment',
      payment_program_status:'Approved'
    },{transaction}
  );

  const createCashPayment = await db.cashPayment.create(
    {
      posting_date,
      document_value: paymentProgramExist.total_amount,
      document_number,
      transaction_date,
      notes,
      cheque_ref_no: reference,
      branch_id,
      entity_id,
      voucher_list_id: voucher_id,
      manage_advance,
      document_type,
      party_type,
      vendor_id,
      purchase_journal_id,
      payment_advice_ids,
      others
    },
    { transaction }
  );
  
  const amountDue = parseFloat(paymentProgramExist.amount_due || 0);
  const paymentAmount = parseFloat(total_amount || 0);
  
  if (paymentAmount > amountDue) {
    await transaction.rollback();
    return res.status(400).send({
      code: 400,
      message: `Payment amount cannot exceed Amount Due. Amount Due is ${amountDue}`
    });
  }
  
  await db.paymentProgramList.create(
    {
      employee_id,
      amount_due: parseFloat(paymentProgramExist.amount_due) - parseFloat(total_amount),
      paid_amount: total_amount,
      total_amount: paymentProgramExist.total_amount,
      cash_payment_id: createCashPayment.id,
      expense_request_id:document_number_id,
      payment_program_id:updatedRows.id
    },
    { transaction}
  );
  
  await Promise.all(
    Account_details.map(async (i) => {
      let {
        debit_amount,
        nature_id,
        credit_amount,
        bank_id,
        cost_center_id,
        profit_center_id,
        currency_id,
        chart_account_id,
        remarks
      } = i;

      await db.cashPaymentAccount.create({
        debit_amount,
        credit_amount,
        cash_payment_id: createCashPayment.id,
        bank_id,
        amount_due: 0.00,
        vendor_id,
        cost_center_id,
        profit_center_id,
        remarks,
        chart_account_id: chart_account_id,
      }, { transaction }); 
      await db.cashPaymentAccount.create({
        debit_amount: total_amount,
        credit_amount: 0.00,
        cash_payment_id: createCashPayment.id,
        bank_id,
        amount_due: 0.00,
        vendor_id,
        cost_center_id,
        profit_center_id,
        chart_account_id: 85,
      }, { transaction });

    })
  );

  const groupedEntries = {};

  for (const item of Account_details) {
    const key = `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;
    if (!groupedEntries[key]) {
      groupedEntries[key] = {
        cost_center_id: item.cost_center_id,
        profit_center_id: item.profit_center_id,
        chart_account_id: item.chart_account_id, 
        credit_amount: 0,
      };
    }
    groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
  }

  for (const key in groupedEntries) {
    const item = groupedEntries[key];
    await db.financial_And_Account_Journal_List.create({
      debit_amount: 0.00,
      credit_amount: parseFloat(item.credit_amount),
      entry_status: 'Other Expence Cash Payment',
      document_number: document_number,
      financial_id,
      cost_center_id: item.cost_center_id,
      profit_center_id: item.profit_center_id,
      chart_account_id: item.chart_account_id,
      entity_id, currency_id,currency_rate
    }, { transaction });
  }

  await db.financial_And_Account_Journal_List.create({
    debit_amount: total_amount,
    credit_amount: 0.00,
    party_type: 'EMPLOYEE',
    entry_status: 'Other Expence Cash Payment',
    document_number: document_number,
    financial_id,
    chart_account_id: 85,
    entity_id,
    employee_id, currency_id,currency_rate
  }, { transaction });
  
  await transaction.commit();

  return res.status(200).send({
    code: 200,
    message: 'Cash Payment Created Successfully'
  });

}
        if (payment_advice_ids == 'Reimbursement_expense') {
 
          const total_amount = Account_details.reduce(
            (total, row) => total + parseFloat(row.credit_amount || 0),
            0
          );
       
          const paymentProgramExist = await db.paymentProgramList.findOne({
            where: { expense_request_id: document_number_id },
            order: [['id', 'DESC']],
            transaction
          });
       
          const updatedRows = await db.paymentProgram.create(
            {
              amount: paymentProgramExist.total_amount,
              reference_number: document_number,
              document_type: 'Travel Expence Cash Payment',
              entity_id,
              document_number: reference_number,
              payment_status: 'Travel Expence Cash Payment',
              payment_program_status:'Approved'
            },{transaction}
          );
          

          const createBankPayment = await db.cashPayment.create(
            {
              posting_date,
              document_value: paymentProgramExist.total_amount,
              document_number,
              transaction_date,
              notes,
              cheque_ref_no: reference,
              voucher_type : payment_advice_ids,
              branch_id,
              entity_id,
              voucher_list_id: voucher_id,
              manage_advance,
              document_type,
              party_type,
              vendor_id,
              purchase_journal_id,
              payment_advice_ids,
              others
            },
            { transaction }
          );
          const amountDue = parseFloat(paymentProgramExist.amount_due || 0);
          const paymentAmount = parseFloat(total_amount || 0);
          
          if (paymentAmount > amountDue) {
            await transaction.rollback();
          
            return res.status(400).send({
              code: 400,
              message: `Payment amount cannot exceed Amount Due. Amount Due is ${amountDue}`
            });
          }
          await db.paymentProgramList.create(
            {
              employee_id,
              amount_due: parseFloat(paymentProgramExist.amount_due) - parseFloat(total_amount),
              paid_amount: total_amount,
              total_amount: paymentProgramExist.total_amount,
              cash_payment_id: createBankPayment.id,
              expense_request_id:document_number_id,
              payment_program_id:updatedRows.id
            },
           { transaction}
          );
          await Promise.all(
            Account_details.map(async (i) => {
              let {
                debit_amount,
                nature_id,
                credit_amount,
                bank_id,
                cost_center_id,
                profit_center_id,
                currency_id,chart_account_id,remarks
              } = i;
        
              await db.cashPaymentAccount.create({
                debit_amount,
                credit_amount,
                cash_payment_id: createBankPayment.id,
                bank_id,
                amount_due: 0.00,
                vendor_id,
                cost_center_id,
                profit_center_id,
                remarks,
                chart_account_id: chart_account_id,
              }, { transaction });
               await db.cashPaymentAccount.create({
                debit_amount: total_amount,
                credit_amount: 0.00,
                cash_payment_id: createBankPayment.id,
                bank_id,
                amount_due: 0.00,
                vendor_id,
                cost_center_id,
                profit_center_id,
                chart_account_id: 85,
              }, { transaction });
        
            })
          );
        
        
          const groupedEntries = {};
        
          for (const item of Account_details) {
            const key = `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;
            if (!groupedEntries[key]) {
              groupedEntries[key] = {
                cost_center_id: item.cost_center_id,
                profit_center_id: item.profit_center_id,
                chart_account_id: item.chart_account_id, 
                credit_amount: 0,
              };
            }
          
            groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
          }
        
    
          for (const key in groupedEntries) {
            const item = groupedEntries[key];
            await db.financial_And_Account_Journal_List.create({
              debit_amount: 0.00,
              credit_amount:
                parseFloat(item.credit_amount) ,
              entry_status: 'Travel Expence Cash Payment',
              document_number: document_number,
              financial_id,
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: key.chart_account_id,
               party_type: 'EMPLOYEE',
            employee_id,
              entity_id, currency_id,currency_rate
            }, { transaction });
        
          }
       
          await db.financial_And_Account_Journal_List.create({
            debit_amount: total_amount,
            credit_amount: 0.00,
            party_type: 'EMPLOYEE',
            entry_status: 'Travel Expence Cash Payment',
            document_number: document_number,
            financial_id,
            chart_account_id: 85,
            entity_id,
            employee_id, currency_id,currency_rate
          }, { transaction });
          await transaction.commit();
        
          return res.status(200).send({
            code: 200,
            message: 'Cash Payment Created Successfully'
          });
        
        }
        
   if (payment_advice_ids == 'Purchase_service_voucher') {
        
                  const total_amount = Account_details.reduce(
                    (total, row) => total + parseFloat(row.credit_amount || 0),
                    0
                  );
                
                  const purchaseService = await db.purchaseServiceVoucher.findOne({
                    where: { id: document_number_id },
                    transaction
                  });
                  const paymentProgramExist = await db.paymentProgramList.findOne({
                    where: { purchase_service_voucher_id: document_number_id },
                    order: [['id', 'DESC']],
                    transaction
                  });
               
                  const updatedRows = await db.paymentProgram.create(
                    {
                      amount:  paymentProgramExist.total_amount,
                      reference_number: document_number,
                      document_type: 'Purchase Service Voucher',
                      entity_id,
                      document_number: reference_number,
                      payment_status: 'Purchase Service Voucher',
                      payment_program_status: 'Approved'
                    },{transaction}
                  );
                  
                 
                
                  
                
                  const createBankPayment = await db.cashPayment.create(
                    {
                      posting_date,
                      document_value: purchaseService.grand_total,
                      document_number,
                      transaction_date,
                      notes,
                      cheque_ref_no: reference,
                     
                      branch_id,
                      entity_id,
                      voucher_list_id: voucher_id,
                      manage_advance,
                      document_type,
                      party_type,
                      vendor_id,
                       
                      payment_advice_ids,
                      others
                    },
                    { transaction }
                  );
                  const amountDue = parseFloat(paymentProgramExist.amount_due || 0);
const paymentAmount = parseFloat(total_amount || 0);

if (paymentAmount > amountDue) {
  await transaction.rollback();

  return res.status(400).send({
    code: 400,
    message: `Payment amount cannot exceed Amount Due. Amount Due is ${amountDue}`
  });
}
                  await db.paymentProgramList.create(
                    {
                      vendor_id,
                      amount_due: parseFloat(paymentProgramExist.amount_due) - parseFloat(total_amount),
                      paid_amount: total_amount,
                      total_amount: paymentProgramExist.total_amount,
                      cash_payment_id: createBankPayment.id,
                      purchase_service_voucher_id:document_number_id,
                      payment_program_id:updatedRows.id,
                    },
                    {transaction }
                  );
               
                  await Promise.all(
                    Account_details.map(async (i) => {
                
                      let {
                        debit_amount,
                        nature_id,
                        credit_amount,
                        bank_id,
                        chart_account_id,
                        cost_center_id,
                        profit_center_id,
                        currency_id,
                        remarks
                      } = i;
                
                      await db.cashPaymentAccount.create({
                        debit_amount,
                        credit_amount,
                      remarks,
                      
                        cash_payment_id: createBankPayment.id,
                        bank_id,
                        amount_due: 0.00,
                        vendor_id,
                        cost_center_id,
                        profit_center_id,
                        chart_account_id: chart_account_id,
                      }, { transaction });
                      await db.cashPaymentAccount.create({
                        debit_amount: total_amount,
                        credit_amount: 0.00,
                        cash_payment_id: createBankPayment.id,
                        bank_id,
                        amount_due: 0.00,
                        vendor_id,
                        cost_center_id,
                        profit_center_id,
                        chart_account_id: 51,
                   
                      }, { transaction });
                
                    })
                  );
                
                
                  const groupedEntries = {};
                
                  Account_details.forEach((item) => {
                
                    const key = `${item.cost_center_id}_${item.profit_center_id}_${item.chart_account_id}`;
                
                    if (!groupedEntries[key]) {
                      groupedEntries[key] = {
                        cost_center_id: item.cost_center_id,
                        profit_center_id: item.profit_center_id,
                        chart_account_id: item.chart_account_id,
                        credit_amount: 0,
                        // tds_rate_amount: 0,
                        // nature_id: item.nature_id,
                        // tds_id: item.tds_id
                      };
                    }
                
                    groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
                
                    // groupedEntries[key].tds_rate_amount += parseFloat(item.tds_rate_amount || 0);
                
                  });
                
            
                  for (const key in groupedEntries) {
                
                    const item = groupedEntries[key];
                
                    // if (item.tds_rate_amount > 0) {
                
                    //   await db.financial_And_Account_Journal_List.create({
                    //     debit_amount: 0.00,
                    //     credit_amount: item.tds_rate_amount,
                    //     entry_status: 'Purchase Payment',
                    //     document_number: createData.document_number,
                    //     cost_center_id: item.cost_center_id,
                    //     profit_center_id: item.profit_center_id,
                    //     chart_account_id: tdsData.chart_account_id,
                    //     tds_id: item.tds_id,
                    //     nature_id: item.nature_id,
                    //     entity_id,
                    //   }, { transaction });
                
                    // }
                
                  
                    await db.financial_And_Account_Journal_List.create({
                      debit_amount: item.credit_amount,
                      credit_amount: 0.00,
                      party_type: 'VENDOR',
                      entry_status: 'Purchase Payment',
                      document_number: document_number,
                      vendor_id,financial_id,
                      cost_center_id: item.cost_center_id,
                      profit_center_id: item.profit_center_id,
                      chart_account_id: 51,
                      entity_id, currency_id,currency_rate
                    }, { transaction });
                
              
                    await db.financial_And_Account_Journal_List.create({
                      debit_amount: 0.00,
                      credit_amount:
                        parseFloat(item.credit_amount) ,
                      entry_status: 'Purchase Payment',
                      document_number: document_number,
                      financial_id,
                      cost_center_id: item.cost_center_id,
                      profit_center_id: item.profit_center_id,
                      currency_id,currency_rate,
                      chart_account_id: item.chart_account_id,
                
                      entity_id,
                
                    }, { transaction });
                
                  }
                
                  await transaction.commit();
                
                  return res.status(200).send({
                    code: 200,
                    message: 'Cash Payment Created Successfully'
                  });
                
        }


     
      if (vendor_id) {
        party_type = 'VENDOR';
      
        if (!payment_advice_ids && !document_type) {
      
          let remainingAmount = parseFloat(Account_details?.[0]?.credit_amount || 0);
      
          const [dataList] = await db.sequelize.query(`
            SELECT * FROM GRN_MASTER 
            WHERE payment_status != 'PAID' 
            AND vendor_id = ?
          `, {
            replacements: [vendor_id]
          });
      
          if (!dataList.length) {
            throw new Error("No GRN found for vendor");
          }
      
          const createData = await db.paymentProgram.create({
            amount: remainingAmount,
            reference_number: document_number,
            document_type,
            entity_id: dataList[0].entity_id,
            document_number: dataList[0].invoiceNo,
            payment_status: 'Cash Payment'
          }, { transaction });
      
          for (const i of dataList) {
      
            const id = i.id;
            const invoiceTotal = parseFloat(i.total_amount || 0);
      
            if (remainingAmount <= 0) break;
      
            const invoiceExist = await db.grnMaster.findOne({
              where: { id },
              attributes: ['id', 'total_amount'],
              transaction
            });
      
            if (!invoiceExist) continue;
      
            const paymentExist = await db.paymentProgramList.findOne({
              where: { invoice_id: invoiceExist.id },
              order: [['id', 'DESC']],
              transaction
            });
      
            let dueAmount = paymentExist
              ? parseFloat(paymentExist.amount_due || 0)
              : invoiceTotal;
      
            let Obj = {};
      
            if (remainingAmount >= dueAmount) {
      
              Obj.payment_status = "PAID";
      
              await db.grnMaster.update(
                Obj,
                { where: { id }, transaction }
              );
      
              await db.paymentProgramList.create({
                vendor_id,
                invoice_id: id,
                amount_due: 0,
                paid_amount: dueAmount,
                total_amount: invoiceTotal,
                payment_program_id: createData.id
              }, { transaction });
      
              remainingAmount -= dueAmount;
      
            } else {
      
              Obj.payment_status = "PARTIALLY PAID";
      
              await db.grnMaster.update(
                Obj,
                { where: { id }, transaction }
              );
      
              await db.paymentProgramList.create({
                vendor_id,
                invoice_id: id,
                amount_due: dueAmount - remainingAmount,
                paid_amount: remainingAmount,
                total_amount: invoiceTotal,
                payment_program_id: createData.id
              }, { transaction });
      
              remainingAmount = 0;
              break;
            }
          }
        }
      }
       if(customer_id){
        party_type ='CUSTOMER'
       }
       if(employee_id){
        party_type='EMPLOYEE'
       }
       const total_amount = Account_details.reduce(
        (total, row) => total + parseFloat(row.credit_amount || 0),
        0
      );

       const createCashPayment = await db.cashPayment.create({
        posting_date,
        sales_quotation_id,
        document_value,
        employee_id,
        customer_id,
        reference_number,
        document_number,
        transaction_date,
        notes,
        cheque_ref_no: reference,
        cheque_ref_date: reference_date,
        voucher_list_id: voucher_id,
        branch_id,
        entity_id,
        manage_advance,
        document_type,
        party_type,
        vendor_id,
        po_id,
        grn_id,
        invoice_id,
        sales_order_id,
        delivery_order_id,
        sales_invoice_id,
        others,
        purchase_journal_id
      }, { transaction });
    
      await Promise.all(Account_details.map(async i => {
        const { debit_amount,tds_id,nature_id, credit_amount,bank_id,surcharge_rate, cess_rate,narration, tds, tds_rate, tds_rate_amount, surcharge, surcharge_rate_amount, cess, cess_rate_amount, gross_amount, 
           product_id, cost_center_id, profit_center_id, chart_account_id, currency_id } = i;
        await db.cashPaymentAccount.create({
          debit_amount, credit_amount, narration, tds_id,nature_id,tds, tds_rate,party_type:party_type, surcharge_rate,tds_rate_amount, surcharge, surcharge_amount:surcharge_rate_amount, cess, cess_amount:cess_rate_amount, gross_amount, 
          cash_payment_id: createCashPayment.id,cess_rate, bank_id,amount_due,
            product_id, cost_center_id, profit_center_id, chart_account_id, currency_id
        },{transaction});
        await db.cashPaymentAccount.create({
          debit_amount: total_amount,
          credit_amount: 0.00, narration, tds_id,nature_id,tds, tds_rate,party_type:party_type, surcharge_rate,tds_rate_amount, surcharge, surcharge_amount:surcharge_rate_amount, cess, cess_amount:cess_rate_amount, gross_amount, 
          cash_payment_id: createCashPayment.id,cess_rate, bank_id,amount_due,
            product_id, cost_center_id, profit_center_id, chart_account_id:51, currency_id
        },{transaction});
        await db.financial_And_Account_Journal_List.create({
          debit_amount: 0.00,
          credit_amount,
          chart_account_id,
          financial_id,
          entry_status: 'Cash Payment',
          document_number,entity_id, currency_id,currency_rate
        }, { transaction });
      }))
      let totalCredit = 0;
      let totalDebit = 0;
      let totalTDS = 0;
      
      for (const i of Account_details) {
        totalCredit += parseFloat(i.credit_amount || 0);
        totalDebit += parseFloat(i.debit_amount || 0);
        totalTDS += parseFloat(i.tds_rate_amount || 0);
      }
      const createData = await db.paymentProgram.create({
        amount: document_value,
        reference_number: document_number,
        document_type: 'Cash Payment',
        entity_id,
        document_number,
        payment_status: 'Cash Payment'
      }, { transaction });
   
      await db.paymentProgramList.create({
        vendor_id,
        invoice_id,
        amount_due: parseFloat(amount_due) ,
        paid_amount: totalCredit,
        total_amount: document_value,
        payment_program_id: createData.id,
        cash_payment_id: createCashPayment.id
      }, { transaction });
      if(invoice_id){
        let Obj = {};
        if(parseFloat(totalCredit) == parseFloat(amount_due)){
          Obj.payment_status = "PAID";
          await db.grnMaster.update(Obj, { where: { id: invoice_id }, transaction });
        }else{
          Obj.payment_status = "PARTIALLY PAID";
          await db.grnMaster.update(Obj, { where: { id: invoice_id }, transaction });
        }
       }
     
      if(invoice_id){
        let Obj = {};
        if(parseFloat(totalCredit) == parseFloat(amount_due)){
          Obj.payment_status = "PAID";
          await db.grnMaster.update(Obj, { where: { id: invoice_id }, transaction });
        }else{
          Obj.payment_status = "PARTIALLY PAID";
          await db.grnMaster.update(Obj, { where: { id: invoice_id }, transaction });
        }
       }
      let vendorAccount = null;
      if (vendor_id) {
        vendorAccount = await db.vendor_basic_details.findOne({
          where: { id: vendor_id },
          attributes: ['chart_of_account_id'],
          transaction
        });
      }
      
      let customerAccount = null;
      if (customer_id) {
        customerAccount = await db.customerProfile.findOne({
          where: { id: customer_id },
          transaction
        });
      }
      
      let employeeAccount = null;
      if (employee_id) {
        const [emp] = await db.sequelize.query(`
          SELECT FT.chart_of_account_id
          FROM HRMS_RBAC_SUBMENU_MASTER HR
          INNER JOIN FINANCIAL_TRANSACTION_INTEGRATION F
            ON F.menu_master_id = HR.menu_master_id
          INNER JOIN FINANCIAL_TRANSACTION_INTEGRATION_LIST FT
            ON FT.transaction_integration_id = F.id
          WHERE HR.submenu_master_name = 'Bank Payment'
        `);
      
        employeeAccount = emp?.[0];
      }
      
      let tdsAccount = null;
      if (totalTDS > 0) {
        tdsAccount = await db.tds.findOne({
          where: { entity_id },
          transaction
        });
      
        if (!tdsAccount) {
          throw new Error("TDS Account not mapped");
        }
      }
      
    
      let glEntries = [];

      
      
     
      if (vendor_id && vendorAccount) {
        glEntries.push({
          debit_amount: totalCredit ,
          credit_amount: 0,
          chart_account_id: 51,
          party_type: 'VENDOR',
          vendor_id,financial_id,
          entry_status: 'Cash Payment',
          entity_id, currency_id,currency_rate
        });
      }
      
      if (customer_id && customerAccount) {
        glEntries.push({
          debit_amount: totalCredit,
          credit_amount: 0,financial_id,
          chart_account_id: 168,
          party_type: 'CUSTOMER',
          customer_id,entity_id,
          entry_status: 'Cash Payment', currency_id,currency_rate
        });
      }
      
      if (employee_id && employeeAccount) {
        glEntries.push({
          debit_amount: totalCredit,
          credit_amount: 0,
          chart_account_id: employeeAccount.chart_of_account_id,
          party_type: 'EMPLOYEE',
          employee_id,financial_id,
          entry_status: 'Bank Payment',
          entity_id, currency_id,currency_rate
        });
      }
      
      
      if (totalTDS > 0 && tdsAccount) {
        glEntries.push({
          debit_amount: 0,
          credit_amount: financial_id,
          chart_account_id: 45,
          entry_status: 'Cash Payment',
          entity_id, currency_id,currency_rate
        });
      }
      
      
      
     
      await db.financial_And_Account_Journal_List.bulkCreate(
        glEntries.map(e => ({
          ...e,
          document_number: createCashPayment.document_number,
          entity_id,
     
        })),
        { transaction }
      );
      
      
      if (journalDocument?.length && journalDocument[0] != null) {
        await db.cashPaymentDoc.bulkCreate(
          journalDocument.map(i => ({
            upload_doc: i.file,
            cash_payment_id: createCashPayment.id
          })),
          { transaction }
        );
      }
      
      await transaction.commit();
      
      return res.status(200).send({
        code: 200,
        message: "Cash Payment Created Successfully"
      });

    } catch (error) {
      await transaction.rollback()
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.generateCashPaymentNumber = async (req, res) => {
    try {
      const lastEntry = await db.cashPayment.findOne({
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
        number = `ACC-CP-${currentYear}-00001`;
      }
      return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
  };

  

module.exports.getCashPaymentList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
      
        const [getDataList] = await db.sequelize.query(
          ` SELECT P.*,MB.branch_name,P.document_number,P.posting_date,SUM(PL.credit_amount) AS credit_amount
             FROM CASH_PAYMENT AS P
             INNER JOIN CASH_PAYMENT_ACCOUNT_LIST AS PL ON PL.cash_payment_id=P.id
             INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
             WHERE P.entity_id=${entity_id}
              GROUP BY P.id ORDER BY P.id DESC`
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

module.exports.getCashPaymentById = async(req,res)=>{
  try {
      const {id} = req.query;
      const [getDataList] = await db.sequelize.query(
          `SELECT B.* ,MB.branch_name,B.voucher_list_id AS voucher_id,PP.*
           FROM CASH_PAYMENT AS B
           INNER JOIN MASTER_BRANCH AS MB ON MB.id = B.branch_id
           LEFT JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.cash_payment_id=B.id
          WHERE B.id=${id}`
      )
      const [itemList] = await db.sequelize.query(
        `SELECT PL.*
           FROM CASH_PAYMENT AS P
           INNER JOIN CASH_PAYMENT_ACCOUNT_LIST AS PL ON PL.cash_payment_id=P.id
           WHERE P.id=${id}`
      )
   
      const [DocumentList] = await db.sequelize.query(
        `SELECT PL.*
FROM PAYMENT_ADVICE AS P
INNER JOIN CASH_PAYMENT_DOCUMENT AS PL ON PL.cash_payment_id=P.id
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

module.exports.getCashPaymentReportList = async(req,res)=>{
  try {
      const {entity_id} = req.query;
      const [getDataList] = await db.sequelize.query(
          `SELECT P.* ,MB.branch_name
FROM CASH_PAYMENT AS P
INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
          WHERE P.entity_id=${entity_id}`
      )
      const [itemList] = await db.sequelize.query(
        `SELECT DISTINCT PL.* ,FC.cost_center_name,FP.profit_center_name,C.account_name AS chart_account_name,
CONCAT(HR.first_name,' ',HR.last_name),S.company_name AS customer_name,MP.item_name AS product_name
FROM CASH_PAYMENT AS P
INNER JOIN CASH_PAYMENT_ACCOUNT_LIST AS PL ON PL.cash_payment_id=P.id
LEFT JOIN FINANCE_COST_CENTER AS FC ON FC.id=PL.cost_center_id
LEFT JOIN FINANCE_PROFIT_CENTER AS FP ON FP.id=PL.profit_center_id
LEFT JOIN CHART_OF_ACCOUNTS AS C ON C.id = PL.chart_account_id
LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PL.employee_id
LEFT JOIN CUSTOMER_PROFILE_MST AS S ON S.id=PL.customer_id
LEFT JOIN MASTER_ITEM AS MP ON MP.id=PL.product_id`
      )
      const finalValue = getDataList.map((md) => {
        const matchingUpdatedData = itemList.find((ud) =>
            ud.cash_payment_id === md.id );
     
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
          return res.status(404).send({code:404,message:'Data Not Found',data:finalValue})
      }
  } catch (error) {
      return res.status(500).send({code:500,message:error.message   })
  }
}


module.exports.generatecashPaymentNumber = async (req, res) => {
  try {
   

    const {branch_id,voucher_id} = req.body

    const branchExist = await db.tbl_branch.findOne({where:{id:branch_id},attributes:['id','branch_name']})
    const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();
    const voucherMainListExist = await db.voucherMainList.findOne({where:{id:voucher_id},attributes:['id','series','voucher_main_id','voucher_name']})
    const voucherMainExist = await db.voucherMain.findOne({where:{id:voucherMainListExist.voucher_main_id},attributes:['id','name']})
    const voucherPrefixed = voucherMainExist.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const voucherPrefixedMainList = voucherMainListExist.voucher_name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const lastEntry = await db.cashPayment.findOne({
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


module.exports.downloadCashPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [getDataList] = await db.sequelize.query(
      `SELECT  B.*,MB.branch_name,B.voucher_list_id AS voucher_id,V.vendor_name AS company_name,E.entity_name,
        E.tax_registration_number AS entity_gst_in, E.registered_office,E.logo
      FROM CASH_PAYMENT AS B
      INNER JOIN MASTER_BRANCH AS MB ON MB.id = B.branch_id
      LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = B.vendor_id
      LEFT JOIN ENTITY_MASTER AS E  ON E.id = B.entity_id
      WHERE B.id = ${ id }
      `
    )

    const [itemList] = await db.sequelize.query(
      `
 SELECT DISTINCT CA.account_name, CA.account_code,P.document_number AS journal_document_number,
        P.posting_date AS journal_posting_date,PL.credit_amount, PL.debit_amount,P.*,
        CASE WHEN PL.debit_amount THEN 'Cr.'
        ELSE 'Dr.'
        END dcType
      FROM CASH_PAYMENT AS P
      INNER JOIN CASH_PAYMENT_ACCOUNT_LIST AS PL ON PL.cash_payment_id = P.id
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
      "../../../../src/assets/templates/cash_payment.html"
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

      heading: "CASH PAYMENT VOUCHER",

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
      `attachment; filename="cash_payment_${
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