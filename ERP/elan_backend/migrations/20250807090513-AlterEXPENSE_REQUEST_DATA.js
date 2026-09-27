'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("EXPENSE_REQUEST_DATA", "travel_range", {
      type: Sequelize.DECIMAL(12, 2)
    });
    await queryInterface.addColumn(
      "EXPENSE_REQUEST_DATA",
      "conveyance_type_id",
      {
        type: Sequelize.INTEGER,
        references: {
          model: "MASTER_TRAVEL_TYPE",
          key: "id",
        },
      }
    );
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
