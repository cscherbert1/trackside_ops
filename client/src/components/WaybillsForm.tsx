// components/WaybillForm.tsx
import { useEffect, useState } from 'react';
import CarTypes from '@/types/carTypes';
import { Commodity } from '@/types/commodityTypes';
import { Location } from '@/types/locationTypes';
import { Track } from '@/types/trackTypes';
import { Waybill, WaybillInput } from '@/types/waybillTypes';
import { Instruction } from '@/types/instructionTypes';
import { fetchTracksByLocationId } from '@/services/trackService';
import { createWaybillWithInstructions, fetchWaybillsByLayoutId } from '@/services/waybillService';
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

interface WaybillFormProps {
  layoutId: number;
  locations: Location[];
  commodities: Commodity[];
  setWaybills: (waybills: Waybill[]) => void;
  initialWaybill?: Waybill | null;
  onCancel?: () => void;
}

export default function WaybillForm({ layoutId, locations, commodities, setWaybills, initialWaybill, onCancel }: WaybillFormProps) {
  const [waybillData, setWaybillData] = useState<Partial<Waybill>>({
    carType: '',
    repeating: false,
    rareWaybill: false,
    currentSequence: 1,
  });

  const [instructions, setInstructions] = useState<Partial<Instruction>[]>([{}, {}]);
  const [tracksByLocation, setTracksByLocation] = useState<Record<number, Track[]>>({});

  useEffect(() => {
    if (initialWaybill) {
      setWaybillData({
        carType: initialWaybill.carType,
        repeating: initialWaybill.repeating,
        rareWaybill: initialWaybill.rareWaybill,
        currentSequence: initialWaybill.currentSequence,
        id: initialWaybill.id
      });
      setInstructions(initialWaybill.instructions || [{}, {}]);
    }
  }, [initialWaybill]);

  useEffect(() => {
    instructions.forEach((inst) => {
      const locationId = inst.locationId;
      if (locationId && !tracksByLocation[locationId]) {
        fetchTracksByLocationId(locationId)
          .then((tracks) => {
            setTracksByLocation((prev) => ({ ...prev, [locationId]: tracks }));
          })
          .catch(console.error);
      }
    });
  }, [instructions, tracksByLocation]);

  const handleLocationChange = async (instructionIndex: number, locationId: number) => {
    setInstructions((prev) => {
      const updated = [...prev];
      updated[instructionIndex] = {
        ...updated[instructionIndex],
        locationId,
        trackId: undefined,
      };
      return updated;
    });

    if (!tracksByLocation[locationId]) {
      try {
        const tracks = await fetchTracksByLocationId(locationId);
        setTracksByLocation((prev) => ({ ...prev, [locationId]: tracks }));
      } catch (err) {
        console.error("Failed to fetch tracks", err);
      }
    }
  };

  const handleInstructionChange = (index: number, field: keyof Instruction, value: string | number) => {
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

  const handleCancel = () => {
    setWaybillData({ carType: '', repeating: false, rareWaybill: false, currentSequence: 1 });
    setInstructions([{}, {}]);
    if (onCancel) onCancel();
  };

  const handleWaybillSubmit = async () => {
    const payload: WaybillInput = {
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
    if (onCancel) onCancel();
  };

  return (
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

      <div className="flex gap-2 mt-2">
        <Button onClick={handleWaybillSubmit}>
          {waybillData?.id ? 'Update Waybill' : 'Save Waybill'}
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
}
