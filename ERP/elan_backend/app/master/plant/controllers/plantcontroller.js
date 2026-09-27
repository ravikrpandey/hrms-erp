const db = require("../../../models/index");
const PlantDetails = db.plantmaster;

exports.create_plant = async (req, res) => {
    try {
        const { plant_name, plant_address, plant_contactno, plant_altcontactno, plant_emailid, plant_headname, plant_headcontactno  , plant_location, plant_pincode, city_id, country_id, state_id,entity_id } = req.body;
        const plant_code = btoa(Math.random()).slice(0, 10).toUpperCase();
        const plant = await PlantDetails.findOne({
            where:{plant_name},
        });
        if (plant) {
            return res.status(403).send({ code: 403, message: "Plant  Already Exists" });
        } else if (!plant) {
            const response = await PlantDetails.create({
                plant_name,
                plant_code,
                plant_address,
                plant_contactno,
                plant_altcontactno,
                plant_location,
                plant_emailid,
                plant_headname,
                plant_headcontactno,
                plant_pincode,
                city_id, country_id, state_id,entity_id
            });
            return res.status(200).send({ code: 200, message: "plant Created Successfully!", data: response });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
};


exports.plant_getAll = async (req, res) => {
    try {
        const { id ,entity_id} = req.params;
        
        let condition = ''
        if (id) {
            condition += `WHERE T.id =${id} AND T.isDeleted=false`
        } else {
            condition += `WHERE T.entity_id=${entity_id} AND T.isDeleted = :isDeleted`
        }
     
        // const isDeletedCondition = 'AND T.isDeleted = :isDeleted';
        const query = `
            SELECT T.id, T.plant_name, T.plant_code, T.plant_address, T.plant_contactno, 
            T.plant_altcontactno, T.plant_location, T.plant_emailid, T.plant_headname, T.plant_headcontactno, 
            T.plant_pincode, T.status, T.country_id, CT.countryss_name, T.state_id, S.states_name
            FROM MASTER_PLANT AS T
            INNER JOIN MASTER_COUNTRY AS CT ON T.country_id = CT.countryss_id
            INNER JOIN MASTER_STATE AS S ON T.state_id = S.states_id
          ${condition} ORDER BY T.id DESC`;
        const data = await db.sequelize.query(query, {
            replacements: { id: id, isDeleted: false },
            type: db.sequelize.QueryTypes.SELECT
        });
        if (id) {
            if (data.length > 0) {
                return res.status(200).send({ code: 200, message: "Get plant data successfully", data: data[0] });
            } else {
                return res.status(404).send({ code: 404, message: "No Data found for the provided ID" });
            }
        } else {
            return res.status(200).send({ code: 200, message: "Get plant data successfully", data: data });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" });
    }
};
exports.update_plant = async (req, res) => {
    try {
        const id = req.params.id
        if (id) {
            const { plant_name,
                plant_address,
                plant_contactno,
                plant_altcontactno,
                plant_location,
                plant_emailid,
                plant_headname,
                plant_headcontactno,
                plant_pincode, country_id, state_id } = req.body;
            const getAllData = await PlantDetails.findOne({ where: { id: id } });
            if (getAllData) {
                await PlantDetails.update({
                    plant_name,
                    plant_address,
                    plant_contactno,
                    plant_altcontactno,
                    plant_location,
                    plant_emailid,
                    plant_headname,
                    plant_headcontactno,
                    plant_pincode, country_id, state_id
                }, { where: { id: id, status: "ACTIVE" } });
                return res.status(200).send({
                    code: 200, message: "plant update Successfully!",
                });
            } else {
                return res.status(404).send({ code: 403, message: "id not found" });
            };
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};
exports.delete_plant = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await PlantDetails.findOne({ where: { id: id } });
        if (getAllData) {
            await PlantDetails.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Plant is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }

    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};
exports.plantStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }
        const getData = await PlantDetails.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await PlantDetails.update(
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
                message: "Plant Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllActivePlant = async (req, res) => {
    try {
        const {entity_id} = req.params;
        
            const data = await PlantDetails.findAll({
                    where:{
                        status:"ACTIVE",entity_id
                    },
                    include:[
                        {
                            model:db.countryss,

                        },
                        {
                            model:db.states
                        }
                    ]
            })
            if (data.length > 0) {
                return res.status(200).send({ code: 200, message: "Get plant data successfully", data: data });
            } else {
                return res.status(404).send({ code: 404, message: "No Data found" });
            }
        
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" });
    }
};
