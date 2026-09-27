module.exports = (sequelize, Sequelize) => {
    const directInvoiceItems = sequelize.define("DIRECT_INVOICE_ITEMS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        item_category: {
            type: Sequelize.STRING, 
            allowNull: true,
          },
          referenceNo: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          amount: {
            type: Sequelize.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
          },
          discount1: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0,
          },
          discount2: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0,
          },
          vatRate: {
            type: Sequelize.INTEGER, 
            defaultValue: 0,
          },
          vatIncluded: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          totalAmount: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0,
          },
    },
        {
            freezeTableName: true
        });
    return directInvoiceItems
}