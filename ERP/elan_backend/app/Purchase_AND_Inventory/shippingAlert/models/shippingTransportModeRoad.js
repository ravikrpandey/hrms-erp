module.exports = (sequelize, Sequelize) => {
  const shippingTransportModeRoad = sequelize.define(
    "SHIPPING_TRNS_MODE_ROAD",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      entryType: {
        type: Sequelize.ENUM("VENDOR", "FORWARDER", "TRANSPORT"),
        defaultValue: "VENDOR",
      },
      vehicle_number: {
        type: Sequelize.STRING,
      },
      driver_name: {
        type: Sequelize.STRING,
      },
      driver_mobile: {
        type: Sequelize.STRING,
      },
      transporter_name: {
        type: Sequelize.STRING,
      },
      lr_number: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      freezeTableName: true,
    },
  );
  return shippingTransportModeRoad;
};
