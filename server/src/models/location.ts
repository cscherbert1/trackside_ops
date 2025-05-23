import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Location extends Model {
  public id!: number;
  public layoutId!: number;
  public name!: string;
  public isSwitching!: boolean;
  public isClassification!: boolean;
  public isStaging!: boolean;
}

Location.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Location',
  }
);

export { Location };
