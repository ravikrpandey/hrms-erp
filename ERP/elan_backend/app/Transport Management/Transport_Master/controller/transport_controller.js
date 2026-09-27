const { where } = require("sequelize");
const db = require("../../../../app/models/index");
const logger = require('../../../../logger/index');

exports.create_transport_master = async (req, res) => {
    try {
        const {
            tm_name,
            tm_contact_number,
            tm_email,
            tm_gst_number,
            tm_address,
            status,
            vehicle_category_id,
            tds_id,
            nature_id
        } = req.body;

        if (!tm_name || !tm_contact_number || !vehicle_category_id) {
            return res.status(400).send({ code: 400, message: "Required fields are missing." });
        }

        const newTransport = await db.transport_master.create({
            tm_name,
            tm_contact_number,
            tm_email,
            tm_gst_number,
            tm_address,
            status: status ,
            isDeleted: false,
            vehicle_category_id,
            tds_id,
            nature_id
        });

        return res.status(201).send({
            code: 201,
            message: "Transport master created successfully",
            data: newTransport
        });
    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAll_transport = async (req, res) => {
    try {
        const { entity_id, financial_year_id, role, emp_id } = req.query;

        let query = `
            SELECT 
                id, tm_name, tm_contact_number, tm_email, tm_gst_number,
                tm_address, status, isDeleted, createdAt, updatedAt
            FROM TM_TRANSPORTER_MASTER
            WHERE entity_id = ${entity_id} AND financial_year_id = ${financial_year_id}
        `;

        // If role is not Super Admin, add created_by condition
        // if (role !== 'Super Admin') {
        //     query += ` AND created_by = ${emp_id}`;
        // }

        query += ` ORDER BY id DESC`;

        const [response] = await db.sequelize.query(query);

        return res.status(200).send({
            message: "Fetched successfully",
            data: response || []
        });

    } catch (error) {
        console.error("Error fetching transport data:", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    }
};


exports.get_transport_by_id = async (req, res) => {
    try {
        const { transport_id } = req.query;

        if (!transport_id) {
            return res.status(400).send({
                message: "Transport ID not provided"
            });
        }

        const [response] = await db.sequelize.query(`
            SELECT 
                id, tm_name, tm_contact_number, tm_email, tm_gst_number,
                tm_address, status, isDeleted, createdAt, updatedAt, vehicle_category_id
            FROM TM_TRANSPORTER_MASTER
            WHERE id = ${transport_id}
        `);

        if (response && response.length > 0) {
            return res.status(200).send({
                message: "Fetched successfully",
                data: response[0]
            });
        } else {
            return res.status(200).send({
                message: "No transport found with the given ID",
                data: []
            });
        }

    } catch (error) {
        console.error("Error fetching transport by ID:", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    }
};



