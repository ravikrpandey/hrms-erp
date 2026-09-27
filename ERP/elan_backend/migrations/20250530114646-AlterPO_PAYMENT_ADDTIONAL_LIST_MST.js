'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'PO_PAYMENT_ADDTIONAL_LIST_MST'; 
    

    await queryInterface.addColumn(tableName, 'vendor_id', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
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
