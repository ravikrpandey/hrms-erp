const db = require('../../../models/index')

module.exports.getAllUses = async (req, res) => {
    try {

        const getUses = await db.uses.findAll({ where: { isDeleted: false } });
        if (getUses) {
            return res.status(200).send({ code: 200, data: getUses });
        } else {
            return res.status(200).send({ code: 404, messege: 'no data found', data: getUses });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: 'server error' });
    }
}
module.exports.getAllActiveUsageData = async (req, res) => {
    try {

        const getUses = await db.uses.findAll({ where: { isDeleted: false, status: "ACTIVE" } });
        if (getUses) {
            return res.status(200).send({ code: 200, data: getUses });
        } else {
            return res.status(200).send({ code: 404, messege: 'no data found', data: getUses });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: 'server error' });
    }
}

module.exports.getAllUsesById = async (req, res) => {
    try {

        const getUses = await db.uses.findOne({ where: { id: req.params.id } });
        if (getUses) {
            return res.status(200).send({ code: 200, data: getUses });
        } else {
            return res.status(200).send({ code: 404, messege: 'no data found', data: getUses });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: 'server error' });
    }
}

module.exports.createUses = async (req, res) => {
    try {
        const { name } = req.body
        const getUses = await db.uses.create({ name });
        if (getUses) {
            return res.status(201).send({ code: 201, messege: 'Succcfully Created Uses' });
        } else {
            return res.status(200).send({ code: 404, messege: 'Not Created', });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: 'server error' });
    }
}
module.exports.updateUses = async (req, res) => {
    try {
        const { name } = req.body
        const getUses = await db.uses.update({ name }, { where: { id: req.params.id } });
        if (getUses) {
            return res.status(200).send({ code: 200, messege: 'Uses Updated Successfully' });
        } else {
            return res.status(200).send({ code: 404, messege: 'Not Updated' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: 'server error' });
    }
}
module.exports.deleteUses = async (req, res) => {
    try {

        const getUses = await db.uses.update({ isDeleted: true }, { where: { id: req.params.id } });
        if (getUses) {
            return res.status(200).send({ code: 200, data: getUses });
        } else {
            return res.status(200).send({ code: 404, messege: 'no data found' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, messege: 'server error' });
    }
}

exports.updateUsesStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const isExist = await db.uses.findOne({ where: { id: id, isDeleted: false } });
        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Seal Type not found!" });
        }

        await db.uses.update({
            status: status
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

