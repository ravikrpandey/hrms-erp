module.exports = (sequelize, Sequelize) => {
    const customerBillingAddress = sequelize.define(
        "CUSTOMER_BILLING_ADDRESS_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            billing_address: {
                type: Sequelize.TEXT
            },
            billing_pin_code: {
                type: Sequelize.STRING
            },
            billing_postal_address: {
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
           
        },

        {
            freezeTableName: true,
        }
    );
    return customerBillingAddress;
};


