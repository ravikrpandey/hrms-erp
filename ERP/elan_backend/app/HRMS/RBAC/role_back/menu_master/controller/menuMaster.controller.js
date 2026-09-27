const db = require("../../../../../models/index");
const menuMasterDetails = db.menu_master;
const submenuMasterDetails = db.submenu_master;
const roleMasterDetails = db.role_master;
const roleMenuAccessDetails = db.role_menu_access;
const op = db.sequelize.op;
const logger = require("../../../../../../logger/index");


exports.createmenuMaster = async (req, res) => {
    try {
        const { menu_master_name, menu_title, role_module_master_id } = req.body;
        const menu_masterData = await menuMasterDetails.findOne({ where: { menu_master_name: menu_master_name } });   
        if (menu_masterData) {
            return res.status(403).send({ code: 403, message: "Menu Master Name is Already Exists!" });
        } 
        const response = await menuMasterDetails.create({
                menu_master_name,
                menu_title,
                role_module_master_id
            });
            return res.status(200).send({ code: 200, message: "Menu Created Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllmenuMaster = async (req, res) => {
    try {
        const getAllData = await menuMasterDetails.findAll({
            where: { status: "ACTIVE" },
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllmenuMasterChild = async (req, res) => {
    try {
            const users = await menuMasterDetails.findAll({ include: submenuMasterDetails });
        if (users) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: users });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


/////////////// GetById menuMaster ///////////////

exports.getByIdmenuMaster = async (req, res) => {
    try {
        const menuMasterId = parseInt(req.params.menu_master_id);

        const status = "ACTIVE";
 
        const getData = await menuMasterDetails.findOne({ where: { menu_master_id: menuMasterId , status:status} });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// UPDATE menuMaster ///////////////

exports.editmenuMaster = async (req, res) => {
    try {
        const menuMasterId = parseInt(req.params.menu_master_id);
        const { menu_master_name , menu_title , menu_completed , role_module_master_id} = req.body;
        const menu_masterData = await menuMasterDetails.findOne({ where: { menu_master_name: menuMasterId} });   
        // if (menu_masterData) {
        //     return res.status(403).send({ code: 403, message: "Menu Master Name is Already Exists!" });
        // } 
        const response = await menuMasterDetails.update({
                menu_master_name,
                menu_title,
                menu_completed,
                role_module_master_id
            } , { where: { menu_master_id: parseInt(req.params.menu_master_id) } });
            return res.status(200).send({ code: 200, message: "Menu Updated Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete menuMaster ///////////////

exports.deletemenuMaster = async (req, res) => {
    try {
        const menuMasterId = parseInt(req.params.menu_master_id);
        const dltmenuMaster = await menuMasterDetails.findOne({ where: { menu_master_id: menuMasterId } });
        if (dltmenuMaster) {
            const deleteData = await menuMasterDetails.update({ status: "INACTIVE" }, { where: { menu_master_id: menuMasterId } });
            return res.status(200).send({ code: 200, message: "Menu Master Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.getByIdroleMaster = async (req, res) => {
    try {
        const menuMasterId = parseInt(req.params.menu_master_id);
        const status = "ACTIVE";
 
        const getData = await menuMasterDetails.findOne({ where: { menu_master_id: menuMasterId , status:status} });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.getAllRoleMasterChild = async (req, res) => {
    let role_master_id= req.params.role_master_id;
    try {
        const users = await roleMenuAccessDetails.findAll({
            where: {role_master_id: role_master_id},
            //  include: submenuMasterDetails 
        });
        if (users) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: users });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};