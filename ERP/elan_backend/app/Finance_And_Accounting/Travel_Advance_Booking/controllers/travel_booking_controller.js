const { attribute } = require('@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js')
const db = require('../../../models/index')
const Travel_model = db.travel_request
const Advance_Travel_Booking = db.travel_advance_booking
const moment = require('moment')
const logger = require('../../../../logger/index');

/** get all approved travel details */
exports.getAllApprovedTravelRequests = async (req, res) => {
    try {
        const { financial_year_id, entity_id } = req.params;

        const baseQuery = `
            SELECT 
                tr.id,
                fc.employee_id AS employee_id,
                tr.user_id AS user_id,
                tr.entity_id AS entity_id,
                tr.travel_request_number,
                tr.total_amount,
                fc.first_name AS first_name,
                fc.last_name AS last_name,
                tr.book_advance_status,
                tr.change_advance_status,
                tr.financial_year_id
            FROM
                ESS_TRAVEL_REQUEST AS tr
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON tr.user_id = fc.employee_id
            WHERE 
                tr.isDeleted = false AND tr.entity_id = :entity_id AND tr.travel_request_status = 'APPROVED' AND tr.book_advance_status = true AND tr.change_advance_status = false
        `;

        const getAllData = await db.sequelize.query(baseQuery + ` AND tr.financial_year_id = :financial_year_id`, {
                replacements: { entity_id, financial_year_id },
                type: db.sequelize.QueryTypes.SELECT,
            });

        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Approved Travel Requests Successfully!",
                data: getAllData,
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Approved Travel Requests Found for This Employee!",
            });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
};

/** create advance booking */
exports.createTravelAdvanceBooking = async (req, res) => {
    try {
        const { travel_id, total_amount, payment_type, bank_detail_id, entity_id, user_id, financial_year_id } = req.body;
        const existingBooking = await Advance_Travel_Booking.findOne({ where: { travel_request_id: travel_id } });

        if (existingBooking) {
            return res.status(400).send({ code: 400, message: "Advance Booking Already Created!" });
        } else {
            const newBooking = await Advance_Travel_Booking.create({
                travel_request_id: travel_id,
                total_amount,
                payment_type,
                bank_detail_id,
                entity_id,
                user_id,
                financial_year_id
            });

            if (newBooking) {
                const updateResult = await Travel_model.update(
                    { change_advance_status: true },
                    { where: { id: travel_id } }
                );
                
                if (!updateResult) {
                    return res.status(400).send({ code: 400, message: "Failed to update book advance status" });
                }

                return res.status(200).send({ code: 200, message: "Advance Booking Created Successfully!", data: newBooking });
            } else {
                return res.status(400).send({ code: 400, message: "Failed to create advance booking" });
            }
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

/** get all advance booking  */
exports.getAllTravelAdvanceBooking = async (req, res) => {
    try {
        const { entity_id, financial_year_id } = req.body;

        if (!entity_id) {
            return res.status(400).send({
                code: 400,
                message: "Invalid or missing entity_id",
            });
        }

        let query = `
            SELECT 
                fc.employee_id AS employee_id,
                tr.entity_id AS entity_id,
                tr.travel_request_number,
                fc.first_name AS first_name,
                fc.last_name AS last_name,
                ft.total_amount AS advance_total_amount,
                ft.payment_type,
                ft.status,
                ft.travel_request_id,
                tr.department_id
            FROM
                FINANCE_TRAVEL_ADVANCE_BOOKING AS ft
            LEFT JOIN 
                ESS_TRAVEL_REQUEST AS tr ON tr.id = ft.travel_request_id
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON tr.user_id = fc.employee_id
            WHERE 
                tr.isDeleted = false 
                AND ft.entity_id = :entity_id
                AND ft.financial_year_id = :financial_year_id
        `;

        const replacements = { entity_id, financial_year_id };

        const getAllData = await db.sequelize.query(query, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Advance Booking Data Successfully!",
                data: getAllData,
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Advance Booking Data Found!",
            });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error('Error in getAllTravelAdvanceBooking:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
