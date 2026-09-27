const db = require('../../../models')
const Superannuation = db.superannuationScheme

module.exports.getsuperannuationProvider = async (req, res) => {
    try {
        const data = await db.superannuationProvider.findAll({
            where: { isDeleted: false }
        })
        if (!data) {
            return res.status(404).send({ code: 404, message: "No data found!" })
        }
        return res.status(200).send({ code: 200, message: "All data fetch successfully!", data })
    } catch (err) {
        return res.status(500).send({ code: 500, message: err.message || "Internl server error!" })
    }

}


module.exports.createOrUpdateSuperannuation = async (req, res) => {
    const data = req.body;
    try {

        if (data.id) {
            const existingRecord = await Superannuation.findOne({ where: { id: data.id } });

            if (existingRecord) {
                await Superannuation.destroy({ where: { id: data.id } });
            }
            const newRecord = await Superannuation.create(data);
            return res.status(201).send({ code: 201, message: "Updated successfully!", data: newRecord });

        } else {
            const newRecord = await Superannuation.create(data);
            return res.status(200).send({ code: 200, message: "Created successfully!", data: newRecord });
        }

    } catch (err) {
        res.status(500).send({ code: 500, message: "Error saving superannuation!", error: err });
    }
};


exports.getAllSuperannuationScheme = async (req, res) => {
    try {
        const data = await Superannuation.findAll({
            where: { isDeleted: false },
        });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No data found!" });
        }

        return res.status(200).json({
            message: "All data fetched successfully!",
            data
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};
