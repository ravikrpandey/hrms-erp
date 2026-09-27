module.exports = (sequelize, Sequelize) => {
  const vendorBillingAddress = sequelize.define(
    "VENDOR_BILLING_ADDRESS",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
     
      billing_pin_code: {
        type: Sequelize.STRING
      },
      billing_address: {
        type: Sequelize.STRING
      },
      
      billing_postal_address: {
        type: Sequelize.STRING
      },    
      
      gst_category:{
        type: Sequelize.ENUM("RP", "URP")
      },
      gst_in: {
        type: Sequelize.STRING,
        
      },
      isGstType: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", 'BLACKLISTED'),
        defaultValue: "ACTIVE",
      },
      is_Deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },

    {
      freezeTableName: true,
    }
  );
  return vendorBillingAddress;
};