import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Waybill extends Model {
    public id!: number;
    public layoutId!: number;
    public carType!: string;
    public repeating!: boolean;
    public rareWaybill!: boolean;
    public currentSequence!: number;
}

Waybill.init(
    {
        id: {
            type: DataTypes.INTEGER, 
            autoIncrement: true,
            primaryKey: true
        }, 
        layoutId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        carType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        repeating: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }, 
        rareWaybill: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        currentSequence: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        }
    }, 
    {
        sequelize,
        modelName: 'Waybill'
    }
);

export { Waybill }