module.exports = (sequelize, Sequelize) => {
    const UploadDoc = sequelize.define("MASTER_WORKSATATION_UPLOAD_DOC", {
         id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UploadDoc:{
            type:Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    }, {
        freezeTableName: true
    });
    return UploadDoc;
}
