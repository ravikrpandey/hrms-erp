module.exports = (sequelize, Sequelize) => {
    const customer_typeDetails = sequelize.define("MASTER_CUSTOMER_TYPE", {
        customer_type_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customer_type_name: {
            type: Sequelize.STRING
        },
        isChecked: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: true,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
    
    {
      freezeTableName: true,
    });
    return customer_typeDetails;
}