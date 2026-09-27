module.exports = (sequelize, Sequelize) => {
    const sales_customer_document = sequelize.define("CUSTOMER_DOCUMENT_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_name: {
            type: Sequelize.STRING
        },
        upload_document: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    });
    return sales_customer_document;
}