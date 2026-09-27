module.exports = (sequelize, Sequelize) => {
    const customerIndustryType = sequelize.define("MASTER_INDUSTRY_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customer_industries: {
            type: Sequelize.STRING
        },
        isDeleted:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
    
    {
      freezeTableName: true,
    });
    return customerIndustryType;
}