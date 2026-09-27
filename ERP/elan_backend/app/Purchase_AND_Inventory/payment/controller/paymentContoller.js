const db = require("../../../models/index");
const logger = require('../../../../logger/index');
const path = require('path');


module.exports.createPaymentinvoice = async (req, res) => {
    try {
        const { total_tax, total_amt, adv_paid, cheque_number, amt_due, amt_paid,
            doc, terms, remarks, bank_id, payment_mode, version_id, entity_id,
            financial_year_id, po_id, bank_account_name } = req.body;


        const newPayment = await db.PaymentModel.create({
            total_tax, total_amt, adv_paid, cheque_number, amt_due, amt_paid, doc, terms, remarks, bank_id,
            payment_mode, version_id, entity_id, financial_year_id, po_id, bank_account_name
        });

        return res.status(201).send({
            code: 201, message: "Payment created successfully.",
            data: newPayment
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Something went wrong while creating payment."
        });
    }
};


module.exports.getbankaccountname = async (req, res) => {
    try {

        const { id } = req.query;
        if (!id) {
            return res.status(400).send({ code: 400, message: "Bank ID is required." });
        }
        const bankData = await db.createBank.findOne({
            where: { id: id },
            include: [{
                model: db.createBankAccount,
                attributes: ['account_name']
            }]
        });

        if (!bankData) {
            return res.status(404).send({ code: 404, message: "Bank account not found." });
        }

        return res.status(200).send({
            code: 200,
            account_name: bankData
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Something went wrong while creating payment."
        });
    }
}

module.exports.getpaymentInvoiceData = async (req, res) => {
    try {
        const { po_id, v_id } = req.query;

        if (!po_id) { return res.status(400).send({ code: 400, message: "ID is required." }) }
        const bankData = await db.PaymentModel.findAll({
            where: { po_id: po_id, version_id: v_id },
            include: [
                {
                    model: db.purchase_order,
                    include: [{
                        model: db.purchase_order_item,
                    }]
                },
                {
                    model: db.createBank,
                    attributes: ['bank_name', 'id'],
                    include: [{
                        model: db.createBankAccount,
                        attributes: ['account_name', 'id', 'bank_id']
                    }]
                },
            ]
        });

        if (!bankData) { return res.status(404).send({ code: 404, message: "Data not found." }); }

        return res.status(200).send({ code: 200, data: bankData });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Something went wrong while fetching payment data."
        });
    }
};
