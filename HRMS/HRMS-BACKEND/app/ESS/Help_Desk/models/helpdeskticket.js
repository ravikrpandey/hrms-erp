module.exports = (sequelize, Sequelize) => {
  const myticketAllocatedticket = sequelize.define(
    "ESS_MY_ALLOCATED_TICKET",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      formtype: {
        type: Sequelize.STRING,
      },
      forperson: {
        type: Sequelize.STRING,
      },
      dept_id: {
        type: Sequelize.INTEGER,
      },
      category_id: {
        type: Sequelize.INTEGER,
      },
      priority: {
        type: Sequelize.STRING,
      },
      subject: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      status_type: {
        type: Sequelize.ENUM,
        values: ["OPEN", "CLOSE"],
        defaultValue: "OPEN",
        allowNull: true,
      },
      remark: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["ACTIVE", "INACTIVE"],
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return myticketAllocatedticket;
};
