module.exports = (sequelize, Sequelize) => {
    const glMappingTransactions = sequelize.define("GL_MAPPING_TRANSACTIONS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        transaction_type:{
            type:Sequelize.STRING
        }
       
    },
    
    {
      freezeTableName: true,
    });
    return glMappingTransactions
}