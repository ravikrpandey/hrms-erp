const db = require("../../../models/index");
const path = require('path');
const workStation = require("../model/workStation");
exports.create_workStation = async (req, res) => {
    try {
        const { type_of_workstation, name_of_workstation, running_cost_per_hour, hourly_effciency, description, uom_id, UploadDoc } = req.body;
        // if(!uom_id){
        //     return res.status(403).send({ code: 403, message: "please Uom id is required!" });
        // }    
        const workstations = await db.uomdetails.findOne({ where: { uom_id: parseInt(uom_id) } });
        if (!workstations) {
            return res.status(403).send({ code: 403, message: "Uom id not found!" });
        }
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
        }
        const workstation = await db.workStation.findOne({ where: { name_of_workstation: name_of_workstation, isDeleted : false } });
        if (workstation) {
            return res.status(403).send({ code: 403, message: "WorkStation is Already Exists!" });
        }
        const createData = await db.workStation.create({
            type_of_workstation, name_of_workstation, running_cost_per_hour, hourly_effciency,  description, uom_id
        });
        const createdWorkstation = [];
        for (let i = 0; i < images.length; i++) {
            const formattedUploadDoc = images[i].replace(/\\/g, '/');
            const response = await db.UploadDoc.create({
                UploadDoc: formattedUploadDoc,
                work_station_id: createData.id
            });
            createdWorkstation.push(response);
        }
        return res.status(200).send({ code: 200, message: "WorkStation Created Successfully!" });

    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};
exports.getAllWorkstation = async (req, res) => {
    try {
        const { id } = req.params;
        let getAllData;
        if (id) {
            getAllData = await db.workStation.findOne({
                include: [

                    {
                        model: db.uomdetails,
                        attributes: ["uom_name"],
                    },
                    {
                        model: db.UploadDoc,
                        attributes: ["UploadDoc"],
                    }
                ],
                where: { id: id, isDeleted: false }, 
               
            });
            return res.status(200).send({
                code: 200,
                message: `Get workStation Data for id ${id} Successfully`,
                data: getAllData,
            });
        } else {
            getAllData = await db.workStation.findAll({
               
                include: [
                    {
                        model: db.UploadDoc,
                        attributes: ["UploadDoc"],
                    }
                ],
                where: { isDeleted: false },
                order: [['id', 'DESC']],
            });
            return res.status(200).send({
                code: 200,
                message: "Get all workStation Data Successfully",
                data: getAllData,
            });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({
            code: 500,
            message: "Internal Server Error",
        });
    }
};

exports.getAllActiveWorkstation = async (req, res) => {
    try {
        const { id } = req.params;
        let getAllData;
        getAllData = await db.workStation.findAll({
            
            include: [
                {
                    model: db.UploadDoc,
                    attributes: ["UploadDoc"],
                }
            ],
            where: { isDeleted: false , status : "ACTIVE"},
            order: [['id', 'DESC']],
        });
        return res.status(200).send({
            code: 200,
            message: "Get all workStation Data Successfully",
            data: getAllData,
        });
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({
            code: 500,
            message: "Internal Server Error",
        });
    }
};
exports.update_workStation = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const { type_of_workstation, name_of_workstation, running_cost_per_hour,hourly_effciency, description, uom_id, uploadedImages } = req.body;
            let prev_images = JSON.parse(uploadedImages);
            let images = [];
            if (req.files && req.files.length > 0) {
                images = req.files.map(file => file.path);
            }
            prev_images.map((item)=>{
                images.push(item.UploadDoc);
            })
            const existingWorkstation = await db.workStation.findOne({ where: { id: id, status: "ACTIVE" } });
            const duplicateWorkstations = await db.workStation.findAll({ where: { name_of_workstation : name_of_workstation , isDeleted : false } });
            let flag = false;
            if ( duplicateWorkstations ){
                duplicateWorkstations.map((workStation)=> {
                    if ( workStation.id != id ) flag = true;
                })
            }
            if ( flag ) {
                return res.status(201).send({
                    code: 201,
                    message: "WorkStation Name Already Exists!",
                });
            }
            if (existingWorkstation) {
                await existingWorkstation.update({
                    type_of_workstation, name_of_workstation, running_cost_per_hour, hourly_effciency, description, uom_id
                });
                await db.UploadDoc.destroy({ where: { work_station_id: id } });
                const createdWorkstation = [];
                for (let i = 0; i < images.length; i++) {
                    const formattedUploadDoc = images[i].replace(/\\/g, '/');
                    const response = await db.UploadDoc.create({
                        UploadDoc: formattedUploadDoc,
                        work_station_id: id
                    });
                    createdWorkstation.push(response);
                }
                return res.status(200).send({
                    code: 200,
                    message: "WorkStation updated successfully!",
                    createdWorkstation
                });
            } else {
                return res.status(404).send({ code: 404, message: "WorkStation not found" });
            }
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.delete_workStation = async (req, res) => {
    try {
        const id = req.params.id
        // if(!id){
        const getAllData = await db.workStation.findOne({ where: { id: id } });
        if (getAllData) {
            await db.workStation.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "workStation is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};
exports.workStationStatus = async (req, res) => {
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
        const getData = await db.workStation.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await db.workStation.update(
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
                message: "work Station Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};







