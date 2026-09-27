module.exports = (sequelize, Sequelize) => {
    const transportChargesList = sequelize.define('TRANSPORT_CHARGES_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    charges_name: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.DECIMAL(20,2),
    },
    transport_voucher_id:{
        type: Sequelize.INTEGER,
    },
    parent_chart_account_id:{
        type: Sequelize.INTEGER,
    },
    chart_account_id:{
        type: Sequelize.INTEGER,
    }
    },
    {
        freezeTableName: true,
    }
    )
    transportChargesList.associate = (db) => {
        transportVoucher.belongsTo(db.customerProfile, {
          foreignKey: "transport_voucher_id",
          onDelete: "RESTRICT",
        });
    
        transportChargesList.belongsTo(db.createChartOfAccounts, {
          foreignKey: "parent_chart_account_id",
          onDelete: "RESTRICT",
        });
        transportChargesList.belongsTo(db.createChartOfAccounts, {
          foreignKey: "chart_account_id",
          onDelete: "RESTRICT",
        });
       
      };
    return transportChargesList;
  };
  