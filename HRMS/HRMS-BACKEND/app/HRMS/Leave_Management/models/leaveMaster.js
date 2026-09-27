module.exports = (sequelize, Sequelize) => {
    const hrmsLeaveMaster = sequelize.define("HRMS_LEAVE_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        leave_name: {
            type: Sequelize.STRING,
            allowNull: false 
        },
        leave_code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        total_available: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
    }, {
        freezeTableName: true,
        timestamps: true // Adds createdAt and updatedAt fields
    });

    return hrmsLeaveMaster;
};
