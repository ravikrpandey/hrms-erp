module.exports = (sequelize, Sequelize) => {
    const table = sequelize.define("BOM_KIT_GROUP", {
       id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        bom_code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
      freezeTableName: true,
    });
    return table;
};