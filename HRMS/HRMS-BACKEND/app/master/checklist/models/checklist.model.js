module.exports = (sequelize, Sequelize) => {
    const checklistdetails = sequelize.define("MASTER_CHECKLIST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        checklist_name: {
            type: Sequelize.STRING(50)
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },{
        freezeTableName:true
    });
    return checklistdetails;
}