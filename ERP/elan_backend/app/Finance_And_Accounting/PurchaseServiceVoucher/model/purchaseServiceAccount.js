module.exports = (sequelize, Sequelize) => {
    const purchaseServiceVoucherAccount = sequelize.define('PURCHASE_SERVICE_ACCOUNT_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rate: {
        type: Sequelize.DECIMAL(20,2),
    },
    tax: {
        type: Sequelize.DECIMAL(20,2),
    },
    gst_amount: {
      type: Sequelize.DECIMAL(20,2),
    },
    tds_rate_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    service_code: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
    },
    final_amount:{
        type: Sequelize.DECIMAL(20,2),
    },
    purchase_service_voucher_id:{
        type:Sequelize.INTEGER
    },
    chart_account_id:{
        type:Sequelize.INTEGER
    },
    profit_center_id:{
        type:Sequelize.INTEGER
    }, 
    cost_center_id:{
        type:Sequelize.INTEGER
    },
    service_id:{
        type:Sequelize.INTEGER
    },

       remarks: {
        type: Sequelize.STRING,
    },

    },
    {
        freezeTableName: true,
    }
    );
    purchaseServiceVoucherAccount.associate = (db) => {
        transportVoucher.belongsTo(db.purchaseServiceVoucher, {
          foreignKey: "purchase_service_voucher_id",
          onDelete: "RESTRICT",
        });
    
        purchaseServiceVoucherAccount.belongsTo(db.Service_master, {
          foreignKey: "service_id",
          onDelete: "RESTRICT",
        });
        
        purchaseServiceVoucherAccount.belongsTo(db.financeProfitCenter, {
            foreignKey: "profit_center_id",
            onDelete: "RESTRICT",
          });
          purchaseServiceVoucherAccount.belongsTo(db.cost_center, {
            foreignKey: "cost_center_id",
            onDelete: "RESTRICT",
          });
       
      };
    return purchaseServiceVoucherAccount;
  };
  