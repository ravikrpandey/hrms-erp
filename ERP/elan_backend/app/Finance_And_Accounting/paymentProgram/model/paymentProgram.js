module.exports = (sequelize, Sequelize) => {
    const paymentProgram = sequelize.define('PAYMENT_PROGRAM', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      document_number:{
        type:Sequelize.STRING
      },
      amount:{
        type:Sequelize.DECIMAL(20,2)
      },
      remarks:{
        type:Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      payment_program_status:{
        type:Sequelize.ENUM('Pending','Approved'),
        defaultValue: 'Pending'
      },
      payment_status:{
        type:Sequelize.STRING,
        defaultValue: 'Program Payment'
      },
      document_type:{
        type:Sequelize.STRING
      },
      reference_number:{
        type:Sequelize.STRING
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
    return paymentProgram;
  };
  