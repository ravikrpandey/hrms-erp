
const db = require("../../../models/index");

exports.create_expenseType = async (req, res) => {
    try {
        const { expense_type } = req.body;
     

        const isExist = await db.expenseType.findOne({ where: { expense_type: expense_type, isDeleted: false } });
        if (isExist) {
            return res.status(400).send({ code: 400, message: "Expense Type Already Exiting!" });
        }
        const response = await db.expenseType.create({
            expense_type: expense_type, 
        });
        return res.status(200).send({ code: 200, message: "Expense Type Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAll_active_expenseType = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_EXPENSE 
            WHERE isDeleted = false 
              AND status = 'ACTIVE'
            ORDER BY expense_type ASC;
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




exports.getAll_expenseType = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_EXPENSE 
            WHERE isDeleted = false
            ORDER BY expense_type ASC;
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




exports.getById_expenseType = async (req, res) => {
    try {
        
        const { id } = req.params;
        const sqlQuery = `
            SELECT * 
            FROM MASTER_EXPENSE 
            WHERE isDeleted = false 
              AND id = :id
            ORDER BY expense_type ASC;
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

exports.update_expenseType = async (req, res) => {
    try {
        const { id } = req.params;
        const { expense_type, status } = req.body;

        const isExist = await db.expenseType.findOne({ where: { id: id, isDeleted: false } });
        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Expense Type not found!" });
        }
        if (expense_type) {
            const isDuplicate = await db.expenseType.findOne({
                where: {
                    expense_type: expense_type,
                    isDeleted: false,
                    id: { [db.Sequelize.Op.ne]: id },
                    isDeleted: false
                }
            });
            if (isDuplicate) {
                return res.status(400).send({ code: 400, message: "Expense Type already exists!" });
            }
        }
        await db.expenseType.update({
            expense_type: expense_type,
            status: status
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};


exports.delete_expenseType = async (req, res) => {
    try {
        const { id } = req.params;

        let isExist = await db.expenseType.findOne({ where: { id: id } })
        if (isExist) {
            if (isExist.isDeleted == true) {
                return res.status(400).send({ code: 400, message: "Expense already deleted" })
            }

            let saveUpdate = await db.expenseType.update({ isDeleted: true }, { where: { id: id } })

            return res.status(200).send({ code: 200, message: "Deleted Successfully", data: saveUpdate });
        }

        return res.status(404).send({ code: 404, message: "Expense Id not found", data: isExist });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};