const { where } = require("sequelize");
const db = require("../../models/index");

const Grade = db.business_unit_master;
const Op = db.Sequelize.Op;

exports.createBusinessUnit = async (req, res) => {
    try {
        const { businessunit_name, entity_id } = req.body;
        const gradedata = await Grade.findOne({
            where: { businessunit_name, entity_id, isDeleted: 0 },
        });
        if (gradedata) {
            return res
                .status(201)
                .send({ code: 201, message: "Business Unit already exists!" });
        }
        const gradeData = await Grade.create({
            businessunit_name,
            entity_id,
        });
        return res
            .status(200)
            .send({ code: 200, message: "Created successfully", data: gradeData });
    } catch (err) {
        return res.status(500).send({ code: 500, message: "Server error" });
    }
};

exports.businessUnitList = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const gradeData = await Grade.findAll({
            where: { isDeleted: false, entity_id },
            attributes: ["business_unit_id", "businessunit_name", "status"],
            order: [["business_unit_id", "DESC"]],
        });
        if (gradeData) {
            res.status(200).send({
                message: "Business Unit data list fetched successfully",
                data: gradeData,
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ message: "Error", error: err.message });
    }
};

exports.businessUnitById = async (req, res) => {
    const business_unit_id = parseInt(req.params.business_unit_id);
    try {
        const gradeData = await Grade.findOne({
            where: { business_unit_id },
            attributes: ["business_unit_id", "businessunit_name", "status"],
        });
        if (gradeData) {
            res.status(200).send({
                message: "Business Unit fetched successfully",
                data: gradeData,
            });
        }
    } catch (err) {
        res.status(400).send({ message: "Error", error: err.message });
    }
};

exports.businessUnitUpdate = async (req, res) => {
    try {
        const business_unit_id = parseInt(req.params.business_unit_id);
        const { businessunit_name } = req.body;
        const gradeDetails = await Grade.findOne({ where: { business_unit_id } });
        if (gradeDetails) {
            const gradeExists = await Grade.findOne({
                where: { businessunit_name, business_unit_id: { [db.Sequelize.Op.ne]: business_unit_id } },
            });
            if (gradeExists) {
                return res
                    .status(409)
                    .send({ code: 409, message: "Business Unit already exists!" });
            } else {
                const gradeData = await Grade.update(req.body, {
                    where: { business_unit_id },
                });
                return res
                    .status(200)
                    .send({ message: "Business Unit updated successfully", data: gradeData });
            }
        } else {
            return res.status(403).send({ code: 403, message: "Record not found" });
        }
    } catch (err) {
        return res.status(500).send({ code: 500, message: "Server error" });
    }
};

exports.updateBusinessUnitStatus = async (req, res) => {
    try {
        const business_unit_id = parseInt(req.params.business_unit_id);
        const { status } = req.body;
        const editData = await Grade.findOne({ where: { business_unit_id } });
        if (editData) {
            const updateData = await Grade.update(
                { status },
                { where: { business_unit_id } }
            );
            return res.status(200).send({
                code: 200,
                message: "Status updated successfully!",
                data: updateData,
            });
        } else {
            return res.status(400).send({ code: 400, message: "Record not found!" });
        }
    } catch (error) {
        return res
            .status(500)
            .send({ code: 500, message: "Internal server error!" });
    }
};

exports.deleteBusinessUnitById = async (req, res) => {
    const business_unit_id = parseInt(req.params.business_unit_id);
    try {
        const gradeDetails = await Grade.findOne({ where: { business_unit_id } });
        if (gradeDetails) {
            const gradeData = await Grade.update(
                { isDeleted: true },
                {
                    where: { business_unit_id },
                }
            );
            return res
                .status(200)
                .send({ code: 200, message: "Deleted successfully!", data: gradeData });
        } else {
            return res.status(403).send({ code: 403, message: "Record not found!" });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ code: 500, message: "Internal server error!" });
    }
}


module.exports.getActiveBusinessUnit = async (req,res)=>{
    const {entity_id}= req.query
    try{
        const data = await db.business_unit_master.findAll({
            where:{entity_id: entity_id,status:'ACTIVE',isDeleted:false}
        })
        return res.status(200).send({code:200,message :"Data Fetched Successfully!",data});
    }
    catch(err){
        return res.status(500).send({code:500,message:err.message})
    }
}