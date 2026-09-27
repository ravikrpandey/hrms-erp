module.exports = (sequelize, Sequelize) => {
    const announcement = sequelize.define("HRMS_ANNOUNCEMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        file_Name: { type: Sequelize.STRING },
        description: { type: Sequelize.TEXT },
        from_date: { type: Sequelize.STRING },
        to_date: { type: Sequelize.STRING },
        notice_title: { type: Sequelize.STRING },
     
        
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

    return announcement;
};
