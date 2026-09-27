'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("SALES_BOOKING","po_number",{
        type: Sequelize.STRING,        
      }
    );
    await queryInterface.addColumn("SALES_BOOKING","po_date",{
        type: Sequelize.DATEONLY,        
      }
    );
    
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
