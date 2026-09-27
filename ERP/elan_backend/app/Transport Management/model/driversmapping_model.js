module.exports = (sequelize, Sequelize) => {
    const drivers_mapping = sequelize.define("TM_DRIVERS_MAPPING", {
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
    return drivers_mapping;
};
