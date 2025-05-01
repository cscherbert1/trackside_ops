import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Commodity extends Model {
  public id!: number;
  public layoutId!: number;
  public name!: string;
}

Commodity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    layoutId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Commodity',
  }
);

export { Commodity };
