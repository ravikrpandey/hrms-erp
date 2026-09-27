const db = require("../../../models/index");
const leaveTypesDetails = db.leaveTypes;
const op = db.sequelize.op;
 


/////////////// Create Leave Types Master ///////////////

// exports.create_Leave_Types = async (req, res) => {
//     try {
//         const { leave_type, number_of_leave, is_carry_forward } = req.body;
//         const leaveData = await leaveTypesDetails.findOne({ where: { leave_type: leave_type } });
//         if (leaveData) {
//             return res.status(403).send({ code: 403, message: "leave Type is Already Exists!" });
//         } else {
//             const response = await leaveTypesDetails.create({
//                 leave_type,
//                 number_of_leave,
//                 is_carry_forward
//             });
//             return res.status(200).send({ code: 200, message: "Created Successfully!", data: response })
//         };
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     };
// };

exports.createLeaveTypes = async (req, res) => {
    try {
        const { leave_type, number_of_leave, is_carry_forward } = req.body;
        const leaveData = await leaveTypesDetails.findOne({ where: { leave_type: leave_type } });
        if (leaveData) {
            return res.status(403).send({ code: 403, message: "leave Type is Already Exists!" });
        } else {
            if (is_carry_forward) {
                let monthLeave = number_of_leave / 12
                const response = await leaveTypesDetails.create({
                    leave_type,
                    number_of_leave,
                    is_carry_forward,
                    leave_in_month: monthLeave
                });
                return res.status(200).send({ code: 200, message: "Created Successfully!", data: response })
            } else {
                const response = await leaveTypesDetails.create({
                    leave_type,
                    number_of_leave,
                    is_carry_forward,
                    leave_in_month: 0
                });
                return res.status(200).send({ code: 200, message: "Created Successfully!", data: response })
            }
        };
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit Leave Types ///////////////

exports.editLeaveTypes = async (req, res) => {
    try {
        const leaveTypeId = req.params.id;
        const leaveData = await leaveTypesDetails.findOne({ where: { leave_id: leaveTypeId } });
        if (leaveData) {
            const updateData = await leaveTypesDetails.update(req.body, { where: { leave_id: leaveTypeId } });
            return res.status(200).send({ code: 200, message: "Updated Successfully", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get All Leave Types ///////////////

exports.getAllLeaveTypes = async (req, res) => {
    try {
        const getAllData = await leaveTypesDetails.findAll({ where: { status: 'ACTIVE' },order: [['leave_id', 'ASC']], })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message||"Server Error" });
    };
};

/////////////// Get ById Leave Types ///////////////

exports.getByIdLeaveTypes = async (req, res) => {
    try {
        const leaveTypeId = req.params.id;
        const getData = await leaveTypesDetails.findOne({ where: { leave_id: leaveTypeId } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete Leave Types ///////////////

exports.deleteLeaveTypes = async (req, res) => {
    try {
        const leaveTypeId = req.params.id;
        const dltleaveData = await leaveTypesDetails.findOne({ where: { leave_id: leaveTypeId } });
        if (dltleaveData) {
            const deleteData = await leaveTypesDetails.destroy({ where: { leave_id: leaveTypeId } });
            return res.status(200).send({ code: 200, message: "leave Type Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Recorb Not Found" });
        }
    } catch (error) {
         
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};