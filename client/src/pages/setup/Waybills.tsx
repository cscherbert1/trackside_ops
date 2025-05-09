import { useEffect, useState } from 'react';
import CarTypes from '@/types/carTypes';
import { Commodity } from '@/types/commodityTypes';
import { Location } from '@/types/locationTypes';
import { Track } from '@/types/trackTypes';
import { Waybill } from '@/types/waybillTypes';
import { Instruction } from '@/types/instructionTypes';
import { fetchLocationByLayoutId } from '@/services/locationService';
import { fetchTracksByLocationId } from '@/services/trackService';
import { fetchCommoditiesbyLayoutId } from '@/services/commodityService';
import { fetchWaybillsByLayoutId, createWaybillWithInstructions } from '@/services/waybillService';
import  LayoutSelector from '@/components/LayoutSelector';
import InstructionsForm from '@/components/InstructionsForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function WaybillsPage() {
  const [layoutId, setLayoutId] = useState<number | null>(null);
  const [waybillData, setWaybillData] = useState<Partial<Waybill>>({
    carType: '',
    repeating: false,
    rareWaybill: false,
    currentSequence: 1,
  });
  const [instructions, setInstructions] = useState<Partial<Instruction>[]>([
    {},
    {},
  ]);
  const [waybills, setWaybills] = useState<Waybill[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [tracksByLocation, setTracksByLocation] = useState<Record<number, Track[]>>({});

  useEffect(() => {
    if (layoutId !== null) {
      fetchWaybillsByLayoutId(layoutId).then(setWaybills);
      fetchLocationByLayoutId(layoutId).then(setLocations).catch(console.error);
      fetchCommoditiesbyLayoutId(layoutId).then(setCommodities).catch(console.error);
    }
  }, [layoutId]);

  useEffect(() => {
    instructions.forEach((inst) => {
      const locationId = inst.locationId;
      if (locationId && !tracksByLocation[locationId]) {
        fetchTracksByLocationId(locationId)
          .then((tracks) => {
            setTracksByLocation((prev) => ({
              ...prev,
              [locationId]: tracks,
            }));
          })
          .catch(console.error);
      }
    });
  }, [instructions, tracksByLocation]);
  

  const handleLocationChange = async (instructionIndex: number, locationId: number) => {
    console.log(`Location has changed for instruction #${instructionIndex}. ID received: ${locationId}`);
  
    // Combine location and track updates in one atomic operation
    setInstructions((prevInstructions) => {
      const updated = [...prevInstructions];
      updated[instructionIndex] = {
        ...updated[instructionIndex],
        locationId,
        trackId: undefined,
      };
      return updated;
    });
  
    console.log(`Tracks by location: ${JSON.stringify(tracksByLocation[locationId])}`);
  
    // Fetch tracks if not already fetched
    if (!tracksByLocation[locationId]) {
      try {
        const tracks = await fetchTracksByLocationId(locationId);
        setTracksByLocation((prev) => ({ ...prev, [locationId]: tracks }));
      } catch (err) {
        console.error("Failed to fetch tracks", err);
      }
    }
  };
  

  const handleInstructionChange = (index: number, field: keyof Instruction, value: any) => {
    const updated = [...instructions];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setInstructions(updated);
  };

  const addInstruction = () => {
    if (instructions.length < 6) {
      setInstructions([...instructions, {}]);
    }
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 2) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleWaybillSubmit = async () => {
    if (layoutId === null) return;
    const payload = {
      ...waybillData,
      layoutId,
      instructions: instructions.map((inst, index) => ({
        ...inst,
        sequence: index + 1,
      })),
    };
    await createWaybillWithInstructions(payload);
    setWaybillData({ carType: '', repeating: false, rareWaybill: false, currentSequence: 1 });
    setInstructions([{}, {}]);
    const waybills = await fetchWaybillsByLayoutId(layoutId);
    setWaybills(waybills);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Waybills</h1>
      <LayoutSelector onSelect={(id) => setLayoutId(id)} />

      {layoutId !== null && (
        <>
          <Card>
            <CardContent className="space-y-2">
              <h2 className="text-xl font-medium">Waybill Info</h2>
              <Select
                value={waybillData.carType || ''}
                onValueChange={(val) => setWaybillData({ ...waybillData, carType: val })}
              >
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder="Select Car Type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 shadow-md border rounded-md">
                  {CarTypes.map((type) => (
                    <SelectItem key={type} value={type} className="hover:bg-slate-100 cursor-pointer">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={waybillData.repeating || false}
                  onChange={(e) => setWaybillData({ ...waybillData, repeating: e.target.checked })}
                />
                Repeating
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={waybillData.rareWaybill || false}
                  onChange={(e) => setWaybillData({ ...waybillData, rareWaybill: e.target.checked })}
                />
                Rare Waybill
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <InstructionsForm
                instructions={instructions}
                locations={locations}
                commodities={commodities}
                tracksByLocation={tracksByLocation}
                onChange={handleInstructionChange}
                onLocationChange={handleLocationChange}
                onAdd={addInstruction}
                onRemove={removeInstruction}
              />
            </CardContent>
          </Card>

          <Button className="mt-2" onClick={handleWaybillSubmit}>
            Save Waybill
          </Button>
        </>
      )}
    </div>
  );
}
