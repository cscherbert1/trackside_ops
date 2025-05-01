import { Request, Response } from 'express';
import { models } from '../models/index';
import { CommoditySchema } from '../schemas/commodity.schema';

const Commodity = models.Commodity;

export const getCommoditiesByLayout = async (req: Request, res: Response): Promise<void> => {
  const { layoutId } = req.params;
  const commodities = await Commodity.findAll({ where: { layoutId } });
  res.json(commodities);
};

export const getCommoditytById = async (req: Request, res: Response): Promise<void> => {
  const commodity = await Commodity.findByPk(req.params.id);
  if (!commodity) {
    throw new Error('Commodity not found');
  }
  res.json(commodity);
};

export const createCommodity = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedCommodity = CommoditySchema.parse(req.body);
    const commodity = await Commodity.create(validatedCommodity);
    res.status(201).json(commodity);
  } catch (error) {
    // Throwing the error instead of manually handling it here
    throw new Error(error instanceof Error ? error.message : 'Cannot create commodity. Invalid data.');
  }
};

export const updateCommodity = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate only the fields present (partial updates allowed)
    const validatedData = CommoditySchema.partial().parse(req.body);

    const commodity = await Commodity.findByPk(req.params.id);
    if (!commodity) {
      throw new Error('Commodity not found');
    }

    await commodity.update(validatedData);
    res.json(commodity);
  } catch (error) {
    // Throwing the error instead of manually handling it here
    throw new Error(error instanceof Error ? error.message : 'Cannot update commodity. Invalid update data.');
  }
};

export const deleteCommodity = async (req: Request, res: Response): Promise<void> => {
  const commodity = await Commodity.findByPk(req.params.id);
  if (!commodity) {
    throw new Error('Commodity not found');
  }
  await commodity.destroy();
  res.status(204).send();
};
