module.exports = (sequelize, Sequelize) => {
    const asset_documents = sequelize.define('ASSET_DOCUMENTS', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      upload_document: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
  
        isDeleted: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "0",
        },
      },
      {
        freezeTableName: true,
      }
    );
    return asset_documents;
  };
  