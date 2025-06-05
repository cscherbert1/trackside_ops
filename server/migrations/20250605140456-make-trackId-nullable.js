'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Instructions', 'trackId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Tracks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Instructions', 'trackId', {
      type: Sequelize.INTEGER,
      allowNull: false, // Revert to NOT NULL if rolling back
      references: {
        model: 'Tracks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  }
};
