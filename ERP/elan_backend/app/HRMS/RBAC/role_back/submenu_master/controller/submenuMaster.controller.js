const db = require("../../../../../models/index");
const submenuMasterDetails = db.submenu_master;
const op = db.sequelize.op;
const logger = require('../../../../../../logger/index');

exports.createsubmenuMaster = async (req, res) => {
    try {
        const { submenu_master_name, menu_master_id } = req.body;
        const submenu_masterData = await submenuMasterDetails.findOne({ where: { submenu_master_name: submenu_master_name } });   
        
        if (submenu_masterData) {
            return res.status(403).send({ code: 403, message: "Sub-Menu Master Name is Already Exists!" });
        } 
       
        const response = await submenuMasterDetails.create({
                submenu_master_name,
                menu_master_id
            });
            return res.status(200).send({ code: 200, message: "Submenu Created Successfully", data: response })

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Menu Data Record Not Found" });
    };
};

exports.getAllsubmenuMaster = async (req, res) => {
    try {

        const getAllData = await submenuMasterDetails.findAll({
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

/////////////// GetById submenuMaster ///////////////

exports.getByIdsubmenuMaster = async (req, res) => {
    try {
        const submenuMasterId = parseInt(req.params.submenu_master_id);

        const status = "ACTIVE";
 
        const getData = await submenuMasterDetails.findOne({ where: { submenu_master_id: submenuMasterId , status:status} });
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

/////////////// UPDATE submenuMaster ///////////////

exports.editsubmenuMaster = async (req, res) => {
    try {
        const submenuMasterId = parseInt(req.params.submenu_master_id);
        const { submenu_master_name , menu_master_id , submenu_completed} = req.body;
        const submenu_masterData = await submenuMasterDetails.findOne({ where: { submenu_master_name: submenuMasterId} });   
        // if (submenu_masterData) {
        //     return res.status(403).send({ code: 403, message: "submenu Master Name is Already Exists!" });
        // } 
        const response = await submenuMasterDetails.update({
                submenu_master_name,
                menu_master_id,
                submenu_completed
            } , { where: { submenu_master_id: parseInt(req.params.submenu_master_id) } });
            return res.status(200).send({ code: 200, message: "submenu Updated Successfully", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete submenuMaster ///////////////

exports.deletesubmenuMaster = async (req, res) => {
    try {
        const submenuMasterId = parseInt(req.params.submenu_master_id);
        const dltsubmenuMaster = await submenuMasterDetails.findOne({ where: { submenu_master_id: submenuMasterId } });
        if (dltsubmenuMaster) {
            const deleteData = await submenuMasterDetails.update({ status: "INACTIVE" }, { where: { submenu_master_id: submenuMasterId } });
            return res.status(200).send({ code: 200, message: "Submenu Master Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};