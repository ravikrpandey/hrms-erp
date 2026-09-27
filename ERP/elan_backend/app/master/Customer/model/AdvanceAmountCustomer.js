
module.exports = (sequelize, Sequelize) => {
    const advanceAmountCustomer = sequelize.define('ADVANCE_AMOUNT_CUSTOMER', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
      },
      customer_id:{
        type:Sequelize.INTEGER
      },
      current_advance:{
        type:Sequelize.DECIMAL(20,2)
      },
      transaction_type:{
        type:Sequelize.STRING
      },
      advance_amount:{
        type:Sequelize.DECIMAL(20,2)
      },
      payment_mode:{
        type:Sequelize.STRING
      },
      bank_account_id:{
        type:Sequelize.INTEGER
      },
      chart_account_id:{
        type:Sequelize.INTEGER
      },
      cheque_number:{
        type:Sequelize.STRING
      },
      terms_conditions:{
        type:Sequelize.STRING
      },
      tab_type:{
        type:Sequelize.STRING
      }
     
      },
      {
        freezeTableName: true,
      }
    );
    advanceAmountCustomer.associate = (db) => {
        transportVoucher.belongsTo(db.customerProfile, {
          foreignKey: "customer_id",
          onDelete: "RESTRICT",
        });
    
        advanceAmountCustomer.belongsTo(db.createBankAccount, {
          foreignKey: "bank_account_id",
          onDelete: "RESTRICT",
        });
        advanceAmountCustomer.belongsTo(db.createChartOfAccounts, {
          foreignKey: "chart_account_id",
          onDelete: "RESTRICT",
        });
        
       
      };

    return advanceAmountCustomer;
};
  