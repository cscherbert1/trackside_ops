import express from 'express';
import {
    getTracksByLocation, 
    getTrackById,
    createTrack,
    updateTrack,
    deleteTrack
} from '../controllers/trackController';

const router = express.Router();

router.get('/getByLocation/:locationId', getTracksByLocation);
router.get('/:trackId', getTrackById);
router.post('/', createTrack);
router.put('/:id', updateTrack);
router.delete('/:id', deleteTrack);

export default router;