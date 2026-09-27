module.exports = (sequelize, Sequelize) => {
    const adjustmentJournal = sequelize.define('ADJUSTMENT_JOURNAL', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      posting_date: {
        type: Sequelize.DATEONLY, 
      },
      document_number: {
        type: Sequelize.STRING, 
      },
      transaction_date: {
        type: Sequelize.DATEONLY, 
      },
      bill_number: {
        type: Sequelize.STRING, 
      },
      
      notes: {
        type: Sequelize.STRING,
      },
      cheque_ref_no: {
        type: Sequelize.STRING, 
      },
      cheque_ref_date: {
        type: Sequelize.DATEONLY, 
      },  
      rate: {
        type: Sequelize.INTEGER(20,3), 
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
    return adjustmentJournal;
  };
  