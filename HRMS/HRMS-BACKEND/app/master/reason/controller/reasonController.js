const db = require('../../../models/index');
const Reason = db.reason_for

exports.create_Reason = async (req, res) => {
    try {

        const { reason_for_recruitment } = req.body;
        const existingReason = await Reason.findOne({
            where: {
                reason_for_recruitment: reason_for_recruitment,
                isDeleted: false
            }
        });

        if (existingReason) {
            return res.status(403).send({ code: 403, message: "Reason Already Exists" });
        } else {
            const newReason = await Reason.create({
                reason_for_recruitment: reason_for_recruitment

            });
            return res.status(200).send({ code: 200, message: "Reason Created Successfully", data: newReason });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.getAllReason = async (req, res) => {
    try {

        const reasons =   await Reason.findAll({ where: { isDeleted: false } });


        if (reasons.length > 0) {
            return res.status(200).send({ code: 200, message: "All Reason Found", data: reasons });
        } else {
            return res.status(404).send({ code: 404, message: "No  Found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.get_Reason_by_id = async (req, res) => {
    try {
        const Reasonid = req.params.id
        const reason = await Reason.findOne({ where: { id: Reasonid, isDeleted: false } });

        if (!reason) {
            return res.status(404).send({ code: 404, message: "Reason not found" });
        }

        return res.status(200).send({ code: 200, message: "Success", data: reason });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.update_Reason_by_id = async (req, res) => {
    try {
        const Reasonid = req.params.id;
        const { reason_for_recruitment } = req.body;


        let reason = await Reason.findOne({ where: { id: Reasonid, isDeleted: false } });

        if (!reason) {
            return res.status(404).send({ code: 404, message: "Reason not found" });
        } else {
            const Reasons = await Reason.findOne({
                where: { reason_for_recruitment: reason_for_recruitment, id: { [db.Sequelize.Op.ne]: Reasonid } }
            })
            if (Reasons) {
                return res.status(409).send({ code: 409, message: "Reason Already Exists" });
            } else {
                const reasons = await reason.update({
                    reason_for_recruitment
                }, {
                    where: {
                        id: Reasonid
                    }
                });

                return res.status(200).send({ code: 200, message: "Reason updated successfully", data: reasons });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.delete_Reason_by_id = async (req, res) => {
    try {
        const Reasonid = req.params.id
        const dltStage = await Reason.findOne({ where: { id: Reasonid } });
        if (dltStage) {
            const deleteData = await Reason.update({ isDeleted: true }, { where: { id: Reasonid } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.resStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await Reason.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await Reason.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};