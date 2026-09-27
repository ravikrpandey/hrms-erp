const { SequelizeScopeError } = require("sequelize");
const db = require("../../../models/index");
const uom_details = db.uom;
const logger = require('../../../../logger/index');
/////////Create UOM /////////////////

exports.create_uom = async (req, res) => {
    try {
        const { uom_name, uom_description } = req.body;
        const uomdata = await uom_details.findOne({ where: { uom_name: uom_name,isDeleted: false } });
        if (uomdata) {
            return res.status(201).send({ code: 201, message: "UOM Name is Already Exists!" });
        }
        const uomAlldata = await uom_details.create({
            uom_name, uom_description
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: uomAlldata });
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.getAllUOM = async (req, res) => {
    try {
        const getAllData = await uom_details.findAll({ order: [['uom_id', 'DESC']], where: { isDeleted: false }, })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All UOM Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.getAllActiveUOM = async (req, res) => {
    try {
        const getAllData = await uom_details.findAll({ order: [['uom_id', 'DESC']], where: { isDeleted: false , status : "ACTIVE" }, })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All UOM Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.getByIdUOM = async (req, res) => {
    try {
        const uom_Id = req.params.id
        const getAllData = await uom_details.findOne({ where: { uom_id: uom_Id, isDeleted: false } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch UOM Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

// exports.edituom = async (req, res) => {
//     try {
//         const uom_ID = parseInt(req.params.id);
//         const { uom_name } = req.body;
//         const uomdata = await uom_details.findOne({ where: { uom_id: uom_ID } });
//         if (uomdata) {
//             const uom_namee = await uom_details.findAll({ where: { uom_name: uom_name,isDeleted: false } });
//             // if (uom_namee[0]) {
//             //     return res.status(409).send({ code: 409, message: "UOM Name is Already Exists!" });
//             // } else {
//                 await uom_details.update(req.body, { where: { uom_id: uom_ID } });
//                 return res.status(200).send({ code: 200, message: "Data is Updated Successfully!", });
//             // }
//         } else {
//             return res.status(403).send({ code: 403, message: "Record Not Found" });
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     }
// }

exports.edituom = async (req, res) => {
    try {
        const uom_ID = parseInt(req.params.id);
        const { uom_name } = req.body;

      
        const uomdata = await uom_details.findOne({ where: { uom_id: uom_ID } });
        if (!uomdata) {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }

        const existingUOM = await uom_details.findOne({ 
            where: { 
                uom_name: uom_name,
                isDeleted: false,
                uom_id: { [db.Sequelize.Op.ne]: uom_ID } 
            } 
        });
        
        if (existingUOM) {
            return res.status(409).send({ code: 409, message: "UOM Name is Already Exists!" });
        }

       
        await uom_details.update(req.body, { where: { uom_id: uom_ID } });
        return res.status(200).send({ code: 200, message: "Data is Updated Successfully!" });

    } catch (error) {
        console.error(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}


exports.deleteUOM = async (req, res) => {
    try {
        const uom_ID = parseInt(req.params.id);
        const uomData = await uom_details.findOne({ where: { uom_id: uom_ID } });
        if (uomData) {
            await uom_details.update({ isDeleted: true }, { where: { uom_id: uom_ID } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}
exports.UOMStatus = async (req, res) => {
    try {
        const uom_ID = req.params.id;
        const { status } = req.body;

        // Check if status property exists in the request body
        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }

        console.log(status);
        const getData = await uom_details.findOne({
            where: {
                uom_id: uom_ID,
                isDeleted: false,
            },
        });
        if (getData) {
            await uom_details.update(
                {
                    status,
                },
                {
                    where: {
                        uom_id: uom_ID,
                    },
                }
            );
            return res.status(200).send({
                code: 200,
                message: "uom details Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

