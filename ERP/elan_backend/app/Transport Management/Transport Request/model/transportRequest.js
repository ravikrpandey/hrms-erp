module.exports = (sequelize, Sequelize) => {
    const transportRequest = sequelize.define("TRANSPORT_REQUEST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        request_id: {
            type: Sequelize.STRING,
            unique: true
        },
        request_datetime: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        requested_by: {
            type: Sequelize.STRING
        },
        // requesting_department: {
        //     type: Sequelize.STRING
        // },
        priority_level: {
            type: Sequelize.ENUM("Low", "Medium", "High", "Urgent"),
            defaultValue: "Low"
        },
        pickup_location: {
            type: Sequelize.TEXT
        },
        delivery_location: {
            type: Sequelize.TEXT
        },
        delivery_pincode: {
            type: Sequelize.INTEGER
        },
        isProduct: {
            type: Sequelize.BOOLEAN
        },
        isItem: {
            type: Sequelize.BOOLEAN
        },
        pickup_pincode: {
            type: Sequelize.INTEGER
        },
        via: {
            type: Sequelize.STRING
        },
        transported_by: {
             type: Sequelize.ENUM("self", "vendor")
        },
        requested_pickup_datetime: {
            type: Sequelize.DATE
        },
        requested_delivery_datetime: {
            type: Sequelize.DATE
        },
        status_type: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED","SCHEDULED"),
            defaultValue: "PENDING"
        },
        delivery_type: {
            type: Sequelize.STRING
        },
        subdelivery_type: {
            type: Sequelize.STRING
        },
        supply_type: {
            type: Sequelize.STRING
        },
        remark: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });

    return transportRequest;
};
