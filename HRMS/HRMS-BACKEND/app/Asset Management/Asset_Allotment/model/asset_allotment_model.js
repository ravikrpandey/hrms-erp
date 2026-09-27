module.exports = (sequelize, Sequelize) => {
    const asset_allotment = sequelize.define("ASSET_ALLOTMENT", {
        asset_allotment_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asset_allotment_date: {
            type: Sequelize.DATEONLY(),
            allowNull: true,
        },
        asset_return_date: {
            type: Sequelize.DATEONLY(),
            allowNull: true,
        },
        condition_on_allotment: {
            type: Sequelize.ENUM("NEW", "GOOD", "USED"),
            defaultValue: "NEW",
        },
        condition_on_return: {
            type: Sequelize.ENUM("GOOD", "DAMAGED", "NA"),
            defaultValue: "NA",
        },
        current_status: {
            type: Sequelize.ENUM("ASSIGNED", "RETURNED", "AVAILABLE"),
            defaultValue: "AVAILABLE",
        },
        remark: {
            type: Sequelize.TEXT,
            allowNull: true,
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

    return asset_allotment;
};
