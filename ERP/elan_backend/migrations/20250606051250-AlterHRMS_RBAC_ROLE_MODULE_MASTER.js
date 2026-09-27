'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add the new column
    await queryInterface.addColumn('HRMS_RBAC_ROLE_MODULE_MASTER', 'mOrderBy', {
      type: Sequelize.INTEGER,
      allowNull: true, // initially allow null to populate it
    });

    // Step 2: Populate orderBy for existing rows
    const [results] = await queryInterface.sequelize.query(
      `SELECT role_module_master_id as id FROM HRMS_RBAC_ROLE_MODULE_MASTER ORDER BY role_module_master_id`
    );

    let order = 1;
    for (const row of results) {
      await queryInterface.sequelize.query(
        `UPDATE HRMS_RBAC_ROLE_MODULE_MASTER SET mOrderBy = ${order} WHERE role_module_master_id = ${row.id}`
      );
      order++;
    }

    // Step 3: Make the column NOT NULL (optional)
    await queryInterface.changeColumn('HRMS_RBAC_ROLE_MODULE_MASTER', 'mOrderBy', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('HRMS_RBAC_ROLE_MODULE_MASTER', 'mOrderBy');
  }
};
