module.exports = (sequelize, Sequelize) => {
    const PaymentModel = sequelize.define("payment_master", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cheque_number: {
            type: Sequelize.STRING,
        },
        total_tax: {
            type: Sequelize.STRING
        },
        total_amt: {
            type: Sequelize.STRING
        },
        adv_paid: {
            type: Sequelize.STRING
        },
        amt_due: {
            type: Sequelize.STRING
        },
        amt_paid: {
            type: Sequelize.STRING
        },
        terms: {
            type: Sequelize.STRING
        },
        remarks: {
            type: Sequelize.STRING
        },
        doc: {
            type: Sequelize.STRING
        },
        payment_mode: {
            type: Sequelize.STRING
        },
        bank_account_name: {
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
    return PaymentModel
}