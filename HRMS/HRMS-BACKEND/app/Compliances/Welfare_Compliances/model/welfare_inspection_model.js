module.exports = (sequelize, Sequelize) => {
    const welfare_inspection = sequelize.define(
        "COMPLIANCES_WELFARE_INSPECTION",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            date_of_inspec: {
                type: Sequelize.DATEONLY(),
                allowNull: true,
            },
            department_id: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            supervisor: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            remarks: {
                type: Sequelize.JSON,
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

    return welfare_inspection;
};
