const db = require("../../../models/index");

const generateBankCode = async () => {
    const lastBank = await db.bank_master.findOne({
        order: [['bank_code', 'DESC']],
        attributes: ['bank_code'],
        where: {
            bank_code: {
                [db.Sequelize.Op.like]: '120%'
            }
        }
    });

    if (!lastBank) {
        return '120000001';
    }

    const lastCode = parseInt(lastBank.bank_code, 10);
    const nextCode = lastCode + 1;

    return nextCode.toString();
};

exports.createBank = async (req, res) => {
    try {
        const { bank_name, entity_id, bank_code} = req.body;

        const existCompany = await db.entityMaster.findOne({ where: { id: entity_id, isDeleted: false } });
        if (existCompany) {
            const existBank = await db.bank_master.findOne({ where: { bank_name: bank_name,  isDeleted: false } });
            if (existBank) {
                return res.status(201).send({ code: 201, message: "Bank Name already exists!" });
            }

            // const bank_code = await generateBankCode();

            const response = await db.bank_master.create({
                bank_name,
                bank_code,
                entity_id,
             
            });

            return res.status(200).send({ code: 200, message: "Bank Created Successfully", data: response });
        } else {
            return res.status(404).send({ code: 404, message: "Company Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllBANK = async (req, res) => {
    try {
        const data = await db.bank_master.findAll({
            where: {
                isDeleted: false,
            }, order: [['id', 'DESC']],
        })
        if (data) {
            return res.status(200).send({ code: 200, message: "Get All Bank data successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAll_Active_BANK = async (req, res) => {
    try { 
        const data = await db.bank_master.findAll({
            where: {
                isDeleted: false,status:"Active",
            }, order: [['id', 'DESC']],
        })
        if (data) {
            return res.status(200).send({ code: 200, message: "Get All Bank data successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.getByIdBank = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await db.bank_master.findOne({ where: { id: id, isDeleted: false } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch Bank Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updateBankById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ code: 400, message: "ID is required" });
        }
        const { bank_name,  entity_id ,bank_code} = req.body;
        if (!bank_name) {
            return res.status(400).send({ code: 400, message: "Bank name is required" });
        }

        const existingBank = await db.bank_master.findOne({
            where: {
                bank_name: bank_name,
                id: { [db.Sequelize.Op.ne]: id },
                isDeleted: false
            }
        });

        if (existingBank) {
            return res.status(400).send({ code: 400, message: "Bank name already exists" });
        }

        const [updateCount] = await db.bank_master.update(
            { bank_name: bank_name,  entity_id: entity_id ,bank_code:bank_code},
            { where: { id: id, isDeleted: false } }
        );

        if (updateCount === 0) {
            return res.status(404).send({ code: 404, message: "Bank Details is not found" });
        }

        return res.status(200).send({ code: 200, message: "Bank updated successfully" });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.deleteBank = async (req, res) => {
    try {
        const id = req.params.id
        const dltStage = await db.bank_master.findOne({ where: { id: id } });
        if (dltStage) {
            const deleteData = await db.bank_master.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.BankStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await db.bank_master.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await db.bank_master.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: "Bank Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
