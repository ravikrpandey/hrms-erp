module.exports = (sequelize, Sequelize) => {
    const WorkFlow_Master = sequelize.define("ESS_WORK_FLOW_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        job_name:{
            type: Sequelize.STRING
        },
        workflow_type:{
            type: Sequelize.ENUM("Item", "Service"),
        },
        budget_planning_type:{
            type: Sequelize.ENUM("Capex", "Opex"),
            
        },
        status: {
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
    return WorkFlow_Master;
};