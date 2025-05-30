import { Router } from 'express';
import { 
    getWaybillsByLayoutId, 
    getWaybillById, 
    createWaybillWithInstructions,
    updateWaybillWithInstructions,
    deleteWaybill,
    turnWaybill,
    getActiveInstructionForWaybill,
    getWaybillsByCarType,
    getWaybillsByInstructionCommodity,
    getWaybillsByInstructionLocation
} from '../controllers/waybillController';

const router = Router();
 
router.get('/getByLayout/:layoutId', getWaybillsByLayoutId);
router.get('/:id', getWaybillById);
router.post('/', createWaybillWithInstructions);
router.put('/:id', updateWaybillWithInstructions);
router.delete('/:id', deleteWaybill);
router.get('/turnWaybill/:id', turnWaybill);
router.get('/getActiveInstruction/:id', getActiveInstructionForWaybill);
router.get('/getByCarType/:layoutId/:carType', getWaybillsByCarType);
router.get('/getByInstructionCommodity/:layoutId/:commodityId', getWaybillsByInstructionCommodity);
router.get('/getByInstructionLocation/:layoutId/:locationId', getWaybillsByInstructionLocation);

export default router;