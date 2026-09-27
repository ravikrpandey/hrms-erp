require('dotenv').config();
const axios = require('axios');
const db = require('../../models/index');
const { sendMail } = require('../meetingMail');
const { google } = require('googleapis');
async function getZoomAccessToken() {
  try {
    const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

    const res = await axios.post(tokenUrl, null, {
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
    });

    return res.data.access_token;
  } catch (err) {
    console.error('❌ Zoom Token Error:', err.response?.data || err.message);
    throw new Error('Failed to get Zoom access token');
  }
}

// 🔹 Generate and Save Zoom Meeting
exports.generateZoomMeeting = async (req, res) => {
  try {
    const { topic, start_time, duration, type = 2, agenda, password,entity_id } = req.body;

    if (!topic)
      return res.status(400).json({ success: false, message: 'Topic is required' });

    const accessToken = await getZoomAccessToken();
    const ZOOM_USER_ID = process.env.ZOOM_USER_ID || 'me';

    // 🔸 Prepare payload for Zoom API
    const payload = {
      topic,
      type: parseInt(type),
      start_time: start_time || new Date().toISOString(),
      duration: duration || 30,
      timezone: 'Asia/Kolkata',
      agenda,
      password,
      entity_id,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        approval_type: 0,
      },
    };

    // 🔸 Call Zoom API
    const zoomResponse = await axios.post(
      `https://api.zoom.us/v2/users/${ZOOM_USER_ID}/meetings`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const meeting = zoomResponse.data;

    // 🔸 Save or Update DB
    const [zoomMeeting, created] = await db.ZoomMeeting.findOrCreate({
      where: { meetingId: meeting.id },
      defaults: {
        topic,
        start_time: meeting.start_time,
        duration: meeting.duration,
        type,
        password: meeting.password || '',
        agenda,
        entity_id,
        timezone: meeting.timezone || 'Asia/Kolkata',
        joinUrl: meeting.join_url,
        start_url: meeting.start_url,
        meetingId: meeting.id.toString(),
        isActive: true,
        isDeleted: false,
      },
    });

    // If already exists, update it
    if (!created) {
      await db.ZoomMeeting.update(
        {
          topic,
          start_time: meeting.start_time,
          duration: meeting.duration,
          type,
          password: meeting.password || '',
          agenda,
          timezone: meeting.timezone || 'Asia/Kolkata',
          joinUrl: meeting.join_url,
          start_url: meeting.start_url,
          entity_id,
          isActive: true,
          isDeleted: false,
        },
        { where: { meetingId: meeting.id.toString() } }
      );
    }

    // 🔸 Send data to frontend
    res.status(200).json({
      success: true,
      message: created
        ? 'Zoom meeting created successfully'
        : 'Zoom meeting updated successfully',
      data: {
        meeting_id: meeting.id,
        join_url: meeting.join_url,
        start_url: meeting.start_url,
        password: meeting.password,
        topic: meeting.topic,
        start_time: meeting.start_time,
        duration: meeting.duration,
      },
    });
  } catch (error) {
    console.error('❌ Error generating Zoom meeting:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Zoom meeting',
      error: error.response?.data || error.message,
    });
  }
};


exports.generateGoogleMeet = async (req, res) => {
  try {
    const { topic, start_time,type = 1 , end_time, agenda, entity_id, duration = 30 } = req.body;

    // ✅ Auto-generate topic if not provided
    const finalTopic = topic && topic.trim() !== '' ? topic : 'Google Meet Meeting';

    // ✅ Initialize OAuth2 Client using .env values
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // ✅ Set Refresh Token to get new access token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // 🔹 Time setup
    const startDateTime = start_time
      ? new Date(start_time).toISOString()
      : new Date().toISOString();

    const endDateTime = end_time
      ? new Date(end_time).toISOString()
      : new Date(Date.now() + duration * 60000).toISOString();

    // 🔹 Event payload for Google Meet
    const event = {
      summary: finalTopic,
      description: agenda || '',
      start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
      end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
      conferenceData: {
        createRequest: { requestId: `meet-${Date.now()}` },
      },
    };

    // 🔹 Insert event to Calendar (creates Google Meet link automatically)
    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetData = createdEvent.data;
    const meetingUrl = meetData.hangoutLink;
    const meetingId = meetData.id;

    // 🔹 Save or Update DB record
    const [googleMeet, created] = await db.ZoomMeeting.findOrCreate({
      where: { meetingId },
      defaults: {
        topic: finalTopic,
        start_time: meetData.start.dateTime,
        duration,
        type:parseInt(type),
        password: '',
        agenda,
        entity_id,
        timezone: 'Asia/Kolkata',
        joinUrl: meetingUrl,
        start_url: '',
        meetingId,
        isActive: true,
        isDeleted: false,
      },
    });

    if (!created) {
      await db.ZoomMeeting.update(
        {
          topic: finalTopic,
          start_time: meetData.start.dateTime,
          duration,
          agenda,
          entity_id,
          joinUrl: meetingUrl,
          timezone: 'Asia/Kolkata',
          isActive: true,
          isDeleted: false,
        },
        { where: { meetingId } }
      );
    }

    // 🔹 Send success response
    res.status(200).json({
      success: true,
      message: created
        ? 'Google Meet created successfully'
        : 'Google Meet updated successfully',
      data: {
        meeting_id: meetingId,
        join_url: meetingUrl,
        topic: finalTopic,
        start_time: meetData.start.dateTime,
        end_time: meetData.end.dateTime,
        duration,
        platform: 'Google Meet',
      },
    });
  } catch (error) {
    console.error('❌ Error generating Google Meet:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Google Meet',
      error: error.response?.data || error.message,
    });
  }
};






exports.createWebinarSession = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      session_title,
      date,
      start_time,
      end_time,
      platform,
      description,
      instructor,
      jobRole,
      employee,
      meetingUrl,
      meetingId,
      recordSession,
      recurring,
      externalParticipant,
      externalParticipants,
      web_url,
      created_by,
      entity_id 
    } = req.body;

    if (!session_title || !date || !start_time || !end_time) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: session_title, date, start_time, end_time',
      });
    }

    // Convert employee & externalParticipants to JSON if array
    const employeesData = Array.isArray(employee) ? JSON.stringify(employee) : employee;
    const externalParticipantsData = Array.isArray(externalParticipants)
      ? JSON.stringify(externalParticipants)
      : externalParticipants;

    // Create Webinar Session
    const newSession = await db.WebinarSession.create({
      session_title,
      date,
      start_time,
      end_time,
      platform,
      description,
      instructor,
      jobRole,
      employee: employeesData,
      meetingUrl,
      meetingId,
      recordSession: recordSession || false,
      recurring: recurring || false,
      externalParticipant: externalParticipant || false,
      externalParticipants: externalParticipantsData,
      web_url,
      isActive: true,
      isDeleted: false,
      created_by,
      entity_id 
    }, { transaction: t });

    // Instructor details
    let instructorName = '';
    let instructorEmail = '';
    if (instructor) {
      const instructorRecord = await db.user.findOne({
        where: { employee_id: instructor },
        attributes: ['first_name', 'last_name', 'employee_official_email'],
        transaction: t
      });
      if (instructorRecord) {
        instructorName = `${instructorRecord.first_name} ${instructorRecord.last_name}`.trim();
        instructorEmail = instructorRecord.employee_official_email;
      }
    }

    // Prepare recipients
    const allRecipients = [];

    if (Array.isArray(employee) && employee.length > 0) {
      let employeeEmails = [];
      if (typeof employee[0] === 'object' && employee[0].email) {
        employeeEmails = employee.map(e => e.email).filter(Boolean);
      } else {
        const employeeIds = Array.isArray(employee) ? employee : [employee];
        const employeeRecords = await db.user.findAll({
          where: { employee_id: employeeIds },
          attributes: ['employee_official_email'],
          transaction: t
        });
        employeeEmails = employeeRecords.map(e => e.employee_official_email).filter(Boolean);
      }
      allRecipients.push(...employeeEmails);
    }

    if (Array.isArray(externalParticipants)) {
      const extEmails = externalParticipants
        .map(e => (typeof e === 'object' ? e.email : e))
        .filter(Boolean);
      allRecipients.push(...extEmails);
    }

    const uniqueRecipients = [...new Set(allRecipients)];

    // Zoom Meeting Data
    let zoomMeetingData = null;
    if (platform === 'Zoom' && meetingUrl) {
      zoomMeetingData = await db.ZoomMeeting.findOne({
        where: { joinUrl: meetingUrl },
        attributes: ['id', 'start_url', 'password'],
        transaction: t
      });
    }

    // Meeting details
    let meetingDetails = '';
    if (platform === 'Google Meet') {
      meetingDetails = meetingUrl ? `<p><b>Join Google Meet:</b> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>` : '';
    } else if (platform === 'Zoom') {
      meetingDetails = `
        <p><b>Meeting ID:</b> ${meetingId || 'N/A'}</p>
        <p><b>Password:</b> ${zoomMeetingData?.password || 'N/A'}</p>
        ${meetingUrl ? `<p><b>Join Zoom:</b> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>` : ''}
      `;
    }

    // Participant email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">📢 Webinar Invitation</h2>
        <p>Dear Participant,</p>
        <p>You are invited to the webinar <b>"${session_title}"</b>.</p>
        <h3 style="color: #444;">Webinar Details:</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><b>Title:</b> ${session_title}</li>
          <li><b>Date:</b> ${date}</li>
          <li><b>Time:</b> ${start_time} - ${end_time} IST</li>
          <li><b>Platform:</b> ${platform}</li>
          <li><b>Instructor:</b> ${instructorName || 'N/A'}</li>
        </ul>
        ${meetingDetails}
        ${web_url ? `<p>More info: <a href="${web_url}" target="_blank">${web_url}</a></p>` : ''}
        <br/>
        <p>Best regards,<br/><b>Elite Webinar Team</b></p>
      </div>
    `;

    // Initialize mailResults
    const mailResults = [];

    // Send participant emails
    for (const recipient of uniqueRecipients) {
      try {
        await sendMail({
          entityId: entity_id,
          to: recipient,
          html: emailHtml
        });
        mailResults.push({ email: recipient, status: 'success' });
      } catch (err) {
        console.error(`Mail failed for ${recipient}: ${err.message}`);
        mailResults.push({ email: recipient, status: 'failed' });
      }
    }

    // Instructor mail
    if (instructorEmail) {
      try {
        let instructorDetails = '';
        if (platform === 'Google Meet') {
          instructorDetails = meetingUrl ? `<p><b>Join URL:</b> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>` : '';
        } else if (platform === 'Zoom' && zoomMeetingData) {
          instructorDetails = `
            <p><b>Meeting ID:</b> ${meetingId || 'N/A'}</p>
            <p><b>Password:</b> ${zoomMeetingData.password || 'N/A'}</p>
            <p><b>Start URL:</b> <a href="${zoomMeetingData.start_url}" target="_blank">${zoomMeetingData.start_url}</a></p>
          `;
        }

        const instructorHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">🎓 Webinar Confirmation</h2>
            <p>Dear ${instructorName},</p>
            <p>Your webinar <b>"${session_title}"</b> has been scheduled.</p>
            ${instructorDetails}
            <p>Best regards,<br/><b>Elite Webinar Team</b></p>
          </div>
        `;

        await sendMail({
          entityId: entity_id,
          to: instructorEmail,
          html: instructorHtml
        });

        mailResults.push({ email: instructorEmail, status: 'success' });
      } catch (err) {
        console.error(`Instructor mail failed: ${err.message}`);
        mailResults.push({ email: instructorEmail, status: 'failed' });
      }
    }

    // Check if any mail failed
    const anyMailFailed = mailResults.some(r => r.status === 'failed');
    if (anyMailFailed) {
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: 'Some emails failed to send. Webinar not created.',
        mailResults
      });
    }

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Webinar session created and all emails sent successfully!',
      data: newSession,
      mailResults
    });

  } catch (error) {
    console.error('Error creating webinar session:', error.message);
    await t.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to create webinar session',
      error: error.message,
    });
  }
};




exports.getAllWebinarSessions = async (req, res) => {
  try {
    const {entity_id} = req.params
    const sessions = await db.WebinarSession.findAll({
      where: {entity_id, isDeleted: false },
      order: [['createdAt', 'DESC']],
    });

    if (!sessions.length) {
      return res.status(404).json({
        success: false,
        message: 'No webinar sessions found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Webinar sessions fetched successfully',
      data: sessions,
    });
  } catch (error) {
    console.error('❌ Error fetching webinar sessions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch webinar sessions',
      error: error.message,
    });
  }
};

// ============================
// 🔹 Get Webinar Session by ID
// ============================
exports.getWebinarSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await db.WebinarSession.findOne({
      where: { id, isDeleted: false },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Webinar session not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Webinar session fetched successfully',
      data: session,
    });
  } catch (error) {
    console.error('❌ Error fetching webinar session:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch webinar session',
      error: error.message,
    });
  }
};

// ============================
// 🔹 Update Webinar Session
// ============================


exports.updateWebinarSession = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      id, // webinar session id to update
      session_title,
      date,
      start_time,
      end_time,
      platform,
      description,
      instructor,
      jobRole,
      employee,
      meetingUrl,
      meetingId,
      recordSession,
      recurring,
      externalParticipant,
      externalParticipants,
      web_url,
      updated_by,
      entity_id 
    } = req.body;

    if (!id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Webinar session ID is required to update',
      });
    }

    // Find existing webinar session
    const existingSession = await db.WebinarSession.findOne({
      where: { id },
      transaction: t
    });

    if (!existingSession) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Webinar session not found',
      });
    }

    // Convert employee & externalParticipants to JSON if array
    const employeesData = Array.isArray(employee) ? JSON.stringify(employee) : employee;
    const externalParticipantsData = Array.isArray(externalParticipants)
      ? JSON.stringify(externalParticipants)
      : externalParticipants;

    // Update session
    await existingSession.update({
      session_title: session_title ?? existingSession.session_title,
      date: date ?? existingSession.date,
      start_time: start_time ?? existingSession.start_time,
      end_time: end_time ?? existingSession.end_time,
      platform: platform ?? existingSession.platform,
      description: description ?? existingSession.description,
      instructor: instructor ?? existingSession.instructor,
      jobRole: jobRole ?? existingSession.jobRole,
      employee: employeesData ?? existingSession.employee,
      meetingUrl: meetingUrl ?? existingSession.meetingUrl,
      meetingId: meetingId ?? existingSession.meetingId,
      recordSession: recordSession ?? existingSession.recordSession,
      recurring: recurring ?? existingSession.recurring,
      externalParticipant: externalParticipant ?? existingSession.externalParticipant,
      externalParticipants: externalParticipantsData ?? existingSession.externalParticipants,
      web_url: web_url ?? existingSession.web_url,
      updated_by,
    }, { transaction: t });

    // Instructor details
    let instructorName = '';
    let instructorEmail = '';
    if (instructor) {
      const instructorRecord = await db.user.findOne({
        where: { employee_id: instructor },
        attributes: ['first_name', 'last_name', 'employee_official_email'],
        transaction: t
      });
      if (instructorRecord) {
        instructorName = `${instructorRecord.first_name} ${instructorRecord.last_name}`.trim();
        instructorEmail = instructorRecord.employee_official_email;
      }
    }

    // Prepare recipients
    const allRecipients = [];

    if (Array.isArray(employee) && employee.length > 0) {
      let employeeEmails = [];
      if (typeof employee[0] === 'object' && employee[0].email) {
        employeeEmails = employee.map(e => e.email).filter(Boolean);
      } else {
        const employeeIds = Array.isArray(employee) ? employee : [employee];
        const employeeRecords = await db.user.findAll({
          where: { employee_id: employeeIds },
          attributes: ['employee_official_email'],
          transaction: t
        });
        employeeEmails = employeeRecords.map(e => e.employee_official_email).filter(Boolean);
      }
      allRecipients.push(...employeeEmails);
    }

    if (Array.isArray(externalParticipants)) {
      const extEmails = externalParticipants
        .map(e => (typeof e === 'object' ? e.email : e))
        .filter(Boolean);
      allRecipients.push(...extEmails);
    }

    const uniqueRecipients = [...new Set(allRecipients)];

    // Zoom Meeting Data
    let zoomMeetingData = null;
    if (platform === 'Zoom' && meetingUrl) {
      zoomMeetingData = await db.ZoomMeeting.findOne({
        where: { joinUrl: meetingUrl },
        attributes: ['id', 'start_url', 'password'],
        transaction: t
      });
    }

    // Meeting details
    let meetingDetails = '';
    if (platform === 'Google Meet') {
      meetingDetails = meetingUrl ? `<p><b>Join Google Meet:</b> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>` : '';
    } else if (platform === 'Zoom') {
      meetingDetails = `
        <p><b>Meeting ID:</b> ${meetingId || 'N/A'}</p>
        <p><b>Password:</b> ${zoomMeetingData?.password || 'N/A'}</p>
        ${meetingUrl ? `<p><b>Join Zoom:</b> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>` : ''}
      `;
    }

    // Participant email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">📢 Webinar Update</h2>
        <p>Dear Participant,</p>
        <p>The webinar <b>"${session_title ?? existingSession.session_title}"</b> has been updated.</p>
        <h3 style="color: #444;">Updated Webinar Details:</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><b>Title:</b> ${session_title ?? existingSession.session_title}</li>
          <li><b>Date:</b> ${date ?? existingSession.date}</li>
          <li><b>Time:</b> ${start_time ?? existingSession.start_time} - ${end_time ?? existingSession.end_time} IST</li>
          <li><b>Platform:</b> ${platform ?? existingSession.platform}</li>
          <li><b>Instructor:</b> ${instructorName || 'N/A'}</li>
        </ul>
        ${meetingDetails}
        ${web_url ? `<p>More info: <a href="${web_url}" target="_blank">${web_url}</a></p>` : ''}
        <br/>
        <p>Best regards,<br/><b>Elite Webinar Team</b></p>
      </div>
    `;

    //  Initialize mailResults
    const mailResults = [];

    // Send participant emails
    for (const recipient of uniqueRecipients) {
      try {
        await sendMail({
          entityId: entity_id,
          to: recipient,
          html: emailHtml
        });
        mailResults.push({ email: recipient, status: 'success' });
      } catch (err) {
        console.error(`Mail failed for ${recipient}: ${err.message}`);
        mailResults.push({ email: recipient, status: 'failed' });
      }
    }

    // Instructor mail
    if (instructorEmail) {
      try {
        let instructorDetails = '';
        if (platform === 'Google Meet') {
          instructorDetails = meetingUrl ? `<p><b>Join URL:</b> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>` : '';
        } else if (platform === 'Zoom' && zoomMeetingData) {
          instructorDetails = `
            <p><b>Meeting ID:</b> ${meetingId || 'N/A'}</p>
            <p><b>Password:</b> ${zoomMeetingData.password || 'N/A'}</p>
            <p><b>Start URL:</b> <a href="${zoomMeetingData.start_url}" target="_blank">${zoomMeetingData.start_url}</a></p>
          `;
        }

        const instructorHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">🎓 Webinar Update Confirmation</h2>
            <p>Dear ${instructorName},</p>
            <p>Your webinar <b>"${session_title ?? existingSession.session_title}"</b> has been updated.</p>
            ${instructorDetails}
            <p>Best regards,<br/><b>Elite Webinar Team</b></p>
          </div>
        `;

        await sendMail({
          entityId: entity_id,
          to: instructorEmail,
          html: instructorHtml
        });

        mailResults.push({ email: instructorEmail, status: 'success' });
      } catch (err) {
        console.error(`Instructor mail failed: ${err.message}`);
        mailResults.push({ email: instructorEmail, status: 'failed' });
      }
    }

    // Check if any mail failed
    const anyMailFailed = mailResults.some(r => r.status === 'failed');
    if (anyMailFailed) {
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: 'Some emails failed to send. Webinar not updated.',
        mailResults
      });
    }

    await t.commit();
    res.status(200).json({
      success: true,
      message: 'Webinar session updated and all emails sent successfully!',
      data: existingSession,
      mailResults
    });

  } catch (error) {
    console.error('Error updating webinar session:', error.message);
    await t.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to update webinar session',
      error: error.message,
    });
  }
};


