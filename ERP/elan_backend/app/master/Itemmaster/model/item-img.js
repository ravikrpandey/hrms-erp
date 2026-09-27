module.exports = (sequelize, Sequelize) => {
    const item_image = sequelize.define('MASTER_ITEM_IMAGE', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
    },
        {
            freezeTableName: true,
        })
    return item_image;
};
