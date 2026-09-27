module.exports = (sequelize, Sequelize) => {
    const extrahour_Master = sequelize.define("MASTER_EXTRA_HOUR", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        from: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        to: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        percentage: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },

        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },

        {
            freezeTableName: true,
        })
        ;
    return extrahour_Master;
};
