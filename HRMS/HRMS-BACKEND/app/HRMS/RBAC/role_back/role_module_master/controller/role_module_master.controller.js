const db = require("../../../../../models/index");
const role_module_masterDetails = db.role_module_master;
const op = db.sequelize.op;

exports.createrole_module_master = async (req, res) => {
    try {
        const { role_module_master_name } = req.body;
        const role_module_masterData = await role_module_masterDetails.findOne({ where: { role_module_master_name: role_module_master_name } });   
        if (role_module_masterData) {
            return res.status(403).send({ code: 403, message: "Role Master Name is Already Exists!" });
        } 
        const response = await role_module_masterDetails.create({
                role_module_master_name
            });
            return res.status(200).send({ code: 200, message: "Role Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.getAllrole_module_master = async (req, res) => {
    try {
        const getAllData = await role_module_masterDetails.findAll({
            // where: { status: "ACTIVE" },
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

/////////////// GetById role_module_master ///////////////

exports.getByIdrole_module_master = async (req, res) => {
    try {
        const role_module_masterId = parseInt(req.params.role_module_master_id);
        // const status = "ACTIVE";
        const getData = await role_module_masterDetails.findOne({ where: { role_module_master_id: role_module_masterId} });
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

/////////////// UPDATE role_module_master ///////////////

exports.editrole_module_master = async (req, res) => {
    try {
        const role_module_masterId = parseInt(req.params.role_module_master_id);
        const { role_module_master_name , role_module_master_completed } = req.body;
        const role_module_masterData = await role_module_masterDetails.findOne({ where: { role_module_master_name: role_module_masterId} });   
        const response = await role_module_masterDetails.update({
                role_module_master_name,
                role_module_master_completed
            } , { where: { role_module_master_id: parseInt(req.params.role_module_master_id) } });
            return res.status(200).send({ code: 200, message: "Role Updated Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete role_module_master ///////////////

exports.deleterole_module_master = async (req, res) => {
    try {
        const role_module_masterId = parseInt(req.params.role_module_master_id);
        const dltrole_module_master = await role_module_masterDetails.findOne({ where: { role_module_master_id: role_module_masterId } });
        if (dltrole_module_master) {
            const deleteData = await role_module_masterDetails.update({ status: "INACTIVE" }, { where: { role_module_master_id: role_module_masterId } });
            return res.status(200).send({ code: 200, message: "Role Master Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

