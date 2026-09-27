const { where } = require("sequelize");
const db = require("../../../models/index");
const { Where } = require("@sequelize/core");

// module.exports.createWarehouse = async (req, res) => {
//     try {
//         const { name, plant_id, employee_id, country_id, role_id, contact_no, alt_contact_no, email, alt_email,branch_id  } = req.body;
//         const warehouseExist = await db.warehouse.findOne({where:{ name, plant_id }})

//         if (warehouseExist) {
//             return res.status(409).send({ code: 409, message: 'Warhouse already exist' });
//         }

//         var createdWarehouse = await db.warehouse.create(
//             { name, plant_id, employee_id, country_id, contact_no,branch_id , role_id, email, alt_email, alt_contact_no });
//         // }
//         if (createdWarehouse) {
//             return res.status(201).send({ code: 201, message: "Successfully created" });
//         } else {
//             return res.status(404).send({ code: 404, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message });
//     }
// };


module.exports.createWarehouse = async (req, res) => {
    try {
        const { warehouse_name,
            warehouse_code,
            warehouse_type,
            warehouse_parent,
            manager_name,
            country_id,
            State_id,
            city_id,
            pin,
            warehouse_contact_person,
            warehouse_designation,
            conatact_number,
            email_address,
            address,
            warehouse_alternate_no, } = req.body;

        const warehouseExist = await db.warehouse.findOne({ where: {  } })

        if (warehouseExist) {
            return res.status(409).send({ code: 409, message: 'Warhouse already exist' });
        }

        var createdWarehouse = await db.warehouse.create(
            { name, plant_id, employee_id, country_id, contact_no, branch_id, role_id, email, alt_email, alt_contact_no });
        // }
        if (createdWarehouse) {
            return res.status(201).send({ code: 201, message: "Successfully created" });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getActiveWarehouseList = async (req, res, next) => {
    try {
        let warehouseList = await db.warehouse.findAll({ where: { status: "ACTIVE", isDeleted: false } });
        for (let i = 0; i < warehouseList.length; i++) {
            const plant = await db.plantmaster.findOne({ where: { id: warehouseList[i].plant_id } });
            let temp = {
                "id": warehouseList[i].id,
                "name": warehouseList[i].name,
                "contact_no": warehouseList[i].contact_no,
                "email": warehouseList[i].email,
                "alt_email": warehouseList[i].alt_email,
                "createdAt": warehouseList[i].createdAt,
                "updatedAt": warehouseList[i].updatedAt,
                "employee_id": warehouseList[i].employee_id,
                "role_id": warehouseList[i].role_id,
                "plant_id": warehouseList[i].plant_id,
                "country_code": warehouseList[i].country_code,
                "status": warehouseList[i].status
            }
            warehouseList[i] = temp;
            if (plant && plant.dataValues && plant.dataValues.plant_name) {
                warehouseList[i].plant_name = plant.dataValues.plant_name
            } else {
                warehouseList[i].plant_name = ""
            }
        }
        if (warehouseList.length > 0) {
            return res.status(200).json({ code: 200, message: "Success ", data: warehouseList });
        } else {
            return res.status(404).json({ code: 404, message: "warehouse list not found", data: warehouseList });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "server Error" });
    }
}

module.exports.getWarehouseById = async (req, res, next) => {
    try {

        let warehouse = await db.warehouse.findOne({
            where: { id: req.params.id, isDeleted: false },
            include: [
                {
                    model: db.plantmaster,
                    attributes: ['plant_code', 'plant_name', 'plant_address']
                },
                {
                    model: db.role_master,
                    attributes: ['role_master_id', 'role_master_name']
                },
                {
                    model: db.user,
                    attributes: ['employee_id', 'first_name', 'last_name']
                },
                {
                    model: db.countryss,
                    attributes: ['countryss_id', 'countryss_name']
                }
            ]
        });

        // If warehouse is found, flatten the response
        if (warehouse) {
            let warehouseData = warehouse.get({ plain: true });

            // Flatten plant_master, role_master, user, and countryss data into the main object
            let flattenedResponse = {
                ...warehouseData,
                plant_code: warehouseData.plant_master?.plant_code,
                plant_name: warehouseData.plant_master?.plant_name,
                plant_address: warehouseData.plant_master?.plant_address,
                role_master_id: warehouseData.role_master?.role_master_id,
                role_master_name: warehouseData.role_master?.role_master_name,
                employee_id: warehouseData.registered_user?.employee_id,
                first_name: warehouseData.registered_user?.first_name,
                last_name: warehouseData.registered_user?.last_name,
                countryss_id: warehouseData.countryss?.countryss_id,
                countryss_name: warehouseData.countryss?.countryss_name
            };

            // Remove the nested objects
            delete flattenedResponse.plant_master;
            delete flattenedResponse.role_master;
            delete flattenedResponse.registered_user;
            delete flattenedResponse.countryss;

            res.status(200).json({ code: 200, message: "Success", data: flattenedResponse });
        } else {
            res.status(404).json({ code: 404, message: "Warehouse not found" });
        }

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

module.exports.editWarehouse = async (req, res) => {
    try {
        const { id, name, plant_id, role_id, employee_id, country_id, contact_no, email, alt_email, country_code, branch_id } = req.body;
        const editData = await db.warehouse.findOne({ where: { id: id } });
        if (editData) {
            const existingWarehouses = await db.warehouse.findAll({ where: { name } });

            let flag = false
            existingWarehouses.forEach((warehouse) => {
                if (warehouse.id != id) flag = true
            })
            if (flag) {
                return res.status(400).send({ code: 400, message: "warehouse name already exists" })
            } else if (!flag) {
                const updateData = await db.warehouse.update(
                    {
                        id,
                        name,
                        plant_id,
                        role_id,
                        employee_id,
                        contact_no,
                        email,
                        country_id,
                        alt_email,
                        country_code,
                        branch_id
                    },
                    { where: { id: id } }
                );
                return res.status(200).send({ code: 200, message: "Warehouse Updated Successfull!", data: updateData });
            }
        } else {
            return res.status(404).send({ code: 404, message: "warehouse Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getWarehouseByPlant = async (req, res) => {
    try {
        const { plantId } = req.params.plantId;
        const dataList = await db.warehouse.findAll({ where: { plant_id: req.params.plantId, isDeleted: false } });
        if (dataList.length > 0) {
            return res.status(200).json({ code: 200, message: "Success ", data: dataList });
        } else if (dataList.length == 0) {
            return res.status(200).json({ code: 200, message: "Success ", data: [] });
        } else {
            return res.status(404).send({ code: 404, message: "warehouse Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

exports.warehouseStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }

        const getData = await db.warehouse.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await db.warehouse.update(
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
                message: "Warehouse Status Changed Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.deleteWarehouse = async (req, res) => {
    try {

        let existing = await db.warehouse.findOne({
            where: { id: req.params.id, isDeleted: false }
        });

        if (!existing) {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }

        await db.warehouse.update(
            {
                isDeleted: true, status: 'INACTIVE',
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        return res.status(200).send({ code: 200, message: "Deleted Successfully" });

    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

module.exports.getWarehouseList = async (req, res, next) => {
    try {
        let employee_id = req.params.employee_id;
        let warehouseList;
        let role = await db.user.findOne({ where: { employee_id: employee_id }, attributes: ['user_role', 'branch_id'] });
        if (role.user_role === 'Super Admin') {
            warehouseList = await db.warehouse.findAll({
                where: { isDeleted: false },
                include: [
                    {
                        model: db.plantmaster,
                        attributes: ['plant_code', 'plant_name', 'plant_address']
                    },
                    {
                        model: db.tbl_branch,
                        attributes: ['id', 'branch_name', 'branch_code']
                    },],
                order: [['id', 'DESC']]
            });
        } else {
            warehouseList = await db.warehouse.findAll({
                where: { isDeleted: false, branch_id: role.branch_id },
                include: [{
                    model: db.plantmaster,
                    attributes: ['plant_code', 'plant_name', 'plant_address']
                },
                {
                    model: db.tbl_branch,
                    attributes: ['id', 'branch_name', 'branch_code']
                },],
                order: [['id', 'DESC']]
            });
        }

        let flattenedList = warehouseList.map(item => {
            let plainItem = item.get({ plain: true });
            return {
                ...plainItem,
                plant_code: plainItem.plant_master.plant_code,
                plant_name: plainItem.plant_master.plant_name,
                plant_address: plainItem.plant_master.plant_address,
                // Remove plant_master
                plant_master: undefined,

                branch_name: plainItem.tbl_branch.branch_name,
                branch_code: plainItem.tbl_branch.branch_code,
                // Remove plant_master
                tbl_branch: undefined
            };
        });


        // const warehouseMap = new Map();

        // for (const warehouse of warehouseList) {
        //     const plant = await db.plantmaster.findOne({ where: { id: warehouse.plant_id } });

        //     let warehouseData = {
        //         id: warehouse.id,
        //         name: warehouse.name,
        //         contact_no: warehouse.contact_no,
        //         email: warehouse.email,
        //         alt_email: warehouse.alt_email,
        //         createdAt: warehouse.createdAt,
        //         updatedAt: warehouse.updatedAt,
        //         employee_id: warehouse.employee_id,
        //         role_id: warehouse.role_id,
        //         plant_id: warehouse.plant_id,
        //         country_code: warehouse.country_code,
        //         status: warehouse.status,
        //         plant_name: plant && plant.dataValues && plant.dataValues.plant_name ? plant.dataValues.plant_name : ""
        //     };

        //     if (!warehouseMap.has(warehouse.name)) {
        //         warehouseMap.set(warehouse.name, {
        //             name: warehouse.name,
        //             contact_no: warehouse.contact_no,
        //             email: warehouse.email,
        //             alt_email: warehouse.alt_email,
        //             createdAt: warehouse.createdAt,
        //             updatedAt: warehouse.updatedAt,
        //             employee_id: warehouse.employee_id,
        //             role_id: warehouse.role_id,
        //             country_code: warehouse.country_code,
        //             status: warehouse.status,
        //             plant_ids: [warehouse.plant_id]
        //         });
        //     } else {
        //         const existing = warehouseMap.get(warehouse.name);
        //         existing.plant_ids.push(warehouse.plant_id);
        //     }
        // }

        // const result = Array.from(warehouseMap.values());

        if (warehouseList.length > 0) {
            return res.status(200).json({ code: 200, message: "Success", data: flattenedList });
        } else {
            return res.status(404).json({ code: 404, message: "Warehouse list not found", data: [] });
        }
    } catch (error) {
        console.error("Error fetching warehouse list:", error);
        return res.status(500).send({ code: 500, message: `Server Error :- ${error}`, });
    }
};


module.exports.getStockWarehouse = async (req, res, next) => {
    const { request, employee_id } = req.body;

    const requiredFields = ['request'];
    for (const field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === null) {
            return res.status(400).send({ message: `The payload is incomplete: ${field} is missing`, data: [] });
        }
    }

    let response = [];
    let warehouseList = [];
    let reqWarehouse = [];

    try {

        let warehouseList;
        let condition;
        let employee = await db.user.findOne({ where: { employee_id: employee_id }, attributes: ['user_role', 'branch_id'] });

        if (employee.user_role === "Super Admin") {
            condition = { isDeleted: false, space: 'EMPTY' };
        } else {
            condition = { isDeleted: false, space: 'EMPTY', branch_id: employee.branch_id };
        }

        warehouseList = await db.warehouse.findAll({
            where: condition,
            include: [{
                model: db.plantmaster,
                attributes: ['plant_code', 'plant_name', 'plant_address']
            }],
            order: [['id', 'DESC']]
        });

        if (request.length <= 0) {
            response = warehouseList;
        } else {

            reqWarehouse = await db.warehouse.findAll({
                where: { id: request },
                include: [{
                    model: db.plantmaster,
                    attributes: ['plant_code', 'plant_name', 'plant_address']
                }],
                order: [['id', 'DESC']]
            });

            response = [...warehouseList, ...reqWarehouse];
        }

        // Ensure response is not undefined and is an array
        if (!response || response.length === 0) {
            return res.status(200).json({ code: 200, message: "No warehouse found", data: [] });
        }

        let flattenedList = response.map(item => {
            let plainItem = item.get({ plain: true });
            return {
                ...plainItem,
                plant_code: plainItem.plant_master?.plant_code,
                plant_name: plainItem.plant_master?.plant_name,
                plant_address: plainItem.plant_master?.plant_address,
                // Remove plant_master
                plant_master: undefined
            };
        });

        // Remove duplicates based on the 'id' field
        const uniqueDataById = Array.from(new Map(flattenedList.map(item => [item.id, item])).values());

        return res.status(200).json({ code: 200, message: "Success", data: uniqueDataById });
    } catch (error) {
        console.error("Error fetching warehouse list:", error);
        return res.status(500).send({ code: 500, message: `Server Error :- ${error}` });
    }
};

module.exports.getWarehouseLocationHierarchy = async (req, res) => {
  try {
    const { zone_id, rack_id, shelf_id } = req.query;

    // if (!warehouse_id) {
    //   return res.status(400).json({
    //     code: 400,
    //     message: "warehouse_id is required",
    //   });
    // }

    // 🔹 STEP 1: GET ZONES
    if (!zone_id) {
      const zones = await db.warehouseBifurcationZone.findAll({
        where: {
          warehouse_id,
          isDeleted: false,
          status: "ACTIVE",
        },
        attributes: ["id", "zone_name"],
      });

      return res.status(200).json({
        code: 200,
        level: "ZONE",
        data: zones,
      });
    }

    // 🔹 STEP 2: GET RACKS
    if (zone_id && !rack_id) {
      const racks = await db.warehouseBifurcationRack.findAll({
        where: {
          warehouse_zone_id: zone_id,
          isDeleted: false,
          status: "ACTIVE",
        },
        attributes: ["id", "rack_name"],
      });

      return res.status(200).json({
        code: 200,
        level: "RACK",
        data: racks,
      });
    }

    // 🔹 STEP 3: GET SHELVES
    if (rack_id && !shelf_id) {
      const shelves = await db.warehouseBifurcationSelf.findAll({
        where: {
          warehouse_rack_id: rack_id,
          isDeleted: false,
          status: "ACTIVE",
        },
        attributes: ["id", "self_name"],
      });

      return res.status(200).json({
        code: 200,
        level: "SHELF",
        data: shelves,
      });
    }

    // 🔹 STEP 4: GET BINS
    if (shelf_id) {
      const bins = await db.warehouseBifurcationSection.findAll({
        where: {
          warehouse_shelf_id: shelf_id,
          isDeleted: false,
          status: "ACTIVE",
        },
        attributes: ["id", "section_name"],
      });

      return res.status(200).json({
        code: 200,
        level: "BIN",
        data: bins,
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server Error",
      error: error.message,
    });
  }
};
