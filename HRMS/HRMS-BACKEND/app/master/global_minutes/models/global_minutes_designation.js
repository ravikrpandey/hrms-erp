module.exports = (sequelize, Sequelize) => {
    const global_min_designation = sequelize.define("GLOBAL_MINUTE_DESIGNATIONAPPL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(false,true),
            defaultValue: false,
          }
    }, {
        freezeTableName: true
    });
    return global_min_designation;
};