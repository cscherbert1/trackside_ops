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
import {fetchLayoutById} from "@/services/layoutService"
import {
  fetchLocationByLayoutId,
  createLocation, 
  updateLocation,
  deleteLocation
} from "@/services/locationService"
import { Layout } from "@/types/layoutTypes"
import { Location, LocationForm } from "@/types/locationTypes"

export default function Locations() {
  const { layoutId } = useParams();
  const [layout, setLayout] = useState<Layout | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const emptyForm = {
    name: '',
    isSwitching: false,
    isClassification: false,
    isStaging: false,
    id: null
  };
  const [form, setForm] = useState<LocationForm>(emptyForm);
  const editing = form.id !== null;

  useEffect(() => {
    if (layoutId) {
        fetchLayoutById(Number(layoutId)).then(setLayout).catch(console.error);
        fetchLocationByLayoutId(Number(layoutId)).then(setLocations).catch(console.error);
    }
  }, [layoutId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCheckboxChange = (id: 'switching' | 'classification' | 'staging') => {
    setForm(prev => ({
      ...prev,
      isSwitching: id === 'switching' ? !prev.isSwitching : prev.isSwitching,
      isClassification: id === 'classification' ? !prev.isClassification : prev.isClassification,
      isStaging: id === 'staging' ? !prev.isStaging : prev.isStaging,
    }))
  }

  const handleCreateOrUpdate = async () => {
    try {
      if (!layoutId) {
        throw new Error("Missing layoutId in route params");
      }

      const formData = {
        name: form.name!,
        layoutId: Number(layoutId), // todo: ensure type is note 'undefined' for typescript, and convert to number
        isSwitching: form.isSwitching!,
        isClassification: form.isClassification!, 
        isStaging: form.isStaging!
      };
      
      if(editing && typeof form.id === "number") {
        const updated = await updateLocation(form.id, formData);
        setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      } else {
        const created = await createLocation(formData);
        console.log('Created location:', created);
        setLocations((prev) => [...prev, created]);
      }
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (location: Location) => {
    setForm(location);
  };

  const handleDelete = async (id: number) => {
    try{
      await deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
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
              <Link to="/setup/layouts">Layouts</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Locations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

        <h1 className="text-2xl font-bold">
            <span>{layout?.name || "..."}</span> Locations
        </h1>

      {/* Form */}
      <div className="space-y-4 border p-4 rounded-xl shadow-sm bg-slate-100">
        <h2 className="text-lg font-bold">Add New Location</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            className="bg-white"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
                className="bg-white"
                id="switching"
                checked={form.isSwitching}
                onCheckedChange={() => handleCheckboxChange('switching')}
            />
            <label htmlFor="switching" className="text-sm font-medium leading-none">
              Switching Location
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
                className="bg-white"
                id="classification"
                checked={form.isClassification}
                onCheckedChange={() => handleCheckboxChange('classification')}
            />
            <label htmlFor="classification" className="text-sm font-medium leading-none">
              Classification Yard
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
                className="bg-white"
                id="staging"
                checked={form.isStaging}
                onCheckedChange={() => handleCheckboxChange('staging')}
            />
            <label htmlFor="staging" className="text-sm font-medium leading-none">
              Staging Yard
            </label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-slate-300 border border-black sm:ml-2 w-full sm:w-auto sm:flex-1" variant="secondary" onClick={() => setForm(emptyForm)}>
            Cancel
          </Button>
          <Button className="bg-slate-700 text-white border border-black w-full sm:w-auto sm:flex-1" onClick={handleCreateOrUpdate}>{editing ? "Save" : "Create"}</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className='font-bold'>Name</TableCell>
              <TableCell className="font-bold text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {locations.map(location => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="outline">Tracks</Button>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(location)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(location.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
