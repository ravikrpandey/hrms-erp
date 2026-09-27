module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define(
    "BOM_KIT_ITEM",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      quantity: {
        type: Sequelize.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      freezeTableName: true,
      indexes: [
        {
          fields: ["bom_id"],
        },
        {
          fields: ["item_id"],
        },
      ],
    }
  );

  return table;
};