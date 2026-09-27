const db = require('../../../models/index')
const path = require("path");
const fs = require("fs");
const { generatePDF } = require("../../../../app/common/pdfConverter");

module.exports.createBankPayment = async(req,res)=>{
  const transaction = await db.sequelize.transaction();
  try {
    let {posting_date, amount_due, cheque_ref_date,document_value,payment_advice_number, others, reference_number, document_number, transaction_date, journalDocument, notes, cheque_ref_no, voucher_type, branch_id, entity_id, Account_details, voucher_id,
      manage_advance, financial_id, document_type, document_number_id,currency_id,currency_rate, employee_id, sales_quotation_id, party_type, vendor_id, purchase_journal_id, customer_id, po_id, grn_id, invoice_id, sales_order_id, delivery_order_id, sales_invoice_id, payment_advice_ids
    } = req.body;

    const getChartAccountIdForGL = async (bankAccountId) => {
      if (!bankAccountId) return null;
      const bankAccount = await db.createBankAccount.findOne({
        where: { id: bankAccountId, isDeleted: false },
        transaction
      });
      return bankAccount ? bankAccount.chart_account_id : null;
    };
    const journalExist = await db.financial_And_Account_Journal.create({
     posting_date, journal_no:reference_number, transaction_date:transaction_date, reference:cheque_ref_no, reference_date:cheque_ref_date, 
       party_type, bill_number:reference_number,  journal_book_status:'OTHER', document_type:'Bank Payment', entity_id, currency_id, vendor_id, 
    },{transaction})

    switch(payment_advice_ids) {
      
      case 'PAYMENT_ADVICE_NUMBER': {

  const total_amount = Account_details.reduce(
    (total, row) => total + parseFloat(row.credit_amount || 0),
    0
  );

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
 
  const createBankPayment = await db.bankPayment.create({
    posting_date,
    document_value: document_value,
    document_number,
    transaction_date,
    notes,
    cheque_ref_no: cheque_ref_no,
    voucher_type,
    branch_id,
    currency_id,
    currency_rate,
    cheque_ref_date,
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
  await db.paymentProgramList.create(
    {
      vendor_id,
      document_no:reference_number,
      amount_due:amount_due,
      paid_amount: total_amount,
      total_amount: document_value,
      bank_payment_id: createBankPayment.id,
      payment_program_id : createData.id
    },{transaction}
  );
 

  await Promise.all(

    Account_details.map(async (i) => {

      let {
        debit_amount,
        nature_id,
        credit_amount,
        bank_id,
        tds_id,
        cess_rate,
        narration,
        tds,
        tds_rate,
        tds_rate_amount,
        surcharge,
        surcharge_rate_amount,
        cess,
        cess_rate_amount,
        gross_amount,
        cost_center_id,
        profit_center_id,
        chart_account_id,
        currency_id,
        remarks
      } = i;

      const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

      await db.bankPaymentAccount.create({
        debit_amount,
        credit_amount,
        narration,
        tds,
        nature_id,
        tds_rate,
        tds_rate_amount,
        tds_id,
        surcharge,
        surcharge_amount: surcharge_rate_amount,
        cess,
        cess_amount: cess_rate_amount,
        gross_amount,
        bank_payment_id: createBankPayment.id,
        cess_rate,
        bank_id,
        party_type,
        remarks,
        amount_due:
          parseFloat(total_amount) -
          parseFloat(amount_due || 0),
        vendor_id,
        cost_center_id,
        profit_center_id,
        chart_account_id: chart_account_id,
        currency_id

      }, { transaction });
      await db.bankPaymentAccount.create({
        debit_amount:total_amount,
        credit_amount:0.00,
        narration,
        tds,
        nature_id,
        tds_rate,
        tds_rate_amount,
        tds_id,
        surcharge,
        surcharge_amount: surcharge_rate_amount,
        cess,
        cess_amount: cess_rate_amount,
        gross_amount,
        bank_payment_id: createBankPayment.id,
        cess_rate,
        bank_id,
        party_type,
        amount_due:
          parseFloat(total_amount) -
          parseFloat(amount_due || 0),
        vendor_id,
        cost_center_id,
        profit_center_id,
        chart_account_id: 51,
        currency_id

      }, { transaction });


    })

  );


  const groupedEntries = {};
  for (const item of Account_details) {
   
    const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
    const costCenterKey = item.cost_center_id || 'null';
    const profitCenterKey = item.profit_center_id || 'null';
  
    const key =
      `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;
  
    if (!groupedEntries[key]) {
  
      groupedEntries[key] = {
  
        cost_center_id: item.cost_center_id,
        profit_center_id: item.profit_center_id,
        chart_account_id: glChartAccountId, 
        bank_account_id: item.chart_account_id,
        credit_amount: 0,
        tds_rate_amount: 0,
        nature_id: item.nature_id,
        tds_id: item.tds_id
  
      };
  
    }
 
    groupedEntries[key].credit_amount +=
      parseFloat(item.credit_amount || 0);
  
    groupedEntries[key].tds_rate_amount +=
      parseFloat(item.tds_rate_amount || 0);
  
  }

  for (const key in groupedEntries) {

    const item = groupedEntries[key];

    if (item.tds_rate_amount > 0) {

      await db.financial_And_Account_Journal_List.create({
        debit_amount: 0.00,
        credit_amount: item.tds_rate_amount,
        entry_status: 'Payment Advice Payment',
        document_number: createData.document_number,
        cost_center_id: item.cost_center_id,
        profit_center_id: item.profit_center_id,
        chart_account_id: 45,
        tds_id: item.tds_id,
        nature_id: item.nature_id,
        entity_id,
        financial_id,
        journal_id:journalExist.id,
        currency_id,
        currency_rate
      }, { transaction });

    }

    const creditAmount = parseFloat(item.credit_amount) - parseFloat(item.tds_rate_amount || 0);
    if (creditAmount > 0) {
      await db.financial_And_Account_Journal_List.create({

        debit_amount: 0.00,
        credit_amount: creditAmount,
        entry_status: 'Payment Advice Payment',
        document_number: document_number,
        cost_center_id: item.cost_center_id,
        profit_center_id: item.profit_center_id,
        chart_account_id: item.chart_account_id,
        entity_id, financial_id,
        journal_id:journalExist.id,
        currency_id,
        currency_rate
      }, { transaction });
    }

  }
  
  const totalPayable = total_amount - (Object.values(groupedEntries).reduce((sum, item) => sum + parseFloat(item.tds_rate_amount || 0), 0));
  if (totalPayable > 0) {
    await db.financial_And_Account_Journal_List.create({
      debit_amount: totalPayable,
      credit_amount: 0.00,
      party_type: 'VENDOR',
      entry_status: 'Payment Advice Payment',
      document_number: document_number,
      vendor_id,
      chart_account_id: 51,
      entity_id,
      financial_id,
      journal_id:journalExist.id,
        currency_id,
        currency_rate
    }, { transaction });
  }

  await transaction.commit();

  return res.status(200).send({
    code: 200,
    message: 'Bank Payment Created Successfully'
  });

      }

      case 'Transport': {
        const total_amount = Account_details.reduce(
          (total, row) => total + parseFloat(row.credit_amount || 0),
          0
        );

        const transportExist = await db.transportVoucher.findOne({
          where: { id: document_number_id },
          transaction
        });

        if (!transportExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Transport Voucher Not Found'
          });
        }

        const paymentProgramExist = await db.paymentProgramList.findOne({
          where: { transport_voucher_id: transportExist.id },
          order: [['id', 'DESC']],
          transaction
        });

        if (!paymentProgramExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Payment Program not found for this Transport Voucher'
          });
        }

        const updatedRows = await db.paymentProgram.create(
          {
            amount: paymentProgramExist.total_amount,
            reference_number: document_number,
            document_type: 'Transport',
            entity_id,
            document_number: document_number,
            payment_status: 'Transport Payment',
            payment_program_status: 'Approved'
          },
          { transaction }
        );

        const createBankPayment = await db.bankPayment.create({
          posting_date,
          document_value: transportExist.grand_total,
          document_number,
          transaction_date,
          notes,
          cheque_ref_no: cheque_ref_no,
          voucher_type,
          branch_id,
          entity_id,
          cheque_ref_date,
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
            bank_payment_id: createBankPayment.id,
            transport_voucher_id: document_number_id,
            payment_program_id: updatedRows.id,
          },
          { transaction }
        );

        await Promise.all(
          Account_details.map(async (i) => {
            let {
              debit_amount,
              nature_id,
              credit_amount,
              bank_id,
              tds_id,
              cess_rate,
              narration,
              tds,
              tds_rate,
              tds_rate_amount,
              surcharge,
              surcharge_rate_amount,
              cess,
              cess_rate_amount,
              gross_amount,
              cost_center_id,
              profit_center_id,
              chart_account_id,
              currency_id,
              remarks
            } = i;

            const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

            await db.bankPaymentAccount.create({
              debit_amount,
              credit_amount,
              narration,
              tds,
              nature_id,
              tds_rate,
              tds_rate_amount,
              tds_id,
              surcharge,
              surcharge_amount: surcharge_rate_amount,
              cess,
              cess_amount: cess_rate_amount,
              gross_amount,
              bank_payment_id: createBankPayment.id,
              cess_rate,
              bank_id,
              party_type,
              amount_due: parseFloat(total_amount) - parseFloat(amount_due || 0),
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: chart_account_id,
              currency_id,
              remarks
            }, { transaction });
            await db.bankPaymentAccount.create({
              debit_amount:total_amount,
              credit_amount:0.00,
              narration,
              tds,
              nature_id,
              tds_rate,
              tds_rate_amount,
              tds_id,
              surcharge,
              surcharge_amount: surcharge_rate_amount,
              cess,
              cess_amount: cess_rate_amount,
              gross_amount,
              bank_payment_id: createBankPayment.id,
              cess_rate,
              bank_id,
              party_type,
              amount_due: parseFloat(total_amount) - parseFloat(amount_due || 0),
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: 51,
              currency_id
            }, { transaction });
          })
        );

        const groupedEntries = {};
        for (const item of Account_details) {
          const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
          const costCenterKey = item.cost_center_id || 'null';
          const profitCenterKey = item.profit_center_id || 'null';

          const key = `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;

          if (!groupedEntries[key]) {
            groupedEntries[key] = {
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: glChartAccountId,
              bank_account_id: item.chart_account_id,
              credit_amount: 0,
              tds_rate_amount: 0
            };
          }

          groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
          groupedEntries[key].tds_rate_amount += parseFloat(item.tds_rate_amount || 0);
        }

        for (const key in groupedEntries) {
          const item = groupedEntries[key];

          if (item.tds_rate_amount > 0) {
            await db.financial_And_Account_Journal_List.create({
              debit_amount: 0.00,
              credit_amount: item.tds_rate_amount,
              narration: null,
              entry_status: 'Transport Payment',
              document_number: document_number,
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: 45,
              entity_id,
              financial_id,
              journal_id:journalExist.id,
              currency_id,
              currency_rate
            }, { transaction });
          }

          const creditAmount = parseFloat(item.credit_amount) - parseFloat(item.tds_rate_amount || 0);
          if (creditAmount > 0) {
            await db.financial_And_Account_Journal_List.create({
              debit_amount: 0.00,
              credit_amount: creditAmount,
              narration: null,
              entry_status: 'Transport Payment',
              document_number: document_number,
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: item.chart_account_id,
              entity_id,
              financial_id,
              journal_id:journalExist.id,
              currency_id,
              currency_rate
            }, { transaction });
          }
        }

        const totalPayable = total_amount - (Object.values(groupedEntries).reduce((sum, item) => sum + parseFloat(item.tds_rate_amount || 0), 0));
        if (totalPayable > 0) {
          await db.financial_And_Account_Journal_List.create({
            debit_amount: totalPayable,
            credit_amount: 0.00,
            party_type: 'VENDOR',
            entry_status: 'Transport Payment',
            document_number: document_number,
            vendor_id,
            chart_account_id: 51,
            entity_id,
            financial_id,
            journal_id:journalExist.id,
            currency_id,
            currency_rate
          }, { transaction });
        }

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: 'Bank Payment Created Successfully'
        });
      }

      case 'PURCHASE_JOURNAL_NUMBER': {
        const total_amount = Account_details.reduce(
          (total, row) => total + parseFloat(row.credit_amount || 0),
          0
        );

        const serviceExist = await db.purchaseJournal.findOne({
          where: { id: document_number_id },
          transaction
        });

        if (!serviceExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Purchase Journal not found'
          });
        }

        const paymentProgramExist = await db.paymentProgramList.findOne({
          where: { purchase_journal_id: document_number_id },
          order: [['id', 'DESC']],
          transaction
        });

        if (!paymentProgramExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Payment Program not found for this Purchase Journal'
          });
        }

        const updatedRows = await db.paymentProgram.create(
          {
            amount: paymentProgramExist.total_amount,
            reference_number: document_number,
            document_type: 'Purchase Journal',
            entity_id,
            document_number: reference_number,
            payment_status: 'Purchase Journal',
            payment_program_status: 'Approved'
          },
          { transaction }
        );

        const createBankPayment = await db.bankPayment.create(
          {
            posting_date,
            document_value: serviceExist.grand_total,
            document_number,
            transaction_date,
            notes,
            cheque_ref_no: cheque_ref_no,
            voucher_type,
            branch_id,
            entity_id,
            voucher_list_id: voucher_id,
            manage_advance,
            document_type,
            cheque_ref_date,
            party_type,
            vendor_id,
            purchase_journal_id: document_number_id,
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
            bank_payment_id: createBankPayment.id,
            purchase_journal_id: document_number_id,
            payment_program_id: updatedRows.id
          },
          { transaction }
        );

        await Promise.all(
          Account_details.map(async (i) => {
            let {
              debit_amount,
              credit_amount,
              chart_account_id,
              bank_id,
              cost_center_id,
              profit_center_id,
              currency_id,
              remarks
            } = i;

            const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

            await db.bankPaymentAccount.create({
              debit_amount: debit_amount || 0,
              credit_amount: credit_amount || 0,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: chart_account_id,
              currency_id,
              remarks
            }, { transaction });
             await db.bankPaymentAccount.create({
              debit_amount:total_amount,
              credit_amount:0.00,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: 51,
              currency_id
            }, { transaction });
          })
        );

        const groupedEntries = {};
        for (const item of Account_details) {
          const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
          const costCenterKey = item.cost_center_id || 'null';
          const profitCenterKey = item.profit_center_id || 'null';

          const key = `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;

          if (!groupedEntries[key]) {
            groupedEntries[key] = {
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: glChartAccountId,
              bank_account_id: item.chart_account_id,
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
            entry_status: 'Purchase Payment',
            document_number: document_number,
            financial_id,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            entity_id,
            journal_id:journalExist.id,
            currency_id,
            currency_rate
          }, { transaction });
        }

        await db.financial_And_Account_Journal_List.create({
          debit_amount: total_amount,
          credit_amount: 0.00,
          party_type: 'VENDOR',
          entry_status: 'Purchase Payment',
          document_number: document_number,
          vendor_id,
          financial_id,
          chart_account_id: 51,
          entity_id,
          journal_id:journalExist.id,
          currency_id,
          currency_rate
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: 'Bank Payment Created Successfully'
        });
      }

      case 'travel_expense': {
        const total_amount = Account_details.reduce(
          (total, row) => total + parseFloat(row.credit_amount || 0),
          0
        );

        const paymentProgramExist = await db.paymentProgramList.findOne({
          where: { expense_request_id: document_number_id },
          order: [['id', 'DESC']],
          transaction
        });

        if (!paymentProgramExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Payment Program not found for this Expense Request'
          });
        }

        const updatedRows = await db.paymentProgram.create(
          {
            amount: paymentProgramExist.total_amount,
            reference_number: document_number,
            document_type: 'Travel Expence Payment',
            entity_id,
            document_number: reference_number,
            payment_status: 'Travel Expence Payment',
            payment_program_status: 'Approved'
          },
          { transaction }
        );

        const createBankPayment = await db.bankPayment.create(
          {
            posting_date,
            document_value: paymentProgramExist.total_amount,
            document_number,
            transaction_date,
            notes,
            cheque_ref_no: cheque_ref_no,
            voucher_type,
            branch_id,
            entity_id,
            voucher_list_id: voucher_id,
            manage_advance,
            cheque_ref_date,
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
            expense_request_id: document_number_id,
            payment_program_id: updatedRows.id
          },
          { transaction }
        );

        await Promise.all(
          Account_details.map(async (i) => {
            let {
              debit_amount,
              credit_amount,
              chart_account_id,
              bank_id,
              cost_center_id,
              profit_center_id,
              currency_id,
              remarks
            } = i;

            const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

            await db.bankPaymentAccount.create({
              debit_amount: debit_amount || 0,
              credit_amount: credit_amount || 0,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: chart_account_id,
              currency_id,
              remarks
            }, { transaction });
            await db.bankPaymentAccount.create({
              debit_amount:total_amount,
              credit_amount:0.00,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: 85,
              currency_id
            }, { transaction });
          })
        );

        const groupedEntries = {};
        for (const item of Account_details) {
          const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
          const costCenterKey = item.cost_center_id || 'null';
          const profitCenterKey = item.profit_center_id || 'null';

          const key = `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;

          if (!groupedEntries[key]) {
            groupedEntries[key] = {
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: glChartAccountId,
              bank_account_id: item.chart_account_id,
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
            entry_status: 'Travel Expence Payment',
            document_number: document_number,
            financial_id,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            entity_id,
            journal_id:journalExist.id,
            currency_id,
            currency_rate
          }, { transaction });
        }

        await db.financial_And_Account_Journal_List.create({
          debit_amount: total_amount,
          credit_amount: 0.00,
          party_type: 'EMPLOYEE',
          entry_status: 'Travel Expence Payment',
          document_number: document_number,
          financial_id,
          chart_account_id: 85,
          entity_id,
          employee_id,journal_id:journalExist.id,
          currency_id,
          currency_rate
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: 'Bank Payment Created Successfully'
        });
      }

      case 'other_expense': {
        const total_amount = Account_details.reduce(
          (total, row) => total + parseFloat(row.credit_amount || 0),
          0
        );

        const paymentProgramExist = await db.paymentProgramList.findOne({
          where: { expense_request_id: document_number_id },
          order: [['id', 'DESC']],
          transaction
        });

        if (!paymentProgramExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Payment Program not found for this Expense Request'
          });
        }

        const updatedRows = await db.paymentProgram.create(
          {
            amount: paymentProgramExist.total_amount,
            reference_number: document_number,
            document_type: 'Other Expence Payment',
            entity_id,
            document_number: reference_number,
            payment_status: 'Other Expence Payment',
            payment_program_status: 'Approved'
          },
          { transaction }
        );

        const createBankPayment = await db.bankPayment.create(
          {
            posting_date,
            document_value: paymentProgramExist.total_amount,
            document_number,
            transaction_date,
            notes,
            cheque_ref_no: cheque_ref_no,
            voucher_type,
            branch_id,
            entity_id,
            voucher_list_id: voucher_id,
            manage_advance,
            document_type,
            cheque_ref_date,
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
            expense_request_id: document_number_id,
            payment_program_id: updatedRows.id
          },
          { transaction }
        );

        await Promise.all(
          Account_details.map(async (i) => {
            let {
              debit_amount,
              credit_amount,
              chart_account_id,
              bank_id,
              cost_center_id,
              profit_center_id,
              currency_id,
              remarks
            } = i;

            const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

            await db.bankPaymentAccount.create({
              debit_amount: debit_amount || 0,
              credit_amount: credit_amount || 0,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: chart_account_id,
              currency_id,
              remarks
            }, { transaction });
            await db.bankPaymentAccount.create({
              debit_amount:total_amount,
              credit_amount:0.00,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: 85,
              currency_id
            }, { transaction });
          })
        );

        const groupedEntries = {};
        for (const item of Account_details) {
          const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
          const costCenterKey = item.cost_center_id || 'null';
          const profitCenterKey = item.profit_center_id || 'null';

          const key = `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;

          if (!groupedEntries[key]) {
            groupedEntries[key] = {
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: glChartAccountId,
              bank_account_id: item.chart_account_id,
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
            entry_status: 'Other Expence Payment',
            document_number: document_number,
            financial_id,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            entity_id,journal_id:journalExist.id,
            currency_id,
            currency_rate
          }, { transaction });
        }

        await db.financial_And_Account_Journal_List.create({
          debit_amount: total_amount,
          credit_amount: 0.00,
          party_type: 'EMPLOYEE',
          entry_status: 'Other Expence Payment',
          document_number: document_number,
          financial_id,
          chart_account_id: 85,
          entity_id,
          employee_id,journal_id:journalExist.id,
          currency_id,
          currency_rate
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: 'Bank Payment Created Successfully'
        });
      }

      case 'Reimbursement_expense': {
        const total_amount = Account_details.reduce(
          (total, row) => total + parseFloat(row.credit_amount || 0),
          0
        );

        const paymentProgramExist = await db.paymentProgramList.findOne({
          where: { expense_request_id: document_number_id },
          order: [['id', 'DESC']],
          transaction
        });

        if (!paymentProgramExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Payment Program not found for this Expense Request'
          });
        }

        const updatedRows = await db.paymentProgram.create(
          {
            amount: paymentProgramExist.total_amount,
            reference_number: document_number,
            document_type: 'Reimbursement Expence Payment',
            entity_id,
            document_number: reference_number,
            payment_status: 'Reimbursement Expence Payment',
            payment_program_status: 'Approved'
          },
          { transaction }
        );

        const createBankPayment = await db.bankPayment.create(
          {
            posting_date,
            document_value: paymentProgramExist.total_amount,
            document_number,
            transaction_date,
            notes,
            cheque_ref_no: cheque_ref_no,
            voucher_type,
            branch_id,
            entity_id,
            voucher_list_id: voucher_id,
            manage_advance,
            document_type,
            cheque_ref_date,
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
            employee_id:req.body.employee_id,
            amount_due: parseFloat(paymentProgramExist.amount_due) - parseFloat(total_amount),
            paid_amount: total_amount,
            total_amount: paymentProgramExist.total_amount,
            bank_payment_id: createBankPayment.id,
            expense_request_id: req.body.document_number_id,
            payment_program_id: updatedRows.id
          },
          { transaction }
        );

        await Promise.all(
          Account_details.map(async (i) => {
            let {
              debit_amount,
              credit_amount,
              chart_account_id,
              bank_id,
              cost_center_id,
              profit_center_id,
              currency_id,
              remarks
            } = i;

            const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

            await db.bankPaymentAccount.create({
              debit_amount: debit_amount || 0,
              credit_amount: credit_amount || 0,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: chart_account_id,
              currency_id,
              remarks
            }, { transaction });
            await db.bankPaymentAccount.create({
              debit_amount:total_amount,
              credit_amount:0.00,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: 85,
              currency_id
            }, { transaction });
          })
        );

        const groupedEntries = {};
        for (const item of Account_details) {
          const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
          const costCenterKey = item.cost_center_id || 'null';
          const profitCenterKey = item.profit_center_id || 'null';

          const key = `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;

          if (!groupedEntries[key]) {
            groupedEntries[key] = {
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: glChartAccountId,
              bank_account_id: item.chart_account_id,
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
            entry_status: 'Reimbursement Expence Payment',
            document_number: document_number,
            financial_id,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            entity_id,journal_id:journalExist.id,
            currency_id,
            currency_rate
          }, { transaction });
        }

        await db.financial_And_Account_Journal_List.create({
          debit_amount: total_amount,
          credit_amount: 0.00,
          party_type: 'EMPLOYEE',
          entry_status: 'Reimbursement Expence Payment',
          document_number: document_number,
          financial_id,
          chart_account_id: 85,
          entity_id,
          employee_id,journal_id:journalExist.id,
          currency_id,
          currency_rate
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: 'Bank Payment Created Successfully'
        });
      }

      case 'Purchase_service_voucher': {
        const total_amount = Account_details.reduce(
          (total, row) => total + parseFloat(row.credit_amount || 0),
          0
        );

        const purchaseService = await db.purchaseServiceVoucher.findOne({
          where: { id: document_number_id },
          transaction
        });

        if (!purchaseService) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Purchase Service Voucher not found'
          });
        }

        const paymentProgramExist = await db.paymentProgramList.findOne({
          where: { purchase_service_voucher_id: document_number_id },
          order: [['id', 'DESC']],
          transaction
        });

        if (!paymentProgramExist) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: 'Payment Program not found for this Purchase Service Voucher'
          });
        }

        const updatedRows = await db.paymentProgram.create(
          {
            amount: paymentProgramExist.total_amount,
            reference_number: document_number,
            document_type: 'Purchase Service Voucher',
            entity_id,
            document_number: reference_number,
            payment_status: 'Purchase Service Voucher',
            payment_program_status: 'Approved'
          },
          { transaction }
        );

        const createBankPayment = await db.bankPayment.create(
          {
            posting_date,
            document_value: purchaseService.grand_total,
            document_number,
            transaction_date,
            notes,
            cheque_ref_no: cheque_ref_no,
            branch_id,
            entity_id,
            voucher_list_id: voucher_id,
            manage_advance,
            document_type,
            party_type,
            cheque_ref_date,
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
            bank_payment_id: createBankPayment.id,
            purchase_service_voucher_id: document_number_id,
            payment_program_id: updatedRows.id,
          },
          { transaction }
        );

        await Promise.all(
          Account_details.map(async (i) => {
            let {
              debit_amount,
              credit_amount,
              chart_account_id,
              bank_id,
              cost_center_id,
              profit_center_id,
              currency_id,
              remarks
            } = i;

            const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

            await db.bankPaymentAccount.create({
              debit_amount: debit_amount || 0,
              credit_amount: credit_amount || 0,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: chart_account_id,remarks
            }, { transaction });
              await db.bankPaymentAccount.create({
                debit_amount:total_amount,
                credit_amount:0.00,
              bank_payment_id: createBankPayment.id,
              amount_due: 0.00,
              vendor_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: 51
            }, { transaction });
          })
        );

        const groupedEntries = {};
        for (const item of Account_details) {
          const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
          const costCenterKey = item.cost_center_id || 'null';
          const profitCenterKey = item.profit_center_id || 'null';

          const key = `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;

          if (!groupedEntries[key]) {
            groupedEntries[key] = {
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: glChartAccountId,
              bank_account_id: item.chart_account_id,
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
            entry_status: 'Purchase Payment',
            document_number: document_number,
            financial_id,
            cost_center_id: item.cost_center_id,
            profit_center_id: item.profit_center_id,
            chart_account_id: item.chart_account_id,
            entity_id,journal_id:journalExist.id,
            currency_id,
            currency_rate
          }, { transaction });
        }

        await db.financial_And_Account_Journal_List.create({
          debit_amount: total_amount,
          credit_amount: 0.00,
          party_type: 'VENDOR',
          entry_status: 'Purchase Payment',
          document_number: document_number,
          vendor_id,
          financial_id,
          chart_account_id: 51,
          entity_id,journal_id:journalExist.id,
          currency_id,
          currency_rate
        }, { transaction });

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: 'Bank Payment Created Successfully'
        });
      }

      default: {
        

        if (vendor_id) {
          party_type = 'VENDOR';

          if (!payment_advice_ids && !document_type) {
            let remainingAmount = Account_details[0]?.credit_amount || 0;

            const [dataList] = await db.sequelize.query(`
              SELECT G.* FROM GRN_MASTER AS G 
              WHERE G.payment_status != 'PENDING' AND G.vendor_id = ${vendor_id}
            `, { transaction });

            if (!dataList || dataList.length === 0) {
              throw new Error("No GRN found for vendor");
            }

            const createData = await db.paymentProgram.create(
              {
                amount: Account_details[0]?.credit_amount || 0,
                reference_number: document_number,
                document_type,
                entity_id: dataList[0].entity_id,
                document_number: dataList[0].invoiceNo,
                payment_status: 'Bank Payment'
              },
              { transaction }
            );

            for (const i of dataList) {
              const { id, vendor_id, total_amount } = i;
              let Obj = {};
              const invoiceTotal = parseFloat(total_amount);

              if (remainingAmount <= 0) break;

              const invoiceExist = await db.grnMaster.findOne({
                where: { id },
                attributes: ['id', 'total_amount'],
                order: [['id', 'DESC']],
                transaction
              });

              const paymentExist = await db.paymentProgramList.findOne({
                where: { invoice_id: invoiceExist.id },
                order: [['invoice_id', 'DESC']],
                transaction
              });

              let dueAmount = paymentExist ? parseFloat(paymentExist.amount_due) : invoiceTotal;

              if (remainingAmount >= dueAmount) {
                Obj.payment_status = "PAID";
                await db.grnMaster.update(Obj, { where: { id: id }, transaction });

                await db.paymentProgramList.create(
                  {
                    vendor_id,
                    invoice_id: id,
                    amount_due: 0,
                    paid_amount: dueAmount,
                    total_amount: invoiceTotal,
                    payment_program_id: createData.id
                  },
                  { transaction }
                );

                remainingAmount -= dueAmount;
              } else {
                Obj.payment_status = "PARTIALLY PAID";
                await db.grnMaster.update(Obj, { where: { id: id }, transaction });

                await db.paymentProgramList.create(
                  {
                    vendor_id,
                    invoice_id: id,
                    amount_due: dueAmount - remainingAmount,
                    paid_amount: remainingAmount,
                    total_amount: invoiceTotal,
                    payment_program_id: createData.id
                  },
                  { transaction }
                );

                remainingAmount = 0;
                break;
              }
            }
          }
        }

        if (customer_id) {
          party_type = 'CUSTOMER';
        }

        if (employee_id) {
          party_type = 'EMPLOYEE';
        }
        const total_amount = Account_details.reduce(
          (total, row) => total + parseFloat(row.credit_amount || 0),
          0
        );
        const createBankPayment = await db.bankPayment.create({
          posting_date,
          customer_id,
          sales_quotation_id,
          document_value,
          payment_advice_number,
          reference_number,
          document_number,
          transaction_date,
          notes,
          cheque_ref_no: cheque_ref_no,
          voucher_type,
          branch_id,
          entity_id,
          voucher_list_id: voucher_id,
          manage_advance,
          document_type,
          party_type,
          vendor_id,
          cheque_ref_date,
          purchase_journal_id,
          customer_id,
          employee_id,
          po_id,
          grn_id,
          invoice_id,
          sales_order_id,
          delivery_order_id,
          sales_invoice_id,
          payment_advice_ids,
          others
        }, { transaction });

        await Promise.all(
          Account_details.map(async (i) => {
            let {
              debit_amount,
              nature_id,
              credit_amount,
              bank_id,
              tds_id,
              cess_rate,
              narration,
              tds,
              tds_rate,
              tds_rate_amount,
              surcharge,
              surcharge_rate_amount,
              cess,
              cess_rate_amount,
              gross_amount,
              product_id,
              cost_center_id,
              profit_center_id,
              chart_account_id,
              currency_id,
              remarks
            } = i;

            const glChartAccountId = await getChartAccountIdForGL(chart_account_id);

            await db.bankPaymentAccount.create({
              debit_amount: debit_amount || 0,
              credit_amount: credit_amount || 0,
              narration,
              tds,
              nature_id,
              tds_rate,
              tds_rate_amount,
              tds_id,
              surcharge,
              surcharge_amount: surcharge_rate_amount,
              cess,
              cess_amount: cess_rate_amount,
              gross_amount,
              bank_payment_id: createBankPayment.id,
              cess_rate,
              bank_id,
              party_type,
              amount_due,
              remarks,
              vendor_id,
              customer_id,
              product_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: chart_account_id,
              currency_id
            }, { transaction });  
            await db.bankPaymentAccount.create({
              debit_amount:total_amount,
              credit_amount:0.00,
              narration,
              tds,
              nature_id,
              tds_rate,
              tds_rate_amount,
              tds_id,
              surcharge,
              surcharge_amount: surcharge_rate_amount,
              cess,
              cess_amount: cess_rate_amount,
              gross_amount,
              bank_payment_id: createBankPayment.id,
              cess_rate,
              bank_id,
              party_type,
              amount_due,
              vendor_id,
              customer_id,
              product_id,
              cost_center_id,
              profit_center_id,
              chart_account_id: 51,
              currency_id
            }, { transaction });
          })
        );

        let totalCredit = 0;
        let totalTDS = 0;

        for (const i of Account_details) {
          totalCredit += parseFloat(i.credit_amount || 0);
          totalTDS += parseFloat(i.tds_rate_amount || 0);
        }

        const groupedEntries = {};
        for (const item of Account_details) {
          const glChartAccountId = await getChartAccountIdForGL(item.chart_account_id);
          const costCenterKey = item.cost_center_id || 'null';
          const profitCenterKey = item.profit_center_id || 'null';
          const key = `${costCenterKey}_${profitCenterKey}_${glChartAccountId}`;

          if (!groupedEntries[key]) {
            groupedEntries[key] = {
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              chart_account_id: glChartAccountId,
              credit_amount: 0,
              tds_rate_amount: 0
            };
          }

          groupedEntries[key].credit_amount += parseFloat(item.credit_amount || 0);
          groupedEntries[key].tds_rate_amount += parseFloat(item.tds_rate_amount || 0);
        }

        for (const key in groupedEntries) {
          const item = groupedEntries[key];

          if (item.tds_rate_amount > 0) {
            await db.financial_And_Account_Journal_List.create({
              debit_amount: 0.00,
              credit_amount: item.tds_rate_amount,
              chart_account_id: 45,
              financial_id,
              entry_status: 'Bank Payment',
              document_number: document_number,
              entity_id,
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              vendor_id,journal_id:journalExist.id,
              currency_id,
              currency_rate,
              party_type: 'VENDOR'
            }, { transaction });
          }

          const creditAmount = parseFloat(item.credit_amount) - parseFloat(item.tds_rate_amount || 0);
          if (creditAmount > 0) {
            await db.financial_And_Account_Journal_List.create({
              debit_amount: 0.00,
              credit_amount: creditAmount,
              chart_account_id: item.chart_account_id,
              financial_id,
              entry_status: 'Bank Payment',
              document_number: document_number,
              entity_id,
              cost_center_id: item.cost_center_id,
              profit_center_id: item.profit_center_id,
              vendor_id,
              party_type: 'VENDOR',journal_id:journalExist.id,
              currency_id,
              currency_rate
            }, { transaction });
          }
        }

        const totalPayable = totalCredit - totalTDS;
        if (totalPayable > 0) {
          await db.financial_And_Account_Journal_List.create({
            debit_amount: totalPayable,
            credit_amount: 0.00,
            party_type: 'VENDOR',
            entry_status: 'Bank Payment',
            document_number: document_number,
            vendor_id,
            chart_account_id: 51,
            entity_id,
            financial_id,
            journal_id:journalExist.id,
            currency_id,
            currency_rate
          }, { transaction });
        }

        const createData = await db.paymentProgram.create({
          amount: document_value,
          reference_number: document_number,
          document_type: 'Bank Payment',
          entity_id,
          document_number,
          payment_status: 'Bank Payment'
        }, { transaction });

        await db.paymentProgramList.create({
          vendor_id,
          invoice_id,
          amount_due: parseFloat(amount_due || 0) - parseFloat(totalCredit),
          paid_amount: totalCredit,
          total_amount: document_value,
          payment_program_id: createData.id,
          bank_payment_id: createBankPayment.id
        }, { transaction });

        if (invoice_id) {
          let Obj = {};
          if (parseFloat(totalCredit) == parseFloat(amount_due || 0)) {
            Obj.payment_status = "PAID";
            await db.grnMaster.update(Obj, { where: { id: invoice_id }, transaction });
          } else {
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
          `, { transaction });

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
            debit_amount: totalCredit,
            credit_amount: 0,
            financial_id,
            chart_account_id: vendorAccount.chart_of_account_id,
            party_type: 'VENDOR',
            vendor_id,
            entity_id,
            entry_status: 'Bank Payment',
            document_number: createBankPayment.document_number,
            journal_id:journalExist.id,
            currency_id,
            currency_rate
          });
        }

        if (customer_id && customerAccount) {
          glEntries.push({
            debit_amount: totalCredit,
            credit_amount: 0,
            chart_account_id: 168,
            party_type: 'CUSTOMER',
            customer_id,
            financial_id,
            entity_id,
            entry_status: 'Bank Payment',
            document_number: createBankPayment.document_number,
            journal_id:journalExist.id,
        currency_id,
        currency_rate
          });
        }

        if (employee_id && employeeAccount) {
          glEntries.push({
            debit_amount: totalCredit,
            credit_amount: 0,
            financial_id,
            entity_id,
            chart_account_id: employeeAccount.chart_of_account_id,
            party_type: 'EMPLOYEE',
            employee_id,
            entry_status: 'Bank Payment',
            document_number: createBankPayment.document_number,
            journal_id:journalExist.id,
        currency_id,
        currency_rate
          });
        }

        if (totalTDS > 0 && tdsAccount) {
          glEntries.push({
            debit_amount: 0,
            credit_amount: totalTDS,
            financial_id,
            entity_id,
            chart_account_id: 45,
            entry_status: 'Bank Payment',
            document_number: createBankPayment.document_number,
            journal_id:journalExist.id,
        currency_id,
        currency_rate
          });
        }

        if (glEntries.length > 0) {
          await db.financial_And_Account_Journal_List.bulkCreate(
            glEntries.map(e => ({
              ...e,
              document_number: createBankPayment.document_number,
              entity_id
            })),
            { transaction }
          );
        }

        if (journalDocument?.length && journalDocument[0] != null) {
          await db.bankPaymentDoc.bulkCreate(
            journalDocument.map(i => ({
              upload_doc: i.file,
              bank_payment_id: createBankPayment.id
            })),
            { transaction }
          );
        }

        await transaction.commit();
        return res.status(200).send({
          code: 200,
          message: "Bank Payment + Multi-GL Posted Successfully"
        });
      }
    }

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({ code: 500, message: error.message });
  }
}
module.exports.generateBankPaymentNumber = async (req, res) => {
    try {
      const lastEntry = await db.bankPayment.findOne({
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
        number = `ACC-BP-${currentYear}-00001`;
      }
      return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

module.exports.getBankPaymentList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
        // const [getDataList] = await db.sequelize.query(
        //     `SELECT B.* ,MB.branch_name,VM.voucher_name
        //      FROM BANK_PAYMENT  AS B
        //      INNER JOIN MASTER_BRANCH AS MB ON MB.id = B.branch_id
        //      LEFT JOIN VOUCHER_MAIN_LIST_MST AS VM ON VM.id=B.voucher_list_id
        //     WHERE B.entity_id=${entity_id}
        //     ORDER BY B.id DESC`
        // )
        const [getDataList] = await db.sequelize.query(
          `SELECT P.*,MB.branch_name,SUM(PL.credit_amount) AS credit_amount,PL.amount_due
             FROM BANK_PAYMENT AS P
             INNER JOIN BANK_PAYMENT_ACCOUNT_LIST AS PL ON PL.bank_payment_id=P.id
             INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
             WHERE P.entity_id=${entity_id} 
             GROUP BY P.id ORDER BY P.id DESC
            `
        )
        // const finalValue = getDataList.map((md) => {
        //   const matchingUpdatedData = itemList.find((ud) =>
        //       ud.bank_payment_id === md.id );
        //   if (matchingUpdatedData) {
        //       return {
        //           ...md,
        //           credit_amount: matchingUpdatedData.debit_amount,
        //           debit_amount: matchingUpdatedData.debit_amount,
        //           gross_amount: matchingUpdatedData.gross_amount,
        //       };
        //   }
      
        //   return md; 
        // });
        if(getDataList){
            return res.status(200).send({code:200,message:'success',data:getDataList})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:getDataList})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message   })
    }
}


module.exports.getBankPaymentById = async(req,res)=>{
  try {
      const {id} = req.query;
      const [getDataList] = await db.sequelize.query(
          ` SELECT B.* ,MB.branch_name,B.voucher_list_id AS voucher_id,PP.*
           FROM BANK_PAYMENT  AS B
           LEFT JOIN PAYMENT_PROGRAM_LIST AS PP ON PP.bank_payment_id=B.id
           INNER JOIN MASTER_BRANCH AS MB ON MB.id = B.branch_id
          WHERE B.id=${id}`
      )
      const [itemList] = await db.sequelize.query(
        `SELECT DISTINCT PL.*,M.id AS bank_id
           FROM BANK_PAYMENT AS P
           INNER JOIN BANK_PAYMENT_ACCOUNT_LIST AS PL ON PL.bank_payment_id=P.id
           INNER JOIN MASTER_BANK_ACCOUNT AS M ON M.chart_account_id = PL.chart_account_id
           WHERE PL.bank_payment_id=${id}
           GROUP BY P.id`
      )
   
      const [DocumentList] = await db.sequelize.query(
        `SELECT PL.*
FROM PAYMENT_ADVICE AS P
INNER JOIN BANK_PAYMENT_DOCUMENT AS PL ON PL.bank_payment_id=P.id
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


module.exports.getBankPaymentReportList = async(req,res)=>{
  try {
      const {entity_id} = req.query;
      const [getDataList] = await db.sequelize.query(
          `SELECT P.* ,MB.branch_name
FROM BANK_PAYMENT AS P
INNER JOIN MASTER_BRANCH AS MB ON MB.id = P.branch_id
          WHERE P.entity_id=${entity_id}`
      )
      const [itemList] = await db.sequelize.query(
        `SELECT DISTINCT PL.* ,FC.cost_center_name,FP.profit_center_name,C.account_name AS chart_account_name,B.bank_name,
CONCAT(HR.first_name,' ',HR.last_name),V.vendor_name,S.company_name AS customer_name,MP.item_name AS product_name
FROM BANK_PAYMENT AS P
INNER JOIN BANK_PAYMENT_ACCOUNT_LIST AS PL ON PL.bank_payment_id=P.id
LEFT JOIN FINANCE_COST_CENTER AS FC ON FC.id=PL.cost_center_id
LEFT JOIN FINANCE_PROFIT_CENTER AS FP ON FP.id=PL.profit_center_id
LEFT JOIN CHART_OF_ACCOUNTS AS C ON C.id = PL.chart_account_id
LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PL.employee_id
LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = PL.vendor_id
LEFT JOIN CUSTOMER_PROFILE_MST AS S ON S.id=PL.customer_id
LEFT JOIN MASTER_ITEM AS MP ON MP.id=PL.product_id
LEFT JOIN MASTER_BANK AS B ON B.id=C.bank_id`
      )
      const finalValue = getDataList.map((md) => {
        const matchingUpdatedData = itemList.find((ud) =>
            ud.bank_payment_id == md.id );
     
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

module.exports.getPaymentAmountBYpaymentAdvoiceId = async (req, res) => {
  try {
    const { id, type } = req.query;
    let paidAmountList = [];
    let historyData = [];

    switch (type) {
      case 'PAYMENT_ADVICE_NUMBER':
        await handlePaymentAdvice(id, paidAmountList, historyData);
        break;
      case 'PAYMENT_ADVICE':
        await handlePaymentAdviceCustomer(id, paidAmountList, historyData);
        break;

      case 'PURCHASE_JOURNAL_NUMBER':
        await handlePurchaseJournal(id, paidAmountList, historyData);
        break;

      case 'Transport':
        await handleTransport(id, paidAmountList, historyData);
        break;

      case 'Service':
        await handleService(id, paidAmountList, historyData);
        break;

      case 'Sales Journal':
        await handleSalesJournal(id, paidAmountList, historyData);
        break;

      case 'travel_expense':
        await handleTravelExpense(id, paidAmountList, historyData);
        break;

      case 'other_expense':
        await handleOtherExpense(id, paidAmountList, historyData);
        break;

      case 'Reimbursement_expense':
        await handleReimbursementExpense(id, paidAmountList, historyData);
        break;

      case 'Purchase_service_voucher':
        await handlePurchaseServiceVoucher(id, paidAmountList, historyData);
        break;

      default:
        return res.status(400).send({
          code: 400,
          message: "Invalid type provided"
        });
    }

    if (paidAmountList.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: paidAmountList[0],
        historyData: historyData
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "Record Not Found",
        data: paidAmountList,
        historyData: []
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
};

async function handlePaymentAdvice(id, paidAmountList, historyData) {
  const dataLists = await db.paymentProgram.findOne({where:{id}})
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 
      P.*,P.amount AS document_value,
      SUM(PPL.paid_amount) AS amount,
      'VENDOR' AS party_type,PPL.document_no,
      PPL.vendor_id,
      PPL.payment_program_id
    FROM PAYMENT_PROGRAM AS P
    INNER JOIN PAYMENT_PROGRAM_LIST AS PPL 
      ON PPL.payment_program_id = P.id
    WHERE P.document_number = '${dataLists.document_number}'
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT 
      P.payment_program_id,P.document_no,
      SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP 
      ON PP.id = P.payment_program_id
    WHERE 
      P.document_no = '${dataLists.document_number}'
      AND PP.payment_program_status = 'Approved'
    GROUP BY P.document_no
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT PPL.*,PPL.id,PPL.paid_amount AS record_amount,PPL.payment_program_id,PPL.purchase_journal_id,
PPL.transport_voucher_id,PPL.service_voucher_id,PPL.sales_journal_id,PPL.expense_request_id,PPL.createdAt,
PPL.updatedAt,PP.document_type,'VENDOR' AS party_name,PP.document_number,PP.payment_program_status,VB.vendor_name,
CP.company_name,PPL.total_amount AS document_value,PPL.tds_rate_amount AS tds_rate_amount,PPL.current_rate AS current_rate,
HR.first_name AS employee_name
FROM PAYMENT_PROGRAM_LIST AS PPL
INNER JOIN PAYMENT_PROGRAM AS PP ON PP.document_number = PPL.document_no
LEFT JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PPL.vendor_id
LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = PPL.customer_id
LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PPL.employee_id
WHERE PPL.document_no = '${dataLists.document_number}'
    ORDER BY PPL.createdAt ASC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.document_no == md.document_number
    );
  
    const documentAmount = parseFloat(md.document_value || 0);
    const paidAmount = parseFloat(matchingData?.amount || 0);
    return {
      ...md,
      amount: documentAmount,
      amount_paid: paidAmount,
      amount_due: documentAmount - paidAmount
    };
  }));

  historyData.push(...historyList);
}
async function handlePaymentAdviceCustomer(id, paidAmountList, historyData) {
  const dataLists = await db.paymentProgram.findOne({where:{id}})
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 
      P.*,P.amount AS document_value,
      SUM(PPL.paid_amount) AS amount,
      'CUSTOMER' AS party_type,PPL.document_no,
      PPL.customer_id,
      PPL.payment_program_id
    FROM PAYMENT_PROGRAM AS P
    INNER JOIN PAYMENT_PROGRAM_LIST AS PPL 
      ON PPL.payment_program_id = P.id
    WHERE P.document_number = '${dataLists.document_number}'
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT 
      P.payment_program_id,P.document_no,
      SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP 
      ON PP.id = P.payment_program_id
    WHERE 
      P.document_no = '${dataLists.document_number}'
      AND PP.payment_program_status = 'Approved'
    GROUP BY P.document_no
  `);

  const [historyList] = await db.sequelize.query(`
     SELECT DISTINCT PPL.paid_amount AS record_amount,PPL.createdAt,PPL.total_amount,PPL.amount_due,
PPL.updatedAt,PP.document_type,'CUSTOMER' AS party_name,PP.document_number,PP.payment_program_status,
CP.company_name,PPL.total_amount AS document_value,PPL.current_rate AS current_rate
FROM PAYMENT_PROGRAM_LIST AS PPL
INNER JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
INNER JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = PPL.customer_id
WHERE PP.document_number = '${dataLists.document_number}' AND PP.payment_program_status='Approved'
    ORDER BY PPL.createdAt ASC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.document_no == md.document_number
    );
  
    const documentAmount = parseFloat(md.document_value || 0);
    const paidAmount = parseFloat(matchingData?.amount || 0);
    return {
      ...md,
      amount: documentAmount,
      amount_paid: paidAmount,
      amount_due: documentAmount - paidAmount
    };
  }));

  historyData.push(...historyList);
}

async function handlePurchaseJournal(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT P.net AS document_value, P.vendor_id, P.id, P.net AS amount, 
           P.document_number, VB.vendor_name
    FROM PURCHASE_JOURNAL AS P
    INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = P.vendor_id
    WHERE P.id = ${id}
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT P.purchase_journal_id, SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
    WHERE P.purchase_journal_id = ${id} AND PP.payment_program_status='Approved'
    GROUP BY P.purchase_journal_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT DISTINCT
      PPL.id,
      PPL.*,
      PP.amount AS document_value,
      PPL.paid_amount AS record_amount,
      PPL.purchase_journal_id,
      PPL.payment_program_id,
      PPL.createdAt,
      PPL.updatedAt,
      PP.document_number,
      PP.document_type,
      'VENDOR' AS party_name,
      TLM.rate,
      PP.payment_program_status,
      VB.vendor_name
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PPL.vendor_id
    LEFT JOIN TDS_LIST_MST AS TLM ON TLM.tds_id = PPL.tds_id
    WHERE PPL.purchase_journal_id = ${id}
    ORDER BY PPL.createdAt ASC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.purchase_journal_id == md.id
    );
    if (matchingData) {
      return {
        ...md,
        amount: parseFloat(md.amount || 0) - parseFloat(matchingData.amount || 0),
        amount_due: parseFloat(md.amount || 0) - parseFloat(matchingData.amount || 0),
        amount_paid: parseFloat(matchingData.amount || 0)
      };
    }
    return md;
  }));

  historyData.push(...historyList);
}

async function handleTransport(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 'VENDOR' AS party_type, P.*, VB.tm_name AS vendor_name, 
           P.bill_invoice_number AS document_number, 
           P.grand_total AS document_value, 
           P.createdAt, P.id AS transport_voucher_id
    FROM TRANSPORT_VOUCHER AS P
    INNER JOIN TM_TRANSPORTER_MASTER AS VB ON VB.id = P.transport_id
    WHERE P.id = ${id}
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT P.transport_voucher_id, SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
    WHERE P.transport_voucher_id = ${id} AND PP.payment_program_status='Approved'
    GROUP BY P.transport_voucher_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT DISTINCT
      PPL.id,
      PPL.*,
      PP.amount AS document_value,
      PPL.paid_amount AS record_amount,
      PPL.purchase_journal_id,
      PPL.transport_voucher_id,
      PPL.payment_program_id,
      PPL.createdAt,
      PPL.updatedAt,
      PP.document_number,
      PP.document_type,
      'VENDOR' AS party_name,
      TLM.rate,
      PP.payment_program_status,
      VB.tm_name AS vendor_name
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN TRANSPORT_VOUCHER AS TV ON TV.id = PPL.transport_voucher_id
    LEFT JOIN TM_TRANSPORTER_MASTER AS VB ON VB.id = TV.transport_id
    LEFT JOIN TDS_LIST_MST AS TLM ON TLM.tds_id = PPL.tds_id
    WHERE PPL.transport_voucher_id = ${id}
    ORDER BY PPL.createdAt ASC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.transport_voucher_id == md.transport_voucher_id
    );
    const documentAmount = parseFloat(md.document_value || 0);
    const paidAmount = matchingData ? parseFloat(matchingData.amount || 0) : 0;
    return {
      ...md,
      amount: documentAmount,
      amount_due: documentAmount - paidAmount,
      amount_paid: paidAmount
    };
  }));

  historyData.push(...historyList);
}

async function handleService(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 'CUSTOMER' AS party_type, SUM(PP.total_value) AS total_value,
           PP.createdAt, '0.00' AS amount_paid, PP.service_voucher_id,
           P.customer_id, P.id, SUM(PP.total_value) AS amount,
           P.document_number, VB.company_name
    FROM SERVICE_VOUCHER AS P
    INNER JOIN SERVICE_VOUCHER_ACCOUNT_LIST AS PP ON PP.service_voucher_id = P.id
    INNER JOIN CUSTOMER_PROFILE_MST AS VB ON VB.id = P.customer_id
    WHERE P.id = ${id} 
    GROUP BY P.id
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT P.service_voucher_id, SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    WHERE P.service_voucher_id = ${id}
    GROUP BY P.service_voucher_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT 
      PPL.id,
      PPL.*,
      PPL.paid_amount AS record_amount,
      PPL.service_voucher_id,
      PPL.payment_program_id,
      PPL.createdAt,
      PPL.updatedAt,
      PP.document_number,
      PP.payment_program_status,
      CP.company_name
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = PPL.customer_id
    WHERE PPL.service_voucher_id = ${id}
    ORDER BY PPL.createdAt DESC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.service_voucher_id == md.service_voucher_id
    );
    if (matchingData) {
      return {
        ...md,
        amount: parseFloat(md.amount || 0) - parseFloat(matchingData.amount || 0),
        amount_paid: matchingData.amount
      };
    }
    return md;
  }));

  historyData.push(...historyList);
}

async function handleSalesJournal(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 'CUSTOMER' AS party_type, P.bill_amount AS total_value,
           '0.00' AS amount_paid, PP.sales_journal_id,
           P.customer_id, P.id, P.bill_amount AS amount,
           P.document_number, VB.company_name
    FROM SALES_JOURNAL AS P
    INNER JOIN SALES_JOURNAL_ACCOUNT_LIST AS PP ON PP.sales_journal_id = P.id
    INNER JOIN CUSTOMER_PROFILE_MST AS VB ON VB.id = P.customer_id
    WHERE P.id = ${id}
    GROUP BY P.id;
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT P.sales_journal_id, SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    WHERE P.sales_journal_id = ${id}
    GROUP BY P.sales_journal_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT 
      PPL.id,
      PPL.*,
      PPL.paid_amount AS record_amount,
      PPL.sales_journal_id,
      PPL.payment_program_id,
      PPL.createdAt,
      PPL.updatedAt,
      PP.document_number,
      PP.payment_program_status,
      PP.document_type,
      CP.company_name
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = PPL.customer_id
    WHERE PPL.sales_journal_id = ${id}
    ORDER BY PPL.createdAt DESC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.sales_journal_id == md.sales_journal_id
    );
    if (matchingData) {
      return {
        ...md,
        amount: parseFloat(md.amount || 0) - parseFloat(matchingData.amount || 0),
        amount_paid: matchingData.amount
      };
    }
    return md;
  }));

  historyData.push(...historyList);
}

async function handleTravelExpense(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 'EMPLOYEE' AS party_type, '0.00' AS amount_paid,
           SUM(exp_amount) AS amount,
           ER.expense_request_number AS document_number,
           ER.id AS expense_request_id,
           HR.employee_id, HR.first_name
    FROM EXPENSE_REQUEST AS ER
    INNER JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = ER.employee_id
    INNER JOIN EXPENSE_REQUEST_DATA AS ERD ON ERD.expense_request_id = ER.id
    WHERE ER.id = ${id} 
    GROUP BY ER.id
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT P.expense_request_id, SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
    WHERE P.expense_request_id = ${id} AND PP.payment_program_status='Approved'
    GROUP BY P.expense_request_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT 
      PPL.id,
      PPL.*,
      PPL.paid_amount AS record_amount,
      PPL.expense_request_id,
      PPL.payment_program_id,
      PPL.createdAt,
      PPL.updatedAt,
      PP.payment_program_number AS document_number,
      PP.payment_program_status,
      HR.first_name AS employee_name,
      HR.last_name
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PPL.employee_id
    WHERE PPL.expense_request_id = ${id}
    ORDER BY PPL.createdAt DESC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.expense_request_id == md.expense_request_id
    );
    if (matchingData) {
      return {
        ...md,
        amount: parseFloat(md.amount || 0) - parseFloat(matchingData.amount || 0)
      };
    }
    return md;
  }));

  historyData.push(...historyList);
}

async function handleOtherExpense(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 
      'EMPLOYEE' AS party_type,
      0.00 AS amount_paid,
      SUM(ERD.exp_amount) AS document_value,
      ER.expense_request_number AS document_number,
      ER.id AS expense_request_id,
      HR.employee_id,
      HR.first_name
    FROM EXPENSE_REQUEST AS ER
    INNER JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = ER.employee_id
    INNER JOIN EXPENSE_REQUEST_DATA AS ERD ON ERD.expense_request_id = ER.id
    WHERE ER.id = ${id}
    GROUP BY ER.id
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT 
      P.expense_request_id,
      SUM(P.paid_amount) AS amount,
      SUM(P.paid_amount) AS document_value
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
    WHERE 
      P.expense_request_id = ${id}
      AND PP.payment_program_status = 'Approved'
    GROUP BY P.expense_request_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT 
      PPL.id,
      PPL.*,
      PPL.total_amount AS document_value,
      PPL.paid_amount AS record_amount,
      PPL.expense_request_id,
      PPL.payment_program_id,
      PPL.createdAt,
      PPL.updatedAt,
      PP.document_number,
      PP.payment_program_status,
      HR.first_name AS vendor_name,
      HR.last_name,
      'EMPLOYEE' AS party_name,
      'Other Expenses' AS document_type
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PPL.employee_id
    WHERE PPL.expense_request_id = ${id}
    ORDER BY PPL.createdAt DESC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.expense_request_id == md.expense_request_id
    );
    const totalAmount = Number(md.document_value || 0);
    const paidAmount = Number(matchingData?.amount || 0);
    return {
      ...md,
      amount: totalAmount,
      amount_paid: paidAmount,
      amount_due: totalAmount - paidAmount
    };
  }));

  historyData.push(...historyList);
}

async function handleReimbursementExpense(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 
      'EMPLOYEE' AS party_type,
      0.00 AS amount_paid,
      SUM(ERD.exp_amount) AS document_value,
      ER.expense_request_number AS document_number,
      ER.id AS expense_request_id,
      HR.employee_id,
      HR.first_name
    FROM EXPENSE_REQUEST AS ER
    INNER JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = ER.employee_id
    INNER JOIN EXPENSE_REQUEST_DATA AS ERD ON ERD.expense_request_id = ER.id
    WHERE ER.id = ${id}
    GROUP BY ER.id
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT
      P.expense_request_id,
      SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
    WHERE
      P.expense_request_id = ${id}
      AND PP.payment_program_status = 'Approved'
    GROUP BY P.expense_request_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT
      PPL.id,
      PPL.*,
      PPL.total_amount AS document_value,
      PPL.paid_amount AS record_amount,
      PPL.expense_request_id,
      PPL.payment_program_id,
      PPL.createdAt,
      PPL.updatedAt,
      PP.document_number,
      PP.payment_program_status,
      HR.first_name AS vendor_name,
      HR.last_name,
      'EMPLOYEE' AS party_name,
      'Reimbursement Expense' AS document_type
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PPL.employee_id
    WHERE PPL.expense_request_id = ${id}
    ORDER BY PPL.createdAt DESC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.expense_request_id == md.expense_request_id
    );
    const totalAmount = Number(md.document_value || 0);
    const paidAmount = Number(matchingData?.amount || 0);
    return {
      ...md,
      amount: totalAmount,
      document_value: totalAmount,
      amount_paid: paidAmount,
      amount_due: totalAmount - paidAmount
    };
  }));

  historyData.push(...historyList);
}

async function handlePurchaseServiceVoucher(id, paidAmountList, historyData) {
  const [paidAmountListAmount] = await db.sequelize.query(`
    SELECT 
      P.*,
      P.net AS document_value,
      P.vendor_id,
      PPL.payment_program_id
    FROM PURCHASE_SERVICE_VOUCHER AS P
    INNER JOIN PAYMENT_PROGRAM_LIST AS PPL 
      ON PPL.purchase_service_voucher_id = P.id
    WHERE PPL.purchase_service_voucher_id = ${id}
  `);

  const [dataList] = await db.sequelize.query(`
    SELECT 
      P.payment_program_id,
      SUM(P.paid_amount) AS amount
    FROM PAYMENT_PROGRAM_LIST AS P
    INNER JOIN PAYMENT_PROGRAM AS PP 
      ON PP.id = P.payment_program_id
    WHERE 
      P.purchase_service_voucher_id = ${id}
      AND PP.payment_program_status = 'Approved'
    GROUP BY P.purchase_service_voucher_id
  `);

  const [historyList] = await db.sequelize.query(`
    SELECT 
      PPL.*,
      PPL.id,
      PPL.paid_amount AS record_amount,
      PPL.payment_program_id,
      PPL.purchase_journal_id,
      PPL.transport_voucher_id,
      PPL.service_voucher_id,
      PPL.sales_journal_id,
      PPL.expense_request_id,
      PPL.createdAt,
      PPL.updatedAt,
      TLM.rate,
      PPL.total_amount AS document_value,
      PP.document_type,
      'VENDOR' AS party_name,
      PP.document_number,
      PP.payment_program_status,
      VB.vendor_name,
      CP.company_name,
      HR.first_name AS employee_name
    FROM PAYMENT_PROGRAM_LIST AS PPL
    LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = PPL.payment_program_id
    LEFT JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PPL.vendor_id
    LEFT JOIN CUSTOMER_PROFILE_MST AS CP ON CP.id = PPL.customer_id
    LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PPL.employee_id
    LEFT JOIN TDS_LIST_MST AS TLM ON PPL.nature_id = TLM.id
    WHERE PPL.purchase_service_voucher_id = ${id}
    ORDER BY PPL.createdAt DESC
  `);

  paidAmountList.push(...paidAmountListAmount.map((md) => {
    const matchingData = dataList.find(
      (ud) => ud.document_number_id == md.document_number_id
    );
    const totalAmount = Number(md.document_value || 0);
    const paidAmount = Number(matchingData?.amount || 0);
    return {
      ...md,
      amount: totalAmount,
      document_value: totalAmount,
      amount_paid: paidAmount,
      amount_due: totalAmount - paidAmount
    };
  }));

  historyData.push(...historyList);
}

module.exports.downloadBankPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [getDataList] = await db.sequelize.query(
      `SELECT  B.*,MB.branch_name,B.voucher_list_id AS voucher_id,V.vendor_name AS company_name,E.entity_name,
        E.tax_registration_number AS entity_gst_in, E.registered_office,E.logo
      FROM BANK_PAYMENT AS B
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
      FROM BANK_PAYMENT AS P
      INNER JOIN BANK_PAYMENT_ACCOUNT_LIST AS PL ON PL.bank_payment_id = P.id
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
      "../../../../src/assets/templates/bank_payment.html"
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

      heading: "BANK PAYMENT VOUCHER",

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
      `attachment; filename="bank_payment_${
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