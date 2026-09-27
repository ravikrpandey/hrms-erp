const db = require("../../../models/index");

const segmentDetails = db.segment
const Op = db.Sequelize.Op;

/////////////// Create segment ///////////////

exports.create_segment = async (req, res) => {
    try {
        const { segment_name } = req.body;
        const data = await segmentDetails.findOne({where: {segment_name: segment_name}})
        if(data){
            return res.status(400).send({code: 400, message:"segment_name is Already Exists!"})
        } else{
        const response = await segmentDetails.create({
            segment_name,
        
        });
        return res.status(200).send({ code: 200, message: "segment Created Successfully!", data: response });
    }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit segment ///////////////

exports.edit_segment = async (req, res) => {
    try {
        const segmentId = req.params.id;
        const { segment_name, status, isChecked } = req.body;
        const editData = await segmentDetails.findOne({ where: { segment_id: segmentId } });
        if (editData) {
            const updateData = await segmentDetails.update({
                segment_name,
                status,
                isChecked
            },
                { where: { segment_id: segmentId } });

            return res.status(200).send({ code: 200, message: "segment Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};            

// /////////////// Get ById segment ///////////////

exports.getAll_segment = async (req, res) => {
    try {
        const getAllData = await segmentDetails.findAll()
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All segment Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById segment ///////////////

exports.get_ById_segment = async (req, res) => {
    try {
        const segmentId = req.params.id;
        const getData = await segmentDetails.findOne({ where: { segment_id: segmentId } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch Get ById Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete segment ///////////////

exports.delete_segment = async (req, res) => {
    try {
        const segmentId = req.params.id;
        const getData = await segmentDetails.findOne({ where: { segment_id: segmentId } });
        if (getData) {
            const updated = await segmentDetails.update({ status: "INACTIVE" }, { where: { segment_id: segmentId } });
            return res.status(200).send({ code: 200, message: "segment Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};