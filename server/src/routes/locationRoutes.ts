import express from 'express';
import {
  getLocationsByLayout,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController';

const router = express.Router();

router.get('/getByLayout/:layoutId', getLocationsByLayout);
router.get('/:locationId', getLocationById)
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export default router;
