module.exports = (sequelize, Sequelize) => {
    const work_flow_main = sequelize.define("ESS_WORK_FLOW_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       type: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
       },
        {
            freezeTableName: true,
        });
    return work_flow_main;
};