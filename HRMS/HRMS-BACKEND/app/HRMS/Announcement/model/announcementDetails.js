module.exports = (sequelize, Sequelize) => {
    const announcementDetails = sequelize.define("HRMS_ANNOUNCEMENT_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    }, {
        freezeTableName: true,
    });

    return announcementDetails;
};
