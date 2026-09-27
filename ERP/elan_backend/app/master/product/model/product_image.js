module.exports = (sequelize, Sequelize) => {
    const imageproductDocument = sequelize.define('MASTER_PRODUCT_IMAGE_DOCUMENT', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
    })
    return imageproductDocument;
};
