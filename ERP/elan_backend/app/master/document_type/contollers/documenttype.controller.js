const db = require("../../../models/index.js");
// const stageDetails = db.stage;
const documentType = db.documentTypeMaster
const op = db.sequelize.op;
const logger = require('../../../../logger/index');


exports.createDocumentType = async (req, res) => {
    try {
        const { document_name } = req.body;
        const documenttypedata = await documentType.findOne({ where: { document_name: document_name, status: 'ACTIVE' } });
        if (documenttypedata) {
            return res.status(201).send({ code: 201, message: "Document Type Name Already Exists!" });
        }
        const response = await documentType.create({
            document_name
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.getAllDocumentType = async (req, res) => {
    try {
        const getAllData = await documentType.findAll({
            where: {
                status: 'ACTIVE',
            },
            order: [['id', 'ASC']],
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};