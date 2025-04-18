export type Location = {
    id: number;
    name: string;
    isSwitching: boolean,
    isClassification: boolean,
    isStaging: boolean,
  };
  
  export type LocationForm = Partial<Omit<Location, "id">> & { id: number | null };