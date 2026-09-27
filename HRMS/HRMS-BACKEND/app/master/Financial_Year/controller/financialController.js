const db = require("../../../models/index");



exports.createFinancialYear = async (req, res) => {
    try {
        const { financial_year } = req.body;

        const existBank = await db.financial_year.findOne({ where: { financial_year: financial_year, isDeleted: false } });
        if (existBank) {
            return res.status(201).send({ code: 201, message: "financial year already exists!" });
        } else {
            const response = await db.financial_year.create({
                financial_year
            });
            return res.status(200).send({ code: 200, message: "financial year Created Successfully", data: response });
        } 
    } catch (error) {
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
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



exports.getAllfinancial_active = async (req, res) => {
    try {
        const data = await db.financial_year.findAll({
            where: {
                isDeleted: false,
                status: 'ACTIVE'
            }, order: [['id', 'DESC']],
        })
        if (data) {
            return res.status(200).send({ code: 200, message: "Get All financial data successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "No Item found" });
        }
    } catch (error) {
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
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
exports.updatefinancialById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ code: 400, message: "ID is required" });
        }
        const { financial_year } = req.body;
        if (!financial_year) {
            return res.status(400).send({ code: 400, message: "financial year is required" });
        } else {
            const existBank = await db.financial_year.findOne({ where: { financial_year: financial_year, isDeleted: false ,id: !id} });
            if(existBank){
                return res.status(201).send({ code: 201, message: "financial year already exists!" });
            }
            const [updateCount] = await db.financial_year.update(
                { financial_year: financial_year },
                { where: { id: id, isDeleted: false } }
            );

            if (updateCount === 0) {
                return res.status(404).send({ code: 404, message: "financial year Details is not found" });
            }

            return res.status(200).send({ code: 200, message: "financial year updated successfully" });

        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
exports.deletefinancial = async (req, res) => {
    try {
        const id = req.params.id
        const dltStage = await db.financial_year.findOne({ where: { id: id } });
        if (dltStage) {
            const deleteData = await db.financial_year.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
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
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAllActivefinancial_year = async (req, res) => {
    try {
        const data = await db.financial_year.findAll({
            where: {
                isDeleted: false, status:"ACTIVE"
            }, order: [['id', 'DESC']],
        });
        if (data) {
            return res.status(200).send({ code: 200, message: "Get All financial data successfully", data: data });
        } else {
            return res.status(200).send({ code: 404, message: "No Item found", data:[]});
        }
    } catch (error) {
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
