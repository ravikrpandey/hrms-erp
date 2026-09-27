module.exports = (sequelize, Sequelize) => {
    const imageDocument = sequelize.define('MASTER_ITEM_IMAGE_DOCUMENT', {
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
    return imageDocument;
};
