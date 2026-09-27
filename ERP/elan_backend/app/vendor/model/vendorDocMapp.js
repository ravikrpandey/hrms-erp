module.exports = (sequelize, Sequelize) => {
    const vendor_doc_details_map = sequelize.define("VENDOR_DOCUMENT_DETAILS_MAPPING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_type: {
            type: Sequelize.STRING,
        },
        document_name: {
            type: Sequelize.STRING,
        },
        expired_date: {
            type: Sequelize.DATE,
        },
        notification_required:{
            type: Sequelize.ENUM("YES", "NO"),
        },
        notice_day:{
            type: Sequelize.INTEGER,
        },
        upload_doc:{
            type: Sequelize.STRING,
        },
        remark:{
            type: Sequelize.TEXT,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
        },
        {
            freezeTableName: true,
        });
    return vendor_doc_details_map;
};
