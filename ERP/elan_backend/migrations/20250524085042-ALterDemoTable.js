'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'CRM_PROPOSAL_LIST_MST';

    // first format
    // await queryInterface.addColumn(tableName, 'select_scheme', {
    //   type: Sequelize.JSON,
    //   allowNull: true,
    //   defaultValue: null
    // });

    // await queryInterface.addColumn(tableName, 'apply_scheme', {
    //   type: Sequelize.TINYINT,
    //   allowNull: false,
    //   defaultValue: 0
    // });

    // await queryInterface.addColumn(tableName, 'promo_item', {
    //   type: Sequelize.TINYINT,
    //   allowNull: false,
    //   defaultValue: 0
    // });

    // await queryInterface.addColumn(tableName, 'new_item', {
    //   type: Sequelize.TINYINT,
    //   allowNull: false,
    //   defaultValue: 0
    // });

    // await queryInterface.addColumn(tableName, 'scheme_id', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   defaultValue: null
    // });

    // second format
    const newColumns = {
      select_scheme: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      },
      apply_scheme: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      promo_item: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      new_item: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      scheme_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    };
 
    // for alter table code
    // for (const [columnName, columnDefinition] of Object.entries(newColumns)) {
    //   await queryInterface.addColumn(tableName, columnName, columnDefinition);
    // }

  },

  async down (queryInterface, Sequelize) {
    const tableName = 'CRM_PROPOSAL_LIST_MST';
    // first format
    // await queryInterface.removeColumn(tableName, 'select_scheme');
    // await queryInterface.removeColumn(tableName, 'apply_scheme');
    // await queryInterface.removeColumn(tableName, 'promo_item');
    // await queryInterface.removeColumn(tableName, 'new_item');
    // await queryInterface.removeColumn(tableName, 'scheme_id');

    // second format
    const columnNames = [
      'select_scheme',
      'apply_scheme',
      'promo_item',
      'new_item',
      'scheme_id',
      'gyan_test',
    ];
 
    // for (const columnName of columnNames) {
    //   await queryInterface.removeColumn(tableName, columnName);
    // }
  }
};
