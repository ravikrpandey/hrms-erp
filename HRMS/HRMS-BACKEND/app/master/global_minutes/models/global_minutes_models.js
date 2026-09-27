module.exports = (sequelize, Sequelize) => {
    const global_minutes = sequelize.define("MASTER_GLOBAL_MINUTE", {
        global_minutes_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        global_minute_value: {
            type: Sequelize.INTEGER
        },
        effective_from: {
            type: Sequelize.DATE
        },
        applicable_forall: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            allowNull: false
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

    return global_minutes;
};
