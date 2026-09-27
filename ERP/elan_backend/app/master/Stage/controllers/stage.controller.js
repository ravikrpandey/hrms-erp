const db = require("../../../models/index");
const stageDetails = db.stage
const Op = db.Sequelize.Op;
const logger = require('../../../../logger/index');
/////////////// Create Stage ///////////////

exports.createStage = async (req, res) => {
    try {
        const { stage_name } = req.body;
        const response = await stageDetails.create({
            stage_name
        });
        return res.status(200).send({ code: 200, message: "Stage Created Successfully!", data: response });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit Stage ///////////////

exports.editStage = async (req, res) => {
    try {
        const stageId = req.params.id;
        const editData = await stageDetails.findOne({ where: { stage_id: stageId } });
        if (editData) {
            const updateData = await stageDetails.update(req.body, { where: { stage_id: stageId } });
            return res.status(200).send({ code: 200, message: "Stage Updated SuccessFully", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById Stage ///////////////

exports.getStageById = async (req, res) => {
    try {
        const stageId = req.params.id;
        const getData = await stageDetails.findOne({
            where: { stage_id: stageId, status: "ACTIVE" }
        });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get All Stage ///////////////

exports.getAllStage = async (req, res) => {
    try {
        const getAllData = await stageDetails.findAll({ where: { status: "ACTIVE" }})
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Stage Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete Stage ///////////////

exports.deleteStage = async (req, res) => {
    try {
        const stageId = req.params.id;
        const getData = await stageDetails.findOne({ where: { stage_id: stageId } });
        if (getData) {
            const updated = await stageDetails.update({ status: "INACTIVE" }, { where: { stage_id: stageId } });
            return res.status(200).send({ code: 200, message: "Stage Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 403, message: "Record Note Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};