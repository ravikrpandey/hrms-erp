const db = require('../../../models/index');

////////////////// Create Category ///////////////

exports.createCustomersubCategory = async (req, res) => {
    try {
        const { sub_category_name, sub_category_code, customer_category_id, financial_year_id, entity_id } = req.body;

        const existingSubCategory = await db.customersubcategory.findOne({ where: { sub_category_name: sub_category_name } });
        if (existingSubCategory) {
            return res.status(400).send({ code: 400, message: "Customer Sub Category Name Already Exists!" });
        }

        const newSubCategory = await db.customersubcategory.create({
            sub_category_name,
            sub_category_code,
            customer_category_id: customer_category_id,
            financial_year_id, entity_id
        });

        return res.status(201).send({ code: 201, message: "Customer Sub Category Created Successfully!", data: newSubCategory });
    } catch (error) {
        console.error("Error in createCustomersubCategory:", error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAllCustomersubcategory = async (req, res) => {
    try {
        const getAllData = await db.customersubcategory.findAll({
            where: { isDeleted: false },
            include: {
                model: db.customer_category,
                where: { isDeleted: false }
            }, order: [
                ['id', 'DESC'],
            ],
        });

        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All customer subcategory data successfully",
                data: getAllData
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No records found"
            });
        }
    } catch (error) {
        console.error("Error in getAllCustomersubcategory:", error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.editCustomersubCategory = async (req, res) => {
    try {
        const { customer_category_id, sub_category_name, sub_category_code } = req.body;
        const CustomerCategoryId = req.params.id;
        const existingSubCategory = await db.customersubcategory.findOne({ where: { customer_category_id:customer_category_id,sub_category_name: sub_category_name, isDeleted: false } });
        if (existingSubCategory) {
            return res.status(400).send({ code: 400, message: "Customer Sub Category Name Already Exists!" });
        }
        const editData = await db.customersubcategory.findOne({ where: { id: CustomerCategoryId, isDeleted: false } });
        if (editData) {
            const updateData = await db.customersubcategory.update(req.body, { where: { id: CustomerCategoryId } });
            return res.status(200).send({ code: 200, message: "Customer Category Updated SuccessFully", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getByIdCustomersubCategory = async (req, res) => {
    try {
        const CustomerCategoryId = req.params.id;
        const getData = await db.customersubcategory.findOne({
            where: { id: CustomerCategoryId, isDeleted: false },
            include: [{
                model: db.customer_category,
                where: { isDeleted: false }

            },
            {
                model: db.entityMaster,
                attributes: ['entity_name']
            },
            {
                model: db.financial_year,
                attributes: ['financial_year']
            }]
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

exports.customerSubCategoryStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await db.customersubcategory.findOne(
            { where: { id: id, isDeleted: false } }
        );
        if (getData) {
            const updated = await db.customersubcategory.update(
                { status },
                { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Customer Sub Category Status Change Successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.deleteCustomerSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const getAllData = await db.customersubcategory.findOne({ where: { id: id } });
        if (getAllData) {
            await db.customersubcategory.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "soft-deleted successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const items = await db.customersubcategory.findAll({
            where: { isDeleted: false, customer_category_id: id },
        });
        if (items.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Sub Customer Category data successfully", data: items });
        } else {
            return res.status(201).send({ code: 201, message: "No Item found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};




