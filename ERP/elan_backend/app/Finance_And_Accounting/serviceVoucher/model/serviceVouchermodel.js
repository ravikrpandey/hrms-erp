module.exports = (sequelize, Sequelize) => {
    const serviceVoucher = sequelize.define('SERVICE_VOUCHER', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      document_number:{
        type: Sequelize.STRING,
      },
      posting_date: {
        type: Sequelize.DATEONLY, 
      },
      transaction_date: {
        type: Sequelize.DATEONLY, 
      },
      notes: {
        type: Sequelize.STRING,
      },
      reference_number:{
        type: Sequelize.STRING,
      },
      sales_value: {
        type: Sequelize.DECIMAL(20,0), 
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
      document_type: {
         type:Sequelize.STRING
    },
    cgstAmt: {
         type:Sequelize.DECIMAL(20,2)
    },
    taxableAmt: {
         type:Sequelize.DECIMAL(20,2)
    },
    gstTotalAmt: {
         type:Sequelize.DECIMAL(20,2)
    },
     sgstAmt: {
         type:Sequelize.DECIMAL(20,2)
    },
     igstAmt: {
         type:Sequelize.DECIMAL(20,2)
    },
    totalDiscount: {
         type:Sequelize.DECIMAL(20,2)
    },
     netAmt: {
         type:Sequelize.DECIMAL(20,2)
    },
    grossAmt: {
         type:Sequelize.DECIMAL(20,2)
    },
      },
      {
        freezeTableName: true,
      }
    );
    return serviceVoucher;
};
  