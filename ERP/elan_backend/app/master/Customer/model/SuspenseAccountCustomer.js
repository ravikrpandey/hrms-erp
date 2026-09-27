
module.exports = (sequelize, Sequelize) => {
    const suspenseAccountCustomer = sequelize.define('SUSPENSE_ACCOUNT_CUSTOMER', {
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
      payment_status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED'),
        defaultValue: 'PENDING'
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
      },
    
      name:{
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
      entity_id:{
        type:Sequelize.INTEGER
      }, 
      financial_id:{
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
    suspenseAccountCustomer.associate = (db) => {
        suspenseAccountCustomer.belongsTo(db.createBankAccount, {
          foreignKey: "bank_account_id",
          onDelete: "RESTRICT",
        });
        suspenseAccountCustomer.belongsTo(db.createChartOfAccounts, {
          foreignKey: "chart_account_id",
          onDelete: "RESTRICT",
        }); 
        suspenseAccountCustomer.belongsTo(db.entityMaster, {
          foreignKey: "entity_id",
          onDelete: "RESTRICT",
        }); 
        suspenseAccountCustomer.belongsTo(db.financial_year, {
          foreignKey: "financial_id",
          onDelete: "RESTRICT",
        });
      };

    return suspenseAccountCustomer;
};
  