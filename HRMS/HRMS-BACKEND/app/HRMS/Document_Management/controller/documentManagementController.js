const db = require('../../../models/index');
const DocumentManagement = db.document_management;
const he = require('he');
const { getTransporterByEntityId } = require("../../../Recruitment/utils/mail/mail");
const puppeteer = require('puppeteer');

exports.saveOrUpdateDocument = async (req, res) => {
    try {
        const { template_name, template_html, entity_id, financial_year_id } = req.body;
        if (!template_html || !entity_id || !financial_year_id) {
            return res.status(400).send({ message: "All fields are required!" });
        }

        const normalizedTemplateName = template_name.trim().toLowerCase().replace(/\s+/g, ' ');

        let existingDoc = await DocumentManagement.findOne({
            where: {
                template_name: normalizedTemplateName, isDeleted: false
            }
        });
        let id = existingDoc ? existingDoc.id : null;

        let doc;
        if (id) {
            const [updated] = await DocumentManagement.update(
                { template_name, template_html, entity_id, financial_year_id },
                { where: { id, isDeleted: false } }
            );
            if (!updated) return res.status(404).send({ message: "Document not found" });
            doc = await DocumentManagement.findOne({ where: { id } });
            res.status(200).send({ message: "Document updated successfully", data: doc });
        } else {
            doc = await DocumentManagement.create({
                template_name,
                // template_html: JSON.stringify({ html: template_html }),
                template_html: template_html,
                entity_id,
                financial_year_id,
            });
            res.status(201).send({ message: "Document created successfully", data: doc });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.getAllDocuments = async (req, res) => {
    try {
        const docs = await DocumentManagement.findAll({
            where: { isDeleted: false },
            order: [['id', 'DESC']]
        });
        res.send(docs);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.getDocumentById = async (req, res) => {
    try {
        const doc = await DocumentManagement.findOne({
            where: { id: req.params.id, isDeleted: false },
        });
        if (!doc) return res.status(404).send({ message: "Document not found" });
        res.send(doc);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.updateDocument = async (req, res) => {
    try {
        const { template_html, entity_id, financial_year_id, status } = req.body;
        const [updated] = await DocumentManagement.update(
            { template_html, entity_id, financial_year_id, status },
            { where: { id: req.params.id, isDeleted: false } }
        );
        if (!updated) return res.status(404).send({ message: "Document not found" });
        res.send({ message: "Document updated" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.deleteDocument = async (req, res) => {
    try {
        const [updated] = await DocumentManagement.update(
            { isDeleted: true },
            { where: { id: req.params.id } }
        );
        if (!updated) return res.status(404).send({ message: "Document not found" });
        res.send({ message: "Document deleted" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.usersList = async (req, res) => {
    try {
        const users = await db.sequelize.query(
            `SELECT CONCAT(HRU.first_name, ' ', HRU.last_name) AS name, HRU.employee_id, HRU.employee_code, HRU.employee_official_email FROM HRMS_REGISTERED_USER HRU 
            WHERE HRU.status = 'ACTIVE' AND HRU.isDeleted = FALSE;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


module.exports.documentManagementPreview = async (req, res) => {
    try {
        const { templateId, userIds = [], manualUsers = [], entity_id, } = req.body;

        if (!templateId || (!userIds.length && !manualUsers.length))
            return res.status(400).json({ message: "Template ID and at least one user (userIds or manualUsers) is required." });

        const template = await DocumentManagement.findOne({
            where: { id: templateId, entity_id, isDeleted: false }
        });
        if (!template)
            return res.status(404).json({ message: "Template not found." });

        let decodedHtml = template.dataValues.template_html
        let placeholderMatches =
            decodedHtml.match(/\$\{(.*?)\}|{{(.*?)}}|{(.*?)}/g) || [];
            // decodedHtml.match(/{{(.*?)}}/g) || [];

        const placeholders = placeholderMatches.map(ph =>
            ph
                .replace(/\$\{|\{|}+/g, '')
                .trim()
        );

        const users = await db.sequelize.query(
            `SELECT 
          HRU.employee_id AS id, 
          CONCAT(HRU.first_name, ' ', HRU.last_name) AS name, 
          HRU.employee_official_email AS email
       FROM HRMS_REGISTERED_USER HRU
       WHERE HRU.employee_id IN (:userIds)
         AND HRU.status = 'ACTIVE'
         AND HRU.isDeleted = FALSE;`,
            {
                replacements: { userIds },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        const previewList = [];

        // 5️⃣ Generate filled templates per user
        for (const user of users) {
            let filledHtml = decodedHtml;
            for (const placeholder of placeholders) {
                const value = user[placeholder] || '';
                const regex = new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g');
                filledHtml = filledHtml.replace(regex, value);
            }

            previewList.push({
                user_id: user.id,
                user_name: user.name,
                email: user.email,
                filled_html: filledHtml,
                template_name: template.template_name
            });
        }

        if (manualUsers.length) {
            for (const user of manualUsers) {
                let filledHtml = decodedHtml;
                for (const placeholder of placeholders) {
                    const value = user[placeholder] || '';
                    const regex = new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g');
                    filledHtml = filledHtml.replace(regex, value);
                }
                previewList.push({
                    user_id: null,
                    user_name: user.name || 'Manual User',
                    email: user.email || '',
                    filled_html: filledHtml
                });
            }
        }

        return res.status(200).json({
            status: 200,
            message: "Template preview generated successfully",
            data: { templateId, placeholders, previewList }
        });

    } catch (error) {
        console.error("❌ Error generating preview:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports.sendTemplateMail = async (req, res) => {
    try {
        const { subject, recipients = [], entity_id, action } = req.body[0] || {};

        if (!req.body || !req.body.length || entity_id === undefined || entity_id === null) {
            return res.status(400).send({
                message: "Subject, recipients, and entity_id are required.",
            });
        }

        if (action === 'assign' || action === 'mail') {
            for (const user of req.body) {
                let whereClause = { template_Id: user.template_id };
                if (user.user_id) {
                    whereClause.employee_id = user.user_id;
                } else {
                    whereClause.email = user.email;
                }
                const checkAlreadyAssigned = await db.templateAssignment.findOne({
                    where: { ...whereClause }
                });

                if (checkAlreadyAssigned) {
                    continue;
                }
                await db.templateAssignment.create({
                    entity_id,
                    employee_id: user.user_id,
                    template_Id: user.template_id,
                    employee_name: user?.name || user?.user_name,
                    filled_html: JSON.stringify({ html: user.fullHtml }),
                    financial_year_id: user.financial_id,
                    isExistingUser: user.user_id ? true : false,
                    sent_status: action == 'assign' ? 'NOT_SENT' : 'SENT'
                });
            }
            if (action === 'assign') {
                return res.status(200).send({ message: "Template assigned successfully." });
            }
        }

        res.send({
            message: "Emails are being processed in the background.",
            total: recipients.length,
            status: "processing"
        });

        (async () => {
            try {
                const { transporter, fromEmail, entity_name } =
                    await getTransporterByEntityId(entity_id);

                const results = [];
                const browser = await puppeteer.launch({ headless: "new" });

                for (const user of req?.body) {
                    const decodedHtml = he.decode(user.fullHtml || "");
                    let pdfBuffer;
                    try {
                        const page = await browser.newPage();
                        await page.setContent(decodedHtml, { waitUntil: 'networkidle0' });
                        pdfBuffer = await page.pdf({ format: 'A4' });
                        await page.close();
                    } catch (pdfErr) {
                        results.push({
                            email: user.email,
                            name: user?.name || user?.user_name || '',
                            status: "failed",
                            reason: "PDF generation failed: " + pdfErr.message,
                        });
                        continue;
                    }

                    const mailOptions = {
                        from: `${entity_name} <${fromEmail}>`,
                        to: [user.email, 'pandeyravikumar181@gmail.com'],
                        subject: user?.template_name || subject.split('-')[0] || "No Subject",
                        html: decodedHtml,
                        attachments: [
                            {
                                filename: `${user.template_name + '_' + user.user_name || 'document'}.pdf`,
                                content: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        ]
                    };

                    try {
                        const info = await transporter.sendMail(mailOptions);

                        if (info?.accepted?.length > 0) {
                            results.push({
                                email: user.email,
                                name: user.name,
                                status: "sent",
                            });
                        } else {
                            results.push({
                                email: user.email,
                                name: user.name,
                                status: "failed",
                                reason: "Mail not accepted by SMTP server",
                            });
                        }
                    } catch (err) {
                        results.push({
                            email: user.email,
                            name: user.name,
                            status: "failed",
                            reason: err.message,
                        });
                    }
                }

                await browser.close();
                console.log("Background email results:", results);

            } catch (error) {
                console.error("Error in background sendTemplateMail:", error);
            }
        })();

    } catch (error) {
        console.error("Error in sendTemplateMail:", error);
        res.status(500).send({
            message: "Exception occurred while sending emails.",
            error: error.message,
        });
    }
};

module.exports.getTemplatesAssignedByEmpId = async (req, res) => {
    try {
        const { entity_id, user_id, financial_id } = req.query;
        if (!entity_id || !user_id) {
            return res.status(400).send({ message: "entity_id and employee_id are required." });
        }
        const [assignments] = await db.sequelize.query(`SELECT hta.*,hdm.template_name, CONCAT(hru.first_name, ' ', hru.last_name) as employee_name FROM HRMS_TEMPLATE_ASSIGNMENT hta LEFT JOIN HRMS_DOCUMENT_MANAGEMENT hdm  ON hta.template_Id = hdm.id LEFT JOIN HRMS_REGISTERED_USER hru ON hta.employee_id = hru.employee_id 
        WHERE hta.employee_id = ${user_id} AND hta.financial_year_id = ${financial_id} AND hta.entity_id = ${entity_id} ORDER BY hta.id DESC;`)
        if (assignments.length === 0) {
            return res.status(404).send({ message: "No templates assigned to this user." });
        }
        return res.send(assignments);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};






