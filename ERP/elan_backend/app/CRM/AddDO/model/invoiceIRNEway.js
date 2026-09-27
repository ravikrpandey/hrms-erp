const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const ewayData = sequelize.define(
        "CRM_IRN_EWAY_DATA_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            irnNo: {
                type: Sequelize.STRING
            },
            distance: {
                type: Sequelize.STRING,
            },
            transportMode: {
                type: Sequelize.ENUM('ROAD', 'RAIL','AIR','SHIP'),
            },
            transportName: {
                type: Sequelize.STRING,
            },
            transportDate: {
                type: Sequelize.STRING,
            },
            transportBiltyNo: {
                type: Sequelize.STRING,
            },
            vehicleNo: {
                type: Sequelize.STRING,
            },
            vehicleType: {
                type: Sequelize.ENUM('ODC', 'REGULAR'),
            },
            EwbNo: {
                type: Sequelize.STRING,
            },
            EwbDt: {
                type: Sequelize.STRING,
            },
            dispatch_from_gstin: {
                type: Sequelize.STRING,
            },
            ship_to_gstin: {
                type: Sequelize.STRING,
            },
            EwbValidTill: {
                type: Sequelize.STRING,
            },
            rec_address: {
                type: Sequelize.STRING,
            },
            rec_pincode: {
                type: Sequelize.STRING,
            },
            sup_address: {
                type: Sequelize.STRING,
            },
            sup_pincode: {
                type: Sequelize.STRING,
            },
            dispatch_from_trade_name: {
                type: Sequelize.STRING,
            },
            dispatch_to_trade_name: {
                type: Sequelize.STRING,
            },
            AssVal: {
                type: Sequelize.STRING,
            },
            SgstVal: {
                type: Sequelize.STRING,
            },
            CgstVal: {
                type: Sequelize.STRING,
            },
            IgstVal: {
                type: Sequelize.STRING,
            },
            CesVal: {
                type: Sequelize.STRING,
            },
            OthChrg: {
                type: Sequelize.STRING,
            },
            TotInvVal: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
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
    return ewayData;
};