module.exports = (sequelize, Sequelize) => {
    const ItemMaster = sequelize.define("MASTER_ITEM", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        item_name: {
            type: Sequelize.STRING
        },
        item_code: {
            type: Sequelize.STRING
        },
        manage_by: {
            type: Sequelize.ENUM("Batch Only", "S.No. Only"),
            defaultValue: "Batch Only"
        },
        Variant: {
            type: Sequelize.STRING
        },
        MVP: {
            type: Sequelize.DECIMAL(20, 2)
        },
        MRP: {
            type: Sequelize.DECIMAL(20, 2)
        },
        description: {
            type: Sequelize.STRING
        },
        Item_length_before: {
            type: Sequelize.DECIMAL(10, 2)
        },
        Item_width_before: {
            type: Sequelize.DECIMAL(10, 2)
        },
        Item_height_before: {
            type: Sequelize.DECIMAL(10, 2)
        },
        external_length_after: {
            type: Sequelize.DECIMAL(10, 2)
        },
        external_width_after: {
            type: Sequelize.DECIMAL(10, 2)
        },
        external_height_after: {
            type: Sequelize.DECIMAL(10, 2)
        },
        external_volume_after: {
            type: Sequelize.DECIMAL(10, 2)
        },
        item_weight: {
            type: Sequelize.DECIMAL(10, 2)
        },
        warranty_applicable: {
            type: Sequelize.ENUM("Yes", "No"),
        },
        warranty_period: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        removal_qty: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        fitment_qty: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        // item_group_id: {
        //     type: Sequelize.INTEGER,
        // },
        // Bar_QR_Code: {
        //     type: Sequelize.ENUM("Yes", "No"),
        // },
        // minimum_level: {
        //     type: Sequelize.INTEGER
        // },
        // maximum_level: {
        //     type: Sequelize.INTEGER
        // },
        // cgst: {
        //     type: Sequelize.DECIMAL(20, 2),
        //     defaultValue: 0
        // },
        // sgst: {
        //     type: Sequelize.DECIMAL(20, 2),
        //     defaultValue: 0
        // },
        // igst: {
        //     type: Sequelize.DECIMAL(20, 2),
        //     defaultValue: 0
        // },
        // usage_details: {
        //     type: Sequelize.JSON
        // },
        // Item_Print_Name: {
        //     type: Sequelize.STRING
        // },
        // Color: {
        //     type: Sequelize.JSON
        // },
        // Elanpro_Item_Code: {
        //     type: Sequelize.STRING
        // },
        // Factory_Item_Code: {
        //     type: Sequelize.STRING
        // },
        // Item_volume_before: {
        //     type: Sequelize.INTEGER
        // },
        // volumetric_weight_air_domestic: {
        //     type: Sequelize.INTEGER
        // },
        // volumetric_weight_air_international: {
        //     type: Sequelize.INTEGER
        // },
        // volumetric_weight_by_sea: {
        //     type: Sequelize.INTEGER
        // },
        // volumetric_weight_by_road: {
        //     type: Sequelize.INTEGER
        // },
        // volumetric_space: {
        //     type: Sequelize.INTEGER
        // },
        // default_lead_time_for_sales: {
        //     type: Sequelize.INTEGER
        // },
        // default_lead_time_for_purchase: {
        //     type: Sequelize.INTEGER
        // },
        // auto_requisition_on_level: {
        //     type: Sequelize.ENUM("Yes", "No"),
        // },
        // maximum_discount: {
        //     type: Sequelize.FLOAT
        // },
    },
        {
            freezeTableName: true,
        })
    return ItemMaster;
}