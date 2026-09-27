module.exports = (sequelize, Sequelize) => {
    const bankPaymentDoc = sequelize.define('BANK_PAYMENT_DOCUMENT', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      upload_doc:{
        type: Sequelize.STRING, 
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
      },
      {
        freezeTableName: true,
      }
    );
    return bankPaymentDoc;
  };
  