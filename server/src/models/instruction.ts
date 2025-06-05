import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Instruction extends Model {
  public id!: number;
  public waybillId!: number;
  public commodityId!: number;
  public locationId!: number;
  public trackId!: number;
  public tat!: string;
  public specialInstructions!: string;
  public sequence!: number;
}

Instruction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    waybillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commodityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trackId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tracks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    tat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialInstructions: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Instruction',
  }
);

export { Instruction };
