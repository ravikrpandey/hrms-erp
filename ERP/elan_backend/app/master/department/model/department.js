module.exports = (sequelize, Sequelize) => {
    const stageDetails = sequelize.define("MASTER_DEPARTMENT", {
        dept_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        department_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        department_code: {
            type: Sequelize.STRING,
        },
        cc_code :{
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    });
    return stageDetails;
};
