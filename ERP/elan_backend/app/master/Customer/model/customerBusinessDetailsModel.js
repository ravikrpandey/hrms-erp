module.exports = (sequelize, Sequelize) => {
    const customer_business_details = sequelize.define("CUSTOMER_BUSINESS_DETAILS_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        preffered_payment_terms: {
            type: Sequelize.ENUM("ADVANCE PAYMENT", "30 DAYS", "60 DAYS", "90 DAYS"),
        },

        existing_vendor_code: {
            type: Sequelize.STRING
        },

        bank_name: {
            type: Sequelize.STRING
        },
        bank_account_number: {
            type: Sequelize.STRING
        },
        total_purchase_value: {
            type: Sequelize.STRING
        },
        amc_status: {
            type: Sequelize.ENUM("ACTIVE", "EXPIRED", "NOT SUBSCRIBED"),
        },
        amc_expiry_date: {
            type: Sequelize.DATEONLY
        },
        beneficiary_name: {
            type: Sequelize.STRING
        },
        account_type: {
            type: Sequelize.STRING
        },
        ifsc_code: {
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        is_Deleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },

        {
            freezeTableName: true,
        });
    return customer_business_details;
}