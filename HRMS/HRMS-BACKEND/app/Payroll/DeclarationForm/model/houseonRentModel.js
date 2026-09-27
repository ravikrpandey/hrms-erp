module.exports = (sequelize, Sequelize) => {
    const HouseOnRent = sequelize.define("HOUSE_ON_RENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fromDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        toDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        monthlyRate: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        annualRate: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        addressType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        document: {
            type: Sequelize.STRING,
            allowNull: false
        },
        houseNo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        street: {
            type: Sequelize.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pincode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hasPan: {
            type: Sequelize.ENUM("yes", "no"),
            defaultValue: "no"
        },
        landlordName: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        landlordAddress: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        landlordHouseNo: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        landlordStreet: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        landlordCity: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        panNumber: {
            type: Sequelize.STRING,
            defaultValue: null
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

    return HouseOnRent;
};
