module.exports = (sequelize, Sequelize) => {
    const stageDetail = sequelize.define("MASTER_STAGE", {
        stage_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        stage_name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
    
    {
      freezeTableName: true,
    });
    return stageDetail
}