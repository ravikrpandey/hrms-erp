module.exports = (sequelize, Sequelize) => {
    const scheduleTrip = sequelize.define("SCHEDULE_TRIP", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        trip_id: {
            type: Sequelize.STRING,
        },
        distance: {
            type: Sequelize.STRING,
        },
        trip_type: {
            type: Sequelize.ENUM("One-Way", "Round-Trip"),
        },
        dispatch_date: {
            type: Sequelize.DATE,
        },
        delivery_date: {
            type: Sequelize.DATE,
        },
        modeOfTransport: {
            type: Sequelize.ENUM("self", "vendor"),
        },
        max_load_capacity: {
            type: Sequelize.STRING,
        },
        odometerReading: {
            type: Sequelize.STRING,
        },
        advance_amount: {
            type: Sequelize.STRING,
        },
        vendor_driver_name: {
            type: Sequelize.STRING,
        },
        vendor_driver_contact: {
            type: Sequelize.STRING,
        },
        vendor_payment_term: {
            type: Sequelize.STRING,
        },
        vendor_amount: {
            type: Sequelize.STRING,
        },
        lr_number: {
            type: Sequelize.STRING,
        },
        lr_date: {
            type: Sequelize.STRING,
        },
        lr_issued_by: {
            type: Sequelize.STRING,
        },
        total_packages: {
            type: Sequelize.STRING,
        },
        total_weight: {
            type: Sequelize.STRING,
        },
        freight_type: {
            type: Sequelize.STRING,
        },
        lr_copy: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE","INACTIVE"),
            defaultValue:"ACTIVE"
        },
        status_type: {
            type: Sequelize.ENUM("SCHEDULED","STARTED","CLOSED"),
            
        },
         isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
    });

    return scheduleTrip;
};
