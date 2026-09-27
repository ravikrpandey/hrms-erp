module.exports = (sequelize, Sequelize) => {
    const salesJournalAccount = sequelize.define('SALES_JOURNAL_ACCOUNT_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gst_rate:{
        type: Sequelize.DECIMAL(20,2),
    },
    gst_amount:{
        type: Sequelize.DECIMAL(20,2),
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    rate: {
        type: Sequelize.DECIMAL(20,2),
    },
    narration: {
        type: Sequelize.STRING,
    },
     remarks: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
    },
    discount_type:{
        type:Sequelize.ENUM('FIXED','PERCENTAGE'),
        default:'FIXED'
    },
    discount_value:{
     type:Sequelize.DECIMAL(20,0)
    },
    discount_amount:{
        type:Sequelize.DECIMAL(20,2)
    },
    total_value:{
        type:Sequelize.DECIMAL(20,2)
    }
    },
    {
        freezeTableName: true,
    }
    );
    return salesJournalAccount;
  };
  