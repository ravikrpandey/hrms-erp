// models/zoom_meetings.js
module.exports = (sequelize, DataTypes) => {
  const ZoomMeeting = sequelize.define('WEBINAR_ZOOM_MEETINGS', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in minutes',
    },
    type: {
      type: DataTypes.ENUM('1', '2', '8'),
      allowNull: false,
      defaultValue: '2', 
      comment: '1=Instant, 2=Scheduled, 8=Recurring',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'Asia/Kolkata',
    },
    joinUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Zoom meeting join link',
    },
    start_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Zoom meeting join link',
    },
    meetingId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Zoom meeting ID',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'WEBINAR_ZOOM_MEETINGS',
    timestamps: true,
  });

  return ZoomMeeting;
};
