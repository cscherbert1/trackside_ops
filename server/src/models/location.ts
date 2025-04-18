import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  layoutId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isSwitching: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isClassification: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isStaging: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export { Location };
