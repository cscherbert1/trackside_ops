// client/components/InstructionsForm.tsx
import { Controller, useWatch, Control, FieldErrors, FieldArrayWithId } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { fetchTracksByLocationId } from '@/services/trackService';
import TatTypes from '@/types/tatTypes';
import { Location } from '@/types/locationTypes';
import { Commodity } from '@/types/commodityTypes';
import { Track } from '@/types/trackTypes';
import { WaybillInput } from '@/schemas/waybillSchema';

interface InstructionsFormProps {
  control: Control<WaybillInput>;
  errors: FieldErrors<WaybillInput>['instructions'];
  fields: FieldArrayWithId<WaybillInput, 'instructions', 'id'>[];
  remove: (index: number) => void;
  locations: Location[];
  commodities: Commodity[];
}

export default function InstructionsForm({
  control,
  errors,
  fields,
  remove,
  locations,
  commodities
}: InstructionsFormProps) {
  const instructions = useWatch({ control, name: 'instructions' });
  const [tracksByLocation, setTracksByLocation] = useState<Record<number, Track[]>>({});

  useEffect(() => {
    instructions?.forEach((inst) => {
      if (inst?.locationId && !tracksByLocation[inst.locationId]) {
        fetchTracksByLocationId(inst.locationId).then((tracks) => {
          setTracksByLocation((prev) => ({ ...prev, [inst.locationId]: tracks }));
        }).catch(console.error);
      }
    });
  }, [instructions, tracksByLocation]);

  return (
    <div className="flex flex-wrap gap-4 pb-3">
      {fields.map((field, index) => (
        <Card key={field.id} className="w-full sm:w-[calc(50%-0.5rem)]">
          <CardContent className="space-y-2">
            <div className="space-y-1 pb-2">
              <h3 className="font-medium">Instruction {index + 1}</h3>

              <label className="block text-sm font-medium mb-1">Commodity</label>
              <Controller
                control={control}
                name={`instructions.${index}.commodityId`}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="w-full">
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
                )}
              />
              {errors?.[index]?.commodityId && <p className="text-sm text-red-500">{errors[index].commodityId.message}</p>}

              <label className="block text-sm font-medium mb-1">Location</label>
              <Controller
                control={control}
                name={`instructions.${index}.locationId`}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(val) => {
                      const locationId = Number(val);
                      field.onChange(locationId);
                      fetchTracksByLocationId(locationId).then((tracks) => {
                        setTracksByLocation((prev) => ({ ...prev, [locationId]: tracks }));
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
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
                )}
              />
              {errors?.[index]?.locationId && <p className="text-sm text-red-500">{errors[index].locationId.message}</p>}

                {(() => {
                  const selectedLocationId = instructions?.[index]?.locationId;
                  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

                  return (
                    selectedLocationId &&
                    selectedLocation?.isSwitching &&
                    tracksByLocation[selectedLocationId] && (
                      <>
                        <label className="block text-sm font-medium mb-1">Track</label>
                        <Controller
                          control={control}
                          name={`instructions.${index}.trackId`}
                          render={({ field }) => (
                            <Select
                              value={field.value?.toString() || ''}
                              onValueChange={(val) => field.onChange(Number(val))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Track" />
                              </SelectTrigger>
                              <SelectContent className="bg-white z-50 shadow-md border rounded-md">
                                {tracksByLocation[selectedLocationId].map((track) => (
                                  <SelectItem
                                    key={track.id}
                                    value={track.id.toString()}
                                    className="hover:bg-slate-100 cursor-pointer"
                                  >
                                    {track.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </>
                    )
                  );
                })()}
              {errors?.[index]?.trackId && <p className="text-sm text-red-500">{errors[index].trackId.message}</p>}

              <label className="block text-sm font-medium mb-1">Turn Around Time</label>
              <Controller
                control={control}
                name={`instructions.${index}.tat`}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select TAT" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 shadow-md border rounded-md">
                      {TatTypes.map((t) => (
                        <SelectItem key={t} value={t} className="hover:bg-slate-100 cursor-pointer">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.[index]?.tat && <p className="text-sm text-red-500">{errors[index].tat.message}</p>}

              <label className="block text-sm font-medium mb-1">Special Instructions</label>
              <Controller
                control={control}
                name={`instructions.${index}.specialInstructions`}
                render={({ field }) => (
                  <Input placeholder="Special Instructions" {...field} />
                )}
              />
              {errors?.[index]?.specialInstructions && <p className="text-sm text-red-500">{errors[index].specialInstructions.message}</p>}

              {fields.length > 2 && (
                <Button type="button" variant="outline" className="text-red-500 border-red-500" onClick={() => remove(index)}>
                  Remove
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
