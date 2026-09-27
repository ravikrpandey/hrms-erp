
const { extend } = require("node-input-validator");
const db = require("../../../models/index");
const logger = require('../../../../logger/index');

exports.create_budgetPlan = async (req, res) => {
    try {
        const { financial_year_id, start_date, end_date } = req.body;
        let { entity_id, filter_fy } = req.query;
        entity_id = parseInt(entity_id);
        filter_fy = parseInt(filter_fy);

        function convertToIST(utcDateString) {
            return new Date(new Date(utcDateString).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
        }
        
        let  startDate =  convertToIST(start_date);
        let endDate  = convertToIST(end_date);



        const isExist = await db.budgetPlanDate.findOne({ where: { entity_id:entity_id, financial_year_id: financial_year_id, filter_fy:filter_fy, isDeleted: false } });
        if (isExist) {
            return res.status(400).send({ code: 400, message: "Budget Plan Year Already Exists!" });
        }
        const response = await db.budgetPlanDate.create({
            financial_year_id: financial_year_id, start_date: startDate, end_date: endDate,entity_id:entity_id,filter_fy:filter_fy,
        });

        return res.status(200).send({ code: 200, message: "Budget Plan Date Created Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAll_active_budgetPlan = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id)
        
        const sqlQuery = `
            SELECT 
                fbpd.id, 
                fbpd.start_date, 
                fbpd.end_date, 
                fbpd.status, 
                fbpd.isDeleted, 
                fbpd.createdAt, 
                fbpd.updatedAt, 
                fbpd.financial_year_id,
                mfy.financial_year
            FROM 
                FINANCE_BUDGET_PLAN_DATE fbpd
            JOIN 
                MASTER_FINANCIAL_YEAR mfy
            ON 
                fbpd.financial_year_id = mfy.id
            WHERE 
                fbpd.isDeleted = false 
                AND fbpd.status = 'ACTIVE'
                AND mfy.isDeleted = false
            ORDER BY 
                mfy.financial_year ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery);

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: data });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAll_budgetPlan = async (req, res) => {
    try {
        let { entity_id, filter_fy } = req.query;
        entity_id = parseInt(entity_id);
        filter_fy = parseInt(filter_fy);

        const sqlQuery = `
            SELECT 
                fbpd.id, 
                fbpd.start_date, 
                fbpd.end_date, 
                fbpd.status, 
                fbpd.filter_fy,
                fbpd.isDeleted, 
                fbpd.createdAt, 
                fbpd.updatedAt, 
                fbpd.financial_year_id,
                mfy.financial_year
            FROM 
                FINANCE_BUDGET_PLAN_DATE fbpd
            JOIN 
                MASTER_FINANCIAL_YEAR mfy
            ON 
                fbpd.financial_year_id = mfy.id
            WHERE 
                fbpd.isDeleted = false 
                AND mfy.isDeleted = false
                ${entity_id ? `AND fbpd.entity_id = ${entity_id}` : ''}
                ${filter_fy ? `AND fbpd.filter_fy = ${filter_fy}` : ''}
            ORDER BY 
                mfy.financial_year ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery);

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: data });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.getById_budgetPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const sqlQuery = `
            SELECT 
                fbpd.id, 
                fbpd.start_date, 
                fbpd.end_date, 
                fbpd.status, 
                fbpd.isDeleted, 
                fbpd.createdAt, 
                fbpd.updatedAt, 
                fbpd.financial_year_id,
                mfy.financial_year
            FROM 
                FINANCE_BUDGET_PLAN_DATE fbpd
            JOIN 
                MASTER_FINANCIAL_YEAR mfy
            ON 
                fbpd.financial_year_id = mfy.id
            WHERE 
                fbpd.isDeleted = false 
                AND mfy.isDeleted = false
                AND fbpd.id = :id
            ORDER BY 
                mfy.financial_year ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery, {
            replacements: { id: id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: data });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.update_budgetPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { end_date } = req.body;
        const isExist = await db.budgetPlanDate.findOne({ where: { id: id, isDeleted: false } });

        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Record Not Found!" });
        }

        const isExistDate = await db.budgetPlanDate.findOne({
            where: {
                end_date: end_date,
                isDeleted: false,
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if (isExistDate) {
            return res.status(400).send({ code: 400, message: "Date Already Exists!" });
        }

        const response = await db.budgetPlanDateHistory.create({
            extend_date: isExist.end_date,
            budgetPlanDate_id: isExist.id
        });

        function convertToIST(utcDateString) {
            return new Date(new Date(utcDateString).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
        }
        
        let endDate  = convertToIST(end_date);


        let updateDate = await db.budgetPlanDate.update({ end_date: endDate }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Budget Plan Date Updated Successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.delete_budgetPlan = async (req, res) => {
    try {
        const { id } = req.params;

        let isExist = await db.budgetPlanDate.findOne({ where: { id: id } })
        if (isExist) {
            if (isExist.isDeleted == true) {
                return res.status(400).send({ code: 400, message: "Budget Plan already deleted" })
            }

            await db.budgetPlanDateHistory.update({ isDeleted: true }, { where: { budgetPlanDate_id: id } })
            let saveUpdate = await db.budgetPlanDate.update({ isDeleted: true }, { where: { id: id } })

            return res.status(200).send({ code: 200, message: "Deleted Successfully", data: saveUpdate });
        }

        return res.status(404).send({ code: 404, message: "Budget Plan Id not found", data: isExist });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAll_ExtendDate_With_budgetPlan = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = parseInt(entity_id);

        const { id } = req.params;

        const sqlQueryHistory = `
            SELECT 
                fbph.id,
                fbph.status,
                fbph.isDeleted,
                fbph.budgetPlanDate_id,
                fbp.start_date,
                fbp.end_date,
                fbph.extend_date,
                mfyr.financial_year AS financial_year
            FROM 
                FINANCE_BUDGET_PLAN_DATE_HISTORY fbph
            LEFT JOIN
                FINANCE_BUDGET_PLAN_DATE fbp ON fbph.budgetPlanDate_id = fbp.id
            LEFT JOIN
                MASTER_FINANCIAL_YEAR mfyr ON fbp.financial_year_id = mfyr.id
            WHERE 
                fbph.isDeleted = false
                AND (fbph.budgetPlanDate_id = :id OR fbph.isDeleted = false)
        `;

        const queryParams = { id: id };

        if (!isNaN(entity_id)) {
            sqlQueryHistory += ' AND fbp.entity_id = :entity_id';
            queryParams.entity_id = entity_id;
        }

        sqlQueryHistory += ' ORDER BY fbph.createdAt ASC;';

        const historyData = await db.sequelize.query(sqlQueryHistory, {
            replacements: queryParams,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (historyData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: historyData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: historyData });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};



