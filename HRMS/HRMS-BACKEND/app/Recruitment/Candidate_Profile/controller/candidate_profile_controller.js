const db = require("../../../models/index");
const { Sequelize, Op } = require("sequelize");
const path = require('path');
const { sendinterviewSchedulesMail } = require("../../utils/mail/mail");
const { saveNotification } = require("../../../notification/hrms_notification/controller/hrms_notification_controller");
const User = db.user;

exports.getAll_candidate_profile = async (req, res) => {
    try {
        const { user_id, user_role,entity_id, financial_year_id } = req.query;
        let getAllData;
        if (user_role == 'Super Admin') {
            const query = `
            SELECT RJ.id AS JD_id,RJ.job_title,RJ.jd_number,RJ.entity_id,RJ.assign_id, RJ.number_of_positions,D.designation_name,MD.department_name,MA.area_name,MB.branch_name,HRU.first_name AS assignee_first_name,HRU.last_name AS assignee_last_name,RJ.created_by
            FROM RECRUITMENT_JOB_DESCRIPITION AS RJ 
				LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
            LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
            LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
            WHERE RJ.isCompletedJd="COMPLETED" ORDER BY RJ.id DESC`

            getAllData = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
        } else {
            const getdata = `
            SELECT RJ.id AS JD_id,RJ.job_title,RJ.jd_number,RJ.entity_id,RJ.assign_id, RJ.number_of_positions,D.designation_name,MD.department_name,MA.area_name,MB.branch_name,HRU.first_name AS assignee_first_name,HRU.last_name AS assignee_last_name,RJ.created_by
            FROM RECRUITMENT_JOB_DESCRIPITION AS RJ 
			LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
            LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
            LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
            WHERE (RJ.created_by=${user_id} OR RJ.assign_id=${user_id}) AND RJ.isCompletedJd="COMPLETED" ORDER BY RJ.id DESC`

            getAllData = await db.sequelize.query(getdata, {
                type: db.sequelize.QueryTypes.SELECT,
            });
        }
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched All Job Descripition Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_candidate_BY_JD_id = async (req, res) => {
    try {
        const { jd_id, selection_status } = req.query;
        const getdata = `
            SELECT RJ.id AS JD_id,RJ.job_title,RJ.jd_number,RJ.entity_id,RJ.assign_id, RJ.number_of_positions,RJ.end_date,RJ.experience,RJ.level_of_interview,D.designation_name,MD.department_name,MA.area_name,MB.branch_name AS location,HRU.first_name AS assignee_first_name,HRU.last_name AS assignee_last_name,RJ.created_by
            FROM RECRUITMENT_JOB_DESCRIPITION AS RJ 
				LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
            LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
            LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
            WHERE RJ.id=${jd_id}`

        const getAllData = await db.sequelize.query(getdata, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        let profile_details;
        if (selection_status == "SELECTED") {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id, selection_status: "SELECTED" } });
        } else if (selection_status == "APPROVED") {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id, selection_status: "APPROVED" } });
        } else if (selection_status == "REJECTED") {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id, [Op.or]: [{ selection_status: "REJECTED" }, { bgv_status: "REJECTED" }] } });
        } else {
            profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id, [Op.or]: [{ selection_status: "HOLD" }, { bgv_status: "HOLD" }] } });
        }
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Job Descripition Successfully!", data: getAllData, profile_details });
        } else {
            return res.status(200).send({ code: 200, message: "No Record Found!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.create_new_candidate_through_JD = async (req, res) => {
    try {
        const { jd_id, first_name, last_name, middle_name, country_code, contact_number, email, cv_upload, selection_status, resume_id } = req.body;

        const alreadyExists = await db.user.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { employee_official_email: email },
                    { contact_number: contact_number }
                ],
            }
        });

        if (alreadyExists) {
            return res.status(403).send({ code: 403, message: "Email and Phone is already exist !" });
        }

        const candidate_save = await db.job_descripition_email.create({
            first_name, last_name, middle_name, contact_number, country_code, email, cv_upload, selection_status, job_descripition_id: jd_id, resume_id
        });
        if (candidate_save) {
            return res.status(200).send({ code: 200, message: "Candidate Recieved Successfully!", data: candidate_save });
        } else {
            return res.status(404).send({ code: 404, message: "Not able to Create!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.update_candidate_profile = async (req, res) => {
    try {
        const { candidate_id, selection_status } = req.body;
        const update_profile = await db.job_descripition_email.update({ selection_status }, { where: { id: candidate_id } });
        if (update_profile) {
            return res.status(200).send({ code: 200, message: "Profile Updated Successfully!", data: update_profile });
        } else {
            return res.status(404).send({ code: 404, message: "Not able to Create!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.create_interview_schedule = async (req, res) => {
    try {
        const { interview_round, interview_date, interview_time, candidate_id, interviewer_list, jd_id, entity_id, interview_link, interviewStatus } = req.body;
        const alreadyscheduled = await db.candidate_interview_round.findOne({ where: { candidate_id, jd_id, interview_round } });
        if (alreadyscheduled && (alreadyscheduled.final_status === "COMPLETED" || alreadyscheduled.round_status === "COMPLETED")) {
            return res.status(403).send({ code: 403, message: "Your Interview has already been completed!" });
        } else {
            const alreadyexists = await db.candidate_interview_round.findAll({ where: { candidate_id } });
            let create_interview_round;
            let create_interviewer;
            let existingRound = alreadyexists.find(round => round.interview_round === interview_round);
            let existingRoundJSON = existingRound ? JSON.stringify(existingRound) : null;
            if (existingRoundJSON) {
                create_interview_round = await db.candidate_interview_round.update({

                    interview_round, interview_date, interview_time, jd_id, entity_id, interviewStatus, interview_link
                }, { where: { id: existingRound.id } });
                await db.candidate_interviewer.destroy({ where: { candidate_id: candidate_id, round_id: existingRound.id } });
                create_interviewer = await Promise.all(interviewer_list.map(async (details) => {
                    const { interviewer_id } = details;
                    const interviewer_details = await db.candidate_interviewer.create({
                        interviewer_id, round_id: existingRound.id, candidate_id, interview_round
                    });
                    return interviewer_details;
                }));
                const candidate_detail = await db.job_descripition_email.findOne({ where: { id: candidate_id, selection_status: "APPROVED" } });
                let email_to = candidate_detail.email;
                let first_name = candidate_detail.first_name;
                let last_name = candidate_detail.last_name;
                let entityId = entity_id;
                sendinterviewSchedulesMail(email_to, first_name, last_name, entityId, interviewStatus, interview_link, interview_time);
                for (let i = 0; i < interviewer_list.length; i++) {
                    const employee = await db.user.findOne({ where: { employee_id: interviewer_list[i].interviewer_id } });
                    if (employee) {
                        let email_to = employee.employee_official_email;
                        let first_name = employee.first_name;
                        let last_name = employee.last_name;
                        sendinterviewSchedulesMail(email_to, first_name, last_name, entityId, interviewStatus, interview_link, interview_time);
                        const notificationData = {
                            employee_id: employee.employee_id,
                            notification_type: "INTERVIEW",
                            entity_id: entity_id,
                            message: `You are assigned as interviewr for the candidate ${candidate_detail.first_name} in jd_id ${jd_id}`
                        };
                        await saveNotification(notificationData);
                    } else {
                        console.error(`No employee found with ID: ${interviewer_list[i].interviewer_id}`);
                    }
                }
                if (create_interviewer && create_interview_round) {
                    return res.status(200).send({ code: 200, message: "Interview Rescheduled Successfully!", data: create_interview_round });
                } else {
                    return res.status(404).send({ code: 404, message: "Not able to Reschedule!" });
                }
            } else {
                create_interview_round = await db.candidate_interview_round.create({
                    interview_round, interview_date, interview_time, candidate_id, jd_id, entity_id, interview_link, interviewStatus
                });
                create_interviewer = await Promise.all(interviewer_list.map(async (details) => {
                    const { interviewer_id } = details;
                    const interviewer_details = await db.candidate_interviewer.create({
                        interviewer_id, round_id: create_interview_round.id, candidate_id, interview_round
                    });
                    return interviewer_details;
                }));
                const candidate_detail = await db.job_descripition_email.findOne({ where: { id: candidate_id, selection_status: "APPROVED" } });
                let email_to = candidate_detail.email;
                let first_name = candidate_detail.first_name;
                let last_name = candidate_detail.last_name;
                let entityId = entity_id;
                sendinterviewSchedulesMail(email_to, first_name, last_name, entityId, interviewStatus, interview_link, interview_time);
                for (let i = 0; i < interviewer_list.length; i++) {
                    const employee = await db.user.findOne({ where: { employee_id: interviewer_list[i].interviewer_id } });
                    if (employee) {
                        let email_to = employee.employee_official_email;
                        let first_name = employee.first_name;
                        let last_name = employee.last_name;
                        sendinterviewSchedulesMail(email_to, first_name, last_name, entityId, interviewStatus, interview_link, interview_time);
                        const notificationData = {
                            employee_id: employee.employee_id,
                            notification_type: "INTERVIEW",
                            entity_id: entity_id,
                            message: `You are assigned as interviewr for the candidate ${candidate_detail.first_name} in jd_id ${jd_id}`
                        };

                        await saveNotification(notificationData);
                    } else {
                        console.error(`No employee found with ID: ${interviewer_list[i].interviewer_id}`);
                    }
                }
                if (create_interviewer && create_interview_round) {
                    return res.status(200).send({ code: 200, message: "Interview Scheduled Successfully!", data: create_interview_round });
                } else {
                    return res.status(404).send({ code: 404, message: "Not able to Schedule!" });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_scheduled_interview_list = async (req, res) => {
    try {
        const { interview_status, interviewer_id } = req.query;
        let interview_list;
        if (interview_status === "PENDING") {
            interview_list = await db.sequelize.query(
                `SELECT DISTINCT CI.candidate_id, E.first_name, E.last_name, E.contact_number,E.country_code, E.email, JD.job_title, D.designation_name,CI.final_status
                FROM RECRUITMENT_CANDIDATE_INTERVIEW AS CI
                INNER JOIN RECRUITMENT_CANDIDATE_INTERVIEWER AS IR ON IR.round_id=CI.id
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id = CI.candidate_id
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id = CI.jd_id
                INNER JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
                WHERE CI.final_status="PENDING" AND IR.interviewer_id=${interviewer_id} ORDER BY CI.candidate_id DESC`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            for (const result of interview_list) {
                const round_list = await db.sequelize.query(
                    `SELECT CI.id,CI.interview_date,CI.interview_round,CI.interview_date,CI.interview_time,IR.interview_status
                FROM RECRUITMENT_CANDIDATE_INTERVIEW AS CI
                INNER JOIN RECRUITMENT_CANDIDATE_INTERVIEWER AS IR ON IR.round_id=CI.id WHERE CI.candidate_id = ${result.candidate_id} AND IR.interviewer_id=${interviewer_id}`,
                    { type: db.sequelize.QueryTypes.SELECT });
                result.round_list = round_list;
            }
        } else {
            interview_list = await db.sequelize.query(
                `SELECT DISTINCT CI.candidate_id, E.first_name, E.last_name, E.contact_number, E.email,E.country_code,JD.job_title, D.designation_name,CI.final_status
                FROM RECRUITMENT_CANDIDATE_INTERVIEW AS CI
                INNER JOIN RECRUITMENT_CANDIDATE_INTERVIEWER AS IR ON IR.round_id=CI.id
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id = CI.candidate_id
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id = CI.jd_id
                INNER JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
                WHERE CI.final_status="COMPLETED" AND IR.interviewer_id=${interviewer_id} ORDER BY CI.candidate_id DESC`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            for (const result of interview_list) {
                const round_list = await db.sequelize.query(
                    `SELECT CI.id,CI.interview_date,CI.interview_round,CI.interview_date,CI.interview_time,IR.interview_status
                FROM RECRUITMENT_CANDIDATE_INTERVIEW AS CI
                INNER JOIN RECRUITMENT_CANDIDATE_INTERVIEWER AS IR ON IR.round_id=CI.id WHERE CI.candidate_id = ${result.candidate_id} AND IR.interviewer_id=${interviewer_id}`,
                    { type: db.sequelize.QueryTypes.SELECT });
                result.round_list = round_list;
            }
        }
        if (interview_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Scheduled Interview Successfully!", data: interview_list });
        } else {
            return res.status(200).send({ code: 200, message: "No Record Found!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_interview_details_by_id = async (req, res) => {
    try {
        const { candidate_id, interview_round } = req.query;
        const candidate_details = await db.sequelize.query(
            `SELECT E.*, JD.job_title,CI.interview_round,JD.experience,JD.qualification,D.designation_name,MD.department_name,A.area_name,B.branch_name
            FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E
            INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id = E.job_descripition_id
            LEFT JOIN RECRUITMENT_CANDIDATE_INTERVIEW AS CI ON CI.candidate_id=E.id
            LEFT JOIN DESIGNATION AS D ON D.designation_id=JD.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id=JD.department_id
            LEFT JOIN MASTER_AREA AS A ON A.id=JD.area_id
            LEFT JOIN MASTER_BRANCH AS B ON B.id=JD.branch_id
            WHERE E.id= ${candidate_id} AND CI.interview_round=${interview_round} AND CI.candidate_id =${candidate_id} `,
            {
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        const jd_details = await db.job_descripition_email.findOne({ where: { id: candidate_id, selection_status: "APPROVED" }, attributes: ["job_descripition_id"] });
        const skill_list = await db.job_descripition_skill.findAll({ where: { job_descripition_id: jd_details.job_descripition_id, isDeleted: false } });
        candidate_details.forEach(result => { result.skill_list = skill_list });
        if (candidate_details.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Scheduled Interview Successfully!", data: candidate_details });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.update_candidate_interview_status = async (req, res) => {
    try {
        const { candidate_id, jd_id, skill_details, final_remarks, interview_round, interviewer_id } = req.body;
        const lastround = await db.candidate_interview_round.findOne({ where: { candidate_id, jd_id }, order: [["id", "DESC"]] });
        if (lastround.interview_round === interview_round) {
            await db.candidate_interview_round.update({ round_status: "COMPLETED" }, { where: { candidate_id, interview_round, jd_id } });
        }
        const round_detail = await db.candidate_interview_round.findOne({ where: { candidate_id, jd_id, interview_round } });
        const update_remarks = await db.candidate_interviewer.update({ final_remarks, interview_round, interview_status: "COMPLETED", progress_status: "CLOSE" }, { where: { candidate_id, round_id: round_detail.id, interviewer_id } });
        const check_interview_status = await db.candidate_interviewer.findAll({ where: { candidate_id, interview_status: "PENDING", progress_status: "OPEN", round_id: round_detail.id } });
        if (!check_interview_status.length > 0) {
            await db.candidate_interview_round.update({ final_status: "COMPLETED" }, { where: { candidate_id, jd_id, interview_round } });
        }
        const max_round = await db.candidate_interview_round.max('interview_round', { where: { candidate_id } });
        if (max_round === interview_round) {
            const check_interviewer_status = await db.candidate_interviewer.findAll({ where: { candidate_id, interview_status: "PENDING", progress_status: "OPEN", round_id: round_detail.id } });
            if (!check_interviewer_status.length > 0) {
                await db.candidate_interview_round.update({ final_status: "COMPLETED" }, { where: { candidate_id } });
            }
        }
        const skill_list = await Promise.all(skill_details.map(async (details, index) => {
            const { skill_name, skill_rating, skill_rating_point } = details;
            const skill_create = await db.candidate_interview_rating.create({
                skill_name, skill_rating, skill_rating_point, interview_round, jd_id, candidate_id, interviewer_id
            });
            return { skill_create, index };
        }));
        const sorted_skill_list = skill_list.sort((a, b) => a.index - b.index).map(result => result.skill_create);

        if (update_remarks && sorted_skill_list) {
            return res.status(200).send({ code: 200, message: "Interview Round Status Updated Successfully!", data: update_remarks });
        } else {
            return res.status(404).send({ code: 404, message: "Not able to Create!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_candidate_interview_round_details = async (req, res) => {
    try {
        const { candidate_id, interview_round, interviewer_id } = req.query;
        const candidate_details = await db.sequelize.query(
            `SELECT E.*, JD.job_title,CI.interview_round,JD.experience,JD.qualification,D.designation_name,MD.department_name,A.area_name,B.branch_name, ID.final_remarks FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E
                INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id = E.job_descripition_id
                LEFT JOIN RECRUITMENT_CANDIDATE_INTERVIEW AS CI ON CI.candidate_id=E.id
                LEFT JOIN RECRUITMENT_CANDIDATE_INTERVIEWER AS ID ON ID.round_id=CI.id
                LEFT JOIN DESIGNATION AS D ON D.designation_id=JD.designation_id
                LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id=JD.department_id
                LEFT JOIN MASTER_AREA AS A ON A.id=JD.area_id
                LEFT JOIN MASTER_BRANCH AS B ON B.id=JD.branch_id
                WHERE E.id= ${candidate_id} AND CI.interview_round=${interview_round} AND CI.candidate_id = ${candidate_id} AND ID.interviewer_id=${interviewer_id}`,
            {
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        const skill_list = await db.candidate_interview_rating.findAll({ where: { candidate_id, interview_round, interviewer_id } });
        candidate_details.forEach(result => { result.skill_list = skill_list });
        if (candidate_details.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Candidate Rounds Successfully!", data: candidate_details });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_candidates_interview_details = async (req, res) => {
    try {
        const { candidate_id, jd_id } = req.query;
        const candidate_details = await db.job_descripition_email.findOne({ where: { id: candidate_id, isDeleted: false } });
        const round_list = await db.sequelize.query(
            `SELECT JD.interview_round FROM RECRUITMENT_CANDIDATE_INTERVIEW AS JD 
            WHERE JD.candidate_id= ${candidate_id} AND JD.jd_id=${jd_id}`,
            { type: db.sequelize.QueryTypes.SELECT }
        );
        for (const round of round_list) {
            const skill_list = await db.sequelize.query(
                `SELECT DISTINCT SR.skill_name, AVG(SR.skill_rating_point) AS avg_skill_rating_point FROM RECRUITMENT_CANDIDATE_INTERVIEW_SKILLS_RATING AS SR
                WHERE SR.candidate_id = ${candidate_id} AND SR.interview_round = ${round.interview_round} AND SR.jd_id = ${jd_id} GROUP BY SR.skill_name`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            round.skill_list = skill_list;
        }
        for (const round of round_list) {
            const interviewer_list = await db.sequelize.query(
                `SELECT IR.interviewer_id,IR.final_remarks,U.first_name,U.last_name FROM RECRUITMENT_CANDIDATE_INTERVIEWER AS IR
                INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = IR.interviewer_id
                 WHERE IR.candidate_id = ${candidate_id} AND IR.interview_round = ${round.interview_round}`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            round.interviewer_list = interviewer_list;
            for (const interviewer of interviewer_list) {
                const interview_details = await db.sequelize.query(
                    `SELECT SR.skill_name,SR.skill_rating, SR.skill_rating_point FROM RECRUITMENT_CANDIDATE_INTERVIEW_SKILLS_RATING AS SR
                     WHERE SR.interview_round = ? AND SR.candidate_id = ? AND SR.interviewer_id = ?`,
                    {
                        replacements: [round.interview_round, candidate_id, interviewer.interviewer_id],
                        type: db.sequelize.QueryTypes.SELECT
                    }
                );
                interviewer.interview_details = interview_details;
            }
        }
        if (candidate_details || round_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Interviewer Details Successfully!", candidate_details, data: round_list });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_candidates_Answerdetails = async (req, res) => {
    try {
        const { candidate_id, jd_id } = req.query;
        const candidate_details = await db.job_descripition_email.findOne({ where: { id: candidate_id, isDeleted: false } });
        const answer_list = await db.sequelize.query(
            `SELECT J.id,J.question,J.answer,CA.selection_answer FROM RECRUITMENT_JOB_QUESTION AS J
            LEFT JOIN RECRUITMENT_CANDIDATE_ANSWERS AS CA ON CA.question_id = J.id
            WHERE J.job_descripition_id= ${jd_id} AND CA.candidate_id=${candidate_id}`,
            { type: db.sequelize.QueryTypes.SELECT }
        );

        if (candidate_details) {
            return res.status(200).send({ code: 200, message: "Fetched candidate answer details Successfully!", candidate_details, data: answer_list });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_interview_round_details_byID = async (req, res) => {
    try {
        const { candidate_id, jd_id } = req.query;
        const round_details = await db.candidate_interview_round.findAll({ where: { candidate_id, jd_id, isDeleted: false } });
        if (round_details) {
            return res.status(200).send({ code: 200, message: "Fetched All Scheduled Interview Round Successfully!", data: round_details });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.update_candidate_selection_status = async (req, res) => {
    try {
        const { candidate_id, jd_id, selection_status, final_remarks } = req.body;

        let updateData = { selection_status, final_remarks };

        if (selection_status === "SELECTED_WITHOUT_BGV") {
            updateData.bgv_status = 'COMPLETED';
        }
        const update_status = await db.job_descripition_email.update(updateData, {
            where: { id: candidate_id, job_descripition_id: jd_id }
        });

        if (update_status[0] > 0) {
            return res.status(200).send({
                code: 200,
                message: "Candidate Status Updated Successfully!",
                data: update_status
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "Unable to update!"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.get_cand_interviewer_details = async (req, res) => {
    try {
        const { candidate_id, interview_round, jd_id } = req.query;
        const interviewer_list = await db.sequelize.query(
            `SELECT I.id,CI.interview_round,U.first_name,U.last_name,I.interview_status FROM RECRUITMENT_CANDIDATE_INTERVIEW AS CI 
            INNER JOIN RECRUITMENT_CANDIDATE_INTERVIEWER AS I ON I.round_id=CI.id
            INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id=I.interviewer_id
            WHERE CI.candidate_id= ${candidate_id} AND CI.jd_id=${jd_id} AND CI.interview_round=${interview_round} AND U.status ="ACTIVE" AND U.isDeleted=0`,
            { type: db.sequelize.QueryTypes.SELECT }
        );
        if (interviewer_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Interviewer Details Successfully!", data: interviewer_list });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}
exports.getCandidateIdByUuid = async (req, res) => {
    try {
        const { uuid } = req.params;

        const candidate = await db.job_descripition_email.findOne({
            where: {
                resume_id: uuid
            },
            attributes: ["id"]
        });

        if (!candidate) {
            return res.status(404).send({
                code: 404,
                message: "Candidate not found"
            });
        }

        return res.status(200).send({
            code: 200,
            message: "Candidate ID fetched successfully",
            id: candidate.id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};