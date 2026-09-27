const leaveMasterModel = require('../../../ESS/Leave/models/leaveMaster.model');
const db = require('../../../models/index')
const { Op, where } = require('sequelize');
const moment = require('moment');

const LeaveEntitlementModel = db.leavePolicyEntitlement;
const LeaveRestrictionModels = db.leavePolicyRestrictions;
const LeaveDetailModel = db.leavePolicyDetailModel;
const ApplicabilityAllModel = db.applicabilityAll;
const DepartmentsModel = db.appDepartment;
const DesignationModel = db.appDesignation;
const LocationModel = db.appLocation;
const MaritalModel = db.appMarital;
const GenderModel = db.appGender;
const RestrictionsDurations = db.restrictionsDurations

const DepartmentMaster = db.department;    //  MASTER
const DesignationMaster = db.designation;  //  MASTER
const LocationMaster = db.tbl_branch;  //  MASTER
const LeaveMaster = db.leave_master;  //  MASTER








// =============================POLICY LISTING =============================================================================

// GET Leave Policy list  [ (0 don't have policy) (1 if have policy) ] 
const getLeavePolicyList = async (req, res) => {

    let { withPolicy, financial_id, entity_id } = req.params;

    if (!withPolicy || typeof withPolicy === 'undefined' || withPolicy === null || withPolicy.trim() === '') {
        return res.status(400).json({ message: 'Please provide a valid withPolicy value.' });
    }

    try {
        if (withPolicy == 1) {  // leaves which have even a single policy for them
            let leavePolicies = await LeaveMaster.findAll({
                where: {
                    [Op.and]: [
                        { isDeleted: false },
                        { entity_id: entity_id }]
                }
            });

            // Filter policies to include only those that have related data in any table
            let filteredPolicies = [];
            for (let policy of leavePolicies) {
                let leaveId = policy.dataValues.id;

                let [existsDetail, existsEntitlement, existsRestrictions, existsAppAll, existsDepartment, existsDesignation, existsLocation, existsMarital, existsGender, existsRestrictionDuration] = await Promise.all([
                    await LeaveDetailModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await LeaveEntitlementModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await LeaveRestrictionModels.findOne({ where: { isDeleted: false, leaveId } }),
                    await ApplicabilityAllModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await DepartmentsModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await DesignationModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await LocationModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await MaritalModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await GenderModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await RestrictionsDurations.findOne({ where: { isDeleted: false, leaveId } })
                ]);

                if (existsRestrictionDuration || existsDetail || existsEntitlement || existsRestrictions || existsAppAll
                    || existsDepartment || existsDesignation || existsLocation || existsMarital || existsGender) {
                    filteredPolicies.push(policy);
                }
            }

            if (filteredPolicies.length === 0) {
                return res.status(200).json({ message: "No Leave Policies Found", data: [] });
            }
            return res.status(200).json({ message: "Leave Policies Found", data: filteredPolicies });
        }


        if (withPolicy == 0) {    // leaves which don't even have a single policy for them
            let leavePolicies = await LeaveMaster.findAll({
                where: {
                    [Op.and]: [
                        { isDeleted: false },
                        { entity_id: entity_id }]
                }
            });

            let filteredPolicies = [];
            for (let policy of leavePolicies) {
                let leaveId = policy.dataValues.id;
                let [existsDetail, existsEntitlement, existsRestrictions, existsAppAll, existsDepartment, existsDesignation, existsLocation, existsMarital, existsGender, existsRestrictionDuration] = await Promise.all([
                    await LeaveDetailModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await LeaveEntitlementModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await LeaveRestrictionModels.findOne({ where: { isDeleted: false, leaveId } }),
                    await ApplicabilityAllModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await DepartmentsModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await DesignationModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await LocationModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await MaritalModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await GenderModel.findOne({ where: { isDeleted: false, leaveId } }),
                    await RestrictionsDurations.findOne({ where: { isDeleted: false, leaveId } })
                ]);

                if (!existsDetail && !existsEntitlement && !existsRestrictions && !existsAppAll && !existsDepartment
                    && !existsDesignation && !existsLocation && !existsMarital && !existsGender && !existsRestrictionDuration) {
                    filteredPolicies.push(policy);
                }
            }

            if (filteredPolicies.length === 0) {
                return res.status(200).json({ message: "No Leave Policies Found", data: [] });
            }
            return res.status(200).json({ message: "Leave Policies Found", data: filteredPolicies });
        }


        return res.status(200).json({ message: "Please enter valid payload", data: [] });
    } catch (error) {

        console.error('Error fetching leave policies:', error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE Leave Policy    
const deleteLeavePolicyById = async (req, res) => {
    let { leaveId } = req.params;
    if (!leaveId || typeof leaveId === 'undefined' || leaveId === null || leaveId.trim() === '') {
        return res.status(400).json({ message: 'Please provide a valid leaveId value.' });
    }

    try {
        let leaveExist = await LeaveMaster.findOne({
            where: { [Op.and]: [{ isDeleted: false }, { id: leaveId }] }
        });

        if (!leaveExist) {
            return res.status(404).json({ message: 'Leave policy not found', data: [] });
        }

        await Promise.all([
            await LeaveDetailModel.update({ isDeleted: true }, { where: { leaveId } }),
            await LeaveEntitlementModel.update({ isDeleted: true }, { where: { leaveId } }),
            await LeaveRestrictionModels.update({ isDeleted: true }, { where: { leaveId } }),
            await ApplicabilityAllModel.update({ isDeleted: true }, { where: { leaveId } }),
            await DepartmentsModel.update({ isDeleted: true }, { where: { leaveId } }),
            await DesignationModel.update({ isDeleted: true }, { where: { leaveId } }),
            await LocationModel.update({ isDeleted: true }, { where: { leaveId } }),
            await MaritalModel.update({ isDeleted: true }, { where: { leaveId } }),
            await GenderModel.update({ isDeleted: true }, { where: { leaveId } }),
            await RestrictionsDurations.update({ isDeleted: true }, { where: { leaveId } }),
        ]);

        return res.status(200).json({ message: "Leave Policy deleted successfully", data: [] });
    } catch (error) {

        console.error('Error deleting leave policies:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




// =========Policy Detail===================================================================================================

// Add Leave Policy Detail  
const addLeavePolicyDetail = async (req, res) => {
    let { financial_id, entity_id, leaveId, leave_type,isQuotaAllotedMonthly, onceInServiceLeave, includeWeekendHoliday, isApplAftrProb, policy_validity, startDate, endDate } = req.body;
    let leaveDetail = { financial_id, entity_id, leaveId, leave_type,isQuotaAllotedMonthly, onceInServiceLeave, includeWeekendHoliday, isApplAftrProb, policy_validity, startDate, endDate };


    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leaveId,
            entity_id: entity_id
        }
    })
    if (leaveAvailable.length === 0) {
        return res.status(400).send({ message: 'Leave not available in this financial year or entity', data: {} });
    }

    try {
        const existingData = await LeaveDetailModel.findOne({ where: { leaveId: leaveId } });


        if (existingData) {
            await LeaveDetailModel.update(
                {
                    leave_type: leave_type,
                    onceInServiceLeave: onceInServiceLeave,
                    isQuotaAllotedMonthly: isQuotaAllotedMonthly,
                    includeWeekendHoliday: includeWeekendHoliday,
                    isApplAftrProb: isApplAftrProb,
                    policy_validity: policy_validity,
                    startDate: startDate,
                    endDate: endDate,
                    isDeleted: false
                },
                { where: { leaveId: leaveId } }
            );
            return res.status(200).send({ message: 'Existing leave policy has been updated', data: { leaveDetail } });
        }
        // Create new leave
        const newLeavePolicyDetail = await LeaveDetailModel.create(leaveDetail);
        return res.status(200).send({ message: 'Leave policy added successfully', data: newLeavePolicyDetail });

    } catch (error) {

        console.error('Error creating/updating leave policy detail:', error);
        return res.status(500).send({ message: 'Error creating/updating leave policy detail', data: {} });
    }
};



// const addLeavePolicyDetail = async (req, res) => {
//     let { financial_id, entity_id, leaveId, leave_type, policy_validity, startDate, endDate, is_deleted } = req.body;
//     let leaveDetail = { leaveId, leave_type, policy_validity, startDate, endDate, is_deleted };


//     const leaveAvailable = await LeaveMaster.findAll({
//         where: {
//             id: leaveId,
//             entity_id: entity_id
//         }
//     })
//     if (leaveAvailable.length === 0) {
//         return res.status(400).send({ message: 'Leave not available in this financial year or entity', data: {} });
//     }

//     try {
//         const existingData = await LeaveDetailModel.findOne({ where: { leaveId: leaveId } });


//         if (existingData) {
//             await LeaveDetailModel.update(
//                 {
//                     leave_type: leave_type,
//                     policy_validity: policy_validity,
//                     startDate: startDate,
//                     endDate: endDate,
//                     isDeleted: false
//                 },
//                 { where: { leaveId: leaveId } }
//             );
//             return res.status(200).send({ message: 'Existing leave policy has been updated', data: { leaveDetail } });
//         }
//         // Create new leave
//         const newLeavePolicyDetail = await LeaveDetailModel.create(leaveDetail);
//         return res.status(200).send({ message: 'Leave policy added successfully', data: newLeavePolicyDetail });

//     } catch (error) {

//         console.error('Error creating/updating leave policy detail:', error);
//         return res.status(500).send({ message: 'Error creating/updating leave policy detail', data: {} });
//     }
// };

// Get Leave Policy By Id  
const getLeavePolicyDetailyById = async (req, res) => {
    let { leaveId, financial_id, entity_id, employee_id } = req.params;

    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leaveId,
            entity_id: entity_id
        }
    });

    if (leaveAvailable.length === 0) {
        return res.status(400).send({ message: 'Leave not available in this year', data: [] });
    }

    try {
        const leavePolicyById = await LeaveDetailModel.findAll({
            where: { leaveId: leaveId, isDeleted: false },
            include: { model: LeaveMaster },
        });

        if (!leavePolicyById || leavePolicyById.length === 0) {
            return res.status(404).send({ message: "Leave not found!", data: {} });
        }

        let holidays = [];
        let result = [];

        if (leavePolicyById[0].includeWeekendHoliday === false) {
            // Fetch holidays
            holidays = await db.holidayDetail.findAll({
                where: {
                    isDeleted: false,
                    entity_id,
                    financial_year_id: financial_id
                }
            });

            // Prepare working calendar days query
            const weeks = ['week_1st', 'week_2nd', 'week_3rd', 'week_4th', 'week_5th'];

            const queries = weeks.map(week => `
                SELECT week_name AS day, '${week}' AS week, ${week} AS type
                FROM SETUP_WORK_CALENDERS
                WHERE employee_id = ${employee_id}
                AND entity_id = ${entity_id}
                AND isDeleted = false
                AND ${week} IS NOT NULL
            `);

            const finalQuery = queries.join(' UNION ALL ');

            // Execute working days query
            result = await db.sequelize.query(finalQuery, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            console.log(result, "Filtered working calendar days");
        }

        return res.status(200).send({
            message: "Policy detail fetched successfully!",
            data: leavePolicyById,
            result,
            holidays
        });

    } catch (error) {
        console.error('Error fetching the leave policy:', error);
        return res.status(500).send({ message: error.message, data: { error } });
    }
};






// =========================ENTITLEMENT====================================================================================

// Function to calculate effective duration considering leap years
function calculateEffectiveDuration(effectiveDays, effectivePeriod) {
    let durationInDays;

    switch (effectivePeriod) {
        case 'DAYS':
            durationInDays = effectiveDays;
            break;
        case 'MONTHS':
            durationInDays = 0;
            for (let i = 0; i < effectiveDays; i++) {
                // Add 1 month to today's date and get the exact number of days in that month
                durationInDays += moment().add(i, 'months').daysInMonth();
            }
            break;
        case 'YEAR':
            // Calculate the number of days in the given number of years, accounting for leap years
            durationInDays = 0;
            for (let i = 0; i < effectiveDays; i++) {
                // Check if the year is a leap year and add the appropriate number of days
                durationInDays += moment().add(i, 'years').isLeapYear() ? 366 : 365;
            }
            break;
        default:
            throw new Error('Invalid effective period');
    }

    return durationInDays;
}


// Add Leave Entitlement  
const addLeaveEntitlement = async (req, res) => {
    let { financial_id, entity_id, leaveId, effective_value, effective_period, from, carry_forward_leave, carry_forward_mode, max_carry_forward,is_encash,encash_val,encash_type,encash_max_val } = req.body;

    const effectiveDuration = calculateEffectiveDuration(effective_value, effective_period);
    let leaveEntitlement = {
        leaveId: leaveId,
        effective_value: effective_value,
        effective_period: effective_period,
        effective_duration: effectiveDuration,
        from: from,
        carry_unused_leaves: carry_forward_leave,
        unused_leaves_mode: carry_forward_mode,
        carry_unused_limit: max_carry_forward,
        is_encash:is_encash,
        encash_val:encash_val,
        encash_type:encash_type,
        encash_max_val:encash_max_val
        // max_month_carry_forward: max_month_carry_forward,
        // encash_leaves: encash_leave,
        // encash_mode: encash_mode,
        // encash_limit: max_encash
    };

    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leaveId,
            entity_id: entity_id
        }
    })
    if (leaveAvailable.length === 0) {
        return res.status(400).send({ message: 'Leave not available in this financial year or entity', data: {} });
    }

    try {
        let leaveEntitlementExist = await LeaveEntitlementModel.findOne({ where: { isDeleted: false, leaveId: leaveId } });
        if (leaveEntitlementExist) {
            await LeaveEntitlementModel.update(leaveEntitlement, { where: { leaveId: leaveId, isDeleted: false } });
            return res.status(200).send({ message: 'Exists Leave Policy Entitlement Updated', data: leaveEntitlement });
        }
        // Create new leave
        const newLeavePolicyEntitlement = await LeaveEntitlementModel.create(leaveEntitlement);

        return res.status(200).send({ message: 'Policy Entitlement created successfully', data: newLeavePolicyEntitlement });
    } catch (error) {

        console.error('Error creating leave policy entitlement:', error);
        return res.status(500).send({ message: 'Error creating leave policy entitlement', data: {} });
    }
};

// Get Leave Entitlement By Id 
const getLeaveEntitlementById = async (req, res) => {
    const { leaveId, financial_id, entity_id } = req.params;
    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leaveId,
            entity_id: entity_id
        }
    });
    if (leaveAvailable == 0) {
        return res.status(400).send({ message: 'Leave not available in this year', data: [] });
    }


    try {

        let leaveEntitlementById = await LeaveEntitlementModel.findOne({ where: { isDeleted: false, leaveId: leaveId } });
        if (!leaveEntitlementById) {
            return res.status(404).send({ message: 'Leave Policy Entitlement not found', data: {} });
        }

        return res.status(200).send({ message: "Leave entitlement fetched successfully", data: leaveEntitlementById });
    } catch (error) {

        console.error('Error fetching the leave entitlement:', error);
        return res.status(500).send({ message: 'Error in fetching leave entitlement', data: { error } });
    }
};




// ==========================APPLICABILITY=================================================================================

const addLeaveApplicability = async (req, res) => {

    // return await getAllLocationIds();

    let {
        financial_id, entity_id, leaveId, for_all, for_allStatus,
        for_allDeleted, appDepartment, appDesignation,
        appLocation, appGender, appMaritalStatus
    } = req.body;

    if (!leaveId) {
        return res.status(400).send({ message: 'Leave ID is required' });
    }

    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leaveId,
            entity_id: entity_id
        }
    });

    if (leaveAvailable.length === 0) {
        return res.status(400).send({ message: 'Leave not available in this financial year or entity', data: {} });
    }

    try {
        if (for_all === 1) {
            let forAllData = { is_entry: '1', status: for_allStatus, leaveId: leaveId };
            let existingData = await ApplicabilityAllModel.findOne({ where: { leaveId: leaveId, isDeleted: false } });

            await DepartmentsModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await DesignationModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await LocationModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await GenderModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await MaritalModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });

            if (!existingData) {
                const newLeavePolicyForAll = await ApplicabilityAllModel.create(forAllData);
                return res.status(200).send({ message: "New leave applicability for all added", data: newLeavePolicyForAll });
            }

            await ApplicabilityAllModel.update(forAllData, { where: { leaveId: leaveId } });
            return res.status(200).send({ message: "Leave applicability for all updated", data: existingData });
        } else {
            // If any of the dropdown arrays is empty, fetch all relevant IDs for that dropdown
            appDepartment = appDepartment.length > 0 ? appDepartment : await getAllDepartmentIds(entity_id);
            appDesignation = appDesignation.length > 0 ? appDesignation : await getAllDesignationIds(entity_id);
            appLocation = appLocation.length > 0 ? appLocation : await getAllLocationIds(entity_id);
            appGender = appGender.length > 0 ? appGender : await getAllGenderOptions();
            appMaritalStatus = appMaritalStatus.length > 0 ? appMaritalStatus : await getAllMaritalStatusOptions();

            // Update existing records with is_deleted '1' where applicable
            await DepartmentsModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await DesignationModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await LocationModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await GenderModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            await MaritalModel.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });

            await ApplicabilityAllModel.update({ is_entry: "0", isDeleted: true, status: "INACTIVE" }, { where: { leaveId: leaveId } });

            // Create new records for each array item
            await Promise.all(appDepartment.map(async (item) => {
                await DepartmentsModel.create({ leaveId: leaveId, dept_id: item });
            }));
            await Promise.all(appDesignation.map(async (item) => {
                await DesignationModel.create({ leaveId: leaveId, designation_id: item });
            }));
            await Promise.all(appLocation.map(async (item) => {
                await LocationModel.create({ leaveId: leaveId, locationId: item });
            }));
            await Promise.all(appGender.map(async (item) => {
                await GenderModel.create({ leaveId: leaveId, gender: item, isDeleted: false });
            }));
            await Promise.all(appMaritalStatus.map(async (item) => {
                await MaritalModel.create({ leaveId: leaveId, marital: item });
            }));

            return res.status(200).send({ message: 'Leave applicability is added successfully' });
        }
    } catch (error) {

        console.error('Error creating leave policy applicability:', error);
        return res.status(500).send({ message: 'Error creating leave policy applicability', data: {} });
    }
};

// Helper functions to fetch all IDs if none are selected
const getAllDepartmentIds = async (entity_id) => {
    const departments = await DepartmentMaster.findAll({
        where:
            { isDeleted: false, status: "ACTIVE", entity_id: entity_id }
    });
    return departments.map(dept => dept.dept_id);
};

const getAllDesignationIds = async (entity_id) => {
    const designations = await DesignationMaster.findAll({ where: { isDeleted: false } });
    return designations.map(designation => designation.designation_id);
};

const getAllLocationIds = async (entity_id) => {
    const locations = await LocationMaster.findAll({ where: { isDeleted: false } });
    return locations.map(location => location.id);
};


const getAllGenderOptions = async () => {
    return ['Male', 'Female', 'Others'];
};

const getAllMaritalStatusOptions = async () => {
    return ['Unmarried', 'Married', 'Separated'];
};


// Get Leave Applicability By Id  ( SORT) 
const getLeaveApplicabilityById = async (req, res) => {

    const { leave_id, financial_id, entity_id } = req.params;
    let isForAll = 0;

    // Validation checks
    if (leave_id === undefined || !leave_id) {
        return res.status(400).send({ message: 'Leave ID must be provided in the request.', data: {} });
    }

    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leave_id,
            entity_id: entity_id
        }
    });
    if (leaveAvailable === 0) {
        return res.status(400).send({ message: 'Leave does not exist', data: {} });
    }


    try {
        let existingLeave = await LeaveMaster.findOne({
            where: {
                id: leave_id,
                isDeleted: false,
                entity_id: entity_id
            }
        });

        if (!existingLeave) {
            return res.status(400).send({ message: 'Leave does not exist' });
        }
        // Get  records for each array item
        let designation = await DesignationModel.findAll({
            where: { leaveId: leave_id, isDeleted: false },
            include: { model: DesignationMaster },
        });
        let department = await DepartmentsModel.findAll({
            where: { leaveId: leave_id, isDeleted: false },
            include: { model: DepartmentMaster },
        });
        let locations = await LocationModel.findAll({
            where: { leaveId: leave_id, isDeleted: false },
            include: { model: LocationMaster },
        });

        let forAll = await ApplicabilityAllModel.findAll({ where: { leaveId: leave_id, isDeleted: false } });
        if (forAll.length > 0) {
            isForAll = forAll[0].dataValues.is_entry;
        }


        let gender = await GenderModel.findAll({ where: { isDeleted: false, leaveId: leave_id } });
        let marital = await MaritalModel.findAll({ where: { isDeleted: false, leaveId: leave_id } });
        if (!designation, !department, !locations, !forAll, !gender, !marital) {
            return res.status(400).send({ message: 'No records found for the given leave ID' });
        }

        return res.status(200).send({ message: 'Leave policy applicability fetched successfully', data: { isForAll, department, designation, locations, gender, marital } });
    }
    catch (error) {

        console.error('Error fetching the Leave Applicability:', error);
        res.status(500).send({ message: 'Error in fetching Leave Applicability', data: { error } });
    }
};

// Get Leave Applicability By Id  FOR ALL 
const getLeaveApplicabilityForAll = async (req, res) => {
    const { leave_id, financial_id, entity_id } = req.params;

    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leave_id,
            entity_id: entity_id
        }
    });

    // Validation checks
    if (!leaveAvailable.length > 0) {
        return res.status(400).send({ message: 'Leave does not exists', data: {} });
    }
    if (leave_id === undefined || !leave_id) {
        return res.status(400).send({ message: 'Leave ID must be provided', data: {} });
    }
    try {
        let leaveApplicabilityForAll = await ApplicabilityAllModel.findOne({ where: { is_entry: true, leaveId: leave_id, isDeleted: false } });
        // Update existing records with is_deleted '1' where applicable         
        if (leaveApplicabilityForAll) {
            await DepartmentsModel.update({ isDeleted: true }, { where: { leaveId: leave_id, isDeleted: false } });
            await DesignationModel.update({ isDeleted: true }, { where: { leaveId: leave_id, isDeleted: false } });
            await LocationModel.update({ isDeleted: true }, { where: { leaveId: leave_id, isDeleted: false } });
            await GenderModel.update({ isDeleted: true }, { where: { leaveId: leave_id, isDeleted: false } });
            await MaritalModel.update({ isDeleted: true }, { where: { leaveId: leave_id, isDeleted: false } });
        }

        return res.status(200).send({ message: 'Leave policy applicability fetched successfully', data: leaveApplicabilityForAll });
    } catch (error) {

        console.error('Error fetching the Leave Applicability:', error);
        res.status(500).send({ message: 'Error in fetching Leave Applicability', data: { error } });
    }
};

//  APPLICABILITY LOCATIONS
const getAllApplicabilityLocation = async (req, res) => {
    try {
        const getAllData = await LocationMaster.findAll({ where: { status: "ACTIVE", isDeleted: false } })
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Locations Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {

        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

//  APPLICABILITY DEPARTMENTS
const getAllApplicabilityDepartment = async (req, res) => {
    try {

        let { entity_id } = req.query;
        entity_id = parseInt(entity_id)
        const getAllData = await DepartmentMaster.findAll({ where: { entity_id: entity_id, status: "ACTIVE", isDeleted: false, }, order: [['dept_id', 'DESC']] })

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched all Department Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {

        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

//  APPLICABILITY DESIGNATIONS
const getAllApplicabilityDesignation = async (req, res) => {
    try {
        const getAllData = await DesignationMaster.findAll({ where: { isDeleted: false, status: "ACTIVE" } });
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Designation Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {

        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};





// ============================RESTRICTIONS===============================================================================

//  Add Leave Restrictions  
const addLeaveRestrictions = async (req, res) => {

    let { financial_id, entity_id, leaveId, allowed_Duration, past_days, future_next, future_advanceDays, maxRequest, minRequest } = req.body;
    // Validation checks
    if (!leaveId || !allowed_Duration) {
        return res.status(400).send({ message: 'Leave restrictions fields are incomplete', data: {} });
    }

    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leaveId,
            entity_id: entity_id
        }
    })
    if (leaveAvailable.length === 0) {
        return res.status(400).send({ message: 'Leave not available in this financial year or entity', data: {} });
    }


    try {
        let leaveRestrictions = { leaveId, past_days, future_advanceDays, maxRequest, minRequest };
        // CHECKING IF THERE IS EXISTING RECORD OR NOT 
        console.log(past_days.value)
        console.log(future_next)
        console.log(future_advanceDays)

        let existingData = await LeaveRestrictionModels.findOne({ where: { leaveId: leaveId, isDeleted: false } });
        if (existingData) {
            // UPDATE THE EXISTING RECORD
            await LeaveRestrictionModels.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            if (allowed_Duration.length > 0) {
                await RestrictionsDurations.update({ isDeleted: true }, { where: { leaveId: leaveId, isDeleted: false } });
            }
        }

        // Create new leave restrictions
        let addNewRestrictions;
        let allowed_duration;

        addNewRestrictions = await LeaveRestrictionModels.create(leaveRestrictions);
        if (allowed_Duration.length > 0) {
            Promise.all(allowed_Duration.map(async (item) => {
                allowed_duration = await RestrictionsDurations.create({ leaveId: leaveId, duration: item });
            }));
        }

        return res.status(200).send({ message: "New leave restrictions added", data: { ...addNewRestrictions.toJSON(), allowed_duration } });
    } catch (error) {

        console.error('Error creating leave policy restrictions:', error.message);
        return res.status(500).send({ message: error.message || 'Error creating leave policy restrictions', data: [] });
    }
};

//  Get Leave Restrictions By Id   
const getLeaveRestrictionsById = async (req, res) => {
    const { leave_id, financial_id, entity_id } = req.params;
    // Validation checks

    const leaveAvailable = await LeaveMaster.findAll({
        where: {
            id: leave_id,
            entity_id: entity_id
        }
    });

    if (!leaveAvailable.length > 0) {
        return res.status(400).send({ message: 'Leave not available in this financial year or entity', data: {} });
    }

    if (!leave_id || !leave_id === undefined) {
        return res.status(400).send({ message: 'Please provide the leave Id', data: {} });
    }

    try {
        let leaveRestrictionsById = await LeaveRestrictionModels.findOne({ where: { isDeleted: false, leaveId: leave_id } });
        let durations = await RestrictionsDurations.findAll({ where: { leaveId: leave_id, isDeleted: false } });
        let effectiveDuration = await LeaveEntitlementModel.findOne({where:{leaveId:leave_id,isDeleted:false}});

        if (!leaveRestrictionsById || !durations) {
            return res.status(404).send({ message: 'Leave Policy Restrictions not found', data: {} });
        }

        return res.status(200).send({ message: 'Policy restriction fetched successfully', data: { ...leaveRestrictionsById.toJSON(), durations,effectiveDuration } });
    } catch (error) {

        console.error('Error fetching the Leave Restrictions:', error);
        res.status(500).send({ message: 'Error in fetching Leave Restrictions', data: { error } });
    }
};





module.exports = {
    getLeavePolicyList,
    deleteLeavePolicyById,
    getAllApplicabilityDepartment,
    getAllApplicabilityLocation,
    getAllApplicabilityDesignation,
    getLeaveApplicabilityForAll,
    addLeavePolicyDetail,
    getLeavePolicyDetailyById,
    addLeaveEntitlement,
    getLeaveEntitlementById,
    addLeaveApplicability,
    getLeaveApplicabilityById,
    addLeaveRestrictions,
    getLeaveRestrictionsById,
};
