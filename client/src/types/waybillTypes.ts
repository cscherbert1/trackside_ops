// client/src/types/waybillTypes.ts
import { Instruction, InstructionInput } from './instructionTypes';

export interface Waybill {
  id: number;
  layoutId: number;
  carType: string;
  repeating: boolean;
  rareWaybill: boolean;
  currentSequence: number;
  Instructions: Instruction[];
}

export interface WaybillInput {
  layoutId: number;
  carType: string | undefined;
  repeating: boolean;
  rareWaybill: boolean;
  currentSequence: number;
  instructions: InstructionInput[]; // Instructions being created/updated with the waybill
}
