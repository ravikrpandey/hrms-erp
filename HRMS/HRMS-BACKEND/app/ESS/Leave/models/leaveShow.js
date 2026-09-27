module.exports = (sequelize, Sequelize) => {
    const leaveShow = sequelize.define("ESS_LEAVE_SHOW", {
        show_leave_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        leave_type: {
            type: Sequelize.STRING
        },
        fromDate: {
            type: Sequelize.DATEONLY
        },
        toDate: {
            type: Sequelize.DATEONLY
        },
        remaning_leave: {
            type: Sequelize.INTEGER
        },
    },
    {
      freezeTableName: true,
    });
    return leaveShow;
};