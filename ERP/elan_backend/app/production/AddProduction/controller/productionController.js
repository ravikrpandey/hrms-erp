const { forEach } = require("mathjs");
const db = require("../../../models");
const path = require('path');
const moment = require('moment');
const { Op, sequelize, fn, col } = require('sequelize');
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const model = require("../../../master/Currency_Convert/models/model");
const qualityDetails = db.quality_master;
const qualityParameter = db.quality_parameter

exports.createProduction = async (req, res) => {
    try {
        const {
            product_id,
            product_category_id,
            employee_id,
            total_qty,
            image_upload,
            entity_id,
            financial_year_id,
            plantListDetails,
        } = req.body;

        let formattedUploadDoc = req.file ? req.file.path.replace(/\\/g, '/') : (image_upload ? image_upload.replace(/\\/g, '/') : '');

        let createproducts;
        const productExists = await db.production.findOne({
            where: { product_id, product_category_id, isDeleted: false }
        });

        // if (productExists) {
        //     return res.status(403).send({ code: 403, message: "Production Already exist" });

        // }
        // else {
            createproducts = await db.production.create({
                product_id,
                product_category_id,
                employee_id,
                total_qty,
                entity_id,
            financial_year_id,
                image_upload: formattedUploadDoc,
            });
        // }

        const shiftlistr = [];
        const workstationListr = [];

        if (plantListDetails && Array.isArray(plantListDetails)) {
            const plantPromises = plantListDetails.map(async (plant) => {
                const gy = generateRandomDigits(7);
                const plant_order = 'PON';
                const prod_order_no = plant_order + gy;

                const plantExists = await db.productionMapping.findOne({
                    where: { production_id: createproducts.id, plant_id: plant.plantID, isDeleted: false }
                });

                let response;

                if (plantExists) {
                    response = await db.productionMapping.update({
                        production_qty: plant.production_qty,
                        start_date: plant.start_date,
                        end_date: plant.end_date,
                        production_manager_id: plant.production_manager_id,
                    }, { where: { production_id: createproducts.id, plant_id: plant.plantID, isDeleted: false } });

                    if (response) {
                        response = await db.productionMapping.findOne({
                            where: { production_id: createproducts.id, plant_id: plant.plantID, isDeleted: false }
                        });
                    }
                } else {
                    response = await db.productionMapping.create({
                        production_id: createproducts.id,
                        production_order_no: prod_order_no,
                        plant_id: plant.plantID,
                        production_qty: plant.production_qty,
                        start_date: plant.start_date,
                        end_date: plant.end_date,
                        production_manager_id: plant.production_manager_id,
                    });
                }

                if (response) {
                    await db.productionMappingshift.update({
                        isDeleted: true,
                        status: 'INACTIVE'
                    }, { where: { production_id: createproducts.id, plant_id: plant.plantID, production_mapping_id: response.id } });

                    for (let shiftId of plant.shiftList) {
                        const reshift = await db.productionMappingshift.create({
                            production_id: createproducts.id,
                            plant_id: plant.plantID,
                            production_mapping_id: response.id,
                            shift_id: shiftId
                        });
                        shiftlistr.push(reshift);
                    }
                }

                if (response) {
                    await db.productionWorkStation.update({
                        isDeleted: true,
                        status: 'INACTIVE'
                    }, { where: { production_id: createproducts.id, plant_id: plant.plantID, production_mapping_id: response.id } });

                    for (let workstation of plant.workstationList) {
                        const resworkstation = await db.productionWorkStation.create({
                            production_id: createproducts.id,
                            workstation_id: workstation.workstation_id,
                            workstation_type: workstation.workstation_type,
                            running_cost: workstation.running_cost,
                            description: workstation.description,
                            plant_id: plant.plantID,
                            production_mapping_id: response.id,
                        });
                        workstationListr.push(resworkstation);
                    }
                }

                return response;
            });

            await Promise.all(plantPromises);
        }

        if (createproducts) {
            return res.status(201).send({ code: 201, message: "Production Created Successfully", data: createproducts, shiftlistr, workstationListr });
        } else {
            return res.status(404).send({ code: 404, message: "Production not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.createPlant = async (req, res) => {
    try {
        const { production_id, plantId, production_qty, start_date,
            end_date, production_manager_id, shiftList, workstationList,
        } = req.body;
        const gy = generateRandomDigits(7);
        const plant_order = 'PON';
        const prod_order_no = plant_order + gy;
        let response;
        const plantExists = await db.productionMapping.findOne({
            where: { production_id, plant_id: plantId, isDeleted: false }
        });
        if (plantExists) {
            const response1 = await db.productionMapping.update({
                production_id: production_id,
                plant_id: plantId,
                production_qty: production_qty,
                start_date: start_date,
                end_date: end_date,
                production_manager_id: production_manager_id,
            }, { where: { production_id, plant_id: plantId, isDeleted: false } });
            if (response1) {
                response = await db.productionMapping.findOne({
                    where: { production_id, plant_id: plantId, isDeleted: false }
                });
            }
        } else {
            response = await db.productionMapping.create({
                production_id: production_id,
                production_order_no: prod_order_no,
                plant_id: plantId,
                production_qty: production_qty,
                start_date: start_date,
                end_date: end_date,
                production_manager_id: production_manager_id,
            });
        }
        const shiftlistr = [];
        if (response) {
            const deleteshift = await db.productionMappingshift.update({
                isDeleted: true,
                status: 'INACTIVE'
            }, {
                where: { production_id, plant_id: plantId, production_mapping_id: response.id }
            });
            for (let i = 0; i < shiftList.length; i++) {
                reshift = await db.productionMappingshift.create({
                    production_id: production_id,
                    plant_id: plantId,
                    production_mapping_id: response.id,
                    shift_id: shiftList[i]
                });
                shiftlistr.push(reshift);
            }
        }
        let resworkstation;
        const workstationListr = [];
        if (response) {
            for (let i = 0; i < workstationList.length; i++) {
                resworkstation = await db.productionWorkStation.create({
                    production_id: production_id,
                    workstation_id: workstationList[i].workstation_id,
                    workstation_type: workstationList[i].workstation_type,
                    running_cost: workstationList[i].running_cost,
                    description: workstationList[i].description,
                    plant_id: plantId,
                    production_mapping_id: response.id,

                });
                workstationListr.push(resworkstation);
            }
        }
        if (response) {
            return res.status(201).send({ code: 201, message: "Production Created Successfully", data: response, shiftlistr, workstationListr });
        } else {
            return res.status(404).send({ code: 404, message: "Production not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
};

exports.scheduleproductionbyId = async (req, res) => {
    try {
        const production_mapping_id = req.params.production_mapping_id;
        const production = await db.productionMapping.findOne({
            where: { id: production_mapping_id },
            attributes: ["id", "production_order_no", "production_qty", "start_date", "end_date"],
            include: [
                {
                    model: db.production,
                    attributes: ["id", "product_id", "product_category_id"],
                    include: [
                        {
                            model: db.product_master,
                            attributes: ["product_name", "product_code", "product_description"],
                        },
                    ],
                },
            ],
        });

        if (production) {
            const BomData = await db.bom.findAll({
                where: {
                    product_id: production.ADD_PRODUCTION_MST.product_id,
                    product_category_id: production.ADD_PRODUCTION_MST.product_category_id,
                    status: "ACTIVE", isDeleted: false
                },

                include: [
                    {
                        model: db.bomDetails,
                        where: { isDeleted: false },
                        include: [
                            {
                                model: db.ItemMaster,
                                attributes: ["item_name", "item_code", "id"],
                                include: [
                                    { model: db.uom, attributes: ["uom_name"] },
                                ]
                            }
                        ]
                    },

                ],
            });
            return res.status(200).send({ code: 200, message: "Get data successfully", data: production, BomData });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.getAllProductions = async (req, res) => {
    try {
        const productions = await db.production.findAll({
            where: {
                isDeleted: false,
            },
            include: [
                {
                    model: db.product_master,
                    attributes: ["product_name", "product_code",],
                    include: [
                        {
                            model: db.product__variant_master,
                            attributes: ["product_description"]
                        },
                    ]
                },

                {
                    model: db.productionMapping,
                    include: [
                        {
                            model: db.plantmaster,
                            attributes: ["plant_name", "plant_address",],
                            include: [
                                {
                                    model: db.countryss,
                                    attributes: ["countryss_name"],
                                },
                                {
                                    model: db.states,
                                    attributes: ["states_name"],
                                },

                            ]

                        },
                    ],
                },
                {
                    model: db.productionMappingshift,
                    include: [
                        {
                            model: db.shift,
                            attributes: ["shift_name"],
                        }, {
                            model: db.user,
                            attributes: ["first_name", "last_name", "middle_name"],
                        }
                    ],
                    as: 'shiftList'
                },
                {
                    model: db.productionWorkStation,
                    include: [
                        {
                            model: db.workStation,
                        }
                    ], as: 'workstationList'
                },
            ],
            order: [['id', 'DESC']],
        });
        // return res.status(200).send({ code: 200, message: "Get All Productions data successfully", data: productions });

        let total_qtys = 0;
        // productions.forEach((productions) => {
        //     const plantList = productions.PRODUCTION_LIST_MSTs.MASTER_PLANT;
        //     plantList.forEach((plant) => {
        //         total_qtys = total_qtys + plant.production_qty;
        //     });
        //     productions.total_qty = total_qtys;
        // });
        if (productions) {
            return res.status(200).send({ code: 200, message: "Get All Productions data successfully", data: productions });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.get_list_data = async (req, res) => {
    try {
        const productions = await db.production.findAll({
            where: { isDeleted: false },
            attributes: ['id', 'status'],
            include: [
                {
                    model: db.product_master,
                    attributes: ["product_name", "product_code"],
                },
                {
                    model: db.productionMapping,
                    attributes: [
                        'id',
                        'production_order_no',
                        'start_date',
                        'end_date',
                        'status_schedule',
                        'production_qty',
                        'plant_id'
                    ],
                    include: [
                        {
                            model: db.plantmaster,
                            attributes: ["plant_name"],
                        },
                    ],
                    as: 'plantList'
                },
            ],
            order: [['id', 'DESC']],
        });

        if (productions.length > 0) {
            const formattedData = [];

            productions.forEach(production => {
                const plantList = production.plantList || [];
                plantList.forEach(plant => {
                    formattedData.push({
                        endDate: plant.end_date,
                        plantId: plant.dataValues.id,
                        id: production.id,
                        plantName: plant.plant_master.plant_name,
                        product: production.PRODUCT_MASTER.product_code,
                        product_name: production.PRODUCT_MASTER.product_name,
                        productionQty: plant.production_qty,
                        production_id: production.id,
                        production_order_no: plant.production_order_no,
                        startDate: plant.start_date,
                        status: plant.status_schedule,
                    });
                });
            });

            const total_qty = formattedData.reduce((total, item) => total + (item.productionQty || 0), 0);

            return res.status(200).send({
                code: 200,
                message: "Get All Productions data successfully",
                data: formattedData,
                total_qty: total_qty
            });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


exports.getbyID = async (req, res) => {
    try {
        const { id } = req.params;
        const productions = await db.production.findAll({
            where: { id, isDeleted: false, status: "ACTIVE" },
            include: [
                {
                    model: db.product_master,
                    attributes: ["product_name", "product_code",],
                    include: [
                        {
                            model: db.product__variant_master,
                            attributes: ["product_description"]
                        },
                    ]
                },
                {
                    model: db.productionMapping,
                    include: [
                        {
                            model: db.plantmaster,
                            attributes: ["plant_name", "plant_address"],
                            include: [
                                {
                                    model: db.countryss,
                                    attributes: ["countryss_name"],
                                },
                                {
                                    model: db.states,
                                    attributes: ["states_name"],
                                },

                            ]
                        },
                        {
                            model: db.productionMappingshift,
                            include: [
                                {
                                    model: db.shift,
                                    attributes: ["shift_name"],
                                }, {
                                    model: db.user,
                                    attributes: ["first_name", "last_name", "middle_name"],
                                }
                            ],
                            as: 'shiftList'
                        },
                        {
                            model: db.productionWorkStation,
                            include: [
                                {
                                    model: db.workStation,
                                }
                            ], as: 'workstationList'
                        },
                    ],
                    
                },


            ],
            order: [['id', 'DESC']],
        });

        if (productions && productions.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: productions[0] });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.productionsDelete = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await db.production.findOne({ where: { id: id } });
        if (getAllData) {
            await db.production.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "production Data is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

exports.updateProduction = async (req, res) => {
    try {
        const production_id = req.params.id;
        const { total_qty,
            product_id,
            product_variant,
            employee_id,
            plantList,
            shiftList,
            workstationList,
        } = req.body;
        const existingProduction = await db.production.findOne({
            include: [
                {
                    model: db.productionMapping,
                    as: 'plantList'
                },
                {
                    model: db.productionMappingshift,
                    as: 'shiftList'
                },
                {
                    model: db.productionWorkStation,
                    as: 'workstationList'
                },
            ],
            where: { id: production_id }
        });
        let plant_data = JSON?.parse(plantList || '[]') || plantList;
        let shift_data = JSON?.parse(shiftList || '[]') || shiftList;
        let work_data = JSON?.parse(workstationList || '[]') || workstationList;

        let image_upload = '';
        if (req.file) {
            image_upload = req.file.path;
        } else {
            image_upload = "";
        }
        if (existingProduction) {
            const formattedUploadDoc = image_upload.replace(/\\/g, '/');
            const updateProduction = await db.production.update(
                {
                    total_qty, product_id, product_variant, employee_id,
                    image_upload: formattedUploadDoc,
                },
                { where: { id: production_id, status: "ACTIVE" } }
            );

            let response;
            if (updateProduction) {
                await db.productionMapping.destroy({ where: { production_id: production_id } });

                for (let i = 0; i < plant_data.length; i++) {
                    response = await db.productionMapping.create({
                        production_id: production_id,
                        plant_id: plant_data[i].plantId,
                        production_qty: plant_data[i].production_qty,
                        start_date: plant_data[i].start_date,
                        end_date: plant_data[i].end_date,
                        total_shift: plant_data[i].total_shift,
                        production_manager_id: plant_data[i].production_manager_id,
                    });
                }
            }

            if (updateProduction) {
                await db.productionMappingshift.destroy({ where: { production_id: production_id } });

                for (let i = 0; i < shift_data.length; i++) {
                    await db.productionMappingshift.create({
                        production_id: production_id,
                        shift_id: shift_data[i].shift_id,
                        employee_id: shift_data[i].employee_id,
                        plant_id: shift_data[i].plantId
                    });
                }
            }


            if (updateProduction) {
                await db.productionWorkStation.destroy({ where: { production_id: production_id } });
                for (let i = 0; i < work_data.length; i++) {
                    await db.productionWorkStation.create({
                        production_id: production_id,
                        workstation_id: work_data[i].workstation_id,
                        plant_id: work_data[i].plantId
                    });
                }
            }

            return res.status(200).send({
                code: 200,
                message: "Production updated successfully!",
            });
        }
        else {
            return res.status(404).send({
                code: 404,
                message: "Production not updated",
            });
        }
    } catch (error) {
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.productionsVerify = async (req, res) => {
    try {
        const id = req.params.id;
        const { schedule_verify } = req.body;

        if (schedule_verify === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'schedule_verify' property is missing in the request body",
            });
        }
        const getData = await db.production.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await db.production.update(
                {
                    schedule_verify,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).send({
                code: 200,
                message: `production  is ${schedule_verify} has been updated Successfully!`,
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.productionsStatusActive = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }
        const getData = await db.production.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await db.production.update(
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
                message: `production  is ${status} has been updated Successfully!`,
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllRepeat = async (req, res) => {
    try {
        const { employee_id, role ,entity_id,financial_year_id} = req.body;
        const plant_data = await db.user.findOne({
            where: { employee_id: employee_id },
            attributes: ['plant_id'],
        });
        let whereClause = {
            isDeleted: false,
            status: "ACTIVE",
        };
        if (role != "Super Admin") {
            whereClause.plant_id = plant_data.plant_id;
        }
    
        const productions = await db.production.findAll({
            where: { isDeleted: false, status: "ACTIVE",entity_id,financial_year_id },
            attributes: ['product_id'],
            include: [
                {
                    model: db.ItemMaster,
                    attributes: ["item_name","id"],
                },
                {
                    model: db.productionMapping,
                    where: {
                        ...whereClause,
                        // status_schedule: "PENDING"
                    },
                    attributes: [
                        'id',
                        'production_order_no',
                        'start_date',
                        'end_date',
                        'status_schedule',
                        'production_qty',
                        'production_id',
                        'production_manager_id',
                    ],
                    include: [
                        {
                            model: db.plantmaster,
                            attributes: ["plant_name"],
                        }
                    ],
                   
                },
            ],
            order: [['id', 'DESC']],
        });

        // return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: productions });

        // console.log(productions);
        // return
        if (productions && productions.length > 0) {
            const formattedData = productions.map(production => {
                const plantList = production.PRODUCTION_LIST_MSTs.map((plant) => ({
                    id: plant.id,
                    product: production.product_id,
                    production_order_no: plant.production_order_no,
                    product_name: production.MASTER_ITEM.item_name,
                    startDate: plant.start_date,
                    endDate: plant.end_date,
                    status: plant.status_schedule,
                    plantName: plant.MASTER_PLANT.plant_name,
                    productionQty: plant.production_qty,
                    production_id: plant.production_id,
                }));
                return plantList;
            }).flat();
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: formattedData });
        } else {
            return res.status(404).send({ code: 404, message: "Data Not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getAllStartProduction = async (req, res) => {
    try {
        const { employee_id, role ,entity_id,financial_year_id} = req.body;
        const plant_data = await db.user.findOne({
            where: { employee_id: employee_id },
            attributes: ['plant_id'],
        });
        let whereClause = {
            isDeleted: false,
            status: "ACTIVE",
        };
        if (role != "Super Admin") {
            whereClause.plant_id = plant_data.plant_id;
        }
    
        const productions = await db.production.findAll({
            where: { isDeleted: false, status: "ACTIVE",entity_id,financial_year_id },
            attributes: ['product_id'],
            include: [
                {
                    model: db.ItemMaster,
                    attributes: ["item_name","id"],
                },
                {
                    model: db.productionMapping,
                    where: {
                        ...whereClause,
                        status_schedule: "START"
                    },
                    attributes: [
                        'id',
                        'production_order_no',
                        'start_date',
                        'end_date',
                        'status_schedule',
                        'production_qty',
                        'production_id',
                        'production_manager_id',
                    ],
                    include: [
                        {
                            model: db.plantmaster,
                            attributes: ["plant_name"],
                        }
                    ],
                   
                },
            ],
            order: [['id', 'DESC']],
        });

        // return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: productions });

        // console.log(productions);
        // return
        if (productions && productions.length > 0) {
            const formattedData = productions.map(production => {
                const plantList = production.PRODUCTION_LIST_MSTs.map((plant) => ({
                    id: plant.id,
                    product: production.product_id,
                    production_order_no: plant.production_order_no,
                    product_name: production.MASTER_ITEM.item_name,
                    startDate: plant.start_date,
                    endDate: plant.end_date,
                    status: plant.status_schedule,
                    plantName: plant.MASTER_PLANT.plant_name,
                    productionQty: plant.production_qty,
                    production_id: plant.production_id,
                }));
                return plantList;
            }).flat();
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: formattedData });
        } else {
            return res.status(404).send({ code: 404, message: "Data Not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.productionsStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status_schedule } = req.body;

        if (status_schedule === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status_schedule' property is missing in the request body",
            });
        }
        const getData = await db.productionMapping.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await db.productionMapping.update(
                {
                    status_schedule,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).send({
                code: 200,
                message: `production  is ${status_schedule} has been updated Successfully!`,
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

// exports.getRepeatById = async (req, res) => {
//     try {
//         const productionId = req.params.id;
//         const production = await db.productionMapping.findOne({
//             where: { id: productionId },
//             attributes: ["id", 'start_date', 'end_date'],
//             include: [
//                 {
//                     model: db.production,
//                     attributes: ["id","product_id",],
//                     include: [
//                         {
//                         model: db.product_master,
//                         attributes: ["product_name"]
//                     },
//                 ],as: 'plantList',
//             },
//                     {
//                         model: db.productionMappingshift,
//                         attributes: ["shift_id"],
//                         include:
//                         {
//                             model: db.shift,
//                             attributes: ["shift_name"],
//                         },
//                         as: 'shiftList'
//                     },
//                     {
//                         model: db.productionWorkStation,
//                         attributes: ["id", "workstation_id", "net_production", "rework"],
//                         include: [
//                             {
//                                 model: db.workStation,
//                                 attributes: ["name_of_workstation"],
//                             }
//                         ], as: 'workstationList'
//                     },
//                 {
//                     model: db.plantmaster,
//                     attributes: ["plant_name"],
//                 },
//             ],
//         });
//         if (production) {
//             const variant_id = production.plantList.product_variant;
//             const product_varient = await db.product__variant_master.findOne({
//             where: { id: variant_id,status:"ACTIVE" },
//             attributes: ["id","product_variant_code","variant_name","product_description"]
//             });
//             return res.status(200).send({ code: 200, message: "Get data successfully", data: production,product_varient });
//         } else {
//             return res.status(404).send({ code: 404, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// };



exports.getRepeatById = async (req, res) => {
    try {
        const productionId = req.params.id;
        const production = await db.productionMapping.findOne({
            where: { id: productionId },
            attributes: ["id", 'start_date', 'end_date'],
            include: [
                {
                    model: db.production,
                    attributes: ["id", "product_id"],
                    include: [
                        {
                            model: db.product_master,
                            attributes: ["id", "product_name", "product_code", "product_category_id"],
                            include: [
                                {
                                    model:db.product__variant_master,
                                    attributes: ["id", "variant_name", ],
                                },
                                {
                                    model: db.productcategory,
                                    attributes: ["id", "category_name", ],
                                   
                                }
                            ]
                        }
                    ],
                    
                },
                {
                    model: db.productionMappingshift,
                    attributes: ["shift_id"],
                    include: {
                        model: db.shift,
                        attributes: ["shift_name"],
                    },
                    as: 'shiftList'
                },
                {
                    model: db.productionWorkStation,
                    attributes: ["id", "workstation_id", "net_production", "rework"],
                    include: [
                        {
                            model: db.workStation,
                            attributes: ["name_of_workstation"],
                        }
                    ],
                    as: 'workstationList'
                },
                {
                    model: db.plantmaster,
                    attributes: ["plant_name"],
                },
            ],
        });

        if (production) {
            return res.status(200).send({ code: 200, message: "Get data successfully", data: production });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};



exports.updateProductionWorkstation = async (req, res) => {
    try {
        const id = req.params.id;
        let { workstationList, shift_id, date } = req.body;
        if (!id) {
            return res.status(404).send({ code: 404, message: "ID not found" });
        }
        const productionMapping = await db.productionMapping.findOne({ where: { id: id, status: "ACTIVE" } })
        if (!productionMapping) {
            return res.status(404).send({ code: 404, message: "Production tracking ID not found" });
        }
        await Promise.all(workstationList.map(async (item) => {
            const { net_production, rework, new_id } = item;
            return await db.productionWorkStation.update(
                { net_production, rework, shift_id, date },
                { where: { production_id: productionMapping.production_id, id: new_id, status: "ACTIVE" } }
            );
        }));
        return res.status(200).send({
            code: 200,
            message: "Production workstations updated successfully!"
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error"
        });
    }
};

exports.getRepeatByIDquality = async (req, res) => {
    try {
        const productionId = req.params.id;

        const production = await db.productionMapping.findOne({
            where: { id: productionId },
            attributes: ["id", "production_qty",],
            include: [
                {

                    model: db.production,
                    attributes: ["product_id"],
                    include: [
                        {
                            model: db.product_master,
                            attributes: ["id", "product_name", "product_category_id", "product_code"],
                            include: [
                                {
                                    model:db.product__variant_master,
                                    attributes:["id", "variant_name"]
                                }
                            ]
                        },
                    ],
                },

                {
                    model: db.productionMappingshift,
                    attributes: ["shift_id","total_production"],
                    include:
                    {
                        model: db.shift,
                        attributes: ["shift_name"],
                    },
                    as: 'shiftList'
                },
            ],
        }
        );
        if (production) {
            return res.status(200).send({ code: 200, message: "Get data successfully", data: production });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.createSerialNumber = async (req, res) => {
    try {
        const count = await db.productionMapping.count({ where: { status: "ACTIVE" } });
        const newId = count + 1;
        const generatedCode = `SN${String(newId).padStart(4, '0')}`;

        return res.status(201).send({
            code: 201,
            message: "Code generated successfully!",
            data: { SerialNumber: generatedCode }
        });
    }
    catch (error) {
        return res.status(500).send({
            code: 500,
            message: "Server error"
        });

    }
}

exports.createCode = async (req, res) => {
    try {
        const { batch_number, s_number } = req.body;

        if (!batch_number && !s_number) {
            return res.status(400).send({
                code: 400,
                message: "Please select at least one option: batch_number or s_number"
            });
        }

        const id = req.params.id;
        if (!id) {
            return res.status(400).send({
                code: 400,
                message: "ID parameter is missing"
            });
        }

        const existingQuality = await db.productionMapping.findOne({ where: { id: id, status: "ACTIVE" } });

        if (!existingQuality) {
            return res.status(404).send({
                code: 404,
                message: "Quality not found with the given ID"
            });
        }

        let generatedCode;
        if (batch_number) {
            generatedCode = "BN00" + existingQuality.id.toString();
        } else if (s_number) {
            generatedCode = "SN00" + existingQuality.id.toString();
        }

        await db.productionMapping.update({
            batch_number: batch_number ? generatedCode : existingQuality.batch_number,
            s_number: s_number ? generatedCode : existingQuality.s_number
        }, { where: { id: id, status: "ACTIVE" } });

        return res.status(201).send({
            code: 201,
            message: "Code generated successfully!",
            data: { batch_number: batch_number ? generatedCode : existingQuality.batch_number, s_number: s_number ? generatedCode : existingQuality.s_number }
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: "Server error"
        });
    }
};

// exports.updateQuality = async (req, res) => {
//     try {
//         const id = req.params.production_mapping_id;
//         const { date, generate_label } = req.body;

//         if (id) {
//             const existingQuality = await db.productionMappingshift.findOne({
//                 where: { production_mapping_id: id, status: "ACTIVE" },
//             });
//             if (existingQuality) {
//                 const data = await db.productionMappingshift.update({
//                     date, generate_label,
//                 }, { where: {production_mapping_id: id,status: "ACTIVE", } });

//                 return res.status(200).send({
//                     code: 200, message: "Quality updated successfully!", data: data
//                 });

//             } else {
//                 const newData = await db.productionMappingshift.create({
//                     date, generate_label,production_mapping_id: id,
//                 });

//                 return res.status(200).send({
//                     code: 200, message: "New Quality entry created successfully!", data: newData
//                 });
//             }
//         } else {
//             return res.status(404).send({ code: 404, message: "ID not found" });
//         }
//     } catch (error) {

//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Internal Server Error"
//         });
//     }
// };



// exports.updateQuality = async (req, res) => {
//     try {
//         const id = req.params.production_mapping_id;
//         const { date, generate_label, shift_id, quality_passed, ng, total_production } = req.body;

//         if (id) {
//             const existingQuality = await db.productionMappingshift.findOne({
//                 where: { date, production_mapping_id: id, shift_id: shift_id, status: "ACTIVE" },
//             });
//             if (existingQuality) {
//                 const data = await db.productionMappingshift.update({
//                     date, generate_label, quality_passed, ng, total_production
//                 }, { where: { date, production_mapping_id: id, shift_id: shift_id, status: "ACTIVE", } });

//                 return res.status(200).send({
//                     code: 200, message: "Quality updated successfully!", data: data
//                 });

//             } else {
//                 const newData = await db.productionMappingshift.create({
//                     date, generate_label, shift_id, quality_passed, ng, total_production,
//                     production_mapping_id: id,
//                 });

//                 return res.status(200).send({
//                     code: 200, message: "New Quality entry created successfully!", data: newData
//                 });
//             }
//         } else {
//             return res.status(404).send({ code: 404, message: "ID not found" });
//         }
//     } catch (error) {

//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Internal Server Error"
//         });
//     }
// };

exports.updateQuality = async (req, res) => {
    try {
        const id = req.params.production_mapping_id;
        const { date, generate_label, shift_id, quality_passed, ng, total_production, emp_id, quality_id, product_id } = req.body;
        const formattedDate = moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');

        if (id) {
            const existingQuality = await db.productionMappingshift.findOne({
                where: { date: formattedDate, production_mapping_id: id, shift_id: shift_id, status: "ACTIVE" },
            });

            if (existingQuality) {

                const data = await db.productionMappingshift.update({
                    date: formattedDate, generate_label, quality_passed, ng, total_production, product_id, employee_id: emp_id
                }, { where: { date: formattedDate, production_mapping_id: id, shift_id: shift_id, status: "ACTIVE", } });

                //  Generate quality label
                const uniqueSuffixBatch = Math.floor(1000 + Math.random() * 9000);
                const batch_No = `BN-${uniqueSuffixBatch}`;

                // Check if existing label data exists
                const existingLabel = await db.generateLabel.findAll({
                    where: { quality_id: existingQuality.id }
                });



                if (existingLabel.length > 0) { // Data exists in generateLabel table
                    // await db.generateLabel.update({ isDeleted: true },
                    //     { where: { quality_id: existingQuality.id } }
                    // );

                    await db.generateLabel.update({ isDeleted: true },
                        { where: { product_id } }
                    );
                }

                // Generate serial numbers if required
                if (generate_label === 'Sno') {
                    for (let index = 0; index < quality_passed; index++) {
                        const uniqueSuffixSerial = Math.floor(1000 + Math.random() * 9000);
                        const serial_No = `SN-${uniqueSuffixSerial}`;

                        await db.generateLabel.create({
                            label_type: "Sno",
                            batch_no: batch_No,
                            serial_no: serial_No,
                            quality_id: existingQuality.id,
                            product_id,
                            // product_mapping_id: id
                        });
                    }
                } else {

                    await db.generateLabel.create({
                        label_type: "Bno",
                        batch_no: batch_No,
                        quality_id: existingQuality.id,
                        product_id,
                        // product_mapping_id: id
                    });
                }
                //  Generate quality label

                return res.status(200).send({ code: 200, message: "Quality updated successfully!", data: data });

            } else {
                const newData = await db.productionMappingshift.create({
                    date: formattedDate, generate_label, shift_id, quality_passed, ng, total_production, product_id,
                    production_mapping_id: id, employee_id: emp_id
                });


                //  Generate quality label
                const uniqueSuffixBatch = Math.floor(1000 + Math.random() * 9000);
                const batch_No = `BN-${uniqueSuffixBatch}`;

                // Check if existing label data exists
                const existingLabel = await db.generateLabel.findAll({
                    where: { quality_id: newData.id }
                });



                if (existingLabel.length > 0) { // Data exists in generateLabel table
                    // await db.generateLabel.update({ isDeleted: true },
                    //     { where: { quality_id: existingQuality.id } }
                    // );

                    await db.generateLabel.update({ isDeleted: true },
                        { where: { product_id, } }
                    );
                }

                // Generate serial numbers if required
                if (generate_label === 'Sno') {
                    for (let index = 0; index < quality_passed; index++) {
                        const uniqueSuffixSerial = Math.floor(1000 + Math.random() * 9000);
                        const serial_No = `SN-${uniqueSuffixSerial}`;

                        await db.generateLabel.create({
                            label_type: "Sno",
                            batch_no: batch_No,
                            serial_no: serial_No,
                            quality_id: newData.id,
                            product_id,
                            // product_mapping_id: id
                        });
                    }
                } else {

                    await db.generateLabel.create({
                        label_type: "Bno",
                        batch_no: batch_No,
                        quality_id: newData.id,
                        product_id,
                        // product_mapping_id: id
                    });
                }

                return res.status(200).send({
                    code: 200, message: "New Quality entry created successfully!", data: newData
                });
            }
        } else {
            return res.status(404).send({ code: 404, message: "ID not found" });
        }
    } catch (error) {

        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error"
        });
    }
};



exports.GraphGetdata = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(404).send({ code: 404, message: "ID not found" });
        }
        const existingQuality = await db.productionMapping.findAll({
            where: { id: id, status: "ACTIVE" },
            include: [
                {
                    model: db.productionMappingshift,
                    attributes: ["id", "status", "createdAt", "updatedAt", "production_id", "shift_id", "employee_id", "plant_id", "date", "quality_passed", "ng", "total_production", "generate_label", "isDeleted", "production_mapping_id"],
                    include:
                    {
                        model: db.shift,
                        attributes: ["shift_name"],
                    },
                    order: [['id', 'DESC']],
                    as: 'shiftList',
                }
            ],
            order: [['id', 'DESC']],
        });
        if (existingQuality) {
            return res.status(200).send({ code: 200, message: "Get data successfully", data: existingQuality });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.updateplant = async (req, res) => {
    try {
        const { production_id, plant_ids } = req.body;
        const plant_id = plant_ids.join(',');
        const updatedData = await db.sequelize.query(
            `UPDATE PRODUCTION_LIST_MST t
            JOIN (
              SELECT production_id, plant_id
              FROM PRODUCTION_LIST_MST
              WHERE production_id = ${production_id}
                AND plant_id IN (${plant_id})
              GROUP BY production_id, plant_id
              HAVING COUNT(*) = 1
            ) AS filter
            ON t.production_id = filter.production_id AND t.plant_id = filter.plant_id
            SET t.status = 'INACTIVE' ,t.isDeleted = '1'
            WHERE t.production_id = ${production_id}`

        )
        if (updatedData) {
            return res.status(200).send({
                code: 200,
                message: "Production updated successfully!"
            });
        } else {
            return res.status(404).send({ code: 404, message: "Production not updated." });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.graphDataByRepeatId = async (req, res) => {
    try {
        const productionId = req.params.id;
        const production = await db.productionMapping.findOne({
            where: { id: productionId, isDeleted: false },
            attributes: ["id", "start_date", "end_date", "batch_number", "s_number"],
            include: [
                {   
                    model: db.productionMappingshift,
                    where: { date: { [Op.not]: null }, isDeleted: false },
                    attributes: ["id", "date", "quality_passed", "ng", "total_production", "shift_id"],
                    include: [
                        {
                            model: db.shift,
                            attributes: ["id", "shift_name"]
                        }
                    ],
                    as: 'shiftList',
                    required: false
                }
            ]
        });
        
        const prod = await db.productionMappingshift.findAll({
            where: {
                production_mapping_id: productionId,
                date: { [Op.not]: null },
                isDeleted: false
            },
            attributes: ['date',
                [fn('SUM', col('quality_passed')), 'total_quality_passed'],
                [fn('SUM', col('ng')), 'total_ng'],
                [fn('SUM', col('total_production')), 'total_production']
            ],
            group: ['date'],
            raw: true
        });
        if (!production) {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
        const startDate = moment(production.start_date);
        const endDate = moment(production.end_date);
        const daysDiff = endDate.diff(startDate, 'days');
        let Evening_Shift = [];
        let Morning_Shift = [];
        let Night_Shift = [];
        let Evening_Shift1 = { shift_id: 0 };
        let Morning_Shift1 = { shift_id: 0 };
        let Night_Shift1 = { shift_id: 0 };
        let Prod_passed = [];
        for (let i = 0; i <= daysDiff; i++) {
            const currentDate = startDate.clone().add(i, 'days');
            const formattedDate = currentDate.format('DD MMM');
            Night_Shift.push({ date: formattedDate, quality_passed: 0, ng: 0, total_production: 0, shift_name: 0 });
            Morning_Shift.push({ date: formattedDate, quality_passed: 0, ng: 0, total_production: 0, shift_name: 0 });
            Evening_Shift.push({ date: formattedDate, quality_passed: 0, ng: 0, total_production: 0, shift_id: 0 });
            Prod_passed.push({ date: formattedDate, quality_passed: 0, ng: 0, total_production: 0, shift_name: 0 });
        }
        production.shiftList.forEach((shiftdata) => {
            const date1 = moment(shiftdata.date);
            const formattedDate1 = date1.format('DD MMM');
            if (shiftdata.shift.shift_name === 'Morning Shift') {
                const morningShiftItem = Morning_Shift.find(item => item.date === formattedDate1);
                if (morningShiftItem) {
                    morningShiftItem.quality_passed = shiftdata.quality_passed;
                    morningShiftItem.ng = shiftdata.ng;
                    morningShiftItem.total_production = shiftdata.total_production;
                }
                Morning_Shift1.shift_id = shiftdata.shift_id;
            } else if (shiftdata.shift.shift_name === 'Evening Shift') {
                const eveningShiftItem = Evening_Shift.find(item => item.date === formattedDate1);
                if (eveningShiftItem) {
                    eveningShiftItem.quality_passed = shiftdata.quality_passed;
                    eveningShiftItem.ng = shiftdata.ng;
                    eveningShiftItem.total_production = shiftdata.total_production;
                }
                Evening_Shift1.shift_id = shiftdata.shift_id;
            } else if (shiftdata.shift.shift_name === 'Night Shift') {
                const nightShiftItem = Night_Shift.find(item => item.date === formattedDate1);
                if (nightShiftItem) {
                    nightShiftItem.quality_passed = shiftdata.quality_passed;
                    nightShiftItem.ng = shiftdata.ng;
                    nightShiftItem.total_production = shiftdata.total_production;
                }
                Night_Shift1.shift_id = shiftdata.shift_id;
            }
        });
        prod.forEach((sdata) => {
            const date1 = moment(sdata.date);
            const formattedDate2 = date1.format('DD MMM');
            const prod_da = Prod_passed.find(item => item.date === formattedDate2);
            if (prod_da) {
                prod_da.quality_passed = sdata.total_quality_passed;
                prod_da.ng = sdata.total_ng;
                prod_da.total_production = sdata.total_production;
            }
        });

        Morning_Shift.forEach(element => {
            element.shift_name = 'Morning Shift';
        });
        Evening_Shift.forEach(element => {
            element.shift_name = 'Evening Shift';
        });
        Night_Shift.forEach(element => {
            element.shift_name = 'Night Shift';
        });
        Morning_Shift1.morning_shift_data = Morning_Shift;
        Evening_Shift1.evening_shift_data = Evening_Shift;
        Night_Shift1.night_shift_data = Night_Shift;
        const graphdata = {
            prod_total: Prod_passed,
            morning: Morning_Shift1,
            evening: Evening_Shift1,
            night: Night_Shift1
        };
        return res.status(200).send({ code: 200, message: "Get data successfully", data: graphdata });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.schedprodformaintenance = async (req, res) => {
    try {
        const { start_date, start_time, end_date, end_time,
            production_mapping_id, product_id, product_name, workstation_id, shift_id
        } = req.body;

        let response = await db.workstationmaintenance.create({
            start_date, start_time, end_date, end_time, product_name, workstation_id, shift_id, production_mapping_id, product_id
        });

        if (response) {
            return res.status(201).send({ code: 200, message: "Production Maintenance Created Successfully", data: response });
        } else {
            return res.status(404).send({ code: 404, message: "Production Maintenance not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };

};

exports.createprodRaiseIndent = async (req, res) => {
    try {
        const { production_mapping_id, product_id, bomDetails, remark
        } = req.body;

        let response;

        const getraiseindent = await db.prodraiseindent.findOne({
            where: { production_mapping_id: production_mapping_id, product_id: product_id, isDeleted: false },
            attributes: ['product_id', 'production_mapping_id'],
            group: ['product_id', 'production_mapping_id']
        });
        if (getraiseindent) {
            const dataUpdate = await db.prodraiseindent.update(
                { isDeleted: true, status: 'INACTIVE' },
                { where: { production_mapping_id: production_mapping_id, product_id: product_id, isDeleted: true } }
            );
        }
        for (let i = 0; i < bomDetails.length; i++) {
            response = await db.prodraiseindent.create({
                production_mapping_id, product_id, remark,
                item_master_id: bomDetails[i].item_id,
                BOM_qty: bomDetails[i].bomQty,
                total_required_qty: bomDetails[i].total_required_qty
            });
        }
        if (response) {
            return res.status(201).send({ code: 200, message: "Raise Indent Successfully", data: response });
        } else {
            return res.status(404).send({ code: 404, message: "Raise Indent not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };

};

// -------------- quality control --------------

exports.getQualityParameter = async (req, res) => {
    try {
        const { product_master_id, work_station_id, } = req.body;
        const lastSample = await db.prodqualityControl.findOne({
            order: [['id', 'DESC']]
        });
        let sample_code = "SAMP000";
        if (lastSample) {
            const lastsam_id = lastSample.id;
            sample_code += (lastsam_id + 1);
        } else {
            sample_code += "1";
        }

        let QualityParam = await qualityDetails.findOne({
            where: {
                isDeleted: false, product_master_id, work_station_id,
            },
            include: [
                {
                    model: qualityParameter,
                    where: { isDeleted: false }
                },
            ],
        });
        if (QualityParam) {

            return res.status(200).send({ code: 200, message: "Get data successfully", data: QualityParam, sample_code });
        } else {
            return res.status(404).send({ code: 404, message: "Quality parameter not found on this workstation.", data: QualityParam });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.createQualityControl = async (req, res) => {
    try {
        const { date, shift_id, workstation_id, production_mapping_id, workstation_incharge_name,
            sample_no, product_id, quality_parameter
        } = req.body;
        let quality_Pass = 0;
        let quality_Fail = 0;
        quality_parameter.forEach(element => {
            if (element.quality_status == 'Pass') {
                quality_Pass = quality_Pass + 1;
            } else {
                quality_Fail = quality_Fail + 1;
            }
        });
        const QualityControl = await db.prodqualityControl.create({
            date, shift_id, workstation_id, production_mapping_id, product_id, workstation_incharge_name,
            sample_no, total_quality_check: quality_parameter.length, total_quality_pass: quality_Pass, total_quality_fail: quality_Fail
        });

        let response;
        if (QualityControl) {
            const quality_control_id = QualityControl.id;
            for (let i = 0; i < quality_parameter.length; i++) {
                response = await db.prodqualityControlParameter.create({
                    quality_control_id: quality_control_id,
                    quality_parameter_id: quality_parameter[i].quality_parameter_id,
                    quality_parameter_name: quality_parameter[i].quality_parameter_name,
                    quality_status: quality_parameter[i].quality_status,
                    remark: quality_parameter[i].remark
                });
            }

            return res.status(200).send({ code: 200, message: "Data saved successfully.", data: QualityControl, response });
        } else {
            return res.status(404).send({ code: 404, message: "Data doesn't save." });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.qualityControlList = async (req, res) => {
    try {
        const production_mapping_id = req.params.id;
        const { work_station_id, start_date, end_date } = req.body;
        let whereClause = {
            isDeleted: false,
            status: "ACTIVE",
            production_mapping_id,
        };
        if (work_station_id) {
            whereClause.workstation_id = work_station_id;
        }
        if (start_date && end_date) {
            whereClause.date = {
                [db.Sequelize.Op.between]: [start_date, end_date],
            };
        }
        const qualityControl = await db.prodqualityControl.findAll({
            where: whereClause,
            include: [
                {
                    model: db.shift,
                    attributes: ["shift_name"],
                },
                {
                    model: db.workStation,
                    attributes: ["name_of_workstation"],
                }
            ],
        });
        if (qualityControl && qualityControl.length > 0) {
            return res.status(200).send({ code: 200, message: "Data get successfully.", data: qualityControl });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found.", data: qualityControl });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.updateLabelStatus = async (req, res) => {
    const { id, quality_id, status } = req.body;

    // Validation checks
    const requiredFields = ["id", "quality_id", "status"];

    for (const field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === null) {
            return res.status(400).send({ message: `Payload is incomplete: ${field} is missing`, data: [] });
        }
    }

    try {

        // Check if existing label data exists
        const existingLabel = await db.generateLabel.findOne({
            where: { quality_id }
        });

        if (existingLabel) { // Data exists in generateLabel table
            await db.generateLabel.update({ status: status }, { where: { id } });
            return res.status(200).send({ code: 200, message: `Label update succcessfully!` });
        }
        else {
            return res.status(500).send({ code: 500, message: error.message });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getStockById = async (req, res) => {
    try {
        const productVarientId = req.params.id;

        const production = await db.generateLabel.findall({
            where: { quality_id: productVarientId },
            // attributes: ["id", 'start_date', 'end_date'],
            // // include: [
            // //     {
            // //         model: db.production,
            // //         attributes: ["id", "product_id", , "product_variant"],
            // //         include: [ { model: db.product_master, attributes: ["product_name"] }, ],
            // //      }
            // // ],
        });
        if (production) {
            const variant_id = production.plantList.product_variant;
            const product_varient = await db.product__variant_master.findOne({
                where: { id: variant_id, status: "ACTIVE" },
                attributes: ["id", "product_variant_code", "variant_name", "product_description"]
            });
            return res.status(200).send({ code: 200, message: "Get data successfully", data: production, product_varient });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getQualityCheck = async (req, res) => {
    try {
        const productVarientId = req.params.id;

        const production = await db.generateLabel.findAll({
            where: { product_varient_id: productVarientId, isDeleted: false },
            include: [
                {
                    model: db.product__variant_master,
                    include: [{ model: db.product_master }],
                }
            ],
        });




        if (production && production.length > 0) {
            var result = production.map(item => {
                const productVariant = item.product_variant_master;
                const productMaster = productVariant.product_master;

                return {
                    id: item.id,
                    label_type: item.label_type,
                    batch_no: item.batch_no,
                    serial_no: item.serial_no,
                    status: item.status,
                    isDeleted: item.isDeleted,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    quality_id: item.quality_id,
                    product_varient_id: item.product_varient_id,
                    product_mapping_id: item.product_mapping_id,
                    product_variant_code: productVariant.product_variant_code,
                    variant_name: productVariant.variant_name,
                    product_description: productVariant.product_description,
                    mvp: productVariant.mvp,
                    price_per_unit: productVariant.price_per_unit,
                    average_production_cost: productVariant.average_production_cost,
                    product_specification: productVariant.product_specification,
                    maximum_discount: productVariant.maximum_discount,
                    variant_status: productVariant.status,
                    variant_isDeleted: productVariant.isDeleted,
                    variant_createdAt: productVariant.createdAt,
                    variant_updatedAt: productVariant.updatedAt,
                    uom_id: productVariant.uom_id,
                    product_name: productMaster.product_name,
                    product_code: productMaster.product_code,
                    product_status: productMaster.status,
                    product_isDeleted: productMaster.isDeleted,
                    product_createdAt: productMaster.createdAt,
                    product_updatedAt: productMaster.updatedAt
                };
            });
        }



        if (production) {
            // const variant_id = production.plantList.product_variant;
            // const product_varient = await db.product__variant_master.findOne({
            //     where: { id: variant_id, status: "ACTIVE" },
            //     attributes: ["id", "product_variant_code", "variant_name", "product_description"]
            // });
            return res.status(200).send({ code: 200, message: "Get data successfully", data: result });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.addStockLocation = async (req, res) => {

    try {
        let addLocation;
        let bayRacks;
        let blockBay;
        let { quality_id, product_id, warehouse_id, block_id, bay_id, rack_id, label_List, rackDetail } = req.body;
        let quantityExist = await db.productionMappingshift.findOne({where:{id:quality_id}});
        let quantity = quantityExist.quality_passed;
      
        const requiredFields = ['quality_id', 'rackDetail','product_id', 'warehouse_id', 'block_id', 'bay_id', 'rack_id', 'label_List'];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).send({ message: `Payload is incomplete: ${field} is missing`, data: [] });
            }
        }

        const existLocation = await db.stockLocation.findOne({ where: { product_id, quality_id, isDeleted: false } });
        if (existLocation) {
            addLocation = await db.stockLocation.update({ isDeleted: true }, { where: { product_id } });
        }

        addLocation = await db.stockLocation.create({
            rack_id, warehouse_id, block_id, bay_id, product_id, quality_id, quantity,stock_request: "PENDING"
        });

        rackDetail.map(async(rack)=>{
            await db.stockAcknowledgedRack.create({
                 rack_id: rack.rackId, 
                 rack_name:rack.rackName,  
                 warehouse_id, 
                 block_id, 
                 bay_id, 
                 product_id,
                 quality_id, 
                 quantity:rack.quantity, 
                 stock_request: "PENDING", 
                 stock_location_id: addLocation.id
            })
        })

        const existLabelLocation = await db.stockLabelLocation.findAll({
            where: { product_id, stock_location_id: addLocation.id, isDeleted: false }
        });

        if (existLabelLocation.length > 0) {
            await db.stockLabelLocation.update({ isDeleted: true },
                { where: { product_id } });
        }
        label_List.map(async (item) => {
            await db.stockLabelLocation.create({
                label_type: item.label_type,
                batch_no: item.batch_no,
                serial_no: item.serial_no,
                status: item.status,
                stock_location_id: addLocation.id,
                product_id
            });
            await db.generateLabel.update({ status: 'ACTIVE' }, { where: { id: item.label_id } });
        });
        return res.status(200).send({ code: 200, message: "Stock location saved successfully", data: addLocation });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }

};

exports.getLabelByProductId = async (req, res) => {
    try {
        const { quality_id, product_id } = req.body;

        // Validation checks
        const requiredFields = ['quality_id', 'product_id'];
        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null || req.body[field] === 'null') {
                return res.status(400).send({ message: `Payload is incomplete: ${field} is missing`, data: [] });
            }
        }

        // const productLabels = await db.generateLabel.findAll({ where: { quality_id, product_id, isDeleted: false } });
        const productLabels = await db.generateLabel.findAll({
            where: { quality_id, product_id, isDeleted: false },
            include: [{
              model: db.productionMappingshift , attributes:['quality_passed']
            },
            {
                model:db.product_master,
                include:[
                    {
                        model:db.product__variant_master,
                        attributes:["id","variant_name"]
                    }
                ]
            }
        ]
          });
        const labelLocation = await db.stockLocation.findAll({ where: { quality_id, product_id, isDeleted: false } });

        const response = { productLabels, labelLocation }

        if (productLabels && productLabels.length > 0) {
            return res.status(200).send({ code: 200, message: "Labels for product fetched successfully", data: response });
        } else {
            return res.status(200).send({ code: 200, message: "No labels found", data: [] });
        }


    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getNewRepeat = async (req, res) => {
    try {
        // Set SQL mode for the session
        await db.sequelize.query(`SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);
        
        const [getData] = await db.sequelize.query(
            `SELECT 
                G.quality_id,
                G.product_id AS product_id,
                MAX(P.item_name ) AS product_name,
                MAX(P.item_code ) AS product_code,
                MAX(PLMS.date) AS quality_check_date,
                MAX(G.label_type) AS label_type,
                MAX(PLMS.quality_passed) AS quality_passed,
                MAX(S.id) AS shift_id,
                MAX(S.shift_name) AS shift_name,
                MAX(PLM.production_order_no) AS production_order_no
            FROM GENERATE_QUALITY_LABEL AS G
            INNER JOIN MASTER_ITEM AS P ON P.id = G.product_id
            INNER JOIN PRODUCTION_LIST_MST_SHIFT AS PLMS ON PLMS.id = G.quality_id
            INNER JOIN PRODUCTION_LIST_MST AS PLM ON PLM.id = PLMS.production_mapping_id
            INNER JOIN MASTER_SHIFT AS S ON S.id = PLMS.shift_id    
            LEFT JOIN STOCK_LOCATION AS SL ON SL.quality_id = G.quality_id  
            WHERE SL.quality_id IS NULL
            GROUP BY G.quality_id;`
        );

        if (getData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: getData });
        } else {
            return res.status(200).send({ code: 200, message: "Data Not Found", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.stockRequest = async (req, res) => {

    try {

        let locationReq;
        let { stock_location_id, stockReq, quality_id, product_id, warehouse_id, block_id, bay_id, rack_id } = req.body;

        const requiredFields = ['stock_location_id', 'stockReq', 'quality_id', 'product_id',
            'warehouse_id', 'block_id', 'bay_id', 'rack_id'];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).send({ message: `Payload is incomplete: ${field} is missing`, data: [] });
            }
        }

        const existLocation = await db.stockLocation.findOne({ where: { id: stock_location_id, product_id, quality_id, isDeleted: false, stock_request: "PENDING" } });
        if (existLocation) {
            locationReq = await db.stockLocation.update({ stock_request: `${stockReq}` }, { where: { id: stock_location_id, product_id, quality_id, isDeleted: false } });
            stockAcknowledgedRack = await db.stockAcknowledgedRack.update({ stock_request: `${stockReq}` }, { where: { stock_location_id, product_id, quality_id, isDeleted: false } });

            if (stockReq === 'REJECTED') {
            return res.status(200).send({ code: 200, message: `Request has been rejected ` });
                
            }
            // ===================================================================================================

            const latestEntry = await db.stockLocation.findOne({
                where: { quality_id, product_id, isDeleted: true },
                order: [['id', 'DESC']],
                attributes: ['id', 'block_id', 'bay_id', 'rack_id'],
            });

            if (latestEntry) {
                const existingBlock = latestEntry.block_id;
                const existingBay = latestEntry.bay_id;
                const existingRack = latestEntry.rack_id;

                // Step 1:  Extract existing IDs from `stockLocation`
                const missingBlockIds = block_id.filter(id => !existingBlock.includes(id));
                const missingBayIds = bay_id.filter(id => !existingBay.includes(id));
                const missingRackIds = rack_id.filter(id => !existingRack.includes(id));

                // missingBlockIds.map(async (missedBlock) => {
                //     await db.bayBlock.update({ space: "EMPTY" }, { where: { id: missedBlock } });
                // })
                // missingBayIds.map(async (missedBay) => {
                //     await db.bayBlockBay.update({ space: "EMPTY" }, { where: { id: missedBay } });
                // })
                // missingRackIds.map(async (missedRay) => {
                //     await db.bayRack.update({ space: "EMPTY" }, { where: { id: missedRay } });
                // })

                // Step 2: Find IDs that are present in previous but not in newDataValues
                const removedBlockIds = existingBlock.filter(id => !block_id.includes(id));
                const removedBayIds = existingBay.filter(id => !bay_id.includes(id));
                const removedRackIds = existingRack.filter(id => !rack_id.includes(id));

                // removedBlockIds.map(async (removedBlock) => {
                //     await db.bayBlock.update({ space: "EMPTY" }, { where: { id: removedBlock } });
                // })
                // removedBayIds.map(async (removedBay) => {
                //     await db.bayBlockBay.update({ space: "EMPTY" }, { where: { id: removedBay } });
                // })
                // removedRackIds.map(async (removedRack) => {
                //     await db.bayRack.update({ space: "EMPTY" }, { where: { id: removedRack } });
                // })
            }

            // ===================================================================================================





            // ----------------------Rack Checks
            // await Promise.all(rack_id.map(async (rack) => {
            //     bayRacks = await db.bayRack.update({ space: "FULL" }, { where: { id: rack } });
            // }));
            // --------------------------    


            // ----------------------Bay Checks
            // await Promise.all(bay_id.map(async (bay) => {

            //     const allRackFull = await db.bayRack.count({ where: { space: "EMPTY", bay_id: bay, isDeleted: false } })
            //     console.log('All racks', allRackFull);
            //     if (allRackFull == 0) {
            //         await db.bayBlockBay.update({ space: "FULL" }, { where: { id: bay } });
            //     } else {
            //         await db.bayBlockBay.update({ space: "EMPTY" }, { where: { id: bay } });
            //     }
            // }));
            // ------------------------


            // ----------------------Block Checks
            // await Promise.all(block_id.map(async (block) => {
            //     const allBaysFull = await db.bayBlockBay.count({ where: { space: "EMPTY", block_id: block, isDeleted: false } })

            //     if (allBaysFull == 0) {
            //         await db.bayBlock.update({ space: "FULL" }, { where: { id: block } });
            //     } else {
            //         await db.bayBlock.update({ space: "EMPTY" }, { where: { id: block } });
            //     }
            // }));
            // -------------------------


            // ----------------------Warehouse Checks
            // await Promise.all(block_id.map(async (block) => {
            //     let allWarehouse;
            //     const allBlockFull = await db.bayBlock.findOne({ where: { space: "FULL", id: block, isDeleted: false }, attributes: ['bay_id'] })

            //     if (allBlockFull) {
            //         const allBlockCount = await db.bayBlock.count({ where: { space: "EMPTY", bay_id: allBlockFull.bay_id, isDeleted: false } })

            //         if (allBlockCount == 0) {
            //             allWarehouse = await db.bayManagement.findOne({ where: { id: allBlockFull.bay_id } });
            //             await db.warehouse.update({ space: "FULL" }, { where: { id: allWarehouse.warehouse_id } });
            //         } else {
            //             allWarehouse = await db.bayManagement.findOne({ where: { id: allBlockFull.bay_id } });
            //             await db.warehouse.update({ space: "EMPTY" }, { where: { id: allWarehouse.warehouse_id } });
            //         }
            //     }

            // }));
            // ---------------------------


        } else {
            return res.status(400).send({ code: 400, message: `Location request not found`, data: [] });
        }




        return res.status(200).send({ code: 200, message: `Stock location ${stockReq} successfully`, data: locationReq });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }

};



function generateRandomDigits(length) {
    let result = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
    }
    return result;
}
