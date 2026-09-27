module.exports = (sequelize, Sequelize) => {
    const bankClearence = sequelize.define('BANK_CLEARENCE', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      clearence_date: {
        type: Sequelize.DATEONLY, 
      },
      posting_date: {
        type: Sequelize.DATEONLY, 
      },
      refrence_no: {
        type: Sequelize.STRING, 
      },
      updated_value: {
        type: Sequelize.BOOLEAN, 
        defaultValue:false
      },
      amount:{
        type: Sequelize.DECIMAL(20,2), 
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      reference_status:{
        type: Sequelize.ENUM('UnReconcile', 'Reconcile'),
         defaultValue: 'UnReconcile'
      }
      
      },
      {
        freezeTableName: true,
      }
    );
    return bankClearence;
  };
  