const db = require("../../../models/index");
const PDFDocument = require('pdfkit');
const path = require('path');


module.exports.createInvoice = async (req, res) => {
    try {
        const { billing_id, invoice_remark, proposal_id } = req.body;
        const proposalExists = await db.models.proposalData.findOne({ where: { id: proposal_id } });
        if (!proposalExists) {
            return res.status(404).send({ code: 404, message: ' Proposal not found ' });
        }
        const createInvoice = await db.models.invoiceData.create({
            billing_id, invoice_remark, proposal_id
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

module.exports.getInvoiceList = async (req, res) => {
    try {
        const getList = await db.invoiceData.findAll({
            include: [
                {
                    model: db.proposalData,
                    attributes: ['grant_total'],
                    required: true
                },
            ],
            where: { proposal_id: req.params.id }
        });

        const formattedList = getList.map(item => {
            return {
                id: item.id,
                invoice_remark: item.invoice_remark,
                status: item.status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                proposal_id: item.proposal_id,
                billing_id: item.billing_id,
                grant_total: item.CRM_CREATE_PROPOSAL_MST.grant_total
            };
        });

        if (formattedList.length > 0) {
            return res.status(200).send({ code: 200, message: 'success', data: formattedList });
        } else {
            return res.status(404).send({ code: 404, message: 'data not found', data: formattedList });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getDownloadInvoiceById = async (req, res) => {
    try {

        const file = req.params.file;
        const filePath = path.join(__dirname, 'downloads', file);
        res.download(filePath, file);
    } catch (error) {
        return res.status(500).send({ code: 500, message: 'server error' })
    }
}
//     const file = req.params.file;
//     const filePath = path.join(__dirname, 'downloads', file);
//     res.download(filePath, file);
// });
