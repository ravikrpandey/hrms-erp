
const db = require("../../../models/index");

exports.create_sealType = async (req, res) => {
    try {
        const { seal_type } = req.body;
     
        const isExist = await db.sealType.findOne({ where: { seal_type: seal_type, isDeleted: false } });
        if (isExist) {
            return res.status(400).send({ code: 400, message: "Seal Type Already Exist!" });
        }
        const response = await db.sealType.create({
            seal_type: seal_type, 
        });
        return res.status(200).send({ code: 200, message: "Seal Type Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAll_active_sealType = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_SEAL 
            WHERE isDeleted = false
             AND status = 'ACTIVE'
            ORDER BY seal_type ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery);

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getAll_sealType = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_SEAL 
            WHERE isDeleted = false
            ORDER BY seal_type ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery);

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getById_sealType = async (req, res) => {
    try {
        
        const { id } = req.params;
        const sqlQuery = `
            SELECT * 
            FROM MASTER_SEAL 
            WHERE isDeleted = false 
              AND id = :id
            ORDER BY seal_type ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery, {
            replacements: { id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.update_sealType = async (req, res) => {
    try {
        const { id } = req.params;
        const { seal_type, status } = req.body;

        const isExist = await db.sealType.findOne({ where: { id: id, isDeleted: false } });
        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Seal Type not found!" });
        }
        if (seal_type) {
            const isDuplicate = await db.sealType.findOne({
                where: {
                    seal_type: seal_type,
                    isDeleted: false,
                    id: { [db.Sequelize.Op.ne]: id },
                    isDeleted: false
                }
            });
            if (isDuplicate) {
                return res.status(400).send({ code: 400, message: "Seal Type already exists!" });
            }
        }
        await db.sealType.update({
            seal_type: seal_type,
            status: status
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};


exports.delete_sealType = async (req, res) => {
    try {
        const { id } = req.params;

        let isExist = await db.sealType.findOne({ where: { id: id } })
        if (isExist) {
            if (isExist.isDeleted == true) {
                return res.status(400).send({ code: 400, message: "Seal already deleted" })
            }

            let saveUpdate = await db.sealType.update({ isDeleted: true }, { where: { id: id } })

            return res.status(200).send({ code: 200, message: "Deleted Successfully", data: saveUpdate });
        }

        return res.status(404).send({ code: 404, message: "Seal Id not found", data: isExist });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};