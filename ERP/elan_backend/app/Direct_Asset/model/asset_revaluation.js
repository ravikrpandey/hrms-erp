module.exports = (sequelize, Sequelize) => {
    const assetRevaluation = sequelize.define("ASSET_REVALUATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        old_value: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        new_value: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        revaluation_date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        reason_notes: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
        }
    }, {
        freezeTableName: true
    });

    return assetRevaluation;
};
