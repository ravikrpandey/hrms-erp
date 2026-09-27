module.exports = (sequelize, Sequelize) => {
    const expense_approval = sequelize.define("EXPENSE_APPROVEL_LEVEL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.INTEGER
        },
        expense_approvel_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },
        expense_approval_remarks: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN, // ✅ Correct syntax
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });

    return expense_approval;
};
