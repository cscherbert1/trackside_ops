// client/src/pages/setup/Tracks.tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Pencil, Trash2 } from "lucide-react"
import { fetchLayoutById } from "@/services/layoutService"
import { fetchLocationById } from "@/services/locationService"
import {
  fetchTracksByLocationId,
  createTrack,
  updateTrack,
  deleteTrack
} from "@/services/trackService"
import { Track, TrackForm } from "@/types/trackTypes"
import { TrackSchema } from '@/schemas/track.schema'
import { ZodError } from 'zod'
import { Location } from '@/types/locationTypes'
import { Layout } from '@/types/layoutTypes'

export default function Tracks() {
  const { layoutId, locationId } = useParams();
  const [layout, setLayout] = useState<Layout | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const emptyForm: TrackForm = {
    name: '',
    trackLength: 0,
    isOffSpotAvailable: false,
    id: null,
  };
  const [form, setForm] = useState<TrackForm>(emptyForm);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const editing = form.id !== null;

  const validateForm = (form: TrackForm) => {
    try {
      TrackSchema.parse({
        name: form.name,
        locationId: Number(locationId),
        trackLength: form.trackLength,
        isOffSpotAvailable: form.isOffSpotAvailable
      });
      setErrorMessage(null);
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        setErrorMessage(err.errors[0]?.message ?? null);
      } else {
        setErrorMessage("Invalid form data.");
      }
      return false;
    }
  };

  useEffect(() => {
    if (layoutId) {
      fetchLayoutById(Number(layoutId))
        .then(setLayout)
        .catch(console.error);
    }
  
    if (locationId) {
      fetchLocationById(Number(locationId))
        .then(setLocation)
        .catch(console.error);
  
      fetchTracksByLocationId(Number(locationId))
        .then(setTracks)
        .catch(console.error);
    }
  }, [layoutId, locationId]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedForm = {
      ...form,
      [name]: type === 'checkbox' ? checked : name === "trackLength" ? Number(value) : value,
    };
    setForm(updatedForm);
    setIsFormValid(validateForm(updatedForm));
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (!locationId) throw new Error("Missing locationId");

      const formData = {
        name: form.name!,
        locationId: Number(locationId),
        trackLength: form.trackLength!,
        isOffSpotAvailable: form.isOffSpotAvailable!
      };

      const validTrack = TrackSchema.parse(formData);
      setIsFormValid(true);

      if (editing && typeof form.id === "number") {
        const updated = await updateTrack(form.id, validTrack);
        setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await createTrack(validTrack);
        setTracks((prev) => [...prev, created]);
      }

      setForm(emptyForm);
      setIsFormValid(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setIsFormValid(false);
    setErrorMessage(null);
  };

  const handleEdit = (track: Track) => {
    setForm(track);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTrack(id);
      setTracks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/setup/layouts">{layout?.name || "Layouts"}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/setup/layouts/${layoutId}/locations`}>{location?.name || "..."}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='font-bold'>Tracks</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">
        <span>{location?.name || "..."}</span> Tracks
      </h1>

      {/* Form */}
      <div className="space-y-4 border p-4 rounded-xl shadow-sm bg-slate-100">
        <h2 className="text-lg font-bold">Add New Track</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            className="bg-white"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Track Length (ft)</label>
          <Input
            className="bg-white"
            name="trackLength"
            type="number"
            value={form.trackLength === 0? "": form.trackLength}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            className="bg-white"
            id="isOffSpotAvailable"
            checked={form.isOffSpotAvailable}
            onCheckedChange={() => setForm((prev) => ({
              ...prev,
              isOffSpotAvailable: !prev.isOffSpotAvailable
            }))}
          />
          <label htmlFor="isOffSpotAvailable" className="text-sm font-medium leading-none">
            Off Spot Available
          </label>
        </div>
        {errorMessage && <p className="text-sm text-red-600 mt-1">{errorMessage}</p>}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-slate-300 border border-black sm:ml-2 w-full sm:w-auto sm:flex-1" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="bg-slate-700 text-white border border-black w-full sm:w-auto sm:flex-1" onClick={handleCreateOrUpdate} disabled={!isFormValid}>
            {editing ? "Save" : "Create"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Length (ft)</TableCell>
              <TableCell className="font-bold hidden md:table-cell">Off Spot</TableCell>
              <TableCell className="font-bold text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {[...tracks]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(track => (
                <TableRow key={track.id}>
                <TableCell>{track.name}</TableCell>
                <TableCell>{track.trackLength}</TableCell>
                <TableCell className="hidden md:table-cell">{track.isOffSpotAvailable ? "Yes" : "No"}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(track)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(track.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
