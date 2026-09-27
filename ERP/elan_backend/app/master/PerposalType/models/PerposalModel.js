module.exports = (sequelize, Sequelize) => {
    const perposal_type = sequelize.define("MASTER_PERPOSAL_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        perposal_type: {
            type: Sequelize.STRING
        },
        perposal_discription: {
            type: Sequelize.TEXT
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
    return perposal_type;
};