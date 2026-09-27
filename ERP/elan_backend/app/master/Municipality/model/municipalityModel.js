module.exports = (sequelize, Sequelize) => {
    const Master_Municipality = sequelize.define("MASTER_MUNICIPALITY", {
       id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name_of_municipality: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount:{

            type:Sequelize.INTEGER,
            allowNull:false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        start_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
            
        },
        end_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
          
        }
    },
    
    {
      freezeTableName: true,
    })
    ;
    return Master_Municipality;
};
