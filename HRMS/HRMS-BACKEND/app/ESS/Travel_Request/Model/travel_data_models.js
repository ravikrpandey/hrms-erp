module.exports = (sequelize, Sequelize) => {
    const travel_request_data = sequelize.define("ESS_TRAVEL_REQUEST_DATA", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        include_hotel: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        number_of_days: {
            type: Sequelize.INTEGER
        },
        travel_type: {
            type: Sequelize.ENUM,
            values: ['domestic', 'international'],
            defaultValue: 'domestic'
        },
        travel_to_date: {
            type: Sequelize.DATE
        },
        travel_from_date: {
            type: Sequelize.DATE
        },
        hotel_name: {
            type: Sequelize.STRING
        },
        domestic_travel_document: {
            type: Sequelize.JSON
        },
        international_travel_document: {
            type: Sequelize.JSON
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    },
        {
            freezeTableName: true,
        });
    return travel_request_data;
};
