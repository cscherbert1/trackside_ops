import { Request, Response } from 'express';
import { models } from '../models/index';
import { WaybillSchema } from '../schemas/waybill.schema';
import { InstructionInput } from '../schemas/instruction.schema';

const Waybill = models.Waybill;
const Instruction = models.Instruction;

export const getWaybillsByLayoutId = async (req: Request, res: Response): Promise<void> => {
  const { layoutId } = req.params;

  try {
    const waybills = await Waybill.findAll({ 
      where: { layoutId },
      include: Instruction 
    });
    res.json(waybills);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch waybills by layoutId');
  }
};

export const getWaybillById = async (req: Request, res: Response): Promise<void> => {
  const waybill = await Waybill.findByPk(req.params.id, { include: Instruction });
  if (!waybill){
    throw new Error('Waybill not found');
  } 
  res.json(waybill);
};

export const createWaybillWithInstructions = async (req: Request, res: Response): Promise<void> => {
  const validatedWaybill = WaybillSchema.safeParse(req.body);
  if (!validatedWaybill.success) {
    const errors = JSON.stringify(validatedWaybill.error.errors);
    throw new Error(errors);
  }

  const { instructions, ...waybillData } = validatedWaybill.data;

  try {
    const waybill = await Waybill.create(waybillData);
    const instructionInstances = instructions.map((inst) => ({ ...inst, waybillId: waybill.id }));
    await Instruction.bulkCreate(instructionInstances);

    res.status(201).json({ waybill });
  } catch (err) {
    console.error(err);
    throw new Error('Failed to create waybill and instructions');
  }
};

const syncInstructions = async (waybillId: number, newInstructions: InstructionInput[]) => {
  const existingInstructions = await Instruction.findAll({ where: { waybillId } });
  const existingById = new Map(existingInstructions.map(inst => [inst.id, inst]));

  const incomingIds = new Set<number>();

  for (const newInst of newInstructions) {
    if (newInst.id && existingById.has(newInst.id)) {
      const existing = existingById.get(newInst.id)!;
      await existing.update(newInst);
      incomingIds.add(newInst.id);
    } else {
      await Instruction.create({ ...newInst, waybillId });
    }
  }

  // Delete any instructions not included in update
  for (const existing of existingInstructions) {
    if (!incomingIds.has(existing.id)) {
      await existing.destroy();
    }
  }
};

export const updateWaybillWithInstructions = async (req: Request, res: Response): Promise<void> => {
  const validatedWaybill = WaybillSchema.safeParse(req.body);
  if (!validatedWaybill.success) {
    const errors = JSON.stringify(validatedWaybill.error.errors);
    throw new Error(errors);
  }

  const { instructions, ...waybillData } = validatedWaybill.data;

  try {
    const waybill = await Waybill.findByPk(req.params.id);
    if (!waybill){
      throw new Error('Waybill not found. Cannot update waybill');
    }

    await waybill.update(waybillData);
    await syncInstructions(waybill.id, instructions);

    const updatedWaybill = await Waybill.findByPk(waybill.id, { include: Instruction });
    res.json({ waybill: updatedWaybill });
  } catch (err) {
    console.error(err);
    throw new Error('Failed to update waybill and instructions');
  }
};

export const deleteWaybill = async (req: Request, res: Response): Promise<void> => {
  try {
    const waybill = await Waybill.findByPk(req.params.id);
    if (!waybill){
      throw new Error('Waybill not found. Cannot delete Waybill');
    }

    await waybill.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    throw new Error('Failed to delete waybill');
  }
};

export const turnWaybill = async (req: Request, res: Response): Promise<void> => {
  const waybill = await Waybill.findByPk(req.params.id, { include: Instruction });

  if (!waybill) {
    throw new Error('Cannot turn waybill. Waybill not found');
  }

  const instructions = await Instruction.findAll({
    where: { waybillId: waybill.id },
    order: [['sequence', 'ASC']],
  });

  const totalInstructions = instructions.length;

  if (totalInstructions === 0) {
    throw new Error('Cannot turn waybill. No instructions found');
  }

  let nextSequence = waybill.currentSequence + 1;
  if (nextSequence > totalInstructions) {
    nextSequence = 1; // Wrap around to the first instruction
  }
  waybill.currentSequence = nextSequence;
  await waybill.save();

  res.json({ waybill });
};

export const getActiveInstructionForWaybill = async (req: Request, res: Response): Promise<void> => {
  const waybill = await Waybill.findByPk(req.params.id);
  if (!waybill?.id || !waybill?.currentSequence){
    throw new Error('Cannot get active instruction. Waybill not found');
  }

  const instruction = await Instruction.findOne({
    where: {
      waybillId: waybill.id,
      sequence: waybill.currentSequence,
    },
  });

  if (!instruction) {
    throw new Error(
      `No instruction found for waybill ${waybill.id} at sequence ${waybill.currentSequence}`
    );
  }  

  res.json(instruction);
};
