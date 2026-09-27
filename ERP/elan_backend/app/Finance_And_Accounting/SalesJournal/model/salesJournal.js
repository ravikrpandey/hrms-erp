module.exports = (sequelize, Sequelize) => {
    const salesJournal = sequelize.define('SALES_JOURNAL', {
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
        type: Sequelize.DECIMAL(20,2), 
      },
    
      bill_amount: {
        type: Sequelize.DECIMAL(20,2), 
      }, 
      less_amount: {
        type: Sequelize.DECIMAL(20,2), 
      },
      gross:{
        type: Sequelize.DECIMAL(20,2), 
      },
      taxable:{
        type: Sequelize.DECIMAL(20,2), 
      },
      totalDiscount:{
        type: Sequelize.DECIMAL(20,2), 
      },
     igst:{
      type: Sequelize.DECIMAL(20,2), 
    },
     cgst:{
      type: Sequelize.DECIMAL(20,2), 
    },
     sgst:{
      type: Sequelize.DECIMAL(20,2), 
    },
      gstTotal:{
        type: Sequelize.DECIMAL(20,2), 
      },
     net:{
      type: Sequelize.DECIMAL(20,2), 
    },
     rate:{
      type: Sequelize.DECIMAL(20,5), 
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
    billing_id: {
         type:Sequelize.INTEGER
    },
      },
      {
        freezeTableName: true,
      }
    );
    salesJournal.associate = (db) => {
      salesJournal.belongsTo(db.customerBilling, {
        foreignKey: "billing_id",
        onDelete: "RESTRICT",
      });
    };
    return salesJournal;
};
  