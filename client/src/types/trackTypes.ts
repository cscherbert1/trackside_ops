export type Track = {
    id: number;
    name: string;
    trackLength: number;
    isOffSpotAvailable: boolean;
}

export type TrackForm = Partial<Omit<Track, "id">> & {id: number | null};