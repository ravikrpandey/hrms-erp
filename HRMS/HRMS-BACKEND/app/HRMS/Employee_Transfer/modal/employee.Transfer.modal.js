module.exports = (sequelize, Sequelize) => {
  const employeeTransfer = sequelize.define(
    "HRMS_EMPLOYEE_TRANSFER",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      toRemark: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.INTEGER,
      },
      IsStatus: {
        type: Sequelize.STRING,
        defaultValue: "PENDING",
      },
      ApprovalRemarks: {
        type: Sequelize.STRING,
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
  return employeeTransfer;
};
