import { Router } from 'express';
import {
  getAllLayouts,
  getLayoutById,
  createLayout,
  updateLayout,
  deleteLayout
} from '../controllers/layoutController';

const router = Router();

router.get('/', getAllLayouts);
router.get('/:id', getLayoutById);
router.post('/', createLayout);
router.put('/:id', updateLayout);
router.delete('/:id', deleteLayout);

export default router;
