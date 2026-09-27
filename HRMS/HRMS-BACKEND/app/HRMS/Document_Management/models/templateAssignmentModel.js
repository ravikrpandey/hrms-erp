
module.exports = (sequelize, Sequelize) => {
  const templateAssignment = sequelize.define(
    "HRMS_TEMPLATE_ASSIGNMENT",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      template_Id: {
        type: Sequelize.STRING(255),
      },
      employee_id: {
        type: Sequelize.INTEGER,
      },
      employee_name: {
        type: Sequelize.STRING(255),
      },
      filled_html: {
        type: Sequelize.JSON,
      },
      sent_status: {
        type: Sequelize.ENUM("SENT", "NOT_SENT"),
        defaultValue: "NOT_SENT",
        allowNull: true,
      },
      entity_id: {
        type: Sequelize.INTEGER,
      },
      financial_year_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      isExistingUser: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: true,
      },
      email: {
        type: Sequelize.STRING(255),
      },
    },
    {
      freezeTableName: true,
    }
  );
  return templateAssignment;
};
