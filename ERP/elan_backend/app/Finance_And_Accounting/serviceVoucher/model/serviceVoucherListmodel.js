module.exports = (sequelize, Sequelize) => {
    const serviceVoucherList = sequelize.define('SERVICE_VOUCHER_ACCOUNT_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    qty: {
      type: Sequelize.INTEGER,
    },
    rate: {
        type: Sequelize.DECIMAL(20,0),
    },
    narration: {
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
        type:Sequelize.DECIMAL(20,0)
    },
    total_value:{
        type:Sequelize.DECIMAL(20,0)
    }
    },
    {
        freezeTableName: true,
    }
    );
    return serviceVoucherList;
  };
  