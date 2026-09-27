module.exports = (sequelize, Sequelize) => {
    const Kpa = sequelize.define("HRMS_KPA_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        activity: {
            type: Sequelize.STRING(255),
        },
        kpi_data: {
            type: Sequelize.TEXT,
        },
        aplicable_for: {
            type: Sequelize.ENUM("Department_User", "Selected_User"),
        },
        probation_employee: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        }
    );
    return Kpa;
};