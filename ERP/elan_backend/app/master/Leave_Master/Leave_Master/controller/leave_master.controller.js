const db = require("../../../../models/index");
const leavePolicyDetails = db.leavePolicyDetail;
const userDetails = db.user;
const leaveDetails = db.leaveTypes;

/////////////// Create Leave Policy ///////////////

exports.createLeavePolicy = async (req, res) => {
    try {
        const { employee_id, leave_id, fromDate, toDate, applier_name, leaveName, total_leave_count, leaveCount, leave_type, leaveType, leaveUnit, description,
            applicableGender, applicableMaritalStatus, department_name, role_master_name, employee, isLeaveExcide, DurationAllowed,
            MaxLeaveAllowed, LeaveSubmittedBefore, attendance_calender_id, on_date, number_of_hours, start_time, leaveCode } = req.body;
        const empData = await leavePolicyDetails.findAll({
            limit: 1,
            where: { employee_id: req.body.employee_id, leave_id: req.body.leave_id },
            order: [['createdAt', 'DESC']]
        })
        if (empData.length == 0) {
            var Dataall = await leaveDetails.findOne({ where: { leave_id: req.body.leave_id } })
            const date1 = new Date(fromDate);
            const date2 = new Date(toDate);
            date2.setSeconds(date2.getSeconds() + 10);
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const total_leave_count = Dataall.number_of_leave
            PkId = Dataall.leave_id
            var remaning_leave = total_leave_count - diffDays
            if (remaning_leave < 0) {
                return res.status(400).send({ code: 400, applied_extra_leave: - remaning_leave, message: "You are not applicable for leave try another leave type" })
            }
            let accrualLeave = []
            for (let i = 0; i < req.body.accrualLeave?.length; i++) {
                let data = {
                    isAcl: req.body.accrualLeave[i].isAcl,
                    aclLeaveType: req.body.accrualLeave[i].aclLeaveType,
                    aclLeaveOn: req.body.accrualLeave[i].aclLeaveOn,
                    aclLeaveMonth: req.body.accrualLeave[i].aclLeaveMonth,
                }
                accrualLeave.push(data)
            }
            let resetLeave = []
            for (let i = 0; i < req.body.resetLeave?.length; i++) {
                let data = {
                    isRstl: req.body.resetLeave[i].isRstl,
                    rstlLeaveType: req.body.resetLeave[i].rstlLeaveType,
                    rstlLeaveOn: req.body.resetLeave[i].rstlLeaveOn,
                    rstlLeaveMonth: req.body.resetLeave[i].rstlLeaveMonth,
                    rstlCarryFwdValue: req.body.resetLeave[i].rstlCarryFwdValue,
                    rstlCarryFwdUnit: req.body.resetLeave[i].rstlCarryFwdUnit,
                    rstlEncashmentValue: req.body.resetLeave[i].rstlEncashmentValue,
                    rstlEncashmentUnit: req.body.resetLeave[i].rstlEncashmentUnit,
                }
                resetLeave.push(data)
            }
            let creditLeave = []
            for (let i = 0; i < req.body.creditLeave?.length; i++) {
                let data = {
                    isCtrl: req.body.creditLeave[i].isCtrl,
                    ctrlLeaveType: req.body.creditLeave[i].ctrlLeaveType,
                    ctrlLeaveOn: req.body.creditLeave[i].ctrlLeaveOn,
                    ctrllLeaveMonth: req.body.creditLeave[i].ctrllLeaveMonth,
                }
                creditLeave.push(data)
            }
            let prorateLeave = []
            for (let i = 0; i < req.body.prorateLeave?.length; i++) {
                let data = {
                    isPrl: req.body.prorateLeave[i].isPrl,
                    prlLeaveOn: req.body.prorateLeave[i].prlLeaveOn,
                    prlLeaveMonth: req.body.prorateLeave[i].prlLeaveMonth,
                }
                prorateLeave.push(data)
            }
            let openingBalance = []
            for (let i = 0; i < req.body.openingBalance?.length; i++) {
                let data = {
                    isOpnBl: req.body.openingBalance[i].isOpnBl,
                    opnBlValue: req.body.openingBalance[i].opnBlValue,
                }
                openingBalance.push(data)
            }
            let maximumBalance = []
            for (let i = 0; i < req.body.maximumBalance?.length; i++) {
                let data = {
                    isMxBl: req.body.maximumBalance[i].isMxBl,
                    mxBlValue: req.body.maximumBalance[i].mxBlValue,
                }
                maximumBalance.push(data)
            }
            let countAsLeaveBtWeekend = []
            for (let i = 0; i < req.body.countAsLeaveBtWeekend?.length; i++) {
                let data = {
                    isCntLeaveBtwWk: req.body.countAsLeaveBtWeekend[i].isCntLeaveBtwWk,
                    cntLeaveBtwWk: req.body.countAsLeaveBtWeekend[i].cntLeaveBtwWk,
                }
                countAsLeaveBtWeekend.push(data)
            }
            let countAsLeaveBtHoliday = []
            for (let i = 0; i < req.body.countAsLeaveBtHoliday?.length; i++) {
                let data = {
                    isCntLeaveBtwHld: req.body.countAsLeaveBtHoliday[i].isCntLeaveBtwHld,
                    cntLeaveBtwHld: req.body.countAsLeaveBtHoliday[i].cntLeaveBtwHld,
                }
                countAsLeaveBtHoliday.push(data)
            }
            const totalData = await leavePolicyDetails.findAll();
            let leave_code;
            if (leaveCode == "CL") {
                 leave_code = `CL${Number(totalData.length) + 1}`;
            } else if (leaveCode == "EL") {
                 leave_code = `EL${Number(totalData.length) + 1}`;
            } else if (leaveCode == "SL") {
                 leave_code = `SL${Number(totalData.length) + 1}`;
            } 
            const response = await leavePolicyDetails.create({
                attendance_calender_id,
                applier_name,
                leaveName,
                employee_id,
                leave_id,
                total_leave_count,
                leaveCount,
                leaveCode: leave_code,
                fromDate,
                toDate,
                leave_type: Dataall.leave_type,
                leaveType,
                leaveUnit,
                description,
                accrualLeave,
                resetLeave,
                creditLeave,
                prorateLeave,
                openingBalance,
                maximumBalance,
                applicableGender,
                applicableMaritalStatus,
                department_name,
                role_master_name,
                employee,
                countAsLeaveBtWeekend,
                countAsLeaveBtHoliday,
                isLeaveExcide,
                DurationAllowed,
                MaxLeaveAllowed,
                LeaveSubmittedBefore,
                remaning_leave: remaning_leave,
                on_date,
                number_of_hours,
                start_time
            });
            return res.status(200).send({ code: 200, message: "Remaining Leave ", data: response })
        } else if (empData.length != 0) {
            var Dataall = await leaveDetails.findOne({ where: { leave_id: req.body.leave_id } })
            const date1 = new Date(fromDate);
            const date2 = new Date(toDate);
            date2.setSeconds(date2.getSeconds() + 10);
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const total_leave_count = Dataall.number_of_leave
            PkId = Dataall.leave_id
            var remaning_leaved = total_leave_count - diffDays
            if (empData[0].remaning_leave) {
                remaning_leaved = empData[0].remaning_leave - diffDays
            }
            if (remaning_leaved < 0) {
                return res.status(400).send({ code: 400, applied_extra_leave: - remaning_leaved, message: "You are not applicable for leave try another leave type" })
            }
            let accrualLeave = []
            for (let i = 0; i < req.body.accrualLeave?.length; i++) {
                let data = {
                    isAcl: req.body.accrualLeave[i].isAcl,
                    aclLeaveType: req.body.accrualLeave[i].aclLeaveType,
                    aclLeaveOn: req.body.accrualLeave[i].aclLeaveOn,
                    aclLeaveMonth: req.body.accrualLeave[i].aclLeaveMonth,
                }
                accrualLeave.push(data)
            }
            let resetLeave = []
            for (let i = 0; i < req.body.resetLeave?.length; i++) {
                let data = {
                    isRstl: req.body.resetLeave[i].isRstl,
                    rstlLeaveType: req.body.resetLeave[i].rstlLeaveType,
                    rstlLeaveOn: req.body.resetLeave[i].rstlLeaveOn,
                    rstlLeaveMonth: req.body.resetLeave[i].rstlLeaveMonth,
                    rstlCarryFwdValue: req.body.resetLeave[i].rstlCarryFwdValue,
                    rstlCarryFwdUnit: req.body.resetLeave[i].rstlCarryFwdUnit,
                    rstlEncashmentValue: req.body.resetLeave[i].rstlEncashmentValue,
                    rstlEncashmentUnit: req.body.resetLeave[i].rstlEncashmentUnit,
                }
                resetLeave.push(data)
            }
            let creditLeave = []
            for (let i = 0; i < req.body.creditLeave?.length; i++) {
                let data = {
                    isCtrl: req.body.creditLeave[i].isCtrl,
                    ctrlLeaveType: req.body.creditLeave[i].ctrlLeaveType,
                    ctrlLeaveOn: req.body.creditLeave[i].ctrlLeaveOn,
                    ctrllLeaveMonth: req.body.creditLeave[i].ctrllLeaveMonth,
                }
                creditLeave.push(data)
            }
            let prorateLeave = []
            for (let i = 0; i < req.body.prorateLeave?.length; i++) {
                let data = {
                    isPrl: req.body.prorateLeave[i].isPrl,
                    prlLeaveOn: req.body.prorateLeave[i].prlLeaveOn,
                    prlLeaveMonth: req.body.prorateLeave[i].prlLeaveMonth,
                }
                prorateLeave.push(data)
            }
            let openingBalance = []
            for (let i = 0; i < req.body.openingBalance?.length; i++) {
                let data = {
                    isOpnBl: req.body.openingBalance[i].isOpnBl,
                    opnBlValue: req.body.openingBalance[i].opnBlValue,
                }
                openingBalance.push(data)
            }
            let maximumBalance = []
            for (let i = 0; i < req.body.maximumBalance?.length; i++) {
                let data = {
                    isMxBl: req.body.maximumBalance[i].isMxBl,
                    mxBlValue: req.body.maximumBalance[i].mxBlValue,
                }
                maximumBalance.push(data)
            }
            let countAsLeaveBtWeekend = []
            for (let i = 0; i < req.body.countAsLeaveBtWeekend?.length; i++) {
                let data = {
                    isCntLeaveBtwWk: req.body.countAsLeaveBtWeekend[i].isCntLeaveBtwWk,
                    cntLeaveBtwWk: req.body.countAsLeaveBtWeekend[i].cntLeaveBtwWk,
                }
                countAsLeaveBtWeekend.push(data)
            }
            let countAsLeaveBtHoliday = []
            for (let i = 0; i < req.body.countAsLeaveBtHoliday?.length; i++) {
                let data = {
                    isCntLeaveBtwHld: req.body.countAsLeaveBtHoliday[i].isCntLeaveBtwHld,
                    cntLeaveBtwHld: req.body.countAsLeaveBtHoliday[i].cntLeaveBtwHld,
                }
                countAsLeaveBtHoliday.push(data)
            }
            const totalData = await leavePolicyDetails.findAll();
            let leave_code;
            if (leaveCode == "CL") {
                 leave_code = `CL${Number(totalData.length) + 1}`;
            } else if (leaveCode == "EL") {
                 leave_code = `EL${Number(totalData.length) + 1}`;
            } else if (leaveCode == "SL") {
                 leave_code = `SL${Number(totalData.length) + 1}`;
            } 
            const response = await leavePolicyDetails.create({
                attendance_calender_id,
                leaveName,
                employee_id,
                leave_id,
                leaveCount,
                total_leave_count,
                leaveCode: leave_code,
                fromDate,
                toDate,
                leave_type: Dataall.leave_type,
                leaveType,
                leaveUnit,
                description,
                accrualLeave,
                resetLeave,
                creditLeave,
                prorateLeave,
                openingBalance,
                maximumBalance,
                applicableGender,
                applicableMaritalStatus,
                department_name,
                role_master_name,
                employee,
                countAsLeaveBtWeekend,
                countAsLeaveBtHoliday,
                isLeaveExcide,
                DurationAllowed,
                MaxLeaveAllowed,
                LeaveSubmittedBefore,
                remaning_leave: remaning_leaved,
                on_date,
                number_of_hours,
                start_time
            });
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: response })
        }
        if (leave_id != PkId) {
            var remaning_leave = total_leave_count - diffDays
            let accrualLeave = []
            for (let i = 0; i < req.body.accrualLeave?.length; i++) {
                let data = {
                    isAcl: req.body.accrualLeave[i].isAcl,
                    aclLeaveType: req.body.accrualLeave[i].aclLeaveType,
                    aclLeaveOn: req.body.accrualLeave[i].aclLeaveOn,
                    aclLeaveMonth: req.body.accrualLeave[i].aclLeaveMonth,
                }
                accrualLeave.push(data)
            }
            let resetLeave = []
            for (let i = 0; i < req.body.resetLeave?.length; i++) {
                let data = {
                    isRstl: req.body.resetLeave[i].isRstl,
                    rstlLeaveType: req.body.resetLeave[i].rstlLeaveType,
                    rstlLeaveOn: req.body.resetLeave[i].rstlLeaveOn,
                    rstlLeaveMonth: req.body.resetLeave[i].rstlLeaveMonth,
                    rstlCarryFwdValue: req.body.resetLeave[i].rstlCarryFwdValue,
                    rstlCarryFwdUnit: req.body.resetLeave[i].rstlCarryFwdUnit,
                    rstlEncashmentValue: req.body.resetLeave[i].rstlEncashmentValue,
                    rstlEncashmentUnit: req.body.resetLeave[i].rstlEncashmentUnit,
                }
                resetLeave.push(data)
            }
            let creditLeave = []
            for (let i = 0; i < req.body.creditLeave?.length; i++) {
                let data = {
                    isCtrl: req.body.creditLeave[i].isCtrl,
                    ctrlLeaveType: req.body.creditLeave[i].ctrlLeaveType,
                    ctrlLeaveOn: req.body.creditLeave[i].ctrlLeaveOn,
                    ctrllLeaveMonth: req.body.creditLeave[i].ctrllLeaveMonth,
                }
                creditLeave.push(data)
            }
            let prorateLeave = []
            for (let i = 0; i < req.body.prorateLeave?.length; i++) {
                let data = {
                    isPrl: req.body.prorateLeave[i].isPrl,
                    prlLeaveOn: req.body.prorateLeave[i].prlLeaveOn,
                    prlLeaveMonth: req.body.prorateLeave[i].prlLeaveMonth,
                }
                prorateLeave.push(data)
            }
            let openingBalance = []
            for (let i = 0; i < req.body.openingBalance?.length; i++) {
                let data = {
                    isOpnBl: req.body.openingBalance[i].isOpnBl,
                    opnBlValue: req.body.openingBalance[i].opnBlValue,
                }
                openingBalance.push(data)
            }
            let maximumBalance = []
            for (let i = 0; i < req.body.maximumBalance?.length; i++) {
                let data = {
                    isMxBl: req.body.maximumBalance[i].isMxBl,
                    mxBlValue: req.body.maximumBalance[i].mxBlValue,
                }
                maximumBalance.push(data)
            }
            let countAsLeaveBtWeekend = []
            for (let i = 0; i < req.body.countAsLeaveBtWeekend?.length; i++) {
                let data = {
                    isCntLeaveBtwWk: req.body.countAsLeaveBtWeekend[i].isCntLeaveBtwWk,
                    cntLeaveBtwWk: req.body.countAsLeaveBtWeekend[i].cntLeaveBtwWk,
                }
                countAsLeaveBtWeekend.push(data)
            }
            let countAsLeaveBtHoliday = []
            for (let i = 0; i < req.body.countAsLeaveBtHoliday?.length; i++) {
                let data = {
                    isCntLeaveBtwHld: req.body.countAsLeaveBtHoliday[i].isCntLeaveBtwHld,
                    cntLeaveBtwHld: req.body.countAsLeaveBtHoliday[i].cntLeaveBtwHld,
                }
                countAsLeaveBtHoliday.push(data)
            }
            const totalData = await leavePolicyDetails.findAll();
            let leave_code;
            if (leaveCode == "CL") {
                 leave_code = `CL${Number(totalData.length) + 1}`;
            } else if (leaveCode == "EL") {
                 leave_code = `EL${Number(totalData.length) + 1}`;
            } else if (leaveCode == "SL") {
                 leave_code = `SL${Number(totalData.length) + 1}`;
            } 
            const response = await leavePolicyDetails.create({
                attendance_calender_id,
                leaveName,
                employee_id,
                leave_id,
                leaveCount,
                total_leave_count,
                leaveCode: leave_code,
                fromDate,
                toDate,
                leave_type,
                leaveType,
                leaveUnit,
                description,
                accrualLeave,
                resetLeave,
                creditLeave,
                prorateLeave,
                openingBalance,
                maximumBalance,
                applicableGender,
                applicableMaritalStatus,
                department_name,
                role_master_name,
                employee,
                countAsLeaveBtWeekend,
                countAsLeaveBtHoliday,
                isLeaveExcide,
                DurationAllowed,
                MaxLeaveAllowed,
                LeaveSubmittedBefore,
                remaning_leave: remaning_leave,
                on_date,
                number_of_hours,
                start_time
            });
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: remaning_leave })
        }
        if (leave_id == PkId) {
            if (remaning_leave < 0) {
                return res.status(400).send({ code: 400, message: "You are not aligiable for leave" })
            }
            var remaning_leave = remaning_leave - diffDays
            total_leave_count = total_leave_count - remaning_leave
            return res.status(200).send({ code: 200, message: "Created Successfully!", data: remaning_leave })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit Leave Policy ///////////////

exports.editLeavePolicy = async (req, res) => {
    try {
        const leavePolicyId = req.params.leavePolicyId;
        const { leaveName, total_leave_count, fromDate, toDate, leaveType, leaveUnit, description, leaveCode,
            accrualLeave, resetLeave, creditLeave, prorateLeave, openingBalance, maximumBalance, applicableGender,
            applicableMaritalStatus, department_name, role_master_name, employee, countAsLeaveBtWeekend,
            countAsLeaveBtHoliday, isLeaveExcide, DurationAllowed, MaxLeaveAllowed, LeaveSubmittedBefore,
            on_date, number_of_hours, start_time } = req.body;
        const editData = await leavePolicyDetails.findOne({ where: { leavePolicyId: leavePolicyId } });
        if (editData) {
            const updateData = await leavePolicyDetails.update(
                {
                    leaveName,
                    total_leave_count,
                    fromDate,
                    toDate,
                    leaveType,
                    leaveUnit,
                    description,
                    leaveCode,
                    accrualLeave,
                    resetLeave,
                    creditLeave,
                    prorateLeave,
                    openingBalance,
                    maximumBalance,
                    applicableGender,
                    applicableMaritalStatus,
                    department_name,
                    role_master_name,
                    employee,
                    countAsLeaveBtWeekend,
                    countAsLeaveBtHoliday,
                    isLeaveExcide,
                    DurationAllowed,
                    MaxLeaveAllowed,
                    LeaveSubmittedBefore,
                    on_date,
                    number_of_hours,
                    start_time
                },
                { where: { leavePolicyId: leavePolicyId } }
            );
            return res.status(200).send({ code: 200, message: "Leave Policy Updated Successfully!", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

/////////////// Get All Leave Policy ///////////////

exports.getAllLeavePolicy = async (req, res) => {
    try {
        const getAllData = await leavePolicyDetails.findAll({ where: { status: "ACTIVE" } });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Leave Policy Data Successfully!", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

/////////////// Get ById Leave Policy ///////////////

exports.getLeavePolicyById = async (req, res) => {
    try {
        const leavePolicyId = parseInt(req.params.leavePolicyId);
        const getData = await leavePolicyDetails.findOne({ where: { leavePolicyId: leavePolicyId } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch Leave Policy Data Successfully", data: getData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

/////////////// Delete Leave Policy ///////////////

exports.deleteLeavePolicyById = async (req, res) => {
    try {
        const leavePolicyId = req.params.leavePolicyId;
        const getData = await leavePolicyDetails.findOne({ where: { leavePolicyId: leavePolicyId } });
        if (getData) {
            const updated = await leavePolicyDetails.update({ status: "INACTIVE" }, { where: { leavePolicyId: leavePolicyId } });
            return res.status(200).send({ code: 200, message: "Leave Policy Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Note Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};