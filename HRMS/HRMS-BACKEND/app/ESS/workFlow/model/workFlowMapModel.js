module.exports = (sequelize, Sequelize) => {
    const WorkFlow_Map = sequelize.define("ESS_WORK_FLOW_MAP", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status:{
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        });
    return WorkFlow_Map;
};