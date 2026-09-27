module.exports = (sequelize, Sequelize) => {
    const adjustmentJournalDocument= sequelize.define('ADJUSTMENT_DOCUMENT', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      file:{
        type:Sequelize.STRING
      },
     title:{
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
    return adjustmentJournalDocument;
  };
  