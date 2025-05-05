// client/src/pages/setup/Commodities.tsx
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { Layout } from '@/types/layoutTypes'
import { Commodity } from '@/types/commodityTypes'
import { fetchLayouts } from '@/services/layoutService'
import {
  fetchCommodities,
  createCommodity,
  updateCommodity,
  deleteCommodity,
} from '@/services/commodityService';


export default function Commodities() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<number | null>(null);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [form, setForm] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const editing = form.id !== null;

  useEffect(() => {
    fetchLayouts().then(setLayouts).catch(console.error);
  }, []);

  const handleSelectLayout = async (value: string) => {
    const id = Number(value);
    setSelectedLayoutId(id);
    try {
      const data = await fetchCommodities(id);
      setCommodities(data);
    } catch (error) {
      console.error("Error loading commodities:", error);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({ ...prev, name }));
    setIsFormValid(name.trim().length > 0);
  };

  const handleCreateOrUpdate = async () => {
    if (!isFormValid || !selectedLayoutId) return;
  
    try {
      if (editing && form.id !== null) {
        const updated = await updateCommodity(form.id, {
          name: form.name,
          layoutId: selectedLayoutId,
        });
        setCommodities((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const created = await createCommodity({
          name: form.name,
          layoutId: selectedLayoutId,
        });
        setCommodities((prev) => [...prev, created]);
      }
  
      setForm({ id: null, name: '' });
      setIsFormValid(false);
    } catch (error) {
      console.error("Error saving commodity:", error);
    }
  };
 
  const handleEdit = (commodity: Commodity) => {
    setForm({ id: commodity.id, name: commodity.name });
    setIsFormValid(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCommodity(id);
      setCommodities((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting commodity:", error);
    }
  };
  

  const handleCancel = () => {
    setForm({ id: null, name: '' });
    setIsFormValid(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">

      <h1 className="text-2xl font-bold">Commodities</h1>

      {/* Layout Select */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Select Layout</label>
        <Select onValueChange={handleSelectLayout}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Choose a layout..." />
          </SelectTrigger>
          <SelectContent className="bg-white z-50 shadow-md border rounded-md">
            {layouts.map((layout) => (
              <SelectItem key={layout.id} value={String(layout.id)} className="hover:bg-slate-100 cursor-pointer">
                {layout.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLayoutId && (
        <>
          {/* Form */}
          <div className="space-y-4 border p-4 rounded-xl shadow-sm bg-slate-100">
            <h2 className="text-lg font-bold">{editing ? 'Edit' : 'Add'} Commodity</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                className="bg-white"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className="bg-slate-700 text-white"
                onClick={handleCreateOrUpdate}
                disabled={!isFormValid}
              >
                {editing ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {commodities.map((commodity) => (
                  <TableRow key={commodity.id}>
                    <TableCell>{commodity.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(commodity)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(commodity.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
