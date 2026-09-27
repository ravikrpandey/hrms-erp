const db = require("../../../models/index");
const { Op } = require('sequelize');
const logger = require('../../../../logger/index');

exports.createFinancialYear = async (req, res) => {
    try {

        const { financial_year, year_start_date, year_end_date ,add_start_date,add_end_date,is_add_date} = req.body;
      
        const startDate = year_start_date.split('-')[0];
        const endDate = year_end_date.split('-')[0];
        const existBank = await db.financial_year.findOne({
            where: {
                isDeleted:false,
                status:'ACTIVE',
                [Op.and]: [
                    {
                        financial_year: financial_year,
                    },  
                    {
                        year_start_date: { [Op.lte]: `${startDate}%` }
                    },
                    {
                        year_end_date: { [Op.like]: `${endDate}%` }
                    }
                ]
            }
        });
        if (existBank) {
            return res.status(201).send({ code: 201, message: "financial year already exists!" });
        } else {
            const response = await db.financial_year.create({
                financial_year, year_start_date, year_end_date,add_start_date,add_end_date,is_add_date
            });
            return res.status(200).send({ code: 200, message: "financial year Created Successfully", data: response });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllfinancial = async (req, res) => {
    try {
        const data = await db.financial_year.findAll({
            where: {
                isDeleted: false,
            }, order: [['id', 'DESC']],
        })
        if (data) {
            return res.status(200).send({ code: 200, message: "Get All financial data successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllfinancial_active = async (req, res) => {
    try {
        const data = await db.financial_year.findAll({
            where: {
                isDeleted: false,
                status: 'ACTIVE'
            }, order: [['financial_year', 'ASC']],
        })
        if (data) {
            return res.status(200).send({ code: 200, message: "Get All financial data successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getByIdfinancial = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await db.financial_year.findOne({ where: { id: id, isDeleted: false } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch financial Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updatefinancialById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ code: 400, message: "ID is required" });
        }
        const { financial_year, year_start_date, year_end_date,add_start_date,add_end_date,is_add_date } = req.body;
       
        const Obj ={
            financial_year, year_start_date, year_end_date,add_end_date,add_start_date
        }
      
        if(add_start_date){
            Obj.add_start_date=add_start_date
        }
        if(add_end_date){
            Obj.add_end_date=add_end_date
        }
        if(is_add_date){
            Obj.is_add_date=is_add_date
        }
        if (!financial_year) {
            return res.status(400).send({ code: 400, message: "financial year is required" });
        } else {
            const existBank = await db.financial_year.findOne({
                where: {
                    financial_year: financial_year,
                    isDeleted: false,
                    id: {
                        [Op.ne]: id 
                    } 
                }
            });
            if (existBank) {
                return res.status(201).send({ code: 201, message: "financial year already exists!" });
            }
            const [updateCount] = await db.financial_year.update(Obj,
                { where: { id: id, isDeleted: false } }
            );

            if (updateCount === 0) {
                return res.status(404).send({ code: 404, message: "financial year Details is not found" });
            }

            return res.status(200).send({ code: 200, message: "financial year updated successfully" });

        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
exports.deletefinancial = async (req, res) => {
    try {
        const id = req.params.id

        let isExist  = await db.createPostingPeriod.findOne({where:{financial_year_id:id}});
        if(isExist){
            return res.status(404).send({ code: 404, message: "Financial year already used" });

        }


        const dltStage = await db.financial_year.findOne({ where: { id: id } });
        if (dltStage) {
            const deleteData = await db.financial_year.update({ isDeleted: true, }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updatefinancialstatusById = async (req, res) => {
    try {
        const fin_id = req.params.id;
        const { status } = req.body;
        const editData = await db.financial_year.findOne({ where: { id: fin_id } });
        if (editData) {
            const updateData = await db.financial_year.update(
                {
                    status
                }, { where: { id: fin_id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAllActivefinancial_year = async (req, res) => {
    try {
        const data = await db.financial_year.findAll({
            where: {
                isDeleted: false, status: "ACTIVE"
            }, order: [['id', 'DESC']],
        });
        if (data) {
            return res.status(200).send({ code: 200, message: "Get All financial data successfully", data: data });
        } else {
            return res.status(200).send({ code: 404, message: "No Item found", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllfinancial_yearRange = async (req, res) => {
    try {
        const data = await db.financial_year.findAll({
            where: {
                isDeleted: false,
            },
            order: [['id', 'DESC']],
        });

        if (data.length > 0) {
            // Transform financial_year into a range
            const transformedData = data.map(item => {
                const startYear = parseInt(item.financial_year); // Assuming financial_year is a string
                const endYear = startYear + 1;
                return {
                    ...item.toJSON(), // Convert Sequelize object to plain JSON
                    financial_year_range: `${startYear}-${endYear.toString().slice(-2)}`, // e.g., "2024-25"
                };
            });

            return res.status(200).send({
                code: 200,
                message: "Get All financial data successfully",
                data: transformedData,
            });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};