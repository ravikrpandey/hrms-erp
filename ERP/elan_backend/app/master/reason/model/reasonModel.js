module.exports = (sequelize, Sequelize) => {
    const Master_Reason = sequelize.define("MASTER_REASON_RECRUITMENT", {
       id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reason_for_recruitment: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    })
    ;
    return Master_Reason;
};
