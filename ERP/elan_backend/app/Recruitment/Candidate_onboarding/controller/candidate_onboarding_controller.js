const db = require("../../../models/index");
const { Op, where } = require("sequelize");
const path = require('path');
const fs = require('fs');
var bcrypt = require("bcryptjs");
const puppeteer = require('puppeteer');
const User = db.user;
const { sendCandidateOfferMail, sendMailtoFillCandidatedetails } = require("../../utils/mail/mail");
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const logger = require('../../../../logger/index');
const { isDataView } = require("util/types");

exports.approve_offer_letter = async (req, res) => {
    try {
        const { offer_id, approval_status, approval_remarks } = req.body;
        const update_status = await db.candidate_offer_letter.update({ approval_status, approval_remarks }, { where: { id: offer_id } });
        if (update_status) {
            return res.status(200).send({ code: 200, message: "Offer Letter Approved Successfully!", data: update_status });
        } else {
            return res.status(404).send({ code: 404, message: "Not able to Approve!" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.update_offer_letter = async (req, res) => {
    try {
        const { offer_id, base_salary, reporting_manager_id, contract_types_id, probation_period, location, exp_joining_date } = req.body;
        const update_offer = await db.candidate_offer_letter.update({ base_salary, reporting_manager_id, contract_types_id, probation_period, location, exp_joining_date }, { where: { id: offer_id } });
        if (update_offer) {
            return res.status(200).send({ code: 200, message: "Offer Letter updated Successfully!", data: update_offer });
        } else {
            return res.status(404).send({ code: 404, message: "Not able to update!" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let daySuffix;
    if (day % 10 === 1 && day !== 11) {
        daySuffix = 'st';
    } else if (day % 10 === 2 && day !== 12) {
        daySuffix = 'nd';
    } else if (day % 10 === 3 && day !== 13) {
        daySuffix = 'rd';
    } else {
        daySuffix = 'th';
    }
    return `${day}${daySuffix} ${month} ${year}`;
}

exports.generate_pdf = async (req, res) => {
    try {
        let { candidate_id, entity_id, jd_id } = req.query;
        const htmlPath = 'app/Recruitment/templates/offer-letter.html';
        if (!fs.existsSync(htmlPath)) {
            throw new Error('HTML file not found');
        }

        const query = `
        SELECT OL.*, E.first_name, E.last_name, JD.job_title, JD.experience, D.designation_name, C.contract_type, EM.entity_name, EM.logo, EM.registered_office, B.branch_name
        FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id = OL.candidate_id
        LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id = E.job_descripition_id
        LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
        LEFT JOIN MASTER_CONTRACT AS C ON C.id = OL.contract_types_id
        LEFT JOIN ENTITY_MASTER AS EM ON EM.id = OL.entity_id
        LEFT JOIN MASTER_BRANCH AS B ON B.id = OL.location_id
        WHERE OL.candidate_id = :candidate_id AND OL.entity_id = :entity_id AND E.job_descripition_id = :jd_id`;

        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { candidate_id, entity_id, jd_id }
        });
        let allowance_details = await db.candidate_offer_allowance.findAll({
            where: { offer_id: getAllData[0].id, status: "ACTIVE", isDeleted: false }
        })
        let data = getAllData[0];
        const joiningDate = formatDate(data.exp_joining_date);

        if (getAllData.length === 0) {
            throw new Error('No data found for the provided IDs');
        }
        let html = fs.readFileSync(htmlPath, 'utf8');
        let finalHtml = html.replace('{{referenceNumber}}', data.reference_number || '')
            .replace('{{registered_office}}', data.registered_office || '')
            .replace('{{work_location}}', data.branch_name || '')
            .replace('{{exp_joining_date}}', joiningDate || '')
            .replace('{{job_title}}', data.job_title || '')
            .replace('{{designation_name}}', data.designation_name || '')
            .replace('{{position}}', data.designation_name || '')
            .replace('{{candidateName}}', `${data.first_name} ${data.last_name}` || '')
            .replace('{{base_salary}}', data.base_salary || '')
            .replace('{{contract_type}}', data.contract_type || '')
            .replace('{{probation_period}}', data.probation_period || '')
            .replace('{{logo}}', data.logo || '');

        let allowanceHtml = '';
        allowance_details.forEach(allowance => {
            allowanceHtml += `<li>${allowance.allowance_name}: ${allowance.allowance_amount}</li>`;
        });
        finalHtml = finalHtml.replace('{{allowance_details}}', allowanceHtml);

        const browser = await puppeteer.launch({
            headless: true,  
            args: ['--no-sandbox', '--disable-setuid-sandbox']
            
        });const page = await browser.newPage();
        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();
        const pdfDir = 'generated_offer_letters';
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }
        const cur_date = `${String(new Date().getDate()).padStart(2, '0')}_${String(new Date().getMonth() + 1).padStart(2, '0')}_${new Date().getFullYear()}`;
        const pdfFilename = `${cur_date}_Offer-letter_${candidate_id}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFilename);
        fs.writeFileSync(pdfPath, pdfBuffer);
        await db.candidate_offer_letter_doc.create({ candidate_id, entity_id, jd_id, offer_letter_doc: pdfFilename });
        await db.candidate_offer_letter.update({ approval_status: "GENERATED" }, { where: { candidate_id } });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
        return res.status(200).send({ code: 200, message: "Offer Letter Generated Successfully!" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error('Error generating PDF:', error);
        res.status(500).send({ code: 500, message: error.message || 'An error occurred while generating the PDF.' });
    }
};

exports.download_offer_letter = async (req, res) => {
    try {
        const { candidate_id } = req.params;
        const offer_details = await db.candidate_offer_letter_doc.findOne({
            where: { candidate_id, status: "ACTIVE" },
            order: [["id", "DESC"]]
        });
        if (!offer_details) {
            return res.status(404).send({ message: "Offer letter not found." });
        }
        const filePath = path.join(__dirname, '../../../../generated_offer_letters/', offer_details.offer_letter_doc);
        res.download(filePath, (err) => {
            if (err) {
                return res.status(500).send({ message: "Could not download the file. " + err });
            }
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        res.status(500).send({ message: "An error occurred. " + error });
    }
};

exports.sendCandidate_offer_letter_link = async (req, res) => {
    try {
        const { candidate_id, link_url, entityId } = req.body;
        const link_urll = link_url + '?id=' + candidate_id;
        const candidate_detail = await db.job_descripition_email.findOne({ where: { id: candidate_id, status: "ACTIVE", isDeleted: false } });
        let email_to = candidate_detail.email;
        let first_name = candidate_detail.first_name;
        let last_name = candidate_detail.last_name;
        const mailSent = await sendCandidateOfferMail(email_to, first_name, last_name, link_urll, entityId);
        if (mailSent) {
            return res.status(200).send({ code: 200, message: "Mail Sent Successfully!" });
        } else {
            return res.status(200).send({ code: 200, message: "Unable to Sent!" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.updateCandidate_OfferStatus = async (req, res) => {
    try {
        const { candidate_id, remarks, candidate_offer_status } = req.body;
        const updated_stutus = await db.candidate_offer_letter.findOne({ where: { candidate_id, candidate_offer_status: "ACCEPTED" } });
        if (!updated_stutus) {
            if (candidate_offer_status === "ACCEPTED") {
                const update_status = await db.candidate_offer_letter.update({ candidate_remarks: remarks, candidate_offer_status }, { where: { candidate_id } });
                if (update_status) {
                    return res.status(200).send({ code: 200, message: "I am accepting this Offer!!" });
                } else {
                    return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
                }
            } else {
                const update_status = await db.candidate_offer_letter.update({ remarks, candidate_offer_status }, { where: { candidate_id } });
                if (update_status) {
                    return res.status(200).send({ code: 200, message: "I am not able to accept this Offer!" });
                } else {
                    return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
                }
            }
        } else {
            return res.status(403).send({ code: 403, message: "You have already accepted the offer letter!" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getCandidateoffer_detailsBYID = async (req, res) => {
    try {
        const { candidate_id } = req.params;
        const query = `
            SELECT OL.*,D.designation_name,JD.job_title,E.first_name,E.last_name,C.contract_type,U.first_name AS report_manag_fname,U.last_name AS report_manag_lname FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id=OL.reporting_manager_id
            LEFT JOIN MASTER_CONTRACT AS C ON C.id=OL.contract_types_id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            WHERE OL.candidate_id=${candidate_id}`
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        const allowance_details = await db.candidate_offer_allowance.findAll({ where: { offer_id: getAllData[0].id, status: "ACTIVE", isDeleted: false } });
        getAllData.forEach(result => { result.allowance_details = allowance_details });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched Offer Details By ID Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_OnboardedEmployeeList = async (req, res) => {
    try {
        const { entity_id } = req.params;
        const query = `
            SELECT OL.id,OL.candidate_id,OL.base_salary,OL.candidate_offer_status,OL.candidate_remarks,JD.job_title,E.first_name AS candidate_fname,E.last_name AS candidate_lname,E.email,E.country_code,D.designation_name,E.contact_number,OL.exp_joining_date,E.onboarding_status FROM RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL 
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E ON E.id=OL.candidate_id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            WHERE OL.candidate_offer_status="ACCEPTED" OR OL.candidate_offer_status="ONBOARDED" AND OL.status="ACTIVE" AND OL.isDeleted=0 AND OL.entity_id=${entity_id}`
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched Onboarded Employee Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.sendmail_to_fill_candidate_details = async (req, res) => {
    try {
        const { candidate_id, link_url, entityId } = req.body;
        const link_urll = link_url + '?candidate_id=' + candidate_id;
        const candidate_detail = await db.job_descripition_email.findOne({ where: { id: candidate_id, status: "ACTIVE", isDeleted: false } });
        let email_to = candidate_detail.email;
        let first_name = candidate_detail.first_name;
        let last_name = candidate_detail.last_name;
        const mailSent = await sendMailtoFillCandidatedetails(email_to, first_name, last_name, link_urll, entityId);
        if (mailSent) {
            return res.status(200).send({ code: 200, message: "Mail Sent Successfully!" });
        } else {
            return res.status(200).send({ code: 200, message: "Unable to Sent!" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getCandidate_detailsByID = async (req, res) => {
    try {
        const { candidate_id } = req.params;
        const query = `
            SELECT E.*,OL.id as offer_id,OL.probation_period,OL.exp_joining_date,OL.location_id,OL.reporting_manager_id,OL.contract_types_id,OL.entity_id,JD.job_title,JD.experience,JD.department_id,JD.qualification_name,D.designation_name,U.first_name AS reportingM_fname,U.last_name AS reportingM_lname,C.contract_type,JD.contract_types_id,MD.department_name,JD.designation_id,OL.base_salary AS monthly_salary,EM.entity_name FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS E 
            LEFT JOIN RECRUITMENT_CANDIDATE_OFFER_LETTER AS OL ON OL.candidate_id=E.id
            LEFT JOIN RECRUITMENT_JOB_DESCRIPITION AS JD ON JD.id=E.job_descripition_id
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id=OL.reporting_manager_id
            LEFT JOIN MASTER_CONTRACT AS C ON C.id=OL.contract_types_id
            LEFT JOIN DESIGNATION AS D ON D.designation_id = JD.designation_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id=JD.department_id
            LEFT JOIN ENTITY_MASTER AS EM ON EM.id=OL.entity_id
            WHERE E.status="ACTIVE" AND E.isDeleted=0 AND OL.status="ACTIVE" AND OL.isDeleted=0 AND E.id=${candidate_id}`
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        const allowance_details = await db.candidate_offer_allowance.findAll({ where: { offer_id: getAllData[0].offer_id, status: "ACTIVE", isDeleted: false } });
        getAllData.forEach(result => { result.allowance_details = allowance_details });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched Onboarded Employee Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.register_onboarded_employee = async (req, res) => {
    try {
        let { title, candidate_id, employee_id, first_name, middle_name, last_name, gender, date_of_birth, emp_personal_email, contact_number, country_code, reporting_manager, reporting_manager_id, location_id, department_id, designation_id, emplyoment_type_id, employee_photo, date_of_joining, entity_id, entity_name, present_country_id, present_state_id, present_city_id, permanent_country_id, permanent_state_id, permanent_city_id, personal_country_id, personal_state_id, personal_city_id, present_address, address_check_value, parmanent_address, DIRE_number, driving_license_number, blood_group, id_number, issued_date, exp_date, tax_number, passport_number, marital_status, spouse_name, family_details, prev_employer_details, basic_salary, allowanace_details, history_salary, bank_id, employee_name_in_bank, bank_address, account_number, re_enter_account_no, nuit_number, bank_district_name, inss_number, documents_detail, contract_types_id, start_working_date, end_date_probation, tab_type } = req.body;

        if (emp_personal_email && !employee_id) {
            const alreadyexist = await db.user.findOne({ where: { emp_personal_email, isDeleted: false } });
            if (!alreadyexist) {
                const employee_save = await User.create({
                    title, primary_entity_id: entity_id, first_name, middle_name, last_name, gender, date_of_birth, emp_personal_email, contact_number, country_code, reporting_manager, reporting_manager_id, location_id, department_id, designation_id, emplyoment_type_id, date_of_joining, employee_photo, status: "ONBOARDED", candidate_id
                });
                const candidate_entity = await db.user_entity.create({
                    entity_id, entity_name, employee_id: employee_save.employee_id
                });
                const update_status = await db.candidate_offer_letter.update({
                    candidate_offer_status: "ONBOARDED"
                }, { where: { candidate_id } })
                if (employee_save && login_save && candidate_entity && update_status) {
                    return res.status(200).send({ code: 200, message: "Candidate Registered Successfully!", user_id: employee_save.employee_id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Registered" });
                }
            } else {
                const basic_details = await User.update({
                    title, primary_entity_id: entity_id, first_name, middle_name, last_name, gender, date_of_birth, emp_personal_email, contact_number, country_code, reporting_manager, reporting_manager_id, location_id, department_id, designation_id, emplyoment_type_id, date_of_joining, employee_photo
                }, { where: { emp_personal_email } });
                if (basic_details) {
                    return res.status(200).send({ code: 200, message: "Basic Details Updated Successfully!", user_id: alreadyexist.employee_id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            }
        } else {
            if (employee_id && tab_type == 'Personal') {
                var personal_details = await User.update({
                    present_country_id, present_state_id, present_city_id, permanent_country_id, permanent_state_id, permanent_city_id, personal_country_id, personal_state_id, personal_city_id, present_address, address_check_value, parmanent_address, DIRE_number, driving_license_number, blood_group, id_number, issued_date, exp_date, tax_number, passport_number, marital_status, spouse_name
                }, { where: { employee_id: employee_id } });
                if (family_details) {
                    await db.user_family.destroy({ where: { employee_id } });
                    await Promise.all(family_details.map(async (details) => {
                        const { member_name, date_of_birth, relation, country_code, contact_number, remarks, emergency_contact } = details;
                        const family_detailss = await db.user_family.create({
                            member_name, date_of_birth, relation, country_code, contact_number, remarks, emergency_contact, employee_id
                        });
                        return family_detailss;
                    }))
                }
                if (prev_employer_details) {
                    await db.user_prev_employer.destroy({ where: { employee_id } });
                    await Promise.all(prev_employer_details.map(async (details) => {
                        const { company_name, from_date, to_date, last_salary, reason_of_leaving, location } = details;
                        const prev_emp = await db.user_prev_employer.create({
                            company_name, from_date, to_date, last_salary, reason_of_leaving, location, employee_id
                        });
                        return prev_emp;
                    }))
                }
                if (personal_details) {
                    return res.status(200).send({ code: 200, message: "Family Details Updated Successfully!", user_id: employee_id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            } else if (employee_id && tab_type == 'Salary') {
                var salary = await User.update({
                    basic_salary
                }, { where: { employee_id } });

                await db.user_allowance.destroy({ where: { employee_id } });
                const allow_details = await Promise.all(allowanace_details.map(async (details) => {
                    const { allowance_name, allowance_amount } = details;
                    const allowance = await db.user_allowance.create({
                        allowance_name, allowance_amount, employee_id
                    });
                    return allowance;
                }))
                await db.user_salary.destroy({ where: { employee_id } });
                const salary_history = await Promise.all(history_salary.map(async (details) => {
                    const { salary_Year, salary_month, new_salary, old_salary, percent_increment, remarks } = details;
                    const salaryy = await db.user_salary.create({
                        salary_Year, salary_month, new_salary, old_salary, percent_increment, remarks, employee_id
                    });
                    return salaryy;
                }))
                if (salary && allow_details && salary_history) {
                    return res.status(200).send({ code: 200, message: "Salary Details Updated Successfully!", user_id: employee_id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            } else if (employee_id && tab_type == 'Payment') {
                var bank_details = await User.update({
                    bank_id, employee_name_in_bank, bank_address, account_number, re_enter_account_no, nuit_number, bank_district_name, inss_number
                }, { where: { employee_id } });
                if (bank_details) {
                    return res.status(200).send({ code: 200, message: "Salary Details Updated Successfully!", user_id: employee_id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            } else if (employee_id && tab_type == 'Document') {
                await db.user_documents.destroy({ where: { employee_id } });
                const documents_details = await Promise.all(documents_detail.map(async (details) => {
                    const { document_name, document_description, documents } = details;
                    const doc_details = await db.user_documents.create({
                        document_name, document_description, documents, employee_id
                    });
                    return doc_details;
                }))
                if (documents_details) {
                    return res.status(200).send({ code: 200, message: "Salary Details Updated Successfully!", user_id: employee_id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            } else if (employee_id && tab_type == 'Contract') {
                function convertToIST(utcDateString) {
                    return new Date(new Date(utcDateString).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
                }
                start_working_date = convertToIST(start_working_date);
                end_date_probation = convertToIST(end_date_probation);
                var contract_save = await User.update({
                    contract_types_id, start_working_date, end_date_probation
                }, { where: { employee_id } });
                const candidate_status = await db.job_descripition_email.update({
                    onboarding_status: "ONBOARDED",
                }, { where: { id: candidate_id } });
                if (contract_save || candidate_status) {
                    return res.status(200).send({ code: 200, message: "Salary Details Updated Successfully!", user_id: employee_id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            }
            return res.status(200).send({ code: 200, message: "Employee Details Updated Successfully!", user_id: employee_id });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
}

exports.update_onboarded_employee_status = async (req, res) => {
    try {
        const { candidate_id, employee_official_email, status } = req.body;

        const alreadyexist = await db.user.findOne({ where: { candidate_id, status: "ACTIVE" } });
        if (alreadyexist) {
            return res.status(200).send({ code: 200, message: "Candidate Already Onboarded!" });
        }
        const emp_Variable = "Elite";
        const lastEntry = await db.user.findOne({
            where: { status: "ACTIVE" }, order: [["createdAt", "DESC"]],
            attributes: ["employee_code"],
        });

        const lastNumber = lastEntry && lastEntry.employee_code ? parseInt(lastEntry.employee_code.slice(-5), 10) : 0;
        const number = isNaN(lastNumber) ? 1 : lastNumber + 1;
        const code = String(number).padStart(5, "0");
        const employee_code = `${emp_Variable}${code}`;
        var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 14;
        let password = "";
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }

        const update_status = await db.user.update(
            { status, employee_code, employee_official_email },
            { where: { candidate_id } }
        );
        const candidate = await db.user.findOne({ where: { isDeleted: false, candidate_id } });
        const login_save = await db.user_login.create({
            employee_official_email, password: bcrypt.hashSync(password, 8), first_name: candidate.first_name, last_name: candidate.last_name, primary_entity_id: candidate.primary_entity_id, employee_photo: candidate.employee_photo, employee_id: candidate.employee_id
        });
        const update_candistatus = await db.job_descripition_email.update(
            { onboarding_status: "COMPLETED" },
            { where: { id: candidate_id } }
        );

        if (update_status && login_save || update_candistatus) {
            return res.status(200).send({ code: 200, message: "Candidate Onboarded Successfully!!" });
        } else {
            return res.status(200).send({ code: 200, message: "Candidate Didn't Onboard!" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.download_resume = async (req, res) => {
    try {
        const { candidate_id } = req.params;
        const resume_details = await db.job_descripition_email.findOne({
            where: { id: candidate_id, status: "ACTIVE" },
            order: [["id", "DESC"]]
        });
        if (!resume_details) {
            return res.status(404).send({ message: "Resume not found." });
        }
        const filePath = resume_details.cv_upload;
        res.download(filePath, (err) => {
            if (err) {
                return res.status(500).send({ message: "Could not download the file. " + err });
            }
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        res.status(500).send({ message: "An error occurred. " + error });
    }
}