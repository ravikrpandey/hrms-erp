module.exports = (sequelize, Sequelize) => {
    const AreaName = sequelize.define("MASTER_AREA", {
       id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        area_name: {
            type: Sequelize.STRING,
            allowNull: false,
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
    })
    ;
    return AreaName;
};
