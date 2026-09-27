module.exports = (sequelize, Sequelize) => {
  const WebinarSession = sequelize.define("WEBINAR_SESSION",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      session_title: {
        type: Sequelize.STRING(255),
      },
      date: {
        type: Sequelize.DATEONLY(),
      },
      start_time: {
        type: Sequelize.STRING,
      },
      end_time: {
        type: Sequelize.STRING,
      },
      jobRole: {
        type: Sequelize.STRING,
      },
      employee: {
        type: Sequelize.TEXT, // JSON string me store karenge
        allowNull: false,
        get() {
          const val = this.getDataValue("employee");
          return val ? JSON.parse(val) : [];
        },
        set(value) {
          this.setDataValue("employee", JSON.stringify(value));
        },
      },
      platform: {
        type: Sequelize.STRING(50),
      },
      description: {
        type: Sequelize.TEXT,
      },
      instructor: {
        type: Sequelize.STRING(100),
      },
      meetingUrl: {
        type: Sequelize.STRING(500),
      },
      meetingId: {
        type: Sequelize.STRING(500),
      },
      recordSession: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      recurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      externalParticipant: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      externalParticipants: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    }
  );


  return WebinarSession;
};
