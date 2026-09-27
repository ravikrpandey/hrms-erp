
const { exp, forEach } = require("mathjs");
const db = require("../../../models");
const path = require('path');
const moment = require('moment');
const { Op, sequelize ,fn, col,literal} = require('sequelize');
const { log } = require("console");
const qualityDetails = db.quality_master;
const qualityParameter = db.quality_parameter
exports.createProduction = async (req, res) => {
    try {
        const { total_qty, product_id, product_variant, employee_id,
        } = req.body;
        // let main_specification = JSON.parse(plantList);
        // let main_specification_shift = JSON.parse(shiftList);
        // let main_specification_workstation = JSON.parse(workstationList);
        let image_upload = '';
        if (req.file) {
            image_upload = req.file.path;
        } else {
            image_upload = "";
        }
        let createprod;
        const formattedUploadDoc = image_upload.replace(/\\/g, '/');
        const productExists = await db.production.findOne({
            where: { product_id,product_variant,isDeleted: false}
        });
        if (productExists) {
            const createprodd = await db.production.update({
                total_qty, product_variant, employee_id,
            image_upload: formattedUploadDoc,
            },
            { where: { product_id,id:productExists.id,isDeleted: false} });
            if(createprodd){
            createprod = await db.production.findOne({
                where: { product_id,id:productExists.id,isDeleted: false}
            });
        }
            // return res.status(404).send({ code: 404, message: "Production Already Exists" });
        }else{
        createprod = await db.production.create({
            total_qty, product_id, product_variant, employee_id,
            image_upload: formattedUploadDoc,
        });

        }
        
        if (createprod) {
            return res.status(201).send({ code: 201, message: "Production Created Successfully" , data: createprod});
        } else {
            return res.status(404).send({ code: 404, message: "Production not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
};

exports.createPlant = async (req, res) => {
    try {
        const { production_id, plantId, production_qty, start_date,
            end_date,production_manager_id, shiftList, workstationList,
        } = req.body;
        const gy = generateRandomDigits(7);
        const plant_order = 'PON';
        const prod_order_no = plant_order+gy;
        // let main_specification_shift = JSON.parse(shiftList);
        // let main_specification_workstation = JSON.parse(workstationList);
        const product_ = btoa(Math.random()).slice(0, 4).toUpperCase();
        let response;
        const plantExists = await db.productionMapping.findOne({
            where: { production_id,plant_id: plantId,isDeleted: false}
        });
        if(plantExists){
            const response1 = await db.productionMapping.update({
                production_id: production_id,
                plant_id: plantId,
                production_qty: production_qty,
                start_date: start_date,
                end_date: end_date,
                production_manager_id: production_manager_id,
            },{ where: { production_id,plant_id: plantId,isDeleted: false} });
            if(response1){
            response=await db.productionMapping.findOne({
                where: { production_id,plant_id: plantId,isDeleted: false}
            });
        }
        }else{
                response = await db.productionMapping.create({
                    production_id: production_id,
                    production_order_no:prod_order_no,
                    plant_id: plantId,
                    production_qty: production_qty,
                    start_date: start_date,
                    end_date: end_date,
                    production_manager_id: production_manager_id,
                });
            }
                const shiftlistr=[];
        if (response) {
            const deleteshift = await db.productionMappingshift.update({
                isDeleted: true,
                status:'INACTIVE'
            },{where:{production_id,plant_id: plantId,production_mapping_id:response.id}
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
        const workstationListr=[];
        if (response) {
            const deleteworkstation = await db.productionWorkStation.update({
                isDeleted: true,
                status:'INACTIVE'
            },{where:{production_id,plant_id: plantId,production_mapping_id:response.id}
            });
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
            return res.status(201).send({ code: 201, message: "Production Created Successfully" , data: response,shiftlistr,workstationListr});
        } else {
            return res.status(404).send({ code: 404, message: "Production not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
};

// exports.createProduction = async (req, res) => {
//     try {
//         const { total_qty, product_id, product_variant, employee_id,
//             plantList, shiftList, workstationList,
//         } = req.body;
//         let main_specification = JSON.parse(plantList);
//         let main_specification_shift = JSON.parse(shiftList);
//         let main_specification_workstation = JSON.parse(workstationList);
//         let image_upload = '';
//         if (req.file) {
//             image_upload = req.file.path;
//         } else {
//             image_upload = "";
//         }
//         let createprod;
//         const formattedUploadDoc = image_upload.replace(/\\/g, '/');
        
//         // return false;
//         const productExists = await db.production.findOne({
//             where: { product_id,product_variant,isDeleted: false}
//         });
//         if (productExists) {
//             const createprodd = await db.production.update({
//                 total_qty, product_variant, employee_id,
//             image_upload: formattedUploadDoc,
//             },
//             { where: { product_id,isDeleted: false} });
//             createprod = productExists;
//             // console.log(createprod.id);
//             // return res.status(404).send({ code: 404, message: "Production Already Exists" });
//         }else{
//         createprod = await db.production.create({
//             total_qty, product_id, product_variant, employee_id,
//             image_upload: formattedUploadDoc,
//         });

//         }
//         // return false;
//         // const productionExists = await db.production.findOne({
//         //     where: { product_variant, isDeleted: false }
//         // });
//         // if (productionExists) {
//         //     return res.status(404).send({ code: 404, message: "Production Already Exists" });
//         // }
        
//         let response;
//         if (createprod) {
//             // for (let i = 0; i < main_specification.length; i++) {
//                 response = await db.productionMapping.create({
//                     production_id: createprod.id,
//                     plant_id: main_specification.plantId,
//                     production_qty: main_specification.production_qty,
//                     start_date: main_specification.start_date,
//                     end_date: main_specification.end_date,
//                     total_shift: main_specification.total_shift,
//                     production_manager_id: main_specification.production_manager_id,
//                 });
//             // }
//         }
       
//         if (createprod) {
//             for (let i = 0; i < main_specification_shift.length; i++) {
//                 console.log(main_specification_shift[i]);
//                 reshift = await db.productionMappingshift.create({
//                     production_id: createprod.id,
//                     production_mapping_id: response.id,
//                     shift_id: main_specification_shift[i]
//                 });
//             }
//         }
//         let resworkstation;
//         if (createprod) {
//             for (let i = 0; i < main_specification_workstation.length; i++) {
//                 resworkstation = await db.productionWorkStation.create({
//                     production_id: createprod.id,
//                     workstation_id: main_specification_workstation[i].workstation_id,
//                     plant_id: main_specification_workstation[i].plantId
//                 });
//             }
//         }
//         if (createprod) {
//             return res.status(201).send({ code: 201, message: "Production Created Successfully" });
//         } else {
//             return res.status(404).send({ code: 404, message: "Production not Created" });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     };
// };

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
                    as: 'plantList'
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
        let total_qtys =0;
        productions.forEach((productions) => {
            const plantList = productions.plantList;
            plantList.forEach((plant) => {
                total_qtys = total_qtys + plant.production_qty;
            });
            productions.total_qty = total_qtys;
        });
        if (productions) {
            return res.status(200).send({ code: 200, message: "Get All Productions data successfully", data: productions });
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
            where:{id, isDeleted:false,status:"ACTIVE"},
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
                    as: 'plantList'
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
        const { employee_id, role } = req.body;
        const plant_data = await db.user.findOne({
            where: { employee_id: employee_id },
            attributes: ['reporting_plant_location'],
          });
          const plant_id = await db.plantmaster.findOne({
            where: { plant_name: plant_data.reporting_plant_location },
            attributes: ['id']
          });
          let whereClause = {
            isDeleted: false,
            status: "ACTIVE",
        };
          if (role != "Super Admin") {
            whereClause.plant_id = plant_id.id;
        }
       
        const productions = await db.production.findAll({
            where: { isDeleted: false,status:"ACTIVE" },
            attributes: ['product_id'],
            include: [
                {
                    model: db.product_master,
                    attributes: ["product_name"],
                },
                {
                    model: db.productionMapping,
                    where: whereClause,
                    attributes: ["id","production_order_no", "production_qty", "status_schedule", 'start_date', 'end_date', 'production_manager_id','production_id'],
                    include: [
                        {
                            model: db.plantmaster,
                            attributes: ["plant_name"],
                        }
                    ],
                    as: 'plantList'
                },
            ],
            order: [['id', 'DESC']],
        });
        if (productions && productions.length > 0) {
            const formattedData = productions.map(production => {
                const plantList = production.plantList.map((plant, index) => ({
                    id: plant.id,
                    product: production.product_id,
                    production_order_no:plant.production_order_no,
                    product_name: production.product_master.product_name,
                    startDate: plant.start_date,
                    endDate: plant.end_date,
                    status: plant.status_schedule,
                    plantName: plant.plant_master.plant_name,
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

exports.getRepeatById = async (req, res) => {
    try {
        const productionId = req.params.id;
        const production = await db.productionMapping.findOne({
            where: { id: productionId },
            attributes: ["id", 'start_date', 'end_date'],
            include: [
                {
                    model: db.production,
                    attributes: ["id","product_id","product_variant"],
                    include: [
                        {
                        model: db.product_master,
                        attributes: ["product_name"]
                    },
                ],as: 'plantList',
            },
                    {
                        model: db.productionMappingshift,
                        attributes: ["shift_id"],
                        include:
                        {
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
                        ], as: 'workstationList'
                    },
                    // ],
                    // as: 'plantList',
                // },
                {
                    model: db.plantmaster,
                    attributes: ["plant_name"],
                },
            ],
        });
        if (production) {
            const variant_id = production.plantList.product_variant;
            const product_varient = await db.product__variant_master.findOne({
            where: { id: variant_id,status:"ACTIVE" },
            attributes: ["id","product_variant_code","variant_name","product_description"]
            });
            return res.status(200).send({ code: 200, message: "Get data successfully", data: production,product_varient });
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
        let { workstationList, shift_id, date} = req.body;
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
                { net_production, rework, shift_id ,date},
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
            attributes: ["id", "start_date", "end_date", "batch_number", "s_number"],
            include: [
                {
                    model: db.productionMappingshift,
                    attributes: ["id", "date", "generate_label", "quality_passed", "ng", "total_production", "shift_id",],
                    include: [
                        {
                            model: db.productionMapping,
                            attributes: ["id", "batch_number", "s_number"],
                        },
                        {
                            model: db.shift,
                            attributes: ["id", "shift_name"]
                        },

                    ],
                    as: 'shiftList'
                },
                {
                    model: db.production,
                    attributes: ["id", "product_variant"],
                    include: [
                        {
                            model: db.product_master,
                            attributes: ["product_name"],
                            include: {
                                model: db.product__variant_master,
                                attributes: ["id", "variant_name"]
                            }
                        },
                        {
                            model: db.productionMappingshift,
                            attributes: ["id", "shift_id"],
                            include: {
                                model: db.shift,
                                attributes: ["shift_name"]
                            },
                            as: 'shiftList'
                        },
                    ],
                    as: 'plantList',
                },
            ],
        }
        );
        const shiftData = await db.productionMappingshift.findAll({
            where: { production_mapping_id: productionId },
            attributes: [
                'shift_id',
                [col('shift.shift_name'), 'shift_name']
            ],
            include: {
                model: db.shift,
                attributes: [], 
            },
            group: ['shift_id'],
            raw: true
        });
        if (production) {
            const shiftDataByDate = {};
            production.shiftList.forEach(shift => {
                const date = shift.date
                if (!shiftDataByDate[date]) {
                    shiftDataByDate[date] = [];
                }
                shiftDataByDate[date].push(shift);
            });
            // const sortedShiftDataByDate = Object.fromEntries(
            //     Object.entries(shiftDataByDate).sort(([a], [b]) => new Date(a) - new Date(b))
            // );

            return res.status(200).send({ code: 200, message: "Get data successfully", data: production,shiftData  });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

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

exports.updateQuality = async (req, res) => {
    try {
        const id = req.params.production_mapping_id;
        const { date, generate_label, shift_id, quality_passed, ng, total_production } = req.body;
        
        if (id) {
            const existingQuality = await db.productionMappingshift.findOne({
                where: { date,production_mapping_id: id, shift_id: shift_id, status: "ACTIVE" },
            });
            if (existingQuality) {
                const data = await db.productionMappingshift.update({
                    date, generate_label, quality_passed, ng, total_production
                }, { where: { date,production_mapping_id: id, shift_id: shift_id,status: "ACTIVE", } });

                return res.status(200).send({
                    code: 200, message: "Quality updated successfully!", data: data
                });

            } else {
                const newData = await db.productionMappingshift.create({
                    date, generate_label, shift_id, quality_passed, ng, total_production,
                    production_mapping_id: id,
                });

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

exports.scheduleproductionbyId = async (req, res) => {
    try {
        const production_mapping_id = req.params.id;
        const production = await db.productionMapping.findOne({
            where: { id: production_mapping_id },
            attributes: ["id", "production_order_no","production_qty","start_date", "end_date", "batch_number", "s_number"],
            include: [
                {
                    model: db.production,
                    attributes: ["id","product_id", "product_variant"],
                    include: [  
                        {
                            model: db.product_master,
                            attributes: ["product_name","product_code"],
                        },
                    ],
                    as: 'plantList',
                },
            ],
        });
        if(production){
           const variant_id = production.plantList.product_variant;
            const product_varient = await db.product__variant_master.findOne({
            where: { id: variant_id,status:"ACTIVE" },
            attributes: ["id","product_variant_code","variant_name","product_description"]
            });

            // console.log("====================",product_varient.variant_name)
            const BomData = await db.bom.findAll({
                where: { product_id: production.plantList.product_id,bom_type:"PRODUCTION",status:"ACTIVE",isDeleted: false,product_variant : product_varient.variant_name},
                
                include:[
                    {
                        model: db.bomDetails,
                        where: { isDeleted: false},
                        include: [
                            {
                                model: db.ItemMaster,
                                attributes: ["item_name", "item_code","id"],
                                include: [
                                    { model: db.uomdetails, attributes: ["uom_name"] },
                                ]
                            }
                        ]
                    },
                    
                ], 
            });
        return res.status(200).send({ code: 200, message: "Get data successfully", data: production,product_varient,BomData });
    }else{
        return res.status(404).send({ code: 404, message: "Data not found" });
    }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

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
                    attributes: ["id", "date", "quality_passed","ng","total_production", "shift_id"],
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
            Night_Shift.push({ date: formattedDate, quality_passed: 0,ng:0 ,total_production:0,shift_name:0});
            Morning_Shift.push({ date: formattedDate, quality_passed: 0,ng:0 ,total_production:0,shift_name:0});
            Evening_Shift.push({ date: formattedDate, quality_passed: 0,ng:0 ,total_production:0,shift_id:0});
            Prod_passed.push({ date: formattedDate, quality_passed: 0 ,ng:0,total_production:0,shift_name:0});
        }
        let total_quality=0;
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
                Morning_Shift1.shift_id=shiftdata.shift_id;
            } else if (shiftdata.shift.shift_name === 'Evening Shift') {
                const eveningShiftItem = Evening_Shift.find(item => item.date === formattedDate1);
                if (eveningShiftItem) {
                    eveningShiftItem.quality_passed = shiftdata.quality_passed;
                    eveningShiftItem.ng = shiftdata.ng;
                    eveningShiftItem.total_production = shiftdata.total_production;
                }
                Evening_Shift1.shift_id=shiftdata.shift_id;
            } else if (shiftdata.shift.shift_name === 'Night Shift') {
                const nightShiftItem = Night_Shift.find(item => item.date === formattedDate1);
                if (nightShiftItem) {
                    nightShiftItem.quality_passed = shiftdata.quality_passed;
                    nightShiftItem.ng = shiftdata.ng;
                    nightShiftItem.total_production = shiftdata.total_production;
                }
                Night_Shift1.shift_id=shiftdata.shift_id;
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
            // Prod_passed.find(item => item.date === formattedDate2).quality_passed = sdata.total_quality_passed.ng = sdata.total_ng.total_production = sdata.total_production;
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
        Morning_Shift1.morning_shift_data=Morning_Shift;
        Evening_Shift1.evening_shift_data=Evening_Shift;
        Night_Shift1.night_shift_data=Night_Shift;
        const graphdata = {
            prod_total:Prod_passed,
            morning: Morning_Shift1,
            evening: Evening_Shift1,
            night: Night_Shift1
        };   
        return res.status(200).send({ code: 200, message: "Get data successfully", data: graphdata });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.schedprodformaintenance = async (req,res) => {
    try{
        const { start_date, start_time, end_date, end_time,
            production_mapping_id, product_id,product_name, workstation_id,shift_id
        } = req.body;
        
        let response = await db.workstationmaintenance.create({
                start_date,start_time,end_date,end_time,product_name,workstation_id,shift_id,production_mapping_id,product_id
            });
       
        if (response) {
            return res.status(201).send({ code: 200, message: "Production Maintenance Created Successfully" , data: response});
        } else {
            return res.status(404).send({ code: 404, message: "Production Maintenance not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
    
};

exports.createprodRaiseIndent = async (req,res) => {
try{
    const {production_mapping_id, product_id, bomDetails,remark
    } = req.body;

    let response;
    const getraiseindent = await db.prodraiseindent.findOne({
        where: { production_mapping_id: production_mapping_id,product_id:product_id,isDeleted: false},
        attributes: ['product_id', 'production_mapping_id'],
        group: ['product_id', 'production_mapping_id']
    });
    if(getraiseindent){
        const dataUpdate = await db.prodraiseindent.update(
            { isDeleted: true,status:'INACTIVE'},
            { where: { production_mapping_id: production_mapping_id,product_id:product_id,isDeleted: true} }
        );
    }
    for (let i = 0; i < bomDetails.length; i++) {
        response = await db.prodraiseindent.create({
            production_mapping_id,product_id,remark,
            item_master_id:bomDetails[i].item_id,
            BOM_qty:bomDetails[i].bomQty,
            total_required_qty:bomDetails[i].total_required_qty
        });
    }
    if (response) {
        return res.status(201).send({ code: 200, message: "Raise Indent Successfully" , data: response});
    } else {
        return res.status(404).send({ code: 404, message: "Raise Indent not Created" });
    }
} catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
};

};

// -------------- quality control --------------

exports.getQualityParameter = async (req,res) => {
    try {
        const { product_master_id, work_station_id, product_variant_name} = req.body;
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
                isDeleted: false,product_master_id,work_station_id,product_variant_name
            },
            include: [
                {
                    model: qualityParameter,
                    where: { isDeleted: false }
                },
            ],
        });
        if(QualityParam){

        return res.status(200).send({ code: 200, message: "Get data successfully", data: QualityParam,sample_code });
        } else {
            return res.status(404).send({ code: 404, message: "Quality parameter not found on this workstation.",data: QualityParam });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.createQualityControl = async (req,res) => {
    try{
        const { date, shift_id, workstation_id, production_mapping_id,workstation_incharge_name,
            sample_no, product_id,quality_parameter
        } = req.body;
        let quality_Pass = 0; 
        let quality_Fail = 0;
        quality_parameter.forEach(element => {
            if(element.quality_status == 'Pass'){
                quality_Pass = quality_Pass+1;
            }else{
                quality_Fail = quality_Fail+1;
            }
        });
        const QualityControl = await db.prodqualityControl.create({
            date,shift_id,workstation_id,production_mapping_id,product_id,workstation_incharge_name,
            sample_no,total_quality_check:quality_parameter.length,total_quality_pass:quality_Pass,total_quality_fail:quality_Fail
        });

        let response;
        if(QualityControl){
            const quality_control_id = QualityControl.id;
            for (let i = 0; i < quality_parameter.length; i++) {
                response = await db.prodqualityControlParameter.create({
                    quality_control_id:quality_control_id,
                    quality_parameter_id:quality_parameter[i].quality_parameter_id,
                    quality_parameter_name:quality_parameter[i].quality_parameter_name,
                    quality_status:quality_parameter[i].quality_status,
                    remark:quality_parameter[i].remark
                });
            }

            return res.status(200).send({ code: 200, message: "Data saved successfully.", data: QualityControl,response  });
            } else {
                return res.status(404).send({ code: 404, message: "Data doesn't save." });
            }
        } catch (error) {
            return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
        }
};

exports.qualityControlList = async (req,res) => {
        try{
            const production_mapping_id = req.params.id;
            const { work_station_id,start_date,end_date} = req.body;
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
                include:[
                    {
                        model: db.shift,
                        attributes: ["shift_name"],
                    },
                    {
                        model: db.workStation,
                        attributes: ["name_of_workstation"],
                    }
                    // {
                    //     model: db.prodqualityControlParameter,
                    // },
                ],
            });
            if(qualityControl && qualityControl.length > 0){
                return res.status(200).send({ code: 200, message: "Data get successfully.", data: qualityControl });
            } else {
                return res.status(404).send({ code: 404, message: "Data not found." , data: qualityControl});
            }
        }catch (error) {
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
























































