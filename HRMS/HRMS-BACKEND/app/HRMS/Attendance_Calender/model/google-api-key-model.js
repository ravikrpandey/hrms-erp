const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const api_key = sequelize.define("GOOGLE_API_KEY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        apiKey: {
            type: Sequelize.STRING,
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
        }
    );
    return api_key;
};