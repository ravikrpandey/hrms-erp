module.exports = (sequelize, Sequelize) => {
    const fine_management = sequelize.define(
        "PAYROLL_FINE_MANAGEMENT",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            month: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 12,
                },
            },
            amount: {
                type: Sequelize.DECIMAL(20, 2),
                allowNull: false,
            },
            fine_date: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
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

    return fine_management;
};
