const db = require('../../../../models/index');
const statesDetails = db.states;
const countryssDetails = db.countryss;

exports.createstates = async (req, res) => {
    try {
        const { states_name, countryss_id } = req.body;
        const statesData = await statesDetails.findOne({ where: { states_name: states_name } });
        if (statesData) {
            return res.status(403).send({ code: 403, message: "States Name is Already Exists!" });
        }
        const response = await statesDetails.create({
            states_name, countryss_id
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getStates = async (req, res) => {
    try {
        const id = req.params.countryss_id
        const getData = await statesDetails.findAll({
            where: {
                countryss_id: id
            }
        })
        return res.status(200).send({ code: 200, message: "These are states", data: getData})
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error"})
    }
}

exports.getAllstates = async (req, res) => {
    try {
        const getAllData = await statesDetails.findAll({
            include: [{
                model: countryssDetails,
                attributes: ["countryss_name", "countryss_id"]
            }],
            where :{
                isDeleted :false  
                  }
        })
        if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {
                var getName = getAllData[i].MASTER_COUNTRY.countryss_name;
                var obj = {
                    "states_id": getAllData[i].states_id,
                    "states_name": getAllData[i].states_name,
                    "countryss_id": getAllData[i].countryss_id,
                    "status": getAllData[i].status,
                    "countryss_name": getName
                }
                array.push(obj);
            }
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: array });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.getByIdstates = async (req, res) => {
    try {
        const statesID = parseInt(req.params.states_id);
        const getAllData = await statesDetails.findAll({
            where: { states_id: statesID  },
            include: [{
                model: countryssDetails,
                attributes: ["countryss_name", "countryss_id"]
            }]
        });
        if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {
                var getName = getAllData[i].MASTER_COUNTRY.countryss_name;

                var obj = {
                    "states_id": getAllData[i].states_id,
                    "states_name": getAllData[i].states_name,
                    "countryss_id": getAllData[i].countryss_id,
                    "status": getAllData[i].status,
                    "countryss_name": getName
                }
                array.push(obj);
            }
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: array });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.editstates = async (req, res) => {
    try {
        const states_Id = parseInt(req.params.states_id);
        const { states_name, countryss_id, status } = req.body;
        const getData = await statesDetails.findOne({ where: { states_id: states_Id } });

        const response = await statesDetails.update({
            states_name,
            countryss_id,
            status
        }, { where: { states_id: parseInt(req.params.states_id) } });
        return res.status(200).send({ code: 200, message: "States Updated Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.deletestate = async (req, res) => {
    try {
        const statesId = parseInt(req.params.states_id);
        const dltstates = await statesDetails.findOne({ where: { states_id: statesId } });
        if (dltstates) {
            const deleteData = await statesDetails.update({ status: "INACTIVE" , isDeleted : true }, { where: { states_id: statesId } });
            return res.status(200).send({ code: 200, message: "States Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

// data get on the basis of country id
exports.getstatesbycountryid = async (req, res) => {
    try {
        const countryID = req.params.id;
        const getAllData = await statesDetails.findAll({
            where: { countryss_id: countryID , status: "ACTIVE"},
            include: [{
                model: countryssDetails,
                attributes: ["countryss_name", "countryss_id"]
            }]
        });
        if (getAllData) {
            var array = [];
            for (var i = 0; i < getAllData.length; i++) {
                var getName = getAllData[i].MASTER_COUNTRY.countryss_name;

                var obj = {
                    "states_id": getAllData[i].states_id,
                    "states_name": getAllData[i].states_name,
                    "countryss_id": getAllData[i].countryss_id,
                    "status": getAllData[i].status,
                    "countryss_name": getName
                }
                array.push(obj);
            }
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: array });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.updateStateStatus = async (req, res) => {
    try {
        const state_id = req.params.state_id;
        const { status } = req.body;
        const editData = await statesDetails.findOne({ where: { states_id: state_id } });
        if (editData) {
            const updateData = await statesDetails.update(
                {
                    status
                }, { where: { states_id: state_id } }
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
