const db = require("../../../models/index");

const logger = require('../../../../logger/index');

exports.levelType = async (req, res) => {
    try {
        let { entity_id } = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;
        const priceData = await db.level_master.findAll({
            where: {
                isDeleted: false,
                entity_id: entity_id,
                status: 'ACTIVE'
            },
            order: [['id', 'ASC']],
        });

        if (priceData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Level data successfully", data: priceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error fetching area data: ", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};