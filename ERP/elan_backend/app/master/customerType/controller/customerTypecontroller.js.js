const db = require("../../../models/index");
const logger = require('../../../../logger/index');


const customer_typeDetails = db.customerType

/////////////// Create customer_type ///////////////

exports.createCustomerType = async (req, res) => {
    try {
        const { customer_type_name, lavel } = req.body;
        const data = await customer_typeDetails.findOne({ where: { customer_type_name: customer_type_name } })
        if (data) {
            return res.status(400).send({ code: 400, message: "customer_type_name is Already Exists!" })
        } else {
            const response = await customer_typeDetails.create({
                customer_type_name, lavel

            });
            await db.productType.create({
                id: response.id, product_type_name: response.customer_type_name, lavel: response.lavel

            });
            return res.status(201).send({ code: 201, message: "customer type Created Successfully!", data: response });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit customer_type ///////////////

exports.editCustomerType = async (req, res) => {
    try {
        const id = req.params.id;
        const { customer_type_name, lavel } = req.body;

        const editData = await customer_typeDetails.findOne({
            where: { id: id }
        });

        if (!editData) {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

        await customer_typeDetails.update(
            { customer_type_name, lavel },
            { where: { id: id } }
        );

        // const updatedCustomerType = await customer_typeDetails.findOne({
        //     where: { id: id }
        // });

        // const productTypeRecord = await db.productType.findOne({
        //     where: { id: id }
        // });

        // if (!productTypeRecord) {
        //     return res.status(404).send({ code: 404, message: "ProductType record not found" });
        // }

        // await db.productType.update(
        //     {
        //         product_type_name: updatedCustomerType.customer_type_name,
        //         lavel: updatedCustomerType.lavel
        //     },
        //     { where: { id: id } }
        // );

        return res.status(200).send({
            code: 200,
            message: "Customer type updated successfully"
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message||"Server Error" });
    }
};



// /////////////// Get ById customer_type ///////////////

exports.getAllCustomerType = async (req, res) => {
    try {
        const getAllData = await customer_typeDetails.findAll({ where: { isDeleted: false } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All customer_type Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
exports.getAllActiveCustomer = async (req, res) => {
    try {
        const getAllData = await customer_typeDetails.findAll({ where: { isDeleted: false, status: "ACTIVE" } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All customer_type Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById customer_type ///////////////

exports.getByIdCustomerType = async (req, res) => {
    try {

        const getData = await customer_typeDetails.findOne({ where: { id: req.params.id } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch Get ById Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete customer_type ///////////////

exports.deleteCustomerType = async (req, res) => {
    try {
        const getData = await customer_typeDetails.findOne({ where: { id: req.params.id } });
        if (getData) {
            const updated = await customer_typeDetails.update({ isDeleted: true }, { where: { id: req.params.id } });
            await db.productType.update({ isDeleted: true, status: "INACTIVE" }, { where: { id: req.params.id } });
            return res.status(200).send({ code: 200, message: "customer Type Data Deleted Successfully!", data: updated });
        } else {
            return res.status(200).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.updateCustomerTypeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const isExist = await customer_typeDetails.findOne({ where: { id: id, isDeleted: false } });
        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Customer Type Not Found!" });
        }
        await customer_typeDetails.update({
            status: status
        }, { where: { id: id } });
        return res.status(200).send({ code: 200, message: "Status Updated Successfully" });
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAllActiveCustomerIndustry = async (req, res) => {
    try {
        const getAllData = await db.customerIndustryType.findAll({ where: { isDeleted: false, status: "ACTIVE" } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All customer_type Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


/////////////// get Customer list by customer_type ///////////////

exports.customerlistBycustomertype = async (req, res) => {
    try {
        const getData = await db.customerProfile.findAll({ where: { customer_type_id: req.params.id, data_status: "Approve" } });

        if (getData.length > 0) {
            return res.status(200).send({ code: 200, message: "customer list fetched successfully.", data: getData });
        } else {
            return res.status(200).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};


/////////////// get all item list by customerType, category, subcatgory ///////////////

exports.customerlistBycustomertype = async (req, res) => {

    let {customer_id, category_id, sub_category_id} = req.query;

    try {
        const getData = await db.customerProfile.findAll({ where: { customer_type_id: req.params.id, data_status: "Approve" } });

        if (getData.length > 0) {
            return res.status(200).send({ code: 200, message: "customer list fetched successfully.", data: getData });
        } else {
            return res.status(200).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};