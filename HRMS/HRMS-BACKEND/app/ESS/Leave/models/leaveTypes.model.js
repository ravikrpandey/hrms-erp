module.exports = (sequelize, Sequelize) => {
    const leaveTypesDetails = sequelize.define("ESS_LEAVE_MASTER", {
        leave_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        leave_type: {
            type: Sequelize.STRING
        },
        number_of_leave: {
            type: Sequelize.INTEGER
        },
        is_carry_forward: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        leave_in_month: {
            type: Sequelize.FLOAT
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
    {
      freezeTableName: true,
    });
    return leaveTypesDetails;
};