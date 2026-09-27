const db = require("../../../models/index");
const Sequelize = require("sequelize");
const ServiceMaster = db.Service_master;
const Service_Category = db.ServicesCategory;


exports.createServiceMaster = async (req, res) => {
    try {
        const { service_category_id, service_name, service_description, MVP } = req.body;

        const service_code = btoa(Math.random()).slice(0, 10).toUpperCase();

        let image = '';
        if (req.file && req.file['filename'] && req.file['filename'].length > 0) {
            image = req.file.path;
        }
        else {
            image = '';
        }
        const service = await ServiceMaster.findOne({
            where: {
                service_name,service_category_id,isDeleted:false
            }
        });
        if (service) {
            return res.status(403).send({ code: 403, message: "Service Already Exists" });
        } else if (!service) {
            const service_image = image.replace(/\\/g, '/');
            const createData = await ServiceMaster.create({
                service_category_id, service_code, service_name, service_description, MVP,
                service_document: service_image
            });
            return res.status(200).send({ code: 200, message: "Service Created Successfully", data: createData });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" })
    }
}

exports.getAllServices = async (req, res) => {
    try {
        serviceData = await ServiceMaster.findAll({
            where: {
                isDeleted: false
            },
            include: [
                {
                    model: Service_Category,
                }
            ],
            order: [['service_id', 'DESC']],
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get All Service data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.getServicesById = async (req, res) => {
    try {
        const ids = req.params.id;
        serviceData = await ServiceMaster.findAll({
            where: {
                service_id: ids,
                status: "Active",
                isDeleted: false
            },
            include: [
                {
                    model: Service_Category,
                    where: { status: "Active" }
                }
            ]
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get Service data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.update_services = async (req, res) => {
    try {
        const id = req.params.id
        if (id) {
            const { service_category_id, service_name, service_description, MVP } = req.body;
            let image = '';
            console.log(req.files)
            if (req.file && req.file['filename'] && req.file['filename'].length > 0) {
                image = req.file.path;
            }
            else {
                image = '';
            }
            const getAllData = await ServiceMaster.findOne({ where: { service_id: id } });
            if (getAllData) {
                const service_image = image.replace(/\\/g, '/');
                const updateData = await ServiceMaster.update({
                    service_category_id, service_name, service_description, MVP, service_document: service_image
                },
                    {
                        where: { service_id: id }
                    });
                return res.status(200).send({
                    code: 200, message: "Service updated Successfully!",
                    data: updateData
                });
            } else {
                return res.status(404).send({ code: 403, message: "Data not found" });
            };
        } else {
            return res.status(404).send({ code: 403, message: "ID not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.deleteServices = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await ServiceMaster.findOne({ where: { service_id: id } });
        if (getAllData) {
            await ServiceMaster.update({ isDeleted: true }, { where: { service_id: id } });
            return res.status(200).send({ code: 200, message: "Service is Deleted Successfully!", });
        } else {
            return res.status(404).send({ code: 403, message: "Data not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

exports.updateServiceStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const editData = await ServiceMaster.findOne({ where: { service_id: id } });
        if (editData) {
            const updateData = await ServiceMaster.update(
                {
                    status
                }, { where: { service_id: id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}