const db = require('../../../models/index')
const ContractType = db.contract_types
const logger = require('../../../../logger/index');
exports.createContractType = async (req, res) => {
    try {
        const { contract_type, entity_id, financial_id } = req.body;
        const existingContractType = await ContractType.findOne({
            where: {
                contract_type: contract_type,
                entity_id: entity_id,
                financial_id: financial_id,
                isDeleted: false,
                status: 'ACTIVE'
            }
        });

        if (existingContractType) {
            return res.status(201).send({ code: 201, message: "Contract Type Already Exists" });
        } else {
            const newContractType = await ContractType.create({
                contract_type: contract_type,
                entity_id: entity_id,
                financial_id: financial_id
            });

            return res.status(200).send({ code: 200, message: "Contract Type created", data: newContractType });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};



exports.getContractTypes = async (req, res) => {
    try {
        const entity_id = req.params.entity_id;
        const financial_id = req.params.financial_id;

        const contractTypes = await ContractType.findAll({
            where: {
                isDeleted: false,
                entity_id: entity_id,
                financial_id: financial_id,
            },
            order: [['id', 'DESC']],
        });

        if (contractTypes.length > 0) {
            return res.status(200).send({ code: 200, message: "All Contract Types Retrieved", data: contractTypes });
        } else {
            return res.status(404).send({ code: 404, message: "No Contract Types Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};



exports.get_Active_ContractTypes = async (req, res) => {
    try {

        const contractTypes = await ContractType.findAll({ where: { isDeleted: false, status: "Active" } });

        if (contractTypes.length > 0) {
            return res.status(200).send({ code: 200, message: "All Contract Types Retrieved", data: contractTypes });
        } else {
            return res.status(404).send({ code: 404, message: "No Contract Types Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};


exports.getContractTypeById = async (req, res) => {
    const contractTypeId = req.params.id;

    try {
        const contractType = await ContractType.findOne({ where: { id: contractTypeId, isDeleted: false } });

        if (!contractType) {
            return res.status(404).send({ code: 404, message: "Contract Type not found" });
        }

        return res.status(200).send({ code: 200, message: "Contract Type found", data: contractType });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};


exports.updateContractTypeById = async (req, res) => {
    const contractTypeId = req.params.id;
    const { contract_type, entity_id, financial_id } = req.body;
    try {
        let contractType = await ContractType.findOne({ where: { id: contractTypeId } });

        if (!contractType) {
            return res.status(404).send({ code: 404, message: "Contract Type not found" });
        } else {
            const Contractt = await ContractType.findOne(
                { where: { contract_type: contract_type, entity_id, financial_id, isDeleted: false, status:'ACTIVE' } })
            if (Contractt) {
                return res.status(201).send({ code: 201, message: "Contract Type Already Exists" });
            } else {
                const Contract_type = await ContractType.update({
                    contract_type,

                }, {
                    where: {
                        id: contractTypeId,
                        isDeleted: false
                    }
                })

                return res.status(200).send({ code: 200, message: "Contract Type updated successfully", data: Contract_type });
            }
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal server error" });
    }
};



exports.deleteContractTypeById = async (req, res) => {
    try {
        const contractTypeId = req.params.id
        const dltStage = await ContractType.findOne({ where: { id: contractTypeId } });
        if (dltStage) {
            const deleteData = await ContractType.update({ isDeleted: true }, { where: { id: contractTypeId } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.CONStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await ContractType.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await ContractType.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
