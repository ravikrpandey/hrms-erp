module.exports = (sequelize, Sequelize) => {
    const vehiclePlanningTransporter = sequelize.define(
      "WH_VH_PLANNING_TRANSPORTER",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        remark: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        transporter_status: {
          type: Sequelize.ENUM("PENDING", "ACCEPTED", "REJECTED"),
          defaultValue: "PENDING",
        },
        transporter_status_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        admin_status: {
          type: Sequelize.ENUM("PENDING", "ACCEPTED", "HOLD", "CANCELED"),
          defaultValue: "PENDING",
        },
        admin_status_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        trip_status: {
          type: Sequelize.ENUM("PENDING", "READY_FOR_PICKUP", "AT_WAREHOUSE", "DISPATCHED", "OUT_FOR_DELIVERY", "DELIVERED"),
          defaultValue: "PENDING",
        },
        out_for_delivery_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        delivery_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        pod_status: {
          type: Sequelize.ENUM("PENDING", "PARTIAL", "COMPLETED"),
          defaultValue: "PENDING",
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        freezeTableName: true,
        timestamps: true, 
      }
    );
  
    return vehiclePlanningTransporter;
  };
  