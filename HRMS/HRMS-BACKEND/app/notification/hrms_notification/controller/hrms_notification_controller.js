const { count } = require('mathjs');
const db = require('../../../models/index')
const moment = require('moment')
const HRMSNotification = db.hrms_notification; 
const { Op } = require('sequelize'); 


/** function to save notification */
async function saveNotification(notificationData) {
    try {
        const notification = await HRMSNotification.create({
            employee_id: notificationData.employee_id,
            notification_type: notificationData.notification_type,
            entity_id: notificationData.entity_id,
            message: notificationData.message,
        });

        return notification; 
    } catch (error) {
        console.error('Error saving notification:', error);
        throw new Error('Unable to save notification'); 
    }
}

/** get all notification as per user  */
const getAllNotification = async (req, res) => {
  const { employee_id, entity_id, is_read = "all" } = req.body;

  try {
    let whereCondition = { employee_id, entity_id };

    if (is_read === "read") {
      whereCondition.is_read = true;
    } else if (is_read === "unread") {
      whereCondition.is_read = false;
    }

    const notification_data = await HRMSNotification.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    const total_count = notification_data.length;

    const unread_count = notification_data.filter(
      (notification) => !notification.is_read
    ).length;

    if (total_count > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Notifications Successfully",
        data: notification_data,
        count: unread_count,
        total_notif: total_count,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "No notification data found.",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

/* delete notification of past 30 days*/
const deleteNotification = async (req, res) => {
  try {
    const pastDate = moment().subtract(30, 'days').startOf('day'); 

    const notification_data = await HRMSNotification.findAll({
      where: {
        createdAt: { [Op.lt]: pastDate.toDate() }, 
      },
      order: [['createdAt', 'DESC']],
    });

    if (notification_data.length > 0) {
      await HRMSNotification.destroy({
        where: {
          createdAt: { [Op.lt]: pastDate.toDate() }, 
        },
      });
      return res.status(200).send({ code: 200, message: "Old notifications deleted successfully", data: notification_data });
    } else {
      return res.status(404).send({ code: 404, message: "No old notifications found to delete", data: [] });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

/* Update notification status*/
const updateNotificationStatus = async (req, res) => {
  const { notification_id } = req.query;
  try {

    const update_status = await HRMSNotification.update({ is_read: 1 }, { where: { hrms_notification_id: notification_id } });

    if (update_status) {
      return res.status(200).send({ code: 200, message: "Read status updated successfully", data: update_status });
    } else {
      return res.status(404).send({ code: 404, message: "Failed to update read status" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

/** Update read true for the all notification of that user */
const updateAllNotificationStatus = async (req, res) => {
  const { employee_id, entity_id } = req.query;
  try {

    const update_status = await HRMSNotification.update({ is_read: 1 }, { where: { employee_id, entity_id } });

    if (update_status) {
      return res.status(200).send({ code: 200, message: "Read status updated successfully", data: update_status });
    } else {
      return res.status(404).send({ code: 404, message: "Failed to update read status" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};


module.exports = {
  saveNotification,
  getAllNotification,
  deleteNotification,
  updateNotificationStatus,
  updateAllNotificationStatus
}
