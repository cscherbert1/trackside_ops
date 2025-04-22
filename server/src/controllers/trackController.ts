import { Request, Response } from 'express';
import { models } from '../models';
import { TrackSchema } from '../schemas/track.schema';

const Track = models.Track;

export const getTracksByLocation = async (req: Request, res: Response): Promise<void> => {
    const { locationId } = req.params;
    const tracks = await Track.findAll({where: { locationId }});
    res.json(tracks);
};

export const getTrackById = async (req: Request, res: Response): Promise<void> => {
    const { trackId } = req.params;
    const track = await Track.findByPk(trackId);

    if (!track) {
        throw new Error('Track not found');
    }

    res.json(track);
};

export const createTrack = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedTrack = TrackSchema.parse(req.body);
        const track = await Track.create(validatedTrack);
        res.status(201).json(track);
    } catch (error) {
        throw new Error (error instanceof Error ? error.message : 'Cannot create track. Invalid data.');
    }
};

export const updateTrack = async (req: Request, res: Response): Promise<void> => {
    try {
        const trackId = req.params.id;
        const validatedData = TrackSchema.partial().parse(req.body);

        const track = await Track.findByPk(trackId);
        if (!track) {
            throw new Error ('Cannot update track. Track not found');
        }

        await track.update(validatedData);
        res.json(track);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Cannot update track. Invalid update data.');
    }
};

export const deleteTrack = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await Track.destroy({where: { id }});
    res.status(204).send();
}