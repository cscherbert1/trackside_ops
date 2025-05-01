import { Commodity } from "@/types/commodityTypes";

const API_URL = "http://localhost:3000/api/commodities";

// Fetch commodities by layout id
export async function fetchCommodities(layoutId: number): Promise<Commodity[]> {
  const url = `${API_URL}/getByLayout/${layoutId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch commodities by layoutId");
  return res.json();
}

// Fetch commodity by id
export async function fetchCommodityById(commodityId:number): Promise<Commodity> {
    const url = `${API_URL}/${commodityId}`
    const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch commodity");
  return res.json();
}

// Create commodity
export async function createCommodity(data: Omit<Commodity, "id">): Promise<Commodity> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create commodity");
  return res.json();
}

// Update commodity
export async function updateCommodity(id: number, data: Omit<Commodity, "id">): Promise<Commodity> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update commodity");
  return res.json();
}

// Delete commodity
export async function deleteCommodity(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete commodity");
}
