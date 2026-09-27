module.exports = (sequelize, Sequelize) => {
  const fund_transfer = sequelize.define('Fund_Transfer', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount_for_request: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    expense_type: {
        type: Sequelize.ENUM('cap-ex', 'op-ex'),
        defaultValue: null,
        allowNull: true,
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: true
    },
    remark: {
      type: Sequelize.STRING,
      allowNull: true
    },
    request_date: {
        type: Sequelize.DATEONLY, 
          allowNull: true
    },
    require_by: {
        type: Sequelize.DATEONLY, 
          allowNull: true
    },
    uploade_file:{
        type: Sequelize.STRING,
    },
    fund_request_no: {
      type: Sequelize.STRING,
      allowNull: true
    },
    final_status: {
      type: Sequelize.ENUM('APPROVED', 'REJECTED','PENDING',),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    status: {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
  },
    isDeleted: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "0",
    },
    },
    {
      freezeTableName: true,
    }
  );
  return fund_transfer;
};