module.exports = (sequelize, Sequelize) => {
  const vehiclePlanningSo = sequelize.define(
    "WH_VH_PLANNING_SO",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pickup_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      expected_delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      delivered_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gate_by_pass: {
        type: Sequelize.ENUM("YES", "NO"),
        defaultValue: 'NO'
      },
      so_dispatch_status: {
        type: Sequelize.ENUM(
          'DRAFT',
          'READY_FOR_PICKUP',
          'AT_WAREHOUSE',
          'DISPATCHED',
          'OUT_FOR_DELIVERY',
          'DELIVERED'
        ),
        defaultValue: 'DRAFT'
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );
  return vehiclePlanningSo;
};