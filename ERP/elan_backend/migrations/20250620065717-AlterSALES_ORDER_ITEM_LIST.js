'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("SALES_ORDER_ITEM_LIST", "pincode", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("SALES_ORDER_ITEM_LIST", "postal_address", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("SALES_ORDER_ITEM_LIST", "pincode");
    await queryInterface.removeColumn("SALES_ORDER_ITEM_LIST", "postal_address");
  }
};
