module.exports = (sequelize, Sequelize) => {
    const ticketCategory = sequelize.define("TICKET_CATEGORY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categoryName: {
            type: Sequelize.STRING
        },
        categoryCode: {
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM,
            values : ["ACTIVE", "INACTIVE"],
            defaultValue: "ACTIVE",
            allowNull: true
          }
    },
    {
      freezeTableName: true,
    });
    return ticketCategory;
};
