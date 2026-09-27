const db = require("../../../models/index");

module.exports.billingList = async (req, res, next) => {
    try {
        const billingData = await db.tbl_branch.findAll({ where: { billing_status: true } });
        if (billingData) {
            return res.status(200).send({ code: 200, data: billingData });
        } else {
            return res.status(404).send({ code: 404, message: 'Billing not found', data: billingData })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}

module.exports.createBilling = async (req, res) => {
    try {
        const { branch_id, company_name, gst_no, complete_address, proposal_id } = req.body;
        const proposalExists = await db.models.proposalData.findOne({ where: { id: proposal_id } });
        if (!proposalExists) {
            return res.status(404).send({ code: 404, message: ' Proposal not found ' });
        }
        const branchExists = await db.tbl_branch.findOne({ where: { id: branch_id } });
        if (!branchExists) {
            return res.status(404).send({ code: 404, message: ' Branch not found ' });
        }
        const createInvoice = await db.models.billingData.create({
            branch_id, company_name, gst_no, complete_address, proposal_id
        })
        if (createInvoice) {
            return res.status(201).send({ code: 201, message: 'successfully created' })
        } else {
            return res.status(404).send({ code: 404, message: 'not created' })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


module.exports.getUpdatedAddress = async (req, res, next) => {
    try {
        const updatedData = await db.models.billingData.findOne({
            order: [['createdAt', 'DESC']], // Assuming 'createdAt' is a timestamp field
        });
        if (updatedData) {
            return res.status(200).send({ code: 200, data: updatedData });
        } else {
            return res.status(404).send({ code: 404, message: 'Billing not found', data: updatedData })
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}