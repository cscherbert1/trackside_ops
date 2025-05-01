import { Location } from "@/types/locationTypes"

const API_URL = "http://localhost:3000/api/locations";

// Fetch locations by layoutId
export async function fetchLocationByLayoutId(layoutId: number): Promise<Location[]> {
    const url = `${API_URL}/getByLayout/${layoutId}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error("Failed to fetch locations by layoutId");
    return res.json();
}

// Fetch location by id
export async function fetchLocationById(locationId: number): Promise<Location> {
    const url = `${API_URL}/${locationId}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error("Failed to fetch location by id");
    return res.json();
}

// create location
export async function createLocation(data: Omit<Location, "id">): Promise<Location> {
    const res = await fetch(API_URL, {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create location");
    return res.json();
}

// update location
export async function updateLocation(id:number, data: Omit<Location, "id">): Promise<Location> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update location");
    return res.json();
}

// delete location
export async function deleteLocation(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete location");
}