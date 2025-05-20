export interface Instruction {
    id: number;
    waybillId: number;
    commodityId: number;
    locationId: number;
    trackId: number;
    tat: string;
    specialInstructions?: string;
    sequence: number;
  }
  
  export interface InstructionInput {
    id?: number; // Optional for new instructions
    commodityId: number | undefined;
    locationId: number;
    trackId: number;
    tat: string;
    specialInstructions?: string;
    sequence: number;
  }
  