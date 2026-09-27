module.exports = (sequelize, Sequelize) => {
    const vehiclePlanningTransCharge = sequelize.define(
        "WH_VH_PLANNING_TRANS_CHARGES",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE',
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );

    return vehiclePlanningTransCharge;
};
