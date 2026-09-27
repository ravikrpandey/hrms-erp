module.exports = (sequelize, Sequelize) => {
    const self_rating = sequelize.define("ESS_SELF_RATING_ASSESSMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        self_rating: {
            type: Sequelize.STRING,
        },
        self_rating_value: {
            type: Sequelize.ENUM('0.00','1.00', '2.00', '3.00', '4.00', '5.00'),
            defaultValue: null,
        },
        rating_data: {
            type: Sequelize.STRING,
            allownull:false
        },  
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    {
      freezeTableName: true,
    });
    return self_rating;
};