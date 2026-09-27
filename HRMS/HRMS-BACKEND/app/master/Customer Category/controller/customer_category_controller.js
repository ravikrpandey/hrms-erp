const db = require('../../../models/index');
const CustomerCategoryDetais = db.customer_category;

// /////////////// Create Category ///////////////

exports.createCustomerCategory = async (req, res) => {
    try {
        const { customer_category_name } = req.body;
        const data = await CustomerCategoryDetais.findOne({where: {customer_category_name: customer_category_name}})
        if(data){
            return res.status(400).send({code: 400, message:"Customer Category Name Already Exists!"})
        } else{
            const response = await CustomerCategoryDetais.create({
                customer_category_name
            });
            return res.status(200).send({ code: 200, message: "Customer Category Created Successfully!", data: response });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

// /////////////// Get All Category ///////////////

exports.getAllCustomerCategory = async (req, res) => {
    try {
        const getAllData = await CustomerCategoryDetais.findAll({ where: { status: "ACTIVE" }})
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Customer Category Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


// /////////////// Edit category ///////////////

exports.editCustomerCategory = async (req, res) => {
    try {
        const CustomerCategoryId = req.params.id;
        const editData = await CustomerCategoryDetais.findOne({ where: { customer_category_Id: CustomerCategoryId } });
        if (editData) {
            const updateData = await CustomerCategoryDetais.update(req.body, { where: { customer_category_Id: CustomerCategoryId } });
            return res.status(200).send({ code: 200, message: "Customer Category Updated SuccessFully", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

// /////////////// Get By Id branch ///////////////

exports.getByIdCustomerCategory = async (req, res) => {
    try {
        const CustomerCategoryId = req.params.id;
        const getData = await CustomerCategoryDetais.findOne({ where: { customer_category_Id: CustomerCategoryId } });
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


