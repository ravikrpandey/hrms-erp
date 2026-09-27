module.exports = (sequelize, Sequelize) => {
    const  assetWarranty= sequelize.define("ASSETWARRANTY", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        entity_id: {
            type: Sequelize.INTEGER,
        },
        assetTagId: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          invoiceRefNumber: {
            type: Sequelize.STRING,
            allowNull: false
          },
          warrantyNumber: {
            type: Sequelize.STRING,
            allowNull: false
          },
          invoiceDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
          },
          fromDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
          },
          toDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
          },
          supplierNameId: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          remarks: {
            type: Sequelize.TEXT
          },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        }
    )
    return assetWarranty;
}