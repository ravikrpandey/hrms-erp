module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define(
    "CRM_PROPOSAL_LIST_MST_BOM_INSTANCE_ITEM",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      required_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      dispatch_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      pending_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      item_status: {
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