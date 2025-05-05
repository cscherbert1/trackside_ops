import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Car extends Model {
  public id!: number;
  public layoutId!: number;
  public carType!: string;
  public color!: string;
  public number!: string;
  public length!: number;
  public railroad!: string;
  public notes: string | undefined;
  public returnLocationId!: number;
  public currentLocationId: number | undefined;
  public trackId: number | undefined;
  public waybillId: number | undefined;
  public imagePath: string | undefined;
}

Car.init(
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
      carType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      railroad: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      returnLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currentLocationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      waybillId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Car'
    }
  );

  export { Car };
