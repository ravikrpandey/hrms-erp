const db = require("../../../models/index");
const User = db.user;
const Leave = db.leaveTypes;
const leaveMasterDetails = db.leaveTypesMaster;
const op = db.sequelize.op;
 

/////////////// Create Leave Types Master ///////////////

exports.createLeaveTypesMaster = async (req, res) => {

    try {
        const { leave_id, fromDate, toDate, reason, employee_id,applier_name } = req.body;
        empData = await leaveMasterDetails.findAll({
            limit: 1,
            where: { employee_id: req.body.employee_id, leave_id: req.body.leave_id },
            order: [['createdAt', 'DESC']]
        })
        if (empData.length == 0) {
            var Dataall = await Leave.findOne({ where: { leave_id: req.body.leave_id } })
            const date1 = new Date(fromDate);
            const date2 = new Date(toDate);
            date2.setSeconds(date2.getSeconds() + 10);
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            count = Dataall.number_of_leave
            PkId = Dataall.leave_id
            var remaning_leave = count - diffDays
            
            if (remaning_leave < 0) {
                return res.status(400).send({ code: 400, applied_extra_leave: - remaning_leave, message: "You are not applicable for leave try another leave type" })
            }
            const response = await leaveMasterDetails.create({
                leave_type: Dataall.leave_type,
                fromDate,
                toDate,
                remaning_leave: remaning_leave,
                reason,
                employee_id,
                applier_name,
                leave_id,
                count
            });
            return res.status(200).send({ code: 200, message: "Remaining Leave ", data: response })
        } else if (empData.length != 0) {
            var Dataall = await Leave.findOne({ where: { leave_id: req.body.leave_id } })
            const date1 = new Date(fromDate);
            const date2 = new Date(toDate);
            date2.setSeconds(date2.getSeconds() + 10);
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            var remaning_leaved;
            if (empData[0].remaning_leave) {
                remaning_leaved = empData[0].remaning_leave - diffDays
            }
            if (remaning_leaved < 0) {
                return res.status(400).send({ code: 400, applied_extra_leave: - remaning_leaved, message: "You are not applicable for leave try another leave type" })
            }
            const response = await leaveMasterDetails.create({
                leave_type: Dataall.leave_type,
                applier_name,
                fromDate,
                toDate,
                remaning_leave: remaning_leaved,
                reason,
                employee_id,
                leave_id,
                count: empData[0].remaning_leave
            });
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: response })
        }
        if (leave_id != PkId) {
            var remaning_leave = count - diffDays
            const response = await leaveMasterDetails.create({
                leave_type,
                applier_name,
                fromDate,
                toDate,
                remaning_leave: remaning_leave,
                reason,
                employee_id,
                leave_id,
                count
            });
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: remaning_leave })
        }
        if (leave_id == PkId) {
            if (remaning_leave < 0) {
                return res.status(400).send({ code: 400, message: "You are not aligiable for leave" })
            }
            var remaning_leave = remaning_leave - diffDays
            count = count - remaning_leave
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: remaning_leave })
        }
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.createRemaningLeave = async (req, res) => {
    try {
        const { leave_type, leave_id, fromDate, toDate, reason, employee_id } = req.body;
        let leaveId = parseInt(leave_id)
        let employeeId = parseInt(employee_id)
        
        //Search employee ID in employee leave detail
        empData = await leaveMasterDetails.findAll({
            limit: 1,
            where: { employee_id: employeeId, leave_id: leaveId },
            order: [['createdAt', 'DESC']]
        })
        if (empData.length == 0) {
            var Dataall = await Leave.findOne({ where: { leave_id: req.body.leave_id } })

            count = Dataall.number_of_leave
            PkId = Dataall.leave_id

            return res.status(200).send({ code: 200, message: "Remaining Leave ", data: count })
        } else if (empData.length != 0) {
            var Dataall = await Leave.findOne({ where: { leave_id: leaveId } })
            count = Dataall.number_of_leave
            const date1 = new Date(fromDate);
            const date2 = new Date(toDate);
            date2.setSeconds(date2.getSeconds() + 10);
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            var remaning_leave = empData[0].remaning_leave - diffDays;
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: remaning_leave })
        }
        if (remaning_leave <= 0) {
            return res.status(400).send({ code: 400, message: "You are not aligiable for leave" })
        }
        var remaning_leave = 0;
        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);
        date2.setSeconds(date2.getSeconds() + 10);
        const diffDays = Math.abs(date2 - date1);
        const diffTime = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (leave_id != PkId) {
            var remaning_leave = count - diffDays
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: remaning_leave })
        }
        if (leave_id == PkId) {
            if (remaning_leave < 0) {
                return res.status(400).send({ code: 400, message: "You are not aligiable for leave" })
            }
            var remaning_leave = remaning_leave - diffDays
            count = count - remaning_leave
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: remaning_leave })
        }
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit Leave Types Master ///////////////

exports.editLeaveTypesMaster = async (req, res) => {
    try {
        const leaveMasterId = req.params.id;
        const { leave_type, fromDate, toDate, reason, employee_id, job_title, job_role,
            application_date, department, job_type, exprience, address,
            mode_of_interview, interview_date, remark } = req.body;
        const CL = 7;
        const EL = 18;
        const SL = 7;
        var remaning_leave = 0;

        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);
        const diffDays = (date2.getDate() - date1.getDate())
        if (date1 >= date2) {
            return res.status(400).send({ code: 400, message: "To Date should be after From Date" })
        }
        if (leave_type == "CL") {
            var remaning_leave = CL - diffDays
        } else if (leave_type == "EL") {
            var remaning_leave = EL - diffDays
        } else if (leave_type == "SL") {
            var remaning_leave = SL - diffDays
        } else {
            return res.status(400).send({ code: 400, message: "Invalid Leave Type" })
        }
        const editData = await leaveMasterDetails.findOne({ where: { master_leave_id: leaveMasterId } });
        if (editData) {
            const updateData = await leaveMasterDetails.update(
                {
                    leave_type,
                    fromDate,
                    toDate,
                    remaning_leave: remaning_leave,
                    reason,
                    employee_id
                }, { where: { master_leave_id: leaveMasterId } }
            );
            return res.status(200).send({ code: 200, message: "Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get All Leave Types Master ///////////////

exports.getAllLeaveTypesMaster = async (req, res) => {
    try {
        const getAllData = await leaveMasterDetails.findAll({
    
            include: [{
                model: User,
                attributes: ['first_name', 'personal_email']
            }]
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

/////////////// Get ById Leave Types Master ///////////////

exports.getByIdLeaveTypesMaster = async (req, res) => {
    try {
        const leaveMasterId = req.params.id;
        const leaveMasterData = await leaveMasterDetails.findAll({
            where: { emp_leave_id: leaveMasterId },
            include: [{
                model: User,
                attributes: ['first_name']
            }]
        });
        if (leaveMasterData) {
            return res.status(200).send({ code: 200, message: "Fetch Data Successfully", data: leaveMasterData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get ById Leave Employee ///////////////

exports.getByIdLeaveemployee = async (req, res) => {
    try {
        const leaveMasterId = req.params.id;
        const status = req.body.status || 'ACTIVE'; 

        const leaveMasterData = await leaveMasterDetails.findAll({
            where: { employee_id: leaveMasterId , status: status},
            include: [{
                model: User,
                attributes: ['first_name']
            }]
        });
        if (leaveMasterData) {
            return res.status(200).send({ code: 200, message: "Fetch Data Successfully", data: leaveMasterData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


/////////////// Delete Leave Types Master ///////////////

exports.deleteLeaveTypesMaster = async (req, res) => {
    try {
        const leaveMasterId = req.params.id;
        const dltleaveMaster = await leaveMasterDetails.findOne({ where: { master_leave_id: leaveMasterId } });
        if (dltleaveMaster) {
            const deleteData = await leaveMasterDetails.update({ status: "INACTIVE" }, { where: { master_leave_id: leaveMasterId } });
            return res.status(200).send({ code: 200, message: "requester Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Recorb Not Found" });
        }
    } catch (error) {
         
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updateStatusLeaveTypesMaster = async (req, res) => {
    try {
        const emp_leave_Id = parseInt(req.params.emp_leave_id);
        const { status } = req.body;
        const editData = await leaveMasterDetails.findOne({ where: { emp_leave_id: emp_leave_Id } });
        if (editData) {
            const updateData = await leaveMasterDetails.update(
                {
                    status
                }, { where: { emp_leave_id: emp_leave_Id} }
            );
            return res.status(200).send({ code: 200, message: "Updated Status Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
         
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}
