module.exports = (sequelize, Sequelize) => {
    const transportVoucherList = sequelize.define('TRANSPORT_VOUCHER_ACCOUNT_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    LR_number: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATEONLY,
    }, 
    from: {
      type: Sequelize.STRING,
    },
    to: {
      type: Sequelize.STRING,
    }, 
    vehicle_number: {
      type: Sequelize.STRING,
    },
    },
    {
        freezeTableName: true,
    }
    );
    return transportVoucherList;
  };
  