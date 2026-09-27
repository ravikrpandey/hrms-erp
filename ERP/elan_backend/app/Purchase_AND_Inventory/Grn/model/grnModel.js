module.exports = (sequelize, Sequelize) => {
    const grnMaster = sequelize.define("GRN_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        grn_number: {
            type: Sequelize.STRING
        },
        po_category_type: {
            type: Sequelize.STRING
        },
        invoiceNo: {
            type: Sequelize.STRING
        },

        invoiceDate: {
            type: Sequelize.DATEONLY
        },
        invoiceDoc: {
            type: Sequelize.STRING
        },
        grnStatus: {
            type: Sequelize.ENUM("PENDING", "COMPLETED"),
            defaultValue: "PENDING"
        },
        mltiple_data: {
            type: Sequelize.ENUM("yes", "no"),
            defaultValue: "no"
        },
        payment_status: {
            type: Sequelize.ENUM("UNPAID", "PAID", "PARTIALLY PAID"),
            defaultValue: "UNPAID"
        },
        addstock_status: {
            type: Sequelize.ENUM("true", "false",),
            defaultValue: "false"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        source_type: {
            type: Sequelize.ENUM("PURCHASE_GRN", "DIRECT_INVENTORY"),
            defaultValue: "PURCHASE_GRN"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        grn_date: {
            type: Sequelize.DATEONLY
        },
        total_amount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        grand_total: {
            type: Sequelize.DECIMAL(10, 2)
        },
        tds_amount: {
            type: Sequelize.DECIMAL(10, 2)
        }, 
        total_gst_amount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        total_charges_amount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        adjusted_advance_amount: {
            type: Sequelize.DECIMAL(10, 2)
        }, 
        net_payable_amount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        amount_after_tds: {
            type: Sequelize.DECIMAL(10, 2)
        },
        igst: {
            type: Sequelize.DECIMAL(10, 2)
        },
        cgst: {
            type: Sequelize.DECIMAL(10, 2)
        },
        sgst: {
            type: Sequelize.DECIMAL(10, 2)
        },
        advance_payment: {
            type: Sequelize.DECIMAL(10, 2)
        },
        document_type: {
            type: Sequelize.ENUM('Purchase_invoice'),
            defaultValue: 'Purchase_invoice'
        },
        upload_doc: {
            type: Sequelize.STRING
        },
        invoice_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED",),
            defaultValue: "PENDING"
        },
        discardStatus: {
            type: Sequelize.ENUM("OPEN", "CLOSED", "DISCARDED"),
            defaultValue: "OPEN"
        },
        version_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED",),
            defaultValue: "PENDING"
        },
        purchase_date: {
            type: Sequelize.DATEONLY
        },
        depriciation_by: {
            type: Sequelize.ENUM('put_to_use_date', 'purchase_date', 'by_value'),
        },
        vat: {
            type: Sequelize.DECIMAL(10, 2)
        },
        gst: {
            type: Sequelize.DECIMAL(10, 2)
        },
        depriciated_value: {
            type: Sequelize.DECIMAL(10, 2)
        },
        asset_for_pm: {
            type: Sequelize.BOOLEAN,
        },
        item_use_date: {
            type: Sequelize.DATEONLY
        },
        asset_type: {
            type: Sequelize.ENUM("tangible", "intangible"),
        },
        depreciation_rate: {
            type: Sequelize.DECIMAL(10, 2)
        },
        useful_life_days: {
            type: Sequelize.DECIMAL(10, 2)
        },
        frequency: {
            type: Sequelize.ENUM("Yearly", "Monthly", "Daily"),
        },
        use_full_life: {
            type: Sequelize.STRING,
        },
        accumulated_dep: {
            type: Sequelize.DECIMAL(10, 2)
        },
        accumulated_dep_manual: {
            type: Sequelize.DECIMAL(10, 2)
        },
        disposition_status: {
            type: Sequelize.ENUM('sell', 'writeOff')
        },
        goodInventoryStatus: {
            type: Sequelize.ENUM("DIRECT", "INDIRECT", "DIRECT_ASSET")
        },
    }, {
        freezeTableName: true
    });
    return grnMaster;
};