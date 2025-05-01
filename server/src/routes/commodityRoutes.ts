import { Router } from 'express';
import {
    getCommoditiesByLayout,
    getCommoditytById, 
    createCommodity,
    updateCommodity,
    deleteCommodity
} from '../controllers/commodityController';

const router = Router();

router.get('/getByLayout/:layoutId', getCommoditiesByLayout);
router.get('/:id', getCommoditytById);
router.post('/', createCommodity);
router.put('/:id', updateCommodity);
router.delete('/:id', deleteCommodity);

export default router;
