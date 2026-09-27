const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const salesBookingAdvanceAmt = sequelize.define(
        "SALES_BOOKING_ADVANCE_AMOUNT",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            transaction_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            grandTotalAmt2: {
                type: Sequelize.DECIMAL(20, 2),
                allowNull: true
            }, 
            amount: {
                type: Sequelize.DECIMAL(20, 2),
                allowNull: true
            },
            remarks: {
                type: Sequelize.STRING
            }, 
            payment_mode: {
                type: Sequelize.STRING
            },
            cheque_no: {
                type: Sequelize.STRING
            }, 
            bank_account_id: {
                type: Sequelize.INTEGER
            },
            customer_id: {
                type: Sequelize.INTEGER
            },
            chart_account_id: {
                type: Sequelize.INTEGER
            }, 
            sales_booking_id: {
                type: Sequelize.INTEGER
            },
            currency_id: {
                type: Sequelize.INTEGER
            },
            suspense_account_id: {
                type: Sequelize.INTEGER
            },
            advance_adjustment_percentage: {
                type: Sequelize.DECIMAL(20,2)
            },
            currency_rate:{
                type: Sequelize.DECIMAL(20,5)
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
           
        },

        {
            freezeTableName: true,
        }

    );
    salesBookingAdvanceAmt.associate = (db) => {
        transportVoucher.belongsTo(db.customerProfile, {
          foreignKey: "customer_id",
          onDelete: "RESTRICT",
        });
    
        salesBookingAdvanceAmt.belongsTo(db.createBankAccount, {
          foreignKey: "bank_account_id",
          onDelete: "RESTRICT",
        });
        salesBookingAdvanceAmt.belongsTo(db.createChartOfAccounts, {
          foreignKey: "chart_account_id",
          onDelete: "RESTRICT",
        });
         salesBookingAdvanceAmt.belongsTo(db.suspenseAccountCustomer, {
          foreignKey: "suspense_account_id",
          onDelete: "RESTRICT",
        });
         salesBookingAdvanceAmt.belongsTo(db.salesBooking, {
          foreignKey: "sales_booking_id",
          onDelete: "RESTRICT",
        }); 
        salesBookingAdvanceAmt.belongsTo(db.currency_convert, {
          foreignKey: "currency_id",
          onDelete: "RESTRICT",
        });
        
       
      };

    return salesBookingAdvanceAmt;
};