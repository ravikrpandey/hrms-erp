
const { where } = require("sequelize");
const db = require("../../../models/index");
const Department = db.department;
const logger = require('../../../../logger/index');

exports.create_salesReason = async (req, res) => {
    try {

        const { sales_reason, type, descriptions } = req.body;

        const isExist = await db.salesReason.findOne({ where: { sales_reason: sales_reason, isDeleted: false, status: 'ACTIVE' } });
        if (isExist) {
            return res.status(201).send({ code: 201, message: "Reason Already Exists!" });
        }

        const response = await db.salesReason.create({
            sales_reason, type, descriptions
        });
        return res.status(200).send({ code: 200, message: "Reason Created Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAll_Active_salesReason = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_SALES_REASON 
            WHERE isDeleted = false 
              AND status = 'ACTIVE'
            ORDER BY sales_reason ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery);

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data });
        }
    } catch (error) {
        console.error(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getAll_salesReason = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT * 
            FROM MASTER_SALES_REASON 
            WHERE isDeleted = false 
            ORDER BY id DESC;
        `;

        const [data] = await db.sequelize.query(sqlQuery);

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data });
        }
    } catch (error) {
        console.error(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message||"Server Error" });
    }
};


exports.getById_salesReason = async (req, res) => {
    try {
        const { id } = req.params;
        const sqlQuery = `
            SELECT * 
            FROM MASTER_SALES_REASON 
            WHERE isDeleted = false 
              AND id = :id
            ORDER BY sales_reason ASC;
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
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.update_salesReason = async (req, res) => {
    try {
        const { id } = req.params;
        const { sales_reason, status,  type, descriptions } = req.body;


        const isExistSalesReason = await db.salesReason.findOne({ where: { id: id, isDeleted: false } });
        if (!isExistSalesReason) {
            return res.status(404).send({ code: 404, message: "Region not found!" });
        }
        if (sales_reason ) {
            const duplicateSalesReason = await db.salesReason.findOne({
                where: {
                    [db.Sequelize.Op.or]: [
                        { sales_reason ,  type, descriptions},
                      
                    ],
                    isDeleted: false,
                    status: 'ACTIVE'
                   
                }
            });
            if (duplicateSalesReason) {
                return res.status(201).send({ code: 201, message: "Region Already Exists!" });
            }
        }
           
        await db.regionMaster.update({
            sales_reason,
             type, descriptions,
            status: status
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.delete_salesReason = async (req, res) => {
    try {
        const { id } = req.params;

        let isExist = await db.salesReason.findOne({ where: { id: id } })
        if (isExist) {
            if (isExist.isDeleted == true) {
                return res.status(400).send({ code: 400, message: "Reason  already deleted" })
            }

            let saveUpdate = await db.salesReason.update({ isDeleted: true }, { where: { id: id } })

            return res.status(200).send({ code: 200, message: "Deleted Successfully", data: saveUpdate });
        }

        return res.status(404).send({ code: 404, message: "Reason Id not found", data: isExist });

    } catch (error) {
        console.error(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};