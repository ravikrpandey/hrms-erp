
const { where } = require("sequelize");
const db = require("../../../models/index");
const Department = db.department;
const logger = require('../../../../logger/index');
exports.create_region = async (req, res) => {
    try {

        const { region_name, region_code } = req.body;

        const isExist = await db.regionMaster.findOne({ where: { region_name: region_name, isDeleted: false, status: 'ACTIVE' } });
        if (isExist) {
            return res.status(201).send({ code: 201, message: "Region Already Exists!" });
        }

        const isExistCode = await db.regionMaster.findOne({ where: { region_code: region_code, isDeleted: false, status: 'ACTIVE' } });
        if (isExistCode) {
            return res.status(201).send({ code: 201, message: "Region Already Exists!" });
        }
        const response = await db.regionMaster.create({
            region_name, region_code,
        });
        return res.status(200).send({ code: 200, message: "Region Created Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAll_Active_Region = async (req, res) => {
    try {
        let sqlQuery = `
            SELECT * 
            FROM MASTER_REGION 
            WHERE isDeleted = false 
              AND status = 'ACTIVE'
            ORDER BY region_name ASC;
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




exports.getAll_Region = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT * 
            FROM MASTER_REGION 
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
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.getById_Region = async (req, res) => {
    try {
        const { id } = req.params;
        const sqlQuery = `
            SELECT * 
            FROM MASTER_REGION 
            WHERE isDeleted = false 
              AND id = :id
            ORDER BY region_name ASC;
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

exports.update_region = async (req, res) => {
    try {
        const { id } = req.params;
        const { region_name, region_code, status } = req.body;


        const existingRegion = await db.regionMaster.findOne({ where: { id: id, isDeleted: false } });
        if (!existingRegion) {
            return res.status(404).send({ code: 404, message: "Region not found!" });
        }
        if (region_name && region_code) {
            const duplicateRegion = await db.regionMaster.findOne({
                where: {
                    [db.Sequelize.Op.or]: [
                        { region_name: region_name },
                        // { region_code: region_code }
                    ],
                    isDeleted: false,
                    status: 'ACTIVE'
                    // id: { [db.Sequelize.Op.ne]: id }
                }
            });
            if (duplicateRegion) {
                return res.status(201).send({ code: 201, message: "Region Already Exists!" });
            }

            const duplicateRegionCode = await db.regionMaster.findOne({
                where: {
                    [db.Sequelize.Op.or]: [
                        // { region_name: region_name },
                        { region_code: region_code }
                    ],
                    isDeleted: false,
                    status: 'ACTIVE'
                    // id: { [db.Sequelize.Op.ne]: id }
                }
            });
            if (duplicateRegionCode) {
                return res.status(201).send({ code: 201, message: "Region Already Exists!" });
            }
        }
        await db.regionMaster.update({
            region_name: region_name,
            region_code: region_code,
            status: status
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.delete_Region = async (req, res) => {
    try {
        const { id } = req.params;

        let isExist = await db.regionMaster.findOne({ where: { id: id } })
        if (isExist) {
            if (isExist.isDeleted == true) {
                return res.status(400).send({ code: 400, message: "Region already deleted" })
            }

            let saveUpdate = await db.regionMaster.update({ isDeleted: true }, { where: { id: id } })

            return res.status(200).send({ code: 200, message: "Deleted Successfully", data: saveUpdate });
        }

        return res.status(404).send({ code: 404, message: "Region Id not found", data: isExist });

    } catch (error) {
        console.error(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};