const db = require("../../../models/index");

const traning_nameDetails = db.traning_name
const Op = db.Sequelize.Op;
const logger = require('../../../../logger/index');
/////////////// Create traning_name ///////////////

exports.create_traning_name = async (req, res) => {
    try {
        const { traning_name } = req.body;
        const data = await traning_nameDetails.findOne({where: {traning_name: traning_name}})
        if(data){
            return res.status(400).send({code: 400, message:"traning_name is Already Exists!"})
        } else{
        const response = await traning_nameDetails.create({
            traning_name,
        
        });
        return res.status(200).send({ code: 200, message: "traning_name Created Successfully!", data: response });
    }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit traning_name ///////////////

exports.edit_traning_name = async (req, res) => {
    try {
        const traning_nameId = req.params.id;
        const { traning_name, status, isChecked } = req.body;
        const editData = await traning_nameDetails.findOne({ where: { traning_name_id: traning_nameId } });
        if (editData) {
            const updateData = await traning_nameDetails.update({
                traning_name,
                status,
                isChecked
            },
                { where: { traning_name_id: traning_nameId } });

            return res.status(200).send({ code: 200, message: "traning_name Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};            

// /////////////// Get ById traning_name ///////////////

exports.getAll_traning_name = async (req, res) => {
    try {
        const getAllData = await traning_nameDetails.findAll()
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All traning_name Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById traning_name ///////////////

exports.get_ById_traning_name = async (req, res) => {
    try {
        const traning_nameId = req.params.id;
        const getData = await traning_nameDetails.findOne({ where: { traning_name_id: traning_nameId } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch Get ById Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete traning_name ///////////////

exports.delete_traning_name = async (req, res) => {
    try {
        const traning_nameId = req.params.id;
        const getData = await traning_nameDetails.findOne({ where: { traning_name_id: traning_nameId } });
        if (getData) {
            const updated = await traning_nameDetails.update({ status: "INACTIVE" }, { where: { traning_name_id: traning_nameId } });
            return res.status(200).send({ code: 200, message: "traning_name Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};