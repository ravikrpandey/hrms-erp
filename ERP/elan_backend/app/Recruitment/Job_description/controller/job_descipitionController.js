
const db = require("../../../models/index");
const { Op, where } = require("sequelize");
const path = require('path')
const { sendJobResultMail } = require("../../utils/mail/mail");
const logger = require('../../../../logger/index');
const OpenAIApi = require('openai');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: "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" });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const processFileAndSendToSolr = require("../../../services/solrinsert");
const solr = require('solr-client');

exports.createJob_descripition = async (req, res) => {
    try {
        const {
            job_title, designation_id, leadership, contract_types_id, start_date, end_date, department_id, area_id,
            branch_id, entity_id, experience, tab_type, created_on, descripition, age_range_min, age_range_max,
            monthly_salary, level_of_interview, job_status, qualification_name, id, assign_id,
            spoc_id, item, question_item, upload_document, job_request_id, created_by, number_of_positions, financial_year_id,
            openAiJdString, aiEngine, vendor_id,selectedshare_profile,job_Type_id
        } = req.body;
        const message = openAiJdString || "Please generate a job description";
        const lastJD = await db.job_descripition.findOne({
            order: [["id", "DESC"]],
        });

        let jd_number = "JD000";
        if (lastJD) {
            const lastJD_id = lastJD.id;
            jd_number += lastJD_id + 1;
        } else {
            jd_number += "1";
        }
        if (tab_type == 'Job Details') {
            if (id) {
                const createdJob = await db.job_descripition.update({
                    job_title, designation_id, leadership, contract_types_id, start_date, end_date, department_id, area_id, branch_id,
                    entity_id, experience, job_request_id, created_by, number_of_positions, financial_year_id, openAiJdString,job_Type_id
                }, { where: { id: id } });
                for(let i=0;i<selectedshare_profile.length;i++){
                    let job_share=await db.job_descripition_share_type.update({
                        job_share_type_id:selectedshare_profile[i],
                        job_id:createdJob?.id
                    })
                }
                if (createdJob) {
                    return res.status(200).send({ code: 200, message: 'Job Details Updated Successfully!', data: id });
                }
            }
            else {
                const createdJob = await db.job_descripition.create({
                    job_title, designation_id, leadership, contract_types_id, start_date, end_date, department_id, area_id, branch_id,
                    entity_id, experience, job_request_id, created_by, number_of_positions, jd_number, financial_year_id, openAiJdString,job_Type_id
                });
                for(let i=0;i<selectedshare_profile.length;i++){
                let job_share=await db.job_descripition_share_type.create({
                    job_share_type_id:selectedshare_profile[i],
                    job_id:createdJob?.id
                })
            }
                if (aiEngine === "Gemini") {
                    const genAI = new GoogleGenerativeAI("AIzaSyDHnSYwbJ7u0x2NfxMF9RygLo-D2rM0_cY");
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const result = await model.generateContent([message]);
                    bulletPoints = result.response.text();
                }
                if (aiEngine === "Groq") {
                    const response = await groq.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content: message,
                            },
                        ],
                        model: "llama3-8b-8192",
                    });

                    const content = response.choices[0]?.message?.content || "No content returned";
                    bulletPoints = content.split("\n").map(line => `• ${line.trim()}`).join("\n");
                }
                if (aiEngine === "OpenAi") {
                    const openai = new OpenAIApi.OpenAI({
                        apiKey: "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"
                    });

                    const chatCompletion = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: 'user', content: message }],
                        max_tokens: 100,
                    });

                    bulletPoints = chatCompletion.choices[0].message.content;
                }
                return res.status(200).send({ code: 200, message: 'Job Details created successfully', data: createdJob.id, bulletPoints });
            }
        } else {
            if (id && tab_type == 'Job Description') {
                const Job_Description_details = await db.job_descripition.update({
                    upload_document, descripition
                }, { where: { id: id } });
                if (Job_Description_details) {
                    return res.status(200).send({ code: 200, message: "Job Description Details Updated Successfully!", data: id, jd: bulletPoints, });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            } else if (id && tab_type == 'Job requirements') {
                const Job_requirements = await db.job_descripition.update({
                    age_range_min, age_range_max, monthly_salary, level_of_interview, job_status,
                    created_on, qualification_name, assign_id, spoc_id, vendor_id
                }, { where: { id: id } });
                if (Job_requirements) {
                    return res.status(200).send({ code: 200, message: "Job requirements Details Updated Successfully!", data: id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            } else if (id && tab_type == 'Skill') {
                await db.job_descripition_skill.destroy({ where: { id } });
                const job_skill_descripition = await Promise.all(item.map(async (details) => {
                    const { skill_name } = details;
                    await db.job_descripition_skill.create({
                        skill_name, job_descripition_id: id,
                    });
                }))
                if (job_skill_descripition) {
                    return res.status(200).send({ code: 200, message: "skill Details Updated Successfully!", data: id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            }
            else if (id && tab_type == 'Questions') {
                const { percentage, isCompletedJd } = req.body;
                await db.job_descripition_question.destroy({ where: { id } });
                await db.job_descripition.update({ percentage, isCompletedJd }, { where: { id } });
                const job_question_descripition = await Promise.all(question_item.map(async (details) => {
                    const { question, answer, } = details;
                    await db.job_descripition_question.create({
                        question, answer, job_descripition_id: id
                    });
                }))
                if (job_question_descripition) {
                    return res.status(200).send({ code: 200, message: "Question Details Updated Successfully!", data: id });
                } else {
                    return res.status(404).send({ code: 404, message: "Unable To Update" });
                }
            }
            return res.status(200).send({ code: 200, message: "Job Descripition Details Updated Successfully!", data: id });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.get_Approved_Jobdescription = async (req, res) => {
    try {
        const { employee_id, entity_id, financial_year_id } = req.query;
        const query = `
      SELECT pp.*,JR.*,HRU.first_name,HRU.last_name,MD.department_name,MA.area_name,MB.branch_name,D.designation_name,
      MC.contract_type,F.cost_center_name,R.reason_for_recruitment
      FROM ESS_JOB_APPROVEL_LEVEL AS pp
      INNER JOIN ESS_JOB_REQUEST AS JR ON JR.id = pp.job_request_id
      INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = JR.user_id
      INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JR.department_id
      INNER JOIN MASTER_AREA AS MA ON MA.id = JR.area_id
      INNER JOIN MASTER_BRANCH AS MB ON MB.id = JR.branch_id
      INNER JOIN DESIGNATION AS D ON D.designation_id = JR.designation_id
      INNER JOIN MASTER_CONTRACT AS MC ON JR.contract_types_id = MC.id
      LEFT JOIN FINANCE_COST_CENTER AS F ON JR.cost_center_id = F.id
      INNER JOIN MASTER_REASON_RECRUITMENT AS R ON JR.reason_id = R.id
        WHERE pp.employee_id = '${employee_id}' AND JR.entity_id = ${entity_id} AND JR.financial_id=${financial_year_id}
        AND pp.Approvel_status = 'APPROVED'
        ORDER BY pp.id DESC;
        `;
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (getAllData) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Approved Approvals Successfully !",
                data: getAllData,
            });
        } else {
            return res.status(200).send({
                code: 200,
                message: "No Approved Approvals Found for This Employee !", data: []
            });
        }
    } catch (error) {
        console.error(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};

exports.getAll_job_descripition = async (req, res) => {
    try {
        let id = req.params.id;
        id = parseInt(id);
        const query = `
            SELECT RJ.*,D.designation_name,MC.contract_type,MD.department_name,MA.area_name,MB.branch_name,HRU.first_name as emp_first,
            HRU.last_name  as emp_last,HR.first_name,HR.last_name
            FROM RECRUITMENT_JOB_DESCRIPITION AS RJ
            LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
            LEFT JOIN MASTER_CONTRACT AS MC ON MC.id = RJ.contract_types_id
            LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
            LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
            LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
            LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
            LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = RJ.spoc_id
            WHERE RJ.id = ${id}`
        const query_skill = `
                SELECT RJS.id,RJS.skill_name,RJS.job_descripition_id
                FROM RECRUITMENT_JOB_SKILL AS RJS
                WHERE RJS.job_descripition_id = ${id}
                `
        const query_question = `
                SELECT RJQ.id,RJQ.job_descripition_id,RJQ.question,RJQ.answer
                FROM RECRUITMENT_JOB_QUESTION AS RJQ
                WHERE RJQ.job_descripition_id = ${id}
                `
        const share_profile=`
        SELECT * FROM RECRUITMENT_JOB_SHARE_TYPE WHERE job_id=${id}
        `
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        const getAllData_skill = await db.sequelize.query(query_skill, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { id: id }
        });

        const getAllData_question = await db.sequelize.query(query_question, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { id: id }
        });
        const share_profile_data = await db.sequelize.query(share_profile, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { id: id }
        });

        if (getAllData) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Job Descripition Successfully!",
                data: getAllData, getAllData_skill, getAllData_question,share_profile_data
            });
        } else {
            return res.status(200).send({
                code: 200,
                message: "No Found Data!", data: []
            });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.createjob_email = async (req, res) => {
    try {
        const { jd_id, entityId } = req.query;
        const candidate_details = await db.job_descripition_email.findOne({ where: { id: jd_id, status: "ACTIVE" } });
        if (candidate_details) {
            let email_to = candidate_details.email;
            let first_name = candidate_details.first_name;
            let result = candidate_details.selection_status;
            await sendJobResultMail(email_to, first_name, result, entityId);
        }

        try {
            if (candidate_details) {
                await processFileAndSendToSolr.processFileAndSendToSolr(candidate_details.cv_upload, candidate_details.id);
            }
        } catch (e) {
            console.log("solr error", e)
        } finally {
            return res.status(200).json({ code: 200, message: "JD Created Successfully!", data: candidate_details });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_all_job = async (req, res) => {
    try {
        const { user_id, entity_id, user_role, financial_year_id } = req.query;
        let getAllData;
        if (user_role == 'Super Admin') {
            const query = `
                SELECT RJ.*,D.designation_name,MC.contract_Type,MD.department_name,MA.area_name,MB.branch_name,HRU.first_name,
                HRU.last_name,HR.first_name,HR.last_name
                FROM RECRUITMENT_JOB_DESCRIPITION AS RJ
                LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
                LEFT JOIN MASTER_CONTRACT AS MC ON MC.id = RJ.contract_types_id
                LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
                LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
                LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
                LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
                LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = RJ.spoc_id WHERE RJ.entity_id=${entity_id} AND RJ.financial_year_id=${financial_year_id}`

            getAllData = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
        } else {
            const query = `
                SELECT RJ.*,D.designation_name,MC.contract_Type,MD.department_name,MA.area_name,MB.branch_name,HRU.first_name,
                HRU.last_name,HR.first_name,HR.last_name
                FROM RECRUITMENT_JOB_DESCRIPITION AS RJ
                LEFT JOIN DESIGNATION AS D ON D.designation_id = RJ.designation_id
                LEFT JOIN MASTER_CONTRACT AS MC ON MC.id = RJ.contract_types_id
                LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = RJ.department_id
                LEFT JOIN MASTER_AREA AS MA ON MA.id = RJ.area_id
                LEFT JOIN MASTER_BRANCH AS MB ON MB.id = RJ.branch_id
                LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RJ.assign_id
                LEFT JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = RJ.spoc_id WHERE RJ.created_by=${user_id} OR RJ.assign_id=${user_id} AND RJ.entity_id=${entity_id} AND RJ.financial_year_id=${financial_year_id}`

            getAllData = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
        }
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetched All Job Descripition Successfully!", data: getAllData });
        } else {
            return res.status(200).send({ code: 200, message: "No Found Data!", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_all_question = async (req, res) => {
    try {
        const getAllData = await db.job_descripition_question.findAll({
            where: { status: "ACTIVE" },
        })
        if (getAllData) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Job Question Successfully!",
                data: getAllData,
            });
        }
        else {
            return res.status(200).send({
                code: 200,
                message: "No Found Data!", data: []
            });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_user_selection_answer = async (req, res) => {
    try {
        const { item, first_name, last_name, middle_name, contact_number, email, cv_upload, country_code, contact_detail, profile_type } = req.body;
        const id = req.params.id;
        const existCandidate = await db.job_descripition_email.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { contact_number: contact_number }
                ], job_descripition_id: id
            }
        });
        if (existCandidate) {
            return res.status(404).send({ code: 400, message: "You have already applied for Same JD" });
        } else {
            const query = `
            SELECT RJ.id, RJ.question, RJ.answer, RD.percentage
            FROM RECRUITMENT_JOB_QUESTION AS RJ
            INNER JOIN RECRUITMENT_JOB_DESCRIPITION AS RD ON RD.id = RJ.job_descripition_id
            WHERE RD.id = '${id}'
        `;
            const getAllData = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            if (getAllData.length > 0) {
                const updateDataArray = item.map(async (updateData, index) => {
                    const { question_id, selection_answer } = updateData;
                    const answer = getAllData[index].answer;

                    let updatedStatus = "REJECTED";
                    if (answer === selection_answer) {
                        updatedStatus = "SELECTED";
                    }
                    try {
                        await db.job_descripition_question.update({
                            selection_answer: selection_answer,
                            selection_status: updatedStatus,
                        }, {
                            where: {
                                id: question_id
                            },
                        });
                    } catch (error) {
                        console.error(`Error updating question_id=${question_id}:`, error);
                    }
                });
                await Promise.all(updateDataArray);
                const updatedQuestions = await db.job_descripition_question.findAll({
                    where: {
                        job_descripition_id: id,
                        selection_status: "SELECTED"
                    }
                });
                const correctCount = updatedQuestions.length;

                const totalQuestionsData = await db.job_descripition_question.count({
                    where: {
                        job_descripition_id: id
                    }
                });

                const total_questions = totalQuestionsData;
                const selected_percentage = (correctCount / total_questions) * 100;

                const JDCreate = await db.job_descripition_email.create({
                    first_name, last_name, middle_name, contact_number, email, cv_upload, selected_percentage, job_descripition_id: id, country_code, contact_detail, profile_type
                })

                const jobDescription = await db.job_descripition.findByPk(id);
                let result;

                if (selected_percentage >= jobDescription.percentage) {

                    result = "SELECTED"
                    await db.job_descripition_email.update({
                        selection_status: "SELECTED"
                    }, {
                        where: {
                            id: JDCreate.id
                        }
                    });
                } else {
                    result = "REJECTED"
                    await db.job_descripition_email.update({

                        selection_status: "REJECTED"
                    }, {
                        where: {
                            id: JDCreate.id
                        }
                    });
                }
                return res.status(200).send({ code: 200, message: "JD updated successfully", result: result, jd_id: JDCreate.id });
            } else {
                return res.status(404).send({
                    code: 404,
                    message: "No data found for the provided ID or question ID",
                });
            }
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message });
    }
}

exports.download_jd_doc = (req, res) => {
    const fileName = req.params.fileName;
    let filePath = path.join(__dirname, '../../../../uploaded_files/');
    res.download(filePath + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
}

exports.get_all_approved_jobrequest = async (req, res) => {
    try {
        const { entity_id, financial_year_id } = req.query;
        const query = `
            SELECT jr.*, md.department_name,d.designation_name,b.branch_name,CONCAT(U.first_name, ' ', U.last_name) AS created_by_name FROM ESS_JOB_REQUEST AS jr
            INNER JOIN MASTER_DEPARTMENT AS md ON md.dept_id=jr.department_id
            INNER JOIN DESIGNATION AS d ON d.designation_id=jr.designation_id
            INNER JOIN MASTER_BRANCH AS b ON b.id = jr.branch_id
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = jr.created_by
            WHERE jr.status='ACTIVE' and jr.final_status ='APPROVED' AND jr.entity_id =${entity_id} AND jr.financial_id=${financial_year_id} AND jr.id NOT IN (SELECT job_request_id FROM RECRUITMENT_JOB_DESCRIPITION AS jd WHERE jd.status='ACTIVE' and jd.job_request_id IS NOT NULL GROUP BY jd.job_request_id) ORDER BY jr.id DESC`;

        getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200, message: "Fetch All Product Successfully",
                data: getAllData
            });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found", data: getAllData });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }


}

exports.solr_search = async (req, res) => {
    try {
        const solrClient = solr.createClient({
            // host: '127.0.0.1',
            host: '13.201.10.123',
            port: '8983',
            core: 'erp_product',
        });

        const { search_word } = req.query;
        console.log("Received search_word:", search_word);

        if (!search_word) {
            return res.status(400).send({ code: 400, message: "Missing search_word query parameter" });
        }


        const searchTerms = search_word.split(',').map(term => term.trim());

        const solrQueryValue = searchTerms.map(term => `"${term}"`).join(' OR ');

        const strQuery = solrClient
            .query()
            .q(`textcontent:(${solrQueryValue})`)
            .fl('id')
            .start(0)
            .rows(100000);


        const exactMatches = await solrClient.search(strQuery);

        const solrIds = exactMatches.response.docs.map(doc => doc.id);

        if (solrIds.length === 0) {
            return res.status(200).send({ code: 200, message: "No matching records found in Solr", data: [] });
        }

        const sqlQuery = `
            SELECT
                rjde.id, 
                rjde.first_name, 
                IFNULL(rjde.middle_name, '') as middle_name, 
                rjde.last_name,
                CONCAT(rjde.first_name, ' ', IFNULL(rjde.middle_name, ''), ' ', rjde.last_name) AS username, 
                rjde.contact_number,
                rjde.email,
                rjde.cv_upload,
                rjde.country_code 
            FROM RECRUITMENT_JOB_DESCRIPITION_EMAIL AS rjde 
            WHERE rjde.isDeleted = FALSE 
              AND rjde.status = 'ACTIVE'
              AND rjde.id IN (${solrIds})`;

        getAllData = await db.sequelize.query(sqlQuery, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, data: getAllData });
        } else {
            return res.status(200).send({ code: 200, data: [] });
        }

    } catch (error) {
        console.error('Error during Solr search:', error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

