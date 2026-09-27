module.exports = (sequelize, Sequelize) => {
  const histryShippingAlert = sequelize.define(
    "SHIPPING_ALERT_HISTORY",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      shipped_status: {
        type: Sequelize.ENUM(
          "IN_TRANSIT",
          "FORWARDER_ARRIVED",
          "ARRIVED",
          "CLEARANCE",
          "BOE_APPROVED",
          "ITEMS_CLAIM",
          "CHA_APPROVED",
          "CHA_BILL_GENERATED",
          "OUT_FOR_DELIVERY",
          "RECEIVED",
        ),
        defaultValue: "IN_TRANSIT",
        comment:
          "Status Flow: IN_TRANSIT - Shipped -> FORWARDER_ARRIVED -> ARRIVED - Port -> CLEARANCE - Customs process -> BOE_APPROVED -> ITEMS_CLAIM -> CHA_APPROVED -> CHA_BILL_GENERATED - Bill ready -> OUT_FOR_DELIVERY -> RECEIVED (GRN)",
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
  return histryShippingAlert;
};
