'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'SALES_ORDER_MST';
    
    await queryInterface.addColumn(tableName, 'expected_delivery_date', {
     
      type: Sequelize.DATEONLY,
      allowNull: true
   });
    await queryInterface.addColumn(tableName, 'expected_dispatch_date', {
    
      type: Sequelize.DATEONLY,
      allowNull: true
   });
    await queryInterface.addColumn(tableName, 'pod_remark', {
      type: Sequelize.STRING
   });
    await queryInterface.addColumn(tableName, 'invoice_no', {
      type: Sequelize.STRING
   });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
