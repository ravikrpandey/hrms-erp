module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define(
    "CRM_PROPOSAL_LIST_MST_BOM_KIT_ITEM",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      qty_per_bom: {
        type: Sequelize.INTEGER,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return table;
};