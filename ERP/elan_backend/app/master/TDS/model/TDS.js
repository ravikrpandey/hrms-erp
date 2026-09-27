module.exports = (sequelize, Sequelize) => {
    const tds = sequelize.define("SYS_TDS_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        section: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        maximum_amount:{
            type:Sequelize.DECIMAL(20,2)
        },
        isDeleted:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        nature: {
            type: Sequelize.STRING
        },
    },
    
    {
      freezeTableName: true,
    });
    return tds
}