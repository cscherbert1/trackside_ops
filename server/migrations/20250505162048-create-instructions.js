'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Instructions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      waybillId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Waybills',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      commodityId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      trackId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      specialInstructions: {
        type: Sequelize.STRING(64),
        allowNull: true
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Instructions');
  }
};
