const db = require('../../../models/index')


module.exports.createServiceVoucher = async (req, res) => {

  const transaction = await db.sequelize.transaction();

  try {

    const {
      document_number,
      financial_id,
      posting_date,
      Account_details,
      transaction_date,
      notes,
      reference_number,
      voucher_id,
      sales_value,
      bill_amount,
      branch_id,
      customer_id,
      entity_id,
      document_type,
      sales_booking_id,
      sales_invoice_id,
      sales_order_id,
      sales_quotation_id,
      proforma_invoice_id,
      calculatedAmt,
    } = req.body;



    const serviceVoucher = await db.serviceVoucher.create({

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
      sales_order_id,
      proforma_invoice_id,
      quotation_id: sales_quotation_id,

      cgstAmt: calculatedAmt.cgst,
      taxableAmt: calculatedAmt.taxable,
      gstTotalAmt: calculatedAmt.gstTotal,
      sgstAmt: calculatedAmt.sgst,
      igstAmt: calculatedAmt.igst,
      totalDiscount: calculatedAmt.totalDiscount,
      netAmt: calculatedAmt.net,
      grossAmt: calculatedAmt.gross

    }, { transaction });




    await Promise.all(

      Account_details.map(async (i) => {

        const {
          narration,
          service_id,
          cost_center_id,
          profit_center_id,
          qty,
          rate,
          discount_amount,
          discount_type,
          discount_value,
          total_value,
          gst_rate,
          gst_amount
        } = i;

        await db.serviceVoucherList.create({

          narration,
          service_id,
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
          service_voucher_id: serviceVoucher.id

        }, { transaction });

      })

    );



    const journalEntries = [];



    for (const field of Account_details) {

      const service = await db.Service_master.findOne({
        where: { service_id: field.service_id },
        attributes: ['chart_of_account_id'],
        transaction
      });

      const taxableAmount =
        Number(field.total_value || 0) -
        Number(field.gst_amount || 0);

      journalEntries.push({

        debit_amount: 0.00,
        credit_amount: taxableAmount,

        chart_account_id: service?.chart_of_account_id,

        entity_id: entity_id,
        financial_id,

        entry_status: 'Service Voucher',
        document_number: document_number

      });

    }

    if (Number(calculatedAmt.igst) > 0) {

      journalEntries.push({

        debit_amount: 0.00,
        credit_amount: calculatedAmt.igst,

        financial_id,
        chart_account_id: 31,

        entity_id: entity_id,
        entry_status: 'Service Voucher',
        document_number: document_number

      });

    }



    if (Number(calculatedAmt.cgst) > 0) {

      journalEntries.push({

        debit_amount: 0.00,
        credit_amount: calculatedAmt.cgst,

        financial_id,
        chart_account_id: 23,

        entity_id: entity_id,
        entry_status: 'Service Voucher',
        document_number: document_number

      });

    }



    if (Number(calculatedAmt.sgst) > 0) {

      journalEntries.push({

        debit_amount: 0.00,
        credit_amount: calculatedAmt.sgst,

        financial_id,
        chart_account_id: 43,

        entity_id: entity_id,
        entry_status: 'Service Voucher',
        document_number: document_number

      });

    }



    if (Number(calculatedAmt.totalDiscount) > 0) {

      journalEntries.push({

        debit_amount: calculatedAmt.totalDiscount,
        credit_amount: 0,

        financial_id,
        chart_account_id: 372,

        entity_id: entity_id,
        entry_status: 'Service Voucher',
        document_number: document_number

      });

    }




    journalEntries.push({

      debit_amount: calculatedAmt.net,
      credit_amount: 0,

      chart_account_id: 168,

      entity_id: entity_id,
      financial_id,

      entry_status: 'Service Voucher',
      document_number: document_number,

      customer_id: customer_id,
      party_type: 'CUSTOMER'

    });



    await db.financial_And_Account_Journal_List.bulkCreate(
      journalEntries,
      { transaction }
    );



    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: 'Service Voucher Created Successfully'
    });

  }
  catch (error) {

    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message
    });

  }

};

module.exports.generateServiceVoucherNumber = async (req, res) => {
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
    const lastEntry = await db.serviceVoucher.findOne({
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

}

module.exports.getServiceVoucherList = async (req, res) => {
  let { entity_id } = req.query;
  try {
    const data = await db.serviceVoucher.findAll({
      include: [
        {
          model: db.serviceVoucherList
        },
        {
          model: db.tbl_branch
        },
        {
          model: db.customerProfile
        }
      ]
    })

    if (data) {
      return res.status(200).send({ code: 200, message: 'All Data', data: data })
    }

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message })

  }

}
module.exports.getServiceVoucherById = async (req, res) => {
  let { id } = req.params;
  try {
    const data = await db.serviceVoucher.findOne({
      where: { id },
      include: [
        {
          model: db.serviceVoucherList
        }
      ]
    });

    if (data) {
      return res.status(200).send({ code: 200, message: 'All Data', data: data })
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message })

  }

}