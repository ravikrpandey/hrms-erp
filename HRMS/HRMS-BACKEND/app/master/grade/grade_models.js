module.exports = (sequelize, Sequelize) => {
    const grade_master = sequelize.define("MASTER_GRADE", {
        grade_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        grade_name: {
            type: Sequelize.STRING
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

    return grade_master;
};
