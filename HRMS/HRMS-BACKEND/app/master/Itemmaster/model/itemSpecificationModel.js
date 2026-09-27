module.exports = (sequelize, Sequelize) => {
    const itemSpecification = sequelize.define("MASTER_ITEM_SPECIFICATION", {
        itemSequence_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        specificationType: {
            type: Sequelize.STRING
        },
        specificationDetails: {
            type: Sequelize.STRING
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
    return itemSpecification;
}