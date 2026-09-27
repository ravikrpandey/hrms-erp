module.exports = (sequelize, Sequelize) => {
    const appraisalDuration = sequelize.define("PAYROLL_APPRAISAL_DURATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        period:{
            type: Sequelize.STRING
        },
        effective_after:{
            type: Sequelize.INTEGER
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
    });
    return appraisalDuration;
};