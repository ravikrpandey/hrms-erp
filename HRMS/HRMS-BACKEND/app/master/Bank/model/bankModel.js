module.exports = (sequelize, Sequelize) => {
    const BANkName = sequelize.define("MASTER_BANK_DETAILS", {
       id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        bank_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        bank_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
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
    return BANkName;
};
