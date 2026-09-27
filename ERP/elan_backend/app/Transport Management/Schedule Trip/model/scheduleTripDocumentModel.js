module.exports = (sequelize, Sequelize) => {
    const scheduleTripDocument = sequelize.define("SCHEDULE_TRIP_DOCUMENT", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        document_name:{
            type:Sequelize.STRING
        },
        upload_document: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },

        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
    });

    return scheduleTripDocument;
};
