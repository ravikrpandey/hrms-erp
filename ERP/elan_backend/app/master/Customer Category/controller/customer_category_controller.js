const db = require('../../../models/index');
const CustomerCategoryDetais = db.customer_category;

exports.createCustomerCategory = async (req, res) => {
    try {
        const { customer_category_name, financial_year_id, entity_id } = req.body;
        const data = await CustomerCategoryDetais.findOne(
            { where: { customer_category_name: customer_category_name, isDeleted:false, status: 'ACTIVE' } }
        )
        if (data) {
            return res.status(400).send({ code: 400, message: "Customer Category Name Already Exists!" })
        } else {
            const response = await CustomerCategoryDetais.create({ customer_category_name, financial_year_id, entity_id });
            return res.status(200).send({ code: 200, message: "Customer Category Created Successfully!", data: response });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};


exports.getAllCustomerCategory = async (req, res) => {
    try {
        const getAllData = await CustomerCategoryDetais.findAll({
            where: { isDeleted: false },
            order: [
                ['customer_category_id', 'DESC'],
            ],
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Customer Category Data Successfully!", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};


exports.editCustomerCategory = async (req, res) => {
    try {
        const CustomerCategoryId = req.params.id;
        const { customer_category_name } = req.body;
        const data = await CustomerCategoryDetais.findOne(
            { where: { customer_category_name: customer_category_name, isDeleted:false, status: 'ACTIVE' } }
        )
        if (data) {
            return res.status(400).send({ code: 400, message: "Customer Category Name Already Exists!" })
        }
        const editData = await CustomerCategoryDetais.findOne(
            { where: { customer_category_Id: CustomerCategoryId, isDeleted: false } }
        );
        if (editData) {
            const updateData = await CustomerCategoryDetais.update(req.body, { where: { customer_category_Id: CustomerCategoryId } });
            return res.status(200).send({ code: 200, message: "Customer Category Updated SuccessFully!", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getByIdCustomerCategory = async (req, res) => {
    try {
        const CustomerCategoryId = req.params.id;
        const getData = await CustomerCategoryDetais.findOne({
            where: {
                customer_category_Id: CustomerCategoryId,
                isDeleted: false
            },
            include: [{
                model: db.entityMaster,
                attributes: ['entity_name']
            },
            {
                model: db.financial_year,
                attributes: ['financial_year']
            }]
        });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully!", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.deleteCustomerCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const getAllData = await db.customer_category.findOne({ where: { customer_category_id: id } });
        if (getAllData) {
            await db.customer_category.update({ isDeleted: true }, { where: { customer_category_id: id } });
            return res.status(200).send({ code: 200, message: "soft-deleted successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.customerCategoryStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, type } = req.body;
        const getData = await db.customer_category.findOne(
            { where: { customer_category_id: id, isDeleted: false } }
        );
        if (getData) {
            const fieldName = type === 'status' ? 'status' : 'quotation_scheme_status';
            const updated = await db.customer_category.update(
                { [fieldName]: status },
                { where: { customer_category_id: id } });
            return res.status(200).send({ code: 200, message: "Customer Category Status Change Successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};