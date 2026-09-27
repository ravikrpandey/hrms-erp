module.exports = (sequelize, Sequelize) => {
    const HRMSCompoffCreditLog = sequelize.define("HRMS_COMPOFF_CREDIT_LOG", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        compoff_date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isExpired: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        expiredAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: true,
    });

    return HRMSCompoffCreditLog;
};
