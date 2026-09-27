module.exports = (sequelize, Sequelize) => {
    const customerApproval = sequelize.define("MASTER_CUSTOMER_APPROVAL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employee_ids: {
            type: Sequelize.JSON,   
            allowNull: false
        },
        approval_option: {
            type: Sequelize.ENUM("with_document", "without_document"),
            allowNull: false
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return customerApproval;
};