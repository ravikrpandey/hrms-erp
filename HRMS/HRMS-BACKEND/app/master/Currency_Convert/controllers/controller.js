const { where } = require('sequelize');
const db = require('../../../models/index')
const Currency_Conversion = db.currency_convert;

exports.create_Currency = async (req, res) => {
    try {
        const { Currency_Type, rate, Currency_Convert_id } = req.body;
        if (!Currency_Convert_id || Currency_Convert_id == null) {
            const Create_Currency = await Currency_Conversion.create({
                Currency_Type: Currency_Type,
                rate: rate
            })
            res.status(200).send({ code: 200, message: "Currency created successfully", data: Create_Currency })
        } else {
            const Update_Currency = await Currency_Conversion.update({
                Currency_Type: Currency_Type,
                rate: rate
            }, { where: { Currency_Convert_id: Currency_Convert_id } })
            res.status(200).send({ code: 200, message: "Successfully Updated", data: Update_Currency })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ code: 500, message: error.message || "Server error" })
    }
}

/////////////////Get ALL //////////////////////////////////
exports.getAll_Currency = async (req, res) => {
    try {
        const Get_Currency = await Currency_Conversion.findAll({ where: { status: "ACTIVE", isDeleted: false } });
        if (Get_Currency) {
            res.status(200).send({ code: 200, message: "Currency Data found successfully", data: Get_Currency })
        }
        else {
            res.status(404).send({ code: 404, message: "No  currency id Found" })
        }
    }
    catch (error) {
        res.status(500).send({ code: 500, message:error.message || "Server error" })
    }

}

/////////////////Get ALL //////////////////////////////////
exports.getByIdAll_Currency = async (req, res) => {
    try {
        const Get_Currency = await Currency_Conversion.findOne({
            where: { Currency_Convert_id: req.params.id, status: "ACTIVE", isDeleted: false }
        })
        if (Get_Currency) {
            res.status(200).send({ code: 200, message: "Currency found successfully", data: Get_Currency })
        }
        else {
            res.status(404).send({ code: 404, message: "No  currency id Found" })
        }
    }
    catch (error) {
        res.status(500).send({ code: 500, message: "Server error" })
    }
}

exports.delete_Currency = async (req, res) => {
    try {
        const currency_id = req.params.id;
        const Get_Currency = await Currency_Conversion.findOne({
            where: { Currency_Convert_id: currency_id }
        })
        if (Get_Currency) {
            await Currency_Conversion.update({ status: "INACTIVE", isDeleted: true }, { where: { Currency_Convert_id: currency_id } });
            res.status(200).send({ code: 200, message: "Currency Deleted Successfully" })
        }
        else {
            res.status(404).send({ code: 404, message: "No  currency id Found" })
        }
    }
    catch (error) {
        res.status(500).send({ code: 500, message: "Server error" })
    }
}


exports.getall_currency_payroll = async (req, res) => {
    try {
        const Get_Currency = await Currency_Conversion.findAll({ where: { status: "ACTIVE", isDeleted: false } });
        if (Get_Currency) {
            res.status(200).send({ code: 200, message: "Currency Data found successfully", data: Get_Currency })
        }
        else {
            res.status(404).send({ code: 404, message: "No  currency id Found" })
        }
    }
    catch (error) {
        res.status(500).send({ code: 500, message: "Server error" })
    }

}