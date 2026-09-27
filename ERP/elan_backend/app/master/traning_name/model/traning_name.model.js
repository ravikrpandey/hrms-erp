module.exports = (sequelize, Sequelize) => {
    const traning_nameDetails = sequelize.define("MASTER_TRANING_NAME", {
        traning_name_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        traning_name: {
            type: Sequelize.STRING
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
    return traning_nameDetails;
}