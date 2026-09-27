module.exports = (sequelize, Sequelize) => {
  const exit_form = sequelize.define(
    "ESS_EXIT_FORM",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      exit_form_code: {
        type: Sequelize.STRING,
      },
      primaryReason: {
        type: Sequelize.STRING,
      },
      decisionTrigger: {
        type: Sequelize.TEXT,
      },
      preventReason: {
        type: Sequelize.TEXT,
      },
      jobMatch: {
        type: Sequelize.STRING,
      },
      workEnvironment: {
        type: Sequelize.STRING,
      },
      challenges: {
        type: Sequelize.TEXT,
      },
      managerRelation: {
        type: Sequelize.STRING,
      },
      managerSupport: {
        type: Sequelize.TEXT,
      },
      teamCommunication: {
        type: Sequelize.TEXT,
      },
      compensationSatisfaction: {
        type: Sequelize.STRING,
      },
      growthFeedback: {
        type: Sequelize.TEXT,
      },
      recommendation: {
        type: Sequelize.STRING,
      },
      suggestions: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      approval_status: {
        type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
        defaultValue: "PENDING",
      },
      approver_remarks: {
        type: Sequelize.STRING,
      },
      rehire_eligibility: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    {
      freezeTableName: true,
    }
  );

  return exit_form;
};
