module.exports = (sequelize, Sequelize) => {
    const reviewDetails = sequelize.define("CUSTOMER_REVIEW", {
        review_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        review_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE" , "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull :true
          }
    },
    
    {
      freezeTableName: true,
    });
    return reviewDetails;
};