const db = require("../../../models/index");
const branch = db.tbl_branch;
const { Op } = require('sequelize');


exports.create_Branch = async (req, res) => {
    try {
        const { branch_name, branch_contact_person_name, branch_contact_no, branch_alt_contact_no, branch_email, branch_code,
            branch_alt_email, branch_pin_code, branch_address, city_id, country_id, contact_country_code, alt_contact_country_code, state_id, branch_gstnumber, status, billing_status,
            latitude, longitude, geofence_radius_meters, is_geofence_active
        } = req.body;
        const user = await branch.findOne({
            where: {
                isDeleted: false,
                [Op.or]: [
                    { branch_name: branch_name },
                    { branch_code: branch_code }
                ]
            }
        });
        if (user) {
            return res.status(403).send({ code: 403, message: "Branch Name or Code Already Exists" })
        } else if (!user) {
            const response = await branch.create({
                branch_name,
                branch_code,
                branch_contact_person_name,
                branch_contact_no,
                contact_country_code,
                branch_alt_contact_no,
                alt_contact_country_code,
                branch_email,
                branch_alt_email,
                branch_pin_code,
                branch_address,
                city_id,
                country_id,
                state_id,
                branch_gstnumber,
                status,
                billing_status,
                latitude: (latitude !== undefined && latitude !== null && latitude !== '') ? Number(latitude) : null,
                longitude: (longitude !== undefined && longitude !== null && longitude !== '') ? Number(longitude) : null,
                geofence_radius_meters: geofence_radius_meters ? Number(geofence_radius_meters) : 150,
                is_geofence_active: is_geofence_active !== undefined ? Boolean(is_geofence_active) : true,
            });
            return res.status(200).send({ code: 200, message: "Branch Created Successfully!", data: response });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };
};

exports.branch_get = async (req, res) => {
    try {
        const { id } = req.params;
        // const { entity_id } = req.query;
        const isDeletedCondition = `WHERE T.isDeleted = false `;
        // const entityFilterCondition = entity_id ? `AND T.entity_id = :entity_id` : '';

        const query = `SELECT T.id, T.branch_name, T.branch_code, T.branch_contact_person_name, T.branch_contact_no,
        T.branch_alt_contact_no, T.branch_email, T.branch_alt_email, T.branch_pin_code, T.branch_address, T.contact_country_code, T.alt_contact_country_code,
        T.status AS branch_status, T.billing_status, T.branch_gstnumber, T.latitude, T.longitude, T.geofence_radius_meters, T.is_geofence_active,
        CT.*, S.states_id AS branch_states_id, S.*, C.*
        FROM MASTER_BRANCH AS T
        LEFT JOIN MASTER_COUNTRY AS CT ON T.country_id = CT.countryss_id
        LEFT JOIN MASTER_STATE AS S ON T.state_id = S.states_id
        LEFT JOIN MASTER_CITY AS C ON T.city_id = C.city_id 
        ${isDeletedCondition}
        ${id ? 'AND T.id = :id' : ''} 
        ORDER BY T.id DESC`;

        // Ensure that entity_id is passed only when it's available
        const replacements = {};
        if (id) replacements.id = id;
        // if (entity_id) replacements.entity_id = entity_id;

        const data = await db.sequelize.query(query, { replacements, type: db.sequelize.QueryTypes.SELECT });

        if (id) {
            if (data.length > 0) {
                return res.status(200).send({ code: 200, message: "Get Branch Data Successfully", data: data[0] });
            } else {
                return res.status(404).send({ code: 404, message: "No Data found for the provided ID" });
            }
        } else {
            return res.status(200).send({ code: 200, message: "Get All Branch Data Successfully", data: data });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.branch_get_active = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeletedCondition = `WHERE T.isDeleted = false AND T.status = 'ACTIVE'`;

        // Constructing the query conditionally based on `id`
        const query = `
            SELECT T.id, T.branch_name, T.branch_code, T.branch_contact_person_name, T.branch_contact_no,
                   T.branch_alt_contact_no, T.branch_email, T.branch_alt_email, T.branch_pin_code, T.branch_address, 
                   T.status AS branch_status, T.billing_status, T.branch_gstnumber, T.status, T.contact_country_code, T.alt_contact_country_code,
                   T.latitude, T.longitude, T.geofence_radius_meters, T.is_geofence_active,
                   CT.*, S.states_id AS branch_states_id, S.*, C.*  
            FROM MASTER_BRANCH AS T
            LEFT JOIN MASTER_COUNTRY AS CT ON T.country_id = CT.countryss_id
            LEFT JOIN MASTER_STATE AS S ON T.state_id = S.states_id
            LEFT JOIN MASTER_CITY AS C ON T.city_id = C.city_id 
            ${isDeletedCondition}
            ${id ? 'AND T.id = :id' : ''} 
            ORDER BY T.id DESC
        `;

        // Fetching data from the database
        const data = await db.sequelize.query(query, {
            replacements: { id: id || null }, // Use `null` if no ID is provided
            type: db.sequelize.QueryTypes.SELECT
        });

        // If `id` is provided, we check if data for that ID exists
        if (id) {
            if (data.length > 0) {
                // Return specific branch data
                return res.status(200).send({ code: 200, message: "Get Branch Data Successfully", data: data[0] });
            } else {
                // If no data found for the provided ID
                return res.status(404).send({ code: 404, message: "No Data found for the provided ID" });
            }
        }

        // If no `id` is provided, return all active branch data
        return res.status(200).send({ code: 200, message: "Get All Branch Data Successfully", data: data });
    } catch (error) {
        console.error(error); // Log the error to the server console
        return res.status(500).send({ code: 500, message: 'Internal Server Error', error: error.message });
    }
};

exports.update_branch = async (req, res) => {
    try {
        const branch_id = req.params.id
        if (branch_id) {
            const { branch_name,
                branch_contact_person_name,
                contact_country_code,
                alt_contact_country_code,
                branch_contact_no,
                branch_alt_contact_no,
                branch_email,
                branch_alt_email,
                branch_pin_code,
                branch_address, city_id, country_id, state_id, branch_gstnumber, status, billing_status, branch_code,
                latitude, longitude, geofence_radius_meters, is_geofence_active } = req.body;

            const existingBranch = await branch.findOne({
                where: {
                    isDeleted: false,
                    [Op.or]: [
                        { branch_name: branch_name },
                        { branch_code: branch_code }
                    ],
                    id: {
                        [Op.ne]: branch_id
                    }
                }
            });
            if (existingBranch && existingBranch.id != branch_id) {
                return res.status(400).send({ code: 400, message: "Branch with the same name already exists" });
            }
            const getAllData = await branch.findOne({ where: { id: branch_id, } });
            if (getAllData) {
                await branch.update({
                    branch_name,
                    branch_contact_person_name,
                    contact_country_code,
                    alt_contact_country_code,
                    branch_contact_no,
                    branch_alt_contact_no,
                    branch_email,
                    branch_alt_email,
                    branch_pin_code,
                    branch_address, city_id, country_id, state_id, branch_gstnumber, status, billing_status, branch_code,
                    latitude: (latitude !== undefined && latitude !== null && latitude !== '') ? Number(latitude) : null,
                    longitude: (longitude !== undefined && longitude !== null && longitude !== '') ? Number(longitude) : null,
                    geofence_radius_meters: geofence_radius_meters ? Number(geofence_radius_meters) : 150,
                    is_geofence_active: is_geofence_active !== undefined ? Boolean(is_geofence_active) : true,
                },
                    {
                        where: { id: branch_id }
                    });
                return res.status(200).send({ code: 200, message: "Branch update Successfully!" });
            } else {
                return res.status(404).send({ code: 403, message: "Branch_id not found" });
            };
        } else {
            return res.status(404).send({ code: 403, message: "Branch_id not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.delete_branch = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await branch.findOne({ where: { id: id, isDeleted: false } });
        if (getAllData) {
            await branch.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Branch is Deleted Successfully!", });
        } else {
            return res.status(404).send({ code: 403, message: "Id not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.branchStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }

        console.log(status);
        const getData = await branch.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await branch.update(
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
                message: "Branch Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

