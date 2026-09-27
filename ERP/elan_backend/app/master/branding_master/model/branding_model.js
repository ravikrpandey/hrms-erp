module.exports = (sequelize, Sequelize) => {
  const branding_master = sequelize.define("MASTER_BRANDING", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type_of_branding: {
      type: Sequelize.STRING,
      allowNull: false
    },
    branding_sides: {
      type: Sequelize.STRING,  
      allowNull: false
    },
    price_per_unit: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    image: {
      type: Sequelize.TEXT,   
      allowNull: true
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

  return branding_master;
};
