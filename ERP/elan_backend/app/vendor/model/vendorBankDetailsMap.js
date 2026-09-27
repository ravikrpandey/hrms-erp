module.exports = (sequelize, Sequelize) => {
    const vendor_bank_details_map = sequelize.define("VENDOR_BANK_DETAILS_MAPPING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        bank_name: {
            type: Sequelize.STRING,
        },
        branch_name: {
            type: Sequelize.STRING,
        },
        account_holder_name: {
            type: Sequelize.STRING,
        },
        bank_address: {
            type: Sequelize.TEXT,
        },
        bank_account_number: {
            type: Sequelize.STRING,
        },
        unique_number_bank: {
            type: Sequelize.STRING,
        },
        swift_code: {
            type: Sequelize.STRING,
        },
        iban_code: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
        },
        {
            freezeTableName: true,
        });
    return vendor_bank_details_map;
};
