const db = require("../../../models/index");
const { Op, where } = require("sequelize");
const path = require('path');
const { sendmailsforcompanydetails, sendmailsfordocumentsdetails } = require("../../utils/mail/mail");
const { saveNotification } = require("../../../notification/hrms_notification/controller/hrms_notification_controller");

exports.getAll_BGV_selectedcandidate = async (req, res) => {
    try {
        const { jd_id } = req.params;
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
        const profile_details = await db.job_descripition_email.findAll({ where: { job_descripition_id: jd_id, selection_status: "GO_FOR_BGV" } });
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Job Descripition Successfully!", data: getAllData, profile_details });
        } else {
            return res.status(200).send({ code: 200, message: "No Record Found!", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.create_company_details = async (req, res) => {
    try {
        const { candidate_document, candidate_description, company_details, candidate_id, email_url, entityId } = req.body;
        const alreadyexists = await db.candidate_bgv.findOne({ where: { candidate_id, status: "ACTIVE" } });
        const candidate_detail = await db.job_descripition_email.findOne({ where: { id: candidate_id, selection_status: "GO_FOR_BGV" } });

        let create_bgv;
        let create_bgv_company;
        let email_urlID;
        let first_name = candidate_detail.first_name;
        let last_name = candidate_detail.last_name;
        if (alreadyexists) {
            create_bgv = await db.candidate_bgv.update({
                candidate_document, candidate_description
            }, { where: { candidate_id } });
            await db.candidate_bgv_company.destroy({ where: { can_bgv_id: alreadyexists.id } });
            create_bgv_company = await Promise.all(company_details.map(async (details) => {
                const { company_name, company_email, start_date, end_date } = details;
                const bgv_company = await db.candidate_bgv_company.create({
                    company_name, company_email, start_date, end_date, can_bgv_id: alreadyexists.id
                });
                email_to = company_email;
                email_urlID = email_url + "?id=" + alreadyexists.id + "/" + bgv_company.id;
                await sendmailsforcompanydetails(email_to, first_name, last_name, email_urlID, entityId);
                return bgv_company;
            }));
            if (create_bgv && create_bgv_company) {
                return res.status(200).send({
                    code: 200, message: "Company Details saved and email sent successfully!", data: create_bgv, create_bgv_company
                });
            } else {
                return res.status(404).send({ code: 404, message: "Not able to Saved!" });
            }
        } else {
            create_bgv = await db.candidate_bgv.create({
                candidate_document, candidate_description, candidate_id
            });
            create_bgv_company = await Promise.all(company_details.map(async (details) => {
                const { company_name, company_email, start_date, end_date } = details;
                const bgv_company = await db.candidate_bgv_company.create({
                    company_name, company_email, start_date, end_date, can_bgv_id: create_bgv.id
                });
                email_to = company_email;
                email_urlID = email_url + "?id=" + create_bgv.id + "/" + bgv_company.id;
                await sendmailsforcompanydetails(email_to, first_name, last_name, email_urlID, entityId);
                return bgv_company;
            }));
            if (create_bgv && create_bgv_company) {
                return res.status(200).send({
                    code: 200, message: "Company Details saved and email sent successfully!", data: create_bgv, create_bgv_company
                });
            } else {
                return res.status(404).send({ code: 404, message: "Not able to Saved!" });
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.candidate_update_doc_mail = async (req, res) => {
    try {
        const { candidate_id, email_url, entityId } = req.body;
        const candidate_detail = await db.job_descripition_email.findOne({ where: { id: candidate_id } });
        let email_to = candidate_detail.email;
        let first_name = candidate_detail.first_name;
        let last_name = candidate_detail.last_name;
        let email_urlID = email_url + "?id=" + candidate_id;
        try {
            await sendmailsfordocumentsdetails(email_to, first_name, last_name, email_urlID, entityId);
            return res.status(200).send({
                code: 200,
                message: "Email sent successfully to the candidate!",
                data: email_urlID
            });
        } catch (error) {
            console.error('Failed to send email:', error);
            return res.status(200).send({
                code: 200,
                message: "Company Details saved but failed to send email.",
                data: email_urlID
            });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.upload_candidate_documents = async (req, res) => {
    try {
        const { candidate_id, document_details } = req.body;

        const alreadyexists = await db.candidate_docs.findOne({ where: { candidate_id, status: "ACTIVE" } });
        if (alreadyexists) {
            await db.candidate_docs.destroy({ where: { candidate_id, status: "ACTIVE" } });
            const update_docs = await Promise.all(document_details.map(async (details) => {
                const { document_name, document_number, document_path } = details;
                const candi_docs = await db.candidate_docs.create({
                    document_name, document_number, document_path, candidate_id
                });
                return candi_docs;
            }));
            return res.status(200).send({ code: 200, message: "Documents updated Succesfully!", data: update_docs });
        } else {
            const create_docs = await Promise.all(document_details.map(async (details) => {
                const { document_name, document_number, document_path } = details;
                const candi_docs = await db.candidate_docs.create({
                    document_name, document_number, document_path, candidate_id
                });
                return candi_docs;
            }));
            if (create_docs) {
                return res.status(200).send({ code: 200, message: "Documents Saved Succesfully!" });
            } else {
                return res.status(404).send({ code: 404, message: "Not able to Upload!" });
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_candidate_companyDetails = async (req, res) => {
    try {
        const { cand_bgv_id, comp_id } = req.query;
        const candidate_company_details = await db.sequelize.query(
            `SELECT E.id, E.first_name,E.last_name,E.contact_number,E.email as candidate_email, BD.candidate_document, BD.candidate_description FROM RECRUITMENT_CANDIDATE_BGV_DETAILS AS BD
            INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON BD.candidate_id = E.id
            WHERE BD.id=${cand_bgv_id}`,
            { type: db.sequelize.QueryTypes.SELECT }
        );
        const company_list = await db.candidate_bgv_company.findAll({ where: { can_bgv_id: cand_bgv_id, id: comp_id, isDeleted: false } });
        if (candidate_company_details.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Company Details Successfully!", data: candidate_company_details, company_list });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_all_selfratings = async (req, res) => {
    try {
        const rating_list = await db.self_rating.findAll({ where: { status: "ACTIVE", isDeleted: false } });
        if (rating_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched All Ratings Successfully!", data: rating_list });
        } else {
            return res.status(200).send({ code: 200, message: "No Record Found!", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.create_company_quality_ratings = async (req, res) => {
    try {
        const { company_id, remarks, quality_check_list } = req.body;
        const alreadyexists = await db.company_qual_rating.findAll({ where: { company_id, status: "ACTIVE" } });
        if (alreadyexists.length > 0) {
            return res.status(403).send({ code: 403, message: "Already Submitted the details!" });
        } else {
            const update_remarks = await db.candidate_bgv_company.update({ remarks }, { where: { id: company_id } });
            const create_quality_check = await Promise.all(quality_check_list.map(async (details) => {
                const { quality_type_name, rating_value } = details;
                const company_qualities = await db.company_qual_rating.create({
                    quality_type_name: details.review_name, rating_value, company_id
                });
                return company_qualities;
            }));
            if (update_remarks && create_quality_check) {
                return res.status(200).send({ code: 200, message: "Employer Quality Check Saved Successfully!", data: create_quality_check });
            } else {
                return res.status(404).send({ code: 404, message: "Not able to Saved!" });
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_candidate_company_detailsBYID = async (req, res) => {
    try {
        const { candidate_bgv_id } = req.params;
        const cand_comp_details = await db.sequelize.query(
            `SELECT E.id,E.first_name,E.last_name,E.contact_number,E.country_code,E.email as candidate_email,BD.id as cand_comp_id
            FROM RECRUITMENT_CANDIDATE_BGV_DETAILS AS BD
            INNER JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON BD.candidate_id = E.id
            WHERE E.id=${candidate_bgv_id}`,
            { type: db.sequelize.QueryTypes.SELECT }
        );
        const company_list = await db.candidate_bgv_company.findAll({ where: { can_bgv_id: cand_comp_details[0].cand_comp_id, isDeleted: false } });
        for (const result of company_list) {
            const quality_check_list = await db.company_qual_rating.findAll({ where: { company_id: result.id, isDeleted: false } });
            result.dataValues.quality_check_list = quality_check_list;
        }
        const doc_list = await db.candidate_docs.findAll({ where: { candidate_id: cand_comp_details[0].id, isDeleted: false } });
        if (cand_comp_details.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Candidate Employer Details Successfully!", data: cand_comp_details, company_list, doc_list });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.submit_employer_details = async (req, res) => {
    try {
        const { candidate_id, submit_status, comp_id, cand_bgv_id } = req.body;
        const alreadysubmit = await db.candidate_bgv_company.findOne({ where: { id: comp_id, status: "SUBMITTED" } });
        if (alreadysubmit) {
            return res.status(403).send({ code: 403, message: "You have already Submitted!" });
        } else {
            const updatecompany = await db.candidate_bgv_company.update({ status: submit_status }, { where: { id: comp_id } });
            const totalRows = await db.candidate_bgv_company.count({ where: { can_bgv_id: cand_bgv_id } });
            const submittedRows = await db.candidate_bgv_company.count({ where: { can_bgv_id: cand_bgv_id, status: "SUBMITTED" } });
            const allSubmitted = totalRows > 0 && totalRows === submittedRows;
            if (allSubmitted) {
                await db.job_descripition_email.update({ bgv_status: submit_status }, { where: { id: candidate_id } });
            }
            if (updatecompany) {
                return res.status(200).send({ code: 200, message: "Company remarks Updated Successfully!" });
            } else {
                return res.status(404).send({ code: 404, message: "Not able to Saved!" });
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.update_bgv_statusDetails = async (req, res) => {
    try {
        const { candidate_id, bgv_status, bgv_remarks } = req.body;
        const update_status = await db.job_descripition_email.update({ bgv_status }, { where: { id: candidate_id } });
        const update_remarks = await db.candidate_bgv.update({ bgv_remarks }, { where: { candidate_id } });
        if (update_status && update_remarks) {
            return res.status(200).send({ code: 200, message: "BGV status updated Successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Not able to Saved!" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_all_shortlisted_candidate = async (req, res) => {
    try {
        const { user_id, entity_id, user_role, financial_year_id } = req.query;
        let getAllData;
        if (user_role == 'Super Admin') {
            const query = `
            SELECT E.*,JD.job_title, D.designation_name, MD.department_name,MB.branch_name,JD.entity_id,JD.assign_id,OL.id as offer_id,OL.approval_status,OL.candidate_offer_status FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E 
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL ON E.id=OL.candidate_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JD.department_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = JD.branch_id
            WHERE E.bgv_status="COMPLETED" AND E.selection_status IN ("GO_FOR_BGV", "SELECTED_WITHOUT_BGV") ORDER BY E.id DESC`

            getAllData = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
        } else {
            const getdata = `
            SELECT E.*,JD.job_title, D.designation_name, MD.department_name,MB.branch_name,JD.financial_year_id,JD.entity_id,JD.assign_id,OL.id as offer_id,OL.approval_status ,OL.candidate_offer_status FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E 
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL ON E.id=OL.candidate_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JD.department_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = JD.branch_id
            WHERE E.bgv_status="COMPLETED" AND (JD.created_by=${user_id} OR JD.assign_id=${user_id}) AND E.selection_status IN ("GO_FOR_BGV", "SELECTED_WITHOUT_BGV") ORDER BY E.id DESC`

            getAllData = await db.sequelize.query(getdata, {
                type: db.sequelize.QueryTypes.SELECT,
            });
        }
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched All Candidates Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_shortlisted_candidateBYID = async (req, res) => {
    try {
        const { candidate_id } = req.params;
        const query = `
            SELECT E.*,JD.job_title,JD.salary, D.designation_name FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E 
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            WHERE E.id = ${candidate_id}`
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched Candidate details Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.create_candidate_offer_letter = async (req, res) => {
    try {
        const { entity_id, financial_year_id, candidate_id, reference_number, base_salary, reporting_manager_id, probation_period, location, exp_joining_date, approval_id, offer_remarks, created_by, location_id, salary_type } = req.body;
        const alreadyexists = await db.candidate_offer_letter.findOne({ where: { reference_number, candidate_id, status: "ACTIVE" } });
        if (alreadyexists) {
            if (alreadyexists.candidate_offer_status === "PENDING" || alreadyexists.candidate_offer_status === "NEGOTIATE") {
                alreadyexists.candidate_offer_status = "PENDING";
                alreadyexists.approval_status = "PENDING";
            }
            const update_offer = await db.candidate_offer_letter.update({
                base_salary, reporting_manager_id, probation_period, location, location_id, exp_joining_date, approval_id, offer_remarks, candidate_offer_status: alreadyexists.candidate_offer_status, approval_status: alreadyexists.approval_status, salary_type
            }, { where: { candidate_id, reference_number, entity_id } });
            if (update_offer) {
                return res.status(200).send({ code: 200, message: "Offer Letter Updated Successfully!" });
            } else {
                return res.status(403).send({ code: 403, message: "Unable to Update Offer" });
            }
        } else {
            const create_offer = await db.candidate_offer_letter.create({
                candidate_id, reference_number, base_salary, reporting_manager_id, probation_period, location, location_id, exp_joining_date, approval_id, offer_remarks, entity_id, financial_year_id, created_by, salary_type
            });
            if (create_offer) {
                const notificationData = {
                    employee_id: approval_id,
                    notification_type: "OFFER_LETTER",
                    entity_id: entity_id,
                    message: `You are assigned as approval of offer letter refrence number ${reference_number}`
                };

                await saveNotification(notificationData);
                return res.status(200).send({ code: 200, message: "Company Details saved Successfully!", data: create_offer });
            }
            if (create_offer) {
                return res.status(200).send({ code: 200, message: "Offer Letter Created Successfully!", data: create_offer });
            } else {
                return res.status(404).send({ code: 404, message: "Not able to Create Offer Letter!" });
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_offerletters = async (req, res) => {
    const { entity_id, financial_year_id, user_id, offer_status } = req.query;
    let getAllData;
    if (offer_status == "ALL") {
        const query = `
        SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
        LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
        WHERE OL.entity_id=${entity_id} AND OL.created_by=${user_id}`
        getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
    } else if (offer_status == "APPROVED") {
        const query = `
        SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name 
        FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
        LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
        WHERE OL.entity_id=${entity_id} AND OL.created_by=${user_id} OR OL.approval_id=${user_id} AND OL.approval_status = "APPROVED"`
        getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
    } else if (offer_status == "REJECTED") {
        const query = `
        SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
        LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
        WHERE OL.entity_id=${entity_id} AND OL.created_by=${user_id} AND OL.approval_status = "REJECTED"`
        getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
    } else if (offer_status == "PENDING") {
        const query = `
        SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name 
        FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
        LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
        WHERE OL.entity_id=${entity_id} AND OL.approval_status = "PENDING" AND OL.approval_id=${user_id}`
        getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
    } else if (offer_status == "NEGOTIATE") {
        const query = `
        SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
        LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
        WHERE OL.entity_id=${entity_id} AND OL.candidate_offer_status = "NEGOTIATE" AND OL.approval_id=${user_id}`
        getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
    }
    else {
        return res.status(404).send({ code: 404, message: "Offer Status unable to find!", data: [] });
    }
    if (getAllData) {
        return res.status(200).send({ code: 200, message: "Fetched Offer Details Successfully!", data: getAllData });
    } else {
        return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
    }
}

exports.getoffer_detailsBYID = async (req, res) => {
    try {
        const { offer_id } = req.params;
        const query = `
            SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            WHERE OL.id=${offer_id}`
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched Offer Details By ID Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}