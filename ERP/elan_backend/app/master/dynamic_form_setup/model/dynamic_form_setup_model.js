module.exports = (sequelize, Sequelize) => {
    const dynamicFormSetup = sequelize.define("DYNAMIC_FORM_SETUP", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dynamic_fields: {
            type: Sequelize.JSON,
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
    return dynamicFormSetup;
}