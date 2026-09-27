module.exports = (sequelize, Sequelize) => {
  const transportChargeMst = sequelize.define("MASTER_TRANSPORT_CHARGE",{
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      charge_name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('ACTIVE','INACTIVE'),
        defaultValue: 'ACTIVE',
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },

    {
      freezeTableName: true,
    }
  );
  return transportChargeMst;
};
