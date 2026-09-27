'use strict';
const db = require("../app/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    // first format
    // const result = global.extractModelFields(db.EnterModelName);
    // await queryInterface.createTable(result.modelName, result.fields);

    // second format
    // await queryInterface.createTable('CRM_PROPOSAL_BRANDING_SCHEME', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   qty: {
    //     type: Sequelize.INTEGER,
    //     defaultValue: 1,
    //   },
    //   branding_description: {
    //     type: Sequelize.STRING(255),
    //     allowNull: true,
    //   },
    //   branding_sides: {
    //     type: Sequelize.JSON,
    //     allowNull: true,
    //   },
    //   proposal_no: {
    //     type: Sequelize.TEXT,
    //     allowNull: true,
    //   },
    //   status: {
    //     type: Sequelize.TINYINT,
    //     defaultValue: 1,
    //   },
    //   createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    //   proposal_item_id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //   },
    //   customer_item_id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //   },
    // });
 
    // Let Sequelize generate FK constraint name automatically
    // await queryInterface.addConstraint('CRM_PROPOSAL_BRANDING_SCHEME', {
    //   fields: ['proposal_item_id'],
    //   type: 'foreign key',
    //   name: 'fk_proposal_item_id',
    //   references: {
    //     table: 'CRM_CREATE_LEAD_MASTER_DETAILS',
    //     field: 'id',
    //   },
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'CASCADE',
    // });
 
    // await queryInterface.addConstraint('CRM_PROPOSAL_BRANDING_SCHEME', {
    //   fields: ['customer_item_id'],
    //   type: 'foreign key',
    //   name: 'fk_customer_item_id',
    //   references: {
    //     table: 'CUSTOMER_ITEM_LIST',
    //     field: 'id',
    //   },
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'CASCADE',
    // });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CRM_PROPOSAL_BRANDING_SCHEME');
  }
};
