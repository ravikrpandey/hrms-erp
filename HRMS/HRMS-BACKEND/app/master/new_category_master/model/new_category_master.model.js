module.exports = (sequelize, Sequelize) => {
    const new_category_masterDetails = sequelize.define("MASTER_NEW_CATEGORY_MASTER", {
        new_category_master_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        new_category_master_name: {
            type: Sequelize.STRING
        },
        segment_id: {
            type: Sequelize.INTEGER,
        },
        isChecked: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: true,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
    
    {
      freezeTableName: true,
    });
    return new_category_masterDetails;
}