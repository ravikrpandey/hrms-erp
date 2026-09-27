module.exports = (sequelize, Sequelize) => {
  const compoff_assign = sequelize.define(
    "HRMS_ASSIGN_COMPOFF",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      from_date: {
        type: Sequelize.DATEONLY,
      },
      to_date: {
        type: Sequelize.DATEONLY,
      },
      reason: {
       type: Sequelize.TEXT('long'), 
      },
      entity_id: {
        type: Sequelize.INTEGER,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
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
  return compoff_assign;
};
