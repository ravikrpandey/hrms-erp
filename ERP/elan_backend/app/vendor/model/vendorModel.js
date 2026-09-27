module.exports = (sequelize, Sequelize) => {
  const vendor_basic_details = sequelize.define(
    "VENDOR_BASIC_DETAILS",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendor_category: {
        type: Sequelize.ENUM("Domestic", "International"),
      },
      vendor_type: {
        type: Sequelize.STRING,
      },
      vendor_name: {
        type: Sequelize.STRING,
      },
      vendor_code: {
        type: Sequelize.STRING,
        unique: true,
      },
      vendor_email: {
        type: Sequelize.STRING,
        unique: true,
      },
      contact_number: {
        type: Sequelize.STRING,
        unique: true,
      },
      alternative_number: {
        type: Sequelize.STRING,
      },
      vendor_address: {
        type: Sequelize.TEXT,
      },
      vendor_pincode: {
        type: Sequelize.INTEGER,
      },
      pan_number: {
        type: Sequelize.STRING,
      },
      effective_date: {
        type: Sequelize.DATEONLY,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      cin_number: {
        type: Sequelize.STRING,
      },
      gst_in: {
        type: Sequelize.STRING,
      },
      msme_number: {
        type: Sequelize.STRING,
      },
      tan_number: {
        type: Sequelize.STRING,
      },
      ice_code: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      isChecked: {
        type: Sequelize.BOOLEAN(true, false),
        default: false,
      },
      rate: {
        type: Sequelize.DECIMAL(20, 2),
      },
      time_periods_from: {
        type: Sequelize.DATEONLY,
      },
      time_periods_to: {
        type: Sequelize.DATEONLY,
      },
      certificate_doc: {
        type: Sequelize.STRING,
      },
      isChecked_194: {
        type: Sequelize.BOOLEAN(true, false),
      },
      rate_194: {
        type: Sequelize.STRING,
      },
      declaration_doc: {
        type: Sequelize.STRING,
      },
      from_month: {
        type: Sequelize.STRING,
      },
      to_month: {
        type: Sequelize.STRING,
      },
      rcm_charge: {
        type: Sequelize.BOOLEAN(true, false),
      },
      OTP: {
        type: Sequelize.INTEGER,
      },
      OTPupdatedAt: {
        type: Sequelize.DATE,
      },
      advance_amount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      trade_currency_ids: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    },
  );
  return vendor_basic_details;
};
