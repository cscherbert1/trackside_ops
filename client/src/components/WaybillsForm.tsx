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
import { WaybillSchema } from '@/schemas/waybillSchema';
import { z } from 'zod';

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

  const resetForm = () => {
  setWaybillData({ carType: '', repeating: false, rareWaybill: false, currentSequence: 1 });
  setInstructions([{}, {}]);
};

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  const isValidInstruction = (inst: Partial<Instruction>) =>
  inst.locationId && inst.trackId && inst.commodityId;

  const handleWaybillSubmit = async () => {
    const allValid = instructions.every(isValidInstruction);
    if (!allValid) {
      alert("Please fill out all instruction fields.");
      return;
    } 
    const payload: WaybillInput = {
      ...waybillData,
      layoutId,
      instructions: instructions.map((inst, index) => ({
        ...inst,
        sequence: index + 1,
      })),
    };

    try {
      WaybillSchema.parse(payload); // Throws if invalid
      await createWaybillWithInstructions(payload);
      setWaybillData({ carType: '', repeating: false, rareWaybill: false, currentSequence: 1 });
      setInstructions([{}, {}]);
      const waybills = await fetchWaybillsByLayoutId(layoutId);
      setWaybills(waybills);
      if (onCancel) onCancel();
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Validation errors:", err.flatten().fieldErrors);
        alert("Please fix the form errors before submitting.");
        // Optional: display errors in UI
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium pb-1">Waybill Info</h2>
      <Card>
        <CardContent className="space-y-2">
          <label htmlFor={'carType'} className="block text-sm font-medium mb-1">Car Type</label>
          <Select
            value={waybillData.carType || ''}
            onValueChange={(val) => setWaybillData({ ...waybillData, carType: val })}
          >
            <SelectTrigger id={'carType'} className='bg-white'>
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
          <Button className="bg-slate-300 text-black border border-black w-full sm:w-auto sm:flex-1" 
          onClick={addInstruction}>
              Add Instruction
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-xl font-medium pb-1">Instructions</h2>
      </div>
        <InstructionsForm
          instructions={instructions}
          locations={locations}
          commodities={commodities}
          tracksByLocation={tracksByLocation}
          onChange={handleInstructionChange}
          onLocationChange={handleLocationChange}
          onRemove={removeInstruction}
        />

      <div className="flex gap-2 mt-2">
        <Button className="bg-slate-500 text-white border border-black w-full sm:w-auto sm:flex-1"
         variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="bg-slate-700 text-white border border-black w-full sm:w-auto sm:flex-1" 
          onClick={handleWaybillSubmit}>
          {waybillData?.id ? 'Update Waybill' : 'Save Waybill'}
        </Button>
      </div>
    </>
  );
}
