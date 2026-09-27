module.exports = (sequelize, Sequelize) => {
    const lmsCourseDetails = sequelize.define("LMS_COURSE_CATEGORY", {
        category_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE" , "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull :true
          }
    },
    
    {
      freezeTableName: true,
    });
    return lmsCourseDetails;
};