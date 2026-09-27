module.exports = (sequelize, Sequelize) => {
  const customerProfile = sequelize.define(
    "CUSTOMER_PROFILE_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      new_customer: {
        type: Sequelize.ENUM("YES", "NO"),
        defaultValue: "NO",
      },
      customer_code: {
        type: Sequelize.STRING,
      },
      gst_in: {
        type: Sequelize.STRING,
      },
      gst_category: {
        type: Sequelize.STRING,
      },
      gst_registration_date: {
        type: Sequelize.DATEONLY,
      },
      pan_number: {
        type: Sequelize.STRING,
      },
      is_group: {
        type: Sequelize.ENUM("YES", "NO"),
        defaultValue: "NO",
      },
      customerParentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "CUSTOMER_PROFILE_MST",
          key: "id",
        },
      },
      parent_id: {
        type: Sequelize.INTEGER,
      },
      customer_status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", "BLACKLISTED"),
        defaultValue: "ACTIVE",
      },
      registration_date_of_party: {
        type: Sequelize.DATEONLY,
      },
      data_status: {
        type: Sequelize.ENUM("Pending", "Approve"),
        defaultValue: "Pending",
      },
      website: {
        type: Sequelize.STRING,
      },
      identification: {
        type: Sequelize.STRING,
      },
      advance_amount: {
        type: Sequelize.DECIMAL(20,2),
      },
      is_Deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },

    {
      freezeTableName: true,
    }
  );
  return customerProfile;
};
