import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Layout extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
}

Layout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Layout',
  }
);

export { Layout };
