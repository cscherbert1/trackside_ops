export type Commodity = {
    id: number;
    name: string;
    layoutId: number;
  }
  
  export type CommodityForm = Partial<Omit<Commodity, "id">> & {id:number | null};