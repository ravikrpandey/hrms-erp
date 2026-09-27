
const db = require("../../../models/index");

exports.create_budget_category = async (req, res) => {
    try {
        
        const { budget_category } = req.body;
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id)
        const isExist = await db.budgetCategory.findOne({ where: { entity_id: entity_id, budget_category: budget_category, isDeleted: false } });
        if (isExist) {
            return res.status(400).send({ code: 400, message: "Budget Category Already Existing!" });
        }
        const response = await db.budgetCategory.create({
            budget_category: budget_category, entity_id: entity_id
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getall_active_budget_category = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id)

        let sqlQuery = `
            SELECT * 
            FROM MASTER_BUDGET_CATEGORY 
            WHERE isDeleted = false 
              AND status = 'ACTIVE'
        `;

        const queryParams = [];

        if (entity_id) {
            sqlQuery += ' AND entity_id = ?';
            queryParams.push(entity_id);
        }

        sqlQuery += ' ORDER BY budget_category ASC;';

        const [data] = await db.sequelize.query(sqlQuery, { replacements: queryParams });

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



exports.getall_budget_category = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        let sqlQuery = `
            SELECT * 
            FROM MASTER_BUDGET_CATEGORY 
            WHERE isDeleted = false
        `;

        const queryParams = [];

        if (entity_id) {
            sqlQuery += ' AND entity_id = ?';
            queryParams.push(entity_id);
        }

        sqlQuery += ' ORDER BY budget_category ASC;';

        const [data] = await db.sequelize.query(sqlQuery, { replacements: queryParams });

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};



exports.getbyId_budget_category = async (req, res) => {
    try {
        const { id } = req.params;
        const sqlQuery = `
            SELECT * 
            FROM MASTER_BUDGET_CATEGORY 
            WHERE isDeleted = false 
              AND id = :id
            ORDER BY budget_category ASC;
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

exports.update_budget_category = async (req, res) => {
    try {
        const { id } = req.params;
        const { budget_category, status } = req.body;

        const isExist = await db.budgetCategory.findOne({ where: { id: id, isDeleted: false } });
        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Id not found!" });
        }

        if (budget_category) {
            const isDuplicate = await db.budgetCategory.findOne({
                where: {
                    budget_category: budget_category,
                    isDeleted: false,
                    id: { [db.Sequelize.Op.ne]: id },
                    isDeleted: false
                }
            });
            if (isDuplicate) {
                return res.status(400).send({ code: 400, message: "Budget Category already exists!" });
            }
        }

        await db.budgetCategory.update({
            budget_category: budget_category,
            status: status
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};



exports.delete_budget_category = async (req, res) => {
    try {
        const { id } = req.params;

        let isExist = await db.budgetCategory.findOne({ where: { id: id } })
        if (isExist) {
            if (isExist.isDeleted == true) {
                return res.status(400).send({ code: 400, message: "Budget Category already deleted" })
            }

            let saveUpdate = await db.budgetCategory.update({ isDeleted: true }, { where: { id: id } })

            return res.status(200).send({ code: 200, message: "Deleted Successfully", data: saveUpdate });
        }

        return res.status(404).send({ code: 404, message: "Budget Id not found", data: data });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};