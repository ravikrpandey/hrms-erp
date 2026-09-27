const db = require('../../../models/index');

exports.createCustomermicroCategory = async (req, res) => {
    try {
        const { micro_category_name, micro_category_code, customer_sub_category_id, customer_category_id, financial_year_id, entity_id } = req.body;
        const customerId = await db.customer_category.findOne(
            { where: { customer_category_id: customer_category_id } }
        )
        if (!customerId) {
            return res.status(400).send({ code: 400, message: "Customer Category Id Not found" })
        }

        const customersubId = await db.customersubcategory.findOne(
            { where: { id: customer_sub_category_id } }
        )
        if (!customersubId) {
            return res.status(400).send({ code: 400, message: "Customer Sub Category Id Not found" })
        }


        const data = await db.customermicrocategory.findOne(
            { where: { micro_category_name: micro_category_name, status: 'ACTIVE', isDeleted: false } }
        )
        if (data) {
            return res.status(400).send({ code: 400, message: "Customer Micro Category Name Already Exists!" })
        } else {
            const response = await db.customermicrocategory.create({
                micro_category_name, micro_category_code, financial_year_id, entity_id,
                customer_sub_category_id: customersubId.id, customer_category_id: customerId.customer_category_id
            });
            return res.status(200).send({ code: 200, message: "Customer Micro Category Created Successfully!", data: response });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAllCustomermicroCategory = async (req, res) => {
    try {
        const getAllData = await db.customermicrocategory.findAll({
            where: { isDeleted: false }, order: [
                ['id', 'DESC'],
            ],
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Customer Micro Category Data Successfully!", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.editCustomermicroCategory = async (req, res) => {
    try {
        const CustomerCategoryId = req.params.id;
        const { micro_category_name, } = req.body;
        const editData = await db.customermicrocategory.findOne(
            { where: { id: CustomerCategoryId, isDeleted: false } }
        );
        const data = await db.customermicrocategory.findOne(
            { where: { micro_category_name: micro_category_name, status: 'ACTIVE', isDeleted: false } }
        )
        if (data) {
            return res.status(400).send({ code: 400, message: "Customer Micro Category Name Already Exists!" })
        }
        if (editData) {
            const updateData = await db.customermicrocategory.update(
                { micro_category_name },
                { where: { id: CustomerCategoryId } });
            return res.status(200).send({ code: 200, message: "Customer Micro Category Updated SuccessFully!", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getByIdCustomermicroCategory = async (req, res) => {
    try {
        const CustomerCategoryId = req.params.id;
        const getData = await db.customermicrocategory.findOne({
            where: { id: CustomerCategoryId, isDeleted: false },
            include: [{
                model: db.customer_category,
                where: { isDeleted: false },
                include: {
                    model: db.customersubcategory,
                    where: { isDeleted: false },
                }
            }, {
                model: db.entityMaster,
                attributes: ['entity_name']
            },
            {
                model: db.financial_year,
                attributes: ['financial_year']
            }
            ]

        });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.customermicroCategoryStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await db.customermicrocategory.findOne(
            { where: { id: id, isDeleted: false } }
        );
        if (getData) {
            const updated = await db.customermicrocategory.update(
                { status },
                { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Customer Micro Category Status Change Successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.deleteCustomermicroCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const getAllData = await db.customermicrocategory.findOne({ where: { id: id } });
        if (getAllData) {
            await db.customermicrocategory.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "soft-deleted successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllmicroCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const items = await db.customermicrocategory.findAll({
            where: { isDeleted: false, customer_sub_category_id: id },
        });
        if (items.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Micro Customer Category data successfully", data: items });
        } else {
            return res.status(201).send({ code: 201, message: "No Item found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};