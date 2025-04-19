import { Request, Response } from 'express';
import { models } from '../models';
import { LocationSchema } from '../schemas/location.schema';

const Location = models.Location;

export const getLocationsByLayout = async (req: Request, res: Response): Promise<void> => {
  const { layoutId } = req.params;
  const locations = await Location.findAll({ where: { layoutId } });
  res.json(locations);
};

export const getLocationById = async (req: Request, res: Response): Promise<void> => {
    const { locationId } = req.params;
    const location = await Location.findByPk(locationId);
  
    if (!location) {
        throw new Error('Location not found')
    }
  
    res.json(location);
  };
  

export const createLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedLocation = LocationSchema.parse(req.body);
        const location = await Location.create(validatedLocation);
        res.status(201).json(location);
    } catch (error) {
        throw new Error (error instanceof Error ? error.message : 'Cannot create location. Invalid data.');
    }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const locationId = req.params.id;
        const validatedData = LocationSchema.partial().parse(req.body);

        const location = await Location.findByPk(locationId);
        if (!Location) {
            throw new Error('Cannot update location. Location not found.');
        }

        await location.update(validatedData);
        res.json(location);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Cannot update location. Invalid update data.')
    }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await Location.destroy({ where: { id } });
  res.status(204).send();
};
