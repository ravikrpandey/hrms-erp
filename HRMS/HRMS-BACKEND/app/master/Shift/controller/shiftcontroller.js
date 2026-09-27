const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../../models/index");
//======= createShift =====================//

exports.createShift = async (req, res) => {
    try {
        const {
            shift_name, start_time, end_time, shift_duration, grace_peroid, grace_day, financial_year_id, entity_id
        } = req.body;

        if (!shift_name || !start_time || !end_time || !shift_duration) {
            return res.status(400).send({ code: 400, message: "Body is required" });
        }

        const existingShift = await db.shift.findOne({
            where: {
                shift_name: shift_name, entity_id,
                isDeleted: { [db.Sequelize.Op.ne]: true }
            }

        });

        if (existingShift) {
            return res.status(403).send({ code: 500, message: "Shift name already exists" });
        }

        const response = await db.shift.create({
            shift_name,
            shift_time: start_time + " to " + end_time,
            shift_duration,
            grace_peroid,
            financial_year_id,
            entity_id,
            grace_day,
        });

        return res.status(200).send({ code: 200, message: "Shift Created Successfully!", data: response });

    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllShift = async (req, res) => {
    const { entity_id } = req.params;

    try {
        const getData = await db.sequelize.query(
            `SELECT MS.*, EM.entity_name
             FROM MASTER_SHIFT AS MS
             INNER JOIN ENTITY_MASTER AS EM ON EM.id = MS.entity_id
             WHERE MS.isDeleted = false AND MS.entity_id = :entity_id`,
            {
                replacements: { entity_id },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            code: 200,
            message: "Shifts fetched successfully",
            data: Array.isArray(getData) ? getData : []
        });

    } catch (error) {
        console.error("Error fetching shifts:", error);
        return res.status(500).json({
            code: 500, message: error.message || "Server Error"
        });
    }
};

//============== getAllShiftbyId ==============//

exports.getAllShiftbyId = async (req, res) => {
    try {
        const { id } = req.params;
        let getAllData;

        if (id) {
            getAllData = await db.shift.findOne({ where: { id: id, isDeleted: false } });

            if (!getAllData) {
                return res.status(404).send({
                    code: 404,
                    message: "Shift not found for the provided ID",
                });
            }
        } else {
            getAllData = await db.shift.findAll({ where: { isDeleted: false }, order: [['id', 'DESC']] });

            if (getAllData.length === 0) {
                return res.status(404).send({
                    code: 404,
                    message: "No shift data found",
                });
            }
        }

        return res.status(200).send({
            code: 200,
            message: "Get shift data successfully",
            data: getAllData,
        });
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({
            code: 500,
            message: "Internal Server Error",
        });
    }
};

//=============== updateShift ==============//

exports.updateShift = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send({ code: 400, message: "ID is required for update" });
        }

        const { shift_name, start_time, end_time, shift_duration, grace_peroid, grace_day, financial_year_id, entity_id } = req.body;
        if (!shift_name || !start_time || !end_time || !shift_duration) {
            return res.status(400).send({ code: 400, message: "Body is required" });
        } else {
            const getAllData = await db.shift.findOne({ where: { id: id } });

            if (getAllData) {
                await db.shift.update({
                    shift_name, shift_time: start_time + " to " + end_time, shift_duration,status:"ACTIVE", grace_peroid,  grace_day,financial_year_id, entity_id
                },
                    {
                        where: { id: id }
                    });

                return res.status(200).send({
                    code: 200,
                    message: "Shift updated successfully!",
                });
            } else {
                return res.status(404).send({ code: 404, message: "ID not found" });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

//========== updateShiftStatus ==============//

exports.updateShiftStatus = async (req, res) => {
    try {
        const { id, status } = req.params;

        const Data = await db.shift.findOne({
            where: {
                id: id
            }
        })
        if (Data) {
            const updateData = await db.shift.update({
                status: status
            },
                {
                    where: {
                        id: id
                    }
                })
            return res.status(200).send({ code: 200, message: "shift staus updated succesfully", data: updateData })
        } else {
            return res.status(404).send({ code: 404, message: "ID not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

//=============== deleteShift ================//

exports.deleteShift = async (req, res) => {
    try {
        const id = req.params.id
        // if(!id){
        const getAllData = await db.shift.findOne({ where: { id: id } });
        if (getAllData) {
            await db.shift.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "shift is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

exports.shiftStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }
        const getData = await db.shift.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            await db.shift.update(
                {
                    status
                },
                {
                    where: {
                        id: id
                    }
                }
            );
            return res.status(200).send({
                code: 200,
                message: "Shift Status Change Successfully!",
                // data: updated
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



