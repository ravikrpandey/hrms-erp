module.exports = (sequelize, Sequelize) => {
    const vehicles_mapping = sequelize.define("TM_VEHICLES_MAPPING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM('LINKED','UNLINKED'),
            allowNull: false,
            defaultValue: 'LINKED'
        },
        },
        {
            freezeTableName: true,
        });
    return vehicles_mapping;
};
