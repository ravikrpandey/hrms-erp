const db = require("../../../models/index");

const new_regionDetails = db.new_region
const Op = db.Sequelize.Op;
const segmentDetails = db.segment
/////////////// Create new_region ///////////////

exports.create_new_region = async (req, res) => {
    try {
        const { segment_id,new_region_name,certificate_type,certificate_type_name } = req.body;
        const data = await new_regionDetails.findOne({where: {new_region_name: new_region_name, segment_id: segment_id,certificate_type:certificate_type }})
        if(data){
            return res.status(400).send({code: 400, message:"new_region_name is Already Exists!"})
        } else{
        const response = await new_regionDetails.create({
            segment_id,
            new_region_name,
            certificate_type,
            certificate_type_name
        });
        return res.status(200).send({ code: 200, message: "new_region Created Successfully!", data: response });
    }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit new_region ///////////////

exports.edit_new_region = async (req, res) => {
    try {
        const new_regionId = parseInt(req.params.id);
        const { segment_id,new_region_name,certificate_type, status, isChecked } = req.body;
        const editData = await new_regionDetails.findOne({ where: { new_region_id: new_regionId } });
        if (editData) {
            const updateData = await new_regionDetails.update({
                segment_id,
                new_region_name,
                certificate_type,
                status,
                isChecked
            },
                { where: { new_region_id: new_regionId } });

            return res.status(200).send({ code: 200, message: "new_region Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};            

// /////////////// Get ById new_region ///////////////

exports.getAll_new_region = async (req, res) => {
    try {
        const getAllData = await new_regionDetails.findAll({ 
            // where: {segment_id:segment_id,certificate_type:certificate_type},
            include: [{
                model: segmentDetails,
            }],
        });

        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All new_region Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
// getAll_new_regionfilterdata
exports.getAll_new_regionfilterdata = async (req, res) => {
    try {
        const {segment_id , certificate_type} = req.body
        const getAllData = await new_regionDetails.findAll({ 
            where: {segment_id:segment_id,certificate_type:certificate_type},
            include: [{
                model: segmentDetails,
            }],
        });

        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All new_region Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById new_region ///////////////

exports.get_ById_new_region = async (req, res) => {
    try {
        const new_regionId = req.params.id;
        const getData = await new_regionDetails.findOne({
             where: { new_region_id: new_regionId , status: "ACTIVE"},
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

/////////////// Delete new_region ///////////////

exports.delete_new_region = async (req, res) => {
    try {
        const new_regionId = req.params.id;
        const getData = await new_regionDetails.findOne({ where: { new_region_id: new_regionId } });
        if (getData) {
            const updated = await new_regionDetails.update({ status: "INACTIVE" }, { where: { new_region_id: new_regionId } });
            return res.status(200).send({ code: 200, message: "new_region Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.get_BysegmentId_new_region = async (req, res) => {
    try {
        const segmentId = req.params.id;
        const getData = await segmentDetails.findOne({
             where: { segment_id: segmentId , status: "ACTIVE"},
             include: [{
                model: new_regionDetails,
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

exports.getAll_new_noduplicate_region = async (req, res) => {
    try {
   

    let AllData = await new_regionDetails.sequelize.query(
      `SELECT DISTINCT new_region_name  FROM new_regions`, {
      type: new_regionDetails.sequelize.QueryTypes.SELECT
    })
        return res.status(200).send({ code: 200, message: "Fetch All new_region Data Successfully", data: AllData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};