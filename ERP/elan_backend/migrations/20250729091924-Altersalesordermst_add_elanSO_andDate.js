'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("SALES_ORDER_MST", "elan_sales_order_no", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("SALES_ORDER_MST", "elan_so_date", {
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
