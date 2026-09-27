module.exports = (sequelize, Sequelize) => {
    const committeeAssignUser = sequelize.define("ESS_COMMITTEE_ASSIGN_USER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE","INACTIVE"),
            defaultValue: "ACTIVE",
        },
        committee_rating_status: {
            type: Sequelize.ENUM("OPEN","CLOSE"),
            defaultValue: "OPEN",
        },
        committee_average_rating:{
            type: Sequelize.DECIMAL(10,2)
        },
       
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    });
    return committeeAssignUser;
};
