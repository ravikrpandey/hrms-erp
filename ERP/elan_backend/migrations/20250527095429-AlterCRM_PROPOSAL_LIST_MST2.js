'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'CRM_PROPOSAL_LIST_MST';

    
    

    await queryInterface.addColumn(tableName, 'promo_item', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn(tableName, 'new_item', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn(tableName, 'scheme_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
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
