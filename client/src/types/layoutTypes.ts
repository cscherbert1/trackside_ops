export type Layout = {
  id: number;
  name: string;
  description: string;
};

export type LayoutForm = Partial<Omit<Layout, "id">> & { id: number | null };