module.exports = (sequelize, Sequelize) => {
  const AssetHistory = sequelize.define('GRN_ASSET_TRANSFER_HISTORY', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true
    },
    assign_status: {
      type: Sequelize.ENUM("ALLOCATED", "DEALLOCATED"),
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    isDeleted: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "0"
    },
  }, {
    freezeTableName: true
  });

  const AssetHistoryLog = sequelize.define('GRN_ASSET_TRANSFER_HISTORY_LOG', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true
    },
    assign_status: {
      type: Sequelize.ENUM("ALLOCATED", "DEALLOCATED"),
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    isDeleted: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "0"
    },
    action: {
      type: Sequelize.STRING,
      allowNull: true
    },
  }, {
    freezeTableName: true
  });

  // Hook: Log to history_log after create
  AssetHistory.addHook('afterCreate', async (record, options) => {
    await AssetHistoryLog.create({
      remarks: record.remarks,
      status: record.status,
      isDeleted: record.isDeleted,
      assign_status: record.assign_status,
      action: 'create',
      grn_id: record.grn_id,
      grn_item_status_id: record.grn_item_status_id,
      branch_id: record.branch_id,
      department_id: record.department_id,
      employee_id: record.employee_id,
      assign_by: record.assign_by,
      assigned_from: record.assigned_from
    }, { transaction: options.transaction || null });
  });

  // Return both models
  return {
    AssetHistory,
    AssetHistoryLog
  };
};
