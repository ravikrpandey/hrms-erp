module.exports = (sequelize, Sequelize) => {
    const poPaymentAddtion = sequelize.define("PO_PAYMENT_ADDTIONAL_LIST_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        additional_charges_name: {
            type: Sequelize.STRING,
        },
        amount: {
            type: Sequelize.INTEGER,
        },
        tax_rate: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });
    return poPaymentAddtion
}