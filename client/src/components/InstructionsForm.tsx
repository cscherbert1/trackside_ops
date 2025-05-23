// client/components/InstructionsForm.tsx

import { Instruction } from '@/types/instructionTypes';
import { Commodity } from '@/types/commodityTypes';
import { Location } from '@/types/locationTypes';
import { Track } from '@/types/trackTypes';
import TatTypes from '@/types/tatTypes';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';

interface InstructionsFormProps {
  instructions: Partial<Instruction>[];
  locations: Location[];
  commodities: Commodity[];
  tracksByLocation: Record<number, Track[]>;
  onChange: (index: number, field: keyof Instruction, value: string | number) => void;
  onLocationChange: (index: number, locationId: number) => void;
  onRemove: (index: number) => void;
}

export default function InstructionsForm({
  instructions,
  locations,
  commodities,
  tracksByLocation,
  onChange,
  onLocationChange,
  onRemove,
}: InstructionsFormProps) {
  return (
    <>
      <div className="flex flex-wrap gap-4 pb-3">
        {instructions.map((inst, index) => (

          <Card key={index} className="w-full sm:w-[calc(50%-0.5rem)]">
            <CardContent className='space-y-2'>
              <div key={index} className="space-y-1 pb-2">
                <h3 className="font-medium">Instruction {index + 1}</h3>

                {/* Commodity */}
                <label className="block text-sm font-medium mb-1">Commodity</label>
                <Select
                  value={inst.commodityId?.toString() || ''}
                  onValueChange={(val) => onChange(index, 'commodityId', Number(val))}
                >
                  <SelectTrigger className='w-full'>
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
                <label className="block text-sm font-medium mb-1">Location</label>
                <Select
                  value={inst.locationId?.toString() || ''}
                  onValueChange={(val) => onLocationChange(index, Number(val))}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-md border rounded-md w-fu">
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()} className="hover:bg-slate-100 cursor-pointer">
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Track */}
                {inst.locationId && tracksByLocation[inst.locationId] && (
                  <>
                    <label className="block text-sm font-medium mb-1">Track</label>
                    <Select
                      value={inst.trackId?.toString() || ''}
                      onValueChange={(val) => onChange(index, 'trackId', Number(val))}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select Track" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 shadow-md border rounded-md">
                        {tracksByLocation[inst.locationId]?.map((track) => (
                          <SelectItem key={track.id} value={track.id.toString()}>
                            {track.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
                
                {/* TAT */}
                <label className="block text-sm font-medium mb-1">Turn Around Time</label>
                <Select
                  value={inst.tat || ''}
                  onValueChange={(val) => onChange(index, 'tat', val)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select Turn Around Time" />
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
                <label className="block text-sm font-medium mb-1">Special Instructions (Max 64 Chars.)</label>
                <Input
                  placeholder="Special Instructions"
                  value={inst.specialInstructions || ''}
                  onChange={(e) => onChange(index, 'specialInstructions', e.target.value)}
                />

                {/* Remove Button */}
                {instructions.length > 2 && (
                  <Button
                      type="button"
                      variant="outline"
                      className="text-red-500 border-red-500"
                      onClick={() => onRemove(index)}>
                    Remove
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
        ))}
      </div>
    </>
  );
}
