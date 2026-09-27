// const db = require("../../models/index");
// const fs = require("fs");
// const path = require("path");
// const { google } = require("googleapis");
// const cron = require("node-cron");

// const WebinarSession = db.WebinarSession;
// const WebinarRegistration = db.WebinarRegistration;
// // const ZoomMeeting = db.zoomMeeting;

// const MailService = require("../services/mail.service");
// const ZoomService = require("../services/zoom.service");

// const mailService = new MailService();
// const zoomservice = new ZoomService();

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// // Load token from file if exists
// const tokenPath = path.join(process.cwd(), "src", "token.json");
// if (fs.existsSync(tokenPath)) {
//   const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
//   oauth2Client.setCredentials(tokens);
// }

// oauth2Client.on("tokens", (tokens) => {
//   if (tokens.refresh_token) {
//     fs.writeFileSync(tokenPath, JSON.stringify(tokens));
//   }
// });

// // ---------- Helper: Ensure Google Token ----------
// async function ensureTokens() {
//   if (!fs.existsSync(tokenPath)) {
//     throw new Error("Google OAuth token not found. Visit /google/auth to authorize once.");
//   }
//   const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
//   oauth2Client.setCredentials(tokens);
// }

// // ---------- Helper: Create Google Meet ----------
// async function createGoogleMeetLink(summary, startISO, endISO) {
//   await ensureTokens();
//   await oauth2Client.getAccessToken();
//   const calendar = google.calendar({ version: "v3", auth: oauth2Client });

//   const event = {
//     summary: summary || "Webinar Session",
//     start: { dateTime: startISO, timeZone: "Asia/Kolkata" },
//     end: { dateTime: endISO, timeZone: "Asia/Kolkata" },
//     conferenceData: { createRequest: { requestId: `${Date.now()}` } },
//   };

//   const response = await calendar.events.insert({
//     calendarId: "primary",
//     requestBody: event,
//     conferenceDataVersion: 1,
//   });

//   return response.data.hangoutLink || null;
// }

// // ========== CREATE SESSION ==========
// exports.create = async (req, res) => {
//   try {
//     const dto = req.body;
//     const user = req.user; 

//     let meetingUrl = "";
//     let meetingDetails = {};

//     if (dto.platform.toLowerCase() === "zoom") {
//       const startISO = `${dto.date}T${dto.start_time}:00+05:30`;
//       const endISO = `${dto.date}T${dto.end_time}:00+05:30`;
//       const durationMinutes = (new Date(endISO) - new Date(startISO)) / 60000;

//       const zoomDto = {
//         topic: dto.session_title,
//         startTime: startISO,
//         duration: durationMinutes,
//         type: 2,
//         timezone: "Asia/Kolkata",
//       };

//       const zoomDetails = await zoomservice.generateZoomMeeting(zoomDto);
//       meetingUrl = zoomDetails.data.join_url;
//       meetingDetails = {
//         id: zoomDetails.data.meeting_id,
//         password: zoomDetails.data.password,
//       };
//     } else if (dto.platform.toLowerCase() === "google meet") {
//       const startISO = `${dto.date}T${dto.start_time}:00+05:30`;
//       const endISO = `${dto.date}T${dto.end_time}:00+05:30`;
//       meetingUrl = await createGoogleMeetLink(dto.session_title, startISO, endISO);
//     }

//     // Save session
//     const saved = await WebinarSession.create({
//       ...dto,
//       meetingUrl,
//       createdBy: user.loginId,
//     });

//     const registrationUrl = `${dto.web_url}${saved.id}`;

//     // Collect participant emails
//     let emails = [];
//     if (dto.employee?.length) {
//       const employees = await AuthEntity.findAll({
//         attributes: ["useremail"],
//         where: { id: dto.employee },
//       });
//       emails.push(...employees.map((e) => e.useremail));
//     }

//     if (dto.externalParticipants?.length) {
//       emails.push(...dto.externalParticipants.map((e) => e.email));
//     }

//     // Send registration email
//     if (emails.length > 0) {
//       let meetingHtml = "";
//       if (dto.platform.toLowerCase() === "zoom") {
//         meetingHtml = `
//           <p><b>Meeting ID:</b> ${meetingDetails.id}</p>
//           ${meetingDetails.password ? `<p><b>Password:</b> ${meetingDetails.password}</p>` : ""}
//         `;
//       }

//       const emailHtml = `
//         <p>Dear Participant,</p>
//         <p>You are invited to the webinar "<b>${saved.session_title}</b>".</p>
//         <ul>
//           <li><b>Date:</b> ${saved.date}</li>
//           <li><b>Time:</b> ${saved.start_time} - ${saved.end_time} IST</li>
//           <li><b>Platform:</b> ${dto.platform}</li>
//           <li><b>Session ID:</b> ${saved.id}</li>
//         </ul>
//         <p>Please register here: <a href="${registrationUrl}" target="_blank">${registrationUrl}</a></p>
//         ${meetingHtml}
//       `;

//       await mailService.send({
//         to: emails,
//         subject: `Register for Webinar - ${saved.session_title}`,
//         html: emailHtml,
//       });
//     }

//     return res.status(201).json({
//       code: 201,
//       message: "Webinar Session created successfully!",
//       data: saved,
//     });
//   } catch (err) {
//     console.error("Error creating webinar:", err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // ========== FIND ALL ==========
// exports.findAll = async (req, res) => {
//   try {
//     const all = await WebinarSession.findAll({ order: [["date", "DESC"]] });

//     const today = new Date();
//     const todayStr = today.toISOString().split("T")[0];

//     const todaySessions = all.filter((s) => s.date.toISOString().split("T")[0] === todayStr);
//     const upcomingSessions = all.filter((s) => s.date.toISOString().split("T")[0] > todayStr);

//     return res.json({
//       code: 200,
//       message: "Fetched Webinar Sessions successfully",
//       total: all.length,
//       todayCount: todaySessions.length,
//       upcomingCount: upcomingSessions.length,
//       data: all,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ========== FIND ONE ==========
// exports.findOne = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const session = await WebinarSession.findByPk(id);
//     if (!session) return res.status(404).json({ message: "Not found" });
//     res.json({ code: 200, message: "Fetched", data: session });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ========== REGISTER FOR WEBINAR ==========
// exports.registerForWebinar = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const body = req.body;

//     const session = await WebinarSession.findByPk(sessionId);
//     if (!session) return res.status(404).json({ message: "Session not found" });

//     let invitedEmails = [];

//     if (session.employee) {
//       const employeeIds = JSON.parse(session.employee);
//       const employees = await AuthEntity.findAll({
//         attributes: ["useremail"],
//         where: { id: employeeIds },
//       });
//       invitedEmails.push(...employees.map((e) => e.useremail.toLowerCase()));
//     }

//     if (session.externalParticipants) {
//       const ext = JSON.parse(session.externalParticipants);
//       invitedEmails.push(...ext.map((e) => e.email.toLowerCase()));
//     }

//     if (!invitedEmails.includes(body.email.toLowerCase())) {
//       return res.status(401).json({ message: "Unauthorized email for this webinar" });
//     }

//     const fixedDomain = "elite_lms";

//     const registration = await WebinarRegistration.create({
//       sessionId: session.id,
//       email: body.email,
//       firstName: body.firstName,
//       lastName: body.lastName || "",
//       phone: body.phone || "",
//       registeredAt: new Date(),
//       domain: fixedDomain,
//     });

//     res.json({
//       code: 200,
//       message: "Registration successful",
//       data: { registration, session },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
