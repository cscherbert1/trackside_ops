import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import {
  fetchLayouts,
  createLayout,
  updateLayout,
  deleteLayout,
} from "@/services/layoutService";
import {
  Layout, 
  LayoutForm
} from "@/types/layoutTypes"
import { LayoutSchema } from "@/schemas/layout.schema";
import { ZodError } from "zod";

export default function Layouts() {
  const [layouts, setLayouts] = useState<Layout[]>([]);

  const [form, setForm] = useState<LayoutForm>({ name: "", description: "", id: null });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const editing = form.id !== null;

   const validateForm = (form: LayoutForm) => {
      try {
        LayoutSchema.parse({
          name: form.name,
          description: form.description
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
    fetchLayouts().then(setLayouts).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    setIsFormValid(validateForm(updatedForm));
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editing && typeof form.id === "number") {
        const updated = await updateLayout(form.id, {
          name: form.name!,
          description: form.description!,
        });
        setLayouts((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      } else {
        const created = await createLayout({
          name: form.name!,
          description: form.description!,
        });
        setLayouts((prev) => [...prev, created]);
      }
      setForm({ name: "", description: "", id: null });
      setIsFormValid(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    const reset = { name: "", description: "", id: null };
    setForm(reset);
    setIsFormValid(validateForm(reset));
    setErrorMessage(null);
  }

  const handleEdit = (layout: Layout) => {
    setForm(layout);
    setIsFormValid(validateForm(layout));
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLayout(id);
      setLayouts((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Layouts</h1>
        
        {/* Form */}
        <div className="space-y-4 border p-4 rounded-xl shadow-sm bg-slate-100">
            <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input className="bg-white" name="name" value={form.name} onChange={handleChange} />
            {errorMessage && (
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            )}
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea className="bg-white" name="description" value={form.description} onChange={handleChange} placeholder="Optional" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <Button className="bg-slate-300 border border-black sm:ml-2 w-full sm:w-auto sm:flex-1" variant="secondary" onClick={handleCancel}>
                     Cancel
                </Button>
                <Button className="bg-slate-700 text-white border border-black w-full sm:w-auto sm:flex-1" disabled={!isFormValid} onClick={handleCreateOrUpdate}>{editing ? "Save" : "Create"}</Button>
            </div>
        </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold'>Name</TableHead>
            <TableHead className="font-bold hidden md:table-cell">Description</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {layouts.map((layout) => (
            <TableRow key={layout.id}>
                <TableCell>{layout.name}</TableCell>
                <TableCell className="hidden md:table-cell">{layout.description}</TableCell>
                <TableCell className="text-right space-x-2">
                    <Button className="h-[34px] px-3 text-sm" variant="outline" size="sm">
                        <Link to={`/setup/layouts/${layout.id}/locations`}>
                            Locations
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(layout)}>
                    <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(layout.id)}>
                    <Trash2 className="w-4 h-4" name="trash2Icon" color="red" />
                    </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
