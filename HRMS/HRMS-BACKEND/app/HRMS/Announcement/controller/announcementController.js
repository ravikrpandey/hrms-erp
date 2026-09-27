
const { re } = require("mathjs");
const db = require("../../../models/index");
const { getTransporterByEntityId } = require("../../../Recruitment/utils/mail/mail");
const fs = require("fs");
const path = require("path");
const notificationController = require("../../../notification/hrms_notification/controller/hrms_notification_controller");
class announcementController {
    constructor() {
        this.create_Announcement = this.create_Announcement.bind(this);
        this.sendAnnouncementToMailAsDepartmentWise = this.sendAnnouncementToMailAsDepartmentWise.bind(this);
        this.update_Announcement = this.update_Announcement.bind(this);
    }
    async create_Announcement(req, res) {
        try {
            const {
                id,
                department_id,
                description,
                file_Name,
                to_date,
                from_date,
                notice_title,
                entity_id,
                financial_year_id,
                created_by
            } = req.body;

            let announce_data;

            if (id) {
                announce_data = await db.hmrs_announcement.findByPk(id);
                if (!announce_data) {
                    return res.status(404).send({ code: 404, message: "Announcement not found" });
                }
                await announce_data.update({
                    description,
                    file_Name,
                    to_date,
                    from_date,
                    notice_title,
                    entity_id,
                    financial_year_id,
                    created_by
                });
                await db.announcementDetails.destroy({ where: { announcement_id: id } });
            } else {
                announce_data = await db.hmrs_announcement.create({
                    description,
                    file_Name,
                    to_date,
                    from_date,
                    notice_title,
                    entity_id,
                    financial_year_id,
                    created_by
                });
            }
            if (department_id && Array.isArray(department_id)) {
                for (let i = 0; i < department_id.length; i++) {
                    await db.announcementDetails.create({
                        dept_id: department_id[i],
                        announcement_id: announce_data.id
                    });
                }
            }

            let notificationData = {
                employee_id: created_by,
                notification_type: 'ANNOUNCEMENT',
                entity_id: entity_id,
                message: id ? "Announcement updated successfully" : "A New Announcement created successfully"
            }

            await notificationController.saveNotification({ notificationData });
            res.status(200).send({
                code: 200,
                message: id ? "Announcement updated successfully" : "Announcement created successfully",
                data: announce_data
            });
            if (department_id && department_id.length > 0) {
                await this.sendAnnouncementToMailAsDepartmentWise(req.body);
            }
        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getAll_Announcement(req, res) {
        try {
            const { entity_id, employee_id, role } = req.query;

            let whereClause = `HA.entity_id = ${entity_id}`;

            if (role !== 'Super Admin') {
                whereClause += ` AND HA.created_by = ${employee_id}`;
            }

            const [response] = await db.sequelize.query(`
            SELECT HA.id, HA.file_Name, HA.from_date, HA.to_date, HA.notice_title,
                   CONCAT(U.first_name, ' ', U.last_name) AS created_by
            FROM HRMS_ANNOUNCEMENT AS HA 
            INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = HA.created_by
            WHERE ${whereClause} ORDER BY HA.id DESC
        `);

            return res.status(200).send({
                code: 200,
                data: response
            });
        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: error.message || "Internal Server Error"
            });
        }
    }
    async getAll_AnnouncementBy_dept(req, res) {
        try {
            const { dept_id, role } = req.query;

            const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

            let whereClause = `
            WHERE DATE(HA.from_date) <= '${today}' 
              AND DATE(HA.to_date) >= '${today}'
        `;

            if (role !== 'Super Admin') {
                whereClause += ` AND HAD.dept_id = ${dept_id}`;
            }

            const [response] = await db.sequelize.query(`
            SELECT 
                HA.id, 
                HA.file_Name, 
                HA.description, 
                HA.from_date, 
                HA.to_date,HA.notice_title
            FROM HRMS_ANNOUNCEMENT_DETAILS AS HAD
            INNER JOIN HRMS_ANNOUNCEMENT AS HA ON HA.id = HAD.announcement_id
            ${whereClause}
            GROUP BY HA.id, HA.file_Name, HA.description, HA.from_date, HA.to_date,HA.notice_title
        `);

            return res.status(200).send({
                code: 200,
                data: response
            });
        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async get_AnnouncementById(req, res) {
        try {
            const { id } = req.params;
            // console.log(req.params + "hhhhhhh");
            const announcement = await db.hmrs_announcement.findOne({
                where: { id },
                attributes: [
                    'id',
                    'description',
                    'file_Name',
                    'to_date',
                    'from_date',
                    'notice_title',
                    'entity_id',
                    'financial_year_id',
                    'created_by'
                ],
                include: [
                    {
                        model: db.announcementDetails,
                        attributes: ['dept_id']
                    }
                ]
            });

            if (!announcement) {
                return res.status(404).send({ code: 404, message: 'Announcement not found' });
            }

            const announcementData = announcement.toJSON();

            // const departmentIds = announcementData.announcementDetails.map(dep => dep.dept_id);

            return res.status(200).send({
                code: 200,
                message: 'Success',
                data: {
                    ...announcementData
                }
            });

        } catch (error) {
            console.error('Error in get_AnnouncementById:', error);
            return res.status(500).send({
                code: 500,
                message: error.message || 'Internal Server Error'
            });
        }
    }

    async update_Announcement(req, res) {
        try {
            const { id } = req.params;

            const {
                department_id,
                description,
                file_Name,
                to_date,
                from_date,
                notice_title,
                entity_id,
                financial_year_id,
                created_by
            } = req.body;

            const announce_data = await db.hmrs_announcement.findByPk(id);

            if (!announce_data) {
                return res.status(404).send({ code: 404, message: "Announcement not found" });
            }
            await announce_data.update({
                description,
                file_Name,
                to_date,
                from_date,
                notice_title,
                entity_id,
                financial_year_id,
                created_by
            });
            await db.announcementDetails.destroy({ where: { announcement_id: id } });

            if (department_id && Array.isArray(department_id)) {
                for (let dept of department_id) {
                    await db.announcementDetails.create({
                        dept_id: dept,
                        announcement_id: id
                    });
                }
            }

            const updatedData = await db.hmrs_announcement.findOne({
                where: { id },
                include: [{ model: db.announcementDetails, as: 'HRMS_ANNOUNCEMENT_DETAILs' }]
            });

            let notificationData = {
                employee_id: created_by,
                notification_type: 'ANNOUNCEMENT',
                entity_id: entity_id,
                message: id ? "Announcement updated successfully" : "A New Announcement created successfully"
            }

            await notificationController.saveNotification({ notificationData });

            res.status(200).send({
                code: 200,
                message: "Announcement updated successfully",
                data: updatedData
            });

            if (department_id && department_id.length > 0) {
                await this.sendAnnouncementToMailAsDepartmentWise(req.body);
            }

        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async sendAnnouncementToMailAsDepartmentWise(announcementData) {
        try {
            const {
                department_id,
                description,
                notice_title,
                entity_id,
                file_Name
            } = announcementData;
            if (!department_id || department_id.length === 0) return;
            (async () => {
                try {
                    const [users] = await db.sequelize.query(`
                SELECT 
                hru.employee_official_email AS email, 
                CONCAT(hru.first_name, ' ', hru.last_name) AS fullName, 
                hru.department_id, 
                hru.employee_id 
                FROM HRMS_REGISTERED_USER hru 
                WHERE hru.department_id IN (${department_id});`);
                    if (!users || users.length === 0) return console.log("No users found");
                    const { transporter, fromEmail, entity_name } =
                        await getTransporterByEntityId(entity_id);
                    const results = [];
                    for (const user of users) {
                        try {
                            const decodedHtml = `<div style="font-family:Arial,sans-serif;"><p>Dear <b>${user.fullName}</b>,</p> <p>${description}</p></div>`;
                            const attachments = [];
                            if (file_Name) {
                                const filePath = path.join(__dirname, "../../../../uploaded_files", file_Name);
                                if (fs.existsSync(filePath)) {
                                    attachments.push({
                                        filename: file_Name,
                                        path: filePath, 
                                        contentType: "application/octet-stream",
                                    });
                                } else {
                                    console.warn(`⚠️ File not found at: ${filePath}`);
                                }
                            }
                            // 2️⃣ Optionally include dynamically generated PDF (if you still need it)
                            // const pdfBuffer = Buffer.from("PDF CONTENT");
                            // attachments.push({
                            //   filename: `${notice_title || "announcement"}.pdf`,
                            //   content: pdfBuffer,
                            //   contentType: "application/pdf",
                            // });

                            // 3️⃣ Prepare email
                            const mailOptions = {
                                from: `${entity_name} <${fromEmail}>`,
                                to: [user.email, "pandeyravikumar181@gmail.com"],
                                subject: notice_title || "Announcement",
                                html: decodedHtml,
                                attachments,
                            };
                            const info = await transporter.sendMail(mailOptions);
                            results.push({
                                email: user.email,
                                status: info?.accepted?.length ? "sent" : "failed",
                            });
                        } catch (err) {
                            results.push({
                                email: user.email,
                                status: "failed",
                                reason: err.message,
                            });
                        }
                    }
                    console.log("Background email results:", results);
                } catch (error) {
                    console.error("Error in background mail sending:", error);
                }
            })();
        } catch (error) {
            console.error("Error in sendAnnouncementToMailAsDepartmentWise:", error);
        }
    }

}

module.exports = new announcementController();
