const db = require("../../../models/index");
const transport = require("../../../services/nodemailer");
const Sequelize = require("sequelize");
var bcrypt = require("bcryptjs");
const ServiceCenter = db.Service_Center;


exports.createServiceCenter = async (req, res) => {
    try {
        const { sc_name,contact_person,sc_email, sc_code, sc_gst_no,sc_contact_no,sc_address,entity_id} = req.body;
        var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 14;
        var password = "";
        let link = "https://eliteerp.elitetraveltech.in/auth/login";
        for (var i = 0; i <= passwordLength; i++) { 
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }
        // console.log(req.body);
        // return false;
        const service = await ServiceCenter.findOne({
            where: {
                sc_name,isDeleted:false
            }
        });
        
        if (service) {
            return res.status(403).send({ code: 403, message: "Service Center Already Exists" });
        } else {
            const createData = await ServiceCenter.create({
                sc_name,contact_person,sc_email, sc_code, sc_gst_no,sc_contact_no,sc_address,entity_id,password: bcrypt.hashSync(password, 8),
            });
            // await User.create({
            //     name:sc_name,
            //     employee_official_email:service_center_email,
            //     employee_code:sc_code,
            //     mobile_number:sc_contact_no,
            //     password: bcrypt.hashSync(password, 8)});
            if (createData) {
                info = await transport.mailsend({
                  from: "elitemindz99@gmail.com",
                  to: sc_email,
                  subject: "Elite ERP - Password ",
                  html: `<p><strong>Hi ${sc_name}</strong> <br>Please find your link for Elite ERP login <a href = ${link}>Click Here </a>
                 Your <strong>Official Email Id is</strong> ${sc_email}
                 Your Password is: <strong> ${password} </strong> </p>`,
                });
              }
            return res.status(200).send({ code: 200, message: "Service Created Successfully", data: createData });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" })
    }
}

exports.getAllServiceCenters = async (req, res) => {
    try {
        serviceData = await ServiceCenter.findAll({
            where: {
                isDeleted: false
            }
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get All Service Center data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}
exports.getAllActiveServiceCenters = async (req, res) => {
    try {
        serviceData = await ServiceCenter.findAll({
            where: {
                isDeleted: false,
                status:"ACTIVE",
                entity_id : req.query.entity_id
            }
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get All Service Center data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}


exports.getServiceCenterById = async (req, res) => {
    try {
        const ids = req.params.id;
       const serviceData = await ServiceCenter.findOne({
            where: {
                id: ids,
                isDeleted: false
            }
        });
        if (serviceData) {
            return res.status(200).send({ code: 200, message: "Get Service Center data successfully", data: serviceData });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

exports.updateServiceCenter = async (req, res) => {
    try {
        const id = req.params.id
        if (id) {
            const { sc_name,contact_person,sc_email, sc_code, sc_gst_no,sc_contact_no,sc_address ,entity_id } = req.body;
            const getAllData = await ServiceCenter.findOne({ where: { id: id ,entity_id} });
            if (getAllData) {
                const updateData = await ServiceCenter.update({
                    sc_name,contact_person,sc_email, sc_code, sc_gst_no,sc_contact_no,sc_address,entity_id
                },
                    {
                        where: { id: id }
                    });
                return res.status(200).send({
                    code: 200, message: "Service Center updated Successfully!",
                    data: updateData
                });
            } else {
                return res.status(404).send({ code: 403, message: "Data not found" });
            };
        } else {
            return res.status(404).send({ code: 403, message: "ID not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.deleteServiceCenter = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await ServiceCenter.findOne({ where: { id: id } });
        if (getAllData) {
            await ServiceCenter.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Service Center is Deleted Successfully!", });
        } else {
            return res.status(404).send({ code: 403, message: "Data not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

exports.updateServiceCenterStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const editData = await ServiceCenter.findOne({ where: { id: id } });
        if (editData) {
            const updateData = await ServiceCenter.update(
                {
                    status
                }, { where: { id: id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

function generatePassword(name) {
    const prefix = "SERV";
    const lastFour = name.slice(-4).toLowerCase();
    const password = `${prefix}${lastFour}`;
    return password;
  }