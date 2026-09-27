module.exports = (sequelize, Sequelize) => {
    const salesTargetMapping = sequelize.define("SALES_TARGET_MAPPING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        target_amount: {
            type: Sequelize.BIGINT,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
        },
        {
            freezeTableName: true,
        });
    return salesTargetMapping;
};