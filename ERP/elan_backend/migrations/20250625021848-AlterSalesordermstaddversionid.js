'use strict';
const db = require("../app/models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
     async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(db.salesOrder, 'version_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model:db.versionData , 
            key: 'id'
          },
          onDelete: 'RESTRICT'
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
