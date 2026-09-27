module.exports = (sequelize, Sequelize) => {
    const inventory_ledger = sequelize.define("INVENTORY_LEDGER", {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        quantity: {                        
            type: Sequelize.INTEGER.UNSIGNED, // Always positive
            allowNull: false
        },
        type: {                       
            type: Sequelize.ENUM(
                "IN",              // Purchase / GRN → available +
                "OUT",             // Delivery → delivered_qty +, available -
                "HOLD",            // SO Reserve → hold +, available -
                "RELEASE",         // SO Cancel → hold -, available +
                "SCRAP",           // Damage → scrap +, available -
                "TRANSFER_IN",     // Warehouse Receive → available +
                "TRANSFER_OUT",    // Warehouse Send → available -
                "RETURN_IN",       // Customer Return → available +
                "RETURN_OUT",      // Purchase Return → available -
                "ADJUSTMENT_IN",   // Manual stock +, available +
                "ADJUSTMENT_OUT"   // Manual stock -, available -
            ),
            allowNull: false,
            comment: "Stock movement types: IN=Purchase, OUT=Delivery, HOLD=SO Reserve, RELEASE=SO Cancel, SCRAP=Damage, TRANSFER_IN/OUT=Warehouse transfer, RETURN_IN/OUT=Customer/vendor return, ADJUSTMENT_IN/OUT=Manual adjustment"
        },
        reference_table: {            
            type: Sequelize.ENUM(
                "GRN",             // Purchase / stock receive
                "SO",              // Sales Order → hold, release, delivered
                "PURCHASE_RETURN", // Return to vendor
                "SALES_RETURN",    // Customer return
                "STOCK_TRANSFER",  // Warehouse transfer
                "MANUAL",          // Manual adjustment
                "SCRAP"            // Scrap / damaged stock
            ),
            allowNull: false,
            comment: "Reference table for stock movements: GRN=Purchase/stock receive, SO=Sales Order, PURCHASE_RETURN=Return to vendor, SALES_RETURN=Customer return, STOCK_TRANSFER=Warehouse transfer, MANUAL=Manual adjustment, SCRAP=Damaged stock"
        },
        reference_table_id: {               
            type: Sequelize.BIGINT
        },
        remark: {                     
            type: Sequelize.STRING
        }

    }, {
        freezeTableName: true
    });

    return inventory_ledger;
};
