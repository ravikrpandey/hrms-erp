module.exports = (sequelize, Sequelize) => {
    const salesTarget = sequelize.define("SALES_TARGET", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        target_name: {
            type: Sequelize.STRING,
        },
        target_amount: {
            type: Sequelize.BIGINT,
        },
        valid_from: {
            type: Sequelize.DATEONLY,
        },
        valid_to: {
            type: Sequelize.DATEONLY,
        },
        status: {
            type: Sequelize.ENUM("PENDING", "REJECTED", "APPROVED"),
            defaultValue: "PENDING",
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
    return salesTarget;
};