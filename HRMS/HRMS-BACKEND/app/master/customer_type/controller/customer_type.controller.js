const db = require("../../../models/index");

const customer_typeDetails = db.customer_type
const Op = db.Sequelize.Op;

/////////////// Create customer_type ///////////////

exports.create_customer_type = async (req, res) => {
    try {
        const { customer_type_name } = req.body;
        const data = await customer_typeDetails.findOne({where: {customer_type_name: customer_type_name}})
        if(data){
            return res.status(400).send({code: 400, message:"customer_type_name is Already Exists!"})
        } else{
        const response = await customer_typeDetails.create({
            customer_type_name,
        
        });
        return res.status(200).send({ code: 200, message: "customer_type Created Successfully!", data: response });
    }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit customer_type ///////////////

exports.edit_customer_type = async (req, res) => {
    try {
        const customer_typeId = req.params.id;
        const { customer_type_name, status, isChecked } = req.body;
        const editData = await customer_typeDetails.findOne({ where: { customer_type_id: customer_typeId } });
        if (editData) {
            const updateData = await customer_typeDetails.update({
                customer_type_name,
                status,
                isChecked
            },
                { where: { customer_type_id: customer_typeId } });

            return res.status(200).send({ code: 200, message: "customer_type Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};            

// /////////////// Get ById customer_type ///////////////

exports.getAll_customer_type = async (req, res) => {
    try {
        const getAllData = await customer_typeDetails.findAll()
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All customer_type Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById customer_type ///////////////

exports.get_ById_customer_type = async (req, res) => {
    try {
        const customer_typeId = req.params.id;
        const getData = await customer_typeDetails.findOne({ where: { customer_type_id: customer_typeId } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch Get ById Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete customer_type ///////////////

exports.delete_customer_type = async (req, res) => {
    try {
        const customer_typeId = req.params.id;
        const getData = await customer_typeDetails.findOne({ where: { customer_type_id: customer_typeId } });
        if (getData) {
            const updated = await customer_typeDetails.update({ status: "INACTIVE" }, { where: { customer_type_id: customer_typeId } });
            return res.status(200).send({ code: 200, message: "customer_type Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};