module.exports = (sequelize, Sequelize) => {
    const customerType = sequelize.define("MASTER_CUSTOMER_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customer_type_name: {
            type: Sequelize.STRING
        },
        lavel:{
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
    return customerType;
}