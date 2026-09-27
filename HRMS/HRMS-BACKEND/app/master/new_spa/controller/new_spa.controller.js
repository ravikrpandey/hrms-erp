const db = require("../../../models/index");

const new_spaDetails = db.new_spa
const Op = db.Sequelize.Op;
const segmentDetails = db.segment
const certificate_typeDetails = db.new_certificate_type
const product_masterDetails = db.product_master
/////////////// Create new_spa ///////////////

exports.create_new_spa = async (req, res) => {
    try {
        const { segment_id,certificate_type_id,product_master_id } = req.body;
        if (segment_id && certificate_type_id){ 
            const data = await new_spaDetails.findOne({where: {product_master_id: product_master_id}})
        if(data){
            return res.status(400).send({code: 400, message:"new_spa_name is Already Exists!"})
        } else{
            const response = await new_spaDetails.create({
                segment_id,
                certificate_type_id,
                product_master_id,
            });
            return res.status(200).send({ code: 200, message: "new_spa Created Successfully!", data: response });
        }
        } else {
            return res.status(204).send({code: 204, message:"segment_id and certificate_type_id is Required!"})
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit new_spa ///////////////

exports.edit_new_spa = async (req, res) => {
    try {
        const new_spaId = req.params.id;
        const { segment_id, certificate_type_id, product_master_id, status, isChecked } = req.body;
        const editData = await new_spaDetails.findOne({ where: { new_spa_id: new_spaId } });
        if (editData) {
            const updateData = await new_spaDetails.update({
                segment_id,
                certificate_type_id,
                product_master_id,
                status,
                isChecked
            },
                { where: { new_spa_id: new_spaId } });

            return res.status(200).send({ code: 200, message: "new_spa Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};            

// /////////////// Get ById new_spa ///////////////

exports.getAll_new_spa = async (req, res) => {
    try {
        const getAllData = await new_spaDetails.findAll({ 
            where: {},
            include: [
            {
                model: segmentDetails,
                attributes: ['segment_id', 'segment_name'],
                where: {},
            },
            {
                model: certificate_typeDetails,
                attributes: ['certificate_type_id', 'certificate_type_name'],
                where: {},
            },
            {
                model: product_masterDetails,
                attributes: ['product_master_id', 'product_master_name'],
                where: {},
            },
        ]
        });

        if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {          
                var segmentName = getAllData[i].segment.segment_name;
                var certificateType = getAllData[i].new_certificate_type.certificate_type_name;
                var product_masterType = getAllData[i].product_master.product_master_name;
                var obj = {
                    "new_spa_id": getAllData[i].new_spa_id,
                    "status": getAllData[i].status,
                    "isChecked":getAllData[i].isChecked,
                    "segment_id": getAllData[i].segment_id,
                    "certificate_type_id":getAllData[i].certificate_type_id,
                    "product_master_id": getAllData[i].product_master_id,
                    "segment_name": segmentName,
                    "certificate_type_name": certificateType,
                    "product_master_name": product_masterType,

                }
                array.push(obj);
            }
            return res.status(200).send({ code: 200, message: "Fetch All new_spa Data Successfully", data: array });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById new_spa ///////////////

exports.get_ById_new_spa = async (req, res) => {
    try {
        const new_spaId = req.params.id;
        const getData = await new_spaDetails.findOne({
             where: { new_spa_id: new_spaId , status: "ACTIVE"},
             include: [
                {
                    model: segmentDetails,
                    where: {},
                },
                {
                    model: certificate_typeDetails,
                    where: {},
                },
                {
                    model: product_masterDetails,
                    where: {},
                },
            ]
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

/////////////// Delete new_spa ///////////////

exports.delete_new_spa = async (req, res) => {
    try {
        const new_spaId = req.params.id;
        const getData = await new_spaDetails.findOne({ where: { new_spa_id: new_spaId } });
        if (getData) {
            const updated = await new_spaDetails.update({ status: "INACTIVE" }, { where: { new_spa_id: new_spaId } });
            return res.status(200).send({ code: 200, message: "new_spa Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.get_BysegmentId_new_spa = async (req, res) => {
    try {
        const segmentId = req.params.id;
        const getData = await segmentDetails.findOne({
             where: { segment_id: segmentId , status: "ACTIVE"},
             include: [{
                model: new_spaDetails,
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

exports.get_Bycertificate_typeId_new_spa = async (req, res) => {
    try {
        const certificate_typeId = req.params.id;
        const getAllData = await new_spaDetails.findAll({
             where: { certificate_type_id: certificate_typeId , status: "ACTIVE"},
             include: [
                    {
                        model: segmentDetails,
                        where: {},
                    },
                    {
                        model: certificate_typeDetails,
                        where: {},
                    },
                    {
                        model: product_masterDetails,
                        where: {},
                    },
                
        ],
         });
         if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {          
                var segmentName = getAllData[0].segment.segment_name;
                var certificateType = getAllData[0].new_certificate_type.certificate_type_name;
                var product_masterType = getAllData[i].product_master.product_master_name;
                let obj;

                if(getAllData[i].new_spa){
                    obj = {
                        "new_spa_id": getAllData[i].new_spa_id,
                        "status": getAllData[i].status,
                        "isChecked":getAllData[i].isChecked,
                        "product_master_id": getAllData[i].product_master_id,
                        "product_master_name": product_masterType,
                    }
                    array.push(obj);
                }else{
                    obj = {
                        "status": getAllData[i].status,
                        "isChecked":getAllData[i].isChecked,
                        "product_master_id": getAllData[i].product_master_id,
                        "product_master_name": product_masterType,
                    }
                    array.push(obj);
                }
            }

            let mainarr=[]

            let newOb;
            if(newOb){
                newOb={
                    "segment_id": getAllData[0].segment_id,
                    "certificate_type_id":getAllData[0].certificate_type_id,
                    "segment_name": segmentName,
                    "certificate_type_name": certificateType,
                    "newitemlist": array
                }
            }else{
                newOb={
                    "segment_name": segmentName,
                    "certificate_type_name": certificateType,
                    "newitemlist": array
                }
            }

            mainarr.push(newOb)

            return res.status(200).send({ code: 200, message: "Fetch All new_spa Data Successfully", data: mainarr });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};