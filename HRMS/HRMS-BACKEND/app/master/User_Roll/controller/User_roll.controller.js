const db = require("../../../models/index");
const userRollDetails = db.User_Roll;
const Op = db.Sequelize.Op;

/////////////// Create User_roll///////////////

exports.create_User_roll = async (req, res) => {
    try {
        const {md_ceo, sr_vp, vp, aup,sr_gm, sr_manager, manager, asso_manager, sr_executive, executive,
             asso_executive,agm,gm } = req.body;
        const response = await userRollDetails.create({
            md_ceo,
            sr_vp,
            vp,
            aup,
            sr_gm,
            agm,
            gm,
            sr_manager,
            manager,
            asso_manager,
            sr_executive,
            executive,
            asso_executive
            
        });
        return res.status(200).send({ code: 200, message: "User roll Created Successfully!", data: response });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit Courier_Contains ///////////////

exports.edit_User_roll = async (req, res) => {
    try {
        const user_rollId = req.params.id;
        const {md_ceo, sr_vp, agm,gm, vp, aup,sr_gm, sr_manager, manager, asso_manager, sr_executive, executive, 
            asso_executive } = req.body;
   
        const editData = await userRollDetails.findOne({ where: { userRoll_id: user_rollId } });
        if (editData) {
            const updateData = await userRollDetails.update(
                {
                    md_ceo,
                    sr_vp,
                    vp,
                    aup,
                    sr_gm,
                    agm,
                    gm,
                    sr_manager,
                    manager,
                    asso_manager,
                    sr_executive,
                    executive,
                    asso_executive
                    
                },
                { where: {userRoll_id: user_rollId   } }
            );
            return res.status(200).send({ code: 200, message: "User roll Updated Successfull!", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById User_roll ///////////////

exports.get_ById_User_roll = async (req, res) => {
    try {
        const user_rollId = req.params.id;
        const getData = await userRollDetails.findOne({ where: {userRoll_id: user_rollId  }});
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch User roll data Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get All User_roll///////////////

exports.get_All_User_roll = async (req, res) => {
    try {
        const getData = await userRollDetails.findAll({ where: { status: "ACTIVE" } 
    });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch All User roll Data Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete User_roll ///////////////

exports.delete_User_roll = async (req, res) => {
    try {
        const user_rollId = req.params.id;
        const deleteData = await userRollDetails.findOne({ where: {userRoll_id: user_rollId  } });
        if (deleteData) {
            const dltData = await userRollDetails.update({ status: "INACTIVE" }, { where: {userRoll_id: user_rollId  } });
            return res.status(200).send({ code: 200, message: "User roll Data is Deleted Successfully!", data: dltData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};