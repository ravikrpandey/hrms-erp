module.exports = (sequelize, Sequelize) => {
    const hrmsLeaveMaster = sequelize.define("HRMS_LEAVE_POLICY", {
        leaveId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        leave_name: {
            type: Sequelize.STRING, 
        },
        leave_code: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true,false),
            defaultValue: false,
          }
    }, {
        freezeTableName: true,
        timestamps: true // Adds createdAt and updatedAt fields
    });
    return hrmsLeaveMaster;
};

