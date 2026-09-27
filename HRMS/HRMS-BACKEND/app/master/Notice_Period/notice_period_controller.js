const db = require("../../models/index");

const NoticePeriod = db.notice_period_master;
const Op = db.Sequelize.Op;

exports.noticePeriodCreate = async (req, res) => {
    try {
        const {
            notice_period_id,
            confirm_notice_days,
            probation_notice_days,
            entity_id,
            can_buy_out,
            can_waive_out,
            created_by
        } = req.body;

        const exist = await NoticePeriod.findOne({
            where: {
                entity_id,
                isDeleted: 0
            }
        });
        if (exist) {
            return res.status(409).send({
                code: 409,
                message: "Notice period already exist for this entity!"
            });
        }

        const created = await NoticePeriod.create({
            notice_period_id,
            confirm_notice_days: confirm_notice_days.trim(),
            probation_notice_days: probation_notice_days.trim(),
            can_buy_out: can_buy_out,
            can_waive_out: can_waive_out,
            entity_id,
            created_by
        });

        return res.status(200).send({
            code: 200,
            message: "Created successfully!",
        });

    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};


exports.getAllNoticePeriod = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const noticeperiodData = await NoticePeriod.findAll({
            where: { isDeleted: false, entity_id },
            attributes: [
                "notice_period_id",
                "confirm_notice_days",
                "probation_notice_days",
                "can_buy_out",
                "can_waive_out",
                "created_by",
                "status"
            ],
            order: [["notice_period_id", "DESC"]],
        });

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: noticeperiodData,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.getNoticePeriodById = async (req, res) => {
    try {
        const notice_period_id = parseInt(req.params.notice_period_id);
        const noticeperiodData = await NoticePeriod.findOne({
            where: { notice_period_id, isDeleted: false },
            attributes: [
                "notice_period_id",
                "confirm_notice_days",
                "probation_notice_days",
                "can_buy_out",
                "can_waive_out",
                "created_by",
                "status"
            ],
        });

        if (!noticeperiodData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        res.status(200).send({
            code: 200,
            message: "Data fetched successfully!",
            data: noticeperiodData,
        });
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.noticePeriodUpdate = async (req, res) => {
    try {
        const notice_period_id = parseInt(req.params.notice_period_id);

        // Extract data from request body
        const {
            confirm_notice_days,
            probation_notice_days,
            can_buy_out,
            can_waive_out,
            entity_id
        } = req.body;

        // Validate required fields
        if (!confirm_notice_days || !probation_notice_days) {
            return res.status(400).send({
                code: 400,
                message: "Notice period days and probation period days are required!"
            });
        }

        await NoticePeriod.update(
            {
                confirm_notice_days,
                probation_notice_days,
                can_buy_out: can_buy_out || false,
                can_waive_out: can_waive_out || false,
                entity_id
            },
            { where: { notice_period_id } }
        );

        const updatedRecord = await NoticePeriod.findOne({
            where: { notice_period_id }
        });

        if (!updatedRecord) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        return res.status(200).send({
            code: 200,
            message: "Updated successfully!",
            data: updatedRecord
        });
    } catch (err) {
        console.error('Update error:', err);
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.updateNoticePeriodStatus = async (req, res) => {
    try {
        const notice_period_id = parseInt(req.params.notice_period_id);
        const { status } = req.body;
        const editData = await NoticePeriod.findOne({
            where: { notice_period_id, isDeleted: false }
        });

        if (!editData) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await NoticePeriod.update(
            { status },
            { where: { notice_period_id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Status updated successfully!",
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};

exports.deleteNoticePeriodById = async (req, res) => {
    try {
        const notice_period_id = parseInt(req.params.notice_period_id);
        const noticePeriodDetails = await NoticePeriod.findOne({
            where: { notice_period_id, isDeleted: false }
        });
        if (!noticePeriodDetails) {
            return res.status(404).send({
                code: 404,
                message: "Record not found!"
            });
        }

        await NoticePeriod.update(
            { isDeleted: true },
            { where: { notice_period_id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Deleted successfully!"
        });
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error!",
            error: err.message
        });
    }
};