const db = require('../../../../models/index');
const pincodeDetails = db.pincode;
const cityDetails = db.city;
const logger = require('../../../../../logger/index');
exports.createpincode = async (req, res) => {
    try {
        const { pincode_name, city_id } = req.body;
        const pincodeData = await pincodeDetails.findOne({ where: { pincode_name: pincode_name } });   
        if (pincodeData) {
            return res.status(403).send({ code: 403, message: "Pincode Name  is Already Exists!" });
        }            
        
        const response = await pincodeDetails.create({
            pincode_name, city_id
            });
            return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllpincode = async (req, res) => {
    try {

        const getAllData = await pincodeDetails.findAll({
            where: { status: "ACTIVE" },
            include: [{
                model: cityDetails,
                attributes: ["city_name", "city_id"]
            }]
        });
        if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {
                var getName = getAllData[i].city.city_name;

                var obj = {
                    "pincode_id": getAllData[i].pincode_id,
                    "pincode_name": getAllData[i].pincode_name,
                    "city_id": getAllData[i].city_id,
                    "status": getAllData[i].status,
                    "city_name": getName
                }
                array.push(obj);
            }
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: array });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getByIdpincode = async (req, res) => {
    try {
        const pincodeID = parseInt(req.params.pincode_id);
        const getAllData = await pincodeDetails.findAll({
            where: {  pincode_id: pincodeID , status: "ACTIVE"},
            include: [{
                model: cityDetails,
                attributes: ["city_name", "city_id"]
            }]
        });
        if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {
                var getName = getAllData[i].city.city_name;

                var obj = {
                    "pincode_id": getAllData[i].pincode_id,
                    "pincode_name": getAllData[i].pincode_name,
                    "city_id": getAllData[i].city_id,
                    "status": getAllData[i].status,
                    "city_name": getName
                }
                array.push(obj);
            }
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: array });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.editpincode = async (req, res) => {
    try {
        const pincode_Id = parseInt(req.params.pincode_id);
        const { pincode_name, city_id, status} = req.body;
        const getData = await pincodeDetails.findOne({ where: { pincode_name: pincode_name} });   
        if ( getData) {
            return res.status(403).send({ code: 403, message: "pincode Name is Already Exists!" });
        }           
        const response = await pincodeDetails.update({
                pincode_name,
                city_id,
                status
            } , { where: { pincode_id: pincode_Id } });
            return res.status(200).send({ code: 200, message: "pincode Updated Successfully", data: response })
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.deletepincode = async (req, res) => {
    try {
        const pincodeId = parseInt(req.params.pincode_id);
        const dltpincode = await pincodeDetails.findOne({ where: { pincode_id: pincodeId } });
        if (dltpincode) {
            const deleteData = await pincodeDetails.update({ status: "INACTIVE" }, { where: { pincode_id: pincodeId } });
            return res.status(200).send({ code: 200, message: "pincode Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

// get pincode on the basis of city id

exports.getpincodebycityid = async (req, res) => {
    try {
        const cityid = req.params.id;
        const getAllData = await pincodeDetails.findAll({
            where: {  city_id: cityid , status: "ACTIVE"},
            include: [{
                model: cityDetails,
                attributes: ["city_name", "city_id"]
            }]
        });
        if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {
                var getName = getAllData[i].city.city_name;
                
                var obj = {
                    "pincode_id": getAllData[i].pincode_id,
                    "pincode_name": getAllData[i].pincode_name,
                    "city_id": getAllData[i].city_id,
                    "status": getAllData[i].status,
                    "city_name": getName
                }
                array.push(obj);
            }
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: array });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};