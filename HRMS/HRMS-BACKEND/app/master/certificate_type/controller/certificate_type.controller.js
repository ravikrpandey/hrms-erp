const db = require("../../../models/index");

const certificate_typeDetails = db.new_certificate_type
const Op = db.Sequelize.Op;
const segmentDetails = db.segment
/////////////// Create certificate_type ///////////////

exports.create_certificate_type = async (req, res) => {
    try {
        const { segment_id,certificate_type_name } = req.body;
        const data = await certificate_typeDetails.findOne({where: {certificate_type_name: certificate_type_name}});  
        if(data){
                return res.status(400).send({code: 400, message:"certificate_type is Already Exists!"})
    }else{
        const response = await certificate_typeDetails.create({
            segment_id,
            certificate_type_name,
        });
        return res.status(200).send({ code: 200, message: "certificate_type Created Successfully!", data: response });
    }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit certificate_type ///////////////

exports.edit_certificate_type = async (req, res) => {
    try {
        const certificate_typeId = req.params.id;
        const { segment_id,certificate_type_name, status, isChecked } = req.body;

        const data = await certificate_typeDetails.findOne({where: {certificate_type_name: certificate_type_name}});  
        if(data){
            return res.status(400).send({code: 400, message:"certificate_type is Already Exists!"})
        }

        const editData = await certificate_typeDetails.findOne({ where: { certificate_type_id: certificate_typeId } });
        if (editData) {
            const updateData = await certificate_typeDetails.update({
                segment_id,
                certificate_type_name,
                status,
                isChecked
            },
                { where: { certificate_type_id: certificate_typeId } });

            return res.status(200).send({ code: 200, message: "certificate_type Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};            

// /////////////// Get ById certificate_type ///////////////

exports.getAll_certificate_type = async (req, res) => {
    try {
        const getAllData = await certificate_typeDetails.findAll({ 
            where: {},
            include: [{
                model: segmentDetails,
            }],
        });

        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All certificate_type Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById certificate_type ///////////////

exports.get_ById_certificate_type = async (req, res) => {
    try {
        const certificate_typeId = req.params.id;
        const getData = await certificate_typeDetails.findOne({
             where: { certificate_type_id: certificate_typeId , status: "ACTIVE"},
             include: [{
                model: segmentDetails,
            }],
         });
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

/////////////// Delete certificate_type ///////////////

exports.delete_certificate_type = async (req, res) => {
    try {
        const certificate_typeId = req.params.id;
        const getData = await certificate_typeDetails.findOne({ where: { certificate_type_id: certificate_typeId } });
        if (getData) {
            const updated = await certificate_typeDetails.update({ status: "INACTIVE" }, { where: { certificate_type_id: certificate_typeId } });
            return res.status(200).send({ code: 200, message: "certificate_type Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.get_BysegmentId_certificate_type = async (req, res) => {
    try {
        const segmentId = req.params.id;
        const getData = await segmentDetails.findOne({
             where: { segment_id: segmentId , status: "ACTIVE"},
             include: [{
                model: certificate_typeDetails,
            }],
         });
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