module.exports = (sequelize, Sequelize) => {
    const otpVerificationCustomer = sequelize.define(
        "CUSTOMER_OTP_VERIFICATION_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            otp_verification_id: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
            },
            is_Deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            password:{
                type: Sequelize.STRING
            },
            country_code:{
                type: Sequelize.STRING
            },
            otp_verification_id: {
                type: Sequelize.STRING
            },
            mobile_no: {
                type: Sequelize.STRING
            },
            email:{
                type: Sequelize.STRING
            },
            full_name:{
                type: Sequelize.STRING
            },
            organization_name:{
                type: Sequelize.STRING
            },
            utm_source:{
                type: Sequelize.STRING
            },
            organization_type:{
                type: Sequelize.STRING,
            },
            pincode:{
                type: Sequelize.STRING
            },
            terms_and_conditions:{
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            industry_type:{
                type: Sequelize.STRING
            },
            token:{
                type: Sequelize.TEXT
            },
            gst_number:{
                type: Sequelize.STRING
            },
            gst_password:{
                type: Sequelize.STRING
            },
            token_expiry: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
              },
              customer_id:{
                type:Sequelize.INTEGER
              }
            
        },

        {
            freezeTableName: true,
        }
    );
    otpVerificationCustomer.associate = (db) => {
        otpVerificationCustomer.belongsTo(db.customerProfile, {
          foreignKey: "customer_id",
          onDelete: "RESTRICT",
        })
      };
    return otpVerificationCustomer;
};


