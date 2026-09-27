module.exports = (sequelize, Sequelize) => {
    const accessories_master = sequelize.define("MASTER_ACCESSORIES", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // accessories_name: {
        //     type: Sequelize.STRING
        // },
        // accessories_discount: {
        //     type: Sequelize.INTEGER
        // },
      

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return accessories_master;
}