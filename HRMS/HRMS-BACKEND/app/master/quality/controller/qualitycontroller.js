const db = require("../../../models/index");

const qualityDetails = db.quality_master;
const quality__parameter_Details = db.quality_parameter
const workStation = db.workStation
const product = db.product_master
const qualityParameter = db.quality_parameter

exports.create_quality = async (req, res) => {
    try {
        const { work_station_id, product_master_id, product_variant_name, quality_parameter_detail } = req.body;
        var quality_parameter = quality_parameter_detail ? quality_parameter_detail : null;

        const quality = await qualityDetails.findOne({
            where: {
                // [db.Sequelize.Op.or]: [
                //     { work_station_id },
                //     { product_master_id },
                //     { product_variant_name }
                // ]
                work_station_id,product_master_id, product_variant_name, isDeleted: false
            }
        })
        if (quality) {
            return res.status(403).send({ code: 403, message: "WorkStation, Product, Variant  Already Exists" })
        } else if (!quality) {
            const response = await qualityDetails.create({
                work_station_id,
                product_master_id,
                product_variant_name,
            });

            let qualityPromises = [];
            qualityPromises = Array.isArray(quality_parameter) ? quality_parameter.map(async (data) => {
                const quality_parameter_detail = {
                    "quality_parameter": data.quality_parameter,
                    "value": data.value,
                    "quality_master_id": response.id
                };
                return quality__parameter_Details.create(quality_parameter_detail);
            }) : [];
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: response });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAllQuality = async (req, res) => {
    try {
        serviceData = await qualityDetails.findAll({
            where: {
                isDeleted: false
            },
            include: [
                {
                    model: product,
                },
                {
                    model: workStation,
                },
                {
                    model: qualityParameter,
                    where: { isDeleted: false }
                },
            ],
            order: [['id', 'DESC']],
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get All Quality data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Quality found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.getQualityById = async (req, res) => {
    try {
        const id = req.params.id;
        serviceData = await qualityDetails.findOne({
            where: {
                id: id,
                status: "Active",
                isDeleted: false
            },
            include: [
                {
                    model: product,
                },
                {
                    model: workStation,
                },
                {
                    model: qualityParameter,
                    where: { isDeleted: false }
                }
            ],
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get Quality data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Quality found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.update_quality = async (req, res) => {
    try {
        const Quality_id = parseInt(req.params.id)
        const { work_station_id, product_master_id, product_variant_name, quality_parameter_detail } = req.body;
        var quality_parameter = quality_parameter_detail ? quality_parameter_detail : null;

        const getAllData = await qualityDetails.findOne({
            include: [
                {
                    model: qualityParameter
                }
            ],
            where: { id: Quality_id }
        });
        if (getAllData) {


            const qualitys = await qualityDetails.findAll({
                where: {
                    work_station_id,product_master_id, product_variant_name, isDeleted: false
                }
            })
            let flag = false;
            qualitys.map((quality)=> {
                if (quality.id != Quality_id) flag = true
            })
            if (flag) {
                return res.status(403).send({ code: 403, message: "WorkStation, Product, Variant  Already Exists" })
            }
            const updateData = await db.quality_master.update({
                work_station_id,
                product_master_id,
                product_variant_name,
            },
                {
                    where: { id: Quality_id }
                });
            if (updateData) {
                await qualityParameter.destroy({ where: { quality_master_id: Quality_id } });

                for (let i = 0; i < quality_parameter.length; i++) {
                    response = await qualityParameter.create({
                        quality_master_id: Quality_id,
                        quality_parameter: quality_parameter[i].quality_parameter,
                        value: quality_parameter[i].value
                    });
                }

                const updatedQualityWithQualityParameter = await qualityDetails.findOne({
                    include: [{
                        model: qualityParameter
                    }],
                    where: { id: Quality_id },
                });

                return res.status(200).send({
                    code: 200,
                    message: "Quality updated successfully",
                    data: updatedQualityWithQualityParameter
                });
            }else{
                return res.status(500).send({ code: 500, message: "Internal Server Error" })
            }
        } else {
            return res.status(404).send({ code: 403, message: "Data not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.deleteQualityMaster = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await qualityDetails.findOne({ where: { id: id } });
        if (getAllData) {
            await qualityDetails.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Quality is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "Data not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
}

exports.updateQualityStatus = async (req, res) => {
    try {
        const Quality_id = req.params.id;
        const { status } = req.body;
        const editData = await qualityDetails.findOne({ where: { id: Quality_id } });
        if (editData) {
            const updateData = await qualityDetails.update(
                {
                    status
                }, { where: { id: Quality_id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully" });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}