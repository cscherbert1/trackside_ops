// client/components/InstructionsForm.tsx

import { Instruction } from '@/types/instructionTypes';
import { Commodity } from '@/types/commodityTypes';
import { Location } from '@/types/locationTypes';
import { Track } from '@/types/trackTypes';
import TatTypes from '@/types/tatTypes';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InstructionsFormProps {
  instructions: Partial<Instruction>[];
  locations: Location[];
  commodities: Commodity[];
  tracksByLocation: Record<number, Track[]>;
  onChange: (index: number, field: keyof Instruction, value: any) => void;
  onLocationChange: (index: number, locationId: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function InstructionsForm({
  instructions,
  locations,
  commodities,
  tracksByLocation,
  onChange,
  onLocationChange,
  onAdd,
  onRemove,
}: InstructionsFormProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-medium">Instructions</h2>
      {instructions.map((inst, index) => (
        <div key={index} className="space-y-1 border-b pb-2">
          <h3 className="font-medium">Instruction {index + 1}</h3>

          {/* Commodity */}
          <Select
            value={inst.commodityId?.toString() || ''}
            onValueChange={(val) => onChange(index, 'commodityId', Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Commodity" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 shadow-md border rounded-md">
              {commodities.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()} className="hover:bg-slate-100 cursor-pointer">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location */}
          <Select
            value={inst.locationId?.toString() || ''}
            onValueChange={(val) => onLocationChange(index, Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 shadow-md border rounded-md">
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id.toString()} className="hover:bg-slate-100 cursor-pointer">
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Track */}
          {inst.locationId ? (
            <Select
              value={inst.trackId?.toString() || ''}
              onValueChange={(val) => onChange(index, 'trackId', Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Track" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 shadow-md border rounded-md">
                {(tracksByLocation[inst.locationId] || []).map((track) => (
                  <SelectItem key={track.id} value={track.id.toString()} className="hover:bg-slate-100 cursor-pointer">
                    {track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500">Select a location first</div>
          )}

          {/* TAT */}
          <Select
            value={inst.tat || ''}
            onValueChange={(val) => onChange(index, 'tat', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select TAT" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 shadow-md border rounded-md">
              {TatTypes.map((tat) => (
                <SelectItem key={tat} value={tat} className="hover:bg-slate-100 cursor-pointer">
                  {tat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Special Instructions */}
          <Input
            placeholder="Special Instructions"
            value={inst.specialInstructions || ''}
            onChange={(e) => onChange(index, 'specialInstructions', e.target.value)}
          />

          {/* Remove Button */}
          {instructions.length > 2 && (
            <Button variant="destructive" onClick={() => onRemove(index)}>
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button onClick={onAdd}>Add Instruction</Button>
    </div>
  );
}
