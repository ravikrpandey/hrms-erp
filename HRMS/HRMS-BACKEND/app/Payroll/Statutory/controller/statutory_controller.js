const { where } = require('sequelize');
const db = require('../../../models/index');
const PayrollStatutoryModel = db.payroll_statutory;
const {validateFields} = require('../../../utils/inputValidator');


exports.createStatutory = async (req, res) => {
    try {
        const requiredFields = ['monthly_bonus_percent'];
        const validation = await validateFields(req.body, requiredFields);
        console.log(req.body)

        if (!validation.isValid) {
            return res.status(400).send({status: false,message: validation.message});
        }

        const allStatutory = await PayrollStatutoryModel.findAll();
        const currentYear = new Date().getFullYear().toString();
        const statutory_code = allStatutory.length <= 0  ? `STATUTORY/${currentYear}/001` : `STATUTORY/${currentYear}/00${allStatutory.length + 1}`;

        const response = await PayrollStatutoryModel.create({...req.body});
        return res.status(200).send({status: true,message: "Statutory created successfully",data: response});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};


exports.getAllStatutory = async (req, res) => {
    try {
        const statutoryList = await PayrollStatutoryModel.findAll({
            where: {
                is_active: true
            },
            attributes: ["id", "payment_frequency", "monthly_bonus_percent", "created_by"],
            order: [["createdAt", "DESC"]]
        });
        
        if (statutoryList.length <= 0) {
            return res.status(400).send({status: false,message: "No statutory list found", data: statutoryList});
        }

        return res.status(200).send({status: true,message: "statutory Listed successfully",data: statutoryList});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};

exports.getStatutoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const statutoryList = await PayrollStatutoryModel.findByPk(id);

        if (!statutoryList) {
            return res.status(400).send({status: false,message: "No statutory list found", data: statutoryList});
        }

        return res.status(200).send({status: true,message: "Statutory Listed successfully",data: statutoryList});

    } catch (error) {
        return res.status(500).send({status: false,message: error.message || 'Server Error'});
    }
};


exports.updateStatutory = async (req, res) => {
    try {
        const id = req.params.id;
        const {payment_frequency,monthly_bonus_percent,created_by} = req.body;

        const existingStatutory = await PayrollStatutoryModel.findOne({ where: { id, is_active: true } });
        if (!existingStatutory) {
            return res.status(404).send({ status: false, message: "Statutory record not found" });
        }

        await PayrollStatutoryModel.update(
            { is_active: false }, 
            { where: { id: existingStatutory.id } }
        );

        const newStatutory = await PayrollStatutoryModel.create({payment_frequency,monthly_bonus_percent,created_by});

        return res.status(200).send({ status: true, message: "Statutory updated successfully", data: newStatutory });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};
