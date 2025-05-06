import { Router } from 'express';
import { 
    getWaybillsByLayoutId, 
    getWaybillById, 
    createWaybillWithInstructions,
    updateWaybillWithInstructions,
    deleteWaybill,
    turnWaybill,
    getActiveInstructionForWaybill
 } from '../controllers/waybillController';

 const router = Router();
 
 router.get('/getByLayout/:layoutId', getWaybillsByLayoutId);
 router.get('/:id', getWaybillById);
 router.post('/', createWaybillWithInstructions);
 router.put('/:id', updateWaybillWithInstructions);
 router.delete('/:id', deleteWaybill);
 router.get('/turnWaybill/:id', turnWaybill);
 router.get('/getActiveInstruction/:id', getActiveInstructionForWaybill);
 
 export default router;