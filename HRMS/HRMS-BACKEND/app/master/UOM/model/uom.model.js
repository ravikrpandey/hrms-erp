module.exports = (sequelize, Sequelize) => {
    const uomdetails = sequelize.define("MASTER_UOM", {
        uom_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uom_name: {
            type: Sequelize.STRING(50)
        },
        uom_description: {
            type: Sequelize.STRING(500)
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },{
        freezeTableName:true
    });
    return uomdetails;
}