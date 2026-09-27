module.exports = (sequelize, Sequelize) => {
    const workStation = sequelize.define("MASTER_WORKSTATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type_of_workstation:{
            type: Sequelize.STRING
        },
        name_of_workstation:{
            type:Sequelize.STRING
        },
        running_cost_per_hour:{
            type:Sequelize.STRING
        },
        hourly_effciency:{
            type:Sequelize.STRING
        },
        description:{
            type:Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted:{
            type:Sequelize.BOOLEAN(true,false),
            defaultValue: false
        }
    },{
        freezeTableName:true
    });
    return workStation;
}