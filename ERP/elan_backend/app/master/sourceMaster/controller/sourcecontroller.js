const db = require("../../../models/index");
const logger = require('../../../../logger/index');

exports.getAllSource = async (req, res) => {
    try {
        const {entity_id,financial_year_id} = req.params;
        const getData = await db.sourceMaster.findAll({
            where: {
                isDeleted: false,entity_id
            }
        });
        return res.status(200).send({ code: 200, message: "Source fetched succesfully", data: getData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
}

