import { Track } from "@/types/trackTypes"

const API_URL = "http://localhost:3000/api/tracks";

// Fetch tracks by locationId
export async function fetchTracksByLocationId(locationId: number): Promise<Track[]> {
    const url = `${API_URL}/getByLocation/${locationId}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error("Failed to fetch tracks by locationId");
    return res.json();
}

// Fetch track by id
export async function fetchTrackById(trackId: number): Promise<Track> {
    const url = `${API_URL}/${trackId}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error("Failed to fetch track by id");
    return res.json();
}

// create track
export async function createTrack(data: Omit<Track, "id">): Promise<Track> {
    const res = await fetch(API_URL, {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create track");
    return res.json();
}

// update track
export async function updateTrack(id:number, data: Omit<Track, "id">): Promise<Track> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update track");
    return res.json();
}

// delete track
export async function deleteTrack(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete track");
}