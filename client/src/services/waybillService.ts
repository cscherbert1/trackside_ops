import { Waybill, WaybillInput } from "@/types/waybillTypes";
import { Instruction } from "@/types/instructionTypes";

const API_URL = "http://localhost:3000/api/waybills";

// Fetch waybills by layout ID
export async function fetchWaybillsByLayoutId(layoutId: number): Promise<Waybill[]> {
  const res = await fetch(`${API_URL}/getByLayout/${layoutId}`);
  if (!res.ok) throw new Error("Failed to fetch waybills by layoutId");
  return res.json();
}

// Fetch a single waybill by ID
export async function fetchWaybillById(id: number): Promise<Waybill> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch waybill");
  return res.json();
}

// Create a waybill with instructions
export async function createWaybillWithInstructions(data: WaybillInput): Promise<Waybill> {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create waybill");
  const result = await res.json();
  return result.waybill;
}

// Update a waybill and sync instructions
export async function updateWaybillWithInstructions(id: number, data: WaybillInput): Promise<Waybill> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update waybill");
  const result = await res.json();
  return result.waybill;
}

// Delete a waybill
export async function deleteWaybill(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete waybill");
}

// Turn a waybill to the next instruction
export async function turnWaybill(id: number): Promise<Waybill> {
  const res = await fetch(`${API_URL}/turnWaybill/${id}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to turn waybill");
  const result = await res.json();
  return result.waybill;
}

// Get the currently active instruction for a waybill
export async function fetchActiveInstruction(id: number): Promise<Instruction> {
  const res = await fetch(`${API_URL}/getActiveInstruction/${id}`);
  if (!res.ok) throw new Error("Failed to fetch active instruction");
  return res.json();
}
