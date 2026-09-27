const db = require("../../../../../models/index");
const roleMasterDetails = db.role_master;
const op = db.sequelize.op;

exports.createroleMaster = async (req, res) => {
    try {
        const { role_master_name } = req.body;
        const roleMasterData = await roleMasterDetails.findOne({ where: { role_master_name: role_master_name } });
        const designation = await db.designation.findOne({ where: { designation_name: role_master_name } });
        if (roleMasterData && designation) {
            if (roleMasterData.status === 'INACTIVE') {
                await roleMasterDetails.update({ status: 'ACTIVE' }, { where: { role_master_id: roleMasterData.role_master_id } });
                return res.status(200).send({ code: 200, message: "Designation Updated Successfully", data: roleMasterData });
            } else {
                return res.status(403).send({ code: 403, message: "Designation Already Exists!" });
            }
        } else {
            const response = await roleMasterDetails.create({ role_master_name });
            await db.designation.create({ designation_name: role_master_name });
            return res.status(200).send({ code: 200, message: "Designation Created Successfully", data: response });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAllroleMaster = async (req, res) => {
    try {
        const role_master_name = req.params.role_name;
        const getAllData = await roleMasterDetails.findAll({
            where: { status: "ACTIVE" },
        })
        if (role_master_name == "Super Admin") {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            getData = getAllData.filter((role_master_name) => role_master_name.role_master_name !== "Super Admin");
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getData });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// GetById roleMaster ///////////////

exports.getByIdroleMaster = async (req, res) => {
    try {
        const roleMasterId = parseInt(req.params.role_master_id);
        const getData = await roleMasterDetails.findOne({ where: { role_master_id: roleMasterId }, status: "ACTIVE" });
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

/////////////// UPDATE roleMaster ///////////////

exports.editroleMaster = async (req, res) => {
    try {
        const roleMasterId = req.params.role_master_id;
        const { role_master_name } = req.body;
        const role_masterData = await roleMasterDetails.findOne({ where: { role_master_name: roleMasterId } });
        const designation = await db.designation.findOne({ where: { designation_id: roleMasterId } });
        if (!role_masterData && !designation) return res.status(404).send({ code: 404, message: "Data not found!" })

        const response = await roleMasterDetails.update({
            role_master_name
        }, { where: { role_master_id: parseInt(req.params.role_master_id) } });
        await db.designation.update({ designation_name: role_master_name }, { where: { designation_id: roleMasterId } });
        return res.status(200).send({ code: 200, message: "Designation Updated Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

/////////////// Delete roleMaster ///////////////

exports.deleteroleMaster = async (req, res) => {
    try {
        const roleMasterId = parseInt(req.params.role_master_id);
        const dltroleMaster = await roleMasterDetails.findOne({ where: { role_master_id: roleMasterId } });
        const dltdesignation = await db.designation.findOne({ where: { designation_id: roleMasterId } });
        if (dltroleMaster && dltdesignation) {
            const deleteData = await roleMasterDetails.update({ status: "INACTIVE" }, { where: { role_master_id: roleMasterId } });
            const desiData = await db.designation.update({ isDeleted: true, status: "INACTIVE" }, { where: { designation_id: roleMasterId } });
            return res.status(200).send({ code: 200, message: "Role Master Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getByBranchIdroleMaster = async (req, res) => {
    try {
        const branchId = parseInt(req.params.branch_id);
        const getData = await db.user.findAll({ where: { branch_id: branchId }, status: "ACTIVE" });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by Branch ID Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};