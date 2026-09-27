const { SequelizeScopeError } = require("sequelize");
const db = require("../../../models/index");
const checklist_details = db.checklist ;
const logger = require('../../../../logger/index');
/////////Create UOM /////////////////

exports.create_checklist = async (req, res) => {
    try {
        const { checklist_name } = req.body;
        
        // Check if the checklist already exists
        const checklistdata = await checklist_details.findOne({ where: { checklist_name: checklist_name, isDeleted: false } });
        if (checklistdata) {
            // Use 409 for conflict when the checklist already exists
            return res.status(409).send({ code: 409, message: "Checklist Name Already Exists!" });
        }

        // If checklist doesn't exist, create a new checklist
        const checklistAlldata = await checklist_details.create({ checklist_name });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: checklistAlldata });
        
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.getAllCHECKLIST = async (req, res) => {
    try {
        const getAllData = await checklist_details.findAll({ order: [['id']], where: { isDeleted: false }, })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All CHECKLIST Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.getAllActiveCHECKLIST = async (req, res) => {
    try {
        const getAllData = await checklist_details.findAll({ order: [['id']], where: { isDeleted: false , status : "ACTIVE" }, })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All CHECKLIST Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

exports.getByIdCHECKLIST = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await checklist_details.findOne({ where: { id: id, isDeleted: false } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch CHECKLIST Data Successfully", data: getAllData });
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

exports.editchecklist = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { checklist_name } = req.body;

      
        const checklistdata = await checklist_details.findOne({ where: { id: id } });
        if (!checklistdata) {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }

        const existingCHECKLIST = await checklist_details.findOne({ 
            where: { 
                checklist_name: checklist_name,
                isDeleted: false,
                id: { [db.Sequelize.Op.ne]: id } 
            } 
        });
        
        if (existingCHECKLIST) {
            return res.status(409).send({ code: 409, message: "CHECKLIST Name is Already Exists!" });
        }

       
        await checklist_details.update(req.body, { where: { id: id } });
        return res.status(200).send({ code: 200, message: "Data is Updated Successfully!" });

    } catch (error) {
        console.error(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}


exports.deleteCHECKLIST = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checklistData = await checklist_details.findOne({ where: { id: id } });
        if (checklistData) {
            await checklist_details.update({ isDeleted: true }, { where: { id: id } });
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
exports.CHECKLISTStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        // Check if status property exists in the request body
        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }

        console.log(status);
        const getData = await checklist_details.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await checklist_details.update(
                {
                    status,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).send({
                code: 200,
                message: "checklist details Status Change Successfully!",
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

