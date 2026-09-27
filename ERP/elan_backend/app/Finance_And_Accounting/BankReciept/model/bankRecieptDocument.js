module.exports = (sequelize, Sequelize) => {
    const bankRecieptDoc = sequelize.define('BANK_RECIEPT_DOCUMENT', {
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
    return bankRecieptDoc;
  };
  