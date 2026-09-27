const { where } = require('sequelize');
const db = require('../../../models/index')
const moment = require('moment');
const Municipality = db.municipality_name
const Log = db.master_municipality_log
const currency = db.currency_convert
const logger = require('../../../../logger/index');
exports.create_Municipality = async (req, res) => {
    try {
        const { name_of_municipality,currency_id, amount, entity_id, start_date, end_date } = req.body;
        const existingMunicipality = await Municipality.findOne({
            where: {
                name_of_municipality: name_of_municipality,
                entity_id: entity_id,
                isDeleted: false,
                status: 'ACTIVE'
            }
        });
        if (existingMunicipality) {
            return res.status(201).send({ code: 201, message: "Name of Municipality Already Exists" });
        } else {
            const newMunicipality = await Municipality.create({
                name_of_municipality: name_of_municipality,
                amount: amount,
                currency_id:currency_id,
                start_date: start_date,
                end_date: end_date,
                entity_id: entity_id
            });
            return res.status(200).send({ code: 200, message: "Municipality created", data: newMunicipality });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};



exports.get_Municipality = async (req, res) => {
    try {

        const entity_id = req.params.id

        const getAllData = await Municipality.findAll({ where: {entity_id:entity_id, isDeleted: false },
            order: [['id', 'DESC']] 
        
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message:error.message || "Server Error" });
    }
};

exports.get_allactive_Municipality = async (req, res) => {
    try {
        const entity_id = req.params.entity_id;
        const getAllData = await Municipality.findAll({ where: {entity_id:entity_id,status:"ACTIVE", isDeleted: false },
            order: [['id', 'DESC']] 
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Active Municipality Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message:error.message || "Server Error" });
    }
};


exports.getMunicipalityById = async (req, res) => {
    try {
        const municipalityId = req.params.id;
        
        const query = `
        SELECT M.name_of_municipality,M.amount,M.start_date,M.end_date,CC.Currency_Type,M.currency_id
            FROM MASTER_MUNICIPALITY AS M
            LEFT JOIN MASTER_CURRENCY_CONVERT AS CC ON M.currency_id = CC.Currency_Convert_id
            WHERE M.id = ${municipalityId} AND M.isDeleted = false
        `;
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!getAllData) {
            return res.status(404).send({ code: 404, message: "Municipality not found" });
        } else {
            return res.status(200).send({ code: 200,  message: "Municipality Get Successfully ",  data: getAllData [0] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message:error.message || "Internal Server Error" });
    }
};


exports.updateMunicipalityById = async (req, res) => {
    try {
        const municipalityId = req.params.id;
        const { name_of_municipality, currency_id,amount, status, start_date, end_date } = req.body

        const municipalityData = await Municipality.findOne({ where: { id: municipalityId } })
        if (municipalityData) {
            if (name_of_municipality == undefined || name_of_municipality == null) {

                const updateStatus = await Municipality.update({
                    status: status,
                }, {
                    where: {
                        id: municipalityId,
                        isDeleted: false
                    }
                });
                return res.status(200).send({ code: 200, message: "Status Update Successfully ", data: updateStatus });
            }
            const MunicipalityfilterData = await Municipality.findOne({
                where: { name_of_municipality: name_of_municipality, isDeleted: false, status: 'ACTIVE' }
            })
            if (MunicipalityfilterData) {

                return res.status(201).send({ code: 201, message: "Name of Municipality Already Exists" })
            } else {
                let createLog;
                if (municipalityData.amount < Number(amount)) {
                    const increaseAmount = Number(amount) - municipalityData.amount;
                    createLog = await Log.create({
                        name_of_municipality,
                        increase: increaseAmount,
                        totalamount: amount,
                        status: status,
                        start_date: start_date,
                        end_date: end_date,
                        municipality_id: municipalityId,
                    })

                } else if (municipalityData.amount > Number(amount)) {
                    const decreaseAmount = municipalityData.amount - Number(amount);
                    createLog = await Log.create({
                        name_of_municipality,
                        decrease: decreaseAmount,
                        status: status,
                        totalamount: amount,
                        start_date: start_date,
                        end_date: end_date,
                        municipality_id: municipalityId,
                    })
                }
                console.log(createLog, "========================")
                const update = await Municipality.update({
                    name_of_municipality,
                    amount: amount,
                    currency_id:currency_id,
                    start_date: start_date,
                    end_date: end_date,
                }, {
                    where: {
                        id: municipalityId,
                        isDeleted: false
                    }
                });
                return res.status(200).send({ code: 200, message: "Update Successfully ", data: update });
            }


        } else {
            return res.status(403).send({ code: 403, message: "Record not Found" })
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.deleteMunicipalityById = async (req, res) => {
    try {
        const municipalityId = req.params.id
        const dltStage = await Municipality.findOne({ where: { id: municipalityId } });
        if (dltStage) {
            const deleteData = await Municipality.update({ isDeleted: true }, { where: { id: municipalityId } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
