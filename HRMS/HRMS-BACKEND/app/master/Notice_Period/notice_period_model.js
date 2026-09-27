module.exports = (sequelize, Sequelize) => {
    const notice_period_master = sequelize.define("NOTICE_PERIOD_MASTER", {
        notice_period_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        confirm_notice_days: {
            type: Sequelize.INTEGER
        },
        probation_notice_days: {
            type: Sequelize.INTEGER
        },
        can_buy_out: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        can_waive_out: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
        {
            freezeTableName: true
        }
    );

    return notice_period_master;
};
