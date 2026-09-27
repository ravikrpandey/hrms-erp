module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define(
    "BOM_KIT_SUBSTITUTE_ITEM",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

    },
    {
      freezeTableName: true,
      indexes: [
        {
          fields: ["bom_item_id"],
        },
        {
          fields: ["substitute_item_id"],
        },
      ],
    }
  );

  return table;
};