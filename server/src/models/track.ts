import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Track extends Model {
  public id!: number;
  public locationId!: number;
  public name!: string;
  public trackLength!: number;
  public isOffSpotAvailable!: boolean;
}

Track.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isOffSpotAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Track',
  }
);

export { Track };
