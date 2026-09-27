const db = require("../../../models/index");
const logger = require('../../../../logger/index');
//======= createShift =====================//

exports.createShift = async (req, res) => {
    try {
        const {
            shift_name, start_time, end_time, shift_duration, grace_period, financial_year_id, entity_id
        } = req.body;
        if (!shift_name || !start_time || !end_time || !shift_duration) {
            return res.status(400).send({ code: 400, message: "Body is required" });
        } else {
            const response = await db.shift.create({
                shift_name,
                shift_time: start_time + " to " + end_time,
                shift_duration: shift_duration,
                grace_period: grace_period,
                financial_year_id,
                entity_id
            });
            return res.status(200).send({ code: 200, message: "Shift Created Successfully!", data: response });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
}

//========== getAllShift ==============//

exports.getAllShift = async (req, res) => {
    try {
        const getData = await db.shift.findAll({ where: { isDeleted: false } });
        return res.status(200).send({ code: 200, message: "Shift fetched succesfully", data: getData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
}

//============== getAllShiftbyId ==============//

exports.getAllShiftbyId = async (req, res) => {
    try {
        const { id } = req.params;
        let getAllData;
        if (id) {
            getAllData = await db.shift.findOne({ where: { id: id, isDeleted: false } });

            if (!getAllData) {
                return res.status(404).send({ code: 404, message: "Shift not found for the provided ID", });
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
        logger.error(`Error ${error.message}`, { error });
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
        const {
            shift_name, start_time, end_time, shift_duration, grace_period, financial_year_id, entity_id
        } = req.body;

        if (!shift_name || !start_time || !end_time || !shift_duration) {
            return res.status(400).send({ code: 400, message: "Body is required" });
        } else {
            const getAllData = await db.shift.findOne({ where: { id: id, isDeleted: false } });

            if (getAllData) {
                await db.shift.update({
                    shift_name,
                    shift_time: start_time + " to " + end_time,
                    shift_duration: shift_duration,
                    grace_period: grace_period,
                    financial_year_id,
                    entity_id
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
        logger.error(`Error ${error.message}`, { error });
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
        logger.error(`Error ${error.message}`, { error });
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
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.createAllotShift = async (req, res) => {
    try {
        const { shift_id, employee_id } = req.body;
        if (shift_id) {
            await db.shiftAllocate.update(
                { status: 'INACTIVE' },
                {
                    where: { employee_id: employee_id }
                });
        }
        const shiftAllocations = await db.shiftAllocate.bulkCreate(
            employee_id.map(employee_id => ({
                shift_id: shift_id,
                employee_id: employee_id,
            }))
        );
        if (shiftAllocations) {
            return res.status(201).send({
                code: 201,
                message: "Shift allocated successfully",
            });
        }
        else {
            return res.status(502).send({
                code: 502,
                message: "Something Went Wrong !",
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};

exports.getShiftAllotedEmployee = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const userDetails = `SELECT ms.shift_name, ms.shift_time, ms.shift_duration, u.first_name, u.last_name, u.employee_official_email,u.employee_id FROM MASTER_SHIFT AS ms LEFT JOIN ALLOCATE_SHIFT AS als ON als.shift_id = ms.id LEFT JOIN HRMS_REGISTERED_USER AS u ON u.employee_id = als.employee_id WHERE als.status = 'ACTIVE'`;

        get_employee_Data = await db.sequelize.query(userDetails, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        return res.status(200).send({ code: 200, message: "Shift fetched succesfully", data: get_employee_Data });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
}

exports.getEmployeeShiftLog = async (req, res) => {
    try {
        const { employee_id } = req.params;
        const userDetails = `SELECT ms.shift_name, ms.shift_time, ms.shift_duration, u.first_name, u.last_name, u.employee_official_email,u.employee_id FROM MASTER_SHIFT AS ms LEFT JOIN ALLOCATE_SHIFT AS als ON als.shift_id = ms.id LEFT JOIN HRMS_REGISTERED_USER AS u ON u.employee_id = als.employee_id WHERE als.employee_id = ${employee_id}`;

        get_employee_Data = await db.sequelize.query(userDetails, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        return res.status(200).send({ code: 200, message: "Shift fetched succesfully", data: get_employee_Data });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
}




