module.exports = (sequelize, Sequelize) => {
    const purchase_order_approval = sequelize.define("PROCUREMENT_PURCHASE_ORDER_APPROVAL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.STRING
        },
        approvel_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING","REJECTED","PUSH BACK"),
            defaultValue: "PENDING"
        },
        shipping_status: {
            type: Sequelize.ENUM("Packed", "PENDING","Shipped","Delivered","On Hold","in-transit"),
            defaultValue: "PENDING"
        }, 
        progressStatus: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        final_quantity : {
            type: Sequelize.STRING
        },
        expected_ship_date : {
            type: Sequelize.DATEONLY
        },
        final_MVP : {
            type: Sequelize.STRING
        },
        workflow_type : {
            type: Sequelize.STRING
        },
        remark : {
            type: Sequelize.TEXT
        }
    },
        {
            freezeTableName: true
        });
    return purchase_order_approval
}