
module.exports = (sequelize, Sequelize) => {
  const document_management = sequelize.define(
    "HRMS_DOCUMENT_MANAGEMENT",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      template_name: {
        type: Sequelize.STRING(255),
      },
      template_html: {
        type: Sequelize.JSON,
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
    },
    {
      freezeTableName: true,
    }
  );
  return document_management;
};
