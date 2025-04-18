import {
    Layout
} from "@/types/layoutTypes"

const API_URL = "http://localhost:3000/api/layouts"; // adjust if using proxy or different port

// Fetch all layouts
export async function fetchLayouts(): Promise<Layout[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch layouts");
  return res.json();
}

// Create layout
export async function createLayout(data: Omit<Layout, "id">): Promise<Layout> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create layout");
  return res.json();
}

// Update layout
export async function updateLayout(id: number, data: Omit<Layout, "id">): Promise<Layout> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update layout");
  return res.json();
}

// Delete layout
export async function deleteLayout(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete layout");
}
