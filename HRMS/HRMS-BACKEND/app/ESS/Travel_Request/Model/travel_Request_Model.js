module.exports = (sequelize, Sequelize) => {
    const travel_request = sequelize.define("ESS_TRAVEL_REQUEST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        travel_request_number: {
            type: Sequelize.STRING
        },
        travel_name: {
            type: Sequelize.STRING
        },
        department: {
            type: Sequelize.STRING
        },
        current_date: {
            type: Sequelize.DATEONLY('DD-MM-YYYY')
        },
        passport_number: {
            type: Sequelize.STRING
        },
        domestic_amount: {
            type: Sequelize.DECIMAL(12, 2)
        },
        international_amount: {
            type: Sequelize.DECIMAL(12, 2)
        },
        total_amount: {
            type: Sequelize.DECIMAL(12, 2)
        },
        unforseen_event: {
            type: Sequelize.INTEGER
        },
        travel_remarks: {
            type: Sequelize.STRING
        },
        travel_document: {
            type: Sequelize.STRING
        },
        domestic_allowances: {
            type: Sequelize.JSON
        },
        international_allowances: {
            type: Sequelize.JSON
        },
        travel_request_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
        },
        book_advance_status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        change_advance_status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ALLOCATED"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    },
        {
            freezeTableName: true,
        }
    );
    return travel_request;
};