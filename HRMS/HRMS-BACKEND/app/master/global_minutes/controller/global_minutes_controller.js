const { where } = require("sequelize");
const db = require("../../../models/index");
const global_minutes = db.global_minutes;
const employee_minutes = db.employee_minutes;
const Op = db.Sequelize.Op;

/** create global minutes */
exports.createGlobalMinutes = async (req, res) => {
    try {
        const { global_minute_value, effective_from, entity_id, department, designation, for_all } = req.body;

        const minutes_data = await global_minutes.findOne({
            where: { global_minute_value, entity_id, isDeleted: 0 }
        });

        if (minutes_data) {
            return res.status(409).send({ code: 409, message: "Global Minutes Already Exists!" });
        }

        const global_data = await global_minutes.create({
            global_minute_value,
            effective_from,
            entity_id,
            applicable_forall: for_all
        });

        const GM_id = global_data.global_minutes_id;
        if (for_all === '0') {
            await Promise.all(department.map(async (item) => {
                await db.global_mint_department.create({ gm_id: GM_id, dept_id: item });
            }));
            await Promise.all(designation.map(async (item) => {
                await db.global_mint_designation.create({ gm_id: GM_id, designation_id: item });
            }));
            return res.status(200).send({ message: "Global minute applicability created succesfully" });
        } else {
            return res.status(200).send({ message: "Global minute created successfully" });
        }
    } catch (err) {
        return res.status(500).send({ code: 500, message: err.message || "Server error" });
    }
};

/** get global list */
exports.minutesList = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const minutesData = await global_minutes.findAll({
            where: { isDeleted: false, entity_id },
            attributes: ['global_minutes_id', 'global_minute_value', 'effective_from', 'status'],
            order: [['global_minutes_id', 'DESC']],
            raw: true,
        });

        const formattedMinutesData = minutesData.map((item) => {
            return {
                ...item,
                effective_from: new Date(item.effective_from).toISOString().split('T')[0],
            };
        });

        if (formattedMinutesData) {
            res.status(200).send({ message: "Minutes data list fetched successfully", data: formattedMinutesData });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ message: err.message || "Server error" });
    }
};

/** get minutes details by id */
exports.minutesDetails = async (req, res) => {
    const global_minutes_id = parseInt(req.params.id);
    try {
        const minutesData = await global_minutes.findOne({
            where: { global_minutes_id },
            attributes: ['global_minutes_id', 'global_minute_value', 'effective_from', 'status','applicable_forall'],
            include: [{
                model: db.global_mint_department,
                where: { status: "ACTIVE", isDeleted: false },
                attributes: ['id', 'gm_id', 'dept_id'],
                as:'applicable_department',
                required:false,
            },
            {
                model: db.global_mint_designation,
                where: { status: "ACTIVE", isDeleted: false },
                attributes: ['id', 'designation_id', 'gm_id'],
                as:'applicable_designation',
                required:false,
            },
            ]
        });

        if (minutesData) {
            minutesData.effective_from = new Date(minutesData.effective_from).toISOString().split('T')[0];

            res.status(200).send({ message: "Global Minutes details fetched successfully", data: minutesData });
        }
    } catch (err) {
        res.status(400).send({ message: err.message || "Server error" });
    }
};

/** update minutes */
exports.minuteUpdate = async (req, res) => {
    try {
        const minutes_id = parseInt(req.params.minutes_id);
        const { global_minute_value, effective_from, department, designation, for_all } = req.body;

        const minutesDetails = await global_minutes.findOne({ where: { global_minutes_id: minutes_id } });
        if (!minutesDetails) {
            return res.status(404).send({ code: 404, message: "Record not found" });
        }

        const minutesExists = await global_minutes.findOne({
            where: {
                global_minute_value,
                global_minutes_id: { [Op.ne]: minutes_id },
                isDeleted: 0
            }
        });

        if (minutesExists) {
            return res.status(409).send({ code: 409, message: "Global Minutes Already Exists!" });
        }

        await global_minutes.update(
            { global_minute_value, effective_from, applicable_forall: for_all },
            { where: { global_minutes_id: minutes_id } }
        );

        if (for_all === "0") {
            await db.global_mint_department.update({ isDeleted: true }, { where: { gm_id: minutes_id, isDeleted: false } });
            await db.global_mint_designation.update({ isDeleted: true }, { where: { gm_id: minutes_id, isDeleted: false } });
            await Promise.all(department.map(async (item) => {
                await db.global_mint_department.create({ gm_id: minutes_id, dept_id: item });
            }));
            await Promise.all(designation.map(async (item) => {
                await db.global_mint_designation.create({ gm_id: minutes_id, designation_id: item });
            }));
            return res.status(200).send({ message: "Global minute applicability except all updated" });
        } else {
            await db.global_mint_department.update({ isDeleted: true }, { where: { gm_id: minutes_id, isDeleted: false } });
            await db.global_mint_designation.update({ isDeleted: true }, { where: { gm_id: minutes_id, isDeleted: false } });
            return res.status(200).send({ message: "Global minute applicability except all updated" });
        }
    } catch (err) {
        return res.status(500).send({ code: 500, message: err.message || "Server error" });
    }
};

/** update minute status */
exports.updateMinutesStatus = async (req, res) => {
    try {
        const minutes_id = parseInt(req.params.minutes_id);
        const { status } = req.body;
        const editData = await global_minutes.findOne({ where: { global_minutes_id: minutes_id } });
        if (editData) {
            const updateData = await global_minutes.update(
                { status },
                { where: { global_minutes_id: minutes_id } }
            );
            return res.status(200).send({ code: 200, message: "Status updated successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: err.message || "Server error" });
    }
};

exports.deleteMinutes = async (req, res) => {
    try {
        const minutes_id = parseInt(req.params.minutes_id);
        const minuteData = await global_minutes.findOne({ where: { global_minutes_id: minutes_id } });
        if (minuteData) {
            await global_minutes.update({ isDeleted: true }, { where: { global_minutes_id: minutes_id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

