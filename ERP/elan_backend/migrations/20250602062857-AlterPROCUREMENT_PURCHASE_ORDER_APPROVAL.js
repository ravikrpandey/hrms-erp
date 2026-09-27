'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'PROCUREMENT_PURCHASE_ORDER_APPROVAL';
    await queryInterface.addColumn(tableName, 'shipping_status', {
      type: Sequelize.ENUM("Packed", "PENDING", "Shipped", "Delivered", "On Hold", "in-transit"),
      defaultValue: "PENDING",
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.addColumn(tableName, 'expected_ship_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: null
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
