
const db = require("../../../models/index");

exports.create_need = async (req, res) => {
    
   
    try {
        const { need_type } = req.body;

        const isExist = await db.needType.findOne({ where: { need_type: need_type, isDeleted: false } });
        if (isExist) {
            return res.status(400).send({ code: 400, message: "Type Of Need Already Existing!" });
        }
        const response = await db.needType.create({
            need_type: need_type, 
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAll_active_need = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_NEED 
            WHERE isDeleted = false 
              AND status = 'ACTIVE'
            ORDER BY need_type ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery);

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: data });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getAll_need = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_NEED 
            WHERE isDeleted = false
            ORDER BY need_type ASC;
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




exports.getById_need = async (req, res) => {
    try {
        const { id } = req.params;
        const sqlQuery = `
            SELECT * 
            FROM MASTER_NEED 
            WHERE isDeleted = false 
              AND id = :id
            ORDER BY need_type ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery, {
            replacements: { id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.update_need = async (req, res) => {
    try {
        const { id } = req.params;
        const { need_type, status } = req.body;

        const isExist = await db.needType.findOne({ where: { id: id, isDeleted: false } });
        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Need Type not found!" });
        }
        if (need_type) {
            const isDuplicate = await db.needType.findOne({
                where: {
                    need_type: need_type,
                    isDeleted: false,
                    id: { [db.Sequelize.Op.ne]: id },
                    isDeleted: false
                }
            });
            if (isDuplicate) {
                return res.status(400).send({ code: 400, message: "Need Type already exists!" });
            }
        }
        await db.needType.update({
            need_type: need_type,
            status: status
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};



exports.delete_need = async (req, res) => {
    try {
        const { id } = req.params;

        let isExist = await db.needType.findOne({ where: { id: id } })
        if (isExist) {
            if (isExist.isDeleted == true) {
                return res.status(400).send({ code: 400, message: "Need Type already deleted" })
            }

            let saveUpdate = await db.needType.update({ isDeleted: true }, { where: { id: id } })

            return res.status(200).send({ code: 200, message: "Deleted Successfully", data: saveUpdate });
        }

        return res.status(404).send({ code: 404, message: "Need Id not found", data: isExist });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};