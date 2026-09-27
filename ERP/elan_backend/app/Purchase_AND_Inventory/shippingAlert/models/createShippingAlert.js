module.exports = (sequelize, Sequelize) => {
  const createShippingAlert = sequelize.define(
    "SHIPPING_ALERT_SCHEDULE",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mode: {
        type: Sequelize.STRING,
      },
      buyer_remark: {
        type: Sequelize.STRING,
      },
      shiped_no: {
        type: Sequelize.STRING,
      },
      audit: {
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
      shipment_date: {
        type: Sequelize.DATEONLY,
      },
      expected_arrival: {
        type: Sequelize.DATEONLY,
      },

      variance_remark: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      invoice_date: {
        type: Sequelize.DATEONLY,
      },
      invoice_no: {
        type: Sequelize.STRING,
      },
      invoice_amount: {
        type: Sequelize.DECIMAL(15, 4),
      },
      cha_service_charges: {
        type: Sequelize.DECIMAL(15, 4),
      },
      cha_other_charges: {
        type: Sequelize.DECIMAL(15, 4),
      },
      freight_charges: {
        type: Sequelize.DECIMAL(15, 4),
      },
      loading_unloading_charges: {
        type: Sequelize.DECIMAL(15, 4),
      },
      port_to_warehouse_charges: {
        type: Sequelize.DECIMAL(15, 4),
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      buyer_status: {
        type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
        defaultValue: "PENDING",
      },
      terms_condition: {
        type: Sequelize.BOOLEAN,
      },
      buyer_remark: {
        type: Sequelize.STRING,
      },
      departure_location: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
    },
  );
  return createShippingAlert;
};
