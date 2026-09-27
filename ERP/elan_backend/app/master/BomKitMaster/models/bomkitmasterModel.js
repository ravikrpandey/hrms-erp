module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define(
    "BOM_KIT_MASTER",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      version_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      bom_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      bom_price: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },

      gst: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "Draft",
          "Approved",
          "Inactive"
        ),
        defaultValue: "Draft",
      },

      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      }

    },
    {
      freezeTableName: true,
      indexes: [
        {
          fields: ["bom_group_id"],
        },
      ],
    }
  );

  return table;
};