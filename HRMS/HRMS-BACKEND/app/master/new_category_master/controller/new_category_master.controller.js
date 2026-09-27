const db = require("../../../models/index");

const new_category_masterDetails = db.new_category_master
const Op = db.Sequelize.Op;
const segmentDetails = db.segment
/////////////// Create new_category_master ///////////////

exports.create_new_category_master = async (req, res) => {
    try {
        const { segment_id,new_category_master_name } = req.body;
        const data = await new_category_masterDetails.findOne({where: {new_category_master_name: new_category_master_name}})
        if(data){
            return res.status(400).send({code: 400, message:"new_category_master_name is Already Exists!"})
        } else{
        const response = await new_category_masterDetails.create({
            segment_id,
            new_category_master_name,
        });
        return res.status(200).send({ code: 200, message: "new_category_master Created Successfully!", data: response });
    }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit new_category_master ///////////////

exports.edit_new_category_master = async (req, res) => {
    try {
        const new_category_masterId = req.params.id;
        const { segment_id,new_category_master_name, status, isChecked } = req.body;
        const editData = await new_category_masterDetails.findOne({ where: { new_category_master_id: new_category_masterId } });
        if (editData) {
            const updateData = await new_category_masterDetails.update({
                segment_id,
                new_category_master_name,
                status,
                isChecked
            },
                { where: { new_category_master_id: new_category_masterId } });

            return res.status(200).send({ code: 200, message: "new_category_master Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};            

// /////////////// Get ById new_category_master ///////////////

exports.getAll_new_category_master = async (req, res) => {
    try {
        const getAllData = await new_category_masterDetails.findAll({ 
            where: {},
            include: [{
                model: segmentDetails,
            }],
        });

        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All new_category_master Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById new_category_master ///////////////

exports.get_ById_new_category_master = async (req, res) => {
    try {
        const new_category_masterId = req.params.id;
        const getData = await new_category_masterDetails.findOne({
             where: { new_category_master_id: new_category_masterId , status: "ACTIVE"},
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

/////////////// Delete new_category_master ///////////////

exports.delete_new_category_master = async (req, res) => {
    try {
        const new_category_masterId = req.params.id;
        const getData = await new_category_masterDetails.findOne({ where: { new_category_master_id: new_category_masterId } });
        if (getData) {
            const updated = await new_category_masterDetails.update({ status: "INACTIVE" }, { where: { new_category_master_id: new_category_masterId } });
            return res.status(200).send({ code: 200, message: "new_category_master Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.get_BysegmentId_new_category_master = async (req, res) => {
    try {
        const segmentId = req.params.id;
        const getData = await segmentDetails.findOne({
             where: { segment_id: segmentId , status: "ACTIVE"},
             include: [{
                model: new_category_masterDetails,
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