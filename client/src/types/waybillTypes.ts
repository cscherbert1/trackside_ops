import { Instruction, InstructionInput } from './instructionTypes';

export interface Waybill {
  id: number;
  layoutId: number;
  carType: string;
  repeating: boolean;
  rareWaybill: boolean;
  currentSequence: number;
  instructions: Instruction[]; // This matches the backend include behavior
}

export interface WaybillInput {
  layoutId: number;
  carType: string | undefined;
  repeating: boolean;
  rareWaybill: boolean;
  currentSequence: number;
  instructions: InstructionInput[]; // Instructions being created/updated with the waybill
}
