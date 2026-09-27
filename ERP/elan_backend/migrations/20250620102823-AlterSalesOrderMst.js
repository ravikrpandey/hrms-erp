'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'SALES_ORDER_MST';
    await queryInterface.addColumn(tableName, 'customisation_branding_date', {
      type: Sequelize.DATEONLY,
      allowNull: true
   });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    const tableName = 'SALES_ORDER_MST';
    await queryInterface.removeColumn(tableName, 'customisation_branding_date');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
