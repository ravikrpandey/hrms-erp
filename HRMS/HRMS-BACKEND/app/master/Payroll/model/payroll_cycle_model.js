module.exports = (sequelize, DataTypes) => {
    const PayrollCycle = sequelize.define('MASTER_PAYROLL_CYCLE', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    
      entity_name: {
        type: DataTypes.STRING,
      },
      start_date: {
        type: DataTypes.INTEGER,
      },
      end_date: {
        type: DataTypes.INTEGER,
      },
       
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      entity_type: {
        type: DataTypes.INTEGER,
      },
      financial_year: {
        type: DataTypes.INTEGER,
      },
      created_by: {
        type: DataTypes.INTEGER
      }
    }, {
      tableName: 'MASTER_PAYROLL_CYCLE',
      timestamps: true,
    });
  
    return PayrollCycle;
  };
  