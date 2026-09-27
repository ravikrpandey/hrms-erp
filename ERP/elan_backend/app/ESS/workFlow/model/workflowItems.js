module.exports = (sequelize, Sequelize) => {
    const workFlowItems = sequelize.define('ESS_WORKFLOW_ITEMS', {
            id:{
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },        
            discount_flat: {
                type: Sequelize.INTEGER,
            },
            discount_percent: {
                type: Sequelize.INTEGER,
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
    return workFlowItems;
}
