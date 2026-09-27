'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add column
    await queryInterface.addColumn('HRMS_RBAC_SUBMENU_MASTER', 'smOrderBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Step 2: Update sbOrderBy values with row number per group
    // Raw SQL used here
    await queryInterface.sequelize.query(`
      UPDATE HRMS_RBAC_SUBMENU_MASTER m
      JOIN (
        SELECT submenu_master_id as id, 
               ROW_NUMBER() OVER (PARTITION BY menu_master_id ORDER BY submenu_master_id) AS rn
        FROM HRMS_RBAC_SUBMENU_MASTER
      ) ranked
      ON m.submenu_master_id = ranked.id
      SET m.smOrderBy = ranked.rn
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('HRMS_RBAC_SUBMENU_MASTER', 'smOrderBy');
  }
};
