module.exports = (sequelize, Sequelize) => {
    const KpaObjective = sequelize.define("HRMS_KPA_EMPLOYEE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    
        employee_id: {
            type: Sequelize.INTEGER,
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
    return KpaObjective;
};