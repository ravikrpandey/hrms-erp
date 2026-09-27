module.exports = (sequelize, Sequelize) => {
    const paymentProgramList = sequelize.define('PAYMENT_PROGRAM_LIST', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      total_amount:{
        type:Sequelize.DECIMAL(20,2)
      },
      amount_due:{
        type:Sequelize.DECIMAL(20,2)
      },
      paid_amount:{
        type:Sequelize.DECIMAL(20,2)
      },
      currency_rate:{
        type:Sequelize.DECIMAL(20,5)
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
      document_no: {
        type: Sequelize.STRING,
      },
      nature: {
        type: Sequelize.STRING,
      },
      current_rate: {
          type: Sequelize.DECIMAL(20,2),
      },
      tds_rate_amount: {
          type: Sequelize.DECIMAL(20,2),
      },
       adjustment_type: {
        type: Sequelize.ENUM('no_adjust', 'partial_adjust','full_adjust'),
        allowNull: false,
        defaultValue: 'no_adjust'
      },
        calculated_amount:{
            type:Sequelize.DECIMAL(20.3)
        },
        
        adjusted_amount:{
            type:Sequelize.DECIMAL(20.3)
        }


      },
      {
        freezeTableName: true,
      }
    );
    return paymentProgramList;
  };
  