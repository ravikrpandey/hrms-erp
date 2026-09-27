module.exports = (sequelize, Sequelize) => {
    const Work_Flow_range = sequelize.define('ESS_WORKFLOW_RANGE', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
      
        level:{
            type: Sequelize.INTEGER
        },
        status:{
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
     
    },
    {
        freezeTableName: true
    });
    return Work_Flow_range;
}