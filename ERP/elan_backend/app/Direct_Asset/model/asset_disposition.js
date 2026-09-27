module.exports = (sequelize, Sequelize) => {
    const AssetDisposition = sequelize.define("ASSET_DISPOSITION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        disposition_type: {
            type: Sequelize.ENUM("sell", "writeOff"),
            allowNull: false
        },
        buyer_name: {
            type: Sequelize.STRING
        },
        buyer_contact: {
            type: Sequelize.STRING
        },
        buyer_company: {
            type: Sequelize.STRING
        },
        scrap_value: {
            type: Sequelize.DECIMAL(10, 2)
        },
        disposal_method: {
            type: Sequelize.STRING
        },
        discard_reason: {
            type: Sequelize.TEXT
        },
        discard_date: {
            type: Sequelize.DATEONLY,
            allowNull:true
        },
        disposition_date: {
            type: Sequelize.DATEONLY,
        },
        note: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        paymentMode: {
            type: Sequelize.ENUM("Cash", "Bank Transfer","Cheque"),
            allowNull: true,
        },
        approval_status: {
            type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
            defaultValue: "Pending"
        },
        invoiceUpload:{
            type:Sequelize.STRING
        },
        supportingDocs:{
            type:Sequelize.STRING
        }
    }, {
        freezeTableName: true,
    });

    return AssetDisposition;
};
