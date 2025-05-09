// client/src/components/LayoutSelector.tsx
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Layout } from '@/types/layoutTypes';
import { fetchLayouts } from '@/services/layoutService';

interface LayoutSelectorProps {
  onSelect: (layoutId: number) => void;
  initialLayoutId?: number | null;
}

export default function LayoutSelector({ onSelect, initialLayoutId = null }: LayoutSelectorProps) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selected, setSelected] = useState<number | null>(initialLayoutId);

  useEffect(() => {
    fetchLayouts().then(setLayouts).catch(console.error);
  }, []);

  const handleChange = (value: string) => {
    const id = Number(value);
    setSelected(id);
    onSelect(id); // Already a number
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">Select Layout</label>
      <Select onValueChange={handleChange} value={selected?.toString()}>
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
  );
}
