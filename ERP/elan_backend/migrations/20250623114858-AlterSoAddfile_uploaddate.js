'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'SALES_ORDER_MST';
    await queryInterface.addColumn(tableName, 'dispatch_status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
   });
    await queryInterface.addColumn(tableName, 'file', {
      type: Sequelize.STRING
   });
    await queryInterface.addColumn(tableName, 'upload_doc_date', {
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
