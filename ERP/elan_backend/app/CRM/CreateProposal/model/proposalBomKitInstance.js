module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define(
    "CRM_PROPOSAL_LIST_MST_BOM_INSTANCE",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      instance_no: {
        type: Sequelize.INTEGER,
        defaultValue: true,
      },
      instance_status: {
        type: Sequelize.ENUM("PENDING","PARTIAL","DISPATCH"),
        defaultValue: "PENDING"
      },
    },
    {
      freezeTableName: true,
    }
  );
  return table;
};