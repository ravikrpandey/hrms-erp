const db = require("../../../models");
const { runForAllDatabases } = require("../../../utils/runForAllDatabases");

const LeaveEntitlementModel = db.leavePolicyEntitlement;
const EssApplyLeaveDetail = db.essApplyLeaveDetail;
const ApplicabilityAllModel = db.applicabilityAll;
const AppDepartmentsModel = db.appDepartment;
const LeaveMasterModel = db.leave_master;
const userDetails = db.user;
const { Op, fn, col, where, literal } = require('sequelize');
const { log } = require("mathjs");
const leaveMaster = db.leave_master;

// Get employee by entity  
const getAllEmployeesByEntity = async (req, res) => {
    try {

        const allLeaves = await db.user_entity.findAll({
            where: { employee_id: employee_id, isDeleted: false, leaveId: leaveIds },
            include: [
                {
                    model: LeaveMasterModel,
                    where: { isDeleted: false, isDeleted: false },
                    attributes: ['employee_id', 'title', 'employee_code', 'first_name', 'last_name',
                        'gender', 'date_of_birth', 'status', 'parmanent_address']
                }
            ]
        });

        return res.status(200).send({ message: "Employee fetched successfully", data: allLeaves });
    } catch (error) {

        console.error('Error getting leave master:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

// Apply Leave
const applyLeave = async (req, res) => {
    let {
        financial_year_id, leaveFor, documents, startDate, endDate, leaveDays,
        justification, leaveId, departmentId, employee_id, isDeleted, days_details, created_by
    } = req.body;

    const requiredFields = [
        'financial_year_id', 'days_details', 'leaveFor', 'startDate', 'endDate',
        'leaveDays', 'justification', 'leaveId', 'departmentId', 'employee_id', 'isDeleted'
    ];

    for (const field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === null) {
            return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
        }
    }

    const data = db.leavePolicyDetailModel.findOne({
        where: {
            leaveId,
            isDeleted: false
        }
    })

    if (data) {
        const leaveStartDate = new Date(data.startDate);
        const leaveEndDate = new Date(data.endDate);
        const appliedStartDate = new Date(startDate);
        const appliedEndDate = new Date(endDate);

        if (appliedStartDate < leaveStartDate) {
            return res.status(401).send({ message: "You can not apply for this leave before the allotted date" });
        } else if (appliedEndDate > leaveEndDate) {
            return res.status(401).send({ message: "You can not apply for this leave after its end date" });
        }
    }


    try {
        const userExist = await userDetails.findOne({
            where: { employee_id: employee_id, isDeleted: false }
        });

        if (!userExist) {
            return res.status(404).send({ message: 'User not found or is deleted', data: [] });
        }

        const [userRows] = await db.sequelize.query(
            `SELECT MU.employee_id, MU.emp_join_date, MU.primary_entity_id, MU.emp_probation_date
             FROM HRMS_REGISTERED_USER AS MU
             WHERE MU.isDeleted = false AND MU.status = 'ACTIVE' AND MU.employee_id = ${employee_id}`
        );
        const userData = userRows[0];

        if (!userData) {
            return res.status(404).send({ message: "Employee not found", data: {} });
        }

        const [policyDataRows] = await db.sequelize.query(
            `SELECT DISTINCT 
                LPD.includeWeekendHoliday, LPD.isApplAftrProb, LPD.onceInServiceLeave, 
                LPD.id AS policy_id, LPD.leaveId, LPE.from AS applicableFrom
             FROM HRMS_LEAVE_MASTER AS LM
             INNER JOIN HRMS_LEAVE_POLICY_DETAIL AS LPD ON LM.id = LPD.leaveId AND LPD.isDeleted = false
             INNER JOIN HRMS_LEAVE_POLICY_ENTITLEMENT AS LPE ON LM.id = LPE.leaveId AND LPE.isDeleted = false
             INNER JOIN HRMS_LEAVE_POLICY_RESTRICTIONS AS LPR ON LM.id = LPR.leaveId AND LPR.isDeleted = false
             WHERE LM.entity_id = ${userData.primary_entity_id} AND LM.id = ${leaveId} AND LM.isDeleted = false`
        );
        const policyData = policyDataRows[0];

        if (!policyData) {
            return res.status(400).send({
                message: "Leave policy is not fully configured. Please ensure entitlement and restrictions are set up.",
                data: {}
            });
        }

        if (policyData.isApplAftrProb == true && userData.emp_probation_date) {
            const probationEndDate = new Date(userData.emp_probation_date);
            const leaveStartDate = new Date(startDate);
            if (leaveStartDate <= probationEndDate) {
                return res.status(400).send({
                    message: "Leave cannot be applied for dates falling within the probation period.",
                    data: {}
                });
            }
        }
        const leaveExist = await leaveMaster.findOne({ where: { id: leaveId, isDeleted: false } });
        if (!leaveExist) {
            return res.status(404).send({ message: 'Leave type does not exist or is deleted', data: [] });
        }

        const departmentExists = await db.department.findOne({ where: { dept_id: departmentId, isDeleted: false } });
        if (!departmentExists) {
            return res.status(404).send({ message: 'Department does not exist or is deleted', data: [] });
        }

        if (policyData.onceInServiceLeave == true) {
            const existingOnceLeave = await EssApplyLeaveDetail.findOne({
                where: {
                    employee_id: employee_id,
                    leaveId: leaveId,
                    isDeleted: false
                },
                order: [['createdAt', 'ASC']]
            });

            if (existingOnceLeave) {
                if (existingOnceLeave.approval_status == 'APPROVED') {
                    return res.status(400).send({
                        message: "This leave type can only be availed once in a lifetime and has already been utilized!",
                        data: {}
                    });
                } else if (existingOnceLeave.approval_status == 'PENDING' || existingOnceLeave.approval_status == 'PENDING FROM APPROVAL END') {
                    return res.status(400).send({
                        message: "You have already applied for this leave type and it's pending for approval!",
                        data: {}
                    });
                }
            }
        }


        const overlappingLeaves = await EssApplyLeaveDetail.findAll({
            where: {
                employee_id: employee_id,
                isDeleted: false,
                approval_status: "APPROVED",
                [Op.or]: [
                    { approved_start_date: { [Op.between]: [startDate, endDate] } },
                    { approved_end_date: { [Op.between]: [startDate, endDate] } },
                    {
                        approved_start_date: { [Op.lte]: startDate },
                        approved_end_date: { [Op.gte]: endDate }
                    }
                ]
            }
        });
        if (overlappingLeaves.length > 0) {
            return res.status(409).send({ message: 'Leave already exists on the given dates', data: [] });
        }

        const overlappingLeaves_pending = await EssApplyLeaveDetail.findAll({
            where: {
                employee_id: employee_id,
                isDeleted: false,
                approval_status: 'PENDING',
                [Op.or]: [
                    { start_date: { [Op.between]: [startDate, endDate] } },
                    { end_date: { [Op.between]: [startDate, endDate] } },
                    {
                        start_date: { [Op.lte]: startDate },
                        end_date: { [Op.gte]: endDate }
                    }
                ]
            }
        });
        if (overlappingLeaves_pending.length > 0) {
            return res.status(409).send({ message: 'Leave already applied on the given dates', data: [] });
        }

        let leaveInfo = {
            leave_for: leaveFor,
            start_date: startDate,
            end_date: endDate,
            leave_days: leaveDays,
            justification: justification,
            leaveId: leaveId,
            dept_id: departmentId,
            employee_id: employee_id,
            financial_year_id: financial_year_id,
            isDeleted: isDeleted,
            created_by: created_by
        };

        const leaveApplied = await EssApplyLeaveDetail.create(leaveInfo);

        if (leaveFor === "TEAMMATE") {
            // const allotment = await db.hrmsLeaveAllotment.findOne({
            //     where: {
            //         employee_id: employee_id,
            //         leave_id: leaveId,
            //         isDeleted: false
            //     },
            //     attributes: ['no_of_days']
            // });

            // if (!allotment) {
            //     return res.status(201).send({
            //         code: 201,
            //         message: "Leave allotment not found for user!"
            //     });
            // }

            // const currentQuota = allotment.no_of_days;
            // if (currentQuota > 0) {
            //     const new_quota = Math.max(currentQuota - leaveDays, 0);
            //     await db.hrmsLeaveAllotment.update(
            //         { no_of_days: new_quota },
            //         {
            //             where: {
            //                 employee_id: employee_id,
            //                 leave_id: leaveId
            //             }
            //         }
            //     );
            //     console.log(`Updated leave quota from ${currentQuota} to ${new_quota} for employee ${employee_id}`);
            // } else {
            //     console.log(`Leave quota is already 0 for employee ${employee_id}, skipping deduction.`);
            // }

            await db.essApplyLeaveDetail.update({
                approved_start_date: startDate,
                approved_end_date: endDate,
                approved_days: leaveDays,
                approval_status: "APPROVED"
            }, { where: { id: leaveApplied.id } });
        }

        await Promise.all(documents.map(async (leaveDoc) => {
            await db.appliedLeaveDocuments.create({
                uploaded_document: leaveDoc,
                applyDetailId: leaveApplied.id,
            });
        }));

        const created_Days = await Promise.all(days_details.map(async (details) => {
            const { leave_day, leave_date, leave_period, leave_type } = details;
            const day_detail = await db.essLeavedaysDetail.create({
                leave_day, leave_date, leave_period, apply_leave_id: leaveApplied.id, leave_type
            });
            return day_detail;
        }));

        return res.status(200).send({
            message: 'Leave has been applied successfully',
            data: leaveApplied,
            created_Days
        });

    } catch (error) {
        console.error('Error processing leave application:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


// Get All Applied Leaves For Employee 
const getAllAppliedLeavesForEmployee = async (req, res) => {
    try {
        let { entity_id, employee_id, allLeaves } = req.query;

        const requiredFields = ['employee_id', 'allLeaves'];
        for (const field of requiredFields) {
            if (req.query[field] === undefined || req.query[field] === null) {
                return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
            }
        }
        const leaveMasters = await LeaveMasterModel.findAll({
            where: {
                isDeleted: false,
                status: "ACTIVE",
                entity_id: entity_id
            }
        });
        let leaveIds = leaveMasters.map(leaveMaster => leaveMaster.id);

        if (allLeaves === 'true') {
            const allEmployeesLeaves = await EssApplyLeaveDetail.findAll({
                where: { isDeleted: false, leaveId: leaveIds },
                include: [
                    {
                        model: LeaveMasterModel,
                        attributes: ['leave_name', 'total_available'],
                    },
                    {
                        model: userDetails,
                        attributes: ['employee_id', 'first_name', 'last_name', 'gender'],
                    }]

            });
            return res.status(200).send({ message: "Applied leaves by employees fetched successfully!", data: allEmployeesLeaves });
        } else {
            let allEmployeeLeaves = await EssApplyLeaveDetail.findAll({
                where: { employee_id: employee_id, isDeleted: false, leaveId: leaveIds },
                include: [
                    {
                        model: LeaveMasterModel,
                        attributes: ['leave_name', 'total_available'],
                    },
                    {
                        model: userDetails,
                        attributes: ['employee_id', 'first_name', 'last_name', 'gender'],
                    }]
            });
            const report_managr = await db.user.findOne({ where: { employee_id, status: "ACTIVE", isDeleted: false }, attributes: ["reporting_manager_id"] });
            const approval_details = await db.user.findOne({ where: { employee_id: report_managr.reporting_manager_id, status: "ACTIVE", isDeleted: false }, attributes: ["first_name", "last_name"] });
            allEmployeeLeaves.forEach(leave => {
                leave.dataValues.approval_details = approval_details;
            });
            return res.status(200).send({ message: "All leaves fetched for employee Successfully!", data: allEmployeeLeaves });
        }
    } catch (error) {

        console.error('Error getting leave master:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

// Get Applied Leave By Employee Id  
const getAllAppliedLeaveById = async (req, res) => {

    let { employee_id, appliedLeaveId, entity_id } = req.query;
    const requiredFields = ['employee_id', 'appliedLeaveId', 'entity_id'];
    for (const field of requiredFields) {
        if (req.query[field] === undefined || req.query[field] === null) {
            return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
        }
    }
    try {
        const appliedLeaveById = await EssApplyLeaveDetail.findAll({
            where: { id: appliedLeaveId, employee_id: employee_id },
            include: [{
                model: LeaveMasterModel,
                attributes: ['id', 'leave_name', 'leave_code', 'total_available']
            }]
        });

        if (!appliedLeaveById) {
            return res.status(200).send({ message: `Leave not found`, data: [] });
        }

        const leaveAvailable = await LeaveMasterModel.findAll({
            where: {
                id: appliedLeaveById[0]?.leaveId,
                entity_id: entity_id
            }
        });
        if (leaveAvailable.length == 0) {
            return res.status(400).send({ message: 'Leave not available', data: {} });
        }


        const appliedLeaveDetails = appliedLeaveById.map(detail => detail.toJSON());
        const documentsData = await db.appliedLeaveDocuments.findAll({
            where: { applyDetailId: appliedLeaveId, isDeleted: false }
        });

        const documents = documentsData.map(document => document.toJSON());
        // const days_details = await db.essLeavedaysDetail.findAll({ where: { apply_leave_id: appliedLeaveId, isDeleted: false } });
        const days_details = await db.essLeavedaysDetail.findAll({
            where: {
                apply_leave_id: appliedLeaveId,
                isDeleted: false
            },
            order: [['leave_date', 'ASC']]  // Sorting by leave_date in ascending order
        });

        appliedLeaveDetails.forEach(detail => {
            detail.documents = documents.filter(doc => doc.applyDetailId === detail.id),
                detail.days_details = days_details;
        });

        return res.status(200).send({ message: "Applied leave deails fetched Successfully!", data: appliedLeaveDetails });
    } catch (error) {

        console.error('Error getting leave master:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }

};
// /////////////////////////Cron Job For Leave Allotment Starts////////////////////////////

// const chunkArray = (array, size) => {
//     const result = [];
//     for (let i = 0; i < array.length; i += size) {
//         result.push(array.slice(i, i + size));
//     }
//     return result;
// };

// const BATCH_SIZE = 20;

// const cronForLeaveAllotment = async (req, res) => {
//     try {
//         const today = new Date();
//         const todayDay = today.getDate();
//         const todayMonth = today.getMonth() + 1;
//         const todayYear = today.getFullYear();

//         // Leap year check
//         const isLeapYear = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));

//         const isFeb28InNonLeapYear = todayDay === 28 && todayMonth === 2 && !isLeapYear(todayYear);

//         let dateMatchCondition = `
//         (EXTRACT(DAY FROM MU.emp_join_date) = :todayDay
//          AND EXTRACT(MONTH FROM MU.emp_join_date) = :todayMonth)
//          `;

//         if (isFeb28InNonLeapYear) {
//             dateMatchCondition += `
//         OR (
//             EXTRACT(DAY FROM MU.emp_join_date) = 29
//             AND EXTRACT(MONTH FROM MU.emp_join_date) = 2
//         )
//        `;
//         }
//         const usersDOJ = await db.sequelize.query(
//             `SELECT MU.employee_id, MU.emp_join_date, MU.primary_entity_id
//              FROM HRMS_REGISTERED_USER AS MU
//              WHERE MU.isDeleted = false 
//              AND MU.status = 'ACTIVE'
//              AND (${dateMatchCondition})
//              AND EXTRACT(YEAR FROM MU.emp_join_date) < :todayYear`,
//             {
//                 replacements: { todayDay, todayMonth, todayYear },
//                 type: db.Sequelize.QueryTypes.SELECT,
//             }
//         );
//         const userDOJChunks = chunkArray(usersDOJ, BATCH_SIZE);

//         for (const chunk of userDOJChunks) {
//             const promises = chunk.map(async (employee) => {
//                 try {
//                     const { employee_id, primary_entity_id } = employee;

//                     const leaveAllot = await db.sequelize.query(
//                         `SELECT DISTINCT 
//                   LM.total_available AS total_leaves,
//                   LM.id AS leave_id,
//                   LM.entity_id,
//                   LPE.from AS applicable_from,
//                   LPE.carry_unused_leaves,
//                   LPE.unused_leaves_mode,
//                   LPE.carry_unused_limit,
//                   LPD.onceInServiceLeave
//                FROM HRMS_LEAVE_MASTER AS LM
//                INNER JOIN HRMS_LEAVE_POLICY_DETAIL AS LPD ON LM.id = LPD.leaveId AND LPD.isDeleted = false
//                INNER JOIN HRMS_LEAVE_POLICY_ENTITLEMENT AS LPE ON LM.id = LPE.leaveId AND LPE.isDeleted = false
//                INNER JOIN HRMS_LEAVE_POLICY_RESTRICTIONS AS LPR ON LM.id = LPR.leaveId AND LPR.isDeleted = false
//                WHERE LM.entity_id = :entityId AND LM.isDeleted = false AND LPE.from = 'DOJ'`,
//                         {
//                             replacements: { entityId: primary_entity_id },
//                             type: db.Sequelize.QueryTypes.SELECT,
//                         }
//                     );

//                     if (!leaveAllot.length) return;

//                     const updatedLeaveAllot = [];

//                     for (const leave of leaveAllot) {

//                         if (leave.onceInServiceLeave) {
//                             console.log(`Skipping leave_id ${leave.leave_id} for employee ${employee_id} (onceInServiceLeave is true)`);
//                             continue;
//                         }

//                         let adjusted_leaves = Math.round(leave.total_leaves);

//                         if (
//                             leave.carry_unused_leaves &&
//                             leave.carry_unused_limit &&
//                             leave.unused_leaves_mode
//                         ) {
//                             const [existingAllotment] = await db.sequelize.query(
//                                 `SELECT no_of_days FROM HRMS_USER_LEAVE_ALLOTMENT
//                    WHERE employee_id = :employeeId AND leave_id = :leaveId AND isDeleted = false AND status = 'ACTIVE'
//                    ORDER BY createdAt DESC LIMIT 1`,
//                                 {
//                                     replacements: {
//                                         employeeId: employee_id,
//                                         leaveId: leave.leave_id
//                                     },
//                                     type: db.Sequelize.QueryTypes.SELECT,
//                                 }
//                             );

//                             if (existingAllotment && existingAllotment.no_of_days > 0) {
//                                 const unusedLeaves = parseFloat(existingAllotment.no_of_days);

//                                 if (leave.unused_leaves_mode === 'UNIT') {
//                                     adjusted_leaves += Math.min(unusedLeaves, leave.carry_unused_limit);
//                                 } else if (leave.unused_leaves_mode === 'PERCENT') {
//                                     const percentValue = (unusedLeaves * leave.carry_unused_leaves) / 100;
//                                     adjusted_leaves += Math.min(percentValue, leave.carry_unused_limit);
//                                 }
//                             }
//                         }

//                         updatedLeaveAllot.push({
//                             leave_id: leave.leave_id,
//                             adjusted_leaves: Math.round(adjusted_leaves),
//                         });
//                     }

//                     await db.hrmsLeaveAllotment.destroy({
//                         where: {
//                             employee_id,
//                             leave_id: updatedLeaveAllot.map(l => l.leave_id),
//                         },
//                     });

//                     const allotmentData = updatedLeaveAllot.map(leave => ({
//                         no_of_days: leave.adjusted_leaves,
//                         leave_id: leave.leave_id,
//                         employee_id,
//                     }));

//                     await db.hrmsLeaveAllotment.bulkCreate(allotmentData);
//                     console.log(`DOJ Leave allotment done for employee ${employee_id}`);
//                 } catch (err) {
//                     console.error(`Error processing DOJ user ${employee.employee_id}:`, err);
//                 }
//             });

//             await Promise.allSettled(promises);
//         }

//         //JAN-DEC Leave Allotment
//         if (today.getDate() === 1 && today.getMonth() === 0) {
//             const allUsers = await db.sequelize.query(
//                 `SELECT MU.employee_id, MU.primary_entity_id, MU.emp_join_date
//                  FROM HRMS_REGISTERED_USER AS MU
//                  WHERE MU.isDeleted = false AND MU.status = 'ACTIVE'`,
//                 { type: db.Sequelize.QueryTypes.SELECT }
//             );

//             const userChunks = chunkArray(allUsers, BATCH_SIZE);

//             for (const chunk of userChunks) {
//                 const promises = chunk.map(async (employee) => {
//                     try {
//                         const { employee_id, primary_entity_id, emp_join_date } = employee;
//                         const dojYear = new Date(emp_join_date).getFullYear();
//                         if (todayYear <= dojYear) {
//                             console.log(`Skipping JAN-DEC allotment for employee ${employee_id}, DOJ year ${dojYear}`);
//                             return;
//                         }
//                         const leaveAllot = await db.sequelize.query(
//                             `SELECT DISTINCT 
//                     LM.total_available AS total_leaves,
//                     LM.id AS leave_id,
//                     LM.entity_id,
//                     LPE.from AS applicable_from,
//                     LPE.carry_unused_leaves,
//                     LPE.unused_leaves_mode,
//                     LPE.carry_unused_limit,
//                     LPD.onceInServiceLeave
//                  FROM HRMS_LEAVE_MASTER AS LM
//                  INNER JOIN HRMS_LEAVE_POLICY_DETAIL AS LPD ON LM.id = LPD.leaveId AND LPD.isDeleted = false
//                  INNER JOIN HRMS_LEAVE_POLICY_ENTITLEMENT AS LPE ON LM.id = LPE.leaveId AND LPE.isDeleted = false
//                  INNER JOIN HRMS_LEAVE_POLICY_RESTRICTIONS AS LPR ON LM.id = LPR.leaveId AND LPR.isDeleted = false
//                  WHERE LM.entity_id = :entityId AND LM.isDeleted = false AND LPE.from = 'JAN-DEC'`,
//                             {
//                                 replacements: { entityId: primary_entity_id },
//                                 type: db.Sequelize.QueryTypes.SELECT,
//                             }
//                         );

//                         if (!leaveAllot.length) return;

//                         const updatedLeaveAllot = [];

//                         for (const leave of leaveAllot) {

//                             if (leave.onceInServiceLeave) {
//                                 console.log(`Skipping leave_id ${leave.leave_id} for employee ${employee_id} (onceInServiceLeave is true)`);
//                                 continue;
//                             }
//                             let adjusted_leaves = Math.round(leave.total_leaves);

//                             if (
//                                 leave.carry_unused_leaves &&
//                                 leave.carry_unused_limit &&
//                                 leave.unused_leaves_mode
//                             ) {
//                                 const [existingAllotment] = await db.sequelize.query(
//                                     `SELECT no_of_days FROM HRMS_USER_LEAVE_ALLOTMENT
//                      WHERE employee_id = :employeeId AND leave_id = :leaveId AND isDeleted = false AND status = 'ACTIVE'
//                      ORDER BY createdAt DESC LIMIT 1`,
//                                     {
//                                         replacements: {
//                                             employeeId: employee_id,
//                                             leaveId: leave.leave_id
//                                         },
//                                         type: db.Sequelize.QueryTypes.SELECT,
//                                     }
//                                 );

//                                 if (existingAllotment && existingAllotment.no_of_days > 0) {
//                                     const unusedLeaves = parseFloat(existingAllotment.no_of_days);

//                                     if (leave.unused_leaves_mode === 'UNIT') {
//                                         adjusted_leaves += Math.min(unusedLeaves, leave.carry_unused_limit);
//                                     } else if (leave.unused_leaves_mode === 'PERCENT') {
//                                         const percentValue = (unusedLeaves * leave.carry_unused_leaves) / 100;
//                                         adjusted_leaves += Math.min(percentValue, leave.carry_unused_limit);
//                                     }
//                                 }
//                             }

//                             updatedLeaveAllot.push({
//                                 leave_id: leave.leave_id,
//                                 adjusted_leaves: Math.round(adjusted_leaves),
//                             });
//                         }

//                         await db.hrmsLeaveAllotment.destroy({
//                             where: {
//                                 employee_id,
//                                 leave_id: updatedLeaveAllot.map(l => l.leave_id),
//                             },
//                         });

//                         const allotmentData = updatedLeaveAllot.map(leave => ({
//                             no_of_days: leave.adjusted_leaves,
//                             leave_id: leave.leave_id,
//                             employee_id,
//                         }));

//                         await db.hrmsLeaveAllotment.bulkCreate(allotmentData);
//                         console.log(`JAN-DEC Leave allotment done for employee ${employee_id}`);
//                     } catch (err) {
//                         console.error(`Error processing JAN-DEC user ${employee.employee_id}:`, err);
//                     }
//                 });

//                 await Promise.allSettled(promises);
//             }
//         }

//         return res.status(200).send({
//             message: "Leave allotment job completed sucessfully!",
//         });

//     } catch (error) {
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Server Error"
//         });
//     }
// };
// /////////////////////////Cron Job For Leave Allotment Ends////////////////////////////

///////////
/////////////////////////Cron Job For Leave Allotment Starts////////////////////////////

const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const BATCH_SIZE = 20;

const cronForLeaveAllotment = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] 🚀 Starting Leave Allotment Cron...`);

    await runForAllDatabases(async (tenantName, tenantModels, tenantSequelize) => {
      const dbName = tenantSequelize?.config?.database || tenantName;
      console.log(`[${new Date().toISOString()}] 🔧 Running for DB: ${dbName}`);

      const sequelize = tenantSequelize;
      const Sequelize = tenantModels?.Sequelize || require("sequelize");

      const today = new Date();
      const todayDay = today.getDate();
      const todayMonth = today.getMonth() + 1;
      const todayYear = today.getFullYear();

      const isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      const isFeb28InNonLeapYear = todayDay === 28 && todayMonth === 2 && !isLeapYear(todayYear);

      let dateMatchCondition = `
        (EXTRACT(DAY FROM MU.emp_join_date) = :todayDay
         AND EXTRACT(MONTH FROM MU.emp_join_date) = :todayMonth)
      `;

      if (isFeb28InNonLeapYear) {
        dateMatchCondition += `
          OR (
            EXTRACT(DAY FROM MU.emp_join_date) = 29
            AND EXTRACT(MONTH FROM MU.emp_join_date) = 2
          )
        `;
      }

      // === DOJ BASED ALLOTMENT ===
      const usersDOJ = await sequelize.query(
        `SELECT MU.employee_id, MU.emp_join_date, MU.primary_entity_id
         FROM HRMS_REGISTERED_USER AS MU
         WHERE MU.isDeleted = false 
         AND MU.status = 'ACTIVE'
         AND (${dateMatchCondition})
         AND EXTRACT(YEAR FROM MU.emp_join_date) < :todayYear`,
        {
          replacements: { todayDay, todayMonth, todayYear },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      const userDOJChunks = chunkArray(usersDOJ, BATCH_SIZE);

      for (const chunk of userDOJChunks) {
        const promises = chunk.map(async (employee) => {
          try {
            const { employee_id, primary_entity_id } = employee;

            const leaveAllot = await sequelize.query(
              `SELECT DISTINCT 
                LM.total_available AS total_leaves,
                LM.id AS leave_id,
                LM.entity_id,
                LPE.from AS applicable_from,
                LPE.carry_unused_leaves,
                LPE.unused_leaves_mode,
                LPE.carry_unused_limit,
                LPD.onceInServiceLeave,
                LPD.isQuotaAllotedMonthly
              FROM HRMS_LEAVE_MASTER AS LM
              INNER JOIN HRMS_LEAVE_POLICY_DETAIL AS LPD ON LM.id = LPD.leaveId AND LPD.isDeleted = false
              INNER JOIN HRMS_LEAVE_POLICY_ENTITLEMENT AS LPE ON LM.id = LPE.leaveId AND LPE.isDeleted = false
              INNER JOIN HRMS_LEAVE_POLICY_RESTRICTIONS AS LPR ON LM.id = LPR.leaveId AND LPR.isDeleted = false
              WHERE LM.entity_id = :entityId AND LM.isDeleted = false AND LPE.from = 'DOJ'`,
              {
                replacements: { entityId: primary_entity_id },
                type: Sequelize.QueryTypes.SELECT,
              }
            );

            if (!leaveAllot.length) return;

            const updatedLeaveAllot = [];

            for (const leave of leaveAllot) {
              if (leave.onceInServiceLeave) {
                console.log(`[${tenantName}] Skipping leave_id ${leave.leave_id} for employee ${employee_id} (onceInServiceLeave)`);
                continue;
              }

              let adjusted_leaves = Math.round(leave.total_leaves);

              if (leave.carry_unused_leaves && leave.unused_leaves_mode) {
                const [existingAllotment] = await sequelize.query(
                  `SELECT available_days FROM HRMS_USER_LEAVE_ALLOTMENT
                   WHERE employee_id = :employeeId AND leave_id = :leaveId AND isDeleted = false AND status = 'ACTIVE'
                   ORDER BY createdAt DESC LIMIT 1`,
                  {
                    replacements: { employeeId: employee_id, leaveId: leave.leave_id },
                    type: Sequelize.QueryTypes.SELECT,
                  }
                );

                if (existingAllotment && existingAllotment.available_days > 0) {
                  const unused = parseFloat(existingAllotment.available_days);

                  if (leave.unused_leaves_mode === "UNIT") {
                    adjusted_leaves += Math.min(unused, leave.carry_unused_leaves);
                  } else if (leave.unused_leaves_mode === "PERCENT") {
                    const percentValue = Math.floor((unused * leave.carry_unused_leaves) / 100);
                    adjusted_leaves += Math.min(percentValue, leave.carry_unused_limit || percentValue);
                  }
                }
              }

              updatedLeaveAllot.push({
                leave_id: leave.leave_id,
                adjusted_leaves: Math.round(adjusted_leaves),
              });
            }

            await tenantModels.hrmsLeaveAllotment.destroy({
              where: {
                employee_id,
                leave_id: updatedLeaveAllot.map((l) => l.leave_id),
              },
            });

            const allotmentData = updatedLeaveAllot.map((leave) => {
              const policy = leaveAllot.find((p) => p.leave_id === leave.leave_id);
              const total = Math.round(policy?.total_leaves || 0);
              const carry = leave.adjusted_leaves - total;

              return {
                no_of_days: leave.adjusted_leaves,
                available_days: carry > 0 ? carry : leave.adjusted_leaves,
                leave_id: leave.leave_id,
                employee_id,
              };
            });

            await tenantModels.hrmsLeaveAllotment.bulkCreate(allotmentData);
            console.log(`[${tenantName}] ✅ DOJ Leave allotment done for employee ${employee_id}`);
          } catch (err) {
            console.error(`[${tenantName}] ❌ Error processing DOJ user ${employee.employee_id}:`, err.message);
          }
        });

        await Promise.allSettled(promises);
      }

      console.log(`[${new Date().toISOString()}] ✅ Completed Leave Allotment for ${tenantName}`);
    });

    return res.status(200).send({
      message: "Leave allotment job completed successfully for all databases!",
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Fatal error:`, error.message);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};




/////////////



//////////////////////////////Monthly Leave Cron/////////////////////
const moment = require('moment');

const cronMonthlyLeaveAllotment = async (req, res) => {
  const today = moment().format("YYYY-MM-DD");
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  const isFirstOfMonth = moment().date() === 1;

  if (!isFirstOfMonth) {
    const msg = `Not the 1st of the month. Skipping leave allotment on: ${today}`;
    console.log(msg);
    return res.status(200).json({ success: false, message: msg });
  }

  try {
    console.log(`[${today}] 🚀 Starting Monthly Leave Allotment Cron...`);

    await runForAllDatabases(async (tenantName, tenantDb, sequelize) => {
      console.log(`\n🏢 Processing leave allotment for: ${tenantName}`);

      // Fetch policies that are monthly quota based
      const [leavePolicies] = await sequelize.query(`
        SELECT 
          LPD.leaveId,
          LPD.isQuotaAllotedMonthly,
          LPD.entity_id,
          LM.total_available
        FROM HRMS_LEAVE_POLICY_DETAIL AS LPD
        INNER JOIN HRMS_LEAVE_MASTER AS LM ON LM.id = LPD.leaveId
        WHERE LPD.isDeleted = 0
      `);

      if (!leavePolicies.length) {
        console.log(`[${tenantName}] ⚠️ No leave policies found.`);
        return;
      }

      for (const policy of leavePolicies) {
        const { leaveId, isQuotaAllotedMonthly, total_available, entity_id } = policy;

        if (!isQuotaAllotedMonthly) continue;

        const [employees] = await sequelize.query(`
          SELECT RU.employee_id 
          FROM HRMS_REGISTERED_USER AS RU
          WHERE RU.primary_entity_id = ${entity_id} 
            AND RU.isDeleted = 0 
            AND RU.status = 'ACTIVE'
        `);

        if (!employees.length) {
          console.log(`[${tenantName}] ⚠️ No active employees for entity ${entity_id}`);
          continue;
        }

        const employeeBatches = chunkArray(employees, BATCH_SIZE);

        for (const batch of employeeBatches) {
          await Promise.all(
            batch.map(async (emp) => {
              const employee_id = emp.employee_id;

              const [existing] = await sequelize.query(`
                SELECT * FROM HRMS_USER_LEAVE_ALLOTMENT 
                WHERE employee_id = ${employee_id} 
                  AND leave_id = ${leaveId} 
                  AND isDeleted = 0
              `);

              if (!existing.length) return;

              const current = existing[0];
              const monthlyDays = parseFloat(total_available) / 12;
              const updatedDays = parseFloat(current.available_days || 0) + monthlyDays;

              await sequelize.query(`
                UPDATE HRMS_USER_LEAVE_ALLOTMENT 
                SET available_days = ${updatedDays}, updatedAt = '${now}' 
                WHERE id = ${current.id}
              `);

              console.log(`[${tenantName}] ✅ Updated monthly leave for EmpID: ${employee_id}, LeaveID: ${leaveId}`);
            })
          );
        }
      }

      console.log(`[${tenantName}] ✅ Monthly leave allotment completed.`);
    });

    const msg = `✅ Monthly leave allotment executed successfully for all databases on: ${today}`;
    console.log(msg);
    return res.status(200).json({ success: true, message: msg });
  } catch (error) {
    console.error("❌ Error in monthly leave allotment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

/////////////////////////////

///////////////////////




const cronForCompOffDaily = async (req, res) => {
  const today = moment().format("YYYY-MM-DD");
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    console.log(`[${today}] 🚀 Starting Daily Comp-Off Credit Job...`);

    await runForAllDatabases(async (tenantName, tenantDb, sequelize) => {
      console.log(`\n🏢 Processing Comp-Off for: ${tenantName}`);

      // Step 1: Get "Comp Off" Leave IDs per entity
      const [compOffLeaves] = await sequelize.query(`
        SELECT id, entity_id 
        FROM HRMS_LEAVE_MASTER 
        WHERE LOWER(leave_name) = 'comp off' 
          AND isDeleted = 0
      `);

      if (!compOffLeaves.length) {
        console.log(`[${tenantName}] ⚠️ No Comp Off leave type configured.`);
        return;
      }

      // Step 2: Fetch Comp Off assignments joined with employees
      const [assignments] = await sequelize.query(`
        SELECT 
          ACO.id AS comp_id,
          ACO.entity_id,
          ACO.from_date,
          ACO.to_date,
          ACOE.employee_id
        FROM HRMS_ASSIGN_COMPOFF ACO
        INNER JOIN HRMS_ASSIGN_COMPOFF_EMPLOYEE ACOE 
          ON ACO.id = ACOE.comp_id
        WHERE ACO.isDeleted = 0
      `);

      if (!assignments.length) {
        console.log(`[${tenantName}] ⚠️ No Comp Off assignments found.`);
        return;
      }

      let totalCredits = 0;

      // Step 3: Process each assignment
      for (const item of assignments) {
        const { employee_id, from_date, to_date, entity_id, comp_id } = item;

        const compOffLeave = compOffLeaves.find(l => l.entity_id === entity_id);
        if (!compOffLeave) continue;

        const compOffLeaveId = compOffLeave.id;
        let current = moment(from_date);
        const end = moment(to_date);

        while (current <= end) {
          const dateStr = current.format("YYYY-MM-DD");

          // Step 4: Check if already credited
          const [logCheck] = await sequelize.query(
            `
            SELECT id 
            FROM HRMS_COMPOFF_CREDIT_LOG 
            WHERE employee_id = ? 
              AND leave_id = ? 
              AND compoff_date = ? 
              AND comp_id = ?
          `,
            { replacements: [employee_id, compOffLeaveId, dateStr, comp_id] }
          );

          if (logCheck.length === 0) {
            // Step 5: Check attendance master
            const [master] = await sequelize.query(
              `
              SELECT id 
              FROM ESS_DAILY_ATTENDANCE_MASTER 
              WHERE employee_id = ? 
                AND att_date = ? 
                AND isDeleted = 0 
                AND attendance_status = 'P'
            `,
              { replacements: [employee_id, dateStr] }
            );

            const isPresent = master.length > 0;

            if (isPresent) {
              // Step 6: Update or insert leave allotment
              const [existing] = await sequelize.query(
                `
                SELECT * 
                FROM HRMS_USER_LEAVE_ALLOTMENT 
                WHERE employee_id = ? 
                  AND leave_id = ? 
                  AND isDeleted = 0
              `,
                { replacements: [employee_id, compOffLeaveId] }
              );

              if (existing.length > 0) {
                const updated = parseFloat(existing[0].available_days || 0) + 1;
                await sequelize.query(
                  `
                  UPDATE HRMS_USER_LEAVE_ALLOTMENT 
                  SET available_days = ?, updatedAt = ? 
                  WHERE id = ?
                `,
                  { replacements: [updated, now, existing[0].id] }
                );
              } else {
                await sequelize.query(
                  `
                  INSERT INTO HRMS_USER_LEAVE_ALLOTMENT 
                  (employee_id, leave_id, available_days, createdAt, updatedAt, isDeleted) 
                  VALUES (?, ?, 1, ?, ?, 0)
                `,
                  { replacements: [employee_id, compOffLeaveId, now, now] }
                );
              }

              // Step 7: Log the credit
              await sequelize.query(
                `
                INSERT INTO HRMS_COMPOFF_CREDIT_LOG 
                (employee_id, leave_id, compoff_date, comp_id, createdAt, updatedAt, isDeleted, status) 
                VALUES (?, ?, ?, ?, ?, ?, 0, 'ACTIVE')
              `,
                { replacements: [employee_id, compOffLeaveId, dateStr, comp_id, now, now] }
              );

              totalCredits++;
              console.log(
                `[${tenantName}] ✅ Comp Off credited for employee ${employee_id} on ${dateStr}`
              );
            }
          }

          current.add(1, "day");
        }
      }

      console.log(`[${tenantName}] ✅ Completed Comp Off credit. Total: ${totalCredits} credits`);
    });

    const message = `✅ Comp Off credited successfully across all databases for ${today}`;
    console.log(message);
    return res.status(200).json({ success: true, message });

  } catch (error) {
    console.error("❌ Error in Comp Off daily allotment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

////////////////

const cronForCompOffExpiry = async (req, res) => {
  const today = moment().format("YYYY-MM-DD");
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    console.log(`[${today}] 🚀 Starting Comp Off Expiry Job...`);

    await runForAllDatabases(async (tenantName, tenantDb, sequelize) => {
      console.log(`\n🏢 Processing Comp Off Expiry for: ${tenantName}`);

      // Step 1: Get Comp Off Leave IDs per entity
      const [compOffLeaveTypes] = await sequelize.query(`
        SELECT id, entity_id 
        FROM HRMS_LEAVE_MASTER
        WHERE LOWER(leave_name) = 'comp off' 
          AND isDeleted = 0
      `);

      if (!compOffLeaveTypes.length) {
        console.log(`[${tenantName}] ⚠️ No Comp Off leave type configured.`);
        return;
      }

      let totalExpired = 0;

      // Step 2: Iterate through each entity’s Comp Off leave type
      for (const leaveType of compOffLeaveTypes) {
        const { id: leaveId, entity_id } = leaveType;

        // Fetch all active, unexpired comp off credits older than 60 days
        const [credits] = await sequelize.query(
          `
          SELECT log.id AS log_id, log.employee_id, log.compoff_date
          FROM HRMS_COMPOFF_CREDIT_LOG AS log
          INNER JOIN HRMS_REGISTERED_USER AS user 
            ON log.employee_id = user.employee_id
          WHERE log.leave_id = ?
            AND log.isDeleted = 0
            AND log.status = 'ACTIVE'
            AND log.isExpired = 0
            AND user.primary_entity_id = ?
            AND log.compoff_date <= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
          ORDER BY log.compoff_date ASC
        `,
          { replacements: [leaveId, entity_id] }
        );

        if (!credits.length) continue;

        // Step 3: Fetch used leave days to check against credits
        const [usedLeaveDaysAll] = await sequelize.query(
          `
          SELECT detail.employee_id, days.leave_date
          FROM ESS_APPLIED_LEAVE_DAYS_DETAIL AS days
          INNER JOIN ESS_APPLIED_LEAVE_DETAIL AS detail 
            ON days.apply_leave_id = detail.id
          INNER JOIN HRMS_REGISTERED_USER AS RU 
            ON RU.employee_id = detail.employee_id
          WHERE detail.isDeleted = 0
            AND days.isDeleted = 0
            AND RU.primary_entity_id = ?
            AND detail.leaveId = ?
            AND days.deduction_done = 1
          ORDER BY days.leave_date ASC
        `,
          { replacements: [entity_id, leaveId] }
        );

        // Step 4: Group used leave dates by employee
        const usedLeaveMap = {};
        for (const day of usedLeaveDaysAll) {
          if (!usedLeaveMap[day.employee_id]) {
            usedLeaveMap[day.employee_id] = [];
          }
          usedLeaveMap[day.employee_id].push(day.leave_date);
        }

        // Step 5: Loop through credits and mark expired if unused
        for (const credit of credits) {
          const { log_id, employee_id, compoff_date } = credit;
          const leaveDates = usedLeaveMap[employee_id] || [];

          // Find if this comp off was used after it was credited
          let leaveMatchIndex = -1;
          for (let i = 0; i < leaveDates.length; i++) {
            const leaveDate = moment(leaveDates[i]);
            if (leaveDate.isAfter(moment(compoff_date))) {
              leaveMatchIndex = i;
              break;
            }
          }

          if (leaveMatchIndex !== -1) {
            // Consume this leave date (FIFO)
            leaveDates.splice(leaveMatchIndex, 1);
          } else {
            // Mark as expired
            await sequelize.query(
              `
              UPDATE HRMS_COMPOFF_CREDIT_LOG
              SET isExpired = 1, expiredAt = ?, updatedAt = ?
              WHERE id = ?
            `,
              { replacements: [now, now, log_id] }
            );

            // Deduct from user's available leave balance
            await sequelize.query(
              `
              UPDATE HRMS_USER_LEAVE_ALLOTMENT
              SET available_days = GREATEST(available_days - 1, 0), updatedAt = ?
              WHERE employee_id = ? 
                AND leave_id = ? 
                AND isDeleted = 0
            `,
              { replacements: [now, employee_id, leaveId] }
            );

            totalExpired++;
            console.log(
              `[${tenantName}] ⚰️ Expired Comp Off for employee ${employee_id} (${compoff_date})`
            );
          }
        }
      }

      console.log(`[${tenantName}] ✅ Expiry completed. Total expired: ${totalExpired}`);
    });

    const message = `✅ Comp Off expiry completed successfully across all databases for ${today}`;
    console.log(message);
    return res.status(200).json({ success: true, message });

  } catch (error) {
    console.error("❌ Error in Comp Off expiry cron:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


////////////




////////////////////////////



// const getAllLeavesByFilter = async (req, res) => {
//     try {
//         const {
//             financial_id, department_id, employeeId, entity_id,
//             designation_id, gender_id, marital_id, location_id
//         } = req.query;
//         const requiredFields = ['employeeId', 'entity_id', 'financial_id'];
//         for (const field of requiredFields) {
//             if (!req.query[field]) {
//                 return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
//             }
//         }

//         const user = await db.user.findOne({
//             where: { employee_id: employeeId, isDeleted: false },
//             attributes: ['start_working_date', 'emp_probation_date']
//         });
//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         const [leaveAllotments] = await db.sequelize.query(
//             `SELECT LM.leave_name,LM.leave_code,LM.leave_code,total_available,LM.entity_id,LM.entity_id, ULA.employee_id,ULA.leave_id,no_of_days,available_days
//            FROM HRMS_USER_LEAVE_ALLOTMENT AS ULA
//            INNER JOIN HRMS_LEAVE_MASTER AS LM ON LM.id = ULA.leave_id AND LM.entity_id = ${entity_id}
//            WHERE ULA.isDeleted = false AND ULA.status = 'ACTIVE' AND ULA.employee_id = ${employeeId}
//            ORDER BY ULA.id DESC`
//         );

//         for (const allotment of leaveAllotments) {
//             const leaveId = allotment.leave_id;

//             const leaveStats = await EssApplyLeaveDetail.findAll({
//                 where: {
//                     leaveId,
//                     isDeleted: false,
//                     employee_id: employeeId,
//                     financial_year_id: financial_id
//                 },
//                 attributes: [
//                     [db.sequelize.fn('SUM', db.sequelize.col('leave_days')), 'total_days'],
//                     [db.sequelize.fn('SUM', db.sequelize.literal(`CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`)), 'total_approved_days']
//                 ]
//             });

//             const totalDays = leaveStats[0]?.get('total_days') || 0;
//             const totalApproved = leaveStats[0]?.get('total_approved_days') || 0;

//             allotment.total_leave_applied = totalDays;
//             allotment.total_approved_days = totalApproved;
//         }

//         return res.status(200).send({
//             message: "User's leave data fetched successfully!",
//             data: leaveAllotments
//         });

//     } catch (error) {
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Server Error"
//         });
//     }
// };
const getAllLeavesByFilter = async (req, res) => {
    try {
        const {
            financial_id, employeeId,
            
        } = req.query;
        // removed the entity id as teammates in leave apply section has different enityt id so data was not fetching properly
        const requiredFields = ['employeeId','financial_id'];
        for (const field of requiredFields) {
            if (!req.query[field]) {
                return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
            }
        }

        const user = await db.user.findOne({
            where: { employee_id: employeeId, isDeleted: false },
            attributes: ['start_working_date', 'emp_probation_date', 'gender', 'marital_status']
        });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Fetch all gender/marital applicability data
        const genderApplicable = await db.appGender.findAll({
            where: { isDeleted: false },
            attributes: ['leaveId', 'gender']
        });

        const maritalApplicable = await db.appMarital.findAll({
            where: { isDeleted: false },
            attributes: ['leaveId', 'marital']
        });

        const userGender = user.gender?.toLowerCase();
        const userMarital = user.marital_status?.toLowerCase();

        const [leaveAllotments] = await db.sequelize.query(
            `SELECT LM.leave_name, LM.leave_code, total_available, 
             ULA.employee_id, ULA.leave_id, no_of_days, available_days
             FROM HRMS_USER_LEAVE_ALLOTMENT AS ULA
             INNER JOIN HRMS_LEAVE_MASTER AS LM ON LM.id = ULA.leave_id
             WHERE ULA.isDeleted = false AND ULA.status = 'ACTIVE' AND ULA.employee_id = ${employeeId}
             ORDER BY ULA.id DESC`
        );

        // Filter based on gender & marital applicability
        const filteredAllotments = leaveAllotments.filter(allotment => {
            const leaveId = allotment.leave_id;

            // Get allowed genders and maritals for this leaveId
            const genderList = genderApplicable
                .filter(g => g.leaveId === leaveId)
                .map(g => g.gender?.toLowerCase());

            const maritalList = maritalApplicable
                .filter(m => m.leaveId === leaveId)
                .map(m => m.marital?.toLowerCase());

            const genderMatch = genderList.length === 0 || genderList.includes(userGender);
            const maritalMatch = maritalList.length === 0 || maritalList.includes(userMarital);

            return genderMatch && maritalMatch;
        });

        for (const allotment of filteredAllotments) {
            const leaveId = allotment.leave_id;

            const leaveStats = await EssApplyLeaveDetail.findAll({
                where: {
                    leaveId,
                    isDeleted: false,
                    employee_id: employeeId,
                    financial_year_id: financial_id
                },
                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('leave_days')), 'total_days'],
                    [db.sequelize.fn('SUM', db.sequelize.literal(`CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`)), 'total_approved_days']
                ]
            });

            const totalDays = leaveStats[0]?.get('total_days') || 0;
            const totalApproved = leaveStats[0]?.get('total_approved_days') || 0;

            allotment.total_leave_applied = totalDays;
            allotment.total_approved_days = totalApproved;
        }

        return res.status(200).send({
            message: "User's leave data fetched successfully!",
            data: filteredAllotments
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

module.exports = { getAllLeavesByFilter };

// // Get Available Leave for department and Applied leaves count for employee  
// const getAllLeavesByFilter = async (req, res) => {
//     try {
//         let date = new Date();
//         let today = date.toISOString().split('T')[0];

//         let { department_id, employeeId, entity_id, designation_id, gender_id, marital_id, location_id } = req.query;

//         // Validation checks
//         const requiredFields = ['role_id', 'department_id', 'employeeId', 'entity_id', 'designation_id', 'gender_id', 'marital_id', 'location_id'];
//         for (const field of requiredFields) {
//             if (req.query[field] === undefined || req.query[field] === null) {
//                 return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
//             }
//         }

//         const user = await db.user.findOne({
//             where: { employee_id: employeeId, isDeleted: false },
//             attributes: ['start_working_date', 'emp_probation_date']
//         });

//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         let entitlementCondition;
//         const dateOfJoining = user.start_working_date;
//         let daysSinceJoining = Math.floor((new Date() - new Date(dateOfJoining)) / (1000 * 60 * 60 * 24));
//         daysSinceJoining += 1;
//         const endOfProbation = user.emp_probation_date;
//         let daysSinceEndProbation = Math.floor((new Date() - new Date(endOfProbation)) / (1000 * 60 * 60 * 24));


//         const leaveMasters = await LeaveMasterModel.findAll({
//             where: { isDeleted: false, status: 'ACTIVE', entity_id: entity_id },
//             include: [
//                 {
//                     model: db.leavePolicyDetailModel,
//                     where: { startDate: { [Op.lte]: today }, [Op.or]: [{ endDate: { [Op.gte]: today } }, { endDate: null }] },
//                     required: true, attributes: []
//                 },
//                 {
//                     model: LeaveEntitlementModel,
//                     where: entitlementCondition,
//                     required: true, attributes: []
//                 }
//             ]
//         });


//         let leaveIds = leaveMasters.map(leaveMaster => leaveMaster.id);
//         // Fetch leaveIds from the Leave Master table
//         const leaveMasterData = await LeaveMasterModel.findAll({
//             where: { id: leaveIds, isDeleted: false },
//             include: [
//                 {
//                     model: AppDepartmentsModel,
//                     where: { dept_id: department_id, isDeleted: false }, attributes: []
//                 },
//                 {
//                     model: db.appDesignation,
//                     where: { designation_id: designation_id, isDeleted: false }, attributes: []
//                 },
//                 {
//                     model: db.appGender,
//                     where: { gender: gender_id, isDeleted: false }, attributes: []
//                 },
//                 {
//                     model: db.appMarital,
//                     where: { marital: marital_id, isDeleted: false }, attributes: []
//                 },
//                 {
//                     model: db.appLocation,
//                     where: { locationId: location_id, isDeleted: false }, attributes: []
//                 }]
//         });


//         // Loop through departmentLeaves to fetch total leave days for each leaveId
//         for (let i = 0; i < leaveMasterData.length; i++) {
//             const item = leaveMasterData[i];
//             let leaveId = item.id;

//             // Fetch and sum leave_days for the current leaveId
//             const leaveDetails = await EssApplyLeaveDetail.findAll({
//                 where: { leaveId: leaveId, isDeleted: false, employee_id: employeeId },
//                 attributes: [
//                     [db.sequelize.fn('SUM', db.sequelize.col('leave_days')), 'total_days'],
//                     [db.sequelize.fn('SUM', db.sequelize.literal(`CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`)), 'total_approved_days']
//                 ]
//             });

//             const totalDays = leaveDetails[0] && leaveDetails[0].get('total_days') !== null ?
//                 leaveDetails[0].get('total_days') : 0;

//             const totalApprovedDays = leaveDetails[0] && leaveDetails[0].get('total_approved_days') !== null ?
//                 leaveDetails[0].get('total_approved_days') : 0;

//             // Add total_days and total_approved_days to the HRMS_LEAVE_MASTER object
//             if (item.dataValues) {
//                 item.dataValues.total_leave_applied = totalDays;
//                 item.dataValues.total_approved_days = totalApprovedDays;
//             }

//         }


//         // Fetching the leave applied for all the departments
//         const forAllLeaves = await ApplicabilityAllModel.findAll({
//             where: { isDeleted: false, leaveId: leaveIds },
//             include: { model: LeaveMasterModel }
//         });

//         // Loop through departmentLeaves to fetch total leave days for each leaveId
//         for (let i = 0; i < forAllLeaves.length; i++) {
//             const item = forAllLeaves[i];
//             let leaveId = item.leaveId;

//             const leaveDetails = await EssApplyLeaveDetail.findAll({
//                 where: { leaveId: leaveId, isDeleted: false, employee_id: employeeId },
//                 attributes: [
//                     [db.sequelize.fn('SUM', db.sequelize.col('leave_days')), 'total_days'],
//                     [db.sequelize.fn('SUM', db.sequelize.literal(`CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`)), 'total_approved_days']
//                 ]
//             });

//             const totalDays = leaveDetails[0] && leaveDetails[0].get('total_days') !== null ?
//                 leaveDetails[0].get('total_days') : 0;

//             const totalApprovedDays = leaveDetails[0] && leaveDetails[0].get('total_approved_days') !== null ?
//                 leaveDetails[0].get('total_approved_days') : 0;

//             if (item.HRMS_LEAVE_MASTER) {
//                 item.HRMS_LEAVE_MASTER.dataValues.total_leave_applied = totalDays;
//                 item.HRMS_LEAVE_MASTER.dataValues.total_approved_days = totalApprovedDays;

//             }
//         }
//         let combinedLeaves = [...leaveMasterData, ...forAllLeaves.map(leave => leave.HRMS_LEAVE_MASTER)];
//         return res.status(200).send({ message: "Leaves available for the department fetched successfully!", data: combinedLeaves });
//     } catch (error) {

//         console.error('Error getting leave master:', error);
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// };

// Get Available Leave for department and Applied leaves count for employee  
// const getEffectiveAppliedLeave = async (req, res) => {
//     try {
//         let date = new Date();
//         let today = date.toISOString().split('T')[0];

//         let { employeeId, entity_id, leaveId } = req.query;

//         // Fetch user details (date of joining and end of probation)
//         const user = await db.user.findOne({
//             where: { employee_id: employeeId, isDeleted: false },
//             attributes: ['start_working_date', 'emp_probation_date']
//         });

//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         const dateOfJoining = user.start_working_date;
//         const endOfProbation = user.emp_probation_date;

//         // Calculate the number of days since joining and end of probation
//         let daysSinceJoining = Math.floor((new Date() - new Date(dateOfJoining)) / (1000 * 60 * 60 * 24)) + 1;
//         let daysSinceEndProbation = Math.floor((new Date() - new Date(endOfProbation)) / (1000 * 60 * 60 * 24));

//         const entitlement = await db.leavePolicyEntitlement.findOne({
//             where: {
//                 leaveId: leaveId,
//                 isDeleted: false,
//                 from: 'DOJ'
//             },
//             attributes: ['effective_value', 'effective_period', 'effective_duration', 'from']
//         });

//         if(daysSinceJoining < entitlement.effective_duration){
//             return res.status(401).send({ code: 401, message: "You are not eligible to apply" });

//         }

//         let entitlementCondition;

//         // If today is before the end of probation
//         if (new Date(today) < new Date(endOfProbation)) {
//             entitlementCondition = {
//                 effective_duration: { [Op.lt]: daysSinceJoining },
//                 from: 'DOJ',
//                 leaveId: leaveId
//             };
//         }
//         // If today is on or after the end of probation
//         else {
//             entitlementCondition = {
//                 [Op.or]: [
//                     { effective_duration: { [Op.lt]: daysSinceJoining }, from: 'DOJ' },
//                     { effective_duration: { [Op.lt]: daysSinceEndProbation }, from: 'DOC' }
//                 ],
//                 leaveId: leaveId
//             };
//         }

//         // Fetch leave master with leave policy details and entitlement conditions
//         const leaveMasters = await LeaveMasterModel.findOne({
//             where: { isDeleted: false, status: 'ACTIVE', entity_id: entity_id },
//             include: [
//                 {
//                     model: db.leavePolicyDetailModel,
//                     where: {
//                         startDate: { [Op.lte]: today },
//                         [Op.or]: [{ endDate: { [Op.gte]: today } }, { endDate: null }]
//                     },
//                     required: true,
//                     attributes: []
//                 },
//                 {
//                     model: LeaveEntitlementModel,
//                     where: entitlementCondition,
//                     required: true,
//                     attributes: []
//                 }
//             ]
//         });

//         if (!leaveMasters) {
//             const leaveData = await LeaveMasterModel.findOne({
//                 where: { isDeleted: false, status: 'ACTIVE', entity_id: entity_id },
//                 include: [
//                     {
//                         model: db.leavePolicyDetailModel,
//                         where: { leaveId: leaveId },
//                         required: true,
//                         attributes: []
//                     },
//                     {
//                         model: LeaveEntitlementModel,
//                         where: { leaveId: leaveId },
//                         required: true,
//                         attributes: ['effective_value', 'effective_period', 'from']
//                     }
//                 ]
//             });
//            leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period = leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period.charAt(0) + leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period.slice(1).toLowerCase();
//             return res.status(200).send({ code: 200, flag: false, message: `This leave policy effective after ${leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_value} ${leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period} from ${leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].from}` });
//         }

//         return res.status(200).send({ code: 200, flag: true, message: "Leaves available for the department fetched successfully!", data: leaveMasters });
//     } catch (error) {
//         console.error('Error getting leave master:', error);
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// };

const getEffectiveAppliedLeave = async (req, res) => {
    try {
        let today = new Date().toISOString().split('T')[0];
        let { employeeId, entity_id, leaveId } = req.query;

        // Step 1: Fetch user details
        const user = await db.user.findOne({
            where: { employee_id: employeeId, isDeleted: false },
            attributes: ['emp_join_date', 'emp_probation_date']
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const doj = new Date(user.emp_join_date);
        const endOfProbation = new Date(user.emp_probation_date);
        const daysSinceJoining = Math.floor((new Date() - doj) / (1000 * 60 * 60 * 24));

        // Step 2: Get the entitlement restriction
        const entitlement = await db.leavePolicyEntitlement.findOne({
            where: {
                leaveId: leaveId,
                isDeleted: false,
                from: 'DOJ'
            },
            attributes: ['effective_value', 'effective_period', 'effective_duration', 'from']
        });

        // Step 3: Apply restriction check
        if (entitlement) {
            const requiredDays = parseInt(entitlement.effective_duration);

            if (daysSinceJoining < requiredDays) {
                return res.status(400).send({
                    code: 400,
                    flag: false,
                    message: `You can apply for this leave only after ${requiredDays} days from your Date of Joining (${doj.toISOString().split('T')[0]}).`
                });
            }
        }

        // Step 4: Continue with fetching leave master and return success
        const leaveMasters = await LeaveMasterModel.findOne({
            where: { isDeleted: false, status: 'ACTIVE', entity_id: entity_id },
            include: [
                {
                    model: db.leavePolicyDetailModel,
                    where: {
                        startDate: { [Op.lte]: today },
                        [Op.or]: [{ endDate: { [Op.gte]: today } }, { endDate: null }]
                    },
                    required: true,
                    attributes: []
                },
                {
                    model: LeaveEntitlementModel,
                    where: { leaveId: leaveId },
                    required: true,
                    attributes: []
                }
            ]
        });

        if (!leaveMasters) {
            return res.status(404).send({
                code: 404,
                flag: false,
                message: 'Leave master not found or entitlement not valid for today.'
            });
        }

        return res.status(200).send({
            code: 200,
            flag: true,
            message: "Leaves available for the department fetched successfully!",
            data: leaveMasters
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};






const updateAppliedLeaveById = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const {
            leaveFor, startDate, endDate, leaveDays, justification,
            leaveId, departmentId, employee_id, documents, days_details
        } = req.body;

        const requiredFields = ['leaveFor', 'startDate', 'endDate', 'leaveDays', 'justification', 'leaveId', 'departmentId', 'employee_id'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
            }
        }

        const userExist = await userDetails.findOne({
            where: { employee_id, isDeleted: false }
        });

        if (!userExist) {
            return res.status(404).send({ message: 'User not found or is deleted', data: [] });
        }

        const [userRows] = await db.sequelize.query(
            `SELECT MU.employee_id, MU.emp_join_date, MU.primary_entity_id, MU.emp_probation_date
       FROM HRMS_REGISTERED_USER AS MU
       WHERE MU.isDeleted = false AND MU.status = 'ACTIVE' AND MU.employee_id = ${employee_id}`
        );
        const userData = userRows[0];

        if (!userData) {
            return res.status(404).send({ message: "Employee not found", data: {} });
        }

        const [policyDataRows] = await db.sequelize.query(
            `SELECT DISTINCT 
          LPD.includeWeekendHoliday, LPD.isApplAftrProb, LPD.onceInServiceLeave, 
          LPD.id AS policy_id, LPD.leaveId, LPE.from AS applicableFrom
       FROM HRMS_LEAVE_MASTER AS LM
       INNER JOIN HRMS_LEAVE_POLICY_DETAIL AS LPD ON LM.id = LPD.leaveId AND LPD.isDeleted = false
       INNER JOIN HRMS_LEAVE_POLICY_ENTITLEMENT AS LPE ON LM.id = LPE.leaveId AND LPE.isDeleted = false
       INNER JOIN HRMS_LEAVE_POLICY_RESTRICTIONS AS LPR ON LM.id = LPR.leaveId AND LPR.isDeleted = false
       WHERE LM.entity_id = ${userData.primary_entity_id} AND LM.id = ${leaveId} AND LM.isDeleted = false`
        );
        const policyData = policyDataRows[0];

        if (!policyData) {
            return res.status(400).send({
                message: "Leave policy is not fully configured. Please ensure entitlement and restrictions are set up.",
                data: {}
            });
        }

        if (policyData.isApplAftrProb && userData.emp_probation_date) {
            const probationEndDate = new Date(userData.emp_probation_date);
            const leaveStartDate = new Date(startDate);
            if (leaveStartDate <= probationEndDate) {
                return res.status(400).send({
                    message: "Leave cannot be applied for dates falling within the probation period.",
                    data: {}
                });
            }
        }

        const existingLeave = await EssApplyLeaveDetail.findOne({
            where: { isDeleted: false, id: leave_id }
        });

        if (!existingLeave) {
            return res.status(400).json({ message: "Applied Leave with this id does not exist" });
        }

        if (policyData.onceInServiceLeave) {
            const existingOnceLeave = await EssApplyLeaveDetail.findOne({
                where: {
                    employee_id,
                    leaveId,
                    isDeleted: false,
                    id: { [Op.ne]: leave_id }
                },
                order: [['createdAt', 'ASC']]
            });

            if (existingOnceLeave) {
                if (existingOnceLeave.approval_status == 'APPROVED') {
                    return res.status(400).send({
                        message: "This leave type can only be availed once in a lifetime and has already been utilized!",
                        data: {}
                    });
                } else if (['PENDING', 'PENDING FROM APPROVAL END'].includes(existingOnceLeave.approval_status)) {
                    return res.status(400).send({
                        message: "Another leave have already been applied for this leave type and it's pending for approval!",
                        data: {}
                    });
                }
            }
        }

        const leaveExist = await leaveMaster.findOne({ where: { id: leaveId, isDeleted: false } });
        if (!leaveExist) {
            return res.status(404).send({ message: 'Leave type does not exist or is deleted', data: [] });
        }

        const departmentExists = await db.department.findOne({ where: { dept_id: departmentId, isDeleted: false } });
        if (!departmentExists) {
            return res.status(404).send({ message: 'Department does not exist or is deleted', data: [] });
        }

        const overlappingLeaves = await EssApplyLeaveDetail.findAll({
            where: {
                employee_id,
                isDeleted: false,
                id: { [Op.ne]: leave_id },
                [Op.or]: [
                    { start_date: { [Op.between]: [startDate, endDate] } },
                    { end_date: { [Op.between]: [startDate, endDate] } },
                    {
                        start_date: { [Op.lte]: startDate },
                        end_date: { [Op.gte]: endDate }
                    }
                ]
            }
        });

        if (overlappingLeaves.length > 0) {
            return res.status(409).send({ message: 'Leave already exists on the given dates', data: [] });
        }

        await EssApplyLeaveDetail.update(
            {
                leave_for: leaveFor,
                start_date: startDate,
                end_date: endDate,
                leave_days: leaveDays,
                justification,
                employee_id,
                dept_id: departmentId,
                leaveId
            },
            { where: { id: leave_id }, returning: true }
        );

        if (leaveFor === "TEAMMATE") {
            await db.essApplyLeaveDetail.update({
                approved_start_date: startDate,
                approved_end_date: endDate,
                approved_days: leaveDays,
                approval_status: "APPROVED"
            }, {
                where: { id: leave_id, employee_id }
            });
        }

        const existingLeaveDocuments = await db.appliedLeaveDocuments.findAll({
            where: { isDeleted: false, applyDetailId: leave_id }
        });

        if (existingLeaveDocuments.length > 0) {
            await db.appliedLeaveDocuments.update(
                { isDeleted: true }, { where: { applyDetailId: leave_id } }
            );
        }

        await Promise.all(documents.map(async (leaveDoc) => {
            await db.appliedLeaveDocuments.create({
                uploaded_document: leaveDoc,
                applyDetailId: leave_id
            });
        }));

        const existing_days = await db.essLeavedaysDetail.findAll({
            where: { isDeleted: false, apply_leave_id: leave_id }
        });

        if (existing_days.length > 0) {
            await db.essLeavedaysDetail.update(
                { isDeleted: true }, { where: { apply_leave_id: leave_id } }
            );
        }

        await Promise.all(days_details.map(async (details) => {
            const { leave_day, leave_date, leave_period, leave_type } = details;
            await db.essLeavedaysDetail.create({
                leave_day, leave_date, leave_period, leave_type, apply_leave_id: leave_id
            });
        }));

        return res.status(200).send({ message: "Applied leave has been updated successfully", data: {} });

    } catch (error) {
        console.error('Error updating the leave:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



// Delete Available Leave for employee  
const deleteAppliedLeaveById = async (req, res) => {
    const { leave_id } = req.params;
    const requiredFields = ['leave_id'];
    for (const field of requiredFields) {
        if (req.params[field] === undefined || req.params[field] === null) {
            return res.status(400).send({ message: `Leave data incomplete: ${field} is missing`, data: [] });
        }
    }
    try {
        const existingAppliedDetail = await EssApplyLeaveDetail.findAll({
            where: { isDeleted: false, id: leave_id }
        });
        if (existingAppliedDetail.length === 0) {
            console.log("Applied Leave with this id does not exists.");
        }
        await EssApplyLeaveDetail.update({ isDeleted: true },
            { where: { id: leave_id }, returning: true });


        const existingLeaveDocuments = await db.appliedLeaveDocuments.findAll({
            where: { isDeleted: false, applyDetailId: leave_id }
        });
        if (existingLeaveDocuments.length === 0) {
            console.log("Applied Leave with this id does not have any documents.");
        }
        await db.appliedLeaveDocuments.update({ isDeleted: true },
            { where: { applyDetailId: leave_id }, returning: true });


        const existingLeaveDays = await db.essLeavedaysDetail.findAll({
            where: { isDeleted: false, apply_leave_id: leave_id }
        });
        if (existingLeaveDays.length === 0) {
            console.log("Applied Leave with this id does not have any leave days.");
        }
        await db.essLeavedaysDetail.update({ isDeleted: true },
            { where: { apply_leave_id: leave_id }, returning: true });


        return res.status(200).send({ message: 'Applied leave has been deleted successfully', data: [] });
    } catch (error) {

        console.error('Error deleting the applied leave:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

// Get Details and Restrictions for Leave By ID
const getleavedetailsbyleaveID = async (req, res) => {
    try {
        let { leave_id, entity_id } = req.query;

        const leave_details = await LeaveMasterModel.findAll({
            where: { id: leave_id, entity_id, isDeleted: false },
            include: [
                { model: db.leavePolicyDetail },
                { model: db.leavePolicyRestrictions }]
        });
        return res.status(200).send({ message: "All leaves fetched Successfully!", data: leave_details });

    } catch (error) {

        console.error('Error getting leave master:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }

}

///////////////////////For TeamMates /////////////////////////////
const get_allemployeeBY_managerID = async (req, res) => {
    try {
        const manager_id = req.params.manager_id;
        const employee_list = await db.user.findAll({
            where: { reporting_manager_id: manager_id, isDeleted: false, status: "ACTIVE" },
            attributes: ['employee_id', 'title', 'employee_code', 'first_name', 'last_name', 'department_id', 'location_id', 'role_master_id', 'marital_status', 'gender', 'designation_id']
        });
        if (employee_list) {
            return res.status(200).send({ message: "Employee fetched successfully", data: employee_list });
        } else {
            return res.status(200).send({ message: "Employee Not Found", data: [] });
        }
    } catch (error) {

        console.error('Error getting leave master:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

const getAll_leaves_tobeApproved = async (req, res) => {
    try {
        let { entity_id, employee_id, approval_status } = req.query;
        let approvalStatuses = approval_status.includes(",")
            ? approval_status.split(",").map(status => status.trim())
            : [approval_status];
        const leaveMasters = await LeaveMasterModel.findAll({
            where: {
                isDeleted: false,
                status: "ACTIVE",
                entity_id: entity_id
            }
        });

        const employee_details = await db.user.findAll({
            where: {
                isDeleted: false,
                status: "ACTIVE",
                [Op.or]: [
                    { reporting_manager_id: employee_id },
                    { approval_manager_id: employee_id }
                ]
            }
        });

        let employeeIds = employee_details.map(employee => employee.employee_id);
        let leaveIds = leaveMasters.map(leaveMaster => leaveMaster.id);
        const allEmployeeLeaves = await EssApplyLeaveDetail.findAll({
            where: {
                employee_id: employeeIds,
                isDeleted: false,
                leaveId: leaveIds,
                approval_status: { [Op.in]: approvalStatuses }
            },
            include: [
                {
                    model: LeaveMasterModel,
                    attributes: ['leave_name', 'total_available'],
                },
                {
                    model: db.user,
                    attributes: ['employee_id', 'title', 'employee_code', 'first_name', 'last_name', 'location_id', 'department_id', 'role_master_id', 'marital_status', 'gender', 'designation_id'],
                }
            ]
        });
        if (allEmployeeLeaves.length > 0) {
            return res.status(200).send({ message: "All leaves fetched for employee Successfully!", data: allEmployeeLeaves });
        } else {
            return res.status(200).send({ message: "Unable to find the applied leaves!", data: [] });
        }
    } catch (error) {

        console.error('Error getting leave master:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

const update_leave_approvalstatus = async (req, res) => {
    try {
        const { applied_leave_id, approved_start_date, approved_end_date, approved_days, approval_status, employee_id } = req.body;
        const leave_detail = await db.essApplyLeaveDetail.findOne({ where: { id: applied_leave_id, isDeleted: false } });
        const emp_detail = await db.user.findOne({ where: { employee_id: leave_detail.employee_id } });
        let update_status;
        if (approval_status != "REJECTED") {
            let approvals_status;
            if (employee_id == emp_detail.reporting_manager_id && employee_id != emp_detail.approval_manager_id) {
                if (leave_detail.approval_status == "PENDING FROM APPROVAL END") {
                    return res.status(200).send({ message: "You have already Approved this leave AND Pending from approval end!" });
                } else {
                    approvals_status = "PENDING FROM APPROVAL END"
                }
            } else if (employee_id == emp_detail.approval_manager_id) {
                approvals_status = "APPROVED"
                // const allotment = await db.hrmsLeaveAllotment.findOne({
                //     where: {
                //         employee_id: leave_detail.employee_id,
                //         leave_id: leave_detail.leaveId,
                //         isDeleted: false
                //     },
                //     attributes: ['no_of_days']
                // });

                // if (!allotment) {
                //     return res.status(201).send({
                //         code: 201,
                //         message: "Leave allotment not found for user!"
                //     });
                // }

                // const currentQuota = allotment.no_of_days;

                // if (currentQuota > 0) {
                //     const new_quota = Math.max(currentQuota - approved_days, 0); // avoid negative

                //     await db.hrmsLeaveAllotment.update(
                //         { no_of_days: new_quota },
                //         {
                //             where: {
                //                 employee_id: leave_detail.employee_id,
                //                 leave_id: leave_detail.leaveId
                //             }
                //         }
                //     );

                //     console.log(`Updated leave quota from ${currentQuota} to ${new_quota} for employee ${leave_detail.employee_id}`);
                // } else {
                //     console.log(`Leave quota is already 0 for employee ${leave_detail.employee_id}, skipping deduction.`);
                // }

            }
            update_status = await db.essApplyLeaveDetail.update({ approved_start_date, approved_end_date, approved_days, approval_status: approvals_status }, { where: { id: applied_leave_id } })
        } else {
            update_status = await db.essApplyLeaveDetail.update({ approved_start_date, approved_end_date, approved_days, approval_status }, { where: { id: applied_leave_id } })
        }
        if (update_status) {
            return res.status(200).send({ message: "Leave Approval Status Updated Successfully!", data: update_status });
        } else {
            return res.status(200).send({ message: "Unable to approve the leave!", data: [] });
        }
    } catch (error) {

        console.error('Error getting leave master:', error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

module.exports = {
    applyLeave,
    getAllEmployeesByEntity,
    getAllAppliedLeavesForEmployee,
    getAllAppliedLeaveById,
    getAllLeavesByFilter,
    updateAppliedLeaveById,
    deleteAppliedLeaveById,
    getleavedetailsbyleaveID,
    get_allemployeeBY_managerID,
    getAll_leaves_tobeApproved,
    update_leave_approvalstatus,
    getEffectiveAppliedLeave,
    cronForLeaveAllotment,
    cronMonthlyLeaveAllotment,
    cronForCompOffDaily,
    cronForCompOffExpiry,
};