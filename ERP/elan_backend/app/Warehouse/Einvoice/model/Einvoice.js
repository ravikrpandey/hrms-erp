module.exports = (sequelize, Sequelize) => {
    const generateIrn = sequelize.define(
      "GENERATE_IRN",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        Irn:{
          type:Sequelize.TEXT
        },
        einvoice_company_id:{
          type:Sequelize.TEXT
        },
        einvoice_id:{
          type:Sequelize.TEXT
        },
        import_method:{
          type:Sequelize.ENUM('INV'),
          defaultValue:'INV'
        },
        type:{
          type:Sequelize.ENUM('INV'),
          defaultValue:'INV'
        },
        customer_id:{
            type:Sequelize.INTEGER
        },
        vehicle_planing_id:{
            type:Sequelize.INTEGER
        },
        ewb_id:{
            type:Sequelize.STRING
        }
      },
      {
        freezeTableName: true,
        timestamps: true, 
      }
    );
    generateIrn.associate = (db) => {
        generateIrn.belongsTo(db.customerProfile, {
          foreignKey: "customer_id",
          onDelete: "RESTRICT",
        })
         generateIrn.belongsTo(db.vehiclePlanningMst, {
          foreignKey: "vehicle_planing_id",
          onDelete: "RESTRICT",
        })
      };

    return generateIrn;
  };