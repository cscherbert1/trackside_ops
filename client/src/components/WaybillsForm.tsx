// Updated client/components/WaybillForm.tsx
import { useEffect } from 'react';
import { useForm, useFieldArray, FieldArrayWithId } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WaybillSchema, WaybillInput } from '@/schemas/waybillSchema';
import { createWaybillWithInstructions, fetchWaybillsByLayoutId } from '@/services/waybillService';
import InstructionsForm from '@/components/InstructionsForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CarTypes from '@/types/carTypes';
import { Waybill } from '@/types/waybillTypes';
import { Commodity } from '@/types/commodityTypes';
import { Location } from '@/types/locationTypes';

interface WaybillFormProps {
  layoutId: number;
  locations: Location[];
  commodities: Commodity[];
  setWaybills: (waybills: Waybill[]) => void;
  initialWaybill?: Waybill | null;
  onCancel?: () => void;
}

export default function WaybillForm({ layoutId, locations, commodities, setWaybills, initialWaybill, onCancel }: WaybillFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<WaybillInput>({
    resolver: zodResolver(WaybillSchema),
    defaultValues: {
      carType: '',
      repeating: false,
      rareWaybill: false,
      currentSequence: 1,
      layoutId,
      instructions: [{ commodityId: undefined, locationId: undefined, tat: '' }, { commodityId: undefined, locationId: undefined, tat: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions'
  });

  useEffect(() => {
    if (initialWaybill) {
      reset(initialWaybill);
    }
  }, [initialWaybill, reset]);

  const onSubmit = async (data: WaybillInput) => {
    try {
      await createWaybillWithInstructions({
        ...data,
        layoutId,
        instructions: data.instructions.map((inst, idx) => ({ ...inst, sequence: idx + 1 }))
      });
      const updated = await fetchWaybillsByLayoutId(layoutId);
      setWaybills(updated);
      reset();
      onCancel?.();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <form>
      <h2 className="text-xl font-medium pb-1">Waybill Info</h2>
      <Card className='mb-5'>
        <CardContent className="space-y-2">
          <label className="block text-sm font-medium">Car Type</label>
          <Select value={watch('carType')} onValueChange={val => setValue('carType', val)}>
            <SelectTrigger className="bg-white">
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
          {errors.carType && <p className="text-red-500 text-sm">{errors.carType.message}</p>}

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('repeating')} /> Repeating
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('rareWaybill')} /> Rare Waybill
          </label>

          <Button
            className="bg-slate-300 text-black border border-black w-full sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              if (fields.length < 6) append({ commodityId: null, locationId: null, trackId: undefined, tat: '' });
            }}
          >
            Add Instruction
          </Button>
        </CardContent>
      </Card>

      <InstructionsForm
        control={control}
        errors={errors.instructions ?? []}
        fields={fields as FieldArrayWithId<WaybillInput, 'instructions', 'id'>[]}
        remove={remove}
        locations={locations}
        commodities={commodities}
      />

      <div className="flex gap-2 mt-2">
        <Button className="bg-slate-500 text-white border border-black" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-slate-700 text-white border border-black" onClick={handleSubmit(onSubmit)}>
          {watch('id') ? 'Update Waybill' : 'Save Waybill'}
        </Button>
      </div>
    </form>
  );
}
