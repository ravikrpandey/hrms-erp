const db = require("../../../models/index");
// const stageDetails = db.stage;
const Designation = db.designation
const op = db.sequelize.op;

exports.createDesignation = async (req, res) => {
    try {
        const { designation_name } = req.body;
        const designationdata = await Designation.findOne({ where: { designation_name: designation_name,isDeleted:false } });
        if (designationdata) {
            return res.status(201).send({ code: 201, message: "Designation Name is Already Exists!" });
        }
        const response = await Designation.create({
            designation_name
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllDesignation = async (req, res) => {
    try {
        const getAllData = await Designation.findAll({
            where: { 
                isDeleted: false,
            },
            attributes: ['designation_id','designation_name','status'],
            order: [['designation_id', 'DESC']],
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

///////////// GetById Stage ///////////////

exports.getByIdDesignation = async (req, res) => {
    try {
        const designation_id = parseInt(req.params.designation_id);
        const getData = await Designation.findOne({ where: { designation_id: designation_id } });
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

/////////////// Delete Stage ///////////////

exports.deleteDesignation = async (req, res) => {
    try {
        const designation_id = parseInt(req.params.designation_id);
        const dltStage = await Designation.findOne({ where: { designation_id: designation_id } });
        if (dltStage) {
            const deleteData = await Designation.update({ isDeleted: true }, { where: { designation_id: designation_id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.editDesignation = async (req, res) => {
    try {
        const designation_id = parseInt(req.params.designation_id);
        const { designation_name } = req.body;
        const dltStage = await Designation.findOne({ where: { designation_id: designation_id } });
        if (dltStage) {
            const designation_namee = await Designation.findOne({ where: { designation_name: designation_name,isDeleted:false,designation_id: { [db.Sequelize.Op.ne]: designation_id } }});
            if (designation_namee) {
                return res.status(409).send({ code: 409, message: "Designation Name is Already Exists!" });
            } else {
                const updateData = await Designation.update(req.body, { where: { designation_id: designation_id } });
                return res.status(200).send({ code: 200, message: "Data is Update Successfully!", data: updateData });
            }
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.update_designationStatus = async (req, res) => {
    try {
        const designationId = req.params.id;
        const { status } = req.body;
        const editData = await Designation.findOne({ where: { designation_id: designationId } });
        if (editData) {
            const updateData = await Designation.update(
                {
                    status
                }, { where: { designation_id: designationId } }
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

exports.desStatus = async (req, res) => {
    try {
        const designation_id = req.params.id;
        const { status } = req.body;
        const getData = await Designation.findOne({
            where: {
                designation_id: designation_id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await Designation.update(
                { status },
                { where: { designation_id: designation_id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};