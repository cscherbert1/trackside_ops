import { useEffect, useState } from "react";
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

export default function Layouts() {
  const [layouts, setLayouts] = useState<Layout[]>([]);

  const [form, setForm] = useState<LayoutForm>({ name: "", description: "", id: null });
  const editing = form.id !== null;

  useEffect(() => {
    fetchLayouts().then(setLayouts).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (layout: Layout) => {
    setForm(layout);
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

      <div className="space-y-4 border p-4 rounded-xl shadow-sm bg-slate-100">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input className="bg-white" name="name" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea className="bg-white" name="description" value={form.description} onChange={handleChange} placeholder="Optional" />
        </div>

        <div>
          <Button className="bg-slate-700 text-white border border-black" onClick={handleCreateOrUpdate}>{editing ? "Save" : "Create"}</Button>
          <Button className="bg-slate-300 border border-black ml-2" onClick={() => setForm({ name: "", description: "", id: null })}>
              Cancel
            </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {layouts.map((layout) => (
            <TableRow key={layout.id}>
              <TableCell>{layout.name}</TableCell>
              <TableCell>{layout.description}</TableCell>
              <TableCell className="text-right space-x-2">
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
