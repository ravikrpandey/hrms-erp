module.exports = (sequelize, Sequelize) => {
    const tdsList = sequelize.define("TDS_LIST_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nature_of_transaction: {
            type: Sequelize.STRING
        },
        threshold_limit: {
            type: Sequelize.STRING
        },
        rate: {
            type: Sequelize.DECIMAL(20,2)
        },
        maximum_amount:{
            type: Sequelize.DECIMAL(20,2)
        },
        current_rate:{
            type: Sequelize.DECIMAL(20,2)
        },
        new_rate:{
            type: Sequelize.DECIMAL(20,2)
        },
        from_date:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
      
    },
    
    {
      freezeTableName: true,
    });
    return tdsList
}