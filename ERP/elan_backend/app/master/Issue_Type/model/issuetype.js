module.exports = (sequelize, Sequelize) => {
    const issuemaster = sequelize.define("MASTER_ISSUE", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        issue_type:{
            type: Sequelize.TEXT
        },
        issue_code: {
            type: Sequelize.STRING
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
    })
    return issuemaster;
}