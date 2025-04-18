import { Request, Response } from 'express';
import { Layout } from '../models';
import { LayoutSchema } from '../schemas/layout.schema';

export const getAllLayouts = async (req: Request, res: Response): Promise<void> => {
  const layouts = await Layout.findAll();
  res.json(layouts);
};

export const getLayoutById = async (req: Request, res: Response): Promise<void> => {
  const layout = await Layout.findByPk(req.params.id);
  if (!layout) {
    throw new Error('Layout not found');
  }
  res.json(layout);
};

export const createLayout = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedLayout = LayoutSchema.parse(req.body);
    const layout = await Layout.create(validatedLayout);
    res.status(201).json(layout);
  } catch (error) {
    // Throwing the error instead of manually handling it here
    throw new Error(error instanceof Error ? error.message : 'Cannot create layout. Invalid data.');
  }
};

export const updateLayout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate only the fields present (partial updates allowed)
    const validatedData = LayoutSchema.partial().parse(req.body);

    const layout = await Layout.findByPk(req.params.id);
    if (!layout) {
      throw new Error('Layout not found');
    }

    await layout.update(validatedData);
    res.json(layout);
  } catch (error) {
    // Throwing the error instead of manually handling it here
    throw new Error(error instanceof Error ? error.message : 'Cannot update layout. Invalid update data.');
  }
};

export const deleteLayout = async (req: Request, res: Response): Promise<void> => {
  const layout = await Layout.findByPk(req.params.id);
  if (!layout) {
    throw new Error('Layout not found');
  }
  await layout.destroy();
  res.status(204).send();
};
